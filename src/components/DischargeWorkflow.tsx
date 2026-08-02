import React, { useState } from 'react';
import { useHIS } from '../context/HISContext';
import { Patient } from '../types';
import { 
  LogOut, 
  User, 
  ClipboardCheck, 
  ShieldCheck, 
  ArrowRight,
  FileText,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import ComprehensiveDischargeForm from './ComprehensiveDischargeForm';
import { toast } from 'sonner';

interface DischargeWorkflowProps {
  patient: Patient;
  onClose: () => void;
}

const DischargeWorkflow: React.FC<DischargeWorkflowProps> = ({ patient, onClose }) => {
  const { updatePatient, language, logAudit } = useHIS();
  const isAr = language === 'ar';

  const [dischargeData, setDischargeData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinalize = () => {
    if (!dischargeData) {
      toast.error(isAr ? "يرجى إكمال بيانات الخروج أولاً" : "Please complete discharge data first");
      return;
    }

    setIsSubmitting(true);
    
    // 1. Update Patient Status
    updatePatient(patient.id, {
      status: 'discharged',
      currentClinicalLocation: isAr ? 'خارج المستشفى' : 'Out of Hospital',
      wardId: undefined,
      bedId: undefined,
      roomId: undefined
    });

    // 2. Log Audit
    logAudit({
      action: 'PATIENT_DISCHARGE',
      entityType: 'PATIENT',
      entityId: patient.id,
      reason: dischargeData.dischargeType,
      newValue: dischargeData
    });

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(isAr ? "تم إكمال إجراءات الخروج بنجاح" : "Discharge finalized successfully");
      onClose();
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Header: Patient Context */}
      <div className="bg-white p-6 border-b border-slate-200 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 shadow-sm">
              <User size={28} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">{isAr ? patient.nameAr : patient.nameEn}</h2>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-xs font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">MRN: {patient.mrn}</span>
                <span className="text-xs font-bold text-slate-500">{isAr ? `العمر: ${patient.age}` : `Age: ${patient.age}`}</span>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{patient.currentClinicalLocation}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-2 text-rose-600 mb-1 justify-end">
              <LogOut size={18} />
              <span className="text-sm font-black uppercase tracking-tight">{isAr ? "عملية خروج نهائي" : "Final Discharge Process"}</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? "تأكد من تسوية جميع المتعلقات الطبية والمالية" : "Ensure all clinical and financial matters are settled"}</p>
          </div>
        </div>
      </div>

      {/* Main Content: The Form */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{isAr ? "استمارة الخروج الموحدة" : "Unified Discharge Form"}</h3>
            </div>
            <div className="p-0">
              <ComprehensiveDischargeForm 
                language={language}
                onDataChange={setDischargeData}
              />
            </div>
          </div>

          <div className="mt-6 flex items-start gap-4 bg-amber-50 border border-amber-100 p-4 rounded-2xl">
            <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
            <div>
              <h4 className="text-sm font-black text-amber-900 uppercase tracking-tight mb-1">{isAr ? "ملاحظة هامة" : "Important Note"}</h4>
              <p className="text-xs text-amber-800 font-medium leading-relaxed">
                {isAr 
                  ? "الضغط على 'تأكيد الخروج' سيؤدي إلى تحرير السرير فوراً وإغلاق الملف الطبي النشط للمريض. تأكد من طباعة نسخة للمريض إذا لزم الأمر." 
                  : "Finalizing discharge will immediately release the bed and close the active clinical encounter. Ensure a printed copy is provided to the patient if required."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-white p-6 border-t border-slate-200 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={onClose}
            className="px-8 py-3 text-sm font-black text-slate-500 hover:text-slate-700 transition uppercase tracking-widest"
          >
            {isAr ? "إلغاء" : "Cancel"}
          </button>
          
          <button 
            disabled={isSubmitting}
            onClick={handleFinalize}
            className="px-10 py-3 bg-emerald-600 text-white text-sm font-black rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center gap-3 uppercase tracking-widest"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isAr ? "جاري المعالجة..." : "Processing..."}
              </span>
            ) : (
              <>
                {isAr ? "تأكيد وإتمام الخروج" : "Finalize & Discharge"}
                <ShieldCheck className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DischargeWorkflow;
