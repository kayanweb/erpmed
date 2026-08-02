import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Activity, Users, DollarSign, 
  Clock, HeartPulse, ShieldAlert, BarChart3, PieChart,
  Calendar, Filter, Download, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart as RePieChart, Pie, Cell,
  LineChart, Line
} from 'recharts';

interface Props {
  language: 'ar' | 'en';
}

const revenueData = [
  { name: 'Jan', value: 4000, expenses: 2400 },
  { name: 'Feb', value: 3000, expenses: 1398 },
  { name: 'Mar', value: 2000, expenses: 9800 },
  { name: 'Apr', value: 2780, expenses: 3908 },
  { name: 'May', value: 1890, expenses: 4800 },
  { name: 'Jun', value: 2390, expenses: 3800 },
  { name: 'Jul', value: 3490, expenses: 4300 },
];

const patientData = [
  { name: 'Mon', Inpatient: 40, Outpatient: 24, ER: 24 },
  { name: 'Tue', Inpatient: 30, Outpatient: 13, ER: 22 },
  { name: 'Wed', Inpatient: 20, Outpatient: 98, ER: 22 },
  { name: 'Thu', Inpatient: 27, Outpatient: 39, ER: 20 },
  { name: 'Fri', Inpatient: 18, Outpatient: 48, ER: 21 },
  { name: 'Sat', Inpatient: 23, Outpatient: 38, ER: 25 },
  { name: 'Sun', Inpatient: 34, Outpatient: 43, ER: 21 },
];

const departmentData = [
  { name: 'Cardiology', value: 400 },
  { name: 'Neurology', value: 300 },
  { name: 'Oncology', value: 300 },
  { name: 'Pediatrics', value: 200 },
];

const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b'];

export default function AnalyticsKPIDashboard({ language }: Props) {
  const isAr = language === 'ar';
  const [timeRange, setTimeRange] = useState('7days');

  const stats = [
    { 
      label: isAr ? "إجمالي الإيرادات" : "Total Revenue", 
      value: "$1.2M", 
      change: "+12.5%", 
      isPositive: true,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-100"
    },
    { 
      label: isAr ? "حجم المرضى" : "Patient Volume", 
      value: "8,459", 
      change: "+5.2%", 
      isPositive: true,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    { 
      label: isAr ? "متوسط مدة الإقامة" : "Avg Length of Stay", 
      value: "3.2 Days", 
      change: "-1.1%", 
      isPositive: true,
      icon: Clock,
      color: "text-indigo-600",
      bg: "bg-indigo-100"
    },
    { 
      label: isAr ? "معدل إعادة الإدخال" : "Readmission Rate", 
      value: "4.1%", 
      change: "+0.5%", 
      isPositive: false,
      icon: Activity,
      color: "text-rose-600",
      bg: "bg-rose-100"
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 sm:py-4 shrink-0 shadow-sm z-10 flex flex-row flex-wrap items-center justify-between gap-2 sm:gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-200">
            <BarChart3 size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
              {isAr ? "تحليلات الأداء (KPIs)" : "Executive Analytics"}
            </h1>
            <p className="text-xs font-bold text-slate-500">
              {isAr ? "مؤشرات الأداء الرئيسية والتقارير الاستراتيجية" : "Key Performance Indicators & Strategic Reports"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="today">{isAr ? "اليوم" : "Today"}</option>
            <option value="7days">{isAr ? "آخر 7 أيام" : "Last 7 Days"}</option>
            <option value="30days">{isAr ? "آخر 30 يوم" : "Last 30 Days"}</option>
            <option value="12months">{isAr ? "آخر 12 شهر" : "Last 12 Months"}</option>
          </select>
          <button className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-6">
        {/* Top KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {stat.isPositive ? <ArrowDownRight size={14} className={stat.isPositive && stat.label.includes('Rate') ? 'rotate-180' : ''} /> : <ArrowUpRight size={14} />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-sm font-bold text-slate-500 mb-1">{stat.label}</h3>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
            <h3 className="text-base font-bold text-slate-800 mb-6">{isAr ? "الإيرادات مقابل المصروفات" : "Revenue vs Expenses"}</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Area type="monotone" dataKey="value" name={isAr ? 'الإيرادات' : 'Revenue'} stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  <Area type="monotone" dataKey="expenses" name={isAr ? 'المصروفات' : 'Expenses'} stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorExpenses)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-6">{isAr ? "توزيع المرضى حسب القسم" : "Patients by Department"}</h3>
            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend iconType="circle" />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-6">{isAr ? "حجم زيارات المرضى" : "Patient Visit Volume"}</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={patientData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="Inpatient" name={isAr ? 'تنويم' : 'Inpatient'} fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Outpatient" name={isAr ? 'عيادات خارجية' : 'Outpatient'} fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ER" name={isAr ? 'طوارئ' : 'ER'} fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
