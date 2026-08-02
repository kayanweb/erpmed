import React, { useState } from "react";
import { CalendarDays, CheckSquare, Plus, Search, Calendar as CalendarIcon, Filter, Clock, MoreVertical } from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

export default function CalendarToDoDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"calendar" | "todo">("calendar");

  const tasks = [
    { id: 1, title: "Review Q3 Budget", date: "2023-10-26", priority: "High", status: "Pending" },
    { id: 2, title: "Staff Meeting", date: "2023-10-25", priority: "Medium", status: "Completed" },
    { id: 3, title: "Update System Policies", date: "2023-10-30", priority: "Low", status: "In Progress" },
  ];

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 sm:w-8 sm:h-8 text-purple-600 bg-purple-100 p-1.5 rounded-xl" />
            {isAr ? "التقويم والمهام" : "Calendar & ToDo List"}
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {isAr ? "إدارة المواعيد وقائمة المهام الشخصية" : "Manage schedules and personal tasks"}
          </p>
        </div>
      </div>

      <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1 mb-6 overflow-x-auto">
        {[
          { id: "calendar", labelAr: "التقويم", labelEn: "Calendar", icon: CalendarIcon },
          { id: "todo", labelAr: "قائمة المهام", labelEn: "ToDo List", icon: CheckSquare },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2 text-sm font-bold rounded-lg transition whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-purple-100 text-purple-700"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {isAr ? tab.labelAr : tab.labelEn}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-72">
            <Search className={`absolute ${isAr ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
            <input
              type="text"
              placeholder={isAr ? "بحث..." : "Search..."}
              className={`w-full bg-slate-50 border border-slate-200 rounded-xl ${isAr ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 text-sm focus:border-purple-500 outline-none transition`}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl transition">
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Add Task or Appointment", titleAr: "إضافة مهمة أو موعد جديد في التقويم", type: "form" } }))}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {isAr ? "إضافة" : "Add"}
            </button>
          </div>
        </div>

        {activeTab === "calendar" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 h-96 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>{isAr ? "التقويم التفاعلي (عرض الشهر/الأسبوع/اليوم)" : "Interactive Calendar (Month/Week/Day view)"}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800">{isAr ? "أحداث اليوم" : "Today's Events"}</h3>
              <div className="bg-white border-l-4 border-purple-500 shadow-sm p-3 rounded-r-lg">
                <p className="font-bold text-sm text-slate-800">Department Sync</p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Clock className="w-3 h-3"/> 10:00 AM - 11:00 AM</p>
              </div>
              <div className="bg-white border-l-4 border-blue-500 shadow-sm p-3 rounded-r-lg">
                <p className="font-bold text-sm text-slate-800">Lunch with Director</p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Clock className="w-3 h-3"/> 12:30 PM - 01:30 PM</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "todo" && (
          <div className="max-w-4xl">
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-sm transition">
                  <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                    <input type="checkbox" className="w-5 h-5 text-purple-600 rounded border-slate-300 focus:ring-purple-500" defaultChecked={task.status === "Completed"} />
                    <div>
                      <p className={`font-bold ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>{task.title}</p>
                      <p className="text-xs text-slate-500 mt-1">Due: {task.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      task.priority === 'High' ? 'bg-red-100 text-red-700' :
                      task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {task.priority}
                    </span>
                    <button className="text-slate-400 hover:text-slate-700">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
