import { pgTable, text, integer, numeric, jsonb, timestamp } from "drizzle-orm/pg-core";

export const patients = pgTable("patients", {
  id: text("id").primaryKey(),
  mrn: text("mrn").notNull(),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  phone: text("phone").notNull(),
  status: text("status").notNull(),
  insurance: text("insurance"),
  insuranceId: text("insurance_id"),
  policyNo: text("policy_no"),
  clinicalData: jsonb("clinical_data"),
  journey: jsonb("journey").default('[]'),
});

export const visits = pgTable("visits", {
  id: text("id").primaryKey(),
  patientId: text("patient_id").notNull(),
  patientMRN: text("patient_mrn").notNull(),
  visitType: text("visit_type").notNull(), // 'OPD', 'IPD', 'ER'
  status: text("status").notNull().default('active'), // 'active', 'discharged', 'cancelled'
  currentStage: text("current_stage").notNull(), // 'triage', 'doctor_consultation', 'lab', etc.
  startTime: text("start_time").notNull(),
  endTime: text("end_time"),
  totalEstimatedBill: numeric("total_estimated_bill").default('0'),
  doctorId: text("doctor_id"),
  deptId: text("dept_id"),
});

export const insuranceProviders = pgTable("insurance_providers", {
  id: text("id").primaryKey(),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar").notNull(),
  code: text("code").notNull().unique(),
  contactEmail: text("contact_email"),
  coverageDetails: jsonb("coverage_details"),
  status: text("status").notNull().default('active'),
});

export const billingCharges = pgTable("billing_charges", {
  id: text("id").primaryKey(),
  visitId: text("visit_id").notNull(),
  patientId: text("patient_id").notNull(),
  serviceId: text("service_id").notNull(),
  serviceName: text("service_name").notNull(),
  category: text("category").notNull(), // 'consultation', 'lab', 'rad', 'pharmacy', 'consumable'
  amount: numeric("amount").notNull(),
  insuranceCovered: numeric("insurance_covered").default('0'),
  patientPayable: numeric("patient_payable").notNull(),
  status: text("status").notNull().default('pending'), // 'pending', 'paid', 'claimed'
  orderId: text("order_id"),
  staffId: text("staff_id"),
  createdAt: text("created_at").notNull(),
});

export const labTestsStructured = pgTable("lab_results_structured", {
  id: text("id").primaryKey(),
  visitId: text("visit_id"),
  patientId: text("patient_id").notNull(),
  testName: text("test_name").notNull(),
  value: text("value").notNull(),
  unit: text("unit"),
  flag: text("flag"), // 'normal', 'high', 'low', 'critical'
  referenceRange: text("reference_range"),
  performedBy: text("performed_by"),
  orderId: text("order_id"),
  createdAt: text("created_at").notNull(),
});

export const radiologyReportsStructured = pgTable("radiology_reports_structured", {
  id: text("id").primaryKey(),
  visitId: text("visit_id"),
  patientId: text("patient_id").notNull(),
  studyName: text("study_name").notNull(),
  modality: text("modality").notNull(),
  findings: text("findings").notNull(),
  impression: text("impression").notNull(),
  radiologistId: text("radiologist_id"),
  orderId: text("order_id"),
  createdAt: text("created_at").notNull(),
});

export const consumables = pgTable("consumables", {
  id: text("id").primaryKey(),
  patientId: text("patient_id").notNull(),
  itemName: text("item_name").notNull(),
  transactionNo: text("transaction_no").notNull().unique(),
  store: text("store").notNull(),
  quantity: numeric("quantity").notNull(),
  status: text("status").default('Confirmed'),
  transactionDate: text("transaction_date").notNull(),
});

export const events = pgTable("events", {
  id: text("id").primaryKey(),
  eventType: text("event_type").notNull(),
  patientId: text("patient_id"),
  payload: jsonb("payload").notNull(),
  createdAt: text("created_at").notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  userId: text("user_id"),
  changes: jsonb("changes"),
  createdAt: text("created_at").notNull(),
});

export const inventory = pgTable("inventory", {
  id: text("id").primaryKey(),
  itemName: text("item_name").notNull(),
  store: text("store").notNull(),
  currentQuantity: numeric("current_quantity").notNull(),
  minQuantity: numeric("min_quantity").default('0'),
  lastUpdated: text("last_updated").notNull(),
});

export const prescriptions = pgTable("prescriptions", {
  id: text("id").primaryKey(),
  patientId: text("patient_id").notNull(),
  medication: text("medication").notNull(),
  dose: text("dose").notNull(),
  qty: integer("qty").notNull(),
  status: text("status").notNull(),
  date: text("date").notNull(),
});

export const invoices = pgTable("invoices", {
  id: text("id").primaryKey(),
  patientId: text("patient_id").notNull(),
  amount: numeric("amount").notNull(),
  status: text("status").notNull(),
  date: text("date").notNull(),
});

export const staff = pgTable("staff", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  department: text("department").notNull(),
});

export const logs = pgTable("logs", {
  id: text("id").primaryKey(),
  message: text("message").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const dutyTasks = pgTable("duty_tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  status: text("status").notNull(),
});

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  message: text("message").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  senderNameAr: text("sender_name_ar").notNull(),
  senderNameEn: text("sender_name_en").notNull(),
  content: text("content").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
});

export const surgicalTheatres = pgTable("surgical_theatres", {
  id: text("id").primaryKey(),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar").notNull(),
  status: text("status").notNull().default('available'), // 'available', 'occupied', 'maintenance'
  type: text("type"), // 'major', 'minor', 'cath_lab'
  location: text("location"),
});

export const surgicalSchedules = pgTable("surgical_schedules", {
  id: text("id").primaryKey(),
  patientId: text("patient_id").notNull(),
  visitId: text("visit_id"),
  procedureNameEn: text("procedure_name_en").notNull(),
  procedureNameAr: text("procedure_name_ar").notNull(),
  theatreId: text("theatre_id").notNull(),
  surgeonId: text("surgeon_id").notNull(),
  anesthesiologistId: text("anesthesiologist_id"),
  scheduledStartTime: text("scheduled_start_time").notNull(),
  estimatedDuration: integer("estimated_duration"), // in minutes
  status: text("status").notNull().default('scheduled'), // 'scheduled', 'pre_op', 'in_surgery', 'post_op', 'completed', 'cancelled'
  anesthesiaType: text("anesthesia_type"),
  urgency: text("urgency").default('elective'), // 'elective', 'urgent', 'emergency'
  clinicalNotes: text("clinical_notes"),
  createdAt: text("created_at").notNull(),
});

export const surgicalTeam = pgTable("surgical_team", {
  id: text("id").primaryKey(),
  surgeryId: text("surgery_id").notNull(),
  staffId: text("staff_id").notNull(),
  role: text("role").notNull(), // 'surgeon', 'assistant_surgeon', 'scrub_nurse', 'circulating_nurse', 'anesthesiologist'
});

export const surgicalLogs = pgTable("surgical_logs", {
  id: text("id").primaryKey(),
  surgeryId: text("surgery_id").notNull(),
  eventType: text("event_type").notNull(), // 'patient_in', 'anesthesia_start', 'incision', 'closure', 'anesthesia_end', 'patient_out'
  timestamp: text("timestamp").notNull(),
  performedBy: text("performed_by"),
  notes: text("notes"),
});

export const marRecords = pgTable("mar_records", {
  id: text("id").primaryKey(),
  patientId: text("patient_id").notNull(),
  prescriptionId: text("prescription_id").notNull(),
  medicationName: text("medication_name").notNull(),
  dosage: text("dosage").notNull(),
  route: text("route").notNull(),
  scheduledTime: text("scheduled_time").notNull(),
  administeredTime: text("administered_time"),
  administeredBy: text("administered_by"),
  status: text("status").notNull().default('scheduled'), // 'scheduled', 'administered', 'held', 'refused'
  notes: text("notes"),
});

export const medicationStockLedger = pgTable("medication_stock_ledger", {
  id: text("id").primaryKey(),
  medicationId: text("medication_id").notNull(),
  storeId: text("store_id").notNull(),
  transactionType: text("transaction_type").notNull(), // 'purchase', 'dispense', 'return', 'adjustment'
  quantity: numeric("quantity").notNull(),
  batchNo: text("batch_no"),
  expiryDate: text("expiry_date"),
  performedBy: text("performed_by").notNull(),
  timestamp: text("timestamp").notNull(),
  referenceId: text("reference_id"), // visitId or prescriptionId
});

export const allergies = pgTable("allergies", {
  id: text("id").primaryKey(),
  patientId: text("patient_id").notNull(),
  allergen: text("allergen").notNull(),
  severity: text("severity").notNull(), // 'mild', 'moderate', 'severe'
  reaction: text("reaction"),
  onsetDate: text("onset_date"),
  status: text("status").notNull().default('active'),
  createdAt: text("created_at").notNull(),
});

export const collectionsStore = pgTable("collections_store", {
  id: text("id").primaryKey(),
  collectionName: text("collection_name").notNull(),
  data: jsonb("data").notNull(),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});
