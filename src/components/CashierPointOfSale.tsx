import React, { useState, useEffect } from "react";
import { GlobalEntityLink } from "./GlobalEntityLink";
import { Banknote, Receipt, CreditCard, ShieldCheck, Printer, CheckCircle2, X } from "lucide-react";
import { syncSetting, saveSetting } from "../lib/firestoreService";
import { toast } from "sonner";

interface PaymentItem {
  id: string;
  invoice: string;
  patient: string;
  amount: number;
  method: string;
}

export default function CashierPointOfSale({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Form State
  const [cashAmt, setCashAmt] = useState(0);
  const [visaAmt, setVisaAmt] = useState(0);
  const [insuranceAmt, setInsuranceAmt] = useState(350);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const unsub = syncSetting("his_cashier", (data) => {
      if (data?.value && Array.isArray(data.value)) {
        setPayments(data.value);
      } else {
        const seeded: PaymentItem[] = [
          {
            id: "PAY-101",
            invoice: "INV-992",
            patient: "Ahmed Yassin",
            amount: 150,
            method: "Credit Card",
          },
        ];
        setPayments(seeded);
        saveSetting("his_cashier", seeded);
      }
    });
    return () => unsub();
  }, []);

  // Visit Charges Data
  const visitCharges = [
    { item: "Cardiology Consultation", type: "Consultation", amount: 200 },
    { item: "CBC + Lipid Panel", type: "Lab", amount: 120 },
    { item: "Chest X-Ray", type: "Radiology", amount: 150 },
    { item: "Metformin 500mg", type: "Medication", amount: 30 },
  ];

  const subTotal = visitCharges.reduce((acc, curr) => acc + curr.amount, 0);
  const totalDue = subTotal - discount - insuranceAmt;

  const handleConfirmPayment = async () => {
    if (cashAmt + visaAmt < totalDue && totalDue > 0) {
      toast.error(isAr ? "المبلغ المدفوع لا يغطي الإجمالي" : "Paid amount does not cover the total due");
      return;
    }

    let method = "Mixed";
    if (cashAmt > 0 && visaAmt === 0) method = "Cash";
    if (visaAmt > 0 && cashAmt === 0) method = "Visa";

    const next = [{
      id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      invoice: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      patient: "Omar Samir",
      amount: totalDue > 0 ? totalDue : 0,
      method
    }, ...payments];

    setPayments(next);
    await saveSetting("his_cashier", next);
    setShowPaymentModal(false);
    toast.success(isAr ? "تم تأكيد الدفع بنجاح" : "Payment confirmed successfully");
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen font-sans" dir={isAr ? "rtl" : "ltr"}>
      
      {showPaymentModal && (
        <div className="fixed inset-0 z-modal flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
             <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-emerald-500" /> {isAr ? "استلام دفعة" : "Receive Payment"}
                </h3>
                <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:bg-slate-200 rounded p-1"><X className="w-5 h-5"/></button>
             </div>
             <div className="p-6 space-y-6">
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex justify-between items-center">
                  <span className="font-bold text-slate-700">{isAr ? "المبلغ المستحق للدفع" : "Patient Total Due"}</span>
                  <span className="text-lg sm:text-2xl font-black text-emerald-700">{totalDue > 0 ? totalDue : 0} SR</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-2"><Banknote className="w-4 h-4"/> Cash</label>
                    <input type="number" value={cashAmt} onChange={e => setCashAmt(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-2"><CreditCard className="w-4 h-4"/> Visa / Master</label>
                    <input type="number" value={visaAmt} onChange={e => setVisaAmt(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-500" />
                  </div>
                </div>
             </div>
             <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
               <button onClick={handleConfirmPayment} className="px-6 py-2.5 font-bold text-white bg-emerald-600 rounded-xl shadow-sm hover:bg-emerald-700 transition flex items-center gap-2">
                 <CheckCircle2 className="w-4 h-4"/> Confirm Payment
               </button>
               <button className="px-6 py-2.5 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition flex items-center gap-2">
                 <Printer className="w-4 h-4"/> Print Receipt
               </button>
             </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Banknote className="h-7 w-7 text-emerald-600" />
            {isAr ? "الصندوق ونقاط البيع (Cashier & POS)" : "Cashier & POS"}
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">Manage visit charges, insurance checks, and patient payments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                 <h3 className="font-black text-slate-800 flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-indigo-500" /> Current Visit Charges
                 </h3>
                 <span className="text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">Patient: MRN-2026-0041 - Omar Samir</span>
              </div>
              <div className="p-4">
                 <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-sm">
                   <thead className="text-xs text-slate-500 border-b border-slate-100">
                     <tr>
                       <th className="py-2 text-start">Description</th>
                       <th className="py-2 text-center">Category</th>
                       <th className="py-2 text-end">Amount (SR)</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {visitCharges.map((c, i) => (
                       <tr key={i}>
                         <td className="py-3 font-bold text-slate-700">{c.item}</td>
                         <td className="py-3 text-center"><span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold">{c.type}</span></td>
                         <td className="py-3 text-end font-mono">{c.amount.toFixed(2)}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
</div>
              </div>
           </div>

           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-black text-slate-800 flex items-center gap-2">
                   <Banknote className="w-5 h-5 text-emerald-500" /> Recent Transactions
                </h3>
             </div>
             <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-sm">
              <thead className="bg-white text-slate-500 text-xs border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 text-start">Payment ID</th>
                  <th className="px-4 py-3 text-start">Patient</th>
                  <th className="px-4 py-3 text-end">Amount</th>
                  <th className="px-4 py-3 text-center">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-slate-600">{p.id}</td>
                    <td className="px-4 py-3 font-bold text-slate-800">
                      <GlobalEntityLink entityName={p.patient} entityType="patient" isAr={false}>
                        {p.patient}
                      </GlobalEntityLink>
                    </td>
                    <td className="px-4 py-3 text-end font-black text-emerald-700">{p.amount.toLocaleString()} SR</td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold border border-slate-200 inline-block w-fit">
                        {p.method}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
</div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-black text-slate-800 mb-4 border-b border-slate-100 pb-2">Billing Summary</h3>
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Subtotal</span>
                  <span className="font-mono font-bold">{subTotal.toFixed(2)} SR</span>
                </div>
                <div className="flex justify-between text-indigo-600">
                  <span className="font-bold">Insurance Coverage</span>
                  <span className="font-mono font-bold">- {insuranceAmt.toFixed(2)} SR</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span className="font-bold">Discount</span>
                  <span className="font-mono font-bold">- {discount.toFixed(2)} SR</span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-black text-slate-800 text-lg">Total Due</span>
                  <span className="font-black font-mono text-emerald-600 text-xl">{totalDue > 0 ? totalDue.toFixed(2) : '0.00'} SR</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                 <button onClick={() => setDiscount(50)} className="bg-rose-50 text-rose-700 border border-rose-200 py-2 rounded-xl text-xs font-bold hover:bg-rose-100 transition">
                   Apply 50 SR Discount
                 </button>
                 <button className="bg-indigo-50 text-indigo-700 border border-indigo-200 py-2 rounded-xl text-xs font-bold hover:bg-indigo-100 transition flex items-center justify-center gap-1">
                   <ShieldCheck className="w-4 h-4"/> Check Insurance
                 </button>
              </div>

              <div className="space-y-2">
                 <button onClick={() => setShowPaymentModal(true)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-sm transition flex items-center justify-center gap-2">
                   <Banknote className="w-5 h-5"/> Receive Payment
                 </button>
                 <button className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl shadow-sm transition flex items-center justify-center gap-2">
                   <Receipt className="w-5 h-5"/> Generate Invoice
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
