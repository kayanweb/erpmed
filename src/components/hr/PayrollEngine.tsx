import React from "react";
import { DollarSign, Download, Filter, FileText, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function PayrollEngine({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";
  
  return (
    <div className="h-full flex flex-col p-6 sm:p-8 overflow-hidden bg-slate-50" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{isAr ? "محرك الرواتب" : "Payroll Engine"}</h2>
          <p className="text-sm font-bold text-slate-500 mt-1">{isAr ? "إدارة مسيرات الرواتب والمكافآت والخصومات" : "Manage payrolls, bonuses, and deductions"}</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm">
          <FileText className="w-4 h-4" />
          {isAr ? "إنشاء مسير جديد" : "Generate Payroll"}
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-white border border-slate-200 rounded-[24px] shadow-sm p-2">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "الفترة" : "Period"}</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "إجمالي الرواتب" : "Total Amount"}</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "عدد الموظفين" : "Employees"}</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "الحالة" : "Status"}</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">{isAr ? "إجراء" : "Action"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-black text-slate-800">July 2026</td>
              <td className="p-4 font-black text-slate-700">$1,245,000</td>
              <td className="p-4 text-sm font-bold text-slate-600">342</td>
              <td className="p-4"><span className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest">Draft</span></td>
              <td className="p-4 text-right">
                <button className="text-indigo-600 font-bold text-xs uppercase underline hover:text-indigo-800">{isAr ? "مراجعة واعتماد" : "Review & Approve"}</button>
              </td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-black text-slate-800">June 2026</td>
              <td className="p-4 font-black text-slate-700">$1,210,500</td>
              <td className="p-4 text-sm font-bold text-slate-600">338</td>
              <td className="p-4"><span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest">Paid</span></td>
              <td className="p-4 text-right">
                <button className="text-slate-600 font-bold text-xs uppercase underline hover:text-slate-800">{isAr ? "تحميل التقرير" : "Download Report"}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}