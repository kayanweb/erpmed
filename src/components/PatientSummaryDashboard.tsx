import React from 'react';
import { useHIS } from '../context/HISContext';
import { 
  BarChart3, Activity, Users, Bed, 
  Stethoscope, Zap, Heart, TrendingUp,
  AlertCircle, ShieldAlert, Clock,
  ArrowUpRight, ArrowDownRight, Building2,
  Calendar, Map, PieChart as PieChartIcon
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as ReTooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

export default function PatientSummaryDashboard({ language, onClose }: { language: 'ar' | 'en', onClose?: () => void }) {
  const isAr = language === 'ar';
  const { patients, patientJourneys } = useHIS();

  const stats = [
    { label: isAr ? "إجمالي المرضى" : "Total Patients", val: patients.length, change: "+5%", trend: "up", icon: Users, color: "indigo" },
    { label: isAr ? "الحالات النشطة" : "Active Journeys", val: patientJourneys.filter(j => !j.endTime).length, change: "+12%", trend: "up", icon: Activity, color: "rose" },
    { label: isAr ? "إشغال الأسرّة" : "Bed Occupancy", val: "78%", change: "-2%", trend: "down", icon: Bed, color: "amber" },
    { label: isAr ? "المرضى المخرجين" : "Total Discharged", val: "442", change: "+8%", trend: "up", icon: Building2, color: "emerald" }
  ];

  const occupancyData = [
    { name: 'ER', value: 85 },
    { name: 'ICU', value: 92 },
    { name: 'Ward A', value: 70 },
    { name: 'Ward B', value: 65 }
  ];

  const COLORS = ['#4f46e5', '#f43f5e', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-8" dir={isAr ? 'rtl' : 'ltr'}>
       {/* Dashboard Header */}
       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap  sm:gap-6">
             <button 
               onClick={onClose}
               className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm group"
             >
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 rotate-45 group-hover:scale-110 transition-transform" />
             </button>
             <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">{isAr ? "نظام الرصد المركزي لرحلة المريض" : "Central Patient Journey Monitor"}</h2>
                <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-[0.1em] sm:tracking-[0.2em] mt-1">{isAr ? "تحليل الذكاء التشغيلي اللحظي" : "Real-time Operational Intelligence Analytics"}</p>
             </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
             <button className="flex-1 sm:flex-none h-10 sm:h-12 px-4 sm:px-6 bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition shadow-sm whitespace-nowrap">
                <Calendar className="w-3.5 h-3.5 sm:w-4 h-4" />
                {isAr ? "آخر 24 ساعة" : "Last 24 Hours"}
             </button>
             <button className="flex-1 sm:flex-none h-10 sm:h-12 px-4 sm:px-6 bg-slate-900 text-white rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition shadow-xl shadow-slate-100 whitespace-nowrap">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 h-4" />
                {isAr ? "تحليل الأداء" : "Performance Analytics"}
             </button>
          </div>
       </div>

       {/* Top Stats Grid */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-slate-100 rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
               <div className="flex items-center justify-between mb-6">
                  <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}>
                     <stat.icon className="w-6 h-6" />
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${stat.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                     {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                     {stat.change}
                  </div>
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
               <p className="text-3xl font-black text-slate-900">{stat.val}</p>
               
               {/* Background Accent */}
               <div className={`absolute -bottom-4 -right-4 w-24 h-24 bg-${stat.color}-50/50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
            </motion.div>
          ))}
       </div>

       {/* Main Charts & Lists */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Journey Flow Analytics */}
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-sm">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-800 flex flex-wrap items-center gap-2 sm:gap-3">
                   <Map className="w-4 h-4 sm:w-5 h-5 text-indigo-600" />
                   {isAr ? "تدفق المرضى عبر الأقسام" : "Patient Flow Distribution"}
                </h3>
                <div className="flex gap-2 min-w-max">
                   <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      <span className="text-[9px] font-black text-slate-500">Live Traffic</span>
                   </div>
                </div>
             </div>
             <div className="h-[250px] sm:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={occupancyData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#64748b'}} width={80} />
                      <ReTooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={32}>
                         {occupancyData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                      </Bar>
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Critical Alerts & Notifications */}
          <div className="bg-slate-900 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
             <div className="relative z-10 flex-1 flex flex-col h-full min-h-0">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-indigo-400 mb-6 sm:mb-8 flex flex-wrap items-center gap-2 sm:gap-3">
                   <ShieldAlert className="w-4 h-4 sm:w-5 h-5" />
                   {isAr ? "تنبيهات حرجة ونظام التحذير" : "Critical Command Alerts"}
                </h3>
                
                <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
                   {[
                     { msg: isAr ? "انخفاض الأكسجين - غرفة 4" : "SpO2 Alert - Room 4", time: "2m ago", type: "CRITICAL" },
                     { msg: isAr ? "تأخر في صرف الدواء - جناح أ" : "Medication Delay - Ward A", time: "5m ago", type: "WARNING" },
                     { msg: isAr ? "وصول حالة طوارئ حمراء" : "Red Code Arrival - ER", time: "12m ago", type: "CRITICAL" },
                     { msg: isAr ? "امتلاء سعة الرعاية المركزة" : "ICU Capacity Reached", time: "25m ago", type: "INFO" }
                   ].map((notif, i) => (
                     <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-4 hover:bg-white/10 transition-colors">
                        <div className={`mt-1 w-2 h-2 rounded-full ${notif.type === 'CRITICAL' ? 'bg-rose-500 animate-pulse' : notif.type === 'WARNING' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                        <div>
                           <p className="text-xs font-bold text-slate-200">{notif.msg}</p>
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{notif.time}</p>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="mt-8 p-6 bg-indigo-600 rounded-3xl text-center">
                   <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">{isAr ? "كفاءة التدفق الكلية" : "Global Flow Efficiency"}</p>
                   <p className="text-3xl font-black text-white">94.8%</p>
                </div>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[120px] rounded-full"></div>
          </div>
       </div>

       {/* Summary Analytics Bar */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                   <Clock className="w-4 h-4 text-amber-500" />
                   {isAr ? "تحليل أوقات الانتظار" : "Wait Time Analytics"}
                </h3>
                <span className="text-[9px] font-black text-emerald-500 uppercase">Within Target</span>
             </div>
             <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={[
                     { n: 'Mon', v: 20 }, { n: 'Tue', v: 35 }, { n: 'Wed', v: 25 }, 
                     { n: 'Thu', v: 45 }, { n: 'Fri', v: 30 }, { n: 'Sat', v: 15 }, { n: 'Sun', v: 10 }
                   ]}>
                      <defs>
                         <linearGradient id="colorWait" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorWait)" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                   <Activity className="w-4 h-4 text-indigo-600" />
                   {isAr ? "توزيع تشخيصات اليوم" : "Today's Clinical Distribution"}
                </h3>
                <span className="text-[9px] font-black text-slate-400 uppercase">Top 4 Specialty</span>
             </div>
             <div className="h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie
                        data={[
                          { name: 'Internal', value: 40 },
                          { name: 'ER', value: 30 },
                          { name: 'Surgical', value: 20 },
                          { name: 'Other', value: 10 }
                        ]}
                        innerRadius={40}
                        outerRadius={60}
                        dataKey="value"
                      >
                         {COLORS.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                      </Pie>
                   </PieChart>
                </ResponsiveContainer>
             </div>
          </div>
       </div>
    </div>
  );
}
