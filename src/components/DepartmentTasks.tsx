import React, { useState, useEffect } from "react";
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  Users, 
  LogOut, 
  Plus, 
  Search, 
  UserCheck, 
  HeartPulse, 
  ArrowLeftRight, 
  Sparkles,
  CheckCircle,
  FileText,
  AlertCircle
} from "lucide-react";
import { useHIS } from "../context/HISContext";
import { Patient } from "../types";
import { GlobalEntityLink } from "./GlobalEntityLink";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
  departmentId: string;
  departmentName: string;
}

interface CustomTask {
  id: string;
  titleEn: string;
  titleAr: string;
  patientName: string;
  patientId: string;
  time: string;
  status: "pending" | "completed";
  category: "meds" | "vitals" | "nursing" | "discharge";
}

export default function DepartmentTasks({ language, departmentId, departmentName, hideHeader = true }: Props & { hideHeader?: boolean }) {
  const isAr = language === "ar";
  const { patients: contextPatients, updatePatient, cpoeOrders, setCpoeOrders } = useHIS();
  const [activeTab, setActiveTab] = useState<"active_patients" | "tasks" | "discharge">("active_patients");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Real or default fallback active department patients
  const [departmentPatients, setDepartmentPatients] = useState<Patient[]>([]);
  const [customTasks, setCustomTasks] = useState<CustomTask[]>([]);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTitleAr, setNewTaskTitleAr] = useState("");
  const [newTaskTitleEn, setNewTaskTitleEn] = useState("");
  const [newTaskPatientId, setNewTaskPatientId] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState<CustomTask["category"]>("meds");

  // Load and map patients
  useEffect(() => {
    // Filter patients assigned to the active department
    // In our system, we map patients by departmentId or distribute if context is fresh
    let filtered = contextPatients.filter(p => 
      p.departmentId === departmentId || 
      p.department === departmentId || 
      p.department === departmentName ||
      (departmentId === "dept-im" && p.status === "ward") ||
      (departmentId === "er" && p.status === "triage") ||
      (departmentId === "icu" && p.status === "doctor")
    );

    // If context is empty, fall back to high-quality department-specific clinical fallbacks
    if (filtered.length === 0) {
      const defaultFallbacks: Record<string, Patient[]> = {
        "er": [
          { id: "P-ER-01", mrn: "MRN-2026-901", nameEn: "Youssef Ahmed El-Demerdash", nameAr: "يوسف أحمد الدمرداش", age: 48, gender: "male", phone: "0102938472", status: "triage", insurance: "Bupa", admissionDiagnosis: "Acute Appendicitis", roomNumber: "ER Bay 1", bedNumber: "ER-01", isReadyForDischarge: false, departmentId: "er" },
          { id: "P-ER-02", mrn: "MRN-2026-902", nameEn: "Samer Mahmoud Fawzy", nameAr: "سامر محمود فوزي", age: 52, gender: "male", phone: "0123984712", status: "triage", insurance: "Cash", admissionDiagnosis: "Chest Pain - Suspected MI", roomNumber: "Resuscitation Room", bedNumber: "Red-01", isReadyForDischarge: false, departmentId: "er" },
          { id: "P-ER-03", mrn: "MRN-2026-903", nameEn: "Laila Hany Kamel", nameAr: "ليلى هاني كامل", age: 29, gender: "female", phone: "0112938473", status: "triage", insurance: "Medgulf", admissionDiagnosis: "Severe Asthma Attack", roomNumber: "ER Observation", bedNumber: "Green-03", isReadyForDischarge: true, departmentId: "er" }
        ],
        "icu": [
          { id: "P-ICU-01", mrn: "MRN-2026-801", nameEn: "Kamal Abdel-Hady", nameAr: "كمال عبد الهادي", age: 67, gender: "male", phone: "0152938481", status: "doctor", insurance: "Tawuniya", admissionDiagnosis: "Septic Shock / Pneumonia", roomNumber: "ICU Isolation", bedNumber: "ICU-01", isReadyForDischarge: false, departmentId: "icu" },
          { id: "P-ICU-02", mrn: "MRN-2026-802", nameEn: "Zainab Ali Mansour", nameAr: "زينب علي منصور", age: 71, gender: "female", phone: "0101928374", status: "doctor", insurance: "Cash", admissionDiagnosis: "Post-CABG Recovery", roomNumber: "ICU Main Ward", bedNumber: "ICU-04", isReadyForDischarge: true, departmentId: "icu" }
        ],
        "dept-im": [
          { id: "P-IM-01", mrn: "MRN-2026-701", nameEn: "Mohamed El-Sayed", nameAr: "محمد السيد", age: 59, gender: "male", phone: "0122938474", status: "ward", insurance: "Bupa", admissionDiagnosis: "Diabetic Ketoacidosis (DKA)", roomNumber: "Room 304", bedNumber: "Bed A", isReadyForDischarge: false, departmentId: "dept-im" },
          { id: "P-IM-02", mrn: "MRN-2026-702", nameEn: "Fatma Nour-Eldin", nameAr: "فاطمة نور الدين", age: 34, gender: "female", phone: "0112938475", status: "ward", insurance: "Tawuniya", admissionDiagnosis: "Severe Pyelonephritis", roomNumber: "Room 306", bedNumber: "Bed B", isReadyForDischarge: true, departmentId: "dept-im" },
          { id: "P-IM-03", mrn: "MRN-2026-703", nameEn: "Abdel-Rahman Khaled", nameAr: "عبد الرحمن خالد", age: 63, gender: "male", phone: "0102938476", status: "ward", insurance: "Medgulf", admissionDiagnosis: "Exacerbation of COPD", roomNumber: "Room 304", bedNumber: "Bed B", isReadyForDischarge: false, departmentId: "dept-im" }
        ],
        "nicu": [
          { id: "P-NICU-01", mrn: "MRN-2026-601", nameEn: "Baby Boy Ahmed", nameAr: "مولود أحمد", age: 0, gender: "male", phone: "-", status: "nicu", insurance: "Cash", admissionDiagnosis: "Prematurity", roomNumber: "NICU Bay 1", bedNumber: "Incubator 1", isReadyForDischarge: false, departmentId: "nicu" },
          { id: "P-NICU-02", mrn: "MRN-2026-602", nameEn: "Baby Girl Sara", nameAr: "مولودة سارة", age: 0, gender: "female", phone: "-", status: "nicu", insurance: "Tawuniya", admissionDiagnosis: "Jaundice", roomNumber: "NICU Bay 1", bedNumber: "Incubator 2", isReadyForDischarge: true, departmentId: "nicu" }
        ],
        "pacu": [
          { id: "P-PACU-01", mrn: "MRN-2026-501", nameEn: "Hassan Ali", nameAr: "حسن علي", age: 45, gender: "male", phone: "-", status: "pacu", insurance: "Bupa", admissionDiagnosis: "Post-op Recovery", roomNumber: "PACU Ward", bedNumber: "PACU-01", isReadyForDischarge: false, departmentId: "pacu" }
        ]
      };

      filtered = defaultFallbacks[departmentId] || defaultFallbacks["dept-im"];
    }

    setDepartmentPatients(filtered);
  }, [contextPatients, departmentId, departmentName]);

  // Seed initial tasks
  useEffect(() => {
    if (customTasks.length === 0) {
      setCustomTasks([
        { id: "task-1", titleEn: "Check blood pressure & glucose levels", titleAr: "فحص ضغط الدم ومستويات السكر", patientName: isAr ? "محمد السيد" : "Mohamed El-Sayed", patientId: "P-IM-01", time: "10:00 AM", status: "pending", category: "vitals" },
        { id: "task-2", titleEn: "Administer prescribed antibiotic IV", titleAr: "إعطاء المضاد الحيوي الموصوف بالوريد", patientName: isAr ? "يوسف أحمد الدمرداش" : "Youssef Ahmed El-Demerdash", patientId: "P-ER-01", time: "11:30 AM", status: "pending", category: "meds" },
        { id: "task-3", titleEn: "Collect post-op laboratory samples", titleAr: "سحب عينات التحاليل الطبية لـ بعد العملية", patientName: isAr ? "فاطمة نور الدين" : "Fatma Nour-Eldin", patientId: "P-IM-02", time: "09:00 AM", status: "completed", category: "nursing" },
        { id: "task-4", titleEn: "Complete Discharge clearance checklist", titleAr: "إكمال قائمة مراجعة تسوية الخروج", patientName: isAr ? "ليلى هاني كامل" : "Laila Hany Kamel", patientId: "P-ER-03", time: "01:00 PM", status: "pending", category: "discharge" }
      ]);
    }
  }, [isAr]);

  const handleToggleTaskStatus = (id: string, isCpoe: boolean = false) => {
    if (isCpoe) {
      const targetOrder = cpoeOrders?.find(o => o.id === id);
      if (targetOrder && setCpoeOrders) {
        const nextStatus = (targetOrder.status === "Pending" || targetOrder.status === "pending") ? "Completed" : "Pending";
        setCpoeOrders(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus } : o));
      }
    } else {
      setCustomTasks(prev => prev.map(task => 
        task.id === id ? { ...task, status: task.status === "completed" ? "pending" : "completed" } : task
      ));
    }
    toast.success(isAr ? "تم تحديث حالة المهمة السريرية" : "Clinical task status updated");
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitleAr || !newTaskTitleEn) {
      toast.error(isAr ? "يرجى كتابة عنوان المهمة" : "Please enter task titles");
      return;
    }

    const patient = departmentPatients.find(p => p.id === newTaskPatientId);
    const patientNameStr = patient ? (isAr ? patient.nameAr : patient.nameEn) : (isAr ? "جميع مرضى القسم" : "All Patients");

    const newTask: CustomTask = {
      id: `task-${Date.now()}`,
      titleAr: newTaskTitleAr,
      titleEn: newTaskTitleEn,
      patientId: newTaskPatientId || "ALL",
      patientName: patientNameStr,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "pending",
      category: newTaskCategory
    };

    setCustomTasks(prev => [newTask, ...prev]);
    setShowAddTaskModal(false);
    setNewTaskTitleAr("");
    setNewTaskTitleEn("");
    setNewTaskPatientId("");
    toast.success(isAr ? "تمت إضافة مهمة سريرية جديدة بنجاح" : "New clinical task added successfully");
  };

  const handleMarkReadyForDischarge = (patientId: string, status: boolean) => {
    // 1. Update globally if patient is from the context
    updatePatient(patientId, { isReadyForDischarge: status });

    // 2. Update local state
    setDepartmentPatients(prev => prev.map(p => 
      p.id === patientId ? { ...p, isReadyForDischarge: status } : p
    ));

    toast.success(status 
      ? (isAr ? "تم إدراج المريض بقائمة المغادرة المقررة" : "Patient added to scheduled discharge list")
      : (isAr ? "تمت إزالة المريض من قائمة المغادرة" : "Patient removed from discharge list")
    );
  };

  const handleCompleteDischarge = (patientId: string) => {
    // 1. Update globally
    updatePatient(patientId, { status: "discharged", dischargedAt: new Date().toISOString() });

    // 2. Update local state
    setDepartmentPatients(prev => prev.filter(p => p.id !== patientId));

    toast.success(isAr ? "تم إنهاء خروج المريض بالكامل وتطهير السرير" : "Discharge completed, bed flagged for cleaning");
  };

  // Filters
  const searchLower = searchTerm?.toLowerCase();
  const activePatientsList = departmentPatients.filter(p => 
    !p.isReadyForDischarge && 
    (p.nameAr?.includes(searchTerm) || p.nameEn?.toLowerCase()?.includes(searchLower) || p.mrn?.includes(searchTerm))
  );

  const dischargePatientsList = departmentPatients.filter(p => 
    p.isReadyForDischarge || p.status === "discharged"
  );

  // Map CPOE orders into task format to combine them with custom tasks
  const mappedCpoeTasks: CustomTask[] = [];
  if (cpoeOrders) {
    const deptPatientIds = departmentPatients.map(p => p.id);
    const deptPatientMrns = departmentPatients.map(p => p.mrn);
    
    cpoeOrders.forEach((o: any) => {
      // Is this order for a patient in this department?
      if (deptPatientIds.includes(o.visitId) || deptPatientMrns.includes(o.mrn)) {
        // Only include actionable orders like Meds, Labs, Rads, Nursing
        if (o.orderType === "Medication" || o.orderType === "Lab" || o.orderType === "Radiology" || o.orderType === "Nursing") {
          mappedCpoeTasks.push({
            id: o.id,
            titleEn: `${o.orderType} Order: ${o.orderName || o.medication}`,
            titleAr: `${o.orderType} Order: ${o.orderName || o.medication}`, // Fallback
            patientName: o.patientName || "Unknown Patient",
            patientId: o.visitId,
            time: o.createdAt ? new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "New",
            status: (o.status === "Pending" || o.status === "pending") ? "pending" : "completed",
            category: o.orderType === "Medication" ? "meds" : "nursing",
            isCpoe: true // custom flag
          } as any); // Cast as any because we added isCpoe
        }
      }
    });
  }

  const allTasks = [...mappedCpoeTasks, ...customTasks];

  const activeTasksList = allTasks.filter(t => 
    t.titleAr?.includes(searchTerm) || t.titleEn?.toLowerCase()?.includes(searchLower) || t.patientName?.toLowerCase()?.includes(searchLower)
  );

  return (
    <div className="p-6 space-y-6" dir={isAr ? "rtl" : "ltr"}>
      {!hideHeader && (
        <>
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-lg border border-indigo-950/50 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-1 rounded-full font-bold border border-indigo-500/30">
              {isAr ? "لوحة مهام القسم" : "Department Board"}
            </span>
            <span className="flex items-center gap-1 text-emerald-400 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {isAr ? "متصل بالشبكة الطبية" : "Connected to HIS Grid"}
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight mt-2 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 sm:w-8 sm:h-8 text-indigo-400" />
            {departmentName}
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            {isAr 
              ? "إدارة الحالات النشطة بالقسم، متابعة الأنشطة التمريضية والطبية اليومية، وقائمة المرضى المقرر خروجهم وتصاريح المغادرة."
              : "Manage active cases, monitor clinical activities, and complete checklists for scheduled discharges."
            }
          </p>
        </div>

        <div className="flex gap-2 min-w-max">
          <button 
            onClick={() => setShowAddTaskModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            {isAr ? "إضافة مهمة سريرية" : "Add Clinical Task"}
          </button>
        </div>
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{isAr ? "المرضى الحاليين النشطين" : "Active Patients"}</p>
            <h3 className="text-3xl font-black text-slate-800 mt-1">{activePatientsList.length}</h3>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{isAr ? "المهام السريرية المعلقة" : "Pending Tasks"}</p>
            <h3 className="text-3xl font-black text-amber-600 mt-1">{customTasks.filter(t => t.status === "pending").length}</h3>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{isAr ? "المقرر لهم الخروج" : "Scheduled Discharge"}</p>
            <h3 className="text-3xl font-black text-emerald-600 mt-1">{dischargePatientsList.length}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
            <LogOut className="w-6 h-6" />
          </div>
        </div>
      </div>
      </>
      )}
      {/* Tabs and Filtering Control */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200/60 w-fit">
          <button
            onClick={() => setActiveTab("active_patients")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${
              activeTab === "active_patients"
                ? "bg-white text-indigo-700 shadow-sm border border-indigo-100"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-4 h-4" />
            {isAr ? "المرضى النشطين بالقسم" : "Active Patients"}
            <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold">
              {activePatientsList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${
              activeTab === "tasks"
                ? "bg-white text-indigo-700 shadow-sm border border-indigo-100"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            {isAr ? "المهام والعمليات الطبية" : "Clinical Tasks"}
            <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold">
              {activeTasksList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("discharge")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${
              activeTab === "discharge"
                ? "bg-white text-indigo-700 shadow-sm border border-indigo-100"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LogOut className="w-4 h-4" />
            {isAr ? "المقرر لهم الخروج" : "Discharge Registry"}
            <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold">
              {dischargePatientsList.length}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className={`absolute ${isAr ? "right-3" : "left-3"} top-2.5 h-4 w-4 text-slate-400`} />
          <input
            type="text"
            placeholder={isAr ? "بحث بالاسم أو الرقم الطبي..." : "Search by name or MRN..."}
            className={`w-full ${isAr ? "pr-9 pl-4" : "pl-9 pr-4"} py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-indigo-500 transition`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* MAIN VIEW CONTENT RENDERER */}
      <div className="animate-fade-in">
        
        {/* TAB 1: ACTIVE PATIENTS */}
        {activeTab === "active_patients" && (
          <div className="space-y-4">
            {activePatientsList.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-bold">{isAr ? "لا توجد حالات نشطة مطابقة حالياً" : "No matching active patients found"}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {activePatientsList.map((patient) => (
                  <div 
                    key={patient.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition flex flex-col justify-between"
                  >
                    <div>
                      {/* Bed & Room Banner */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
                          {patient.roomNumber || (isAr ? "جناح التنويم" : "Ward Ward")} • {patient.bedNumber || (isAr ? "سرير غير محدد" : "Unassigned Bed")}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono font-bold">
                          {patient.mrn}
                        </span>
                      </div>

                      {/* Name */}
                      <h3 className="font-bold text-slate-800 text-lg hover:text-indigo-600 transition">
                        <GlobalEntityLink entityId={patient.mrn} entityName={isAr ? patient.nameAr : patient.nameEn} entityType="patient" isAr={isAr}>
                          {isAr ? patient.nameAr : patient.nameEn}
                        </GlobalEntityLink>
                      </h3>

                      {/* Age & Gender */}
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {patient.age} {isAr ? "سنة" : "years"} • {isAr ? (patient.gender === "male" ? "ذكر" : "أنثى") : patient.gender}
                      </p>

                      {/* Diagnosis Box */}
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mt-4 text-xs">
                        <span className="font-bold text-slate-400 block mb-0.5">{isAr ? "التشخيص عند الدخول:" : "Admission Diagnosis:"}</span>
                        <span className="font-bold text-slate-700">{patient.admissionDiagnosis || (isAr ? "تحت التقييم الطبي" : "Under assessment")}</span>
                      </div>
                    </div>

                    {/* Actions Panel */}
                    <div className="border-t border-slate-100 mt-5 pt-4 flex gap-2">
                      <button 
                        onClick={() => window.dispatchEvent(new CustomEvent("openPatientChart", { detail: { patientId: patient.mrn, patientName: isAr ? patient.nameAr : patient.nameEn, initialTab: "summary" } }))}
                        className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2 rounded-lg text-xs border border-slate-200/60 transition"
                      >
                        {isAr ? "ملف المريض" : "Open Chart"}
                      </button>

                      <button 
                        onClick={() => handleMarkReadyForDischarge(patient.id, true)}
                        className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2 rounded-lg text-xs border border-indigo-100/60 transition flex items-center justify-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        {isAr ? "تحديد للخروج" : "Set Ready"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TASKS & ACTIVITIES */}
        {activeTab === "tasks" && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" dir={isAr ? "rtl" : "ltr"}>
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-sm font-bold text-slate-700">{isAr ? "المهمة والوصف" : "Task Description"}</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-700">{isAr ? "المريض المعني" : "Patient"}</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-700">{isAr ? "النوع" : "Category"}</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-700">{isAr ? "الوقت" : "Recorded Time"}</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-700">{isAr ? "الحالة" : "Status"}</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-700 w-24"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeTasksList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-bold">
                        {isAr ? "لا توجد مهام سريرية معلقة حالياً" : "No pending clinical tasks found"}
                      </td>
                    </tr>
                  ) : (
                    activeTasksList.map(task => (
                      <tr key={task.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4">
                          <p className={`font-bold ${task.status === "completed" ? "line-through text-slate-400" : "text-slate-800"}`}>
                            {isAr ? task.titleAr : task.titleEn}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                            {task.patientName}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            task.category === "meds" ? "bg-rose-50 text-rose-700 border border-rose-100" :
                            task.category === "vitals" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                            task.category === "discharge" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                            "bg-indigo-50 text-indigo-700 border border-indigo-100"
                          }`}>
                            {task.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                          {task.time}
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => handleToggleTaskStatus(task.id, (task as any).isCpoe)}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition ${
                              task.status === "completed" 
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                                : "bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100"
                            }`}
                          >
                            {task.status === "completed" ? (
                              <>
                                <CheckCircle className="w-3.5 h-3.5" />
                                {isAr ? "مكتملة" : "Completed"}
                              </>
                            ) : (
                              <>
                                <Clock className="w-3.5 h-3.5" />
                                {isAr ? "معلقة" : "Pending"}
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {task.status !== "completed" && (
                            <button 
                              onClick={() => handleToggleTaskStatus(task.id)}
                              className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-lg transition"
                            >
                              {isAr ? "إنجاز" : "Done"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: DISCHARGE REGISTRY */}
        {activeTab === "discharge" && (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-900 text-sm">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{isAr ? "التحقق الطبي والأمني قبل مغادرة المرضى" : "Pre-discharge Protocol Compliance"}</p>
                <p className="text-amber-800 text-xs mt-0.5">
                  {isAr 
                    ? "الرجاء التأكد من استكمال كافة الإجراءات المالية، وتسليم الوصفات الطبية، وطباعة ملخص الخروج قبل الضغط على المغادرة النهائية لتحديث السرير."
                    : "Please verify that all financial clearance, prescription handovers, and clinical summaries are finalized before confirming discharge."
                  }
                </p>
              </div>
            </div>

            {dischargePatientsList.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
                <LogOut className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-bold">{isAr ? "لا توجد حالات مغادرة أو مسجلة للخروج حالياً" : "No patients currently flagged for discharge"}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dischargePatientsList.map((patient) => (
                  <div 
                    key={patient.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-emerald-100">
                          {isAr ? "جاهز للمغادرة" : "Ready to Discharge"}
                        </span>
                        <span className="text-xs text-slate-400 font-mono font-medium">
                          {patient.mrn}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-slate-800 text-lg">
                        {isAr ? patient.nameAr : patient.nameEn}
                      </h3>
                      
                      <p className="text-xs text-slate-500 font-medium">
                        {isAr ? "السرير:" : "Bed:"} {patient.roomNumber} • {patient.bedNumber}
                      </p>
                    </div>

                    {/* Interactive Checklist Columns */}
                    <div className="grid grid-cols-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs font-bold w-full lg:w-auto">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span className="text-slate-600">{isAr ? "تقرير الطبيب" : "Clinical Doc"}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span className="text-slate-600">{isAr ? "صرف الأدوية" : "Meds Handover"}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span className="text-slate-600">{isAr ? "تسوية الحسابات" : "Billing Settled"}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span className="text-slate-600">{isAr ? "موافقة التمريض" : "Nursing Clear"}</span>
                      </div>
                    </div>

                    {/* Discharge Control */}
                    <div className="flex gap-2 w-full lg:w-auto">
                      <button
                        onClick={() => handleMarkReadyForDischarge(patient.id, false)}
                        className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs border border-slate-200 transition whitespace-nowrap"
                      >
                        {isAr ? "إلغاء الخروج" : "Cancel Discharge"}
                      </button>

                      <button
                        onClick={() => handleCompleteDischarge(patient.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-emerald-600/10 transition whitespace-nowrap flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {isAr ? "إنهاء خروج المريض" : "Confirm Departure"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* MODAL: ADD CLINICAL TASK */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black/50 z-modal animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-slate-100">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-indigo-600" />
                {isAr ? "إضافة مهمة سريرية جديدة" : "Add Clinical Task"}
              </h3>
              <button 
                onClick={() => setShowAddTaskModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold bg-slate-200/50 hover:bg-slate-200 p-1.5 rounded-full transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-5 space-y-4 text-xs font-bold text-slate-600">
              
              {/* Task Title Arabic */}
              <div>
                <label className="block text-[11px] text-slate-400 uppercase mb-1">{isAr ? "المهمة باللغة العربية" : "Task Name (Arabic)"}</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: فحص مستويات الضغط، إعطاء دواء الغدة..."
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm font-medium focus:border-indigo-500 outline-none transition"
                  value={newTaskTitleAr}
                  onChange={(e) => setNewTaskTitleAr(e.target.value)}
                />
              </div>

              {/* Task Title English */}
              <div>
                <label className="block text-[11px] text-slate-400 uppercase mb-1">{isAr ? "المهمة باللغة الإنجليزية" : "Task Name (English)"}</label>
                <input 
                  type="text" 
                  required
                  placeholder="Example: Administer morning insulin, collect lab sample..."
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm font-medium focus:border-indigo-500 outline-none transition"
                  value={newTaskTitleEn}
                  onChange={(e) => setNewTaskTitleEn(e.target.value)}
                />
              </div>

              {/* Assign to Patient */}
              <div>
                <label className="block text-[11px] text-slate-400 uppercase mb-1">{isAr ? "المريض المعني" : "Target Patient"}</label>
                <select 
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm font-medium focus:border-indigo-500 outline-none transition"
                  value={newTaskPatientId}
                  onChange={(e) => setNewTaskPatientId(e.target.value)}
                >
                  <option value="">{isAr ? "جميع مرضى القسم الحاليين" : "All current patients"}</option>
                  {departmentPatients.map(p => (
                    <option key={p.id} value={p.id}>{isAr ? p.nameAr : p.nameEn} ({p.mrn})</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-[11px] text-slate-400 uppercase mb-1">{isAr ? "تصنيف المهمة" : "Task Category"}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {[
                    { id: "meds", labelEn: "Medication", labelAr: "دواء / علاجات" },
                    { id: "vitals", labelEn: "Vitals Check", labelAr: "علامات حيوية" },
                    { id: "nursing", labelEn: "Nursing Duty", labelAr: "إجراء تمريضي" },
                    { id: "discharge", labelEn: "Discharge clearance", labelAr: "إجراء مغادرة" }
                  ].map(cat => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setNewTaskCategory(cat.id as any)}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        newTaskCategory === cat.id 
                          ? "bg-indigo-50 border-indigo-400 text-indigo-700" 
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {isAr ? cat.labelAr : cat.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl transition shadow-md shadow-indigo-600/10"
                >
                  {isAr ? "تأكيد وإضافة" : "Confirm & Add"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
