const fs = require('fs');

const createStaffDirectory = () => `import React, { useState } from "react";
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
              <div className={\`absolute top-0 right-0 w-2 h-full \${emp.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}\`} />
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
}`;

const createAttendanceHub = () => `import React from "react";
import { Clock, Calendar, CheckCircle2, AlertCircle, RefreshCcw } from "lucide-react";
import { motion } from "motion/react";

export default function AttendanceHub({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";
  
  return (
    <div className="h-full flex flex-col p-6 sm:p-8 overflow-hidden bg-slate-50" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{isAr ? "مركز الحضور والانصراف" : "Attendance Hub"}</h2>
          <p className="text-sm font-bold text-slate-500 mt-1">{isAr ? "مراقبة البصمة والمناوبات اليومية" : "Monitor daily check-ins and shifts"}</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
          <RefreshCcw className="w-4 h-4" />
          {isAr ? "مزامنة البصمة" : "Sync Biometrics"}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
         <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex flex-col justify-center">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{isAr ? "حضور اليوم" : "Present Today"}</h4>
            <div className="text-4xl font-black text-emerald-600">312</div>
         </div>
         <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex flex-col justify-center">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{isAr ? "غياب" : "Absent"}</h4>
            <div className="text-4xl font-black text-rose-600">14</div>
         </div>
         <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex flex-col justify-center">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{isAr ? "تأخير" : "Late"}</h4>
            <div className="text-4xl font-black text-amber-500">22</div>
         </div>
         <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex flex-col justify-center">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{isAr ? "إجازات نشطة" : "On Leave"}</h4>
            <div className="text-4xl font-black text-indigo-600">45</div>
         </div>
      </div>

      <div className="flex-1 overflow-auto bg-white border border-slate-200 rounded-[24px] shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "الموظف" : "Employee"}</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "المناوبة" : "Shift"}</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "حضور" : "Check-in"}</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "انصراف" : "Check-out"}</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "الحالة" : "Status"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-bold text-slate-800">Sarah Khaled</td>
              <td className="p-4 text-sm font-medium text-slate-600">Morning (08:00 - 16:00)</td>
              <td className="p-4 font-black text-emerald-600">07:55 AM</td>
              <td className="p-4 font-black text-slate-400">--:--</td>
              <td className="p-4"><span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-xs font-bold uppercase">Present</span></td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-bold text-slate-800">Ahmed Sami</td>
              <td className="p-4 text-sm font-medium text-slate-600">Morning (08:00 - 16:00)</td>
              <td className="p-4 font-black text-amber-600">08:25 AM</td>
              <td className="p-4 font-black text-slate-400">--:--</td>
              <td className="p-4"><span className="bg-amber-50 text-amber-600 px-2 py-1 rounded text-xs font-bold uppercase">Late</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}`;

const createPayrollEngine = () => `import React from "react";
import { DollarSign, Download, Filter, FileText, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function PayrollEngine({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";
  
  return (
    <div className="h-full flex flex-col p-6 sm:p-8 overflow-hidden bg-slate-50" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{isAr ? "محرك الرواتب" : "Payroll Engine"}</h2>
          <p className="text-sm font-bold text-slate-500 mt-1">{isAr ? "إدارة مسيرات الرواتب والمكافآت والخصومات" : "Manage payrolls, bonuses, and deductions"}</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm">
          <FileText className="w-4 h-4" />
          {isAr ? "إنشاء مسير جديد" : "Generate Payroll"}
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-white border border-slate-200 rounded-[24px] shadow-sm p-2">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "الفترة" : "Period"}</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "إجمالي الرواتب" : "Total Amount"}</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "عدد الموظفين" : "Employees"}</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "الحالة" : "Status"}</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">{isAr ? "إجراء" : "Action"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-black text-slate-800">July 2026</td>
              <td className="p-4 font-black text-slate-700">$1,245,000</td>
              <td className="p-4 text-sm font-bold text-slate-600">342</td>
              <td className="p-4"><span className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest">Draft</span></td>
              <td className="p-4 text-right">
                <button className="text-indigo-600 font-bold text-xs uppercase underline hover:text-indigo-800">{isAr ? "مراجعة واعتماد" : "Review & Approve"}</button>
              </td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-black text-slate-800">June 2026</td>
              <td className="p-4 font-black text-slate-700">$1,210,500</td>
              <td className="p-4 text-sm font-bold text-slate-600">338</td>
              <td className="p-4"><span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest">Paid</span></td>
              <td className="p-4 text-right">
                <button className="text-slate-600 font-bold text-xs uppercase underline hover:text-slate-800">{isAr ? "تحميل التقرير" : "Download Report"}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}`;

const createArchiveSearch = () => `import React from "react";
import { FileSearch, Download, Search } from "lucide-react";
import { motion } from "motion/react";

export default function ArchiveSearch({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";
  
  return (
    <div className="h-full flex flex-col p-6 sm:p-8 overflow-hidden bg-slate-50" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{isAr ? "بحث الأرشيف والمستندات" : "Document Archive Search"}</h2>
          <p className="text-sm font-bold text-slate-500 mt-1">{isAr ? "الوصول لعقود ووثائق الموظفين" : "Access employee contracts and documents"}</p>
        </div>
      </div>
      
      <div className="relative mb-8">
        <Search className="w-6 h-6 absolute top-1/2 -translate-y-1/2 left-5 text-indigo-400" />
        <input 
          type="text" 
          placeholder={isAr ? "ابحث برقم الهوية، اسم الموظف، أو رقم المستند..." : "Search by ID, name, or doc number..."}
          className="w-full pl-14 pr-6 py-5 bg-white border-2 border-indigo-100 rounded-[24px] font-black text-lg outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white border border-slate-200 rounded-[32px] shadow-sm">
        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
          <FileSearch className="w-12 h-12 text-indigo-300" />
        </div>
        <h3 className="text-xl font-black text-slate-700 mb-2">{isAr ? "أرشيف مركزي آمن" : "Secure Central Archive"}</h3>
        <p className="text-sm font-bold text-slate-400 max-w-sm">{isAr ? "استخدم شريط البحث أعلاه للوصول السريع لأي مستند يخص الكادر الوظيفي." : "Use the search bar above to quickly access any staff-related document."}</p>
      </div>
    </div>
  );
}`;

fs.writeFileSync('src/components/hr/StaffDirectory.tsx', createStaffDirectory(), 'utf8');
fs.writeFileSync('src/components/hr/AttendanceHub.tsx', createAttendanceHub(), 'utf8');
fs.writeFileSync('src/components/hr/PayrollEngine.tsx', createPayrollEngine(), 'utf8');
fs.writeFileSync('src/components/hr/ArchiveSearch.tsx', createArchiveSearch(), 'utf8');

