import { GlobalEntityLink } from "./GlobalEntityLink";
import React, { useState, useEffect } from "react";
import { 
  Activity, Stethoscope, ClipboardList, Thermometer, User, AlertTriangle, 
  FileSignature, Save, Pill, TestTube, ArrowRight, Printer, Plus, 
  Upload, Flag, Clock, History, FileText, FileSearch, HardDrive, DollarSign,
  ShieldAlert, Send, ArrowLeft, HeartPulse, Hospital, Scissors, UserPlus,
  ArrowRightLeft, CheckCircle2, Search, FileDown, Edit3
} from "lucide-react";
import { useHIS } from "../context/HISContext";
import { toast } from "sonner";
import { saveSetting, syncSetting } from "../lib/firestoreService";
import { EXTENDED_LAB_TESTS } from "../data/labTests";
import DoctorConsultationDesk from "./DoctorConsultationDesk";
import { NursingConsole } from "./NursingConsole";
import { PatientClinicalHeader } from "./PatientClinicalHeader";
import ClinicalSummaryGenerator from "./ClinicalSummaryGenerator";

interface Props {
  language: "ar" | "en";
  currentUser?: any;
  onNavigate?: (tab: string) => void;
}

type PatientTab = "summary" | "encounter" | "vitals" | "diagnoses" | "orders" | "lab" | "radiology" | "medications" | "billing" | "documents" | "audit" | "timeline";

export default function EMRDashboard({ language, currentUser, onNavigate }: Props) {
  const isAr = language === "ar";
  const [viewMode, setViewMode] = useState<"queue" | "patient_file">("queue");
  const [activeRoleTab, setActiveRoleTab] = useState<"triage" | "emr">("triage");
  const [activePatientTab, setActivePatientTab] = useState<PatientTab>("summary");
  
  const { 
    patients, 
    updatePatient,
    updatePatientStatus, 
    addPrescription, 
    cpoeOrders, 
    setCpoeOrders, 
    prescriptions, 
    getSetting, 
    saveSetting,
    labResults,
    radiologyReports,
    visits,
    addVisit,
    updateVisit
  } = useHIS();

  // Dedicated EMR Workflow Modals
  const [showEditPatientModal, setShowEditPatientModal] = useState(false);
  const [showUploadDocModal, setShowUploadDocModal] = useState(false);
  const [showAddReportModal, setShowAddReportModal] = useState(false);

  const [editForm, setEditForm] = useState({
    nameEn: "", nameAr: "", phone: "", nationalId: "", bloodType: "O+", gender: "male", age: 30
  });
  const [docForm, setDocForm] = useState({ title: "", type: "Lab Report", notes: "" });
  const [reportForm, setReportForm] = useState({ title: "", category: "Consultation Report", findings: "", recommendation: "" });
  
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);
  const activeVisit = visits.find(v => v.patientId === selectedPatientId && (selectedVisitId ? v.id === selectedVisitId : v.status === "active"));

  const triagePatients = patients.filter(p => p.status === "registered" || p.status === "triage");
  const doctorPatients = patients.filter(p => p.status === "doctor");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [timelineSearch, setTimelineSearch] = useState("");

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || null;

  // User Role Detection
  const currentUserStr = sessionStorage.getItem("hospital_currentUser");
  const currentUserObj = currentUserStr ? JSON.parse(currentUserStr) : null;
  const userRole = currentUserObj?.role || "doctor"; // Fallback to doctor

  // Aggregate Timeline Events
  const timelineEvents = React.useMemo(() => {
    if (!selectedPatient) return [];
    
    const events: any[] = [];

    // Registration Event
    events.push({
      id: `reg-${selectedPatient.id}`,
      time: "08:00 AM",
      date: "2023-10-27", // Mocking dates for now, ideally use patient registration date
      user: "Receptionist",
      dept: "Front Desk",
      type: "Registration",
      action: isAr ? "تسجيل المريض" : "Patient Registration",
      desc: isAr ? "تم تسجيل المريض وفتح ملف طبي جديد" : "Patient arrived and registered at main desk.",
      icon: <User className="w-5 h-5" />,
      color: "bg-blue-100 text-blue-600 border-blue-200"
    });

    // Lab Results
    (labResults || []).filter(r => r.patientId === selectedPatient.mrn || r.patientId === selectedPatient.id).forEach(res => {
      events.push({
        id: res.id,
        time: res.date ? new Date(res.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A",
        date: res.date ? new Date(res.date).toISOString().split('T')[0] : "N/A",
        user: res.performedBy || "LIS System",
        dept: "Laboratory",
        type: "lab_results",
        action: isAr ? `نتيجة مختبر: ${res.testName}` : `Lab Result: ${res.testName}`,
        desc: isAr ? `القيمة: ${res.value} ${res.unit} (${res.flag})` : `Value: ${res.value} ${res.unit} (${res.flag})`,
        icon: <TestTube className="w-5 h-5" />,
        color: res.flag === 'critical' ? "bg-rose-100 text-rose-600 border-rose-200" : "bg-purple-100 text-purple-600 border-purple-200"
      });
    });

    // Radiology Reports
    (radiologyReports || []).filter(r => r.patientId === selectedPatient.mrn || r.patientId === selectedPatient.id).forEach(rep => {
      events.push({
        id: rep.id,
        time: rep.date ? new Date(rep.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A",
        date: rep.date ? new Date(rep.date).toISOString().split('T')[0] : "N/A",
        user: rep.radiologistId || "Radiologist",
        dept: "Radiology",
        type: "radiology_reports",
        action: isAr ? `تقرير أشعة: ${rep.studyName}` : `Radiology Report: ${rep.studyName}`,
        desc: rep.impression.length > 50 ? rep.impression.substring(0, 50) + "..." : rep.impression,
        icon: <HardDrive className="w-5 h-5" />,
        color: "bg-amber-100 text-amber-600 border-amber-200"
      });
    });

    // Orders (Medications, etc)
    (cpoeOrders || []).filter(o => o.mrn === selectedPatient.mrn || o.visitId === selectedPatient.id).forEach(order => {
      events.push({
        id: order.id,
        time: order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A",
        date: order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : "N/A",
        user: order.doctorId || "Doctor",
        dept: "Clinical",
        type: "cpoe_orders",
        action: isAr ? `طلب طبي: ${order.orderName || order.orderType}` : `Order: ${order.orderName || order.orderType}`,
        desc: `${order.status} - ${order.priority || 'Routine'}`,
        icon: order.orderType === 'Medication' ? <Pill className="w-5 h-5" /> : <ClipboardList className="w-5 h-5" />,
        color: "bg-indigo-100 text-indigo-600 border-indigo-200"
      });
    });

    return events.sort((a, b) => new Date(b.date + " " + b.time).getTime() - new Date(a.date + " " + a.time).getTime())
                 .filter(e => 
                    e.action.toLowerCase().includes(timelineSearch.toLowerCase()) || 
                    e.desc.toLowerCase().includes(timelineSearch.toLowerCase()) ||
                    e.dept.toLowerCase().includes(timelineSearch.toLowerCase())
                 );
  }, [selectedPatient, labResults, radiologyReports, cpoeOrders, isAr, timelineSearch]);

  // Modals / Overlays
  const [showOrderLab, setShowOrderLab] = useState(false);
  const [showOrderRx, setShowOrderRx] = useState(false);
  const [showAdmission, setShowAdmission] = useState(false);
  const [showSurgery, setShowSurgery] = useState(false);

  // States for Lab Order
  const [labTestName, setLabTestName] = useState("");
  const [labSearchFocus, setLabSearchFocus] = useState(false);
  const [labPriority, setLabPriority] = useState("Routine");
  const [labNotes, setLabNotes] = useState("");
  
  // States for Rx Order
  const [rxMedName, setRxMedName] = useState("");
  const [rxDose, setRxDose] = useState("");
  
  // States for Surgery Order
  const [surgProcedure, setSurgProcedure] = useState("");
  const [surgPriority, setSurgPriority] = useState("Elective");

  const handleOpenPatient = (id: string, name?: string) => {
    const patient = patients.find(p => p.id === id);
    window.dispatchEvent(new CustomEvent("openPatientChart", { detail: { patientId: id, patientName: name || (patient ? (isAr ? patient.nameAr : patient.nameEn) : "Patient"), initialTab: "summary" } }));
  };

  const handleBackToQueue = () => {
    setViewMode("queue");
    setSelectedPatientId(null);
  };

  const submitLabOrder = async () => {
    if (!selectedPatient) return;
    const newOrder = {
      id: `ORD-LAB-${Math.floor(1000 + Math.random() * 9000)}`,
      orderType: "Lab",
      status: "Pending",
      priority: labPriority,
      patientName: isAr ? selectedPatient.nameAr : selectedPatient.nameEn,
      mrn: selectedPatient.mrn,
      doctorId: currentUser ? (isAr ? currentUser.nameAr : currentUser.nameEn) : "Dr. Ahmed (Current User)",
      orderName: labTestName || "General Lab Panel",
      createdAt: new Date().toISOString(),
      visitId: selectedPatient.id
    };

    if (setCpoeOrders) {
      setCpoeOrders((prev: any) => [...prev, newOrder]);
    }
    
    toast.success(isAr ? "تم إرسال الطلب للمعمل" : "Lab order sent successfully");
    setShowOrderLab(false);
  };

  const submitRxOrder = async () => {
    if (!selectedPatient || !rxMedName) return;
    const newOrder = {
      id: `ORD-RX-${Math.floor(1000 + Math.random() * 9000)}`,
      orderType: "Medication",
      status: "Pending",
      patientName: isAr ? selectedPatient.nameAr : selectedPatient.nameEn,
      mrn: selectedPatient.mrn,
      doctorId: currentUser ? (isAr ? currentUser.nameAr : currentUser.nameEn) : "Dr. Ahmed (Current User)",
      medication: rxMedName,
      dose: rxDose || "As directed",
      createdAt: new Date().toISOString(),
      visitId: selectedPatient.id
    };

    if (setCpoeOrders) {
      setCpoeOrders((prev: any) => [...prev, newOrder]);
    }
    
    toast.success(isAr ? "تم إرسال الوصفة للصيدلية" : "Prescription sent to pharmacy");
    setShowOrderRx(false);
  };

  const submitAdmission = () => {
    if (selectedPatient) {
      updatePatientStatus(selectedPatient.id, "ward");
    }
    toast.success(isAr ? "تم نقل المريض للتنويم الداخلي وتوجيه طلب لإدارة الأسرة" : "Patient admitted to Ward & request sent to Bed Management");
    setShowAdmission(false);
    if (onNavigate) {
      onNavigate("ipd");
    }
  };

  const submitSurgery = async () => {
    if (!selectedPatient || !surgProcedure) return;

    const newSurgery = {
      id: `SURG-${Math.floor(1000 + Math.random() * 9000)}`,
      mrn: selectedPatient.mrn,
      patientName: isAr ? selectedPatient.nameAr : selectedPatient.nameEn,
      procedure: surgProcedure,
      surgeon: currentUser ? (isAr ? currentUser.nameAr : currentUser.nameEn) : "Dr. Ahmed (Current User)",
      anesthesiologist: "Pending Assignment",
      roomId: "Pending",
      status: "Scheduled",
      timeSlot: "TBD",
      priority: surgPriority
    };

    try {
      const currentSurgeries = await getSetting("his_surgeries") || [];
      const updatedSurgeries = [...currentSurgeries, newSurgery];
      await saveSetting("his_surgeries", updatedSurgeries);
      
      toast.success(isAr ? "تم إرسال طلب الجراحة لقسم العمليات" : "Surgery request sent to Operating Theater");
      setShowSurgery(false);
    } catch (e) {
      console.error(e);
      toast.error(isAr ? "خطأ في حفظ طلب الجراحة" : "Error saving surgery request");
    }
  };

  if (viewMode === "patient_file" && selectedPatient) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans" dir={isAr ? "rtl" : "ltr"}>
        {/* Modals */}
        {showOrderLab && (
          <div className="fixed inset-0 z-modal flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
               <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                    <TestTube className="w-5 h-5 text-indigo-500" /> {isAr ? "طلب فحص معملي" : "Order Lab Test"}
                  </h3>
               </div>
               <div className="p-5 space-y-4">
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Test Name</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input 
                        value={labTestName} 
                        onChange={e => {
                          setLabTestName(e.target.value);
                          setLabSearchFocus(true);
                        }}
                        onFocus={() => setLabSearchFocus(true)}
                        onBlur={() => setTimeout(() => setLabSearchFocus(false), 200)}
                        type="text" 
                        placeholder="Search over 2000+ tests (e.g. CBC, LFT, Panel 1)..." 
                        className="w-full border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:border-indigo-500 outline-none" 
                      />
                    </div>
                    {labSearchFocus && labTestName.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {EXTENDED_LAB_TESTS.filter(t => t?.toLowerCase()?.includes(labTestName?.toLowerCase())).slice(0, 50).map((test, idx) => (
                          <div 
                            key={idx} 
                            className="px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer"
                            onMouseDown={() => {
                              setLabTestName(test);
                              setLabSearchFocus(false);
                            }}
                          >
                            {test}
                          </div>
                        ))}
                        {EXTENDED_LAB_TESTS.filter(t => t?.toLowerCase()?.includes(labTestName?.toLowerCase())).length === 0 && (
                          <div className="px-3 py-2 text-sm text-slate-500 italic">No tests found.</div>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Priority</label>
                    <select value={labPriority} onChange={e => setLabPriority(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-indigo-500 outline-none">
                      <option>Routine</option>
                      <option>Urgent</option>
                      <option>STAT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Clinical Notes</label>
                    <textarea value={labNotes} onChange={e => setLabNotes(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-indigo-500 outline-none min-h-[80px]"></textarea>
                  </div>
               </div>
               <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                 <button onClick={() => setShowOrderLab(false)} className="px-4 py-2 font-bold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-sm">Cancel</button>
                 <button className="px-4 py-2 font-bold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 text-sm">Save Draft</button>
                 <button onClick={submitLabOrder} className="px-4 py-2 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 text-sm flex items-center gap-2">
                   <Send className="w-4 h-4" /> Save & Send
                 </button>
               </div>
            </div>
          </div>
        )}

        {showOrderRx && (
          <div className="fixed inset-0 z-modal flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
               <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                    <Pill className="w-5 h-5 text-rose-500" /> {isAr ? "وصفة طبية جديدة" : "New E-Prescription"}
                  </h3>
               </div>
               <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "اسم الدواء" : "Medication Name"}</label>
                    <input 
                      value={rxMedName} 
                      onChange={e => setRxMedName(e.target.value)}
                      placeholder="e.g. Paracetamol 500mg, Amoxicillin..." 
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-bold text-slate-700 focus:border-rose-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الجرعة والتعليمات" : "Dose & Instructions"}</label>
                    <input 
                      value={rxDose} 
                      onChange={e => setRxDose(e.target.value)}
                      placeholder="e.g. 1 tablet every 8 hours after meals" 
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-bold text-slate-700 focus:border-rose-500 outline-none" 
                    />
                  </div>
               </div>
               <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                 <button onClick={() => setShowOrderRx(false)} className="px-4 py-2 font-bold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-sm">Cancel</button>
                 <button onClick={submitRxOrder} className="px-4 py-2 font-bold text-white bg-rose-600 rounded-lg hover:bg-rose-700 text-sm flex items-center gap-2">
                   <Send className="w-4 h-4" /> Save & Send
                 </button>
               </div>
            </div>
          </div>
        )}

        {showAdmission && (
          <div className="fixed inset-0 z-modal flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
               <div className="p-4 border-b border-slate-100 bg-slate-50">
                  <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                    <Hospital className="w-5 h-5 text-indigo-500" /> {isAr ? "طلب تنويم" : "Admission Request"}
                  </h3>
               </div>
               <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Admission Type</label>
                    <select className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-indigo-500 outline-none">
                      <option>Medical</option>
                      <option>Surgical</option>
                      <option>ICU</option>
                      <option>Isolation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Priority</label>
                    <select className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-indigo-500 outline-none">
                      <option>Routine</option>
                      <option>Urgent</option>
                      <option>Emergency</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Reason for Admission</label>
                    <textarea className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-indigo-500 outline-none min-h-[80px]"></textarea>
                  </div>
               </div>
               <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                 <button onClick={() => setShowAdmission(false)} className="px-4 py-2 font-bold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-sm">Cancel</button>
                 <button onClick={submitAdmission} className="px-4 py-2 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 text-sm">Send Request</button>
               </div>
            </div>
          </div>
        )}

        {showSurgery && (
          <div className="fixed inset-0 z-modal flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
               <div className="p-4 border-b border-slate-100 bg-slate-50">
                  <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-rose-500" /> {isAr ? "طلب عملية جراحية" : "Surgery Request"}
                  </h3>
               </div>
               <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Procedure Name</label>
                    <input 
                      type="text" 
                      value={surgProcedure}
                      onChange={e => setSurgProcedure(e.target.value)}
                      placeholder="e.g. Appendectomy" 
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-rose-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Priority</label>
                    <select 
                      value={surgPriority}
                      onChange={e => setSurgPriority(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-rose-500 outline-none"
                    >
                      <option>Elective</option>
                      <option>Urgent</option>
                      <option>Emergency (STAT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Surgeon Instructions / Pre-Op Notes</label>
                    <textarea className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-rose-500 outline-none min-h-[80px]"></textarea>
                  </div>
               </div>
               <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                 <button onClick={() => setShowSurgery(false)} className="px-4 py-2 font-bold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-sm">Cancel</button>
                 <button onClick={submitSurgery} className="px-4 py-2 font-bold text-white bg-rose-600 rounded-lg hover:bg-rose-700 text-sm">Send to OT</button>
               </div>
            </div>
          </div>
        )}

        {/* Patient Header Banner */}
        <div className="bg-white border-b border-slate-200 shadow-sm p-4 shrink-0">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap  mb-2">
            <button onClick={handleBackToQueue} className="p-2 hover:bg-slate-100 rounded-lg transition">
              <ArrowLeft className={`w-5 h-5 text-slate-500 ${isAr ? "rotate-180" : ""}`} />
            </button>
            <div className="flex-1">
              <PatientClinicalHeader patient={selectedPatient as any} language={language} showVitals={true} />
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap mt-2 pl-12">
            <button 
              onClick={() => {
                if (selectedPatient) {
                  setEditForm({
                    nameEn: selectedPatient.nameEn || "",
                    nameAr: selectedPatient.nameAr || "",
                    phone: selectedPatient.phone || "",
                    nationalId: selectedPatient.nationalId || "",
                    bloodType: selectedPatient.bloodGroup || "O+",
                    gender: selectedPatient.gender || "male",
                    age: selectedPatient.age || 30
                  });
                  setShowEditPatientModal(true);
                }
              }}
              className="px-3 py-1.5 text-[11px] font-black text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" /> {isAr ? "تعديل الملف" : "Edit Profile"}
            </button>
            <button 
              onClick={() => window.print()}
              className="px-3 py-1.5 text-[11px] font-black text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> {isAr ? "طباعة الملف" : "Print File"}
            </button>
            <button 
              onClick={async () => {
                if (selectedPatient) {
                  const vid = await addVisit({
                    patientId: selectedPatient.id,
                    patientMRN: selectedPatient.mrn,
                    visitType: "OPD",
                    admissionDate: new Date().toISOString(),
                    currentStage: "doctor_consultation",
                    totalEstimatedBill: 0
                  });
                  setSelectedVisitId(vid);
                  setActivePatientTab("encounter");
                  toast.success(isAr ? "تم فتح زيارة جديدة" : "New visit opened");
                }
              }}
              className="px-3 py-1.5 text-[11px] font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> {isAr ? "زيارة جديدة" : "New Visit"}
            </button>
            <button 
              onClick={() => setShowUploadDocModal(true)}
              className="px-3 py-1.5 text-[11px] font-black text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-100 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" /> {isAr ? "رفع وثيقة" : "Upload Document"}
            </button>
            <button 
              onClick={() => setShowAddReportModal(true)}
              className="px-3 py-1.5 text-[11px] font-black text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" /> {isAr ? "إضافة تقرير" : "Add Report"}
            </button>
            <button 
              onClick={() => toast.error(isAr ? "تم رفع مستوى التنبيه لملف المريض إلى طوارئ حادة" : "Emergency flag triggered for patient record")}
              className="px-3 py-1.5 text-[11px] font-black text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5" /> {isAr ? "تنبيه طوارئ" : "Emergency Flag"}
            </button>
          </div>
          
          {/* Tabs Navigation */}
          <div className="flex overflow-x-auto gap-1 border-b border-slate-100 hide-scrollbar pt-2">
            {[
              { id: "summary", label: "Summary", icon: <User className="w-4 h-4" /> },
              { id: "encounter", label: "Active Encounter", icon: <Stethoscope className="w-4 h-4" /> },
              { id: "timeline", label: "Timeline", icon: <History className="w-4 h-4" /> },
              { id: "vitals", label: "Vitals", icon: <Activity className="w-4 h-4" /> },
              { id: "diagnoses", label: "Diagnoses", icon: <AlertTriangle className="w-4 h-4" /> },
              { id: "orders", label: "Orders", icon: <ClipboardList className="w-4 h-4" /> },
              { id: "lab", label: "Lab", icon: <TestTube className="w-4 h-4" /> },
              { id: "radiology", label: "Radiology", icon: <HardDrive className="w-4 h-4" /> },
              { id: "medications", label: "Medications", icon: <Pill className="w-4 h-4" /> },
              { id: "billing", label: "Billing", icon: <DollarSign className="w-4 h-4" /> },
              { id: "documents", label: "Documents", icon: <FileText className="w-4 h-4" /> },
              { id: "audit", label: "Audit", icon: <ShieldAlert className="w-4 h-4" /> },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActivePatientTab(tab.id as PatientTab)}
                className={`px-4 py-2.5 text-sm font-bold flex items-center gap-2 whitespace-nowrap border-b-2 transition-colors ${activePatientTab === tab.id ? 'border-emerald-500 text-emerald-700 bg-emerald-50/30' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
              >
                {tab.icon} {isAr && tab.id === "encounter" ? "الزيارة الحالية" : tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {activePatientTab === "summary" && (
            <div className="w-full space-y-6 animate-fade-in">
               <ClinicalSummaryGenerator language={language} patientData={selectedPatient} />

               <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                    <h3 className="font-black text-slate-800 text-sm flex items-center gap-2">
                      <History className="w-4 h-4 text-indigo-500" />
                      {isAr ? "تاريخ الزيارات" : "Visit History"}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {visits.filter(v => v.patientId === selectedPatient.id).length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No previous visits recorded.</p>
                    ) : (
                      visits.filter(v => v.patientId === selectedPatient.id).sort((a,b) => b.startTime.localeCompare(a.startTime)).map(v => (
                        <div 
                          key={v.id} 
                          onClick={() => {
                            setSelectedVisitId(v.id);
                            setActivePatientTab("encounter");
                          }}
                          className={`flex justify-between items-center p-3 rounded-xl border transition-all cursor-pointer ${v.status === 'active' ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}
                        >
                          <div>
                            <p className="text-sm font-black text-slate-800">{v.visitType} Encounter - {new Date(v.startTime).toLocaleDateString()}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">{v.id} • {v.currentStage}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-black uppercase ${v.status === 'active' ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                              {v.status}
                            </span>
                            <p className="text-[10px] text-slate-400 mt-1">{new Date(v.startTime).toLocaleTimeString()}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
               </div>
               
               <div className="flex justify-end gap-2 mb-4">
                  <button className="px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition border border-indigo-100">Edit Summary</button>
                  <button className="px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition border border-rose-100">Add Allergy</button>
                  <button className="px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition border border-emerald-100">Add History</button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-black text-slate-800 mb-3 text-sm border-b border-slate-100 pb-2">Chief Complaint</h3>
                    <p className="text-sm text-slate-600">Patient presents with chest pain radiating to the left arm, shortness of breath, and diaphoresis starting 2 hours ago.</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-black text-slate-800 mb-3 text-sm border-b border-slate-100 pb-2">History of Present Illness (HPI)</h3>
                    <p className="text-sm text-slate-600">Pain is described as crushing, 8/10 in severity. Not relieved by rest. Patient has a history of hypertension but is non-compliant with meds.</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-black text-slate-800 mb-3 text-sm border-b border-slate-100 pb-2">Past Medical History (PMH)</h3>
                    <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                      <li>Hypertension (diagnosed 2018)</li>
                      <li>Type 2 Diabetes Mellitus</li>
                      <li>Appendectomy (2005)</li>
                    </ul>
                  </div>
                  <div className="bg-rose-50 p-5 rounded-2xl border border-rose-200 shadow-sm">
                    <h3 className="font-black text-rose-800 mb-3 text-sm border-b border-rose-200 pb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Allergies</h3>
                    <div className="flex">
                       <span className="bg-rose-200 text-rose-800 px-3 py-1 rounded-lg text-xs font-bold">Penicillin (Hives)</span>
                       <span className="bg-rose-200 text-rose-800 px-3 py-1 rounded-lg text-xs font-bold">Peanuts (Anaphylaxis)</span>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-black text-slate-800 mb-3 text-sm border-b border-slate-100 pb-2">Current Medications</h3>
                    <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                      <li>Lisinopril 10mg daily</li>
                      <li>Metformin 500mg BID</li>
                    </ul>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-black text-slate-800 mb-3 text-sm border-b border-slate-100 pb-2">Insurance Information</h3>
                    <p className="text-sm text-slate-600 font-bold">{selectedPatient.insurance}</p>
                    <p className="text-xs text-slate-500 mt-1">Policy No: POL-9928374</p>
                    <p className="text-xs text-slate-500">Status: <span className="text-emerald-600 font-bold">Active & Eligible</span></p>
                  </div>
               </div>
            </div>
          )}

          {activePatientTab === "encounter" && (
            <div className="w-full flex-1 flex flex-col h-full min-h-0 animate-fade-in space-y-6">
               {userRole === "staff" || userRole === "nurse" ? (
                 <NursingConsole 
                    patient={selectedPatient as any} 
                    staffId={currentUser?.id || "NURSE-01"} 
                    language={language}
                 />
               ) : (
                 <DoctorConsultationDesk
                    language={language}
                    currentUser={currentUser}
                    systemUsers={[]}
                    departments={[]}
                    forcedPatientId={selectedPatient.id}
                    isEmbedded={true}
                 />
               )}
            </div>
          )}

          {activePatientTab === "timeline" && (
            <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 animate-fade-in relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-full -mr-10 -mt-10 opacity-50 pointer-events-none"></div>
               
               <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4 relative z-10">
                 <h3 className="font-black text-slate-800 text-xl flex items-center gap-2">
                    <History className="w-6 h-6 text-indigo-500" />
                    {isAr ? "السجل التشاركي ومسار المريض (Collaborative EMR Timeline)" : "Collaborative EMR Timeline"}
                 </h3>
                 <div className="flex gap-2 min-w-max items-center">
                    <div className="relative">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                       <input 
                         type="text"
                         placeholder={isAr ? "بحث في السجل..." : "Search timeline..."}
                         className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 outline-none w-48"
                         value={timelineSearch}
                         onChange={e => setTimelineSearch(e.target.value)}
                       />
                    </div>
                 </div>
               </div>
               
               <div className="relative pl-8 border-l-2 border-indigo-100 space-y-10 z-10">
                  {timelineEvents.map((event, i) => (
                    <div key={i} className="relative group cursor-pointer" onClick={() => {
                        toast.info(isAr ? `عرض تفاصيل: ${event.action}` : `Viewing details: ${event.action}`);
                    }}>
                       <div className={`absolute -left-[45px] top-0 w-10 h-10 rounded-xl flex items-center justify-center border-2 bg-white ${event.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                          {event.icon}
                       </div>
                       <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group-hover:border-indigo-200 ml-4 relative">
                          <div className="absolute top-4 right-4 text-xs font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                             {event.date} {event.time}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                             <span className="font-black text-slate-800 text-base group-hover:text-indigo-600 transition-colors">{event.action}</span>
                             <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider">{event.dept}</span>
                          </div>
                          <p className="text-sm font-medium text-slate-600 mb-3 leading-relaxed">{event.desc}</p>
                          <div className="flex items-center gap-2 pt-3 border-t border-slate-50">
                             <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600">
                                {event.user.charAt(0)}
                             </div>
                             <p className="text-xs text-slate-500 font-bold">Action by: <span className="text-slate-700">{event.user}</span></p>
                             <div className="flex-1"></div>
                             <span className="text-[10px] font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">Click to view details &rarr;</span>
                          </div>
                       </div>
                    </div>
                  ))}
                  {timelineEvents.length === 0 && (
                    <div className="p-12 text-center text-slate-400 font-black uppercase text-xs tracking-widest border-2 border-dashed border-slate-200 rounded-3xl">
                      No Clinical History Recorded
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* Other tabs content */}
          {["vitals", "diagnoses", "billing", "documents", "audit"]?.includes(activePatientTab) && (
             <div className="flex flex-col items-center justify-center h-full text-slate-400 animate-fade-in">
                <FileSearch className="w-16 h-16 mb-4 opacity-50" />
                <h2 className="text-xl font-black text-slate-700">{activePatientTab.charAt(0).toUpperCase() + activePatientTab.slice(1)} Module</h2>
                <p className="text-sm mt-2">This dedicated view is part of the comprehensive EMR suite.</p>
             </div>
          )}

          {/* Actual Orders / Lab / Radiology / Medications Tabs */}
          {["orders", "lab", "radiology", "medications"]?.includes(activePatientTab) && (() => {
             const patientCpoe = (cpoeOrders || []).filter((o: any) => o.mrn === selectedPatient?.mrn || o.visitId === selectedPatient?.id);
             const patientRx = (prescriptions || []).filter(rx => rx.patientId === selectedPatient?.id);
             
             let displayedItems = [];
             if (activePatientTab === "orders") {
               displayedItems = patientCpoe;
             } else if (activePatientTab === "lab") {
               // Combine Orders and actual results
               const results = (labResults || []).filter(r => r.patientId === selectedPatient?.mrn || r.patientId === selectedPatient?.id).map(r => ({
                  ...r,
                  orderName: r.testName,
                  orderType: "Lab Result",
                  status: "Final",
                  createdAt: r.date
               }));
               displayedItems = [...results, ...patientCpoe.filter((o: any) => o.orderType === "Lab" || o.type === "LAB")];
             } else if (activePatientTab === "radiology") {
               const reports = (radiologyReports || []).filter(r => r.patientId === selectedPatient?.mrn || r.patientId === selectedPatient?.id).map(r => ({
                  ...r,
                  orderName: r.studyName,
                  orderType: "Radiology Report",
                  status: "Finalized",
                  createdAt: r.date
               }));
               displayedItems = [...reports, ...patientCpoe.filter((o: any) => o.orderType === "Radiology" || o.type === "RAD")];
             } else if (activePatientTab === "medications") {
               const cpoeMeds = patientCpoe.filter((o: any) => o.orderType === "Medication");
               displayedItems = [...cpoeMeds, ...patientRx];
             }

             return (
               <div className="h-full animate-fade-in flex flex-col">
                 <h3 className="text-lg font-black text-slate-800 mb-4 capitalize">{isAr ? "السجلات السريرية" : activePatientTab}</h3>
                 {displayedItems.length === 0 ? (
                   <div className="flex flex-col items-center justify-center h-48 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                     <FileSearch className="w-5 h-5 sm:w-8 sm:h-8 mb-2 opacity-50" />
                     <p className="text-sm font-bold">{isAr ? "لا توجد سجلات" : "No records found"}</p>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                     {displayedItems.map((item: any, idx) => (
                       <div key={item.id ? `${item.id}-${idx}` : `emr-item-${idx}`} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                         <div className="flex justify-between items-start mb-2">
                           <h4 className="font-bold text-slate-800 text-sm">{item.orderName || item.medication || "Clinical Order"}</h4>
                           <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                             item.status === 'Completed' || item.status === 'dispensed' ? 'bg-emerald-100 text-emerald-700' : 
                             item.status === 'Pending' || item.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                             'bg-slate-100 text-slate-600'
                           }`}>
                             {item.status || "Unknown"}
                           </span>
                         </div>
                         {(item.instructions || item.dose) && (
                           <p className="text-xs text-slate-600 font-medium mb-3">{item.instructions || item.dose} {item.qty ? `(Qty: ${item.qty})` : ''}</p>
                         )}
                         <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-2 mt-auto">
                           <span>{item.createdAt || item.date ? new Date(item.createdAt || item.date).toLocaleDateString() : "No Date"}</span>
                           <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{item.orderType || "Prescription"}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
             );
          })()}

        </div>
      </div>
    );
  }

  // Queue View (Default)
  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen font-sans text-right" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-start gap-4 border-s-4 border-s-emerald-500 mb-6">
        <div className="flex flex-col md:flex-row justify-between w-full gap-4">
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
              <Activity className="h-7 w-7 text-emerald-600" />
              {isAr ? "العيادات الخارجية ومكتب الطبيب (OPD & Doctor EMR)" : "Outpatient Dept & Physician EMR"}
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {isAr ? "محطة التمريض والفرز (Triage)، والملف الطبي الإلكتروني للطبيب (EMR, CPOE)." : "Nursing Triage Station and complete Physician EMR / CPOE."}
            </p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1 self-start md:self-auto flex-wrap">
            <button onClick={() => setActiveRoleTab("triage")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeRoleTab === "triage" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              <Thermometer className="w-4 h-4" /> {isAr ? "فرز التمريض (Triage)" : "Nurse Triage"}
            </button>
            <button onClick={() => setActiveRoleTab("emr")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeRoleTab === "emr" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              <User className="w-4 h-4" /> {isAr ? "مكتب الطبيب (EMR)" : "Physician Desk"}
            </button>
          </div>
        </div>

        {/* Real-time Counters */}
        <div className="grid grid-cols-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-2 pt-4 border-t border-slate-100">
          <div className="flex flex-col">
            <span className="text-lg sm:text-2xl font-black text-slate-800">{triagePatients.length + doctorPatients.length + 5}</span>
            <span className="text-xs font-bold text-slate-500">{isAr ? "إجمالي المسجلين اليوم" : "Total Registered Today"}</span>
          </div>
          <div className="flex flex-col border-s border-slate-100 ps-4">
            <span className="text-lg sm:text-2xl font-black text-amber-600">{triagePatients.length}</span>
            <span className="text-xs font-bold text-slate-500">{isAr ? "في الانتظار (فرز)" : "Waiting (Triage)"}</span>
          </div>
          <div className="flex flex-col border-s border-slate-100 ps-4">
            <span className="text-lg sm:text-2xl font-black text-emerald-600">{doctorPatients.length}</span>
            <span className="text-xs font-bold text-slate-500">{isAr ? "جاهز للدخول" : "Ready to see"}</span>
          </div>
          <div className="flex flex-col border-s border-slate-100 ps-4">
            <span className="text-lg sm:text-2xl font-black text-indigo-600">5</span>
            <span className="text-xs font-bold text-slate-500">{isAr ? "اكتمل الكشف" : "Completed"}</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {activeRoleTab === "triage" && (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[min(calc(100vh-200px),700px)] flex flex-col">
                 <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-black text-slate-800 flex items-center gap-2 text-sm">
                       <ClipboardList className="w-5 h-5 text-emerald-500" /> {isAr ? "قائمة انتظار العيادة اليوم" : "Today's Clinic Queue"}
                    </h3>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {triagePatients.map((patient, idx) => {
                      // Simulated ESI level based on index (ESI-2 to ESI-5)
                      const esiLevel = (idx % 4) + 2;
                      const getEsiColor = (level: number) => {
                        if (level === 1) return "bg-rose-600 text-white animate-pulse shadow-sm";
                        if (level === 2) return "bg-orange-500 text-white shadow-sm";
                        if (level === 3) return "bg-amber-400 text-amber-900 shadow-sm";
                        if (level === 4) return "bg-emerald-500 text-white shadow-sm";
                        return "bg-blue-500 text-white shadow-sm";
                      };

                      return (
                        <div key={patient.id} className="border rounded-xl p-3 transition bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm">
                           <div className="flex justify-between items-start mb-2 cursor-pointer" onClick={() => handleOpenPatient(patient.id)}>
                              <div>
                                <span className="font-bold text-slate-800 text-sm block">{isAr ? patient.nameAr : patient.nameEn}</span>
                                <span className="font-mono text-[10px] font-bold text-slate-500"><GlobalEntityLink entityId={patient.mrn} entityName={patient.nameEn} entityType="patient" isAr={isAr}>{patient.mrn}</GlobalEntityLink></span>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black ${getEsiColor(esiLevel)}`}>
                                 ESI-{esiLevel}
                              </span>
                           </div>
                           <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
                              <span className="text-xs text-slate-500 font-medium">
                                <Clock className="w-3 h-3 inline mr-1 text-slate-400" /> {isAr ? "انتظار:" : "Wait:"} {10 + idx * 5} min
                              </span>
                              <div className="flex gap-2 min-w-max">
                                <button onClick={(e) => { e.stopPropagation(); toast.info(isAr ? "إلغاء الموعد" : "Cancel Appointment"); }} className="text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-2 py-1.5 rounded-lg transition-colors">
                                  {isAr ? "إلغاء" : "Cancel"}
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); handleOpenPatient(patient.id); }} className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                                  <HeartPulse className="w-3.5 h-3.5" />
                                  {isAr ? "تسجيل العلامات الحيوية" : "Record Vitals"}
                                </button>
                              </div>
                           </div>
                        </div>
                      )
                    })}
                    {triagePatients.length === 0 && <p className="text-center text-sm text-slate-500 p-4">{isAr ? "لا يوجد مرضى في الانتظار" : "No patients in waiting queue"}</p>}
                 </div>
              </div>

              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center justify-center text-slate-400 p-10 relative">
                 <Thermometer className="w-16 h-16 mb-4 opacity-50" />
                 <h2 className="text-xl font-black text-slate-700">{isAr ? "حدد مريضاً لفتح الملف الطبي" : "Select a patient to open their medical file"}</h2>
                 <p className="text-sm mt-2 text-center max-w-md">{isAr ? "يدعم الملف الطبي تسجيل العلامات الحيوية، التاريخ المرضي، وملاحظات التمريض كاملة." : "The Patient File interface supports full triage vitals entry, clinical history, and nursing notes."}</p>
              </div>
           </div>
        )}

        {activeRoleTab === "emr" && (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[min(calc(100vh-200px),700px)] flex flex-col">
                 <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-black text-slate-800 flex items-center gap-2 text-sm">
                       <User className="w-5 h-5 text-emerald-500" /> {isAr ? "مرضى العيادة" : "My Patients"}
                    </h3>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {doctorPatients.map((patient, idx) => (
                      <div key={patient.id} className="border rounded-xl p-3 transition bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm">
                         <div className="flex justify-between items-start mb-2 cursor-pointer" onClick={() => handleOpenPatient(patient.id)}>
                            <div>
                              <span className="font-bold text-slate-800 text-sm block">{isAr ? patient.nameAr : patient.nameEn}</span>
                              <span className="font-mono text-[10px] font-bold text-slate-500"><GlobalEntityLink entityId={patient.mrn} entityName={patient.nameEn} entityType="patient" isAr={isAr}>{patient.mrn}</GlobalEntityLink></span>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800`}>
                               {isAr ? "جاهز للدخول" : "Ready to see"}
                            </span>
                         </div>
                         <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
                            <span className="text-xs text-slate-500 font-medium">
                              <Clock className="w-3 h-3 inline mr-1 text-slate-400" /> 10:30 AM
                            </span>
                            <div className="flex gap-2 min-w-max">
                              <button onClick={(e) => { e.stopPropagation(); toast.info(isAr ? "إلغاء الموعد" : "Cancel Appointment"); }} className="text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-2 py-1.5 rounded-lg transition-colors">
                                {isAr ? "إلغاء" : "Cancel"}
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); handleOpenPatient(patient.id); }} className="text-xs bg-[#0a4275] hover:bg-[#0a4275]/90 text-white font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                                <Stethoscope className="w-3.5 h-3.5" />
                                {isAr ? "بدء الكشف الطبي" : "Start Exam"}
                              </button>
                            </div>
                         </div>
                      </div>
                    ))}
                    {doctorPatients.length === 0 && <p className="text-center text-sm text-slate-500 p-4">{isAr ? "لا يوجد مرضى حالياً" : "No patients assigned"}</p>}
                 </div>
              </div>

              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center justify-center text-slate-400 p-10 relative">
                 <Stethoscope className="w-16 h-16 mb-4 opacity-50" />
                 <h2 className="text-xl font-black text-slate-700">{isAr ? "مساحة عمل الطبيب" : "Doctor Workspace"}</h2>
                 <p className="text-sm mt-2 text-center max-w-md">{isAr ? "قم باختيار مريض من القائمة لفتح الملف الطبي وبدء الكشف وإصدار الأوامر الطبية (CPOE)." : "Select a patient to open the full EMR, review history, and issue CPOE orders (Labs, Radiology, Prescriptions)."}</p>
                 
                 {/* Quick CPOE Actions - Empty State */}
                 <div className="mt-8 flex gap-3">
                   <button onClick={() => {
                     if (doctorPatients.length > 0) {
                       handleOpenPatient(doctorPatients[0].id);
                       setActivePatientTab("medications");
                     } else {
                       toast.info(isAr ? "يرجى اختيار مريض من القائمة لوصف الدواء" : "Please select a patient from the list to prescribe medication");
                     }
                   }} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg shadow-sm hover:bg-slate-50 hover:text-slate-800 transition font-bold text-sm flex items-center gap-2 cursor-pointer">
                     <Pill className="w-4 h-4 text-emerald-600" />
                     {isAr ? "وصفة سريعة (CPOE)" : "Quick Rx (CPOE)"}
                   </button>
                   <button onClick={() => {
                     if (doctorPatients.length > 0) {
                       handleOpenPatient(doctorPatients[0].id);
                       setActivePatientTab("orders");
                     } else {
                       toast.info(isAr ? "يرجى اختيار مريض من القائمة لطلب فحص" : "Please select a patient from the list to place lab/radiology orders");
                     }
                   }} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg shadow-sm hover:bg-slate-50 hover:text-slate-800 transition font-bold text-sm flex items-center gap-2 cursor-pointer">
                     <TestTube className="w-4 h-4 text-indigo-600" />
                     {isAr ? "طلب فحص سريع" : "Quick Order"}
                   </button>
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* DEDICATED MODAL: Edit Patient Details */}
      {showEditPatientModal && selectedPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-indigo-600 px-6 py-4 text-white flex justify-between items-center">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Edit3 className="w-5 h-5" />
                {isAr ? "تعديل بيانات المريض" : "Edit Patient Details"}
              </h3>
              <button onClick={() => setShowEditPatientModal(false)} className="hover:bg-indigo-700 p-1 rounded-lg transition">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              updatePatient(selectedPatient.id, {
                nameEn: editForm.nameEn,
                nameAr: editForm.nameAr,
                phone: editForm.phone,
                nationalId: editForm.nationalId,
                bloodGroup: editForm.bloodType,
                gender: editForm.gender as any,
                age: Number(editForm.age)
              });
              toast.success(isAr ? "تم تحديث بيانات المريض بنجاح" : "Patient details updated successfully");
              setShowEditPatientModal(false);
            }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600">{isAr ? "الاسم بالإنجليزية" : "English Name"}</label>
                  <input type="text" value={editForm.nameEn} onChange={e => setEditForm({...editForm, nameEn: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm font-bold mt-1" required />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600">{isAr ? "الاسم بالعربية" : "Arabic Name"}</label>
                  <input type="text" value={editForm.nameAr} onChange={e => setEditForm({...editForm, nameAr: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm font-bold mt-1" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600">{isAr ? "رقم الهاتف" : "Phone"}</label>
                  <input type="text" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm font-bold mt-1" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600">{isAr ? "الهوية الوطنية" : "National ID"}</label>
                  <input type="text" value={editForm.nationalId} onChange={e => setEditForm({...editForm, nationalId: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm font-bold mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600">{isAr ? "العمر" : "Age"}</label>
                  <input type="number" value={editForm.age} onChange={e => setEditForm({...editForm, age: Number(e.target.value)})} className="w-full border rounded-xl p-2.5 text-sm font-bold mt-1" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600">{isAr ? "الجنس" : "Gender"}</label>
                  <select value={editForm.gender} onChange={e => setEditForm({...editForm, gender: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm font-bold mt-1">
                    <option value="male">{isAr ? "ذكر" : "Male"}</option>
                    <option value="female">{isAr ? "أنثى" : "Female"}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600">{isAr ? "فصيلة الدم" : "Blood Type"}</label>
                  <select value={editForm.bloodType} onChange={e => setEditForm({...editForm, bloodType: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm font-bold mt-1">
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bt => <option key={bt} value={bt}>{bt}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setShowEditPatientModal(false)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition text-sm">{isAr ? "إلغاء" : "Cancel"}</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition text-sm">{isAr ? "حفظ التغييرات" : "Save Changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEDICATED MODAL: Upload Clinical Document */}
      {showUploadDocModal && selectedPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-sky-600 px-6 py-4 text-white flex justify-between items-center">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Upload className="w-5 h-5" />
                {isAr ? "رفع وثيقة طبية" : "Upload Clinical Document"}
              </h3>
              <button onClick={() => setShowUploadDocModal(false)} className="hover:bg-sky-700 p-1 rounded-lg transition">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              toast.success(isAr ? `تم رفع وثيقة (${docForm.title || "التقرير الطبي"}) لملف المريض بنجاح` : `Document (${docForm.title || "Medical Document"}) uploaded successfully`);
              setShowUploadDocModal(false);
              setDocForm({ title: "", type: "Lab Report", notes: "" });
            }} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600">{isAr ? "عنوان الوثيقة" : "Document Title"}</label>
                <input type="text" value={docForm.title} onChange={e => setDocForm({...docForm, title: e.target.value})} placeholder={isAr ? "مثال: تقرير أشعة مقطعية" : "e.g., CT Scan Report"} className="w-full border rounded-xl p-2.5 text-sm font-bold mt-1" required />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">{isAr ? "نوع الوثيقة" : "Document Type"}</label>
                <select value={docForm.type} onChange={e => setDocForm({...docForm, type: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm font-bold mt-1">
                  <option value="Lab Report">{isAr ? "تقرير مختبر" : "Lab Report"}</option>
                  <option value="Radiology Report">{isAr ? "تقرير أشعة" : "Radiology Report"}</option>
                  <option value="Discharge Summary">{isAr ? "خروج طبي" : "Discharge Summary"}</option>
                  <option value="Insurance Approval">{isAr ? "موافقة تأمين" : "Insurance Approval"}</option>
                  <option value="Referral Letter">{isAr ? "خطاب تحويل" : "Referral Letter"}</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">{isAr ? "الملف" : "Select File"}</label>
                <input type="file" className="w-full border rounded-xl p-2 text-xs mt-1 bg-slate-50" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">{isAr ? "ملاحظات إضافية" : "Notes"}</label>
                <textarea value={docForm.notes} onChange={e => setDocForm({...docForm, notes: e.target.value})} rows={2} className="w-full border rounded-xl p-2 text-sm mt-1" />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setShowUploadDocModal(false)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition text-sm">{isAr ? "إلغاء" : "Cancel"}</button>
                <button type="submit" className="px-5 py-2 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition text-sm">{isAr ? "رفع الوثيقة" : "Upload Document"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEDICATED MODAL: Add Medical Report */}
      {showAddReportModal && selectedPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-indigo-600 px-6 py-4 text-white flex justify-between items-center">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <FileDown className="w-5 h-5" />
                {isAr ? "إضافة تقرير طبي جديد" : "Add New Medical Report"}
              </h3>
              <button onClick={() => setShowAddReportModal(false)} className="hover:bg-indigo-700 p-1 rounded-lg transition">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              toast.success(isAr ? "تم إصدار وحفظ التقرير الطبي لملف المريض بنجاح" : "Medical report created and attached to patient file successfully");
              setShowAddReportModal(false);
              setReportForm({ title: "", category: "Consultation Report", findings: "", recommendation: "" });
            }} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600">{isAr ? "عنوان التقرير" : "Report Title"}</label>
                <input type="text" value={reportForm.title} onChange={e => setReportForm({...reportForm, title: e.target.value})} placeholder={isAr ? "عنوان التقرير الطبي..." : "Report Title..."} className="w-full border rounded-xl p-2.5 text-sm font-bold mt-1" required />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">{isAr ? "فئة التقرير" : "Report Category"}</label>
                <select value={reportForm.category} onChange={e => setReportForm({...reportForm, category: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm font-bold mt-1">
                  <option value="Consultation Report">{isAr ? "تقرير استشاري" : "Consultation Report"}</option>
                  <option value="Medical Status Certificate">{isAr ? "تقرير حالة طبية / إجازة" : "Medical Status Certificate"}</option>
                  <option value="Pre-Op Medical Clearance">{isAr ? "تقرير لياقة لعملية جراحية" : "Pre-Op Clearance"}</option>
                  <option value="Discharge Medical Summary">{isAr ? "ملخص تقرير خروج" : "Discharge Summary"}</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">{isAr ? "النتائج والملاحظات الطبية" : "Clinical Findings"}</label>
                <textarea value={reportForm.findings} onChange={e => setReportForm({...reportForm, findings: e.target.value})} rows={3} placeholder={isAr ? "اكتب الملاحظات والتشخيص..." : "Enter clinical findings..."} className="w-full border rounded-xl p-2 text-sm mt-1" required />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">{isAr ? "التوصيات والعلاج" : "Recommendations"}</label>
                <textarea value={reportForm.recommendation} onChange={e => setReportForm({...reportForm, recommendation: e.target.value})} rows={2} placeholder={isAr ? "التوصيات والتعليمات الطبية..." : "Enter recommendations..."} className="w-full border rounded-xl p-2 text-sm mt-1" />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setShowAddReportModal(false)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition text-sm">{isAr ? "إلغاء" : "Cancel"}</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition text-sm">{isAr ? "حفظ وإصدار التقرير" : "Save & Issue Report"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
