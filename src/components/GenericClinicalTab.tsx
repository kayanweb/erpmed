import React, { useState } from "react";
import { Plus, Edit, Trash2, CheckCircle, PenTool, Printer, Download, Search, Filter } from "lucide-react";

interface Props {
  language: string;
  titleEn: string;
  titleAr: string;
}

export default function GenericClinicalTab({ language, titleEn, titleAr }: Props) {
  const isAr = language === "ar";
  const [data, setData] = useState<any[]>([{ id: 1, date: "2026-07-15", author: "Dr. Ahmed", status: "Pending", content: "Sample record for " + titleEn }]);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-white">
      <div className="flex flex-wrap items-center justify-between p-4 border-b border-slate-200 gap-4">
        <h3 className="font-bold text-lg text-slate-800">{isAr ? titleAr : titleEn}</h3>
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700">
            <Plus className="w-4 h-4" /> {isAr ? "إضافة" : "Add"}
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700">
            <CheckCircle className="w-4 h-4" /> {isAr ? "اعتماد" : "Approve"}
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded text-sm hover:bg-purple-700">
            <PenTool className="w-4 h-4" /> {isAr ? "توقيع إلكتروني" : "e-Sign"}
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded text-sm hover:bg-slate-200">
            <Printer className="w-4 h-4" /> {isAr ? "طباعة" : "Print"}
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded text-sm hover:bg-slate-200">
            <Download className="w-4 h-4" /> {isAr ? "تصدير" : "Export"}
          </button>
        </div>
      </div>
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder={isAr ? "بحث..." : "Search..."} className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-indigo-500" />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 text-slate-600 rounded text-sm hover:bg-slate-50">
          <Filter className="w-4 h-4" /> {isAr ? "فلترة" : "Filter"}
        </button>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
              <th className="p-3">{isAr ? "التاريخ" : "Date"}</th>
              <th className="p-3">{isAr ? "المحتوى" : "Content"}</th>
              <th className="p-3">{isAr ? "بواسطة" : "Author"}</th>
              <th className="p-3">{isAr ? "الحالة" : "Status"}</th>
              <th className="p-3 text-right">{isAr ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3 text-sm text-slate-600">{row.date}</td>
                <td className="p-3 text-sm text-slate-800 font-medium">{row.content}</td>
                <td className="p-3 text-sm text-slate-600">{row.author}</td>
                <td className="p-3 text-sm"><span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">{row.status}</span></td>
                <td className="p-3 text-right flex items-center justify-end gap-2">
                  <button className="p-1 text-slate-400 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                  <button className="p-1 text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
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
