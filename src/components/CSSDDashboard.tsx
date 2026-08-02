import React, { useState } from "react";
import { 
  ShieldCheck, ArrowRightLeft, PackageCheck, Layers, LayoutDashboard, 
  Wind, Thermometer, ShieldAlert, BadgeCheck, Zap, History, Search, 
  PlayCircle, RefreshCcw, Droplets, Timer, CheckCircle2, AlertTriangle, ChevronRight, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function CSSDDashboard({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const tabs = [
    { id: "dashboard", icon: LayoutDashboard, en: "Command Center", ar: "مركز القيادة" },
    { id: "decontamination", icon: Droplets, en: "Decontamination", ar: "التطهير والغسيل" },
    { id: "assembly", icon: Layers, en: "Assembly & Packing", ar: "التجميع والتغليف" },
    { id: "sterilization", icon: Wind, en: "Sterilization (Autoclaves)", ar: "التعقيم (الأوتوكلاف)" },
    { id: "dispatch", icon: ArrowRightLeft, en: "Dispatch / Distribution", ar: "التوزيع والإرسال" }
  ];

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#f8fafc]" dir={isAr ? "rtl" : "ltr"}>
      {/* Module Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm z-30 shrink-0">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:gap-5 flex-wrap ">
           <div className="w-10 h-10 sm:w-14 sm:h-14 bg-indigo-900 rounded-[22px] flex items-center justify-center shadow-xl shadow-indigo-100 border-2 border-indigo-800 shrink-0">
             <ShieldCheck className="w-5 h-5 sm:w-8 sm:h-8 text-indigo-400" />
           </div>
           <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                 <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
                   {isAr ? "التعقيم المركزي (CSSD)" : "Central Sterile Services"}
                 </h1>
                 <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-full border border-indigo-100 uppercase tracking-widest">
                   Operational Unit
                 </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                 <span className="text-sm font-bold text-slate-400">{isAr ? "إدارة تعقيم وتتبع الأدوات الجراحية" : "Surgical Instrument Processing & Tracking"}</span>
                 <div className="w-1 h-1 bg-slate-300 rounded-full" />
                 <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Integration</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
           <button className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2">
             <Plus className="w-5 h-5" />
             <span>{isAr ? "استلام حاوية" : "Receive Container"}</span>
           </button>
        </div>
      </div>

      {/* Navigation Ribbon */}
      <div className="bg-white border-b border-slate-200 px-2 sm:px-8 flex items-center overflow-x-auto custom-scrollbar sticky top-0 z-20 overflow-x-auto no-scrollbar shrink-0">
         <div className="flex gap-2 min-w-max">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
                  activeTab === tab.id ? "text-indigo-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-indigo-600" : ""}`} />
                {isAr ? tab.ar : tab.en}
                {activeTab === tab.id && (
                  <motion.div 
                    
                    className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"
                  />
                )}
              </button>
            ))}
         </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3 sm:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && <CSSDOverview isAr={isAr} />}
          {activeTab === "decontamination" && <DeconWorkspace isAr={isAr} />}
          {activeTab === "assembly" && <AssemblyWorkspace isAr={isAr} />}
          {activeTab === "sterilization" && <SterilizationWorkspace isAr={isAr} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CSSDOverview({ isAr }: { isAr: boolean }) {
  const statCards = [
    { label: isAr ? "قيد المعالجة" : "In Processing", value: "24", icon: RefreshCcw, color: "amber", trend: "+2" },
    { label: isAr ? "معقمة جاهزة" : "Sterile Ready", value: "115", icon: ShieldCheck, color: "emerald", trend: "Normal" },
    { label: isAr ? "دورات الأوتوكلاف" : "Active Cycles", value: "3", icon: Wind, color: "indigo", trend: "Live" },
    { label: isAr ? "طلبات مستعجلة" : "Urgent Requests", value: "2", icon: Zap, color: "rose", trend: "Immediate" }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
               <div className={`p-4 bg-${stat.color}-50 rounded-2xl border border-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
               </div>
               <span className={`text-[10px] font-black px-2 py-1 bg-${stat.color === 'rose' ? 'rose' : 'emerald'}-50 text-${stat.color === 'rose' ? 'rose' : 'emerald'}-600 rounded-lg`}>{stat.trend}</span>
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
               <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
         <div className="bg-white border border-slate-200 rounded-[40px] shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase flex flex-wrap items-center gap-2 sm:gap-3">
                <Wind className="w-5 h-5 text-indigo-600" />
                {isAr ? "مراقبة الأجهزة" : "Device Monitoring"}
              </h2>
            </div>
            <div className="p-8 space-y-4">
               {[
                 { id: "AC-01", status: "Running", cycle: "Sterilizing", progress: 75, time: "12m left" },
                 { id: "AC-02", status: "Idle", cycle: "Ready", progress: 0, time: "-" },
                 { id: "WS-01", status: "Running", cycle: "Thermal Disinfection", progress: 40, time: "25m left" }
               ].map(device => (
                 <div key={device.id} className="p-5 border border-slate-100 rounded-2xl hover:border-indigo-100 transition-all">
                    <div className="flex justify-between items-center mb-3">
                       <span className="text-sm font-black text-slate-800">{device.id}</span>
                       <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${device.status === 'Running' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                         {device.status}
                       </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                       <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${device.progress}%` }} />
                       </div>
                       <span className="text-[10px] font-black text-slate-400 uppercase">{device.time}</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-white border border-slate-200 rounded-[40px] shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase flex flex-wrap items-center gap-2 sm:gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                {isAr ? "تنبيهات حرجة" : "Critical Alerts"}
              </h2>
            </div>
            <div className="p-8 space-y-4">
               {[
                 { msg: "Chemical Indicator Failure - Batch 402", time: "2m ago", type: "error" },
                 { msg: "OR Room 2 requesting Urgent Set #82", time: "15m ago", type: "warning" }
               ].map((alert, i) => (
                 <div key={i} className={`p-5 border ${alert.type === 'error' ? 'border-rose-100 bg-rose-50/30' : 'border-amber-100 bg-amber-50/30'} rounded-2xl flex items-center gap-4`}>
                    <div className={`p-3 rounded-xl ${alert.type === 'error' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                       <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                       <p className="text-xs font-black text-slate-800">{alert.msg}</p>
                       <p className="text-[10px] font-bold text-slate-400 mt-1">{alert.time}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </motion.div>
  );
}

function DeconWorkspace({ isAr }: { isAr: boolean }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
       <div className="bg-white border border-slate-200 rounded-[40px] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">{isAr ? "منطقة التطهير" : "Decontamination Area"}</h2>
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
               <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                  <Timer className="w-4 h-4 text-blue-600" />
                  <span className="text-[10px] font-black text-blue-700 uppercase">Soaking: 14 Trays</span>
               </div>
            </div>
          </div>
          <div className="p-0 overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                   <tr>
                      <th className="py-5 px-8">Tray ID</th>
                      <th className="py-5 px-8">Source</th>
                      <th className="py-5 px-8">Process</th>
                      <th className="py-5 px-8 text-right">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {[
                     { id: "T-882", src: "OR Room 4", proc: "Ultrasonic Wash" },
                     { id: "T-883", src: "Emergency Dept", proc: "Manual Scrub" },
                     { id: "T-884", src: "Inpatient Ward A", proc: "Pending Intake" }
                   ].map(item => (
                     <tr key={item.id} className="group hover:bg-slate-50 transition-all">
                        <td className="py-5 px-8 font-black text-indigo-600">{item.id}</td>
                        <td className="py-5 px-8 text-xs font-bold text-slate-500">{item.src}</td>
                        <td className="py-5 px-8">
                           <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest">{item.proc}</span>
                        </td>
                        <td className="py-5 px-8 text-right">
                           <button className="p-2 bg-indigo-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                              <ChevronRight className="w-4 h-4" />
                           </button>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </motion.div>
  );
}

function AssemblyWorkspace({ isAr }: { isAr: boolean }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
       <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[40px] shadow-sm p-8">
             <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tight">{isAr ? "التجميع والتغليف" : "Assembly & Packaging"}</h3>
             <div className="grid grid-cols-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="aspect-square bg-slate-50 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-center group hover:bg-white hover:border-indigo-300 transition-all">
                     <Layers className="w-5 h-5 sm:w-8 sm:h-8 text-slate-300 group-hover:text-indigo-500 mb-3" />
                     <span className="text-[10px] font-black text-slate-400 group-hover:text-slate-600 uppercase">Station {i}</span>
                     <span className="text-[9px] font-bold text-emerald-600 mt-1 opacity-0 group-hover:opacity-100 uppercase tracking-widest">Available</span>
                  </div>
                ))}
             </div>
          </div>
       </div>
       <div className="bg-white border border-slate-200 rounded-[40px] shadow-sm p-8">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">{isAr ? "قائمة التعبئة" : "Packing List / Checklist"}</h3>
          <div className="space-y-4">
             {["Forceps x2", "Scalpel Handle #3", "Needle Holder", "Scissors - Curved"].map((tool, i) => (
               <div key={i} className="flex flex-wrap items-center gap-2 sm:gap-3 p-4 bg-slate-50 rounded-2xl">
                  <div className="w-5 h-5 border-2 border-slate-200 rounded-md" />
                  <span className="text-xs font-bold text-slate-700">{tool}</span>
               </div>
             ))}
          </div>
       </div>
    </motion.div>
  );
}

function SterilizationWorkspace({ isAr }: { isAr: boolean }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { id: "L-101", status: "Loaded", cycles: "14", type: "Steam", last: "Passed" },
            { id: "L-102", status: "Empty", cycles: "0", type: "Plasma", last: "Passed" },
            { id: "L-103", status: "Biological Test", cycles: "1", type: "Steam", last: "Failed" }
          ].map(load => (
            <div key={load.id} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
               <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${load.status === 'Loaded' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                     <Wind className="w-5 h-5 sm:w-8 sm:h-8" />
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${load.last === 'Failed' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    Last: {load.last}
                  </span>
               </div>
               <h4 className="text-lg sm:text-2xl font-black text-slate-900 mb-1">{load.id}</h4>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{load.type} Sterilizer</p>
               <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black text-slate-400 uppercase">Load Status</span>
                     <span className="text-xs font-black text-slate-800">{load.status}</span>
                  </div>
                  <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">
                    Start Cycle
                  </button>
               </div>
            </div>
          ))}
       </div>
    </motion.div>
  );
}
