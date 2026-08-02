import React, { useState } from 'react';
import { useHIS } from '../context/HISContext';
import { Patient } from '../types';
import { 
  Activity, 
  User, 
  Thermometer, 
  Heart, 
  Wind, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Info,
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface TriageWorkflowProps {
  patient?: Patient;
  onClose: () => void;
}

const TriageWorkflow: React.FC<TriageWorkflowProps> = ({ patient, onClose }) => {
  const { patients, updatePatient, logAudit, language } = useHIS();
  const isAr = language === 'ar';

  const [step, setStep] = useState(1);
  const [vitals, setVitals] = useState({
    bp_sys: '',
    bp_dia: '',
    hr: '',
    temp: '',
    spo2: '',
    rr: '',
    weight: '',
    painScale: '0'
  });

  const [clinical, setClinical] = useState({
    chiefComplaint: '',
    triageLevel: 3,
    allergies: '',
    history: ''
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = () => {
    if (!patient) return;

    // 1. Update Patient with Triage Info
    updatePatient(patient.id, {
      status: 'triage',
      triageLevel: clinical.triageLevel,
      chiefComplaint: clinical.chiefComplaint,
      vitals: vitals as any
    });

    // 2. Audit Log
    logAudit({
      action: 'PATIENT_TRIAGE',
      entityType: 'PATIENT',
      entityId: patient.id,
      reason: 'Emergency Triage Completed',
      newValue: { vitals, clinical }
    });

    toast.success(isAr ? "تم إكمال عملية الفرز بنجاح" : "Emergency triage completed successfully");
    onClose();
  };

  const triageLevels = [
    { level: 1, labelEn: "RESUSCITATION", labelAr: "إنعاش", color: "bg-rose-600", descriptionEn: "Immediate life-saving intervention needed.", descriptionAr: "تدخل فوري لإنقاذ الحياة." },
    { level: 2, labelEn: "EMERGENT", labelAr: "طارئ جداً", color: "bg-orange-500", descriptionEn: "High risk, time-critical situation.", descriptionAr: "حالة عالية الخطورة، حرجة زمنياً." },
    { level: 3, labelEn: "URGENT", labelAr: "عاجل", color: "bg-yellow-500", descriptionEn: "Stable, but requires multiple resources.", descriptionAr: "حالة مستقرة ولكن تحتاج موارد متعددة." },
    { level: 4, labelEn: "LESS URGENT", labelAr: "أقل استعجالاً", color: "bg-emerald-500", descriptionEn: "Stable, requires single resource.", descriptionAr: "مستقرة، تحتاج مورد واحد." },
    { level: 5, labelEn: "NON-URGENT", labelAr: "غير عاجل", color: "bg-blue-500", descriptionEn: "Stable, no resources needed.", descriptionAr: "مستقرة، لا تحتاج موارد." },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Steps Indicator */}
      <div className="bg-white px-8 py-4 border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[1, 2, 3].map(s => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all ${
                  step === s ? "bg-rose-600 text-white shadow-lg shadow-rose-200" : step > s ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
                }`}>
                  {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s ? "text-slate-900" : "text-slate-400"}`}>
                  {s === 1 ? (isAr ? "العلامات الحيوية" : "Vital Signs") : 
                   s === 2 ? (isAr ? "التقييم السريري" : "Clinical Assessment") : 
                   (isAr ? "تحديد المستوى" : "Triage Level")}
                </span>
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 mx-4 ${step > s ? "bg-emerald-500" : "bg-slate-200"}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="md:col-span-3 flex items-center gap-3 border-b border-slate-200 pb-4">
                    <div className="p-2 bg-rose-100 rounded-xl text-rose-600"><Activity className="w-6 h-6" /></div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{isAr ? "رصد العلامات الحيوية" : "Vital Signs Monitoring"}</h3>
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                       <Thermometer className="w-3.5 h-3.5" /> {isAr ? "الحرارة" : "TEMP (°C)"}
                    </label>
                    <input 
                      type="number" 
                      value={vitals.temp}
                      onChange={(e) => setVitals({...vitals, temp: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none transition shadow-sm"
                      placeholder="37.0"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                       <Heart className="w-3.5 h-3.5" /> {isAr ? "النبض" : "HEART RATE (BPM)"}
                    </label>
                    <input 
                      type="number" 
                      value={vitals.hr}
                      onChange={(e) => setVitals({...vitals, hr: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none transition shadow-sm"
                      placeholder="80"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                       <Wind className="w-3.5 h-3.5" /> {isAr ? "الأكسجين" : "SPO2 (%)"}
                    </label>
                    <input 
                      type="number" 
                      value={vitals.spo2}
                      onChange={(e) => setVitals({...vitals, spo2: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none transition shadow-sm"
                      placeholder="98"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "الضغط الانقباضي" : "BP SYSTOLIC"}</label>
                    <input 
                      type="number" 
                      value={vitals.bp_sys}
                      onChange={(e) => setVitals({...vitals, bp_sys: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none transition shadow-sm"
                      placeholder="120"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "الضغط الانبساطي" : "BP DIASTOLIC"}</label>
                    <input 
                      type="number" 
                      value={vitals.bp_dia}
                      onChange={(e) => setVitals({...vitals, bp_dia: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none transition shadow-sm"
                      placeholder="80"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "مقياس الألم (0-10)" : "PAIN SCALE (0-10)"}</label>
                    <div className="flex items-center gap-2 pt-2">
                       <input 
                         type="range" min="0" max="10" 
                         value={vitals.painScale}
                         onChange={(e) => setVitals({...vitals, painScale: e.target.value})}
                         className="flex-1 accent-rose-600" 
                       />
                       <span className="w-8 h-8 bg-rose-50 border border-rose-100 rounded-lg flex items-center justify-center text-sm font-black text-rose-700">{vitals.painScale}</span>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
               <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                  <div className="p-2 bg-blue-100 rounded-xl text-blue-600"><Stethoscope className="w-6 h-6" /></div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{isAr ? "التقييم السريري السريع" : "Rapid Clinical Assessment"}</h3>
               </div>

               <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">{isAr ? "الشكوى الرئيسية" : "CHIEF COMPLAINT"}</label>
                    <textarea 
                      rows={4}
                      value={clinical.chiefComplaint}
                      onChange={(e) => setClinical({...clinical, chiefComplaint: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-3xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none transition shadow-sm"
                      placeholder={isAr ? "أدخل سبب الحضور للطوارئ..." : "Describe the main reason for the visit..."}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">{isAr ? "الحساسية" : "ALLERGIES"}</label>
                      <input 
                        type="text" 
                        value={clinical.allergies}
                        onChange={(e) => setClinical({...clinical, allergies: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none transition shadow-sm"
                        placeholder={isAr ? "لا توجد" : "NKDA / None"}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">{isAr ? "التاريخ المرضي" : "MEDICAL HISTORY"}</label>
                      <input 
                        type="text" 
                        value={clinical.history}
                        onChange={(e) => setClinical({...clinical, history: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none transition shadow-sm"
                        placeholder={isAr ? "ضغط، سكري..." : "HTN, DM..."}
                      />
                    </div>
                  </div>
               </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
               <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                  <div className="p-2 bg-amber-100 rounded-xl text-amber-600"><ShieldAlert className="w-6 h-6" /></div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{isAr ? "تحديد مستوى الفرز (ESI)" : "ESI Triage Level Assignment"}</h3>
               </div>

               <div className="grid grid-cols-1 gap-4">
                  {triageLevels.map((lvl) => (
                    <button
                      key={lvl.level}
                      onClick={() => setClinical({...clinical, triageLevel: lvl.level})}
                      className={`relative p-6 rounded-[32px] border-2 transition-all flex items-center justify-between text-right group ${
                        clinical.triageLevel === lvl.level 
                          ? `border-indigo-600 bg-white shadow-2xl -translate-y-1` 
                          : "border-white bg-white hover:border-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl ${lvl.color} flex items-center justify-center text-white text-2xl font-black shadow-lg`}>
                          {lvl.level}
                        </div>
                        <div>
                           <div className="text-lg font-black text-slate-900 uppercase tracking-tighter">{isAr ? lvl.labelAr : lvl.labelEn}</div>
                           <p className="text-xs font-bold text-slate-400 mt-1">{isAr ? lvl.descriptionAr : lvl.descriptionEn}</p>
                        </div>
                      </div>
                      {clinical.triageLevel === lvl.level && (
                         <div className="bg-indigo-600 text-white p-2 rounded-full shadow-lg">
                           <CheckCircle2 className="w-6 h-6" />
                         </div>
                      )}
                    </button>
                  ))}
               </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 bg-white border-t border-slate-200 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={onClose}
            className="px-8 py-3 text-sm font-black text-slate-400 hover:text-slate-600 transition uppercase tracking-widest"
          >
            {isAr ? "إلغاء" : "Cancel"}
          </button>
          
          <div className="flex items-center gap-4">
            {step > 1 && (
              <button 
                onClick={handleBack}
                className="px-8 py-3 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition"
              >
                {isAr ? "السابق" : "Back"}
              </button>
            )}
            
            {step < 3 ? (
              <button 
                onClick={handleNext}
                className="px-10 py-3 bg-indigo-600 text-white text-xs font-black rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 uppercase tracking-widest"
              >
                {isAr ? "التالي" : "Next Step"}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                className="px-12 py-3 bg-rose-600 text-white text-xs font-black rounded-2xl shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all flex items-center gap-3 uppercase tracking-widest active:scale-95"
              >
                {isAr ? "تأكيد وإتمام الفرز" : "Finalize & Save Triage"}
                <CheckCircle2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriageWorkflow;
