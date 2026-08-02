import React, { useState } from 'react';
import { useHIS } from '../context/HISContext';
import { 
  Microscope, Settings, Search, Filter, 
  Plus, CheckCircle2, AlertCircle, Clock,
  FileText, Activity, LayoutGrid, List,
  ArrowRight, Download, Printer, User,
  Database, Zap, FlaskConical, Scan,
  ChevronRight, ClipboardCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type DiagnosticType = 'LAB' | 'RAD';

export default function DiagnosticsHub({ language, onClose }: { language: 'ar' | 'en', onClose?: () => void }) {
  const isAr = language === 'ar';
  const { activePatient, setActivePatient } = useHIS();
  const [activeType, setActiveType] = useState<DiagnosticType>('LAB');
  const [activeTab, setActiveTab] = useState<'PENDING' | 'COMPLETED' | 'CRITICAL'>('PENDING');

  const orders = [
    { id: '1', patient: 'Ahmed Ali', type: 'LAB', test: 'CBC, Lipid Profile', time: '10 min ago', status: 'pending', urgent: true },
    { id: '2', patient: 'Sarah Salem', type: 'RAD', test: 'CXR (Post-Op)', time: '25 min ago', status: 'pending', urgent: false },
    { id: '3', patient: 'Mohamed Nour', type: 'LAB', test: 'HbA1c', time: '1 hour ago', status: 'completed', urgent: false }
  ];

  return (
    <div className="flex h-[800px] gap-6" dir={isAr ? 'rtl' : 'ltr'}>
       {/* Diagnostic Sidebar */}
       <div className="w-80 bg-white border border-slate-200 rounded-[32px] overflow-hidden flex flex-col shadow-sm relative">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50">
             <div className="flex gap-2 mb-8">
                <button 
                  onClick={() => setActiveType('LAB')}
                  className={`flex-1 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    activeType === 'LAB' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-400 border border-slate-100'
                  }`}
                >
                   <FlaskConical className="w-4 h-4" />
                   {isAr ? "مختبر" : "Lab"}
                </button>
                <button 
                  onClick={() => setActiveType('RAD')}
                  className={`flex-1 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    activeType === 'RAD' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-400 border border-slate-100'
                  }`}
                >
                   <Scan className="w-4 h-4" />
                   {isAr ? "أشعة" : "Rad"}
                </button>
             </div>

             <div className="space-y-4">
                {[
                  { id: 'PENDING', labelEn: 'Pending Worklist', labelAr: 'قائمة الانتظار', icon: Clock, count: 12 },
                  { id: 'CRITICAL', labelEn: 'Critical Results', labelAr: 'نتائج حرجة', icon: AlertCircle, count: 2, color: 'text-rose-500' },
                  { id: 'COMPLETED', labelEn: 'Verified Reports', labelAr: 'التقارير المعتمدة', icon: CheckCircle2, count: 45 }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                      activeTab === tab.id ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-white hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                       <tab.icon className={`w-4 h-4 ${tab.color || 'text-slate-400'}`} />
                       <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? tab.labelAr : tab.labelEn}</span>
                    </div>
                    <span className="text-[10px] font-bold opacity-50">{tab.count}</span>
                  </button>
                ))}
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
             {orders.filter(o => o.type === activeType).map(order => (
               <div key={order.id} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-200 transition-all group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                     <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${order.urgent ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>
                        {order.urgent ? (isAr ? 'عاجل' : 'Urgent') : (isAr ? 'عادي' : 'Routine')}
                     </span>
                     <span className="text-[9px] font-bold text-slate-400 font-mono">{order.time}</span>
                  </div>
                  <h4 className="text-xs font-black text-slate-800 mb-1">{order.patient}</h4>
                  <p className="text-[10px] font-bold text-slate-400 truncate">{order.test}</p>
                  <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-1">
                        {isAr ? "بدء الإجراء" : "Process"}
                        <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                     </button>
                  </div>
               </div>
             ))}
          </div>

          <button 
            onClick={onClose}
            className="absolute bottom-6 ltr:right-6 rtl:left-6 w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-lg group"
          >
            <Plus className="w-6 h-6 rotate-45 group-hover:scale-110 transition-transform" />
          </button>
       </div>

       {/* Diagnostics Workspace */}
       <div className="flex-1 bg-white border border-slate-200 rounded-[32px] overflow-hidden flex flex-col shadow-sm">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
             <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center bg-indigo-600 text-white shadow-xl shadow-indigo-100`}>
                   {activeType === 'LAB' ? <Microscope className="w-5 h-5 sm:w-8 sm:h-8" /> : <Scan className="w-5 h-5 sm:w-8 sm:h-8" />}
                </div>
                <div>
                   <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                      {activeType === 'LAB' ? (isAr ? "نظام إدارة المختبر (LIS)" : "Lab Information System") : (isAr ? "نظام الأرشفة والتقارير (RIS/PACS)" : "Radiology Info System")}
                   </h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {isAr ? "تحكم كامل بالعينات والنتائج" : "Full Control over Samples & Results"}
                   </p>
                </div>
             </div>
             <div className="flex gap-3">
                <button className="h-12 px-6 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition">
                   <Download className="w-4 h-4" />
                </button>
                <button className="h-12 px-6 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 flex items-center gap-2">
                   <Printer className="w-4 h-4" />
                   {isAr ? "طباعة التقارير" : "Print Reports"}
                </button>
             </div>
          </div>

          <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
             <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-32 h-32 bg-slate-50 rounded-[40px] flex items-center justify-center mb-8 border border-slate-100 shadow-inner">
                   <Database className="w-16 h-16 text-slate-200" />
                </div>
                <h3 className="text-xl font-black text-slate-800">{isAr ? "تكامل البيانات والنتائج" : "Diagnostic Data Integration"}</h3>
                <p className="text-xs text-slate-400 font-bold max-w-sm mt-3 leading-relaxed">
                   {isAr 
                     ? "اختر طلباً من قائمة المهام للبدء في إدخال النتائج المخبرية أو كتابة التقارير الإشعاعية المعتمدة."
                     : "Select an order from the worklist to begin entering laboratory results or drafting verified radiology reports."
                   }
                </p>
                
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-2xl">
                   {[
                     { label: isAr ? "توصيل الأجهزة" : "Analyzer Link", icon: Zap },
                     { label: isAr ? "تحقق ثنائي" : "Double Verify", icon: ClipboardCheck },
                     { label: isAr ? "أرشفة الصور" : "Image Archiving", icon: FileText }
                   ].map((item, i) => (
                     <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl flex flex-col items-center gap-4 hover:border-indigo-200 transition-all shadow-sm">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600">
                           <item.icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{item.label}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Device Sync Bar */}
          <div className="p-4 bg-slate-900 flex items-center justify-between px-10">
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">HL7 Bridge Active</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">PACS Gateway Connected</span>
                </div>
             </div>
             <div className="text-[9px] font-black text-slate-500 uppercase">System Latency: 24ms</div>
          </div>
       </div>
    </div>
  );
}
