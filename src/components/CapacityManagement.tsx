import React from 'react';
import { BedDouble, Activity } from 'lucide-react';
import { useHIS } from '../context/HISContext';

interface Props {
  language: 'ar' | 'en';
}

export const CapacityManagement: React.FC<Props> = ({ language }) => {
  const isAr = language === 'ar';
  const { beds } = useHIS();

  return (
    <div className={`p-6 w-full space-y-6 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-indigo-500">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <BedDouble className="w-8 h-8 text-indigo-600" />
            {isAr ? "إدارة الطاقة الاستيعابية الفورية" : "Real-Time Capacity Management"}
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {isAr ? "نظام تتبع إشغال الأسرة وتوزيع الحالات السريرية" : "Track bed occupancy and clinical case distribution"}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-center px-4 border-r border-slate-200 last:border-0">
             <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">{isAr ? "الأسرة المشغولة" : "Occupied"}</p>
             <p className="text-xl font-black text-rose-600">{beds.filter(b => b.status === 'occupied').length}</p>
          </div>
          <div className="text-center px-4 border-r border-slate-200 last:border-0">
             <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">{isAr ? "الأسرة المتاحة" : "Available"}</p>
             <p className="text-xl font-black text-emerald-600">{beds.filter(b => b.status === 'available').length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="responsive-table-container custom-scrollbar">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-xs font-bold text-slate-500 uppercase">
                <th className="p-4 text-center">{isAr ? "رقم السرير" : "Bed Number"}</th>
                <th className="p-4 text-center">{isAr ? "الجناح / القسم" : "Ward / Dept"}</th>
                <th className="p-4 text-center">{isAr ? "الحالة الحالية" : "Current Status"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {beds.length > 0 ? beds.map(b => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-800 text-center">{b.bedNumber || b.id}</td>
                  <td className="p-4 text-slate-500 font-medium text-center">{b.wardId || b.departmentId || "General Ward"}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1 ${
                      b.status === 'available' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      <Activity className="w-3 h-3" />
                      {isAr ? (b.status === 'available' ? "متاح" : "مشغول") : b.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="p-12 text-center text-slate-400 font-bold">
                    {isAr ? "لا توجد أسرة مسجلة في النظام حالياً" : "No beds registered in the system."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default CapacityManagement;