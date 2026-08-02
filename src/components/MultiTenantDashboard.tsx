import React, { useState } from "react";
import { Building2, Plus, Users, Settings, Database, Activity, MapPin, Search } from "lucide-react";
import { MultiTenantManager } from "./MultiTenantManager";

interface Props {
  language: "ar" | "en";
}

export default function MultiTenantDashboard({ language }: Props) {
  const isAr = language === "ar";
  
  // Dummy settings state for the MultiTenantManager component
  const [settingsForm, setSettingsForm] = useState({
    tenants: [
      { name: "Main Hospital Campus", legalId: "HQ-001", taxId: "TAX-12345" },
      { name: "West Wing Clinic", legalId: "WW-002", taxId: "TAX-12345" },
      { name: "Downtown Diagnostic Center", legalId: "DDC-003", taxId: "TAX-67890" }
    ]
  });

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-indigo-600" />
            {isAr ? "المنشآت والفروع (Multi-Tenant)" : "Multi-Tenant Architecture"}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {isAr ? "إدارة المستشفيات والفروع والعيادات من قاعدة بيانات موحدة." : "Manage multiple hospitals, branches, and clinics from a unified database."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <MultiTenantManager language={language} settingsForm={settingsForm} setSettingsForm={setSettingsForm} />
           </div>

           <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
               <Database className="w-5 h-5 text-indigo-500" />
               {isAr ? "حالة العزل للبيانات (Data Isolation Status)" : "Data Isolation Status"}
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                 <p className="text-xs font-bold text-indigo-600 mb-1">{isAr ? "المرضى (Patients)" : "Patients"}</p>
                 <p className="text-sm font-medium text-slate-700">{isAr ? "مشترك بين الفروع المحددة" : "Shared across selected branches"}</p>
               </div>
               <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                 <p className="text-xs font-bold text-emerald-600 mb-1">{isAr ? "المخزون (Inventory)" : "Inventory"}</p>
                 <p className="text-sm font-medium text-slate-700">{isAr ? "معزول لكل فرع" : "Isolated per branch"}</p>
               </div>
               <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                 <p className="text-xs font-bold text-amber-600 mb-1">{isAr ? "المالية (Financials)" : "Financials"}</p>
                 <p className="text-sm font-medium text-slate-700">{isAr ? "منفصل مع تقرير مركزي" : "Isolated with consolidated reporting"}</p>
               </div>
             </div>
           </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <h3 className="font-bold text-lg mb-2 relative z-10">{isAr ? "التوسع السحابي" : "Cloud Expansion"}</h3>
            <p className="text-indigo-100 text-sm mb-4 relative z-10 leading-relaxed">
              {isAr ? "يمكنك إضافة عدد لا نهائي من الفروع الطبية والعيادات. سيتولى النظام آلياً تطبيق سياسات العزل (Isolation) أو المشاركة (Cross-sharing) حسب الإعدادات." : "You can add unlimited medical branches and clinics. The system will automatically apply data isolation or cross-sharing policies."}
            </p>
            <div className="flex items-center gap-2 text-xs font-bold bg-black/20 w-fit px-3 py-1.5 rounded-lg relative z-10">
               <Activity className="w-4 h-4 text-emerald-300" />
               {isAr ? "البنية التحتية جاهزة" : "Infrastructure Ready"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
