export type ModalityType = 
  | "CT"
  | "MRI"
  | "X-RAY"
  | "PORTABLE_XRAY"
  | "ULTRASOUND"
  | "DOPPLER"
  | "ECHO"
  | "MAMMOGRAPHY"
  | "FLUOROSCOPY"
  | "DEXA"
  | "INTERVENTIONAL"
  | "ANGIOGRAPHY"
  | "CATH_LAB"
  | "NUCLEAR"
  | "PET"
  | "PET_CT"
  | "SPECT"
  | "DENTAL";

export type OrderPriority = "Routine" | "Urgent" | "STAT";

export type StudyStatus = 
  | "Ordered"
  | "Scheduled"
  | "Prepped"
  | "CheckedIn"
  | "InProcedure"
  | "Completed"
  | "DraftReport"
  | "Reported"
  | "Verified"
  | "CriticalAlert"
  | "Cancelled";

export interface RadiologyStudy {
  id: string; // Accession Number e.g. ACC-2026-9041
  studyInstanceUid: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: "Male" | "Female";
  mrn: string;
  nationalId?: string;
  modality: ModalityType;
  bodyPart: string;
  procedureName: string;
  priority: OrderPriority;
  status: StudyStatus;
  orderingDoctor: string;
  orderingDepartment: string;
  orderDate: string;
  scheduledTime?: string;
  scheduledRoom?: string;
  technicianId?: string;
  technicianName?: string;
  radiologistId?: string;
  radiologistName?: string;
  clinicalIndication: string;
  icd10Code?: string;
  transportMode: "Ambulatory" | "Wheelchair" | "Stretcher" | "Portable";
  
  // Preparation & Safety
  prepCompleted: boolean;
  fastingHours?: number;
  contrastRequired: boolean;
  contrastType?: string;
  contrastVolumeMl?: number;
  contrastBatchNo?: string;
  creatinineLevel?: number;
  eGFR?: number;
  pregnancyCheck?: "Negative" | "Positive" | "Not Applicable" | "Unknown";
  allergyHistory?: string[];
  consentSigned: boolean;
  
  // DICOM & PACS Metadata
  seriesCount: number;
  instanceCount: number;
  dicomAeTitle?: string;
  sampleImages: string[];
  
  // Dose Tracking
  doseDlpMgyCm?: number;
  doseCtdiVolMgy?: number;
  effectiveDoseMsv?: number;
  doseAlertTriggered?: boolean;

  // Timestamps
  checkInTime?: string;
  procedureStartTime?: string;
  procedureEndTime?: string;
  reportDraftTime?: string;
  reportFinalizedTime?: string;

  // Billing
  cptCode?: string;
  billingAmount: number;
  billingStatus: "Pending" | "Billed" | "Insurance_Approved";
}

export interface RadiologyReport {
  id: string;
  studyId: string; // Accession Number
  patientId: string;
  patientName: string;
  modality: ModalityType;
  procedureName: string;
  clinicalHistory: string;
  technique: string;
  comparisonStudy?: string;
  findings: string;
  impression: string;
  recommendations?: string;
  biRadsCategory?: string; // For Mammography
  lungRadsCategory?: string; // For Chest CT
  isCritical: boolean;
  criticalDetails?: string;
  criticalNotifiedDoctor?: string;
  criticalNotifiedTime?: string;
  criticalAckTime?: string;
  status: "Draft" | "Preliminary" | "Final" | "Addendum";
  radiologistName: string;
  radiologistTitle: string;
  signedAt: string;
  digitalSignatureHash: string;
  version: number;
}

export interface CriticalAlertRecord {
  id: string;
  studyId: string;
  patientName: string;
  mrn: string;
  modality: ModalityType;
  findingSummary: string;
  orderingDoctor: string;
  orderingDoctorPhone: string;
  radiologistName: string;
  timestamp: string;
  notificationMethod: "Phone Call" | "SMS" | "HIS Direct Alert" | "WhatsApp Emergency";
  status: "Pending Notification" | "Notified & Documented" | "Acknowledged";
  acknowledgedBy?: string;
  acknowledgeTime?: string;
  notes?: string;
}

export interface EquipmentModality {
  id: string;
  name: string;
  code: string;
  modality: ModalityType;
  room: string;
  aeTitle: string;
  ipAddress: string;
  port: number;
  status: "Online" | "In-Use" | "Calibration" | "Maintenance" | "Offline";
  lastCalibrationDate: string;
  nextMaintenanceDate: string;
  tubeUsageHours?: number;
  contractVendor: string;
  serialNumber: string;
}

export interface QualityAnalysisRecord {
  id: string;
  studyId: string;
  modality: ModalityType;
  technicianName: string;
  imageQualityScore: 1 | 2 | 3 | 4 | 5; // 5 = Pristine, 1 = Poor
  rejectedImagesCount: number;
  repeatReason?: "Patient Motion" | "Positioning Error" | "Under/Over Exposure" | "Artifacts" | "Equipment Fault";
  qaComments: string;
  reviewedBy: string;
  date: string;
}

export interface ContrastInventoryItem {
  id: string;
  name: string;
  type: "Iodinated" | "Gadolinium" | "Barium" | "Microbubble";
  brand: string;
  concentration: string;
  stockVials: number;
  minThreshold: number;
  unitPrice: number;
  expiryDate: string;
  batchNumber: string;
}

export interface RadiologyConsumable {
  id: string;
  name: string;
  category: "Film" | "Contrast" | "Catheter" | "Syringe" | "Paper" | "Protective";
  stockQty: number;
  unit: string;
  minLevel: number;
  expiryDate: string;
}

export interface RadiologyStaffShift {
  id: string;
  staffName: string;
  role: "Consultant Radiologist" | "Senior Technologist" | "Radiology Nurse" | "PACS Admin";
  modalityAssigned: ModalityType;
  shiftType: "Morning" | "Evening" | "Night" | "On-Call";
  assignedRoom: string;
  studiesCompletedToday: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: "VIEW_STUDY" | "DOWNLOAD_DICOM" | "EDIT_REPORT" | "SIGN_REPORT" | "CRITICAL_ALERT" | "EXPORT_CD";
  studyId: string;
  patientMrn: string;
  ipAddress: string;
  details: string;
}
