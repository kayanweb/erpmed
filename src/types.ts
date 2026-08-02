/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FormTemplate {
  id: string;
  code: string; // e.g. BHG-FR-GEN-027
  titleAr: string;
  titleEn: string;
  departmentDefault: string;
  version?: string;
  issueDate?: string;
  hasPatientDetails?: boolean;
  items?: Omit<GridRow, "days">[]; // Custom initial items
  isCloudDocument?: boolean;
  documentData?: string;
  documentType?: string;
}

export interface SavedRecord {
  id: string;
  templateId: string;
  date: string;
  time: string;
  department: string;
  staffName: string;
  staffId: string;
  notes?: string;
  createdAt?: string;
  shift?: string; // Active clinical tracking shift/period
  status?: string; // status e.g. "Pending", "Submitted by [Employee]", etc.
  // Patient / Custom Info
  patientName?: string;
  patientMRN?: string;
  diagnosis?: string;
  additionalInfo?: Record<string, any>;
  // The actual form data grid
  gridData: GridRow[];
}

export interface GridRow {
  sn?: string; // Serial number
  code?: string; // Item code/ID
  itemAr: string;
  itemEn: string;
  unit?: string;
  qty?: string;
  expiry?: string;
  batch?: string;
  days: Record<string, string>; // Map of "day" (1-31) to status ("✔", "✘", "1", "2.5", empty, etc.)
  extraType?: string; // e.g., 'select', 'text', 'checkbox'
}

export interface Role {
  id: string;
  name?: string;
  nameAr: string;
  nameEn: string;
}

export interface Permission {
  id: string;
  name?: string;
  nameAr: string;
  nameEn: string;
}

export interface AccessMatrix {
  id: string;
  roleId: string;
  permissionId: string;
  enabled: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: number;
}

export type UserRole = "admin" | "head_nurse" | "quality" | "president" | "staff" | "Staff" | "it" | "tech" | "intern" | "assistant" | "secretary" | "supervisor" | "nursing_director" | "ward_clerk";

export interface AppUser {
  id: string;
  nameAr: string;
  nameEn: string;
  role: UserRole; // This appears to be deprecated in favor of roleId? I will keep it for compatibility but add roleId
  roleId?: string; // Dynamic role
  status?: "pending" | "active" | "disabled";
  avatarInitials: string;
  avatar?: string;
  profilePictureUrl?: string;
  department: string;
  staffId: string;
  pin?: string; 
  email?: string;
  emp_id?: string;
  assigned_dept?: string;
  supervisorId?: string;
  permissions?: string[];
  moduleOverrides?: string[];
  moduleDenials?: string[];
  bloodGroup?: string;
  issueDate?: string;
  expiryDate?: string;
  idCardTermsAr?: string;
  idCardTermsEn?: string;
}


export interface DailyDutyTask {
  id: string;
  department: string;
  taskAr: string;
  taskEn: string;
  categoryAr: string;
  categoryEn: string;
  createdAt: string;
}

export interface UnitDailyChecklist {
  id: string;
  department: string;
  date: string;
  completedByStaffName: string;
  completedByStaffId: string;
  completedAt: string;
  status: "completed" | "audited";
  auditedByStaffName?: string;
  auditedByStaffId?: string;
  auditedAt?: string;
  auditNotes?: string;
  answers: Record<string, { done: boolean; note?: string }>;
}

export interface SystemLog {
  id: string;
  event: string;
  type: "info" | "warning" | "success" | "error";
  time: string;
  timestampMs: number;
}

export interface RosterRow {
  employeeId: string;
  employeeNameAr: string;
  employeeNameEn: string;
  roleTitleAr: string;
  roleTitleEn: string;
  employeeCode: string;
  shifts: Record<string, string>; // e.g. "16" -> "DN"
}

export interface DepartmentRoster {
  id: string;
  departmentName: string;
  startDate: string; // "2026-05-16"
  endDate: string;   // "2026-06-15"
  rows: RosterRow[];
}

export const EntityType = {
  PATIENT: "patient",
  CASE: "case",
  PROCEDURE: "procedure",
  NOTIFICATION: "notification",
  LAB_RESULT: "lab_result",
  MEDICATION: "medication",
  DOCTOR: "doctor",
  ROOM: "room",
  BED: "bed",
} as const;

export type EntityTypeValue = typeof EntityType[keyof typeof EntityType];

export interface EntityShape {
  type: EntityTypeValue | string;
  id: string | number;
  name?: string;
  context?: any;
}

export interface Notification {
  id: string;
  userId?: string;
  messageAr: string;
  messageEn: string;
  timestamp: string;
  read: boolean;
  type?: string;
  targetDepartment?: string;
  titleAr?: string;
  titleEn?: string;
  bodyAr?: string;
  bodyEn?: string;
  targetTab?: string;
  targetSubTab?: string;
  targetUserId?: string;
  entity?: EntityShape;
}

export interface RosterWish {
  id: string;
  employeeId: string;
  employeeNameAr: string;
  employeeNameEn: string;
  departmentName: string;
  dayKey: string;
  requestedShift: "M" | "A" | "D" | "N" | "DN" | "OFF" | "AL";
  reasonAr?: string;
  reasonEn?: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

export type TaskStatus = "draft" | "pending" | "approved" | "in_progress" | "completed" | "cancelled" | "rejected";

export interface HospitalTask {
  id: string;
  workflowId: string;
  patientId: string;
  patientMRN: string;
  assignedToRole?: string; // e.g. "lab", "pharmacy", "nurse"
  assignedToUserId?: string;
  titleAr: string;
  titleEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  status: TaskStatus;
  priority: "routine" | "urgent" | "stat";
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  slaMinutes?: number;
  isEscalated?: boolean;
  type: "clinical" | "administrative" | "lab" | "radiology" | "pharmacy" | "nursing" | "porter" | "housekeeping";
}

export interface PatientActivity {
  id: string;
  patientId: string;
  workflowId: string;
  type: string;
  messageAr: string;
  messageEn: string;
  timestamp: string;
  staffId: string;
  staffName: string;
}

export type PatientStatus = 
  | 'registered'
  | 'opd_registered'
  | 'opd_triage'
  | 'opd_doctor'
  | 'opd_active'
  | 'waiting'
  | 'triage'
  | 'doctor_waiting'
  | 'doctor'
  | 'er'
  | 'pharmacy'
  | 'lab'
  | 'opd'
  | 'pacu'
  | 'consultation'
  | 'nursing'
  | 'observation'
  | 'er_waiting'
  | 'er_triage'
  | 'er_bed'
  | 'er_observation'
  | 'er_waiting_admission'
  | 'ward'
  | 'nicu'
  | 'pre_op'
  | 'surgery'
  | 'recovery'
  | 'icu'
  | 'discharged'
  | 'transferred'
  | 'cancelled'
  | 'scheduled';

export type EncounterType = 
  | 'emergency'
  | 'outpatient'
  | 'inpatient'
  | 'observation'
  | 'day_case'
  | 'follow_up'
  | 'referral'
  | 'telemedicine';

export type EncounterStatus = 'open' | 'closed' | 'cancelled' | 'on_hold';

export interface HISEncounter {
  id: string; // Visit Number
  patientId: string;
  mrn: string;
  type: EncounterType;
  status: EncounterStatus;
  startTime: string;
  endTime?: string;
  deptId: string;
  deptName: string;
  doctorId: string;
  doctorName: string;
  reasonForVisit: string;
  chiefComplaint?: string;
  priority: 'routine' | 'urgent' | 'stat';
  financialClass: 'cash' | 'insurance' | 'corporate' | 'free';
  insuranceId?: string;
  referringPhysician?: string;
  sourceOfReferral?: string;
  arrivalMode?: 'walk_in' | 'ambulance' | 'police' | 'referral';
  triageLevel?: number;
}

export type WorkflowStage = 
  | "appointment" 
  | "registration" 
  | "insurance_verification" 
  | "check_in" 
  | "triage" 
  | "doctor_consultation" 
  | "diagnosis" 
  | "orders" 
  | "lab_rad_execution" 
  | "medication_administration" 
  | "nursing_care" 
  | "billing" 
  | "discharge" 
  | "follow_up";

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number
  nameAr: string;
  nameEn: string;
  fullNameEn?: string;
  fullNameAr?: string;
  name?: string;
  gender: "male" | "female" | string;
  dob?: string;
  dateOfBirth?: string;
  nationality?: string;
  nationalId?: string;
  passportNumber?: string;
  phone: string;
  phoneNumber?: string;
  bloodGroup?: string;
  bloodType?: string;
  allergies?: string[];
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  currentWorkflowStage?: WorkflowStage | string;
  workflowId?: string; // ID of the current active visit/workflow
  activeEncounterId?: string;
  age: number;
  status: PatientStatus;
  registrationDate?: string;
  currentClinicalLocation?: string;
  attendingDoctor?: string;
  wardId?: string;
  bedId?: string;
  roomId?: string;
  building?: string;
  floor?: string;
  room?: string;
  bed?: string;
  insurance?: any;
  vitals?: {
    temp?: string | number;
    hr?: string | number;
    rr?: string | number;
    bp?: string;
    spo2?: string | number;
    weight?: string | number;
    timestamp: string;
  };
  clinicalData?: {
    esiLevel?: number;
    chiefComplaint?: string;
    provisionalDiagnosis?: string;
    finalDiagnosis?: string;
    admissionRequest?: {
      requestId: string;
      requestingDoctorId: string;
      requestingDoctorName: string;
      requestedDeptId: string;
      requestedDeptName: string;
      priority: 'routine' | 'urgent' | 'stat';
      reason: string;
      status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
      timestamp: string;
      requirements: {
        oxygen?: boolean;
        ventilator?: boolean;
        monitor?: boolean;
        isolation?: boolean;
      };
    };
    chronicDiseases?: string[];
    isolationRequired?: boolean;
    codeStatus?: 'full_code' | 'dnr' | 'dni';
    allergies?: string[];
    currentWorkflowStage?: string;
    triageLevel?: number;
  };
  financialClass?: string;
  consumables?: any[];
  progressNotes?: any[];
  nursingNotes?: any[];
  assessments?: any[];
  fluidIntake?: any[];
  fluidOutput?: any[];
  orders?: any[];
  prescriptions?: any[];
  vitalsLog?: any[];
  marLog?: any[];
  departmentId?: string;
  roomNumber?: string;
  bedNumber?: string;
  admissionDiagnosis?: string;
  dischargedAt?: string;
  dx?: string;
  chiefComplaint?: string;
  filledForms?: any;
  isReadyForDischarge?: boolean;
  clinicalRecords?: any[];
  visits?: any[];
  alerts?: string[];
  triageLevel?: number;
  department?: string;
}

export interface RosterAuditLog {
  id: string;
  timestamp: string | number;
  whoId: string;
  whoName: string;
  what: string;
  department?: string;
}

export interface PatientVisitWorkflow {
  id: string;
  patientId: string;
  patientMRN: string;
  startTime: string;
  endTime?: string;
  currentStage: WorkflowStage;
  status: "active" | "completed" | "cancelled";
  history: {
    stage: WorkflowStage;
    startTime: string;
    endTime?: string;
    completedByStaffId?: string;
  }[];
}

export interface HISInsuranceProvider {
  id: string;
  nameAr: string;
  nameEn: string;
  code: string;
  discountRate: number; // e.g. 0.8 for 80% coverage
  isPublic?: boolean;
  status: "active" | "inactive";
}

export interface HISChargeItem {
  id: string;
  code: string; // CPT or internal code
  nameAr: string;
  nameEn: string;
  basePrice: number;
  category: "lab" | "radiology" | "pharmacy" | "consultation" | "procedure" | "room" | "other";
}

export interface HISVisit extends PatientVisitWorkflow {
  visitType: "OPD" | "IPD" | "ER";
  admissionDate: string;
  dischargeDate?: string;
  primaryDiagnosis?: string;
  doctorInChargeId?: string;
  insuranceProviderId?: string;
  policyNumber?: string;
  totalEstimatedBill: number;
}

export interface ClinicalNote {
  id: string;
  workflowId: string;
  patientId: string;
  patientMRN: string;
  staffId: string;
  staffName: string;
  noteType: "SOAP" | "Progress" | "Nursing" | "Consultation" | "Operation" | "Discharge" | "Procedure" | "Daily" | "WardRound" | "ICU";
  content: string; // Can be JSON string for structured notes like SOAP
  soapData?: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  timestamp: string;
}

export interface VitalSigns {
  id: string;
  patientId: string;
  staffId: string;
  timestamp: string;
  temperature: number;
  pulse: number;
  respiratoryRate: number;
  bloodPressure: string; // e.g. "120/80"
  oxygenSaturation: number;
  weight?: number;
  height?: number;
  bmi?: number;
  painScale?: number; // 0-10
  // Compatibility with UI components
  patientName?: string;
  patientMRN?: string;
  temp?: string | number;
  bp?: string;
  hr?: string | number;
  spo2?: string | number;
  createdAt?: any;
}

export interface NursingAssessment {
  id: string;
  patientId: string;
  staffId: string;
  timestamp: string;
  assessmentType: "Braden" | "Glasgow" | "FallRisk" | "Skin" | "CarePlan" | "FluidBalance";
  data: Record<string, any>;
  score?: number;
}

export interface MARRecord { // Medication Administration Record
  id: string;
  patientId: string;
  orderId: string;
  medicationName: string;
  dosage: string;
  route: string;
  scheduledTime: string;
  administeredTime?: string;
  administeredByStaffId?: string;
  status: "scheduled" | "administered" | "skipped" | "refused";
  barcodeScanned?: boolean;
}

export interface Order {
  id: string;
  patientId: string;
  workflowId: string;
  staffId: string; // Prescribing doctor
  orderType: "lab" | "radiology" | "medication" | "procedure";
  itemName: string;
  itemCode?: string;
  status: "pending" | "collected" | "processing" | "completed" | "cancelled";
  results?: any;
  priority: "routine" | "urgent" | "stat";
  timestamp: string;
}

export interface BillingClaim {
  id: string;
  workflowId: string;
  patientId: string;
  totalAmount: number;
  insuranceAmount: number;
  patientAmount: number;
  status: "pending" | "approved" | "rejected" | "paid";
  items: {
    description: string;
    code: string; // CPT/ICD
    quantity: number;
    unitPrice: number;
  }[];
}

export interface ICURecord {
  id: string;
  patientId: string;
  timestamp: string;
  ventilatorSettings?: any;
  abgResults?: any;
  hemodynamicData?: any;
  sofaScore?: number;
  apache2Score?: number;
}


export interface DBPatientSchema {
  id: string;
  mrn: string;
  national_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'MALE' | 'FEMALE';
  blood_type?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone_mobile: string;
  phone_home?: string;
  email?: string;
  address?: {
    city: string;
    district: string;
    street: string;
    building: string;
  };
  emergency_contact?: {
    name: string;
    phone: string;
    relation: string;
  };
  insurance_company_id?: string;
  insurance_policy_number?: string;
  insurance_expiry_date?: string;
  is_active: boolean;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface DBEncounterSchema {
  id: string;
  patient_id: string;
  encounter_type: 'OPD' | 'IPD' | 'ER';
  status: 'SCHEDULED' | 'CHECKED_IN' | 'IN_PROGRESS' | 'ON_HOLD' | 'CLOSED' | 'CANCELLED';
  department_id?: string;
  primary_doctor_id?: string;
  bed_id?: string;
  admission_datetime?: string;
  discharge_datetime?: string;
  chief_complaint?: string;
  clinical_notes?: {
    notes: string;
    vitals: any;
    diagnosis: string;
  };
  triage_level?: number;
}

export interface DynamicFormField {
  id: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'radio' | 'signature' | 'vitals' | 'header';
  labelAr: string;
  labelEn: string;
  placeholderAr?: string;
  placeholderEn?: string;
  options?: { value: string; labelAr: string; labelEn: string }[];
  required?: boolean;
  width?: 'full' | 'half' | 'third';
  defaultValue?: any;
}

export interface DynamicFormSchema {
  id: string;
  code: string;
  titleAr: string;
  titleEn: string;
  category: string;
  version: string;
  fields: DynamicFormField[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export interface ClinicalFormInstance {
  id: string;
  schemaId: string;
  patientId: string;
  patientMRN: string;
  data: Record<string, any>;
  signedByStaffId: string;
  signedByStaffName: string;
  signedTimestamp: string;
  status: "draft" | "final";
  auditData: {
    ip: string;
    deviceId: string;
    department: string;
  };
}

export interface Ward {
  id: string;
  nameEn: string;
  nameAr: string;
  departmentId: string;
  type: 'medical' | 'surgical' | 'icu' | 'ccu' | 'nicu' | 'picu' | 'pediatric' | 'maternity' | 'isolation' | 'burn';
  genderAllowed: 'male' | 'female' | 'both';
  ageGroup: 'adult' | 'pediatric' | 'neonatal' | 'all';
  capacity: number;
  occupancy: number;
  isActive: boolean;
}

export interface HospitalBed {
  id: string;
  bedNumber: string; 
  roomNumber: string;
  building: string;
  floor: string;
  wardId: string;
  wardName?: string;
  status: 'available' | 'occupied' | 'blocked' | 'cleaning' | 'maintenance' | 'reserved';
  type?: 'standard' | 'icu' | 'isolation' | 'pediatric' | 'maternity' | 'suite' | string;
  genderRestriction?: 'none' | 'male' | 'female' | string;
  isolationType?: 'none' | 'contact' | 'droplet' | 'airborne' | 'protective' | string;
  
  // Features/Equipment
  hasMonitor?: boolean;
  hasVentilator?: boolean;
  hasOxygen?: boolean;
  hasSuction?: boolean;
  
  // Metadata
  isActive?: boolean;
  departmentId?: string;
  roomId?: string;
  hospitalId?: string;
  specialty?: string;
  equipment?: string[];
  equipmentList?: string[];
  currentPatientId?: string;
  lastCleaningTimestamp?: string;
  lastMaintenanceTimestamp?: string;
  createdAt: string;
}

export interface HISAdmissionRecord {
  id: string;
  patientId: string;
  mrn: string;
  admissionDate: string;
  expectedDischargeDate?: string;
  admissionType: 'emergency' | 'elective' | 'transfer';
  attendingPhysicianId: string;
  wardId: string;
  roomId: string;
  bedId: string;
  status: 'active' | 'discharged' | 'transferred' | 'cancelled';
  diagnosisEn: string;
  diagnosisAr: string;
  triageLevel?: number;
  source: 'er' | 'opd' | 'referral' | 'other';
  notes?: string;
}





