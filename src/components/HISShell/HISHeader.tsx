import React from "react";
import { 
  Menu, 
  Search, 
  UserPlus, 
  FileText, 
  Bell, 
  MessageSquare, 
  ChevronDown, 
  UserCircle, 
  LogOut,
  Brain,
  Sparkles
} from "lucide-react";

interface HISHeaderProps {
  isAr: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
  mrnSearchQuery?: string;
  setMrnSearchQuery?: (query: string) => void;
  onMrnSearch?: (e: React.FormEvent) => void;
  currentUser: any;
  onLogout: () => void;
  onLanguageToggle?: () => void;
  hisNotificationsCount?: number;
  hisMessagesCount?: number;
  onOpenNotifications?: () => void;
  onOpenMessages?: () => void;
  onViewProfile?: (user: any) => void;
  language?: string;
  onToggleCopilot?: () => void;
  hospitalSettings?: any;
  notifications?: any[];
  handleNotificationClick?: (n: any) => void;
  onModuleSelect?: (moduleId: string) => void;
}

export const HISHeader: React.FC<HISHeaderProps> = ({
  isAr,
  isSidebarOpen,
  setIsSidebarOpen,
  globalSearchQuery,
  setGlobalSearchQuery,
  mrnSearchQuery = "",
  setMrnSearchQuery = () => {},
  onMrnSearch = (e) => e.preventDefault(),
  currentUser,
  onLogout,
  onLanguageToggle = () => {},
  hisNotificationsCount = 0,
  hisMessagesCount = 0,
  onOpenNotifications = () => {},
  onOpenMessages = () => {},
  onViewProfile,
  language = "en",
  onToggleCopilot = () => {},
  hospitalSettings,
  notifications = [],
  handleNotificationClick = () => {},
  onModuleSelect = () => {},
  ...props
}) => {
  const [internalIsProfileDropdownOpen, setInternalIsProfileDropdownOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [isMessagesDropdownOpen, setIsMessagesDropdownOpen] = React.useState(false);

  const visibleUnread = notifications.filter((notif) => {
    if (notif.read || notif.status === 'READ') return false;
    const userId = currentUser?.id || currentUser?.uid || currentUser?.staffId;
    if (!notif.userId || notif.userId === "all" || (userId && (notif.userId === userId || notif.targetUserId === userId))) {
      return true;
    }
    return false;
  });

  const displayNotifCount = visibleUnread.length > 0 ? visibleUnread.length : hisNotificationsCount;


  return (
    <div className="h-14 sm:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 z-[40] gap-2 sm:gap-4 shadow-[0_4px_20px_-15px_rgba(0,0,0,0.05)] ">
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 sm:w-6 h-6" />
        </button>
        
        {/* Global Search */}
        <div className="relative w-full max-w-md hidden md:block min-w-[150px]">
          <Search className={`absolute ${isAr ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
          <input
            type="text"
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            placeholder={isAr ? "البحث برقم/اسم المريض..." : "Search Patient MRN/Name..."}
            className={`w-full ${isAr ? "pr-10 pl-16" : "pl-10 pr-16"} py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          <div className={`absolute ${isAr ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded items-center pointer-events-none hidden lg:flex`}>
            Enter ↵
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 shrink-0 min-w-0">


        {/* MRN Quick Search Form */}
        <form onSubmit={onMrnSearch} className="hidden xl:flex items-center bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all w-56 xl:w-72 mr-4">
          <div className={`bg-indigo-600 text-white p-1 rounded-md shrink-0 ${isAr ? "ml-2" : "mr-2"}`}>
            <Search className="w-3 h-3" />
          </div>
          <input 
            type="text" 
            value={mrnSearchQuery}
            onChange={(e) => setMrnSearchQuery(e.target.value)}
            placeholder={isAr ? "الرقم الطبي السريع..." : "Quick MRN Search..."} 
            className="bg-transparent border-none outline-none text-[11px] font-black flex-1 min-w-0"
          />
        </form>

        <div className="flex items-center gap-1.5 sm:gap-5">
          {/* Quick Actions */}
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('openPatientRegistration'))}
            className="hidden xl:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors font-bold text-sm border border-emerald-100 shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            {isAr ? "تسجيل مريض" : "Register Patient"}
          </button>

          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('openVisitRegistration'))}
            className="hidden xl:flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors font-bold text-sm border border-indigo-100 shadow-sm"
          >
            <FileText className="w-4 h-4" />
            {isAr ? "تسجيل زيارة" : "Register Visit"}
          </button>

          {/* Notifications & Messages */}
          <div className="flex items-center gap-1 sm:gap-3">
            <div className="relative">
              <button 
                className="relative p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition" 
                onClick={() => {
                  if (onOpenNotifications) onOpenNotifications();
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsMessagesDropdownOpen(false);
                  setInternalIsProfileDropdownOpen(false);
                }}
              >
                <Bell className={`w-4.5 h-4.5 sm:w-5 h-5 ${displayNotifCount > 0 ? "text-rose-500 animate-bounce" : "text-slate-500"}`} />
                {displayNotifCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 sm:w-4 h-4 bg-rose-500 rounded-full text-white text-[8px] sm:text-[10px] font-bold flex items-center justify-center border border-white">
                    {displayNotifCount}
                  </span>
                )}
              </button>
              
              {isNotificationsOpen && (
                <div className={`absolute mt-2 w-[285px] xs:w-[320px] sm:w-[360px] rounded-2xl bg-white/95 backdrop-blur-xl p-0 shadow-2xl border border-slate-200 z-[1000] overflow-hidden flex flex-col max-h-[420px] ${isAr ? "left-0" : "right-0"}`}>
                  <div className="px-4 py-3 bg-slate-50/5 border-b border-slate-200/50 flex items-center justify-between">
                    <h4 className="text-[11px] font-black text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                      {isAr ? "تنبيهات الذكاء الاستباقي" : "Proactive Alerts"}
                    </h4>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        {isAr ? "لا توجد تنبيهات حالياً" : "No alerts at the moment"}
                      </div>
                    ) : (
                      notifications.map((notif: any, idx: number) => (
                        <div key={idx} onClick={() => { handleNotificationClick(notif); setIsNotificationsOpen(false); }} className={`p-3 rounded-xl text-xs cursor-pointer transition-colors ${!notif.read ? "bg-indigo-50/50 border border-indigo-100" : "hover:bg-slate-50 border border-transparent"}`}>
                          <div className="flex items-start justify-between gap-2">
                            <span className={`font-bold ${notif.type === 'alert' ? 'text-rose-600' : 'text-slate-700'}`}>{notif.title}</span>
                            <span className="text-[9px] text-slate-400 shrink-0 whitespace-nowrap">{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="mt-1 text-slate-600 text-[10px] leading-relaxed">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
                    <button 
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        if (onModuleSelect) onModuleSelect("enterprisenotificationcenter");
                      }}
                      className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition"
                    >
                      {isAr ? "عرض مركز الإشعارات الكامل" : "Open Full Notification Center"}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button 
                className="relative p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition" 
                onClick={() => {
                  setIsMessagesDropdownOpen(!isMessagesDropdownOpen);
                  setIsNotificationsOpen(false);
                  setInternalIsProfileDropdownOpen(false);
                }}
              >
                <MessageSquare className="w-4.5 h-4.5 sm:w-5 h-5 text-indigo-600" />
                {hisMessagesCount! > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 sm:w-4 h-4 bg-indigo-600 rounded-full text-white text-[8px] sm:text-[10px] font-bold flex items-center justify-center border border-white">
                    {hisMessagesCount}
                  </span>
                )}
              </button>
              
              {isMessagesDropdownOpen && (
                <div className={`absolute mt-2 w-64 rounded-2xl bg-white p-2 shadow-2xl border border-slate-200 z-[1000] ${isAr ? "left-0" : "right-0"}`}>
                  <div className="px-4 py-3 border-b border-slate-100 mb-1">
                     <div className="text-sm font-bold text-slate-800">
                       {isAr ? "نظام المراسلة" : "Messaging System"}
                     </div>
                     <div className="text-[10px] text-slate-500">
                       {isAr ? "اختر منصة التواصل المطلوبة" : "Choose your communication platform"}
                     </div>
                  </div>
                  <button 
                    onClick={() => { setIsMessagesDropdownOpen(false); onModuleSelect("clinicalcommunication"); }} 
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-indigo-700 hover:bg-indigo-50 rounded-xl transition"
                  >
                    <MessageSquare size={18} className="text-indigo-500" />
                    <div className="flex flex-col text-start">
                      <span>{isAr ? "مراسلات HIS الداخلية" : "HIS Internal Messages"}</span>
                      <span className="text-[9px] text-indigo-400">{isAr ? "للتواصل السريري بين الأقسام" : "For clinical cross-department comms"}</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => { setIsMessagesDropdownOpen(false); if (onOpenMessages) onOpenMessages(); }} 
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-emerald-700 hover:bg-emerald-50 rounded-xl transition mt-1"
                  >
                    <Sparkles size={18} className="text-emerald-500" />
                    <div className="flex flex-col text-start">
                      <span>{isAr ? "منصة WSD الشاملة" : "WSD Global Workspace"}</span>
                      <span className="text-[9px] text-emerald-400">{isAr ? "للتواصل مع جميع موظفي المؤسسة" : "For enterprise-wide communication"}</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

                  {/* Smart AI Assistant Button */}
        <button 
          onClick={onToggleCopilot}
          className="flex items-center gap-2 bg-indigo-600 text-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-indigo-700 transition-all font-black text-[9px] sm:text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-200 animate-pulse shrink-0"
        >
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white/20 rounded-lg flex items-center justify-center">
            <Brain className="w-2.5 h-2.5 sm:w-3 h-3 text-white" />
          </div>
          <span className="hidden xs:inline lg:inline">{isAr ? "المساعد" : "AI"}</span>
          <span className="hidden sm:inline lg:hidden">{isAr ? "الذكي" : "Copilot"}</span>
        </button>

          <div className="h-6 w-px bg-slate-200 hidden xs:block mx-1"></div>

          {/* Language Toggle */}
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition" onClick={onLanguageToggle}>
            <img 
              src={isAr ? "https://flagcdn.com/w20/sa.png" : "https://flagcdn.com/w20/gb.png"} 
              alt="flag" 
              className="w-4 sm:w-5 rounded-sm" 
            />
            <span className="text-xs sm:text-sm font-semibold text-slate-700 hidden lg:block">
              {isAr ? "العربية" : "English"}
            </span>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden xs:block"></div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <div
              onClick={() => { setInternalIsProfileDropdownOpen(!internalIsProfileDropdownOpen); setIsNotificationsOpen(false); setIsMessagesDropdownOpen(false); }}
              className="flex items-center gap-1.5 sm:gap-3 cursor-pointer p-1 sm:p-1.5 hover:bg-slate-100 rounded-xl transition duration-150 select-none"
            >
              <div className="text-right hidden sm:block max-w-[120px] lg:max-w-[160px]">
                <div className="text-sm font-bold text-slate-800 leading-tight truncate">
                  {isAr ? currentUser?.nameAr || "مستخدم" : currentUser?.nameEn || "User"}
                </div>
                <div className="text-[10px] text-slate-500 font-semibold truncate">
                  {isAr ? currentUser?.department || "عام" : currentUser?.department || "General"}
                </div>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-600 overflow-hidden text-xs sm:text-sm">
                {currentUser?.profilePictureUrl ? (
                  <img src={currentUser.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  currentUser?.avatarInitials || (isAr ? "ك" : "ST")
                )}
              </div>
              <ChevronDown className="w-3 h-3 sm:w-4 h-4 text-slate-500 hidden sm:block" />
            </div>

            {internalIsProfileDropdownOpen && (
              <div className={`absolute mt-2 w-56 sm:w-64 rounded-2xl bg-white p-2 shadow-2xl border border-slate-200 z-[1000] ${isAr ? "left-0" : "right-0"}`}>
                <div className="sm:hidden px-4 py-3 border-b border-slate-100 mb-1">
                   <div className="text-sm font-bold text-slate-800">
                     {isAr ? currentUser?.nameAr || "مستخدم" : currentUser?.nameEn || "User"}
                   </div>
                   <div className="text-[10px] text-slate-500">
                     {isAr ? currentUser?.department || "عام" : currentUser?.department || "General"}
                   </div>
                </div>
                <button onClick={() => { setInternalIsProfileDropdownOpen(false); if (onViewProfile) { onViewProfile(currentUser); } else if (onModuleSelect) { onModuleSelect("profile"); } }} className="w-full flex flex-wrap items-center gap-2 sm:gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition">
                  <UserCircle size={18} className="text-indigo-500" />
                  {isAr ? "الملف الشخصي" : "Profile"}
                </button>
                <button onClick={onLogout} className="w-full flex flex-wrap items-center gap-2 sm:gap-3 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition">
                  <LogOut size={18} className="text-rose-500" />
                  {isAr ? "تسجيل الخروج" : "Logout"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
