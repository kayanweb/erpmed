import React, { useState, useEffect } from "react";
import { Plus, Package, Activity, RefreshCw, Trash2, ShoppingCart, ArrowLeftRight, Archive, AlertCircle, FileText, Barcode, ShieldCheck, FilePlus2, CheckCircle2, Factory, X } from "lucide-react";
import { syncSetting, saveSetting } from "../lib/firestoreService";
import { motion, AnimatePresence } from "motion/react";
import GenericActionModal from "./GenericActionModal";
import { toast } from "sonner";

interface InventoryEngineProps {
  language: "ar" | "en";
  mode: "pharmacy" | "supplies" | "laboratory" | "radiology" | "cssd" | "blood_bank" | "engineering";
  currentUser?: any;
  onClose?: () => void;
}

export default function EnterpriseInventoryEngine({ language, mode, currentUser, onClose }: InventoryEngineProps) {
  const isAr = language === "ar";

  // Tab State
  const [activeTab, setActiveTab] = useState<"dashboard" | "items" | "stock_in" | "dispense" | "transfer" | "purchase_orders" | "transactions">("dashboard");

  return (
    <div className="flex h-full w-full bg-slate-50 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
      {/* Sidebar for Engine Modules */}
      <div className="w-64 bg-white border-r border-slate-200 border-l border-slate-200 flex flex-col z-10 shrink-0">
        <div className="p-4 bg-slate-900 text-white shadow-md relative">
          {onClose && (
            <button 
              onClick={onClose}
              className="absolute top-2 ltr:right-2 rtl:left-2 p-1 hover:bg-white/20 rounded transition text-white/70 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Package className="h-6 w-6 text-pink-400" />
            <h2 className="text-lg font-black tracking-tight">
              {isAr ? "محرك المخزون الشامل" : "Enterprise Inventory"}
              <div className="text-[10px] text-pink-300 font-bold uppercase tracking-widest mt-0.5">
                {mode === "pharmacy" ? (isAr ? "الصيدلية" : "Pharmacy") : (isAr ? "المستلزمات الطبية" : "Medical Supplies")}
              </div>
            </h2>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <NavItem id="dashboard" icon={Activity} labelAr="لوحة القياس" labelEn="Dashboard" active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
          <NavItem id="items" icon={Package} labelAr="الأصناف" labelEn="Master Items" active={activeTab === "items"} onClick={() => setActiveTab("items")} />
          <div className="my-2 border-t border-slate-100 mx-2"></div>
          <div className="text-[10px] font-bold text-slate-400 uppercase px-3 py-1">{isAr ? "الحركات (Transactions)" : "Transactions"}</div>
          <NavItem id="stock_in" icon={FilePlus2} labelAr="إضافة رصيد (استلام)" labelEn="Stock In (Receipt)" active={activeTab === "stock_in"} onClick={() => setActiveTab("stock_in")} />
          <NavItem id="dispense" icon={ShoppingCart} labelAr="صرف" labelEn="Dispense" active={activeTab === "dispense"} onClick={() => setActiveTab("dispense")} />
          <NavItem id="transfer" icon={ArrowLeftRight} labelAr="تحويل مخزني" labelEn="Transfer" active={activeTab === "transfer"} onClick={() => setActiveTab("transfer")} />
          <div className="my-2 border-t border-slate-100 mx-2"></div>
          <div className="text-[10px] font-bold text-slate-400 uppercase px-3 py-1">{isAr ? "العمليات والإمداد" : "Operations"}</div>
          <NavItem id="purchase_orders" icon={Factory} labelAr="أوامر الشراء" labelEn="Purchase Orders" active={activeTab === "purchase_orders"} onClick={() => setActiveTab("purchase_orders")} />
          <NavItem id="transactions" icon={FileText} labelAr="سجل الحركات" labelEn="Audit Log" active={activeTab === "transactions"} onClick={() => setActiveTab("transactions")} />
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex-1 flex flex-col h-full min-h-0 overflow-hidden bg-slate-50/50 relative">
         <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24">
            {activeTab === "dashboard" && <InventoryDashboard isAr={isAr} mode={mode} />}
            {activeTab === "items" && <MasterItemsManager isAr={isAr} mode={mode} />}
            {(activeTab === "stock_in" || activeTab === "dispense" || activeTab === "transfer") && (
                <TransactionWorkspace isAr={isAr} mode={mode} transactionType={activeTab} />
            )}
            {activeTab === "purchase_orders" && <PurchaseOrders isAr={isAr} mode={mode} />}
            {activeTab === "transactions" && <TransactionsLog isAr={isAr} mode={mode} />}
         </div>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, labelAr, labelEn, active, onClick, id }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
        active
          ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <Icon className={`h-4 w-4 shrink-0 ${active ? "text-indigo-600" : "text-slate-400"}`} />
      <span className="flex-1 text-start">{labelAr} / {labelEn}</span>
    </button>
  );
}

function InventoryDashboard({ isAr, mode }: any) {
    return (
        <div className="space-y-6 animate-fade">
            <h3 className="text-xl font-black text-slate-800">{isAr ? "نظرة عامة على المستودعات" : "Stores Overview"} ({mode})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                    <Package className="h-8 w-8 text-indigo-500 mb-2" />
                    <span className="text-3xl font-black text-slate-800">1,240</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{isAr ? "إجمالي الأصناف" : "Total Items"}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                    <AlertCircle className="h-8 w-8 text-rose-500 mb-2" />
                    <span className="text-3xl font-black text-rose-600">12</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{isAr ? "أصناف تحت الحد الأدنى" : "Low Stock Alerts"}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                    <ArrowLeftRight className="h-8 w-8 text-teal-500 mb-2" />
                    <span className="text-3xl font-black text-slate-800">45</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{isAr ? "حركات اليوم" : "Today's Transactions"}</span>
                </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-6">
                <h4 className="text-sm font-black text-slate-800 mb-4">{isAr ? "توزيع الأرصدة في المستودعات" : "Stock Distribution by Store"}</h4>
                <div className="h-48 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 font-bold text-sm">
                    No Data Available
                </div>
            </div>
        </div>
    )
}

function MasterItemsManager({ isAr, mode }: any) {
    const isPharmacy = mode === "pharmacy";
    return (
        <div className="space-y-6 animate-fade">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-black text-slate-800">{isAr ? "قاعدة بيانات الأصناف" : "Master Items Database"}</h3>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    {isAr ? "صنف جديد" : "New Item"}
                </button>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-sm text-start">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                        <tr>
                            <th className="p-3">{isAr ? "كود" : "Code"}</th>
                            <th className="p-3">{isAr ? "الصنف" : "Item"}</th>
                            <th className="p-3">{isAr ? "الفئة" : "Category"}</th>
                            {isPharmacy && <th className="p-3">{isAr ? "الجرعة" : "Dose"}</th>}
                            {!isPharmacy && <th className="p-3">{isAr ? "المقاس/النوع" : "Size/Type"}</th>}
                            <th className="p-3 text-center">{isAr ? "الرصيد الكلي" : "Total Stock"}</th>
                            <th className="p-3 text-center">{isAr ? "إجراء" : "Actions"}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {/* Data source */}
                        <tr className="hover:bg-slate-50">
                            <td className="p-3 font-mono text-xs text-slate-500">ITM-1001</td>
                            <td className="p-3 font-bold text-slate-800">{isPharmacy ? "Paracetamol 500mg" : "Surgical Mask N95"}</td>
                            <td className="p-3">
                                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
                                    {isPharmacy ? "Analgesics" : "PPE"}
                                </span>
                            </td>
                            <td className="p-3 text-slate-500 text-xs">
                                {isPharmacy ? "500 mg" : "Standard"}
                            </td>
                            <td className="p-3 text-center font-black text-slate-700">1,250</td>
                            <td className="p-3 text-center">
                                <button className="text-indigo-600 hover:text-indigo-800 text-xs font-bold">{isAr ? "تعديل" : "Edit"}</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
</div>
            </div>
        </div>
    )
}

function TransactionWorkspace({ isAr, mode, transactionType }: any) {
    const isPharmacy = mode === "pharmacy";
    
    const getTitle = () => {
        if (transactionType === "stock_in") return isAr ? "إضافة رصيد (استلام)" : "Stock In (Receipt)";
        if (transactionType === "dispense") return isAr ? "صرف مخزني" : "Dispense Inventory";
        if (transactionType === "transfer") return isAr ? "تحويل مخزني" : "Transfer Inventory";
        return "";
    }

    return (
        <div className="space-y-6 animate-fade">
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-4xl mx-auto">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 pb-4 border-b border-slate-100">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        {transactionType === "stock_in" && <FilePlus2 className="h-5 w-5" />}
                        {transactionType === "dispense" && <ShoppingCart className="h-5 w-5" />}
                        {transactionType === "transfer" && <ArrowLeftRight className="h-5 w-5" />}
                    </div>
                    <h3 className="text-lg font-black text-slate-800">{getTitle()}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "المستودع المصدر" : "Source Store"}</label>
                        <select className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500">
                            <option>Main Store</option>
                            <option>ER Sub-Store</option>
                            <option>ICU Sub-Store</option>
                        </select>
                    </div>
                    {transactionType === "transfer" && (
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "المستودع المستلم" : "Destination Store"}</label>
                            <select className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500">
                                <option>ER Sub-Store</option>
                                <option>ICU Sub-Store</option>
                            </select>
                        </div>
                    )}
                     {(transactionType === "dispense") && (
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? "الجهة المستفيدة (مريض / قسم)" : "Beneficiary (Patient / Dept)"}</label>
                            <input type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500" placeholder={isAr ? "ابحث برقم الملف أو القسم..." : "Search MRN or Dept..."} />
                        </div>
                    )}
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                    <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider">{isAr ? "قائمة الأصناف" : "Items List"}</h4>
                    
                    <div className="flex gap-2 mb-4">
                        <div className="flex-1 relative">
                            <Barcode className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input type="text" className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500" placeholder={isAr ? "مسح الباركود أو ابحث عن صنف..." : "Scan Barcode or Search Item..."} />
                        </div>
                        <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-900 transition-colors">
                            {isAr ? "إضافة للقائمة" : "Add"}
                        </button>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                        <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-sm text-start">
                            <thead className="bg-slate-100 text-slate-500 font-bold text-[10px] uppercase">
                                <tr>
                                    <th className="p-2">{isAr ? "الصنف" : "Item"}</th>
                                    {isPharmacy && <th className="p-2">{isAr ? "رقم التشغيلة (Batch)" : "Batch No"}</th>}
                                    {isPharmacy && <th className="p-2">{isAr ? "الصلاحية" : "Expiry"}</th>}
                                    <th className="p-2 text-center w-24">{isAr ? "الكمية" : "Qty"}</th>
                                    <th className="p-2 text-center w-16"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr>
                                    <td className="p-2 font-bold text-slate-700">{isPharmacy ? "Paracetamol 500mg" : "Surgical Mask N95"}</td>
                                    {isPharmacy && <td className="p-2"><input type="text" className="w-full border border-slate-200 rounded px-2 py-1 text-xs" placeholder="B-123" /></td>}
                                    {isPharmacy && <td className="p-2"><input type="month" className="w-full border border-slate-200 rounded px-2 py-1 text-xs" /></td>}
                                    <td className="p-2"><input type="number" className="w-full border border-slate-200 rounded px-2 py-1 text-center font-bold" defaultValue={1} min={1} /></td>
                                    <td className="p-2 text-center">
                                        <button className="text-rose-500 hover:text-rose-700"><Trash2 className="h-4 w-4 mx-auto" /></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
</div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button className="px-5 py-2.5 rounded-lg text-slate-600 font-bold text-sm hover:bg-slate-100">{isAr ? "إلغاء" : "Cancel"}</button>
                    <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-sm hover:bg-indigo-700 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        {isAr ? "تنفيذ الحركة" : "Execute Transaction"}
                    </button>
                </div>
             </div>
        </div>
    )
}

function TransactionsLog({ isAr, mode }: any) {
    return (
        <div className="space-y-6 animate-fade">
             <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                 <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                     <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-indigo-600" />
                        {isAr ? "سجل الحركات (Audit Log)" : "Transactions Audit Log"}
                     </h3>
                     <div className="flex gap-2 min-w-max">
                        <input type="date" className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm" />
                        <button className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50">{isAr ? "تصدير" : "Export"}</button>
                     </div>
                 </div>
                 <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-sm text-start">
                    <thead className="bg-slate-100 border-b border-slate-200 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                        <tr>
                            <th className="p-3">{isAr ? "رقم الحركة" : "Txn ID"}</th>
                            <th className="p-3">{isAr ? "النوع" : "Type"}</th>
                            <th className="p-3">{isAr ? "التاريخ" : "Date"}</th>
                            <th className="p-3">{isAr ? "المستخدم" : "User"}</th>
                            <th className="p-3">{isAr ? "المخزن" : "Store"}</th>
                            <th className="p-3 text-center">{isAr ? "التفاصيل" : "Details"}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50">
                            <td className="p-3 font-mono text-xs text-slate-500">TXN-99281</td>
                            <td className="p-3">
                                <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                    {isAr ? "إضافة رصيد" : "Stock In"}
                                </span>
                            </td>
                            <td className="p-3 text-slate-600 text-xs">2026-07-03 10:45 AM</td>
                            <td className="p-3 font-bold text-slate-700">Dr. Ahmed</td>
                            <td className="p-3 text-slate-600">Main Store</td>
                            <td className="p-3 text-center">
                                <button className="text-indigo-600 hover:underline text-xs font-bold">{isAr ? "عرض" : "View"}</button>
                            </td>
                        </tr>
                    </tbody>
                 </table>
</div>
             </div>
        </div>
    )
}

function PurchaseOrders({ isAr, mode }: any) {
    return (
        <div className="space-y-6 animate-fade">
             <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                 <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                     <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <Factory className="h-5 w-5 text-indigo-600" />
                        {isAr ? "أوامر الشراء (Purchase Orders)" : "Purchase Orders"}
                     </h3>
                     <div className="flex gap-2 min-w-max">
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            {isAr ? "أمر شراء جديد" : "New PO"}
                        </button>
                     </div>
                 </div>
                 <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-sm text-start">
                    <thead className="bg-slate-100 border-b border-slate-200 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                        <tr>
                            <th className="p-3">{isAr ? "رقم الأمر" : "PO ID"}</th>
                            <th className="p-3">{isAr ? "المورد" : "Supplier"}</th>
                            <th className="p-3">{isAr ? "التاريخ" : "Date"}</th>
                            <th className="p-3">{isAr ? "القيمة" : "Total"}</th>
                            <th className="p-3">{isAr ? "الحالة" : "Status"}</th>
                            <th className="p-3 text-center">{isAr ? "الإجراءات" : "Actions"}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50">
                            <td className="p-3 font-mono text-xs text-slate-500 font-bold">PO-2026-081</td>
                            <td className="p-3 font-bold text-slate-700">PharmaCorp Inc.</td>
                            <td className="p-3 text-slate-600 text-xs">2026-07-01</td>
                            <td className="p-3 text-slate-700 font-bold">$12,450</td>
                            <td className="p-3">
                                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                    {isAr ? "قيد الانتظار" : "Pending"}
                                </span>
                            </td>
                            <td className="p-3 text-center">
                                <button className="text-indigo-600 hover:underline text-xs font-bold">{isAr ? "عرض" : "View"}</button>
                            </td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                            <td className="p-3 font-mono text-xs text-slate-500 font-bold">PO-2026-080</td>
                            <td className="p-3 font-bold text-slate-700">MedEquip Solutions</td>
                            <td className="p-3 text-slate-600 text-xs">2026-06-28</td>
                            <td className="p-3 text-slate-700 font-bold">$4,200</td>
                            <td className="p-3">
                                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                    {isAr ? "مكتمل" : "Received"}
                                </span>
                            </td>
                            <td className="p-3 text-center">
                                <button className="text-indigo-600 hover:underline text-xs font-bold">{isAr ? "عرض" : "View"}</button>
                            </td>
                        </tr>
                    </tbody>
                 </table>
</div>
             </div>
        </div>
    )
}
