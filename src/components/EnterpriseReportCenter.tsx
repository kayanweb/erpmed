import React, { useState } from "react";
import { 
  FileText, Printer, Search, Star, Clock, Activity, FileSpreadsheet, 
  File as FileWord, Mail, Share2, Send, Download, Settings, 
  CheckSquare, History, Filter, ChevronDown, Check, X, ShieldCheck, QrCode, FileCheck, User
} from "lucide-react";

interface Props {
  language: "ar" | "en";
  patientId: string;
  patientName: string;
}

const REPORT_CATEGORIES = [
  { id: "all", ar: "جميع التقارير", en: "All Reports" },
  { id: "clinical", ar: "سريرية", en: "Clinical" },
  { id: "lab", ar: "مختبر وبنك دم", en: "Lab & Blood Bank" },
  { id: "rad", ar: "أشعة وتصوير", en: "Radiology" },
  { id: "admin", ar: "إدارية وتسجيل", en: "Administrative" },
  { id: "billing", ar: "فواتير وتأمين", en: "Billing & Insurance" },
  { id: "pharmacy", ar: "صيدلية وأدوية", en: "Pharmacy & Meds" },
];

const REPORTS = [
  // Clinical
  { id: "r1", cat: "clinical", ar: "ملخص الحالة السريري وخروج المريض (Discharge Summary)", en: "Discharge Summary & Discharge Slip", isFav: true },
  { id: "r2", cat: "clinical", ar: "سجل ومخطط العلامات الحيوية المدمج", en: "Integrated Vitals Log & Charts", isFav: false },
  { id: "r8", cat: "clinical", ar: "ملاحظات الطبيب اليومية (Progress Notes)", en: "Doctor Daily Progress Notes", isFav: false },
  { id: "r9", cat: "clinical", ar: "ملاحظات التمريض ومتابعة العلامات السريرية (Nursing Notes)", en: "Nursing Notes & Clinical Tracking", isFav: false },
  { id: "r13", cat: "clinical", ar: "تقرير الإجازة المرضية والشهادة الطبية المعتمدة", en: "Medical Certificate & Certified Sick Leave", isFav: true },
  { id: "r14", cat: "clinical", ar: "طلب إحالة طبي خارجي (External Medical Referral Form)", en: "External Medical Referral Form", isFav: false },
  { id: "r15", cat: "clinical", ar: "تقرير العمليات الجراحية والتخدير التفصيلي", en: "Surgical Procedures & Anesthesia Report", isFav: true },
  { id: "r16", cat: "clinical", ar: "تقرير الرد على الاستشارات الطبية بين الأقسام", en: "Inter-Department Consultation Response Report", isFav: false },
  { id: "r17", cat: "clinical", ar: "تقييم التغذية السريرية والوجبات الموصوفة للمريض", en: "Clinical Nutrition Assessment & Diet Order Report", isFav: false },

  // Lab & Blood Bank
  { id: "r3", cat: "lab", ar: "تقرير نتائج المختبر الشامل والتحاليل التراكمية", en: "Comprehensive Cumulative Lab Report", isFav: true },
  { id: "r11", cat: "lab", ar: "تاريخ تحاليل الدم الكاملة والعد الخلوي (CBC History)", en: "Full Blood Work & CBC History", isFav: false },
  { id: "r18", cat: "lab", ar: "نموذج طلب ومطابقة نقل الدم ومشتقاته (Blood Transfusion Matching)", en: "Blood Transfusion Request & Cross-Matching Form", isFav: false },
  { id: "r19", cat: "lab", ar: "تقرير زراعة الميكروبات واختبار حساسية المضادات الحيوية", en: "Microbiology Culture & Antibiotic Sensitivity Report", isFav: true },
  { id: "r20", cat: "lab", ar: "تقرير فحص الأنسجة والخزعات المخبرية (Histopathology)", en: "Histopathology & Biopsy Report", isFav: false },
  { id: "r21", cat: "lab", ar: "تاريخ وسجل تحليل غازات الدم الشرياني (Arterial Blood Gases History)", en: "Arterial Blood Gases (ABG) Analysis History", isFav: false },
  { id: "r22", cat: "lab", ar: "كشف تحليل البول والبراز التراكمي الشامل", en: "Comprehensive Urinalysis & Stool Analysis Log", isFav: false },

  // Radiology
  { id: "r4", cat: "rad", ar: "تقرير الأشعة المقطعية بالكمبيوتر (CT Scan Report)", en: "Computed Tomography (CT Scan) Report", isFav: false },
  { id: "r12", cat: "rad", ar: "تقرير الرنين المغناطيسي التشخيصي (MRI Report)", en: "Magnetic Resonance Imaging (MRI) Report", isFav: false },
  { id: "r23", cat: "rad", ar: "تقرير تصوير الموجات فوق الصوتية والسونار (Ultrasound Report)", en: "Diagnostic Ultrasound (US) Report", isFav: true },
  { id: "r24", cat: "rad", ar: "تقرير تصوير الثدي الشعاعي (Mammography Report)", en: "Mammography Screening Report", isFav: false },
  { id: "r25", cat: "rad", ar: "تقرير تصوير صدى وجهاز القلب الملون (Echocardiography Report)", en: "Echocardiography (Echo) Diagnostic Report", isFav: false },
  { id: "r26", cat: "rad", ar: "تقرير تصوير الأوعية الدموية بالصبغة والشرايين التاجية", en: "Contrast Angiography & Coronary Imaging Report", isFav: false },
  { id: "r27", cat: "rad", ar: "تقرير الأشعة السينية البسيطة والبانورامية", en: "Standard X-Ray & Panoramic Dental Radiography Report", isFav: false },

  // Administrative
  { id: "r5", cat: "admin", ar: "بطاقة تعريف المريض والوجهة الكاملة (Face Sheet)", en: "Full Patient Face Sheet & Admission Info", isFav: false },
  { id: "r10", cat: "admin", ar: "نموذج إقرار وموافقة دخول المستشفى والعمليات", en: "General Admission & Surgical Procedure Consent", isFav: false },
  { id: "r28", cat: "admin", ar: "سند دخول وخروج رسمي للمريض المنوم (Admission/Discharge Slip)", en: "Official Admission & Discharge Slip", isFav: true },
  { id: "r29", cat: "admin", ar: "إخطار وتصريح مرافقة مريض منوم للأقسام الداخلية", en: "Inpatient Companion Stay Authorization Form", isFav: false },
  { id: "r30", cat: "admin", ar: "شهادة ولادة / إخطار واقعة ولادة رسمي", en: "Official Birth Notification Certificate", isFav: false },
  { id: "r31", cat: "admin", ar: "بيانات التحقق من الهوية والأوراق الرسمية المرفقة", en: "Demographics & Identity Verification Slip", isFav: false },

  // Billing & Insurance
  { id: "r6", cat: "billing", ar: "الفاتورة المجمعة المفصلة للمريض (Detailed Invoice)", en: "Detailed Comprehensive Hospital Invoice", isFav: false },
  { id: "r32", cat: "billing", ar: "نموذج طلب الموافقة الطبية المسبقة لشركات التأمين", en: "Insurance Pre-Authorization Request Form", isFav: true },
  { id: "r33", cat: "billing", ar: "بيان كشف حساب مالي تفصيلي لحركات المريض ماليًا", en: "Patient Financial Statement of Account", isFav: false },
  { id: "r34", cat: "billing", ar: "كشف تفصيلي بنسب تحمل التأمين والشركات المتعاقدة", en: "Co-payment & Deductibles Breakdown Report", isFav: false },
  { id: "r35", cat: "billing", ar: "إيصال وسند قبض/صرف مالي إلكتروني معتمد", en: "Official Receipt & Payment Voucher Ledger", isFav: false },

  // Pharmacy & Meds
  { id: "r7", cat: "pharmacy", ar: "سجل وإثبات إعطاء الأدوية للمريض (MAR)", en: "Medication Administration Record (MAR)", isFav: true },
  { id: "r36", cat: "pharmacy", ar: "وصفة طبية إلكترونية رسمية للعيادات الخارجية", en: "Official Outpatient Electronic Prescription Form", isFav: true },
  { id: "r37", cat: "pharmacy", ar: "نموذج صرف الأدوية المخدرة والتحكم العقلي (Controlled Narcotics)", en: "Controlled Narcotics & Psychotropic Dispensing Form", isFav: false },
  { id: "r38", cat: "pharmacy", ar: "تنبيهات وسجل تداخلات الأدوية والأعراض الجانبية الموثقة", en: "Drug-Drug Interaction & Adverse Reactions Log", isFav: false },
  { id: "r39", cat: "pharmacy", ar: "خطة إرشاد وتثقيف المريض على الأدوية عند الخروج", en: "Discharge Medication Counseling & Guidance Plan", isFav: false },
];

export function EnterpriseReportCenter({ language, patientId, patientName }: Props) {
  const isAr = language === "ar";
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  
  // Settings Panel State
  const [showSettings, setShowSettings] = useState(false);
  const [reportLang, setReportLang] = useState("bilingual");
  const [reportFormat, setReportFormat] = useState("full");
  const [dateRange, setDateRange] = useState("all");
  const [addSignature, setAddSignature] = useState(true);
  const [addBarcode, setAddBarcode] = useState(true);

  // Print History
  const [showHistory, setShowHistory] = useState(false);

  const filteredReports = REPORTS.filter(r => {
    if (activeCategory !== "all" && r.cat !== activeCategory) return false;
    const q = searchQuery.toLowerCase();
    return r.ar.toLowerCase().includes(q) || r.en.toLowerCase().includes(q);
  });

  const toggleReportSelection = (id: string) => {
    setSelectedReports(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleAction = (actionName: string) => {
    if (selectedReports.length === 0) {
      alert(isAr ? "الرجاء اختيار تقرير واحد على الأقل" : "Please select at least one report");
      return;
    }
    alert(`${isAr ? "تم تنفيذ:" : "Action Executed:"} ${actionName}\n${isAr ? "التقارير:" : "Reports:"} ${selectedReports.length}`);
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50 relative overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
      {/* Top Header */}
      <div className="bg-white p-4 border-b border-slate-200 shrink-0 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Printer className="w-6 h-6 text-indigo-600" />
            {isAr ? "مركز طباعة التقارير المتقدم (Enterprise Report Center)" : "Enterprise Report Center"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isAr ? `إدارة وطباعة ومشاركة تقارير المريض: ${patientName}` : `Manage, print, and share reports for: ${patientName}`}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold flex items-center gap-2 transition"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">{isAr ? "سجل الطباعة" : "Print History"}</span>
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${showSettings ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">{isAr ? "إعدادات الطباعة" : "Print Settings"}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Main Workspace */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Filters & Search */}
          <div className="bg-white border-b border-slate-200 p-3 shrink-0 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className={`absolute ${isAr ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
              <input 
                type="text" 
                placeholder={isAr ? "البحث في التقارير..." : "Search reports..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-slate-50 border border-slate-200 rounded-lg py-2 ${isAr ? "pr-9 pl-3" : "pl-9 pr-3"} text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 md:pb-0">
              {REPORT_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${activeCategory === cat.id ? "bg-indigo-600 text-white shadow-md" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                >
                  {isAr ? cat.ar : cat.en}
                </button>
              ))}
            </div>
          </div>

          {/* Report List */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {filteredReports.map(report => {
                const isSelected = selectedReports.includes(report.id);
                return (
                  <div 
                    key={report.id}
                    onClick={() => toggleReportSelection(report.id)}
                    className={`bg-white border ${isSelected ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-md' : 'border-slate-200 shadow-sm'} rounded-xl p-3 cursor-pointer hover:border-indigo-300 transition group flex gap-3`}
                  >
                    <div className="pt-1">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-slate-50'}`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-sm text-slate-800 leading-tight">
                          {isAr ? report.ar : report.en}
                        </h4>
                        {report.isFav && <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />}
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded">ID: {report.id.toUpperCase()}</span>
                        <span>•</span>
                        <span>{REPORT_CATEGORIES.find(c => c.id === report.cat)?.en}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {filteredReports.length === 0 && (
              <div className="h-40 flex flex-col items-center justify-center text-slate-400">
                <FileText className="w-10 h-10 mb-2 opacity-20" />
                <p>{isAr ? "لم يتم العثور على تقارير" : "No reports found"}</p>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="bg-white border-t border-slate-200 p-3 shrink-0">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-sm font-bold text-slate-700">
                {selectedReports.length} {isAr ? "تم اختيارها" : "selected"}
              </div>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
                <button onClick={() => handleAction("Preview")} className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" /> {isAr ? "معاينة" : "Preview"}
                </button>
                <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>
                
                <button onClick={() => handleAction("PDF")} className="px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-red-200">
                  <FileText className="w-3.5 h-3.5" /> PDF
                </button>
                <button onClick={() => handleAction("Excel")} className="px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-emerald-200">
                  <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
                </button>
                <button onClick={() => handleAction("Word")} className="px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-blue-200">
                  <FileWord className="w-3.5 h-3.5" /> Word
                </button>
                
                <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>
                
                <button onClick={() => handleAction("Share/Send")} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5" /> {isAr ? "مشاركة" : "Share"}
                </button>
                
                <button onClick={() => handleAction("Direct Print")} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-black flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:translate-y-0.5 transition">
                  <Printer className="w-4 h-4" /> {isAr ? "طباعة جماعية" : "Bulk Print"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Settings & History */}
        {(showSettings || showHistory) && (
          <div className={`w-80 bg-white border-${isAr ? "r" : "l"} border-slate-200 flex flex-col shrink-0 animate-fade-in`}>
            <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-sm text-slate-800">
                {showSettings ? (isAr ? "إعدادات الطباعة المتقدمة" : "Advanced Print Settings") : (isAr ? "سجل الطباعة والأرشيف" : "Print History & Archive")}
              </h3>
              <button onClick={() => {setShowSettings(false); setShowHistory(false);}} className="p-1 hover:bg-slate-200 rounded text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-5">
              {showSettings && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">{isAr ? "لغة التقرير" : "Report Language"}</label>
                    <select value={reportLang} onChange={e => setReportLang(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500">
                      <option value="ar">{isAr ? "عربي فقط" : "Arabic Only"}</option>
                      <option value="en">{isAr ? "إنجليزي فقط" : "English Only"}</option>
                      <option value="bilingual">{isAr ? "ثنائي اللغة (عربي/إنجليزي)" : "Bilingual (AR/EN)"}</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">{isAr ? "نوع التقرير" : "Report Type"}</label>
                    <select value={reportFormat} onChange={e => setReportFormat(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500">
                      <option value="brief">{isAr ? "مختصر" : "Brief / Summary"}</option>
                      <option value="full">{isAr ? "شامل (كامل البيانات)" : "Full / Comprehensive"}</option>
                      <option value="custom">{isAr ? "مخصص (اختيار الحقول)" : "Custom Fields"}</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">{isAr ? "الفترة الزمنية للبيانات" : "Data Date Range"}</label>
                    <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500">
                      <option value="visit">{isAr ? "الزيارة الحالية فقط" : "Current Visit Only"}</option>
                      <option value="month">{isAr ? "آخر شهر" : "Last Month"}</option>
                      <option value="year">{isAr ? "آخر سنة" : "Last Year"}</option>
                      <option value="all">{isAr ? "جميع الزيارات (التاريخ الكامل)" : "All History"}</option>
                    </select>
                  </div>
                  
                  <div className="space-y-3 pt-3 border-t border-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" checked={addSignature} onChange={e => setAddSignature(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition">{isAr ? "تضمين التوقيع والختم الإلكتروني" : "Include e-Signature & Seal"}</span>
                        <span className="text-[10px] text-slate-500">{isAr ? "مطلوب للتقارير الرسمية" : "Required for official reports"}</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" checked={addBarcode} onChange={e => setAddBarcode(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition">{isAr ? "إضافة Barcode / QR Code" : "Add Barcode / QR Code"}</span>
                        <span className="text-[10px] text-slate-500">{isAr ? "للتحقق من صحة التقرير" : "For report authenticity validation"}</span>
                      </div>
                    </label>
                  </div>
                  
                  <div className="pt-4">
                    <button className="w-full py-2 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-900 transition flex items-center justify-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      {isAr ? "تطبيق وحفظ الإعدادات" : "Apply & Save Settings"}
                    </button>
                  </div>
                </>
              )}
              
              {showHistory && (
                <div className="space-y-4">
                  {[1,2,3].map((_, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs space-y-2">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span>{isAr ? "ملخص الحالة السريري" : "Discharge Summary"}</span>
                        <span className="text-[10px] text-slate-400 font-mono">10:45 AM</span>
                      </div>
                      <div className="text-slate-500 flex items-center gap-1">
                        <User className="w-3 h-3" /> Dr. Ahmed (Admin)
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button className="text-indigo-600 hover:underline font-bold">{isAr ? "إعادة طباعة" : "Reprint"}</button>
                        <button className="text-slate-600 hover:underline">{isAr ? "عرض" : "View"}</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
