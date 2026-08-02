import React, { useState, useEffect } from "react";
import { 
  CircleDollarSign, TrendingUp, Users, CreditCard, ArrowUpRight, 
  ArrowDownRight, Receipt, FileCheck, Landmark, Activity, 
  BarChart3, Calendar, Search, Filter, AlertCircle, FileText,
  Clock, CheckCircle2
} from "lucide-react";
import { useHIS } from "../context/HISContext";
import { format } from "date-fns";
import { safeFormatDate } from "../lib/dateUtils";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

export default function RevenueCycleDashboard({ language }: Props) {
  const isAr = language === "ar";
  const { charges, claims, addClaim } = useHIS();
  const [activeTab, setActiveTab] = useState<"overview" | "coding" | "claims" | "collections">("overview");

  const pendingCoding = (charges || []).filter(c => c.status === "pending" || c.status === "ordered");
  const readyToBill = (charges || []).filter(c => c.status === "coded");

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
            <CircleDollarSign className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {isAr ? "دورة الإيرادات (RCM)" : "Revenue Cycle Management"}
            </h2>
            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">
              {isAr ? "تحليل الأداء المالي، المطالبات، والتحصيل" : "Financial Performance, Claims & Collections Analytics"}
            </p>
          </div>
        </div>

        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1">
          {[
            { id: "overview", label: isAr ? "نظرة عامة" : "Overview" },
            { id: "coding", label: isAr ? "التكويد" : "Coding" },
            { id: "claims", label: isAr ? "المطالبات" : "Claims" },
            { id: "collections", label: isAr ? "التحصيل" : "Collections" },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
             <RCMStatCard title={isAr ? "المطالبات المرسلة" : "Claims Generated"} value={claims.length.toString()} trend="+5.2%" isGood={true} icon={Receipt} />
             <RCMStatCard title={isAr ? "نسبة القبول من المرة الأولى" : "Clean Claim Rate"} value="96.8%" trend="+1.1%" isGood={true} icon={FileCheck} />
             <RCMStatCard title={isAr ? "نسبة المرفوضات" : "Denial Rate"} value="4.2%" trend="-0.5%" isGood={true} icon={Activity} />
             <RCMStatCard title={isAr ? "متوسط أيام التحصيل" : "A/R Days"} value="28" trend="+2 days" isGood={false} icon={Landmark} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-indigo-500" />
                      {isAr ? "حالة محرك المطالبات" : "Claims Engine Status"}
                   </h3>
                   <button className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-sm">
                      {isAr ? "تشغيل دفعة" : "Run Batch"}
                   </button>
                </div>
                <div className="p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
                   <CircleDollarSign className="w-16 h-16 text-emerald-200 mb-4" />
                   <h4 className="text-xl font-black text-slate-800 mb-2">Automated Coding & Billing Active</h4>
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-widest max-w-md mx-auto mb-8 leading-relaxed">
                      Mapping ICD-10 and CPT codes from clinical documentation using AI. DRG grouping is calculating optimally.
                   </p>
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
                      <div 
                        onClick={() => setActiveTab("coding")}
                        className="px-6 py-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center hover:border-indigo-300 transition-colors cursor-pointer"
                      >
                         <span className="text-3xl font-black text-slate-900 mb-1">{pendingCoding.length}</span>
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Coding</span>
                      </div>
                      <div 
                        onClick={() => setActiveTab("claims")}
                        className="px-6 py-5 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col items-center hover:border-indigo-300 transition-colors cursor-pointer"
                      >
                         <span className="text-3xl font-black text-indigo-600 mb-1">{readyToBill.length}</span>
                         <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Ready to Bill</span>
                      </div>
                      <div className="px-6 py-5 bg-rose-50 rounded-2xl border border-rose-100 flex flex-col items-center hover:border-rose-300 transition-colors cursor-pointer">
                         <span className="text-3xl font-black text-rose-600 mb-1">{claims.filter(c => c.status === 'denied').length}</span>
                         <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Denials to Fix</span>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl flex flex-col justify-between">
                <div>
                   <h3 className="text-sm font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 mb-8">
                      <AlertCircle className="w-4 h-4" /> Top Denial Reasons
                   </h3>
                   <div className="space-y-6">
                      <div>
                         <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                            <span className="text-slate-300">Authorization Missing</span>
                            <span className="text-white">45%</span>
                         </div>
                         <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-500 w-[45%]" />
                         </div>
                      </div>
                      <div>
                         <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                            <span className="text-slate-300">Code Inconsistency</span>
                            <span className="text-white">30%</span>
                         </div>
                         <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 w-[30%]" />
                         </div>
                      </div>
                      <div>
                         <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                            <span className="text-slate-300">Duplicate Claim</span>
                            <span className="text-white">15%</span>
                         </div>
                         <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[15%]" />
                         </div>
                      </div>
                   </div>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-800">
                   <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">
                      View Denial Reports
                   </button>
                </div>
             </div>
          </div>
        </>
      )}

      {activeTab === "coding" && (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
           <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                 <FileText className="w-5 h-5 text-indigo-500" />
                 {isAr ? "طابور مراجعة التكويد الطبي" : "Medical Coding Review Queue"}
              </h3>
              <div className="flex gap-2">
                 <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors">
                    {isAr ? "تكويد تلقائي (AI)" : "Auto-Code (AI)"}
                 </button>
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left" dir={isAr ? "rtl" : "ltr"}>
                 <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                    <tr>
                       <th className="px-6 py-4">{isAr ? "التاريخ" : "Date"}</th>
                       <th className="px-6 py-4">{isAr ? "المريض" : "Patient"}</th>
                       <th className="px-6 py-4">{isAr ? "الخدمة" : "Service"}</th>
                       <th className="px-6 py-4 text-right">{isAr ? "المبلغ" : "Amount"}</th>
                       <th className="px-6 py-4 text-center">{isAr ? "الحالة" : "Status"}</th>
                       <th className="px-6 py-4 text-right">{isAr ? "إجراء" : "Action"}</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {pendingCoding.map(charge => (
                       <tr key={charge.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                             <div className="text-xs font-bold text-slate-600">{safeFormatDate(charge.date, "dd/MM HH:mm")}</div>
                          </td>
                          <td className="px-6 py-4">
                             <div className="text-xs font-black text-slate-800">{charge.patientName}</div>
                             <div className="text-[10px] font-bold text-slate-400 uppercase">{charge.patientId}</div>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${
                                   charge.category === 'lab' ? 'bg-purple-500' :
                                   charge.category === 'radiology' ? 'bg-blue-500' : 'bg-slate-400'
                                }`}></span>
                                <span className="text-xs font-bold text-slate-700">{charge.serviceName}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4 text-right font-black text-slate-800 text-xs">
                             {charge.amount.toFixed(2)} SAR
                          </td>
                          <td className="px-6 py-4 text-center">
                             <span className="px-2 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg text-[9px] font-black uppercase">Pending Code</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <button 
                              onClick={() => toast.success(isAr ? "تم إعتماد التكويد" : "Coding finalized")}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors active:scale-95"
                             >
                                <CheckCircle2 className="w-4 h-4" />
                             </button>
                          </td>
                       </tr>
                    ))}
                    {pendingCoding.length === 0 && (
                       <tr>
                          <td colSpan={6} className="px-6 py-20 text-center">
                             <Clock className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                             <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Coding Queue is Clear</p>
                          </td>
                       </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === "claims" && (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
           <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                 <Receipt className="w-5 h-5 text-emerald-500" />
                 {isAr ? "إدارة المطالبات المالية" : "Insurance Claims Management"}
              </h3>
           </div>
           <div className="p-20 text-center">
              <Activity className="w-16 h-16 text-emerald-100 mx-auto mb-4" />
              <h4 className="text-xl font-black text-slate-800 mb-2">Automated Claim Batching</h4>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">System is processing {readyToBill.length} charges for bulk submission.</p>
              <button className="px-8 py-4 bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all active:scale-95">
                Generate Claim Batch
              </button>
           </div>
        </div>
      )}

      {(activeTab === "collections") && (
        <div className="flex flex-col items-center justify-center min-h-[500px] bg-white rounded-3xl border border-slate-200 shadow-sm text-center p-8">
           <FileText className="w-20 h-20 text-slate-200 mb-6" />
           <h3 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight mb-2">
              Collections & A/R Module
           </h3>
           <p className="text-slate-500 font-medium max-w-md mx-auto mb-8 leading-relaxed">
             Integrated debt collection, patient statements, and accounts receivable tracking.
           </p>
           <button className="px-8 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all">
             Generate A/R Report
           </button>
        </div>
      )}
    </div>
  );
}

function RCMStatCard({ title, value, trend, isGood, icon: Icon }: any) {
   return (
      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:border-emerald-300 transition-colors group">
         <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform">
               <Icon className="w-6 h-6" />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${isGood ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
               {trend}
            </span>
         </div>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
         <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
      </div>
   );
}
