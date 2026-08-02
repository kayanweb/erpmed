import React from "react";
import { BadgeCheck, Clock, ShieldAlert, User, Activity, AlertTriangle, MapPin } from "lucide-react";
import { Patient } from "../types";

interface Props {
  patient: Patient;
  language: "ar" | "en";
  className?: string;
  showVitals?: boolean;
}

export const PatientClinicalHeader: React.FC<Props> = ({ patient, language, className = "", showVitals = true }) => {
  const isAr = language === "ar";
  
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl shadow-sm p-3 sm:p-4 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 ${className}`} dir={isAr ? "rtl" : "ltr"}>
      {/* Patient Basic Identity & Demographics */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="relative shrink-0">
          <img 
            src={`https://i.pravatar.cc/150?u=${patient.id}`} 
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl shadow-sm border-2 border-white ring-1 ring-slate-100 object-cover" 
            alt="patient" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-md border-2 border-white shadow-sm">
            <BadgeCheck className="w-3 h-3" />
          </div>
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-0.5">
            <h2 
              onClick={() => window.dispatchEvent(new CustomEvent("openPatientChart", { detail: { patientId: patient.mrn || patient.id, patientName: isAr ? patient.nameAr : patient.nameEn } }))}
              className="text-lg font-black text-slate-900 truncate hover:text-indigo-600 cursor-pointer transition leading-none"
              title={isAr ? "انقر لفتح الملف الطبي الكامل" : "Click to open full medical chart"}
            >
              {isAr ? patient.nameAr : patient.nameEn}
            </h2>
            <div className="flex items-center gap-2">
              <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md text-[10px] font-black font-mono border border-slate-200 shadow-3xs uppercase tracking-wider">
                MRN: {patient.mrn || patient.id}
              </span>
              <span className="text-[10px] font-black text-slate-400 font-mono">
                DOB: 1980-05-15 (45Y)
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] font-bold text-slate-500">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{isAr ? (patient.gender === "male" ? "ذكر" : "أنثى") : (patient.gender?.toUpperCase() || "MALE")}</span>
              <span className="text-slate-300">|</span>
              <span className="text-indigo-600">{isAr ? "د. أحمد علي" : "Dr. Ahmed Ali"}</span>
            </div>
            
            <div className="flex items-center gap-1.5 bg-indigo-50/50 px-2 py-0.5 rounded-md border border-indigo-100/50">
               <MapPin className="w-3.5 h-3.5 text-indigo-400" />
               <span className="text-indigo-700 text-[10px] font-black uppercase">
                  {patient.currentClinicalLocation || (isAr ? "جناح 4 - سرير 12" : "WARD 4 - BED 12")}
               </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
               <Clock className="w-3.5 h-3.5 text-slate-400" />
               <span>ADM: 2024-05-12</span>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Alerts & Status (High Density) */}
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <div className="flex items-center gap-1.5 bg-rose-50 text-rose-700 px-2.5 py-1 rounded-lg border border-rose-100 shadow-3xs">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black uppercase tracking-tight">{isAr ? "حساسية: بنسيلين" : "ALLERGY: PENICILLIN"}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg border border-amber-100 shadow-3xs">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black uppercase tracking-tight">{isAr ? "خطر سقوط: عالي" : "FALL RISK: HIGH"}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-900 text-white px-2.5 py-1 rounded-lg border border-slate-800 shadow-sm">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-black uppercase tracking-tight">{isAr ? "الإنعاش: كامل (Full Code)" : "CODE: FULL"}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-100 shadow-3xs">
          <BadgeCheck className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black uppercase tracking-tight">{isAr ? "احتياطات: تلامس" : "PRECAUTION: CONTACT"}</span>
        </div>
      </div>

      {/* Real-time Vitals Bar */}
      {showVitals && (
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100 shrink-0">
          {[
            { label: "TEMP", value: "37.2", unit: "°C", color: "text-blue-600", bg: "bg-blue-100/50" },
            { label: "HR", value: "78", unit: "bpm", color: "text-rose-600", bg: "bg-rose-100/50" },
            { label: "BP", value: "120/80", unit: "", color: "text-indigo-600", bg: "bg-indigo-100/50" },
            { label: "SpO2", value: "98", unit: "%", color: "text-emerald-600", bg: "bg-emerald-100/50" },
          ].map((v, i) => (
            <div key={i} className="flex flex-col items-center justify-center min-w-[58px] px-1">
              <span className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">{v.label}</span>
              <div className="flex items-baseline gap-0.5">
                <span className={`text-xs font-black font-mono ${v.color}`}>{v.value}</span>
                <span className="text-[8px] font-bold text-slate-400">{v.unit}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
