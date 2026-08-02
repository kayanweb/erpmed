
import React, { useState } from "react";
import { FileText, Printer, ListPlus, Pencil, Trash2, ArrowLeftRight, Radio, Info, ShieldCheck, HeartPulse, Layers, Search } from "lucide-react";
import { DynamicProfessionalLogo } from "./DynamicProfessionalLogo";
// Import icons that might be used
import { FileSpreadsheet, AlertTriangle, AlertCircle, RefreshCw, X, Play, Clock, CheckCircle2, ChevronDown, Check, User, Calendar } from "lucide-react";
import { generatePDF } from "../lib/pdfGenerator";
import { CLINICAL_SHIFTS } from "../lib/constants";
import GenericActionModal from "./GenericActionModal";

interface FormEditorProps {
  language: "en" | "ar";
  currentUser: any;
  hospitalSettings: any;
  notifications: any[];
  setNotifications?: (n: any[]) => void;
  records: any[];
  setRecords: (r: any[]) => void;
  allAvailableTemplates: any[];
  selectedTemplate: any;
  setSelectedTemplate: (t: any) => void;
  editingRecord: any;
  setEditingRecord: (r: any) => void;
  handleCreateNew: (id: string) => void;
  handleSave: (e: React.FormEvent) => void;
  handleDelete: (id: string) => void;
  saveSetting?: (k: string, v: any) => void;
  templateSearchQuery?: string;
  setTemplateSearchQuery?: (s: string) => void;
  departments?: string[];
  selectedDepartmentFilter?: string;
  setSelectedDepartmentFilter?: (s: string) => void;
  selectedYearFilter?: string;
  setSelectedYearFilter?: (s: string) => void;
  filteredTemplates?: any[];
}

export default function FormEditor({
  language,
  currentUser,
  hospitalSettings,
  notifications,
  setNotifications,
  records,
  setRecords,
  allAvailableTemplates,
  selectedTemplate,
  setSelectedTemplate,
  editingRecord,
  setEditingRecord,
  handleCreateNew,
  handleSave,
  handleDelete,
  saveSetting,
  templateSearchQuery,
  setTemplateSearchQuery,
  departments,
  selectedDepartmentFilter,
  setSelectedDepartmentFilter,
  selectedYearFilter,
  setSelectedYearFilter,
  filteredTemplates
}: FormEditorProps) {
  const [dayFocus, setDayFocus] = useState<any>("all");
  const [numDays, setNumDays] = useState<number>(31);
  const [ledgerViewMode, setLedgerViewMode] = useState<string>("compact");
  const [rowForm, setRowForm] = useState<any>({});
  const [rowEditIndex, setRowEditIndex] = useState<number>(-1);
  const [selectedShift, setSelectedShift] = useState<string>("");

  const handleBulkFillDay = (dayKey: string) => {};
  const handleCellToggle = (rowIndex: number, dayKey: string) => {};
  const handleStartEditRow = (idx: number, item: any) => {};
  const handleDeleteRow = (idx: number) => {};
  const handleSaveRowForm = () => {};
  const handleCancelRowEdit = () => {};
  const handlePrint = () => { window.print() };

  
              const userDept = (currentUser?.department || "")
                .toUpperCase()
                .trim();
              const activeDirectives = (notifications || []).filter(
                (n) =>
                  !n.read &&
                  n.type === "directive" &&
                  (n.targetDepartment === "ALL" ||
                    (n.targetDepartment &&
                      userDept?.includes(
                        n.targetDepartment.toUpperCase().trim(),
                      ))),
              );

              return (
                <div className="space-y-4">
                  {/* DYNAMIC LANDSCAPE AND ZOOM SETTINGS FOR CHECKLIST PRINT ACTION */}
                  <style>{`
                  @media print {
                    @page {
                      size: A4 landscape !important;
                      margin: 0 !important; /* Zero margin for absolute edge alignment */
                    }
                    html, body {
                      width: 100% !important;
                      height: 100% !important;
                      margin: 0 !important;
                      padding: 0.3cm 0.4cm !important;
                      zoom: 61% !important; /* Ideal zoom to fit 31-day logs cleanly on A4 Landscape Page */
                    }
                  }
                `}</style>
                  {(activeDirectives || []).length > 0 && (
                    <div className="no-print bg-gradient-to-l from-rose-500 via-rose-600 to-pink-600 text-white rounded-xl p-4 shadow-md border border-rose-400/40 relative overflow-hidden">
                      <div className="absolute top-0 bottom-0 left-0 w-1/4 bg-radial-gradient from-white/10 to-transparent pointer-events-none" />
                      <div
                        className="flex flex-col sm:flex-row items-center justify-between gap-3 text-right animate-pulse-slow font-sans"
                        dir="rtl"
                      >
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <div className="bg-white/15 p-2 rounded-lg shrink-0">
                            <Radio className="h-5 w-5 text-white animate-pulse" />
                          </div>
                          <div className="text-right">
                            <span className="bg-white text-rose-700 font-extrabold text-[9px] px-1.5 py-0.5 rounded-full uppercase font-sans">
                              {language === "ar"
                                ? "📡 توجيه إداري وقائي عاجل"
                                : "📡 High Priority Quality Notice"}
                            </span>
                            <p className="text-xs font-black mt-1 leading-relaxed">
                              {language === "ar"
                                ? activeDirectives[0].messageAr
                                : activeDirectives[0].messageEn}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const directiveId = activeDirectives[0].id;
                            const updated = (notifications || []).map((n) =>
                              n.id === directiveId ? { ...n, read: true } : n,
                            );
                            setNotifications(updated);
                            saveSetting("baheya_notifications", updated);
                          }}
                          className="px-4 py-1.5 bg-white hover:bg-slate-50 text-rose-700 font-black text-xs rounded-lg transition shadow shrink-0 cursor-pointer"
                        >
                          {language === "ar"
                            ? "علم وألتزم بالتعليمات ✓"
                            : "Acknowledge & Comply ✓"}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 print:block print:w-full print:max-w-full">
                    {/* Sidebar templates selector with custom search box */}
                    <aside className="no-print lg:col-span-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                      <div>
                        <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1 font-sans">
                          <Layers className="h-4 w-4 text-pink-600" />
                          {language === "ar"
                            ? `نماذج الجرد (${(allAvailableTemplates || []).length} شيت كامل)`
                            : `Master Templates (${(allAvailableTemplates || []).length} Sheets)`}
                        </h3>
                        <p className="text-[10px] text-slate-500 leading-tight mt-1">
                          {language === "ar"
                            ? `استعرض وابحث بنصف الاسم أو الكود الخاص بأقسام ${hospitalSettings.nameAr || "المؤسسة"} المتكاملة:`
                            : "Filter and search through the clinical departments checklist archives:"}
                        </p>
                      </div>

                      {/* SEARCH AND FILTER COMPONENTS (مربع بحث ذكي للبلاتفورم مع فلاتر أقسام) */}
                      <div className="space-y-3">
                        <div className="relative">
                          <Search className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                          <input
                            type="text"
                            placeholder={
                              language === "ar"
                                ? "ابحث بالاسم أو كود الشيت..."
                                : "Search by sheet title or code..."
                            }
                            value={templateSearchQuery}
                            onChange={(e) =>
                              setTemplateSearchQuery(e.target.value)
                            }
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pr-8 pl-2.5 py-1.5 text-xs font-medium outline-none focus:ring-1 focus:ring-pink-500 focus:bg-white transition"
                          />
                          {templateSearchQuery && (
                            <button
                              onClick={() => setTemplateSearchQuery("")}
                              className="absolute left-2.5 top-2.5 font-bold text-slate-500 hover:text-slate-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>

                        {/* Horizontal Scrollable tabs of medical departments */}
                        <div>
                          <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-1.5">
                            {language === "ar"
                              ? "الأقسام والوحدات الرئيسية:"
                              : "Department quick filters:"}
                          </span>
                          <div className="flex gap-1 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-200">
                            {[
                              {
                                key: "ALL",
                                ar: "عام / الكل",
                                en: "General / All",
                              },
                              { key: "ER", ar: "طوارئ (ER)", en: "Emergency" },
                              {
                                key: "ICU",
                                ar: "رعاية (ICU)",
                                en: "Critical Care",
                              },
                              { key: "OR", ar: "عمليات (OR)", en: "Operating" },
                              {
                                key: "CHEMO",
                                ar: "كيماوي (Chemo)",
                                en: "Chemotherapy",
                              },
                              { key: "RAD", ar: "أشعة (Rad)", en: "Radiology" },
                              {
                                key: "PED",
                                ar: "أطفال (Ped)",
                                en: "Pediatrics",
                              },
                              {
                                key: "PHA",
                                ar: "صيدلية (Pharm)",
                                en: "Pharmacy",
                              },
                              { key: "QLTY", ar: "جودة (Qual)", en: "Quality" },
                              ...(departments || [])
                                .filter(
                                  (d) =>
                                    ![
                                      "EMERGENCY UNIT",
                                      "CHEMO UNIT PREPN",
                                      "INTENSIVE CARE UNIT (ICU)",
                                    ]?.includes(d),
                                )
                                .map((d) => ({ key: d, ar: d, en: d })),
                            ].map((item) => {
                              const isSelected =
                                selectedDepartmentFilter === item.key;
                              return (
                                <button
                                  key={item.key}
                                  onClick={() =>
                                    setSelectedDepartmentFilter(item.key)
                                  }
                                  className={`px-2 py-1 text-[9px] font-extrabold rounded-full border transition shrink-0 uppercase ${
                                    isSelected
                                      ? "bg-pink-600 border-pink-500 text-white shadow-sm"
                                      : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                                  }`}
                                >
                                  {language === "ar" ? item.ar : item.en}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Yearly Partition Filters */}
                        <div>
                          <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-1.5">
                            {language === "ar"
                              ? "منها تقسيمات سنوية (السنة المعتمدة):"
                              : "Yearly partition (Approved year):"}
                          </span>
                          <div className="flex gap-1 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-200">
                            {[
                              { key: "ALL", ar: "كل السنوات", en: "All Years" },
                              { key: "2026", ar: "سنة 2026", en: "Year 2026" },
                              { key: "2025", ar: "سنة 2025", en: "Year 2025" },
                              { key: "2024", ar: "سنة 2024", en: "Year 2024" },
                            ].map((yr) => {
                              const isSelected = selectedYearFilter === yr.key;
                              return (
                                <button
                                  key={yr.key}
                                  onClick={() => setSelectedYearFilter(yr.key)}
                                  className={`px-2 py-1 text-[9px] font-extrabold rounded border transition shrink-0 ${
                                    isSelected
                                      ? "bg-slate-800 border-slate-700 text-white shadow-sm"
                                      : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                                  }`}
                                >
                                  {language === "ar" ? yr.ar : yr.en}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Templates list scrollbox with dynamic match counters */}
                      <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[380px] p-0.5 border-t border-slate-100 pt-3">
                        <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
                          <span>
                            {language === "ar"
                              ? "السجلات المطابقة:"
                              : "Matching sheets:"}
                          </span>
                          <span className="font-extrabold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {(filteredTemplates || []).length} / 200
                          </span>
                        </div>

                        {(filteredTemplates || []).map((tpl) => {
                          const isSelected = selectedTemplate.id === tpl.id;
                          const recordCount = (records || []).filter(
                            (r) => r.templateId === tpl.id,
                          ).length;
                          return (
                            <button
                              key={tpl.id}
                              onClick={() => {
                                setSelectedTemplate(tpl);
                                handleCreateNew(tpl.id);
                              }}
                              className={`text-right w-full p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-between gap-1.5 transition ${
                                isSelected
                                  ? "bg-pink-50 border-pink-200 text-pink-700 shadow-inner"
                                  : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600"
                              }`}
                            >
                              <div className="flex flex-col items-start text-left shrink overflow-hidden">
                                <span className="font-bold truncate text-[11px] max-w-[140px] text-right">
                                  {language === "ar"
                                    ? tpl.titleAr
                                    : tpl.titleEn}
                                </span>
                                <span className="text-[9px] text-slate-500 mt-0.5 font-mono">
                                  {tpl.code}
                                </span>
                              </div>
                              {recordCount > 0 && (
                                <span className="bg-slate-200 text-slate-700 px-1 py-0.5 rounded text-[8px] font-bold shrink-0">
                                  {recordCount}
                                </span>
                              )}
                            </button>
                          );
                        })}

                        {(filteredTemplates || []).length === 0 && (
                          <div className="text-center py-8 text-xs text-slate-500">
                            {language === "ar"
                              ? "لا توجد نتائج مطابقة لبحثك."
                              : "No matching templates."}
                          </div>
                        )}
                      </div>

                      <div className="border-t border-slate-200 pt-4">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[10px]">
                          <p className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                            <Info className="h-3.5 w-3.5 text-slate-500" />
                            {language === "ar"
                              ? "كيف تقوم بتسجيل الأيام؟"
                              : "Interactive Guide:"}
                          </p>
                          <p className="text-slate-500 leading-relaxed font-sans">
                            {language === "ar"
                              ? "اضغط مباشرة على مربعات الأيام بالجدول للتبديل بين علامة متوفر (✔)، غير متوفر (✘)، أو أدخل قيمة الحرارة أوفلاين."
                              : "Click directly on days column matrix to toggle checks (✔), missing logs (✘) or type custom notes."}
                          </p>
                        </div>
                      </div>
                    </aside>

                    {editingRecord ? (
                      <div className="lg:col-span-3 space-y-6 print:block print:w-full print:max-w-full print:p-0 print:m-0">
                        {/* Action Toolbar */}
                        <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingRecord(null)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <X className="h-4 w-4" />
                              {language === "ar" ? "إغلاق" : "Close Editor"}
                            </button>
                          </div>

                          <div className="flex items-center justify-end gap-3 flex-1 px-4 border-l border-r border-slate-100 min-w-[200px]">
                            <label className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
                              {language === "ar"
                                ? "نطاق الطباعة والتقييم:"
                                : "Print & View Range:"}
                            </label>
                            <select
                              value={dayFocus.toString()}
                              onChange={(e) => {
                                const val = e.target.value;
                                // Allow any string to act as range (e.g. '1-15', 'all') or number
                                setDayFocus(val as any);
                              }}
                              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold px-2 py-1 outline-none text-slate-700 w-full max-w-[160px] cursor-pointer"
                            >
                              <option value="all">
                                {language === "ar"
                                  ? "كامل استمارة الشهر"
                                  : "Full Month Table"}
                              </option>
                              <option value="1-10">
                                {language === "ar"
                                  ? "الفترة الأولى (1-10)"
                                  : "1st Period (1-10)"}
                              </option>
                              <option value="11-20">
                                {language === "ar"
                                  ? "الفترة الثانية (11-20)"
                                  : "2nd Period (11-20)"}
                              </option>
                              <option value="21-31">
                                {language === "ar"
                                  ? "الفترة الثالثة (21-31)"
                                  : "3rd Period (21-31)"}
                              </option>
                              <option value="1-15">
                                {language === "ar"
                                  ? "منتصف أول (1-15)"
                                  : "1st Half (1-15)"}
                              </option>
                              <option value="16-31">
                                {language === "ar"
                                  ? "منتصف ثاني (16-31)"
                                  : "2nd Half (16-31)"}
                              </option>
                              <optgroup
                                label={
                                  language === "ar"
                                    ? "يوم مخصص للتدقيق"
                                    : "Specific Day Audit"
                                }
                              >
                                {Array.from({ length: 31 }, (_, i) => (
                                  <option key={i + 1} value={i + 1}>
                                    {language === "ar"
                                      ? `يوم ${i + 1}`
                                      : `Day ${i + 1}`}
                                  </option>
                                ))}
                              </optgroup>
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                generatePDF(
                                  editingRecord,
                                  selectedTemplate,
                                  hospitalSettings,
                                  language,
                                  dayFocus,
                                  selectedShift,
                                )
                              }
                              className="px-4 py-1.5 bg-pink-650 hover:bg-pink-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <FileText className="h-4 w-4 text-white" />
                              {language === "ar"
                                ? "تصدير تقرير PDF"
                                : "Export Clinical PDF"}
                            </button>

                            <button
                              onClick={handlePrint}
                              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <Printer className="h-4 w-4 text-pink-400" />
                              {language === "ar"
                                ? "طباعة طبق الأصل"
                                : "Print Precise Replica"}
                            </button>
                          </div>
                        </div>

                        {/* Row & Items Inline Manager (no-print) */}
                        <div className="no-print mx-0 mt-0 mb-6 bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                          <div className="flex items-center justify-between gap-2 border-b border-slate-150 pb-2.5 mb-2 font-sans text-right">
                            <div className="flex items-center gap-2">
                              <span className="p-1.5 bg-pink-100 text-pink-700 rounded-lg">
                                <ListPlus className="h-4.5 w-4.5" />
                              </span>
                              <div>
                                <h3 className="text-xs font-black text-slate-800">
                                  {language === "ar"
                                    ? "نظام تعديل وإضافة وحذف أصناف الشيت"
                                    : "Sheet Items & Rows Architect (Add, Edit, Delete)"}
                                </h3>
                                <p className="text-[10px] text-slate-500 mt-0.5">
                                  {language === "ar"
                                    ? "أضف بنوداً جديدة للجدول، أو عدل المسميات والمقادير مباشرة لتعديل خلايا الجرد طبق الأصل"
                                    : "Directly append new items, customize bilingual text or modify unit/qty specifications instantly"}
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-650 px-2.5 py-1 rounded-full">
                              {language === "ar"
                                ? `${(editingRecord.gridData || []).length} صنف متاح`
                                : `${(editingRecord.gridData || []).length} active items`}
                            </span>
                          </div>

                          {/* Inline list of current items in this editingRecord */}
                          {currentUser.role &&
                            !["staff", "normal", "nurse"]?.includes(
                              currentUser.role?.toLowerCase(),
                            ) && (
                              <div className="mb-4 max-h-40 overflow-y-auto border border-slate-100 rounded-lg bg-slate-50 divide-y divide-slate-100 text-xs font-sans">
                                {(editingRecord.gridData || []).map((row, rIdx) => (
                                  <div
                                    key={row.code || rIdx}
                                    className="p-2 flex items-center justify-between gap-3 hover:bg-slate-100/50"
                                  >
                                    <div className="flex-1 min-w-0 text-right">
                                      <span className="text-[10px] font-extrabold text-slate-500 font-mono inline-block ml-2 w-5">
                                        {rIdx + 1}
                                      </span>
                                      <span className="font-bold text-slate-800">
                                        {language === "ar"
                                          ? row.itemAr
                                          : row.itemEn}
                                      </span>
                                      <span className="text-[10px] text-slate-450 font-mono inline-block mr-2 uppercase tracking-wide">
                                        (Code: {row.code || rIdx + 1} |{" "}
                                        {language === "ar"
                                          ? `وحدة: ${row.unit || "-"}`
                                          : `Unit: ${row.unit || "-"}`}{" "}
                                        |{" "}
                                        {language === "ar"
                                          ? `مخزون: ${row.qty || "-"}`
                                          : `Qty: ${row.qty || "-"}`}
                                        )
                                      </span>
                                    </div>

                                    {/* Item modifiers */}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <button
                                        onClick={() =>
                                          handleStartEditRow(rIdx, row)
                                        }
                                        className="p-1 hover:text-indigo-600 hover:bg-indigo-50 rounded transition text-slate-500 cursor-pointer"
                                        title={
                                          language === "ar"
                                            ? "تعديل محتوى الصف"
                                            : "Edit row text"
                                        }
                                      >
                                        <Pencil className="h-3.5 w-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteRow(rIdx)}
                                        className="p-1 hover:text-rose-600 hover:bg-rose-50 rounded transition text-slate-500 cursor-pointer"
                                        title={
                                          language === "ar"
                                            ? "حذف الصف كاملاً"
                                            : "Remove item row"
                                        }
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                          {/* Quick Input Panel for edit/add rows */}
                          {currentUser.role &&
                            !["staff", "normal", "nurse"]?.includes(
                              currentUser.role?.toLowerCase(),
                            ) && (
                              <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl text-xs gap-3 grid grid-cols-1 md:grid-cols-12 items-end font-sans">
                                <div className="md:col-span-4">
                                  <label className="block text-[9px] text-slate-450 font-black mb-1 text-right">
                                    {language === "ar"
                                      ? "اسم الصنف بالعربية"
                                      : "Item Arabic Title:"}
                                  </label>
                                  <input
                                    type="text"
                                    value={rowForm.itemAr}
                                    onChange={(e) =>
                                      setRowForm({
                                        ...rowForm,
                                        itemAr: e.target.value,
                                      })
                                    }
                                    className="w-full bg-white border border-slate-200 rounded-lg py-1 px-2.5 outline-none focus:border-pink-500 font-bold text-slate-800"
                                    placeholder={
                                      language === "ar"
                                        ? "مثال: أمبول صوديوم كلورايد"
                                        : "Arabic title"
                                    }
                                  />
                                </div>

                                <div className="md:col-span-3">
                                  <label className="block text-[9px] text-slate-450 font-black mb-1 text-right">
                                    {language === "ar"
                                      ? "اسم الصنف بالإنجليزية"
                                      : "Item English Title:"}
                                  </label>
                                  <input
                                    type="text"
                                    value={rowForm.itemEn}
                                    onChange={(e) =>
                                      setRowForm({
                                        ...rowForm,
                                        itemEn: e.target.value,
                                      })
                                    }
                                    className="w-full bg-white border border-slate-200 rounded-lg py-1 px-2.5 outline-none focus:border-pink-500 font-mono text-slate-800"
                                    placeholder="e.g. Sodium Chloride Ampoule"
                                  />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 md:col-span-3">
                                  <div>
                                    <label className="block text-[9px] text-slate-450 font-black mb-1 text-center">
                                      كود
                                    </label>
                                    <input
                                      type="text"
                                      value={rowForm.code}
                                      onChange={(e) =>
                                        setRowForm({
                                          ...rowForm,
                                          code: e.target.value,
                                        })
                                      }
                                      className="w-full bg-white border border-slate-200 rounded-lg py-1 px-1.5 text-center font-mono uppercase font-bold text-slate-800"
                                      placeholder="E12"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] text-slate-450 font-black mb-1 text-center">
                                      الوحدة
                                    </label>
                                    <input
                                      type="text"
                                      value={rowForm.unit}
                                      onChange={(e) =>
                                        setRowForm({
                                          ...rowForm,
                                          unit: e.target.value,
                                        })
                                      }
                                      className="w-full bg-white border border-slate-200 rounded-lg py-1 px-1 text-center text-slate-800"
                                      placeholder="AMP"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] text-slate-450 font-black mb-1 text-center">
                                      العدد/الكمية
                                    </label>
                                    <input
                                      type="text"
                                      value={rowForm.qty}
                                      onChange={(e) =>
                                        setRowForm({
                                          ...rowForm,
                                          qty: e.target.value,
                                        })
                                      }
                                      className="w-full bg-white border border-slate-200 rounded-lg py-1 px-1 text-center font-mono text-slate-800"
                                      placeholder="20"
                                    />
                                  </div>
                                </div>

                                <div className="md:col-span-2 flex gap-1 bg-transparent">
                                  <button
                                    onClick={handleSaveRowForm}
                                    className="flex-1 bg-pink-650 hover:bg-pink-700 text-white font-bold py-1.5 rounded-lg text-center transition cursor-pointer"
                                  >
                                    {rowEditIndex !== null
                                      ? language === "ar"
                                        ? "حفظ"
                                        : "Save"
                                      : language === "ar"
                                        ? "إضافة صنف"
                                        : "Add Row"}
                                  </button>
                                  {rowEditIndex !== null && (
                                    <button
                                      onClick={handleCancelRowEdit}
                                      className="bg-slate-200 text-slate-700 font-bold py-1.5 px-2 rounded-lg text-center hover:bg-slate-300 transition cursor-pointer"
                                    >
                                      X
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                        </div>

                        {/* HIGH FIDELITY PRINTABLE REPLICA CONTAINER (صناعة طبق الأصل للفورم لضمان الجودة) */}
                        <div className="print-container bg-white p-6 sm:p-8 rounded-b-xl border border-slate-200 shadow-sm relative overflow-visible print:border-none print:shadow-none print:p-0">
                          {/* Double bordered box representing high standard Egyptian Clinical documents */}
                          <div className="border-[3px] border-slate-900 p-5 rounded-lg relative overflow-hidden print:overflow-visible print:p-0 print:border-none">
                            {/* RED INK QUALITY OFFICERS CERTIFICATION SEAL (ختم في الجانب مع روتيت) */}
                            {editingRecord.additionalInfo
                              ?.isQualityCertified && (
                              <div className="absolute top-6 left-6 rotate-[-12deg] border-[3px] border-red-600 text-red-600 bg-white/95 px-4 py-2 rounded-lg font-mono text-[10px] uppercase font-bold tracking-tight text-center select-none shadow-md border-double border-4 z-dropdown avoid-break print:left-3 print:top-6">
                                <div className="border-b border-red-600 pb-0.5 mb-1 font-bold tracking-widest text-[8px] flex items-center justify-center gap-1">
                                  <HeartPulse className="h-3 w-3" />
                                  <span>CLINICAL QUALITY</span>
                                </div>
                                <div className="text-[12px] font-black text-red-600 leading-none">
                                  CERTIFIED AUDIT
                                </div>
                                <div className="text-[9px] text-red-600 mt-1 font-extrabold tracking-tight">
                                  ✔ COMPLIANT & APPROVED
                                </div>
                                <div className="text-[8px] text-slate-500 mt-1 uppercase font-normal font-sans leading-none">
                                  Date:{" "}
                                  {editingRecord.additionalInfo?.certifiedAt ||
                                    "2026-06-01"}
                                </div>
                                <div className="text-[8px] text-slate-500 uppercase font-bold font-sans mt-0.5">
                                  ID:{" "}
                                  {editingRecord.additionalInfo?.certifiedBy ||
                                    "Auditor Norhan Ali"}
                                </div>
                              </div>
                            )}

                            {/* Header Banner - Replica of Hospital Letterhead */}
                            <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-slate-900 pb-4 mb-4 avoid-break">
                              {/* Bilingual Logo block */}
                              <DynamicProfessionalLogo
                                nameAr={hospitalSettings.nameAr}
                                nameEn={hospitalSettings.nameEn}
                                taglineAr={hospitalSettings.taglineAr}
                                taglineEn={hospitalSettings.taglineEn}
                                size="print"
                                isAr={language === "ar"}
                              />

                              {/* Code blue form titles */}
                              <div className="text-center mt-3 sm:mt-0">
                                <h2 className="text-base sm:text-lg font-bold text-slate-800 leading-tight">
                                  {language === "ar"
                                    ? selectedTemplate.titleAr
                                    : selectedTemplate.titleEn}
                                </h2>
                                <span className="text-[9px] sm:text-xs font-mono text-slate-500 tracking-wider">
                                  Form Reference: {selectedTemplate.code} |
                                  Version {selectedTemplate.version || "01"} |
                                  Rev: {selectedTemplate.issueDate}
                                </span>
                              </div>
                            </div>

                            {/* Metadata Entry Row - nurse names, date, department */}
                            <div className="grid grid-cols-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs mb-4 avoid-break print:bg-transparent print:border-none print:p-0">
                              <div>
                                <label className="block text-[9px] text-slate-500 font-bold mb-1 uppercase">
                                  {language === "ar"
                                    ? "القسم / مكان الجرد"
                                    : "Department / Unit Floor:"}
                                </label>
                                <input
                                  type="text"
                                  value={editingRecord.department}
                                  onChange={(e) =>
                                    setEditingRecord({
                                      ...editingRecord,
                                      department: e.target.value,
                                    })
                                  }
                                  className="w-full bg-white border border-slate-200 rounded px-2 py-1 font-bold text-slate-800 print:text-black focus:outline-none focus:border-pink-500"
                                />
                              </div>

                              <div>
                                <label className="block text-[9px] text-slate-500 font-bold mb-1 uppercase">
                                  {language === "ar"
                                    ? "تاريخ الفحص والمراقبة"
                                    : "Inspection Month/Date:"}
                                </label>
                                <div className="relative flex items-center">
                                  <Calendar className="absolute right-2 text-slate-500 h-3.5 w-3.5 pointer-events-none" />
                                  <input
                                    type="date"
                                    value={editingRecord.date}
                                    onChange={(e) =>
                                      setEditingRecord({
                                        ...editingRecord,
                                        date: e.target.value,
                                      })
                                    }
                                    className="w-full bg-white border border-slate-200 rounded pr-8 pl-2 py-1 font-mono font-bold text-slate-800 print:text-black focus:outline-none focus:border-pink-500 text-xs"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[9px] text-slate-500 font-bold mb-1 uppercase">
                                  {language === "ar"
                                    ? "الوردية / الشفت المقترن بالجرد"
                                    : "Associated Shift Period:"}
                                </label>
                                <div className="relative flex items-center">
                                  <select
                                    value={selectedShift}
                                    disabled={true}
                                    title={
                                      language === "ar"
                                        ? "الوردية النشطة المعترف بها بالنظام حالياً. لا يمكن التلاعب اليدوي بها في المستندات."
                                        : "Active recognized hospital shift. Manual override disabled."
                                    }
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 font-bold text-slate-500 cursor-not-allowed outline-none text-xs h-[30px]"
                                  >
                                    {CLINICAL_SHIFTS.map((cs) => (
                                      <option key={cs.id} value={cs.id}>
                                        {cs.nameAr}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label className="block text-[9px] text-slate-500 font-bold mb-1 uppercase">
                                  {language === "ar"
                                    ? "الممرض المسؤول حالياً"
                                    : "Investigated Nurse Name:"}
                                </label>
                                <div className="relative flex items-center">
                                  <User className="absolute right-2 text-slate-500 h-3.5 w-3.5 pointer-events-none" />
                                  <input
                                    type="text"
                                    value={editingRecord.staffName}
                                    onChange={(e) =>
                                      setEditingRecord({
                                        ...editingRecord,
                                        staffName: e.target.value,
                                      })
                                    }
                                    disabled={
                                      !(
                                        currentUser.role === "admin" ||
                                        currentUser.role === "quality" ||
                                        currentUser.role === "president" ||
                                        currentUser.role === "head_nurse" ||
                                        currentUser.role === "it"
                                      )
                                    }
                                    className="w-full bg-white border border-slate-200 rounded pr-8 pl-2 py-1 font-bold text-slate-800 print:text-black focus:outline-none focus:border-pink-500 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[9px] text-slate-500 font-bold mb-1 uppercase font-mono">
                                  {language === "ar"
                                    ? "الرقم الوظيفي / الكود"
                                    : "Responsible Employee ID:"}
                                </label>
                                <input
                                  type="text"
                                  value={editingRecord.staffId}
                                  onChange={(e) =>
                                    setEditingRecord({
                                      ...editingRecord,
                                      staffId: e.target.value,
                                    })
                                  }
                                  disabled={
                                    !(
                                      currentUser.role === "admin" ||
                                      currentUser.role === "quality" ||
                                      currentUser.role === "president" ||
                                      currentUser.role === "head_nurse" ||
                                      currentUser.role === "it"
                                    )
                                  }
                                  className="w-full bg-white border border-slate-200 rounded px-2 py-1 font-mono font-bold text-slate-800 print:text-black focus:outline-none focus:border-pink-500 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                                />
                              </div>
                            </div>

                            {/* Patient metadata details row if patient specific details is enabled */}
                            {selectedTemplate.hasPatientDetails && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-red-50/50 p-3 rounded-lg border border-red-100 text-xs mb-4 avoid-break print:bg-transparent print:border-none print:p-0">
                                <div>
                                  <label className="block text-[9px] text-red-700 font-bold mb-1 uppercase">
                                    {language === "ar"
                                      ? "اسم المريض الرباعي"
                                      : "Patient Full Name:"}
                                  </label>
                                  <input
                                    type="text"
                                    value={editingRecord.patientName || ""}
                                    onChange={(e) =>
                                      setEditingRecord({
                                        ...editingRecord,
                                        patientName: e.target.value,
                                      })
                                    }
                                    className="w-full bg-white border border-red-200 rounded px-2 py-1 font-bold text-slate-800 print:text-black focus:outline-none focus:border-red-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] text-red-700 font-bold mb-1 uppercase font-sans">
                                    {language === "ar"
                                      ? "الرقم الطبي (MRN)"
                                      : "Clinical Record ID (MRN):"}
                                  </label>
                                  <input
                                    type="text"
                                    value={editingRecord.patientMRN || ""}
                                    onChange={(e) =>
                                      setEditingRecord({
                                        ...editingRecord,
                                        patientMRN: e.target.value,
                                      })
                                    }
                                    className="w-full bg-white border border-red-200 rounded px-2 py-1 font-mono font-bold text-slate-800 print:text-black focus:outline-none focus:border-red-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] text-red-700 font-bold mb-1 uppercase">
                                    {language === "ar"
                                      ? "التشخيص الطبي الأورام"
                                      : "Acknowledge Oncology Diagnosis:"}
                                  </label>
                                  <input
                                    type="text"
                                    value={editingRecord.diagnosis || ""}
                                    onChange={(e) =>
                                      setEditingRecord({
                                        ...editingRecord,
                                        diagnosis: e.target.value,
                                      })
                                    }
                                    className="w-full bg-white border border-red-200 rounded px-2 py-1 font-bold text-slate-800 print:text-black focus:outline-none focus:border-red-500"
                                  />
                                </div>
                              </div>
                            )}

                            {/* FORM CASE 1: PATIENT CONSENT / OUT AGAINST ADVICE FORM */}
                            {selectedTemplate.id === "patient-discharge-ama" ? (
                              <div className="text-right text-xs leading-relaxed space-y-4 text-slate-800 print:text-black print:leading-normal">
                                <p className="font-bold border-b pb-1 text-slate-700">
                                  {language === "ar"
                                    ? "أقرأ أنا الموقع أدناه بأنني أتحمل كامل المسؤولية بمغادرة الحالة المستشفى رغماً عن التوصيات الطبية:"
                                    : "Patient/Legal guardian declaration on discharge against medical advice:"}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100 print:bg-transparent print:border-none print:p-0">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <span>
                                        {language === "ar"
                                          ? "اسم المقر المسؤول:"
                                          : "Declarant Name:"}
                                      </span>
                                      <input
                                        type="text"
                                        placeholder="..........."
                                        value={
                                          editingRecord.additionalInfo
                                            ?.witnessName || ""
                                        }
                                        onChange={(e) =>
                                          setEditingRecord({
                                            ...editingRecord,
                                            additionalInfo: {
                                              ...editingRecord.additionalInfo,
                                              witnessName: e.target.value,
                                            },
                                          })
                                        }
                                        className="border-b border-slate-400 flex-1 px-1 font-bold bg-transparent focus:outline-none"
                                      />
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <span>
                                        {language === "ar"
                                          ? "صلة القرابة بالمريض:"
                                          : "Relationship to Patient:"}
                                      </span>
                                      <select
                                        value={
                                          editingRecord.additionalInfo
                                            ?.relation || "self"
                                        }
                                        onChange={(e) =>
                                          setEditingRecord({
                                            ...editingRecord,
                                            additionalInfo: {
                                              ...editingRecord.additionalInfo,
                                              relation: e.target.value,
                                            },
                                          })
                                        }
                                        className="border-b border-slate-400 bg-transparent py-0.5 px-1 font-bold text-xs outline-none"
                                      >
                                        <option value="self">
                                          {language === "ar"
                                            ? "بالأصالة عن نفسي"
                                            : "Self"}
                                        </option>
                                        <option value="son">
                                          {language === "ar"
                                            ? "صلة قرابة: ابن"
                                            : "Son"}
                                        </option>
                                        <option value="daughter">
                                          {language === "ar"
                                            ? "صلة قرابة: ابنة"
                                            : "Daughter"}
                                        </option>
                                        <option value="relative">
                                          {language === "ar"
                                            ? "صلة قرابة: قرابة قانونية"
                                            : "Legal Guardian"}
                                        </option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <span>
                                        {language === "ar"
                                          ? "الرقم القومي / العائلي:"
                                          : "National ID Number:"}
                                      </span>
                                      <input
                                        type="text"
                                        placeholder=".........................."
                                        value={
                                          editingRecord.additionalInfo
                                            ?.witnessSignatureAr || ""
                                        }
                                        onChange={(e) =>
                                          setEditingRecord({
                                            ...editingRecord,
                                            additionalInfo: {
                                              ...editingRecord.additionalInfo,
                                              witnessSignatureAr:
                                                e.target.value,
                                            },
                                          })
                                        }
                                        className="border-b border-slate-400 flex-1 px-1 font-mono bg-transparent focus:outline-none"
                                      />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span>
                                        {language === "ar"
                                          ? "بسبب مغادرة وقدرها:"
                                          : "Stated Discharge Reason:"}
                                      </span>
                                      <input
                                        type="text"
                                        placeholder={
                                          language === "ar"
                                            ? "سبب المغادرة رغماً عن التوجيه"
                                            : "Reason detail"
                                        }
                                        value={
                                          editingRecord.additionalInfo
                                            ?.doctorRefusedText || ""
                                        }
                                        onChange={(e) =>
                                          setEditingRecord({
                                            ...editingRecord,
                                            additionalInfo: {
                                              ...editingRecord.additionalInfo,
                                              doctorRefusedText: e.target.value,
                                            },
                                          })
                                        }
                                        className="border-b border-slate-400 flex-1 px-1 bg-transparent focus:outline-none"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="border border-red-200 bg-red-50/20 p-3 rounded-lg print:border-none print:p-0">
                                  <p className="font-bold text-red-800 print:text-black mb-1">
                                    {language === "ar"
                                      ? "إقرار الطبيب ومضاعفات خروج المريض المحتملة:"
                                      : "Clinical Complications Explained:"}
                                  </p>
                                  <p className="text-[11px] text-slate-600 print:text-black mb-2 font-sans">
                                    {language === "ar"
                                      ? "أقر أنا الطبيب المسؤول بأنني قمت بشرح وتوضيح المخاطر الطبية والمضاعفات الناتجة عن رفض العلاج ومنها:"
                                      : "The attending physician explained clinical hazards regarding the rejection of care:"}
                                  </p>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    <div className="flex items-center gap-1">
                                      <span className="font-bold">1.</span>
                                      <input
                                        type="text"
                                        value={
                                          editingRecord.additionalInfo
                                            ?.complication1 || ""
                                        }
                                        onChange={(e) =>
                                          setEditingRecord({
                                            ...editingRecord,
                                            additionalInfo: {
                                              ...editingRecord.additionalInfo,
                                              complication1: e.target.value,
                                            },
                                          })
                                        }
                                        placeholder={
                                          language === "ar"
                                            ? "مضاعفة 1: التهاب الجرح"
                                            : "Complication hazard 1"
                                        }
                                        className="border-b border-slate-300 px-1 py-0.5 w-full bg-transparent focus:outline-none"
                                      />
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="font-bold">2.</span>
                                      <input
                                        type="text"
                                        value={
                                          editingRecord.additionalInfo
                                            ?.complication2 || ""
                                        }
                                        onChange={(e) =>
                                          setEditingRecord({
                                            ...editingRecord,
                                            additionalInfo: {
                                              ...editingRecord.additionalInfo,
                                              complication2: e.target.value,
                                            },
                                          })
                                        }
                                        placeholder={
                                          language === "ar"
                                            ? "مضاعفة 2: تدهور مؤشرات الصدر"
                                            : "Complication hazard 2"
                                        }
                                        className="border-b border-slate-300 px-1 py-0.5 w-full bg-transparent focus:outline-none"
                                      />
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="font-bold">3.</span>
                                      <input
                                        type="text"
                                        value={
                                          editingRecord.additionalInfo
                                            ?.complication3 || ""
                                        }
                                        onChange={(e) =>
                                          setEditingRecord({
                                            ...editingRecord,
                                            additionalInfo: {
                                              ...editingRecord.additionalInfo,
                                              complication3: e.target.value,
                                            },
                                          })
                                        }
                                        placeholder={
                                          language === "ar"
                                            ? "مضاعفة 3: فشل وظائف الأعضاء"
                                            : "Complication hazard 3"
                                        }
                                        className="border-b border-slate-300 px-1 py-0.5 w-full bg-transparent focus:outline-none"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Signatures replica block */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10 text-center avoid-break">
                                  <div className="border-t border-slate-400 pt-2 space-y-1">
                                    <p className="font-bold">
                                      {language === "ar"
                                        ? "توقيع المريض المقر بالمسؤولية"
                                        : "Patient Declarant Signature:"}
                                    </p>
                                    <p className="text-[10px] text-slate-450">
                                      {language === "ar"
                                        ? "توقيع أو ختم بصمة اليد"
                                        : "Handwritten signature or thumbprint"}
                                    </p>
                                  </div>
                                  <div className="border-t border-slate-400 pt-2 space-y-1">
                                    <p className="font-bold">
                                      {language === "ar"
                                        ? "توقيع الطبيب والختم الرسمي"
                                        : "Physician Stamp & Stamp:"}
                                    </p>
                                    <p className="text-[10px] text-slate-455">
                                      {language === "ar"
                                        ? "تاريخ ووقت التوقيع بالرفض"
                                        : "Date & time of clearance"}
                                    </p>
                                  </div>
                                </div>

                                <div className="text-center pt-8 border-t text-[9px] text-slate-500 font-mono avoid-break">
                                  <span>
                                    Issue Date: 03.2025 | Document Reference:
                                    BHG-FR-MED-080 | Page 1 of 1
                                  </span>
                                </div>
                              </div>
                            ) : (
                              /* FORM CASE 2: HIGH FIDELITY MONTHLY GRID / CHECKLIST SPREADSHEETS (كل الأنماط الأخرى) */
                              <div className="space-y-4">
                                {/* Legend Bar only on screen */}
                                <div className="no-print bg-slate-100 hover:bg-slate-150 p-3.5 rounded-xl border border-slate-200/60 text-xs text-slate-600 font-sans shadow-sm transition-all">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center">
                                      <span className="font-extrabold text-slate-700 ml-1">
                                        {language === "ar"
                                          ? "رموز التقييم والجرد:"
                                          : "Symbol Legend:"}
                                      </span>
                                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200/50 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                        <span className="bg-emerald-600 text-white w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold text-[8px]">
                                          ✔
                                        </span>
                                        <span>
                                          {language === "ar"
                                            ? "متوفر وسليم"
                                            : "Available & Safe"}
                                        </span>
                                      </span>
                                      <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200/50 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                        <span className="bg-rose-600 text-white w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold text-[8px]">
                                          ✘
                                        </span>
                                        <span>
                                          {language === "ar"
                                            ? "غير متوفر / مفقود"
                                            : "Missing / Out"}
                                        </span>
                                      </span>
                                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200/50 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold">
                                        <span className="border border-blue-300 text-blue-800 rounded px-1.5 text-[8px] font-mono bg-white">
                                          قيمة
                                        </span>
                                        <span>
                                          {language === "ar"
                                            ? "الأرقام والقياسات"
                                            : "Numerical/Reading"}
                                        </span>
                                      </span>
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-bold flex items-center gap-1 justify-end">
                                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span>
                                      <span>
                                        {language === "ar"
                                          ? "نصيحة للجودة: انقر فوق اسم اليوم بالعمود بالجدول للملء التلقائي لكامل العمود بـ (✔) دفعة واحدة!"
                                          : "Tip: Click any Day column header above to fill the entire column with (✔) instantly!"}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Interactive Data Table */}
                                <div className="overflow-x-auto border rounded-lg border-slate-200 print:overflow-visible print:border-none animate-fade">
                                  <table className="min-w-full text-right divide-y divide-slate-250 border-collapse print:text-black">
                                    <thead className="bg-slate-100 border-b-2 border-slate-900">
                                      <tr className="divide-x divide-x-reverse divide-slate-200">
                                        <th
                                          scope="col"
                                          className="px-2 py-3 text-center text-xs font-black text-slate-800 w-10"
                                        >
                                          M
                                        </th>
                                        <th
                                          scope="col"
                                          className="px-2 py-3 text-center text-xs font-black text-slate-800 w-16"
                                        >
                                          Code
                                        </th>
                                        <th
                                          scope="col"
                                          className="px-3 py-3 text-right text-xs font-black text-slate-800 min-w-[220px]"
                                        >
                                          {language === "ar"
                                            ? "الصنف والمستلزم المطلوب فصحه وجرده"
                                            : "Medical Item description"}
                                        </th>
                                        <th
                                          scope="col"
                                          className="px-2 py-3 text-center text-xs font-black text-slate-850 w-16"
                                        >
                                          Unit
                                        </th>
                                        <th
                                          scope="col"
                                          className="px-2 py-3 text-center text-xs font-black text-slate-850 w-12 mr-1"
                                        >
                                          Qty
                                        </th>

                                        {/* Day headers with Bulk Action Checkboxes */}
                                        {(() => {
                                          let daysArray: string[] = [];
                                          if (dayFocus === "all") {
                                            daysArray = Array.from(
                                              { length: numDays },
                                              (_, i) => (i + 1).toString(),
                                            );
                                          } else if (
                                            typeof dayFocus === "string" &&
                                            dayFocus?.includes("-")
                                          ) {
                                            const [start, end] = dayFocus
                                              .split("-")
                                              .map(Number);
                                            for (
                                              let i = start;
                                              i <= Math.min(end, numDays);
                                              i++
                                            )
                                              daysArray.push(i.toString());
                                          } else {
                                            daysArray = [dayFocus.toString()];
                                          }

                                          return daysArray.map((day) => (
                                            <th
                                              key={day}
                                              scope="col"
                                              onClick={() =>
                                                handleBulkFillDay(day)
                                              }
                                              className="day-col px-0.5 py-1 text-center text-[9px] font-mono text-slate-700 cursor-pointer lg:hover:bg-slate-200 active:bg-slate-300 select-none print:cursor-default print:hover:bg-transparent"
                                              title={
                                                language === "ar"
                                                  ? "انقر للملء التلقائي لليوم"
                                                  : "Click to Bulk Fill Day"
                                              }
                                            >
                                              <div className="font-bold">
                                                {day}
                                              </div>
                                              <div className="no-print text-[7px] text-pink-500 font-sans font-normal border-t mt-0.5 leading-none">
                                                Fill
                                              </div>
                                            </th>
                                          ));
                                        })()}
                                      </tr>
                                    </thead>

                                    <tbody className="bg-white divide-y divide-slate-200 border-b border-slate-900">
                                      {(editingRecord.gridData || []).map(
                                        (row, rIndex) => (
                                          <tr
                                            key={row.code || rIndex}
                                            className="divide-x divide-x-reverse divide-slate-200 hover:bg-slate-50 transition print:hover:bg-transparent"
                                          >
                                            {/* S/N */}
                                            <td className="px-2 py-2 text-center text-xs font-bold font-mono text-slate-500">
                                              {row.sn || rIndex + 1}
                                            </td>

                                            {/* Code */}
                                            <td className="px-2 py-2 text-center text-xs font-bold font-mono text-slate-500">
                                              {row.code || "N/A"}
                                            </td>

                                            {/* Bilingual descriptor */}
                                            <td className="px-3 py-2 text-right text-xs">
                                              <div className="font-bold text-slate-900 leading-tight">
                                                {row.itemAr}
                                              </div>
                                              <div className="text-[9px] text-slate-450 leading-none mt-1 font-mono">
                                                {row.itemEn}
                                              </div>
                                            </td>

                                            {/* Unit */}
                                            <td className="px-2 py-2 text-center text-[10px] uppercase font-bold text-slate-500">
                                              {row.unit || "-"}
                                            </td>

                                            {/* Target Qty */}
                                            <td className="px-2 py-2 text-center text-xs font-bold text-slate-705 font-mono">
                                              {row.qty || "-"}
                                            </td>

                                            {/* Columns for checkmarks days */}
                                            {(() => {
                                              let daysArray: string[] = [];
                                              if (dayFocus === "all") {
                                                daysArray = Array.from(
                                                  { length: numDays },
                                                  (_, i) => (i + 1).toString(),
                                                );
                                              } else if (
                                                typeof dayFocus === "string" &&
                                                dayFocus?.includes("-")
                                              ) {
                                                const [start, end] = dayFocus
                                                  .split("-")
                                                  .map(Number);
                                                for (
                                                  let i = start;
                                                  i <= Math.min(end, numDays);
                                                  i++
                                                )
                                                  daysArray.push(i.toString());
                                              } else {
                                                daysArray = [
                                                  dayFocus.toString(),
                                                ];
                                              }

                                              return daysArray.map((day) => {
                                                const val = row.days[day] || "";
                                                return (
                                                  <td
                                                    key={day}
                                                    onClick={() =>
                                                      handleCellToggle(
                                                        rIndex,
                                                        day,
                                                      )
                                                    }
                                                    className={`day-col px-0.5 text-center text-[10px] font-bold cursor-pointer transition select-none print:cursor-default ${
                                                      val === "✔"
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : val === "✘"
                                                          ? "bg-red-50 text-red-650 font-black"
                                                          : val !== ""
                                                            ? "bg-blue-50 text-blue-800 font-mono text-[9px]"
                                                            : "lg:hover:bg-slate-100"
                                                    }`}
                                                  >
                                                    {val ||
                                                      ((daysArray || []).length ===
                                                        1 && (
                                                        <span className="text-[10px] text-slate-350 font-normal">
                                                          {language === "ar"
                                                            ? "اضغط"
                                                            : "Click"}
                                                        </span>
                                                      ))}
                                                  </td>
                                                );
                                              });
                                            })()}
                                          </tr>
                                        ),
                                      )}
                                    </tbody>
                                    <tfoot className="bg-slate-50 border-t-2 border-slate-300">
                                      <tr className="divide-x divide-x-reverse divide-slate-200">
                                        <td className="px-2 py-2 text-center text-[10px] font-black text-slate-600 bg-slate-100">
                                          -
                                        </td>
                                        <td className="px-2 py-2 text-center text-[10px] font-black text-slate-600 bg-slate-100">
                                          -
                                        </td>
                                        <td className="px-3 py-2 text-right text-xs font-black text-slate-800 bg-slate-100/95">
                                          <div className="flex items-center justify-between">
                                            <span>
                                              {language === "ar"
                                                ? "توقيع وبصمة الموظف اليومي:"
                                                : "Daily Verified Signature:"}
                                            </span>
                                            <ShieldCheck className="h-3.5 w-3.5 text-pink-600 inline ml-1" />
                                          </div>
                                        </td>
                                        <td className="px-2 py-2 text-center text-[10px] font-black text-slate-600 bg-slate-100">
                                          -
                                        </td>
                                        <td className="px-2 py-2 text-center text-[10px] font-black text-slate-600 bg-slate-100">
                                          -
                                        </td>

                                        {(() => {
                                          let daysArray: string[] = [];
                                          if (dayFocus === "all") {
                                            daysArray = Array.from(
                                              {
                                                length:
                                                  ledgerViewMode === "weekly"
                                                    ? 7
                                                    : numDays,
                                              },
                                              (_, i) => (i + 1).toString(),
                                            );
                                          } else if (
                                            typeof dayFocus === "string" &&
                                            dayFocus?.includes("-")
                                          ) {
                                            const [start, end] = dayFocus
                                              .split("-")
                                              .map(Number);
                                            for (
                                              let i = start;
                                              i <= Math.min(end, numDays);
                                              i++
                                            )
                                              daysArray.push(i.toString());
                                          } else {
                                            daysArray = [dayFocus.toString()];
                                          }

                                          return daysArray.map((day) => {
                                            const isDayFilled =
                                              (editingRecord.gridData || []).some(
                                                (row) =>
                                                  row.days[day] !== undefined &&
                                                  row.days[day] !== "",
                                              );
                                            return (
                                              <td
                                                key={day}
                                                className="day-col px-0.5 py-1.5 text-center text-[9px] font-sans font-black bg-slate-50"
                                              >
                                                {isDayFilled ? (
                                                  <div className="flex flex-col items-center justify-center">
                                                    <span
                                                      className="text-[8px] bg-pink-100 text-pink-850 border border-pink-200/50 py-0.5 px-0.5 rounded leading-none block font-sans scale-[0.9] select-none"
                                                      title={`Signed by: ${editingRecord.staffName || "Staff Nurse"}`}
                                                    >
                                                      ✍{" "}
                                                      {editingRecord.staffName
                                                        ? editingRecord.staffName.split(
                                                            " ",
                                                          )[0]
                                                        : language === "ar"
                                                          ? "تمريض"
                                                          : "Nurse"}
                                                    </span>
                                                  </div>
                                                ) : (
                                                  <span className="text-slate-300">
                                                    -
                                                  </span>
                                                )}
                                              </td>
                                            );
                                          });
                                        })()}
                                      </tr>
                                    </tfoot>
                                  </table>
                                </div>

                                {/* Signatures row replica */}
                                <div className="flex flex-row items-end justify-between pt-12 avoid-break text-xs text-slate-800 print:text-black w-full font-bold">
                                  <div className="flex items-end flex-wrap">
                                    <span>
                                      {language === "ar"
                                        ? "المستلم ومحضر ممرض القسم:"
                                        : "Prepared Nurse / Officer:"}
                                    </span>
                                    <span className="inline-flex flex-col items-center justify-end w-32 border-b-2 border-dotted border-slate-800 mx-2 pb-0.5 text-center text-[9px]">
                                      <span>
                                        {editingRecord.staffName || ""}
                                      </span>
                                      {editingRecord.staffId && (
                                        <span className="text-[8px] font-mono">
                                          ID: {editingRecord.staffId}
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-end flex-wrap">
                                    <span>
                                      {language === "ar"
                                        ? "رئيسة التمريض للقسم:"
                                        : "Checked Head Nurse:"}
                                    </span>
                                    <span className="inline-block w-40 border-b-2 border-dotted border-slate-800 mx-2 pb-0.5"></span>
                                  </div>
                                  <div className="flex items-end flex-wrap">
                                    <span>
                                      {language === "ar"
                                        ? "مراقب الجودة والتنمية:"
                                        : "Hospital Quality Controller:"}
                                    </span>
                                    <span className="inline-block min-w-40 border-b-2 border-dotted border-slate-800 mx-2 pb-0.5 text-[9px] text-center">
                                      {editingRecord.additionalInfo
                                        ?.isQualityCertified
                                        ? language === "ar"
                                          ? `معتمد: ${editingRecord.additionalInfo.certifiedBy}`
                                          : `Certified: ${editingRecord.additionalInfo.certifiedBy}`
                                        : ""}
                                    </span>
                                  </div>
                                </div>

                                {/* Document footer references */}
                                <div className="text-center pt-6 border-t text-[9px] text-slate-500 font-mono avoid-break">
                                  <span>
                                    Revision: {selectedTemplate.code} | Issue
                                    Date: {selectedTemplate.issueDate} | $
                                    {hospitalSettings.nameEn} Clinical Quality
                                    Archive - Page 1 of 1
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="lg:col-span-3 text-center py-20 bg-white border rounded-xl border-dashed border-slate-300 p-8">
                        <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2 animate-bounce" />
                        <p className="text-sm font-bold text-slate-600">
                          {language === "ar"
                            ? "يرجى الضغط على نموذج من قائمة الـ 200 شيت النشطة للبدء بالتسجيل"
                            : "Please select any form template on sidebar or click create blank database log to start."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            
}
