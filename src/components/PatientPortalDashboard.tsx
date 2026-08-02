import React, { useState } from "react";
import { User, Activity, FileText, Pill, CreditCard, Calendar, Search, Filter, ArrowRight, Download, FileDigit, Plus } from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
  onClose?: () => void;
}

export default function PatientPortalDashboard({ language, onClose }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"appointments" | "prescriptions" | "reports" | "billing">("appointments");

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm group shrink-0"
          >
             <Plus className="w-6 h-6 rotate-45 group-hover:scale-110 transition-transform" />
          </button>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2 leading-tight">
              <User className="w-5 h-5 sm:w-8 sm:h-8 text-teal-600 bg-teal-100 p-1.5 rounded-xl" />
              {isAr ? "بوابة المريض (Patient Portal)" : "Patient Portal"}
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              {isAr ? "استعراض ملف المريض، المواعيد، النتائج، والوصفات الطبية" : "View patient profile, appointments, results, and prescriptions"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1 mb-6 overflow-x-auto">
        {[
          { id: "appointments", labelAr: "مواعيدي", labelEn: "My Appointments", icon: Calendar },
          { id: "prescriptions", labelAr: "وصفاتي الطبية", labelEn: "Prescriptions", icon: Pill },
          { id: "reports", labelAr: "التقارير والنتائج", labelEn: "Reports & Results", icon: FileText },
          { id: "billing", labelAr: "الفواتير", labelEn: "Billing", icon: CreditCard },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2 text-sm font-bold rounded-lg transition whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-teal-100 text-teal-700"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {isAr ? tab.labelAr : tab.labelEn}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[400px]">
        {activeTab === "appointments" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-lg">{isAr ? "المواعيد القادمة" : "Upcoming Appointments"}</h3>
              <button className="text-teal-600 font-bold text-sm hover:underline">{isAr ? "حجز موعد جديد" : "Book New Appointment"}</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               <div className="border border-slate-200 rounded-xl p-5 bg-white hover:shadow-md transition">
                 <div className="flex justify-between items-start mb-4">
                   <div className="bg-teal-50 text-teal-700 p-2 rounded-lg text-center min-w-[60px]">
                     <p className="text-xs font-bold uppercase">Oct</p>
                     <p className="text-lg sm:text-2xl font-black">28</p>
                   </div>
                   <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">Upcoming</span>
                 </div>
                 <h4 className="font-bold text-slate-800 text-lg mb-1">Cardiology Follow-up</h4>
                 <p className="text-sm text-slate-500 mb-4">Dr. Sarah Ahmed</p>
                 <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-lg transition">
                   {isAr ? "تفاصيل الموعد" : "View Details"}
                 </button>
               </div>
            </div>
          </div>
        )}

        {activeTab === "prescriptions" && (
          <div className="space-y-6">
             <h3 className="font-bold text-slate-800 text-lg mb-4">{isAr ? "الوصفات الطبية الفعالة" : "Active Prescriptions"}</h3>
             <div className="border border-slate-200 rounded-xl overflow-hidden">
               <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                 <div>
                   <p className="font-bold text-slate-800">Prescription #RX-8842</p>
                   <p className="text-xs text-slate-500 mt-1">Issued: Oct 20, 2023 by Dr. Laila</p>
                 </div>
                 <button className="text-teal-600 hover:bg-teal-50 p-2 rounded-lg transition"><Download className="w-5 h-5"/></button>
               </div>
               <div className="p-4 bg-white">
                 <div className="flex items-center gap-2 sm:gap-4 flex-wrap  py-2 border-b border-slate-100 last:border-0">
                   <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Pill className="w-5 h-5"/></div>
                   <div className="flex-1">
                     <p className="font-bold text-slate-800">Amoxicillin 500mg</p>
                     <p className="text-sm text-slate-500">1 capsule every 8 hours for 7 days</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-2 sm:gap-4 flex-wrap  py-2 border-b border-slate-100 last:border-0">
                   <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Pill className="w-5 h-5"/></div>
                   <div className="flex-1">
                     <p className="font-bold text-slate-800">Panadol Advance</p>
                     <p className="text-sm text-slate-500">2 tablets when needed (fever/pain)</p>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-6">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-slate-800 text-lg">{isAr ? "النتائج والتقارير" : "Results & Reports"}</h3>
               <div className="relative w-64">
                 <Search className={`absolute ${isAr ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                 <input type="text" placeholder={isAr ? "بحث..." : "Search..."} className={`w-full border border-slate-200 rounded-lg py-1.5 ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'} text-sm`} />
               </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 flex items-start gap-4 hover:bg-slate-50 transition cursor-pointer">
                  <div className="p-3 bg-rose-100 text-rose-600 rounded-lg"><Activity className="w-6 h-6"/></div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800">Complete Blood Count (CBC)</h4>
                    <p className="text-sm text-slate-500 mt-1">Oct 20, 2023</p>
                  </div>
                  <Download className="w-5 h-5 text-slate-400" />
                </div>
                <div className="border border-slate-200 rounded-xl p-4 flex items-start gap-4 hover:bg-slate-50 transition cursor-pointer">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg"><FileDigit className="w-6 h-6"/></div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800">Chest X-Ray Report</h4>
                    <p className="text-sm text-slate-500 mt-1">Oct 15, 2023</p>
                  </div>
                  <Download className="w-5 h-5 text-slate-400" />
                </div>
             </div>
          </div>
        )}

        {activeTab === "billing" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-6 text-white flex justify-between items-center shadow-lg shadow-teal-600/20">
              <div>
                <p className="text-teal-100 text-sm font-bold mb-1">{isAr ? "الرصيد المستحق" : "Outstanding Balance"}</p>
                <p className="text-4xl font-black">0.00 <span className="text-xl">SAR</span></p>
              </div>
              <CreditCard className="w-12 h-12 text-white/30" />
            </div>
            
            <h3 className="font-bold text-slate-800 text-lg mt-8 mb-4">{isAr ? "سجل الفواتير" : "Invoice History"}</h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
               <table className="w-full text-sm text-left">
                 <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                   <tr>
                     <th className="px-4 py-3">{isAr ? "الفاتورة" : "Invoice ID"}</th>
                     <th className="px-4 py-3">{isAr ? "التاريخ" : "Date"}</th>
                     <th className="px-4 py-3">{isAr ? "المبلغ" : "Amount"}</th>
                     <th className="px-4 py-3">{isAr ? "الحالة" : "Status"}</th>
                     <th className="px-4 py-3 text-center">{isAr ? "تحميل" : "Download"}</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   <tr className="bg-white">
                     <td className="px-4 py-3 font-medium">INV-2023-089</td>
                     <td className="px-4 py-3 text-slate-600">Oct 20, 2023</td>
                     <td className="px-4 py-3 font-bold">150.00 SAR</td>
                     <td className="px-4 py-3"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold">Paid</span></td>
                     <td className="px-4 py-3 text-center"><button className="text-teal-600"><Download className="w-4 h-4 mx-auto"/></button></td>
                   </tr>
                 </tbody>
               </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
