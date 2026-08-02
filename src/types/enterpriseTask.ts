/**
 * Enterprise Task Management System Types
 * Unified Task Center for Hospital Information System (HIS)
 */

export type HospitalDepartmentId =
  | "registration"
  | "opd"
  | "ipd"
  | "er"
  | "icu"
  | "ccu"
  | "nicu"
  | "or"
  | "pacu"
  | "dialysis"
  | "endoscopy"
  | "cath_lab"
  | "lis"
  | "ris"
  | "blood_bank"
  | "pharmacy"
  | "nursing"
  | "physiotherapy"
  | "nutrition"
  | "infection_control"
  | "cssd"
  | "housekeeping"
  | "maintenance"
  | "biomedical"
  | "medical_records"
  | "billing"
  | "finance"
  | "hr"
  | "quality"
  | "administration"
  | "security"
  | "ambulance"
  | "mortuary"
  | "referral"
  | "home_healthcare"
  | "telemedicine";

export type TaskCategory =
  | "clinical"
  | "laboratory"
  | "radiology"
  | "pharmacy"
  | "operating_room"
  | "icu"
  | "infection_control"
  | "maintenance"
  | "administrative";

export type ClinicalSubtype =
  | "physician"
  | "nursing"
  | "medication"
  | "procedure"
  | "assessment"
  | "reassessment"
  | "consultation"
  | "referral"
  | "discharge"
  | "admission"
  | "transfer";

export type LabSubtype =
  | "sample_collection"
  | "sample_receiving"
  | "sample_processing"
  | "result_validation"
  | "critical_result_notification";

export type RadSubtype =
  | "schedule_exam"
  | "patient_preparation"
  | "perform_scan"
  | "reporting"
  | "report_validation";

export type PharmacySubtype =
  | "verify_prescription"
  | "dispense_medication"
  | "medication_preparation"
  | "medication_delivery";

export type ORSubtype =
  | "schedule_surgery"
  | "patient_prep"
  | "instrument_prep"
  | "time_out"
  | "surgery_start"
  | "surgery_end"
  | "recovery_followup";

export type ICUSubtype =
  | "hourly_assessment"
  | "ventilator_check"
  | "abg_review"
  | "medication_review"
  | "device_check";

export type InfectionControlSubtype =
  | "isolation_review"
  | "culture_followup"
  | "infection_audit";

export type MaintenanceSubtype =
  | "device_maintenance"
  | "equipment_repair"
  | "room_maintenance";

export type AdminSubtype =
  | "approvals"
  | "hr_tasks"
  | "financial_tasks"
  | "inventory_tasks"
  | "purchasing_tasks"
  | "quality_tasks";

export type TaskPriority =
  | "code_blue"
  | "critical"
  | "stat"
  | "urgent"
  | "high"
  | "medium"
  | "normal"
  | "low";

export type TaskStatus =
  | "draft"
  | "new"
  | "assigned"
  | "accepted"
  | "in_progress"
  | "waiting"
  | "pending_approval"
  | "escalated"
  | "completed"
  | "verified"
  | "closed"
  | "cancelled"
  | "rejected"
  | "expired";

export type AutoTaskTriggerEvent =
  | "new_patient_registered"
  | "appointment_booked"
  | "patient_admitted"
  | "patient_discharged"
  | "patient_transferred"
  | "lab_ordered"
  | "radiology_ordered"
  | "medication_prescribed"
  | "surgery_scheduled"
  | "patient_transport_requested"
  | "critical_result_flagged"
  | "medical_order_delayed"
  | "medication_expired"
  | "low_stock_warning"
  | "device_fault_detected"
  | "maintenance_due"
  | "patient_complaint"
  | "safety_incident"
  | "consultation_requested"
  | "blood_request_issued"
  | "code_blue_triggered"
  | "stroke_alert"
  | "stemi_alert"
  | "trauma_activation"
  | "mass_casualty_incident";

export interface TaskAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface TaskNote {
  id: string;
  authorId: string;
  authorName: string;
  role: string;
  content: string;
  timestamp: string;
  isInternal?: boolean;
}

export interface TaskAuditLog {
  id: string;
  taskId: string;
  action: string;
  performedBy: string;
  performedByName: string;
  previousStatus?: TaskStatus;
  newStatus?: TaskStatus;
  timestamp: string;
  details: string;
  ipAddress?: string;
}

export interface EnterpriseTask {
  id: string;
  taskNumber: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  category: TaskCategory;
  subtype: string;
  priority: TaskPriority;
  status: TaskStatus;
  
  // Department & Assignment Links
  originDepartment: HospitalDepartmentId;
  targetDepartment: HospitalDepartmentId;
  assignedToUserId?: string;
  assignedToUserName?: string;
  assignedToRole?: string;
  createdById: string;
  createdByName: string;
  
  // Patient / Case Links
  patientId?: string;
  patientMRN?: string;
  patientNameAr?: string;
  patientNameEn?: string;
  visitId?: string;
  orderId?: string;
  bedId?: string;
  roomId?: string;
  
  // Workflow & Timing
  progressPercentage: number;
  slaMinutes: number;
  createdAt: string;
  dueAt: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  verifiedAt?: string;
  closedAt?: string;
  
  // Escalation & Verification
  isEscalated: boolean;
  escalationLevel: number; // 0 = none, 1 = supervisor, 2 = head of dept, 3 = medical director
  escalatedTo?: string;
  requiresApproval: boolean;
  approvedBy?: string;
  verifiedBy?: string;
  
  // Data Payload (Lab Delta checks, Image studies, Maintenance parameters, etc.)
  payload?: Record<string, any>;
  notes: TaskNote[];
  attachments: TaskAttachment[];
  auditLogs: TaskAuditLog[];
  
  // Auto-Engine Meta
  isAutoGenerated?: boolean;
  triggerEvent?: AutoTaskTriggerEvent;
  recurringCron?: string;
}

export interface TaskTemplate {
  id: string;
  code: string;
  titleAr: string;
  titleEn: string;
  category: TaskCategory;
  subtype: string;
  defaultPriority: TaskPriority;
  targetDepartment: HospitalDepartmentId;
  defaultSlaMinutes: number;
  descriptionAr: string;
  descriptionEn: string;
  requiresApproval: boolean;
  checklistItems: { id: string; textAr: string; textEn: string; isRequired: boolean }[];
}

export interface TaskFilterState {
  department: HospitalDepartmentId | "all";
  category: TaskCategory | "all";
  status: TaskStatus | "all";
  priority: TaskPriority | "all";
  searchQuery: string;
  myTasksOnly: boolean;
  escalatedOnly: boolean;
  patientMRN?: string;
}
