import React, { useState, useEffect } from "react";
import { WalletCards, FileText, CheckCircle } from "lucide-react";
import { syncSetting, saveSetting } from "../lib/firestoreService";

interface POItem {
  id: string;
  supplier: string;
  total: number;
  status: "Pending" | "Approved" | "Received";
}

export default function PurchasingPO({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";
  const [pos, setPos] = useState<POItem[]>([]);

  useEffect(() => {
    const unsub = syncSetting("his_purchasing_pos", (data) => {
      if (data?.value && Array.isArray(data.value)) {
        setPos(data.value);
      } else {
        const seeded: POItem[] = [
          {
            id: "PO-2023-001",
            supplier: "Global Med Supplies",
            total: 45000,
            status: "Approved",
          },
          {
            id: "PO-2023-002",
            supplier: "Pfizer MENA",
            total: 120000,
            status: "Pending",
          },
        ];
        setPos(seeded);
        saveSetting("his_purchasing_pos", seeded);
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
            <WalletCards className="h-7 w-7 text-emerald-600" />
            {isAr ? "المشتريات وأوامر الشراء (POs)" : "Purchasing & POs"}
          </h2>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-sm text-left" dir={isAr ? "rtl" : "ltr"}>
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-4 py-4">{isAr ? "رقم الأمر" : "PO ID"}</th>
              <th className="px-4 py-4">{isAr ? "المورد" : "Supplier"}</th>
              <th className="px-4 py-4">{isAr ? "الإجمالي" : "Total"}</th>
              <th className="px-4 py-4 text-center">
                {isAr ? "الحالة" : "Status"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pos.map((po) => (
              <tr key={po.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono font-bold text-emerald-700">
                  {po.id}
                </td>
                <td className="px-4 py-3 font-bold text-slate-800">
                  {po.supplier}
                </td>
                <td className="px-4 py-3 font-black text-slate-700">
                  {po.total.toLocaleString()} SR
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold border ${po.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}
                  >
                    {po.status}
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
