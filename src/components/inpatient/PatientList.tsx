import React, { useState, useMemo } from "react";
import { Search, Filter, User, Bed, Clock, AlertTriangle, ChevronRight, Activity } from "lucide-react";
import { useHIS } from "../../context/HISContext";
import { GlobalEntityLink } from "../GlobalEntityLink";

export default function PatientList({ language, moduleType, onPatientSelect }: { language: string, moduleType: string, onPatientSelect: (id: string) => void }) {
  const isAr = language === "ar";
  const { patients = [] } = useHIS();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const matchesSearch = 
        p.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.nameAr.includes(searchTerm) || 
        p.mrn.toLowerCase().includes(searchTerm.toLowerCase());
      
      const isAdmitted = (p.status as string) === "admitted" || p.status === "ward";
      const isInWard = p.departmentId === moduleType || !p.departmentId; // fallback for demo

      return matchesSearch && isAdmitted && isInWard;
    });
  }, [patients, searchTerm, moduleType]);

  return (
    <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
        <div>
           <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">{isAr ? "سجل المرضى النشطين" : "Active Ward Census"}</h2>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{isAr ? "قائمة المرضى المنومين حالياً في القسم" : "Listing all patients currently admitted to this unit"}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder={isAr ? "بحث بالاسم أو الرقم الطبي..." : "Search Name, MRN..."}
              className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-[18px] text-xs font-bold focus:outline-none focus:ring-4 focus:ring-indigo-50 w-72 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-md border-b border-slate-100">
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="py-5 px-8">{isAr ? "المريض والمعلومات الأساسية" : "Patient Info"}</th>
              <th className="py-5 px-8">{isAr ? "الموقع السريري" : "Room / Bed"}</th>
              <th className="py-5 px-8">{isAr ? "الطبيب المعالج" : "Attending Team"}</th>
              <th className="py-5 px-8">{isAr ? "الحالة السريرية" : "Clinical Status"}</th>
              <th className="py-5 px-8 text-right">{isAr ? "إدارة الملف" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredPatients.map(p => (
              <tr 
                key={p.id} 
                className="group hover:bg-indigo-50/30 transition-all cursor-pointer"
                onClick={() => onPatientSelect(p.id)}
              >
                <td className="py-5 px-8">
                  <div className="flex items-center gap-2 sm:gap-4 flex-wrap sm:flex-nowrap w-full md:w-auto">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm overflow-hidden">
                       <User className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-black text-slate-900 group-hover:text-indigo-700 transition-colors">
                        <GlobalEntityLink entityId={p.id} entityName={isAr ? p.nameAr : p.nameEn} entityType="patient" isAr={isAr}>
                          {isAr ? p.nameAr : p.nameEn}
                        </GlobalEntityLink>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{p.mrn}</span>
                        <div className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="text-[10px] font-black text-slate-400 uppercase leading-none">{p.age}Y • {p.gender}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-8">
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                         <Bed className="w-4 h-4" />
                      </div>
                      <div>
                         <span className="block text-xs font-black text-slate-800 uppercase leading-tight">Room 101</span>
                         <span className="text-[10px] font-bold text-slate-400 uppercase">Bed A</span>
                      </div>
                   </div>
                </td>
                <td className="py-5 px-8">
                   <div className="space-y-1">
                      <span className="block text-xs font-black text-slate-800 leading-tight">Dr. Sarah Ahmed</span>
                      <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest px-1.5 py-0.5 bg-indigo-50 rounded-full border border-indigo-100">Internal Medicine</span>
                   </div>
                </td>
                <td className="py-5 px-8">
                   <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                         <Activity className="w-3.5 h-3.5 text-emerald-500" />
                         Stable
                      </div>
                      {p.triageLevel === 1 && (
                        <div className="w-8 h-8 bg-rose-50 rounded-xl flex items-center justify-center border border-rose-100">
                           <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
                        </div>
                      )}
                   </div>
                </td>
                <td className="py-5 px-8 text-right">
                  <button 
                    className="p-3 bg-white border border-slate-200 text-slate-400 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all shadow-sm"
                  >
                    <ChevronRight className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredPatients.length === 0 && (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                   <div className="flex flex-col items-center gap-4 text-slate-300">
                      <User className="w-16 h-16 opacity-20" />
                      <p className="font-black uppercase tracking-[0.2em] text-sm">
                        {isAr ? "لا يوجد مرضى منومين في هذا القسم" : "No active census in this ward"}
                      </p>
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
