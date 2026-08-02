import React, { useState } from 'react';
import { 
  Users, Search, ShieldCheck, Activity, Database, AlertCircle,
  Fingerprint, FileDigit, Link as LinkIcon, SplitSquareHorizontal,
  CheckCircle2, Merge, X, Filter, RefreshCw, ChevronRight,
  UserPlus, UserCheck, Trash2, History, ShieldAlert, Check
} from 'lucide-react';
import { useHIS } from '../context/HISContext';
import { toast } from 'sonner';

interface Props {
  language: 'ar' | 'en';
}

export default function EMPIDashboard({ language }: Props) {
  const isAr = language === 'ar';
  const { patients } = useHIS();
  
  const [activeTab, setActiveTab] = useState<'search' | 'duplicates' | 'audit'>('search');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedForMerge, setSelectedForMerge] = useState<any>(null);

  const stats = [
    { label: isAr ? "إجمالي السجلات" : "Master Index Records", value: "1,245,092", icon: Database, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: isAr ? "تكرار محتمل" : "Potential Duplicates", value: "84", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
    { label: isAr ? "تم دمجه هذا الشهر" : "Merged Records", value: "12", icon: Merge, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: isAr ? "دقة البيانات" : "Identity Confidence", value: "99.8%", icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-50" }
  ];

  const duplicateCandidates = [
    { 
      id: "dup-1",
      score: "98%",
      record1: { mrn: "MRN-10029", name: "Mohammed Al-Otaibi", nameAr: "محمد العتيبي", dob: "1980-05-12", phone: "0501234567", gender: "Male" },
      record2: { mrn: "MRN-99821", name: "Mohamed Otaibi", nameAr: "محمد عتيبي", dob: "1980-05-12", phone: "0501234567", gender: "Male" }
    },
    { 
      id: "dup-2",
      score: "85%",
      record1: { mrn: "MRN-44512", name: "Sarah Smith", nameAr: "سارة سميث", dob: "1992-11-04", phone: "0559988776", gender: "Female" },
      record2: { mrn: "MRN-77812", name: "Sara Smith", nameAr: "سارا سميث", dob: "1992-11-04", phone: "0559988775", gender: "Female" }
    }
  ];

  const auditLogs = [
    { id: 1, action: "RECORD_MERGE", user: "Admin (S. Ahmed)", mrn: "MRN-10029", target: "MRN-99821", timestamp: "2023-10-24 14:20" },
    { id: 2, action: "IDENTITY_UPDATE", user: "Registration (M. Khan)", mrn: "MRN-55219", target: "Name Change", timestamp: "2023-10-24 13:45" },
    { id: 3, action: "NEW_ID_LINK", user: "System", mrn: "MRN-44210", target: "National ID Link", timestamp: "2023-10-24 12:10" },
  ];

  const handleMerge = (dup: any) => {
    toast.success(isAr ? `تم دمج السجلات بنجاح` : `Records merged successfully`);
    setSelectedForMerge(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 sm:py-4 shrink-0 shadow-sm z-10 flex flex-row items-center justify-between gap-2 sm:gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 shrink-0">
            <Fingerprint size={20} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-tight">
              {isAr ? "نظام إدارة الهوية الطبية الموحد" : "Enterprise Master Patient Index (EMPI)"}
            </h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {isAr ? "دقة البيانات ومنع الازدواجية" : "Data Integrity & Identity Synchronization"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-lg shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95">
            <RefreshCw size={14} />
            {isAr ? "تحديث الفهرس" : "Refresh Index"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-6 custom-scrollbar space-y-4 sm:space-y-6">
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 sm:gap-4 flex-wrap  hover:border-indigo-300 transition-all group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg sm:text-2xl font-black text-slate-800">{stat.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Workspace */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-100 overflow-x-auto hide-scrollbar">
            <button 
              onClick={() => setActiveTab('search')}
              className={`px-4 py-2 text-xs font-black uppercase rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'search' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:bg-slate-200/50'}`}
            >
              <Search size={14} />
              {isAr ? "البحث في الفهرس" : "Global Master Search"}
            </button>
            <button 
              onClick={() => setActiveTab('duplicates')}
              className={`px-4 py-2 text-xs font-black uppercase rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'duplicates' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:bg-slate-200/50'}`}
            >
              <SplitSquareHorizontal size={14} />
              {isAr ? "مراجعة التكرار" : "Duplicate Resolution"}
              <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full text-[10px] ml-1">84</span>
            </button>
            <button 
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 text-xs font-black uppercase rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'audit' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:bg-slate-200/50'}`}
            >
              <History size={14} />
              {isAr ? "سجل التعديلات" : "Identity Audit Log"}
            </button>
          </div>

          <div className="flex-1">
            {activeTab === 'search' && (
              <div className="p-8">
                <div className="relative max-w-3xl mx-auto mb-10">
                  <Search className={`w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-5' : 'left-5'}`} />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isAr ? "البحث بالرقم الوطني، الجوال، الاسم، أو رقم الملف..." : "Search Master Registry (Name, MRN, ID, Phone)..."}
                    className={`w-full pl-14 pr-14 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-lg focus:border-indigo-500 focus:ring-0 font-bold transition-all placeholder:text-slate-300`}
                  />
                  <div className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'left-3' : 'right-3'} flex gap-1`}>
                     <button className="p-2.5 bg-slate-200 text-slate-600 rounded-xl hover:bg-slate-300 transition-all">
                       <Filter size={18} />
                     </button>
                     <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-black text-sm uppercase shadow-lg shadow-indigo-100 transition-all active:scale-95">
                       {isAr ? "بحث" : "Query"}
                     </button>
                  </div>
                </div>
                
                {searchQuery ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {patients.filter(p => p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || p.mrn.includes(searchQuery)).map(p => (
                      <div key={p.id} className="border border-slate-200 rounded-2xl p-4 flex items-center justify-between hover:border-indigo-400 transition-all cursor-pointer bg-white group shadow-sm">
                        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all font-black text-xl border border-slate-100">
                            {isAr ? p.nameAr.charAt(0) : p.nameEn.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-black text-slate-800 uppercase tracking-tight">{isAr ? p.nameAr : p.nameEn}</h4>
                            <div className="flex gap-3 text-[10px] text-slate-400 font-black mt-1 uppercase tracking-widest">
                              <span className="flex items-center gap-1"><FileDigit size={12} /> {p.mrn}</span>
                              <span>•</span>
                              <span>{p.dateOfBirth}</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          className="p-2 bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
                          onClick={() => window.dispatchEvent(new CustomEvent("openPatientChart", { detail: { patientId: p.mrn, patientName: isAr ? p.nameAr : p.nameEn, initialTab: "summary" } }))}
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center text-slate-400 flex flex-col items-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                      <Fingerprint className="w-12 h-12 opacity-20" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-tight">{isAr ? "محرك الهوية الموحد" : "Master Identity Engine"}</h3>
                    <p className="text-sm font-bold text-slate-500 mt-2 max-w-md">{isAr ? "يرجى إدخال معايير البحث لاستعراض السجلات من قاعدة البيانات المركزية." : "Please enter search criteria to retrieve patient identity records from the central repository."}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'duplicates' && (
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                  <div>
                    <h3 className="font-black text-slate-800 uppercase tracking-tight">{isAr ? "التكرارات المحتملة للمراجعة" : "Deduplication Workbench"}</h3>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{isAr ? "اكتشاف السجلات المكررة بناءً على خوارزميات الربط" : "Discovery based on fuzzy matching algorithms"}</p>
                  </div>
                  <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-black uppercase hover:bg-slate-200 transition-all flex items-center gap-2">
                    <RefreshCw size={14} />
                    {isAr ? "إعادة مسح الفهرس" : "Re-Scan Index"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {duplicateCandidates.map(dup => (
                    <div key={dup.id} className="border-2 border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:border-amber-200 transition-all bg-white flex flex-col">
                      <div className="bg-amber-50 p-4 flex items-center justify-between border-b border-amber-100">
                        <div className="flex items-center gap-2 text-amber-700 font-black text-xs uppercase tracking-widest">
                          <ShieldAlert size={16} />
                          <span>{isAr ? "نسبة التطابق:" : "Match Score:"} {dup.score}</span>
                        </div>
                        <div className="flex gap-2 min-w-max">
                          <button className="px-3 py-1.5 bg-white border border-amber-200 text-amber-700 rounded-xl text-[10px] font-black uppercase hover:bg-amber-100 transition-all active:scale-95">
                            {isAr ? "تجاهل" : "Ignore"}
                          </button>
                          <button 
                            onClick={() => setSelectedForMerge(dup)}
                            className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-indigo-700 flex items-center gap-2 shadow-lg shadow-indigo-100 active:scale-95 transition-all"
                          >
                            <Merge size={14} />
                            {isAr ? "دمج" : "Merge"}
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 divide-x rtl:divide-x-reverse divide-slate-100 flex-1">
                        <div className="p-6 space-y-4">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "السجل الأساسي" : "Primary Record"}</div>
                          <div>
                            <div className="font-black text-slate-800 uppercase tracking-tight">{isAr ? dup.record1.nameAr : dup.record1.name}</div>
                            <div className="text-xs font-mono font-bold text-indigo-600 mt-1">{dup.record1.mrn}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-[10px] font-bold text-slate-500 flex justify-between"><span>DOB:</span> <span className="text-slate-700">{dup.record1.dob}</span></div>
                            <div className="text-[10px] font-bold text-slate-500 flex justify-between"><span>TEL:</span> <span className="text-slate-700">{dup.record1.phone}</span></div>
                          </div>
                        </div>
                        <div className="p-6 space-y-4 bg-slate-50/30">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "السجل المكرر" : "Potential Duplicate"}</div>
                          <div>
                            <div className="font-black text-slate-800 uppercase tracking-tight">{isAr ? dup.record2.nameAr : dup.record2.name}</div>
                            <div className="text-xs font-mono font-bold text-rose-600 mt-1">{dup.record2.mrn}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-[10px] font-bold text-slate-500 flex justify-between"><span>DOB:</span> <span className="text-slate-700">{dup.record2.dob}</span></div>
                            <div className="text-[10px] font-bold text-slate-500 flex justify-between"><span>TEL:</span> <span className="text-slate-700">{dup.record2.phone}</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="p-8">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="font-black text-slate-800 uppercase tracking-tight">{isAr ? "سجل تدقيق الهوية الموحد" : "Master Identity Audit Trail"}</h3>
                    <button className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all"><Download size={16} /></button>
                 </div>
                 <div className="space-y-3">
                   {auditLogs.map(log => (
                     <div key={log.id} className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between hover:border-indigo-300 transition-all group shadow-sm">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:gap-5 flex-wrap ">
                          <div className="p-3 bg-slate-100 text-slate-400 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                            {log.action === 'RECORD_MERGE' ? <Merge size={20} /> : <UserPlus size={20} />}
                          </div>
                          <div>
                            <div className="text-sm font-black text-slate-800 uppercase tracking-tight">{log.action.replace('_', ' ')}</div>
                            <div className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">
                              {isAr ? "بواسطة:" : "By:"} {log.user} • {log.timestamp}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono font-black text-indigo-600 uppercase">{log.mrn}</div>
                          <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase">{log.target}</div>
                        </div>
                     </div>
                   ))}
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Merge Confirmation Modal */}
      {selectedForMerge && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200">
             <div className="p-8 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
               <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                 <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                   <Merge size={24} />
                 </div>
                 <div>
                   <h3 className="text-xl font-black uppercase tracking-tight">{isAr ? "تأكيد دمج السجلات" : "Confirm Identity Merge"}</h3>
                   <p className="text-xs font-bold text-slate-400 uppercase mt-1 tracking-widest">{isAr ? "عملية غير قابلة للتراجع" : "Irreversible Operational Procedure"}</p>
                 </div>
               </div>
               <button onClick={() => setSelectedForMerge(null)} className="p-2 hover:bg-slate-800 rounded-full text-slate-500 transition-all"><X size={24} /></button>
             </div>

             <div className="p-10 grid grid-cols-1 sm:grid-cols-2 gap-8 bg-slate-50">
               <div className="space-y-6">
                 <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{isAr ? "السجل الفائز (المصدر)" : "Winning Record (Survivor)"}</h4>
                 <div className="bg-white p-6 rounded-3xl border-2 border-emerald-500 shadow-xl shadow-emerald-500/5 relative">
                   <div className="absolute -top-3 -right-3 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg"><Check size={16} /></div>
                   <div className="flex items-center gap-2 sm:gap-4 flex-wrap  mb-6">
                     <div className="w-10 h-10 sm:w-14 sm:h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-black text-2xl border border-emerald-100">{selectedForMerge.record1.nameAr.charAt(0)}</div>
                     <div>
                       <div className="text-lg font-black text-slate-800 uppercase tracking-tight">{isAr ? selectedForMerge.record1.nameAr : selectedForMerge.record1.name}</div>
                       <div className="text-xs font-mono font-bold text-emerald-600">{selectedForMerge.record1.mrn}</div>
                     </div>
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between text-xs font-bold"><span className="text-slate-400 uppercase">Gender</span> <span className="text-slate-700">{selectedForMerge.record1.gender}</span></div>
                      <div className="flex justify-between text-xs font-bold"><span className="text-slate-400 uppercase">DOB</span> <span className="text-slate-700">{selectedForMerge.record1.dob}</span></div>
                      <div className="flex justify-between text-xs font-bold"><span className="text-slate-400 uppercase">Phone</span> <span className="text-slate-700">{selectedForMerge.record1.phone}</span></div>
                   </div>
                 </div>
               </div>

               <div className="space-y-6">
                 <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{isAr ? "السجل المحذوف (المكرر)" : "Retired Record (To Be Deleted)"}</h4>
                 <div className="bg-white p-6 rounded-3xl border-2 border-rose-200 opacity-60 relative grayscale">
                   <div className="absolute -top-3 -right-3 bg-rose-500 text-white p-1.5 rounded-full shadow-lg"><Trash2 size={16} /></div>
                   <div className="flex items-center gap-2 sm:gap-4 flex-wrap  mb-6">
                     <div className="w-10 h-10 sm:w-14 sm:h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 font-black text-2xl border border-rose-100">{selectedForMerge.record2.nameAr.charAt(0)}</div>
                     <div>
                       <div className="text-lg font-black text-slate-800 uppercase tracking-tight">{isAr ? selectedForMerge.record2.nameAr : selectedForMerge.record2.name}</div>
                       <div className="text-xs font-mono font-bold text-rose-600">{selectedForMerge.record2.mrn}</div>
                     </div>
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between text-xs font-bold"><span className="text-slate-400 uppercase">Gender</span> <span className="text-slate-700">{selectedForMerge.record2.gender}</span></div>
                      <div className="flex justify-between text-xs font-bold"><span className="text-slate-400 uppercase">DOB</span> <span className="text-slate-700">{selectedForMerge.record2.dob}</span></div>
                      <div className="flex justify-between text-xs font-bold"><span className="text-slate-400 uppercase">Phone</span> <span className="text-slate-700">{selectedForMerge.record2.phone}</span></div>
                   </div>
                 </div>
               </div>
             </div>

             <div className="p-8 bg-white border-t border-slate-100 flex items-center justify-between">
               <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-rose-600 font-bold text-xs uppercase tracking-widest">
                 <ShieldAlert size={18} />
                 <span>All historical encounters, clinical notes, and labs from Record 2 will be re-mapped to Record 1.</span>
               </div>
               <div className="flex gap-4">
                 <button onClick={() => setSelectedForMerge(null)} className="px-8 py-3 text-xs font-black uppercase text-slate-500 hover:text-slate-800 transition-all">{isAr ? "إلغاء" : "Cancel"}</button>
                 <button 
                  onClick={() => handleMerge(selectedForMerge)}
                  className="px-10 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                 >
                   {isAr ? "تنفيذ الدمج النهائي" : "Execute Final Merge"}
                 </button>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Download = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);
