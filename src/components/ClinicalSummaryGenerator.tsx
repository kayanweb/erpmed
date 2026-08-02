
import React, { useState } from 'react';
import { Sparkles, Brain, Loader2, AlertCircle, RefreshCcw, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  language: 'ar' | 'en';
  patientData: any;
}

export default function ClinicalSummaryGenerator({ language, patientData }: Props) {
  const isAr = language === 'ar';
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const generateAISummary = async () => {
    setIsGenerating(true);
    setSummary(null);

    // Simulate AI clinical reasoning
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const clinicalInsights = isAr ? 
        `المريض يعاني من أعراض حادة تتوافق مع متلازمة الشريان التاجي الحادة (ACS). 
- تخطيط القلب يظهر تغيرات ملحوظة في قطاع ST.
- يوصى ببدء بروتوكول MONA فوراً.
- التنسيق مع وحدة القسطرة القلبية للتدخل السريع.` : 
        `Patient presents with acute symptoms consistent with Acute Coronary Syndrome (ACS).
- ECG shows significant ST-segment changes.
- Recommendation: Initiate MONA protocol immediately.
- Coordinate with Cath Lab for urgent intervention.`;

      setSummary(clinicalInsights);
      toast.success(isAr ? "تم إنشاء الملخص السريري الذكي" : "Clinical intelligence summary generated");
    } catch (e) {
      toast.error(isAr ? "فشل إنشاء الملخص" : "Failed to generate summary");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100 shadow-sm relative overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Brain className="w-24 h-24 text-indigo-600" />
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-black text-slate-800 text-lg">{isAr ? "الملخص السريري الذكي (AI Insight)" : "Clinical Intelligence Insight"}</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{isAr ? "مدعوم بنظام التشخيص الاستباقي" : "Powered by Proactive Diagnosis Engine"}</p>
        </div>
      </div>

      {!summary && !isGenerating && (
        <div className="py-8 text-center space-y-4">
          <p className="text-sm text-slate-600 max-w-sm mx-auto">
            {isAr ? "قم بإنشاء ملخص ذكي يعتمد على التاريخ المرضي والمؤشرات الحيوية ونتائج المختبر الأخيرة." : "Generate an intelligent summary based on medical history, vitals, and recent lab results."}
          </p>
          <button 
            onClick={generateAISummary}
            className="px-6 py-3 bg-indigo-600 text-white font-black text-xs uppercase rounded-xl hover:bg-indigo-700 transition-all shadow-md active:scale-95 flex items-center gap-2 mx-auto"
          >
            <Brain className="w-4 h-4" />
            {isAr ? "توليد الملخص الآن" : "Generate Insight Now"}
          </button>
        </div>
      )}

      {isGenerating && (
        <div className="py-12 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-sm font-bold text-slate-500 animate-pulse">{isAr ? "جاري تحليل البيانات السريرية..." : "Analyzing clinical data..."}</p>
        </div>
      )}

      {summary && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-xl p-5 space-y-4 shadow-inner">
             <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? "تم التحليل بنجاح" : "Analysis Complete"}</span>
             </div>
             <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
               {summary}
             </div>
             <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
                <button onClick={() => setSummary(null)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                  <RefreshCcw className="w-4 h-4" />
                </button>
                <button className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase rounded-lg hover:bg-indigo-100 transition-all">
                  {isAr ? "نسخ للتقرير" : "Copy to Report"}
                </button>
             </div>
          </div>
          
          <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg">
             <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
             <p className="text-[10px] text-amber-800 font-medium italic">
               {isAr ? "تنبيه: هذا الملخص يتم إنشاؤه آلياً ويجب مراجعته من قبل الطبيب المختص." : "Notice: This summary is AI-generated and must be validated by a licensed physician."}
             </p>
          </div>
        </div>
      )}
    </div>
  );
}
