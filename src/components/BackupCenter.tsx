import React, { useState } from 'react';
import { 
  Database, HardDrive, ShieldCheck, Download, 
  RefreshCw, Cloud, Save, History,
  FileArchive, Clock, AlertTriangle, CheckCircle2,
  Lock, Share2, Server, Plus
} from 'lucide-react';
import { motion } from 'motion/react';

interface BackupSnapshot {
  id: string;
  timestamp: string;
  size: string;
  type: 'AUTO' | 'MANUAL';
  status: 'completed' | 'failed' | 'in_progress';
  location: 'Cloud' | 'On-Premise';
}

export default function BackupCenter({ language, onClose }: { language: 'ar' | 'en', onClose?: () => void }) {
  const isAr = language === 'ar';
  const [snapshots, setSnapshots] = useState<BackupSnapshot[]>([]);

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
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
                   <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                   <h2 className="text-base font-black text-slate-900 leading-tight">{isAr ? "مركز النسخ الاحتياطي السحابي" : "Cloud Backup & Recovery Hub"}</h2>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "نظام حماية البيانات والأرشفة" : "Enterprise Data Protection & Archiving"}</p>
                </div>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Status Cards */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-emerald-50 rounded-[28px] flex items-center justify-center border-2 border-emerald-100 relative">
                   <ShieldCheck className="w-10 h-10 text-emerald-600" />
                   <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white animate-pulse"></div>
                </div>
                <div>
                   <h2 className="text-lg sm:text-2xl font-black text-slate-900">{isAr ? "نظام النسخ الاحتياطي" : "Disaster Recovery System"}</h2>
                   <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{isAr ? "حماية البيانات والأرشفة" : "Data Protection & Archiving"}</p>
                   <div className="flex items-center gap-2 sm:gap-4 flex-wrap  mt-4">
                      <div className="flex items-center gap-2 text-xs font-black text-emerald-600">
                         <CheckCircle2 className="w-4 h-4" />
                         {isAr ? "النظام مؤمن بالكامل" : "System Secured"}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-black text-indigo-600">
                         <Cloud className="w-4 h-4" />
                         {isAr ? "مزامنة سحابية نشطة" : "Active Cloud Sync"}
                      </div>
                   </div>
                </div>
             </div>
             <button className="px-8 py-4 bg-indigo-600 text-white rounded-[22px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex flex-wrap items-center gap-2 sm:gap-3 active:scale-95">
                <RefreshCw className="w-5 h-5" />
                {isAr ? "نسخ احتياطي الآن" : "Backup Now"}
             </button>
          </div>

          <div className="bg-slate-900 rounded-[32px] p-8 text-white flex items-center justify-between shadow-2xl overflow-hidden relative">
             <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">{isAr ? "المساحة المستخدمة" : "Storage Used"}</p>
                <p className="text-3xl font-black">24.8 <span className="text-sm text-indigo-300">TB</span></p>
                <div className="w-32 h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden">
                   <div className="w-2/3 h-full bg-indigo-500"></div>
                </div>
             </div>
             <Database className="w-24 h-24 text-white opacity-10 absolute -right-4 -bottom-4" />
          </div>
       </div>

       {/* Snapshots Table */}
       <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
             <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">{isAr ? "سجل النسخ الاحتياطية" : "Snapshot History"}</h3>
             <div className="flex gap-2 min-w-max">
                <button className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-lg transition"><History className="w-5 h-5" /></button>
                <button className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-lg transition"><Share2 className="w-5 h-5" /></button>
             </div>
          </div>
          <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-right border-collapse">
             <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">
                   <th className="px-6 py-4">{isAr ? "المعرف والوقت" : "ID & Timestamp"}</th>
                   <th className="px-6 py-4">{isAr ? "الحجم" : "Size"}</th>
                   <th className="px-6 py-4">{isAr ? "النوع" : "Type"}</th>
                   <th className="px-6 py-4">{isAr ? "الموقع" : "Location"}</th>
                   <th className="px-6 py-4">{isAr ? "الحالة" : "Status"}</th>
                   <th className="px-6 py-4 text-center">{isAr ? "إجراءات" : "Actions"}</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
                {snapshots.map(snp => (
                  <tr key={snp.id} className="hover:bg-slate-50/50 transition-colors">
                     <td className="px-6 py-4">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                           <div className="p-2 bg-slate-100 rounded-lg"><FileArchive className="w-4 h-4 text-slate-400" /></div>
                           <div>
                              <p className="text-xs font-black text-slate-800 uppercase">{snp.id}</p>
                              <p className="text-[10px] font-bold text-indigo-500 font-mono">{snp.timestamp}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-4 text-xs font-black text-slate-600">{snp.size}</td>
                     <td className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{snp.type}</td>
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
                           {snp.location === 'Cloud' ? <Cloud className="w-3.5 h-3.5 text-blue-500" /> : <Server className="w-3.5 h-3.5 text-amber-500" />}
                           {snp.location}
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                          snp.status === 'completed' ? 'text-emerald-600' :
                          snp.status === 'failed' ? 'text-rose-600' :
                          'text-amber-600'
                        }`}>
                           {snp.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                           {snp.status}
                        </div>
                     </td>
                     <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                           <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"><Download className="w-4 h-4" /></button>
                           <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"><RefreshCw className="w-4 h-4" /></button>
                        </div>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
</div>
          <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-center">
             <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition">
               {isAr ? "عرض السجل الكامل" : "View Full Archive History"}
             </button>
          </div>
       </div>

       {/* Security Banner */}
       <div className="bg-emerald-900 rounded-[32px] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
             <h4 className="text-xl font-black mb-2">{isAr ? "تشفير AES-256 العسكري" : "Military Grade AES-256 Encryption"}</h4>
             <p className="text-xs text-emerald-200 leading-relaxed font-medium">
               {isAr 
                 ? "كافة النسخ الاحتياطية مشفرة بالكامل قبل مغادرة السيرفر المحلي ومؤمنة في 3 مواقع جغرافية مختلفة."
                 : "All snapshots are fully encrypted before leaving the local server and secured across 3 different geographical zones."
               }
             </p>
          </div>
          <Lock className="w-16 h-16 text-emerald-400 opacity-20 absolute -right-4 -bottom-4" />
          <button className="px-8 py-3 bg-white text-emerald-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/20 relative z-10">
             {isAr ? "مراجعة قواعد التشفير" : "Security Policy"}
          </button>
       </div>
    </div>
  );
}
