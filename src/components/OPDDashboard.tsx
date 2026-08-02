import React, { useState } from "react";
import { 
  Search, Plus, Calendar, Activity, Clock, Video, CreditCard, User, 
  Filter, MoreVertical, FileText, CheckCircle2, LayoutDashboard, 
  ListTodo, Users, SearchCode, BarChart3, Printer, FileDown,
  Settings, Bell, AlertCircle, TrendingUp, Users2, Timer
} from "lucide-react";
import { useHIS } from "../context/HISContext";
import { Patient } from "../types";
import { GlobalEntityLink } from "./GlobalEntityLink";
import { motion, AnimatePresence } from "motion/react";

type OPDTab = "dashboard" | "queue" | "patients" | "search" | "analytics";

export default function OPDDashboard({ language }: { language: string }) {
  const isAr = language === "ar";
  const { patients, updatePatientStatus, updatePatient, addPatient } = useHIS();
  const [activeMainTab, setActiveMainTab] = useState<OPDTab>("dashboard");
  const [activePatientTab, setActivePatientTab] = useState<"visits" | "diagnosis" | "timeline" | "live_consultation" | "billing">("visits");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newPatient, setNewPatient] = useState({ nameEn: "", nameAr: "", phone: "", gender: "Male", age: "" });

  const opdPatients = patients.filter(p => p.status === 'opd_registered' || p.status === 'opd_triage' || p.status === 'opd_doctor' || p.status === 'opd_active');
  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const filteredPatients = opdPatients.filter(
    (p) =>
      p.nameEn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameAr?.includes(searchQuery) ||
      p.mrn?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalVisits: opdPatients.length,
    waiting: opdPatients.filter(p => p.status === 'opd_registered').length,
    inProgress: opdPatients.filter(p => p.status === 'opd_triage' || p.status === 'opd_doctor').length,
    completed: 12, // sample for now
    avgWaitTime: "18m",
    revenue: "$2,450"
  };

  const handleAddPatient = async () => {
    if (!newPatient.nameEn || !newPatient.phone) return;
    const patientRecord: any = {
      id: "OPD-" + Date.now(),
      mrn: "MRN-" + Math.floor(Math.random() * 10000),
      nameEn: newPatient.nameEn,
      nameAr: newPatient.nameAr || newPatient.nameEn,
      age: Number(newPatient.age) || 30,
      gender: newPatient.gender,
      phone: newPatient.phone,
      status: "opd",
      insurance: "Cash",
      visits: [{
        id: "V-" + Date.now(),
        date: new Date().toISOString(),
        consultant: "Dr. George Brown",
        status: "waiting"
      }],
      diagnoses: [],
      bills: []
    };
    addPatient(patientRecord);
    setIsAddingNew(false);
    setNewPatient({ nameEn: "", nameAr: "", phone: "", gender: "Male", age: "" });
  };

  return (
    <div className={`flex-1 flex flex-col min-h-0 bg-slate-50 font-sans ${isAr ? "rtl" : "ltr"}`}>
      {/* Module Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between shadow-sm shrink-0 gap-4">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 shrink-0">
            <Users2 className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-black text-slate-800 truncate">{isAr ? "مركز العيادات الخارجية" : "Outpatient Center"}</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">{isAr ? "إدارة الزيارات والملفات" : "Manage Visits & Records"}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar w-full sm:w-auto">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            {[
              { id: "dashboard", label: isAr ? "لوحة التحكم" : "Dashboard", icon: LayoutDashboard },
              { id: "queue", label: isAr ? "قائمة الانتظار" : "Work Queue", icon: ListTodo },
              { id: "patients", label: isAr ? "المرضى" : "Patients", icon: Users },
              { id: "search", label: isAr ? "البحث المتقدم" : "Search", icon: SearchCode },
              { id: "analytics", label: isAr ? "التحليلات" : "Analytics", icon: BarChart3 },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveMainTab(tab.id as OPDTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeMainTab === tab.id 
                    ? "bg-white text-indigo-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 border-l border-slate-200 pl-3 ml-1">
            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Printer className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <FileDown className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsAddingNew(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              {isAr ? "مريض جديد" : "New Patient"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <AnimatePresence mode="wait">
          {activeMainTab === "dashboard" && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 overflow-y-auto p-6 space-y-6"
            >
              {/* KPI Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: isAr ? "إجمالي الزيارات" : "Total Visits", value: stats.totalVisits, icon: Users, color: "indigo", trend: "+12%" },
                  { label: isAr ? "في الانتظار" : "Waiting", value: stats.waiting, icon: Timer, color: "rose", trend: "High" },
                  { label: isAr ? "قيد المعاينة" : "In Progress", value: stats.inProgress, icon: Activity, color: "amber", trend: "Active" },
                  { label: isAr ? "متوسط الانتظار" : "Avg Wait", value: stats.avgWaitTime, icon: Clock, color: "emerald", trend: "-5m" },
                ].map((kpi, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm group hover:border-indigo-300 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-${kpi.color}-50 text-${kpi.color}-600 group-hover:scale-110 transition-transform`}>
                        <kpi.icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full bg-${kpi.color}-50 text-${kpi.color}-700`}>
                        {kpi.trend}
                      </span>
                    </div>
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">{kpi.label}</h3>
                    <div className="text-lg sm:text-2xl font-black text-slate-800 mt-1">{kpi.value}</div>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-indigo-600" />
                      {isAr ? "نشاط الزيارات الأسبوعي" : "Weekly Visit Activity"}
                    </h3>
                    <select className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg px-2 py-1 outline-none">
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                    </select>
                  </div>
                  <div className="h-64 flex items-end justify-between gap-2 px-4">
                    {[45, 60, 35, 80, 55, 90, 70].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <div 
                          className="w-full bg-slate-100 rounded-t-lg relative overflow-hidden" 
                          style={{ height: `${h}%` }}
                        >
                          <div className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">Day {i+1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-indigo-600" />
                    {isAr ? "التنبيهات العاجلة" : "Critical Alerts"}
                  </h3>
                  <div className="space-y-4">
                    {[
                      { type: "high", text: isAr ? "تأخر في انتظار مريض STAT" : "STAT Patient Waiting > 30m", time: "5m ago" },
                      { type: "medium", text: isAr ? "نقص في مخزون مستلزمات الضماد" : "Wound care supplies low stock", time: "1h ago" },
                      { type: "low", text: isAr ? "تحديث في بروتوكول مكافحة العدوى" : "Infection control update", time: "3h ago" },
                    ].map((alert, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                        <AlertCircle className={`w-4 h-4 mt-0.5 ${alert.type === 'high' ? 'text-rose-500' : alert.type === 'medium' ? 'text-amber-500' : 'text-blue-500'}`} />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{alert.text}</p>
                          <span className="text-[10px] text-slate-400 font-medium">{alert.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {(activeMainTab === "queue" || activeMainTab === "patients") && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0"
            >
              {/* Patient Sidebar List */}
              <div className="w-full md:w-80 lg:w-96 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col shrink-0 h-1/2 md:h-full">
                <div className="p-4 border-b border-slate-100 flex flex-col gap-3 shrink-0">
                  <div className="relative">
                    <Search className={`absolute ${isAr ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={isAr ? "ابحث بالاسم أو MRN..." : "Search by name or MRN..."}
                      className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-2 ${isAr ? "pr-9 pl-3" : "pl-9 pr-3"} text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                    <span>{isAr ? "النتائج:" : "Results"}: {filteredPatients.length}</span>
                    <button className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                      <Filter className="w-3 h-3" /> {isAr ? "تصفية" : "Filter"}
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                  {filteredPatients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-300">
                      <Users className="w-10 h-10 mb-2 opacity-20" />
                      <p className="text-xs font-bold">{isAr ? "لا يوجد مرضى" : "No patients found"}</p>
                    </div>
                  ) : (
                    filteredPatients.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPatientId(p.id)}
                        className={`p-3 rounded-2xl cursor-pointer transition-all border group ${
                          selectedPatient?.id === p.id
                            ? "bg-indigo-600 border-indigo-700 shadow-lg shadow-indigo-100 text-white"
                            : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className={`font-bold text-sm truncate max-w-[180px] ${selectedPatient?.id === p.id ? "text-white" : "text-slate-800"}`}>
                            <GlobalEntityLink 
                              entityId={p.id} 
                              entityName={isAr ? p.nameAr : p.nameEn} 
                              entityType="patient" 
                              isAr={isAr}
                              className={selectedPatient?.id === p.id ? "text-white hover:text-white/80" : "text-slate-800 hover:text-indigo-600"}
                            >
                              {isAr ? p.nameAr : p.nameEn}
                            </GlobalEntityLink>
                          </span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${selectedPatient?.id === p.id ? "bg-indigo-500/50 text-indigo-50" : "bg-slate-100 text-slate-500"}`}>
                            {p.mrn}
                          </span>
                        </div>
                        <div className={`flex items-center justify-between text-[10px] font-medium ${selectedPatient?.id === p.id ? "text-indigo-100" : "text-slate-500"}`}>
                          <span className="flex items-center gap-1"><User className="w-3 h-3" /> {p.gender}, {p.age}</span>
                          <span className="flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'opd_registered' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                            {p.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Detail Area */}
              <div className="flex-1 bg-slate-50 overflow-y-auto flex flex-col">
                {selectedPatient ? (
                  <>
                    <div className="bg-white border-b border-slate-200 px-6 py-6 shadow-sm sticky top-0 z-20 shrink-0">
                      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:gap-5 flex-wrap ">
                          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl border border-indigo-100 shadow-inner">
                            {selectedPatient.nameEn.substring(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight">
                              {isAr ? selectedPatient.nameAr : selectedPatient.nameEn}
                            </h2>
                            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-bold text-slate-500">
                              <span className="bg-slate-100 px-2 py-1 rounded-lg text-slate-700 border border-slate-200 uppercase tracking-widest">{selectedPatient.mrn}</span>
                              <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg border border-indigo-100">
                                <User className="w-3 h-3" /> {selectedPatient.gender}, {selectedPatient.age}
                              </span>
                              <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg border border-emerald-100">
                                {selectedPatient.insurance}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 min-w-max">
                          <button className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-2">
                            <Activity className="w-4 h-4" />
                            {isAr ? "بدء المعاينة" : "Open Encounter"}
                          </button>
                          <button className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-slate-600 rounded-xl transition-colors">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Sub Tabs */}
                      <div className="flex items-center gap-8 mt-8 -mb-6 overflow-x-auto hide-scrollbar">
                        {[
                          { id: "visits", label: isAr ? "الزيارات" : "Visits", icon: Calendar },
                          { id: "diagnosis", label: isAr ? "التشخيص" : "Diagnosis", icon: Activity },
                          { id: "timeline", label: isAr ? "التسلسل الزمني" : "Timeline", icon: Clock },
                          { id: "billing", label: isAr ? "الفواتير" : "Billing", icon: CreditCard },
                        ].map(tab => (
                          <button
                            key={tab.id}
                            onClick={() => setActivePatientTab(tab.id as any)}
                            className={`flex items-center gap-2 pb-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                              activePatientTab === tab.id 
                                ? "border-indigo-600 text-indigo-600" 
                                : "border-transparent text-slate-400 hover:text-slate-600"
                            }`}
                          >
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 w-full w-full">
                       {activePatientTab === "visits" && (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {selectedPatient.visits?.map((v: any) => (
                             <div key={v.id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-center mb-4">
                                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                                      <Calendar className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div>
                                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{isAr ? "تاريخ الزيارة" : "Visit Date"}</p>
                                      <p className="text-sm font-black text-slate-800">{new Date(v.date).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg border border-emerald-100 uppercase">
                                    {v.status}
                                  </span>
                                </div>
                                <div className="pt-4 border-t border-slate-50">
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{isAr ? "الاستشاري" : "Consultant"}</p>
                                  <p className="text-sm font-bold text-slate-700">{v.consultant}</p>
                                </div>
                             </div>
                           ))}
                         </div>
                       )}

                       {activePatientTab === "diagnosis" && (
                         <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                            <Activity className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                            <h3 className="text-lg font-black text-slate-800 mb-2">{isAr ? "لا توجد تشخيصات مسجلة" : "No Registered Diagnoses"}</h3>
                            <p className="text-sm text-slate-500 max-w-xs mx-auto mb-6">{isAr ? "ابدأ معاينة طبية لإضافة تشخيص جديد" : "Start a clinical encounter to add new diagnosis"}</p>
                            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2 rounded-xl text-sm font-bold transition-colors">
                              {isAr ? "إضافة يدوي" : "Add Manually"}
                            </button>
                         </div>
                       )}

                       {activePatientTab === "billing" && (
                         <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                               <thead className="bg-slate-50 border-b border-slate-200">
                                  <tr>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "البند" : "Service Item"}</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{isAr ? "القيمة" : "Amount"}</th>
                                  </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-50 font-bold text-slate-700 text-sm">
                                  <tr>
                                    <td className="p-4">Standard Consultation</td>
                                    <td className="p-4 text-right font-mono">$150.00</td>
                                  </tr>
                                  <tr className="bg-indigo-50/30">
                                    <td className="p-4 text-indigo-900 font-black uppercase tracking-wider">{isAr ? "الإجمالي" : "Total Balance"}</td>
                                    <td className="p-4 text-right text-indigo-700 font-black font-mono text-lg">$150.00</td>
                                  </tr>
                               </tbody>
                            </table>
                            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
                               <button className="bg-white border border-slate-300 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors">
                                 {isAr ? "طباعة الفاتورة" : "Print Invoice"}
                               </button>
                               <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100">
                                 {isAr ? "تسوية الدفع" : "Process Payment"}
                               </button>
                            </div>
                         </div>
                       )}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
                    <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mb-6 border border-slate-200 shadow-inner">
                      <Users className="w-12 h-12 text-slate-300" />
                    </div>
                    <h2 className="text-xl font-black text-slate-800">{isAr ? "اختر مريضاً للبدء" : "Select a patient to start"}</h2>
                    <p className="text-sm text-slate-500 mt-2 text-center max-w-xs">{isAr ? "يمكنك استخدام قائمة الانتظار أو البحث للعثور على ملفات المرضى" : "Use the work queue or search to find patient records"}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeMainTab === "search" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 p-8"
            >
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-black text-slate-800">{isAr ? "مركز البحث المتقدم" : "Advanced Search Center"}</h2>
                  <p className="text-slate-500 font-bold mt-2">{isAr ? "ابحث في قاعدة بيانات المرضى باستخدام معايير متعددة" : "Search the patient database with multiple criteria"}</p>
                </div>
                
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? "الاسم الكامل" : "Patient Name"}</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Enter name..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? "الرقم الطبي" : "Medical Record Number"}</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="MRN-XXXXX" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? "رقم الجوال" : "Phone Number"}</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="05XXXXXXXX" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? "تاريخ الميلاد" : "Date of Birth"}</label>
                      <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <button className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest">{isAr ? "إعادة تعيين" : "Reset Filters"}</button>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 transition-all active:scale-95 flex flex-wrap items-center gap-2 sm:gap-3">
                      <Search className="w-5 h-5" />
                      {isAr ? "بدء البحث" : "Execute Search"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeMainTab === "analytics" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 p-6"
            >
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
                <BarChart3 className="w-20 h-20 text-indigo-100 mx-auto mb-6" />
                <h2 className="text-lg sm:text-2xl font-black text-slate-800 mb-4">{isAr ? "مركز التحليلات المتقدمة" : "Advanced Analytics Hub"}</h2>
                <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">
                  {isAr ? "يتم الآن تجميع البيانات لتقديم رؤى دقيقة حول أداء العيادات ونسب الإشغال والإيرادات" : "Aggregating real-time data to provide clinical performance insights, occupancy rates, and revenue trends."}
                </p>
                <div className="flex justify-center gap-4">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" />
                  <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.3s]" />
                  <div className="w-3 h-3 bg-indigo-200 rounded-full animate-bounce [animation-delay:-.5s]" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Patient Registration Overlay */}
      <AnimatePresence>
        {isAddingNew && (
          <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingNew(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="bg-indigo-600 px-8 py-6 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black">{isAr ? "تسجيل مريض عيادة جديد" : "New Patient Registration"}</h2>
                  <p className="text-xs text-indigo-100 font-bold uppercase tracking-widest mt-1 opacity-80">{isAr ? "يرجى تعبئة البيانات الأساسية" : "Complete the identification form"}</p>
                </div>
                <button onClick={() => setIsAddingNew(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? "الاسم (انجليزي)" : "Name (English)"}</label>
                    <input type="text" value={newPatient.nameEn} onChange={e => setNewPatient({...newPatient, nameEn: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? "الاسم (عربي)" : "Name (Arabic)"}</label>
                    <input type="text" value={newPatient.nameAr} onChange={e => setNewPatient({...newPatient, nameAr: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? "رقم الجوال" : "Phone Number"}</label>
                    <input type="text" value={newPatient.phone} onChange={e => setNewPatient({...newPatient, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? "العمر" : "Age"}</label>
                      <input type="number" value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? "الجنس" : "Gender"}</label>
                      <select value={newPatient.gender} onChange={e => setNewPatient({...newPatient, gender: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button onClick={() => setIsAddingNew(false)} className="px-6 py-3 font-black text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-widest text-xs">{isAr ? "إلغاء" : "Cancel"}</button>
                <button onClick={handleAddPatient} className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-3 rounded-2xl font-black shadow-xl shadow-indigo-100 transition-all active:scale-95">{isAr ? "حفظ البيانات" : "Register Patient"}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
