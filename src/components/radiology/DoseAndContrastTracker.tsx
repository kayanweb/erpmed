import React, { useState } from "react";
import { 
  Zap, AlertCircle, ShieldCheck, Activity, Droplets, CheckCircle2, X
} from "lucide-react";
import { RadiologyStudy, ContrastInventoryItem } from "../../types/radiology";
import { toast } from "sonner";

interface DoseAndContrastTrackerProps {
  study: RadiologyStudy;
  contrastCatalog: ContrastInventoryItem[];
  isAr: boolean;
  onClose: () => void;
  onUpdateStudy: (updated: Partial<RadiologyStudy>) => void;
}

export const DoseAndContrastTracker: React.FC<DoseAndContrastTrackerProps> = ({
  study,
  contrastCatalog,
  isAr,
  onClose,
  onUpdateStudy
}) => {
  const [dlp, setDlp] = useState(study.doseDlpMgyCm || 400);
  const [ctdi, setCtdi] = useState(study.doseCtdiVolMgy || 12.0);
  const [effectiveDose, setEffectiveDose] = useState(study.effectiveDoseMsv || (dlp * 0.014).toFixed(2));
  
  // Contrast state
  const [selectedContrastId, setSelectedContrastId] = useState(contrastCatalog[0]?.id || "");
  const [contrastVol, setContrastVol] = useState(study.contrastVolumeMl || 80);
  const [creatinine, setCreatinine] = useState(study.creatinineLevel || 0.9);
  const [egfr, setEgfr] = useState(study.eGFR || 90);
  const [allergyChecked, setAllergyChecked] = useState(true);

  // eGFR safety check threshold
  const isEgfrSafe = egfr >= 45;

  const handleSaveDoseAndContrast = () => {
    if (study.contrastRequired && !isEgfrSafe) {
      toast.warning(isAr ? "تحذير: معدل التصفية eGFR منخفض جداً، يجب استشارة استشاري الأشعة والكلى قبل الحقن!" : "Warning: eGFR is below 45 ml/min/1.73m². Nephrology consultation required prior to contrast injection!");
    }

    const selectedContrast = contrastCatalog.find(c => c.id === selectedContrastId);

    onUpdateStudy({
      doseDlpMgyCm: Number(dlp),
      doseCtdiVolMgy: Number(ctdi),
      effectiveDoseMsv: Number(effectiveDose),
      contrastType: selectedContrast ? selectedContrast.name : "Omnipaque 350",
      contrastVolumeMl: Number(contrastVol),
      contrastBatchNo: selectedContrast ? selectedContrast.batchNumber : "LOT-883912",
      creatinineLevel: Number(creatinine),
      eGFR: Number(egfr),
      doseAlertTriggered: Number(dlp) > 800
    });

    toast.success(isAr ? "تم تحديث سجل الجرعة الإشعاعية والصبغة بنجاح" : "Radiation dose & contrast administration recorded");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden text-slate-800" dir={isAr ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">
                {isAr ? "تتبع الجرعات الإشعاعية والصبغة الطبية (RDSR & Contrast Safety)" : "Radiation Dose & Contrast Management"}
              </h2>
              <p className="text-xs text-slate-400">
                ALARA Compliance • Renal Safety & eGFR Screening
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Section 1: Radiation Dose Monitoring (RDSR) */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              {isAr ? "رصد الجرعة الإشعاعية (Dose Structured Report)" : "Radiation Dose Monitoring"}
            </h3>

            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  DLP (mGy·cm)
                </label>
                <input 
                  type="number"
                  value={dlp}
                  onChange={e => {
                    const v = Number(e.target.value);
                    setDlp(v);
                    setEffectiveDose((v * 0.014).toFixed(2));
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  CTDIvol (mGy)
                </label>
                <input 
                  type="number"
                  value={ctdi}
                  onChange={e => setCtdi(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Effective Dose (mSv)
                </label>
                <input 
                  type="number"
                  value={effectiveDose}
                  readOnly
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold text-emerald-700 outline-none"
                />
              </div>
            </div>

            {Number(dlp) > 800 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                {isAr ? "تنبيه: الجرعة الإشعاعية تتجاوز الحد المرجعي الموصى به (Diagnostic Reference Level)" : "Alert: Exposure exceeds Diagnostic Reference Level threshold"}
              </div>
            )}
          </div>

          {/* Section 2: Contrast Media Safety & Kidney Function */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              {isAr ? "فحص أمان الصبغة والوظائف الكلوية" : "Contrast Media & Renal Safety"}
            </h3>

            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Serum Creatinine (mg/dL)
                </label>
                <input 
                  type="number"
                  step="0.1"
                  value={creatinine}
                  onChange={e => setCreatinine(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  eGFR (mL/min/1.73m²)
                </label>
                <input 
                  type="number"
                  value={egfr}
                  onChange={e => setEgfr(Number(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-xl text-xs font-mono font-bold outline-none ${isEgfrSafe ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-300 text-rose-800'}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block">
                {isAr ? "نوع الصبغة المستخدمة:" : "Select Contrast Agent:"}
              </label>
              <select 
                value={selectedContrastId}
                onChange={e => setSelectedContrastId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
              >
                {contrastCatalog.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.type}) - Lot: {c.batchNumber}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                {isAr ? "الحجم المحقون (مليلتر):" : "Injected Contrast Volume (ml):"}
              </label>
              <input 
                type="number"
                value={contrastVol}
                onChange={e => setContrastVol(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
              />
            </div>
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
            onClick={handleSaveDoseAndContrast}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl shadow-lg shadow-blue-200 flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            {isAr ? "حفظ وتوثيق البيانات" : "Save Dose & Contrast Record"}
          </button>
        </div>
      </div>
    </div>
  );
};
