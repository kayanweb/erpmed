
import { firestoreService } from '../lib/firestoreService';

export interface AuditLog {
  id?: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  ip?: string;
  userAgent?: string;
}

export class AuditLogger {
  static async log(log: Omit<AuditLog, 'timestamp'>) {
    const fullLog: AuditLog = {
      ...log,
      timestamp: new Date().toISOString(),
    };

    console.log(`[AuditLog] ${fullLog.module} | ${fullLog.action} | ${fullLog.userId}`);

    try {
      // Try to save to Firestore if available
      await firestoreService.add('system_audit_logs', fullLog);
    } catch (e) {
      // Fallback to local storage for offline durability
      const localLogs = JSON.parse(localStorage.getItem('audit_logs_backup') || '[]');
      localLogs.unshift(fullLog);
      if (localLogs.length > 500) localLogs.pop();
      localStorage.setItem('audit_logs_backup', JSON.stringify(localLogs));
    }
  }

  static getLocalLogs(): AuditLog[] {
    return JSON.parse(localStorage.getItem('audit_logs_backup') || '[]');
  }
}
