import React, { useState } from "react";
import { X, Save, User, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useHIS } from "../context/HISContext";
import { saveSetting } from "../lib/firestoreService";

interface ComprehensiveVisitModalProps {
  isAr: boolean;
  onClose: () => void;
  onRegister?: (visit: any) => void;
  existingVisits: any[];
}

export function ComprehensiveVisitModal({ isAr, onClose, onRegister, existingVisits }: ComprehensiveVisitModalProps) {
  const { patients, addPatient } = useHIS();
  const [step, setStep] = useState(1);
  
  // Form states
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [isNewPatientFlow, setIsNewPatientFlow] = useState(false);
  
  // If new patient, these are their basic details
  const [newPatientDetails, setNewPatientDetails] = useState({
    nameEn: "",
    nameAr: "",
    gender: "female",
    phone: "",
    age: "",
    nationalId: ""
  });

  const [visitData, setVisitData] = useState({
    visitType: "OPD" as "OPD" | "ER" | "IPD" | "ICU" | "Telemedicine",
    department: "",
    doctorId: "",
    origin: "Home", // جاى منين
    originOther: "",
    accompaniedByName: "", // برفقة مين - الاسم
    accompaniedByRelation: "", // برفقة مين - صلة القرابة
    accompaniedByPhone: "", // برفقة مين - الهاتف
    isReferred: "No", // محول أم لا
    referralLetterNo: "", // رقم جواب التحويل
    referringInstitution: "", // الجهة المحولة
    procedureType: "Consultation", // نوع الإجراء
    procedureTypeOther: "",
    symptoms: "", // الأعراض التي جاء بها
    chiefComplaint: "", // الشكوى الرئيسية
    onsetOfSymptoms: "" // تاريخ بدء الأعراض
  });

  const handleVisitChange = (field: string, value: string) => {
    setVisitData(prev => ({ ...prev, [field]: value }));
  };

  const handleNewPatientChange = (field: string, value: string) => {
    setNewPatientDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Validation
    if (!isNewPatientFlow && !selectedPatientId) {
      toast.error(isAr ? "يرجى اختيار مريض أولاً." : "Please select a patient first.");
      return;
    }

    if (isNewPatientFlow && (!newPatientDetails.nameEn || !newPatientDetails.nameAr || !newPatientDetails.phone)) {
      toast.error(isAr ? "يرجى إدخال اسم المريض ورقم هاتفه." : "Please enter patient name and phone number.");
      return;
    }

    if (!visitData.department || !visitData.doctorId) {
      toast.error(isAr ? "يرجى تحديد العيادة/القسم والطبيب." : "Please select department and physician.");
      return;
    }

    let finalPatientId = selectedPatientId;
    let finalPatientName = "";
    let finalMrn = "";

    if (isNewPatientFlow) {
      // Simulate registering new patient
      finalPatientId = "p-" + Date.now();
      finalMrn = "MRN-" + Math.floor(10000 + Math.random() * 90000);
      finalPatientName = isAr ? newPatientDetails.nameAr : newPatientDetails.nameEn;
      
      const newPat = {
        id: finalPatientId,
        mrn: finalMrn,
        nameEn: newPatientDetails.nameEn,
        nameAr: newPatientDetails.nameAr,
        phone: newPatientDetails.phone,
        gender: newPatientDetails.gender as any,
        age: parseInt(newPatientDetails.age) || 30,
        status: "registered" as any,
        insurance: "Cash" as any, // default
        clinicalData: {
          currentWorkflowStage: "registration",
          workflowId: `WF-${Date.now()}`
        }
      };
      
      // Attempt to save to cloud and local state
      try {
        await addPatient(newPat);
      } catch (err) {
        console.error("Failed to add new patient during visit creation:", err);
      }
    } else {
      const p = patients.find(pat => pat.id === selectedPatientId);
      if (p) {
        finalPatientName = isAr ? p.nameAr : p.nameEn;
        finalMrn = p.mrn;
      } else {
        finalPatientName = "Unknown Patient";
        finalMrn = "MRN-UNKNOWN";
      }
    }

    const newVisit = {
      id: "VST-" + Math.floor(100 + Math.random() * 900),
      patientId: finalPatientId,
      mrn: finalMrn,
      patientName: finalPatientName,
      visitType: visitData.visitType,
      doctorId: visitData.doctorId,
      department: visitData.department,
      status: "Active" as const,
      createdAt: new Date().toISOString(),
      // Extra fields requested
      origin: visitData.origin === "Other" ? visitData.originOther : visitData.origin,
      accompaniedBy: {
        name: visitData.accompaniedByName,
        relation: visitData.accompaniedByRelation,
        phone: visitData.accompaniedByPhone
      },
      isReferred: visitData.isReferred === "Yes",
      referralDetails: {
        letterNo: visitData.referralLetterNo,
        institution: visitData.referringInstitution
      },
      procedureType: visitData.procedureType === "Other" ? visitData.procedureTypeOther : visitData.procedureType,
      symptoms: visitData.symptoms,
      chiefComplaint: visitData.chiefComplaint,
      onsetOfSymptoms: visitData.onsetOfSymptoms
    };

    const updatedVisits = [newVisit, ...existingVisits];
    await saveSetting("his_visits", updatedVisits);
    
    toast.success(isAr ? "تم تسجيل الزيارة الجديدة وتكويدها بنجاح!" : "New visit registered and coded successfully!");
    
    if (onRegister) {
      onRegister(newVisit);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-[#f8f9fa] border-b border-slate-200 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse inline-block"></span>
              {isAr ? "تسجيل وتكويد زيارة جديدة" : "Register & Code New Visit"}
            </h2>
            <p className="text-xs text-slate-500 font-bold mt-0.5">
              {isAr ? "منظومة تسجيل وتكويد الزيارات HL7 المتكاملة" : "HL7 Compliant Visit Registration & Coding Suite"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSave} className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-sm font-bold flex items-center gap-2 transition-colors shadow-sm">
              <Save className="w-4 h-4" />
              {isAr ? "حفظ الزيارة" : "Save Visit"}
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stepper */}
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4">
          <div className="flex items-center justify-between max-w-3xl mx-auto relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 -z-10"></div>
            
            {/* Step 1 */}
            <button onClick={() => setStep(1)} className="flex flex-col items-center z-10 focus:outline-none">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === 1 ? 'bg-blue-600 text-white shadow-md scale-110' : 'bg-slate-200 text-slate-600'}`}>
                1
              </div>
              <span className={`text-[11px] font-bold mt-1.5 ${step === 1 ? 'text-blue-600' : 'text-slate-500'}`}>
                {isAr ? "بيانات المريض والوجهة" : "Patient & Destination"}
              </span>
            </button>

            {/* Step 2 */}
            <button onClick={() => setStep(2)} className="flex flex-col items-center z-10 focus:outline-none">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === 2 ? 'bg-blue-600 text-white shadow-md scale-110' : 'bg-slate-200 text-slate-600'}`}>
                2
              </div>
              <span className={`text-[11px] font-bold mt-1.5 ${step === 2 ? 'text-blue-600' : 'text-slate-500'}`}>
                {isAr ? "تفاصيل الوصول والتحويل" : "Arrival & Referral"}
              </span>
            </button>

            {/* Step 3 */}
            <button onClick={() => setStep(3)} className="flex flex-col items-center z-10 focus:outline-none">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === 3 ? 'bg-blue-600 text-white shadow-md scale-110' : 'bg-slate-200 text-slate-600'}`}>
                3
              </div>
              <span className={`text-[11px] font-bold mt-1.5 ${step === 3 ? 'text-blue-600' : 'text-slate-500'}`}>
                {isAr ? "الشكوى السريرية والأعراض" : "Complaint & Symptoms"}
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-white p-6">
          
          {/* Step 1: Patient and Destination */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-bold text-blue-900 text-sm">{isAr ? "تحديد هوية المريض" : "Patient Identification"}</h3>
                  <p className="text-xs text-blue-700 mt-0.5">{isAr ? "اختر مريضاً مسجلاً بالفعل أو قم بتسجيل وتكويد مريض جديد لهذه الزيارة" : "Select an existing registered patient or register a new one for this visit"}</p>
                </div>
                <div className="flex gap-2 min-w-max">
                  <button
                    type="button"
                    onClick={() => setIsNewPatientFlow(false)}
                    className={`px-4 py-1.5 rounded text-xs font-bold transition ${!isNewPatientFlow ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                  >
                    {isAr ? "مريض مسجل" : "Registered Patient"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsNewPatientFlow(true)}
                    className={`px-4 py-1.5 rounded text-xs font-bold transition ${isNewPatientFlow ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                  >
                    {isAr ? "مريض جديد بالكامل" : "Completely New Patient"}
                  </button>
                </div>
              </div>

              {isNewPatientFlow ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <div className="md:col-span-3 pb-2 border-b border-slate-200/50">
                    <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">{isAr ? "بيانات المريض الجديد الأساسية" : "New Patient Demographics"}</h4>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{isAr ? "الاسم بالإنجليزية (Name En)" : "Name (English)"} <span className="text-rose-500">*</span></label>
                    <input type="text" value={newPatientDetails.nameEn} onChange={e => handleNewPatientChange('nameEn', e.target.value)} className="w-full bg-white border border-slate-300 focus:border-blue-400 outline-none rounded px-3 py-2 text-xs font-bold" placeholder="First Middle Family Name" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{isAr ? "الاسم بالعربية (Name Ar)" : "Name (Arabic)"} <span className="text-rose-500">*</span></label>
                    <input type="text" value={newPatientDetails.nameAr} onChange={e => handleNewPatientChange('nameAr', e.target.value)} className="w-full bg-white border border-slate-300 focus:border-blue-400 outline-none rounded px-3 py-2 text-xs text-right font-bold" placeholder="الاسم رباعي باللغة العربية" dir="rtl" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{isAr ? "رقم الهاتف" : "Phone / Mobile"} <span className="text-rose-500">*</span></label>
                    <input type="text" value={newPatientDetails.phone} onChange={e => handleNewPatientChange('phone', e.target.value)} className="w-full bg-white border border-slate-300 focus:border-blue-400 outline-none rounded px-3 py-2 text-xs font-bold font-mono" placeholder="01XXXXXXXXX" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{isAr ? "الجنس" : "Gender"}</label>
                    <select value={newPatientDetails.gender} onChange={e => handleNewPatientChange('gender', e.target.value)} className="w-full bg-white border border-slate-300 focus:border-blue-400 outline-none rounded px-2 py-2 text-xs font-bold">
                      <option value="female">{isAr ? "أنثى (Female)" : "Female"}</option>
                      <option value="male">{isAr ? "ذكر (Male)" : "Male"}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{isAr ? "العمر" : "Age"}</label>
                    <input type="number" value={newPatientDetails.age} onChange={e => handleNewPatientChange('age', e.target.value)} className="w-full bg-white border border-slate-300 focus:border-blue-400 outline-none rounded px-3 py-2 text-xs font-bold" placeholder="e.g. 32" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{isAr ? "الرقم القومي / جواز السفر" : "National ID / Passport"}</label>
                    <input type="text" value={newPatientDetails.nationalId} onChange={e => handleNewPatientChange('nationalId', e.target.value)} className="w-full bg-white border border-slate-300 focus:border-blue-400 outline-none rounded px-3 py-2 text-xs font-mono font-bold" placeholder="29XXXXXXXXXXXX" />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{isAr ? "اختر المريض المسجل" : "Select Registered Patient"} <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      placeholder={isAr ? "بحث برقم الملف (MRN) أو الاسم..." : "Search by MRN or Name..."}
                      className="w-full bg-white border border-slate-300 focus:border-blue-400 outline-none rounded p-2.5 text-xs font-bold mb-2"
                      onChange={(e) => {
                        const search = e.target.value.toLowerCase();
                        // Instead of a separate state, we can just use the DOM elements or filter the patients list below
                        const options = document.querySelectorAll('.patient-option');
                        options.forEach((opt: any) => {
                          const text = opt.innerText.toLowerCase();
                          opt.style.display = text.includes(search) ? 'block' : 'none';
                        });
                      }}
                    />
                    <select
                      value={selectedPatientId}
                      onChange={e => setSelectedPatientId(e.target.value)}
                      className="w-full bg-white border border-slate-300 focus:border-blue-400 outline-none rounded p-2.5 text-xs font-bold"
                      size={4}
                    >
                      <option value="" className="patient-option">{isAr ? "-- اختر مريضاً من القائمة --" : "-- Select a patient from directory --"}</option>
                      {patients.map(p => (
                        <option key={p.id} value={p.id} className="patient-option py-1">
                          {p.mrn} - {isAr ? p.nameAr : p.nameEn} ({p.gender}, {p.dob ? new Date().getFullYear() - new Date(p.dob).getFullYear() : 'N/A'} {isAr ? "عام" : "yrs"})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Visit Type & Destination Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-slate-200/60 pt-6">
                <div className="md:col-span-4 mb-2">
                  <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">{isAr ? "بيانات الوجهة والعيادة" : "Visit Designation & Clinic info"}</h4>
                </div>
                
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{isAr ? "نوع الزيارة" : "Visit Type"}</label>
                  <select
                    value={visitData.visitType}
                    onChange={e => handleVisitChange('visitType', e.target.value as any)}
                    className="w-full bg-blue-50/50 border border-blue-200 focus:border-blue-400 outline-none rounded py-2 px-2.5 text-xs font-bold"
                  >
                    <option value="OPD">{isAr ? "عيادات خارجية (OPD)" : "Outpatient (OPD)"}</option>
                    <option value="ER">{isAr ? "طوارئ (ER)" : "Emergency (ER)"}</option>
                    <option value="IPD">{isAr ? "رعاية داخلية (IPD)" : "Inpatient (IPD)"}</option>
                    <option value="ICU">{isAr ? "عزل / رعاية مركزة (ICU)" : "Intensive Care (ICU)"}</option>
                    <option value="Telemedicine">{isAr ? "طب عن بعد (Telemedicine)" : "Telemedicine"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{isAr ? "العيادة / القسم المتلقي" : "Receiving Clinic / Department"} <span className="text-rose-500">*</span></label>
                  <select
                    value={visitData.department}
                    onChange={e => handleVisitChange('department', e.target.value)}
                    className="w-full bg-blue-50/50 border border-blue-200 focus:border-blue-400 outline-none rounded py-2 px-2.5 text-xs font-bold"
                  >
                    <option value="">{isAr ? "اختر العيادة..." : "Choose Clinic..."}</option>
                    <option value="Internal Medicine">{isAr ? "الباطنة" : "Internal Medicine"}</option>
                    <option value="Emergency Room">{isAr ? "قسم الطوارئ" : "Emergency Room"}</option>
                    <option value="Cardiology Clinic">{isAr ? "عيادة القلب" : "Cardiology Clinic"}</option>
                    <option value="Dental Clinic">{isAr ? "عيادة الأسنان" : "Dental Clinic"}</option>
                    <option value="Oncology Suite">{isAr ? "عيادة الأورام" : "Oncology Suite"}</option>
                    <option value="General Surgery">{isAr ? "الجراحة العامة" : "General Surgery"}</option>
                    <option value="Orthopedics">{isAr ? "العظام" : "Orthopedics"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{isAr ? "الطبيب المعالج" : "Attending Physician"} <span className="text-rose-500">*</span></label>
                  <select
                    value={visitData.doctorId}
                    onChange={e => handleVisitChange('doctorId', e.target.value)}
                    className="w-full bg-blue-50/50 border border-blue-200 focus:border-blue-400 outline-none rounded py-2 px-2.5 text-xs font-bold"
                  >
                    <option value="">{isAr ? "اختر الطبيب..." : "Choose Doctor..."}</option>
                    <option value="Dr. Hisham">{isAr ? "د. هشام (استشاري باطنة)" : "Dr. Hisham (Consultant)"}</option>
                    <option value="Dr. Khaled">{isAr ? "د. خالد (أخصائي طوارئ)" : "Dr. Khaled (Emergency Specialist)"}</option>
                    <option value="Dr. Rami">{isAr ? "د. رامي (استشاري قلب)" : "Dr. Rami (Cardiologist)"}</option>
                    <option value="Dr. Sarah">{isAr ? "د. سارة (استشاري أورام)" : "Dr. Sarah (Oncologist)"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{isAr ? "نوع الإجراء المخطط" : "Planned Procedure Type"}</label>
                  <select
                    value={visitData.procedureType}
                    onChange={e => handleVisitChange('procedureType', e.target.value)}
                    className="w-full bg-white border border-slate-300 focus:border-blue-400 outline-none rounded py-2 px-2.5 text-xs font-bold"
                  >
                    <option value="Consultation">{isAr ? "كشف / استشارة" : "Consultation"}</option>
                    <option value="Diagnostic Examination">{isAr ? "فحص تشخيصي" : "Diagnostic Examination"}</option>
                    <option value="Minor Surgical Procedure">{isAr ? "إجراء جراحي صغرى" : "Minor Surgical Procedure"}</option>
                    <option value="Dressing / Wound care">{isAr ? "غيار / العناية بالجروح" : "Dressing / Wound care"}</option>
                    <option value="Vaccination">{isAr ? "تطعيم" : "Vaccination"}</option>
                    <option value="Other">{isAr ? "إجراء آخر (اكتب أدناه)" : "Other (Write below)"}</option>
                  </select>
                </div>

                {visitData.procedureType === "Other" && (
                  <div className="md:col-span-4">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{isAr ? "حدد نوع الإجراء الآخر" : "Specify Other Procedure Type"}</label>
                    <input
                      type="text"
                      value={visitData.procedureTypeOther}
                      onChange={e => handleVisitChange('procedureTypeOther', e.target.value)}
                      className="w-full bg-white border border-slate-300 focus:border-blue-400 outline-none rounded px-3 py-2 text-xs font-bold"
                      placeholder={isAr ? "مثال: رسم قلب، سحب عينات خاصة" : "e.g., ECG, Special Sampling"}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Arrival Details & Referral */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Source/Origin of admission */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{isAr ? "جاء من (مصدر الدخول)" : "Source of Admission (Origin)"}</label>
                  <select
                    value={visitData.origin}
                    onChange={e => handleVisitChange('origin', e.target.value)}
                    className="w-full bg-blue-50/50 border border-blue-200 focus:border-blue-400 outline-none rounded py-2 px-2.5 text-xs font-bold"
                  >
                    <option value="Home">{isAr ? "المنزل / دخول عادي" : "Home / Routine Admission"}</option>
                    <option value="Referred from hospital">{isAr ? "محول من مستشفى أخرى" : "Referred from another hospital"}</option>
                    <option value="Primary Care Unit">{isAr ? "وحدة رعاية صحية أولية" : "Primary Health Unit"}</option>
                    <option value="Ambulance Service">{isAr ? "مرفق الإسعاف" : "Ambulance Service"}</option>
                    <option value="Other">{isAr ? "جهة أخرى" : "Other Source"}</option>
                  </select>
                </div>

                {visitData.origin === "Other" && (
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{isAr ? "حدد مصدر الدخول الآخر" : "Specify Other Source"}</label>
                    <input
                      type="text"
                      value={visitData.originOther}
                      onChange={e => handleVisitChange('originOther', e.target.value)}
                      className="w-full bg-white border border-slate-300 focus:border-blue-400 outline-none rounded px-3 py-2 text-xs font-bold"
                      placeholder={isAr ? "مثال: مدرسة، جهة عمل، إلخ" : "e.g., School, Workplace"}
                    />
                  </div>
                )}

                <div className="md:col-span-3 border-t border-slate-100 pt-4"></div>

                {/* Accompanied By (برفقته من) */}
                <div className="md:col-span-3">
                  <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-3">{isAr ? "بيانات المرافق (برفقة من؟)" : "Companion Details (Accompanied By)"}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{isAr ? "اسم المرافق" : "Companion Name"}</label>
                      <input
                        type="text"
                        value={visitData.accompaniedByName}
                        onChange={e => handleVisitChange('accompaniedByName', e.target.value)}
                        className="w-full bg-white border border-slate-300 focus:border-blue-400 outline-none rounded px-3 py-2 text-xs font-bold"
                        placeholder={isAr ? "الاسم الكامل للمرافق" : "Full companion name"}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{isAr ? "صلة القرابة" : "Relationship"}</label>
                      <select
                        value={visitData.accompaniedByRelation}
                        onChange={e => handleVisitChange('accompaniedByRelation', e.target.value)}
                        className="w-full bg-white border border-slate-300 focus:border-blue-400 outline-none rounded py-2 px-2.5 text-xs font-bold"
                      >
                        <option value="">{isAr ? "صلة القرابة..." : "Relation..."}</option>
                        <option value="Spouse">{isAr ? "زوج / زوجة" : "Spouse"}</option>
                        <option value="Parent">{isAr ? "أب / أم" : "Parent"}</option>
                        <option value="Sibling">{isAr ? "أخ / أخت" : "Sibling"}</option>
                        <option value="Child">{isAr ? "ابن / ابنة" : "Child"}</option>
                        <option value="Friend">{isAr ? "صديق" : "Friend"}</option>
                        <option value="Driver">{isAr ? "سائق" : "Driver"}</option>
                        <option value="Other">{isAr ? "أخرى" : "Other"}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{isAr ? "هاتف المرافق" : "Companion Phone"}</label>
                      <input
                        type="text"
                        value={visitData.accompaniedByPhone}
                        onChange={e => handleVisitChange('accompaniedByPhone', e.target.value)}
                        className="w-full bg-white border border-slate-300 focus:border-blue-400 outline-none rounded px-3 py-2 text-xs font-mono font-bold"
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-3 border-t border-slate-100 pt-4"></div>

                {/* Referral status (محول أم لا) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{isAr ? "هل المريض محول؟" : "Is the Patient Referred?"}</label>
                  <select
                    value={visitData.isReferred}
                    onChange={e => handleVisitChange('isReferred', e.target.value)}
                    className="w-full bg-blue-50/50 border border-blue-200 focus:border-blue-400 outline-none rounded py-2 px-2.5 text-xs font-bold"
                  >
                    <option value="No">{isAr ? "لا، حضور مباشر" : "No, Direct Walk-in"}</option>
                    <option value="Yes">{isAr ? "نعم، مريض محول" : "Yes, Referred"}</option>
                  </select>
                </div>

                {visitData.isReferred === "Yes" && (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{isAr ? "رقم خطاب / جواب التحويل" : "Referral Letter Number"}</label>
                      <input
                        type="text"
                        value={visitData.referralLetterNo}
                        onChange={e => handleVisitChange('referralLetterNo', e.target.value)}
                        className="w-full bg-white border border-slate-300 focus:border-blue-400 outline-none rounded px-3 py-2 text-xs font-bold"
                        placeholder="e.g., REF-44122"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{isAr ? "الجهة الطبية المحولة" : "Referring Institution / Hospital"}</label>
                      <input
                        type="text"
                        value={visitData.referringInstitution}
                        onChange={e => handleVisitChange('referringInstitution', e.target.value)}
                        className="w-full bg-white border border-slate-300 focus:border-blue-400 outline-none rounded px-3 py-2 text-xs font-bold"
                        placeholder={isAr ? "مستشفى القصر العيني، تأمين صحي" : "e.g., Kasr El Aini Hospital"}
                      />
                    </div>
                  </>
                )}

              </div>
            </div>
          )}

          {/* Step 3: Presenting symptoms & chief complaint */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Chief complaint */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    {isAr ? "الشكوى الرئيسية (Chief Complaint)" : "Chief Complaint"}
                  </label>
                  <textarea
                    rows={3}
                    value={visitData.chiefComplaint}
                    onChange={e => handleVisitChange('chiefComplaint', e.target.value)}
                    className="w-full bg-blue-50/20 border border-slate-300 focus:border-blue-400 outline-none rounded px-3 py-2 text-xs font-bold"
                    placeholder={isAr ? "مثال: يعاني من ألم شديد في الصدر وضيق تنفس منذ ساعتين" : "e.g., Severe chest pain and shortness of breath since 2 hours"}
                  ></textarea>
                </div>

                {/* Presenting symptoms */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    {isAr ? "الأعراض المصاحبة (Presenting Symptoms)" : "Associated / Presenting Symptoms"}
                  </label>
                  <textarea
                    rows={3}
                    value={visitData.symptoms}
                    onChange={e => handleVisitChange('symptoms', e.target.value)}
                    className="w-full bg-white border border-slate-300 focus:border-blue-400 outline-none rounded px-3 py-2 text-xs font-bold"
                    placeholder={isAr ? "مثال: غثيان، دوخة، ارتفاع ضفيف في الحرارة" : "e.g., nausea, dizziness, mild fever"}
                  ></textarea>
                </div>

                {/* Onset of symptoms */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    {isAr ? "توقيت / بدء ظهور الأعراض" : "Onset of Symptoms (When started?)"}
                  </label>
                  <input
                    type="text"
                    value={visitData.onsetOfSymptoms}
                    onChange={e => handleVisitChange('onsetOfSymptoms', e.target.value)}
                    className="w-full bg-white border border-slate-300 focus:border-blue-400 outline-none rounded px-3 py-2 text-xs font-bold"
                    placeholder={isAr ? "مثال: منذ ساعتين، منذ يومين، فجأة" : "e.g., 2 hours ago, 2 days ago, Sudden"}
                  />
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-between items-center">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            {isAr ? "مستوى الفرز: HL7 v2.5 ADT_A08" : "HL7 Compliance level: v2.5 ADT_A08"}
          </div>
          <div className="flex gap-2 min-w-max">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(prev => prev - 1)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {isAr ? "السابق" : "Previous"}
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(prev => prev + 1)}
                className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                {isAr ? "التالي" : "Next"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Save className="w-4 h-4" />
                {isAr ? "حفظ وتوليد الزيارة" : "Save & Generate Visit"}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
