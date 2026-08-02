import React, { useState, useEffect } from "react";
import { Activity, Plus, Search, Thermometer, Gauge, Eye, Droplets } from "lucide-react";
import { toast } from "sonner";
import { firestoreService } from "../lib/firestoreService";
import { VitalSigns } from "../types";
import { EntityDetailModal } from "./EntityDetailModal";
import { GlobalEntityLink } from "./GlobalEntityLink";
import { NewVitalsModal } from "./NewVitalsModal";

interface Props {
  language: "ar" | "en";
}

export default function VitalsDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [searchTerm, setSearchTerm] = useState("");
  const [vitalsData, setVitalsData] = useState<VitalSigns[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await firestoreService.getAll<VitalSigns>(firestoreService.collections.vitals);
      setVitalsData(data);
    } catch (e) {
      toast.error("Failed to load vitals");
    }
  };

  const handleSaveVitals = async (data: any) => {
    try {
        await firestoreService.add(firestoreService.collections.vitals, data);
        toast.success(isAr ? "تم حفظ العلامات الحيوية!" : "Vitals saved successfully!");
        loadData();
    } catch (error) {
        toast.error(isAr ? "حدث خطأ أثناء الحفظ" : "Error saving vitals");
    }
  };

  const filteredData = vitalsData.filter(d => 
    Object.values(d).some(val => String(val)?.toLowerCase()?.includes(searchTerm?.toLowerCase()))
  );

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in flex-1 flex flex-col h-full min-h-0" dir={isAr ? "rtl" : "ltr"}>
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex flex-wrap items-center gap-2 sm:gap-3">
            <Activity className="w-7 h-7 text-rose-600" />
            {isAr ? "مؤشرات العلامات الحيوية (Vitals)" : "Vitals Monitor"}
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">{isAr ? "مراقبة وتسجيل العلامات الحيوية للمرضى." : "Monitor and record patient vital signs."}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition shadow-sm"
            >
            <Plus className="w-4 h-4" /> {isAr ? "تسجيل قياس جديد" : "New Record"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute top-2.5 left-3 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={isAr ? "بحث في القياسات..." : "Search measurements..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">{isAr ? "المريض / ملف" : "Patient / MRN"}</th>
                <th className="px-6 py-4"><Thermometer className="w-4 h-4 inline" /> {isAr ? "الحرارة" : "Temp"}</th>
                <th className="px-6 py-4"><Gauge className="w-4 h-4 inline" /> {isAr ? "الضغط" : "BP"}</th>
                <th className="px-6 py-4"><Activity className="w-4 h-4 inline" /> {isAr ? "النبض" : "HR"}</th>
                <th className="px-6 py-4"><Droplets className="w-4 h-4 inline" /> SpO2</th>
                <th className="px-6 py-4">{isAr ? "التاريخ" : "Date"}</th>
                <th className="px-6 py-4 text-center">{isAr ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">
                        <GlobalEntityLink entityName={row.patientName} entityId={row.patientMRN} entityType="patient" className="text-slate-800 hover:text-indigo-600" isAr={isAr} />
                    </div>
                    <div className="text-xs text-slate-500 font-mono">#{row.patientMRN}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{row.temp}°C</td>
                  <td className="px-6 py-4 text-slate-600">{row.bp}</td>
                  <td className="px-6 py-4 text-slate-600">{row.hr}</td>
                  <td className="px-6 py-4 text-slate-600">{row.spo2}%</td>
                  <td className="px-6 py-4 text-slate-600 text-xs">
                    {row.createdAt?.toDate ? row.createdAt.toDate().toLocaleString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setSelectedEntity(row)} className="p-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
</div>
        </div>
      </div>
      <NewVitalsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveVitals}
        isAr={isAr}
      />
      {selectedEntity && (
        <EntityDetailModal 
          entity={selectedEntity} 
          type={isAr ? "مؤشرات حيوية" : "Vitals"} 
          onClose={() => setSelectedEntity(null)} 
          isAr={isAr} 
        />
      )}
    </div>
  );
}
