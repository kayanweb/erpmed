import React from 'react';
import { FileText, Download, Filter, BarChart3 } from 'lucide-react';

export default function DepartmentReports({ language }: { language: 'ar' | 'en' }) {
  const isAr = language === 'ar';

  const reports = [
    { titleEn: 'Daily Census Report', titleAr: 'تقرير الإحصاء اليومي', date: 'Oct 24, 2023', type: 'PDF' },
    { titleEn: 'Discharge Summary', titleAr: 'ملخص الخروج', date: 'Oct 24, 2023', type: 'Excel' },
    { titleEn: 'Infection Control Audit', titleAr: 'تدقيق مكافحة العدوى', date: 'Oct 23, 2023', type: 'PDF' },
    { titleEn: 'Bed Occupancy Metrics', titleAr: 'مقاييس إشغال الأسرة', date: 'Oct 20, 2023', type: 'CSV' },
  ];

  return (
    <div className="p-6 space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-sky-600" />
            {isAr ? 'تقارير القسم' : 'Department Reports'}
          </h2>
          <p className="text-slate-500 mt-1">{isAr ? 'التقارير الإحصائية والتشغيلية للقسم' : 'Statistical and operational reports for the department'}</p>
        </div>
        <button className="bg-white border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-slate-50 flex items-center gap-2 transition">
          <Filter className="w-4 h-4" />
          {isAr ? 'تصفية التقارير' : 'Filter Reports'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-sky-200 hover:shadow-md transition group cursor-pointer">
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-sky-500 group-hover:bg-sky-50 transition">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{isAr ? report.titleAr : report.titleEn}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span>{report.date}</span>
                  <span>•</span>
                  <span className="font-mono bg-slate-100 px-1.5 rounded">{report.type}</span>
                </div>
              </div>
            </div>
            <button className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition">
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
