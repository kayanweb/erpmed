// realTimeService.ts - PostgreSQL Migration
export * from "./storage";

export function handleFirebaseQuotaExceeded(error: any) {
  console.warn("Firestore Quota stub called (system successfully migrated to PostgreSQL):", error);
}
