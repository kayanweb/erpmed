import React, { useState } from "react";
import { GitMerge, Activity, Clock, MapPin, User, FileText, CheckCircle2, ChevronRight, Siren, FileCheck, Syringe, Ambulance, UserCheck, CreditCard, Pill, BedDouble, Stethoscope } from "lucide-react";

interface Props {
  language: "ar" | "en";
}

interface JourneyNode {
  id: string;
  title: string;
  timestamp: string;
  status: "completed" | "active" | "pending" | "alert";
  icon: "ambulance" | "triage" | "er" | "rad" | "lab" | "admit" | "ward" | "pharmacy" | "finance" | "discharge";
  actor: string;
  details: string;
  duration?: string;
}

export const PatientJourneyEngine: React.FC<Props> = ({ language }) => {
  const isAr = language === "ar";

  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

  // Data source: Acute Stroke Patient Journey
  const patientJourney: JourneyNode[] = [
    { id: "n1", title: isAr ? "استقبال نداء الإسعاف" : "Ambulance Dispatch", timestamp: "08:15 AM", status: "completed", icon: "ambulance", actor: "Paramedic Unit 4", details: "Suspected stroke. Pre-notification sent to ER.", duration: "12m" },
    { id: "n2", title: isAr ? "وصول الطوارئ (الفرز)" : "ER Arrival & Triage", timestamp: "08:27 AM", status: "completed", icon: "triage", actor: "Nurse Sarah (Triage)", details: "ESI Level 1. Stroke Pathway Activated automatically.", duration: "3m" },
    { id: "n3", title: isAr ? "تقييم طبيب الطوارئ" : "ER Physician Assessment", timestamp: "08:30 AM", status: "completed", icon: "er", actor: "Dr. Khaled", details: "NIHSS Score: 14. Ordered stat CT Brain.", duration: "8m" },
    { id: "n4", title: isAr ? "أشعة مقطعية عاجلة" : "STAT CT Brain", timestamp: "08:38 AM", status: "completed", icon: "rad", actor: "Radiology Tech", details: "Completed in 5 mins. Pending Read.", duration: "5m" },
    { id: "n5", title: isAr ? "تقرير الأشعة المقطعية" : "CT Read & Report", timestamp: "08:45 AM", status: "completed", icon: "rad", actor: "Dr. Samer (Radiologist)", details: "No hemorrhage. Confirmed ischemic stroke.", duration: "7m" },
    { id: "n6", title: isAr ? "قرار إعطاء مذيب الجلطة" : "Thrombolysis Decision", timestamp: "08:48 AM", status: "completed", icon: "pharmacy", actor: "Dr. Moataz (Neurology)", details: "tPA indicated. Door-to-needle time: 21 mins.", duration: "3m" },
    { id: "n7", title: isAr ? "الدخول للعناية المركزة" : "ICU Admission", timestamp: "09:15 AM", status: "active", icon: "admit", actor: "ICU Charge Nurse", details: "Patient stabilized. Transferring to ICU Bed 4.", duration: "In Progress" },
    { id: "n8", title: isAr ? "متابعة ما بعد المذيب" : "Post-tPA Monitoring", timestamp: "--:--", status: "pending", icon: "ward", actor: "ICU Team", details: "Q15 min neuro checks for 2 hours." },
    { id: "n9", title: isAr ? "الخروج (Discharge)" : "Discharge Planning", timestamp: "--:--", status: "pending", icon: "discharge", actor: "Case Manager", details: "Pending Rehab consult." },
  ];

  const getIcon = (type: string, status: string) => {
    const colorClass = status === "completed" ? "text-slate-500" : status === "active" ? "text-indigo-600" : status === "alert" ? "text-rose-500" : "text-slate-300";
    switch (type) {
      case "ambulance": return <Ambulance className={`w-5 h-5 ${colorClass}`} />;
      case "triage": return <UserCheck className={`w-5 h-5 ${colorClass}`} />;
      case "er": return <Stethoscope className={`w-5 h-5 ${colorClass}`} />;
      case "rad": return <Activity className={`w-5 h-5 ${colorClass}`} />;
      case "lab": return <Activity className={`w-5 h-5 ${colorClass}`} />;
      case "admit": return <BedDouble className={`w-5 h-5 ${colorClass}`} />;
      case "ward": return <Activity className={`w-5 h-5 ${colorClass}`} />;
      case "pharmacy": return <Syringe className={`w-5 h-5 ${colorClass}`} />;
      case "finance": return <CreditCard className={`w-5 h-5 ${colorClass}`} />;
      case "discharge": return <FileCheck className={`w-5 h-5 ${colorClass}`} />;
      default: return <Clock className={`w-5 h-5 ${colorClass}`} />;
    }
  };

  const getStatusNodeColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-500 border-emerald-500";
      case "active": return "bg-white border-indigo-500 border-[3px] ring-4 ring-indigo-500/20";
      case "alert": return "bg-rose-500 border-rose-500 animate-pulse";
      case "pending": return "bg-slate-200 border-slate-200";
      default: return "bg-slate-200 border-slate-200";
    }
  };

  const getCardStyle = (status: string) => {
    switch (status) {
      case "completed": return "bg-white border-slate-200 opacity-70 hover:opacity-100 transition-opacity";
      case "active": return "bg-indigo-50 border-indigo-200 shadow-md shadow-indigo-500/10";
      case "alert": return "bg-rose-50 border-rose-200 shadow-md shadow-rose-500/10";
      case "pending": return "bg-slate-50 border-slate-100 border-dashed opacity-50";
      default: return "bg-white border-slate-200";
    }
  };

  return (
    <div className={`p-6 w-full space-y-6 ${isAr ? "text-right" : "text-left"}`} dir={isAr ? "rtl" : "ltr"}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <GitMerge className="w-64 h-64 -mt-16 -mr-16" />
        </div>
        <div className="relative z-10">
          <h1 className="text-lg sm:text-2xl font-black flex flex-wrap items-center gap-2 sm:gap-3">
            <GitMerge className="w-5 h-5 sm:w-8 sm:h-8 text-indigo-400" />
            {isAr ? "محرك مسار المريض (Patient Journey Engine)" : "Patient Journey Engine"}
          </h1>
          <p className="text-slate-400 mt-1 max-w-2xl text-sm leading-relaxed">
            {isAr 
              ? "تتبع كامل لرحلة المريض من الإسعاف وحتى الخروج. يربط بين جميع الأقسام (طوارئ، أشعة، عناية، صيدلية) في خط زمني واحد (Event-Sourced Timeline)." 
              : "Full end-to-end tracking of the patient's encounter. Connects all events across departments (ER, Rad, ICU, Pharmacy) into a single immutable timeline."}
          </p>
        </div>
        
        <div className="relative z-10 bg-slate-800 p-4 rounded-xl border border-slate-700 w-full md:w-auto">
          <div className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">{isAr ? "المريض الحالي" : "Current Patient Context"}</div>
          <div className="font-black text-lg text-white">أحمد محمود سالم</div>
          <div className="flex gap-3 text-sm text-slate-300 mt-1">
            <span className="bg-slate-700 px-2 py-0.5 rounded font-mono">MRN: 20260012</span>
            <span className="bg-rose-900/50 text-rose-300 px-2 py-0.5 rounded border border-rose-800/50 flex items-center gap-1">
              <Siren className="w-3 h-3" /> Acute Stroke (tPA)
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI / Stats Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 mb-4 text-sm border-b border-slate-100 pb-2">{isAr ? "مؤشرات المسار الحرج" : "Critical Pathway Metrics"}</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Door-to-Doctor</span>
                  <span className="font-bold text-emerald-600">3 mins</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Door-to-CT</span>
                  <span className="font-bold text-emerald-600">11 mins</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Door-to-Needle (tPA)</span>
                  <span className="font-bold text-emerald-600">21 mins</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "100%" }}></div>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 text-right">Target: &lt; 60 mins</div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-5">
            <h3 className="font-bold text-indigo-900 mb-2 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4" />
              {isAr ? "حالة المسار" : "Journey Status"}
            </h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-white p-3 rounded-xl border border-indigo-200 mt-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <BedDouble className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <div className="text-xs text-slate-500">{isAr ? "الموقع الحالي" : "Current Location"}</div>
                <div className="font-bold text-indigo-900 text-sm">ICU (Transferring)</div>
              </div>
            </div>
          </div>
        </div>

        {/* The Event-Sourced Timeline */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-black text-xl text-slate-800">
                {isAr ? "السجل الزمني للأحداث (Immutable Event Log)" : "Immutable Event Log"}
              </h2>
            </div>

            <div className="relative">
              {/* Central vertical line */}
              <div className="absolute top-4 bottom-4 left-[39px] rtl:right-[39px] rtl:left-auto w-0.5 bg-slate-200 rounded-full"></div>

              <div className="space-y-6">
                {patientJourney.map((node, index) => (
                  <div key={node.id} className="relative flex gap-6 group">
                    
                    {/* Node Dot & Timestamp */}
                    <div className="flex flex-col items-center shrink-0 w-20 rtl:w-auto">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center relative z-10 ${getStatusNodeColor(node.status)} transition-transform group-hover:scale-110`}>
                        {node.status === "completed" && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <div className="font-mono text-xs font-bold text-slate-500 mt-2 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        {node.timestamp}
                      </div>
                    </div>

                    {/* Node Content Card */}
                    <div className={`flex-1 p-4 rounded-xl border ${getCardStyle(node.status)}`}>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {getIcon(node.icon, node.status)}
                            <h3 className={`font-bold text-lg ${node.status === "completed" ? "text-slate-700" : node.status === "pending" ? "text-slate-400" : "text-indigo-900"}`}>
                              {node.title}
                            </h3>
                          </div>
                          <p className={`text-sm ${node.status === "pending" ? "text-slate-400" : "text-slate-600"}`}>
                            {node.details}
                          </p>
                          <div className="flex items-center gap-2 mt-3 text-xs font-medium text-slate-500">
                            <User className="w-3.5 h-3.5" /> {node.actor}
                          </div>
                        </div>

                        {/* Duration Badge */}
                        {node.duration && (
                          <div className="shrink-0">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold border ${
                              node.status === "completed" ? "bg-slate-50 text-slate-500 border-slate-200" : "bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse"
                            }`}>
                              <Clock className="w-3 h-3" />
                              {node.duration}
                            </span>
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
    </div>
  );
};

export default PatientJourneyEngine;
