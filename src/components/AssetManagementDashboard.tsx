import React, { useEffect, useState } from 'react';
import { 
  Wrench, AlertTriangle, CheckCircle2, Search, Plus, Filter, 
  Settings, Server, Thermometer, Battery, MapPin
} from 'lucide-react';
import { firestoreService } from '../lib/firestoreService';

interface Asset {
  id: string;
  name: string;
  category: string;
  location: string;
  status: 'OPERATIONAL' | 'MAINTENANCE' | 'OFFLINE';
  lastMaintenance: string;
  nextMaintenance: string;
}

interface Props {
  language: 'ar' | 'en';
}

const DUMMY_ASSETS: Asset[] = [
  { id: 'AST-001', name: 'MRI Scanner (Siemens)', category: 'Radiology', location: 'Radiology Dept, Room 1', status: 'OPERATIONAL', lastMaintenance: '2023-09-15', nextMaintenance: '2024-03-15' },
  { id: 'AST-002', name: 'CT Scanner (GE)', category: 'Radiology', location: 'Radiology Dept, Room 2', status: 'MAINTENANCE', lastMaintenance: '2023-10-01', nextMaintenance: '2024-04-01' },
  { id: 'AST-003', name: 'Ultrasound Machine', category: 'Radiology', location: 'ER, Bay 3', status: 'OPERATIONAL', lastMaintenance: '2023-08-20', nextMaintenance: '2024-02-20' },
  { id: 'AST-004', name: 'Defibrillator Unit A', category: 'Emergency', location: 'ER, Resus 1', status: 'OPERATIONAL', lastMaintenance: '2023-11-05', nextMaintenance: '2024-05-05' },
  { id: 'AST-005', name: 'Anesthesia Machine', category: 'Surgery', location: 'OR 1', status: 'OFFLINE', lastMaintenance: '2023-07-10', nextMaintenance: '2024-01-10' },
  { id: 'AST-006', name: 'Patient Monitor', category: 'ICU', location: 'ICU, Bed 4', status: 'OPERATIONAL', lastMaintenance: '2023-10-15', nextMaintenance: '2024-04-15' },
];

export const AssetManagementDashboard: React.FC<Props> = ({ language }) => {
  const isAr = language === 'ar';
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await firestoreService.getAll<Asset>('assets');
        if (data && data.length > 0) {
          setAssets(data);
        } else {
          setAssets(DUMMY_ASSETS);
        }
      } catch (error) {
        console.error("Error loading assets:", error);
        setAssets(DUMMY_ASSETS);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || asset.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: isAr ? "إجمالي الأصول" : "Total Assets", value: assets.length, icon: Server, color: "text-indigo-600", bg: "bg-indigo-100" },
    { label: isAr ? "في الخدمة" : "Operational", value: assets.filter(a => a.status === 'OPERATIONAL').length, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: isAr ? "تحت الصيانة" : "In Maintenance", value: assets.filter(a => a.status === 'MAINTENANCE').length, icon: Wrench, color: "text-amber-600", bg: "bg-amber-100" },
    { label: isAr ? "خارج الخدمة" : "Offline", value: assets.filter(a => a.status === 'OFFLINE').length, icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-100" },
  ];

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 sm:py-4 shrink-0 shadow-sm z-10 flex flex-row flex-wrap items-center justify-between gap-2 sm:gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-200">
            <Settings size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
              {isAr ? "إدارة الأصول والمعدات" : "Asset & Equipment Management"}
            </h1>
            <p className="text-xs font-bold text-slate-500">
              {isAr ? "تتبع ومراقبة وصيانة الأجهزة الطبية" : "Track, monitor and maintain medical equipment"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-indigo-600 text-white text-[11px] font-black uppercase rounded-lg shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2">
            <Plus size={16} />
            {isAr ? "إضافة أصل" : "Add Asset"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">{stat.label}</p>
                <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400`} />
            <input 
              type="text"
              placeholder={isAr ? "البحث برقم الأصل أو الاسم..." : "Search asset ID or name..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${isAr ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={18} className="text-slate-500" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">{isAr ? "جميع الحالات" : "All Status"}</option>
              <option value="OPERATIONAL">{isAr ? "في الخدمة" : "Operational"}</option>
              <option value="MAINTENANCE">{isAr ? "تحت الصيانة" : "Maintenance"}</option>
              <option value="OFFLINE">{isAr ? "خارج الخدمة" : "Offline"}</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500 font-bold">{isAr ? "جاري التحميل..." : "Loading..."}</div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left" dir={isAr ? 'rtl' : 'ltr'}>
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">{isAr ? "معرف الأصل" : "Asset ID"}</th>
                    <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">{isAr ? "الاسم" : "Name"}</th>
                    <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">{isAr ? "الفئة" : "Category"}</th>
                    <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">{isAr ? "الموقع" : "Location"}</th>
                    <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">{isAr ? "الصيانة السابقة" : "Last Maint."}</th>
                    <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">{isAr ? "الصيانة القادمة" : "Next Maint."}</th>
                    <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">{isAr ? "الحالة" : "Status"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAssets.map(asset => (
                    <tr key={asset.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-indigo-600">{asset.id}</td>
                      <td className="p-4 font-bold text-slate-800">{asset.name}</td>
                      <td className="p-4 text-sm font-semibold text-slate-600">{asset.category}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm font-medium text-slate-600">
                          <MapPin size={14} className="text-slate-400" />
                          {asset.location}
                        </div>
                      </td>
                      <td className="p-4 text-sm font-medium text-slate-500">{asset.lastMaintenance}</td>
                      <td className="p-4 text-sm font-medium text-slate-500">{asset.nextMaintenance}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest
                          ${asset.status === 'OPERATIONAL' ? 'bg-emerald-100 text-emerald-700' : 
                            asset.status === 'MAINTENANCE' ? 'bg-amber-100 text-amber-700' : 
                            'bg-rose-100 text-rose-700'}`}>
                          {asset.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredAssets.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500 font-bold">
                        {isAr ? "لم يتم العثور على أصول مطابقة." : "No matching assets found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetManagementDashboard;
