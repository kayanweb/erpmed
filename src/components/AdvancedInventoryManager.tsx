import React, { useState } from 'react';
import { useHIS } from '../context/HISContext';
import { 
  Package, Box, Search, Filter, 
  Plus, AlertCircle, ShoppingCart, 
  Truck, ArrowRight, RefreshCw,
  ClipboardList, CheckCircle2, 
  Settings, History, Download,
  LayoutGrid, List, Layers, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdvancedInventoryManager({ language, onClose }: { language: 'ar' | 'en', onClose?: () => void }) {
  const isAr = language === 'ar';
  const { inventory } = useHIS();
  const [activeTab, setActiveTab] = useState<'STOCK' | 'ORDERS' | 'STORES'>('STOCK');

  return (
    <div className="flex h-[800px] gap-6" dir={isAr ? 'rtl' : 'ltr'}>
       {/* Inventory Sidebar */}
       <div className="w-80 bg-white border border-slate-200 rounded-[32px] overflow-hidden flex flex-col shadow-sm relative">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">{isAr ? "إدارة المخازن" : "Inventory Control"}</h3>
                <button 
                  onClick={onClose}
                  className="w-5 h-5 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm group"
                >
                   <Plus className="w-4 h-4 rotate-45 group-hover:scale-110 transition-transform" />
                </button>
             </div>
             <div className="space-y-4">
                {[
                  { id: 'STOCK', labelEn: 'Stock Levels', labelAr: 'مستويات المخزون', icon: Box },
                  { id: 'ORDERS', labelEn: 'Purchase Orders', labelAr: 'أوامر الشراء', icon: ShoppingCart },
                  { id: 'STORES', labelEn: 'Sub-Stores', labelAr: 'المخازن الفرعية', icon: Layers }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                      activeTab === tab.id ? 'border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-white hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                       <tab.icon className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? tab.labelAr : tab.labelEn}</span>
                    </div>
                  </button>
                ))}
             </div>
          </div>
          
          <div className="p-8 flex-1 bg-rose-50/30 flex flex-col items-center justify-center text-center">
             <ShieldAlert className="w-12 h-12 text-rose-300 mb-4" />
             <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">{isAr ? "نواقص المخزون" : "Critical Shortages"}</h4>
             <p className="text-lg sm:text-2xl font-black text-rose-900">12</p>
          </div>
       </div>

       {/* Main Inventory Canvas */}
       <div className="flex-1 bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm flex flex-col">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-900 rounded-[24px] flex items-center justify-center text-white shadow-xl shadow-slate-100">
                   <Package className="w-5 h-5 sm:w-8 sm:h-8" />
                </div>
                <div>
                   <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">{isAr ? "إدارة المخزون الطبي الذكي" : "Smart Medical Inventory"}</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? "مراقبة سلاسل الإمداد والاستهلاك" : "Supply Chain & Consumption Monitoring"}</p>
                </div>
             </div>
             <div className="flex gap-3">
                <button className="h-12 px-6 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition">
                   <Download className="w-4 h-4" />
                </button>
                <button className="h-12 px-8 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 flex items-center gap-2">
                   <Plus className="w-4 h-4" />
                   {isAr ? "إضافة صنف" : "Add New Item"}
                </button>
             </div>
          </div>

          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: isAr ? "إجمالي الأصناف" : "Total Items", val: inventory.length, color: "blue" },
                  { label: isAr ? "قيمة المخزون" : "Stock Value", val: "1.2M", color: "emerald" },
                  { label: isAr ? "طلبات معلقة" : "Pending POs", val: "8", color: "amber" },
                  { label: isAr ? "حركات اليوم" : "Today Movements", val: "45", color: "indigo" }
                ].map((stat, i) => (
                  <div key={i} className={`p-6 bg-${stat.color}-50/50 border border-${stat.color}-100 rounded-3xl`}>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                     <p className="text-lg sm:text-2xl font-black text-slate-800">{stat.val}</p>
                  </div>
                ))}
             </div>

             <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                   <div className="relative w-full sm:w-96">
                      <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder={isAr ? "بحث في الأصناف..." : "Search inventory..."}
                        className="w-full h-10 ltr:pl-10 rtl:pr-10 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-400"
                      />
                   </div>
                   <div className="flex gap-2 min-w-max">
                      <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600"><Filter className="w-4 h-4" /></button>
                      <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600"><RefreshCw className="w-4 h-4" /></button>
                   </div>
                </div>
                <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-right" dir={isAr ? 'rtl' : 'ltr'}>
                   <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <tr>
                         <th className="px-8 py-4 text-right">{isAr ? "الصنف" : "Item"}</th>
                         <th className="px-8 py-4">{isAr ? "المخزن الرئيسي" : "Main Store"}</th>
                         <th className="px-8 py-4">{isAr ? "المخزن الفرعي" : "Sub Store"}</th>
                         <th className="px-8 py-4">{isAr ? "الوحدة" : "Unit"}</th>
                         <th className="px-8 py-4">{isAr ? "الحالة" : "Status"}</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {inventory.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-8 py-5">
                              <p className="text-xs font-black text-slate-800">{isAr ? item.nameAr : item.nameEn}</p>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">ID: {item.id}</p>
                           </td>
                           <td className="px-8 py-5 text-sm font-black text-slate-600">{item.stockMain}</td>
                           <td className="px-8 py-5 text-sm font-black text-slate-600">{item.stockSub}</td>
                           <td className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase">{item.unit}</td>
                           <td className="px-8 py-5">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                item.stockMain + item.stockSub > 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                              }`}>
                                 {item.stockMain + item.stockSub > 100 ? (isAr ? 'متوفر' : 'In Stock') : (isAr ? 'منخفض' : 'Low Stock')}
                              </span>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
</div>
             </div>
          </div>
       </div>
    </div>
  );
}
