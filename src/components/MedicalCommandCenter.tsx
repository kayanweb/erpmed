import React, { useState, useEffect } from 'react';
import { 
  Activity, ShieldAlert, Cpu, HeartPulse, BedDouble, 
  Wind, Zap, Map, Users, Stethoscope, Syringe, TestTube,
  Microscope, FileText, Banknote, ShieldCheck, Wrench, Siren, Car,
  Clock, TrendingUp, TrendingDown, Maximize2, CheckCircle, 
  ChevronRight, AlertTriangle, UserPlus, UserMinus, BarChart3,
  Bell, Settings, UserCheck, AlertCircle, Search
} from 'lucide-react';
import { useHIS } from "../context/HISContext";
import { toast } from "sonner";
import { motion } from 'framer-motion';

interface Props {
  language: 'ar' | 'en';
}

const CommandCenterIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
);

export default function MedicalCommandCenter({ language }: Props) {
  const isAr = language === 'ar';
  const { patients = [], erQueue = [] } = useHIS();
  const [time, setTime] = React.useState("");
  
  React.useEffect(() => {
    setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const erPatients = patients.filter(p => p.status === "triage" || p.departmentId === "er-unit");
  const ipdPatients = patients.filter(p => p.status === "ward" || p.departmentId?.includes("ward") || p.departmentId === "icu" || p.departmentId === "nicu");

  const alerts = [
    { id: 1, type: 'critical', dept: 'ER', message: erPatients.length > 5 ? 'High Volume in ER' : 'ER Status: Stable', time: 'Now' },
    { id: 2, type: 'warning', dept: 'IPD', message: `Occupancy: ${Math.round((ipdPatients.length / 450) * 100)}%`, time: 'Now' },
    { id: 3, type: 'info', dept: 'System', message: 'HIS Core Services: Online', time: 'Live' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0a0f1c] text-slate-100 overflow-hidden font-sans select-none relative">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-transparent to-rose-900/10 pointer-events-none" />

      {/* Cinematic Header */}
      <div className="p-6 bg-[#0a0f1c]/90 backdrop-blur-xl border-b border-slate-800/50 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20 ring-1 ring-white/20"
          >
            <ShieldCheck size={28} className="animate-pulse" />
          </motion.div>
          <div>
            <div className="flex items-center gap-3">
              <motion.h1 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-2xl font-black tracking-tighter uppercase leading-none text-white"
              >
                {isAr ? "مركز القيادة والتحكم الطبي" : "Medical Command & Control"}
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[9px] font-black tracking-[0.2em] border border-emerald-500/20"
              >
                LIVE OPS
              </motion.div>
            </div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1"
            >
              {isAr ? "نظام إدارة المستشفيات المتكامل - النسخة المؤسسية" : "Unified Hospital Information System - Enterprise v4.8"}
            </motion.p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right hidden md:block">
            <div className="text-2xl font-mono font-black text-white tracking-tighter">{time}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
          <div className="flex gap-2">
             <button className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-400 border border-slate-700/50 hover:text-white hover:bg-slate-700 transition-all cursor-pointer">
                <Bell size={20} />
             </button>
             <button className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-400 border border-slate-700/50 hover:text-white hover:bg-slate-700 transition-all cursor-pointer">
                <Settings size={20} />
             </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6 relative z-10">
        {/* Real-time KPI Ribbon */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
           {[
             { label: isAr ? "إجمالي المرضى" : "TOTAL CENSUS", value: patients.length, trend: "+12%", color: "indigo", icon: Users },
             { label: isAr ? "الانتظار في الطوارئ" : "ER WAIT LIST", value: erQueue.length, trend: "High", color: "rose", icon: Activity },
             { label: isAr ? "إشغال الأسرّة" : "BED OCCUPANCY", value: "84%", trend: "Stable", color: "emerald", icon: Map },
             { label: isAr ? "تحت الإجراء" : "IN-PROGRESS", value: 34, trend: "Busy", color: "amber", icon: Clock },
             { label: isAr ? "جاهز للخروج" : "READY TO DC", value: 18, trend: "Normal", color: "cyan", icon: UserCheck },
           ].map((kpi, idx) => (
             <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: idx * 0.1 }}
               key={kpi.label} 
               className="bg-slate-800/40 backdrop-blur-md border border-slate-700/30 p-5 rounded-3xl hover:bg-slate-800/60 transition-all group shadow-lg"
             >
                <div className="flex items-center justify-between mb-4">
                   <div className={`p-2.5 rounded-xl bg-slate-900/80 text-${kpi.color}-400 ring-1 ring-inset ring-slate-700 group-hover:scale-110 transition-transform`}>
                      <kpi.icon size={18} />
                   </div>
                   <span className={`text-[10px] font-black uppercase tracking-widest ${kpi.trend === 'High' ? 'text-rose-400 animate-pulse' : 'text-slate-500'}`}>
                      {kpi.trend}
                   </span>
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{kpi.label}</div>
                <div className="text-2xl font-black text-white tracking-tighter">{kpi.value}</div>
             </motion.div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Operations Map / Queue View */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="lg:col-span-8 space-y-6"
          >
             <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/30 rounded-[32px] overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-700/30 flex items-center justify-between bg-slate-900/30">
                   <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">{isAr ? "خريطة تدفق المرضى (Live Patient Flow)" : "Live Patient Flow Dynamics"}</h3>
                   <div className="flex gap-2">
                      {['ER', 'OPD', 'IPD', 'OR'].map(dept => (
                        <span key={dept} className="px-3 py-1 bg-slate-900 rounded-lg text-[9px] font-black text-slate-400 border border-slate-700/50">{dept}</span>
                      ))}
                   </div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{isAr ? "توزيع الإشغال" : "Departmental Saturation"}</h4>
                      {[
                        { name: isAr ? 'قسم الطوارئ' : 'Emergency Dept', val: 92, color: 'bg-rose-500' },
                        { name: isAr ? 'العيادات الخارجية' : 'Outpatient Dept', val: 68, color: 'bg-indigo-500' },
                        { name: isAr ? 'التنويم الداخلي' : 'Inpatient Wards', val: 84, color: 'bg-emerald-500' },
                        { name: isAr ? 'غرف العمليات' : 'Operating Rooms', val: 45, color: 'bg-amber-500' },
                      ].map((dept, i) => (
                        <div key={dept.name} className="space-y-2">
                           <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter">
                              <span className="text-slate-300">{dept.name}</span>
                              <span className="text-slate-500">{dept.val}%</span>
                           </div>
                           <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${dept.val}%` }}
                                transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                                className={`h-full ${dept.color}`} 
                              />
                           </div>
                        </div>
                      ))}
                   </div>
                   <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-700/30">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{isAr ? "تحليل الانتظار" : "Wait Time Analytics"}</h4>
                      <div className="space-y-6">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 flex items-center justify-center">
                               <span className="text-xs font-black text-indigo-400">22m</span>
                            </div>
                            <div>
                               <div className="text-[10px] font-black text-slate-300 uppercase">Avg Triage Time</div>
                               <div className="text-[9px] font-bold text-emerald-400">Within Target</div>
                            </div>
                         </div>
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border-4 border-rose-500/20 border-t-rose-500 flex items-center justify-center">
                               <span className="text-xs font-black text-rose-400">58m</span>
                            </div>
                            <div>
                               <div className="text-[10px] font-black text-slate-300 uppercase">Avg Doctor Wait</div>
                               <div className="text-[9px] font-bold text-rose-400">Exceeds Target (+12m)</div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/30 rounded-[32px] p-6 shadow-xl">
                   <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">{isAr ? "صحة النظام" : "System Health"}</h3>
                      <Activity size={18} className="text-emerald-500 animate-pulse" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'EHR API', val: '99.9%', status: 'optimal' },
                        { label: 'PACS SYNC', val: '0.4s', status: 'optimal' },
                        { label: 'DB LATENCY', val: '12ms', status: 'optimal' },
                        { label: 'AI ENGINE', val: 'LIVE', status: 'optimal' },
                      ].map(stat => (
                        <div key={stat.label} className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/30">
                           <div className="text-[8px] font-black text-slate-500 uppercase mb-1">{stat.label}</div>
                           <div className="text-xs font-black text-white">{stat.val}</div>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/30 rounded-[32px] p-6 shadow-xl">
                   <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">{isAr ? "الامتثال والجودة" : "Quality Compliance"}</h3>
                      <AlertTriangle size={18} className="text-amber-500" />
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black text-slate-400">Handover Accuracy</span>
                         <span className="text-xs font-black text-emerald-400">96.4%</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black text-slate-400">Clinical Documentation</span>
                         <span className="text-xs font-black text-emerald-400">92.1%</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black text-slate-400">MAR Compliance</span>
                         <span className="text-xs font-black text-rose-400">88.5%</span>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>

          {/* Activity Ledger / Alerts Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-4 space-y-6"
          >
             <div className="bg-rose-500/10 backdrop-blur-md border border-rose-500/20 rounded-[32px] p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
                      <Zap size={16} />
                   </div>
                   <h3 className="text-sm font-black uppercase tracking-widest text-rose-400">{isAr ? "تنبيهات فورية" : "Critical Alerts"}</h3>
                </div>
                <div className="space-y-3">
                   <div className="p-3 bg-[#0a0f1c]/80 rounded-xl border border-rose-500/30 flex items-start gap-3">
                      <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={16} />
                      <div>
                         <div className="text-[10px] font-black text-white uppercase tracking-tight">Rapid Response - Room 302</div>
                         <div className="text-[9px] font-bold text-slate-500 mt-0.5">Vitals alert: HR 142 / SpO2 88%</div>
                      </div>
                   </div>
                   <div className="p-3 bg-[#0a0f1c]/80 rounded-xl border border-amber-500/30 flex items-start gap-3">
                      <Clock className="text-amber-500 shrink-0 mt-0.5" size={16} />
                      <div>
                         <div className="text-[10px] font-black text-white uppercase tracking-tight">ER Triage Overload</div>
                         <div className="text-[9px] font-bold text-slate-500 mt-0.5">4 Category 2 cases waiting &gt; 15m</div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/30 rounded-[32px] overflow-hidden flex flex-col h-[400px] shadow-xl">
                <div className="p-6 border-b border-slate-700/30 bg-slate-900/30">
                   <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">{isAr ? "سجل الحركات السريرية" : "Global Clinical Stream"}</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                   {patients.length > 0 ? patients.slice(0, 10).map((p, i) => (
                     <div key={p.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-700">
                        <div className="absolute left-[-3px] top-1.5 w-2 h-2 rounded-full bg-slate-500" />
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
                          {new Date(Date.now() - i * 1200000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-[11px] font-bold text-slate-200">
                           {isAr ? `تحديث حالة المريض ${p.nameAr}` : `Update: Patient ${p.nameEn} status changed to ${p.status}`}
                        </div>
                        <div className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter mt-1">{p.mrn}</div>
                     </div>
                   )) : (
                     <div className="text-center py-20 text-slate-600 italic text-xs uppercase tracking-widest">Awaiting telemetry stream...</div>
                   )}
                </div>
             </div>
          </motion.div>
        </div>
      </div>

      {/* Cyber Footer */}
      <div className="p-4 bg-[#0a0f1c]/90 backdrop-blur-xl border-t border-slate-800/50 flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] relative z-20">
         <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-emerald-500"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> CLOUD SYNC ACTIVE</span>
            <span>NODES: LON-22 / KSA-01</span>
         </div>
         <div className="flex items-center gap-6">
            <span>SECURE-TUNNEL: AES-256</span>
            <span className="text-white">POWERED BY ANTIGRAVITY ENGINE</span>
         </div>
      </div>
    </div>
  );
}
