import React, { useState, useEffect } from "react";
import { Grid, Stethoscope, BriefcaseMedical, Plus, Edit, Trash2, X } from "lucide-react";
import { syncSetting, saveSetting } from "../lib/firestoreService";
import { toast } from "sonner";

interface Department {
  id: string;
  name: string;
  hod: string;
  isClinical: boolean;
}

export default function DepartmentsManager({
  language,
}: {
  language: "ar" | "en";
}) {
  const isAr = language === "ar";
  
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentDept, setCurrentDept] = useState<Partial<Department>>({});

  useEffect(() => {
    const unsub = syncSetting("his_departments", (data) => {
      if (data?.value && Array.isArray(data.value)) {
        setDepartments(data.value);
      } else {
        const seeded: Department[] = [
          { id: "D-1", name: "Cardiology", hod: "Dr. Hisham", isClinical: true },
          { id: "D-2", name: "Internal Medicine", hod: "Dr. Sarah", isClinical: true },
          { id: "D-3", name: "IT Administration", hod: "Eng. Ahmed", isClinical: false },
        ];
        setDepartments(seeded);
        saveSetting("his_departments", seeded);
      }
    });
    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm(isAr ? "هل أنت متأكد من حذف هذا القسم؟" : "Are you sure you want to delete this department?")) {
      const next = departments.filter(d => d.id !== id);
      setDepartments(next);
      await saveSetting("his_departments", next);
      toast.info(isAr ? "تم حذف القسم بنجاح" : "Department deleted successfully");
    }
  };

  const handleSaveModal = async () => {
    if (!currentDept.name || !currentDept.hod) {
      toast.error(isAr ? "يرجى تعبئة كافة الحقول" : "Please fill all fields");
      return;
    }

    let next: Department[];
    if (modalMode === "add") {
      next = [...departments, { ...currentDept, id: `D-${Date.now()}`, isClinical: currentDept.isClinical ?? true } as Department];
    } else {
      next = departments.map(d => d.id === currentDept.id ? { ...d, ...currentDept } as Department : d);
    }
    
    setDepartments(next);
    await saveSetting("his_departments", next);
    setShowModal(false);
    toast.success(isAr ? "تم حفظ بيانات القسم بنجاح" : "Department saved successfully");
  };

  const openAddModal = () => {
    setModalMode("add");
    setCurrentDept({
      isClinical: true
    });
    setShowModal(true);
  };

  const openEditModal = (d: Department) => {
    setModalMode("edit");
    setCurrentDept(d);
    setShowModal(true);
  };

  return (
    <div
      className="p-4 md:p-6 bg-slate-50 min-h-full relative"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-modal flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-black text-slate-800 text-lg">
                  {modalMode === "add" 
                    ? (isAr ? "إضافة قسم جديد" : "Add New Department")
                    : (isAr ? "تعديل بيانات القسم" : "Edit Department")
                  }
                </h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-500 transition">
                  <X className="w-5 h-5" />
                </button>
             </div>
             <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "اسم القسم" : "Department Name"}</label>
                  <input type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-blue-500 outline-none" 
                    value={currentDept.name || ""} onChange={e => setCurrentDept({...currentDept, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "رئيس القسم (HoD)" : "Head of Department"}</label>
                  <input type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-blue-500 outline-none" 
                    value={currentDept.hod || ""} onChange={e => setCurrentDept({...currentDept, hod: e.target.value})} />
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                      checked={currentDept.isClinical || false} onChange={e => setCurrentDept({...currentDept, isClinical: e.target.checked})} />
                    <span className="text-sm font-bold text-slate-700">{isAr ? "قسم طبي / سريري (Clinical)" : "Clinical Department"}</span>
                  </label>
                </div>
             </div>
             <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
               <button onClick={() => setShowModal(false)} className="px-4 py-2 font-bold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition text-sm">
                 {isAr ? "إلغاء" : "Cancel"}
               </button>
               <button onClick={handleSaveModal} className="px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition text-sm shadow-md">
                 {isAr ? "حفظ" : "Save"}
               </button>
             </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Grid className="h-7 w-7 text-blue-600" />
            {isAr ? "الأقسام السريرية" : "Clinical Departments"}
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1">
            {isAr
              ? "إدارة وتصنيف الأقسام السريرية والإدارية"
              : "Routing and capability mappings for all IPD/OPD clinical services."}
          </p>
        </div>
        <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow flex items-center gap-2 transition whitespace-nowrap">
          <Plus className="h-4 w-4" />{" "}
          {isAr ? "إضافة قسم" : "Add Department"}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((d) => (
          <div key={d.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex justify-between group">
            <div className="flex gap-3">
              <div className={`${d.isClinical ? 'bg-blue-50' : 'bg-slate-50'} p-2 rounded-lg h-fit`}>
                {d.isClinical ? <Stethoscope className="w-5 h-5 text-blue-600" /> : <BriefcaseMedical className="w-5 h-5 text-slate-600" />}
              </div>
              <div>
                <div className="font-bold text-slate-800">{d.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  HoD: {d.hod} • Clinical: {d.isClinical ? "Yes" : "No"}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition">
               <button onClick={() => openEditModal(d)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition" title={isAr ? "تعديل" : "Edit"}>
                 <Edit className="w-3.5 h-3.5" />
               </button>
               <button onClick={() => handleDelete(d.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition" title={isAr ? "حذف" : "Delete"}>
                 <Trash2 className="w-3.5 h-3.5" />
               </button>
            </div>
          </div>
        ))}
        {departments.length === 0 && (
          <div className="col-span-3 text-center py-8 text-slate-500 font-bold">
            {isAr ? "لا توجد أقسام" : "No departments found"}
          </div>
        )}
      </div>
    </div>
  );
}
