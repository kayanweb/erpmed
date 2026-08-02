import React, { createElement, useState, useMemo } from "react";
import { 
  Users, UserPlus, Clock, DollarSign, Calendar, FileText, Search, Filter, 
  MoreVertical, CheckCircle2, XCircle, LayoutDashboard, ListTodo, FileSearch,
  ChevronRight, ArrowLeft, ArrowRight, Bell, Zap, Eye, FileOutput, Printer,
  History, GraduationCap, Briefcase, HeartHandshake, ShieldCheck, Wallet, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHIS } from "../context/HISContext";
import { LeaveManagement, StaffDirectory, AttendanceHub, PayrollEngine, ArchiveSearch } from "./hr";

export default function HRDashboard({ language, onClose }: { language: "ar" | "en", onClose?: () => void }) {
  const isAr = language === "ar";
  const { currentUser } = useHIS();
  
  const [activeMainTab, setActiveMainTab] = useState<string>("dashboard");
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  const mainTabs = [
    { id: "dashboard", icon: LayoutDashboard, en: "HR Command Center", ar: "مركز قيادة الموارد البشرية" },
    { id: "directory", icon: Users, en: "Staff Directory", ar: "دليل الموظفين" },
    { id: "attendance", icon: Clock, en: "Attendance Hub", ar: "مركز الحضور" },
    { id: "payroll", icon: Wallet, en: "Payroll Engine", ar: "محرك الرواتب" },
    { id: "leaves", icon: Calendar, en: "Leave Management", ar: "إدارة الإجازات" },
    { id: "search", icon: FileSearch, en: "Archive Search", ar: "بحث الأرشيف" },
  ];

  const hrStats = [
    { label: isAr ? "إجمالي الموظفين" : "Total Workforce", value: "342", change: "+4", icon: Users, color: "indigo" },
    { label: isAr ? "حضور اليوم" : "Today's Attendance", value: "94%", change: "+2%", icon: Clock, color: "emerald" },
    { label: isAr ? "طلبات إجازة" : "Leave Requests", value: "8", change: "+1", icon: Calendar, color: "blue" },
    { label: isAr ? "فجوات المناوبات" : "Shift Gaps", value: "3", change: "-2", icon: Briefcase, color: "rose" },
  ];

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#f8fafc]" dir={isAr ? "rtl" : "ltr"}>
      {/* HR Module Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sm:py-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 shadow-sm z-30 shrink-0">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:gap-5 flex-wrap ">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-indigo-600 rounded-[22px] flex items-center justify-center shadow-xl shadow-indigo-100 border-2 border-indigo-50">
            <Users className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                {isAr ? "إدارة الموارد البشرية (HRMS)" : "Human Capital Management"}
              </h1>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-full border border-indigo-100 uppercase tracking-widest">
                Enterprise Edition v7.0
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
              <span className="text-sm font-bold text-slate-400">{isAr ? "إدارة الموظفين، الحضور، والرواتب" : "Workforce, Attendance & Compensation"}</span>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  {isAr ? "النظام مرتبط بالتأمينات" : "GOSI/Social Security Linked"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
           <button 
             onClick={onClose}
             className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm group shrink-0"
           >
              <Plus className="w-6 h-6 rotate-45 group-hover:scale-110 transition-transform" />
           </button>
           <button className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all shadow-sm">
             <Bell className="w-6 h-6" />
           </button>
           <button className="px-6 py-3 bg-indigo-600 text-white rounded-[20px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95">
             <UserPlus className="w-5 h-5 text-indigo-200" />
             <span className="hidden lg:block">{isAr ? "تعيين جديد" : "Onboard Staff"}</span>
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
                  setSelectedStaffId(null);
                }}
                className={`flex items-center gap-2 px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
                  activeMainTab === tab.id ? "text-indigo-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeMainTab === tab.id ? "text-indigo-600" : ""}`} />
                {isAr ? tab.ar : tab.en}
                {activeMainTab === tab.id && (
                  <motion.div  className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full" />
                )}
              </button>
            ))}
         </div>
      </div>

      {/* Workspace Area */}
      <div className="flex-1 overflow-hidden min-h-0">
        <AnimatePresence mode="wait">
          {selectedStaffId ? (
             <motion.div 
               key="hr-details"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 10 }}
               className="h-full flex flex-col"
             >
                <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm z-10">
                   <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                      <button onClick={() => setSelectedStaffId(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-500">
                        <ArrowLeft className={`w-6 h-6 ${isAr ? 'rotate-180' : ''}`} />
                      </button>
                      <div className="w-[1px] h-8 bg-slate-200" />
                      <div>
                         <h3 className="text-lg font-black text-slate-800 tracking-tight">{isAr ? "ملف الموظف الرقمي" : "Digital Staff Record"}</h3>
                         <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{isAr ? "كود الموظف: " + selectedStaffId : "Employee ID: " + selectedStaffId}</p>
                      </div>
                   </div>
                   <div className="flex gap-3">
                      <button className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-[14px] text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                        {isAr ? "تعديل البيانات" : "Edit Profile"}
                      </button>
                      <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-[14px] text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                        {isAr ? "إدارة الصلاحيات" : "Manage IAM"}
                      </button>
                   </div>
                </div>
                <div className="flex-1 p-8 overflow-y-auto no-scrollbar">
                   <div className="w-full space-y-6">
                      <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
                         <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">{isAr ? "البيانات الوظيفية" : "Professional Information"}</h4>
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "المسمى الوظيفي" : "Designation"}</p>
                               <p className="font-black text-slate-800">Senior Consultant - Cardiology</p>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "تاريخ التعيين" : "Joining Date"}</p>
                               <p className="font-black text-slate-800">12 Jan 2021</p>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "الحالة" : "Status"}</p>
                               <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-widest">Active</span>
                            </div>
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
                       {hrStats.map((stat, i) => (
                         <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                               <div className={`p-4 bg-${stat.color}-50 rounded-2xl border border-${stat.color}-100`}>
                                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                               </div>
                               <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
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
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">{isAr ? "طلبات الموظفين المعلقة" : "Pending Staff Requests"}</h3>
                                <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{isAr ? "إجازات، وثائق، وقروض" : "Leaves, Documents & Advances"}</p>
                             </div>
                             <button className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all"><MoreVertical className="w-6 h-6" /></button>
                          </div>
                          <div className="space-y-4">
                             {[
                               { name: "Ahmed Samir", type: "Annual Leave", days: "5 Days", status: "Pending" },
                               { name: "Laila Ibrahim", type: "Salary Certificate", days: "N/A", status: "Urgent" },
                               { name: "Zaid Omar", type: "Shift Swap", days: "1 Day", status: "Pending" },
                             ].map((req, i) => (
                               <div key={i} className="group p-5 bg-slate-50 rounded-[28px] border border-slate-100 hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all flex items-center justify-between cursor-pointer" onClick={() => setSelectedStaffId('EMP-980' + i)}>
                                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:gap-5 flex-wrap ">
                                     <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-lg border border-indigo-200">
                                        <FileText className="w-6 h-6" />
                                     </div>
                                     <div>
                                        <h4 className="font-black text-slate-800 text-base leading-tight">{req.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{req.type} • {req.days}</p>
                                     </div>
                                  </div>
                                  <div className="flex items-center gap-6">
                                     <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${req.status === 'Urgent' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                                       {req.status}
                                     </span>
                                     <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>

                       <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl border border-slate-800">
                          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_20%,rgba(79,70,229,0.15),transparent)] pointer-events-none" />
                          <div>
                             <div className="flex justify-between items-start mb-10">
                                <h3 className="text-lg sm:text-2xl font-black tracking-tight leading-tight uppercase">{isAr ? "تحليل القوى العاملة" : "Workforce Insights"}</h3>
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                                   <History className="w-6 h-6 text-indigo-400" />
                                </div>
                             </div>
                             <div className="space-y-6">
                                {[
                                  { label: "Turnover Rate", val: "1.2%", color: "emerald" },
                                  { label: "Training Compliance", val: "92%", color: "blue" },
                                  { label: "Budget Utilization", val: "84%", color: "amber" },
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
                          <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg active:scale-95 mt-10">
                             {isAr ? "تحميل تقرير الموارد البشرية" : "Download HR Report"}
                          </button>
                       </div>
                    </div>
                 </motion.div>
               )}

               {activeMainTab === "directory" && <StaffDirectory language={language} />}
               {activeMainTab === "attendance" && <AttendanceHub language={language} />}
               {activeMainTab === "payroll" && <PayrollEngine language={language} />}
               {activeMainTab === "leaves" && <LeaveManagement language={language} />}
               {activeMainTab === "search" && <ArchiveSearch language={language} />}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
