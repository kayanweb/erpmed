import React, { useState } from "react";
import { 
  FileCheck, ShieldCheck, CheckCircle2, AlertTriangle, PenTool, X, Clock
} from "lucide-react";
import { RadiologyStudy } from "../../types/radiology";
import { toast } from "sonner";

interface PatientPrepModalProps {
  study: RadiologyStudy;
  isAr: boolean;
  onClose: () => void;
  onConfirmPrep: (updated: Partial<RadiologyStudy>) => void;
}

export const PatientPrepModal: React.FC<PatientPrepModalProps> = ({
  study,
  isAr,
  onClose,
  onConfirmPrep
}) => {
  const [fastingHours, setFastingHours] = useState(study.fastingHours || 6);
  const [pregnancyCheck, setPregnancyCheck] = useState<"Negative" | "Positive" | "Not Applicable" | "Unknown">(
    study.pregnancyCheck || (study.patientGender === "Female" ? "Negative" : "Not Applicable")
  );
  const [eGFR, setEgfr] = useState(study.eGFR || 90);
  const [creatinine, setCreatinine] = useState(study.creatinineLevel || 0.9);
  const [consentSigned, setConsentSigned] = useState(study.consentSigned || false);
  const [allergiesText, setAllergiesText] = useState(study.allergyHistory?.join(", ") || "");

  const handleCompletePrep = () => {
    if (!consentSigned) {
      toast.error(isAr ? "يجب توقيع نموذج الإقرار الطبي قبل الاستمرار" : "Informed consent signature is required before proceeding");
      return;
    }

    if (study.patientGender === "Female" && pregnancyCheck === "Unknown") {
      toast.warning(isAr ? "تحذير: يجب التحقق من اختبار الحمل للإناث في سن الإنجاب!" : "Warning: Pregnancy status verification is mandatory for female patients");
      return;
    }

    onConfirmPrep({
      prepCompleted: true,
      fastingHours: Number(fastingHours),
      pregnancyCheck,
      eGFR: Number(eGFR),
      creatinineLevel: Number(creatinine),
      consentSigned: true,
      allergyHistory: allergiesText ? allergiesText.split(',').map(a => a.trim()) : [],
      status: "Prepped"
    });

    toast.success(isAr ? "تم إكمال تحضير المريض والموافقة الطبية بنجاح" : "Patient preparation & consent verified");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden text-slate-800" dir={isAr ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">
                {isAr ? "تجهيز المريض وإقرار السلامة الإشعاعية" : "Patient Preparation & Consent Check"}
              </h2>
              <p className="text-xs text-slate-400">
                Patient: {study.patientName} ({study.mrn}) • Modality: {study.modality}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Fasting & Pregnancy Check */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                {isAr ? "ساعات الصيام الفعلي (إن وجد):" : "Actual Fasting Hours:"}
              </label>
              <input 
                type="number"
                value={fastingHours}
                onChange={e => setFastingHours(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                {isAr ? "فحص حالة الحمل (Pregnancy Check):" : "Pregnancy Check Status:"}
              </label>
              <select 
                value={pregnancyCheck}
                onChange={e => setPregnancyCheck(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
              >
                <option value="Negative">Negative (سالب)</option>
                <option value="Positive">Positive (موجب - خطورة إشعاعية)</option>
                <option value="Not Applicable">Not Applicable (غير ينطبق)</option>
                <option value="Unknown">Unknown (غير معروف)</option>
              </select>
            </div>
          </div>

          {/* Allergies History */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 block">
              {isAr ? "تاريخ الحساسية (Allergy History):" : "Allergy History & Notes:"}
            </label>
            <input 
              type="text"
              value={allergiesText}
              onChange={e => setAllergiesText(e.target.value)}
              placeholder={isAr ? "مثال: حساسية صبغة اليود، حساسية البنسلين..." : "e.g. Iodine contrast allergy, Shellfish, Penicillin..."}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
            />
          </div>

          {/* Informed Consent Form */}
          <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-3">
            <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-2">
              <PenTool className="w-4 h-4 text-blue-600" />
              {isAr ? "الموافقة الطبية والإقرار بالمخاطر (Informed Consent Form)" : "Informed Consent & Patient Authorization"}
            </h4>

            <p className="text-[11px] text-blue-800 leading-relaxed font-medium">
              {isAr ? 
                "أقر أنا المريض/ولي الأمر بالموافقة على إجراء الفحص الشعاعي المذكور، وحقن الصبغة الطبية إذا استدعت الحاجة التشخيصية، بعد إحاطتي بالتعليمات وإجراءات السلامة." :
                "I hereby consent to undergo the ordered radiological procedure and contrast administration if clinically indicated, having been informed of procedure benefits and safety risks."
              }
            </p>

            <label className="flex items-center gap-3 pt-2 cursor-pointer">
              <input 
                type="checkbox"
                checked={consentSigned}
                onChange={e => setConsentSigned(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="text-xs font-bold text-blue-900">
                {isAr ? "تم توثيق توقيع المريض/الموافق إلكترونياً" : "Digital Signature Confirmed & Consent Stamped"}
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100"
          >
            {isAr ? "إلغاء" : "Cancel"}
          </button>
          <button 
            onClick={handleCompletePrep}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-200 flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            {isAr ? "تأكيد جاهزية المريض وتحويله للجهاز" : "Confirm Prep & Send to Modality"}
          </button>
        </div>
      </div>
    </div>
  );
};
