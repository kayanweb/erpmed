import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  GitCommit, User, Stethoscope, Activity, TestTube,
  Pill, BedDouble, FileText, CreditCard, Home, CheckCircle2,
  Clock, AlertCircle
} from 'lucide-react';
import { useHIS } from '../../context/HISContext';

interface Props {
  language: 'ar' | 'en';
}

const JOURNEY_STEPS = [
  { id: 'arrival', label_en: 'Arrival & Reg', label_ar: 'الوصول والتسجيل', icon: User },
  { id: 'triage_opd', label_en: 'Clinical & Triage', label_ar: 'الفرز والسريرية', icon: Stethoscope },
  { id: 'diagnostics', label_en: 'Diagnostics (Lab/Rad)', label_ar: 'التشخيص', icon: TestTube },
  { id: 'treatment', label_en: 'Treatment (Rx)', label_ar: 'العلاج', icon: Pill },
  { id: 'admission', label_en: 'Admission', label_ar: 'التنويم', icon: BedDouble },
  { id: 'discharge', label_en: 'Discharge', label_ar: 'الخروج', icon: Home },
  { id: 'billing', label_en: 'Billing & Claims', label_ar: 'الفوترة', icon: CreditCard }
];

export default function PatientJourneyEngine({ language }: Props) {
  const isAr = language === 'ar';
  
  const { activePatient, visits = [], charges = [], prescriptions = [], labResults = [], radiologyReports = [] } = useHIS();

  const activeVisit = useMemo(() => {
    if (!activePatient) return null;
    return visits.find(v => v.patientId === activePatient.id && v.status === "active") || 
           visits.slice().reverse().find(v => v.patientId === activePatient.id);
  }, [activePatient, visits]);

  const patientCharges = useMemo(() => {
    if (!activePatient) return [];
    return charges.filter(c => c.patientId === activePatient.id);
  }, [charges, activePatient]);

  const patientPrescriptions = useMemo(() => {
    if (!activePatient) return [];
    return prescriptions.filter(p => p.patientId === activePatient.id);
  }, [prescriptions, activePatient]);

  const totalCharges = useMemo(() => patientCharges.reduce((sum, c) => sum + c.amount, 0), [patientCharges]);

  // Determine current stage based on real data
  const currentStage = useMemo(() => {
    if (!activePatient || !activeVisit) return 'arrival';
    if (activeVisit.status === 'completed') return 'discharge';
    
    // Check if admitted
    if (activePatient.status?.includes('ipd') || activePatient.status?.includes('ward')) return 'admission';
    
    // Check if treatments prescribed but not dispensed
    if (patientPrescriptions.some(p => p.status === 'pending')) return 'treatment';
    
    // Check if labs/rads pending
    const hasPendingLabs = labResults.some(l => l.patientId === activePatient.id && l.status === 'preliminary');
    if (hasPendingLabs) return 'diagnostics';
    
    if (activePatient.status?.includes('triage') || activePatient.status?.includes('doctor')) return 'triage_opd';
    
    return 'arrival';
  }, [activePatient, activeVisit, patientPrescriptions, labResults]);

  if (!activePatient) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-black text-slate-700">{isAr ? "لا يوجد مريض نشط حالياً" : "No Active Patient Context"}</h2>
          <p className="text-slate-500 mt-2">{isAr ? "يرجى تحديد مريض من أي شاشة أولاً." : "Please select a patient from any dashboard first."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-y-auto" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-indigo-900 text-white p-6 relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <GitCommit className="w-6 h-6 text-indigo-100" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">{isAr ? 'المسار السريري والمالي للمريض' : 'Patient Clinical & Financial Journey'}</h1>
              <p className="text-indigo-200 text-sm font-bold mt-1 uppercase tracking-widest">{activePatient.mrn} • {isAr ? activePatient.nameAr : activePatient.nameEn}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Activity size={16} />
              {isAr ? 'المسار المباشر (Live Journey)' : 'Live Journey'}
            </h2>
            
            <div className="relative">
              <div className="absolute top-0 bottom-0 left-8 md:left-1/2 w-0.5 bg-slate-100 -translate-x-1/2" />
              
              {JOURNEY_STEPS.map((step, idx) => {
                const isActive = step.id === currentStage;
                const isPast = JOURNEY_STEPS.findIndex(s => s.id === currentStage) > idx;
                
                return (
                  <motion.div 
                    key={step.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                    className={`relative flex items-center gap-6 mb-8 ${isPast || isActive ? 'opacity-100' : 'opacity-40 grayscale'}`}
                  >
                    <div className="hidden md:block w-1/2 text-right pr-12">
                      <h3 className={`font-black ${isActive ? 'text-indigo-600' : 'text-slate-700'}`}>
                        {isAr ? step.label_ar : step.label_en}
                      </h3>
                      {isActive && <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mt-1">{isAr ? 'المرحلة الحالية' : 'Current Stage'}</p>}
                    </div>

                    <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border-4 border-white shadow-sm transition-all duration-500
                      ${isActive ? 'bg-indigo-500 text-white shadow-indigo-200' : isPast ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <step.icon size={24} />
                      {isActive && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500 border-2 border-white"></span>
                        </span>
                      )}
                    </div>

                    <div className="md:hidden flex-1 pl-6">
                       <h3 className={`font-black ${isActive ? 'text-indigo-600' : 'text-slate-700'}`}>
                        {isAr ? step.label_ar : step.label_en}
                       </h3>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <User size={16} />
              {isAr ? 'البيانات الأساسية (Patient Context)' : 'Patient Context'}
            </h2>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400 text-xl">
                {activePatient.nameEn.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-black text-slate-800">{isAr ? activePatient.nameAr : activePatient.nameEn}</h3>
                <p className="text-xs font-bold text-slate-500">{activePatient.mrn} • {activePatient.gender} • {activePatient.age}y</p>
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-[10px] font-black uppercase tracking-widest">
                  {activePatient.status}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FileText size={16} />
              {isAr ? 'ملخص مالي (Financial Context)' : 'Financial Context'}
            </h2>
            
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <div className="text-xs text-slate-400 mb-1 font-bold">{isAr ? 'رقم الزيارة' : 'Visit ID'}</div>
              <div className="font-mono text-slate-700 font-bold mb-4">{activeVisit?.id || '---'}</div>
              
              <div className="text-xs text-slate-400 mb-1 font-bold">{isAr ? 'إجمالي التكلفة' : 'Total Charges'}</div>
              <div className="text-2xl font-black text-emerald-600">
                ${totalCharges.toFixed(2)}
              </div>
            </div>

            {patientCharges.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? 'آخر الحركات' : 'Recent Charges'}</p>
                {patientCharges.slice(-3).reverse().map(c => (
                  <div key={c.id} className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-600 truncate pr-4">{c.serviceName}</span>
                    <span className="text-slate-800">${c.amount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
