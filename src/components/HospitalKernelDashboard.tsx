import React, { useState } from 'react';
import { 
  Server, ShieldAlert, Cpu, Activity, Database, Key, Settings,
  Globe, Lock, Zap, HardDrive, ShieldCheck, RefreshCw, AlertCircle,
  Wifi, Power
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

interface Props {
  language: 'ar' | 'en';
}

const cpuData = [
  { time: '00:00', usage: 45 }, { time: '04:00', usage: 52 },
  { time: '08:00', usage: 78 }, { time: '12:00', usage: 85 },
  { time: '16:00', usage: 65 }, { time: '20:00', usage: 50 },
  { time: '24:00', usage: 48 },
];

const networkData = [
  { time: '00:00', in: 120, out: 80 }, { time: '04:00', in: 150, out: 90 },
  { time: '08:00', in: 450, out: 200 }, { time: '12:00', in: 600, out: 350 },
  { time: '16:00', in: 400, out: 180 }, { time: '20:00', in: 250, out: 120 },
  { time: '24:00', in: 130, out: 85 },
];

export default function HospitalKernelDashboard({ language }: Props) {
  const isAr = language === 'ar';
  
  const metrics = [
    { label: isAr ? "استهلاك المعالج" : "CPU Usage", value: "34%", status: "Healthy", icon: Cpu, color: "text-emerald-400" },
    { label: isAr ? "الذاكرة العشوائية" : "RAM Usage", value: "62%", status: "Normal", icon: Activity, color: "text-blue-400" },
    { label: isAr ? "مساحة التخزين" : "Storage", value: "48%", status: "Good", icon: HardDrive, color: "text-indigo-400" },
    { label: isAr ? "حالة الشبكة" : "Network", value: "99.9%", status: "Optimal", icon: Wifi, color: "text-emerald-400" },
  ];

  const servers = [
    { name: "Main DB (PostgreSQL)", status: "Online", uptime: "99.99%", load: "45%", lastBackup: "2 hrs ago" },
    { name: "API Gateway Node 1", status: "Online", uptime: "99.95%", load: "32%", lastBackup: "N/A" },
    { name: "API Gateway Node 2", status: "Online", uptime: "99.98%", load: "28%", lastBackup: "N/A" },
    { name: "Redis Cache", status: "Warning", uptime: "95.50%", load: "88%", lastBackup: "5 mins ago" },
    { name: "PACS Image Server", status: "Online", uptime: "99.90%", load: "65%", lastBackup: "1 hr ago" },
  ];

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-950 text-slate-300" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-2 sm:py-4 shrink-0 shadow-sm z-10 flex flex-row flex-wrap items-center justify-between gap-2 sm:gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 bg-indigo-900/50 rounded-xl flex items-center justify-center text-indigo-400 shrink-0 border border-indigo-500/20">
            <Server size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-tight">
              {isAr ? "نواة النظام وإدارة السيرفرات (IT)" : "System Kernel & IT Operations"}
            </h1>
            <p className="text-xs font-bold text-slate-500">
              {isAr ? "التحكم في البنية التحتية، الصلاحيات، وقواعد البيانات" : "Infrastructure, Access Control & Database Management"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-900/30 text-emerald-400 border border-emerald-800/50">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {isAr ? "النظام مستقر" : "System Stable"}
          </div>
          <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-6">
        
        {/* Top Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, idx) => (
            <div key={idx} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">{metric.label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-black text-white">{metric.value}</h3>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-800 ${metric.color}`}>
                    {metric.status}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-xl bg-slate-800 border border-slate-700 ${metric.color}`}>
                <metric.icon size={24} />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-slate-400 mb-6 flex items-center gap-2">
              <Cpu size={16} />
              {isAr ? "استهلاك المعالج (24 ساعة)" : "CPU Utilization (24h)"}
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cpuData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#818cf8' }}
                  />
                  <Area type="monotone" dataKey="usage" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-slate-400 mb-6 flex items-center gap-2">
              <Globe size={16} />
              {isAr ? "حركة مرور الشبكة (Mbps)" : "Network Traffic (Mbps)"}
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={networkData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="in" name={isAr ? "وارد" : "Inbound"} stroke="#34d399" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="out" name={isAr ? "صادر" : "Outbound"} stroke="#f472b6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Server Nodes Table */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database size={16} className="text-indigo-400" />
              {isAr ? "عقد الخوادم وقواعد البيانات" : "Server Nodes & Databases"}
            </h3>
            <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
              {isAr ? "عرض الكل" : "View All"}
            </button>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left" dir={isAr ? 'rtl' : 'ltr'}>
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="p-4 text-xs font-black text-slate-400 uppercase">{isAr ? "اسم العقدة" : "Node Name"}</th>
                  <th className="p-4 text-xs font-black text-slate-400 uppercase">{isAr ? "الحالة" : "Status"}</th>
                  <th className="p-4 text-xs font-black text-slate-400 uppercase">{isAr ? "وقت التشغيل" : "Uptime"}</th>
                  <th className="p-4 text-xs font-black text-slate-400 uppercase">{isAr ? "الحمل" : "Load"}</th>
                  <th className="p-4 text-xs font-black text-slate-400 uppercase">{isAr ? "آخر نسخ احتياطي" : "Last Backup"}</th>
                  <th className="p-4 text-xs font-black text-slate-400 uppercase text-center">{isAr ? "إجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {servers.map((server, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-bold text-white">{server.name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-max
                        ${server.status === 'Online' ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-800/50' : 
                          'bg-amber-900/40 text-amber-400 border border-amber-800/50'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${server.status === 'Online' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        {server.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-300">{server.uptime}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-300 w-8">{server.load}</span>
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${parseInt(server.load) > 80 ? 'bg-rose-500' : 'bg-indigo-500'}`} 
                            style={{ width: server.load }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-400">{server.lastBackup}</td>
                    <td className="p-4 flex justify-center gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors" title={isAr ? "إعادة تشغيل" : "Restart"}>
                        <Power size={14} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors" title={isAr ? "إعدادات" : "Settings"}>
                        <Settings size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
