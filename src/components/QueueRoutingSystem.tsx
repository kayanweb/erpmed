import React, { useState, useEffect } from "react";
import {
  MonitorPlay,
  Search,
  Users,
  Activity,
  LogIn,
  ArrowRightCircle,
} from "lucide-react";
import { syncSetting, saveSetting } from "../lib/firestoreService";
import { toast } from "sonner";

interface QueueItem {
  id: string;
  ticketNum: string;
  patientName: string;
  priority: "High" | "Normal" | "Low";
  status: "Waiting" | "Called" | "In Service" | "Completed";
  stationId: string;
  queueTime: string;
}

export default function QueueRoutingSystem({
  language,
}: {
  language: "ar" | "en";
}) {
  const isAr = language === "ar";
  const [queues, setQueues] = useState<QueueItem[]>([]);

  useEffect(() => {
    const unsub = syncSetting("his_queues", (data) => {
      if (data?.value && Array.isArray(data.value)) {
        setQueues(data.value);
      } else {
        const seeded: QueueItem[] = [
          {
            id: "Q-1",
            ticketNum: "A015",
            patientName: "Said Kamal",
            priority: "Normal",
            status: "Waiting",
            stationId: "Station 1",
            queueTime: new Date(Date.now() - 1500000).toISOString(),
          },
          {
            id: "Q-2",
            ticketNum: "A016",
            patientName: "Amina Saleh",
            priority: "High",
            status: "In Service",
            stationId: "Station 2",
            queueTime: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: "Q-3",
            ticketNum: "PH-09",
            patientName: "Ibrahim Salem",
            priority: "Normal",
            status: "Waiting",
            stationId: "Pharmacy",
            queueTime: new Date(Date.now() - 600000).toISOString(),
          },
          {
            id: "Q-4",
            ticketNum: "LAB-22",
            patientName: "Sara Ahmed",
            priority: "Low",
            status: "Called",
            stationId: "Lab Desk 1",
            queueTime: new Date(Date.now() - 2500000).toISOString(),
          },
        ];
        setQueues(seeded);
        saveSetting("his_queues", seeded);
      }
    });
    return () => unsub();
  }, []);

  const getPriorityStyle = (priority: string) => {
    if (priority === "High") return "bg-rose-100 text-rose-700 border-rose-200";
    if (priority === "Normal")
      return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Waiting":
        return "bg-amber-100 text-amber-700";
      case "Called":
        return "bg-blue-100 text-blue-700 animate-pulse";
      case "In Service":
        return "bg-emerald-100 text-emerald-700";
      case "Completed":
        return "bg-slate-100 text-slate-500";
      default:
        return "";
    }
  };

  return (
    <div
      className="p-4 md:p-6 bg-slate-50 min-h-full"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <MonitorPlay className="h-7 w-7 text-blue-600" />
            {isAr
              ? "نظام طابور الانتظار (Queue System)"
              : "Queue & Routing System"}
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1">
            {isAr
              ? "إدارة شاشات الانتظار، واستدعاء المرضى للمحطات"
              : "Handling token display boards, wait times, and physical patient flow."}
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow flex items-center gap-2 transition whitespace-nowrap">
          <MonitorPlay className="h-4 w-4" />{" "}
          {isAr ? "فتح شاشة العرض (TV)" : "Open TV Display"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {["Station 1", "Station 2", "Pharmacy", "Lab Desk 1"].map((station) => (
          <div
            key={station}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-700">{station}</span>
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            {queues.filter(
              (q) => q.stationId === station && q.status !== "Completed",
            ).length > 0 ? (
              <>
                {queues
                  .filter(
                    (q) => q.stationId === station && q.status !== "Completed",
                  )
                  .map((q) => (
                    <div
                      key={q.id}
                      className="flex justify-between items-center"
                    >
                      <div className="text-lg sm:text-2xl font-black text-slate-800 tracking-wider font-mono">
                        {q.ticketNum}
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusStyle(q.status)}`}
                      >
                        {q.status}
                      </span>
                    </div>
                  ))}
                <button className="mt-2 w-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 py-2 rounded font-bold text-xs transition border border-slate-200 hover:border-emerald-200 flex justify-center items-center gap-2">
                  {isAr ? "المناداة على التالي" : "Call Next"}{" "}
                  <ArrowRightCircle className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="text-center py-4 text-slate-400 font-bold text-sm">
                {isAr ? "لا يوجد منتظرين" : "Queue Empty"}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-sm text-slate-700 flex items-center gap-2">
          <Users className="w-4 h-4" />{" "}
          {isAr ? "السجل الكامل للانتظار" : "Master Queue Log"}
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table
            className="w-full text-sm text-left"
            dir={isAr ? "rtl" : "ltr"}
          >
            <thead className="bg-white text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-4">{isAr ? "رقم التذكرة" : "Ticket"}</th>
                <th className="px-4 py-4">{isAr ? "المريض" : "Patient"}</th>
                <th className="px-4 py-4">{isAr ? "المحطة" : "Station"}</th>
                <th className="px-4 py-4">
                  {isAr ? "وقت الانتظار" : "Wait Time"}
                </th>
                <th className="px-4 py-4 text-center">
                  {isAr ? "الأولوية" : "Priority"}
                </th>
                <th className="px-4 py-4 text-center">
                  {isAr ? "الحالة" : "Status"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {queues.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-mono font-black text-blue-700 text-lg">
                    {q.ticketNum}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-800">
                    {q.patientName}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-600 text-xs">
                    {q.stationId}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500 font-bold flex items-center gap-1.5 h-full pt-4">
                    {Math.floor(
                      (Date.now() - new Date(q.queueTime).getTime()) / 60000,
                    )}{" "}
                    mins
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getPriorityStyle(q.priority)}`}
                    >
                      {q.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${getStatusStyle(q.status)}`}
                    >
                      {q.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
