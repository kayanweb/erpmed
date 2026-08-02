import React, { useState } from "react";
import { 
  X, Siren, Stethoscope, ClipboardList, Activity, Microscope, 
  Monitor, Pill, Scissors, Eye, ArrowLeftRight, Receipt, FileText,
  LayoutDashboard, History, CheckCircle2, ChevronRight, AlertTriangle,
  HeartPulse, Thermometer, Wind, User
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHIS } from "../../context/HISContext";
import { Patient } from "../../types";

// Import sub-modules (we will create these next)
// Import sub-modules
import { ERTriage } from "./ClinicalSteps/ERTriage";
import { EROrders } from "./ClinicalSteps/EROrders";
import { ERPhysicianNotes } from "./ClinicalSteps/ERPhysicianNotes";
import { ERDisposition } from "./ClinicalSteps/ERDisposition";

interface ERPatientWorkspaceProps {
  patientId: string;
  isAr: boolean;
  onClose: () => void;
}

type WorkspaceStep = 
  | "overview"
  | "triage"
  | "physician"
  | "nursing"
  | "orders"
  | "results"
  | "disposition"
  | "billing";

export function ERPatientWorkspace({ patientId, isAr, onClose }: ERPatientWorkspaceProps) {
  const { patients = [], startEncounter } = useHIS();
  const patient = patients.find(p => p.id === patientId);
  const [activeStep, setActiveStep] = useState<WorkspaceStep>("overview");

  if (!patient) return null;

  const steps = [
    { id: "overview", icon: LayoutDashboard, en: "Case Overview", ar: "نظرة عامة" },
    { id: "triage", icon: Activity, en: "Triage / Vitals", ar: "الفرز / العلامات" },
    { id: "physician", icon: Stethoscope, en: "Physician Desk", ar: "مكتب الطبيب" },
    { id: "nursing", icon: ClipboardList, en: "Nursing Care", ar: "عناية التمريض" },
    { id: "orders", icon: Pill, en: "Orders / CPOE", ar: "الأوامر الطبية" },
    { id: "results", icon: Microscope, en: "Results", ar: "النتائج" },
    { id: "disposition", icon: ArrowLeftRight, en: "Disposition", ar: "القرار الطبي" },
    { id: "billing", icon: Receipt, en: "Billing", ar: "الفواتير" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute inset-0 z-20 bg-slate-50 flex flex-col overflow-hidden"
    >
      {/* Workspace Header */}
      <header className="h-20 bg-slate-900 text-white px-8 flex items-center justify-between shadow-xl shrink-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-900/50">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-black tracking-tight leading-none mb-1">
                {isAr ? patient.nameAr : patient.nameEn}
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">MRN: {patient.mrn}</span>
                <span className="text-slate-600">•</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{patient.gender} / {patient.age}y</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "الحالة الحالية" : "Current Status"}</span>
              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">{patient.status}</span>
           </div>
           <div className="h-8 w-px bg-slate-800 mx-2"></div>
           <div className={`px-4 py-2 rounded-xl border font-black text-xs ${patient.clinicalData?.esiLevel === 1 ? 'bg-red-900/30 border-red-500 text-red-500' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
             ESI {patient.clinicalData?.esiLevel || "N/A"}
           </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Workspace Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col py-6 shrink-0 shadow-sm">
          <div className="px-6 mb-8">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{isAr ? "خطوات العمل" : "Workflow Protocol"}</h3>
            <div className="space-y-1">
              {steps.map(step => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id as WorkspaceStep)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-black transition-all ${
                    activeStep === step.id 
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                      : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                  }`}
                >
                  <step.icon size={16} />
                  <span>{isAr ? step.ar : step.en}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto px-6">
             <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">{isAr ? "وقت الإقامة" : "Length of Stay"}</p>
                <p className="text-lg font-black text-indigo-900 tracking-tighter">02:14:35</p>
             </div>
          </div>
        </aside>

        {/* Workspace Content */}
        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-5xl mx-auto"
            >
              {activeStep === "overview" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
                       <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">{isAr ? "الملخص السريري للزيارة" : "Clinical Encounter Summary"}</h3>
                       <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <Stethoscope size={14} className="text-rose-500" />
                                {isAr ? "الشكوى الرئيسية" : "Chief Complaint"}
                             </div>
                             <p className="text-sm font-bold text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
                                "{patient.clinicalData?.chiefComplaint || "No complaint recorded yet."}"
                             </p>
                          </div>
                          <div className="space-y-4">
                             <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <History size={14} className="text-blue-500" />
                                {isAr ? "الحالة السريرية" : "Clinical Status"}
                             </div>
                             <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
                                   <span className="text-[10px] font-bold text-slate-400">Diagnosis</span>
                                   <span className="text-xs font-black text-slate-700">{patient.clinicalData?.provisionalDiagnosis || "Pending Assessment"}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
                                   <span className="text-[10px] font-bold text-slate-400">Allergies</span>
                                   <span className="text-xs font-black text-rose-600">NKDA</span>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                    
                    <div className="bg-slate-900 p-8 rounded-[32px] text-white space-y-6 shadow-2xl shadow-slate-200">
                       <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "آخر العلامات الحيوية" : "Latest Vitals"}</h3>
                       <div className="space-y-4">
                          {[
                            { label: "Temp", value: patient.vitals?.temp || "37.2", unit: "°C", icon: Thermometer, color: "text-amber-400" },
                            { label: "Pulse", value: patient.vitals?.hr || "88", unit: "bpm", icon: HeartPulse, color: "text-rose-400" },
                            { label: "BP", value: patient.vitals?.bp || "128/84", unit: "mmHg", icon: Activity, color: "text-blue-400" },
                            { label: "SpO2", value: patient.vitals?.spo2 || "98", unit: "%", icon: Wind, color: "text-emerald-400" },
                          ].map(v => (
                            <div key={v.label} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                               <div className="flex items-center gap-3">
                                  <v.icon size={16} className={v.color} />
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{v.label}</span>
                               </div>
                               <div className="flex items-baseline gap-1">
                                  <span className="text-sm font-black">{v.value}</span>
                                  <span className="text-[8px] font-bold text-slate-500 uppercase">{v.unit}</span>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                           <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{isAr ? "الأوامر الطبية النشطة" : "Active Clinical Orders"}</h3>
                           <span className="px-2 py-0.5 bg-slate-100 rounded text-[8px] font-black text-slate-500">0 PENDING</span>
                        </div>
                        <div className="py-12 text-center text-slate-400 space-y-3">
                           <Microscope className="w-12 h-12 mx-auto opacity-20" />
                           <p className="text-xs font-bold uppercase tracking-widest opacity-50">No orders for this session</p>
                        </div>
                     </div>
                     <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                           <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{isAr ? "الجدول الزمني للزيارة" : "Visit Timeline"}</h3>
                           <History className="w-4 h-4 text-slate-300" />
                        </div>
                        <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                           <div className="relative pl-8">
                              <div className="absolute left-0 top-1 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                                 <CheckCircle2 size={10} className="text-emerald-600" />
                              </div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">10:45 AM</p>
                              <p className="text-xs font-black text-slate-800">{isAr ? "تم إتمام الفرز" : "Triage Completed"}</p>
                           </div>
                           <div className="relative pl-8">
                              <div className="absolute left-0 top-1 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                                 <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
                              </div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">11:12 AM</p>
                              <p className="text-xs font-black text-slate-800">{isAr ? "في انتظار المعاينة الطبية" : "Awaiting Physician Assessment"}</p>
                           </div>
                        </div>
                     </div>
                  </div>
                </div>
              )}

              {activeStep === "triage" && <ERTriage patient={patient} isAr={isAr} />}
              {activeStep === "orders" && <EROrders patient={patient} isAr={isAr} />}
              {activeStep === "physician" && <ERPhysicianNotes patient={patient} isAr={isAr} />}
              {activeStep === "disposition" && <ERDisposition patient={patient} isAr={isAr} />}

              {["nursing", "results", "billing"].includes(activeStep) && (
                 <div className="bg-white p-12 rounded-[48px] border border-slate-200 shadow-sm text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-slate-200">
                       <LayoutDashboard className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-2">Module Under Deployment</h3>
                    <p className="text-sm font-bold text-slate-400 mb-8 max-w-md mx-auto">
                       This core HIS clinical module is being mapped to enterprise standards. Real data persistence and full CPOE integration are being established.
                    </p>
                    <button 
                      onClick={() => setActiveStep("overview")}
                      className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all"
                    >
                       Back to Overview
                    </button>
                 </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
}
