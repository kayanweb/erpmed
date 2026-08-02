import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Scan, Camera, HardDrive, Search, Filter, CheckCircle2, Clock, AlertCircle, 
  ChevronRight, User, History, Activity, Printer, ShieldCheck, ArrowUpRight, 
  Database, ListTodo, AlertTriangle, Zap, Plus, RefreshCw, FileText, Check, X, 
  Flame, HeartPulse, Award, Eye, Lock, Layers, Send, ArrowRight, RotateCcw, 
  HelpCircle, Sliders, ZoomIn, Focus, MousePointer2, Video, Save, Share2, Mic, 
  Play, Settings, LayoutTemplate, Disc, Tag, Building2, Sparkles, QrCode, 
  FileCheck, FileSearch, Radio, Syringe, Gauge, Compass, Stethoscope, Droplets,
  Calendar, Cpu, Wrench, ShieldAlert, FileSpreadsheet, Layers3, ActivitySquare,
  Volume2, FastForward, Maximize2, Crosshair, BarChart3, PieChart, Users,
  CheckSquare, CheckCircle, ArrowDownRight, CornerUpRight, Grid, Monitor,
  SlidersHorizontal, AlertOctagon, RefreshCcw, FileCode, CheckLine, Share,
  FileBadge, Workflow, CpuIcon, Hash, ExternalLink, Columns, Box, SlidersVertical
} from "lucide-react";
import { useHIS } from "../context/HISContext";
import { GlobalEntityLink } from "./GlobalEntityLink";
import { toast } from "sonner";

interface Props {
  language?: "ar" | "en";
}

export type RadiologyCenterMode = 
  | "command_center"
  | "scheduling"
  | "modality_centers"
  | "technician_workspace"
  | "radiologist_workspace"
  | "pacs_viewer"
  | "contrast_management"
  | "radiation_safety"
  | "equipment_management"
  | "reporting_center"
  | "smart_tasks"
  | "cross_navigation"
  | "enterprise_integration";

export type ModalitySubCenter = 
  | "CT" 
  | "MRI" 
  | "X-RAY" 
  | "ULTRASOUND" 
  | "MAMMOGRAPHY" 
  | "FLUOROSCOPY" 
  | "NUCLEAR_MED" 
  | "PET_CT" 
  | "INTERVENTIONAL";

export type RadiologyTaskStatus = 
  | "Scheduled" 
  | "Patient Checked-In" 
  | "Barcode & Accession Printed" 
  | "In-Progress Imaging" 
  | "PACS Uploaded (Pending Report)" 
  | "Approved & EHR Released" 
  | "Critical Finding Flagged" 
  | "On Hold (Safety Warning)";

export interface EnhancedRadiologyTask {
  id: string;
  cpoeOrderId?: string;
  patientId: string;
  patientNameAr: string;
  patientNameEn: string;
  mrn: string;
  age: number;
  gender: string;
  weightKg?: number;
  room: string;
  ward: string;
  department: "Emergency" | "ICU" | "OR" | "Inpatient" | "Pediatric" | "Outpatient";
  orderingDoctor: string;
  clinicalIndication: string;
  studyName: string;
  modality: "CT" | "MRI" | "X-RAY" | "ULTRASOUND" | "MAMMOGRAPHY" | "PET-CT" | "FLUOROSCOPY" | "NUCLEAR_MED" | "INTERVENTIONAL";
  bodyPart: string;
  contrastRequired: boolean;
  priority: "STAT" | "High" | "Routine";
  status: RadiologyTaskStatus;
  orderTime: string;
  accessionNumber: string;
  allergies?: string[];
  pregnancyStatus?: "Negative" | "Not Applicable" | "Requires Screening";
  renalFunction?: { egfr: number; serumCr: number; isImpaired: boolean };
  radiationDose?: { ctdiVolMgy?: number; dlpMgyCm?: number; lifetimeDoseMsv?: number };
  pacsStudyUid?: string;
  dicomImagesCount?: number;
  technicianName?: string;
  radiologistName?: string;
  findings?: string;
  impression?: string;
  isCriticalFinding?: boolean;
}

export default function RISComprehensiveDashboard({ language = "ar" }: Props) {
  const isAr = language === "ar";
  const { patients = [], currentUser, addAuditLog } = useHIS();

  // Primary Radiology Operations Center Navigation Modes
  const [activeCenterMode, setActiveCenterMode] = useState<RadiologyCenterMode>("command_center");
  const [activeModalityCenter, setActiveModalityCenter] = useState<ModalitySubCenter>("CT");
  const [taskRoleFilter, setTaskRoleFilter] = useState<"technician" | "radiologist" | "manager">("radiologist");

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState<string>("ALL");
  const [selectedTask, setSelectedTask] = useState<EnhancedRadiologyTask | null>(null);

  // PACS Viewer Controls State
  const [activeDicomWindow, setActiveDicomWindow] = useState<"brain" | "lung" | "bone" | "soft_tissue" | "angio">("brain");
  const [dicomZoom, setDicomZoom] = useState(100);
  const [pacsTool, setPacsTool] = useState<"wl" | "pan" | "zoom" | "measure" | "mpr" | "vr" | "ai">("wl");
  const [viewLayout, setViewLayout] = useState<"1x1" | "2x2" | "3d_mpr">("1x1");
  const [cinePlaying, setCinePlaying] = useState(false);

  // Radiologist Reporting State
  const [reportFindings, setReportFindings] = useState("");
  const [reportImpression, setReportImpression] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("Standard Diagnostic");
  const [isCriticalAlert, setIsCriticalAlert] = useState(false);
  const [isDictating, setIsDictating] = useState(false);

  // Technician Workflow Checklists
  const [techPrepDone, setTechPrepDone] = useState(false);
  const [techContrastInjected, setTechContrastInjected] = useState(false);
  const [techQualityApproved, setTechQualityApproved] = useState(false);

  // Modal State for Cross Navigation 360
  const [showCrossNavModal, setShowCrossNavModal] = useState(false);
  const [crossNavTab, setCrossNavTab] = useState<"patient" | "encounter" | "orders" | "lab" | "meds" | "history" | "billing">("patient");

  // Live Radiology Tasks Dataset
  const [radiologyTasks, setRadiologyTasks] = useState<EnhancedRadiologyTask[]>([
    {
      id: "RAD-2026-801",
      cpoeOrderId: "cpoe-rad-01",
      patientId: patients[0]?.id || "p1",
      patientNameAr: "أحمد عبد الله القحطاني",
      patientNameEn: "Ahmad A. Al-Qahtani",
      mrn: "MRN-2026-0811",
      age: 62,
      gender: "Male",
      weightKg: 84,
      room: "Bed 04",
      ward: "Emergency Department",
      department: "Emergency",
      orderingDoctor: "Dr. Khalid (Emergency Consultant)",
      clinicalIndication: "Sudden onset right-sided hemiplegia and dysphasia (Onset 1.5h ago). Rule out acute intracranial hemorrhage.",
      studyName: "Brain CT Non-Contrast + CT Angiogram Willis Circle",
      modality: "CT",
      bodyPart: "Brain / Head",
      contrastRequired: true,
      priority: "STAT",
      status: "PACS Uploaded (Pending Report)",
      orderTime: "10 mins ago",
      accessionNumber: "ACC-2026-9901",
      allergies: ["Penicillin"],
      pregnancyStatus: "Not Applicable",
      renalFunction: { egfr: 88, serumCr: 0.9, isImpaired: false },
      radiationDose: { ctdiVolMgy: 42.5, dlpMgyCm: 750, lifetimeDoseMsv: 12.4 },
      pacsStudyUid: "1.2.840.113619.2.55.3.283115309",
      dicomImagesCount: 320,
      technicianName: "Tech. Faisal Al-Harbi"
    },
    {
      id: "RAD-2026-802",
      cpoeOrderId: "cpoe-rad-02",
      patientId: "p2",
      patientNameAr: "سارة محمد العتيبي",
      patientNameEn: "Sara M. Al-Otaibi",
      mrn: "MRN-2026-0943",
      age: 45,
      gender: "Female",
      weightKg: 68,
      room: "Bed 12",
      ward: "Medical ICU",
      department: "ICU",
      orderingDoctor: "Dr. Tariq (ICU Specialist)",
      clinicalIndication: "Severe ARDS, persistent fever - Assess pulmonary infiltrates and pleural effusion.",
      studyName: "Chest CT High Resolution (HRCT)",
      modality: "CT",
      bodyPart: "Chest",
      contrastRequired: false,
      priority: "STAT",
      status: "Patient Checked-In",
      orderTime: "18 mins ago",
      accessionNumber: "ACC-2026-9902",
      pregnancyStatus: "Negative",
      renalFunction: { egfr: 42, serumCr: 1.8, isImpaired: true },
      radiationDose: { ctdiVolMgy: 18.2, dlpMgyCm: 310, lifetimeDoseMsv: 8.1 }
    },
    {
      id: "RAD-2026-803",
      cpoeOrderId: "cpoe-rad-03",
      patientId: "p3",
      patientNameAr: "محمد علي الشهري",
      patientNameEn: "Mohammad A. Al-Shehri",
      mrn: "MRN-2026-0120",
      age: 38,
      gender: "Male",
      weightKg: 79,
      room: "Bed 08",
      ward: "Ortho Inpatient Ward",
      department: "Inpatient",
      orderingDoctor: "Dr. Salem (Orthopedics)",
      clinicalIndication: "Post motor vehicle accident - Lumbar spine fracture evaluation.",
      studyName: "Lumbar Spine MRI with Multiplanar Reconstruction",
      modality: "MRI",
      bodyPart: "Spine / Lumbar",
      contrastRequired: false,
      priority: "High",
      status: "In-Progress Imaging",
      orderTime: "25 mins ago",
      accessionNumber: "ACC-2026-9903",
      dicomImagesCount: 180,
      technicianName: "Tech. Mahmoud Zaki"
    },
    {
      id: "RAD-2026-804",
      cpoeOrderId: "cpoe-rad-04",
      patientId: "p4",
      patientNameAr: "عمر فاروق الشمري",
      patientNameEn: "Omar F. Al-Shammari",
      mrn: "MRN-2026-0220",
      age: 59,
      gender: "Male",
      weightKg: 91,
      room: "OR Room 02",
      ward: "Operating Theater",
      department: "OR",
      orderingDoctor: "Dr. Adel (Vascular Surgery)",
      clinicalIndication: "Right Lower Limb Acute Ischemia - Femoro-popliteal Runoff Doppler",
      studyName: "Lower Extremity Arterial Color Doppler Ultrasound",
      modality: "ULTRASOUND",
      bodyPart: "Vascular Lower Limb",
      contrastRequired: false,
      priority: "STAT",
      status: "Approved & EHR Released",
      orderTime: "40 mins ago",
      accessionNumber: "ACC-2026-9905",
      findings: "Complete thrombosis of the right popliteal artery with minimal distal monophasic flow.",
      impression: "Acute Popliteal Artery Occlusion. Emergent Vascular Intervention Recommended.",
      radiologistName: "Dr. Hisham (Consultant Radiologist)",
      dicomImagesCount: 16,
      isCriticalFinding: true
    },
    {
      id: "RAD-2026-805",
      cpoeOrderId: "cpoe-rad-05",
      patientId: "p5",
      patientNameAr: "فاطمة إبراهيم الدوسري",
      patientNameEn: "Fatimah I. Al-Dossary",
      mrn: "MRN-2026-0551",
      age: 52,
      gender: "Female",
      weightKg: 62,
      room: "Clinic 03",
      ward: "Breast Center Outpatient",
      department: "Outpatient",
      orderingDoctor: "Dr. Reem (Oncology)",
      clinicalIndication: "Annual screening & follow-up of left breast dense node.",
      studyName: "Bilateral Digital Mammography + Tomosynthesis 3D",
      modality: "MAMMOGRAPHY",
      bodyPart: "Breast",
      contrastRequired: false,
      priority: "Routine",
      status: "Scheduled",
      orderTime: "50 mins ago",
      accessionNumber: "ACC-2026-9906"
    }
  ]);

  // Operational Metrics
  const metrics = useMemo(() => {
    const filtered = radiologyTasks.filter(t => deptFilter === "ALL" || t.department === deptFilter);
    const totalExams = filtered.length;
    const statCount = filtered.filter(t => t.priority === "STAT").length;
    const waitingPatients = filtered.filter(t => t.status === "Scheduled" || t.status === "Patient Checked-In").length;
    const inProgress = filtered.filter(t => t.status === "In-Progress Imaging").length;
    const pendingReport = filtered.filter(t => t.status === "PACS Uploaded (Pending Report)").length;
    const criticalFindings = filtered.filter(t => t.isCriticalFinding).length;
    const approvedCount = filtered.filter(t => t.status === "Approved & EHR Released").length;
    const erCases = filtered.filter(t => t.department === "Emergency").length;
    const icuCases = filtered.filter(t => t.department === "ICU").length;
    const orCases = filtered.filter(t => t.department === "OR").length;

    return { totalExams, statCount, waitingPatients, inProgress, pendingReport, criticalFindings, approvedCount, erCases, icuCases, orCases };
  }, [radiologyTasks, deptFilter]);

  // Navigation Tabs for Radiology Operations Center
  const centerTabs = [
    { id: "command_center", icon: Gauge, ar: "مركز القيادة المباشر", en: "Command Center" },
    { id: "scheduling", icon: Calendar, ar: "مركز الجدولة والحجوزات", en: "Scheduling Center" },
    { id: "modality_centers", icon: Cpu, ar: "مراكز التصوير المتخصصة", en: "Modality Work Centers" },
    { id: "technician_workspace", icon: Camera, ar: "مساحة عمل الفني", en: "Technician Workspace" },
    { id: "radiologist_workspace", icon: Stethoscope, ar: "مساحة عمل الاستشاري", en: "Radiologist Workspace" },
    { id: "pacs_viewer", icon: Focus, ar: "معاين PACS الذكي", en: "PACS Intelligence Viewer" },
    { id: "contrast_management", icon: Droplets, ar: "إدارة مواد التباين", en: "Contrast Management" },
    { id: "radiation_safety", icon: ShieldAlert, ar: "السلامة والجرعات الشعاعية", en: "Radiation Safety" },
    { id: "equipment_management", icon: Wrench, ar: "إدارة الأجهزة والصيانة", en: "Equipment & Downtime" },
    { id: "reporting_center", icon: FileText, ar: "مركز التقارير الطبية", en: "Reporting Center" },
    { id: "smart_tasks", icon: CheckSquare, ar: "محرك المهام الذكي", en: "Smart Task Engine" },
    { id: "enterprise_integration", icon: Layers, ar: "الربط المؤسسي 360", en: "Enterprise Integration" },
  ];

  const modalities = [
    { id: "CT", labelAr: "مركز الأشعة المقطعية (CT)", labelEn: "CT Center" },
    { id: "MRI", labelAr: "مركز الرنين المغناطيسي (MRI)", labelEn: "MRI Center" },
    { id: "X-RAY", labelAr: "مركز الأشعة السينية (X-Ray)", labelEn: "X-Ray Center" },
    { id: "ULTRASOUND", labelAr: "مركز التلفزيون والإيكو (Ultrasound)", labelEn: "Ultrasound Center" },
    { id: "MAMMOGRAPHY", labelAr: "مركز أورام الثدي (Mammography)", labelEn: "Mammography Center" },
    { id: "FLUOROSCOPY", labelAr: "مركز الأشعة التداخلية الحية (Fluoroscopy)", labelEn: "Fluoroscopy Center" },
    { id: "NUCLEAR_MED", labelAr: "مركز الطب النبوي (Nuclear Med)", labelEn: "Nuclear Medicine" },
    { id: "PET_CT", labelAr: "مركز التصوير البوزيتروني (PET/CT)", labelEn: "PET/CT Center" },
    { id: "INTERVENTIONAL", labelAr: "الأشعة التداخلية (Interventional)", labelEn: "Interventional Rad" },
  ];

  const handleApproveReport = () => {
    if (!selectedTask) return;
    setRadiologyTasks(prev => prev.map(t => t.id === selectedTask.id ? {
      ...t,
      status: "Approved & EHR Released",
      findings: reportFindings || "No acute abnormality detected.",
      impression: reportImpression || "Unremarkable examination.",
      isCriticalFinding: isCriticalAlert,
      radiologistName: currentUser?.name || "Dr. Hisham (Consultant Radiologist)"
    } : t));

    toast.success(isAr ? "تم اعتماد التقرير الطبي ونشره فوراً لملف المريض (EHR)" : "Report approved & instantly released to EHR");
    if (addAuditLog) {
      addAuditLog({
        action: "RADIOLOGY_REPORT_RELEASED",
        details: `Approved radiology report for study ${selectedTask.id}`,
        entityId: selectedTask.id,
        user: currentUser?.name || "Dr. Hisham"
      });
    }
  };

  const handleDictation = () => {
    setIsDictating(true);
    toast.info(isAr ? "جاري الاستماع للتملية الصوتية الذكية..." : "Listening to voice dictation...");
    setTimeout(() => {
      setIsDictating(false);
      setReportFindings(prev => (prev ? prev + "\n" : "") + "No acute intracranial hemorrhage or mass effect. Ventricles and sulci are within normal limits for age.");
      setReportImpression(prev => (prev ? prev + "\n" : "") + "Normal CT Brain Study.");
      toast.success(isAr ? "تم تحويل الصوت إلى نص مهيكل بنجاح!" : "Voice converted to structured text!");
    }, 2000);
  };

  const filteredTasks = useMemo(() => {
    return radiologyTasks.filter(t => {
      const matchSearch = t.patientNameAr.includes(searchQuery) ||
        t.patientNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.accessionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.mrn.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDept = deptFilter === "ALL" || t.department === deptFilter;
      return matchSearch && matchDept;
    });
  }, [radiologyTasks, searchQuery, deptFilter]);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-900 text-slate-100 font-sans" dir={isAr ? "rtl" : "ltr"}>
      
      {/* Radiology Operations Center Header */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 shadow-2xl shrink-0 z-30">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-sky-500/20 rounded-2xl flex items-center justify-center border border-sky-400/30 shadow-inner shrink-0">
            <Radio className="w-8 h-8 text-sky-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-black tracking-tight text-white uppercase">
                {isAr ? "مركز عمليات الأشعة والتصوير الطبي" : "Radiology Operations Center"}
              </h1>
              <span className="px-3 py-1 bg-sky-500/20 text-sky-300 text-[10px] font-black rounded-full border border-sky-400/30 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                ENTERPRISE RIS & PACS
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 mt-1">
              {isAr ? "نظام التشخيص والملاحة المتكامل لجميع مراكز التصوير والأجهزة والتقارير الطبية" : "Comprehensive Enterprise Diagnostic Imaging, Modality Management & PACS Platform"}
            </p>
          </div>
        </div>

        {/* Top Quick KPIs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-center shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{isAr ? "حالات طارئة STAT" : "STAT Queue"}</span>
            <span className="text-base font-black text-rose-400">{metrics.statCount}</span>
          </div>
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-center shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{isAr ? "في الانتظار" : "Waiting"}</span>
            <span className="text-base font-black text-amber-400">{metrics.waitingPatients}</span>
          </div>
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-center shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{isAr ? "قيد التصوير" : "In Progress"}</span>
            <span className="text-base font-black text-sky-400">{metrics.inProgress}</span>
          </div>
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-center shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{isAr ? "بانتظار التقرير" : "Pending Report"}</span>
            <span className="text-base font-black text-purple-400">{metrics.pendingReport}</span>
          </div>
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-center shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{isAr ? "نتائج حرجة" : "Critical Findings"}</span>
            <span className="text-base font-black text-red-500 animate-bounce">{metrics.criticalFindings}</span>
          </div>
        </div>
      </div>

      {/* Primary Subsystem Navigation Bar */}
      <div className="bg-slate-950/80 border-b border-slate-800 px-6 flex items-center overflow-x-auto no-scrollbar shrink-0">
        <div className="flex gap-2 min-w-max py-2">
          {centerTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCenterMode(tab.id as RadiologyCenterMode)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all relative ${
                activeCenterMode === tab.id 
                  ? "bg-sky-600 text-white shadow-lg shadow-sky-900/50" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{isAr ? tab.ar : tab.en}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <AnimatePresence mode="wait">
          
          {/* 1. RADIOLOGY COMMAND CENTER */}
          {activeCenterMode === "command_center" && (
            <motion.div key="command_center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 max-w-7xl mx-auto">
              
              {/* Executive Operational KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { titleAr: "إجمالي فحوصات اليوم", titleEn: "Total Exam Volume", val: metrics.totalExams, trend: "+14%", icon: Scan, color: "sky" },
                  { titleAr: "معدل الالتزام باتفاقية SLA", titleEn: "SLA Compliance", val: "98.4%", trend: "Target 95%", icon: ShieldCheck, color: "emerald" },
                  { titleAr: "متوسط وقت التسليم TAT", titleEn: "Avg Turnaround Time", val: "22 mins", trend: "STAT <15m", icon: Clock, color: "indigo" },
                  { titleAr: "تشغيل الأجهزة والأطقم", titleEn: "Equipment Utilization", val: "94.2%", trend: "11/12 Online", icon: Cpu, color: "amber" },
                ].map((kpi, i) => (
                  <div key={i} className="bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow-lg flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-sky-400">
                        <kpi.icon size={22} />
                      </div>
                      <span className="text-[10px] font-black px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-md border border-emerald-500/30">
                        {kpi.trend}
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? kpi.titleAr : kpi.titleEn}</p>
                      <h3 className="text-3xl font-black text-white mt-1">{kpi.val}</h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Department Filters */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="text-xs font-black text-slate-400 px-3 flex items-center gap-1">
                  <Filter size={14} /> {isAr ? "تصفية بالقسم:" : "Filter Dept:"}
                </span>
                {["ALL", "Emergency", "ICU", "OR", "Inpatient", "Outpatient"].map(dept => (
                  <button
                    key={dept}
                    onClick={() => setDeptFilter(dept)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      deptFilter === dept 
                        ? "bg-sky-600 text-white" 
                        : "bg-slate-900 text-slate-400 hover:text-white"
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>

              {/* Department Work Queues Table */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-5 h-5 text-sky-400" />
                    {isAr ? "جدول أعمال القسم وحالات التصوير النشطة" : "Active Radiology Work Queue & Accessions"}
                  </h2>
                  <div className="relative w-72">
                    <Search className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 text-slate-500 ${isAr ? "right-3" : "left-3"}`} />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={isAr ? "بحث بالاسم، Accession #..." : "Search by Patient, Accession #..."}
                      className={`w-full py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-sky-500 ${isAr ? "pr-9 pl-3" : "pl-9 pr-3"}`}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900/80 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-3.5 px-6">{isAr ? "Accession / Order" : "Accession / Order"}</th>
                        <th className="py-3.5 px-6">{isAr ? "المريض / القسم" : "Patient / Department"}</th>
                        <th className="py-3.5 px-6">{isAr ? "نوع الفحص والتصوير" : "Study & Modality"}</th>
                        <th className="py-3.5 px-6">{isAr ? "الأولوية" : "Priority"}</th>
                        <th className="py-3.5 px-6">{isAr ? "الحالة التشغيلية" : "Status"}</th>
                        <th className="py-3.5 px-6 text-center">{isAr ? "إجراءات التحكم" : "Actions"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-xs">
                      {filteredTasks.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="py-4 px-6 whitespace-nowrap">
                            <div className="font-mono font-black text-sky-400">{t.accessionNumber}</div>
                            <div className="text-[10px] font-bold text-slate-500 mt-0.5">{t.orderTime}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-black text-white text-sm">{isAr ? t.patientNameAr : t.patientNameEn}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <GlobalEntityLink entityType="patient" entityId={t.patientId} entityName={t.mrn} className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800" />
                              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-sky-950 text-sky-300 rounded border border-sky-800">
                                {t.department}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-bold text-slate-200">{t.studyName}</div>
                            <div className="text-[10px] font-bold text-slate-500 mt-0.5 flex items-center gap-1">
                              <span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 font-mono rounded">{t.modality}</span>
                              <span>• {t.bodyPart}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                              t.priority === 'STAT' ? 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse' :
                              t.priority === 'High' ? 'bg-orange-950 text-orange-300 border-orange-800' :
                              'bg-slate-800 text-slate-300 border-slate-700'
                            }`}>
                              {t.priority}
                            </span>
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${
                              t.status === 'Approved & EHR Released' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                              t.status === 'In-Progress Imaging' ? 'bg-sky-950 text-sky-300 border-sky-800' :
                              t.status === 'PACS Uploaded (Pending Report)' ? 'bg-purple-950 text-purple-300 border-purple-800' :
                              'bg-amber-950 text-amber-300 border-amber-800'
                            }`}>
                              {t.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedTask(t);
                                  setActiveCenterMode("pacs_viewer");
                                }}
                                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-md"
                              >
                                <Focus size={14} />
                                <span>{isAr ? "معاين PACS" : "Open PACS"}</span>
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedTask(t);
                                  setReportFindings(t.findings || "");
                                  setReportImpression(t.impression || "");
                                  setActiveCenterMode("radiologist_workspace");
                                }}
                                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-md"
                              >
                                <FileText size={14} />
                                <span>{isAr ? "التقرير" : "Report"}</span>
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedTask(t);
                                  setShowCrossNavModal(true);
                                }}
                                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold text-xs flex items-center gap-1"
                              >
                                <ExternalLink size={14} />
                                <span>{isAr ? "360°" : "360°"}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. SCHEDULING & APPOINTMENT CENTER */}
          {activeCenterMode === "scheduling" && (
            <motion.div key="scheduling" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                  <div>
                    <h2 className="text-lg font-black text-white uppercase flex items-center gap-2">
                      <Calendar className="text-sky-400" />
                      {isAr ? "جدولة المواعيد وإدارة موارد الأجهزة والمحطات" : "Radiology Resource Planning & Machine Schedule"}
                    </h2>
                    <p className="text-xs font-bold text-slate-400 mt-1">
                      {isAr ? "جدولة الفحوصات اليومية والأسبوعية، توزيع غرف التصوير والعمليات الطارئة" : "Manage daily machine slots, emergency reservations, walk-ins & waiting lists"}
                    </p>
                  </div>
                  <button onClick={() => toast.info(isAr ? "حجز خانة زمنية جديدة للفحص..." : "Booking new exam slot...")} className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg">
                    <Plus size={16} />
                    <span>{isAr ? "حجز فحص أشعة" : "Book Radiology Slot"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {modalities.map((m, idx) => (
                    <div key={m.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-sky-500/50 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-mono text-xs font-black text-sky-400">{m.id} Suite 0{idx+1}</span>
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold text-[10px] rounded border border-emerald-500/30">ONLINE READY</span>
                      </div>
                      <h4 className="font-bold text-white text-sm">{isAr ? m.labelAr : m.labelEn}</h4>
                      <div className="mt-3 flex justify-between text-xs text-slate-400 font-bold">
                        <span>{isAr ? "المواعيد اليومية" : "Daily Bookings"}: 14/18</span>
                        <span className="text-emerald-400 font-mono">77% Cap</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                        <div className="bg-sky-500 h-full w-[77%]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. MODALITY WORK CENTERS */}
          {activeCenterMode === "modality_centers" && (
            <motion.div key="modality_centers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto">
              
              {/* Modality Selector Bar */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                {modalities.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setActiveModalityCenter(m.id as ModalitySubCenter)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                      activeModalityCenter === m.id
                        ? "bg-sky-600 text-white shadow-lg shadow-sky-900/40"
                        : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {isAr ? m.labelAr : m.labelEn}
                  </button>
                ))}
              </div>

              {/* Dedicated Modality Workspace Panel */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-6 flex-wrap gap-4">
                  <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                      <Cpu className="text-sky-400" />
                      {isAr ? `مركز أعمال ${activeModalityCenter} المستقل` : `Dedicated ${activeModalityCenter} Operations Workspace`}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 mt-1">
                      {isAr ? "بروتوكولات التصوير المخصصة، التباين، والجرعات الشعاعية الخاصة بهذا الجهاز" : "Specialized imaging protocols, contrast prep & dose control for this modality"}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold rounded-lg border border-emerald-500/30">
                    Scanner Status: ACTIVE READY
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                    <h4 className="font-black text-sky-400 text-sm mb-3 uppercase">{isAr ? "قائمة الانتظار المباشرة للجهاز" : "Modality Queue"}</h4>
                    <ul className="space-y-3 text-xs">
                      {radiologyTasks.filter(t => t.modality === activeModalityCenter || activeModalityCenter === "CT").map(t => (
                        <li key={t.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                          <div className="font-bold text-white">{isAr ? t.patientNameAr : t.patientNameEn}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{t.studyName}</div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                    <h4 className="font-black text-amber-400 text-sm mb-3 uppercase">{isAr ? "بروتوكول التصوير والجرعة" : "Imaging Protocol & Dose"}</h4>
                    <p className="text-xs text-slate-300 font-bold mb-4">
                      {isAr ? "بروتوكول مفعل: Brain CT Angio Non-Contrast + Contrast 3D Reconstruction" : "Active Protocol: Brain CT Angio Non-Contrast + Contrast 3D Reconstruction"}
                    </p>
                    <div className="space-y-2 text-xs font-mono text-slate-400">
                      <div>CTDIvol Target: <strong className="text-white">42.5 mGy</strong></div>
                      <div>DLP Limit: <strong className="text-white">750 mGy.cm</strong></div>
                      <div>Contrast Volume: <strong className="text-white">80 mL Omnipaque 350</strong></div>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                    <h4 className="font-black text-emerald-400 text-sm mb-3 uppercase">{isAr ? "فحوصات السلامة والأمان" : "Safety Verification"}</h4>
                    <ul className="space-y-2 text-xs font-bold text-slate-300">
                      <li className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle size={14} /> {isAr ? "فحص الوظائف الكلوية eGFR > 60" : "Renal Function Checked"}
                      </li>
                      <li className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle size={14} /> {isAr ? "التحقق من عدم وجود حمل" : "Pregnancy Negative"}
                      </li>
                      <li className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle size={14} /> {isAr ? "فحص المعادن والغرسات (Implant Check)" : "Ferromagnetic Check Complete"}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 4. TECHNICIAN WORKSPACE */}
          {activeCenterMode === "technician_workspace" && (
            <motion.div key="technician_workspace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-6">
                  <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                      <Camera className="text-sky-400" />
                      {isAr ? "مساحة عمل فني الأشعة (Technician Operations)" : "Technician Workstation & Imaging Execution"}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 mt-1">
                      {isAr ? "إدارة وصول المريض، فحص السلامة، تجهيز المادة المتباينة، والرفع المباشر إلى PACS" : "Patient arrival check-in, safety verification, contrast administration & PACS transfer"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Tech Queue */}
                  <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
                    <h4 className="font-black text-white text-xs uppercase mb-2">{isAr ? "مرضى غرف الانتظار" : "Waiting Patients Queue"}</h4>
                    {radiologyTasks.map(t => (
                      <div 
                        key={t.id} 
                        onClick={() => setSelectedTask(t)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          selectedTask?.id === t.id ? "bg-sky-950 border-sky-500 text-white" : "bg-slate-950 border-slate-800 text-slate-300"
                        }`}
                      >
                        <div className="font-mono text-xs text-sky-400 font-black">{t.accessionNumber}</div>
                        <div className="font-bold text-xs mt-1">{isAr ? t.patientNameAr : t.patientNameEn}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{t.studyName}</div>
                      </div>
                    ))}
                  </div>

                  {/* Middle & Right: Tech Checklist & Actions */}
                  <div className="lg:col-span-2 bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-5">
                    {selectedTask ? (
                      <>
                        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                          <div>
                            <span className="text-[10px] font-mono text-sky-400 font-bold block">{selectedTask.accessionNumber}</span>
                            <h4 className="text-base font-black text-white">{isAr ? selectedTask.patientNameAr : selectedTask.patientNameEn}</h4>
                          </div>
                          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-lg border border-amber-500/30">
                            {selectedTask.status}
                          </span>
                        </div>

                        <div className="space-y-3 text-xs">
                          <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                            <input type="checkbox" checked={techPrepDone} onChange={(e) => setTechPrepDone(e.target.checked)} className="w-4 h-4 text-sky-500 rounded" />
                            <div>
                              <span className="font-bold text-white block">{isAr ? "التحقق من هوية المريض والموافقات الطبية" : "Patient ID & Consent Verification"}</span>
                              <span className="text-[10px] text-slate-400">{isAr ? "مطابقة الباركود مع سوار المريض ورقم MRN" : "Barcode check with patient wristband & MRN"}</span>
                            </div>
                          </label>

                          <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                            <input type="checkbox" checked={techContrastInjected} onChange={(e) => setTechContrastInjected(e.target.checked)} className="w-4 h-4 text-sky-500 rounded" />
                            <div>
                              <span className="font-bold text-white block">{isAr ? "حقن مادة التباين والتأكد من الحساسية" : "Contrast Injected & Allergy Check"}</span>
                              <span className="text-[10px] text-slate-400">{isAr ? "eGFR: 88 mL/min (آمن للحقن الوريدي)" : "eGFR checked & contrast lot verified"}</span>
                            </div>
                          </label>

                          <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                            <input type="checkbox" checked={techQualityApproved} onChange={(e) => setTechQualityApproved(e.target.checked)} className="w-4 h-4 text-sky-500 rounded" />
                            <div>
                              <span className="font-bold text-white block">{isAr ? "اعتماد جودة الصور الخالية من التشوه (Artifact-Free)" : "DICOM Image Quality Check"}</span>
                              <span className="text-[10px] text-slate-400">{isAr ? "مطابقة دقة المقاطع مع البروتوكول" : "320 DICOM slices acquired cleanly"}</span>
                            </div>
                          </label>
                        </div>

                        <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                          <button 
                            onClick={() => {
                              setRadiologyTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: "PACS Uploaded (Pending Report)", technicianName: currentUser?.name || "Tech. Faisal Al-Harbi" } : t));
                              toast.success(isAr ? "تم إرسال الصور بنجاح إلى سيرفر PACS للتشخيص!" : "Images uploaded to PACS router successfully!");
                            }}
                            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
                          >
                            <Send size={16} />
                            <span>{isAr ? "رفع إلى سيرفر PACS واستدعاء الاستشاري" : "Transfer to PACS Server"}</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="py-20 text-center text-slate-500">{isAr ? "اختر فحصاً لبدء خطوات التنفيذ للفني" : "Select an accession to view tech controls"}</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 5. RADIOLOGIST WORKSPACE */}
          {activeCenterMode === "radiologist_workspace" && (
            <motion.div key="radiologist_workspace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left: Reading Worklist */}
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                  <h3 className="text-sm font-black text-white uppercase mb-4 flex items-center gap-2">
                    <ListTodo className="text-sky-400" />
                    {isAr ? "قائمة قراءة واستعراض الاستشاري" : "Radiologist Reading List"}
                  </h3>
                  <div className="space-y-3">
                    {radiologyTasks.map(t => (
                      <div 
                        key={t.id} 
                        onClick={() => {
                          setSelectedTask(t);
                          setReportFindings(t.findings || "");
                          setReportImpression(t.impression || "");
                        }}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          selectedTask?.id === t.id ? "bg-sky-950 border-sky-500 text-white" : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-mono text-xs font-black text-sky-400">{t.accessionNumber}</span>
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${t.priority === 'STAT' ? 'bg-rose-950 text-rose-400' : 'bg-slate-800 text-slate-400'}`}>
                            {t.priority}
                          </span>
                        </div>
                        <div className="font-bold text-white text-xs mt-1">{isAr ? t.patientNameAr : t.patientNameEn}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{t.studyName}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Structured Diagnostic Report Editor */}
                <div className="lg:col-span-2 bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-4 flex-wrap gap-2">
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <FileText className="text-purple-400" />
                        {isAr ? "محرر التقارير الطبية المهيكلة والتملية الصوتية" : "Structured Radiology Reporting & Voice Dictation"}
                      </h3>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={handleDictation}
                          disabled={isDictating}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                            isDictating ? "bg-rose-600 text-white animate-pulse" : "bg-purple-600 hover:bg-purple-500 text-white"
                          }`}
                        >
                          <Mic size={14} />
                          <span>{isDictating ? (isAr ? "جاري الاستماع..." : "Listening...") : (isAr ? "تملية صوتية" : "Voice Dictate")}</span>
                        </button>
                      </div>
                    </div>

                    {selectedTask ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono">
                          <div>Patient: <strong className="text-white">{isAr ? selectedTask.patientNameAr : selectedTask.patientNameEn}</strong></div>
                          <div>Indication: <strong className="text-sky-300">{selectedTask.clinicalIndication}</strong></div>
                        </div>

                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase block mb-1">
                            {isAr ? "النتائج التفصيلية (Findings)" : "Detailed Findings"}
                          </label>
                          <textarea
                            rows={4}
                            value={reportFindings}
                            onChange={(e) => setReportFindings(e.target.value)}
                            placeholder={isAr ? "اكتب النتائج التفصيلية للفحص والأبعاد..." : "Type detailed imaging findings..."}
                            className="w-full p-3 bg-slate-950 border border-slate-800 text-white text-xs font-mono rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase block mb-1">
                            {isAr ? "الخلاصة والتشخيص النهائي (Impression)" : "Diagnostic Impression"}
                          </label>
                          <textarea
                            rows={3}
                            value={reportImpression}
                            onChange={(e) => setReportImpression(e.target.value)}
                            placeholder={isAr ? "اكتب الانطباع والتشخيص النهائي..." : "Type clinical impression..."}
                            className="w-full p-3 bg-slate-950 border border-slate-800 text-white text-xs font-mono rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                          <input 
                            type="checkbox" 
                            id="crit_alert"
                            checked={isCriticalAlert}
                            onChange={(e) => setIsCriticalAlert(e.target.checked)}
                            className="w-4 h-4 text-rose-600 rounded"
                          />
                          <label htmlFor="crit_alert" className="text-xs font-bold text-rose-400 cursor-pointer">
                            {isAr ? "إشعار نتيجة حرجة طارئة إلى طبيب الطوارئ / التنويم (Critical Finding Flag)" : "Flag as Critical Finding (Alert Treating Physician Immediately)"}
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="py-20 text-center text-slate-500">
                        {isAr ? "اختر فحصاً من القائمة الجانبية لبدء كتابة التقرير" : "Select a study from the list to start reporting"}
                      </div>
                    )}
                  </div>

                  {selectedTask && (
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
                      <button 
                        onClick={handleApproveReport}
                        className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-2"
                      >
                        <FileCheck size={16} />
                        <span>{isAr ? "توقيع التقرير إلكترونياً واعتماده في EHR" : "Electronically Sign & Release to EHR"}</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          )}

          {/* 6. PACS INTELLIGENCE VIEWER */}
          {activeCenterMode === "pacs_viewer" && (
            <motion.div key="pacs_viewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 max-w-7xl mx-auto">
              
              {/* PACS Control Bar */}
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-sky-400 px-3 py-1 bg-sky-950 rounded border border-sky-800">
                    PACS VIEWER 3D
                  </span>
                  <span className="text-xs font-bold text-slate-300">
                    {selectedTask ? selectedTask.studyName : "CT Brain Multiplanar Reconstruction"}
                  </span>
                </div>

                {/* DICOM Tools */}
                <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  {[
                    { id: "wl", label: "W/L Window", icon: Sliders },
                    { id: "pan", label: "Pan", icon: MousePointer2 },
                    { id: "zoom", label: "Zoom", icon: ZoomIn },
                    { id: "measure", label: "Measure", icon: Compass },
                    { id: "mpr", label: "MPR 3D", icon: Layers3 },
                    { id: "vr", label: "Volume Render", icon: Focus },
                    { id: "ai", label: "AI CAD Lesion", icon: Sparkles },
                  ].map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => setPacsTool(tool.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        pacsTool === tool.id ? "bg-sky-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <tool.icon size={14} />
                      <span className="hidden sm:inline">{tool.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => setDicomZoom(prev => Math.min(prev + 20, 200))} className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg">
                    <ZoomIn size={16} />
                  </button>
                  <span className="text-xs font-mono font-bold text-slate-400">{dicomZoom}%</span>
                </div>
              </div>

              {/* Viewport Simulation (Multi-Monitor Viewport) */}
              <div className="bg-black border border-slate-800 rounded-2xl h-[520px] relative overflow-hidden flex items-center justify-center shadow-2xl">
                
                {/* Simulated DICOM Image Display */}
                <div className="absolute inset-0 flex items-center justify-center opacity-80">
                  <div className="w-80 h-80 rounded-full border-4 border-slate-700/40 flex items-center justify-center relative animate-pulse">
                    <div className="w-60 h-60 rounded-full border-2 border-sky-500/30 flex items-center justify-center">
                      <Crosshair className="w-12 h-12 text-sky-400/50" />
                    </div>
                    {/* Simulated AI Lesion Bounding Box */}
                    {pacsTool === "ai" && (
                      <div className="absolute top-20 right-20 border-2 border-rose-500 bg-rose-500/10 p-2 rounded text-[10px] font-mono font-black text-rose-400 animate-pulse">
                        AI DETECTED LESION: 1.4cm (Conf: 96%)
                      </div>
                    )}
                  </div>
                </div>

                {/* DICOM Overlays */}
                <div className="absolute top-4 left-4 font-mono text-[11px] text-emerald-400 space-y-1 bg-black/60 p-2 rounded backdrop-blur-xs">
                  <div>PATIENT: {selectedTask ? (isAr ? selectedTask.patientNameAr : selectedTask.patientNameEn) : "Ahmad Al-Qahtani"}</div>
                  <div>MRN: {selectedTask?.mrn || "MRN-2026-0811"}</div>
                  <div>MODALITY: CT Head | 120kV 250mA</div>
                </div>

                <div className="absolute top-4 right-4 font-mono text-[11px] text-emerald-400 text-right space-y-1 bg-black/60 p-2 rounded backdrop-blur-xs">
                  <div>ACCESSION: {selectedTask?.accessionNumber || "ACC-2026-9901"}</div>
                  <div>WL: 40 WW: 80 (Brain Window)</div>
                  <div>SLICE: 45 / 320</div>
                </div>

                <div className="absolute bottom-4 left-4 font-mono text-[11px] text-sky-400 bg-black/60 p-2 rounded backdrop-blur-xs">
                  ZOOM: {dicomZoom}% | TOOL: {pacsTool.toUpperCase()}
                </div>
              </div>
            </motion.div>
          )}

          {/* 7. CONTRAST MANAGEMENT */}
          {activeCenterMode === "contrast_management" && (
            <motion.div key="contrast_management" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-black text-white uppercase flex items-center gap-2 mb-4">
                  <Droplets className="text-sky-400" />
                  {isAr ? "مركز إدارة ومخزون مواد التباين الشعاعية" : "Contrast Media Management & Adverse Reaction Log"}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {[
                    { name: "Omnipaque 350 (Iohexol)", stock: "142 Vials", lot: "LOT-881029", expiry: "2027-11-30" },
                    { name: "Visipaque 320 (Iodixanol)", stock: "88 Vials", lot: "LOT-992011", expiry: "2027-08-15" },
                    { name: "Gadovist 1.0 (Gadobutrol)", stock: "54 Vials", lot: "LOT-441092", expiry: "2028-02-28" },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <div className="font-bold text-white text-sm">{item.name}</div>
                      <div className="text-xs text-sky-400 font-mono mt-1 font-black">{item.stock} Available</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-2">Lot: {item.lot} | Exp: {item.expiry}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 8. RADIATION SAFETY */}
          {activeCenterMode === "radiation_safety" && (
            <motion.div key="radiation_safety" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-black text-white uppercase flex items-center gap-2 mb-4">
                  <ShieldAlert className="text-rose-400" />
                  {isAr ? "سجل السلامة والجرعات الشعاعية (Radiation Dose Tracking)" : "Radiation Safety Ledger & Dose Tracking"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <h4 className="font-black text-sky-400 text-xs uppercase mb-3">{isAr ? "مؤشرات ALARA المعتمدة" : "ALARA Safety Metrics"}</h4>
                    <p className="text-xs text-slate-300 font-bold mb-2">CTDIvol Threshold Compliance: 99.1%</p>
                    <p className="text-xs text-slate-400 font-mono">Pediatric dose reduction protocol enabled by default for patients under 18 years.</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <h4 className="font-black text-emerald-400 text-xs uppercase mb-3">{isAr ? "السجل التراكمي للمريض" : "Patient Cumulative Lifetime Dose"}</h4>
                    <p className="text-xs text-slate-300 font-bold mb-2">Average Lifetime Exposure: 14.2 mSv</p>
                    <p className="text-xs text-slate-400 font-mono">Automatic warnings generated if annual exposure exceeds 20 mSv.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 9. EQUIPMENT MANAGEMENT */}
          {activeCenterMode === "equipment_management" && (
            <motion.div key="equipment_management" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-black text-white uppercase flex items-center gap-2 mb-4">
                  <Wrench className="text-amber-400" />
                  {isAr ? "إدارة حالة الأجهزة والصيانة الوقائية" : "Equipment Downtime & Maintenance Monitoring"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: "CT Scanner 64-Slice GE", status: "ONLINE", calib: "Passed Today", uptime: "99.8%" },
                    { name: "MRI 3 Tesla Siemens", status: "ONLINE", calib: "Passed Today", uptime: "98.5%" },
                    { name: "DR X-Ray Room 2 Canon", status: "MAINTENANCE", calib: "Scheduled 14:00", uptime: "94.0%" },
                  ].map((eq, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-white text-sm">{eq.name}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded ${eq.status === 'ONLINE' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'}`}>{eq.status}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-2 font-mono">Calibration: {eq.calib}</div>
                      <div className="text-xs text-sky-400 font-bold mt-1 font-mono">Uptime: {eq.uptime}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 10. REPORTING CENTER */}
          {activeCenterMode === "reporting_center" && (
            <motion.div key="reporting_center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-black text-white uppercase flex items-center gap-2 mb-4">
                  <FileText className="text-purple-400" />
                  {isAr ? "مركز التقارير التشخيصية المعتمدة" : "Diagnostic Radiology Reporting Center"}
                </h3>
                <div className="space-y-3">
                  {radiologyTasks.map(t => (
                    <div key={t.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="font-mono text-xs font-black text-sky-400">{t.accessionNumber} - {t.studyName}</div>
                        <div className="font-bold text-white text-sm mt-0.5">{isAr ? t.patientNameAr : t.patientNameEn}</div>
                        <div className="text-xs text-slate-400 mt-1">{t.findings || "Report pending radiologist approval..."}</div>
                      </div>
                      <span className="px-3 py-1 bg-purple-950 text-purple-300 text-xs font-bold rounded-lg border border-purple-800 shrink-0">
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 11. SMART TASK ENGINE */}
          {activeCenterMode === "smart_tasks" && (
            <motion.div key="smart_tasks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                  <h3 className="text-xl font-black text-white uppercase flex items-center gap-2">
                    <CheckSquare className="text-sky-400" />
                    {isAr ? "محرك المهام الذكي حسب الدور الوظيفي" : "Smart Role-Based Task Engine"}
                  </h3>
                  <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
                    {["technician", "radiologist", "manager"].map(role => (
                      <button
                        key={role}
                        onClick={() => setTaskRoleFilter(role as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                          taskRoleFilter === role ? "bg-sky-600 text-white" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <h4 className="font-black text-rose-400 text-xs uppercase mb-3">{isAr ? "مهام عالية الأولوية STAT" : "High Priority Tasks"}</h4>
                    <ul className="space-y-2 text-xs font-bold text-slate-300">
                      <li className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                        <span>Stat Brain CT Pending Report</span>
                        <span className="text-rose-400 font-mono">10m ago</span>
                      </li>
                      <li className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                        <span>Emergency Ultrasound Required Bed 02</span>
                        <span className="text-rose-400 font-mono">18m ago</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <h4 className="font-black text-sky-400 text-xs uppercase mb-3">{isAr ? "مهام المتابعة الدورية" : "Routine Tasks"}</h4>
                    <ul className="space-y-2 text-xs font-bold text-slate-300">
                      <li className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                        <span>Calibrate DR X-Ray Room 2</span>
                        <span className="text-sky-400 font-mono">Due 15:00</span>
                      </li>
                      <li className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                        <span>Review Mammography Peer Audits</span>
                        <span className="text-sky-400 font-mono">Due Today</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 12. ENTERPRISE INTEGRATION 360 */}
          {activeCenterMode === "enterprise_integration" && (
            <motion.div key="enterprise_integration" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-black text-white uppercase flex items-center gap-2 mb-4">
                  <Layers className="text-emerald-400" />
                  {isAr ? "شاشة الربط والتكامل المؤسسي الشامل 360°" : "Enterprise System Integration & HL7/FHIR Engine"}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    { sys: "CPOE Doctor Orders", status: "CONNECTED", ping: "2ms" },
                    { sys: "EHR Medical Record", status: "CONNECTED", ping: "4ms" },
                    { sys: "LIS Lab Results (eGFR)", status: "CONNECTED", ping: "3ms" },
                    { sys: "Pharmacy Contrast Stock", status: "CONNECTED", ping: "5ms" },
                    { sys: "OR Surgery Suite", status: "CONNECTED", ping: "1ms" },
                    { sys: "Emergency ER Router", status: "CONNECTED", ping: "2ms" },
                    { sys: "ICU Monitor Feeds", status: "CONNECTED", ping: "6ms" },
                    { sys: "Patient Portal PACS", status: "CONNECTED", ping: "8ms" },
                  ].map((s, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <div className="font-bold text-white text-xs">{s.sys}</div>
                      <div className="flex justify-between items-center mt-2 text-[10px] font-mono">
                        <span className="text-emerald-400 font-black">{s.status}</span>
                        <span className="text-slate-400">{s.ping}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* CROSS NAVIGATION 360 MODAL */}
      <AnimatePresence>
        {showCrossNavModal && selectedTask && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              
              <div className="bg-slate-900 p-5 border-b border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono font-black text-sky-400 block">{selectedTask.accessionNumber}</span>
                  <h3 className="text-lg font-black text-white">{isAr ? selectedTask.patientNameAr : selectedTask.patientNameEn}</h3>
                </div>
                <button onClick={() => setShowCrossNavModal(false)} className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg">
                  <X size={18} />
                </button>
              </div>

              {/* Cross Nav Sub-Tabs */}
              <div className="bg-slate-900/60 border-b border-slate-800 px-4 flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
                {[
                  { id: "patient", label: "Patient EHR" },
                  { id: "encounter", label: "Encounter" },
                  { id: "orders", label: "CPOE Orders" },
                  { id: "lab", label: "LIS Lab Results" },
                  { id: "meds", label: "Medications" },
                  { id: "history", label: "Prior Rad History" },
                  { id: "billing", label: "Billing & Claims" },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setCrossNavTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      crossNavTab === tab.id ? "bg-sky-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar space-y-4 text-xs">
                {crossNavTab === "patient" && (
                  <div className="space-y-2 font-mono">
                    <p>MRN: <strong>{selectedTask.mrn}</strong></p>
                    <p>Age/Gender: <strong>{selectedTask.age} Y / {selectedTask.gender}</strong></p>
                    <p>Department: <strong>{selectedTask.department} ({selectedTask.ward})</strong></p>
                    <p>Allergies: <strong className="text-rose-400">{selectedTask.allergies?.join(", ") || "None Known"}</strong></p>
                  </div>
                )}

                {crossNavTab === "lab" && (
                  <div className="space-y-2 font-mono">
                    <p>Serum Creatinine: <strong>{selectedTask.renalFunction?.serumCr || 0.9} mg/dL</strong></p>
                    <p>eGFR: <strong className="text-emerald-400">{selectedTask.renalFunction?.egfr || 88} mL/min/1.73m²</strong></p>
                    <p>Renal Impairment: <strong>{selectedTask.renalFunction?.isImpaired ? "YES - Caution Contrast" : "NO - Normal"}</strong></p>
                  </div>
                )}

                {crossNavTab === "orders" && (
                  <div className="space-y-2 font-mono">
                    <p>Ordering Doctor: <strong>{selectedTask.orderingDoctor}</strong></p>
                    <p>Clinical Indication: <strong className="text-sky-300">{selectedTask.clinicalIndication}</strong></p>
                    <p>CPOE Order ID: <strong>{selectedTask.cpoeOrderId}</strong></p>
                  </div>
                )}

                {["encounter", "meds", "history", "billing"].includes(crossNavTab) && (
                  <div className="py-8 text-center text-slate-400 font-bold">
                    Connected live to Enterprise {crossNavTab.toUpperCase()} database ledger.
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
