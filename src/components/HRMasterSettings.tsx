import React, { useState } from 'react';
import { useHIS } from '../context/HISContext';
import { 
  Briefcase, GraduationCap, Award, ShieldCheck, 
  Search, Plus, Trash2, Edit3, Filter,
  Stethoscope, FileText, BadgeCheck, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import DynamicSelector from './DynamicSelector';

type HRSettingCategory = 'job_title' | 'grade' | 'employment_type' | 'specialty' | 'sub_specialty' | 'medical_license';

export default function HRMasterSettings({ language, onClose }: { language: 'ar' | 'en', onClose?: () => void }) {
  const isAr = language === 'ar';
  const { masterData, addMasterData, updateMasterDataStatus, deleteMasterData } = useHIS();
  const [activeCategory, setActiveCategory] = useState<HRSettingCategory>('job_title');
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { id: 'job_title', icon: Briefcase, en: "Job Titles", ar: "المسميات الوظيفية", color: "indigo" },
    { id: 'grade', icon: Award, en: "Grades & Ranks", ar: "الدرجات والرتـب", color: "amber" },
    { id: 'employment_type', icon: FileText, en: "Contract Types", ar: "أنواع التعاقد", color: "emerald" },
    { id: 'specialty', icon: Stethoscope, en: "Medical Specialties", ar: "التخصصات الطبية", color: "rose" },
    { id: 'medical_license', icon: BadgeCheck, en: "License Types", ar: "أنواع التراخيص", color: "blue" }
  ];

  const filteredData = masterData.filter(m => 
    m.category === activeCategory &&
    (m.valueEn.toLowerCase().includes(searchTerm.toLowerCase()) || m.valueAr.includes(searchTerm))
  );

  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Category Navigation */}
      <div className="flex overflow-x-auto gap-4 pb-2 custom-scrollbar items-center justify-between">
        <div className="flex gap-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all whitespace-nowrap ${
                activeCategory === cat.id 
                  ? `border-${cat.color}-200 bg-${cat.color}-50 text-${cat.color}-700 shadow-lg shadow-slate-100` 
                  : 'border-white bg-white text-slate-500 hover:border-slate-100'
              }`}
            >
              <div className={`p-2 rounded-xl bg-white shadow-sm border border-slate-100`}>
                 <cat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">{isAr ? cat.ar : cat.en}</span>
            </button>
          ))}
        </div>
        <button 
          onClick={onClose}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm group shrink-0"
        >
           <Plus className="w-6 h-6 rotate-45 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm flex flex-col md:flex-row min-h-[600px]">
         {/* Left Side: Toolbar & List */}
         <div className="w-full md:w-2/3 border-l border-slate-100 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <div className="relative flex-1 max-w-md">
                  <Search className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder={isAr ? "بحث..." : "Search entries..."} 
                    className="w-full h-11 ltr:pl-12 rtl:pr-12 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               <button className="h-11 px-6 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] transition shadow-lg shadow-indigo-100">
                  <Plus className="w-4 h-4" />
                  {isAr ? "إضافة جديد" : "Add New"}
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
               <div className="grid grid-cols-1 gap-3">
                  {filteredData.length > 0 ? (
                    filteredData.map(item => (
                      <div key={item.id} className="p-5 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 transition-all flex items-center justify-between group">
                         <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-xs font-black text-indigo-600 border border-slate-100">
                               {item.valueEn.charAt(0)}
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-800">{isAr ? item.valueAr : item.valueEn}</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{isAr ? item.valueEn : item.valueAr}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                               <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteMasterData(item.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition">
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center">
                       <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search className="w-5 h-5 sm:w-8 sm:h-8 text-slate-200" />
                       </div>
                       <p className="text-slate-400 font-bold">{isAr ? "لا توجد نتائج" : "No results found"}</p>
                    </div>
                  )}
               </div>
            </div>
         </div>

         {/* Right Side: Helper / Bulk Actions */}
         <div className="flex-1 bg-slate-50/50 p-8 space-y-8">
            <div className="space-y-4">
               <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  {isAr ? "نظام حوكمة الموارد البشرية" : "HR Governance System"}
               </h4>
               <p className="text-xs text-slate-500 leading-relaxed font-medium italic">
                  {isAr 
                    ? "* إدارة كافة القوائم المنسدلة المتعلقة بالموظفين والتراخيص الطبية من مكان واحد."
                    : "* Manage all dropdown lists related to staff and medical licenses from a single point of truth."
                  }
               </p>
            </div>

            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-4">
               <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{isAr ? "إحصائيات سريعة" : "Quick Stats"}</h5>
               <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-indigo-50/30 rounded-xl">
                     <span className="text-[10px] font-bold text-slate-500">{isAr ? "إجمالي القيم" : "Total Entries"}</span>
                     <span className="text-sm font-black text-indigo-600">{filteredData.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-emerald-50/30 rounded-xl">
                     <span className="text-[10px] font-bold text-slate-500">{isAr ? "القيم المعتمدة" : "Approved"}</span>
                     <span className="text-sm font-black text-emerald-600">{filteredData.filter(m => m.status === 'approved').length}</span>
                  </div>
               </div>
            </div>

            <div className="bg-indigo-900 rounded-[24px] p-6 text-white space-y-4 relative overflow-hidden">
               <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-2">{isAr ? "تلميحة ذكية" : "Smart Tip"}</p>
                  <p className="text-xs leading-relaxed font-medium">
                     {isAr 
                       ? "يمكنك استيراد قيم المسميات الوظيفية من ملف Excel لسرعة التهيئة الأولية للنظام."
                       : "You can import job title values from an Excel file for rapid initial system configuration."
                     }
                  </p>
                  <button className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition">
                     <Zap className="w-3.5 h-3.5" />
                     {isAr ? "استيراد سريع" : "Fast Import"}
                  </button>
               </div>
               <Briefcase className="absolute -bottom-4 -right-4 w-24 h-24 text-white opacity-5 rotate-12" />
            </div>
         </div>
      </div>
    </div>
  );
}
