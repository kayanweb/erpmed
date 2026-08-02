import { toast } from "sonner";
import React, { createElement, useState, useMemo } from "react";
import { GenericAddRecordModal } from "./GenericAddRecordModal";
import { 
  Users, Phone, Mail, BookOpen, AlertCircle, Search, Plus, Filter, 
  MoreVertical, LayoutDashboard, ListTodo, FileSearch, ChevronRight,
  ArrowLeft, ArrowRight, Bell, Zap, Eye, FileOutput, Printer, History,
  Calendar, ClipboardCheck, PhoneCall, MessageSquare, Trash2, Edit,
  CheckCircle2, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHIS } from "../context/HISContext";
import { GlobalEntityLink } from "./GlobalEntityLink";

export default function FrontOfficeDashboard({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { currentUser, patients } = useHIS();
  
  const [activeMainTab, setActiveMainTab] = useState<string>("dashboard");
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(null);

  const mainTabs = [
    { id: "dashboard", icon: LayoutDashboard, en: "Reception Hub", ar: "مركز الاستقبال" },
    { id: "appointments", icon: Calendar, en: "Appointments", ar: "المواعيد" },
    { id: "visitors", icon: Users, en: "Visitor Book", ar: "سجل الزوار" },
    { id: "calls", icon: PhoneCall, en: "Call Log", ar: "سجل المكالمات" },
    { id: "postal", icon: Mail, en: "Postal / Courier", ar: "البريد والطرود" },
    { id: "complaints", icon: AlertCircle, en: "Complaints", ar: "الشكاوى" },
  ];

  const receptionStats = [
    { label: isAr ? "زوار اليوم" : "Today's Visitors", value: "24", change: "+5", icon: Users, color: "indigo" },
    { label: isAr ? "مكالمات واردة" : "Incoming Calls", value: "86", change: "+12", icon: PhoneCall, color: "blue" },
    { label: isAr ? "مواعيد نشطة" : "Active Appts", value: "42", change: "+8", icon: Calendar, color: "emerald" },
    { label: isAr ? "شكاوى معلقة" : "Pending Comp", value: "2", change: "-1", icon: AlertCircle, color: "rose" },
  ];

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#f8fafc]" dir={isAr ? "rtl" : "ltr"}>
      {/* Front Office Module Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sm:py-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 shadow-sm z-30 shrink-0">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:gap-5 flex-wrap ">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-indigo-600 rounded-[22px] flex items-center justify-center shadow-xl shadow-indigo-100 border-2 border-indigo-50">
            <Users className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                {isAr ? "المكتب الأمامي والاستقبال" : "Front Office & Patient Experience"}
              </h1>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-full border border-indigo-100 uppercase tracking-widest">
                Enterprise Edition v5.1
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
              <span className="text-sm font-bold text-slate-400">{isAr ? "إدارة الزوار، المكالمات، والبريد" : "Visitor Management, Telephony & Concierge"}</span>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  {isAr ? "البوابة متصلة" : "Security Gate Linked"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
           <button className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all shadow-sm">
             <Bell className="w-6 h-6" />
           </button>
           <button className="px-6 py-3 bg-indigo-600 text-white rounded-[20px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95">
             <Plus className="w-5 h-5" />
             <span className="hidden lg:block">{isAr ? "تسجيل زائر" : "Register Visitor"}</span>
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
                  setSelectedVisitorId(null);
                }}
                className={`flex items-center gap-2 px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
                  activeMainTab === tab.id ? "text-indigo-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeMainTab === tab.id ? "text-indigo-600" : ""}`} />
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
          {selectedVisitorId ? (
             <motion.div 
               key="fo-details"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 10 }}
               className="h-full flex flex-col"
             >
                <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm z-10">
                   <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                      <button onClick={() => setSelectedVisitorId(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-500">
                        <ArrowLeft className={`w-6 h-6 ${isAr ? 'rotate-180' : ''}`} />
                      </button>
                      <div className="w-[1px] h-8 bg-slate-200" />
                      <div>
                         <h3 className="text-lg font-black text-slate-800 tracking-tight">{isAr ? "تفاصيل الزيارة" : "Visitor Record"}</h3>
                         <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{isAr ? "زائر رقم: " + selectedVisitorId : "Visitor ID: " + selectedVisitorId}</p>
                      </div>
                   </div>
                   <div className="flex gap-3">
                      <button className="px-6 py-2.5 bg-rose-50 text-rose-600 rounded-[14px] text-xs font-black uppercase tracking-widest hover:bg-rose-100 transition-all border border-rose-100">
                        {isAr ? "حظر الزائر" : "Blacklist Visitor"}
                      </button>
                      <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-[14px] text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                        {isAr ? "تسجيل خروج" : "Checkout Visitor"}
                      </button>
                   </div>
                </div>
                <div className="flex-1 p-8 overflow-y-auto no-scrollbar">
                   <div className="w-full space-y-6">
                      <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
                         <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">{isAr ? "معلومات الهوية والزيارة" : "Identity & Visit Information"}</h4>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "اسم الزائر" : "Visitor Name"}</p>
                               <p className="font-black text-slate-800">Ahmed Al-Farsi</p>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "الغرض من الزيارة" : "Purpose"}</p>
                               <p className="font-black text-slate-800">{isAr ? "زيارة مريض" : "Visiting Patient"}</p>
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
                       {receptionStats.map((stat, i) => (
                         <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                               <div className={`p-4 bg-${stat.color}-50 rounded-2xl border border-${stat.color}-100`}>
                                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                               </div>
                               <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
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
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">{isAr ? "الزوار النشطين حالياً" : "Current Active Visitors"}</h3>
                                <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{isAr ? "زوار داخل المنشأة" : "Visitors inside the facility"}</p>
                             </div>
                             <button className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all"><MoreVertical className="w-6 h-6" /></button>
                          </div>
                          <div className="space-y-4">
                             {[
                               { id: "VIS-101", name: "Sarah Ahmed", room: "Room 402", in: "10:15 AM" },
                               { id: "VIS-102", name: "Khalid Omer", room: "ICU A", in: "10:30 AM" },
                               { id: "VIS-103", name: "Muna Hassan", room: "Admin B", in: "11:00 AM" },
                             ].map((v, i) => (
                               <div key={v.id} className="group p-5 bg-slate-50 rounded-[28px] border border-slate-100 hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all flex items-center justify-between cursor-pointer" onClick={() => setSelectedVisitorId(v.id)}>
                                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:gap-5 flex-wrap ">
                                     <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-lg border border-indigo-200">
                                        <Users className="w-6 h-6" />
                                     </div>
                                     <div>
                                        <h4 className="font-black text-slate-800 text-base leading-tight">{v.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{v.id} • {v.room}</p>
                                     </div>
                                  </div>
                                  <div className="flex items-center gap-6">
                                     <div className="text-right">
                                        <span className="block text-[10px] font-black text-slate-400 uppercase">Checked In</span>
                                        <span className="text-xs font-black text-indigo-600">{v.in}</span>
                                     </div>
                                     <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>

                       <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl border border-slate-800">
                          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_20%,rgba(79,70,229,0.15),transparent)] pointer-events-none" />
                          <div>
                             <div className="flex justify-between items-start mb-10">
                                <h3 className="text-lg sm:text-2xl font-black tracking-tight leading-tight uppercase">{isAr ? "تنبيهات الاستقبال" : "Reception Alerts"}</h3>
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                                   <Zap className="w-6 h-6 text-indigo-400" />
                                </div>
                             </div>
                             <div className="space-y-6">
                                {[
                                  { msg: "Dr. Ahmed arrived", time: "2m ago", type: "info" },
                                  { msg: "Emergency Ambulance En Route", time: "Now", type: "critical" },
                                  { msg: "VIP Visit Scheduled @ 1 PM", time: "Scheduled", type: "alert" },
                                ].map((n, i) => (
                                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                                     <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{n.time}</p>
                                        <p className="font-black text-sm">{n.msg}</p>
                                     </div>
                                     <div className={`w-2 h-2 rounded-full ${n.type === 'critical' ? 'bg-rose-500 animate-pulse' : n.type === 'alert' ? 'bg-amber-500' : 'bg-indigo-500'}`} />
                                  </div>
                                ))}
                             </div>
                          </div>
                          <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg active:scale-95 mt-10">
                             {isAr ? "عرض جدول المناوبات" : "View Shift Roster"}
                          </button>
                       </div>
                    </div>
                 </motion.div>
               )}

               {["appointments", "visitors", "calls", "postal", "complaints", "search"].includes(activeMainTab) && (
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
