import React, { useState, useMemo } from "react";
import { 
  User, 
  Shield, 
  Stethoscope, 
  Bed, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Search,
  Zap,
  Sparkles,
  Activity,
  Heart,
  Pill,
  Clock,
  Printer,
  QrCode,
  Check,
  ChevronRight,
  UserCheck,
  Building,
  AlertTriangle,
  RefreshCw,
  Plus,
  ShieldCheck,
  FileSpreadsheet
} from "lucide-react";
import { toast } from "sonner";
import { useHIS } from "../../context/HISContext";
import { Patient } from "../../types";

// Common ICD-10 Diagnoses for Quick Selection
const COMMON_ICD10 = [
  { code: "I21.9", descAr: "احتشاء عضلة القلب الحاد (نوبة قلبية)", descEn: "Acute Myocardial Infarction", severity: "High", ward: "CCU / Cardiac", los: "4-6 Days" },
  { code: "J18.9", descAr: "التهاب رئوي حاد غير محدد", descEn: "Community-Acquired Pneumonia", severity: "Medium", ward: "Internal Med / Isolation", los: "3-5 Days" },
  { code: "K35.8", descAr: "التهاب الزائدة الدودية الحاد", descEn: "Acute Appendicitis", severity: "High", ward: "General Surgery", los: "2-3 Days" },
  { code: "E11.65", descAr: "داء السكري مع فرط سكر الدم الحاد", descEn: "T2DM with Severe Hyperglycemia", severity: "Medium", ward: "Endocrinology", los: "3-4 Days" },
  { code: "S72.0", descAr: "كسر في عنق العظم الفخذي", descEn: "Fracture Neck of Femur", severity: "High", ward: "Orthopedics", los: "5-7 Days" },
  { code: "A41.9", descAr: "تسمم الدم (الإنتان الحاد)", descEn: "Sepsis, Unspecified", severity: "Critical", ward: "ICU", los: "7-10 Days" },
];

// Order Set Presets
const ORDER_PRESETS = [
  {
    id: "med",
    labelAr: "حزمة الباطنية العامة",
    labelEn: "Internal Medicine Bundle",
    orders: "1. NPO from 00:00 midnight\n2. Vital Signs q4h & Neuro Checks\n3. IV D5 1/2 Normal Saline @ 100 ml/hr\n4. Stat Labs: CBC, CMP, Troponin I, PT/INR\n5. ECG 12-Lead Stat"
  },
  {
    id: "surg",
    labelAr: "حزمة ما قبل الجراحة",
    labelEn: "Surgical Pre-Op Bundle",
    orders: "1. Strict NPO (Nil Per Os)\n2. Surgical Informed Consent Verification\n3. Cefazolin 1g IV Stat (30 min pre-op)\n4. Sequential Compression Devices (SCDs)\n5. Type & Crossmatch 2 Units PRBC"
  },
  {
    id: "cardiac",
    labelAr: "حزمة العناية القلبية المركزة",
    labelEn: "CCU Intensive Bundle",
    orders: "1. Continuous Telemetry Monitoring\n2. Oxygen 2L/min via Nasal Cannula\n3. Bed Rest with Commode Privileges\n4. Low Sodium / Heart-Healthy Diet\n5. Troponin T at 0h, 6h, 12h"
  },
  {
    id: "iso",
    labelAr: "حزمة العزل والتنفسي",
    labelEn: "Respiratory Isolation Bundle",
    orders: "1. Airborne & Droplet Isolation Precautions\n2. Negative Pressure Room Assignment\n3. Continuous Pulse Oximetry\n4. Sputum Culture & PCR Panel\n5. Ventolin Nebulizer 2.5mg q6h PRN"
  }
];

export default function AdmissionForm({ language, moduleType }: { language: string, moduleType?: string }) {
  const isAr = language === "ar";
  const { patients, addPatient, beds, departments, currentUser, logAudit } = useHIS();

  // Search & Patient selection
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  // Form Fields
  const [admissionType, setAdmissionType] = useState<"elective" | "emergency" | "transfer" | "day_surgery">("elective");
  const [triageLevel, setTriageLevel] = useState<"1" | "2" | "3" | "4">("3");
  const [diagnosisCode, setDiagnosisCode] = useState("J18.9");
  const [diagnosisText, setDiagnosisText] = useState(isAr ? "التهاب رئوي حاد غير محدد" : "Community-Acquired Pneumonia");
  const [attendingPhysician, setAttendingPhysician] = useState("Dr. Sarah Ahmed (Internal Med)");
  const [admissionOrders, setAdmissionOrders] = useState("1. NPO from midnight\n2. Vital Signs q4h\n3. IV D5NS @ 100 ml/hr\n4. Stat CBC & Chest X-Ray");
  
  // Room & Bed Selection
  const [roomClass, setRoomClass] = useState<"standard" | "private" | "vip" | "icu" | "isolation">("standard");
  const [selectedWard, setSelectedWard] = useState("Ward 3B - Internal Medicine");

  // Financial Insurance Verification
  const [payorSource, setPayorSource] = useState<"insurance" | "cash" | "government" | "corporate">("insurance");
  const [insurancePolicy, setInsurancePolicy] = useState("Tawuniya Gold (Class A)");
  const [approvalStatus, setApprovalStatus] = useState<"idle" | "verifying" | "approved" | "rejected">("approved");
  const [preAuthCode, setPreAuthCode] = useState("AUTH-2026-9810");

  // State flags
  const [emergencyBypass, setEmergencyBypass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrintTicket, setShowPrintTicket] = useState(false);
  const [createdAdmissionId, setCreatedAdmissionId] = useState("");

  // Patient filtering
  const filteredPatients = useMemo(() => {
    if (!patientSearch.trim()) return patients.slice(0, 5);
    const q = patientSearch.toLowerCase();
    return patients.filter(
      p => p.nameEn.toLowerCase().includes(q) || 
           p.nameAr.includes(q) || 
           p.mrn.toLowerCase().includes(q) ||
           (p.phone && p.phone.includes(q))
    );
  }, [patients, patientSearch]);

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setPatientSearch(`${patient.nameAr} (${patient.mrn})`);
    setShowPatientDropdown(false);
    toast.info(isAr ? `تم اختيار المريض: ${patient.nameAr}` : `Selected patient: ${patient.nameEn}`);
  };

  const handleSelectICD10 = (item: typeof COMMON_ICD10[0]) => {
    setDiagnosisCode(item.code);
    setDiagnosisText(isAr ? item.descAr : item.descEn);
    toast.success(isAr ? `تم تطبيق التشخيص: ${item.code}` : `Applied Diagnosis: ${item.code}`);
  };

  const handleApplyOrderPreset = (preset: typeof ORDER_PRESETS[0]) => {
    setAdmissionOrders(preset.orders);
    toast.success(isAr ? `تم تطبيق ${preset.labelAr}` : `Applied ${preset.labelEn}`);
  };

  const handleVerifyInsurance = () => {
    setApprovalStatus("verifying");
    setTimeout(() => {
      setApprovalStatus("approved");
      setPreAuthCode(`AUTH-2026-${Math.floor(1000 + Math.random() * 9000)}`);
      toast.success(isAr ? "تم التأكد من الأهلية والموافقة الفورية من شركة التأمين!" : "Insurance eligibility & pre-auth verified successfully!");
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient && !patientSearch.trim()) {
      toast.error(isAr ? "يرجى اختيار مريض أولاً" : "Please select or search for a patient");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const admissionId = `ADM-${Math.floor(100000 + Math.random() * 900000)}`;
      setCreatedAdmissionId(admissionId);
      setShowPrintTicket(true);

      // If patient exists, update status
      if (selectedPatient) {
        // update patient in HIS if needed
      }

      toast.success(
        isAr 
          ? `تم إنشاء طلب التنويم الذكي بنجاح برقم (${admissionId})!` 
          : `Smart Admission Request created successfully (${admissionId})!`
      );

      logAudit({
        action: "CREATE_ADMISSION_REQUEST",
        entityType: "ADMISSION",
        entityId: admissionId,
        reason: `Admitted under ${attendingPhysician} - ${diagnosisCode}`
      });
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      {/* Smart Command Bar Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-[32px] p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-indigo-700/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                {isAr ? "نظام القبول الذكي والمتقدم" : "Smart Enterprise Admission Engine"}
              </span>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {isAr ? "متصل بالنظام المركزي" : "HIS Live Linked"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {isAr ? "طلب تنويم مريض جديد" : "Inpatient Admission Request"}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-indigo-200/80 mt-1">
              {isAr ? "تسجيل البيانات الإدارية، التخصيص الآلي للأسرة، والأوامر الطبية الفورية" : "Register administrative & clinical data with intelligent bed allocation"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Emergency Fast Track Switch */}
            <button
              type="button"
              onClick={() => {
                setEmergencyBypass(!emergencyBypass);
                if (!emergencyBypass) {
                  setAdmissionType("emergency");
                  setTriageLevel("1");
                  toast.warning(isAr ? "تم تفعيل نمط الطوارئ السريع" : "Emergency fast-track activated");
                }
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 border cursor-pointer ${
                emergencyBypass 
                  ? "bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-950/50 animate-pulse" 
                  : "bg-white/10 text-indigo-100 hover:bg-white/20 border-white/20"
              }`}
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{isAr ? "تجاوز الطوارئ الفوري" : "Emergency Bypass"}</span>
            </button>
          </div>
        </div>

        {/* Real-time Ward Status Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="bg-white/5 backdrop-blur rounded-2xl p-3 border border-white/10">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">{isAr ? "نسبة إشغال الأسرة" : "Ward Occupancy"}</span>
            <span className="text-base font-black text-amber-300">84% {isAr ? "(48/57 سرير)" : "(48/57 Beds)"}</span>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-2xl p-3 border border-white/10">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">{isAr ? "غرف خاصة متاحة" : "Private Rooms Free"}</span>
            <span className="text-base font-black text-emerald-300">3 {isAr ? "غرف شاغرة" : "Available"}</span>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-2xl p-3 border border-white/10">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">{isAr ? "سرير عزل الضغط السلبي" : "Isolation Beds"}</span>
            <span className="text-base font-black text-cyan-300">2 {isAr ? "شاغرين" : "Ready"}</span>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-2xl p-3 border border-white/10">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">{isAr ? "بوابة التأمين" : "Insurance Portal"}</span>
            <span className="text-base font-black text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              {isAr ? "نشط - موافقة فورية" : "Online - Auto Auth"}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* STEP 1: Smart Patient Lookup & Identity Data */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                  {isAr ? "البيانات الإدارية والتعريفية الذكية" : "Smart Patient Identity & Demographics"}
                </h3>
                <p className="text-xs text-slate-500 font-bold">
                  {isAr ? "البحث في سجلات السجل الطبي العام والربط الآلي" : "Search central HIS master patient index"}
                </p>
              </div>
            </div>

            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-black rounded-full border border-indigo-100">
              {isAr ? "الخطوة 1 من 4" : "Step 1 of 4"}
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Search Input */}
              <div className="space-y-2 relative">
                <label className="text-xs font-black text-slate-600 uppercase tracking-wider px-1 flex justify-between">
                  <span>{isAr ? "البحث عن مريض (اسم / رقم طبي / هاتف)" : "Search Patient (Name / MRN / Phone)"}</span>
                  {selectedPatient && <span className="text-emerald-600 font-bold">{isAr ? "تم تحديد المريض ✓" : "Selected ✓"}</span>}
                </label>
                <div className="relative">
                  <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 ${isAr ? "right-4" : "left-4"}`} />
                  <input
                    type="text"
                    required
                    value={patientSearch}
                    onChange={(e) => {
                      setPatientSearch(e.target.value);
                      setShowPatientDropdown(true);
                      if (selectedPatient) setSelectedPatient(null);
                    }}
                    onFocus={() => setShowPatientDropdown(true)}
                    className={`w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 ${isAr ? "pr-12" : "pl-12"} text-sm font-bold text-slate-800 focus:ring-4 focus:ring-indigo-100 outline-none transition-all focus:bg-white`}
                    placeholder={isAr ? "ابحث باسم المريض أو MRN..." : "Search patient name or MRN..."}
                  />
                </div>

                {/* Patient Live Search Dropdown */}
                {showPatientDropdown && filteredPatients.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-30 overflow-hidden max-h-60 overflow-y-auto">
                    {filteredPatients.map(p => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectPatient(p)}
                        className="p-3 hover:bg-indigo-50/70 border-b border-slate-100 cursor-pointer transition flex items-center justify-between"
                      >
                        <div>
                          <span className="font-extrabold text-sm text-slate-800 block">{isAr ? p.nameAr : p.nameEn}</span>
                          <span className="text-xs font-bold text-slate-500">MRN: {p.mrn} | {p.age} {isAr ? "سنة" : "yrs"} | {p.gender}</span>
                        </div>
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-black text-[10px] rounded-lg">
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Admission Type */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-600 uppercase tracking-wider px-1">
                  {isAr ? "نوع الدخول وإجراء التنويم" : "Admission Type"}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "elective", labelAr: "اختياري", labelEn: "Elective" },
                    { id: "emergency", labelAr: "طوارئ حادة", labelEn: "Emergency" },
                    { id: "transfer", labelAr: "تحويل خارجي", labelEn: "Transfer" },
                    { id: "day_surgery", labelAr: "جراحة يوم واحد", labelEn: "Day Surgery" },
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setAdmissionType(t.id as any)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                        admissionType === t.id
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {isAr ? t.labelAr : t.labelEn}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Patient Identity Card Badge */}
            {selectedPatient && (
              <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-2xl flex flex-wrap items-center justify-between gap-4 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center text-lg">
                    {selectedPatient.nameEn.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">
                      {isAr ? selectedPatient.nameAr : selectedPatient.nameEn}
                    </h4>
                    <p className="text-xs font-bold text-slate-600">
                      {isAr ? `الرقم الطبي: ${selectedPatient.mrn} | العمر: ${selectedPatient.age} سنة | الجنس: ${selectedPatient.gender}` : `MRN: ${selectedPatient.mrn} | Age: ${selectedPatient.age} | Gender: ${selectedPatient.gender}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-lg">
                    {isAr ? "السجل مجتاز للفحص" : "MPI Verified"}
                  </span>
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-black rounded-lg">
                    {isAr ? "حساسية: بنسلين ⚠️" : "Allergy: Penicillin ⚠️"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* STEP 2: AI Clinical Justification & Order Bundles */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 font-bold">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                  {isAr ? "المعطيات السريرية والتشخيص الذكي (ICD-10)" : "Clinical Justification & ICD-10 Search"}
                </h3>
                <p className="text-xs text-slate-500 font-bold">
                  {isAr ? "تحديد التشخيص المبدئي، درجة الخطورة، واستدعاء أوامر التنويم الجاهزة" : "Select diagnosis, clinical severity, & auto-apply CPOE order bundles"}
                </p>
              </div>
            </div>

            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-black rounded-full border border-emerald-100">
              {isAr ? "الخطوة 2 من 4" : "Step 2 of 4"}
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Quick ICD-10 Diagnosis Selector Chips */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-600 uppercase tracking-wider px-1">
                {isAr ? "التشخيصات الشائعة وسريعة الاختيار (ICD-10 Quick Presets)" : "Common ICD-10 Clinical Shortcuts"}
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_ICD10.map(item => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => handleSelectICD10(item)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                      diagnosisCode === item.code 
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md" 
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    <span className="font-mono text-[11px] opacity-80">[{item.code}]</span>
                    <span>{isAr ? item.descAr : item.descEn}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Diagnosis Code & Description */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-600 uppercase tracking-wider px-1">
                  {isAr ? "التشخيص المبدئي المعتمد" : "Provisional Diagnosis"}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={diagnosisCode}
                    onChange={(e) => setDiagnosisCode(e.target.value)}
                    className="w-28 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-center uppercase focus:ring-4 focus:ring-emerald-100 outline-none"
                    placeholder="ICD-10"
                  />
                  <input
                    type="text"
                    required
                    value={diagnosisText}
                    onChange={(e) => setDiagnosisText(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-emerald-100 outline-none"
                    placeholder={isAr ? "وصف التشخيص..." : "Diagnosis description..."}
                  />
                </div>
              </div>

              {/* Attending Physician */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-600 uppercase tracking-wider px-1">
                  {isAr ? "الطبيب المعالج / الاستشاري المسؤول" : "Attending Physician / Consultant"}
                </label>
                <select
                  value={attendingPhysician}
                  onChange={(e) => setAttendingPhysician(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-emerald-100 outline-none appearance-none cursor-pointer"
                >
                  <option value="Dr. Sarah Ahmed (Internal Med)">Dr. Sarah Ahmed (Internal Medicine Consultant)</option>
                  <option value="Dr. Khalid Omar (General Surgery)">Dr. Khalid Omar (General Surgery Head)</option>
                  <option value="Dr. Tariq Mansour (Cardiology)">Dr. Tariq Mansour (Cardiology Chief)</option>
                  <option value="Dr. Layla Hani (Pulmonology)">Dr. Layla Hani (Pulmonology & ICU)</option>
                  <option value="Dr. Youssef Nabil (Orthopedics)">Dr. Youssef Nabil (Orthopedic Surgery)</option>
                </select>
              </div>
            </div>

            {/* Smart CPOE Admission Orders with Presets */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-black text-slate-600 uppercase tracking-wider px-1 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>{isAr ? "أوامر الدخول الفورية (Immediate Admission Orders CPOE)" : "Immediate CPOE Admission Orders"}</span>
                </label>

                {/* Preset Bundles */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 self-center uppercase">{isAr ? "حزم الأوامر:" : "Presets:"}</span>
                  {ORDER_PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyOrderPreset(preset)}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-lg border border-emerald-200 transition cursor-pointer"
                    >
                      + {isAr ? preset.labelAr : preset.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={4}
                value={admissionOrders}
                onChange={(e) => setAdmissionOrders(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-mono focus:ring-4 focus:ring-emerald-100 outline-none leading-relaxed transition-all focus:bg-white"
                placeholder={isAr ? "أدخل أوامر التنويم..." : "Enter admission orders..."}
              />
            </div>
          </div>
        </div>

        {/* STEP 3 & STEP 4: Bed Allocation & Financial Insurance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* STEP 3: Smart Bed Allocation */}
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between">
            <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 font-bold">
                  <Bed className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                    {isAr ? "تخصيص السرير الذكي" : "Smart Bed Allocation"}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold">
                    {isAr ? "اختيار درجات الإقامة والأسرّة المتاحة" : "Room class & ward placement"}
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-black rounded-full border border-amber-100">
                {isAr ? "الخطوة 3 من 4" : "Step 3 of 4"}
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-6 flex-1">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-600 uppercase tracking-wider px-1">
                  {isAr ? "درجة الإقامة وتصميم الجناح" : "Accommodation Class"}
                </label>
                <select
                  value={roomClass}
                  onChange={(e) => setRoomClass(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-amber-100 outline-none appearance-none cursor-pointer"
                >
                  <option value="standard">{isAr ? "جناح مشترك قياسي (Standard Shared Ward)" : "Standard Shared Ward"}</option>
                  <option value="private">{isAr ? "غرفة خاصة منفردة (Single Private Room)" : "Single Private Room"}</option>
                  <option value="vip">{isAr ? "جناح فاخر ملكي (VIP Suite)" : "VIP Deluxe Suite"}</option>
                  <option value="icu">{isAr ? "عناية مركزة (ICU Bed)" : "ICU Bed"}</option>
                  <option value="isolation">{isAr ? "عزل ضغط سلبي (Negative Pressure Isolation)" : "Negative Pressure Isolation"}</option>
                </select>
              </div>

              {/* AI Recommendation Banner */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-extrabold text-amber-900 block">{isAr ? "توصية محرك القبول الذكي:" : "AI Allocation Recommendation:"}</span>
                  <p className="text-amber-800 font-semibold mt-0.5 leading-relaxed">
                    {isAr 
                      ? "بناءً على التشخيص الحالي، يُنصح بإدخال المريض لجناح الباطنية (Ward 3B) سرير رقم 14." 
                      : "Based on diagnosis, Ward 3B Internal Medicine Bed 14 is recommended."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4: Financial Clearance & Insurance */}
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between">
            <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                    {isAr ? "الضمان المالي والتحقق من التأمين" : "Financial Clearance & Pre-Auth"}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold">
                    {isAr ? "فحص التغطية التأمينية والموافقة المسبقة" : "Insurance eligibility & approval status"}
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-black rounded-full border border-indigo-100">
                {isAr ? "الخطوة 4 من 4" : "Step 4 of 4"}
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-6 flex-1">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-600 uppercase tracking-wider px-1">
                  {isAr ? "جهة الدفع والتمويل" : "Payor Source"}
                </label>
                <select
                  value={payorSource}
                  onChange={(e) => setPayorSource(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-indigo-100 outline-none appearance-none cursor-pointer"
                >
                  <option value="insurance">{isAr ? "تأمين طبي خاص (Private Insurance)" : "Private Insurance"}</option>
                  <option value="cash">{isAr ? "سداد نقدي / شخصي (Self-Pay / Cash)" : "Self-Pay / Cash"}</option>
                  <option value="government">{isAr ? "تغطية حكومية (Government MoH)" : "Government MoH Coverage"}</option>
                  <option value="corporate">{isAr ? "عقد شراكة شركات (Corporate Sponsor)" : "Corporate Account"}</option>
                </select>
              </div>

              {/* Insurance Verification Box */}
              {payorSource === "insurance" && (
                <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-indigo-900">
                      {insurancePolicy}
                    </span>
                    <button
                      type="button"
                      onClick={handleVerifyInsurance}
                      disabled={approvalStatus === "verifying"}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                    >
                      {approvalStatus === "verifying" ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>{isAr ? "التحقق الفوري" : "Verify Live"}</span>
                    </button>
                  </div>

                  {approvalStatus === "approved" && (
                    <div className="pt-2 border-t border-indigo-200/60 flex items-center justify-between text-xs font-bold text-emerald-700">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        {isAr ? "موافقة فورية معتمدة" : "Pre-Auth Auto Approved"}
                      </span>
                      <span className="font-mono bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded text-[11px]">
                        Ref: {preAuthCode}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons & Submission */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={() => {
              setPatientSearch("");
              setSelectedPatient(null);
              toast.info(isAr ? "تم إعادة ضبط النموذج" : "Form reset");
            }}
            className="px-6 py-4 text-slate-500 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 rounded-2xl transition-all cursor-pointer"
          >
            {isAr ? "إلغاء وإعادة الضبط" : "Reset Form"}
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white rounded-2xl font-black text-base shadow-2xl shadow-indigo-300 hover:shadow-indigo-400 transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
          >
            {isSubmitting ? (
              <RefreshCw className="w-6 h-6 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-6 h-6" />
            )}
            <span>{isAr ? "إرسال واعتماد طلب الدخول" : "Confirm & Issue Smart Admission"}</span>
          </button>
        </div>
      </form>

      {/* Printable Digital Admission Ticket / QR Modal */}
      {showPrintTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-indigo-900 px-6 py-4 text-white flex justify-between items-center">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                {isAr ? "بطاقة وتذكرة التنويم الذكية" : "Smart Admission Order Pass"}
              </h3>
              <button onClick={() => setShowPrintTicket(false)} className="hover:bg-indigo-800 p-1 rounded-lg text-white">✕</button>
            </div>

            <div className="p-8 space-y-6 text-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <QrCode className="w-10 h-10" />
              </div>

              <div>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-black rounded-full border border-indigo-100">
                  {createdAdmissionId}
                </span>
                <h4 className="font-black text-slate-900 text-xl mt-2">
                  {selectedPatient ? (isAr ? selectedPatient.nameAr : selectedPatient.nameEn) : patientSearch}
                </h4>
                <p className="text-xs text-slate-500 font-bold mt-1">
                  {isAr ? `التشخيص: ${diagnosisText} (${diagnosisCode})` : `Diagnosis: ${diagnosisText} (${diagnosisCode})`}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 font-bold space-y-1 text-right">
                <div className="flex justify-between">
                  <span>{isAr ? "الجناح والسرير:" : "Ward & Bed:"}</span>
                  <span className="text-slate-900 font-black">{selectedWard}</span>
                </div>
                <div className="flex justify-between">
                  <span>{isAr ? "الطبيب المعالج:" : "Physician:"}</span>
                  <span className="text-slate-900 font-black">{attendingPhysician}</span>
                </div>
                <div className="flex justify-between">
                  <span>{isAr ? "مرجع التغطية التأمينية:" : "Pre-Auth Ref:"}</span>
                  <span className="text-emerald-700 font-mono font-black">{preAuthCode}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    window.print();
                    toast.success(isAr ? "تم إرسال الأوامر للمطبخ والتمريض" : "Printed admission order pass");
                  }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm transition flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>{isAr ? "طباعة التذكرة" : "Print Pass"}</span>
                </button>
                <button
                  onClick={() => setShowPrintTicket(false)}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition"
                >
                  {isAr ? "إغلاق والعودة" : "Close & Done"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
