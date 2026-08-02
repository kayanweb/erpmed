import { 
  Patient, 
  PatientVisitWorkflow, 
  WorkflowStage, 
  HospitalTask, 
  PatientActivity,
  TaskStatus 
} from "../types";
import { createNotification } from "./notificationService";
import { logAudit } from "./auditService";
import { subscribeToClinicalData, saveDataPermanently, fetchDocumentById } from "./realTimeService";

const WORKFLOW_COLLECTION = "hospital_workflow_instances";
const PATIENT_COLLECTION = "hospital_his_patients";
const TASK_COLLECTION = "hospital_tasks";
const ACTIVITY_COLLECTION = "hospital_patient_activity";

/**
 * Logs a patient activity event
 */
export async function logPatientActivity(
  patientId: string, 
  workflowId: string, 
  type: string, 
  messageAr: string, 
  messageEn: string, 
  staffId: string, 
  staffName: string
) {
  const activity: PatientActivity = {
    id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    patientId,
    workflowId,
    type,
    messageAr,
    messageEn,
    timestamp: new Date().toISOString(),
    staffId,
    staffName
  };
  await saveDataPermanently(ACTIVITY_COLLECTION, activity);
}

/**
 * Creates a new task in the system
 */
export async function createHospitalTask(task: Omit<HospitalTask, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const newTask: HospitalTask = {
    ...task,
    id: taskId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  await saveDataPermanently(TASK_COLLECTION, newTask);
  return taskId;
}

/**
 * Updates a task status
 */
export async function updateTaskStatus(taskId: string, status: TaskStatus, staffId: string): Promise<void> {
  await saveDataPermanently(TASK_COLLECTION, {
    id: taskId,
    status,
    updatedAt: new Date().toISOString(),
    completedAt: (status === "completed" || status === "cancelled" || status === "rejected") ? new Date().toISOString() : null,
    assignedToUserId: staffId // Auto-assign to the person who takes action
  } as any);
}

/**
 * Starts a new clinical visit workflow for a patient
 */
export async function startPatientVisit(patient: Patient, staffId: string, staffName: string): Promise<string> {
  const workflowId = `WF-${Date.now()}`;
  const now = new Date().toISOString();

  const newWorkflow: PatientVisitWorkflow = {
    id: workflowId,
    patientId: patient.id,
    patientMRN: patient.mrn,
    startTime: now,
    currentStage: "registration",
    status: "active",
    history: [
      {
        stage: "registration",
        startTime: now,
        completedByStaffId: staffId
      }
    ]
  };

  await saveDataPermanently(WORKFLOW_COLLECTION, newWorkflow);

  // Update patient's current active workflow
  await saveDataPermanently(PATIENT_COLLECTION, {
    id: patient.id,
    currentWorkflowStage: "registration",
    workflowId: workflowId
  } as any);

  // Log activity
  await logPatientActivity(
    patient.id, 
    workflowId, 
    "REGISTRATION", 
    "تم تسجيل المريض وبدء الزيارة", 
    "Patient registered and visit started", 
    staffId, 
    staffName
  );

  return workflowId;
}

/**
 * Transitions a patient to the next stage in the workflow
 */
export async function transitionStage(
  workflowId: string, 
  nextStage: WorkflowStage, 
  staffId: string,
  staffName: string,
  staffRole: string = "staff"
): Promise<void> {
  const workflow = await fetchDocumentById<PatientVisitWorkflow>(WORKFLOW_COLLECTION, workflowId);
  
  if (!workflow) throw new Error("Workflow not found");
  
  const oldStage = workflow.currentStage;
  const now = new Date().toISOString();

  // Close previous stage in history
  const updatedHistory = [...workflow.history];
  if (updatedHistory.length > 0) {
    updatedHistory[updatedHistory.length - 1].endTime = now;
  }

  // Add new stage
  updatedHistory.push({
    stage: nextStage,
    startTime: now,
    completedByStaffId: staffId
  });

  await saveDataPermanently(WORKFLOW_COLLECTION, {
    ...workflow,
    currentStage: nextStage,
    history: updatedHistory
  });

  // Also update patient record for quick lookup
  await saveDataPermanently(PATIENT_COLLECTION, {
    id: workflow.patientId,
    currentWorkflowStage: nextStage
  } as any);

  // Log activity
  await logPatientActivity(
    workflow.patientId, 
    workflowId, 
    "TRANSITION", 
    `انتقال المريض إلى مرحلة: ${nextStage}`, 
    `Patient transitioned to stage: ${nextStage}`, 
    staffId, 
    staffName
  );

  // Log Audit
  await logAudit({
    userId: staffId,
    userName: staffName,
    userRole: staffRole,
    action: "TRANSITION_STAGE",
    module: "WORKFLOW",
    detailsAr: `تغيير حالة سير العمل للمريض من ${oldStage} إلى ${nextStage}`,
    detailsEn: `Changed patient workflow stage from ${oldStage} to ${nextStage}`,
    oldValue: oldStage,
    newValue: nextStage
  });

  // Automated transitions logic (trigger follow-up actions)
  handleAutomatedTriggers(nextStage, workflow, staffId, staffName);
}

/**
 * Internal logic for automated triggers based on workflow state
 */
async function handleAutomatedTriggers(stage: WorkflowStage, workflow: PatientVisitWorkflow, staffId: string, staffName: string) {
  switch (stage) {
    case "triage":
      // Create a task for the doctor
      await createHospitalTask({
        workflowId: workflow.id,
        patientId: workflow.patientId,
        patientMRN: workflow.patientMRN,
        assignedToRole: "doctor",
        titleAr: "استشارة طبيب",
        titleEn: "Doctor Consultation",
        status: "pending",
        priority: "routine",
        type: "clinical"
      });

      // Notify Nurses that a patient is in Triage
      await createNotification({
        userId: "all",
        role: "nurse",
        titleAr: "مريض جديد في الفرز",
        titleEn: "New Patient in Triage",
        messageAr: `المريض ${workflow.patientMRN} جاهز للفرز السريري.`,
        messageEn: `Patient ${workflow.patientMRN} is ready for clinical triage.`,
        type: "info"
      });
      break;
      
    case "diagnosis":
      // Example: Automatically trigger billing preparation when diagnosis is confirmed
      console.log("Automated Trigger: Preparing billing for", workflow.patientMRN);
      
      // Notify Doctor
      await createNotification({
        userId: "all",
        role: "doctor",
        titleAr: "جاهز للتشخيص",
        titleEn: "Ready for Diagnosis",
        messageAr: `المريض ${workflow.patientMRN} أكمل الفرز وجاهز للتشخيص.`,
        messageEn: `Patient ${workflow.patientMRN} completed triage and is ready for diagnosis.`,
        type: "success"
      });
      break;

    case "orders":
       // Orders stage usually involves multiple tasks (Lab, Rad, etc.)
       break;

    case "discharge":
      // Mark workflow as completed
      await saveDataPermanently(WORKFLOW_COLLECTION, {
        id: workflow.id,
        status: "completed",
        endTime: new Date().toISOString()
      } as any);

      // Notify Reception/Billing
      await createNotification({
        userId: "all",
        role: "admin",
        titleAr: "خروج مريض",
        titleEn: "Patient Discharge",
        messageAr: `المريض ${workflow.patientMRN} جاهز لإجراءات الخروج.`,
        messageEn: `Patient ${workflow.patientMRN} is ready for discharge procedures.`,
        type: "info"
      });
      break;
  }
}

/**
 * Sync active patient workflows
 */
export function syncActiveWorkflows(onData: (workflows: PatientVisitWorkflow[]) => void) {
  return subscribeToClinicalData<PatientVisitWorkflow>(
    WORKFLOW_COLLECTION,
    (workflows) => {
      const active = workflows.filter(w => w.status === "active");
      onData(active);
    },
    (err) => console.error("Active workflows sync error:", err)
  );
}

/**
 * Sync all patients
 */
export function syncPatients(onData: (patients: Patient[]) => void) {
  return subscribeToClinicalData<Patient>(
    PATIENT_COLLECTION,
    (patients) => {
      onData(patients);
    },
    (err) => console.error("Patients sync error:", err)
  );
}

/**
 * Sync tasks for a specific role or user
 */
export function syncTasks(role: string, userId: string, onData: (tasks: HospitalTask[]) => void) {
  return subscribeToClinicalData<HospitalTask>(
    TASK_COLLECTION,
    (tasks) => {
      const active = tasks.filter(t => t.status === "pending" || t.status === "in_progress");
      const sorted = active.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const filtered = sorted.filter(t => t.assignedToRole === role || t.assignedToUserId === userId);
      onData(filtered);
    },
    (err) => console.error("Tasks sync error:", err)
  );
}

/**
 * Sync patient timeline
 */
export function syncPatientTimeline(workflowId: string, onData: (activities: PatientActivity[]) => void) {
  return subscribeToClinicalData<PatientActivity>(
    ACTIVITY_COLLECTION,
    (activities) => {
      const filtered = activities.filter(a => a.workflowId === workflowId);
      const sorted = filtered.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
      onData(sorted);
    },
    (err) => console.error("Timeline sync error:", err)
  );
}
