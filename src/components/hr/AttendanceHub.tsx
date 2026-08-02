import React from "react";
import { Clock, Calendar, CheckCircle2, AlertCircle, RefreshCcw } from "lucide-react";
import { motion } from "motion/react";

export default function AttendanceHub({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";
  
  return (
    <div className="h-full flex flex-col p-6 sm:p-8 overflow-hidden bg-slate-50" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{isAr ? "مركز الحضور والانصراف" : "Attendance Hub"}</h2>
          <p className="text-sm font-bold text-slate-500 mt-1">{isAr ? "مراقبة البصمة والمناوبات اليومية" : "Monitor daily check-ins and shifts"}</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
          <RefreshCcw className="w-4 h-4" />
          {isAr ? "مزامنة البصمة" : "Sync Biometrics"}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
         <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex flex-col justify-center">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{isAr ? "حضور اليوم" : "Present Today"}</h4>
            <div className="text-4xl font-black text-emerald-600">312</div>
         </div>
         <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex flex-col justify-center">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{isAr ? "غياب" : "Absent"}</h4>
            <div className="text-4xl font-black text-rose-600">14</div>
         </div>
         <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex flex-col justify-center">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{isAr ? "تأخير" : "Late"}</h4>
            <div className="text-4xl font-black text-amber-500">22</div>
         </div>
         <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex flex-col justify-center">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{isAr ? "إجازات نشطة" : "On Leave"}</h4>
            <div className="text-4xl font-black text-indigo-600">45</div>
         </div>
      </div>

      <div className="flex-1 overflow-auto bg-white border border-slate-200 rounded-[24px] shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "الموظف" : "Employee"}</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "المناوبة" : "Shift"}</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "حضور" : "Check-in"}</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "انصراف" : "Check-out"}</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "الحالة" : "Status"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-bold text-slate-800">Sarah Khaled</td>
              <td className="p-4 text-sm font-medium text-slate-600">Morning (08:00 - 16:00)</td>
              <td className="p-4 font-black text-emerald-600">07:55 AM</td>
              <td className="p-4 font-black text-slate-400">--:--</td>
              <td className="p-4"><span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-xs font-bold uppercase">Present</span></td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-bold text-slate-800">Ahmed Sami</td>
              <td className="p-4 text-sm font-medium text-slate-600">Morning (08:00 - 16:00)</td>
              <td className="p-4 font-black text-amber-600">08:25 AM</td>
              <td className="p-4 font-black text-slate-400">--:--</td>
              <td className="p-4"><span className="bg-amber-50 text-amber-600 px-2 py-1 rounded text-xs font-bold uppercase">Late</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}