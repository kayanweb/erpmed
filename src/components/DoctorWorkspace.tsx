import React, { useState } from 'react';
import { 
  Stethoscope, Users, Activity, FileText, ClipboardList, 
  Calendar, CheckCircle2, AlertTriangle, Pill, FilePlus2,
  Syringe, TestTube, Monitor, Clock, MoreVertical
} from 'lucide-react';

interface Props {
  language: 'ar' | 'en';
}

const patients = [
  { room: "ICU-01", name: "Ahmed Mahmoud", id: "MRN-3301", status: "critical", time: "08:00 AM" },
  { room: "W-204", name: "Sarah Smith", id: "MRN-1120", status: "stable", time: "10:30 AM" },
  { room: "W-205", name: "Omar Hassan", id: "MRN-8842", status: "warning", time: "11:15 AM" },
];

const tasks = [
  { id: 1, text: "Review Morning Labs", patient: "Ahmed Mahmoud", type: "lab", urgent: true },
  { id: 2, text: "Update Antibiotic Orders", patient: "Sarah Smith", type: "med", urgent: false },
  { id: 3, text: "Discharge Summary", patient: "Fatima Ali", type: "doc", urgent: false },
];

export const DoctorWorkspace: React.FC<Props> = ({ language }) => {
  const isAr = language === 'ar';
  
  return (
    <div className={`p-6 w-full space-y-6 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{isAr ? "د. محمد علي" : "Dr. Mohamed Ali"}</h1>
            <p className="text-sm text-slate-500">{isAr ? "استشاري الباطنة" : "Internal Medicine Consultant"}</p>
          </div>
        </div>
        <div className="flex gap-2 min-w-max">
          <button className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {isAr ? "جدول اليوم" : "Today's Schedule"}
          </button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <FilePlus2 className="w-4 h-4" />
            {isAr ? "أمر طبي جديد" : "New Order"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Patients List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                {isAr ? "قائمة الجولة الصباحية" : "Morning Round List"}
              </h3>
              <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md text-xs font-bold">12 {isAr ? "مريض" : "Patients"}</span>
            </div>
            
            <div className="space-y-3">
              {patients.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow bg-slate-50/50">
                  <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                    <div className={`w-2 h-12 rounded-full ${
                      p.status === 'critical' ? 'bg-red-500' : p.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{p.name}</span>
                        <span className="text-xs bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-500">{p.room}</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1 font-mono">{p.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => window.dispatchEvent(new CustomEvent("openPatientChart", { detail: { patientId: p.id, patientName: p.name, initialTab: "emr" } }))}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
                      title={isAr ? "الملف الطبي" : "Medical Record"}
                    >
                      <ClipboardList className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => window.dispatchEvent(new CustomEvent("openPatientChart", { detail: { patientId: p.id, patientName: p.name, initialTab: "vitals" } }))}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
                      title={isAr ? "العلامات الحيوية" : "Vitals"}
                    >
                      <Activity className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => window.dispatchEvent(new CustomEvent("openPatientChart", { detail: { patientId: p.id, patientName: p.name, initialTab: "summary" } }))}
                      className="px-3 py-1.5 bg-indigo-600 text-white shadow-sm rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors"
                    >
                      {isAr ? "فتح الملف" : "Open"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
              <h4 className="font-medium opacity-90 mb-1">{isAr ? "الاستشارات المعلقة" : "Pending Consults"}</h4>
              <p className="text-3xl font-black">4</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
              <h4 className="font-medium opacity-90 mb-1">{isAr ? "نتائج المختبر الجديدة" : "New Lab Results"}</h4>
              <p className="text-3xl font-black">18</p>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-500" />
              {isAr ? "المهام والإشعارات" : "Tasks & Notifications"}
            </h3>
            
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      task.urgent ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {task.type.toUpperCase()}
                    </span>
                    <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                  <p className="font-medium text-slate-800 text-sm mb-1">{task.text}</p>
                  <p className="text-xs text-slate-500">{task.patient}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-2xl shadow-xl p-5 text-white">
            <h3 className="font-bold text-slate-100 mb-4">{isAr ? "وصول سريع" : "Quick Access"}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button className="flex flex-col items-center justify-center p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
                <Pill className="w-5 h-5 text-indigo-400 mb-2" />
                <span className="text-xs">{isAr ? "الوصفات" : "Prescriptions"}</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
                <TestTube className="w-5 h-5 text-emerald-400 mb-2" />
                <span className="text-xs">{isAr ? "المختبر" : "Labs"}</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
                <Monitor className="w-5 h-5 text-cyan-400 mb-2" />
                <span className="text-xs">{isAr ? "الأشعة" : "Radiology"}</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
                <FileText className="w-5 h-5 text-amber-400 mb-2" />
                <span className="text-xs">{isAr ? "التقارير" : "Reports"}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DoctorWorkspace;
