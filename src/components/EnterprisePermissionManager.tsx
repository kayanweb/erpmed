import React, { Fragment, useState } from 'react';
import { 
  ShieldCheck, Lock, Unlock, Eye, EyeOff, 
  Search, Filter, ChevronRight, CheckCircle2, 
  Plus, Save, AlertTriangle, UserCircle, 
  Key, Database, LayoutGrid, Square, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PermissionNode {
  id: string;
  nameEn: string;
  nameAr: string;
  type: 'module' | 'screen' | 'tab' | 'field' | 'button';
  status: 'allowed' | 'denied' | 'readonly';
  children?: PermissionNode[];
}

export default function EnterprisePermissionManager({ language, onClose }: { language: 'ar' | 'en', onClose?: () => void }) {
  const isAr = language === 'ar';
  const [selectedRole, setSelectedRole] = useState<string>('nurse');
  
  const roles = [
    { id: 'admin', en: 'System Admin', ar: 'مدير النظام', color: 'indigo' },
    { id: 'doctor', en: 'Physician', ar: 'طبيب', color: 'blue' },
    { id: 'nurse', en: 'Staff Nurse', ar: 'ممرض/ة', color: 'emerald' },
    { id: 'reception', en: 'Receptionist', ar: 'موظف استقبال', color: 'amber' }
  ];

  const [permissions, setPermissions] = useState<PermissionNode[]>([
    {
      id: 'mod_his',
      nameEn: 'HIS Core System',
      nameAr: 'نظام HIS الأساسي',
      type: 'module',
      status: 'allowed',
      children: [
        {
          id: 'scr_reg',
          nameEn: 'Patient Registration',
          nameAr: 'تسجيل المرضى',
          type: 'screen',
          status: 'allowed',
          children: [
            { id: 'fld_mrn', nameEn: 'MRN Field', nameAr: 'حقل السجل الطبي', type: 'field', status: 'readonly' },
            { id: 'btn_del', nameEn: 'Delete Patient', nameAr: 'حذف مريض', type: 'button', status: 'denied' }
          ]
        },
        {
          id: 'scr_emr',
          nameEn: 'Medical Records (EMR)',
          nameAr: 'الملفات الطبية',
          type: 'screen',
          status: 'allowed'
        }
      ]
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'allowed': return <Unlock className="w-3.5 h-3.5 text-emerald-500" />;
      case 'denied': return <Lock className="w-3.5 h-3.5 text-rose-500" />;
      case 'readonly': return <Eye className="w-3.5 h-3.5 text-amber-500" />;
      default: return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 gap-6" dir={isAr ? 'rtl' : 'ltr'}>
       <div className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-[32px] shadow-sm shrink-0">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
             <button 
               onClick={onClose}
               className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm group"
             >
                <Plus className="w-6 h-6 rotate-45 group-hover:scale-110 transition-transform" />
             </button>
             <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
                   <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                   <h2 className="text-base font-black text-slate-900 leading-tight">{isAr ? "مدير صلاحيات المؤسسة" : "Enterprise Access Manager"}</h2>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "نظام التحكم المركزي بالصلاحيات (IAM)" : "Centralized Identity & Access Management"}</p>
                </div>
             </div>
          </div>
       </div>
       <div className="flex flex-1 gap-6 overflow-hidden">
       {/* Left: Role Selection */}
       <div className="w-72 bg-white border border-slate-200 rounded-[32px] overflow-hidden flex flex-col shadow-sm">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
             <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">{isAr ? "الأدوار والصلاحيات" : "Roles & Access"}</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
             {roles.map(role => (
               <button
                 key={role.id}
                 onClick={() => setSelectedRole(role.id)}
                 className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-right ${
                   selectedRole === role.id 
                    ? `border-${role.color}-200 bg-${role.color}-50 text-${role.color}-700 shadow-sm` 
                    : 'border-white hover:bg-slate-50 text-slate-500'
                 }`}
               >
                 <div className={`p-2 rounded-xl bg-white shadow-sm border border-slate-100`}>
                    <UserCircle className="w-5 h-5" />
                 </div>
                 <div>
                    <p className="text-xs font-black uppercase tracking-widest">{isAr ? role.ar : role.en}</p>
                    <p className="text-[9px] font-bold text-slate-400 mt-0.5">ID: {role.id}</p>
                 </div>
               </button>
             ))}
          </div>
          <div className="p-4 border-t border-slate-100">
             <button className="w-full py-3 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition flex items-center justify-center gap-2">
                <Plus className="w-3.5 h-3.5" />
                {isAr ? "إضافة دور جديد" : "Create New Role"}
             </button>
          </div>
       </div>

       {/* Right: Permission Matrix */}
       <div className="flex-1 bg-white border border-slate-200 rounded-[32px] overflow-hidden flex flex-col shadow-sm">
          <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
             <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm">
                   <Key className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                   <h2 className="text-lg font-black text-slate-800">
                     {isAr ? "مصفوفة التحكم بالوصول: " : "Access Control Matrix: "}
                     <span className="text-indigo-600">{roles.find(r => r.id === selectedRole)?.[isAr ? 'ar' : 'en']}</span>
                   </h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? "تحديد صلاحيات الكائنات والحقول" : "Map entity and field level permissions"}</p>
                </div>
             </div>
             <button className="h-11 px-8 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition">
                <Save className="w-4 h-4" />
                {isAr ? "تحديث المصفوفة" : "Sync Matrix"}
             </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
             <div className="border border-slate-100 rounded-2xl overflow-hidden">
                <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-right border-collapse">
                   <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-100">
                         <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "الوحدة / الشاشة / الحقل" : "Module / Screen / Field"}</th>
                         <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">{isAr ? "كاملة" : "Full"}</th>
                         <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">{isAr ? "قراءة فقط" : "Read Only"}</th>
                         <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">{isAr ? "مخفي" : "Hidden"}</th>
                         <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">{isAr ? "تخصيص" : "Overrides"}</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {permissions.map(mod => (
                        <Fragment key={mod.id}>
                           <tr className="bg-indigo-50/20">
                              <td className="px-6 py-4">
                                 <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <LayoutGrid className="w-4 h-4 text-indigo-600" />
                                    <span className="text-xs font-black text-slate-800">{isAr ? mod.nameAr : mod.nameEn}</span>
                                 </div>
                              </td>
                              <td colSpan={4} className="px-6 py-4"></td>
                           </tr>
                           {mod.children?.map(scr => (
                             <Fragment key={scr.id}>
                                <tr>
                                   <td className="px-6 py-4 ltr:pl-12 rtl:pr-12">
                                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                         <Square className="w-3 h-3 text-blue-500" />
                                         <span className="text-xs font-bold text-slate-700">{isAr ? scr.nameAr : scr.nameEn}</span>
                                      </div>
                                   </td>
                                   <td className="px-6 py-4 text-center">
                                      <input type="radio" name={`perm-${scr.id}`} checked={scr.status === 'allowed'} className="w-4 h-4 accent-emerald-500" />
                                   </td>
                                   <td className="px-6 py-4 text-center">
                                      <input type="radio" name={`perm-${scr.id}`} checked={scr.status === 'readonly'} className="w-4 h-4 accent-amber-500" />
                                   </td>
                                   <td className="px-6 py-4 text-center">
                                      <input type="radio" name={`perm-${scr.id}`} checked={scr.status === 'denied'} className="w-4 h-4 accent-rose-500" />
                                   </td>
                                   <td className="px-6 py-4 text-center">
                                      <button className="p-1.5 bg-slate-50 rounded-lg"><Settings className="w-3 h-3 text-slate-400" /></button>
                                   </td>
                                </tr>
                                {scr.children?.map(fld => (
                                  <tr key={fld.id} className="bg-slate-50/30">
                                     <td className="px-6 py-3 ltr:pl-20 rtl:pr-20">
                                        <div className="flex items-center gap-2">
                                           <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                           <span className="text-[11px] font-medium text-slate-500">{isAr ? fld.nameAr : fld.nameEn}</span>
                                        </div>
                                     </td>
                                     <td className="px-6 py-3 text-center"><input type="radio" name={`perm-${fld.id}`} checked={fld.status === 'allowed'} className="w-3.5 h-3.5 accent-emerald-500" /></td>
                                     <td className="px-6 py-3 text-center"><input type="radio" name={`perm-${fld.id}`} checked={fld.status === 'readonly'} className="w-3.5 h-3.5 accent-amber-500" /></td>
                                     <td className="px-6 py-3 text-center"><input type="radio" name={`perm-${fld.id}`} checked={fld.status === 'denied'} className="w-3.5 h-3.5 accent-rose-500" /></td>
                                     <td className="px-6 py-3"></td>
                                  </tr>
                                ))}
                             </Fragment>
                           ))}
                        </Fragment>
                      ))}
                   </tbody>
                </table>
</div>
             </div>
          </div>

          {/* Footer Info */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/50">
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{isAr ? "دخول كامل" : "Full Access"}</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{isAr ? "عرض فقط" : "Read Only"}</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{isAr ? "مخفي / محجوب" : "Hidden / Denied"}</span>
                </div>
                <div className="flex-1 flex justify-end">
                   <p className="text-[10px] text-slate-400 font-medium italic">
                      {isAr ? "* التغييرات في مصفوفة الصلاحيات تنعكس فوراً على كافة واجهات HIS دون الحاجة لإعادة تشغيل النظام." : "* Changes in the access matrix reflect instantly across all HIS interfaces without system restart."}
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
