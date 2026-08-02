import React, { useState, useEffect } from "react";
import { AlertTriangle, Clock, HeartPulse, Zap, Syringe, Activity, User, MapPin, PhoneCall, CheckCircle2, Play, Square, Plus } from "lucide-react";

interface Props {
  language: "ar" | "en";
}

interface LogEntry {
  id: string;
  time: string;
  action: string;
  type: "medication" | "shock" | "airway" | "rhythm" | "other";
  details: string;
}

export const RapidResponseTeam: React.FC<Props> = ({ language }) => {
  const isAr = language === "ar";

  const [activeCode, setActiveCode] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Simulation: Active Patient
  const patient = {
    name: isAr ? "أحمد محمود سالم" : "Ahmed Mahmoud Salem",
    mrn: "1098442",
    location: isAr ? "العناية المركزة - سرير 4" : "ICU - Bed 4",
    doctor: isAr ? "د. معتز إبراهيم" : "Dr. Moataz Ibrahim",
    diagnosis: isAr ? "فشل تنفسي حاد" : "Acute Respiratory Failure",
    weight: "85 kg",
    allergies: isAr ? "بنسلين" : "Penicillin",
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeCode) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCode]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const addLog = (type: LogEntry["type"], action: string, details: string = "") => {
    const now = new Date();
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      time: now.toLocaleTimeString([], { hour12: false }),
      action,
      type,
      details,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleStartCode = () => {
    setActiveCode(true);
    setElapsedSeconds(0);
    setLogs([]);
    addLog("other", isAr ? "تم تفعيل كود بلو" : "Code Blue Activated");
  };

  const handleStopCode = () => {
    setActiveCode(false);
    addLog("other", isAr ? "تم إنهاء كود بلو" : "Code Blue Terminated", isAr ? `وقت الإنعاش: ${formatTime(elapsedSeconds)}` : `Resuscitation Time: ${formatTime(elapsedSeconds)}`);
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case "medication": return <Syringe className="w-4 h-4 text-pink-500" />;
      case "shock": return <Zap className="w-4 h-4 text-amber-500" />;
      case "airway": return <Activity className="w-4 h-4 text-blue-500" />;
      case "rhythm": return <HeartPulse className="w-4 h-4 text-emerald-500" />;
      default: return <CheckCircle2 className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className={`p-6 w-full space-y-6 ${isAr ? "text-right" : "text-left"}`} dir={isAr ? "rtl" : "ltr"}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-slate-800 flex flex-wrap items-center gap-2 sm:gap-3">
            <HeartPulse className="w-5 h-5 sm:w-8 sm:h-8 text-rose-600" />
            {isAr ? "فريق التدخل السريع (RRT)" : "Rapid Response Team (RRT)"}
          </h1>
          <p className="text-slate-500 mt-1">
            {isAr ? "مركز إدارة الإنعاش والحالات الحرجة" : "Resuscitation & Critical Event Management Center"}
          </p>
        </div>

        {!activeCode ? (
          <button 
            onClick={handleStartCode}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all animate-pulse"
          >
            <AlertTriangle className="w-5 h-5" />
            {isAr ? "تفعيل كود بلو (Code Blue)" : "Activate Code Blue"}
          </button>
        ) : (
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap  bg-rose-50 px-6 py-3 rounded-xl border border-rose-200">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-600 animate-ping"></div>
              <span className="text-rose-600 font-bold text-lg">{isAr ? "كود بلو نشط" : "Active Code Blue"}</span>
            </div>
            <div className="h-8 w-px bg-rose-200 mx-2"></div>
            <div className="flex items-center gap-2 font-mono text-3xl font-black text-slate-800">
              <Clock className="w-6 h-6 text-slate-400" />
              {formatTime(elapsedSeconds)}
            </div>
            <div className="h-8 w-px bg-rose-200 mx-2"></div>
            <button 
              onClick={handleStopCode}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold flex items-center gap-2 transition-colors"
            >
              <Square className="w-4 h-4 fill-current" />
              {isAr ? "إنهاء" : "Stop"}
            </button>
          </div>
        )}
      </div>

      {activeCode ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Patient Context & Vital Signs */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-800 p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <HeartPulse className="w-32 h-32" />
              </div>
              <h3 className="font-bold text-slate-300 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                {isAr ? "بيانات المريض" : "Patient Context"}
              </h3>
              <div className="space-y-4 relative z-10">
                <div>
                  <div className="text-xl font-black">{patient.name}</div>
                  <div className="text-slate-400 text-sm font-mono mt-1">MRN: {patient.mrn}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                    <div className="text-xs text-slate-400 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> {isAr ? "الموقع" : "Location"}</div>
                    <div className="font-bold text-sm text-rose-400">{patient.location}</div>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                    <div className="text-xs text-slate-400 mb-1 flex items-center gap-1"><PhoneCall className="w-3 h-3"/> {isAr ? "الطبيب" : "Doctor"}</div>
                    <div className="font-bold text-sm">{patient.doctor}</div>
                  </div>
                </div>
                <div className="bg-rose-900/30 p-3 rounded-xl border border-rose-800/50">
                  <div className="text-xs text-rose-300 mb-1">{isAr ? "التشخيص" : "Diagnosis"}</div>
                  <div className="font-bold text-sm">{patient.diagnosis}</div>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">WT: {patient.weight}</div>
                  <div className="bg-amber-900/30 text-amber-400 px-3 py-1 rounded-lg border border-amber-800/50">Allergies: {patient.allergies}</div>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h3 className="font-bold text-slate-800 mb-4">{isAr ? "الإجراءات السريعة" : "Quick Actions"}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button 
                  onClick={() => addLog("rhythm", "Rhythm Check", "VT / VF")}
                  className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 font-bold text-sm flex flex-col items-center gap-2 transition-colors"
                >
                  <Activity className="w-6 h-6" />
                  {isAr ? "فحص النبض" : "Rhythm Check"}
                </button>
                <button 
                  onClick={() => addLog("shock", "DC Shock Delivered", "200J")}
                  className="p-3 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl border border-amber-200 font-bold text-sm flex flex-col items-center gap-2 transition-colors"
                >
                  <Zap className="w-6 h-6" />
                  {isAr ? "صدمة كهربائية" : "DC Shock"}
                </button>
                <button 
                  onClick={() => addLog("medication", "Epinephrine 1mg IV", "Given")}
                  className="p-3 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl border border-pink-200 font-bold text-sm flex flex-col items-center gap-2 transition-colors"
                >
                  <Syringe className="w-6 h-6" />
                  {isAr ? "إبينفرين 1mg" : "Epi 1mg IV"}
                </button>
                <button 
                  onClick={() => addLog("medication", "Amiodarone 300mg IV", "Given")}
                  className="p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl border border-purple-200 font-bold text-sm flex flex-col items-center gap-2 transition-colors"
                >
                  <Syringe className="w-6 h-6" />
                  {isAr ? "أميودارون 300mg" : "Amio 300mg"}
                </button>
                <button 
                  onClick={() => addLog("airway", "Intubation", "Size 7.5 ETT Secured")}
                  className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl border border-blue-200 font-bold text-sm flex flex-col items-center gap-2 transition-colors col-span-2"
                >
                  <User className="w-6 h-6" />
                  {isAr ? "تنبيب الرغامي (Intubation)" : "Intubation (ETT)"}
                </button>
              </div>
            </div>
          </div>

          {/* Activity Log (Event Sourcing) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-500" />
                  {isAr ? "سجل الأحداث اللحظي (Event Log)" : "Live Event Log"}
                </h3>
                <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-1 rounded-md">
                  {logs.length} {isAr ? "حدث" : "Events"}
                </span>
              </div>
              <div className="p-5 overflow-y-auto flex-1 max-h-[600px] space-y-4">
                {logs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3 opacity-50">
                    <Activity className="w-12 h-12" />
                    <p>{isAr ? "في انتظار تسجيل الإجراءات..." : "Waiting for interventions..."}</p>
                  </div>
                ) : (
                  logs.map((log, index) => (
                    <div key={log.id} className="flex gap-4 items-start group">
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                          {getLogIcon(log.type)}
                        </div>
                        {index !== logs.length - 1 && <div className="w-px h-full bg-slate-200 my-1 min-h-[24px]"></div>}
                      </div>
                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-white transition-colors">
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{log.action}</div>
                          {log.details && <div className="text-slate-500 text-xs mt-1">{log.details}</div>}
                        </div>
                        <div className="font-mono text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100">
                          {log.time}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <HeartPulse className="w-12 h-12 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-700">
            {isAr ? "لا توجد حالات طوارئ (Code Blue) نشطة حالياً" : "No Active Code Blue Events"}
          </h2>
          <p className="text-slate-500 max-w-md">
            {isAr 
              ? "نظام فريق التدخل السريع يعمل في الخلفية وجاهز لتلقي نداءات الطوارئ من أي مكان في المستشفى عبر محرك الأحداث (Event Engine)."
              : "The Rapid Response Team system is running in the background and ready to receive emergency calls from anywhere in the hospital via the Event Engine."}
          </p>
        </div>
      )}

    </div>
  );
};

export default RapidResponseTeam;
