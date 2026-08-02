import React, { useState } from "react";
import { Users, Activity, MapPin, Clock, ArrowRightLeft, User, Stethoscope, Bed, FileText, CheckCircle2, ChevronRight, Search, Filter, AlertCircle, Syringe, ClipboardList } from "lucide-react";

interface Props {
  language: "ar" | "en";
  forceDepartmentId?: string;
}

export default function PatientTrackingKardex({ language, forceDepartmentId }: Props) {
  const isAr = language === "ar";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const patients = [
    {
      id: "MRN-928173",
      name: isAr ? "أحمد محمد محمود" : "Ahmed Mohammed Mahmoud",
      age: 45,
      gender: isAr ? "ذكر" : "Male",
      currentLocation: isAr ? "جناح الباطنة - سرير 12" : "Internal Medicine - Bed 12",
      status: "Inpatient",
      statusColor: "bg-blue-100 text-blue-700",
      admissionDate: "2026-07-01 08:30",
      diagnosis: isAr ? "التهاب رئوي حاد" : "Acute Pneumonia",
      physician: isAr ? "د. خالد عبدالله" : "Dr. Khaled Abdallah",
      events: [
        { id: 1, type: "admission", title: isAr ? "دخول المستشفى" : "Admission", dept: isAr ? "الاستقبال والطوارئ" : "ER", time: "2026-07-01 08:30", by: "Reception Desk", icon: ArrowRightLeft, color: "text-emerald-500", bg: "bg-emerald-100" },
        { id: 2, type: "triage", title: isAr ? "الفرز والتقييم" : "Triage Assessment", dept: isAr ? "الطوارئ" : "ER", time: "2026-07-01 08:45", by: "Nurse Sarah", icon: Activity, color: "text-amber-500", bg: "bg-amber-100" },
        { id: 3, type: "lab", title: isAr ? "سحب عينات دم" : "Blood Samples Drawn", dept: isAr ? "المعمل" : "Laboratory", time: "2026-07-01 09:15", by: "Phlebotomist Ali", icon: Syringe, color: "text-rose-500", bg: "bg-rose-100" },
        { id: 4, type: "rad", title: isAr ? "أشعة سينية على الصدر" : "Chest X-Ray", dept: isAr ? "الأشعة" : "Radiology", time: "2026-07-01 09:45", by: "Tech Youssef", icon: Activity, color: "text-purple-500", bg: "bg-purple-100" },
        { id: 5, type: "consult", title: isAr ? "استشارة باطنة" : "Internal Med Consult", dept: isAr ? "الطوارئ" : "ER", time: "2026-07-01 10:30", by: "Dr. Khaled", icon: Stethoscope, color: "text-indigo-500", bg: "bg-indigo-100" },
        { id: 6, type: "transfer", title: isAr ? "نقل إلى قسم التنويم" : "Transfer to Inpatient", dept: isAr ? "الباطنة" : "Internal Medicine", time: "2026-07-01 11:00", by: "Admin System", icon: Bed, color: "text-blue-500", bg: "bg-blue-100" },
        { id: 7, type: "meds", title: isAr ? "صرف علاج (مضاد حيوي)" : "Medication Administered (Antibiotic)", dept: isAr ? "الباطنة" : "Internal Medicine", time: "2026-07-01 12:00", by: "Nurse Rania", icon: ClipboardList, color: "text-teal-500", bg: "bg-teal-100" },
      ]
    },
    {
      id: "MRN-837462",
      name: isAr ? "سارة أحمد علي" : "Sarah Ahmed Ali",
      age: 28,
      gender: isAr ? "أنثى" : "Female",
      currentLocation: isAr ? "العمليات - غرفة 3" : "OR - Room 3",
      status: "In Surgery",
      statusColor: "bg-rose-100 text-rose-700",
      admissionDate: "2026-07-02 07:00",
      diagnosis: isAr ? "استئصال الزائدة الدودية" : "Appendectomy",
      physician: isAr ? "د. طارق محمود" : "Dr. Tarek Mahmoud",
      events: [
        { id: 1, type: "admission", title: isAr ? "دخول المستشفى" : "Admission", dept: isAr ? "الاستقبال" : "Reception", time: "2026-07-02 07:00", by: "System", icon: ArrowRightLeft, color: "text-emerald-500", bg: "bg-emerald-100" },
        { id: 2, type: "prep", title: isAr ? "تجهيز للعمليات" : "Pre-op Prep", dept: isAr ? "الرعاية النهارية" : "Day Care", time: "2026-07-02 08:00", by: "Nurse Huda", icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-100" },
        { id: 3, type: "transfer", title: isAr ? "نقل إلى العمليات" : "Transfer to OR", dept: isAr ? "العمليات" : "Operating Theater", time: "2026-07-02 09:30", by: "Transport", icon: ArrowRightLeft, color: "text-rose-500", bg: "bg-rose-100" },
      ]
    },
    {
      id: "MRN-192837",
      name: isAr ? "عمر حسن إبراهيم" : "Omar Hassan Ibrahim",
      age: 62,
      gender: isAr ? "ذكر" : "Male",
      currentLocation: isAr ? "الرعاية المركزة - سرير 4" : "ICU - Bed 4",
      status: "Critical",
      statusColor: "bg-amber-100 text-amber-700",
      admissionDate: "2026-06-30 22:15",
      diagnosis: isAr ? "احتشاء عضلة القلب" : "Myocardial Infarction",
      physician: isAr ? "د. رامي سعيد" : "Dr. Ramy Saeed",
      events: [
        { id: 1, type: "admission", title: isAr ? "دخول طوارئ" : "ER Admission", dept: isAr ? "الطوارئ" : "ER", time: "2026-06-30 22:15", by: "System", icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-100" },
        { id: 2, type: "cath", title: isAr ? "قسطرة قلبية طارئة" : "Emergency Cath", dept: isAr ? "القسطرة" : "Cath Lab", time: "2026-06-30 22:45", by: "Dr. Ramy", icon: Activity, color: "text-purple-500", bg: "bg-purple-100" },
        { id: 3, type: "transfer", title: isAr ? "نقل للرعاية المركزة" : "Transfer to ICU", dept: isAr ? "الرعاية المركزة" : "ICU", time: "2026-07-01 01:30", by: "System", icon: Bed, color: "text-amber-500", bg: "bg-amber-100" },
        { id: 4, type: "obs", title: isAr ? "متابعة علامات حيوية" : "Vitals Monitored", dept: isAr ? "الرعاية المركزة" : "ICU", time: "2026-07-02 08:00", by: "ICU System", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-100" },
      ]
    }
  ];

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const filteredPatients = patients.filter(p => 
    p.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) || 
    p.id?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const handleOpenChart = (tab: string = "summary") => {
    if (selectedPatient) {
      window.dispatchEvent(new CustomEvent("openPatientChart", { 
        detail: { 
          patientId: selectedPatient.id, 
          patientName: selectedPatient.name,
          initialTab: tab
        } 
      }));
    }
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
            <ArrowRightLeft className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              {isAr ? "تتبع حركة المرضى (Patient Journey)" : "Patient Journey Tracking"}
            </h2>
            <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">
              {isAr ? "متابعة مسار المريض، الانتقالات، والأحداث السريرية" : "Monitor patient flow, transfers, and clinical events"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Patients List Sidebar */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" />
              {isAr ? "قائمة المرضى النشطين" : "Active Patients"}
            </h3>
            <div className="relative">
              <Search className={`absolute ${isAr ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
              <input 
                type="text"
                placeholder={isAr ? "بحث بالاسم أو رقم الملف..." : "Search by Name or MRN..."}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`w-full py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold ${isAr ? "pr-10 pl-4" : "pl-10 pr-4"} focus:ring-2 focus:ring-indigo-500 outline-none`}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredPatients.map(patient => (
              <button 
                key={patient.id}
                onClick={() => setSelectedPatientId(patient.id)}
                className={`w-full text-left p-4 rounded-2xl transition-all border ${selectedPatientId === patient.id ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-black text-indigo-600 bg-indigo-100/50 px-2 py-1 rounded-md uppercase tracking-widest">{patient.id}</span>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${patient.statusColor}`}>{patient.status}</span>
                </div>
                <h4 className="font-bold text-slate-900 mb-1">{patient.name}</h4>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate">{patient.currentLocation}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Patient Journey Detail */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[700px] animate-fade-in">
              {/* Patient Header */}
              <div className="p-8 border-b border-slate-100 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:gap-5 flex-wrap ">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-md shrink-0">
                      <User className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div>
                      <h2 
                        className="text-lg sm:text-2xl font-black tracking-tight mb-1 cursor-pointer hover:text-indigo-300 transition" 
                        onClick={() => handleOpenChart("summary")}
                      >
                        {selectedPatient.name}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm font-medium text-slate-300">
                        <span 
                          className="text-white font-bold cursor-pointer hover:underline hover:text-indigo-300"
                          onClick={() => handleOpenChart("summary")}
                        >
                          {selectedPatient.id}
                        </span>
                        <span>•</span>
                        <span>{selectedPatient.age} {isAr ? "سنة" : "Years"}</span>
                        <span>•</span>
                        <span>{selectedPatient.gender}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-2">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest ${selectedPatient.statusColor} border border-white/10 shadow-sm`}>
                      {selectedPatient.status}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 bg-white/5 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedPatient.currentLocation}
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-8 grid grid-cols-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{isAr ? "تاريخ الدخول" : "Admission Date"}</p>
                    <p className="text-sm font-bold text-white">{selectedPatient.admissionDate}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{isAr ? "التشخيص المبدئي" : "Primary Diagnosis"}</p>
                    <p className="text-sm font-bold text-white">{selectedPatient.diagnosis}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md sm:col-span-1 col-span-2">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{isAr ? "الطبيب المعالج" : "Attending Physician"}</p>
                    <p className="text-sm font-bold text-white">{selectedPatient.physician}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="p-8 flex-1 overflow-y-auto bg-slate-50/50">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-500" />
                  {isAr ? "الجدول الزمني للرحلة العلاجية" : "Clinical Journey Timeline"}
                </h3>

                <div className="relative pl-4 sm:pl-8 space-y-8 before:absolute before:inset-0 before:ml-[1.35rem] sm:before:ml-[2.35rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {selectedPatient.events.map((event, index) => (
                    <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white ${event.bg} ${event.color} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10 mx-[-1.35rem] sm:mx-[-2.35rem] md:mx-auto`}>
                        <event.icon className="w-4 h-4" />
                      </div>
                      
                      <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${event.color}`}>{event.dept}</span>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {event.time.split(' ')[1]}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mb-2 cursor-pointer hover:text-indigo-600 transition" onClick={() => handleOpenChart("timeline")}>{event.title}</h4>
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                              <User className="w-3 h-3 text-slate-500" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-500">{event.by}</span>
                          </div>
                          {event.type === 'transfer' && (
                             <button onClick={() => handleOpenChart("timeline")} className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1 uppercase tracking-widest transition-colors">
                                {isAr ? "تفاصيل" : "Details"} <ChevronRight className={`w-3 h-3 ${isAr ? "rotate-180" : ""}`} />
                             </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm h-[700px] flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">
                {isAr ? "لم يتم تحديد مريض" : "No Patient Selected"}
              </h3>
              <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto">
                {isAr 
                  ? "قم باختيار مريض من القائمة لعرض تفاصيل الرحلة العلاجية وتاريخ الانتقالات." 
                  : "Select a patient from the list to view their clinical journey, events, and transfer history."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

