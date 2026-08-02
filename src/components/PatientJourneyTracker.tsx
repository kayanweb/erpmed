import React, { useState } from 'react';
import { useHIS } from '../context/HISContext';
import { 
  History, Map, Navigation, ArrowRight, 
  Search, Calendar, Filter, Clock,
  Stethoscope, Activity, LogIn, LogOut,
  Zap, Syringe, ClipboardCheck, Microscope,
  Building2, User, ChevronLeft, ChevronRight,
  MonitorCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PatientJourneyTracker({ language, onClose }: { language: "ar" | "en"; onClose?: () => void }) {
  const isAr = language === 'ar';
  const { patients, patientJourneys, activePatient, setActivePatient } = useHIS();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter(p => 
    p.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.nameAr.includes(searchTerm) ||
    p.mrn.includes(searchTerm)
  );

  const selectedPatientJourneys = patientJourneys.filter(j => j.patientId === activePatient?.id)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  const getStepIcon = (dept: string) => {
    switch (dept.toUpperCase()) {
      case 'RECEPTION': return <LogIn className="w-5 h-5" />;
      case 'TRIAGE': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'EMERGENCY': return <Activity className="w-5 h-5 text-rose-500" />;
      case 'CLINIC': return <Stethoscope className="w-5 h-5 text-indigo-500" />;
      case 'LABORATORY': return <Microscope className="w-5 h-5 text-emerald-500" />;
      case 'WARD': return <Building2 className="w-5 h-5 text-blue-500" />;
      case 'DISCHARGE': return <LogOut className="w-5 h-5 text-slate-500" />;
      default: return <History className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex h-[800px] gap-6" dir={isAr ? 'rtl' : 'ltr'}>
       {/* Patient Selector */}
       <div className="w-80 bg-white border border-slate-200 rounded-[32px] overflow-hidden flex flex-col shadow-sm">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
             <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-4">{isAr ? "اختيار المريض" : "Select Patient"}</h3>
             <div className="relative">
                <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder={isAr ? "بحث بالاسم أو MRN..." : "Search MRN / Name..."}
                  className="w-full h-10 ltr:pl-10 rtl:pr-10 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
             {filteredPatients.map(p => (
               <button
                 key={p.id}
                 onClick={() => setActivePatient(p)}
                 className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-right ${
                   activePatient?.id === p.id 
                    ? "border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm" 
                    : "border-white hover:bg-slate-50 text-slate-500"
                 }`}
               >
                 <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-xs font-black shadow-sm">
                    {p.mrn.slice(-4)}
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-xs font-black truncate">{isAr ? p.nameAr : p.nameEn}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{p.gender} • {p.age} {isAr ? 'سنة' : 'yrs'}</p>
                 </div>
                 {activePatient?.id === p.id && <ChevronRight className="w-4 h-4 rtl:rotate-180" />}
               </button>
             ))}
          </div>
       </div>

       {/* Journey Timeline */}
       <div className="flex-1 bg-white border border-slate-200 rounded-[32px] overflow-hidden flex flex-col shadow-sm relative">
          <AnimatePresence mode="wait">
            {activePatient ? (
              <motion.div 
                key={activePatient.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                {/* Patient Header */}
                <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white border border-slate-200 rounded-3xl flex items-center justify-center shadow-sm">
                         <User className="w-5 h-5 sm:w-8 sm:h-8 text-indigo-600" />
                      </div>
                      <div>
                         <h2 
                            className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight hover:text-indigo-600 cursor-pointer transition"
                            onClick={() => window.dispatchEvent(new CustomEvent("openPatientChart", { detail: { patientId: activePatient.mrn || activePatient.id, patientName: isAr ? activePatient.nameAr : activePatient.nameEn } }))}
                         >
                            {isAr ? activePatient.nameAr : activePatient.nameEn}
                         </h2>
                         <div className="flex items-center gap-2 sm:gap-4 flex-wrap  mt-1">
                            <span 
                               className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer transition rounded-lg text-[10px] font-black uppercase tracking-widest font-mono"
                               onClick={() => window.dispatchEvent(new CustomEvent("openPatientChart", { detail: { patientId: activePatient.mrn || activePatient.id, patientName: isAr ? activePatient.nameAr : activePatient.nameEn } }))}
                            >
                               MRN: {activePatient.mrn}
                            </span>
                            <span className="text-xs font-bold text-slate-400">{activePatient.gender} • {activePatient.age} {isAr ? 'سنة' : 'Years Old'}</span>
                         </div>
                      </div>
                   </div>
                   <div className="flex gap-3">
                      <button 
                         onClick={() => window.dispatchEvent(new CustomEvent("openPatientChart", { detail: { patientId: activePatient.mrn || activePatient.id, patientName: isAr ? activePatient.nameAr : activePatient.nameEn } }))}
                         className="h-12 px-6 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition shadow-xl shadow-slate-100 cursor-pointer"
                      >
                         {isAr ? "تصدير الملف" : "Full Dossier"}
                      </button>
                   </div>
                </div>

                {/* Timeline Content */}
                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar relative">
                   {/* Vertical Line */}
                   <div className="absolute ltr:left-[60px] rtl:right-[60px] top-12 bottom-12 w-1 bg-slate-100"></div>

                   <div className="space-y-12">
                      {selectedPatientJourneys.length > 0 ? (
                        selectedPatientJourneys.map((step, idx) => (
                          <div key={step.id} className="relative flex items-start gap-8 group">
                             {/* Icon Marker */}
                             <div className={`relative z-10 w-12 h-12 rounded-2xl bg-white border-4 border-white shadow-xl flex items-center justify-center transition-transform group-hover:scale-110 ${idx === 0 ? 'ring-4 ring-indigo-50' : ''}`}>
                                <div className={`w-full h-full rounded-xl flex items-center justify-center ${idx === 0 ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                                   {getStepIcon(step.department)}
                                </div>
                             </div>

                             {/* Content Card */}
                             <div className="flex-1 bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm group-hover:shadow-md transition-shadow relative overflow-hidden">
                                <div className="flex items-center justify-between mb-4">
                                   <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                      <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">{step.department}</span>
                                      <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                        step.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                      }`}>
                                         {step.status}
                                      </span>
                                   </div>
                                   <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 font-mono">
                                      <Clock className="w-3.5 h-3.5" />
                                      {new Date(step.startTime).toLocaleString(isAr ? 'ar-EG' : 'en-US', { 
                                        hour: '2-digit', 
                                        minute: '2-digit',
                                        day: '2-digit',
                                        month: 'short'
                                      })}
                                   </div>
                                </div>
                                <p className="text-sm font-bold text-slate-700 leading-relaxed">
                                   {isAr ? step.notesAr : step.notesEn}
                                </p>
                                <div className="mt-4 flex items-center gap-2 sm:gap-4 flex-wrap  pt-4 border-t border-slate-50">
                                   <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                                      <User className="w-3.5 h-3.5" />
                                      {isAr ? "بواسطة: " : "By: "} {step.actionBy}
                                   </div>
                                   {step.endTime && (
                                     <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                                        <MonitorCheck className="w-3.5 h-3.5" />
                                        {isAr ? "المدة: " : "Duration: "} 
                                        {Math.round((new Date(step.endTime).getTime() - new Date(step.startTime).getTime()) / 60000)} min
                                     </div>
                                   )}
                                </div>
                                
                                {/* Background Accent */}
                                <div className="absolute top-0 ltr:right-0 rtl:left-0 w-32 h-full bg-gradient-to-l ltr:from-slate-50/50 rtl:to-slate-50/50 pointer-events-none"></div>
                             </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                           <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                              <Map className="w-12 h-12 text-slate-200" />
                           </div>
                           <h4 className="text-lg font-black text-slate-800">{isAr ? "لا يوجد سجل رحلة بعد" : "No journey trail found"}</h4>
                           <p className="text-xs text-slate-400 font-bold max-w-xs mt-2 leading-relaxed">
                              {isAr 
                                ? "لم يتم تسجيل أي خطوات في رحلة هذا المريض حتى الآن. تبدأ الرحلة عادةً من الاستقبال."
                                : "No steps have been recorded for this patient's journey yet. Journeys typically begin at Reception."
                              }
                           </p>
                        </div>
                      )}
                   </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center">
                 <div className="w-32 h-32 bg-slate-50 rounded-[40px] flex items-center justify-center mb-8 border border-slate-100 shadow-inner">
                    <Navigation className="w-16 h-16 text-slate-200 animate-bounce" />
                 </div>
                 <h2 className="text-xl font-black text-slate-800">{isAr ? "رحلة المريض الموحدة" : "Unified Patient Journey"}</h2>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">{isAr ? "اختر مريضاً لبدء التتبع" : "Select a patient to begin tracking"}</p>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 w-full max-w-lg px-8">
                    {[
                      { label: isAr ? "دقة زمنية" : "Time Precision", icon: Clock },
                      { label: isAr ? "تكامل الأنظمة" : "Module Sync", icon: Zap },
                      { label: isAr ? "رؤية 360 درجة" : "360° Vision", icon: MonitorCheck },
                      { label: isAr ? "حوكمة ذكية" : "Smart Audit", icon: ClipboardCheck }
                    ].map((item, i) => (
                      <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-2 sm:gap-4 flex-wrap ">
                         <div className="p-2 bg-slate-50 rounded-lg text-indigo-600"><item.icon className="w-4 h-4" /></div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{item.label}</span>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </AnimatePresence>
       </div>
    </div>
  );
}
