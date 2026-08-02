import React, { useState } from "react";
import { X, Save, Thermometer, Gauge, Activity, Droplets } from "lucide-react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  isAr: boolean;
}

export function NewVitalsModal({ isOpen, onClose, onSave, isAr }: Props) {
  const [data, setData] = useState({ patientName: "", patientMRN: "", temp: "", bp: "", hr: "", spo2: "", rr: "" });

  const handleSave = () => {
    if (!data.patientName || !data.patientMRN) {
      toast.error(isAr ? "يرجى إدخال اسم المريض ورقم الملف الطبي" : "Please enter Patient Name and MRN");
      return;
    }
    onSave(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-slate-800 text-lg">
            {isAr ? "تسجيل علامات حيوية جديدة" : "Record New Vitals"}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">{isAr ? "اسم المريض" : "Patient Name"}</label>
                  <input type="text" className="w-full border rounded-lg p-2" value={data.patientName} onChange={e => setData({...data, patientName: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">{isAr ? "رقم الملف الطبي" : "MRN"}</label>
                  <input type="text" className="w-full border rounded-lg p-2" value={data.patientMRN} onChange={e => setData({...data, patientMRN: e.target.value})} />
                </div>
            </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">{isAr ? "الحرارة" : "Temp"} (°C)</label>
              <input type="number" className="w-full border rounded-lg p-2" value={data.temp} onChange={e => setData({...data, temp: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1">{isAr ? "الضغط" : "BP"}</label>
              <input type="text" className="w-full border rounded-lg p-2" placeholder="120/80" value={data.bp} onChange={e => setData({...data, bp: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1">{isAr ? "النبض" : "HR"}</label>
              <input type="number" className="w-full border rounded-lg p-2" value={data.hr} onChange={e => setData({...data, hr: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1">SpO2 (%)</label>
              <input type="number" className="w-full border rounded-lg p-2" value={data.spo2} onChange={e => setData({...data, spo2: e.target.value})} />
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full mt-6 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" /> {isAr ? "حفظ القياس" : "Save Record"}
        </button>
      </div>
    </div>
  );
}
