import React, { useState, useEffect } from "react";
import { Package, AlertCircle, ShoppingCart } from "lucide-react";
import { syncSetting, saveSetting } from "../lib/firestoreService";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  store: string;
  qty: number;
  minLevel: number;
  batch: string;
}

export default function InventoryManager({
  language,
}: {
  language: "ar" | "en";
}) {
  const isAr = language === "ar";
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const unsub = syncSetting("his_inventory", (data) => {
      if (data?.value && Array.isArray(data.value)) {
        setItems(data.value);
      } else {
        const seeded: InventoryItem[] = [
          {
            id: "ITM-001",
            name: "Surgical Masks (Box of 50)",
            category: "Consumables",
            store: "Main Med Store",
            qty: 450,
            minLevel: 100,
            batch: "B-2201",
          },
          {
            id: "ITM-002",
            name: "IV Fluid - Normal Saline",
            category: "Fluids",
            store: "ER Sub-Store",
            qty: 25,
            minLevel: 50,
            batch: "B-8822",
          },
        ];
        setItems(seeded);
        saveSetting("his_inventory", seeded);
      }
    });
    return () => unsub();
  }, []);

  return (
    <div
      className="p-4 md:p-6 bg-slate-50 min-h-full"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Package className="h-7 w-7 text-indigo-600" />
            {isAr ? "إدارة المخزون الطبي" : "Medical Inventory Manager"}
          </h2>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-sm text-left" dir={isAr ? "rtl" : "ltr"}>
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-4 py-4">{isAr ? "الصنف" : "Item"}</th>
              <th className="px-4 py-4">{isAr ? "المستودع" : "Store"}</th>
              <th className="px-4 py-4 text-center">
                {isAr ? "المخزون" : "Qty"}
              </th>
              <th className="px-4 py-4 text-center">
                {isAr ? "تنبيه" : "Alert"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-slate-800">
                  {item.name}
                </td>
                <td className="px-4 py-3 font-bold text-slate-600">
                  {item.store}
                </td>
                <td className="px-4 py-3 text-center font-black">{item.qty}</td>
                <td className="px-4 py-3 text-center">
                  {item.qty < item.minLevel ? (
                    <AlertCircle className="w-5 h-5 text-rose-500 mx-auto" />
                  ) : (
                    <span className="text-emerald-500 font-bold">
                      {isAr ? "جيد" : "OK"}
                    </span>
                  )}
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
