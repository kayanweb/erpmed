import React, { useState, useMemo } from "react";
import {
  Users, Activity, FileText, Plus, Clock, Search, HeartPulse, Filter,
  Settings, LayoutDashboard, Stethoscope, FileSearch, ArrowUpRight,
  ClipboardList, ListTodo, History as HistoryIcon, Calendar, CheckCircle2, 
  AlertTriangle, ShieldCheck, PhoneCall, Volume2, UserCheck, UserX, AlertOctagon,
  Microscope, Syringe, Pill, Eye, ChevronRight, CornerUpRight, FileCheck,
  Building, Sparkles, SlidersHorizontal, ArrowRight, ShieldAlert, Zap, Layers,
  CheckSquare, FileSpreadsheet, Printer, ExternalLink, RefreshCw, X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHIS } from "../context/HISContext";
import { toast } from "sonner";
import { GlobalEntityLink } from "./GlobalEntityLink";
import DepartmentTasks from "./DepartmentTasks";

export type ClinicWorkflowStatus =
  | "Checked-In"
  | "Waiting for Triage"
  | "In Triage"
  | "Waiting for Nurse"
  | "Waiting for Doctor"
  | "With Doctor"
  | "Orders Requested"
  | "Waiting Lab"
  | "Waiting Radiology"
  | "Waiting Pharmacy"
  | "Discharge Pending"
  | "Completed"
  | "Cancelled"
  | "No Show";

export interface OutpatientEncounterCase {
  id: string;
  queueNumber: string;
  mrn: string;
  patientId: string;
  patientNameAr: string;
  patientNameEn: string;
  age: number;
  gender: string;
  arrivalTime: string;
  priority: "STAT" | "High" | "Normal" | "Low";
  visitType: "New Patient" | "Follow-up" | "ER Add-on" | "VIP Referral" | "Routine";
  chiefComplaintAr: string;
  chiefComplaintEn: string;
  status: ClinicWorkflowStatus;
  assignedDoctorAr: string;
  assignedDoctorEn: string;
  assignedNurseAr: string;
  assignedNurseEn: string;
  waitTimeMins: number;
  consultTimeMins?: number;
  alerts: {
    criticalLab?: boolean;
    criticalRad?: boolean;
    drugAllergy?: boolean;
    drugInteraction?: boolean;
    pregnancy?: boolean;
    isolation?: boolean;
    fallRisk?: boolean;
    diabetic?: boolean;
    hypertensive?: boolean;
    readmission72h?: boolean;
    prevER7d?: boolean;
    outstandingBalance?: boolean;
    insuranceIssue?: boolean;
    pendingConsent?: boolean;
    vip?: boolean;
    interpreterNeeded?: boolean;
  };
  vitals?: {
    bp: string;
    hr: number;
    temp: number;
    spo2: number;
  };
}

export default function OutpatientClinicsDashboard({ language, forceDepartmentId }: { language: "ar" | "en", forceDepartmentId?: string }) {
  const isAr = language === "ar";
  const { patients = [], updatePatientStatus, currentUser, addAuditLog } = useHIS();
  
  const [selectedClinic, setSelectedClinic] = useState<string>(forceDepartmentId || "clinic-im");
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [callingPatient, setCallingPatient] = useState<OutpatientEncounterCase | null>(null);
  const [quickNoteModal, setQuickNoteModal] = useState<OutpatientEncounterCase | null>(null);
  const [quickNoteText, setQuickNoteText] = useState("");

  const clinics = [
    { id: "clinic-im", en: "Internal Medicine Clinic Operations Center", ar: "مركز عمليات عيادة الباطنة العامة" },
    { id: "clinic-ped", en: "Pediatrics Clinic Operations Center", ar: "مركز عمليات عيادة الأطفال والحديثي الولادة" },
    { id: "clinic-cardio", en: "Cardiology Center Operations Center", ar: "مركز عمليات عيادة أمراض وجراحة القلب" },
    { id: "clinic-ortho", en: "Orthopedics & Trauma Clinic Operations Center", ar: "مركز عمليات عيادة العظام والجراحة" },
    { id: "clinic-derma", en: "Dermatology Clinic Operations Center", ar: "مركز عمليات عيادة الأمراض الجلدية" },
    { id: "clinic-neuro", en: "Neurology Clinic Operations Center", ar: "مركز عمليات عيادة المخ والأعصاب" }
  ];

  // Mock Active Clinic Cases dataset enriched with comprehensive enterprise clinical state
  const [clinicCases, setClinicCases] = useState<OutpatientEncounterCase[]>([
    {
      id: "ENC-2026-901",
      queueNumber: "Q-101",
      mrn: "MRN-88219",
      patientId: patients[0]?.id || "p1",
      patientNameAr: "أحمد بن خالد العتيبي",
      patientNameEn: "Ahmad K. Al-Otaibi",
      age: 54,
      gender: "Male",
      arrivalTime: "08:15 AM",
      priority: "STAT",
      visitType: "ER Add-on",
      chiefComplaintAr: "ألم في الصدر ضاغط يمتد للكتف الأيسر مع ضيق تنفس",
      chiefComplaintEn: "Compressive chest pain radiating to left shoulder with dyspnea",
      status: "With Doctor",
      assignedDoctorAr: "د. طارق المنصور (استشاري)",
      assignedDoctorEn: "Dr. Tariq Al-Mansoor (Consultant)",
      assignedNurseAr: "م. مريم خليل",
      assignedNurseEn: "Nurse Maryam Khalil",
      waitTimeMins: 5,
      consultTimeMins: 12,
      alerts: {
        criticalLab: true,
        criticalRad: false,
        drugAllergy: true,
        drugInteraction: true,
        pregnancy: false,
        isolation: false,
        fallRisk: true,
        diabetic: true,
        hypertensive: true,
        readmission72h: false,
        prevER7d: true,
        outstandingBalance: false,
        insuranceIssue: false,
        pendingConsent: false,
        vip: true,
        interpreterNeeded: false,
      },
      vitals: { bp: "155/95", hr: 98, temp: 37.1, spo2: 96 }
    },
    {
      id: "ENC-2026-902",
      queueNumber: "Q-102",
      mrn: "MRN-743393",
      patientId: patients[1]?.id || "p2",
      patientNameAr: "ياسين بن إبراهيم السعيد",
      patientNameEn: "Yassin I. Al-Saeed",
      age: 88,
      gender: "Male",
      arrivalTime: "08:30 AM",
      priority: "High",
      visitType: "Follow-up",
      chiefComplaintAr: "متابعة ارتفاع ضغط الدم والسكري واعتلال الكلى",
      chiefComplaintEn: "Hypertension, T2DM and CKD follow-up",
      status: "Waiting for Doctor",
      assignedDoctorAr: "د. طارق المنصور (استشاري)",
      assignedDoctorEn: "Dr. Tariq Al-Mansoor (Consultant)",
      assignedNurseAr: "م. إيمان يوسف",
      assignedNurseEn: "Nurse Eman Youssef",
      waitTimeMins: 22,
      alerts: {
        criticalLab: false,
        criticalRad: false,
        drugAllergy: false,
        drugInteraction: true,
        pregnancy: false,
        isolation: false,
        fallRisk: true,
        diabetic: true,
        hypertensive: true,
        readmission72h: true,
        prevER7d: false,
        outstandingBalance: false,
        insuranceIssue: true,
        pendingConsent: false,
        vip: false,
        interpreterNeeded: false,
      },
      vitals: { bp: "140/88", hr: 74, temp: 36.8, spo2: 98 }
    },
    {
      id: "ENC-2026-903",
      queueNumber: "Q-103",
      mrn: "MRN-551092",
      patientId: "p3",
      patientNameAr: "فاطمة الزهراء الشمري",
      patientNameEn: "Fatima Al-Zahra Al-Shammari",
      age: 32,
      gender: "Female",
      arrivalTime: "08:45 AM",
      priority: "Normal",
      visitType: "New Patient",
      chiefComplaintAr: "خمول عام وإرهاق وتساقط شعر وفحوصات دورية",
      chiefComplaintEn: "General fatigue, hair thinning & routine screening",
      status: "Waiting Lab",
      assignedDoctorAr: "د. سارة الغامدي",
      assignedDoctorEn: "Dr. Sara Al-Ghamdi",
      assignedNurseAr: "م. هدى علي",
      assignedNurseEn: "Nurse Hoda Ali",
      waitTimeMins: 35,
      alerts: {
        criticalLab: false,
        criticalRad: false,
        drugAllergy: true,
        drugInteraction: false,
        pregnancy: true,
        isolation: false,
        fallRisk: false,
        diabetic: false,
        hypertensive: false,
        readmission72h: false,
        prevER7d: false,
        outstandingBalance: false,
        insuranceIssue: false,
        pendingConsent: false,
        vip: false,
        interpreterNeeded: false,
      },
      vitals: { bp: "115/75", hr: 68, temp: 36.6, spo2: 99 }
    },
    {
      id: "ENC-2026-904",
      queueNumber: "Q-104",
      mrn: "MRN-330198",
      patientId: "p4",
      patientNameAr: "خالد بن ناصر القحطاني",
      patientNameEn: "Khalid N. Al-Qahtani",
      age: 42,
      gender: "Male",
      arrivalTime: "09:00 AM",
      priority: "Normal",
      visitType: "Routine",
      chiefComplaintAr: "مراجعة تقرير الأشعة السينية وتحاليل الدهون",
      chiefComplaintEn: "Review of X-Ray report & Lipid profile results",
      status: "In Triage",
      assignedDoctorAr: "د. طارق المنصور (استشاري)",
      assignedDoctorEn: "Dr. Tariq Al-Mansoor (Consultant)",
      assignedNurseAr: "م. إيمان يوسف",
      assignedNurseEn: "Nurse Eman Youssef",
      waitTimeMins: 14,
      alerts: {
        criticalLab: false,
        criticalRad: true,
        drugAllergy: false,
        drugInteraction: false,
        pregnancy: false,
        isolation: false,
        fallRisk: false,
        diabetic: true,
        hypertensive: true,
        readmission72h: false,
        prevER7d: false,
        outstandingBalance: true,
        insuranceIssue: false,
        pendingConsent: false,
        vip: false,
        interpreterNeeded: false,
      },
      vitals: { bp: "132/84", hr: 78, temp: 37.0, spo2: 97 }
    },
    {
      id: "ENC-2026-905",
      queueNumber: "Q-105",
      mrn: "MRN-991204",
      patientId: "p5",
      patientNameAr: "نورة بنت عبد الله الشهري",
      patientNameEn: "Noura A. Al-Shehri",
      age: 61,
      gender: "Female",
      arrivalTime: "09:10 AM",
      priority: "High",
      visitType: "VIP Referral",
      chiefComplaintAr: "دوخة مستمرة ونوبات هبوط في السكر",
      chiefComplaintEn: "Persistent dizziness and hypoglycemic episodes",
      status: "Orders Requested",
      assignedDoctorAr: "د. طارق المنصور (استشاري)",
      assignedDoctorEn: "Dr. Tariq Al-Mansoor (Consultant)",
      assignedNurseAr: "م. مريم خليل",
      assignedNurseEn: "Nurse Maryam Khalil",
      waitTimeMins: 40,
      alerts: {
        criticalLab: true,
        criticalRad: false,
        drugAllergy: true,
        drugInteraction: true,
        pregnancy: false,
        isolation: false,
        fallRisk: true,
        diabetic: true,
        hypertensive: false,
        readmission72h: false,
        prevER7d: true,
        outstandingBalance: false,
        insuranceIssue: false,
        pendingConsent: true,
        vip: true,
        interpreterNeeded: false,
      },
      vitals: { bp: "108/64", hr: 82, temp: 36.7, spo2: 98 }
    },
    {
      id: "ENC-2026-906",
      queueNumber: "Q-106",
      mrn: "MRN-112049",
      patientId: "p6",
      patientNameAr: "عبد الرحمن جابر الحربي",
      patientNameEn: "Abdulrahman J. Al-Harbi",
      age: 29,
      gender: "Male",
      arrivalTime: "09:20 AM",
      priority: "Low",
      visitType: "New Patient",
      chiefComplaintAr: "ألم أسفل الظهر بعد تمرين رياضي",
      chiefComplaintEn: "Lower back pain following heavy exercise",
      status: "Checked-In",
      assignedDoctorAr: "د. سارة الغامدي",
      assignedDoctorEn: "Dr. Sara Al-Ghamdi",
      assignedNurseAr: "م. هدى علي",
      assignedNurseEn: "Nurse Hoda Ali",
      waitTimeMins: 8,
      alerts: {
        criticalLab: false,
        criticalRad: false,
        drugAllergy: false,
        drugInteraction: false,
        pregnancy: false,
        isolation: false,
        fallRisk: false,
        diabetic: false,
        hypertensive: false,
        readmission72h: false,
        prevER7d: false,
        outstandingBalance: false,
        insuranceIssue: false,
        pendingConsent: false,
        vip: false,
        interpreterNeeded: false,
      }
    }
  ]);

  // Operational Dashboard Aggregations (16 KPI Metrics)
  const metrics = useMemo(() => {
    const total = clinicCases.length;
    const checkedIn = clinicCases.filter(c => c.status === "Checked-In").length;
    const triage = clinicCases.filter(c => c.status === "In Triage" || c.status === "Waiting for Triage").length;
    const waitingDoctor = clinicCases.filter(c => c.status === "Waiting for Doctor" || c.status === "Waiting for Nurse").length;
    const withDoctor = clinicCases.filter(c => c.status === "With Doctor").length;
    const waitingLab = clinicCases.filter(c => c.status === "Waiting Lab").length;
    const waitingRad = clinicCases.filter(c => c.status === "Waiting Radiology").length;
    const waitingPharm = clinicCases.filter(c => c.status === "Waiting Pharmacy").length;
    const completed = clinicCases.filter(c => c.status === "Completed").length;
    const noShow = clinicCases.filter(c => c.status === "No Show").length;
    const emergencyAddons = clinicCases.filter(c => c.visitType === "ER Add-on" || c.priority === "STAT").length;
    const followUps = clinicCases.filter(c => c.visitType === "Follow-up").length;
    const newPatients = clinicCases.filter(c => c.visitType === "New Patient").length;
    const criticalAlertsCount = clinicCases.filter(c => c.alerts.criticalLab || c.alerts.criticalRad || c.alerts.prevER7d).length;
    const avgWait = Math.round(clinicCases.reduce((acc, curr) => acc + curr.waitTimeMins, 0) / (total || 1));
    const avgConsult = 18;

    return {
      total, checkedIn, triage, waitingDoctor, withDoctor, waitingLab, waitingRad,
      waitingPharm, completed, noShow, emergencyAddons, followUps, newPatients,
      criticalAlertsCount, avgWait, avgConsult
    };
  }, [clinicCases]);

  // Status Filter options
  const statusTabs = [
    { id: "ALL", labelAr: "الكل", labelEn: "All Cases", count: metrics.total },
    { id: "WAITING_DOCTOR", labelAr: "في انتظار الطبيب", labelEn: "Waiting Doctor", count: metrics.waitingDoctor },
    { id: "WITH_DOCTOR", labelAr: "داخل الكشف", labelEn: "With Doctor", count: metrics.withDoctor },
    { id: "TRIAGE", labelAr: "الفرز والتمريض", labelEn: "Triage & Nurse", count: metrics.triage },
    { id: "LAB_RAD", labelAr: "المعمل والأشعة", labelEn: "Lab / Rad Pending", count: metrics.waitingLab + metrics.waitingRad },
    { id: "CHECKED_IN", labelAr: "مسجل جديد", labelEn: "Checked In", count: metrics.checkedIn },
    { id: "COMPLETED", labelAr: "مكتمل", labelEn: "Completed", count: metrics.completed },
    { id: "NO_SHOW", labelAr: "لم يحضر", labelEn: "No Show", count: metrics.noShow },
  ];

  // Filtered dataset
  const filteredCases = useMemo(() => {
    return clinicCases.filter(c => {
      const pName = isAr ? c.patientNameAr : c.patientNameEn;
      const matchesSearch = pName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.queueNumber.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (activeStatusFilter === "WAITING_DOCTOR") return c.status === "Waiting for Doctor" || c.status === "Waiting for Nurse";
      if (activeStatusFilter === "WITH_DOCTOR") return c.status === "With Doctor";
      if (activeStatusFilter === "TRIAGE") return c.status === "In Triage" || c.status === "Waiting for Triage";
      if (activeStatusFilter === "LAB_RAD") return c.status === "Waiting Lab" || c.status === "Waiting Radiology" || c.status === "Orders Requested";
      if (activeStatusFilter === "CHECKED_IN") return c.status === "Checked-In";
      if (activeStatusFilter === "COMPLETED") return c.status === "Completed" || c.status === "Discharge Pending";
      if (activeStatusFilter === "NO_SHOW") return c.status === "No Show" || c.status === "Cancelled";

      return true;
    });
  }, [clinicCases, searchQuery, activeStatusFilter, isAr]);

  // Workflow status color maps
  const getStatusBadge = (status: ClinicWorkflowStatus) => {
    switch (status) {
      case "Checked-In":
        return { bg: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: UserCheck, ar: "تم التسجيل", en: "Checked-In" };
      case "Waiting for Triage":
      case "In Triage":
        return { bg: "bg-amber-50 text-amber-700 border-amber-200", icon: Activity, ar: "في التقييم والفرز", en: "In Triage" };
      case "Waiting for Nurse":
        return { bg: "bg-teal-50 text-teal-700 border-teal-200", icon: Stethoscope, ar: "في انتظار الممرض", en: "Waiting Nurse" };
      case "Waiting for Doctor":
        return { bg: "bg-sky-50 text-sky-700 border-sky-200", icon: Clock, ar: "في انتظار الطبيب", en: "Waiting Doctor" };
      case "With Doctor":
        return { bg: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-2 ring-emerald-500/20", icon: HeartPulse, ar: "داخل الكشف الطبي", en: "With Doctor" };
      case "Orders Requested":
        return { bg: "bg-purple-50 text-purple-700 border-purple-200", icon: ClipboardList, ar: "طلبات طبية معلقة", en: "Orders Pending" };
      case "Waiting Lab":
        return { bg: "bg-cyan-50 text-cyan-700 border-cyan-200", icon: Microscope, ar: "في انتظار المعمل", en: "Waiting Lab" };
      case "Waiting Radiology":
        return { bg: "bg-violet-50 text-violet-700 border-violet-200", icon: Zap, ar: "في انتظار الأشعة", en: "Waiting Rad" };
      case "Waiting Pharmacy":
        return { bg: "bg-orange-50 text-orange-700 border-orange-200", icon: Pill, ar: "في انتظار الصيدلية", en: "Waiting Rx" };
      case "Discharge Pending":
      case "Completed":
        return { bg: "bg-slate-100 text-slate-700 border-slate-200", icon: CheckCircle2, ar: "زيارة مكتملة", en: "Completed" };
      case "Cancelled":
      case "No Show":
        return { bg: "bg-rose-50 text-rose-700 border-rose-200", icon: UserX, ar: "لم يحضر / ملغي", en: "No Show" };
      default:
        return { bg: "bg-slate-100 text-slate-700 border-slate-200", icon: Clock, ar: status, en: status };
    }
  };

  // State Updates with Clinical Audit Traceability
  const handleUpdateStatus = (caseId: string, newStatus: ClinicWorkflowStatus) => {
    setClinicCases(prev => prev.map(c => c.id === caseId ? { ...c, status: newStatus } : c));
    toast.success(isAr ? `تم تحديث حالة الزيارة إلى: ${newStatus}` : `Encounter status updated to: ${newStatus}`);
    if (addAuditLog) {
      addAuditLog({
        action: "CLINIC_STATUS_UPDATE",
        details: `Updated encounter ${caseId} status to ${newStatus}`,
        entityId: caseId,
        user: currentUser?.name || "Dr. Tariq Al-Mansoor"
      });
    }
  };

  // Start Consultation -> Move status to With Doctor & Open Full Clinical Encounter Workspace
  const handleStartConsultation = (item: OutpatientEncounterCase) => {
    handleUpdateStatus(item.id, "With Doctor");
    window.dispatchEvent(new CustomEvent('openPatientChart', {
      detail: {
        patientId: item.patientId,
        patientName: isAr ? item.patientNameAr : item.patientNameEn,
        initialTab: 'emr'
      }
    }));
  };

  // Trigger Patient Call Notification
  const handleCallPatient = (item: OutpatientEncounterCase) => {
    setCallingPatient(item);
    toast.info(isAr ? `جاري نداء المريض ${item.patientNameAr} (رقم ${item.queueNumber})` : `Calling patient ${item.patientNameEn} (${item.queueNumber})`);
    setTimeout(() => {
      setCallingPatient(null);
    }, 4000);
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50/70 font-sans" dir={isAr ? "rtl" : "ltr"}>
      
      {/* Clinic Operations Center Header */}
      <div className="bg-slate-900 text-white px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl shrink-0 z-20 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 bg-sky-500/20 rounded-2xl flex items-center justify-center border border-sky-400/30 shadow-inner">
            <Building className="w-7 h-7 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-black tracking-tight text-white uppercase">
                {isAr ? "مركز عمليات العيادات الخارجية" : "Outpatient Clinic Operations Center"}
              </h1>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-black rounded-full border border-emerald-500/30 uppercase tracking-widest flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                LIVE OPERATIONS
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400 font-bold mt-1">
              <span className="flex items-center gap-1.5 text-sky-300">
                <Stethoscope size={14} />
                {isAr ? "الطبيب المناوب:" : "Active Doctor:"} <strong className="text-white">د. طارق المنصور (استشاري باطنة)</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {isAr ? "فترة العمل:" : "Shift:"} <strong className="text-slate-200">08:00 AM - 04:00 PM</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={selectedClinic}
            onChange={(e) => setSelectedClinic(e.target.value)}
            className="px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-black focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
          >
            {clinics.map(c => (
              <option key={c.id} value={c.id}>{isAr ? c.ar : c.en}</option>
            ))}
          </select>

          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('openVisitRegistration'))} 
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-sky-900/40 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? "حجز زيارة جديدة" : "New Visit"}</span>
          </button>

          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('openPatientRegistration'))} 
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-indigo-900/40 transition-all flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>{isAr ? "تسجيل مريض جديد" : "Register Patient"}</span>
          </button>
        </div>
      </div>

      {/* Clinic Command Center - Top Metrics Bar (14 Key Operational Indicators) */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 xl:grid-cols-14 gap-3 shrink-0 shadow-xs">
        {[
          { labelAr: "إجمالي اليوم", labelEn: "Total Today", val: metrics.total, color: "text-slate-900", bg: "bg-slate-50", border: "border-slate-200" },
          { labelAr: "في الانتظار", labelEn: "Waiting Doctor", val: metrics.waitingDoctor, color: "text-sky-700", bg: "bg-sky-50", border: "border-sky-200" },
          { labelAr: "داخل الكشف", labelEn: "With Doctor", val: metrics.withDoctor, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-300 ring-1 ring-emerald-400" },
          { labelAr: "في الفرز", labelEn: "In Triage", val: metrics.triage, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
          { labelAr: "انتظار معمل", labelEn: "Waiting Lab", val: metrics.waitingLab, color: "text-cyan-700", bg: "bg-cyan-50", border: "border-cyan-200" },
          { labelAr: "انتظار أشعة", labelEn: "Waiting Rad", val: metrics.waitingRad, color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200" },
          { labelAr: "انتظار صيدلية", labelEn: "Waiting Rx", val: metrics.waitingPharm, color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
          { labelAr: "مكتمل", labelEn: "Completed", val: metrics.completed, color: "text-slate-700", bg: "bg-slate-100", border: "border-slate-200" },
          { labelAr: "طوارئ وإضافي", labelEn: "STAT / ER", val: metrics.emergencyAddons, color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" },
          { labelAr: "لم يحضر", labelEn: "No Show", val: metrics.noShow, color: "text-gray-600", bg: "bg-gray-100", border: "border-gray-200" },
          { labelAr: "إعادة ومتابعة", labelEn: "Follow-up", val: metrics.followUps, color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200" },
          { labelAr: "مريض جديد", labelEn: "New Patient", val: metrics.newPatients, color: "text-teal-700", bg: "bg-teal-50", border: "border-teal-200" },
          { labelAr: "متوسط الانتظار", labelEn: "Avg Wait", val: `${metrics.avgWait}m`, color: "text-blue-800", bg: "bg-blue-50", border: "border-blue-200" },
          { labelAr: "متوسط الكشف", labelEn: "Avg Consult", val: `${metrics.avgConsult}m`, color: "text-emerald-800", bg: "bg-emerald-50", border: "border-emerald-200" },
        ].map((m, idx) => (
          <div key={idx} className={`p-2.5 rounded-xl border ${m.bg} ${m.border} flex flex-col justify-between text-center transition-all hover:scale-[1.02]`}>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-tight block truncate">
              {isAr ? m.labelAr : m.labelEn}
            </span>
            <span className={`text-base font-black ${m.color} mt-0.5`}>
              {m.val}
            </span>
          </div>
        ))}
      </div>

      {/* Live Calling Alert Banner (When Doctor Calls Patient) */}
      <AnimatePresence>
        {callingPatient && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-6 py-3 flex items-center justify-between shadow-lg z-30 shrink-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
                <Volume2 size={20} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-emerald-200">
                  {isAr ? "نداء صوتي مباشر للعيادة" : "LIVE PATIENT ANNOUNCEMENT"}
                </p>
                <p className="text-sm font-black">
                  {isAr ? `يرجى من المريض: ${callingPatient.patientNameAr} (رقم ${callingPatient.queueNumber}) التوجه لعيادة الباطنة رقم 2` : `Calling Patient: ${callingPatient.patientNameEn} (${callingPatient.queueNumber}) to Consultation Room 2`}
                </p>
              </div>
            </div>
            <button onClick={() => setCallingPatient(null)} className="p-1.5 hover:bg-white/20 rounded-lg text-white">
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Intelligent Patient Queue Section */}
      <div className="flex-1 flex flex-col p-6 min-h-0 overflow-hidden">
        
        {/* Filter Controls & Search */}
        <div className="bg-white rounded-t-2xl border border-slate-200 p-4 border-b flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-xs">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {statusTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveStatusFilter(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeStatusFilter === tab.id 
                    ? "bg-sky-600 text-white shadow-md shadow-sky-200" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span>{isAr ? tab.labelAr : tab.labelEn}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeStatusFilter === tab.id ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div className="relative w-full sm:w-80">
            <Search className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 text-slate-400 ${isAr ? "right-3" : "left-3"}`} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? "بحث بالاسم، رقم الملف MRN، أو رقم الانتظار..." : "Search by Name, MRN, or Queue #..."}
              className={`w-full py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all ${isAr ? "pr-9 pl-3" : "pl-9 pr-3"}`}
            />
          </div>
        </div>

        {/* Intelligent Work Queue Table */}
        <div className="flex-1 bg-white border-x border-b border-slate-200 rounded-b-2xl overflow-y-auto shadow-sm custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100/80 text-[10px] font-black text-slate-500 uppercase tracking-widest sticky top-0 z-10 border-b border-slate-200 backdrop-blur-md">
              <tr>
                <th className="py-3.5 px-4">{isAr ? "الأولوية" : "Priority"}</th>
                <th className="py-3.5 px-4">{isAr ? "الرقم والوصول" : "Queue & Arrival"}</th>
                <th className="py-3.5 px-4">{isAr ? "المريض / MRN" : "Patient / MRN"}</th>
                <th className="py-3.5 px-4">{isAr ? "النوع والعمر" : "Visit & Age"}</th>
                <th className="py-3.5 px-4">{isAr ? "الشكوى الرئيسية" : "Chief Complaint"}</th>
                <th className="py-3.5 px-4">{isAr ? "مسار العمل الحالي" : "Workflow Status"}</th>
                <th className="py-3.5 px-4">{isAr ? "تنبيهات سريعة قبل الفتح" : "Smart Alerts"}</th>
                <th className="py-3.5 px-4 text-center">{isAr ? "إجراءات العمل السريعة" : "Quick Actions"}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredCases.length > 0 ? (
                filteredCases.map((item) => {
                  const statusInfo = getStatusBadge(item.status);
                  const StatusIcon = statusInfo.icon;
                  const patientName = isAr ? item.patientNameAr : item.patientNameEn;

                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-sky-50/40 transition-colors ${item.status === 'With Doctor' ? 'bg-emerald-50/20' : ''}`}
                    >
                      {/* Priority */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                          item.priority === 'STAT' ? 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse' :
                          item.priority === 'High' ? 'bg-orange-100 text-orange-700 border-orange-300' :
                          item.priority === 'Normal' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {item.priority}
                        </span>
                      </td>

                      {/* Queue & Arrival */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-black text-slate-900 text-sm">{item.queueNumber}</div>
                        <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock size={11} />
                          <span>{item.arrivalTime} ({item.waitTimeMins}m)</span>
                        </div>
                      </td>

                      {/* Patient Info with Entity Link */}
                      <td className="py-4 px-4 min-w-[200px]">
                        <div className="font-black text-slate-900 text-sm hover:text-sky-600 transition-colors cursor-pointer" onClick={() => handleStartConsultation(item)}>
                          {patientName}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <GlobalEntityLink entityType="patient" entityId={item.patientId} entityName={item.mrn} className="text-[10px] font-mono font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100" />
                          {item.vitals && (
                            <span className="text-[10px] font-bold text-slate-500">
                              BP: {item.vitals.bp} | HR: {item.vitals.hr}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Visit & Age */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                          item.visitType === 'ER Add-on' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          item.visitType === 'VIP Referral' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          item.visitType === 'Follow-up' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                          'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {item.visitType}
                        </span>
                        <div className="text-[10px] font-bold text-slate-500 mt-1">
                          {item.gender} • {item.age} YRS
                        </div>
                      </td>

                      {/* Chief Complaint */}
                      <td className="py-4 px-4 max-w-[220px]">
                        <p className="font-bold text-slate-700 text-xs line-clamp-2" title={isAr ? item.chiefComplaintAr : item.chiefComplaintEn}>
                          {isAr ? item.chiefComplaintAr : item.chiefComplaintEn}
                        </p>
                      </td>

                      {/* Workflow Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 rounded-xl text-xs font-black inline-flex items-center gap-1.5 border ${statusInfo.bg}`}>
                          <StatusIcon size={14} />
                          <span>{isAr ? statusInfo.ar : statusInfo.en}</span>
                        </span>
                        <div className="text-[10px] font-bold text-slate-400 mt-1">
                          {isAr ? item.assignedDoctorAr : item.assignedDoctorEn}
                        </div>
                      </td>

                      {/* Pre-opening Smart Alerts (High Visibility Indicators) */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {item.alerts.criticalLab && (
                            <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 border border-rose-300 rounded font-black text-[9px] flex items-center gap-0.5" title="Critical Lab Value">
                              🩸 {isAr ? "معمل حرج" : "Crit Lab"}
                            </span>
                          )}
                          {item.alerts.criticalRad && (
                            <span className="px-1.5 py-0.5 bg-violet-100 text-violet-700 border border-violet-300 rounded font-black text-[9px] flex items-center gap-0.5" title="Critical Radiology Findings">
                              ☢️ {isAr ? "أشعة حرجة" : "Crit Rad"}
                            </span>
                          )}
                          {item.alerts.drugAllergy && (
                            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded font-black text-[9px] flex items-center gap-0.5" title="Severe Drug Allergy">
                              ⚠️ {isAr ? "حساسية" : "Allergy"}
                            </span>
                          )}
                          {item.alerts.drugInteraction && (
                            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 border border-purple-300 rounded font-black text-[9px] flex items-center gap-0.5" title="Drug Interaction Warning">
                              💊 {isAr ? "تضارب" : "Interaction"}
                            </span>
                          )}
                          {item.alerts.pregnancy && (
                            <span className="px-1.5 py-0.5 bg-pink-100 text-pink-700 border border-pink-300 rounded font-black text-[9px] flex items-center gap-0.5">
                              🤰 {isAr ? "حامل" : "Pregnancy"}
                            </span>
                          )}
                          {item.alerts.fallRisk && (
                            <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 border border-orange-300 rounded font-black text-[9px] flex items-center gap-0.5">
                              🚸 {isAr ? "سقوط" : "Fall Risk"}
                            </span>
                          )}
                          {item.alerts.diabetic && (
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 border border-blue-200 rounded font-black text-[9px]">
                              DM
                            </span>
                          )}
                          {item.alerts.hypertensive && (
                            <span className="px-1.5 py-0.5 bg-red-100 text-red-700 border border-red-200 rounded font-black text-[9px]">
                              HTN
                            </span>
                          )}
                          {item.alerts.readmission72h && (
                            <span className="px-1.5 py-0.5 bg-cyan-100 text-cyan-800 border border-cyan-300 rounded font-black text-[9px]" title="Readmitted within 72 hours">
                              🔄 {isAr ? "إعادة 72س" : "<72h Readm"}
                            </span>
                          )}
                          {item.alerts.prevER7d && (
                            <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 border border-rose-300 rounded font-black text-[9px]">
                              🚨 {isAr ? "طوارئ مؤخراً" : "Recent ER"}
                            </span>
                          )}
                          {item.alerts.vip && (
                            <span className="px-1.5 py-0.5 bg-amber-400 text-amber-950 font-black rounded text-[9px]">
                              👑 VIP
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Quick Actions Action Desk */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Main Start Consultation Button */}
                          <button
                            onClick={() => handleStartConsultation(item)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                            title={isAr ? "بدء الكشف الطبي وتوثيق SOAP" : "Start Consultation"}
                          >
                            <Stethoscope size={14} />
                            <span>{isAr ? "بدء الكشف" : "Start Consult"}</span>
                          </button>

                          {/* Call Voice Announcement */}
                          <button
                            onClick={() => handleCallPatient(item)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all"
                            title={isAr ? "نداء المريض بالصوت" : "Call Patient"}
                          >
                            <PhoneCall size={15} />
                          </button>

                          {/* Order Quick Actions */}
                          <button
                            onClick={() => window.dispatchEvent(new CustomEvent('openOrderEntry', { detail: { patientId: item.patientId, orderType: 'lab' } }))}
                            className="p-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 rounded-lg transition-all border border-cyan-200"
                            title={isAr ? "طلب تحاليل طارئة" : "Order Lab"}
                          >
                            <Microscope size={15} />
                          </button>

                          <button
                            onClick={() => window.dispatchEvent(new CustomEvent('openOrderEntry', { detail: { patientId: item.patientId, orderType: 'radiology' } }))}
                            className="p-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-lg transition-all border border-violet-200"
                            title={isAr ? "طلب أشعة" : "Order Radiology"}
                          >
                            <Zap size={15} />
                          </button>

                          <button
                            onClick={() => window.dispatchEvent(new CustomEvent('openOrderEntry', { detail: { patientId: item.patientId, orderType: 'pharmacy' } }))}
                            className="p-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-all border border-orange-200"
                            title={isAr ? "وصفة طبية" : "Prescribe Meds"}
                          >
                            <Pill size={15} />
                          </button>

                          {/* Quick Note */}
                          <button
                            onClick={() => setQuickNoteModal(item)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all"
                            title={isAr ? "إضافة ملاحظة سريعة" : "Add Note"}
                          >
                            <FileText size={15} />
                          </button>

                          {/* Admission Workflow */}
                          <button
                            onClick={() => window.dispatchEvent(new CustomEvent('openAdmissionModal', { detail: { patientId: item.patientId } }))}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-all border border-rose-200"
                            title={isAr ? "طلب تنويم بالمستشفى" : "Admit Patient"}
                          >
                            <Building size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-base font-black text-slate-700">{isAr ? "لا توجد حالات حالياً في قائمة الانتظار المختارة" : "No active patients found in selected queue filter."}</p>
                    <p className="text-xs font-bold text-slate-400 mt-1">{isAr ? "قم بتغيير التصفية أو بحث بالاسم" : "Change filter or search query"}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Note Modal */}
      {quickNoteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-black text-slate-900 mb-2">
              {isAr ? `إضافة ملاحظة سريعة - ${quickNoteModal.patientNameAr}` : `Quick Note - ${quickNoteModal.patientNameEn}`}
            </h3>
            <p className="text-xs font-bold text-slate-500 mb-4">
              MRN: {quickNoteModal.mrn} | Queue: {quickNoteModal.queueNumber}
            </p>
            <textarea
              rows={4}
              value={quickNoteText}
              onChange={(e) => setQuickNoteText(e.target.value)}
              placeholder={isAr ? "اكتب تفاصيل الملاحظة الطبية هنا..." : "Type clinical note details..."}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-sky-500 outline-none"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button 
                onClick={() => setQuickNoteModal(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200 transition"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button 
                onClick={() => {
                  toast.success(isAr ? "تم حفظ الملاحظة بنجاح في السجل" : "Note saved to patient encounter");
                  setQuickNoteModal(null);
                  setQuickNoteText("");
                }}
                className="px-5 py-2 bg-sky-600 text-white rounded-xl font-bold text-xs hover:bg-sky-700 transition"
              >
                {isAr ? "حفظ الملاحظة" : "Save Note"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
