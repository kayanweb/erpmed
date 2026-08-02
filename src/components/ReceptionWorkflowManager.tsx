import React, { useState } from 'react';
import { useHIS } from '../context/HISContext';
import { 
  UserPlus, Search, Fingerprint, CreditCard, 
  ShieldCheck, FileText, Globe, Phone,
  Calendar, Clock, CheckCircle2, AlertCircle,
  Plus, Save, RefreshCw, Zap, Building,
  IdCard, MapPin, Heart, Users,
  ChevronRight, ArrowRight, Wallet,
  Building2, Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type ReceptionStage = 'SEARCH' | 'REGISTRATION' | 'INSURANCE' | 'BOOKING' | 'PAYMENT';

export default function ReceptionWorkflowManager({ language, onClose }: { language: 'ar' | 'en', onClose?: () => void }) {
  const isAr = language === 'ar';
  const { patients, addPatient, addJourneyStep, currentUser } = useHIS();
  const [activeStage, setActiveStage] = useState<ReceptionStage>('SEARCH');
  const [formData, setFormData] = useState({
    mrn: `MRN-${Math.floor(Math.random() * 1000000)}`,
    nameEn: "",
    nameAr: "",
    age: 0,
    gender: "Male",
    phone: "",
    insurance: "Cash",
    nationality: "Egyptian",
    civilId: ""
  });

  const handleRegister = () => {
    const newPatient = {
      ...formData,
      id: `pat-${Date.now()}`,
      status: 'registered' as const,
      createdAt: new Date().toISOString()
    };
    addPatient(newPatient);
    addJourneyStep({
      patientId: newPatient.id,
      department: 'RECEPTION',
      status: 'Registered',
      actionBy: currentUser?.name || 'Receptionist',
      notesEn: 'New patient registered and visit initiated',
      notesAr: 'تم تسجيل مريض جديد وبدء الزيارة'
    });
    setActiveStage('BOOKING');
  };

  return (
    <div className="flex h-[800px] gap-6" dir={isAr ? 'rtl' : 'ltr'}>
       {/* Workflow Stepper Sidebar */}
       <div className="w-80 bg-white border border-slate-200 rounded-[32px] overflow-hidden flex flex-col shadow-sm">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50">
             <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-6">{isAr ? "مسار الاستقبال" : "Reception Workflow"}</h3>
             <div className="space-y-4">
                {[
                  { id: 'SEARCH', labelEn: 'Identity Search', labelAr: 'البحث عن الهوية', icon: Search },
                  { id: 'REGISTRATION', labelEn: 'Demographics', labelAr: 'البيانات الشخصية', icon: UserPlus },
                  { id: 'INSURANCE', labelEn: 'Eligibility', labelAr: 'أهلية العلاج', icon: ShieldCheck },
                  { id: 'BOOKING', labelEn: 'Visit Initiation', labelAr: 'فتح زيارة', icon: Calendar },
                  { id: 'PAYMENT', labelEn: 'Financial Entry', labelAr: 'الدفع المسبق', icon: Wallet }
                ].map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => setActiveStage(step.id as ReceptionStage)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                      activeStage === step.id 
                        ? 'border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm' 
                        : 'border-white hover:bg-slate-50 text-slate-400'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeStage === step.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-400'}`}>
                       <step.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-right">
                       <p className="text-[10px] font-black uppercase tracking-widest">{isAr ? step.labelAr : step.labelEn}</p>
                    </div>
                    {activeStage === step.id && <ChevronRight className="w-4 h-4" />}
                  </button>
                ))}
             </div>
          </div>
          
          <div className="p-8 flex-1 bg-slate-50/30 flex flex-col items-center justify-center text-center">
             <div className="w-20 h-20 bg-white border border-slate-200 rounded-[24px] flex items-center justify-center mb-4 shadow-sm">
                <Fingerprint className="w-10 h-10 text-slate-300" />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{isAr ? "دعم البصمة متاح" : "Biometric Support Active"}</p>
          </div>
       </div>

       {/* Main Form Canvas */}
       <div className="flex-1 bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm flex flex-col relative">
          {/* Module Header with Close Button */}
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
             <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                   <Building className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="text-sm font-black text-slate-900 tracking-tight">{isAr ? "نظام الاستقبال والتسجيل" : "Reception & Registration System"}</h3>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? "إدارة دخول المرضى والزيارات" : "Patient Entry & Visit Management"}</p>
                </div>
             </div>
             <button 
               onClick={onClose}
               className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm group"
               title={isAr ? "إغلاق والعودة للرئيسية" : "Close & Return to Dashboard"}
             >
                <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
             </button>
          </div>

          <AnimatePresence mode="wait">
             {activeStage === 'SEARCH' && (
               <motion.div 
                 key="search"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="flex-1 flex flex-col items-center justify-center p-12"
               >
                  <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-8 border border-indigo-100">
                     <IdCard className="w-12 h-12 text-indigo-600" />
                  </div>
                  <h2 className="text-lg sm:text-2xl font-black text-slate-900 mb-2">{isAr ? "التحقق من الهوية" : "Identity Verification"}</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-12">{isAr ? "أدخل رقم الهوية أو جواز السفر" : "Enter National ID or Passport"}</p>
                  
                  <div className="w-full max-w-md relative">
                     <Search className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                     <input 
                       type="text" 
                       placeholder={isAr ? "رقم الهوية الوطنية / الإقامة..." : "National ID / Residence No..."}
                       className="w-full h-16 ltr:pl-12 rtl:pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-black outline-none focus:border-indigo-400 transition-all shadow-inner"
                     />
                     <button 
                       onClick={() => setActiveStage('REGISTRATION')}
                       className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 h-10 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black"
                     >
                        {isAr ? "بحث" : "Verify"}
                     </button>
                  </div>
                  
                  <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                     <button className="flex flex-wrap items-center gap-2 sm:gap-3 p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 transition-all shadow-sm">
                        <Camera className="w-5 h-5 text-slate-400" />
                        <span className="text-[10px] font-black text-slate-600 uppercase">{isAr ? "مسح ضوئي" : "Scan Document"}</span>
                     </button>
                     <button className="flex flex-wrap items-center gap-2 sm:gap-3 p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 transition-all shadow-sm">
                        <Plus className="w-5 h-5 text-indigo-600" />
                        <span className="text-[10px] font-black text-slate-600 uppercase">{isAr ? "مريض مجهول" : "Unknown Patient"}</span>
                     </button>
                  </div>
               </motion.div>
             )}

             {activeStage === 'REGISTRATION' && (
                <motion.div 
                  key="reg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 p-12 overflow-y-auto custom-scrollbar"
                >
                   <div className="flex items-center justify-between mb-12">
                      <div>
                         <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">{isAr ? "تسجيل مريض جديد" : "New Patient Registration"}</h2>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">MRN: {formData.mrn}</p>
                      </div>
                      <div className="w-24 h-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
                         <Camera className="w-6 h-6 mb-1" />
                         <span className="text-[8px] font-black uppercase">Add Photo</span>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{isAr ? "الاسم بالعربية" : "Name (Arabic)"}</label>
                            <input 
                              type="text" 
                              className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold focus:border-indigo-400 outline-none"
                              value={formData.nameAr}
                              onChange={(e) => setFormData({...formData, nameAr: e.target.value})}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{isAr ? "الاسم بالإنجليزية" : "Name (English)"}</label>
                            <input 
                              type="text" 
                              className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold focus:border-indigo-400 outline-none"
                              value={formData.nameEn}
                              onChange={(e) => setFormData({...formData, nameEn: e.target.value})}
                            />
                         </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{isAr ? "العمر" : "Age"}</label>
                               <input 
                                 type="number" 
                                 className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold"
                                 value={formData.age}
                                 onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{isAr ? "الجنس" : "Gender"}</label>
                               <select 
                                 className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold outline-none"
                                 value={formData.gender}
                                 onChange={(e) => setFormData({...formData, gender: e.target.value})}
                               >
                                  <option value="Male">{isAr ? "ذكر" : "Male"}</option>
                                  <option value="Female">{isAr ? "أنثى" : "Female"}</option>
                               </select>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{isAr ? "رقم الهاتف" : "Phone Number"}</label>
                            <div className="relative">
                               <Phone className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                               <input 
                                 type="text" 
                                 className="w-full h-12 bg-slate-50 border border-slate-100 ltr:pl-12 rtl:pr-12 rounded-xl text-sm font-bold"
                                 value={formData.phone}
                                 onChange={(e) => setFormData({...formData, phone: e.target.value})}
                               />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{isAr ? "الجنسية" : "Nationality"}</label>
                            <input 
                              type="text" 
                              className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold"
                              value={formData.nationality}
                              onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{isAr ? "رقم الهوية" : "ID / Civil No"}</label>
                            <input 
                              type="text" 
                              className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold"
                              value={formData.civilId}
                              onChange={(e) => setFormData({...formData, civilId: e.target.value})}
                            />
                         </div>
                      </div>
                   </div>

                   <div className="mt-12 flex justify-end gap-3 pt-8 border-t border-slate-100">
                      <button className="h-12 px-8 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition">
                         {isAr ? "إلغاء" : "Cancel"}
                      </button>
                      <button 
                        onClick={handleRegister}
                        className="h-12 px-12 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-100"
                      >
                         {isAr ? "حفظ واستكمال" : "Save & Continue"}
                      </button>
                   </div>
                </motion.div>
             )}

             {activeStage === 'BOOKING' && (
                <motion.div 
                  key="booking"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 p-12 overflow-y-auto custom-scrollbar"
                >
                   <div className="flex items-center justify-between mb-12">
                      <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">{isAr ? "بدء زيارة المريض" : "Visit Initiation"}</h2>
                      <div className="flex gap-2 min-w-max">
                         <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Identity Verified</span>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-slate-50/50 rounded-[32px] p-8 border border-slate-100 space-y-6">
                         <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-indigo-600" />
                            {isAr ? "نوع الزيارة والعيادة" : "Visit Type & Clinic"}
                         </h3>
                         <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                               <button className="p-4 bg-white border-2 border-indigo-200 rounded-2xl text-[10px] font-black uppercase text-indigo-700 shadow-sm">{isAr ? "عيادة خارجية (OPD)" : "Outpatient (OPD)"}</button>
                               <button className="p-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:border-rose-200 hover:text-rose-600 transition-all">{isAr ? "طوارئ (ER)" : "Emergency (ER)"}</button>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase">{isAr ? "العيادة المطلوبة" : "Specialty Clinic"}</label>
                               <select className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-sm font-bold outline-none">
                                  <option>Internal Medicine</option>
                                  <option>Pediatrics</option>
                                  <option>Cardiology</option>
                                  <option>Orthopedics</option>
                               </select>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase">{isAr ? "الطبيب المفضل" : "Preferred Physician"}</label>
                               <select className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-sm font-bold outline-none">
                                  <option>Any Available Doctor</option>
                                  <option>Dr. Ahmed Salem</option>
                                  <option>Dr. Sarah Khalil</option>
                               </select>
                            </div>
                         </div>
                      </div>

                      <div className="bg-slate-50/50 rounded-[32px] p-8 border border-slate-100 space-y-6">
                         <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-emerald-600" />
                            {isAr ? "التغطية المالية" : "Financial Coverage"}
                         </h3>
                         <div className="space-y-4">
                            <div className="flex items-center gap-2 sm:gap-4 flex-wrap  p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                               <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600"><CreditCard className="w-6 h-6" /></div>
                               <div className="flex-1">
                                  <p className="text-[10px] font-black uppercase text-slate-400">Current Method</p>
                                  <p className="text-sm font-black text-slate-800">Cash / Private Pay</p>
                               </div>
                               <button className="p-2 hover:bg-slate-50 rounded-lg text-indigo-600"><RefreshCw className="w-4 h-4" /></button>
                            </div>
                            <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-center">
                               <p className="text-[10px] font-black text-emerald-700 uppercase mb-1">Registration Fee</p>
                               <p className="text-3xl font-black text-emerald-900">50.00 <span className="text-xs uppercase">EGP</span></p>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="mt-12 flex justify-between items-center pt-8 border-t border-slate-100">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                         <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"><Clock className="w-5 h-5 text-slate-400" /></div>
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase">Token Number</p>
                            <p className="text-sm font-black text-slate-800">#OPD-044</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => setActiveStage('PAYMENT')}
                        className="h-14 px-12 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition shadow-xl shadow-emerald-100 flex items-center gap-2"
                      >
                         <CheckCircle2 className="w-5 h-5" />
                         {isAr ? "إصدار التذكرة والدفع" : "Generate Token & Pay"}
                      </button>
                   </div>
                </motion.div>
             )}
          </AnimatePresence>
       </div>
    </div>
  );
}
