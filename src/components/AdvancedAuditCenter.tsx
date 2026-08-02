import React, { useState, useEffect } from 'react';
import { 
  History, Search, Filter, Calendar, 
  User, Shield, Activity, Download,
  ExternalLink, Eye, AlertCircle, Clock,
  Monitor, Smartphone, Globe, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useHIS } from '../context/HISContext';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'APPROVE' | 'REJECT' | 'PRINT';
  module: string;
  entityId: string;
  descriptionEn: string;
  descriptionAr: string;
  ip: string;
  device: 'desktop' | 'mobile' | 'tablet';
  oldValue?: any;
  newValue?: any;
}

export default function AdvancedAuditCenter({ language, onClose }: { language: 'ar' | 'en', onClose?: () => void }) {
  const isAr = language === 'ar';
  const { getSetting, saveSetting } = useHIS();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    getSetting("hospital_audit_logs").then(saved => {
      if (saved && Array.isArray(saved)) {
        setLogs(saved);
      } else {
        setLogs([
          {
            id: 'log-1',
            timestamp: '2026-07-16 10:15:22',
            user: 'Dr. Sarah Ahmed',
            role: 'Physician',
            action: 'UPDATE',
            module: 'EMR',
            entityId: 'PAT-1029',
            descriptionEn: 'Updated Diagnosis for Patient PAT-1029',
            descriptionAr: 'تحديث التشخيص للمريض PAT-1029',
            ip: '192.168.1.45',
            device: 'desktop',
            oldValue: { diagnosis: 'Fever' },
            newValue: { diagnosis: 'Influenza A' }
          },
          {
            id: 'log-2',
            timestamp: '2026-07-16 10:10:05',
            user: 'Admin System',
            role: 'IT Admin',
            action: 'APPROVE',
            module: 'WSD',
            entityId: 'MD-552',
            descriptionEn: 'Approved new Insurance Company: AXA',
            descriptionAr: 'الموافقة على شركة تأمين جديدة: AXA',
            ip: '10.0.0.12',
            device: 'desktop'
          }
        ]);
      }
    });
  }, [getSetting]);

  useEffect(() => { 
    if (logs.length > 0) {
      saveSetting("hospital_audit_logs", logs); 
    }
  }, [logs, saveSetting]);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'UPDATE': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'DELETE': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'LOGIN': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
       <div className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-[32px] shadow-sm shrink-0">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
             <button 
               onClick={onClose}
               className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm group"
             >
                <Plus className="w-6 h-6 rotate-45 group-hover:scale-110 transition-transform" />
             </button>
             <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg">
                   <History className="w-6 h-6" />
                </div>
                <div>
                   <h2 className="text-base font-black text-slate-900 leading-tight">{isAr ? "مركز تدقيق السجلات المتقدم" : "Advanced Audit Trail Center"}</h2>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "نظام تتبع الأنشطة والأمان" : "Activity Tracking & Security Audit"}</p>
                </div>
             </div>
          </div>
       </div>

       {/* Filters & Toolbar */}
       <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1">
             <Search className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input 
               type="text" 
               placeholder={isAr ? "بحث في سجلات الأنشطة..." : "Search audit trail..."} 
               className="w-full h-11 ltr:pl-12 rtl:pr-12 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-indigo-400"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <div className="flex gap-2 min-w-max">
             <button className="h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {isAr ? "التاريخ" : "Date Range"}
             </button>
             <button className="h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition flex items-center gap-2">
                <Filter className="w-4 h-4" />
                {isAr ? "الفلاتر" : "Filters"}
             </button>
             <button className="h-11 px-6 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black transition">
                <Download className="w-4 h-4" />
                {isAr ? "تصدير" : "Export CSV"}
             </button>
          </div>
       </div>

       {/* Audit Table */}
       <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
          <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-right border-collapse">
             <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                   <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "الوقت والمستخدم" : "Time & User"}</th>
                   <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "الإجراء" : "Action"}</th>
                   <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "الموديول / الوصف" : "Module / Description"}</th>
                   <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "التفاصيل التقنية" : "Technical Details"}</th>
                   <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">{isAr ? "عرض" : "View"}</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                     <td className="px-6 py-4">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                           <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                              <User className="w-5 h-5 text-slate-400" />
                           </div>
                           <div>
                              <p className="text-xs font-black text-slate-800">{log.user}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">{log.role}</p>
                              <p className="text-[9px] text-indigo-500 mt-1 font-mono">{log.timestamp}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${getActionColor(log.action)}`}>
                           {log.action}
                        </span>
                     </td>
                     <td className="px-6 py-4">
                        <div className="space-y-1">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter bg-slate-100 px-1.5 py-0.5 rounded">{log.module}</span>
                           <p className="text-xs font-bold text-slate-700">{isAr ? log.descriptionAr : log.descriptionEn}</p>
                           <p className="text-[9px] text-slate-400 font-medium italic">ID: {log.entityId}</p>
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                           <div className="flex items-center gap-2 text-[9px] font-black text-slate-500">
                              <Globe className="w-3 h-3" />
                              IP: {log.ip}
                           </div>
                           <div className="flex items-center gap-2 text-[9px] font-black text-slate-500">
                              {log.device === 'desktop' ? <Monitor className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                              DEVICE: {log.device.toUpperCase()}
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => setSelectedLog(log)}
                          className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition shadow-sm"
                        >
                           <Eye className="w-5 h-5" />
                        </button>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
</div>
       </div>

       {/* Log Detail Modal */}
       <AnimatePresence>
          {selectedLog && (
            <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl"
               >
                  <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                     <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                        <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                           <History className="w-6 h-6" />
                        </div>
                        <div>
                           <h3 className="text-lg font-black text-slate-800">{isAr ? "تفاصيل سجل التدقيق" : "Audit Log Details"}</h3>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedLog.id}</p>
                        </div>
                     </div>
                     <button onClick={() => setSelectedLog(null)} className="p-2 hover:bg-slate-100 rounded-full transition">
                        <AlertCircle className="w-6 h-6 text-slate-400" />
                     </button>
                  </div>
                  
                  <div className="p-8 space-y-6">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{isAr ? "المعلومات الأساسية" : "Basic Info"}</h5>
                           <div className="space-y-3">
                              <div className="flex justify-between text-xs"><span className="text-slate-400">{isAr ? "المستخدم:" : "User:"}</span><span className="font-bold">{selectedLog.user}</span></div>
                              <div className="flex justify-between text-xs"><span className="text-slate-400">{isAr ? "الوقت:" : "Timestamp:"}</span><span className="font-mono text-indigo-600">{selectedLog.timestamp}</span></div>
                              <div className="flex justify-between text-xs"><span className="text-slate-400">{isAr ? "الإجراء:" : "Action:"}</span><span className="font-black text-rose-600">{selectedLog.action}</span></div>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{isAr ? "تفاصيل النظام" : "System Context"}</h5>
                           <div className="space-y-3">
                              <div className="flex justify-between text-xs"><span className="text-slate-400">{isAr ? "الموديول:" : "Module:"}</span><span className="font-bold">{selectedLog.module}</span></div>
                              <div className="flex justify-between text-xs"><span className="text-slate-400">{isAr ? "عنوان IP:" : "IP Address:"}</span><span className="font-mono">{selectedLog.ip}</span></div>
                              <div className="flex justify-between text-xs"><span className="text-slate-400">{isAr ? "الجهاز:" : "Device:"}</span><span className="font-bold uppercase">{selectedLog.device}</span></div>
                           </div>
                        </div>
                     </div>

                     {selectedLog.oldValue && (
                       <div className="space-y-4 pt-6 border-t border-slate-100">
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{isAr ? "مقارنة البيانات (قبل/بعد)" : "Data Comparison (Before/After)"}</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                                <p className="text-[9px] font-black uppercase text-rose-600 mb-2">{isAr ? "القيمة السابقة" : "Previous Value"}</p>
                                <pre className="text-[10px] font-mono text-rose-800 bg-white/50 p-2 rounded border border-rose-100 overflow-auto max-h-32">
                                   {JSON.stringify(selectedLog.oldValue, null, 2)}
                                </pre>
                             </div>
                             <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                <p className="text-[9px] font-black uppercase text-emerald-600 mb-2">{isAr ? "القيمة الجديدة" : "New Value"}</p>
                                <pre className="text-[10px] font-mono text-emerald-800 bg-white/50 p-2 rounded border border-emerald-100 overflow-auto max-h-32">
                                   {JSON.stringify(selectedLog.newValue, null, 2)}
                                </pre>
                             </div>
                          </div>
                       </div>
                     )}
                  </div>

                  <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                     <button className="px-8 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest">
                        {isAr ? "تصدير التفاصيل" : "Export Details"}
                     </button>
                  </div>
               </motion.div>
            </div>
          )}
       </AnimatePresence>
    </div>
  );
}
