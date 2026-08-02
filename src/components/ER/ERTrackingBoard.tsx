import React, { useMemo } from "react";
import { 
  Users, Activity, Clock, Search, Filter, LayoutDashboard, 
  Stethoscope, Timer, AlertTriangle, ShieldCheck, Eye,
  ChevronRight, ArrowRight, Bed, Siren, Microscope, Monitor,
  Pill, History, MoreVertical, MessageSquare, ClipboardList, MapPin
} from "lucide-react";
import { motion } from "motion/react";
import { useHIS } from "../../context/HISContext";
import { Patient } from "../../types";

interface ERTrackingBoardProps {
  isAr: boolean;
  onSelectPatient: (patientId: string) => void;
}

export function ERTrackingBoard({ isAr, onSelectPatient }: ERTrackingBoardProps) {
  const { patients = [], departments = [] } = useHIS();
  const [searchQuery, setSearchQuery] = React.useState("");

  const activeErPatients = useMemo(() => {
    return patients.filter(p => ["er_waiting", "er_triage", "er_bed", "er_observation", "er_discharge", "er", "er_waiting_admission"].includes(p.status || ""));
  }, [patients]);

  const stats = useMemo(() => {
    return [
      { label: isAr ? "إجمالي المرضى" : "Total Census", value: activeErPatients.length, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
      { label: isAr ? "بانتظار الفرز" : "Pending Triage", value: activeErPatients.filter(p => p.status === 'er_waiting').length, icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
      { label: isAr ? "حالات حرجة" : "Critical Cases", value: activeErPatients.filter(p => p.clinicalData?.esiLevel === 1 || p.clinicalData?.esiLevel === 2).length, icon: Activity, color: "text-rose-600", bg: "bg-rose-100" },
      { label: isAr ? "بانتظار الأسرة" : "Boarding (No Bed)", value: activeErPatients.filter(p => p.status === 'er_waiting_admission').length, icon: Bed, color: "text-indigo-600", bg: "bg-indigo-100" },
    ];
  }, [activeErPatients, isAr]);

  const getEsiColor = (esi: number) => {
    switch(esi) {
      case 1: return "bg-red-600 text-white border-red-700";
      case 2: return "bg-orange-500 text-white border-orange-600";
      case 3: return "bg-yellow-400 text-yellow-900 border-yellow-500";
      case 4: return "bg-green-500 text-white border-green-600";
      case 5: return "bg-blue-500 text-white border-blue-600";
      default: return "bg-slate-100 text-slate-500 border-slate-200";
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'er_waiting': return { label: isAr ? "انتظار" : "Waiting", color: "bg-slate-100 text-slate-600" };
      case 'er_triage': return { label: isAr ? "فرز" : "Triage", color: "bg-amber-100 text-amber-700" };
      case 'er_bed': return { label: isAr ? "في السرير" : "In Bed", color: "bg-indigo-100 text-indigo-700" };
      case 'er_waiting_admission': return { label: isAr ? "بانتظار التنويم" : "Wait Admit", color: "bg-rose-100 text-rose-700" };
      default: return { label: status, color: "bg-slate-50 text-slate-400" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-4 ${stat.bg} rounded-2xl`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tracking Board Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                <Siren className="w-5 h-5 text-rose-500" />
             </div>
             <div>
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                  {isAr ? "لوحة تتبع الطوارئ (Live Board)" : "ED Live Tracking Board"}
                </h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Patient Flow Management</p>
             </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder={isAr ? "بحث بالاسم أو الملف..." : "Search Board..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold w-64 outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              />
            </div>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">
                <th className="py-4 px-6">{isAr ? "المستوى" : "ESI"}</th>
                <th className="py-4 px-6">{isAr ? "المريض" : "Patient Info"}</th>
                <th className="py-4 px-6">{isAr ? "الحالة / الموقع" : "Status / Loc"}</th>
                <th className="py-4 px-6">{isAr ? "الشكوى" : "Chief Complaint"}</th>
                <th className="py-4 px-6">{isAr ? "مدة الانتظار" : "LOS"}</th>
                <th className="py-4 px-6">{isAr ? "المهام" : "Tasks"}</th>
                <th className="py-4 px-6 text-right">{isAr ? "إجراء" : "Action"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeErPatients.length > 0 ? activeErPatients
                .filter(p => (isAr ? p.nameAr : p.nameEn)?.toLowerCase().includes(searchQuery.toLowerCase()) || p.mrn?.includes(searchQuery))
                .sort((a,b) => (a.clinicalData?.esiLevel || 5) - (b.clinicalData?.esiLevel || 5))
                .map((p, idx) => {
                const esi = p.clinicalData?.esiLevel || 0;
                const status = getStatusBadge(p.status || "");
                return (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={p.id} 
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center border-2 font-black ${getEsiColor(esi)}`}>
                        <span className="text-[10px] opacity-70 leading-none mb-1">ESI</span>
                        <span className="text-sm leading-none">{esi || "-"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800 leading-tight mb-0.5 group-hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => onSelectPatient(p.id)}>
                          {isAr ? p.nameAr : p.nameEn}
                        </span>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-mono font-bold text-slate-400">MRN: {p.mrn}</span>
                           <span className="text-[10px] text-slate-300">•</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{p.gender} / {p.age}y</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                       <div className="flex flex-col gap-1.5">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest inline-block w-fit ${status.color}`}>
                            {status.label}
                          </span>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                             <MapPin size={10} className="text-indigo-500" />
                             <span>{p.bedId || (isAr ? "غير محدد" : "Unassigned")}</span>
                          </div>
                       </div>
                    </td>
                    <td className="py-4 px-6 max-w-[180px]">
                      <p className="text-xs font-bold text-slate-600 truncate leading-relaxed">
                        {p.clinicalData?.chiefComplaint || (isAr ? "لا توجد شكوى مسجلة" : "No complaint recorded")}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                       <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-700">02:14</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Minutes</span>
                       </div>
                    </td>
                    <td className="py-4 px-6">
                       <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer" title="Lab Orders">
                             <Microscope size={14} />
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-pointer" title="Radiology">
                             <Monitor size={14} />
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition-colors cursor-pointer" title="Nursing Tasks">
                             <ClipboardList size={14} />
                          </div>
                       </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => onSelectPatient(p.id)}
                            className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
                          >
                             {isAr ? "فتح الملف" : "Open File"}
                          </button>
                          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                             <MoreVertical size={16} />
                          </button>
                       </div>
                    </td>
                  </motion.tr>
                );
              }) : (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="max-w-xs mx-auto">
                       <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
                          <LayoutDashboard className="w-10 h-10 text-slate-200" />
                       </div>
                       <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">{isAr ? "لا توجد حالات مسجلة" : "ED Board Empty"}</h3>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
