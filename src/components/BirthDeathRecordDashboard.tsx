import { toast } from "sonner";
import React, { createElement, useState, useMemo } from "react";
import { GenericAddRecordModal } from "./GenericAddRecordModal";
import { 
  Baby, FileText, Search, Plus, Filter, Activity, FileDigit,
  LayoutDashboard, ListTodo, FileSearch, ChevronRight, ArrowLeft,
  ArrowRight, Bell, Zap, Eye, FileOutput, Printer, History,
  ShieldCheck, HeartPulse, ClipboardCheck, ScrollText, MoreVertical
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHIS } from "../context/HISContext";

export default function BirthDeathRecordDashboard({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { currentUser } = useHIS();
  
  const [activeMainTab, setActiveMainTab] = useState<string>("dashboard");
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const mainTabs = [
    { id: "dashboard", icon: LayoutDashboard, en: "Vital Stats Center", ar: "مركز الإحصاءات الحيوية" },
    { id: "birth", icon: Baby, en: "Birth Registry", ar: "سجل المواليد" },
    { id: "death", icon: FileDigit, en: "Death Registry", ar: "سجل الوفيات" },
    { id: "certificates", icon: ScrollText, en: "Digital Certificates", ar: "الشهادات الرقمية" },
    { id: "reports", icon: FileOutput, en: "Vitals Analytics", ar: "تحليلات الحيوية" },
    { id: "search", icon: FileSearch, en: "Registry Search", ar: "بحث السجلات" },
  ];

  const vitalStats = [
    { label: isAr ? "مواليد الشهر" : "Births This Month", value: "142", change: "+12%", icon: Baby, color: "pink" },
    { label: isAr ? "وفيات الشهر" : "Deaths This Month", value: "12", change: "-2%", icon: FileDigit, color: "slate" },
    { label: isAr ? "شهادات معلقة" : "Pending Certs", value: "4", change: "Urgent", icon: ScrollText, color: "amber" },
    { label: isAr ? "معدل الخصوبة" : "Vitality Index", value: "98.2", change: "+0.4", icon: HeartPulse, color: "rose" },
  ];

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#f8fafc]" dir={isAr ? "rtl" : "ltr"}>
      {/* Vital Records Module Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sm:py-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 shadow-sm z-30 shrink-0">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:gap-5 flex-wrap ">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-pink-600 rounded-[22px] flex items-center justify-center shadow-xl shadow-pink-100 border-2 border-pink-50">
            <Baby className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                {isAr ? "سجل الأحوال الحيوية والمدنية" : "Vital Statistics & Civil Registry"}
              </h1>
              <span className="px-3 py-1 bg-pink-50 text-pink-700 text-[10px] font-black rounded-full border border-pink-100 uppercase tracking-widest">
                Official Registry v6.0
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
              <span className="text-sm font-bold text-slate-400">{isAr ? "توثيق المواليد، الوفيات، والشهادات الطبية" : "Documentation of Births, Deaths & Medical Certification"}</span>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  {isAr ? "مرتبط بوزارة الصحة" : "MOH Registry Sync Active"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
           <button className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-pink-600 rounded-2xl transition-all shadow-sm">
             <Bell className="w-6 h-6" />
           </button>
           <button className="px-6 py-3 bg-pink-600 text-white rounded-[20px] font-black uppercase tracking-widest shadow-xl shadow-pink-100 hover:bg-pink-700 transition-all flex items-center gap-2 active:scale-95">
             <Plus className="w-5 h-5 text-pink-200" />
             <span className="hidden lg:block">{isAr ? "تسجيل واقعة" : "Register Event"}</span>
           </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 px-2 sm:px-8 flex items-center overflow-x-auto custom-scrollbar sticky top-0 z-20 shrink-0">
         <div className="flex gap-2 min-w-max">
            {mainTabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => {
                  setActiveMainTab(tab.id);
                  setSelectedRecordId(null);
                }}
                className={`flex items-center gap-2 px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
                  activeMainTab === tab.id ? "text-pink-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeMainTab === tab.id ? "text-pink-600" : ""}`} />
                {isAr ? tab.ar : tab.en}
                {activeMainTab === tab.id && (
                  <motion.div  className="absolute bottom-0 left-0 w-full h-1 bg-pink-600 rounded-t-full" />
                )}
              </button>
            ))}
         </div>
      </div>

      {/* Workspace Area */}
      <div className="flex-1 overflow-hidden min-h-0">
        <AnimatePresence mode="wait">
          {selectedRecordId ? (
             <motion.div 
               key="vitals-details"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 10 }}
               className="h-full flex flex-col"
             >
                <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm z-10">
                   <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                      <button onClick={() => setSelectedRecordId(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-500">
                        <ArrowLeft className={`w-6 h-6 ${isAr ? 'rotate-180' : ''}`} />
                      </button>
                      <div className="w-[1px] h-8 bg-slate-200" />
                      <div>
                         <h3 className="text-lg font-black text-slate-800 tracking-tight">{isAr ? "تفاصيل الواقعة الحيوية" : "Vital Event Record"}</h3>
                         <p className="text-[10px] font-black text-pink-600 uppercase tracking-widest">{isAr ? "رقم القيد: " + selectedRecordId : "Record ID: " + selectedRecordId}</p>
                      </div>
                   </div>
                   <div className="flex gap-3">
                      <button className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-[14px] text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                        {isAr ? "عرض الملف الطبي" : "View Clinical Chart"}
                      </button>
                      <button className="px-6 py-2.5 bg-pink-600 text-white rounded-[14px] text-xs font-black uppercase tracking-widest shadow-lg shadow-pink-100 hover:bg-pink-700 transition-all">
                        {isAr ? "إصدار الشهادة" : "Issue Certificate"}
                      </button>
                   </div>
                </div>
                <div className="flex-1 p-8 overflow-y-auto no-scrollbar">
                   <div className="w-full space-y-6">
                      <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
                         <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">{isAr ? "المعلومات السجلية" : "Registry Information"}</h4>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "اسم الأب/الأم" : "Parent Information"}</p>
                               <p className="font-black text-slate-800">Sarah Mohammed Al-Said</p>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "تاريخ الواقعة" : "Event Date"}</p>
                               <p className="font-black text-slate-800">24 Oct 2023, 08:30 AM</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>
          ) : (
            <div className="h-full overflow-y-auto no-scrollbar p-3 sm:p-6 lg:p-8">
               {activeMainTab === "dashboard" && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                       {vitalStats.map((stat, i) => (
                         <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                               <div className={`p-4 bg-${stat.color}-50 rounded-2xl border border-${stat.color}-100`}>
                                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                               </div>
                               <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : stat.change === 'Urgent' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'}`}>
                                 {stat.change}
                               </span>
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                               <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{stat.value}</h3>
                            </div>
                         </div>
                       ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                       <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-200 shadow-sm p-10">
                          <div className="flex justify-between items-center mb-10">
                             <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">{isAr ? "سجل الوقائع الأخيرة" : "Recent Vital Events"}</h3>
                                <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{isAr ? "مواليد ووفيات تم تسجيلها اليوم" : "Births and deaths registered today"}</p>
                             </div>
                             <button className="p-3 bg-slate-50 text-slate-400 hover:text-pink-600 rounded-2xl transition-all"><MoreVertical className="w-6 h-6" /></button>
                          </div>
                          <div className="space-y-4">
                             {[
                               { id: "BR-201", type: "Birth", name: "Baby Boy Ahmed", time: "08:15 AM", status: "Certified" },
                               { id: "BR-202", type: "Birth", name: "Baby Girl Noor", time: "10:30 AM", status: "Pending" },
                               { id: "DR-501", type: "Death", name: "Omer Salim (Adult)", time: "11:00 AM", status: "Certified" },
                             ].map((ev, i) => (
                               <div key={ev.id} className="group p-5 bg-slate-50 rounded-[28px] border border-slate-100 hover:bg-white hover:shadow-xl hover:border-pink-100 transition-all flex items-center justify-between cursor-pointer" onClick={() => setSelectedRecordId(ev.id)}>
                                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:gap-5 flex-wrap ">
                                     <div className={`w-12 h-12 ${ev.type === 'Birth' ? 'bg-pink-100 text-pink-600' : 'bg-slate-200 text-slate-600'} rounded-2xl flex items-center justify-center font-black text-lg border border-slate-200`}>
                                        {ev.type === 'Birth' ? <Baby className="w-6 h-6" /> : <FileDigit className="w-6 h-6" />}
                                     </div>
                                     <div>
                                        <h4 className="font-black text-slate-800 text-base leading-tight">{ev.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{ev.id} • {ev.type} • {ev.time}</p>
                                     </div>
                                  </div>
                                  <div className="flex items-center gap-6">
                                     <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${ev.status === 'Certified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                       {ev.status}
                                     </span>
                                     <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" />
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>

                       <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl border border-slate-800">
                          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_20%,rgba(219,39,119,0.15),transparent)] pointer-events-none" />
                          <div>
                             <div className="flex justify-between items-start mb-10">
                                <h3 className="text-lg sm:text-2xl font-black tracking-tight leading-tight uppercase">{isAr ? "رؤى النمو السكاني" : "Demographic Insights"}</h3>
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                                   <Binary className="w-6 h-6 text-pink-400" />
                                </div>
                             </div>
                             <div className="space-y-6">
                                {[
                                  { label: "Survival Rate", val: "99.2%", color: "emerald" },
                                  { label: "Certification Speed", val: "2.4h", color: "blue" },
                                  { label: "Registry Compliance", val: "100%", color: "pink" },
                                ].map((m, i) => (
                                  <div key={i} className="space-y-2">
                                     <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{m.label}</span>
                                        <span className={`text-xs font-black text-${m.color}-400`}>{m.val}</span>
                                     </div>
                                     <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full bg-${m.color}-500 w-[90%]`} />
                                     </div>
                                  </div>
                                ))}
                             </div>
                          </div>
                          <button className="w-full py-4 bg-pink-600 hover:bg-pink-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg active:scale-95 mt-10">
                             {isAr ? "تصدير السجل المدني" : "Export Civil Registry"}
                          </button>
                       </div>
                    </div>
                 </motion.div>
               )}

               {["birth", "death", "certificates", "reports", "search"].includes(activeMainTab) && (
                 <div className="h-full p-8">
                    
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
    
                 </div>
               )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const Binary = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="8" height="8" x="2" y="2" rx="2" />
    <path d="M14 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2" />
    <path d="M20 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2" />
    <path d="M14 14c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2" />
    <path d="M20 14c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2" />
    <rect width="8" height="8" x="2" y="14" rx="2" />
  </svg>
);
