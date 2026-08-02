import React, { useState, useEffect } from "react";
import { X, Save, User, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { defaultRegistrationFields, RegistrationField } from "../data/defaultRegistrationFields";
import { useHIS } from "../context/HISContext";

interface Props {
  isOpen: boolean;
  isAr: boolean;
  onClose: () => void;
  onRegister?: (patientData: any) => void;
  defaultEmergencyMode?: boolean;
}

export function ComprehensiveRegistrationModal({ isOpen, isAr, onClose, onRegister, defaultEmergencyMode }: Props) {
  const [step, setStep] = useState(1);
  const { getSetting, addPatient } = useHIS();
  
  // Load dynamic fields config from HISContext
  const [fields, setFields] = useState<RegistrationField[]>(defaultRegistrationFields);

  useEffect(() => {
    getSetting("patient_registration_config").then(saved => {
      if (saved) {
        setFields(saved);
      }
    });
  }, [getSetting]);

  // Initialize form state dynamically
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const initial: any = {};
    fields.forEach(f => {
      if (f.key === "sex") initial[f.key] = f.options?.[0] || "FEMALE";
      else if (f.key === "nationality") initial[f.key] = f.options?.[0] || "EGYPTIAN";
      else if (f.key === "country") initial[f.key] = f.options?.[0] || "Egypt";
      else if (f.key === "category") initial[f.key] = f.options?.[0] || "Cash";
      else if (f.key === "paymentType") initial[f.key] = f.options?.[0] || "Cash";
      else if (f.key === "idType") initial[f.key] = f.options?.[0] || "National ID";
      else initial[f.key] = "";
    });
    setFormData(initial);
  }, [fields]);

  if (!isOpen) return null;

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate age if DOB is changed
      if (field === "dob" && value) {
        try {
          const birthDate = new Date(value);
          const today = new Date();
          let calculatedAge = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
          }
          if (calculatedAge >= 0) {
            updated.age = String(calculatedAge);
          }
        } catch (e) {}
      }
      return updated;
    });
  };

  const handleSave = async () => {
    // Dynamic Validation: Check only enabled and required fields
    const missingFields = fields.filter(f => f.enabled && f.required && !formData[f.key]);
    
    if (missingFields.length > 0) {
      const missingNames = missingFields.map(f => isAr ? f.labelAr : f.labelEn).join(", ");
      toast.error(
        isAr 
          ? `يرجى ملء الحقول الإلزامية التالية: ${missingNames}` 
          : `Please fill the following mandatory fields: ${missingNames}`
      );
      return;
    }
    
    // Construct names
    const nameEn = [
      formData.enName1,
      formData.enName2,
      formData.enName3,
      formData.enName4
    ].filter(Boolean).join(" ").trim() || `Patient ${Date.now().toString().slice(-4)}`;

    const nameAr = [
      formData.arName1,
      formData.arName2,
      formData.arName3,
      formData.arName4
    ].filter(Boolean).join(" ").trim() || `مريض ${Date.now().toString().slice(-4)}`;

    const finalData = { ...formData };
    Object.keys(finalData).forEach(key => {
      if ((finalData[key] === "OTHER" || finalData[key] === "Other") && finalData[`${key}Other`]) {
        finalData[key] = finalData[`${key}Other`];
      }
    });

    const newPatientId = await addPatient({
      nameEn,
      nameAr,
      age: Number(formData.age) || 30,
      gender: (formData.sex || "FEMALE").toLowerCase() as any,
      phone: formData.phone || formData.mobile || "0123456789",
      phoneNumber: formData.mobile || formData.phone,
      nationalId: formData.idType === "National ID" ? formData.idNo : undefined,
      passportNumber: formData.idType === "Passport" ? formData.idNo : undefined,
      bloodGroup: formData.bloodGroup,
      nationality: formData.nationality,
      ...finalData
    });

    if (newPatientId && onRegister) {
       onRegister({ id: newPatientId, ...formData });
    }

    onClose();
  };

  // Divide fields into steps
  // Step 1: Personal & Contact details
  // Step 2: Relative, Payment, Other & Custom attributes
  const step1Fields = fields.filter(f => f.enabled && (f.section === "personal" || f.section === "contact"));
  const step2Fields = fields.filter(f => f.enabled && (f.section === "relative" || f.section === "payment" || f.section === "other" || f.section === "custom"));

  const activeFields = step === 1 ? step1Fields : step2Fields;

  // Total statistics for progress badge
  const totalEnabled = fields.filter(f => f.enabled).length;
  const totalRequired = fields.filter(f => f.enabled && f.required).length;

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn" dir={isAr ? "rtl" : "ltr"}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col border border-slate-150">
        
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#0a4275]/10 text-[#0a4275] rounded-lg">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                {isAr ? "تسجيل مريض جديد" : "New Patient Registration"}
              </h2>
              <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                {isAr 
                  ? "إدخال بيانات الملف الطبي والربط السريع مع بوابة الاستقبال" 
                  : "Enter medical registry files and sync live to the reception portal"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleSave} 
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isAr ? "حفظ وتوليد الملف" : "Save & Generate MRN"}</span>
            </button>
            <button 
              onClick={onClose} 
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
          
          {/* Stepper Header */}
          <div className="flex items-center justify-center mb-6 relative max-w-xl mx-auto">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 -z-10"></div>
            <div className="flex justify-between w-full relative z-10">
              {/* Step 1 Button */}
              <button 
                onClick={() => setStep(1)} 
                className="flex flex-col items-center focus:outline-none"
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all border shadow-sm ${step === 1 ? 'bg-[#0a4275] text-white border-[#0a4275] ring-4 ring-[#0a4275]/15' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                  1
                </div>
                <span className={`text-[10px] font-black mt-1.5 ${step === 1 ? 'text-[#0a4275]' : 'text-slate-400'}`}>
                  {isAr ? "البيانات الأساسية والعناوين" : "Primary Patient Info"}
                </span>
              </button>

              {/* Step 2 Button */}
              <button 
                onClick={() => setStep(2)} 
                className="flex flex-col items-center focus:outline-none"
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all border shadow-sm ${step === 2 ? 'bg-[#0a4275] text-white border-[#0a4275] ring-4 ring-[#0a4275]/15' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                  2
                </div>
                <span className={`text-[10px] font-black mt-1.5 ${step === 2 ? 'text-[#0a4275]' : 'text-slate-400'}`}>
                  {isAr ? "بيانات الجهات والأقارب" : "Relatives & Insurance details"}
                </span>
              </button>
            </div>
          </div>

          {/* Form Fields Render Grid */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm w-full space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeFields.map((field) => {
                const isRequired = field.required;
                const colSpanClass = field.colSpan === 2 
                  ? "md:col-span-2" 
                  : field.colSpan === 3 
                    ? "md:col-span-3" 
                    : field.colSpan === 4 
                      ? "md:col-span-4" 
                      : "md:col-span-1";

                return (
                  <div key={field.key} className={`${colSpanClass} space-y-1`}>
                    <label className="block text-[11px] font-black text-slate-700 uppercase flex items-center gap-1 justify-start">
                      <span>{isAr ? field.labelAr : field.labelEn}</span>
                      {isRequired && <span className="text-rose-500 font-bold">*</span>}
                    </label>

                    {/* Rendering Input based on Field Type */}
                    {field.key === "mrn" ? (
                      <input 
                        type="text" 
                        disabled 
                        placeholder={isAr ? "سيتم توليده تلقائياً" : "Will auto-generate"} 
                        className="w-full bg-slate-100 border border-slate-200 text-slate-500 font-mono font-bold rounded-lg px-3 py-1.5 text-xs text-center" 
                      />
                    ) : field.type === "select" ? (
                      <div className="space-y-1">
                      <select
                        value={formData[field.key] || ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className={`w-full border rounded-lg px-3 py-1.5 text-xs outline-none transition focus:ring-1 focus:ring-pink-500 ${
                          isRequired 
                             ? "bg-pink-50/20 border-pink-100 font-bold" 
                             : "bg-white border-slate-200"
                        }`}
                      >
                        <option value="">{isAr ? "اختر..." : "Choose..."}</option>
                        {(field.options || []).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {(formData[field.key] === "OTHER" || formData[field.key] === "Other") && (
                        <input
                          type="text"
                          required
                          placeholder={isAr ? "يرجى التحديد..." : "Please specify..."}
                          value={formData[`${field.key}Other`] || ""}
                          onChange={(e) => handleChange(`${field.key}Other`, e.target.value)}
                          className="w-full border rounded-lg px-3 py-1.5 text-xs outline-none transition focus:ring-1 focus:ring-pink-500 bg-pink-50/20 border-pink-100 font-bold"
                        />
                      )}
                      </div>
                    ) : field.type === "date" ? (
                      <input
                        type="date"
                        value={formData[field.key] || ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className={`w-full border rounded-lg px-3 py-1.5 text-xs outline-none transition focus:ring-1 focus:ring-pink-500 ${
                          isRequired 
                            ? "bg-pink-50/20 border-pink-100 font-bold" 
                            : "bg-white border-slate-200"
                        }`}
                      />
                    ) : (
                      <input
                        type={field.type === "number" ? "number" : "text"}
                        value={formData[field.key] || ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className={`w-full border rounded-lg px-3 py-1.5 text-xs outline-none transition focus:ring-1 focus:ring-pink-500 ${
                          isRequired 
                            ? "bg-pink-50/20 border-pink-100 font-bold" 
                            : "bg-white border-slate-200"
                        } ${isAr && field.key.startsWith("arName") ? "text-right" : ""}`}
                        dir={isAr && field.key.startsWith("arName") ? "rtl" : "ltr"}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Empty section state inside page */}
            {activeFields.length === 0 && (
              <div className="p-12 text-center text-slate-400 font-bold text-xs">
                {isAr 
                  ? "لا توجد حقول مفعلة في هذه الصفحة حالياً. يمكنك تفعيلها من لوحة الإعدادات." 
                  : "No enabled fields in this step. You can customize them in IT portal settings."}
              </div>
            )}
          </div>

          {/* Wizard Controls */}
          <div className="flex justify-between items-center w-full mt-6">
            {step === 2 ? (
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span>{isAr ? "السابق" : "Previous"}</span>
              </button>
            ) : (
              <div></div>
            )}

            {step === 1 ? (
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2 bg-[#0a4275] hover:bg-[#073056] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer ml-auto"
              >
                <span>{isAr ? "التالي" : "Next"}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer ml-auto"
              >
                <Save className="w-4 h-4" />
                <span>{isAr ? "حفظ وتوليد الملف" : "Save & Generate MRN"}</span>
              </button>
            )}
          </div>
          
          {/* Dynamic Metrics Badge */}
          <div className="mt-8 flex justify-end w-full text-[10px] font-bold text-slate-400">
             <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xs">
               <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span> 
               <span>
                 {isAr 
                   ? `المحرك النشط: ${totalEnabled} حقول مفعّلة (${totalRequired} إجباري / ${totalEnabled - totalRequired} اختياري)` 
                   : `Dynamic Config: ${totalEnabled} active fields (${totalRequired} required / ${totalEnabled - totalRequired} optional)`}
               </span>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ComprehensiveRegistrationModal;
