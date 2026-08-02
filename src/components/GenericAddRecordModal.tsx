import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  language: "ar" | "en";
  moduleName: string;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function GenericAddRecordModal({ language, moduleName, onClose, onSave }: Props) {
  const isAr = language === "ar";
  const [title, setTitle] = useState("");
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title });
    toast.success(isAr ? "تم حفظ السجل بنجاح" : "Record saved successfully");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200" dir={isAr ? "rtl" : "ltr"}>
        <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between text-white">
          <h2 className="font-bold text-lg">{isAr ? `إضافة سجل جديد - ${moduleName}` : `Add New Record - ${moduleName}`}</h2>
          <button onClick={onClose} className="p-2 hover:bg-indigo-500 rounded-full transition-colors text-white">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
              {isAr ? "عنوان/وصف السجل" : "Record Title/Description"}
            </label>
            <input 
              required
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
              placeholder={isAr ? "أدخل الوصف..." : "Enter description..."}
            />
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-slate-500 hover:bg-slate-100 rounded-xl font-bold text-sm transition-colors">
              {isAr ? "إلغاء" : "Cancel"}
            </button>
            <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center gap-2">
              <CheckCircle size={18} />
              {isAr ? "حفظ السجل" : "Save Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
