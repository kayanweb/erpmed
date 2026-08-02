import React, { useState } from "react";
import { ShieldCheck, Plus, Search, Building2, BriefcaseMedical, Filter, FileText, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

export default function TPAManagementDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"tpa_list" | "approvals" | "contracts">("tpa_list");

  const tpaList = [
    { id: "TPA-01", name: "Bupa Arabia", activePolicies: 1250, status: "Active", contact: "info@bupa.com" },
    { id: "TPA-02", name: "Tawuniya", activePolicies: 840, status: "Active", contact: "support@tawuniya.com" },
    { id: "TPA-03", name: "Medgulf", activePolicies: 430, status: "Pending Renewal", contact: "contracts@medgulf.com" },
  ];

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 sm:w-8 sm:h-8 text-emerald-600 bg-emerald-100 p-1.5 rounded-xl" />
            {isAr ? "إدارة شركات التأمين (TPA)" : "TPA Management"}
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {isAr ? "إدارة شركات التأمين وتفاصيل الموافقات والعقود" : "Manage Third Party Administrators, approvals, and contracts"}
          </p>
        </div>
      </div>

      <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1 mb-6 overflow-x-auto">
        {[
          { id: "tpa_list", labelAr: "قائمة الشركات", labelEn: "TPA Organizations", icon: Building2 },
          { id: "approvals", labelAr: "الموافقات الطبية", labelEn: "Medical Approvals", icon: CheckCircle2 },
          { id: "contracts", labelAr: "العقود والأسعار", labelEn: "Contracts & Pricing", icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2 text-sm font-bold rounded-lg transition whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-emerald-100 text-emerald-700"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {isAr ? tab.labelAr : tab.labelEn}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-72">
            <Search className={`absolute ${isAr ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
            <input
              type="text"
              placeholder={isAr ? "بحث..." : "Search..."}
              className={`w-full bg-slate-50 border border-slate-200 rounded-xl ${isAr ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 text-sm focus:border-emerald-500 outline-none transition`}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl transition">
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={() => toast.success(isAr ? "تم فتح نافذة الإضافة" : "Add modal opened")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              {isAr ? "إضافة جديد" : "Add New"}
            </button>
          </div>
        </div>

        {activeTab === "tpa_list" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">{isAr ? "كود الشركة" : "TPA Code"}</th>
                  <th className="px-4 py-3">{isAr ? "اسم الشركة" : "Organization Name"}</th>
                  <th className="px-4 py-3">{isAr ? "البوالص الفعالة" : "Active Policies"}</th>
                  <th className="px-4 py-3">{isAr ? "التواصل" : "Contact"}</th>
                  <th className="px-4 py-3">{isAr ? "الحالة" : "Status"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tpaList.map(tpa => (
                  <tr key={tpa.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-700">{tpa.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{tpa.name}</td>
                    <td className="px-4 py-3 text-slate-600">{tpa.activePolicies.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-600">{tpa.contact}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        tpa.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {tpa.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "approvals" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-2 sm:gap-4 flex-wrap ">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-lg"><Clock className="w-6 h-6"/></div>
              <div>
                <p className="text-sm text-amber-700 font-bold">{isAr ? "قيد الانتظار" : "Pending Approvals"}</p>
                <p className="text-lg sm:text-2xl font-black text-amber-800">45</p>
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-2 sm:gap-4 flex-wrap ">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><CheckCircle2 className="w-6 h-6"/></div>
              <div>
                <p className="text-sm text-emerald-700 font-bold">{isAr ? "موافق عليها اليوم" : "Approved Today"}</p>
                <p className="text-lg sm:text-2xl font-black text-emerald-800">128</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "contracts" && (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-2">{isAr ? "عقود التأمين" : "Insurance Contracts"}</h3>
            <p className="text-slate-500">{isAr ? "اختر شركة لعرض تفاصيل التعاقد" : "Select a TPA to view contract details"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
