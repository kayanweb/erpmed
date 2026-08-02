import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Save, 
  FileText, 
  AlertCircle, 
  CheckCircle2,
  Lock,
  User,
  History,
  Printer,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DynamicFormSchema, ClinicalFormInstance, DynamicFormField } from "../types";
import { saveDataPermanently, subscribeToClinicalData } from "../lib/realTimeService";
import { ClinicalSignaturePanel } from "./ClinicalSignaturePanel";
import { toast } from "sonner";
import { format } from "date-fns";
import { safeFormatDate } from "../lib/dateUtils";

interface Props {
  isAr?: boolean;
  patientId: string;
  patientMRN: string;
  currentUser: any;
  onClose?: () => void;
}

export const ClinicalFormsEngine: React.FC<Props> = ({ isAr = true, patientId, patientMRN, currentUser, onClose }) => {
  const [schemas, setSchemas] = useState<DynamicFormSchema[]>([]);
  const [selectedSchema, setSelectedSchema] = useState<DynamicFormSchema | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [history, setHistory] = useState<ClinicalFormInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Load All Active Schemas
    const unsubSchemas = subscribeToClinicalData<DynamicFormSchema>(
      "clinical_form_schemas",
      (data) => setSchemas(data.filter(s => s.isActive)),
      (err) => console.error("Error loading schemas:", err)
    );

    // 2. Load Patient Form History
    const unsubHistory = subscribeToClinicalData<ClinicalFormInstance>(
      "clinical_form_instances",
      (data) => {
        setHistory(data.filter(h => h.patientId === patientId));
        setIsLoading(false);
      },
      (err) => {
        console.error("Error loading history:", err);
        setIsLoading(false);
      }
    );

    return () => {
      unsubSchemas();
      unsubHistory();
    };
  }, [patientId]);

  const handleSchemaSelect = (schema: DynamicFormSchema) => {
    setSelectedSchema(schema);
    // Set default values
    const defaults: Record<string, any> = {};
    schema.fields.forEach(f => {
      if (f.defaultValue) defaults[f.id] = f.defaultValue;
    });
    setFormData(defaults);
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSignAndSave = async (sigData?: any) => {
    if (!selectedSchema) return;

    const instance: ClinicalFormInstance = {
      id: sigData?.signatureId || `instance-${Date.now()}`,
      schemaId: selectedSchema.id,
      patientId,
      patientMRN,
      data: formData,
      signedByStaffId: sigData?.employeeId || currentUser?.staffId || currentUser?.id,
      signedByStaffName: sigData?.signedByStaffName || (isAr ? currentUser?.nameAr : currentUser?.nameEn),
      signedTimestamp: sigData?.timestamp || new Date().toISOString(),
      status: "final",
      auditData: {
        ip: sigData?.ipAddress || "192.168.1.100",
        deviceId: sigData?.digitalHash || navigator.userAgent,
        department: sigData?.department || currentUser?.department || "General"
      }
    };

    try {
      await saveDataPermanently("clinical_form_instances", instance);
      toast.success(isAr ? "تم حفظ وتوقيع المستند بنجاح" : "Document signed and saved successfully");
      setSelectedSchema(null);
      setFormData({});
    } catch (err) {
      toast.error(isAr ? "فشل حفظ المستند" : "Failed to save document");
    }
  };

  const renderField = (field: DynamicFormField) => {
    const value = formData[field.id] || "";
    
    return (
      <div className={`${field.width === 'half' ? 'col-span-6' : field.width === 'third' ? 'col-span-4' : 'col-span-12'} space-y-2`}>
        {field.type === 'header' ? (
          <h3 className="text-sm font-black text-slate-800 border-b-2 border-slate-100 pb-1 mt-6 uppercase tracking-tight">
            {isAr ? field.labelAr : field.labelEn}
          </h3>
        ) : (
          <>
            <label className="text-xs font-bold text-slate-700 flex justify-between px-1">
              <span>{isAr ? field.labelAr : field.labelEn}</span>
              {field.required && <span className="text-rose-500">*</span>}
            </label>

            {field.type === 'textarea' ? (
              <textarea 
                value={value}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                className="w-full h-32 p-4 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder={isAr ? field.placeholderAr : field.placeholderEn}
              />
            ) : field.type === 'select' ? (
              <select
                value={value}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
              >
                <option value="">{isAr ? "-- اختر --" : "-- Select --"}</option>
                {field.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>{isAr ? opt.labelAr : opt.labelEn}</option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input 
                  type="checkbox" 
                  checked={!!value}
                  onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded border-slate-300"
                />
                <span className="text-xs font-bold text-slate-600">{isAr ? "موافق / تم التأكد" : "Confirmed / Verified"}</span>
              </div>
            ) : (
              <input 
                type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                value={value}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder={isAr ? field.placeholderAr : field.placeholderEn}
              />
            )}
          </>
        )}
      </div>
    );
  };

  if (isLoading) {
    return <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div></div>;
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
      {/* Search / Selector */}
      {!selectedSchema && (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                  <FileText size={20} />
                </div>
                {isAr ? "اختيار نموذج طبي للتوثيق" : "Select Clinical Form"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schemas.map(schema => (
                  <button
                    key={schema.id}
                    onClick={() => handleSchemaSelect(schema)}
                    className="p-5 bg-white border border-slate-200 rounded-2xl text-right hover:border-indigo-500 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{schema.code}</span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <h4 className="font-black text-slate-800 group-hover:text-indigo-900">
                      {isAr ? schema.titleAr : schema.titleEn}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Category: {schema.category}</p>
                  </button>
                ))}
              </div>
            </div>

            {history.length > 0 && (
              <div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <History size={16} />
                  {isAr ? "تاريخ التوثيق السريري" : "Clinical Documentation History"}
                </h3>
                <div className="space-y-3">
                  {history.map(instance => (
                    <div key={instance.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                          <CheckCircle2 size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-800">
                            {schemas.find(s => s.id === instance.schemaId)?.titleEn || "Medical Document"}
                          </h4>
                          <p className="text-[10px] font-bold text-slate-400">
                            Signed by {instance.signedByStaffName} on {safeFormatDate(instance.signedTimestamp, "yyyy-MM-dd HH:mm")}
                          </p>
                        </div>
                      </div>
                      <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                        <Printer size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active Form Editor */}
      <AnimatePresence>
        {selectedSchema && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedSchema(null)}
                  className="p-2 text-slate-400 hover:text-slate-600"
                >
                  <ChevronRight className={isAr ? "rotate-0" : "rotate-180"} />
                </button>
                <div>
                  <h3 className="font-black text-slate-800 leading-tight">
                    {isAr ? selectedSchema.titleAr : selectedSchema.titleEn}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    MRN: {patientMRN} | Provider: {isAr ? currentUser.nameAr : currentUser.nameEn}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-10 shadow-sm">
                <div className="grid grid-cols-12 gap-x-6 gap-y-6">
                  {selectedSchema.fields.map(field => renderField(field))}
                </div>

                <ClinicalSignaturePanel 
                  language={isAr ? 'ar' : 'en'}
                  currentUser={currentUser}
                  onSave={() => toast.info("Draft saved locally")}
                  onSign={handleSignAndSave}
                  titleAr="اعتماد التوثيق الطبي"
                  titleEn="Medical Documentation Approval"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClinicalFormsEngine;
