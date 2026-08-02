import React, { useState, useMemo } from "react";
import { Database, List, ShieldCheck, FileKey, Settings2, Plus, Edit, Trash2, X, Search, Globe, TestTube, Activity } from "lucide-react";
import { toast } from "sonner";
import { LAB_TESTS, RADIOLOGY_EXAMS } from "../data/medicalDictionary";

interface Props {
  language: "ar" | "en";
}

export default function MasterDataDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"lookups" | "icd10" | "loinc">("lookups");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [items, setItems] = useState([
    { id: 1, code: "EG", ar: "مصري", en: "Egyptian", active: true },
    { id: 2, code: "SA", ar: "سعودي", en: "Saudi", active: true },
    { id: 3, code: "US", ar: "أمريكي", en: "American", active: true },
    { id: 4, code: "UK", ar: "بريطاني", en: "British", active: false },
  ]);

  const [formData, setFormData] = useState({ code: "", ar: "", en: "" });

  const handleSave = () => {
    if (!formData.code || !formData.ar || !formData.en) {
      toast.error(isAr ? "يرجى تعبئة جميع الحقول" : "Please fill all fields");
      return;
    }
    setItems([{ id: Date.now(), ...formData, active: true }, ...items]);
    setFormData({ code: "", ar: "", en: "" });
    setIsModalOpen(false);
    toast.success(isAr ? "تمت إضافة العنصر بنجاح" : "Item added successfully");
  };

  const handleAction = (action: string, itemId?: number) => {
    if (action === "Delete" && itemId) {
      setItems(prev => prev.filter(i => i.id !== itemId));
      toast.success(isAr ? "تم حذف العنصر بنجاح" : "Item deleted successfully");
    } else {
      toast.info(isAr ? `تم تنفيـذ إجراء: ${action}` : `Action ${action} executed`);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Database className="w-7 h-7 text-indigo-600" />
            {isAr ? "البيانات المرجعية (Master Data)" : "Master Data Management"}
          </h2>
          <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-sm">
            {isAr ? "إدارة القوائم المنسدلة، التكويدات، والتصنيفات" : "Manage lookup tables, codes, and classifications"}
          </p>
        </div>
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <button 
            onClick={() => setActiveTab("lookups")}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${activeTab === "lookups" ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "القوائم المنسدلة" : "Lookup Tables"}
          </button>
          <button 
            onClick={() => setActiveTab("icd10")}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${activeTab === "icd10" ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "الأشعة والفحوصات" : "Radiology & Exams"}
          </button>
          <button 
            onClick={() => setActiveTab("loinc")}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${activeTab === "loinc" ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "التحاليل الطبية" : "Lab Tests"}
          </button>
        </div>
      </div>

      {activeTab === "lookups" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row min-h-[500px] overflow-hidden">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-4 shrink-0">
            <div className="font-black text-slate-800 mb-4 px-2">{isAr ? "جداول النظام" : "System Tables"}</div>
            <div className="space-y-1">
              {[
                { id: "nationalities", icon: Globe, label: isAr ? "الجنسيات" : "Nationalities" },
                { id: "cities", icon: List, label: isAr ? "المدن والمناطق" : "Cities & Regions" },
                { id: "religions", icon: ShieldCheck, label: isAr ? "الديانات" : "Religions" },
                { id: "job_titles", icon: FileKey, label: isAr ? "المسميات الوظيفية" : "Job Titles" },
              ].map(table => (
                <button 
                  key={table.id}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${table.id === 'nationalities' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                  <table.icon className="w-4 h-4" />
                  {table.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={isAr ? "بحث في الجدول..." : "Search in table..."}
                  className={`w-full ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none`}
                />
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                {isAr ? "عنصر جديد" : "New Item"}
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm" dir={isAr ? "rtl" : "ltr"}>
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">{isAr ? "الكود" : "Code"}</th>
                    <th className="px-4 py-3">{isAr ? "الاسم بالعربية" : "Arabic Name"}</th>
                    <th className="px-4 py-3">{isAr ? "الاسم بالإنجليزية" : "English Name"}</th>
                    <th className="px-4 py-3">{isAr ? "الحالة" : "Status"}</th>
                    <th className="px-4 py-3 text-center">{isAr ? "إجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.filter(i => i.ar?.toLowerCase()?.includes(searchQuery?.toLowerCase()) || i.en?.toLowerCase()?.includes(searchQuery?.toLowerCase()) || i.code?.toLowerCase()?.includes(searchQuery?.toLowerCase())).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-700">{item.code}</td>
                      <td className="px-4 py-3 text-slate-900 font-bold">{item.ar}</td>
                      <td className="px-4 py-3 text-slate-900 font-bold">{item.en}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                          {item.active ? (isAr ? 'نشط' : 'Active') : (isAr ? 'معطل' : 'Inactive')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleAction('Edit', item.id)} className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleAction('Delete', item.id)} className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "icd10" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden animate-fade-in h-[600px]">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              {isAr ? `الأشعة والفحوصات (${RADIOLOGY_EXAMS.length} إجراء)` : `Radiology & Exams (${RADIOLOGY_EXAMS.length} Procedures)`}
            </h3>
            <div className="relative w-64">
              <Search className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={isAr ? "بحث..." : "Search..."}
                className={`w-full ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none`}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <table className="w-full text-left text-sm" dir={isAr ? "rtl" : "ltr"}>
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3">{isAr ? "الكود" : "Code"}</th>
                  <th className="px-4 py-3">{isAr ? "الاسم" : "Name"}</th>
                  <th className="px-4 py-3">{isAr ? "القسم" : "Category"}</th>
                  <th className="px-4 py-3">{isAr ? "المنطقة" : "Region"}</th>
                  <th className="px-4 py-3 text-right">{isAr ? "السعر" : "Price"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {RADIOLOGY_EXAMS.filter(i => i.nameAr?.includes(searchQuery) || i.nameEn?.toLowerCase()?.includes(searchQuery?.toLowerCase()) || i.code?.toLowerCase()?.includes(searchQuery?.toLowerCase())).slice(0, 100).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-500">{item.code}</td>
                    <td className="px-4 py-3 text-slate-800 font-bold">{isAr ? item.nameAr : item.nameEn}</td>
                    <td className="px-4 py-3 text-slate-600">{item.category}</td>
                    <td className="px-4 py-3 text-slate-600">{item.region}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-indigo-600">{item.price} SR</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 text-center text-slate-500 text-xs">Showing top 100 results...</div>
          </div>
        </div>
      )}

      {activeTab === "loinc" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden animate-fade-in h-[600px]">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
              <TestTube className="w-5 h-5 text-indigo-600" />
              {isAr ? `التحاليل الطبية (${LAB_TESTS.length} تحليل)` : `Laboratory Tests (${LAB_TESTS.length} Tests)`}
            </h3>
            <div className="relative w-64">
              <Search className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={isAr ? "بحث..." : "Search..."}
                className={`w-full ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none`}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <table className="w-full text-left text-sm" dir={isAr ? "rtl" : "ltr"}>
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3">{isAr ? "الكود" : "Code"}</th>
                  <th className="px-4 py-3">{isAr ? "الاسم" : "Name"}</th>
                  <th className="px-4 py-3">{isAr ? "القسم" : "Category"}</th>
                  <th className="px-4 py-3">{isAr ? "الوقت" : "TAT"}</th>
                  <th className="px-4 py-3 text-right">{isAr ? "السعر" : "Price"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {LAB_TESTS.filter(i => i.nameAr?.includes(searchQuery) || i.nameEn?.toLowerCase()?.includes(searchQuery?.toLowerCase()) || i.code?.toLowerCase()?.includes(searchQuery?.toLowerCase())).slice(0, 100).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-500">{item.code}</td>
                    <td className="px-4 py-3 text-slate-800 font-bold">{isAr ? item.nameAr : item.nameEn}</td>
                    <td className="px-4 py-3 text-slate-600">{item.category}</td>
                    <td className="px-4 py-3 font-mono text-xs">{item.turnaroundTime}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-indigo-600">{item.price} SR</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 text-center text-slate-500 text-xs">Showing top 100 results...</div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
            <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-black text-lg text-slate-800">
                {isAr ? "إضافة عنصر جديد" : "Add New Item"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{isAr ? "الكود (اختياري)" : "Code (Optional)"}</label>
                <input 
                  type="text" 
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. EG"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{isAr ? "الاسم بالعربية *" : "Arabic Name *"}</label>
                <input 
                  type="text" 
                  value={formData.ar}
                  onChange={e => setFormData({...formData, ar: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="مصري"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{isAr ? "الاسم بالإنجليزية *" : "English Name *"}</label>
                <input 
                  type="text" 
                  value={formData.en}
                  onChange={e => setFormData({...formData, en: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Egyptian"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200 bg-slate-50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition-colors"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm transition-colors"
              >
                {isAr ? "حفظ" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
