import React, { useState, useEffect } from "react";
import { GlobalEntityLink } from "./GlobalEntityLink";
import {
  FileBarChart,
  CheckCircle2,
  Clock,
  XCircle,
  FileWarning,
  Plus,
  Edit,
  Trash2,
  X
} from "lucide-react";
import { syncSetting, saveSetting } from "../lib/firestoreService";
import { toast } from "sonner";

interface ClaimItem {
  id: string;
  visitId: string;
  patient: string;
  insurance: string;
  status: "Draft" | "Sent" | "Paid" | "Rejected";
  amount: number;
}

export default function RCMClaims({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";
  const [claims, setClaims] = useState<ClaimItem[]>([]);
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentClaim, setCurrentClaim] = useState<Partial<ClaimItem>>({});

  useEffect(() => {
    const unsub = syncSetting("his_rcm_claims", (data) => {
      if (data?.value && Array.isArray(data.value)) {
        setClaims(data.value);
      } else {
        const seeded: ClaimItem[] = [
          {
            id: "CLM-9912",
            visitId: "VST-881",
            patient: "Ahmed Yassin",
            insurance: "Tawuniya",
            status: "Sent",
            amount: 1500,
          },
          {
            id: "CLM-9913",
            visitId: "VST-882",
            patient: "Sara Kamal",
            insurance: "Bupa",
            status: "Paid",
            amount: 4500,
          },
          {
            id: "CLM-9914",
            visitId: "VST-883",
            patient: "Mona Hassan",
            insurance: "Medgulf",
            status: "Rejected",
            amount: 200,
          },
        ];
        setClaims(seeded);
        saveSetting("his_rcm_claims", seeded);
      }
    });
    return () => unsub();
  }, []);

  const getStatusColor = (status: string) => {
    if (status === "Paid") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (status === "Sent") return "bg-blue-50 text-blue-700 border-blue-200";
    if (status === "Rejected") return "bg-rose-50 text-rose-700 border-rose-200";
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  const handleDelete = async (id: string) => {
    if (confirm(isAr ? "هل أنت متأكد من حذف هذه المطالبة؟" : "Are you sure you want to delete this claim?")) {
      const next = claims.filter(c => c.id !== id);
      setClaims(next);
      await saveSetting("his_rcm_claims", next);
      toast.success(isAr ? "تم الحذف بنجاح" : "Deleted successfully");
    }
  };

  const handleSaveModal = async () => {
    if (!currentClaim.patient || !currentClaim.amount) {
      toast.error(isAr ? "يرجى تعبئة الحقول المطلوبة" : "Please fill required fields");
      return;
    }

    let next: ClaimItem[];
    if (modalMode === "add") {
      next = [...claims, { 
        ...currentClaim, 
        id: `CLM-${Math.floor(1000 + Math.random() * 9000)}`,
        visitId: currentClaim.visitId || "VST-UNKNOWN",
        insurance: currentClaim.insurance || "Cash",
        status: currentClaim.status || "Draft"
      } as ClaimItem];
    } else {
      next = claims.map(c => c.id === currentClaim.id ? { ...c, ...currentClaim } as ClaimItem : c);
    }
    
    setClaims(next);
    await saveSetting("his_rcm_claims", next);
    setShowModal(false);
    toast.success(isAr ? "تم حفظ المطالبة بنجاح" : "Claim saved successfully");
  };

  const openAddModal = () => {
    setModalMode("add");
    setCurrentClaim({
      status: "Draft",
      amount: 0,
      visitId: "VST-" + Math.floor(1000 + Math.random() * 9000)
    });
    setShowModal(true);
  };

  const openEditModal = (c: ClaimItem) => {
    setModalMode("edit");
    setCurrentClaim(c);
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-black text-slate-800 text-lg">
                  {modalMode === "add" 
                    ? (isAr ? "إنشاء مطالبة جديدة" : "Create New Claim")
                    : (isAr ? "تعديل المطالبة" : "Edit Claim")
                  }
                </h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-500 transition">
                  <X className="w-5 h-5" />
                </button>
             </div>
             <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "اسم المريض" : "Patient Name"}</label>
                  <input type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-indigo-500 outline-none" 
                    value={currentClaim.patient || ""} onChange={e => setCurrentClaim({...currentClaim, patient: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "شركة التأمين" : "Insurance Company"}</label>
                  <input type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-indigo-500 outline-none" 
                    value={currentClaim.insurance || ""} onChange={e => setCurrentClaim({...currentClaim, insurance: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "المبلغ" : "Amount"}</label>
                  <input type="number" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-indigo-500 outline-none" 
                    value={currentClaim.amount || 0} onChange={e => setCurrentClaim({...currentClaim, amount: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "حالة المطالبة" : "Status"}</label>
                  <select className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-indigo-500 outline-none"
                    value={currentClaim.status || "Draft"} onChange={e => setCurrentClaim({...currentClaim, status: e.target.value as ClaimItem["status"]})}>
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Paid">Paid</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
             </div>
             <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
               <button onClick={() => setShowModal(false)} className="px-4 py-2 font-bold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition text-sm">
                 {isAr ? "إلغاء" : "Cancel"}
               </button>
               <button onClick={handleSaveModal} className="px-4 py-2 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition text-sm shadow-md">
                 {isAr ? "حفظ المطالبة" : "Save Claim"}
               </button>
             </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <FileBarChart className="h-7 w-7 text-indigo-600" />
            {isAr ? "إدارة دورة الإيرادات (RCM)" : "Revenue Cycle Management"}
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1">
            {isAr
              ? "دورة المطالبات التأمينية والمرتجعات"
              : "Claim generation, scrubbing, and remittance tracking."}
          </p>
        </div>
        <button onClick={openAddModal} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow flex items-center gap-2 transition whitespace-nowrap">
            <Plus className="h-4 w-4" /> {isAr ? "إنشاء مطالبة" : "Create Claim"}
        </button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-sm text-left" dir={isAr ? "rtl" : "ltr"}>
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-4 py-4">
                {isAr ? "رقم المطالبة" : "Claim ID"}
              </th>
              <th className="px-4 py-4">{isAr ? "المريض" : "Patient"}</th>
              <th className="px-4 py-4">{isAr ? "التأمين" : "Insurance"}</th>
              <th className="px-4 py-4">{isAr ? "المبلغ" : "Amount"}</th>
              <th className="px-4 py-4 text-center">
                {isAr ? "الحالة" : "Status"}
              </th>
              <th className="px-4 py-4 text-right">
                {isAr ? "إجراء" : "Actions"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {claims.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono font-bold text-indigo-600">
                  <GlobalEntityLink entityName={c.id} entityType="invoice" isAr={isAr}>
                    {c.id}
                  </GlobalEntityLink>
                </td>
                <td className="px-4 py-3 font-bold text-slate-800">
                  <GlobalEntityLink entityName={c.patient} entityType="patient" isAr={isAr}>
                    {c.patient}
                  </GlobalEntityLink>
                </td>
                <td className="px-4 py-3 font-bold text-slate-600 font-xs">
                  <GlobalEntityLink entityName={c.insurance} entityType="insurance" isAr={isAr}>
                    {c.insurance}
                  </GlobalEntityLink>
                </td>
                <td className="px-4 py-3 font-black text-slate-700">
                  {c.amount.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold border ${getStatusColor(c.status)}`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button onClick={() => openEditModal(c)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition" title={isAr ? "تعديل" : "Edit"}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition" title={isAr ? "حذف" : "Delete"}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {claims.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500 font-bold">
                  {isAr ? "لا توجد مطالبات" : "No claims found"}
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
