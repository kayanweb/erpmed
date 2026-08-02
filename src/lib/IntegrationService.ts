/**
 * Enterprise Integration Service (WSD <-> HIS)
 * 
 * Provides deep integration APIs between the WSD (administrative) 
 * and HIS (clinical) portals without merging their UIs.
 */

// 1. Shared Identity Service
export const IdentityService = {
  getUnifiedUser: (staffId: string, wsdUsers: any[], hisStaff: any[]) => {
    const wsdProfile = wsdUsers.find(u => u.staffId === staffId);
    const hisProfile = hisStaff.find(s => s.id === staffId);
    return {
      ...wsdProfile,
      clinicalData: hisProfile || null,
      unifiedPermissions: {
        wsd: wsdProfile?.permissions || [],
        his: hisProfile?.clinicalRoles || []
      }
    };
  }
};

// 2. Organization Integration
export const OrganizationService = {
  mapWsdDeptToHisWard: (wsdDeptId: string) => {
    const mapping: Record<string, string[]> = {
      "dept_internal_medicine": ["ward_internal_m", "ward_internal_f"],
      "dept_surgery": ["ward_surg_m", "ward_surg_f", "icu"],
      "dept_pediatrics": ["nicu", "picu", "ward_pediatrics"]
    };
    return mapping[wsdDeptId] || [];
  },
  getUnifiedCapacity: (hisBeds: any[], wsdStaffing: any[]) => {
    // Merge clinical bed capacity with administrative staffing levels
    return { beds: hisBeds.length, staff: wsdStaffing.length };
  }
};

// 3. Workforce Integration
export const WorkforceService = {
  getClinicalStaffOnDuty: (wardId: string, currentShift: string, wsdRoster: any[]) => {
    // Get WSD roster for a specific HIS ward and shift
    return wsdRoster.filter(r => r.wardId === wardId && r.shift === currentShift);
  },
  syncAttendanceToClinical: (staffId: string, status: string) => {
    // When WSD marks attendance, update HIS clinical availability
    console.log(`[Integration] Staff ${staffId} attendance changed to ${status}. Updating HIS availability.`);
    return status === "present";
  }
};

// 4. Clinical Operation Integration
export const ClinicalOpsService = {
  onPatientAdmission: (patientId: string, deptId: string, triggerWsdTasks: (tasks: any) => void) => {
    console.log(`[Integration] Patient ${patientId} admitted to ${deptId}`);
    // Trigger administrative tasks in WSD
    triggerWsdTasks([
      { type: "bed_assignment", patientId, deptId },
      { type: "insurance_verification", patientId },
      { type: "dietary_setup", patientId }
    ]);
  }
};

// 5. Inventory Integration
export const InventoryService = {
  requestClinicalSupplies: (wardId: string, items: any[], notifyWsdWarehouse: (req: any) => void) => {
    console.log(`[Integration] Ward ${wardId} requesting supplies from WSD Warehouse`);
    notifyWsdWarehouse({ source: "HIS", wardId, items, timestamp: new Date() });
  },
  checkStockAvailability: (itemId: string, wsdInventory: any[]) => {
    const item = wsdInventory.find(i => i.id === itemId);
    return item ? item.quantity : 0;
  }
};

// 6. Notification & Audit Integration
export const SystemEventBus = {
  publish: (portal: "HIS" | "WSD", eventType: string, payload: any, logAudit: (log: any) => void) => {
    const event = {
      id: crypto.randomUUID(),
      portal,
      eventType,
      payload,
      timestamp: new Date().toISOString()
    };
    
    // Unified Audit Logging
    logAudit({
      action: eventType,
      portal,
      user: payload.userId || "system",
      details: payload
    });
    
    // Dispatch standard event for decoupled UIs to listen
    window.dispatchEvent(new CustomEvent(`enterprise_integration_${eventType}`, { detail: event }));
  }
};

export const IntegrationEngine = {
  IdentityService,
  OrganizationService,
  WorkforceService,
  ClinicalOpsService,
  InventoryService,
  SystemEventBus
};
