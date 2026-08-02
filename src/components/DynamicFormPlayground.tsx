import React, { useState } from "react";
import { SmartFormBuilder, DynamicForm } from "./SmartFormBuilder";
import DynamicFormRenderer from "./DynamicFormRenderer";
import { Eye, Edit3, LayoutTemplate } from "lucide-react";

interface Props {
  language: "ar" | "en";
}

// Some dummy templates for demonstration
const ERTemplate: DynamicForm = {
  id: "ER-TRAUMA-1",
  titleAr: "تقييم إصابات الحوادث المبدئي",
  titleEn: "Primary Trauma Assessment",
  module: "ER",
  sections: [
    {
      id: "S1",
      titleAr: "العلامات الحيوية",
      titleEn: "Vital Signs",
      fields: [
        { id: "v1", type: "number", labelAr: "معدل ضربات القلب", labelEn: "Heart Rate", required: true },
        { id: "v2", type: "number", labelAr: "ضغط الدم الانقباضي", labelEn: "Systolic BP", required: true },
        { id: "v3", type: "number", labelAr: "تشبع الأكسجين (%)", labelEn: "SpO2 (%)", required: true },
      ]
    },
    {
      id: "S2",
      titleAr: "تقييم غلاسكو للغيبوبة (GCS)",
      titleEn: "Glasgow Coma Scale",
      fields: [
        { id: "g1", type: "select", labelAr: "العين (E)", labelEn: "Eye Opening (E)", options: [
          { value: "4", labelAr: "تلقائي (4)", labelEn: "Spontaneous (4)" },
          { value: "3", labelAr: "للصوت (3)", labelEn: "To Speech (3)" },
          { value: "1", labelAr: "لا استجابة (1)", labelEn: "None (1)" }
        ]},
      ]
    }
  ]
};

const ORTemplate: DynamicForm = {
  id: "OR-CHECK-1",
  titleAr: "قائمة التحقق الجراحية الآمنة",
  titleEn: "Safe Surgery Checklist",
  module: "OR",
  sections: [
    {
      id: "S1",
      titleAr: "قبل التخدير (Sign In)",
      titleEn: "Before Induction (Sign In)",
      fields: [
        { id: "o1", type: "checkbox", labelAr: "تأكيد هوية المريض", labelEn: "Patient Identity Confirmed", required: true },
        { id: "o2", type: "checkbox", labelAr: "موافقة جراحية موقعة", labelEn: "Surgical Consent Signed", required: true },
        { id: "o3", type: "checkbox", labelAr: "تحديد موقع العملية", labelEn: "Site Marked", required: true },
      ]
    },
    {
      id: "S2",
      titleAr: "فحص التخدير",
      titleEn: "Anesthesia Safety",
      fields: [
        { id: "a1", type: "text", labelAr: "ملاحظات التخدير", labelEn: "Anesthesia Notes", required: false },
      ]
    }
  ]
};


export default function DynamicFormPlayground({ language }: Props) {
  const isAr = language === "ar";
  const [mode, setMode] = useState<"build" | "preview">("build");
  const [currentForm, setCurrentForm] = useState<DynamicForm>(ERTemplate);
  const [previewDept, setPreviewDept] = useState<"ER" | "OR" | "ICU" | "WARD">("ER");

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden bg-slate-50 font-sans">
      
      {/* Top Navigation / Controls */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0 z-10" dir={isAr ? "rtl" : "ltr"}>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <LayoutTemplate className="w-5 h-5 text-indigo-700" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-800 tracking-tight">
              {isAr ? "مركز النماذج الديناميكية" : "Dynamic Forms Center"}
            </h1>
            <p className="text-xs font-bold text-slate-500">
              {isAr ? "بناء واستعراض النماذج الطبية" : "Build and preview medical forms"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          {mode === "preview" && (
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              {(["ER", "OR", "ICU", "WARD"] as const).map(dept => (
                <button
                  key={dept}
                  onClick={() => setPreviewDept(dept)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${previewDept === dept ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {dept} Theme
                </button>
              ))}
            </div>
          )}

          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setMode("build")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${mode === "build" ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Edit3 className="w-4 h-4" />
              {isAr ? "المُنشئ" : "Builder"}
            </button>
            <button
              onClick={() => setMode("preview")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${mode === "preview" ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Eye className="w-4 h-4" />
              {isAr ? "معاينة حسب القسم" : "Department Preview"}
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto relative">
        {mode === "build" ? (
          <div className="animate-fade-in absolute inset-0">
             <SmartFormBuilder language={language} onSave={(form) => {
               setCurrentForm(form);
               setMode("preview");
             }} />
          </div>
        ) : (
          <div className="animate-fade-in absolute inset-0 bg-slate-100">
             <DynamicFormRenderer 
               language={language} 
               template={currentForm} 
               departmentContext={previewDept}
               onSubmit={console.log}
             />
          </div>
        )}
      </div>

    </div>
  );
}
