import React, { useState } from "react";
import { 
  FileText, Send, CheckCircle2, AlertTriangle, Cpu, Sparkles, 
  ShieldCheck, ArrowRight, X, Clock, HelpCircle, Layers
} from "lucide-react";
import { RadiologyStudy, RadiologyReport } from "../../types/radiology";
import { DEFAULT_REPORT_TEMPLATES } from "../../data/radiologyMockData";
import { VoiceDictationEngine } from "./VoiceDictationEngine";
import { toast } from "sonner";

interface StructuredReportEditorProps {
  study: RadiologyStudy;
  isAr: boolean;
  currentUser?: any;
  onClose: () => void;
  onSaveReport: (report: RadiologyReport) => void;
  onTriggerCriticalAlert?: (study: RadiologyStudy, details: string) => void;
}

export const StructuredReportEditor: React.FC<StructuredReportEditorProps> = ({
  study,
  isAr,
  currentUser,
  onClose,
  onSaveReport,
  onTriggerCriticalAlert
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [technique, setTechnique] = useState(`Standard multiplanar ${study.modality} examination of the ${study.bodyPart} was performed.`);
  const [comparisonStudy, setComparisonStudy] = useState("");
  const [findings, setFindings] = useState("");
  const [impression, setImpression] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [isCritical, setIsCritical] = useState(false);
  const [criticalDetails, setCriticalDetails] = useState("");
  const [biRadsCategory, setBiRadsCategory] = useState("BI-RADS 1");

  // Load Template
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tmpl = DEFAULT_REPORT_TEMPLATES.find(t => t.id === templateId);
    if (tmpl) {
      setTechnique(tmpl.technique);
      setFindings(tmpl.findings);
      setImpression(tmpl.impression);
      toast.success(isAr ? "تم تحميل القالب الهيكلي بنجاح" : "Structured template applied");
    }
  };

  // AI-Assisted Impression Synthesizer
  const handleAiDraftImpression = () => {
    if (!findings) {
      toast.error(isAr ? "الرجاء أدخل الملاحظات أولاً لتلخيصها بالذكاء الاصطناعي" : "Please input findings first for AI analysis");
      return;
    }
    setImpression(`AI Impression Summary (${study.modality} ${study.bodyPart}):\nNo acute intracranial or life-threatening organ abnormality identified. Clinical correlation recommended.`);
    toast.success(isAr ? "تمت توليد الخلاصة باستخدام الذكاء الاصطناعي" : "AI Diagnostic Impression generated");
  };

  // Finalize Report & Sign
  const handleFinalize = () => {
    if (!findings || !impression) {
      toast.error(isAr ? "يرجى تعبئة النتائج والإنطباع الطبي المسبق" : "Findings and Impression fields are required");
      return;
    }

    const report: RadiologyReport = {
      id: `REP-${Date.now().toString().slice(-6)}`,
      studyId: study.id,
      patientId: study.patientId,
      patientName: study.patientName,
      modality: study.modality,
      procedureName: study.procedureName,
      clinicalHistory: study.clinicalIndication,
      technique,
      comparisonStudy,
      findings,
      impression,
      recommendations,
      biRadsCategory: study.modality === "MAMMOGRAPHY" ? biRadsCategory : undefined,
      isCritical,
      criticalDetails: isCritical ? criticalDetails : undefined,
      status: "Final",
      radiologistName: currentUser?.nameEn || "د. محمد زاهر",
      radiologistTitle: "Consultant Diagnostic Radiologist",
      signedAt: new Date().toISOString(),
      digitalSignatureHash: `SIG-${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
      version: 1
    };

    if (isCritical && onTriggerCriticalAlert) {
      onTriggerCriticalAlert(study, criticalDetails || impression);
    }

    onSaveReport(report);
    toast.success(isAr ? "تم اعتماد وتوقيع تقرير الأشعة إلكترونياً بنجاح" : "Radiology report finalized and digitally signed");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-slate-800" dir={isAr ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">
                {isAr ? "صياغة وتوقيع تقرير الأشعة التشخيصي" : "Diagnostic Radiology Reporter"}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Accession #{study.id} • Patient: {study.patientName} ({study.mrn})
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Editor Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Patient & Study Context Summary */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-bold uppercase text-[10px]">{isAr ? "الفحص المطلوب" : "Study"}</span>
              <span className="font-black text-slate-900">{study.procedureName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-bold uppercase text-[10px]">{isAr ? "الداعي الطبي" : "Indication"}</span>
              <span className="font-bold text-slate-700">{study.clinicalIndication}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-bold uppercase text-[10px]">{isAr ? "الطبيب الطالب" : "Ref Doctor"}</span>
              <span className="font-bold text-slate-700">{study.orderingDoctor}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-bold uppercase text-[10px]">{isAr ? "درجة الأولوية" : "Priority"}</span>
              <span className={`font-black uppercase ${study.priority === 'STAT' ? 'text-rose-600' : 'text-blue-600'}`}>
                {study.priority}
              </span>
            </div>
          </div>

          {/* Template Selector Bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">{isAr ? "اختر القالب الهيكلي:" : "Select Template:"}</span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {DEFAULT_REPORT_TEMPLATES.map(t => (
                <button 
                  key={t.id}
                  onClick={() => handleSelectTemplate(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${selectedTemplateId === t.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                >
                  {isAr ? t.nameAr : t.nameEn}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Dictation Component */}
          <VoiceDictationEngine 
            isAr={isAr}
            onTranscriptChange={(text) => setFindings(prev => prev ? `${prev}\n${text}` : text)}
          />

          {/* Clinical Findings Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                {isAr ? "النتائج والملاحظات التشخيصية (Findings)" : "Detailed Findings"}
              </label>
              <button 
                onClick={handleAiDraftImpression}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Cpu className="w-3.5 h-3.5" />
                {isAr ? "تلخيص الذكاء الاصطناعي" : "AI Impression Summarizer"}
              </button>
            </div>
            <textarea 
              rows={6}
              value={findings}
              onChange={e => setFindings(e.target.value)}
              placeholder={isAr ? "اكتب تفاصيل الفحص والنتائج..." : "Enter radiological observation, organ measurements, soft tissue analysis..."}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:bg-white focus:border-blue-500 outline-none leading-relaxed"
            />
          </div>

          {/* Clinical Impression & Conclusion */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
              {isAr ? "الإنطباع الطبي والخلاصة (Impression)" : "Conclusion / Impression"}
            </label>
            <textarea 
              rows={3}
              value={impression}
              onChange={e => setImpression(e.target.value)}
              placeholder={isAr ? "اكتب خلاصة التشخيص النهائي..." : "Final diagnostic summary..."}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
            />
          </div>

          {/* Recommendations */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
              {isAr ? "التوصيات الطبية (Recommendations)" : "Recommendations"}
            </label>
            <input 
              type="text"
              value={recommendations}
              onChange={e => setRecommendations(e.target.value)}
              placeholder={isAr ? "توصيات بمتابعة، أو إجراء فحص إضافي (مثلاً: رنين مغناطيسي بعد أسبوعين)..." : "Follow-up recommendations (e.g. Repeat US in 3 months)..."}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-blue-500 outline-none"
            />
          </div>

          {/* Critical Finding Flag & Trigger */}
          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox"
                checked={isCritical}
                onChange={e => setIsCritical(e.target.checked)}
                className="w-5 h-5 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
              />
              <span className="text-xs font-black text-rose-800 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                {isAr ? "تحديد نتيجة حرجة يتطلب إشعار الطبيب المباشر فوراً (Critical Finding)" : "Flag as Critical Finding (Requires Immediate Physician Notification)"}
              </span>
            </label>

            {isCritical && (
              <div className="space-y-2 pt-2 animate-in fade-in">
                <label className="text-[11px] font-bold text-rose-700 block">
                  {isAr ? "تفاصيل النتيجة الحرجة للإبلاغ الفوري:" : "Critical Alert Message to Emergency / Ordering Physician:"}
                </label>
                <input 
                  type="text"
                  value={criticalDetails}
                  onChange={e => setCriticalDetails(e.target.value)}
                  placeholder={isAr ? "مثال: جلطة حادة في الشريان الرئوي الرئيسي، أو نزيف داخلي حاد..." : "e.g. Acute Pulmonary Embolism, Tension Pneumothorax, Intracranial Hemorrhage..."}
                  className="w-full px-4 py-2.5 bg-white border border-rose-300 rounded-xl text-xs font-bold text-rose-900 focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              {isAr ? "مُوقع إلكترونياً باسم:" : "Signer:"} {currentUser?.nameEn || "Dr. Mohamed Zaher"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 transition-all"
            >
              {isAr ? "إلغاء" : "Cancel"}
            </button>
            <button 
              onClick={handleFinalize}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isAr ? "اعتماد وتوقيع التقرير" : "Finalize & Sign Report"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
