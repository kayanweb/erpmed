import React, { useState } from "react";
import { 
  Droplet, Activity, Clock, Scale, AlertTriangle, 
  Settings, CheckCircle2, FileText, HeartPulse, ClipboardList
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import DepartmentTasks from "./DepartmentTasks";

interface Props {
  language: "ar" | "en";
}

export default function DialysisDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"machines" | "schedule" | "tasks">("machines");

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Droplet className="w-5 h-5 sm:w-8 sm:h-8 text-sky-500 bg-sky-100 p-1.5 rounded-xl" />
            {isAr ? "الغسيل الكلوي (Dialysis / Nephrology)" : "Hemodialysis Unit"}
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {isAr ? "مراقبة جلسات الغسيل وآلات الديلزة" : "Dialysis sessions and machine monitoring"}
          </p>
        </div>
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1">
          <button 
            onClick={() => setActiveTab("machines")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition ${activeTab === "machines" ? "bg-sky-100 text-sky-700" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "شاشات الآلات" : "Machine Monitors"}
          </button>
          <button 
            onClick={() => setActiveTab("schedule")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition ${activeTab === "schedule" ? "bg-sky-100 text-sky-700" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "جدول الجلسات" : "Sessions Schedule"}
          </button>
          <button 
            onClick={() => setActiveTab("tasks")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition ${activeTab === "tasks" ? "bg-sky-100 text-sky-700" : "text-slate-500 hover:bg-slate-50"} flex items-center gap-1.5`}
          >
            <ClipboardList className="w-4 h-4" />
            {isAr ? "المهام السريرية" : "Clinical Tasks"}
          </button>
        </div>
      </div>

      {activeTab === "tasks" ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200">
          <DepartmentTasks language={language} departmentId="dialysis" departmentName={isAr ? "قسم الغسيل الكلوي" : "Dialysis Unit"} />
        </div>
      ) : activeTab === "machines" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { id: "MAC-01", patient: "Ali Hassan", status: "Running", progress: 65, timeRemaining: "1h 15m", bp: "110/70", uf: "1.2 L" },
             { id: "MAC-02", patient: "Sarah Youssef", status: "Running", progress: 30, timeRemaining: "2h 45m", bp: "125/80", uf: "0.5 L" },
             { id: "MAC-03", patient: "Idle", status: "Ready", progress: 0, timeRemaining: "-", bp: "-", uf: "-" },
           ].map((mac, idx) => (
             <div key={idx} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-4">
                   <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${mac.status === 'Running' ? 'bg-sky-50 text-sky-600 border border-sky-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                         <Settings className={`w-6 h-6 ${mac.status === 'Running' ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
                      </div>
                      <div>
                         <h3 className="font-black text-lg text-slate-800">{mac.id}</h3>
                         <p className="text-xs font-bold text-slate-500">{mac.patient}</p>
                      </div>
                   </div>
                   <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${mac.status === 'Running' ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {mac.status}
                   </span>
                </div>

                <div className="space-y-4">
                   <div>
                      <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                         <span>{isAr ? "التقدم" : "Progress"}</span>
                         <span>{mac.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                         <div className={`h-2 rounded-full ${mac.status === 'Running' ? 'bg-sky-500' : 'bg-slate-300'}`} style={{ width: `${mac.progress}%` }}></div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                         <span className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? "الوقت المتبقي" : "Time Left"}</span>
                         <span className="font-black text-slate-800">{mac.timeRemaining}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                         <span className="block text-[10px] font-bold text-slate-400 uppercase">{isAr ? "السحب (UF)" : "UF Volume"}</span>
                         <span className="font-black text-slate-800">{mac.uf}</span>
                      </div>
                   </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2">
                   <button className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition">
                      {isAr ? "تفاصيل" : "Details"}
                   </button>
                   <button className="py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition shadow-sm">
                      {isAr ? "سجل العلامات" : "Log Vitals"}
                   </button>
                </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
           <h3 className="font-bold text-lg text-slate-800 mb-6">{isAr ? "جدول غسيل الكلى الأسبوعي" : "Weekly Dialysis Schedule"}</h3>
           <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-sm text-left">
             <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
               <tr>
                 <th className="px-4 py-3">{isAr ? "المريض" : "Patient"}</th>
                 <th className="px-4 py-3">{isAr ? "الأيام" : "Days"}</th>
                 <th className="px-4 py-3">{isAr ? "الوقت" : "Shift"}</th>
                 <th className="px-4 py-3">{isAr ? "نوع الدخول" : "Access"}</th>
                 <th className="px-4 py-3 text-center">{isAr ? "الوزن الجاف" : "Dry Weight"}</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               <tr className="hover:bg-slate-50 transition">
                 <td className="px-4 py-4 font-bold text-slate-800">Omar Ahmed</td>
                 <td className="px-4 py-4 text-slate-600 font-medium">Mon/Wed/Sat</td>
                 <td className="px-4 py-4 font-bold text-sky-600">Morning (08:00)</td>
                 <td className="px-4 py-4 text-slate-600">AV Fistula (Right)</td>
                 <td className="px-4 py-4 text-center font-mono font-bold">72.5 kg</td>
               </tr>
               <tr className="hover:bg-slate-50 transition">
                 <td className="px-4 py-4 font-bold text-slate-800">Laila Mahmoud</td>
                 <td className="px-4 py-4 text-slate-600 font-medium">Sun/Tue/Thu</td>
                 <td className="px-4 py-4 font-bold text-sky-600">Afternoon (13:00)</td>
                 <td className="px-4 py-4 text-slate-600">Permcath</td>
                 <td className="px-4 py-4 text-center font-mono font-bold">65.0 kg</td>
               </tr>
             </tbody>
           </table>
</div>
        </div>
      )}
    </div>
  );
}
