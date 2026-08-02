import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { syncEncounters } from '../lib/firestoreService';
import { DBEncounterSchema } from '../types';

interface Props {
  language: 'ar' | 'en';
}

export const PatientMovementDashboard: React.FC<Props> = ({ language }) => {
  const isAr = language === 'ar';
  const [encounters, setEncounters] = useState<DBEncounterSchema[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = syncEncounters((data) => {
      // Filter for movement-related encounters (in-progress)
      const movementEncounters = data.filter(e => 
        e.status === 'IN_PROGRESS' || e.status === 'ON_HOLD'
      );
      setEncounters(movementEncounters);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className={`p-6 w-full space-y-6 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-2xl font-black text-slate-800 uppercase tracking-tight">
          {isAr ? "حركة ونقل المرضى" : "Patient Movement"}
        </h2>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-bold">{isAr ? "جاري تحميل البيانات..." : "Loading data..."}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="responsive-table-container custom-scrollbar">
<table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isAr ? "رقم الملف (MRN)" : "MRN"}</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isAr ? "القسم" : "Department"}</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isAr ? "الحالة" : "Status"}</th>
              </tr>
            </thead>
            <tbody>
              {encounters.map(encounter => (
                <tr key={encounter.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="p-4 font-mono text-sm text-slate-700">{encounter.patient_id}</td>
                  <td className="p-4 font-bold text-slate-800">{encounter.department_id || "N/A"}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${encounter.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                      {encounter.status}
                    </span>
                  </td>
                </tr>
              ))}
              {encounters.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">
                    {isAr ? "لا توجد حركة نشطة" : "No active movements"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
</div>
        </div>
      )}
    </div>
  );
};

export default PatientMovementDashboard;
