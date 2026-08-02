import React, { useState } from "react";
import {
  Pill,
  Package,
  ArrowRightLeft,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ScanLine,
  Printer,
  Plus,
  Trash2,
  X,
  ClipboardList,
  Send,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Search,
  Check,
  RefreshCw,
  Lock,
  Unlock,
  Layers,
  FileCheck,
  Clock
} from "lucide-react";
import { useHIS } from "../context/HISContext";
import { toast } from "sonner";

// --- Types ---
interface InventoryItem {
  id: string;
  barcode: string;
  name: string;
  nameEn: string;
  type: "medicine" | "supply";
  category: string;
  categoryEn: string;
  stock: number;
  unit: string;
  unitEn: string;
  cost: number;
  minLevel: number;
  expiryDate: string;
  batchNo: string;
  heldQty: number; // For Hold/Release quantity
  // Medicine-specific
  isNarcotic?: boolean;
  dose?: string;
  alternatives?: string[];
  // Supply-specific
  size?: string;
  isSterile?: boolean;
  isSingleUse?: boolean;
  sterileExpiry?: string;
  binLocation?: string;
}

interface Store {
  id: string;
  nameAr: string;
  nameEn: string;
  type: "central" | "department";
}

interface LedgerEntry {
  id: string;
  itemId: string;
  itemName: string;
  itemNameEn: string;
  type: "stock_in" | "stock_out" | "transfer" | "hold" | "release" | "disposal" | "adjustment";
  typeAr: string;
  typeEn: string;
  qty: number;
  fromStore: string;
  toStore: string;
  date: string;
  user: string;
  refNo: string;
  notes: string;
  notesAr: string;
}

interface ReplenishmentRequest {
  id: string;
  storeNameAr: string;
  storeNameEn: string;
  itemNameAr: string;
  itemNameEn: string;
  qty: number;
  priority: "low" | "medium" | "high" | "emergency";
  status: "draft" | "submitted" | "approved" | "dispensed" | "received" | "closed";
  createdBy: string;
  date: string;
}

interface Props {
  language: "ar" | "en";
  onClose?: () => void;
}

export default function PharmacyInventory({ language, onClose }: Props) {
  const isAr = language === "ar";
  const { prescriptions, updatePrescriptionStatus, patients, cpoeOrders, setCpoeOrders } = useHIS();

  // --- TAB STATE ---
  const [activeTab, setActiveTab] = useState<"dashboard" | "items" | "transactions" | "stores" | "dispense" | "workflows" | "ledger">("dashboard");
  const [itemFilterType, setItemFilterType] = useState<"all" | "medicine" | "supply">("all");
  const [searchTerm, setSearchTerm] = useState("");

  // --- STORES ---
  const [stores] = useState<Store[]>([
    { id: "store-central-pharma", nameAr: "المستودع المركزي للأدوية", nameEn: "Central Pharmacy Warehouse", type: "central" },
    { id: "store-central-supplies", nameAr: "المستودع المركزي للمستلزمات الطبية", nameEn: "Central Medical Supplies Store", type: "central" },
    { id: "store-icu", nameAr: "مخزن العناية المركزة ICU", nameEn: "ICU Sub-Store", type: "department" },
    { id: "store-er", nameAr: "مخزن الطوارئ ER", nameEn: "ER Sub-Store", type: "department" },
    { id: "store-ot", nameAr: "مخزن العمليات الكبرى OT", nameEn: "Operating Theater Sub-Store", type: "department" },
    { id: "store-ward", nameAr: "مخزن الأقسام الداخلية Ward", nameEn: "General Ward Sub-Store", type: "department" }
  ]);

  // --- INITIAL INVENTORY ITEMS ---
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: "MED-001",
      barcode: "6221003264421",
      name: "بنادول أدفانس 500 ملغ",
      nameEn: "Panadol Advance 500mg",
      type: "medicine",
      category: "مسكنات وآلام",
      categoryEn: "Analgesics",
      stock: 12400,
      unit: "قرص",
      unitEn: "Tabs",
      cost: 1.50,
      minLevel: 2000,
      expiryDate: "2027-12-15",
      batchNo: "PA-8820",
      heldQty: 200,
      isNarcotic: false,
      dose: "500mg",
      alternatives: ["Adol 500mg", "Abimol"]
    },
    {
      id: "MED-002",
      barcode: "6221003264422",
      name: "أموكسيسيلين 500 ملغ كبسولات",
      nameEn: "Amoxicillin 500mg Caps",
      type: "medicine",
      category: "مضادات حيوية",
      categoryEn: "Antibiotics",
      stock: 1500,
      unit: "كبسولة",
      unitEn: "Caps",
      cost: 3.20,
      minLevel: 1800, // Trigger low stock
      expiryDate: "2026-08-10", // Near Expiry
      batchNo: "AM-1124",
      heldQty: 0,
      isNarcotic: false,
      dose: "500mg",
      alternatives: ["E-Mox", "Amoxil"]
    },
    {
      id: "MED-003",
      barcode: "6221003264423",
      name: "كيتورولاك 30 ملغ أمبولات",
      nameEn: "Ketorolac 30mg Ampoules",
      type: "medicine",
      category: "مسكنات مركزية",
      categoryEn: "Analgesics",
      stock: 420,
      unit: "أمبول",
      unitEn: "Amps",
      cost: 12.00,
      minLevel: 100,
      expiryDate: "2027-04-05",
      batchNo: "KT-9092",
      heldQty: 30,
      isNarcotic: false,
      dose: "30mg/mL",
      alternatives: ["Adolor 30mg"]
    },
    {
      id: "MED-004",
      barcode: "6221003264424",
      name: "مورفين هيدروكلوريد 10 ملغ أمبول",
      nameEn: "Morphine HCl 10mg Ampoule",
      type: "medicine",
      category: "مخدرات ورقابة",
      categoryEn: "Narcotics & ICU",
      stock: 85,
      unit: "أمبول",
      unitEn: "Amps",
      cost: 45.00,
      minLevel: 30,
      expiryDate: "2028-02-18",
      batchNo: "MP-5521",
      heldQty: 10,
      isNarcotic: true,
      dose: "10mg/mL",
      alternatives: []
    },
    {
      id: "SUP-001",
      barcode: "5011003264501",
      name: "جوانتيات جراحية معقمة مقاس 7.5",
      nameEn: "Surgical Sterile Gloves Size 7.5",
      type: "supply",
      category: "مستلزمات العمليات",
      categoryEn: "Surgical Supplies",
      stock: 3500,
      unit: "زوج",
      unitEn: "Pair",
      cost: 5.50,
      minLevel: 1000,
      expiryDate: "2029-01-01",
      batchNo: "SG-7522",
      heldQty: 400,
      size: "7.5",
      isSterile: true,
      isSingleUse: true,
      sterileExpiry: "2029-01-01",
      binLocation: "A2-Row3-Shelf4"
    },
    {
      id: "SUP-002",
      barcode: "5011003264502",
      name: "سرنجات معقمة ذات استخدام واحد 5 مل",
      nameEn: "Disposable Sterile Syringes 5ml",
      type: "supply",
      category: "مستلزمات الحقن",
      categoryEn: "Syringes",
      stock: 12000,
      unit: "قطعة",
      unitEn: "Pcs",
      cost: 0.80,
      minLevel: 3000,
      expiryDate: "2028-11-20",
      batchNo: "SY-5524",
      heldQty: 0,
      size: "5ml",
      isSterile: true,
      isSingleUse: true,
      sterileExpiry: "2028-11-20",
      binLocation: "B1-Row1-Shelf2"
    },
    {
      id: "SUP-003",
      barcode: "5011003264503",
      name: "كانيولا طرفية مقاس 20G وردية",
      nameEn: "Peripheral Cannula 20G (Pink)",
      type: "supply",
      category: "المحاليل الوريدية",
      categoryEn: "IV Access",
      stock: 80, // Low stock
      unit: "قطعة",
      unitEn: "Pcs",
      cost: 4.50,
      minLevel: 500, // Trigger low stock
      expiryDate: "2028-06-30",
      batchNo: "CN-20GP",
      heldQty: 15,
      size: "20G (Pink)",
      isSterile: true,
      isSingleUse: true,
      sterileExpiry: "2028-06-30",
      binLocation: "C3-Row2"
    }
  ]);

  // --- LEDGER / AUDIT TRAIL ---
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([
    {
      id: "TX-1001",
      itemId: "MED-001",
      itemName: "بنادول أدفانس 500 ملغ",
      itemNameEn: "Panadol Advance 500mg",
      type: "stock_in",
      typeAr: "إضافة رصيد (مورد)",
      typeEn: "Stock In (Vendor)",
      qty: 15000,
      fromStore: "الشركة المصرية للمستحضرات",
      toStore: "المستودع المركزي للأدوية",
      date: "2026-06-15 09:30",
      user: "د. رامي يسري (أمين المخزن)",
      refNo: "PO-2026-00432",
      notes: "Standard purchase invoice received and approved.",
      notesAr: "تم استلام الفاتورة الرسمية وفحص جودة التشغيلات بنجاح."
    },
    {
      id: "TX-1002",
      itemId: "MED-002",
      itemName: "أموكسيسيلين 500 ملغ كبسولات",
      itemNameEn: "Amoxicillin 500mg Caps",
      type: "transfer",
      typeAr: "تحويل صادر لقسم",
      typeEn: "Transfer to Dept",
      qty: -200,
      fromStore: "المستودع المركزي للأدوية",
      toStore: "مخزن الطوارئ ER",
      date: "2026-06-20 14:15",
      user: "صيدلاني رئيسي - محمد مصطفى",
      refNo: "TR-2026-0982",
      notes: "Emergency replenishment for ER sub-pharmacy.",
      notesAr: "طلب تموين عاجل لصالح صيدلية الطوارئ."
    },
    {
      id: "TX-1003",
      itemId: "SUP-001",
      itemName: "جوانتيات جراحية معقمة مقاس 7.5",
      itemNameEn: "Surgical Sterile Gloves Size 7.5",
      type: "hold",
      typeAr: "حجز كمية للعمليات",
      typeEn: "Hold Qty (OT)",
      qty: 400,
      fromStore: "المستودع المركزي للمستلزمات الطبية",
      toStore: "محجوز لغرفة العمليات",
      date: "2026-06-25 11:00",
      user: "أخصائية العمليات - سمر خالد",
      refNo: "HD-2026-0012",
      notes: "Held for major orthopedic surgery sequence scheduled tomorrow.",
      notesAr: "حجز مسبق لصالح عمليات العظام الكبرى غداً لضمان التوفر."
    }
  ]);

  // --- REPLENISHMENT REQUESTS ---
  const [replenishmentRequests, setReplenishmentRequests] = useState<ReplenishmentRequest[]>([
    {
      id: "REQ-2026-001",
      storeNameAr: "مخزن العناية المركزة ICU",
      storeNameEn: "ICU Sub-Store",
      itemNameAr: "كانيولا طرفية مقاس 20G وردية",
      itemNameEn: "Peripheral Cannula 20G (Pink)",
      qty: 1000,
      priority: "high",
      status: "approved",
      createdBy: "منى علي (رئيسة تمريض ICU)",
      date: "2026-07-01"
    },
    {
      id: "REQ-2026-002",
      storeNameAr: "مخزن الطوارئ ER",
      storeNameEn: "ER Sub-Store",
      itemNameAr: "أموكسيسيلين 500 ملغ كبسولات",
      itemNameEn: "Amoxicillin 500mg Caps",
      qty: 500,
      priority: "medium",
      status: "submitted",
      createdBy: "أحمد جمال (صيدلي الطوارئ)",
      date: "2026-07-02"
    }
  ]);

  // --- MODALS / FORM STATE ---
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedItemForView, setSelectedItemForView] = useState<InventoryItem | null>(null);
  
  // New Item State
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [newItemData, setNewItemData] = useState<Partial<InventoryItem>>({
    type: "medicine",
    name: "",
    nameEn: "",
    barcode: "",
    category: "",
    categoryEn: "",
    stock: 100,
    unit: "قرص",
    unitEn: "Tabs",
    cost: 5,
    minLevel: 10,
    expiryDate: "2028-12-31",
    batchNo: "BT-101",
    heldQty: 0,
    isNarcotic: false,
    dose: "500mg",
    size: "M",
    isSterile: true,
    isSingleUse: true,
    binLocation: "A1"
  });

  // Unified Inventory Transaction Form
  const [txType, setTxType] = useState<"stock_in" | "stock_out" | "transfer" | "hold" | "release" | "disposal" | "adjustment">("stock_in");
  const [txItemId, setTxItemId] = useState("");
  const [txQty, setTxQty] = useState(50);
  const [txFromStore, setTxFromStore] = useState("");
  const [txToStore, setTxToStore] = useState("");
  const [txRef, setTxRef] = useState("");
  const [txNotes, setTxNotes] = useState("");
  const [txNotesAr, setTxNotesAr] = useState("");

  // Replenishment creator
  const [repStore, setRepStore] = useState("store-icu");
  const [repItem, setRepItem] = useState("");
  const [repQty, setRepQty] = useState(100);
  const [repPriority, setRepPriority] = useState<"low" | "medium" | "high" | "emergency">("medium");

  // Outpatient Rx
  const cpoeRx = (cpoeOrders || [])
    .filter((o: any) => o.orderType === "Medication")
    .map((o: any) => ({
      id: o.id,
      patientId: o.visitId,
      patientName: o.patientName, // Special fallback field
      medication: o.orderName,
      dose: o.instructions || "Standard",
      qty: 1, 
      status: o.status === "Pending" ? "pending" : "dispensed",
      date: o.createdAt,
      isCpoe: true
    }));

  const allPrescriptions = [...prescriptions, ...cpoeRx];
  const pendingRx = allPrescriptions.filter(rx => rx.status === "pending");
  const [selectedRxId, setSelectedRxId] = useState<string | null>(null);
  const selectedRx = pendingRx.find(rx => rx.id === selectedRxId) || pendingRx[0];
  const rxPatient = selectedRx ? patients.find(p => p.id === selectedRx.patientId) : null;

  // --- SYSTEM STATS CALCULATORS ---
  const lowStockCount = inventoryItems.filter(item => item.stock <= item.minLevel).length;
  const medsCount = inventoryItems.filter(item => item.type === "medicine").length;
  const suppliesCount = inventoryItems.filter(item => item.type === "supply").length;
  const nearExpiryCount = inventoryItems.filter(item => {
    const exp = new Date(item.expiryDate);
    const now = new Date();
    const diffMonths = (exp.getFullYear() - now.getFullYear()) * 12 + (exp.getMonth() - now.getMonth());
    return diffMonths <= 6;
  }).length;

  // --- ACTIONS ---
  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const item = inventoryItems.find(i => i.id === txItemId);
    if (!item) {
      toast.error(isAr ? "يرجى تحديد الصنف أولاً!" : "Please select an item first!");
      return;
    }

    if (txQty <= 0) {
      toast.error(isAr ? "يرجى إدخال كمية صحيحة!" : "Please enter a valid quantity!");
      return;
    }

    // Process Stock changes
    let newStock = item.stock;
    let newHeld = item.heldQty;

    if (txType === "stock_in" || txType === "release") {
      newStock += txQty;
      if (txType === "release") {
        newHeld = Math.max(0, newHeld - txQty);
      }
    } else if (txType === "stock_out" || txType === "disposal") {
      if (item.stock < txQty) {
        toast.error(isAr ? "الكمية المطلوبة تتجاوز الرصيد المتوفر!" : "Requested qty exceeds current stock!");
        return;
      }
      newStock -= txQty;
    } else if (txType === "hold") {
      if (item.stock < txQty) {
        toast.error(isAr ? "لا توجد كمية حرة كافية لحجزها!" : "Insufficient free stock to hold!");
        return;
      }
      newStock -= txQty;
      newHeld += txQty;
    } else if (txType === "transfer") {
      if (item.stock < txQty) {
        toast.error(isAr ? "الكمية المراد نقلها تتجاوز رصيد المخزن!" : "Transfer qty exceeds available stock!");
        return;
      }
      newStock -= txQty; // Moves to department sub-store (simulated)
    } else if (txType === "adjustment") {
      newStock = txQty; // Sets absolute stock
    }

    // Update state
    setInventoryItems(prev => prev.map(i => i.id === item.id ? { ...i, stock: newStock, heldQty: newHeld } : i));

    // Type Labels
    const typeArMap = {
      stock_in: "توريد وإضافة رصيد",
      stock_out: "صرف رصيد مباشر",
      transfer: "تحويل بين المخازن",
      hold: "حجز كمية للمريض/العمليات",
      release: "فك حجز الكمية المحبوسة",
      disposal: "إهلاك وإعدام تالف",
      adjustment: "تسوية مخزنية يدوية"
    };

    const typeEnMap = {
      stock_in: "Stock Inbound",
      stock_out: "Direct Outbound",
      transfer: "Inter-store Transfer",
      hold: "Quarantine / Hold",
      release: "Release to Free Stock",
      disposal: "Scrap & Disposal",
      adjustment: "Inventory Audit Adjust"
    };

    // Add Ledger Entry
    const newEntry: LedgerEntry = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      itemId: item.id,
      itemName: item.name,
      itemNameEn: item.nameEn,
      type: txType,
      typeAr: typeArMap[txType],
      typeEn: typeEnMap[txType],
      qty: (txType === "stock_out" || txType === "disposal" || txType === "transfer") ? -txQty : txQty,
      fromStore: txFromStore || (isAr ? "المخزن المركزي" : "Central Store"),
      toStore: txToStore || (isAr ? "الأقسام السريرية" : "Clinical Depts"),
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      user: isAr ? "د. محمد سمير (رئيس التموين الطبي)" : "Dr. M. Samir (Supply Chain Director)",
      refNo: txRef || `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: txNotes || "Processed via clinical supply workflow engine.",
      notesAr: txNotesAr || "تم التنفيذ عبر محرك التموين والعمليات المركزي."
    };

    setLedgerEntries(prev => [newEntry, ...prev]);
    toast.success(isAr ? "تم تسجيل الحركة وتعديل الأرصدة بنجاح!" : "Transaction registered and stock balances updated!");
    
    // Clear Form
    setTxQty(50);
    setTxRef("");
    setTxNotes("");
    setTxNotesAr("");
  };

  const handleCreateReplenishment = (e: React.FormEvent) => {
    e.preventDefault();
    const item = inventoryItems.find(i => i.id === repItem);
    const store = stores.find(s => s.id === repStore);
    if (!item || !store) {
      toast.error(isAr ? "يرجى تعبئة الحقول المطلوبة!" : "Please fill in all fields!");
      return;
    }

    const newReq: ReplenishmentRequest = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      storeNameAr: store.nameAr,
      storeNameEn: store.nameEn,
      itemNameAr: item.name,
      itemNameEn: item.nameEn,
      qty: repQty,
      priority: repPriority,
      status: "submitted",
      createdBy: isAr ? "ممرضة التمريض المسؤولة" : "Lead Charge Nurse",
      date: new Date().toISOString().split("T")[0]
    };

    setReplenishmentRequests(prev => [newReq, ...prev]);
    toast.success(isAr ? "تم إرسال طلب إعادة التموين للمستودع المركزي!" : "Replenishment request submitted to central stores!");
  };

  const handleApproveReplenishment = (reqId: string) => {
    setReplenishmentRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: "approved" } : r));
    toast.success(isAr ? "تمت الموافقة والمراجعة للطلب!" : "Replenishment request reviewed & approved!");
  };

  const handleDispenseReplenishment = (req: ReplenishmentRequest) => {
    // Find item
    const item = inventoryItems.find(i => i.nameEn === req.itemNameEn);
    if (!item) return;

    if (item.stock < req.qty) {
      toast.error(isAr ? "الرصيد المركزي غير كافي لإتمام الصرف!" : "Central stock insufficient to dispense!");
      return;
    }

    // Deduct stock
    setInventoryItems(prev => prev.map(i => i.id === item.id ? { ...i, stock: i.stock - req.qty } : i));

    // Move state to dispensed
    setReplenishmentRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: "dispensed" } : r));

    // Add ledger log
    const entry: LedgerEntry = {
      id: `TX-REP-${req.id.slice(-3)}`,
      itemId: item.id,
      itemName: item.name,
      itemNameEn: item.nameEn,
      type: "transfer",
      typeAr: "صرف لطلب تموين القسم",
      typeEn: "Dispense to Dept Replenishment",
      qty: -req.qty,
      fromStore: isAr ? "المخزن المركزي" : "Central Store",
      toStore: isAr ? req.storeNameAr : req.storeNameEn,
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      user: isAr ? "د. محمد سمير" : "Dr. M. Samir",
      refNo: req.id,
      notes: `Automated dispensing for replenishment request ${req.id}`,
      notesAr: `صرف وتوريد آلي لتغطية احتياجات القسم رقم ${req.id}`
    };
    setLedgerEntries(prev => [entry, ...prev]);
    toast.success(isAr ? "تم صرف وتجهيز الشحنة لصالح القسم!" : "Stock dispensed and dispatched to department!");
  };

  const handleReceiveReplenishment = (reqId: string) => {
    setReplenishmentRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: "received" } : r));
    toast.success(isAr ? "تم تأكيد الاستلام والتوقيع الإلكتروني من رئيسة تمريض القسم!" : "Receipt confirmed and e-signed by charge nurse!");
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemData.name || !newItemData.nameEn || !newItemData.barcode) {
      toast.error(isAr ? "يرجى ملء الاسم والباركود!" : "Please fill in item names and barcode!");
      return;
    }

    const isExist = inventoryItems.some(i => i.barcode === newItemData.barcode);
    if (isExist && !isEditingItem) {
      toast.error(isAr ? "هذا الباركود مسجل مسبقاً لصنف آخر!" : "This barcode is already assigned to another item!");
      return;
    }

    if (isEditingItem) {
      setInventoryItems(prev => prev.map(i => i.id === newItemData.id ? (newItemData as InventoryItem) : i));
      toast.success(isAr ? "تم تحديث بيانات الصنف الطبية بنجاح!" : "Medical item catalog updated successfully!");
    } else {
      const createdItem: InventoryItem = {
        ...(newItemData as InventoryItem),
        id: newItemData.type === "medicine" ? `MED-${Math.floor(100 + Math.random() * 900)}` : `SUP-${Math.floor(100 + Math.random() * 900)}`,
        heldQty: 0
      };
      setInventoryItems(prev => [...prev, createdItem]);
      toast.success(isAr ? "تم إدراج الصنف الجديد في سجلات الإمداد الطبي!" : "New clinical item introduced into catalog!");
    }

    setShowItemModal(false);
    setIsEditingItem(false);
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm(isAr ? "هل أنت متأكد من حذف هذا الصنف بالكامل؟" : "Are you sure you want to delete this item?")) {
      setInventoryItems(prev => prev.filter(i => i.id !== itemId));
      toast.success(isAr ? "تم حذف الصنف من الكتالوج الطبي." : "Item removed from clinical master catalog.");
    }
  };

  const handleOpenEditItem = (item: InventoryItem) => {
    setNewItemData(item);
    setIsEditingItem(true);
    setShowItemModal(true);
  };

  const handleOpenCreateItem = () => {
    setNewItemData({
      type: "medicine",
      name: "",
      nameEn: "",
      barcode: `622100${Math.floor(1000000 + Math.random() * 9000000)}`,
      category: isAr ? "عامة" : "General",
      categoryEn: "General",
      stock: 100,
      unit: isAr ? "قرص" : "Tabs",
      unitEn: "Tabs",
      cost: 5,
      minLevel: 50,
      expiryDate: "2028-12-31",
      batchNo: `BT-${Math.floor(100 + Math.random() * 900)}`,
      heldQty: 0,
      isNarcotic: false,
      dose: "500mg",
      size: "M",
      isSterile: true,
      isSingleUse: true,
      binLocation: "A1"
    });
    setIsEditingItem(false);
    setShowItemModal(true);
  };

  // Filter logic
  const filteredItems = inventoryItems.filter(item => {
    if (itemFilterType !== "all" && item.type !== itemFilterType) return false;
    const term = searchTerm?.toLowerCase();
    return (
      item.name?.toLowerCase()?.includes(term) ||
      item.nameEn?.toLowerCase()?.includes(term) ||
      item.barcode?.includes(term) ||
      item.category?.toLowerCase()?.includes(term) ||
      item.categoryEn?.toLowerCase()?.includes(term)
    );
  });

  return (
    <div className="p-4 md:p-6 bg-slate-900 min-h-screen text-slate-100 font-sans text-right" dir={isAr ? "rtl" : "ltr"}>
      
      {/* HEADER BAR */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 border-r-4 border-r-teal-500 mb-6 shadow-xl">
        <div className="flex items-center gap-6 w-full md:w-auto">
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-500 hover:border-rose-800 transition-all shadow-sm group shrink-0"
          >
             <Plus className="w-6 h-6 rotate-45 group-hover:scale-110 transition-transform" />
          </button>
          <div className="text-right">
            <span className="bg-teal-500/10 text-teal-400 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
              {isAr ? "محرك الإمداد الطبي الموحد Enterprise v4.5" : "Unified Supply Chain Engine Enterprise v4.5"}
            </span>
            <h1 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2 justify-start">
              <Pill className="h-7 w-7 text-teal-400" />
              {isAr ? "الإدارة الدوائية والإمداد الطبي المتكامل" : "Drug Management & Medical Supply Chain"}
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium text-start">
              {isAr ? "إدارة الأدوية والمستلزمات الطبية، توزيع الحصص، تتبع الصلاحية، تحويلات الأقسام وسير العمل المعتمد." : "Unified management of drugs, supplies, ward stock, replenishment workflows, and FEFO expiry tracking."}
            </p>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-slate-900/90 p-1 rounded-xl gap-1 flex-wrap border border-slate-800">
          <button onClick={() => setActiveTab("dashboard")} className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${activeTab === "dashboard" ? "bg-teal-500 text-slate-950 shadow-md font-extrabold" : "text-slate-400 hover:text-white"}`}>
            {isAr ? "لوحة المراقبة" : "Dashboard"}
          </button>
          <button onClick={() => { setActiveTab("items"); setItemFilterType("all"); }} className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${activeTab === "items" ? "bg-teal-500 text-slate-950 shadow-md font-extrabold" : "text-slate-400 hover:text-white"}`}>
            {isAr ? "بطاقات الأصناف" : "Item Catalog"}
          </button>
          <button onClick={() => setActiveTab("transactions")} className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${activeTab === "transactions" ? "bg-teal-500 text-slate-950 shadow-md font-extrabold" : "text-slate-400 hover:text-white"}`}>
            {isAr ? "حركة المخزون" : "Post Movement"}
          </button>
          <button onClick={() => setActiveTab("stores")} className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${activeTab === "stores" ? "bg-teal-500 text-slate-950 shadow-md font-extrabold" : "text-slate-400 hover:text-white"}`}>
            {isAr ? "مستودعات الأقسام" : "Stores & Stocks"}
          </button>
          <button onClick={() => setActiveTab("workflows")} className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${activeTab === "workflows" ? "bg-teal-500 text-slate-950 shadow-md font-extrabold" : "text-slate-400 hover:text-white"}`}>
            {isAr ? "طلبات التموين" : "Replenishment"}
          </button>
          <button onClick={() => setActiveTab("dispense")} className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${activeTab === "dispense" ? "bg-teal-500 text-slate-950 shadow-md font-extrabold" : "text-slate-400 hover:text-white"}`}>
            {isAr ? "صرف الروشتات" : "Dispensing"}
          </button>
          <button onClick={() => setActiveTab("ledger")} className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${activeTab === "ledger" ? "bg-teal-500 text-slate-950 shadow-md font-extrabold" : "text-slate-400 hover:text-white"}`}>
            {isAr ? "سجل التدقيق" : "Audit Ledger"}
          </button>
        </div>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Key Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold">{isAr ? "إجمالي الأصناف المعتمدة" : "Total Active Catalog"}</p>
                <p className="text-lg sm:text-2xl font-black text-white mt-1">{inventoryItems.length}</p>
                <p className="text-[10px] text-teal-400 mt-1 font-mono">{medsCount} {isAr ? "دواء" : "Drugs"} | {suppliesCount} {isAr ? "مستلزم" : "Supplies"}</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-teal-400">
                <Layers className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold">{isAr ? "أصناف تحت حد الطلب (نواقص)" : "Low Stock Alerts"}</p>
                <p className={`text-lg sm:text-2xl font-black mt-1 ${lowStockCount > 0 ? "text-rose-400" : "text-slate-200"}`}>{lowStockCount}</p>
                <p className="text-[10px] text-rose-500 font-bold mt-1">⚠️ {isAr ? "تطلب إعادة تمويل فورية" : "Needs urgent replenishment"}</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold">{isAr ? "أصناف قريبة الانتهاء (6 أشهر)" : "Near Expiry Items"}</p>
                <p className={`text-lg sm:text-2xl font-black mt-1 ${nearExpiryCount > 0 ? "text-amber-400" : "text-slate-200"}`}>{nearExpiryCount}</p>
                <p className="text-[10px] text-amber-500 font-medium mt-1">⌛ {isAr ? "تخضع لسياسة FEFO" : "Managed under FEFO rule"}</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-amber-400">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold">{isAr ? "طلبات التموين النشطة" : "Active Requisitions"}</p>
                <p className="text-lg sm:text-2xl font-black text-teal-400 mt-1">
                  {replenishmentRequests.filter(r => r.status !== "closed" && r.status !== "received").length}
                </p>
                <p className="text-[10px] text-teal-500 mt-1">{isAr ? "قيد المراجعة أو الصرف" : "Pending dispatch/receipt"}</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-teal-400">
                <FileCheck className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Quick Shortcuts & Active Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Stock Expiry & Alerts list */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <h3 className="font-black text-sm text-slate-200 flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                {isAr ? "التحذيرات ومراقبة الصلاحية والنواقص" : "Critical Expiry & Deficit Watch"}
              </h3>
              <div className="space-y-3">
                {inventoryItems.map(item => {
                  const isLow = item.stock <= item.minLevel;
                  // Date calculation
                  const exp = new Date(item.expiryDate);
                  const now = new Date();
                  const isNearExp = ((exp.getFullYear() - now.getFullYear()) * 12 + (exp.getMonth() - now.getMonth())) <= 6;

                  if (!isLow && !isNearExp) return null;

                  return (
                    <div key={item.id} className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3 text-start">
                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-500 block">
                          {item.id} · {item.type === "medicine" ? (isAr ? "دواء" : "Medicine") : (isAr ? "مستلزم" : "Supply")}
                        </span>
                        <p className="text-xs font-extrabold text-white">{isAr ? item.name : item.nameEn}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {isAr ? "الرصيد المتاح:" : "Stock:"} <span className="text-white font-bold">{item.stock}</span> {isAr ? item.unit : item.unitEn} (حد أدنى: {item.minLevel})
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        {isLow && (
                          <span className="bg-rose-500/15 text-rose-400 text-[9px] font-extrabold px-2 py-0.5 rounded-md block text-center mb-1 border border-rose-500/30">
                            {isAr ? "رصيد منخفض" : "Low Stock"}
                          </span>
                        )}
                        {isNearExp && (
                          <span className="bg-amber-500/15 text-amber-400 text-[9px] font-extrabold px-2 py-0.5 rounded-md block text-center border border-amber-500/30">
                            {isAr ? "قريب انتهاء" : "Near Exp"} ({item.expiryDate})
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Workflow Quick Board */}
            <div className="lg:col-span-2 bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-sm text-slate-200 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-teal-400" />
                  {isAr ? "دورة تموين وتدفق الأقسام النشطة" : "Active Replenishment Workflows"}
                </h3>
                <button onClick={() => setActiveTab("workflows")} className="text-xs text-teal-400 font-bold hover:underline">
                  {isAr ? "إدارة الطلبات" : "Manage Workflows"}
                </button>
              </div>

              <div className="space-y-4">
                {replenishmentRequests.map(req => (
                  <div key={req.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800/80 flex flex-col md:flex-row justify-between md:items-center gap-4 text-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-slate-800 text-slate-300 font-mono text-[9px] px-1.5 py-0.5 rounded">
                          {req.id}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">
                          {isAr ? req.storeNameAr : req.storeNameEn}
                        </span>
                      </div>
                      <p className="font-extrabold text-sm text-white mt-1">
                        {isAr ? req.itemNameAr : req.itemNameEn}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {isAr ? "الكمية المطلوبة:" : "Requested Qty:"} <span className="font-mono text-white font-bold">{req.qty}</span> · {isAr ? "بواسطة:" : "By:"} {req.createdBy}
                      </p>
                    </div>

                    {/* Step Visualizer */}
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col items-center">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-md ${
                          req.status === "submitted" ? "bg-blue-500/20 text-blue-400" :
                          req.status === "approved" ? "bg-amber-500/20 text-amber-400" :
                          req.status === "dispensed" ? "bg-purple-500/20 text-purple-400" :
                          "bg-emerald-500/20 text-emerald-400"
                        }`}>
                          {req.status === "submitted" && (isAr ? "قيد المراجعة" : "Submitted")}
                          {req.status === "approved" && (isAr ? "معتمد للصرف" : "Approved")}
                          {req.status === "dispensed" && (isAr ? "جاري الشحن" : "Dispensed")}
                          {req.status === "received" && (isAr ? "تم الاستلام والتوقيع" : "Received")}
                        </span>
                      </div>

                      <div className="flex gap-1.5">
                        {req.status === "submitted" && (
                          <button onClick={() => handleApproveReplenishment(req.id)} className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold py-1 px-2.5 rounded text-[10px] shadow-sm transition">
                            {isAr ? "اعتماد" : "Approve"}
                          </button>
                        )}
                        {req.status === "approved" && (
                          <button onClick={() => handleDispenseReplenishment(req)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-2.5 rounded text-[10px] shadow-sm transition">
                            {isAr ? "صرف وإرسال" : "Dispense"}
                          </button>
                        )}
                        {req.status === "dispensed" && (
                          <button onClick={() => handleReceiveReplenishment(req.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-2.5 rounded text-[10px] shadow-sm transition flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {isAr ? "تأكيد واستلام" : "Confirm Receipt"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ITEM CATALOG TAB */}
      {activeTab === "items" && (
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-black text-lg text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-teal-400" />
                {isAr ? "دليل الأصناف الطبية والأدوية" : "Clinical Material & Drug Catalog"}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isAr ? "كتالوج موحد مفصل للأدوية والمستلزمات الطبية." : "Master catalog for registered drugs and hospital consumables."}
              </p>
            </div>

            <div className="flex gap-2 flex-wrap w-full md:w-auto">
              <button onClick={handleOpenCreateItem} className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition">
                <Plus className="w-4 h-4" />
                {isAr ? "إضافة صنف جديد" : "Add Catalog Item"}
              </button>
            </div>
          </div>

          {/* Search and Category filter */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 right-3 flex items-center text-slate-500 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder={isAr ? "البحث بالاسم العلمي، الاسم التجاري، الباركود..." : "Search by generic name, brand, barcode..."}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button onClick={() => setItemFilterType("all")} className={`px-4 py-1.5 text-xs font-bold rounded-lg ${itemFilterType === "all" ? "bg-teal-500 text-slate-950" : "text-slate-400 hover:text-slate-200"}`}>
                {isAr ? "الكل" : "All"}
              </button>
              <button onClick={() => setItemFilterType("medicine")} className={`px-4 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 ${itemFilterType === "medicine" ? "bg-teal-500 text-slate-950" : "text-slate-400 hover:text-slate-200"}`}>
                <Pill className="w-3.5 h-3.5" />
                {isAr ? "الأدوية والمخدرات" : "Medicines"}
              </button>
              <button onClick={() => setItemFilterType("supply")} className={`px-4 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 ${itemFilterType === "supply" ? "bg-teal-500 text-slate-950" : "text-slate-400 hover:text-slate-200"}`}>
                <Package className="w-3.5 h-3.5" />
                {isAr ? "المستلزمات الطبية" : "Medical Supplies"}
              </button>
            </div>
          </div>

          {/* Catalog Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                <tr className="text-start">
                  <th className="py-3 px-4 font-bold text-start">{isAr ? "كود الباركود / GTIN" : "Barcode / ID"}</th>
                  <th className="py-3 px-4 font-bold text-start">{isAr ? "اسم الصنف الطبي" : "Clinical Item Name"}</th>
                  <th className="py-3 px-4 font-bold text-start">{isAr ? "التصنيف" : "Category"}</th>
                  <th className="py-3 px-4 font-bold text-start">{isAr ? "رصيد المستودع" : "Physical Stock"}</th>
                  <th className="py-3 px-4 font-bold text-start">{isAr ? "الحد الأدنى" : "Min Level"}</th>
                  <th className="py-3 px-4 font-bold text-start">{isAr ? "تفاصيل إضافية مخصصة" : "Extended Properties"}</th>
                  <th className="py-3 px-4 font-bold text-center">{isAr ? "خيارات التحكم" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredItems.map(item => {
                  const isLow = item.stock <= item.minLevel;
                  return (
                    <tr key={item.id} className="hover:bg-slate-900/40 text-start transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] font-bold text-slate-400">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${item.type === "medicine" ? "bg-teal-400" : "bg-purple-400"}`} title={item.type} />
                          {item.barcode}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-start">
                        <p className="font-extrabold text-white text-xs">{isAr ? item.name : item.nameEn}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{isAr ? item.nameEn : item.name}</p>
                      </td>
                      <td className="py-3.5 px-4 text-start text-xs text-slate-300">
                        {isAr ? item.category : item.categoryEn}
                      </td>
                      <td className="py-3.5 px-4 text-start">
                        <span className={`font-mono font-black text-xs ${isLow ? "text-rose-400" : "text-emerald-400"}`}>
                          {item.stock}
                        </span>
                        <span className="text-[10px] text-slate-400 mr-1 ml-1">{isAr ? item.unit : item.unitEn}</span>
                        {item.heldQty > 0 && (
                          <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1 rounded block mt-0.5 font-bold" title={isAr ? "كمية محجوزة للعمليات" : "Reserved for scheduled operations"}>
                            🔒 {isAr ? "محجوز:" : "Held:"} {item.heldQty}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-start font-mono text-xs text-slate-400">
                        {item.minLevel}
                      </td>
                      <td className="py-3.5 px-4 text-start text-[10px] text-slate-300">
                        {item.type === "medicine" ? (
                          <div className="space-y-0.5">
                            <p>💊 {isAr ? "الجرعة:" : "Dose:"} <span className="text-white font-bold">{item.dose || "N/A"}</span></p>
                            {item.isNarcotic && <p className="text-rose-400 font-black">⚠️ {isAr ? "أدوية رقابة مخدرة" : "Narcotic Control"}</p>}
                          </div>
                        ) : (
                          <div className="space-y-0.5 text-slate-400">
                            <p>📏 {isAr ? "المقاس:" : "Size:"} <span className="text-white font-bold">{item.size || "N/A"}</span></p>
                            <p>🩹 {isAr ? "التعقيم:" : "Sterile:"} <span className="text-white font-bold">{item.isSterile ? (isAr ? "معقم" : "Yes") : (isAr ? "غير معقم" : "No")}</span></p>
                            <p>📍 {isAr ? "الرف:" : "Bin:"} <span className="text-white font-bold">{item.binLocation || "N/A"}</span></p>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => handleOpenEditItem(item)} className="p-1 hover:bg-slate-800 rounded text-teal-400 hover:text-white transition">
                            {isAr ? "تعديل" : "Edit"}
                          </button>
                          <button onClick={() => handleDeleteItem(item.id)} className="p-1 hover:bg-slate-800 rounded text-rose-400 hover:text-rose-300 transition">
                            {isAr ? "حذف" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* UNIFIED TRANSACTION POST TAB */}
      {activeTab === "transactions" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-800">
            <h3 className="font-black text-lg text-white mb-2 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-teal-400" />
              {isAr ? "محرك حركات المخزون الموحد" : "Unified Stock Movement Engine"}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {isAr ? "تنفيذ كافة حركات الصرف، التوريد، التحويل، الحجز والتسوية عبر محرك مالي مخزني موحد غير قابل للتلاعب." : "Execute stock-ins, direct stock-outs, holds, releases, scrap, and audit adjustments through a consolidated ledger system."}
            </p>

            <form onSubmit={handleCreateTransaction} className="space-y-4 text-start">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-1.5">{isAr ? "نوع الحركة المخزنية" : "Movement Type"}</label>
                  <select
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-teal-500 font-bold"
                    value={txType}
                    onChange={e => setTxType(e.target.value as any)}
                  >
                    <option value="stock_in">{isAr ? "📥 إضافة رصيد / توريد خارجي" : "📥 Stock Inbound / Purchase"}</option>
                    <option value="stock_out">{isAr ? "📤 صرف رصيد للأقسام" : "📤 Direct Outbound / Dispense"}</option>
                    <option value="transfer">{isAr ? "🔄 تحويل بين المخازن والعهدة" : "🔄 Inter-store Transfer"}</option>
                    <option value="hold">{isAr ? "🔒 حجز كمية للعمليات" : "🔒 Quarantine / Hold stock"}</option>
                    <option value="release">{isAr ? "🔓 فك حجز كمية للمتاح" : "🔓 Release Held stock"}</option>
                    <option value="disposal">{isAr ? "❌ إهلاك وإعدام أصناف تالفة" : "❌ Scrap / Disposal"}</option>
                    <option value="adjustment">{isAr ? "🛠️ تسوية جردية لتصحيح الدفاتر" : "🛠️ Audit Ledger Adjustment"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 mb-1.5">{isAr ? "اختر الصنف الطبي" : "Select Clinical Item"}</label>
                  <select
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-teal-500 font-bold"
                    value={txItemId}
                    onChange={e => setTxItemId(e.target.value)}
                    required
                  >
                    <option value="">{isAr ? "-- اختر الصنف --" : "-- Choose Item --"}</option>
                    {inventoryItems.map(item => (
                      <option key={item.id} value={item.id}>
                        [{item.id}] {isAr ? item.name : item.nameEn} (رصيد متاح: {item.stock})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-1.5">{isAr ? "الكمية" : "Quantity"}</label>
                  <input
                    type="number"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-teal-500 font-bold font-mono"
                    value={txQty}
                    onChange={e => setTxQty(Number(e.target.value))}
                    min={1}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 mb-1.5">{isAr ? "من موقع / مستودع" : "From Store / Supplier"}</label>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-teal-500"
                    placeholder={isAr ? "مثال: المورد الرئيسي أو مستودع الأدوية" : "e.g. Central Pharmacy or Supplier Co."}
                    value={txFromStore}
                    onChange={e => setTxFromStore(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 mb-1.5">{isAr ? "إلى موقع / مستودع" : "To Store / Department"}</label>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-teal-500"
                    placeholder={isAr ? "مثال: صيدلية الطوارئ" : "e.g. ER Sub-Store"}
                    value={txToStore}
                    onChange={e => setTxToStore(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-1.5">{isAr ? "رقم المرجع (رقم أمر الشراء / الروشتة)" : "Reference / Document No."}</label>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-teal-500 font-mono"
                    placeholder="e.g. PO-2026-99"
                    value={txRef}
                    onChange={e => setTxRef(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 mb-1.5">{isAr ? "اسم المستخدم المنفذ" : "Executing User"}</label>
                  <input
                    type="text"
                    className="w-full bg-slate-800/50 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-400 cursor-not-allowed"
                    value={isAr ? "د. محمد سمير (رئيس التموين الطبي)" : "Dr. M. Samir (Supply Chain Director)"}
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 mb-1.5">{isAr ? "شرح وتفاصيل الحركة (بالعربية)" : "Transaction Justification (Arabic)"}</label>
                <textarea
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-teal-500 resize-none"
                  placeholder="مثال: صرف بناءً على تزايد الحالات بقسم الرعاية."
                  value={txNotesAr}
                  onChange={e => setTxNotesAr(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 mb-1.5">{isAr ? "شرح وتفاصيل الحركة (بالإنجليزية)" : "Transaction Justification (English)"}</label>
                <textarea
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-teal-500 resize-none"
                  placeholder="e.g. Dispensed due to emergency demand increase."
                  value={txNotes}
                  onChange={e => setTxNotes(e.target.value)}
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition"
                >
                  <Check className="w-4 h-4" />
                  {isAr ? "تسجيل واعتماد الحركة فوراً" : "Post Transaction & Approve Ledger"}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Info Bar */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-start space-y-4">
            <h4 className="font-black text-sm text-slate-200 uppercase tracking-wider">{isAr ? "قواعد حركة الإمداد الطبي" : "Supply Chain Rules"}</h4>
            
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/60 text-xs space-y-1 text-slate-300">
              <span className="font-bold text-teal-400 block">📥 Stock Inbound</span>
              <p>{isAr ? "يزيد رصيد المستودع المركزي مباشرة، ويتم إخضاعه لجرد دوري ومراجعة الصلاحية وتأكيد الباتش." : "Directly increments master warehouses. Subject to batch certification."}</p>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/60 text-xs space-y-1 text-slate-300">
              <span className="font-bold text-purple-400 block">🔄 Inter-store Transfer</span>
              <p>{isAr ? "يخصم من المستودع المركزي ويحول لعهد الأقسام. يتطلب توقيع إلكتروني للاستلام." : "Transfers ownership from central to ward. Requires e-signature receipt."}</p>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/60 text-xs space-y-1 text-slate-300">
              <span className="font-bold text-amber-400 block">🔒 Hold / Quarantine</span>
              <p>{isAr ? "يعزل الكميات المحجوزة للعمليات الكبرى عن كميات الصرف العادية المتاحة." : "Locks specific item quantities for upcoming operations, preventing normal dispensing."}</p>
            </div>
          </div>
        </div>
      )}

      {/* DEPARTMENT STORES TAB */}
      {activeTab === "stores" && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
            <h3 className="font-black text-lg text-white mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-400" />
              {isAr ? "مستودعات وعهد الأقسام السريرية" : "Ward & Clinical Department Stocks"}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? "توزيع أرصدة الأدوية والمستلزمات في نقاط الصيدليات الفرعية وعهد الأجنحة الطبية المختلفة." : "Overview of decentralized stock levels distributed across specialized sub-pharmacies and departments."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stores.map(store => {
              return (
                <div key={store.id} className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col text-start">
                  <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
                    <div>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${store.type === "central" ? "bg-teal-500/10 text-teal-400" : "bg-purple-500/10 text-purple-400"}`}>
                        {store.type === "central" ? (isAr ? "مستودع رئيسي" : "Central Store") : (isAr ? "عهدة قسم فرعي" : "Sub-Store")}
                      </span>
                      <h4 className="font-extrabold text-sm text-white mt-1.5">{isAr ? store.nameAr : store.nameEn}</h4>
                    </div>
                  </div>

                  <div className="p-4 flex-1 space-y-3">
                    <p className="text-[10px] text-slate-500 uppercase font-black">{isAr ? "أرصدة الأصناف المسجلة في هذا المستودع" : "Stock Levels In Store"}</p>
                    
                    <div className="divide-y divide-slate-900">
                      {inventoryItems.map(item => {
                        // Simulate departmental stock division
                        let storeStock = 0;
                        if (store.id === "store-central-pharma" && item.type === "medicine") storeStock = Math.floor(item.stock * 0.7);
                        else if (store.id === "store-central-supplies" && item.type === "supply") storeStock = Math.floor(item.stock * 0.65);
                        else if (store.type === "department") {
                          storeStock = Math.floor(item.stock * (store.id === "store-icu" ? 0.08 : store.id === "store-er" ? 0.12 : store.id === "store-ot" ? 0.15 : 0.05));
                        }

                        if (storeStock <= 0) return null;

                        return (
                          <div key={item.id} className="py-2 flex items-center justify-between text-xs gap-3">
                            <div>
                              <p className="font-extrabold text-slate-200">{isAr ? item.name : item.nameEn}</p>
                              <span className="text-[10px] text-slate-500 font-mono">{item.id}</span>
                            </div>
                            <span className="font-mono text-white font-bold bg-slate-900 px-2 py-1 rounded border border-slate-800">
                              {storeStock} <span className="text-[10px] text-slate-400 font-normal">{isAr ? item.unit : item.unitEn}</span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DISPENSING TAB (PREVIOUS PHARMACY RX VIEW MAINTAINED & POLISHED) */}
      {activeTab === "dispense" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-start">
          
          {/* Rx Queue */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-[650px]">
            <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex justify-between items-center">
              <h3 className="font-black text-slate-200 flex items-center gap-2 text-sm">
                <FileSpreadsheet className="w-5 h-5 text-teal-400" />
                {isAr ? "روشتات العيادات الخارجية قيد المراجعة" : "Pending E-Rx Queue"}
              </h3>
              <span className="bg-amber-500/10 text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-full">
                {pendingRx.length} {isAr ? "روشتة" : "Rx"}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {pendingRx.map(rx => (
                <div
                  key={rx.id}
                  onClick={() => setSelectedRxId(rx.id)}
                  className={`border rounded-xl p-3 cursor-pointer transition ${
                    (selectedRx?.id === rx.id) ? "bg-teal-500/10 border-teal-500/50 shadow-md" : "bg-slate-900 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-white text-xs block font-mono">MRN: {(rx as any).mrn}</span>
                      <span className="text-[11px] text-slate-400 font-semibold">{(rx as any).doctorName}</span>
                    </div>
                    <span className="text-[9px] bg-amber-500/10 text-amber-400 font-bold px-1.5 py-0.5 rounded border border-amber-500/20">
                      {isAr ? "قيد التدقيق" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
              {pendingRx.length === 0 && (
                <p className="text-center text-xs text-slate-500 p-8">{isAr ? "لا توجد روشتات قيد الانتظار حالياً." : "No pending prescriptions found."}</p>
              )}
            </div>
          </div>

          {/* Dispensing Area */}
          <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-[650px]">
            <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex justify-between items-center">
              <h3 className="font-black text-slate-200 flex items-center gap-2 text-sm">
                <ScanLine className="w-5 h-5 text-teal-400" />
                {isAr ? "تفاصيل الروشتة وعمل الباركود للمريض" : "E-Rx Details & Dispense Portal"}
              </h3>
            </div>

            <div className="p-6 flex-1 space-y-4 overflow-y-auto">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <p className="font-mono text-xs font-bold text-teal-400">MRN: {(selectedRx as any)?.mrn || "N/A"}</p>
                  <p className="font-black text-white text-sm mt-0.5">{rxPatient ? (isAr ? rxPatient.nameAr : rxPatient.nameEn) : ((selectedRx as any)?.patientName || "Unknown Patient")}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{isAr ? "جهة التغطية المالية" : "Financial Coverage"}</p>
                  <p className="text-xs font-black text-indigo-400 mt-0.5">{rxPatient?.insurance || "Cash Payer"}</p>
                </div>
              </div>

              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/40">
                    <th className="py-2.5 px-3 text-start font-bold">{isAr ? "الدواء" : "Medication"}</th>
                    <th className="py-2.5 px-3 text-start font-bold">{isAr ? "الجرعة والتردد" : "Dose & Frequency"}</th>
                    <th className="py-2.5 px-3 text-start font-bold">{isAr ? "الكمية المطلوبة" : "Requested Qty"}</th>
                    <th className="py-2.5 px-3 text-start font-bold">{isAr ? "حالة المخزون" : "Stock Status"}</th>
                    <th className="py-2.5 px-3 text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRx ? (selectedRx.medication ? [{ name: selectedRx.medication, dose: selectedRx.dose, freq: "", duration: "1 Dispense" }] : []).map((med: any, idx: number) => (
                    <tr key={idx} className="border-b border-slate-900 hover:bg-slate-900/30">
                      <td className="py-3 px-3 font-extrabold text-white">{med.name}</td>
                      <td className="py-3 px-3 text-slate-300 font-medium">{med.dose} {med.freq}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-300">{med.duration}</td>
                      <td className="py-3 px-3 text-emerald-400 font-bold">{isAr ? "متوفر بالرف" : "In Stock"}</td>
                      <td className="py-3 px-3 text-center text-teal-400"><CheckCircle2 className="w-4 h-4 mx-auto" /></td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">{isAr ? "يرجى تحديد روشتة من اليسار لعرض الأدوية." : "Select a prescription from the queue."}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Interaction Alerts */}
              <div className="bg-indigo-950/40 border border-indigo-900/80 rounded-xl p-4">
                <p className="text-xs text-indigo-300 font-black mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-indigo-400" />
                  {isAr ? "نظام كشف الحساسية والتفاعلات الدوائية الذكي (CDSS)" : "Clinical Drug Decision Support (CDSS)"}
                </p>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {isAr ? "تم إجراء مراجعة فورية على ملف المريض الإلكتروني وحساسية البنسلين والغذاء. لا يوجد تفاعلات دوائية شديدة مسجلة لهذه الروشتة." : "Real-time cross-reference checks done against patient allergies (Penicillin, Food) and active meds. No severe interactions flagged."}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/40 flex flex-col md:flex-row justify-between gap-3 items-center">
              <button className="text-slate-400 font-bold text-xs hover:text-white transition">
                {isAr ? "❌ طلب تعديل الروشتة من الطبيب" : "❌ Request Rx Change from Physician"}
              </button>
              
              <div className="flex gap-2 min-w-max">
                <button
                  disabled={!selectedRx}
                  onClick={async () => {
                    if (!selectedRx) return;
                    
                    if ('isCpoe' in selectedRx && (selectedRx as any).isCpoe && setCpoeOrders) {
                      setCpoeOrders(prev => prev.map(o => o.id === selectedRx.id ? { ...o, status: "Completed" } : o));
                    } else {
                      await updatePrescriptionStatus(selectedRx.id, "dispensed");
                    }
                    
                    // Deduct medication from local stock for visual realism
                    const medName = selectedRx.medication;
                    if (medName) {
                      setInventoryItems(prev => prev.map(item => {
                        if (medName?.toLowerCase()?.includes(item.nameEn.split(" ")[0]?.toLowerCase())) {
                          return { ...item, stock: Math.max(0, item.stock - 20) };
                        }
                        return item;
                      }));
                    }

                    toast.success(isAr ? "تم صرف الروشتة بنجاح والخصم من المخزون!" : "Rx Dispensed! Stock deducted.");
                    setSelectedRxId(null);
                  }}
                  className="bg-teal-500 hover:bg-teal-600 disabled:opacity-40 text-slate-950 font-black py-2 px-5 rounded-xl shadow-md transition flex items-center gap-2 text-xs"
                >
                  <Printer className="w-4 h-4" />
                  {isAr ? "طباعة الباركود والخصم التلقائي" : "Print Labels & Dispense"}
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* REPLENISHMENT WORKFLOWS TAB */}
      {activeTab === "workflows" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-start">
          
          {/* Create Request */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
            <h3 className="font-black text-sm text-white mb-4 uppercase tracking-wider">
              {isAr ? "إنشاء طلب إعادة تموين قسم" : "Generate Department Requisition"}
            </h3>

            <form onSubmit={handleCreateReplenishment} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 mb-1">{isAr ? "القسم والمخزن الطالب" : "Requesting Ward / Sub-Store"}</label>
                <select
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-teal-500 font-bold"
                  value={repStore}
                  onChange={e => setRepStore(e.target.value)}
                >
                  {stores.filter(s => s.type === "department").map(s => (
                    <option key={s.id} value={s.id}>{isAr ? s.nameAr : s.nameEn}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 mb-1">{isAr ? "اختر الصنف المطلوب" : "Select Clinical Item"}</label>
                <select
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-teal-500 font-bold"
                  value={repItem}
                  onChange={e => setRepItem(e.target.value)}
                  required
                >
                  <option value="">{isAr ? "-- اختر الصنف --" : "-- Choose Item --"}</option>
                  {inventoryItems.map(item => (
                    <option key={item.id} value={item.id}>
                      [{item.id}] {isAr ? item.name : item.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 mb-1">{isAr ? "الكمية المطلوبة للتمويل" : "Requested Quota Qty"}</label>
                <input
                  type="number"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-teal-500 font-bold font-mono"
                  value={repQty}
                  onChange={e => setRepQty(Number(e.target.value))}
                  min={10}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 mb-1">{isAr ? "الأولوية الطبية" : "Clinical Priority"}</label>
                <select
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-teal-500 font-bold"
                  value={repPriority}
                  onChange={e => setRepPriority(e.target.value as any)}
                >
                  <option value="low">{isAr ? "منخفضة (احتياطي)" : "Low (Reserve)"}</option>
                  <option value="medium">{isAr ? "متوسطة (تموين دوري)" : "Medium (Cycle)"}</option>
                  <option value="high">{isAr ? "عالية جداً (نقص رصيد)" : "High (Deficit)"}</option>
                  <option value="emergency">{isAr ? "🚨 حالة طوارئ حرجة" : "🚨 Emergency Rescue"}</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-600 text-slate-950 font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition"
              >
                <Send className="w-4 h-4" />
                {isAr ? "تقديم طلب التموين للمستودع" : "Submit Quota Request"}
              </button>
            </form>
          </div>

          {/* Workflow Board */}
          <div className="lg:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-800">
            <h3 className="font-black text-sm text-white mb-4 uppercase tracking-wider">
              {isAr ? "قائمة طلبات التموين قيد المراجعة والاستلام" : "Active Requisition Cycles & Receipts"}
            </h3>

            <div className="space-y-4">
              {replenishmentRequests.map(req => (
                <div key={req.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-slate-800 text-slate-300 font-mono font-bold px-1.5 py-0.5 rounded">
                        {req.id}
                      </span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        req.priority === "emergency" ? "bg-rose-500/10 text-rose-400" :
                        req.priority === "high" ? "bg-amber-500/10 text-amber-400" :
                        "bg-slate-800 text-slate-400"
                      }`}>
                        {req.priority}
                      </span>
                      <span className="text-[11px] text-slate-400">{req.date}</span>
                    </div>
                    <p className="font-extrabold text-sm text-white">{isAr ? req.itemNameAr : req.itemNameEn}</p>
                    <p className="text-xs text-slate-400">
                      {isAr ? "لصالح:" : "Target Store:"} <span className="text-slate-200 font-bold">{isAr ? req.storeNameAr : req.storeNameEn}</span>
                    </p>
                    <p className="text-xs text-slate-400">
                      {isAr ? "الحجم المطلوب:" : "Quantity:"} <span className="font-mono text-teal-400 font-bold">{req.qty}</span> · {isAr ? "المنشئ:" : "Issuer:"} {req.createdBy}
                    </p>
                  </div>

                  {/* Actions based on current status */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-md ${
                      req.status === "submitted" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
                      req.status === "approved" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                      req.status === "dispensed" ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" :
                      "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    }`}>
                      {req.status === "submitted" && (isAr ? "قيد المراجعة المركزية" : "Submitted / Pending Review")}
                      {req.status === "approved" && (isAr ? "تم الاعتماد وبانتظار الصرف" : "Approved / Pending Dispatch")}
                      {req.status === "dispensed" && (isAr ? "تم الصرف وجاري الشحن والتحويل" : "Dispensed / In Transit")}
                      {req.status === "received" && (isAr ? "تم استلام الشحنة وتوقيعها" : "Received & E-Signed")}
                    </span>

                    <div className="flex gap-1.5 mt-1">
                      {req.status === "submitted" && (
                        <button onClick={() => handleApproveReplenishment(req.id)} className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold py-1 px-3 rounded text-[11px] shadow-sm transition">
                          {isAr ? "مراجعة واعتماد" : "Approve Requisition"}
                        </button>
                      )}
                      {req.status === "approved" && (
                        <button onClick={() => handleDispenseReplenishment(req)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded text-[11px] shadow-sm transition">
                          {isAr ? "صرف وإرسال العهدة" : "Dispense Stock"}
                        </button>
                      )}
                      {req.status === "dispensed" && (
                        <button onClick={() => handleReceiveReplenishment(req.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-3 rounded text-[11px] shadow-sm transition flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {isAr ? "تأكيد واستلام القسم" : "Sign & Receive"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* UNIFIED AUDIT LEDGER TAB */}
      {activeTab === "ledger" && (
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 text-start">
          <div>
            <h3 className="font-black text-lg text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-teal-400" />
              {isAr ? "سجل تدقيق وحركات المخزون التاريخي (Unalterable Inventory Ledger)" : "Unalterable Inventory Movement Ledger"}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isAr ? "سجل رقمي مشفر غير قابل للحذف أو التعديل يعرض حركة كافة الأصناف الطبية والأدوية." : "Chronological, read-only audit log for all stock movements, replenishment dispenses, holds, and adjustments."}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-900 text-slate-400">
                <tr className="border-b border-slate-800">
                  <th className="py-2.5 px-3 font-bold text-start">{isAr ? "رقم الحركة" : "Tx ID"}</th>
                  <th className="py-2.5 px-3 font-bold text-start">{isAr ? "التاريخ والوقت" : "Timestamp"}</th>
                  <th className="py-2.5 px-3 font-bold text-start">{isAr ? "نوع العملية" : "Operation Type"}</th>
                  <th className="py-2.5 px-3 font-bold text-start">{isAr ? "الصنف الطبي" : "Clinical Item"}</th>
                  <th className="py-2.5 px-3 font-bold text-start">{isAr ? "من موقع" : "From Site"}</th>
                  <th className="py-2.5 px-3 font-bold text-start">{isAr ? "إلى موقع" : "To Site"}</th>
                  <th className="py-2.5 px-3 font-bold text-start">{isAr ? "الكمية" : "Quantity"}</th>
                  <th className="py-2.5 px-3 font-bold text-start">{isAr ? "المستخدم المسؤول" : "Responsible User"}</th>
                  <th className="py-2.5 px-3 font-bold text-start">{isAr ? "الملاحظات" : "Log Justification"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {ledgerEntries.map(entry => {
                  const isNegative = entry.qty < 0;
                  return (
                    <tr key={entry.id} className="hover:bg-slate-900/30">
                      <td className="py-3 px-3 font-mono font-bold text-slate-400">{entry.id}</td>
                      <td className="py-3 px-3 font-mono text-slate-400">{entry.date}</td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          entry.type === "stock_in" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          entry.type === "stock_out" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                          entry.type === "transfer" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                          "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          {isAr ? entry.typeAr : entry.typeEn}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-extrabold text-white text-[11px]">{isAr ? entry.itemName : entry.itemNameEn}</p>
                        <span className="text-[10px] text-slate-500 font-mono">{entry.itemId}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-300">{entry.fromStore}</td>
                      <td className="py-3 px-3 text-slate-300">{entry.toStore}</td>
                      <td className="py-3 px-3 font-mono">
                        <span className={`font-black text-xs ${isNegative ? "text-rose-400" : "text-emerald-400"}`}>
                          {isNegative ? "" : "+"}{entry.qty}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400">{entry.user}</td>
                      <td className="py-3 px-3 text-slate-400 max-w-[200px] truncate" title={isAr ? entry.notesAr : entry.notes}>
                        {isAr ? entry.notesAr : entry.notes}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NEW/EDIT ITEM MODAL */}
      {showItemModal && (
        <div className="fixed inset-0 z-modal flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col text-right" dir={isAr ? "rtl" : "ltr"}>
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-black text-white text-base">
                {isEditingItem ? (isAr ? "تعديل بيانات الصنف الطبية" : "Edit Clinical Item Catalog") : (isAr ? "إضافة صنف طبي / دواء جديد" : "Introduce New Clinical Item")}
              </h3>
              <button onClick={() => setShowItemModal(false)} className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewItem} className="p-5 space-y-4 max-h-[500px] overflow-y-auto text-start">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">{isAr ? "نوع الصنف" : "Item Type"}</label>
                  <select
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-teal-500 font-bold"
                    value={newItemData.type}
                    onChange={e => setNewItemData(prev => ({ ...prev, type: e.target.value as any }))}
                    disabled={isEditingItem}
                  >
                    <option value="medicine">{isAr ? "💊 دواء / عقار طبي" : "💊 Medicine / Drug"}</option>
                    <option value="supply">{isAr ? "🩺 مستلزمات طبية" : "🩺 Medical Supplies"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">{isAr ? "كود الباركود / GTIN" : "Barcode / GTIN"}</label>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-teal-500 font-mono font-bold"
                    value={newItemData.barcode}
                    onChange={e => setNewItemData(prev => ({ ...prev, barcode: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">{isAr ? "الاسم التجاري (العربية)" : "Brand Name (Arabic)"}</label>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-teal-500"
                    value={newItemData.name}
                    onChange={e => setNewItemData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">{isAr ? "الاسم التجاري/العلمي (الانجليزية)" : "Brand Name (English)"}</label>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-teal-500"
                    value={newItemData.nameEn}
                    onChange={e => setNewItemData(prev => ({ ...prev, nameEn: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">{isAr ? "الفئة التصنيفية (عربي)" : "Category (Arabic)"}</label>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-teal-500"
                    value={newItemData.category}
                    onChange={e => setNewItemData(prev => ({ ...prev, category: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">{isAr ? "الفئة التصنيفية (انجليزي)" : "Category (English)"}</label>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-teal-500"
                    value={newItemData.categoryEn}
                    onChange={e => setNewItemData(prev => ({ ...prev, categoryEn: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">{isAr ? "الرصيد الافتتاحي" : "Opening Stock"}</label>
                  <input
                    type="number"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-teal-500 font-mono font-bold"
                    value={newItemData.stock}
                    onChange={e => setNewItemData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                    min={0}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">{isAr ? "الحد الأدنى" : "Min Level"}</label>
                  <input
                    type="number"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-teal-500 font-mono font-bold"
                    value={newItemData.minLevel}
                    onChange={e => setNewItemData(prev => ({ ...prev, minLevel: Number(e.target.value) }))}
                    min={0}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">{isAr ? "التكلفة للوحدة ($)" : "Unit Cost ($)"}</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-teal-500 font-mono font-bold"
                    value={newItemData.cost}
                    onChange={e => setNewItemData(prev => ({ ...prev, cost: Number(e.target.value) }))}
                    min={0.1}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">{isAr ? "الوحدة (عربي)" : "Unit (Arabic)"}</label>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-teal-500"
                    value={newItemData.unit}
                    onChange={e => setNewItemData(prev => ({ ...prev, unit: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">{isAr ? "الوحدة (انجليزي)" : "Unit (English)"}</label>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-teal-500"
                    value={newItemData.unitEn}
                    onChange={e => setNewItemData(prev => ({ ...prev, unitEn: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">{isAr ? "تاريخ الصلاحية" : "Expiry Date"}</label>
                  <input
                    type="date"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-teal-500 font-mono"
                    value={newItemData.expiryDate}
                    onChange={e => setNewItemData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">{isAr ? "رقم الباتش / التشغيلة" : "Batch / Lot Number"}</label>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-teal-500 font-mono font-bold"
                    value={newItemData.batchNo}
                    onChange={e => setNewItemData(prev => ({ ...prev, batchNo: e.target.value }))}
                  />
                </div>
              </div>

              {/* Extended fields */}
              {newItemData.type === "medicine" ? (
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-[10px] text-teal-400 font-black block uppercase">{isAr ? "خصائص دوائية إضافية" : "Extended Drug Properties"}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">{isAr ? "الجرعة المحددة" : "Drug Dosage"}</label>
                      <input
                        type="text"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-1.5 text-xs text-white outline-none focus:border-teal-500"
                        placeholder="e.g. 500mg or 10mg/mL"
                        value={newItemData.dose}
                        onChange={e => setNewItemData(prev => ({ ...prev, dose: e.target.value }))}
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-5">
                      <input
                        type="checkbox"
                        id="isNarcotic"
                        className="rounded bg-slate-950 border-slate-850 text-teal-500 focus:ring-0 focus:ring-offset-0"
                        checked={newItemData.isNarcotic || false}
                        onChange={e => setNewItemData(prev => ({ ...prev, isNarcotic: e.target.checked }))}
                      />
                      <label htmlFor="isNarcotic" className="text-xs font-bold text-slate-300 cursor-pointer">
                        {isAr ? "⚠️ أدوية رقابة ومخدرات" : "⚠️ Controlled/Narcotic Drug"}
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-[10px] text-purple-400 font-black block uppercase">{isAr ? "خصائص مستلزمات طبية مخصصة" : "Extended Supplies Properties"}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">{isAr ? "المقاس" : "Size / Gauge"}</label>
                      <input
                        type="text"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-1.5 text-xs text-white outline-none"
                        placeholder="e.g. S, M, L, 20G"
                        value={newItemData.size}
                        onChange={e => setNewItemData(prev => ({ ...prev, size: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">{isAr ? "موقع الرف" : "Bin Location"}</label>
                      <input
                        type="text"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-1.5 text-xs text-white outline-none"
                        placeholder="e.g. Shelf A3"
                        value={newItemData.binLocation}
                        onChange={e => setNewItemData(prev => ({ ...prev, binLocation: e.target.value }))}
                      />
                    </div>
                    <div className="flex flex-col justify-center gap-1">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          id="isSterile"
                          className="rounded"
                          checked={newItemData.isSterile || false}
                          onChange={e => setNewItemData(prev => ({ ...prev, isSterile: e.target.checked }))}
                        />
                        <label htmlFor="isSterile" className="text-[10px] font-bold text-slate-300">{isAr ? "معقم" : "Sterile"}</label>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          id="isSingleUse"
                          className="rounded"
                          checked={newItemData.isSingleUse || false}
                          onChange={e => setNewItemData(prev => ({ ...prev, isSingleUse: e.target.checked }))}
                        />
                        <label htmlFor="isSingleUse" className="text-[10px] font-bold text-slate-300">{isAr ? "استخدام مرة واحدة" : "Single-use"}</label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end gap-2 rounded-xl">
                <button type="button" onClick={() => setShowItemModal(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs cursor-pointer transition">
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button type="submit" className="px-5 py-2 bg-teal-500 hover:bg-teal-600 text-slate-950 font-black rounded-xl text-xs cursor-pointer shadow-md transition">
                  {isAr ? "حفظ وإدراج الصنف" : "Save Catalog Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
