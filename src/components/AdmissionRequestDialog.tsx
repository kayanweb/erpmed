import React, { useState } from "react";
import { X, Landmark, ChevronRight, AlertTriangle, Wind, Monitor, Activity, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHIS } from "../context/HISContext";

interface AdmissionRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
  isAr: boolean;
}

export function AdmissionRequestDialog({ isOpen, onClose, patient, isAr }: AdmissionRequestDialogProps) {
  const { createAdmissionRequest, departments } = useHIS();
  const [targetDeptId, setTargetDeptId] = useState("");
  const [reason, setReason] = useState("");
  const [priority, setPriority] = useState("urgent");
  const [requirements, setRequirements] = useState({
    oxygen: false,
    monitor: false,
    ventilator: false,
    isolation: false
  });

  const handleSubmit = async () => {
    if (!targetDeptId || !reason) return;

    const dept = departments.find(d => d.id === targetDeptId);

    await createAdmissionRequest({
      patientId: patient.id,
      patientClinicalData: patient.clinicalData,
      requestingDoctorId: "DOC-001", // Mocked
      requestingDoctorName: "Dr. Ahmed Smith", // Mocked
      requestedDeptId: targetDeptId,
      requestedDeptName: dept ? (isAr ? dept.nameAr : dept.nameEn) : "General Medicine",
      reason,
      priority,
      requirements,
      requestId: `REQ-${Math.floor(10000 + Math.random() * 90000)}`
    });

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200"
          >
            <div className="p-8 bg-indigo-900 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black">{isAr ? "طلب تنويم مريض" : "Inpatient Admission Request"}</h2>
                <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mt-1">Clinical Disposition Protocol</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center font-black text-indigo-600">
                  {patient.nameEn?.[0]}
                </div>
                <div>
                  <h4 className="text-sm font-black text-indigo-900">{isAr ? patient.nameAr : patient.nameEn}</h4>
                  <p className="text-[10px] font-bold text-indigo-400">MRN: {patient.mrn} • {patient.age}y {patient.gender}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "القسم المطلوب" : "Target Department"}</label>
                  <select 
                    value={targetDeptId}
                    onChange={(e) => setTargetDeptId(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">{isAr ? "--- اختر القسم ---" : "--- Select Ward/Dept ---"}</option>
                    {departments.filter(d => d.type === 'clinical').map(d => (
                      <option key={d.id} value={d.id}>{isAr ? d.nameAr : d.nameEn}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "سبب التنويم" : "Admission Reason / Diagnosis"}</label>
                  <textarea 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none h-24 focus:ring-2 focus:ring-indigo-500" 
                    placeholder={isAr ? "اكتب السبب الطبي للتنويم..." : "Enter medical reason for admission..."}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "متطلبات السرير" : "Bed Requirements"}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'oxygen', labelAr: 'أكسجين', labelEn: 'Oxygen', icon: Wind },
                      { id: 'monitor', labelAr: 'مراقبة', labelEn: 'Monitor', icon: Monitor },
                      { id: 'ventilator', labelAr: 'تنفس اصطناعي', labelEn: 'Ventilator', icon: Activity },
                      { id: 'isolation', labelAr: 'عزل', labelEn: 'Isolation', icon: ShieldAlert },
                    ].map(req => (
                      <button
                        key={req.id}
                        type="button"
                        onClick={() => setRequirements(prev => ({ ...prev, [req.id]: !prev[req.id as keyof typeof prev] }))}
                        className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${
                          requirements[req.id as keyof typeof requirements] 
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                            : 'bg-white border-slate-100 text-slate-400'
                        }`}
                      >
                        <req.icon size={14} />
                        <span className="text-[10px] font-black uppercase">{isAr ? req.labelAr : req.labelEn}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "الأولوية" : "Priority Level"}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['urgent', 'stat'].map(p => (
                      <button 
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`p-3 rounded-xl border font-black text-[10px] uppercase transition-all ${
                          priority === p ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white border-slate-200 text-slate-400'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  onClick={onClose}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={!targetDeptId || !reason}
                  className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:grayscale transition-all"
                >
                  {isAr ? "إرسال طلب التنويم" : "Submit Admission Request"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
