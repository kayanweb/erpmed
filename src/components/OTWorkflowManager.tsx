import React, { useState } from 'react';
import { useHIS } from '../context/HISContext';
import { 
  Activity, Scissors, Clock, User, 
  Calendar, CheckCircle2, AlertCircle, 
  Plus, Settings, FileText, LayoutGrid,
  Stethoscope, Syringe, ClipboardCheck,
  Zap, ArrowRight, UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type OTStage = 'BOOKING' | 'PREOP' | 'INTRAOP' | 'POSTOP' | 'CLEANING';

export default function OTWorkflowManager({ language, onClose }: { language: 'ar' | 'en', onClose?: () => void }) {
  const isAr = language === 'ar';
  const { patients, currentUser } = useHIS();
  const [activeStage, setActiveStage] = useState<OTStage>('BOOKING');
  
  const otStages = [
    { id: 'BOOKING', en: "Scheduling", ar: "جدولة العمليات", icon: Calendar, color: "blue" },
    { id: 'PREOP', en: "Pre-Op Prep", ar: "تجهيز ما قبل العملية", icon: ClipboardCheck, color: "indigo" },
    { id: 'INTRAOP', en: "Intra-Op (Live)", ar: "داخل العمليات", icon: Activity, color: "rose" },
    { id: 'POSTOP', en: "Recovery (PACU)", ar: "الإفاقة", icon: Zap, color: "emerald" },
    { id: 'CLEANING', en: "Cleaning & Sterilization", ar: "التعقيم", icon: Settings, color: "slate" }
  ];

  return (
    <div className="space-y-4 sm:space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
       {/* Stage Navigation */}
       <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar items-center justify-between">
          <div className="flex gap-2 sm:gap-4 min-w-max">
            {otStages.map(stage => (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id as OTStage)}
                className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 transition-all whitespace-nowrap ${
                  activeStage === stage.id 
                    ? `border-${stage.color}-200 bg-${stage.color}-50 text-${stage.color}-700 shadow-lg shadow-slate-100` 
                    : 'border-white bg-white text-slate-500 hover:border-slate-100'
                }`}
              >
                <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white shadow-sm border border-slate-100 shrink-0`}>
                  <stage.icon className="w-4 h-4 sm:w-5 h-5" />
                </div>
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">{isAr ? stage.ar : stage.en}</span>
              </button>
            ))}
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl sm:rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm group shrink-0 ml-2 rtl:ml-0 rtl:mr-2"
            title={isAr ? "إغلاق والعودة للرئيسية" : "Close & Return to Dashboard"}
          >
            <Plus className="w-5 h-5 sm:w-6 h-6 rotate-45 group-hover:scale-110 transition-transform" />
          </button>
       </div>

       {/* Main Canvas */}
       <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-[32px] overflow-hidden shadow-sm min-h-[500px] sm:min-h-[600px] flex flex-col">
          <div className="p-4 sm:p-8 border-b border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
             <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:gap-5 w-full sm:w-auto">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center bg-rose-600 text-white shadow-xl shadow-rose-100 shrink-0`}>
                   <Scissors className="w-6 h-6 sm:w-7 h-7" />
                </div>
                <div>
                   <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">{isAr ? "نظام إدارة غرف العمليات" : "Operating Theater Mgmt System"}</h2>
                   <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? "تحكم كامل بمسار الجراحة" : "End-to-end Surgical Workflow Control"}</p>
                </div>
             </div>
             <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none h-10 sm:h-12 px-4 sm:px-6 bg-slate-100 text-slate-600 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition">
                   <Plus className="w-3.5 h-3.5 sm:w-4 h-4" />
                   {isAr ? "حجز غرفة" : "Book Theatre"}
                </button>
             </div>
          </div>

          <div className="flex-1 p-4 sm:p-8 overflow-y-auto custom-scrollbar">
             <AnimatePresence mode="wait">
                {activeStage === 'BOOKING' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                  >
                     {[1, 2, 3].map(room => (
                       <div key={room} className="bg-slate-50/50 border border-slate-100 rounded-[28px] p-6 space-y-6">
                          <div className="flex items-center justify-between">
                             <h3 className="text-sm font-black text-slate-800">{isAr ? `غرفة العمليات ${room}` : `OR Suite ${room}`}</h3>
                             <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black uppercase">Available</span>
                          </div>
                          
                          <div className="space-y-3">
                             <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-4 bg-white rounded-2xl border border-slate-50 shadow-sm">
                                <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-lg bg-indigo-50 flex items-center justify-center"><Clock className="w-4 h-4 text-indigo-600" /></div>
                                <div className="flex-1">
                                   <p className="text-[10px] font-black uppercase text-slate-400">Next Case</p>
                                   <p className="text-xs font-bold text-slate-700">09:00 AM - Laparoscopy</p>
                                </div>
                             </div>
                             <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-4 bg-white rounded-2xl border border-slate-50 shadow-sm opacity-50">
                                <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-lg bg-slate-50 flex items-center justify-center"><User className="w-4 h-4 text-slate-400" /></div>
                                <div className="flex-1">
                                   <p className="text-[10px] font-black uppercase text-slate-400">Surgeon</p>
                                   <p className="text-xs font-bold text-slate-700">Dr. Ahmed Salem</p>
                                </div>
                             </div>
                          </div>

                          <button className="w-full py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition">
                             {isAr ? "إدارة الجدول" : "Manage Schedule"}
                          </button>
                       </div>
                     ))}
                  </motion.div>
                )}

                {activeStage === 'INTRAOP' && (
                   <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8"
                   >
                      <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
                         <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                            <div className="space-y-4 text-center md:text-right">
                               <h3 className="text-3xl font-black">{isAr ? "عملية جراحية نشطة" : "Active Surgical Case"}</h3>
                               <p className="text-indigo-400 font-bold uppercase tracking-widest">OR Suite 01 • Dr. Sarah Khalil</p>
                               <div className="flex gap-4 justify-center md:justify-end">
                                  <div className="px-4 py-2 bg-white/10 rounded-xl flex items-center gap-2">
                                     <Clock className="w-4 h-4" />
                                     <span className="text-xl font-black font-mono">01:12:44</span>
                                  </div>
                               </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                               <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center">
                                  <Heart className="w-6 h-6 text-rose-500 mb-2" />
                                  <span className="text-lg sm:text-2xl font-black">78</span>
                                  <span className="text-[10px] uppercase font-bold text-slate-400">BPM</span>
                               </div>
                               <div className={`p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center`}>
                                  <Activity className="w-6 h-6 text-indigo-500 mb-2" />
                                  <span className="text-lg sm:text-2xl font-black">120/80</span>
                                  <span className="text-[10px] uppercase font-bold text-slate-400">BP</span>
                               </div>
                            </div>
                         </div>
                         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-500/10 via-transparent to-transparent opacity-50"></div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                         <div className="bg-white border border-slate-100 rounded-[28px] p-8 shadow-sm space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                               <ClipboardCheck className="w-4 h-4 text-indigo-600" />
                               {isAr ? "قائمة التحقق (WHO Checklist)" : "WHO Surgical Safety Checklist"}
                            </h4>
                            <div className="space-y-3">
                               {[
                                 { id: '1', label: isAr ? "تأكيد هوية المريض وموقع العملية" : "Confirm patient identity & site" },
                                 { id: '2', label: isAr ? "تأكيد عمل جهاز التخدير" : "Anesthesia machine check" },
                                 { id: '3', label: isAr ? "مراجعة مخاطر النزيف" : "Blood loss risk reviewed" }
                               ].map(check => (
                                 <label key={check.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition">
                                    <span className="text-xs font-bold text-slate-600">{check.label}</span>
                                    <input type="checkbox" className="w-5 h-5 accent-indigo-600" />
                                 </label>
                               ))}
                            </div>
                         </div>

                         <div className="bg-white border border-slate-100 rounded-[28px] p-8 shadow-sm space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                               <FileText className="w-4 h-4 text-emerald-600" />
                               {isAr ? "توثيق الإجراءات اللحظي" : "Live Procedure Log"}
                            </h4>
                            <div className="space-y-4">
                               <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl relative">
                                  <p className="text-[10px] font-black text-indigo-600 uppercase mb-2">09:15 AM</p>
                                  <p className="text-xs font-bold text-slate-700">Incision made by Lead Surgeon</p>
                                  <CheckCircle2 className="absolute top-4 right-4 w-4 h-4 text-indigo-400" />
                                </div>
                                <div className="relative flex items-center gap-2 sm:gap-4 flex-wrap ">
                                   <input 
                                     type="text" 
                                     placeholder={isAr ? "إضافة ملاحظة جراحية..." : "Add surgical note..."}
                                     className="flex-1 h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs outline-none focus:border-rose-400"
                                   />
                                   <button className="h-12 w-12 bg-rose-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-rose-100"><Zap className="w-4 h-4" /></button>
                                </div>
                            </div>
                         </div>
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* Footer Stats */}
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
             <div className="flex gap-8">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{isAr ? "غرف متاحة: 4" : "Available ORs: 4"}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                   <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{isAr ? "قيد التشغيل: 2" : "Active Cases: 2"}</span>
                </div>
             </div>
             <button className="px-6 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition">
                {isAr ? "عرض داشبورد العمليات" : "View OR Dashboard"}
             </button>
          </div>
       </div>
    </div>
  );
}

import { Heart } from 'lucide-react';
