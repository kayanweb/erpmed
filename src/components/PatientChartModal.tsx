import React, { createElement, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, User, Activity, FileText, Pill, FlaskConical, Stethoscope, 
  Clock, ShieldAlert, BadgeCheck, Printer, ArrowLeft, 
  Calendar, Droplets, Thermometer, HeartPulse, FileEdit, Plus, Syringe,
  Share, CheckCircle2, QrCode, ClipboardList, Upload, Ban, History as HistoryIcon,
  Siren, Eye, LogOut, Zap, LifeBuoy, Wind, LayoutGrid, Monitor, ClipboardCheck,
  AlertTriangle, Receipt, CreditCard, ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import GenericClinicalTab from "./GenericClinicalTab";
import ClinicalFormsLibrary from "./ClinicalFormsLibrary";
import { ClinicalDocumentation } from "./ClinicalDocumentation";
import DoctorConsultationDesk from "./DoctorConsultationDesk";
import { NursingConsole } from "./NursingConsole";
import { ClinicalFormsEngine } from "./ClinicalFormsEngine";
import { useHIS } from "../context/HISContext";
import { EXTENDED_LAB_TESTS } from "../data/labTests";
import { DEFAULT_CATALOG as DEFAULT_LAB_CATALOG } from "../data/labCatalog";
import { INVENTORY_CATALOG, InventoryItem } from "../data/inventoryCatalog";
import { RadiologyOrderForm } from "./RadiologyOrderForm";
import { PatientNutritionTab } from "./PatientNutritionTab";
import { EnterpriseReportCenter } from "./EnterpriseReportCenter";
import { ClinicalSnapshot } from "./ClinicalSnapshot";
import { UnifiedClinicalTimeline } from "./UnifiedClinicalTimeline";
import { PatientManagementWorkflows } from "./PatientManagementWorkflows";

export function PatientChartModal({ patientId, patientName, onClose, isAr, initialTab = "summary", isEmbedded = false }: any) {
  const { 
    patients, 
    updatePatient, 
    cpoeOrders, 
    setCpoeOrders, 
    addPrescription, 
    updatePrescriptionStatus,
    currentUser,
    logAudit,
    getSetting,
    saveSetting
  } = useHIS();
  const currentPatient = (
    patients.find(
      (p) =>
        p.id === patientId ||
        p.mrn === patientId ||
        (patientName && (p.nameEn === patientName || p.nameAr === patientName || p.id === patientName || p.mrn === patientName))
    ) || {
      id: patientId || "PAT-001",
      mrn: patientId || "MRN-001",
      nameEn: patientName || "Patient Record",
      nameAr: patientName || "ملف المريض",
    }
  ) as any;

  const [showDocForm, setShowDocForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [transferStatus, setTransferStatus] = useState<string | null>(null);
  const [patientDiet, setPatientDiet] = useState<any>(null);

  useEffect(() => {
    // Diets and catalogs should be fetched from context or API in a real HIS
    if ((currentPatient as any).diet) {
      setPatientDiet((currentPatient as any).diet);
    }
  }, [patientId, currentPatient]);

  // Dynamic User Role Logic
  const userRole = currentUser?.role || "admin";

  const getInitialTabForRole = () => {
    if (initialTab !== "summary") return initialTab; // Respect forced initial tab
    switch (userRole) {
      case "doctor": return "emr";
      case "staff": return "nursing"; // Nurses see nursing notes/flowsheets first
      case "lab": return "lab";
      case "reception": return "timeline";
      default: return "summary";
    }
  };

  const [activeTab, setActiveTab] = useState(getInitialTabForRole());
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);
  const [showNurseNoteForm, setShowNurseNoteForm] = useState(false);
  const [showOrderLabForm, setShowOrderLabForm] = useState(false);
  const [showOrderRadForm, setShowOrderRadForm] = useState(false);
  const [showPrescribeForm, setShowPrescribeForm] = useState(false);
  
  // Custom lab catalog state
  const [labCatalog, setLabCatalog] = useState(DEFAULT_LAB_CATALOG);

  useEffect(() => {
    getSetting("hospital_test_catalog").then(saved => {
      if (saved) setLabCatalog(saved);
    });
  }, [getSetting]);

  // Dedicated inputs for quick action forms
  const [quickNurseText, setQuickNurseText] = useState("");
  const [quickLabName, setQuickLabName] = useState("");
  const [labSearchFocus, setLabSearchFocus] = useState(false);
  const [labPriority, setLabPriority] = useState("Routine");
  const [labDate, setLabDate] = useState(new Date().toISOString().split('T')[0]);
  const [labTime, setLabTime] = useState(new Date().toTimeString().split(' ')[0].substring(0, 5));
  const [labAck, setLabAck] = useState(true);
  const [quickRadName, setQuickRadName] = useState("Chest X-Ray Portable (أشعة صدر متنقلة)");
  const [quickDrugName, setQuickDrugName] = useState("");
  const [quickDrugDose, setQuickDrugDose] = useState("500mg PO BID");

  // Structured drug prescription states
  const [quickDrugDoseNum, setQuickDrugDoseNum] = useState("500");
  const [quickDrugDoseUnit, setQuickDrugDoseUnit] = useState("mg");
  const [quickDrugRoute, setQuickDrugRoute] = useState("PO");
  const [quickDrugFrequency, setQuickDrugFrequency] = useState("BID");
  const [quickDrugOrderType, setQuickDrugOrderType] = useState("routine"); // "routine" | "stat" | "prn"
  const [quickDrugPrnReason, setQuickDrugPrnReason] = useState("");
  const [quickDrugDuration, setQuickDrugDuration] = useState("5"); // days
  const [quickDrugStartDate, setQuickDrugStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [quickDrugStartTime, setQuickDrugStartTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [quickDrugSpecialInstructions, setQuickDrugSpecialInstructions] = useState("");

  // Exception dialog states
  const [notGivenState, setNotGivenState] = useState<{ rxId: string, slot: string } | null>(null);
  const [discontinueRxId, setDiscontinueRxId] = useState<string | null>(null);
  const [selectedHoldReason, setSelectedHoldReason] = useState("patient_out");
  const [holdNotes, setHoldNotes] = useState("");
  const [selectedDiscontinueReason, setSelectedDiscontinueReason] = useState("allergy");

  // States for interactive tabs
  const [noteText, setNoteText] = useState("");
  const [nurseNoteText, setNurseNoteText] = useState("");
  
  // Radiology (PACS)
  const [selectedStudyIdx, setSelectedStudyIdx] = useState(0);
  const [radSlice, setRadSlice] = useState(12);
  const [radContrast, setRadContrast] = useState(1.0);
  const [radZoom, setRadZoom] = useState(100);

  // Assessments
  const [gcsEye, setGcsEye] = useState(4);
  const [gcsVerbal, setGcsVerbal] = useState(5);
  const [gcsMotor, setGcsMotor] = useState(6);

  // Intake & Output
  const [ioIntakeAmt, setIoIntakeAmt] = useState("");
  const [ioOutputAmt, setIoOutputAmt] = useState("");

  // Consumables Logic
  const [consumableSearchTerm, setConsumableSearchTerm] = useState("");
  const [selectedConsumable, setSelectedConsumable] = useState<InventoryItem | null>(null);
  const [consumableQty, setConsumableQty] = useState(1);
  const [selectedStore, setSelectedStore] = useState("Sub-Store (Nursing)");

  const filteredInventory = INVENTORY_CATALOG.filter(item => 
    item.nameEn.toLowerCase().includes(consumableSearchTerm.toLowerCase()) ||
    item.nameAr.includes(consumableSearchTerm)
  );

  const handleRecordConsumable = () => {
    if (!selectedConsumable) return;
    
    const billedConsumables = (currentPatient as any).consumables || [];
    const newConsumable = {
      id: "CON-" + Date.now(),
      itemId: selectedConsumable.id,
      nameEn: selectedConsumable.nameEn,
      nameAr: selectedConsumable.nameAr,
      qty: consumableQty,
      unit: selectedConsumable.unit,
      price: selectedConsumable.price,
      total: selectedConsumable.price * consumableQty,
      store: selectedStore,
      recordedBy: currentUser?.nameAr || currentUser?.nameEn || "Nursing Staff",
      date: new Date().toLocaleString()
    };

    updatePatient(currentPatient.id, { 
      consumables: [newConsumable, ...billedConsumables]
    });

    toast.success(isAr ? "تم تسجيل المستهلك وخصمه من المخزن" : `Billed ${consumableQty} ${selectedConsumable.unit} of ${selectedConsumable.nameEn} to patient.`);
    
    // Reset form
    setSelectedConsumable(null);
    setConsumableQty(1);
    setConsumableSearchTerm("");
  };

  // New States for Vitals, Labs, and orders
  const [vitalsSysBP, setVitalsSysBP] = useState("120");
  const [vitalsDiaBP, setVitalsDiaBP] = useState("80");
  const [vitalsHR, setVitalsHR] = useState("75");
  const [vitalsTemp, setVitalsTemp] = useState("37.0");
  const [vitalsSpO2, setVitalsSpO2] = useState("98");
  const [vitalsRR, setVitalsRR] = useState("16");
  const [selectedLabReportId, setSelectedLabReportId] = useState("");

  const currentIntakes = (currentPatient as any).fluidIntake || [
    { id: "in1", type: isAr ? "فموي (ماء)" : "Oral (Water)", amount: 250, date: "08:00" },
    { id: "in2", type: isAr ? "وريدي (محلول ملحي)" : "IV Fluids (Normal Saline)", amount: 500, date: "10:30" }
  ];
  const currentOutputs = (currentPatient as any).fluidOutput || [
    { id: "out1", type: isAr ? "بول" : "Urine", amount: 350, date: "09:00" }
  ];

  const ioIntakeTotal = currentIntakes.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);
  const ioOutputTotal = currentOutputs.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);

  const clinicalStudies = [
    ...(((currentPatient as any).orders || [])
      .filter((o: any) => o.type === "RAD" && o.status === "Completed")
      .map((o: any) => ({
        id: o.id,
        type: o.name,
        date: o.completedAt?.split(",")[0] || o.date || "2026-06-30",
        status: "Completed",
        size: o.name?.toLowerCase()?.includes("x-ray") ? "1 slice" : "24 slices",
        findings: o.findings,
        impression: o.impression,
        isDynamic: true
      }))),
    { id: "rad1", type: "CT Brain W/O Contrast", date: "2026-06-29", status: "Completed", size: "24 slices", findings: "Normal brain parenchyma. No intracranial hemorrhage, midline shift, or mass effect.", impression: "Unremarkable CT Brain." },
    { id: "rad2", type: "Chest X-Ray Portable", date: "2026-06-28", status: "Completed", size: "1 slice", findings: "Mild bilateral basal infiltrates. Cardiomegaly is stable. Lungs are otherwise clear.", impression: "Stable chest radiograph with mild fluid retention." }
  ];

  const handleSaveProgressNote = () => {
    if (!noteText.trim()) return;
    const notes = (currentPatient as any).progressNotes || [
      { id: "pn1", author: "Dr. Ahmed Ali (Cardiology)", text: isAr ? "حالة المريض مستقرة بعد العملية. العلامات الحيوية جيدة." : "Patient status is stable post-op. Vital signs are within normal limits.", date: "2026-06-29 09:00" },
      { id: "pn2", author: "Dr. Samir Hassan (Consultant)", text: isAr ? "يجب مراقبة مستويات السكر في الدم وضبط جرعة الأنسولين." : "Monitor blood glucose levels and adjust Insulin dosage accordingly.", date: "2026-06-29 14:30" }
    ];
    const newNote = {
      id: "pn-" + Date.now(),
      author: isAr ? "د. أحمد علي (أمراض القلب)" : "Dr. Ahmed Ali (Cardiology)",
      text: noteText,
      date: new Date().toLocaleString()
    };
    updatePatient(currentPatient.id, { progressNotes: [newNote, ...notes] });
    setNoteText("");
    toast.success(isAr ? "تم تسجيل وتوقيع ملاحظة التطور بنجاح" : "Progress note logged and E-signed successfully!");
  };

  const handleSaveNurseNote = () => {
    if (!nurseNoteText.trim()) return;
    const notes = (currentPatient as any).nursingNotes || [
      { id: "nn1", author: "RN. Sarah Jones", text: isAr ? "تم إعطاء الأدوية الوريدية المقررة في موعدها. المريض لا يعاني من ألم." : "Prescribed IV medications administered on time. Patient reports no pain.", date: "2026-06-30 08:00" },
      { id: "nn2", author: "RN. Fatima Saeed", text: isAr ? "تم تغيير ضماد الجرح الجراحي. الجرح نظيف ولا توجد علامات التهاب." : "Surgical wound dressing changed. Wound is clean, no signs of infection.", date: "2026-06-30 11:30" }
    ];
    const newNote = {
      id: "nn-" + Date.now(),
      author: isAr ? "ممرض. فاطمة سعيد" : "RN. Fatima Saeed",
      text: nurseNoteText,
      date: new Date().toLocaleString()
    };
    updatePatient(currentPatient.id, { nursingNotes: [newNote, ...notes] });
    setNurseNoteText("");
    toast.success(isAr ? "تم تسجيل الملاحظة التمريضية بنجاح" : "Nursing observation note logged successfully!");
  };

  const handleSaveAssessment = (type: string, score: number) => {
    const assessments = (currentPatient as any).assessments || {};
    const updated = {
      ...assessments,
      [type]: {
        score,
        date: new Date().toLocaleString()
      }
    };
    updatePatient(currentPatient.id, { assessments: updated });
    toast.success(isAr ? `تم حفظ تقييم ${type.toUpperCase()} بنجاح` : `${type.toUpperCase()} score of ${score} logged to EHR!`);
  };

  const handleAddIntake = () => {
    if (!ioIntakeAmt || isNaN(Number(ioIntakeAmt))) return;
    const item = {
      id: "in-" + Date.now(),
      type: isAr ? "فموي (ماء/عصير)" : "Oral Fluids",
      amount: Number(ioIntakeAmt),
      date: new Date().toLocaleTimeString().slice(0, 5)
    };
    updatePatient(currentPatient.id, { fluidIntake: [...currentIntakes, item] });
    setIoIntakeAmt("");
    toast.success(isAr ? "تم تسجيل الوارد المائي للمريض" : "Fluid intake logged successfully");
  };

  const handleAddOutput = () => {
    if (!ioOutputAmt || isNaN(Number(ioOutputAmt))) return;
    const item = {
      id: "out-" + Date.now(),
      type: isAr ? "بول / تصريف" : "Urine Output",
      amount: Number(ioOutputAmt),
      date: new Date().toLocaleTimeString().slice(0, 5)
    };
    updatePatient(currentPatient.id, { fluidOutput: [...currentOutputs, item] });
    setIoOutputAmt("");
    toast.success(isAr ? "تم تسجيل الصادر المائي للمريض" : "Fluid output logged successfully");
  };

  useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const isER = currentPatient?.status === "triage" || currentPatient?.departmentId === "er-unit" || (currentPatient as any)?.visitType === "ER";
  const isICU = currentPatient?.status === "nicu" || currentPatient?.status === "pacu" || currentPatient?.departmentId === "icu-unit" || currentPatient?.wardId === "icu";

    const tabs = [
    // Clinical Core (Always Visible)
    { id: "summary", ar: "ملخص الحالة", en: "Patient Summary", icon: LayoutGrid, section: "core" },
    { id: "timeline", ar: "التسلسل الزمني", en: "Unified Timeline", icon: Clock, section: "core" },
    
    // Clinical Documentation
    { id: "progress_notes", ar: "ملاحظات الطبيب", en: "Physician Notes", icon: FileEdit, section: "doc" },
    { id: "nursing_notes", ar: "ملاحظات التمريض", en: "Nursing Notes", icon: FileText, section: "doc" },
    { id: "emr_forms", ar: "النماذج الطبية", en: "Clinical Forms", icon: ClipboardList, section: "doc" },
    
    // Diagnostics & Orders
    { id: "orders", ar: "الأوامر الطبية", en: "CPOE / Orders", icon: Stethoscope, section: "orders" },
    { id: "medication_orders", ar: "الأدوية", en: "Medications", icon: Pill, section: "orders" },
    { id: "mar", ar: "سجل الإعطاء", en: "MAR / eMAR", icon: Activity, section: "orders" },
    { id: "labs", ar: "المختبر", en: "Laboratory", icon: FlaskConical, section: "orders" },
    { id: "radiology", ar: "الأشعة", en: "Radiology", icon: Monitor, section: "orders" },
    
    // Specialized Sections (Conditional)
    ...(isER ? [
      { id: "er_triage", ar: "الفرز الطبي", en: "ER Triage", icon: Siren, section: "specialized" },
      { id: "er_disposition", ar: "القرار الطبي", en: "ER Disposition", icon: LogOut, section: "specialized" },
    ] : []),
    ...(isICU ? [
      { id: "icu_vent", ar: "التنفس الصناعي", en: "Ventilation", icon: Wind, section: "specialized" },
      { id: "io", ar: "السوائل", en: "Intake/Output", icon: Droplets, section: "specialized" },
    ] : []),
    
    // Administrative & Billing
    { id: "billing", ar: "الفواتير والمالية", en: "Billing & Financial", icon: ClipboardCheck, section: "admin" },
    { id: "attachments", ar: "المرفقات", en: "Attachments", icon: Upload, section: "admin" },
    { id: "audit", ar: "سجل التدقيق", en: "Clinical Audit", icon: ShieldAlert, section: "admin" },
  ];

  const quickActions = [
    { id: "add_doc", ar: "توثيق طبيب", en: "Doc Note", icon: FileEdit, color: "bg-indigo-100 text-indigo-700" },
    { id: "add_nurse_note", ar: "ملاحظة تمريض", en: "Nurse Note", icon: FileText, color: "bg-sky-100 text-sky-700" },
    { id: "order_lab", ar: "طلب تحليل", en: "Order Lab", icon: FlaskConical, color: "bg-rose-100 text-rose-700" },
    { id: "order_rad", ar: "طلب أشعة", en: "Order Rad", icon: Activity, color: "bg-amber-100 text-amber-700" },
    { id: "prescribe", ar: "وصف دواء", en: "Prescribe", icon: Pill, color: "bg-emerald-100 text-emerald-700" },
    { id: "transfer", ar: "نقل مريض", en: "Transfer", icon: User, color: "bg-purple-100 text-purple-700" },
  ];

  const handleQuickAction = (actionId: string) => {
    if (actionId === "add_doc") {
      setShowDocForm(true);
    } else if (actionId === "transfer") {
      setShowTransferForm(true);
    } else if (actionId === "add_nurse_note") {
      setShowNurseNoteForm(true);
    } else if (actionId === "order_lab") {
      setShowOrderLabForm(true);
    } else if (actionId === "order_rad") {
      setShowOrderRadForm(true);
    } else if (actionId === "prescribe") {
      setShowPrescribeForm(true);
    } else {
      setActiveWorkflow(actionId);
    }
  };

  const handleDocSave = (docData: any) => {
    toast.success(isAr ? "تم حفظ التوثيق الطبي بنجاح" : "Documentation saved and orders dispatched");
    setShowDocForm(false);
    setActiveTab("progress_notes");
  };

  if (showDocForm) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-modal flex items-center justify-center p-4" dir={isAr ? "rtl" : "ltr"}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col">
          <div className="bg-slate-800 text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button onClick={() => setShowDocForm(false)} className="hover:bg-slate-700 p-2 rounded-lg transition">
                <ArrowLeft className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
              </button>
              <h2 className="font-bold text-lg">{isAr ? "توثيق طبيب (Doctor Documentation)" : "Doctor Documentation"}</h2>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
             <ClinicalDocumentation patientId={patientId} patientName={patientName} isAr={isAr} onSave={handleDocSave} />
          </div>
        </div>
      </div>
    );
  }

  if (showTransferForm) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-modal flex items-center justify-center p-4" dir={isAr ? "rtl" : "ltr"}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col animate-fade-in">
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-400" />
              {isAr ? "طلب نقل المريض (Transfer Request)" : "Transfer Request"}
            </h2>
            <button onClick={() => setShowTransferForm(false)} className="hover:bg-slate-700 p-2 rounded-lg transition">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg text-sm mb-4">
              {isAr ? "هذا الطلب سيتم إرساله إلى إدارة الأسرة (Bed Management) لتخصيص السرير المناسب حسب سياسة المستشفى. لن يتم النقل فعلياً إلا بعد التخصيص والموافقة." : "This request will be sent to Bed Management for appropriate assignment per hospital policy. Actual transfer happens only after bed allocation."}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{isAr ? "مستوى الرعاية المطلوب" : "Level of Care"}</label>
                <select className="w-full border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-indigo-500">
                  <option>Ward (جناح عادي)</option>
                  <option>HDU (عناية متوسطة)</option>
                  <option>ICU (عناية مركزة)</option>
                  <option>CCU (عناية قلب)</option>
                  <option>NICU (عناية حديثي الولادة)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{isAr ? "الأولوية" : "Priority"}</label>
                <select className="w-full border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-indigo-500">
                  <option value="normal">{isAr ? "عادي" : "Normal"}</option>
                  <option value="high">{isAr ? "عاجل" : "Urgent"}</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">{isAr ? "التشخيص المبدئي وسبب النقل" : "Initial Diagnosis & Reason"}</label>
              <input type="text" className="w-full border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-indigo-500" placeholder={isAr ? "أدخل التشخيص..." : "Enter diagnosis..."} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">{isAr ? "اشتراطات العزل" : "Isolation Requirements"}</label>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-1.5 p-2 border rounded-lg hover:bg-slate-50 cursor-pointer w-full sm:w-auto">
                  <input type="checkbox" className="text-indigo-600 rounded" />
                  <span className="text-xs font-semibold">{isAr ? "عزل تلامس (Contact)" : "Contact Isolation"}</span>
                </label>
                <label className="flex items-center gap-1.5 p-2 border rounded-lg hover:bg-slate-50 cursor-pointer w-full sm:w-auto">
                  <input type="checkbox" className="text-indigo-600 rounded" />
                  <span className="text-xs font-semibold">{isAr ? "عزل رذاذ (Droplet)" : "Droplet Isolation"}</span>
                </label>
                <label className="flex items-center gap-1.5 p-2 border rounded-lg hover:bg-slate-50 cursor-pointer w-full sm:w-auto">
                  <input type="checkbox" className="text-indigo-600 rounded" />
                  <span className="text-xs font-semibold">{isAr ? "عزل هوائي (Airborne)" : "Airborne Isolation"}</span>
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">{isAr ? "الاشتراطات السريرية (متعدد)" : "Clinical Requirements (Multiple)"}</label>
              <div className="grid grid-cols-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                <label className="flex items-center gap-1.5 p-2 border rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" className="text-indigo-600 rounded" />
                  <span className="text-xs font-semibold">{isAr ? "يحتاج أكسجين" : "Needs Oxygen"}</span>
                </label>
                <label className="flex items-center gap-1.5 p-2 border rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" className="text-indigo-600 rounded" />
                  <span className="text-xs font-semibold">{isAr ? "جهاز تنفس صناعي" : "Ventilator"}</span>
                </label>
                <label className="flex items-center gap-1.5 p-2 border rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" className="text-indigo-600 rounded" />
                  <span className="text-xs font-semibold">{isAr ? "مراقبة قلب مستمرة" : "Continuous Cardiac Monitoring"}</span>
                </label>
                <label className="flex items-center gap-1.5 p-2 border rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" className="text-indigo-600 rounded" />
                  <span className="text-xs font-semibold">{isAr ? "سرير حروق" : "Burns Bed"}</span>
                </label>
                <label className="flex items-center gap-1.5 p-2 border rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" className="text-indigo-600 rounded" />
                  <span className="text-xs font-semibold">{isAr ? "غرفة خاصة" : "Private Room"}</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{isAr ? "جنس المريض (لفصل الأقسام)" : "Patient Gender (For Ward Separation)"}</label>
                <select className="w-full border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-indigo-500">
                  <option>{isAr ? "ذكر" : "Male"}</option>
                  <option>{isAr ? "أنثى" : "Female"}</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
            <button onClick={() => setShowTransferForm(false)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition">
              {isAr ? "إلغاء" : "Cancel"}
            </button>
            <button 
              onClick={() => {
                toast.success(isAr ? "تم إرسال طلب النقل إلى إدارة الأسرة بنجاح." : "Transfer request sent successfully.");
                setTransferStatus('pending_bed');
                setShowTransferForm(false);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition"
            >
              {isAr ? "إرسال طلب النقل" : "Submit Transfer Request"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showNurseNoteForm) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-modal flex items-center justify-center p-4 animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col">
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-sky-400" />
              {isAr ? "إضافة ملاحظة تمريض سريعة" : "Quick Nurse Note"}
            </h2>
            <button onClick={() => setShowNurseNoteForm(false)} className="hover:bg-slate-700 p-2 rounded-lg transition text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block mb-1">{isAr ? "نص الملاحظة التمريضية" : "Nurse Note Text"}</label>
              <textarea 
                rows={4}
                value={quickNurseText}
                onChange={(e) => setQuickNurseText(e.target.value)}
                className="w-full border border-slate-300 rounded-lg text-sm bg-slate-50 p-2 focus:border-sky-500 outline-none font-semibold text-slate-800 font-sans"
                placeholder={isAr ? "اكتب تفاصيل الملاحظة السريرية للتمريض هنا..." : "Write bedside clinical notes..."}
              />
            </div>
            <div className="text-xs text-slate-400 font-mono font-bold">
              Patient: {currentPatient.nameEn} ({currentPatient.mrn})
            </div>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
            <button onClick={() => setShowNurseNoteForm(false)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer">
              {isAr ? "إلغاء" : "Cancel"}
            </button>
            <button 
              onClick={() => {
                if (!quickNurseText.trim()) return;
                const notes = (currentPatient as any).nursingNotes || [];
                const newNote = {
                  id: "nn-" + Date.now(),
                  author: isAr ? "ممرض. فاطمة سعيد" : "RN. Fatima Saeed",
                  text: quickNurseText,
                  date: new Date().toLocaleString()
                };
                updatePatient(currentPatient.id, { nursingNotes: [newNote, ...notes] });
                setQuickNurseText("");
                setShowNurseNoteForm(false);
                setActiveTab("nursing_notes");
                toast.success(isAr ? "تم تسجيل الملاحظة التمريضية بنجاح." : "Nursing note recorded successfully.");
              }}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-bold shadow-md transition cursor-pointer"
            >
              {isAr ? "حفظ الملاحظة" : "Save Note"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showOrderLabForm) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-modal flex items-center justify-center p-4 animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col">
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-rose-400" />
              {isAr ? "إنشاء طلب فحص مخبري (Lab Order)" : "New Lab Test Order"}
            </h2>
            <button onClick={() => setShowOrderLabForm(false)} className="hover:bg-slate-700 p-2 rounded-lg transition text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-1 relative">
              <label className="text-xs font-bold text-slate-700 block mb-1">{isAr ? "اسم الفحص (بحث)" : "Test Name (Search)"}</label>
              <input 
                value={quickLabName}
                onChange={(e) => {
                  setQuickLabName(e.target.value);
                  setLabSearchFocus(true);
                }}
                onFocus={() => setLabSearchFocus(true)}
                onBlur={() => setTimeout(() => setLabSearchFocus(false), 200)}
                type="text" 
                placeholder={isAr ? "ابحث في أكثر من 2000 تحليل..." : "Search over 2000+ tests..."}
                className="w-full border border-slate-300 rounded-lg text-sm bg-slate-50 p-2.5 focus:border-rose-500 outline-none font-bold"
              />
              {labSearchFocus && quickLabName.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {EXTENDED_LAB_TESTS.filter((t: string) => t?.toLowerCase()?.includes(quickLabName?.toLowerCase())).slice(0, 50).map((test: string, idx: number) => (
                    <div 
                      key={idx} 
                      className="px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer text-slate-700 font-medium"
                      onMouseDown={() => {
                        setQuickLabName(test);
                        setLabSearchFocus(false);
                      }}
                    >
                      {test}
                    </div>
                  ))}
                  {EXTENDED_LAB_TESTS.filter((t: string) => t?.toLowerCase()?.includes(quickLabName?.toLowerCase())).length === 0 && (
                    <div className="px-3 py-2 text-sm text-slate-500 italic">No tests found.</div>
                  )}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block mb-1">{isAr ? "نوع/أولوية الطلب" : "Order Type/Priority"}</label>
                <select 
                  value={labPriority}
                  onChange={(e) => setLabPriority(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg text-sm bg-slate-50 p-2.5 focus:border-rose-500 outline-none font-bold"
                >
                  <option value="Routine">{isAr ? "عادي (Routine)" : "Routine"}</option>
                  <option value="Urgent">{isAr ? "عاجل (Urgent)" : "Urgent"}</option>
                  <option value="STAT">{isAr ? "طارئ (STAT)" : "STAT"}</option>
                  <option value="Pre-op">{isAr ? "قبل العملية (Pre-op)" : "Pre-op"}</option>
                  <option value="Fasting">{isAr ? "صائم (Fasting)" : "Fasting"}</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block mb-1">{isAr ? "تاريخ السحب المجدول" : "Scheduled Date"}</label>
                <input 
                  type="date"
                  value={labDate}
                  onChange={(e) => setLabDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg text-sm bg-slate-50 p-2.5 focus:border-rose-500 outline-none font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block mb-1">{isAr ? "وقت السحب" : "Scheduled Time"}</label>
                <input 
                  type="time"
                  value={labTime}
                  onChange={(e) => setLabTime(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg text-sm bg-slate-50 p-2.5 focus:border-rose-500 outline-none font-bold"
                />
              </div>
              <div className="space-y-1 flex items-center mt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={labAck}
                    onChange={(e) => setLabAck(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                  />
                  <span className="text-xs font-bold text-slate-700">{isAr ? "إشعار عند استلام المختبر" : "Notify upon LIS receipt"}</span>
                </label>
              </div>
            </div>

            <div className="text-xs text-rose-600 bg-rose-50 border border-rose-100 p-3 rounded-lg font-semibold font-sans leading-relaxed">
              {isAr ? "سيتم توقيع الطلب إلكترونياً وإرساله فوراً للمختبر الطبي المركزي (LIS)." : "This order will be digitally signed and dispatched to the Hospital Laboratory Information System (LIS)."}
            </div>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
            <button onClick={() => setShowOrderLabForm(false)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer">
              {isAr ? "إلغاء" : "Cancel"}
            </button>
            <button 
              onClick={() => {
                if (!quickLabName.trim()) return toast.error(isAr ? "الرجاء تحديد اسم الفحص" : "Please specify test name");
                const currentOrders = (currentPatient as any).orders || [];
                const newOrder = {
                  id: "ord-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
                  type: "LAB",
                  name: quickLabName,
                  status: "Ordered",
                  priority: labPriority,
                  date: `${labDate} ${labTime}`.trim(),
                  ack: labAck
                };
                updatePatient(currentPatient.id, { orders: [newOrder, ...currentOrders] });
                setCpoeOrders((prev: any[]) => [
                  {
                    id: newOrder.id,
                    patientName: currentPatient.nameEn || currentPatient.nameAr,
                    mrn: currentPatient.mrn,
                    orderType: "Lab",
                    orderName: quickLabName,
                    priority: labPriority,
                    status: "Pending",
                    timestamp: new Date().toISOString()
                  },
                  ...(Array.isArray(prev) ? prev : [])
                ]);
                setShowOrderLabForm(false);
                setActiveTab("orders");
                toast.success(isAr ? `تم إرسال طلب تحليل (${quickLabName}) بنجاح للمختبر.` : `Lab order for (${quickLabName}) sent successfully to LIS.`);
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-bold shadow-md transition cursor-pointer"
            >
              {isAr ? "تأكيد وإرسال الطلب" : "Sign & Dispatch Order"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showOrderRadForm) {
    return (
      <RadiologyOrderForm 
        isAr={isAr}
        patientGender={(currentPatient as any)?.gender || (currentPatient as any)?.genderEn}
        onClose={() => setShowOrderRadForm(false)}
        onSubmit={(orderData) => {
          const currentOrders = (currentPatient as any).orders || [];
          const newOrders = orderData.procedures.map((procName: string, index: number) => ({
            id: `ord-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 7)}`,
            type: "RAD",
            name: procName,
            status: "Ordered",
            date: new Date().toLocaleDateString(),
            urgency: orderData.urgency,
            clinicalIndication: orderData.clinicalIndication,
            transportMode: orderData.transportMode,
            pregnancyStatus: orderData.pregnancyStatus,
            timestamp: orderData.timestamp
          }));
          
          updatePatient(currentPatient.id, { orders: [...newOrders, ...currentOrders] });
          
          setCpoeOrders((prev: any[]) => [
            ...newOrders.map((ord: any) => ({
              id: ord.id,
              patientName: currentPatient.nameEn || currentPatient.nameAr,
              mrn: currentPatient.mrn,
              orderType: "Radiology",
              orderName: ord.name,
              priority: ord.urgency,
              status: "Pending",
              timestamp: ord.timestamp
            })),
            ...(Array.isArray(prev) ? prev : [])
          ]);
          
          setShowOrderRadForm(false);
          setActiveTab("orders");
          toast.success(isAr ? `تم إرسال ${orderData.procedures.length} طلبات أشعة بنجاح (RIS).` : `Successfully dispatched ${orderData.procedures.length} radiology orders to RIS.`);
        }}
      />
    );
  }

  if (showPrescribeForm) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-modal flex items-center justify-center p-4 overflow-y-auto animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col my-8">
          
          {/* Modal Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Pill className="w-5 h-5 text-emerald-400 animate-pulse" />
              {isAr ? "وصف علاج ووصفة دوائية جديدة (CPOE)" : "New Medication Prescription (CPOE)"}
            </h2>
            <button onClick={() => setShowPrescribeForm(false)} className="hover:bg-slate-800 p-2 rounded-lg transition text-slate-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Patient Context Banner (Safety Check) */}
          <div className="bg-rose-50 border-b border-rose-100 p-3 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
            <div className="flex items-center gap-2 text-rose-800">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                {isAr ? "شريط بيانات التحقق من المريض:" : "Patient Context Banner (Safety Check):"}
              </span>
              <strong className="text-slate-900 bg-rose-100/50 px-2 py-0.5 rounded">
                {currentPatient.nameAr || currentPatient.nameEn}
              </strong>
              <span className="text-slate-400">|</span>
              <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">MRN: {currentPatient.mrn}</span>
              <span className="text-slate-400">|</span>
              <span>{isAr ? `${(currentPatient as any).age || 45} سنة` : `Age: ${(currentPatient as any).age || 45}`}</span>
            </div>
            <div className="bg-rose-600 text-white font-bold px-2 py-1 rounded text-[10px] uppercase tracking-wider animate-pulse shadow-sm">
              {isAr ? "⚠️ تحذير: حساسية البنسلين" : "⚠️ Penicillin Allergy Alert"}
            </div>
          </div>

          {/* Modal Content Form */}
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            
            {/* Medication Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {isAr ? "اسم الدواء العلمي أو التجاري" : "Scientific/Generic or Brand Drug Name"} <span className="text-rose-500">*</span>
              </label>
              <input 
                type="text" 
                value={quickDrugName}
                onChange={(e) => setQuickDrugName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:border-indigo-500 p-2.5 outline-none font-bold text-slate-800 font-sans transition-all"
                placeholder={isAr ? "مثال: Ceftriaxone, Paracetamol, Nexium..." : "e.g., Ceftriaxone, Paracetamol, Nexium..."}
              />
            </div>

            {/* Dismantled Dose & Route */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Dose Number */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isAr ? "قيمة الجرعة" : "Dose Amount"}
                </label>
                <input 
                  type="number" 
                  value={quickDrugDoseNum}
                  onChange={(e) => setQuickDrugDoseNum(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:border-indigo-500 p-2.5 outline-none font-bold text-slate-800 font-sans transition-all"
                  placeholder="500"
                />
              </div>

              {/* Dose Unit */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isAr ? "وحدة الجرعة" : "Dose Unit"}
                </label>
                <select
                  value={quickDrugDoseUnit}
                  onChange={(e) => setQuickDrugDoseUnit(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:border-indigo-500 p-2.5 outline-none font-bold text-slate-800 font-sans transition-all"
                >
                  <option value="mg">mg (ملجم)</option>
                  <option value="g">g (جرام)</option>
                  <option value="ml">ml (مل)</option>
                  <option value="mcg">mcg (ميكروجرام)</option>
                  <option value="units">IU (وحدة دولية)</option>
                  <option value="tab">Tablet (قرص)</option>
                  <option value="cap">Capsule (كبسولة)</option>
                  <option value="vial">Vial (فلاكون)</option>
                  <option value="amp">Ampoule (أمبول)</option>
                  <option value="puff">Puff (بخة)</option>
                </select>
              </div>

              {/* Route of Administration */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isAr ? "طريقة الإعطاء (المسار)" : "Route of Administration"}
                </label>
                <select
                  value={quickDrugRoute}
                  onChange={(e) => setQuickDrugRoute(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:border-indigo-500 p-2.5 outline-none font-bold text-slate-800 font-sans transition-all"
                >
                  <option value="PO">PO (فموي)</option>
                  <option value="IV">IV (حقن وريدي)</option>
                  <option value="IM">IM (حقن عضلي)</option>
                  <option value="SC">SC (تحت الجلد)</option>
                  <option value="SL">SL (تحت اللسان)</option>
                  <option value="INH">INH (استنشاق)</option>
                  <option value="PR">PR (شرجي)</option>
                  <option value="TOP">TOP (موضعي)</option>
                  <option value="NG">NG (أنبوب معدي)</option>
                </select>
              </div>
            </div>

            {/* Frequency & Order Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Frequency */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isAr ? "تكرار الجرعة (Frequency)" : "Frequency"}
                </label>
                <select
                  value={quickDrugFrequency}
                  onChange={(e) => setQuickDrugFrequency(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:border-indigo-500 p-2.5 outline-none font-bold text-slate-800 font-sans transition-all"
                >
                  <option value="QD">QD (مرة واحدة يومياً)</option>
                  <option value="BID">BID (مرتين يومياً)</option>
                  <option value="TID">TID (3 مرات يومياً)</option>
                  <option value="QID">QID (4 مرات يومياً)</option>
                  <option value="q8h">q8h (كل 8 ساعات)</option>
                  <option value="q12h">q12h (كل 12 ساعة)</option>
                  <option value="q6h">q6h (كل 6 ساعات)</option>
                  <option value="q4h">q4h (كل 4 ساعات)</option>
                  <option value="PRN">PRN (عند اللزوم)</option>
                  <option value="STAT">STAT (فوراً / جرعة واحدة عاجلة)</option>
                </select>
              </div>

              {/* Order Type Priority */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isAr ? "نوع ومستوى الأولوية للاوردر" : "Order Priority Type"}
                </label>
                <select
                  value={quickDrugOrderType}
                  onChange={(e) => setQuickDrugOrderType(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:border-indigo-500 p-2.5 outline-none font-bold text-slate-800 font-sans transition-all"
                >
                  <option value="routine">{isAr ? "روتيني (Routine)" : "Routine"}</option>
                  <option value="stat">{isAr ? "عاجل / فوري (STAT)" : "STAT / Urgent"}</option>
                  <option value="prn">{isAr ? "عند اللزوم (PRN)" : "PRN (As Needed)"}</option>
                </select>
              </div>
            </div>

            {/* PRN Reason - Conditionally visible if Order Type is PRN */}
            {quickDrugOrderType === "prn" && (
              <div className="animate-slide-down bg-amber-50 border border-amber-150 p-3 rounded-lg space-y-1">
                <label className="text-xs font-bold text-amber-900 block">
                  {isAr ? "دواعي الاستعمال عند اللزوم (PRN Reason) *" : "PRN Reason *"}
                </label>
                <input 
                  type="text"
                  value={quickDrugPrnReason}
                  onChange={(e) => setQuickDrugPrnReason(e.target.value)}
                  className="w-full border border-amber-300 rounded-lg text-sm bg-white focus:border-amber-500 p-2.5 outline-none font-bold text-slate-800 font-sans transition-all"
                  placeholder={isAr ? "مثال: للحرارة أعلى من 38.5 درجة، أو عند الألم الشديد" : "e.g., for temp > 38.5 C or pain"}
                />
              </div>
            )}

            {/* Treatment Duration & Start Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Duration */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isAr ? "مدة العلاج (أيام)" : "Duration (Days)"}
                </label>
                <input 
                  type="number" 
                  value={quickDrugDuration}
                  onChange={(e) => setQuickDrugDuration(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:border-indigo-500 p-2.5 outline-none font-bold text-slate-800 font-sans transition-all"
                  placeholder="5"
                  min="1"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isAr ? "تاريخ البدء" : "Start Date"}
                </label>
                <input 
                  type="date" 
                  value={quickDrugStartDate}
                  onChange={(e) => setQuickDrugStartDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:border-indigo-500 p-2.5 outline-none font-bold text-slate-800 font-sans transition-all"
                />
              </div>

              {/* Start Time */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isAr ? "وقت البدء" : "Start Time"}
                </label>
                <input 
                  type="time" 
                  value={quickDrugStartTime}
                  onChange={(e) => setQuickDrugStartTime(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:border-indigo-500 p-2.5 outline-none font-bold text-slate-800 font-sans transition-all"
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {isAr ? "تعليمات خاصة (للصيدلية أو التمريض)" : "Special Instructions"}
              </label>
              <textarea 
                value={quickDrugSpecialInstructions}
                onChange={(e) => setQuickDrugSpecialInstructions(e.target.value)}
                className="w-full border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:border-indigo-500 p-2.5 h-16 outline-none font-bold text-slate-800 font-sans transition-all"
                placeholder={isAr ? "مثال: يعطى ببطء وريدياً، أو خلط في محلول ملحي 100 مل، أو بعد الطعام" : "e.g., Infuse slowly over 30 mins, or take with food"}
              />
            </div>

            {/* Smart safety warning */}
            <div className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 p-3 rounded-lg font-semibold font-sans leading-relaxed flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <span>
                {isAr ? "سيتم فحص التداخلات الدوائية تلقائياً وإدراج الوصفة فوراً في ورقة علاج المريض (MAR) لتسهيل المراجعة والصرف من قِبل الصيدلي." : "The drug interaction check will auto-run and insert the prescription into the MAR sheet for nurse administration."}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 shrink-0">
            <button onClick={() => setShowPrescribeForm(false)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer">
              {isAr ? "إلغاء" : "Cancel"}
            </button>
            <button 
              onClick={() => {
                if (!quickDrugName.trim()) {
                  toast.error(isAr ? "يرجى كتابة اسم الدواء" : "Please input drug name");
                  return;
                }
                if (quickDrugOrderType === "prn" && !quickDrugPrnReason.trim()) {
                  toast.error(isAr ? "يرجى كتابة دواعي الاستعمال للـ PRN" : "Please input PRN reason");
                  return;
                }

                const displayDosageStr = `${quickDrugDoseNum}${quickDrugDoseUnit} ${quickDrugRoute} ${quickDrugFrequency.toUpperCase()}${quickDrugOrderType === "prn" ? " (PRN: " + quickDrugPrnReason + ")" : ""}`;
                const prescriptionsList = (currentPatient as any).prescriptions || [];
                const newRxId = "rx-" + Date.now();
                
                const newRx = {
                  id: newRxId,
                  name: quickDrugName,
                  dosage: displayDosageStr,
                  doseNum: quickDrugDoseNum,
                  doseUnit: quickDrugDoseUnit,
                  route: quickDrugRoute,
                  frequency: quickDrugFrequency,
                  orderType: quickDrugOrderType,
                  prnReason: quickDrugOrderType === "prn" ? quickDrugPrnReason : "",
                  durationDays: Number(quickDrugDuration) || 5,
                  startDate: quickDrugStartDate,
                  startTime: quickDrugStartTime,
                  specialInstructions: quickDrugSpecialInstructions,
                  status: "pending", // starts as pending pharmacy verification!
                  date: new Date().toLocaleDateString()
                };

                // 1. Save locally/nested to active patient
                updatePatient(currentPatient.id, { prescriptions: [newRx, ...prescriptionsList] });

                // 2. Add globally to context for Pharmacy/CPOE
                addPrescription({
                  id: newRxId,
                  patientId: currentPatient.id,
                  medication: quickDrugName,
                  dose: displayDosageStr,
                  qty: 1,
                  status: "pending",
                  date: new Date().toLocaleDateString(),
                  doseNum: quickDrugDoseNum,
                  doseUnit: quickDrugDoseUnit,
                  route: quickDrugRoute,
                  frequency: quickDrugFrequency,
                  orderType: quickDrugOrderType,
                  prnReason: quickDrugOrderType === "prn" ? quickDrugPrnReason : "",
                  durationDays: Number(quickDrugDuration) || 5,
                  startDate: quickDrugStartDate,
                  startTime: quickDrugStartTime,
                  specialInstructions: quickDrugSpecialInstructions,
                } as any);

                setQuickDrugName("");
                setShowPrescribeForm(false);
                setActiveTab("mar");
                toast.success(isAr ? `تمت إضافة وصفة (${quickDrugName}) وإرسالها للصيدلية الإلكترونية للمراجعة.` : `Medication prescription for (${quickDrugName}) signed and sent to Pharmacy.`);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-md transition cursor-pointer"
            >
              {isAr ? "توقيع وإرسال الوصفة" : "E-Sign & Dispatch Prescription"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const content = (
    <>
    <div className={`bg-white shadow-xl w-full flex flex-col animate-fade-in ${isEmbedded ? 'h-full flex-1 rounded-none' : 'rounded-2xl max-w-7xl h-[95vh] overflow-hidden'}`}>
        
        {/* Header - Enterprise HIS Clinical Workspace Banner */}
        <div className="bg-slate-900 text-white shrink-0 border-b-4 border-indigo-600 shadow-2xl relative overflow-hidden">
          {/* Top Row: Core ID & Quick Actions */}
          <div className="p-3 sm:p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full lg:w-auto">
              <button onClick={onClose} className="hover:bg-slate-800 p-2 rounded-lg transition shrink-0 border border-slate-700 bg-slate-800/50">
                <ArrowLeft className={`w-4 h-4 sm:w-5 sm:h-5 ${isAr ? 'rotate-180' : ''}`} />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-600/20 text-indigo-400 rounded-xl flex items-center justify-center shrink-0 border-2 border-indigo-500/30 shadow-inner">
                  <User className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-black text-xl sm:text-2xl text-white truncate drop-shadow-sm">
                      {isAr ? (currentPatient.nameAr || currentPatient.name) : (currentPatient.nameEn || currentPatient.name)}
                    </h2>
                    <BadgeCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300 font-mono mt-1">
                    <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-bold text-indigo-300">
                      MRN: {currentPatient.mrn || patientId}
                    </span>
                    <span className="bg-indigo-900/50 px-2 py-0.5 rounded border border-indigo-500/30 font-bold text-white">
                      ENC: {currentPatient.activeEncounterId || "VIS-000000"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Global Quick Action Bar */}
            <div className="flex items-center gap-1.5 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 hide-scrollbar bg-slate-800/30 p-1.5 rounded-xl border border-slate-700/50">
              {quickActions.map(action => (
                <button 
                  key={action.id}
                  onClick={() => handleQuickAction(action.id)}
                  className={`flex-none flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] sm:text-xs font-black transition hover:scale-105 active:scale-95 shadow-lg border border-white/10 ${action.color}`}
                >
                  <action.icon className="w-4 h-4" />
                  <span>{isAr ? action.ar : action.en}</span>
                </button>
              ))}
              <div className="w-px h-6 bg-slate-700 mx-1" />
              <button 
                onClick={() => setActiveWorkflow("new_visit")}
                className="flex-none bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-2 rounded-lg transition flex items-center gap-1.5 text-[10px] sm:text-xs font-black shadow-lg border border-emerald-500"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? "زيارة جديدة" : "New Visit"}</span>
              </button>
            </div>
          </div>

          {/* Clinical Context Ribbon (Secondary Banner) */}
          <div className="bg-slate-800/80 backdrop-blur-md px-4 py-2 border-t border-slate-700/50 flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] font-bold">
            {/* Vitals Snapshot */}
            <div className="flex items-center gap-4 border-r border-slate-700 pr-6">
              <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setActiveTab("vitals")}>
                <div className="p-1 bg-rose-500/20 rounded-md">
                   <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 uppercase tracking-tighter">{isAr ? "النبض" : "Pulse"}</span>
                  <span className="text-rose-400 font-black">{currentPatient.vitals?.hr || 75} bpm</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1 bg-blue-500/20 rounded-md">
                   <Activity className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 uppercase tracking-tighter">{isAr ? "الضغط" : "BP"}</span>
                  <span className="text-blue-400 font-black">{currentPatient.vitals?.bp || "120/80"}</span>
                </div>
              </div>
            </div>

            {/* Location & Team */}
            <div className="flex items-center gap-4 border-r border-slate-700 pr-6">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 uppercase tracking-tighter">{isAr ? "الموقع" : "Location"}</span>
                    <span className="text-slate-100">{isAr ? "غرفة 302 - سرير A" : "Room 302 - Bed A"}</span>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <Stethoscope className="w-3.5 h-3.5 text-indigo-400" />
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 uppercase tracking-tighter">{isAr ? "الطبيب المعالج" : "Attending"}</span>
                    <span className="text-indigo-300">Dr. Ahmed Kamal</span>
                  </div>
               </div>
            </div>

            {/* Demographics & Insurance */}
            <div className="flex items-center gap-4 border-r border-slate-700 pr-6">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 uppercase tracking-tighter">{isAr ? "العمر / الجنس" : "Age / Gender"}</span>
                <span className="text-slate-200 capitalize">
                  {currentPatient.age || 45}Y / {isAr ? (currentPatient.gender === 'male' ? 'ذكر' : 'أنثى') : currentPatient.gender}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 uppercase tracking-tighter">{isAr ? "التأمين" : "Insurance"}</span>
                <span className="text-sky-400">Bupa Gold (90%)</span>
              </div>
            </div>

            {/* Critical Alerts */}
            <div className="flex items-center gap-3 ml-auto">
               <div className="px-3 py-1 bg-rose-500/20 border border-rose-500/30 rounded-full flex items-center gap-1.5">
                 <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                 <span className="text-rose-500 uppercase tracking-widest text-[9px]">{isAr ? "حساسية بنسيلين" : "Penicillin Allergy"}</span>
               </div>
               <div className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full flex items-center gap-1.5">
                 <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                 <span className="text-amber-500 uppercase tracking-widest text-[9px]">{isAr ? "خطر السقوط" : "Fall Risk"}</span>
               </div>
            </div>
          </div>
        </div>

        {transferStatus === 'pending_bed' && (
          <div 
            onClick={() => setTransferStatus('assigned')}
            className="bg-amber-100 text-amber-800 p-3 flex items-center justify-between border-b border-amber-200 text-sm font-bold shrink-0 cursor-pointer hover:bg-amber-200 transition"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 animate-pulse" />
              {isAr ? "تم طلب نقل المريض - بانتظار تخصيص سرير من قسم (Bed Management)." : "Patient transfer requested - pending bed assignment from Bed Management."}
            </div>
            <span className="text-xs bg-amber-50 px-2 py-1 rounded opacity-50">{isAr ? "(محاكاة: اضغط هنا لمحاكاة تخصيص السرير)" : "(Simulate: Click to assign)"}</span>
          </div>
        )}

        {transferStatus === 'assigned' && (
          <div className="bg-indigo-100 text-indigo-800 p-3 flex flex-col sm:flex-row items-center justify-between border-b border-indigo-200 text-sm font-bold shrink-0 gap-3">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              {isAr ? "تم تخصيص السرير (ICU-02) بقسم العناية المركزة. يُرجى تجهيز المريض للنقل." : "Bed ICU-02 assigned in Intensive Care Unit. Please prepare patient."}
            </div>
            <button 
              onClick={() => {
                toast.success(isAr ? "تم تأكيد وصول المريض للقسم الجديد بنجاح" : "Patient arrival confirmed.");
                setTransferStatus('transferred');
              }}
              className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isAr ? "تأكيد وصول المريض (Patient Arrived)" : "Patient Arrived"}
            </button>
          </div>
        )}

        {transferStatus === 'transferred' && (
          <div className="bg-emerald-100 text-emerald-800 p-3 flex items-center justify-between border-b border-emerald-200 text-sm font-bold shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              {isAr ? "تم نقل المريض بنجاح، السرير الحالي: العناية المركزة (ICU-02)." : "Patient transferred successfully. Current Bed: ICU-02."}
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">
          {/* Vertical Sidebar Tabs */}
          <div className="w-64 sm:w-72 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
            <div className="p-4 space-y-6">
              
              {/* Core Sections */}
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">{isAr ? "الأساسية" : "Clinical Core"}</p>
                 <div className="space-y-1">
                    {tabs.filter(t => t.section === "core").map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          activeTab === tab.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {createElement(tab.icon as any, { className: `w-4 h-4 ${activeTab === tab.id ? "text-white" : "text-slate-400"}` })}
                        <span>{isAr ? tab.ar : tab.en}</span>
                      </button>
                    ))}
                 </div>
              </div>

              {/* Documentation */}
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">{isAr ? "التوثيق" : "Documentation"}</p>
                 <div className="space-y-1">
                    {tabs.filter(t => t.section === "doc").map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          activeTab === tab.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {createElement(tab.icon as any, { className: `w-4 h-4 ${activeTab === tab.id ? "text-white" : "text-slate-400"}` })}
                        <span>{isAr ? tab.ar : tab.en}</span>
                      </button>
                    ))}
                 </div>
              </div>

              {/* Orders & Diagnostics */}
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">{isAr ? "الأوامر والنتائج" : "Orders & Results"}</p>
                 <div className="space-y-1">
                    {tabs.filter(t => t.section === "orders").map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          activeTab === tab.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {createElement(tab.icon as any, { className: `w-4 h-4 ${activeTab === tab.id ? "text-white" : "text-slate-400"}` })}
                        <span>{isAr ? tab.ar : tab.en}</span>
                      </button>
                    ))}
                 </div>
              </div>

              {/* Specialized (Conditional) */}
              {tabs.some(t => t.section === "specialized") && (
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">{isAr ? "تخصصي" : "Specialized Care"}</p>
                  <div className="space-y-1">
                      {tabs.filter(t => t.section === "specialized").map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            activeTab === tab.id ? "bg-rose-600 text-white shadow-lg shadow-rose-100" : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {createElement(tab.icon as any, { className: `w-4 h-4 ${activeTab === tab.id ? "text-white" : "text-slate-400"}` })}
                          <span>{isAr ? tab.ar : tab.en}</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Admin & Support */}
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">{isAr ? "إداري" : "Administrative"}</p>
                 <div className="space-y-1">
                    {tabs.filter(t => t.section === "admin").map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          activeTab === tab.id ? "bg-slate-800 text-white shadow-lg shadow-slate-200" : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {createElement(tab.icon as any, { className: `w-4 h-4 ${activeTab === tab.id ? "text-white" : "text-slate-400"}` })}
                        <span>{isAr ? tab.ar : tab.en}</span>
                      </button>
                    ))}
                 </div>
              </div>

            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden min-h-0 bg-white">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
              
              {activeTab === "er_triage" && (
              <div className="space-y-4">
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center justify-between">
                   <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <div className="bg-rose-600 p-2 rounded-lg text-white">
                        <BadgeCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-rose-900">{isAr ? "نظام فرز حالات الطوارئ (ESI)" : "Emergency Severity Index (ESI) Triage"}</h3>
                        <p className="text-xs text-rose-600 font-medium">{isAr ? "تقييم مستوى الخطورة وتوزيع الأولويات" : "Severity assessment and priority allocation"}</p>
                      </div>
                   </div>
                </div>
                <ClinicalFormsLibrary isAr={isAr} patientId={patientId} patientName={patientName} initialCategory="ed" />
              </div>
            )}

            {activeTab === "er_disposition" && (
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex flex-wrap items-center gap-2 sm:gap-3">
                   <LogOut className="text-emerald-600 w-6 h-6" />
                   <div>
                     <h3 className="text-sm font-bold text-emerald-900">{isAr ? "قرار التصرف النهائي (Disposition)" : "Final Disposition Decision"}</h3>
                   </div>
                </div>
                <ClinicalFormsLibrary isAr={isAr} patientId={patientId} patientName={patientName} initialCategory="ed" />
              </div>
            )}

            {activeTab === "icu_vent" && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between">
                   <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <div className="bg-blue-600 p-2 rounded-lg text-white">
                        <Wind className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-blue-900">{isAr ? "إدارة التنفس الصناعي والغازات الدموية" : "Ventilator Management & Blood Gases"}</h3>
                        <p className="text-xs text-blue-600 font-medium">{isAr ? "مراقبة المعاملات التنفسية ونتائج ABG" : "Monitoring respiratory parameters and ABG results"}</p>
                      </div>
                   </div>
                </div>
                <ClinicalFormsLibrary isAr={isAr} patientId={patientId} patientName={patientName} initialCategory="icu" />
              </div>
            )}

            {activeTab === "icu_hemo" && (
              <div className="space-y-4">
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center justify-between">
                   <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <div className="bg-rose-600 p-2 rounded-lg text-white">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-rose-900">{isAr ? "الديناميكا الدموية المتقدمة" : "Advanced Hemodynamics Monitoring"}</h3>
                        <p className="text-xs text-rose-600 font-medium">{isAr ? "مراقبة الضغط الشرياني المباشر وCVP" : "Monitoring Invasive Arterial Pressure and CVP"}</p>
                      </div>
                   </div>
                </div>
                <ClinicalFormsLibrary isAr={isAr} patientId={patientId} patientName={patientName} initialCategory="icu" />
              </div>
            )}

            {activeTab === "summary" && (
              <ClinicalSnapshot 
                patient={currentPatient} 
                isAr={isAr} 
                language={isAr ? "ar" : "en"} 
                setActiveTab={setActiveTab} 
              />
            )}

            {activeTab === "forms" && (
              <ClinicalFormsLibrary isAr={isAr} patientId={patientId} patientName={patientName} />
            )}

            {activeTab === "emr_forms" && (
              <ClinicalFormsEngine 
                isAr={isAr} 
                patientId={patientId} 
                patientMRN={currentPatient?.mrn || patientId} 
                currentUser={currentUser} 
              />
            )}

            {activeTab === "timeline" && (
              <UnifiedClinicalTimeline patientId={currentPatient.id} isAr={isAr} />
            )}

            {activeTab === "handover" && (
               <div className="space-y-6 animate-fade-in">
                 <div className="flex items-center justify-between">
                   <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                     <Share className="w-5 h-5 text-indigo-600" />
                     {isAr ? "تسليم الشيفت (Patient-Specific Handover)" : "Patient-Specific Handover"}
                   </h3>
                   <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition">
                     {isAr ? "+ إضافة تسليم جديد" : "+ Add Handover Note"}
                   </button>
                 </div>
                 
                 <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-4">
                   <div className="flex-1 space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="bg-white p-3 rounded-xl border border-slate-200">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{isAr ? "المهام المعلقة" : "Pending Tasks"}</label>
                         <textarea className="w-full mt-2 text-sm border-none bg-slate-50 p-2 rounded-lg focus:ring-0" rows={3} placeholder={isAr ? "مثال: متبقي تحليل CBC الساعة 4..." : "e.g., CBC pending at 16:00"}></textarea>
                       </div>
                       <div className="bg-white p-3 rounded-xl border border-slate-200">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{isAr ? "تعليمات الطبيب الهامة" : "Important Doctor Orders"}</label>
                          <textarea className="w-full mt-2 text-sm border-none bg-slate-50 p-2 rounded-lg focus:ring-0" rows={3} placeholder={isAr ? "أهم التعليمات الطبية..." : "Important medical instructions..."}></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
             )}


            {activeTab === "nursing_desk" && (
              <div className="flex-1 overflow-hidden h-full flex flex-col bg-slate-50 min-h-0">
                <NursingConsole 
                  patient={currentPatient as any} 
                  staffId={currentUser?.id || "nurse1"} 
                  language={isAr ? "ar" : "en"}
                />
              </div>
            )}

            {activeTab === "reports" && (
               <div className="flex-1 overflow-hidden h-full min-h-[500px] min-h-0">
                 <EnterpriseReportCenter language={isAr ? "ar" : "en"} patientId={patientId} patientName={patientName} />
               </div>
             )}

            {activeTab === "progress_notes" && (
              <div className="space-y-6 w-full animate-fade-in pb-12">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                      <FileEdit className="w-5 h-5 text-indigo-600" />
                      {isAr ? "ملاحظات تطور الحالة الطبية" : "Physician Progress Notes"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {isAr ? "توثيق التطور اليومي وخطة العلاج من قبل الأطباء الاستشاريين والأخصائيين." : "Daily progress documentation and clinical plan by attending medical staff."}
                    </p>
                    {patientDiet && (
                      <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg text-xs mt-3 w-fit">
                        <Droplets className="w-4 h-4 text-orange-500" />
                        <span className="font-bold text-slate-700">{isAr ? "الأنظمة الغذائية:" : "Diet:"}</span>
                        <span className="font-black text-orange-700">{patientDiet.diet}</span>
                        {patientDiet.allergy && patientDiet.allergy !== "None" && patientDiet.allergy !== "لا يوجد" && (
                          <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded ml-2 font-bold flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> {patientDiet.allergy}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Add Note Form */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-xs">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-indigo-600" />
                    {isAr ? "كتابة ملاحظة طبية جديدة" : "Add New Medical Note"}
                  </h4>
                  <div className="space-y-3">
                    <textarea 
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      rows={3}
                      placeholder={isAr ? "اكتب هنا تفاصيل الفحص السريري، تشخيص اليوم، وتعديل الخطة الطبية..." : "Type daily clinical evaluation, physical exam findings, and diagnostic plans here..."}
                      className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-indigo-500 font-semibold text-slate-800 font-sans"
                    />
                    <div className="flex justify-between items-center">
                      <div className="text-[10px] font-bold text-slate-400 font-mono">
                        ✍️ E-Signature (Timestamped): Dr. Ahmed Ali (Cardiology)
                      </div>
                      <button 
                        onClick={handleSaveProgressNote}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm cursor-pointer"
                      >
                        {isAr ? "حفظ وتوقيع الملاحظة (E-Sign)" : "Sign & Save Progress Note"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Timeline list */}
                <div className="space-y-4">
                  {((currentPatient as any).progressNotes || [
                    { id: "pn1", author: "Dr. Ahmed Ali (Cardiology)", text: isAr ? "حالة المريض مستقرة بعد العملية. العلامات الحيوية جيدة وقيد المتابعة مستمرة." : "Patient status is stable post-op. Vital signs are within normal limits and being monitored.", date: "2026-06-29 09:00" },
                    { id: "pn2", author: "Dr. Samir Hassan (Consultant)", text: isAr ? "يجب مراقبة مستويات السكر في الدم وضبط جرعة الأنسولين بناءً على الفحوصات الطبية الدورية." : "Monitor blood glucose levels and adjust Insulin dosage accordingly based on tests.", date: "2026-06-29 14:30" }
                  ]).map((note: any) => (
                    <div key={note.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex gap-3 items-start relative hover:border-slate-300 transition group">
                      <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs border border-indigo-100 uppercase shrink-0">
                        Dr
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="font-bold text-xs text-slate-800">{note.author}</span>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <button 
                              onClick={() => setActiveWorkflow("edit_note")}
                              className="opacity-0 group-hover:opacity-100 transition text-indigo-600 hover:text-indigo-800 cursor-pointer"
                            >
                                <FileEdit className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[10px] text-slate-400 font-mono font-bold">{note.date}</span>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-slate-600 leading-relaxed whitespace-pre-wrap">{note.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "nursing_notes" && (
              <div className="space-y-6 w-full animate-fade-in pb-12">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-sky-600" />
                      {isAr ? "ملاحظات ودفتر التمريض" : "Nursing Observation Notes"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {isAr ? "تسجيل الملاحظات التمريضية المستمرة، وإعطاء المحاليل والأدوية والعناية اليومية بالسرير." : "Continuous nursing logs, critical care nursing records, and bedside interventions."}
                    </p>
                    {patientDiet && (
                      <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg text-xs mt-3 w-fit">
                        <Droplets className="w-4 h-4 text-orange-500" />
                        <span className="font-bold text-slate-700">{isAr ? "الأنظمة الغذائية:" : "Diet:"}</span>
                        <span className="font-black text-orange-700">{patientDiet.diet}</span>
                        {patientDiet.allergy && patientDiet.allergy !== "None" && patientDiet.allergy !== "لا يوجد" && (
                          <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded ml-2 font-bold flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> {patientDiet.allergy}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Add Nurse Note Form */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-xs">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-sky-600" />
                    {isAr ? "كتابة ملاحظة تمريضية جديدة" : "Add New Nursing Note"}
                  </h4>
                  <div className="space-y-3">
                    <textarea 
                      value={nurseNoteText}
                      onChange={(e) => setNurseNoteText(e.target.value)}
                      rows={3}
                      placeholder={isAr ? "اكتب هنا ملاحظات السرير، استجابة المريض، العناية بالجروح، ومستوى الوعي..." : "Type bedside observations, pain scores, wound care, patient response, and intake/output status..."}
                      className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-sky-500 font-semibold text-slate-800 font-sans"
                    />
                    <div className="flex justify-between items-center">
                      <div className="text-[10px] font-bold text-slate-400 font-mono">
                        ✍️ E-Signature (Timestamped): RN. Fatima Saeed
                      </div>
                      <button 
                        onClick={handleSaveNurseNote}
                        className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm cursor-pointer"
                      >
                        {isAr ? "حفظ وتوقيع الملاحظة (E-Sign)" : "Sign & Save Nursing Note"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Nursing Notes List */}
                <div className="space-y-4">
                  {((currentPatient as any).nursingNotes || [
                    { id: "nn1", author: "RN. Sarah Jones", text: isAr ? "تم إعطاء الأدوية الوريدية المقررة في موعدها المعتمد. المريض لا يعاني من ألم حالياً." : "Prescribed IV medications administered on schedule. Patient reports no pain currently.", date: "2026-06-30 08:00" },
                    { id: "nn2", author: "RN. Fatima Saeed", text: isAr ? "تم تغيير ضماد الجرح الجراحي بنجاح. الجرح نظيف تماماً ولا توجد أي علامات للالتهاب الموضعي." : "Surgical wound dressing changed successfully. Wound is clean, no signs of infection.", date: "2026-06-30 11:30" }
                  ]).map((note: any) => (
                    <div key={note.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex gap-3 items-start relative hover:border-slate-300 transition group">
                      <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-sky-50 text-sky-600 font-bold flex items-center justify-center text-xs border border-sky-100 uppercase shrink-0">
                        RN
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="font-bold text-xs text-slate-800">{note.author}</span>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <button 
                              onClick={() => setActiveWorkflow("edit_nurse_note")}
                              className="opacity-0 group-hover:opacity-100 transition text-sky-600 hover:text-sky-800 cursor-pointer"
                            >
                                <FileEdit className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[10px] text-slate-400 font-mono font-bold">{note.date}</span>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-slate-600 leading-relaxed whitespace-pre-wrap">{note.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "radiology" && (
              <div className="space-y-6 w-full animate-fade-in pb-12">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-rose-600" />
                    {isAr ? "نظام الأشعة ونتائج التصوير PACS DICOM" : "Imaging & Radiology PACS DICOM System"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {isAr ? "استعراض صور الرنين المغناطيسي والأشعة المقطعية والسينية مباشرة من خادم PACS السريري الموحد للسرير والتشخيص." : "Browse high-resolution CT, MRI, and X-ray imaging directly retrieved from PACS server."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Left list of studies */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">{isAr ? "الدراسات الطبية المتاحة" : "Available Imaging Studies"}</h4>
                    {clinicalStudies.map((study, idx) => (
                      <div 
                        key={study.id} 
                        onClick={() => setSelectedStudyIdx(idx)}
                        className={`p-3 rounded-xl border transition cursor-pointer ${selectedStudyIdx === idx ? "bg-rose-50/50 border-rose-300 shadow-xs" : "bg-white border-slate-200 hover:border-slate-300"}`}
                      >
                        <p className="font-bold text-xs text-slate-800">{study.type}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 font-mono">
                          <span>{study.date}</span>
                          <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-black">{study.size}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Middle interactive viewer */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="bg-slate-950 text-white rounded-2xl p-4 flex flex-col items-center justify-center relative border-4 border-slate-800 shadow-lg min-h-[320px]">
                      {/* Image frame */}
                      <div className="w-full max-w-sm aspect-square relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 opacity-90 mix-blend-screen flex items-center justify-center" style={{ transform: `scale(${radZoom / 100})` }}>
                          {clinicalStudies[selectedStudyIdx]?.type?.toLowerCase()?.includes("brain") || clinicalStudies[selectedStudyIdx]?.type?.toLowerCase()?.includes("mri") || selectedStudyIdx === 0 ? (
                            <svg width="100%" height="100%" viewBox="0 0 200 200">
                              {/* Brain-like MRI cross section */}
                              <circle cx="100" cy="100" r={30 + (radSlice * 0.8)} fill="none" stroke="#f43f5e" strokeWidth="1.5" opacity={0.25} />
                              <ellipse cx="100" cy="100" rx={55 + (radSlice * 0.4)} ry={65 + (radSlice * 0.2)} fill="none" stroke="#ffffff" strokeWidth="2.5" opacity={0.8} style={{ filter: `contrast(${radContrast})` }} />
                              <path d={`M 60,100 Q 100,${65 + (radSlice * 1.6)} 140,100 Q 100,${135 - (radSlice * 1.6)} 60,100`} fill="none" stroke="#ffffff" strokeWidth="1" opacity={0.5} />
                              <circle cx="85" cy="85" r="8" fill="none" stroke="#ffffff" strokeWidth="1" opacity={0.3} />
                              <circle cx="115" cy="85" r="8" fill="none" stroke="#ffffff" strokeWidth="1" opacity={0.3} />
                            </svg>
                          ) : (
                            <svg width="100%" height="100%" viewBox="0 0 200 200">
                              {/* Chest X-ray diagram */}
                              <rect x="70" y="30" width="60" height="130" rx="10" fill="none" stroke="#ffffff" strokeWidth="2" opacity={0.8} />
                              <path d="M 100,30 L 100,160" stroke="#ffffff" strokeWidth="3" opacity={0.4} strokeDasharray="3,3" />
                              <path d="M 75,50 Q 100,75 125,50" fill="none" stroke="#ffffff" strokeWidth="2" opacity={0.7} />
                              <path d="M 75,80 Q 100,105 125,80" fill="none" stroke="#ffffff" strokeWidth="2" opacity={0.7} />
                              <path d="M 75,110 Q 100,135 125,110" fill="none" stroke="#ffffff" strokeWidth="2" opacity={0.7} />
                            </svg>
                          )}
                        </div>

                        {/* Labels overlay */}
                        <div className="absolute top-2 left-2 text-[9px] font-mono text-rose-400 uppercase tracking-widest font-bold">
                          {clinicalStudies[selectedStudyIdx]?.size === "24 slices" ? `Slice: ${radSlice}/24` : "Standard PA View"} • Zoom: {radZoom}%
                        </div>
                        <div className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-400">
                          STUDY_REF: PACS_00{selectedStudyIdx + 4}
                        </div>
                      </div>
                    </div>

                    {/* Interactive controls */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-bold text-slate-600">
                      {clinicalStudies[selectedStudyIdx]?.size === "24 slices" ? (
                        <div className="space-y-1">
                          <label className="block text-[10px] text-slate-500">{isAr ? "تصفح المقاطع (Slice)" : "Scroll Slice"}</label>
                          <input type="range" min="1" max="24" value={radSlice} onChange={(e) => setRadSlice(Number(e.target.value))} className="w-full accent-rose-600" />
                        </div>
                      ) : (
                        <div className="text-slate-400 flex items-center justify-center">{isAr ? "مقطع واحد متاح" : "Single slice available"}</div>
                      )}
                      <div className="space-y-1">
                        <label className="block text-[10px] text-slate-500">{isAr ? "التباين (Contrast)" : "Contrast Adjustment"}</label>
                        <input type="range" min="0.5" max="2.0" step="0.1" value={radContrast} onChange={(e) => setRadContrast(Number(e.target.value))} className="w-full accent-rose-600" />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] text-slate-500">{isAr ? "التكبير (Zoom)" : "Zoom Factor"}</label>
                        <input type="range" min="80" max="180" step="10" value={radZoom} onChange={(e) => setRadZoom(Number(e.target.value))} className="w-full accent-rose-600" />
                      </div>
                    </div>

                    {/* Diagnostic Report Findings */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mt-4 space-y-4">
                      <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest border-b border-slate-200 pb-2">
                        {isAr ? "تقرير الأشعة التشخيصي" : "Radiology Diagnostic Report"}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                        <div className="space-y-1">
                          <p className="font-bold text-slate-500">{isAr ? "النتائج السريرية (Findings)" : "Clinical Findings"}</p>
                          <p className="text-slate-800 bg-white p-3 rounded-lg border border-slate-100 font-medium leading-relaxed italic">
                            {clinicalStudies[selectedStudyIdx]?.findings || (isAr ? "لا توجد علامات حادة نشطة للنزيف أو الإزاحة." : "No acute pathology or hemorrhage identified on current radiological slices.") }
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-slate-500">{isAr ? "الخلاصة والتشخيص (Impression)" : "Diagnostic Impression"}</p>
                          <p className="text-slate-800 bg-rose-50/50 p-3 rounded-lg border border-rose-100 font-extrabold leading-relaxed italic text-rose-900">
                            {clinicalStudies[selectedStudyIdx]?.impression || (isAr ? "تقرير فحص طبيعي للدماغ." : "Stable study with no acute findings.") }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-slate-150 pt-2">
                        <span>{isAr ? "تاريخ التوقيع المعتمد" : "Signed & Released:"} {clinicalStudies[selectedStudyIdx]?.date}</span>
                        <span>{isAr ? "د. رامي فريد (استشاري أشعة)" : "Dr. Rami Farid (Radiology Consultant)"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "assessments" && (
              <div className="space-y-6 w-full animate-fade-in pb-12">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-500" />
                    {isAr ? "التقييمات والسكورات السريرية المعتمدة" : "Clinical Assessments & Scoring Engines"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {isAr ? "حساب فوري للمؤشرات الحيوية ومستوى الوعي وتخمين مخاطر السقوط والاعتلال الرئوي الموحد." : "Calculate Glasgow Coma Scale (GCS), qSOFA, and Morse Fall Risk on bedside parameters."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* GCS Calculator */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                    <h4 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2 flex justify-between items-center">
                      <span>Glasgow Coma Scale (GCS)</span>
                      <span className="bg-slate-100 px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold text-slate-700">Score: {gcsEye + gcsVerbal + gcsMotor}/15</span>
                    </h4>
                    <div className="space-y-3 text-xs font-sans">
                      <div>
                        <label className="block text-slate-500 font-bold mb-1">{isAr ? "استجابة العين" : "Eye Opening Response (E)"}</label>
                        <select value={gcsEye} onChange={(e) => setGcsEye(Number(e.target.value))} className="w-full border border-slate-300 rounded-xl p-2 font-bold bg-white outline-none">
                          <option value={4}>4 - Spontaneous opening</option>
                          <option value={3}>3 - Response to voice</option>
                          <option value={2}>2 - Response to pain</option>
                          <option value={1}>1 - None</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-500 font-bold mb-1">{isAr ? "الاستجابة اللفظية" : "Verbal Response (V)"}</label>
                        <select value={gcsVerbal} onChange={(e) => setGcsVerbal(Number(e.target.value))} className="w-full border border-slate-300 rounded-xl p-2 font-bold bg-white outline-none">
                          <option value={5}>5 - Oriented, converses normally</option>
                          <option value={4}>4 - Confused, disoriented</option>
                          <option value={3}>3 - Inappropriate words</option>
                          <option value={2}>2 - Incomprehensible sounds</option>
                          <option value={1}>1 - None</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-500 font-bold mb-1">{isAr ? "الاستجابة الحركية" : "Motor Response (M)"}</label>
                        <select value={gcsMotor} onChange={(e) => setGcsMotor(Number(e.target.value))} className="w-full border border-slate-300 rounded-xl p-2 font-bold bg-white outline-none">
                          <option value={6}>6 - Obeys commands</option>
                          <option value={5}>5 - Localizes painful stimulus</option>
                          <option value={4}>4 - Withdraws from pain</option>
                          <option value={3}>3 - Abnormal flexion (decorticate)</option>
                          <option value={2}>2 - Abnormal extension (decerebrate)</option>
                          <option value={1}>1 - None</option>
                        </select>
                      </div>
                      <button 
                        onClick={() => handleSaveAssessment("gcs", gcsEye + gcsVerbal + gcsMotor)}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
                      >
                        {isAr ? "حفظ التقييم في ملف المريض" : "Save GCS Assessment"}
                      </button>
                    </div>
                  </div>

                  {/* Morse Fall Risk */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                    <h4 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2 flex justify-between items-center">
                      <span>{isAr ? "مقياس السقوط (Morse Fall Risk)" : "Morse Fall Risk Scale"}</span>
                      <span className="bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-lg text-xs font-mono font-black border border-rose-200">
                        {isAr ? "خطر مرتفع" : "High Risk (70)"}
                      </span>
                    </h4>
                    <div className="text-xs space-y-3 font-semibold text-slate-600 font-sans">
                      <div className="flex items-center gap-2 p-1">
                        <input type="checkbox" checked={true} readOnly className="w-4 h-4 text-amber-500 rounded border-slate-300" />
                        <span>History of Falling: Yes (+25)</span>
                      </div>
                      <div className="flex items-center gap-2 p-1">
                        <input type="checkbox" checked={true} readOnly className="w-4 h-4 text-amber-500 rounded border-slate-300" />
                        <span>Secondary Diagnosis: Yes (+15)</span>
                      </div>
                      <div className="flex items-center gap-2 p-1">
                        <input type="checkbox" checked={true} readOnly className="w-4 h-4 text-amber-500 rounded border-slate-300" />
                        <span>Intravenous Therapy/Heparin Lock: Yes (+20)</span>
                      </div>
                      <div className="flex items-center gap-2 p-1">
                        <input type="checkbox" checked={true} readOnly className="w-4 h-4 text-amber-500 rounded border-slate-300" />
                        <span>Gait: Weak (+10)</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium leading-normal italic border-t border-slate-100 pt-2">
                        {isAr ? "أي سكور أكبر من 45 يستدعي اتخاذ إجراءات الحماية ووضع العلامة الصفراء بجانب السرير لمنع السقوط." : "Any score above 45 warrants fall protection protocols and bedside yellow triangle tags."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "io" && (
              <div className="space-y-6 w-full animate-fade-in pb-12">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-indigo-500" />
                    {isAr ? "مخطط توازن السوائل الداخلة والخارجة (Intake & Output)" : "Intake & Output Fluid Balance"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {isAr ? "مراقبة دقيقة للحجم والجرعات والسوائل الوريدية وحساب التوازن المائي اليومي بجوار السرير." : "Bedside monitoring of oral/IV fluid intake versus urine/drainage output."}
                  </p>
                </div>

                {/* Balance Summary Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-900 text-white rounded-2xl p-4 font-sans">
                  <div className="text-center space-y-1 border-r border-slate-800">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{isAr ? "إجمالي الوارد (Intake)" : "Total Intake"}</p>
                    <p className="text-xl font-black text-indigo-400">{ioIntakeTotal} mL</p>
                  </div>
                  <div className="text-center space-y-1 border-r border-slate-800">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{isAr ? "إجمالي الصادر (Output)" : "Total Output"}</p>
                    <p className="text-xl font-black text-amber-400">{ioOutputTotal} mL</p>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{isAr ? "الصافي (Net Balance)" : "Net Balance"}</p>
                    <p className={`text-xl font-black ${ioIntakeTotal - ioOutputTotal >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {ioIntakeTotal - ioOutputTotal >= 0 ? "+" : ""}{ioIntakeTotal - ioOutputTotal} mL
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                  {/* Intake list & Form */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <h4 className="font-bold text-slate-800 text-xs uppercase">{isAr ? "السوائل الواردة (Intake)" : "Fluid Intake Registry"}</h4>
                      <div className="flex gap-1.5">
                        <input 
                          type="number" 
                          placeholder="mL" 
                          value={ioIntakeAmt}
                          onChange={(e) => setIoIntakeAmt(e.target.value)}
                          className="w-16 border border-slate-300 rounded px-1.5 py-0.5 text-xs font-bold font-mono text-center outline-none" 
                        />
                        <button 
                          onClick={handleAddIntake}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] px-2 py-0.5 rounded cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {currentIntakes.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center text-xs font-semibold p-2 bg-slate-50 rounded-lg">
                          <span className="text-slate-700">{item.type}</span>
                          <span className="font-mono text-indigo-700">{item.amount} mL <span className="text-[9px] text-slate-400 font-bold ml-1">{item.date}</span></span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Output list & Form */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <h4 className="font-bold text-slate-800 text-xs uppercase">{isAr ? "السوائل الصادرة (Output)" : "Fluid Output Registry"}</h4>
                      <div className="flex gap-1.5">
                        <input 
                          type="number" 
                          placeholder="mL" 
                          value={ioOutputAmt}
                          onChange={(e) => setIoOutputAmt(e.target.value)}
                          className="w-16 border border-slate-300 rounded px-1.5 py-0.5 text-xs font-bold font-mono text-center outline-none" 
                        />
                        <button 
                          onClick={handleAddOutput}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] px-2 py-0.5 rounded cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {currentOutputs.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center text-xs font-semibold p-2 bg-slate-50 rounded-lg">
                          <span className="text-slate-700">{item.type}</span>
                          <span className="font-mono text-amber-700">{item.amount} mL <span className="text-[9px] text-slate-400 font-bold ml-1">{item.date}</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Vitals Signs Tab */}
            {activeTab === "vitals" && (
              <div className="space-y-6 w-full animate-fade-in pb-12">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-indigo-600" />
                    {isAr ? "مخطط تسجيل ومراقبة المؤشرات الحيوية" : "Vital Signs Documentation & Monitoring"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {isAr ? "تسجيل فوري لدرجة الحرارة وضغط الدم ونبض القلب والتشبع بالأكسجين ومعدل التنفس في السجل السريري للمريض." : "Real-time recording and tracking of patient clinical parameters including blood pressure, pulse, temperature, and SpO2."}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Log form */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="font-black text-xs text-slate-700 uppercase tracking-widest border-b border-slate-200 pb-2 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-indigo-600" />
                      {isAr ? "تسجيل علامة حيوية جديدة" : "Log New Vital Reading"}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-600">
                      <div className="space-y-1">
                        <label className="block text-slate-500">{isAr ? "الضغط الانقباضي" : "Systolic BP"}</label>
                        <input type="number" value={vitalsSysBP} onChange={(e) => setVitalsSysBP(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 font-mono text-center bg-white outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-slate-500">{isAr ? "الضغط الانبساطي" : "Diastolic BP"}</label>
                        <input type="number" value={vitalsDiaBP} onChange={(e) => setVitalsDiaBP(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 font-mono text-center bg-white outline-none" />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className="block text-slate-500">{isAr ? "نبض القلب (نبضة/دقيقة)" : "Heart Rate (bpm)"}</label>
                        <input type="number" value={vitalsHR} onChange={(e) => setVitalsHR(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 font-mono text-center bg-white outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-slate-500">{isAr ? "الحرارة (°C)" : "Temperature (°C)"}</label>
                        <input type="number" step="0.1" value={vitalsTemp} onChange={(e) => setVitalsTemp(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 font-mono text-center bg-white outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-slate-500">{isAr ? "التشبع بالأكسجين (%)" : "SpO2 (%)"}</label>
                        <input type="number" value={vitalsSpO2} onChange={(e) => setVitalsSpO2(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 font-mono text-center bg-white outline-none" />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className="block text-slate-500">{isAr ? "معدل التنفس (دورة/د)" : "Respiratory Rate (rr)"}</label>
                        <input type="number" value={vitalsRR} onChange={(e) => setVitalsRR(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 font-mono text-center bg-white outline-none" />
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const logs = (currentPatient as any).vitalsLog || [
                          { time: "2026-06-30 08:00", bp: "115/75", hr: 82, temp: 37.1, spo2: 98, rr: 16 },
                          { time: "2026-06-29 20:00", bp: "120/80", hr: 80, temp: 36.8, spo2: 99, rr: 14 }
                        ];
                        const newEntry = {
                          time: new Date().toLocaleString(),
                          bp: `${vitalsSysBP}/${vitalsDiaBP}`,
                          hr: parseInt(vitalsHR) || 80,
                          temp: parseFloat(vitalsTemp) || 37.0,
                          spo2: parseInt(vitalsSpO2) || 98,
                          rr: parseInt(vitalsRR) || 16
                        };
                        updatePatient(currentPatient.id, { vitalsLog: [newEntry, ...logs] });
                        toast.success(isAr ? "تم حفظ العلامة الحيوية الجديدة بنجاح" : "Vital signs recorded successfully");
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
                    >
                      {isAr ? "تسجيل وتوقيع رقمي" : "E-Sign & Record Vitals"}
                    </button>
                  </div>

                  {/* List and trend graph */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                      <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest border-b border-slate-100 pb-2 mb-3">
                        {isAr ? "تاريخ القياسات السريرية الموثقة" : "Clinical Parameters History Log"}
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left" dir="ltr">
                          <thead>
                            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                              <th className="py-2">{isAr ? "التاريخ والوقت" : "Date / Time"}</th>
                              <th className="py-2 text-center">{isAr ? "ضغط الدم" : "BP (mmHg)"}</th>
                              <th className="py-2 text-center">{isAr ? "النبض" : "HR (bpm)"}</th>
                              <th className="py-2 text-center">{isAr ? "الحرارة" : "Temp (°C)"}</th>
                              <th className="py-2 text-center">{isAr ? "الأكسجين" : "SpO2 (%)"}</th>
                              <th className="py-2 text-center">{isAr ? "التنفس" : "RR (bpm)"}</th>
                              <th className="py-2 text-center w-10"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                            {((currentPatient as any).vitalsLog || [
                              { time: "2026-06-30 08:00", bp: "115/75", hr: 82, temp: 37.1, spo2: 98, rr: 16 },
                              { time: "2026-06-29 20:00", bp: "120/80", hr: 80, temp: 36.8, spo2: 99, rr: 14 }
                            ]).map((log: any, idx: number) => {
                              const hrNum = parseInt(log.hr);
                              const tempNum = parseFloat(log.temp);
                              const spo2Num = parseInt(log.spo2);
                              const isHrHigh = hrNum > 100 || hrNum < 60;
                              const isTempHigh = tempNum > 38.0 || tempNum < 36.0;
                              const isSpO2Low = spo2Num < 95;

                              return (
                                <tr key={idx} className="hover:bg-slate-50/50 transition group">
                                  <td className="py-3 font-mono text-slate-500 text-[10px]">{log.time}</td>
                                  <td className="py-3 text-center font-mono font-black text-indigo-700">{log.bp}</td>
                                  <td className={`py-3 text-center font-mono ${isHrHigh ? "text-rose-600 font-black" : ""}`}>{log.hr} {isHrHigh && "⚠️"}</td>
                                  <td className={`py-3 text-center font-mono ${isTempHigh ? "text-rose-600 font-black" : ""}`}>{log.temp}°C</td>
                                  <td className={`py-3 text-center font-mono ${isSpO2Low ? "text-rose-600 font-black" : ""}`}>{log.spo2}%</td>
                                  <td className="py-3 text-center font-mono">{log.rr}</td>
                                  <td className="py-3 text-center">
                                    <button onClick={() => setActiveWorkflow("edit_record")} className="opacity-0 group-hover:opacity-100 transition text-indigo-600 hover:text-indigo-800 p-1">
                                      <FileEdit className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MAR Tab */}
            {activeTab === "mar" && (
              <div className="space-y-6 w-full animate-fade-in pb-12">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                    <Pill className="w-5 h-5 text-emerald-600" />
                    {isAr ? "سجل إعطاء الأدوية السريري الإلكتروني (eMAR)" : "Electronic Medication Administration Record (eMAR)"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {isAr ? "تحقق وإعطاء جرعات الأدوية للمريض مع التوقيع الإلكتروني والهوية السريرية لمنع الأخطاء الطبية." : "Verify and record medication administrations with electronic signature log to safeguard patient safety."}
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider">{isAr ? "جدول الأدوية والجرعات النشطة" : "Active Drug Schedules"}</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded font-black border border-emerald-200">ICU Bedside Verified</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {((currentPatient as any).prescriptions && (currentPatient as any).prescriptions.length > 0 ? (currentPatient as any).prescriptions : [
                      { id: "rx-default-1", name: "Ceftriaxone IV (مضاد حيوي)", dosage: "1g IV Q12H", status: "Active", date: "2026-06-29" },
                      { id: "rx-default-2", name: "Paracetamol Infusion (مسكن)", dosage: "1g IV Q8H", status: "Active", date: "2026-06-29" }
                    ]).map((rx: any) => {
                      const isDc = rx.status === "discontinued";
                      return (
                        <div key={rx.id} className={`p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/20 transition ${isDc ? "bg-slate-50/50 opacity-60" : ""}`}>
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {isDc ? (
                                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span>
                              ) : (
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                              )}
                              <p className={`font-extrabold text-sm text-slate-800 ${isDc ? "line-through text-slate-400" : ""}`}>
                                {rx.name || rx.medication}
                              </p>
                              {isDc && (
                                <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md border border-rose-200 font-bold">
                                  {isAr ? `موقوف: ${rx.discontinueReason === 'allergy' ? 'تحسس دواء' : rx.discontinueReason === 'plan_change' ? 'تغيير الخطة' : rx.discontinueReason === 'improved' ? 'تحسن الحالة' : 'سبب طبي'}` : `Discontinued: ${rx.discontinueReason || "Plan changed"}`}
                                </span>
                              )}
                              {rx.status === "pending" && (
                                <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-200 font-bold animate-pulse">
                                  {isAr ? "بانتظار موافقة الصيدلية" : "Pending Pharmacy Verification"}
                                </span>
                              )}
                              {rx.status === "dispensed" && (
                                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200 font-bold">
                                  {isAr ? "تم الصرف والمطابقة" : "Verified & Dispensed"}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-semibold font-mono">
                              <span>Dosage: <strong className={`text-slate-700 ${isDc ? "line-through text-slate-400" : ""}`}>{rx.dosage || rx.dose || "500mg PO BID"}</strong></span>
                              <span>Ordered: {rx.date}</span>
                              {rx.route && <span>Route: <strong className="text-indigo-600">{rx.route}</strong></span>}
                              {rx.frequency && <span>Frequency: <strong className="text-purple-600">{rx.frequency}</strong></span>}
                            </div>
                            {rx.specialInstructions && (
                              <p className="text-[11px] text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-100 font-sans">
                                <strong className="text-slate-700">{isAr ? "تعليمات خاصة:" : "Instructions:"}</strong> {rx.specialInstructions}
                              </p>
                            )}
                          </div>

                          {/* Action timeline / slots & Physician Discontinue button */}
                          <div className="flex flex-wrap items-center gap-3 shrink-0">
                            {/* eMAR Timeline Slots */}
                            {["08:00", "14:00", "20:00"].map((slot) => {
                              const marKey = `${rx.id}-${slot}`;
                              const adminRecord = ((currentPatient as any).marLog || {})[marKey];

                              if (isDc) {
                                return (
                                  <div key={slot} className="bg-slate-100 border border-slate-200 text-slate-400 p-2 rounded-xl text-[10px] font-semibold line-through">
                                    {isAr ? `موقوف @ ${slot}` : `D/C @ ${slot}`}
                                  </div>
                                );
                              }

                              if (adminRecord) {
                                const isHold = adminRecord.status === "Hold";
                                return (
                                  <div 
                                    key={slot} 
                                    className={`p-2 rounded-xl text-[10px] flex items-center gap-2 font-semibold border ${
                                      isHold 
                                        ? "bg-amber-50 border-amber-300 text-amber-800" 
                                        : "bg-emerald-50 border-emerald-300 text-emerald-800"
                                    }`}
                                  >
                                    <BadgeCheck className={`w-4 h-4 ${isHold ? "text-amber-600" : "text-emerald-600"}`} />
                                    <div className="text-left font-mono">
                                      <p className="font-black">
                                        {isHold 
                                          ? `${isAr ? "تأخير" : "Hold"} @ ${slot}` 
                                          : `${isAr ? "أعطي" : "Given"} @ ${slot}`}
                                      </p>
                                      {isHold && (
                                        <p className="text-[9px] text-amber-700 font-sans max-w-[120px] truncate">
                                          {isAr ? adminRecord.reasonAr : adminRecord.reasonEn}
                                        </p>
                                      )}
                                      <p className="text-[8px] text-slate-400 font-sans">{adminRecord.by}</p>
                                    </div>
                                  </div>
                                );
                              }

                              return (
                                <div key={slot} className="flex flex-col gap-1 items-stretch bg-slate-50/50 p-2 rounded-xl border border-slate-200">
                                  <span className="text-[10px] text-slate-400 font-extrabold text-center font-mono">{slot}</span>
                                  <div className="flex gap-1 flex-wrap ">
                                    {/* Give button */}
                                    <button
                                      onClick={() => {
                                        const marLog = (currentPatient as any).marLog || {};
                                        const updatedMarLog = {
                                          ...marLog,
                                          [marKey]: {
                                            status: "Administered",
                                            time: new Date().toLocaleTimeString().slice(0, 5),
                                            by: isAr ? "سارة أحمد، ممرض قانوني (E-Signed)" : "Sarah Smith, RN (E-Signed)"
                                          }
                                        };
                                        updatePatient(currentPatient.id, { marLog: updatedMarLog });
                                        updatePrescriptionStatus(rx.id, "administered");
                                        toast.success(isAr ? `تم تسجيل إعطاء جرعة ${rx.name || rx.medication} الساعة ${slot}` : `Recorded administration of ${rx.name || rx.medication} at ${slot}`);
                                      }}
                                      className="bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-600 hover:text-white px-2 py-1 rounded-lg text-[10px] font-black transition cursor-pointer"
                                    >
                                      {isAr ? "إعطاء" : "Give"}
                                    </button>

                                    {/* Hold button */}
                                    <button
                                      onClick={() => {
                                        setNotGivenState({ rxId: rx.id, slot });
                                      }}
                                      className="bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-600 hover:text-white px-2 py-1 rounded-lg text-[10px] font-black transition cursor-pointer"
                                    >
                                      {isAr ? "تأخير" : "Hold"}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}

                            {/* Discontinue drug button (Physician Only or Admin) */}
                            {!isDc && (userRole === "doctor" || userRole === "admin") && (
                              <button
                                onClick={() => setDiscontinueRxId(rx.id)}
                                className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white px-2.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                title={isAr ? "إيقاف صرف هذا الدواء" : "Discontinue Medication"}
                              >
                                <X className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{isAr ? "إيقاف" : "D/C"}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mandate Reason Code Dialog for "Not Given / Delay" */}
                  {notGivenState && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-modal flex items-center justify-center p-4 animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
                      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
                        <div className="bg-amber-600 text-white p-4 flex items-center justify-between shrink-0">
                          <h3 className="font-bold text-base flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 animate-bounce" />
                            {isAr ? "تحديد سبب عدم إعطاء الجرعة / التأخير" : "Reason Code for Hold/Delay"}
                          </h3>
                          <button onClick={() => setNotGivenState(null)} className="hover:bg-amber-700 p-1.5 rounded-lg text-white transition cursor-pointer">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="p-5 space-y-4 overflow-y-auto custom-scrollbar">
                          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                            {isAr 
                              ? "يتطلب بروتوكول سلامة المرضى المغلق (Closed-Loop) توثيق كود السبب الطبي لعدم تسليم الجرعة وضمان تسلم النوبتجية القادمة للبيانات بدقة."
                              : "The closed-loop protocol requires documenting a reason code for omitting/delaying medication doses."}
                          </p>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              {isAr ? "اختر كود السبب" : "Select Reason Code"}
                            </label>
                            {[
                              { code: "patient_out", en: "Patient off-ward / outside department", ar: "المريض خارج القسم أو الجناح" },
                              { code: "patient_refusal", en: "Patient refused dose", ar: "رفض المريض تناول الجرعة" },
                              { code: "clinical_hold", en: "Clinical Hold (e.g. low blood pressure, bradycardia)", ar: "مانع طبي مؤقت للجرعة (Clinical Hold)" },
                              { code: "npo", en: "Patient is Fasting (NPO)", ar: "المريض صائم (NPO)" },
                              { code: "out_of_stock", en: "Medication out of stock / unavailable", ar: "الدواء غير متوفر / نافد من القسم" },
                              { code: "complication", en: "Immediate complications (vomiting, etc.)", ar: "مضاعفات فورية (مثل القيء الحاد)" }
                            ].map((item) => (
                              <button
                                key={item.code}
                                onClick={() => setSelectedHoldReason(item.code)}
                                className={`w-full text-right sm:text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between border ${
                                  selectedHoldReason === item.code 
                                    ? "bg-amber-50 border-amber-400 text-amber-900" 
                                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                                }`}
                              >
                                <span>{isAr ? item.ar : item.en}</span>
                                {selectedHoldReason === item.code && <BadgeCheck className="w-4 h-4 text-amber-600 shrink-0" />}
                              </button>
                            ))}
                          </div>

                          <div className="space-y-1 pt-2 border-t border-slate-100">
                            <label className="text-xs font-bold text-slate-700 block">
                              {isAr ? "ملاحظات إضافية (اختياري)" : "Additional Notes (Optional)"}
                            </label>
                            <textarea
                              value={holdNotes}
                              onChange={(e) => setHoldNotes(e.target.value)}
                              rows={2}
                              placeholder={isAr ? "أضف أي تفاصيل أخرى لتوضيح سبب عدم الإعطاء..." : "Add any other details..."}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-amber-500 text-slate-700 resize-none"
                            ></textarea>
                          </div>
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 shrink-0">
                          <button onClick={() => setNotGivenState(null)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer">
                            {isAr ? "إلغاء" : "Cancel"}
                          </button>
                          <button 
                            onClick={() => {
                              const marLog = (currentPatient as any).marLog || {};
                              const marKey = `${notGivenState.rxId}-${notGivenState.slot}`;
                              
                              const holdReasonsAr = {
                                patient_out: "المريض خارج القسم",
                                patient_refusal: "رفض المريض الجرعة",
                                clinical_hold: "مانع طبي مؤقت",
                                npo: "المريض صائم (NPO)",
                                out_of_stock: "الدواء غير متوفر بالقسم",
                                complication: "مضاعفات فورية (تقيؤ)"
                              };
                              const holdReasonsEn = {
                                patient_out: "Patient off-ward",
                                patient_refusal: "Patient refused",
                                clinical_hold: "Clinical hold",
                                npo: "Patient is NPO (fasting)",
                                out_of_stock: "Medication unavailable",
                                complication: "Immediate complications"
                              };

                              const fullReasonAr = holdNotes.trim() ? `${holdReasonsAr[selectedHoldReason]} - ${holdNotes}` : holdReasonsAr[selectedHoldReason];
                              const fullReasonEn = holdNotes.trim() ? `${holdReasonsEn[selectedHoldReason]} - ${holdNotes}` : holdReasonsEn[selectedHoldReason];

                              const updatedMarLog = {
                                ...marLog,
                                [marKey]: {
                                  status: "Hold",
                                  time: new Date().toLocaleTimeString().slice(0, 5),
                                  by: isAr ? "سارة أحمد، ممرض قانوني (E-Signed)" : "Sarah Smith, RN (E-Signed)",
                                  reasonAr: fullReasonAr,
                                  reasonEn: fullReasonEn
                                }
                              };
                              updatePatient(currentPatient.id, { marLog: updatedMarLog });
                              updatePrescriptionStatus(notGivenState.rxId, "not_given", {
                                holdReason: fullReasonEn
                              });
                              setNotGivenState(null);
                              setHoldNotes("");
                              toast.warning(isAr ? "تم تسجيل تأخير إعطاء الجرعة وتوثيق كود السبب بنجاح." : "Omitting/hold of medication dose documented successfully.");
                            }}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-md transition cursor-pointer"
                          >
                            {isAr ? "حفظ وتوثيق السبب" : "Save & Document Hold"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Discontinue Order Reason Dialog */}
                  {discontinueRxId && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-modal flex items-center justify-center p-4 animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
                      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
                        <div className="bg-rose-600 text-white p-4 flex items-center justify-between">
                          <h3 className="font-bold text-base flex items-center gap-2">
                            <Ban className="w-5 h-5 animate-pulse" />
                            {isAr ? "إيقاف صرف الدواء (D/C)" : "Discontinue Medication (D/C)"}
                          </h3>
                          <button onClick={() => setDiscontinueRxId(null)} className="hover:bg-rose-700 p-1.5 rounded-lg text-white transition cursor-pointer">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="p-5 space-y-4">
                          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                            {isAr 
                              ? "سيتم شطب الدواء من جدول إعطاء الأدوية وإبلاغ الصيدلية فوراً. يرجى تحديد السبب الطبي:"
                              : "This will strike through the medication on the MAR and notify pharmacy immediately. Select clinical reason:"}
                          </p>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              {isAr ? "اختر كود إيقاف العلاج" : "Select Discontinuation Code"}
                            </label>
                            {[
                              { code: "allergy", en: "Adverse Reaction / Allergy", ar: "رد فعل تحسسي / تفاعل عكسي" },
                              { code: "completed", en: "Course Completed", ar: "انتهاء فترة العلاج المقررة" },
                              { code: "ineffective", en: "Ineffective / Switch required", ar: "غير فعال / يتطلب تغييراً" },
                              { code: "error", en: "Entered in error", ar: "أُدخل بالخطأ" }
                            ].map((item) => (
                              <button
                                key={item.code}
                                onClick={() => setSelectedDiscontinueReason(item.code)}
                                className={`w-full text-right sm:text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between border ${
                                  selectedDiscontinueReason === item.code 
                                    ? "bg-rose-50 border-rose-400 text-rose-900" 
                                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                                }`}
                              >
                                <span>{isAr ? item.ar : item.en}</span>
                                {selectedDiscontinueReason === item.code && <BadgeCheck className="w-4 h-4 text-rose-600 shrink-0" />}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                          <button onClick={() => setDiscontinueRxId(null)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer">
                            {isAr ? "تراجع" : "Cancel"}
                          </button>
                          <button 
                            onClick={() => {
                              const updatedPrescriptions = (currentPatient as any).prescriptions?.map(rx => 
                                rx.id === discontinueRxId ? { ...rx, status: "discontinued" as "discontinued" } : rx
                              );
                              
                              // Update active patient prescriptions nested
                              updatePatient(currentPatient.id, { prescriptions: updatedPrescriptions });
                              
                              // Update global context prescriptions
                              updatePrescriptionStatus(discontinueRxId, "discontinued", {
                                discontinueReason: selectedDiscontinueReason
                              });

                              setDiscontinueRxId(null);
                              toast.success(isAr ? "تم إيقاف الدواء وشطبه بنجاح من شاشات التمريض والصيدلية." : "Medication order discontinued and struck through on MAR.");
                            }}
                            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-md transition cursor-pointer"
                          >
                            {isAr ? "توقيع وإيقاف العلاج" : "Sign & Discontinue Order"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Doctor Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-6 w-full animate-fade-in pb-12">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-rose-600" />
                    {isAr ? "مفكرة الأوامر السريرية والأشعة والمختبر" : "Clinical Orders & Progress Board"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {isAr ? "مراجعة وإلغاء وتتبع الأوامر الطبية الموجهة للمختبر الطبي (LIS) ونظام الأشعة (RIS) من الأطباء." : "Track state, collection status, and clinical completion results of laboratory and radiology orders."}
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left" dir="ltr">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px] tracking-wider">
                          <th className="p-4">{isAr ? "الطلب" : "Order Details"}</th>
                          <th className="p-4">{isAr ? "التاريخ" : "Ordered Date"}</th>
                          <th className="p-4">{isAr ? "النوع" : "Category"}</th>
                          <th className="p-4">{isAr ? "الحالة" : "Status"}</th>
                          <th className="p-4 text-center">{isAr ? "الإجراء" : "Actions"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                        {((currentPatient as any).orders && (currentPatient as any).orders.length > 0 ? (currentPatient as any).orders : [
                          { id: "ord-default-1", type: "LAB", name: "CBC (Complete Blood Count)", status: "Completed", date: "2026-06-29" },
                          { id: "ord-default-2", type: "RAD", name: "Chest X-Ray Portable", status: "Completed", date: "2026-06-28" }
                        ]).map((ord: any, ordIdx: number) => {
                          const isCompleted = ord.status === "Completed";
                          return (
                            <tr key={ord.id ? `${ord.id}-${ordIdx}` : `ord-${ordIdx}`} className="hover:bg-slate-50/50 transition">
                              <td className="p-4">
                                <p className="font-extrabold text-slate-800">{ord.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono">ID: {ord.id}</p>
                              </td>
                              <td className="p-4 font-mono text-[11px] text-slate-500">{ord.date}</td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wider uppercase ${ord.type === "LAB" ? "bg-rose-50 text-rose-600 border border-rose-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                                  {ord.type}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  ord.status === "Completed" ? "bg-emerald-50 text-emerald-700" : 
                                  ord.status === "In Progress" || ord.status === "Sample Collected" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"
                                }`}>
                                  {ord.status}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                {isCompleted ? (
                                  <button
                                    onClick={() => {
                                      if (ord.type === "LAB") {
                                        setSelectedLabReportId(ord.id);
                                        setActiveTab("labs");
                                      } else {
                                        setActiveTab("radiology");
                                      }
                                    }}
                                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[10px] shadow-sm transition cursor-pointer"
                                  >
                                    {isAr ? "عرض النتيجة" : "View Result"}
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-slate-400 italic">{isAr ? "بانتظار المعالجة" : "Awaiting processing"}</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Labs Tab */}
            {activeTab === "labs" && (
              <div className="space-y-6 w-full animate-fade-in pb-12">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-rose-600" />
                    {isAr ? "نظام عرض التحاليل المعملية المعتمدة LIS" : "Integrated LIS Laboratory Reports"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {isAr ? "تصفح وعرض التقارير الطبية المخبرية الرسمية الموقعة من رئيس قسم المختبر والمسجلة بنظام LIS." : "View verified medical laboratory results. Results flagged out of reference ranges are automatically highlighted."}
                  </p>
                </div>

                {/* Sidebar + Main layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Selectors Sidebar */}
                  <div className="space-y-3 lg:col-span-1">
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">{isAr ? "التقارير المتوفرة" : "Available Reports"}</h4>
                    {[
                      ...(((currentPatient as any).orders || [])
                        .filter((o: any) => o.type === "LAB" && o.status === "Completed")
                        .map((o: any) => ({
                          id: o.id,
                          name: o.name,
                          completedAt: o.completedAt || o.date,
                          result: o.result,
                          notes: o.notes
                        }))),
                      {
                        id: "default-cbc",
                        name: "Complete Blood Count (CBC)",
                        completedAt: "2026-06-29 11:15 AM",
                        notes: "Mild anemia, red blood cells slightly microcytic. Otherwise normal leukocyte and platelet count.",
                        result: [
                          { name: "WBC (White Blood Cells)", value: 7.2, unit: "10^9/L", min: 4.0, max: 11.0, abnormal: false },
                          { name: "RBC (Red Blood Cells)", value: 3.8, unit: "10^12/L", min: 4.5, max: 5.9, abnormal: true },
                          { name: "Hemoglobin (Hgb)", value: 11.2, unit: "g/dL", min: 13.5, max: 17.5, abnormal: true },
                          { name: "Hematocrit (Hct)", value: 34.1, unit: "%", min: 41.0, max: 50.0, abnormal: true },
                          { name: "MCV", value: 81.5, unit: "fL", min: 80.0, max: 100.0, abnormal: false },
                          { name: "Platelets (PLT)", value: 245, unit: "10^9/L", min: 150, max: 450, abnormal: false }
                        ]
                      },
                      {
                        id: "default-bmp",
                        name: "Basic Metabolic Panel (BMP)",
                        completedAt: "2026-06-29 11:15 AM",
                        notes: "Potassium levels are within stable range, blood urea nitrogen (BUN) slightly elevated.",
                        result: [
                          { name: "Sodium", value: 139, unit: "mEq/L", min: 136, max: 145, abnormal: false },
                          { name: "Potassium", value: 4.1, unit: "mEq/L", min: 3.5, max: 5.1, abnormal: false },
                          { name: "Chloride", value: 102, unit: "mEq/L", min: 98, max: 107, abnormal: false },
                          { name: "Carbon Dioxide (CO2)", value: 24, unit: "mEq/L", min: 22, max: 29, abnormal: false },
                          { name: "Glucose", value: 112, unit: "mg/dL", min: 70, max: 100, abnormal: true },
                          { name: "Blood Urea Nitrogen (BUN)", value: 22, unit: "mg/dL", min: 7, max: 20, abnormal: true },
                          { name: "Creatinine", value: 0.9, unit: "mg/dL", min: 0.6, max: 1.2, abnormal: false }
                        ]
                      }
                    ].map((report: any) => {
                      const isSelected = selectedLabReportId === report.id || (!selectedLabReportId && report.id === "default-cbc");
                      return (
                        <div
                          key={report.id}
                          onClick={() => setSelectedLabReportId(report.id)}
                          className={`p-3 rounded-xl border transition cursor-pointer text-left ${isSelected ? "bg-rose-50/50 border-rose-300 shadow-xs" : "bg-white border-slate-200 hover:border-slate-300"}`}
                        >
                          <p className="font-extrabold text-xs text-slate-800">{report.name}</p>
                          <p className="text-[9px] text-slate-400 font-mono mt-2">{report.completedAt}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Clinical Report Display Card */}
                  <div className="lg:col-span-3">
                    {(() => {
                      const completedLabOrders = ((currentPatient as any).orders || [])
                        .filter((o: any) => o.type === "LAB" && o.status === "Completed")
                        .map((o: any) => ({
                          id: o.id,
                          name: o.name,
                          completedAt: o.completedAt || o.date,
                          result: o.result,
                          notes: o.notes
                        }));
                      const allReports = [
                        ...completedLabOrders,
                        {
                          id: "default-cbc",
                          name: "Complete Blood Count (CBC)",
                          completedAt: "2026-06-29 11:15 AM",
                          notes: "Mild anemia, red blood cells slightly microcytic. Otherwise normal leukocyte and platelet count.",
                          result: [
                            { name: "WBC (White Blood Cells)", value: 7.2, unit: "10^9/L", min: 4.0, max: 11.0, abnormal: false },
                            { name: "RBC (Red Blood Cells)", value: 3.8, unit: "10^12/L", min: 4.5, max: 5.9, abnormal: true },
                            { name: "Hemoglobin (Hgb)", value: 11.2, unit: "g/dL", min: 13.5, max: 17.5, abnormal: true },
                            { name: "Hematocrit (Hct)", value: 34.1, unit: "%", min: 41.0, max: 50.0, abnormal: true },
                            { name: "MCV", value: 81.5, unit: "fL", min: 80.0, max: 100.0, abnormal: false },
                            { name: "Platelets (PLT)", value: 245, unit: "10^9/L", min: 150, max: 450, abnormal: false }
                          ]
                        },
                        {
                          id: "default-bmp",
                          name: "Basic Metabolic Panel (BMP)",
                          completedAt: "2026-06-29 11:15 AM",
                          notes: "Potassium levels are within stable range, blood urea nitrogen (BUN) slightly elevated.",
                          result: [
                            { name: "Sodium", value: 139, unit: "mEq/L", min: 136, max: 145, abnormal: false },
                            { name: "Potassium", value: 4.1, unit: "mEq/L", min: 3.5, max: 5.1, abnormal: false },
                            { name: "Chloride", value: 102, unit: "mEq/L", min: 98, max: 107, abnormal: false },
                            { name: "Carbon Dioxide (CO2)", value: 24, unit: "mEq/L", min: 22, max: 29, abnormal: false },
                            { name: "Glucose", value: 112, unit: "mg/dL", min: 70, max: 100, abnormal: true },
                            { name: "Blood Urea Nitrogen (BUN)", value: 22, unit: "mg/dL", min: 7, max: 20, abnormal: true },
                            { name: "Creatinine", value: 0.9, unit: "mg/dL", min: 0.6, max: 1.2, abnormal: false }
                          ]
                        }
                      ];
                      const activeReport = allReports.find(r => r.id === selectedLabReportId) || allReports.find(r => r.id === "default-cbc") || allReports[0];

                      if (!activeReport) return null;

                      return (
                        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                          {/* Inner Lab Header */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-4">
                            <div>
                              <h4 className="font-black text-slate-800 text-sm tracking-wide uppercase">{activeReport.name}</h4>
                              <p className="text-[10px] font-mono text-slate-500 mt-1">REPORT_UID: {activeReport.id}</p>
                            </div>
                            <div className="text-left sm:text-right text-xs font-semibold text-slate-600 font-mono">
                              <p>{isAr ? "تاريخ الإصدار" : "Released:"} <strong className="text-slate-800">{activeReport.completedAt}</strong></p>
                              <span className="inline-block mt-1 bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[9px] font-black tracking-widest border border-rose-200 uppercase">
                                Clinical final report
                              </span>
                            </div>
                          </div>

                          {/* Dynamic Results Table */}
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left" dir="ltr">
                              <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-wider">
                                  <th className="py-2">{isAr ? "اسم المؤشر" : "Parameter Name"}</th>
                                  <th className="py-2 text-center">{isAr ? "النتيجة" : "Measured Value"}</th>
                                  <th className="py-2 text-center">{isAr ? "الوحدة" : "Unit"}</th>
                                  <th className="py-2 text-right">{isAr ? "المعدل الطبيعي" : "Reference Range"}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                                {(activeReport.result || []).map((param: any, idx: number) => {
                                  return (
                                    <tr key={idx} className="hover:bg-slate-50/20 transition">
                                      <td className="py-3 text-slate-800">{param.name}</td>
                                      <td className="py-3 text-center font-mono">
                                        {param.abnormal ? (
                                          <span className="text-rose-600 font-black bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded-lg flex items-center justify-center gap-1 w-20 mx-auto">
                                            {param.value} ↓
                                          </span>
                                        ) : (
                                          <span className="font-extrabold text-slate-800">{param.value}</span>
                                        )}
                                      </td>
                                      <td className="py-3 text-center text-slate-500 font-mono text-[10px]">{param.unit}</td>
                                      <td className="py-3 text-right text-slate-500 font-mono text-[10px]">
                                        {param.min} - {param.max}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>

                          {/* Remarks Section */}
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
                            <p className="font-black text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-1.5 mb-2">{isAr ? "ملاحظات الطبيب الاستشاري" : "Pathologist Remarks"}</p>
                            <p className="text-slate-600 italic font-medium leading-relaxed">
                              {activeReport.notes || (isAr ? "جميع المؤشرات طبيعية وفي النطاق المستقر." : "No significant morphological abnormalities. Retest if clinically indicated.")}
                            </p>
                          </div>

                          {/* Digital sign */}
                          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono border-t border-slate-200 pt-4">
                            <span>E-Signed by Clinical Lab Director:</span>
                            <span className="font-extrabold text-slate-700">Dr. Tariq Hamed, MD (Clinical Pathologist)</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Problems & Allergies Tab */}
            {activeTab === "problems" && (
              <div className="space-y-6 w-full animate-fade-in pb-12">
                <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                  <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-rose-600" />
                    {isAr ? "التشخيصات والحساسية" : "Problems & Allergies"}
                  </h3>
                  <button 
                    onClick={() => setActiveWorkflow("add_problem")}
                    className="bg-rose-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-rose-700 transition flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {isAr ? "إضافة تشخيص/حساسية" : "Add Problem/Allergy"}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Allergies */}
                  <div className="bg-white border border-rose-200 rounded-2xl p-6 shadow-sm">
                    <h4 className="font-black text-rose-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" />
                      {isAr ? "تنبيهات الحساسية" : "Allergies"}
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-rose-50 border border-rose-100 rounded-xl group relative">
                        <div>
                          <p className="font-bold text-rose-900">Penicillin (بنسيلين)</p>
                          <p className="text-xs text-rose-700 mt-1">Reaction: Severe Rash & Anaphylaxis risk</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setActiveWorkflow("edit_record")} className="opacity-0 group-hover:opacity-100 transition text-rose-600 hover:text-rose-800">
<FileEdit className="w-4 h-4" />
</button>
                          <span className="bg-rose-200 text-rose-800 px-2 py-1 rounded text-xs font-black uppercase">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Problems */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h4 className="font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-indigo-500" />
                      {isAr ? "التشخيصات النشطة" : "Active Problem List"}
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition group">
                        <div>
                          <p className="font-bold text-slate-800">Essential Hypertension</p>
                          <p className="text-xs text-slate-500 mt-1 font-mono">ICD-10: I10</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => toast.info(isAr ? "تعديل السجل" : "Edit Record")} className="opacity-0 group-hover:opacity-100 transition text-indigo-600 hover:text-indigo-800">
<FileEdit className="w-4 h-4" />
</button>
                          <span className="text-xs text-slate-400 font-bold">Diagnosed: 2024</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition group">
                        <div>
                          <p className="font-bold text-slate-800">Type 2 Diabetes Mellitus</p>
                          <p className="text-xs text-slate-500 mt-1 font-mono">ICD-10: E11.9</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => toast.info(isAr ? "تعديل السجل" : "Edit Record")} className="opacity-0 group-hover:opacity-100 transition text-indigo-600 hover:text-indigo-800">
<FileEdit className="w-4 h-4" />
</button>
                          <span className="text-xs text-slate-400 font-bold">Diagnosed: 2025</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Care Plan Tab */}
            {activeTab === "care_plan" && (
              <div className="space-y-6 w-full animate-fade-in pb-12">
                <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                  <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    {isAr ? "خطة الرعاية" : "Care Plan"}
                  </h3>
                  <div className="flex gap-2 min-w-max">
                    <button className="bg-indigo-50 text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-indigo-100 transition flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {isAr ? "سجل الخطط السابقة" : "History"}
                    </button>
                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-emerald-700 transition flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      {isAr ? "تحديث الخطة" : "Update Plan"}
                    </button>
                  </div>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <div className="space-y-6">
                    <div className="group relative">
                      <h4 className="font-black text-slate-800 text-sm mb-2 flex items-center justify-between">
                        {isAr ? "أهداف الرعاية الحالية" : "Current Goals of Care"}
                        <button onClick={() => setActiveWorkflow("edit_record")} className="opacity-0 group-hover:opacity-100 transition text-indigo-600 hover:text-indigo-800 bg-white shadow-sm border border-slate-200 p-1.5 rounded-md cursor-pointer">
<FileEdit className="w-3.5 h-3.5" />
</button>
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                        Patient to maintain stable blood pressure below 130/80 mmHg. Achieve pain control level below 3/10. Early mobilization on post-op day 1.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-sm mb-3 flex items-center justify-between">
                        {isAr ? "التدخلات التمريضية والطبية" : "Interventions"}
                        <button className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center gap-1 cursor-pointer">
                            <Plus className="w-3.5 h-3.5" />
                            {isAr ? "إضافة تدخل" : "Add Intervention"}
                        </button>
                      </h4>
                      <div className="space-y-2">
                        <div className="group relative flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
                          <label className="flex flex-wrap items-center gap-2 sm:gap-3 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded" defaultChecked />
                            <span className="text-sm font-semibold text-slate-700 line-through">Vitals monitoring every 4 hours</span>
                          </label>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 opacity-0 group-hover:opacity-100 transition">
                             <span className="text-[10px] text-slate-400 font-bold font-mono">08:00 AM</span>
                             <button onClick={() => toast.info(isAr ? "تعديل السجل" : "Edit Record")} className="text-indigo-600 hover:text-indigo-800 cursor-pointer"><FileEdit className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                        <div className="group relative flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
                          <label className="flex flex-wrap items-center gap-2 sm:gap-3 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded" />
                            <span className="text-sm font-semibold text-slate-700">Strict Intake and Output charting</span>
                          </label>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 opacity-0 group-hover:opacity-100 transition">
                             <span className="text-[10px] text-slate-400 font-bold font-mono">Pending</span>
                             <button onClick={() => toast.info(isAr ? "تعديل السجل" : "Edit Record")} className="text-indigo-600 hover:text-indigo-800 cursor-pointer"><FileEdit className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                        <div className="group relative flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
                          <label className="flex flex-wrap items-center gap-2 sm:gap-3 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded" />
                            <span className="text-sm font-semibold text-slate-700">Physical therapy consultation for mobility</span>
                          </label>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 opacity-0 group-hover:opacity-100 transition">
                             <span className="text-[10px] text-slate-400 font-bold font-mono">Pending</span>
                             <button onClick={() => toast.info(isAr ? "تعديل السجل" : "Edit Record")} className="text-indigo-600 hover:text-indigo-800 cursor-pointer"><FileEdit className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Surgery & Procedures Tab */}
            {activeTab === "surgery" && (
              <div className="space-y-6 w-full animate-fade-in pb-12">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-600" />
                    {isAr ? "العمليات والإجراءات السريرية" : "Surgery & Clinical Procedures"}
                  </h3>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-xs text-left" dir="ltr">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px] tracking-wider">
                        <th className="p-4">{isAr ? "الإجراء" : "Procedure"}</th>
                        <th className="p-4">{isAr ? "التاريخ" : "Date"}</th>
                        <th className="p-4">{isAr ? "الجراح / الطبيب" : "Surgeon / Physician"}</th>
                        <th className="p-4">{isAr ? "الملاحظات" : "Notes"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      <tr className="hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <p className="font-extrabold text-slate-800">Laparoscopic Appendectomy</p>
                          <p className="text-[10px] text-slate-400 font-mono">CPT: 44970</p>
                        </td>
                        <td className="p-4">2023-05-12</td>
                        <td className="p-4">Dr. Tarek Mahmoud</td>
                        <td className="p-4 text-slate-500">Uncomplicated. Patient discharged POD 1.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Attachments Tab */}
            {activeTab === "attachments" && (
              <div className="space-y-6 w-full animate-fade-in pb-12">
                <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                  <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-sky-600" />
                    {isAr ? "المرفقات والمستندات" : "Attachments & Documents"}
                  </h3>
                  <button className="bg-sky-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-sky-700 transition flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    {isAr ? "إضافة ملف" : "Upload File"}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="border border-slate-200 p-4 rounded-2xl flex items-center gap-2 sm:gap-4 flex-wrap  bg-white hover:border-sky-300 transition cursor-pointer">
                    <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800">National ID Card</p>
                      <p className="text-[10px] text-slate-400">PDF • 1.2 MB • Uploaded 2026-01-10</p>
                    </div>
                  </div>
                  <div className="border border-slate-200 p-4 rounded-2xl flex items-center gap-2 sm:gap-4 flex-wrap  bg-white hover:border-sky-300 transition cursor-pointer">
                    <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800">External Lab Results</p>
                      <p className="text-[10px] text-slate-400">PDF • 2.4 MB • Uploaded 2026-06-25</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === "billing" && (
              <div className="space-y-6 w-full animate-fade-in pb-12">
                <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                  <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-emerald-600" />
                    {isAr ? "الفوترة والدورة المالي للمريض" : "Patient Revenue Cycle & Billing"}
                  </h3>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center gap-2">
                       <Printer className="w-3.5 h-3.5" />
                       {isAr ? "طباعة الفاتورة الأولية" : "Print Interim Bill"}
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Financial Overview */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900 rounded-[32px] p-6 text-white shadow-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-8 opacity-10">
                          <CreditCard className="w-32 h-32" />
                       </div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{isAr ? "إجمالي المبلغ المستحق" : "Total Outstanding Amount"}</p>
                       <h4 className="text-4xl font-black mb-6 tracking-tighter">
                          <span className="text-lg font-bold text-slate-500 mr-1">SAR</span>
                          {(1420 + ((currentPatient as any).consumables?.reduce((acc: number, curr: any) => acc + (curr.price * curr.qty), 0) || 0)).toFixed(2)}
                       </h4>
                       
                       <div className="space-y-3 pt-6 border-t border-slate-800">
                          <div className="flex justify-between items-center text-xs font-bold">
                             <span className="text-slate-500">{isAr ? "تغطية التأمين" : "Insurance Coverage"}</span>
                             <span className="text-emerald-400">80%</span>
                          </div>
                          <div className="flex justify-between items-center text-xs font-bold">
                             <span className="text-slate-500">{isAr ? "تحمل المريض (Co-pay)" : "Patient Co-payment"}</span>
                             <span>20% (Max SAR 500)</span>
                          </div>
                          <div className="flex justify-between items-center text-xs font-bold">
                             <span className="text-slate-500">{isAr ? "الوديعة المدفوعة" : "Deposit Paid"}</span>
                             <span className="text-indigo-400">SAR 0.00</span>
                          </div>
                       </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
                       <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{isAr ? "تفاصيل الجهة الضامنة" : "Guarantor Details"}</h5>
                       <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                             <ShieldCheck className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                             <p className="text-sm font-black text-slate-900">Bupa Arabia</p>
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Class A (Premium)</p>
                          </div>
                       </div>
                       <div className="space-y-4">
                          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{isAr ? "رقم الموافقة المسبقة" : "Pre-Auth Number"}</p>
                             <p className="text-xs font-mono font-bold text-slate-800">AUTH-HIS-2024-99812</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{isAr ? "تاريخ انتهاء البطاقة" : "Expiry Date"}</p>
                             <p className="text-xs font-bold text-slate-800">2027-12-31</p>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Charges List */}
                  <div className="lg:col-span-2">
                    <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm flex flex-col h-full">
                       <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "بيان الخدمات والرسوم" : "Itemized Statement of Services"}</span>
                          <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[9px] font-black text-slate-600 uppercase tracking-widest">Last Sync: Just Now</span>
                       </div>
                       <div className="flex-1 overflow-y-auto min-h-[400px]">
                          <table className="w-full text-right rtl:text-right ltr:text-left">
                             <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <tr>
                                   <th className="px-6 py-4">{isAr ? "التاريخ" : "Date"}</th>
                                   <th className="px-6 py-4">{isAr ? "الوصف" : "Description"}</th>
                                   <th className="px-6 py-4 text-center">{isAr ? "الكمية" : "Qty"}</th>
                                   <th className="px-6 py-4 text-center">{isAr ? "السعر" : "Price"}</th>
                                   <th className="px-6 py-4 text-left">{isAr ? "الإجمالي" : "Total"}</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-50 text-xs font-bold">
                                <tr>
                                   <td className="px-6 py-4 text-slate-400 font-mono">2024-05-20</td>
                                   <td className="px-6 py-4 text-slate-900">{isAr ? "رسوم استشارة الطبيب" : "Doctor Consultation Fee"}</td>
                                   <td className="px-6 py-4 text-center">1</td>
                                   <td className="px-6 py-4 text-center">300.00</td>
                                   <td className="px-6 py-4 text-left font-mono">300.00</td>
                                </tr>
                                <tr>
                                   <td className="px-6 py-4 text-slate-400 font-mono">2024-05-20</td>
                                   <td className="px-6 py-4 text-slate-900">{isAr ? "إقامة جناح (ليلة واحدة)" : "Ward Room Charge (1 Night)"}</td>
                                   <td className="px-6 py-4 text-center">1</td>
                                   <td className="px-6 py-4 text-center">1200.00</td>
                                   <td className="px-6 py-4 text-left font-mono">1200.00</td>
                                </tr>
                                {(currentPatient as any).consumables?.map((c: any) => (
                                  <tr key={c.id}>
                                     <td className="px-6 py-4 text-slate-400 font-mono">{new Date().toISOString().split('T')[0]}</td>
                                     <td className="px-6 py-4 text-slate-900">{isAr ? c.nameAr : c.nameEn}</td>
                                     <td className="px-6 py-4 text-center">{c.qty}</td>
                                     <td className="px-6 py-4 text-center">{c.price.toFixed(2)}</td>
                                     <td className="px-6 py-4 text-left font-mono">{(c.price * c.qty).toFixed(2)}</td>
                                  </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                       <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                          <div className="flex gap-4">
                             <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "إجمالي الخدمات" : "Subtotal"}</span>
                                <span className="text-sm font-black text-slate-900">SAR {(1500 + ((currentPatient as any).consumables?.reduce((acc: number, curr: any) => acc + (curr.price * curr.qty), 0) || 0)).toFixed(2)}</span>
                             </div>
                             <div className="flex flex-col border-r border-slate-200 pr-4">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "خصم التأمين" : "Insurance Disc."}</span>
                                <span className="text-sm font-black text-rose-500">SAR -1200.00</span>
                             </div>
                          </div>
                          <div className="flex flex-col items-end">
                             <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{isAr ? "صافي مستحق المريض" : "Net Patient Payable"}</span>
                             <span className="text-xl font-black text-slate-900">SAR {(300 + ((currentPatient as any).consumables?.reduce((acc: number, curr: any) => acc + (curr.price * curr.qty), 0) || 0)).toFixed(2)}</span>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Consumables Tab */}
            {activeTab === "consumables" && (
              <div className="space-y-6 w-full animate-fade-in pb-12">
                <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                  <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                    <Syringe className="w-5 h-5 text-emerald-600" />
                    {isAr ? "المستهلكات الطبية" : "Medical Consumables"}
                  </h3>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {isAr ? "إضافة مستهلكات للفاتورة" : "Record Supplies for Billing"}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Entry Form */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider">{isAr ? "البحث عن صنف" : "Search Item"}</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition font-bold"
                            placeholder={isAr ? "ابحث بالاسم..." : "Search by name..."}
                            value={consumableSearchTerm}
                            onChange={(e) => setConsumableSearchTerm(e.target.value)}
                          />
                          {consumableSearchTerm && !selectedConsumable && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-dropdown max-h-48 overflow-y-auto">
                              {filteredInventory.map(item => (
                                <button
                                  key={item.id}
                                  onClick={() => {
                                    setSelectedConsumable(item);
                                    setConsumableSearchTerm(isAr ? item.nameAr : item.nameEn);
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-sm font-bold border-b border-slate-50 last:border-0"
                                >
                                  <div className="flex justify-between items-center">
                                    <span>{isAr ? item.nameAr : item.nameEn}</span>
                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase">{item.stock} in stock</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-500 uppercase tracking-wider">{isAr ? "الكمية" : "Quantity"}</label>
                          <input 
                            type="number" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none font-black"
                            value={consumableQty}
                            onChange={(e) => setConsumableQty(Math.max(1, parseInt(e.target.value) || 1))}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-500 uppercase tracking-wider">{isAr ? "المخزن" : "Store"}</label>
                          <select 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                            value={selectedStore}
                            onChange={(e) => setSelectedStore(e.target.value)}
                          >
                            <option value="Sub-Store (Nursing)">{isAr ? "مخزن فرعي (تمريض)" : "Sub-Store (Nursing)"}</option>
                            <option value="Main Medical Store">{isAr ? "المخزن الرئيسي" : "Main Medical Store"}</option>
                            <option value="ER Pharmacy">{isAr ? "صيدلية الطوارئ" : "ER Pharmacy"}</option>
                          </select>
                        </div>
                      </div>

                      <button 
                        onClick={handleRecordConsumable}
                        disabled={!selectedConsumable}
                        className={`w-full py-3 rounded-xl text-sm font-black transition flex items-center justify-center gap-2 shadow-sm ${
                          selectedConsumable 
                            ? "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98]" 
                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        {isAr ? "إضافة للفاتورة" : "Add to Invoice"}
                      </button>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1">{isAr ? "ملاحظة النظام" : "System Note"}</p>
                      <p className="text-[11px] text-amber-700 font-medium">
                        {isAr 
                          ? "سيتم خصم الكميات المختارة آلياً من المخزن المحدد بمجرد الحفظ، وتضاف تكلفتها لفاتورة المريض الحالية." 
                          : "Selected quantities will be automatically deducted from stock and added to the current patient invoice."}
                      </p>
                    </div>
                  </div>

                  {/* Consumables History List */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                      <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
                        <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">{isAr ? "المستهلكات المسجلة للزيارة" : "Recorded Consumables for Visit"}</h4>
                        <span className="text-[10px] font-black bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full uppercase">
                          {(currentPatient as any).consumables?.length || 0} ITEMS
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-100 text-slate-400 font-black uppercase text-[9px] tracking-widest">
                              <th className="px-5 py-3">{isAr ? "الصنف" : "Item"}</th>
                              <th className="px-5 py-3 text-center">{isAr ? "الكمية" : "Qty"}</th>
                              <th className="px-5 py-3 text-center">{isAr ? "المخزن" : "Store"}</th>
                              <th className="px-5 py-3 text-center">{isAr ? "الوقت" : "Time"}</th>
                              <th className="px-5 py-3 text-right">{isAr ? "الإجمالي" : "Total"}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                            {((currentPatient as any).consumables || []).map((c: any) => (
                              <tr key={c.id} className="hover:bg-slate-50 transition">
                                <td className="px-5 py-3">
                                  <p className="text-slate-900">{isAr ? c.nameAr : c.nameEn}</p>
                                  <p className="text-[9px] text-slate-400 font-mono uppercase tracking-tighter">{c.recordedBy}</p>
                                </td>
                                <td className="px-5 py-3 text-center">
                                  <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-600">{c.qty} {c.unit}</span>
                                </td>
                                <td className="px-5 py-3 text-center text-slate-500 font-medium text-[10px]">{c.store}</td>
                                <td className="px-5 py-3 text-center text-slate-400 font-mono text-[10px]">{c.date?.split(',')[1] || c.date}</td>
                                <td className="px-5 py-3 text-right font-black text-slate-900">${(c.price * c.qty).toFixed(2)}</td>
                              </tr>
                            ))}
                            {(!(currentPatient as any).consumables || (currentPatient as any).consumables.length === 0) && (
                              <tr>
                                <td colSpan={5} className="px-5 py-10 text-center text-slate-400 font-bold italic">
                                  {isAr ? "لا يوجد مستهلكات مسجلة لهذه الزيارة بعد." : "No consumables recorded for this visit yet."}
                                </td>
                              </tr>
                            )}
                          </tbody>
                          {(currentPatient as any).consumables?.length > 0 && (
                            <tfoot className="bg-slate-50 font-black">
                              <tr>
                                <td colSpan={4} className="px-5 py-3 text-right text-slate-500 uppercase tracking-widest">{isAr ? "إجمالي المستهلكات" : "Total Consumables"}</td>
                                <td className="px-5 py-3 text-right text-emerald-600 font-mono">
                                  ${(currentPatient as any).consumables.reduce((acc: number, curr: any) => acc + (curr.price * curr.qty), 0).toFixed(2)}
                                </td>
                              </tr>
                            </tfoot>
                          )}
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "nutrition" && (
              <div className="w-full pb-12">
                <PatientNutritionTab isAr={isAr} patientId={currentPatient.id} patientName={isAr ? currentPatient.nameAr : currentPatient.nameEn} />
              </div>
            )}

            {/* Discharge Tab */}
            {activeTab === "discharge" && (
              <div className="space-y-6 w-full animate-fade-in pb-12">
                <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                  <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-600" />
                    {isAr ? "ملخص وتخطيط خروج المريض" : "Discharge Planning & Summary"}
                  </h3>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-indigo-700 transition flex items-center gap-2">
                    <Printer className="w-4 h-4" />
                    {isAr ? "طباعة ملخص الخروج" : "Print Summary"}
                  </button>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                  <div className="max-w-3xl mx-auto space-y-6">
                    <div>
                      <h4 className="font-black text-slate-800 text-sm mb-2">{isAr ? "تعليمات الخروج للمريض" : "Discharge Instructions"}</h4>
                      <textarea 
                        className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none h-24 bg-slate-50"
                        placeholder={isAr ? "اكتب تعليمات المريض هنا..." : "Write instructions for the patient to follow at home..."}
                        defaultValue="Take medications exactly as prescribed. Avoid heavy lifting (>10 lbs) for 2 weeks. Schedule follow up with clinic in 7 days."
                      ></textarea>
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-sm mb-2">{isAr ? "أدوية الخروج (Rx)" : "Discharge Medications (Rx)"}</h4>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <p className="text-sm font-bold text-slate-700">1. Augmentin 1g PO BID x 7 Days</p>
                        <p className="text-sm font-bold text-slate-700">2. Ibuprofen 400mg PO PRN for pain</p>
                      </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-slate-100">
                      <button className="bg-rose-600 text-white px-6 py-3 rounded-xl text-sm font-black shadow-md hover:bg-rose-700 transition">
                        {isAr ? "توقيع وتنفيذ الخروج النهائي" : "E-Sign & Execute Final Discharge"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Persistent Clinical Sidebar (Clinical Worklist) */}
          <div className="hidden lg:flex w-72 bg-slate-50 border-r rtl:border-r-0 rtl:border-l border-slate-200 flex-col overflow-hidden shrink-0">
            <div className="p-4 bg-white border-b border-slate-200">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                {isAr ? "قائمة المهام السريرية" : "Clinical Worklist"}
              </h3>
              <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase">
                {isAr ? "تنبيهات فورية ومهام عاجلة" : "Stat Tasks & Critical Alerts"}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
              {/* Critical Alerts Section */}
              <div className="space-y-2">
                <h4 className="text-[9px] font-black text-rose-600 uppercase tracking-tighter">{isAr ? "تنبيهات حرجة (STAT)" : "Stat Clinical Alerts"}</h4>
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 animate-pulse shrink-0"></div>
                    <div>
                      <p className="text-[10px] font-black text-rose-950 uppercase">{isAr ? "حساسية: بنسيلين" : "Allergy: Penicillin"}</p>
                      <p className="text-[9px] text-rose-700 font-bold">{isAr ? "خطر صدمة تحسسية عالي" : "Anaphylaxis risk: Severe"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 border-t border-rose-100 pt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0"></div>
                    <div>
                      <p className="text-[10px] font-black text-amber-950 uppercase">{isAr ? "خطر سقوط: عالي" : "Morse Fall Risk: High"}</p>
                      <p className="text-[9px] text-amber-700 font-bold">{isAr ? "احتياطات السرير مفعلة" : "Precautions: Active"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Orders Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{isAr ? "أوامر بانتظار التنفيذ" : "Pending Stat Orders"}</h4>
                  <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-1.5 rounded">2 New</span>
                </div>
                <div className="space-y-2">
                  <div className="bg-white border border-slate-200 rounded-xl p-2.5 hover:border-indigo-300 transition cursor-pointer shadow-3xs group">
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-black text-slate-800 uppercase leading-tight">CBC / Lytes</p>
                      <span className="text-[8px] font-black text-rose-600 uppercase tracking-widest animate-pulse">STAT</span>
                    </div>
                    <p className="text-[9px] text-slate-500 font-bold mt-1">Ordered 14m ago by Dr. Ali</p>
                    <div className="mt-2 flex gap-1.5">
                      <button className="flex-1 py-1 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 text-[8px] font-black rounded uppercase transition">
                        {isAr ? "تجميع العينة" : "Collect"}
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-2.5 hover:border-indigo-300 transition cursor-pointer shadow-3xs group">
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-black text-slate-800 uppercase leading-tight">CXR - Portable</p>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Routine</span>
                    </div>
                    <p className="text-[9px] text-slate-500 font-bold mt-1">Requested 45m ago</p>
                    <div className="mt-2 flex gap-1.5">
                      <button className="flex-1 py-1 bg-slate-50 hover:bg-slate-200 text-slate-600 text-[8px] font-black rounded uppercase transition">
                        {isAr ? "تتبع" : "Track"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medication Reminders Section */}
              <div className="space-y-2">
                <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{isAr ? "الأدوية القادمة" : "Next Medications"}</h4>
                <div className="bg-indigo-50/30 border border-indigo-100 rounded-xl p-2.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-indigo-950 uppercase leading-tight">Lisinopril</span>
                      <span className="text-[8px] font-bold text-slate-500">10mg PO • 20:00</span>
                    </div>
                    <div className="w-6 h-6 rounded-lg bg-white border border-indigo-200 flex items-center justify-center text-[8px] font-black text-indigo-600">
                      32m
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-indigo-100/50 pt-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase leading-tight">Ceftriaxone</span>
                      <span className="text-[8px] font-bold text-slate-400">1g IV • 08:00</span>
                    </div>
                    <span className="text-[8px] font-black text-slate-400 uppercase">DONE</span>
                  </div>
                </div>
              </div>

              {/* Nursing Handover Quick Notes */}
              <div className="space-y-2">
                <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{isAr ? "ملاحظات التسليم السريع" : "Handover Quick Notes"}</h4>
                <div className="bg-white border border-slate-200 rounded-xl p-2.5">
                  <textarea 
                    className="w-full bg-slate-50 border-none rounded-lg p-2 text-[9px] font-bold text-slate-700 focus:ring-0 resize-none h-16 placeholder:text-slate-400"
                    placeholder={isAr ? "أضف ملاحظة سريعة للمناوبة القادمة..." : "Add a quick note for the next shift..."}
                  ></textarea>
                  <button className="w-full mt-2 py-1 bg-slate-900 text-white text-[8px] font-black rounded uppercase hover:bg-slate-800 transition">
                    {isAr ? "حفظ الملاحظة" : "Save Shift Note"}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Footer Info */}
            <div className="p-3 bg-white border-t border-slate-200">
              <div className="flex items-center justify-between text-[8px] font-black text-slate-400 uppercase">
                <span>Last Updated: 14:32</span>
                <span className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  Live
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      
      {showPrintPreview && (
        <div className="fixed inset-0 bg-slate-900/90 z-modal flex flex-col md:flex-row backdrop-blur-sm" dir={isAr ? "rtl" : "ltr"}>
          {/* Print Style Injector */}
          <style>{`
            @media print {
              /* Hide everything on screen */
              body * {
                visibility: hidden !important;
              }
              /* Reveal only the clinical report page */
              #clinical-report-page, #clinical-report-page * {
                visibility: visible !important;
              }
              #clinical-report-page {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
                height: auto !important;
                padding: 0 !important;
                margin: 0 !important;
                border: none !important;
                box-shadow: none !important;
                background: white !important;
                color: black !important;
              }
              /* Ensure proper colors are printed */
              html, body {
                background-color: #ffffff !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .no-print {
                display: none !important;
              }
              @page {
                size: A4 portrait;
                margin: 15mm;
              }
            }
          `}</style>

          {/* Interactive Print Settings Sidebar */}
          <div className="w-full md:w-96 bg-slate-800 text-white border-b md:border-b-0 md:border-r border-slate-700 p-6 flex flex-col justify-between shrink-0 no-print">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                <h2 className="font-black text-lg flex items-center gap-2">
                  <Printer className="w-5 h-5 text-indigo-400" />
                  {isAr ? "مركز طباعة التقارير" : "Clinical Report Center"}
                </h2>
                <button 
                  onClick={() => setShowPrintPreview(false)}
                  className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Step 1: Select Report Type */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  {isAr ? "1. حدد نوع التقرير الطبي" : "1. Select Report Type"}
                </label>
                {[
                  { id: "comprehensive", icon: FileText, ar: "السجل الطبي الشامل", en: "Comprehensive Medical Chart" },
                  { id: "mar", icon: Pill, ar: "سجل إعطاء الأدوية (MAR)", en: "Medication Admin Record" },
                  { id: "labs", icon: FlaskConical, ar: "نتائج التحاليل المخبرية", en: "Laboratory Results Report" },
                  { id: "nursing", icon: ShieldAlert, ar: "ملاحظات التمريض والفرز", en: "Nursing Care & Triage" }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = (showPrintPreview as any).reportType === item.id || (!(showPrintPreview as any).reportType && item.id === "comprehensive");
                  return (
                    <button
                      key={item.id}
                      onClick={() => setShowPrintPreview({ ...(showPrintPreview as any), reportType: item.id } as any)}
                      className={`w-full text-left rtl:text-right p-3 rounded-xl border flex items-center gap-3 transition-all ${
                        isSelected 
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/15" 
                          : "bg-slate-700/50 border-slate-700 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${isSelected ? "bg-indigo-500" : "bg-slate-700"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold">{isAr ? item.ar : item.en}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{isAr ? item.en : item.ar}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Step 2: Advanced Options */}
              <div className="space-y-4 pt-4 border-t border-slate-700">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  {isAr ? "2. خيارات التخصيص والمظهر" : "2. Customization Options"}
                </label>
                
                {[
                  { id: "seal", labelAr: "الختم الرسمي للمستشفى", labelEn: "Hospital Seal & Stamp", descAr: "إظهار ختم المستشفى المعتمد", descEn: "Show authorized stamp" },
                  { id: "signatures", labelAr: "توقيع الطبيب والمدير الطبي", labelEn: "Official Signatures", descAr: "إدراج التوقيعات المعتمدة آلياً", descEn: "Include certified signatures" },
                  { id: "bilingual", labelAr: "ثنائي اللغة (Arabic/English)", labelEn: "Bilingual Output", descAr: "طباعة ترويسة ومصطلحات ثنائية", descEn: "Bilingual headings" }
                ].map((opt) => (
                  <label key={opt.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-700/30 border border-slate-700 cursor-pointer hover:bg-slate-700/50 transition">
                    <div>
                      <p className="text-xs font-bold">{isAr ? opt.labelAr : opt.labelEn}</p>
                      <p className="text-[10px] text-slate-400">{isAr ? opt.descAr : opt.descEn}</p>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={!!(showPrintPreview as any)[opt.id]}
                        onChange={(e) => setShowPrintPreview({ ...(showPrintPreview as any), [opt.id]: e.target.checked } as any)}
                      />
                      <div className="w-9 h-5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-700 space-y-3">
              <button 
                onClick={() => {
                  toast.info(isAr ? "جاري تحضير التقرير للطباعة..." : "Preparing report for printing...");
                  setTimeout(() => window.print(), 500);
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all p-4 rounded-xl font-black flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20"
              >
                <Printer className="w-6 h-6" />
                {isAr ? "بدء الطباعة الفورية (A4)" : "Start Instant Print (A4)"}
              </button>
              <button 
                onClick={() => setShowPrintPreview(false)}
                className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 py-3 rounded-xl font-bold text-xs transition"
              >
                {isAr ? "رجوع وإغلاق" : "Cancel & Close"}
              </button>
            </div>
          </div>

          {/* Live Print Paper Preview Panel */}
          <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-slate-900 flex justify-center">
            <div 
              id="clinical-report-page" 
              className="bg-white w-full max-w-[210mm] shadow-2xl p-[15mm] md:p-[20mm] rounded-sm text-slate-900 relative flex flex-col justify-between"
              style={{ minHeight: "297mm", fontFamily: "'Inter', sans-serif" }}
            >
              {/* Institutional Watermark Background (Only visible on web preview, or subtle on print) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none opacity-[0.02]">
                <div className="border-[15px] border-indigo-900 rounded-full p-20 rotate-12">
                  <Activity className="w-96 h-96 text-indigo-900" />
                </div>
              </div>

              <div>
                {/* 1. Official State Hospital Header */}
                <div className="border-b-[3px] border-slate-800 pb-5 mb-6 flex justify-between items-center">
                  <div className="text-left text-xs space-y-1 font-bold text-slate-700">
                    <p className="text-slate-950 font-black text-sm uppercase">CloudCare Hospital Group</p>
                    <p>Clinical Information Services</p>
                    <p>License No: H-90238-A</p>
                    <p className="text-[10px] text-slate-500">Ministry of Health Certified</p>
                  </div>
                  
                  {/* Central Emblem */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-indigo-50 border border-indigo-200 rounded-full flex items-center justify-center mb-1 shadow-sm">
                      <Activity className="w-6 h-6 text-indigo-600" />
                    </div>
                    <span className="text-[10px] font-black text-slate-800 tracking-wider">CLOUDCARE</span>
                    <span className="text-[8px] font-bold text-slate-500">العناية السحابية</span>
                  </div>

                  <div className="text-right text-xs space-y-1 font-bold text-slate-700">
                    <p className="text-slate-950 font-black text-sm">مستشفى العناية السحابية التخصصي</p>
                    <p>إدارة السجلات والتقارير الطبية</p>
                    <p>رقم الترخيص: ٩٠٢٣٨-أ</p>
                    <p className="text-[10px] text-slate-500">معتمد من وزارة الصحة</p>
                  </div>
                </div>

                {/* Sub-Header metadata line (Document description, Date & QR code) */}
                <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                  <div>
                    <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      {!(showPrintPreview as any).reportType || (showPrintPreview as any).reportType === "comprehensive" ? (
                        <>
                          <span>{isAr ? "السجل الطبي السريري الشامل" : "Comprehensive Clinical Medical Record"}</span>
                        </>
                      ) : (showPrintPreview as any).reportType === "mar" ? (
                        <>
                          <span>{isAr ? "سجل إعطاء الأدوية المعتمد (MAR)" : "Certified Medication Administration Record"}</span>
                        </>
                      ) : (showPrintPreview as any).reportType === "labs" ? (
                        <>
                          <span>{isAr ? "تقرير الفحوصات المخبرية الطبية" : "Clinical Laboratory Investigation Report"}</span>
                        </>
                      ) : (
                        <>
                          <span>{isAr ? "مخطط التقييم السريري والفرز التمريضي" : "Clinical Nursing Triage & Assessment Chart"}</span>
                        </>
                      )}
                    </h1>
                    <p className="text-xs text-slate-500 font-bold mt-1">
                      <span>Doc Ref: CC-REP-{patientId}-{new Date().getFullYear()}</span>
                      <span className="mx-2">•</span>
                      <span>Date: {new Date().toLocaleString(isAr ? 'ar-EG' : 'en-US')}</span>
                    </p>
                  </div>
                  
                  {/* Security Verification Barcode & QR Code */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <div className="flex flex-col items-center">
                      <div className="bg-white p-1 border border-slate-200 rounded shadow-sm">
                        <QrCode className="w-10 h-10 text-slate-800" />
                      </div>
                      <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase">VERIFY CODE</span>
                    </div>
                  </div>
                </div>

                {/* 2. Patient Master Demographic Card */}
                <div className="border border-slate-300 rounded-xl overflow-hidden mb-6 shadow-sm">
                  <div className="bg-slate-100 px-4 py-2 text-xs font-black text-slate-700 border-b border-slate-300 flex justify-between">
                    <span>{isAr ? "البيانات الديموغرافية والسريرية للمريض" : "PATIENT DEMOGRAPHICS & CLINICAL METADATA"}</span>
                    <span className="font-mono">MRN: {patientId}</span>
                  </div>
                  <div className="grid grid-cols-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-200 bg-white">
                    <div className="p-3 text-xs">
                      <p className="text-slate-400 font-bold uppercase text-[9px] mb-0.5">{isAr ? "اسم المريض" : "Patient Name"}</p>
                      <p className="font-extrabold text-slate-800 text-sm">{patientName || (isAr ? "مريض عام" : "Generic Patient")}</p>
                    </div>
                    <div className="p-3 text-xs">
                      <p className="text-slate-400 font-bold uppercase text-[9px] mb-0.5">{isAr ? "رقم المريض الدولي" : "National Medical ID"}</p>
                      <p className="font-extrabold text-slate-800">MRN-{patientId.replace("MRN-", "")}</p>
                    </div>
                    <div className="p-3 text-xs">
                      <p className="text-slate-400 font-bold uppercase text-[9px] mb-0.5">{isAr ? "العمر والنوع" : "Age / Gender"}</p>
                      <p className="font-extrabold text-slate-800">45 Years • {isAr ? "ذكر" : "Male"}</p>
                    </div>
                    <div className="p-3 text-xs">
                      <p className="text-slate-400 font-bold uppercase text-[9px] mb-0.5">{isAr ? "فصيلة الدم والتحذيرات" : "Blood Group & Alerts"}</p>
                      <p className="font-extrabold text-rose-700 flex items-center gap-1">O+ <span className="bg-rose-50 text-rose-600 text-[10px] px-1 rounded border border-rose-200">Fall Risk</span></p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-x divide-slate-200 border-t border-slate-200 bg-slate-50/50">
                    <div className="p-3 text-xs">
                      <p className="text-slate-400 font-bold uppercase text-[9px] mb-0.5">{isAr ? "الجناح / الغرفة" : "Ward / Room"}</p>
                      <p className="font-bold text-slate-800">Intensive Care (ICU) • Room 4</p>
                    </div>
                    <div className="p-3 text-xs">
                      <p className="text-slate-400 font-bold uppercase text-[9px] mb-0.5">{isAr ? "الطبيب المشرف" : "Attending Consultant"}</p>
                      <p className="font-bold text-slate-800">Dr. Ahmed Ali, MD</p>
                    </div>
                    <div className="p-3 text-xs">
                      <p className="text-slate-400 font-bold uppercase text-[9px] mb-0.5">{isAr ? "تاريخ الدخول" : "Admission Date"}</p>
                      <p className="font-bold text-slate-800">2026-06-25 14:30</p>
                    </div>
                    <div className="p-3 text-xs">
                      <p className="text-slate-400 font-bold uppercase text-[9px] mb-0.5">{isAr ? "الحالة عند التقديم" : "Acuity Status"}</p>
                      <p className="font-bold text-amber-700 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500 inline-block animate-pulse"></span>
                        {isAr ? "حالة حرجة" : "High Acuity (ICU)"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. DYNAMIC REPORT CONTENTS BASED ON SELECT TYPE */}

                {/* TYPE A: COMPREHENSIVE MEDICAL REPORT */}
                {(!(showPrintPreview as any).reportType || (showPrintPreview as any).reportType === "comprehensive") && (
                  <div className="space-y-6">
                    {/* Clinical Summary & Diagnoses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border border-slate-200 rounded-lg p-4">
                        <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider mb-3 border-b border-slate-200 pb-2 flex items-center gap-1.5">
                          <Activity className="w-4 h-4 text-rose-500" />
                          {isAr ? "التشخيصات والمشكلات النشطة" : "Active Clinical Diagnoses"}
                        </h3>
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-slate-400 font-bold text-left rtl:text-right border-b border-slate-100">
                              <th className="pb-1">{isAr ? "التشخيص" : "Diagnosis"}</th>
                              <th className="pb-1">{isAr ? "الرمز" : "ICD-10"}</th>
                              <th className="pb-1 text-right">{isAr ? "الأولوية" : "Priority"}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            <tr>
                              <td className="py-2 font-bold text-slate-800">Acute Myocardial Infarction</td>
                              <td className="py-2 text-slate-500 font-mono">I21.9</td>
                              <td className="py-2 text-right"><span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded text-[10px] font-bold">Primary</span></td>
                            </tr>
                            <tr>
                              <td className="py-2 font-bold text-slate-800">Sepsis / Septic Shock</td>
                              <td className="py-2 text-slate-500 font-mono">A41.9</td>
                              <td className="py-2 text-right"><span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded text-[10px] font-bold">Secondary</span></td>
                            </tr>
                            <tr>
                              <td className="py-2 font-bold text-slate-800">Type 2 Diabetes Mellitus</td>
                              <td className="py-2 text-slate-500 font-mono">E11.9</td>
                              <td className="py-2 text-right"><span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-bold">Chronic</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="border border-slate-200 rounded-lg p-4">
                        <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider mb-3 border-b border-slate-200 pb-2 flex items-center gap-1.5">
                          <Pill className="w-4 h-4 text-emerald-500" />
                          {isAr ? "خطة العلاج والأدوية النشطة" : "Active Outpatient & Inpatient Medications"}
                        </h3>
                        <table className="w-full text-xs text-left rtl:text-right">
                          <thead>
                            <tr className="text-slate-400 font-bold border-b border-slate-100">
                              <th className="pb-1">{isAr ? "الدواء" : "Medication"}</th>
                              <th className="pb-1">{isAr ? "الجرعة والمسار" : "Dosage / Route"}</th>
                              <th className="pb-1 text-right">{isAr ? "التكرار" : "Frequency"}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            <tr>
                              <td className="py-2 font-bold text-slate-800">Aspirin EC</td>
                              <td className="py-2 text-slate-600">81 mg PO</td>
                              <td className="py-2 text-right text-slate-500">Once Daily</td>
                            </tr>
                            <tr>
                              <td className="py-2 font-bold text-slate-800">Lisinopril</td>
                              <td className="py-2 text-slate-600">10 mg PO</td>
                              <td className="py-2 text-right text-slate-500">Once Daily</td>
                            </tr>
                            <tr>
                              <td className="py-2 font-bold text-slate-800">Ceftriaxone IV</td>
                              <td className="py-2 text-slate-600">2 g IV Infusion</td>
                              <td className="py-2 text-right text-slate-500">Every 12 hrs</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Vitals summary block */}
                    <div className="border border-slate-200 rounded-lg p-4">
                      <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider mb-3 border-b border-slate-200 pb-2">
                        {isAr ? "آخر قراءات العلامات الحيوية الموثقة" : "Latest Documented Vital Signs (Clinical Parameters)"}
                      </h3>
                      <div className="grid grid-cols-5 gap-4 text-center">
                        <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Blood Pressure</p>
                          <p className="text-base font-black text-rose-700 mt-1">90/60</p>
                          <span className="text-[8px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-1 rounded">Hypotension</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Heart Rate</p>
                          <p className="text-base font-black text-rose-700 mt-1">110 bpm</p>
                          <span className="text-[8px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-1 rounded">Tachycardia</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Temperature</p>
                          <p className="text-base font-black text-amber-700 mt-1">38.5 °C</p>
                          <span className="text-[8px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-1 rounded">Fever</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Oxygen Saturation</p>
                          <p className="text-base font-black text-slate-800 mt-1">94% SpO2</p>
                          <span className="text-[8px] font-bold text-slate-500">Room Air</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Respiratory Rate</p>
                          <p className="text-base font-black text-slate-800 mt-1">20 bpm</p>
                          <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1 rounded">Normal</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Notes summary */}
                    <div className="border border-slate-200 rounded-lg p-4">
                      <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider mb-3 border-b border-slate-200 pb-2">
                        {isAr ? "ملاحظات وتوصيات التطور السريري" : "Latest Clinical Evolution Notes"}
                      </h3>
                      <div className="space-y-4">
                        <div className="text-xs">
                          <div className="flex justify-between font-bold text-slate-500 mb-1">
                            <span>Dr. Ahmed Ali (Cardiology) • Progress Note</span>
                            <span>2026-06-29 09:15</span>
                          </div>
                          <p className="text-slate-700 leading-relaxed font-medium">
                            "Patient is recovering from septic shock. MAP is being maintained &gt; 65 mmHg with low-dose vasopressors. Urine output has improved to 0.5 mL/kg/hr. Cardiac enzymes are trending downwards. Will continue Ceftriaxone and monitor renal functions closely."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TYPE B: MEDICATION ADMINISTRATION RECORD (MAR) */}
                {(showPrintPreview as any).reportType === "mar" && (
                  <div className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{isAr ? "جميع الأدوية المدرجة تم التحقق منها ومطابقتها وفق الكود الدوائي الموحد." : "All medications listed have been verified and cross-checked using electronic barcode MAR system."}</span>
                    </div>

                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-xs text-left rtl:text-right">
                        <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                          <tr>
                            <th className="p-3">{isAr ? "الدواء الموصوف" : "Prescribed Medication"}</th>
                            <th className="p-3">{isAr ? "الجرعة والمسار" : "Dosage / Route"}</th>
                            <th className="p-3">{isAr ? "التوقيت المجدول" : "Schedule"}</th>
                            <th className="p-3">{isAr ? "آخر إعطاء للمريض" : "Last Given"}</th>
                            <th className="p-3">{isAr ? "الممرض المسؤول" : "Administered By"}</th>
                            <th className="p-3 text-right">{isAr ? "الحالة" : "Status"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {[
                            { name: "Aspirin EC", dosage: "81 mg PO", freq: "Daily 09:00", last: "Today, 09:05", nurse: "Fatima Al-Harbi, RN", status: "Given" },
                            { name: "Lisinopril 10mg", dosage: "10 mg PO", freq: "Daily 09:00", last: "Today, 09:12", nurse: "Fatima Al-Harbi, RN", status: "Given" },
                            { name: "Insulin Glargine", dosage: "10 units SC", freq: "Nightly 22:00", last: "Yesterday, 22:03", nurse: "Sarah Smith, RN", status: "Given" },
                            { name: "Ceftriaxone IV", dosage: "2 g IV", freq: "Q12h 08:00 / 20:00", last: "Today, 08:00", nurse: "Fatima Al-Harbi, RN", status: "Given" },
                            { name: "Heparin Sodium Injection", dosage: "5000 units SC", freq: "Q12h 06:00 / 18:00", last: "Today, 06:15", nurse: "Sarah Smith, RN", status: "Given" }
                          ].map((med, i) => (
                            <tr key={i} className="hover:bg-slate-50/50">
                              <td className="p-3 font-bold text-slate-800">{med.name}</td>
                              <td className="p-3 text-slate-600">{med.dosage}</td>
                              <td className="p-3 text-slate-500 font-mono">{med.freq}</td>
                              <td className="p-3 text-slate-600">{med.last}</td>
                              <td className="p-3 text-slate-700 font-bold">{med.nurse}</td>
                              <td className="p-3 text-right"><span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold">{med.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TYPE C: LABORATORY RESULTS REPORT */}
                {(showPrintPreview as any).reportType === "labs" && (
                  <div className="space-y-6">
                    {/* Chemistry / Basic Metabolic Panel */}
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-xs font-black text-slate-700">
                        {isAr ? "وظائف الكلى ولوحة الأملاح الأساسية (BMP)" : "BASIC METABOLIC PANEL & RENAL FUNCTION"}
                      </div>
                      <table className="w-full text-xs text-left rtl:text-right border-collapse">
                        <thead className="bg-slate-100/50 border-b border-slate-200 font-bold text-slate-500">
                          <tr>
                            <th className="p-2.5">{isAr ? "الفحص" : "Test Analyte"}</th>
                            <th className="p-2.5">{isAr ? "النتيجة" : "Result"}</th>
                            <th className="p-2.5">{isAr ? "الرمز" : "Flag"}</th>
                            <th className="p-2.5">{isAr ? "الوحدة" : "Reference Range"}</th>
                            <th className="p-2.5 text-right">{isAr ? "تاريخ الفحص" : "Timestamp"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                          {[
                            { name: "Sodium (Na+)", val: "138", flag: "Normal", range: "135 - 145 mEq/L", time: "Today 07:15" },
                            { name: "Potassium (K+)", val: "3.2", flag: "Low", range: "3.5 - 5.0 mEq/L", time: "Today 07:15" },
                            { name: "Creatinine (Serum)", val: "1.45", flag: "High", range: "0.60 - 1.20 mg/dL", time: "Today 07:15" },
                            { name: "Blood Urea Nitrogen (BUN)", val: "28", flag: "High", range: "7 - 20 mg/dL", time: "Today 07:15" },
                            { name: "Glucose (Random)", val: "164", flag: "High", range: "70 - 140 mg/dL", time: "Today 07:15" }
                          ].map((lab, i) => (
                            <tr key={i} className="hover:bg-slate-50/50">
                              <td className="p-2.5 font-bold">{lab.name}</td>
                              <td className="p-2.5">{lab.val}</td>
                              <td className="p-2.5">
                                {lab.flag === "Normal" ? (
                                  <span className="text-slate-500 font-bold">Normal</span>
                                ) : (
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${lab.flag === "High" ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>{lab.flag}</span>
                                )}
                              </td>
                              <td className="p-2.5 text-slate-500 font-mono text-[10px]">{lab.range}</td>
                              <td className="p-2.5 text-right text-slate-400 font-mono text-[10px]">{lab.time}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* CBC Panel */}
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-xs font-black text-slate-700">
                        {isAr ? "صورة الدم الكاملة (CBC)" : "COMPLETE BLOOD COUNT PANEL (CBC)"}
                      </div>
                      <table className="w-full text-xs text-left rtl:text-right border-collapse">
                        <thead className="bg-slate-100/50 border-b border-slate-200 font-bold text-slate-500">
                          <tr>
                            <th className="p-2.5">{isAr ? "التحليل" : "Parameter"}</th>
                            <th className="p-2.5">{isAr ? "النتيجة" : "Result"}</th>
                            <th className="p-2.5">{isAr ? "الحالة" : "Flag"}</th>
                            <th className="p-2.5">{isAr ? "النطاق الطبيعي" : "Reference Range"}</th>
                            <th className="p-2.5 text-right">{isAr ? "التحليل" : "Timestamp"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                          {[
                            { name: "White Blood Cells (WBC)", val: "14.2", flag: "High", range: "4.5 - 11.0 x10^3/uL", time: "Today 07:15" },
                            { name: "Red Blood Cells (RBC)", val: "4.10", flag: "Normal", range: "4.30 - 5.90 x10^6/uL", time: "Today 07:15" },
                            { name: "Hemoglobin (Hgb)", val: "12.4", flag: "Low", range: "13.5 - 17.5 g/dL", time: "Today 07:15" },
                            { name: "Platelet Count (PLT)", val: "185", flag: "Normal", range: "150 - 450 x10^3/uL", time: "Today 07:15" }
                          ].map((lab, i) => (
                            <tr key={i} className="hover:bg-slate-50/50">
                              <td className="p-2.5 font-bold">{lab.name}</td>
                              <td className="p-2.5">{lab.val}</td>
                              <td className="p-2.5">
                                {lab.flag === "Normal" ? (
                                  <span className="text-slate-500 font-bold">Normal</span>
                                ) : (
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${lab.flag === "High" ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>{lab.flag}</span>
                                )}
                              </td>
                              <td className="p-2.5 text-slate-500 font-mono text-[10px]">{lab.range}</td>
                              <td className="p-2.5 text-right text-slate-400 font-mono text-[10px]">{lab.time}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TYPE D: NURSING ASSESSMENT & TRIAGE */}
                {(showPrintPreview as any).reportType === "nursing" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/30">
                        <h4 className="font-extrabold text-xs text-slate-700 uppercase mb-2 border-b border-slate-200 pb-1">{isAr ? "مقياس مورس لمخاطر السقوط" : "Morse Fall Risk Scale"}</h4>
                        <div className="text-xs space-y-1 font-bold">
                          <p><span className="text-slate-400 font-medium">History of Falling:</span> Yes (+25)</p>
                          <p><span className="text-slate-400 font-medium">Secondary Diagnosis:</span> Yes (+15)</p>
                          <p><span className="text-slate-400 font-medium">Intravenous Therapy:</span> Yes (+20)</p>
                          <p><span className="text-slate-400 font-medium">Gait / Transferring:</span> Weak (+10)</p>
                          <p className="border-t border-slate-200 pt-1.5 mt-1.5 text-rose-700 flex justify-between">
                            <span>TOTAL SCORE:</span>
                            <span className="font-black">70 (High Risk)</span>
                          </p>
                        </div>
                      </div>

                      <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/30">
                        <h4 className="font-extrabold text-xs text-slate-700 uppercase mb-2 border-b border-slate-200 pb-1">{isAr ? "التحكم في السوائل وحجم التوازن (I&O)" : "Intake & Output Balances"}</h4>
                        <div className="text-xs space-y-1 font-bold">
                          <p className="text-indigo-700"><span className="text-slate-400 font-medium">Total Fluid Intake:</span> 1,800 mL (Oral + IV Fluids)</p>
                          <p className="text-amber-700"><span className="text-slate-400 font-medium">Total Fluid Output:</span> 1,650 mL (Urine + Insensible)</p>
                          <p className="border-t border-slate-200 pt-1.5 mt-1.5 text-slate-800 flex justify-between">
                            <span>NET BALANCE (24H):</span>
                            <span className="font-black text-emerald-600">+150 mL (Balanced)</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-lg p-4">
                      <h4 className="font-extrabold text-xs text-slate-700 uppercase mb-3 border-b border-slate-200 pb-2">{isAr ? "ملاحظات التمريض ومسار الرعاية اليومي" : "Nursing Intervention Logs & Handovers"}</h4>
                      <div className="space-y-4 text-xs font-semibold">
                        <div className="border-l-2 border-slate-300 pl-3">
                          <p className="text-slate-400 text-[10px] mb-0.5">Today, 07:00 - morning handover</p>
                          <p className="text-slate-700 leading-relaxed">
                            "Acuity remains high. Septic workup completed. IV site patent, monitored Q2h. Patient was educated on high fall risk. Bed rails up x3, call light placed in hand. Patient verbalized understanding."
                          </p>
                          <p className="text-indigo-600 font-extrabold mt-1">Fatima Al-Harbi, RN (E-Signed)</p>
                        </div>
                        
                        <div className="border-l-2 border-slate-300 pl-3">
                          <p className="text-slate-400 text-[10px] mb-0.5">Yesterday, 19:15 - night handover</p>
                          <p className="text-slate-700 leading-relaxed">
                            "Maintained on sterile central line dressing. Pain remains controlled around 2-3/10 after Acetaminophen administration. Vitals stabilized but BP still trending low (90s systolic). Vasopressor infusions running."
                          </p>
                          <p className="text-indigo-600 font-extrabold mt-1">Sarah Smith, RN (E-Signed)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Official Authorizations, Signature Stamp & Legal Disclaimers */}
              <div className="mt-12 pt-8 border-t border-slate-300 space-y-8">
                {/* Formal Clinical Disclaimer Text */}
                <div className="text-[9px] text-slate-400 text-center leading-relaxed font-bold">
                  <p className="uppercase">Confidentiality Notice: This document contains highly sensitive patient health information protected under Health Information Privacy regulations. Unauthorized disclosure is subject to legal action.</p>
                  <p className="mt-1">تم إصدار هذا التقرير إلكترونياً من نظام السجلات الطبية الموحد لمستشفى العناية السحابية وهو معتمد رسمياً دون الحاجة لكتابة خطية. أي كشط أو تعديل عليه يلغي الاعتماد.</p>
                </div>

                {/* Stamp & Signatures Blocks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 relative">
                  {/* Digital Approval Stamp Overlay (Generated securely) */}
                  <div className="absolute left-[37%] top-0 pointer-events-none select-none opacity-[0.4] flex flex-col items-center">
                    <div className="w-24 h-24 border-4 border-emerald-600 rounded-full flex flex-col items-center justify-center font-black text-[10px] text-emerald-600 rotate-12 scale-90">
                      <span>CLOUDCARE</span>
                      <span className="text-[7px]">APPROVED SEAL</span>
                      <span>٢٠٢٦ معتمد</span>
                    </div>
                  </div>

                  {/* Left block */}
                  <div className="text-center text-xs space-y-4">
                    <p className="font-extrabold text-slate-400 uppercase text-[9px]">{isAr ? "الممرض المسؤول" : "Administering Nurse"}</p>
                    <div className="font-cursive text-indigo-700 italic font-bold">Fatima Al-Harbi, RN</div>
                    <div className="border-t border-slate-300 pt-1.5 text-[10px] font-bold text-slate-600">
                      <span>Fatima Al-Harbi, RN</span>
                      <p className="text-[8px] text-slate-400 font-mono">ID: 8931-RN</p>
                    </div>
                  </div>

                  {/* Center block */}
                  <div className="text-center text-xs space-y-4">
                    <p className="font-extrabold text-slate-400 uppercase text-[9px]">{isAr ? "الختم الرسمي للمؤسسة" : "Hospital Stamp Seal"}</p>
                    <div className="h-8"></div>
                    <div className="border-t border-slate-300 pt-1.5 text-[10px] font-bold text-slate-600">
                      <span>CloudCare Registry</span>
                      <p className="text-[8px] text-slate-400 font-mono">Registry: Verified 2026</p>
                    </div>
                  </div>

                  {/* Right block */}
                  <div className="text-center text-xs space-y-4">
                    <p className="font-extrabold text-slate-400 uppercase text-[9px]">{isAr ? "الاستشاري المسؤول" : "Attending Consultant"}</p>
                    <div className="font-cursive text-indigo-700 italic font-bold">Dr. Ahmed Ali, MD</div>
                    <div className="border-t border-slate-300 pt-1.5 text-[10px] font-bold text-slate-600">
                      <span>Dr. Ahmed Ali, MD</span>
                      <p className="text-[8px] text-slate-400 font-mono">MOH Reg: 10298-MD</p>
                    </div>
                  </div>
                </div>

                {/* Footer bottom bar */}
                <div className="text-center text-[9px] text-slate-400 pt-4 border-t border-slate-100 font-mono flex justify-between font-bold">
                  <span>SYSTEM SOURCE: CLOUDCARE HOSPITAL INFORMATION SYSTEM (HIS)</span>
                  <span>PAGE 1 OF 1</span>
                  <span>EN/AR OFFICIALLY CERTIFIED</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
        </>
  );

  if (isEmbedded) {
    return <div className="h-full w-full flex flex-col bg-slate-50 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>{content}</div>;
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-modal flex items-center justify-center p-2 sm:p-4" dir={isAr ? "rtl" : "ltr"}>
      {content}
      {/* Specialized Workflow Overlays */}
      <AnimatePresence>
        {activeWorkflow && (
          <PatientManagementWorkflows
            workflow={activeWorkflow}
            patientId={patientId}
            isAr={isAr}
            onClose={() => setActiveWorkflow(null)}
            onSuccess={() => {
              setActiveWorkflow(null);
              toast.success(isAr ? "تم إكمال الإجراء بنجاح" : "Action completed successfully");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}


