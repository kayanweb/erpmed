import React, { useState, useMemo, useEffect } from "react";
import { 
  HardDrive, Search, Filter, Clock, CheckCircle2, AlertTriangle, 
  Cpu, Eye, FileText, Send, User, Camera, Box, Layers, Plus,
  ShieldCheck, PhoneCall, Zap, Droplets, Calendar, RefreshCw,
  QrCode, Disc, Printer, Sliders, Shield, Users, BarChart3,
  Activity, Check, ArrowRight, Settings, Tag, FileCheck, Play,
  DownloadCloud, Inbox, Building2, Stethoscope
} from "lucide-react";
import { useHIS } from "../context/HISContext";
import { safeFormatDate } from "../lib/dateUtils";
import { toast } from "sonner";

// Radiology Types & Mock Data
import { 
  RadiologyStudy, 
  RadiologyReport, 
  CriticalAlertRecord, 
  EquipmentModality, 
  QualityAnalysisRecord, 
  ContrastInventoryItem, 
  RadiologyConsumable, 
  RadiologyStaffShift, 
  AuditLogEntry,
  ModalityType
} from "../types/radiology";



// Radiology Modular Popups
import { PacsViewerModal } from "./radiology/PacsViewerModal";
import { StructuredReportEditor } from "./radiology/StructuredReportEditor";
import { CriticalFindingsModal } from "./radiology/CriticalFindingsModal";
import { DoseAndContrastTracker } from "./radiology/DoseAndContrastTracker";
import { PatientPrepModal } from "./radiology/PatientPrepModal";
import { DistributionModal } from "./radiology/DistributionModal";
import { PrintableReportView } from "./radiology/PrintableReportView";
import { RadiologyOrderModal } from "./radiology/RadiologyOrderModal";

interface Props {
  language: "ar" | "en";
}

export default function RISDashboard({ language }: Props) {
  const isAr = language === "ar";
  const { cpoeOrders, addCharge, currentUser, getSetting, saveSetting } = useHIS();

  // Persistent Primary States
  const [studies, setStudies] = useState<RadiologyStudy[]>([]);
  const [reports, setReports] = useState<RadiologyReport[]>([]);
  const [criticalAlerts, setCriticalAlerts] = useState<CriticalAlertRecord[]>([]);
  const [equipmentList, setEquipmentList] = useState<EquipmentModality[]>([]);
  const [contrastCatalog, setContrastCatalog] = useState<ContrastInventoryItem[]>([]);
  const [consumables, setConsumables] = useState<RadiologyConsumable[]>([]);
  const [staffShifts, setStaffShifts] = useState<RadiologyStaffShift[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // Load from local storage or cloud settings if available
  useEffect(() => {
    getSetting("his_ris_studies").then(saved => { if (saved && Array.isArray(saved)) setStudies(saved); });
    getSetting("his_ris_reports").then(saved => { if (saved && Array.isArray(saved)) setReports(saved); });
    getSetting("his_ris_critical_alerts").then(saved => { if (saved && Array.isArray(saved)) setCriticalAlerts(saved); });
  }, [getSetting]);

  // Sync state changes
  const updateStudies = (newStudies: RadiologyStudy[]) => {
    setStudies(newStudies);
    saveSetting("his_ris_studies", newStudies);
  };

  const updateReports = (newReports: RadiologyReport[]) => {
    setReports(newReports);
    saveSetting("his_ris_reports", newReports);
  };

  const updateCriticalAlerts = (newAlerts: CriticalAlertRecord[]) => {
    setCriticalAlerts(newAlerts);
    saveSetting("his_ris_critical_alerts", newAlerts);
  };

  // Primary Tab Navigation
  const [primaryTab, setPrimaryTab] = useState<
    | "dashboard"
    | "mwl"
    | "scheduling"
    | "prep"
    | "reporting"
    | "critical"
    | "dose"
    | "equipment"
    | "inventory"
    | "staff"
    | "analytics"
    | "audit"
  >("dashboard");

  // Filter & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModality, setSelectedModality] = useState<string>("ALL");
  const [selectedStudy, setSelectedStudy] = useState<RadiologyStudy | null>(studies[0] || null);

  // Active Modals & Pull Requests State
  const [activePacsStudy, setActivePacsStudy] = useState<RadiologyStudy | null>(null);
  const [activeReportStudy, setActiveReportStudy] = useState<RadiologyStudy | null>(null);
  const [activeCriticalStudy, setActiveCriticalStudy] = useState<RadiologyStudy | null>(null);
  const [activeDoseStudy, setActiveDoseStudy] = useState<RadiologyStudy | null>(null);
  const [activePrepStudy, setActivePrepStudy] = useState<RadiologyStudy | null>(null);
  const [activeDistributionStudy, setActiveDistributionStudy] = useState<RadiologyStudy | null>(null);
  const [activePrintReport, setActivePrintReport] = useState<RadiologyReport | null>(null);
  const [showPullRequestsModal, setShowPullRequestsModal] = useState(false);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<"ALL" | "ER" | "OPD" | "IPD" | "OR" | "ICU">("ALL");

  // Incoming Electronic Radiology Requests Queue from Hospital Departments
  const [incomingPullRequests, setIncomingPullRequests] = useState([
    {
      id: "REQ-RAD-2001",
      patientName: "خالد منصور القحطاني",
      patientId: "MRN-20012",
      mrn: "MRN-20012",
      department: "ER",
      departmentAr: "قسم الطوارئ (Emergency Dept)",
      departmentEn: "Emergency Dept (ER Trauma Bay)",
      doctorName: "د. عبد الله المالكي",
      modality: "CT",
      procedureName: "CT Brain Non-Contrast (STAT Trauma)",
      priority: "STAT",
      createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
      status: "Pending",
      notes: "Motor vehicle accident - Acute head injury & loss of consciousness"
    },
    {
      id: "REQ-RAD-2002",
      patientName: "نورة سعد الدوسري",
      patientId: "MRN-20045",
      mrn: "MRN-20045",
      department: "OPD",
      departmentAr: "عيادة العظام (Orthopedic Clinic 1)",
      departmentEn: "Orthopedic Clinic 1",
      doctorName: "د. فيصل العتيبي",
      modality: "XRAY",
      procedureName: "X-Ray Right Knee AP & Lateral",
      priority: "Routine",
      createdAt: new Date(Date.now() - 40 * 60000).toISOString(),
      status: "Pending",
      notes: "Chronic right knee pain and osteoarthritis evaluation"
    },
    {
      id: "REQ-RAD-2003",
      patientName: "سليمان حامد العلي",
      patientId: "MRN-20078",
      mrn: "MRN-20078",
      department: "IPD",
      departmentAr: "جناح الجراحة (Surgical Ward Room 208)",
      departmentEn: "Surgical Ward Room 208",
      doctorName: "د. ياسر الشمري",
      modality: "US",
      procedureName: "Ultrasound Abdomen & Pelvis",
      priority: "Urgent",
      createdAt: new Date(Date.now() - 50 * 60000).toISOString(),
      status: "Pending",
      notes: "Post-cholecystectomy right upper quadrant tenderness"
    },
    {
      id: "REQ-RAD-2004",
      patientName: "أمل سلطان الزهراني",
      patientId: "MRN-20090",
      mrn: "MRN-20090",
      department: "ICU",
      departmentAr: "العناية المركزة (ICU Bed 02)",
      departmentEn: "Intensive Care Unit (ICU Bed 02)",
      doctorName: "د. ريم الحربي",
      modality: "XRAY",
      procedureName: "Bedside Chest X-Ray (Portable STAT)",
      priority: "STAT",
      createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
      status: "Pending",
      notes: "Verify Endotracheal Tube (ETT) placement & rule out pneumothorax"
    },
    {
      id: "REQ-RAD-2005",
      patientName: "محمد علي الحارثي",
      patientId: "MRN-20033",
      mrn: "MRN-20033",
      department: "OR",
      departmentAr: "غرفة العمليات (OR Suite 4)",
      departmentEn: "Operating Theater (OR Suite 4)",
      doctorName: "د. طارق الغامدي",
      modality: "MRI",
      procedureName: "MRI Brain & Spine with Contrast",
      priority: "Urgent",
      createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
      status: "Pending",
      notes: "Pre-neurosurgical mapping for cerebral lesion"
    }
  ]);

  const handleClaimRadRequest = (req: any) => {
    // Update incoming requests queue status
    setIncomingPullRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: "In Progress" } : r));

    // Create claimed radiology study in active workqueue
    const claimedStudy: RadiologyStudy = {
      id: req.id,
      studyInstanceUid: `1.2.840.113619.2.55.3.283117283.${Date.now()}`,
      patientId: req.patientId,
      patientName: req.patientName,
      patientAge: 42,
      patientGender: "Male",
      mrn: req.mrn,
      modality: (req.modality === "XRAY" ? "X-RAY" : req.modality) as ModalityType,
      bodyPart: "General",
      procedureName: req.procedureName,
      priority: req.priority as any,
      status: "InProcedure",
      orderingDoctor: req.doctorName,
      orderingDepartment: req.departmentAr,
      orderDate: req.createdAt || new Date().toISOString(),
      scheduledTime: new Date().toISOString(),
      technicianName: currentUser?.nameEn || "Radiology Tech",
      radiologistName: "Unassigned Radiologist",
      clinicalIndication: req.notes || "Emergency Department Requisition",
      transportMode: "Ambulatory",
      prepCompleted: true,
      contrastRequired: false,
      consentSigned: true,
      seriesCount: 1,
      instanceCount: 24,
      sampleImages: [],
      billingAmount: 350,
      billingStatus: "Pending"
    };

    const updated = [claimedStudy, ...studies];
    updateStudies(updated);

    toast.success(isAr ? `تم استلام طلب الأشعة (${req.id}) بنجاح وتغيير حالته إلى: قيد التنفيذ (In Progress)` : `Radiology order ${req.id} claimed! Status updated to In Progress`);
  };

  // Metrics
  const pendingCount = studies.filter(s => s.status === "Ordered" || s.status === "Scheduled").length;
  const inProgressCount = studies.filter(s => s.status === "Prepped" || s.status === "CheckedIn" || s.status === "InProcedure").length;
  const completedCount = studies.filter(s => s.status === "Reported" || s.status === "Verified").length;
  const criticalCount = criticalAlerts.filter(a => a.status !== "Acknowledged").length;

  // Filtered Studies
  const filteredStudies = useMemo(() => {
    return studies.filter(s => {
      const matchSearch = s.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.procedureName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchModality = selectedModality === "ALL" || s.modality === selectedModality;
      return matchSearch && matchModality;
    });
  }, [studies, searchTerm, selectedModality]);

  // Handle Order Status Progression
  const handleAdvanceStatus = (studyId: string, nextStatus: RadiologyStudy["status"]) => {
    const updated = studies.map(s => {
      if (s.id === studyId) {
        const updatedStudy = { ...s, status: nextStatus };
        if (nextStatus === "CheckedIn") updatedStudy.checkInTime = new Date().toISOString();
        if (nextStatus === "InProcedure") updatedStudy.procedureStartTime = new Date().toISOString();
        if (nextStatus === "Completed") updatedStudy.procedureEndTime = new Date().toISOString();
        return updatedStudy;
      }
      return s;
    });
    updateStudies(updated);
    toast.success(isAr ? `تم تحديث حالة الفحص إلى: ${nextStatus}` : `Study status updated to ${nextStatus}`);
  };

  // Handle Save New Report
  const handleSaveReport = async (newReport: RadiologyReport) => {
    const updatedReports = [newReport, ...reports];
    updateReports(updatedReports);

    // Update study status
    const updatedStudies = studies.map(s => s.id === newReport.studyId ? { ...s, status: "Reported" as const, radiologistName: newReport.radiologistName } : s);
    updateStudies(updatedStudies);

    // Trigger HIS Billing
    await addCharge({
      patientId: newReport.patientId,
      patientName: newReport.patientName,
      serviceId: `RAD-${newReport.modality}`,
      serviceName: newReport.procedureName,
      category: "radiology",
      amount: newReport.modality === "CT" ? 850 : newReport.modality === "MRI" ? 1800 : 250,
      orderId: newReport.studyId,
      staffId: currentUser?.id || "RAD-CONSULTANT"
    });

    // Audit log
    const audit: AuditLogEntry = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || "RAD-01",
      userName: currentUser?.nameEn || "Dr. Mohamed Zaher",
      userRole: "Consultant Radiologist",
      action: "SIGN_REPORT",
      studyId: newReport.studyId,
      patientMrn: newReport.patientId,
      ipAddress: "192.168.1.100",
      details: `Digitally signed radiology report for ${newReport.procedureName}`
    };
    setAuditLogs([audit, ...auditLogs]);
  };

  // Handle Save Critical Alert
  const handleSaveCriticalAlert = (alert: CriticalAlertRecord) => {
    const updated = [alert, ...criticalAlerts.filter(a => a.id !== alert.id)];
    updateCriticalAlerts(updated);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans space-y-6" dir={isAr ? "rtl" : "ltr"}>
      {/* Top Banner & Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
            <HardDrive className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {isAr ? "نظام الأشعة وأرشفة الصور الطبية (RIS + PACS)" : "Radiology Information System (RIS & PACS)"}
              </h1>
              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-[10px] font-black uppercase tracking-wider">
                Enterprise Level
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 mt-1">
              {isAr ? "إدارة الفحوصات، الأجهزة، عارض PACS الشامل، والتقارير الطبية المعتمدة (HL7 / DICOM / JCI)" : "Integrated Modality Worklist, Zero-Footprint PACS Viewer & Structured Reporting"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setShowPullRequestsModal(true)}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-blue-200 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <DownloadCloud className="w-4 h-4" />
            {isAr ? "سحب الطلبات (Pull Requests)" : "Pull Requests"}
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">{isAr ? "الفحوصات المجدولة" : "Pending Studies"}</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{pendingCount}</span>
          </div>
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">{isAr ? "قيد التنفيذ بالأجهزة" : "In Procedure"}</span>
            <span className="text-2xl font-black text-blue-600 mt-1 block">{inProgressCount}</span>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">{isAr ? "التقارير المعتمدة" : "Completed Reports"}</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">{completedCount}</span>
          </div>
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-wider block">{isAr ? "النتائج الحرجة" : "Critical Alerts"}</span>
            <span className="text-2xl font-black text-rose-600 mt-1 block">{criticalCount}</span>
          </div>
          <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex bg-white rounded-2xl border border-slate-200 p-1.5 overflow-x-auto gap-1">
        {[
          { id: "dashboard", label: isAr ? "لوحة التحكم" : "Dashboard", icon: HardDrive },
          { id: "mwl", label: isAr ? "قائمة العمل (MWL)" : "Modality Worklist", icon: Layers },
          { id: "scheduling", label: isAr ? "جدولة المواعيد" : "Scheduling", icon: Calendar },
          { id: "prep", label: isAr ? "تجهيز المريض" : "Patient Prep", icon: FileCheck },
          { id: "reporting", label: isAr ? "كتابة التقارير" : "Reporting", icon: FileText },
          { id: "critical", label: isAr ? "النتائج الحرجة" : "Critical Findings", icon: AlertTriangle },
          { id: "dose", label: isAr ? "الجرعات والصبغة" : "Dose & Contrast", icon: Zap },
          { id: "equipment", label: isAr ? "الأجهزة والصيانة" : "Equipment", icon: Box },
          { id: "inventory", label: isAr ? "مخزون المستلزمات" : "Consumables", icon: Droplets },
          { id: "staff", label: isAr ? "الكادر والورديات" : "Staff Roster", icon: Users },
          { id: "analytics", label: isAr ? "الإحصائيات وKPIs" : "Analytics", icon: BarChart3 },
          { id: "audit", label: isAr ? "سجل Audit Logs" : "Audit Trail", icon: Shield }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = primaryTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setPrimaryTab(tab.id as any)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive 
                  ? "bg-slate-900 text-white shadow-md" 
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Tab Views */}
      {primaryTab === "dashboard" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Studies Worklist Table */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder={isAr ? "البحث برقم الملف، اسم المريض، أو الفحص..." : "Search MRN, patient name, or procedure..."}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto">
                {["ALL", "CT", "MRI", "X-RAY", "ULTRASOUND", "PET_CT"].map(m => (
                  <button 
                    key={m}
                    onClick={() => setSelectedModality(m)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                      selectedModality === m ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans">
                <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">{isAr ? "رقم الفحص (Accession)" : "Accession / Date"}</th>
                    <th className="px-6 py-4">{isAr ? "المريض" : "Patient Info"}</th>
                    <th className="px-6 py-4">{isAr ? "الفحص المطلوب" : "Procedure"}</th>
                    <th className="px-6 py-4">{isAr ? "الأولوية" : "Priority"}</th>
                    <th className="px-6 py-4">{isAr ? "الحالة" : "Status"}</th>
                    <th className="px-6 py-4 text-right">{isAr ? "الإجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredStudies.map(study => (
                    <tr 
                      key={study.id} 
                      onClick={() => setSelectedStudy(study)}
                      className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${selectedStudy?.id === study.id ? 'bg-blue-50/60' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="font-mono font-black text-slate-900">{study.id}</div>
                        <div className="text-[10px] text-slate-400 font-bold">{safeFormatDate(study.orderDate, "HH:mm dd/MM")}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{study.patientName}</div>
                        <div className="text-[10px] font-mono text-slate-400 font-bold">{study.mrn} • {study.patientAge}Y/{study.patientGender[0]}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{study.procedureName}</div>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-black uppercase font-mono">
                          {study.modality}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          study.priority === 'STAT' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                          study.priority === 'Urgent' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {study.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-[10px] font-black uppercase">
                          {study.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                          <button 
                            onClick={() => setActivePacsStudy(study)}
                            className="p-1.5 bg-slate-900 text-white rounded-lg hover:bg-blue-600 transition-all"
                            title="Launch PACS Viewer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => setActiveReportStudy(study)}
                            className="p-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all"
                            title="Open Diagnostic Reporter"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Selected Study Detail Panel */}
          <div className="space-y-6">
            {selectedStudy ? (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 bg-slate-900 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-black">{selectedStudy.patientName}</h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">MRN: {selectedStudy.mrn} • Accession: {selectedStudy.id}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-black font-mono">
                      {selectedStudy.modality}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-5 text-xs">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Procedure & Room</span>
                    <p className="font-black text-slate-800 text-sm">{selectedStudy.procedureName}</p>
                    <p className="text-slate-500 font-bold mt-0.5">{selectedStudy.scheduledRoom || "Default Imaging Room"}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Clinical Indication</span>
                    <p className="font-medium text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">{selectedStudy.clinicalIndication}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Preparation</span>
                      <span className={`font-bold ${selectedStudy.prepCompleted ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {selectedStudy.prepCompleted ? "Verified & Ready" : "Pending Prep"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Contrast Status</span>
                      <span className="font-bold text-slate-800">
                        {selectedStudy.contrastRequired ? `${selectedStudy.contrastType || "Required"}` : "None"}
                      </span>
                    </div>
                  </div>

                  {/* Action Workflow Bar */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <button 
                      onClick={() => setActivePacsStudy(selectedStudy)}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow"
                    >
                      <Eye className="w-4 h-4 text-blue-400" />
                      {isAr ? "فتح عارض الصور (PACS Viewer)" : "Launch PACS Web Viewer"}
                    </button>

                    <button 
                      onClick={() => setActivePrepStudy(selectedStudy)}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      {isAr ? "إكمال تجهيز وإقرار المريض" : "Patient Prep & Safety Check"}
                    </button>

                    <button 
                      onClick={() => setActiveReportStudy(selectedStudy)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
                    >
                      <FileText className="w-4 h-4" />
                      {isAr ? "كتابة واعتماد التقرير" : "Draft Diagnostic Report"}
                    </button>

                    <button 
                      onClick={() => setActiveDistributionStudy(selectedStudy)}
                      className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <QrCode className="w-4 h-4" />
                      {isAr ? "مشاركة وتصدير الصور (CD/QR)" : "Share & Export Images (CD/QR)"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-400">
                {isAr ? "اختر دراسة من القائمة لاستعراض التفاصيل" : "Select a study from worklist"}
              </div>
            )}

            {/* Equipment Live Status Widget */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Box className="w-4 h-4 text-blue-600" />
                {isAr ? "حالة أجهزة الأشعة التشغيلية" : "Modality Equipment Status"}
              </h3>

              <div className="space-y-3 text-xs">
                {equipmentList.map(eq => (
                  <div key={eq.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">{eq.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{eq.room} • AE: {eq.aeTitle}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      eq.status === 'In-Use' ? 'bg-blue-100 text-blue-700' :
                      eq.status === 'Online' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {eq.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MWL Tab View */}
      {primaryTab === "mwl" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900">{isAr ? "قوائم العمل المباشرة للأجهزة (Modality Worklist - MWL)" : "DICOM Modality Worklist (MWL)"}</h2>
              <p className="text-xs text-slate-500">{isAr ? "مزامنة HL7 / DICOM تلقائية لجميع أجهزة الأشعة" : "Real-time C-FIND MWL synchronization with modality consoles"}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Accession #</th>
                  <th className="px-4 py-3">Patient Name</th>
                  <th className="px-4 py-3">Modality & Room</th>
                  <th className="px-4 py-3">AE Title</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">MWL Trigger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studies.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{s.id}</td>
                    <td className="px-4 py-3 font-bold">{s.patientName} ({s.mrn})</td>
                    <td className="px-4 py-3 font-bold text-blue-700">{s.modality} • {s.scheduledRoom || "Room 1"}</td>
                    <td className="px-4 py-3 font-mono text-slate-500">{s.dicomAeTitle || "WORKSTATION"}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold uppercase">{s.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => handleAdvanceStatus(s.id, "InProcedure")}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold uppercase"
                      >
                        Send to Console
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Critical Findings View */}
      {primaryTab === "critical" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-rose-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                {isAr ? "سجل إشعار النتائج الطبية الحرجة (Critical Findings Log)" : "Critical Findings Log & Time-to-Notification Record"}
              </h2>
              <p className="text-xs text-slate-500">JCI Compliance Standard • Verbal Communication Verification</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Alert ID</th>
                  <th className="px-4 py-3">Patient & MRN</th>
                  <th className="px-4 py-3">Critical Finding Summary</th>
                  <th className="px-4 py-3">Notified Doctor</th>
                  <th className="px-4 py-3">Notification Method</th>
                  <th className="px-4 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {criticalAlerts.map(a => (
                  <tr key={a.id} className="hover:bg-rose-50/30">
                    <td className="px-4 py-3 font-mono font-bold text-rose-700">{a.id}</td>
                    <td className="px-4 py-3 font-bold">{a.patientName} ({a.mrn})</td>
                    <td className="px-4 py-3 font-bold text-rose-900">{a.findingSummary}</td>
                    <td className="px-4 py-3 font-bold text-slate-800">{a.orderingDoctor} ({a.orderingDoctorPhone})</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-bold text-[10px]">{a.notificationMethod}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500">{a.timestamp.replace('T', ' ').slice(0, 16)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Equipment View */}
      {primaryTab === "equipment" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900">{isAr ? "إدارة أجهزة الأشعة والصيانة" : "Radiology Equipment Registry & Calibration"}</h2>
              <p className="text-xs text-slate-500">DICOM AE Title, IP Address & Preventive Maintenance</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipmentList.map(eq => (
              <div key={eq.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">{eq.name}</h3>
                    <p className="text-slate-500 font-mono">{eq.room}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${eq.status === 'Online' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                    {eq.status}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono space-y-1 text-[11px]">
                  <div>AE Title: <span className="font-bold text-blue-700">{eq.aeTitle}</span></div>
                  <div>IP: {eq.ipAddress} : {eq.port}</div>
                  <div>Vendor: {eq.contractVendor}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics & KPIs Tab */}
      {primaryTab === "analytics" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-slate-900">{isAr ? "مؤشرات الأداء الإنتاجية للأشعة (Radiology KPIs & TAT)" : "Radiology Productivity & Turnaround Time Analytics"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-slate-500 font-bold text-xs">Average Turnaround Time (TAT)</span>
              <div className="text-3xl font-black text-blue-600">42 Minutes</div>
              <p className="text-[11px] text-emerald-600 font-bold">↓ 14% improvement over last month</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-slate-500 font-bold text-xs">Modality Utilization Rate</span>
              <div className="text-3xl font-black text-emerald-600">88.4 %</div>
              <p className="text-[11px] text-slate-500 font-bold">Optimal capacity compliance</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-slate-500 font-bold text-xs">Image Reject / Repeat Rate</span>
              <div className="text-3xl font-black text-slate-900">1.2 %</div>
              <p className="text-[11px] text-emerald-600 font-bold">Well below ACR 5% threshold</p>
            </div>
          </div>
        </div>
      )}

      {/* Render Popups & Modals */}
      {activePacsStudy && (
        <PacsViewerModal 
          study={activePacsStudy}
          isAr={isAr}
          onClose={() => setActivePacsStudy(null)}
          onLaunchReporting={() => {
            const st = activePacsStudy;
            setActivePacsStudy(null);
            setActiveReportStudy(st);
          }}
        />
      )}

      {activeReportStudy && (
        <StructuredReportEditor 
          study={activeReportStudy}
          isAr={isAr}
          currentUser={currentUser}
          onClose={() => setActiveReportStudy(null)}
          onSaveReport={handleSaveReport}
          onTriggerCriticalAlert={(st, details) => setActiveCriticalStudy(st)}
        />
      )}

      {activeCriticalStudy && (
        <CriticalFindingsModal 
          study={activeCriticalStudy}
          isAr={isAr}
          onClose={() => setActiveCriticalStudy(null)}
          onSaveAlert={handleSaveCriticalAlert}
        />
      )}

      {activeDoseStudy && (
        <DoseAndContrastTracker 
          study={activeDoseStudy}
          contrastCatalog={contrastCatalog}
          isAr={isAr}
          onClose={() => setActiveDoseStudy(null)}
          onUpdateStudy={(updated) => {
            const updatedList = studies.map(s => s.id === activeDoseStudy.id ? { ...s, ...updated } : s);
            updateStudies(updatedList);
          }}
        />
      )}

      {activePrepStudy && (
        <PatientPrepModal 
          study={activePrepStudy}
          isAr={isAr}
          onClose={() => setActivePrepStudy(null)}
          onConfirmPrep={(updated) => {
            const updatedList = studies.map(s => s.id === activePrepStudy.id ? { ...s, ...updated } : s);
            updateStudies(updatedList);
          }}
        />
      )}

      {activeDistributionStudy && (
        <DistributionModal 
          study={activeDistributionStudy}
          isAr={isAr}
          onClose={() => setActiveDistributionStudy(null)}
        />
      )}

      {activePrintReport && (
        <PrintableReportView 
          report={activePrintReport}
          isAr={isAr}
          onClose={() => setActivePrintReport(null)}
        />
      )}

      {/* PULL REQUESTS MODAL FOR RADIOLOGY */}
      {showPullRequestsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in" dir={isAr ? "rtl" : "ltr"}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-4xl space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <DownloadCloud className="w-6 h-6 text-blue-600" />
                  {isAr ? "سحب طلبات الأشعة الواردة من الأقسام (Pull Requests)" : "Incoming Radiology Department Pull Requests"}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {isAr 
                    ? "استقبال واستلام طلبات الأشعة والصور الطبية الصادرة إلكترونياً من أطباء العيادات، الطوارئ، التنويم، والعمليات" 
                    : "Electronic radiology requisitions sent by doctors from ER, OPD, Wards, OR, and ICU"}
                </p>
              </div>
              <button onClick={() => setShowPullRequestsModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg p-2 rounded-full hover:bg-slate-100 cursor-pointer">✕</button>
            </div>

            {/* Department Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: "ALL", labelAr: "جميع الأقسام", labelEn: "All Departments" },
                { id: "ER", labelAr: "🚨 الطوارئ", labelEn: "ER Emergency" },
                { id: "OPD", labelAr: "🩺 العيادات", labelEn: "OPD Clinics" },
                { id: "IPD", labelAr: "🏥 التنويم", labelEn: "IPD Wards" },
                { id: "OR", labelAr: "✂️ العمليات", labelEn: "OR Suites" },
                { id: "ICU", labelAr: "🫀 العناية المركزة", labelEn: "ICU Unit" },
              ].map(dept => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDeptFilter(dept.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedDeptFilter === dept.id 
                      ? "bg-blue-600 text-white shadow-sm font-black" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {isAr ? dept.labelAr : dept.labelEn}
                </button>
              ))}
            </div>

            {/* Requests Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-right rtl:text-right ltr:text-left border-collapse text-xs">
                <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">{isAr ? "رقم الطلب والتوقيت" : "Order ID & Time"}</th>
                    <th className="p-3.5">{isAr ? "القسم والطبيب" : "Dept & Physician"}</th>
                    <th className="p-3.5">{isAr ? "المريض" : "Patient"}</th>
                    <th className="p-3.5">{isAr ? "نوع الأشعة والفحص" : "Modality & Procedure"}</th>
                    <th className="p-3.5">{isAr ? "الأولوية" : "Priority"}</th>
                    <th className="p-3.5">{isAr ? "الحالة الحالية" : "Current Status"}</th>
                    <th className="p-3.5 text-center">{isAr ? "الإجراء" : "Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold">
                  {incomingPullRequests
                    .filter(r => selectedDeptFilter === "ALL" || r.department === selectedDeptFilter)
                    .map(req => {
                      const isClaimed = req.status === "In Progress" || req.status === "Under Processing" || req.status === "Completed";
                      return (
                        <tr key={req.id} className={`hover:bg-slate-50/80 transition-colors ${isClaimed ? "bg-emerald-50/20" : ""}`}>
                          <td className="p-3.5">
                            <span className="font-mono font-black text-blue-900 block">{req.id}</span>
                            <span className="text-[10px] text-slate-400 font-mono block">{safeFormatDate(req.createdAt, "HH:mm yyyy-MM-dd")}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-bold text-slate-800 block">{isAr ? req.departmentAr : req.departmentEn}</span>
                            <span className="text-[10px] text-blue-600 block">{req.doctorName}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-black text-slate-900 block">{req.patientName}</span>
                            <span className="text-[10px] font-mono text-slate-400 block">{req.mrn}</span>
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-black text-[10px]">
                                {req.modality}
                              </span>
                              <span className="font-bold text-slate-900">{req.procedureName}</span>
                            </div>
                            {req.notes && <span className="text-[10px] text-slate-400 italic block">{req.notes}</span>}
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              req.priority === "STAT" ? "bg-rose-100 text-rose-700 border border-rose-200 animate-pulse" :
                              req.priority === "Urgent" ? "bg-amber-100 text-amber-700 border border-amber-200" :
                              "bg-slate-100 text-slate-600"
                            }`}>
                              {req.priority}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                              isClaimed ? "bg-blue-100 text-blue-800 border border-blue-200" : "bg-amber-100 text-amber-800 border border-amber-200"
                            }`}>
                              {isClaimed ? (isAr ? "قيد التنفيذ (In Progress)" : "In Progress") : (isAr ? "وارد جديد (Pending)" : "Pending")}
                            </span>
                          </td>
                          <td className="p-3.5 text-center">
                            {!isClaimed ? (
                              <button
                                onClick={() => handleClaimRadRequest(req)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 mx-auto"
                              >
                                <Inbox className="w-3.5 h-3.5" />
                                {isAr ? "استلام الطلب (Claim)" : "Claim Order"}
                              </button>
                            ) : (
                              <span className="text-emerald-600 font-bold text-xs flex items-center justify-center gap-1">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                {isAr ? "تم الاستلام" : "Claimed"}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowPullRequestsModal(false)}
                className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition cursor-pointer"
              >
                {isAr ? "إغلاق النافذة" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
