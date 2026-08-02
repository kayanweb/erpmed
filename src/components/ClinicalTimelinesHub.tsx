import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
  Heart,
  Droplet,
  Volume2,
  VolumeX,
  FileSpreadsheet,
  Zap,
  Flame,
  Gauge,
  Sliders,
  Search,
  Filter,
  Check,
  Send,
  User,
  PlusCircle,
  Stethoscope,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface Props {
  language: "en" | "ar";
}

interface TimelineEvent {
  id: string;
  time: string;
  stepNameEn: string;
  stepNameAr: string;
  deptEn: string;
  deptAr: string;
  durationMins: number;
  targetMins: number;
  status: "on-time" | "delayed" | "critical";
  responsibleEn: string;
  responsibleAr: string;
}

interface MedicationSchedule {
  id: string;
  nameEn: string;
  nameAr: string;
  route: string;
  frequency: string;
  times: string[]; // e.g. ["06:00", "14:00", "22:00"]
  history: { time: string; status: "Given" | "Missed" | "Pending"; staffName: string }[];
}

interface CodeLog {
  elapsedTime: string;
  actionEn: string;
  actionAr: string;
  timestamp: string;
}

// Preset catalog of orderable drugs, lab exams, and diagnostic scans
interface CatalogItem {
  id: string;
  type: "medication" | "lab" | "radiology";
  nameEn: string;
  nameAr: string;
  categoryEn: string;
  categoryAr: string;
  defaultRoute?: string;
  defaultFrequency?: string;
  defaultTargetMins?: number;
}

const ORDERABLE_CATALOG: CatalogItem[] = [
  // Medications
  { id: "cat-m1", type: "medication", nameEn: "Meropenem 1g IV", nameAr: "ميروبينيم 1 جرام وريدي", categoryEn: "Antibiotic", categoryAr: "مضاد حيوي", defaultRoute: "IV Infusion", defaultFrequency: "Q8H (Every 8 Hours)" },
  { id: "cat-m2", type: "medication", nameEn: "Ceftriaxone 1g IV", nameAr: "سيفترياكسون 1 جرام وريدي", categoryEn: "Antibiotic", categoryAr: "مضاد حيوي", defaultRoute: "IV Bolus", defaultFrequency: "Q12H" },
  { id: "cat-m3", type: "medication", nameEn: "Enoxaparin 40mg SC", nameAr: "إينوكسابارين 40 ملغ تحت الجلد", categoryEn: "Anticoagulant", categoryAr: "مضاد تجلط", defaultRoute: "Subcutaneous", defaultFrequency: "QD (Once Daily)" },
  { id: "cat-m4", type: "medication", nameEn: "Furosemide 20mg IV", nameAr: "فوروسيميد 20 ملغ وريدي", categoryEn: "Diuretic", categoryAr: "مدر للبول", defaultRoute: "IV Bolus", defaultFrequency: "BID" },
  { id: "cat-m5", type: "medication", nameEn: "Heparin Sodium 5000 IU", nameAr: "هيبارين صوديوم 5000 وحدة", categoryEn: "Anticoagulant", categoryAr: "مضاد تجلط", defaultRoute: "IV Infusion", defaultFrequency: "Continuous" },
  { id: "cat-m6", type: "medication", nameEn: "Paracetamol 1g IV Infusion", nameAr: "باراسيتامول 1 جرام وريدي محاليل", categoryEn: "Analgesic", categoryAr: "مسكن وخافض حرارة", defaultRoute: "IV Infusion", defaultFrequency: "Q6H PRN" },
  { id: "cat-m7", type: "medication", nameEn: "Epinephrine 1mg IV", nameAr: "أدرينالين 1 ملغ وريدي", categoryEn: "Emergency Cardiotonic", categoryAr: "منشط عضلة القلب طارئ", defaultRoute: "IV Push", defaultFrequency: "STAT" },
  { id: "cat-m8", type: "medication", nameEn: "Amiodarone 150mg IV", nameAr: "أميودارون 150 ملغ وريدي", categoryEn: "Antiarrhythmic", categoryAr: "منظم ضربات القلب", defaultRoute: "IV Infusion", defaultFrequency: "STAT" },
  { id: "cat-m9", type: "medication", nameEn: "Insulin Actrapid IV", nameAr: "أنسولين مائي وريدي", categoryEn: "Hormone/Antidiabetic", categoryAr: "أنسولين لضبط السكر وريدياً", defaultRoute: "IV Infusion", defaultFrequency: "Sliding Scale" },

  // Labs
  { id: "cat-l1", type: "lab", nameEn: "Complete Blood Count (CBC)", nameAr: "صورة دم كاملة (CBC)", categoryEn: "Hematology", categoryAr: "أمراض الدم", defaultTargetMins: 30 },
  { id: "cat-l2", type: "lab", nameEn: "Cardiac Troponin I (STAT)", nameAr: "أنزيمات القلب - تروبونين طارئ", categoryEn: "Biochemistry", categoryAr: "كيمياء حيوية طارئة", defaultTargetMins: 20 },
  { id: "cat-l3", type: "lab", nameEn: "Arterial Blood Gas (ABG)", nameAr: "غازات الدم الشرياني (ABG)", categoryEn: "Critical Care Lab", categoryAr: "مختبر الحالات الحرجة", defaultTargetMins: 15 },
  { id: "cat-l4", type: "lab", nameEn: "Basic Metabolic Panel (BMP)", nameAr: "وظائف الكلى والأملاح الأساسية", categoryEn: "Biochemistry", categoryAr: "كيمياء حيوية", defaultTargetMins: 45 },
  { id: "cat-l5", type: "lab", nameEn: "Coagulation Profile (PT/INR)", nameAr: "فحص سيولة الدم وتخثره (PT/INR)", categoryEn: "Coagulation", categoryAr: "تجلط الدم", defaultTargetMins: 35 },

  // Radiology / Scans
  { id: "cat-r1", type: "radiology", nameEn: "Bedside Chest X-Ray (STAT)", nameAr: "أشعة سينية للصدر بجانب السرير (طارئ)", categoryEn: "X-Ray", categoryAr: "الأشعة السينية", defaultTargetMins: 25 },
  { id: "cat-r2", type: "radiology", nameEn: "CT Brain (Stroke Protocol)", nameAr: "أشعة مقطعية للمخ - بروتوكول جلطة", categoryEn: "CT Scan", categoryAr: "الأشعة المقطعية", defaultTargetMins: 40 },
  { id: "cat-r3", type: "radiology", nameEn: "FAST Ultrasound (Trauma)", nameAr: "أشعة موجات فوق صوتية طارئة للنزيف", categoryEn: "Ultrasound", categoryAr: "الأشعة التلفزيونية", defaultTargetMins: 15 }
];

export default function ClinicalTimelinesHub({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"patient-flow" | "med-timing" | "emergency-code" | "order-entry">("order-entry");

  // --- Search & Selection State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "medication" | "lab" | "radiology">("all");
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<CatalogItem | null>(null);

  // Configuration forms for order creation
  const [orderRoute, setOrderRoute] = useState("IV Infusion");
  const [orderFrequency, setOrderFrequency] = useState("Q8H (Every 8 Hours)");
  const [orderTimesInput, setOrderTimesInput] = useState("06:00, 14:00, 22:00");
  const [orderTargetMins, setOrderTargetMins] = useState(30);
  const [orderPriority, setOrderPriority] = useState<"STAT" | "Routine">("STAT");
  const [orderStaff, setOrderStaff] = useState("Dr. Ahmed");

  // Active state lists that can be modified dynamically!
  const [simulatedFlow, setSimulatedFlow] = useState<TimelineEvent[]>([]);

  // Medication Administration Record (MAR) state
  const [medsList, setMedsList] = useState<MedicationSchedule[]>([]);

  // Code Blue Resuscitation Sequencer state
  const [codeActive, setCodeActive] = useState(false);
  const [codeTime, setCodeTime] = useState(0); // in seconds
  const [codeLogs, setCodeLogs] = useState<CodeLog[]>([]);
  const [metronomeOn, setMetronomeOn] = useState(false);
  const [cprCycleTime, setCprCycleTime] = useState(0); // 2-min cycle timer (120s)
  const [soundOn, setSoundOn] = useState(false);

  const codeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Dynamic Infusion Drip Level
  const [infusionRate, setInfusionRate] = useState(15); // ml/hr
  const [infusedVolume, setInfusedVolume] = useState(120); // ml
  const totalBagVolume = 250; // ml

  // Simulate continuous drip accumulation
  useEffect(() => {
    const timer = setInterval(() => {
      setInfusedVolume(v => {
        if (v >= totalBagVolume) return totalBagVolume;
        return parseFloat((v + (infusionRate / 3600) * 10).toFixed(2));
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [infusionRate]);

  // Stopwatch & 2m Cardiac cycle timers
  useEffect(() => {
    if (codeActive) {
      codeIntervalRef.current = setInterval(() => {
        setCodeTime(t => t + 1);
        setCprCycleTime(c => {
          if (c >= 120) {
            toast.warning(
              isAr 
                ? "تنبيه: انتهت دورتي الإنعاش (2 دقيقة)! يرجى تقييم النبض والتنفس وتغيير المسعف." 
                : "CPR 2-minute cycle complete! Check pulse, rhythm, and swap compressor.",
              { duration: 6000 }
            );
            playHighBeep();
            return 0;
          }
          return c + 1;
        });
      }, 1000);
    } else {
      if (codeIntervalRef.current) clearInterval(codeIntervalRef.current);
    }
    return () => {
      if (codeIntervalRef.current) clearInterval(codeIntervalRef.current);
    };
  }, [codeActive]);

  // Audio Metronome for chest compressions (110 BPM)
  useEffect(() => {
    let metronomeInterval: NodeJS.Timeout | null = null;
    if (metronomeOn) {
      const bpm = 110;
      const intervalMs = (60 / bpm) * 1000;
      metronomeInterval = setInterval(() => {
        playTickSound();
      }, intervalMs);
    }
    return () => {
      if (metronomeInterval) clearInterval(metronomeInterval);
    };
  }, [metronomeOn, soundOn]);

  const playTickSound = () => {
    if (!soundOn) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.warn("Audio block:", e);
    }
  };

  const playHighBeep = () => {
    try {
      const ctx = audioContextRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1100, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60).toString().padStart(2, "0");
    const secs = (totalSecs % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const logAction = (actionEn: string, actionAr: string) => {
    const timeStr = formatTime(codeTime);
    const newLog: CodeLog = {
      elapsedTime: timeStr,
      actionEn,
      actionAr,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setCodeLogs(prev => [newLog, ...prev]);
    toast.success(`${isAr ? actionAr : actionEn} @ ${timeStr}`);
  };

  const handleStartCode = () => {
    if (!codeActive) {
      setCodeActive(true);
      setMetronomeOn(true);
      setSoundOn(true);
      logAction("Code Blue Initiated - Resuscitation Team activated", "تم تفعيل كود بلو - استدعاء فريق الإنعاش الرئوي المعتمد");
    } else {
      setCodeActive(false);
      setMetronomeOn(false);
    }
  };

  const handleResetCode = () => {
    setCodeActive(false);
    setCodeTime(0);
    setCprCycleTime(0);
    setCodeLogs([]);
    setMetronomeOn(false);
    toast.success(isAr ? "تم إعادة تعيين مسجل الصدمات والإنعاش" : "Resuscitation tracker has been reset");
  };

  // Recalculate status dynamically based on target minutes
  const getDynamicStatus = (item: TimelineEvent) => {
    if (item.durationMins <= item.targetMins) return "on-time";
    if (item.durationMins <= item.targetMins + 10) return "delayed";
    return "critical";
  };

  const handleSimulateRandomDelay = () => {
    setSimulatedFlow(prev =>
      prev.map(item => {
        const randomChange = Math.floor(Math.random() * 11) - 5; // change by -5 to +5
        const newDuration = Math.max(3, item.durationMins + randomChange);
        return {
          ...item,
          durationMins: newDuration,
          status: newDuration <= item.targetMins ? "on-time" : newDuration <= item.targetMins + 10 ? "delayed" : "critical"
        };
      })
    );
    toast.info(isAr ? "تم محاكاة تذبذب عشوائي في أزمنة المعامل والعيادات" : "Simulated delay updates on all care stages!");
  };

  // --- Search Filtering ---
  const filteredCatalog = ORDERABLE_CATALOG.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.type === selectedCategory;
    const matchesSearch = 
      item.nameEn?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      item.nameAr?.includes(searchQuery) ||
      item.categoryEn?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      item.categoryAr?.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  // --- Handle Committing an Order ---
  const handleSelectCatalogItem = (item: CatalogItem) => {
    setSelectedCatalogItem(item);
    // Initialize fields with defaults
    if (item.defaultRoute) setOrderRoute(item.defaultRoute);
    if (item.defaultFrequency) setOrderFrequency(item.defaultFrequency);
    if (item.defaultTargetMins) setOrderTargetMins(item.defaultTargetMins);
    
    if (item.type === "medication") {
      if (item.id === "cat-m7" || item.id === "cat-m8") {
        setOrderTimesInput("STAT");
        setOrderFrequency("STAT");
      } else {
        setOrderTimesInput("08:00, 16:00, 24:00");
      }
    }
  };

  const handleCommitOrder = () => {
    if (!selectedCatalogItem) {
      toast.error(isAr ? "الرجاء اختيار عنصر طبي من القائمة أولاً" : "Please select a catalog item first!");
      return;
    }

    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);

    if (selectedCatalogItem.type === "medication") {
      // 1. If it's an emergency code blue resuscitation drug, and code blue is active, we can also inject directly into code blue logs!
      if (codeActive && (selectedCatalogItem.id === "cat-m7" || selectedCatalogItem.id === "cat-m8")) {
        logAction(
          `CPOE STAT Order: Given ${selectedCatalogItem.nameEn} ${orderRoute} by ${orderStaff}`,
          `أمر طبي عاجل: إعطاء ${selectedCatalogItem.nameAr} ${orderRoute} بواسطة ${orderStaff}`
        );
      }

      // Add to MAR list
      const parsedTimes = orderTimesInput.split(",").map(s => s.trim()).filter(Boolean);
      const newMed: MedicationSchedule = {
        id: `med-${Date.now()}`,
        nameEn: selectedCatalogItem.nameEn,
        nameAr: selectedCatalogItem.nameAr,
        route: orderRoute,
        frequency: orderFrequency,
        times: parsedTimes.length > 0 ? parsedTimes : [timeString],
        history: parsedTimes.map(time => ({
          time: "",
          status: "Pending",
          staffName: ""
        }))
      };

      setMedsList(prev => [...prev, newMed]);
      toast.success(
        isAr 
          ? `تم إدراج دواء ${selectedCatalogItem.nameAr} بنجاح في شيت العلاج MAR وجدولته.`
          : `Successfully scheduled medication ${selectedCatalogItem.nameEn} inside active MAR!`
      );
      
      // Auto-navigate to Medication tab
      setActiveTab("med-timing");

    } else {
      // 2. Lab or Radiology - Add to Patient Care Journey Timeline
      const newEvent: TimelineEvent = {
        id: `flow-${Date.now()}`,
        time: timeString,
        stepNameEn: `${selectedCatalogItem.nameEn} (${orderPriority})`,
        stepNameAr: `${selectedCatalogItem.nameAr} (${orderPriority === "STAT" ? "طارئ" : "روتين"})`,
        deptEn: selectedCatalogItem.type === "lab" ? "Clinical Lab" : "Radiology Dept",
        deptAr: selectedCatalogItem.type === "lab" ? "المختبر الطبي" : "قسم الأشعة",
        durationMins: 0, // initially 0, starts ticking or gets logged
        targetMins: orderTargetMins,
        status: "on-time",
        responsibleEn: orderStaff,
        responsibleAr: orderStaff === "Dr. Ahmed" ? "د. أحمد" : "د. سارة"
      };

      setSimulatedFlow(prev => [...prev, newEvent]);
      toast.success(
        isAr 
          ? `تم إرسال طلب ${selectedCatalogItem.nameAr} إلى ${selectedCatalogItem.type === "lab" ? "المختبر" : "الأشعة"} وبدء رصد التأخير.`
          : `Successfully placed order for ${selectedCatalogItem.nameEn}. Wait-time monitoring started!`
      );

      // Auto-navigate to Care Sequences tab
      setActiveTab("patient-flow");
    }

    // Reset selection
    setSelectedCatalogItem(null);
    setSearchQuery("");
  };

  const handleUpdateMedStatus = (medId: string, timeIdx: number, newStatus: "Given" | "Missed") => {
    const nowStr = new Date().toTimeString().slice(0, 5);
    setMedsList(prev => prev.map(m => {
      if (m.id === medId) {
        const newHistory = [...m.history];
        newHistory[timeIdx] = {
          time: nowStr,
          status: newStatus,
          staffName: isAr ? "الممرضة سارة" : "Nurse Sara"
        };
        return {
          ...m,
          history: newHistory
        };
      }
      return m;
    }));
    toast.success(
      isAr 
        ? `تم تحديث حالة الجرعة لـ (${newStatus === "Given" ? "أُعطي" : "فائت"}) بنجاح.`
        : `Dose updated to ${newStatus} successfully!`
    );
  };

  const handleDeleteMed = (medId: string) => {
    setMedsList(prev => prev.filter(m => m.id !== medId));
    toast.error(isAr ? "تم حذف الدواء من جدول العلاج" : "Medication removed from active MAR schedule.");
  };

  const handleDeleteFlowItem = (id: string) => {
    setSimulatedFlow(prev => prev.filter(item => item.id !== id));
    toast.error(isAr ? "تم إزالة الإجراء من المراقبة" : "Care step removed from wait-time audit.");
  };

  // Simulate progress in care flow wait-times
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedFlow(prev => prev.map(item => {
        // Only progress items that have less than 120 mins and are not registered at 0 mins forever
        const randIncrement = Math.random() > 0.4 ? 1 : 0;
        if (randIncrement > 0) {
          const newDur = item.durationMins + randIncrement;
          let newStatus: "on-time" | "delayed" | "critical" = "on-time";
          if (newDur > item.targetMins + 10) newStatus = "critical";
          else if (newDur > item.targetMins) newStatus = "delayed";

          return {
            ...item,
            durationMins: newDur,
            status: newStatus
          };
        }
        return item;
      }));
    }, 5000); // every 5 seconds simulate time progress
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen text-slate-800" dir={isAr ? "rtl" : "ltr"} id="clinical-timelines-root">
      
      {/* Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden mb-6" id="hub-banner">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600 rounded-full blur-[120px] opacity-20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-600 rounded-full blur-[120px] opacity-15 -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-indigo-300 text-xs font-bold mb-3">
              <Clock className="w-3.5 h-3.5 animate-pulse" />
              <span>{isAr ? "نظام تدقيق ووصف وجدولة الأوامر الطبية الفورية" : "Integrated Clinical Decision & Order Entry Timings"}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              {isAr ? "نظام الأوامر الطبية وإدارة التسلسلات الزمنية" : "CPOE, Medication Schedules & Sequence Hub"}
            </h1>
            <p className="text-slate-400 text-sm mt-1.5 max-w-2xl leading-relaxed">
              {isAr 
                ? "ابدأ بالبحث ووصف الأدوية والفحوصات المعملية من محرك البحث، وجدولتها فوراً لتظهر في شيت العلاج (MAR) أو مسار مراقبة أزمنة الانتظار ومؤشرات الأداء الوطنية."
                : "Search and prescribe medications, urgent laboratory assays, or CT/X-Ray scans, scheduling them instantly into live patient MAR, delay dashboards, or resuscitation flows."}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 px-5 py-3.5 rounded-2xl shrink-0 min-w-[220px]">
            <div className="text-indigo-400 text-xs font-black uppercase tracking-wider mb-0.5">
              {isAr ? "الامتثال لجداول الأدوية" : "MAR Timing Integrity"}
            </div>
            <div className="text-2.5xl font-mono font-black text-white flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <span>98.2%</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {isAr ? "جميع الفحوصات والأدوية مسجلة بالتوقيت الفعلي" : "All prescriptions tied to absolute timestamp audits"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex bg-white rounded-xl p-1.5 border border-slate-200 shadow-sm gap-2 mb-6 overflow-x-auto" id="hub-tabs">
        <button
          id="tab-order-entry"
          onClick={() => setActiveTab("order-entry")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-bold text-sm whitespace-nowrap rounded-lg transition-all ${
            activeTab === "order-entry"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
          }`}
        >
          <Search className="w-4 h-4" />
          <span>{isAr ? "محرك الأوامر والوصف الذكي" : "CPOE Prescribing Console"}</span>
        </button>

        <button
          id="tab-patient-flow"
          onClick={() => setActiveTab("patient-flow")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-bold text-sm whitespace-nowrap rounded-lg transition-all ${
            activeTab === "patient-flow"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{isAr ? "مسارات وتوقيتات الفحوصات" : "Exams & Wait Timelines"}</span>
          {simulatedFlow.length > 0 && (
            <span className="bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {simulatedFlow.length}
            </span>
          )}
        </button>

        <button
          id="tab-med-timing"
          onClick={() => setActiveTab("med-timing")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-bold text-sm whitespace-nowrap rounded-lg transition-all ${
            activeTab === "med-timing"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{isAr ? "جرعات ومحاليل المريض (MAR)" : "Medication Doses (MAR)"}</span>
          <span className="bg-indigo-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {medsList.length}
          </span>
        </button>

        <button
          id="tab-emergency-code"
          onClick={() => setActiveTab("emergency-code")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-bold text-sm whitespace-nowrap rounded-lg transition-all ${
            activeTab === "emergency-code"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>{isAr ? "سجل إنعاش كود بلو (CPR)" : "Code Blue Resuscitation"}</span>
          {codeActive && (
            <span className="bg-red-500 w-2.5 h-2.5 rounded-full animate-ping shrink-0" />
          )}
        </button>
      </div>

      {/* Panels */}
      <AnimatePresence mode="wait">
        
        {/* TAB 0: CPOE Prescribing Console */}
        {activeTab === "order-entry" && (
          <motion.div
            key="order-entry"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            id="panel-order-entry"
          >
            {/* Catalog Search Column (Left & Middle) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-2 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-indigo-600" />
                  {isAr ? "البحث والاختيار لوصف الأدوية والتحاليل والأشعة" : "Prescribe Medications, Labs, or Diagnostic Scans"}
                </h3>
                <p className="text-xs text-slate-500">
                  {isAr 
                    ? "ابحث بالاسم العربي أو الإنجليزي في الكتالوج المعتمد للمستشفى لوصفه فوراً للمريض."
                    : "Filter and search our live hospital formulary catalog to configure and schedule medical items."}
                </p>
              </div>

              {/* Search input and Category filters */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3.5 text-slate-400 w-4.5 h-4.5" />
                  <input
                    type="text"
                    placeholder={isAr ? "ابحث عن دواء، تحليل، أشعة، تروبونين، ميروبينيم..." : "Search formulary, epinephrine, troponin, CT, X-Ray..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 font-bold"
                  />
                </div>
                
                {/* Category filters */}
                <div className="flex gap-1.5 overflow-x-auto shrink-0 pb-1">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedCategory === "all" ? "bg-slate-900 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {isAr ? "الكل" : "All Items"}
                  </button>
                  <button
                    onClick={() => setSelectedCategory("medication")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      selectedCategory === "medication" ? "bg-indigo-600 text-white" : "bg-indigo-50 hover:bg-indigo-100 text-indigo-800"
                    }`}
                  >
                    <Droplet className="w-3 h-3" />
                    {isAr ? "أدوية ومحاليل" : "Meds"}
                  </button>
                  <button
                    onClick={() => setSelectedCategory("lab")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      selectedCategory === "lab" ? "bg-emerald-600 text-white" : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    <Activity className="w-3 h-3" />
                    {isAr ? "تحاليل معملية" : "Labs"}
                  </button>
                  <button
                    onClick={() => setSelectedCategory("radiology")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      selectedCategory === "radiology" ? "bg-amber-600 text-white" : "bg-amber-50 hover:bg-amber-100 text-amber-800"
                    }`}
                  >
                    <Layers className="w-3 h-3" />
                    {isAr ? "أشعة ورنين" : "Scans"}
                  </button>
                </div>
              </div>

              {/* Formulary Catalog Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[450px] overflow-y-auto pr-1">
                {filteredCatalog.map(item => {
                  const isSelected = selectedCatalogItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectCatalogItem(item)}
                      className={`p-4 rounded-xl border text-right cursor-pointer transition-all ${
                        isSelected 
                          ? "bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-200" 
                          : "bg-slate-50 hover:bg-slate-100/80 border-slate-200"
                      }`}
                      style={{ direction: isAr ? "rtl" : "ltr" }}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          item.type === "medication" ? "bg-indigo-100 text-indigo-700" :
                          item.type === "lab" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {isAr ? item.categoryAr : item.categoryEn}
                        </span>
                        
                        {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                      </div>

                      <h4 className="font-black text-slate-800 text-sm mt-2">
                        {isAr ? item.nameAr : item.nameEn}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {item.type === "medication" 
                          ? (isAr ? `طريقة الإعطاء الافتراضية: ${item.defaultRoute}` : `Default: ${item.defaultRoute}`)
                          : (isAr ? `زمن المعالجة المستهدف: ${item.defaultTargetMins} دقيقة` : `Target: ${item.defaultTargetMins} mins`)
                        }
                      </p>
                    </div>
                  );
                })}

                {filteredCatalog.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-400 text-xs">
                    <Info className="w-5 h-5 sm:w-8 sm:h-8 mx-auto opacity-30 mb-2" />
                    {isAr ? "لم نجد نتائج مطابقة لبحثك في صيدلية ومعمل المستشفى." : "No matching items found in hospital catalog."}
                  </div>
                )}
              </div>
            </div>

            {/* Config & Order Scheduler Panel (Right) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-black text-slate-800 text-base">
                  {isAr ? "إعداد وجدولة الأمر الطبي" : "Configure & Schedule Order"}
                </h3>
                <p className="text-xs text-slate-500">
                  {isAr 
                    ? "اضبط جرعة الدواء، التوقيت، أو أولوية فحص المختبر، ثم اعتمد الأمر الطبي."
                    : "Fill in clinical details and dispatch the scheduled task directly into workflow lists."}
                </p>
              </div>

              {selectedCatalogItem ? (
                <div className="space-y-4" style={{ direction: isAr ? "rtl" : "ltr" }}>
                  {/* Selected Item Indicator */}
                  <div className="bg-slate-900 text-white rounded-xl p-3.5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-indigo-300 font-bold uppercase">{selectedCatalogItem.type} Selected</span>
                      <h4 className="font-black text-sm">{isAr ? selectedCatalogItem.nameAr : selectedCatalogItem.nameEn}</h4>
                    </div>
                    <Trash2 
                      onClick={() => setSelectedCatalogItem(null)} 
                      className="w-4 h-4 text-slate-400 hover:text-rose-400 cursor-pointer transition-colors" 
                    />
                  </div>

                  {/* Config fields conditionally rendered */}
                  {selectedCatalogItem.type === "medication" ? (
                    <>
                      {/* Medication Config fields */}
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">
                          {isAr ? "طريقة إعطاء العلاج" : "Route of Administration"}
                        </label>
                        <select
                          value={orderRoute}
                          onChange={(e) => setOrderRoute(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-xs font-bold p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="IV Infusion">IV Infusion (تسريب وريدي)</option>
                          <option value="IV Bolus">IV Bolus (حقنة وريدية مباشرة)</option>
                          <option value="Subcutaneous">Subcutaneous (تحت الجلد)</option>
                          <option value="Intramuscular">Intramuscular (عضلي)</option>
                          <option value="Oral PO">Oral PO (عن طريق الفم)</option>
                          <option value="IV Push">IV Push (حقن وريدي سريع)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">
                          {isAr ? "تكرار الجرعة" : "Frequency"}
                        </label>
                        <input
                          type="text"
                          value={orderFrequency}
                          onChange={(e) => setOrderFrequency(e.target.value)}
                          placeholder="e.g. Q8H, QD, BID"
                          className="w-full bg-slate-50 border border-slate-200 text-xs font-bold p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">
                          {isAr ? "أوقات الجرعات اليومية (مفصولة بفواصل)" : "Prescheduled Daily Hours (comma separated)"}
                        </label>
                        <input
                          type="text"
                          value={orderTimesInput}
                          onChange={(e) => setOrderTimesInput(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-xs font-bold p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                        />
                        <span className="text-[10px] text-slate-400 block mt-1">
                          {isAr ? "مثال: 08:00, 16:00, 24:00" : "Example: 08:00, 16:00, 24:00"}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Lab & Radiology Config fields */}
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">
                          {isAr ? "أولوية الطلب والسرعة" : "Priority / Urgency"}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setOrderPriority("STAT");
                              setOrderTargetMins(selectedCatalogItem.defaultTargetMins || 20);
                            }}
                            className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                              orderPriority === "STAT" 
                                ? "bg-rose-50 border-rose-300 text-rose-800 font-black" 
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            🚨 STAT (عاجل فوراً)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setOrderPriority("Routine");
                              setOrderTargetMins((selectedCatalogItem.defaultTargetMins || 20) * 2);
                            }}
                            className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                              orderPriority === "Routine" 
                                ? "bg-indigo-50 border-indigo-300 text-indigo-800 font-black" 
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            📋 Routine (عادي)
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">
                          {isAr ? "زمن المعالجة والنتيجة المستهدف (بالدقائق)" : "Target Turnaround Time (minutes)"}
                        </label>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <input
                            type="number"
                            value={orderTargetMins}
                            onChange={(e) => setOrderTargetMins(Number(e.target.value))}
                            className="w-20 bg-slate-50 border border-slate-200 text-xs font-bold p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-center"
                          />
                          <span className="text-xs text-slate-400">
                            {isAr ? "دقيقة كحد أقصى لإصدار التقرير" : "mins max threshold for alarm"}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* General Fields */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      {isAr ? "الطبيب المعالج المسؤول" : "Responsible Clinician"}
                    </label>
                    <select
                      value={orderStaff}
                      onChange={(e) => setOrderStaff(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-xs font-bold p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Dr. Ahmed">{isAr ? "د. أحمد (طبيب طوارئ)" : "Dr. Ahmed (Emergency Physician)"}</option>
                      <option value="Dr. Sara">{isAr ? "د. سارة (أخصائية قلب)" : "Dr. Sara (Cardiologist)"}</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleCommitOrder}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isAr ? "إرسال وجدولة الأمر الطبي فوراً" : "Commit & Dispatch Order"}</span>
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center py-16 space-y-2">
                  <PlusCircle className="w-10 h-10 opacity-30 text-indigo-500 animate-pulse" />
                  <p className="font-bold text-slate-600">{isAr ? "بانتظار اختيار عنصر" : "Prescription Engine Idle"}</p>
                  <p className="max-w-[180px] leading-relaxed">
                    {isAr ? "اختر أي دواء أو تحليل من القائمة لتعديله وجدولته للعمل فوراً." : "Select any medication or diagnostic lab test to load its clinical scheduler form."}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 1: Patient Care Sequences & Delay Bottlenecks */}
        {activeTab === "patient-flow" && (
          <motion.div
            key="patient-flow"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            id="panel-patient-flow"
          >
            {/* Left: Dynamic Target Threshold Configurator */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 lg:col-span-1">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-600" />
                  {isAr ? "رصد وضبط مؤشرات الفحوصات" : "Formulary Testing SLA Monitors"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isAr 
                    ? "تابع أزمنة المعامل والأشعة المطلوبة. يتم محاكاة الوقت من لحظة الطلب."
                    : "Track and adjust threshold limits for diagnostic reporting turnaround times."}
                </p>
              </div>

              {/* Slider Controls */}
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                  <div className="text-xs text-slate-500 font-bold mb-1">
                    {isAr ? "تحليل المعمل عالي الأولوية (STAT)" : "STAT Labs Safe Threshold"}
                  </div>
                  <div className="flex items-center justify-between font-mono font-black text-sm text-indigo-600">
                    <span>{isAr ? "20 دقيقة" : "20 mins"}</span>
                    <span className="text-[10px] bg-indigo-50 px-2 py-0.5 rounded text-indigo-700">National Standard</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                  <div className="text-xs text-slate-500 font-bold mb-1">
                    {isAr ? "تقارير الأشعة المقطعية" : "STAT Brain CT Safe Threshold"}
                  </div>
                  <div className="flex items-center justify-between font-mono font-black text-sm text-indigo-600">
                    <span>{isAr ? "40 دقيقة" : "40 mins"}</span>
                    <span className="text-[10px] bg-indigo-50 px-2 py-0.5 rounded text-indigo-700">Stroke Protocol</span>
                  </div>
                </div>
              </div>

              {/* Action Tools */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <button
                  onClick={handleSimulateRandomDelay}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAr ? "محاكاة تقلبات وتأخيرات في الفحوصات" : "Simulate Lab delay shifts"}</span>
                </button>
                <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 text-amber-800 text-xs flex gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">{isAr ? "رصد الإخفاق في مواعيد الفحوصات:" : "SLA Deviation Warning:"}</span>
                    <p className="mt-0.5 text-[11px] leading-relaxed">
                      {isAr 
                        ? "سوف تنتقل الفحوصات الطارئة تلقائياً للحالة الحرجة (حمراء) عند تجاوز مدة المعالجة المستهدفة لمنع أي ضرر للمريض."
                        : "Orders automatically transition to red critical alarm status if actual simulated minutes exceed target threshold limits."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right/Middle: Interactive Process Sequence Log */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-black text-slate-800 text-base">
                    {isAr ? "رصد ومراقبة أوقات الفحوصات النشطة" : "Active Diagnostics & Procedures Turnaround Monitor"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isAr ? "الأزمنة تحاكي الوقت المنقضي الفعلي ومقارنته بالحد الأقصى المسموح به" : "Real-time delay auditing of clinical orders added via search/form"}
                  </p>
                </div>
                <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-bold">
                  Patient MRN-2026-0341
                </span>
              </div>

              {/* Sequential Flow List */}
              <div className="relative pl-6 md:pl-8 border-l-2 border-slate-200 space-y-6 py-2 ml-4">
                {simulatedFlow.map((item) => {
                  const dynamicStatus = getDynamicStatus(item);
                  return (
                    <div key={item.id} className="relative group">
                      {/* Left Dot Icon */}
                      <div className={`absolute -left-[35px] md:-left-[43px] top-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] shadow-sm ${
                        dynamicStatus === "on-time" ? "bg-emerald-500 text-white" :
                        dynamicStatus === "delayed" ? "bg-amber-400 text-white" : "bg-rose-500 text-white animate-pulse"
                      }`}>
                        {dynamicStatus === "on-time" ? "✓" : "!"}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 items-start">
                        {/* Phase Title */}
                        <div className="md:col-span-2">
                          <div className="flex items-center">
                            <span className="text-sm font-black text-slate-800">
                              {isAr ? item.stepNameAr : item.stepNameEn}
                            </span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold font-mono">
                              {item.time}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {isAr ? `القسم: ${item.deptAr} | المسؤول: ${item.responsibleAr}` : `Dept: ${item.deptEn} | Staff: ${item.responsibleEn}`}
                          </div>
                        </div>

                        {/* Durations comparisons */}
                        <div className="flex flex-col text-xs font-mono font-bold">
                          <span className="text-slate-600 flex justify-between">
                            <span>{isAr ? "المنقضي:" : "Elapsed:"}</span>
                            <span className={dynamicStatus === "critical" ? "text-rose-600 font-black animate-pulse" : "text-slate-800"}>
                              {item.durationMins} {isAr ? "د" : "mins"}
                            </span>
                          </span>
                          <span className="text-slate-400 flex justify-between">
                            <span>{isAr ? "المستهدف:" : "Target:"}</span>
                            <span>{item.targetMins} {isAr ? "د" : "mins"}</span>
                          </span>
                        </div>

                        {/* Status Label and Action */}
                        <div className="flex justify-between items-center md:justify-end gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase text-center border ${
                            dynamicStatus === "on-time" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                            dynamicStatus === "delayed" ? "bg-amber-50 text-amber-700 border-amber-200" :
                            "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
                          }`}>
                            {dynamicStatus === "on-time" && (isAr ? "مقبول" : "On-Time")}
                            {dynamicStatus === "delayed" && (isAr ? "متأخر" : "Delayed")}
                            {dynamicStatus === "critical" && (isAr ? "حرِج" : "Critical Delay")}
                          </span>

                          <button
                            onClick={() => handleDeleteFlowItem(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                            title="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {simulatedFlow.length === 0 && (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    <Clock className="w-10 h-10 mx-auto opacity-35 mb-2" />
                    {isAr ? "لا توجد فحوصات أو تحاليل نشطة في قائمة المراقبة حالياً." : "No diagnostics active in timing monitor."}
                    <button 
                      onClick={() => setActiveTab("order-entry")}
                      className="mt-3 block mx-auto text-indigo-600 font-bold hover:underline"
                    >
                      {isAr ? "+ اطلب دواءً أو فحصاً معملياً" : "+ Prescribe medication or lab assay"}
                    </button>
                  </div>
                )}
              </div>

              {/* Dynamic summary metric */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase">{isAr ? "مؤشر جودة الفحوصات الفورية" : "Emergency TAT Compliance"}</div>
                  <div className="text-lg font-black text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <Gauge className="w-4.5 h-4.5 text-emerald-500" />
                    <span>{isAr ? "94.8% متوافق مع معايير سباهي" : "94.8% SLA Safe"}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xs bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 px-3 py-1.5 rounded-lg font-black">
                    {isAr ? "✓ خاضع لتدقيق الجودة والسلامة والـ JCI" : "✓ Complies with JCI Patient Safety Directives"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: Medication Administration Record Sequence (MAR) */}
        {activeTab === "med-timing" && (
          <motion.div
            key="med-timing"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            id="panel-med-timing"
          >
            {/* Left/Middle Column: Interactive 24-Hour Medication Dose Sequence */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-black text-slate-800 text-base">
                    {isAr ? "شيت تسلسلات وجدولة الأدوية الوريدية والشراب (MAR)" : "Active Patient Medication Administration Record"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isAr ? "تتبع دقيق لجدول الجرعات اليومي وتوقيت إعطائها لمنع السهو أو التداخل الدوائي" : "Audit and record drug administration timestamps. Prescribe new ones via Search tab."}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1 rounded text-xs font-bold">
                  <Activity className="w-3.5 h-3.5" />
                  <span>{isAr ? "المريض: سمير حافظ (ICU-04)" : "Patient: Samir Hafez (ICU-04)"}</span>
                </div>
              </div>

              {/* Medication Sequence Grid */}
              <div className="space-y-6">
                {medsList.map((med) => (
                  <div key={med.id} className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-all">
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div>
                        <h4 className="font-black text-slate-800 text-sm">
                          {isAr ? med.nameAr : med.nameEn}
                        </h4>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {isAr ? `طريقة الإعطاء: ${med.route} | التكرار: ${med.frequency}` : `Route: ${med.route} | Frequency: ${med.frequency}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded font-black uppercase">
                          {med.route}
                        </span>
                        <button
                          onClick={() => handleDeleteMed(med.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded transition-all"
                          title="Delete medication"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Timeline Sequence of daily doses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                      {med.times.map((time, idx) => {
                        const hist = med.history[idx];
                        const isGiven = hist?.status === "Given";
                        const isMissed = hist?.status === "Missed";
                        const isPending = !hist || hist.status === "Pending";

                        return (
                          <div 
                            key={time} 
                            className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                              isGiven ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
                              isMissed ? "bg-rose-50 border-rose-100 text-rose-800" :
                              "bg-slate-100 border-slate-200 text-slate-600"
                            }`}
                            style={{ direction: isAr ? "rtl" : "ltr" }}
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold font-mono">{time}</span>
                              <span className="text-[9px] text-slate-400">{isAr ? "الوردية" : "Shift Due"}</span>
                            </div>

                            {isGiven ? (
                              <div className="text-xs font-bold mt-2 text-emerald-700 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{isAr ? "أُعطي بنجاح" : "Given Successfully"}</span>
                              </div>
                            ) : isMissed ? (
                              <div className="text-xs font-bold mt-2 text-rose-700 flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                <span>{isAr ? "جرعة فائتة" : "Missed"}</span>
                              </div>
                            ) : (
                              <div className="text-xs font-bold mt-2 text-indigo-600 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                <span>{isAr ? "مجدول وقيد الانتظار" : "Scheduled"}</span>
                              </div>
                            )}

                            {/* Staff Name and Time Logged */}
                            <div className="text-[10px] text-slate-400 mt-1.5">
                              {isGiven ? `${hist.staffName} @ ${hist.time}` : isMissed ? (isAr ? "تم تخطيه طبيًا" : "Skipped") : (isAr ? "لم يُعط بعد" : "Not Administered Yet")}
                            </div>

                            {/* Administration Actions for Nurse */}
                            {isPending && (
                              <div className="flex gap-1.5 mt-2.5 pt-2 border-t border-slate-200">
                                <button
                                  onClick={() => handleUpdateMedStatus(med.id, idx, "Given")}
                                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 text-[10px] rounded transition-all"
                                >
                                  {isAr ? "أعطي" : "Give"}
                                </button>
                                <button
                                  onClick={() => handleUpdateMedStatus(med.id, idx, "Missed")}
                                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-1 text-[10px] rounded transition-all"
                                >
                                  {isAr ? "تخطي" : "Skip"}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {medsList.length === 0 && (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    <Activity className="w-10 h-10 mx-auto opacity-35 mb-2" />
                    {isAr ? "لا توجد أدوية مضافة حالياً في الـ MAR." : "No active medication orders in MAR."}
                    <button 
                      onClick={() => setActiveTab("order-entry")}
                      className="mt-3 block mx-auto text-indigo-600 font-bold hover:underline"
                    >
                      {isAr ? "+ ابحث وأضف أدوية جديدة" : "+ Search and add medication"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Continuous IV Drip Controller Sequence */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-blue-600" />
                  {isAr ? "مراقبة وإدارة التسريب المستمر" : "Continuous IV Infusion Monitor"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isAr ? "محاكاة لحظية لمضخة التسريب ومعدل التدفق (ml/hr) والجرعة المستهلكة." : "Real-time monitoring of continuous infusion rate sequences & bag depletion."}
                </p>
              </div>

              {/* Infusion Bag Visualizer */}
              <div className="bg-slate-900 rounded-3xl p-5 text-white space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-blue-400 text-xs font-bold uppercase">Active Infusion Line</span>
                    <h4 className="text-lg font-black">Heparin 25,000 IU / 250ml</h4>
                  </div>
                  <span className="bg-emerald-500 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded animate-pulse">
                    RUNNING
                  </span>
                </div>

                {/* Progress bar representing fluid level */}
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-xs font-mono font-bold text-slate-300">
                    <span>{isAr ? "السائل المتبقي في الكيس:" : "Volume Remaining:"}</span>
                    <span>{(totalBagVolume - infusedVolume).toFixed(1)} ml / {totalBagVolume} ml</span>
                  </div>
                  <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full transition-all duration-1000 animate-pulse"
                      style={{ width: `${((totalBagVolume - infusedVolume) / totalBagVolume) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Drip Rate Control */}
                <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-400 font-bold">{isAr ? "معدل تدفق مضخة المحاليل" : "Infusion Pump Rate"}</span>
                    <span className="text-sm font-mono font-bold text-blue-400">{infusionRate} ml/hr</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={infusionRate}
                    onChange={(e) => setInfusionRate(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>Min: 5 ml/hr</span>
                    <span>Max: 50 ml/hr</span>
                  </div>
                </div>

                {/* Timings Calculations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-center text-xs font-mono font-bold">
                  <div className="bg-slate-800 rounded-xl p-2.5">
                    <div className="text-[10px] text-slate-400 uppercase">{isAr ? "الزمن حتى نفاد الكيس" : "Time To Depletion"}</div>
                    <div className="text-sm mt-0.5 font-bold text-white">
                      {Math.floor((totalBagVolume - infusedVolume) / infusionRate)}h {Math.floor((((totalBagVolume - infusedVolume) / infusionRate) % 1) * 60)}m
                    </div>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-2.5">
                    <div className="text-[10px] text-slate-400 uppercase">{isAr ? "معدل التدفق بالقطرة" : "Drip Sequence"}</div>
                    <div className="text-sm mt-0.5 font-bold text-white">
                      {((infusionRate * 20) / 60).toFixed(0)} {isAr ? "قطرة/د" : "gtt/min"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => {
                  setInfusedVolume(0);
                  toast.success(isAr ? "تم تعليق كيس محاليل هيبارين جديد (250 مل) بنجاح" : "New IV bag of Heparin 250ml hung successfully!");
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition-colors"
              >
                {isAr ? "تعليق كيس محاليل هيبارين جديد (Reset Bag)" : "Hang New IV Bag"}
              </button>
            </div>
          </motion.div>
        )}

        {/* TAB 3: CPR Tracker & Code Blue Resuscitation Timeline Sequence */}
        {activeTab === "emergency-code" && (
          <motion.div
            key="emergency-code"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            id="panel-emergency-code"
          >
            {/* Left: Stopwatch, Metronome and Controls */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-rose-600 text-base flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-600 animate-pulse" />
                    {isAr ? "ساعة إيقاف كود بلو الطارئ" : "Emergency Code Blue Clock"}
                  </h3>
                  <span className="bg-rose-100 text-rose-800 font-mono text-[10px] font-black px-2 py-0.5 rounded animate-pulse">
                    JCI Standard
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {isAr ? "لحساب المدة الإجمالية ودورة تدليك وعضلة القلب (2 دقيقة) ومزامنة الإنعاش الرئوي." : "Continuous stopwatch counting resuscitation duration & chest compression timing."}
                </p>
              </div>

              {/* Live Elapsed Time Counter Card */}
              <div className="bg-slate-950 text-white rounded-3xl p-6 text-center border-2 border-rose-500/30 relative overflow-hidden">
                {/* Visual heart-pulse trace background */}
                <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                  <Activity className="w-48 h-48 text-rose-500 animate-pulse" />
                </div>

                <div className="relative z-10 space-y-2">
                  <div className="text-xs text-rose-400 font-bold uppercase tracking-widest">
                    {isAr ? "إجمالي زمن محاولة الإنعاش" : "Total Elapsed Resuscitation Time"}
                  </div>
                  <div className="text-5xl font-mono font-black tracking-wider text-white">
                    {formatTime(codeTime)}
                  </div>

                  {/* CPR Cycle Progress */}
                  <div className="pt-4 border-t border-slate-900 mt-4">
                    <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
                      <span>{isAr ? "دورة تدليك القلب (حد أقصى دقيقتين):" : "CPR Compression Cycle (Max 2m):"}</span>
                      <span className={cprCycleTime >= 100 ? "text-rose-400 animate-pulse font-black" : "text-white font-mono"}>
                        {formatTime(cprCycleTime)} / 02:00
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${cprCycleTime >= 100 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(100, (cprCycleTime / 120) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CPR Metronome Panel */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">
                      {isAr ? "بندول تدليك الصدر (CPR Metronome)" : "CPR Metronome (110 BPM)"}
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      {isAr ? "يومض بمعدل 110 نبضات/دقيقة لتوجيه المسعفين أثناء الضغط الصدري." : "Flashes visually to guide cardiac massage at recommended frequency."}
                    </p>
                  </div>
                  
                  {/* Sound Toggle */}
                  <button
                    onClick={() => setSoundOn(!soundOn)}
                    className={`p-2 rounded-lg border transition-colors ${soundOn ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-400'}`}
                  >
                    {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setMetronomeOn(!metronomeOn)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                      metronomeOn 
                        ? "bg-rose-600 hover:bg-rose-500 text-white" 
                        : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                    }`}
                  >
                    {metronomeOn ? (isAr ? "إيقاف البندول" : "Stop Metronome") : (isAr ? "تشغيل البندول" : "Start Metronome")}
                  </button>

                  {/* Flashing Light Indicator */}
                  {metronomeOn && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 60/110 }}
                      className="w-5.5 h-5.5 bg-rose-500 rounded-full flex items-center justify-center text-white"
                    >
                      <Zap className="w-3.5 h-3.5 fill-white text-white" />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Control Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleStartCode}
                  className={`py-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow ${
                    codeActive 
                      ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-100" 
                      : "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-100"
                  }`}
                >
                  {codeActive ? <Pause size={15} /> : <Play size={15} />}
                  <span>{codeActive ? (isAr ? "إيقاف مؤقت" : "Pause Code") : (isAr ? "بدء الإنعاش" : "Initiate Code")}</span>
                </button>

                <button
                  onClick={handleResetCode}
                  className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw size={15} />
                  <span>{isAr ? "إعادة ضبط" : "Clear & Reset"}</span>
                </button>
              </div>
            </div>

            {/* Middle: Live Intervention Buttons Logger */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-black text-slate-800 text-base">
                  {isAr ? "تسجيل الإجراءات والتدخلات الطبية" : "Document Active Clinical Interventions"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isAr ? "انقر لتسجيل التوقيت الدقيق لإعطاء الصدمات، الأدرينالين، أو غيرها في شيت الإنعاش." : "Record precise seconds of medication boluses or defib shocks."}
                </p>
              </div>

              {/* Intervention Action Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => logAction("Chest Compressions Started", "بدء تدليك عضلة القلب (Chest Compressions)")}
                  className="p-3.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 font-bold text-xs flex flex-col items-center gap-2 text-center transition-all hover:border-slate-300"
                >
                  <Gauge className="w-5 h-5 text-indigo-600" />
                  <span>{isAr ? "بدء الضغط الصدري" : "CPR Compressions"}</span>
                </button>

                <button
                  onClick={() => logAction("Defibrillator Shock #1 Delivered (200J)", "إعطاء صدمة كهربائية مزيلة للرجفان (Defib Shock)")}
                  className="p-3.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-800 font-bold text-xs flex flex-col items-center gap-2 text-center transition-all rounded-xl"
                >
                  <Zap className="w-5 h-5 text-red-600" />
                  <span>{isAr ? "صدمة كهربائية (Shock)" : "Defib Shock"}</span>
                </button>

                <button
                  onClick={() => logAction("Epinephrine 1mg IV Administered", "إعطاء هرمون الأدرينالين 1 ملغ وريدي (Epinephrine)")}
                  className="p-3.5 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs flex flex-col items-center gap-2 text-center transition-all rounded-xl"
                >
                  <Flame className="w-5 h-5 text-indigo-600" />
                  <span>{isAr ? "أدرينالين وريدي 1 ملغ" : "Give Epinephrine"}</span>
                </button>

                <button
                  onClick={() => logAction("Amiodarone 300mg IV Given", "إعطاء أميودارون 300 ملغ وريدي (Amiodarone)")}
                  className="p-3.5 border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs flex flex-col items-center gap-2 text-center transition-all rounded-xl"
                >
                  <Activity className="w-5 h-5 text-purple-600" />
                  <span>{isAr ? "أميودارون وريدي 300 ملغ" : "Give Amiodarone"}</span>
                </button>

                <button
                  onClick={() => logAction("Endotracheal Intubation secured - Airway Managed", "تأمين مجرى الهواء والتركيب بالأنبوب الرغامي (ET Tube)")}
                  className="p-3.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 font-bold text-xs flex flex-col items-center gap-2 text-center transition-all hover:border-slate-300 col-span-2"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>{isAr ? "تأمين مجرى التنفس (Intubation)" : "Intubation / Airway Management"}</span>
                </button>

                <button
                  onClick={() => logAction("Rhythm assessment - Shockable / Non-Shockable check", "فحص وتحديد طبيعة النبض والرجفان (Rhythm Check)")}
                  className="p-3.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 font-bold text-xs flex flex-col items-center gap-2 text-center transition-all hover:border-slate-300 col-span-2"
                >
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span>{isAr ? "تقييم ضربات القلب والنبض" : "Assess Rhythm (Check Pulse)"}</span>
                </button>
              </div>
            </div>

            {/* Right: Live Chronology Feed of Code Blue Events */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-black text-slate-800 text-base">
                    {isAr ? "شيت تسلسل الأحداث الزمني" : "CPR Log Sequence"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isAr ? "سجل تتابعي دقيق ومفصل معتمد لأغراض الجودة والـ JCI" : "Official chronological record of events"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (codeLogs.length === 0) {
                      toast.error(isAr ? "السجل فارغ! قم بتسجيل إجراءات أولاً." : "Nothing logged yet!");
                      return;
                    }
                    window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "CPR resuscitation sequence exported to Patient EMR!", titleAr: "تم إرسال الشيت الطبي لملف المريض بنجاح", type: "form" } }));
                  }}
                  className="text-xs font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>{isAr ? "تصدير الملف" : "Export Log"}</span>
                </button>
              </div>

              {/* Feed Display Container */}
              <div className="h-[300px] overflow-y-auto border border-slate-100 rounded-xl p-3 bg-slate-50 space-y-3">
                <AnimatePresence initial={false}>
                  {codeLogs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center space-y-2 py-10">
                      <Clock className="w-10 h-10 opacity-35 animate-spin" style={{ animationDuration: '4s' }} />
                      <p>{isAr ? "بانتظار بدء كود بلو وتسجيل الأحداث..." : "Waiting for Code Blue activation to capture timeline sequence..."}</p>
                    </div>
                  ) : (
                    codeLogs.map((log, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-xs flex justify-between items-center"
                      >
                        <div>
                          <div className="font-black text-slate-800">
                            {isAr ? log.actionAr : log.actionEn}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            {isAr ? `توقيت المحاولة: ${log.elapsedTime}` : `Elapsed CPR: ${log.elapsedTime}`} | {log.timestamp}
                          </div>
                        </div>
                        <span className="bg-rose-100 text-rose-800 font-mono text-[10px] font-bold px-2 py-0.5 rounded shrink-0">
                          +{log.elapsedTime}
                        </span>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
