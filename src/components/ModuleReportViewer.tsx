import React from 'react';
import { 
  BarChart3, PieChart, TrendingUp, 
  Download, Printer, Filter, Calendar,
  FileText, Activity, Users, Clock,
  ArrowUpRight, ArrowDownRight, Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area,
  PieChart as RePieChart, Pie, Cell 
} from 'recharts';

export default function ModuleReportViewer({ 
  language, 
  moduleName, 
  data 
}: { 
  language: 'ar' | 'en', 
  moduleName: string,
  data?: any 
}) {
  const isAr = language === 'ar';

  const sampleStats = [
    { label: isAr ? "إجمالي الحالات" : "Total Cases", val: "1,240", change: "+12%", trend: "up" },
    { label: isAr ? "متوسط وقت الانتظار" : "Avg Wait Time", val: "18m", change: "-5%", trend: "down" },
    { label: isAr ? "معدل الإشغال" : "Occupancy Rate", val: "84%", change: "+2%", trend: "up" },
    { label: isAr ? "رضا المرضى" : "Patient Satisfaction", val: "4.8/5", change: "+0.1", trend: "up" }
  ];

  const chartData = [
    { name: '08:00', value: 40 },
    { name: '10:00', value: 75 },
    { name: '12:00', value: 95 },
    { name: '14:00', value: 60 },
    { name: '16:00', value: 50 },
    { name: '18:00', value: 30 }
  ];

  return (
    <div className="space-y-8" dir={isAr ? 'rtl' : 'ltr'}>
       {/* Header */}
       <div className="flex items-center justify-between">
          <div>
             <h3 className="text-xl font-black text-slate-900 tracking-tight">{isAr ? `تقارير وأداء ${moduleName}` : `${moduleName} Performance Reports`}</h3>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{isAr ? "تحليل البيانات والذكاء التشغيلي" : "Operational Data Intelligence & Analytics"}</p>
          </div>
          <div className="flex gap-3">
             <button className="h-11 px-6 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition">
                <Calendar className="w-4 h-4" />
                {isAr ? "اليوم" : "Today"}
             </button>
             <button className="h-11 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black transition shadow-xl shadow-slate-100">
                <Download className="w-4 h-4" />
                {isAr ? "تصدير PDF" : "Export PDF"}
             </button>
          </div>
       </div>

       {/* Quick Stats Grid */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleStats.map((stat, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm hover:shadow-md transition-shadow">
               <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                     <Activity className="w-4 h-4" />
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${stat.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                     {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                     {stat.change}
                  </div>
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
               <p className="text-lg sm:text-2xl font-black text-slate-900">{stat.val}</p>
            </div>
          ))}
       </div>

       {/* Chart Sections */}
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
             <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 mb-8 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                {isAr ? "توزيع الحالات حسب الوقت" : "Case Volume Over Time"}
             </h4>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={chartData}>
                      <defs>
                         <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
             <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 mb-8 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-600" />
                {isAr ? "نسبة الإنجاز والأداء" : "Operational Efficiency"}
             </h4>
             <div className="h-64 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                   <RePieChart>
                      <Pie
                        data={[
                          { name: 'Completed', value: 70 },
                          { name: 'In Progress', value: 20 },
                          { name: 'Pending', value: 10 }
                        ]}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                         <Cell fill="#10b981" />
                         <Cell fill="#4f46e5" />
                         <Cell fill="#f1f5f9" />
                      </Pie>
                      <Tooltip />
                   </RePieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <span className="text-lg sm:text-2xl font-black text-slate-900">92%</span>
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Efficiency</span>
                </div>
             </div>
          </div>
       </div>

       {/* Detailed Table */}
       <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-8 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
             <h4 className="text-xs font-black uppercase tracking-widest text-slate-800">{isAr ? "أحدث السجلات التشغيلية" : "Latest Operational Logs"}</h4>
             <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">{isAr ? "عرض الكل" : "View All Logs"}</button>
          </div>
          <div className="space-y-3">
             {[1, 2, 3].map(i => (
               <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                     <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <FileText className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-xs font-black text-slate-800">{isAr ? `تقرير دوري ${i}` : `Operational Report ${i}`}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Generated by System • 2h ago</p>
                     </div>
                  </div>
                  <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors"><Printer className="w-4 h-4" /></button>
               </div>
             ))}
          </div>
       </div>
    </div>
  );
}
