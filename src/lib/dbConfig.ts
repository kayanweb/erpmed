// dbConfig.ts

export type DbProvider = "FIREBASE" | "SUPABASE" | "POCKETBASE" | "APPWRITE" | "LOCAL_HOST" | "MQTT" | "SOCKET_IO_REDIS" | "NULL_DB" | "POSTGRES_PRISMA" | "POSTGRES_NEON" | "GOOGLE_CLOUD_SQL";

// Central dynamic provider setting
let currentProvider: DbProvider = (() => {
  if (typeof window === "undefined") return "POSTGRES_NEON";
  try {
    const saved = sessionStorage.getItem("active_db_provider");
    return (saved as DbProvider) || "POSTGRES_NEON";
  } catch (e) {
    return "POSTGRES_NEON";
  }
})();

export let ACTIVE_DB_PROVIDER: DbProvider = currentProvider;

export function getActiveDbProvider(): DbProvider {
  if (typeof window === "undefined") return "LOCAL_HOST";
  try {
    const saved = sessionStorage.getItem("active_db_provider");
    return (saved as DbProvider) || "LOCAL_HOST";
  } catch (e) {
    return "LOCAL_HOST";
  }
}

export function setActiveDbProvider(provider: DbProvider) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem("active_db_provider", provider);
  } catch (e) {}
  currentProvider = provider;
  ACTIVE_DB_PROVIDER = provider;
}

export const DB_PROVIDERS_CONFIG = {
  FIREBASE: {
    nameAr: "فايربيز سورس سحابي (Firebase Firestore)",
    nameEn: "Firebase Cloud Firestore",
    projectId: "silken-shell-cwjkk",
    apiKey: "AIzaSyAeVJHTeyqsQNAomTU8-UgeGb5VlN_7G7M",
    authDomain: "silken-shell-cwjkk.firebaseapp.com",
    storageBucket: "silken-shell-cwjkk.firebasestorage.app",
    appId: "1:472195323326:web:81fb86f81811329748d5ef",
    instanceType: "Native OnSnapshot",
    statusUrl: "https://firestore.googleapis.com"
  },
  SUPABASE: {
    nameAr: "سوبابيس ريل تايم (Supabase Realtime PostgreSQL)",
    nameEn: "Supabase Realtime PostgreSQL",
    supabaseUrl: "https://kayan-system.supabase.co",
    supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_supabase_key_token_etc",
    dbSchema: "public",                      // Added as requested
    realtimeChannel: "live_clinical_stream",  // Added as requested
    statusUrl: "https://kayan-system.supabase.co/rest/v1"
  },
  POCKETBASE: {
    nameAr: "بوكيت بيز إس إس إي (PocketBase Event Stream)",
    nameEn: "PocketBase Server-Sent Events",
    baseUrl: "https://kayan.pockethost.io",
    adminEmail: "",     // Added as requested
    adminPassword: "",  // Added as requested
    statusUrl: "https://kayan.pockethost.io/api/health"
  },
  NULL_DB: {
    nameAr: "وضع عدم الاتصال (Offline Local Only)",
    nameEn: "Offline Local Only Mode",
    statusUrl: ""
  },
  APPWRITE: {
    nameAr: "أب رايت (Appwrite Backend)",
    nameEn: "Appwrite Backend Service",
    endpoint: "https://cloud.appwrite.io/v1",
    projectId: "",
    apiKey: ""
  },
  LOCAL_HOST: {
    nameAr: "سيرفر المستشفى الاحتياطي (Persistent Node Server Real-time)",
    nameEn: "Hospital Router Network (Persistent Node Server)",
    intranetHost: "http://127.0.0.1:3000/api/local_hospital", // Added as requested
    wsUrl: "ws://127.0.0.1:3000/live",
    apiUrl: "http://127.0.0.1:3000/api/local_hospital",
    requestTimeout: 5000, // Added as requested
    useSecureWs: false     // Added as requested
  },
  MQTT: {
      nameAr: "MQTT (EMQX - IoT Stream)",
      nameEn: "MQTT (EMQX Cluster)",
      brokerUrl: "mqtt://127.0.0.1:1883",
      clientId: "klinik-node-01",
      statusUrl: "http://127.0.0.1:8083"
  },
  SOCKET_IO_REDIS: {
      nameAr: "Socket.io مع Redis (Realtime Pub/Sub)",
      nameEn: "Socket.io & Redis Adapter",
      serverUrl: "http://127.0.0.1:3000",
      redisUrl: "redis://127.0.0.1:6379",
      statusUrl: "http://127.0.0.1:3000/health"
  },
  POSTGRES_PRISMA: {
      nameAr: "الاستضافة المحلية (PostgreSQL + Prisma)",
      nameEn: "Local On-Premises (PostgreSQL + Prisma)",
      databaseUrl: "postgresql://postgres:password@localhost:5432/his_db",
      prismaStudioUrl: "http://localhost:5555",
      expressServer: "http://localhost:3000/api",
      statusUrl: "http://localhost:3000/health"
  },
  POSTGRES_NEON: {
      nameAr: "سحابة نيون (PostgreSQL Neon Cloud)",
      nameEn: "PostgreSQL Neon Cloud",
      databaseUrl: "postgresql://user:password@endpoint.neon.tech/db",
      statusUrl: "https://console.neon.tech/api/v2"
  },
  GOOGLE_CLOUD_SQL: {
      nameAr: "جوجل كلاود (Google Cloud SQL)",
      nameEn: "Google Cloud SQL (PostgreSQL)",
      databaseUrl: "postgresql://postgres:password@localhost:5432/his_db",
      connectionName: "",
      statusUrl: "https://console.cloud.google.com/sql"
  }
};

// After DB_PROVIDERS_CONFIG definition, check for persisted overrides
// Restored for dynamic config persistence using sessionStorage for security
if (typeof window !== "undefined") {
  Object.keys(DB_PROVIDERS_CONFIG).forEach(provider => {
    const saved = sessionStorage.getItem(`db_settings_${provider}`);
    if (saved) {
      try {
        (DB_PROVIDERS_CONFIG as any)[provider] = JSON.parse(saved);
      } catch(e) {}
    }
  });
}

export const switchEnvironment = (provider: DbProvider, newSettings: any = {}) => {
  if (["FIREBASE", "SUPABASE", "POCKETBASE", "APPWRITE", "LOCAL_HOST", "MQTT", "SOCKET_IO_REDIS", "NULL_DB", "POSTGRES_PRISMA", "POSTGRES_NEON", "GOOGLE_CLOUD_SQL"].includes(provider)) {
    setActiveDbProvider(provider);
    if (newSettings && Object.keys(newSettings).length > 0) {
      const targetConfig: any = DB_PROVIDERS_CONFIG[provider];
      DB_PROVIDERS_CONFIG[provider] = { ...targetConfig, ...newSettings };
      // Persist these custom settings in sessionStorage for Zero-Cache security
      if (typeof window !== "undefined") {
        sessionStorage.setItem(`db_settings_${provider}`, JSON.stringify(DB_PROVIDERS_CONFIG[provider]));
      }
    }
    return true;
  }
  return false;
};

// Global dynamic Bilingual Alert Ribbon generator for instant database connectivity faults
if (typeof window !== "undefined") {
  window.addEventListener("bilingual-alert", (e: any) => {
    const { messageAr, messageEn } = e.detail || {};
    
    let alertDiv = document.getElementById("universal-bilingual-alert-ribbon");
    if (!alertDiv) {
      alertDiv = document.createElement("div");
      alertDiv.id = "universal-bilingual-alert-ribbon";
      alertDiv.style.position = "fixed";
      alertDiv.style.top = "20px";
      alertDiv.style.left = "50%";
      alertDiv.style.transform = "translateX(-50%)";
      alertDiv.style.zIndex = "999999";
      alertDiv.style.width = "90%";
      alertDiv.style.maxWidth = "650px";
      alertDiv.style.background = "#fff1f2"; // soft rose
      alertDiv.style.border = "2px solid #e11d48"; // rose-600
      alertDiv.style.padding = "16px";
      alertDiv.style.borderRadius = "16px";
      alertDiv.style.boxShadow = "0 20px 25px -5px rgb(0 0 0 / 0.15), 0 8px 10px -6px rgb(0 0 0 / 0.15)";
      alertDiv.style.fontFamily = "system-ui, -apple-system, sans-serif";
      alertDiv.style.boxSizing = "border-box";
      
      document.body.appendChild(alertDiv);
    }
    
    alertDiv.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 8px;" dir="rtl">
        <div style="display: flex; align-items: start; justify-content: space-between; gap: 12px;">
          <div style="color: #9f1239; font-weight: 800; font-size: 14px; display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 16px;">⚠️</span>
            <span>خطأ البنية وسيرفر البيانات / Cloud & Database Connection Error</span>
          </div>
          <button id="close-bilingual-ribbon-btn" style="background: none; border: none; cursor: pointer; color: #f43f5e; font-weight: 900; font-size: 18px; padding: 0 4px; line-height: 1;">✕</button>
        </div>
        <div style="color: #4c0519; font-size: 13px; font-weight: bold; line-height: 1.6; text-align: right; margin-top: 4px;">
          ${messageAr}
        </div>
        <div style="color: #4c0519; font-size: 12px; font-weight: 500; line-height: 1.6; text-align: left; direction: ltr; margin-top: 4px;">
          ${messageEn}
        </div>
      </div>
    `;

    // Attach click handler to close button natively
    const closeBtn = alertDiv.querySelector("#close-bilingual-ribbon-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        alertDiv?.remove();
      });
    }
  });
}
