import { toast } from "sonner";
import { useFirestoreSync, useFirestoreSetting } from "../hooks/useFirestoreSync";
import { 
  FormTemplate,
  SavedRecord,
  HospitalBed,
  ClinicalFormInstance,
  HISVisit,
  HISInsuranceProvider,
  HISChargeItem,
  Ward,
  HISAdmissionRecord,
  Patient,
  HISEncounter,
  EncounterType,
  EncounterStatus,
  PatientStatus
} from "../types";
import { 
  syncPatients, 
  savePatient, 
  deletePatient as apiDeletePatient, 
  syncPrescriptions, 
  savePrescription, 
  syncInvoices, 
  saveInvoice,
  saveHISNotification,
  syncSystemUsers,
  syncDutyTasks,
  syncClinicalRecords,
  getSetting,
  syncSetting,
  saveSetting,
  saveDataPermanently
} from "../lib/storage";
import React, { createContext, useContext, ReactNode, useEffect, useState, useMemo, useCallback } from "react";

// Internal HIS types
export type PatientJourneyStep = {
  id: string;
  patientId: string;
  department: string;
  status: string;
  startTime: string;
  endTime?: string;
  actionBy: string;
  notesEn?: string;
  notesAr?: string;
};

export type HISDepartment = {
  id: string;
  nameEn: string;
  nameAr: string;
  type: 'clinical' | 'administrative' | 'support';
  building?: string;
  floor?: string;
  manager?: string;
};

export type HISAuditLog = {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  ip?: string;
  device?: string;
  department?: string;
  reason?: string;
};

export type HISClinic = {
  id: string;
  nameEn: string;
  nameAr: string;
  departmentId: string;
  location?: string;
};

export type InventoryItem = {
  id: string;
  nameEn: string;
  nameAr: string;
  type: "medication" | "consumable";
  stockMain: number;
  stockSub: number;
  unit: string;
  price: number;
  scientificName?: string;
  category?: string;
  isHighAlert?: boolean;
  isNarcotic?: boolean;
  minStock?: number;
  maxStock?: number;
  batches?: {
    batchNo: string;
    expiryDate: string;
    qty: number;
  }[];
  alternatives?: string[];
};

export type PatientConsumable = {
  id: string;
  patientId: string;
  itemId: string;
  itemNameEn: string;
  itemNameAr: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
  date: string;
  status: "pending" | "billed";
};

export type HISCharge = {
  id: string;
  patientId: string;
  patientName: string;
  serviceId: string;
  serviceName: string;
  category: "lab" | "radiology" | "medication" | "procedure" | "consultation" | "room" | "other";
  amount: number;
  date: string;
  status: "pending" | "billed" | "cancelled" | "ordered" | "coded";
  orderId?: string;
  staffId: string;
};

export type HISClaim = {
  id: string;
  patientId: string;
  insuranceId: string;
  amount: number;
  date: string;
  status: "draft" | "submitted" | "paid" | "denied";
  charges: string[]; // List of Charge IDs
};

export type HISLabResult = {
  id: string;
  orderId: string;
  patientId: string;
  testName: string;
  category: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag: "normal" | "high" | "low" | "critical";
  status: "preliminary" | "final" | "corrected";
  performedBy: string;
  verifiedBy?: string;
  date: string;
  notes?: string;
};

export type HISRadiologyReport = {
  id: string;
  orderId: string;
  patientId: string;
  studyName: string;
  modality: string;
  findings: string;
  impression: string;
  technicianId: string;
  radiologistId: string;
  status: "draft" | "final" | "corrected";
  date: string;
  images?: string[];
};

export type Prescription = {
  id: string;
  patientId: string;
  medication: string;
  dose: string;
  qty: number;
  status: "pending" | "dispensed" | "active" | "not_given" | "discontinued" | "administered";
  date: string;
  // Extended fields for structured data and exceptions
  doseNum?: string;
  doseUnit?: string;
  route?: string;
  frequency?: string;
  orderType?: string;
  prnReason?: string;
  durationDays?: number;
  startDate?: string;
  startTime?: string;
  specialInstructions?: string;
  prescriberId?: string;
  holdReason?: string;
  discontinueReason?: string;
};

export type Invoice = {
  id: string;
  patientId: string;
  amount: number;
  status: "unpaid" | "paid";
  date: string;
};

export type HISReferral = {
  id: string;
  patientId: string;
  patientName: string;
  patientMRN: string;
  fromDepartment: string;
  toDepartment: string;
  referringDoctor: string;
  reason: string;
  priority: "ROUTINE" | "URGENT" | "STAT";
  status: "pending" | "accepted" | "in_progress" | "completed" | "rejected";
  diagnosis?: string;
  notes?: string;
  date: string;
};

export type MasterDataEntry = {
  id: string;
  category: string;
  valueEn: string;
  valueAr: string;
  isOfficial: boolean;
  status: "pending" | "approved" | "rejected";
  createdBy: string;
  department?: string;
  module?: string;
  screen?: string;
  fieldName?: string;
  date: string;
  time: string;
  useCount: number;
  hospital?: string;
  branch?: string;
};

interface HISState {
  patients: Patient[];
  addPatient: (data: Omit<Patient, "id" | "mrn" | "status">) => Promise<string>;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  updatePatientStatus: (id: string, status: Patient["status"]) => void;

  masterData: MasterDataEntry[];
  addMasterData: (entry: Omit<MasterDataEntry, "id" | "date" | "time" | "useCount" | "status" | "isOfficial">) => void;
  updateMasterDataStatus: (id: string, status: MasterDataEntry["status"], isOfficial?: boolean) => void;
  deleteMasterData: (id: string) => void;

  prescriptions: Prescription[];
  addPrescription: (p: Prescription) => void;
  dispensePrescription: (prescriptionId: string, staffId: string) => Promise<void>;
  updatePrescriptionStatus: (id: string, status: Prescription["status"], extra?: Partial<Prescription>) => void;

  invoices: Invoice[];
  addInvoice: (i: Invoice) => void;
  updateInvoiceStatus: (id: string, status: Invoice["status"]) => void;

  activePatient: Patient | null;
  setActivePatient: (p: Patient | null) => void;
  
  admissionRequests: any[];
  setAdmissionRequests: React.Dispatch<React.SetStateAction<any[]>>;
  
  createAdmissionRequest: (request: any) => Promise<void>;
  bedMap: Record<string, any>;
  setBedMap: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  
  erQueue: any[];
  setErQueue: React.Dispatch<React.SetStateAction<any[]>>;

  // Infrastructure Data
  beds: HospitalBed[];
  setBeds: React.Dispatch<React.SetStateAction<HospitalBed[]>>;
  wards: Ward[];
  setWards: React.Dispatch<React.SetStateAction<Ward[]>>;
  admissions: HISAdmissionRecord[];
  setAdmissions: React.Dispatch<React.SetStateAction<HISAdmissionRecord[]>>;
  assignBed: (admission: HISAdmissionRecord) => void;
  departments: HISDepartment[];
  setDepartments: React.Dispatch<React.SetStateAction<HISDepartment[]>>;
  clinics: HISClinic[];
  setClinics: React.Dispatch<React.SetStateAction<HISClinic[]>>;
  auditLogs: HISAuditLog[];
  logAudit: (log: Omit<HISAuditLog, "id" | "timestamp" | "userId" | "userName">) => void;
  getSetting: (key: string) => Promise<any>;
  saveSetting: (key: string, value: any) => Promise<void>;
  syncSetting: (key: string, callback: (data: any) => void) => () => void;

  // Expanded Administrative Data
  systemUsers: any[];
  dutyTasks: any[];
  clinicalRecords: any[];
  cpoeOrders: any[];
  setCpoeOrders: React.Dispatch<React.SetStateAction<any[]>>;

  encounters: HISEncounter[];
  setEncounters: React.Dispatch<React.SetStateAction<HISEncounter[]>>;

  surgeries: any[];
  addSurgery: (s: any) => Promise<void>;
  updateSurgery: (id: string, updates: any) => Promise<void>;
  
  marRecords: any[];
  addMarRecord: (m: any) => Promise<void>;
  administerMedication: (marId: string, staffId: string) => Promise<void>;

  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  addConsumableToPatient: (patientId: string, item: InventoryItem, qty: number) => void;
  rosterWishes: any[];
  setRosterWishes: React.Dispatch<React.SetStateAction<any[]>>;
  patientJourneys: PatientJourneyStep[];
  setPatientJourneys: React.Dispatch<React.SetStateAction<PatientJourneyStep[]>>;
  addJourneyStep: (step: Omit<PatientJourneyStep, "id" | "startTime">) => void;
  
  queues: any[];
  setQueues: React.Dispatch<React.SetStateAction<any[]>>;
  addToQueue: (patientId: string, departmentId: string, priority?: number) => Promise<void>;
  updateQueueStatus: (entryId: string, status: "waiting" | "calling" | "in_consultation" | "finished" | "cancelled") => Promise<void>;

  vitalSigns: any[];
  addVitalSigns: (vitals: any) => Promise<void>;

  charges: HISCharge[];
  addCharge: (charge: Omit<HISCharge, "id" | "date" | "status">) => Promise<void>;
  claims: HISClaim[];
  addClaim: (claim: Omit<HISClaim, "id" | "date" | "status">) => Promise<void>;

  labResults: HISLabResult[];
  addLabResult: (result: Omit<HISLabResult, "id" | "date" | "status">) => Promise<void>;

  radiologyReports: HISRadiologyReport[];
  addRadiologyReport: (report: Omit<HISRadiologyReport, "id" | "date" | "status">) => Promise<void>;

  referrals: HISReferral[];
  addReferralOrder: (referral: Omit<HISReferral, "id" | "date" | "status">) => void;

  visits: HISVisit[];
  addVisit: (visit: Omit<HISVisit, "id" | "startTime" | "status" | "history">) => Promise<string>;
  startEncounter: (patientId: string, type: EncounterType, data: Partial<HISEncounter>) => Promise<string | null>;
  dischargePatient: (visitId: string) => Promise<void>;
  updateVisit: (id: string, updates: Partial<HISVisit>) => Promise<void>;
  addOrder: (order: any) => Promise<void>;
  addCPOEOrder: (order: any) => Promise<void>;
  addClinicalNote: (note: any) => Promise<void>;
  generateMRN: () => string;
  generateVisitNumber: (type: EncounterType) => string;
  findPatient: (query: string) => Patient[];
  mergePatients: (targetId: string, sourceIds: string[]) => Promise<void>;

  insuranceProviders: HISInsuranceProvider[];
  chargeItems: HISChargeItem[];

  language: "ar" | "en";
  currentUser: any;
  activeUser?: any;
  addAuditLog?: any;
}

const HISContext = createContext<HISState | undefined>(undefined);

const EMPTY_ARRAY: any[] = [];
const EMPTY_OBJECT: any = {};

export function HISProvider({ children, isLoggedIn, language = "ar", currentUser = null }: { children: ReactNode, isLoggedIn: boolean, language?: "ar" | "en", currentUser?: any }) {
  const [patients, setPatients] = useFirestoreSync<Patient>(syncPatients, EMPTY_ARRAY);
  const safePatients = Array.isArray(patients) ? patients : EMPTY_ARRAY;
  const [prescriptions, setPrescriptions] = useFirestoreSync<Prescription>(syncPrescriptions, EMPTY_ARRAY);
  const safePrescriptions = Array.isArray(prescriptions) ? prescriptions : EMPTY_ARRAY;
  const [invoices, setInvoices] = useFirestoreSync<Invoice>(syncInvoices, EMPTY_ARRAY);
  const safeInvoices = Array.isArray(invoices) ? invoices : EMPTY_ARRAY;
  
  const [systemUsersRaw] = useFirestoreSync<any>(syncSystemUsers, EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [dutyTasksRaw] = useFirestoreSync<any>(syncDutyTasks, EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [clinicalRecordsRaw] = useFirestoreSync<any>(syncClinicalRecords, EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  
  const [activePatient, setActivePatient] = useState<Patient | null>(null);

  const [admissionRequestsRaw, setAdmissionRequestsRaw] = useFirestoreSetting<any[]>(syncSetting, 'his_admission_requests', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [bedMapRaw, setBedMapRaw] = useFirestoreSetting<Record<string, any>>(syncSetting, 'his_bed_map', EMPTY_OBJECT, EMPTY_ARRAY, isLoggedIn);
  const [bedsRaw, setBedsRaw] = useFirestoreSetting<HospitalBed[]>(syncSetting, 'his_beds', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [wardsRaw, setWardsRaw] = useFirestoreSetting<Ward[]>(syncSetting, 'his_wards', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [admissionsRaw, setAdmissionsRaw] = useFirestoreSetting<HISAdmissionRecord[]>(syncSetting, 'his_admissions', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [departmentsRaw, setDepartmentsRaw] = useFirestoreSetting<HISDepartment[]>(syncSetting, 'his_departments', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [clinicsRaw, setClinicsRaw] = useFirestoreSetting<HISClinic[]>(syncSetting, 'his_clinics', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [erQueueRaw, setErQueueRaw] = useFirestoreSetting<any[]>(syncSetting, 'his_er_queue', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [encountersRaw, setEncountersRaw] = useFirestoreSetting<HISEncounter[]>(syncSetting, 'his_encounters', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [cpoeOrdersRaw, setCpoeOrdersRaw] = useFirestoreSetting<any[]>(syncSetting, 'his_cpoe_orders', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [surgeriesRaw, setSurgeriesRaw] = useFirestoreSetting<any[]>(syncSetting, 'surgical_schedules', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [inventoryRaw, setInventoryRaw] = useFirestoreSetting<InventoryItem[]>(syncSetting, 'his_inventory', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [masterDataRaw, setMasterDataRaw] = useFirestoreSetting<MasterDataEntry[]>(syncSetting, 'his_master_data', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [rosterWishesRaw, setRosterWishesRaw] = useFirestoreSetting<any[]>(syncSetting, 'his_roster_wishes', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [patientJourneysRaw, setPatientJourneysRaw] = useFirestoreSetting<PatientJourneyStep[]>(syncSetting, 'his_patient_journeys', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [auditLogsRaw, setAuditLogsRaw] = useFirestoreSetting<HISAuditLog[]>(syncSetting, 'his_audit_logs', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [queues, setQueues] = useFirestoreSetting<any[]>(syncSetting, 'his_queues', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);
  const [referralsRaw, setReferralsRaw] = useFirestoreSetting<HISReferral[]>(syncSetting, 'his_referrals', EMPTY_ARRAY, EMPTY_ARRAY, isLoggedIn);

  const [vitalSigns, setVitalSigns] = useState<any[]>([]);
  const [marRecords, setMarRecords] = useState<any[]>([]);

  const [charges, setCharges] = useState<HISCharge[]>([]);
  const [claims, setClaims] = useState<HISClaim[]>([]);
  const [labResults, setLabResults] = useState<HISLabResult[]>([]);
  const [radiologyReports, setRadiologyReports] = useState<HISRadiologyReport[]>([]);
  const [visits, setVisits] = useState<HISVisit[]>([]);
  const [insuranceProviders, setInsuranceProviders] = useState<HISInsuranceProvider[]>([]);
  const [chargeItems, setChargeItems] = useState<HISChargeItem[]>([]);

  const logAudit = useCallback((log: Omit<HISAuditLog, "id" | "timestamp" | "userId" | "userName">) => {
    const newLog: HISAuditLog = {
      ...log,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || "unknown",
      userName: currentUser?.name || "System"
    };
    // Save to the persistent logs collection instead of a single settings entry
    saveDataPermanently('his_audit_logs', newLog).catch(err => console.error("Cloud audit log error:", err));
  }, [currentUser]);

  // --- CORE UTILITIES (MOVE UP TO PREVENT USED BEFORE DEFINITION) ---
  const generateMRN = useCallback(() => {
    const year = new Date().getFullYear();
    const count = safePatients.length + 1;
    return `MRN-${year}-${count.toString().padStart(6, '0')}`;
  }, [safePatients]);

  const generateVisitNumber = useCallback((type: EncounterType) => {
    const prefix = type === 'emergency' ? 'ER' : type === 'inpatient' ? 'IP' : 'OP';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `VN-${prefix}-${timestamp}-${random}`;
  }, []);

  const updatePatient = useCallback((id: string, updates: Partial<Patient>) => {
    let oldVal: any = null;
    setPatients(prev => prev.map(p => {
      if (p.id === id) {
        oldVal = { ...p };
        return { ...p, ...updates };
      }
      return p;
    }));
    
    const patient = safePatients.find(p => p.id === id);
    if (patient) {
      const hasChanged = Object.keys(updates).some(key => patient[key as keyof Patient] !== (updates as any)[key]);
      if (hasChanged) {
        savePatient({ ...patient, ...updates }).catch(err => console.error("Cloud patient save error:", err));
        logAudit({
          action: 'UPDATE',
          entityType: 'PATIENT',
          entityId: id,
          oldValue: oldVal,
          newValue: { ...oldVal, ...updates }
        });
      }
    }
  }, [setPatients, safePatients, logAudit]);

  // --- END CORE UTILITIES ---

  useEffect(() => {
    if (!isLoggedIn) return;
    const unsubCharges = syncSetting('his_charges', (data) => setCharges(data || []));
    const unsubClaims = syncSetting('his_claims', (data) => setClaims(data || []));
    const unsubLabs = syncSetting('his_lab_results', (data) => setLabResults(data || []));
    const unsubRad = syncSetting('his_radiology_reports', (data) => setRadiologyReports(data || []));
    const unsubVisits = syncSetting('his_visits', (data) => setVisits(data || []));
    const unsubInsu = syncSetting('his_insurance_providers', (data) => setInsuranceProviders(data || []));
    const unsubCItems = syncSetting('his_charge_items', (data) => setChargeItems(data || []));
    const unsubVitals = syncSetting('his_vital_signs', (data) => setVitalSigns(data || []));
    const unsubMAR = syncSetting('his_mar_records', (data) => setMarRecords(data || []));
    
    return () => {
      unsubCharges();
      unsubClaims();
      unsubLabs();
      unsubRad();
      unsubVisits();
      unsubInsu();
      unsubCItems();
      unsubVitals();
      unsubMAR();
    };
  }, [isLoggedIn]);

  const addCharge = useCallback(async (charge: Omit<HISCharge, "id" | "date" | "status">) => {
    // Enterprise logic: Check patient's active visit and insurance
    const patient = safePatients.find(p => p.id === charge.patientId);
    const visit = visits.find(v => v.patientId === charge.patientId && v.status === "active");
    const insuranceId = visit?.insuranceProviderId || patient?.insuranceProviderId || patient?.insurance;
    const provider = insuranceProviders.find(ip => ip.id === insuranceId || ip.nameEn === insuranceId);
    
    const newCharge: HISCharge = {
      ...charge,
      id: `CHG-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      date: new Date().toISOString(),
      status: "pending"
    };

    setCharges(prev => [...prev, newCharge]);
    await saveDataPermanently('his_charges', newCharge);
    
    logAudit({
      action: 'CHARGE_CREATED',
      entityType: 'FINANCIAL',
      entityId: newCharge.id,
      reason: `Automated charge for ${charge.serviceName}`,
      newValue: newCharge
    });

    // Phase 2: Automated Claim Generation
    if (provider && provider.status === "active") {
        const insuranceAmount = newCharge.amount * (provider.discountRate || 0);
        
        const newClaim: HISClaim = {
            id: `CLM-${Date.now()}`,
            patientId: newCharge.patientId,
            insuranceId: provider.id,
            amount: insuranceAmount,
            date: new Date().toISOString(),
            status: "draft",
            charges: [newCharge.id]
        };
        setClaims(prev => [...prev, newClaim]);
        await saveDataPermanently('his_claims', newClaim);
    }
  }, [logAudit, safePatients, visits, insuranceProviders]);

  const addLabResult = useCallback(async (result: Omit<HISLabResult, "id" | "date" | "status">) => {
    const newResult: HISLabResult = {
      ...result,
      id: `RES-${Date.now()}`,
      date: new Date().toISOString(),
      status: "final"
    };
    setLabResults(prev => [...prev, newResult]);
    await saveDataPermanently('his_lab_results', newResult);

    // Auto-update order status
    setCpoeOrders(prev => prev.map(o => (o.patientId === result.patientId && o.category === "lab" && o.status === "ordered") ? { ...o, status: "completed" } : o));

    // Automated Billing: Link to visit charges
    await addCharge({
      patientId: result.patientId,
      patientName: safePatients.find(p => p.id === result.patientId)?.nameEn || "Patient",
      serviceId: "LAB-001",
      serviceName: result.testName,
      category: "lab",
      amount: 150, // Standard lab fee or look up from chargeItems
      staffId: currentUser?.id || "system"
    });
  }, [safePatients, currentUser, addCharge]);

  const addRadiologyReport = useCallback(async (report: Omit<HISRadiologyReport, "id" | "date" | "status">) => {
    const newReport: HISRadiologyReport = {
      ...report,
      id: `RAD-${Date.now()}`,
      date: new Date().toISOString(),
      status: "final"
    };
    setRadiologyReports(prev => [...prev, newReport]);
    await saveDataPermanently('his_radiology_reports', newReport);

    // Auto-update order status
    setCpoeOrders(prev => prev.map(o => (o.patientId === report.patientId && o.category === "radiology" && o.status === "ordered") ? { ...o, status: "completed" } : o));

    // Automated Billing
    await addCharge({
      patientId: report.patientId,
      patientName: safePatients.find(p => p.id === report.patientId)?.nameEn || "Patient",
      serviceId: "RAD-001",
      serviceName: report.studyName,
      category: "radiology",
      amount: 450, // Standard radiology fee
      staffId: currentUser?.id || "system"
    });
  }, [safePatients, currentUser, addCharge]);

  const addVitalSigns = useCallback(async (v: any) => {
    const newVitals = {
      ...v,
      id: `VIT-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setVitalSigns(prev => [...prev, newVitals]);
    await saveDataPermanently('his_vital_signs', newVitals);

    logAudit({
      action: 'VITALS_RECORDED',
      entityType: 'CLINICAL',
      entityId: newVitals.id,
      newValue: newVitals
    });
  }, [logAudit]);

  const addSurgery = useCallback(async (s: any) => {
    const newSurgery = {
      ...s,
      id: s.id || `SURG-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    await saveDataPermanently('surgical_schedules', newSurgery);
    
    logAudit({
      action: 'SURGERY_SCHEDULED',
      entityType: 'OR',
      entityId: newSurgery.id,
      newValue: newSurgery
    });
  }, [logAudit]);

  const updateSurgery = useCallback(async (id: string, updates: any) => {
    const surgery = (surgeriesRaw || []).find((s: any) => s.id === id);
    if (!surgery) return;

    const enriched = { ...surgery, ...updates };
    await saveDataPermanently('surgical_schedules', enriched);

    logAudit({
      action: 'SURGERY_UPDATED',
      entityType: 'OR',
      entityId: id,
      newValue: updates
    });
  }, [surgeriesRaw, logAudit]);

  const addMarRecord = useCallback(async (m: any) => {
    const newMAR = {
      ...m,
      id: m.id || `MAR-${Date.now()}`,
    };
    await saveDataPermanently('mar_records', newMAR);
  }, []);

  const administerMedication = useCallback(async (marId: string, staffId: string) => {
    const mar = marRecords.find(m => m.id === marId);
    if (!mar) return;

    const updatedMAR = {
      ...mar,
      status: "administered",
      administeredTime: new Date().toISOString(),
      administeredByStaffId: staffId
    };

    setMarRecords(prev => prev.map(m => m.id === marId ? updatedMAR : m));
    await saveDataPermanently('his_mar_records', updatedMAR);

    logAudit({
      action: 'MED_ADMINISTERED',
      entityType: 'PHARMACY',
      entityId: marId,
      newValue: updatedMAR
    });
  }, [marRecords, logAudit]);

  const updatePatientStatus = useCallback((id: string, status: Patient["status"]) => {
    let oldVal: any = null;
    setPatients(prev => prev.map(p => {
      if (p.id === id) {
        oldVal = { ...p };
        return { ...p, status };
      }
      return p;
    }));
    
    const patient = safePatients.find(p => p.id === id);
    if (patient && patient.status !== status) {
      savePatient({ ...patient, status }).catch(err => console.error("Cloud patient save error:", err));
      logAudit({
        action: 'UPDATE_STATUS',
        entityType: 'PATIENT',
        entityId: id,
        oldValue: oldVal,
        newValue: { ...oldVal, status }
      });
      
      // Dispatch real-time Firestore notification
      if (status === "ward") {
        saveHISNotification({
          id: `notif-status-${Date.now()}`,
          message: `تم نقل المريض ${patient.nameAr} لجناح التنويم الداخلي.`, 
          timestamp: new Date().toISOString(),
        }).catch(err => console.error("Cloud notification save error:", err));
      }
    }
  }, [setPatients, safePatients, logAudit]);

  const setBeds = useCallback((valOrFunc: React.SetStateAction<HospitalBed[]>) => {
    setBedsRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_beds', newVal).catch(console.error);
      return newVal;
    });
  }, [setBedsRaw]);

  const setWards = useCallback((valOrFunc: React.SetStateAction<Ward[]>) => {
    setWardsRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_wards', newVal).catch(console.error);
      return newVal;
    });
  }, [setWardsRaw]);

  const updateBedStatus = useCallback((bedId: string, status: HospitalBed['status'], patientId?: string) => {
    setBeds(prev => prev.map(b => b.id === bedId ? { ...b, status, currentPatientId: patientId } : b));
  }, [setBeds]);

  const assignBed = useCallback((admission: HISAdmissionRecord) => {
    // 1. Update Bed Status
    updateBedStatus(admission.bedId, 'occupied', admission.patientId);
    
    // 2. Create Admission Record
    setAdmissionsRaw(prev => {
      const updated = [...(prev || []), admission];
      saveSetting('his_admissions', updated).catch(console.error);
      return updated;
    });
    
    // 3. Update Patient Location
    setPatients(prev => prev.map(p => p.id === admission.patientId ? {
      ...p,
      status: 'ward',
      wardId: admission.wardId,
      bedId: admission.bedId,
      roomId: admission.roomId,
      currentClinicalLocation: `${admission.wardId} - Room ${admission.roomId} - Bed ${admission.bedId}`
    } : p));
    
    // 4. Update Admission Requests
    setAdmissionRequestsRaw(prev => prev.filter(r => r.patientId !== admission.patientId));
    
    // 5. Audit Log
    logAudit({
      action: 'BED_ASSIGNMENT',
      entityType: 'BED',
      entityId: admission.bedId,
      newValue: { patientId: admission.patientId, wardId: admission.wardId }
    });

    toast.success(language === "ar" ? "تم تخصيص السرير بنجاح" : "Bed Assigned Successfully");
  }, [updateBedStatus, logAudit, setAdmissionRequestsRaw, setPatients, setAdmissionsRaw, language]);

  const findPatient = useCallback((query: string) => {
    const q = query.toLowerCase();
    return safePatients.filter(p => 
      p.nameEn.toLowerCase().includes(q) || 
      p.nameAr.includes(q) || 
      p.mrn.toLowerCase().includes(q) || 
      p.phone.includes(q) || 
      p.nationalId?.includes(q)
    );
  }, [safePatients]);

  const startEncounter = useCallback(async (patientId: string, type: EncounterType, data: Partial<HISEncounter>) => {
    const patient = safePatients.find(p => p.id === patientId);
    if (!patient) return null;

    const vn = generateVisitNumber(type);
    const newEncounter: HISEncounter = {
      id: vn,
      patientId,
      mrn: patient.mrn,
      type,
      status: 'open',
      startTime: new Date().toISOString(),
      deptId: data.deptId || 'ERD',
      deptName: data.deptName || 'Emergency',
      doctorId: data.doctorId || 'SYS',
      doctorName: data.doctorName || 'System Duty Doctor',
      reasonForVisit: data.reasonForVisit || 'Not Specified',
      priority: data.priority || 'routine',
      financialClass: data.financialClass || 'cash',
      ...data
    };

    setEncountersRaw(prev => [...prev, newEncounter]);
    await saveDataPermanently('his_encounters', newEncounter);

    // Update patient status based on encounter type
    const newStatus: PatientStatus = type === 'emergency' ? 'er_waiting' : type === 'inpatient' ? 'ward' : 'waiting';
    await updatePatient(patientId, { 
      status: newStatus,
      activeEncounterId: vn
    });

    logAudit({
      action: 'ENCOUNTER_STARTED',
      entityType: 'ENCOUNTER',
      entityId: vn,
      newValue: newEncounter
    });

    return vn;
  }, [safePatients, generateVisitNumber, setEncountersRaw, updatePatient, logAudit]);

  const mergePatients = useCallback(async (targetId: string, sourceIds: string[]) => {
    toast.info("Patient Merge initiated (Integration pending)");
  }, []);

  const dischargePatient = useCallback(async (visitId: string) => {
    const visit = visits.find(v => v.id === visitId);
    if (!visit) return;

    const updatedVisit: HISVisit = { ...visit, status: "completed", endTime: new Date().toISOString() };
    setVisits(prev => prev.map(v => v.id === visitId ? updatedVisit : v));
    await saveDataPermanently('his_visits', updatedVisit);

    // Finalize billing claims if pending
    const pendingClaims = claims.filter(c => c.patientId === visit.patientId && c.status === "draft");
    for (const claim of pendingClaims) {
      const updatedClaim = { ...claim, status: "submitted" as const };
      setClaims(prev => prev.map(c => c.id === claim.id ? updatedClaim : c));
      await saveDataPermanently('his_claims', updatedClaim);
    }

    // Free up bed if IPD
    if (visit.visitType === "IPD") {
      const patient = safePatients.find(p => p.id === visit.patientId);
      if (patient?.bedId) {
        setBeds(prev => prev.map(b => b.id === patient.bedId ? { ...b, status: "available", patientId: undefined } : b));
      }
    }

    logAudit({
      action: 'PATIENT_DISCHARGED',
      entityType: 'ADT',
      entityId: visitId,
      newValue: updatedVisit
    });
  }, [visits, claims, safePatients, setBeds, logAudit]);

  const updateVisit = useCallback(async (id: string, updates: Partial<HISVisit>) => {
    const visit = visits.find(v => v.id === id);
    if (!visit) return;

    const enriched = { ...visit, ...updates };
    setVisits(prev => prev.map(v => v.id === id ? enriched : v));
    await saveDataPermanently('his_visits', enriched);
    
    logAudit({
      action: 'VISIT_UPDATED',
      entityType: 'CLINICAL',
      entityId: id,
      newValue: updates
    });
  }, [visits, logAudit]);

  const addClaim = useCallback(async (claim: Omit<HISClaim, "id" | "date" | "status">) => {
    const newClaim: HISClaim = {
      ...claim,
      id: `CLM-${Date.now()}`,
      date: new Date().toISOString(),
      status: "draft"
    };
    setClaims(prev => [...prev, newClaim]);
    await saveDataPermanently('his_claims', newClaim);
  }, []);

  const setAdmissionRequests = useCallback((valOrFunc: React.SetStateAction<any[]>) => {
    setAdmissionRequestsRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_admission_requests', newVal).catch(console.error);
      return newVal;
    });
  }, [setAdmissionRequestsRaw]);

  const setBedMap = useCallback((valOrFunc: React.SetStateAction<Record<string, any>>) => {
    setBedMapRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_bed_map', newVal).catch(console.error);
      return newVal;
    });
  }, [setBedMapRaw]);

  const setDepartments = useCallback((valOrFunc: React.SetStateAction<HISDepartment[]>) => {
    setDepartmentsRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_departments', newVal).catch(console.error);
      return newVal;
    });
  }, [setDepartmentsRaw]);

  const setClinics = useCallback((valOrFunc: React.SetStateAction<HISClinic[]>) => {
    setClinicsRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_clinics', newVal).catch(console.error);
      return newVal;
    });
  }, [setClinicsRaw]);

  const setErQueue = useCallback((valOrFunc: React.SetStateAction<any[]>) => {
    setErQueueRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_er_queue', newVal).catch(console.error);
      return newVal;
    });
  }, [setErQueueRaw]);

  const setCpoeOrders = useCallback((valOrFunc: React.SetStateAction<any[]>) => {
    setCpoeOrdersRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_cpoe_orders', newVal).catch(console.error);
      return newVal;
    });
  }, [setCpoeOrdersRaw]);

  const addOrder = useCallback(async (order: any) => {
    const newOrder = {
      ...order,
      id: order.id || `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      status: order.status || 'pending'
    };
    setCpoeOrders(prev => [...prev, newOrder]);
    await saveDataPermanently('his_cpoe_orders', newOrder);
    
    logAudit({
      action: 'ORDER_CREATED',
      entityType: 'CPOE',
      entityId: newOrder.id,
      newValue: newOrder
    });
  }, [setCpoeOrders, logAudit]);

  const addToQueue = useCallback(async (patientId: string, departmentId: string, priority: number = 1) => {
    const newEntry = {
      id: `Q-${Date.now()}`,
      patientId,
      departmentId,
      priority,
      status: "waiting",
      timestamp: new Date().toISOString(),
      ticketNumber: Math.floor(100 + Math.random() * 899).toString()
    };
    setQueues(prev => [...prev, newEntry]);
    await saveDataPermanently('his_queues', newEntry);
  }, [setQueues]);

  const updateQueueStatus = useCallback(async (entryId: string, status: any) => {
    setQueues(prev => prev.map(e => e.id === entryId ? { ...e, status } : e));
    const entry = queues.find((e: any) => e.id === entryId);
    if (entry) {
      await saveDataPermanently('his_queues', { ...entry, status });
    }
  }, [queues, setQueues]);

  const addClinicalNote = useCallback(async (note: any) => {
    const newNote = {
      ...note,
      id: note.id || `NOTE-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    // clinicalRecords corresponds to clinical_records in storage
    await saveDataPermanently('clinical_records', newNote);
    
    logAudit({
      action: 'CLINICAL_NOTE_CREATED',
      entityType: 'CLINICAL',
      entityId: newNote.id,
      newValue: newNote
    });
  }, [logAudit]);

  const setInventory = useCallback((valOrFunc: React.SetStateAction<InventoryItem[]>) => {
    setInventoryRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_inventory', newVal).catch(console.error);
      return newVal;
    });
  }, [setInventoryRaw]);

  const setMasterData = useCallback((valOrFunc: React.SetStateAction<MasterDataEntry[]>) => {
    setMasterDataRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_master_data', newVal).catch(console.error);
      return newVal;
    });
  }, [setMasterDataRaw]);

  const setRosterWishes = useCallback((valOrFunc: React.SetStateAction<any[]>) => {
    setRosterWishesRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_roster_wishes', newVal).catch(console.error);
      return newVal;
    });
  }, [setRosterWishesRaw]);

  const setPatientJourneys = useCallback((valOrFunc: React.SetStateAction<PatientJourneyStep[]>) => {
    setPatientJourneysRaw(prev => {
      const newVal = typeof valOrFunc === 'function' ? (valOrFunc as any)(prev) : valOrFunc;
      saveSetting('his_patient_journeys', newVal).catch(console.error);
      return newVal;
    });
  }, [setPatientJourneysRaw]);

  const addJourneyStep = useCallback((step: Omit<PatientJourneyStep, "id" | "startTime">) => {
    const newStep: PatientJourneyStep = {
      ...step,
      id: `jstp-${Date.now()}`,
      startTime: new Date().toISOString()
    };
    setPatientJourneys(prev => [...(Array.isArray(prev) ? prev : []), newStep]);
  }, [setPatientJourneys]);

  const addPatient = useCallback(async (data: Omit<Patient, "id" | "mrn" | "status">) => {
    const mrn = generateMRN();
    const newPatient: Patient = {
      ...data,
      id: `P-${Date.now()}`,
      mrn,
      status: 'registered',
      registrationDate: new Date().toISOString()
    } as Patient;
    
    // Simple duplicate check
    const duplicate = safePatients.find(p => 
      (p.nationalId && p.nationalId === data.nationalId) || 
      (p.phone === data.phone)
    );
    
    if (duplicate) {
      toast.error(language === "ar" ? "المريض مسجل بالفعل" : "Patient already registered");
      return duplicate.id;
    }

    setPatients(prev => [...prev, newPatient]);
    await savePatient(newPatient);
    
    // Initialize journey
    addJourneyStep({
      patientId: newPatient.id,
      department: "Registration",
      status: "Registered",
      actionBy: currentUser?.id || "system",
      notesEn: "Patient registered in system",
      notesAr: "تم تسجيل المريض في النظام"
    });

    logAudit({
      action: 'PATIENT_REGISTERED',
      entityType: 'PATIENT',
      entityId: newPatient.id,
      newValue: newPatient
    });
    
    return newPatient.id;
  }, [setPatients, safePatients, generateMRN, logAudit, language, addJourneyStep, currentUser]);
  
  const deletePatient = useCallback((id: string) => {
    const patient = safePatients.find(p => p.id === id);
    setPatients(prev => prev.filter(p => p.id !== id));
    apiDeletePatient(id).catch(err => console.error("Cloud patient delete error:", err));
    if (patient) {
      logAudit({
        action: 'DELETE',
        entityType: 'PATIENT',
        entityId: id,
        oldValue: patient
      });
    }
  }, [setPatients, safePatients, logAudit]);

  const addVisit = useCallback(async (v: Omit<HISVisit, "id" | "status" | "startTime" | "history" | "admissionDate">) => {
    const newVisit: HISVisit = {
      ...v,
      id: `VIS-${Date.now()}`,
      status: "active",
      startTime: new Date().toISOString(),
      admissionDate: new Date().toISOString(),
      history: [{ stage: v.currentStage as any, startTime: new Date().toISOString(), completedByStaffId: currentUser?.id }]
    };
    setVisits(prev => [...prev, newVisit]);
    await saveDataPermanently('his_visits', newVisit);
    return newVisit.id;
  }, [currentUser]);

  const addConsumableToPatient = useCallback((patientId: string, item: InventoryItem, qty: number) => {
    const patient = safePatients.find(p => p.id === patientId);
    if (!patient) return;

    const newConsumable: PatientConsumable = {
      id: `cons-${Date.now()}`,
      patientId,
      itemId: item.id,
      itemNameEn: item.nameEn,
      itemNameAr: item.nameAr,
      qty,
      unitPrice: item.price,
      totalPrice: item.price * qty,
      date: new Date().toISOString(),
      status: "pending"
    };

    const updatedConsumables = [...(patient.consumables || []), newConsumable];
    updatePatient(patientId, { consumables: updatedConsumables });

    // Deduct from inventory
    setInventory(prev => prev.map(inv => {
      if (inv.id === item.id) {
        // Simple logic: deduct from sub-store first, then main-store
        let newSub = inv.stockSub - qty;
        let newMain = inv.stockMain;
        if (newSub < 0) {
          newMain += newSub; // newSub is negative, so this subtracts
          newSub = 0;
        }
        return { ...inv, stockSub: Math.max(0, newSub), stockMain: Math.max(0, newMain) };
      }
      return inv;
    }));
  }, [safePatients, updatePatient, setInventory]);

  const admissionRequests = useMemo(() => Array.isArray(admissionRequestsRaw) ? admissionRequestsRaw : EMPTY_ARRAY, [admissionRequestsRaw]);
  const erQueue = useMemo(() => Array.isArray(erQueueRaw) ? erQueueRaw : EMPTY_ARRAY, [erQueueRaw]);
  const bedMap = useMemo(() => bedMapRaw || {}, [bedMapRaw]);
  const beds = useMemo(() => Array.isArray(bedsRaw) ? bedsRaw : EMPTY_ARRAY as HospitalBed[], [bedsRaw]);
  const wards = useMemo(() => Array.isArray(wardsRaw) ? wardsRaw : EMPTY_ARRAY as Ward[], [wardsRaw]);
  const admissions = useMemo(() => Array.isArray(admissionsRaw) ? admissionsRaw : EMPTY_ARRAY as HISAdmissionRecord[], [admissionsRaw]);
  const departments = useMemo(() => Array.isArray(departmentsRaw) ? departmentsRaw : EMPTY_ARRAY, [departmentsRaw]);
  const clinics = useMemo(() => Array.isArray(clinicsRaw) ? clinicsRaw : EMPTY_ARRAY, [clinicsRaw]);
  const cpoeOrders = useMemo(() => Array.isArray(cpoeOrdersRaw) ? cpoeOrdersRaw : EMPTY_ARRAY, [cpoeOrdersRaw]);
  const inventory = useMemo(() => Array.isArray(inventoryRaw) ? inventoryRaw : EMPTY_ARRAY, [inventoryRaw]);
  const surgeries = useMemo(() => Array.isArray(surgeriesRaw) ? surgeriesRaw : EMPTY_ARRAY, [surgeriesRaw]);
  const masterData = useMemo(() => Array.isArray(masterDataRaw) ? masterDataRaw : EMPTY_ARRAY, [masterDataRaw]);
  const rosterWishes = useMemo(() => Array.isArray(rosterWishesRaw) ? rosterWishesRaw : EMPTY_ARRAY, [rosterWishesRaw]);
  const auditLogs = useMemo(() => Array.isArray(auditLogsRaw) ? auditLogsRaw : EMPTY_ARRAY, [auditLogsRaw]);
  const patientJourneys = useMemo(() => Array.isArray(patientJourneysRaw) ? patientJourneysRaw : EMPTY_ARRAY, [patientJourneysRaw]);
  const referrals = useMemo(() => Array.isArray(referralsRaw) ? referralsRaw : EMPTY_ARRAY as HISReferral[], [referralsRaw]);
  const systemUsers = useMemo(() => Array.isArray(systemUsersRaw) ? systemUsersRaw : EMPTY_ARRAY, [systemUsersRaw]);
  const dutyTasks = useMemo(() => Array.isArray(dutyTasksRaw) ? dutyTasksRaw : EMPTY_ARRAY, [dutyTasksRaw]);
  const clinicalRecords = useMemo(() => Array.isArray(clinicalRecordsRaw) ? clinicalRecordsRaw : EMPTY_ARRAY, [clinicalRecordsRaw]);
  
  // Seed initial mock data if empty (useful for fresh DB) - DISABLED per user request for "Real PostgreSQL only"
  /*
  const [hasSeeded, setHasSeeded] = useState(false);
  useEffect(() => {
    if (safePatients.length === 0 && !hasSeeded) {
      setTimeout(() => {
        setHasSeeded(true);
      }, 0);
      // Wait a moment for sync to settle, then add default data only if it is actually empty
      setTimeout(() => {
        if (safePatients.length === 0) {
          EMPTY_ARRAY.forEach(p => {
            savePatient(p).catch(err => console.error("Cloud patient seed error:", err));
          });
        }
        
        // Seed inventory if empty
        if (inventory.length === 0) {
          setInventory(EMPTY_ARRAY);
        }

        // Seed Master Data if empty
        if (masterData.length === 0) {
          setMasterData(EMPTY_ARRAY);
        }

        // Seed other critical settings
        if (beds.length === 0) {
          setBeds(EMPTY_ARRAY);
        }
        if (departments.length === 0) {
          setDepartments(EMPTY_ARRAY);
        }
        if (clinics.length === 0) {
          setClinics(EMPTY_ARRAY);
        }
        if (erQueue.length === 0) {
          setErQueue(EMPTY_ARRAY);
        }
        if (cpoeOrders.length === 0) {
          setCpoeOrders(EMPTY_ARRAY);
        }
        if (admissionRequests.length === 0) {
          setAdmissionRequests(EMPTY_ARRAY);
        }
      }, 5000);
    }
  }, [safePatients.length, hasSeeded, inventory.length, beds.length, departments.length, clinics.length, erQueue.length, cpoeOrders.length, admissionRequests.length, setBeds, setDepartments, setClinics, setInventory, setMasterData, setErQueue, setCpoeOrders, setAdmissionRequests]);
  */

  const dispensePrescription = useCallback(async (prescriptionId: string, staffId: string) => {
    const prescription = safePrescriptions.find(p => p.id === prescriptionId);
    if (!prescription || prescription.status === "dispensed") return;

    // 1. Update status
    const updatedRx = { ...prescription, status: "dispensed" as const, dispensedDate: new Date().toISOString() };
    await savePrescription(updatedRx);
    
    // 2. Automated Billing
    // Try to find the medication in inventory to get the price
    const medication = inventory.find(i => 
      i.nameEn.toLowerCase() === prescription.medication.toLowerCase() || 
      i.nameAr === prescription.medication
    );

    const price = medication?.price || 50; // Fallback price
    await addCharge({
      patientId: prescription.patientId,
      patientName: safePatients.find(p => p.id === prescription.patientId)?.nameEn || "Patient",
      serviceId: medication?.id || "MED-GEN",
      serviceName: prescription.medication,
      category: "medication",
      amount: price * prescription.qty,
      staffId: staffId,
      orderId: prescription.id
    });

    // 3. Inventory Deduction
    if (medication) {
      setInventory(prev => prev.map(inv => {
        if (inv.id === medication.id) {
          let newSub = inv.stockSub - prescription.qty;
          let newMain = inv.stockMain;
          if (newSub < 0) {
            newMain += newSub;
            newSub = 0;
          }
          return { ...inv, stockSub: Math.max(0, newSub), stockMain: Math.max(0, newMain) };
        }
        return inv;
      }));
    }

    logAudit({
      action: 'PRESCRIPTION_DISPENSED',
      entityType: 'PHARMACY',
      entityId: prescriptionId,
      newValue: updatedRx
    });
  }, [safePrescriptions, inventory, safePatients, addCharge, setInventory, logAudit]);

  const addPrescription = useCallback(async (p: Prescription) => {
    const newRx = { ...p, id: p.id || `RX-${Date.now()}` };
    await savePrescription(newRx);
    
    // Auto-generate MAR records for nursing
    const frequency = p.frequency || "QD"; // Default Once Daily
    let schedules = ["09:00"];
    if (frequency === "BID") schedules = ["09:00", "21:00"];
    if (frequency === "TID") schedules = ["09:00", "14:00", "21:00"];
    if (frequency === "QID") schedules = ["06:00", "12:00", "18:00", "00:00"];
    if (frequency.includes("H")) {
        const hours = parseInt(frequency.match(/\d+/)?.[0] || "24");
        schedules = [];
        for (let h = 0; h < 24; h += hours) {
            schedules.push(`${h.toString().padStart(2, '0')}:00`);
        }
    }

    for (const time of schedules) {
        const marId = `MAR-${Date.now()}-${time.replace(':', '')}`;
        const newMAR = {
            id: marId,
            patientId: p.patientId,
            orderId: newRx.id,
            medicationName: p.medication,
            dosage: p.dose,
            route: p.route || "PO",
            scheduledTime: time,
            status: "scheduled"
        };
        setMarRecords(prev => [...prev, newMAR]);
        await saveDataPermanently('his_mar_records', newMAR);
    }

    logAudit({
      action: 'PRESCRIPTION_ORDERED',
      entityType: 'CLINICAL',
      entityId: newRx.id,
      newValue: newRx
    });
  }, [logAudit]);
  
  const updatePrescriptionStatus = useCallback((id: string, status: Prescription["status"], extra?: Partial<Prescription>) => {
    const prescription = safePrescriptions.find(p => p.id === id);
    if (prescription) {
      savePrescription({ ...prescription, status, ...extra }).catch(err => console.error("Cloud prescription save error:", err));
    }
    // Also sync nested prescriptions in the patient record
    const patient = safePatients.find(p => p.prescriptions?.some((rx: any) => rx.id === id) || p.id === prescription?.patientId);
    if (patient && patient.prescriptions) {
      const updatedPrescriptions = patient.prescriptions.map((rx: any) => {
        if (rx.id === id) {
          return { ...rx, status, ...extra };
        }
        return rx;
      });
      savePatient({ ...patient, prescriptions: updatedPrescriptions }).catch(err => console.error("Cloud patient save error:", err));
    }
  }, [safePrescriptions, safePatients]);

  const addMasterData = useCallback((entry: Omit<MasterDataEntry, "id" | "date" | "time" | "useCount" | "status" | "isOfficial">) => {
    const existing = masterData.find(m => 
      m.category === entry.category && 
      (m.valueEn.toLowerCase() === entry.valueEn.toLowerCase() || 
       m.valueAr === entry.valueAr)
    );

    if (existing) {
      setMasterData(prev => prev.map(m => m.id === existing.id ? { ...m, useCount: m.useCount + 1 } : m));
      return;
    }

    const now = new Date();
    const newEntry: MasterDataEntry = {
      ...entry,
      id: `md-${Math.random().toString(36).substr(2, 9)}`,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0],
      useCount: 1,
      status: "pending",
      isOfficial: false
    };

    setMasterData(prev => [...prev, newEntry]);
  }, [masterData, setMasterData]);

  const updateMasterDataStatus = useCallback((id: string, status: MasterDataEntry["status"], isOfficial: boolean = false) => {
    setMasterData(prev => prev.map(m => m.id === id ? { ...m, status, isOfficial } : m));
  }, [setMasterData]);

  const deleteMasterData = useCallback((id: string) => {
    setMasterData(prev => prev.filter(m => m.id !== id));
  }, [setMasterData]);

  const addInvoice = useCallback((i: Invoice) => {
    saveInvoice(i).catch(err => console.error("Cloud invoice save error:", err));
  }, []);
  
  const updateInvoiceStatus = useCallback((id: string, status: Invoice["status"]) => {
    const invoice = safeInvoices.find(inv => inv.id === id);
    if (invoice && invoice.status !== status) {
        saveInvoice({ ...invoice, status }).catch(err => console.error("Cloud invoice save error:", err));
    }
  }, [safeInvoices]);

  const getSettingValue = useCallback(async (key: string) => {
    return await getSetting(key);
  }, []);

  const saveSettingValue = useCallback(async (key: string, value: any) => {
    await saveSetting(key, value);
  }, []);

  const createAdmissionRequest = useCallback(async (request: any) => {
    const newRequest = {
      ...request,
      id: `REQ-${Date.now()}`,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    
    setAdmissionRequestsRaw(prev => [...(prev || []), newRequest]);
    await saveSetting('his_admission_requests', [...(admissionRequestsRaw || []), newRequest]);
    
    // Update patient status to indicate pending admission
    updatePatient(request.patientId, { 
      status: 'er_waiting_admission',
      clinicalData: {
        ...(request.patientClinicalData || {}),
        admissionRequest: newRequest
      }
    });

    logAudit({
      action: 'ADMISSION_REQUEST_CREATED',
      entityType: 'ADMISSION',
      entityId: newRequest.id,
      newValue: newRequest
    });

    toast.success(language === 'ar' ? "تم إرسال طلب التنويم للمكتب" : "Admission request sent to office");
  }, [admissionRequestsRaw, setAdmissionRequestsRaw, updatePatient, logAudit, language]);

  const addReferralOrder = useCallback(async (referral: Omit<HISReferral, "id" | "date" | "status">) => {
    const newReferral: HISReferral = {
      ...referral,
      id: `REF-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      status: "pending",
      date: new Date().toISOString()
    };
    setReferralsRaw(prev => [...(Array.isArray(prev) ? prev : []), newReferral]);
    await saveSetting('his_referrals', [...(Array.isArray(referralsRaw) ? referralsRaw : []), newReferral]);
    
    addJourneyStep({
      patientId: referral.patientId,
      department: referral.toDepartment,
      status: "Referred",
      actionBy: referral.referringDoctor || currentUser?.id || "doctor",
      notesEn: `Referred to ${referral.toDepartment}: ${referral.reason}`,
      notesAr: `تحويل إلى ${referral.toDepartment}: ${referral.reason}`
    });

    logAudit({
      action: 'REFERRAL_CREATED',
      entityType: 'CLINICAL',
      entityId: newReferral.id,
      newValue: newReferral
    });
  }, [setReferralsRaw, referralsRaw, addJourneyStep, currentUser, logAudit]);

  const contextValue = useMemo(() => ({
    patients: safePatients,
    addPatient,
    updatePatient,
    deletePatient,
    updatePatientStatus,
    prescriptions: safePrescriptions,
    addPrescription,
    dispensePrescription,
    updatePrescriptionStatus,
    masterData,
    addMasterData,
    updateMasterDataStatus,
    deleteMasterData,
    invoices: safeInvoices,
    addInvoice,
    updateInvoiceStatus,
    activePatient,
    setActivePatient,
    admissionRequests,
    setAdmissionRequests,
    createAdmissionRequest,
    bedMap,
    setBedMap,
    beds,
    setBeds,
    wards,
    setWards,
    admissions,
    setAdmissions: setAdmissionsRaw,
    assignBed,
    erQueue,
    setErQueue,
    systemUsers,
    dutyTasks,
    clinicalRecords,
    departments,
    setDepartments,
    clinics,
    setClinics,
    auditLogs,
    logAudit,
    getSetting,
    saveSetting,
    syncSetting: (key: string, callback: (data: any) => void) => {
      return syncSetting(key, callback);
    },
    cpoeOrders,
    setCpoeOrders,
    encounters: encountersRaw,
    setEncounters: setEncountersRaw,
    inventory,
    setInventory,
    addConsumableToPatient,
    patientJourneys,
    setPatientJourneys,
    addJourneyStep,
    queues,
    setQueues,
    addToQueue,
    updateQueueStatus,
    vitalSigns,
    addVitalSigns,
    surgeries,
    addSurgery,
    updateSurgery,
    marRecords,
    addMarRecord,
    administerMedication,
    rosterWishes,
    setRosterWishes,
    charges,
    addCharge,
    claims,
    addClaim,
    labResults,
    addLabResult,
    radiologyReports,
    addRadiologyReport,
    visits,
    addVisit,
    startEncounter,
    dischargePatient,
    updateVisit,
    addOrder,
    addCPOEOrder: addOrder,
    referrals,
    addReferralOrder,
    addClinicalNote,
    insuranceProviders,
    chargeItems,
    generateMRN,
    generateVisitNumber,
    findPatient,
    mergePatients,
    language,
    currentUser,
    activeUser: currentUser,
    addAuditLog: logAudit
  }), [
    safePatients, addPatient, updatePatient, deletePatient, updatePatientStatus,
    safePrescriptions, addPrescription, dispensePrescription, updatePrescriptionStatus,
    masterData, addMasterData, updateMasterDataStatus, deleteMasterData,
    safeInvoices, addInvoice, updateInvoiceStatus,
    activePatient, setActivePatient,
    admissionRequests, setAdmissionRequests,
    createAdmissionRequest,
    bedMap, setBedMap,
    beds, setBeds,
    wards, setWards,
    admissions, assignBed,
    erQueue, setErQueue,
    systemUsers,
    dutyTasks,
    clinicalRecords,
    departments,
    setDepartments,
    clinics,
    setClinics,
    auditLogs,
    logAudit,
    getSetting,
    saveSetting,
    syncSetting,
    cpoeOrders,
    setCpoeOrders,
    encountersRaw,
    setEncountersRaw,
    inventory,
    setInventory,
    addConsumableToPatient,
    patientJourneys,
    setPatientJourneys,
    addJourneyStep,
    queues,
    setQueues,
    addToQueue,
    updateQueueStatus,
    vitalSigns,
    addVitalSigns,
    surgeries,
    addSurgery,
    updateSurgery,
    marRecords,
    addMarRecord,
    administerMedication,
    rosterWishes,
    setRosterWishes,
    charges,
    addCharge,
    claims,
    addClaim,
    labResults,
    addLabResult,
    radiologyReports,
    addRadiologyReport,
    visits,
    addVisit,
    startEncounter,
    dischargePatient,
    updateVisit,
    addOrder,
    referrals,
    addReferralOrder,
    addClinicalNote,
    insuranceProviders,
    chargeItems,
    generateMRN,
    generateVisitNumber,
    findPatient,
    mergePatients,
    language,
    currentUser
  ]);

  return (
    <HISContext.Provider value={contextValue}>
      {children}
    </HISContext.Provider>
  );
}

export default HISProvider;

export function useHIS() {
  const context = useContext(HISContext);
  if (context === undefined) {
    throw new Error('useHIS must be used within a HISProvider');
  }
  return context;
}
