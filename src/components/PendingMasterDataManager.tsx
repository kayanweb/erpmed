import React, { useState } from 'react';
import { useHIS } from '../context/HISContext';
import { 
  CheckCircle2, XCircle, Trash2, Clock, 
  History, Filter, Search, ShieldCheck, 
  AlertTriangle, ExternalLink, Merge, Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PendingMasterDataManager({ language, onClose }: { language: "ar" | "en"; onClose?: () => void }) {
  const isAr = language === 'ar';
  const { masterData, updateMasterDataStatus, deleteMasterData } = useHIS();
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = masterData.filter(m => 
    m.status === activeTab &&
    (m.valueEn.toLowerCase().includes(searchTerm.toLowerCase()) || m.valueAr.includes(searchTerm))
  );

  const stats = {
    pending: masterData.filter(m => m.status === 'pending').length,
    approved: masterData.filter(m => m.status === 'approved').length,
    rejected: masterData.filter(m => m.status === 'rejected').length
  };

  const handleApprove = (id: string) => {
    updateMasterDataStatus(id, 'approved', true);
  };

  const handleReject = (id: string) => {
    updateMasterDataStatus(id, 'rejected', false);
  };

  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { id: 'pending', label: isAr ? "بانتظار المراجعة" : "Pending Review", count: stats.pending, color: "text-amber-600", bg: "bg-amber-50", icon: Clock },
          { id: 'approved', label: isAr ? "تمت الموافقة" : "Approved", count: stats.approved, color: "text-emerald-600", bg: "bg-emerald-50", icon: ShieldCheck },
          { id: 'rejected', label: isAr ? "مرفوضة" : "Rejected", count: stats.rejected, color: "text-rose-600", bg: "bg-rose-50", icon: XCircle }
        ].map(stat => (
          <button
            key={stat.id}
            onClick={() => setActiveTab(stat.id as any)}
            className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-start gap-4 text-right ${
              activeTab === stat.id 
                ? `border-${stat.id === 'pending' ? 'amber' : stat.id === 'approved' ? 'emerald' : 'rose'}-200 shadow-xl shadow-slate-100 ${stat.bg}` 
                : 'border-slate-100 bg-white hover:border-slate-200'
            }`}
          >
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
               <stat.icon className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
               <p className={`text-3xl font-black ${stat.color}`}>{stat.count}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
         <div className="relative flex-1 w-full">
            <Search className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder={isAr ? "بحث في البيانات المعلقة..." : "Search pending entries..."}
              className="w-full h-11 ltr:pl-12 rtl:pr-12 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-indigo-400 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <button className="h-11 px-6 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition flex items-center gap-2 whitespace-nowrap">
            <Filter className="w-4 h-4" />
            {isAr ? "فلترة حسب القسم" : "Filter by Dept"}
         </button>
      </div>

      {/* List */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "القيمة (EN/AR)" : "Value (EN/AR)"}</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "التصنيف" : "Category"}</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "المصدر" : "Source Context"}</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "الاستخدام" : "Usage"}</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">{isAr ? "الإجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <AnimatePresence mode="popLayout">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={item.id} 
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-800">{item.valueEn}</p>
                        <p className="text-xs font-medium text-slate-500">{item.valueAr}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-indigo-100">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-700">{item.module || "Unknown Module"}</p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {item.screen} {item.fieldName && `> ${item.fieldName}`}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 text-[9px] text-slate-400">
                          <Edit3 className="w-2.5 h-2.5" />
                          {item.createdBy}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2">
                          <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-600 border border-slate-200">
                            {item.useCount}
                          </div>
                          {item.useCount > 5 && (
                             <div className="flex items-center gap-1 text-[10px] text-rose-500 font-black animate-pulse">
                               <AlertTriangle className="w-3 h-3" />
                               {isAr ? "مكرر!" : "Frequent!"}
                             </div>
                          )}
                       </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        {activeTab === 'pending' ? (
                          <>
                            <button 
                              onClick={() => handleApprove(item.id)}
                              className="p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm group relative"
                              title={isAr ? "موافقة" : "Approve"}
                            >
                              <CheckCircle2 className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleReject(item.id)}
                              className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm"
                              title={isAr ? "رفض" : "Reject"}
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => updateMasterDataStatus(item.id, 'pending')}
                            className="p-2.5 bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm"
                            title={isAr ? "إعادة للمراجعة" : "Move to Pending"}
                          >
                            <History className="w-5 h-5" />
                          </button>
                        )}
                        <button className="p-2.5 bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white rounded-xl transition-all shadow-sm">
                          <Merge className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => deleteMasterData(item.id)}
                          className="p-2.5 bg-slate-50 text-slate-400 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <Filter className="w-10 h-10 text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-bold">{isAr ? "لا توجد بيانات في هذا التصنيف" : "No data found in this category"}</p>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
</div>
      </div>

      {/* Legend / Info */}
      <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
         <div className="relative z-10 space-y-4 max-w-2xl">
            <h3 className="text-xl font-black tracking-tight flex flex-wrap items-center gap-2 sm:gap-3">
              <ShieldCheck className="w-6 h-6 text-indigo-300" />
              {isAr ? "نظام حوكمة البيانات المركزية" : "Centralized Data Governance System"}
            </h3>
            <p className="text-indigo-100 text-sm leading-relaxed font-medium">
              {isAr 
                ? "يتم جمع كافة القيم المخصصة التي يدخلها المستخدمون في كافة وحدات النظام وتصنيفها كبيانات معلقة. بمجرد الموافقة عليها، تصبح خيارات رسمية متاحة للجميع تلقائياً دون الحاجة لتعديل الكود."
                : "All custom values entered by users across all system modules are collected and classified as pending data. Once approved, they become official options available to everyone automatically without code changes."
              }
            </p>
            <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
               <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? "النظام نشط" : "Live Monitoring"}</span>
               </div>
               <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-300" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? "سجل التغييرات" : "Audit Logs"}</span>
               </div>
            </div>
         </div>
         <div className="absolute top-0 right-0 p-8 opacity-10">
            <History className="w-64 h-64" />
         </div>
      </div>
    </div>
  );
}
