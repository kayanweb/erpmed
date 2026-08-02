import React, { useState, useMemo } from "react";
import { 
  ClipboardList, CheckCircle2, Clock, AlertTriangle, AlertCircle, 
  Activity, Filter, Search, Plus, User, Users, Building2, Calendar, 
  Layers, ChevronRight, ChevronLeft, Flame, ShieldAlert, Bell, 
  BarChart3, TrendingUp, FileText, History, Settings, RefreshCw, 
  Sparkles, Paperclip, Send, Eye, Check, X, Lock, Zap, Play, 
  RotateCcw, SlidersHorizontal, Stethoscope, TestTube, ArrowUpRight,
  ListTodo, UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHIS } from "../context/HISContext";
import { GlobalEntityLink } from "./GlobalEntityLink";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
  onClose?: () => void;
}

export default function EnterpriseTaskManager({ language, onClose }: Props) {
  const isAr = language === "ar";
  const { patients = [], departments = [], currentUser } = useHIS();

  const [activeTab, setActiveTab] = useState("my_tasks");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  // Dedicated Task Modal
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    title: "",
    priority: "normal",
    category: "clinical",
    department: currentUser?.departmentId || "LIS",
  });

  // Mock initial tasks, but designed to look like a robust state array
  const [tasks, setTasks] = useState([
    { id: "TSK-801", title: isAr ? "مراجعة نتائج حرجة (LIS)" : "Review Critical Lab Results", priority: "critical", category: "clinical", status: "pending", assignee: currentUser?.id || "doc-1", department: "LIS", patientId: patients[0]?.id || null, dueDate: new Date().toISOString() },
    { id: "TSK-802", title: isAr ? "صيانة دورية لجهاز الرنين" : "MRI Preventative Maintenance", priority: "high", category: "operational", status: "in_progress", assignee: "bio-1", department: "RIS", patientId: null, dueDate: new Date().toISOString() },
    { id: "TSK-803", title: isAr ? "اعتماد طلب إجازة" : "Approve Leave Request", priority: "normal", category: "administrative", status: "pending", assignee: currentUser?.id || "doc-1", department: "HR", patientId: null, dueDate: new Date().toISOString() },
    { id: "TSK-804", title: isAr ? "نقل مريض للرعاية المركزة" : "Transfer Patient to ICU", priority: "critical", category: "clinical", status: "pending", assignee: "nurse-3", department: "IPD", patientId: patients[1]?.id || null, dueDate: new Date().toISOString() }
  ]);

  const tabs = [
    { id: "my_tasks", icon: UserCheck, en: "My Worklist", ar: "مهامي" },
    { id: "department", icon: Building2, en: "Department Tasks", ar: "مهام القسم" },
    { id: "delegated", icon: Users, en: "Delegated Tasks", ar: "مهام مفوضة" },
    { id: "analytics", icon: BarChart3, en: "Performance Analytics", ar: "تحليلات الأداء" },
  ];

  const filteredTasks = useMemo(() => {
    let list = tasks;
    
    if (activeTab === "my_tasks") {
      list = list.filter(t => t.assignee === (currentUser?.id || "doc-1"));
    } else if (activeTab === "department") {
       // Mock department filter
      list = list.filter(t => t.department === (currentUser?.departmentId || "LIS"));
    }

    if (searchQuery) {
       list = list.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    return list;
  }, [tasks, activeTab, searchQuery, currentUser]);

  const handleStatusUpdate = (taskId: string, newStatus: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    toast.success(isAr ? "تم تحديث حالة المهمة" : "Task status updated");
    if (selectedTask?.id === taskId) {
      setSelectedTask((prev: any) => ({ ...prev, status: newStatus }));
    }
  };

  const priorityConfig: Record<string, { color: string, icon: any, en: string, ar: string }> = {
    critical: { color: "red", icon: Flame, en: "Critical SLA", ar: "حرج جداً" },
    high: { color: "orange", icon: AlertTriangle, en: "High Priority", ar: "عالي" },
    normal: { color: "blue", icon: Clock, en: "Normal", ar: "عادي" },
    low: { color: "slate", icon: CheckCircle2, en: "Low Priority", ar: "منخفض" }
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50/50" dir={isAr ? "rtl" : "ltr"}>
      <div className="bg-white border-b border-slate-200 px-6 py-5 flex flex-col xl:flex-row xl:items-center justify-between gap-6 shadow-sm shrink-0 z-30">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-900 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100 border-2 border-indigo-800">
             <ListTodo className="w-7 h-7 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                {isAr ? "مركز المهام الموحد" : "Enterprise Task Center"}
              </h1>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-full border border-indigo-100 uppercase tracking-widest">
                Unified Workflow
              </span>
            </div>
            <p className="text-sm font-bold text-slate-500 mt-1">
              {isAr ? "إدارة وتوجيه جميع المهام السريرية والإدارية والتشغيلية" : "Centralized orchestration of clinical, operational & administrative tasks"}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
           <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
             <Filter className="w-4 h-4" />
             {isAr ? "عوامل التصفية" : "Advanced Filters"}
           </button>
           <button onClick={() => setShowCreateTaskModal(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2">
             <Plus className="w-5 h-5" />
             <span>{isAr ? "إنشاء مهمة" : "New Task"}</span>
           </button>
        </div>
      </div>

      <div className="bg-white border-b border-slate-200 px-6 flex items-center overflow-x-auto no-scrollbar shrink-0">
        <div className="flex gap-2 min-w-max">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${
                activeTab === tab.id ? "text-indigo-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-indigo-600" : ""}`} />
              {isAr ? tab.ar : tab.en}
              {activeTab === tab.id && (
                <motion.div layoutId="task_tab_indicator" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {activeTab !== "analytics" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto space-y-6">
               <div className="flex gap-6 h-[calc(100vh-280px)]">
                 
                 {/* Task List */}
                 <div className={`${selectedTask ? 'w-1/2 lg:w-1/3' : 'w-full'} transition-all duration-300 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden`}>
                   <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                     <div className="relative">
                       <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input 
                         type="text" 
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         placeholder={isAr ? "بحث في المهام..." : "Search tasks..."} 
                         className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold w-full outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                       />
                     </div>
                   </div>
                   <div className="flex-1 overflow-y-auto">
                     {filteredTasks.length > 0 ? filteredTasks.map((task) => {
                       const conf = priorityConfig[task.priority] || priorityConfig.normal;
                       const Icon = conf.icon;
                       return (
                         <div 
                           key={task.id} 
                           onClick={() => setSelectedTask(task)}
                           className={`p-4 border-b border-slate-100 cursor-pointer transition-colors hover:bg-slate-50 ${selectedTask?.id === task.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'}`}
                         >
                            <div className="flex justify-between items-start mb-2">
                               <span className="text-[10px] font-mono font-bold text-slate-400">{task.id}</span>
                               <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-${conf.color}-50 text-${conf.color}-700 border border-${conf.color}-200 flex items-center gap-1`}>
                                 <Icon className="w-3 h-3" />
                                 {isAr ? conf.ar : conf.en}
                               </span>
                            </div>
                            <h3 className="font-bold text-slate-800 text-sm mb-2">{task.title}</h3>
                            <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold">
                               <div className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {task.department}</div>
                               <div className={`px-2 py-0.5 rounded-full uppercase tracking-widest ${
                                  task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                  task.status === 'in_progress' ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-600'
                               }`}>
                                 {task.status.replace('_', ' ')}
                               </div>
                            </div>
                         </div>
                       )
                     }) : (
                       <div className="p-12 text-center text-slate-400">
                          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                          <p className="font-bold text-sm">{isAr ? "لا توجد مهام نشطة" : "Inbox Zero! No pending tasks."}</p>
                       </div>
                     )}
                   </div>
                 </div>

                 {/* Task Details */}
                 {selectedTask && (
                   <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
                         <div>
                            <div className="flex items-center gap-3 mb-2">
                               <span className="text-xs font-mono font-bold text-slate-400 px-2 py-1 bg-white border border-slate-200 rounded">{selectedTask.id}</span>
                               <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-full">{selectedTask.category}</span>
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedTask.title}</h2>
                         </div>
                         <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-400">
                            <X className="w-5 h-5" />
                         </button>
                      </div>

                      <div className="p-6 flex-1 overflow-y-auto space-y-6">
                         
                         {/* Linked Entities */}
                         {(selectedTask.patientId || selectedTask.department) && (
                           <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-wrap gap-4">
                             {selectedTask.patientId && (
                                <div className="flex-1">
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{isAr ? "المريض المرتبط" : "Linked Patient"}</p>
                                   <GlobalEntityLink entityType="patient" entityId={selectedTask.patientId} className="flex items-center gap-2 font-bold text-slate-800 hover:text-indigo-600">
                                      <User className="w-4 h-4" />
                                      {patients.find(p => p.id === selectedTask.patientId)?.nameEn || "Unknown Patient"}
                                   </GlobalEntityLink>
                                </div>
                             )}
                             {selectedTask.department && (
                                <div className="flex-1">
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{isAr ? "القسم" : "Department Context"}</p>
                                   <div className="flex items-center gap-2 font-bold text-slate-800">
                                      <Building2 className="w-4 h-4" />
                                      {selectedTask.department}
                                   </div>
                                </div>
                             )}
                           </div>
                         )}

                         {/* Actions */}
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{isAr ? "حالة وإجراءات المهمة" : "Task Workflow & Actions"}</p>
                            <div className="flex gap-2">
                               <button 
                                 onClick={() => handleStatusUpdate(selectedTask.id, 'in_progress')}
                                 className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedTask.status === 'in_progress' ? 'bg-sky-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-600'}`}
                               >
                                  {isAr ? "قيد التنفيذ" : "Start Progress"}
                               </button>
                               <button 
                                 onClick={() => handleStatusUpdate(selectedTask.id, 'completed')}
                                 className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedTask.status === 'completed' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'}`}
                               >
                                  {isAr ? "إنجاز المهمة" : "Mark Complete"}
                               </button>
                            </div>
                         </div>
                         
                         {/* Quick Reply / Notes */}
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{isAr ? "التعليقات" : "Thread & Notes"}</p>
                            <div className="flex gap-2">
                               <input type="text" placeholder={isAr ? "أضف تعليقاً..." : "Add a note..."} className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                               <button onClick={() => toast.success("Comment added")} className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition">
                                  <Send className="w-5 h-5" />
                               </button>
                            </div>
                         </div>

                      </div>
                   </div>
                 )}
               </div>
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                     <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-4xl font-black text-slate-900">92%</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">{isAr ? "نسبة إنجاز المهام في الوقت" : "SLA Compliance Rate"}</p>
               </div>
               <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                     <Clock className="w-10 h-10 text-amber-600" />
                  </div>
                  <h3 className="text-4xl font-black text-slate-900">1.4h</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">{isAr ? "متوسط وقت إغلاق المهام" : "Avg Resolution Time"}</p>
               </div>
               <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                     <Users className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h3 className="text-4xl font-black text-slate-900">4,281</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">{isAr ? "إجمالي المهام المنجزة (الشهر)" : "Tasks Closed (MTD)"}</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DEDICATED MODAL: Create New Task */}
      {showCreateTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-indigo-900 px-6 py-4 text-white flex justify-between items-center">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-indigo-400" />
                {isAr ? "إنشاء مهمة عمل جديدة" : "Create New Enterprise Task"}
              </h3>
              <button onClick={() => setShowCreateTaskModal(false)} className="hover:bg-indigo-800 p-1 rounded-lg">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newTaskForm.title.trim()) return;
              const created = {
                id: `TSK-${Math.floor(Math.random() * 900) + 100}`,
                title: newTaskForm.title,
                priority: newTaskForm.priority,
                category: newTaskForm.category,
                status: "pending",
                assignee: currentUser?.id || "doc-1",
                department: newTaskForm.department,
                patientId: null,
                dueDate: new Date().toISOString()
              };
              setTasks([created, ...tasks]);
              toast.success(isAr ? "تم إسناد وإنشاء المهمة بنجاح" : "Task created and assigned successfully");
              setShowCreateTaskModal(false);
              setNewTaskForm({ title: "", priority: "normal", category: "clinical", department: currentUser?.departmentId || "LIS" });
            }} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600">{isAr ? "عنوان المهمة" : "Task Title"}</label>
                <input type="text" value={newTaskForm.title} onChange={e => setNewTaskForm({...newTaskForm, title: e.target.value})} placeholder={isAr ? "أدخل عنوان أو تفاصيل المهمة..." : "Enter task summary..."} className="w-full border rounded-xl p-2.5 text-sm font-bold mt-1" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600">{isAr ? "الأولوية" : "Priority SLA"}</label>
                  <select value={newTaskForm.priority} onChange={e => setNewTaskForm({...newTaskForm, priority: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm font-bold mt-1">
                    <option value="normal">{isAr ? "عادية" : "Normal"}</option>
                    <option value="high">{isAr ? "عالية" : "High"}</option>
                    <option value="critical">{isAr ? "حرجة جداً" : "Critical"}</option>
                    <option value="low">{isAr ? "منخفضة" : "Low"}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600">{isAr ? "الفئة" : "Category"}</label>
                  <select value={newTaskForm.category} onChange={e => setNewTaskForm({...newTaskForm, category: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm font-bold mt-1">
                    <option value="clinical">{isAr ? "سريرية" : "Clinical"}</option>
                    <option value="operational">{isAr ? "تشغيلية" : "Operational"}</option>
                    <option value="administrative">{isAr ? "إدارية" : "Administrative"}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">{isAr ? "القسم المعني" : "Assigned Department"}</label>
                <input type="text" value={newTaskForm.department} onChange={e => setNewTaskForm({...newTaskForm, department: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm font-bold mt-1" />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setShowCreateTaskModal(false)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition text-sm">{isAr ? "إلغاء" : "Cancel"}</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition text-sm">{isAr ? "حفظ وتكليف" : "Create Task"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
