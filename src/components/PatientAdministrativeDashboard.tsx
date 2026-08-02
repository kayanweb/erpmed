import React, { useState, useMemo } from "react";
import { 
  Search, UserPlus, Users, LayoutDashboard, 
  Filter, MoreHorizontal, ChevronRight,
  ShieldCheck, AlertCircle, FileText, Calendar,
  ArrowRightLeft, History, Plus
} from "lucide-react";
import { useHIS } from "../context/HISContext";
import { Patient, EncounterType } from "../types";
import { motion } from "motion/react";
import { ComprehensiveRegistrationModal } from "./ComprehensiveRegistrationModal";

interface PatientAdministrativeDashboardProps {
  language: "ar" | "en";
  onOpenEMR: (patientId: string) => void;
  onStartEncounter: (patientId: string, type: EncounterType) => void;
}

export default function PatientAdministrativeDashboard({ language, onOpenEMR, onStartEncounter }: PatientAdministrativeDashboardProps) {
  const { patients = [], findPatient, mergePatients } = useHIS();
  const isAr = language === "ar";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);

  const filteredPatients = useMemo(() => {
    if (!searchQuery) return patients.slice(0, 10); // Show recent if no search
    return findPatient(searchQuery);
  }, [searchQuery, findPatient, patients]);

  const handleMerge = () => {
    if (selectedPatients.length < 2) return;
    mergePatients(selectedPatients[0], selectedPatients.slice(1));
    setSelectedPatients([]);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 p-6 gap-6" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{isAr ? 'إدارة المرضى والتسجيل' : 'Patient Administration (PAD)'}</h1>
          <p className="text-sm text-slate-500">{isAr ? 'إدارة الملفات الطبية، الزيارات، والبحث المتقدم' : 'Manage MPI, Encounters, and Master Patient Index'}</p>
        </div>
        <div className="flex gap-3">
          {selectedPatients.length >= 2 && (
            <button 
              onClick={handleMerge}
              className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-bold border border-orange-200 hover:bg-orange-200"
            >
              <ArrowRightLeft size={18} />
              {isAr ? 'دمج الملفات المختارة' : 'Merge Selected Profiles'}
            </button>
          )}
          <button 
            onClick={() => setIsRegistrationOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold shadow-lg hover:bg-primary-700 transition-all hover:scale-105 active:scale-95"
          >
            <UserPlus size={18} />
            {isAr ? 'تسجيل مريض جديد' : 'New Patient Registration'}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: isAr ? 'إجمالي المرضى' : 'Total MPI', value: patients.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: isAr ? 'سجلوا اليوم' : 'Today\'s Reg', value: 12, icon: UserPlus, color: 'text-green-600', bg: 'bg-green-100' },
          { label: isAr ? 'زيارات نشطة' : 'Active Visits', value: 45, icon: History, color: 'text-purple-600', bg: 'bg-purple-100' },
          { label: isAr ? 'ملفات مكررة' : 'Potential Duplicates', value: 3, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{stat.label}</p>
              <p className="text-xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Search Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder={isAr ? 'البحث بالاسم، رقم الملف، الهوية، الهاتف...' : 'Search by Name, MRN, National ID, Phone, Passport...'}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-white">
            <Filter size={18} />
            {isAr ? 'تصفية' : 'Advanced Filters'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 w-10"></th>
                <th className="px-6 py-4 font-bold text-slate-900">{isAr ? 'المريض' : 'Patient Info'}</th>
                <th className="px-6 py-4 font-bold text-slate-900">{isAr ? 'رقم الملف' : 'MRN'}</th>
                <th className="px-6 py-4 font-bold text-slate-900">{isAr ? 'الهوية/الجواز' : 'National ID / Passport'}</th>
                <th className="px-6 py-4 font-bold text-slate-900">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="px-6 py-4 font-bold text-slate-900 text-right">{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPatients.map((p) => (
                <motion.tr 
                  layout
                  key={p.id} 
                  className={`hover:bg-slate-50 transition-colors group ${selectedPatients.includes(p.id) ? 'bg-primary-50' : ''}`}
                >
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="checkbox"
                      checked={selectedPatients.includes(p.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedPatients(prev => [...prev, p.id]);
                        else setSelectedPatients(prev => prev.filter(id => id !== p.id));
                      }}
                      className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                        {p.gender === 'male' ? 'M' : 'F'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{isAr ? p.nameAr : p.nameEn}</p>
                        <p className="text-[10px] text-slate-500">{p.age} yrs • {p.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-primary-600 text-xs">
                    {p.mrn}
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-xs">
                    {p.nationalId || p.passportNumber || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      p.status === 'registered' ? 'bg-slate-100 text-slate-600' : 
                      p.status === 'discharged' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onOpenEMR(p.id)}
                        className="p-2 text-slate-600 hover:bg-white hover:text-primary-600 rounded-lg border border-transparent hover:border-slate-200"
                        title={isAr ? 'فتح الملف الطبي' : 'Open EMR'}
                      >
                        <FileText size={18} />
                      </button>
                      <button 
                        onClick={() => onStartEncounter(p.id, 'emergency')}
                        className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-bold border border-red-100 hover:bg-red-100"
                      >
                        <Plus size={14} />
                        {isAr ? 'زيارة طوارئ' : 'ER Visit'}
                      </button>
                      <button 
                        onClick={() => onStartEncounter(p.id, 'outpatient')}
                        className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100 hover:bg-green-100"
                      >
                        <Plus size={14} />
                        {isAr ? 'زيارة عيادة' : 'OPD Visit'}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {filteredPatients.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <Users size={48} strokeWidth={1} className="mb-4" />
              <p>{isAr ? 'لم يتم العثور على نتائج' : 'No patients found matching your search'}</p>
            </div>
          )}
        </div>
      </div>

      {isRegistrationOpen && (
        <ComprehensiveRegistrationModal 
          isOpen={isRegistrationOpen}
          onClose={() => setIsRegistrationOpen(false)}
          isAr={isAr}
        />
      )}
    </div>
  );
}
