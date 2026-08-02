import React, { useState } from "react";
import { RegistrationField } from "../data/defaultRegistrationFields";
import { Sliders, Plus, Trash2, Edit2, Check, X, ToggleLeft, ToggleRight, Settings, Info, ListPlus } from "lucide-react";

interface Props {
  language: "ar" | "en";
  registrationFields: RegistrationField[];
  onSave: (fields: RegistrationField[]) => void;
}

export function RegistrationFieldsManager({ language, registrationFields, onSave }: Props) {
  const isAr = language === "ar";
  const [fields, setFields] = useState<RegistrationField[]>(registrationFields);
  const [activeTab, setActiveTab] = useState<RegistrationField["section"]>("personal");
  const [editingFieldOptionsKey, setEditingFieldOptionsKey] = useState<string | null>(null);
  const [newOptionVal, setNewOptionVal] = useState("");
  
  // Custom field modal / form state
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [customFieldKey, setCustomFieldKey] = useState("");
  const [customFieldLabelAr, setCustomFieldLabelAr] = useState("");
  const [customFieldLabelEn, setCustomFieldLabelEn] = useState("");
  const [customFieldType, setCustomFieldType] = useState<RegistrationField["type"]>("text");
  const [customFieldRequired, setCustomFieldRequired] = useState(false);
  const [customFieldSection, setCustomFieldSection] = useState<RegistrationField["section"]>("custom");
  const [customFieldOptions, setCustomFieldOptions] = useState<string[]>([]);
  const [newCustomOptionInput, setNewCustomOptionInput] = useState("");

  const handleToggleRequired = (key: string) => {
    const updated = fields.map(f => {
      if (f.key === key) {
        return { ...f, required: !f.required };
      }
      return f;
    });
    setFields(updated);
    onSave(updated);
  };

  const handleToggleEnabled = (key: string) => {
    // Some fields like mrn, name, DOB shouldn't be disabled to keep basic patient records sane
    const coreKeys = ["mrn", "enName1", "enName2", "enName3", "enName4", "arName1", "arName2", "arName3", "arName4", "sex", "dob"];
    if (coreKeys.includes(key)) {
      return;
    }
    const updated = fields.map(f => {
      if (f.key === key) {
        return { ...f, enabled: !f.enabled };
      }
      return f;
    });
    setFields(updated);
    onSave(updated);
  };

  const handleLabelChange = (key: string, fieldType: "ar" | "en", value: string) => {
    const updated = fields.map(f => {
      if (f.key === key) {
        return fieldType === "ar" ? { ...f, labelAr: value } : { ...f, labelEn: value };
      }
      return f;
    });
    setFields(updated);
    onSave(updated);
  };

  const handleAddOption = (fieldKey: string) => {
    if (!newOptionVal.trim()) return;
    const updated = fields.map(f => {
      if (f.key === fieldKey) {
        const options = f.options ? [...f.options] : [];
        if (!options.includes(newOptionVal.trim())) {
          options.push(newOptionVal.trim());
        }
        return { ...f, options };
      }
      return f;
    });
    setFields(updated);
    onSave(updated);
    setNewOptionVal("");
  };

  const handleRemoveOption = (fieldKey: string, optionToRemove: string) => {
    const updated = fields.map(f => {
      if (f.key === fieldKey) {
        const options = (f.options || []).filter(o => o !== optionToRemove);
        return { ...f, options };
      }
      return f;
    });
    setFields(updated);
    onSave(updated);
  };

  const handleCreateCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFieldKey.trim() || !customFieldLabelAr.trim() || !customFieldLabelEn.trim()) {
      return;
    }

    const normalizedKey = "custom_" + customFieldKey.trim().toLowerCase().replace(/\s+/g, "_");
    
    // Check duplication
    if (fields.some(f => f.key === normalizedKey)) {
      alert(isAr ? "رمز الحقل موجود بالفعل!" : "Field key already exists!");
      return;
    }

    const newField: RegistrationField = {
      key: normalizedKey,
      labelAr: customFieldLabelAr.trim(),
      labelEn: customFieldLabelEn.trim(),
      type: customFieldType,
      required: customFieldRequired,
      enabled: true,
      colSpan: 1,
      section: customFieldSection,
      options: customFieldType === "select" ? customFieldOptions : undefined
    };

    const updated = [...fields, newField];
    setFields(updated);
    onSave(updated);

    // Reset Form
    setShowAddCustomModal(false);
    setCustomFieldKey("");
    setCustomFieldLabelAr("");
    setCustomFieldLabelEn("");
    setCustomFieldType("text");
    setCustomFieldRequired(false);
    setCustomFieldSection("custom");
    setCustomFieldOptions([]);
    setNewCustomOptionInput("");
  };

  const handleAddCustomOptionTemp = () => {
    if (!newCustomOptionInput.trim()) return;
    if (!customFieldOptions.includes(newCustomOptionInput.trim())) {
      setCustomFieldOptions([...customFieldOptions, newCustomOptionInput.trim()]);
    }
    setNewCustomOptionInput("");
  };

  const handleRemoveCustomOptionTemp = (opt: string) => {
    setCustomFieldOptions(customFieldOptions.filter(o => o !== opt));
  };

  const handleDeleteField = (key: string) => {
    if (!key.startsWith("custom_")) {
      alert(isAr ? "لا يمكن حذف الحقول الأساسية للنظام، يمكنك فقط تعطيلها." : "You cannot delete system core fields, you can only disable them.");
      return;
    }
    if (confirm(isAr ? "هل أنت متأكد من حذف هذا الحقل المخصص نهائياً؟" : "Are you sure you want to permanently delete this custom field?")) {
      const updated = fields.filter(f => f.key !== key);
      setFields(updated);
      onSave(updated);
      if (editingFieldOptionsKey === key) {
        setEditingFieldOptionsKey(null);
      }
    }
  };

  const sections: { key: RegistrationField["section"]; labelAr: string; labelEn: string; icon: string }[] = [
    { key: "personal", labelAr: "بيانات شخصية", labelEn: "Personal Details", icon: "👤" },
    { key: "contact", labelAr: "الاتصال والعنوان", labelEn: "Contact & Address", icon: "📞" },
    { key: "relative", labelAr: "بيانات القريب", labelEn: "Relative Contacts", icon: "👥" },
    { key: "payment", labelAr: "الجهات والتمويل", labelEn: "Payer & Insurance", icon: "💳" },
    { key: "other", labelAr: "تصنيفات أخرى", labelEn: "Other Attributes", icon: "⚙️" },
    { key: "custom", labelAr: "الحقول المخصصة", labelEn: "Custom Fields", icon: "✨" }
  ];

  const filteredFields = fields.filter(f => f.section === activeTab);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-right" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
        <div>
          <h3 className="text-base font-black text-slate-950 flex items-center gap-2 justify-start">
            <span className="p-1.5 bg-pink-50 text-pink-600 rounded-lg">
              <Sliders className="h-5 w-5" />
            </span>
            <span>{isAr ? "🏥 محرك تخصيص حقول استمارة المرضى (HIS Dynamic Registration Engine)" : "🏥 HIS Dynamic Registration Fields Builder"}</span>
          </h3>
          <p className="text-[11px] text-slate-500 font-bold mt-1">
            {isAr 
              ? "تحكم بالكامل في الحقول المتاحة، عدّل المسميات، أضف خيارات القوائم المنسدلة للجهات والمحافظات، أو أنشئ حقولاً مخصصة تظهر تلقائياً في شاشة تسجيل المريض." 
              : "Full control over registration fields. Edit labels, manage dropdown values, or generate custom fields that automatically bind to the Patient Registration view."}
          </p>
        </div>
        <button
          onClick={() => setShowAddCustomModal(true)}
          className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 self-start md:self-center shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? "إضافة حقل مخصص جديد" : "Add New Custom Field"}</span>
        </button>
      </div>

      {/* Tabs / Sections */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-2">
        {sections.map(sec => (
          <button
            key={sec.key}
            onClick={() => {
              setActiveTab(sec.key);
              setEditingFieldOptionsKey(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === sec.key 
                ? "bg-slate-900 text-white" 
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>{sec.icon}</span>
            <span>{isAr ? sec.labelAr : sec.labelEn}</span>
          </button>
        ))}
      </div>

      {/* Fields List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main List */}
        <div className={`${editingFieldOptionsKey ? "lg:col-span-8" : "lg:col-span-12"} space-y-3`}>
          {filteredFields.length === 0 ? (
            <div className="p-8 text-center text-slate-400 border border-dashed rounded-xl bg-slate-50 text-xs font-bold">
              {isAr ? "لا توجد حقول معرفة في هذا القسم حالياً." : "No fields defined in this section yet."}
            </div>
          ) : (
            <div className="border border-slate-150 rounded-xl overflow-hidden bg-slate-50/50 shadow-sm">
              <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="p-3 text-start">{isAr ? "اسم الحقل التقني" : "Technical Key"}</th>
                    <th className="p-3">{isAr ? "التسمية (عربي / إنجليزي)" : "Label (AR / EN)"}</th>
                    <th className="p-3 text-center">{isAr ? "النوع" : "Type"}</th>
                    <th className="p-3 text-center">{isAr ? "مطلوب" : "Required"}</th>
                    <th className="p-3 text-center">{isAr ? "مفعّل" : "Enabled"}</th>
                    <th className="p-3 text-center">{isAr ? "الخيارات" : "Options"}</th>
                    <th className="p-3 text-center">{isAr ? "إجراء" : "Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {filteredFields.map(field => {
                    const isCore = !field.key.startsWith("custom_");
                    return (
                      <tr key={field.key} className="bg-white hover:bg-slate-50/80 transition">
                        {/* Key */}
                        <td className="p-3 text-start font-mono text-[10px] text-slate-500 font-bold">
                          {field.key}
                          {!isCore && <span className="mr-1 text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-sans">{isAr ? "مخصص" : "Custom"}</span>}
                        </td>
                        
                        {/* Labels (Editable Inputs) */}
                        <td className="p-3 space-y-1.5 max-w-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-bold text-slate-400 font-mono">AR:</span>
                            <input
                              type="text"
                              value={field.labelAr}
                              onChange={(e) => handleLabelChange(field.key, "ar", e.target.value)}
                              className="bg-transparent border-b border-transparent hover:border-slate-300 focus:border-pink-500 px-1 py-0.5 w-full font-bold outline-none text-slate-800"
                            />
                          </div>
                          <div className="flex items-center gap-1.5" dir="ltr">
                            <span className="text-[9px] font-bold text-slate-400 font-mono">EN:</span>
                            <input
                              type="text"
                              value={field.labelEn}
                              onChange={(e) => handleLabelChange(field.key, "en", e.target.value)}
                              className="bg-transparent border-b border-transparent hover:border-slate-300 focus:border-pink-500 px-1 py-0.5 w-full font-bold font-mono outline-none text-slate-800 text-xs"
                            />
                          </div>
                        </td>

                        {/* Type */}
                        <td className="p-3 text-center">
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold font-mono">
                            {field.type.toUpperCase()}
                          </span>
                        </td>

                        {/* Required toggle */}
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleToggleRequired(field.key)}
                            className={`p-1 rounded-lg transition ${field.required ? "text-pink-600 bg-pink-50 hover:bg-pink-100" : "text-slate-400 hover:text-slate-600"}`}
                            title={isAr ? "تعديل حالة الإلزام" : "Toggle mandatory status"}
                          >
                            {field.required ? (
                              <span className="text-xs font-black">★ {isAr ? "إجباري" : "Required"}</span>
                            ) : (
                              <span className="text-xs font-semibold">{isAr ? "اختياري" : "Optional"}</span>
                            )}
                          </button>
                        </td>

                        {/* Enabled toggle */}
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleToggleEnabled(field.key)}
                            disabled={["mrn", "enName1", "enName2", "enName3", "enName4", "arName1", "arName2", "arName3", "arName4", "sex", "dob"].includes(field.key)}
                            className={`px-2 py-1 rounded text-[10px] font-bold transition disabled:opacity-40 ${
                              field.enabled 
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                : "bg-slate-100 text-slate-400 border border-slate-200"
                            }`}
                          >
                            {field.enabled ? (isAr ? "نشط" : "Active") : (isAr ? "معطل" : "Disabled")}
                          </button>
                        </td>

                        {/* Options trigger */}
                        <td className="p-3 text-center">
                          {field.type === "select" ? (
                            <button
                              onClick={() => setEditingFieldOptionsKey(field.key)}
                              className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition ${
                                editingFieldOptionsKey === field.key 
                                  ? "bg-slate-900 text-white border-slate-900" 
                                  : "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100"
                              }`}
                            >
                              {isAr ? `إدارة (${field.options?.length || 0} خياراً)` : `Manage (${field.options?.length || 0} opts)`}
                            </button>
                          ) : (
                            <span className="text-slate-400 font-mono">-</span>
                          )}
                        </td>

                        {/* Delete custom field action */}
                        <td className="p-3 text-center">
                          {!isCore ? (
                            <button
                              onClick={() => handleDeleteField(field.key)}
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                              title={isAr ? "حذف الحقل بالكامل" : "Delete field"}
                            >
                              <Trash2 className="w-4 h-4 mx-auto" />
                            </button>
                          ) : (
                            <span className="text-slate-300 font-bold">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
</div>
            </div>
          )}
        </div>

        {/* Options Management Panel */}
        {editingFieldOptionsKey && (() => {
          const field = fields.find(f => f.key === editingFieldOptionsKey);
          if (!field) return null;
          return (
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm animate-fadeIn text-right">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <button
                  onClick={() => setEditingFieldOptionsKey(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
                <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <span>خيارات الحقل: {isAr ? field.labelAr : field.labelEn}</span>
                  <Settings className="w-4 h-4 text-pink-600" />
                </h4>
              </div>

              {/* Add option */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500">
                  {isAr ? "إضافة خيار جديد إلى القائمة:" : "Add choice option to dropdown:"}
                </label>
                <div className="flex gap-2 min-w-max">
                  <input
                    type="text"
                    value={newOptionVal}
                    onChange={(e) => setNewOptionVal(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddOption(field.key)}
                    className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 font-bold text-xs"
                    placeholder={isAr ? "اسم الخيار (مثال: مستشفى عام)" : "e.g. Inpatient"}
                  />
                  <button
                    onClick={() => handleAddOption(field.key)}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-3 rounded-lg text-xs font-bold"
                  >
                    {isAr ? "إضافة" : "Add"}
                  </button>
                </div>
              </div>

              {/* Options list */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500">
                  {isAr ? "الخيارات المتاحة حالياً:" : "Current active options:"}
                </label>
                <div className="border border-slate-200 rounded-xl bg-white max-h-60 overflow-y-auto divide-y divide-slate-100">
                  {(field.options || []).length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-[10px] font-bold">
                      {isAr ? "لا توجد خيارات معرّفة حالياً (تظهر كمدخل حر)" : "No choices defined."}
                    </div>
                  ) : (
                    (field.options || []).map((opt) => (
                      <div key={opt} className="flex justify-between items-center p-2.5 hover:bg-slate-50 transition">
                        <button
                          onClick={() => handleRemoveOption(field.key, opt)}
                          className="text-red-500 hover:text-red-700 p-1 rounded"
                          title={isAr ? "حذف" : "Remove"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-slate-800 text-[11px]">{opt}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-amber-50 text-amber-800 p-3 rounded-xl border border-amber-200 text-[10px] leading-relaxed">
                💡 {isAr 
                  ? "تنعكس الخيارات والأسماء المحدثة فوراً في شاشة تسجيل المرضى ونموذج الدفع والاستقبال."
                  : "Changes reflect live on the reception desk & new patient registration form."}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Add Custom Field Modal Overlay */}
      {showAddCustomModal && (
        <div className="fixed inset-0 z-modal bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-md p-6 space-y-4 animate-scaleUp text-right" dir={isAr ? "rtl" : "ltr"}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <button
                type="button"
                onClick={() => setShowAddCustomModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <span>{isAr ? "إضافة حقل مخصص جديد للاستمارة" : "Create New Custom Patient Field"}</span>
                <ListPlus className="w-5 h-5 text-pink-600" />
              </h3>
            </div>

            <form onSubmit={handleCreateCustomField} className="space-y-4">
              {/* Unique Key */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">
                  {isAr ? "رمز الحقل الفني (Technical Key) - إنجليزي بدون مسافات:" : "Technical key (lowercase, no spaces):"}
                </label>
                <div className="flex items-center" dir="ltr">
                  <span className="bg-slate-100 border border-r-0 border-slate-200 px-2.5 py-1.5 text-xs text-slate-500 rounded-l-lg font-mono">custom_</span>
                  <input
                    type="text"
                    required
                    value={customFieldKey}
                    onChange={(e) => setCustomFieldKey(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                    className="w-full bg-white border border-slate-200 rounded-r-lg py-1.5 px-3 font-mono text-xs outline-none focus:ring-1 focus:ring-pink-500"
                    placeholder="e.g. sponsor_id"
                  />
                </div>
              </div>

              {/* Labels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    {isAr ? "الاسم بالعربية:" : "Arabic Label:"}
                  </label>
                  <input
                    type="text"
                    required
                    value={customFieldLabelAr}
                    onChange={(e) => setCustomFieldLabelAr(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-xs font-bold outline-none focus:bg-white focus:ring-1 focus:ring-pink-500"
                    placeholder="رقم الكفيل"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    {isAr ? "الاسم بالإنجليزية:" : "English Label:"}
                  </label>
                  <input
                    type="text"
                    required
                    value={customFieldLabelEn}
                    onChange={(e) => setCustomFieldLabelEn(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-pink-500"
                    placeholder="Sponsor ID"
                  />
                </div>
              </div>

              {/* Section and Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    {isAr ? "القسم في الاستمارة:" : "Form Section:"}
                  </label>
                  <select
                    value={customFieldSection}
                    onChange={(e) => setCustomFieldSection(e.target.value as RegistrationField["section"])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-xs font-bold"
                  >
                    <option value="custom">{isAr ? "حقول مخصصة (إضافية)" : "Custom Fields"}</option>
                    <option value="personal">{isAr ? "بيانات شخصية" : "Personal Details"}</option>
                    <option value="contact">{isAr ? "الاتصال والعنوان" : "Contact & Address"}</option>
                    <option value="relative">{isAr ? "بيانات القريب" : "Relative Contacts"}</option>
                    <option value="payment">{isAr ? "الجهات والتمويل" : "Payer & Insurance"}</option>
                    <option value="other">{isAr ? "تصنيفات أخرى" : "Other Attributes"}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    {isAr ? "نوع المدخل:" : "Field Type:"}
                  </label>
                  <select
                    value={customFieldType}
                    onChange={(e) => {
                      setCustomFieldType(e.target.value as RegistrationField["type"]);
                      if (e.target.value !== "select") {
                        setCustomFieldOptions([]);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-xs font-bold"
                  >
                    <option value="text">{isAr ? "نص حر" : "Text"}</option>
                    <option value="number">{isAr ? "رقم" : "Number"}</option>
                    <option value="date">{isAr ? "تاريخ" : "Date"}</option>
                    <option value="select">{isAr ? "قائمة منسدلة (خيارات)" : "Dropdown (Select)"}</option>
                  </select>
                </div>
              </div>

              {/* Dropdown options setup if type === select */}
              {customFieldType === "select" && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500">
                    {isAr ? "خيارات القائمة المنسدلة:" : "Define Dropdown Options:"}
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={newCustomOptionInput}
                      onChange={(e) => setNewCustomOptionInput(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg py-1 px-2 text-xs"
                      placeholder={isAr ? "أدخل خياراً جديداً..." : "Enter option..."}
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomOptionTemp}
                      className="bg-slate-800 text-white px-2.5 py-1 text-xs rounded-lg font-bold"
                    >
                      {isAr ? "إضافة" : "Add"}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1 bg-white border border-slate-150 rounded-lg">
                    {customFieldOptions.length === 0 ? (
                      <span className="text-[9px] text-slate-400 font-bold p-1">{isAr ? "لم يتم تعريف خيارات بعد" : "No options added."}</span>
                    ) : (
                      customFieldOptions.map(opt => (
                        <span key={opt} className="inline-flex items-center gap-1 text-[9px] bg-pink-50 text-pink-700 px-2 py-0.5 rounded-full font-bold border border-pink-100">
                          <span>{opt}</span>
                          <button type="button" onClick={() => handleRemoveCustomOptionTemp(opt)} className="text-rose-600 font-bold hover:text-rose-800">×</button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Is required toggle */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <label className="text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={customFieldRequired}
                    onChange={(e) => setCustomFieldRequired(e.target.checked)}
                    className="rounded text-pink-600 focus:ring-pink-500 w-4 h-4"
                  />
                  <span>{isAr ? "جعل الحقل إجبارياً عند تسجيل المريض" : "Make this field mandatory in registration"}</span>
                </label>
              </div>

              {/* Submit / Cancel */}
              <div className="flex justify-start gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  {isAr ? "إنشاء الحقل" : "Create Field"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
