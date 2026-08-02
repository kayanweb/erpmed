// Safe storage wrapper to prevent SecurityErrors in restricted iframes
const createMockStorage = () => {
  let data: Record<string, string> = {};
  return {
    getItem: (key: string) => data[key] || null,
    setItem: (key: string, value: string) => { data[key] = String(value); },
    removeItem: (key: string) => { delete data[key]; },
    clear: () => { data = {}; },
    key: (index: number) => Object.keys(data)[index] || null,
    get length() { return Object.keys(data).length; }
  } as Storage;
};

const patchStorage = (storageName: 'localStorage' | 'sessionStorage') => {
  try {
    if (typeof window !== 'undefined' && window[storageName]) {
      const storage = window[storageName];
      storage.getItem('test'); // Test access
      return; // If it succeeds, no need to patch
    }
  } catch (e) {
    // Access denied
  }

  try {
    Object.defineProperty(window, storageName, {
      value: createMockStorage(),
      writable: true,
      configurable: true
    });
  } catch (e) {
    console.warn(`Could not patch ${storageName}:`, e);
  }
};

patchStorage('localStorage');
patchStorage('sessionStorage');
