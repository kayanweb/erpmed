import React, { Fragment, useState } from 'react';
import { 
  GitBranch, GitCommit, GitMerge, Plus, 
  Settings, Save, Play, Clock, 
  ShieldCheck, AlertCircle, Trash2, ArrowRight,
  ArrowLeft, CheckCircle2, XCircle, Bell,
  ChevronRight, Zap, Activity, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HISInfrastructureAdmin } from './HISInfrastructureAdmin';

interface WorkflowStep {
  id: string;
  nameEn: string;
  nameAr: string;
  type: 'status' | 'approval' | 'action' | 'notification';
  color: string;
  nextSteps: string[];
}

export default function WorkflowDesigner({ language, onClose }: { language: 'ar' | 'en', onClose?: () => void }) {
  const isAr = language === 'ar';
  const [activeWorkflow, setActiveWorkflow] = useState<string>('admission');
  
  const workflows = [
    { id: 'admission', labelEn: "Patient Admission", labelAr: "دخول المرضى", icon: GitBranch },
    { id: 'er', labelEn: "ER Triage & Flow", labelAr: "مسار الطوارئ", icon: Zap },
    { id: 'discharge', labelEn: "Discharge Process", labelAr: "إجراءات الخروج", icon: LogOut },
    { id: 'operation', labelEn: "OT Scheduling", labelAr: "جدولة العمليات", icon: Activity },
    { id: 'infrastructure', labelEn: "HIS Admin", labelAr: "إدارة النظام", icon: Settings }
  ];

  if (activeWorkflow === 'infrastructure') {
    return <HISInfrastructureAdmin language={language} />;
  }

  // Data source for Admission Workflow
  const [steps, setSteps] = useState<WorkflowStep[]>([
    { id: 'reg', nameEn: 'Registered', nameAr: 'مسجل', type: 'status', color: 'bg-blue-500', nextSteps: ['triage'] },
    { id: 'triage', nameEn: 'Triage In-Progress', nameAr: 'تحت الفرز', type: 'status', color: 'bg-amber-500', nextSteps: ['doctor_assign'] },
    { id: 'doctor_assign', nameEn: 'Doctor Assigned', nameAr: 'تم تعيين الطبيب', type: 'approval', color: 'bg-purple-500', nextSteps: ['examination'] },
    { id: 'examination', nameEn: 'Under Examination', nameAr: 'قيد الفحص', type: 'status', color: 'bg-indigo-500', nextSteps: ['discharged', 'ward_admit'] },
    { id: 'ward_admit', nameEn: 'Ward Admission', nameAr: 'دخول القسم الداخلي', type: 'action', color: 'bg-emerald-500', nextSteps: [] },
    { id: 'discharged', nameEn: 'Discharged', nameAr: 'خروج', type: 'status', color: 'bg-slate-500', nextSteps: [] }
  ]);

  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
       {/* Workflow Selection */}
       <div className="flex items-center justify-between">
          <div className="flex gap-4 p-2 bg-slate-100 rounded-[24px] w-fit">
             {workflows.map(wf => (
               <button
                 key={wf.id}
                 onClick={() => setActiveWorkflow(wf.id)}
                 className={`flex items-center gap-3 px-6 py-3 rounded-[18px] transition-all font-black text-xs uppercase tracking-widest ${
                   activeWorkflow === wf.id ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                 }`}
               >
                 <wf.icon className="w-4 h-4" />
                 {isAr ? wf.labelAr : wf.labelEn}
               </button>
             ))}
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm group shrink-0"
          >
             <Plus className="w-6 h-6 rotate-45 group-hover:scale-110 transition-transform" />
          </button>
       </div>

       {/* Designer Canvas */}
       <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm flex flex-col h-[650px] relative">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between z-10">
             <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
                   <GitBranch className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                   <h3 className="text-lg font-black text-slate-800">
                     {isAr ? "مصمم مسار العمل: " : "Workflow Designer: "} 
                     <span className="text-indigo-600">{workflows.find(w => w.id === activeWorkflow)?.[isAr ? 'labelAr' : 'labelEn']}</span>
                   </h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{isAr ? "تحديد حالات الانتقال والقواعد الشرطية" : "Define state transitions and conditional rules"}</p>
                </div>
             </div>
             <div className="flex gap-3">
                <button className="h-11 px-6 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-200 transition">
                   <Plus className="w-4 h-4" />
                   {isAr ? "إضافة مرحلة" : "Add Step"}
                </button>
                <button className="h-11 px-8 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition">
                   <Save className="w-4 h-4" />
                   {isAr ? "حفظ التغييرات" : "Save Configuration"}
                </button>
             </div>
          </div>

          <div className="flex-1 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] p-12 overflow-auto flex flex-col items-center">
             <div className="flex flex-col gap-8 items-center">
                {steps.map((step, index) => (
                  <Fragment key={step.id}>
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group relative"
                    >
                       <div className={`w-64 p-5 bg-white border-2 border-slate-200 rounded-[24px] shadow-sm hover:shadow-xl hover:border-indigo-400 transition-all cursor-pointer relative z-10 ${step.nextSteps.length === 0 ? 'ring-4 ring-emerald-50 border-emerald-400' : ''}`}>
                          <div className="flex items-center justify-between mb-3">
                             <div className={`w-3 h-3 rounded-full ${step.color}`}></div>
                             <div className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[8px] font-black uppercase text-slate-500">
                               {step.type}
                             </div>
                          </div>
                          <h4 className="text-sm font-black text-slate-800">{isAr ? step.nameAr : step.nameEn}</h4>
                          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">{step.id}</p>
                          
                          {/* Hover Actions */}
                          <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1 rounded-lg border border-slate-100 shadow-xl">
                             <button className="p-1.5 text-slate-400 hover:text-indigo-600 rounded"><Settings className="w-3.5 h-3.5" /></button>
                             <button className="p-1.5 text-slate-400 hover:text-rose-600 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                       </div>

                       {/* Connectors */}
                       {step.nextSteps.length > 0 && (
                          <div className="flex justify-center h-8">
                             <div className="w-0.5 h-full bg-slate-200 relative">
                                <ArrowRight className="absolute bottom-0 -translate-x-1/2 translate-y-1/2 rotate-90 w-4 h-4 text-slate-300" />
                             </div>
                          </div>
                       )}
                    </motion.div>
                  </Fragment>
                ))}
             </div>
          </div>

          {/* Right Panel: Rules */}
          <div className="absolute ltr:right-6 rtl:left-6 top-28 w-72 bg-white/90 backdrop-blur-md border border-slate-200 rounded-[28px] shadow-2xl p-6 z-dropdown space-y-6">
             <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                {isAr ? "القواعد الشرطية" : "Validation Rules"}
             </h4>
             <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <p className="text-[10px] font-black text-indigo-600 uppercase mb-2">Pre-requisite</p>
                   <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                     {isAr ? "يجب إكمال الفحص الحيوي قبل تحويل المريض للطبيب." : "Vitals must be completed before transferring to Doctor."}
                   </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <p className="text-[10px] font-black text-rose-600 uppercase mb-2">Approval</p>
                   <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                     {isAr ? "يتطلب موافقة المدير الطبي للدخول لقسم ICU." : "Requires Medical Director approval for ICU admission."}
                   </p>
                </div>
             </div>
             <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition">
                {isAr ? "إضافة قاعدة ذكية" : "Add Logic Rule"}
             </button>
          </div>
       </div>

       {/* Legend */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: isAr ? "حالة نظام" : "System Status", color: "bg-blue-500" },
            { label: isAr ? "تحقق وموافقة" : "Approval Gate", color: "bg-purple-500" },
            { label: isAr ? "إجراء تلقائي" : "Auto Action", color: "bg-emerald-500" },
            { label: isAr ? "تنبيه ذكي" : "AI Notification", color: "bg-amber-500" }
          ].map((item, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2 sm:gap-3 px-4 py-3 bg-white border border-slate-100 rounded-xl">
               <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
       </div>
    </div>
  );
}

