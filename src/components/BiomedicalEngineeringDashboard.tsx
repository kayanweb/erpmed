import React, { useEffect, useState } from 'react';
import { Activity, Wrench, AlertTriangle, CheckCircle } from 'lucide-react';
import { firestoreService } from '../lib/firestoreService';

interface MedicalAsset {
  id: string;
  name: string;
  department: string;
  status: 'OPERATIONAL' | 'MAINTENANCE' | 'OFFLINE';
  lastServiceDate: string;
}

interface Props {
  language: 'ar' | 'en';
}

export const BiomedicalEngineeringDashboard: React.FC<Props> = ({ language }) => {
  const isAr = language === 'ar';
  const [assets, setAssets] = useState<MedicalAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const data = await firestoreService.getAll<MedicalAsset>('medicalAssets');
        setAssets(data);
      } catch (e) {
        console.error("Failed to load assets", e);
      } finally {
        setLoading(false);
      }
    };
    loadAssets();
  }, []);

  return (
    <div className={`p-6 w-full space-y-6 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-2xl font-black text-slate-800 uppercase tracking-tight">
          {isAr ? "الهندسة الطبية" : "Biomedical Engineering"}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <div className="text-sm font-bold text-slate-500 uppercase">{isAr ? "إجمالي الأصول" : "Total Assets"}</div>
           <div className="text-3xl font-black text-slate-800">{assets.length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <div className="text-sm font-bold text-amber-600 uppercase">{isAr ? "تحت الصيانة" : "Under Maintenance"}</div>
           <div className="text-3xl font-black text-amber-600">{assets.filter(a => a.status === 'MAINTENANCE').length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <div className="text-sm font-bold text-emerald-600 uppercase">{isAr ? "جاهز للعمل" : "Operational"}</div>
           <div className="text-3xl font-black text-emerald-600">{assets.filter(a => a.status === 'OPERATIONAL').length}</div>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-bold">{isAr ? "جاري تحميل البيانات..." : "Loading data..."}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="responsive-table-container custom-scrollbar">
<table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isAr ? "الجهاز" : "Asset"}</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isAr ? "القسم" : "Department"}</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isAr ? "الحالة" : "Status"}</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(asset => (
                <tr key={asset.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-800">{asset.name}</td>
                  <td className="p-4 text-sm text-slate-600">{asset.department}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                      asset.status === 'OPERATIONAL' ? 'bg-emerald-100 text-emerald-700' : 
                      asset.status === 'MAINTENANCE' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                </tr>
              ))}
              {assets.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">
                    {isAr ? "لا توجد أصول مسجلة" : "No assets registered"}
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

export default BiomedicalEngineeringDashboard;
