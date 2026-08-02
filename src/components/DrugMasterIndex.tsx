import React, { useState, useEffect } from "react";
import {
  Pill,
  Search,
  Plus,
  Filter,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";
import { syncSetting, saveSetting } from "../lib/firestoreService";
import { toast } from "sonner";

interface DrugItem {
  id: string;
  code: string;
  name: string;
  strength: string;
  form: string;
  atcClass: string;
  stockQty: number;
  interactions: string[];
}

export default function DrugMasterIndex({
  language,
}: {
  language: "ar" | "en";
}) {
  const isAr = language === "ar";
  const [drugs, setDrugs] = useState<DrugItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsub = syncSetting("his_drug_master", (data) => {
      if (data?.value && Array.isArray(data.value)) {
        setDrugs(data.value);
      } else {
        const seeded: DrugItem[] = [
          {
            id: "DRG-001",
            code: "PAR500",
            name: "Paracetamol",
            strength: "500mg",
            form: "Tablet",
            atcClass: "N02BE01",
            stockQty: 1250,
            interactions: ["Warfarin"],
          },
          {
            id: "DRG-002",
            code: "AMO875",
            name: "Amoxicillin / Clavulanate",
            strength: "875/125mg",
            form: "Tablet",
            atcClass: "J01CR02",
            stockQty: 430,
            interactions: ["Methotrexate", "Allopurinol"],
          },
          {
            id: "DRG-003",
            code: "CTR1G",
            name: "Ceftriaxone",
            strength: "1g",
            form: "Vial IV/IM",
            atcClass: "J01DD04",
            stockQty: 85,
            interactions: ["Calcium-containing IV solutions"],
          },
          {
            id: "DRG-004",
            code: "PAN40",
            name: "Pantoprazole",
            strength: "40mg",
            form: "Vial",
            atcClass: "A02BC02",
            stockQty: 210,
            interactions: [],
          },
          {
            id: "DRG-005",
            code: "INS100",
            name: "Insulin Glargine",
            strength: "100IU/mL",
            form: "Pen",
            atcClass: "A10AE04",
            stockQty: 30,
            interactions: ["Beta-blockers"],
          },
        ];
        setDrugs(seeded);
        saveSetting("his_drug_master", seeded);
      }
    });
    return () => unsub();
  }, []);

  const filtered = drugs.filter(
    (d) =>
      d.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      d.code?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      d.atcClass?.toLowerCase()?.includes(searchTerm?.toLowerCase()),
  );

  return (
    <div
      className="p-4 md:p-6 bg-slate-50 min-h-full"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Pill className="h-7 w-7 text-indigo-600" />
            {isAr ? "الفهرس الدوائي الرئيسي" : "Drug Master Index"}
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1">
            {isAr
              ? "المرجع الشامل للأدوية والجرعات والتفاعلات ونسبة المخزون"
              : "Universal medication dictionary tracking stock, dosages, alerts, and interactions"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search
              className={`absolute ${isAr ? "right-3" : "left-3"} top-2.5 h-4 w-4 text-slate-400`}
            />
            <input
              type="text"
              placeholder={
                isAr
                  ? "بحث كود، اسم، أو فئة (ATC)..."
                  : "Search Code, Name, ATC..."
              }
              className={`w-full ${isAr ? "pr-9 pl-4" : "pl-9 pr-4"} py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 font-bold`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow flex items-center gap-2 transition whitespace-nowrap">
            <Plus className="h-4 w-4" /> {isAr ? "إضافة دواء" : "Add Drug"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table
            className="w-full text-sm text-left"
            dir={isAr ? "rtl" : "ltr"}
          >
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-4">{isAr ? "الكود" : "Code"}</th>
                <th className="px-4 py-4">{isAr ? "الاسم" : "Name"}</th>
                <th className="px-4 py-4">
                  {isAr ? "التركيز/الشكل" : "Strength/Form"}
                </th>
                <th className="px-4 py-4">
                  {isAr ? "فئة (ATC)" : "ATC Class"}
                </th>
                <th className="px-4 py-4">{isAr ? "المخزون" : "Stock"}</th>
                <th className="px-4 py-4">
                  {isAr ? "التفاعلات/التعارضات" : "Interactions"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((drug) => (
                <tr key={drug.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-mono font-bold text-indigo-600 bg-indigo-50/30">
                    {drug.code}
                  </td>
                  <td className="px-4 py-3 font-black text-slate-800">
                    {drug.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-bold text-xs">
                    <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 mr-2">
                      {drug.strength}
                    </span>
                    {drug.form}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500 font-bold">
                    {drug.atcClass}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold border ${drug.stockQty < 100 ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}
                    >
                      {drug.stockQty}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-slate-600">
                    {drug.interactions.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {drug.interactions.map((int, i) => (
                          <span
                            key={i}
                            className="bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded flex items-center gap-1"
                          >
                            <AlertCircle className="w-3 h-3" /> {int}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 font-normal">
                        {isAr ? "مأمون التفاعل العام" : "None indicated"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-slate-500 font-bold"
                  >
                    {isAr ? "لم يتم العثور على أدوية" : "No drugs found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
