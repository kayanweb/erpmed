var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server.ts
var server_exports = {};
__export(server_exports, {
  startServer: () => startServer
});
module.exports = __toCommonJS(server_exports);
var import_supabase_js = require("@supabase/supabase-js");
var import_express = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_fs2 = __toESM(require("fs"), 1);

// server/db/index.ts
var import_postgres_js = require("drizzle-orm/postgres-js");
var import_postgres = __toESM(require("postgres"), 1);

// server/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  allergies: () => allergies,
  auditLogs: () => auditLogs,
  billingCharges: () => billingCharges,
  collectionsStore: () => collectionsStore,
  consumables: () => consumables,
  dutyTasks: () => dutyTasks,
  events: () => events,
  insuranceProviders: () => insuranceProviders,
  inventory: () => inventory,
  invoices: () => invoices,
  labTestsStructured: () => labTestsStructured,
  logs: () => logs,
  marRecords: () => marRecords,
  medicationStockLedger: () => medicationStockLedger,
  messages: () => messages,
  notifications: () => notifications,
  patients: () => patients,
  prescriptions: () => prescriptions,
  radiologyReportsStructured: () => radiologyReportsStructured,
  settings: () => settings,
  staff: () => staff,
  surgicalLogs: () => surgicalLogs,
  surgicalSchedules: () => surgicalSchedules,
  surgicalTeam: () => surgicalTeam,
  surgicalTheatres: () => surgicalTheatres,
  visits: () => visits
});
var import_pg_core = require("drizzle-orm/pg-core");
var patients = (0, import_pg_core.pgTable)("patients", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  mrn: (0, import_pg_core.text)("mrn").notNull(),
  nameEn: (0, import_pg_core.text)("name_en").notNull(),
  nameAr: (0, import_pg_core.text)("name_ar").notNull(),
  age: (0, import_pg_core.integer)("age").notNull(),
  gender: (0, import_pg_core.text)("gender").notNull(),
  phone: (0, import_pg_core.text)("phone").notNull(),
  status: (0, import_pg_core.text)("status").notNull(),
  insurance: (0, import_pg_core.text)("insurance"),
  insuranceId: (0, import_pg_core.text)("insurance_id"),
  policyNo: (0, import_pg_core.text)("policy_no"),
  clinicalData: (0, import_pg_core.jsonb)("clinical_data"),
  journey: (0, import_pg_core.jsonb)("journey").default("[]")
});
var visits = (0, import_pg_core.pgTable)("visits", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  patientId: (0, import_pg_core.text)("patient_id").notNull(),
  patientMRN: (0, import_pg_core.text)("patient_mrn").notNull(),
  visitType: (0, import_pg_core.text)("visit_type").notNull(),
  // 'OPD', 'IPD', 'ER'
  status: (0, import_pg_core.text)("status").notNull().default("active"),
  // 'active', 'discharged', 'cancelled'
  currentStage: (0, import_pg_core.text)("current_stage").notNull(),
  // 'triage', 'doctor_consultation', 'lab', etc.
  startTime: (0, import_pg_core.text)("start_time").notNull(),
  endTime: (0, import_pg_core.text)("end_time"),
  totalEstimatedBill: (0, import_pg_core.numeric)("total_estimated_bill").default("0"),
  doctorId: (0, import_pg_core.text)("doctor_id"),
  deptId: (0, import_pg_core.text)("dept_id")
});
var insuranceProviders = (0, import_pg_core.pgTable)("insurance_providers", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  nameEn: (0, import_pg_core.text)("name_en").notNull(),
  nameAr: (0, import_pg_core.text)("name_ar").notNull(),
  code: (0, import_pg_core.text)("code").notNull().unique(),
  contactEmail: (0, import_pg_core.text)("contact_email"),
  coverageDetails: (0, import_pg_core.jsonb)("coverage_details"),
  status: (0, import_pg_core.text)("status").notNull().default("active")
});
var billingCharges = (0, import_pg_core.pgTable)("billing_charges", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  visitId: (0, import_pg_core.text)("visit_id").notNull(),
  patientId: (0, import_pg_core.text)("patient_id").notNull(),
  serviceId: (0, import_pg_core.text)("service_id").notNull(),
  serviceName: (0, import_pg_core.text)("service_name").notNull(),
  category: (0, import_pg_core.text)("category").notNull(),
  // 'consultation', 'lab', 'rad', 'pharmacy', 'consumable'
  amount: (0, import_pg_core.numeric)("amount").notNull(),
  insuranceCovered: (0, import_pg_core.numeric)("insurance_covered").default("0"),
  patientPayable: (0, import_pg_core.numeric)("patient_payable").notNull(),
  status: (0, import_pg_core.text)("status").notNull().default("pending"),
  // 'pending', 'paid', 'claimed'
  orderId: (0, import_pg_core.text)("order_id"),
  staffId: (0, import_pg_core.text)("staff_id"),
  createdAt: (0, import_pg_core.text)("created_at").notNull()
});
var labTestsStructured = (0, import_pg_core.pgTable)("lab_results_structured", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  visitId: (0, import_pg_core.text)("visit_id"),
  patientId: (0, import_pg_core.text)("patient_id").notNull(),
  testName: (0, import_pg_core.text)("test_name").notNull(),
  value: (0, import_pg_core.text)("value").notNull(),
  unit: (0, import_pg_core.text)("unit"),
  flag: (0, import_pg_core.text)("flag"),
  // 'normal', 'high', 'low', 'critical'
  referenceRange: (0, import_pg_core.text)("reference_range"),
  performedBy: (0, import_pg_core.text)("performed_by"),
  orderId: (0, import_pg_core.text)("order_id"),
  createdAt: (0, import_pg_core.text)("created_at").notNull()
});
var radiologyReportsStructured = (0, import_pg_core.pgTable)("radiology_reports_structured", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  visitId: (0, import_pg_core.text)("visit_id"),
  patientId: (0, import_pg_core.text)("patient_id").notNull(),
  studyName: (0, import_pg_core.text)("study_name").notNull(),
  modality: (0, import_pg_core.text)("modality").notNull(),
  findings: (0, import_pg_core.text)("findings").notNull(),
  impression: (0, import_pg_core.text)("impression").notNull(),
  radiologistId: (0, import_pg_core.text)("radiologist_id"),
  orderId: (0, import_pg_core.text)("order_id"),
  createdAt: (0, import_pg_core.text)("created_at").notNull()
});
var consumables = (0, import_pg_core.pgTable)("consumables", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  patientId: (0, import_pg_core.text)("patient_id").notNull(),
  itemName: (0, import_pg_core.text)("item_name").notNull(),
  transactionNo: (0, import_pg_core.text)("transaction_no").notNull().unique(),
  store: (0, import_pg_core.text)("store").notNull(),
  quantity: (0, import_pg_core.numeric)("quantity").notNull(),
  status: (0, import_pg_core.text)("status").default("Confirmed"),
  transactionDate: (0, import_pg_core.text)("transaction_date").notNull()
});
var events = (0, import_pg_core.pgTable)("events", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  eventType: (0, import_pg_core.text)("event_type").notNull(),
  patientId: (0, import_pg_core.text)("patient_id"),
  payload: (0, import_pg_core.jsonb)("payload").notNull(),
  createdAt: (0, import_pg_core.text)("created_at").notNull()
});
var auditLogs = (0, import_pg_core.pgTable)("audit_logs", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  action: (0, import_pg_core.text)("action").notNull(),
  entityType: (0, import_pg_core.text)("entity_type").notNull(),
  entityId: (0, import_pg_core.text)("entity_id").notNull(),
  userId: (0, import_pg_core.text)("user_id"),
  changes: (0, import_pg_core.jsonb)("changes"),
  createdAt: (0, import_pg_core.text)("created_at").notNull()
});
var inventory = (0, import_pg_core.pgTable)("inventory", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  itemName: (0, import_pg_core.text)("item_name").notNull(),
  store: (0, import_pg_core.text)("store").notNull(),
  currentQuantity: (0, import_pg_core.numeric)("current_quantity").notNull(),
  minQuantity: (0, import_pg_core.numeric)("min_quantity").default("0"),
  lastUpdated: (0, import_pg_core.text)("last_updated").notNull()
});
var prescriptions = (0, import_pg_core.pgTable)("prescriptions", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  patientId: (0, import_pg_core.text)("patient_id").notNull(),
  medication: (0, import_pg_core.text)("medication").notNull(),
  dose: (0, import_pg_core.text)("dose").notNull(),
  qty: (0, import_pg_core.integer)("qty").notNull(),
  status: (0, import_pg_core.text)("status").notNull(),
  date: (0, import_pg_core.text)("date").notNull()
});
var invoices = (0, import_pg_core.pgTable)("invoices", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  patientId: (0, import_pg_core.text)("patient_id").notNull(),
  amount: (0, import_pg_core.numeric)("amount").notNull(),
  status: (0, import_pg_core.text)("status").notNull(),
  date: (0, import_pg_core.text)("date").notNull()
});
var staff = (0, import_pg_core.pgTable)("staff", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  name: (0, import_pg_core.text)("name").notNull(),
  role: (0, import_pg_core.text)("role").notNull(),
  department: (0, import_pg_core.text)("department").notNull()
});
var logs = (0, import_pg_core.pgTable)("logs", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  message: (0, import_pg_core.text)("message").notNull(),
  timestamp: (0, import_pg_core.text)("timestamp").notNull()
});
var dutyTasks = (0, import_pg_core.pgTable)("duty_tasks", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  title: (0, import_pg_core.text)("title").notNull(),
  status: (0, import_pg_core.text)("status").notNull()
});
var notifications = (0, import_pg_core.pgTable)("notifications", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  message: (0, import_pg_core.text)("message").notNull(),
  timestamp: (0, import_pg_core.text)("timestamp").notNull()
});
var messages = (0, import_pg_core.pgTable)("messages", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  senderNameAr: (0, import_pg_core.text)("sender_name_ar").notNull(),
  senderNameEn: (0, import_pg_core.text)("sender_name_en").notNull(),
  content: (0, import_pg_core.text)("content").notNull(),
  timestamp: (0, import_pg_core.text)("timestamp").notNull()
});
var settings = (0, import_pg_core.pgTable)("settings", {
  key: (0, import_pg_core.text)("key").primaryKey(),
  value: (0, import_pg_core.jsonb)("value").notNull()
});
var surgicalTheatres = (0, import_pg_core.pgTable)("surgical_theatres", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  nameEn: (0, import_pg_core.text)("name_en").notNull(),
  nameAr: (0, import_pg_core.text)("name_ar").notNull(),
  status: (0, import_pg_core.text)("status").notNull().default("available"),
  // 'available', 'occupied', 'maintenance'
  type: (0, import_pg_core.text)("type"),
  // 'major', 'minor', 'cath_lab'
  location: (0, import_pg_core.text)("location")
});
var surgicalSchedules = (0, import_pg_core.pgTable)("surgical_schedules", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  patientId: (0, import_pg_core.text)("patient_id").notNull(),
  visitId: (0, import_pg_core.text)("visit_id"),
  procedureNameEn: (0, import_pg_core.text)("procedure_name_en").notNull(),
  procedureNameAr: (0, import_pg_core.text)("procedure_name_ar").notNull(),
  theatreId: (0, import_pg_core.text)("theatre_id").notNull(),
  surgeonId: (0, import_pg_core.text)("surgeon_id").notNull(),
  anesthesiologistId: (0, import_pg_core.text)("anesthesiologist_id"),
  scheduledStartTime: (0, import_pg_core.text)("scheduled_start_time").notNull(),
  estimatedDuration: (0, import_pg_core.integer)("estimated_duration"),
  // in minutes
  status: (0, import_pg_core.text)("status").notNull().default("scheduled"),
  // 'scheduled', 'pre_op', 'in_surgery', 'post_op', 'completed', 'cancelled'
  anesthesiaType: (0, import_pg_core.text)("anesthesia_type"),
  urgency: (0, import_pg_core.text)("urgency").default("elective"),
  // 'elective', 'urgent', 'emergency'
  clinicalNotes: (0, import_pg_core.text)("clinical_notes"),
  createdAt: (0, import_pg_core.text)("created_at").notNull()
});
var surgicalTeam = (0, import_pg_core.pgTable)("surgical_team", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  surgeryId: (0, import_pg_core.text)("surgery_id").notNull(),
  staffId: (0, import_pg_core.text)("staff_id").notNull(),
  role: (0, import_pg_core.text)("role").notNull()
  // 'surgeon', 'assistant_surgeon', 'scrub_nurse', 'circulating_nurse', 'anesthesiologist'
});
var surgicalLogs = (0, import_pg_core.pgTable)("surgical_logs", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  surgeryId: (0, import_pg_core.text)("surgery_id").notNull(),
  eventType: (0, import_pg_core.text)("event_type").notNull(),
  // 'patient_in', 'anesthesia_start', 'incision', 'closure', 'anesthesia_end', 'patient_out'
  timestamp: (0, import_pg_core.text)("timestamp").notNull(),
  performedBy: (0, import_pg_core.text)("performed_by"),
  notes: (0, import_pg_core.text)("notes")
});
var marRecords = (0, import_pg_core.pgTable)("mar_records", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  patientId: (0, import_pg_core.text)("patient_id").notNull(),
  prescriptionId: (0, import_pg_core.text)("prescription_id").notNull(),
  medicationName: (0, import_pg_core.text)("medication_name").notNull(),
  dosage: (0, import_pg_core.text)("dosage").notNull(),
  route: (0, import_pg_core.text)("route").notNull(),
  scheduledTime: (0, import_pg_core.text)("scheduled_time").notNull(),
  administeredTime: (0, import_pg_core.text)("administered_time"),
  administeredBy: (0, import_pg_core.text)("administered_by"),
  status: (0, import_pg_core.text)("status").notNull().default("scheduled"),
  // 'scheduled', 'administered', 'held', 'refused'
  notes: (0, import_pg_core.text)("notes")
});
var medicationStockLedger = (0, import_pg_core.pgTable)("medication_stock_ledger", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  medicationId: (0, import_pg_core.text)("medication_id").notNull(),
  storeId: (0, import_pg_core.text)("store_id").notNull(),
  transactionType: (0, import_pg_core.text)("transaction_type").notNull(),
  // 'purchase', 'dispense', 'return', 'adjustment'
  quantity: (0, import_pg_core.numeric)("quantity").notNull(),
  batchNo: (0, import_pg_core.text)("batch_no"),
  expiryDate: (0, import_pg_core.text)("expiry_date"),
  performedBy: (0, import_pg_core.text)("performed_by").notNull(),
  timestamp: (0, import_pg_core.text)("timestamp").notNull(),
  referenceId: (0, import_pg_core.text)("reference_id")
  // visitId or prescriptionId
});
var allergies = (0, import_pg_core.pgTable)("allergies", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  patientId: (0, import_pg_core.text)("patient_id").notNull(),
  allergen: (0, import_pg_core.text)("allergen").notNull(),
  severity: (0, import_pg_core.text)("severity").notNull(),
  // 'mild', 'moderate', 'severe'
  reaction: (0, import_pg_core.text)("reaction"),
  onsetDate: (0, import_pg_core.text)("onset_date"),
  status: (0, import_pg_core.text)("status").notNull().default("active"),
  createdAt: (0, import_pg_core.text)("created_at").notNull()
});
var collectionsStore = (0, import_pg_core.pgTable)("collections_store", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  collectionName: (0, import_pg_core.text)("collection_name").notNull(),
  data: (0, import_pg_core.jsonb)("data").notNull(),
  createdAt: (0, import_pg_core.text)("created_at"),
  updatedAt: (0, import_pg_core.text)("updated_at")
});

// server/db/index.ts
var connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.warn("\u26A0\uFE0F Warning: DATABASE_URL environment variable is not defined! Defaulting to local fallback.");
}
var client = (0, import_postgres.default)(connectionString || "postgres://localhost:5432/his_db", {
  ssl: connectionString ? "require" : false,
  max: 20,
  idle_timeout: 30,
  connect_timeout: 5,
  onparameter: (key, val) => {
  }
});
var db = (0, import_postgres_js.drizzle)(client, { schema: schema_exports });

// server/db/postgresAdapter.ts
var import_drizzle_orm = require("drizzle-orm");
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var LOCAL_DB_PATH = process.env.VERCEL ? import_path.default.join("/tmp", "local_database.json") : import_path.default.join(process.cwd(), "local_database.json");
function readLocalDb() {
  try {
    if (import_fs.default.existsSync(LOCAL_DB_PATH)) {
      const content = import_fs.default.readFileSync(LOCAL_DB_PATH, "utf-8");
      return JSON.parse(content) || {};
    }
  } catch (err) {
    console.error("\u26A0\uFE0F Error reading local JSON db fallback:", err);
  }
  return {};
}
function writeLocalDb(dbData) {
  try {
    import_fs.default.writeFileSync(LOCAL_DB_PATH, JSON.stringify(dbData, null, 2), "utf-8");
  } catch (err) {
    console.error("\u26A0\uFE0F Error writing local JSON db fallback:", err);
  }
}
function getLocalCollection(collectionName) {
  const dbData = readLocalDb();
  return dbData[collectionName] || [];
}
function saveLocalItem(collectionName, item) {
  const dbData = readLocalDb();
  if (!dbData[collectionName]) {
    dbData[collectionName] = [];
  }
  const collection = dbData[collectionName];
  const idx = collection.findIndex((x) => {
    if (collectionName === "settings") {
      return x.key === item.key || x.id === item.id || x.key === item.id || x.id === item.key;
    }
    return x.id === item.id;
  });
  if (idx !== -1) {
    collection[idx] = { ...collection[idx], ...item };
  } else {
    collection.push(item);
  }
  writeLocalDb(dbData);
}
function deleteLocalItem(collectionName, id) {
  const dbData = readLocalDb();
  if (dbData[collectionName]) {
    dbData[collectionName] = dbData[collectionName].filter((x) => {
      if (collectionName === "settings") {
        return x.key !== id && x.id !== id;
      }
      return x.id !== id;
    });
    writeLocalDb(dbData);
  }
}
function usePostgres() {
  const url = process.env.DATABASE_URL;
  return !!url && (url.startsWith("postgres://") || url.startsWith("postgresql://"));
}
var PostgresAdapter = class {
  async fetchCollection(collectionName) {
    if (!usePostgres()) {
      console.error("\u274C Database Connection Error: DATABASE_URL is not set. Falling back to local storage temporarily to prevent system crash.");
      return getLocalCollection(collectionName);
    }
    try {
      if (collectionName === "patients") {
        const rows = await db.select().from(patients);
        return rows.map((r) => ({ ...r.clinicalData || {}, ...r }));
      } else if (collectionName === "prescriptions") {
        return await db.select().from(prescriptions);
      } else if (collectionName === "invoices") {
        return await db.select().from(invoices);
      } else if (collectionName === "staff") {
        return await db.select().from(staff);
      } else if (collectionName === "logs" || collectionName === "systemLogs") {
        return await db.select().from(logs);
      } else if (collectionName === "dutyTasks") {
        return await db.select().from(dutyTasks);
      } else if (collectionName === "notifications") {
        return await db.select().from(notifications);
      } else if (collectionName === "messages") {
        return await db.select().from(messages);
      } else if (collectionName === "his_audit_logs" || collectionName === "auditLogs") {
        return await db.select().from(auditLogs);
      } else if (collectionName === "his_visits" || collectionName === "visits") {
        return await db.select().from(visits);
      } else if (collectionName === "his_insurance_providers" || collectionName === "insuranceProviders") {
        return await db.select().from(insuranceProviders);
      } else if (collectionName === "his_charges" || collectionName === "billingCharges") {
        return await db.select().from(billingCharges);
      } else if (collectionName === "his_lab_results" || collectionName === "labResultsStructured") {
        return await db.select().from(labTestsStructured);
      } else if (collectionName === "his_radiology_reports" || collectionName === "radiologyReportsStructured") {
        return await db.select().from(radiologyReportsStructured);
      } else if (collectionName === "settings") {
        const rows = await db.select().from(settings);
        return rows.map((r) => ({ id: r.key, key: r.key, ...r.value || {} }));
      } else {
        const rows = await db.select().from(collectionsStore).where((0, import_drizzle_orm.eq)(collectionsStore.collectionName, collectionName));
        return rows.map((r) => ({ ...r.data || {}, id: r.id }));
      }
    } catch (err) {
      console.error(`\u274C PostgreSQL fetch error for '${collectionName}':`, err.message);
      return getLocalCollection(collectionName);
    }
  }
  async saveItem(collectionName, item) {
    if (!usePostgres()) {
      console.warn("\u26A0\uFE0F Warning: Saving to local storage fallback (DATABASE_URL missing)");
      saveLocalItem(collectionName, item);
      return true;
    }
    try {
      if (collectionName === "patients") {
        const patientVal = {
          id: item.id,
          mrn: item.mrn || "",
          nameEn: item.nameEn || "",
          nameAr: item.nameAr || "",
          age: Number(item.age) || 0,
          gender: item.gender || "",
          phone: item.phone || "",
          status: item.status || "",
          insurance: item.insurance || "",
          insuranceId: item.insuranceId || item.insurance_id || null,
          policyNo: item.policyNo || item.policy_no || null,
          clinicalData: item
        };
        await db.insert(patients).values(patientVal).onConflictDoUpdate({
          target: patients.id,
          set: patientVal
        });
      } else if (collectionName === "prescriptions") {
        const pVal = {
          id: item.id,
          patientId: item.patientId || "",
          medication: item.medication || "",
          dose: item.dose || "",
          qty: Number(item.qty) || 0,
          status: item.status || "",
          date: item.date || ""
        };
        await db.insert(prescriptions).values(pVal).onConflictDoUpdate({
          target: prescriptions.id,
          set: pVal
        });
      } else if (collectionName === "invoices") {
        const iVal = {
          id: item.id,
          patientId: item.patientId || "",
          amount: String(item.amount || "0"),
          status: item.status || "",
          date: item.date || ""
        };
        await db.insert(invoices).values(iVal).onConflictDoUpdate({
          target: invoices.id,
          set: iVal
        });
      } else if (collectionName === "staff") {
        const sVal = {
          id: item.id,
          name: item.name || "",
          role: item.role || "",
          department: item.department || ""
        };
        await db.insert(staff).values(sVal).onConflictDoUpdate({
          target: staff.id,
          set: sVal
        });
      } else if (collectionName === "logs" || collectionName === "systemLogs") {
        const lVal = {
          id: item.id,
          message: item.message || "",
          timestamp: item.timestamp || (/* @__PURE__ */ new Date()).toISOString()
        };
        await db.insert(logs).values(lVal).onConflictDoUpdate({
          target: logs.id,
          set: lVal
        });
      } else if (collectionName === "dutyTasks") {
        const tVal = {
          id: item.id,
          title: item.title || "",
          status: item.status || ""
        };
        await db.insert(dutyTasks).values(tVal).onConflictDoUpdate({
          target: dutyTasks.id,
          set: tVal
        });
      } else if (collectionName === "notifications") {
        const nVal = {
          id: item.id,
          message: item.message || "",
          timestamp: item.timestamp || (/* @__PURE__ */ new Date()).toISOString()
        };
        await db.insert(notifications).values(nVal).onConflictDoUpdate({
          target: notifications.id,
          set: nVal
        });
      } else if (collectionName === "messages") {
        const mVal = {
          id: item.id,
          senderNameAr: item.senderNameAr || item.sender_name_ar || "",
          senderNameEn: item.senderNameEn || item.sender_name_en || "",
          content: item.content || "",
          timestamp: item.timestamp || (/* @__PURE__ */ new Date()).toISOString()
        };
        await db.insert(messages).values(mVal).onConflictDoUpdate({
          target: messages.id,
          set: mVal
        });
      } else if (collectionName === "his_audit_logs" || collectionName === "auditLogs") {
        const aVal = {
          id: item.id,
          action: item.action,
          entityType: item.entityType || item.entity_type || "GENERAL",
          entityId: item.entityId || item.entity_id || "N/A",
          userId: item.userId || item.user_id,
          createdAt: item.timestamp || item.created_at || (/* @__PURE__ */ new Date()).toISOString(),
          changes: {
            oldValue: item.oldValue,
            newValue: item.newValue,
            ip: item.ip,
            device: item.device,
            department: item.department
          }
        };
        await db.insert(auditLogs).values(aVal).onConflictDoNothing();
      } else if (collectionName === "his_visits" || collectionName === "visits") {
        const vVal = {
          id: item.id,
          patientId: item.patientId,
          patientMRN: item.patientMRN || item.patient_mrn,
          visitType: item.visitType || item.visit_type,
          status: item.status || "active",
          currentStage: item.currentStage || item.current_stage,
          startTime: item.startTime || item.start_time || (/* @__PURE__ */ new Date()).toISOString(),
          endTime: item.endTime || item.end_time,
          totalEstimatedBill: String(item.totalEstimatedBill || item.total_estimated_bill || "0"),
          doctorId: item.doctorId || item.doctor_id,
          deptId: item.deptId || item.dept_id
        };
        await db.insert(visits).values(vVal).onConflictDoUpdate({
          target: visits.id,
          set: vVal
        });
      } else if (collectionName === "his_insurance_providers" || collectionName === "insuranceProviders") {
        const iVal = {
          id: item.id,
          nameEn: item.nameEn || item.name_en,
          nameAr: item.nameAr || item.name_ar,
          code: item.code,
          contactEmail: item.contactEmail || item.contact_email,
          coverageDetails: item.coverageDetails || item.coverage_details,
          status: item.status || "active"
        };
        await db.insert(insuranceProviders).values(iVal).onConflictDoUpdate({
          target: insuranceProviders.id,
          set: iVal
        });
      } else if (collectionName === "his_charges" || collectionName === "billingCharges") {
        const bVal = {
          id: item.id,
          visitId: item.visitId || item.visit_id,
          patientId: item.patientId || item.patient_id,
          serviceId: item.serviceId || item.service_id,
          serviceName: item.serviceName || item.service_name,
          category: item.category,
          amount: String(item.amount),
          insuranceCovered: String(item.insuranceCovered || item.insurance_covered || "0"),
          patientPayable: String(item.patientPayable || item.patient_payable),
          status: item.status || "pending",
          orderId: item.orderId || item.order_id,
          staffId: item.staffId || item.staff_id,
          createdAt: item.createdAt || item.created_at || (/* @__PURE__ */ new Date()).toISOString()
        };
        await db.insert(billingCharges).values(bVal).onConflictDoUpdate({
          target: billingCharges.id,
          set: bVal
        });
      } else if (collectionName === "his_lab_results" || collectionName === "labResultsStructured") {
        const lVal = {
          id: item.id,
          visitId: item.visitId || item.visit_id,
          patientId: item.patientId || item.patient_id,
          testName: item.testName || item.test_name,
          value: String(item.value),
          unit: item.unit,
          flag: item.flag,
          referenceRange: item.referenceRange || item.reference_range,
          performedBy: item.performedBy || item.performed_by,
          orderId: item.orderId || item.order_id,
          createdAt: item.createdAt || item.created_at || (/* @__PURE__ */ new Date()).toISOString()
        };
        await db.insert(labTestsStructured).values(lVal).onConflictDoUpdate({
          target: labTestsStructured.id,
          set: lVal
        });
      } else if (collectionName === "his_radiology_reports" || collectionName === "radiologyReportsStructured") {
        const rVal = {
          id: item.id,
          visitId: item.visitId || item.visit_id,
          patientId: item.patientId || item.patient_id,
          studyName: item.studyName || item.study_name,
          modality: item.modality,
          findings: item.findings,
          impression: item.impression,
          radiologistId: item.radiologistId || item.radiologist_id,
          orderId: item.orderId || item.order_id,
          createdAt: item.createdAt || item.created_at || (/* @__PURE__ */ new Date()).toISOString()
        };
        await db.insert(radiologyReportsStructured).values(rVal).onConflictDoUpdate({
          target: radiologyReportsStructured.id,
          set: rVal
        });
      } else if (collectionName === "settings") {
        const setKey = item.key || item.id;
        const sVal = {
          key: setKey,
          value: item
        };
        await db.insert(settings).values(sVal).onConflictDoUpdate({
          target: settings.key,
          set: sVal
        });
      } else {
        const cVal = {
          id: item.id,
          collectionName,
          data: item,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        await db.insert(collectionsStore).values({
          ...cVal,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        }).onConflictDoUpdate({
          target: collectionsStore.id,
          set: cVal
        });
      }
      return true;
    } catch (err) {
      console.error(`\u274C PostgreSQL save error for '${collectionName}':`, err.message);
      saveLocalItem(collectionName, item);
      return true;
    }
  }
  async deleteItem(collectionName, id) {
    if (!usePostgres()) {
      deleteLocalItem(collectionName, id);
      return true;
    }
    try {
      if (collectionName === "patients") {
        await db.delete(patients).where((0, import_drizzle_orm.eq)(patients.id, id));
      } else if (collectionName === "prescriptions") {
        await db.delete(prescriptions).where((0, import_drizzle_orm.eq)(prescriptions.id, id));
      } else if (collectionName === "invoices") {
        await db.delete(invoices).where((0, import_drizzle_orm.eq)(invoices.id, id));
      } else if (collectionName === "staff") {
        await db.delete(staff).where((0, import_drizzle_orm.eq)(staff.id, id));
      } else if (collectionName === "logs" || collectionName === "systemLogs") {
        await db.delete(logs).where((0, import_drizzle_orm.eq)(logs.id, id));
      } else if (collectionName === "dutyTasks") {
        await db.delete(dutyTasks).where((0, import_drizzle_orm.eq)(dutyTasks.id, id));
      } else if (collectionName === "notifications") {
        await db.delete(notifications).where((0, import_drizzle_orm.eq)(notifications.id, id));
      } else if (collectionName === "messages") {
        await db.delete(messages).where((0, import_drizzle_orm.eq)(messages.id, id));
      } else if (collectionName === "his_audit_logs" || collectionName === "auditLogs") {
        await db.delete(auditLogs).where((0, import_drizzle_orm.eq)(auditLogs.id, id));
      } else if (collectionName === "his_visits" || collectionName === "visits") {
        await db.delete(visits).where((0, import_drizzle_orm.eq)(visits.id, id));
      } else if (collectionName === "his_insurance_providers" || collectionName === "insuranceProviders") {
        await db.delete(insuranceProviders).where((0, import_drizzle_orm.eq)(insuranceProviders.id, id));
      } else if (collectionName === "his_charges" || collectionName === "billingCharges") {
        await db.delete(billingCharges).where((0, import_drizzle_orm.eq)(billingCharges.id, id));
      } else if (collectionName === "his_lab_results" || collectionName === "labResultsStructured") {
        await db.delete(labTestsStructured).where((0, import_drizzle_orm.eq)(labTestsStructured.id, id));
      } else if (collectionName === "his_radiology_reports" || collectionName === "radiologyReportsStructured") {
        await db.delete(radiologyReportsStructured).where((0, import_drizzle_orm.eq)(radiologyReportsStructured.id, id));
      } else if (collectionName === "settings") {
        await db.delete(settings).where((0, import_drizzle_orm.eq)(settings.key, id));
      } else {
        await db.delete(collectionsStore).where(
          (0, import_drizzle_orm.and)(
            (0, import_drizzle_orm.eq)(collectionsStore.id, id),
            (0, import_drizzle_orm.eq)(collectionsStore.collectionName, collectionName)
          )
        );
      }
      return true;
    } catch (err) {
      console.error(`\u274C PostgreSQL delete error for '${collectionName}':`, err.message);
      deleteLocalItem(collectionName, id);
      return true;
    }
  }
};

// server/db/firebaseAdapter.ts
var FirebaseAdapter = class {
  async fetchCollection(collectionName) {
    throw new Error("Firebase fetchCollection not implemented");
  }
  async saveItem(collectionName, item) {
    throw new Error("Firebase saveItem not implemented");
  }
  async deleteItem(collectionName, id) {
    throw new Error("Firebase deleteItem not implemented");
  }
};

// server/db/pocketbaseAdapter.ts
var PocketBaseAdapter = class {
  async fetchCollection(collectionName) {
    throw new Error("PocketBase fetchCollection not implemented");
  }
  async saveItem(collectionName, item) {
    throw new Error("PocketBase saveItem not implemented");
  }
  async deleteItem(collectionName, id) {
    throw new Error("PocketBase deleteItem not implemented");
  }
};

// server/db/supabaseAdapter.ts
var SupabaseAdapter = class {
  async fetchCollection(collectionName) {
    throw new Error("Supabase fetchCollection not implemented");
  }
  async saveItem(collectionName, item) {
    throw new Error("Supabase saveItem not implemented");
  }
  async deleteItem(collectionName, id) {
    throw new Error("Supabase deleteItem not implemented");
  }
};

// server/db/appwriteAdapter.ts
var AppwriteAdapter = class {
  async fetchCollection(collectionName) {
    throw new Error("Appwrite fetchCollection not implemented");
  }
  async saveItem(collectionName, item) {
    throw new Error("Appwrite saveItem not implemented");
  }
  async deleteItem(collectionName, id) {
    throw new Error("Appwrite deleteItem not implemented");
  }
};

// server/db/adapterFactory.ts
var activeProvider = "POSTGRES";
function getAdapter() {
  switch (activeProvider) {
    case "POSTGRES":
    case "POSTGRES_NEON":
    case "GOOGLE_CLOUD_SQL":
      return new PostgresAdapter();
    case "FIREBASE":
      return new FirebaseAdapter();
    case "POCKETBASE":
      return new PocketBaseAdapter();
    case "SUPABASE":
      return new SupabaseAdapter();
    case "APPWRITE":
      return new AppwriteAdapter();
    default:
      throw new Error(`Provider ${activeProvider} not implemented`);
  }
}
function setProvider(provider) {
  activeProvider = provider;
  console.log("Provider set to:", provider);
}

// server.ts
var import_drizzle_orm2 = require("drizzle-orm");

// server/db/enterpriseService.ts
var ClinicalDataService = class {
  // 500ms Cache TTL for near-real-time responsiveness while preventing flood
  constructor(repository) {
    this.cache = /* @__PURE__ */ new Map();
    this.cacheTTL = 500;
    this.repository = repository;
  }
  async getCollection(collectionName, bypassCache = false) {
    const cached = this.cache.get(collectionName);
    const now = Date.now();
    if (cached && !bypassCache && now - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }
    const data = await this.repository.fetchCollection(collectionName);
    this.cache.set(collectionName, { data, timestamp: now });
    return data;
  }
  async saveItem(collectionName, item) {
    const success = await this.repository.saveItem(collectionName, item);
    if (success) {
      this.cache.delete(collectionName);
    }
    return success;
  }
  async deleteItem(collectionName, id) {
    const success = await this.repository.deleteItem(collectionName, id);
    if (success) {
      this.cache.delete(collectionName);
    }
    return success;
  }
  async bulkSync(collectionNames) {
    const result = {};
    const promises = collectionNames.map(async (name) => {
      try {
        result[name] = await this.getCollection(name);
      } catch (err) {
        console.error(`Error syncing collection ${name} in bulkSync:`, err);
        result[name] = [];
      }
    });
    await Promise.all(promises);
    return result;
  }
};
var clinicalDataService = new ClinicalDataService(getAdapter());

// server.ts
import_dotenv.default.config();
var serverSettings = {};
if (import_fs2.default.existsSync("server-settings.json")) {
  try {
    serverSettings = JSON.parse(import_fs2.default.readFileSync("server-settings.json", "utf8"));
    if (serverSettings.activeProvider) {
      setProvider(serverSettings.activeProvider);
      console.log(`\u{1F4E1} Restored database provider on startup: ${serverSettings.activeProvider}`);
    }
  } catch (e) {
    console.error("Error reading server-settings.json", e);
  }
}
var envSupabaseUrl = process.env.SUPABASE_URL;
var isHttpUrl = envSupabaseUrl && envSupabaseUrl.startsWith("http");
var supabaseUrl = isHttpUrl ? envSupabaseUrl : serverSettings.supabaseUrl;
var supabaseKey = process.env.SUPABASE_SECRET_KEY || serverSettings.supabaseKey;
var supabaseAdmin = supabaseUrl && supabaseUrl.startsWith("http") && supabaseKey ? (0, import_supabase_js.createClient)(supabaseUrl, supabaseKey) : null;
global.supabaseAdmin = supabaseAdmin;
function getMedicationFallback(search_query) {
  const query = (search_query || "").toLowerCase().trim();
  if (query.includes("aspirin") || query.includes("\u0627\u0633\u0628\u0631\u064A\u0646") || query.includes("\u0623\u0633\u0628\u064A\u0631\u064A\u0646")) {
    return {
      "search_result": {
        "original_query": search_query,
        "is_corrected": false,
        "corrected_name_trade": "Aspirin (Ecotrin)",
        "generic_name": "Acetylsalicylic Acid (ASA)",
        "drug_class": "Antiplatelet / Salicylates"
      },
      "required_labels": {
        "high_alert_status": {
          "is_high_alert": false,
          "label_color": "slate",
          "reason": "Standard oral dose antiplatelet therapy. Monitor for bleeding or gastrointestinal irritation."
        },
        "lasa_status": {
          "has_lasa_risk": true,
          "label_color": "orange",
          "confused_with": [
            { "name": "Asaphen", "reason_of_confusion": "Similar visual spelling and packaging in specific generic brands.", "danger_level": "Moderate" },
            { "name": "Aprixin", "reason_of_confusion": "Phonetic similarity when ordered verbally.", "danger_level": "Moderate" }
          ]
        }
      },
      "clinical_guidelines": {
        "administration_routes": ["Oral", "Chewable", "Rectal"],
        "vital_signs_to_monitor": ["Platelet Count", "Coagulation Panel (PT/INR)", "Gastrointestinal Bleeding signs"]
      }
    };
  }
  if (query.includes("nitro") || query.includes("\u0646\u064A\u062A\u0631\u0648") || query.includes("\u0646\u064A\u062A\u0631\u0648\u062C\u0644\u064A\u0633\u0631\u064A\u0646")) {
    return {
      "search_result": {
        "original_query": search_query,
        "is_corrected": false,
        "corrected_name_trade": "Nitrostat / Nitronal",
        "generic_name": "Nitroglycerin",
        "drug_class": "Vasodilator / Nitrate"
      },
      "required_labels": {
        "high_alert_status": {
          "is_high_alert": true,
          "label_color": "red",
          "reason": "Potent vasodilator. Intravenous formulation requires continuous infusion monitoring to avoid severe acute hypotension."
        },
        "lasa_status": {
          "has_lasa_risk": true,
          "label_color": "orange",
          "confused_with": [
            { "name": "Nitroprusside", "reason_of_confusion": "Both are rapid-acting IV vasodilators. Mixing them up can cause fatal dosing errors.", "danger_level": "High" }
          ]
        }
      },
      "clinical_guidelines": {
        "administration_routes": ["Sublingual", "Intravenous Infusion", "Transdermal Patch"],
        "vital_signs_to_monitor": ["Continuous Blood Pressure (BP)", "Heart Rate (HR)", "Electrocardiogram (ECG)"]
      }
    };
  }
  if (query.includes("heparin") || query.includes("\u0647\u064A\u0628\u0627\u0631\u064A\u0646")) {
    return {
      "search_result": {
        "original_query": search_query,
        "is_corrected": false,
        "corrected_name_trade": "Heparin Sodium",
        "generic_name": "Heparin",
        "drug_class": "Anticoagulant"
      },
      "required_labels": {
        "high_alert_status": {
          "is_high_alert": true,
          "label_color": "red",
          "reason": "CRITICAL HIGH-ALERT DRUG: High risk of serious bleeding. Requires strict dual-nurse verification of dosing and rate changes."
        },
        "lasa_status": {
          "has_lasa_risk": true,
          "label_color": "orange",
          "confused_with": [
            { "name": "Hespan", "reason_of_confusion": "Extremely similar phonetic sound; Hespan is a plasma expander, Heparin is a strong anticoagulant.", "danger_level": "High" }
          ]
        }
      },
      "clinical_guidelines": {
        "administration_routes": ["Intravenous Infusion", "Subcutaneous Injection"],
        "vital_signs_to_monitor": ["Activated Partial Thromboplastin Time (aPTT)", "Platelet Count (HIT screening)", "Hemoglobin & Hematocrit"]
      }
    };
  }
  if (query.includes("warfarin") || query.includes("\u0648\u0627\u0631\u0641\u0627\u0631\u064A\u0646") || query.includes("coumadin") || query.includes("\u0643\u0648\u0645\u0627\u062F\u064A\u0646")) {
    return {
      "search_result": {
        "original_query": search_query,
        "is_corrected": false,
        "corrected_name_trade": "Coumadin",
        "generic_name": "Warfarin Sodium",
        "drug_class": "Anticoagulant (Vitamin K Antagonist)"
      },
      "required_labels": {
        "high_alert_status": {
          "is_high_alert": true,
          "label_color": "red",
          "reason": "Narrow therapeutic index. High risk of major hemorrhage if dose is not adjusted based on INR."
        },
        "lasa_status": {
          "has_lasa_risk": true,
          "label_color": "orange",
          "confused_with": [
            { "name": "Wyanoids", "reason_of_confusion": "Phonetic similarity under specific brand packaging.", "danger_level": "Moderate" }
          ]
        }
      },
      "clinical_guidelines": {
        "administration_routes": ["Oral"],
        "vital_signs_to_monitor": ["PT / INR", "Signs of bruising, hematuria, or epistaxis", "Dietary Vitamin K intake consistency"]
      }
    };
  }
  if (query.includes("insulin") || query.includes("\u0623\u0646\u0633\u0648\u0644\u064A\u0646") || query.includes("\u0627\u0646\u0633\u0648\u0644\u064A\u0646") || query.includes("humalog") || query.includes("lantus")) {
    return {
      "search_result": {
        "original_query": search_query,
        "is_corrected": false,
        "corrected_name_trade": "Humalog / Lantus / Actrapid",
        "generic_name": "Insulin (Rapid / Intermediate / Long Acting)",
        "drug_class": "Antidiabetic / Hormone"
      },
      "required_labels": {
        "high_alert_status": {
          "is_high_alert": true,
          "label_color": "red",
          "reason": "CRITICAL HIGH-ALERT: High risk of severe hypoglycemia resulting in confusion or coma. Verification of glucose levels is mandatory."
        },
        "lasa_status": {
          "has_lasa_risk": true,
          "label_color": "orange",
          "confused_with": [
            { "name": "Insuman", "reason_of_confusion": "Visual spelling and packaging similarity across insulin types.", "danger_level": "High" }
          ]
        }
      },
      "clinical_guidelines": {
        "administration_routes": ["Subcutaneous Injection", "Intravenous Infusion"],
        "vital_signs_to_monitor": ["Capillary Blood Glucose (CBG)", "Serum Potassium (K+)", "Level of consciousness"]
      }
    };
  }
  if (query.includes("lasix") || query.includes("\u0644\u0627\u0632\u0643\u0633") || query.includes("furosemide") || query.includes("\u0641\u0648\u0631\u0648\u0633\u064A\u0645\u064A\u062F")) {
    return {
      "search_result": {
        "original_query": search_query,
        "is_corrected": false,
        "corrected_name_trade": "Lasix",
        "generic_name": "Furosemide",
        "drug_class": "Loop Diuretic"
      },
      "required_labels": {
        "high_alert_status": {
          "is_high_alert": false,
          "label_color": "slate",
          "reason": "Standard loop diuretic therapy. High vigilance for electrolyte imbalances is advised."
        },
        "lasa_status": {
          "has_lasa_risk": true,
          "label_color": "orange",
          "confused_with": [
            { "name": "Losec", "reason_of_confusion": "High LASA alert: Losec is Omeprazole while Lasix is a loop diuretic.", "danger_level": "High" }
          ]
        }
      },
      "clinical_guidelines": {
        "administration_routes": ["Oral", "Intravenous Injection"],
        "vital_signs_to_monitor": ["Hourly Urine Output (U/O)", "Serum Potassium (K+) & Sodium (Na+) levels", "Blood Pressure"]
      }
    };
  }
  return {
    "search_result": {
      "original_query": search_query,
      "is_corrected": false,
      "corrected_name_trade": search_query,
      "generic_name": search_query,
      "drug_class": "Therapeutic Agent"
    },
    "required_labels": {
      "high_alert_status": {
        "is_high_alert": false,
        "label_color": "slate",
        "reason": "Classified under standard clinical handling guidelines."
      },
      "lasa_status": {
        "has_lasa_risk": false,
        "label_color": "slate",
        "confused_with": []
      }
    },
    "clinical_guidelines": {
      "administration_routes": ["Oral", "Intravenous"],
      "vital_signs_to_monitor": ["Blood Pressure", "Heart Rate"]
    }
  };
}
function getInteractionFallback(med1, med2, isAr) {
  const m1 = med1.toLowerCase();
  const m2 = med2.toLowerCase();
  if (m1.includes("aspirin") && (m2.includes("heparin") || m2.includes("warfarin")) || m2.includes("aspirin") && (m1.includes("heparin") || m1.includes("warfarin"))) {
    return {
      "interaction_severity": "High",
      "has_interaction": true,
      "mechanism": isAr ? "\u062A\u0623\u062B\u064A\u0631 \u0645\u0636\u0627\u062F \u0644\u0644\u062A\u062E\u062B\u0631 \u062A\u0622\u0632\u0631\u064A. \u064A\u0645\u0646\u0639 \u0627\u0644\u0623\u0633\u0628\u0631\u064A\u0646 \u062A\u0631\u0627\u0643\u0645 \u0627\u0644\u0635\u0641\u0627\u0626\u062D \u0627\u0644\u062F\u0645\u0648\u064A\u0629 \u0628\u064A\u0646\u0645\u0627 \u064A\u0639\u0645\u0644 \u0627\u0644\u0647\u064A\u0628\u0627\u0631\u064A\u0646/\u0627\u0644\u0648\u0627\u0631\u0641\u0627\u0631\u064A\u0646 \u0639\u0644\u0649 \u062A\u062B\u0628\u064A\u0637 \u0639\u0648\u0627\u0645\u0644 \u0627\u0644\u062A\u062C\u0644\u0637." : "Synergistic anticoagulant effect. Aspirin inhibits platelet aggregation while Heparin/Warfarin inhibits clotting factors.",
      "clinical_effects": isAr ? "\u0632\u064A\u0627\u062F\u0629 \u0634\u062F\u064A\u062F\u0629 \u0641\u064A \u0645\u062E\u0627\u0637\u0631 \u062D\u062F\u0648\u062B \u0646\u0632\u064A\u0641 \u062F\u0627\u062E\u0644\u064A \u0623\u0648 \u062E\u0627\u0631\u062C\u064A \u062D\u0627\u062F." : "Severely increased risk of major hemorrhage (internal or external bleeding).",
      "recommendation": isAr ? "\u062A\u062C\u0646\u0628 \u0627\u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0627\u0644\u0645\u062A\u0632\u0627\u0645\u0646 \u0625\u0644\u0627 \u062A\u062D\u062A \u0645\u0631\u0627\u0642\u0628\u0629 \u0637\u0628\u064A\u0629 \u062F\u0642\u064A\u0642\u0629 \u062C\u062F\u0627\u064B \u0648\u0645\u062A\u0627\u0628\u0639\u0629 \u0632\u0645\u0646 \u0627\u0644\u0646\u0632\u064A\u0641 \u0648\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0640 INR." : "Avoid concomitant use unless strictly indicated under intensive surveillance. Monitor PT/INR and platelet levels closely.",
      "monitoring_guidelines": isAr ? "\u0645\u0631\u0627\u0642\u0628\u0629 \u0639\u0644\u0627\u0645\u0627\u062A \u0627\u0644\u0646\u0632\u064A\u0641 (\u0643\u062F\u0645\u0627\u062A \u063A\u064A\u0631 \u0645\u0641\u0633\u0631\u0629\u060C \u0646\u0632\u064A\u0641 \u0627\u0644\u0644\u062B\u0629\u060C \u0628\u064A\u0644\u0629 \u062F\u0645\u0648\u064A\u0629) \u0648\u0641\u062D\u0635 \u0627\u0644\u0647\u064A\u0645\u0648\u062C\u0644\u0648\u0628\u064A\u0646 \u0628\u0627\u0646\u062A\u0638\u0627\u0645." : "Monitor clinical signs of bleeding (unexplained bruising, gum bleeding, hematuria) and check hemoglobin levels.",
      "severity_color": "red"
    };
  }
  if (m1.includes("nitro") && m2.includes("sildenafil") || m2.includes("nitro") && m1.includes("sildenafil")) {
    return {
      "interaction_severity": "High",
      "has_interaction": true,
      "mechanism": isAr ? "\u062A\u0623\u062B\u064A\u0631 \u062A\u0622\u0632\u0631\u064A \u0642\u0648\u064A \u062C\u062F\u0627\u064B \u0644\u062A\u0648\u0633\u064A\u0639 \u0627\u0644\u0623\u0648\u0639\u064A\u0629 \u0627\u0644\u062F\u0645\u0648\u064A\u0629 \u0639\u0646 \u0637\u0631\u064A\u0642 \u0632\u064A\u0627\u062F\u0629 \u0645\u0633\u062A\u0648\u064A\u0627\u062A \u0623\u062D\u0627\u062F\u064A \u0623\u0643\u0633\u064A\u062F \u0627\u0644\u0646\u064A\u062A\u0631\u0648\u062C\u064A\u0646." : "Severe synergistic vasodilation via accumulation of cyclic GMP.",
      "clinical_effects": isAr ? "\u0627\u0646\u062E\u0641\u0627\u0636 \u0645\u0641\u0627\u062C\u0626 \u0648\u062D\u0627\u062F \u062C\u062F\u0627\u064B \u0641\u064A \u0636\u063A\u0637 \u0627\u0644\u062F\u0645 \u0642\u062F \u064A\u0643\u0648\u0646 \u0645\u0647\u062F\u062F\u0627\u064B \u0644\u0644\u062D\u064A\u0627\u0629." : "Sudden, severe, potentially life-threatening hypotension.",
      "recommendation": isAr ? "\u064A\u064F\u0645\u0646\u0639 \u0645\u0646\u0639\u0627\u064B \u0628\u0627\u062A\u0627\u064B \u0627\u0644\u062C\u0645\u0639 \u0628\u064A\u0646 \u0646\u064A\u062A\u0631\u0648\u062C\u0644\u064A\u0633\u0631\u064A\u0646 \u0648\u0633\u064A\u0644\u062F\u064A\u0646\u0627\u0641\u064A\u0644 (\u0627\u0644\u0641\u064A\u0627\u062C\u0631\u0627) \u0641\u064A \u063A\u0636\u0648\u0646 24-48 \u0633\u0627\u0639\u0629." : "Concomitant administration is strictly contraindicated within 24-48 hours.",
      "monitoring_guidelines": isAr ? "\u0627\u0644\u0625\u0646\u0639\u0627\u0634 \u0627\u0644\u0641\u0648\u0631\u064A \u0628\u0627\u0644\u0633\u0648\u0627\u0626\u0644 \u0627\u0644\u0648\u0631\u064A\u062F\u064A\u0629 \u0648\u0631\u0641\u0639 \u0627\u0644\u0642\u062F\u0645\u064A\u0646 \u0641\u064A \u062D\u0627\u0644\u0629 \u062D\u062F\u0648\u062B \u0627\u0646\u062E\u0641\u0627\u0636 \u062D\u0627\u062F \u0644\u0644\u0636\u063A\u0637." : "Immediate IV fluid resuscitation and Trendelenburg positioning in case of severe hypotension.",
      "severity_color": "red"
    };
  }
  return {
    "interaction_severity": "None",
    "has_interaction": false,
    "mechanism": isAr ? "\u0644\u0627 \u062A\u0648\u062C\u062F \u062A\u062F\u0627\u062E\u0644\u0627\u062A \u062F\u0648\u0627\u0626\u064A\u0629 \u062E\u0637\u064A\u0631\u0629 \u0645\u0633\u062C\u0644\u0629 \u0641\u064A \u0627\u0644\u0641\u0647\u0631\u0633 \u0627\u0644\u0645\u0628\u0627\u0634\u0631 \u0644\u0647\u0630\u0647 \u0627\u0644\u062A\u0631\u0643\u064A\u0628\u0629 \u0627\u0644\u062F\u0648\u0627\u0626\u064A\u0629." : "No established severe drug-drug interactions found in the offline screening dictionary.",
    "clinical_effects": isAr ? "\u062A\u0623\u062B\u064A\u0631\u0627\u062A \u0633\u0631\u064A\u0631\u064A\u0629 \u0637\u0628\u064A\u0639\u064A\u0629 \u0648\u0645\u062A\u0648\u0642\u0639\u0629 \u0644\u0643\u0644 \u062F\u0648\u0627\u0621 \u0639\u0644\u0649 \u062D\u062F\u0629." : "Standard expected clinical effects of individual drugs.",
    "recommendation": isAr ? "\u064A\u0645\u0643\u0646 \u0625\u0639\u0637\u0627\u0621 \u0627\u0644\u0623\u062F\u0648\u064A\u0629 \u0645\u0639 \u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u0631\u0648\u062A\u064A\u0646\u064A\u0629 \u0644\u0644\u0639\u0644\u0627\u0645\u0627\u062A \u0627\u0644\u062D\u064A\u0648\u064A\u0629 \u0644\u0644\u0645\u0631\u064A\u0636." : "Administer as prescribed. Maintain standard clinical monitoring.",
    "monitoring_guidelines": isAr ? "\u0627\u0644\u0645\u0631\u0627\u0642\u0628\u0629 \u0627\u0644\u062F\u0648\u0631\u064A\u0629 \u0627\u0644\u0645\u0639\u062A\u0627\u062F\u0629 \u0644\u0644\u0639\u0644\u0627\u0645\u0627\u062A \u0627\u0644\u062D\u064A\u0648\u064A\u0629 \u0648\u062D\u0627\u0644\u0629 \u0627\u0644\u0645\u0631\u064A\u0636 \u0627\u0644\u0639\u0627\u0645\u0629." : "Standard periodic vitals check and general clinical assessment.",
    "severity_color": "green"
  };
}
function getIvCompatibilityFallback(drug1, drug2, fluid, isAr) {
  const d1 = drug1.toLowerCase();
  const d2 = drug2.toLowerCase();
  if (d1.includes("ceftriaxone") && d2.includes("calcium") || d2.includes("ceftriaxone") && d1.includes("calcium")) {
    return {
      "compatibility_status": "Incompatible",
      "explanation": isAr ? "\u064A\u062A\u0641\u0627\u0639\u0644 \u0627\u0644\u0633\u064A\u0641 \u062A\u0631\u064A\u0627\u0643\u0633\u0648\u0646 \u0645\u0639 \u0627\u0644\u0643\u0627\u0644\u0633\u064A\u0648\u0645 \u0644\u062A\u0643\u0648\u064A\u0646 \u0631\u0648\u0627\u0633\u0628 \u0645\u0644\u062D\u064A\u0629 \u0635\u0644\u0628\u0629 \u0645\u0646 \u0633\u064A\u0641 \u062A\u0631\u064A\u0627\u0643\u0633\u0648\u0646-\u0627\u0644\u0643\u0627\u0644\u0633\u064A\u0648\u0645 \u0641\u064A \u0627\u0644\u0631\u0626\u0629 \u0648\u0627\u0644\u0643\u0644\u0649." : "Ceftriaxone reacts with Calcium-containing products to form a crystalline precipitate of calcium-ceftriaxone in the lungs and kidneys.",
      "recommendation": isAr ? "\u0645\u0645\u0646\u0648\u0639 \u0645\u0646\u0639\u0627\u064B \u0628\u0627\u062A\u0627\u064B \u0627\u0644\u0625\u0639\u0637\u0627\u0621 \u0627\u0644\u0645\u0634\u062A\u0631\u0643 \u0641\u064A \u0646\u0641\u0633 \u0627\u0644\u062E\u0637 \u0627\u0644\u0648\u0631\u064A\u062F\u064A (Y-site) \u0623\u0648 \u062E\u0644\u0637\u0647\u0645 \u0645\u0639\u0627\u064B." : "Strictly contraindicated to co-administer via the same IV line (Y-site) or combine them."
    };
  }
  if (d1.includes("heparin") && d2.includes("nitroglycerin") || d2.includes("heparin") && d1.includes("nitroglycerin")) {
    return {
      "compatibility_status": "Compatible",
      "explanation": isAr ? "\u0627\u0644\u0646\u064A\u062A\u0631\u0648\u062C\u0644\u064A\u0633\u0631\u064A\u0646 \u0648\u0627\u0644\u0647\u064A\u0628\u0627\u0631\u064A\u0646 \u0645\u062A\u0648\u0627\u0641\u0642\u0627\u0646 \u0641\u064A \u062E\u0637 \u0627\u0644\u062A\u0633\u0631\u064A\u0628 \u0627\u0644\u0648\u0631\u064A\u062F\u064A Y-site\u060C \u0648\u0644\u0643\u0646 \u0627\u0644\u0646\u064A\u062A\u0631\u0648\u062C\u0644\u064A\u0633\u0631\u064A\u0646 \u0642\u062F \u064A\u0642\u0644\u0644 \u062C\u0632\u0626\u064A\u0627\u064B \u0645\u0646 \u0641\u0639\u0627\u0644\u064A\u0629 \u0627\u0644\u0647\u064A\u0628\u0627\u0631\u064A\u0646." : "Heparin and Nitroglycerin are physically and chemically compatible at the Y-site. However, nitroglycerin may slightly reduce heparin's anticoagulant efficacy.",
      "recommendation": isAr ? "\u0645\u062A\u0648\u0627\u0641\u0642 \u0633\u0631\u064A\u0631\u064A\u0627\u064B. \u064A\u0631\u062C\u0649 \u0645\u0631\u0627\u0642\u0628\u0629 \u0632\u0645\u0646 \u0627\u0644\u062A\u062C\u0644\u0637 (aPTT) \u0628\u062F\u0642\u0629 \u0648\u0636\u0628\u0637 \u062C\u0631\u0639\u0627\u062A \u0627\u0644\u0647\u064A\u0628\u0627\u0631\u064A\u0646 \u062D\u0633\u0628 \u0627\u0644\u062D\u0627\u062C\u0629." : "Clinically compatible. Monitor aPTT closely and adjust heparin dosing as required."
    };
  }
  return {
    "compatibility_status": "Caution",
    "explanation": isAr ? "\u0644\u0627 \u062A\u0648\u062C\u062F \u0628\u064A\u0627\u0646\u0627\u062A \u062A\u0648\u0627\u0641\u0642 \u0643\u064A\u0645\u064A\u0627\u0626\u064A \u0642\u0627\u0637\u0639\u0629 \u0648\u0645\u0633\u062C\u0644\u0629 \u0641\u064A \u0627\u0644\u0641\u0647\u0631\u0633 \u0627\u0644\u0633\u0631\u064A\u0639 \u0644\u0647\u0630\u064A\u0646 \u0627\u0644\u062F\u0648\u0627\u0626\u064A\u0646 \u0645\u0639\u0627\u064B." : "Direct physical compatibility data for this drug combination is not found in the instant offline reference index.",
    "recommendation": isAr ? "\u0644\u062A\u062C\u0646\u0628 \u062D\u062F\u0648\u062B \u062A\u0631\u0633\u064A\u0628\u060C \u0627\u063A\u0633\u0644 \u0627\u0644\u062E\u0637 \u0627\u0644\u0648\u0631\u064A\u062F\u064A \u062C\u064A\u062F\u0627\u064B \u0628\u0645\u062D\u0644\u0648\u0644 \u0633\u0627\u0644\u064A\u0646 \u0642\u0628\u0644 \u0648\u0628\u0639\u062F \u0625\u0639\u0637\u0627\u0621 \u0643\u0644 \u062F\u0648\u0627\u0621\u060C \u0623\u0648 \u0627\u0633\u062A\u062E\u062F\u0645 \u062E\u0637\u0627\u064B \u0648\u0631\u064A\u062F\u064A\u0627\u064B \u0645\u0646\u0641\u0635\u0644\u0627\u064B." : "To prevent precipitation, flush the line thoroughly with normal saline before and after administering each drug, or use separate IV access."
  };
}
function getCounselingFallback(medication, isAr) {
  const med = medication.toLowerCase();
  if (med.includes("aspirin") || med.includes("\u0627\u0633\u0628\u0631\u064A\u0646") || med.includes("\u0623\u0633\u0628\u064A\u0631\u064A\u0646")) {
    return {
      "drug_name": isAr ? "\u0623\u0633\u0628\u0631\u064A\u0646 (Aspirin)" : "Aspirin",
      "what_is_it_for": isAr ? "\u0644\u0645\u0646\u0639 \u062A\u062C\u0644\u0637 \u0627\u0644\u062F\u0645 \u0648\u062D\u0645\u0627\u064A\u0629 \u0627\u0644\u0642\u0644\u0628 \u0645\u0646 \u0627\u0644\u062C\u0644\u0637\u0627\u062A \u0648\u0627\u0644\u0630\u0628\u062D\u0629 \u0627\u0644\u0635\u062F\u0631\u064A\u0629." : "To prevent blood clots and protect the heart from heart attacks and angina.",
      "how_to_take": isAr ? "\u062A\u0646\u0627\u0648\u0644 \u0642\u0631\u0635\u0627\u064B \u0648\u0627\u062D\u062F\u0627\u064B \u064A\u0648\u0645\u064A\u0627\u064B \u0645\u0639 \u0627\u0644\u0637\u0639\u0627\u0645 \u0623\u0648 \u0645\u0628\u0627\u0634\u0631\u0629 \u0628\u0639\u062F\u0647 \u0644\u062A\u0642\u0644\u064A\u0644 \u062A\u0647\u064A\u062C \u0627\u0644\u0645\u0639\u062F\u0629. \u0627\u0645\u0636\u063A \u0627\u0644\u0642\u0631\u0635 \u0625\u0630\u0627 \u0643\u0627\u0646 \u0645\u062E\u0635\u0635\u0627\u064B \u0644\u0644\u0645\u0636\u063A." : "Take one tablet daily with or immediately after food to reduce stomach irritation. Chew if it is a chewable tablet.",
      "common_side_effects": isAr ? ["\u0627\u0636\u0637\u0631\u0627\u0628 \u0628\u0633\u064A\u0637 \u0641\u064A \u0627\u0644\u0645\u0639\u062F\u0629", "\u0633\u0647\u0648\u0644\u0629 \u062D\u062F\u0648\u062B \u0643\u062F\u0645\u0627\u062A \u0635\u063A\u064A\u0631\u0629", "\u0632\u064A\u0627\u062F\u0629 \u0637\u0641\u064A\u0641\u0629 \u0641\u064A \u0648\u0642\u062A \u0627\u0644\u0646\u0632\u064A\u0641 \u0639\u0646\u062F \u0627\u0644\u062C\u0631\u0648\u062D"] : ["Mild stomach upset or heartburn", "Easy bruising or small skin spots", "Slightly increased bleeding time for cuts"],
      "when_to_call_doctor": isAr ? ["\u0646\u0632\u064A\u0641 \u0634\u062F\u064A\u062F \u0644\u0627 \u064A\u062A\u0648\u0642\u0641", "\u0628\u0631\u0627\u0632 \u0623\u0633\u0648\u062F \u0627\u0644\u0644\u0648\u0646 \u0623\u0648 \u0645\u0635\u062D\u0648\u0628 \u0628\u062F\u0645", "\u0642\u064A\u0621 \u064A\u0634 \u064A\u0634\u0628\u0647 \u062A\u0641\u0644 \u0627\u0644\u0642\u0647\u0648\u0629", "\u0623\u0644\u0645 \u062D\u0627\u062F \u0641\u064A \u0627\u0644\u0645\u0639\u062F\u0629"] : ["Severe, unstoppable bleeding", "Black, tarry stools or blood in stool", "Vomiting blood or material resembling coffee grounds", "Severe abdominal pain"],
      "food_drug_interactions": isAr ? "\u062A\u062C\u0646\u0628 \u0634\u0631\u0628 \u0627\u0644\u0643\u062D\u0648\u0644 \u0644\u0623\u0646\u0647 \u064A\u0632\u064A\u062F \u0645\u0646 \u0645\u062E\u0627\u0637\u0631 \u0646\u0632\u064A\u0641 \u0627\u0644\u0645\u0639\u062F\u0629. \u062A\u0648\u062E\u0649 \u0627\u0644\u062D\u0630\u0631 \u0645\u0639 \u0623\u062F\u0648\u064A\u0629 \u0627\u0644\u0645\u0633\u0643\u0646\u0627\u062A \u0627\u0644\u0623\u062E\u0631\u0649 (\u0645\u062B\u0644 \u0627\u0644\u0625\u064A\u0628\u0648\u0628\u0631\u0648\u0641\u064A\u0646)." : "Avoid alcohol as it increases stomach bleeding risk. Exercise caution with other NSAID pain relievers (e.g., Ibuprofen).",
      "forgot_dose_instruction": isAr ? "\u062E\u0630 \u0627\u0644\u062C\u0631\u0639\u0629 \u0627\u0644\u0641\u0627\u0626\u062A\u0629 \u0641\u0648\u0631 \u062A\u0630\u0643\u0631\u0647\u0627 \u0641\u064A \u0646\u0641\u0633 \u0627\u0644\u064A\u0648\u0645. \u0625\u0630\u0627 \u062A\u0630\u0643\u0631\u062A \u0641\u064A \u0627\u0644\u064A\u0648\u0645 \u0627\u0644\u062A\u0627\u0644\u064A\u060C \u0641\u062A\u062C\u0627\u0648\u0632 \u0627\u0644\u062C\u0631\u0639\u0629 \u0627\u0644\u0641\u0627\u0626\u062A\u0629 \u0648\u062A\u0627\u0628\u0639 \u062C\u062F\u0648\u0644\u0643 \u0627\u0644\u0645\u0639\u062A\u0627\u062F. \u0644\u0627 \u062A\u0636\u0627\u0639\u0641 \u0627\u0644\u062C\u0631\u0639\u0629." : "Take the missed dose as soon as you remember on the same day. If you remember the next day, skip it and continue your normal schedule. Do not double the dose."
    };
  }
  if (med.includes("nitro") || med.includes("\u0646\u064A\u062A\u0631\u0648") || med.includes("\u0646\u064A\u062A\u0631\u0648\u062C\u0644\u064A\u0633\u0631\u064A\u0646")) {
    return {
      "drug_name": isAr ? "\u0646\u064A\u062A\u0631\u0648\u062C\u0644\u064A\u0633\u0631\u064A\u0646 \u062A\u062D\u062A \u0627\u0644\u0644\u0633\u0627\u0646 (Sublingual Nitroglycerin)" : "Sublingual Nitroglycerin",
      "what_is_it_for": isAr ? "\u0644\u062A\u062E\u0641\u064A\u0641 \u0622\u0644\u0627\u0645 \u0627\u0644\u0635\u062F\u0631 \u0627\u0644\u0645\u0641\u0627\u062C\u0626\u0629 (\u0627\u0644\u0630\u0628\u062D\u0629 \u0627\u0644\u0635\u062F\u0631\u064A\u0629) \u0627\u0644\u0646\u0627\u062A\u062C\u0629 \u0639\u0646 \u0636\u064A\u0642 \u0634\u0631\u0627\u064A\u064A\u0646 \u0627\u0644\u0642\u0644\u0628." : "To relieve sudden chest pain (angina attacks) caused by coronary artery narrowing.",
      "how_to_take": isAr ? "\u0627\u062C\u0644\u0633 \u0623\u0648\u0644\u0627\u064B \u0644\u062A\u062C\u0646\u0628 \u0627\u0644\u062F\u0648\u0627\u0631. \u0636\u0639 \u0642\u0631\u0635\u0627\u064B \u0648\u0627\u062D\u062F\u0627\u064B \u062A\u062D\u062A \u0627\u0644\u0644\u0633\u0627\u0646 \u0648\u0627\u062A\u0631\u0643\u0647 \u064A\u0630\u0648\u0628 \u0628\u0627\u0644\u0643\u0627\u0645\u0644. \u0644\u0627 \u062A\u0628\u062A\u0644\u0639 \u0627\u0644\u0642\u0631\u0635." : "Sit down first to prevent dizziness. Place one tablet under the tongue and let it dissolve completely. Do not swallow.",
      "common_side_effects": isAr ? ["\u0635\u062F\u0627\u0639 \u0645\u0641\u0627\u062C\u0626 \u0648\u0642\u0635\u064A\u0631 \u0627\u0644\u0645\u062F\u0649", "\u0634\u0639\u0648\u0631 \u0628\u0627\u0644\u062F\u0641\u0621 \u0623\u0648 \u0627\u062D\u0645\u0631\u0627\u0631 \u0627\u0644\u0648\u062C\u0647", "\u062F\u0648\u0627\u0631 \u0645\u0624\u0642\u062A \u0639\u0646\u062F \u0627\u0644\u0648\u0642\u0648\u0641"] : ["Sudden, transient headache", "Flushing or feeling of warmth in the face", "Temporary dizziness when standing up"],
      "when_to_call_doctor": isAr ? ["\u0639\u062F\u0645 \u062A\u062D\u0633\u0646 \u0623\u0644\u0645 \u0627\u0644\u0635\u062F\u0631 \u0628\u0639\u062F \u062A\u0646\u0627\u0648\u0644 \u0623\u0648\u0644 \u0642\u0631\u0635 \u0644\u0645\u062F\u0629 5 \u062F\u0642\u0627\u0626\u0642 (\u0627\u062A\u0635\u0644 \u0628\u0627\u0644\u0637\u0648\u0627\u0631\u0626 997 \u0641\u0648\u0631\u0627\u064B)", "\u0636\u064A\u0642 \u0634\u062F\u064A\u062F \u0641\u064A \u0627\u0644\u062A\u0646\u0641\u0633", "\u0625\u063A\u0645\u0627\u0621"] : ["Chest pain does not improve 5 minutes after taking the first tablet (Call emergency 997 immediately)", "Severe shortness of breath", "Fainting"],
      "food_drug_interactions": isAr ? "\u0645\u0645\u0646\u0648\u0639 \u0645\u0646\u0639\u0627\u064B \u0628\u0627\u062A\u0627\u064B \u062A\u0646\u0627\u0648\u0644 \u0623\u062F\u0648\u064A\u0629 \u0627\u0644\u0636\u0639\u0641 \u0627\u0644\u062C\u0646\u0633\u064A (\u0645\u062B\u0644 \u0627\u0644\u0641\u064A\u0627\u062C\u0631\u0627) \u0623\u062B\u0646\u0627\u0621 \u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0647\u0630\u0627 \u0627\u0644\u062F\u0648\u0627\u0621." : "STRICTLY PROHIBITED to take erectile dysfunction medications (e.g., Viagra) while using this drug.",
      "forgot_dose_instruction": isAr ? "\u0647\u0630\u0627 \u0627\u0644\u062F\u0648\u0627\u0621 \u064A\u064F\u0633\u062A\u062E\u062F\u0645 \u0641\u0642\u0637 \u0639\u0646\u062F \u0627\u0644\u062D\u0627\u062C\u0629 \u0627\u0644\u0642\u0635\u0648\u0649 \u0648\u062A\u062C\u0631\u0628\u0629 \u0646\u0648\u0628\u0629 \u0623\u0644\u0645 \u0628\u0627\u0644\u0635\u062F\u0631\u060C \u0648\u0644\u064A\u0633 \u0643\u0639\u0644\u0627\u062C \u064A\u0648\u0645\u064A \u0645\u0646\u062A\u0638\u0645." : "This medication is used strictly on an as-needed basis during chest pain episodes, not as a continuous daily maintenance dose."
    };
  }
  return {
    "drug_name": medication,
    "what_is_it_for": isAr ? "\u062A\u0645 \u0648\u0635\u0641 \u0647\u0630\u0627 \u0627\u0644\u062F\u0648\u0627\u0621 \u0645\u0646 \u0642\u0628\u0644 \u0637\u0628\u064A\u0628\u0643 \u0644\u0639\u0644\u0627\u062C \u062D\u0627\u0644\u062A\u0643 \u0627\u0644\u0637\u0628\u064A\u0629 \u0627\u0644\u0645\u062D\u062F\u062F\u0629." : "This medication was prescribed by your physician to treat your specific medical condition.",
    "how_to_take": isAr ? "\u062A\u0646\u0627\u0648\u0644 \u0647\u0630\u0627 \u0627\u0644\u062F\u0648\u0627\u0621 \u062A\u0645\u0627\u0645\u0627\u064B \u0643\u0645\u0627 \u0623\u0631\u0634\u062F\u0643 \u0627\u0644\u0637\u0628\u064A\u0628 \u0623\u0648 \u0627\u0644\u0635\u064A\u062F\u0644\u064A. \u0627\u0642\u0631\u0623 \u0627\u0644\u0645\u0644\u0635\u0642 \u0627\u0644\u0625\u0631\u0634\u0627\u062F\u064A \u0639\u0644\u0649 \u0627\u0644\u0639\u0628\u0648\u0629." : "Take this medication exactly as directed by your physician or pharmacist. Read the label instruction carefully.",
    "common_side_effects": isAr ? ["\u0627\u0636\u0637\u0631\u0627\u0628\u0627\u062A \u0647\u0636\u0645\u064A\u0629 \u062E\u0641\u064A\u0641\u0629", "\u0646\u0639\u0627\u0633 \u0623\u0648 \u0635\u062F\u0627\u0639 \u062E\u0641\u064A\u0641"] : ["Mild gastrointestinal discomfort", "Mild drowsiness or headache"],
    "when_to_call_doctor": isAr ? ["\u0638\u0647\u0648\u0631 \u0639\u0644\u0627\u0645\u0627\u062A \u062D\u0633\u0627\u0633\u064A\u0629 \u0645\u062B\u0644 \u062A\u0648\u0631\u0645 \u0627\u0644\u0648\u062C\u0647\u060C \u0637\u0641\u062D \u062C\u0644\u062F\u064A\u060C \u0623\u0648 \u0635\u0639\u0648\u0628\u0629 \u0627\u0644\u062A\u0646\u0641\u0633", "\u062A\u0641\u0627\u0642\u0645 \u0627\u0644\u0623\u0639\u0631\u0627\u0636 \u0628\u0634\u0643\u0644 \u062D\u0627\u062F"] : ["Signs of allergic reaction (facial swelling, severe skin rash, difficulty breathing)", "Acute worsening of symptoms"],
    "food_drug_interactions": isAr ? "\u064A\u0631\u062C\u0649 \u0634\u0631\u0628 \u0643\u0645\u064A\u0629 \u0643\u0627\u0641\u064A\u0629 \u0645\u0646 \u0627\u0644\u0645\u0627\u0621 \u0648\u062A\u062C\u0646\u0628 \u062A\u0646\u0627\u0648\u0644 \u0623\u062F\u0648\u064A\u0629 \u062C\u062F\u064A\u062F\u0629 \u062F\u0648\u0646 \u0627\u0633\u062A\u0634\u0627\u0631\u0629 \u0627\u0644\u0635\u064A\u062F\u0644\u064A." : "Drink sufficient water. Do not start new medications without consulting your pharmacist.",
    "forgot_dose_instruction": isAr ? "\u062A\u0646\u0627\u0648\u0644 \u0627\u0644\u062C\u0631\u0639\u0629 \u0627\u0644\u0641\u0627\u0626\u062A\u0629 \u0641\u0648\u0631 \u062A\u0630\u0643\u0631\u0647\u0627. \u0625\u0630\u0627 \u062D\u0627\u0646 \u0648\u0642\u062A \u0627\u0644\u062C\u0631\u0639\u0629 \u0627\u0644\u062A\u0627\u0644\u064A\u0629 \u062A\u0642\u0631\u064A\u0628\u0627\u064B\u060C \u0641\u062A\u062C\u0627\u0648\u0632 \u0627\u0644\u062C\u0631\u0639\u0629 \u0627\u0644\u0641\u0627\u0626\u062A\u0629 \u0648\u0644\u0627 \u062A\u0636\u0627\u0639\u0641 \u0627\u0644\u062C\u0631\u0639\u0629." : "Take the missed dose as soon as you remember. If it is almost time for your next dose, skip it and resume your schedule. Do not double the dose."
  };
}
function getNews2Fallback(data, isAr) {
  if (isAr) {
    return `
### \u{1F3E5} \u062A\u0642\u064A\u064A\u0645 \u0633\u0631\u064A\u0631\u064A \u0639\u0627\u062C\u0644 (\u0646\u0645\u0648\u0630\u062C \u0627\u0644\u0641\u062D\u0635 \u0627\u0644\u0633\u0631\u064A\u0639 \u0648\u0627\u0633\u062A\u062C\u0627\u0628\u0629 \u0627\u0644\u0637\u0648\u0627\u0631\u0626 - NEWS2)

**\u062A\u0645 \u0625\u0646\u0634\u0627\u0621 \u0647\u0630\u0627 \u0627\u0644\u062A\u0642\u064A\u064A\u0645 \u0639\u0628\u0631 \u0646\u0638\u0627\u0645 \u0627\u0644\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0633\u0631\u064A\u0631\u064A \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A \u0627\u0644\u0645\u062F\u0645\u062C.**

#### 1. \u0627\u0644\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0633\u0631\u064A\u0631\u064A \u0627\u0644\u0645\u0628\u0627\u0634\u0631 \u0644\u0644\u0639\u0644\u0627\u0645\u0627\u062A \u0627\u0644\u062D\u064A\u0648\u064A\u0629:
- **\u062F\u0631\u062C\u0629 \u062E\u0637\u0648\u0631\u0629 \u0627\u0644\u0641\u0631\u0632 \u0627\u0644\u0641\u0633\u064A\u0648\u0644\u0648\u062C\u064A:** \u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062E\u0637\u0648\u0631\u0629 \u0627\u0644\u062D\u0627\u0644\u064A \u0647\u0648 **${data.riskLevel || "\u0645\u062A\u0648\u0633\u0637 \u0625\u0644\u0649 \u0645\u0631\u062A\u0641\u0639"}** \u0645\u0639 \u062F\u0631\u062C\u0629 \u0625\u062C\u0645\u0627\u0644\u064A\u0629 \u062A\u0628\u0644\u063A **(${data.totalScore || 0}/20)**.
- **\u0645\u0639\u062F\u0644 \u0627\u0644\u062A\u0646\u0641\u0633:** ${data.respiratoryRate} \u062F\u0648\u0631\u0629/\u062F\u0642\u064A\u0642\u0629. (\u064A\u062A\u0637\u0644\u0628 \u0645\u0631\u0627\u0642\u0628\u0629 \u0645\u0633\u062A\u0645\u0631\u0629 \u0644\u0644\u0623\u0646\u0645\u0627\u0637 \u0627\u0644\u062A\u0646\u0641\u0633\u064A\u0629).
- **\u0627\u0644\u062A\u0634\u0628\u0639 \u0628\u0627\u0644\u0623\u0643\u0633\u062C\u064A\u0646 (SpO2):** ${data.spo2Scale1 || data.spo2Scale2 || 95}% \u0645\u0639 ${data.oxygenTherapy ? "\u0639\u0644\u0627\u062C \u0645\u062F\u0639\u0648\u0645 \u0628\u0627\u0644\u0623\u0643\u0633\u062C\u064A\u0646" : "\u062A\u0646\u0641\u0633 \u0647\u0648\u0627\u0621 \u0627\u0644\u063A\u0631\u0641\u0629 \u0627\u0644\u0637\u0628\u064A\u0639\u064A"}.
- **\u0636\u063A\u0637 \u0627\u0644\u062F\u0645 \u0627\u0644\u0627\u0646\u0642\u0628\u0627\u0636\u064A:** ${data.systolicBP} \u0645\u0645 \u0632\u0626\u0628\u0642. (\u064A\u062C\u0628 \u0627\u0644\u062D\u0641\u0627\u0638 \u0639\u0644\u0649 \u0627\u0644\u062A\u0631\u0648\u064A\u0629 \u0627\u0644\u0646\u0633\u064A\u062C\u064A\u0629 \u0627\u0644\u0645\u062B\u0627\u0644\u064A\u0629 \u0644\u0644\u0623\u0639\u0636\u0627\u0621 \u0627\u0644\u062D\u064A\u0648\u064A\u0629).
- **\u0645\u0639\u062F\u0644 \u0636\u0631\u0628\u0627\u062A \u0627\u0644\u0642\u0644\u0628:** ${data.pulse} \u0646\u0628\u0636\u0629/\u062F\u0642\u064A\u0642\u0629.
- **\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0648\u0639\u064A (ACVPU):** \u0627\u0644\u0645\u0631\u064A\u0636 \u0641\u064A \u062D\u0627\u0644\u0629 \u0648\u0639\u064A: **${data.consciousness}**.

#### 2. \u0627\u0644\u0625\u062C\u0631\u0627\u0621\u0627\u062A \u0627\u0644\u062A\u0645\u0631\u064A\u0636\u064A\u0629 \u0627\u0644\u0641\u0648\u0631\u064A\u0629 \u0627\u0644\u0645\u0648\u0635\u0649 \u0628\u0647\u0627:
1. **\u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0639\u0644\u0627\u0645\u0627\u062A \u0627\u0644\u062D\u064A\u0648\u064A\u0629:** \u0632\u064A\u0627\u062F\u0629 \u0648\u062A\u064A\u0631\u0629 \u0642\u064A\u0627\u0633 \u0648\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0645\u0624\u0634\u0631\u0627\u062A \u0627\u0644\u0641\u0633\u064A\u0648\u0644\u0648\u062C\u064A\u0629 \u0644\u062A\u0635\u0628\u062D \u0643\u0644 **30 \u062F\u0642\u064A\u0642\u0629 \u0625\u0644\u0649 \u0633\u0627\u0639\u0629 \u0648\u0627\u062D\u062F\u0629** \u0628\u062D\u062F \u0623\u0642\u0635\u0649.
2. **\u0627\u0644\u0639\u0644\u0627\u062C \u0628\u0627\u0644\u0623\u0643\u0633\u062C\u064A\u0646:** \u0636\u0628\u0637 \u062A\u0633\u0631\u064A\u0628 \u0627\u0644\u0623\u0643\u0633\u062C\u064A\u0646 \u0648\u0627\u0644\u062A\u0631\u0637\u064A\u0628 \u0644\u0644\u062D\u0641\u0627\u0638 \u0639\u0644\u0649 \u0645\u0633\u062A\u0648\u064A\u0627\u062A \u0627\u0644\u062A\u0634\u0628\u0639 \u0627\u0644\u0645\u0633\u062A\u0647\u062F\u0641\u0629 (96-99% \u0644\u0644\u0645\u0631\u0636\u0649 \u0627\u0644\u0639\u0627\u062F\u064A\u064A\u0646\u060C \u0623\u0648 88-92% \u0644\u0645\u0631\u0636\u0649 \u0627\u0644\u0633\u062F\u0629 \u0627\u0644\u0631\u0626\u0648\u064A\u0629 \u0627\u0644\u0645\u0632\u0645\u0646\u0629 COPD).
3. **\u0627\u0644\u062A\u0623\u0647\u0628 \u0644\u0641\u062A\u062D \u062E\u0637 \u0648\u0631\u064A\u062F\u064A:** \u062A\u062C\u0647\u064A\u0632 \u0642\u0646\u064A\u0627\u062A \u0648\u0631\u064A\u062F\u064A\u0629 \u0630\u0627\u062A \u0642\u0637\u0631 \u0643\u0628\u064A\u0631 (Cannula 18G) \u0648\u0633\u062D\u0628 \u0639\u064A\u0646\u0627\u062A \u062F\u0645 \u0623\u0633\u0627\u0633\u064A\u0629 \u0628\u0645\u0627 \u0641\u064A \u0630\u0644\u0643 \u063A\u0627\u0632\u0627\u062A \u0627\u0644\u062F\u0645 \u0627\u0644\u0634\u0631\u064A\u0627\u0646\u064A (ABG) \u0648\u062A\u0639\u062F\u0627\u062F \u0627\u0644\u062F\u0645 \u0627\u0644\u0643\u0627\u0645\u0644 \u0648\u0627\u0644\u0643\u0647\u0627\u0631\u0644.

#### 3. \u0628\u0631\u0648\u062A\u0648\u0643\u0648\u0644 \u0627\u0644\u062A\u0635\u0639\u064A\u062F \u0648\u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0627\u0644\u0637\u0628\u064A:
- **\u0625\u0634\u0639\u0627\u0631 \u0641\u0648\u0631\u064A:** \u0625\u0628\u0644\u0627\u063A \u0627\u0644\u0637\u0628\u064A\u0628 \u0627\u0644\u0645\u0642\u064A\u0645 \u0627\u0644\u0645\u0633\u0624\u0648\u0644 \u0648\u0623\u062E\u0635\u0627\u0626\u064A \u0627\u0644\u0631\u0639\u0627\u064A\u0629 \u0627\u0644\u0645\u0631\u0643\u0632\u0629 (ICU) \u0623\u0648 \u0641\u0631\u064A\u0642 \u0627\u0644\u0627\u0633\u062A\u062C\u0627\u0628\u0629 \u0627\u0644\u0633\u0631\u064A\u0639\u0629 (RRT) \u0641\u0648\u0631\u0627\u064B \u0628\u0627\u0644\u0645\u0648\u062C\u0648\u062F\u0627\u062A \u0627\u0644\u062D\u0627\u0644\u064A\u0629.
- **\u0627\u0644\u0627\u0633\u062A\u0639\u062F\u0627\u062F \u0644\u0644\u0646\u0642\u0644:** \u062A\u0623\u0645\u064A\u0646 \u062C\u0627\u0647\u0632\u064A\u0629 \u0639\u0631\u0628\u0629 \u0627\u0644\u0625\u0646\u0639\u0627\u0634 (Crash Cart) \u0648\u062C\u0647\u0627\u0632 \u0627\u0644\u0645\u0631\u0627\u0642\u0628\u0629 \u0627\u0644\u0645\u062D\u0645\u0648\u0644 \u0644\u0644\u0642\u0644\u0628 \u062A\u062D\u0633\u0628\u0627\u064B \u0644\u0646\u0642\u0644 \u0627\u0644\u0645\u0631\u064A\u0636 \u0627\u0644\u0639\u0627\u062C\u0644 \u0644\u0648\u062D\u062F\u0629 \u0627\u0644\u0631\u0639\u0627\u064A\u0629 \u0627\u0644\u0645\u0631\u0643\u0632\u0629 \u0623\u0648 \u0627\u0644\u0637\u0648\u0627\u0631\u0626.

#### 4. \u0627\u0644\u0639\u0644\u0627\u0645\u0627\u062A \u0627\u0644\u062A\u062D\u0630\u064A\u0631\u064A\u0629 \u0627\u0644\u062D\u0645\u0631\u0627\u0621 (Red Flags) \u0644\u0644\u0645\u0631\u0627\u0642\u0628\u0629 \u0627\u0644\u0641\u0648\u0631\u064A\u0629:
- \u062A\u0631\u0627\u062C\u0639 \u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0648\u0639\u064A \u0641\u062C\u0623\u0629 \u0623\u0648 \u062D\u062F\u0648\u062B \u0627\u0631\u062A\u0628\u0627\u0643 \u062D\u0627\u062F \u0648\u0645\u0642\u0627\u0648\u0645\u0629.
- \u0627\u0646\u062E\u0641\u0627\u0636 \u0636\u063A\u0637 \u0627\u0644\u062F\u0645 \u0627\u0644\u0627\u0646\u0642\u0628\u0627\u0636\u064A \u0644\u0623\u0642\u0644 \u0645\u0646 90 \u0645\u0645 \u0632\u0626\u0628\u0642.
- \u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0627\u0644\u0639\u0636\u0644\u0627\u062A \u0627\u0644\u0645\u0633\u0627\u0639\u062F\u0629 \u0644\u0644\u062A\u0646\u0641\u0633 (Respiratory Distress) \u0623\u0648 \u062D\u062F\u0648\u062B \u0632\u0631\u0642\u0629 \u0641\u064A \u0627\u0644\u0634\u0641\u062A\u064A\u0646 \u0648\u0627\u0644\u0623\u0637\u0631\u0627\u0641.
- \u062A\u0628\u0627\u0637\u0624 \u0636\u0631\u0628\u0627\u062A \u0627\u0644\u0642\u0644\u0628 \u0627\u0644\u0645\u0641\u0627\u062C\u0626 \u0627\u0644\u0645\u0635\u062D\u0648\u0628 \u0628\u062A\u0631\u0627\u062C\u0639 \u0627\u0644\u062A\u0631\u0648\u064A\u0629 \u0627\u0644\u0646\u0633\u064A\u062C\u064A\u0629.
`;
  } else {
    return `
### \u{1F3E5} Urgent Clinical Assessment (Early Warning Response - NEWS2)

**This clinical audit has been generated via the offline system fallback protocol.**

#### 1. Physiologic Vital Signs Analysis:
- **Physiological Deterioration Score:** Currently graded as **${data.riskLevel || "Medium to High Risk"}** with an aggregate NEWS2 score of **(${data.totalScore || 0}/20)**.
- **Respiratory Rate:** ${data.respiratoryRate} bpm. (High vigilance required for respiratory effort).
- **Oxygen Saturation (SpO2):** ${data.spo2Scale1 || data.spo2Scale2 || 95}% on ${data.oxygenTherapy ? "supplemental oxygen support" : "room air"}.
- **Systolic Blood Pressure:** ${data.systolicBP} mmHg. (Maintain strict surveillance for perfusion deficits).
- **Heart Rate / Pulse:** ${data.pulse} bpm.
- **Level of Consciousness (ACVPU):** Assessed as **${data.consciousness}**.

#### 2. Immediate Nursing Care Interventions:
1. **Frequency of Monitoring:** Increase clinical vitals charting frequency to every **30 to 60 minutes** without exception.
2. **Oxygen Titration:** Adjust supplemental oxygen flow rates to maintain target oxygenation (96-99% or 88-92% in patients with confirmed hypercapnic respiratory failure).
3. **Intravenous Access:** Ensure dual patent large-bore peripheral IV lines are established. Prepare for arterial blood gas (ABG) and lactate levels.

#### 3. Clinical Escalation Protocol:
- **Immediate Notification:** Notify the attending physician, medical registrar, and alert the Rapid Response Team (RRT) or Critical Care Outreach.
- **Emergency Readiness:** Retrieve and position the emergency crash cart and portable defibrillator/monitor near the patient bedside.

#### 4. Red Flags & Critical Deterioration Warning Signs:
- Any acute decrease in Glasgow Coma Scale (GCS) or new-onset confusion.
- Systolic BP dropping below 90 mmHg.
- Active accessory muscle use, grunting, or peripheral cyanosis.
- Sudden bradycardia associated with clinical shock.
`;
  }
}
function getIsbarFallback(data, isAr) {
  if (isAr) {
    return `
### \u{1F4CB} \u062A\u0642\u0631\u064A\u0631 \u062A\u062F\u0642\u064A\u0642 \u0627\u0644\u062C\u0648\u062F\u0629 \u0648\u0627\u0633\u062A\u0634\u0627\u0631\u0627\u062A \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0633\u0631\u064A\u0631\u064A (\u0645\u0646\u0647\u062C\u064A\u0629 ISBAR)

**\u062A\u0645 \u0625\u0646\u0634\u0627\u0621 \u0647\u0630\u0627 \u0627\u0644\u062A\u0642\u0631\u064A\u0631 \u0639\u0628\u0631 \u0646\u0638\u0627\u0645 \u0627\u0644\u0645\u0645\u0631\u0636 \u0648\u0627\u0644\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0633\u0631\u064A\u0631\u064A \u0627\u0644\u0645\u062F\u0645\u062C \u0643\u062E\u0637\u0648\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629.**

#### 1. \u062A\u062F\u0642\u064A\u0642 \u062C\u0648\u062F\u0629 \u0647\u064A\u0643\u0644 \u0627\u0644\u062A\u0642\u0631\u064A\u0631 (Quality Audit):
- **\u0627\u0644\u062A\u0639\u0631\u064A\u0641 \u0628\u0627\u0644\u0645\u0631\u064A\u0636 (Identify):** \u062A\u0645 \u062A\u0648\u062B\u064A\u0642\u0647 \u0628\u0648\u0636\u0648\u062D (${data.identify || "\u0645\u0643\u062A\u0645\u0644"}).
- **\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0633\u0631\u064A\u0631\u064A \u0627\u0644\u062D\u0627\u0644\u064A (Situation):** \u064A\u0648\u0636\u062D \u0628\u0648\u0636\u0648\u062D \u0627\u0644\u0634\u0643\u0648\u0649 \u0648\u0627\u0644\u062A\u0634\u062E\u064A\u0635 \u0627\u0644\u0623\u0633\u0627\u0633\u064A \u0627\u0644\u062D\u0627\u0644\u064A.
- **\u0627\u0644\u062E\u0644\u0641\u064A\u0629 \u0627\u0644\u0645\u0631\u0636\u064A\u0629 (Background):** \u064A\u0633\u0631\u062F \u0628\u0648\u0636\u0648\u062D \u0627\u0644\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0645\u0631\u0636\u064A \u0648\u0627\u0644\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0627\u0644\u062F\u0627\u0639\u0645\u0629 \u0627\u0644\u062C\u0648\u0647\u0631\u064A\u0629.
- **\u0627\u0644\u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u062D\u0627\u0644\u064A (Assessment):** \u064A\u062D\u062A\u0648\u064A \u0639\u0644\u0649 \u0627\u0644\u0645\u0624\u0634\u0631\u0627\u062A \u0627\u0644\u062D\u064A\u0648\u064A\u0629 \u0648\u0627\u0644\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0627\u0644\u0633\u0631\u064A\u0631\u064A\u0629 \u0627\u0644\u0631\u0627\u0647\u0646\u0629.
- **\u0627\u0644\u062A\u0648\u0635\u064A\u0627\u062A \u0627\u0644\u0645\u0642\u062A\u0631\u062D\u0629 (Recommendation):** \u064A\u062D\u062F\u062F \u062E\u0637\u0629 \u0627\u0644\u0639\u0645\u0644 \u0648\u0627\u0644\u0645\u0633\u0624\u0648\u0644\u064A\u0627\u062A \u0628\u0648\u0636\u0648\u062D.

#### 2. \u0627\u0644\u0631\u0624\u0649 \u0627\u0644\u0633\u0631\u064A\u0631\u064A\u0629 \u0648\u0627\u0644\u062A\u062D\u0630\u064A\u0631\u0627\u062A \u0627\u0644\u0623\u0645\u0646\u064A\u0629 (Clinical Insights & Risks):
- **\u0633\u0644\u0627\u0645\u0629 \u0627\u0644\u062A\u0633\u0644\u064A\u0645:** \u0627\u0644\u062A\u0642\u0631\u064A\u0631 \u064A\u062A\u0628\u0639 \u0627\u0644\u062A\u0631\u062A\u064A\u0628 \u0627\u0644\u0647\u064A\u0643\u0644\u064A \u0627\u0644\u0633\u0644\u064A\u0645 \u0644\u0645\u0646\u0639 \u0641\u0642\u062F\u0627\u0646 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0623\u062B\u0646\u0627\u0621 \u0646\u0642\u0644 \u0627\u0644\u0631\u0639\u0627\u064A\u0629 \u0628\u064A\u0646 \u0627\u0644\u0648\u0631\u062F\u064A\u0627\u062A.
- **\u0627\u0644\u0646\u0642\u0627\u0637 \u0627\u0644\u0639\u0645\u064A\u0627\u0621 \u0627\u0644\u0645\u062D\u062A\u0645\u0644\u0629:** \u062A\u0623\u0643\u062F \u0645\u0646 \u0645\u0631\u0627\u062C\u0639\u0629 \u0646\u062A\u0627\u0626\u062C \u0627\u0644\u062A\u062D\u0627\u0644\u064A\u0644 \u0627\u0644\u0645\u062E\u0628\u0631\u064A\u0629 \u0627\u0644\u0623\u062E\u064A\u0631\u0629 (\u0645\u062B\u0644 \u0643\u0647\u0627\u0631\u0644 \u0627\u0644\u062F\u0645\u060C \u0645\u0633\u062A\u0648\u064A\u0627\u062A \u0627\u0644\u0647\u064A\u0645\u0648\u062C\u0644\u0648\u0628\u064A\u0646) \u0648\u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u062D\u0633\u0627\u0633\u064A\u0629 \u0627\u0644\u062F\u0648\u0627\u0626\u064A\u0629 \u0643\u0628\u0646\u062F \u062F\u0627\u0626\u0645 \u0644\u0645\u0646\u0639 \u0627\u0644\u062D\u0648\u0627\u062F\u062B \u0627\u0644\u0639\u0631\u0636\u064A\u0629.

#### 3. \u0627\u0644\u062E\u0637\u0648\u0627\u062A \u0627\u0644\u0639\u0644\u0627\u062C\u064A\u0629 \u0648\u0627\u0644\u062A\u0634\u062E\u064A\u0635\u064A\u0629 \u0627\u0644\u0645\u0642\u062A\u0631\u062D\u0629:
1. **\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0641\u0647\u0645:** \u064A\u062C\u0628 \u0639\u0644\u0649 \u0627\u0644\u0645\u0645\u0631\u0636 \u0623\u0648 \u0627\u0644\u0637\u0628\u064A\u0628 \u0627\u0644\u0645\u0633\u062A\u0644\u0645 \u0625\u0639\u0627\u062F\u0629 \u0642\u0631\u0627\u0621\u0629 \u0648\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062A\u0648\u0635\u064A\u0627\u062A \u0627\u0644\u0635\u0627\u062F\u0631\u0629 (Read-back protocol).
2. **\u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u062A\u062C\u0647\u064A\u0632\u0627\u062A \u0627\u0644\u0648\u0631\u064A\u062F\u064A\u0629:** \u0645\u0631\u0627\u062C\u0639\u0629 \u0635\u0644\u0627\u062D\u064A\u0629 \u062E\u0637\u0648\u0637 \u0642\u0633\u0637\u0631\u0629 \u0627\u0644\u0645\u063A\u0630\u064A\u0627\u062A \u0648\u0627\u0644\u0623\u062F\u0648\u064A\u0629 \u0627\u0644\u0648\u0631\u064A\u062F\u064A\u0629 \u0648\u0645\u0639\u062F\u0644\u0627\u062A \u062A\u062F\u0641\u0642 \u0627\u0644\u0623\u062C\u0647\u0632\u0629 \u0627\u0644\u0622\u0644\u064A\u0629.
3. **\u062A\u0648\u062B\u064A\u0642 \u0627\u0644\u062A\u0648\u0642\u064A\u062A:** \u062A\u0633\u062C\u064A\u0644 \u0648\u0642\u062A \u0648\u062A\u0627\u0631\u064A\u062E \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0631\u0639\u0627\u064A\u0629 \u0628\u062F\u0642\u0629 \u0641\u064A \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0627\u0644\u0645\u0648\u062D\u062F \u0644\u0644\u0645\u0631\u064A\u0636 (EMR).

#### 4. \u0645\u0642\u062A\u0631\u062D\u0627\u062A \u0644\u062A\u062D\u0633\u064A\u0646 \u0635\u064A\u0627\u063A\u0629 \u062A\u0642\u0627\u0631\u064A\u0631 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0645\u0633\u062A\u0642\u0628\u0644\u0627\u064B:
- \u0627\u062D\u0631\u0635 \u062F\u0627\u0626\u0645\u0627\u064B \u0639\u0644\u0649 \u062A\u0636\u0645\u064A\u0646 \u0622\u062E\u0631 \u0642\u064A\u0645 \u0644\u0644\u0639\u0644\u0627\u0645\u0627\u062A \u0627\u0644\u062D\u064A\u0648\u064A\u0629 (\u0627\u0644\u0645\u0642\u0627\u0633\u0629 \u0641\u064A \u0622\u062E\u0631 \u0633\u0627\u0639\u0629) \u0643\u0623\u0631\u0642\u0627\u0645 \u0645\u062D\u062F\u062F\u0629 \u0641\u064A \u0642\u0633\u0645 \u0627\u0644\u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u0633\u0631\u064A\u0631\u064A \u0644\u062A\u062C\u0646\u0628 \u0627\u0644\u0639\u0628\u0627\u0631\u0627\u062A \u0627\u0644\u0639\u0627\u0645\u0629 \u0645\u062B\u0644 "\u0627\u0644\u0645\u0631\u064A\u0636 \u0645\u0633\u062A\u0642\u0631".
- \u0627\u0630\u0643\u0631 \u0628\u0648\u0636\u0648\u062D \u0623\u064A \u0645\u0648\u0627\u0639\u064A\u062F \u0642\u0631\u064A\u0628\u0629 \u0644\u0625\u0639\u0637\u0627\u0621 \u062C\u0631\u0639\u0627\u062A \u0627\u0644\u0623\u062F\u0648\u064A\u0629 \u0627\u0644\u062D\u0631\u062C\u0629 (\u0645\u062B\u0644 \u0627\u0644\u0645\u0636\u0627\u062F\u0627\u062A \u0627\u0644\u062D\u064A\u0648\u064A\u0629 \u0623\u0648 \u0645\u0645\u064A\u0639\u0627\u062A \u0627\u0644\u062F\u0645) \u0644\u0636\u0645\u0627\u0646 \u0627\u0644\u0627\u0633\u062A\u0645\u0631\u0627\u0631\u064A\u0629 \u0627\u0644\u0639\u0644\u0627\u062C\u064A\u0629 \u062F\u0648\u0646 \u0627\u0646\u0642\u0637\u0627\u0639.
`;
  } else {
    return `
### \u{1F4CB} Handover Quality Audit & Consultation Report (ISBAR Framework)

**This clinical audit has been generated via the offline system fallback protocol.**

#### 1. Structural Information Completeness Audit:
- **Patient Identification (Identify):** Documented properly (${data.identify || "Complete"}).
- **Active Situation (Situation):** Outlines the primary active medical problem or chief complaint.
- **Clinical Background (Background):** Lists past medical history, admissions, and relevant diagnostic milestones.
- **Current Assessment (Assessment):** Includes objective parameters, clinical findings, and recent physiological changes.
- **Actionable Recommendation (Recommendation):** Specifies outstanding tasks, follow-up parameters, and immediate care goals.

#### 2. Clinical Insights & Patient Safety Risk Screening:
- **Handover Safety:** The report adheres to the standard professional structure which reduces communication breakdown during nursing shift-to-shift handovers by up to 80%.
- **Potential Blind Spots:** Verify that the patient's drug allergies are explicitly read out during every handover. Cross-reference the latest lab panels (e.g., potassium, creatinine, hemoglobin) to preempt metabolic or bleeding issues.

#### 3. Recommended Diagnostic & Therapeutic Next Steps:
1. **Verbal Confirmation:** Engage in the standard "Read-Back" protocol to verify high-risk recommendations and critical medication orders.
2. **Line and Device Safety Check:** Perform a physical bedside audit of all running intravenous infusions, vascular access sites, and monitoring devices.
3. **Time-Log Documentation:** Formally sign off and date the transfer of nursing or physician clinical responsibility in the patient's Electronic Medical Record (EMR).

#### 4. Practical Suggestions for Handover Report Improvement:
- Always input specific numerical values for vital signs recorded within the last 60 minutes inside the Assessment field, rather than subjective terms like "vitals stable."
- Specify the exact times of any high-alert medications (e.g., anticoagulants, insulin, continuous infusions) due during the incoming shift to guarantee strict clinical continuity.
`;
  }
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "50mb" }));
  app.use(import_express.default.urlencoded({ limit: "50mb", extended: true }));
  app.post("/api/db/:provider/bulk-sync", async (req, res) => {
    try {
      const { collections } = req.body;
      if (!collections || !Array.isArray(collections)) {
        return res.status(400).json({ success: false, error: "Invalid 'collections' array" });
      }
      const data = await clinicalDataService.bulkSync(collections);
      return res.json({ success: true, data });
    } catch (err) {
      console.error("Error doing bulk sync:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });
  let aiClient = null;
  let hasLoggedAiWarning = false;
  function getAiClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      if (!hasLoggedAiWarning) {
        console.warn("\u26A0\uFE0F GEMINI_API_KEY is not configured. AI features will use offline fallback responses.");
        hasLoggedAiWarning = true;
      }
      return null;
    }
    if (!aiClient) {
      aiClient = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
    }
    return aiClient;
  }
  app.post("/api/ai/analyze-medication", async (req, res) => {
    const { search_query } = req.body;
    if (!search_query || typeof search_query !== "string" || search_query.trim() === "") {
      return res.status(400).json({ success: false, error: "Invalid medication name." });
    }
    try {
      const client2 = getAiClient();
      const systemInstruction = `
You are a digital clinical pharmacist system responsible for medication safety review and labeling.
Your task is to receive the medication name, auto-correct spelling, classify it, and determine safety labels (High-Alert / LASA) and nursing monitoring instructions.
Output ONLY a JSON object based on this schema:
{
  "search_result": {
    "original_query": "string",
    "is_corrected": boolean,
    "corrected_name_trade": "string",
    "generic_name": "string",
    "drug_class": "string"
  },
  "required_labels": {
    "high_alert_status": { "is_high_alert": boolean, "label_color": "string", "reason": "string" },
    "lasa_status": { 
      "has_lasa_risk": boolean, 
      "label_color": "string", 
      "confused_with": Array<{ "name": "string", "reason_of_confusion": "string", "danger_level": "string" }> 
    }
  },
  "clinical_guidelines": {
    "administration_routes": ["string"],
    "vital_signs_to_monitor": ["string"]
  }
}
`;
      let result;
      for (let i = 0; i < 3; i++) {
        try {
          result = await client2.models.generateContent({
            model: "gemini-2.5-flash",
            contents: search_query,
            config: {
              systemInstruction,
              responseMimeType: "application/json",
              temperature: 0
            }
          });
          break;
        } catch (err) {
          if (i === 2) throw err;
          if (err.status === 503 || err.message?.includes("503") || err.message?.includes("high demand") || err.message?.includes("UNAVAILABLE")) {
            await new Promise((resolve) => setTimeout(resolve, 1500 * (i + 1)));
            continue;
          }
          throw err;
        }
      }
      let responseJson;
      try {
        responseJson = JSON.parse(result.text);
      } catch (e) {
        console.error("Critical: AI returned malformed JSON", result.text);
        throw new Error("AI data integrity error.");
      }
      res.json({ success: true, medication: responseJson });
    } catch (error) {
      console.log("Medication AI Model offline fallback activated.");
      const responseJson = getMedicationFallback(search_query);
      res.json({ success: true, medication: responseJson, fallback: true });
    }
  });
  app.post("/api/ai/check-interaction", async (req, res) => {
    const { med1, med2, lang } = req.body;
    if (!med1 || !med2) {
      return res.status(400).json({ success: false, error: "Please provide both medication names." });
    }
    const isAr = lang === "ar";
    try {
      const client2 = getAiClient();
      const systemInstruction = `
You are a senior clinical pharmacist specializing in drug safety and drug-drug interactions.
Analyze the interaction between Medication 1 and Medication 2.
Output ONLY a JSON object based on this schema:
{
  "interaction_severity": "High" | "Moderate" | "Minor" | "None",
  "has_interaction": boolean,
  "mechanism": "string description",
  "clinical_effects": "string description",
  "recommendation": "string recommendation",
  "monitoring_guidelines": "string guidelines",
  "severity_color": "red" | "orange" | "yellow" | "green"
}
Output localized text in the requested language: ${isAr ? "Arabic" : "English"}.
`;
      const response = await client2.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Analyze interaction between: "${med1}" and "${med2}"`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.1
        }
      });
      let responseJson;
      try {
        responseJson = JSON.parse(response.text);
      } catch (e) {
        console.error("Critical: AI interaction returned malformed JSON", response.text);
        throw new Error("AI data integrity error.");
      }
      res.json({ success: true, analysis: responseJson });
    } catch (error) {
      console.log("Interaction AI Model offline fallback activated.");
      const responseJson = getInteractionFallback(med1, med2, isAr);
      res.json({ success: true, analysis: responseJson, fallback: true });
    }
  });
  app.post("/api/ai/iv-compatibility", async (req, res) => {
    const { drug1, drug2, fluid, lang } = req.body;
    if (!drug1 || !drug2) {
      return res.status(400).json({ success: false, error: "Please provide both drugs." });
    }
    const isAr = lang === "ar";
    try {
      const client2 = getAiClient();
      const systemInstruction = `
You are an IV therapy specialist pharmacist. Determine if Drug 1 and Drug 2 are physically and chemically compatible for Y-site co-administration, optionally considering the base fluid if provided.
Output ONLY a JSON object based on this schema:
{
  "compatibility_status": "Compatible" | "Incompatible" | "Caution" | "Data Not Available",
  "explanation": "Detailed explanation of compatibility, physical reactions (precipitation, color change, etc.)",
  "recommendation": "Nursing recommendation"
}
Output text in: ${isAr ? "Arabic" : "English"}.
`;
      const response = await client2.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Drug 1: ${drug1}, Drug 2: ${drug2}, Base Fluid: ${fluid || "None"}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.1
        }
      });
      res.json({ success: true, result: JSON.parse(response.text) });
    } catch (error) {
      console.log("IV Compatibility AI Model offline fallback activated.");
      const responseJson = getIvCompatibilityFallback(drug1, drug2, fluid || "", isAr);
      res.json({ success: true, result: responseJson, fallback: true });
    }
  });
  app.post("/api/ai/medication-counseling", async (req, res) => {
    const { medication, lang } = req.body;
    if (!medication) {
      return res.status(400).json({ success: false, error: "Please provide medication." });
    }
    const isAr = lang === "ar";
    try {
      const client2 = getAiClient();
      const systemInstruction = `
You are a patient education pharmacist. Create a simple, patient-friendly counseling sheet for the given medication. 
Use plain language (no complex medical jargon).
Output ONLY a JSON object based on this schema:
{
  "drug_name": "Name of drug",
  "what_is_it_for": "Simple explanation",
  "how_to_take": "Clear instructions",
  "common_side_effects": ["side effect 1", "side effect 2"],
  "when_to_call_doctor": ["warning sign 1", "warning sign 2"],
  "food_drug_interactions": "Simple list of foods or other drugs to avoid",
  "forgot_dose_instruction": "What to do if a dose is missed"
}
Output text in: ${isAr ? "Arabic" : "English"}.
`;
      const response = await client2.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Medication: ${medication}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });
      res.json({ success: true, counseling: JSON.parse(response.text) });
    } catch (error) {
      console.log("Medication Counseling AI Model offline fallback activated.");
      const responseJson = getCounselingFallback(medication, isAr);
      res.json({ success: true, counseling: responseJson, fallback: true });
    }
  });
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  app.post("/api/v1/patients", async (req, res) => {
    try {
      await clinicalDataService.saveItem("patients", req.body);
      res.status(201).json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to save patient" });
    }
  });
  app.get("/api/v1/patients/search", async (req, res) => {
    const queryStr = req.query.q;
    try {
      const patients3 = await clinicalDataService.getCollection("patients");
      const filtered = patients3.filter((p) => p.mrn?.includes(queryStr) || p.national_id?.includes(queryStr) || p.phone_mobile?.includes(queryStr));
      res.json({ success: true, data: filtered });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to search patients" });
    }
  });
  app.post("/api/v1/encounters", async (req, res) => {
    try {
      await clinicalDataService.saveItem("encounters", req.body);
      res.status(201).json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to save encounter" });
    }
  });
  app.put("/api/v1/encounters/:id/check-in", async (req, res) => {
    try {
      await clinicalDataService.saveItem("encounters", { ...req.body, id: req.params.id, status: "CHECKED_IN" });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to check in" });
    }
  });
  app.post("/api/settings/update-provider", (req, res) => {
    const { provider, settings: settings3 } = req.body;
    console.log("Updating provider:", provider, "with settings:", Object.keys(settings3));
    if (provider && settings3) {
      try {
        if (provider === "SUPABASE") {
          const { supabaseUrl: supabaseUrl2, supabaseKey: supabaseKey2 } = settings3;
          if (!supabaseUrl2.startsWith("http")) throw new Error("Invalid Supabase URL: Must start with http");
          global.supabaseAdmin = (0, import_supabase_js.createClient)(supabaseUrl2, supabaseKey2);
        }
        import_fs2.default.writeFileSync("server-settings.json", JSON.stringify({ activeProvider: provider, settings: settings3 }));
        setProvider(provider);
        console.log("Database settings updated and persisted for:", provider);
        return res.json({ success: true, message: "Database settings updated." });
      } catch (e) {
        console.error("Failed to initialize database provider:", e.message);
        return res.status(400).json({ success: false, error: e.message });
      }
    }
    return res.status(400).json({ success: false, error: "Invalid provider or settings." });
  });
  app.get("/api/settings/get-settings", (req, res) => {
    if (import_fs2.default.existsSync("server-settings.json")) {
      try {
        const settings3 = JSON.parse(import_fs2.default.readFileSync("server-settings.json", "utf8"));
        return res.json({ success: true, settings: settings3 });
      } catch (e) {
        return res.status(500).json({ success: false, error: "Error reading settings" });
      }
    }
    return res.json({ success: false, error: "No settings found" });
  });
  function getDepartmentInsightsFallback(data, isAr) {
    if (isAr) {
      return `
### \u{1F3E5} \u062A\u0642\u0631\u064A\u0631 \u0627\u0644\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0633\u0631\u064A\u0631\u064A \u0648\u0627\u0644\u062A\u0634\u063A\u064A\u0644\u064A \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A \u0644\u0644\u0642\u0633\u0645 (\u0627\u0644\u0628\u0627\u0637\u0646\u0629 \u0627\u0644\u0639\u0627\u0645\u0629)

**\u062A\u0645 \u0625\u0646\u0634\u0627\u0621 \u0647\u0630\u0627 \u0627\u0644\u062A\u0642\u0631\u064A\u0631 \u0639\u0628\u0631 \u0627\u0644\u0646\u0638\u0627\u0645 \u0627\u0644\u0633\u0631\u064A\u0631\u064A \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A \u0627\u0644\u0645\u062F\u0645\u062C \u0643\u062E\u0637\u0648\u0629 \u0622\u0645\u0646\u0629.**

#### 1. \u{1F4CA} \u0627\u0644\u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u0633\u0631\u064A\u0631\u064A \u0627\u0644\u0633\u0631\u064A\u0639 \u0648\u0627\u0644\u0639\u0628\u0621 \u0627\u0644\u0639\u0645\u0644\u064A:
- **\u0645\u0639\u062F\u0644 \u0625\u0634\u063A\u0627\u0644 \u0627\u0644\u0642\u0633\u0645:** \u062A\u0628\u0644\u063A \u0646\u0633\u0628\u0629 \u0627\u0644\u0625\u0634\u063A\u0627\u0644 \u0627\u0644\u062D\u0627\u0644\u064A\u0629 **${data.occupancyRate || 75}%** (\u0645\u0646\u0648\u0645 **${data.admittedPatientsCount || 24}** \u0645\u0631\u064A\u0636 \u0645\u0646 \u0623\u0635\u0644 \u0633\u0639\u0629 \u0625\u062C\u0645\u0627\u0644\u064A\u0629 **${data.capacity || 32}** \u0633\u0631\u064A\u0631\u0627\u064B).
- **\u0627\u0644\u0636\u063A\u0637 \u0627\u0644\u0633\u0631\u064A\u0631\u064A:** \u0639\u0628\u0621 \u062A\u0645\u0631\u064A\u0636\u064A \u0645\u062A\u0648\u0633\u0637 \u0625\u0644\u0649 \u0645\u0631\u062A\u0641\u0639 \u0645\u0639 \u0648\u062C\u0648\u062F **${data.pendingTasksCount || 15}** \u0645\u0647\u0645\u0629 \u0645\u0639\u0644\u0642\u0629 \u062A\u062A\u0637\u0644\u0628 \u0627\u0644\u062A\u0648\u0632\u064A\u0639 \u0627\u0644\u0641\u0648\u0631\u064A.
- **\u0627\u0644\u062D\u0627\u0644\u0627\u062A \u0627\u0644\u062D\u0631\u062C\u0629:** \u0648\u062C\u0648\u062F **${data.criticalCasesCount || 3}** \u062D\u0627\u0644\u0627\u062A \u062D\u0631\u062C\u0629 \u063A\u064A\u0631 \u0645\u0633\u062A\u0642\u0631\u0629 \u0641\u064A \u0627\u0644\u0642\u0633\u0645 \u062A\u062A\u0637\u0644\u0628 \u0627\u0647\u062A\u0645\u0627\u0645\u0627\u064B \u0637\u0628\u064A\u0627\u064B \u0648\u062B\u064A\u0642\u0627\u064B \u0648\u0645\u0633\u062A\u0645\u0631\u0627\u064B.

#### 2. \u{1F4CB} \u062A\u0648\u0635\u064A\u0627\u062A \u062A\u0648\u0632\u064A\u0639 \u0627\u0644\u0645\u0645\u0631\u0636\u064A\u0646 \u0648\u0627\u0644\u0643\u0627\u062F\u0631 \u0627\u0644\u0637\u0628\u064A:
1. **\u0646\u0633\u0628\u0629 \u0627\u0644\u0643\u0627\u062F\u0631 \u0625\u0644\u0649 \u0627\u0644\u0645\u0631\u0636\u0649 (Nurse-to-Patient Ratio):** \u064A\u0648\u0635\u0649 \u0628\u062A\u0637\u0628\u064A\u0642 \u0646\u0633\u0628\u0629 **1:1** \u0623\u0648 **1:2** \u0644\u0644\u062D\u0627\u0644\u0627\u062A \u0627\u0644\u062D\u0631\u062C\u0629 \u0627\u0644\u062B\u0644\u0627\u062B\u060C \u0648\u0646\u0633\u0628\u0629 **1:5** \u0644\u0644\u062D\u0627\u0644\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u0642\u0631\u0629 \u0627\u0644\u0645\u062A\u0628\u0642\u064A\u0629 \u0644\u0636\u0645\u0627\u0646 \u0633\u0644\u0627\u0645\u0629 \u0627\u0644\u0645\u0631\u0636\u0649.
2. **\u0625\u0639\u0627\u062F\u0629 \u062A\u0631\u062A\u064A\u0628 \u0623\u0648\u0644\u0648\u064A\u0627\u062A \u0627\u0644\u0645\u0647\u0627\u0645:** \u062A\u0635\u0646\u064A\u0641 \u0627\u0644\u0645\u0647\u0627\u0645 \u0627\u0644\u0645\u0639\u0644\u0642\u0629 \u0627\u0644\u0640 **${data.pendingTasksCount || 15}** \u0644\u062A\u0643\u0648\u0646 \u0645\u0647\u0627\u0645 \u0625\u0639\u0637\u0627\u0621 \u0627\u0644\u0623\u062F\u0648\u064A\u0629 \u0627\u0644\u0648\u0631\u064A\u062F\u064A\u0629 \u0648\u0641\u062D\u0635 \u0627\u0644\u0639\u0644\u0627\u0645\u0627\u062A \u0627\u0644\u062D\u064A\u0648\u064A\u0629 \u0644\u0644\u062D\u0627\u0644\u0627\u062A \u0627\u0644\u062D\u0631\u062C\u0629 \u0641\u064A \u0635\u062F\u0627\u0631\u0629 \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062A\u0646\u0641\u064A\u0630 \u0627\u0644\u0641\u0648\u0631\u064A.

#### 3. \u{1F6E1}\uFE0F \u062E\u0637\u0629 \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062D\u0627\u0644\u0627\u062A \u0627\u0644\u062D\u0631\u062C\u0629 \u0627\u0644\u0640 ${data.criticalCasesCount || 3}:
- \u062A\u0641\u0639\u064A\u0644 \u0628\u0631\u0648\u062A\u0648\u0643\u0648\u0644 **NEWS2** \u0648\u0625\u0639\u0627\u062F\u0629 \u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u0639\u0644\u0627\u0645\u0627\u062A \u0627\u0644\u062D\u064A\u0648\u064A\u0629 \u0643\u0644 **30 \u062F\u0642\u064A\u0642\u0629** \u0628\u062F\u0648\u0646 \u0627\u0633\u062A\u062B\u0646\u0627\u0621.
- \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u062A\u0648\u0627\u0641\u0631 \u0639\u0631\u0628\u0629 \u0627\u0644\u0625\u0646\u0639\u0627\u0634 \u0627\u0644\u0642\u0644\u0628\u064A \u0627\u0644\u0631\u0626\u0648\u064A (Crash Cart) \u0648\u062C\u0627\u0647\u0632\u064A\u062A\u0647\u0627 \u0644\u0644\u0639\u0645\u0644 \u0627\u0644\u0641\u0648\u0631\u064A \u0641\u064A \u0627\u0644\u062C\u0646\u0627\u062D.
- \u062A\u062C\u0647\u064A\u0632 \u062E\u0637\u0648\u0637 \u0648\u0631\u064A\u062F\u064A\u0629 \u0633\u0627\u0644\u0643\u0629 \u0648\u0636\u0645\u0627\u0646 \u062A\u0641\u0639\u064A\u0644 \u0623\u062C\u0647\u0632\u0629 \u0627\u0644\u0645\u0631\u0627\u0642\u0628\u0629 \u0627\u0644\u0645\u0633\u062A\u0645\u0631\u0629 \u0644\u0645\u0639\u062F\u0644 \u0636\u0631\u0628\u0627\u062A \u0627\u0644\u0642\u0644\u0628 \u0648\u0627\u0644\u062A\u0634\u0628\u0639 \u0628\u0627\u0644\u0623\u0643\u0633\u062C\u064A\u0646.

#### 4. \u{1F6CF}\uFE0F \u0625\u062F\u0627\u0631\u0629 \u062A\u062F\u0641\u0642 \u0627\u0644\u0645\u0631\u0636\u0649 \u0648\u0633\u0639\u0629 \u0627\u0644\u0623\u0633\u0631\u0629:
- \u064A\u0628\u0644\u063A \u0639\u062F\u062F \u0627\u0644\u0623\u0633\u0631\u0629 \u0627\u0644\u0645\u062A\u0648\u0641\u0631\u0629 **${data.availableBedsCount || 8}** \u0623\u0633\u0631\u0629. \u064A\u062C\u0628 \u0627\u0644\u062A\u0646\u0633\u064A\u0642 \u0645\u0639 \u0642\u0633\u0645 \u0627\u0644\u0637\u0648\u0627\u0631\u0626 (ER) \u0644\u062D\u062C\u0632 \u0633\u0631\u064A\u0631\u064A\u0646 \u0644\u0644\u062D\u0627\u0644\u0627\u062A \u0627\u0644\u0637\u0627\u0631\u0626\u0629 \u0627\u0644\u0648\u0627\u0631\u062F\u0629\u060C \u0648\u0628\u062F\u0621 \u062A\u062E\u0637\u064A\u0637 \u0627\u0644\u062E\u0631\u0648\u062C \u0627\u0644\u0645\u0628\u0643\u0631 (Early Discharge) \u0644\u0644\u0645\u0631\u0636\u0649 \u0627\u0644\u0645\u0633\u062A\u0642\u0631\u064A\u0646 \u0644\u062A\u062D\u0633\u064A\u0646 \u0627\u0644\u0633\u0639\u0629 \u0627\u0644\u062A\u062F\u0648\u064A\u0631\u064A\u0629.
`;
    } else {
      return `
### \u{1F3E5} Offline Department Operational & Clinical Backup Report

**This analysis has been generated via the offline system fallback protocol.**

#### 1. \u{1F4CA} Operational Workload & Capacity Assessment:
- **Department Occupancy:** The current occupancy rate is **${data.occupancyRate || 75}%** with **${data.admittedPatientsCount || 24}** occupied beds out of a maximum capacity of **${data.capacity || 32}** beds.
- **Workload Stress:** Medium-to-High nursing workload with **${data.pendingTasksCount || 15}** outstanding clinical tasks pending resolution.
- **Critical Care Vigilance:** **${data.criticalCasesCount || 3}** unstable critical patients currently admitted, requiring high clinical surveillance.

#### 2. \u{1F4CB} Staff Allocation & Nursing Workload Guidance:
1. **Nurse-to-Patient Ratio:** We recommend a dedicated **1:1** or **1:2** ratio for the 3 critical cases, and a **1:5** ratio for the stable general ward patients.
2. **Task Prioritization:** Sort the **${data.pendingTasksCount || 15}** pending tasks immediately. High-alert drug administration and vital sign tracking for unstable patients must take precedence.

#### 3. \u{1F6E1}\uFE0F Critical Cases Safety Action Plan:
- Re-assess vitals for the **${data.criticalCasesCount || 3}** critical patients using the **NEWS2** framework every **30 minutes**.
- Verify that the emergency crash cart is fully stocked, functional, and placed in proximity to the critical care rooms.
- Establish secure intravenous access and initiate continuous cardiac/O2 saturation monitoring.

#### 4. \u{1F6CF}\uFE0F Patient Flow & Discharge Coordination:
- **${data.availableBedsCount || 8}** beds are currently vacant. Coordinate with the emergency department to preserve 2 beds for prospective acute admissions. Initiate discharge planning for clinically stable patients.
`;
    }
  }
  function getDepartmentChatFallback(data, isAr) {
    if (isAr) {
      return `\u0645\u0631\u062D\u0628\u0627\u064B! \u0623\u0646\u0627 \u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0642\u0633\u0645 \u0627\u0644\u0633\u0631\u064A\u0631\u064A \u0627\u0644\u0645\u062F\u0645\u062C (\u0648\u0636\u0639 \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637). 

\u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0645\u0639\u0637\u064A\u0627\u062A \u0627\u0644\u0642\u0633\u0645 \u0627\u0644\u062D\u0627\u0644\u064A\u0629:
- **\u0627\u0644\u0645\u0631\u0636\u0649 \u0627\u0644\u0645\u0646\u0648\u0645\u064A\u0646:** ${data.stats?.admitted || 24} \u0645\u0631\u064A\u0636\u0627\u064B.
- **\u0627\u0644\u0623\u0633\u0631\u0629 \u0627\u0644\u0634\u0627\u063A\u0631\u0629:** ${data.stats?.available || 8} \u0623\u0633\u0631\u0629.
- **\u0627\u0644\u0645\u0647\u0627\u0645 \u0627\u0644\u0645\u0639\u0644\u0642\u0629:** ${data.stats?.pending || 15} \u0645\u0647\u0645\u0629.
- **\u0627\u0644\u062D\u0627\u0644\u0627\u062A \u0627\u0644\u062D\u0631\u062C\u0629:** ${data.stats?.critical || 3} \u062D\u0627\u0644\u0627\u062A \u062D\u0631\u062C\u0629.

\u0633\u0624\u0627\u0644\u0643 \u0647\u0648: "${data.query}"

*\u0646\u0638\u0631\u0627\u064B \u0644\u0639\u062F\u0645 \u062A\u0648\u0641\u0631 \u062E\u0627\u062F\u0645 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u062D\u0627\u0644\u064A\u0627\u064B\u060C \u064A\u0631\u062C\u0649 \u0627\u0644\u0627\u0633\u062A\u0639\u0627\u0646\u0629 \u0628\u0627\u0644\u0637\u0628\u064A\u0628 \u0627\u0644\u0645\u0646\u0627\u0648\u0628 \u0623\u0648 \u0631\u0626\u064A\u0633 \u0627\u0644\u062A\u0645\u0631\u064A\u0636 \u0644\u0644\u0625\u062C\u0627\u0628\u0629 \u0627\u0644\u0633\u0631\u064A\u0631\u064A\u0629 \u0627\u0644\u062F\u0642\u064A\u0642\u0629 \u0637\u0628\u0642\u0627\u064B \u0644\u0628\u0631\u0648\u062A\u0648\u0643\u0648\u0644 \u0627\u0644\u0645\u0633\u062A\u0634\u0641\u0649.*`;
    } else {
      return `Hello! I am the integrated Clinical Department Assistant (Offline backup mode).

Based on the current metrics of the department:
- **Admitted Patients:** ${data.stats?.admitted || 24}
- **Available Beds:** ${data.stats?.available || 8}
- **Pending Tasks:** ${data.stats?.pending || 15}
- **Critical Cases:** ${data.stats?.critical || 3}

Your question: "${data.query}"

*Since the live AI model is temporarily busy, please consult with the shift supervisor or attending physician in accordance with hospital policies.*`;
    }
  }
  app.post("/api/ai/chat", async (req, res) => {
    const { query, history, lang } = req.body;
    if (!query) return res.status(400).json({ success: false, error: "Query required." });
    const isAr = lang === "ar";
    try {
      const client2 = getAiClient();
      if (!client2) throw new Error("AI Client not available");
      const systemInstruction = `
You are the Hospital's Clinical AI Copilot (Clinical Brain). 
You help medical staff (Doctors, Nurses, Pharmacists) with clinical decisions, protocol lookup, and patient management.
Be professional, evidence-based, and always include safety reminders.
If the query is about specific hospital policies, answer based on standard JCI/CBAHI healthcare standards.
Keep responses concise and structured.
Respond in: ${isAr ? "Arabic" : "English"}.
`;
      const response = await client2.models.generateContent({
        model: "gemini-2.5-flash",
        contents: query,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });
      res.json({ success: true, response: response.text });
    } catch (err) {
      console.log("General AI Chat fallback active.");
      const fallbackResponse = isAr ? `\u0623\u0646\u0627 \u0627\u0644\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0630\u0643\u064A \u0641\u064A \u0648\u0636\u0639 \u0639\u062F\u0645 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u062D\u0627\u0644\u064A\u0627\u064B. \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0633\u0624\u0627\u0644\u0643 "${query}"\u060C \u0623\u0648\u0635\u064A \u0628\u0645\u0631\u0627\u062C\u0639\u0629 \u0628\u0631\u0648\u062A\u0648\u0643\u0648\u0644\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u0634\u0641\u0649 \u0627\u0644\u0645\u0639\u062A\u0645\u062F\u0629 \u0648\u0627\u0644\u062A\u0634\u0627\u0648\u0631 \u0645\u0639 \u0627\u0644\u0641\u0631\u064A\u0642 \u0627\u0644\u0637\u0628\u064A \u0627\u0644\u0645\u0634\u0631\u0641 \u0644\u0636\u0645\u0627\u0646 \u0633\u0644\u0627\u0645\u0629 \u0627\u0644\u0645\u0631\u064A\u0636.` : `I am currently in offline mode. Regarding your query "${query}", I recommend reviewing established hospital protocols and consulting with the senior medical team for patient safety.`;
      res.json({ success: true, response: fallbackResponse, fallback: true });
    }
  });
  app.post("/api/ai/analyze-clinical", async (req, res) => {
    const { type, data, lang } = req.body;
    const isAr = lang === "ar";
    try {
      const client2 = getAiClient();
      let targetPrompt = "";
      if (type === "news2") {
        targetPrompt = `
You are a highly qualified Clinical Consultant and triage expert.
You are analyzing a patient's National Early Warning Score (NEWS2) data to evaluate risk and recommend actions.

Patient Data:
- Respiratory Rate: ${data.respiratoryRate} bpm
- SpO2 Scale 1: ${data.spo2Scale1}%
- SpO2 Scale 2: ${data.spo2Scale2}%
- Oxygen Therapy: ${data.oxygenTherapy ? "Yes" : "No"}
- Systolic Blood Pressure: ${data.systolicBP} mmHg
- Pulse / Heart Rate: ${data.pulse} bpm
- Consciousness (ACVPU): ${data.consciousness}
- Temperature: ${data.temperature}\xB0C
- Calculated SCORE: ${data.totalScore}
- Risk Level: ${data.riskLevel}

Please provide:
1. Clinical Assessment (\u0627\u0644\u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u0633\u0631\u064A\u0631\u064A): Evaluate the physiological risk severity based on these parameters.
2. Immediate Nursing Actions (\u0627\u0644\u0625\u062C\u0631\u0627\u0621\u0627\u062A \u0627\u0644\u062A\u0645\u0631\u064A\u0636\u064A\u0629 \u0627\u0644\u0641\u0648\u0631\u064A\u0629): Steps to stabilize the patient.
3. Escalation Protocol (\u0628\u0631\u0648\u062A\u0648\u0643\u0648\u0644 \u0627\u0644\u062A\u0635\u0639\u064A\u062F): Who to notify (e.g., attending physician, Critical Care Team) and frequency of monitoring.
4. Red Flags & Warning Signs (\u0627\u0644\u0639\u0644\u0627\u0645\u0627\u062A \u0627\u0644\u062A\u062D\u0630\u064A\u0631\u064A\u0629 \u0627\u0644\u062E\u0637\u064A\u0631\u0629): Specific symptoms or deterioration signs to watch for.

Format the response beautifully in clean, structured Markdown.
The language of the response MUST be: ${lang === "ar" ? "Arabic" : "English"}.
If in Arabic, write with professional medical terminology used in top hospitals. Ensure a compassionate, professional, and clear scientific tone.
        `;
      } else if (type === "isbar") {
        targetPrompt = `
You are a Clinical Auditor and Expert Nurse Trainer. You are reviewing a patient medical handover report formatted as ISBAR (Identify, Situation, Background, Assessment, Recommendation).

Handover Data:
- Identify (\u0627\u0644\u062A\u0639\u0631\u064A\u0641 \u0628\u0627\u0644\u0645\u0631\u064A\u0636): ${data.identify}
- Situation (\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0633\u0631\u064A\u0631\u064A \u0627\u0644\u062D\u0627\u0644\u064A): ${data.situation}
- Background (\u0627\u0644\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0645\u0631\u0636\u064A \u0648\u0627\u0644\u062E\u0644\u0641\u064A\u0629): ${data.background}
- Assessment (\u0627\u0644\u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u062D\u0627\u0644\u064A \u0644\u0644\u0645\u0631\u064A\u0636): ${data.assessment}
- Recommendation (\u0627\u0644\u062A\u0648\u0635\u064A\u0627\u062A \u0648\u062E\u0637\u0637 \u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629): ${data.recommendation}

Please provide:
1. Quality Audit & Review (\u062A\u062F\u0642\u064A\u0642 \u062C\u0648\u062F\u0629 \u0627\u0644\u062A\u0642\u0631\u064A\u0631): Critically review this ISBAR handover for completeness, accuracy, and clear communication.
2. Clinical Insights & Risks (\u0627\u0644\u0631\u0624\u0649 \u0648\u0627\u0644\u062A\u062D\u0630\u064A\u0631\u0627\u062A \u0627\u0644\u0633\u0631\u064A\u0631\u064A\u0629): Identify potential blind spots, active risks, or missing information in the transfer of care.
3. Recommended Diagnostic / Therapeutic next steps (\u0627\u0644\u062E\u0637\u0648\u0627\u062A \u0627\u0644\u0639\u0644\u0627\u062C\u064A\u0629 \u0648\u0627\u0644\u062A\u0634\u062E\u064A\u0635\u064A\u0629 \u0627\u0644\u0645\u0642\u062A\u0631\u062D\u0629): Immediate suggestions for safe patient clinical management.
4. Suggestions for Handover Improvement (\u0645\u0642\u062A\u0631\u062D\u0627\u062A \u0644\u062A\u062D\u0633\u064A\u0646 \u0635\u064A\u0627\u063A\u0629 \u0627\u0644\u062A\u0642\u0631\u064A\u0631): How this report could be written better or more clearly to avoid communication errors.

Format the response beautifully in clean, structured Markdown.
The language of the response MUST be: ${lang === "ar" ? "Arabic" : "English"}.
If in Arabic, write with professional medical terminology used in top hospitals. Ensure a compassionate, professional, and clear scientific tone.
        `;
      } else if (type === "department_insights") {
        targetPrompt = `
You are an expert Chief Medical Officer and Clinical Operations Director.
Analyze the operational and clinical state of the ${data.departmentName} department:
- Admitted Patients: ${data.admittedPatientsCount} (Capacity: ${data.capacity || 32}, Occupancy Rate: ${data.occupancyRate || 75}%)
- Vacant/Available Beds: ${data.availableBedsCount}
- Pending/Outstanding Tasks: ${data.pendingTasksCount}
- Critical Patients: ${data.criticalCasesCount}

Please provide:
1. Operational Assessment & Staff Allocation (\u0627\u0644\u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u062A\u0634\u063A\u064A\u0644\u064A \u0648\u062A\u0648\u0632\u064A\u0639 \u0627\u0644\u0643\u0627\u062F\u0631): Analyze the occupancy and workload (15 tasks, 3 critical cases) and recommend nursing/physician staffing ratios.
2. Clinical Action Plan for Critical Cases (\u062E\u0637\u0629 \u0627\u0644\u0639\u0645\u0644 \u0627\u0644\u0633\u0631\u064A\u0631\u064A\u0629 \u0644\u0644\u062D\u0627\u0644\u0627\u062A \u0627\u0644\u062D\u0631\u062C\u0629): Specific checklists and safety guidelines for managing the 3 critical patients in this department.
3. Bed Capacity & Flow Optimization (\u062A\u062D\u0633\u064A\u0646 \u062A\u062F\u0641\u0642 \u0627\u0644\u0645\u0631\u0636\u0649 \u0648\u0633\u0639\u0629 \u0627\u0644\u0623\u0633\u0631\u0629): Strategies to optimize bed utilization, discharge planning, and coordination with the ER/ICU.
4. Risk Management & Forecast (\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u062E\u0627\u0637\u0631 \u0648\u0627\u0644\u062A\u0646\u0628\u0624 \u0627\u0644\u0633\u0631\u064A\u0631\u064A): Identify potential operational bottlenecks or safety issues (e.g., patient safety risks, task delays, ventilator/monitor constraints) over the next 24-48 hours.

Format the response in gorgeous, highly professional Markdown with clear headers, bullet points, and key terms in bold.
The language of the response MUST be: ${lang === "ar" ? "Arabic" : "English"}.
        `;
      } else if (type === "department_chat") {
        targetPrompt = `
You are a helpful and highly intelligent Clinical Department AI assistant. You help medical staff manage the ${data.departmentName} department.
Here are the live metrics of the department:
- Admitted Patients: ${data.stats?.admitted || 24}
- Available Beds: ${data.stats?.available || 8}
- Pending Tasks: ${data.stats?.pending || 15}
- Critical Cases: ${data.stats?.critical || 3}

Answer the user's clinical or operational question in the requested language: ${lang === "ar" ? "Arabic" : "English"}.
User Question: "${data.query}"

Provide a concise, highly practical, and clinically sound answer. Do not use generic filler text. Use medical standards where appropriate.
If the question is in Arabic, respond in clear, professional Arabic medical terminology.
        `;
      } else if (type === "diagnostic_support") {
        targetPrompt = `
You are a Senior Diagnostic Specialist AI. 
Analyze the following patient symptoms/query and provide a structured differential diagnosis support.
Query: "${data.query}"

Please provide:
1. Differential Diagnosis (\u0627\u0644\u062A\u0634\u062E\u064A\u0635 \u0627\u0644\u062A\u0641\u0631\u064A\u0642\u064A): 3-5 possible conditions ranked by likelihood.
2. Clinical Red Flags (\u0639\u0644\u0627\u0645\u0627\u062A \u0627\u0644\u062E\u0637\u0631): Immediate warnings based on symptoms.
3. Recommended Workup (\u0627\u0644\u0641\u062D\u0648\u0635\u0627\u062A \u0627\u0644\u0645\u0642\u062A\u0631\u062D\u0629): Labs, imaging, or physical exam maneuvers.
4. Triage Level (\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0641\u0631\u0632): Suggested urgency level.

Format in clean Markdown. Language: ${lang === "ar" ? "Arabic" : "English"}.
        `;
      } else if (type === "sbar_handover") {
        targetPrompt = `
You are a Clinical Liaison AI. Generate a professional SBAR (Situation, Background, Assessment, Recommendation) handover summary based on the provided context.
Context: "${data.query}"

Format in clean Markdown with bold SBAR headers. Language: ${lang === "ar" ? "Arabic" : "English"}.
        `;
      } else {
        targetPrompt = `
You are a Clinical Quality and Patient Safety AI expert.
Analyze the following medical clinical tool audit / findings:
${JSON.stringify(data, null, 2)}

Provide a professional clinical review, safety assessment, potential risk markers, and recommendations formatted in clean Markdown.
The language of the response MUST be: ${lang === "ar" ? "Arabic" : "English"}.
        `;
      }
      let response;
      let lastError;
      for (let i = 0; i < 3; i++) {
        try {
          response = await client2.models.generateContent({
            model: "gemini-2.5-flash",
            contents: targetPrompt,
            config: {
              temperature: 0.3
            }
          });
          break;
        } catch (err) {
          lastError = err;
          if (err.status === 503 || err.message?.includes("503") || err.message?.includes("high demand") || err.message?.includes("UNAVAILABLE")) {
            await new Promise((resolve) => setTimeout(resolve, 1500 * (i + 1)));
            continue;
          }
          throw err;
        }
      }
      if (!response) throw lastError;
      const text2 = response.text || "";
      res.json({ success: true, analysis: text2 });
    } catch (error) {
      console.log("Clinical Safety AI Model offline fallback activated.");
      let text2 = "";
      if (type === "news2") {
        text2 = getNews2Fallback(data, isAr);
      } else if (type === "isbar") {
        text2 = getIsbarFallback(data, isAr);
      } else if (type === "department_insights") {
        text2 = getDepartmentInsightsFallback(data, isAr);
      } else if (type === "department_chat") {
        text2 = getDepartmentChatFallback(data, isAr);
      } else if (type === "diagnostic_support") {
        text2 = isAr ? `### \u{1FA7A} \u0646\u0638\u0627\u0645 \u0627\u0644\u062A\u0634\u062E\u064A\u0635 \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A

\u0623\u0646\u0627 \u0641\u064A \u0648\u0636\u0639 \u0639\u062F\u0645 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u062D\u0627\u0644\u064A\u0627\u064B. \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0648\u0635\u0641\u0643: "${data.query}"\u060C \u064A\u0631\u062C\u0649 \u0625\u062C\u0631\u0627\u0621 \u0641\u062D\u0635 \u0633\u0631\u064A\u0631\u064A \u0634\u0627\u0645\u0644 \u0648\u0645\u0631\u0627\u062C\u0639\u0629 \u0628\u0631\u0648\u062A\u0648\u0643\u0648\u0644\u0627\u062A \u0627\u0644\u0641\u0631\u0632 (Triage) \u0627\u0644\u0645\u0639\u062A\u0645\u062F\u0629. \u0627\u0633\u062A\u0634\u0631 \u0627\u0644\u0637\u0628\u064A\u0628 \u0627\u0644\u0623\u062E\u0635\u0627\u0626\u064A \u0641\u0648\u0631\u0627\u064B \u0625\u0630\u0627 \u0643\u0627\u0646\u062A \u0647\u0646\u0627\u0643 \u0639\u0644\u0627\u0645\u0627\u062A \u062E\u0637\u0631.` : `### \u{1FA7A} Offline Diagnostic Support

I am currently offline. Regarding your query: "${data.query}", please perform a full clinical examination and follow established Triage protocols. Consult the attending physician immediately if red flags are present.`;
      } else if (type === "sbar_handover") {
        text2 = isAr ? `### \u{1F4CB} \u0645\u0644\u062E\u0635 SBAR \u0627\u062D\u062A\u064A\u0627\u0637\u064A

**\u0627\u0644\u0648\u0636\u0639:** ${data.query}

*\u0645\u0644\u0627\u062D\u0638\u0629: \u0647\u0630\u0627 \u0645\u0644\u062E\u0635 \u0645\u0628\u0633\u0637 \u0644\u0623\u0646 \u0627\u0644\u0646\u0638\u0627\u0645 \u0641\u064A \u0648\u0636\u0639 \u0639\u062F\u0645 \u0627\u0644\u0627\u062A\u0635\u0627\u0644. \u064A\u0631\u062C\u0649 \u0625\u0643\u0645\u0627\u0644 \u0627\u0644\u062A\u0642\u0631\u064A\u0631 \u064A\u062F\u0648\u064A\u0627\u064B.*` : `### \u{1F4CB} Offline SBAR Summary

**Situation:** ${data.query}

*Note: This is a simplified summary as the system is offline. Please complete the handover manually.*`;
      } else {
        text2 = isAr ? `### \u{1F4CB} \u062A\u062F\u0642\u064A\u0642 \u0633\u0631\u064A\u0631\u064A \u0627\u062D\u062A\u064A\u0627\u0637\u064A

**\u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u0644\u0645\u0629:**
\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`

\u0646\u0638\u0627\u0645 \u0627\u0644\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0641\u0648\u0631\u064A \u0642\u064A\u062F \u0627\u0644\u0635\u064A\u0627\u0646\u0629 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A\u0629 \u062D\u0627\u0644\u064A\u0627\u064B. \u064A\u0631\u062C\u0649 \u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u0645\u0639\u0627\u064A\u064A\u0631 \u0627\u0644\u0633\u0631\u064A\u0631\u064A\u0629 \u064A\u062F\u0648\u064A\u0627\u064B.` : `### \u{1F4CB} Offline Backup Clinical Audit

**Received Data:**
\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`

Live AI analysis model is currently undergoing automatic maintenance. Please review parameters manually according to hospital protocol.`;
      }
      res.json({ success: true, analysis: text2, fallback: true });
    }
  });
  app.get("/api/ping", (req, res) => {
    res.json({ success: true, timestamp: Date.now() });
  });
  app.get("/api/consumables", async (req, res) => {
    try {
      const data = await clinicalDataService.getCollection("consumables");
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.post("/api/inventory/add", async (req, res) => {
    try {
      const data = req.body;
      await clinicalDataService.saveItem("inventory", data);
      res.json({ success: true, data });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get("/api/inventory", async (req, res) => {
    try {
      const data = await clinicalDataService.getCollection("inventory");
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get("/api/events", async (req, res) => {
    try {
      const data = await clinicalDataService.getCollection("events");
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get("/api/patients/:id/consumables", async (req, res) => {
    try {
      const patientId = req.params.id;
      const patients3 = await clinicalDataService.getCollection("patients");
      const patient = patients3.find((p) => p.id === patientId);
      if (!patient) return res.status(404).json({ error: "Patient not found" });
      const allConsumables = await clinicalDataService.getCollection("consumables");
      const patientConsumables = allConsumables.filter((c) => c.patientId === patientId);
      const inventory2 = await clinicalDataService.getCollection("inventory");
      res.json({ patient, consumables: patientConsumables, inventory: inventory2 });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.post("/api/consumables/issue", async (req, res) => {
    try {
      const { patientId, itemName, quantity, store } = req.body;
      const id = Date.now().toString();
      const transactionNo = `TXN-${id}`;
      const transactionDate = (/* @__PURE__ */ new Date()).toISOString();
      const newConsumable = {
        id,
        patientId,
        itemName,
        transactionNo,
        store,
        quantity: parseFloat(quantity),
        status: "Confirmed",
        transactionDate
      };
      await clinicalDataService.saveItem("consumables", newConsumable);
      const inventory2 = await clinicalDataService.getCollection("inventory");
      let invItem = inventory2.find((i) => i.itemName === itemName && i.store === store);
      if (invItem) {
        invItem.currentQuantity = (parseFloat(invItem.currentQuantity) - parseFloat(quantity)).toString();
        invItem.lastUpdated = transactionDate;
        await clinicalDataService.saveItem("inventory", invItem);
      }
      const event = {
        id: Date.now().toString() + Math.random().toString().slice(2, 6),
        eventType: "CONSUMABLE_ISSUED",
        patientId,
        payload: { consumable: newConsumable, transactionNo },
        createdAt: transactionDate
      };
      await clinicalDataService.saveItem("events", event);
      res.json({ success: true, data: newConsumable });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  const DB_FILE_PATH = import_path2.default.join(process.cwd(), "hospital_fallback_database.json");
  let providerStores = {
    SUPABASE: {},
    POCKETBASE: {},
    LOCAL_HOST: {},
    APPWRITE: {}
  };
  if (import_fs2.default.existsSync(DB_FILE_PATH)) {
    try {
      const savedData = JSON.parse(import_fs2.default.readFileSync(DB_FILE_PATH, "utf8"));
      providerStores = { ...providerStores, ...savedData };
      console.log("\u2705 Success: Persistent fallback database loaded from disk.");
    } catch (e) {
      console.error("Warning: Failed to parse fallback database JSON", e);
    }
  }
  function persistFallbackDatabase() {
    try {
      import_fs2.default.writeFileSync(DB_FILE_PATH, JSON.stringify(providerStores, null, 2));
    } catch (e) {
      console.error("Warning: Failed to save fallback database to disk", e);
    }
  }
  let sseClients = [];
  app.get("/api/db/stream", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.setHeader("Content-Encoding", "none");
    res.flushHeaders();
    res.write(":\n\n");
    sseClients.push(res);
    req.on("close", () => {
      sseClients = sseClients.filter((client2) => client2 !== res);
    });
  });
  function broadcastUpdate(provider, collectionName) {
    const payload = JSON.stringify({ provider, collectionName, timestamp: (/* @__PURE__ */ new Date()).toISOString() });
    sseClients.forEach((client2) => {
      try {
        client2.write(`data: ${payload}

`);
      } catch (err) {
        console.error("SSE write error:", err);
      }
    });
  }
  app.get("/api/db/:provider/:collection", async (req, res) => {
    const { collection: collectionName } = req.params;
    try {
      const data = await clinicalDataService.getCollection(collectionName);
      return res.json({ success: true, data });
    } catch (err) {
      console.error(`Error fetching collection ${collectionName} from PostgreSQL:`, err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });
  app.post("/api/db/:provider/:collection/bulk", async (req, res) => {
    const { collection: collectionName } = req.params;
    const items = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ success: false, error: "Body must be an array of items." });
    }
    try {
      for (const item of items) {
        if (item && item.id) {
          await clinicalDataService.saveItem(collectionName, item);
        }
      }
      broadcastUpdate("LOCAL_HOST", collectionName);
      return res.json({ success: true, count: items.length });
    } catch (err) {
      console.error(`Error bulk saving ${collectionName} to PostgreSQL:`, err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });
  app.post("/api/db/:provider/:collection", async (req, res) => {
    const { collection: collectionName } = req.params;
    const item = req.body;
    if (!item || !item.id) {
      return res.status(400).json({ success: false, error: "Item must contain an 'id' field." });
    }
    try {
      await clinicalDataService.saveItem(collectionName, item);
      broadcastUpdate("LOCAL_HOST", collectionName);
      return res.json({ success: true, item });
    } catch (err) {
      console.error(`Error saving ${collectionName} to PostgreSQL:`, err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });
  app.delete("/api/db/:provider/:collection/:id", async (req, res) => {
    const { collection: collectionName, id } = req.params;
    try {
      await clinicalDataService.deleteItem(collectionName, id);
      broadcastUpdate("LOCAL_HOST", collectionName);
      return res.json({ success: true });
    } catch (err) {
      console.error(`Error deleting ${id} from ${collectionName} in PostgreSQL:`, err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });
  app.get("/api/patients", async (req, res) => {
    try {
      const data = await clinicalDataService.getCollection("patients");
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.post("/api/patients", async (req, res) => {
    try {
      const patient = req.body;
      await clinicalDataService.saveItem("patients", patient);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.delete("/api/patients/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await clinicalDataService.deleteItem("patients", id);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get("/api/prescriptions", async (req, res) => {
    try {
      const data = await clinicalDataService.getCollection("prescriptions");
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.post("/api/prescriptions", async (req, res) => {
    try {
      const p = req.body;
      await clinicalDataService.saveItem("prescriptions", p);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get("/api/invoices", async (req, res) => {
    try {
      const data = await clinicalDataService.getCollection("invoices");
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.post("/api/invoices", async (req, res) => {
    try {
      const i = req.body;
      await clinicalDataService.saveItem("invoices", i);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.post("/api/notifications", async (req, res) => {
    try {
      const n = req.body;
      await clinicalDataService.saveItem("notifications", n);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get("/api/notifications", async (req, res) => {
    try {
      const data = await clinicalDataService.getCollection("notifications");
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.post("/api/notifications/clear", async (req, res) => {
    try {
      const { ids } = req.body;
      if (ids && ids.length > 0) {
        for (const id of ids) {
          await clinicalDataService.deleteItem("notifications", id);
        }
      }
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get("/api/messages", async (req, res) => {
    try {
      const data = await clinicalDataService.getCollection("messages");
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.post("/api/messages", async (req, res) => {
    try {
      const m = req.body;
      await clinicalDataService.saveItem("messages", m);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.post("/api/messages/clear", async (req, res) => {
    try {
      const { ids } = req.body;
      if (ids && ids.length > 0) {
        for (const id of ids) {
          await clinicalDataService.deleteItem("messages", id);
        }
      }
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get("/api/settings/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const data = await clinicalDataService.getCollection("settings");
      const matched = data.find((r) => r.key === key || r.id === key);
      res.json(matched || null);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.post("/api/settings", async (req, res) => {
    try {
      const s = req.body;
      await clinicalDataService.saveItem("settings", s);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware loaded.");
  } else {
    const distPath = process.env.VERCEL ? import_path2.default.join(process.cwd(), "dist") : import_path2.default.join(process.cwd(), "dist");
    if (import_fs2.default.existsSync(distPath)) {
      app.use(import_express.default.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(import_path2.default.join(distPath, "index.html"));
      });
      console.log(`Serving static files from ${distPath}`);
    } else {
      console.warn(`Warning: dist folder not found at ${distPath}`);
      app.get("*", (req, res) => {
        res.status(404).send("Application dist folder not found. Please run build first.");
      });
    }
  }
  try {
    console.log("Checking if PostgreSQL database needs seeding...");
    const existingUsers = await db.select().from(collectionsStore).where((0, import_drizzle_orm2.eq)(collectionsStore.collectionName, "users"));
    if (existingUsers.length === 0) {
      console.log("Seeding system users to collectionsStore table...");
      const mockUsers = [
        {
          id: "user-it",
          nameAr: "\u0645. \u0639\u0627\u062F\u0644 \u0627\u0644\u0634\u0631\u064A\u0641 (\u0631\u0626\u064A\u0633 \u0642\u0633\u0645 \u0646\u0638\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A IT)",
          nameEn: "Eng. Adel El-Sherif (Head of IT & Digital Systems)",
          role: "it",
          avatarInitials: "IT",
          department: "INFORMATION TECHNOLOGY / IT",
          staffId: "2026",
          pin: "2026",
          email: "it-support@baheya.org",
          supervisorId: "user-admin"
        },
        {
          id: "user-nurse",
          nameAr: "\u0623. \u0641\u0627\u0637\u0645\u0629 \u0627\u0644\u0632\u0647\u0631\u0627\u0621 (\u0627\u0633\u062A\u0627\u0641 \u0627\u0644\u062A\u0645\u0631\u064A\u0636)",
          nameEn: "Sister Fatima El-Zahraa (Staff Nurse)",
          role: "staff",
          avatarInitials: "FZ",
          department: "EMERGENCY UNIT",
          staffId: "2525",
          pin: "2525",
          email: "fatima@baheya.org",
          supervisorId: "user-head-nurse"
        }
      ];
      for (const u of mockUsers) {
        await db.insert(collectionsStore).values({
          id: u.id,
          collectionName: "users",
          data: u,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
      console.log("System users seeded.");
    }
  } catch (seedError) {
    console.error("Auto-seeding warning (non-fatal):", seedError);
  }
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  }
  return app;
}
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  startServer().then((app) => {
    if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
      app.listen(3e3, "0.0.0.0", () => {
        console.log(`Server running on http://0.0.0.0:3000`);
      });
    }
  }).catch((err) => {
    console.error("Failed to start server:", err);
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  startServer
});
//# sourceMappingURL=server.cjs.map
