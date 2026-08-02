import React, { useState, useEffect } from "react";
import {
  Shield,
  Search,
  Plus,
  Building,
  FileText,
  Settings,
  FileCheck,
} from "lucide-react";
import { syncSetting, saveSetting } from "../lib/firestoreService";
import { toast } from "sonner";

interface InsurancePlan {
  id: string;
  companyName: string;
  planName: string;
  companyId: string;
  coveragePercent: number;
  maxLimit: number;
  copayAmount: number;
  status: "Active" | "Inactive" | "Expired";
}

export default function InsuranceMaster({
  language,
}: {
  language: "ar" | "en";
}) {
  const isAr = language === "ar";
  const [plans, setPlans] = useState<InsurancePlan[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsub = syncSetting("his_insurance_master", (data) => {
      if (data?.value && Array.isArray(data.value)) {
        setPlans(data.value);
      } else {
        const seeded: InsurancePlan[] = [
          {
            id: "PLN-100",
            companyName: "Bupa",
            planName: "Gold Priority",
            companyId: "COMP-01",
            coveragePercent: 90,
            maxLimit: 500000,
            copayAmount: 50,
            status: "Active",
          },
          {
            id: "PLN-101",
            companyName: "Tawuniya",
            planName: "Silver Class B",
            companyId: "COMP-02",
            coveragePercent: 80,
            maxLimit: 250000,
            copayAmount: 100,
            status: "Active",
          },
          {
            id: "PLN-102",
            companyName: "Medgulf",
            planName: "Basic Worker",
            companyId: "COMP-03",
            coveragePercent: 70,
            maxLimit: 100000,
            copayAmount: 150,
            status: "Active",
          },
          {
            id: "PLN-103",
            companyName: "Al Rajhi Takaful",
            planName: "VIP Platinum",
            companyId: "COMP-04",
            coveragePercent: 100,
            maxLimit: 1000000,
            copayAmount: 0,
            status: "Expired",
          },
        ];
        setPlans(seeded);
        saveSetting("his_insurance_master", seeded);
      }
    });
    return () => unsub();
  }, []);

  const filtered = plans.filter(
    (p) =>
      p.companyName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      p.planName?.toLowerCase()?.includes(searchTerm?.toLowerCase()),
  );

  return (
    <div
      className="p-4 md:p-6 bg-slate-50 min-h-full"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Shield className="h-7 w-7 text-emerald-600" />
            {isAr
              ? "سجل التأمين والشركات (Insurance Master)"
              : "Insurance Master Index"}
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1">
            {isAr
              ? "إدارة التغطيات التأمينية، نسب التحمل، والاعتمادات"
              : "Manage coverage matrices, exclusions, and copay rules"}
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
                isAr ? "بحث شركة، خطة..." : "Search company, plan..."
              }
              className={`w-full ${isAr ? "pr-9 pl-4" : "pl-9 pr-4"} py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 font-bold`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow flex items-center gap-2 transition whitespace-nowrap">
            <Plus className="h-4 w-4" /> {isAr ? "إضافة شركة/خطة" : "Add Plan"}
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
                <th className="px-4 py-4">{isAr ? "الشركة" : "Company"}</th>
                <th className="px-4 py-4">
                  {isAr ? "اسم الخطة/الفئة" : "Plan Name"}
                </th>
                <th className="px-4 py-4 text-center">
                  {isAr ? "نسبة التغطية" : "Coverage %"}
                </th>
                <th className="px-4 py-4 text-center">
                  {isAr ? "الحد الأقصى" : "Max Limit"}
                </th>
                <th className="px-4 py-4 text-center">
                  {isAr ? "نسبة التحمل (Copay)" : "Copay"}
                </th>
                <th className="px-4 py-4 text-center">
                  {isAr ? "الحالة" : "Status"}
                </th>
                <th className="px-4 py-4 text-right">
                  {isAr ? "إجراء" : "Action"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((plan) => (
                <tr key={plan.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3">
                    <div className="font-black text-slate-800 flex items-center gap-2">
                      <Building className="w-4 h-4 text-slate-400" />{" "}
                      {plan.companyName}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-emerald-800">
                    {plan.planName}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                      {plan.coveragePercent}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-xs font-bold">
                    {plan.maxLimit.toLocaleString()} SR
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-slate-700">
                    {plan.copayAmount} SR
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${plan.status === "Active" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-rose-50 text-rose-600 border border-rose-200"}`}
                    >
                      {plan.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-slate-400 hover:text-emerald-600 p-1">
                      <Settings className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-slate-500 font-bold"
                  >
                    {isAr
                      ? "لم يتم العثور على خطط تأمين"
                      : "No insurance plans found"}
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
