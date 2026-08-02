import React, { useState } from "react";
import { Activity, X, AlertCircle, Info, Stethoscope, Search } from "lucide-react";
import { toast } from "sonner";

const RADIOLOGY_CATALOG = {
  "X-Ray (أشعة عادية)": [
    "Chest X-Ray Portable (أشعة صدر متنقلة)",
    "Chest X-Ray PA & LAT (أشعة صدر خلفية أمامية وجانبية)",
    "X-Ray Abdomen Erect & Supine (أشعة بطن وضع الوقوف والاستلقاء)",
    "X-Ray KUB (أشعة مسالك بولية)",
    "X-Ray Cervical Spine (أشعة فقرات عنقية)",
    "X-Ray Lumbo-Sacral Spine (أشعة فقرات قطنية عجزية)",
    "X-Ray Pelvis (أشعة حوض)",
    "X-Ray Shoulder Joint (أشعة مفصل الكتف)",
    "X-Ray Knee Joint (أشعة مفصل الركبة)",
    "X-Ray Foot/Ankle (أشعة قدم/كاحل)",
    "X-Ray Hand/Wrist (أشعة يد/رسغ)",
    "X-Ray Skull (أشعة جمجمة)"
  ],
  "CT Scan (أشعة مقطعية)": [
    "CT Brain W/O Contrast (أشعة مقطعية للمخ بدون صبغة)",
    "CT Brain W/ Contrast (أشعة مقطعية للمخ بالصبغة)",
    "CT Chest W/O Contrast (أشعة مقطعية للصدر بدون صبغة)",
    "CT Chest HRCT (أشعة مقطعية عالية الدقة للصدر)",
    "CT Abdomen & Pelvis W/ Contrast (أشعة مقطعية للبطن والحوض بالصبغة)",
    "CT Abdomen & Pelvis W/O Contrast (أشعة مقطعية للبطن والحوض بدون صبغة)",
    "CT KUB (أشعة مقطعية للمسالك البولية بدون صبغة)",
    "CT Angiography Pulmonary (أشعة مقطعية بالصبغة لشرايين الرئة - لاستبعاد الجلطة)",
    "CT Angiography Brain (أشعة مقطعية بالصبغة لشرايين المخ)",
    "CT Spine (Cervical/Dorsal/Lumbar) (أشعة مقطعية للعمود الفقري)"
  ],
  "MRI (رنين مغناطيسي)": [
    "MRI Brain W/O Contrast (رنين مغناطيسي على المخ بدون صبغة)",
    "MRI Brain W/ Contrast (رنين مغناطيسي على المخ بالصبغة)",
    "MRI Cervical Spine (رنين مغناطيسي للفقرات العنقية)",
    "MRI Lumbo-Sacral Spine (رنين مغناطيسي للفقرات القطنية العجزية)",
    "MRI Abdomen (رنين مغناطيسي للبطن)",
    "MRI Pelvis (رنين مغناطيسي للحوض)",
    "MRCP (رنين مغناطيسي للقنوات المرارية)",
    "MRI Knee Joint (رنين مغناطيسي لمفصل الركبة)",
    "MRI Shoulder Joint (رنين مغناطيسي لمفصل الكتف)"
  ],
  "Ultrasound (موجات فوق صوتية)": [
    "US Abdomen & Pelvis (أشعة تلفزيونية للبطن والحوض)",
    "US KUB (أشعة تلفزيونية للمسالك البولية)",
    "US Thyroid (أشعة تلفزيونية للغدة الدرقية)",
    "US Neck (أشعة تلفزيونية للرقبة)",
    "US Breast (أشعة تلفزيونية للثدي)",
    "US Scrotum/Testes (أشعة تلفزيونية للخصيتين)",
    "US Doppler Lower Limb Venous (دوبلر أوردة الطرف السفلي لاستبعاد الجلطة)",
    "US Doppler Lower Limb Arterial (دوبلر شرايين الطرف السفلي)",
    "US Doppler Carotid (دوبلر الشرايين السباتية بالرقبة)",
    "ECHO Cardiography (أشعة تلفزيونية على القلب - إيكو)"
  ],
  "Nuclear/PET (طب نووي وبوزيتروني)": [
    "PET/CT Whole Body (مسح ذري بوزيتروني للجسم بالكامل)",
    "Bone Scan (مسح ذري للعظام)",
    "Thyroid Scan (مسح ذري للغدة الدرقية)",
    "Renal Scan DTPA (مسح ذري للكلى - دي تي بي إيه)",
    "Renal Scan DMSA (مسح ذري للكلى - دي إم إس إيه)",
    "Myocardial Perfusion Scan (مسح ذري لتروية عضلة القلب)"
  ],
  "Fluoroscopy (تصوير فلوروسكوبي)": [
    "Barium Swallow (أشعة بالصبغة على المريء)",
    "Barium Meal (أشعة بالصبغة على المعدة)",
    "Barium Follow Through (أشعة بالصبغة على الأمعاء الدقيقة)",
    "Barium Enema (أشعة بالصبغة على القولون)",
    "HSG - Hysterosalpingogram (أشعة بالصبغة على الرحم والأنابيب)",
    "IVP - Intravenous Pyelogram (أشعة بالصبغة على المسالك البولية)"
  ]
};

interface RadiologyOrderFormProps {
  isAr: boolean;
  onClose: () => void;
  onSubmit: (orderData: any) => void;
  patientGender?: string;
}

export function RadiologyOrderForm({ isAr, onClose, onSubmit, patientGender }: RadiologyOrderFormProps) {
  const [activeTab, setActiveTab] = useState<string>("X-Ray (أشعة عادية)");
  const [selectedProcedures, setSelectedProcedures] = useState<string[]>([]);
  const [urgency, setUrgency] = useState<"Routine" | "Urgent" | "STAT">("Routine");
  const [clinicalIndication, setClinicalIndication] = useState("");
  const [transportMode, setTransportMode] = useState<"Ambulatory" | "Wheelchair" | "Stretcher" | "Portable/Bedside">("Ambulatory");
  const [pregnancyStatus, setPregnancyStatus] = useState<"Not Pregnant" | "Pregnant" | "Unknown" | "N/A">(
    patientGender === "Female" ? "Unknown" : "N/A"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const toggleProcedure = (proc: string) => {
    setSelectedProcedures(prev => 
      prev.includes(proc) ? prev.filter(p => p !== proc) : [...prev, proc]
    );
  };

  const handleDispatch = () => {
    if (selectedProcedures.length === 0) {
      toast.error(isAr ? "الرجاء اختيار فحص واحد على الأقل" : "Please select at least one procedure");
      return;
    }
    if (!clinicalIndication.trim()) {
      toast.error(isAr ? "الرجاء كتابة دواعي الفحص السريرية" : "Please provide the clinical indication");
      return;
    }

    const orderData = {
      procedures: selectedProcedures,
      urgency,
      clinicalIndication,
      transportMode,
      pregnancyStatus,
      timestamp: new Date().toISOString()
    };

    onSubmit(orderData);
  };

  const currentCategoryProcedures = RADIOLOGY_CATALOG[activeTab as keyof typeof RADIOLOGY_CATALOG].filter(proc => proc.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-modal flex items-center justify-center p-4 animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-500" />
            {isAr ? "نظام طلبات الأشعة الشامل (CPOE - Radiology)" : "Comprehensive Radiology CPOE Order"}
          </h2>
          <button onClick={onClose} className="hover:bg-slate-700 p-2 rounded-lg transition text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row bg-slate-50">
          {/* Left Panel: Selectors */}
          <div className="md:w-3/5 border-b md:border-b-0 md:border-e border-slate-200 bg-white flex flex-col">
            <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className={`absolute ${isAr ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? "بحث عن أشعة..." : "Search procedures..."}
                  className={`w-full bg-white border border-slate-300 rounded-lg text-sm p-2 outline-none focus:border-amber-500 transition-colors ${isAr ? "pr-9" : "pl-9"}`}
                />
              </div>
            </div>
            
            {/* Horizontal Tabs for Modalities */}
            <div className="flex overflow-x-auto border-b border-slate-200 hide-scrollbar bg-slate-50 shrink-0">
              {Object.keys(RADIOLOGY_CATALOG).map(category => (
                <button
                  key={category}
                  onClick={() => setActiveTab(category)}
                  className={`whitespace-nowrap px-4 py-3 text-xs font-bold transition-colors border-b-2 ${
                    activeTab === category 
                      ? "border-amber-500 text-amber-700 bg-amber-50/50" 
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Procedures List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {currentCategoryProcedures.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm font-semibold">
                  {isAr ? "لا يوجد نتائج مطابقة للبحث" : "No procedures found"}
                </div>
              ) : (
                currentCategoryProcedures.map(proc => {
                  const isSelected = selectedProcedures.includes(proc);
                  return (
                    <div 
                      key={proc}
                      onClick={() => toggleProcedure(proc)}
                      className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        isSelected 
                          ? "bg-amber-50 border-amber-300 shadow-sm" 
                          : "bg-white border-slate-200 hover:border-amber-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                        isSelected ? "bg-amber-500 border-amber-600 text-white" : "border-slate-300 bg-slate-50"
                      }`}>
                        {isSelected && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                      <span className={`text-sm font-semibold ${isSelected ? "text-amber-900" : "text-slate-700"}`}>
                        {proc}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Panel: Order Details */}
          <div className="md:w-2/5 p-5 space-y-5 overflow-y-auto bg-slate-50">
            {/* Selected Summary */}
            <div className="bg-amber-100/50 border border-amber-200 rounded-xl p-4">
              <h3 className="text-xs font-black text-amber-800 uppercase tracking-wider mb-2">
                {isAr ? "الفحوصات المحددة" : "Selected Procedures"}
              </h3>
              <div className="space-y-1">
                {selectedProcedures.length === 0 ? (
                  <p className="text-xs text-amber-600/70 font-bold italic">
                    {isAr ? "لم يتم تحديد أي فحص بعد" : "No procedures selected yet"}
                  </p>
                ) : (
                  selectedProcedures.map((p, i) => (
                    <div key={i} className="text-xs font-bold text-amber-900 flex items-start gap-1.5">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>{p}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Urgency */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                {isAr ? "درجة الأهمية / الاستعجال" : "Urgency"}
              </label>
              <div className="flex gap-2 min-w-max">
                {(["Routine", "Urgent", "STAT"] as const).map(u => (
                  <button
                    key={u}
                    onClick={() => setUrgency(u)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors ${
                      urgency === u 
                        ? u === "STAT" ? "bg-rose-100 border-rose-300 text-rose-700" : "bg-blue-100 border-blue-300 text-blue-700"
                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {u === "STAT" ? (isAr ? "طوارئ قصوى (STAT)" : "STAT") : u === "Urgent" ? (isAr ? "عاجل" : "Urgent") : (isAr ? "عادي (Routine)" : "Routine")}
                  </button>
                ))}
              </div>
            </div>

            {/* Transport Mode */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                {isAr ? "طريقة نقل المريض" : "Transport Mode"}
              </label>
              <select 
                value={transportMode}
                onChange={(e: any) => setTransportMode(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg text-sm p-2.5 outline-none focus:border-amber-500 font-semibold text-slate-700"
              >
                <option value="Ambulatory">{isAr ? "مشي (Ambulatory)" : "Ambulatory"}</option>
                <option value="Wheelchair">{isAr ? "كرسي متحرك (Wheelchair)" : "Wheelchair"}</option>
                <option value="Stretcher">{isAr ? "سرير نقال (Stretcher)" : "Stretcher"}</option>
                <option value="Portable/Bedside">{isAr ? "جهاز محمول للسرير (Portable)" : "Portable/Bedside"}</option>
              </select>
            </div>

            {/* Pregnancy Status (if applicable) */}
            {pregnancyStatus !== "N/A" && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                  {isAr ? "حالة الحمل (للإناث)" : "Pregnancy Status (Females)"}
                </label>
                <div className="flex gap-2 min-w-max">
                  {(["Not Pregnant", "Pregnant", "Unknown"] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setPregnancyStatus(p)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        pregnancyStatus === p 
                          ? p === "Pregnant" ? "bg-rose-100 border-rose-300 text-rose-700" : "bg-amber-100 border-amber-300 text-amber-800"
                          : "bg-white border-slate-200 text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {p === "Pregnant" ? (isAr ? "حامل" : "Pregnant") : p === "Not Pregnant" ? (isAr ? "غير حامل" : "Not Pregnant") : (isAr ? "غير معروف" : "Unknown")}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clinical Indication */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-slate-500" />
                {isAr ? "دواعي الفحص السريرية (إجباري)" : "Clinical Indication (Required)"}
              </label>
              <textarea
                value={clinicalIndication}
                onChange={(e) => setClinicalIndication(e.target.value)}
                placeholder={isAr ? "اكتب الأعراض، التشخيص المبدئي، أو سبب طلب الأشعة..." : "Enter symptoms, provisional diagnosis, or reason for scan..."}
                className="w-full bg-white border border-slate-300 rounded-lg text-sm p-3 outline-none focus:border-amber-500 font-medium min-h-[100px] resize-none"
              ></textarea>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-between items-center shrink-0">
          <div className="text-[10px] text-slate-400 flex items-center gap-1.5 hidden sm:flex">
            <Info className="w-3.5 h-3.5" />
            {isAr ? "سيتم إشعار فني الأشعة ونظام الـ RIS فوراً" : "RIS and Tech will be notified instantly"}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={onClose} className="flex-1 sm:flex-none px-6 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-sm font-bold text-slate-300 hover:bg-slate-700 transition cursor-pointer">
              {isAr ? "إلغاء" : "Cancel"}
            </button>
            <button 
              onClick={handleDispatch}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-lg text-sm font-black shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Activity className="w-4 h-4" />
              {isAr ? "تأكيد التوقيع وإرسال الطلب (RIS)" : "Sign & Dispatch RIS Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
