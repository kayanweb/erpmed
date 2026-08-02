import React, { useState, useEffect } from "react";
import { Users2, UserCheck, ShieldCheck, Plus, Edit, Trash2, X } from "lucide-react";
import { syncSetting, saveSetting } from "../lib/firestoreService";
import { toast } from "sonner";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  access: string;
}

export default function DoctorsStaffRegistry({
  language,
}: {
  language: "ar" | "en";
}) {
  const isAr = language === "ar";
  
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentStaff, setCurrentStaff] = useState<Partial<StaffMember>>({});

  useEffect(() => {
    const unsub = syncSetting("his_staff_registry", (data) => {
      if (data?.value && Array.isArray(data.value)) {
        setStaff(data.value);
      } else {
        const seeded: StaffMember[] = [
          { id: "ST-1", name: "Dr. Hisham", role: "Consultant", specialty: "Cardiology", access: "Full" },
          { id: "ST-2", name: "Nurse Salma", role: "Head Nurse", specialty: "ICU", access: "Restricted" },
          { id: "ST-3", name: "Dr. Sarah", role: "Specialist", specialty: "Dermatology", access: "Full" },
        ];
        setStaff(seeded);
        saveSetting("his_staff_registry", seeded);
      }
    });
    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm(isAr ? "هل أنت متأكد من حذف هذا الموظف؟" : "Are you sure you want to delete this staff member?")) {
      const next = staff.filter(s => s.id !== id);
      setStaff(next);
      await saveSetting("his_staff_registry", next);
      toast.success(isAr ? "تم الحذف بنجاح" : "Deleted successfully");
    }
  };

  const handleSaveModal = async () => {
    if (!currentStaff.name || !currentStaff.role || !currentStaff.specialty) {
      toast.error(isAr ? "يرجى تعبئة كافة الحقول" : "Please fill all fields");
      return;
    }

    let next: StaffMember[];
    if (modalMode === "add") {
      next = [...staff, { ...currentStaff, id: `ST-${Date.now()}` } as StaffMember];
    } else {
      next = staff.map(s => s.id === currentStaff.id ? { ...s, ...currentStaff } as StaffMember : s);
    }
    
    setStaff(next);
    await saveSetting("his_staff_registry", next);
    setShowModal(false);
    toast.success(isAr ? "تم الحفظ بنجاح" : "Saved successfully");
  };

  const openAddModal = () => {
    setModalMode("add");
    setCurrentStaff({
      role: "Specialist",
      access: "Restricted"
    });
    setShowModal(true);
  };

  const openEditModal = (s: StaffMember) => {
    setModalMode("edit");
    setCurrentStaff(s);
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
                    ? (isAr ? "إضافة موظف جديد" : "Add New Staff")
                    : (isAr ? "تعديل بيانات الموظف" : "Edit Staff Data")
                  }
                </h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-500 transition">
                  <X className="w-5 h-5" />
                </button>
             </div>
             <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "اسم الموظف / الطبيب" : "Name"}</label>
                  <input type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-emerald-500 outline-none" 
                    value={currentStaff.name || ""} onChange={e => setCurrentStaff({...currentStaff, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الدور (المسمى الوظيفي)" : "Role"}</label>
                  <input type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-emerald-500 outline-none" 
                    value={currentStaff.role || ""} onChange={e => setCurrentStaff({...currentStaff, role: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "التخصص / القسم" : "Specialty"}</label>
                  <input type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-emerald-500 outline-none" 
                    value={currentStaff.specialty || ""} onChange={e => setCurrentStaff({...currentStaff, specialty: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "مستوى الصلاحيات" : "System Access"}</label>
                  <select className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-emerald-500 outline-none"
                    value={currentStaff.access || ""} onChange={e => setCurrentStaff({...currentStaff, access: e.target.value})}>
                    <option value="Full">Full Access (Admin/HoD)</option>
                    <option value="Standard">Standard Access (Physician)</option>
                    <option value="Restricted">Restricted Access (Nurse/Staff)</option>
                  </select>
                </div>
             </div>
             <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
               <button onClick={() => setShowModal(false)} className="px-4 py-2 font-bold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition text-sm">
                 {isAr ? "إلغاء" : "Cancel"}
               </button>
               <button onClick={handleSaveModal} className="px-4 py-2 font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition text-sm shadow-md">
                 {isAr ? "حفظ" : "Save"}
               </button>
             </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Users2 className="h-7 w-7 text-emerald-600" />
            {isAr ? "سجل الموظفين والصلاحيات" : "Staff Directory & Roles"}
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1">
            {isAr
              ? "إدارة الأطباء، التمريض، وجداول العمل"
              : "RBAC mapping to HL7 practitioners."}
          </p>
        </div>
        <button onClick={openAddModal} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow flex items-center gap-2 transition whitespace-nowrap">
          <Plus className="h-4 w-4" />{" "}
          {isAr ? "إضافة موظف" : "Add Staff"}
        </button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-sm text-left" dir={isAr ? "rtl" : "ltr"}>
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-4 py-4">{isAr ? "الاسم" : "Name"}</th>
              <th className="px-4 py-4">{isAr ? "الدور" : "Role"}</th>
              <th className="px-4 py-4">{isAr ? "التخصص" : "Specialty"}</th>
              <th className="px-4 py-4 text-center">
                {isAr ? "الصلاحيات" : "Access"}
              </th>
              <th className="px-4 py-4 text-right">
                {isAr ? "إجراء" : "Actions"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staff.map(s => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-slate-800">{s.name}</td>
                <td className="px-4 py-3 font-bold text-slate-600 text-xs">
                  {s.role}
                </td>
                <td className="px-4 py-3 font-bold text-slate-600">{s.specialty}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`font-bold text-xs px-2 py-0.5 rounded border ${
                    s.access === 'Full' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                    s.access === 'Restricted' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                    'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {s.access}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button onClick={() => openEditModal(s)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition" title={isAr ? "تعديل" : "Edit"}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition" title={isAr ? "حذف" : "Delete"}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {staff.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500 font-bold">
                  {isAr ? "لا يوجد موظفين" : "No staff found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
</div>
      </div>
    </div>
  );
}
