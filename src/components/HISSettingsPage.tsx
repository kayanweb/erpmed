import React, { useState } from "react";
import { Save, Building } from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
  hospitalSettings: any;
  setHospitalSettings: (settings: any) => void;
}

export default function HISSettingsPage({ language, hospitalSettings, setHospitalSettings }: Props) {
  const isAr = language === "ar";
  const [settingsForm, setSettingsForm] = useState(hospitalSettings || {});

  const handleSave = () => {
    setHospitalSettings(settingsForm);
    toast.success(isAr ? "تم حفظ الإعدادات" : "Settings saved");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Building className="w-5 h-5" />
        {isAr ? "إعدادات اسم المستشفى (HIS)" : "HIS Name Settings"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">{isAr ? "اسم المستشفى (عربي)" : "Hospital Name (Ar)"}</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={settingsForm.hisNameAr || ""}
            onChange={(e) => setSettingsForm({ ...settingsForm, hisNameAr: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">{isAr ? "اسم المستشفى (إنجليزي)" : "Hospital Name (En)"}</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={settingsForm.hisNameEn || ""}
            onChange={(e) => setSettingsForm({ ...settingsForm, hisNameEn: e.target.value })}
          />
        </div>
      </div>
      <button
        onClick={handleSave}
        className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-emerald-700"
      >
        <Save className="w-4 h-4" />
        {isAr ? "حفظ" : "Save"}
      </button>
    </div>
  );
}
