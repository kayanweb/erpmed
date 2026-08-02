import React, { useState, useEffect } from 'react';
import { useHIS } from '../context/HISContext';
import { Patient, VitalSigns } from '../types';
import { 
  Stethoscope, 
  Activity, 
  Pill, 
  FlaskConical, 
  Scan, 
  FileText, 
  Save, 
  X, 
  Plus, 
  Search, 
  AlertTriangle,
  ChevronRight,
  ClipboardList,
  History,
  Info,
  User,
  Heart,
  Thermometer,
  Wind,
  ShieldCheck,
  Share2,
  Send,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface ClinicalConsoleWorkflowProps {
  patient: Patient;
  onClose: () => void;
  initialTab?: 'vitals' | 'diagnosis' | 'notes' | 'orders' | 'prescriptions' | 'referrals';
}

const ClinicalConsoleWorkflow: React.FC<ClinicalConsoleWorkflowProps> = ({ patient, onClose, initialTab = 'diagnosis' }) => {
  const { 
    updatePatient, 
    logAudit, 
    language, 
    addOrder, 
    addPrescription, 
    addReferralOrder,
    setActivePatient,
    cpoeOrders = [], 
    prescriptions: globalPrescriptions = [],
    referrals: globalReferrals = [],
    inventory = [],
    currentUser 
  } = useHIS();
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<'vitals' | 'diagnosis' | 'notes' | 'orders' | 'prescriptions' | 'referrals'>(initialTab);
  
  // Vitals State
  const [vitals, setVitals] = useState<any>(patient.vitals || {
    bp_sys: '',
    bp_dia: '',
    hr: '',
    temp: '',
    spo2: '',
    rr: '',
    weight: '',
    timestamp: new Date().toISOString()
  });

  // Diagnosis State
  const [newDiagnosisCode, setNewDiagnosisCode] = useState('');
  const [newDiagnosisTitle, setNewDiagnosisTitle] = useState('');
  const [newDiagnosisType, setNewDiagnosisType] = useState<'primary' | 'secondary' | 'differential'>('primary');
  const [diagnosesList, setDiagnosesList] = useState<Array<{ code: string; title: string; type: string }>>(
    (patient as any).activeDiagnoses || [
      { code: 'I10', title: 'Essential (primary) hypertension', type: 'primary' },
      { code: 'E11.9', title: 'Type 2 diabetes mellitus without complications', type: 'secondary' }
    ]
  );

  // Common ICD-10 Presets
  const commonICD10 = [
    { code: 'I10', titleEn: 'Essential hypertension', titleAr: 'ارتفاع ضغط الدم الأساسي' },
    { code: 'E11.9', titleEn: 'Type 2 diabetes mellitus', titleAr: 'داء السكري النوع الثاني' },
    { code: 'J45.909', titleEn: 'Unspecified asthma, uncomplicated', titleAr: 'الربو الشعبي غير المحدد' },
    { code: 'K29.70', titleEn: 'Gastritis, unspecified', titleAr: 'التهاب المعدة' },
    { code: 'N39.0', titleEn: 'Urinary tract infection', titleAr: 'التهاب المجاري البولية' },
    { code: 'R07.9', titleEn: 'Chest pain, unspecified', titleAr: 'ألم في الصدر' },
    { code: 'J06.9', titleEn: 'Acute upper respiratory infection', titleAr: 'التهاب الجهاز التنفسي العلوي الحاد' }
  ];

  // Referral State
  const [referralTargetDept, setReferralTargetDept] = useState('Cardiology');
  const [referralPriority, setReferralPriority] = useState<'ROUTINE' | 'URGENT' | 'STAT'>('URGENT');
  const [referralReason, setReferralReason] = useState('');

  // Filter local view for current patient
  const patientOrders = cpoeOrders.filter((o: any) => o.patientId === patient.id);
  const patientPrescriptions = globalPrescriptions.filter((p: any) => p.patientId === patient.id);
  const patientReferrals = globalReferrals.filter((r: any) => r.patientId === patient.id);

  const [newOrder, setNewOrder] = useState({ type: 'LAB', name: '', priority: 'ROUTINE' });
  const [newPresc, setNewPresc] = useState({ name: '', dose: '', route: 'PO', frequency: 'TID', duration: '5 days' });
  const [clinicalNote, setClinicalNote] = useState('');

  const handleSaveVitals = () => {
    updatePatient(patient.id, { vitals: vitals as VitalSigns });
    logAudit({
      action: 'UPDATE_VITALS',
      entityType: 'PATIENT',
      entityId: patient.id,
      reason: 'Regular vitals check during consultation',
      newValue: vitals
    });
    toast.success(isAr ? "تم تحديث العلامات الحيوية" : "Vital signs updated successfully");
  };

  const handleAddDiagnosis = () => {
    if (!newDiagnosisTitle) return;
    const item = {
      code: newDiagnosisCode || 'ICD-10',
      title: newDiagnosisTitle,
      type: newDiagnosisType
    };
    const updated = [...diagnosesList, item];
    setDiagnosesList(updated);
    updatePatient(patient.id, { activeDiagnoses: updated } as any);
    logAudit({
      action: 'DIAGNOSIS_ADDED',
      entityType: 'PATIENT',
      entityId: patient.id,
      newValue: item
    });
    setNewDiagnosisCode('');
    setNewDiagnosisTitle('');
    toast.success(isAr ? "تمت إضافة التشخيص الطبي وملفه" : "Diagnosis added to patient EHR");
  };

  const handleAddOrder = async () => {
    if (!newOrder.name) return;
    await addOrder({
      patientId: patient.id,
      patientMRN: patient.mrn,
      workflowId: patient.activeEncounterId || patient.workflowId || 'WALK-IN',
      orderType: newOrder.type.toLowerCase(),
      itemName: newOrder.name,
      priority: newOrder.priority.toLowerCase(),
      staffId: currentUser?.id || 'doc-001',
      status: 'pending'
    });
    setNewOrder({ ...newOrder, name: '' });
    toast.success(isAr ? `تم إرسال طلب ${newOrder.name} بنجاح إلى ${newOrder.type === 'LAB' ? 'المختبر' : 'قسم الأشعة'}` : `Diagnostic order for ${newOrder.name} sent to ${newOrder.type === 'LAB' ? 'Laboratory' : 'Radiology'}`);
  };

  const handleAddPrescription = async () => {
    if (!newPresc.name) return;
    await addPrescription({
      id: `RX-${Date.now()}`,
      patientId: patient.id,
      medication: newPresc.name,
      dose: newPresc.dose || '1 Tablet',
      qty: 1,
      status: 'pending',
      date: new Date().toISOString(),
      frequency: newPresc.frequency,
      durationDays: parseInt(newPresc.duration) || 5,
      prescriberId: currentUser?.name || 'Dr. Attending'
    });
    setNewPresc({ name: '', dose: '', route: 'PO', frequency: 'TID', duration: '5 days' });
    toast.success(isAr ? "تم إرسال الوصفة الطبية مباشرة إلى الصيدلية" : "Prescription submitted directly to Pharmacy Queue");
  };

  const handleAddReferral = async () => {
    if (!referralReason) {
      toast.error(isAr ? "الرجاء كتابة سبب التحويل" : "Please enter referral clinical reason");
      return;
    }
    await addReferralOrder({
      patientId: patient.id,
      patientName: (isAr ? patient.nameAr : patient.nameEn) || patient.name,
      patientMRN: patient.mrn,
      fromDepartment: "Outpatient / Consultation Desk",
      toDepartment: referralTargetDept,
      referringDoctor: currentUser?.name || "Attending Physician",
      reason: referralReason,
      priority: referralPriority,
      notes: clinicalNote || "Consultation referral"
    });
    setReferralReason('');
    toast.success(isAr ? `تم إرسال طلب التحويل السريري إلى قسم ${referralTargetDept}` : `Clinical referral sent to ${referralTargetDept} department`);
  };

  const handleFinalizeConsultation = () => {
    // Audit the whole session
    logAudit({
      action: 'CONSULTATION_FINALIZE',
      entityType: 'PATIENT',
      entityId: patient.id,
      reason: 'Consultation session finalized',
      newValue: {
        vitals,
        orders: patientOrders,
        prescriptions: patientPrescriptions,
        clinicalNote
      }
    });
    toast.success(isAr ? "تم إنهاء وتوثيق الجلسة بنجاح" : "Consultation session finalized and saved to EHR");
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Sidebar Layout for Clinical Workflow */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-6 border-b border-slate-100">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                   <Stethoscope size={24} />
                </div>
                <div>
                   <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter">
                     {isAr ? "وحدة التحكم السريرية" : "Clinical Console"}
                   </h3>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">v4.2 Enterprise</span>
                </div>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {[
              { id: 'diagnosis', labelEn: 'Diagnosis & ICD-10', labelAr: 'التشخيص الطبي وتصنيف ICD-10', icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
              { id: 'prescriptions', labelEn: 'e-Prescribing (Pharmacy)', labelAr: 'الوصفة الطبية (الصيدلية)', icon: Pill, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { id: 'orders', labelEn: 'LIS/RIS Orders (Lab & Rad)', labelAr: 'طلبات الأشعة والمختبر', icon: FlaskConical, color: 'text-purple-600', bg: 'bg-purple-50' },
              { id: 'referrals', labelEn: 'Specialty Referrals', labelAr: 'التحويل والإحالات السريرية', icon: Share2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { id: 'notes', labelEn: 'Clinical Progress Notes', labelAr: 'الملاحظات والتقييم السريري', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
              { id: 'vitals', labelEn: 'Vital Signs', labelAr: 'العلامات الحيوية', icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                  activeTab === tab.id ? `${tab.bg} ring-1 ring-inset ring-slate-100` : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl transition-all ${
                    activeTab === tab.id ? 'bg-white shadow-sm' : 'bg-slate-100'
                  }`}>
                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? tab.color : 'text-slate-400'}`} />
                  </div>
                  <div className="text-left">
                    <div className={`text-xs font-black uppercase tracking-tight ${activeTab === tab.id ? 'text-slate-900' : 'text-slate-500'}`}>
                      {isAr ? tab.labelAr : tab.labelEn}
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'translate-x-1 text-slate-400' : 'opacity-0'}`} />
              </button>
            ))}

            <div className="pt-4 mt-4 border-t border-slate-100">
               <button 
                 onClick={() => {
                   setActivePatient(patient);
                   toast.info(isAr ? "فتح ملف المريض الشامل..." : "Opening comprehensive patient portal...");
                 }}
                 className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-indigo-50 text-indigo-600 transition-all group"
               >
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <User size={20} />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-black uppercase tracking-tight">{isAr ? "نظرة 360 درجة" : "Patient 360 Portal"}</div>
                  </div>
               </button>
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
             <button 
               onClick={handleFinalizeConsultation}
               className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group"
             >
                <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {isAr ? "إغلاق الملف وحفظ الجلسة" : "Finalize Consultation"}
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white overflow-hidden flex flex-col">
           {/* Tab Content Rendering */}
           <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <AnimatePresence mode="wait">
                 {activeTab === 'diagnosis' && (
                   <motion.div key="diagnosis" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl space-y-8">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                         <div>
                            <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{isAr ? "التشخيص الطبي وتصنيف ICD-10" : "Diagnosis & ICD-10 Coding"}</h4>
                            <p className="text-xs text-slate-500 font-medium">{isAr ? "توثيق التشخيصات الطبية الأولية والفرعية وسجل الأمراض" : "Record primary, secondary, and differential clinical diagnoses"}</p>
                         </div>
                         <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
                            ICD-10-CM EHR
                         </div>
                      </div>

                      {/* Add Diagnosis Form */}
                      <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm space-y-6">
                         <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                               <div>
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">{isAr ? "رمز ICD-10" : "ICD-10 CODE"}</label>
                                  <input 
                                    type="text" 
                                    value={newDiagnosisCode}
                                    onChange={(e) => setNewDiagnosisCode(e.target.value.toUpperCase())}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                                    placeholder="e.g. I10, E11.9"
                                  />
                               </div>
                               <div className="md:col-span-2">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">{isAr ? "عنوان التشخيص الطبي" : "DIAGNOSIS TITLE / DESCRIPTION"}</label>
                                  <input 
                                    type="text" 
                                    value={newDiagnosisTitle}
                                    onChange={(e) => setNewDiagnosisTitle(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={isAr ? "أكتب التشخيص هنا..." : "Type clinical diagnosis description..."}
                                  />
                               </div>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                               <div className="flex items-center gap-3">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "نوع التشخيص:" : "Category:"}</label>
                                  <select 
                                    value={newDiagnosisType} 
                                    onChange={(e) => setNewDiagnosisType(e.target.value as any)}
                                    className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 outline-none"
                                  >
                                     <option value="primary">{isAr ? "تشخيص رئيسي (Primary)" : "Primary Diagnosis"}</option>
                                     <option value="secondary">{isAr ? "تشخيص ثانوي (Secondary)" : "Secondary Diagnosis"}</option>
                                     <option value="differential">{isAr ? "تشخيص تفريقي (Differential)" : "Differential Diagnosis"}</option>
                                  </select>
                               </div>
                               <button 
                                 onClick={handleAddDiagnosis}
                                 className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition shadow-lg shadow-blue-100 flex items-center gap-2"
                               >
                                  <Plus size={16} />
                                  {isAr ? "إضافة التشخيص" : "Add Diagnosis"}
                               </button>
                            </div>

                            {/* Presets */}
                            <div>
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{isAr ? "تشخيصات مجهزة شائعة (إضافة سريعة):" : "Common Quick Presets:"}</span>
                               <div className="flex flex-wrap gap-2">
                                  {commonICD10.map((item) => (
                                    <button 
                                      key={item.code}
                                      onClick={() => {
                                        setNewDiagnosisCode(item.code);
                                        setNewDiagnosisTitle(isAr ? item.titleAr : item.titleEn);
                                      }}
                                      className="bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-100 transition flex items-center gap-1.5"
                                    >
                                       <span className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200">{item.code}</span>
                                       <span>{isAr ? item.titleAr : item.titleEn}</span>
                                    </button>
                                  ))}
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Active Diagnoses List */}
                      <div className="space-y-4">
                         <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{isAr ? "التشخيصات المسجلة في ملف المريض" : "Recorded Diagnoses in Patient EHR"}</h5>
                         {diagnosesList.length === 0 ? (
                           <div className="p-10 border-2 border-dashed border-slate-100 rounded-[32px] text-center bg-slate-50/50">
                              <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                              <p className="text-slate-400 font-bold text-xs">{isAr ? "لم يتم تسجيل تشخيصات حتى الآن" : "No diagnoses recorded yet for this patient."}</p>
                           </div>
                         ) : (
                           <div className="space-y-3">
                              {diagnosesList.map((d, idx) => (
                                <div key={idx} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center justify-between border-l-4 border-l-blue-500">
                                   <div className="flex items-center gap-4">
                                      <div className="font-mono text-xs font-black bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl border border-blue-100">
                                         {d.code}
                                      </div>
                                      <div>
                                         <div className="text-sm font-black text-slate-900">{d.title}</div>
                                         <div className="text-[10px] font-bold text-slate-400 uppercase">{d.type} diagnosis</div>
                                      </div>
                                   </div>
                                   <button 
                                     onClick={() => {
                                       const updated = diagnosesList.filter((_, i) => i !== idx);
                                       setDiagnosesList(updated);
                                       updatePatient(patient.id, { activeDiagnoses: updated } as any);
                                       toast.info(isAr ? "تم حذف التشخيص" : "Diagnosis removed");
                                     }}
                                     className="text-slate-400 hover:text-rose-500 p-2"
                                   >
                                      <X size={16} />
                                   </button>
                                </div>
                              ))}
                           </div>
                         )}
                      </div>
                   </motion.div>
                 )}

                 {activeTab === 'referrals' && (
                   <motion.div key="referrals" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl space-y-8">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                         <div>
                            <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{isAr ? "التحويل والإحالة السريرية" : "Specialty Referral Request"}</h4>
                            <p className="text-xs text-slate-500 font-medium">{isAr ? "إرسال طلب تحويل مباشر إلى التخصصات والأقسام الأخرى" : "Direct inter-departmental consultation & specialty referral"}</p>
                         </div>
                         <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
                            Referrals Engine
                         </div>
                      </div>

                      {/* Referral Form */}
                      <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">{isAr ? "القسم / التخصص المستهدف" : "TARGET SPECIALTY / DEPARTMENT"}</label>
                               <select 
                                 value={referralTargetDept} 
                                 onChange={(e) => setReferralTargetDept(e.target.value)}
                                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                               >
                                  <option value="Cardiology">Cardiology / أمراض القلب</option>
                                  <option value="Neurology">Neurology / المخ والأعصاب</option>
                                  <option value="Orthopedics">Orthopedics / جراحة العظام</option>
                                  <option value="General Surgery">General Surgery / الجراحة العامة</option>
                                  <option value="Nephrology">Nephrology / الكلى والمسالك</option>
                                  <option value="ICU">ICU / العناية المركزة</option>
                                  <option value="Physiotherapy">Physiotherapy / العلاج الطبيعي</option>
                                  <option value="ENT">ENT / الأذن والأنف والحنجرة</option>
                                  <option value="Ophthalmology">Ophthalmology / العيون</option>
                               </select>
                            </div>
                            <div>
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">{isAr ? "مستوى الأولوية" : "PRIORITY LEVEL"}</label>
                               <select 
                                 value={referralPriority} 
                                 onChange={(e) => setReferralPriority(e.target.value as any)}
                                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                               >
                                  <option value="ROUTINE">ROUTINE / عادية</option>
                                  <option value="URGENT">URGENT / عاجلة</option>
                                  <option value="STAT">STAT / طارئة فورية</option>
                               </select>
                            </div>
                         </div>

                         <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">{isAr ? "السبب الطبي والتقرير السريري للتحويل" : "CLINICAL REASON & SUMMARY FOR CONSULT"}</label>
                            <textarea 
                              value={referralReason}
                              onChange={(e) => setReferralReason(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                              placeholder={isAr ? "اكتب تفاصيل الاستشارة والسبب الطبي للتحويل..." : "Enter detailed clinical reason and questions for the specialist..."}
                            />
                         </div>

                         <button 
                           onClick={handleAddReferral}
                           className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                         >
                            <Send size={18} />
                            {isAr ? "إرسال طلب التحويل السريري" : "Transmit Referral Request"}
                         </button>
                      </div>

                      {/* Patient Referrals List */}
                      <div className="space-y-4">
                         <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{isAr ? "سجل طلبات التحويل للمريض" : "Patient Referral History"}</h5>
                         {patientReferrals.length === 0 ? (
                           <div className="p-10 border-2 border-dashed border-slate-100 rounded-[32px] text-center bg-slate-50/50">
                              <Share2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                              <p className="text-slate-400 font-bold text-xs">{isAr ? "لا توجد طلبات تحويل سابقة" : "No referrals transmitted yet for this patient."}</p>
                           </div>
                         ) : (
                           <div className="space-y-3">
                              {patientReferrals.map((r: any) => (
                                <div key={r.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center justify-between border-l-4 border-l-indigo-500">
                                   <div>
                                      <div className="flex items-center gap-2">
                                         <span className="text-sm font-black text-slate-900">{r.toDepartment}</span>
                                         <span className={`text-[10px] font-black px-2 py-0.5 rounded ${r.priority === 'STAT' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {r.priority}
                                         </span>
                                      </div>
                                      <div className="text-xs text-slate-600 font-medium mt-1">{r.reason}</div>
                                      <div className="text-[10px] text-slate-400 mt-1">{r.date} • Dr. {r.referringDoctor}</div>
                                   </div>
                                   <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl text-xs font-bold uppercase">
                                      {r.status}
                                   </div>
                                </div>
                              ))}
                           </div>
                         )}
                      </div>
                   </motion.div>
                 )}

                 {activeTab === 'vitals' && (
                   <motion.div key="vitals" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl space-y-8">
                      <div className="flex items-center justify-between">
                         <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{isAr ? "توثيق العلامات الحيوية" : "Clinical Vital Signs Entry"}</h4>
                         <button onClick={handleSaveVitals} className="bg-rose-100 text-rose-600 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-200 transition">
                            {isAr ? "تحديث الآن" : "Update Now"}
                         </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { label: isAr ? 'الضغط الانقباضي' : 'BP Systolic', key: 'bp_sys', unit: 'mmHg', icon: Activity },
                          { label: isAr ? 'الضغط الانبساطي' : 'BP Diastolic', key: 'bp_dia', unit: 'mmHg', icon: Activity },
                          { label: isAr ? 'النبض' : 'Heart Rate', key: 'hr', unit: 'BPM', icon: Heart },
                          { label: isAr ? 'الحرارة' : 'Temperature', key: 'temp', unit: '°C', icon: Thermometer },
                          { label: isAr ? 'الأكسجين' : 'SpO2', key: 'spo2', unit: '%', icon: Wind },
                          { label: isAr ? 'الوزن' : 'Weight', key: 'weight', unit: 'kg', icon: Info },
                        ].map((field) => (
                          <div key={field.key} className="p-6 rounded-[24px] bg-slate-50 border border-slate-100 space-y-4 hover:shadow-md transition-shadow">
                             <div className="flex items-center justify-between text-slate-400">
                                <span className="text-[10px] font-black uppercase tracking-widest">{field.label}</span>
                                <field.icon size={16} />
                             </div>
                             <div className="flex items-end gap-2">
                                <input 
                                  type="text" 
                                  value={(vitals as any)[field.key] || ''}
                                  onChange={(e) => setVitals({...vitals, [field.key]: e.target.value})}
                                  className="w-full bg-transparent border-none p-0 text-2xl font-black text-slate-900 focus:ring-0 outline-none"
                                  placeholder="00"
                                />
                                <span className="text-xs font-bold text-slate-400 mb-1">{field.unit}</span>
                             </div>
                          </div>
                        ))}
                      </div>
                   </motion.div>
                 )}

                 {activeTab === 'notes' && (
                    <motion.div key="notes" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl space-y-6 h-full flex flex-col">
                       <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{isAr ? "الملاحظات السريرية" : "Clinical Progress Notes"}</h4>
                       <textarea 
                         value={clinicalNote}
                         onChange={(e) => setClinicalNote(e.target.value)}
                         className="flex-1 w-full bg-slate-50 border border-slate-100 rounded-[32px] p-8 text-lg font-medium text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none shadow-inner"
                         placeholder={isAr ? "أكتب ملاحظات المعاينة هنا..." : "Start typing progress notes, chief complaint, or assessment plan..."}
                       />
                    </motion.div>
                 )}

                 {activeTab === 'orders' && (
                    <motion.div key="orders" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl space-y-8">
                       <div className="bg-purple-900 text-white rounded-[32px] p-8 shadow-2xl shadow-purple-200">
                          <h4 className="text-xl font-black uppercase tracking-tight mb-6">{isAr ? "طلب فحوصات تشخيصية" : "Diagnostic Orders (LIS/RIS)"}</h4>
                          <div className="flex flex-col sm:flex-row gap-4">
                             <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 border border-white/20">
                                <Search className="text-white/40" />
                                <input 
                                  type="text" 
                                  value={newOrder.name}
                                  onChange={(e) => setNewOrder({...newOrder, name: e.target.value})}
                                  placeholder={isAr ? "ابحث عن فحص (CBC, MRI, CT...)" : "Search test (CBC, Lipid, MRI...)"}
                                  className="bg-transparent border-none text-white placeholder:text-white/40 focus:ring-0 outline-none w-full font-bold"
                                />
                             </div>
                             <select 
                               value={newOrder.type}
                               onChange={(e) => setNewOrder({...newOrder, type: e.target.value})}
                               className="bg-white/10 backdrop-blur-md text-white rounded-2xl px-6 py-4 border border-white/20 font-black text-xs uppercase tracking-widest outline-none appearance-none"
                             >
                                <option value="LAB" className="bg-purple-900 text-white">LAB</option>
                                <option value="RAD" className="bg-purple-900 text-white">RADIOLOGY</option>
                             </select>
                             <button 
                               onClick={handleAddOrder}
                               className="bg-white text-purple-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                             >
                                {isAr ? "إضافة" : "Add Order"}
                             </button>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{isAr ? "الطلبات الحالية" : "Current Active Orders"}</h5>
                          {patientOrders.length === 0 ? (
                            <div className="p-12 border-2 border-dashed border-slate-100 rounded-[32px] text-center">
                               <FlaskConical className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                               <p className="text-slate-400 font-bold">{isAr ? "لا توجد طلبات تشخيصية مضافة" : "No diagnostic orders added yet."}</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 gap-3">
                               {patientOrders.map((o: any) => (
                                 <div key={o.id} className="p-5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4">
                                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${o.orderType === 'lab' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                          {o.orderType === 'lab' ? <FlaskConical size={20} /> : <Scan size={20} />}
                                       </div>
                                       <div>
                                          <div className="text-sm font-black text-slate-900 uppercase tracking-tighter">{o.itemName}</div>
                                          <div className="text-[10px] font-bold text-slate-400 uppercase">{o.orderType} • {o.priority} • {o.status}</div>
                                       </div>
                                    </div>
                                 </div>
                               ))}
                            </div>
                          )}
                       </div>
                    </motion.div>
                 )}

                 {activeTab === 'prescriptions' && (
                    <motion.div key="prescriptions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl space-y-8">
                       <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                          <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{isAr ? "الوصفات الدوائية" : "Electronic Prescribing"}</h4>
                          <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                             <ShieldCheck className="w-4 h-4" /> CDSS ACTIVE
                          </div>
                       </div>

                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Rx Form */}
                          <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm space-y-6">
                             <div className="space-y-4">
                                <div>
                                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">{isAr ? "الدواء" : "MEDICATION NAME"}</label>
                                   <input 
                                     type="text" 
                                     value={newPresc.name}
                                     onChange={(e) => setNewPresc({...newPresc, name: e.target.value})}
                                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                                     placeholder={isAr ? "أبحث عن الدواء..." : "Type drug name (Generic/Brand)..."}
                                   />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <div>
                                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">{isAr ? "الجرعة" : "DOSE"}</label>
                                      <input 
                                        type="text" 
                                        value={newPresc.dose}
                                        onChange={(e) => setNewPresc({...newPresc, dose: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="e.g. 500mg"
                                      />
                                   </div>
                                   <div>
                                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">{isAr ? "التكرار" : "FREQUENCY"}</label>
                                      <select 
                                        value={newPresc.frequency}
                                        onChange={(e) => setNewPresc({...newPresc, frequency: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-900 outline-none"
                                      >
                                         <option value="QD">Once daily (QD)</option>
                                         <option value="BID">Twice daily (BID)</option>
                                         <option value="TID">Three times daily (TID)</option>
                                         <option value="QID">Four times daily (QID)</option>
                                         <option value="PRN">As needed (PRN)</option>
                                      </select>
                                   </div>
                                </div>
                                <button 
                                  onClick={handleAddPrescription}
                                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
                                >
                                   <Plus size={18} />
                                   {isAr ? "إضافة للدائمة" : "Add to Prescription"}
                                </button>
                             </div>
                          </div>

                          {/* Rx List */}
                          <div className="space-y-4">
                             <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{isAr ? "قائمة الأدوية المختارة" : "Selected Medication List"}</h5>
                             {patientPrescriptions.length === 0 ? (
                               <div className="p-12 border-2 border-dashed border-slate-100 rounded-[32px] text-center bg-slate-50/50">
                                  <Pill className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                  <p className="text-slate-400 font-bold">{isAr ? "لم يتم إضافة أدوية" : "No medications added."}</p>
                               </div>
                             ) : (
                               <div className="space-y-3">
                                  {patientPrescriptions.map((p: any) => (
                                    <div key={p.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center justify-between border-l-4 border-l-emerald-500">
                                       <div>
                                          <div className="text-sm font-black text-slate-900 uppercase tracking-tighter">{p.medication}</div>
                                          <div className="text-[10px] font-bold text-slate-500 uppercase">{p.dose} • {p.frequency} • {p.status}</div>
                                       </div>
                                    </div>
                                  ))}
                               </div>
                             )}
                          </div>
                       </div>
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
};

// Internal Helper

export default ClinicalConsoleWorkflow;
