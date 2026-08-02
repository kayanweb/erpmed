import React, { useState } from "react";
import { 
  History, Activity, FileText, Pill, 
  Beaker, Microscope, Clipboard, ChevronRight,
  Plus, Calendar, Filter, Download, Share2,
  Clock, Stethoscope, AlertCircle
} from "lucide-react";
import { useHIS } from "../context/HISContext";
import { motion, AnimatePresence } from "motion/react";
import PatientBanner from "./PatientBanner";

interface EMRViewProps {
  patientId: string;
  language: "ar" | "en";
  onClose?: () => void;
}

export default function EMRView({ patientId, language, onClose }: EMRViewProps) {
  const { 
    patients = [], 
    encounters = [], 
    clinicalRecords = [], 
    cpoeOrders = [],
    labResults = [],
    vitalSigns = []
  } = useHIS();
  
  const isAr = language === "ar";
  const patient = patients.find(p => p.id === patientId);
  const [activeTab, setActiveTab] = useState<"timeline" | "clinical_notes" | "results" | "medications" | "vitals">("timeline");

  if (!patient) return null;

  const patientEncounters = encounters
    .filter(e => e.patientId === patientId)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  const tabs = [
    { id: "timeline", labelEn: "Journey", labelAr: "الخط الزمني", icon: History },
    { id: "clinical_notes", labelEn: "Clinical Notes", labelAr: "الملاحظات السريرية", icon: FileText },
    { id: "results", labelEn: "Lab & Rad", labelAr: "النتائج", icon: Beaker },
    { id: "medications", labelEn: "Medications", labelAr: "الأدوية", icon: Pill },
    { id: "vitals", labelEn: "Vitals", labelAr: "العلامات الحيوية", icon: Activity },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
      {/* Header Banner */}
      <PatientBanner patientId={patientId} language={language} />

      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col p-4 gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? "bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-100" 
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? "text-primary-600" : "text-slate-400"} />
              {isAr ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "timeline" && (
                <div className="max-w-3xl mx-auto flex flex-col gap-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">{isAr ? 'الجدول الزمني للزيارات' : 'Encounter Timeline'}</h2>
                    <div className="flex gap-2">
                       <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50">
                        <Download size={14} />
                        {isAr ? 'تصدير' : 'Export PDF'}
                      </button>
                    </div>
                  </div>

                  <div className="relative space-y-6">
                    {/* Vertical Line */}
                    <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200"></div>

                    {patientEncounters.map((enc, idx) => (
                      <div key={enc.id} className="relative pl-12">
                        {/* Dot */}
                        <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-slate-50 flex items-center justify-center ${
                          enc.status === 'open' ? 'bg-green-500' : 'bg-slate-400'
                        }`}>
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  enc.type === 'emergency' ? 'bg-red-100 text-red-700' : 
                                  enc.type === 'inpatient' ? 'bg-blue-100 text-blue-700' : 
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {enc.type}
                                </span>
                                <span className="text-xs font-mono text-slate-500">#{enc.id}</span>
                              </div>
                              <h3 className="text-base font-bold text-slate-900">{enc.reasonForVisit}</h3>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-medium text-slate-900">{new Date(enc.startTime).toLocaleDateString()}</div>
                              <div className="text-[10px] text-slate-500">{new Date(enc.startTime).toLocaleTimeString()}</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 py-3 border-t border-slate-100 text-xs">
                            <div className="flex items-center gap-2 text-slate-600">
                              <MapPin size={14} className="text-slate-400" />
                              <span className="font-medium">{enc.deptName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                              <Stethoscope size={14} className="text-slate-400" />
                              <span className="font-medium">{enc.doctorName}</span>
                            </div>
                          </div>

                          {enc.status === 'open' && (
                             <div className="mt-3 flex gap-2">
                               <button className="flex-1 bg-primary-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-primary-700">
                                 {isAr ? 'فتح الزيارة الحالية' : 'Open Active Visit'}
                               </button>
                             </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "clinical_notes" && (
                <div className="flex flex-col gap-6">
                   <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">{isAr ? 'الملاحظات السريرية' : 'Clinical Documentation'}</h2>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-primary-700">
                      <Plus size={18} />
                      {isAr ? 'إضافة ملاحظة' : 'New Clinical Note'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {clinicalRecords.filter((r: any) => r.patientId === patientId).length > 0 ? (
                      clinicalRecords.filter((r: any) => r.patientId === patientId).map((note: any) => (
                        <div key={note.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <FileText size={20} />
                              </div>
                              <div>
                                <h3 className="font-bold text-slate-900">{note.noteType || 'Progress Note'}</h3>
                                <p className="text-xs text-slate-500">{note.staffName} • {new Date(note.timestamp).toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                          <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-line">
                            {note.content}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-slate-300 text-slate-400">
                        <FileText size={48} strokeWidth={1} className="mb-4" />
                        <p>{isAr ? 'لا توجد ملاحظات مسجلة' : 'No clinical notes found for this patient'}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "results" && (
                <div className="flex flex-col gap-6">
                  <h2 className="text-xl font-bold text-slate-900">{isAr ? 'نتائج الفحوصات' : 'Lab & Imaging Results'}</h2>
                  {/* Result groups would go here */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4 font-bold text-slate-900">{isAr ? 'التاريخ' : 'Date'}</th>
                          <th className="px-6 py-4 font-bold text-slate-900">{isAr ? 'الفحص' : 'Test/Study'}</th>
                          <th className="px-6 py-4 font-bold text-slate-900">{isAr ? 'النتيجة' : 'Result'}</th>
                          <th className="px-6 py-4 font-bold text-slate-900">{isAr ? 'الحالة' : 'Status'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {labResults.filter((r: any) => r.patientId === patientId).map((res: any) => (
                           <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-slate-600">{new Date(res.timestamp).toLocaleDateString()}</td>
                            <td className="px-6 py-4 font-bold text-slate-900">{res.testName}</td>
                            <td className="px-6 py-4">
                              <span className={res.isAbnormal ? "text-red-600 font-bold" : "text-slate-700"}>
                                {res.value} {res.unit}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase">
                                Final
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function MapPin({ size, className }: { size?: number, className?: string }) {
  return <Activity size={size} className={className} />;
}
