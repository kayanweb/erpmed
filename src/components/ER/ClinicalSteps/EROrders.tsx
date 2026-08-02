import React, { useState, useMemo } from "react";
import { 
  Microscope, Monitor, Pill, Activity, Plus, Search, 
  Trash2, Send, AlertTriangle, CheckCircle2, History,
  ClipboardList, Clock, Filter, X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHIS } from "../../../context/HISContext";
import { Patient, Order } from "../../../types";
import { toast } from "sonner";

interface EROrdersProps {
  patient: Patient;
  isAr: boolean;
}

export function EROrders({ patient, isAr }: EROrdersProps) {
  const { addOrder, currentUser } = useHIS();
  const [searchQuery, setSearchQuery] = useState("");
  const [orderCart, setOrderCart] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<"lab" | "radiology" | "medication" | "nursing">("lab");

  const catalog = {
    lab: [
      { id: "L001", nameEn: "CBC / Full Blood Count", nameAr: "صورة دم كاملة", priority: "routine" },
      { id: "L002", nameEn: "Basic Metabolic Panel (BMP)", nameAr: "لوحة التمثيل الغذائي الأساسية", priority: "routine" },
      { id: "L003", nameEn: "Troponin T (Cardiac)", nameAr: "تروبونين (القلب)", priority: "stat" },
      { id: "L004", nameEn: "Coagulation Profile (PT/PTT)", nameAr: "اختبارات التجلط", priority: "stat" },
      { id: "L005", nameEn: "Urine Analysis", nameAr: "تحليل بول", priority: "routine" },
    ],
    radiology: [
      { id: "R001", nameEn: "Chest X-Ray (AP/Lat)", nameAr: "أشعة سينية على الصدر", priority: "routine" },
      { id: "R002", nameEn: "CT Brain (Non-Contrast)", nameAr: "أشعة مقطعية على المخ", priority: "stat" },
      { id: "R003", nameEn: "US Abdomen & Pelvis", nameAr: "أشعة تليفزيونية على البطن", priority: "urgent" },
      { id: "R004", nameEn: "KUB (X-Ray Abdomen)", nameAr: "أشعة سينية على المسالك", priority: "routine" },
    ],
    medication: [
      { id: "M001", nameEn: "Paracetamol 1g IV", nameAr: "باراسيتامول 1 جرام وريدي", priority: "stat" },
      { id: "M002", nameEn: "Ceftriaxone 1g IV", nameAr: "سيفترياكسون 1 جرام وريدي", priority: "routine" },
      { id: "M003", nameEn: "Normal Saline 0.9% 500ml", nameAr: "محلول ملحي 500 مل", priority: "stat" },
    ],
    nursing: [
      { id: "N001", nameEn: "Insert IV Cannula", nameAr: "تركيب كانيولا وريدية", priority: "stat" },
      { id: "N002", nameEn: "Q2H Vitals Monitoring", nameAr: "مراقبة العلامات كل ساعتين", priority: "routine" },
      { id: "N003", nameEn: "Foley Catheterization", nameAr: "تركيب قسطرة بولية", priority: "urgent" },
    ]
  };

  const addToCart = (item: any) => {
    if (orderCart.find(i => i.id === item.id)) {
      toast.error(isAr ? "تمت إضافة هذا الطلب بالفعل" : "Order already in cart");
      return;
    }
    setOrderCart([...orderCart, { ...item, timestamp: new Date().toISOString() }]);
  };

  const removeFromCart = (id: string) => {
    setOrderCart(orderCart.filter(i => i.id !== id));
  };

  const submitOrders = async () => {
    if (orderCart.length === 0) return;
    
    for (const item of orderCart) {
      await addOrder({
        patientId: patient.id,
        workflowId: patient.workflowId || 'temp-er',
        staffId: currentUser?.id || 'doc-1',
        orderType: activeCategory as any,
        itemName: item.nameEn,
        itemCode: item.id,
        status: "pending",
        priority: item.priority as any,
        timestamp: new Date().toISOString()
      });
    }
    
    setOrderCart([]);
    toast.success(isAr ? "تم إرسال الطلبات بنجاح" : "Orders submitted successfully");
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Catalog & Search */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tight text-slate-800">{isAr ? "كتالوج الأوامر الطبية (CPOE)" : "Clinical Order Catalog (CPOE)"}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Structured Physician Orders</p>
                  </div>
               </div>
               
               <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-slate-900 transition-all" 
                    placeholder={isAr ? "بحث في الكتالوج..." : "Search catalog..."} 
                  />
               </div>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-[20px] w-fit">
              {[
                { id: "lab", label: isAr ? "مختبر" : "Laboratory", icon: Microscope },
                { id: "radiology", label: isAr ? "أشعة" : "Imaging", icon: Monitor },
                { id: "medication", label: isAr ? "دواء" : "Pharmacy", icon: Pill },
                { id: "nursing", label: isAr ? "تمريض" : "Nursing", icon: Activity },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeCategory === cat.id 
                      ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200" 
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <cat.icon size={14} />
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 min-h-[400px]">
               {catalog[activeCategory].filter(item => 
                 item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 item.nameAr.includes(searchQuery)
               ).map(item => (
                 <button 
                   key={item.id}
                   onClick={() => addToCart(item)}
                   className="p-5 bg-white border border-slate-100 rounded-3xl flex items-center justify-between group hover:border-slate-300 hover:shadow-md hover:bg-slate-50 transition-all text-left"
                 >
                    <div className="flex items-center gap-4">
                       <div className={`w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          {activeCategory === 'lab' && <Microscope className="w-5 h-5 text-blue-500" />}
                          {activeCategory === 'radiology' && <Monitor className="w-5 h-5 text-emerald-500" />}
                          {activeCategory === 'medication' && <Pill className="w-5 h-5 text-rose-500" />}
                          {activeCategory === 'nursing' && <Activity className="w-5 h-5 text-amber-500" />}
                       </div>
                       <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-800 leading-tight mb-1">{isAr ? item.nameAr : item.nameEn}</span>
                          <div className="flex items-center gap-2">
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.id}</span>
                             <span className="text-slate-300">•</span>
                             <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${item.priority === 'stat' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>
                               {item.priority}
                             </span>
                          </div>
                       </div>
                    </div>
                    <Plus className="w-5 h-5 text-slate-300 group-hover:text-slate-900 group-hover:rotate-90 transition-all" />
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* Order Cart (Right Panel) */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 rounded-[40px] text-white flex flex-col h-full min-h-[600px] shadow-2xl shadow-slate-200">
              <div className="p-8 border-b border-white/10 flex justify-between items-center shrink-0">
                 <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">{isAr ? "سلة الأوامر" : "Current Cart"}</h3>
                    <h2 className="text-lg font-black tracking-tighter">{orderCart.length} {isAr ? "أوامر مختارة" : "Orders Selected"}</h2>
                 </div>
                 <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                    <History size={18} className="text-slate-500" />
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-3 custom-scrollbar">
                 <AnimatePresence>
                    {orderCart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                         <ClipboardList size={48} className="text-slate-500" />
                         <p className="text-xs font-black uppercase tracking-widest">Cart is Empty</p>
                      </div>
                    ) : (
                      orderCart.map((item, idx) => (
                        <motion.div 
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group"
                        >
                           <div className="flex flex-col">
                              <span className="text-xs font-black text-white leading-tight mb-1">{isAr ? item.nameAr : item.nameEn}</span>
                              <div className="flex items-center gap-2">
                                 <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${item.priority === 'stat' ? 'bg-rose-500/20 text-rose-400' : 'bg-white/10 text-slate-500'}`}>
                                   {item.priority}
                                 </span>
                              </div>
                           </div>
                           <button 
                             onClick={() => removeFromCart(item.id)}
                             className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
                           >
                              <X size={14} />
                           </button>
                        </motion.div>
                      ))
                    )}
                 </AnimatePresence>
              </div>

              <div className="p-8 bg-white/5 border-t border-white/10 shrink-0">
                 <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                       <span>{isAr ? "موظف الطلب" : "Ordering Staff"}</span>
                       <span className="text-white">DR. {currentUser?.nameEn?.toUpperCase() || "STAFF"}</span>
                    </div>
                    <button 
                      onClick={submitOrders}
                      disabled={orderCart.length === 0}
                      className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-900/50 hover:bg-rose-700 disabled:opacity-20 disabled:grayscale transition-all flex items-center justify-center gap-2"
                    >
                       <Send size={16} />
                       {isAr ? "إرسال وتوثيق الطلبات" : "Submit & Sign Orders"}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
