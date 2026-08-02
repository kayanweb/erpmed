import React, { useState } from 'react';
import { useHIS } from '../context/HISContext';
import { 
  Pill, Search, Filter, Plus, 
  CheckCircle2, AlertCircle, Clock,
  RefreshCw, Zap, ShieldCheck, Box,
  History, User, ArrowRight, Printer,
  FileText, Activity, Droplets,
  ClipboardCheck, ShoppingCart, Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PharmacyHub({ language, onClose }: { language: 'ar' | 'en', onClose?: () => void }) {
  const isAr = language === 'ar';
  const { prescriptions, dispensePrescription, currentUser } = useHIS();
  const [activeTab, setActiveTab] = useState<'PENDING' | 'DISPENSED' | 'CLINICAL'>('PENDING');

  const pendingRx = prescriptions.filter(p => p.status === 'pending');

  return (
    <div className="flex h-[800px] gap-6" dir={isAr ? 'rtl' : 'ltr'}>
       {/* Pharmacy Sidebar */}
       <div className="w-80 bg-white border border-slate-200 rounded-[32px] overflow-hidden flex flex-col shadow-sm">
          <div className="p-8 border-b border-slate-100 bg-emerald-50/30 relative">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                   <Pill className="w-4 h-4" />
                   {isAr ? "صيدلية المستشفى" : "Hospital Pharmacy"}
                </h3>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded text-[10px] font-black">{pendingRx.length}</span>
             </div>
             
             <button 
               onClick={onClose}
               className="absolute top-6 ltr:right-6 rtl:left-6 w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm group"
             >
                <Plus className="w-4 h-4 rotate-45 group-hover:scale-110 transition-transform" />
             </button>

             <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'PENDING', labelEn: 'E-Prescriptions', labelAr: 'الوصفات الإلكترونية', icon: FileText },
                  { id: 'CLINICAL', labelEn: 'Clinical Review', labelAr: 'المراجعة الإكلينيكية', icon: ShieldCheck },
                  { id: 'DISPENSED', labelEn: 'Dispensing History', labelAr: 'سجل الصرف', icon: History }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                      activeTab === tab.id ? 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-white hover:bg-slate-50 text-slate-400'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-slate-100 text-slate-400'}`}>
                       <tab.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? tab.labelAr : tab.labelEn}</span>
                  </button>
                ))}
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
             {pendingRx.map(rx => (
               <div key={rx.id} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-emerald-200 transition-all group">
                  <div className="flex items-center justify-between mb-3">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Order: #{rx.id.slice(-4)}</span>
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  </div>
                  <h4 className="text-xs font-black text-slate-800 mb-1">{rx.medication}</h4>
                  <p className="text-[10px] font-bold text-slate-400">{rx.dose} • {rx.qty} Units</p>
                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-50">
                     <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400">
                        <Clock className="w-3 h-3" />
                        {new Date(rx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </div>
                     <button 
                       onClick={() => dispensePrescription(rx.id, currentUser?.id || "PHARM-1")}
                       className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                     >
                        {isAr ? "صرف" : "Dispense"}
                        <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                     </button>
                  </div>
               </div>
             ))}
          </div>
       </div>

       {/* Pharmacy Canvas */}
       <div className="flex-1 bg-white border border-slate-200 rounded-[32px] overflow-hidden flex flex-col shadow-sm relative">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-emerald-600 rounded-[24px] flex items-center justify-center text-white shadow-xl shadow-emerald-100">
                   <Pill className="w-5 h-5 sm:w-8 sm:h-8" />
                </div>
                <div>
                   <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">{isAr ? "إدارة الصيدلية والتحقق الدوائي" : "Pharmacy & Clinical Verification"}</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? "حوكمة الدواء ومنع التداخلات" : "Medication Governance & Interaction Prevention"}</p>
                </div>
             </div>
             <div className="flex gap-3">
                <button className="h-12 px-6 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition shadow-xl shadow-slate-100 flex items-center gap-2">
                   <Box className="w-4 h-4" />
                   {isAr ? "طلب مخزون" : "Restock Request"}
                </button>
             </div>
          </div>

          <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 h-full">
                {/* Clinical Rules & Safety */}
                <div className="space-y-8">
                   <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                         <ShieldCheck className="w-4 h-4 text-emerald-600" />
                         {isAr ? "فحص التداخلات الدوائية" : "Drug-Drug Interaction Check"}
                      </h4>
                      <div className="p-6 bg-white border border-emerald-100 rounded-2xl flex items-center gap-6">
                         <div className="w-10 h-10 sm:w-14 sm:h-14 bg-emerald-50 rounded-2xl flex items-center justify-center"><Zap className="w-5 h-5 sm:w-8 sm:h-8 text-emerald-500" /></div>
                         <div>
                            <p className="text-sm font-black text-slate-800">{isAr ? "النظام آمن" : "No Critical Interactions"}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{isAr ? "تم فحص 4 وصفات نشطة" : "Scanned 4 active prescriptions"}</p>
                         </div>
                      </div>
                   </div>

                   <div className="bg-rose-50/50 rounded-[32px] p-8 border border-rose-100 space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-widest text-rose-800 flex items-center gap-2">
                         <AlertCircle className="w-4 h-4 text-rose-500" />
                         {isAr ? "تنبيهات الحساسية" : "Allergy Alerts"}
                      </h4>
                      <div className="p-4 bg-white border border-rose-100 rounded-2xl flex items-center gap-2 sm:gap-4 flex-wrap ">
                         <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><AlertCircle className="w-4 h-4" /></div>
                         <span className="text-xs font-bold text-slate-600">{isAr ? "لا توجد حساسيات مسجلة لهذا المريض" : "No known allergies for active patient"}</span>
                      </div>
                   </div>
                </div>

                {/* Pharmacy Operations */}
                <div className="space-y-8">
                   <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                         <ShoppingCart className="w-4 h-4 text-indigo-600" />
                         {isAr ? "حالة المخزون الحالي" : "Pharmacy Inventory Snapshot"}
                      </h4>
                      <div className="space-y-3">
                         {[
                           { name: 'Paracetamol', stock: '2,400', status: 'Stable' },
                           { name: 'Amoxicillin', stock: '120', status: 'Low' },
                           { name: 'Insulin Glargine', stock: '45', status: 'Reorder' }
                         ].map((item, i) => (
                           <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                              <div>
                                 <p className="text-xs font-black text-slate-800">{item.name}</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase">{item.status}</p>
                              </div>
                              <span className="text-sm font-black text-slate-600">{item.stock}</span>
                           </div>
                         ))}
                      </div>
                      <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-100">
                         {isAr ? "فتح إدارة المخازن" : "Open Inventory Manager"}
                      </button>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button className="p-6 bg-slate-50 border border-slate-100 rounded-[28px] flex flex-col items-center gap-3 hover:border-emerald-400 transition-all">
                         <Truck className="w-6 h-6 text-emerald-600" />
                         <span className="text-[10px] font-black uppercase text-slate-600">{isAr ? "تحويل بين الصيدليات" : "Inter-Pharmacy Transfer"}</span>
                      </button>
                      <button className="p-6 bg-slate-50 border border-slate-100 rounded-[28px] flex flex-col items-center gap-3 hover:border-emerald-400 transition-all">
                         <Printer className="w-6 h-6 text-emerald-600" />
                         <span className="text-[10px] font-black uppercase text-slate-600">{isAr ? "طباعة ملصقات الدواء" : "Print Rx Labels"}</span>
                      </button>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
