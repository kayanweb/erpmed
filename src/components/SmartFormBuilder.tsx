import React, { useState } from "react";
import { 
  FormInput, 
  Settings, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Save,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

export interface FormField {
  id: string;
  type: "text" | "number" | "select" | "date" | "checkbox" | "textarea";
  labelAr: string;
  labelEn: string;
  placeholderAr?: string;
  placeholderEn?: string;
  options?: { value: string; labelAr: string; labelEn: string }[];
  required?: boolean;
  conditional?: {
    fieldId: string;
    operator: "==" | "!=";
    value: any;
  };
}

export interface FormSection {
  id: string;
  titleAr: string;
  titleEn: string;
  fields: FormField[];
}

export interface DynamicForm {
  id: string;
  titleAr: string;
  titleEn: string;
  module: string;
  sections: FormSection[];
}

interface Props {
  language: "ar" | "en";
  onSave?: (form: DynamicForm) => void;
}

export const SmartFormBuilder: React.FC<Props> = ({ language, onSave }) => {
  const isAr = language === "ar";
  const [form, setForm] = useState<DynamicForm>({
    id: `FORM-${Date.now()}`,
    titleAr: "نموذج جديد",
    titleEn: "New Dynamic Form",
    module: "CLINICAL",
    sections: []
  });

  const addSection = () => {
    const newSection: FormSection = {
      id: `SEC-${Date.now()}`,
      titleAr: "قسم جديد",
      titleEn: "New Section",
      fields: []
    };
    setForm({ ...form, sections: [...form.sections, newSection] });
  };

  const addField = (sectionId: string) => {
    const newField: FormField = {
      id: `FLD-${Date.now()}`,
      type: "text",
      labelAr: "حقل جديد",
      labelEn: "New Field",
      required: false
    };
    const updatedSections = form.sections.map(s => 
      s.id === sectionId ? { ...s, fields: [...s.fields, newField] } : s
    );
    setForm({ ...form, sections: updatedSections });
  };

  const updateField = (sectionId: string, fieldId: string, updates: Partial<FormField>) => {
    const updatedSections = form.sections.map(s => 
      s.id === sectionId ? {
        ...s,
        fields: s.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f)
      } : s
    );
    setForm({ ...form, sections: updatedSections });
  };

  const removeField = (sectionId: string, fieldId: string) => {
    const updatedSections = form.sections.map(s => 
      s.id === sectionId ? {
        ...s,
        fields: s.fields.filter(f => f.id !== fieldId)
      } : s
    );
    setForm({ ...form, sections: updatedSections });
  };

  const handleSave = () => {
    if (onSave) onSave(form);
    toast.success(isAr ? "تم حفظ النموذج بنجاح" : "Form template saved successfully");
  };

  return (
    <div className="p-6 bg-slate-50 min-h-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
            <FormInput className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight">
              {isAr ? "منشئ النماذج السريرية" : "Clinical Form Builder"}
            </h2>
            <p className="text-slate-500 font-medium">
              {isAr ? "تصميم نماذج طبية ديناميكية وسير العمل" : "Design dynamic medical forms and workflows"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button className="px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Config
          </button>
          <button 
            onClick={handleSave}
            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Template
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Form Meta */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Plus className="w-3.5 h-3.5" />
              Form Metadata
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Form Title (En)</label>
                <input 
                  type="text" 
                  value={form.titleEn}
                  onChange={(e) => setForm({...form, titleEn: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
              <div className="space-y-1 text-right">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">عنوان النموذج (Ar)</label>
                <input 
                  type="text" 
                  value={form.titleAr}
                  onChange={(e) => setForm({...form, titleAr: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none text-right" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Module</label>
                <select 
                  value={form.module}
                  onChange={(e) => setForm({...form, module: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="CLINICAL">Clinical Documentation</option>
                  <option value="NURSING">Nursing Assessment</option>
                  <option value="ICU">ICU Flowsheet</option>
                  <option value="OR">Operating Room</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-indigo-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
             <div className="relative z-10 space-y-4">
                <h4 className="font-black text-indigo-300 text-[10px] uppercase tracking-widest">Rules & Validation</h4>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                     <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                     <div>
                       <p className="text-[10px] font-black uppercase tracking-tight">Age Constraint</p>
                       <p className="text-[9px] text-indigo-200/70">Show only if age &lt; 18</p>
                     </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                     <AlertCircle className="w-5 h-5 text-amber-400" />
                     <div>
                       <p className="text-[10px] font-black uppercase tracking-tight">Mandatory Review</p>
                       <p className="text-[9px] text-indigo-200/70">Requires Head Nurse approval</p>
                     </div>
                  </div>
                </div>
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                  Manage Business Rules
                </button>
             </div>
          </div>
        </div>

        {/* Builder Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
              <ChevronDown className="w-4 h-4" />
              Sections Structure
            </h3>
            <button 
              onClick={addSection}
              className="text-[10px] font-black bg-indigo-600 text-white px-4 py-2 rounded-xl uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Add Section
            </button>
          </div>

          <div className="space-y-6">
            {form.sections.map((section, sIdx) => (
              <div key={section.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <div className="bg-slate-50/50 p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-4 flex-wrap  flex-1">
                       <span className="w-6 h-6 bg-slate-200 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-500">{sIdx + 1}</span>
                       <input 
                         type="text" 
                         value={section.titleEn}
                         onChange={(e) => {
                           const updated = form.sections.map(s => s.id === section.id ? { ...s, titleEn: e.target.value } : s);
                           setForm({ ...form, sections: updated });
                         }}
                         placeholder="Section Title (En)"
                         className="bg-transparent border-none p-0 text-sm font-black text-slate-800 focus:ring-0 w-full"
                       />
                       <input 
                         type="text" 
                         value={section.titleAr}
                         onChange={(e) => {
                           const updated = form.sections.map(s => s.id === section.id ? { ...s, titleAr: e.target.value } : s);
                           setForm({ ...form, sections: updated });
                         }}
                         placeholder="عنوان القسم (Ar)"
                         className="bg-transparent border-none p-0 text-sm font-black text-slate-800 focus:ring-0 w-full text-right"
                       />
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                       <button className="p-2 text-slate-400 hover:text-slate-600"><ChevronUp className="w-4 h-4"/></button>
                       <button className="p-2 text-rose-400 hover:text-rose-600"><Trash2 className="w-4 h-4"/></button>
                    </div>
                 </div>

                 <div className="p-6 space-y-4">
                    {section.fields.map((field) => (
                      <div key={field.id} className="p-4 bg-slate-50/30 border border-slate-150 rounded-2xl flex flex-col md:flex-row gap-4 items-start">
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 w-full">
                            <div className="space-y-1">
                               <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Field Type</label>
                               <select 
                                 value={field.type}
                                 onChange={(e) => updateField(section.id, field.id, { type: e.target.value as any })}
                                 className="w-full bg-white border border-slate-100 p-2 rounded-lg text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                               >
                                 <option value="text">Text Input</option>
                                 <option value="number">Number</option>
                                 <option value="select">Dropdown</option>
                                 <option value="date">Date Picker</option>
                                 <option value="textarea">Text Area</option>
                               </select>
                            </div>
                            <div className="space-y-1">
                               <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Label (En)</label>
                               <input 
                                 type="text" 
                                 value={field.labelEn}
                                 onChange={(e) => updateField(section.id, field.id, { labelEn: e.target.value })}
                                 className="w-full bg-white border border-slate-100 p-2 rounded-lg text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                               />
                            </div>
                            <div className="space-y-1 text-right">
                               <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">العنوان (Ar)</label>
                               <input 
                                 type="text" 
                                 value={field.labelAr}
                                 onChange={(e) => updateField(section.id, field.id, { labelAr: e.target.value })}
                                 className="w-full bg-white border border-slate-100 p-2 rounded-lg text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none text-right"
                               />
                            </div>
                            <div className="flex items-center justify-center h-full pt-4">
                               <label className="flex items-center gap-2 cursor-pointer group">
                                  <input 
                                    type="checkbox" 
                                    checked={field.required}
                                    onChange={(e) => updateField(section.id, field.id, { required: e.target.checked })}
                                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                                  />
                                  <span className="text-[10px] font-black text-slate-500 group-hover:text-indigo-600 transition-colors uppercase tracking-widest">Required</span>
                               </label>
                            </div>
                         </div>
                         <button 
                           onClick={() => removeField(section.id, field.id)}
                           className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-all self-center"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                    ))}

                    <button 
                      onClick={() => addField(section.id)}
                      className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Add Field to Section</span>
                    </button>
                 </div>
              </div>
            ))}
            
            {form.sections.length === 0 && (
              <div className="py-20 text-center space-y-4 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                 <FormInput className="w-12 h-12 text-slate-200 mx-auto" />
                 <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No sections added yet</p>
                 <button 
                   onClick={addSection}
                   className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all"
                 >
                   Create First Section
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
