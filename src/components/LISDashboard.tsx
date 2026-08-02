import React, { useState, useMemo } from "react";
import { 
  TestTube, Search, Filter, Clock, CheckCircle2, AlertTriangle, 
  Beaker, FlaskConical, Microscope, FileSpreadsheet, Send, User,
  Barcode, ShieldAlert, Cpu, Activity, RefreshCw, Layers, CheckCircle,
  XCircle, Plus, FileText, Printer, ArrowRight, Dna, Droplets,
  Building2, Users, AlertCircle, Sparkles, TrendingUp, BarChart2,
  Calendar, Wrench, Package, ShieldCheck, Phone, Check, ChevronRight,
  Database, Award, Shield, Eye, DownloadCloud, Inbox, Stethoscope, Siren
} from "lucide-react";
import { useHIS } from "../context/HISContext";
import { safeFormatDate } from "../lib/dateUtils";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

// Sub-lab categories
type SubLabCategory = 
  | "Chemistry" 
  | "Hematology" 
  | "Coagulation" 
  | "Immunology" 
  | "Serology" 
  | "Hormones" 
  | "Toxicology" 
  | "Urinalysis" 
  | "Microbiology" 
  | "BloodBank" 
  | "Histopathology" 
  | "MolecularPCR";

export default function LISDashboard({ language }: Props) {
  const isAr = language === "ar";
  const { 
    cpoeOrders, 
    setCpoeOrders, 
    labResults, 
    addLabResult, 
    addCharge, 
    currentUser,
    patients,
    addAuditLog
  } = useHIS();

  // Navigation Tab
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "orders"
    | "collection"
    | "receiving"
    | "tracking"
    | "rejections"
    | "processing"
    | "analyzers"
    | "results"
    | "critical"
    | "specialty"
    | "qc"
    | "inventory"
    | "equipment"
    | "staff"
    | "audit_reports"
  >("dashboard");

  // Filters & State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubLab, setSelectedSubLab] = useState<SubLabCategory | "All">("All");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Pull Requests Modal & Department Filter State
  const [showPullRequestsModal, setShowPullRequestsModal] = useState(false);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<"ALL" | "ER" | "OPD" | "IPD" | "OR" | "ICU">("ALL");

  // Incoming Electronic Requests Queue from Hospital Departments
  const [incomingPullRequests, setIncomingPullRequests] = useState([
    {
      id: "REQ-LAB-1001",
      patientName: "أحمد عبد الله القحطاني",
      patientId: "MRN-10092",
      mrn: "MRN-10092",
      department: "ER",
      departmentAr: "قسم الطوارئ (Emergency Dept)",
      departmentEn: "Emergency Dept (ER Room 3)",
      doctorName: "د. عبد الرحمن الشهري",
      testName: "Troponin-I STAT + Cardiac Enzymes",
      subcategory: "Chemistry" as SubLabCategory,
      priority: "STAT",
      createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
      status: "Pending",
      notes: "Severe acute chest pain radiating to left arm"
    },
    {
      id: "REQ-LAB-1002",
      patientName: "منى خالد المطيري",
      patientId: "MRN-10084",
      mrn: "MRN-10084",
      department: "OPD",
      departmentAr: "عيادة الباطنة (Internal Medicine Clinic 2)",
      departmentEn: "Internal Medicine Clinic 2",
      doctorName: "د. سارة الدوسري",
      testName: "Complete Blood Count (CBC) + ESR",
      subcategory: "Hematology" as SubLabCategory,
      priority: "Routine",
      createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
      status: "Pending",
      notes: "Routine follow-up for chronic anemia"
    },
    {
      id: "REQ-LAB-1003",
      patientName: "سعود محمد العتيبي",
      patientId: "MRN-10077",
      mrn: "MRN-10077",
      department: "IPD",
      departmentAr: "جناح التنويم 3 (Inpatient Ward 304)",
      departmentEn: "Inpatient Ward 304",
      doctorName: "د. خالد الغامدي",
      testName: "Renal Function Panel (BUN & Creatinine)",
      subcategory: "Chemistry" as SubLabCategory,
      priority: "Urgent",
      createdAt: new Date(Date.now() - 48 * 60000).toISOString(),
      status: "Pending",
      notes: "Post-operative monitoring for acute kidney stress"
    },
    {
      id: "REQ-LAB-1004",
      patientName: "فاطمة إبراهيم الشمري",
      patientId: "MRN-10065",
      mrn: "MRN-10065",
      department: "ICU",
      departmentAr: "العناية المركزة (ICU Bed 05)",
      departmentEn: "Intensive Care Unit (ICU Bed 05)",
      doctorName: "د. ريم الزهراني",
      testName: "Arterial Blood Gas (ABG) + Electrolytes",
      subcategory: "Chemistry" as SubLabCategory,
      priority: "STAT",
      createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
      status: "Pending",
      notes: "Mechanical ventilation tracking - Acidosis check"
    },
    {
      id: "REQ-LAB-1005",
      patientName: "عمر فاروق البقمي",
      patientId: "MRN-10051",
      mrn: "MRN-10051",
      department: "OR",
      departmentAr: "غرفة العمليات (OR Suite 2)",
      departmentEn: "Operating Theater (OR Suite 2)",
      doctorName: "د. طارق السبيعي",
      testName: "Crossmatch & 2 Units Packed RBCs",
      subcategory: "BloodBank" as SubLabCategory,
      priority: "STAT",
      createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
      status: "Pending",
      notes: "Intra-operative vascular surgery bleeding"
    }
  ]);

  // Specimen Collection State
  const [collectionForm, setCollectionForm] = useState({
    specimenType: "EDTA Whole Blood",
    tubeColor: "Purple (EDTA)",
    phlebotomist: currentUser?.nameEn || "Phlebotomist Tech",
    site: "OPD Phlebotomy Room 1",
    barcodeGenerated: false
  });

  // Specimen Receiving State
  const [rejectionReason, setRejectionReason] = useState("Hemolyzed Sample");

  // Result Entry State
  const [resultValue, setResultValue] = useState("");
  const [resultUnit, setResultUnit] = useState("mg/dL");
  const [refRange, setRefRange] = useState("70 - 110");
  const [resultFlag, setResultFlag] = useState<"normal" | "high" | "low" | "critical">("normal");
  const [techNotes, setTechNotes] = useState("");

  // Critical Call Log State
  const [criticalCallLogs, setCriticalCallLogs] = useState<any[]>([]);
  const [newCallLog, setNewCallLog] = useState({
    physicianName: "",
    notes: "",
    readBackConfirmed: true
  });

  // Microbiology Culture State
  const [microData, setMicroData] = useState({
    specimen: "Urine Culture",
    organism: "Escherichia coli",
    colonyCount: ">100,000 CFU/mL",
    gramStain: "Gram-Negative Bacilli",
    antibiogram: [
      { antibiotic: "Ciprofloxacin", sensitivity: "Resistant", mic: ">4 ug/mL" },
      { antibiotic: "Amoxicillin-Clavulanate", sensitivity: "Intermediate", mic: "8 ug/mL" },
      { antibiotic: "Ceftriaxone", sensitivity: "Sensitive", mic: "<1 ug/mL" },
      { antibiotic: "Nitrofurantoin", sensitivity: "Sensitive", mic: "<16 ug/mL" },
      { antibiotic: "Meropenem", sensitivity: "Sensitive", mic: "<0.25 ug/mL" }
    ]
  });

  // Blood Bank State
  const [bloodBankData, setBloodBankData] = useState({
    patientBloodType: "A Positive (A+)",
    donorUnitId: "PRBC-2026-9912",
    donorBloodType: "A Positive (A+)",
    crossmatchResult: "Compatible",
    antibodyScreen: "Negative",
    issuedBy: currentUser?.nameEn || "Blood Bank Tech"
  });

  // Histopathology State
  const [histoData, setHistoData] = useState({
    specimenSource: "Gastric Biopsy (Antrum)",
    grossDescription: "Two small tan-white tissue fragments measuring 0.3 x 0.2 cm.",
    microscopicFindings: "Gastric mucosa showing moderate chronic inflammatory infiltrate with Helicobacter pylori organisms.",
    pathologistDiagnosis: "Chronic Active Gastritis with H. pylori colonization (Grade II).",
    pathologistName: "Dr. Nadia Al-Otaibi (Consultant Pathologist)"
  });

  // Rejection Log State
  const [rejectionsList, setRejectionsList] = useState<any[]>([]);

  // Analyzer Interfaces list
  const [analyzers, setAnalyzers] = useState([
    { name: "Cobas 8000 (Chemistry)", vendor: "Roche", status: "Online", protocol: "HL7 v2.5 / TCP", activeJobs: 14, uptime: "99.9%" },
    { name: "Sysmex XN-3000 (Hematology)", vendor: "Sysmex", status: "Online", protocol: "ASTM E1394 / Serial", activeJobs: 8, uptime: "100%" },
    { name: "ACL TOP 550 (Coagulation)", vendor: "Werfen", status: "Online", protocol: "HL7 v2.3", activeJobs: 3, uptime: "98.5%" },
    { name: "Architect i2000SR (Immunoassay)", vendor: "Abbott", status: "Maintenance", protocol: "HL7 v2.5", activeJobs: 0, uptime: "94.2%" },
    { name: "GeneXpert XVI (PCR / Molecular)", vendor: "Cepheid", status: "Online", protocol: "HL7 / Middleware", activeJobs: 5, uptime: "100%" }
  ]);

  // All Lab Orders combined from CPOE + local incoming requests
  const labOrders = useMemo(() => {
    const fromCpoe = (cpoeOrders || []).filter(o => o.orderType === "Lab" || o.type === "LAB" || o.category === "lab");
    const mappedIncoming = incomingPullRequests
      .filter(req => req.status === "In Progress" || req.status === "Under Processing" || req.status === "Completed")
      .map(req => ({
        id: req.id,
        orderType: "Lab",
        type: "LAB",
        category: "lab",
        subcategory: req.subcategory,
        orderName: req.testName,
        itemName: req.testName,
        patientId: req.patientId,
        patientName: req.patientName,
        mrn: req.mrn,
        priority: req.priority,
        status: req.status,
        createdAt: req.createdAt,
        timestamp: req.createdAt,
        doctorId: req.doctorName,
        department: req.departmentAr
      }));

    // Deduplicate by ID
    const combined = [...fromCpoe];
    mappedIncoming.forEach(item => {
      if (!combined.some(c => c.id === item.id)) {
        combined.push(item);
      }
    });

    return combined;
  }, [cpoeOrders, incomingPullRequests]);

  // Filtered Orders by Tab & SubLab
  const pendingOrders = labOrders.filter(o => o.status === "Pending" || o.status === "ordered");
  const processingOrders = labOrders.filter(o => o.status === "Processing" || o.status === "In Progress" || o.status === "Under Processing" || o.status === "collected");
  const completedOrders = labOrders.filter(o => o.status === "Completed" || o.status === "completed");

  const handleClaimRequest = (req: any) => {
    // Update incoming requests state
    setIncomingPullRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: "In Progress" } : r));

    // Also add to CPOE context if present
    const claimedOrd = {
      id: req.id,
      orderType: "Lab",
      type: "LAB",
      category: "lab",
      subcategory: req.subcategory,
      orderName: req.testName,
      itemName: req.testName,
      patientId: req.patientId,
      patientName: req.patientName,
      mrn: req.mrn,
      priority: req.priority,
      status: "In Progress",
      createdAt: req.createdAt || new Date().toISOString(),
      timestamp: new Date().toISOString(),
      doctorId: req.doctorName,
      department: req.departmentAr,
      claimedBy: currentUser?.nameEn || "Lab Technologist"
    };

    if (setCpoeOrders) {
      if (!cpoeOrders.some(o => o.id === req.id)) {
        setCpoeOrders([claimedOrd, ...cpoeOrders]);
      } else {
        setCpoeOrders(cpoeOrders.map(o => o.id === req.id ? { ...o, status: "In Progress" } : o));
      }
    }

    if (addAuditLog) {
      addAuditLog({
        action: "LAB_ORDER_CLAIMED",
        entityType: "LabOrder",
        entityId: req.id,
        user: currentUser?.nameEn || "Lab Technologist",
        details: `Claimed order ${req.id} for ${req.patientName} (${req.testName}) from ${req.departmentAr}`
      });
    }

    toast.success(isAr ? `تم استلام الطلب (${req.id}) بنجاح وتغيير حالته إلى: قيد التنفيذ (In Progress)` : `Order ${req.id} claimed! Status changed to In Progress`);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    if (setCpoeOrders) {
      const updated = cpoeOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
      setCpoeOrders(updated);
    }
    setIncomingPullRequests(prev => prev.map(r => r.id === orderId ? { ...r, status: newStatus } : r));
    toast.success(`${isAr ? "تحديث حالة الطلب:" : "Order status updated:"} ${newStatus}`);
  };

  const handleRejectSpecimen = (order: any) => {
    handleUpdateOrderStatus(order.id, "Rejected");
    const newRejection = {
      id: `REJ-${Math.floor(100 + Math.random() * 900)}`,
      patientName: order.patientName,
      mrn: order.mrn,
      testName: order.orderName || order.itemName,
      reason: rejectionReason,
      time: new Date().toISOString(),
      rejectedBy: currentUser?.nameEn || "Lab Tech",
      redrawRequested: true
    };
    setRejectionsList([newRejection, ...rejectionsList]);
    toast.error(isAr ? "تم رفض العينة وإبلاغ القسم بالطلب المكرر" : "Specimen rejected & redraw requested");
  };

  const handleSubmitResult = async () => {
    if (!selectedOrder || !resultValue) {
      toast.error(isAr ? "يرجى إدخال قيمة النتيجة" : "Please enter result value");
      return;
    }

    // Save Lab Result
    await addLabResult({
      orderId: selectedOrder.id,
      patientId: selectedOrder.patientId || selectedOrder.mrn,
      testName: selectedOrder.orderName || selectedOrder.itemName,
      category: selectedOrder.subcategory || "Chemistry",
      value: resultValue,
      unit: resultUnit,
      referenceRange: refRange,
      flag: resultFlag,
      performedBy: currentUser?.nameEn || "Lab Technologist",
      verifiedBy: "Dr. Consultant Pathologist",
      notes: techNotes || "Validated by LIS Delta Check"
    });

    // Auto Billing Integration
    await addCharge({
      patientId: selectedOrder.patientId || selectedOrder.mrn,
      patientName: selectedOrder.patientName,
      serviceId: `LAB-SRV-${Math.floor(100 + Math.random() * 900)}`,
      serviceName: selectedOrder.orderName || selectedOrder.itemName,
      category: "lab",
      amount: resultFlag === "critical" ? 220 : 120,
      orderId: selectedOrder.id,
      staffId: currentUser?.id || "LAB-TECH"
    });

    // Log Audit
    if (addAuditLog) {
      addAuditLog({
        action: "LAB_RESULT_VALIDATED",
        entityType: "LabOrder",
        entityId: selectedOrder.id,
        user: currentUser?.nameEn || "Lab Tech",
        details: `Result ${resultValue} ${resultUnit} flag: ${resultFlag}`
      });
    }

    // Mark as completed
    handleUpdateOrderStatus(selectedOrder.id, "Completed");

    // If critical, trigger Panic Alert Modal / Call Log
    if (resultFlag === "critical") {
      const callRecord = {
        id: `CAL-${Math.floor(1000 + Math.random() * 9000)}`,
        orderId: selectedOrder.id,
        patientName: selectedOrder.patientName,
        testName: selectedOrder.orderName || selectedOrder.itemName,
        value: `${resultValue} ${resultUnit} (CRITICAL)`,
        physicianName: selectedOrder.doctorId || "Ordering Physician",
        calledBy: currentUser?.nameEn || "Lab Tech",
        callTime: new Date().toISOString(),
        readBackConfirmed: true,
        notes: "Critical value notified directly to care provider."
      };
      setCriticalCallLogs([callRecord, ...criticalCallLogs]);
      toast.error(isAr ? "⚠️ نتيجة حرجة (Panic Value) - تم فتح سجل الإبلاغ الفوري!" : "⚠️ Panic Value detected! Logged in Critical Value Manager.");
    } else {
      toast.success(isAr ? "تم اعتماد النتيجة وإرسال التقرير لملف المريض والفواتير" : "Result validated, sent to EMR & Billed!");
    }

    setSelectedOrder(null);
    setResultValue("");
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans text-slate-800" dir={isAr ? "rtl" : "ltr"}>
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-slate-800 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-600/30 border-2 border-indigo-400/40 rounded-2xl flex items-center justify-center text-indigo-300 shadow-inner">
              <FlaskConical className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[10px] font-black uppercase tracking-widest rounded-full">
                  JCI / CAP / ISO 15189 Certified LIS
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Middleware Online
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight mt-1">
                {isAr ? "نظام المختبر الطبي المتقدم (Enterprise LIS)" : "Enterprise Laboratory Information System"}
              </h1>
              <p className="text-xs font-semibold text-slate-300 mt-1">
                {isAr 
                  ? "إدارة شاملة لجميع أقسام التحاليل، الأجهزة المخبرية، سحب العينات، ضبط الجودة، وبنك الدم" 
                  : "End-to-End Specimen Lifecycle, Analyzer Middleware, Delta Checking & Quality Control"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowPullRequestsModal(true)}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <DownloadCloud className="w-4 h-4" /> {isAr ? "سحب الطلبات (Pull Requests)" : "Pull Requests"}
            </button>
            <button 
              onClick={() => toast.info(isAr ? "جاري تحديث الاتصال بأجهزة المختبر..." : "Refreshing Analyzer Interfaces...")}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/10 transition-all cursor-pointer"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-navigation Menu */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "dashboard", label: isAr ? "لوحة المؤشرات" : "Dashboard", icon: Activity },
            { id: "orders", label: isAr ? "طلبات التحاليل" : "Orders & CPOE", icon: FileSpreadsheet, badge: pendingOrders.length },
            { id: "collection", label: isAr ? "سحب العينات والباركود" : "Collection & Barcode", icon: Barcode },
            { id: "receiving", label: isAr ? "استقبال العينات" : "Receiving Bay", icon: CheckCircle2 },
            { id: "tracking", label: isAr ? "تتبع العينات" : "Specimen Tracking", icon: Layers },
            { id: "rejections", label: isAr ? "العينات المرفوضة" : "Rejection Log", icon: AlertTriangle, badge: rejectionsList.length },
            { id: "processing", label: isAr ? "تشغيل التحاليل" : "Test Queues", icon: TestTube },
            { id: "analyzers", label: isAr ? "أجهزة المختبر" : "Analyzer Interfaces", icon: Cpu },
            { id: "results", label: isAr ? "إدخال واعتـماد النتائج" : "Result Entry & Validation", icon: Microscope },
            { id: "critical", label: isAr ? "النتائج الحرجة" : "Critical Call Manager", icon: ShieldAlert, badge: criticalCallLogs.length },
            { id: "specialty", label: isAr ? "المختبرات التخصصية" : "Specialty Labs", icon: Dna },
            { id: "qc", label: isAr ? "ضبط الجودة (QC)" : "Quality Control", icon: ShieldCheck },
            { id: "inventory", label: isAr ? "مخزون الكواشف" : "Reagents & Kits", icon: Package },
            { id: "equipment", label: isAr ? "الصيانة والمعايرة" : "Equipment Maint.", icon: Wrench },
            { id: "staff", label: isAr ? "الكادر والوردية" : "Staff & Roster", icon: Users },
            { id: "audit_reports", label: isAr ? "سجل العمليات والتقارير" : "Audit & Reports", icon: Database },
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive 
                    ? "bg-white text-slate-900 shadow-md scale-105" 
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                {item.label}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono ${isActive ? "bg-indigo-100 text-indigo-800" : "bg-indigo-500/30 text-indigo-200"}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TABS CONTENT */}

      {/* 1. DASHBOARD TAB */}
      {activeTab === "dashboard" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { title: isAr ? "إجمالي العينات" : "Total Samples", value: "248", color: "border-indigo-500 text-indigo-600 bg-indigo-50/50" },
              { title: isAr ? "قيد الانتظار" : "Pending Draw", value: pendingOrders.length, color: "border-amber-500 text-amber-600 bg-amber-50/50" },
              { title: isAr ? "قيد المعالجة" : "In Processing", value: processingOrders.length, color: "border-blue-500 text-blue-600 bg-blue-50/50" },
              { title: isAr ? "العينات الحرجة" : "Panic Values", value: criticalCallLogs.length, color: "border-rose-500 text-rose-600 bg-rose-50/50" },
              { title: isAr ? "المرفوضة" : "Rejected", value: rejectionsList.length, color: "border-orange-500 text-orange-600 bg-orange-50/50" },
              { title: isAr ? "مكتملة اليوم" : "Completed", value: completedOrders.length + 42, color: "border-emerald-500 text-emerald-600 bg-emerald-50/50" },
              { title: isAr ? "معدل TAT" : "Avg TAT", value: "38 min", color: "border-cyan-500 text-cyan-600 bg-cyan-50/50" },
              { title: isAr ? "الأجهزة الفعالة" : "Online Analyzers", value: "4/5", color: "border-purple-500 text-purple-600 bg-purple-50/50" },
            ].map((card, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border-2 ${card.color} shadow-sm bg-white`}>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{card.title}</p>
                <p className={`text-xl font-black mt-1 ${card.color.split(" ")[1]}`}>{card.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Live Workload & Departmental breakdown */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  {isAr ? "مؤشرات أداء الأقسام وزمن الإنجاز (Turn Around Time)" : "Departmental Workload & Turnaround Time"}
                </h3>
                <span className="text-xs font-bold text-slate-400">Target TAT: &lt; 45 mins</span>
              </div>

              <div className="space-y-4">
                {[
                  { dept: "Clinical Chemistry", samples: 112, avgTat: "28 min", stat: 94, status: "Optimal" },
                  { dept: "Hematology & Coagulation", samples: 78, avgTat: "22 min", stat: 98, status: "Optimal" },
                  { dept: "Microbiology & Serology", samples: 34, avgTat: "24 hrs", stat: 88, status: "In Culture" },
                  { dept: "Blood Bank & Immunohematology", samples: 14, avgTat: "15 min", stat: 100, status: "STAT Priority" },
                  { dept: "Histopathology & Cytology", samples: 10, avgTat: "48 hrs", stat: 92, status: "Processing" },
                ].map((row, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <p className="text-sm font-black text-slate-800">{row.dept}</p>
                      <p className="text-xs text-slate-500 font-medium">{row.samples} active specimens • Avg TAT: {row.avgTat}</p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between">
                      <div className="w-32 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${row.stat}%` }} />
                      </div>
                      <span className="text-xs font-bold text-indigo-600">{row.stat}% On-time</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Analyzers Status Widget */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-600" />
                {isAr ? "حالة الأجهزة والميدلوير" : "Analyzer Middleware Monitor"}
              </h3>

              <div className="space-y-3">
                {analyzers.map((dev, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-black text-slate-800">{dev.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{dev.vendor} • {dev.protocol}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${dev.status === "Online" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {dev.status}
                      </span>
                      <p className="text-[10px] text-slate-400 font-bold mt-1">{dev.activeJobs} jobs active</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ORDERS & CPOE TAB */}
      {activeTab === "orders" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder={isAr ? "بحث باسم المريض، الرقم الطبي، أو اسم الفحص..." : "Search patient name, MRN, or test..."}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                {(["All", "Chemistry", "Hematology", "Microbiology", "BloodBank"] as const).map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubLab(sub)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase whitespace-nowrap cursor-pointer ${selectedSubLab === sub ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                  <tr>
                    <th className="p-4">{isAr ? "رقم الطلب والتاريخ" : "Order ID & Date"}</th>
                    <th className="p-4">{isAr ? "بيانات المريض" : "Patient Details"}</th>
                    <th className="p-4">{isAr ? "الفحص الطبي" : "Test Requested"}</th>
                    <th className="p-4">{isAr ? "الأولوية" : "Priority"}</th>
                    <th className="p-4">{isAr ? "الحالة" : "Status"}</th>
                    <th className="p-4 text-right">{isAr ? "إجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {labOrders
                    .filter(o => 
                      (selectedSubLab === "All" || o.subcategory === selectedSubLab) &&
                      (o.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) || o.id?.toLowerCase().includes(searchTerm.toLowerCase()) || o.orderName?.toLowerCase().includes(searchTerm.toLowerCase()))
                    )
                    .map(order => (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <p className="text-xs font-black text-slate-900">{order.id}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{safeFormatDate(order.createdAt || order.timestamp, "yyyy-MM-dd HH:mm")}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-xs font-black text-slate-800">{order.patientName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">MRN: {order.mrn || order.patientId}</p>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs rounded-lg">
                            {order.orderName || order.itemName}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] font-black uppercase ${order.priority === "STAT" ? "text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200" : "text-slate-600"}`}>
                            {order.priority || "Routine"}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            order.status === "Completed" ? "bg-emerald-100 text-emerald-800" :
                            order.status === "Processing" ? "bg-blue-100 text-blue-800" :
                            order.status === "Rejected" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2 space-x-reverse">
                          {order.status === "Pending" && (
                            <button 
                              onClick={() => handleUpdateOrderStatus(order.id, "Processing")}
                              className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-lg hover:bg-indigo-700 cursor-pointer"
                            >
                              {isAr ? "تحويل للسحب" : "Send to Phlebotomy"}
                            </button>
                          )}
                          <button 
                            onClick={() => toast.info(isAr ? "جاري إعادة طباعة ملصق الطلب والباركود..." : "Re-printing barcode requisition...")}
                            className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 text-[10px] font-bold rounded-lg cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5 inline mr-1" /> Barcode
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. COLLECTION & BARCODE TAB */}
      {activeTab === "collection" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Barcode className="w-5 h-5 text-indigo-600" />
              {isAr ? "محطة سحب العينات وتوليد الباركود" : "Phlebotomy & Specimen Labeling Station"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Order for Collection</label>
                <select 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none"
                  value={selectedOrder?.id || ""}
                  onChange={e => setSelectedOrder(labOrders.find(o => o.id === e.target.value))}
                >
                  <option value="">-- Choose Pending Order --</option>
                  {pendingOrders.map(o => (
                    <option key={o.id} value={o.id}>{o.id} - {o.patientName} ({o.orderName || o.itemName})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Specimen Tube Type</label>
                  <select 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    value={collectionForm.tubeColor}
                    onChange={e => setCollectionForm({ ...collectionForm, tubeColor: e.target.value })}
                  >
                    <option value="Purple (EDTA)">Purple Top (EDTA - Hematology)</option>
                    <option value="Gold (SST Gel)">Gold Top (SST Gel - Chemistry)</option>
                    <option value="Light Blue (Sodium Citrate)">Light Blue (Citrate - Coagulation)</option>
                    <option value="Red (Plain Serum)">Red Top (Plain Serum - Serology)</option>
                    <option value="Green (Lithium Heparin)">Green Top (Heparin - Blood Gas)</option>
                    <option value="Grey (Fluoride)">Grey Top (Fluoride - Glucose)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Collector Staff Name</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    value={collectionForm.phlebotomist}
                    onChange={e => setCollectionForm({ ...collectionForm, phlebotomist: e.target.value })}
                  />
                </div>
              </div>

              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-indigo-900">Generate 2D DataMatrix Barcode</p>
                  <p className="text-[10px] text-indigo-600 font-medium">Auto-generated accession number for analyzer routing</p>
                </div>
                <button 
                  onClick={() => {
                    setCollectionForm({ ...collectionForm, barcodeGenerated: true });
                    toast.success(isAr ? "تم توليد وطباعة الباركود بنجاح" : "Barcode printed!");
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-black rounded-xl hover:bg-indigo-700 cursor-pointer"
                >
                  Print Label
                </button>
              </div>

              {selectedOrder && (
                <button 
                  onClick={() => {
                    handleUpdateOrderStatus(selectedOrder.id, "Processing");
                    toast.success(isAr ? "تم تسجيل سحب العينة وإرسالها إلى المختبر" : "Specimen drawn & dispatched to Lab Receiving!");
                  }}
                  className="w-full py-3.5 bg-emerald-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl hover:bg-emerald-700 cursor-pointer"
                >
                  Confirm Collection & Dispatch
                </button>
              )}
            </div>
          </div>

          {/* Barcode Preview Simulator */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Thermal Barcode Printer Preview</span>
                <span className="text-[10px] font-mono text-slate-400">Zebra ZD421 (203 DPI)</span>
              </div>

              <div className="p-6 bg-white text-slate-900 rounded-2xl border-4 border-dashed border-slate-700 shadow-inner space-y-3 font-mono">
                <div className="flex justify-between items-start border-b border-slate-200 pb-2">
                  <div>
                    <p className="text-xs font-black">{selectedOrder?.patientName || "AL-SAYED, AHMAD H."}</p>
                    <p className="text-[10px] font-bold text-slate-600">MRN: {selectedOrder?.mrn || "MRN-90210"} • DOB: 1985-04-12</p>
                  </div>
                  <span className="text-[10px] font-black bg-slate-900 text-white px-2 py-0.5 rounded">
                    {selectedOrder?.priority || "STAT"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <div>
                    <p className="text-sm font-black text-indigo-900">{selectedOrder?.orderName || "CBC + Diff + Platelet"}</p>
                    <p className="text-[10px] font-bold text-slate-500">Tube: {collectionForm.tubeColor}</p>
                    <p className="text-[9px] text-slate-400">Draw: {safeFormatDate(new Date(), "yyyy-MM-dd HH:mm")}</p>
                  </div>

                  <div className="text-center bg-slate-100 p-2 rounded border border-slate-300">
                    <Barcode className="w-16 h-10 text-slate-900 mx-auto" />
                    <span className="text-[9px] font-black tracking-widest">{selectedOrder?.id || "LAB-2026-9011"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center text-xs text-slate-400">
              <span>Status: Ready to Scan</span>
              <span className="text-emerald-400 font-bold">● Tube Color Code Matched</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. SPECIMEN RECEIVING TAB */}
      {activeTab === "receiving" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              {isAr ? "مكتب استقبال العينات وفحص الجودة الأولية" : "Specimen Receiving & Accessioning Check-in"}
            </h3>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {processingOrders.length} Specimens Arrived
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processingOrders.map(ord => (
              <div key={ord.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 hover:border-indigo-300 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-black text-slate-900">{ord.patientName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">MRN: {ord.mrn} • Accession: {ord.id}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded uppercase">
                    {ord.subcategory || "Chemistry"}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-indigo-900">{ord.orderName || ord.itemName}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Ordered by: {ord.doctorId || "Attending Physician"}</p>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      toast.success(isAr ? "تم قبول العينة وتحويلها لجهاز التحليل" : "Specimen Accepted & Routed to Analyzer!");
                    }}
                    className="flex-1 py-2 bg-emerald-600 text-white font-black text-xs rounded-xl hover:bg-emerald-700 cursor-pointer"
                  >
                    Accept Sample
                  </button>
                  <button 
                    onClick={() => handleRejectSpecimen(ord)}
                    className="flex-1 py-2 bg-rose-600 text-white font-black text-xs rounded-xl hover:bg-rose-700 cursor-pointer"
                  >
                    Reject Sample
                  </button>
                </div>
              </div>
            ))}

            {processingOrders.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-400 font-bold">
                No new specimens currently waiting at receiving bay.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. SPECIMEN TRACKING TIMELINE */}
      {activeTab === "tracking" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-8 animate-in fade-in duration-300">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            {isAr ? "تتبع العينة لحظة بلحظة (8-Stage Specimen Lifecycle)" : "End-to-End Specimen Tracking Timeline"}
          </h3>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-sm font-black text-slate-900">Accession: LAB-2026-8802 • Patient: Salma Mohammed</p>
                <p className="text-xs text-slate-500">Test: Comprehensive Metabolic Panel (CMP) • Priority: STAT</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full">
                Current Stage: Analyzer Processing
              </span>
            </div>

            {/* 8-Stage Visual Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 pt-4">
              {[
                { stage: "1. Ordered", time: "10:00 AM", done: true },
                { stage: "2. Collected", time: "10:12 AM", done: true },
                { stage: "3. In Transit", time: "10:18 AM", done: true },
                { stage: "4. Received", time: "10:24 AM", done: true },
                { stage: "5. Centrifuged", time: "10:28 AM", done: true },
                { stage: "6. Analyzer", time: "10:32 AM", done: true, current: true },
                { stage: "7. Validation", time: "Pending", done: false },
                { stage: "8. Released", time: "Pending", done: false },
              ].map((step, idx) => (
                <div key={idx} className={`p-3 rounded-xl border text-center ${step.current ? "bg-indigo-600 text-white border-indigo-600 shadow-md" : step.done ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-white border-slate-200 text-slate-400"}`}>
                  <p className="text-[10px] font-black uppercase">{step.stage}</p>
                  <p className="text-[9px] font-mono mt-1 opacity-80">{step.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. SAMPLE REJECTIONS TAB */}
      {activeTab === "rejections" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              {isAr ? "سجل ومتابعة العينات المرفوضة وإعادة السحب" : "Specimen Rejection & Redraw Management"}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                <tr>
                  <th className="p-4">{isAr ? "سجل الرفض" : "Rejection ID"}</th>
                  <th className="p-4">{isAr ? "المريض" : "Patient Name"}</th>
                  <th className="p-4">{isAr ? "الفحص" : "Test Name"}</th>
                  <th className="p-4">{isAr ? "سبب الرفض" : "Rejection Reason"}</th>
                  <th className="p-4">{isAr ? "الشخص الرافض" : "Rejected By"}</th>
                  <th className="p-4 text-right">{isAr ? "طلب إعادة السحب" : "Redraw Trigger"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {rejectionsList.map(rej => (
                  <tr key={rej.id} className="hover:bg-slate-50">
                    <td className="p-4 font-black font-mono text-slate-900">{rej.id}</td>
                    <td className="p-4 font-bold">{rej.patientName} <span className="text-slate-400">({rej.mrn})</span></td>
                    <td className="p-4 text-indigo-700 font-bold">{rej.testName}</td>
                    <td className="p-4 text-rose-600 font-bold">{rej.reason}</td>
                    <td className="p-4 text-slate-600">{rej.rejectedBy}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => toast.success(isAr ? "تم إرسال إشعار طلب إعادة السحب لتمريض القسم" : "Redraw request sent to Ward Nurse!")}
                        className="px-3 py-1.5 bg-rose-600 text-white font-bold text-[10px] uppercase rounded-lg hover:bg-rose-700 cursor-pointer"
                      >
                        Request Redraw
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. TEST PROCESSING & QUEUES */}
      {activeTab === "processing" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <TestTube className="w-5 h-5 text-indigo-600" />
            {isAr ? "قوائم تشغيل التحاليل حسب التخصص (Specialty Work Queues)" : "Laboratory Processing Work Queues"}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              "Chemistry", "Hematology", "Coagulation", "Immunology", "Hormones", "Urinalysis"
            ].map(qName => (
              <button 
                key={qName} 
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50/50 text-left cursor-pointer transition-all"
              >
                <p className="text-xs font-black text-slate-800">{qName}</p>
                <p className="text-xl font-black text-indigo-600 mt-2">12 <span className="text-[10px] font-normal text-slate-400">jobs</span></p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 8. ANALYZER INTERFACES */}
      {activeTab === "analyzers" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            {isAr ? "ربط وشبكة أجهزة المختبر (ASTM / HL7 Middleware)" : "Analyzer Middleware & ASTM/HL7 Interfaces"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyzers.map((dev, idx) => (
              <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">{dev.name}</h4>
                    <p className="text-xs text-slate-500 font-mono">{dev.vendor} • Protocol: {dev.protocol}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black ${dev.status === "Online" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                    {dev.status}
                  </span>
                </div>

                <div className="p-3 bg-slate-900 text-slate-300 font-mono text-[10px] rounded-xl overflow-hidden leading-relaxed">
                  <p className="text-emerald-400">// Live HL7 Stream snippet</p>
                  <p>MSH|^~\&|RocheCobas|LAB|HIS|HOSP|20260727...</p>
                  <p>OBX|1|NM|GLU^Glucose||108|mg/dL|70-110|N|||F</p>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-600">Active Jobs: {dev.activeJobs}</span>
                  <button 
                    onClick={() => toast.info(`Ping tested for ${dev.name}: Connected OK`)}
                    className="px-3 py-1 bg-slate-200 text-slate-800 rounded-lg font-bold hover:bg-slate-300 cursor-pointer"
                  >
                    Test Line
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. RESULT ENTRY & VALIDATION TAB */}
      {activeTab === "results" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Microscope className="w-5 h-5 text-indigo-600" />
              {isAr ? "شاشة إدخال واعتماد نتائج التحاليل" : "Result Entry, Delta Check & Two-Tier Validation"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Order to Review Result</label>
                <select 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800"
                  value={selectedOrder?.id || ""}
                  onChange={e => setSelectedOrder(labOrders.find(o => o.id === e.target.value))}
                >
                  <option value="">-- Choose Processing Specimen --</option>
                  {processingOrders.map(o => (
                    <option key={o.id} value={o.id}>{o.id} - {o.patientName} ({o.orderName || o.itemName})</option>
                  ))}
                </select>
              </div>

              {selectedOrder && (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Patient</span>
                      <p className="font-black text-slate-900">{selectedOrder.patientName}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">MRN</span>
                      <p className="font-black text-slate-900">{selectedOrder.mrn}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Test</span>
                      <p className="font-black text-indigo-700">{selectedOrder.orderName || selectedOrder.itemName}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Priority</span>
                      <p className="font-black text-rose-600">{selectedOrder.priority || "Routine"}</p>
                    </div>
                  </div>

                  {/* Delta Check Warning Box */}
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="font-black">Delta Check Comparison Active</p>
                        <p className="text-[11px] text-amber-800">Previous result on 2026-07-20 was 88 mg/dL.</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-200 text-amber-900 font-mono text-[10px] font-black rounded">
                      Delta &lt; 15%
                    </span>
                  </div>

                  {/* Result Values Form */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Measured Result Value</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 142" 
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl font-mono text-lg font-black text-slate-900 outline-none focus:border-indigo-500"
                        value={resultValue}
                        onChange={e => setResultValue(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Unit</label>
                      <input 
                        type="text" 
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800"
                        value={resultUnit}
                        onChange={e => setResultUnit(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Reference Range</label>
                      <input 
                        type="text" 
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800"
                        value={refRange}
                        onChange={e => setRefRange(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Flag selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Result Flag</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(["normal", "high", "low", "critical"] as const).map(f => (
                        <button
                          key={f}
                          onClick={() => setResultFlag(f)}
                          className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer border ${
                            resultFlag === f 
                              ? f === "critical" ? "bg-rose-600 text-white border-rose-600" : "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={handleSubmitResult}
                    className="w-full py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 cursor-pointer"
                  >
                    Validate, Release & Auto-Bill
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recently Validated Results Feed */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              {isAr ? "النتائج المعتمدة مؤخراً" : "Recently Validated Lab Reports"}
            </h3>

            <div className="space-y-3">
              {labResults.map(res => (
                <div key={res.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-black text-slate-800">{res.testName}</p>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${res.flag === "critical" ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"}`}>
                      {res.flag}
                    </span>
                  </div>
                  <p className="text-sm font-black font-mono text-indigo-900">{res.value} {res.unit}</p>
                  <p className="text-[10px] text-slate-400">Validated by: {res.performedBy} @ {safeFormatDate(res.date, "HH:mm")}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 10. CRITICAL CALL MANAGER (PANIC VALUES) */}
      {activeTab === "critical" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              {isAr ? "توثيق الاتصال بالنتائج الحرجة (JCI Critical Value Log)" : "Critical Value / Panic Value Call Documentation"}
            </h3>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              Mandatory Read-Back Verification
            </span>
          </div>

          <div className="space-y-4">
            {criticalCallLogs.map(call => (
              <div key={call.id} className="p-5 bg-rose-50/50 border-2 border-rose-200 rounded-2xl space-y-3">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div>
                    <p className="text-sm font-black text-rose-950">{call.patientName} • {call.testName}</p>
                    <p className="text-xs font-black font-mono text-rose-700">Result: {call.value}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-600 text-white font-bold text-[10px] uppercase rounded-full">
                    ✓ Read-Back Confirmed
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-slate-700 pt-2 border-t border-rose-200">
                  <p>Physician Notified: <span className="font-black text-slate-900">{call.physicianName}</span></p>
                  <p>Call Timestamp: <span className="font-mono">{safeFormatDate(call.callTime, "yyyy-MM-dd HH:mm:ss")}</span></p>
                  <p>Caller Staff: <span className="font-black text-slate-900">{call.calledBy}</span></p>
                </div>

                {call.notes && (
                  <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-rose-100 font-medium">
                    Clinical Action Taken: {call.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11. SPECIALTY LABS (Microbiology, Blood Bank, Histopathology, Molecular) */}
      {activeTab === "specialty" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Microbiology Panel */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Dna className="w-5 h-5 text-indigo-600" />
                {isAr ? "علم الأحياء الدقيقة والحساسية (Microbiology & Antibiogram)" : "Microbiology Culture & Antibiogram Builder"}
              </h3>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs font-bold">
                <p>Specimen: <span className="text-indigo-700">{microData.specimen}</span></p>
                <p>Organism Isolated: <span className="text-rose-700 font-black">{microData.organism}</span> ({microData.colonyCount})</p>
                <p>Gram Stain: <span className="text-slate-800">{microData.gramStain}</span></p>

                <p className="font-black text-slate-900 pt-2 uppercase">Antibiogram Sensitivity Panel</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left bg-white rounded-xl border border-slate-200 text-xs">
                    <thead className="bg-slate-100 text-[10px] font-black uppercase text-slate-500">
                      <tr>
                        <th className="p-2">Antibiotic</th>
                        <th className="p-2">Result</th>
                        <th className="p-2">MIC Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {microData.antibiogram.map((ab, idx) => (
                        <tr key={idx}>
                          <td className="p-2 font-bold">{ab.antibiotic}</td>
                          <td className="p-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${ab.sensitivity === "Sensitive" ? "bg-emerald-100 text-emerald-800" : ab.sensitivity === "Resistant" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"}`}>
                              {ab.sensitivity}
                            </span>
                          </td>
                          <td className="p-2 font-mono text-slate-600">{ab.mic}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Blood Bank Module */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-rose-600" />
                {isAr ? "بنك الدم وفحص المطابقة (Blood Bank Crossmatching)" : "Blood Bank & Immunohematology Compatibility"}
              </h3>

              <div className="p-4 bg-rose-50/40 rounded-2xl border border-rose-200 space-y-3 text-xs font-bold">
                <div className="flex justify-between items-center">
                  <span>Patient Blood Type:</span>
                  <span className="px-3 py-1 bg-rose-600 text-white font-black rounded-lg">{bloodBankData.patientBloodType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Donor PRBC Unit ID:</span>
                  <span className="font-mono text-slate-900">{bloodBankData.donorUnitId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Major/Minor Crossmatch:</span>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-black rounded">{bloodBankData.crossmatchResult}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Antibody Screen:</span>
                  <span className="font-black text-slate-800">{bloodBankData.antibodyScreen}</span>
                </div>

                <button 
                  onClick={() => toast.success(isAr ? "تم إصدار وحدة الدم للعمليات بنجاح" : "Blood Unit Released for Transfusion!")}
                  className="w-full mt-4 py-3 bg-rose-600 text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-rose-700 cursor-pointer"
                >
                  Issue Blood Unit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 12. QUALITY CONTROL & LEVEY-JENNINGS */}
      {activeTab === "qc" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              {isAr ? "مراقبة الجودة اليومية ومخطط Levey-Jennings" : "Daily QC & Levey-Jennings Chart (Westgard Rules)"}
            </h3>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
              Westgard 1-2s Passed
            </span>
          </div>

          <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-4">
            <p className="text-xs font-black text-indigo-400 uppercase">Levey-Jennings Control Plot - Glucose Level II Control</p>

            {/* LJ Visual Graphic */}
            <div className="h-48 bg-slate-950 rounded-xl p-4 flex flex-col justify-between font-mono text-[10px] border border-slate-800 relative overflow-hidden">
              <div className="flex justify-between border-b border-rose-500/40 text-rose-400"><span>+3 SD (120)</span></div>
              <div className="flex justify-between border-b border-amber-500/40 text-amber-400"><span>+2 SD (110)</span></div>
              <div className="flex justify-between border-b border-emerald-500/40 text-emerald-400 font-bold"><span>MEAN (100)</span></div>
              <div className="flex justify-between border-b border-amber-500/40 text-amber-400"><span>-2 SD (90)</span></div>
              <div className="flex justify-between border-b border-rose-500/40 text-rose-400"><span>-3 SD (80)</span></div>

              {/* Data points plot line overlay simulation */}
              <div className="absolute inset-0 flex items-center justify-around px-8 pointer-events-none">
                {[101, 99, 103, 98, 102, 100, 104, 97].map((val, idx) => (
                  <div key={idx} className="w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 shadow-sm" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 13. INVENTORY & REAGENTS */}
      {activeTab === "inventory" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            {isAr ? "مخزون الكواشف والمستلزمات المخبرية" : "Laboratory Reagent Stock & Lot Expiry Tracking"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Cobas Glucose HK Reagent Cassette", lot: "LOT-99201", exp: "2026-11-30", stock: "14 Kits", status: "Adequate" },
              { name: "Sysmex Cellpack DCL Diluent", lot: "LOT-88102", exp: "2026-09-15", stock: "4 Drums", status: "Low Stock" },
              { name: "Anti-A Blood Typing Monoclonal Serum", lot: "LOT-77001", exp: "2027-01-10", stock: "20 Vials", status: "Adequate" },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <p className="text-xs font-black text-slate-900">{item.name}</p>
                <p className="text-[10px] text-slate-500 font-mono">Lot: {item.lot} • Expiry: {item.exp}</p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-black text-indigo-700">{item.stock}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-black rounded ${item.status === "Low Stock" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 14. EQUIPMENT MANAGEMENT */}
      {activeTab === "equipment" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-indigo-600" />
            {isAr ? "إدارة وصيانة ومعايرة الأجهزة" : "Instrument Maintenance & Calibration Schedule"}
          </h3>

          <div className="space-y-4">
            {analyzers.map((dev, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-sm font-black text-slate-900">{dev.name}</p>
                  <p className="text-xs text-slate-500">Next PM Due: 2026-08-15 • Calibration Status: Validated</p>
                </div>
                <button 
                  onClick={() => toast.success(`Maintenance log updated for ${dev.name}`)}
                  className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 cursor-pointer"
                >
                  Log Preventive Maintenance
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 15. STAFF & ROSTER */}
      {activeTab === "staff" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            {isAr ? "جدول الفنيين والوردية المخبرية" : "Laboratory Technologist Roster & Workload Distribution"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Tech. Sarah Johnson", role: "Senior Chemist", shift: "Morning Shift (07:00 - 15:00)", samplesHandled: 84 },
              { name: "Tech. Khaled Al-Ghamdi", role: "Hematology Lead", shift: "Morning Shift (07:00 - 15:00)", samplesHandled: 62 },
              { name: "Tech. Reem Al-Mansoori", role: "Microbiologist", shift: "Evening Shift (15:00 - 23:00)", samplesHandled: 35 },
            ].map((staff, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <p className="text-xs font-black text-slate-900">{staff.name}</p>
                <p className="text-[10px] text-indigo-700 font-bold">{staff.role}</p>
                <p className="text-[10px] text-slate-500">{staff.shift}</p>
                <p className="text-xs font-black text-slate-800 pt-2">{staff.samplesHandled} Specimens Validated Today</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 16. AUDIT & REPORTS TAB */}
      {activeTab === "audit_reports" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            {isAr ? "سجل العمليات والتقارير الشاملة (JCI Audit Trail)" : "Laboratory System Audit Logs & Accreditation Reports"}
          </h3>

          <div className="p-4 bg-slate-900 text-slate-200 font-mono text-xs rounded-2xl space-y-2 max-h-96 overflow-y-auto">
            <p className="text-emerald-400">[2026-07-27 16:40:12] AUDIT: Lab Result LAB-8802 validated by Tech. Sarah Johnson. Flag: NORMAL</p>
            <p className="text-indigo-400">[2026-07-27 16:32:04] AUDIT: Critical Value alert CAL-1001 acknowledged by Dr. Tariq Al-Mansoor</p>
            <p className="text-amber-400">[2026-07-27 16:15:22] AUDIT: Specimen REJ-801 rejected reason: Hemolyzed Sample</p>
          </div>
        </div>
      )}

      {/* PULL REQUESTS MODAL (INCOMING DEPARTMENT ORDERS) */}
      {showPullRequestsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in" dir={isAr ? "rtl" : "ltr"}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-4xl space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <DownloadCloud className="w-6 h-6 text-indigo-600" />
                  {isAr ? "قائمة الطلبات الواردة من أقسام المستشفى (Pull Requests)" : "Incoming Department Pull Requests"}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {isAr 
                    ? "استقبال واستلام الفحوصات المخبرية الصادرة إلكترونياً من أطباء العيادات، الطوارئ، التنويم، العمليات والعناية" 
                    : "Electronic orders sent by physicians from OPD, ER, IPD Wards, OR, and ICU"}
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
                      ? "bg-indigo-600 text-white shadow-sm font-black" 
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
                    <th className="p-3.5">{isAr ? "القسم والمصدر" : "Dept & Source"}</th>
                    <th className="p-3.5">{isAr ? "المريض" : "Patient"}</th>
                    <th className="p-3.5">{isAr ? "الفحص المطلوب" : "Test Requested"}</th>
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
                            <span className="font-mono font-black text-indigo-900 block">{req.id}</span>
                            <span className="text-[10px] text-slate-400 font-mono block">{safeFormatDate(req.createdAt, "HH:mm yyyy-MM-dd")}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-bold text-slate-800 block">{isAr ? req.departmentAr : req.departmentEn}</span>
                            <span className="text-[10px] text-indigo-600 block">{req.doctorName}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-black text-slate-900 block">{req.patientName}</span>
                            <span className="text-[10px] font-mono text-slate-400 block">{req.mrn}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold rounded-lg block w-fit">
                              {req.testName}
                            </span>
                            {req.notes && <span className="text-[10px] text-slate-400 italic block mt-0.5">{req.notes}</span>}
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
                                onClick={() => handleClaimRequest(req)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 mx-auto"
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
