import React, { useState } from "react";
import { 
  Plus, Calendar, AlertCircle, Clock, CheckCircle2, User, X, Stethoscope
} from "lucide-react";
import { ModalityType, OrderPriority, RadiologyStudy } from "../../types/radiology";
import { toast } from "sonner";

interface RadiologyOrderModalProps {
  isAr: boolean;
  onClose: () => void;
  onCreateStudy: (newStudy: RadiologyStudy) => void;
  patientsList?: any[];
}

export const RadiologyOrderModal: React.FC<RadiologyOrderModalProps> = ({
  isAr,
  onClose,
  onCreateStudy,
  patientsList = []
}) => {
  const [patientName, setPatientName] = useState("عبد الله صالح العتيبي");
  const [mrn, setMrn] = useState(`MRN-${Math.floor(10000 + Math.random() * 90000)}`);
  const [patientAge, setPatientAge] = useState(48);
  const [patientGender, setPatientGender] = useState<"Male" | "Female">("Male");
  const [modality, setModality] = useState<ModalityType>("CT");
  const [bodyPart, setBodyPart] = useState("Chest HRCT");
  const [procedureName, setProcedureName] = useState("CT Chest High Resolution (أشعة مقطعية عالية الدقة للصدر)");
  const [priority, setPriority] = useState<OrderPriority>("Urgent");
  const [orderingDoctor, setOrderingDoctor] = useState("د. خالد العتيبي");
  const [orderingDepartment, setOrderingDepartment] = useState("Emergency Department");
  const [clinicalIndication, setClinicalIndication] = useState("Acute onset dyspnea & hemoptysis");
  const [transportMode, setTransportMode] = useState<"Ambulatory" | "Wheelchair" | "Stretcher" | "Portable">("Ambulatory");
  const [scheduledRoom, setScheduledRoom] = useState("CT Room 01 (GE Revolution 128-Slice)");
  const [contrastRequired, setContrastRequired] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName || !procedureName) {
      toast.error(isAr ? "جميع البيانات الأساسية مطلوبة" : "All mandatory fields required");
      return;
    }

    const newStudy: RadiologyStudy = {
      id: `ACC-2026-${Math.floor(9000 + Math.random() * 1000)}`,
      studyInstanceUid: `1.2.840.113619.2.55.3.${Date.now()}`,
      patientId: `P-${Math.floor(10000 + Math.random() * 90000)}`,
      patientName,
      patientAge,
      patientGender,
      mrn,
      modality,
      bodyPart,
      procedureName,
      priority,
      status: "Ordered",
      orderingDoctor,
      orderingDepartment,
      orderDate: new Date().toISOString(),
      scheduledTime: new Date(Date.now() + 30 * 60000).toISOString(),
      scheduledRoom,
      clinicalIndication,
      transportMode,
      prepCompleted: false,
      contrastRequired,
      creatinineLevel: 0.9,
      eGFR: 95,
      pregnancyCheck: patientGender === "Female" ? "Unknown" : "Not Applicable",
      consentSigned: false,
      seriesCount: 4,
      instanceCount: 160,
      dicomAeTitle: "WORKSTATION_MWL",
      sampleImages: [],
      billingAmount: modality === "CT" ? 850 : modality === "MRI" ? 1800 : 250,
      billingStatus: "Pending"
    };

    onCreateStudy(newStudy);
    toast.success(isAr ? "تم إرسال طلب الأشعة وإضافته إلى قائمة الانتظار" : "Radiology CPOE order dispatched successfully");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden text-slate-800" dir={isAr ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">
                {isAr ? "إنشاء طلب فحص أشعة جديد (New Radiology Order)" : "Create New Radiology Order"}
              </h2>
              <p className="text-xs text-slate-400">
                Enterprise CPOE Integration • Modality Worklist Sync
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                {isAr ? "اسم المريض:" : "Patient Name:"}
              </label>
              <input 
                type="text"
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                {isAr ? "رقم الملف الطبي (MRN):" : "Medical Record Number (MRN):"}
              </label>
              <input 
                type="text"
                value={mrn}
                onChange={e => setMrn(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                {isAr ? "العمر:" : "Age:"}
              </label>
              <input 
                type="number"
                value={patientAge}
                onChange={e => setPatientAge(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                {isAr ? "الجنس:" : "Gender:"}
              </label>
              <select 
                value={patientGender}
                onChange={e => setPatientGender(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
              >
                <option value="Male">Male (ذكر)</option>
                <option value="Female">Female (أنثى)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                {isAr ? "التقنية (Modality):" : "Modality:"}
              </label>
              <select 
                value={modality}
                onChange={e => setModality(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-blue-700 outline-none"
              >
                <option value="CT">CT Scan</option>
                <option value="MRI">MRI</option>
                <option value="X-RAY">X-Ray</option>
                <option value="ULTRASOUND">Ultrasound</option>
                <option value="MAMMOGRAPHY">Mammography</option>
                <option value="PET_CT">PET-CT</option>
                <option value="DEXA">Bone Densitometry (DEXA)</option>
                <option value="FLUOROSCOPY">Fluoroscopy</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 block">
              {isAr ? "اسم الفحص والممر الشعاعي:" : "Procedure Name:"}
            </label>
            <input 
              type="text"
              value={procedureName}
              onChange={e => setProcedureName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                {isAr ? "درجة الأولوية:" : "Urgency Priority:"}
              </label>
              <select 
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
              >
                <option value="Routine">Routine (عادي)</option>
                <option value="Urgent">Urgent (عاجل)</option>
                <option value="STAT">STAT (طوارئ فوري)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                {isAr ? "طريقة نقل المريض:" : "Transport Mode:"}
              </label>
              <select 
                value={transportMode}
                onChange={e => setTransportMode(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
              >
                <option value="Ambulatory">Ambulatory (مشياً)</option>
                <option value="Wheelchair">Wheelchair (كرسي)</option>
                <option value="Stretcher">Stretcher (نقالة)</option>
                <option value="Portable">Portable (أشعة متنقلة)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 block">
              {isAr ? "الداعي الطبي والتشخيص الأولي (Indication):" : "Clinical Indication:"}
            </label>
            <textarea 
              rows={2}
              value={clinicalIndication}
              onChange={e => setClinicalIndication(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox"
                checked={contrastRequired}
                onChange={e => setContrastRequired(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300"
              />
              <span className="text-xs font-bold text-slate-800">
                {isAr ? "يتطلب الفحص حقن صبغة طبية (Contrast Injection Required)" : "Requires Medical Contrast Injection"}
              </span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100"
            >
              {isAr ? "إلغاء" : "Cancel"}
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl shadow-lg shadow-blue-200 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {isAr ? "إرسال طلب الأشعة" : "Dispatch Radiology Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
