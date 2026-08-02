import React, { useState, useMemo } from "react";
import { 
  Receipt, Search, Plus, Save, Printer, XCircle, RefreshCw, FileText, 
  CheckCircle2, ShieldCheck, BarChart3, ArrowUpRight, TrendingUp,
  CreditCard, Wallet, Landmark, FileCheck, AlertCircle, Clock,
  ChevronRight, ArrowLeft, MoreVertical, LayoutDashboard, Database, FileOutput
} from "lucide-react";
import { useHIS } from "../context/HISContext";
import { motion, AnimatePresence } from "motion/react";
import { GlobalEntityLink } from "./GlobalEntityLink";

interface Props {
  language: "ar" | "en";
  onClose?: () => void;
}

export default function BillingInsurance({ language, onClose }: Props) {
  const isAr = language === "ar";
  const { invoices: realInvoices, patients, updateInvoiceStatus, cpoeOrders, prescriptions } = useHIS();
  
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  const tabs = [
    { id: "dashboard", icon: LayoutDashboard, en: "RCM Analytics", ar: "تحليلات دورة الإيرادات" },
    { id: "invoices", icon: Receipt, en: "Invoicing", ar: "الفواتير" },
    { id: "claims", icon: ShieldCheck, en: "Insurance Claims", ar: "المطالبات التأمينية" },
    { id: "ledger", icon: Database, en: "Financial Ledger", ar: "السجل المالي" },
  ];

  const stats = [
    { label: isAr ? "إجمالي الإيرادات" : "Total Revenue", value: "842,500", change: "+12.5%", icon: TrendingUp, color: "emerald" },
    { label: isAr ? "مطالبات معلقة" : "Pending Claims", value: "128", change: "+8", icon: Clock, color: "amber" },
    { label: isAr ? "نسبة الرفض" : "Denial Rate", value: "2.4%", change: "-0.5%", icon: AlertCircle, color: "rose" },
    { label: isAr ? "الفترة العمرية للديون" : "AR Days", value: "32d", change: "-2d", icon: BarChart3, color: "blue" },
  ];

  const processedInvoices = useMemo(() => {
    return realInvoices.map(inv => {
      const p = patients.find(pat => pat.id === inv.patientId);
      return {
        ...inv,
        patientName: p ? (isAr ? p.nameAr : p.nameEn) : `Patient: ${inv.patientId}`,
        mrn: p ? p.mrn : inv.patientId,
      };
    });
  }, [realInvoices, patients, isAr]);

  const filteredInvoices = processedInvoices.filter(inv => {
    const query = searchQuery.toLowerCase();
    return inv.id.toLowerCase().includes(query) || inv.patientName.toLowerCase().includes(query);
  });

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#f8fafc]" dir={isAr ? "rtl" : "ltr"}>
      {/* RCM Module Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sm:py-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 shadow-sm z-30 shrink-0">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:gap-5 flex-wrap ">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-amber-600 rounded-[22px] flex items-center justify-center shadow-xl shadow-amber-100 border-2 border-amber-50">
            <Receipt className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                {isAr ? "نظام إدارة دورة الإيرادات (RCM)" : "Revenue Cycle Management"}
              </h1>
              <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black rounded-full border border-amber-100 uppercase tracking-widest">
                Enterprise
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
              <span className="text-sm font-bold text-slate-400">{isAr ? "الفوترة والمطالبات والتحليلات المالية" : "Billing, Claims & Financial Intelligence"}</span>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Ledger</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
           <button 
             onClick={onClose}
             className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm group"
           >
              <Plus className="w-6 h-6 rotate-45 group-hover:scale-110 transition-transform" />
           </button>
           <button className="px-6 py-3 bg-amber-600 text-white rounded-[20px] font-black uppercase tracking-widest shadow-xl shadow-amber-100 hover:bg-amber-700 transition-all flex items-center gap-2 active:scale-95 text-xs">
             <CreditCard className="w-5 h-5" />
             <span>{isAr ? "تحصيل سريع" : "Quick Collect"}</span>
           </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 px-2 sm:px-8 flex items-center overflow-x-auto custom-scrollbar sticky top-0 z-20 overflow-x-auto no-scrollbar shrink-0">
         <div className="flex gap-2 min-w-max">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
                  activeTab === tab.id ? "text-amber-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-amber-600" : ""}`} />
                {isAr ? tab.ar : tab.en}
                {activeTab === tab.id && (
                  <motion.div  className="absolute bottom-0 left-0 right-0 h-1 bg-amber-600 rounded-t-full" />
                )}
              </button>
            ))}
         </div>
      </div>

      {/* Workspace Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3 sm:p-6 lg:p-8">
         <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
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
                             <h3 className="text-xl font-black text-slate-900 tracking-tight">{isAr ? "تحليل التدفق النقدي" : "Cash Flow Intelligence"}</h3>
                             <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{isAr ? "الإيرادات مقابل التحصيل" : "Revenue vs Collections Trend"}</p>
                          </div>
                          <div className="flex gap-4">
                             <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-amber-500 rounded-full" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "الإيرادات" : "Gross"}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "التحصيل" : "Net"}</span>
                             </div>
                          </div>
                       </div>
                       <div className="h-[300px] flex items-end gap-4 px-4">
                          {[45, 62, 58, 75, 90, 82, 95].map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col gap-1 items-center group">
                               <div className="w-full bg-slate-50 rounded-t-xl relative overflow-hidden h-full flex flex-col justify-end">
                                  <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${val}%` }}
                                    className="w-full bg-amber-500 opacity-20"
                                  />
                                  <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${val * 0.8}%` }}
                                    className="absolute bottom-0 w-full bg-emerald-500 rounded-t-lg shadow-lg shadow-emerald-100"
                                  />
                               </div>
                               <span className="text-[9px] font-black text-slate-400 uppercase mt-2">Day {i+1}</span>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl">
                       <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_20%,rgba(245,158,11,0.15),transparent)] pointer-events-none" />
                       <div>
                          <div className="flex justify-between items-start mb-10">
                             <h3 className="text-lg sm:text-2xl font-black tracking-tight leading-tight uppercase">{isAr ? "تحليل الرفض التأميني" : "Claim Denial Root Cause"}</h3>
                             <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 text-amber-400">
                                <AlertCircle className="w-6 h-6" />
                             </div>
                          </div>
                          <div className="space-y-6">
                             {[
                               { reason: "Missing Authorization", count: "42", percent: 45 },
                               { reason: "Policy Expired", count: "18", percent: 25 },
                               { reason: "Coding Mismatch", count: "12", percent: 15 },
                             ].map((d, i) => (
                               <div key={i} className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                     <span>{d.reason}</span>
                                     <span>{d.count}</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                     <motion.div initial={{ width: 0 }} animate={{ width: `${d.percent}%` }} className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                       <button className="w-full py-4 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all mt-10">
                          {isAr ? "تقرير تحليل الرفض" : "Denial Analysis Report"}
                       </button>
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === "claims" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                 <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                       <h2 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight">{isAr ? "مركز المطالبات الإلكترونية" : "Electronic Claims Clearinghouse"}</h2>
                       <div className="flex gap-4">
                          <button className="px-6 py-2.5 bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-700 shadow-lg shadow-amber-100 transition-all">
                             {isAr ? "إرسال المطالبات المجمعة" : "Submit Batch Claims"}
                          </button>
                       </div>
                    </div>
                    <div className="overflow-x-auto">
                       <table className="w-full text-left">
                          <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                             <tr>
                                <th className="py-5 px-8">{isAr ? "رقم المطالبة" : "Claim ID"}</th>
                                <th className="py-5 px-8">{isAr ? "المريض" : "Patient"}</th>
                                <th className="py-5 px-8">{isAr ? "شركة التأمين" : "Payer"}</th>
                                <th className="py-5 px-8">{isAr ? "المبلغ" : "Amount"}</th>
                                <th className="py-5 px-8">{isAr ? "الحالة" : "Status"}</th>
                                <th className="py-5 px-8 text-right">{isAr ? "إجراء" : "Action"}</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                             {[
                                { id: "CLM-88210", patient: patients[0], payer: "Bupa Arabia", amount: "4,200", status: "Transmitted" },
                                { id: "CLM-88211", patient: patients[1], payer: "Tawuniya", amount: "1,850", status: "Adjudicated" },
                                { id: "CLM-88212", patient: patients[2], payer: "Medgulf", amount: "12,400", status: "Denied" },
                                { id: "CLM-88213", patient: patients[3], payer: "Amana", amount: "950", status: "Pending" },
                             ].map((claim, i) => (
                                <tr key={claim.id} className="group hover:bg-slate-50/50 transition-all">
                                   <td className="py-5 px-8 font-mono text-xs font-black text-amber-600">{claim.id}</td>
                                   <td className="py-5 px-8">
                                      <p className="text-sm font-black text-slate-800">
                                         <GlobalEntityLink entityId={claim.patient.id} entityName={isAr ? claim.patient.nameAr : claim.patient.nameEn} entityType="patient" isAr={isAr}>
                                            {isAr ? claim.patient.nameAr : claim.patient.nameEn}
                                         </GlobalEntityLink>
                                      </p>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                                         <GlobalEntityLink entityId={claim.patient.mrn || claim.patient.id} entityName={isAr ? claim.patient.nameAr : claim.patient.nameEn} entityType="patient" isAr={isAr}>
                                            {claim.patient.mrn}
                                         </GlobalEntityLink>
                                      </p>
                                   </td>
                                   <td className="py-5 px-8 text-xs font-black text-slate-600 uppercase">{claim.payer}</td>
                                   <td className="py-5 px-8 text-sm font-black text-slate-900">{claim.amount} <span className="text-[10px] text-slate-400 font-bold">SAR</span></td>
                                   <td className="py-5 px-8">
                                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                        claim.status === 'Adjudicated' ? 'bg-emerald-100 text-emerald-700' : 
                                        claim.status === 'Denied' ? 'bg-rose-100 text-rose-700' : 
                                        'bg-blue-100 text-blue-700'
                                      }`}>
                                         {claim.status}
                                      </span>
                                   </td>
                                   <td className="py-5 px-8 text-right">
                                      <button className="p-2 text-slate-400 hover:text-amber-600 transition-all">
                                         <MoreVertical className="w-5 h-5" />
                                      </button>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === "invoices" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[700px]">
                    <div className="lg:col-span-4 bg-white rounded-[32px] border border-slate-200 flex flex-col overflow-hidden shadow-sm">
                       <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                          <div className="relative">
                             <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                             <input 
                               type="text" 
                               value={searchQuery}
                               onChange={(e) => setSearchQuery(e.target.value)}
                               placeholder="Search invoices..." 
                               className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-amber-500 shadow-sm" 
                             />
                          </div>
                       </div>
                       <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                          {filteredInvoices.map(inv => (
                            <div 
                              key={inv.id} 
                              onClick={() => setSelectedInvoiceId(inv.id)}
                              className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                                selectedInvoiceId === inv.id ? 'bg-amber-50 border-amber-200 shadow-lg shadow-amber-100' : 'bg-white border-slate-100 hover:border-slate-200'
                              }`}
                            >
                               <div className="flex justify-between items-start mb-2">
                                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{inv.id}</span>
                                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                     {inv.status}
                                  </span>
                               </div>
                               <h4 className="font-black text-slate-800 text-sm leading-tight mb-1 truncate">{inv.patientName}</h4>
                               <div className="flex justify-between items-center mt-3">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{inv.date.slice(0, 10)}</span>
                                  <span className="text-sm font-black text-slate-900">{inv.amount} <span className="text-[10px] text-slate-400 font-bold uppercase">SAR</span></span>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="lg:col-span-8 bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm flex flex-col relative">
                       {selectedInvoiceId ? (
                         <div className="h-full flex flex-col">
                            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                               <div>
                                  <h3 className="text-xl font-black text-slate-900 tracking-tight">{isAr ? "تفاصيل الفاتورة" : "Invoice Ledger Detail"}</h3>
                                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{selectedInvoiceId}</p>
                               </div>
                               <div className="flex gap-3">
                                  <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-600 shadow-sm transition-all">
                                     <Printer className="w-5 h-5" />
                                  </button>
                                  <button className="px-6 py-2.5 bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-100 hover:bg-amber-700 transition-all active:scale-95">
                                     {isAr ? "تحصيل مالي" : "Post Payment"}
                                  </button>
                               </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-12">
                                  <div>
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">{isAr ? "المريض" : "Patient Info"}</label>
                                     <p className="font-black text-slate-800 text-lg">{processedInvoices.find(i => i.id === selectedInvoiceId)?.patientName}</p>
                                     <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">MRN: {processedInvoices.find(i => i.id === selectedInvoiceId)?.mrn}</p>
                                  </div>
                                  <div className="text-right">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">{isAr ? "المصدر" : "Billing Source"}</label>
                                     <p className="font-black text-slate-800 text-sm">Emergency Department (ER)</p>
                                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Visit ID: V-10029</p>
                                  </div>
                               </div>
                               <div className="space-y-4">
                                  <div className="p-6 bg-slate-50 rounded-[28px] border border-slate-100 flex justify-between items-center">
                                     <div>
                                        <h5 className="font-black text-slate-800 text-sm">Consultation - Cardiology</h5>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Service Code: 99203</p>
                                     </div>
                                     <span className="font-black text-slate-900">450.00 SAR</span>
                                  </div>
                                  <div className="p-6 bg-slate-50 rounded-[28px] border border-slate-100 flex justify-between items-center">
                                     <div>
                                        <h5 className="font-black text-slate-800 text-sm">Chest X-Ray PA View</h5>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Service Code: 71045</p>
                                     </div>
                                     <span className="font-black text-slate-900">320.00 SAR</span>
                                  </div>
                               </div>
                               <div className="mt-12 pt-12 border-t border-slate-100 flex justify-between items-end">
                                  <div className="space-y-1">
                                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tax (VAT 15%)</p>
                                     <p className="font-black text-slate-600 text-sm">115.50 SAR</p>
                                  </div>
                                  <div className="text-right">
                                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{isAr ? "المجموع النهائي" : "Grand Total"}</p>
                                     <p className="text-3xl font-black text-slate-900 tracking-tight">{processedInvoices.find(i => i.id === selectedInvoiceId)?.amount} <span className="text-sm font-bold text-slate-400">SAR</span></p>
                                  </div>
                               </div>
                            </div>
                         </div>
                       ) : (
                         <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                            <Receipt className="w-24 h-24 mb-6 opacity-20" />
                            <p className="text-xs font-black uppercase tracking-[0.3em]">{isAr ? "اختر فاتورة للمراجعة" : "Select Invoice to Review"}</p>
                         </div>
                       )}
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === "ledger" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                 <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                       <div>
                          <h2 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight">{isAr ? "السجل المالي الموحد" : "Unified Financial Ledger"}</h2>
                          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{isAr ? "مراقبة التدفقات النقدية والعمليات المصرفية" : "Cash flow monitoring & banking operations"}</p>
                       </div>
                       <div className="flex gap-4">
                          <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg">
                             <FileOutput className="w-4 h-4" />
                             <span>{isAr ? "تصدير السجل" : "Export Ledger"}</span>
                          </button>
                       </div>
                    </div>
                    <div className="overflow-x-auto">
                       <table className="w-full text-left">
                          <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                             <tr>
                                <th className="py-5 px-8">{isAr ? "رقم العملية" : "TXN ID"}</th>
                                <th className="py-5 px-8">{isAr ? "التاريخ" : "Date"}</th>
                                <th className="py-5 px-8">{isAr ? "الوصف" : "Description"}</th>
                                <th className="py-5 px-8">{isAr ? "الفئة" : "Category"}</th>
                                <th className="py-5 px-8">{isAr ? "المبلغ" : "Amount"}</th>
                                <th className="py-5 px-8 text-right">{isAr ? "الرصيد" : "Balance"}</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                             {[
                                { id: "TXN-44921", date: "2024-05-20 10:22", desc: "Patient Payment - Invoice INV-1001", cat: "Collections", amount: "+450.00", bal: "12,450.00", type: "credit" },
                                { id: "TXN-44922", date: "2024-05-20 11:45", desc: "Insurance Remittance - Bupa Batch #88", cat: "Claims", amount: "+42,800.00", bal: "55,250.00", type: "credit" },
                                { id: "TXN-44923", date: "2024-05-20 14:10", desc: "Refund - Overpayment MRN-9982", cat: "Refunds", amount: "-120.00", bal: "55,130.00", type: "debit" },
                                { id: "TXN-44924", date: "2024-05-20 16:30", desc: "Cash Collection - Pharmacy Shift A", cat: "Collections", amount: "+3,150.00", bal: "58,280.00", type: "credit" },
                             ].map((txn, i) => (
                                <tr key={txn.id} className="group hover:bg-slate-50/50 transition-all">
                                   <td className="py-5 px-8 font-mono text-[10px] font-black text-amber-600">{txn.id}</td>
                                   <td className="py-5 px-8 text-xs font-bold text-slate-400 whitespace-nowrap">{txn.date}</td>
                                   <td className="py-5 px-8 text-sm font-black text-slate-700">{txn.desc}</td>
                                   <td className="py-5 px-8">
                                      <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest">{txn.cat}</span>
                                   </td>
                                   <td className={`py-5 px-8 text-sm font-black ${txn.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>{txn.amount}</td>
                                   <td className="py-5 px-8 text-right font-black text-slate-900 text-sm">{txn.bal}</td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
              </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
}
