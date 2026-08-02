import { toast } from "sonner";
import React, { createElement, useState, useMemo } from "react";
import { GenericAddRecordModal } from "./GenericAddRecordModal";
import { 
  Download, Upload, Search, FileText, File, Video, Image as ImageIcon, 
  Folder, Filter, MoreVertical, Eye, LayoutDashboard, ListTodo, FileSearch,
  ChevronRight, ArrowLeft, ArrowRight, Bell, Zap, FileOutput, Printer,
  History as HistoryIcon, ShieldCheck, Share2, Trash2, CloudDownload, HardDrive
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHIS } from "../context/HISContext";

export default function DownloadCenterDashboard({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { currentUser } = useHIS();
  
  const [activeMainTab, setActiveMainTab] = useState<string>("dashboard");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const mainTabs = [
    { id: "dashboard", icon: LayoutDashboard, en: "Content Hub", ar: "مركز المحتوى" },
    { id: "templates", icon: FileText, en: "Official Templates", ar: "النماذج الرسمية" },
    { id: "materials", icon: Video, en: "Training Media", ar: "الوسائط التدريبية" },
    { id: "guidelines", icon: Folder, en: "Policy Guidelines", ar: "أدلة السياسات" },
    { id: "archive", icon: HistoryIcon, en: "Document Archive", ar: "أرشيف المستندات" },
    { id: "search", icon: FileSearch, en: "Global File Search", ar: "بحث الملفات العام" },
  ];

  const downloadStats = [
    { label: isAr ? "إجمالي الملفات" : "Total Assets", value: "1.2k", change: "+14", icon: HardDrive, color: "cyan" },
    { label: isAr ? "تحميلات اليوم" : "Today's Downloads", value: "482", change: "+52", icon: CloudDownload, color: "blue" },
    { label: isAr ? "تحديثات النظام" : "Policy Updates", value: "3", change: "New", icon: Zap, color: "amber" },
    { label: isAr ? "مساحة التخزين" : "Storage Used", value: "84%", change: "Stable", icon: ShieldCheck, color: "emerald" },
  ];

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#f8fafc]" dir={isAr ? "rtl" : "ltr"}>
      {/* Download Center Module Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sm:py-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 shadow-sm z-30 shrink-0">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:gap-5 flex-wrap ">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-cyan-600 rounded-[22px] flex items-center justify-center shadow-xl shadow-cyan-100 border-2 border-cyan-50">
            <Download className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                {isAr ? "مركز المستندات والتحميل" : "Enterprise Document Repository"}
              </h1>
              <span className="px-3 py-1 bg-cyan-50 text-cyan-700 text-[10px] font-black rounded-full border border-cyan-100 uppercase tracking-widest">
                Knowledge Base v3.5
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
              <span className="text-sm font-bold text-slate-400">{isAr ? "إدارة الأدلة الإرشادية، النماذج، والوسائط التعليمية" : "Policy Management, Templates & Digital Assets Library"}</span>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  {isAr ? "الأمان السحابي نشط" : "Cloud Security Active"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
           <button className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-cyan-600 rounded-2xl transition-all shadow-sm">
             <Bell className="w-6 h-6" />
           </button>
           <button className="px-6 py-3 bg-cyan-600 text-white rounded-[20px] font-black uppercase tracking-widest shadow-xl shadow-cyan-100 hover:bg-cyan-700 transition-all flex items-center gap-2 active:scale-95">
             <Upload className="w-5 h-5 text-cyan-200" />
             <span className="hidden lg:block">{isAr ? "رفع مستند" : "Publish Document"}</span>
           </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 px-2 sm:px-8 flex items-center overflow-x-auto custom-scrollbar sticky top-0 z-20 shrink-0">
         <div className="flex gap-2 min-w-max">
            {mainTabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => {
                  setActiveMainTab(tab.id);
                  setSelectedFolderId(null);
                }}
                className={`flex items-center gap-2 px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
                  activeMainTab === tab.id ? "text-cyan-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeMainTab === tab.id ? "text-cyan-600" : ""}`} />
                {isAr ? tab.ar : tab.en}
                {activeMainTab === tab.id && (
                  <motion.div  className="absolute bottom-0 left-0 w-full h-1 bg-cyan-600 rounded-t-full" />
                )}
              </button>
            ))}
         </div>
      </div>

      {/* Workspace Area */}
      <div className="flex-1 overflow-hidden min-h-0">
        <AnimatePresence mode="wait">
          {selectedFolderId ? (
             <motion.div 
               key="dl-details"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 10 }}
               className="h-full flex flex-col"
             >
                <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm z-10">
                   <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                      <button onClick={() => setSelectedFolderId(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-500">
                        <ArrowLeft className={`w-6 h-6 ${isAr ? 'rotate-180' : ''}`} />
                      </button>
                      <div className="w-[1px] h-8 bg-slate-200" />
                      <div>
                         <h3 className="text-lg font-black text-slate-800 tracking-tight">{isAr ? "محتويات المجلد" : "Folder Contents"}</h3>
                         <p className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">{isAr ? "المسار: " + selectedFolderId : "Path: /root/" + selectedFolderId}</p>
                      </div>
                   </div>
                   <div className="flex gap-3">
                      <button className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-[14px] text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                        {isAr ? "تحميل المجلد" : "Download Zip"}
                      </button>
                      <button className="px-6 py-2.5 bg-cyan-600 text-white rounded-[14px] text-xs font-black uppercase tracking-widest shadow-lg shadow-cyan-100 hover:bg-cyan-700 transition-all">
                        {isAr ? "مشاركة" : "Share Access"}
                      </button>
                   </div>
                </div>
                <div className="flex-1 p-8 overflow-y-auto no-scrollbar">
                   <div className="w-full space-y-6">
                      <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
                         <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">{isAr ? "قائمة الملفات" : "File Listing"}</h4>
                         <div className="space-y-4">
                            {[
                              { name: "Clinical_Guidelines_v2.pdf", size: "4.2 MB", type: "PDF" },
                              { name: "Staff_Shift_Policy.docx", size: "1.2 MB", type: "DOCX" },
                              { name: "Safety_Protocol_Video.mp4", size: "156 MB", type: "VIDEO" },
                            ].map((f, i) => (
                              <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                 <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                                    <FileText className="w-5 h-5 text-cyan-600" />
                                    <div>
                                       <p className="font-black text-slate-800 text-sm">{f.name}</p>
                                       <p className="text-[10px] font-bold text-slate-400 uppercase">{f.size} • {f.type}</p>
                                    </div>
                                 </div>
                                 <button className="p-2 hover:bg-white rounded-lg transition-all text-cyan-600 shadow-sm border border-transparent hover:border-cyan-100">
                                    <Download className="w-4 h-4" />
                                 </button>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>
          ) : (
            <div className="h-full overflow-y-auto no-scrollbar p-3 sm:p-6 lg:p-8">
               {activeMainTab === "dashboard" && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                       {downloadStats.map((stat, i) => (
                         <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                               <div className={`p-4 bg-${stat.color}-50 rounded-2xl border border-${stat.color}-100`}>
                                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                               </div>
                               <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : stat.change === 'New' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'}`}>
                                 {stat.change}
                               </span>
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                               <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{stat.value}</h3>
                            </div>
                         </div>
                       ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                       <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-200 shadow-sm p-10">
                          <div className="flex justify-between items-center mb-10">
                             <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">{isAr ? "الملفات المضافة حديثاً" : "Recently Added Files"}</h3>
                                <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{isAr ? "آخر تحديثات الأدلة والنماذج" : "Latest policy updates and clinical templates"}</p>
                             </div>
                             <button className="p-3 bg-slate-50 text-slate-400 hover:text-cyan-600 rounded-2xl transition-all"><MoreVertical className="w-6 h-6" /></button>
                          </div>
                          <div className="space-y-4">
                             {[
                               { id: "DOC-881", name: "Employee Handbook 2024", cat: "Policies", type: "PDF" },
                               { id: "DOC-882", name: "ICU Admission Criteria", cat: "Clinical", type: "PDF" },
                               { id: "DOC-883", name: "Staff Onboarding Presentation", cat: "Training", type: "PPTX" },
                             ].map((file, i) => (
                               <div key={file.id} className="group p-5 bg-slate-50 rounded-[28px] border border-slate-100 hover:bg-white hover:shadow-xl hover:border-cyan-100 transition-all flex items-center justify-between cursor-pointer" onClick={() => setSelectedFolderId(file.id)}>
                                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:gap-5 flex-wrap ">
                                     <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center font-black text-lg border border-cyan-200">
                                        <FileText className="w-6 h-6" />
                                     </div>
                                     <div>
                                        <h4 className="font-black text-slate-800 text-base leading-tight">{file.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{file.id} • {file.cat} • {file.type}</p>
                                     </div>
                                  </div>
                                  <div className="flex items-center gap-6">
                                     <button className="p-2 bg-white border border-slate-200 text-cyan-600 rounded-xl shadow-sm hover:scale-110 transition-all active:scale-95">
                                        <Download className="w-4 h-4" />
                                     </button>
                                     <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" />
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>

                       <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl border border-slate-800">
                          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_20%,rgba(6,182,212,0.15),transparent)] pointer-events-none" />
                          <div>
                             <div className="flex justify-between items-start mb-10">
                                <h3 className="text-lg sm:text-2xl font-black tracking-tight leading-tight uppercase">{isAr ? "تحليل الاستخدام" : "Content Insights"}</h3>
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                                   <HistoryIcon className="w-6 h-6 text-cyan-400" />
                                </div>
                             </div>
                             <div className="space-y-6">
                                {[
                                  { label: "Top Downloaded", val: "Policy-8", color: "cyan" },
                                  { label: "Active Users", val: "284", color: "blue" },
                                  { label: "Internal Sharing", val: "+24%", color: "emerald" },
                                ].map((m, i) => (
                                  <div key={i} className="space-y-2">
                                     <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{m.label}</span>
                                        <span className={`text-xs font-black text-${m.color}-400`}>{m.val}</span>
                                     </div>
                                     <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full bg-${m.color}-500 w-[80%]`} />
                                     </div>
                                  </div>
                                ))}
                             </div>
                          </div>
                          <button className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg active:scale-95 mt-10">
                             {isAr ? "طلب وثيقة جديدة" : "Request New Document"}
                          </button>
                       </div>
                    </div>
                 </motion.div>
               )}

               {["templates", "materials", "guidelines", "archive", "search"].includes(activeMainTab) && (
                 <div className="h-full p-8">
                    
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div>
                    <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">
                        {isAr ? "إدارة " + (mainTabs.find(t => t.id === activeMainTab)?.ar || "") : (mainTabs.find(t => t.id === activeMainTab)?.en || "") + " Management"}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 mt-1">
                        {isAr ? "واجهة التحكم المخصصة" : "Dedicated Control Interface"}
                    </p>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">
                    {isAr ? "إضافة سجل جديد" : "Add New Record"}
                </button>
            </div>
            <div className="p-0 flex-1 overflow-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "المعرف" : "ID"}</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "التاريخ" : "Date"}</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "التفاصيل" : "Details"}</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "الحالة" : "Status"}</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{isAr ? "إجراء" : "Action"}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr>
                            <td colSpan={5} className="p-12 text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center mb-4 text-slate-300">
                                        <Filter className="w-8 h-8" />
                                    </div>
                                    <h4 className="font-black text-slate-700 text-lg mb-1">{isAr ? "لا توجد بيانات حالياً" : "No data available"}</h4>
                                    <p className="text-sm font-bold text-slate-400">{isAr ? "لم يتم العثور على سجلات في هذا القسم" : "No records found in this section"}</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    
                 </div>
               )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
