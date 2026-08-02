import React, { useState } from "react";
import { DynamicForm, FormField } from "./SmartFormBuilder";
import { Activity, AlertTriangle, FileText, Check, Shield, Stethoscope, Save } from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
  template: DynamicForm;
  departmentContext?: "ER" | "OR" | "ICU" | "WARD" | "CLINIC";
  onSubmit?: (data: any) => void;
}

export default function DynamicFormRenderer({ language, template, departmentContext = "WARD", onSubmit }: Props) {
  const isAr = language === "ar";
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
    toast.success(isAr ? "تم حفظ النموذج بنجاح" : "Form saved successfully");
  };

  const checkConditional = (field: FormField) => {
    if (!field.conditional) return true;
    const { fieldId, operator, value } = field.conditional;
    const currentVal = formData[fieldId];
    if (operator === "==") return currentVal === value;
    if (operator === "!=") return currentVal !== value;
    return true;
  };

  // Theme based on department context
  const getTheme = () => {
    switch (departmentContext) {
      case "ER":
        return {
          bg: "bg-rose-50",
          card: "bg-white border-rose-200",
          header: "bg-rose-600 text-white",
          accent: "text-rose-600",
          button: "bg-rose-600 hover:bg-rose-700 text-white",
          inputFocus: "focus:ring-rose-500",
          icon: <AlertTriangle className="w-6 h-6 text-rose-100" />
        };
      case "OR":
        return {
          bg: "bg-emerald-50",
          card: "bg-white border-emerald-200",
          header: "bg-emerald-600 text-white",
          accent: "text-emerald-600",
          button: "bg-emerald-600 hover:bg-emerald-700 text-white",
          inputFocus: "focus:ring-emerald-500",
          icon: <Shield className="w-6 h-6 text-emerald-100" />
        };
      case "ICU":
        return {
          bg: "bg-sky-50",
          card: "bg-white border-sky-200",
          header: "bg-sky-600 text-white",
          accent: "text-sky-600",
          button: "bg-sky-600 hover:bg-sky-700 text-white",
          inputFocus: "focus:ring-sky-500",
          icon: <Activity className="w-6 h-6 text-sky-100" />
        };
      default:
        return {
          bg: "bg-slate-50",
          card: "bg-white border-slate-200",
          header: "bg-slate-800 text-white",
          accent: "text-slate-800",
          button: "bg-indigo-600 hover:bg-indigo-700 text-white",
          inputFocus: "focus:ring-indigo-500",
          icon: <FileText className="w-6 h-6 text-slate-300" />
        };
    }
  };

  const theme = getTheme();

  const renderField = (field: FormField) => {
    if (!checkConditional(field)) return null;

    const value = formData[field.id] || "";

    const label = isAr ? field.labelAr : field.labelEn;
    const placeholder = isAr ? field.placeholderAr : field.placeholderEn;

    return (
      <div key={field.id} className="space-y-2">
        <label className="text-sm font-bold text-slate-700">
          {label} {field.required && <span className="text-rose-500">*</span>}
        </label>
        
        {field.type === "text" && (
          <input 
            type="text" 
            placeholder={placeholder}
            required={field.required}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 ${theme.inputFocus} outline-none transition-all`}
          />
        )}

        {field.type === "number" && (
          <input 
            type="number" 
            placeholder={placeholder}
            required={field.required}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 ${theme.inputFocus} outline-none transition-all`}
          />
        )}

        {field.type === "textarea" && (
          <textarea 
            placeholder={placeholder}
            required={field.required}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            rows={4}
            className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 ${theme.inputFocus} outline-none transition-all resize-none`}
          />
        )}

        {field.type === "select" && (
          <select 
            required={field.required}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 ${theme.inputFocus} outline-none transition-all`}
          >
            <option value="">{isAr ? "اختر..." : "Select..."}</option>
            {field.options?.map((opt, i) => (
              <option key={i} value={opt.value}>
                {isAr ? opt.labelAr : opt.labelEn}
              </option>
            ))}
          </select>
        )}

        {field.type === "checkbox" && (
          <label className="flex flex-wrap items-center gap-2 sm:gap-3 cursor-pointer p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
            <input 
              type="checkbox"
              required={field.required}
              checked={!!value}
              onChange={(e) => handleInputChange(field.id, e.target.checked)}
              className={`w-5 h-5 rounded border-slate-300 ${theme.accent} focus:ring-offset-0`}
            />
            <span className="text-sm font-semibold text-slate-700">{label}</span>
          </label>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-full font-sans p-4 md:p-6 ${theme.bg}`} dir={isAr ? "rtl" : "ltr"}>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        
        {/* Department Form Header */}
        <div className={`${theme.header} p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden flex items-center justify-between`}>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
              {theme.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold tracking-widest uppercase">
                  {departmentContext} FORM
                </span>
                <span className="px-3 py-1 bg-black/20 backdrop-blur-sm rounded-full text-xs font-bold">
                  {template.id}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                {isAr ? template.titleAr : template.titleEn}
              </h1>
            </div>
          </div>
        </div>

        {/* Form Sections */}
        <div className="space-y-6">
          {template.sections.map((section, idx) => (
            <div key={section.id} className={`rounded-3xl shadow-sm border ${theme.card} overflow-hidden`}>
              <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 sm:gap-4 flex-wrap ">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${theme.header} bg-opacity-10 text-slate-700`}>
                  {idx + 1}
                </div>
                <h2 className="text-lg font-black text-slate-800">
                  {isAr ? section.titleAr : section.titleEn}
                </h2>
              </div>
              <div className="p-4 md:p-6">
                <div className={departmentContext === "OR" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "grid grid-cols-1 md:grid-cols-2 gap-6"}>
                  {section.fields.map(field => renderField(field))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            className={`px-8 py-4 ${theme.button} rounded-2xl font-black text-sm shadow-xl flex items-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98]`}
          >
            <Save className="w-5 h-5" />
            {isAr ? "حفظ وتوثيق النموذج" : "Save & Document Form"}
          </button>
        </div>
      </form>
    </div>
  );
}
