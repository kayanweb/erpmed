import React, { useEffect, useState } from "react";
import { 
  Stethoscope, 
  ClipboardList, 
  FileText, 
  Save, 
  History,
  Activity,
  User,
  Plus,
  Mic,
  BrainCircuit,
  MessageSquare,
  Clock,
  Printer
} from "lucide-react";
import { ClinicalNote, Patient, WorkflowStage } from "../types";
import { subscribeToClinicalData, saveDataPermanently } from "../lib/realTimeService";
import { toast } from "sonner";
import { format } from "date-fns";
import { safeFormatDate } from "../lib/dateUtils";

interface Props {
  patient?: Patient;
  patientId?: string;
  patientName?: string;
  workflowId?: string;
  staffId?: string;
  staffName?: string;
  isAr?: boolean;
  onSave?: (data: any) => void;
}

const NOTE_TYPES = [
  { value: "SOAP", labelAr: "ملاحظات SOAP", labelEn: "SOAP Notes" },
  { value: "Progress", labelAr: "ملاحظات التطور", labelEn: "Progress Notes" },
  { value: "Nursing", labelAr: "ملاحظات التمريض", labelEn: "Nursing Notes" },
  { value: "Consultation", labelAr: "ملاحظات الاستشارة", labelEn: "Consultation Notes" },
  { value: "Operation", labelAr: "ملاحظات العملية", labelEn: "Operation Notes" },
  { value: "Discharge", labelAr: "ملاحظات الخروج", labelEn: "Discharge Notes" },
  { value: "Procedure", labelAr: "ملاحظات الإجراء", labelEn: "Procedure Notes" },
  { value: "Daily", labelAr: "الملاحظات اليومية", labelEn: "Daily Notes" },
  { value: "WardRound", labelAr: "مرور العنبر", labelEn: "Ward Round" },
  { value: "ICU", labelAr: "ملاحظات العناية المركزة", labelEn: "ICU Notes" },
];

export const ClinicalDocumentation: React.FC<Props> = ({ patient, patientId, patientName, workflowId, staffId, staffName, isAr, onSave }) => {
  const pId = patient?.id || patientId || "unknown";
  const pName = patient?.nameEn || patientName || "unknown";
  const pMrn = patient?.mrn || patientId || "unknown";
  const [noteType, setNoteType] = useState<ClinicalNote["noteType"]>("SOAP");
  const [history, setHistory] = useState<ClinicalNote[]>([]);
  const [soapData, setSoapData] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: ""
  });
  const [freeText, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToClinicalData<ClinicalNote>(
      "hospital_clinical_notes",
      (data) => {
        const filtered = data
          .filter(note => note.patientId === pId)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setHistory(filtered);
      },
      (err) => console.error("Error loading clinical notes:", err)
    );
    return () => unsubscribe();
  }, [pId]);

  const handleAiSummarize = () => {
    setIsAiProcessing(true);
    // Simulating AI processing
    setTimeout(() => {
      const summary = `AI SUMMARY: Patient ${pName} (MRN: ${pMrn}) is currently in the ${patient?.currentWorkflowStage || 'Ward'} stage. Latest vitals were stable. Recommendation: Continue current protocol and monitor oxygen saturation.`;
      setContent(prev => prev + (prev ? "\n\n" : "") + summary);
      setIsAiProcessing(false);
      window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "AI Summary generated", titleAr: "AI Summary generated", type: "form" } }));
    }, 1500);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const newNote: Partial<ClinicalNote> = {
        workflowId: workflowId || "unknown",
        patientId: pId,
        patientMRN: pMrn,
        staffId: staffId || "unknown",
        staffName: staffName || "unknown",
        noteType,
        timestamp: new Date().toISOString(),
        content: noteType === "SOAP" ? JSON.stringify(soapData) : freeText,
        soapData: noteType === "SOAP" ? soapData : undefined
      };

      const noteToSave = {
        id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...newNote
      } as ClinicalNote;

      await saveDataPermanently("hospital_clinical_notes", noteToSave);
      window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Note saved successfully", titleAr: "Note saved successfully", type: "form" } }));
      
      // Clear form
      setSoapData({ subjective: "", objective: "", assessment: "", plan: "" });
      setContent("");
      if (onSave) onSave(noteToSave);
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 leading-tight">Clinical Documentation</h3>
            <p className="text-xs text-slate-500">{patient?.nameAr || pName} | MRN: {pMrn}</p>
          </div>
        </div>
        
        <div className="flex gap-2 min-w-max">
          <select 
            value={noteType}
            onChange={(e) => setNoteType(e.target.value as any)}
            className="text-xs font-bold border border-slate-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          >
            {NOTE_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.labelEn}</option>
            ))}
          </select>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50 shadow-md shadow-indigo-100"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Note"}
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 overflow-hidden flex min-h-0">
        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto p-6 border-r border-slate-100 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              New {noteType} Note
            </h4>
            <div className="flex items-center gap-2">
               <button 
                onClick={() => window.dispatchEvent(new CustomEvent('openGenericModal', { detail: { titleEn: "Voice recognition started...", titleAr: "Voice recognition started...", type: "form" } }))}
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" 
                title="Voice to Note"
               >
                 <Mic className="w-4 h-4" />
               </button>
               <button 
                onClick={handleAiSummarize}
                disabled={isAiProcessing}
                className={`p-2 ${isAiProcessing ? "animate-pulse text-indigo-600" : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"} rounded-lg transition-all`} 
                title="AI Summarize"
               >
                 <BrainCircuit className="w-4 h-4" />
               </button>
            </div>
          </div>
        {noteType === "SOAP" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                Subjective (S)
              </label>
              <textarea 
                value={soapData.subjective}
                onChange={(e) => setSoapData({...soapData, subjective: e.target.value})}
                placeholder="Patient's complaints and symptoms..."
                className="w-full h-32 p-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-slate-50/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                Objective (O)
              </label>
              <textarea 
                value={soapData.objective}
                onChange={(e) => setSoapData({...soapData, objective: e.target.value})}
                placeholder="Vital signs, physical exam findings, lab results..."
                className="w-full h-32 p-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none bg-slate-50/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                Assessment (A)
              </label>
              <textarea 
                value={soapData.assessment}
                onChange={(e) => setSoapData({...soapData, assessment: e.target.value})}
                placeholder="Diagnosis and clinical reasoning..."
                className="w-full h-32 p-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none bg-slate-50/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                Plan (P)
              </label>
              <textarea 
                value={soapData.plan}
                onChange={(e) => setSoapData({...soapData, plan: e.target.value})}
                placeholder="Treatment plan, medications, follow-up..."
                className="w-full h-32 p-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none bg-slate-50/30"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {noteType} Details
            </label>
            <textarea 
              value={freeText}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Enter ${noteType?.toLowerCase()} details here...`}
              className="w-full h-64 p-6 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none bg-slate-50/30 font-serif leading-relaxed"
            />
          </div>
        )}
      </div>

        {/* History Sidebar */}
        <div className="w-80 bg-slate-50/50 flex-1 flex flex-col h-full min-h-0">
           <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <History className="w-3 h-3" />
                History
              </h4>
              <span className="text-[10px] font-bold text-slate-400">{history.length}</span>
           </div>
           
           <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {history.map((note) => (
                <div 
                  key={note.id} 
                  className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded border border-indigo-100 uppercase tracking-tight">
                      {note.noteType}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">
                      {safeFormatDate(note.timestamp, "yyyy-MM-dd HH:mm:ss")}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium line-clamp-3 mb-2 leading-relaxed">
                    {note.noteType === "SOAP" && note.soapData ? 
                      `${note.soapData.assessment}` : note.content}
                  </p>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-2">
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold">
                       <User className="w-3 h-3 text-slate-300" />
                       E-Signed: <span className="text-slate-700">{note.staffName}</span>
                    </div>
                    <Printer className="w-3 h-3 text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </div>
                </div>
              ))}
              
              {history.length === 0 && (
                <div className="py-12 text-center">
                   <FileText className="w-5 h-5 sm:w-8 sm:h-8 text-slate-200 mx-auto mb-2" />
                   <p className="text-[10px] font-bold text-slate-400 uppercase">No prior notes</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Footer / Smart Tools */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2 sm:gap-4 flex-wrap ">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SMART TOOLS:</span>
        <button className="text-[10px] font-bold text-slate-600 hover:text-pink-600 flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm">
          <Activity className="w-3 h-3" />
          Fetch Vitals
        </button>
        <button className="text-[10px] font-bold text-slate-600 hover:text-pink-600 flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm">
          <History className="w-3 h-3" />
          Last Note
        </button>
        <button className="text-[10px] font-bold text-slate-600 hover:text-pink-600 flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm">
          <Plus className="w-3 h-3" />
          Coded DX (ICD-10)
        </button>
      </div>
    </div>
  );
};
