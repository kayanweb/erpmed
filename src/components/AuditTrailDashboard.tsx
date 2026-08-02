import React, { useState, useEffect } from "react";
import { History, Search, Filter, ShieldAlert, Activity, Calendar } from "lucide-react";
import { AuditEntry, syncAuditTrail } from "../lib/auditService";

export default function AuditTrailDashboard({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModule, setFilterModule] = useState<string>("ALL");
  const [logs, setLogs] = useState<AuditEntry[]>([]);

  useEffect(() => {
    const unsubscribe = syncAuditTrail(setLogs);
    return () => unsubscribe();
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.userName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) || 
      log.action?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      log.module?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      (log.detailsEn && log.detailsEn?.toLowerCase()?.includes(searchTerm?.toLowerCase())) ||
      (log.detailsAr && log.detailsAr?.includes(searchTerm));
    const matchesModule = filterModule === "ALL" || log.module === filterModule;
    return matchesSearch && matchesModule;
  });

  const modules = ["ALL", ...new Set(logs.map(l => l.module))];

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <History className="w-7 h-7 text-indigo-600" />
            {isAr ? "سجل التدقيق (Audit Trail)" : "Audit Trail Logs"}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {isAr ? "تتبع جميع الإجراءات والأنشطة في النظام بصلاحية قراءة فقط (غير قابل للتعديل)." : "Track all system actions and activities (Immutable/Read-only)."}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className={`absolute ${isAr ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
            <input 
              type="text"
              placeholder={isAr ? "بحث برقم المستخدم، الإجراء، الموديول..." : "Search by user, action, module..."}
              className={`w-full bg-white border border-slate-200 rounded-xl py-2 ${isAr ? "pr-10 pl-4" : "pl-10 pr-4"} text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1 sm:flex-none"
            >
              {modules.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left" dir={isAr ? "rtl" : "ltr"}>
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{isAr ? "الوقت" : "Timestamp"}</th>
                <th className="py-3 px-4">{isAr ? "المستخدم" : "User"}</th>
                <th className="py-3 px-4">{isAr ? "الموديول" : "Module"}</th>
                <th className="py-3 px-4">{isAr ? "الإجراء" : "Action"}</th>
                <th className="py-3 px-4">{isAr ? "التفاصيل" : "Details"}</th>
                <th className="py-3 px-4">{isAr ? "IP Address" : "IP"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(log.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{log.userName}</span>
                      <span className="text-[11px] text-slate-500 uppercase">{log.userRole}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md font-medium border border-slate-200">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs font-bold text-slate-700">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={isAr ? log.detailsAr : log.detailsEn}>
                    {isAr ? log.detailsAr : log.detailsEn}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-500">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500 font-medium">
                    {isAr ? "لا توجد سجلات مطابقة للبحث." : "No audit logs found matching your criteria."}
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
