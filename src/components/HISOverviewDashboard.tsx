import React from "react";
import {
  Users,
  BedDouble,
  Stethoscope,
  Activity,
  TrendingUp,
  AlertTriangle,
  Clock,
  Calendar,
  FileText,
  CheckCircle2,
  Settings,
  Shield,
  Server,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Database,
} from "lucide-react";
import { motion } from "motion/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "sonner";

interface Props {
  language: "en" | "ar";
  onNavigate?: (moduleId: string, subId?: string) => void;
}

const dataFlow = [
  { time: "00:00", admissions: 12, discharges: 5, emergency: 8 },
  { time: "04:00", admissions: 8, discharges: 2, emergency: 15 },
  { time: "08:00", admissions: 45, discharges: 20, emergency: 25 },
  { time: "12:00", admissions: 60, discharges: 55, emergency: 30 },
  { time: "16:00", admissions: 35, discharges: 40, emergency: 45 },
  { time: "20:00", admissions: 20, discharges: 15, emergency: 35 },
];

const bedData = [
  { name: "ICU", value: 45, color: "#ef4444" },
  { name: "Ward", value: 350, color: "#3b82f6" },
  { name: "Maternity", value: 80, color: "#ec4899" },
  { name: "Pediatrics", value: 120, color: "#f59e0b" },
];

export default function HISOverviewDashboard({ language, onNavigate }: Props) {
  const isAr = language === "ar";

  const kpis = [
    {
      title: isAr ? "إجمالي المرضى المتواجدين" : "Total Active Patients",
      value: "1,284",
      trend: "+4.2%",
      up: true,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      moduleId: "admin_support",
      subId: "adt",
      toastMsgAr: "جاري الانتقال إلى لوحة التسجيل والقبول والدخول المباشر (ADT)...",
      toastMsgEn: "Routing to Admission & Registration department (ADT)...",
    },
    {
      title: isAr ? "الفواتير الغير مسددة" : "Unpaid Bills (RCM)",
      value: "SAR 452K",
      trend: "+12%",
      up: false,
      icon: TrendingUp,
      color: "text-rose-600",
      bg: "bg-rose-50",
      moduleId: "admin_support",
      subId: "billing",
      toastMsgAr: "جاري الانتقال إلى شاشة الفوترة الطبية وإيرادات الدورة المالية (RCM)...",
      toastMsgEn: "Routing to Billing & Insurance (RCM) panel...",
    },
    {
      title: isAr ? "نواقص المخزن (أدوية ومستلزمات)" : "Inventory Shortages",
      value: "24 Items",
      trend: "Action Req",
      up: false,
      icon: AlertTriangle,
      color: "text-amber-600",
      bg: "bg-amber-50",
      moduleId: "clinical_services",
      subId: "pharmacy",
      toastMsgAr: "جاري الانتقال لمركز الصيدلية وإدارة مخازن الدواء والمستلزمات...",
      toastMsgEn: "Routing to Pharmacy & Medical Stock Management...",
    },
    {
      title: isAr ? "نسبة إشغال الأسرة" : "Overall Bed Occupancy",
      value: "87%",
      trend: "+1.5%",
      up: true,
      icon: BedDouble,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      moduleId: "admin_support",
      subId: "bed_management",
      toastMsgAr: "جاري الانتقال إلى لوحة التحكم وإشغال الأسرة المركزي للتنظيم الداخلي...",
      toastMsgEn: "Routing to Central Bed Management dashboard...",
    },
  ];

  const recentActivity = [
    {
      time: "09:42 AM",
      desc: isAr
        ? "تم تسجيل دخول المريض أحمد محمد (MRN-1092) إلى قسم الباطنة"
        : "Patient Ahmed Mohamed (MRN-1092) admitted to Internal Medicine",
      type: "admission",
      moduleId: "admin_support",
      subId: "adt",
      toastMsgAr: "جاري توجيهك إلى شاشة التسجيل وملفات قبول المرضى لمتابعة ملف المريض...",
      toastMsgEn: "Routing to Patient Admission profile to view the record...",
    },
    {
      time: "09:38 AM",
      desc: isAr
        ? "اكتملت جراحة نقل الكلى بنجاح (OT-03) - د. سامي"
        : "Kidney transplant completed successfully (OT-03) - Dr. Sami",
      type: "surgery",
      moduleId: "or",
      subId: "dept_or_main",
      toastMsgAr: "جاري الانتقال إلى لوحة العمليات الجراحية الكبرى وغرف العمليات المباشرة...",
      toastMsgEn: "Routing to Operating Rooms list to view surgical board...",
    },
    {
      time: "09:15 AM",
      desc: isAr
        ? "تنبيه: نقص حاد في مخزون أدوية التخدير (صيدلية الطوارئ)"
        : "ALERT: Critical shortage in Anesthesia stock (ER Pharmacy)",
      type: "alert",
      moduleId: "clinical_services",
      subId: "pharmacy",
      toastMsgAr: "جاري الانتقال إلى إدارة صيدلية الطوارئ والمخازن لمعالجة هذا النقص العاجل...",
      toastMsgEn: "Routing to ER Pharmacy & Drug Index to resolve shortage...",
    },
    {
      time: "08:50 AM",
      desc: isAr
        ? "تحديث النظام المركزي HL7 وتزامن البيانات بنجاح"
        : "HL7 Central Engine synchronized data successfully",
      type: "system",
      moduleId: "integration_hub",
      toastMsgAr: "جاري الانتقال إلى مركز تكامل أنظمة البيانات والـ HL7 Feeds...",
      toastMsgEn: "Routing to Central Integration Hub to inspect HL7 logs...",
    },
    {
      time: "08:30 AM",
      desc: isAr
        ? "تم تحويل 5 مرضى من الطوارئ إلى العناية المركزة"
        : "5 patients transferred from ER to ICU",
      type: "alert",
      moduleId: "critical_care",
      subId: "dept_icu",
      toastMsgAr: "جاري الانتقال إلى وحدة العناية المركزة (ICU) لمراجعة أسرة وقبول المرضى...",
      toastMsgEn: "Routing to Intensive Care Unit (ICU) board...",
    },
  ];

  return (
    <div
      className="p-4 md:p-6 bg-slate-50 min-h-full font-sans"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/70 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
            <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-md shadow-indigo-600/20">
              <Activity className="h-6 w-6" />
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight">
              {isAr
                ? "مركز القيادة والتحكم المتقدم"
                : "Advanced Command Center"}
            </h1>
          </div>
          <p className="text-slate-500 font-medium text-sm max-w-3xl flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            {isAr
              ? "نظرة عامة حية لكافة العمليات، تدفق المرضى، ومؤشرات الأداء (KPIs) مدعومة بالذكاء الاصطناعي."
              : "Live overview of operations, patient flow, and AI-powered KPIs."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase">
              {isAr ? "حالة الخادم الأساسي" : "Main Server Status"}
            </div>
            <div className="text-sm font-black text-emerald-600 flex items-center gap-1.5 justify-end">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              {isAr ? "متصل (0ms)" : "ONLINE (0ms)"}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.02, translateY: -4 }}
            onClick={() => {
              if (onNavigate) {
                toast.info(isAr ? kpi.toastMsgAr : kpi.toastMsgEn, {
                  icon: "🚀",
                  duration: 2500
                });
                onNavigate(kpi.moduleId, kpi.subId);
              }
            }}
            className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-lg ${kpi.bg} shrink-0 group-hover:bg-indigo-50 transition-colors`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color} group-hover:text-indigo-600 transition-colors`} />
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-md ${kpi.up ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
                >
                  {kpi.up ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {kpi.trend}
                </div>
                
                {/* Visual indicator that this card is clickable for navigation */}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500 font-bold text-xs select-none">
                  ↗
                </span>
              </div>
            </div>
            <div className="z-10">
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                {kpi.value}
              </h3>
              <p className="text-xs font-bold text-slate-500 mt-1">
                {kpi.title}
              </p>
            </div>

            {/* Decorative background accent */}
            <div
              className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full ${kpi.bg} opacity-30 blur-2xl group-hover:scale-150 group-hover:bg-indigo-100 transition-all duration-700`}
            ></div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            title: isAr ? "الطب الجينومي والدقيق" : "Genomic & Precision Med",
            desc: isAr ? "تحليل طفرات الجينوم الفوري" : "Real-time genome mutation analysis",
            icon: Database,
            color: "text-purple-600",
            bg: "bg-purple-50",
            border: "border-purple-200",
            badge: "2026 Engine"
          },
          {
            title: isAr ? "مساعد الذكاء التوليدي" : "GenAI Clinical Co-pilot",
            desc: isAr ? "تنبؤات سريرية وتشخيص مبكر" : "Clinical predictions & early diagnosis",
            icon: Zap,
            color: "text-amber-600",
            bg: "bg-amber-50",
            border: "border-amber-200",
            badge: "Live"
          },
          {
            title: isAr ? "التوأم الرقمي المريض" : "Patient Digital Twin",
            desc: isAr ? "محاكاة الأعضاء وتأثير الدواء" : "Organ simulation & drug impact",
            icon: Users,
            color: "text-cyan-600",
            bg: "bg-cyan-50",
            border: "border-cyan-200",
            badge: "IoT Sync"
          },
          {
            title: isAr ? "تشفير كمي للسجلات" : "Quantum-Safe Records",
            desc: isAr ? "حماية بيانات طبية لا تخترق" : "Unbreakable medical data protection",
            icon: Shield,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-200",
            badge: "Secured"
          }
        ].map((feature, idx) => (
          <motion.div
            key={`feat-${idx}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.05 }}
            onClick={() => onNavigate && onNavigate("ai_smart", "vision2026")}
            className={`bg-white rounded-xl p-4 border ${feature.border} shadow-sm hover:shadow-md transition-all group flex flex-col relative overflow-hidden cursor-pointer`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2 rounded-lg ${feature.bg}`}>
                <feature.icon className={`h-5 w-5 ${feature.color}`} />
              </div>
              <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${feature.bg} ${feature.color} border ${feature.border}`}>
                {feature.badge}
              </span>
            </div>
            <h4 className="font-black text-slate-800 text-sm mb-1">{feature.title}</h4>
            <p className="text-[10px] font-bold text-slate-500 leading-relaxed">{feature.desc}</p>
            <div className={`absolute -right-6 -bottom-6 w-20 h-20 rounded-full ${feature.bg} opacity-50 blur-xl group-hover:scale-150 transition-all duration-700`}></div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Real-time Flow Chart Area */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/60 shadow-sm p-5 flex flex-col h-[350px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-indigo-500" />
              {isAr
                ? "تدفق حركة المرضى (24 ساعة)"
                : "Patient Flow Dynamics (24h)"}
            </h3>
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse shadow-md">
              {isAr ? "الجيل الرابع 2026" : "Gen-IV 2026"}
            </span>
          </div>

          <div className="flex-1 w-full h-full text-xs font-sans">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dataFlow}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorAdmissions"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorEmergency"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: "10px" }}
                />
                <Area
                  type="monotone"
                  name={isAr ? "الدخول (Admissions)" : "Admissions"}
                  dataKey="admissions"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorAdmissions)"
                />
                <Area
                  type="monotone"
                  name={isAr ? "الطوارئ (Emergency)" : "Emergency"}
                  dataKey="emergency"
                  stroke="#e11d48"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorEmergency)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Bed Occupancy Pie Chart */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5 h-[350px] flex flex-col">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm mb-2">
            <BedDouble className="h-4 w-4 text-indigo-500" />
            {isAr ? "توزيع الإشغال السريري" : "Bed Occupancy Distribution"}
          </h3>
          <div className="flex-1 w-full h-full relative text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bedData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bedData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-5">
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-black text-slate-800">595</div>
                <div className="text-[10px] font-bold text-slate-400">
                  {isAr ? "سرير مشغول" : "Beds Used"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* System Activity Stream */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5">
          <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-indigo-500" />
              {isAr
                ? "سجل النظام المركزي المتزامن"
                : "Synchronized Central System Log"}
            </h3>
            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded border border-indigo-100 flex items-center gap-1">
              <Server className="w-3 h-3" /> HL7 Feed
            </span>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (onNavigate) {
                    toast.info(isAr ? activity.toastMsgAr : activity.toastMsgEn, {
                      icon: "🩺",
                      duration: 2500
                    });
                    onNavigate(activity.moduleId, activity.subId);
                  }
                }}
                className="flex gap-3 relative group cursor-pointer hover:bg-slate-50 border border-transparent hover:border-slate-200/50 rounded-xl p-3.5 transition-all duration-300 transform hover:translate-x-1"
              >
                {idx !== recentActivity.length - 1 && (
                  <div
                    className="absolute top-10 bottom-[-22px] left-3 w-px bg-slate-100 group-hover:bg-indigo-100 transition-colors"
                    style={{
                      left: isAr ? "auto" : "25px",
                      right: isAr ? "25px" : "auto",
                    }}
                  ></div>
                )}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 border-2 border-white shadow-sm transition-transform duration-300 group-hover:scale-110 ${
                    activity.type === "admission"
                      ? "bg-blue-100 text-blue-600"
                      : activity.type === "surgery"
                        ? "bg-emerald-100 text-emerald-600"
                        : activity.type === "alert"
                          ? "bg-rose-100 text-rose-600"
                          : "bg-indigo-100 text-indigo-600"
                  }`}
                >
                  {activity.type === "admission" ? (
                    <Users className="w-4 h-4" />
                  ) : activity.type === "surgery" ? (
                    <Activity className="w-4 h-4" />
                  ) : activity.type === "alert" ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <Settings className="w-4 h-4" />
                  )}
                </div>
                <div className="pb-1 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 mb-0.5 tracking-wider font-mono">
                      {activity.time}
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 text-xs text-indigo-500 font-bold transition-opacity">
                      {isAr ? "الانتقال للحدث ←" : "Navigate →"}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                    {activity.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise Modules Overview */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2 text-sm border-b border-slate-100 pb-3">
            <Database className="h-4 w-4 text-indigo-500" />
            {isAr
              ? "حالة تكامل الأنظمة الطبية الأساسية"
              : "Core Medical Systems Integration Status"}
          </h3>
          <div className="space-y-3">
            {[
              {
                title: "EMR / CPOE (الملف الطبي والأوامر)",
                status: "Active & Synced",
                color: "text-blue-700 bg-blue-50 border-blue-200 hover:border-blue-400",
                icon: FileText,
                percent: 100,
                moduleId: "outpatient",
                subId: "emr_core",
              },
              {
                title: "LIS / RIS (معلومات المعمل والأشعة)",
                status: "Active & Synced",
                color: "text-indigo-700 bg-indigo-50 border-indigo-200 hover:border-indigo-400",
                icon: Activity,
                percent: 100,
                moduleId: "clinical_services",
                subId: "laboratory",
              },
              {
                title: "ERP / Pharmacy (صيدلية ومخازن)",
                status: "Syncing (12ms lag)",
                color: "text-emerald-700 bg-emerald-50 border-emerald-200 hover:border-emerald-400",
                icon: Settings,
                percent: 85,
                moduleId: "clinical_services",
                subId: "pharmacy",
              },
              {
                title: "RCM / Billing (الفوترة والمطالبات)",
                status: "Batch Processing",
                color: "text-amber-700 bg-amber-50 border-amber-200 hover:border-amber-400",
                icon: Shield,
                percent: 60,
                moduleId: "admin_support",
                subId: "billing",
              },
            ].map((mod, i) => (
              <div
                key={i}
                onClick={() => {
                  if (onNavigate) {
                    toast.success(isAr ? `جاري فتح نظام ${mod.title}...` : `Opening ${mod.title} Integration...`, {
                      icon: "🔌",
                      duration: 2500
                    });
                    onNavigate(mod.moduleId, mod.subId);
                  }
                }}
                className={`p-3 rounded-xl border ${mod.color} flex items-center justify-between hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5 duration-200 group`}
              >
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className="bg-white/60 p-2 rounded-lg shadow-sm group-hover:bg-white transition-colors">
                    <mod.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <span>{mod.title}</span>
                      <span className="opacity-0 group-hover:opacity-100 text-[10px] text-slate-500 font-bold transition-opacity">
                        ↗
                      </span>
                    </div>
                    <div className="text-[10px] font-bold opacity-70">
                      {mod.status}
                    </div>
                  </div>
                </div>
                <div className="w-20">
                  <div className="flex justify-end text-[10px] font-black mb-1">
                    {mod.percent}%
                  </div>
                  <div className="h-1.5 w-full bg-white/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-current rounded-full"
                      style={{ width: `${mod.percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
