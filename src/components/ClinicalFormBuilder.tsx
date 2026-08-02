import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Save, 
  Settings, 
  Layout, 
  Type, 
  List, 
  CheckSquare, 
  Calendar, 
  Hash, 
  ChevronDown, 
  ChevronUp, 
  Eye,
  FileCode,
  Globe,
  Database,
  PenTool,
  Move
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DynamicFormSchema, DynamicFormField } from "../types";
import { saveDataPermanently, subscribeToClinicalData } from "../lib/realTimeService";
import { toast } from "sonner";

interface Props {
  isAr?: boolean;
  currentUser: any;
}

const FIELD_TYPES = [
  { id: "header", labelAr: "عنوان قسم", labelEn: "Section Header", icon: Layout },
  { id: "text", labelAr: "نص قصير", labelEn: "Short Text", icon: Type },
  { id: "textarea", labelAr: "نص طويل", labelEn: "Long Text", icon: FileCode },
  { id: "number", labelAr: "رقم", labelEn: "Number", icon: Hash },
  { id: "date", labelAr: "تاريخ", labelEn: "Date", icon: Calendar },
  { id: "select", labelAr: "قائمة منسدلة", labelEn: "Dropdown", icon: List },
  { id: "checkbox", labelAr: "خانة اختيار", labelEn: "Checkbox", icon: CheckSquare },
  { id: "vitals", labelAr: "العلامات الحيوية", labelEn: "Vitals Set", icon: Database },
  { id: "signature", labelAr: "توقيع إلكتروني", labelEn: "Signature", icon: PenTool },
];

export const ClinicalFormBuilder: React.FC<Props> = ({ isAr = true, currentUser }) => {
  const [schemas, setSchemas] = useState<DynamicFormSchema[]>([]);
  const [activeSchema, setActiveSchema] = useState<DynamicFormSchema | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToClinicalData<DynamicFormSchema>(
      "clinical_form_schemas",
      (data) => {
        setSchemas(data);
        setIsLoading(false);
      },
      (err) => {
        console.error("Error loading schemas:", err);
        setIsLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const handleCreateNew = () => {
    const newSchema: DynamicFormSchema = {
      id: `schema-${Date.now()}`,
      code: `FORM-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      titleAr: "نموذج جديد",
      titleEn: "New Clinical Form",
      category: "general",
      version: "1.0",
      fields: [],
      isActive: true,
      createdBy: currentUser.staffId,
      createdAt: new Date().toISOString(),
    };
    setActiveSchema(newSchema);
    setIsPreview(false);
  };

  const handleAddField = (type: any) => {
    if (!activeSchema) return;
    const newField: DynamicFormField = {
      id: `field-${Date.now()}`,
      type: type.id as any,
      labelAr: type.labelAr,
      labelEn: type.labelEn,
      required: false,
      width: "full",
      options: type.id === "select" || type.id === "radio" ? [{ value: "opt1", labelAr: "خيار 1", labelEn: "Option 1" }] : undefined
    };
    setActiveSchema({
      ...activeSchema,
      fields: [...activeSchema.fields, newField]
    });
  };

  const handleRemoveField = (fieldId: string) => {
    if (!activeSchema) return;
    setActiveSchema({
      ...activeSchema,
      fields: activeSchema.fields.filter(f => f.id !== fieldId)
    });
  };

  const handleUpdateField = (fieldId: string, updates: Partial<DynamicFormField>) => {
    if (!activeSchema) return;
    setActiveSchema({
      ...activeSchema,
      fields: activeSchema.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f)
    });
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    if (!activeSchema) return;
    const newFields = [...activeSchema.fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFields.length) return;
    
    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    setActiveSchema({ ...activeSchema, fields: newFields });
  };

  const handleSaveSchema = async () => {
    if (!activeSchema) return;
    try {
      await saveDataPermanently("clinical_form_schemas", activeSchema);
      toast.success(isAr ? "تم حفظ النموذج بنجاح" : "Schema saved successfully");
    } catch (err) {
      toast.error(isAr ? "فشل حفظ النموذج" : "Failed to save schema");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              {isAr ? "مصمم النماذج السريرية" : "Clinical Form Designer"}
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {isAr ? "إدارة وتصميم نماذج التوثيق الطبي" : "Build & Configure Clinical Documentation"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeSchema ? (
            <>
              <button 
                onClick={() => setIsPreview(!isPreview)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${isPreview ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <Eye className="w-4 h-4" />
                {isAr ? (isPreview ? "الرجوع للمحرر" : "معاينة النموذج") : (isPreview ? "Back to Editor" : "Preview Form")}
              </button>
              <button 
                onClick={handleSaveSchema}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-black transition-all shadow-lg shadow-slate-100 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isAr ? "حفظ التصميم" : "Save Schema"}
              </button>
              <button 
                onClick={() => setActiveSchema(null)}
                className="px-5 py-2.5 bg-white border border-slate-200 text-rose-600 rounded-xl text-xs font-black uppercase hover:bg-rose-50 transition-all"
              >
                {isAr ? "إغلاق" : "Close"}
              </button>
            </>
          ) : (
            <button 
              onClick={handleCreateNew}
              className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-black uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-3"
            >
              <Plus className="w-5 h-5" />
              {isAr ? "إنشاء نموذج جديد" : "Build New Form"}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {!activeSchema ? (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">
                {isAr ? "النماذج المسجلة بالنظام" : "System Form Library"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schemas.map(schema => (
                  <motion.div 
                    key={schema.id}
                    whileHover={{ y: -4 }}
                    className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer group relative overflow-hidden"
                    onClick={() => setActiveSchema(schema)}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform" />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <FileCode className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{schema.code}</span>
                          <h4 className="font-black text-slate-800 leading-tight">
                            {isAr ? schema.titleAr : schema.titleEn}
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5" />
                          {schema.category}
                        </div>
                        <div className="flex items-center gap-1.5">
                          v{schema.version}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Sidebar Tools */}
            <div className="w-72 bg-white border-r border-slate-200 p-6 overflow-y-auto shrink-0 space-y-8">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  {isAr ? "عناصر النموذج" : "Form Elements"}
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {FIELD_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => handleAddField(type)}
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 group transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 shadow-sm transition-all">
                        <type.icon size={18} />
                      </div>
                      <div className="text-right flex-1">
                        <p className="text-xs font-black text-slate-700 leading-none mb-1 group-hover:text-indigo-900">
                          {isAr ? type.labelAr : type.labelEn}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">
                          {type.id}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  {isAr ? "إعدادات النموذج" : "Form Properties"}
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase px-1">{isAr ? "العنوان (عربي)" : "Title (Arabic)"}</label>
                    <input 
                      type="text" 
                      value={activeSchema.titleAr}
                      onChange={(e) => setActiveSchema({...activeSchema, titleAr: e.target.value})}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:border-indigo-500 focus:ring-0"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase px-1">{isAr ? "العنوان (إنجليزي)" : "Title (English)"}</label>
                    <input 
                      type="text" 
                      value={activeSchema.titleEn}
                      onChange={(e) => setActiveSchema({...activeSchema, titleEn: e.target.value})}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:border-indigo-500 focus:ring-0"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase px-1">{isAr ? "التصنيف" : "Category"}</label>
                    <select 
                      value={activeSchema.category}
                      onChange={(e) => setActiveSchema({...activeSchema, category: e.target.value})}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:border-indigo-500 focus:ring-0"
                    >
                      <option value="admission">Admission</option>
                      <option value="opd">OPD</option>
                      <option value="ipd">IPD</option>
                      <option value="nursing">Nursing</option>
                      <option value="doctor">Doctor</option>
                      <option value="consent">Consent</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Editor/Preview Area */}
            <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
              <div className="max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                  {isPreview ? (
                    <motion.div 
                      key="preview"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="bg-white rounded-[40px] shadow-2xl border border-slate-200 p-12 min-h-[800px]"
                    >
                      <div className="text-center mb-12 border-b-2 border-slate-100 pb-8">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase">
                          {isAr ? activeSchema.titleAr : activeSchema.titleEn}
                        </h2>
                        <div className="flex items-center justify-center gap-6">
                          <span className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest">{activeSchema.code}</span>
                          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Version {activeSchema.version}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-12 gap-x-8 gap-y-10">
                        {activeSchema.fields.map(field => (
                          <div 
                            key={field.id}
                            className={`${field.width === 'full' ? 'col-span-12' : field.width === 'half' ? 'col-span-6' : 'col-span-4'}`}
                          >
                            {field.type === 'header' ? (
                              <h3 className="text-lg font-black text-slate-800 border-b-4 border-indigo-600 inline-block pb-1 uppercase tracking-tight">
                                {isAr ? field.labelAr : field.labelEn}
                              </h3>
                            ) : field.type === 'textarea' ? (
                              <div className="space-y-2">
                                <label className="text-xs font-black text-slate-800 flex justify-between px-1">
                                  <span>{field.labelAr}</span>
                                  <span className="text-slate-400 font-bold uppercase tracking-tighter">{field.labelEn}</span>
                                </label>
                                <textarea className="w-full h-32 p-4 bg-slate-50 border-2 border-slate-100 rounded-3xl text-sm font-medium focus:border-indigo-600 focus:ring-0 transition-all outline-none" />
                              </div>
                            ) : field.type === 'checkbox' ? (
                              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                                <input type="checkbox" className="w-6 h-6 text-indigo-600 rounded-lg border-slate-300" />
                                <div className="text-right">
                                  <p className="text-xs font-black text-slate-800 leading-none mb-1">{field.labelAr}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">{field.labelEn}</p>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <label className="text-xs font-black text-slate-800 flex justify-between px-1">
                                  <span>{field.labelAr}</span>
                                  <span className="text-slate-400 font-bold uppercase tracking-tighter">{field.labelEn}</span>
                                </label>
                                <input 
                                  type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                                  className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-100 rounded-3xl text-sm font-bold focus:border-indigo-600 focus:ring-0 transition-all outline-none" 
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="editor"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6 pb-32"
                    >
                      {activeSchema.fields.map((field, index) => (
                        <div 
                          key={field.id}
                          className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:border-indigo-300 transition-all group relative"
                        >
                          <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleMoveField(index, 'up')} className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 shadow-sm"><ChevronUp size={14}/></button>
                            <button onClick={() => handleMoveField(index, 'down')} className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 shadow-sm"><ChevronDown size={14}/></button>
                          </div>

                          <div className="flex items-start gap-6">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                              {FIELD_TYPES.find(t => t.id === field.type)?.icon({ size: 24 }) || <FileCode size={24} />}
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase px-1">Label (Arabic)</label>
                                <input 
                                  type="text" 
                                  value={field.labelAr}
                                  onChange={(e) => handleUpdateField(field.id, { labelAr: e.target.value })}
                                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase px-1">Label (English)</label>
                                <input 
                                  type="text" 
                                  value={field.labelEn}
                                  onChange={(e) => handleUpdateField(field.id, { labelEn: e.target.value })}
                                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                                />
                              </div>
                              <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="checkbox" 
                                    checked={field.required}
                                    onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })}
                                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded"
                                  />
                                  <span className="text-[10px] font-black text-slate-600 uppercase">Required</span>
                                </div>
                                <div className="flex-1">
                                  <select 
                                    value={field.width}
                                    onChange={(e) => handleUpdateField(field.id, { width: e.target.value as any })}
                                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase"
                                  >
                                    <option value="full">Full Width</option>
                                    <option value="half">Half Width</option>
                                    <option value="third">One Third</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            <button 
                              onClick={() => handleRemoveField(field.id)}
                              className="p-3 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      ))}

                      {activeSchema.fields.length === 0 && (
                        <div className="text-center py-20 border-4 border-dashed border-slate-200 rounded-[60px]">
                          <Move className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                          <h4 className="text-xl font-black text-slate-300 uppercase tracking-widest">
                            Drag or click elements to start building
                          </h4>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
