import React, { useState } from "react";
import { 
  Headset, MessageSquare, AlertCircle, 
  CheckCircle2, PhoneCall, Mail, Ticket
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

export default function HelpdeskDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"tickets" | "calls">("tickets");

  const [tickets] = useState([
    { id: "T-8091", user: "Dr. Ahmed (ER)", issue: "Printer not working in triage", priority: "High", status: "Open", time: "10:15 AM" },
    { id: "T-8092", user: "Nurse Sarah (Ward 3)", issue: "Cannot access patient lab results", priority: "Critical", status: "In Progress", time: "11:00 AM" },
    { id: "T-8093", user: "Reception Gate", issue: "Barcode scanner disconnected", priority: "Medium", status: "Resolved", time: "09:30 AM" },
  ]);

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Headset className="w-7 h-7 text-indigo-600" />
            {isAr ? "الدعم الفني وخدمة العملاء (Helpdesk)" : "IT Helpdesk & Support"}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {isAr ? "إدارة بلاغات الأعطال ومشاكل النظام" : "Manage system issues and user support tickets"}
          </p>
        </div>
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <button 
            onClick={() => setActiveTab("tickets")}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${activeTab === "tickets" ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "تذاكر الدعم" : "Support Tickets"}
          </button>
          <button 
            onClick={() => setActiveTab("calls")}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${activeTab === "calls" ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "سجل الاتصالات" : "Call Logs"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                 <Ticket className="w-5 h-5 text-indigo-500" />
                 {activeTab === "tickets" ? (isAr ? "التذاكر المفتوحة" : "Active Tickets") : (isAr ? "المكالمات الواردة" : "Incoming Calls")}
               </h3>
               <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm">
                 {isAr ? "تذكرة جديدة" : "New Ticket"}
               </button>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm" dir={isAr ? "rtl" : "ltr"}>
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-bold">{isAr ? "رقم التذكرة" : "Ticket ID"}</th>
                      <th className="px-4 py-3 font-bold">{isAr ? "المستخدم" : "User/Dept"}</th>
                      <th className="px-4 py-3 font-bold">{isAr ? "المشكلة" : "Issue"}</th>
                      <th className="px-4 py-3 font-bold">{isAr ? "الأهمية" : "Priority"}</th>
                      <th className="px-4 py-3 font-bold">{isAr ? "الحالة" : "Status"}</th>
                      <th className="px-4 py-3 font-bold text-center">{isAr ? "إجراءات" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tickets.map((t, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 font-mono text-slate-600 font-bold">{t.id}</td>
                        <td className="px-4 py-3 font-bold text-slate-800">{t.user}</td>
                        <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate">{t.issue}</td>
                        <td className="px-4 py-3">
                           <span className={`px-2 py-1 rounded text-[10px] font-bold ${t.priority === 'Critical' ? 'bg-rose-100 text-rose-700' : t.priority === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                             {t.priority}
                           </span>
                        </td>
                        <td className="px-4 py-3">
                           <span className={`px-2 py-1 rounded text-[10px] font-bold ${t.status === 'Open' ? 'bg-blue-100 text-blue-700' : t.status === 'In Progress' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>
                             {t.status}
                           </span>
                        </td>
                        <td className="px-4 py-3 flex gap-2 justify-center flex-wrap">
                           <button onClick={() => toast.info(isAr ? "فتح تفاصيل التذكرة" : "Opening ticket details")} className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-1.5 rounded text-[10px] font-bold transition flex items-center gap-1">
                             <MessageSquare className="w-3 h-3" /> {isAr ? "رد" : "Reply"}
                           </button>
                           <button onClick={() => toast.success(isAr ? "تم حل التذكرة" : "Ticket resolved")} className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-2 py-1.5 rounded text-[10px] font-bold transition flex items-center gap-1">
                             <CheckCircle2 className="w-3 h-3" /> {isAr ? "حل" : "Resolve"}
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        </div>

        <div className="space-y-4">
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-4">{isAr ? "قنوات الدعم" : "Support Channels"}</h3>
             <div className="space-y-3">
               <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex flex-wrap items-center gap-2 sm:gap-3 transition border border-slate-200">
                 <PhoneCall className="w-5 h-5 text-emerald-500" />
                 <span className="text-sm font-bold text-left flex-1">{isAr ? "سجل المكالمات" : "Phone Logs"}</span>
               </button>
               <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex flex-wrap items-center gap-2 sm:gap-3 transition border border-slate-200">
                 <MessageSquare className="w-5 h-5 text-indigo-500" />
                 <span className="text-sm font-bold text-left flex-1">{isAr ? "المحادثات المباشرة" : "Live Chats"}</span>
               </button>
               <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex flex-wrap items-center gap-2 sm:gap-3 transition border border-slate-200">
                 <Mail className="w-5 h-5 text-amber-500" />
                 <span className="text-sm font-bold text-left flex-1">{isAr ? "رسائل البريد" : "Email Support"}</span>
               </button>
               <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex flex-wrap items-center gap-2 sm:gap-3 transition border border-slate-200">
                 <AlertCircle className="w-5 h-5 text-rose-500" />
                 <span className="text-sm font-bold text-left flex-1">{isAr ? "تعميم حالة الطوارئ" : "Broadcast Outage"}</span>
               </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
