import React from 'react';
import { Settings, Save, Shield, Bell } from 'lucide-react';

export default function DepartmentSettings({ language }: { language: 'ar' | 'en' }) {
  const isAr = language === 'ar';

  return (
    <div className="p-6 max-w-4xl space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      <div>
        <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-600" />
          {isAr ? 'إعدادات القسم' : 'Department Settings'}
        </h2>
        <p className="text-slate-500 mt-1">{isAr ? 'إدارة تفضيلات وتكوينات القسم' : 'Manage department preferences and configurations'}</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-500" />
            {isAr ? 'الإشعارات والتنبيهات' : 'Notifications & Alerts'}
          </h3>
          <div className="mt-4 space-y-4">
            <label className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer">
              <div>
                <p className="font-bold text-slate-700">{isAr ? 'تنبيهات الحالات الحرجة' : 'Critical Case Alerts'}</p>
                <p className="text-sm text-slate-500">{isAr ? 'إرسال إشعارات فورية عند وجود حالات حرجة' : 'Send instant notifications for critical cases'}</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600" />
            </label>
            <label className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer">
              <div>
                <p className="font-bold text-slate-700">{isAr ? 'تنبيهات الأسرة الشاغرة' : 'Available Bed Alerts'}</p>
                <p className="text-sm text-slate-500">{isAr ? 'إعلام عند توفر سرير جديد في القسم' : 'Notify when a new bed becomes available'}</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600" />
            </label>
          </div>
        </div>

        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-500" />
            {isAr ? 'تفضيلات سير العمل' : 'Workflow Preferences'}
          </h3>
          <div className="mt-4 space-y-4">
            <label className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer">
              <div>
                <p className="font-bold text-slate-700">{isAr ? 'الفرز التلقائي للمرضى' : 'Auto-triage Patients'}</p>
                <p className="text-sm text-slate-500">{isAr ? 'تفعيل الفرز التلقائي بناءً على العلامات الحيوية' : 'Enable automatic triage based on vital signs'}</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600" />
            </label>
            <label className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer">
              <div>
                <p className="font-bold text-slate-700">{isAr ? 'تخصيص المهام التلقائي' : 'Auto-assign Tasks'}</p>
                <p className="text-sm text-slate-500">{isAr ? 'تخصيص المهام تلقائياً للتمريض المتاح' : 'Automatically assign tasks to available nurses'}</p>
              </div>
              <input type="checkbox" className="w-5 h-5 accent-indigo-600" />
            </label>
          </div>
        </div>

        <div className="p-6 bg-slate-50 flex justify-end gap-3">
          <button className="px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition">
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button className="px-5 py-2.5 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-2 transition shadow-sm">
            <Save className="w-4 h-4" />
            {isAr ? 'حفظ الإعدادات' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
