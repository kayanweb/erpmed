import React, { useState, useEffect } from 'react';
import { 
  Bell, Search, Filter, CheckCircle, AlertTriangle, Clock, 
  Settings, Trash2, Archive, Pin, ArrowRight, ShieldAlert,
  Stethoscope, Pill, FlaskConical, Activity, Sparkles, AlertOctagon,
  MessageSquare, Mail, Smartphone, Volume2, ArrowUpRight, 
  MoreVertical, CheckSquare, ListFilter, SlidersHorizontal, Info,
  Eye, CornerUpRight, Trash, Server, Plus, X, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  syncNotifications, 
  createNotification, 
  markAsRead, 
  markAllAsRead, 
  togglePinNotification, 
  archiveNotification, 
  snoozeNotification, 
  deleteNotification,
  saveNotification,
  SystemNotification,
  NotificationPriority,
  NotificationCategory,
  NotificationStatus
} from '../lib/notificationService';

interface Props { 
  language: 'ar' | 'en'; 
  onClose?: () => void; 
  currentUser?: any;
}

// Default initial fallback notifications
const INITIAL_DEFAULT_NOTIFICATIONS: SystemNotification[] = [
  {
    id: "N-1001",
    titleAr: "قيمة مخبرية حرجة - عاجل جداً",
    titleEn: "Critical Lab Value - Urgent",
    messageAr: "المريض أحمد ك. (MRN: 88219) مستوى تروبونين I هو 2.4 ng/mL (مرتفع حاد). مراجعة طبية فورية مطلوبة.",
    messageEn: "Patient Ahmad K. (MRN: 88219) Troponin I is 2.4 ng/mL (High). Immediate review required.",
    priority: "CRITICAL",
    category: "LAB",
    status: "UNREAD",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    patientId: "88219",
    patientName: "Ahmad K.",
    actionRequired: true,
    actionLink: "/lab/results/88219",
    isPinned: true,
    read: false,
    type: "critical"
  },
  {
    id: "N-1002",
    titleAr: "تنبؤ الخطر التسممي للذكاء الاصطناعي",
    titleEn: "AI Sepsis Early Warning",
    messageAr: "اكتشف نموذج AI احتمال 85% لبدء صدمة التسمم الدموي خلال 6 ساعات للسرير ICU-04.",
    messageEn: "AI model detected 85% probability of sepsis onset within 6 hours for bed ICU-04.",
    priority: "HIGH",
    category: "AI_PREDICTIVE",
    status: "UNREAD",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    patientId: "91002",
    patientName: "Sarah M.",
    actionRequired: true,
    actionLink: "/icu/monitor/91002",
    isPinned: false,
    read: false,
    type: "warning"
  },
  {
    id: "N-1003",
    titleAr: "تضارب دوائي خطير - تحذير",
    titleEn: "Severe Drug Interaction Alert",
    messageAr: "وصفة الورفارين تتضارب مع الأميودارون المضاف حديثاً. خطر نزيف شديد للمريض.",
    messageEn: "Prescription of Warfarin conflicts with recently added Amiodarone. Risk of severe bleeding.",
    priority: "CRITICAL",
    category: "DRUG",
    status: "UNREAD",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    patientId: "77210",
    actionRequired: true,
    isPinned: false,
    read: false,
    type: "critical"
  },
  {
    id: "N-1004",
    titleAr: "حالة السعة الاستيعابية للأسرة",
    titleEn: "Bed Availability Status",
    messageAr: "وصل الجناح 4 إلى 95% من طاقته الاستيعابية. متبقي سريران فقط.",
    messageEn: "Ward 4 has reached 95% capacity. Only 2 beds remaining.",
    priority: "NORMAL",
    category: "BED",
    status: "READ",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isPinned: false,
    read: true,
    type: "info"
  },
  {
    id: "N-1005",
    titleAr: "تصعيد الاستشارة الطبية",
    titleEn: "Consultation Escalation",
    messageAr: "استشارة القلبية للمريض MRN: 55123 تجاوزت وقت الاستجابة المسموح به. تم التصعيد لرئيس القسم.",
    messageEn: "Cardiology consult for patient MRN: 55123 has breached SLA. Escalated to Dept Head.",
    priority: "HIGH",
    category: "ESCALATION",
    status: "READ",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    isPinned: false,
    read: true,
    type: "warning"
  }
];

export default function EnterpriseNotificationCenter({ language, onClose, currentUser }: Props) {
  const isAr = language === 'ar';
  
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [activeFilter, setActiveFilter] = useState<'INBOX' | 'UNREAD' | 'PINNED' | 'SNOOZED' | 'ARCHIVED'>('INBOX');
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Alert Form state
  const [newNotifForm, setNewNotifForm] = useState({
    titleAr: '',
    titleEn: '',
    messageAr: '',
    messageEn: '',
    priority: 'HIGH' as NotificationPriority,
    category: 'MEDICAL' as NotificationCategory,
    targetDepartment: 'ALL',
    targetUserId: 'all',
  });

  // Load & Sync Notifications Realtime from Database
  useEffect(() => {
    const userId = currentUser?.id || currentUser?.uid;
    const role = currentUser?.role;
    const dept = currentUser?.department;

    const unsub = syncNotifications(userId, role, dept, (liveData) => {
      if (liveData && liveData.length > 0) {
        setNotifications(liveData);
      } else {
        // Seed initial notifications if none exist yet
        setNotifications(INITIAL_DEFAULT_NOTIFICATIONS);
      }
    });

    return () => {
      if (unsub) unsub();
    };
  }, [currentUser]);

  // --- Handlers with Cloud Database Persistence ---
  const handleMarkAsRead = async (id: string) => {
    const target = notifications.find(n => n.id === id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'READ', read: true } : n));
    try {
      await markAsRead(id, target);
    } catch (err) {
      console.error("Failed to mark notification as read in database:", err);
    }
  };
  
  const handleMarkAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, status: 'READ', read: true })));
    try {
      await markAllAsRead(notifications);
    } catch (err) {
      console.error("Failed to mark all notifications as read in database:", err);
    }
  };
  
  const handleTogglePin = async (id: string) => {
    const target = notifications.find(n => n.id === id);
    const newPinned = !target?.isPinned;
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isPinned: newPinned } : n));
    try {
      await togglePinNotification(id, !!target?.isPinned, target);
    } catch (err) {
      console.error("Failed to toggle pin notification in database:", err);
    }
  };
  
  const handleArchiveNotification = async (id: string) => {
    const target = notifications.find(n => n.id === id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'ARCHIVED' } : n));
    try {
      await archiveNotification(id, target);
    } catch (err) {
      console.error("Failed to archive notification in database:", err);
    }
  };
  
  const handleSnoozeNotification = async (id: string) => {
    const target = notifications.find(n => n.id === id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'SNOOZED' } : n));
    try {
      await snoozeNotification(id, target);
    } catch (err) {
      console.error("Failed to snooze notification in database:", err);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      await deleteNotification(id);
    } catch (err) {
      console.error("Failed to delete notification in database:", err);
    }
  };

  const handleCreateNewAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotifForm.titleAr || !newNotifForm.messageAr) return;

    setIsSubmitting(true);
    try {
      const created = await createNotification({
        titleAr: newNotifForm.titleAr,
        titleEn: newNotifForm.titleEn || newNotifForm.titleAr,
        messageAr: newNotifForm.messageAr,
        messageEn: newNotifForm.messageEn || newNotifForm.messageAr,
        priority: newNotifForm.priority,
        category: newNotifForm.category,
        targetDepartment: newNotifForm.targetDepartment,
        targetUserId: newNotifForm.targetUserId,
        userId: "all",
        role: "all",
        type: newNotifForm.priority === 'CRITICAL' ? 'critical' : 'info',
        status: 'UNREAD',
        read: false,
        isPinned: newNotifForm.priority === 'CRITICAL'
      });

      setNotifications(prev => [created, ...prev]);
      setShowCreateModal(false);
      setNewNotifForm({
        titleAr: '',
        titleEn: '',
        messageAr: '',
        messageEn: '',
        priority: 'HIGH',
        category: 'MEDICAL',
        targetDepartment: 'ALL',
        targetUserId: 'all',
      });
    } catch (err) {
      console.error("Failed to create system notification:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // --- Derived State & Filters ---
  const filteredNotifications = notifications.filter(n => {
    const title = isAr ? (n.titleAr || n.titleEn || '') : (n.titleEn || n.titleAr || '');
    const message = isAr ? (n.messageAr || n.messageEn || '') : (n.messageEn || n.messageAr || '');

    // Search
    if (searchQuery && !title.toLowerCase().includes(searchQuery.toLowerCase()) && !message.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Category
    if (selectedCategory !== 'ALL' && n.category !== selectedCategory) {
      return false;
    }
    // Tab Filter
    if (activeFilter === 'INBOX') return n.status !== 'ARCHIVED';
    if (activeFilter === 'UNREAD') return n.status === 'UNREAD' || !n.read;
    if (activeFilter === 'PINNED') return n.isPinned;
    if (activeFilter === 'SNOOZED') return n.status === 'SNOOZED';
    if (activeFilter === 'ARCHIVED') return n.status === 'ARCHIVED';
    return true;
  }).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const unreadCount = notifications.filter(n => n.status === 'UNREAD' || !n.read).length;

  const getPriorityColor = (priority?: NotificationPriority) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'NORMAL': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'LOW': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getCategoryIcon = (category?: NotificationCategory) => {
    switch (category) {
      case 'MEDICAL': return <Stethoscope size={18} className="text-emerald-600" />;
      case 'DRUG': return <Pill size={18} className="text-purple-600" />;
      case 'LAB': return <FlaskConical size={18} className="text-cyan-600" />;
      case 'BED': return <Activity size={18} className="text-blue-600" />;
      case 'ESCALATION': return <ArrowUpRight size={18} className="text-orange-600" />;
      case 'AI_PREDICTIVE': return <Sparkles size={18} className="text-indigo-600" />;
      case 'SYSTEM': return <Server size={18} className="text-slate-600" />;
      default: return <Bell size={18} className="text-indigo-600" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              {isAr ? "مركز الإشعارات المؤسسي" : "Enterprise Notification Center"}
            </h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">
              {isAr ? "نظام إدارة التنبيهات السريرية والذكية" : "Clinical & Smart Alerts Management"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all flex items-center gap-2 font-bold text-xs"
          >
            <Plus size={16} />
            <span>{isAr ? "إرسال تنبيه جديد" : "Dispatch New Alert"}</span>
          </button>

          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 font-bold text-sm ${showSettings ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <SlidersHorizontal size={18} />
            <span className="hidden sm:inline">{isAr ? "الإعدادات" : "Settings"}</span>
          </button>

          {onClose && (
            <button onClick={onClose} className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors">
              <Eye size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar (Filters & Categories) */}
        <div className={`w-64 bg-white border-${isAr ? 'l' : 'r'} border-slate-200 flex flex-col shrink-0 overflow-y-auto`}>
          <div className="p-4">
            <button 
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="w-full py-2.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckSquare size={16} />
              {isAr ? "تحديد الكل كمقروء" : "Mark All as Read"}
            </button>
          </div>

          <div className="px-3 pb-2 space-y-1">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2 mt-2">
              {isAr ? "صندوق الوارد" : "Inbox"}
            </div>
            {[
              { id: 'INBOX', icon: Bell, labelAr: "كل الإشعارات", labelEn: "All Notifications" },
              { id: 'UNREAD', icon: Eye, labelAr: "غير مقروءة", labelEn: "Unread", count: unreadCount },
              { id: 'PINNED', icon: Pin, labelAr: "المثبتة", labelEn: "Pinned" },
              { id: 'SNOOZED', icon: Clock, labelAr: "المؤجلة", labelEn: "Snoozed" },
              { id: 'ARCHIVED', icon: Archive, labelAr: "الأرشيف", labelEn: "Archived" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${activeFilter === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <div className="flex items-center gap-3">
                  <tab.icon size={16} className={activeFilter === tab.id ? 'text-indigo-200' : 'text-slate-400'} />
                  {isAr ? tab.labelAr : tab.labelEn}
                </div>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeFilter === tab.id ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="px-3 py-4 space-y-1 border-t border-slate-100 mt-2">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2">
              {isAr ? "التصنيفات السريرية" : "Clinical Categories"}
            </div>
            {[
              { id: 'ALL', icon: ListFilter, labelAr: "جميع التصنيفات", labelEn: "All Categories", color: "text-slate-600" },
              { id: 'CRITICAL', icon: ShieldAlert, labelAr: "تنبيهات حرجة", labelEn: "Critical Alerts", color: "text-rose-600" }, 
              { id: 'MEDICAL', icon: Stethoscope, labelAr: "طبي وسريري", labelEn: "Medical & Clinical", color: "text-emerald-600" },
              { id: 'DRUG', icon: Pill, labelAr: "أدوية وحساسية", labelEn: "Drugs & Allergies", color: "text-purple-600" },
              { id: 'LAB', icon: FlaskConical, labelAr: "نتائج مخبرية حرجة", labelEn: "Critical Labs", color: "text-cyan-600" },
              { id: 'BED', icon: Activity, labelAr: "الأسرة والعناية", labelEn: "Beds & ICU", color: "text-blue-600" },
              { id: 'AI_PREDICTIVE', icon: Sparkles, labelAr: "تنبؤات الذكاء الاصطناعي", labelEn: "AI Predictive", color: "text-indigo-600" },
              { id: 'ESCALATION', icon: ArrowUpRight, labelAr: "تصعيد الإدارة", labelEn: "Escalations", color: "text-orange-600" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-all ${selectedCategory === cat.id ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <cat.icon size={16} className={cat.color} />
                {isAr ? cat.labelAr : cat.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Center Notification List */}
        <div className="flex-1 flex flex-col bg-slate-50 min-w-0">
          <div className="p-4 border-b border-slate-200 bg-white/50 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-3' : 'left-3'} w-4 h-4 text-slate-400`} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? "بحث في الإشعارات..." : "Search notifications..."} 
                className={`w-full ${isAr ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm`} 
              />
            </div>
            
            <div className="flex items-center gap-2 text-sm text-slate-500 font-bold">
              {filteredNotifications.length} {isAr ? "إشعار" : "Notifications"}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            <AnimatePresence>
              {filteredNotifications.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 py-16"
                >
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-slate-300" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-black text-slate-600">{isAr ? "صندوق الوارد فارغ" : "Inbox is empty"}</h3>
                    <p className="text-sm font-medium mt-1">{isAr ? "لقد اطلعت على جميع التنبيهات المهمة" : "You're all caught up!"}</p>
                  </div>
                </motion.div>
              ) : (
                filteredNotifications.map((notif) => {
                  const title = isAr ? (notif.titleAr || notif.titleEn || '') : (notif.titleEn || notif.titleAr || '');
                  const message = isAr ? (notif.messageAr || notif.messageEn || '') : (notif.messageEn || notif.messageAr || '');
                  const isUnread = notif.status === 'UNREAD' || !notif.read;

                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={notif.id} 
                      className={`group bg-white rounded-2xl p-4 border transition-all shadow-sm hover:shadow-md flex flex-col sm:flex-row gap-4 relative overflow-hidden ${isUnread ? 'border-indigo-200 bg-indigo-50/10' : 'border-slate-200'}`}
                    >
                      {/* Unread Indicator Line */}
                      {isUnread && (
                        <div className={`absolute top-0 bottom-0 ${isAr ? 'right-0' : 'left-0'} w-1 bg-indigo-600`} />
                      )}

                      {/* Icon & Priority */}
                      <div className="shrink-0 flex flex-col items-center gap-2">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner ${notif.category === 'AI_PREDICTIVE' ? 'bg-indigo-100 border-indigo-200' : 'bg-slate-50 border-slate-100'}`}>
                          {getCategoryIcon(notif.category)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${getPriorityColor(notif.priority)}`}>
                                {notif.priority || 'NORMAL'}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                {new Date(notif.timestamp).toLocaleString(isAr ? 'ar-EG' : 'en-US', { hour: 'numeric', minute: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                              {notif.isPinned && (
                                <Pin size={12} className="text-amber-500 fill-amber-500" />
                              )}
                            </div>
                            <h3 className={`text-base font-black truncate ${isUnread ? 'text-slate-900' : 'text-slate-700'}`}>
                              {title}
                            </h3>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 bg-white/80 backdrop-blur-sm p-1 rounded-lg border border-slate-100 shadow-sm">
                            {isUnread && (
                              <button onClick={() => handleMarkAsRead(notif.id)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition" title={isAr ? "تحديد كمقروء" : "Mark as read"}>
                                <CheckCircle size={16} />
                              </button>
                            )}
                            <button onClick={() => handleTogglePin(notif.id)} className={`p-1.5 rounded-md transition ${notif.isPinned ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'}`} title={isAr ? "تثبيت" : "Pin"}>
                              <Pin size={16} />
                            </button>
                            <button onClick={() => handleSnoozeNotification(notif.id)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition" title={isAr ? "تأجيل" : "Snooze"}>
                              <Clock size={16} />
                            </button>
                            <button onClick={() => handleArchiveNotification(notif.id)} className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition" title={isAr ? "أرشفة" : "Archive"}>
                              <Archive size={16} />
                            </button>
                            <button onClick={() => handleDeleteNotification(notif.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition" title={isAr ? "حذف" : "Delete"}>
                              <Trash size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <p className={`mt-1 text-sm leading-relaxed ${isUnread ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                          {message}
                        </p>
                        
                        {/* Deep Link & Metadata */}
                        <div className="mt-3 flex items-center flex-wrap gap-3">
                          {notif.patientId && (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                              <Info size={14} />
                              MRN: {notif.patientId} {notif.patientName && `- ${notif.patientName}`}
                            </div>
                          )}
                          {notif.actionRequired && notif.actionLink && (
                            <button className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg transition-colors border border-indigo-100">
                              {isAr ? "مراجعة الحالة" : "Review Case"}
                              <CornerUpRight size={14} className={isAr ? "-scale-x-100" : ""} />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Sidebar (Settings) */}
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className={`bg-white border-${isAr ? 'r' : 'l'} border-slate-200 overflow-hidden shrink-0 flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.02)]`}
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-black text-slate-800 flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-indigo-600" />
                  {isAr ? "إعدادات الإشعارات" : "Notification Settings"}
                </h3>
                <button onClick={() => setShowSettings(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>
              
              <div className="p-4 overflow-y-auto space-y-6 custom-scrollbar">
                
                {/* Global Settings */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                    {isAr ? "تفضيلات الاستلام" : "Delivery Preferences"}
                  </h4>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                        <Smartphone size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{isAr ? "تنبيهات الموبايل" : "Push Notifications"}</p>
                        <p className="text-[10px] text-slate-500">{isAr ? "عبر تطبيق الموظفين" : "Via Staff App"}</p>
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle-checkbox" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                        <Mail size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{isAr ? "البريد الإلكتروني" : "Email Alerts"}</p>
                        <p className="text-[10px] text-slate-500">{isAr ? "للتنبيهات غير الحرجة" : "For non-critical"}</p>
                      </div>
                    </div>
                    <input type="checkbox" className="toggle-checkbox" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <MessageSquare size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{isAr ? "رسائل SMS" : "SMS Alerts"}</p>
                        <p className="text-[10px] text-slate-500">{isAr ? "للحالات الطارئة فقط" : "For emergencies only"}</p>
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle-checkbox" />
                  </div>
                </div>

                {/* Category Toggles */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                    {isAr ? "تخصيص حسب الفئة" : "Customize by Category"}
                  </h4>
                  
                  {[
                    { id: 'CRITICAL', labelAr: "تنبيهات حرجة", labelEn: "Critical Alerts", required: true },
                    { id: 'MEDICAL', labelAr: "استشارات ونتائج", labelEn: "Consults & Results", required: false },
                    { id: 'AI', labelAr: "تنبؤات الذكاء الاصطناعي", labelEn: "AI Predictions", required: false },
                    { id: 'SYSTEM', labelAr: "تحديثات النظام", labelEn: "System Updates", required: false },
                  ].map(cat => (
                    <div key={cat.id} className="flex items-center justify-between p-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">{isAr ? cat.labelAr : cat.labelEn}</span>
                        {cat.required && (
                          <span className="text-[8px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded font-black uppercase">
                            {isAr ? "إلزامي" : "Required"}
                          </span>
                        )}
                      </div>
                      <input type="checkbox" defaultChecked disabled={cat.required} className="toggle-checkbox" />
                    </div>
                  ))}
                </div>

                {/* Sound Settings */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                    {isAr ? "تنبيهات الصوت" : "Sound Settings"}
                  </h4>
                  <div className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-2">
                      <Volume2 size={16} className="text-slate-500" />
                      <span className="text-xs font-bold text-slate-700">{isAr ? "تفعيل الصوت للمقاطعات" : "Play sound for interruptions"}</span>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle-checkbox" />
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Dispatch New Alert Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 font-sans" dir={isAr ? 'rtl' : 'ltr'}>
            <div className="p-5 bg-gradient-to-r from-indigo-900 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-300" />
                <h3 className="font-black text-sm">
                  {isAr ? "إرسال تنبيه أو إشعار عاجل للكادر" : "Dispatch New System Alert"}
                </h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-white/20 rounded-lg text-white text-xs">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNewAlert} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? "عنوان الإشعار بالعربية *" : "Arabic Title *"}
                </label>
                <input
                  type="text"
                  required
                  value={newNotifForm.titleAr}
                  onChange={e => setNewNotifForm(prev => ({ ...prev, titleAr: e.target.value }))}
                  placeholder={isAr ? "مثال: تنبيه حرج لقسم العناية" : "e.g. Critical ICU Alert"}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? "عنوان الإشعار بالإنجليزية" : "English Title"}
                </label>
                <input
                  type="text"
                  value={newNotifForm.titleEn}
                  onChange={e => setNewNotifForm(prev => ({ ...prev, titleEn: e.target.value }))}
                  placeholder="e.g. Critical ICU Alert"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "الأولوية" : "Priority"}
                  </label>
                  <select
                    value={newNotifForm.priority}
                    onChange={e => setNewNotifForm(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="CRITICAL">{isAr ? "حرج جداً (CRITICAL)" : "CRITICAL"}</option>
                    <option value="HIGH">{isAr ? "عالي (HIGH)" : "HIGH"}</option>
                    <option value="NORMAL">{isAr ? "عادي (NORMAL)" : "NORMAL"}</option>
                    <option value="LOW">{isAr ? "منخفض (LOW)" : "LOW"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "التصنيف" : "Category"}
                  </label>
                  <select
                    value={newNotifForm.category}
                    onChange={e => setNewNotifForm(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="MEDICAL">{isAr ? "طبي وسريري" : "Medical"}</option>
                    <option value="DRUG">{isAr ? "أدوية وحساسية" : "Drug"}</option>
                    <option value="LAB">{isAr ? "مختبر وتحاليل" : "Lab"}</option>
                    <option value="BED">{isAr ? "أسرة وعناية" : "Beds"}</option>
                    <option value="ESCALATION">{isAr ? "تصعيد إداري" : "Escalation"}</option>
                    <option value="AI_PREDICTIVE">{isAr ? "تنبؤ ذكي" : "AI Predictive"}</option>
                    <option value="SYSTEM">{isAr ? "تنبيه نظام" : "System"}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? "نص وتفاصيل الإشعار بالعربية *" : "Arabic Message Text *"}
                </label>
                <textarea
                  required
                  rows={3}
                  value={newNotifForm.messageAr}
                  onChange={e => setNewNotifForm(prev => ({ ...prev, messageAr: e.target.value }))}
                  placeholder={isAr ? "اكتب تفاصيل التنبيه أو التعليمات هنا..." : "Type details here..."}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? "نص وتفاصيل الإشعار بالإنجليزية" : "English Message Text"}
                </label>
                <textarea
                  rows={2}
                  value={newNotifForm.messageEn}
                  onChange={e => setNewNotifForm(prev => ({ ...prev, messageEn: e.target.value }))}
                  placeholder="Type English message here..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 disabled:opacity-50"
                >
                  <Send size={14} />
                  <span>{isAr ? "بث الإشعار الآن" : "Broadcast Alert"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
