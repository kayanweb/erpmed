import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Pill, Search, Filter, CheckCircle2, Clock, AlertCircle, PackageCheck,
  ChevronRight, ClipboardList, User, History, Activity, Printer,
  ShieldCheck, ArrowUpRight, LayoutDashboard, Database, ListTodo, AlertTriangle, Syringe, Zap, Plus,
  ShieldAlert, Sparkles, Barcode, RefreshCw, FileText, Check, X, Building2, Flame, HeartPulse,
  Award, Eye, Lock, Layers, Send, ArrowRight, CornerUpRight, RotateCcw, AlertOctagon, HelpCircle
} from "lucide-react";
import { useHIS, Prescription, InventoryItem } from "../context/HISContext";
import { GlobalEntityLink } from "./GlobalEntityLink";
import { toast } from "sonner";

interface Props {
  language?: "ar" | "en";
}

// Extended Order Lifecycle Statuses for Enterprise Pharmacy
export type PharmacyOrderStatus = 
  | "New Order"
  | "Pending Clinical Review"
  | "Pending Insurance"
  | "Approved for Dispense"
  | "Dispensing"
  | "Ready For Pickup"
  | "Dispensed (MAR Active)"
  | "On Hold"
  | "Rejected"
  | "Returned";

export interface EnhancedPharmacyOrder {
  id: string;
  patientId: string;
  patientName: string;
  mrn: string;
  age: number;
  gender: string;
  weightKg?: number;
  room: string;
  ward: string;
  department: "Emergency" | "ICU" | "OR" | "Inpatient" | "Pediatric" | "Oncology" | "Outpatient";
  orderingDoctor: string;
  diagnosis: string;
  medicationName: string;
  medicationCode: string;
  dosage: string;
  frequency: string;
  route: "Oral" | "IV Push" | "IV Infusion" | "SC" | "IM" | "Topical" | "Inhalation";
  duration: string;
  qty: number;
  priority: "STAT" | "High" | "Routine";
  status: PharmacyOrderStatus;
  isControlledNarcotic?: boolean;
  isHighAlert?: boolean;
  isPediatric?: boolean;
  isIVCompounding?: boolean;
  orderTime: string;
  allergies?: string[];
  renalFunction?: { egfr: number; crcl: number; isImpaired: boolean };
  liverFunction?: { ast: number; alt: number };
  safetyAlerts?: { severity: "High" | "Medium" | "Low"; title: string; desc: string }[];
  selectedBatch?: { lotNo: string; expiry: string; stockAvailable: number };
  marStatus?: "Due" | "Overdue" | "Completed" | "Missed" | "Held" | "Refused";
}

export default function PharmacyDashboard({ language = "ar" }: Props) {
  const isAr = language === "ar";
  const { patients = [], prescriptions = [], inventory = [], currentUser, addAuditLog, dispensePrescription } = useHIS();

  // Active Main Navigation Workspace View Mode
  const [viewMode, setViewMode] = useState<"queues" | "clinical_review" | "dispensing" | "inventory" | "narcotics" | "iv_room" | "mar_sync">("queues");

  // Queue Filters State
  const [activeQueueTab, setActiveQueueTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>("ALL");

  // Selected Order for Full Pharmacy Workspace Pane (Not a small popup!)
  const [selectedOrder, setSelectedOrder] = useState<EnhancedPharmacyOrder | null>(null);

  // Electronic Signature / PIN Auth Modal State
  const [isSigningDispense, setIsSigningDispense] = useState(false);
  const [pharmacistPin, setPharmacistPin] = useState("");

  // Rejection / Hold Reason Modal State
  const [rejectionTarget, setRejectionTarget] = useState<EnhancedPharmacyOrder | null>(null);
  const [rejectionReason, setRejectionReason] = useState("Renal Dose Adjustment Required");

  // Interactive Live Enterprise Pharmacy Orders Dataset
  const [pharmacyOrders, setPharmacyOrders] = useState<EnhancedPharmacyOrder[]>([
    {
      id: "RX-2026-901",
      patientId: patients[0]?.id || "p1",
      patientName: patients[0]?.nameAr || "أحمد محمد علي",
      mrn: "MRN-2026-0041",
      age: 64,
      gender: "Male",
      weightKg: 78,
      room: "ER Resus Bed 01",
      ward: "Emergency Dept",
      department: "Emergency",
      orderingDoctor: "Dr. Khalid Al-Mansoor (ER)",
      diagnosis: "Acute Coronary Syndrome & Atrial Fibrillation",
      medicationName: "Heparin Sodium 5,000 Units/mL Injection",
      medicationCode: "HEP-5K",
      dosage: "5000 Units",
      frequency: "STAT Bolus then IV Infusion",
      route: "IV Push",
      duration: "Immediate",
      qty: 2,
      priority: "STAT",
      status: "New Order",
      isHighAlert: true,
      orderTime: "03 mins ago",
      allergies: ["Penicillin"],
      renalFunction: { egfr: 52, crcl: 48, isImpaired: true },
      safetyAlerts: [
        { severity: "High", title: "HIGH ALERT MEDICATION", desc: "Requires independent double-check before IV administration." },
        { severity: "Medium", title: "Concurrent Anticoagulant Warning", desc: "Patient has active order for Aspirin 81mg." }
      ],
      selectedBatch: { lotNo: "LOT-HEP-992", expiry: "2027-11-30", stockAvailable: 140 },
      marStatus: "Due"
    },
    {
      id: "RX-2026-902",
      patientId: patients[1]?.id || "p2",
      patientName: patients[1]?.nameAr || "سارة محمود حسن",
      mrn: "MRN-2026-0082",
      age: 48,
      gender: "Female",
      weightKg: 62,
      room: "ICU Bed 04",
      ward: "Intensive Care Unit",
      department: "ICU",
      orderingDoctor: "Dr. Tariq (ICU Consultant)",
      diagnosis: "Septic Shock - Post Intra-abdominal Surgery",
      medicationName: "Meropenem 1g IV Vial",
      medicationCode: "MERO-1G",
      dosage: "1000 mg",
      frequency: "Every 8 hours IV Infusion over 3h",
      route: "IV Infusion",
      duration: "7 Days",
      qty: 21,
      priority: "STAT",
      status: "Pending Clinical Review",
      isIVCompounding: true,
      orderTime: "07 mins ago",
      renalFunction: { egfr: 34, crcl: 30, isImpaired: true },
      safetyAlerts: [
        { severity: "High", title: "Renal Dose Adjustment Required", desc: "eGFR is 34 mL/min. Recommend reducing dose to 500mg q12h." }
      ],
      selectedBatch: { lotNo: "LOT-MER-114", expiry: "2026-12-15", stockAvailable: 85 }
    },
    {
      id: "RX-2026-903",
      patientId: patients[2]?.id || "p3",
      patientName: patients[2]?.nameAr || "خالد عبد الله الزهراني",
      mrn: "MRN-2026-0105",
      age: 55,
      gender: "Male",
      weightKg: 85,
      room: "Ward 4 Bed 12",
      ward: "Post-Op Surgical Ward",
      department: "Inpatient",
      orderingDoctor: "Dr. Youssef (Orthopedics)",
      diagnosis: "Post Total Knee Replacement Pain Management",
      medicationName: "Morphine Sulfate 10mg/mL Ampoule",
      medicationCode: "NAR-MOR-10",
      dosage: "5 mg",
      frequency: "Every 4 hours PRN Severe Pain",
      route: "IV Push",
      duration: "3 Days",
      qty: 6,
      priority: "High",
      status: "Pending Clinical Review",
      isControlledNarcotic: true,
      isHighAlert: true,
      orderTime: "12 mins ago",
      safetyAlerts: [
        { severity: "High", title: "CONTROLLED NARCOTIC REGISTER", desc: "Requires two pharmacists double signature and Narcotic Vault log entry." }
      ],
      selectedBatch: { lotNo: "LOT-NAR-004", expiry: "2028-05-20", stockAvailable: 18 }
    },
    {
      id: "RX-2026-904",
      patientId: "p4",
      patientName: "منى إبراهيم السيد (طفل)",
      mrn: "MRN-2026-0199",
      age: 4,
      gender: "Female",
      weightKg: 16,
      room: "Peds Ward Bed 03",
      ward: "Pediatrics Ward",
      department: "Pediatric",
      orderingDoctor: "Dr. Fatima (Pediatrics)",
      diagnosis: "Acute Bronchopneumonia",
      medicationName: "Amoxicillin / Clavulanate (Augmentin) 457mg/5mL Syrup",
      medicationCode: "AUG-SYR-457",
      dosage: "5 mL (40mg/kg/day)",
      frequency: "Every 12 hours oral",
      route: "Oral",
      duration: "5 Days",
      qty: 2,
      priority: "Routine",
      status: "Approved for Dispense",
      isPediatric: true,
      orderTime: "22 mins ago",
      allergies: ["Sulfa drugs"],
      selectedBatch: { lotNo: "LOT-AUG-331", expiry: "2027-02-28", stockAvailable: 60 }
    },
    {
      id: "RX-2026-905",
      patientId: "p5",
      patientName: "عمر فاروق الشمري",
      mrn: "MRN-2026-0220",
      age: 59,
      gender: "Male",
      weightKg: 91,
      room: "Oncology Day Care 02",
      ward: "Oncology Infusion Suite",
      department: "Oncology",
      orderingDoctor: "Dr. Laila (Medical Oncology)",
      diagnosis: "Colorectal Carcinoma - FOLFOX Protocol",
      medicationName: "Oxaliplatin 100mg IV Infusion in D5W 500mL",
      medicationCode: "ONC-OXA-100",
      dosage: "85 mg/m2",
      frequency: "Single Dose IV Infusion over 2h",
      route: "IV Infusion",
      duration: "Cycle 4 Day 1",
      qty: 1,
      priority: "High",
      status: "Dispensing",
      isHighAlert: true,
      isIVCompounding: true,
      orderTime: "30 mins ago",
      safetyAlerts: [
        { severity: "High", title: "CHEMOTHERAPY COMPOUNDING", desc: "Must be reconstituted inside Laminar Air Flow Biological Safety Cabinet (Clean Room)." }
      ],
      selectedBatch: { lotNo: "LOT-ONC-881", expiry: "2027-08-14", stockAvailable: 12 }
    },
    {
      id: "RX-2026-906",
      patientId: "p6",
      patientName: "فاطمة علي الدوسري",
      mrn: "MRN-2026-0311",
      age: 71,
      gender: "Female",
      weightKg: 70,
      room: "Ward 2 Bed 08",
      ward: "Internal Medicine",
      department: "Inpatient",
      orderingDoctor: "Dr. Huda (Internal Med)",
      diagnosis: "Type 2 Diabetes & Chronic Kidney Disease Stage 3b",
      medicationName: "Metformin 500mg Film-Coated Tablet",
      medicationCode: "MET-500",
      dosage: "500 mg",
      frequency: "Twice daily after meals",
      route: "Oral",
      duration: "30 Days",
      qty: 60,
      priority: "Routine",
      status: "Dispensed (MAR Active)",
      orderTime: "45 mins ago",
      renalFunction: { egfr: 38, crcl: 35, isImpaired: true },
      marStatus: "Completed"
    }
  ]);

  // Combined orders merged live with HISContext prescriptions
  const allPharmacyOrders = useMemo(() => {
    const liveFromHIS: EnhancedPharmacyOrder[] = prescriptions.map((p: Prescription) => {
      const patient = patients.find((pt: any) => pt.id === p.patientId);
      const isSTAT = p.frequency?.includes('STAT') || (p as any).notes?.includes('STAT');
      return {
        id: p.id,
        patientId: p.patientId,
        patientName: (isAr ? patient?.nameAr : patient?.nameEn) || patient?.name || "Patient",
        mrn: patient?.mrn || "MRN-2026",
        age: patient?.age || 45,
        gender: patient?.gender || "Male",
        room: patient?.room || "Outpatient Clinic",
        ward: "Consultation Suite",
        department: "Outpatient",
        orderingDoctor: (p as any).prescriberId || "Dr. Attending",
        diagnosis: (patient as any)?.activeDiagnoses?.[0]?.title || "Clinical Visit",
        medicationName: p.medication,
        medicationCode: p.id,
        dosage: p.dose || "1 Tablet",
        frequency: p.frequency || "TID",
        route: (p.route as any) || "Oral",
        duration: `${p.durationDays || 5} Days`,
        qty: p.qty || 1,
        priority: isSTAT ? "STAT" : "Routine",
        status: p.status === "dispensed" ? "Dispensed (MAR Active)" : "New Order",
        orderTime: p.date ? new Date(p.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
        safetyAlerts: []
      };
    });

    const existingIds = new Set(liveFromHIS.map(o => o.id));
    const extraInitial = pharmacyOrders.filter(o => !existingIds.has(o.id));
    return [...liveFromHIS, ...extraInitial];
  }, [prescriptions, patients, pharmacyOrders, isAr]);

  // Calculated Real-time Operations Dashboard Metrics
  const metrics = useMemo(() => {
    const newOrders = allPharmacyOrders.filter(o => o.status === "New Order").length;
    const statOrders = allPharmacyOrders.filter(o => o.priority === "STAT" && o.status !== "Dispensed (MAR Active)").length;
    const icuOrders = allPharmacyOrders.filter(o => (o.department === "ICU" || o.department === "Emergency" || o.department === "OR") && o.status !== "Dispensed (MAR Active)").length;
    const pendingReview = allPharmacyOrders.filter(o => o.status === "Pending Clinical Review" || o.status === "New Order").length;
    const highAlertMeds = allPharmacyOrders.filter(o => o.isHighAlert && o.status !== "Dispensed (MAR Active)").length;
    const narcoticsCount = allPharmacyOrders.filter(o => o.isControlledNarcotic && o.status !== "Dispensed (MAR Active)").length;
    const readyForPickup = allPharmacyOrders.filter(o => o.status === "Ready For Pickup" || o.status === "Approved for Dispense").length;
    const dispensedToday = allPharmacyOrders.filter(o => o.status === "Dispensed (MAR Active)").length;
    const totalAlerts = allPharmacyOrders.reduce((acc, curr) => acc + (curr.safetyAlerts?.length || 0), 0);

    return { newOrders, statOrders, icuOrders, pendingReview, highAlertMeds, narcoticsCount, readyForPickup, dispensedToday, totalAlerts };
  }, [allPharmacyOrders]);

  // Filter & Smart Sorting (STAT & Emergency orders float to the top)
  const filteredOrders = useMemo(() => {
    return allPharmacyOrders
      .filter((order) => {
        // Tab Filtering
        if (activeQueueTab === "STAT" && order.priority !== "STAT") return false;
        if (activeQueueTab === "ICU" && order.department !== "ICU" && order.department !== "Emergency" && order.department !== "OR") return false;
        if (activeQueueTab === "PEDIATRIC" && !order.isPediatric) return false;
        if (activeQueueTab === "ONCOLOGY" && !order.isIVCompounding && order.department !== "Oncology") return false;
        if (activeQueueTab === "NARCOTICS" && !order.isControlledNarcotic) return false;
        if (activeQueueTab === "HIGH_ALERT" && !order.isHighAlert) return false;
        if (activeQueueTab === "CLINICAL_REVIEW" && order.status !== "Pending Clinical Review" && order.status !== "New Order") return false;
        if (activeQueueTab === "DISPENSING" && order.status !== "Approved for Dispense" && order.status !== "Dispensing") return false;
        if (activeQueueTab === "DISPENSED" && order.status !== "Dispensed (MAR Active)") return false;

        // Department Filter
        if (selectedDeptFilter !== "ALL" && order.department !== selectedDeptFilter) return false;

        // Text Search Query
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          return (
            order.patientName.toLowerCase().includes(q) ||
            order.id.toLowerCase().includes(q) ||
            order.mrn.toLowerCase().includes(q) ||
            order.medicationName.toLowerCase().includes(q) ||
            order.orderingDoctor.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const priorityWeight = { STAT: 3, High: 2, Routine: 1 };
        if (a.priority !== b.priority) return priorityWeight[b.priority] - priorityWeight[a.priority];
        if (a.isHighAlert && !b.isHighAlert) return -1;
        return 0;
      });
  }, [pharmacyOrders, activeQueueTab, selectedDeptFilter, searchQuery]);

  // Order Approval Handler
  const handleApproveOrder = (order: EnhancedPharmacyOrder) => {
    setPharmacyOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: "Approved for Dispense" } : o))
    );
    if (selectedOrder?.id === order.id) {
      setSelectedOrder({ ...selectedOrder, status: "Approved for Dispense" });
    }
    toast.success(isAr ? `تمت المراجعة الإكلينيكية واعتماد الوصفة ${order.id} للصرف` : `Order ${order.id} clinically approved`);
    if (addAuditLog) {
      addAuditLog({
        action: "PHARMACY_CLINICAL_APPROVAL",
        module: "Pharmacy",
        details: `Pharmacist approved order ${order.id} (${order.medicationName}) for patient ${order.patientName}`
      });
    }
  };

  // Dispense & MAR Dispatch Handler
  const handleExecuteDispense = () => {
    if (!selectedOrder) return;
    if (pharmacistPin.length < 4) {
      toast.error(isAr ? "الرجاء إدخال الرمز السري المكون من 4 أرقام" : "Enter 4-digit PIN");
      return;
    }

    setPharmacyOrders((prev) =>
      prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: "Dispensed (MAR Active)", marStatus: "Due" } : o))
    );
    setSelectedOrder({ ...selectedOrder, status: "Dispensed (MAR Active)", marStatus: "Due" });

    if (dispensePrescription) {
      dispensePrescription(selectedOrder.id, currentUser?.id || "PHARM-SYS");
    }

    toast.success(
      isAr 
        ? `تم صرف العلاج ${selectedOrder.medicationName} وتحديث سجل إعطاء الدواء (MAR) بقسم التمريض بنجاح` 
        : `Dispensed ${selectedOrder.medicationName} and dispatched to Nurse MAR.`
    );

    setIsSigningDispense(false);
    setPharmacistPin("");

    if (addAuditLog) {
      addAuditLog({
        action: "MEDICATION_DISPENSED",
        module: "Pharmacy",
        details: `Pharmacist ${currentUser?.nameEn || "Staff"} dispensed ${selectedOrder.medicationName} to ${selectedOrder.ward}`
      });
    }
  };

  // Order Rejection Handler
  const handleConfirmRejection = () => {
    if (!rejectionTarget) return;
    setPharmacyOrders((prev) =>
      prev.map((o) => (o.id === rejectionTarget.id ? { ...o, status: "Rejected" } : o))
    );
    toast.error(
      isAr 
        ? `تم إيقاف ورفض طلب الدواء ${rejectionTarget.id} وتنبيه الطبيب المعالج (${rejectionReason})` 
        : `Order ${rejectionTarget.id} rejected. Doctor notified.`
    );
    setRejectionTarget(null);
    if (selectedOrder?.id === rejectionTarget.id) {
      setSelectedOrder(null);
    }
  };

  // Status Badge Rendering Helper
  const getStatusBadge = (status: PharmacyOrderStatus) => {
    switch (status) {
      case "New Order":
        return <span className="px-2.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span> New Order</span>;
      case "Pending Clinical Review":
        return <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-md text-[10px] font-black uppercase tracking-wider">Clinical Review</span>;
      case "Approved for Dispense":
        return <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md text-[10px] font-black uppercase tracking-wider">Approved for Pick</span>;
      case "Dispensing":
        return <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-md text-[10px] font-black uppercase tracking-wider animate-pulse">Dispensing</span>;
      case "Ready For Pickup":
        return <span className="px-2.5 py-0.5 bg-teal-500/10 text-teal-300 border border-teal-500/20 rounded-md text-[10px] font-black uppercase tracking-wider">Ready for Ward</span>;
      case "Dispensed (MAR Active)":
        return <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md text-[10px] font-black uppercase tracking-wider">MAR Active</span>;
      case "On Hold":
        return <span className="px-2.5 py-0.5 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-md text-[10px] font-black uppercase tracking-wider">On Clinical Hold</span>;
      case "Rejected":
        return <span className="px-2.5 py-0.5 bg-rose-950 text-rose-300 border border-rose-600 rounded-md text-[10px] font-black uppercase tracking-wider">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 font-sans text-slate-100 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
      
      {/* 1. ENTERPRISE SYSTEM CONTROL HEADER */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20 border border-emerald-400/30">
            <Pill className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                {isAr ? "مركز قيادة الصيدلية وإدارة الدواء (Pharmacy Command Center)" : "Pharmacy Command Center & Medication Management"}
              </h1>
              <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                CLOSED-LOOP MEDICATION SYSTEM
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isAr ? "مراجعة الأوامر الطبية • السلامة الإكلينيكية • الصرف الآلي • ربط سجل إعطاء الدواء MAR" : "Prescription Review • Clinical Safety • Barcode Dispensing • Nursing MAR Sync"}
            </p>
          </div>
        </div>

        {/* User Station & Quick Sync Button */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300 font-bold">{currentUser?.nameEn || "PharmD. Norhan Ali"}</span>
            <span className="text-slate-500">• Central Pharmacy Vault</span>
          </div>

          <button
            onClick={() => toast.info(isAr ? "جاري مزامنة أوامر الأدوية من نظام الأطباء CPOE..." : "Syncing Physician Orders from CPOE...")}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{isAr ? "مزامنة الأوامر الطبية" : "Sync CPOE Orders"}</span>
          </button>
        </div>
      </header>

      {/* 2. REAL-TIME OPERATIONS METRICS COUNTER BAR */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-2.5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-2 shrink-0">
        <button onClick={() => { setViewMode("queues"); setActiveQueueTab("ALL"); }} className={`p-2 rounded-xl border text-center transition-all ${activeQueueTab === "ALL" && viewMode === "queues" ? "bg-emerald-600/20 border-emerald-500 text-emerald-300" : "bg-slate-950/60 border-slate-800 hover:bg-slate-800 text-slate-400"}`}>
          <div className="text-lg font-black text-rose-400 flex items-center justify-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            {metrics.newOrders}
          </div>
          <div className="text-[10px] font-bold text-slate-300 truncate">{isAr ? "🔴 أوامر جديدة" : "New Orders"}</div>
        </button>

        <button onClick={() => { setViewMode("queues"); setActiveQueueTab("STAT"); }} className={`p-2 rounded-xl border text-center transition-all ${activeQueueTab === "STAT" ? "bg-rose-600/20 border-rose-500 text-rose-300 animate-pulse" : "bg-slate-950/60 border-slate-800 hover:bg-slate-800 text-slate-400"}`}>
          <div className="text-lg font-black text-rose-400">{metrics.statOrders}</div>
          <div className="text-[10px] font-bold text-slate-300 truncate">{isAr ? "⚡ طوارئ STAT" : "STAT Orders"}</div>
        </button>

        <button onClick={() => { setViewMode("queues"); setActiveQueueTab("ICU"); }} className={`p-2 rounded-xl border text-center transition-all ${activeQueueTab === "ICU" ? "bg-amber-600/20 border-amber-500 text-amber-300" : "bg-slate-950/60 border-slate-800 hover:bg-slate-800 text-slate-400"}`}>
          <div className="text-lg font-black text-amber-400">{metrics.icuOrders}</div>
          <div className="text-[10px] font-bold text-slate-300 truncate">{isAr ? "🏥 العناية ICU" : "ICU Orders"}</div>
        </button>

        <button onClick={() => setViewMode("clinical_review")} className={`p-2 rounded-xl border text-center transition-all ${viewMode === "clinical_review" ? "bg-cyan-600/20 border-cyan-500 text-cyan-300" : "bg-slate-950/60 border-slate-800 hover:bg-slate-800 text-slate-400"}`}>
          <div className="text-lg font-black text-cyan-400">{metrics.pendingReview}</div>
          <div className="text-[10px] font-bold text-slate-300 truncate">{isAr ? "🛡️ مراجعة إكلينيكية" : "Pending Review"}</div>
        </button>

        <button onClick={() => { setViewMode("queues"); setActiveQueueTab("HIGH_ALERT"); }} className={`p-2 rounded-xl border text-center transition-all ${activeQueueTab === "HIGH_ALERT" ? "bg-purple-600/20 border-purple-500 text-purple-300" : "bg-slate-950/60 border-slate-800 hover:bg-slate-800 text-slate-400"}`}>
          <div className="text-lg font-black text-purple-400">{metrics.highAlertMeds}</div>
          <div className="text-[10px] font-bold text-slate-300 truncate">{isAr ? "🧪 أدوية عالية الخطورة" : "High Alert (HAM)"}</div>
        </button>

        <button onClick={() => setViewMode("narcotics")} className={`p-2 rounded-xl border text-center transition-all ${viewMode === "narcotics" ? "bg-rose-900/30 border-rose-500 text-rose-300" : "bg-slate-950/60 border-slate-800 hover:bg-slate-800 text-slate-400"}`}>
          <div className="text-lg font-black text-rose-400">{metrics.narcoticsCount}</div>
          <div className="text-[10px] font-bold text-slate-300 truncate">{isAr ? "🔒 مخدرات ومراقبة" : "Narcotics Register"}</div>
        </button>

        <button onClick={() => setViewMode("dispensing")} className={`p-2 rounded-xl border text-center transition-all ${viewMode === "dispensing" ? "bg-emerald-600/20 border-emerald-500 text-emerald-300" : "bg-slate-950/60 border-slate-800 hover:bg-slate-800 text-slate-400"}`}>
          <div className="text-lg font-black text-emerald-400">{metrics.readyForPickup}</div>
          <div className="text-[10px] font-bold text-slate-300 truncate">{isAr ? "📦 جاهز للصرف" : "Ready for Dispense"}</div>
        </button>

        <button onClick={() => setViewMode("mar_sync")} className={`p-2 rounded-xl border text-center transition-all ${viewMode === "mar_sync" ? "bg-teal-600/20 border-teal-500 text-teal-300" : "bg-slate-950/60 border-slate-800 hover:bg-slate-800 text-slate-400"}`}>
          <div className="text-lg font-black text-teal-400">{metrics.dispensedToday}</div>
          <div className="text-[10px] font-bold text-slate-300 truncate">{isAr ? "🟢 تم الصرف (MAR)" : "Dispensed MAR"}</div>
        </button>

        <div className="p-2 rounded-xl border border-slate-800 bg-slate-950/60 text-center">
          <div className="text-lg font-black text-indigo-400">3.8m</div>
          <div className="text-[10px] font-bold text-slate-300 truncate">{isAr ? "⏱️ متوسط الصرف TAT" : "Dispense TAT"}</div>
        </div>
      </div>

      {/* 3. WORKSPACE TOOLBAR NAVIGATION & SEARCH */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-2.5 flex items-center justify-between gap-3 overflow-x-auto custom-scrollbar shrink-0">
        <div className="flex items-center gap-2 min-w-max">
          <button
            onClick={() => { setViewMode("queues"); setActiveQueueTab("ALL"); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${viewMode === "queues" ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30" : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"}`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>{isAr ? "طوابير العمل (Work Queues)" : "Work Queues"}</span>
          </button>

          <button
            onClick={() => setViewMode("clinical_review")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${viewMode === "clinical_review" ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30" : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"}`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isAr ? "الصيدلة الإكلينيكية (Clinical Pharmacy)" : "Clinical Pharmacy"}</span>
          </button>

          <button
            onClick={() => setViewMode("dispensing")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${viewMode === "dispensing" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"}`}
          >
            <PackageCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isAr ? "مركز الصرف والتكويد (Dispensing Center)" : "Dispensing Center"}</span>
          </button>

          <button
            onClick={() => setViewMode("mar_sync")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${viewMode === "mar_sync" ? "bg-teal-600 text-white shadow-md shadow-teal-600/30" : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"}`}
          >
            <Syringe className="w-3.5 h-3.5 text-teal-400" />
            <span>{isAr ? "ربط إعطاء الدواء (MAR Integration)" : "MAR Integration"}</span>
          </button>

          <button
            onClick={() => setViewMode("narcotics")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${viewMode === "narcotics" ? "bg-rose-900 text-rose-100 border border-rose-500 shadow-md" : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"}`}
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>{isAr ? "سجل الأدوية المخدرة (Controlled Meds)" : "Controlled Drugs"}</span>
          </button>

          <button
            onClick={() => setViewMode("iv_room")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${viewMode === "iv_room" ? "bg-purple-600 text-white shadow-md shadow-purple-600/30" : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"}`}
          >
            <Flame className="w-3.5 h-3.5 text-purple-400" />
            <span>{isAr ? "تحضير الوريدي والكيماوي (IV / TPN Prep)" : "IV Prep / TPN"}</span>
          </button>

          <button
            onClick={() => setViewMode("inventory")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${viewMode === "inventory" ? "bg-amber-600 text-white shadow-md shadow-amber-600/30" : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"}`}
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? "ذكاء المخزون والصيدليات (Inventory Intelligence)" : "Inventory Intelligence"}</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-64 min-w-max">
          <Search className="w-3.5 h-3.5 absolute right-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? "بحث مريض، دواء، طبيب، MRN..." : "Search patient, med, doctor..."}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-8 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-bold"
          />
        </div>
      </div>

      {/* 4. MAIN WORKSPACE CONTENT CONTAINER */}
      <div className="flex-1 flex overflow-hidden">

        {/* WORKSPACE VIEW 1: TASK QUEUES WORKSPACE */}
        {viewMode === "queues" && (
          <main className="flex-1 bg-slate-950 flex flex-col overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
            
            {/* Queues Filter Sub-tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
              <div className="flex items-center gap-1 overflow-x-auto">
                {[
                  { id: "ALL", ar: "جميع الوصفات", en: "All Orders" },
                  { id: "STAT", ar: "طوارئ STAT ⚡", en: "STAT Orders" },
                  { id: "ICU", ar: "العناية والأقسام الحرجة 🏥", en: "ICU / ER / OR" },
                  { id: "CLINICAL_REVIEW", ar: "بانتظار التدقيق الإكلينيكي 🛡️", en: "Pending Review" },
                  { id: "NARCOTICS", ar: "أدوية مخدرة 🔒", en: "Controlled Meds" },
                  { id: "HIGH_ALERT", ar: "عالية الخطورة 🧪", en: "High Alert (HAM)" },
                  { id: "PEDIATRIC", ar: "أطفال 👶", en: "Pediatric" },
                  { id: "ONCOLOGY", ar: "أورام ومحاليل 💉", en: "Oncology IV" },
                  { id: "DISPENSED", ar: "تم صرفها (سجل MAR) 🟢", en: "Dispensed" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveQueueTab(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all min-w-max ${
                      activeQueueTab === tab.id
                        ? "bg-emerald-600 text-white shadow-md"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {isAr ? tab.ar : tab.en}
                  </button>
                ))}
              </div>

              <div className="text-xs font-mono text-slate-400 px-3">
                {filteredOrders.length} {isAr ? "وصفة بالانتظار" : "Orders Queue"}
              </div>
            </div>

            {/* ORDERS QUEUE LIST */}
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 shadow-lg ${
                    order.priority === "STAT"
                      ? "bg-rose-950/20 border-rose-500/40 hover:border-rose-500"
                      : order.isHighAlert || order.isControlledNarcotic
                      ? "bg-slate-900/90 border-slate-700 hover:border-emerald-500"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-3">
                      {order.priority === "STAT" ? (
                        <span className="px-2.5 py-1 bg-rose-600 text-white font-black text-xs rounded-lg uppercase tracking-wider flex items-center gap-1 shadow-md shadow-rose-600/30 animate-pulse">
                          <Zap className="w-3.5 h-3.5" />
                          STAT
                        </span>
                      ) : order.isHighAlert ? (
                        <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold text-xs rounded-lg uppercase">
                          HAM High Alert
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-slate-800 text-slate-400 font-bold text-xs rounded-lg uppercase">
                          Routine
                        </span>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-emerald-400 font-black text-sm">{order.id}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-400 text-xs">{order.orderTime}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-300 text-xs font-bold">{order.orderingDoctor}</span>
                        </div>
                        <h3 className="text-base font-black text-white">{order.medicationName}</h3>
                      </div>
                    </div>

                    {/* Patient Context */}
                    <div className="flex items-center gap-3">
                      <div className="text-right rtl:text-right ltr:text-left">
                        <GlobalEntityLink entityId={order.patientId} entityName={order.patientName} entityType="patient" isAr={isAr} className="text-sm font-black text-white hover:text-emerald-400" />
                        <div className="text-xs text-slate-400 flex items-center gap-2">
                          <span className="text-emerald-300 font-bold">{order.department}</span>
                          <span className="text-slate-600">•</span>
                          <span>{order.room}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dosage & Route & Warnings */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-slate-300">
                        {order.dosage} — {order.frequency} ({order.route})
                      </div>

                      {order.isControlledNarcotic && (
                        <span className="px-2.5 py-1 bg-rose-900/60 text-rose-300 border border-rose-500/50 rounded-xl text-[10px] font-black flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          NARCOTIC CONTROLLED
                        </span>
                      )}

                      {order.renalFunction?.isImpaired && (
                        <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-xl text-[10px] font-bold">
                          eGFR: {order.renalFunction.egfr} mL/min (Renal Alert)
                        </span>
                      )}
                    </div>

                    <div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Safety Alerts Banner */}
                  {order.safetyAlerts && order.safetyAlerts.length > 0 && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs space-y-1">
                      {order.safetyAlerts.map((alert, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-rose-300 font-bold">
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-black underline">{alert.title}:</span> {alert.desc}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isAr ? "فتح بيئة عمل الوصفة (Open Order Workspace)" : "Open Order Workspace"}</span>
                      </button>

                      {order.status === "Pending Clinical Review" || order.status === "New Order" ? (
                        <button
                          onClick={() => handleApproveOrder(order)}
                          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{isAr ? "اعتماد إكلينيكي" : "Approve Order"}</span>
                        </button>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toast.success(isAr ? `طباعة الملصق الدوائي والباركود ${order.id}` : `Printing label ${order.id}`)}
                        className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition-all"
                        title={isAr ? "طباعة الباركود والملصق" : "Print Label"}
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setRejectionTarget(order)}
                        className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30 transition-all"
                        title={isAr ? "رفض / تعليق الوصفة" : "Reject Order"}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}

        {/* WORKSPACE VIEW 2: CLINICAL PHARMACY INTERVENTION WORKSPACE */}
        {viewMode === "clinical_review" && (
          <main className="flex-1 bg-slate-950 p-6 space-y-6 overflow-y-auto custom-scrollbar">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  {isAr ? "وحدة التدقيق والسلامة الدوائية (Clinical Pharmacy Workspace)" : "Clinical Pharmacy Workspace"}
                </h2>
                <p className="text-xs text-slate-400">
                  {isAr ? "فحص التداخلات الدوائية، حساب تعديل الجرعات الكلوية، فحص الحساسية وتوثيق توصيات الصيدلي" : "Drug Interaction Check, Renal Dose Calculator, Allergy Audits & Physician Recommendations"}
                </p>
              </div>
              <button onClick={() => setViewMode("queues")} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl">
                {isAr ? "العودة لطوابير العمل" : "Back to Queues"}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Interaction & Renal Calculator Module */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? "حاسبة تعديل الجرعات الكلوية (Renal Dose Adjustment)" : "Renal Dose Adjustment Calculator"}</span>
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">{isAr ? "عمر المريض (سنة)" : "Age (years)"}</label>
                    <input type="number" defaultValue={64} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono font-bold" />
                  </div>
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">{isAr ? "الوزن (كجم)" : "Weight (kg)"}</label>
                    <input type="number" defaultValue={78} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono font-bold" />
                  </div>
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">{isAr ? "سيروم كرياتينين Serum Cr" : "Serum Cr (mg/dL)"}</label>
                    <input type="number" step="0.1" defaultValue={1.8} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono font-bold" />
                  </div>
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">{isAr ? "تصفية الكرياتينين CrCl" : "Calculated CrCl"}</label>
                    <div className="w-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-black p-2 rounded-xl text-center">
                      48 mL/min (Moderate Impairment)
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <span className="text-indigo-400 font-bold block">{isAr ? "توصيات الجرعة حسب الدليل الدوائي:" : "Dosing Protocol Recommendation:"}</span>
                  <p className="text-slate-300">
                    {isAr 
                      ? "الدواء الموصوف: Meropenem 1g q8h. التوصية: خفض الجرعة إلى 500mg q12h نظراً لأن CrCl أقل من 50 mL/min." 
                      : "Prescribed Meropenem 1g q8h. Recommendation: Reduce dose to 500mg q12h due to CrCl < 50 mL/min."}
                  </p>
                </div>
              </div>

              {/* Antimicrobial Stewardship & Notes Form */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>{isAr ? "توثيق التوصية الإكلينيكية للطبيب (Pharmacist Intervention Note)" : "Pharmacist Clinical Note"}</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">{isAr ? "نوع التوصية:" : "Intervention Category:"}</label>
                    <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold">
                      <option>{isAr ? "تعديل جرعة قصور كلوى (Renal Dose Adjustment)" : "Renal Dose Adjustment"}</option>
                      <option>{isAr ? "تداخل دوائي خطر (Drug-Drug Interaction Alert)" : "Drug-Drug Interaction"}</option>
                      <option>{isAr ? "ترشيد المضادات الحيوية (Antimicrobial Stewardship)" : "Antimicrobial Stewardship"}</option>
                      <option>{isAr ? "علاج مكرر (Duplicate Therapy)" : "Duplicate Therapy"}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">{isAr ? "ملاحظات التوصية الإكلينيكية:" : "Clinical Note Details:"}</label>
                    <textarea rows={4} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold focus:outline-none focus:border-cyan-500" defaultValue="نوصي بتعديل جرعة Meropenem بناءً على تحليل وظائف الكلى اليوم مع المتابعة الدورية للتحاليل المخبرية." />
                  </div>

                  <button onClick={() => toast.success(isAr ? "تم إرسال التوصية الإكلينيكية للطبيب عبر CPOE" : "Intervention sent to physician via CPOE")} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    <span>{isAr ? "إرسال التوصية للطبيب المعالج" : "Send Clinical Note to Physician"}</span>
                  </button>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* WORKSPACE VIEW 3: DISPENSING CENTER */}
        {viewMode === "dispensing" && (
          <main className="flex-1 bg-slate-950 p-6 space-y-6 overflow-y-auto custom-scrollbar">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <PackageCheck className="w-5 h-5 text-indigo-400" />
                  {isAr ? "مركز الصرف والتكويد بالباركود (Dispensing & Barcode Verification)" : "Dispensing & Barcode Verification Hub"}
                </h2>
                <p className="text-xs text-slate-400">{isAr ? "مطابقة الدواء بالباركود، اختيار التشغيلة (Batch/Lot FEFO) والتوقيع الإلكتروني للصيدلي" : "Barcode matching, FEFO batch selection, unit dose packing & electronic signature"}</p>
              </div>
              <button onClick={() => setViewMode("queues")} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl">
                {isAr ? "العودة لطوابير العمل" : "Back to Queues"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pharmacyOrders.filter(o => o.status === "Approved for Dispense" || o.status === "Dispensing" || o.status === "New Order").map((order) => (
                <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                  <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">{order.id}</span>
                      <h3 className="text-base font-black text-white">{order.medicationName}</h3>
                      <p className="text-xs text-slate-400">{order.patientName} — {order.ward}</p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>{isAr ? "التشغيلة المحددة (FEFO):" : "Selected Batch (FEFO):"}</span>
                      <span className="font-mono text-emerald-400 font-bold">{order.selectedBatch?.lotNo || "LOT-SYS-001"}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>{isAr ? "تاريخ الصلاحية:" : "Expiry Date:"}</span>
                      <span className="font-mono text-slate-300">{order.selectedBatch?.expiry || "2027-10-31"}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => { setSelectedOrder(order); setIsSigningDispense(true); }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                  >
                    <Barcode className="w-4 h-4" />
                    <span>{isAr ? "مسح الباركود والتوقيع للصرف" : "Verify Barcode & Dispense"}</span>
                  </button>
                </div>
              ))}
            </div>
          </main>
        )}

        {/* WORKSPACE VIEW 4: CONTROLLED DRUGS NARCOTICS REGISTER */}
        {viewMode === "narcotics" && (
          <main className="flex-1 bg-slate-950 p-6 space-y-6 overflow-y-auto custom-scrollbar">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-rose-400" />
                  {isAr ? "سجل ومراقبة الأدوية المخدرة والمحكومة (Controlled Drugs & Narcotics Vault Log)" : "Narcotics & Controlled Drugs Register"}
                </h2>
                <p className="text-xs text-slate-400">{isAr ? "مراقبة الرصيد الفعلي، التوقيع الثنائي المزدوج وتوثيق الشواهد أثناء تسليم العهدة" : "Perpetual inventory log, dual signature verification & shift balance audit"}</p>
              </div>
              <button onClick={() => setViewMode("queues")} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl">
                {isAr ? "العودة لطوابير العمل" : "Back to Queues"}
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-3">
                <span className="font-black text-rose-400 uppercase tracking-wider">{isAr ? "قائمة أوامر الأدوية المخدرة النشطة:" : "Active Controlled Orders:"}</span>
                <span className="font-mono text-slate-400">Vault Station 01</span>
              </div>

              <div className="space-y-3">
                {pharmacyOrders.filter(o => o.isControlledNarcotic).map((narcoticOrder) => (
                  <div key={narcoticOrder.id} className="bg-slate-950 p-4 rounded-xl border border-rose-500/30 flex justify-between items-center text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-rose-400 font-black">{narcoticOrder.id}</span>
                        <span className="text-white font-bold">{narcoticOrder.medicationName}</span>
                      </div>
                      <p className="text-slate-400 mt-1">{narcoticOrder.patientName} — {narcoticOrder.room} (Dr. {narcoticOrder.orderingDoctor})</p>
                    </div>

                    <button
                      onClick={() => { setSelectedOrder(narcoticOrder); setIsSigningDispense(true); }}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isAr ? "توقيع ثنائي وصرف" : "Dual Sign Dispense"}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* WORKSPACE VIEW 5: MAR INTEGRATION */}
        {viewMode === "mar_sync" && (
          <main className="flex-1 bg-slate-950 p-6 space-y-6 overflow-y-auto custom-scrollbar">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Syringe className="w-5 h-5 text-teal-400" />
                  {isAr ? "سجل إعطاء الدواء المباشر بقسم التمريض (MAR Integration & Ward Handover)" : "Medication Administration Record (MAR) Live Integration"}
                </h2>
                <p className="text-xs text-slate-400">{isAr ? "تتبع مباشر للجرعات المصروفة وتأكيد إعطائها من قبل التمريض (Due / Completed / Missed)" : "Real-time synchronization between Pharmacy Dispensing and Nursing MAR"}</p>
              </div>
              <button onClick={() => setViewMode("queues")} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl">
                {isAr ? "العودة لطوابير العمل" : "Back to Queues"}
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <h3 className="text-sm font-black text-white border-b border-slate-800 pb-3">{isAr ? "جدول الجرعات النشطة في أقسام التمريض:" : "Active Nursing MAR Schedule:"}</h3>
              <div className="space-y-3">
                {pharmacyOrders.map((order) => (
                  <div key={order.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-teal-400 font-bold">{order.id}</span>
                        <span className="text-white font-black">{order.medicationName}</span>
                        <span className="text-slate-500">({order.dosage})</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-1">{order.patientName} — {order.ward} — Bed {order.room}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-xl text-xs font-black ${order.marStatus === "Completed" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"}`}>
                        MAR: {order.marStatus || "Due"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

      </div>

      {/* 5. FULL PHARMACY WORKSPACE PANE (Non-popup dedicated full pane drawer) */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0, x: isAr ? -300 : 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isAr ? -300 : 300 }}
            className="fixed inset-y-0 right-0 left-0 lg:left-auto lg:w-[650px] bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col overflow-hidden text-right" dir={isAr ? "rtl" : "ltr"}
          >
            {/* Header */}
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-600/20 border border-emerald-500/30 rounded-xl text-emerald-400">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{isAr ? "بيئة عمل الوصفة الطبية (Order Workspace)" : "Order Workspace"}</h3>
                  <span className="font-mono text-xs text-emerald-400 font-bold">{selectedOrder.id}</span>
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-xl border border-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Workspace Body */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">

              {/* PATIENT BANNER */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-xs font-black text-slate-400 uppercase">{isAr ? "بيانات المريض والوظائف الحيوية:" : "Patient Banner:"}</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">MRN: {selectedOrder.mrn}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">{isAr ? "الاسم" : "Name"}</span>
                    <span className="font-black text-white">{selectedOrder.patientName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">{isAr ? "العمر / الجنس" : "Age/Gender"}</span>
                    <span className="font-bold text-slate-300">{selectedOrder.age} yrs / {selectedOrder.gender}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">{isAr ? "تصفية الكلى eGFR" : "eGFR"}</span>
                    <span className={`font-mono font-bold ${selectedOrder.renalFunction?.isImpaired ? "text-amber-400" : "text-emerald-400"}`}>
                      {selectedOrder.renalFunction?.egfr || 88} mL/min
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">{isAr ? "الحساسية" : "Allergies"}</span>
                    <span className="font-bold text-rose-400">{selectedOrder.allergies?.join(", ") || (isAr ? "لا يوجد" : "NKDA")}</span>
                  </div>
                </div>
              </div>

              {/* PRESCRIPTION ORDER DETAILS */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase border-b border-slate-800 pb-2">{isAr ? "تفاصيل الأمر الطبي:" : "Order Specification:"}</h4>
                <div>
                  <h3 className="text-lg font-black text-white">{selectedOrder.medicationName}</h3>
                  <p className="text-xs font-mono text-emerald-400 font-bold mt-0.5">{selectedOrder.dosage} — {selectedOrder.frequency}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">{isAr ? "طريقة الإعطاء Route" : "Route"}</span>
                    <span className="font-bold text-white">{selectedOrder.route}</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">{isAr ? "الكمية الموصوفة Qty" : "Qty"}</span>
                    <span className="font-bold text-white">{selectedOrder.qty} Unit</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">{isAr ? "الطبيب المعالج" : "Doctor"}</span>
                    <span className="font-bold text-white">{selectedOrder.orderingDoctor}</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">{isAr ? "التشخيص Clinic" : "Diagnosis"}</span>
                    <span className="font-bold text-white">{selectedOrder.diagnosis}</span>
                  </div>
                </div>
              </div>

              {/* BATCH SELECTION & INVENTORY AVAILABILITY */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-black text-slate-400 uppercase block">{isAr ? "اختيار التشغيلة والصلاحية (FEFO Auto-Select):" : "Batch Selection (FEFO):"}</span>
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <span className="font-mono font-black text-emerald-300 block">{selectedOrder.selectedBatch?.lotNo || "LOT-SYSTEM-99"}</span>
                    <span className="text-slate-400 text-[10px]">{isAr ? "تاريخ الانتهاء:" : "Expiry:"} {selectedOrder.selectedBatch?.expiry || "2027-12-31"}</span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-600 text-white font-mono font-bold rounded-lg text-xs">
                    {selectedOrder.selectedBatch?.stockAvailable || 120} In Stock
                  </span>
                </div>
              </div>

            </div>

            {/* Actions Bar */}
            <div className="p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => setRejectionTarget(selectedOrder)}
                className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold rounded-xl border border-rose-500/30 text-xs transition-all"
              >
                {isAr ? "إيقاف / تعليق" : "Hold Order"}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleApproveOrder(selectedOrder)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-all"
                >
                  {isAr ? "اعتماد إكلينيكي" : "Approve"}
                </button>

                <button
                  onClick={() => setIsSigningDispense(true)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>{isAr ? "صرف وتحديث MAR" : "Dispense & Dispatch MAR"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. ELECTRONIC SIGNATURE / PIN VERIFICATION MODAL */}
      {isSigningDispense && selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir={isAr ? "rtl" : "ltr"}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-5 shadow-2xl text-right">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                {isAr ? "التوقيع الإلكتروني للصيدلي المسؤول" : "Pharmacist PIN Verification"}
              </h3>
              <button onClick={() => setIsSigningDispense(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              {isAr ? `تأكيد صرف الدواء ${selectedOrder.medicationName} للمريض ${selectedOrder.patientName}` : `Confirm dispensing ${selectedOrder.medicationName} to ${selectedOrder.patientName}`}
            </p>

            <div>
              <label className="text-xs text-slate-400 font-bold block mb-1.5">{isAr ? "أدخل الرمز السري (PIN):" : "Enter Pharmacist PIN:"}</label>
              <input
                type="password"
                maxLength={4}
                value={pharmacistPin}
                onChange={(e) => setPharmacistPin(e.target.value)}
                placeholder="••••"
                className="w-full text-center tracking-widest text-2xl font-mono font-black p-3 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsSigningDispense(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold">
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button onClick={handleExecuteDispense} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/30">
                {isAr ? "تأكيد الصرف وتحديث MAR" : "Confirm Dispense"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 7. REJECTION / HOLD REASON MODAL */}
      {rejectionTarget && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir={isAr ? "rtl" : "ltr"}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-5 shadow-2xl text-right">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {isAr ? "إيقاف / رفض طلب الدواء" : "Reject Order"}
              </h3>
              <button onClick={() => setRejectionTarget(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              {isAr ? `حدد سبب إيقاف طلب ${rejectionTarget.id} لتنبيه الطبيب المعالج:` : `Select rejection reason for order ${rejectionTarget.id}:`}
            </p>

            <select
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-bold"
            >
              <option>{isAr ? "تعديل جرعة قصور كلوى مطلوب (Renal Dose Adjustment Required)" : "Renal Dose Adjustment Required"}</option>
              <option>{isAr ? "تداخل دوائي خطير مع علاج المريض (Severe Drug-Drug Interaction)" : "Severe Drug Interaction"}</option>
              <option>{isAr ? "حساسية مؤكدة ضد مجموعة هذا الدواء (Known Patient Allergy)" : "Known Patient Allergy"}</option>
              <option>{isAr ? "جرعة زائدة عن الحد المسموح به (Maximum Daily Dose Exceeded)" : "Max Daily Dose Exceeded"}</option>
              <option>{isAr ? "عدم توفر الصنف في المخزون واقتراح بديل (Out of Stock / Alternative Suggested)" : "Out of Stock"}</option>
            </select>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setRejectionTarget(null)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold">
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button onClick={handleConfirmRejection} className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black shadow-lg shadow-rose-600/30">
                {isAr ? "تأكيد الرفض وتنبيه الطبيب" : "Confirm Rejection"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
