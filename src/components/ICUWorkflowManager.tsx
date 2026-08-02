import React, { useState } from 'react';
import { useHIS } from '../context/HISContext';
import { Plus, 
  Activity, Heart, Zap, Thermometer, 
  Wind, Droplet, Brain, AlertCircle,
  Timer, ShieldAlert, MonitorCheck,
  ClipboardList, Pill, Microscope,
  Search, Bed, Settings, History,
  ChevronRight, ArrowRight, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ICUWorkflowManager({ language, onClose }: { language: 'ar' | 'en', onClose?: () => void }) {
  const isAr = language === 'ar';
  const { patients, activePatient, setActivePatient } = useHIS();
  const icuPatients = patients.filter(p => p.status === 'nicu' || p.status === 'ward'); // assuming some overlap for demo

  return (
    <div className="flex h-[800px] gap-6" dir={isAr ? 'rtl' : 'ltr'}>
       {/* ICU Unit List */}
       <div className="w-80 bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden flex flex-col shadow-2xl relative">
          <div className="p-6 border-b border-slate-800 bg-slate-900/50">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                   <ShieldAlert className="w-4 h-4" />
                   {isAr ? "وحدة العناية المركزة" : "Critical Care (ICU)"}
                </h3>
                <span className="px-2 py-0.5 bg-rose-900/50 text-rose-400 rounded text-[10px] font-black animate-pulse">Critical</span>
             </div>
             <div className="relative">
                <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder={isAr ? "بحث بالسرير / المريض..." : "Search bed / patient..."}
                  className="w-full h-10 ltr:pl-10 rtl:pr-10 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                />
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
             {icuPatients.map(p => (
               <button
                 key={p.id}
                 onClick={() => setActivePatient(p)}
                 className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-right group relative overflow-hidden ${
                   activePatient?.id === p.id 
                    ? "border-indigo-500 bg-indigo-500/10 text-white shadow-lg" 
                    : "border-transparent bg-slate-800/40 text-slate-400 hover:bg-slate-800"
                 }`}
               >
                 <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center shadow-inner">
                    <Bed className="w-5 h-5 text-indigo-400 mb-0.5" />
                    <span className="text-[8px] font-black uppercase text-slate-500">ICU-0{p.bedId || '4'}</span>
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-xs font-black truncate">{isAr ? p.nameAr : p.nameEn}</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Ventilator • MRN: {p.mrn.slice(-4)}</p>
                 </div>
                 {activePatient?.id === p.id && (
                    <div className="absolute top-0 right-0 p-1 bg-indigo-500"><div className="w-1 h-1 bg-white rounded-full animate-ping"></div></div>
                 )}
               </button>
             ))}
          </div>

          <button 
            onClick={onClose}
            className="absolute bottom-6 ltr:right-6 rtl:left-6 w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-rose-500 hover:border-rose-500 transition-all shadow-2xl group"
          >
            <Plus className="w-6 h-6 rotate-45 group-hover:scale-110 transition-transform" />
          </button>
       </div>

       {/* ICU Monitoring & Workspace */}
       <div className="flex-1 bg-white border border-slate-200 rounded-[32px] overflow-hidden flex flex-col shadow-sm">
          {activePatient ? (
            <div className="flex-1 flex flex-col">
               {/* Patient Detail Header */}
               <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                     <div className="w-10 h-10 sm:w-14 sm:h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                        <Activity className="w-5 h-5 sm:w-8 sm:h-8" />
                     </div>
                     <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">{isAr ? activePatient.nameAr : activePatient.nameEn}</h2>
                        <div className="flex items-center gap-2 sm:gap-4 flex-wrap  mt-0.5">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adm Day: 04</span>
                           <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                           <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">High Risk</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex gap-2 min-w-max">
                     <button className="h-10 px-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition">
                        {isAr ? "دليل البروتوكول" : "View Protocol"}
                     </button>
                     <button className="h-10 px-4 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition shadow-lg shadow-rose-100">
                        {isAr ? "طلب استدعاء (CODE)" : "Call Rapid Response"}
                     </button>
                  </div>
               </div>

               {/* Live Monitor Grid */}
               <div className="p-8 grid grid-cols-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-900 overflow-hidden relative">
                  {[
                    { label: "Heart Rate", val: "84", unit: "bpm", color: "text-rose-500", icon: Heart },
                    { label: "SpO2", val: "98", unit: "%", color: "text-emerald-500", icon: Wind },
                    { label: "MAP", val: "92", unit: "mmHg", color: "text-blue-500", icon: Activity },
                    { label: "EtCO2", val: "38", unit: "mmHg", color: "text-indigo-500", icon: Droplet }
                  ].map((stat, i) => (
                    <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-3xl relative overflow-hidden group">
                       <div className="flex items-center justify-between mb-4">
                          <stat.icon className={`w-5 h-5 ${stat.color}`} />
                          <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{stat.label}</span>
                       </div>
                       <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-black text-white">{stat.val}</span>
                          <span className="text-xs font-bold text-slate-500 uppercase">{stat.unit}</span>
                       </div>
                       {/* Animated Waveform */}
                       <div className="mt-4 h-8 flex items-end gap-1 overflow-hidden opacity-30">
                          {[...Array(20)].map((_, j) => (
                            <motion.div 
                              key={j}
                              animate={{ height: [10, Math.random() * 30 + 10, 10] }}
                              transition={{ repeat: Infinity, duration: 1, delay: j * 0.1 }}
                              className={`w-1 rounded-full ${stat.color.replace('text', 'bg')}`}
                            ></motion.div>
                          ))}
                       </div>
                    </div>
                  ))}
               </div>

               {/* ICU Content Sections */}
               <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                     {/* Ventilation / Organ Support */}
                     <div className="lg:col-span-1 space-y-6">
                        <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-100 space-y-4">
                           <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                              <MonitorCheck className="w-4 h-4 text-indigo-600" />
                              {isAr ? "إعدادات التنفس الصناعي" : "Ventilator Settings"}
                           </h4>
                           <div className="space-y-3">
                              {[
                                { l: "Mode", v: "VC-CMV" },
                                { l: "FiO2", v: "40%" },
                                { l: "PEEP", v: "8 cmH2O" },
                                { l: "RR", v: "14 bpm" }
                              ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                                   <span className="text-[10px] font-black text-slate-400 uppercase">{item.l}</span>
                                   <span className="text-xs font-black text-slate-800">{item.v}</span>
                                </div>
                              ))}
                           </div>
                        </div>

                        <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-100 space-y-4">
                           <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                              <Droplet className="w-4 h-4 text-blue-600" />
                              {isAr ? "السوائل والمحاليل" : "Infusions & Fluids"}
                           </h4>
                           <div className="space-y-3">
                              <div className="p-3 bg-white border border-blue-100 rounded-xl relative">
                                 <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Norepinephrine</p>
                                 <p className="text-xs font-bold text-slate-700">0.05 mcg/kg/min</p>
                                 <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              </div>
                              <div className="p-3 bg-white border border-slate-100 rounded-xl">
                                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Propofol</p>
                                 <p className="text-xs font-bold text-slate-700">20 mcg/kg/min</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Progress & Orders */}
                     <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm space-y-6">
                           <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                 <ClipboardList className="w-4 h-4 text-emerald-600" />
                                 {isAr ? "خطة الرعاية والتدخل" : "Care Plan & Interventions"}
                              </div>
                              <span className="text-[8px] px-2 py-0.5 bg-slate-100 rounded uppercase">Last Update: 10m ago</span>
                           </h4>
                           <div className="space-y-4">
                              <textarea 
                                className="w-full h-48 bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm outline-none focus:border-indigo-400 transition-all"
                                placeholder={isAr ? "توثيق التقييم العصبي والتنفسي..." : "Document neurological and respiratory assessment..."}
                              ></textarea>
                              <div className="flex justify-end gap-3">
                                 <button className="h-12 px-8 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-100">
                                    {isAr ? "تحديث السجل" : "Update Records"}
                                 </button>
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <button className="p-6 bg-slate-900 text-white rounded-[24px] hover:bg-black transition-all flex flex-col items-center gap-3">
                              <Microscope className="w-6 h-6 text-indigo-400" />
                              <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? "طلب غازات الدم" : "Order ABG"}</span>
                           </button>
                           <button className="p-6 bg-white border border-slate-200 rounded-[24px] hover:border-rose-400 transition-all flex flex-col items-center gap-3">
                              <AlertCircle className="w-6 h-6 text-rose-500" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">{isAr ? "استشارة خارجية" : "Request Consult"}</span>
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
               <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <ShieldAlert className="w-12 h-12 text-slate-200" />
               </div>
               <h3 className="text-lg font-black text-slate-800">{isAr ? "مركز مراقبة العناية المركزة" : "Critical Care Command Center"}</h3>
               <p className="text-xs text-slate-400 font-bold max-w-sm mt-2 leading-relaxed">
                  {isAr 
                    ? "اختر مريضاً من وحدة العناية للبدء في المراقبة الحية وتوثيق البروتوكولات الطبية المركزة."
                    : "Select an ICU patient to begin live monitoring and documentation of intensive clinical protocols."
                  }
               </p>
            </div>
          )}
       </div>
    </div>
  );
}
