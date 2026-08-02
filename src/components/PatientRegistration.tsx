import React, { useState } from "react";
import { Users, Calendar, Activity, CreditCard, UserPlus, Search, BedDouble, ArrowRightLeft, Clock, CheckCircle2, ShieldAlert, LogOut, Edit, Trash2, RefreshCcw } from "lucide-react";
import { useHIS } from "../context/HISContext";
import { Patient } from "../types";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
  departments?: string[];
}

import { GlobalEntityLink } from "./GlobalEntityLink";
import { FindPatientForm } from "./FindPatientForm";
import DynamicSelector from "./DynamicSelector";
import EnterpriseScheduler from "./EnterpriseScheduler";

export default function PatientRegistration({ language, departments = [] }: Props) {
  const isAr = language === "ar";
  const [activeSubTab, setActiveSubTab] = useState<"directory" | "register" | "appointments" | "adt" | "discharge">("directory");
  
  const { patients, addPatient, updatePatientStatus, deletePatient, updatePatient, startEncounter, beds = [], setBeds, admissions = [] } = useHIS();
  
  // Registration Form State
  const [firstName, setFirstName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [arabicName, setArabicName] = useState("");
  const [phone, setPhone] = useState("");
  const [insurance, setInsurance] = useState("Cash");
  const [gender, setGender] = useState("male");
  const [isSaving, setIsSaving] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
  const [directorySearchQuery, setDirectorySearchQuery] = useState("");
  const [advancedSearchCriteria, setAdvancedSearchCriteria] = useState<any>(null);
  const [showDischarged, setShowDischarged] = useState(false);
  const [aptSearchQuery, setAptSearchQuery] = useState("");

  const handleRegister = async () => {
    if ((!firstName && !arabicName) || !phone) {
      return toast.error(isAr ? "يرجى تعبئة الحقول المطلوبة (الاسم، الهاتف)" : "Please fill required fields (Name, Phone)");
    }
    setIsSaving(true);
    
    const fullNameEn = fatherName ? `${firstName} ${fatherName}` : (firstName || arabicName);
    const fullNameAr = arabicName || fullNameEn;

    if (editingPatientId) {
      await updatePatient(editingPatientId, {
        nameEn: fullNameEn,
        nameAr: fullNameAr,
        gender: gender as any,
        phone: phone,
        insurance: insurance as any
      });
      toast.success(isAr ? "تم تحديث بيانات المريض بنجاح" : "Patient updated successfully");
      setEditingPatientId(null);
    } else {
      const id = await addPatient({
        nameEn: fullNameEn,
        nameAr: fullNameAr,
        age: 30,
        gender: gender as any,
        phone: phone,
        insurance: insurance as any,
        workflowId: `WF-${Date.now()}`,
        dob: "1990-01-01",
        clinicalData: {
          currentWorkflowStage: "registration",
        }
      });
      await startEncounter(id, "outpatient", {});
      toast.success(isAr ? `تم حفظ المريض بنجاح!` : `Patient registered successfully!`);
    }
    
    setFirstName("");
    setFatherName("");
    setArabicName("");
    setPhone("");
    setIsSaving(false);
    setActiveSubTab("directory");
  };

  const handleEdit = (p: Patient) => {
    const parts = p.nameEn.split(" ");
    setFirstName(parts[0] || "");
    setFatherName(parts.slice(1).join(" ") || "");
    setArabicName(p.nameAr || "");
    setPhone(p.phone);
    setGender(p.gender);
    setInsurance(p.insurance);
    setEditingPatientId(p.id);
    setActiveSubTab("register");
  };

  const handleDelete = async (id: string) => {
    if (confirm(isAr ? "هل أنت متأكد من حذف هذا المريض؟" : "Are you sure you want to delete this patient?")) {
      await deletePatient(id);
      toast.info(isAr ? "تم حذف ملف المريض" : "Patient file deleted");
    }
  };

  const handleReRegister = async (id: string) => {
    if (confirm(isAr ? "هل تريد إعادة تسجيل هذا المريض لزيارة جديدة؟" : "Do you want to re-register this patient for a new visit?")) {
      await updatePatientStatus(id, "registered");
      toast.success(isAr ? "تم إعادة تفعيل ملف المريض" : "Patient file reactivated");
    }
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen font-sans text-right" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 border-r-4 border-r-blue-500 mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Users className="h-7 w-7 text-blue-600" />
            {isAr ? "الاستقبال والتسجيل وحجز المواعيد (Front Desk & ADT)" : "Reception & Registration (Front Desk)"}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {isAr ? "إدارة ملفات المرضى، المواعيد، وحركة الدخول والخروج والنقل والتسكين." : "Patient profiles, appointment scheduling, and ADT tracking."}
          </p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 flex-wrap">
          <button onClick={() => setActiveSubTab("directory")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeSubTab === "directory" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <Users className="w-4 h-4" /> {isAr ? "دليل المرضى" : "Patient Directory"}
          </button>
          <button onClick={() => window.dispatchEvent(new CustomEvent('openPatientRegistration'))} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5">
            <UserPlus className="w-4 h-4" /> {isAr ? "تسجيل ملف جديد" : "New Patient"}
          </button>
          <button onClick={() => setActiveSubTab("appointments")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeSubTab === "appointments" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <Calendar className="w-4 h-4" /> {isAr ? "حجز المواعيد" : "Appointments"}
          </button>
          <button onClick={() => setActiveSubTab("adt")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeSubTab === "adt" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <ArrowRightLeft className="w-4 h-4" /> {isAr ? "التسكين (ADT)" : "Bed Management"}
          </button>
          <button onClick={() => setActiveSubTab("discharge")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeSubTab === "discharge" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <LogOut className="w-4 h-4" /> {isAr ? "نموذج الخروج" : "Discharge Form"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {activeSubTab === "directory" && (
          <>
           <FindPatientForm 
              isAr={isAr}
              onSearch={setAdvancedSearchCriteria}
              onClear={() => {
                 setAdvancedSearchCriteria(null);
                 setDirectorySearchQuery("");
              }}
           />
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
             <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
               <h3 className="font-black text-slate-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" /> {isAr ? "سجل المرضى المسجلين" : "Registered Patients Directory"}
               </h3>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={showDischarged} 
                      onChange={(e) => setShowDischarged(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    {isAr ? "إظهار المرضى المغادرين" : "Include Discharged"}
                  </label>
                  <div className="relative w-full sm:w-64">
                    <Search className={`w-4 h-4 text-slate-400 absolute top-2.5 ${isAr ? "right-3" : "left-3"}`} />
                    <input 
                      type="text"
                      value={directorySearchQuery}
                      onChange={(e) => setDirectorySearchQuery(e.target.value)}
                      placeholder={isAr ? "بحث سريع..." : "Quick Search..."}
                      className={`w-full bg-white border border-slate-250 rounded-xl py-1.5 text-xs outline-none focus:border-indigo-500 font-bold ${isAr ? "pr-9 pl-3 text-right" : "pl-9 pr-3 text-left"}`}
                    />
                  </div>
                </div>
             </div>
             <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-sm text-left" dir={isAr ? "rtl" : "ltr"}>
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-4">{isAr ? "الرقم الطبي (MRN)" : "MRN"}</th>
                    <th className="px-4 py-4">{isAr ? "اسم المريض" : "Patient Name"}</th>
                    <th className="px-4 py-4">{isAr ? "الهاتف" : "Phone"}</th>
                    <th className="px-4 py-4">{isAr ? "التأمين" : "Insurance"}</th>
                    <th className="px-4 py-4 text-center">{isAr ? "الحالة" : "Status"}</th>
                    <th className="px-4 py-4 text-right">{isAr ? "إجراء" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patients.filter(p => {
                    const matchesStatus = showDischarged ? true : p.status !== "discharged";
                    if (!matchesStatus) return false;
                    
                    if (advancedSearchCriteria) {
                       let match = true;
                       const criteria = advancedSearchCriteria;
                       if (criteria.mrn && !p.mrn?.toLowerCase().includes(criteria.mrn.toLowerCase())) match = false;
                       if (criteria.enName1 && !p.nameEn?.toLowerCase().includes(criteria.enName1.toLowerCase())) match = false;
                       if (criteria.arName1 && !p.nameAr?.includes(criteria.arName1)) match = false;
                       if (criteria.phone && !p.phone?.includes(criteria.phone)) match = false;
                       if (criteria.sex && p.gender?.toLowerCase() !== criteria.sex.toLowerCase()) match = false;
                       return match;
                    }

                    const q = directorySearchQuery?.toLowerCase().trim();
                    if (!q) return true;
                    return (
                      (p.mrn && p.mrn.toLowerCase().includes(q)) ||
                      (p.nameAr && p.nameAr.toLowerCase().includes(q)) ||
                      (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
                      (p.phone && p.phone.toLowerCase().includes(q)) ||
                      (p.nationalId && p.nationalId.toLowerCase().includes(q))
                    );
                  }).map(p => (
                    <tr key={p.id} className={`hover:bg-slate-50 ${p.status === 'discharged' ? 'opacity-60 bg-slate-50/30' : ''}`}>
                      <td className="px-4 py-3 font-mono font-bold text-slate-500">
                        <GlobalEntityLink entityName={p.mrn} entityId={p.id} entityType="patient" isAr={isAr} />
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-800">
                        <GlobalEntityLink entityName={isAr ? p.nameAr : p.nameEn} entityId={p.id} entityType="patient" isAr={isAr} className="text-slate-800 hover:text-indigo-600" />
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-600 text-xs">{p.phone}</td>
                      <td className="px-4 py-3 text-xs font-bold text-slate-600">{p.insurance}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-bold text-[10px] px-2 py-0.5 rounded border ${
                          p.status === 'discharged' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                          p.status === 'ward' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {p.status === 'discharged' ? (isAr ? "غادر المستشفى" : "Discharged") : 
                           p.status === 'ward' ? (isAr ? "تنويم داخلي" : "Inpatient") :
                           p.status === 'doctor' ? (isAr ? "عند الطبيب" : "With Doctor") :
                           p.status?.includes('triage') ? (isAr ? "فرز طبي" : "Triage") : (isAr ? "مسجل" : "Registered")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {p.status === 'discharged' && (
                            <button 
                              onClick={() => handleReRegister(p.id)} 
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition" 
                              title={isAr ? "إعادة تسجيل" : "Re-register"}
                            >
                              <RefreshCcw className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => handleEdit(p)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition" title={isAr ? "تعديل" : "Edit"}>
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition" title={isAr ? "حذف" : "Delete"}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {patients.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500 font-bold">
                        {isAr ? "لا يوجد مرضى" : "No patients found"}
                      </td>
                    </tr>
                  )}
                </tbody>
             </table>
</div>
           </div>
          </>
        )}

        {activeSubTab === "register" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
             <div className="p-4 md:p-6 space-y-8">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                    <UserPlus className="w-6 h-6 text-blue-600" /> 
                    {editingPatientId ? (isAr ? "تعديل بيانات مريض" : "Edit Patient Profile") : (isAr ? "تسجيل مريض جديد" : "New Patient Registration")}
                  </h3>
                  <div className="flex gap-2 min-w-max">
                    <button onClick={() => setActiveSubTab("directory")} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition text-sm">
                      {isAr ? "إلغاء" : "Cancel"}
                    </button>
                    <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition text-sm flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> {isAr ? "طباعة البطاقة" : "Print Card"}
                    </button>
                    <button onClick={handleRegister} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition disabled:opacity-50 text-sm">
                      {isSaving ? "..." : (isAr ? "حفظ واستمرار" : "Save")}
                    </button>
                  </div>
                </div>

                <div className="space-y-6 max-w-5xl">
                  {/* Demographics */}
                  <section>
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-slate-400" /> {isAr ? "البيانات الديموغرافية (Demographics)" : "Demographics"}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="text-[11px] text-slate-500 font-bold block mb-1">MRN (Auto)</label>
                        <input type="text" disabled value={editingPatientId ? patients.find(p => p.id === editingPatientId)?.mrn : "Auto-generated"} className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 font-mono font-bold" />
                      </div>
                      <div className="md:col-span-3">
                        <label className="text-[11px] text-slate-500 font-bold block mb-1">{isAr ? "الاسم بالإنجليزية (English Name)" : "English Name"}</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                          <input type="text" placeholder="Middle Name" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                          <input type="text" value={fatherName} onChange={e => setFatherName(e.target.value)} placeholder="Last Name" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                        </div>
                      </div>
                      <div className="md:col-start-2 md:col-span-3">
                        <label className="text-[11px] text-slate-500 font-bold block mb-1">{isAr ? "الاسم بالعربية (Arabic Name)" : "Arabic Name"}</label>
                        <input type="text" value={arabicName} onChange={e => setArabicName(e.target.value)} placeholder={isAr ? "الاسم الرباعي باللغة العربية" : "Full Arabic Name"} className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none text-right" dir="rtl" />
                      </div>
                    </div>
                  </section>

                  {/* Personal Information */}
                  <section>
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-slate-400" /> {isAr ? "المعلومات الشخصية (Personal Information)" : "Personal Information"}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="text-[11px] text-slate-500 font-bold block mb-1">{isAr ? "الجنس (Gender)" : "Gender"}</label>
                        <select value={gender} onChange={e => setGender(e.target.value)} className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none">
                          <option value="male">{isAr ? "ذكر" : "Male"}</option>
                          <option value="female">{isAr ? "أنثى" : "Female"}</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-500 font-bold block mb-1">{isAr ? "تاريخ الميلاد (DOB)" : "DOB"}</label>
                        <input type="date" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-500 font-bold block mb-1">{isAr ? "الحالة الاجتماعية (Marital Status)" : "Marital Status"}</label>
                        <select className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none">
                          <option>{isAr ? "أعزب" : "Single"}</option>
                          <option>{isAr ? "متزوج" : "Married"}</option>
                          <option>{isAr ? "أرمل" : "Widowed"}</option>
                          <option>{isAr ? "مطلق" : "Divorced"}</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-500 font-bold block mb-1">{isAr ? "الجنسية (Nationality)" : "Nationality"}</label>
                        <input type="text" placeholder={isAr ? "مثال: مصري، سعودي" : "e.g., Egyptian, Saudi"} className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[11px] text-slate-500 font-bold block mb-1">{isAr ? "الرقم القومي (National ID)" : "National ID"}</label>
                        <input type="text" maxLength={14} placeholder="e.g., 2950101..." className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none font-mono" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[11px] text-slate-500 font-bold block mb-1">{isAr ? "جواز السفر (Passport)" : "Passport"}</label>
                        <input type="text" placeholder="e.g., A1234567" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none font-mono" />
                      </div>
                    </div>
                  </section>

                  {/* Contact & Address */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section>
                      <h4 className="font-bold text-slate-800 mb-4">{isAr ? "بيانات الاتصال (Contact)" : "Contact"}</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[11px] text-slate-500 font-bold block mb-1">Mobile 1</label>
                            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="01X-XXXX-XXXX" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-500 font-bold block mb-1">Mobile 2</label>
                            <input type="tel" placeholder="Alternative mobile" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                          </div>
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500 font-bold block mb-1">Email</label>
                          <input type="email" placeholder="patient@example.com" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                        </div>
                      </div>
                    </section>
                    
                    <section>
                      <h4 className="font-bold text-slate-800 mb-4">{isAr ? "العنوان (Address)" : "Address"}</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[11px] text-slate-500 font-bold block mb-1">Country</label>
                            <input type="text" placeholder="Country" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                          </div>
                          <div>
                            <DynamicSelector
                              language={language}
                              category="city"
                              labelAr="المدينة"
                              labelEn="City"
                              value={""} // Adding state would be better, but demonstrating with simple binding
                              onChange={(val) => console.log("City selected:", val)}
                              module="Registration"
                              screen="New Patient"
                              fieldName="City"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[11px] text-slate-500 font-bold block mb-1">District</label>
                            <input type="text" placeholder="District" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-500 font-bold block mb-1">Street</label>
                            <input type="text" placeholder="Street name" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Insurance & Emergency */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4 text-slate-500" /> {isAr ? "التأمين (Insurance)" : "Insurance"}</h4>
                      <div className="space-y-4">
                        <div>
                          <DynamicSelector
                            language={language}
                            category="insurance"
                            labelAr="شركة التأمين"
                            labelEn="Insurance Company"
                            value={insurance}
                            onChange={setInsurance}
                            module="Registration"
                            screen="New Patient"
                            fieldName="Insurance Company"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className={insurance === "Cash" ? "opacity-50 pointer-events-none" : ""}>
                            <label className="text-[11px] text-slate-500 font-bold block mb-1">Policy Number</label>
                            <input type="text" placeholder="Policy ID" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                          </div>
                          <div className={insurance === "Cash" ? "opacity-50 pointer-events-none" : ""}>
                            <label className="text-[11px] text-slate-500 font-bold block mb-1">Class / Network</label>
                            <select className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none">
                              <option>VIP</option>
                              <option>Class A</option>
                              <option>Class B</option>
                              <option>Class C</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-slate-500" /> {isAr ? "جهة الاتصال للطوارئ (Emergency Contact)" : "Emergency Contact"}</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="text-[11px] text-slate-500 font-bold block mb-1">Name</label>
                          <input type="text" placeholder="Contact Name" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[11px] text-slate-500 font-bold block mb-1">Relation</label>
                            <select className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none">
                              <option>Spouse</option>
                              <option>Parent</option>
                              <option>Sibling</option>
                              <option>Child</option>
                              <option>Friend</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-500 font-bold block mb-1">Mobile</label>
                            <input type="tel" placeholder="01X-XXXX-XXXX" className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs outline-none" />
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100 bg-slate-50/50 p-4 rounded-xl items-center justify-between">
                    <div>
                      <button onClick={() => setActiveSubTab("directory")} className="px-6 py-2.5 font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition text-sm">
                        {isAr ? "إلغاء (Cancel)" : "Cancel"}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-4 py-2.5 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 font-bold rounded-lg transition text-sm shadow-sm">
                        {isAr ? "حفظ كجديد (Save & New)" : "Save & New"}
                      </button>
                      <button className="px-4 py-2.5 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 font-bold rounded-lg transition text-sm shadow-sm">
                        {isAr ? "حفظ وحجز موعد (Save & Appt)" : "Save & Appointment"}
                      </button>
                      <button className="px-4 py-2.5 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 font-bold rounded-lg transition text-sm shadow-sm">
                        {isAr ? "حفظ وعيادة (Save & OPD)" : "Save & OPD"}
                      </button>
                      <button onClick={handleRegister} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-lg shadow-sm transition disabled:opacity-50 text-sm">
                        {isSaving ? "Saving..." : (isAr ? "حفظ (Save)" : "Save")}
                      </button>
                    </div>
                  </div>

                </div>
             </div>
          </div>
        )}
        {activeSubTab === "appointments" && (
           <EnterpriseScheduler language={language} />
        )}

        {activeSubTab === "adt" && (
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-fade-in space-y-6">
              <h3 className="font-black text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-indigo-500" /> {isAr ? "إدارة التسكين الداخلي (Bed Management Area)" : "Bed Management Area"}
              </h3>

              <div className="flex gap-4 mb-4">
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div><span className="text-xs font-bold text-slate-600">{isAr ? "سرير شاغر ونظيف (Vacant)" : "Vacant & Clean"}</span></div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-rose-500 rounded-full"></div><span className="text-xs font-bold text-slate-600">{isAr ? "سرير مشغول (Occupied)" : "Occupied"}</span></div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-500 rounded-full"></div><span className="text-xs font-bold text-slate-600">{isAr ? "يحتاج تنظيف (Dirty/Setup)" : "Dirty"}</span></div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-500 rounded-full"></div><span className="text-xs font-bold text-slate-600">{isAr ? "صيانة/مغلق (Blocked)" : "Blocked/Maint."}</span></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                 {beds.length > 0 ? beds.map(bed => {
                    let bedStatus = bed.status || "available";
                    const isOccupied = bedStatus === "occupied";
                    const isAvailable = bedStatus === "available";

                    const bedColors = {
                      available: "bg-emerald-50 border-emerald-200 text-emerald-800 hover:border-emerald-400 cursor-pointer",
                      occupied: "bg-rose-50 border-rose-200 text-rose-800 cursor-help",
                      cleaning: "bg-amber-50 border-amber-200 text-amber-800",
                      maintenance: "bg-slate-100 border-slate-300 text-slate-500"
                    };
                    const dotColors = {
                      available: "bg-emerald-500", occupied: "bg-rose-500", cleaning: "bg-amber-500", maintenance: "bg-slate-500"
                    };
                    
                    const activeAdmission = isOccupied ? admissions.find((a: any) => a.bedId === bed.id && a.status === 'active') : null;
                    const patient = activeAdmission ? patients.find(p => p.id === activeAdmission.patientId) : null;

                    return (
                      <div key={bed.id} className={`border-2 rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition ${bedColors[bedStatus as keyof typeof bedColors] || bedColors.available}`}>
                         <div className="flex justify-between w-full items-center">
                           <div className={`w-2 h-2 rounded-full ${dotColors[bedStatus as keyof typeof dotColors] || dotColors.available}`}></div>
                           <span className="text-[9px] font-black font-mono truncate">{bed.bedNumber}</span>
                         </div>
                         <BedDouble className="w-6 h-6 opacity-80" />
                         <span className="font-bold text-sm text-center truncate">{bed.departmentId}</span>
                         {isAvailable && <button onClick={() => {
                            toast.info(isAr ? "تحويل لشاشة التسكين..." : "Redirecting to admission...");
                            setActiveSubTab("directory");
                         }} className="text-[8px] bg-white border border-emerald-200 px-2 py-1 rounded w-full font-bold text-emerald-800 hover:bg-emerald-50">{isAr ? "تسكين طلب دخول" : "Assign Bed"}</button>}
                         {isOccupied && patient && (
                            <div className="flex flex-col gap-1 w-full mt-1">
                               <span className="text-[9px] font-mono font-bold bg-white/50 px-1 py-0.5 rounded text-center block truncate" title={patient.nameEn}>{patient.nameEn}</span>
                               <span className="text-[9px] font-mono font-bold bg-white/50 px-1 py-0.5 rounded text-center block truncate">{patient.mrn}</span>
                               <div className="flex gap-1 w-full">
                                  <button onClick={() => toast.info(isAr ? "نقل المريض" : "Transfer patient")} className="flex-1 text-[8px] bg-white border border-indigo-200 px-1 py-1 rounded font-bold text-indigo-700 hover:bg-indigo-50">{isAr ? "نقل" : "Transfer"}</button>
                                  <button onClick={() => setActiveSubTab("discharge")} className="flex-1 text-[8px] bg-white border border-rose-200 px-1 py-1 rounded font-bold text-rose-700 hover:bg-rose-50">{isAr ? "خروج" : "Discharge"}</button>
                               </div>
                            </div>
                         )}
                      </div>
                    )
                 }) : (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400">
                      <BedDouble className="w-12 h-12 mb-4 opacity-20" />
                      <p>{isAr ? "لم يتم تكوين الأسرة في النظام." : "No beds configured in the system."}</p>
                    </div>
                 )}
              </div>

           </div>
        )}

        {activeSubTab === "discharge" && (
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-fade-in max-w-3xl">
              <h3 className="font-black text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2 mb-6">
                <LogOut className="w-5 h-5 text-indigo-500" /> {isAr ? "نموذج الخروج والتسوية (Discharge Form)" : "Discharge Checklist & Settlement"}
              </h3>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 flex justify-between items-center">
                 <div>
                    <p className="text-xs text-slate-500 font-bold">Patient Details</p>
                    <p className="font-black text-slate-800 text-lg">MRN-2026-0031 | مروان أحمد عبد السلام</p>
                 </div>
                 <div className="text-right">
                    <p className="text-xs text-slate-500 font-bold">Bed Location</p>
                    <p className="font-black text-indigo-700 text-lg">Ward B - RM 205</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 border border-slate-200 rounded-lg bg-white cursor-pointer hover:bg-slate-50">
                    <input type="checkbox" className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500" defaultChecked/>
                    <div className="flex-1">
                       <p className="text-sm font-bold text-slate-800">{isAr ? "نموذج الخروج الطبي مختوم من الطبيب" : "Medical Discharge Summary signed by attending physician"}</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                 </label>
                 
                 <label className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 border border-slate-200 rounded-lg bg-white cursor-pointer hover:bg-slate-50">
                    <input type="checkbox" className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500" defaultChecked/>
                    <div className="flex-1">
                       <p className="text-sm font-bold text-slate-800">{isAr ? "استلام العلاج الموصوف عند الخروج من الصيدلية" : "Discharge medications dispensed from Pharmacy"}</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                 </label>

                 <label className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 border border-rose-200 rounded-lg bg-rose-50 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500" />
                    <div className="flex-1">
                       <p className="text-sm font-bold text-rose-800">{isAr ? "تسوية الحساب الختامي في قسم الحسابات" : "Final billing settlement and financial clearance"}</p>
                    </div>
                    <ShieldAlert className="w-5 h-5 text-rose-500" />
                 </label>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
                 <button className="px-6 py-2 border border-slate-300 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50">{isAr ? "إلغاء الخروج" : "Cancel Discharge"}</button>
                 <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md disabled:opacity-50" disabled>{isAr ? "تأكيد الخروج وطلب تنظيف السرير" : "Confirm Discharge & Request Bed Cleaning"}</button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
