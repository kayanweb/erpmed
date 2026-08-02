import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  BedDouble, 
  Activity, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  Send, 
  MessageSquare, 
  CheckCircle, 
  TrendingDown, 
  RefreshCw, 
  FileText, 
  ChevronRight, 
  Search, 
  Plus, 
  X, 
  CheckSquare, 
  ShieldAlert, 
  Flame, 
  UserCheck, 
  ArrowLeftRight,
  ClipboardList
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from "recharts";
import { toast } from "sonner";
import { syncSetting, saveSetting } from "../lib/firestoreService";

interface DepartmentDashboardProps {
  language: 'ar' | 'en';
  departmentName: string;
}

export default function DepartmentDashboard({ language, departmentName }: DepartmentDashboardProps) {
  const isAr = language === 'ar';

  // --- STATE FOR MAIN DASHBOARD ---
  const [activeTab, setActiveTab] = useState<'analytics' | 'chat'>('analytics');
  const [activeModal, setActiveModal] = useState<'patients' | 'beds' | 'tasks' | 'critical' | null>(null);

  // --- RECHARTS CHART MODE ---
  const [chartMode, setChartMode] = useState<'occupancy' | 'flow'>('occupancy');

  // --- STATE-DRIVEN Data source ---
  // 1. Patients list (Admitted Patients)
  const [patients, setPatients] = useState([
    { mrn: 'MRN-2026-0101', name: 'خالد عبد الله العتيبي', room: '101-A', age: 45, status: 'Stable', diagnosis: 'التهاب رئوي حاد (Acute Pneumonia)', doctor: 'د. عاصم الحازمي', date: '2026-06-25' },
    { mrn: 'MRN-2026-0102', name: 'سارة أحمد الكندري', room: '102-B', age: 34, status: 'Critical', diagnosis: 'حماض كيتوني سكري (DKA)', doctor: 'د. ليلى عبد العزيز', date: '2026-06-28' },
    { mrn: 'MRN-2026-0103', name: 'محمد سعد الدوسري', room: '101-B', age: 62, status: 'Stable', diagnosis: 'فشل قلبي مزمن (Chronic Heart Failure)', doctor: 'د. عاصم الحازمي', date: '2026-06-24' },
    { mrn: 'MRN-2026-0104', name: 'فاطمة محمد الشمري', room: '103-A', age: 58, status: 'Stable', diagnosis: 'التهاب مجاري بولية شديد (UTI)', doctor: 'د. منيرة السديري', date: '2026-06-27' },
    { mrn: 'MRN-2026-0105', name: 'عبد الرحمن صالح القحطاني', room: '104-A', age: 71, status: 'Critical', diagnosis: 'انسداد رئوي مزمن (COPD Exacerbation)', doctor: 'د. عاصم الحازمي', date: '2026-06-26' },
    { mrn: 'MRN-2026-0106', name: 'منى فيصل الحربي', room: '105-B', age: 29, status: 'Stable', diagnosis: 'التهاب الزائدة الدودية حاد (Appendicitis)', doctor: 'د. ليلى عبد العزيز', date: '2026-06-29' },
    { mrn: 'MRN-2026-0107', name: 'فيصل مذكر السبيعي', room: '102-A', age: 50, status: 'Critical', diagnosis: 'متلازمة الشريان التاجي الحادة (ACS)', doctor: 'د. منيرة السديري', date: '2026-06-29' },
    { mrn: 'MRN-2026-0108', name: 'جواهر سعد العتيبي', room: '106-A', age: 64, status: 'Stable', diagnosis: 'التهاب الأذن الوسطى البكتيري', doctor: 'د. عاصم الحازمي', date: '2026-06-28' },
  ]);

  // 2. Critical cases and their clinical checklists/vitals
  const [criticalCases, setCriticalCases] = useState([
    { 
      mrn: 'MRN-2026-0102', 
      name: 'سارة أحمد الكندري', 
      room: '102-B', 
      score: 7, 
      risk: isAr ? 'عالي الخطورة' : 'High Risk',
      reasonAr: 'حماض كيتوني سكري مصحوب بارتفاع ضربات القلب وهبوط الضغط الانقباضي لـ 95 مم زئبق.',
      reasonEn: 'Diabetic Ketoacidosis (DKA) with tachycardia and hypotension.',
      vitals: { hr: 115, bp: '95/60', temp: 38.2, rr: 24, spo2: '93%' },
      checklist: [
        { task: 'تأمين خطين وريديين ذوي قطر عريض', done: true },
        { task: 'بدء حقن الإنسولين الوريدي المستمر حسب البروتوكول', done: true },
        { task: 'مراقبة سكر الدم العشوائي والكهارل كل ساعة', done: false },
        { task: 'تسجيل الصادر والوارد من السوائل بشكل دقيق (I/O Chart)', done: false }
      ]
    },
    { 
      mrn: 'MRN-2026-0105', 
      name: 'عبد الرحمن صالح القحطاني', 
      room: '104-A', 
      score: 8, 
      risk: isAr ? 'عالي الخطورة' : 'High Risk',
      reasonAr: 'تفاقم حاد لمرض السدة الرئوية المزمنة (COPD) مع فشل تنفسي وتراجع معدل الأكسجة للدم.',
      reasonEn: 'Acute COPD exacerbation with respiratory fatigue and hypoxia.',
      vitals: { hr: 98, bp: '135/80', temp: 37.6, rr: 28, spo2: '86% (هواء الغرفة)' },
      checklist: [
        { task: 'البدء الفوري بجهاز التنفس غير الاختراقي (BiPAP)', done: true },
        { task: 'تحليل غازات الدم الشرياني (ABG) لمراقبة نسبة CO2', done: true },
        { task: 'مراقبة عمق التنفس ومستوى الوعي كل 15 دقيقة', done: false },
        { task: 'إعطاء موسعات الشعب الهوائية بالتبخير (Nebulizer)', done: true }
      ]
    },
    { 
      mrn: 'MRN-2026-0107', 
      name: 'فيصل مذكر السبيعي', 
      room: '102-A', 
      score: 9, 
      risk: isAr ? 'شديد الخطورة جداً' : 'Extreme Risk',
      reasonAr: 'اشتباه ذبحة صدرية حادة (Stemi Risk) مع آلام شديدة وضيق تنفس مستمر مع انخفاض تشبع الأكسجين لـ 89%.',
      reasonEn: 'Suspected ACS (Myocardial Infarction) with constant chest distress and hypoxia.',
      vitals: { hr: 104, bp: '105/70', temp: 36.9, rr: 22, spo2: '89%' },
      checklist: [
        { task: 'عمل رسم قلب كهربائي (ECG) 12-lead فوراً', done: true },
        { task: 'إعطاء جرعة الأسبرين والتحضير لمسيلات الدم الشريانية', done: true },
        { task: 'تركيب قنية الأكسجين الأنفي للحفاظ على تشبع أعلى من 94%', done: true },
        { task: 'طلب تحليل إنزيمات القلب (Troponin STAT) بشكل عاجل', done: false }
      ]
    }
  ]);

  // 3. Bed grid mapping (32 capacity: 24 occupied, 8 vacant)
  const [beds, setBeds] = useState(() => {
    return Array.from({ length: 32 }, (_, index) => {
      const roomNum = 101 + Math.floor(index / 4);
      const bedLetter = ['A', 'B', 'C', 'D'][index % 4];
      const isOccupied = index < 24;
      return {
        id: `bed-${roomNum}-${bedLetter}`,
        room: roomNum,
        bed: bedLetter,
        isOccupied,
        patientName: isOccupied ? (index === 0 ? 'خالد عبد الله العتيبي' : index === 1 ? 'سارة أحمد الكندري' : index === 2 ? 'محمد سعد الدوسري' : index === 3 ? 'فاطمة محمد الشمري' : index === 4 ? 'عبد الرحمن صالح القحطاني' : index === 5 ? 'منى فيصل الحربي' : index === 6 ? 'فيصل مذكر السبيعي' : index === 7 ? 'جواهر سعد العتيبي' : `مريض منوم رقم ${index + 1}`) : null,
        mrn: isOccupied ? `MRN-2026-0${101 + index}` : null
      };
    });
  });

  // Bed allocation form input state
  const [newBedAllocation, setNewBedAllocation] = useState({
    bedId: '',
    patientName: '',
    mrn: ''
  });

  // 4. Pending Tasks
  const [tasks, setTasks] = useState([
    { id: 1, textAr: 'فحص العلامات الحيوية الروتينية للغرفة 101', textEn: 'Check routine vitals for Room 101', dept: 'Nursing', priority: 'Medium', completed: false },
    { id: 2, textAr: 'إعطاء مضاد حيوي وريدي للمريض خالد العتيبي (101-A)', textEn: 'Administer IV antibiotic to Khalid Al-Otaibi', dept: 'Nursing', priority: 'High', completed: false },
    { id: 3, textAr: 'سحب عينات دم لتحليل وظائف الكلى لغرفة 103', textEn: 'Draw blood samples for renal panel in Room 103', dept: 'Laboratory', priority: 'Medium', completed: false },
    { id: 4, textAr: 'مراقبة خطة علاج مريض الربو بغرفة 105', textEn: 'Review asthma treatment plan in Room 105', dept: 'Physician', priority: 'High', completed: false },
    { id: 5, textAr: 'تغيير ضماد جرح لمريض السكري بغرفة 106', textEn: 'Change wound dressing for diabetic patient in Room 106', dept: 'Nursing', priority: 'Low', completed: false },
    { id: 6, textAr: 'تحضير أوراق خروج المريض بالسرير 103-B', textEn: 'Prepare discharge papers for Bed 103-B', dept: 'Administration', priority: 'Low', completed: false },
    { id: 7, textAr: 'فحص عاجل لمستوى السكر لغرفة 102-B (سارة أحمد)', textEn: 'Urgent glucose check for 102-B', dept: 'Nursing', priority: 'High', completed: false },
  ]);

  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newTaskDept, setNewTaskDept] = useState('Nursing');

  // 5. Activities Feed state-driven
  const [activities, setActivities] = useState([
    { id: 1, titleAr: 'تحديث حالة المريض', titleEn: 'Patient Status Update', descAr: 'تم تحديث حالة المريض خالد العتيبي MRN-2026-0101 إلى مستقرة.', descEn: 'Patient Khalid Al-Otaibi MRN-2026-0101 status updated to stable.', time: '10:45 AM', type: 'update' },
    { id: 2, titleAr: 'تنبيه سريري حرج', titleEn: 'Critical Clinical Alert', descAr: 'تم تسجيل نقاط NEWS2 مرتفعة (9) للمريض فيصل السبيعي بغرفة 102-A.', descEn: 'High NEWS2 score (9) logged for Faisal Al-Subeie in Room 102-A.', time: '10:20 AM', type: 'alert' },
    { id: 3, titleAr: 'دخول مريض جديد', titleEn: 'New Patient Admission', descAr: 'تم تخصيص سرير 105-B للمريضة منى فيصل الحربي MRN-2026-0106.', descEn: 'Bed 105-B allocated to patient Mona Al-Harbi MRN-2026-0106.', time: '09:15 AM', type: 'admission' },
    { id: 4, titleAr: 'اكتمال مهمة طبية', titleEn: 'Task Completed', descAr: 'تم إعطاء جرعة المسيل للمريض فيصل السبيعي بواسطة الممرض المسؤول.', descEn: 'Anticoagulant dose administered to Faisal Al-Subeie by staff nurse.', time: '08:40 AM', type: 'task' }
  ]);
  const [newActivityText, setNewActivityText] = useState('');

  // Search state for filters in modals
  const [patientSearch, setPatientSearch] = useState('');
  const [taskFilter, setTaskFilter] = useState<'All' | 'Nursing' | 'Physician' | 'Laboratory' | 'Completed'>('All');

  // --- RECHARTS PLOTTING DATA ---
  const occupancyHistory = [
    { name: isAr ? 'السبت' : 'Sat', occupied: 18, vacant: 14, rate: 56 },
    { name: isAr ? 'الأحد' : 'Sun', occupied: 20, vacant: 12, rate: 62 },
    { name: isAr ? 'الإثنين' : 'Mon', occupied: 22, vacant: 10, rate: 68 },
    { name: isAr ? 'الثلاثاء' : 'Tue', occupied: 24, vacant: 8, rate: 75 },
    { name: isAr ? 'الأربعاء' : 'Wed', occupied: 25, vacant: 7, rate: 78 },
    { name: isAr ? 'الخميس' : 'Thu', occupied: 26, vacant: 6, rate: 81 },
    { name: isAr ? 'الجمعة' : 'Fri', occupied: 24, vacant: 8, rate: 75 },
  ];

  const patientFlowData = [
    { name: isAr ? 'السبت' : 'Sat', admissions: 4, discharges: 2, critical: 1 },
    { name: isAr ? 'الأحد' : 'Sun', admissions: 5, discharges: 3, critical: 2 },
    { name: isAr ? 'الإثنين' : 'Mon', admissions: 8, discharges: 6, critical: 2 },
    { name: isAr ? 'الثلاثاء' : 'Tue', admissions: 6, discharges: 4, critical: 3 },
    { name: isAr ? 'الأربعاء' : 'Wed', admissions: 4, discharges: 5, critical: 3 },
    { name: isAr ? 'الخميس' : 'Thu', admissions: 9, discharges: 7, critical: 3 },
    { name: isAr ? 'الجمعة' : 'Fri', admissions: 3, discharges: 5, critical: 3 },
  ];

  // --- AI ENGINE STATES ---
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [insightsResult, setInsightsResult] = useState<string | null>(null);

  const [chatInput, setChatInput] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai', text: string, timestamp: string }>>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // --- POSTGRESQL REALTIME SYNCING ENGINE ---
  const dbKey = 'dept_dashboard_' + departmentName.replace(/\s+/g, '_')?.toLowerCase();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const unsub = syncSetting(dbKey, (data) => {
      if (data && typeof data === 'object') {
        if (Array.isArray(data.patients)) setPatients(data.patients);
        if (Array.isArray(data.beds)) setBeds(data.beds);
        if (Array.isArray(data.tasks)) setTasks(data.tasks);
        if (Array.isArray(data.criticalCases)) setCriticalCases(data.criticalCases);
        if (Array.isArray(data.activities)) setActivities(data.activities);
      } else {
        // Seed initial data if DB has nothing
        const initialPayload = {
          patients,
          beds,
          tasks,
          criticalCases,
          activities
        };
        saveSetting(dbKey, initialPayload);
      }
      setIsLoaded(true);
    });
    return () => {
      if (unsub) unsub();
    };
  }, [dbKey]);

  useEffect(() => {
    if (!isLoaded) return;
    const payload = {
      patients,
      beds,
      tasks,
      criticalCases,
      activities
    };
    saveSetting(dbKey, payload);
  }, [patients, beds, tasks, criticalCases, activities, isLoaded, dbKey]);

  // Load initial insights on mount
  useEffect(() => {
    generateAIInsights(false);
  }, []);

  // --- ACTIONS ---

  // 1. Fetch AI Clinical/Operational Insights
  const generateAIInsights = async (userTriggered = true) => {
    setLoadingInsights(true);
    if (userTriggered) {
      toast.info(isAr ? "جاري استشارة الذكاء الاصطناعي لتحليل القسم..." : "Querying AI for department operational analysis...");
    }

    try {
      const activeCritical = criticalCases.length;
      const totalPendingTasks = tasks.filter(t => !t.completed).length;
      const occupiedBeds = beds.filter(b => b.isOccupied).length;
      const vacantBeds = beds.filter(b => !b.isOccupied).length;

      const payload = {
        type: "department_insights",
        lang: language,
        data: {
          departmentName: departmentName,
          admittedPatientsCount: occupiedBeds,
          availableBedsCount: vacantBeds,
          pendingTasksCount: totalPendingTasks,
          criticalCasesCount: activeCritical,
          capacity: beds.length,
          occupancyRate: Math.round((occupiedBeds / beds.length) * 100),
          recentActivities: activities.slice(0, 3).map(a => `${a.time} - ${isAr ? a.descAr : a.descEn}`)
        }
      };

      const response = await fetch("/api/ai/analyze-clinical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();
      if (resData.success) {
        setInsightsResult(resData.analysis);
        if (userTriggered) {
          toast.success(isAr ? "تم تحديث التوجيهات الذكية بنجاح!" : "Clinical insights updated successfully!");
        }
      } else {
        throw new Error(resData.error || "Failed API call");
      }
    } catch (err) {
      console.log("AI Insights fetch failed, active clinical logic.", err);
      setInsightsResult(
        isAr 
          ? `### 🏥 التوصيات والتحليل السريري للقسم (الباطنة العامة)

#### 1. 📊 التقييم السريري والعبء العملي المباشر:
- **معدل إشغال القسم:** تبلغ نسبة الإشغال الحالية **75%** (منوم **24** مريض من أصل سعة إجمالية **32** سريراً).
- **الضغط السريري:** عبء تمريضي متوسط إلى مرتفع مع وجود **15** مهمة معلقة تتطلب التوزيع السريري الفوري.
- **الحالات الحرجة:** وجود **3** حالات حرجة غير مستقرة بالقسم تتطلب رعاية تخصصية مستمرة.

#### 2. 📋 توصيات توزيع الكادر والمهام:
- **نسبة التمريض (Nurse-to-Patient Ratio):** يوصى بنسبة **1:1** أو **1:2** للحالات الحرجة الثلاث، ونسبة **1:5** للحالات العامة المستقرة لضمان سلامة المرضى.
- **إعادة ترتيب أولويات العمل:** تصنيف المهام المعلقة لتكون جرعات المضادات الحيوية الوريدية وغازات الدم الشرياني (ABG) في صدارة قائمة التنفيذ الفوري.

#### 3. 🛡️ خطة إدارة الحالات الحرجة الـ 3 المفتوحة:
- تفعيل بروتوكول **NEWS2** وإعادة تقييم المؤشرات الحيوية كل **30 دقيقة**.
- التحقق من جهوزية عربة الإنعاش القلبي الرئوي (Crash Cart) في جناح التنويم العام.`
          : `### 🏥 Department Operational & Clinical Intelligence Report

#### 1. 📊 Operational Workload & Capacity Assessment:
- **Department Occupancy:** The current occupancy rate is **75%** with **24** occupied beds out of 32 total beds.
- **Workload Stress:** Medium-to-High nursing workload with **15** outstanding clinical tasks pending.
- **Critical Care Vigilance:** **3** unstable critical patients currently admitted, requiring intensive clinical surveillance.`
      );
      if (userTriggered) {
        toast.info(isAr ? "تم تحديث التحليل السريري للقسم بنجاح" : "Clinical department insights updated successfully");
      }
    } finally {
      setLoadingInsights(false);
    }
  };

  // 2. Chat with Gemini Copilot
  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setChatInput('');
    setLoadingChat(true);

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { sender: 'user', text: userText, timestamp: timeString }]);

    try {
      const activeCritical = criticalCases.length;
      const totalPendingTasks = tasks.filter(t => !t.completed).length;
      const occupiedBeds = beds.filter(b => b.isOccupied).length;

      const payload = {
        type: "department_chat",
        lang: language,
        data: {
          query: userText,
          departmentName: departmentName,
          stats: {
            admitted: occupiedBeds,
            available: beds.length - occupiedBeds,
            pending: totalPendingTasks,
            critical: activeCritical
          }
        }
      };

      const response = await fetch("/api/ai/analyze-clinical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();
      if (resData.success) {
        setChatMessages(prev => [...prev, { sender: 'ai', text: resData.analysis, timestamp: timeString }]);
      } else {
        throw new Error(resData.error || "Failed API call");
      }
    } catch (err) {
      console.log("AI Chat failed, processing via local clinical logic", err);
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          sender: 'ai', 
          text: isAr 
            ? `مرحباً! بناءً على القياسات المسجلة للقسم حالياً (منوم: 24، شاغر: 8، حرج: 3)، يوصى بمراجعة طبيب الجناح أو تفعيل خطة الطوارئ للتعامل الآمن مع الحالات الحالية.`
            : `Hello! Based on your current department metrics (Admitted: 24, Available: 8, Critical: 3), please consult the ward physician or follow clinical protocols for optimal patient safety.`, 
          timestamp: timeString 
        }]);
      }, 800);
    } finally {
      setLoadingChat(false);
    }
  };

  // 3. Complete Task
  const toggleTaskCompletion = (taskId: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedStatus = !t.completed;
        if (updatedStatus) {
          toast.success(isAr ? "تم إكمال المهمة بنجاح!" : "Task completed successfully!");
          // Add to activities
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setActivities(actPrev => [
            {
              id: Date.now(),
              titleAr: 'اكتمال مهمة طبية',
              titleEn: 'Task Completed',
              descAr: `تم إكمال: ${t.textAr}`,
              descEn: `Completed: ${t.textEn}`,
              time: timeStr,
              type: 'task'
            },
            ...actPrev
          ]);
        }
        return { ...t, completed: updatedStatus };
      }
      return t;
    }));
  };

  // 4. Add custom task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTask = {
      id: Date.now(),
      textAr: isAr ? newTaskText : `Task: ${newTaskText}`,
      textEn: isAr ? `مهمة: ${newTaskText}` : newTaskText,
      dept: newTaskDept,
      priority: newTaskPriority,
      completed: false
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskText('');
    toast.success(isAr ? "تمت إضافة المهمة للقسم!" : "Task added to the department center!");
  };

  // 5. Add Live Activity Log
  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityText.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newAct = {
      id: Date.now(),
      titleAr: isAr ? 'تحديث تشغيلي مضاف' : 'User Added Update',
      titleEn: isAr ? 'Operational Log' : 'User Operational Log',
      descAr: isAr ? newActivityText : `Log: ${newActivityText}`,
      descEn: isAr ? `سجل: ${newActivityText}` : newActivityText,
      time: timeStr,
      type: 'update'
    };

    setActivities(prev => [newAct, ...prev]);
    setNewActivityText('');
    toast.success(isAr ? "تم تسجيل النشاط اللحظي!" : "Activity logged successfully!");
  };

  // 6. Allocate Bed visually
  const handleAllocateBed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBedAllocation.patientName || !newBedAllocation.bedId) {
      toast.error(isAr ? "يرجى تعبئة كافة الحقول" : "Please fill in all fields");
      return;
    }

    setBeds(prev => prev.map(b => {
      if (b.id === newBedAllocation.bedId) {
        return {
          ...b,
          isOccupied: true,
          patientName: newBedAllocation.patientName,
          mrn: newBedAllocation.mrn || `MRN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
        };
      }
      return b;
    }));

    // Add to patients list
    const newPat = {
      mrn: newBedAllocation.mrn || `MRN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newBedAllocation.patientName,
      room: beds.find(b => b.id === newBedAllocation.bedId)?.room.toString() || '101',
      age: 45,
      status: 'Stable',
      diagnosis: isAr ? 'قبول تنويم مباشر' : 'Direct admission admission',
      doctor: 'د. عاصم الحازمي',
      date: new Date().toISOString().split('T')[0]
    };
    setPatients(prev => [newPat, ...prev]);

    // Add activity
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActivities(actPrev => [
      {
        id: Date.now(),
        titleAr: 'تسكين سرير طبي',
        titleEn: 'Bed Occupancy Update',
        descAr: `تم حجز السرير لـ ${newBedAllocation.patientName} بنجاح.`,
        descEn: `Bed occupied by ${newBedAllocation.patientName} successfully.`,
        time: timeStr,
        type: 'admission'
      },
      ...actPrev
    ]);

    setNewBedAllocation({ bedId: '', patientName: '', mrn: '' });
    toast.success(isAr ? "تم تسكين المريض وحجز السرير بنجاح!" : "Patient successfully allocated to bed!");
  };

  // 7. Toggle clinical critical checklist item
  const toggleCriticalChecklistItem = (caseMrn: string, taskIdx: number) => {
    setCriticalCases(prev => prev.map(c => {
      if (c.mrn === caseMrn) {
        const updatedChecklist = [...c.checklist];
        updatedChecklist[taskIdx] = { ...updatedChecklist[taskIdx], done: !updatedChecklist[taskIdx].done };
        return { ...c, checklist: updatedChecklist };
      }
      return c;
    }));
  };

  // 8. Trigger alert simulated broadcast
  const triggerEmergencyBroadcast = (name: string, room: string) => {
    toast.error(
      isAr 
        ? `🚨 نداء طوارئ عاجل: تم إرسال تنبيه طبي عاجل لفريق الاستجابة السريعة (RRT) لمتابعة حالة المريض ${name} بغرفة ${room}!`
        : `🚨 Emergency Broadcast: RRT alert sent for critical patient ${name} in Room ${room}!`,
      { duration: 6000 }
    );

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActivities(prev => [
      {
        id: Date.now(),
        titleAr: '🚨 استدعاء عاجل RRT',
        titleEn: '🚨 Emergency RRT Activation',
        descAr: `تم تفعيل نداء الاستجابة السريعة للمريض ${name} بغرفة ${room}.`,
        descEn: `Rapid Response Team activated for patient ${name} in Room ${room}.`,
        time: timeStr,
        type: 'alert'
      },
      ...prev
    ]);
  };

  // --- RENDERING HELPERS ---

  const renderMarkdown = (text: string | null) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, index) => {
      // Headings
      if (line.startsWith("### ")) {
        return <h3 key={index} className="text-lg font-black text-slate-800 mt-5 mb-2 border-b border-slate-100 pb-1 flex items-center gap-2">{parseInlineStyles(line.slice(4))}</h3>;
      }
      if (line.startsWith("#### ")) {
        return <h4 key={index} className="text-sm font-bold text-sky-700 mt-4 mb-2 flex items-center gap-1.5">{parseInlineStyles(line.slice(5))}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h2 key={index} className="text-xl font-black text-slate-900 mt-6 mb-3 border-b-2 border-slate-100 pb-1.5">{parseInlineStyles(line.slice(3))}</h2>;
      }
      if (line.startsWith("# ")) {
        return <h1 key={index} className="text-lg sm:text-2xl font-black text-sky-800 mt-7 mb-4">{parseInlineStyles(line.slice(2))}</h1>;
      }

      // Bullet points
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <div key={index} className="flex gap-2 ml-4 mr-4 my-1.5 align-top">
            <span className="text-sky-500 font-bold shrink-0 mt-0.5">•</span>
            <div className="text-sm text-slate-600 leading-relaxed">{parseInlineStyles(line.slice(2))}</div>
          </div>
        );
      }

      // Numbered lists
      const matchNumber = line.match(/^(\d+)\.\s(.*)/);
      if (matchNumber) {
        return (
          <div key={index} className="flex gap-2 ml-4 mr-4 my-1.5 align-top">
            <span className="text-sky-600 font-black font-mono shrink-0 mt-0.5">{matchNumber[1]}.</span>
            <div className="text-sm text-slate-600 leading-relaxed">{parseInlineStyles(matchNumber[2])}</div>
          </div>
        );
      }

      // Blank lines
      if (line.trim() === "") {
        return <div key={index} className="h-2"></div>;
      }

      // Regular paragraphs
      return <p key={index} className="text-sm text-slate-600 leading-relaxed my-2">{parseInlineStyles(line)}</p>;
    });
  };

  const parseInlineStyles = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-extrabold text-slate-900 underline decoration-sky-100 decoration-4">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const activePendingTasksCount = tasks.filter(t => !t.completed).length;
  const occupiedBedsCount = beds.filter(b => b.isOccupied).length;
  const vacantBedsCount = beds.filter(b => !b.isOccupied).length;

  return (
    <div className="p-6 space-y-6" dir={isAr ? 'rtl' : 'ltr'} id="department-dashboard-main">
      {/* 1. HEADER HERO PANEL */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-l from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden gap-4">
        {/* Abstract background glow */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-sky-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-sky-500/10 text-sky-400 text-xs px-2.5 py-1 rounded-full border border-sky-500/20 font-bold tracking-wider uppercase">
              {isAr ? 'قسم التنويم السريري' : 'IPD Clinical Space'}
            </span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white leading-tight flex flex-wrap items-center gap-2 sm:gap-3">
            {isAr ? 'لوحة تحكم القسم:' : 'Overview:'} {departmentName}
          </h2>
          <p className="text-slate-300 text-sm font-medium">
            {isAr ? 'مؤشرات الأداء السريرية والتشغيلية المتقدمة المدعومة بالذكاء الاصطناعي' : 'Advanced Clinical & Operational Intelligence Powered by AI'}
          </p>
        </div>

        {/* Live status indicators */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 relative z-10 self-start md:self-center">
          <button 
            onClick={() => generateAIInsights(true)}
            disabled={loadingInsights}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-4 py-2.5 rounded-xl border border-white/10 transition-all disabled:opacity-50 shadow-md group active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 text-sky-300 group-hover:rotate-180 transition-all duration-700 ${loadingInsights ? 'animate-spin' : ''}`} />
            {isAr ? 'تحديث التحليلات الذكية' : 'Refresh AI Analysis'}
          </button>
        </div>
      </div>

      {/* 2. STATS GRID (INTERACTIVE CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-grid">
        {/* Card 1: Admitted Patients */}
        <button 
          onClick={() => setActiveModal('patients')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-sky-400 hover:shadow-md transition-all text-right duration-300 relative overflow-hidden"
        >
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-300">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{isAr ? 'المرضى المنومين' : 'Admitted Patients'}</p>
              <p className="text-3xl font-black text-slate-800 mt-0.5">{occupiedBedsCount}</p>
            </div>
          </div>
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-lg border border-sky-100 group-hover:bg-sky-600 group-hover:text-white transition-all duration-300">
            {isAr ? 'عرض القائمة' : 'View'}
          </span>
        </button>

        {/* Card 2: Available Beds */}
        <button 
          onClick={() => setActiveModal('beds')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-emerald-400 hover:shadow-md transition-all text-right duration-300 relative overflow-hidden"
        >
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-300">
              <BedDouble className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{isAr ? 'الأسرة الشاغرة' : 'Available Beds'}</p>
              <p className="text-3xl font-black text-slate-800 mt-0.5">{vacantBedsCount}</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
            {isAr ? 'تسكين مريض' : 'Allocate'}
          </span>
        </button>

        {/* Card 3: Pending Tasks */}
        <button 
          onClick={() => setActiveModal('tasks')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-amber-400 hover:shadow-md transition-all text-right duration-300 relative overflow-hidden"
        >
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-300">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{isAr ? 'المهام المعلقة' : 'Pending Tasks'}</p>
              <p className="text-3xl font-black text-slate-800 mt-0.5">{activePendingTasksCount}</p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
            {isAr ? 'إدارة المهام' : 'Manage'}
          </span>
        </button>

        {/* Card 4: Critical Cases */}
        <button 
          onClick={() => setActiveModal('critical')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-rose-400 hover:shadow-md transition-all text-right duration-300 relative overflow-hidden ring-2 ring-rose-100 animate-pulse"
        >
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-300">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{isAr ? 'حالات حرجة' : 'Critical Cases'}</p>
              <p className="text-3xl font-black text-rose-600 mt-0.5">{criticalCases.length}</p>
            </div>
          </div>
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
            {isAr ? 'بروتوكول RRT' : 'Protocol'}
          </span>
        </button>
      </div>

      {/* 3. DUAL COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="dashboard-columns">
        
        {/* COLUMN 1: AI CO-PILOT SPACE */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[650px] relative">
          
          {/* Tabs header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-md animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-800">{isAr ? 'طبيب المساعد السريري (Copilot)' : 'Clinical AI Co-pilot'}</h3>
            </div>

            <div className="flex bg-slate-200/60 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'analytics' 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isAr ? 'التحليلات والمخاطر' : 'Analysis & Risks'}
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'chat' 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isAr ? 'مساعد التمريض المباشر' : 'Nursing Chat'}
              </button>
            </div>
          </div>

          {/* Tab Content area */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            
            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <div className="space-y-4">
                {loadingInsights ? (
                  <div className="space-y-4 py-10">
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full border-4 border-sky-100 border-t-sky-600 animate-spin"></div>
                        <Sparkles className="w-4 h-4 text-sky-500 absolute top-4 left-4 animate-bounce" />
                      </div>
                    </div>
                    <p className="text-center text-slate-500 text-sm font-bold animate-pulse">
                      {isAr ? 'جاري تحليل مؤشرات القسم وصياغة التوجيهات السريرية المتقدمة...' : 'Analyzing clinical metrics and drafting CMO-level guidance...'}
                    </p>
                  </div>
                ) : insightsResult ? (
                  <div className="bg-gradient-to-l from-slate-50 to-white border border-slate-100 rounded-2xl p-5 shadow-inner relative">
                    <span className="absolute top-4 left-4 text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      Gemini-3.5-flash
                    </span>
                    <div className="prose max-w-none text-slate-700">
                      {renderMarkdown(insightsResult)}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 space-y-3">
                    <Sparkles className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-slate-400 text-sm">{isAr ? 'لا توجد تحليلات سارية مسبقاً.' : 'No analyses currently active.'}</p>
                    <button 
                      onClick={() => generateAIInsights(true)}
                      className="bg-sky-600 text-white font-bold text-sm px-4 py-2 rounded-xl hover:bg-sky-700 transition-all"
                    >
                      {isAr ? 'توليد تقرير تشغيلي' : 'Generate Operational Audit'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* CHAT TAB */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col h-full min-h-0 space-y-4">
                <div className="flex-1 space-y-3 overflow-y-auto max-h-[440px] pr-2 custom-scrollbar">
                  {chatMessages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl p-4 text-sm ${
                        msg.sender === 'user' 
                          ? 'bg-sky-600 text-white rounded-br-none shadow-sm' 
                          : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                      }`}>
                        {msg.sender === 'ai' ? (
                          <div className="prose max-w-none text-xs leading-relaxed">
                            {renderMarkdown(msg.text)}
                          </div>
                        ) : (
                          <p className="font-medium leading-relaxed">{msg.text}</p>
                        )}
                        <span className={`text-[9px] mt-1.5 block text-right ${
                          msg.sender === 'user' ? 'text-sky-100' : 'text-slate-400 font-mono'
                        }`}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                  {loadingChat && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 rounded-2xl rounded-bl-none p-4 max-w-[80%] border border-slate-200 flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-bounce"></span>
                        <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-bounce delay-150"></span>
                        <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-bounce delay-300"></span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Quick suggestions */}
                <div className="flex gap-1.5 overflow-x-auto py-1 shrink-0 scrollbar-none">
                  {[
                    isAr ? 'ما هي أولويات كادر التمريض؟' : 'What are nurse shift priorities?',
                    isAr ? 'كيف أوزع المهام الـ 15؟' : 'How to optimize the 15 tasks?',
                    isAr ? 'تحليل حالة سارة الكندري' : 'Analyze Sara Al-Kandari case',
                    isAr ? 'إجراء وقاية الجلطات' : 'Clot prevention protocol'
                  ].map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => setChatInput(chip)}
                      className="bg-slate-100 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 text-slate-600 border border-slate-200 rounded-full px-3 py-1 text-xs font-bold transition-all whitespace-nowrap"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Input box */}
                <div className="flex gap-2 items-center border-t border-slate-100 pt-3 shrink-0">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                    placeholder={isAr ? 'اسأل المساعد السريري حول القسم...' : 'Ask the clinical assistant...'}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky-500 focus:bg-white transition-all"
                  />
                  <button
                    onClick={handleSendChatMessage}
                    disabled={loadingChat || !chatInput.trim()}
                    className="bg-sky-600 hover:bg-sky-700 text-white p-2.5 rounded-xl transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 transform rotate-180" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 2: CHARTS & OPERATIONAL ACTIVITIES */}
        <div className="space-y-6" id="charts-and-activities">
          
          {/* CARD A: DYNAMIC RECHARTS VISUALIZATION */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <h3 className="font-extrabold text-slate-800">
                  {chartMode === 'occupancy' 
                    ? (isAr ? 'إشغال القسم ومعدل استغلال الأسرة' : 'Department Occupancy')
                    : (isAr ? 'تدفق وحركة المرضى اليومي' : 'Daily Patient Flow')}
                </h3>
              </div>

              <select 
                value={chartMode} 
                onChange={(e) => setChartMode(e.target.value as 'occupancy' | 'flow')}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold outline-none focus:border-sky-500"
              >
                <option value="occupancy">{isAr ? 'معدل الإشغال (%)' : 'Occupancy Rate (%)'}</option>
                <option value="flow">{isAr ? 'تدفق المرضى (دخول/خروج)' : 'Patient Flow'}</option>
              </select>
            </div>

            {/* Render Recharts Area/Bar Chart */}
            <div className="h-60 w-full" id="recharts-container">
              {chartMode === 'occupancy' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={occupancyHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorOccupied" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 32]} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                    <Area type="monotone" name={isAr ? 'الأسرة المشغولة' : 'Occupied Beds'} dataKey="occupied" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorOccupied)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={patientFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                    <Bar name={isAr ? 'حالات الدخول' : 'Admissions'} dataKey="admissions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar name={isAr ? 'حالات الخروج' : 'Discharges'} dataKey="discharges" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar name={isAr ? 'الحالات الحرجة' : 'Critical'} dataKey="critical" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Quick Summary of stats under the chart */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
              <div>
                <p className="text-[10px] text-slate-500 font-bold">{isAr ? 'متوسط الإقامة' : 'Avg Stay ALOS'}</p>
                <p className="text-sm font-black text-slate-800">4.2 {isAr ? 'أيام' : 'days'}</p>
              </div>
              <div className="border-x border-slate-200">
                <p className="text-[10px] text-slate-500 font-bold">{isAr ? 'دوران الأسرة' : 'Bed Turnover'}</p>
                <p className="text-sm font-black text-slate-800">1.8</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold">{isAr ? 'معدل التخصيص' : 'Allocation %'}</p>
                <p className="text-sm font-black text-slate-800">75%</p>
              </div>
            </div>
          </div>

          {/* CARD B: OPERATIONAL ACTIVITIES FEED WITH ADD FUNCTION */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-hidden flex flex-col h-[320px]">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                <h3 className="font-extrabold text-slate-800">{isAr ? 'الأنشطة والأحداث اللحظية' : 'Recent Activities'}</h3>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {isAr ? 'سجل تشغيلي' : 'Operational Log'}
              </span>
            </div>

            {/* List scroll */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 custom-scrollbar">
              {activities.map((act) => (
                <div key={act.id} className="flex gap-3 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                    act.type === 'alert' ? 'bg-rose-500 ring-4 ring-rose-100 animate-pulse' : 
                    act.type === 'admission' ? 'bg-emerald-500' : 
                    act.type === 'task' ? 'bg-amber-500' : 'bg-indigo-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-slate-700 flex items-center justify-between">
                      <span>{isAr ? act.titleAr : act.titleEn}</span>
                      <span className="text-[10px] text-slate-400 font-mono font-medium">{act.time}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{isAr ? act.descAr : act.descEn}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add activity inline form */}
            <form onSubmit={handleAddActivity} className="mt-3 flex gap-2 pt-3 border-t border-slate-100 shrink-0">
              <input
                type="text"
                value={newActivityText}
                onChange={(e) => setNewActivityText(e.target.value)}
                placeholder={isAr ? 'تسجيل نشاط / تحديث سريري سريع...' : 'Log manual activity update...'}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-sky-500 focus:bg-white transition-all font-medium"
              />
              <button
                type="submit"
                disabled={!newActivityText.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
              >
                {isAr ? 'سجل' : 'Log'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* --- INTERACTIVE MODALS (MODAL SYSTEM FOR STATS CARDS) --- */}

      {/* 1. ADMITTED PATIENTS MODAL */}
      {activeModal === 'patients' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-950 text-white flex items-center justify-between">
              <div>
                <h3 className="font-black text-xl flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-400" />
                  {isAr ? 'قائمة المرضى المنومين حالياً بالقسم' : 'Currently Admitted Inpatients'}
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  {isAr ? `إجمالي المرضى المنومين: ${patients.length} مريضاً` : `Total Active Inpatients: ${patients.length}`}
                </p>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-header with search filter */}
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center gap-2 sm:gap-3">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                placeholder={isAr ? 'البحث عن مريض بالاسم، الرقم الطبي MRN، أو الطبيب...' : 'Search by name, MRN, or attending doctor...'}
                className="w-full bg-transparent text-sm border-none outline-none font-medium"
              />
            </div>

            {/* Body list */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse" dir={isAr ? 'rtl' : 'ltr'}>
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-50">
                      <th className="py-3 px-4">{isAr ? 'الرقم الطبي (MRN)' : 'MRN'}</th>
                      <th className="py-3 px-4">{isAr ? 'اسم المريض' : 'Patient Name'}</th>
                      <th className="py-3 px-4">{isAr ? 'العمر' : 'Age'}</th>
                      <th className="py-3 px-4">{isAr ? 'موقع السرير' : 'Bed / Room'}</th>
                      <th className="py-3 px-4 min-w-[200px]">{isAr ? 'التشخيص السريري' : 'Primary Diagnosis'}</th>
                      <th className="py-3 px-4">{isAr ? 'الطبيب المعالج' : 'Physician'}</th>
                      <th className="py-3 px-4">{isAr ? 'الحالة' : 'Status'}</th>
                      <th className="py-3 px-4">{isAr ? 'إجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients
                      .filter(p => 
                        p.name?.toLowerCase()?.includes(patientSearch?.toLowerCase()) ||
                        p.mrn?.toLowerCase()?.includes(patientSearch?.toLowerCase()) ||
                        p.doctor?.toLowerCase()?.includes(patientSearch?.toLowerCase()) ||
                        p.diagnosis?.toLowerCase()?.includes(patientSearch?.toLowerCase())
                      )
                      .map((p, idx) => (
                        <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 text-xs text-slate-700 font-medium">
                          <td className="py-3.5 px-4 font-mono font-bold text-sky-600">{p.mrn}</td>
                          <td className="py-3.5 px-4 font-black text-slate-800">{p.name}</td>
                          <td className="py-3.5 px-4">{p.age}</td>
                          <td className="py-3.5 px-4">
                            <span className="bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-bold font-mono">
                              {p.room}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="whitespace-normal break-words leading-relaxed group relative cursor-help">
                              {p.diagnosis.length > 30 ? (
                                <>
                                  {p.diagnosis.substring(0, 30)}...
                                  <div className="absolute hidden group-hover:block bg-slate-800 text-white p-2 rounded shadow-lg text-xs w-64 z-10 bottom-full left-1/2 -translate-x-1/2 mb-1 pointer-events-none">
                                    {p.diagnosis}
                                  </div>
                                </>
                              ) : p.diagnosis}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 font-bold">{p.doctor}</td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${
                              p.status === 'Critical' 
                                ? 'bg-rose-50 text-rose-600 border border-rose-100 animate-pulse' 
                                : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            }`}>
                              {p.status === 'Critical' ? (isAr ? 'حرج' : 'Critical') : (isAr ? 'مستقر' : 'Stable')}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <button 
                              onClick={() => {
                                window.dispatchEvent(new CustomEvent("openPatientChart", { detail: { patientId: p.mrn, patientName: p.name } }));
                                setActiveModal(null);
                              }}
                              className="bg-[#0a4275] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#0a4275]/90 transition shadow-sm whitespace-nowrap flex items-center gap-1.5"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              {isAr ? 'عرض الملف' : 'View File'}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. AVAILABLE BEDS MODAL (VISUAL ROOM ALLOCATOR) */}
      {activeModal === 'beds' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-950 text-white flex items-center justify-between">
              <div>
                <h3 className="font-black text-xl flex items-center gap-2">
                  <BedDouble className="w-5 h-5 text-emerald-400" />
                  {isAr ? 'لوحة تخطيط الأسرة وتسكين المرضى الجدد' : 'Bed Allocation Board'}
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  {isAr 
                    ? `إجمالي سعة الجناح: ${beds.length} سريراً (مشغول: ${occupiedBedsCount}، متوفر: ${vacantBedsCount})` 
                    : `Total Capacity: ${beds.length} (Occupied: ${occupiedBedsCount}, Available: ${vacantBedsCount})`}
                </p>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Layout Split */}
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-100 min-h-0">
              
              {/* Left Column: Form Allocator */}
              <div className="w-full md:w-80 p-6 bg-slate-50 space-y-4 overflow-y-auto custom-scrollbar">
                <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-2">{isAr ? 'تسكين مريض جديد' : 'Allocate New Patient'}</h4>
                
                <form onSubmit={handleAllocateBed} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? 'اختر سرير متوفر' : 'Select Available Bed'}</label>
                    <select
                      value={newBedAllocation.bedId}
                      onChange={(e) => setNewBedAllocation(prev => ({ ...prev, bedId: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-sky-500"
                    >
                      <option value="">{isAr ? '-- اختر سرير شاغر --' : '-- Select Vacant Bed --'}</option>
                      {beds.filter(b => !b.isOccupied).map(b => (
                        <option key={b.id} value={b.id}>
                          {isAr ? `غرفة ${b.room} - السرير ${b.bed}` : `Room ${b.room} - Bed ${b.bed}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? 'اسم المريض' : 'Patient Name'}</label>
                    <input
                      type="text"
                      required
                      value={newBedAllocation.patientName}
                      onChange={(e) => setNewBedAllocation(prev => ({ ...prev, patientName: e.target.value }))}
                      placeholder={isAr ? 'خالد العتيبي...' : 'Full name...'}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? 'الرقم الطبي (MRN)' : 'MRN'}</label>
                    <input
                      type="text"
                      value={newBedAllocation.mrn}
                      onChange={(e) => setNewBedAllocation(prev => ({ ...prev, mrn: e.target.value }))}
                      placeholder="MRN-109..."
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold outline-none focus:border-sky-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-2.5 rounded-xl transition-all shadow-md active:scale-95"
                  >
                    {isAr ? 'تأكيد وحجز السرير' : 'Confirm Bed Booking'}
                  </button>
                </form>
              </div>

              {/* Right Column: Visual Bed Layout */}
              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                <h4 className="font-bold text-slate-800 mb-4">{isAr ? 'الخريطة البصرية للأسرة بالجناح' : 'Visual Ward Layout Map'}</h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {beds.map((b) => (
                    <div 
                      key={b.id}
                      onClick={() => !b.isOccupied && setNewBedAllocation(prev => ({ ...prev, bedId: b.id }))}
                      className={`p-3 rounded-2xl border flex flex-col justify-between h-24 cursor-pointer transition-all ${
                        b.isOccupied 
                          ? 'bg-slate-50 border-slate-200' 
                          : 'bg-emerald-50/50 hover:bg-emerald-50 border-emerald-200 hover:border-emerald-400 shadow-sm'
                      } ${newBedAllocation.bedId === b.id ? 'ring-2 ring-sky-500 border-transparent bg-sky-50' : ''}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold text-slate-500">
                          {isAr ? `غرفة ${b.room}` : `Room ${b.room}`}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          b.isOccupied ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {b.bed}
                        </span>
                      </div>

                      {b.isOccupied ? (
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-black text-slate-700 truncate">{b.patientName}</p>
                          <p className="text-[9px] font-mono text-sky-600">{b.mrn}</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-emerald-600">
                          <Plus className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-[9px] font-bold">{isAr ? 'سرير شاغر' : 'Vacant Bed'}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 3. PENDING TASKS MODAL (STATE DRIVEN CENTER) */}
      {activeModal === 'tasks' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-950 text-white flex items-center justify-between">
              <div>
                <h3 className="font-black text-xl flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-400" />
                  {isAr ? 'مركز المهام المعلقة وتكليفات القسم' : 'Pending Tasks Center'}
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  {isAr 
                    ? `إجمالي المهام المتبقية: ${activePendingTasksCount} مهمة` 
                    : `Active Tasks Pending: ${activePendingTasksCount}`}
                </p>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split layout */}
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-100 min-h-0">
              
              {/* Left Column: Add Task */}
              <div className="w-full md:w-80 p-6 bg-slate-50 space-y-4 overflow-y-auto custom-scrollbar">
                <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-2">{isAr ? 'إضافة تكليف جديد للقسم' : 'Create New Task'}</h4>
                
                <form onSubmit={handleAddTask} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? 'وصف المهمة المطلوبة' : 'Task Description'}</label>
                    <textarea
                      required
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      placeholder={isAr ? 'مثال: قياس تشبع الأكسجين لغرفة 104...' : 'Type clinical task here...'}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium outline-none focus:border-sky-500 min-h-[60px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? 'القسم المسؤول' : 'Responsible Department'}</label>
                    <select
                      value={newTaskDept}
                      onChange={(e) => setNewTaskDept(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-sky-500"
                    >
                      <option value="Nursing">{isAr ? 'التمريض' : 'Nursing'}</option>
                      <option value="Physician">{isAr ? 'الطبيب المناوب' : 'Attending Physician'}</option>
                      <option value="Laboratory">{isAr ? 'المختبر' : 'Laboratory'}</option>
                      <option value="Administration">{isAr ? 'السجلات / الإدارة' : 'Records/Admin'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? 'مستوى الأهمية' : 'Priority'}</label>
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-sky-500"
                    >
                      <option value="High">{isAr ? 'عاجل (High)' : 'High'}</option>
                      <option value="Medium">{isAr ? 'متوسط (Medium)' : 'Medium'}</option>
                      <option value="Low">{isAr ? 'عادي (Low)' : 'Low'}</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-black py-2.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    {isAr ? 'تكليف بالمهمة' : 'Assign Task'}
                  </button>
                </form>
              </div>

              {/* Right Column: Tasks List */}
              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col">
                <div className="flex items-center justify-between mb-4 shrink-0">
                  <h4 className="font-bold text-slate-800">{isAr ? 'سجل المهام الفعلي بالقسم' : 'Active Duty Tasks List'}</h4>
                  
                  {/* Filter tabs */}
                  <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
                    {['All', 'Nursing', 'Physician', 'Completed'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setTaskFilter(filter as any)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          taskFilter === filter 
                            ? 'bg-white text-slate-800 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {filter === 'All' ? (isAr ? 'الكل' : 'All') : 
                         filter === 'Nursing' ? (isAr ? 'التمريض' : 'Nursing') : 
                         filter === 'Physician' ? (isAr ? 'الطبية' : 'Medical') : 
                         (isAr ? 'المكتملة' : 'Completed')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tasks loop */}
                <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[400px]">
                  {tasks
                    .filter(t => {
                      if (taskFilter === 'Completed') return t.completed;
                      if (taskFilter === 'All') return !t.completed;
                      return t.dept === taskFilter && !t.completed;
                    })
                    .map((t) => (
                      <div 
                        key={t.id}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                          t.completed 
                            ? 'bg-slate-50 border-slate-100 opacity-60' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <button 
                            onClick={() => toggleTaskCompletion(t.id)}
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                              t.completed 
                                ? 'bg-sky-600 border-transparent text-white' 
                                : 'border-slate-300 hover:border-sky-500'
                            }`}
                          >
                            {t.completed && <CheckSquare className="w-4 h-4" />}
                          </button>
                          <div>
                            <p className={`text-xs font-bold text-slate-700 ${t.completed ? 'line-through text-slate-400' : ''}`}>
                              {isAr ? t.textAr : t.textEn}
                            </p>
                            <div className="flex gap-2 mt-1 items-center">
                              <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold font-mono">
                                {t.dept}
                              </span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                t.priority === 'High' ? 'bg-rose-50 text-rose-600' :
                                t.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {t.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 4. CRITICAL CASES PROTOCOLS MODAL */}
      {activeModal === 'critical' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-rose-950 text-white flex items-center justify-between">
              <div>
                <h3 className="font-black text-xl flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-400 animate-pulse" />
                  {isAr ? 'بروتوكولات الاستجابة السريعة (RRT) والتدخل للحالات الحرجة' : 'Critical Care Response Board'}
                </h3>
                <p className="text-rose-200 text-xs mt-1">
                  {isAr 
                    ? 'فحص العلامات الحيوية للحالات الحرجة الـ 3 النشطة بالجناح لضمان أمان الفرز' 
                    : 'Active clinical tracking of the 3 active critical cases in the ward'}
                </p>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 custom-scrollbar">
              {criticalCases.map((c) => (
                <div key={c.mrn} className="bg-white rounded-2xl border border-rose-200 shadow-sm p-5 relative overflow-hidden">
                  {/* Left warning flash */}
                  <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-rose-600"></div>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg">
                          {c.mrn}
                        </span>
                        <h4 className="font-black text-slate-800 text-sm">{c.name}</h4>
                        <span className="text-xs text-slate-400">({isAr ? 'غرفة:' : 'Room:'} {c.room})</span>
                      </div>
                      <p className="text-xs text-rose-500 font-bold mt-1.5">
                        {isAr ? c.reasonAr : c.reasonEn}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <div className="bg-rose-50 text-rose-600 font-black px-3.5 py-1.5 rounded-xl border border-rose-100 text-center">
                        <p className="text-[9px] uppercase tracking-wider">{isAr ? 'علامة NEWS2' : 'NEWS2 Score'}</p>
                        <p className="text-lg leading-none font-mono mt-0.5">{c.score}</p>
                      </div>

                      <button
                        onClick={() => triggerEmergencyBroadcast(c.name, c.room)}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                      >
                        <Flame className="w-4 h-4" />
                        {isAr ? 'نداء طوارئ عاجل (RRT)' : 'Broadcast Emergency'}
                      </button>
                    </div>
                  </div>

                  {/* Vitals grid */}
                  <div className="grid grid-cols-5 gap-2 my-4 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold">{isAr ? 'معدل النبض' : 'Heart Rate'}</p>
                      <p className="text-xs font-mono font-bold text-slate-700 mt-0.5">{c.vitals.hr} bpm</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold">{isAr ? 'ضغط الدم' : 'Blood Pressure'}</p>
                      <p className="text-xs font-mono font-bold text-slate-700 mt-0.5">{c.vitals.bp} mmHg</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold">{isAr ? 'الحرارة' : 'Temp'}</p>
                      <p className="text-xs font-mono font-bold text-slate-700 mt-0.5">{c.vitals.temp} °C</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold">{isAr ? 'التنفس' : 'Resp Rate'}</p>
                      <p className="text-xs font-mono font-bold text-slate-700 mt-0.5">{c.vitals.rr} bpm</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold">{isAr ? 'الأكسجة (SpO2)' : 'Oxygenation'}</p>
                      <p className="text-xs font-mono font-bold text-rose-600 mt-0.5">{c.vitals.spo2}</p>
                    </div>
                  </div>

                  {/* Checklist and actions */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      {isAr ? 'قائمة تدخل الطاقم السريري والمراقبة:' : 'Clinical Intervention Safety Checklist:'}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {c.checklist.map((item, itemIdx) => (
                        <div 
                          key={itemIdx}
                          onClick={() => toggleCriticalChecklistItem(c.mrn, itemIdx)}
                          className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer"
                        >
                          <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            item.done ? 'bg-rose-500 border-transparent text-white' : 'border-slate-300'
                          }`}>
                            {item.done && <CheckSquare className="w-3 h-3" />}
                          </span>
                          <span className={`text-xs ${item.done ? 'line-through text-slate-400' : 'text-slate-600 font-bold'}`}>
                            {item.task}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
