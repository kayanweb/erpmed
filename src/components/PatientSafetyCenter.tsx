import React, { useState, useEffect } from "react";
import { AlertTriangle, ShieldAlert, Activity, HeartPulse, BrainCircuit, Users, ChevronDown, CheckCircle2, Siren, ArrowUpRight, MapPin } from "lucide-react";

interface Props {
  language: "ar" | "en";
}

interface RiskPatient {
  id: string;
  mrn: string;
  name: string;
  location: string;
  doctor: string;
  riskType: string;
  riskScore: number;
  vitalSign: string;
  vitalValue: string;
  trend: "up" | "down" | "stable";
  lastUpdate: string;
}

export const PatientSafetyCenter: React.FC<Props> = ({ language }) => {
  const isAr = language === "ar";

  const [activeAlerts, setActiveAlerts] = useState<RiskPatient[]>([
    {
      id: "p1",
      mrn: "20260012",
      name: isAr ? "أحمد محمود سالم" : "Ahmed Mahmoud Salem",
      location: "Ward B - Bed 12",
      doctor: isAr ? "د. محمد علي" : "Dr. Mohamed Ali",
      riskType: "Sepsis Risk",
      riskScore: 85,
      vitalSign: "BP",
      vitalValue: "85/50",
      trend: "down",
      lastUpdate: "Just now",
    },
    {
      id: "p2",
      mrn: "20260018",
      name: isAr ? "نورة عبدالله حسن" : "Noura Abdallah Hassan",
      location: "ICU - Bed 4",
      doctor: isAr ? "د. معتز إبراهيم" : "Dr. Moataz Ibrahim",
      riskType: "Stroke Risk",
      riskScore: 92,
      vitalSign: "GCS",
      vitalValue: "Drop 2 pts",
      trend: "down",
      lastUpdate: "2 mins ago",
    },
    {
      id: "p3",
      mrn: "20260045",
      name: isAr ? "يوسف كامل" : "Youssef Kamel",
      location: "ER - Triage",
      doctor: "N/A",
      riskType: "STEMI",
      riskScore: 98,
      vitalSign: "ECG",
      vitalValue: "ST Elev",
      trend: "up",
      lastUpdate: "Just now",
    },
    {
      id: "p4",
      mrn: "20260088",
      name: isAr ? "سامية عمر" : "Samia Omar",
      location: "Ward A - Bed 03",
      doctor: isAr ? "د. سارة فهد" : "Dr. Sarah Fahd",
      riskType: "Fall Risk",
      riskScore: 75,
      vitalSign: "Mobility",
      vitalValue: "Unsteady",
      trend: "stable",
      lastUpdate: "15 mins ago",
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAlerts(prev => {
        const newAlerts = [...prev];
        if (newAlerts[0].vitalValue === "85/50") {
          newAlerts[0].vitalValue = "75/45";
          newAlerts[0].riskScore = 95;
        } else {
          newAlerts[0].vitalValue = "85/50";
          newAlerts[0].riskScore = 85;
        }
        return newAlerts;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (score: number) => {
    if (score >= 90) return "bg-rose-500 text-white shadow-rose-500/40 animate-pulse";
    if (score >= 80) return "bg-orange-500 text-white shadow-orange-500/40";
    return "bg-amber-500 text-white shadow-amber-500/40";
  };

  const getRiskBorder = (score: number) => {
    if (score >= 90) return "border-rose-500/50 bg-rose-50/50";
    if (score >= 80) return "border-orange-500/50 bg-orange-50/50";
    return "border-amber-500/50 bg-amber-50/50";
  };

  return (
    <div className={`p-6 w-full space-y-6 ${isAr ? "text-right" : "text-left"}`} dir={isAr ? "rtl" : "ltr"}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <ShieldAlert className="w-48 h-48 -mt-10 -mr-10" />
        </div>
        <div className="relative z-10">
          <h1 className="text-lg sm:text-2xl font-black flex flex-wrap items-center gap-2 sm:gap-3">
            <ShieldAlert className="w-5 h-5 sm:w-8 sm:h-8 text-rose-500" />
            {isAr ? "مركز سلامة المرضى المؤسسي" : "Enterprise Patient Safety Center"}
          </h1>
          <p className="text-slate-400 mt-1">
            {isAr ? "مراقبة المخاطر السريرية بالذكاء الاصطناعي (Live Alerts)" : "AI-Powered Clinical Risk Surveillance (Live Alerts)"}
          </p>
        </div>
        <div className="flex gap-4 relative z-10">
          <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl flex items-center gap-2 sm:gap-4 flex-wrap ">
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 uppercase tracking-wider">{isAr ? "المرضى تحت الخطر" : "Patients at Risk"}</span>
              <span className="text-lg sm:text-2xl font-black text-rose-400">14</span>
            </div>
            <div className="w-px h-10 bg-slate-700 mx-2"></div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 uppercase tracking-wider">{isAr ? "تنبيهات حرجة" : "Critical Alerts"}</span>
              <span className="text-lg sm:text-2xl font-black text-white flex items-center gap-2">
                <Siren className="w-5 h-5 text-rose-500 animate-pulse" /> 3
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Live Alerts Stream */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              {isAr ? "تيار التنبيهات المباشر" : "Live Alert Stream"}
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {isAr ? "تحديث تلقائي (Real-time)" : "Auto-updating (Real-time)"}
            </div>
          </div>

          <div className="space-y-4">
            {activeAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-5 rounded-2xl border shadow-sm transition-all duration-300 flex flex-col xl:flex-row xl:items-center justify-between gap-4 ${getRiskBorder(alert.riskScore)}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-black text-lg shadow-lg shrink-0 ${getRiskColor(alert.riskScore)}`}>
                    {alert.riskScore}%
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800 text-lg">{alert.name}</h3>
                      <span className="text-xs font-mono bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-500">
                        {alert.mrn}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm font-medium">
                      <span className="text-rose-600 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" /> {alert.riskType}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600 flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {alert.location}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600 flex items-center gap-1">
                        <Users className="w-4 h-4" /> {alert.doctor}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 bg-white/60 p-3 rounded-xl border border-white/40 md:w-auto w-full justify-between">
                  <div className="flex flex-col items-center min-w-[80px]">
                    <span className="text-xs text-slate-500 mb-1">{alert.vitalSign}</span>
                    <span className={`font-black text-lg flex items-center gap-1 ${
                      alert.trend === 'down' ? 'text-rose-500' : alert.trend === 'up' ? 'text-amber-500' : 'text-slate-700'
                    }`}>
                      {alert.vitalValue}
                    </span>
                  </div>
                  
                  {alert.riskScore >= 90 ? (
                    <button className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-md shadow-rose-600/20 flex items-center gap-2 transition-colors whitespace-nowrap">
                      <Siren className="w-4 h-4" />
                      {isAr ? "استدعاء RRT" : "Call RRT"}
                    </button>
                  ) : (
                    <button className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold shadow-md flex items-center gap-2 transition-colors whitespace-nowrap">
                      <ArrowUpRight className="w-4 h-4" />
                      {isAr ? "تصعيد للطبيب" : "Escalate"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis & Rules Engine Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <BrainCircuit className="w-5 h-5 text-indigo-500" />
              {isAr ? "محركات المخاطر (Engines)" : "Risk Engines"}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg transition-colors">
                <span className="text-sm font-medium text-slate-700">Sepsis Bundle</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg transition-colors">
                <span className="text-sm font-medium text-slate-700">Stroke Alert</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg transition-colors">
                <span className="text-sm font-medium text-slate-700">Fall Risk (Morse)</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg transition-colors">
                <span className="text-sm font-medium text-slate-700">VTE Risk</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg transition-colors">
                <span className="text-sm font-medium text-slate-700">Pressure Injury</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
            <button className="w-full mt-4 py-2 border border-slate-200 text-slate-600 font-medium rounded-lg text-sm hover:bg-slate-50 transition-colors">
              {isAr ? "عرض جميع البروتوكولات" : "View All Protocols"}
            </button>
          </div>

          <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
            <h3 className="font-bold text-indigo-900 mb-2">
              {isAr ? "التصعيد التلقائي (Auto Escalation)" : "Auto Escalation"}
            </h3>
            <p className="text-sm text-indigo-700/80 mb-4 leading-relaxed">
              {isAr 
                ? "يتم تصعيد التنبيهات الحرجة أوتوماتيكياً للرئيس المباشر إذا لم يتم اتخاذ إجراء خلال 15 دقيقة بواسطة المحرك."
                : "Critical alerts are auto-escalated to seniors if no action is taken within 15 minutes by the Escalation Engine."}
            </p>
            <div className="bg-white rounded-lg p-3 text-sm font-mono text-indigo-800 border border-indigo-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Engine Active (14ms latency)
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientSafetyCenter;
