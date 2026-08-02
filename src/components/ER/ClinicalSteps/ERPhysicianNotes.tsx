import React, { useState } from "react";
import { 
  FileText, Stethoscope, Save, History, Search, 
  Plus, CheckCircle2, AlertTriangle, Info, Clock,
  ChevronRight, Brain, FileCheck
} from "lucide-react";
import { motion } from "motion/react";
import { useHIS } from "../../../context/HISContext";
import { Patient } from "../../../types";
import { toast } from "sonner";

interface ERPhysicianNotesProps {
  patient: Patient;
  isAr: boolean;
}

export function ERPhysicianNotes({ patient, isAr }: ERPhysicianNotesProps) {
  const { addClinicalNote, currentUser, updatePatient } = useHIS();
  
  const [soap, setSoap] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: ""
  });
  
  const [diagnosis, setDiagnosis] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!soap.assessment || !diagnosis) {
      toast.error(isAr ? "يرجى إكمال التقييم والتشخيص" : "Assessment and Diagnosis are required");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Save clinical note
      await addClinicalNote({
        patientId: patient.id,
        patientMRN: patient.mrn,
        workflowId: patient.workflowId || 'er-visit',
        staffId: currentUser?.id || 'doc-1',
        staffName: currentUser?.nameEn || 'Physician',
        noteType: "SOAP",
        content: JSON.stringify(soap),
        soapData: soap,
        timestamp: new Date().toISOString(),
        id: `NOTE-${Date.now()}`
      });

      // Update patient provisional diagnosis
      await updatePatient(patient.id, {
        clinicalData: {
          ...patient.clinicalData,
          provisionalDiagnosis: diagnosis
        }
      });

      toast.success(isAr ? "تم حفظ التوثيق السريري" : "Clinical documentation saved");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
           {/* SOAP Note Canvas */}
           <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center">
                       <FileText className="w-6 h-6 text-rose-500" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900 tracking-tight">{isAr ? "التوثيق السريري (SOAP)" : "Clinical SOAP Note"}</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Physician Initial Assessment</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Clock size={14} className="text-slate-300" />
                    <span>Auto-saving Active</span>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {[
                   { id: 'subjective', label: isAr ? "ذاتي (Subjective)" : "Subjective (History)", color: "rose" },
                   { id: 'objective', label: isAr ? "موضوعي (Objective)" : "Objective (Examination)", color: "blue" },
                   { id: 'assessment', label: isAr ? "التقييم (Assessment)" : "Assessment", color: "amber" },
                   { id: 'plan', label: isAr ? "الخطة (Plan)" : "Plan / Orders", color: "emerald" },
                 ].map(field => (
                   <div key={field.id} className="space-y-3 group">
                      <div className="flex items-center gap-2">
                         <div className={`w-6 h-6 bg-${field.color}-50 text-${field.color}-600 rounded flex items-center justify-center font-black text-[10px]`}>
                           {field.id[0].toUpperCase()}
                         </div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-slate-900 transition-colors">
                           {field.label}
                         </label>
                      </div>
                      <textarea 
                        value={soap[field.id as keyof typeof soap]}
                        onChange={(e) => setSoap(prev => ({ ...prev, [field.id]: e.target.value }))}
                        className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[24px] text-xs font-bold outline-none focus:ring-4 focus:ring-slate-100 focus:bg-white focus:border-slate-300 transition-all min-h-[160px] resize-none" 
                        placeholder="..." 
                      />
                   </div>
                 ))}
              </div>
           </div>

           {/* Diagnosis Section */}
           <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 border-b border-slate-100 pb-4">{isAr ? "التشخيص الإكلينيكي (ICD-10)" : "Clinical Diagnosis & Coding"}</h3>
              <div className="relative group">
                 <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                 <input 
                   type="text" 
                   value={diagnosis}
                   onChange={(e) => setDiagnosis(e.target.value)}
                   className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold outline-none focus:ring-4 focus:ring-slate-100 focus:bg-white focus:border-slate-300 transition-all" 
                   placeholder={isAr ? "بحث في التشخيصات..." : "Enter diagnosis or search ICD code..."} 
                 />
              </div>
              <div className="flex flex-wrap gap-2">
                 {['Chest Pain, unspecified', 'Gastro-esophageal reflux disease', 'Essential hypertension'].map(tag => (
                   <span key={tag} className="px-4 py-2 bg-slate-50 text-slate-600 text-[10px] font-black rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                     {tag}
                   </span>
                 ))}
              </div>
           </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
           <div className="bg-slate-900 p-8 rounded-[40px] text-white space-y-8 shadow-2xl shadow-slate-200 sticky top-10">
              <div>
                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">{isAr ? "إدارة التوثيق" : "Documentation Center"}</h3>
                 <h2 className="text-xl font-black tracking-tighter">Sign & Commit</h2>
              </div>

              <div className="space-y-4">
                 <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-widest">
                       <span>Author</span>
                       <span className="text-white">Dr. {currentUser?.nameEn}</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-widest">
                       <span>Witnessed</span>
                       <span className="text-emerald-400">Authenticated</span>
                    </div>
                 </div>

                 <div className="h-px bg-white/10"></div>

                 <button 
                   onClick={handleSave}
                   disabled={isSubmitting}
                   className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-900/50 hover:bg-rose-700 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
                 >
                    {isSubmitting ? <Clock className="animate-spin" size={16} /> : <FileCheck size={16} />}
                    {isAr ? "توقيع وحفظ المذكرة" : "Sign & Commit Note"}
                 </button>

                 <button className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <History size={14} />
                    {isAr ? "سجل الملاحظات السابقة" : "Previous Notes History"}
                 </button>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-4">
                 <div className="flex items-start gap-3 p-4 bg-amber-900/20 rounded-2xl border border-amber-900/30">
                    <AlertTriangle size={16} className="text-amber-500 shrink-0" />
                    <p className="text-[9px] font-bold text-amber-500/80 italic leading-relaxed">
                      Finalized notes cannot be edited. Corrections must be made via addendum as per HIS quality standards.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
