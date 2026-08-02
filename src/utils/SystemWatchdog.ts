export class SystemWatchdog {
  static init() {
    window.addEventListener('error', (event) => {
      console.error("[SystemWatchdog] Uncaught Error:", event.error);
      // Auto-recovery attempt or logging
      this.logError('Uncaught Error', event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error("[SystemWatchdog] Unhandled Promise Rejection:", event.reason);
      this.logError('Unhandled Rejection', event.reason);
    });
  }

  static logError(type: string, error: any) {
    try {
      const errors = JSON.parse(localStorage.getItem('sys_error_logs') || '[]');
      errors.unshift({ timestamp: new Date().toISOString(), type, error: String(error) });
      if (errors.length > 50) errors.pop();
      localStorage.setItem('sys_error_logs', JSON.stringify(errors));
    } catch(e) {}
  }
}
