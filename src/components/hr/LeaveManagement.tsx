import React, { useState } from "react";
import { Calendar, Filter, Plus, Search, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function LeaveManagement({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState("pending");

  const leaves = [
    { id: "LV-102", employee: isAr ? "د. أحمد سامي" : "Dr. Ahmed Sami", role: isAr ? "طبيب قلب" : "Cardiologist", type: isAr ? "إجازة سنوية" : "Annual Leave", start: "2026-08-01", end: "2026-08-14", days: 14, status: "pending", appliedOn: "2026-07-20" },
    { id: "LV-103", employee: isAr ? "سارة خالد" : "Sarah Khaled", role: isAr ? "ممرضة طوارئ" : "ER Nurse", type: isAr ? "إجازة مرضية" : "Sick Leave", start: "2026-07-25", end: "2026-07-27", days: 3, status: "approved", appliedOn: "2026-07-24" },
    { id: "LV-104", employee: isAr ? "محمد علي" : "Mohamed Ali", role: isAr ? "فني أشعة" : "Radiology Tech", type: isAr ? "إجازة طارئة" : "Emergency", start: "2026-07-26", end: "2026-07-26", days: 1, status: "rejected", appliedOn: "2026-07-26" },
  ];

  const filtered = leaves.filter(l => l.status === activeTab || activeTab === "all");

  return (
    <div className="h-full flex flex-col bg-slate-50" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-800">{isAr ? "إدارة الإجازات" : "Leave Management"}</h2>
          <p className="text-sm text-slate-500">{isAr ? "مراجعة واعتماد طلبات الإجازة" : "Review and approve leave requests"}</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {isAr ? "طلب إجازة جديد" : "New Leave Request"}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap gap-4 justify-between items-center bg-slate-50/50">
          <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
            {["pending", "approved", "rejected", "all"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-colors ${activeTab === tab ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                {isAr ? 
                  (tab === "pending" ? "قيد الانتظار" : tab === "approved" ? "معتمدة" : tab === "rejected" ? "مرفوضة" : "الكل") 
                  : tab}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className={`w-4 h-4 absolute top-2.5 ${isAr ? "right-3" : "left-3"} text-slate-400`} />
              <input 
                type="text" 
                placeholder={isAr ? "بحث..." : "Search..."} 
                className={`pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 ${isAr ? "pr-10 pl-4" : ""}`}
              />
            </div>
            <button className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th className={`py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${isAr ? "text-right" : "text-left"}`}>{isAr ? "رقم الطلب" : "ID"}</th>
                <th className={`py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${isAr ? "text-right" : "text-left"}`}>{isAr ? "الموظف" : "Employee"}</th>
                <th className={`py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${isAr ? "text-right" : "text-left"}`}>{isAr ? "نوع الإجازة" : "Leave Type"}</th>
                <th className={`py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${isAr ? "text-right" : "text-left"}`}>{isAr ? "المدة" : "Duration"}</th>
                <th className={`py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${isAr ? "text-right" : "text-left"}`}>{isAr ? "تاريخ الطلب" : "Applied On"}</th>
                <th className={`py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${isAr ? "text-right" : "text-left"}`}>{isAr ? "الحالة" : "Status"}</th>
                <th className={`py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center`}>{isAr ? "إجراء" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((leave) => (
                <tr key={leave.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-sm font-bold text-slate-700">{leave.id}</td>
                  <td className="py-3 px-4">
                    <div className="text-sm font-bold text-slate-800">{leave.employee}</div>
                    <div className="text-xs text-slate-500">{leave.role}</div>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-slate-600">{leave.type}</td>
                  <td className="py-3 px-4">
                    <div className="text-sm font-medium text-slate-800">{leave.days} {isAr ? "أيام" : "Days"}</div>
                    <div className="text-xs text-slate-500">{leave.start} - {leave.end}</div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{leave.appliedOn}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      leave.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                      leave.status === "rejected" ? "bg-rose-100 text-rose-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {leave.status === "approved" && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {leave.status === "rejected" && <XCircle className="w-3.5 h-3.5" />}
                      {leave.status === "pending" && <Clock className="w-3.5 h-3.5" />}
                      {isAr ? 
                        (leave.status === "pending" ? "قيد الانتظار" : leave.status === "approved" ? "معتمدة" : "مرفوضة") 
                        : leave.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title={isAr ? "اعتماد" : "Approve"}>
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title={isAr ? "رفض" : "Reject"}>
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
                    {isAr ? "لا توجد بيانات لعرضها" : "No data available"}
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
