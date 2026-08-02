import React, { lazy, ComponentType } from 'react';

export const lazyWithRetry = (componentImport: () => Promise<{ default: ComponentType<any> }>) => {
  return lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        console.warn("Chunk loading error detected, attempting to refresh page...", error);
        window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
        window.location.reload();
        // Return a promise that never resolves so we wait for the reload
        return new Promise<{ default: ComponentType<any> }>(() => {}); 
      }

      console.error("Failed to load module after retry:", error);
      return {
        default: () => (
          <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 m-4 h-full">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">تعذر تحميل الوحدة (Module Load Error)</h2>
            <p className="text-sm text-slate-600 mb-6 text-center max-w-md">حدث خطأ أثناء تحميل هذه الوحدة، قد يكون بسبب تحديث النظام أو مشكلة في الشبكة.</p>
            <button 
              onClick={() => { window.sessionStorage.setItem('page-has-been-force-refreshed', 'false'); window.location.reload(); }}
              className="px-6 py-2.5 bg-sky-600 text-white rounded-lg shadow-sm text-sm font-semibold hover:bg-sky-700 transition-colors"
            >
              إعادة تحميل النظام (Reload System)
            </button>
          </div>
        )
      };
    }
  });
};
