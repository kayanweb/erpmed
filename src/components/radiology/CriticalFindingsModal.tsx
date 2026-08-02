import React, { useState } from "react";
import { 
  AlertTriangle, PhoneCall, CheckCircle2, Clock, Send, ShieldAlert, X, User
} from "lucide-react";
import { CriticalAlertRecord, RadiologyStudy } from "../../types/radiology";
import { toast } from "sonner";

interface CriticalFindingsModalProps {
  alert?: CriticalAlertRecord;
  study?: RadiologyStudy;
  isAr: boolean;
  onClose: () => void;
  onSaveAlert: (alertRecord: CriticalAlertRecord) => void;
}

export const CriticalFindingsModal: React.FC<CriticalFindingsModalProps> = ({
  alert,
  study,
  isAr,
  onClose,
  onSaveAlert
}) => {
  const [orderingDoctor, setOrderingDoctor] = useState(alert?.orderingDoctor || study?.orderingDoctor || "د. خالد العتيبي");
  const [orderingDoctorPhone, setOrderingDoctorPhone] = useState(alert?.orderingDoctorPhone || "+966501234567");
  const [findingSummary, setFindingSummary] = useState(alert?.findingSummary || study?.clinicalIndication || "Acute Critical Pathology Detected");
  const [notificationMethod, setNotificationMethod] = useState<"Phone Call" | "SMS" | "HIS Direct Alert">("Phone Call");
  const [notes, setNotes] = useState(alert?.notes || "");
  const [acknowledgedBy, setAcknowledgedBy] = useState(alert?.acknowledgedBy || "");

  const handleDocumentNotification = () => {
    if (!findingSummary || !orderingDoctor) {
      toast.error(isAr ? "يرجى تعبئة ملخص النتيجة الحرجة واسم الطبيب" : "Summary and Doctor name are required");
      return;
    }

    const newRecord: CriticalAlertRecord = {
      id: alert?.id || `CRIT-${Math.floor(100 + Math.random() * 900)}`,
      studyId: alert?.studyId || study?.id || "ACC-2026-9001",
      patientName: alert?.patientName || study?.patientName || "مريض حرَِج",
      mrn: alert?.mrn || study?.mrn || "MRN-00000",
      modality: alert?.modality || study?.modality || "CT",
      findingSummary,
      orderingDoctor,
      orderingDoctorPhone,
      radiologistName: "د. محمد زاهر",
      timestamp: new Date().toISOString(),
      notificationMethod,
      status: "Notified & Documented",
      acknowledgedBy: acknowledgedBy || `Recorded verbally by ${orderingDoctor}`,
      acknowledgeTime: new Date().toISOString(),
      notes
    };

    onSaveAlert(newRecord);
    toast.success(isAr ? "تم توثيق إبلاغ الطبيب بالنتيجة الحرجة في السجل المعتمد" : "Critical finding notification documented and timestamped");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-rose-200 shadow-2xl w-full max-w-2xl overflow-hidden text-slate-800" dir={isAr ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="p-6 bg-rose-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">
                {isAr ? "نظام إشعار وتوثيق النتائج الحرجة (Critical Findings Alert)" : "Critical Findings Alert Dispatcher"}
              </h2>
              <p className="text-xs text-rose-100 font-medium">
                Hospital Safety & JCI Quality Standard • Instant Verbal Communication Log
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-1">
            <div className="font-bold text-rose-900">
              {isAr ? "بيانات الدراسة والمريض:" : "Study Context:"} {study?.procedureName || alert?.studyId}
            </div>
            <div className="text-rose-700">
              {isAr ? "المريض:" : "Patient:"} {study?.patientName || alert?.patientName} (MRN: {study?.mrn || alert?.mrn})
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
              {isAr ? "ملخص النتيجة الطبية الحرجة:" : "Critical Finding Summary:"}
            </label>
            <textarea 
              rows={3}
              value={findingSummary}
              onChange={e => setFindingSummary(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-rose-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                {isAr ? "اسم الطبيب المعالج / المعالج:" : "Ordering Physician:"}
              </label>
              <input 
                type="text"
                value={orderingDoctor}
                onChange={e => setOrderingDoctor(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                {isAr ? "رقم الهاتف / الاتصال المباشر:" : "Doctor Phone Number:"}
              </label>
              <input 
                type="text"
                value={orderingDoctorPhone}
                onChange={e => setOrderingDoctorPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 block">
              {isAr ? "وسيلة الإبلاغ وتأكيد الاستلام:" : "Notification Method:"}
            </label>
            <div className="flex gap-3">
              {(["Phone Call", "SMS", "HIS Direct Alert"] as const).map(m => (
                <button 
                  key={m}
                  onClick={() => setNotificationMethod(m)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${notificationMethod === m ? 'bg-rose-600 text-white border-rose-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 block">
              {isAr ? "توثيق هوية الطبيب المستلم للإبلاغ:" : "Acknowledged By / Communication Log Note:"}
            </label>
            <input 
              type="text"
              value={acknowledgedBy}
              onChange={e => setAcknowledgedBy(e.target.value)}
              placeholder={isAr ? "مثال: تم إبلاغ د. خالد هاتفياً الساعة 08:52 ص وتأكيد البدء في العلاج..." : "e.g., Dr. Khaled Al-Otaibi acknowledged PE diagnosis and initiated heparin..."}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100"
          >
            {isAr ? "إلغاء" : "Cancel"}
          </button>
          <button 
            onClick={handleDocumentNotification}
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-xl shadow-lg shadow-rose-200 flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            {isAr ? "توثيق الإشعار بالنتيجة الحرجة" : "Document Critical Notification"}
          </button>
        </div>
      </div>
    </div>
  );
};
