import React, { useState, useRef, useEffect } from "react";
import { useHIS } from "../context/HISContext";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { saveSetting, syncSetting } from "../lib/storage";
import {
  FileText,
  Printer,
  Settings,
  Shield,
  Download,
  Share2,
  Mail,
  Eye,
  CheckSquare,
  Square,
  FileDigit,
  Fingerprint,
  Stamp,
  Layers,
  Layout,
  FileSignature,
  FileImage,
  History,
  Lock,
  BadgeCheck,
  Siren,
  Zap,
  Activity,
  LogOut,
  Wind
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "en" | "ar";
  activePatient?: { patientId: string; patientName: string; initialTab?: string } | null;
}

export const ReportCenter: React.FC<Props> = ({ language, activePatient }) => {
  const isAr = language === "ar";
  const { patients, currentUser } = useHIS();
  const reportRef = useRef<HTMLDivElement>(null);
  
  const [selectedPatientId, setSelectedPatientId] = useState<string>(activePatient?.patientId || "");
  const [activeTab, setActiveTab] = useState("clinical");
  const [selectedFormat, setSelectedFormat] = useState("A4 Portrait");
  const [selectedLanguage, setSelectedLanguage] = useState("bilingual");
  const [selectedScope, setSelectedScope] = useState("current_visit");

  const [toggles, setToggles] = useState<Record<string, boolean>>({
    patient_data: true,
    patient_photo: true,
    barcode: true,
    qr_code: true,
    vital_signs: true,
    lab_results: true,
    radiology: true,
    medications: true,
    doctor_signature: true,
    confidential: true,
    watermark: true,
    hospital_logo: true,
  });

  // Load saved configuration on mount
  useEffect(() => {
    const unsub = syncSetting('report_center_config', (data) => {
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        if (data.toggles) setToggles(data.toggles);
        if (data.selectedFormat) setSelectedFormat(data.selectedFormat);
        if (data.selectedLanguage) setSelectedLanguage(data.selectedLanguage);
      }
    });
    return () => unsub();
  }, []);

  const saveConfig = async (newToggles?: Record<string, boolean>) => {
    const config = {
      toggles: newToggles || toggles,
      selectedFormat,
      selectedLanguage,
      updatedBy: currentUser?.id,
      updatedAt: new Date().toISOString()
    };
    try {
      await saveSetting('report_center_config', config);
      toast.success(isAr ? "تم حفظ الإعدادات" : "Configuration saved");
    } catch (err) {
      console.error("Failed to save report config:", err);
    }
  };

  const toggle = (key: string) => {
    const next = { ...toggles, [key]: !toggles[key] };
    setToggles(next);
    // Auto-save debounced or on change
    saveConfig(next);
  };

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Report_${selectedPatientId || 'NoPatient'}`,
  });

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      const title = `Report for Patient: ${String(selectedPatientId || 'N/A')}`;
      doc.text(title, 10, 10);
      if (patientData) {
        doc.text(`Patient Name: ${String(patientData.name || patientData.nameEn || 'N/A')}`, 10, 20);
        doc.text(`File Number / MRN: ${String(patientData.id || patientData.mrn || 'N/A')}`, 10, 30);
      }
      doc.save(`Report_${selectedPatientId || 'NoPatient'}.pdf`);
    } catch (err) {
      console.error("PDF generation error in ReportCenter:", err);
      toast.error("Failed to generate PDF document");
    }
  };

  const getPatientData = () => {
    return patients.find(p => p.id === selectedPatientId);
  };

  const patientData = getPatientData();

  // Helper for rendering the report preview
  const ReportPreview = () => (
    <div ref={reportRef} className="bg-white p-8 border shadow-lg" style={{ width: '210mm', minHeight: '297mm' }}>
      {patientData ? (
        <div>
          <h1 className="text-xl font-bold text-center">{toggles.hospital_logo && "Hospital Logo"}</h1>
          <h2 className="text-lg font-semibold text-center border-b pb-2 mb-4">{isAr ? "تقرير طبي" : "Medical Report"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <p><strong>{isAr ? "اسم المريض:" : "Patient Name:"}</strong> {patientData.name}</p>
            <p><strong>{isAr ? "رقم الملف:" : "File Number:"}</strong> {patientData.id}</p>
          </div>
          {/* ... Add more report content based on toggles ... */}
        </div>
      ) : (
        <div className="text-center p-10 text-slate-500">
          {isAr ? "يرجى اختيار مريض لعرض التقرير" : "Please select a patient to view the report"}
        </div>
      )}
    </div>
  );

  const Activity = Layers; 
  const TestTube = FileDigit;
  const Monitor = Layout;
  const Pill = Shield;
  const Building = Settings;

  const reportCategories = [
    { id: "clinical", icon: FileText, labelAr: "التقارير السريرية", labelEn: "Clinical Reports" },
    { id: "nursing", icon: Activity, labelAr: "تقارير التمريض", labelEn: "Nursing Reports" },
    { id: "lab", icon: TestTube, labelAr: "المختبر", labelEn: "Laboratory" },
    { id: "radiology", icon: Monitor, labelAr: "الأشعة", labelEn: "Radiology" },
    { id: "pharmacy", icon: Pill, labelAr: "الصيدلية", labelEn: "Pharmacy" },
    { id: "admin", icon: Building, labelAr: "الإدارة", labelEn: "Administration" },
  ];

  return (
    <div className={`p-6 w-full space-y-6 ${isAr ? "text-right" : "text-left"}`} dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 shadow-xl text-white flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          <div className="p-3 bg-pink-500/20 rounded-xl">
            <Printer className="w-5 h-5 sm:w-8 sm:h-8 text-pink-400" />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black">{isAr ? "مركز طباعة التقارير" : "Enterprise Report Center"}</h1>
            <p className="text-slate-300 text-sm mt-1">
              {isAr ? "نظام متكامل لتوليد، تصميم، طباعة، وأرشفة التقارير الطبية والإدارية" : "Integrated system for generation, design, printing, and archiving of reports"}
            </p>
          </div>
        </div>
        <div className="flex gap-2 min-w-max">
          <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Settings className="w-4 h-4" />
            {isAr ? "قوالب الطباعة" : "Print Templates"}
          </button>
          <button className="px-4 py-2 bg-pink-600 hover:bg-pink-500 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-pink-600/30 flex items-center gap-2" onClick={() => toast.success("Operation completed successfully!")}>
            <Layers className="w-4 h-4" />
            {isAr ? "طباعة مجمعة" : "Batch Print"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Report Selection */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <h3 className="font-bold text-slate-800 mb-4">{isAr ? "1. اختيار المريض والتقرير" : "1. Select Patient & Report"}</h3>
            <select 
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm mb-4"
            >
              <option value="">{isAr ? "اختر مريضاً" : "Select Patient"}</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <div className="space-y-1">
              {reportCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === cat.id 
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-100" 
                      : "text-slate-600 hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <cat.icon className={`w-5 h-5 ${activeTab === cat.id ? "text-indigo-600" : "text-slate-400"}`} />
                  {isAr ? cat.labelAr : cat.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Scope Selection */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              {isAr ? "2. نطاق البيانات" : "2. Data Scope"}
            </h3>
            <select 
              value={selectedScope}
              onChange={(e) => setSelectedScope(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="current_visit">{isAr ? "الزيارة الحالية" : "Current Visit"}</option>
              <option value="all_visits">{isAr ? "جميع الزيارات" : "All Visits"}</option>
              <option value="last_visit">{isAr ? "آخر زيارة" : "Last Visit"}</option>
              <option value="by_date">{isAr ? "حسب التاريخ" : "By Date"}</option>
              <option value="by_dept">{isAr ? "حسب القسم" : "By Department"}</option>
            </select>
          </div>

          {/* Format & Language */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Layout className="w-4 h-4 text-slate-400" />
              {isAr ? "3 & 4. الشكل واللغة" : "3 & 4. Format & Language"}
            </h3>
            <div className="space-y-3">
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
              >
                <option value="ar">عربي</option>
                <option value="en">English</option>
                <option value="bilingual">ثنائي اللغة (Bilingual)</option>
              </select>
              <select 
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
              >
                <option value="A4 Portrait">A4 Portrait</option>
                <option value="A4 Landscape">A4 Landscape</option>
                <option value="A5">A5</option>
                <option value="Thermal">Thermal Receipt</option>
              </select>
            </div>
          </div>
        </div>

        {/* Middle Column: Configuration */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-500" />
              {isAr ? "تكوين التقرير" : "Report Configuration"}
            </h3>

            {/* Content Checkboxes */}
            <div className="mb-8">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                {isAr ? "5. محتويات التقرير" : "5. Report Contents"}
              </h4>
              <div className="grid grid-cols-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { id: "patient_data", labelAr: "بيانات المريض", labelEn: "Patient Data" },
                  { id: "patient_photo", labelAr: "صورة المريض", labelEn: "Patient Photo" },
                  { id: "barcode", labelAr: "Barcode", labelEn: "Barcode" },
                  { id: "qr_code", labelAr: "QR Code", labelEn: "QR Code" },
                  { id: "vital_signs", labelAr: "العلامات الحيوية", labelEn: "Vital Signs" },
                  { id: "lab_results", labelAr: "نتائج المختبر", labelEn: "Lab Results" },
                  { id: "radiology", labelAr: "الأشعة", labelEn: "Radiology" },
                  { id: "medications", labelAr: "الأدوية", labelEn: "Medications" },
                  { id: "timeline", labelAr: "Timeline", labelEn: "Timeline" },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-sm font-bold ${
                      toggles[item.id] 
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100" 
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {toggles[item.id] ? (
                      <CheckSquare className="w-4 h-4 text-white flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    )}
                    <span className="truncate">{isAr ? item.labelAr : item.labelEn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Signatures & Identity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <FileSignature className="w-4 h-4" />
                  {isAr ? "6. التوقيعات" : "6. Signatures"}
                </h4>
                <div className="space-y-3">
                  {[
                    { id: "doctor_signature", labelAr: "توقيع الطبيب", labelEn: "Doctor Signature" },
                    { id: "consultant_signature", labelAr: "توقيع الاستشاري", labelEn: "Consultant Signature" },
                    { id: "nurse_signature", labelAr: "توقيع التمريض", labelEn: "Nurse Signature" },
                    { id: "e_signature", labelAr: "توقيع إلكتروني", labelEn: "Digital Signature" },
                  ].map(item => (
                    <button 
                      key={item.id} 
                      onClick={() => toggle(item.id)} 
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all text-sm font-bold w-full ${
                        toggles[item.id] 
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100" 
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {toggles[item.id] ? <CheckSquare className="w-4 h-4 text-white" /> : <Square className="w-4 h-4 text-slate-300" />}
                      <span className="truncate">{isAr ? item.labelAr : item.labelEn}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Stamp className="w-4 h-4" />
                  {isAr ? "7. الهوية البصرية" : "7. Visual Identity"}
                </h4>
                <div className="space-y-3">
                  {[
                    { id: "hospital_logo", labelAr: "شعار المستشفى", labelEn: "Hospital Logo" },
                    { id: "official_stamp", labelAr: "الختم الرسمي", labelEn: "Official Stamp" },
                    { id: "watermark", labelAr: "Watermark", labelEn: "Watermark" },
                    { id: "page_numbers", labelAr: "رقم الصفحة", labelEn: "Page Numbers" },
                  ].map(item => (
                    <button 
                      key={item.id} 
                      onClick={() => toggle(item.id)} 
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all text-sm font-bold w-full ${
                        toggles[item.id] 
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100" 
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {toggles[item.id] ? <CheckSquare className="w-4 h-4 text-white" /> : <Square className="w-4 h-4 text-slate-300" />}
                      <span className="truncate">{isAr ? item.labelAr : item.labelEn}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-8">
              <h4 className="text-sm font-bold text-orange-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                {isAr ? "9. الأمان والخصوصية" : "9. Security & Privacy"}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: "confidential", labelAr: "Confidential", labelEn: "Confidential" },
                  { id: "mask_id", labelAr: "Mask National ID", labelEn: "Mask National ID" },
                  { id: "patient_copy", labelAr: "نسخة للمريض", labelEn: "Patient Copy" },
                  { id: "hide_sensitive", labelAr: "إخفاء البيانات الحساسة", labelEn: "Hide Sensitive Data" },
                ].map(item => (
                  <button key={item.id} onClick={() => toggle(item.id)} className="flex items-center gap-2 text-sm text-orange-900">
                    {toggles[item.id] ? <CheckSquare className="w-4 h-4 text-orange-600" /> : <Square className="w-4 h-4 text-orange-300" />}
                    {isAr ? item.labelAr : item.labelEn}
                  </button>
                ))}
              </div>
            </div>

            <h3 className="font-bold text-slate-800 text-lg mb-6">{isAr ? "معاينة التقرير" : "Report Preview"}</h3>
            <ReportPreview />

          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-4 text-white">
            <h3 className="font-bold text-slate-100 mb-4">{isAr ? "8. خيارات الطباعة" : "8. Print Options"}</h3>
            
            <div className="space-y-2">
              <button onClick={() => toast.info("Preview functionality is integrated with the preview area.")} className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition-colors">
                <Eye className="w-4 h-4" />
                {isAr ? "معاينة (Preview)" : "Preview"}
              </button>
              <button onClick={handlePrint} className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-colors">
                <Printer className="w-4 h-4" />
                {isAr ? "طباعة مباشرة" : "Direct Print"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
              <button onClick={generatePDF} className="flex flex-col items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-medium transition-colors">
                <FileDigit className="w-5 h-5 text-red-400" />
                PDF
              </button>
              <button onClick={() => toast.success("Operation completed successfully!")} className="flex flex-col items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-medium transition-colors">
                <FileText className="w-5 h-5 text-blue-400" />
                Word
              </button>
              <button onClick={() => toast.success("Operation completed successfully!")} className="flex flex-col items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-medium transition-colors">
                <Mail className="w-5 h-5 text-emerald-400" />
                {isAr ? "إرسال بالبريد" : "Email"}
              </button>
              <button onClick={() => toast.success("Operation completed successfully!")} className="flex flex-col items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-medium transition-colors">
                <Share2 className="w-5 h-5 text-purple-400" />
                {isAr ? "مشاركة" : "Share"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <h3 className="font-bold text-slate-800 mb-3 text-sm">{isAr ? "10. خيارات متقدمة" : "10. Advanced"}</h3>
            <div className="space-y-2">
              <button className="w-full text-right text-sm text-slate-600 hover:text-indigo-600 py-1 transition-colors flex items-center gap-2">
                <Layers className="w-4 h-4" /> {isAr ? "دمج عدة تقارير فى PDF واحد" : "Merge into Single PDF"}
              </button>
              <button className="w-full text-right text-sm text-slate-600 hover:text-indigo-600 py-1 transition-colors flex items-center gap-2">
                <FileImage className="w-4 h-4" /> {isAr ? "إضافة صفحة غلاف وفهرس" : "Add Cover & Index"}
              </button>
              <button className="w-full text-right text-sm text-slate-600 hover:text-indigo-600 py-1 transition-colors flex items-center gap-2">
                <Fingerprint className="w-4 h-4" /> {isAr ? "ختم زمني (Timestamp)" : "Timestamp"}
              </button>
              <button className="w-full text-right text-sm text-slate-600 hover:text-indigo-600 py-1 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" /> {isAr ? "أرشفة في السجل الطبي" : "Archive to EMR"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReportCenter;
