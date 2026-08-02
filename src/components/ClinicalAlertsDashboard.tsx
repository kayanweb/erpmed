import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Activity, 
  HeartPulse, 
  Thermometer, 
  Droplets,
  Bell,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  MoreVertical,
  BrainCircuit,
  Stethoscope,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  language: 'ar' | 'en';
}

const severityColors = {
  critical: "bg-red-50 text-red-700 border-red-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-blue-50 text-blue-700 border-blue-200"
};

const badgeColors = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-amber-500",
  low: "bg-blue-500"
};

const defaultAlerts = [
  {
    id: 1,
    patient: "Ahmed Mahmoud",
    mrn: "MRN-88239",
    room: "ICU-04",
    type: "Sepsis Risk",
    severity: "critical",
    time: "2 mins ago",
    details: "MEWS score increased to 7. Lactate 4.2 mmol/L. BP dropping.",
    icon: BrainCircuit,
    trend: [4, 4, 5, 6, 7]
  },
  {
    id: 2,
    patient: "Sarah Smith",
    mrn: "MRN-11024",
    room: "Ward-B 201",
    type: "Arrhythmia",
    severity: "high",
    time: "5 mins ago",
    details: "Frequent PVCs detected. HR > 130 bpm.",
    icon: HeartPulse,
    trend: [80, 85, 90, 120, 135]
  },
  {
    id: 3,
    patient: "Omar Hassan",
    mrn: "MRN-55312",
    room: "Ward-A 105",
    type: "Abnormal Labs",
    severity: "medium",
    time: "15 mins ago",
    details: "Potassium 2.9 mEq/L (Low). Action required.",
    icon: Droplets,
    trend: [4.0, 3.8, 3.5, 3.1, 2.9]
  },
  {
    id: 4,
    patient: "Fatima Ali",
    mrn: "MRN-99821",
    room: "ER-Bay 3",
    type: "Fever Spike",
    severity: "high",
    time: "22 mins ago",
    details: "Temp 39.5°C. Post-op day 2.",
    icon: Thermometer,
    trend: [37.2, 37.5, 38.0, 38.8, 39.5]
  }
];

export const ClinicalAlertsDashboard: React.FC<Props> = ({ language }) => {
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState("all");

  const trendData = [
    { time: '08:00', critical: 12, high: 25 },
    { time: '10:00', critical: 8, high: 30 },
    { time: '12:00', critical: 15, high: 20 },
    { time: '14:00', critical: 5, high: 18 },
    { time: '16:00', critical: 10, high: 22 },
    { time: '18:00', critical: 7, high: 15 },
  ];

  return (
    <div className={`p-6 w-full space-y-6 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          <div className="p-3 bg-red-50 rounded-xl relative">
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-ping"></span>
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
            <AlertTriangle className="w-5 h-5 sm:w-8 sm:h-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {isAr ? "مركز التنبيهات السريرية الذكي" : "Clinical Alerts Engine"}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {isAr ? "مراقبة وتحليل العلامات الحيوية بالذكاء الاصطناعي" : "AI-powered vital sign monitoring and early warning scores"}
            </p>
          </div>
        </div>
        <div className="flex gap-2 min-w-max">
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            {isAr ? "تصفية" : "Filter"}
          </button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {isAr ? "إقرار الكل" : "Acknowledge All"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Left Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 text-white shadow-lg shadow-red-500/20">
              <div className="flex justify-between items-start mb-2">
                <AlertCircle className="w-6 h-6 text-red-100" />
                <span className="bg-red-400/30 px-2 py-1 rounded-md text-xs font-bold">+3 {isAr ? "اليوم" : "Today"}</span>
              </div>
              <h3 className="text-3xl font-black mb-1">12</h3>
              <p className="text-red-100 text-sm">{isAr ? "حرجة جداً" : "Critical"}</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 text-white shadow-lg shadow-orange-500/20">
              <div className="flex justify-between items-start mb-2">
                <Activity className="w-6 h-6 text-orange-100" />
                <span className="bg-orange-400/30 px-2 py-1 rounded-md text-xs font-bold">-2 {isAr ? "اليوم" : "Today"}</span>
              </div>
              <h3 className="text-3xl font-black mb-1">34</h3>
              <p className="text-orange-100 text-sm">{isAr ? "عالية الخطورة" : "High Risk"}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 mb-4">{isAr ? "مؤشر الخطر (MEWS)" : "Risk Trend (MEWS)"}</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorCrit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorCrit)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-100 p-2 flex gap-1">
              {[
                { id: "all", label: isAr ? "الكل" : "All Alerts" },
                { id: "critical", label: isAr ? "حرجة" : "Critical" },
                { id: "sepsis", label: isAr ? "تسمم الدم" : "Sepsis Watch" },
                { id: "deterioration", label: isAr ? "تدهور الحالة" : "Deterioration" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id 
                      ? "bg-slate-100 text-slate-800" 
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-2 space-y-2">
              {defaultAlerts.map(alert => (
                <div key={alert.id} className={`p-4 rounded-xl border transition-all hover:shadow-md ${severityColors[alert.severity as keyof typeof severityColors]}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className={`p-3 bg-white/60 rounded-xl`}>
                        <alert.icon className={`w-6 h-6`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold">{alert.patient}</h4>
                          <span className="text-xs bg-white/50 px-2 py-0.5 rounded-full font-mono">{alert.mrn}</span>
                          <span className="text-xs bg-white/50 px-2 py-0.5 rounded-full font-medium">{alert.room}</span>
                        </div>
                        <p className="font-semibold text-sm mb-1">{alert.type}</p>
                        <p className="text-sm opacity-80">{alert.details}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1 text-xs opacity-70">
                        <Clock className="w-3 h-3" />
                        {alert.time}
                      </div>
                      <button className="px-3 py-1.5 bg-white shadow-sm rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">
                        {isAr ? "مراجعة الحالة" : "Review Case"}
                      </button>
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

export default ClinicalAlertsDashboard;
