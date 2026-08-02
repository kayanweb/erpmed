import React, { useState } from "react";
import { Shield, Key, Users, Lock, LogIn, Fingerprint, Activity, Search, Plus, Edit, Trash2, CheckCircle2, XCircle, Settings } from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
}

export default function IAMDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");

  const [users, setUsers] = useState([
    { id: "1", name: "Dr. Ahmed Ali", role: "admin", status: "active", lastLogin: "2 mins ago" },
    { id: "2", name: "Sara Connor", role: "head_nurse", status: "active", lastLogin: "1 hour ago" },
    { id: "3", name: "John Doe", role: "staff", status: "locked", lastLogin: "2 days ago" },
  ]);

  const [roles, setRoles] = useState([
    { id: "1", name: "admin", permissions: 145, usersCount: 3 },
    { id: "2", name: "head_nurse", permissions: 85, usersCount: 12 },
    { id: "3", name: "staff", permissions: 25, usersCount: 450 },
  ]);

  const handleAction = (action: string) => {
    toast.success(isAr ? `تم بدء عملية: ${action}` : `Process started: ${action}`);
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              {isAr ? "إدارة الهوية والصلاحيات (IAM)" : "Identity & Access Management (IAM)"}
            </h2>
            <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">
              Level 0 Core - Authentication, Authorization, RBAC, SSO, MFA
            </p>
          </div>
        </div>
        <button onClick={() => handleAction('Sync Active Directory')} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow transition">
          {isAr ? "مزامنة Active Directory" : "Sync Active Directory"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { title: isAr ? "المستخدمين" : "Users Directory", value: users.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { title: isAr ? "الأدوار (RBAC)" : "Roles (RBAC)", value: roles.length, icon: Key, color: "text-indigo-600", bg: "bg-indigo-50" },
          { title: isAr ? "أجهزة موثوقة" : "Trusted Devices", value: "3,102", icon: Lock, color: "text-emerald-600", bg: "bg-emerald-50" },
          { title: isAr ? "تسجيلات الدخول" : "Active Sessions", value: "845", icon: Activity, color: "text-rose-600", bg: "bg-rose-50" }
        ].map((metric, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 sm:gap-4 flex-wrap ">
            <div className={`w-12 h-12 rounded-xl ${metric.bg} flex items-center justify-center ${metric.color}`}>
              <metric.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{metric.title}</p>
              <p className="text-lg sm:text-2xl font-black text-slate-900">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {[
            { id: "users", label: isAr ? "المستخدمين" : "Users" },
            { id: "roles", label: isAr ? "الأدوار والصلاحيات" : "Roles & Permissions" },
            { id: "policies", label: isAr ? "سياسات الأمان" : "Security Policies" },
            { id: "audit", label: isAr ? "سجل التدقيق" : "Audit Logs" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-bold text-sm whitespace-nowrap transition-colors ${activeTab === tab.id ? 'border-b-2 border-indigo-600 text-indigo-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4 md:p-6">
          {activeTab === "users" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isAr ? "بحث عن مستخدم..." : "Search users..."}
                    className={`w-full ${isAr ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none`}
                  />
                </div>
                <button onClick={() => handleAction('Add User')} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition">
                  <Plus className="w-4 h-4" /> {isAr ? "مستخدم جديد" : "New User"}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm" dir={isAr ? "rtl" : "ltr"}>
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">{isAr ? "الاسم" : "Name"}</th>
                      <th className="px-4 py-3">{isAr ? "الدور" : "Role"}</th>
                      <th className="px-4 py-3">{isAr ? "الحالة" : "Status"}</th>
                      <th className="px-4 py-3">{isAr ? "آخر ظهور" : "Last Login"}</th>
                      <th className="px-4 py-3 text-center">{isAr ? "إجراءات" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-bold text-slate-900">{u.name}</td>
                        <td className="px-4 py-3"><span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold uppercase tracking-wider">{u.role}</span></td>
                        <td className="px-4 py-3">
                          {u.status === 'active' ? (
                            <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs"><CheckCircle2 className="w-4 h-4" /> {isAr ? "نشط" : "Active"}</span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-rose-600 font-bold text-xs"><XCircle className="w-4 h-4" /> {isAr ? "مغلق" : "Locked"}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">{u.lastLogin}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleAction('Edit User')} className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-lg transition"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleAction('Delete User')} className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "roles" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => handleAction('Create Role')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition">
                  <Plus className="w-4 h-4" /> {isAr ? "دور جديد" : "New Role"}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map(r => (
                  <div key={r.id} className="p-4 border border-slate-200 rounded-2xl hover:border-indigo-300 hover:shadow-md transition bg-slate-50/50">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-black text-lg text-slate-900 capitalize">{r.name.replace('_', ' ')}</h3>
                      <button onClick={() => handleAction('Edit Role')} className="text-slate-400 hover:text-indigo-600"><Settings className="w-5 h-5" /></button>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                      <span>{r.usersCount} {isAr ? "مستخدم" : "Users"}</span>
                      <span className="bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-sm">{r.permissions} {isAr ? "صلاحية" : "Perms"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "policies" && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Lock className="w-16 h-16 text-slate-300 mb-4" />
              <h3 className="text-xl font-black text-slate-800 mb-2">{isAr ? "سياسات الأمان النشطة" : "Active Security Policies"}</h3>
              <p className="text-slate-500 max-w-md mx-auto mb-6">
                {isAr ? "تكوين سياسات كلمات المرور، المصادقة الثنائية (MFA)، وقيود تسجيل الدخول من خارج الشبكة." : "Configure password complexity, MFA enforcement, and external network login restrictions."}
              </p>
              <button onClick={() => handleAction('Configure MFA')} className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800">
                {isAr ? "تكوين سياسات الأمان" : "Configure Policies"}
              </button>
            </div>
          )}

          {activeTab === "audit" && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Activity className="w-16 h-16 text-slate-300 mb-4" />
              <h3 className="text-xl font-black text-slate-800 mb-2">{isAr ? "سجل التدقيق" : "Audit Logs"}</h3>
              <p className="text-slate-500 max-w-md mx-auto mb-6">
                {isAr ? "يتم تخزين جميع أحداث تسجيل الدخول والوصول للملفات بشكل آمن ومقاوم للعبث." : "All login events and file access logs are stored securely and tamper-proof."}
              </p>
              <button onClick={() => handleAction('Export Logs')} className="px-6 py-2 border-2 border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50">
                {isAr ? "تصدير السجل الكامل" : "Export Full Audit"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
