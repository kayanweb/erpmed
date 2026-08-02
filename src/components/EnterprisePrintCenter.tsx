
import React, { useState } from 'react';
import { Printer, FileText, Download, Settings, Search, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PrintJob {
  id: string;
  documentName: string;
  type: string;
  status: 'pending' | 'printing' | 'completed' | 'failed';
  timestamp: string;
  user: string;
  pages: number;
}

export default function EnterprisePrintCenter({ language }: { language: 'ar' | 'en' }) {
  const isAr = language === 'ar';
  const [jobs, setJobs] = useState<PrintJob[]>([
    { id: '1', documentName: 'Patient_Report_MRN001.pdf', type: 'Clinical Report', status: 'completed', timestamp: new Date().toISOString(), user: 'Dr. Ahmed', pages: 3 },
    { id: '2', documentName: 'Billing_Invoice_INV992.pdf', type: 'Invoice', status: 'printing', timestamp: new Date().toISOString(), user: 'Receptionist Mona', pages: 1 },
  ]);

  const clearHistory = () => {
    setJobs([]);
    toast.success(isAr ? "تم مسح سجل الطباعة" : "Print history cleared");
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Printer className="w-5 h-5 text-slate-500" />
          <h3 className="font-bold text-slate-800">{isAr ? "مركز الطباعة المؤسسي" : "Enterprise Print Center"}</h3>
        </div>
        <div className="flex gap-2">
           <button onClick={clearHistory} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
              <Trash2 className="w-4 h-4" />
           </button>
           <button className="p-2 text-slate-400 hover:text-sky-600 transition-colors">
              <Settings className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="p-4 bg-sky-50/50 border-b border-sky-100">
        <div className="relative">
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder={isAr ? "البحث في المستجلات المطبوعة..." : "Search print history..."}
            className="w-full pl-10 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-4 text-right">{isAr ? "المستند" : "Document"}</th>
              <th className="p-4 text-right">{isAr ? "النوع" : "Type"}</th>
              <th className="p-4 text-right">{isAr ? "المستخدم" : "User"}</th>
              <th className="p-4 text-right">{isAr ? "الحالة" : "Status"}</th>
              <th className="p-4 text-right">{isAr ? "الإجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.map(job => (
              <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-50 rounded-lg">
                      <FileText className="w-4 h-4 text-rose-500" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{job.documentName}</p>
                      <p className="text-xs text-slate-400">{job.pages} {isAr ? "صفحات" : "pages"}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-slate-600">{job.type}</td>
                <td className="p-4 text-slate-600">{job.user}</td>
                <td className="p-4">
                  <div className="flex items-center gap-1.5">
                    {job.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    {job.status === 'printing' && <Printer className="w-4 h-4 text-sky-500 animate-pulse" />}
                    {job.status === 'failed' && <AlertCircle className="w-4 h-4 text-rose-500" />}
                    <span className={`text-xs font-bold ${
                      job.status === 'completed' ? 'text-emerald-600' : 
                      job.status === 'printing' ? 'text-sky-600' : 'text-rose-600'
                    }`}>
                      {isAr ? 
                        (job.status === 'completed' ? 'تمت الطباعة' : job.status === 'printing' ? 'جاري الطباعة' : 'فشلت') : 
                        job.status.toUpperCase()}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <button className="p-2 text-slate-400 hover:text-sky-600 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {jobs.length === 0 && (
        <div className="p-12 text-center">
          <Printer className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">{isAr ? "لا يوجد سجل طباعة حالياً" : "No print history available"}</p>
        </div>
      )}
    </div>
  );
}
