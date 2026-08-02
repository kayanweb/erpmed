import React from "react";
import { 
  ShieldAlert, Pill, FlaskConical, HeartPulse, 
  FileEdit, ClipboardList, AlertTriangle, Activity,
  Clock, TrendingUp, CheckCircle2
} from "lucide-react";

interface Props {
  patient: any;
  isAr: boolean;
  language: "ar" | "en";
  setActiveTab: (tab: string) => void;
}

export const ClinicalSnapshot: React.FC<Props> = ({ patient, isAr, language, setActiveTab }) => {
  // Mock data for trends and recent stuff, in real HIS this comes from patient object
  const trends = [
    { label: "BP", values: [110, 115, 120, 118, 122, 120], color: "indigo" },
    { label: "HR", values: [75, 78, 82, 80, 85, 78], color: "rose" },
    { label: "SpO2", values: [98, 97, 98, 99, 98, 98], color: "emerald" },
  ];

  const recentLabs = [
    { test: "Hemoglobin", value: "12.5", unit: "g/dL", status: "normal", date: "2h ago" },
    { test: "WBC", value: "11.2", unit: "x10^9/L", status: "high", date: "2h ago" },
    { test: "Potassium", value: "3.8", unit: "mEq/L", status: "normal", date: "6h ago" },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12" dir={isAr ? "rtl" : "ltr"}>
      {/* Top Layer: Critical Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-sm hover:border-indigo-100 transition group">
           <div className="flex items-center gap-2 mb-2">
             <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
               <ShieldAlert className="w-4 h-4" />
             </div>
             <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">{isAr ? "حالة المريض" : "Clinical Status"}</h3>
           </div>
           <p className="text-sm font-black text-slate-800">Inpatient - ICU (Bed 04)</p>
           <div className="flex items-center gap-2 mt-2">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             <span className="text-[10px] font-bold text-slate-500 uppercase">Stable Post-OP</span>
           </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-sm hover:border-rose-100 transition">
           <div className="flex items-center gap-2 mb-2">
             <div className="p-1.5 bg-rose-50 rounded-lg text-rose-600">
               <AlertTriangle className="w-4 h-4" />
             </div>
             <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">{isAr ? "تحذيرات هامة" : "Safety Alerts"}</h3>
           </div>
           <div className="space-y-1">
             <p className="text-[11px] font-black text-rose-700 flex items-center gap-1.5 uppercase">
               <TrendingUp className="w-3.5 h-3.5"/> High Fall Risk
             </p>
             <p className="text-[11px] font-black text-rose-700 flex items-center gap-1.5 uppercase">
               <Activity className="w-3.5 h-3.5"/> Contact Precautions
             </p>
           </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-sm hover:border-emerald-100 transition">
           <div className="flex items-center gap-2 mb-2">
             <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
               <Pill className="w-4 h-4" />
             </div>
             <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">{isAr ? "الأدوية المقررة" : "Medication Status"}</h3>
           </div>
           <p className="text-sm font-black text-slate-800">4 Active / 2 Overdue</p>
           <button 
             onClick={() => setActiveTab("mar")}
             className="text-[10px] font-black text-indigo-600 uppercase mt-2 hover:underline"
           >
             {isAr ? "فتح سجل الأدوية ←" : "Open MAR →"}
           </button>
        </div>

        <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-sm hover:border-blue-100 transition">
           <div className="flex items-center gap-2 mb-2">
             <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
               <FlaskConical className="w-4 h-4" />
             </div>
             <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">{isAr ? "المختبر" : "Lab Outlook"}</h3>
           </div>
           <p className="text-sm font-black text-slate-800">3 Pending Results</p>
           <div className="flex items-center gap-1 mt-2">
             <Clock className="w-3 h-3 text-slate-400" />
             <span className="text-[10px] font-bold text-slate-500">Last Draw: 08:30 AM</span>
           </div>
        </div>
      </div>

      {/* Main Workstation Body: Grid of Clinical Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Active Problems & Medications (6/12) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Problem List */}
          <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-indigo-600" />
                {isAr ? "التشخيصات الحالية" : "Active Problems"}
              </h3>
              <button 
                onClick={() => setActiveTab("diagnoses")}
                className="text-[10px] font-black text-indigo-600 uppercase hover:underline"
              >
                Manage
              </button>
            </div>
            <div className="p-0">
              <div className="divide-y divide-slate-100">
                <div className="p-3 hover:bg-slate-50 transition cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-black text-slate-800">Acute Myocardial Infarction</p>
                    <span className="bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded text-[9px] font-black uppercase">Primary</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">ICD-10: I21.9 • Onset: 2024-05-12</p>
                </div>
                <div className="p-3 hover:bg-slate-50 transition cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-black text-slate-800">Type 2 Diabetes Mellitus</p>
                    <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[9px] font-black uppercase">Chronic</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">ICD-10: E11.9 • Controlled</p>
                </div>
              </div>
            </div>
          </section>

          {/* Medication Summary */}
          <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                <Pill className="w-4 h-4 text-emerald-600" />
                {isAr ? "الأدوية الحالية" : "Current Medications"}
              </h3>
              <button 
                onClick={() => setActiveTab("medication_orders")}
                className="text-[10px] font-black text-emerald-600 uppercase hover:underline"
              >
                Review
              </button>
            </div>
            <div className="p-0">
              <table className="w-full text-xs text-left rtl:text-right">
                <thead className="bg-slate-50/50 text-slate-400 font-black uppercase tracking-tighter border-b border-slate-100">
                  <tr>
                    <th className="px-3 py-2">Medication</th>
                    <th className="px-3 py-2 text-right">Last Dose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { name: "Aspirin 81mg", dose: "1 tab PO Daily", last: "08:15" },
                    { name: "Lisinopril 10mg", dose: "1 tab PO Daily", last: "08:15" },
                    { name: "Insulin Glargine", dose: "10 units SC qHS", last: "Yesterday" },
                  ].map((m, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-3 py-2.5">
                        <p className="font-black text-slate-800">{m.name}</p>
                        <p className="text-[10px] text-slate-500 font-bold">{m.dose}</p>
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-400">{m.last}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Middle Column: Clinical Trends & Labs (5/12) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Vital Signs Trends */}
          <section className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-600" />
                {isAr ? "تطور العلامات الحيوية" : "Vitals Trending"}
              </h3>
              <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                <Clock className="w-3 h-3 text-slate-400" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Last 24 Hours</span>
              </div>
            </div>
            
            <div className="space-y-5">
              {trends.map((t, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-16 shrink-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">{t.label}</p>
                    <p className="text-sm font-black text-slate-800 font-mono">{t.values[t.values.length-1]}</p>
                  </div>
                  <div className="flex-1 h-8 flex items-end gap-1 px-2 border-b border-slate-50">
                    {t.values.map((v, j) => (
                      <div 
                        key={j} 
                        className={`flex-1 bg-${t.color}-500/20 rounded-t-sm hover:bg-${t.color}-500/40 transition-colors`}
                        style={{ height: `${(v / 150) * 100}%` }}
                        title={v.toString()}
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setActiveTab("vitals")}
              className="w-full text-center py-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-slate-50 transition rounded-xl mt-4"
            >
              Full Vital Flowsheet
            </button>
          </section>

          {/* Latest Labs */}
          <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-indigo-600" />
                {isAr ? "أحدث نتائج المختبر" : "Latest Lab Results"}
              </h3>
              <button 
                onClick={() => setActiveTab("labs")}
                className="text-[10px] font-black text-indigo-600 uppercase hover:underline"
              >
                Full Results
              </button>
            </div>
            <div className="p-0">
              <div className="divide-y divide-slate-50">
                {recentLabs.map((lab, i) => (
                  <div key={i} className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition">
                    <div>
                      <p className="text-sm font-black text-slate-800">{lab.test}</p>
                      <p className="text-[10px] font-bold text-slate-400">{lab.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-black font-mono ${lab.status === 'high' ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {lab.value} <span className="text-[10px] font-bold text-slate-400">{lab.unit}</span>
                      </p>
                      {lab.status === 'high' && <span className="text-[9px] font-black text-rose-500 uppercase leading-none">H</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Worklist & Notes (3/12) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Bedside Worklist */}
          <section className="bg-slate-900 text-white rounded-2xl p-4 shadow-lg">
            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              {isAr ? "قائمة العمل (Worklist)" : "Patient Worklist"}
            </h3>
            <div className="space-y-3">
              {[
                { task: "Morning Assessment", done: true },
                { task: "IV Antibiotics (Ceftriaxone)", done: false, time: "10:00" },
                { task: "Wound Dressing Change", done: false, time: "11:30" },
                { task: "Physio Consultation", done: false, time: "14:00" },
              ].map((task, i) => (
                <div key={i} className={`flex items-center gap-3 p-2 rounded-xl transition ${task.done ? 'bg-slate-800/50' : 'bg-slate-800'}`}>
                  {task.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded border-2 border-indigo-500 shrink-0"></div>
                  )}
                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${task.done ? 'text-slate-500 line-through' : 'text-white'}`}>{task.task}</p>
                    {task.time && <p className="text-[9px] font-black text-indigo-400 font-mono">{task.time}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Physician Note */}
          <section className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 shadow-3xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black text-amber-700 uppercase tracking-widest flex items-center gap-2">
                <FileEdit className="w-4 h-4" />
                {isAr ? "أخر ملاحظة طبية" : "Recent Medical Note"}
              </h3>
            </div>
            <p className="text-xs font-bold text-slate-700 leading-relaxed italic line-clamp-4">
              "Patient is alert and oriented. Cardiac enzymes are trending down. Continuing current post-MI protocol. Monitor for arrhythmias."
            </p>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-amber-100">
               <div className="w-6 h-6 rounded-lg bg-amber-200 text-amber-800 font-black text-[10px] flex items-center justify-center">AA</div>
               <div className="min-w-0">
                 <p className="text-[10px] font-black text-slate-800 truncate">Dr. Ahmed Ali</p>
                 <p className="text-[9px] font-bold text-slate-500">Cardiology • 4h ago</p>
               </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
