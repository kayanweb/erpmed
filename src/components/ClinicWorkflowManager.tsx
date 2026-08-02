import React, { useState } from 'react';
import { useHIS } from '../context/HISContext';
import { 
  Stethoscope, Clock, User, Calendar, 
  Search, Filter, Plus, ChevronRight, 
  CheckCircle2, AlertCircle, FileText, 
  ClipboardList, Pill, Microscope, 
  Settings, ArrowRight, UserPlus, Activity,
  LayoutGrid, List
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type ClinicStage = 'WAITING' | 'EXAM' | 'ORDERS' | 'BILLING' | 'SUMMARY';

export default function ClinicWorkflowManager({ language, onClose }: { language: 'ar' | 'en', onClose?: () => void }) {
  const isAr = language === 'ar';
  const { patients, activePatient, setActivePatient } = useHIS();
  const [activeStage, setActiveStage] = useState<ClinicStage>('WAITING');
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('LIST');

  const opdPatients = patients.filter(p => p.status === 'opd' || p.status === 'doctor');

  const clinicStages = [
    { id: 'WAITING', en: "Waitlist", ar: "قائمة الانتظار", icon: Clock, color: "amber" },
    { id: 'EXAM', en: "Consultation", ar: "الكشف الطبي", icon: Stethoscope, color: "indigo" },
    { id: 'ORDERS', en: "CPOE / Orders", ar: "الطلبات والتحاليل", icon: Microscope, color: "rose" },
    { id: 'BILLING', en: "Billing", ar: "الفواتير", icon: CheckCircle2, color: "emerald" },
    { id: 'SUMMARY', en: "Visit Summary", ar: "ملخص الزيارة", icon: FileText, color: "slate" }
  ];

  return (
    <div className="flex h-[800px] gap-6" dir={isAr ? 'rtl' : 'ltr'}>
       {/* Clinic Sidebar */}
       <div className="w-80 bg-white border border-slate-200 rounded-[32px] overflow-hidden flex flex-col shadow-sm">
          <div className="p-6 border-b border-slate-100 bg-indigo-50/30">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                   <Calendar className="w-4 h-4" />
                   {isAr ? "العيادات الخارجية" : "OPD Clinic"}
                </h3>
                <div className="flex gap-2 min-w-max">
                   <button onClick={() => setViewMode('LIST')} className={`p-1.5 rounded-lg ${viewMode === 'LIST' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'}`}><List className="w-3 h-3" /></button>
                   <button onClick={() => setViewMode('GRID')} className={`p-1.5 rounded-lg ${viewMode === 'GRID' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'}`}><LayoutGrid className="w-3 h-3" /></button>
                </div>
             </div>
             <div className="relative">
                <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder={isAr ? "بحث بالاسم أو الرقم..." : "Search MRN / Name..."}
                  className="w-full h-10 ltr:pl-10 rtl:pr-10 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-400"
                />
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
             {opdPatients.map(p => (
               <button
                 key={p.id}
                 onClick={() => setActivePatient(p)}
                 className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-right group ${
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
                    <div className="flex items-center gap-2 mt-0.5">
                       <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'doctor' ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                       <span className="text-[8px] font-black uppercase text-slate-400">{p.status === 'doctor' ? 'With Physician' : 'Waiting'}</span>
                    </div>
                 </div>
               </button>
             ))}
             {opdPatients.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-slate-300">
                   <UserPlus className="w-12 h-12 mb-3 opacity-20" />
                   <p className="text-[10px] font-black uppercase tracking-widest">{isAr ? "لا يوجد مرضى حالياً" : "Queue Empty"}</p>
                </div>
             )}
          </div>
       </div>

       {/* Clinic Canvas */}
       <div className="flex-1 bg-white border border-slate-200 rounded-[32px] overflow-hidden flex flex-col shadow-sm relative">
          {/* Module Header with Close Button */}
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-indigo-50/10">
             <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                   <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="text-sm font-black text-slate-900 tracking-tight">{isAr ? "نظام إدارة العيادات" : "Clinics Management System"}</h3>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? "توثيق الكشف الطبي والطلبات الذكية" : "Clinical Documentation & Smart Ordering"}</p>
                </div>
             </div>
             <button 
               onClick={onClose}
               className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm group"
             >
                <Plus className="w-5 h-5 rotate-45 group-hover:scale-110 transition-transform" />
             </button>
          </div>

          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 overflow-x-auto custom-scrollbar">
             {clinicStages.map(stage => (
               <button
                 key={stage.id}
                 onClick={() => setActiveStage(stage.id as ClinicStage)}
                 className={`flex items-center gap-2 px-5 py-3 rounded-2xl transition-all whitespace-nowrap ${
                   activeStage === stage.id 
                    ? `bg-${stage.color}-600 text-white shadow-lg shadow-${stage.color}-100` 
                    : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-100'
                 }`}
               >
                  <stage.icon className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? stage.ar : stage.en}</span>
               </button>
             ))}
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
             {activePatient ? (
                <AnimatePresence mode="wait">
                   {activeStage === 'EXAM' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                      >
                         <div className="bg-indigo-900 rounded-[32px] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                            <div className="relative z-10">
                               <h3 className="text-lg sm:text-2xl font-black">{isAr ? "استشارة طبية نشطة" : "Active Consultation"}</h3>
                               <p className="text-indigo-400 font-bold uppercase tracking-[0.2em] mt-1">{isAr ? "د. أحمد علي • باطنية" : "Dr. Ahmed Ali • Internal Medicine"}</p>
                            </div>
                            <div className="relative z-10 flex gap-4">
                               <div className="p-4 bg-white/10 rounded-2xl border border-white/10 flex flex-col items-center min-w-24">
                                  <span className="text-[10px] font-black text-indigo-300 uppercase">Wait Time</span>
                                  <span className="text-xl font-black">12 min</span>
                               </div>
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full"></div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                               <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                                  <ClipboardList className="w-4 h-4 text-indigo-600" />
                                  {isAr ? "الشكوى الحالية" : "Chief Complaint"}
                               </h4>
                               <textarea 
                                 className="w-full h-32 bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm outline-none focus:border-indigo-400 transition-all"
                                 placeholder={isAr ? "اكتب شكوى المريض هنا..." : "Enter chief complaint..."}
                               ></textarea>

                               <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                                  <Activity className="w-4 h-4 text-rose-600" />
                                  {isAr ? "الفحص البدني" : "Physical Examination"}
                               </h4>
                               <textarea 
                                 className="w-full h-48 bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm outline-none focus:border-rose-400 transition-all"
                                 placeholder={isAr ? "نتائج الفحص..." : "Document examination findings..."}
                               ></textarea>
                            </div>

                            <div className="space-y-6">
                               <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                                  <Pill className="w-4 h-4 text-emerald-600" />
                                  {isAr ? "التشخيص والأدوية" : "Diagnosis & Medications"}
                               </h4>
                               <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm space-y-4">
                                  <input 
                                    type="text" 
                                    placeholder={isAr ? "بحث تشخيص (ICD-10)..." : "Search ICD-10 Diagnosis..."}
                                    className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs"
                                  />
                                  <div className="flex flex-wrap gap-2">
                                     <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black">Essential Hypertension (I10)</span>
                                     <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black">Type 2 Diabetes (E11)</span>
                                  </div>
                               </div>

                               <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm space-y-4">
                                  <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{isAr ? "الوصفة الطبية" : "Prescription (eRx)"}</h5>
                                  <div className="space-y-3">
                                     <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                           <Pill className="w-4 h-4 text-emerald-600" />
                                           <span className="text-xs font-bold text-slate-700">Metformin 500mg</span>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400">1x2 Daily</span>
                                     </div>
                                  </div>
                                  <button className="w-full py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition">
                                     {isAr ? "إضافة دواء جديد" : "Add Medication"}
                                  </button>
                               </div>
                            </div>
                         </div>
                      </motion.div>
                   )}

                   {activeStage === 'ORDERS' && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8"
                      >
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="bg-rose-50/30 border border-rose-100 rounded-[32px] p-8 space-y-6">
                               <h4 className="text-sm font-black text-rose-900 flex flex-wrap items-center gap-2 sm:gap-3">
                                  <Microscope className="w-5 h-5" />
                                  {isAr ? "طلبات المختبر" : "Laboratory Orders"}
                               </h4>
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {['CBC', 'KFT', 'LFT', 'HbA1c', 'Lipid Profile', 'TFT'].map(test => (
                                    <button key={test} className="p-4 bg-white border border-rose-100 rounded-2xl text-xs font-bold text-slate-600 hover:bg-rose-500 hover:text-white transition-all text-center">
                                       {test}
                                    </button>
                                  ))}
                               </div>
                               <button className="w-full h-12 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-100">{isAr ? "إرسال طلبات المختبر" : "Post Lab Orders"}</button>
                            </div>

                            <div className="bg-blue-50/30 border border-blue-100 rounded-[32px] p-8 space-y-6">
                               <h4 className="text-sm font-black text-blue-900 flex flex-wrap items-center gap-2 sm:gap-3">
                                  <Settings className="w-5 h-5" />
                                  {isAr ? "طلبات الأشعة" : "Radiology Orders"}
                               </h4>
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {['CXR', 'Abdominal US', 'CT Brain', 'MRI Knee'].map(rad => (
                                    <button key={rad} className="p-4 bg-white border border-blue-100 rounded-2xl text-xs font-bold text-slate-600 hover:bg-blue-500 hover:text-white transition-all text-center">
                                       {rad}
                                    </button>
                                  ))}
                               </div>
                               <button className="w-full h-12 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100">{isAr ? "إرسال طلبات الأشعة" : "Post Radiology Orders"}</button>
                            </div>
                         </div>
                      </motion.div>
                   )}
                </AnimatePresence>
             ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                   <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                      <Stethoscope className="w-12 h-12 text-indigo-300" />
                   </div>
                   <h3 className="text-lg font-black text-slate-800">{isAr ? "نظام إدارة العيادات الذكي" : "Smart Clinic Management System"}</h3>
                   <p className="text-xs text-slate-400 font-bold max-w-sm mt-2 leading-relaxed">
                      {isAr 
                        ? "اختر مريضاً من قائمة الانتظار للبدء في توثيق الزيارة الطبية وإصدار الطلبات."
                        : "Select a patient from the waitlist to begin documenting the clinical visit and posting orders."
                      }
                   </p>
                </div>
             )}
          </div>

          {/* Action Bar */}
          {activePatient && (
            <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center">
               <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Autosave Enabled</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               </div>
               <div className="flex gap-3">
                  <button className="h-12 px-8 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition">
                     {isAr ? "تعليق الزيارة" : "Hold Visit"}
                  </button>
                  <button className="h-12 px-10 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 flex items-center gap-2">
                     <CheckCircle2 className="w-4 h-4" />
                     {isAr ? "إتمام الزيارة" : "Finalize Visit"}
                  </button>
               </div>
            </div>
          )}
       </div>
    </div>
  );
}
