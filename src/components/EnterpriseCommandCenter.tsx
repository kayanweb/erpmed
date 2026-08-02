import React, { useState } from "react";
import { Plus, 
  Globe, Activity, Server, Database, ShieldCheck, 
  Wifi, Cpu, Zap, Network, Layers, BarChart4,
  AlertTriangle, CheckCircle2, ChevronDown, Building2,
  Users, Stethoscope, BedDouble
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from "recharts";

interface Props {
  language: "ar" | "en";
  onClose?: () => void;
}

const networkData = [
  { time: "00:00", traffic: 4000, latency: 24 },
  { time: "04:00", traffic: 3000, latency: 22 },
  { time: "08:00", traffic: 12000, latency: 35 },
  { time: "12:00", traffic: 18000, latency: 42 },
  { time: "16:00", traffic: 15000, latency: 38 },
  { time: "20:00", traffic: 8000, latency: 28 },
];

const hospitalNodes = [
  { id: "HQ-01", nameAr: "المجمع الطبي الرئيسي", nameEn: "Main Medical Complex", status: "Active", patients: 4500, beds: 5000, load: 85 },
  { id: "REG-02", nameAr: "مستشفى الأورام الإقليمي", nameEn: "Regional Oncology", status: "Active", patients: 1200, beds: 1500, load: 92 },
  { id: "TR-03", nameAr: "مركز الإصابات والطوارئ", nameEn: "Trauma Center", status: "Active", patients: 800, beds: 1000, load: 78 },
  { id: "PED-04", nameAr: "مستشفى الأطفال التخصصي", nameEn: "Specialized Pediatric", status: "Active", patients: 1500, beds: 2000, load: 65 },
  { id: "N-05", nameAr: "مركز زراعة الأعضاء", nameEn: "Transplant Center", status: "Warning", patients: 300, beds: 500, load: 98 }
];

export default function EnterpriseCommandCenter({ language, onClose }: Props) {
  const isAr = language === "ar";
  const [activeRegion, setActiveRegion] = useState("all");

  return (
    <div className="p-4 md:p-6 bg-slate-900 min-h-full font-sans text-slate-200" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-slate-800 rounded-3xl p-6 shadow-2xl border border-slate-700 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap  relative z-10">
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-rose-500 hover:border-rose-500/50 transition-all shadow-sm group shrink-0"
          >
             <Plus className="w-6 h-6 rotate-45 group-hover:scale-110 transition-transform" />
          </button>
          <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-900/50">
             <Globe className="w-5 h-5 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight flex flex-wrap items-center gap-2 sm:gap-3">
              {isAr ? "مركز القيادة الموحد (Enterprise Command)" : "Unified Enterprise Command Center"}
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-1 rounded-full uppercase tracking-widest border border-emerald-500/30">
                Live
              </span>
            </h2>
            <p className="text-sm text-slate-400 mt-1 font-medium">
              {isAr ? "إدارة الشبكة الصحية الوطنية - 10,000+ سرير" : "National Health Network Management - 10,000+ Beds"}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3 relative z-10">
          <div className="bg-slate-900/50 border border-slate-700 px-4 py-2 rounded-xl flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-bold font-mono">DR-ACTIVE (AWS eu-central-1)</span>
          </div>
          <div className="bg-slate-900/50 border border-slate-700 px-4 py-2 rounded-xl flex flex-wrap items-center gap-2 sm:gap-3">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold font-mono">99.999% SLA</span>
          </div>
        </div>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { title: isAr ? "إجمالي المرضى النشطين" : "Active Patients", value: "12,450", trend: "+12%", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-500/20" },
          { title: isAr ? "إشغال الأسرة الوطني" : "National Bed Occupancy", value: "82.4%", trend: "+1.2%", icon: BedDouble, color: "text-indigo-400", bg: "bg-indigo-400/10", border: "border-indigo-500/20" },
          { title: isAr ? "معاملات HL7/FHIR" : "HL7/FHIR Transactions", value: "2.4M/hr", trend: "Peak", icon: Network, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-500/20" },
          { title: isAr ? "تنبيهات الذكاء الاصطناعي" : "AI Critical Alerts", value: "142", trend: "-5%", icon: Zap, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-500/20" }
        ].map((stat, i) => (
          <div key={i} className={`bg-slate-800 p-5 rounded-2xl border ${stat.border} shadow-lg relative overflow-hidden group`}>
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.bg} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-3xl font-black text-white mt-2 font-mono">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 relative z-10">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.trend.startsWith('+') ? 'bg-emerald-500/20 text-emerald-400' : stat.trend === 'Peak' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {stat.trend}
              </span>
              <span className="text-[10px] text-slate-500">{isAr ? "مقارنة بالساعة الماضية" : "vs last hour"}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Hospital Nodes Status */}
        <div className="lg:col-span-2 bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                {isAr ? "شبكة المستشفيات (Multi-Hospital Nodes)" : "Multi-Hospital Nodes Status"}
              </h3>
            </div>
            <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">
              {isAr ? "إدارة التوجيه" : "Manage Load Balancing"}
            </button>
          </div>
          
          <div className="space-y-4">
            {hospitalNodes.map(node => (
              <div key={node.id} className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-xl flex flex-col xl:flex-row xl:items-center justify-between gap-4 hover:border-slate-600 transition-colors">
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                  <div className="relative">
                    <div className={`w-3 h-3 rounded-full ${node.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'} ${node.status === 'Active' ? 'animate-pulse' : ''}`}></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{isAr ? node.nameAr : node.nameEn} <span className="text-xs text-slate-500 font-mono ml-2">({node.id})</span></h4>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1"><Users className="w-3 h-3" /> {node.patients.toLocaleString()} Pts</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1"><BedDouble className="w-3 h-3" /> {node.beds.toLocaleString()} Beds</span>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-64">
                  <div className="flex justify-between text-[10px] font-bold mb-1">
                    <span className="text-slate-400">{isAr ? "السعة التشغيلية" : "Capacity"}</span>
                    <span className={node.load > 90 ? 'text-rose-400' : 'text-emerald-400'}>{node.load}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${node.load > 90 ? 'bg-rose-500' : node.load > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${node.load}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Architecture Health */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-lg flex flex-col">
          <h3 className="text-lg font-black text-white flex items-center gap-2 mb-6">
            <Server className="w-5 h-5 text-indigo-400" />
            {isAr ? "حالة البنية التحتية" : "Infrastructure Health"}
          </h3>
          
          <div className="space-y-6 flex-1">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-emerald-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300">Kafka Event Bus</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">ONLINE</span>
              </div>
              <p className="text-[10px] text-slate-500">Processing 45K events/sec</p>
            </div>
            
            <div className="bg-slate-900/50 p-4 rounded-xl border border-emerald-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300">Distributed Data Lake</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">SYNCED</span>
              </div>
              <p className="text-[10px] text-slate-500">Multi-region replication active (Delay: 12ms)</p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-amber-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300">Predictive AI Engine</span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">SCALING</span>
              </div>
              <p className="text-[10px] text-slate-500">Auto-scaling GPU nodes (+4 instances)</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Network Traffic Graph */}
      <div className="mt-6 bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            {isAr ? "تحليل تدفق البيانات (HL7/FHIR)" : "Data Flow Analytics (HL7/FHIR)"}
          </h3>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={networkData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                itemStyle={{ color: '#10b981' }}
              />
              <Area type="monotone" dataKey="traffic" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
