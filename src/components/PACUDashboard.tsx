import React, { useState } from "react";
import { 
  Bed, HeartPulse, Activity, Droplet, 
  Brain, FileText, ArrowRightLeft, ShieldAlert
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

export default function PACUDashboard({ language }: Props) {
  const isAr = language === "ar";

  const [patients] = useState([
    { id: "P-5591", name: "Khaled Youssef", procedure: "Appendectomy", arrival: "10:15 AM", status: "Awake", painScore: 3, aldrete: 9 },
    { id: "P-1120", name: "Mona Ali", procedure: "Cholecystectomy", arrival: "11:30 AM", status: "Drowsy", painScore: 6, aldrete: 6 },
  ]);

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Bed className="w-7 h-7 text-indigo-500" />
            {isAr ? "غرفة الإفاقة (PACU)" : "Recovery Room (PACU)"}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {isAr ? "مراقبة المرضى ما بعد التخدير والعمليات" : "Post-anesthesia care and monitoring"}
          </p>
        </div>
        <button onClick={() => toast.success(isAr ? "تم استقبال مريض" : "Patient Received from OR")} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition">
          {isAr ? "استقبال مريض من العمليات" : "Receive Patient from OR"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">{isAr ? "المرضى تحت الإفاقة" : "Patients in PACU"}</h3>
            <div className="space-y-4">
              {patients.map(p => (
                <div key={p.id} className="border border-slate-200 rounded-xl p-4 hover:border-indigo-300 transition bg-slate-50/50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{p.name} <span className="text-xs font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200 ml-2">{p.id}</span></h4>
                      <p className="text-sm text-slate-600 font-medium mt-1">{p.procedure} • Arr: {p.arrival}</p>
                    </div>
                    <div className="text-right">
                       <span className={`px-2 py-1 rounded text-xs font-bold ${p.aldrete >= 8 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                         Aldrete: {p.aldrete}/10
                       </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button onClick={() => toast.success(isAr ? "تم تسجيل العلامات الحيوية" : "Vitals logged")} className="text-xs bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-3 py-2 rounded-lg transition flex items-center gap-1.5">
                       <HeartPulse className="w-4 h-4 text-rose-500" /> {isAr ? "العلامات الحيوية" : "Vitals"}
                    </button>
                    <button onClick={() => toast.success(isAr ? "تم تحديث مستوى الألم" : "Pain score updated")} className="text-xs bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-3 py-2 rounded-lg transition flex items-center gap-1.5">
                       <Activity className="w-4 h-4 text-amber-500" /> {isAr ? "تقييم الألم" : "Pain Score"} ({p.painScore}/10)
                    </button>
                    <button onClick={() => toast.success(isAr ? "تم تسجيل السوائل" : "Fluids logged")} className="text-xs bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-3 py-2 rounded-lg transition flex items-center gap-1.5">
                       <Droplet className="w-4 h-4 text-blue-500" /> {isAr ? "السوائل" : "Fluids I/O"}
                    </button>
                    <button onClick={() => toast.success(isAr ? "تم تحديث مستوى الوعي" : "Consciousness updated")} className="text-xs bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-3 py-2 rounded-lg transition flex items-center gap-1.5">
                       <Brain className="w-4 h-4 text-purple-500" /> {isAr ? "مستوى الوعي" : "Consciousness"}
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end gap-2">
                     <button className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-4 py-2 rounded-lg transition flex items-center gap-1.5">
                       <ArrowRightLeft className="w-4 h-4" /> {isAr ? "نقل لجناح التنويم" : "Transfer to Ward"}
                     </button>
                     <button className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-4 py-2 rounded-lg transition flex items-center gap-1.5">
                       <ShieldAlert className="w-4 h-4" /> {isAr ? "نقل للعناية المركزة" : "Transfer to ICU"}
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">{isAr ? "التقارير والمؤشرات" : "Reports & Metrics"}</h3>
            <div className="space-y-3">
              <button className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition flex flex-wrap items-center gap-2 sm:gap-3">
                <FileText className="w-5 h-5 text-indigo-500" />
                <span className="text-sm text-left flex-1">{isAr ? "تقرير الإفاقة الشامل" : "Comprehensive PACU Report"}</span>
              </button>
              <button className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition flex flex-wrap items-center gap-2 sm:gap-3">
                <Activity className="w-5 h-5 text-teal-500" />
                <span className="text-sm text-left flex-1">{isAr ? "معايير خروج المريض (Aldrete)" : "Discharge Criteria (Aldrete)"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
