import React, { useState, useEffect, useRef } from "react";
import { 
  Utensils, Apple, Carrot, Coffee, AlertTriangle, 
  Calendar, CheckCircle, FileText, Droplet, Trash2, RefreshCw,
  Search, Plus, Save, Printer, Archive, Edit2, X, Download, Stethoscope, ChevronRight, Eye
} from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { useSettings } from "../context/SettingsContext";
import { useHIS } from "../context/HISContext";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
  onClose?: () => void;
}

export default function NutritionDashboard({ language, onClose }: Props) {
  const isAr = language === "ar";
  const { settings } = useSettings();
  const { patients, getSetting, saveSetting } = useHIS();
  
  const [activeTab, setActiveTab] = useState<"meals" | "enteral" | "patients_diet" | "patients_meals_sheet" | "employee_meals_sheet">("patients_diet");

  // Inpatient list for diet mapping
  const inpatients = patients.filter(p => p.status === "ward" || p.status === "nicu");

  // Diet Orders State (sampleed per patient for demo, could be stored in patient.nutritionNotes)
  const [dietOrders, setDietOrders] = useState<Record<string, { diet: string, allergy: string, notes: string }>>({});

  useEffect(() => {
    // Load saved diet orders from getSetting for persistence
    getSetting("hospital_patient_diets").then(saved => {
      if (saved) {
        setDietOrders(saved);
      }
    });
  }, [getSetting]);

  const saveDietOrder = (patientId: string, diet: string, allergy: string, notes: string) => {
    const updated = { ...dietOrders, [patientId]: { diet, allergy, notes } };
    setDietOrders(updated);
    saveSetting("hospital_patient_diets", updated);
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50 relative font-sans" dir={isAr ? "rtl" : "ltr"}>
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 ltr:right-4 rtl:left-4 p-2 bg-slate-200 hover:bg-slate-300 rounded-xl transition-colors text-slate-600 z-dropdown no-print"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 md:p-6 shrink-0 shadow-sm no-print">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
              <Utensils className="w-5 h-5 sm:w-8 sm:h-8 text-orange-500 bg-orange-100 p-1.5 rounded-xl" />
              {isAr ? "التغذية العلاجية (Clinical Nutrition)" : "Clinical Nutrition"}
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              {isAr ? "نظام الغذاء والوجبات للمرضى" : "Patient diet plans and meals"}
            </p>
          </div>
          
          <div className="flex bg-slate-100 rounded-xl p-1 overflow-x-auto">
            <button 
              onClick={() => setActiveTab("patients_diet")}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition whitespace-nowrap ${activeTab === "patients_diet" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}
            >
              {isAr ? "وصفة التغذية للمرضى" : "Patients Diet Order"}
            </button>
            <button 
              onClick={() => setActiveTab("patients_meals_sheet")}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition whitespace-nowrap ${activeTab === "patients_meals_sheet" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}
            >
              {isAr ? "شيت وجبات المرضى" : "Patients Meals Sheet"}
            </button>
            <button 
              onClick={() => setActiveTab("employee_meals_sheet")}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition whitespace-nowrap ${activeTab === "employee_meals_sheet" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}
            >
              {isAr ? "شيت وجبات الموظفين" : "Employee Meals Sheet"}
            </button>
            <button 
              onClick={() => setActiveTab("enteral")}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition whitespace-nowrap ${activeTab === "enteral" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}
            >
              {isAr ? "التغذية الأنبوبية/TPN" : "Enteral / TPN"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {activeTab === "patients_diet" && (
          <PatientsDietOrders 
            isAr={isAr} 
            inpatients={inpatients} 
            dietOrders={dietOrders} 
            saveDietOrder={saveDietOrder} 
          />
        )}
        
        {activeTab === "patients_meals_sheet" && (
          <PatientsMealsDeliverySheet 
            isAr={isAr} 
            inpatients={inpatients} 
            dietOrders={dietOrders}
            settings={settings}
            getSetting={getSetting}
            saveSetting={saveSetting}
          />
        )}

        {activeTab === "employee_meals_sheet" && (
          <EmployeeMealsDeliverySheet 
            isAr={isAr} 
            settings={settings}
            getSetting={getSetting}
            saveSetting={saveSetting}
          />
        )}

        {activeTab === "enteral" && (
          <EnteralMonitoring isAr={isAr} />
        )}
      </div>
    </div>
  );
}

// Sub-components

function PatientsDietOrders({ isAr, inpatients, dietOrders, saveDietOrder }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPatient, setEditingPatient] = useState<any>(null);

  const filtered = inpatients.filter((p: any) => 
    p.nameAr.includes(searchTerm) || 
    p.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.mrn.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-orange-500" />
          {isAr ? "اعتماد النظام الغذائي (Diet Prescriptions)" : "Diet Prescriptions"}
        </h3>
        <div className="relative w-full sm:w-72">
          <input 
            type="text" 
            placeholder={isAr ? "بحث عن مريض..." : "Search patient..."}
            className="w-full border border-slate-300 rounded-xl px-10 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className={`w-4 h-4 text-slate-400 absolute top-3 ${isAr ? 'right-3' : 'left-3'}`} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((patient: any) => {
          const order = dietOrders[patient.id] || { diet: "Normal", allergy: "None", notes: "" };
          
          return (
            <div key={patient.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-black text-slate-800 text-base">{isAr ? patient.nameAr : patient.nameEn}</h4>
                  <div className="text-xs font-bold text-slate-500 font-mono mt-1">MRN: {patient.mrn} • {patient.department || "Ward"}</div>
                </div>
                <button 
                  onClick={() => setEditingPatient({...patient, order})}
                  className="p-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition"
                  title={isAr ? "تعديل الوصفة" : "Edit Prescription"}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">{isAr ? "النظام الغذائي:" : "Diet:"}</span>
                  <span className="font-black text-slate-800">{order.diet}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">{isAr ? "حساسية:" : "Allergy:"}</span>
                  <span className={`font-black ${order.allergy && order.allergy !== "None" && order.allergy !== "لا يوجد" ? "text-rose-600" : "text-emerald-600"}`}>
                    {order.allergy}
                  </span>
                </div>
                {order.notes && (
                  <div className="pt-2 mt-2 border-t border-slate-200">
                    <span className="text-xs text-slate-500 font-medium block mb-1">{isAr ? "ملاحظات:" : "Notes:"}</span>
                    <p className="text-xs font-bold text-slate-700">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            {isAr ? "لا يوجد مرضى مطابقين" : "No matching patients"}
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {editingPatient && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-orange-600 p-4 flex justify-between items-center text-white">
              <h3 className="font-black text-lg">
                {isAr ? "وصفة التغذية: " : "Diet Prescription: "} 
                {isAr ? editingPatient.nameAr : editingPatient.nameEn}
              </h3>
              <button onClick={() => setEditingPatient(null)} className="p-1 hover:bg-white/20 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form 
              className="p-5 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                saveDietOrder(
                  editingPatient.id, 
                  editingPatient.order.diet, 
                  editingPatient.order.allergy, 
                  editingPatient.order.notes
                );
                setEditingPatient(null);
              }}
            >
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">{isAr ? "نوع النظام الغذائي" : "Diet Type"}</label>
                <select 
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:border-orange-500 outline-none font-bold"
                  value={editingPatient.order.diet}
                  onChange={e => setEditingPatient({...editingPatient, order: {...editingPatient.order, diet: e.target.value}})}
                >
                  <option value="Normal">Normal (عادي)</option>
                  <option value="Diabetic">Diabetic (سكري)</option>
                  <option value="Cardiac / Low Sodium">Cardiac / Low Sodium (قلب/قليل الصوديوم)</option>
                  <option value="Renal">Renal (كلوي)</option>
                  <option value="Soft">Soft (لين)</option>
                  <option value="Clear Liquid">Clear Liquid (سوائل صافية)</option>
                  <option value="Full Liquid">Full Liquid (سوائل كاملة)</option>
                  <option value="NPO">NPO (صائم)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">{isAr ? "حساسية الطعام" : "Food Allergies"}</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:border-orange-500 outline-none font-bold"
                  value={editingPatient.order.allergy}
                  placeholder={isAr ? "مثال: مكسرات، ألبان، لا يوجد" : "e.g., Peanuts, Dairy, None"}
                  onChange={e => setEditingPatient({...editingPatient, order: {...editingPatient.order, allergy: e.target.value}})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">{isAr ? "ملاحظات التغذية" : "Nutrition Notes"}</label>
                <textarea 
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:border-orange-500 outline-none font-bold h-24 resize-none"
                  value={editingPatient.order.notes}
                  placeholder={isAr ? "ملاحظات إضافية للمطبخ أو التمريض..." : "Additional notes for kitchen or nursing..."}
                  onChange={e => setEditingPatient({...editingPatient, order: {...editingPatient.order, notes: e.target.value}})}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-xl font-bold transition">
                  {isAr ? "حفظ" : "Save"}
                </button>
                <button type="button" onClick={() => setEditingPatient(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-bold transition">
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

function PatientsMealsDeliverySheet({ isAr, inpatients, dietOrders, settings, getSetting, saveSetting }: any) {
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedDay, setSelectedDay] = useState(String(new Date().getDate()));
  const [selectedMonth, setSelectedMonth] = useState("2026-05");
  const [mealType, setMealType] = useState("lunch");
  const [showArchive, setShowArchive] = useState(false);
  const [archive, setArchive] = useState<any[]>([]);

  // Interactive meals list state
  const [mealsList, setMealsList] = useState<any[]>([]);

  // Manual input fields state
  const [manualName, setManualName] = useState("");
  const [manualMRN, setManualMRN] = useState("");
  const [manualDept, setManualDept] = useState("Ward");
  const [manualDiet, setManualDiet] = useState("Normal");
  const [manualNotes, setManualNotes] = useState("");

  // Archive search and filter states
  const [archiveSearchTerm, setArchiveSearchTerm] = useState("");
  const [archiveFilterDept, setArchiveFilterDept] = useState("All");
  const [archiveFilterMeal, setArchiveFilterMeal] = useState("All");
  const [archiveFilterDate, setArchiveFilterDate] = useState("");
  
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Patient_Meals_${selectedDay}_${selectedMonth}`,
  });

  // Load archive on mount
  useEffect(() => {
    getSetting("hospital_patient_meals_archive").then(saved => {
      if (saved) {
        setArchive(saved);
      }
    });
  }, [getSetting]);

  // Sync mealsList with current selections of Day/Month/Meal/Dept
  useEffect(() => {
    const key = `meals_sheet_${selectedDay}_${selectedMonth}_${mealType}_${selectedDept}`;
    getSetting(key).then(saved => {
      if (saved) {
        setMealsList(saved);
      } else {
        setMealsList([]);
      }
    });
  }, [selectedDay, selectedMonth, mealType, selectedDept, getSetting]);

  // Pull data automatically from active clinical patient records
  const handleAutoPull = () => {
    const activeInpatients = selectedDept === "All" 
      ? inpatients 
      : inpatients.filter((p: any) => (p.department || "Ward") === selectedDept);
      
    if (activeInpatients.length === 0) {
      toast.warning(isAr ? "لا يوجد أي مرضى مسجلين في هذا القسم حالياً." : "No active patients registered in this department currently.");
      return;
    }

    const pulled = activeInpatients.map((p: any) => ({
      id: p.id,
      nameAr: p.nameAr,
      nameEn: p.nameEn,
      mrn: p.mrn,
      department: p.department || "Ward",
      room: p.room || "101",
      diet: dietOrders[p.id]?.diet || "Normal",
      status: "Pending", // Pending, Delivered, Refused, NPO
      notes: dietOrders[p.id]?.notes || "",
      isManual: false
    }));

    setMealsList(pulled);
    
    // Auto-save key to retain state
    const key = `meals_sheet_${selectedDay}_${selectedMonth}_${mealType}_${selectedDept}`;
    saveSetting(key, pulled);

    toast.success(isAr 
      ? `تم سحب بيانات ${pulled.length} من المرضى المتواجدين في النظام بنجاح!` 
      : `Successfully auto-pulled ${pulled.length} hospitalized patients from clinical system!`
    );
  };

  // Add custom manual patient row
  const handleAddManualRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName) {
      toast.error(isAr ? "الرجاء إدخال اسم المريض" : "Please enter patient name");
      return;
    }

    const newRow = {
      id: `manual-${Date.now()}`,
      nameAr: manualName,
      nameEn: manualName,
      mrn: manualMRN || "Manual Entry",
      department: manualDept,
      room: "—",
      diet: manualDiet,
      status: "Pending",
      notes: manualNotes,
      isManual: true
    };

    const updated = [...mealsList, newRow];
    setMealsList(updated);

    const key = `meals_sheet_${selectedDay}_${selectedMonth}_${mealType}_${selectedDept}`;
    saveSetting(key, updated);

    // Reset fields
    setManualName("");
    setManualMRN("");
    setManualNotes("");
    toast.success(isAr ? "تمت إضافة المريض ووجبته يدوياً للشيت!" : "Patient and diet order manually added to sheet!");
  };

  // Save current sheet modifications
  const handleSaveSheet = () => {
    const key = `meals_sheet_${selectedDay}_${selectedMonth}_${mealType}_${selectedDept}`;
    saveSetting(key, mealsList);
    toast.success(isAr ? "تم حفظ التعديلات والوجبات الحالية للشيت بنجاح!" : "Current meal sheet changes saved successfully!");
  };

  // Modify row state interactively
  const handleRowChange = (rowId: string, field: string, value: any) => {
    const updated = mealsList.map(item => {
      if (item.id === rowId) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setMealsList(updated);
  };

  // Delete row
  const handleRemoveRow = (rowId: string) => {
    const updated = mealsList.filter(item => item.id !== rowId);
    setMealsList(updated);
    const key = `meals_sheet_${selectedDay}_${selectedMonth}_${mealType}_${selectedDept}`;
    saveSetting(key, updated);
    toast.info(isAr ? "تم إزالة السطر من الجدول" : "Row removed from table");
  };

  // Save sheet permanently to official archive history
  const saveToArchive = () => {
    if (mealsList.length === 0) {
      toast.error(isAr ? "لا يمكن أرشفة شيت فارغ. يرجى ملء الشيت أولاً." : "Cannot archive an empty sheet. Please populate first.");
      return;
    }

    const newRecord = {
      id: Date.now().toString(),
      dateUpdated: new Date().toISOString(),
      department: selectedDept,
      day: selectedDay,
      month: selectedMonth,
      mealType: mealType,
      data: mealsList
    };

    const updated = [newRecord, ...archive];
    setArchive(updated);
    saveSetting("hospital_patient_meals_archive", updated);
    toast.success(isAr ? "تم إرسال الشيت إلى الأرشيف التاريخي بنجاح!" : "Sheet committed to historical archives successfully!");
  };

  const departments = Array.from(new Set(inpatients.map((p: any) => p.department || "Ward")));

  // Filter archived records
  const filteredArchive = archive.filter((rec: any) => {
    if (archiveFilterDept !== "All" && rec.department !== archiveFilterDept) return false;
    if (archiveFilterMeal !== "All" && rec.mealType !== archiveFilterMeal) return false;
    if (archiveFilterDate && !`${rec.day}/${rec.month}`.includes(archiveFilterDate) && !rec.month.includes(archiveFilterDate)) return false;
    if (archiveSearchTerm) {
      const term = archiveSearchTerm.toLowerCase();
      const hasMatch = rec.data.some((d: any) => 
        (d.nameAr && d.nameAr.toLowerCase().includes(term)) || 
        (d.nameEn && d.nameEn.toLowerCase().includes(term)) || 
        (d.mrn && d.mrn.toLowerCase().includes(term))
      );
      if (!hasMatch) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in text-right">
      {/* Top Controls Grid */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center no-print">
        <div className="flex flex-wrap items-center gap-3 justify-start w-full xl:w-auto">
          {/* Date Picker */}
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
             <Calendar className="w-4 h-4 text-slate-500" />
             <select className="bg-transparent font-bold text-xs outline-none cursor-pointer text-slate-700" value={selectedDay} onChange={e => setSelectedDay(e.target.value)}>
                {Array.from({length: 31}).map((_, i) => <option key={i} value={i+1}>{i+1}</option>)}
             </select>
             <span className="text-slate-300">/</span>
             <select className="bg-transparent font-bold text-xs outline-none cursor-pointer text-slate-700" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
                {["2026-05", "2026-06", "2026-07"].map(m => <option key={m} value={m}>{m}</option>)}
             </select>
          </div>

          {/* Meal Type Select */}
          <select 
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-xs outline-none focus:border-orange-500 text-slate-700" 
            value={mealType} 
            onChange={e => setMealType(e.target.value)}
          >
             <option value="breakfast">{isAr ? "وجبة الفطور" : "Breakfast"}</option>
             <option value="lunch">{isAr ? "وجبة الغداء" : "Lunch"}</option>
             <option value="dinner">{isAr ? "وجبة العشاء" : "Dinner"}</option>
          </select>

          {/* Department Select */}
          <select 
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-xs outline-none focus:border-orange-500 text-slate-700" 
            value={selectedDept} 
            onChange={e => setSelectedDept(e.target.value)}
          >
             <option value="All">{isAr ? "كل الأقسام" : "All Departments"}</option>
             {departments.map((d: any) => <option key={d} value={d}>{d}</option>)}
          </select>

          {/* Auto-Pull Button */}
          <button 
            onClick={handleAutoPull} 
            type="button"
            className="flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 px-3 py-2 rounded-xl font-bold text-xs transition cursor-pointer"
            title={isAr ? "سحب وجبات المرضى المنومين تلقائياً من الملف السريري" : "Automatically fetch active patient clinical diets"}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isAr ? "سحب تلقائي من النظام" : "Auto-Pull System Data"}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
          <button 
            onClick={handleSaveSheet} 
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer"
          >
            <Save className="w-4 h-4 text-slate-500" />
            <span>{isAr ? "حفظ التعديلات" : "Save Changes"}</span>
          </button>
          <button 
            onClick={saveToArchive} 
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold text-xs transition shadow-sm cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isAr ? "اعتماد وأرشفة اليوم" : "Commit & Archive"}</span>
          </button>
          <button 
            onClick={() => setShowArchive(true)} 
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-xl font-bold text-xs transition border border-orange-200 cursor-pointer"
          >
            <Archive className="w-4 h-4" />
            <span>{isAr ? "أرشيف الأيام السابقة" : "Archives Registry"}</span>
          </button>
          <button 
            onClick={handlePrint} 
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-xs transition shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{isAr ? "طباعة الشيت" : "Print Sheet"}</span>
          </button>
        </div>
      </div>

      {/* Manual Entry Row Adding Panel */}
      <form onSubmit={handleAddManualRow} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-5 gap-3 items-end no-print">
        <div className="col-span-1 md:col-span-2 text-right">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">{isAr ? "اسم مريض وجبة جديد (يدوي)" : "Patient Name (Manual)"}</label>
          <input 
            type="text" 
            placeholder={isAr ? "أدخل اسم المريض..." : "Patient name..."} 
            value={manualName} 
            onChange={e => setManualName(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-orange-500 text-right"
          />
        </div>
        <div className="text-right">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">MRN</label>
          <input 
            type="text" 
            placeholder="MRN..." 
            value={manualMRN} 
            onChange={e => setManualMRN(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 outline-none focus:border-orange-500 text-center"
          />
        </div>
        <div className="text-right">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">{isAr ? "النظام الغذائي" : "Diet"}</label>
          <select 
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-orange-500 text-right"
            value={manualDiet} 
            onChange={e => setManualDiet(e.target.value)}
          >
            <option value="Normal">{isAr ? "عادي (Normal)" : "Normal"}</option>
            <option value="Diabetic">{isAr ? "سكري (Diabetic)" : "Diabetic"}</option>
            <option value="Hypertension">{isAr ? "ضغط دم (Hypertension)" : "Hypertension"}</option>
            <option value="Renal">{isAr ? "كلوي (Renal)" : "Renal"}</option>
            <option value="Soft">{isAr ? "لين (Soft)" : "Soft"}</option>
            <option value="NPO">{isAr ? "صائم (NPO)" : "NPO"}</option>
          </select>
        </div>
        <button 
          type="submit" 
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-2 font-bold text-xs transition flex items-center justify-center gap-1.5 h-9 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? "إضافة للجدول" : "Add to Sheet"}</span>
        </button>
      </form>

      {/* Main Table with Scroll Container to avoid white spaces */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:border-none">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center no-print">
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
            {isAr ? "جدول استلام ومتابعة وجبات المرضى بالقسم" : "Wards Patient Meals Distribution Checklist"}
          </span>
          <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg">
            {mealsList.length} {isAr ? "مريض في القائمة" : "Patients listed"}
          </span>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-x-auto overflow-y-auto max-h-[480px] xl:max-h-[550px] custom-scrollbar" ref={printRef}>
          {/* Printable Header */}
          <div className="hidden print:block mb-8 border-b-2 border-slate-800 pb-4 p-4 text-right">
            <div className="flex justify-between items-end">
              <div className="text-right">
                <h1 className="text-lg sm:text-2xl font-black">{settings.institutionNameAr || "مجمع الشفاء الطبي الدولي"}</h1>
                <h2 className="text-sm font-bold text-slate-600">{settings.institutionNameEn || "Al-Shifa International Hospital"}</h2>
                <p className="text-xs text-slate-400 mt-1">{isAr ? "قسم التغذية الطبية والعلاجية" : "Clinical Dietetics Department"}</p>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-black">{isAr ? "شيت تسليم الوجبات اليومي للمرضى" : "Inpatient Meals Distribution Sheet"}</h3>
                <p className="text-xs font-bold mt-1 font-mono text-slate-700">
                  {selectedDay} / {selectedMonth} | {mealType.toUpperCase()} | {selectedDept}
                </p>
              </div>
            </div>
          </div>

          {mealsList.length === 0 ? (
            <div className="text-center py-20 bg-white">
              <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-extrabold text-slate-700 text-sm">{isAr ? "شيت وجبات فارغ" : "Empty Meal Sheet"}</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto text-center">
                {isAr 
                  ? "انقر على زر 'سحب تلقائي من النظام' لتعبئة القائمة بمرضى الأقسام والمنومين تلقائياً، أو قم بإضافة مرضى يدوياً." 
                  : "Click 'Auto-Pull System Data' to fetch active inpatients or add custom records manually above."}
              </p>
            </div>
          ) : (
            <table className="w-full text-right text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-black border-b border-slate-200">
                  <th className="border border-slate-200 px-3 py-3 w-12 text-center">#</th>
                  <th className="border border-slate-200 px-3 py-3 text-right">{isAr ? "اسم المريض" : "Patient Name"}</th>
                  <th className="border border-slate-200 px-3 py-3 w-28 text-center font-mono">MRN</th>
                  <th className="border border-slate-200 px-3 py-3 w-28 text-center">{isAr ? "القسم" : "Department"}</th>
                  <th className="border border-slate-200 px-3 py-3 w-36 text-center">{isAr ? "النظام الغذائي" : "Diet Order"}</th>
                  <th className="border border-slate-200 px-3 py-3 w-36 text-center">{isAr ? "حالة الاستلام" : "Delivery Status"}</th>
                  <th className="border border-slate-200 px-3 py-3 text-right">{isAr ? "ملاحظات التغذية السريرية" : "Clinical Nutrition Notes"}</th>
                  <th className="border border-slate-200 px-3 py-3 w-12 text-center no-print"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 font-bold text-slate-800">
                {mealsList.map((item, idx) => (
                  <tr key={item.id} className={`${item.isManual ? "bg-amber-50/20" : ""} hover:bg-slate-55 hover:bg-slate-50/50`}>
                    <td className="border border-slate-200 px-3 py-2.5 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="border border-slate-200 px-3 py-2.5 text-right font-extrabold text-slate-900">
                      {isAr ? item.nameAr : item.nameEn}
                      {item.isManual && (
                        <span className="mr-2 bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.5 rounded font-black no-print">
                          {isAr ? "يدوي" : "Manual"}
                        </span>
                      )}
                    </td>
                    <td className="border border-slate-200 px-3 py-2.5 text-center font-mono text-slate-500 font-extrabold">{item.mrn}</td>
                    <td className="border border-slate-200 px-3 py-2.5 text-center text-indigo-600">{item.department}</td>
                    
                    {/* Editable Diet Order column */}
                    <td className="border border-slate-200 px-2 py-1.5 text-center no-print">
                      <select 
                        value={item.diet} 
                        onChange={e => handleRowChange(item.id, "diet", e.target.value)}
                        className="w-full bg-slate-50 hover:bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-black text-slate-700 outline-none focus:ring-1 focus:ring-orange-500 text-right"
                      >
                        <option value="Normal">Normal (عادي)</option>
                        <option value="Diabetic">Diabetic (سكري)</option>
                        <option value="Hypertension">Hypertension (ضغط)</option>
                        <option value="Renal">Renal (كلوي)</option>
                        <option value="Soft">Soft (لين)</option>
                        <option value="Clear Liquid">Clear Liquid (سوائل)</option>
                        <option value="NPO">NPO (صائم)</option>
                      </select>
                    </td>
                    <td className="border border-slate-200 px-2 py-1.5 text-center hidden print:table-cell text-orange-700 font-extrabold">
                      {item.diet}
                    </td>

                    {/* Editable Delivery Status column */}
                    <td className="border border-slate-200 px-2 py-1.5 text-center no-print">
                      <select 
                        value={item.status} 
                        onChange={e => handleRowChange(item.id, "status", e.target.value)}
                        className={`w-full bg-slate-50 border rounded-lg p-1.5 text-xs font-black outline-none focus:ring-1 focus:ring-orange-500 text-right ${
                          item.status === "Delivered" ? "border-emerald-200 text-emerald-700 bg-emerald-50/20" :
                          item.status === "Refused" ? "border-rose-200 text-rose-700 bg-rose-50/20" :
                          item.status === "NPO" ? "border-purple-200 text-purple-700 bg-purple-50/20" :
                          "border-slate-200 text-slate-600"
                        }`}
                      >
                        <option value="Pending">{isAr ? "معلق ⏳" : "Pending ⏳"}</option>
                        <option value="Delivered">{isAr ? "تم التسليم ✓" : "Delivered ✓"}</option>
                        <option value="Refused">{isAr ? "تم الرفض ✗" : "Refused ✗"}</option>
                        <option value="NPO">{isAr ? "صائم NPO" : "NPO"}</option>
                      </select>
                    </td>
                    <td className="border border-slate-200 px-2 py-1.5 text-center hidden print:table-cell font-bold">
                      {item.status === "Delivered" ? (isAr ? "تم التسليم" : "Delivered") : 
                       item.status === "Refused" ? (isAr ? "تم الرفض" : "Refused") : 
                       item.status === "NPO" ? (isAr ? "صائم" : "NPO") : (isAr ? "معلق" : "Pending")}
                    </td>

                    {/* Editable notes column */}
                    <td className="border border-slate-200 px-2 py-1.5 text-right no-print">
                      <input 
                        type="text" 
                        value={item.notes} 
                        onChange={e => handleRowChange(item.id, "notes", e.target.value)}
                        placeholder={isAr ? "تعليمات المطبخ، الحساسية..." : "Kitchen or clinical guidance..."}
                        className="w-full bg-slate-50 hover:bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 outline-none focus:border-orange-500 text-right font-bold"
                      />
                    </td>
                    <td className="border border-slate-200 px-3 py-2.5 text-right hidden print:table-cell text-xs font-medium text-slate-500">
                      {item.notes}
                    </td>

                    {/* Delete column */}
                    <td className="border border-slate-200 px-2 py-1.5 text-center no-print">
                      <button 
                        onClick={() => handleRemoveRow(item.id)}
                        className="p-1 hover:bg-rose-50 text-rose-500 hover:text-rose-600 rounded-lg transition cursor-pointer"
                        title={isAr ? "حذف هذا السطر" : "Remove Row"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Advanced Archives Modal with robust date & patient MRN queries */}
      {showArchive && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-dropdown flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-5xl w-full flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
              <div className="flex items-center gap-2 text-right">
                <Archive className="w-5 h-5 text-orange-600" />
                <h3 className="font-black text-slate-900 text-sm">
                  {isAr ? "أرشيف وسجلات تسليم وجبات المرضى التاريخية" : "Patients Nutrition Logs Historical Archive"}
                </h3>
              </div>
              <button 
                onClick={() => setShowArchive(false)}
                className="p-2 hover:bg-slate-200 rounded-xl transition text-slate-400 hover:text-slate-600 cursor-pointer text-left"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Archive Query Filters Panel */}
            <div className="p-4 bg-slate-100 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-right">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">{isAr ? "البحث باسم المريض أو MRN" : "Search Patient Name or MRN"}</label>
                <input 
                  type="text" 
                  value={archiveSearchTerm} 
                  onChange={e => setArchiveSearchTerm(e.target.value)}
                  placeholder={isAr ? "بحث بالاسم أو رقم الملف..." : "Search name or MRN..."}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-orange-500 text-right"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">{isAr ? "فلترة حسب تاريخ اليوم" : "Query Specific Date"}</label>
                <input 
                  type="text" 
                  value={archiveFilterDate} 
                  onChange={e => setArchiveFilterDate(e.target.value)}
                  placeholder="e.g. 15/2026-05, 2026-06..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-orange-500 text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">{isAr ? "تحديد القسم" : "Department Filter"}</label>
                <select 
                  value={archiveFilterDept} 
                  onChange={e => setArchiveFilterDept(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-orange-500 text-right"
                >
                  <option value="All">{isAr ? "كل الأقسام" : "All Departments"}</option>
                  {departments.map((d: any) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">{isAr ? "نوع الوجبة" : "Meal Type"}</label>
                <select 
                  value={archiveFilterMeal} 
                  onChange={e => setArchiveFilterMeal(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-orange-500 text-right"
                >
                  <option value="All">{isAr ? "كل الوجبات" : "All Meals"}</option>
                  <option value="breakfast">{isAr ? "فطور" : "Breakfast"}</option>
                  <option value="lunch">{isAr ? "غداء" : "Lunch"}</option>
                  <option value="dinner">{isAr ? "عشاء" : "Dinner"}</option>
                </select>
              </div>
            </div>

            {/* Scrollable Archive Results List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50 custom-scrollbar">
              {filteredArchive.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                  <Archive className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-bold text-center">{isAr ? "لم يتم العثور على أي شيتات مطابقة لخيارات الاستعلام." : "No historical meal sheets matching your query parameters."}</p>
                </div>
              ) : (
                filteredArchive.map((rec: any) => (
                  <div key={rec.id} className="border border-slate-200 rounded-2xl p-4 bg-white hover:border-orange-300 transition-all shadow-xs text-right">
                    <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-100 flex-wrap gap-2">
                      <div className="text-right">
                        <div className="font-extrabold text-slate-900 text-sm">
                          {isAr ? "تاريخ شيت الوجبات:" : "Log Date:"} <span className="text-orange-600">{rec.day} / {rec.month}</span>
                        </div>
                        <div className="text-xs text-slate-500 font-bold mt-1.5 flex gap-2 justify-start">
                          <span>{isAr ? "الوجبة:" : "Meal:"} <strong className="text-slate-800 uppercase">{rec.mealType}</strong></span>
                          <span>•</span>
                          <span>{isAr ? "القسم الرئيسي:" : "Dept:"} <strong className="text-indigo-600">{rec.department}</strong></span>
                        </div>
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] font-mono text-slate-400 block">{isAr ? "تاريخ الحفظ والتدقيق:" : "Archived Timestamp:"}</span>
                        <span className="text-xs font-bold text-slate-600 font-mono">{new Date(rec.dateUpdated).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Chronological Table scrollable container inside each card */}
                    <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl custom-scrollbar">
                      <table className="w-full text-xs text-right border-collapse">
                        <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-500 font-bold">
                          <tr>
                            <th className="p-2 border-l w-12 text-center">#</th>
                            <th className="p-2 text-right">{isAr ? "اسم المريض" : "Patient Name"}</th>
                            <th className="p-2 w-24 text-center font-mono">MRN</th>
                            <th className="p-2 w-32 text-center">{isAr ? "القسم" : "Department"}</th>
                            <th className="p-2 w-36 text-center">{isAr ? "النظام الغذائي" : "Diet"}</th>
                            <th className="p-2 w-28 text-center">{isAr ? "حالة التسليم" : "Status"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-700 text-right">
                          {rec.data.map((d: any, i: number) => (
                            <tr key={d.id ? `${d.id}-${i}` : `diet-${i}`} className="hover:bg-slate-55 hover:bg-slate-50/50">
                              <td className="p-2 border-l text-center font-mono text-slate-400">{i + 1}</td>
                              <td className="p-2 text-right font-bold text-slate-800">{isAr ? d.nameAr : d.nameEn}</td>
                              <td className="p-2 text-center font-mono text-slate-500">{d.mrn}</td>
                              <td className="p-2 text-center text-indigo-500">{d.department}</td>
                              <td className="p-2 text-center text-orange-600 font-bold">{d.diet}</td>
                              <td className="p-2 text-center">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                                  d.status === "Delivered" ? "bg-emerald-100 text-emerald-800" :
                                  d.status === "Refused" ? "bg-rose-100 text-rose-800" :
                                  d.status === "NPO" ? "bg-purple-100 text-purple-800" :
                                  "bg-slate-100 text-slate-500"
                                }`}>
                                  {d.status || "Pending"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-3 flex justify-end gap-2">
                      <button 
                        onClick={() => {
                          // Restore sheet to active mealsList
                          setMealsList(rec.data);
                          setSelectedDay(rec.day);
                          setSelectedMonth(rec.month);
                          setMealType(rec.mealType);
                          setSelectedDept(rec.department);
                          setShowArchive(false);
                          toast.success(isAr ? "تم استرجاع شيت الوجبات المحدد للجدول النشط للعمل عليه!" : "Restored meal sheet to active editor!");
                        }}
                        className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-xl text-[10px] font-black cursor-pointer transition"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{isAr ? "استرجاع وتعديل الشيت" : "Restore & Edit"}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EnteralMonitoring({ isAr }: { isAr: boolean }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 animate-fade-in">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
          <Droplet className="w-5 h-5 sm:w-8 sm:h-8 text-blue-500" />
          <h3 className="text-xl font-black text-slate-800">{isAr ? "مراقبة التغذية الأنبوبية والوريدية (TPN)" : "Enteral & Parenteral (TPN) Monitoring"}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-blue-100 bg-blue-50/30 p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
            <h4 className="font-bold text-blue-800 text-lg mb-2">Patient: Khalid Ibrahim</h4>
            <p className="text-sm text-slate-600 mb-4 font-medium">ICU - Bed 04 • MRN: 881290</p>
            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-500">Formula:</span>
                  <span className="font-bold text-slate-800">Osmolite 1.5 Cal</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-500">Rate:</span>
                  <span className="font-bold text-blue-600">65 mL/hr</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-500">Route:</span>
                  <span className="font-bold text-slate-800">NG Tube</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-500">Progress:</span>
                  <span className="font-bold text-emerald-600">750 / 1500 mL (50%)</span>
                </div>
            </div>
            <div className="mt-4 w-full bg-slate-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full w-1/2"></div>
            </div>
            <button className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl transition">
                {isAr ? "تحديث الضخ" : "Update Infusion"}
            </button>
          </div>
      </div>
    </div>
  );
}

function EmployeeMealsDeliverySheet({ isAr, settings, getSetting, saveSetting }: any) {
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedDay, setSelectedDay] = useState(String(new Date().getDate()));
  const [selectedMonth, setSelectedMonth] = useState("2026-05");
  const [mealType, setMealType] = useState("lunch");
  const [showArchive, setShowArchive] = useState(false);
  const [archive, setArchive] = useState<any[]>([]);
  
  // sample employees for demo
  const [employees] = useState([
    { id: "E101", nameAr: "أحمد محمود", nameEn: "Ahmed Mahmoud", department: "ICU", role: "Nurse" },
    { id: "E102", nameAr: "سارة علي", nameEn: "Sarah Ali", department: "ICU", role: "Nurse" },
    { id: "E103", nameAr: "محمد حسن", nameEn: "Mohamed Hassan", department: "ER", role: "Doctor" },
    { id: "E104", nameAr: "فاطمة أحمد", nameEn: "Fatma Ahmed", department: "Surgery", role: "Surgeon" },
    { id: "E105", nameAr: "عمر خالد", nameEn: "Omar Khaled", department: "Ward A", role: "Nurse" },
    { id: "E106", nameAr: "مريم يوسف", nameEn: "Maryam Youssef", department: "Ward A", role: "Nurse" },
  ]);

  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Employee_Meals_${selectedDay}_${selectedMonth}`,
  });

  useEffect(() => {
    getSetting("hospital_employee_meals_archive").then(saved => {
      if (saved) setArchive(saved);
    });
  }, [getSetting]);

  const saveToArchive = () => {
    if (employees.length === 0) return;
    const newRecord = {
      id: Date.now().toString(),
      dateUpdated: new Date().toISOString(),
      department: selectedDept,
      day: selectedDay,
      month: selectedMonth,
      mealType: mealType,
      data: displayEmployees
    };
    const updated = [newRecord, ...archive];
    setArchive(updated);
    saveSetting("hospital_employee_meals_archive", updated);
    alert(isAr ? "تم الأرشفة بنجاح" : "Archived successfully");
  };

  const departments = Array.from(new Set(employees.map(e => e.department)));
  
  const displayEmployees = selectedDept === "All" 
    ? employees 
    : employees.filter(e => e.department === selectedDept);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center no-print">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl">
             <Calendar className="w-5 h-5 text-slate-500 ml-1" />
             <select className="bg-transparent font-bold text-sm outline-none cursor-pointer" value={selectedDay} onChange={e => setSelectedDay(e.target.value)}>
                {Array.from({length: 31}).map((_, i) => <option key={i} value={i+1}>{i+1}</option>)}
             </select>
             <span className="text-slate-300">/</span>
             <select className="bg-transparent font-bold text-sm outline-none cursor-pointer" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
                {["2026-05", "2026-06", "2026-07"].map(m => <option key={m} value={m}>{m}</option>)}
             </select>
          </div>

          <select className="bg-white border border-slate-300 rounded-xl px-4 py-2 font-bold text-sm outline-none focus:border-orange-500" value={mealType} onChange={e => setMealType(e.target.value)}>
             <option value="breakfast">{isAr ? "فطور" : "Breakfast"}</option>
             <option value="lunch">{isAr ? "غداء" : "Lunch"}</option>
             <option value="dinner">{isAr ? "عشاء" : "Dinner"}</option>
             <option value="suhoor">{isAr ? "سحور" : "Suhoor"}</option>
          </select>

          <select className="bg-white border border-slate-300 rounded-xl px-4 py-2 font-bold text-sm outline-none focus:border-orange-500" value={selectedDept} onChange={e => setSelectedDept(e.target.value)}>
             <option value="All">{isAr ? "كل الأقسام" : "All Departments"}</option>
             {departments.map((d: any) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full xl:w-auto">
          <button onClick={handlePrint} className="flex-1 xl:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-sm transition shadow-sm">
            <Printer className="w-4 h-4" /> <span className="hidden sm:inline">{isAr ? "طباعة الشيت" : "Print Sheet"}</span>
          </button>
          <button onClick={saveToArchive} className="flex-1 xl:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition shadow-sm">
            <Save className="w-4 h-4" /> <span className="hidden sm:inline">{isAr ? "حفظ كأرشيف" : "Save Archive"}</span>
          </button>
          <button onClick={() => setShowArchive(true)} className="flex-1 xl:flex-none flex items-center justify-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-xl font-bold text-sm transition border border-orange-200">
            <Archive className="w-4 h-4" /> <span className="hidden sm:inline">{isAr ? "الأرشيف" : "Archives"}</span>
          </button>
        </div>
      </div>

      {/* Printable Area */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto print:shadow-none print:border-none print:p-0" ref={printRef}>
        <div className="hidden print:block mb-8 border-b-2 border-slate-800 pb-4">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-lg sm:text-2xl font-black">{settings?.institutionNameAr || "مستشفى النظام"}</h1>
              <h2 className="text-lg font-bold text-slate-600">{settings?.institutionNameEn || "Hospital System"}</h2>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-black">{isAr ? "سجل استلام وجبات الموظفين والمناوبين" : "Staff Meals Delivery Log"}</h3>
              <p className="text-sm font-bold mt-1">
                {isAr ? "التاريخ:" : "Date:"} {selectedDay} / {selectedMonth} | {isAr ? "الوجبة:" : "Meal:"} {mealType.toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        <table className="w-full text-right text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="border-2 border-slate-800 px-3 py-4 font-black w-16 text-center">#</th>
              <th className="border-2 border-slate-800 px-3 py-4 font-black w-64">{isAr ? "اسم الموظف" : "Employee Name"}</th>
              <th className="border-2 border-slate-800 px-3 py-4 font-black w-24">{isAr ? "الرقم الوظيفي" : "Emp ID"}</th>
              <th className="border-2 border-slate-800 px-3 py-4 font-black w-32">{isAr ? "القسم" : "Department"}</th>
              <th className="border-2 border-slate-800 px-3 py-4 font-black w-32">{isAr ? "المسمى" : "Role"}</th>
              <th className="border-2 border-slate-800 px-3 py-4 font-black w-48">{isAr ? "التوقيع بالاستلام" : "Signature"}</th>
            </tr>
          </thead>
          <tbody>
            {displayEmployees.map((e: any, idx: number) => (
              <tr key={e.id} className="hover:bg-slate-50">
                <td className="border-2 border-slate-800 px-3 py-3 text-center font-bold">{idx + 1}</td>
                <td className="border-2 border-slate-800 px-3 py-3 font-black">{isAr ? e.nameAr : e.nameEn}</td>
                <td className="border-2 border-slate-800 px-3 py-3 font-mono font-bold text-xs">{e.id}</td>
                <td className="border-2 border-slate-800 px-3 py-3 font-bold">{e.department}</td>
                <td className="border-2 border-slate-800 px-3 py-3 font-bold text-slate-600">{e.role}</td>
                <td className="border-2 border-slate-800 px-3 py-3"></td>
              </tr>
            ))}
            
            {/* Empty Rows for Print padding */}
            {Array.from({ length: Math.max(0, 15 - displayEmployees.length) }).map((_, i) => (
              <tr key={`empty-${i}`}>
                <td className="border-2 border-slate-800 px-3 py-6"></td>
                <td className="border-2 border-slate-800 px-3 py-6"></td>
                <td className="border-2 border-slate-800 px-3 py-6"></td>
                <td className="border-2 border-slate-800 px-3 py-6"></td>
                <td className="border-2 border-slate-800 px-3 py-6"></td>
                <td className="border-2 border-slate-800 px-3 py-6"></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="hidden print:flex justify-between mt-12 px-8">
          <div className="text-center">
            <div className="font-bold border-t-2 border-slate-400 pt-2 w-48 mx-auto">{isAr ? "مسئول الكافتيريا" : "Cafeteria Supervisor"}</div>
          </div>
          <div className="text-center">
            <div className="font-bold border-t-2 border-slate-400 pt-2 w-48 mx-auto">{isAr ? "رئيس التمريض / القسم" : "Head Nurse / Dept Head"}</div>
          </div>
        </div>
      </div>

      {/* Archives Modal */}
      {showArchive && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Archive className="w-5 h-5 text-orange-600" />
                {isAr ? "أرشيف استلام وجبات الموظفين" : "Staff Meals Archive"}
              </h3>
              <button onClick={() => setShowArchive(false)} className="p-2 hover:bg-slate-200 rounded-lg transition text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {archive.length === 0 ? (
                <div className="text-center py-12 text-slate-500 font-medium">
                  {isAr ? "لا توجد سجلات مؤرشفة" : "No archived records found"}
                </div>
              ) : (
                archive.map((rec: any, idx: number) => (
                  <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white hover:border-orange-300 transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="font-black text-slate-800 text-lg">
                          {rec.day} / {rec.month} - {rec.mealType.toUpperCase()}
                        </div>
                        <div className="text-sm font-bold text-slate-500 mt-1">
                          {isAr ? "القسم:" : "Dept:"} <span className="text-orange-600">{rec.department}</span>
                        </div>
                      </div>
                      <div className="text-xs font-mono text-slate-400">
                        {new Date(rec.dateUpdated).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-lg">
                      <table className="w-full text-sm text-right">
                        <thead className="bg-slate-50 sticky top-0">
                          <tr>
                            <th className="p-2 border-b">{isAr ? "الموظف" : "Employee"}</th>
                            <th className="p-2 border-b">ID</th>
                            <th className="p-2 border-b">{isAr ? "القسم" : "Dept"}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rec.data.map((d: any, i: number) => (
                            <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                              <td className="p-2 font-bold">{isAr ? d.nameAr : d.nameEn}</td>
                              <td className="p-2 font-mono text-xs">{d.id}</td>
                              <td className="p-2 font-bold text-slate-600">{d.department}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
