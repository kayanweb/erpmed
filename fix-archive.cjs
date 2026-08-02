const fs = require('fs');
let content = fs.readFileSync('src/components/hr/ArchiveSearch.tsx', 'utf8');

// Replace the placeholder static content with something slightly more dynamic
content = `import React, { useState } from "react";
import { FileSearch, Download, Search, FileText } from "lucide-react";
import { motion } from "motion/react";

export default function ArchiveSearch({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";
  const [query, setQuery] = useState("");
  
  const mockResults = [
    { id: "DOC-2023-01", name: isAr ? "عقد العمل - أحمد محمد" : "Employment Contract - Ahmed", date: "2023-01-15" },
    { id: "DOC-2023-02", name: isAr ? "شهادة صحية - سارة علي" : "Health Certificate - Sara", date: "2023-02-20" },
    { id: "DOC-2023-03", name: isAr ? "تجديد إقامة - محمود حسن" : "Iqama Renewal - Mahmoud", date: "2023-03-10" },
  ];
  
  const filtered = query.length > 0 ? mockResults.filter(r => r.name.includes(query) || r.id.includes(query)) : [];

  return (
    <div className="h-full flex flex-col p-6 sm:p-8 overflow-hidden bg-slate-50" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{isAr ? "بحث الأرشيف والمستندات" : "Document Archive Search"}</h2>
          <p className="text-sm font-bold text-slate-500 mt-1">{isAr ? "الوصول لعقود ووثائق الموظفين" : "Access employee contracts and documents"}</p>
        </div>
      </div>
      
      <div className="relative mb-8 shrink-0">
        <Search className="w-6 h-6 absolute top-1/2 -translate-y-1/2 left-5 text-indigo-400" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isAr ? "ابحث برقم الهوية، اسم الموظف، أو رقم المستند..." : "Search by ID, name, or doc number..."}
          className="w-full pl-14 pr-6 py-5 bg-white border-2 border-indigo-100 rounded-[24px] font-black text-lg outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {query === "" ? (
          <div className="flex flex-col items-center justify-center text-center p-8 h-full bg-white border border-slate-200 rounded-[32px] shadow-sm">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <FileSearch className="w-12 h-12 text-indigo-300" />
            </div>
            <h3 className="text-xl font-black text-slate-700 mb-2">{isAr ? "أرشيف مركزي آمن" : "Secure Central Archive"}</h3>
            <p className="text-sm font-bold text-slate-400 max-w-sm">{isAr ? "استخدم شريط البحث أعلاه للوصول السريع لأي مستند يخص الكادر الوظيفي." : "Use the search bar above to quickly access any staff-related document."}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.length > 0 ? filtered.map((res) => (
              <div key={res.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-indigo-300 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{res.name}</h4>
                    <p className="text-xs text-slate-500 font-mono mt-1">{res.id} • {res.date}</p>
                  </div>
                </div>
                <button className="p-3 bg-slate-50 hover:bg-indigo-50 text-indigo-600 rounded-xl transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            )) : (
               <div className="text-center p-8 text-slate-500 font-bold">{isAr ? "لا توجد نتائج مطابقة" : "No matching results found"}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/hr/ArchiveSearch.tsx', content, 'utf8');
