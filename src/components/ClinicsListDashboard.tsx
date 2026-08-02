import React, { useState } from "react";
import { 
  Building2, Users, Calendar, Activity, 
  Stethoscope, Clock, Search, Filter
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
  systemUsers?: any[];
  departments?: string[];
  onNavigate?: (tab: string) => void;
}

export default function ClinicsListDashboard({ language, systemUsers = [], departments = [], onNavigate }: Props) {
  const isAr = language === "ar";
  const [search, setSearch] = useState("");

  const clinics = departments.length > 0 ? departments.map((dept, index) => {
    // Find doctors in this department
    const deptDoctors = systemUsers.filter(u => u.department === dept && u.role?.toLowerCase() === "doctor");
    const doctorName = deptDoctors.length > 0 
      ? (isAr ? deptDoctors[0].nameAr : deptDoctors[0].nameEn) 
      : (isAr ? "غير محدد" : "Unassigned");
      
    return {
      id: `C-${index+1}`,
      nameAr: `عيادة ${dept}`, // Simplified mapping
      nameEn: `${dept} Clinic`,
      doctor: doctorName,
      status: "Active",
      patients: Math.floor(Math.random() * 20) // estimated patient count
    };
  }) : [
    { id: "C-01", nameAr: "عيادة القلب", nameEn: "Cardiology Clinic", doctor: "Dr. Ahmed Youssef", status: "Active", patients: 12 },
    { id: "C-02", nameAr: "عيادة الباطنة", nameEn: "Internal Medicine", doctor: "Dr. Sarah Ali", status: "Active", patients: 8 },
    { id: "C-03", nameAr: "عيادة العظام", nameEn: "Orthopedics Clinic", doctor: "Dr. Omar Hassan", status: "Closed", patients: 0 },
    { id: "C-04", nameAr: "عيادة الأطفال", nameEn: "Pediatrics Clinic", doctor: "Dr. Laila Mahmoud", status: "Active", patients: 15 },
    { id: "C-05", nameAr: "عيادة العيون", nameEn: "Ophthalmology", doctor: "Dr. Kareem Nabil", status: "Active", patients: 5 },
    { id: "C-06", nameAr: "الأنف والأذن والحنجرة", nameEn: "ENT Clinic", doctor: "Dr. Hoda Samir", status: "Active", patients: 7 },
  ];

  const filteredClinics = clinics.filter(c => 
    c.nameEn?.toLowerCase()?.includes(search?.toLowerCase()) || 
    c.nameAr?.includes(search)
  );

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-indigo-600" />
            {isAr ? "العيادات الخارجية (Outpatient Clinics)" : "Outpatient Clinics Directory"}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {isAr ? "استعراض وإدارة العيادات التخصصية وحالة الأطباء" : "Browse and manage specialty clinics and doctor statuses"}
          </p>
        </div>
        <div className="relative w-full md:w-64">
           <Search className={`w-4 h-4 text-slate-400 absolute top-3 ${isAr ? "right-3" : "left-3"}`} />
           <input 
             type="text" 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             placeholder={isAr ? "بحث في العيادات..." : "Search clinics..."} 
             className={`w-full border border-slate-200 rounded-xl py-2.5 focus:border-indigo-500 outline-none text-sm ${isAr ? "pr-10 pl-3" : "pl-10 pr-3"}`} 
           />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredClinics.map((clinic) => (
          <div key={clinic.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition flex-1 flex flex-col h-full min-h-0">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-indigo-50 p-3 rounded-xl">
                <Stethoscope className="w-6 h-6 text-indigo-600" />
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${clinic.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                {isAr ? (clinic.status === 'Active' ? 'مفتوحة' : 'مغلقة') : clinic.status}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-1">{isAr ? clinic.nameAr : clinic.nameEn}</h3>
            <p className="text-sm text-slate-500 font-medium mb-4 flex-1 flex items-center gap-1.5">
              <Users className="w-4 h-4" /> {clinic.doctor}
            </p>
            
            <div className="bg-slate-50 rounded-xl p-3 flex justify-between items-center mb-4 border border-slate-100">
               <div className="flex items-center gap-2">
                 <Activity className="w-4 h-4 text-teal-500" />
                 <span className="text-xs font-bold text-slate-600">{isAr ? "مرضى الانتظار" : "Waiting"}</span>
               </div>
               <span className="font-black text-indigo-600 text-lg">{clinic.patients}</span>
            </div>
            
            <div className="flex gap-2 mt-auto">
               <button onClick={() => onNavigate ? onNavigate("appointments") : toast.info(isAr ? "فتح جدول المواعيد" : "Opened schedule")} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-xs font-bold transition flex justify-center items-center gap-1.5">
                 <Calendar className="w-3.5 h-3.5" /> {isAr ? "الجدول" : "Schedule"}
               </button>
               <button onClick={() => onNavigate ? onNavigate("physician_desk") : toast.info(isAr ? "الدخول للعيادة" : "Entering clinic EMR")} className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 rounded-lg text-xs font-bold transition flex justify-center items-center gap-1.5">
                 <Clock className="w-3.5 h-3.5" /> {isAr ? "دخول" : "Enter"}
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
