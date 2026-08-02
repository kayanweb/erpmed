import React, { useState, useRef, useEffect } from "react";
import { 
  Microscope, TestTube, HardDrive, Printer, CheckCircle2, QrCode, FileText, Clock, 
  Share2, Search, Zap, Check, AlertCircle, Trash2, Plus, Play, Pause, 
  ChevronRight, Eye, ShieldCheck, HelpCircle, Activity, Info, Sliders, 
  Maximize2, Move, Scissors, RefreshCw, Layers, Edit, Filter, FileSpreadsheet, PenLine, X
} from "lucide-react";
import { useHIS } from "../context/HISContext";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
  onClose?: () => void;
}

// Default pre-populated Test Catalog
import { TestCatalogItem, DEFAULT_CATALOG } from "../data/labCatalog";

const DEPARTMENTS = ["Biochemistry", "Hematology", "Microbiology", "Immunology", "Pathology", "Genetics", "Hormones"];
const TUBE_COLORS = ["Purple (EDTA)", "Red (Serum)", "Blue (Citrate)", "Green (Heparin)", "Yellow (Gel)", "Urine Cup", "Stool Cup", "Swab", "Pink", "Grey"];

export default function LISRISDashboard({ language, onClose }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"lis" | "ris">("lis");
  
  // Tab states
  const [labSubTab, setLabSubTab] = useState<"orders" | "results" | "catalog" | "history">("orders");
  const [radSubTab, setRadSubTab] = useState<"worklist" | "pacs_viewer" | "reporting">("worklist");
  
  const { patients, updatePatient, cpoeOrders, setCpoeOrders, getSetting, saveSetting } = useHIS();

  // Lab Cumulative History sub-tab states
  const [historyPatientId, setHistoryPatientId] = useState<string | null>(null);
  const [historySearchTerm, setHistorySearchTerm] = useState("");
  const [expandedLabGroups, setExpandedLabGroups] = useState<Record<string, boolean>>({});
  const [showFullReportModal, setShowFullReportModal] = useState<any | null>(null);

  // Search and selection
  const [labSearchTerm, setLabSearchTerm] = useState("");
  const [radSearchTerm, setRadSearchTerm] = useState("");
  const [selectedLabOrderId, setSelectedLabOrderId] = useState<string | null>(null);
  const [selectedRadOrderId, setSelectedRadOrderId] = useState<string | null>(null);

  // Barcode / Specimen processing states
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [barcodeOrder, setBarcodeOrder] = useState<any>(null);

  // Lab results entry state
  const [labResultsValues, setLabResultsValues] = useState<{ [paramName: string]: string }>({});
  const [labDirectorNote, setLabDirectorNote] = useState("");

  // Test catalog state
  const [catalog, setCatalog] = useState<TestCatalogItem[]>(DEFAULT_CATALOG);

  useEffect(() => {
    getSetting("hospital_test_catalog").then(saved => {
      if (saved) setCatalog(saved);
    });
  }, [getSetting]);

  const [showAddTestModal, setShowAddTestModal] = useState(false);
  const [catalogSearchTerm, setCatalogSearchTerm] = useState("");
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [newTestForm, setNewTestForm] = useState({
    nameAr: "",
    nameEn: "",
    department: "Biochemistry" as any,
    price: 100,
    tat: "2 Hours",
    tubeColor: "Yellow (Gel)" as any,
    parametersText: "Glucose:mg/dL:70:100\nCholesterol:mg/dL:100:200"
  });

  // PACS Viewer controls states
  const [pacsZoom, setPacsZoom] = useState(1);
  const [pacsContrast, setPacsContrast] = useState(100);
  const [pacsBrightness, setPacsBrightness] = useState(100);
  const [pacsInvert, setPacsInvert] = useState(false);
  const [pacsSlice, setPacsSlice] = useState(5);
  const [pacsRulerMode, setPacsRulerMode] = useState(false);
  const [pacsRulerPoints, setPacsRulerPoints] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [pacsIsDrawing, setPacsIsDrawing] = useState(false);
  const [pacsPan, setPacsPan] = useState({ x: 0, y: 0 });
  const [pacsIsDragging, setPacsIsDragging] = useState(false);
  const [pacsDragStart, setPacsDragStart] = useState({ x: 0, y: 0 });
  const pacsViewportRef = useRef<HTMLDivElement>(null);

  // Radiology reporting states
  const [voiceDictating, setVoiceDictating] = useState(false);
  const [radFindings, setRadFindings] = useState("");
  const [radImpression, setRadImpression] = useState("");

  // Save catalog changes
  useEffect(() => {
    if (catalog !== DEFAULT_CATALOG) {
      saveSetting("hospital_test_catalog", catalog);
    }
  }, [catalog, saveSetting]);

  // Aggregate orders from all patients
  const legacyOrders = patients.flatMap(p => 
    (p.orders || []).map((o: any) => ({ 
      ...o, 
      patientId: p.id, 
      patientNameAr: p.nameAr, 
      patientNameEn: p.nameEn, 
      patientName: isAr ? p.nameAr : p.nameEn, 
      patientMrn: p.mrn, 
      patientAge: p.age, 
      patientGender: p.gender 
    }))
  );

  const formattedCpoeOrders = (cpoeOrders || []).map((o: any) => ({
      ...o,
      type: o.orderType === "Lab" ? "LAB" : o.orderType === "Radiology" ? "RAD" : o.orderType,
      name: o.orderName,
      patientName: o.patientName,
      patientMrn: o.mrn,
      patientId: o.visitId,
      status: o.status,
      date: o.createdAt
  }));
  
  const allOrders = [...legacyOrders, ...formattedCpoeOrders];

  const labOrders = allOrders.filter(o => o.type === "LAB");
  const radOrders = allOrders.filter(o => o.type === "RAD");

  // Filtered lists
  const filteredLabOrders = labOrders.filter(order => {
    const q = labSearchTerm?.toLowerCase().trim();
    if (!q) return true;
    return (
      (order.name && order.name?.toLowerCase()?.includes(q)) ||
      (order.patientName && order.patientName?.toLowerCase()?.includes(q)) ||
      (order.patientMrn && order.patientMrn?.toLowerCase()?.includes(q))
    );
  });

  const filteredRadOrders = radOrders.filter(order => {
    const q = radSearchTerm?.toLowerCase().trim();
    if (!q) return true;
    return (
      (order.name && order.name?.toLowerCase()?.includes(q)) ||
      (order.patientName && order.patientName?.toLowerCase()?.includes(q)) ||
      (order.patientMrn && order.patientMrn?.toLowerCase()?.includes(q))
    );
  });

  // Automatically select first lab/rad order if none selected
  useEffect(() => {
    if (filteredLabOrders.length > 0 && !selectedLabOrderId) {
      setSelectedLabOrderId(filteredLabOrders[0].id);
    }
  }, [filteredLabOrders, selectedLabOrderId]);

  useEffect(() => {
    if (filteredRadOrders.length > 0 && !selectedRadOrderId) {
      setSelectedRadOrderId(filteredRadOrders[0].id);
    }
  }, [filteredRadOrders, selectedRadOrderId]);

  // Find currently selected orders
  const selectedLabOrder = labOrders.find(o => o.id === selectedLabOrderId);
  const selectedRadOrder = radOrders.find(o => o.id === selectedRadOrderId);

  // Sync results state when selecting a different lab order
  useEffect(() => {
    if (selectedLabOrder) {
      const initialVals: { [key: string]: string } = {};
      if (selectedLabOrder.result && Array.isArray(selectedLabOrder.result)) {
        selectedLabOrder.result.forEach((r: any) => {
          initialVals[r.name] = r.value.toString();
        });
      } else {
        // Look up test in catalog to populate empty parameters
        const catItem = catalog.find(
          c => c.nameEn?.toLowerCase() === selectedLabOrder.name?.toLowerCase() || 
               c.nameAr === selectedLabOrder.name || 
               selectedLabOrder.name?.toLowerCase()?.includes(c.id)
        );
        if (catItem) {
          catItem.parameters.forEach(p => {
            initialVals[p.name] = "";
          });
        } else {
          // Default generic parameters if not found
          initialVals["Parameter 1"] = "";
          initialVals["Parameter 2"] = "";
        }
      }
      setLabResultsValues(initialVals);
      setLabDirectorNote(selectedLabOrder.notes || "");
    }
  }, [selectedLabOrderId, catalog]);

  // Sync radiology report fields when selection changes
  useEffect(() => {
    if (selectedRadOrder) {
      setRadFindings(selectedRadOrder.findings || "");
      setRadImpression(selectedRadOrder.impression || "");
    }
  }, [selectedRadOrderId]);

  // Status handlers
  const handleUpdateOrderStatus = (patientId: string, orderId: string, newStatus: string, extraData: any = {}) => {
    // Check if it's a CPOE order
    const isCpoeOrder = cpoeOrders?.some(o => o.id === orderId);
    
    if (isCpoeOrder && setCpoeOrders) {
      setCpoeOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, ...extraData } : o));
      toast.success(isAr ? `تم تحديث حالة الطلب إلى: ${newStatus}` : `Order status updated to: ${newStatus}`);
      return;
    }

    // Otherwise update legacy patient orders
    const patient = patients.find(p => p.id === patientId);
    if (!patient || !patient.orders) return;
    
    const updatedOrders = patient.orders.map((o: any) => 
      o.id === orderId ? { ...o, status: newStatus, ...extraData } : o
    );

    updatePatient(patientId, { orders: updatedOrders });
    toast.success(isAr ? `تم تحديث حالة الطلب إلى: ${newStatus}` : `Order status updated to: ${newStatus}`);
  };

  // Save lab results
  const handleSaveLabResult = () => {
    if (!selectedLabOrder) return;

    // Build the results array
    const resultsArray = Object.keys(labResultsValues).map(paramName => {
      const val = parseFloat(labResultsValues[paramName]);
      // Try to find normal range from catalog
      let unit = "";
      let min = 0;
      let max = 100;
      let abnormal = false;

      // Scan catalog
      for (const catItem of catalog) {
        const foundParam = catItem.parameters.find(p => p.name === paramName);
        if (foundParam) {
          unit = foundParam.unit;
          min = foundParam.min;
          max = foundParam.max;
          if (!isNaN(val) && (val < min || val > max)) {
            abnormal = true;
          }
          break;
        }
      }

      return {
        name: paramName,
        value: isNaN(val) ? labResultsValues[paramName] : val,
        unit,
        min,
        max,
        abnormal
      };
    });

    handleUpdateOrderStatus(selectedLabOrder.patientId, selectedLabOrder.id, "Completed", {
      result: resultsArray,
      notes: labDirectorNote,
      completedAt: new Date().toLocaleString()
    });
  };

  // Save radiology report
  const handleSaveRadiologyReport = () => {
    if (!selectedRadOrder) return;
    handleUpdateOrderStatus(selectedRadOrder.patientId, selectedRadOrder.id, "Completed", {
      findings: radFindings,
      impression: radImpression,
      completedAt: new Date().toLocaleString()
    });
    setRadSubTab("worklist");
  };

  // Add customized test to catalog
  const handleAddTestToCatalog = () => {
    if (!newTestForm.nameAr || !newTestForm.nameEn) {
      toast.error(isAr ? "يرجى كتابة اسم الفحص" : "Please specify the test name");
      return;
    }

    // Parse parameters
    const parsedParams = newTestForm.parametersText.split("\n").filter(l => l.trim()).map(line => {
      const parts = line.split(":");
      return {
        name: parts[0] || "Param",
        unit: parts[1] || "",
        min: parseFloat(parts[2]) || 0,
        max: parseFloat(parts[3]) || 100
      };
    });

    if (editingTestId) {
      setCatalog(catalog.map(t => t.id === editingTestId ? {
        ...t,
        nameAr: newTestForm.nameAr,
        nameEn: newTestForm.nameEn,
        department: newTestForm.department,
        price: Number(newTestForm.price) || 50,
        tat: newTestForm.tat || "24 Hours",
        tubeColor: newTestForm.tubeColor,
        parameters: parsedParams
      } : t));
      toast.success(isAr ? "تم تحديث الفحص بنجاح" : "Test updated successfully!");
    } else {
      const newTest: TestCatalogItem = {
        id: "test-" + Date.now(),
        nameAr: newTestForm.nameAr,
        nameEn: newTestForm.nameEn,
        department: newTestForm.department,
        price: Number(newTestForm.price) || 50,
        tat: newTestForm.tat || "24 Hours",
        tubeColor: newTestForm.tubeColor,
        parameters: parsedParams
      };
      setCatalog([...catalog, newTest]);
      toast.success(isAr ? "تمت إضافة الفحص المخبري للكتالوج بنجاح" : "New test added to catalog!");
    }

    setShowAddTestModal(false);
    // Reset form
    setNewTestForm({
      nameAr: "",
      nameEn: "",
      department: "Biochemistry",
      price: 100,
      tat: "2 Hours",
      tubeColor: "Yellow (Gel)",
      parametersText: "Glucose:mg/dL:70:100"
    });
  };

  // Delete test from catalog
  const handleDeleteTestFromCatalog = (id: string) => {
    setCatalog(catalog.filter(c => c.id !== id));
    toast.success(isAr ? "تم حذف الفحص من الكتالوج" : "Test removed from catalog");
  };

  // Auto simulate values for speed of testing
  const handleAutoSimulateValues = (type: "normal" | "critical") => {
    if (!selectedLabOrder) return;
    // Find catalog test
    const catItem = catalog.find(
      c => c.nameEn?.toLowerCase() === selectedLabOrder.name?.toLowerCase() || 
           c.nameAr === selectedLabOrder.name || 
           selectedLabOrder.name?.toLowerCase()?.includes(c.id)
    );
    const updatedVals: { [key: string]: string } = {};
    if (catItem) {
      catItem.parameters.forEach(p => {
        if (type === "normal") {
          // Random value in range
          const val = p.min + Math.random() * (p.max - p.min);
          updatedVals[p.name] = val.toFixed(1);
        } else {
          // Critical/Out of range
          const triggerHigh = Math.random() > 0.5;
          const val = triggerHigh ? p.max * 1.3 : p.min * 0.7;
          updatedVals[p.name] = val.toFixed(1);
        }
      });
      setLabResultsValues(updatedVals);
      setLabDirectorNote(
        type === "normal" 
          ? (isAr ? "النتائج طبيعية ومطابقة للفحص السريري." : "All parameters fall within standard physiological ranges.") 
          : (isAr ? "يرجى ملاحظة ارتفاع أو انخفاض المؤشرات بشكل حرج." : "Critical value alert triggered. Values verified and phoned to ward clinician.")
      );
      toast.success(isAr ? "تم محاكاة عينات التحليل فورياً" : "sample values simulated successfully!");
    }
  };

  // Simulated Voice dictation
  const handleVoiceDictationSimulate = () => {
    if (voiceDictating) return;
    setVoiceDictating(true);
    toast.info(isAr ? "جاري الاستماع للإملاء الصوتي الطبي..." : "Medical Voice Transcribing active...");

    const sampleFindingsAr = "النتائج: يظهر الفحص الصدري تمدداً طبيعياً للرئتين دون وجود لارتشاح رئوي أو تجمع سوائل في الغشاء البلوري. ظل القلب طبيعي في الحجم والموقع. الهيكل العظمي للقفص الصدري سليم ولا توجد كسور واضحة.";
    const sampleFindingsEn = "FINDINGS:\nLungs are clear bilaterally. No focal consolidations, pleural effusions, or pneumothorax. Cardiomediastinal silhouette is normal in size and contour. Bony thorax and soft tissues are unremarkable.";

    const sampleImpressionAr = "الخلاصة: فحص أشعة صدر سليم وطبيعي بالكامل.";
    const sampleImpressionEn = "IMPRESSION:\nNormal chest radiograph.";

    let currentFindings = "";
    let currentImpression = "";
    const targetFindings = isAr ? sampleFindingsAr : sampleFindingsEn;
    const targetImpression = isAr ? sampleImpressionAr : sampleImpressionEn;

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < targetFindings.length) {
        currentFindings += targetFindings[idx];
        setRadFindings(currentFindings);
        idx += 3; // Type 3 chars at a time for speed
      } else {
        clearInterval(interval);
        setRadImpression(targetImpression);
        setVoiceDictating(false);
        toast.success(isAr ? "تم نسخ الإملاء الصوتي بنجاح" : "Voice transcription completed!");
      }
    }, 15);
  };

  // Apply radiology templates
  const applyRadTemplate = (type: string) => {
    if (type === "chest_normal") {
      setRadFindings(
        isAr 
          ? "النتائج:\nالرئتان صافيتان تماماً ولا يوجد أي دليل على التهاب رئوي أو ارتشاح بلوري. ظل القلب طبيعي الحجم ولا تضخم في غشاء التامور. السرتان الرئويتان طبيعيتان. الهيكل العظمي الصدري سليم." 
          : "FINDINGS:\nLungs are clear and well-expanded. No focal airspace consolidation, pleural effusion, or pneumothorax is identified. Cardiomediastinal silhouette, hila, and great vessels are normal. Visualized osseous structures are intact."
      );
      setRadImpression(isAr ? "الخلاصة:\nفحص أشعة صدر طبيعي (لا نتائج سلبية)." : "IMPRESSION:\nNormal chest X-ray.");
    } else if (type === "brain_normal") {
      setRadFindings(
        isAr
          ? "النتائج:\nلا تظهر علامات نزيف حاد، أو جلطة حادة أو ارتشاح دماغي. التمييز بين المادة الرمادية والبيضاء طبيعي ومحفوظ. البطينات الدماغية والفتحات السحائية طبيعية في الحجم والشكل."
          : "FINDINGS:\nThere is no evidence of acute intracranial hemorrhage, mass effect, or large territorial acute infarction. Gray-white matter differentiation is preserved. Ventricles and sulci are normal for age. Skull is intact."
      );
      setRadImpression(isAr ? "الخلاصة:\nأشعة مقطعية طبيعية على الدماغ." : "IMPRESSION:\nUnremarkable CT scan of the brain.");
    } else if (type === "spine_herniated") {
      setRadFindings(
        isAr
          ? "النتائج:\nيظهر انزلاق غضروفي خلفي مركزي خفيف في الفقرة القطنية الخامسة والعجزية الأولى (L5-S1) مسبباً ضيقاً بسيطاً في القناة الشوكية والضغط الخفيف على مخرج العصب الأيسر. الحبل الشوكي والمخروط النخاعي طبيعيان."
          : "FINDINGS:\nL5-S1 shows a central/paracentral posterior disc protrusion/herniation, causing mild indentation of the ventral thecal sac and mild narrowing of the left neural foramen with physical contact on the descending L5 nerve root. Spinal cord signal is normal."
      );
      setRadImpression(
        isAr 
          ? "الخلاصة:\nفتق غضروفي قطني (L5-S1) مع ضغط بسيط على مخرج العصب الأيسر." 
          : "IMPRESSION:\nL5-S1 posterior disc protrusion causing mild left-sided nerve root compression."
      );
    }
  };

  // Helper to determine tube color based on order name
  const getTubeTypeFromOrder = (orderName: string) => {
    const name = orderName?.toLowerCase();
    if (name?.includes("cbc") || name?.includes("صورة") || name?.includes("دم")) return { color: "bg-purple-600 text-white", label: isAr ? "أنبوب بنفسجي (EDTA)" : "Purple Tube (EDTA)" };
    if (name?.includes("lipid") || name?.includes("دهون") || name?.includes("وظائف") || name?.includes("liver") || name?.includes("kidney") || name?.includes("كلى") || name?.includes("كبد")) return { color: "bg-amber-400 text-slate-900", label: isAr ? "أنبوب أصفر (Gel)" : "Yellow Tube (Gel/Serum)" };
    if (name?.includes("sugar") || name?.includes("سكر") || name?.includes("glucose")) return { color: "bg-slate-400 text-slate-900", label: isAr ? "أنبوب رمادي (Fluoride)" : "Gray Tube (Fluoride)" };
    return { color: "bg-red-600 text-white", label: isAr ? "أنبوب أحمر (Serum)" : "Red Tube (Plain Serum)" };
  };

  // PACS Viewer Dragging / Panning handlers
  const handlePacsMouseDown = (e: React.MouseEvent) => {
    if (pacsRulerMode) {
      const rect = pacsViewportRef.current?.getBoundingClientRect();
      if (rect) {
        const x = Math.round(e.clientX - rect.left);
        const y = Math.round(e.clientY - rect.top);
        if (!pacsRulerPoints) {
          setPacsRulerPoints({ x1: x, y1: y, x2: x, y2: y });
          setPacsIsDrawing(true);
        } else {
          setPacsRulerPoints({ ...pacsRulerPoints, x2: x, y2: y });
          setPacsIsDrawing(false);
          setPacsRulerMode(false);
          toast.success(isAr ? "تم تثبيت قياس المسافة بنجاح" : "Distance measurement set!");
        }
      }
    } else {
      setPacsIsDragging(true);
      setPacsDragStart({ x: e.clientX - pacsPan.x, y: e.clientY - pacsPan.y });
    }
  };

  const handlePacsMouseMove = (e: React.MouseEvent) => {
    if (pacsRulerMode && pacsIsDrawing && pacsRulerPoints) {
      const rect = pacsViewportRef.current?.getBoundingClientRect();
      if (rect) {
        const x = Math.round(e.clientX - rect.left);
        const y = Math.round(e.clientY - rect.top);
        setPacsRulerPoints({ ...pacsRulerPoints, x2: x, y2: y });
      }
    } else if (pacsIsDragging) {
      setPacsPan({
        x: e.clientX - pacsDragStart.x,
        y: e.clientY - pacsDragStart.y
      });
    }
  };

  const handlePacsMouseUp = () => {
    if (!pacsRulerMode) {
      setPacsIsDragging(false);
    }
  };

  // Calculate measured distance
  const getMeasuredDistance = () => {
    if (!pacsRulerPoints) return 0;
    const dx = pacsRulerPoints.x2 - pacsRulerPoints.x1;
    const dy = pacsRulerPoints.y2 - pacsRulerPoints.y1;
    // Scale distance pixels to sample mm (e.g. 1 pixel = 0.4 mm)
    const distanceInMm = Math.sqrt(dx * dx + dy * dy) * 0.45;
    return distanceInMm.toFixed(1);
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-100 font-sans text-slate-800" dir={isAr ? "rtl" : "ltr"}>
      
      {/* Top Professional Support Services Title Bar */}
      <div className="bg-white p-4 border-b border-slate-200 shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm group shrink-0"
          >
             <Plus className="w-6 h-6 rotate-45 group-hover:scale-110 transition-transform" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <div className="bg-purple-100 p-1.5 rounded-xl text-purple-700">
                <Microscope className="h-6 w-6" />
              </div>
              <span>{isAr ? "منصة الخدمات الطبية المساعدة والتشخيصية" : "Ancillary & Diagnostic Medical Hub"}</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-bold mt-1">
              {isAr 
                ? "مختبر مجهز بالكامل (LIS) ونظام أرشفة وإدارة صور الأشعة الرقمية (RIS/PACS) متصل بملف المريض الإلكتروني" 
                : "Advanced fully integrated Laboratory (LIS) & Radiology PACS/RIS linked to Central Patient Charts"}
            </p>
          </div>
        </div>

        {/* Support Services Selector */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button 
            onClick={() => { setActiveTab("lis"); }}
            className={`px-4 py-2 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 ${activeTab === "lis" ? "bg-purple-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          >
            <TestTube className="w-3.5 h-3.5" />
            <span>{isAr ? "المختبر الطبي المتكامل (LIS)" : "Clinical Laboratory (LIS)"}</span>
          </button>
          <button 
            onClick={() => { setActiveTab("ris"); }}
            className={`px-4 py-2 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 ${activeTab === "ris" ? "bg-purple-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>{isAr ? "الأشعة الرقمية والـ PACS" : "Radiology & PACS (RIS)"}</span>
          </button>
        </div>
      </div>

      {/* Main Support Area */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        
        {/* ===================== LABORATORY (LIS) TAB ===================== */}
        {activeTab === "lis" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* LIS Sub Tabs */}
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center">
              <div className="flex gap-1.5 min-w-max">
                <button 
                  onClick={() => setLabSubTab("orders")} 
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${labSubTab === "orders" ? "bg-purple-100 text-purple-700 border border-purple-300" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
                >
                  {isAr ? "إدارة عينات المرضى والباركود" : "Sample Registry & Tube Labels"}
                </button>
                <button 
                  onClick={() => setLabSubTab("results")} 
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${labSubTab === "results" ? "bg-purple-100 text-purple-700 border border-purple-300" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
                >
                  {isAr ? "مختبر فحص وإدخال النتائج" : "Analytical Result Entry"}
                </button>
                <button 
                  onClick={() => setLabSubTab("catalog")} 
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${labSubTab === "catalog" ? "bg-purple-100 text-purple-700 border border-purple-300" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
                >
                  {isAr ? "كتالوج التحاليل المرجعي" : "Laboratory Test Catalog"}
                </button>
                <button 
                  onClick={() => setLabSubTab("history")} 
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${labSubTab === "history" ? "bg-purple-100 text-purple-700 border border-purple-300" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
                >
                  {isAr ? "سجل التراكمي للتحاليل" : "Cumulative Lab History"}
                </button>
              </div>
              <div className="text-[10px] bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-mono font-black">
                {isAr ? "سير عينات LIS: نشط" : "LIS WORKFLOW: ACTIVE"}
              </div>
            </div>

            {/* Sub Tab: Sample Registry / Tube Labels */}
            {labSubTab === "orders" && (
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-50">
                {/* Left Side: Order List */}
                <div className="w-full lg:w-96 border-r border-slate-200 bg-white flex flex-col shrink-0">
                  <div className="p-3 border-b border-slate-100 space-y-2">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input 
                        type="text" 
                        placeholder={isAr ? "ابحث برقم الملف أو اسم المريض..." : "Search MRN, Patient, Test..."} 
                        value={labSearchTerm}
                        onChange={(e) => setLabSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-purple-500 font-bold" 
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-50/50">
                    {filteredLabOrders.length > 0 ? (
                      filteredLabOrders.map((order, idx) => {
                        const tube = getTubeTypeFromOrder(order.name);
                        const isSelected = selectedLabOrderId === order.id;
                        return (
                          <div 
                            key={order.id ? `${order.id}-${idx}` : `lab-ord-${idx}`} 
                            onClick={() => setSelectedLabOrderId(order.id)}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none ${isSelected ? "bg-purple-50/60 border-purple-300 shadow-sm" : "bg-white border-slate-200 hover:border-slate-300"}`}
                          >
                            <div className="flex justify-between items-start mb-1.5">
                              <span className="font-extrabold text-slate-900 text-xs leading-snug">{order.name}</span>
                              <span className={`text-[9.5px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                order.status === "Completed" 
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                                  : order.status === "Sample Collected"
                                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                                  : "bg-amber-100 text-amber-800 border border-amber-200"
                              }`}>
                                {isAr 
                                  ? order.status === "Completed" ? "مكتمل" : order.status === "Sample Collected" ? "جمعت العينة" : "مطلوب"
                                  : order.status}
                              </span>
                            </div>
                            <div className="text-xs text-slate-600 font-bold mb-2">{order.patientName}</div>
                            
                            <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold border-t border-slate-100 pt-2">
                              <span>MRN: {order.patientMrn}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${tube.color}`}>
                                {tube.label}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center text-xs text-slate-400 font-bold p-8">
                        {isAr ? "لا توجد طلبات معملية مسجلة حالياً." : "No laboratory orders found."}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Process Order */}
                <div className="flex-1 bg-white p-6 overflow-y-auto flex items-center justify-center">
                  {selectedLabOrder ? (
                    <div className="w-full max-w-2xl bg-slate-50 border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
                      <div className="border-b border-slate-200 pb-4">
                        <div className="flex items-center gap-2 text-purple-700 font-black text-sm mb-1">
                          <TestTube className="w-5 h-5" />
                          <span>{isAr ? "دورة عينة المريض السريرية" : "Clinical Specimen Management Workflow"}</span>
                        </div>
                        <p className="text-[11px] text-slate-500">{isAr ? "التحقق والترميز الرقمي لضمان سلامة بيانات المرضى" : "Ensure positive patient identification and barcoding"}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                        <div className="bg-white border border-slate-150 p-3.5 rounded-xl">
                          <span className="block text-[10px] text-slate-400 uppercase font-black tracking-wider mb-1">{isAr ? "بيانات المريض" : "Patient Information"}</span>
                          <span className="block text-slate-800 text-sm font-black mb-1">{selectedLabOrder.patientName}</span>
                          <span className="block text-slate-500 font-mono text-[11px]">{isAr ? "رقم الملف:" : "MRN:"} {selectedLabOrder.patientMrn}</span>
                          <span className="block text-slate-500 mt-1">{isAr ? "العمر:" : "Age:"} {selectedLabOrder.patientAge} | {isAr ? "الجنس:" : "Gender:"} {selectedLabOrder.patientGender}</span>
                        </div>

                        <div className="bg-white border border-slate-150 p-3.5 rounded-xl">
                          <span className="block text-[10px] text-slate-400 uppercase font-black tracking-wider mb-1">{isAr ? "الفحص المطلوب" : "Ordered Test"}</span>
                          <span className="block text-slate-800 text-sm font-black mb-1">{selectedLabOrder.name}</span>
                          <span className="block text-slate-500 font-mono text-[11px]">{isAr ? "كود الطلب:" : "Order ID:"} {selectedLabOrder.id}</span>
                          <span className="block text-slate-500 mt-1">{isAr ? "تاريخ الطلب:" : "Ordered Date:"} {selectedLabOrder.date}</span>
                        </div>
                      </div>

                      {/* Workflow Steps */}
                      <div className="space-y-4 pt-2">
                        <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">{isAr ? "خطوات التحضير والمختبر" : "Clinical LIS Workflow Steps"}</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          
                          {/* Step 1: Tube & Barcode */}
                          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
                            <div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className="bg-purple-100 text-purple-700 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">1</span>
                                <h5 className="font-extrabold text-xs text-slate-800">{isAr ? "طباعة الترميز الرقمي" : "Barcode Label"}</h5>
                              </div>
                              <p className="text-[10px] text-slate-400">{isAr ? "طباعة تيكت الباركود للملصق الأنبوبي لمنع الأخطاء." : "Print medical label to stamp on tube sample."}</p>
                            </div>
                            <button 
                              onClick={() => {
                                setBarcodeOrder(selectedLabOrder);
                                setShowBarcodeModal(true);
                              }}
                              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 border border-slate-200 cursor-pointer"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>{isAr ? "عرض وطباعة الباركود" : "Generate Barcode"}</span>
                            </button>
                          </div>

                          {/* Step 2: Specimen Collection */}
                          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
                            <div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className="bg-purple-100 text-purple-700 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">2</span>
                                <h5 className="font-extrabold text-xs text-slate-800">{isAr ? "جمع العينات السريرية" : "Collect Sample"}</h5>
                              </div>
                              <p className="text-[10px] text-slate-400">{isAr ? "سحب الدم أو جمع العينة المطلوبة وتسجيلها بالسيستم." : "Verify venipuncture completed and mark collected."}</p>
                            </div>
                            <button 
                              disabled={selectedLabOrder.status !== "Ordered" && selectedLabOrder.status !== "Pending"}
                              onClick={() => handleUpdateOrderStatus(selectedLabOrder.patientId, selectedLabOrder.id, "Sample Collected")}
                              className={`w-full text-white py-1.5 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                                selectedLabOrder.status !== "Ordered" && selectedLabOrder.status !== "Pending"
                                  ? "bg-slate-300 cursor-not-allowed text-slate-500" 
                                  : "bg-blue-600 hover:bg-blue-700 shadow-xs"
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{isAr ? "تم سحب وجمع العينة" : "Mark Collected"}</span>
                            </button>
                          </div>

                          {/* Step 3: Run Analysis */}
                          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
                            <div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className="bg-purple-100 text-purple-700 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">3</span>
                                <h5 className="font-extrabold text-xs text-slate-800">{isAr ? "نقل العينة وإرسال النتائج" : "Analyze & Complete"}</h5>
                              </div>
                              <p className="text-[10px] text-slate-400">{isAr ? "إدخال النتائج الطبية للمحلل المخبري واعتمادها." : "Proceed to key in detailed biochemical findings."}</p>
                            </div>
                            <button 
                              onClick={() => setLabSubTab("results")}
                              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-1.5 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                            >
                              <Sliders className="w-3.5 h-3.5" />
                              <span>{isAr ? "الانتقال لإدخال النتائج" : "Key In Results"}</span>
                            </button>
                          </div>

                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="text-slate-400 font-bold text-xs flex flex-col items-center gap-2">
                      <Microscope className="w-10 h-10 text-slate-300" />
                      <span>{isAr ? "اختر طلباً مخبرياً من القائمة الجانبية لبدء إجرائه" : "Select a lab order from the sidebar to begin"}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sub Tab: Analytical Result Entry */}
            {labSubTab === "results" && (
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-50">
                {/* Left Side: Orders list filtered */}
                <div className="w-full lg:w-96 border-r border-slate-200 bg-white flex flex-col shrink-0">
                  <div className="p-3 border-b border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase block tracking-wider mb-2">{isAr ? "طلبات قيد الفحص والاعتماد" : "Available Lab Orders"}</span>
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input 
                        type="text" 
                        placeholder={isAr ? "ابحث..." : "Search..."} 
                        value={labSearchTerm}
                        onChange={(e) => setLabSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-purple-500 font-bold" 
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-50/50">
                    {filteredLabOrders.map((order, idx) => (
                      <div 
                        key={order.id ? `${order.id}-${idx}` : `lab-res-${idx}`}
                        onClick={() => setSelectedLabOrderId(order.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer select-none ${selectedLabOrderId === order.id ? "bg-purple-50/60 border-purple-300" : "bg-white border-slate-200"}`}
                      >
                        <div className="font-extrabold text-slate-900 text-xs mb-1">{order.name}</div>
                        <div className="text-[11px] text-slate-600 font-bold">{order.patientName}</div>
                        <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                          <span>{order.patientMrn}</span>
                          <span className={`font-bold ${order.status === "Completed" ? "text-emerald-600" : "text-amber-600"}`}>{order.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side: Detailed parameter form */}
                <div className="flex-1 bg-white p-6 overflow-y-auto">
                  {selectedLabOrder ? (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                        <div>
                          <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                            <Sliders className="w-4.5 h-4.5 text-purple-600" />
                            <span>{isAr ? `إدخال نتائج التحليل: ${selectedLabOrder.name}` : `Laboratory Result Entry: ${selectedLabOrder.name}`}</span>
                          </h3>
                          <p className="text-[10px] text-slate-500 mt-0.5">{isAr ? `المريض: ${selectedLabOrder.patientName} | رقم الملف: ${selectedLabOrder.patientMrn}` : `Patient: ${selectedLabOrder.patientName} | MRN: ${selectedLabOrder.patientMrn}`}</p>
                        </div>
                        <div className="flex gap-2 min-w-max">
                          {/* Speed Simulation Buttons */}
                          <button 
                            onClick={() => handleAutoSimulateValues("normal")}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 border border-slate-200 cursor-pointer"
                          >
                            <Zap className="w-3.5 h-3.5 text-amber-500" />
                            <span>{isAr ? "محاكاة نتائج طبيعية" : "Simulate Normal"}</span>
                          </button>
                          <button 
                            onClick={() => handleAutoSimulateValues("critical")}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 border border-rose-200 cursor-pointer"
                          >
                            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>{isAr ? "محاكاة نتائج حرجة" : "Simulate Critical"}</span>
                          </button>
                        </div>
                      </div>

                      {/* Interactive Table of Parameters */}
                      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                        <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-xs font-semibold text-right rtl:text-right ltr:text-left">
                          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                            <tr>
                              <th className="p-3.5 text-start">{isAr ? "المؤشر المخبري" : "Test Parameter"}</th>
                              <th className="p-3.5 text-center w-40">{isAr ? "النتيجة السريرية" : "Result Value"}</th>
                              <th className="p-3.5 text-center w-28">{isAr ? "الوحدة" : "Unit"}</th>
                              <th className="p-3.5 text-center w-36">{isAr ? "المعدل الطبيعي" : "Normal Reference"}</th>
                              <th className="p-3.5 text-center w-28">{isAr ? "مؤشر خطورة" : "Flag"}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono">
                            {Object.keys(labResultsValues).map((paramName) => {
                              const val = parseFloat(labResultsValues[paramName]);
                              let unit = "mL";
                              let min = 0;
                              let max = 100;
                              let isAbnormal = false;

                              // Scan catalog details
                              for (const catItem of catalog) {
                                const foundParam = catItem.parameters.find(p => p.name === paramName);
                                if (foundParam) {
                                  unit = foundParam.unit;
                                  min = foundParam.min;
                                  max = foundParam.max;
                                  if (!isNaN(val) && (val < min || val > max)) {
                                    isAbnormal = true;
                                  }
                                  break;
                                }
                              }

                              return (
                                <tr key={paramName} className={isAbnormal ? "bg-rose-50/40" : "hover:bg-slate-50/50"}>
                                  <td className="p-3.5 text-start font-bold text-slate-800 font-sans">
                                    <div className="flex items-center gap-1.5">
                                      {isAbnormal && <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                                      <span>{paramName}</span>
                                    </div>
                                  </td>
                                  <td className="p-3.5 text-center">
                                    <input 
                                      type="text" 
                                      value={labResultsValues[paramName]}
                                      onChange={(e) => {
                                        setLabResultsValues({
                                          ...labResultsValues,
                                          [paramName]: e.target.value
                                        });
                                      }}
                                      className={`w-28 text-center py-1 rounded-lg font-black outline-none focus:ring-2 focus:ring-purple-500 border ${
                                        isAbnormal 
                                          ? "border-rose-300 bg-rose-100 text-rose-700" 
                                          : "border-slate-200 bg-slate-50 text-slate-800"
                                      }`} 
                                    />
                                  </td>
                                  <td className="p-3.5 text-center font-bold text-slate-400">{unit}</td>
                                  <td className="p-3.5 text-center font-bold text-slate-500">{min} - {max}</td>
                                  <td className="p-3.5 text-center font-bold">
                                    {isAbnormal ? (
                                      <span className="bg-rose-100 text-rose-700 text-[10px] px-2 py-0.5 rounded-full uppercase">
                                        {val < min ? "Low ⬇" : "High ⬆"}
                                      </span>
                                    ) : (
                                      <span className="text-slate-300 font-sans text-[10px] font-bold">—</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
</div>
                      </div>

                      {/* Comments from the Lab pathologist */}
                      <div className="space-y-2">
                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">{isAr ? "ملاحظات وتوقيع طبيب التحاليل" : "Pathologist Remarks"}</label>
                        <textarea 
                          value={labDirectorNote}
                          onChange={(e) => setLabDirectorNote(e.target.value)}
                          placeholder={isAr ? "اكتب هنا أي ملاحظات حول التحليل أو العينات..." : "Enter pathological findings or warnings..."}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 h-20"
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="flex justify-end gap-3 pt-2 border-t border-slate-150">
                        <button 
                          onClick={handleSaveLabResult}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>{isAr ? "اعتماد وإرسال النتائج للملف الإلكتروني" : "Approve & Save Results"}</span>
                        </button>
                      </div>

                    </div>
                  ) : (
                    <div className="text-center text-xs text-slate-400 font-bold p-8">
                      {isAr ? "يرجى اختيار فحص مخبري من الجانب الأيمن لإدخال نتائجه." : "Select an order from the left to begin result entry."}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sub Tab: Reference Laboratory Test Catalog */}
            {labSubTab === "catalog" && (
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 border border-slate-200 rounded-2xl gap-4">
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">{isAr ? "الدليل المرجعي للتحاليل الطبية" : "Standardized Test Catalog Management"}</h3>
                    <p className="text-[10px] text-slate-500">{isAr ? "تعديل المرجع الطبي، الأسعار والمعدلات القياسية للفحوصات" : "Customize standard test values, department routing, and clinical parameters"}</p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input 
                        type="text" 
                        placeholder={isAr ? "ابحث عن فحص طبي..." : "Search tests..."} 
                        value={catalogSearchTerm}
                        onChange={(e) => setCatalogSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-purple-500 font-bold" 
                      />
                    </div>
                    <button 
                      onClick={() => {
                        setEditingTestId(null);
                        setNewTestForm({
                          nameAr: "",
                          nameEn: "",
                          department: "Biochemistry" as any,
                          price: 100,
                          tat: "2 Hours",
                          tubeColor: "Yellow (Gel)" as any,
                          parametersText: "Glucose:mg/dL:70:100\nCholesterol:mg/dL:100:200"
                        });
                        setShowAddTestModal(true);
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1 shadow-sm transition cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAr ? "إضافة فحص" : "Add Test"}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catalog
                    .filter(t => t.nameAr?.includes(catalogSearchTerm) || t.nameEn?.toLowerCase()?.includes(catalogSearchTerm?.toLowerCase()) || t.department?.toLowerCase()?.includes(catalogSearchTerm?.toLowerCase()))
                    .map((test) => (
                    <div key={test.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3 relative overflow-hidden group">
                      {/* Top ribbon colored by tube type */}
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] uppercase font-mono font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                            {test.department}
                          </span>
                          <h4 className="font-extrabold text-slate-900 text-xs mt-1.5">{isAr ? test.nameAr : test.nameEn}</h4>
                        </div>
                        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setEditingTestId(test.id);
                              setNewTestForm({
                                nameAr: test.nameAr,
                                nameEn: test.nameEn,
                                department: test.department as any,
                                price: test.price,
                                tat: test.tat,
                                tubeColor: test.tubeColor as any,
                                parametersText: test.parameters.map(p => `${p.name}:${p.unit}:${p.min}:${p.max}`).join('\n')
                              });
                              setShowAddTestModal(true);
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit test"
                          >
                            <PenLine className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteTestFromCatalog(test.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                            title="Delete test"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-bold text-slate-500 bg-slate-50 p-2 rounded-xl">
                        <div>{isAr ? "السعر:" : "Price:"} <span className="text-slate-800 font-mono">{test.price} SAR</span></div>
                        <div>{isAr ? "زمن الإنجاز:" : "TAT:"} <span className="text-slate-800 font-mono">{test.tat}</span></div>
                        <div className="col-span-2">{isAr ? "أنبوب العينة:" : "Sample Container:"} <span className="text-purple-700">{test.tubeColor}</span></div>
                      </div>

                      {/* Parameters sublist */}
                      <div className="space-y-1.5 border-t border-slate-100 pt-2.5">
                        <span className="block text-[9px] font-black uppercase text-slate-400 tracking-wider">{isAr ? "المؤشرات الطبية للتحليل" : "Covered Parameters"}</span>
                        {test.parameters.map((p, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-slate-700">{p.name}</span>
                            <span className="font-mono text-slate-400">{p.min}-{p.max} {p.unit}</span>
                          </div>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub Tab: Cumulative Lab Results History & Archiving */}
            {labSubTab === "history" && (
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-50">
                {/* Left Side: Patient Directory */}
                <div className="w-full lg:w-80 border-r border-slate-200 bg-white flex flex-col shrink-0">
                  <div className="p-3 border-b border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase block tracking-wider mb-2">
                      {isAr ? "دليل سجلات المرضى بالمعمل" : "Lab Patient Registry"}
                    </span>
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input 
                        type="text" 
                        placeholder={isAr ? "بحث بالاسم أو رقم الملف..." : "Search name or MRN..."} 
                        value={historySearchTerm}
                        onChange={(e) => setHistorySearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-purple-500 font-bold" 
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-slate-50/50 custom-scrollbar">
                    {patients.filter(p => {
                      const term = historySearchTerm.toLowerCase();
                      return p.nameAr.toLowerCase().includes(term) || p.nameEn.toLowerCase().includes(term) || p.mrn.includes(term);
                    }).map((p) => {
                      const allLabOrders = (p.orders || []).filter((o: any) => o.type === "lab");
                      const completedCount = allLabOrders.filter((o: any) => o.status === "Completed").length;
                      
                      return (
                        <div 
                          key={p.id}
                          onClick={() => {
                            setHistoryPatientId(p.id);
                            setExpandedLabGroups({});
                          }}
                          className={`p-3 rounded-xl border transition-all cursor-pointer select-none ${historyPatientId === p.id ? "bg-purple-50 border-purple-300" : "bg-white border-slate-200 hover:border-slate-300"}`}
                        >
                          <div className="font-extrabold text-slate-900 text-xs mb-1">{isAr ? p.nameAr : p.nameEn}</div>
                          <div className="text-[10px] text-slate-500 flex justify-between items-center">
                            <span>{p.mrn} • {p.age} {isAr ? "سنة" : "yo"}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${completedCount > 0 ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
                              {completedCount} {isAr ? "مكتمل" : "Done"}
                            </span>
                          </div>
                        </div>
                      );
                    }).slice(0, 100)}
                  </div>
                </div>

                {/* Right Side: Cumulative History Dashboard */}
                <div className="flex-1 bg-slate-100/50 p-6 overflow-y-auto custom-scrollbar">
                  {(() => {
                    const selectedPatient = patients.find(p => p.id === historyPatientId);
                    if (!selectedPatient) {
                      return (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-slate-200 shadow-xs">
                          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                            <Microscope className="w-5 h-5 sm:w-8 sm:h-8" />
                          </div>
                          <h3 className="font-black text-slate-800 text-sm">{isAr ? "يرجى تحديد مريض لعرض سجل التحاليل" : "Please Select a Patient to View Lab History"}</h3>
                          <p className="text-xs text-slate-400 mt-1 max-w-sm">
                            {isAr ? "اختر مريضاً من القائمة الجانبية لاسترجاع سجلاته المخبرية التاريخية والنتائج التراكمية ومقارنتها عبر الزمن." : "Select any patient from the left panel to retrieve complete, cumulative lab diagnostics and chronological records."}
                          </p>
                        </div>
                      );
                    }

                    const patientLabOrders = (selectedPatient.orders || []).filter((o: any) => o.type === "lab");
                    
                    // Group by test name
                    const grouped: Record<string, any[]> = {};
                    patientLabOrders.forEach((order: any) => {
                      const name = order.name;
                      if (!grouped[name]) grouped[name] = [];
                      grouped[name].push(order);
                    });

                    const testNames = Object.keys(grouped);

                    return (
                      <div className="space-y-6 animate-fade-in text-right">
                        {/* Patient Clinical Info Card */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-right">
                          <div className="text-right w-full">
                            <div className="flex items-center gap-2 justify-start">
                              <span className="w-2.5 h-2.5 bg-purple-500 rounded-full shrink-0" />
                              <h4 
                                className="font-black text-slate-900 text-base hover:text-indigo-600 cursor-pointer transition"
                                onClick={() => window.dispatchEvent(new CustomEvent("openPatientChart", { detail: { patientId: selectedPatient.mrn || selectedPatient.id, patientName: isAr ? selectedPatient.nameAr : selectedPatient.nameEn, initialTab: "lab" } }))}
                                title={isAr ? "انقر لفتح الملف الطبي الكامل" : "Click to open full medical chart"}
                              >
                                {isAr ? selectedPatient.nameAr : selectedPatient.nameEn}
                              </h4>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-2 font-bold justify-start">
                              <span 
                                className="cursor-pointer hover:text-indigo-600 transition"
                                onClick={() => window.dispatchEvent(new CustomEvent("openPatientChart", { detail: { patientId: selectedPatient.mrn || selectedPatient.id, patientName: isAr ? selectedPatient.nameAr : selectedPatient.nameEn, initialTab: "lab" } }))}
                                title={isAr ? "انقر لفتح الملف الطبي الكامل" : "Click to open full medical chart"}
                              >
                                MRN: <strong className="text-slate-800 font-mono hover:text-indigo-600">{selectedPatient.mrn}</strong>
                              </span>
                              <span>{isAr ? "العمر:" : "Age:"} <strong className="text-slate-800">{selectedPatient.age}</strong></span>
                              <span>{isAr ? "الجنس:" : "Gender:"} <strong className="text-slate-800">{isAr ? (selectedPatient.gender === "male" ? "ذكر" : "أنثى") : selectedPatient.gender}</strong></span>
                              <span>{isAr ? "القسم:" : "Department:"} <strong className="text-indigo-600">{selectedPatient.department || (selectedPatient.status === "nicu" ? "NICU" : "Ward")}</strong></span>
                            </div>
                          </div>

                          <div className="bg-purple-50 px-4 py-2.5 rounded-xl border border-purple-100 text-center shrink-0 w-full md:w-auto">
                            <span className="text-[9px] font-black text-purple-500 uppercase block tracking-wider">{isAr ? "إجمالي الفحوصات الطبية" : "Total Logged Tests"}</span>
                            <span className="text-xl font-black text-purple-700">{patientLabOrders.length}</span>
                          </div>
                        </div>

                        {/* Searchable/Filterable list of grouped tests */}
                        {testNames.length === 0 ? (
                          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                            <span className="text-xs text-slate-400 font-bold">{isAr ? "لا يوجد أي فحوصات مخبرية مسجلة لهذا المريض بعد." : "No laboratory examinations registered for this patient yet."}</span>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <h5 className="text-xs font-black text-slate-500 uppercase tracking-widest text-start">{isAr ? "التحاليل المجمعة والمؤرشفة عبر الزمن" : "Grouped Cumulative Diagnostic Tests"}</h5>
                            
                            {testNames.map((testName) => {
                              const runs = grouped[testName];
                              const sortedRuns = [...runs].sort((a, b) => {
                                const dateA = new Date(a.completedAt || a.date).getTime();
                                const dateB = new Date(b.completedAt || b.date).getTime();
                                return dateB - dateA;
                              });

                              const isExpanded = !!expandedLabGroups[testName];

                              return (
                                <div key={testName} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all">
                                  {/* Group Header Accordion */}
                                  <div 
                                    onClick={() => setExpandedLabGroups(prev => ({ ...prev, [testName]: !prev[testName] }))}
                                    className="p-4 bg-slate-50 hover:bg-slate-100/70 border-b border-slate-200 flex justify-between items-center cursor-pointer select-none"
                                  >
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                      <div className="w-5 h-5 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 shrink-0">
                                        <TestTube className="w-4 h-4" />
                                      </div>
                                      <div className="text-start">
                                        <h6 className="font-extrabold text-slate-800 text-sm">{testName}</h6>
                                        <p className="text-[10px] text-slate-500 mt-0.5">
                                          {isAr ? `تاريخ آخر فحص: ${sortedRuns[0].completedAt || sortedRuns[0].date}` : `Last performed: ${sortedRuns[0].completedAt || sortedRuns[0].date}`}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                      <span className="bg-purple-100 text-purple-700 font-black text-[10px] px-2.5 py-1 rounded-full">
                                        {runs.length} {isAr ? "تحليل / اختبار" : "Runs"}
                                      </span>
                                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                                    </div>
                                  </div>

                                  {/* Group Body: Chronological Runs */}
                                  {isExpanded && (
                                    <div className="p-4 bg-white space-y-6 divide-y divide-slate-150">
                                      {sortedRuns.map((run, runIdx) => (
                                        <div key={run.id || runIdx} className={`${runIdx > 0 ? "pt-6" : ""}`}>
                                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                                            <div className="flex items-center gap-2 flex-wrap text-right">
                                              <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-[10px] font-black">
                                                {isAr ? `الإصدار #${sortedRuns.length - runIdx}` : `Run #${sortedRuns.length - runIdx}`}
                                              </span>
                                              <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                {run.completedAt || run.date}
                                              </span>
                                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">
                                                {isAr ? "المختبر المركزي" : "Central Pathology Lab"}
                                              </span>
                                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${run.status === "Completed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                                                {run.status === "Completed" ? (isAr ? "معتمد ونهائي" : "Approved & Final") : run.status}
                                              </span>
                                            </div>

                                            <div className="flex gap-2 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                                              <button 
                                                onClick={() => setShowFullReportModal({ patient: selectedPatient, run })}
                                                className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-xl text-[10px] font-bold transition cursor-pointer"
                                              >
                                                <Eye className="w-3.5 h-3.5 text-slate-500" />
                                                <span>{isAr ? "مشاهدة التقرير كلياً" : "View Full Report"}</span>
                                              </button>
                                              <button 
                                                onClick={() => {
                                                  setShowFullReportModal({ patient: selectedPatient, run, autoPrint: true });
                                                }}
                                                className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold transition shadow-sm cursor-pointer"
                                              >
                                                <Printer className="w-3.5 h-3.5" />
                                                <span>{isAr ? "طباعة النتيجة" : "Print Result"}</span>
                                              </button>
                                            </div>
                                          </div>

                                          {/* Parameters Table */}
                                          {run.result && run.result.length > 0 ? (
                                            <div className="border border-slate-200 rounded-xl overflow-hidden custom-scrollbar max-h-96 overflow-y-auto">
                                              <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-xs font-semibold text-right rtl:text-right ltr:text-left">
                                                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                                  <tr>
                                                    <th className="p-2.5 text-start">{isAr ? "المؤشر الطبي" : "Parameter"}</th>
                                                    <th className="p-2.5 text-center w-36">{isAr ? "النتيجة" : "Result"}</th>
                                                    <th className="p-2.5 text-center w-24">{isAr ? "الوحدة" : "Unit"}</th>
                                                    <th className="p-2.5 text-center w-36">{isAr ? "المعدل الطبيعي" : "Normal Reference"}</th>
                                                    <th className="p-2.5 text-center w-24">{isAr ? "حالة الانحراف" : "Deviation"}</th>
                                                  </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 font-mono">
                                                  {run.result.map((item: any, itemIdx: number) => (
                                                    <tr key={itemIdx} className={item.abnormal ? "bg-rose-50/30" : "hover:bg-slate-50/30"}>
                                                      <td className="p-2.5 text-start font-sans font-bold text-slate-800 flex items-center gap-1.5">
                                                        {item.abnormal && <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                                                        {item.name}
                                                      </td>
                                                      <td className={`p-2.5 text-center font-black ${item.abnormal ? "text-rose-700 font-extrabold text-sm" : "text-slate-800"}`}>
                                                        {item.value}
                                                      </td>
                                                      <td className="p-2.5 text-center font-bold text-slate-400">{item.unit}</td>
                                                      <td className="p-2.5 text-center text-slate-500">{item.min} - {item.max}</td>
                                                      <td className="p-2.5 text-center font-black">
                                                        {item.abnormal ? (
                                                          <span className="bg-rose-100 text-rose-700 text-[9px] px-2 py-0.5 rounded-full font-bold">
                                                            {parseFloat(item.value) < item.min ? (isAr ? "منخفض ⬇" : "Low ⬇") : (isAr ? "مرتفع ⬆" : "High ⬆")}
                                                          </span>
                                                        ) : (
                                                          <span className="text-slate-300 font-sans text-[10px]">—</span>
                                                        )}
                                                      </td>
                                                    </tr>
                                                  ))}
                                                </tbody>
                                              </table>
</div>
                                            </div>
                                          ) : (
                                            <div className="p-4 bg-slate-50 rounded-xl text-center text-slate-400 text-xs font-bold">
                                              {isAr ? "لا توجد تفاصيل نتائج مسجلة لهذا الفحص." : "No structured result parameter values logged for this test."}
                                            </div>
                                          )}

                                          {/* Pathologist Comments */}
                                          {run.notes && (
                                            <div className="mt-3 bg-purple-50/50 p-3 rounded-xl border border-purple-100 text-xs text-start">
                                              <strong className="text-purple-800 font-bold block mb-1 text-right">{isAr ? "ملاحظات طبيب التحاليل:" : "Pathologist Remarks:"}</strong>
                                              <p className="text-slate-600 font-bold leading-relaxed text-right">{run.notes}</p>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Printable Lab Report Modal Overlay */}
            {showFullReportModal && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-dropdown flex items-center justify-center p-4 overflow-y-auto no-print">
                <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full flex flex-col max-h-[90vh]">
                  {/* Modal Header */}
                  <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-3xl">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <h3 className="font-black text-slate-900 text-sm">
                        {isAr ? "معاينة تقرير التحليل المخبري الرسمي" : "Official Laboratory Report Preview"}
                      </h3>
                    </div>
                    <button 
                      onClick={() => setShowFullReportModal(null)}
                      className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Report Content Scroll Area */}
                  <div className="flex-1 overflow-y-auto p-8 font-sans" id="printable-lab-report-area">
                    {/* Report Header */}
                    <div className="border-b-2 border-slate-800 pb-4 mb-6 flex justify-between items-start">
                      <div className="text-right">
                        <h1 className="text-xl font-black text-slate-900">{isAr ? "مجمع عيادات ومستشفى الشفاء الدولي" : "Al-Shifa International Hospital & Lab"}</h1>
                        <p className="text-[10px] text-slate-500 mt-1">{isAr ? "قسم المختبرات والتحاليل الطبية المركزية" : "Department of Clinical Diagnostics & Central Laboratory"}</p>
                      </div>
                      <div className="text-left">
                        <div className="inline-block bg-slate-100 px-3 py-1 rounded text-[10px] font-mono font-black text-slate-700 tracking-wider">
                          LIS-REP-{showFullReportModal.run.id || "GEN"}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">{showFullReportModal.run.completedAt || showFullReportModal.run.date}</p>
                      </div>
                    </div>

                    {/* Patient and Specimen Grid Details */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs mb-6 font-bold text-slate-700 text-right">
                      <div>
                        <span>{isAr ? "اسم المريض:" : "Patient Name:"}</span> <strong className="text-slate-900">{isAr ? showFullReportModal.patient.nameAr : showFullReportModal.patient.nameEn}</strong>
                      </div>
                      <div>
                        <span>{isAr ? "رقم الملف الطبي:" : "MRN ID:"}</span> <strong className="text-slate-900 font-mono">{showFullReportModal.patient.mrn}</strong>
                      </div>
                      <div>
                        <span>{isAr ? "العمر والجنس:" : "Age / Gender:"}</span> <strong className="text-slate-900">{showFullReportModal.patient.age} / {isAr ? (showFullReportModal.patient.gender === "male" ? "ذكر" : "أنثى") : showFullReportModal.patient.gender}</strong>
                      </div>
                      <div>
                        <span>{isAr ? "تاريخ الإصدار:" : "Report Date:"}</span> <strong className="text-slate-900">{showFullReportModal.run.completedAt || showFullReportModal.run.date}</strong>
                      </div>
                      <div className="col-span-2">
                        <span>{isAr ? "موقع الفحص:" : "Diagnostic Unit:"}</span> <strong className="text-indigo-600">{isAr ? "مختبر الدم والكيمياء الحيوية المركزي" : "Central Biochemistry & Hematology Unit"}</strong>
                      </div>
                    </div>

                    {/* Lab Test Title */}
                    <div className="mb-4">
                      <h2 className="text-lg font-black text-purple-800 text-center uppercase tracking-wider bg-purple-50 py-1.5 rounded-xl border border-purple-100">
                        {showFullReportModal.run.name}
                      </h2>
                    </div>

                    {/* Parameters Table */}
                    <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-xs font-semibold text-right rtl:text-right ltr:text-left border-collapse border-2 border-slate-800 mb-6">
                      <thead>
                        <tr className="bg-slate-100 text-slate-800 border-b-2 border-slate-800">
                          <th className="border border-slate-400 p-3 text-start font-black">{isAr ? "المؤشر الطبي" : "Test Parameter"}</th>
                          <th className="border border-slate-400 p-3 text-center w-32 font-black">{isAr ? "النتيجة" : "Result Value"}</th>
                          <th className="border border-slate-400 p-3 text-center w-24 font-black">{isAr ? "الوحدة" : "Unit"}</th>
                          <th className="border border-slate-400 p-3 text-center w-36 font-black">{isAr ? "المعدل الطبيعي" : "Normal Reference"}</th>
                          <th className="border border-slate-400 p-3 text-center w-24 font-black">{isAr ? "الانحراف" : "Flag"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-400 font-mono font-bold text-slate-800">
                        {showFullReportModal.run.result && showFullReportModal.run.result.map((item: any, idx: number) => (
                          <tr key={idx} className={item.abnormal ? "bg-rose-50" : ""}>
                            <td className="border border-slate-400 p-3 text-start font-sans font-extrabold">{item.name}</td>
                            <td className={`border border-slate-400 p-3 text-center font-black text-sm ${item.abnormal ? "text-rose-700 font-black" : ""}`}>{item.value}</td>
                            <td className="border border-slate-400 p-3 text-center text-slate-500">{item.unit}</td>
                            <td className="border border-slate-400 p-3 text-center text-slate-600">{item.min} - {item.max}</td>
                            <td className="border border-slate-400 p-3 text-center">
                              {item.abnormal ? (
                                <span className="bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase">
                                  {parseFloat(item.value) < item.min ? (isAr ? "منخفض" : "Low") : (isAr ? "مرتفع" : "High")}
                                </span>
                              ) : (
                                <span className="text-slate-300 font-sans text-[10px] font-bold">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
</div>

                    {/* Pathologist Comments */}
                    {showFullReportModal.run.notes && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-300 text-xs mb-8 text-right">
                        <strong className="text-slate-800 font-bold block mb-1">{isAr ? "التعليق والتحليل المخبري السريري للعينات:" : "Pathology Interpretation & Clinical Findings:"}</strong>
                        <p className="text-slate-600 font-semibold leading-relaxed">{showFullReportModal.run.notes}</p>
                      </div>
                    )}

                    {/* Signatures */}
                    <div className="flex justify-between items-end mt-12 pt-6 border-t border-slate-200">
                      <div className="text-center">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">{isAr ? "مشرف الفحص الفني" : "Medical Lab Technologist"}</div>
                        <div className="font-bold text-xs mt-4 text-slate-700">{isAr ? "رشا محمود (سجل #29)" : "Rasha Mahmoud, MT (Lic #29)"}</div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <QrCode className="w-10 h-10 text-slate-400 mb-1" />
                        <span className="text-[8px] text-slate-400 font-mono">{isAr ? "مسح للتحقق" : "Scan to Verify"}</span>
                      </div>

                      <div className="text-center">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">{isAr ? "أخصائي علم الأمراض المعتمد" : "Chief Consultant Pathologist"}</div>
                        <div className="font-bold text-xs mt-4 text-slate-900 border-b border-dashed border-slate-400 pb-1 px-4">{isAr ? "د. محمد كمال" : "Dr. Mohamed Kamal, MD"}</div>
                        <div className="text-[8px] text-emerald-600 font-bold flex items-center gap-0.5 justify-center mt-1">
                          <ShieldCheck className="w-3 h-3" /> {isAr ? "موقع رقمياً" : "Digitally E-signed"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Actions */}
                  <div className="p-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50 rounded-b-3xl">
                    <button 
                      onClick={() => setShowFullReportModal(null)}
                      className="px-5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      {isAr ? "إغلاق" : "Close"}
                    </button>
                    <button 
                      onClick={() => {
                        const printContent = document.getElementById("printable-lab-report-area")?.innerHTML;
                        const win = window.open("", "_blank");
                        if (win) {
                          win.document.write(`
                            <html>
                              <head>
                                <title>${isAr ? "تقرير تحليل مخبري" : "Laboratory Report"}</title>
                                <style>
                                  body { font-family: sans-serif; padding: 40px; direction: ${isAr ? "rtl" : "ltr"}; }
                                  .bg-slate-50 { background-color: #f8fafc; }
                                  .rounded-2xl { border-radius: 1rem; }
                                  .p-4 { padding: 1rem; }
                                  .border { border: 1px solid #e2e8f0; }
                                  .grid { display: grid; }
                                  .grid-cols-1 sm:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                                  .gap-x-6 { column-gap: 1.5rem; }
                                  .gap-y-2 { row-gap: 0.5rem; }
                                  .text-xs { font-size: 0.75rem; }
                                  .text-sm { font-size: 0.875rem; }
                                  .text-lg { font-size: 1.125rem; }
                                  .text-xl { font-size: 1.25rem; }
                                  .font-bold { font-weight: 700; }
                                  .font-black { font-weight: 900; }
                                  .font-extrabold { font-weight: 800; }
                                  .text-purple-800 { color: #5b21b6; }
                                  .bg-purple-50 { background-color: #f5f3ff; }
                                  .border-purple-100 { border-color: #ede9fe; }
                                  .py-1.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
                                  .w-full { width: 100%; }
                                  .border-collapse { border-collapse: collapse; }
                                  .border-2 { border-width: 2px; }
                                  .border-slate-800 { border-color: #1e293b; }
                                  .mb-6 { margin-bottom: 1.5rem; }
                                  .bg-slate-100 { background-color: #f1f5f9; }
                                  .text-slate-800 { color: #1e293b; }
                                  .p-3 { padding: 0.75rem; }
                                  .text-start { text-align: start; }
                                  .text-center { text-align: center; }
                                  .w-32 { width: 8rem; }
                                  .w-24 { width: 6rem; }
                                  .w-36 { width: 9rem; }
                                  .border-slate-400 { border-color: #94a3b8; }
                                  .bg-rose-50 { background-color: #fff1f2; }
                                  .text-rose-700 { color: #be123c; }
                                  .text-slate-500 { color: #64748b; }
                                  .text-slate-600 { color: #475569; }
                                  .flex { display: flex; }
                                  .justify-between { justify-content: space-between; }
                                  .items-end { align-items: flex-end; }
                                  .mt-12 { margin-top: 3rem; }
                                  .pt-6 { padding-top: 1.5rem; }
                                  .border-t { border-top: 1px solid #e2e8f0; }
                                  .text-slate-400 { color: #94a3b8; }
                                  .uppercase { text-transform: uppercase; }
                                  .font-mono { font-family: monospace; }
                                  .mt-4 { margin-top: 1rem; }
                                  .text-slate-700 { color: #334155; }
                                  .border-dashed { border-style: dashed; }
                                  .pb-1 { padding-bottom: 0.25rem; }
                                  .px-4 { padding-left: 1rem; padding-right: 1rem; }
                                  .text-emerald-600 { color: #059669; }
                                  .gap-0.5 { gap: 0.125rem; }
                                  .mt-1 { margin-top: 0.25rem; }
                                </style>
                              </head>
                              <body>
                                ${printContent}
                                <script>
                                  window.onload = function() {
                                    window.print();
                                    window.close();
                                  }
                                </script>
                              </body>
                            </html>
                          `);
                          win.document.close();
                        }
                      }}
                      className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>{isAr ? "طباعة فورية" : "Print Report"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== RADIOLOGY (RIS & PACS) TAB ===================== */}
        {activeTab === "ris" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* RIS Sub Tabs */}
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center">
              <div className="flex gap-1.5">
                <button 
                  onClick={() => setRadSubTab("worklist")} 
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${radSubTab === "worklist" ? "bg-purple-100 text-purple-700 border border-purple-300" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
                >
                  {isAr ? "قائمة العمل والأجهزة (Modality Worklist)" : "Modality Exam Worklist"}
                </button>
                <button 
                  onClick={() => setRadSubTab("pacs_viewer")} 
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${radSubTab === "pacs_viewer" ? "bg-purple-100 text-purple-700 border border-purple-300" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
                >
                  {isAr ? "عارض صور الأشعة الرقمية PACS" : "Diagnostic PACS Web Viewer"}
                </button>
                <button 
                  onClick={() => setRadSubTab("reporting")} 
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${radSubTab === "reporting" ? "bg-purple-100 text-purple-700 border border-purple-300" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
                >
                  {isAr ? "كتابة واعتماد تقرير الأشعة" : "Report & Voice Dictation"}
                </button>
              </div>
              <div className="text-[10px] bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-mono font-black">
                {isAr ? "ربط PACS DICOM: متصل" : "DICOM PACS LINK: CONNECTED"}
              </div>
            </div>

            {/* Sub Tab: Modality Worklist */}
            {radSubTab === "worklist" && (
              <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">{isAr ? "جدولة وفحوصات الأجهزة الطبية" : "Modality Exam Worklist (DICOM MWL)"}</h3>
                    <p className="text-[10px] text-slate-500">{isAr ? "قائمة المرضى المحولين من الأطباء لفحص الأشعة السريري" : "Active radiology orders dispatched from physicians to CT, MRI, X-ray consoles"}</p>
                  </div>
                  
                  {/* Search bar inside worklist */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input 
                      type="text" 
                      placeholder={isAr ? "ابحث باسم المريض أو الفحص..." : "Search MWL..."} 
                      value={radSearchTerm}
                      onChange={(e) => setRadSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-purple-500 font-bold" 
                    />
                  </div>
                </div>

                {/* Exams list table */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-xs font-semibold text-right rtl:text-right ltr:text-left">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="p-3.5 text-start">{isAr ? "توقيت الطلب" : "Time"}</th>
                        <th className="p-3.5 text-start">{isAr ? "المريض ورقم الملف" : "Patient / MRN"}</th>
                        <th className="p-3.5 text-center">{isAr ? "نوع الجهاز" : "Modality"}</th>
                        <th className="p-3.5 text-start">{isAr ? "الفحص المطلوب" : "Exam Procedure"}</th>
                        <th className="p-3.5 text-center">{isAr ? "الحالة" : "Status"}</th>
                        <th className="p-3.5 text-end">{isAr ? "الإجراءات التشخيصية" : "Clinical Actions"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {filteredRadOrders.length > 0 ? (
                        filteredRadOrders.map((order, idx) => {
                          const isSelected = selectedRadOrderId === order.id;
                          return (
                            <tr key={order.id ? `${order.id}-${idx}` : `rad-ord-${idx}`} className={`hover:bg-slate-50/50 ${isSelected ? "bg-purple-50/20" : ""}`}>
                              <td className="p-3.5 text-start font-mono text-slate-500">{order.date}</td>
                              <td className="p-3.5 text-start font-sans">
                                <div className="font-extrabold text-slate-900">{order.patientName}</div>
                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">MRN: {order.patientMrn}</div>
                              </td>
                              <td className="p-3.5 text-center">
                                <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono font-black text-[9px]">
                                  {order.name?.toLowerCase()?.includes("ct") ? "CT" : order.name?.toLowerCase()?.includes("mri") ? "MRI" : "X-RAY"}
                                </span>
                              </td>
                              <td className="p-3.5 text-start font-sans font-bold text-slate-800">
                                {order.name}
                              </td>
                              <td className="p-3.5 text-center">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                  order.status === "Completed" 
                                    ? "bg-emerald-100 text-emerald-800" 
                                    : "bg-amber-100 text-amber-800"
                                }`}>
                                  {isAr 
                                    ? order.status === "Completed" ? "مكتمل" : "قيد الفحص"
                                    : order.status}
                                </span>
                              </td>
                              <td className="p-3.5 text-end font-sans">
                                <div className="flex justify-end gap-2">
                                  <button 
                                    onClick={() => {
                                      setSelectedRadOrderId(order.id);
                                      setRadSubTab("pacs_viewer");
                                    }}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-xs transition flex items-center gap-1 cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>{isAr ? "فتح عارض الـ PACS" : "Open PACS Viewer"}</span>
                                  </button>
                                  {order.status !== "Completed" && (
                                    <button 
                                      onClick={() => handleUpdateOrderStatus(order.patientId, order.id, "Completed")}
                                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer"
                                    >
                                      {isAr ? "إنهاء الفحص بنجاح" : "Acquire & Finish"}
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400 font-bold">
                            {isAr ? "لا توجد طلبات أشعة مسجلة حالياً." : "No radiology orders scheduled on worklist."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
</div>
                </div>
              </div>
            )}

            {/* Sub Tab: Diagnostic PACS Web Viewer */}
            {radSubTab === "pacs_viewer" && (
              <div className="flex-1 flex flex-col xl:flex-row overflow-hidden bg-slate-900 text-white">
                
                {/* PACS Left Tooling Side Control Rail */}
                <div className="w-full xl:w-72 border-r border-slate-800 bg-slate-950 p-4 shrink-0 flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <div className="border-b border-slate-800 pb-3">
                      <span className="text-[10px] uppercase font-mono font-black text-purple-400 tracking-wider block mb-1">{isAr ? "التحكم بالصورة التشخيصية" : "PACS Window Controls"}</span>
                      <h4 className="font-extrabold text-xs">{selectedRadOrder ? selectedRadOrder.name : "DICOM VIEWER"}</h4>
                    </div>

                    {/* Window brightness & contrast */}
                    <div className="space-y-3 text-xs">
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-bold text-slate-400">
                          <span>{isAr ? "مستوى التباين (Contrast)" : "Window Contrast"}</span>
                          <span className="font-mono text-purple-400">{pacsContrast}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="50" 
                          max="250" 
                          value={pacsContrast}
                          onChange={(e) => setPacsContrast(Number(e.target.value))}
                          className="w-full accent-purple-500 cursor-pointer h-1 rounded"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between font-bold text-slate-400">
                          <span>{isAr ? "مستوى السطوع (Brightness)" : "Window Brightness"}</span>
                          <span className="font-mono text-purple-400">{pacsBrightness}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="50" 
                          max="200" 
                          value={pacsBrightness}
                          onChange={(e) => setPacsBrightness(Number(e.target.value))}
                          className="w-full accent-purple-500 cursor-pointer h-1 rounded"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between font-bold text-slate-400">
                          <span>{isAr ? "شريحة المسح (Slice Depth)" : "CT/MRI Slices Depth"}</span>
                          <span className="font-mono text-purple-400">Slice: {pacsSlice}/10</span>
                        </div>
                        <input 
                          type="range" 
                          min="1" 
                          max="10" 
                          value={pacsSlice}
                          onChange={(e) => setPacsSlice(Number(e.target.value))}
                          className="w-full accent-purple-500 cursor-pointer h-1 rounded"
                        />
                      </div>
                    </div>

                    {/* Quick Tools buttons */}
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <span className="block text-[9px] uppercase font-mono text-slate-500 font-bold">{isAr ? "أدوات القياس والتلوين" : "Diagnostic Filters"}</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-black">
                        <button 
                          onClick={() => setPacsInvert(!pacsInvert)}
                          className={`p-2 rounded-lg border transition flex items-center justify-center gap-1 cursor-pointer ${
                            pacsInvert ? "bg-purple-600 border-purple-500" : "bg-slate-900 border-slate-800 hover:bg-slate-850"
                          }`}
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>{isAr ? "عكس الألوان" : "Invert Window"}</span>
                        </button>

                        <button 
                          onClick={() => {
                            setPacsRulerMode(!pacsRulerMode);
                            if (!pacsRulerMode) setPacsRulerPoints(null);
                          }}
                          className={`p-2 rounded-lg border transition flex items-center justify-center gap-1 cursor-pointer ${
                            pacsRulerMode ? "bg-amber-600 border-amber-500" : "bg-slate-900 border-slate-800 hover:bg-slate-850"
                          }`}
                        >
                          <Scissors className="w-3.5 h-3.5" />
                          <span>{isAr ? "مسطرة القياس" : "Ruler Tool"}</span>
                        </button>

                        <button 
                          onClick={() => {
                            setPacsZoom(1);
                            setPacsBrightness(100);
                            setPacsContrast(100);
                            setPacsInvert(false);
                            setPacsRulerPoints(null);
                            setPacsPan({ x: 0, y: 0 });
                          }}
                          className="p-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 transition flex items-center justify-center gap-1 col-span-2 cursor-pointer"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>{isAr ? "إعادة ضبط التكبير والمظهر" : "Reset Window Level"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Patient Card linked */}
                    {selectedRadOrder && (
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[10px] font-bold space-y-1">
                        <span className="block text-slate-400 uppercase tracking-wide">{isAr ? "الملف السريري للمريض" : "EHR DEMOGRAPHICS"}</span>
                        <div className="text-white text-xs font-black">{selectedRadOrder.patientName}</div>
                        <div>MRN: {selectedRadOrder.patientMrn}</div>
                        <div>{isAr ? "العمر:" : "Age:"} {selectedRadOrder.patientAge} | {isAr ? "الجنس:" : "Gender:"} {selectedRadOrder.patientGender}</div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <button 
                      onClick={() => setRadSubTab("reporting")}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{isAr ? "الانتقال لكتابة التقرير الطبي" : "Generate DICOM Report"}</span>
                    </button>
                  </div>
                </div>

                {/* DICOM Main Interactive Viewport Canvas */}
                <div className="flex-1 bg-black flex flex-col relative overflow-hidden select-none">
                  {/* Top Bar inside Viewport */}
                  <div className="absolute top-0 inset-x-0 bg-slate-950/80 p-3 flex justify-between items-center text-[10px] font-mono font-black border-b border-slate-900 z-10">
                    <div>
                      <span>ACCESSION NO: ACC-{selectedRadOrder?.id?.slice(-5) || "0284"}</span>
                    </div>
                    <div className="flex gap-4">
                      <span>ZOOM: {pacsZoom.toFixed(1)}X</span>
                      <span>SLICE: {pacsSlice}/10</span>
                      <span>IMAGE SIZE: 512 x 512</span>
                    </div>
                  </div>

                  {/* Dynamic interactive Anatomical Scan Graphic */}
                  <div 
                    ref={pacsViewportRef}
                    onMouseDown={handlePacsMouseDown}
                    onMouseMove={handlePacsMouseMove}
                    onMouseUp={handlePacsMouseUp}
                    onMouseLeave={handlePacsMouseUp}
                    className="flex-1 flex items-center justify-center cursor-crosshair relative"
                  >
                    
                    {/* The Scan Frame container */}
                    <div 
                      className="w-[380px] h-[380px] transition-transform duration-75 relative flex items-center justify-center overflow-hidden"
                      style={{
                        transform: `scale(${pacsZoom}) translate(${pacsPan.x}px, ${pacsPan.y}px)`,
                        filter: `brightness(${pacsBrightness}%) contrast(${pacsContrast}%) ${pacsInvert ? "invert(100%)" : ""}`
                      }}
                    >
                      
                      {/* Interactive chest X-ray / CT scan renderer via clean Vector SVG */}
                      {selectedRadOrder?.name?.toLowerCase()?.includes("chest") || selectedRadOrder?.name?.toLowerCase()?.includes("صدر") ? (
                        /* CHEST X-RAY SCAN */
                        <svg viewBox="0 0 400 400" className="w-full h-full text-white">
                          <rect width="400" height="400" fill="#050505" />
                          {/* Lungs Black Chambers */}
                          <path d="M120,60 C70,120 60,300 120,320 C140,325 170,280 170,150 C170,80 140,55 120,60 Z" fill="#121212" opacity="0.8" />
                          <path d="M280,60 C330,120 340,300 280,320 C260,325 230,280 230,150 C230,80 260,55 280,60 Z" fill="#121212" opacity="0.8" />
                          
                          {/* Spine Vertebrae row */}
                          <line x1="200" y1="50" x2="200" y2="350" stroke="#f0f0f0" strokeWidth="12" strokeDasharray="14,6" opacity="0.7" />
                          
                          {/* Ribs bones */}
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <g key={i} opacity="0.3">
                              <path d={`M 200,${70 + i*30} Q ${140 - i*5},${80 + i*30} 80,${100 + i*30}`} fill="none" stroke="#f5f5f5" strokeWidth="5" />
                              <path d={`M 200,${70 + i*30} Q ${260 + i*5},${80 + i*30} 320,${100 + i*30}`} fill="none" stroke="#f5f5f5" strokeWidth="5" />
                            </g>
                          ))}
                          
                          {/* Heart silhouette */}
                          <path d="M170,180 Q210,170 230,220 Q240,260 200,280 Q160,260 170,180 Z" fill="#4a4a4a" opacity="0.5" />
                          
                          {/* Clavicles */}
                          <path d="M200,75 Q150,70 90,60" fill="none" stroke="#f5f5f5" strokeWidth="6" opacity="0.8" />
                          <path d="M200,75 Q250,70 310,60" fill="none" stroke="#f5f5f5" strokeWidth="6" opacity="0.8" />
                        </svg>
                      ) : selectedRadOrder?.name?.toLowerCase()?.includes("ct") || selectedRadOrder?.name?.toLowerCase()?.includes("mri") ? (
                        /* CT / MRI BRAIN SCAN SECTION (REACTS TO SLICES SLIDER) */
                        <svg viewBox="0 0 400 400" className="w-full h-full text-white">
                          <rect width="400" height="400" fill="#030303" />
                          {/* Skull Bone outline */}
                          <ellipse cx="200" cy="200" rx="140" ry="160" fill="none" stroke="#efefef" strokeWidth="10" opacity="0.9" />
                          
                          {/* Brain lobes contours */}
                          <path d={`M195,65 C130,80 80,130 80,200 C80,280 130,320 195,335 Z`} fill="#202020" opacity="0.7" />
                          <path d={`M205,65 C270,80 320,130 320,200 C320,280 270,320 205,335 Z`} fill="#202020" opacity="0.7" />
                          
                          {/* Lateral Ventricles (fluid - dark) - changes size with sliceIndex */}
                          <path d={`M180,180 Q160,${150 + pacsSlice*5} 190,${210 + pacsSlice}`} fill="#050505" stroke="#444" strokeWidth="2" />
                          <path d={`M220,180 Q240,${150 + pacsSlice*5} 210,${210 + pacsSlice}`} fill="#050505" stroke="#444" strokeWidth="2" />
                          
                          {/* Simulated lesion (e.g. Hemorrhage or stroke visible on specific slices e.g. slice 6, 7, 8) */}
                          {(pacsSlice >= 6 && pacsSlice <= 8) && (
                            <g opacity="0.85">
                              <circle cx="260" cy="160" r="22" fill="#d1d1d1" />
                              <circle cx="260" cy="160" r="14" fill="#f5f5f5" />
                              <text x="235" y="130" fill="#fff" fontSize="10" className="font-sans font-black">LESION: CT-19</text>
                            </g>
                          )}
                        </svg>
                      ) : (
                        /* SPINE SCAN */
                        <svg viewBox="0 0 400 400" className="w-full h-full text-white">
                          <rect width="400" height="400" fill="#050505" />
                          
                          {/* Stack of Vertebrae */}
                          {[1, 2, 3, 4, 5].map(i => {
                            // Slices can bulge out disk 3 (bulging disk representation)
                            const isBulging = i === 3 && pacsSlice >= 6;
                            return (
                              <g key={i}>
                                {/* Vertebra bone */}
                                <rect x="150" y={40 + i*55} width="100" height="35" rx="5" fill="#cfcfcf" opacity="0.8" />
                                {/* Spinal canal fluid space */}
                                <rect x="258" y={35 + i*55} width="10" height="55" fill="#3a3a3a" opacity="0.4" />
                                {/* Intervertebral Disc */}
                                <rect 
                                  x={isBulging ? "160" : "165"} 
                                  y={75 + i*55} 
                                  width={isBulging ? "110" : "70"} 
                                  height="10" 
                                  rx="3" 
                                  fill={isBulging ? "#ef4444" : "#1e40af"} 
                                  opacity="0.9" 
                                />
                                {isBulging && (
                                  <circle cx="268" cy="80 + i*55" r="4" fill="#ff4d4d" />
                                )}
                              </g>
                            );
                          })}
                        </svg>
                      )}

                    </div>

                    {/* SVG Ruler overlay for distance measurement */}
                    {pacsRulerPoints && (
                      <svg className="absolute inset-0 w-full h-full pointer-events-none z-25">
                        <line 
                          x1={pacsRulerPoints.x1} 
                          y1={pacsRulerPoints.y1} 
                          x2={pacsRulerPoints.x2} 
                          y2={pacsRulerPoints.y2} 
                          stroke="#10b981" 
                          strokeWidth="2.5" 
                          strokeDasharray="4,2" 
                        />
                        <circle cx={pacsRulerPoints.x1} cy={pacsRulerPoints.y1} r="4" fill="#10b981" />
                        <circle cx={pacsRulerPoints.x2} cy={pacsRulerPoints.y2} r="4" fill="#10b981" />
                        <rect 
                          x={Math.min(pacsRulerPoints.x1, pacsRulerPoints.x2) + Math.abs(pacsRulerPoints.x1 - pacsRulerPoints.x2)/2 - 35}
                          y={Math.min(pacsRulerPoints.y1, pacsRulerPoints.y2) + Math.abs(pacsRulerPoints.y1 - pacsRulerPoints.y2)/2 - 12}
                          width="70" 
                          height="20" 
                          rx="4" 
                          fill="#065f46" 
                          stroke="#10b981"
                          strokeWidth="1"
                        />
                        <text 
                          x={Math.min(pacsRulerPoints.x1, pacsRulerPoints.x2) + Math.abs(pacsRulerPoints.x1 - pacsRulerPoints.x2)/2}
                          y={Math.min(pacsRulerPoints.y1, pacsRulerPoints.y2) + Math.abs(pacsRulerPoints.y1 - pacsRulerPoints.y2)/2 + 2}
                          fill="#fff" 
                          fontSize="9.5" 
                          textAnchor="middle" 
                          className="font-mono font-black"
                        >
                          {getMeasuredDistance()} mm
                        </text>
                      </svg>
                    )}

                    {/* Ruler Active Prompt */}
                    {pacsRulerMode && (
                      <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-amber-600/90 border border-amber-500 text-[10px] px-3.5 py-1.5 rounded-full font-bold flex items-center gap-1.5 animate-bounce z-10">
                        <Info size={13} />
                        <span>{isAr ? "انقر واسحب على الصورة لقياس المسافة المحددة بالمليمتر" : "Click & drag on scan viewport to measure anatomy in mm"}</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Zoom / Pan slider controls */}
                  <div className="bg-slate-950 p-3 flex justify-between items-center text-[10px] font-bold border-t border-slate-900 shrink-0 z-10">
                    <div className="flex gap-2.5">
                      <button 
                        onClick={() => setPacsZoom(prev => Math.min(prev + 0.2, 3))}
                        className="bg-slate-900 border border-slate-800 hover:bg-slate-800 px-3 py-1 rounded"
                      >
                        {isAr ? "تكبير +" : "Zoom In +"}
                      </button>
                      <button 
                        onClick={() => setPacsZoom(prev => Math.max(prev - 0.2, 0.6))}
                        className="bg-slate-900 border border-slate-800 hover:bg-slate-800 px-3 py-1 rounded"
                      >
                        {isAr ? "تصغير -" : "Zoom Out -"}
                      </button>
                    </div>

                    <div className="text-slate-400">
                      <span>{isAr ? "وضع العرض: تشخيصي طبي معتمد" : "Diagnostic clinical viewport calibrated"}</span>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* Sub Tab: Radiology Reporting & Dictation */}
            {radSubTab === "reporting" && (
              <div className="flex-1 bg-white p-6 overflow-y-auto space-y-6">
                {selectedRadOrder ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-start border-b border-slate-200 pb-4 flex-wrap gap-4">
                      <div>
                        <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                          <FileText className="w-4.5 h-4.5 text-purple-600" />
                          <span>{isAr ? `تقرير الفحص الإشعاعي: ${selectedRadOrder.name}` : `Radiology Clinical Reporting: ${selectedRadOrder.name}`}</span>
                        </h3>
                        <p className="text-[10px] text-slate-500 mt-0.5">{isAr ? `المريض: ${selectedRadOrder.patientName} | رقم الملف: ${selectedRadOrder.patientMrn}` : `Patient: ${selectedRadOrder.patientName} | MRN: ${selectedRadOrder.patientMrn}`}</p>
                      </div>

                      {/* Diagnostic templates */}
                      <div className="flex gap-1.5 min-w-max">
                        <button 
                          onClick={() => applyRadTemplate("chest_normal")}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer"
                        >
                          {isAr ? "قالب صدر سليم" : "Normal Chest Template"}
                        </button>
                        <button 
                          onClick={() => applyRadTemplate("brain_normal")}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer"
                        >
                          {isAr ? "قالب مقطعية مخ سليمة" : "Normal Brain CT"}
                        </button>
                        <button 
                          onClick={() => applyRadTemplate("spine_herniated")}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer"
                        >
                          {isAr ? "قالب انزلاق غضروفي" : "Spine Herniation Template"}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      {/* Left: Findings and voice transcription */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">{isAr ? "المشاهدات والنتائج الطبية (Findings)" : "Clinical Findings"}</label>
                          <button 
                            onClick={handleVoiceDictationSimulate}
                            disabled={voiceDictating}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition flex items-center gap-1 cursor-pointer ${
                              voiceDictating 
                                ? "bg-rose-100 text-rose-700 animate-pulse" 
                                : "bg-purple-100 hover:bg-purple-200 text-purple-700"
                            }`}
                          >
                            <Zap className="w-3.5 h-3.5" />
                            <span>{isAr ? "إملاء صوتي طبي ذكي" : "Simulate Voice Dictation"}</span>
                          </button>
                        </div>
                        <textarea 
                          value={radFindings}
                          onChange={(e) => setRadFindings(e.target.value)}
                          placeholder={isAr ? "اكتب تفاصيل المشاهدات الطبية والنتائج التفصيلية للفحص..." : "Type detailed anatomical structures, anomalies, structures identified..."}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 h-64 font-serif leading-relaxed"
                        />
                      </div>

                      {/* Right: Diagnosis/Impression & Digital stamp */}
                      <div className="space-y-4 flex flex-col justify-between">
                        <div className="space-y-3">
                          <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">{isAr ? "الخلاصة والتشخيص النهائي (Impression)" : "Clinical Impression"}</label>
                          <textarea 
                            value={radImpression}
                            onChange={(e) => setRadImpression(e.target.value)}
                            placeholder={isAr ? "اكتب الخلاصة التشخيصية والنتيجة الطبية النهائية..." : "State final clinical impression/verdict..."}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 h-36 font-serif leading-relaxed"
                          />
                        </div>

                        {/* Professional Signature box preview */}
                        <div className="bg-slate-50 p-4 border border-slate-250 rounded-2xl flex items-center gap-2 sm:gap-4 flex-wrap ">
                          <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-6 h-6" />
                          </div>
                          <div className="text-xs font-semibold">
                            <span className="block font-black text-slate-800">{isAr ? "التوقيع والاعتماد الإلكتروني" : "Authorized Digital Signature"}</span>
                            <span className="block text-slate-500 mt-1">{isAr ? "سيتم ختم الفحص باسم رئيس قسم الأشعة التشخيصية" : "Will be signed by Diagnostic Radiologist Specialist"}</span>
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                          <button 
                            onClick={handleSaveRadiologyReport}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>{isAr ? "اعتماد وختم تقرير الأشعة وحفظه" : "Save, Sign & Dispatch"}</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ) : (
                  <div className="text-center text-xs text-slate-400 font-bold p-8">
                    {isAr ? "يرجى اختيار فحص إشعاعي لكتابة التقرير الطبي." : "Select a radiology order to write clinical report."}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ===================== MODAL: BARCODE / SPECIMEN LABEL PRINT ===================== */}
      {showBarcodeModal && barcodeOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-modal flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 animate-fade" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-slate-950 text-white p-4 flex items-center justify-between">
              <h3 className="font-extrabold text-xs flex items-center gap-1.5 text-purple-400">
                <QrCode size={16} />
                <span>{isAr ? "ملصق باركود العينة الطبية" : "DICOM Specimen Barcode Label"}</span>
              </h3>
              <button 
                onClick={() => setShowBarcodeModal(false)}
                className="text-slate-400 hover:text-white transition font-black text-xs"
              >
                × Close
              </button>
            </div>

            {/* Simulated Printed Barcode Card */}
            <div className="p-6 bg-slate-50 flex flex-col items-center justify-center">
              <div className="bg-white border-2 border-dashed border-slate-300 p-4 rounded-2xl w-full text-center space-y-4 shadow-2xs font-mono">
                <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? "مستشفى الرعاية السحابية" : "CLOUD CARE GENERAL HOSPITAL"}</span>
                
                {/* Visual Barcode bars */}
                <div className="flex flex-col items-center space-y-1 py-2 select-none">
                  <div className="flex space-x-0.5 justify-center">
                    {[3,1,4,2,1,4,2,3,1,1,4,2,1,3,2,1,4,3,1,1,2,4,3,1,2,3,4,1,2].map((w, i) => (
                      <div key={i} className="bg-black" style={{ width: `${w}px`, height: "42px" }} />
                    ))}
                  </div>
                  <span className="text-[10px] font-black tracking-widest text-slate-800">
                    *LIS-{barcodeOrder.id?.slice(-8).toUpperCase() || "SAMPLE"}*
                  </span>
                </div>

                <div className="text-left rtl:text-right text-[10px] font-semibold text-slate-700 space-y-1 pt-1.5 border-t border-slate-100">
                  <div>{isAr ? "المريض:" : "PATIENT:"} <span className="font-bold text-slate-900">{barcodeOrder.patientName}</span></div>
                  <div className="flex justify-between">
                    <span>MRN: <span className="font-bold text-slate-900">{barcodeOrder.patientMrn}</span></span>
                    <span>{isAr ? "الجنس:" : "GENDER:"} <span className="font-bold text-slate-900">{barcodeOrder.patientGender?.toUpperCase()}</span></span>
                  </div>
                  <div>{isAr ? "الفحص:" : "ORDERED TEST:"} <span className="font-bold text-purple-700">{barcodeOrder.name}</span></div>
                  <div className="flex justify-between text-[8px] text-slate-400">
                    <span>DATE: {barcodeOrder.date}</span>
                    <span>SPECIMEN: {getTubeTypeFromOrder(barcodeOrder.name).label}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Print Confirmation */}
            <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-2">
              <button 
                onClick={() => {
                  toast.success(isAr ? "تم إرسال أمر الطباعة لملصقات المختبر" : "Printed successfully to local LIS printer");
                  setShowBarcodeModal(false);
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm transition cursor-pointer"
              >
                <Printer size={14} />
                <span>{isAr ? "أمر طباعة الملصق الآن" : "Send to Print Server"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: ADD/EDIT CUSTOM TEST TO CATALOG ===================== */}
      {showAddTestModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-modal flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-fade text-right rtl:text-right ltr:text-left" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-slate-950 text-white p-4 flex items-center justify-between">
              <h3 className="font-extrabold text-xs flex items-center gap-1.5 text-purple-400">
                {editingTestId ? <PenLine size={16} /> : <Plus size={16} />}
                <span>{editingTestId ? (isAr ? "تعديل فحص مخبري" : "Edit Lab Test") : (isAr ? "إضافة فحص مخبري جديد للدليل" : "Add New Test to LIS Catalog")}</span>
              </h3>
              <button 
                onClick={() => setShowAddTestModal(false)}
                className="text-slate-400 hover:text-white transition font-black text-xs"
              >
                × Cancel
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500 uppercase tracking-wider block">{isAr ? "الاسم بالعربية" : "Name (Arabic)"}</label>
                  <input 
                    type="text" 
                    value={newTestForm.nameAr}
                    onChange={(e) => setNewTestForm({ ...newTestForm, nameAr: e.target.value })}
                    placeholder="مثال: تحليل سكر تراكمي"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 uppercase tracking-wider block">{isAr ? "الاسم بالإنجليزية" : "Name (English)"}</label>
                  <input 
                    type="text" 
                    value={newTestForm.nameEn}
                    onChange={(e) => setNewTestForm({ ...newTestForm, nameEn: e.target.value })}
                    placeholder="Example: HbA1c"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500 uppercase tracking-wider block">{isAr ? "القسم المسؤول" : "Department Routing"}</label>
                  <select 
                    value={newTestForm.department}
                    onChange={(e) => setNewTestForm({ ...newTestForm, department: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 font-bold text-slate-800"
                  >
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Hematology">Hematology</option>
                    <option value="Immunology">Immunology</option>
                    <option value="Microbiology">Microbiology</option>
                    <option value="Hormones">Hormones</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 uppercase tracking-wider block">{isAr ? "أنبوب العينة" : "Tube / Specimen Container"}</label>
                  <select 
                    value={newTestForm.tubeColor}
                    onChange={(e) => setNewTestForm({ ...newTestForm, tubeColor: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 font-bold text-slate-800"
                  >
                    <option value="Purple (EDTA)">Purple (EDTA)</option>
                    <option value="Yellow (Gel)">Yellow (Gel/Serum)</option>
                    <option value="Red (Serum)">Red (Plain Serum)</option>
                    <option value="Blue (Citrate)">Blue (Citrate)</option>
                    <option value="Urine Cup">Urine Container</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500 uppercase tracking-wider block">{isAr ? "السعر (ريال)" : "Price (SAR)"}</label>
                  <input 
                    type="number" 
                    value={newTestForm.price}
                    onChange={(e) => setNewTestForm({ ...newTestForm, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 font-bold text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 uppercase tracking-wider block">{isAr ? "مدة تسليم النتيجة" : "Turnaround Time (TAT)"}</label>
                  <input 
                    type="text" 
                    value={newTestForm.tat}
                    onChange={(e) => setNewTestForm({ ...newTestForm, tat: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 uppercase tracking-wider block">
                  {isAr 
                    ? "المؤشرات المشمولة بالتحليل (الاسم:الوحدة:الحد الأدنى:الحد الأقصى)" 
                    : "Covered Parameters (Format Name:Unit:Min:Max - one per line)"}
                </label>
                <textarea 
                  value={newTestForm.parametersText}
                  onChange={(e) => setNewTestForm({ ...newTestForm, parametersText: e.target.value })}
                  rows={3}
                  placeholder="Glucose:mg/dL:70:100"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 font-bold text-slate-800 font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5">
              <button 
                onClick={() => setShowAddTestModal(false)}
                className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-150 transition cursor-pointer"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button 
                onClick={handleAddTestToCatalog}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
              >
                {editingTestId ? (isAr ? "حفظ التعديلات" : "Save Changes") : (isAr ? "حفظ الفحص الجديد" : "Add Test to Catalog")}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
