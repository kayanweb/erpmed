import React, { useState } from "react";
import { Building2, Network, UserSquare2, FolderTree, GitMerge, Search, Plus, MapPin } from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

export default function OrganizationDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState("chart");

  const departments = [
    { id: 1, name: "Emergency (ER)", head: "Dr. Robert Smith", staff: 45, type: "Clinical", location: "Building A, Floor 1" },
    { id: 2, name: "Intensive Care Unit (ICU)", head: "Dr. Sarah Johnson", staff: 32, type: "Clinical", location: "Building A, Floor 3" },
    { id: 3, name: "Surgery", head: "Dr. Michael Chen", staff: 58, type: "Clinical", location: "Building B, Floor 2" },
    { id: 4, name: "Human Resources", head: "Emily Davis", staff: 12, type: "Admin", location: "Admin Block, Floor 2" },
  ];

  const handleAction = (action: string) => {
    toast.info(isAr ? `إجراء: ${action}` : `Action: ${action}`);
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              {isAr ? "الهيكل التنظيمي للمؤسسة" : "Organizational Structure"}
            </h2>
            <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">
              Departments, Reporting Lines, and Facilities
            </p>
          </div>
        </div>
        <button onClick={() => handleAction('Export Chart')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition">
          {isAr ? "تصدير الهيكل" : "Export Org Chart"}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {[
            { id: "chart", label: isAr ? "الهيكل الإداري" : "Org Chart" },
            { id: "departments", label: isAr ? "الأقسام والوحدات" : "Departments" },
            { id: "facilities", label: isAr ? "المرافق والمباني" : "Facilities" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-bold text-sm whitespace-nowrap transition-colors ${activeTab === tab.id ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "chart" && (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-200">
              <Network className="w-16 h-16 text-slate-300 mb-4" />
              <h3 className="text-xl font-black text-slate-800 mb-2">{isAr ? "خريطة الهيكل التنظيمي" : "Visual Org Chart"}</h3>
              <p className="text-slate-500 max-w-md mx-auto mb-6 text-center">
                {isAr ? "الهيكل الشجري لمديري الأقسام ومسارات رفع التقارير يتم تحميله ديناميكياً." : "Tree structure of department heads and reporting paths is dynamically loaded here."}
              </p>
              <button onClick={() => handleAction('Edit Chart Node')} className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800">
                {isAr ? "تعديل مسارات الإبلاغ" : "Edit Reporting Lines"}
              </button>
            </div>
          )}

          {activeTab === "departments" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400`} />
                  <input
                    type="text"
                    placeholder={isAr ? "بحث عن قسم..." : "Search departments..."}
                    className={`w-full ${isAr ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none`}
                  />
                </div>
                <button onClick={() => handleAction('Add Department')} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition">
                  <Plus className="w-4 h-4" /> {isAr ? "قسم جديد" : "New Department"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {departments.map(dept => (
                  <div key={dept.id} className="p-5 border border-slate-200 rounded-2xl hover:border-emerald-300 hover:shadow-md transition bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-black text-lg text-slate-900">{dept.name}</h3>
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase ${dept.type === 'Clinical' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                        {dept.type}
                      </span>
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 font-bold">
                        <UserSquare2 className="w-4 h-4 text-slate-400" />
                        <span>{isAr ? "المدير:" : "Head:"} {dept.head}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 font-bold">
                        <FolderTree className="w-4 h-4 text-slate-400" />
                        <span>{isAr ? "الكادر:" : "Staff:"} {dept.staff}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 font-bold">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{dept.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "facilities" && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="w-16 h-16 text-slate-300 mb-4" />
              <h3 className="text-xl font-black text-slate-800 mb-2">{isAr ? "إدارة المرافق" : "Facility Management"}</h3>
              <p className="text-slate-500 max-w-md mx-auto mb-6">
                {isAr ? "تكوين المباني، الطوابق، وأجنحة المستشفى لتخطيط المواقع الجغرافية داخل النظام." : "Configure hospital buildings, floors, and wards for location mapping within the system."}
              </p>
              <button onClick={() => handleAction('Manage Facilities')} className="px-6 py-2 border-2 border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50">
                {isAr ? "إضافة مبنى/مرفق" : "Add Building/Facility"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
