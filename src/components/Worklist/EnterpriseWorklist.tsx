import React, { useMemo, useState } from "react";
import { 
  Search, Filter, Users, Clock, AlertTriangle, ChevronRight, 
  MoreVertical, User, MapPin, Activity, Calendar, Siren
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHIS } from "../../context/HISContext";
import { Patient, EncounterType } from "../../types";

interface EnterpriseWorklistProps {
  isAr: boolean;
  departmentId?: string;
  encounterType?: EncounterType;
  allowedStatuses?: string[];
  titleEn: string;
  titleAr: string;
  onPatientSelect: (patientId: string) => void;
}

export function EnterpriseWorklist({ 
  isAr, 
  departmentId, 
  encounterType, 
  allowedStatuses, 
  titleEn, 
  titleAr,
  onPatientSelect 
}: EnterpriseWorklistProps) {
  const { patients = [], encounters = [] } = useHIS();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const worklistPatients = useMemo(() => {
    return patients.filter(p => {
      // 1. Filter by status if provided
      if (allowedStatuses && !allowedStatuses.includes(p.status || "")) {
        return false;
      }

      // 2. Filter by department if provided
      if (departmentId && p.departmentId !== departmentId && (p as any).currentDeptId !== departmentId) {
        // Check if there is an active encounter for this department
        const activeEnc = encounters.find(e => e.patientId === p.id && e.status === 'open' && e.deptId === departmentId);
        if (!activeEnc) return false;
      }

      // 3. Filter by encounter type if provided
      if (encounterType) {
        const activeEnc = encounters.find(e => e.patientId === p.id && e.status === 'open');
        if (activeEnc && activeEnc.type !== encounterType) return false;
      }

      return true;
    });
  }, [patients, encounters, departmentId, encounterType, allowedStatuses]);

  const filteredPatients = useMemo(() => {
    return worklistPatients.filter(p => {
      const nameMatch = (isAr ? p.nameAr : p.nameEn || p.name)?.toLowerCase().includes(searchQuery.toLowerCase());
      const mrnMatch = p.mrn?.includes(searchQuery);
      const statusMatch = filterStatus === "all" || p.status === filterStatus;
      return (nameMatch || mrnMatch) && statusMatch;
    });
  }, [worklistPatients, searchQuery, filterStatus, isAr]);

  const stats = useMemo(() => {
    return [
      { label: isAr ? "الإجمالي" : "Total", value: worklistPatients.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
      { label: isAr ? "بانتظار الإجراء" : "Pending", value: worklistPatients.filter(p => p.status === 'waiting' || p.status === 'er_waiting' || p.status === 'triage').length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
      { label: isAr ? "حالات حرجة" : "Critical", value: worklistPatients.filter(p => (p.clinicalData as any)?.priority === 'stat' || ((p.clinicalData as any)?.esiLevel && (p.clinicalData as any)?.esiLevel <= 2)).length, icon: Activity, color: "text-rose-600", bg: "bg-rose-50" },
    ];
  }, [worklistPatients, isAr]);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Worklist Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-xl font-black text-slate-900">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 border border-slate-200 rounded-2xl shadow-sm mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
             <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">{isAr ? titleAr : titleEn}</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Department Worklist</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? "بحث بالاسم أو الملف..." : "Search patient or MRN..."}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold w-64 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Worklist Grid/Table */}
      <div className="flex-1 overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="py-4 px-6">{isAr ? "المريض" : "Patient"}</th>
                <th className="py-4 px-6">{isAr ? "الحالة" : "Status"}</th>
                <th className="py-4 px-6">{isAr ? "الموقع" : "Loc"}</th>
                <th className="py-4 px-6">{isAr ? "الطبيب" : "Physician"}</th>
                <th className="py-4 px-6">{isAr ? "المدة" : "LOS"}</th>
                <th className="py-4 px-6 text-right">{isAr ? "إجراء" : "Action"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length > 0 ? filteredPatients.map((p, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={p.id} 
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-800 leading-tight mb-0.5 group-hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => onPatientSelect(p.id)}>
                          {isAr ? (p.nameAr || p.name) : (p.nameEn || p.name)}
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-mono font-bold text-slate-400">MRN: {p.mrn}</span>
                           <span className="text-[10px] text-slate-300">•</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{p.gender} / {p.age}y</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                      p.status?.includes('er') ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      p.status?.includes('ward') ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                     <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{p.bedId || "OPD"}</span>
                     </div>
                  </td>
                  <td className="py-4 px-6">
                     <div className="text-[10px] font-bold text-slate-600">Dr. Ahmed Kamal</div>
                  </td>
                  <td className="py-4 px-6">
                     <div className="text-[10px] font-mono font-bold text-slate-400">02:45:00</div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => onPatientSelect(p.id)}
                      className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
                    >
                      {isAr ? "فتح Workspace" : "Open Workspace"}
                    </button>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-bold italic">
                    {isAr ? "لا توجد نتائج مطابقة" : "No active patients found matching criteria"}
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
