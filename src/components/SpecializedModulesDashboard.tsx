import React, { useState } from "react";
import { Brain, Baby, Syringe, Eye, HeartPulse, Stethoscope, Microscope, Sparkles, Activity, FileText, ChevronRight } from "lucide-react";

interface Props {
  language: "ar" | "en";
}

export default function SpecializedModulesDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeSpecialty, setActiveSpecialty] = useState<string | null>(null);
  
  const modules = [
    { id: "psych", title: "Psychiatry & Mental Health", titleAr: "الطب النفسي والصحة النفسية", icon: Brain, status: "Active", patients: 45, color: "text-purple-600", bg: "bg-purple-50", desc: "Mental health assessments, DSM-5 integration, therapy session notes." },
    { id: "ivf", title: "IVF & Fertility", titleAr: "أطفال الأنابيب والخصوبة", icon: Baby, status: "Active", patients: 12, color: "text-pink-600", bg: "bg-pink-50", desc: "Cycle tracking, embryology lab integration, stimulation protocols." },
    { id: "dental", title: "Dentistry", titleAr: "طب الأسنان", icon: Sparkles, status: "Active", patients: 28, color: "text-blue-600", bg: "bg-blue-50", desc: "Dental charting, periodontics, orthodontic treatment plans." },
    { id: "ophthalmo", title: "Ophthalmology", titleAr: "طب العيون", icon: Eye, status: "Active", patients: 34, color: "text-emerald-600", bg: "bg-emerald-50", desc: "Visual acuity tracking, tonometry, retina imaging integration." },
    { id: "cardio", title: "Cardiology (Cath Lab)", titleAr: "أمراض القلب (القسطرة)", icon: HeartPulse, status: "Active", patients: 15, color: "text-rose-600", bg: "bg-rose-50", desc: "ECG, Echo reports, Cath lab procedures, hemodynamic monitoring." },
    { id: "derm", title: "Dermatology", titleAr: "الجلدية والتجميل", icon: Microscope, status: "Active", patients: 42, color: "text-amber-600", bg: "bg-amber-50", desc: "Body mapping, cosmetic procedures, laser session tracking." },
    { id: "ent", title: "ENT", titleAr: "الأنف والأذن والحنجرة", icon: Stethoscope, status: "Active", patients: 21, color: "text-indigo-600", bg: "bg-indigo-50", desc: "Audiograms, endoscopy video capture, sleep study analysis." },
    { id: "pain", title: "Pain Management", titleAr: "علاج الألم", icon: Syringe, status: "Active", patients: 18, color: "text-slate-600", bg: "bg-slate-50", desc: "Pain scoring scales, block procedures, controlled substance monitoring." },
  ];

  const selectedModule = modules.find(m => m.id === activeSpecialty);

  return (
    <div className="p-6 bg-slate-50 min-h-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap  mb-8">
        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-200">
          <HeartPulse className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
            {isAr ? "العيادات التخصصية" : "Specialized Clinical Modules"}
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">
            {isAr ? "سير عمل مخصص للتخصصات الدقيقة" : "Dedicated Workflows for Specific Specialties"}
          </p>
        </div>
      </div>

      {!activeSpecialty ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {modules.map((mod, i) => (
             <div 
               key={i} 
               onClick={() => setActiveSpecialty(mod.id)}
               className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors cursor-pointer group flex-1 flex flex-col h-full min-h-0 justify-between"
             >
                <div>
                  <div className="flex justify-between items-start mb-4">
                     <div className={`w-12 h-12 rounded-xl ${mod.bg} flex items-center justify-center ${mod.color} group-hover:scale-110 transition-transform`}>
                        <mod.icon className="w-6 h-6" />
                     </div>
                     <div className="text-right">
                        <span className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">{mod.patients}</span>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "مريض" : "Patients"}</p>
                     </div>
                  </div>
                  <h3 className="text-sm font-black text-slate-800 mb-2">{isAr ? mod.titleAr : mod.title}</h3>
                  <p className="text-xs font-medium text-slate-500 leading-relaxed mb-4">{mod.desc}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                   <p className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-widest flex items-center gap-1.5 border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {mod.status}
                   </p>
                   <ChevronRight className={`w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors ${isAr ? "rotate-180" : ""}`} />
                </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="animate-fade-in">
           <button 
             onClick={() => setActiveSpecialty(null)}
             className="mb-6 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 uppercase tracking-widest shadow-sm transition-colors flex items-center gap-2"
           >
             <ChevronRight className={`w-4 h-4 ${isAr ? "" : "rotate-180"}`} /> {isAr ? "العودة للتخصصات" : "Back to Specialties"}
           </button>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                 <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 flex items-center gap-6">
                    <div className={`w-20 h-20 rounded-3xl ${selectedModule?.bg} flex items-center justify-center ${selectedModule?.color} shrink-0`}>
                       {selectedModule && <selectedModule.icon className="w-10 h-10" />}
                    </div>
                    <div>
                       <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight mb-2">{isAr ? selectedModule?.titleAr : selectedModule?.title}</h2>
                       <p className="text-slate-500 font-medium leading-relaxed">{selectedModule?.desc}</p>
                    </div>
                 </div>

                 <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                    <div className="relative z-10 flex flex-col items-center justify-center min-h-[300px] text-center">
                       <Activity className="w-16 h-16 text-indigo-400 mb-6 opacity-50" />
                       <h3 className="text-lg sm:text-2xl font-black tracking-tight mb-4">Dedicated Workspace Loaded</h3>
                       <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-lg mb-8">
                          The specialized charting interface for {isAr ? selectedModule?.titleAr : selectedModule?.title} is active. Specific clinical forms, diagrams, and integrated device data are ready.
                       </p>
                       <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-colors shadow-xl">
                          Start Clinical Session
                       </button>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">Today's Patients</h3>
                    <div className="space-y-4">
                       {[1, 2, 3, 4].map(num => (
                          <div key={num} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors">
                             <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-black text-sm">
                                   P{num}
                                </div>
                                <div>
                                   <p className="text-sm font-bold text-slate-800">Patient #{1024 + num}</p>
                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Wait: 1{num} mins</p>
                                </div>
                             </div>
                             <div className={`w-2 h-2 rounded-full ${num === 1 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                          </div>
                       ))}
                    </div>
                 </div>
                 
                 <div className="bg-indigo-50 rounded-[2rem] border border-indigo-100 p-6">
                    <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <FileText className="w-4 h-4 text-indigo-500" /> Specialty Templates
                    </h3>
                    <div className="space-y-2">
                       <button className="w-full text-left p-3 rounded-xl bg-white text-xs font-bold text-slate-700 shadow-sm hover:border-indigo-300 border border-transparent transition-colors">Initial Assessment Form</button>
                       <button className="w-full text-left p-3 rounded-xl bg-white text-xs font-bold text-slate-700 shadow-sm hover:border-indigo-300 border border-transparent transition-colors">Follow-up Questionnaire</button>
                       <button className="w-full text-left p-3 rounded-xl bg-white text-xs font-bold text-slate-700 shadow-sm hover:border-indigo-300 border border-transparent transition-colors">Procedure Consent</button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
