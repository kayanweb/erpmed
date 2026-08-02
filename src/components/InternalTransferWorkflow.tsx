import React, { useState, useMemo } from 'react';
import { useHIS } from '../context/HISContext';
import { Patient, HospitalBed, Ward } from '../types';
import { 
  ArrowRightLeft, 
  MapPin, 
  User, 
  Clipboard, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Info,
  Building2,
  Stethoscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface InternalTransferWorkflowProps {
  patient?: Patient;
  onClose: () => void;
}

const InternalTransferWorkflow: React.FC<InternalTransferWorkflowProps> = ({ patient, onClose }) => {
  const { wards, beds, patients, updatePatient, logAudit, language, currentUser } = useHIS();
  const isAr = language === 'ar';

  const [selectedPatientId, setSelectedPatientId] = useState<string>(patient?.id || '');
  const [targetWardId, setTargetWardId] = useState<string>('');
  const [targetBedId, setTargetBedId] = useState<string>('');
  const [reason, setReason] = useState('');
  const [priority, setPriority] = useState<'routine' | 'urgent' | 'emergency'>('routine');

  const selectedPatient = useMemo(() => patients.find(p => p.id === selectedPatientId), [patients, selectedPatientId]);

  // Filter Wards
  const clinicalWards = useMemo(() => wards.filter(w => w.isActive), [wards]);
  const targetWard = useMemo(() => clinicalWards.find(w => w.id === targetWardId), [clinicalWards, targetWardId]);

  // Filter Beds for Target Ward
  const availableBeds = useMemo(() => {
    if (!targetWardId) return [];
    return beds.filter(b => b.wardId === targetWardId && b.status === 'available');
  }, [beds, targetWardId]);

  const targetBed = useMemo(() => availableBeds.find(b => b.id === targetBedId), [availableBeds, targetBedId]);

  const handleTransfer = () => {
    if (!selectedPatient || !targetWard || !targetBed) return;

    // 1. Update Patient Location
    updatePatient(selectedPatient.id, {
      status: 'ward',
      wardId: targetWardId,
      bedId: targetBedId,
      roomId: targetBed.roomNumber,
      currentClinicalLocation: `${targetWard.nameEn} - Room ${targetBed.roomNumber} - Bed ${targetBed.bedNumber}`
    });

    // 2. Audit Log
    logAudit({
      action: 'PATIENT_TRANSFER',
      entityType: 'PATIENT',
      entityId: selectedPatient.id,
      reason: reason || 'Clinical requirement',
      newValue: {
        fromWardId: selectedPatient.wardId,
        toWardId: targetWardId,
        toBedId: targetBedId
      }
    });

    toast.success(isAr ? "تم إكمال تحويل المريض بنجاح" : "Patient transfer completed successfully");
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Header: Patient Selection/Context */}
      <div className="bg-white p-4 border-b border-slate-200 shrink-0">
        {!patient ? (
          <div className="max-w-md mx-auto mb-4">
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">{isAr ? "اختر المريض للتحويل" : "SELECT PATIENT FOR TRANSFER"}</label>
            <select 
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">{isAr ? "اختر مريضاً..." : "Select patient..."}</option>
              {patients.filter(p => p.status === 'ward').map(p => (
                <option key={p.id} value={p.id}>{isAr ? p.nameAr : p.nameEn} ({p.mrn})</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{isAr ? patient.nameAr : patient.nameEn}</h2>
                <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                  <span>{patient.mrn}</span>
                  <span>•</span>
                  <span>{patient.age} {isAr ? "سنة" : "Years"}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
               <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{isAr ? "الموقع الحالي" : "CURRENT LOCATION"}</div>
               <div className="text-sm font-bold text-blue-700">{patient.currentClinicalLocation}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">{isAr ? "سبب التحويل" : "REASON FOR TRANSFER"}</label>
            <input 
              type="text" 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder={isAr ? "أدخل السبب..." : "Enter reason..."}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">{isAr ? "أولوية التحويل" : "TRANSFER PRIORITY"}</label>
            <div className="flex items-center gap-2">
              {(['routine', 'urgent', 'emergency'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                    priority === p 
                      ? p === 'emergency' ? "border-rose-600 bg-rose-50 text-rose-700" : "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
                  }`}
                >
                  {isAr ? (p === 'routine' ? "عادي" : p === 'urgent' ? "عاجل" : "طارئ") : p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Step 1: Destination Ward Selection */}
        <div className="w-1/3 border-l rtl:border-l-0 rtl:border-r border-slate-200 bg-white overflow-y-auto p-4 custom-scrollbar">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-600" />
            {isAr ? "الجناح الوجهة" : "Target Ward"}
          </h3>
          <div className="space-y-2">
            {clinicalWards.map(ward => (
              <button
                key={ward.id}
                onClick={() => {
                  setTargetWardId(ward.id);
                  setTargetBedId('');
                }}
                className={`w-full p-4 rounded-2xl border-2 text-right transition-all ${
                  targetWardId === ward.id 
                    ? "border-indigo-600 bg-indigo-50" 
                    : "border-slate-50 bg-slate-50 hover:border-slate-200"
                }`}
              >
                <div className="text-sm font-black text-slate-900">{isAr ? ward.nameAr : ward.nameEn}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{ward.type}</span>
                  <span className="text-[10px] font-bold text-slate-500">{ward.occupancy}/{ward.capacity} Beds</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Bed Selection in Destination Ward */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
                {isAr ? "الأسرّة المتاحة في الوجهة" : "Available Destination Beds"}
             </h3>
          </div>

          {!targetWardId ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3 opacity-60">
              <Building2 className="w-12 h-12" />
              <p className="text-sm font-medium">{isAr ? "يرجى اختيار الجناح الوجهة أولاً" : "Select destination ward first"}</p>
            </div>
          ) : availableBeds.length === 0 ? (
            <div className="bg-amber-50 border border-amber-100 p-8 rounded-2xl text-center">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <p className="text-sm font-bold text-amber-900">{isAr ? "عذراً، لا توجد أسرّة متاحة في هذا الجناح." : "No beds available in this ward."}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableBeds.map(bed => (
                <button
                  key={bed.id}
                  onClick={() => setTargetBedId(bed.id)}
                  className={`relative p-4 rounded-2xl border-2 transition-all text-right group ${
                    targetBedId === bed.id 
                      ? "border-indigo-600 bg-white shadow-xl -translate-y-1" 
                      : "border-white bg-white hover:border-slate-200"
                  }`}
                >
                  <div className="text-lg font-black text-slate-900">{bed.bedNumber}</div>
                  <div className="text-xs font-bold text-slate-500 mb-2">{isAr ? `غرفة: ${bed.roomNumber}` : `Room: ${bed.roomNumber}`}</div>
                  {targetBedId === bed.id && (
                    <div className="absolute top-3 left-3 bg-indigo-600 text-white p-1 rounded-full">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer: Action */}
      <div className="bg-white p-4 border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex-1 mr-4">
            {targetBed && (
               <div className="flex items-center gap-2 text-emerald-700">
                 <CheckCircle2 className="w-5 h-5" />
                 <span className="text-xs font-bold">{isAr ? `جاهز للتحويل إلى ${targetWard?.nameAr} - سرير ${targetBed.bedNumber}` : `Ready to transfer to ${targetWard?.nameEn} - Bed ${targetBed.bedNumber}`}</span>
               </div>
            )}
          </div>
          <div className="flex items-center gap-3">
             <button
               onClick={onClose}
               className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
             >
               {isAr ? "إلغاء" : "Cancel"}
             </button>
             <button
               disabled={!selectedPatientId || !targetBedId}
               onClick={handleTransfer}
               className="px-8 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2"
             >
               {isAr ? "تأكيد التحويل" : "Confirm Transfer"}
               <ArrowRight className="w-4 h-4 rtl:rotate-180" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternalTransferWorkflow;
