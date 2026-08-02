import React, { useState, useEffect } from "react";
import { 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  UserPlus,
  ShieldCheck,
  Stethoscope,
  Microscope,
  Pill,
  CreditCard,
  LogOut,
  History as HistoryIcon,
  ClipboardList,
  FileText
} from "lucide-react";
import { Patient, WorkflowStage, PatientVisitWorkflow } from "../types";
import { transitionStage, syncActiveWorkflows } from "../lib/workflowService";
import { toast } from "sonner";

interface Props {
  patient: Patient;
  staffId: string;
  staffName: string;
}

const STAGES: { id: WorkflowStage; labelAr: string; labelEn: string; icon: any; color: string }[] = [
  { id: "registration", labelAr: "التسجيل", labelEn: "Registration", icon: UserPlus, color: "blue" },
  { id: "insurance_verification", labelAr: "تأمين", labelEn: "Insurance", icon: ShieldCheck, color: "indigo" },
  { id: "triage", labelAr: "فرز", labelEn: "Triage", icon: HistoryIcon, color: "cyan" },
  { id: "doctor_consultation", labelAr: "الطبيب", labelEn: "Doctor", icon: Stethoscope, color: "pink" },
  { id: "diagnosis", labelAr: "التشخيص", labelEn: "Diagnosis", icon: ClipboardList, color: "rose" },
  { id: "orders", labelAr: "طلبات", labelEn: "Orders", icon: FileText, color: "amber" },
  { id: "lab_rad_execution", labelAr: "أشعة وتحاليل", labelEn: "Lab & Rad", icon: Microscope, color: "orange" },
  { id: "medication_administration", labelAr: "علاج", labelEn: "Medication", icon: Pill, color: "emerald" },
  { id: "billing", labelAr: "حسابات", labelEn: "Billing", icon: CreditCard, color: "purple" },
  { id: "discharge", labelAr: "خروج", labelEn: "Discharge", icon: LogOut, color: "slate" },
];

export const PatientWorkflowConsole: React.FC<Props> = ({ patient, staffId, staffName }) => {
  const [currentStage, setCurrentStage] = useState<WorkflowStage>((patient.currentWorkflowStage as WorkflowStage) || "registration");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTransition = async (nextStage: WorkflowStage) => {
    if (!patient.workflowId) {
      toast.error("No active workflow for this patient");
      return;
    }
    
    setIsTransitioning(true);
    try {
      await transitionStage(patient.workflowId, nextStage, staffId, staffName);
      setCurrentStage(nextStage);
      toast.success(`Transitioned to ${nextStage}`);
    } catch (e) {
      toast.error("Transition failed");
    } finally {
      setIsTransitioning(false);
    }
  };

  const getStageColorClasses = (color: string, isActive: boolean, isCompleted: boolean) => {
    if (isActive) {
      switch (color) {
        case "blue": return "bg-blue-600 border-blue-600 shadow-blue-200";
        case "indigo": return "bg-indigo-600 border-indigo-600 shadow-indigo-200";
        case "cyan": return "bg-cyan-600 border-cyan-600 shadow-cyan-200";
        case "pink": return "bg-pink-600 border-pink-600 shadow-pink-200";
        case "rose": return "bg-rose-600 border-rose-600 shadow-rose-200";
        case "amber": return "bg-amber-600 border-amber-600 shadow-amber-200";
        case "orange": return "bg-orange-600 border-orange-600 shadow-orange-200";
        case "emerald": return "bg-emerald-600 border-emerald-600 shadow-emerald-200";
        case "purple": return "bg-purple-600 border-purple-600 shadow-purple-200";
        case "slate": return "bg-slate-600 border-slate-600 shadow-slate-200";
        default: return "bg-slate-600 border-slate-600 shadow-slate-200";
      }
    }
    if (isCompleted) return "bg-emerald-500 border-emerald-500 text-white";
    return "bg-white border-slate-200 text-slate-400";
  };

  const getButtonColorClasses = (color: string) => {
    switch (color) {
      case "blue": return "bg-blue-600 hover:bg-blue-700 shadow-blue-100";
      case "indigo": return "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100";
      case "cyan": return "bg-cyan-600 hover:bg-cyan-700 shadow-cyan-100";
      case "pink": return "bg-pink-600 hover:bg-pink-700 shadow-pink-100";
      case "rose": return "bg-rose-600 hover:bg-rose-700 shadow-rose-100";
      case "amber": return "bg-amber-600 hover:bg-amber-700 shadow-amber-100";
      case "orange": return "bg-orange-600 hover:bg-orange-700 shadow-orange-100";
      case "emerald": return "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100";
      case "purple": return "bg-purple-600 hover:bg-purple-700 shadow-purple-100";
      case "slate": return "bg-slate-600 hover:bg-slate-700 shadow-slate-100";
      default: return "bg-slate-600 hover:bg-slate-700 shadow-slate-100";
    }
  };

  const currentStageIndex = STAGES.findIndex(s => s.id === currentStage);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Patient Journey</h3>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">Automated Workflow Engine</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
           <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
           <span className="text-[10px] font-black uppercase">Active Visit</span>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="relative flex items-center justify-between w-full">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
        
        {STAGES.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = index === currentStageIndex;
          const isCompleted = index < currentStageIndex;
          
          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center gap-3">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                  isActive ? "text-white shadow-lg scale-110" : ""
                } ${getStageColorClasses(stage.color, isActive, isCompleted)}`}
              >
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <div className="text-center">
                <p className={`text-[10px] font-black transition-colors ${isActive ? "text-slate-900" : "text-slate-400"}`}>
                  {stage.labelEn}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Next Step Action */}
      {currentStageIndex < STAGES.length - 1 && (
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-200">
                 <ArrowRight className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Next Objective</p>
                 <h4 className="font-bold text-slate-900">{STAGES[currentStageIndex + 1].labelEn}</h4>
              </div>
           </div>
           
           <button 
             disabled={isTransitioning}
             onClick={() => handleTransition(STAGES[currentStageIndex + 1].id)}
             className={`px-6 py-3 text-white rounded-xl text-sm font-black shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 ${getButtonColorClasses(STAGES[currentStageIndex + 1].color)}`}
           >
              Proceed to {STAGES[currentStageIndex + 1].labelEn}
              <ChevronRight className="w-4 h-4" />
           </button>
        </div>
      )}

      {/* Workflow Logs / History */}
      <div className="pt-6 border-t border-slate-100">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Journey History</h4>
        <div className="space-y-3">
           <div className="flex items-center justify-between text-xs bg-slate-50/50 p-3 rounded-lg border border-slate-100">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                 <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                 <span className="font-bold text-slate-700">Patient Arrived & Registered</span>
              </div>
              <span className="font-mono text-slate-400 text-[10px]">10:20 AM</span>
           </div>
           <div className="flex items-center justify-between text-xs bg-slate-50/50 p-3 rounded-lg border border-slate-100">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                 <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                 <span className="font-bold text-slate-700">Insurance Policy Verified</span>
              </div>
              <span className="font-mono text-slate-400 text-[10px]">10:25 AM</span>
           </div>
        </div>
      </div>
    </div>
  );
};
