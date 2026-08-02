import React, { useState } from "react";
import { GitMerge, GitBranch, Play, Settings2, Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

export function WorkflowDashboard({ language }: Props) {
  const isAr = language === "ar";
  
  const workflows = [
    { id: 1, name: isAr ? "دخول مريض للطوارئ" : "ER Patient Admission", steps: 5, active: true, triggers: "On Admission" },
    { id: 2, name: isAr ? "طلب استشارة طبية" : "Medical Consultation Request", steps: 3, active: true, triggers: "On Doctor Request" },
    { id: 3, name: isAr ? "نقل مريض للعناية المركزة" : "ICU Transfer", steps: 8, active: false, triggers: "Manual Trigger" },
  ];

  const handleAction = (action: string) => {
    toast.success(isAr ? `تم بدء العملية: ${action}` : `Action started: ${action}`);
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          <div className="w-12 h-12 bg-pink-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <GitMerge className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              {isAr ? "محرك سير العمل (Workflow Engine)" : "Workflow Engine"}
            </h2>
            <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">
              Automated Business Logic & Processes
            </p>
          </div>
        </div>
        <button onClick={() => handleAction('New Workflow')} className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl shadow transition">
          <Plus className="w-4 h-4" /> {isAr ? "سير عمل جديد" : "New Workflow"}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-left text-sm" dir={isAr ? "rtl" : "ltr"}>
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">{isAr ? "اسم العملية" : "Workflow Name"}</th>
              <th className="px-4 py-3">{isAr ? "المشغلات" : "Triggers"}</th>
              <th className="px-4 py-3">{isAr ? "عدد الخطوات" : "Steps"}</th>
              <th className="px-4 py-3">{isAr ? "الحالة" : "Status"}</th>
              <th className="px-4 py-3 text-center">{isAr ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {workflows.map(wf => (
              <tr key={wf.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3 font-black text-slate-900 flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-pink-500" /> {wf.name}
                </td>
                <td className="px-4 py-3 text-slate-600 font-bold">{wf.triggers}</td>
                <td className="px-4 py-3 text-slate-500 font-mono text-xs">{wf.steps}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${wf.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {wf.active ? (isAr ? "مفعل" : "Active") : (isAr ? "معطل" : "Disabled")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleAction('Run')} className="p-1.5 text-slate-400 hover:text-emerald-600 bg-slate-100 hover:bg-emerald-50 rounded-lg transition" title="Test Run"><Play className="w-4 h-4" /></button>
                    <button onClick={() => handleAction('Edit')} className="p-1.5 text-slate-400 hover:text-pink-600 bg-slate-100 hover:bg-pink-50 rounded-lg transition" title="Edit"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleAction('Delete')} className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-lg transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
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
