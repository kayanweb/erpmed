import React, { useState } from "react";
import { Settings, Bed, Car, WashingMachine, Wrench, Shield, ThermometerSnowflake, Trash2, Zap, AlertTriangle, CheckCircle2, Clock, MapPin, Search, Filter } from "lucide-react";

interface Props {
  language: "ar" | "en";
}

export default function HospitalOperationsDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"overview" | "helpdesk" | "assets">("overview");
  
  const ops = [
    { id: "hk", title: isAr ? "النظافة" : "Housekeeping", icon: Trash2, status: "Active", alerts: 0, color: "text-emerald-600", bg: "bg-emerald-100" },
    { id: "laundry", title: isAr ? "المغسلة" : "Laundry & Linen", icon: WashingMachine, status: "Active", alerts: 1, color: "text-blue-600", bg: "bg-blue-100" },
    { id: "cssd", title: isAr ? "التعقيم (CSSD)" : "CSSD", icon: Shield, status: "Active", alerts: 0, color: "text-indigo-600", bg: "bg-indigo-100" },
    { id: "biomed", title: isAr ? "الهندسة الطبية" : "Biomedical Eng.", icon: Zap, status: "Critical", alerts: 4, color: "text-rose-600", bg: "bg-rose-100" },
    { id: "maint", title: isAr ? "الصيانة العامة" : "Maintenance", icon: Wrench, status: "Warning", alerts: 12, color: "text-amber-600", bg: "bg-amber-100" },
    { id: "transport", title: isAr ? "الإسعاف والنقل" : "Transport", icon: Car, status: "Active", alerts: 1, color: "text-sky-600", bg: "bg-sky-100" },
    { id: "dietary", title: isAr ? "المطبخ والتغذية" : "Dietary", icon: ThermometerSnowflake, status: "Active", alerts: 0, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  const tickets = [
    { id: "TKT-1042", dept: "Biomedical Eng.", issue: "MRI Scanner Chiller Failure", location: "Radiology Dept, Ground Floor", priority: "Critical", time: "15 mins ago" },
    { id: "TKT-1043", dept: "Maintenance", issue: "HVAC System Leak", location: "ICU Ward B", priority: "High", time: "1 hour ago" },
    { id: "TKT-1044", dept: "Housekeeping", issue: "Deep Cleaning Required", location: "Operating Theater 3", priority: "High", time: "2 hours ago" },
    { id: "TKT-1045", dept: "Laundry", issue: "Linen Shortage", location: "Maternity Ward", priority: "Medium", time: "3 hours ago" },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
            <Settings className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              {isAr ? "العمليات التشغيلية للمستشفى" : "Hospital Operations"}
            </h2>
            <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">
              {isAr ? "إدارة المرافق، الهندسة، النقل، والتعقيم" : "Facility, Bio-Med, CSSD, Transport"}
            </p>
          </div>
        </div>

        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === "overview" ? "bg-slate-800 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "نظرة عامة" : "Overview"}
          </button>
          <button 
            onClick={() => setActiveTab("helpdesk")}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === "helpdesk" ? "bg-slate-800 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "مركز الدعم" : "Helpdesk"}
          </button>
        </div>
      </div>

      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
             {ops.map((op, idx) => (
               <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50 transition-all cursor-pointer group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-6 relative z-10">
                     <div className={`w-12 h-12 rounded-2xl ${op.bg} flex items-center justify-center ${op.color} group-hover:scale-110 transition-transform`}>
                        <op.icon className="w-6 h-6" />
                     </div>
                     {op.alerts > 0 && (
                       <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black border border-rose-200 shadow-sm flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {op.alerts} {isAr ? "تنبيه" : "Alerts"}
                       </span>
                     )}
                  </div>
                  <h3 className="text-sm font-black text-slate-800 tracking-tight relative z-10">{op.title}</h3>
                  <div className="mt-2 flex items-center gap-1.5 relative z-10">
                     <span className={`w-2 h-2 rounded-full ${op.alerts > 3 ? 'bg-rose-500' : op.alerts > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{op.status}</p>
                  </div>
               </div>
             ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-1 sm:grid-cols-2 gap-8">
             <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 tracking-tight mb-6 flex items-center gap-2">
                   <AlertTriangle className="w-5 h-5 text-rose-500" />
                   {isAr ? "أحدث التذاكر الحرجة" : "Recent Critical Tickets"}
                </h3>
                <div className="space-y-4">
                   {tickets.map((t, i) => (
                     <div key={i} className="flex flex-col sm:flex-row justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-300 transition-colors">
                        <div>
                           <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{t.id}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                              <span className="text-[10px] font-bold text-slate-500">{t.dept}</span>
                           </div>
                           <p className="text-sm font-bold text-slate-800 mb-1">{t.issue}</p>
                           <div className="flex items-center gap-2 text-xs text-slate-500">
                              <MapPin className="w-3.5 h-3.5" />
                              {t.location}
                           </div>
                        </div>
                        <div className="mt-4 sm:mt-0 flex flex-col items-start sm:items-end justify-between">
                           <span className={`px-2 py-1 rounded border text-[10px] font-black uppercase tracking-widest ${t.priority === 'Critical' ? 'bg-rose-50 text-rose-600 border-rose-200' : t.priority === 'High' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                              {t.priority}
                           </span>
                           <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                              <Clock className="w-3 h-3" />
                              {t.time}
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] -mr-32 -mt-32" />
                <div className="relative z-10 mb-8">
                   <h3 className="text-lg sm:text-2xl font-black tracking-tight mb-2">Centralized Command</h3>
                   <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-md">
                     Monitor all facility operations, dispatch teams, and track resolution times across biomedical engineering, maintenance, and housekeeping.
                   </p>
                </div>
                
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                   <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                      <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Open Tickets</p>
                      <p className="text-3xl font-black text-white">124</p>
                   </div>
                   <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                      <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Avg Resolution</p>
                      <p className="text-3xl font-black text-emerald-400">42m</p>
                   </div>
                </div>

                <button className="relative z-10 w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2">
                   <Zap className="w-4 h-4" /> 
                   {isAr ? "رفع تذكرة دعم جديدة" : "Raise New Support Ticket"}
                </button>
             </div>
          </div>
        </>
      )}

      {activeTab === "helpdesk" && (
         <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
               <div className="relative w-full sm:max-w-xs">
                  <Search className={`absolute ${isAr ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                  <input 
                     type="text"
                     placeholder={isAr ? "بحث في التذاكر..." : "Search tickets..."}
                     className={`w-full py-2.5 bg-white border border-slate-200 rounded-xl text-sm ${isAr ? "pr-10 pl-4" : "pl-10 pr-4"} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                  />
               </div>
               <div className="flex gap-2 w-full sm:w-auto">
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                     <Filter className="w-4 h-4" />
                     {isAr ? "تصفية" : "Filter"}
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                     <Zap className="w-4 h-4" />
                     {isAr ? "تذكرة جديدة" : "New Ticket"}
                  </button>
               </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
               <div className="space-y-4">
                  {tickets.map((t, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer">
                       <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${t.priority === 'Critical' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                             <Wrench className="w-6 h-6" />
                          </div>
                          <div>
                             <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-black text-slate-800">{t.issue}</span>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${t.priority === 'Critical' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                                   {t.priority}
                                </span>
                             </div>
                             <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 font-medium">
                                <span className="font-bold text-indigo-600">{t.id}</span>
                                <span>•</span>
                                <span>{t.dept}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {t.location}</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex flex-col items-end gap-2">
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {t.time}</span>
                          <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors bg-slate-50 hover:bg-indigo-50 px-3 py-1.5 rounded-lg">
                             {isAr ? "عرض التفاصيل" : "View Details"}
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      )}
    </div>
  );
}

