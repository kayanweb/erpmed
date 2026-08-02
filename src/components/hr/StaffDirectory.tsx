import React, { useState } from "react";
import { Users, Search, Filter, Mail, Phone, MapPin, Building2, ChevronRight, UserPlus } from "lucide-react";
import { motion } from "motion/react";

export default function StaffDirectory({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";
  const [search, setSearch] = useState("");
  
  const staff = [
    { id: "EMP-001", nameAr: "د. أحمد سامي", nameEn: "Dr. Ahmed Sami", role: "Chief of Surgery", dept: "Surgery", phone: "+966 50 123 4567", email: "ahmed.s@hospital.com", status: "Active" },
    { id: "EMP-002", nameAr: "سارة خالد", nameEn: "Sarah Khaled", role: "Head Nurse", dept: "ICU", phone: "+966 50 987 6543", email: "sarah.k@hospital.com", status: "On Leave" },
    { id: "EMP-003", nameAr: "محمد علي", nameEn: "Mohamed Ali", role: "IT Specialist", dept: "IT Support", phone: "+966 55 555 5555", email: "mohamed.a@hospital.com", status: "Active" },
  ];

  return (
    <div className="h-full flex flex-col p-6 sm:p-8 overflow-hidden bg-slate-50" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{isAr ? "دليل الموظفين" : "Staff Directory"}</h2>
          <p className="text-sm font-bold text-slate-500 mt-1">{isAr ? "إدارة وتتبع بيانات الكادر الوظيفي" : "Manage and track staff profiles"}</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
          <UserPlus className="w-4 h-4" />
          {isAr ? "إضافة موظف" : "Add Employee"}
        </button>
      </div>
      
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute top-1/2 -translate-y-1/2 left-4 text-slate-400" />
          <input 
            type="text" 
            placeholder={isAr ? "البحث بالاسم أو القسم..." : "Search by name or department..."}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button className="bg-white border border-slate-200 text-slate-700 px-4 rounded-xl flex items-center justify-center hover:bg-slate-50">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
          {staff.map((emp, i) => (
            <motion.div key={emp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-2 h-full ${emp.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl border border-indigo-100">
                  {(isAr ? emp.nameAr : emp.nameEn).charAt(0)}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">{isAr ? emp.nameAr : emp.nameEn}</h3>
                  <p className="text-sm font-bold text-indigo-600">{emp.role}</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                  <Building2 className="w-4 h-4 text-slate-400" /> {emp.dept}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                  <Phone className="w-4 h-4 text-slate-400" /> {emp.phone}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                  <Mail className="w-4 h-4 text-slate-400" /> {emp.email}
                </div>
              </div>
              <button className="w-full py-2.5 bg-slate-50 hover:bg-indigo-50 text-indigo-600 font-bold text-sm rounded-xl transition-colors border border-slate-100">
                {isAr ? "عرض الملف" : "View Profile"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}