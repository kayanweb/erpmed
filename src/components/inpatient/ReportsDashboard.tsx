import React from "react";
import { BarChart3, TrendingUp, PieChart, Download, Calendar, Filter, Users, Activity, Clock } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, AreaChart, Area } from "recharts";

export default function ReportsDashboard({ language, moduleType }: { language: string, moduleType: string }) {
  const isAr = language === "ar";

  const censusData = [
    { name: "Mon", census: 22, admissions: 4, discharges: 2 },
    { name: "Tue", census: 24, admissions: 5, discharges: 3 },
    { name: "Wed", census: 21, admissions: 2, discharges: 5 },
    { name: "Thu", census: 25, admissions: 6, discharges: 2 },
    { name: "Fri", census: 28, admissions: 4, discharges: 1 },
    { name: "Sat", census: 26, admissions: 1, discharges: 3 },
    { name: "Sun", census: 24, admissions: 2, discharges: 4 },
  ];

  const specialtyData = [
    { name: "Gen Med", value: 12 },
    { name: "Cardiology", value: 8 },
    { name: "Respiratory", value: 6 },
    { name: "Gastro", value: 4 },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">{isAr ? "تحليلات أداء التنويم" : "Inpatient Performance Analytics"}</h2>
           <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{isAr ? "مراقبة الإشغال، معدلات التدفق، وكفاءة الخروج" : "Monitor occupancy, throughput rates, and discharge efficiency"}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
             <Download className="w-4 h-4"/> 
             {isAr ? "تصدير البيانات" : "Export Data"}
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
             <Calendar className="w-4 h-4"/> 
             {isAr ? "آخر 30 يوم" : "Last 30 Days"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Main Census Trend */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-200 shadow-xl p-8">
           <div className="flex items-center justify-between mb-8 px-2">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight flex flex-wrap items-center gap-2 sm:gap-3">
                 <TrendingUp className="w-5 h-5 text-indigo-600" />
                 {isAr ? "اتجاهات الإشغال الأسبوعية" : "Weekly Occupancy Trends"}
              </h3>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-indigo-600 rounded-full" />
                    <span className="text-[10px] font-black text-slate-400 uppercase">Census</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                    <span className="text-[10px] font-black text-slate-400 uppercase">Admissions</span>
                 </div>
              </div>
           </div>
           <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={censusData}>
                    <defs>
                       <linearGradient id="colorCensus" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dx={-10} />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Area type="monotone" dataKey="census" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorCensus)" />
                    <Area type="monotone" dataKey="admissions" stroke="#10b981" strokeWidth={4} fillOpacity={0} />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Discharge Efficiency Card */}
        <div className="bg-indigo-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
           <BarChart3 className="absolute top-[-20px] right-[-20px] w-48 h-48 text-white/5 rotate-12" />
           <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">{isAr ? "كفاءة العمليات" : "Operational Efficiency"}</span>
              <h3 className="text-3xl font-black mt-4 leading-tight">{isAr ? "متوسط مدة الإقامة (ALOS)" : "Avg Length of Stay"}</h3>
              <div className="mt-8 flex items-baseline gap-2">
                 <span className="text-6xl font-black italic">4.2</span>
                 <span className="text-xl font-bold text-indigo-300">Days</span>
              </div>
              <p className="mt-4 text-indigo-100/60 font-medium text-sm leading-relaxed">
                 {isAr ? "تحسن بنسبة 12% مقارنة بالشهر الماضي. الهدف هو 3.8 أيام." : "12% improvement vs last month. Target benchmark is 3.8 days."}
              </p>
           </div>
           <div className="relative z-10 pt-8 border-t border-white/10 mt-8">
              <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-indigo-300">
                 <span>Bed Turnover Rate</span>
                 <span className="text-white">0.85/day</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
         <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
               <Users className="w-4 h-4 text-indigo-600" />
               {isAr ? "توزيع المرضى حسب التخصص" : "Patient Specialty Mix"}
            </h4>
            <div className="space-y-4">
               {specialtyData.map((spec, i) => (
                  <div key={i} className="space-y-2">
                     <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>{spec.name}</span>
                        <span>{spec.value} pts</span>
                     </div>
                     <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                        <div className="h-full bg-indigo-500 rounded-full" style={{width: `${(spec.value / 30) * 100}%`}} />
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
               <Clock className="w-4 h-4 text-amber-500" />
               {isAr ? "تحليل أوقات الذروة للدخول" : "Peak Admission Times"}
            </h4>
            <div className="h-48 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                     {hour: '08:00', val: 12},
                     {hour: '12:00', val: 18},
                     {hour: '16:00', val: 25},
                     {hour: '20:00', val: 15},
                  ]}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                     <Bar dataKey="val" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm flex flex-col justify-center text-center">
            <Activity className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">{isAr ? "معدل الرضا عن الرعاية" : "Patient Satisfaction Index"}</h4>
            <div className="text-4xl font-black text-emerald-600 my-4">94%</div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Based on post-discharge surveys</p>
         </div>
      </div>
    </div>
  );
}
