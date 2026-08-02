import React, { useState } from "react";
import { 
  Activity, 
  Bed, 
  Users, 
  TrendingUp, 
  AlertCircle, 
  Clock, 
  Ambulance, 
  Stethoscope, 
  BrainCircuit, 
  Wallet,
  ShieldCheck,
  LineChart
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Props {
  language: "ar" | "en";
}

const revenueData = [
  { time: '00:00', value: 12000 },
  { time: '04:00', value: 18000 },
  { time: '08:00', value: 45000 },
  { time: '12:00', value: 89000 },
  { time: '16:00', value: 134000 },
  { time: '20:00', value: 156000 },
  { time: '24:00', value: 172000 },
];

export default function ExecutiveCommandCenter({ language }: Props) {
  const isAr = language === "ar";

  return (
    <div className="bg-slate-900 min-h-full p-6 font-sans text-white" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex flex-wrap items-center gap-2 sm:gap-3">
            <Activity className="w-5 h-5 sm:w-8 sm:h-8 text-rose-500" />
            {isAr ? "مركز القيادة التنفيذية" : "Executive Command Center"}
          </h2>
          <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-xs">
            {isAr ? "المستوى 16 - لوحة قيادة المستشفى الذكية" : "Level 16 - Smart Hospital Command Board"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
           <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl text-emerald-400 text-xs font-black border border-emerald-500/20 uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry
           </div>
           <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
             Export Report
           </button>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
         <MetricCard 
           title={isAr ? "إشغال الأسرة" : "Bed Occupancy"} 
           value="92%" 
           trend="+2%" 
           icon={<Bed className="w-5 h-5 text-indigo-400" />} 
           status="warning"
         />
         <MetricCard 
           title={isAr ? "حالة الطوارئ" : "ER Status"} 
           value="Code Yellow" 
           trend="Surge" 
           icon={<AlertCircle className="w-5 h-5 text-amber-400" />} 
           status="warning"
         />
         <MetricCard 
           title={isAr ? "مرضى العناية" : "ICU Patients"} 
           value="45/50" 
           trend="Critical" 
           icon={<Activity className="w-5 h-5 text-rose-400" />} 
           status="critical"
         />
         <MetricCard 
           title={isAr ? "الإيرادات اليوم" : "Revenue Today"} 
           value="$172K" 
           trend="+14%" 
           icon={<Wallet className="w-5 h-5 text-emerald-400" />} 
           status="good"
         />
         <MetricCard 
           title={isAr ? "حالات العمليات" : "OR Schedule"} 
           value="24" 
           trend="On Track" 
           icon={<Stethoscope className="w-5 h-5 text-blue-400" />} 
           status="good"
         />
         <MetricCard 
           title={isAr ? "معدل الرضا" : "Patient Sat."} 
           value="4.8/5" 
           trend="+0.2" 
           icon={<Users className="w-5 h-5 text-purple-400" />} 
           status="good"
         />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Left Column: AI & Predictive */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-sm">
              <h3 className="text-sm font-black text-indigo-300 uppercase tracking-widest flex items-center gap-2 mb-6">
                 <BrainCircuit className="w-5 h-5" />
                 {isAr ? "رؤى الذكاء الاصطناعي" : "AI Insights & Prediction"}
              </h3>
              
              <div className="space-y-4">
                 <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="text-xs font-black text-rose-300 uppercase tracking-widest">Sepsis Risk Alert</h4>
                       <span className="text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded">94% Confidence</span>
                    </div>
                    <p className="text-sm text-rose-100">3 patients in Ward B show early signs of sepsis progression. Immediate intervention recommended.</p>
                 </div>
                 
                 <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="text-xs font-black text-amber-300 uppercase tracking-widest">Bed Capacity Forecast</h4>
                       <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">Next 12 Hrs</span>
                    </div>
                    <p className="text-sm text-amber-100">Predicted 105% capacity in ICU by 8:00 PM due to incoming trauma cases.</p>
                 </div>
                 
                 <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="text-xs font-black text-emerald-300 uppercase tracking-widest">Revenue Prediction</h4>
                       <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">Q3 Projection</span>
                    </div>
                    <p className="text-sm text-emerald-100">On track to exceed quarterly revenue targets by 8% through optimized billing cycles.</p>
                 </div>
              </div>
           </div>

           <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-sm">
              <h3 className="text-sm font-black text-white/50 uppercase tracking-widest flex items-center gap-2 mb-6">
                 <Ambulance className="w-5 h-5" />
                 {isAr ? "تتبع الإسعاف" : "Ambulance Tracking"}
              </h3>
              <div className="space-y-3">
                 <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                    <div>
                       <div className="text-xs font-black text-white">Unit 01 - Trauma</div>
                       <div className="text-[10px] text-white/50">ETA: 4 mins • Cardiac Arrest</div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                 </div>
                 <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                    <div>
                       <div className="text-xs font-black text-white">Unit 04 - Transfer</div>
                       <div className="text-[10px] text-white/50">ETA: 15 mins • Stable</div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                 </div>
              </div>
           </div>
        </div>

        {/* Center/Right Column: Operations & Charts */}
        <div className="lg:col-span-2 space-y-6">
           {/* Chart */}
           <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-sm font-black text-white/50 uppercase tracking-widest flex items-center gap-2">
                    <LineChart className="w-5 h-5" />
                    {isAr ? "الإيرادات خلال اليوم" : "Intraday Revenue Tracker"}
                 </h3>
                 <span className="text-xl font-black text-emerald-400">$172,000</span>
              </div>
              <div className="h-64 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                       <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                       <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                       <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                       <Tooltip 
                         contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                         itemStyle={{ color: '#10b981' }}
                       />
                       <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Departments Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-sm">
                 <h3 className="text-sm font-black text-white/50 uppercase tracking-widest flex items-center gap-2 mb-6">
                    <Clock className="w-5 h-5" />
                    {isAr ? "مؤشرات وقت الاستجابة" : "Turnaround Times (TAT)"}
                 </h3>
                 <div className="space-y-4">
                    <ProgressBar label="Lab Results TAT" value={85} time="45m avg" target="< 60m" color="bg-emerald-500" />
                    <ProgressBar label="Radiology Reports" value={60} time="1h 20m" target="< 2h" color="bg-blue-500" />
                    <ProgressBar label="ER Wait Time" value={90} time="35m avg" target="< 30m" color="bg-amber-500" />
                    <ProgressBar label="Pharmacy Dispensing" value={95} time="12m avg" target="< 15m" color="bg-emerald-500" />
                 </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-sm flex flex-col">
                 <h3 className="text-sm font-black text-white/50 uppercase tracking-widest flex items-center gap-2 mb-6">
                    <ShieldCheck className="w-5 h-5" />
                    {isAr ? "الامتثال والجودة" : "Quality & Compliance"}
                 </h3>
                 <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-black/20 rounded-2xl p-4 flex flex-col justify-center items-center text-center border border-white/5">
                       <span className="text-3xl font-black text-white">0</span>
                       <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Never Events</span>
                    </div>
                    <div className="bg-black/20 rounded-2xl p-4 flex flex-col justify-center items-center text-center border border-white/5">
                       <span className="text-3xl font-black text-emerald-400">99.8%</span>
                       <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Medication Safety</span>
                    </div>
                    <div className="bg-black/20 rounded-2xl p-4 flex flex-col justify-center items-center text-center border border-white/5">
                       <span className="text-3xl font-black text-rose-400">2.1%</span>
                       <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Infection Rate</span>
                    </div>
                    <div className="bg-black/20 rounded-2xl p-4 flex flex-col justify-center items-center text-center border border-white/5">
                       <span className="text-3xl font-black text-blue-400">4.5%</span>
                       <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Readmission 30D</span>
                    </div>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, icon, status }: { title: string, value: string, trend: string, icon: React.ReactNode, status: 'good'|'warning'|'critical' }) {
  const getStatusColor = () => {
    switch(status) {
      case 'good': return 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400';
      case 'warning': return 'border-amber-500/30 bg-amber-500/5 text-amber-400';
      case 'critical': return 'border-rose-500/30 bg-rose-500/5 text-rose-400';
      default: return 'border-white/10 bg-white/5 text-white';
    }
  };

  return (
    <div className={`rounded-2xl p-4 border backdrop-blur-sm ${getStatusColor()} flex flex-col justify-between h-28`}>
       <div className="flex justify-between items-start">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{title}</span>
          {icon}
       </div>
       <div className="flex items-end justify-between">
          <span className="text-lg sm:text-2xl font-black">{value}</span>
          <span className="text-[10px] font-bold opacity-80">{trend}</span>
       </div>
    </div>
  );
}

function ProgressBar({ label, value, time, target, color }: { label: string, value: number, time: string, target: string, color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
         <span className="text-white">{label}</span>
         <span className="text-white/50">{time} (Target: {target})</span>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
         <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
