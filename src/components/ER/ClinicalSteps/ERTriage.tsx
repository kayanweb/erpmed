import React, { useState } from "react";
import { 
  Activity, HeartPulse, Thermometer, Wind, AlertTriangle, 
  CheckCircle2, Siren, Save, Info, Brain, Droplet
} from "lucide-react";
import { motion } from "motion/react";
import { useHIS } from "../../../context/HISContext";
import { Patient } from "../../../types";

interface ERTriageProps {
  patient: Patient;
  isAr: boolean;
}

export function ERTriage({ patient, isAr }: ERTriageProps) {
  const { updatePatientStatus, updatePatient } = useHIS();
  
  const [vitals, setVitals] = useState({
    temp: "",
    hr: "",
    rr: "",
    bp: "",
    spo2: "",
    weight: ""
  });
  
  const [esiLevel, setEsiLevel] = useState<number | null>(patient.clinicalData?.esiLevel || null);
  const [complaint, setComplaint] = useState(patient.clinicalData?.chiefComplaint || "");
  const [arrivalMode, setArrivalMode] = useState("ambulance");

  const handleSaveTriage = async () => {
    if (!esiLevel || !complaint) return;
    
    await updatePatient(patient.id, {
      status: 'er_bed', // Move from triage to bed/treatment
      clinicalData: {
        ...patient.clinicalData,
        esiLevel,
        chiefComplaint: complaint
      },
      vitals: {
        ...vitals,
        timestamp: new Date().toISOString()
      }
    });
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Vitals & Core Metrics */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 border-b border-slate-100 pb-4">
              {isAr ? "العلامات الحيوية الأولية" : "Initial Vital Signs"}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { id: 'hr', label: isAr ? "النبض" : "Pulse", icon: HeartPulse, unit: "bpm", color: "rose" },
                { id: 'bp', label: isAr ? "ضغط الدم" : "BP", icon: Activity, unit: "mmHg", color: "blue" },
                { id: 'temp', label: isAr ? "الحرارة" : "Temp", icon: Thermometer, unit: "°C", color: "amber" },
                { id: 'spo2', label: isAr ? "الأكسجين" : "SpO2", icon: Wind, unit: "%", color: "emerald" },
                { id: 'rr', label: isAr ? "التنفس" : "Resp", icon: Wind, unit: "bpm", color: "sky" },
                { id: 'weight', label: isAr ? "الوزن" : "Weight", icon: Activity, unit: "kg", color: "slate" },
              ].map((v) => (
                <div key={v.id} className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-400">
                    <v.icon className={`w-4 h-4 text-${v.color}-500`} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{v.label}</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={vitals[v.id as keyof typeof vitals]}
                      onChange={(e) => setVitals(prev => ({ ...prev, [v.id]: e.target.value }))}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xl font-black outline-none focus:ring-2 focus:ring-slate-900 transition-all" 
                      placeholder="--" 
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase">{v.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 border-b border-slate-100 pb-4">
              {isAr ? "الشكوى الرئيسية والسوابق" : "Chief Complaint & History"}
            </h3>
            <div className="space-y-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "الشكوى الرئيسية" : "Chief Complaint"}</label>
                  <textarea 
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                    className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-rose-500 min-h-[120px]" 
                    placeholder={isAr ? "اكتب شكوى المريض..." : "Patient's primary complaint..."}
                  ></textarea>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "الحساسية" : "Known Allergies"}</label>
                     <input type="text" className="w-full p-4 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-700 outline-none" placeholder="NKDA" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "طريقة الوصول" : "Arrival Mode"}</label>
                     <select 
                       value={arrivalMode}
                       onChange={(e) => setArrivalMode(e.target.value)}
                       className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                     >
                        <option value="ambulance">{isAr ? "إسعاف" : "Ambulance"}</option>
                        <option value="private">{isAr ? "سيارة خاصة" : "Private Vehicle"}</option>
                        <option value="walkin">{isAr ? "مشياً" : "Walk-in"}</option>
                     </select>
                  </div>
               </div>
            </div>
          </section>
        </div>

        {/* Right: ESI Decision Support */}
        <div className="space-y-6">
           <div className="bg-slate-900 p-8 rounded-[32px] text-white space-y-8 shadow-2xl shadow-slate-200">
              <div>
                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">{isAr ? "نظام تصنيف الفرز" : "Triage Acuity System"}</h3>
                 <h2 className="text-xl font-black tracking-tight">ESI Level Decision</h2>
              </div>

              <div className="space-y-3">
                 {[
                   { lvl: 1, labelAr: "إنعاش (فوري)", labelEn: "Resuscitation", color: "bg-red-600", desc: "Life-threatening, immediate intervention required" },
                   { lvl: 2, labelAr: "طارئ جداً", labelEn: "Emergency", color: "bg-orange-500", desc: "High risk, potential threat to life/limb" },
                   { lvl: 3, labelAr: "عاجل", labelEn: "Urgent", color: "bg-yellow-400", desc: "Stable but needs multiple resources" },
                   { lvl: 4, labelAr: "أقل عجلة", labelEn: "Less Urgent", color: "bg-green-500", desc: "Stable, one resource needed" },
                   { lvl: 5, labelAr: "غير عاجل", labelEn: "Non-Urgent", color: "bg-blue-500", desc: "Stable, no resources needed" },
                 ].map((item) => (
                   <button 
                     key={item.lvl}
                     onClick={() => setEsiLevel(item.lvl)}
                     className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-start gap-4 ${
                       esiLevel === item.lvl 
                        ? `border-white bg-white/10 ring-4 ring-white/5` 
                        : `border-white/5 bg-white/5 hover:bg-white/10`
                     }`}
                   >
                      <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center font-black text-xs shrink-0`}>
                        {item.lvl}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black uppercase tracking-widest">{isAr ? item.labelAr : item.labelEn}</span>
                        <p className="text-[9px] font-bold text-slate-500 mt-1 leading-tight">{item.desc}</p>
                      </div>
                      {esiLevel === item.lvl && <CheckCircle2 size={16} className="ml-auto text-white" />}
                   </button>
                 ))}
              </div>

              <div className="pt-6 border-t border-white/10 space-y-4">
                 <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <Info size={16} className="text-indigo-400" />
                    <p className="text-[9px] font-bold text-slate-400 italic">
                      The Emergency Severity Index (ESI) is a five-level ED triage algorithm that provides clinically relevant stratification of patients.
                    </p>
                 </div>
                 
                 <button 
                   onClick={handleSaveTriage}
                   disabled={!esiLevel || !complaint}
                   className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-900/50 hover:bg-rose-700 disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-2"
                 >
                    <Save size={16} />
                    {isAr ? "حفظ وإرسال للفحص" : "Confirm & Send to Exam"}
                 </button>
              </div>
           </div>

           <div className="bg-emerald-900 p-8 rounded-[32px] text-white space-y-4 shadow-xl shadow-emerald-100">
              <div className="w-10 h-10 bg-emerald-800 rounded-xl flex items-center justify-center">
                 <Activity size={20} className="text-emerald-400" />
              </div>
              <div>
                 <h4 className="text-sm font-black uppercase tracking-tight">{isAr ? "أوامر الفرز السريعة" : "Nurse Triage Orders"}</h4>
                 <p className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest">Protocol Driven Care</p>
              </div>
              <div className="space-y-2">
                 <button className="w-full p-3 bg-emerald-800/50 border border-emerald-700/50 rounded-xl text-[10px] font-black uppercase tracking-widest text-left hover:bg-emerald-800 transition-colors">ECG (Stat)</button>
                 <button className="w-full p-3 bg-emerald-800/50 border border-emerald-700/50 rounded-xl text-[10px] font-black uppercase tracking-widest text-left hover:bg-emerald-800 transition-colors">Blood Glucose (POCT)</button>
                 <button className="w-full p-3 bg-emerald-800/50 border border-emerald-700/50 rounded-xl text-[10px] font-black uppercase tracking-widest text-left hover:bg-emerald-800 transition-colors">Triage Lab Set (Green)</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
