import React, { useState } from 'react';
import { useHIS } from '../context/HISContext';
import { Patient, HISAdmissionRecord } from '../types';
import { 
  UserPlus, 
  Clipboard, 
  Stethoscope, 
  User, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  BriefcaseMedical
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface DirectAdmissionWorkflowProps {
  onClose: () => void;
}

const DirectAdmissionWorkflow: React.FC<DirectAdmissionWorkflowProps> = ({ onClose }) => {
  const { addPatient, assignBed, language, currentUser } = useHIS();
  const isAr = language === 'ar';

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nameEn: '',
    nameAr: '',
    age: '',
    gender: 'male' as Patient['gender'],
    phone: '',
    nationalId: '',
    diagnosis: '',
    admissionType: 'elective' as HISAdmissionRecord['admissionType'],
    priority: 'routine' as 'routine' | 'urgent' | 'emergency',
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = () => {
    // 1. Create Patient
    const newPatient: Patient = {
      id: `p-${Date.now()}`,
      mrn: `MRN-${Math.floor(100000 + Math.random() * 900000)}`,
      nameEn: formData.nameEn,
      nameAr: formData.nameAr,
      age: parseInt(formData.age),
      gender: formData.gender,
      phone: formData.phone,
      status: 'waiting',
      registrationDate: new Date().toISOString(),
      currentClinicalLocation: isAr ? 'مكتب التنويم' : 'Admissions Office'
    };

    addPatient(newPatient);

    // 2. Open Bed Assignment (Simulated here or trigger via event)
    toast.success(isAr ? "تم تسجيل المريض. جاري الانتقال لتخصيص السرير." : "Patient Registered. Proceeding to Bed Assignment.");
    
    // In a real app, we'd immediately open the Bed Management Workflow for this new patient
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Steps Indicator */}
      <div className="bg-slate-50 p-4 border-b border-slate-200">
        <div className="flex items-center justify-center gap-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= s ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"
              }`}>
                {s}
              </div>
              <span className={`text-xs font-bold ${step >= s ? "text-slate-900" : "text-slate-400"}`}>
                {s === 1 ? (isAr ? "البيانات الشخصية" : "Demographics") : 
                 s === 2 ? (isAr ? "التفاصيل الطبية" : "Clinical Details") : 
                 (isAr ? "المراجعة" : "Review")}
              </span>
              {s < 3 && <div className="w-12 h-0.5 bg-slate-200" />}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-2xl mx-auto">
          {step === 1 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{isAr ? "بيانات المريض الأساسية" : "Patient Demographics"}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">{isAr ? "الاسم بالإنجليزية" : "NAME (ENGLISH)"}</label>
                  <input 
                    type="text" 
                    value={formData.nameEn}
                    onChange={(e) => setFormData({...formData, nameEn: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">{isAr ? "الاسم بالعربية" : "NAME (ARABIC)"}</label>
                  <input 
                    type="text" 
                    value={formData.nameAr}
                    onChange={(e) => setFormData({...formData, nameAr: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="جون دو"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">{isAr ? "العمر" : "AGE"}</label>
                  <input 
                    type="number" 
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">{isAr ? "الجنس" : "GENDER"}</label>
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                  >
                    <option value="male">{isAr ? "ذكر" : "Male"}</option>
                    <option value="female">{isAr ? "أنثى" : "Female"}</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{isAr ? "التفاصيل الطبية للقبول" : "Clinical Admission Details"}</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">{isAr ? "تشخيص الدخول" : "ADMISSION DIAGNOSIS"}</label>
                  <textarea 
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder={isAr ? "أدخل سبب التنويم..." : "Enter reason for admission..."}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">{isAr ? "نوع التنويم" : "ADMISSION TYPE"}</label>
                    <select 
                      value={formData.admissionType}
                      onChange={(e) => setFormData({...formData, admissionType: e.target.value as any})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                    >
                      <option value="elective">{isAr ? "اختياري (مجدول)" : "Elective (Scheduled)"}</option>
                      <option value="emergency">{isAr ? "طارئ" : "Emergency"}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">{isAr ? "الأولوية" : "PRIORITY"}</label>
                    <select 
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                    >
                      <option value="routine">{isAr ? "عادي" : "Routine"}</option>
                      <option value="urgent">{isAr ? "عاجل" : "Urgent"}</option>
                      <option value="emergency">{isAr ? "طارئ جداً" : "STAT / Emergency"}</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2 uppercase tracking-wider">
                  {isAr ? "مراجعة البيانات النهائية" : "Final Data Review"}
                </h3>
                
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div className="text-slate-500 font-medium">{isAr ? "الاسم:" : "Name:"}</div>
                  <div className="text-slate-900 font-bold">{isAr ? formData.nameAr : formData.nameEn}</div>
                  
                  <div className="text-slate-500 font-medium">{isAr ? "العمر/الجنس:" : "Age/Gender:"}</div>
                  <div className="text-slate-900 font-bold">{formData.age} / {formData.gender}</div>
                  
                  <div className="text-slate-500 font-medium">{isAr ? "التشخيص:" : "Diagnosis:"}</div>
                  <div className="text-slate-900 font-bold">{formData.diagnosis || (isAr ? "غير محدد" : "Not specified")}</div>
                  
                  <div className="text-slate-500 font-medium">{isAr ? "النوع/الأولوية:" : "Type/Priority:"}</div>
                  <div className="text-slate-900 font-bold flex items-center gap-2">
                    <span className="capitalize">{formData.admissionType}</span>
                    <span>•</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      formData.priority === 'emergency' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {formData.priority}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-900 font-medium leading-relaxed">
                  {isAr 
                    ? "عند الضغط على تأمين التنويم، سيتم إنشاء ملف المريض وفتح واجهة تخصيص السرير مباشرة." 
                    : "Upon confirming admission, the patient record will be created and the bed assignment interface will open automatically."}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button 
          onClick={onClose}
          className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition"
        >
          {isAr ? "إلغاء" : "Cancel"}
        </button>
        
        <div className="flex items-center gap-3">
          {step > 1 && (
            <button 
              onClick={handleBack}
              className="px-6 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition"
            >
              {isAr ? "السابق" : "Back"}
            </button>
          )}
          
          {step < 3 ? (
            <button 
              onClick={handleNext}
              disabled={!formData.nameEn || !formData.age}
              className="px-8 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition flex items-center gap-2"
            >
              {isAr ? "التالي" : "Next"}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              className="px-8 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition flex items-center gap-2"
            >
              {isAr ? "تأمين التنويم" : "Finalize Admission"}
              <ShieldCheck className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectAdmissionWorkflow;
