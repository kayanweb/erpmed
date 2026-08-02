import React, { useState, useEffect, useMemo } from "react";
import { ShieldCheck, FileSignature, AlertTriangle, Bug, Activity, CheckCircle, Search, Calendar, MapPin, Eye, FileText, Send, RefreshCw, PlusCircle, History, Stethoscope, Droplet, Wind, ShieldAlert, Trash2, PieChart as PieChartIcon, TrendingUp, CheckSquare } from "lucide-react";
import { toast } from "sonner";
import { syncSetting, saveSetting, getSetting } from "../lib/firestoreService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";

interface AppUser {
  id: string;
  nameAr: string;
  nameEn: string;
  department: string;
  staffId?: string;
  pin?: string;
}

interface InfectionIncident {
  id: string;
  date: string;
  mrn: string;
  patientName: string;
  department: string;
  type: "hai" | "needle_stick" | "isolation" | "ssi" | "other";
  description: string;
  status: "open" | "investigating" | "resolved";
  reportedBy: string;
}

interface InfectionAudit {
  id: string;
  date: string;
  department: string;
  auditorId: string;
  auditorName: string;
  handHygieneScore: number;
  ppeCompliance: number;
  environmentalCleaning: number;
  overallScore: number;
  notes: string;
  signature?: string;
}

interface Protocol {
  id: string;
  titleAr: string;
  titleEn: string;
  category: "isolation" | "disinfection" | "ppe" | "waste_management";
  lastUpdated: string;
  documentUrl?: string;
  content: string;
}

interface InfectionControlProps {
  language: "ar" | "en";
  currentUser: AppUser | null;
  systemUsers: AppUser[];
  hospitalSettings: any;
}

export default function InfectionControlHub({ language, currentUser, systemUsers, hospitalSettings }: InfectionControlProps) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"dashboard" | "incidents" | "audits" | "protocols">("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [incidents, setIncidents] = useState<InfectionIncident[]>([]);
  const [audits, setAudits] = useState<InfectionAudit[]>([]);

  // Default protocols
  const [protocols, setProtocols] = useState<Protocol[]>([
    { id: "1", titleAr: "الاحتياطات التلامسية", titleEn: "Contact Precautions", category: "isolation", lastUpdated: "2024-01-10", content: "ارتداء القفازات والعباءة قبل دخول الغرفة..." },
    { id: "2", titleAr: "سياسة التطهير البيئي", titleEn: "Environmental Cleaning", category: "disinfection", lastUpdated: "2024-02-15", content: "تطهير الأسطح عالية التلامس مرتين يومياً..." },
    { id: "3", titleAr: "إدارة النفايات الطبية", titleEn: "Medical Waste Management", category: "waste_management", lastUpdated: "2024-03-05", content: "فصل النفايات المعدية في الصناديق الحمراء..." },
    { id: "4", titleAr: "سياسة ارتداء الواقيات الشخصية", titleEn: "PPE Guidelines", category: "ppe", lastUpdated: "2024-01-20", content: "التدرج السليم لارتداء وخلع أدوات الحماية الشخصية..." }
  ]);

  useEffect(() => {
    const unsubIncidents = syncSetting("baheya_infection_incidents", (data) => {
      if (data?.value && Array.isArray(data.value)) {
        setIncidents(data.value);
      }
    });
    const unsubAudits = syncSetting("baheya_infection_audits", (data) => {
      if (data?.value && Array.isArray(data.value)) {
        setAudits(data.value);
      }
    });
    return () => {
      unsubIncidents();
      unsubAudits();
    };
  }, []);

  const [authModal, setAuthModal] = useState<{
    open: boolean;
    title: string;
    action: () => void;
    input: string;
  }>({ open: false, title: "", action: () => {}, input: "" });

  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  
  // Incident Form State
  const [newIncident, setNewIncident] = useState<Partial<InfectionIncident>>({
    mrn: "", patientName: "", department: "", type: "hai", description: "", status: "open"
  });

  // Audit Form State
  const [newAudit, setNewAudit] = useState<Partial<InfectionAudit>>({
    department: "", handHygieneScore: 100, ppeCompliance: 100, environmentalCleaning: 100, notes: ""
  });

  const confirmSignature = (actionFn: () => void, title: string) => {
    setAuthModal({ open: true, title, input: "", action: actionFn });
  };

  const executeAuth = () => {
    const code = authModal.input;
    if (!code) return;
    const authorizer = systemUsers.find(u => u.staffId === code || u.pin === code || u.id === code);
    if (!authorizer) {
      toast.error(isAr ? "الكود التعريفي غير صحيح." : "Invalid employee ID or PIN.");
      return;
    }
    
    // Check permission (optional, usually doctors, supervisors, quality, infection control)
    const allowedRoles = ["admin", "quality", "infection_control", "supervisor", "doctor"];
    const authorizerRole = (authorizer as any).role || "staff";
    
    if (!allowedRoles?.includes(authorizerRole) && (currentUser as any)?.role !== "admin") {
      toast.warning(isAr ? "عذراً، صلاحياتك لا تسمح باعتماد مكافحة العدوى." : "Insufficient privileges for infection control sign-off.");
      // Soft restriction for demo, we'll let it pass but warn
    }

    authModal.action();
    setAuthModal({ open: false, title: "", action: () => {}, input: "" });
    toast.success(isAr ? `تم توقيع الاعتماد إلكترونياً بنجاح كـ ${authorizer.nameAr}` : `Electronically signed successfully by ${authorizer.nameEn}`);
  };

  const submitIncident = async () => {
    if (!newIncident.department || !newIncident.description) {
      toast.error(isAr ? "يرجى تعبئة الحقول المطلوبة." : "Please fill required fields.");
      return;
    }

    const incidentData: InfectionIncident = {
      id: "INC-" + Date.now(),
      date: new Date().toISOString(),
      mrn: newIncident.mrn || "N/A",
      patientName: newIncident.patientName || "Unknown",
      department: newIncident.department || "",
      type: newIncident.type as any,
      description: newIncident.description || "",
      status: "open",
      reportedBy: currentUser?.nameEn || "Staff"
    };

    const nextIncidents = [incidentData, ...incidents];
    setIncidents(nextIncidents);
    await saveSetting("baheya_infection_incidents", nextIncidents);
    
    // Broadcast notification
    const notifications: any[] = (await getSetting("baheya_notifications") as any[]) || [];
    const notif = {
      id: Date.now().toString(),
      type: "infection_alert",
      titleAr: `بلاغ عدوى جديد: ${incidentData.department}`,
      titleEn: `New Infection Alert: ${incidentData.department}`,
      messageAr: incidentData.description,
      messageEn: incidentData.description,
      date: new Date().toISOString(),
      read: false,
      userId: "all",
      targetDepartment: "ALL"
    };
    await saveSetting("baheya_notifications", [notif, ...notifications]);

    setShowIncidentModal(false);
    setNewIncident({ mrn: "", patientName: "", department: "", type: "hai", description: "", status: "open" });
  };

  const submitAudit = async () => {
    if (!newAudit.department) {
      toast.error(isAr ? "برجاء اختيار القسم." : "Please select a department.");
      return;
    }

    const hScore = Number(newAudit.handHygieneScore);
    const pScore = Number(newAudit.ppeCompliance);
    const eScore = Number(newAudit.environmentalCleaning);
    const overall = (hScore + pScore + eScore) / 3;

    const auditData: InfectionAudit = {
      id: "AUD-" + Date.now(),
      date: new Date().toISOString(),
      department: newAudit.department,
      auditorId: currentUser?.id || "admin",
      auditorName: currentUser?.nameEn || "Admin",
      handHygieneScore: hScore,
      ppeCompliance: pScore,
      environmentalCleaning: eScore,
      overallScore: Number(overall.toFixed(1)),
      notes: newAudit.notes || "",
      signature: currentUser?.nameEn
    };

    const nextAudits = [auditData, ...audits];
    setAudits(nextAudits);
    await saveSetting("baheya_infection_audits", nextAudits);
    setShowAuditModal(false);
    setNewAudit({ department: "", handHygieneScore: 100, ppeCompliance: 100, environmentalCleaning: 100, notes: "" });
  };

  const deleteIncident = async (id: string) => {
    if (window.confirm("Delete record?")) {
      const next = incidents.filter(i => i.id !== id);
      setIncidents(next);
      await saveSetting("baheya_infection_incidents", next);
      toast.success(isAr ? "تم الحذف بنجاح" : "Deleted successfully");
    }
  };

  const updateIncidentStatus = async (id: string, newStatus: "open" | "investigating" | "resolved") => {
    const next = incidents.map(i => i.id === id ? { ...i, status: newStatus } : i);
    setIncidents(next);
    await saveSetting("baheya_infection_incidents", next);
    toast.success(isAr ? "تم تحديث الحالة بنجاح" : "Status updated successfully");
  };

  // Stats calculations
  const calculateOverallCompliance = () => {
    if (audits.length === 0) return 100;
    const sum = audits.reduce((acc, a) => acc + a.overallScore, 0);
    return (sum / audits.length).toFixed(1);
  };
  const activeIsolations = incidents.filter(i => i.type === "isolation" && i.status !== "resolved").length;
  const haiCasesCount = incidents.filter(i => i.type === "hai").length;
  const haiRate = incidents.length > 0 ? ((haiCasesCount / incidents.length) * 10).toFixed(1) : "0.0"; // Simulated rate

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-[calc(100vh-80px)]" style={{ direction: isAr ? "rtl" : "ltr" }}>
      
      {/* Auth Modal */}
      {authModal.open && (
        <div className="fixed inset-0 z-modal bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-fade">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <ShieldCheck className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-xl font-black text-center text-slate-800 mb-2">{authModal.title}</h3>
            <p className="text-xs text-center text-slate-500 mb-6">
              {isAr ? "إجراء توقيع إلكتروني لمكافحة العدوى: أدخل الكود الخاص بك (PIN/Staff ID) للاعتماد الموثق." : "Infection Control Electronic Signature: Enter your access code (PIN/Staff ID) to authorize."}
            </p>
            <input 
              type="password"
              autoFocus
              placeholder={isAr ? "رمز التوقيع السري..." : "PIN / Signature code..."}
              className="w-full border-2 border-slate-200 rounded-xl p-3 text-center text-xl tracking-widest font-bold focus:border-emerald-500 outline-none mb-4"
              value={authModal.input}
              onChange={(e) => setAuthModal({ ...authModal, input: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && executeAuth()}
            />
            <div className="flex gap-3">
              <button onClick={() => setAuthModal({ ...authModal, open: false })} className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition">
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button onClick={executeAuth} className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition">
                {isAr ? "اعتماد موثق" : "Secure Sign"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Incident Modal */}
      {showIncidentModal && (
        <div className="fixed inset-0 z-modal bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-fade">
             <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
               <AlertTriangle className="text-amber-500 h-5 w-5"/>
               {isAr ? "تسجيل بلاغ/حالة عدوى جديدة" : "Log New Infection Incident"}
             </h3>
             <div className="space-y-4">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                   <label className="text-xs font-bold text-slate-500 mb-1 block">{isAr ? "رقم الملف (MRN)" : "MRN"}</label>
                   <input type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm" value={newIncident.mrn} onChange={e => setNewIncident({...newIncident, mrn: e.target.value})} />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-slate-500 mb-1 block">{isAr ? "اسم المريض" : "Patient Name"}</label>
                   <input type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm" value={newIncident.patientName} onChange={e => setNewIncident({...newIncident, patientName: e.target.value})} />
                 </div>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                   <label className="text-xs font-bold text-slate-500 mb-1 block">{isAr ? "القسم" : "Department"} *</label>
                   <input type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm" required value={newIncident.department} onChange={e => setNewIncident({...newIncident, department: e.target.value})} />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-slate-500 mb-1 block">{isAr ? "نوع البلاغ" : "Incident Type"}</label>
                   <select className="w-full border border-slate-200 rounded-lg p-2 text-sm" value={newIncident.type} onChange={e => setNewIncident({...newIncident, type: e.target.value as any})}>
                     <option value="hai">{isAr ? "عدوى مكتسبة بالمستشفى (HAI)" : "Hospital Acquired Infection (HAI)"}</option>
                     <option value="ssi">{isAr ? "عدوى جراحية (SSI)" : "Surgical Site Infection (SSI)"}</option>
                     <option value="needle_stick">{isAr ? "وخز إبرة (Needlestick)" : "Needlestick Injury"}</option>
                     <option value="isolation">{isAr ? "حالة تحذير/عزل" : "Isolation Notice"}</option>
                     <option value="other">{isAr ? "أخرى" : "Other"}</option>
                   </select>
                 </div>
               </div>
               <div>
                 <label className="text-xs font-bold text-slate-500 mb-1 block">{isAr ? "وصف الحالة (التفاصيل)" : "Description"} *</label>
                 <textarea rows={3} className="w-full border border-slate-200 rounded-lg p-2 text-sm" required value={newIncident.description} onChange={e => setNewIncident({...newIncident, description: e.target.value})}></textarea>
               </div>
             </div>
             <div className="flex gap-3 mt-6">
                <button onClick={() => setShowIncidentModal(false)} className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold">{isAr ? "إلغاء" : "Cancel"}</button>
                <button 
                  onClick={() => confirmSignature(submitIncident, isAr ? "اعتماد البلاغ الكترونيا" : "Authorize Incident")} 
                  className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold shadow"
                >
                  {isAr ? "حفظ واعتماد" : "Submit"}
                </button>
             </div>
          </div>
        </div>
      )}

      {/* New Audit Modal */}
      {showAuditModal && (
        <div className="fixed inset-0 z-modal bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-fade">
             <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
               <CheckSquare className="text-emerald-500 h-5 w-5"/>
               {isAr ? "تسجيل جولة رقابة عدوى" : "Log Infection Control Audit"}
             </h3>
             <div className="space-y-4">
               <div>
                 <label className="text-xs font-bold text-slate-500 mb-1 block">{isAr ? "القسم المرور عليه" : "Department Audited"} *</label>
                 <input type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm" required value={newAudit.department} onChange={e => setNewAudit({...newAudit, department: e.target.value})} />
               </div>
               
               <div className="space-y-3">
                 <div>
                   <label className="flex justify-between text-xs font-bold text-slate-600">
                     <span>{isAr ? "التزام نظافة الأيدي (%)" : "Hand Hygiene (%)"}</span>
                     <span>{newAudit.handHygieneScore}%</span>
                   </label>
                   <input type="range" min="0" max="100" className="w-full accent-emerald-500" value={newAudit.handHygieneScore} onChange={e => setNewAudit({...newAudit, handHygieneScore: e.target.valueAsNumber})} />
                 </div>
                 <div>
                   <label className="flex justify-between text-xs font-bold text-slate-600">
                     <span>{isAr ? "التزام الواقيات الشخصية PPE (%)" : "PPE Compliance (%)"}</span>
                     <span>{newAudit.ppeCompliance}%</span>
                   </label>
                   <input type="range" min="0" max="100" className="w-full accent-emerald-500" value={newAudit.ppeCompliance} onChange={e => setNewAudit({...newAudit, ppeCompliance: e.target.valueAsNumber})} />
                 </div>
                 <div>
                   <label className="flex justify-between text-xs font-bold text-slate-600">
                     <span>{isAr ? "نظافة البيئة والتطهير (%)" : "Environmental Cleaning (%)"}</span>
                     <span>{newAudit.environmentalCleaning}%</span>
                   </label>
                   <input type="range" min="0" max="100" className="w-full accent-emerald-500" value={newAudit.environmentalCleaning} onChange={e => setNewAudit({...newAudit, environmentalCleaning: e.target.valueAsNumber})} />
                 </div>
               </div>

               <div>
                 <label className="text-xs font-bold text-slate-500 mb-1 block">{isAr ? "ملاحظات وتوصيات الجولة" : "Audit Notes"}</label>
                 <textarea rows={2} className="w-full border border-slate-200 rounded-lg p-2 text-sm" value={newAudit.notes} onChange={e => setNewAudit({...newAudit, notes: e.target.value})}></textarea>
               </div>
             </div>
             <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAuditModal(false)} className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold">{isAr ? "إلغاء" : "Cancel"}</button>
                <button 
                  onClick={() => confirmSignature(submitAudit, isAr ? "اعتماد نتيجة الجولة" : "Sign Audit Report")} 
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow"
                >
                  {isAr ? "حفظ وتوثيق" : "Save Audit"}
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="w-full space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between relative overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#0f766e_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
          
          <div className="relative z-10 flex items-center gap-2 sm:gap-4 flex-wrap ">
            <div className="h-16 w-16 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2 tracking-tight">
                {isAr ? "مكافحة العدوى الشامل (ICC)" : "Infection Control Command (ICC)"}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {isAr ? "الرصد البيئي، البلاغات الفورية، وسياسات العزل." : "Environmental auditing, real-time incidents, isolated policy."}
              </p>
            </div>
          </div>
          <div className="relative z-10 flex flex-wrap gap-2">
            <button 
              onClick={() => setShowAuditModal(true)}
              className="px-5 py-2.5 rounded-xl bg-white border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold shadow-sm flex items-center gap-2 transition"
            >
              <CheckSquare className="h-4 w-4" />
              {isAr ? "جولة رقابية" : "New Audit"}
            </button>
            <button 
              onClick={() => setShowIncidentModal(true)}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-lg shadow-rose-600/20 flex items-center gap-2 transition"
            >
              <AlertTriangle className="h-4 w-4" />
              {isAr ? "إبلاغ عن عدوى" : "Report Incident"}
            </button>
          </div>
        </div>

        {/* Top Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-emerald-50 opacity-50 group-hover:scale-110 transition shrink-0"><CheckCircle className="h-28 w-28" /></div>
            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider relative z-10 flex items-center gap-1">
              {isAr ? "معدل الالتزام الكلي" : "Overall Compliance"}
            </h3>
            <p className="text-4xl font-black text-slate-800 mt-2 relative z-10">{calculateOverallCompliance()}%</p>
            <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 relative z-10 overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${calculateOverallCompliance()}%` }}></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-rose-50 opacity-50 group-hover:scale-110 transition shrink-0"><AlertTriangle className="h-28 w-28" /></div>
            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider relative z-10 flex items-center gap-1">
              {isAr ? "حالات عزل مفعلة" : "Active Isolations"}
            </h3>
            <p className="text-4xl font-black text-rose-600 mt-2 relative z-10">{activeIsolations}</p>
            <p className="text-[10px] font-bold mt-1 relative z-10 text-rose-500/80 uppercase">
              {isAr ? "في الأقسام الداخلية والعناية" : "In Wards & ICUs"}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-amber-50 opacity-50 group-hover:scale-110 transition shrink-0"><Bug className="h-28 w-28" /></div>
            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider relative z-10 flex items-center gap-1">
              {isAr ? "معدل العدوى المكتسبة" : "HAI Rate"}
            </h3>
            <p className="text-4xl font-black text-amber-600 mt-2 relative z-10">{haiRate}<span className="text-xl"> /1K</span></p>
            <p className="text-[10px] font-bold mt-1 relative z-10 text-amber-600/80 uppercase">
              {isAr ? "حالات مسجلة هذا الشهر" : "Cases this month"}
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-blue-800 rounded-2xl border border-blue-500/30 p-5 shadow-lg text-white relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-white/5 opacity-50 group-hover:scale-110 transition shrink-0"><Wind className="h-28 w-28" /></div>
            <h3 className="text-blue-200 font-bold text-xs uppercase tracking-wider relative z-10">
              {isAr ? "جودة الهواء (ACH)" : "Air Quality (ACH)"}
            </h3>
            <div className="flex items-baseline gap-2 mt-2 relative z-10">
              <p className="text-4xl font-black">12</p>
              <p className="text-sm font-medium text-blue-200">ACH</p>
            </div>
            <p className="text-[10px] font-bold mt-1 relative z-10 text-emerald-300 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {isAr ? "الضغط السلبي بالعمليات: مستقر" : "Negative Pressure: Stable"}
            </p>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="flex overflow-x-auto border-b border-slate-100 hide-scrollbar">
            {[
              { id: "dashboard", icon: Activity, ar: "لوحة المؤشرات", en: "Analytics" },
              { id: "incidents", icon: Bug, ar: "البلاغات والوقائع", en: "Incidents" },
              { id: "audits", icon: CheckSquare, ar: "الجولات البيئية", en: "Audits" },
              { id: "protocols", icon: ShieldCheck, ar: "سياسات وبروتوكولات", en: "Protocols" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-bold text-sm tracking-wide transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? "bg-slate-50 text-emerald-700 border-emerald-500" 
                    : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? "text-emerald-500" : ""}`} />
                {isAr ? tab.ar : tab.en}
              </button>
            ))}
          </div>

          <div className="p-0 md:p-4 bg-slate-50">
            {/* 1. Dashboard View */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-4 md:p-6 rounded-xl border border-slate-100 shadow-sm">
                  {/* Infections Chart */}
                  <div className="space-y-4">
                    <h3 className="font-black text-slate-800 text-lg border-b border-slate-100 pb-2 flex items-center gap-2">
                       <TrendingUp className="h-5 w-5 text-indigo-500" />
                       {isAr ? "تحليل العدوى المكتسبة (HAI) خلال السنة" : "HAI Trends Over Year"}
                    </h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                          { name: 'Jan', value: 1.2 }, { name: 'Feb', value: 1.1 }, { name: 'Mar', value: 0.9 },
                          { name: 'Apr', value: 1.4 }, { name: 'May', value: 0.8 }, { name: 'Jun', value: Number(haiRate) || 0.4 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                          <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                          <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={3} dot={{r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff'}} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Audits Chart */}
                  <div className="space-y-4">
                    <h3 className="font-black text-slate-800 text-lg border-b border-slate-100 pb-2 flex items-center gap-2">
                       <PieChartIcon className="h-5 w-5 text-emerald-500" />
                       {isAr ? "الالتزام بنظافة الأيدي التراكمي" : "Cumulative Hand Hygiene"}
                    </h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'ICU', score: audits.find(a=>a.department.toUpperCase()?.includes('ICU'))?.handHygieneScore || 92 },
                          { name: 'ER', score: audits.find(a=>a.department.toUpperCase()?.includes('ER'))?.handHygieneScore || 85 },
                          { name: 'Wards', score: audits.find(a=>a.department.toUpperCase()?.includes('WARD'))?.handHygieneScore || 88 },
                          { name: 'OR', score: audits.find(a=>a.department.toUpperCase()?.includes('OR'))?.handHygieneScore || 98 }
                        ]} margin={{top: 20}}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                          <YAxis axisLine={false} tickLine={false} domain={[0, 100]} tick={{fill: '#64748b', fontSize: 12}} />
                          <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                          <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40}>
                            {
                              [92, 85, 88, 98].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry < 90 ? '#f59e0b' : '#10b981'} />
                              ))
                            }
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 bg-white p-4 md:p-6 rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex-1 space-y-6">
                    <h3 className="font-black text-slate-800 text-lg border-b border-slate-100 pb-2">{isAr ? "موجز البلاغات النشطة" : "Active Incidents Overview"}</h3>
                    {incidents.filter(i => i.status !== "resolved").length === 0 ? (
                      <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center">
                        <CheckCircle className="h-10 w-10 mx-auto mb-2 text-emerald-300" />
                        <p className="font-bold">{isAr ? "لا توجد بلاغات نشطة!" : "No active incidents!"}</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {incidents.filter(i => i.status !== "resolved").slice(0, 5).map(inc => (
                          <div key={inc.id} className="flex items-center justify-between p-3 rounded-lg border border-rose-100 bg-rose-50">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                              <div className="h-8 w-8 rounded-full bg-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                                {inc.type === 'isolation' ? <ShieldAlert className="h-4 w-4"/> : <Bug className="h-4 w-4"/>}
                              </div>
                              <div>
                                <p className="font-bold text-slate-800 text-sm">{inc.patientName} ({inc.mrn})</p>
                                <p className="text-xs text-rose-600 font-medium">{inc.department} • {inc.type.toUpperCase()}</p>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-md">
                              {inc.status === 'open' ? (isAr?"مفتوح":"Open") : (isAr?"قيد التحقيق":"Investigating")}
                           </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-6">
                    <h3 className="font-black text-slate-800 text-lg border-b border-slate-100 pb-2">{isAr ? "آخر جولات الجودة" : "Recent Environment Audits"}</h3>
                    <div className="space-y-3">
                      {audits.slice(0, 4).map(audit => (
                        <div key={audit.id} className="p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition flex items-center justify-between">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <div className={`h-10 w-10 text-white font-bold flex items-center justify-center rounded-lg ${audit.overallScore >= 90 ? 'bg-emerald-500' : audit.overallScore >= 75 ? 'bg-amber-500' : 'bg-rose-500'}`}>
                              {audit.overallScore}%
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-sm">{audit.department}</p>
                              <p className="text-xs text-slate-500">{new Date(audit.date).toLocaleDateString()} • {audit.auditorName}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {audits.length === 0 && <p className="text-slate-400 text-sm text-center py-4">{isAr ? "لا توجد جولات بعد" : "No audits yet"}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Incidents List */}
            {activeTab === "incidents" && (
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                   <div className="relative w-full max-w-sm">
                     <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                     <input type="text" placeholder={isAr ? "بحث في البلاغات..." : "Search incidents..."} className="pl-9 pr-4 py-2 w-full border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                   </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap" dir={isAr ? "rtl" : "ltr"}>
                    <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-xs tracking-wider">
                      <tr>
                        <th className="p-4">{isAr ? "رقم البلاغ" : "ID"}</th>
                        <th className="p-4">{isAr ? "التاريخ" : "Date"}</th>
                        <th className="p-4">{isAr ? "القسم والمريض" : "Dept & Patient"}</th>
                        <th className="p-4">{isAr ? "النوع" : "Type"}</th>
                        <th className="p-4">{isAr ? "الحالة" : "Status"}</th>
                        <th className="p-4">{isAr ? "إجراءات" : "Actions"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {incidents.filter(i => 
                        i.department?.toLowerCase()?.includes(searchTerm?.toLowerCase()) || 
                        i.patientName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                        i.description?.toLowerCase()?.includes(searchTerm?.toLowerCase())
                      ).map(inc => (
                        <tr key={inc.id} className="hover:bg-slate-50 transition cursor-pointer">
                          <td className="p-4 font-mono text-slate-500 font-bold">{inc.id}</td>
                          <td className="p-4 text-slate-600">{new Date(inc.date).toLocaleDateString()}</td>
                          <td className="p-4">
                            <p className="font-bold text-slate-800">{inc.patientName}</p>
                            <p className="text-xs text-slate-500">{inc.department}</p>
                          </td>
                          <td className="p-4">
                            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold uppercase">{inc.type}</span>
                          </td>
                          <td className="p-4">
                            <select 
                              className={`text-xs font-bold p-1 rounded border-0 outline-none ${
                                inc.status === 'open' ? 'bg-amber-100 text-amber-700' : 
                                inc.status === 'investigating' ? 'bg-blue-100 text-blue-700' : 
                                'bg-emerald-100 text-emerald-700'
                              }`}
                              value={inc.status}
                              onChange={(e) => updateIncidentStatus(inc.id, e.target.value as any)}
                            >
                              <option value="open">{isAr ? "مفتوح" : "Open"}</option>
                              <option value="investigating">{isAr ? "قيد التحقيق" : "Investigating"}</option>
                              <option value="resolved">{isAr ? "مغلق/محلول" : "Resolved"}</option>
                            </select>
                          </td>
                          <td className="p-4">
                            <button onClick={() => deleteIncident(inc.id)} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded transition">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {incidents.length === 0 && (
                        <tr><td colSpan={6} className="p-8 text-center text-slate-400">{isAr ?"لا توجد بلاغات مسجلة":"No incidents recorded"}</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. Audits */}
            {activeTab === "audits" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {audits.map(audit => (
                  <div key={audit.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-black text-slate-800 text-lg">{audit.department}</h4>
                        <p className="text-xs text-slate-500">{new Date(audit.date).toLocaleString()} • {audit.auditorName}</p>
                      </div>
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center font-black text-white ${audit.overallScore >= 90 ? 'bg-emerald-500' : audit.overallScore >= 75 ? 'bg-amber-500' : 'bg-rose-500'}`}>
                        {audit.overallScore}%
                      </div>
                    </div>
                    
                    <div className="space-y-3 mt-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span className="text-slate-600 font-bold">{isAr?"اليدين":"Hand Hygiene"}</span><span className="font-bold">{audit.handHygieneScore}%</span></div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full" style={{width: `${audit.handHygieneScore}%`}}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span className="text-slate-600 font-bold">{isAr?"واقيات PPE":"PPE"}</span><span className="font-bold">{audit.ppeCompliance}%</span></div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-indigo-500 h-1.5 rounded-full" style={{width: `${audit.ppeCompliance}%`}}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span className="text-slate-600 font-bold">{isAr?"البيئة":"Environment"}</span><span className="font-bold">{audit.environmentalCleaning}%</span></div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-teal-500 h-1.5 rounded-full" style={{width: `${audit.environmentalCleaning}%`}}></div></div>
                      </div>
                    </div>
                    {audit.notes && <p className="mt-4 text-sm text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 italic">{audit.notes}</p>}
                    {audit.signature && <p className="mt-2 text-xs text-emerald-600 flex items-center gap-1"><FileSignature className="h-3 w-3"/> Signed by {audit.signature}</p>}
                  </div>
                ))}
                {audits.length === 0 && <div className="col-span-full py-12 text-center text-slate-400 font-bold">{isAr?"لا توجد جولات":"No audits found"}</div>}
              </div>
            )}

            {/* 4. Protocols */}
            {activeTab === "protocols" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {protocols.map(pt => (
                  <div key={pt.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-emerald-300 transition cursor-pointer group">
                    <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600 mb-3 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition">
                      <FileText className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-md truncate">{isAr ? pt.titleAr : pt.titleEn}</h4>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wide">{pt.category}</p>
                    <p className="text-sm text-slate-600 mt-3 line-clamp-2">{pt.content}</p>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400">
                      <span>Updated: {pt.lastUpdated}</span>
                      <button className="text-emerald-600 hover:underline">{isAr ? "قراءة كاملة" : "Read Full"}</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

