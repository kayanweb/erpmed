import React, { useState, useEffect } from "react";
import { GlobalEntityLink } from "./GlobalEntityLink";
import {
  Search,
  Plus,
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  Video,
  CalendarCheck,
  Edit,
  Trash2,
  X
} from "lucide-react";
import { syncSetting, saveSetting } from "../lib/firestoreService";
import { toast } from "sonner";

interface Appointment {
  id: string;
  patientName: string;
  mrn: string;
  doctorId: string;
  department: string;
  date: string;
  time: string;
  type: "Consultation" | "Follow-up" | "Telemedicine" | "Procedure";
  status: "Scheduled" | "Arrived" | "In Consultation" | "Completed" | "No Show";
  paymentStatus: "Paid" | "Pending" | "Insurance";
}

export default function AppointmentsManager({
  language,
}: {
  language: "ar" | "en";
}) {
  const isAr = language === "ar";
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState(
    new Date().toISOString().split("T")[0],
  );

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentApt, setCurrentApt] = useState<Partial<Appointment>>({});

  useEffect(() => {
    const unsub = syncSetting("his_appointments", (data) => {
      if (data?.value && Array.isArray(data.value)) {
        setAppointments(data.value);
      } else {
        const seeded: Appointment[] = [
          {
            id: "APT-1001",
            patientName: "Nadia Youssef",
            mrn: "MRN-5541",
            doctorId: "Dr. Laila (Cardio)",
            department: "Cardiology",
            date: new Date().toISOString().split("T")[0],
            time: "09:30",
            type: "Consultation",
            status: "Scheduled",
            paymentStatus: "Insurance",
          },
          {
            id: "APT-1002",
            patientName: "Tarek Amin",
            mrn: "MRN-2199",
            doctorId: "Dr. Kareem (Gastro)",
            department: "Gastroenterology",
            date: new Date().toISOString().split("T")[0],
            time: "10:00",
            type: "Follow-up",
            status: "Arrived",
            paymentStatus: "Paid",
          },
          {
            id: "APT-1003",
            patientName: "Mona Hassan",
            mrn: "MRN-3312",
            doctorId: "Dr. Sarah (Derma)",
            department: "Dermatology",
            date: new Date().toISOString().split("T")[0],
            time: "11:15",
            type: "Telemedicine",
            status: "In Consultation",
            paymentStatus: "Paid",
          },
        ];
        setAppointments(seeded);
        saveSetting("his_appointments", seeded);
      }
    });
    return () => unsub();
  }, []);

  const updateStatus = async (id: string, newStatus: Appointment["status"]) => {
    const next = appointments.map((a) =>
      a.id === id ? { ...a, status: newStatus } : a,
    );
    setAppointments(next);
    await saveSetting("his_appointments", next);
    toast.success(isAr ? "تم تحديث حالة الموعد" : "Appointment status updated");
  };

  const handleDelete = async (id: string) => {
    if (confirm(isAr ? "هل أنت متأكد من حذف هذا الموعد؟" : "Are you sure you want to delete this appointment?")) {
      const next = appointments.filter(a => a.id !== id);
      setAppointments(next);
      await saveSetting("his_appointments", next);
      toast.success(isAr ? "تم حذف الموعد" : "Appointment deleted");
    }
  };

  const handleSaveModal = async () => {
    if (!currentApt.patientName || !currentApt.doctorId || !currentApt.date || !currentApt.time) {
      toast.error(isAr ? "يرجى تعبئة الحقول المطلوبة" : "Please fill required fields");
      return;
    }

    let next: Appointment[];
    if (modalMode === "add") {
      const newApt: Appointment = {
        id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
        patientName: currentApt.patientName || "",
        mrn: currentApt.mrn || `MRN-${Math.floor(1000 + Math.random() * 9000)}`,
        doctorId: currentApt.doctorId || "",
        department: currentApt.department || "General",
        date: currentApt.date || dateFilter,
        time: currentApt.time || "09:00",
        type: currentApt.type || "Consultation",
        status: currentApt.status || "Scheduled",
        paymentStatus: currentApt.paymentStatus || "Pending",
      };
      next = [...appointments, newApt];
    } else {
      next = appointments.map(a => a.id === currentApt.id ? { ...a, ...currentApt } as Appointment : a);
    }
    
    setAppointments(next);
    await saveSetting("his_appointments", next);
    setShowModal(false);
    toast.success(isAr ? "تم الحفظ بنجاح" : "Saved successfully");
  };

  const openAddModal = () => {
    setModalMode("add");
    setCurrentApt({
      date: dateFilter,
      time: "09:00",
      type: "Consultation",
      status: "Scheduled",
      paymentStatus: "Pending",
      department: "General"
    });
    setShowModal(true);
  };

  const openEditModal = (apt: Appointment) => {
    setModalMode("edit");
    setCurrentApt(apt);
    setShowModal(true);
  };

  const filtered = appointments
    .filter(
      (a) =>
        a.date === dateFilter &&
        (a.patientName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          a.mrn?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          a.doctorId?.toLowerCase()?.includes(searchTerm?.toLowerCase())),
    )
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div
      className="p-4 md:p-6 bg-slate-50 min-h-full relative"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-modal flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-black text-slate-800 text-lg">
                  {modalMode === "add" 
                    ? (isAr ? "حجز موعد جديد" : "Book New Appointment")
                    : (isAr ? "تعديل الموعد" : "Edit Appointment")
                  }
                </h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-500 transition">
                  <X className="w-5 h-5" />
                </button>
             </div>
             <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "اسم المريض" : "Patient Name"}</label>
                    <input type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-blue-500 outline-none" 
                      value={currentApt.patientName || ""} onChange={e => setCurrentApt({...currentApt, patientName: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "رقم الملف (MRN)" : "MRN"}</label>
                    <input type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-blue-500 outline-none" 
                      value={currentApt.mrn || ""} onChange={e => setCurrentApt({...currentApt, mrn: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "اسم الطبيب" : "Doctor Name"}</label>
                    <input type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-blue-500 outline-none" 
                      value={currentApt.doctorId || ""} onChange={e => setCurrentApt({...currentApt, doctorId: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "التاريخ" : "Date"}</label>
                    <input type="date" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-blue-500 outline-none" 
                      value={currentApt.date || ""} onChange={e => setCurrentApt({...currentApt, date: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الوقت" : "Time"}</label>
                    <input type="time" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-blue-500 outline-none" 
                      value={currentApt.time || ""} onChange={e => setCurrentApt({...currentApt, time: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "القسم" : "Department"}</label>
                    <input type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-blue-500 outline-none" 
                      value={currentApt.department || ""} onChange={e => setCurrentApt({...currentApt, department: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "نوع الزيارة" : "Visit Type"}</label>
                    <select className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-blue-500 outline-none"
                      value={currentApt.type || ""} onChange={e => setCurrentApt({...currentApt, type: e.target.value as any})}>
                      <option value="Consultation">Consultation</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Procedure">Procedure</option>
                      <option value="Telemedicine">Telemedicine</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الدفع" : "Payment"}</label>
                    <select className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-blue-500 outline-none"
                      value={currentApt.paymentStatus || ""} onChange={e => setCurrentApt({...currentApt, paymentStatus: e.target.value as any})}>
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Insurance">Insurance</option>
                    </select>
                  </div>
                </div>
             </div>
             <div className="p-4 border-t border-slate-100 flex flex-col md:flex-row justify-between gap-3 bg-slate-50 items-center">
               <div className="flex gap-2 min-w-max">
                 <button className="px-3 py-2 font-bold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition text-xs shadow-sm flex items-center gap-1">
                   {isAr ? "طباعة التذكرة" : "Print Ticket"}
                 </button>
                 <button className="px-3 py-2 font-bold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition text-xs shadow-sm flex items-center gap-1">
                   {isAr ? "تذكير SMS" : "SMS Reminder"}
                 </button>
                 <button className="px-3 py-2 font-bold text-emerald-600 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 transition text-xs shadow-sm flex items-center gap-1">
                   {isAr ? "تذكير واتساب" : "WhatsApp"}
                 </button>
               </div>
               <div className="flex gap-2 w-full md:w-auto">
                 <button onClick={() => setShowModal(false)} className="px-4 py-2 flex-1 md:flex-none font-bold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition text-sm">
                   {isAr ? "إلغاء" : "Cancel"}
                 </button>
                 <button onClick={handleSaveModal} className="px-4 py-2 flex-1 md:flex-none font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition text-sm shadow-md">
                   {isAr ? "حفظ الموعد" : "Save"}
                 </button>
               </div>
             </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <CalendarCheck className="h-7 w-7 text-blue-600" />
            {isAr ? "نظام المواعيد والاستقبال" : "Appointments & Reception"}
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1">
            {isAr
              ? "إدارة مواعيد العيادات الخارجية والزيارات"
              : "OPD Bookings & Visit Management"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto flex-wrap">
          <div className="flex bg-white border border-slate-200 rounded-lg p-1">
            <button className={`px-3 py-1.5 text-xs font-bold rounded ${'day' === 'day' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>{isAr ? "يومي" : "Day"}</button>
            <button className={`px-3 py-1.5 text-xs font-bold rounded ${false ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>{isAr ? "أسبوعي" : "Week"}</button>
            <button className={`px-3 py-1.5 text-xs font-bold rounded ${false ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>{isAr ? "شهري" : "Month"}</button>
          </div>
          <input
            type="date"
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow flex items-center gap-2 transition whitespace-nowrap">
            <Plus className="h-4 w-4" />{" "}
            {isAr ? "حجز موعد جديد" : "Book Appointment"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          {/* Mini stats */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h3 className="font-bold text-slate-500 text-xs uppercase mb-2">
              {isAr ? "إحصائيات اليوم" : "Today's Stats"}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-700">
                  {isAr ? "المواعيد الكلية" : "Total Appointments"}
                </span>
                <span className="bg-slate-100 text-slate-800 font-black px-2 py-0.5 rounded">
                  {appointments.filter((a) => a.date === dateFilter).length}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-700">
                  {isAr ? "تم الحضور" : "Arrived"}
                </span>
                <span className="bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded border border-emerald-100">
                  {
                    appointments.filter(
                      (a) =>
                        a.date === dateFilter &&
                        (a.status === "Arrived" || a.status === "Completed" || a.status === "In Consultation"),
                    ).length
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <div className="relative w-full max-w-sm">
                <Search
                  className={`absolute ${isAr ? "right-3" : "left-3"} top-2.5 h-4 w-4 text-slate-400`}
                />
                <input
                  type="text"
                  placeholder={
                    isAr
                      ? "بحث بالاسم، رقم الملف، الطبيب..."
                      : "Search Patient, MRN, Doctor..."
                  }
                  className={`w-full ${isAr ? "pr-9 pl-4" : "pl-9 pr-4"} py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 font-bold`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table
                className="w-full text-sm text-left"
                dir={isAr ? "rtl" : "ltr"}
              >
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-4">{isAr ? "الوقت" : "Time"}</th>
                    <th className="px-4 py-4">{isAr ? "المريض" : "Patient"}</th>
                    <th className="px-4 py-4">
                      {isAr ? "الطبيب / العيادة" : "Doctor / Clinic"}
                    </th>
                    <th className="px-4 py-4">{isAr ? "النوع" : "Type"}</th>
                    <th className="px-4 py-4 text-center">
                      {isAr ? "الحالة" : "Status"}
                    </th>
                    <th className="px-4 py-4 text-right">
                      {isAr ? "إجراء" : "Actions"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3 font-mono font-bold text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-slate-400" />{" "}
                          {apt.time}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-800">
                          <GlobalEntityLink entityId={apt.mrn} entityName={apt.patientName} entityType="patient" isAr={isAr}>
                            {apt.patientName}
                          </GlobalEntityLink>
                        </div>
                        <div className="text-xs font-mono text-slate-500">
                          <GlobalEntityLink entityId={apt.mrn} entityName={apt.patientName} entityType="patient" isAr={isAr}>
                            {apt.mrn}
                          </GlobalEntityLink>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-700">
                        <div>
                          <GlobalEntityLink entityName={apt.doctorId} entityType="doctor" isAr={isAr}>
                            {apt.doctorId}
                          </GlobalEntityLink>
                        </div>
                        <div className="text-xs text-slate-500 font-normal">
                          <GlobalEntityLink entityName={apt.department} entityType="department" isAr={isAr}>
                            {apt.department}
                          </GlobalEntityLink>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className="flex items-center gap-1 font-bold text-slate-600">
                          {apt.type === "Telemedicine" ? (
                            <Video className="w-3.5 h-3.5 text-purple-500" />
                          ) : (
                            <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                          )}
                          {apt.type}
                        </span>
                        <div className="mt-1">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${apt.paymentStatus === "Paid" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : apt.paymentStatus === "Insurance" ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-rose-50 border-rose-200 text-rose-700"}`}
                          >
                            {apt.paymentStatus}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <select
                          className={`text-xs font-bold border rounded px-2 py-1.5 outline-none w-full max-w-[130px] ${
                            apt.status === "Arrived"
                              ? "bg-blue-50 border-blue-200 text-blue-700"
                              : apt.status === "Scheduled"
                                ? "bg-slate-50 border-slate-200 text-slate-700"
                                : apt.status === "In Consultation"
                                  ? "bg-purple-50 border-purple-200 text-purple-700"
                                  : apt.status === "Completed"
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                    : "bg-rose-50 border-rose-200 text-rose-700"
                          }`}
                          value={apt.status}
                          onChange={(e) =>
                            updateStatus(apt.id, e.target.value as any)
                          }
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="Arrived">Arrived</option>
                          <option value="In Consultation">
                            In Consultation
                          </option>
                          <option value="Completed">Completed</option>
                          <option value="No Show">No Show</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => openEditModal(apt)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition" title={isAr ? "تعديل" : "Edit"}>
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(apt.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition" title={isAr ? "حذف" : "Delete"}>
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
                        {isAr ? "لا توجد مواعيد" : "No appointments"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
