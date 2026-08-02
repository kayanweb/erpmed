import React, { useState } from "react";
import { User, Activity, Search, Calendar, FileText, CheckCircle2, FileImage, Pill, Stethoscope, Wallet, Clock } from "lucide-react";

export default function UnifiedPatientRecord({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", labelAr: "نظرة عامة", labelEn: "Overview", icon: Activity },
    { id: "timeline", labelAr: "المسار الزمني", labelEn: "Timeline", icon: Clock },
    { id: "orders", labelAr: "الطلبات الطبية", labelEn: "Orders", icon: FileText },
    { id: "medication", labelAr: "الأدوية", labelEn: "Medication", icon: Pill },
    { id: "labs", labelAr: "المختبر", labelEn: "Labs", icon: Activity },
    { id: "imaging", labelAr: "الأشعة", labelEn: "Imaging", icon: FileImage },
    { id: "nursing", labelAr: "التمريض", labelEn: "Nursing", icon: Stethoscope },
    { id: "documents", labelAr: "الوثائق", labelEn: "Documents", icon: FileText },
    { id: "billing", labelAr: "الفوترة", labelEn: "Billing", icon: Wallet }
  ];

  return (
    <div className="space-y-6 animate-fade font-sans h-full flex flex-col" dir={isAr ? "rtl" : "ltr"}>
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl text-white shrink-0">
        <h2 className="text-2xl font-bold mb-2">
          {isAr ? "مساحة عمل المريض (Patient Workspace)" : "Patient Workspace"}
        </h2>
        <p className="text-slate-400">
          {isAr 
            ? "نافذة موحدة وشاملة لعرض جميع تفاصيل المريض دون الحاجة للرجوع إلى القائمة الجانبية." 
            : "A unified, comprehensive window displaying all patient details without returning to the sidebar."}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden min-h-0">
        {/* Patient Header Summary */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap gap-4 items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
              AM
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Ahmed Mohamed Ali</h3>
              <p className="text-sm text-slate-500">MRN: MRN-001 • ID: 28505200100123 • {isAr ? "ذكر" : "Male"} • 42 {isAr ? "سنة" : "Years"}</p>
            </div>
          </div>
          <div className="text-right flex items-center gap-2">
             <div className="relative">
                <Search className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4`} />
                <input 
                  type="text" 
                  placeholder={isAr ? "بحث..." : "Search..."}
                  className={`w-48 ${isAr ? 'pr-9' : 'pl-9'} pr-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500`}
                />
              </div>
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              {isAr ? "ملف موحد ونشط" : "Unified & Active"}
            </span>
          </div>
        </div>

        {/* Workspace Navigation Tabs */}
        <div className="border-b border-slate-200 bg-white px-2 overflow-x-auto hide-scrollbar">
          <div className="flex gap-1 py-2">
            {tabs.map((t) => (
              <button 
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === t.id 
                    ? "bg-slate-900 text-white shadow-sm" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {isAr ? t.labelAr : t.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 p-6 bg-slate-50 overflow-y-auto">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-blue-600 mb-4">
                  <Activity className="h-5 w-5" />
                  <h4 className="font-bold">{isAr ? "الطوارئ (ER)" : "Emergency (ER)"}</h4>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Last Visit:</span>
                    <span className="font-medium text-slate-900">12 May 2026</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Status:</span>
                    <span className="font-medium text-slate-700">Discharged</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-purple-600 mb-4">
                  <Calendar className="h-5 w-5" />
                  <h4 className="font-bold">{isAr ? "العيادات (Clinics)" : "Clinics (OPD)"}</h4>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Next Appt:</span>
                    <span className="font-medium text-slate-900">25 Jul 2026</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Dept:</span>
                    <span className="font-medium text-slate-700">Cardiology</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-600 mb-4">
                  <User className="h-5 w-5" />
                  <h4 className="font-bold">{isAr ? "التنويم (Inpatient)" : "Inpatient (Ward)"}</h4>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Admission:</span>
                    <span className="font-medium text-slate-900">N/A</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Bed:</span>
                    <span className="font-medium text-slate-700">None</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab !== "overview" && (
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-slate-300 rounded-2xl">
               <div className="text-center">
                 <div className="h-12 w-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                   <Clock className="h-6 w-6 text-slate-400" />
                 </div>
                 <h4 className="text-lg font-bold text-slate-700 mb-1">{isAr ? "لا توجد بيانات متاحة حالياً" : "No Data Available Yet"}</h4>
                 <p className="text-slate-500">{isAr ? "سيتم عرض البيانات في هذه الشاشة" : "Data will be displayed here for this module."}</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
