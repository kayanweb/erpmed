import React, { useState } from "react";
import { Search, RotateCcw } from "lucide-react";
import { defaultRegistrationFields } from "../data/defaultRegistrationFields";

interface Props {
  isAr: boolean;
  onSearch: (criteria: any) => void;
  onClear: () => void;
}

export function FindPatientForm({ isAr, onSearch, onClear }: Props) {
  const [formData, setFormData] = useState<any>({});
  
  const handleChange = (key: string, value: string | boolean) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    // Merge OTHER fields
    const finalData = { ...formData };
    Object.keys(finalData).forEach(key => {
      if ((finalData[key] === "OTHER" || finalData[key] === "Other") && finalData[`${key}Other`]) {
        finalData[key] = finalData[`${key}Other`];
      }
    });
    onSearch(finalData);
  };

  const handleClear = () => {
    setFormData({});
    onClear();
  };

  // Specific fields for advanced search as per screenshot
  const searchFieldKeys = [
    "mrn", 
    "enName1", "enName2", "enName3", "enName4",
    "arName1", "arName2", "arName3", "arName4",
    "sex", "dob", "nationality", "city",
    "idType", "idNo", "phone", "mobile",
    "bPhone", "baheyaSponsors"
  ];
  
  const searchFields = searchFieldKeys.map(key => 
    defaultRegistrationFields.find(f => f.key === key)
  ).filter(Boolean) as any[];

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
      <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
        <h3 className="font-bold text-lg text-slate-800">{isAr ? "بحث عن مريض" : "Find Patient"}</h3>
        <div className="flex gap-2 min-w-max">
          <button 
            onClick={handleSearch}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded text-sm font-bold transition"
          >
            <Search className="w-4 h-4" /> {isAr ? "بحث" : "Search"}
          </button>
          <button 
            onClick={handleClear}
            className="flex items-center gap-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 px-4 py-1.5 rounded text-sm font-bold transition"
          >
            <RotateCcw className="w-4 h-4" /> {isAr ? "مسح البحث" : "Clear Search"}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <input 
            type="checkbox" 
            checked={formData.soundex || false}
            onChange={(e) => handleChange("soundex", e.target.checked)}
            className="rounded"
          />
          {isAr ? "بحث بالصوتيات (Soundex)" : "Soundex Search:"}
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {searchFields.map(field => {
          const colSpan = field.key === "mrn" ? "md:col-span-4" : "md:col-span-1";
          
          return (
            <div key={field.key} className={`${colSpan} space-y-1`}>
              <label className="block text-[10px] font-black text-slate-700 uppercase">
                {isAr ? field.labelAr : field.labelEn}
              </label>
              
              {field.type === "select" ? (
                <div className="space-y-1">
                  <select
                    value={formData[field.key] || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1.5 text-xs bg-white outline-none focus:border-blue-500"
                  >
                    <option value="">{isAr ? "اختر..." : "Choose..."}</option>
                    {(field.options || []).map((opt: string) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {(formData[field.key] === "OTHER" || formData[field.key] === "Other") && (
                    <input
                      type="text"
                      required
                      placeholder={isAr ? "يرجى التحديد..." : "Please specify..."}
                      value={formData[`${field.key}Other`] || ""}
                      onChange={(e) => handleChange(`${field.key}Other`, e.target.value)}
                      className="w-full border border-pink-300 bg-pink-50 rounded px-2 py-1.5 text-xs outline-none focus:border-pink-500 font-bold"
                    />
                  )}
                </div>
              ) : field.type === "date" ? (
                <input
                  type="date"
                  value={formData[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full border border-slate-300 rounded px-2 py-1.5 text-xs bg-white outline-none focus:border-blue-500"
                />
              ) : (
                <input
                  type="text"
                  value={formData[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full border border-slate-300 rounded px-2 py-1.5 text-xs bg-white outline-none focus:border-blue-500"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
