import React, { useState } from "react";
import { 
  ClipboardX, FileText, UserMinus, 
  Printer, ArrowRightLeft, ShieldAlert, Plus
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
  onClose?: () => void;
}

export default function MortuaryDashboard({ language, onClose }: Props) {
  const isAr = language === "ar";

  const [deaths] = useState([
    { id: "MRT-01", patient: "Ali Hassan", mrn: "P-9921", timeOfDeath: "02:15 AM", cause: "Cardiac Arrest", status: "In Morgue" },
    { id: "MRT-02", patient: "Fatima Noor", mrn: "P-4102", timeOfDeath: "05:45 AM", cause: "Septic Shock", status: "Handed Over" },
  ]);

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
            <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
              <ClipboardX className="w-7 h-7 text-slate-700" />
              {isAr ? "قسم الوفيات (Mortuary)" : "Mortuary & Expiry Management"}
            </h2>
            <p className="text-slate-500 font-medium mt-1">
              {isAr ? "إدارة حالات الوفاة، التقارير، وتصاريح الدفن" : "Manage expiries, death reports, and burial permits"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                 <UserMinus className="w-5 h-5 text-slate-600" />
                 {isAr ? "سجل الوفيات" : "Expiry Registry"}
               </h3>
               <button className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm">
                 {isAr ? "تسجيل وفاة جديدة" : "Register New Expiry"}
               </button>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm" dir={isAr ? "rtl" : "ltr"}>
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-bold">{isAr ? "المتوفي" : "Deceased"}</th>
                      <th className="px-4 py-3 font-bold">{isAr ? "رقم الملف" : "MRN"}</th>
                      <th className="px-4 py-3 font-bold">{isAr ? "وقت الوفاة" : "Time of Death"}</th>
                      <th className="px-4 py-3 font-bold">{isAr ? "السبب" : "Cause"}</th>
                      <th className="px-4 py-3 font-bold">{isAr ? "الحالة" : "Status"}</th>
                      <th className="px-4 py-3 font-bold text-center">{isAr ? "إجراءات" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {deaths.map((d, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 font-bold text-slate-800">{d.patient}</td>
                        <td className="px-4 py-3 font-mono text-slate-600">{d.mrn}</td>
                        <td className="px-4 py-3 text-slate-600">{d.timeOfDeath}</td>
                        <td className="px-4 py-3 text-slate-600 truncate max-w-[120px]">{d.cause}</td>
                        <td className="px-4 py-3">
                           <span className={`px-2 py-1 rounded text-[10px] font-bold ${d.status === 'In Morgue' ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-emerald-700'}`}>
                             {d.status}
                           </span>
                        </td>
                        <td className="px-4 py-3 flex gap-2 justify-center flex-wrap">
                           <button onClick={() => window.dispatchEvent(new CustomEvent('openGenericModal', { detail: { titleEn: "Printing Death Certificate", titleAr: "Printing Death Certificate", type: "form" } }))} className="bg-slate-100 text-slate-600 hover:bg-slate-200 px-2 py-1.5 rounded text-[10px] font-bold transition flex items-center gap-1">
                             <Printer className="w-3 h-3" /> {isAr ? "شهادة وفاة" : "Certificate"}
                           </button>
                           <button onClick={() => window.dispatchEvent(new CustomEvent('openGenericModal', { detail: { titleEn: "Body handed over", titleAr: "Body handed over", type: "form" } }))} className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-2 py-1.5 rounded text-[10px] font-bold transition flex items-center gap-1">
                             <ArrowRightLeft className="w-3 h-3" /> {isAr ? "تسليم الجثة" : "Handover"}
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        </div>

        <div className="space-y-4">
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-4">{isAr ? "الإجراءات والتقارير" : "Actions & Reports"}</h3>
             <div className="space-y-3">
               <button className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 p-3 rounded-xl flex flex-wrap items-center gap-2 sm:gap-3 transition border border-rose-200">
                 <ShieldAlert className="w-5 h-5" />
                 <span className="text-sm font-bold text-left flex-1">{isAr ? "تقرير الوفاة السريري" : "Clinical Death Report"}</span>
               </button>
               <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex flex-wrap items-center gap-2 sm:gap-3 transition border border-slate-200">
                 <Printer className="w-5 h-5 text-slate-500" />
                 <span className="text-sm font-bold text-left flex-1">{isAr ? "طباعة تصريح الدفن" : "Print Burial Permit"}</span>
               </button>
               <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex flex-wrap items-center gap-2 sm:gap-3 transition border border-slate-200">
                 <FileText className="w-5 h-5 text-indigo-500" />
                 <span className="text-sm font-bold text-left flex-1">{isAr ? "سجل الوفيات الشهري" : "Monthly Mortality Registry"}</span>
               </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
