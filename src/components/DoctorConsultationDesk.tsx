import React, { useState, useEffect } from "react";
import { 
  Users, Search, Clock, ChevronRight, ChevronLeft, 
  Stethoscope, Activity, ClipboardList, FlaskConical, 
  Pill, FileText, Send, UserMinus, Plus, ShieldAlert,
  History, Calendar, Info, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useHIS } from "../context/HISContext";
import { Patient } from "../types";
import { PatientClinicalHeader } from "./PatientClinicalHeader";
import ClinicalConsoleWorkflow from "./ClinicalConsoleWorkflow";
import { ClinicalFormsEngine } from "./ClinicalFormsEngine";
import { ClinicalTimeline } from "./ClinicalTimeline";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
  currentUser?: any;
  systemUsers?: any[];
  departments?: any[];
  forcedPatientId?: string;
  isEmbedded?: boolean;
}

export default function DoctorConsultationDesk({ language, forcedPatientId }: Props) {
  const isAr = language === "ar";
  const { patients, currentUser } = useHIS();
  
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(forcedPatientId || null);

  useEffect(() => {
    if (forcedPatientId) {
      setSelectedPatientId(forcedPatientId);
    }
  }, [forcedPatientId]);
  const [isQueueCollapsed, setIsQueueCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Workflow States
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);

  const queuePatients = patients.filter(p => p.status !== "discharged");
  const filteredQueue = queuePatients.filter(p => 
    (p.nameAr || p.nameEn || p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.mrn.includes(searchQuery)
  );

  const activePatient = patients.find(p => p.id === selectedPatientId) || null;

  useEffect(() => {
    if (!selectedPatientId && queuePatients.length > 0) {
      setSelectedPatientId(queuePatients[0].id);
    }
  }, [queuePatients, selectedPatientId]);

  const handleStartWorkflow = (workflow: string) => {
    setActiveWorkflow(workflow);
  };

  // Mock Timeline Data
  const timelineEvents = [
    {
      id: '1',
      type: 'CONSULTATION',
      titleAr: 'معاينة طبية - عيادة القلب',
      titleEn: 'Medical Consultation - Cardiology',
      descAr: 'المريض يشكو من ألم في الصدر مع مجهود بسيط.',
      descEn: 'Patient complains of chest pain with mild exertion.',
      timestamp: '2026-07-25 10:30 AM',
      author: 'Dr. Sarah Ahmed',
      role: 'Consultant',
      color: 'indigo',
      icon: 'Stethoscope'
    },
    {
      id: '2',
      type: 'LAB',
      titleAr: 'نتائج المختبر - CBC',
      titleEn: 'Lab Results - CBC',
      descAr: 'جميع النتائج ضمن النطاق الطبيعي عدا الهيموجلوبين.',
      descEn: 'All results within normal range except Hemoglobin.',
      timestamp: '2026-07-25 02:15 PM',
      author: 'Lab Tech',
      role: 'Technician',
      color: 'purple',
      icon: 'FlaskConical'
    }
  ];

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
      {/* Patient Queue Sidebar */}
      <motion.div 
        animate={{ width: isQueueCollapsed ? 80 : 320 }}
        className="bg-white border-r border-slate-200 flex flex-col relative shrink-0"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          {!isQueueCollapsed && (
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tighter">
              {isAr ? "قائمة المرضى" : "Patient Queue"}
            </h2>
          )}
          <button 
            onClick={() => setIsQueueCollapsed(!isQueueCollapsed)}
            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
          >
            {isQueueCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {!isQueueCollapsed && (
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? "بحث بالاسم أو MRN..." : "Search patient..."}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-10 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {filteredQueue.map(patient => (
            <button
              key={patient.id}
              onClick={() => setSelectedPatientId(patient.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                selectedPatientId === patient.id 
                ? "bg-indigo-50 ring-1 ring-indigo-100" 
                : "hover:bg-slate-50"
              }`}
            >
              <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-black text-xs border-2 ${
                selectedPatientId === patient.id ? "bg-white border-indigo-200 text-indigo-600" : "bg-slate-100 border-white text-slate-400"
              }`}>
                {patient.name.charAt(0)}
              </div>
              {!isQueueCollapsed && (
                <div className="flex-1 text-left">
                  <div className="text-xs font-black text-slate-900 truncate uppercase">{patient.name}</div>
                  <div className="text-[10px] font-bold text-slate-400 mt-0.5">{patient.mrn} • {patient.age}Y • {patient.gender}</div>
                </div>
              )}
              {!isQueueCollapsed && patient.id === selectedPatientId && (
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-200" />
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activePatient ? (
          <>
            {/* Header */}
            <div className="p-6 bg-white border-b border-slate-100 shrink-0">
               <PatientClinicalHeader patient={activePatient} language={language} showVitals={true} />
            </div>

            {/* Dashboard Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Action Grid - Workflow Starters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { id: 'clinical', icon: Stethoscope, labelEn: 'Start Consultation', labelAr: 'بدء الكشف الطبي', color: 'bg-indigo-600', shadow: 'shadow-indigo-100', descEn: 'Document notes, vitals, and SOAP', descAr: 'توثيق الملاحظات، العلامات، وخطة SOAP' },
                    { id: 'orders', icon: FlaskConical, labelEn: 'Diagnostic Orders', labelAr: 'طلبات المختبر والأشعة', color: 'bg-purple-600', shadow: 'shadow-purple-100', descEn: 'Lab tests, imaging, and pathology', descAr: 'فحوصات معملية، أشعة، وأنسجة' },
                    { id: 'meds', icon: Pill, labelEn: 'e-Prescribing', labelAr: 'الوصفة الإلكترونية', color: 'bg-emerald-600', shadow: 'shadow-emerald-100', descEn: 'Prescribe medications and dosage', descAr: 'وصف الأدوية والجرعات المقررة' },
                    { id: 'referral', icon: Send, labelEn: 'Internal Referral', labelAr: 'تحويل داخلي', color: 'bg-amber-600', shadow: 'shadow-amber-100', descEn: 'Refer to another specialty or consultant', descAr: 'تحويل لتخصص آخر أو استشاري' }
                  ].map((action) => (
                    <button 
                      key={action.id}
                      onClick={() => handleStartWorkflow(action.id)}
                      className="group bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left relative overflow-hidden"
                    >
                      <div className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center text-white mb-4 shadow-lg ${action.shadow} group-hover:scale-110 transition-transform`}>
                        <action.icon size={28} />
                      </div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-tighter mb-1">
                        {isAr ? action.labelAr : action.labelEn}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase leading-tight">
                        {isAr ? action.descAr : action.descEn}
                      </p>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="w-5 h-5 text-slate-300" />
                      </div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Timeline */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                       <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
                         <History className="text-indigo-500" size={20} />
                         {isAr ? "فيلم الأحداث السريري" : "Clinical Event Timeline"}
                       </h3>
                       <div className="flex gap-2">
                          <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition">Filter</button>
                          <span className="text-slate-200">|</span>
                          <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition">Print Full EMR</button>
                       </div>
                    </div>
                    <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
                      <ClinicalTimeline 
                        events={timelineEvents as any} 
                        language={language} 
                      />
                    </div>
                  </div>

                  {/* Right Column: Summaries & Quick Vitals */}
                  <div className="lg:col-span-4 space-y-8">
                     <div className="bg-slate-900 text-white rounded-[40px] p-8 shadow-2xl shadow-slate-200 relative overflow-hidden">
                        <div className="relative z-10">
                          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">{isAr ? "العلامات الحيوية الأخيرة" : "Last Recorded Vitals"}</h4>
                          <div className="grid grid-cols-2 gap-6">
                            {[
                              { label: 'BP', value: '120/80', unit: 'mmHg' },
                              { label: 'HR', value: '82', unit: 'bpm' },
                              { label: 'Temp', value: '37.1', unit: '°C' },
                              { label: 'SpO2', value: '98', unit: '%' }
                            ].map((v, i) => (
                              <div key={i}>
                                <div className="text-[10px] font-black text-slate-500 uppercase mb-1">{v.label}</div>
                                <div className="flex items-end gap-1">
                                  <span className="text-xl font-black">{v.value}</span>
                                  <span className="text-[10px] font-bold text-slate-500 mb-1">{v.unit}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <Activity className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5" />
                     </div>

                     <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">{isAr ? "التشخيصات النشطة" : "Active Diagnoses"}</h4>
                        <div className="space-y-3">
                          {[
                             { code: 'I10', label: 'Essential Hypertension' },
                             { code: 'E11.9', label: 'Type 2 Diabetes Mellitus' }
                          ].map((d, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                              <div className="bg-white px-2 py-1 rounded-lg text-[10px] font-black text-indigo-600 border border-slate-100">{d.code}</div>
                              <div className="text-xs font-bold text-slate-700">{d.label}</div>
                            </div>
                          ))}
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50">
            <div className="w-24 h-24 rounded-[40px] bg-white shadow-xl flex items-center justify-center text-slate-200 mb-8">
               <Users size={48} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">
              {isAr ? "الرجاء اختيار مريض" : "No Patient Selected"}
            </h2>
            <p className="text-slate-400 font-medium max-w-sm">
              {isAr ? "يرجى اختيار مريض من قائمة الانتظار للبدء في المعاينة الطبية وتوثيق الحالة." : "Please select a patient from the queue to start documented consultation and clinical review."}
            </p>
          </div>
        )}
      </div>

      {/* Workflows Overlays */}
      <AnimatePresence>
        {activeWorkflow && activePatient && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-0 z-50 bg-white"
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-4">
                   <button onClick={() => setActiveWorkflow(null)} className="p-2 hover:bg-white rounded-xl text-slate-400">
                      <ChevronLeft size={24} />
                   </button>
                   <div>
                      <h2 className="text-sm font-black uppercase tracking-tighter">
                        {activeWorkflow === 'clinical' && (isAr ? "معاينة سريرية وتشخيص" : "Clinical Consultation & Diagnosis")}
                        {activeWorkflow === 'orders' && (isAr ? "طلبات الأشعة والمختبر" : "Diagnostic Orders (LIS/RIS)")}
                        {activeWorkflow === 'meds' && (isAr ? "الوصفة الطبية والصيدلية" : "e-Prescribing & Pharmacy")}
                        {activeWorkflow === 'referral' && (isAr ? "طلب تحويل وإحالة سريرية" : "Specialty Referral Request")}
                      </h2>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{(isAr ? activePatient.nameAr : activePatient.nameEn) || activePatient.name} • {activePatient.mrn}</p>
                   </div>
                </div>
                <button onClick={() => setActiveWorkflow(null)} className="p-2 hover:bg-white rounded-xl text-slate-400">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ClinicalConsoleWorkflow 
                  patient={activePatient} 
                  initialTab={
                    activeWorkflow === 'orders' ? 'orders' :
                    activeWorkflow === 'meds' ? 'prescriptions' :
                    activeWorkflow === 'referral' ? 'referrals' :
                    'diagnosis'
                  }
                  onClose={() => setActiveWorkflow(null)} 
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
