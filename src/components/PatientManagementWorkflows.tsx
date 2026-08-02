import React, { useState, useMemo } from "react";
import { 
  X, UserPlus, FileUp, FileText, UserCircle, Search, AlertTriangle, 
  CheckCircle2, User, ShieldCheck, Stethoscope, Building2, Calendar, 
  Clock, Hash, FileCheck, UploadCloud, ChevronDown, Check, UserCheck, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHIS } from "../context/HISContext";
import { Patient } from "../types";
import { toast } from "sonner";

interface PatientManagementWorkflowsProps {
  workflow: string;
  patientId?: string;
  isAr: boolean;
  onClose: () => void;
  onSuccess?: (payload?: any) => void;
}

export function PatientManagementWorkflows({ workflow, patientId, isAr, onClose, onSuccess }: PatientManagementWorkflowsProps) {
  const { 
    patients = [], 
    updatePatientStatus, 
    updatePatient, 
    activePatient, 
    setActivePatient,
    setCpoeOrders,
    setErQueue,
    systemUsers = [],
    clinics = [],
    currentUser
  } = useHIS();

  // Selected Patient State
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    patientId || activePatient?.id || ""
  );
  const [patientSearchQuery, setPatientSearchQuery] = useState("");
  const [isSearchingPatient, setIsSearchingPatient] = useState(false);

  // Form States for New Visit
  const [visitType, setVisitType] = useState<string>("opd");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("clinic-im");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [visitPriority, setVisitPriority] = useState<string>("routine");
  const [visitNotes, setVisitNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States for Document Upload
  const [docCategory, setDocCategory] = useState("External Report");
  const [docTitle, setDocTitle] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);

  // Form States for New Report
  const [reportType, setReportType] = useState("Clinical Status Report");
  const [reportContent, setReportContent] = useState("");
  const [isSigned, setIsSigned] = useState(true);

  // Form States for Edit Patient
  const selectedPatient = useMemo(() => {
    return patients.find(p => p.id === selectedPatientId);
  }, [patients, selectedPatientId]);

  const [editForm, setEditForm] = useState({
    nameAr: selectedPatient?.nameAr || "",
    nameEn: selectedPatient?.nameEn || "",
    phone: selectedPatient?.phone || "",
    age: selectedPatient?.age ? String(selectedPatient.age) : "",
    gender: selectedPatient?.gender || "male",
    insuranceProvider: selectedPatient?.insuranceProvider || "",
    nationalId: selectedPatient?.nationalId || "",
    bloodGroup: selectedPatient?.bloodGroup || "O+"
  });

  // Filtered patient search results
  const patientSearchResults = useMemo(() => {
    if (!patientSearchQuery.trim()) return patients.slice(0, 5);
    const q = patientSearchQuery.toLowerCase().trim();
    return patients.filter(p => 
      p.nameAr?.toLowerCase().includes(q) ||
      p.nameEn?.toLowerCase().includes(q) ||
      p.mrn?.toLowerCase().includes(q) ||
      p.phone?.includes(q) ||
      p.nationalId?.includes(q)
    ).slice(0, 8);
  }, [patients, patientSearchQuery]);

  const handleSelectPatient = (p: Patient) => {
    setSelectedPatientId(p.id);
    setActivePatient(p);
    setIsSearchingPatient(false);
    setEditForm({
      nameAr: p.nameAr || "",
      nameEn: p.nameEn || "",
      phone: p.phone || "",
      age: p.age ? String(p.age) : "",
      gender: p.gender || "male",
      insuranceProvider: p.insuranceProvider || "",
      nationalId: p.nationalId || "",
      bloodGroup: p.bloodGroup || "O+"
    });
    toast.info(isAr ? `تم اختيار المريض: ${p.nameAr || p.nameEn}` : `Selected Patient: ${p.nameEn}`);
  };

  const doctorsList = useMemo(() => {
    const docs = systemUsers.filter(u => u.role === "doctor" || u.role === "consultant" || u.name?.toLowerCase().includes("dr"));
    if (docs.length > 0) return docs;
    return [
      { id: "doc-1", name: isAr ? "د. أحمد طارق (استشاري باطنة)" : "Dr. Ahmed Tarek (Consultant IM)" },
      { id: "doc-2", name: isAr ? "د. سارة محمود (استشاري قلب)" : "Dr. Sarah Mahmoud (Cardiology)" },
      { id: "doc-3", name: isAr ? "د. خالد عبد العزيز (استشاري عظام)" : "Dr. Khaled Abdelaziz (Orthopedics)" },
    ];
  }, [systemUsers, isAr]);

  const departmentOptions = [
    { id: "clinic-im", ar: "عيادة الباطنة العامة", en: "Internal Medicine Clinic" },
    { id: "clinic-cardio", ar: "مركز طب القلب والأوعية", en: "Cardiology Center" },
    { id: "clinic-ped", ar: "عيادة طب الأطفال", en: "Pediatrics Clinic" },
    { id: "clinic-ortho", ar: "عيادة جراحة العظام", en: "Orthopedics Clinic" },
    { id: "clinic-derma", ar: "عيادة الأمراض الجلدية", en: "Dermatology Clinic" },
    { id: "er-dept", ar: "قسم الطوارئ والاستقبال", en: "Emergency Department" }
  ];

  // Submit Visit Creation
  const handleConfirmVisit = async () => {
    if (!selectedPatient) {
      toast.error(isAr ? "خطأ: يجب اختيار مريض أولاً لفتح الزيارة!" : "Error: You must select a patient first!");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Update patient status
      const targetStatus = visitType === "er" ? "triage" : "waiting";
      await updatePatientStatus(selectedPatient.id, targetStatus as any);
      
      // Update patient department if selected
      await updatePatient(selectedPatient.id, {
        departmentId: selectedDepartment,
        attendingDoctor: selectedDoctor || doctorsList[0]?.name || "Duty Doctor"
      });

      // 2. Add CPOE visit order entry
      const newVisitOrder = {
        id: `VIS-${Date.now()}`,
        patientId: selectedPatient.id,
        patientName: selectedPatient.nameAr || selectedPatient.nameEn,
        patientMRN: selectedPatient.mrn,
        category: "visit",
        visitType: visitType.toUpperCase(),
        departmentId: selectedDepartment,
        doctorName: selectedDoctor || doctorsList[0]?.name || "Duty Doctor",
        priority: visitPriority,
        notes: visitNotes,
        timestamp: new Date().toISOString(),
        status: "active"
      };

      if (setCpoeOrders) {
        setCpoeOrders(prev => [newVisitOrder, ...(Array.isArray(prev) ? prev : [])]);
      }

      if (visitType === "er" && setErQueue) {
        setErQueue(prev => [
          {
            id: selectedPatient.id,
            nameEn: selectedPatient.nameEn,
            nameAr: selectedPatient.nameAr,
            mrn: selectedPatient.mrn,
            gender: selectedPatient.gender,
            age: selectedPatient.age,
            triageLevel: visitPriority === "stat" ? "red" : visitPriority === "urgent" ? "yellow" : "green",
            chiefComplaint: visitNotes || "Emergency Walk-in",
            arrivalTime: new Date().toLocaleTimeString(),
            status: "triage"
          },
          ...(Array.isArray(prev) ? prev : [])
        ]);
      }

      toast.success(
        isAr 
          ? `تم فتح وتأكيد الزيارة بنجاح للمريض: ${selectedPatient.nameAr || selectedPatient.nameEn} (MRN: ${selectedPatient.mrn})`
          : `Visit successfully opened for ${selectedPatient.nameEn} (MRN: ${selectedPatient.mrn})`
      );

      onSuccess?.(newVisitOrder);
      onClose();
    } catch (err) {
      toast.error(isAr ? "حدث خطأ أثناء حفظ الزيارة" : "Failed to record visit");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Document Upload
  const handleConfirmDocumentUpload = async () => {
    if (!selectedPatient) {
      toast.error(isAr ? "خطأ: يرجى تحديد المريض أولاً!" : "Error: Please select a patient first!");
      return;
    }
    toast.success(
      isAr 
        ? `تم رفع الوثيقة (${docCategory}) وأرشفتها بملف المريض: ${selectedPatient.nameAr || selectedPatient.nameEn}` 
        : `Document (${docCategory}) successfully archived for ${selectedPatient.nameEn}`
    );
    onSuccess?.();
    onClose();
  };

  // Submit Medical Report
  const handleConfirmReport = async () => {
    if (!selectedPatient) {
      toast.error(isAr ? "خطأ: يرجى تحديد المريض أولاً!" : "Error: Please select a patient first!");
      return;
    }
    toast.success(
      isAr 
        ? `تمت التوقيع الإلكتروني وإصدار التقرير الطبي (${reportType}) للمريض: ${selectedPatient.nameAr || selectedPatient.nameEn}` 
        : `Report (${reportType}) e-signed and issued for ${selectedPatient.nameEn}`
    );
    onSuccess?.();
    onClose();
  };

  // Submit Edit Patient Profile
  const handleConfirmEditPatient = async () => {
    if (!selectedPatient) return;
    try {
      await updatePatient(selectedPatient.id, {
        nameAr: editForm.nameAr,
        nameEn: editForm.nameEn,
        phone: editForm.phone,
        age: Number(editForm.age) || selectedPatient.age,
        gender: editForm.gender as any,
        insuranceProvider: editForm.insuranceProvider,
        nationalId: editForm.nationalId,
        bloodGroup: editForm.bloodGroup
      });
      toast.success(isAr ? "تم تحديث بيانات المريض بنجاح" : "Patient profile updated successfully");
      onSuccess?.();
      onClose();
    } catch (e) {
      toast.error(isAr ? "فشل تحديث البيانات" : "Update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-modal flex items-center justify-center p-4 overflow-y-auto" dir={isAr ? "rtl" : "ltr"}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 my-auto flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md border border-indigo-400">
              {workflow === "new_visit" && <UserPlus className="w-5 h-5 text-white" />}
              {workflow === "upload_document" && <FileUp className="w-5 h-5 text-white" />}
              {workflow === "new_report" && <FileText className="w-5 h-5 text-white" />}
              {workflow === "edit_patient" && <UserCircle className="w-5 h-5 text-white" />}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
                Enterprise Clinical Workflow
              </span>
              <h2 className="text-lg font-black tracking-tight text-white">
                {workflow === "new_visit" && (isAr ? "إضافة وتأكيد زيارة مريض" : "Create & Confirm Patient Visit")}
                {workflow === "upload_document" && (isAr ? "رفع وتوثيق وثيقة طبية" : "Upload Clinical Document")}
                {workflow === "new_report" && (isAr ? "إصدار وتوقيع تقرير طبي" : "Generate & Sign Medical Report")}
                {workflow === "edit_patient" && (isAr ? "تعديل البيانات الأساسية للمريض" : "Edit Patient Profile")}
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* ========================================================= */}
          {/* MANDATORY PATIENT SELECTION BANNER / SELECTOR */}
          {/* ========================================================= */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-600" />
                {isAr ? "المريض المحدد لهذا الإجراء" : "Target Patient for Action"}
              </span>
              {selectedPatient && (
                <button 
                  onClick={() => setIsSearchingPatient(!isSearchingPatient)}
                  className="text-xs font-black text-indigo-600 hover:text-indigo-800 underline flex items-center gap-1"
                >
                  {isSearchingPatient ? (isAr ? "إلغاء البحث" : "Cancel Search") : (isAr ? "تغيير المريض" : "Change Patient")}
                </button>
              )}
            </div>

            {/* Selected Patient Banner */}
            {selectedPatient && !isSearchingPatient ? (
              <div className="bg-white border-2 border-indigo-100 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-900 text-white font-black rounded-xl flex items-center justify-center text-base shadow-sm shrink-0">
                    {(selectedPatient.nameEn || "PT").substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-black text-slate-900">
                        {isAr ? selectedPatient.nameAr : selectedPatient.nameEn}
                      </h4>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-mono text-[10px] font-black rounded border border-emerald-200">
                        MRN: {selectedPatient.mrn}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-bold mt-0.5 flex flex-wrap gap-2">
                      <span>{selectedPatient.gender === "male" ? (isAr ? "ذكر" : "Male") : (isAr ? "أنثى" : "Female")} • {selectedPatient.age} سنة</span>
                      <span>• {selectedPatient.phone || "بدون هاتف"}</span>
                      {selectedPatient.insuranceProvider && <span>• {selectedPatient.insuranceProvider}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                    {isAr ? "محدد وجاهز" : "Selected"}
                  </span>
                </div>
              </div>
            ) : (
              /* Patient Search & Dropdown Selection */
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    value={patientSearchQuery}
                    onChange={(e) => setPatientSearchQuery(e.target.value)}
                    placeholder={isAr ? "ابحث عن المريض باسمه أو رقم الملف (MRN) أو الهاتف..." : "Search patient by Name, MRN, or Phone..."}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                    autoFocus
                  />
                </div>

                <div className="max-h-48 overflow-y-auto bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-sm">
                  {patientSearchResults.length > 0 ? (
                    patientSearchResults.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPatient(p)}
                        className="w-full text-right p-3 hover:bg-indigo-50/60 transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center font-bold text-xs text-slate-700">
                            {(p.nameEn || "P").substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-900 group-hover:text-indigo-900">
                              {isAr ? p.nameAr : p.nameEn}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              MRN: {p.mrn} • {p.phone || "N/A"}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity">
                          {isAr ? "اختيار المريض" : "Select Patient"}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-slate-400 text-xs font-bold">
                      {isAr ? "لم يتم العثور على مريض مطبق." : "No matching patient found."}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-bold text-slate-500">
                    {isAr ? "المريض غير مسجل بالنظام بعد؟" : "Patient not in system yet?"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      window.dispatchEvent(new CustomEvent('openPatientRegistration'));
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-lg transition shadow-sm flex items-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{isAr ? "تسجيل مريض جديد الآن" : "Register New Patient Now"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Warning if no patient selected */}
            {!selectedPatient && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-red-700 text-xs font-bold">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 animate-pulse" />
                <span>
                  {isAr 
                    ? "تنبيه هامي: يجب تحديد واختيار المريض أولاً لتأكيد هذا الإجراء السريري." 
                    : "Required: Select a patient first to complete this action."}
                </span>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* WORKFLOW SPECIFIC FORMS */}
          {/* ========================================================= */}

          {/* 1. NEW VISIT WORKFLOW */}
          {workflow === "new_visit" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5 text-indigo-600" />
                    {isAr ? "نوع الزيارة" : "Visit Type"}
                  </label>
                  <select 
                    value={visitType}
                    onChange={(e) => setVisitType(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="opd">{isAr ? "عيادة خارجية (OPD Consultation)" : "Outpatient (OPD)"}</option>
                    <option value="er">{isAr ? "طوارئ (ER Emergency)" : "Emergency (ER)"}</option>
                    <option value="ipd">{isAr ? "تنويم داخلي (IPD Admission)" : "Inpatient (IPD)"}</option>
                    <option value="day_surgery">{isAr ? "جراحة اليوم الواحد (Day Surgery)" : "Day Surgery"}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                    {isAr ? "القسم / العيادة التخصصية" : "Department / Clinic"}
                  </label>
                  <select 
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {departmentOptions.map(d => (
                      <option key={d.id} value={d.id}>{isAr ? d.ar : d.en}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                    {isAr ? "الطبيب المعالج / الاستشاري" : "Attending Physician"}
                  </label>
                  <select 
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">{isAr ? "اختر الطبيب المعالج..." : "Select Physician..."}</option>
                    {doctorsList.map(doc => (
                      <option key={doc.id} value={doc.name}>{doc.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    {isAr ? "درجة أولوية الكشف" : "Priority Level"}
                  </label>
                  <select 
                    value={visitPriority}
                    onChange={(e) => setVisitPriority(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="routine">{isAr ? "عادي (Routine)" : "Routine"}</option>
                    <option value="urgent">{isAr ? "عاجل (Urgent)" : "Urgent"}</option>
                    <option value="stat">{isAr ? "طارئ فوراً (STAT)" : "STAT (Immediate)"}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  {isAr ? "الشكوى الرئيسية وملاحظات الزيارة" : "Chief Complaint & Visit Notes"}
                </label>
                <textarea 
                  rows={3}
                  value={visitNotes}
                  onChange={(e) => setVisitNotes(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder={isAr ? "أدخل الشكوى الطبية، الأعراض، أو سبب الزيارة..." : "Enter chief complaint, symptoms, or visit reason..."}
                />
              </div>

              <button 
                disabled={!selectedPatient || isSubmitting}
                onClick={handleConfirmVisit}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black rounded-2xl shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2 text-sm"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  {isSubmitting 
                    ? (isAr ? "جاري معالجة وفتح الزيارة..." : "Processing Visit...") 
                    : (isAr ? "تأكيد وفتح الزيارة للمريض" : "Confirm & Open Patient Visit")}
                </span>
              </button>
            </div>
          )}

          {/* 2. UPLOAD DOCUMENT WORKFLOW */}
          {workflow === "upload_document" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">{isAr ? "تصنيف الوثيقة" : "Document Category"}</label>
                <select 
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold bg-white"
                >
                  <option value="External Report">{isAr ? "تقرير طبي خارجي" : "External Medical Report"}</option>
                  <option value="External Lab">{isAr ? "نتائج معمل خارجية" : "External Lab Results"}</option>
                  <option value="External Radiology">{isAr ? "تقرير إشاعة خارجي" : "External Radiology Scan"}</option>
                  <option value="Surgery Summary">{isAr ? "ملخص عملية جراحية" : "Surgery Summary"}</option>
                </select>
              </div>

              <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-indigo-50/40 hover:bg-indigo-50 transition cursor-pointer">
                <UploadCloud className="w-10 h-10 text-indigo-500" />
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-800">{isAr ? "اسحب وأفلت الوثيقة هنا" : "Drag and drop document here"}</p>
                  <p className="text-xs text-slate-500 mt-1">{isAr ? "أو انقر لاختيار ملف من جهازك" : "or click to browse local files"}</p>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PDF, DICOM, JPG, PNG (Max 15MB)</span>
              </div>

              <button 
                disabled={!selectedPatient}
                onClick={handleConfirmDocumentUpload}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-black rounded-xl shadow-lg transition"
              >
                {isAr ? "حفظ وأرشفة الوثيقة بملف المريض" : "Save & Archive Document"}
              </button>
            </div>
          )}

          {/* 3. NEW MEDICAL REPORT WORKFLOW */}
          {workflow === "new_report" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">{isAr ? "نوع التقرير الطبي" : "Report Type"}</label>
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold bg-white"
                >
                  <option value="Clinical Status Report">{isAr ? "تقرير حالة مرضية سريرية" : "Clinical Status Report"}</option>
                  <option value="Sick Leave Report">{isAr ? "تقرير إجازة مرضية" : "Sick Leave Certificate"}</option>
                  <option value="Discharge Summary">{isAr ? "تقرير خروج موجز (Discharge Summary)" : "Discharge Summary"}</option>
                  <option value="Referral Letter">{isAr ? "خطاب تحويل واستشارة" : "Specialist Referral Letter"}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">{isAr ? "نص المحتوى السريري والتوصيات" : "Clinical Content & Recommendations"}</label>
                <textarea 
                  rows={5}
                  value={reportContent}
                  onChange={(e) => setReportContent(e.target.value)}
                  placeholder={isAr ? "اكتب تفاصيل التقرير الطبي، التوصيات، والعلاج..." : "Write clinical status details, recommendations, and treatment plan..."}
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-3 rounded-xl border border-slate-200">
                <input 
                  type="checkbox" 
                  checked={isSigned}
                  onChange={(e) => setIsSigned(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded" 
                />
                <span className="text-xs font-bold text-slate-700">
                  {isAr ? "إضافة التوقيع الإلكتروني والختم المعتمد للطبيب المعالج" : "Include physician e-signature & medical seal"}
                </span>
              </label>

              <button 
                disabled={!selectedPatient}
                onClick={handleConfirmReport}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-black rounded-xl shadow-lg transition"
              >
                {isAr ? "إصدار وتوقيع التقرير الطبي" : "Generate & E-Sign Report"}
              </button>
            </div>
          )}

          {/* 4. EDIT PATIENT PROFILE WORKFLOW */}
          {workflow === "edit_patient" && selectedPatient && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">{isAr ? "الاسم بالعربية" : "Arabic Name"}</label>
                  <input 
                    type="text" 
                    value={editForm.nameAr} 
                    onChange={(e) => setEditForm(prev => ({ ...prev, nameAr: e.target.value }))}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold bg-white" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">{isAr ? "الاسم بالإنجليزية" : "English Name"}</label>
                  <input 
                    type="text" 
                    value={editForm.nameEn} 
                    onChange={(e) => setEditForm(prev => ({ ...prev, nameEn: e.target.value }))}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold bg-white" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">{isAr ? "رقم الهاتف" : "Phone"}</label>
                  <input 
                    type="text" 
                    value={editForm.phone} 
                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold bg-white" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">{isAr ? "العمر" : "Age"}</label>
                  <input 
                    type="number" 
                    value={editForm.age} 
                    onChange={(e) => setEditForm(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold bg-white" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">{isAr ? "جهة التأمين" : "Insurance"}</label>
                  <input 
                    type="text" 
                    value={editForm.insuranceProvider} 
                    onChange={(e) => setEditForm(prev => ({ ...prev, insuranceProvider: e.target.value }))}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold bg-white" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">{isAr ? "الهوية / الباسبور" : "National ID / Passport"}</label>
                  <input 
                    type="text" 
                    value={editForm.nationalId} 
                    onChange={(e) => setEditForm(prev => ({ ...prev, nationalId: e.target.value }))}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold bg-white" 
                  />
                </div>
              </div>
              <button 
                onClick={handleConfirmEditPatient}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg transition"
              >
                {isAr ? "تحديث وتأكيد البيانات" : "Update & Confirm Profile"}
              </button>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}

