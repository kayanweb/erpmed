import React from 'react';
import { useHIS } from '../context/HISContext';
import { FileText, Search, Archive, UserCheck, ShieldAlert, BarChart, Settings, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlobalEntityLink } from './GlobalEntityLink';

export default function MedicalRecordsDashboard() {
  const { language } = useHIS();
  const isAr = language === 'ar';

  const stats = [
    { title: isAr ? "ملفات نشطة" : "Active Records", value: "12,450", icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: isAr ? "بانتظار الترميز (ICD-10)" : "Pending Coding", value: "142", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { title: isAr ? "ملفات مكتملة (اليوم)" : "Completed Today", value: "86", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: isAr ? "طلبات التقارير" : "Report Requests", value: "15", icon: Archive, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  const recentRecords = [
    { id: "REC-10293", patient: "Ahmed Ali", mrn: "MRN-2026-5521", status: "completed", date: "2026-06-29" },
    { id: "REC-10294", patient: "Fatima Khalid", mrn: "MRN-2026-8832", status: "pending_coding", date: "2026-06-29" },
    { id: "REC-10295", patient: "Omar Saeed", mrn: "MRN-2026-1123", status: "pending_review", date: "2026-06-28" },
    { id: "REC-10296", patient: "Sara Mahmoud", mrn: "MRN-2026-9941", status: "completed", date: "2026-06-28" },
  ];

  return (
    <div className="p-6 space-y-6" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-lg sm:text-2xl font-black text-slate-800 leading-tight">{isAr ? "إدارة السجلات الطبية (HIM)" : "Health Information Management"}</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">{isAr ? "نظام متكامل لإدارة وأرشفة وترميز الملفات الطبية" : "Comprehensive system for managing, archiving, and coding medical records"}</p>
        </div>
        <div className="w-full sm:w-auto">
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition">
            <Search className="w-4 h-4" />
            {isAr ? "البحث في السجلات" : "Search Records"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 sm:gap-4 flex-wrap ">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">{stat.title}</p>
              <p className="text-lg sm:text-2xl font-black text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            {isAr ? "أحدث السجلات الطبية" : "Recent Medical Records"}
          </h3>
        </div>
        <div className="overflow-x-auto responsive-table-container border-none shadow-none">
          <table className="w-full text-sm text-left rtl:text-right ">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">{isAr ? "رقم السجل" : "Record ID"}</th>
                <th className="px-6 py-4">{isAr ? "المريض" : "Patient"}</th>
                <th className="px-6 py-4">{isAr ? "الرقم الطبي" : "MRN"}</th>
                <th className="px-6 py-4">{isAr ? "الحالة" : "Status"}</th>
                <th className="px-6 py-4">{isAr ? "التاريخ" : "Date"}</th>
                <th className="px-6 py-4 text-center">{isAr ? "إجراء" : "Action"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentRecords.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-indigo-600">
                    <GlobalEntityLink entityId={record.id} entityType="case" isAr={isAr}>
                      {record.id}
                    </GlobalEntityLink>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    <GlobalEntityLink entityId={record.mrn} entityName={record.patient} entityType="patient" isAr={isAr}>
                      {record.patient}
                    </GlobalEntityLink>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-500">
                    <GlobalEntityLink entityId={record.mrn} entityName={record.patient} entityType="patient" isAr={isAr}>
                      {record.mrn}
                    </GlobalEntityLink>
                  </td>
                  <td className="px-6 py-4">
                    {record.status === 'completed' && <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">{isAr ? 'مكتمل' : 'Completed'}</span>}
                    {record.status === 'pending_coding' && <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">{isAr ? 'بانتظار الترميز' : 'Pending Coding'}</span>}
                    {record.status === 'pending_review' && <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs font-bold">{isAr ? 'قيد المراجعة' : 'Under Review'}</span>}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono">{record.date}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-indigo-600 hover:text-indigo-800 font-bold text-sm bg-indigo-50 px-3 py-1.5 rounded-lg transition">
                      {isAr ? "عرض الملف" : "View Chart"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
