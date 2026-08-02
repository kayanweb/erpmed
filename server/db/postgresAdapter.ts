import { db } from "./index";
import { 
  patients, 
  prescriptions, 
  invoices, 
  staff, 
  logs, 
  dutyTasks, 
  notifications, 
  messages, 
  settings, 
  collectionsStore,
  visits,
  insuranceProviders,
  billingCharges,
  labTestsStructured,
  radiologyReportsStructured,
  auditLogs
} from "./schema";
import { eq, and } from "drizzle-orm";
import { IDatabaseAdapter } from "./adapter";
import fs from "fs";
import path from "path";

const LOCAL_DB_PATH = process.env.VERCEL 
  ? path.join("/tmp", "local_database.json")
  : path.join(process.cwd(), "local_database.json");

// Dynamic file-backed local storage helpers
function readLocalDb(): Record<string, any[]> {
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const content = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
      return JSON.parse(content) || {};
    }
  } catch (err) {
    console.error("⚠️ Error reading local JSON db fallback:", err);
  }
  return {};
}

function writeLocalDb(dbData: Record<string, any[]>) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(dbData, null, 2), "utf-8");
  } catch (err) {
    console.error("⚠️ Error writing local JSON db fallback:", err);
  }
}

function getLocalCollection(collectionName: string): any[] {
  const dbData = readLocalDb();
  return dbData[collectionName] || [];
}

function saveLocalItem(collectionName: string, item: any) {
  const dbData = readLocalDb();
  if (!dbData[collectionName]) {
    dbData[collectionName] = [];
  }
  const collection = dbData[collectionName];
  
  // Find index depending on if it is settings (key-based) or ordinary (id-based)
  const idx = collection.findIndex((x: any) => {
    if (collectionName === "settings") {
      return (x.key === item.key || x.id === item.id || x.key === item.id || x.id === item.key);
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

function deleteLocalItem(collectionName: string, id: string) {
  const dbData = readLocalDb();
  if (dbData[collectionName]) {
    dbData[collectionName] = dbData[collectionName].filter((x: any) => {
      if (collectionName === "settings") {
        return x.key !== id && x.id !== id;
      }
      return x.id !== id;
    });
    writeLocalDb(dbData);
  }
}

// Check if PostgreSQL is available and configured
function usePostgres(): boolean {
  const url = process.env.DATABASE_URL;
  return !!url && (url.startsWith("postgres://") || url.startsWith("postgresql://"));
}

export class PostgresAdapter implements IDatabaseAdapter {
  async fetchCollection(collectionName: string): Promise<any[]> {
    if (!usePostgres()) {
      console.error("❌ Database Connection Error: DATABASE_URL is not set. Falling back to local storage temporarily to prevent system crash.");
      return getLocalCollection(collectionName);
    }

    try {
      if (collectionName === "patients") {
        const rows = await db.select().from(patients);
        return rows.map(r => ({ ...((r.clinicalData as any) || {}), ...r }));
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
        return rows.map(r => ({ id: r.key, key: r.key, ...((r.value as any) || {}) }));
      } else {
        const rows = await db.select().from(collectionsStore).where(eq(collectionsStore.collectionName, collectionName));
        return rows.map(r => ({ ...((r.data as any) || {}), id: r.id }));
      }
    } catch (err: any) {
      console.error(`❌ PostgreSQL fetch error for '${collectionName}':`, err.message);
      // If DB fails, try local fallback for read operations to keep UI alive
      return getLocalCollection(collectionName);
    }
  }

  async saveItem(collectionName: string, item: any): Promise<boolean> {
    if (!usePostgres()) {
      console.warn("⚠️ Warning: Saving to local storage fallback (DATABASE_URL missing)");
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
          clinicalData: item,
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
          date: item.date || "",
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
          date: item.date || "",
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
          department: item.department || "",
        };
        await db.insert(staff).values(sVal).onConflictDoUpdate({
          target: staff.id,
          set: sVal
        });
      } else if (collectionName === "logs" || collectionName === "systemLogs") {
        const lVal = {
          id: item.id,
          message: item.message || "",
          timestamp: item.timestamp || new Date().toISOString(),
        };
        await db.insert(logs).values(lVal).onConflictDoUpdate({
          target: logs.id,
          set: lVal
        });
      } else if (collectionName === "dutyTasks") {
        const tVal = {
          id: item.id,
          title: item.title || "",
          status: item.status || "",
        };
        await db.insert(dutyTasks).values(tVal).onConflictDoUpdate({
          target: dutyTasks.id,
          set: tVal
        });
      } else if (collectionName === "notifications") {
        const nVal = {
          id: item.id,
          message: item.message || "",
          timestamp: item.timestamp || new Date().toISOString(),
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
          timestamp: item.timestamp || new Date().toISOString(),
        };
        await db.insert(messages).values(mVal).onConflictDoUpdate({
          target: messages.id,
          set: mVal
        });
      } else if (collectionName === "his_audit_logs" || collectionName === "auditLogs") {
        const aVal = {
          id: item.id,
          action: item.action,
          entityType: item.entityType || item.entity_type || 'GENERAL',
          entityId: item.entityId || item.entity_id || 'N/A',
          userId: item.userId || item.user_id,
          createdAt: item.timestamp || item.created_at || new Date().toISOString(),
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
          status: item.status || 'active',
          currentStage: item.currentStage || item.current_stage,
          startTime: item.startTime || item.start_time || new Date().toISOString(),
          endTime: item.endTime || item.end_time,
          totalEstimatedBill: String(item.totalEstimatedBill || item.total_estimated_bill || "0"),
          doctorId: item.doctorId || item.doctor_id,
          deptId: item.deptId || item.dept_id,
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
          status: item.status || 'active',
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
          status: item.status || 'pending',
          orderId: item.orderId || item.order_id,
          staffId: item.staffId || item.staff_id,
          createdAt: item.createdAt || item.created_at || new Date().toISOString(),
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
          createdAt: item.createdAt || item.created_at || new Date().toISOString(),
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
          createdAt: item.createdAt || item.created_at || new Date().toISOString(),
        };
        await db.insert(radiologyReportsStructured).values(rVal).onConflictDoUpdate({
          target: radiologyReportsStructured.id,
          set: rVal
        });
      } else if (collectionName === "settings") {
        const setKey = item.key || item.id;
        const sVal = {
          key: setKey,
          value: item,
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
          updatedAt: new Date().toISOString(),
        };
        await db.insert(collectionsStore).values({
          ...cVal,
          createdAt: new Date().toISOString(),
        }).onConflictDoUpdate({
          target: collectionsStore.id,
          set: cVal
        });
      }
      return true;
    } catch (err: any) {
      console.error(`❌ PostgreSQL save error for '${collectionName}':`, err.message);
      saveLocalItem(collectionName, item);
      return true;
    }
  }

  async deleteItem(collectionName: string, id: string): Promise<boolean> {
    if (!usePostgres()) {
      deleteLocalItem(collectionName, id);
      return true;
    }

    try {
      if (collectionName === "patients") {
        await db.delete(patients).where(eq(patients.id, id));
      } else if (collectionName === "prescriptions") {
        await db.delete(prescriptions).where(eq(prescriptions.id, id));
      } else if (collectionName === "invoices") {
        await db.delete(invoices).where(eq(invoices.id, id));
      } else if (collectionName === "staff") {
        await db.delete(staff).where(eq(staff.id, id));
      } else if (collectionName === "logs" || collectionName === "systemLogs") {
        await db.delete(logs).where(eq(logs.id, id));
      } else if (collectionName === "dutyTasks") {
        await db.delete(dutyTasks).where(eq(dutyTasks.id, id));
      } else if (collectionName === "notifications") {
        await db.delete(notifications).where(eq(notifications.id, id));
      } else if (collectionName === "messages") {
        await db.delete(messages).where(eq(messages.id, id));
      } else if (collectionName === "his_audit_logs" || collectionName === "auditLogs") {
        await db.delete(auditLogs).where(eq(auditLogs.id, id));
      } else if (collectionName === "his_visits" || collectionName === "visits") {
        await db.delete(visits).where(eq(visits.id, id));
      } else if (collectionName === "his_insurance_providers" || collectionName === "insuranceProviders") {
        await db.delete(insuranceProviders).where(eq(insuranceProviders.id, id));
      } else if (collectionName === "his_charges" || collectionName === "billingCharges") {
        await db.delete(billingCharges).where(eq(billingCharges.id, id));
      } else if (collectionName === "his_lab_results" || collectionName === "labResultsStructured") {
        await db.delete(labTestsStructured).where(eq(labTestsStructured.id, id));
      } else if (collectionName === "his_radiology_reports" || collectionName === "radiologyReportsStructured") {
        await db.delete(radiologyReportsStructured).where(eq(radiologyReportsStructured.id, id));
      } else if (collectionName === "settings") {
        await db.delete(settings).where(eq(settings.key, id));
      } else {
        await db.delete(collectionsStore).where(
          and(
            eq(collectionsStore.id, id),
            eq(collectionsStore.collectionName, collectionName)
          )
        );
      }
      return true;
    } catch (err: any) {
      console.error(`❌ PostgreSQL delete error for '${collectionName}':`, err.message);
      deleteLocalItem(collectionName, id);
      return true;
    }
  }
}
