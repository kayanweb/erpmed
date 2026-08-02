import React, { useState, useEffect } from 'react';
import { Lock, Search, Filter, Plus, Clock, Activity, FileText, CheckCircle, AlertTriangle, ArrowRight, Server, Shield } from 'lucide-react';
import { firestoreService } from '../lib/firestoreService';

interface RecordType {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

interface Props { language: 'ar' | 'en'; onClose?: () => void; }

export default function SecurityDashboard({ language, onClose }: Props) {
  const isAr = language === 'ar';
  const [records, setRecords] = useState<RecordType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await firestoreService.getAll<RecordType>('SecurityDashboard');
        setRecords(data);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="flex-1 p-6 bg-slate-50 min-h-full font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Lock className="w-8 h-8 text-indigo-600 bg-indigo-100 p-1.5 rounded-xl" />
            {isAr ? "مركز الأمان" : "Security Center"}
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            {isAr ? "المراقبة الأمنية المادية والسيبرانية" : "Physical and cyber security monitoring"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onClose && (
             <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-300 transition-colors">
               {isAr ? "إغلاق" : "Close"}
             </button>
          )}
          <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <Plus size={16} />
            {isAr ? "إضافة جديد" : "Add New"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[
          { label: isAr ? "إجمالي السجلات" : "Total Records", value: records.length.toString(), icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
          { label: isAr ? "نشط" : "Active", value: records.filter(r => r.status === 'ACTIVE').length.toString(), icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: isAr ? "غير نشط" : "Inactive", value: records.filter(r => r.status === 'INACTIVE').length.toString(), icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg}`}>
               <stat.icon className={`w-7 h-7 ${stat.color}`} />
             </div>
             <div>
               <p className="text-sm font-bold text-slate-500">{stat.label}</p>
               <p className="text-3xl font-black text-slate-800">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-64">
            <Search className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-3' : 'left-3'} w-4 h-4 text-slate-400`} />
            <input type="text" placeholder={isAr ? "بحث في النظام..." : "Search system..."} className={`w-full ${isAr ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`} />
          </div>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 bg-white">
            <Filter size={18} />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left" dir={isAr ? 'rtl' : 'ltr'}>
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isAr ? "المعرف" : "ID"}</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isAr ? "البيان" : "Description"}</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isAr ? "الحالة" : "Status"}</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500 font-bold">
                    {isAr ? "جاري التحميل..." : "Loading..."}
                  </td>
                </tr>
              ) : records.length > 0 ? (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono text-sm font-bold text-slate-600">{record.id}</td>
                    <td className="p-4 font-medium text-slate-800">{record.name}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-max ${record.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                        {record.status === 'ACTIVE' ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                        {record.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 hover:text-indigo-600 cursor-pointer">
                      <ArrowRight size={18} className={isAr ? "rotate-180" : ""} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest">
                    {isAr ? "لا توجد سجلات" : "No records found"}
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
