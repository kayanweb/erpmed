const fs = require('fs');

let content = fs.readFileSync('src/components/IPDDashboard.tsx', 'utf8');

// Replace DynamicModuleRenderer usage with actual local components
const regex = /{$$"bedmap", "transfers", "discharges"$\$.includes\(activeMainTab\) && \([\s\S]*?<\/div>\n              \)}/g;

const replacement = `
              {activeMainTab === "bedmap" && (
                <div className="p-8 h-full overflow-y-auto">
                   <h2 className="text-xl font-black mb-6 text-slate-800">{isAr ? "خريطة الأسرة" : "Bed Map"}</h2>
                   <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                     {activeWardPatients.map(p => (
                       <div key={p.id} className="bg-white border-2 border-indigo-100 p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
                         <BedDouble className="w-8 h-8 text-indigo-400 mb-2" />
                         <span className="font-bold text-slate-800 text-sm">{isAr ? p.nameAr : p.nameEn}</span>
                         <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded mt-2">{p.bedId || 'Unassigned'}</span>
                       </div>
                     ))}
                   </div>
                </div>
              )}
              {activeMainTab === "transfers" && (
                <div className="p-8 h-full overflow-y-auto">
                   <h2 className="text-xl font-black mb-6 text-slate-800">{isAr ? "طلبات النقل" : "Transfer Requests"}</h2>
                   <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                     <table className="w-full text-left">
                       <thead className="bg-slate-50 border-b border-slate-200">
                         <tr>
                           <th className="p-4 text-xs font-black text-slate-500 uppercase">{isAr ? "المريض" : "Patient"}</th>
                           <th className="p-4 text-xs font-black text-slate-500 uppercase">{isAr ? "من قسم" : "From"}</th>
                           <th className="p-4 text-xs font-black text-slate-500 uppercase">{isAr ? "إلى قسم" : "To"}</th>
                           <th className="p-4 text-xs font-black text-slate-500 uppercase">{isAr ? "الإجراء" : "Action"}</th>
                         </tr>
                       </thead>
                       <tbody>
                         <tr>
                           <td colSpan={4} className="p-8 text-center text-slate-500 font-bold">{isAr ? "لا توجد طلبات نقل" : "No pending transfers"}</td>
                         </tr>
                       </tbody>
                     </table>
                   </div>
                </div>
              )}
              {activeMainTab === "discharges" && (
                <div className="p-8 h-full overflow-y-auto">
                   <h2 className="text-xl font-black mb-6 text-slate-800">{isAr ? "مرضى الخروج" : "Discharges"}</h2>
                   <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                     <table className="w-full text-left">
                       <thead className="bg-slate-50 border-b border-slate-200">
                         <tr>
                           <th className="p-4 text-xs font-black text-slate-500 uppercase">{isAr ? "المريض" : "Patient"}</th>
                           <th className="p-4 text-xs font-black text-slate-500 uppercase">{isAr ? "تاريخ الخروج" : "Discharge Date"}</th>
                           <th className="p-4 text-xs font-black text-slate-500 uppercase">{isAr ? "الحالة" : "Status"}</th>
                         </tr>
                       </thead>
                       <tbody>
                         <tr>
                           <td colSpan={3} className="p-8 text-center text-slate-500 font-bold">{isAr ? "لا توجد حالات خروج اليوم" : "No discharges today"}</td>
                         </tr>
                       </tbody>
                     </table>
                   </div>
                </div>
              )}
`;

content = content.replace(regex, replacement);

fs.writeFileSync('src/components/IPDDashboard.tsx', content, 'utf8');
