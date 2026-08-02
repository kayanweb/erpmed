import React, { useEffect, useState } from 'react';
import { ShieldCheck, ClipboardList, AlertCircle, CheckCircle2 } from 'lucide-react';
import { firestoreService } from '../lib/firestoreService';

interface Accreditation {
  id: string;
  name: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING';
  lastAuditDate: string;
}

interface Props {
  language: 'ar' | 'en';
}

export const AccreditationCenter: React.FC<Props> = ({ language }) => {
  const isAr = language === 'ar';
  const [accreditations, setAccreditations] = useState<Accreditation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await firestoreService.getAll<Accreditation>('accreditations');
        setAccreditations(data);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className={`p-6 w-full space-y-6 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <h2 className="text-lg sm:text-2xl font-black text-slate-800 uppercase tracking-tight">
        {isAr ? "مركز الاعتماد والجودة" : "Accreditation Center"}
      </h2>
      {loading ? (
        <div className="p-12 text-center">{isAr ? "جاري التحميل..." : "Loading..."}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="responsive-table-container custom-scrollbar">
<table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">{isAr ? "المعيار" : "Standard"}</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">{isAr ? "الحالة" : "Status"}</th>
              </tr>
            </thead>
            <tbody>
              {accreditations.map(a => (
                <tr key={a.id} className="border-b border-slate-50">
                  <td className="p-4 font-bold text-slate-800">{a.name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${a.status === 'COMPLIANT' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
</div>
        </div>
      )}
    </div>
  );
};
export default AccreditationCenter;