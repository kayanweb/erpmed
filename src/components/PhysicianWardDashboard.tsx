import React, { useState, useMemo } from "react";
import { Stethoscope, User, AlertTriangle, FileText, Activity, Users, Building, LayoutList, ClipboardList, CheckCircle2, FlaskConical, AlertCircle, ListTodo } from "lucide-react";
import { PatientChartModal } from "./PatientChartModal";
import { useHIS } from "../context/HISContext";
import { GlobalEntityLink } from "./GlobalEntityLink";
import DepartmentTasks from "./DepartmentTasks";

interface Props {
  language: "ar" | "en";
  forceDepartmentId?: string;
  onOpenPatientChart?: (id: string, name: string, tab?: string) => void;
}

export default function PhysicianWardDashboard({ language, forceDepartmentId, onOpenPatientChart }: Props) {
  const isAr = language === "ar";
  const { patients: contextPatients } = useHIS();
  const [selectedDepartment, setSelectedDepartment] = useState<string>(forceDepartmentId || "dept-im");
  const [localSelectedPatientId, setLocalSelectedPatientId] = useState<string | null>(null);
  const [initialPatientTab, setInitialPatientTab] = useState<string>("summary");
  const [activeTab, setActiveTab] = useState<"patients" | "tasks">("patients");

  const handleOpenChart = (patient: any, tab: string = "summary") => {
    if (onOpenPatientChart) {
      onOpenPatientChart(patient.id, isAr ? patient.nameAr : patient.name, tab);
    } else {
      setLocalSelectedPatientId(patient.id);
      setInitialPatientTab(tab);
    }
  };

  const departments = [
    { id: "dept-er", name: "Emergency Department", nameAr: "قسم الطوارئ" },
    { id: "dept-im", name: "Internal Medicine", nameAr: "الباطنة العامة" },
    { id: "dept-surg", name: "General Surgery", nameAr: "الجراحة العامة" },
    { id: "dept-icu", name: "Intensive Care Unit (ICU)", nameAr: "العناية المركزة" },
  ];

  // Filter patients from context based on selected department
  const currentPatients = useMemo(() => {
    const filtered = contextPatients.filter(p => p.departmentId === selectedDepartment || p.wardId === selectedDepartment);
    
    if (filtered.length > 0) {
      return filtered.map(p => ({
        id: p.id, 
        mrn: p.mrn, 
        name: p.nameEn, 
        nameAr: p.nameAr, 
        room: p.roomNumber || "Ward Room", 
        bed: p.bedNumber || "Bed 1", 
        dx: p.admissionDiagnosis || "Pending Assessment",
        alerts: p.alerts || { labs: 0, vitals: 0, consults: 0, unsigned: 0 }
      }));
    }

    // Return empty array if no patients found for the department
    return [];
  }, [contextPatients, selectedDepartment]);

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 border-l-4 border-l-indigo-500 mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Stethoscope className="h-7 w-7 text-indigo-600" />
            {isAr ? "مساحة عمل الطبيب" : "Physician Workstation"}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {isAr ? "متابعة المرضى وإدارة المهام الطبية" : "Manage patients and clinical tasks"}
          </p>
        </div>
        
        <div className="flex gap-2 min-w-max">
          {!forceDepartmentId && (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
              <Building className="w-5 h-5 text-slate-400" />
              <select 
               className="bg-transparent font-bold text-slate-700 outline-none text-sm cursor-pointer"
               value={selectedDepartment}
               onChange={(e) => setSelectedDepartment(e.target.value)}
             >
               {departments.map(d => (
                 <option key={d.id} value={d.id}>{isAr ? d.nameAr : d.name}</option>
               ))}
             </select>
           </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-6" dir={isAr ? "rtl" : "ltr"}>
        <button
          onClick={() => setActiveTab("patients")}
          className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition ${
            activeTab === "patients" ? "bg-indigo-600 text-white" : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          <Users className="w-4 h-4" /> {isAr ? "قائمة المرضى" : "Patient List"}
        </button>
        <button
          onClick={() => setActiveTab("tasks")}
          className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition ${
            activeTab === "tasks" ? "bg-indigo-600 text-white" : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          <ListTodo className="w-4 h-4" /> {isAr ? "المهام الطبية" : "Physician Tasks"}
        </button>
      </div>

      {activeTab === "tasks" ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <DepartmentTasks language={language} departmentId={selectedDepartment} departmentName={isAr ? "قسم التنويم" : "Inpatient Department"} />
        </div>
      ) : (
        <div className="space-y-6">
          {currentPatients.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-bold">{isAr ? "لا يوجد مرضى منومين في هذا القسم حالياً" : "No admitted patients in this department"}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPatients.map((patient: any) => {
                const hasAlerts = patient.alerts.labs > 0 || patient.alerts.vitals > 0 || patient.alerts.consults > 0 || patient.alerts.unsigned > 0;
                
                return (
                  <div 
                    key={patient.id} 
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition relative group"
                  >
                    <div className="flex justify-between items-start mb-4 cursor-pointer" onClick={() => handleOpenChart(patient, "summary")}>
                       <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center shrink-0">
                             <User className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition" />
                          </div>
                          <div>
                             <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-700 transition">
                               <GlobalEntityLink entityId={patient.mrn} entityName={isAr ? patient.nameAr : patient.name} entityType="patient" isAr={isAr}>
                                 {isAr ? patient.nameAr : patient.name}
                               </GlobalEntityLink>
                             </h3>
                             <div className="flex items-center gap-2 mt-0.5">
                               <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{patient.mrn}</span>
                               <span className="text-xs font-medium text-slate-500">{patient.room} • {patient.bed}</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 text-sm font-bold text-slate-700 mb-4 truncate cursor-pointer" onClick={() => handleOpenChart(patient, "summary")}>
                      <span className="text-slate-500">{isAr ? "التشخيص:" : "Dx:"}</span> {patient.dx}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
                      <div 
                        onClick={(e) => { e.stopPropagation(); handleOpenChart(patient, "labs"); }}
                        className={`flex flex-col p-2 rounded-xl border cursor-pointer hover:shadow-sm transition ${patient.alerts.labs > 0 ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                      >
                         <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                           <FlaskConical className="w-3.5 h-3.5" />
                           {isAr ? "نتائج جديدة" : "New Labs"}
                         </div>
                         <div className="text-xl font-black">{patient.alerts.labs}</div>
                      </div>
                      
                      <div 
                        onClick={(e) => { e.stopPropagation(); handleOpenChart(patient, "vitals"); }}
                        className={`flex flex-col p-2 rounded-xl border cursor-pointer hover:shadow-sm transition ${patient.alerts.vitals > 0 ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                      >
                         <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                           <Activity className="w-3.5 h-3.5" />
                           {isAr ? "حيوية حرجة" : "Abnormal Vitals"}
                         </div>
                         <div className="text-xl font-black">{patient.alerts.vitals}</div>
                      </div>

                      <div 
                        onClick={(e) => { e.stopPropagation(); handleOpenChart(patient, "progress_notes"); }}
                        className={`flex flex-col p-2 rounded-xl border cursor-pointer hover:shadow-sm transition ${patient.alerts.consults > 0 ? 'bg-sky-50 border-sky-200 text-sky-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                      >
                         <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                           <Users className="w-3.5 h-3.5" />
                           {isAr ? "استشارات" : "Consults"}
                         </div>
                         <div className="text-xl font-black">{patient.alerts.consults}</div>
                      </div>

                      <div 
                        onClick={(e) => { e.stopPropagation(); handleOpenChart(patient, "orders"); }}
                        className={`flex flex-col p-2 rounded-xl border cursor-pointer hover:shadow-sm transition ${patient.alerts.unsigned > 0 ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                      >
                         <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                           <FileText className="w-3.5 h-3.5" />
                           {isAr ? "غير موقعة" : "Unsigned"}
                         </div>
                         <div className="text-xl font-black">{patient.alerts.unsigned}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {localSelectedPatientId && (
        <PatientChartModal
          patientId={localSelectedPatientId}
          patientName={localSelectedPatientId} // In a real app we'd pass the actual object
          onClose={() => setLocalSelectedPatientId(null)}
          isAr={isAr}
          initialTab={initialPatientTab}
        />
      )}
    </div>
  );
}
