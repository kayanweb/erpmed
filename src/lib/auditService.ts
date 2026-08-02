import { subscribeToClinicalData, saveDataPermanently } from "./realTimeService";

export interface AuditEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string; // e.g. "VIEW_PATIENT", "UPDATE_VITALS", "TRANSITION_STAGE"
  module: string; // e.g. "CLINICAL", "NURSING", "IT"
  detailsAr: string;
  detailsEn: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

const AUDIT_COLLECTION = "hospital_audit_trail";

/**
 * Logs a new audit entry
 */
export async function logAudit(entry: Omit<AuditEntry, "id" | "timestamp" | "ipAddress" | "userAgent">) {
  const auditId = `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const newEntry: AuditEntry = {
    ...entry,
    id: auditId,
    timestamp: new Date().toISOString(),
    // These would ideally come from the server in a real app
    ipAddress: "127.0.0.1", 
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Node.js"
  };
  await saveDataPermanently(AUDIT_COLLECTION, newEntry);
}

/**
 * Sync audit trail for admin view
 */
export function syncAuditTrail(onData: (entries: AuditEntry[]) => void) {
  return subscribeToClinicalData<AuditEntry>(
    AUDIT_COLLECTION,
    (entries) => {
      const sorted = [...entries].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
      onData(sorted.slice(0, 200));
    },
    (err) => console.error("Audit trail sync error:", err)
  );
}
