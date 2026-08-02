import React, { useState } from 'react';
import { useHIS } from '../context/HISContext';
import { 
  Building2, UserCheck, Stethoscope, Activity, 
  Thermometer, Droplet, Pill, FileText, 
  Clock, Plus, Search, Filter, 
  ChevronRight, AlertCircle, Bed, ArrowRight,
  LogOut, ClipboardList, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type WardStage = 'ROUNDS' | 'VITALS' | 'MEDICATION' | 'ADMISSION' | 'DISCHARGE';

export default function InpatientWorkflowManager({ language, onClose }: { language: 'ar' | 'en', onClose?: () => void }) {
  const isAr = language === 'ar';
  const { patients, activePatient, setActivePatient } = useHIS();
  const [activeStage, setActiveStage] = useState<WardStage>('ROUNDS');

  const wardPatients = patients.filter(p => p.status === 'ward');

  const wardStages = [
    { id: 'ROUNDS', en: "Physician Rounds", ar: "مرور الأطباء", icon: Stethoscope, color: "indigo" },
    { id: 'VITALS', en: "Nursing Vitals", ar: "العلامات الحيوية", icon: Activity, color: "blue" },
    { id: 'MEDICATION', en: "Medication Pass", ar: "صرف وتوزيع الأدوية", icon: Pill, color: "emerald" },
    { id: 'ADMISSION', en: "New Admissions", ar: "حالات الدخول", icon: UserCheck, color: "amber" },
    { id: 'DISCHARGE', en: "Discharge Process", ar: "إجراءات الخروج", icon: LogOut, color: "rose" }
  ];

  return (
    <div className="flex h-[800px] gap-6" dir={isAr ? 'rtl' : 'ltr'}>
       {/* Ward List */}
       <div className="w-80 bg-white border border-slate-200 rounded-[32px] overflow-hidden flex flex-col shadow-sm">
          <div className="p-6 border-b border-slate-100 bg-indigo-50/30">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                   <Building2 className="w-4 h-4" />
                   {isAr ? "قسم التنويم" : "Inpatient Ward"}
                </h3>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded text-[10px] font-black">{wardPatients.length}</span>
             </div>
             <div className="relative">
                <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder={isAr ? "بحث مريض / سرير..." : "Search patient / bed..."}
                  className="w-full h-10 ltr:pl-10 rtl:pr-10 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-400"
                />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
             {wardPatients.map(p => (
               <button
                 key={p.id}
                 onClick={() => setActivePatient(p)}
                 className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-right group ${
                   activePatient?.id === p.id 
                    ? "border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm" 
                    : "border-white hover:bg-slate-50 text-slate-500"
                 }`}
               >
                 <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex flex-col items-center justify-center shadow-sm">
                    <Bed className="w-5 h-5 text-indigo-600 mb-0.5" />
                    <span className="text-[8px] font-black uppercase">{p.bedId || 'B-01'}</span>
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-xs font-black truncate">{isAr ? p.nameAr : p.nameEn}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                       {p.gender} • {p.age}y • MRN: {p.mrn.slice(-4)}
                    </p>
                 </div>
               </button>
             ))}
          </div>
       </div>

       {/* Ward Workspace */}
       <div className="flex-1 bg-white border border-slate-200 rounded-[32px] overflow-hidden flex flex-col shadow-sm relative">
          {/* Module Header with Close Button */}
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-indigo-50/10">
             <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                   <Bed className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="text-sm font-black text-slate-900 tracking-tight">{isAr ? "نظام إدارة الأقسام الداخلية" : "Inpatient Management System"}</h3>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? "إدارة التمريض والمرور الطبي" : "Nursing Care & Medical Rounds Management"}</p>
                </div>
             </div>
             <button 
               onClick={onClose}
               className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm group"
             >
                <Plus className="w-5 h-5 rotate-45 group-hover:scale-110 transition-transform" />
             </button>
          </div>
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
             {wardStages.map(stage => (
               <button
                 key={stage.id}
                 onClick={() => setActiveStage(stage.id as WardStage)}
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
                   {activeStage === 'VITALS' && (
                     <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                     >
                        <div className="grid grid-cols-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                           {[
                             { label: isAr ? "الحرارة" : "Temp", unit: "°C", icon: Thermometer, color: "amber" },
                             { label: isAr ? "النبض" : "Pulse", unit: "bpm", icon: Activity, color: "rose" },
                             { label: isAr ? "الضغط" : "BP", unit: "mmHg", icon: Activity, color: "blue" },
                             { label: isAr ? "الأكسجين" : "SpO2", unit: "%", icon: Activity, color: "emerald" }
                           ].map((v, i) => (
                             <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-4 hover:border-indigo-200 transition-all">
                                <div className="flex items-center justify-between">
                                   <div className={`p-2 rounded-xl bg-${v.color}-50 text-${v.color}-600`}><v.icon className="w-5 h-5" /></div>
                                   <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{v.label}</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                   <input type="text" className="text-3xl font-black w-full bg-transparent outline-none border-b-2 border-transparent focus:border-indigo-400" placeholder="--" />
                                   <span className="text-xs font-bold text-slate-400 uppercase">{v.unit}</span>
                                </div>
                             </div>
                           ))}
                        </div>

                        <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 space-y-6">
                           <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                              <ClipboardList className="w-4 h-4 text-indigo-600" />
                              {isAr ? "ملاحظات التمريض" : "Nursing Progress Notes"}
                           </h4>
                           <textarea 
                             className="w-full h-40 bg-white border border-slate-200 rounded-2xl p-6 text-sm outline-none focus:border-indigo-400 shadow-sm"
                             placeholder={isAr ? "اكتب ملاحظاتك هنا..." : "Document your assessment here..."}
                           ></textarea>
                           <div className="flex justify-end gap-3">
                              <button className="h-12 px-8 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-100">
                                 {isAr ? "حفظ الملاحظة" : "Save Assessment"}
                              </button>
                           </div>
                        </div>
                     </motion.div>
                   )}

                   {activeStage === 'MEDICATION' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                         <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-slate-100 bg-emerald-50/30 flex items-center justify-between">
                               <h4 className="text-xs font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                                  <Pill className="w-4 h-4" />
                                  {isAr ? "الأدوية المجدولة" : "Scheduled Medications (MAR)"}
                               </h4>
                               <span className="text-[10px] font-bold text-slate-400 uppercase">Today: {new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="divide-y divide-slate-50">
                               {[
                                 { time: '08:00 AM', med: 'Panadol 500mg', route: 'Oral', status: 'due' },
                                 { time: '10:00 AM', med: 'Ceftriaxone 1g', route: 'IV', status: 'completed' },
                                 { time: '12:00 PM', med: 'Insulin 5 Units', route: 'SC', status: 'due' }
                               ].map((m, i) => (
                                 <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-center gap-6">
                                       <div className="text-xs font-black text-slate-400 font-mono w-20">{m.time}</div>
                                       <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"><Pill className="w-5 h-5 text-slate-400" /></div>
                                       <div>
                                          <p className="text-sm font-black text-slate-800">{m.med}</p>
                                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.route}</p>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                                       {m.status === 'completed' ? (
                                         <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase">
                                            <CheckCircle2 className="w-4 h-4" />
                                            {isAr ? "تم الإعطاء" : "Administered"}
                                         </div>
                                       ) : (
                                         <button className="h-10 px-6 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition shadow-lg shadow-emerald-100">
                                            {isAr ? "تأكيد الإعطاء" : "Confirm Admin"}
                                         </button>
                                       )}
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </motion.div>
                   )}
                </AnimatePresence>
             ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                   <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                      <Building2 className="w-12 h-12 text-indigo-300" />
                   </div>
                   <h3 className="text-lg font-black text-slate-800">{isAr ? "إدارة أقسام التنويم الداخلي" : "Inpatient Ward Management"}</h3>
                   <p className="text-xs text-slate-400 font-bold max-w-sm mt-2 leading-relaxed">
                      {isAr 
                        ? "اختر مريضاً من القائمة الجانبية للبدء في إدارة العلامات الحيوية، الأدوية، والتقارير التمريضية."
                        : "Select a patient from the side list to begin managing vitals, medications, and nursing progress notes."
                      }
                   </p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
}
