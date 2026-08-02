import React, { useState } from "react";
import { Network, Activity, Clock, Syringe, TestTube, ArrowRight, CheckCircle2, AlertTriangle, FileCheck, Stethoscope, ChevronRight, PlayCircle, BrainCircuit, HeartPulse } from "lucide-react";

interface Props {
  language: "ar" | "en";
}

interface PathwayTask {
  id: string;
  title: string;
  type: "lab" | "rad" | "med" | "consult" | "assessment";
  status: "pending" | "active" | "completed" | "overdue";
  timeWindow: string; // e.g., "0-10 mins"
  elapsed?: number; // In minutes, simulated
}

export const ClinicalProtocolEngine: React.FC<Props> = ({ language }) => {
  const isAr = language === "ar";

  const [activePathway, setActivePathway] = useState<string>("stroke");
  const [patientContext] = useState({
    name: isAr ? "يوسف أحمد عمر" : "Youssef Ahmed Omar",
    mrn: "1098553",
    age: 68,
    arrival: "14 mins ago",
    trigger: isAr ? "اشتباه جلطة دماغية (FAST)" : "Suspected Acute Stroke (FAST)",
  });

  const [strokeTasks, setStrokeTasks] = useState<PathwayTask[]>([]);

  const [sepsisTasks] = useState<PathwayTask[]>([]);

  const currentTasks = activePathway === "stroke" ? strokeTasks : sepsisTasks;

  const getTaskIcon = (type: string) => {
    switch(type) {
      case "lab": return <TestTube className="w-5 h-5 text-emerald-500" />;
      case "rad": return <Activity className="w-5 h-5 text-indigo-500" />;
      case "med": return <Syringe className="w-5 h-5 text-rose-500" />;
      case "consult": return <Stethoscope className="w-5 h-5 text-amber-500" />;
      case "assessment": return <FileCheck className="w-5 h-5 text-blue-500" />;
      default: return <CheckCircle2 className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case "completed": return "bg-emerald-50 border-emerald-200 opacity-60";
      case "active": return "bg-white border-blue-400 shadow-md ring-1 ring-blue-400/20";
      case "overdue": return "bg-rose-50 border-rose-300 shadow-sm animate-pulse";
      default: return "bg-slate-50 border-slate-200 opacity-80";
    }
  };

  return (
    <div className={`p-6 w-full space-y-6 ${isAr ? "text-right" : "text-left"}`} dir={isAr ? "rtl" : "ltr"}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-slate-800 flex flex-wrap items-center gap-2 sm:gap-3">
            <Network className="w-5 h-5 sm:w-8 sm:h-8 text-indigo-600" />
            {isAr ? "محرك البروتوكولات السريرية الذكي" : "Clinical Protocol Engine (Pathways)"}
          </h1>
          <p className="text-slate-500 mt-1">
            {isAr 
              ? "توجيه آلي لمسارات العمل بناءً على التشخيص المبدئي، دون تدخل بشري." 
              : "Automated workflow orchestration based on presumptive diagnosis, with zero manual input."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Sidebar: Available Protocols */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-800 border-b border-slate-700">
              <h3 className="font-bold text-white flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-rose-400" />
                {isAr ? "البروتوكولات النشطة" : "Active Pathways"}
              </h3>
            </div>
            <div className="p-2 space-y-1">
              <button 
                onClick={() => setActivePathway("stroke")}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${activePathway === "stroke" ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800"}`}
              >
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4" />
                  <span className="font-bold text-sm">Acute Stroke Bundle</span>
                </div>
                {activePathway === "stroke" && <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></div>}
              </button>
              <button 
                onClick={() => setActivePathway("sepsis")}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${activePathway === "sepsis" ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800"}`}
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span className="font-bold text-sm">Sepsis Bundle (1 Hour)</span>
                </div>
                {activePathway === "sepsis" && <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></div>}
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl text-slate-500 opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4" />
                  <span className="font-bold text-sm">STEMI Pathway</span>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 mb-3 text-sm">{isAr ? "كيف يعمل المحرك؟" : "How the Engine Works"}</h3>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>{isAr ? "يقوم النظام برصد الحدث (مثلاً: تسجيل دخول مريض بجلطة)." : "The OS detects the event (e.g., patient registered with Stroke)."}</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>{isAr ? "يتم تشغيل البروتوكول أوتوماتيكياً (Pathways)." : "The corresponding Pathway protocol is triggered automatically."}</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>{isAr ? "ينشئ المهام ويرسل الإشعارات لكل قسم (المختبر، الأشعة، الصيدلية)." : "Tasks are generated and notifications are dispatched to respective departments (Lab, Rad, Pharmacy)."}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Workspace: Pathway Execution */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Patient Context & Pathway Status */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <BrainCircuit className="w-32 h-32" />
            </div>
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-100 text-rose-700 rounded-lg text-xs font-bold uppercase tracking-wider mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  {patientContext.trigger}
                </div>
                <h2 className="text-xl font-black text-indigo-900">{patientContext.name}</h2>
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap  text-sm font-medium text-indigo-700/80">
                  <span>MRN: {patientContext.mrn}</span>
                  <span>Age: {patientContext.age}</span>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded-xl shadow-sm border border-indigo-100 min-w-[200px] text-center">
                <div className="text-xs text-slate-500 mb-1 font-medium">{isAr ? "وقت الوصول (Door Time)" : "Door Time Elapsed"}</div>
                <div className="text-lg sm:text-2xl font-black text-rose-600 flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5" />
                  {patientContext.arrival}
                </div>
              </div>
            </div>
          </div>

          {/* Pathway Tasks Timeline */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-lg">
              <Activity className="w-5 h-5 text-rose-500" />
              {activePathway === "stroke" ? (isAr ? "مسار الجلطة الدماغية (Golden Hour)" : "Acute Stroke Pathway (Golden Hour)") : (isAr ? "مسار الإنتان الدموي (1 Hour Bundle)" : "Sepsis Pathway (1 Hour Bundle)")}
            </h3>

            <div className="relative border-l-2 border-slate-100 ml-4 pl-6 space-y-6 rtl:border-r-2 rtl:border-l-0 rtl:mr-4 rtl:ml-0 rtl:pr-6 rtl:pl-0">
              {currentTasks.map((task) => (
                <div key={task.id} className="relative">
                  {/* Timeline dot */}
                  <div className={`absolute top-4 -left-[35px] rtl:-right-[35px] rtl:left-auto w-5 h-5 rounded-full border-4 border-white flex items-center justify-center ${
                    task.status === "completed" ? "bg-emerald-500" : task.status === "active" ? "bg-blue-500" : "bg-slate-300"
                  }`}>
                    {task.status === "completed" && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>

                  {/* Task Card */}
                  <div className={`p-4 rounded-xl border transition-all ${getStatusStyle(task.status)} flex flex-col xl:flex-row xl:items-center justify-between gap-4`}>
                    <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                        {getTaskIcon(task.type)}
                      </div>
                      <div>
                        <h4 className={`font-bold text-base ${task.status === "completed" ? "text-slate-500 line-through" : "text-slate-800"}`}>
                          {task.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 text-xs font-medium text-slate-500">
                          <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            {task.type.toUpperCase()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Target: {task.timeWindow}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                      {task.status === "completed" && (
                        <div className="text-emerald-600 text-sm font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Done at {task.elapsed} mins
                        </div>
                      )}
                      {task.status === "active" && (
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <span className="text-blue-600 text-sm font-bold animate-pulse flex items-center gap-1">
                            <Activity className="w-4 h-4" /> In Progress ({task.elapsed} mins)
                          </span>
                          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md transition-colors">
                            {isAr ? "تم التنفيذ" : "Mark Done"}
                          </button>
                        </div>
                      )}
                      {task.status === "pending" && (
                        <div className="text-slate-400 text-sm font-medium flex items-center gap-1">
                          Waiting...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ClinicalProtocolEngine;
