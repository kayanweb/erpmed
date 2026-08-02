import { toast } from "sonner";
import React, { createElement, useState, useMemo } from "react";
import { GenericAddRecordModal } from "./GenericAddRecordModal";
import { 
  Activity, HeartPulse, ShieldAlert, LayoutDashboard, Search, FileSearch, 
  BarChart3, MoreVertical, ChevronRight, Printer, Zap, TrendingUp,
  MapPin, Phone, CheckCircle2, Siren, Thermometer, UserPlus, History, Filter,
  Stethoscope, Users, Bed, Eye, Bell, ListTodo, FileOutput, ArrowLeft, ArrowRight,
  AlertCircle, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHIS } from "../context/HISContext";
import DoctorConsultationDesk from "./DoctorConsultationDesk";
import { GlobalEntityLink } from "./GlobalEntityLink";

export default function ICUDashboard({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { currentUser, patients: contextPatients } = useHIS();
  
  const [activeMainTab, setActiveMainTab] = useState<string>("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const patients = useMemo(() => {
    return (contextPatients && Array.isArray(contextPatients))
      ? contextPatients.filter(p => p.departmentId === "icu" || (p.status as string) === "critical")
      : [];
  }, [contextPatients]);

  const mainTabs = [
    { id: "dashboard", icon: LayoutDashboard, en: "ICU Monitor", ar: "مراقبة العناية" },
    { id: "patients", icon: Users, en: "Bed List", ar: "قائمة الأسرة" },
    { id: "vitals", icon: Activity, en: "Live Vitals", ar: "المؤشرات الحيوية" },
    { id: "ventilators", icon: Wind, en: "Ventilator Sync", ar: "أجهزة التنفس" },
    { id: "tasks", icon: ListTodo, en: "Critical Tasks", ar: "المهام الحرجة" },
    { id: "search", icon: FileSearch, en: "Search Center", ar: "مركز البحث" },
    { id: "analytics", icon: BarChart3, en: "Outcomes", ar: "النتائج" },
  ];

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#f8fafc]" dir={isAr ? "rtl" : "ltr"}>
      {/* ICU Enterprise Header */}
      <div className="bg-slate-900 text-white px-8 py-6 flex items-center justify-between shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(51,65,85,0.4),transparent)] pointer-events-none" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-indigo-600 rounded-[24px] flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-white/10 animate-pulse">
            <HeartPulse className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tighter">
                {isAr ? "وحدة العناية المركزة (ICU)" : "Intensive Care Unit"}
              </h1>
              <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-black rounded-full border border-white/10 uppercase tracking-widest">
                Critical Care v4.0
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap  mt-1 text-slate-400">
               <span className="text-sm font-bold">{isAr ? "برج الرعاية الحرجة" : "Critical Care Tower"}</span>
               <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
               <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                 {patients.length} {isAr ? "مريض في العناية" : "Active Patients"}
               </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-wrap  relative z-10">
           <div className="hidden lg:flex items-center gap-6 mr-6">
              <div className="text-right">
                 <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Occupancy</span>
                 <span className="text-lg font-black text-indigo-400">84%</span>
              </div>
              <div className="w-[1px] h-10 bg-white/10" />
              <div className="text-right">
                 <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Staff Ratio</span>
                 <span className="text-lg font-black text-emerald-400">1:2</span>
              </div>
           </div>
           <button className="p-3 bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition-all">
             <Bell className="w-6 h-6 text-indigo-300" />
           </button>
           <button className="px-6 py-3 bg-indigo-600 text-white rounded-[20px] font-black uppercase tracking-widest shadow-xl shadow-indigo-900/40 hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95">
             <UserPlus className="w-5 h-5" />
             <span className="hidden xl:block">{isAr ? "قبول طارئ" : "Emergency Admit"}</span>
           </button>
        </div>
      </div>

      {/* Navigation Sub-Header */}
      <div className="bg-white border-b border-slate-200 px-2 sm:px-8 flex items-center overflow-x-auto custom-scrollbar sticky top-0 z-20 shrink-0">
         <div className="flex gap-1 sm:gap-2 min-w-max pb-1 sm:pb-0">
            {mainTabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => {
                  setActiveMainTab(tab.id);
                  setSelectedPatientId(null);
                }}
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 sm:py-5 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-all relative group ${
                  activeMainTab === tab.id ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <tab.icon className={`w-3.5 h-3.5 sm:w-4 h-4 ${activeMainTab === tab.id ? "text-indigo-600" : ""}`} />
                {isAr ? tab.ar : tab.en}
                {activeMainTab === tab.id && (
                  <motion.div  className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full" />
                )}
              </button>
            ))}
         </div>
      </div>

      {/* Workspace Area */}
      <div className="flex-1 overflow-hidden min-h-0">
        <AnimatePresence mode="wait">
          {selectedPatientId ? (
            <motion.div 
               key="icu-clinical"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 10 }}
               className="h-full flex flex-col"
            >
              <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm z-10">
                 <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                    <button 
                      onClick={() => setSelectedPatientId(null)}
                      className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-500"
                    >
                      <ArrowLeft className={`w-6 h-6 ${isAr ? 'rotate-180' : ''}`} />
                    </button>
                    <div className="w-[1px] h-8 bg-slate-200" />
                    <div>
                       <h3 className="text-lg font-black text-slate-800 tracking-tight">{isAr ? "وحدة العناية السريرية" : "ICU Clinical Desktop"}</h3>
                       <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{isAr ? "وضع المراقبة الحرجة" : "Mode: Critical Monitoring"}</p>
                    </div>
                 </div>
                 <div className="flex gap-3">
                    <button className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-[14px] text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                      {isAr ? "نقل داخلي" : "Internal Transfer"}
                    </button>
                    <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-[14px] text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                      {isAr ? "أمر خروج" : "Discharge Order"}
                    </button>
                 </div>
              </div>
              <div className="flex-1 overflow-hidden min-h-0">
                 <DoctorConsultationDesk 
                   language={language}
                   currentUser={currentUser}
                   systemUsers={[]}
                   departments={[]}
                   forcedPatientId={selectedPatientId}
                   isEmbedded={true}
                 />
              </div>
            </motion.div>
          ) : (
            <>
              {activeMainTab === "dashboard" && (
                <motion.div 
                   key="icu-monitor"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="p-3 sm:p-6 lg:p-8 h-full overflow-y-auto no-scrollbar space-y-8"
                >
                   {/* Bed Monitoring Grid (Large Cards) */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(bedNum => {
                        const patient = patients[bedNum % patients.length];
                        const isHighRisk = bedNum % 3 === 0;
                        return (
                          <div key={bedNum} className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col gap-4 relative overflow-hidden" onClick={() => setSelectedPatientId(patient?.id || null)}>
                             <div className={`absolute top-0 right-0 w-1.5 h-full ${isHighRisk ? 'bg-rose-500' : 'bg-indigo-500'}`} />
                             <div className="flex justify-between items-start">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                   <Bed className="w-6 h-6" />
                                </div>
                                <div className="text-right">
                                   <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Bed</span>
                                   <span className="text-lg sm:text-2xl font-black text-slate-900 tracking-tighter">ICU-0{bedNum}</span>
                                </div>
                             </div>

                             {patient ? (
                               <div className="space-y-4">
                                  <div>
                                     <h4 className="font-black text-slate-800 text-base leading-tight hover:text-indigo-600 transition-colors">
                                       <GlobalEntityLink 
                                         entityId={patient.id} 
                                         entityName={isAr ? patient.nameAr : patient.nameEn} 
                                         entityType="patient" 
                                         isAr={isAr}
                                       >
                                         {isAr ? patient.nameAr : patient.nameEn}
                                       </GlobalEntityLink>
                                     </h4>
                                     <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                       <GlobalEntityLink 
                                         entityId={patient.id} 
                                         entityName={isAr ? patient.nameAr : patient.nameEn} 
                                         entityType="patient" 
                                         isAr={isAr}
                                       >
                                         {patient.mrn}
                                       </GlobalEntityLink>
                                     </p>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                     <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[9px] font-black border border-slate-200 uppercase tracking-tighter">{patient.dx || 'Septic Shock'}</span>
                                     <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[9px] font-black border border-indigo-100 uppercase tracking-tighter">Ventilated</span>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                     <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-center">
                                        <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">MAP</span>
                                        <span className={`text-sm font-black font-mono ${isHighRisk ? 'text-rose-600' : 'text-slate-700'}`}>62</span>
                                     </div>
                                     <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-center">
                                        <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">FiO2</span>
                                        <span className="text-sm font-black font-mono text-slate-700">40%</span>
                                     </div>
                                  </div>
                               </div>
                             ) : (
                               <div className="flex-1 flex flex-col items-center justify-center py-8 opacity-30 grayscale">
                                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center mb-2">
                                     <Plus className="w-4 h-4" />
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available Bed</span>
                               </div>
                             )}
                             
                             {patient && (
                               <div className="mt-2 pt-4 border-t border-slate-50 flex justify-between items-center">
                                  <div className="flex gap-1.5">
                                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                     <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                               </div>
                             )}
                          </div>
                        );
                      })}
                   </div>

                   {/* ICU KPI / Stats */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm flex flex-col justify-between">
                         <div className="flex justify-between items-start mb-10">
                            <div>
                               <h3 className="text-xl font-black text-slate-900 tracking-tight">{isAr ? "كفاءة المخرجات" : "Outcome Efficiency"}</h3>
                               <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{isAr ? "مؤشرات جودة الرعاية" : "Care Quality Indicators"}</p>
                            </div>
                            <div className="p-4 bg-indigo-50 rounded-[24px] border border-indigo-100">
                               <TrendingUp className="w-5 h-5 sm:w-8 sm:h-8 text-indigo-600" />
                            </div>
                         </div>
                         <div className="space-y-8">
                            {[
                              { label: isAr ? "متوسط مدة الإقامة" : "Avg LOS", value: "4.2 Days", trend: "-12%", up: false },
                              { label: isAr ? "معدل عدوى الأجهزة" : "CLABSI Rate", value: "0.2/1k", trend: "-8%", up: false },
                              { label: isAr ? "معدل نجاح الفطام" : "Weaning Success", value: "91%", trend: "+5%", up: true },
                            ].map((stat, i) => (
                              <div key={i} className="flex items-center justify-between">
                                 <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                    <p className="text-xl font-black text-slate-800 tracking-tight">{stat.value}</p>
                                 </div>
                                 <div className={`px-4 py-2 rounded-2xl text-xs font-black tracking-widest ${stat.up ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                                    {stat.trend}
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>

                      <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
                         <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_20%,rgba(79,70,229,0.3),transparent)] pointer-events-none" />
                         <div className="relative z-10">
                            <h3 className="text-xl font-black tracking-tight mb-2 uppercase">{isAr ? "نظام الإنذار الذكي" : "Smart Alert System"}</h3>
                            <p className="text-slate-400 font-bold text-sm mb-10 max-w-xs">{isAr ? "مراقبة آنية لمؤشرات التدهور السريري" : "Real-time monitoring of clinical deterioration indicators"}</p>
                            <div className="space-y-4">
                               <div className="p-5 bg-white/5 border border-white/10 rounded-[28px] flex items-center justify-between">
                                  <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                                     <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center text-rose-500 border border-rose-500/20">
                                        <AlertCircle className="w-5 h-5" />
                                     </div>
                                     <div>
                                        <p className="text-xs font-black tracking-widest uppercase mb-0.5">High Vasoactive Dose</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bed ICU-02</p>
                                     </div>
                                  </div>
                                  <button className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">Review</button>
                               </div>
                               <div className="p-5 bg-white/5 border border-white/10 rounded-[28px] flex items-center justify-between">
                                  <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                                     <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 border border-amber-500/20">
                                        <Activity className="w-5 h-5" />
                                     </div>
                                     <div>
                                        <p className="text-xs font-black tracking-widest uppercase mb-0.5">Low Urine Output</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bed ICU-05</p>
                                     </div>
                                  </div>
                                  <button className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">Review</button>
                               </div>
                            </div>
                         </div>
                         <button className="relative z-10 mt-10 w-full py-5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-[24px] font-black uppercase tracking-[0.2em] transition-all text-[10px]">
                            {isAr ? "عرض جميع التنبيهات" : "View All Smart Alerts"}
                         </button>
                      </div>
                   </div>
                </motion.div>
              )}

              {["patients", "vitals", "ventilators", "tasks", "search", "analytics"].includes(activeMainTab) && (
                <motion.div 
                  key="placeholder-fix"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 sm:p-6 lg:p-8 h-full overflow-y-auto"
                >
                    
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div>
                    <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">
                        {isAr ? "إدارة " + (mainTabs.find(t => t.id === activeMainTab)?.ar || "") : (mainTabs.find(t => t.id === activeMainTab)?.en || "") + " Management"}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 mt-1">
                        {isAr ? "واجهة التحكم المخصصة" : "Dedicated Control Interface"}
                    </p>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">
                    {isAr ? "إضافة سجل جديد" : "Add New Record"}
                </button>
            </div>
            <div className="p-0 flex-1 overflow-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "المعرف" : "ID"}</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "التاريخ" : "Date"}</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "التفاصيل" : "Details"}</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "الحالة" : "Status"}</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{isAr ? "إجراء" : "Action"}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr>
                            <td colSpan={5} className="p-12 text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center mb-4 text-slate-300">
                                        <Filter className="w-8 h-8" />
                                    </div>
                                    <h4 className="font-black text-slate-700 text-lg mb-1">{isAr ? "لا توجد بيانات حالياً" : "No data available"}</h4>
                                    <p className="text-sm font-bold text-slate-400">{isAr ? "لم يتم العثور على سجلات في هذا القسم" : "No records found in this section"}</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const Wind = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
  </svg>
);
