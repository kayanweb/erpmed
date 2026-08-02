import React, { useMemo } from "react";
import { Activity, Users, BedDouble, AlertCircle } from "lucide-react";
import { useHIS } from "../../context/HISContext";

export default function InpatientMetrics({ language, moduleType }: { language: string, moduleType: string }) {
  const isAr = language === "ar";
  const { patients = [] } = useHIS();

  const metricsData = useMemo(() => {
    const wardPatients = patients.filter(p => p.departmentId === moduleType);
    const criticalCount = wardPatients.filter(p => p.triageLevel === 1).length;
    const admissionToday = wardPatients.filter(p => {
      // Basic check for today
      return true; // For now assuming all in this list are active
    }).length;

    return [
      { titleAr: "المرضى الحاليين", titleEn: "Current Census", value: wardPatients.length.toString(), icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
      { titleAr: "إشغال الأسرة", titleEn: "Bed Occupancy", value: "85%", icon: BedDouble, color: "text-emerald-600", bg: "bg-emerald-50" },
      { titleAr: "حالات الدخول (اليوم)", titleEn: "New Admissions", value: "3", icon: Activity, color: "text-amber-600", bg: "bg-amber-50" },
      { titleAr: "تنبيهات حرجة", titleEn: "Critical Alerts", value: criticalCount.toString(), icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
    ];
  }, [patients, moduleType]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricsData.map((m, i) => (
        <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-indigo-100 hover:shadow-xl transition-all cursor-default">
          <div className={`w-16 h-16 rounded-2xl ${m.bg} ${m.color} flex items-center justify-center border border-transparent group-hover:border-current transition-all`}>
            <m.icon className="w-8 h-8" />
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{m.value}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{isAr ? m.titleAr : m.titleEn}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
