import React, { useState, useEffect } from "react";
import { GlobalEntityLink } from "./GlobalEntityLink";
import {
  Activity,
  Plus,
  Search,
  FileText,
  FlaskConical,
  Stethoscope,
  Scissors,
  AlertTriangle,
  Pill,
  CheckCircle,
  Clock,
  Bed,
  Settings,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import { subscribeToClinicalData, saveDataPermanently, deleteDataPermanently } from "../lib/realTimeService";
import { useHIS } from "../context/HISContext";
import { toast } from "sonner";
import SearchableCombobox from "./SearchableCombobox";
import { LAB_CATALOG, RAD_CATALOG, PROC_CATALOG, MED_CATALOG } from "../data/medicalCatalog";

const presetOptions: Record<string, { value: string; ar: string; en: string }[]> = {
  Lab: LAB_CATALOG,
  Radiology: RAD_CATALOG,
  Medication: MED_CATALOG,
  Procedure: PROC_CATALOG,
  Admission: [
    { value: "Admission to Intensive Care Unit (ICU)", ar: "تنويم بوحدة العناية المركزة (ICU)", en: "Admission to Intensive Care Unit (ICU)" },
    { value: "Admission to Coronary Care Unit (CCU)", ar: "تنويم بوحدة رعاية القلب (CCU)", en: "Admission to Coronary Care Unit (CCU)" },
    { value: "Admission to Medical Ward", ar: "تنويم بقسم الباطنة العام", en: "Admission to Medical Ward" },
    { value: "Admission to Surgical Ward", ar: "تنويم بقسم الجراحة العام", en: "Admission to Surgical Ward" },
  ],
  Surgery: [
    { value: "Urgent Appendectomy", ar: "استئصال الزائدة الدودية العاجل", en: "Urgent Appendectomy" },
    { value: "Laparoscopic Cholecystectomy", ar: "استئصال المرارة بالمنظار", en: "Laparoscopic Cholecystectomy" },
    { value: "Coronary Artery Bypass Graft (CABG)", ar: "عملية قلب مفتوح وتوصيل الشرايين", en: "Coronary Artery Bypass Graft (CABG)" },
    { value: "Hernia Repair", ar: "إصلاح الفتق الجراحي", en: "Hernia Repair" },
  ]
};

interface Order {
  id: string;
  visitId: string;
  patientName: string;
  mrn: string;
  doctorId: string;
  orderType:
    | "Lab"
    | "Radiology"
    | "Medication"
    | "Procedure"
    | "Admission"
    | "Surgery";
  orderName: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  priority: "Routine" | "Urgent" | "STAT";
  createdAt: string;
}

export default function OrderManagementEngine({
  language,
  onClose,
}: {
  language: "ar" | "en";
  onClose?: () => void;
}) {
  const isAr = language === "ar";
  const { currentUser, logAudit, addCharge } = useHIS();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("All");

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentOrder, setCurrentOrder] = useState<Partial<Order>>({});

  useEffect(() => {
    const unsub = subscribeToClinicalData<Order>("hospital_cpoe_orders", (data) => {
      setOrders(data || []);
    }, (err) => {
      console.error("CPOE Sync Error:", err);
      toast.error(isAr ? "فشل مزامنة الطلبات" : "Failed to sync orders");
    });
    return () => unsub();
  }, [isAr]);

  const handleDelete = async (id: string) => {
    if (confirm(isAr ? "هل أنت متأكد من حذف هذا الطلب؟" : "Are you sure you want to delete this order?")) {
      try {
        await deleteDataPermanently("hospital_cpoe_orders", id);
        logAudit({
          action: 'ORDER_DELETION',
          entityType: 'ORDER',
          entityId: id,
          reason: 'Physician cancelled/deleted order'
        });
        toast.success(isAr ? "تم حذف الطلب" : "Order deleted");
      } catch (e) {
        toast.error(isAr ? "فشل الحذف" : "Deletion failed");
      }
    }
  };

  const handleSaveModal = async () => {
    if (!currentOrder.patientName || !currentOrder.orderName || !currentOrder.doctorId) {
      toast.error(isAr ? "يرجى تعبئة الحقول الأساسية" : "Please fill required fields");
      return;
    }

    try {
      const orderToSave = {
        ...currentOrder,
        id: modalMode === "add" ? `ORD-${Math.floor(1000 + Math.random() * 9000)}` : currentOrder.id!,
        createdAt: modalMode === "add" ? new Date().toISOString() : currentOrder.createdAt!
      } as Order;
      
      await saveDataPermanently("hospital_cpoe_orders", orderToSave);
      
      // ENTERPRISE WORKFLOW: Automated Charging & Integration
      const categoryMap: Record<string, any> = {
        "Lab": "lab",
        "Radiology": "radiology",
        "Medication": "medication",
        "Procedure": "procedure",
        "Admission": "room",
        "Surgery": "procedure"
      };

      // Record automated charge
      await addCharge({
        patientId: orderToSave.mrn,
        patientName: orderToSave.patientName,
        serviceId: orderToSave.id,
        serviceName: orderToSave.orderName,
        category: categoryMap[orderToSave.orderType] || "other",
        amount: 150.0, // In a real HIS, this would lookup the Price Master list
        staffId: currentUser?.id || "System",
        orderId: orderToSave.id
      });
      
      if (orderToSave.orderType === "Medication") {
        const marRecord = {
          id: `MAR-${orderToSave.id}-${Date.now()}`,
          patientId: orderToSave.mrn, // Using MRN as link
          patientName: orderToSave.patientName,
          medicationName: orderToSave.orderName,
          dosage: "As ordered", // Usually parsed from instructions
          route: "PO", // Default
          frequency: "STAT/PRN",
          scheduledTime: new Date().toISOString(),
          status: "pending",
          orderId: orderToSave.id
        };
        await saveDataPermanently("hospital_mar_records", marRecord);
        toast.info(isAr ? "تم إرسال الدواء لسجل التمريض (MAR)" : "Medication sent to Nursing MAR");
      }

      logAudit({
        action: modalMode === 'add' ? 'ORDER_CREATION' : 'ORDER_UPDATE',
        entityType: 'ORDER',
        entityId: orderToSave.id,
        reason: `Order ${orderToSave.orderName} ${modalMode === 'add' ? 'created' : 'updated'}`,
        newValue: orderToSave
      });

      setShowModal(false);
      toast.success(isAr ? "تم حفظ الطلب بنجاح" : "Order saved successfully");
    } catch (e) {
      toast.error(isAr ? "فشل حفظ الطلب" : "Failed to save order");
    }
  };

  const openAddModal = () => {
    setModalMode("add");
    setCurrentOrder({
      orderType: "Lab",
      orderName: isAr ? presetOptions["Lab"][0].ar : presetOptions["Lab"][0].en,
      status: "Pending",
      priority: "Routine",
      mrn: "MRN-" + Math.floor(1000 + Math.random() * 9000),
      visitId: "VST-" + Math.floor(100 + Math.random() * 900)
    });
    setShowModal(true);
  };

  const openEditModal = (o: Order) => {
    setModalMode("edit");
    setCurrentOrder(o);
    setShowModal(true);
  };

  const getOrderIcon = (type: string) => {
    switch (type) {
      case "Lab":
        return <FlaskConical className="w-4 h-4 text-purple-500" />;
      case "Radiology":
        return <Activity className="w-4 h-4 text-emerald-500" />;
      case "Medication":
        return <Pill className="w-4 h-4 text-blue-500" />;
      case "Procedure":
        return <Stethoscope className="w-4 h-4 text-orange-500" />;
      case "Admission":
        return <Bed className="w-4 h-4 text-indigo-500" />;
      case "Surgery":
        return <Scissors className="w-4 h-4 text-rose-500" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "STAT":
        return (
          <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-xs font-bold border border-rose-200">
            {priority}
          </span>
        );
      case "Urgent":
        return (
          <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-bold border border-orange-200">
            {priority}
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-bold border border-slate-200">
            {priority}
          </span>
        );
    }
  };

  const filtered = orders.filter(
    (o) =>
      (filterType === "All" || o.orderType === filterType) &&
      (o.patientName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        o.mrn?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        o.id?.toLowerCase()?.includes(searchTerm?.toLowerCase())),
  );

  return (
    <div
      className="p-4 md:p-6 bg-slate-50 min-h-full relative"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-modal flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-black text-slate-800 text-lg">
                  {modalMode === "add" 
                    ? (isAr ? "إنشاء طلب طبي جديد" : "Create New Medical Order")
                    : (isAr ? "تعديل الطلب" : "Edit Order")
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
                    value={currentOrder.patientName || ""} onChange={e => setCurrentOrder({...currentOrder, patientName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الطبيب المعالج" : "Ordering MD"}</label>
                  <input type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-indigo-500 outline-none" 
                    value={currentOrder.doctorId || ""} onChange={e => setCurrentOrder({...currentOrder, doctorId: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "نوع الطلب" : "Order Category"}</label>
                  <select className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-indigo-500 outline-none"
                    value={currentOrder.orderType || ""} 
                    onChange={e => {
                      const type = e.target.value as Order["orderType"];
                      const defaults = presetOptions[type] || [];
                      const defaultVal = defaults[0] ? (isAr ? defaults[0].ar : defaults[0].en) : "";
                      setCurrentOrder({...currentOrder, orderType: type, orderName: defaultVal});
                    }}>
                    <option value="Lab">Lab</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Medication">Medication</option>
                    <option value="Procedure">Procedure</option>
                    <option value="Admission">Admission</option>
                    <option value="Surgery">Surgery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "تفاصيل الطلب (الخدمة/الدواء)" : "Requested Item Details"}</label>
                  <SearchableCombobox
                    options={presetOptions[currentOrder.orderType || "Lab"] || []}
                    value={currentOrder.orderName || ""}
                    onChange={(val) => setCurrentOrder({...currentOrder, orderName: val})}
                    placeholder={isAr ? "ابحث عن الفحص أو الدواء أو الخدمة..." : "Search for item..."}
                    isAr={isAr}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "حالة الطلب" : "Status"}</label>
                  <select className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-indigo-500 outline-none"
                    value={currentOrder.status || ""} onChange={e => setCurrentOrder({...currentOrder, status: e.target.value as Order["status"]})}>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "درجة الأهمية" : "Priority"}</label>
                  <select className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-indigo-500 outline-none"
                    value={currentOrder.priority || ""} onChange={e => setCurrentOrder({...currentOrder, priority: e.target.value as Order["priority"]})}>
                    <option value="Routine">Routine</option>
                    <option value="Urgent">Urgent</option>
                    <option value="STAT">STAT</option>
                  </select>
                </div>
             </div>
             <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
               <button onClick={() => setShowModal(false)} className="px-4 py-2 font-bold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition text-sm">
                 {isAr ? "إلغاء" : "Cancel"}
               </button>
               <button onClick={handleSaveModal} className="px-4 py-2 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition text-sm shadow-md">
                 {isAr ? "حفظ الطلب" : "Save Order"}
               </button>
             </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-200 pb-4 relative">
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-0 ltr:right-0 rtl:left-0 p-1.5 hover:bg-slate-200 rounded-xl transition text-slate-400 hover:text-slate-600 z-10"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Settings className="h-7 w-7 text-indigo-600" />
            {isAr
              ? "محرك إدارة الطلبات الطبية (CPOE)"
              : "Computerized Physician Order Entry"}
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1">
            {isAr
              ? "نظام الإرسال الموحد للخدمات السريرية والتسعير التلقائي"
              : "Centralized clinical ordering & automated routing engine"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 justify-between h-auto rounded-xl border border-slate-200 flex flex-col items-center">
          <span className="text-sm font-bold text-slate-500">
            {isAr ? "الطلبات النشطة" : "Active Orders"}
          </span>
          <span className="text-3xl font-black text-indigo-600">
            {
              orders.filter(
                (o) => o.status !== "Completed" && o.status !== "Cancelled",
              ).length
            }
          </span>
        </div>
        <div className="md:col-span-3 flex items-center gap-2 sm:gap-4 flex-wrap  bg-white p-4 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          <div className="font-bold text-xs text-slate-500 uppercase whitespace-nowrap">
            {isAr ? "الفلترة حسب نوع الطلب" : "Filter by Type"}
          </div>
          {["All", "Lab", "Radiology", "Medication", "Procedure"].map(
            (type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition whitespace-nowrap border ${filterType === type ? "bg-indigo-50 border-indigo-200 text-indigo-700 border-2" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"}`}
              >
                {type === "All" && (isAr ? "الكل" : "All")}
                {type === "Lab" && (isAr ? "معمل" : "Lab")}
                {type === "Radiology" && (isAr ? "أشعة" : "Radiology")}
                {type === "Medication" && (isAr ? "أدوية" : "Meds")}
                {type === "Procedure" && (isAr ? "إجراءات" : "Procedure")}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
          <div className="relative w-full max-w-md">
            <Search
              className={`absolute ${isAr ? "right-3" : "left-3"} top-2.5 h-4 w-4 text-slate-400`}
            />
            <input
              type="text"
              placeholder={
                isAr
                  ? "بحث برقم الطلب، اسم المريض..."
                  : "Search Order ID, Patient..."
              }
              className={`w-full ${isAr ? "pr-9 pl-4" : "pl-9 pr-4"} py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 font-bold`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={openAddModal} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow flex items-center gap-2 transition whitespace-nowrap hidden sm:flex">
            <Plus className="h-4 w-4" /> {isAr ? "إنشاء طلب جديد" : "New Order"}
          </button>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table
            className="w-full text-sm text-left"
            dir={isAr ? "rtl" : "ltr"}
          >
            <thead className="bg-white text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-4">
                  {isAr ? "رقم الطلب (HL7)" : "Order ID"}
                </th>
                <th className="px-4 py-4">{isAr ? "المريض" : "Patient"}</th>
                <th className="px-4 py-4">{isAr ? "النوع" : "Category"}</th>
                <th className="px-4 py-4">
                  {isAr ? "تفاصيل الخدمة المطلوبة" : "Requested Item"}
                </th>
                <th className="px-4 py-4">{isAr ? "الطبيب" : "Ordering MD"}</th>
                <th className="px-4 py-4 text-center">
                  {isAr ? "الأهمية" : "Priority"}
                </th>
                <th className="px-4 py-4 text-center">
                  {isAr ? "مسار العمل" : "Workflow Status"}
                </th>
                <th className="px-4 py-4 text-right">
                  {isAr ? "إجراء" : "Actions"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-indigo-50/30 transition">
                  <td className="px-4 py-3 font-mono font-bold text-slate-800">
                    <div className="flex flex-col">
                      <span>{order.id}</span>
                      <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />{" "}
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-indigo-900">
                      <GlobalEntityLink entityId={order.mrn} entityName={order.patientName} entityType="patient" isAr={isAr}>
                        {order.patientName}
                      </GlobalEntityLink>
                    </div>
                    <div className="text-xs font-mono text-slate-500">
                      {order.mrn} • Visit:{" "}
                      <span className="text-slate-400">
                        <GlobalEntityLink entityName={order.visitId} entityType="visit" isAr={isAr}>
                          {order.visitId}
                        </GlobalEntityLink>
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 w-fit">
                      {getOrderIcon(order.orderType)}
                      <span className="text-xs uppercase">
                        {order.orderType}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-800">
                    {order.orderName}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-600">
                    {order.doctorId}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {getPriorityBadge(order.priority)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 inline-flex items-center gap-1.5 rounded-full text-xs font-bold border ${
                        order.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : order.status === "In Progress"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : order.status === "Pending"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {order.status === "Completed" && (
                        <CheckCircle className="w-3.5 h-3.5" />
                      )}
                      {order.status === "In Progress" && (
                        <Activity className="w-3.5 h-3.5" />
                      )}
                      {order.status === "Pending" && (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => openEditModal(order)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition" title={isAr ? "تعديل" : "Edit"}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(order.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition" title={isAr ? "حذف" : "Delete"}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-slate-500 font-bold"
                  >
                    {isAr ? "لم يتم العثور على طلبات" : "No orders found"}
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
