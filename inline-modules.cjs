const fs = require('fs');

const files = [
  "src/components/AmbulanceDashboard.tsx",
  "src/components/BirthDeathRecordDashboard.tsx",
  "src/components/BloodBankDashboard.tsx",
  "src/components/DownloadCenterDashboard.tsx",
  "src/components/FinanceIncomeExpenseDashboard.tsx",
  "src/components/FrontCMSDashboard.tsx",
  "src/components/FrontOfficeDashboard.tsx",
  "src/components/GlobalSettings.tsx",
  "src/components/ICUDashboard.tsx",
  "src/components/PathologyDashboard.tsx"
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Find DynamicModuleRenderer usage
  const importRegex = /import DynamicModuleRenderer from ".\/DynamicModuleRenderer";\n?/g;
  content = content.replace(importRegex, '');
  
  const componentRegex = /<DynamicModuleRenderer[\s\S]*?\/>/g;
  
  if (content.match(componentRegex)) {
    content = content.replace(componentRegex, `
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div>
                    <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">
                        {isAr ? "إدارة " + (mainTabs.find(t => t.id === activeMainTab)?.ar || "") : (mainTabs.find(t => t.id === activeMainTab)?.en || "") + " Management"}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 mt-1">
                        {isAr ? "واجهة التحكم المخصصة" : "Dedicated Control Interface"}
                    </p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">
                    {isAr ? "إضافة سجل جديد" : "Add New Record"}
                </button>
            </div>
            <div className="p-0 flex-1 overflow-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "المعرف" : "ID"}</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "التاريخ" : "Date"}</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "التفاصيل" : "Details"}</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "الحالة" : "Status"}</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{isAr ? "إجراء" : "Action"}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr>
                            <td colSpan={5} className="p-12 text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center mb-4 text-slate-300">
                                        <FilterX className="w-8 h-8" />
                                    </div>
                                    <h4 className="font-black text-slate-700 text-lg mb-1">{isAr ? "لا توجد بيانات حالياً" : "No data available"}</h4>
                                    <p className="text-sm font-bold text-slate-400">{isAr ? "لم يتم العثور على سجلات في هذا القسم" : "No records found in this section"}</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `);
    
    // ensure FilterX is imported
    if (!content.includes('FilterX')) {
      content = content.replace(/import \{([\s\S]*?)\} from ["']lucide-react["'];/, (match, group1) => {
        return `import { FilterX, ${group1} } from "lucide-react";`;
      });
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
