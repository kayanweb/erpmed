import React, { useState } from "react";
import { 
  LogOut, Bed, ArrowLeftRight, ClipboardCheck, AlertTriangle, 
  ChevronRight, ArrowRight, ShieldCheck, FileText, Send,
  Siren, Users, Landmark, Clock, CheckCircle2
} from "lucide-react";
import { motion } from "motion/react";
import { useHIS } from "../../../context/HISContext";
import { Patient } from "../../../types";
import { AdmissionRequestDialog } from "../../AdmissionRequestDialog";
import { toast } from "sonner";

interface ERDispositionProps {
  patient: Patient;
  isAr: boolean;
}

export function ERDisposition({ patient, isAr }: ERDispositionProps) {
  const { updatePatient } = useHIS();
  const [isAdmissionDialogOpen, setIsAdmissionDialogOpen] = useState(false);
  const [dispositionType, setDispositionType] = useState<"discharge" | "admit" | "transfer" | null>(null);

  const handleDischarge = async () => {
    await updatePatient(patient.id, {
      status: 'discharged',
      currentClinicalLocation: undefined,
      bedId: undefined
    });
    toast.success(isAr ? "تم إتمام عملية الخروج" : "Discharge completed");
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="max-w-4xl mx-auto space-y-8">
         <div className="bg-slate-900 p-12 rounded-[56px] text-white flex flex-col items-center text-center space-y-6 shadow-2xl shadow-slate-300 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full"></div>
            
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/10">
               <LogOut size={40} className="text-white" />
            </div>
            
            <div className="space-y-2">
               <h2 className="text-3xl font-black tracking-tighter uppercase">{isAr ? "القرار الطبي النهائي" : "Clinical Disposition"}</h2>
               <p className="text-sm font-bold text-slate-500 max-w-md uppercase tracking-widest leading-relaxed">
                 Finalize the patient journey by selecting the appropriate disposition pathway.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-12">
               <button 
                 onClick={() => setDispositionType("admit")}
                 className={`p-8 rounded-[32px] border-2 transition-all flex flex-col items-center gap-4 group ${
                   dispositionType === "admit" 
                     ? "bg-indigo-600 border-indigo-400 text-white" 
                     : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20"
                 }`}
               >
                  <Bed size={32} className={dispositionType === "admit" ? "text-white" : "text-indigo-400 group-hover:scale-110 transition-transform"} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? "تنويم" : "Admission"}</span>
               </button>

               <button 
                 onClick={() => setDispositionType("discharge")}
                 className={`p-8 rounded-[32px] border-2 transition-all flex flex-col items-center gap-4 group ${
                   dispositionType === "discharge" 
                     ? "bg-emerald-600 border-emerald-400 text-white" 
                     : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20"
                 }`}
               >
                  <LogOut size={32} className={dispositionType === "discharge" ? "text-white" : "text-emerald-400 group-hover:scale-110 transition-transform"} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? "خروج" : "Discharge"}</span>
               </button>

               <button 
                 onClick={() => setDispositionType("transfer")}
                 className={`p-8 rounded-[32px] border-2 transition-all flex flex-col items-center gap-4 group ${
                   dispositionType === "transfer" 
                     ? "bg-amber-600 border-amber-400 text-white" 
                     : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20"
                 }`}
               >
                  <ArrowLeftRight size={32} className={dispositionType === "transfer" ? "text-white" : "text-amber-400 group-hover:scale-110 transition-transform"} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? "تحويل" : "Transfer"}</span>
               </button>
            </div>
         </div>

         {dispositionType === "admit" && (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-xl space-y-8"
           >
              <div className="flex justify-between items-start">
                 <div className="space-y-1">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{isAr ? "مسار التنويم بالمستشفى" : "Inpatient Admission Pathway"}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Formal Hospital Admission Protocol</p>
                 </div>
                 <div className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase">Workflow: ER → IP</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{isAr ? "المتطلبات الإكلينيكية" : "Clinical Pre-requisites"}</h4>
                    <div className="space-y-2">
                       <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
                          <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                             <CheckCircle2 size={12} className="text-emerald-600" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-600">Diagnosis Formally Signed</span>
                       </div>
                       <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl shadow-sm opacity-50">
                          <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center">
                             <Clock size={12} className="text-slate-400" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-600">Admission Request Pending</span>
                       </div>
                    </div>
                 </div>

                 <div className="flex flex-col justify-center gap-4">
                    <button 
                      onClick={() => setIsAdmissionDialogOpen(true)}
                      className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                    >
                       <Siren size={20} />
                       {isAr ? "إنشاء طلب تنويم رسمي" : "Create Formal Admission Request"}
                    </button>
                    <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest px-8">
                      Admission Center will be notified immediately upon signing the request.
                    </p>
                 </div>
              </div>
           </motion.div>
         )}

         {dispositionType === "discharge" && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-xl space-y-8"
            >
               <div className="flex justify-between items-start">
                  <div className="space-y-1">
                     <h3 className="text-xl font-black text-slate-900 tracking-tight">{isAr ? "مسار الخروج من الطوارئ" : "Emergency Discharge Protocol"}</h3>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Safe Exit & Post-Care Planning</p>
                  </div>
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase">Status: Finalizing</div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "خطة الرعاية بعد الخروج" : "Discharge Care Instructions"}</label>
                     <textarea className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none h-40" placeholder="Follow-up with primary care physician..."></textarea>
                  </div>
                  <div className="flex flex-col justify-end gap-4">
                     <button 
                       onClick={handleDischarge}
                       className="w-full py-5 bg-emerald-600 text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"
                     >
                        <ShieldCheck size={20} />
                        {isAr ? "توثيق وإنهاء الخروج" : "Authorize & Complete Discharge"}
                     </button>
                     <button className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-[20px] font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                        <FileText size={14} />
                        {isAr ? "طباعة ملخص الخروج" : "Print Discharge Summary"}
                     </button>
                  </div>
               </div>
            </motion.div>
         )}
      </div>

      {isAdmissionDialogOpen && (
        <AdmissionRequestDialog 
          isOpen={isAdmissionDialogOpen}
          onClose={() => setIsAdmissionDialogOpen(false)}
          patient={patient}
          isAr={isAr}
        />
      )}
    </div>
  );
}
