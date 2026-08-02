import React from "react";
import { ShieldAlert, CheckCircle, AlertTriangle, Scale, Target, ActivitySquare, Plus } from "lucide-react";

interface Props {
  language: "ar" | "en";
  onClose?: () => void;
}

export default function QualityDashboard({ language, onClose }: Props) {
  const isAr = language === "ar";
  
  return (
    <div className="p-6 bg-slate-50 min-h-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap  mb-8">
        <button 
          onClick={onClose}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm group shrink-0"
        >
           <Plus className="w-6 h-6 rotate-45 group-hover:scale-110 transition-transform" />
        </button>
        <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-200 shrink-0">
          <Scale className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
            {isAr ? "الجودة والامتثال والمخاطر" : "Quality, Risk & Compliance (QMS)"}
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">
            Level 12 - Incidents, CAPA, JCI, Patient Safety
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
           <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-rose-600 mb-4">
              <ShieldAlert className="w-5 h-5" />
              <span className="font-black text-[10px] uppercase tracking-widest">Open Incidents</span>
           </div>
           <p className="text-4xl font-black text-slate-900 mb-2">12</p>
           <p className="text-xs font-bold text-slate-400">3 High Severity (Sentinel)</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
           <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-emerald-600 mb-4">
              <CheckCircle className="w-5 h-5" />
              <span className="font-black text-[10px] uppercase tracking-widest">CAPA Actions</span>
           </div>
           <p className="text-4xl font-black text-slate-900 mb-2">45</p>
           <p className="text-xs font-bold text-slate-400">85% Resolution Rate</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
           <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-blue-600 mb-4">
              <Target className="w-5 h-5" />
              <span className="font-black text-[10px] uppercase tracking-widest">JCI Compliance</span>
           </div>
           <p className="text-4xl font-black text-slate-900 mb-2">98.2%</p>
           <p className="text-xs font-bold text-slate-400">Next Audit: 12 Nov</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
         <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-6">
               <AlertTriangle className="w-5 h-5 text-amber-500" />
               Recent Incidents (OVR)
            </h3>
            <div className="space-y-4">
               {[
                 { id: "OVR-293", type: "Medication Error", severity: "High", date: "Today, 10:30 AM" },
                 { id: "OVR-292", type: "Patient Fall", severity: "Medium", date: "Yesterday, 14:15 PM" },
                 { id: "OVR-291", type: "Equipment Failure", severity: "Low", date: "24 Jun, 09:00 AM" },
               ].map(ovr => (
                 <div key={ovr.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                       <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{ovr.id}</span>
                       <p className="text-sm font-bold text-slate-800 mt-1">{ovr.type}</p>
                    </div>
                    <div className="text-right">
                       <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${ovr.severity === 'High' ? 'bg-rose-100 text-rose-700' : ovr.severity === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'}`}>
                          {ovr.severity}
                       </span>
                       <p className="text-[10px] font-bold text-slate-400 mt-2">{ovr.date}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-6">
               <ActivitySquare className="w-5 h-5 text-emerald-500" />
               Infection Control (IC)
            </h3>
            <div className="space-y-6">
               <div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                     <span>Hand Hygiene Compliance</span>
                     <span className="text-emerald-600">92%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                     <div className="bg-emerald-500 h-full w-[92%]" />
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                     <span>SSI Rate (Surgical Site)</span>
                     <span className="text-blue-600">1.2%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                     <div className="bg-blue-500 h-full w-[1.2%]" />
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                     <span>VAP Rate (Ventilator)</span>
                     <span className="text-amber-500">2.4/1000</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                     <div className="bg-amber-500 h-full w-[12%]" />
                  </div>
               </div>
               <button className="w-full py-3 bg-slate-50 text-slate-600 border border-slate-200 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-colors">
                  View Full IC Dashboard
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
