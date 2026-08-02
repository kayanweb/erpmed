import { getActiveDbProvider } from "./dbConfig";

async function fetchWithTimeout(resource: string, options: RequestInit = {}, timeout = 60000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeout}ms`);
    }
    throw error;
  }
}

export function triggerBilingualNotification(errorMsg: string) {
  console.error("🚨 Storage Abstraction Layer Error:", errorMsg);
  if (errorMsg.includes("Failed to fetch")) { return; }
  if (typeof window !== "undefined") {
    const friendlyAr = `⚠️ خطأ في الاتصال بالسيرفر: ${errorMsg}. يرجى المحاولة لاحقاً.`;
    const friendlyEn = `⚠️ Server Connection Error: ${errorMsg}. Please try again later.`;
    
    window.dispatchEvent(new CustomEvent("bilingual-alert", {
      detail: {
        messageAr: friendlyAr,
        messageEn: friendlyEn,
        raw: errorMsg
      }
    }));
  }
}

let sharedEventSource: EventSource | null = null;
const streamListeners = new Set<(event: MessageEvent) => void>();

function getSharedEventSource(): EventSource {
  if (typeof window === "undefined") {
    throw new Error("EventSource is only available in browser context");
  }

  if (!sharedEventSource) {
    sharedEventSource = new EventSource("/api/db/stream");
    sharedEventSource.onmessage = (event) => {
      streamListeners.forEach((listener) => {
        try {
          listener(event);
        } catch (e) {
          console.error("Shared EventSource listener error:", e);
        }
      });
    };
    sharedEventSource.onerror = (err) => {
      console.warn("Shared EventSource stream connection error.", err);
    };
  }
  return sharedEventSource;
}

function addStreamListener(listener: (event: MessageEvent) => void) {
  streamListeners.add(listener);
  try {
    getSharedEventSource();
  } catch (err) {
    console.warn("Failed to initialize shared EventSource:", err);
  }
}

function removeStreamListener(listener: (event: MessageEvent) => void) {
  streamListeners.delete(listener);
  if (streamListeners.size === 0 && sharedEventSource) {
    sharedEventSource.close();
    sharedEventSource = null;
  }
}

const collectionCaches = new Map<string, { data: any[]; timestamp: number }>();
const inFlightRequests = new Map<string, Promise<any[]>>();
const collectionListeners = new Map<string, Set<(data: any[]) => void>>();

// Client-side Bulk Aggregation Scheduler
const pendingSyncCollections = new Set<string>();
let bulkSyncTimeout: any = null;
const bulkSyncInFlight = new Map<string, Promise<any>>();

async function executeBulkSync() {
  const collectionsToFetch = Array.from(pendingSyncCollections);
  pendingSyncCollections.clear();
  bulkSyncTimeout = null;

  if (collectionsToFetch.length === 0) return;

  console.log(`🚀 [Client Bulk Sync] Aggregating ${collectionsToFetch.length} collections:`, collectionsToFetch);

  // We create a single promise for this batch of fetches
  const syncPromise = (async () => {
    let attempt = 0;
    const maxAttempts = 5;
    let delay = 200;

    while (attempt < maxAttempts) {
      try {
        const response = await fetchWithTimeout(`/api/db/local_host/bulk-sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ collections: collectionsToFetch })
        }, 60000);

        if (response.status === 429) {
          attempt++;
          console.warn(`[429] Rate limited on bulk-sync. Retrying in ${delay}ms (attempt ${attempt}/${maxAttempts})...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
          continue;
        }

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const json = await response.json();
        if (json.success && json.data) {
          // Populate cache for all successfully returned collections
          const now = Date.now();
          for (const col of collectionsToFetch) {
            const colData = json.data[col] || [];
            collectionCaches.set(col, { data: colData, timestamp: now });
          }
          return json.data;
        } else {
          throw new Error(json.error || "Bulk sync response failed");
        }
      } catch (err: any) {
        attempt++;
        if (attempt >= maxAttempts) {
          throw err;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
    throw new Error(`Bulk sync failed after ${maxAttempts} attempts`);
  })();

  // Map each collection in this batch to the same shared promise
  for (const col of collectionsToFetch) {
    bulkSyncInFlight.set(col, syncPromise);
  }

  try {
    const results = await syncPromise;
    // Notify all active listeners for these collections
    for (const col of collectionsToFetch) {
      const colData = results[col] || [];
      const listeners = collectionListeners.get(col);
      if (listeners) {
        listeners.forEach((listener) => {
          try {
            listener(colData);
          } catch (e) {
            console.error(`Listener update error for ${col}:`, e);
          }
        });
      }
    }
  } catch (err: any) {
    console.error("Bulk sync request execution error:", err);
    console.error(`Failed to aggregate database: ${err.message}`);
  } finally {
    for (const col of collectionsToFetch) {
      bulkSyncInFlight.delete(col);
    }
  }
}

function scheduleBulkSync(collectionName: string): Promise<any[]> {
  const cached = collectionCaches.get(collectionName);
  const now = Date.now();
  if (cached && (now - cached.timestamp < 15000)) {
    return Promise.resolve(cached.data);
  }

  // If we already have an in-flight request for this collection, return that
  if (bulkSyncInFlight.has(collectionName)) {
    return bulkSyncInFlight.get(collectionName)!.then(data => data[collectionName] || []);
  }

  pendingSyncCollections.add(collectionName);

  if (!bulkSyncTimeout) {
    bulkSyncTimeout = setTimeout(() => {
      executeBulkSync();
    }, 40); // 40ms debounce window to bundle all page load calls
  }

  // Return a promise that resolves when the cache gets populated
  return new Promise((resolve) => {
    let elapsed = 0;
    const checkInterval = setInterval(() => {
      const freshCached = collectionCaches.get(collectionName);
      if (freshCached) {
        clearInterval(checkInterval);
        resolve(freshCached.data);
      } else {
        elapsed += 10;
        if (elapsed > 10000) { // Timeout safety
          clearInterval(checkInterval);
          resolve([]);
        }
      }
    }, 10);
  });
}

// Keep fetchCollection signature compatible but route through scheduleBulkSync
async function fetchCollection(collectionName: string): Promise<any[]> {
  return scheduleBulkSync(collectionName);
}

export function subscribeToClinicalData<T>(
  collectionName: string,
  onDataUpdate: (data: T[]) => void,
  onError: (error: Error) => void
): () => void {
  if (!collectionListeners.has(collectionName)) {
    collectionListeners.set(collectionName, new Set());
  }
  const listeners = collectionListeners.get(collectionName)!;
  listeners.add(onDataUpdate as (data: any[]) => void);

  let isUnsubscribed = false;

  const loadAndNotify = async (forceRefetch = false) => {
    if (isUnsubscribed) return;

    if (forceRefetch) {
      collectionCaches.delete(collectionName);
    }

    const cached = collectionCaches.get(collectionName);
    const now = Date.now();

    if (cached && now - cached.timestamp < 15000) {
      Promise.resolve().then(() => onDataUpdate(cached.data as T[]));
      return;
    }

    try {
      const data = await scheduleBulkSync(collectionName);
      if (!isUnsubscribed) {
        queueMicrotask(() => onDataUpdate(data as T[]));
      }
    } catch (err: any) {
      console.warn(`Failed to load ${collectionName} from PostgreSQL: ${err.message}`);
      console.error(`Failed to load: ${err.message}`);
      if (onError) queueMicrotask(() => onError(err));
    }
  };

  loadAndNotify();

  const handleStreamMessage = (event: MessageEvent) => {
    if (isUnsubscribed) return;
    try {
      const updateInfo = JSON.parse(event.data);
      if (updateInfo.collectionName === collectionName) {
        console.log(`🔄 [SSE Live Update] Invalidation signal received for ${collectionName}. Refreshing...`);
        collectionCaches.delete(collectionName);
        loadAndNotify(true);
      }
    } catch (e) {
      console.error("Error parsing SSE update stream data:", e);
    }
  };

  addStreamListener(handleStreamMessage);

  return () => {
    isUnsubscribed = true;
    listeners.delete(onDataUpdate as (data: any[]) => void);
    removeStreamListener(handleStreamMessage);
    console.log(`🧹 [Stream Cleaned] Connection closed for PostgreSQL:${collectionName}. RAM cleared.`);
  };
}

export async function saveDataPermanently<T extends { id: string }>(
  collectionName: string,
  dataPayload: T
): Promise<{ success: boolean; error?: string }> {
  const enrichedData = {
    ...dataPayload,
    updatedAt: new Date().toISOString(),
    savedBy: "PostgreSQL_User",
  };

  const cached = collectionCaches.get(collectionName);
  if (cached) {
    const updatedData = [...cached.data];
    const index = updatedData.findIndex((item) => item.id === enrichedData.id);
    if (index !== -1) {
      updatedData[index] = enrichedData;
    } else {
      updatedData.push(enrichedData);
    }
    collectionCaches.set(collectionName, { data: updatedData, timestamp: Date.now() });

    const listeners = collectionListeners.get(collectionName);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          queueMicrotask(() => listener(updatedData));
        } catch (e) {
          console.error("Optimistic update callback error:", e);
        }
      });
    }
  }

  let attempt = 0;
  const maxAttempts = 3;
  let delay = 200;

  while (attempt < maxAttempts) {
    try {
      console.log(
        `💾 [Permanent Save] Connecting to PostgreSQL API (attempt ${attempt + 1}/${maxAttempts}) to save in table: ${collectionName}`
      );
      const response = await fetchWithTimeout(`/api/db/local_host/${collectionName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enrichedData),
      }, 60000);

      if (response.status === 429) {
        attempt++;
        console.warn(`[429] Rate limited on save to '${collectionName}'. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }

      if (!response.ok) {
        throw new Error(`Server rejected request with status: ${response.status}`);
      }

      const result = await response.json();
      return { success: !!result.success };
    } catch (err: any) {
      attempt++;
      if (attempt >= maxAttempts) {
        console.warn(`PostgreSQL Sync skipped: ${err.message}`);
        return { success: false, error: err.message };
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
  return { success: false, error: "Max attempts exceeded" };
}

export async function saveDataPermanentlyBulk<T extends { id: string }>(
  collectionName: string,
  payloads: T[]
): Promise<{ success: boolean; error?: string }> {
  if (!payloads || payloads.length === 0) {
    return { success: true };
  }

  const enrichedPayloads = payloads.map(p => ({
    ...p,
    updatedAt: new Date().toISOString(),
    savedBy: "PostgreSQL_User",
  }));

  const cached = collectionCaches.get(collectionName);
  if (cached) {
    const updatedData = [...cached.data];
    enrichedPayloads.forEach((enriched) => {
      const index = updatedData.findIndex((item) => item.id === enriched.id);
      if (index !== -1) {
        updatedData[index] = enriched;
      } else {
        updatedData.push(enriched);
      }
    });
    collectionCaches.set(collectionName, { data: updatedData, timestamp: Date.now() });

    const listeners = collectionListeners.get(collectionName);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(updatedData);
        } catch (e) {
          console.error("Optimistic bulk update callback error:", e);
        }
      });
    }
  }

  let attempt = 0;
  const maxAttempts = 3;
  let delay = 200;

  while (attempt < maxAttempts) {
    try {
      console.log(
        `💾 [Bulk Permanent Save] Connecting to PostgreSQL API (attempt ${attempt + 1}/${maxAttempts}) to save ${payloads.length} items in table: ${collectionName}`
      );
      const response = await fetchWithTimeout(`/api/db/local_host/${collectionName}/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enrichedPayloads),
      }, 60000);

      if (response.status === 429) {
        attempt++;
        console.warn(`[429] Rate limited on bulk save to '${collectionName}'. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }

      if (!response.ok) {
        throw new Error(`Server rejected request with status: ${response.status}`);
      }

      const result = await response.json();
      return { success: !!result.success };
    } catch (err: any) {
      attempt++;
      if (attempt >= maxAttempts) {
        console.warn(`PostgreSQL Bulk Sync skipped: ${err.message}`);
        return { success: false, error: err.message };
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
  return { success: false, error: "Max attempts exceeded" };
}

export async function deleteDataPermanently(
  collectionName: string,
  recordId: string
): Promise<{ success: boolean; error?: string }> {
  const cached = collectionCaches.get(collectionName);
  if (cached) {
    const updatedData = cached.data.filter((item) => item.id !== recordId);
    collectionCaches.set(collectionName, { data: updatedData, timestamp: Date.now() });

    const listeners = collectionListeners.get(collectionName);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(updatedData);
        } catch (e) {
          console.error("Optimistic delete callback error:", e);
        }
      });
    }
  }

  let attempt = 0;
  const maxAttempts = 3;
  let delay = 200;

  while (attempt < maxAttempts) {
    try {
      console.log(`🗑️ [Permanent Delete] Removing from PostgreSQL: ${collectionName}/${recordId}`);
      const response = await fetchWithTimeout(`/api/db/local_host/${collectionName}/${recordId}`, {
        method: "DELETE",
      }, 60000);

      if (response.status === 429) {
        attempt++;
        console.warn(`[429] Rate limited on delete from '${collectionName}'. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }

      if (!response.ok) {
        throw new Error(`Server returned error code: ${response.status}`);
      }

      const result = await response.json();
      return { success: !!result.success };
    } catch (err: any) {
      attempt++;
      if (attempt >= maxAttempts) {
        console.warn(`PostgreSQL Delete skipped: ${err.message}`);
        return { success: false, error: err.message };
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
  return { success: false, error: "Max attempts exceeded" };
}

export async function fetchDocumentById<T>(collectionName: string, id: string): Promise<T | null> {
  try {
    const data = await fetchCollection(collectionName);
    return data.find((x: any) => x.id === id) || null;
  } catch (err: any) {
    console.error(`Error fetching document ${collectionName}/${id}:`, err);
    return null;
  }
}

export * from "./firestoreService";
