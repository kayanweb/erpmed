import React, { useState } from 'react';
import { 
  User, 
  Activity, 
  Pill, 
  FlaskConical, 
  Scan, 
  CreditCard, 
  Clock, 
  Calendar, 
  FileText,
  AlertCircle,
  Stethoscope,
  ChevronRight,
  Printer,
  Share2,
  MoreVertical
} from 'lucide-react';
import { useHIS } from '../context/HISContext';
import { Patient, HISEncounter } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  patient: Patient;
  onClose: () => void;
}

export default function Patient360({ patient, onClose }: Props) {
  const { 
    language, 
    encounters = [], 
    cpoeOrders = [], 
    prescriptions = [], 
    charges = [],
    labResults = [],
    radiologyReports = []
  } = useHIS();
  const isAr = language === 'ar';
  
  const [activeTab, setActiveTab] = useState<'summary' | 'clinical' | 'financial' | 'history'>('summary');

  // Filter data for this patient
  const patientEncounters = encounters.filter(e => e.patientId === patient.id);
  const patientOrders = cpoeOrders.filter(o => o.patientId === patient.id);
  const patientPrescriptions = prescriptions.filter(p => p.patientId === patient.id);
  const patientCharges = charges.filter(c => c.patientId === patient.id);
  const patientLabs = labResults.filter(l => l.patientId === patient.id);
  const patientRad = radiologyReports.filter(r => r.patientId === patient.id);

  const totalBalance = patientCharges.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden font-sans">
      {/* Header Profile Section */}
      <div className="bg-white border-b border-slate-200 p-6 flex items-center justify-between shadow-sm relative z-10">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-[28px] bg-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-indigo-100 ring-4 ring-white">
              {patient.nameEn?.[0] || <User size={32} />}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center text-white shadow-lg">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                {isAr ? patient.nameAr : (patient.fullNameEn || patient.nameEn)}
              </h2>
              <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {patient.mrn}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-300" /> {patient.age}Y / {patient.gender}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <span className="flex items-center gap-1.5"><Activity size={14} className="text-slate-300" /> {patient.bloodGroup || 'O+'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <span className="text-indigo-600 uppercase tracking-tighter font-black">{patient.status}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-3 rounded-2xl hover:bg-slate-50 text-slate-400 transition-colors border border-slate-100">
            <Printer size={18} />
          </button>
          <button className="p-3 rounded-2xl hover:bg-slate-50 text-slate-400 transition-colors border border-slate-100">
            <Share2 size={18} />
          </button>
          <button onClick={onClose} className="ml-4 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200">
            {isAr ? "إغلاق" : "Close Portal"}
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <div className="w-72 bg-white border-r border-slate-100 p-6 flex flex-col gap-2 shrink-0">
          {[
            { id: 'summary', labelEn: 'Patient Summary', labelAr: 'ملخص الحالة', icon: User, color: 'indigo' },
            { id: 'clinical', labelEn: 'Clinical Records', labelAr: 'السجلات الطبية', icon: Stethoscope, color: 'rose' },
            { id: 'financial', labelEn: 'Billing & Insurance', labelAr: 'الحسابات والتأمين', icon: CreditCard, color: 'emerald' },
            { id: 'history', labelEn: 'Visit Timeline', labelAr: 'سجل الزيارات', icon: Clock, color: 'amber' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${
                activeTab === tab.id 
                  ? `bg-${tab.color}-50 text-${tab.color}-600 ring-1 ring-inset ring-${tab.color}-100` 
                  : 'hover:bg-slate-50 text-slate-500'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? `text-${tab.color}-600` : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span className={`text-xs font-black uppercase tracking-tight ${activeTab === tab.id ? `text-${tab.color}-900` : ''}`}>
                {isAr ? tab.labelAr : tab.labelEn}
              </span>
            </button>
          ))}

          <div className="mt-auto p-4 bg-rose-50 rounded-2xl border border-rose-100">
            <div className="flex items-center gap-2 text-rose-600 mb-2">
              <AlertCircle size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? "حساسية مسجلة" : "ALLERGIES"}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {(patient.allergies || ['Penicillin', 'Sulfa']).map(a => (
                <span key={a} className="px-2 py-0.5 bg-white text-rose-700 rounded-md text-[9px] font-bold border border-rose-100 uppercase">{a}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Content Canvas */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'summary' && (
              <motion.div key="summary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Clock size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{isAr ? "الزيارة الحالية" : "ACTIVE STAY"}</div>
                      <div className="text-xl font-black text-slate-900">{patientEncounters.find(e => e.status === 'open')?.id || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{isAr ? "الرصيد المالي" : "TOTAL BALANCE"}</div>
                      <div className="text-xl font-black text-slate-900">{totalBalance} <span className="text-xs font-bold text-slate-400 uppercase">SAR</span></div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <FlaskConical size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{isAr ? "فحوصات معلقة" : "PENDING LABS"}</div>
                      <div className="text-xl font-black text-slate-900">{patientOrders.filter(o => o.status === 'pending').length}</div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col gap-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                      <Pill size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{isAr ? "أدوية نشطة" : "ACTIVE MEDS"}</div>
                      <div className="text-xl font-black text-slate-900">{patientPrescriptions.filter(p => p.status === 'pending' || p.status === 'active').length}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{isAr ? "آخر المؤشرات الحيوية" : "Latest Vitals Snapshot"}</h3>
                      <button className="text-xs font-bold text-indigo-600 hover:underline">{isAr ? "عرض التاريخ" : "View Trends"}</button>
                    </div>
                    <div className="space-y-4">
                      {patient.vitals ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase">{isAr ? "النبض" : "HEART RATE"}</span>
                            <span className="text-lg font-black text-slate-900">{patient.vitals.hr} <span className="text-[10px] text-slate-400">BPM</span></span>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase">{isAr ? "الضغط" : "BP"}</span>
                            <span className="text-lg font-black text-slate-900">{patient.vitals.bp} <span className="text-[10px] text-slate-400">mmHg</span></span>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase">{isAr ? "الحرارة" : "TEMP"}</span>
                            <span className="text-lg font-black text-slate-900">{patient.vitals.temp}°C</span>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase">{isAr ? "الأكسجين" : "SPO2"}</span>
                            <span className="text-lg font-black text-slate-900">{patient.vitals.spo2}%</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-slate-400 font-bold italic">{isAr ? "لا توجد علامات حيوية مسجلة حالياً" : "No active vitals recorded for this session."}</div>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white rounded-[40px] p-8 shadow-2xl shadow-indigo-100 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black uppercase tracking-tight">{isAr ? "معلومات التأمين" : "Insurance Coverage"}</h3>
                        <div className="px-3 py-1 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse">ACTIVE</div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{isAr ? "شركة التأمين" : "PROVIDER"}</div>
                          <div className="text-xl font-black">{patient.insuranceProvider || "BUPA Global"}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{isAr ? "رقم البوليصة" : "POLICY #"}</div>
                            <div className="text-sm font-bold tracking-widest">{patient.insurancePolicyNumber || "BP-8827-X1"}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{isAr ? "التحمل" : "CO-PAY"}</div>
                            <div className="text-sm font-bold">15% Max 50 SAR</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="mt-8 w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                      {isAr ? "التحقق من الأهلية" : "Run Eligibility Check"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'clinical' && (
              <motion.div key="clinical" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
                        <FlaskConical className="text-purple-600" /> {isAr ? "نتائج المختبر" : "Laboratory Results"}
                      </h4>
                      <div className="space-y-3">
                         {patientLabs.length === 0 ? (
                           <div className="p-8 border border-slate-100 rounded-3xl text-center text-slate-400 font-bold">{isAr ? "لا توجد نتائج" : "No results found"}</div>
                         ) : (
                           patientLabs.map(lab => (
                             <div key={lab.id} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-center justify-between mb-2">
                                   <div className="text-sm font-black text-slate-900 uppercase tracking-tight">{lab.testName}</div>
                                   <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${lab.flag === 'normal' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                      {lab.flag}
                                   </div>
                                </div>
                                <div className="flex items-end justify-between">
                                   <div className="text-xl font-black text-slate-900">{lab.value} <span className="text-xs text-slate-400">{lab.unit}</span></div>
                                   <div className="text-[9px] font-bold text-slate-400">{new Date(lab.date).toLocaleDateString()}</div>
                                </div>
                             </div>
                           ))
                         )}
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
                        <Pill className="text-emerald-600" /> {isAr ? "الأدوية النشطة" : "Active Medications"}
                      </h4>
                      <div className="space-y-3">
                         {patientPrescriptions.length === 0 ? (
                           <div className="p-8 border border-slate-100 rounded-3xl text-center text-slate-400 font-bold">{isAr ? "لا توجد أدوية" : "No meds found"}</div>
                         ) : (
                           patientPrescriptions.map(p => (
                             <div key={p.id} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all border-l-4 border-l-emerald-500">
                                <div className="flex items-center justify-between mb-1">
                                   <div className="text-sm font-black text-slate-900 uppercase tracking-tight">{p.medication}</div>
                                   <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{p.status}</span>
                                </div>
                                <div className="text-[11px] font-bold text-slate-500 uppercase">{p.dose} • {p.frequency} • {p.durationDays} Days</div>
                                <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-3">
                                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Ordered: {new Date(p.date).toLocaleDateString()}</span>
                                   <button className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Re-Order</button>
                                </div>
                             </div>
                           ))
                         )}
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'financial' && (
              <motion.div key="financial" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-8">
                 <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                       <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">{isAr ? "تفاصيل الفاتورة الجارية" : "Current Encounter Billing"}</h4>
                       <div className="flex items-center gap-4">
                          <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Generate Bill</button>
                          <button className="px-6 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest">Post Payments</button>
                       </div>
                    </div>
                    <div className="p-0 overflow-x-auto">
                       <table className="w-full text-left">
                          <thead className="bg-slate-50 border-b border-slate-100">
                             <tr>
                                <th className="py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "البند" : "ITEM / SERVICE"}</th>
                                <th className="py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "التصنيف" : "CATEGORY"}</th>
                                <th className="py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "التاريخ" : "DATE"}</th>
                                <th className="py-4 px-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "المبلغ" : "AMOUNT"}</th>
                             </tr>
                          </thead>
                          <tbody>
                             {patientCharges.length === 0 ? (
                               <tr><td colSpan={4} className="py-20 text-center text-slate-400 font-bold">{isAr ? "لا توجد حركات مالية" : "No financial transactions found"}</td></tr>
                             ) : (
                               patientCharges.map(c => (
                                 <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                    <td className="py-5 px-8">
                                       <div className="text-sm font-black text-slate-900">{c.serviceName}</div>
                                       <div className="text-[10px] font-bold text-slate-400">{c.id}</div>
                                    </td>
                                    <td className="py-5 px-8">
                                       <span className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">{c.category}</span>
                                    </td>
                                    <td className="py-5 px-8 text-xs font-bold text-slate-500">
                                       {new Date(c.date).toLocaleString()}
                                    </td>
                                    <td className="py-5 px-8 text-right text-sm font-black text-slate-900">
                                       {c.amount} SAR
                                    </td>
                                 </tr>
                               ))
                             )}
                          </tbody>
                          <tfoot className="bg-slate-50/50">
                             <tr>
                                <td colSpan={3} className="py-6 px-8 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Grand Total</td>
                                <td className="py-6 px-8 text-right text-2xl font-black text-slate-900">{totalBalance} SAR</td>
                             </tr>
                          </tfoot>
                       </table>
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div key="history" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                 <div className="relative pl-8 space-y-12 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                    {patientEncounters.length === 0 ? (
                      <div className="text-center py-20 text-slate-400 font-bold">{isAr ? "لا يوجد سجل زيارات" : "No visit history recorded"}</div>
                    ) : (
                      patientEncounters.map((enc, idx) => (
                        <div key={enc.id} className="relative group">
                           {/* Timeline Dot */}
                           <div className={`absolute -left-[35px] top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-sm ring-2 ring-inset ${enc.status === 'open' ? 'ring-emerald-500 bg-emerald-500' : 'ring-slate-200 bg-slate-200'}`} />
                           
                           <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm group-hover:shadow-lg transition-all border-l-4 border-l-indigo-500">
                              <div className="flex items-center justify-between mb-4">
                                 <div className="flex items-center gap-3">
                                    <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{enc.type} ENCOUNTER</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                    <span className="text-xs font-bold text-slate-400">{new Date(enc.startTime).toLocaleDateString()}</span>
                                 </div>
                                 <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${enc.status === 'open' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                    {enc.status}
                                 </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                 <div>
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{isAr ? "رقم الزيارة" : "VISIT ID"}</div>
                                    <div className="text-sm font-black text-slate-900">{enc.id}</div>
                                 </div>
                                 <div>
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{isAr ? "القسم" : "DEPARTMENT"}</div>
                                    <div className="text-sm font-black text-slate-900">{enc.deptName}</div>
                                 </div>
                                 <div>
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{isAr ? "الطبيب المعالج" : "TREATING DOCTOR"}</div>
                                    <div className="text-sm font-black text-indigo-600">{enc.doctorName}</div>
                                 </div>
                              </div>
                              <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                                 <div className="flex items-center gap-4">
                                    <div className="flex -space-x-2">
                                       {[FlaskConical, Scan, Pill].map((Icon, i) => (
                                         <div key={i} className="w-8 h-8 rounded-lg bg-slate-50 border-2 border-white flex items-center justify-center text-slate-400">
                                            <Icon size={14} />
                                         </div>
                                       ))}
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400">Related records synced</span>
                                 </div>
                                 <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                                    {isAr ? "عرض التفاصيل الكاملة" : "View Full Narrative"} <ChevronRight size={14} />
                                 </button>
                              </div>
                           </div>
                        </div>
                      ))
                    )}
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
