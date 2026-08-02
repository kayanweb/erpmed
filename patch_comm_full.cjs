const fs = require('fs');

const code = `import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Trash, MessageSquare, Search, Plus, Phone, Video, 
  MoreVertical, Paperclip, Send, Mic, Image as ImageIcon, 
  FileText, Check, CheckCheck, Clock, Info, 
  Stethoscope, User, ArrowRight, ArrowLeft,
  AlertOctagon, FlaskConical, Activity, HeartPulse,
  Paperclip as PaperclipIcon, X, StopCircle, Play,
  WifiOff, Reply, Forward, Copy, Star, AlertTriangle, Users,
  CheckCircle2, Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
type ChatType = 'DIRECT' | 'GROUP' | 'PATIENT_CONTEXT';
type MessageStatus = 'SENT' | 'DELIVERED' | 'READ';
type MessagePriority = 'NORMAL' | 'URGENT' | 'CRITICAL';
type AttachmentType = 'IMAGE' | 'LAB_RESULT' | 'SBAR' | 'VOICE' | 'DOCUMENT';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName?: string;
  text: string;
  timestamp: string;
  status: MessageStatus;
  isMe: boolean;
  priority?: MessagePriority;
  attachmentType?: AttachmentType;
  attachmentUrl?: string;
  attachmentData?: any;
  replyToId?: string;
}

interface ChatSession {
  id: string;
  title: string;
  subtitle: string;
  avatarText: string;
  type: ChatType;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  isOnline: boolean;
  patientId?: string;
}

interface Props { 
  language: 'ar' | 'en'; 
  onClose?: () => void; 
}

// --- Mock Data ---
const MOCK_CHATS: ChatSession[] = [
  {
    id: "C-1", title: "Dr. Sarah Ahmed", subtitle: "Cardiology", avatarText: "SA",
    type: "DIRECT", unreadCount: 0, lastMessage: "Please check patient 88219 ECG.",
    lastMessageTime: "10:42 AM", isOnline: true
  },
  {
    id: "C-2", title: "ICU Night Shift Handover", subtitle: "Group - 8 Members", avatarText: "ICU",
    type: "GROUP", unreadCount: 3, lastMessage: "All stable. SBAR attached for bed 4.",
    lastMessageTime: "08:15 AM", isOnline: false
  },
  {
    id: "C-3", title: "Patient: Ahmad K. (88219)", subtitle: "Care Team Consult", avatarText: "88",
    type: "PATIENT_CONTEXT", unreadCount: 0, lastMessage: "Potassium is 5.8 mEq/L (High)",
    lastMessageTime: "Yesterday", isOnline: true, patientId: "88219"
  },
  {
    id: "C-4", title: "ER Triage Team", subtitle: "Group - 12 Members", avatarText: "ER",
    type: "GROUP", unreadCount: 0, lastMessage: "Code Blue in trauma bay 1.",
    lastMessageTime: "Tuesday", isOnline: true
  }
];

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  "C-1": [
    { id: 'M1', senderId: 'SA', senderName: 'Dr. Sarah Ahmed', text: 'Dr., we have a new admission in bed 4.', timestamp: '10:30 AM', status: 'READ', isMe: false },
    { id: 'M2', senderId: 'Me', text: 'I will be there in 5 mins. Did you start the IV?', timestamp: '10:32 AM', status: 'READ', isMe: true },
    { id: 'M3', senderId: 'SA', senderName: 'Dr. Sarah Ahmed', text: 'Yes, saline started. Vitals are stable but BP is slightly elevated 140/90.', timestamp: '10:33 AM', status: 'READ', isMe: false },
    { id: 'M4', senderId: 'SA', senderName: 'Dr. Sarah Ahmed', text: 'Please check patient 88219 ECG.', timestamp: '10:42 AM', status: 'READ', isMe: false },
  ],
  "C-2": [
    { 
      id: 'M5', senderId: 'RN1', senderName: 'Nurse Fatima', text: 'Night shift handover for Bed 4', 
      timestamp: '08:10 AM', status: 'READ', isMe: false,
      attachmentType: 'SBAR',
      attachmentData: {
        situation: 'Patient admitted with acute respiratory distress',
        background: 'History of COPD, current exacerbation',
        assessment: 'O2 sats at 88% on RA, increased WOB',
        recommendation: 'Start nebulizers, consider BIPAP if no improvement'
      }
    },
    { id: 'M6', senderId: 'MD1', senderName: 'Dr. Khalid', text: 'Received. Will review in 10 mins.', timestamp: '08:12 AM', status: 'READ', isMe: false },
    { id: 'M7', senderId: 'RN1', senderName: 'Nurse Fatima', text: 'All stable. SBAR attached for bed 4.', timestamp: '08:15 AM', status: 'DELIVERED', isMe: false },
  ],
  "C-3": [
    { 
      id: 'M8', senderId: 'LAB', senderName: 'Lab System Auto-Alert', text: 'Critical Lab Value', 
      timestamp: 'Yesterday 14:30', status: 'READ', isMe: false, priority: 'CRITICAL',
      attachmentType: 'LAB_RESULT',
      attachmentData: { test: 'Potassium', result: '5.8 mEq/L', flag: 'High', ref: '3.5 - 5.0' }
    },
    { id: 'M9', senderId: 'Me', text: 'Noted. Holding Aldactone.', timestamp: 'Yesterday 14:35', status: 'READ', isMe: true },
  ]
};

export default function ClinicalCommunication({ language, onClose }: Props) {
  const isAr = language === 'ar';
  
  const [activeChat, setActiveChat] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOffline, setIsOffline] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  
  // Modals & Menus
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showPatientContext, setShowPatientContext] = useState(false);
  
  // Compose Modals
  const [showSbarModal, setShowSbarModal] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  
  const [sbarData, setSbarData] = useState({ situation: '', background: '', assessment: '', recommendation: '' });

  const [messagePriority, setMessagePriority] = useState<MessagePriority>('NORMAL');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat, messages, isTyping]);

  // Recording timer
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);
  
  // Simulate random typing
  useEffect(() => {
    if (!activeChat || activeChat.type === 'PATIENT_CONTEXT') return;
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [activeChat]);

  // Simulate network drops
  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    }
  }, []);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() && !isRecording && !showSbarModal) return;
    if (!activeChat) return;

    let attachType: AttachmentType | undefined = undefined;
    let attachData: any = undefined;

    if (isRecording) {
      attachType = 'VOICE';
      attachData = { duration: recordingTime };
    } else if (showSbarModal) {
      attachType = 'SBAR';
      attachData = { ...sbarData };
    }

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'Me',
      text: showSbarModal ? 'SBAR Handover Note' : (isRecording ? 'Voice Note' : messageInput.trim()),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: isOffline ? 'SENT' : 'DELIVERED',
      isMe: true,
      priority: messagePriority,
      attachmentType: attachType,
      attachmentData: attachData,
      replyToId: replyingTo?.id
    };
    
    setMessages(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMsg]
    }));
    
    // Reset states
    setMessageInput('');
    setIsRecording(false);
    setShowAttachMenu(false);
    setReplyingTo(null);
    setMessagePriority('NORMAL');
    
    if (showSbarModal) {
      setShowSbarModal(false);
      setSbarData({ situation: '', background: '', assessment: '', recommendation: '' });
    }
    
    if (!isOffline) {
      // Simulate network delay for read receipt
      setTimeout(() => {
        setMessages(prev => {
          const currentMsgs = prev[activeChat.id] || [];
          return {
            ...prev,
            [activeChat.id]: currentMsgs.map(m => m.id === newMsg.id ? { ...m, status: 'READ' } : m)
          };
        });
      }, 2500);
    }
  };

  const currentMessages = activeChat ? (messages[activeChat.id] || []) : [];

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return \`\${m}:\${s}\`;
  };

  // Render Attachment block based on type
  const renderAttachment = (msg: ChatMessage) => {
    if (!msg.attachmentType) return null;
    
    switch (msg.attachmentType) {
      case 'LAB_RESULT':
        return (
          <div className={\`mt-2 p-3 rounded-xl border text-sm \${msg.isMe ? 'bg-indigo-700 border-indigo-500 text-indigo-50' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
            <div className="flex items-center gap-2 mb-2 font-bold pb-2 border-b border-current/20">
              <FlaskConical size={16} />
              {isAr ? "نتيجة مخبرية" : "Lab Result"}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="opacity-70 block text-[10px] uppercase">{isAr ? "التحليل" : "Test"}</span>
                <span className="font-bold">{msg.attachmentData?.test}</span>
              </div>
              <div>
                <span className="opacity-70 block text-[10px] uppercase">{isAr ? "النتيجة" : "Result"}</span>
                <span className={\`font-bold \${msg.priority === 'CRITICAL' || msg.attachmentData?.flag === 'High' ? 'text-rose-500' : ''}\`}>
                  {msg.attachmentData?.result}
                </span>
              </div>
            </div>
          </div>
        );
      case 'SBAR':
        return (
          <div className={\`mt-2 p-3 rounded-xl border text-xs \${msg.isMe ? 'bg-indigo-700/80 border-indigo-500 text-indigo-50' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
            <div className="flex items-center gap-2 mb-2 font-bold pb-2 border-b border-current/20">
              <FileText size={16} />
              {isAr ? "تسليم SBAR" : "SBAR Handover"}
            </div>
            <div className="space-y-2">
              <div><span className="font-bold opacity-80">S:</span> {msg.attachmentData?.situation}</div>
              <div><span className="font-bold opacity-80">B:</span> {msg.attachmentData?.background}</div>
              <div><span className="font-bold opacity-80">A:</span> {msg.attachmentData?.assessment}</div>
              <div><span className="font-bold opacity-80">R:</span> {msg.attachmentData?.recommendation}</div>
            </div>
          </div>
        );
      case 'VOICE':
        return (
          <div className={\`mt-2 flex items-center gap-3 p-2 rounded-full border \${msg.isMe ? 'bg-indigo-700/50 border-indigo-500 text-white' : 'bg-slate-100 border-slate-200 text-slate-800'}\`}>
            <button className="w-8 h-8 rounded-full bg-current/20 flex items-center justify-center hover:bg-current/30 transition shrink-0">
              <Play size={14} className="fill-current" />
            </button>
            <div className="flex-1 h-1.5 bg-current/30 rounded-full overflow-hidden w-24 sm:w-32">
               <div className="w-1/3 h-full bg-current rounded-full" />
            </div>
            <span className="text-[10px] font-bold opacity-80 px-2 shrink-0">
              {formatTime(msg.attachmentData?.duration || 0)}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10 relative">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              {isAr ? "التواصل السريري" : "Clinical Comm."}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {isAr ? "مراسلات مشفرة (HIPAA)" : "HIPAA Compliant E2EE"}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {onClose && (
            <button onClick={onClose} className="p-2 sm:p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg sm:rounded-xl transition-colors">
              {isAr ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
            </button>
          )}
          <button 
            onClick={() => setShowNewChatModal(true)}
            className="hidden sm:flex px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-colors items-center gap-2"
          >
            <Plus size={16} />
            {isAr ? "محادثة جديدة" : "New Chat"}
          </button>
          <button 
            onClick={() => setShowNewChatModal(true)}
            className="sm:hidden p-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Offline Banner */}
      <AnimatePresence>
        {isOffline && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="bg-rose-500 text-white px-4 py-1.5 flex items-center justify-center gap-2 text-xs font-bold"
          >
            <WifiOff size={14} />
            {isAr ? "لا يوجد اتصال بالإنترنت. يتم حفظ الرسائل محلياً." : "No internet connection. Messages saved locally."}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Sidebar: Chat List */}
        <div className={\`\${activeChat ? 'hidden lg:flex' : 'flex'} w-full lg:w-80 xl:w-96 bg-white border-\${isAr ? 'l' : 'r'} border-slate-200 flex-col shrink-0 z-10\`}>
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <Search className={\`absolute top-1/2 -translate-y-1/2 \${isAr ? 'right-3' : 'left-3'} w-4 h-4 text-slate-400\`} />
              <input 
                type="text" 
                placeholder={isAr ? "بحث بالاسم، القسم، أو MRN..." : "Search name, dept, or MRN..."} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={\`w-full \${isAr ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium\`} 
              />
            </div>
            
            <div className="flex gap-2 mt-4 overflow-x-auto custom-scrollbar pb-1">
              {['ALL', 'DIRECT', 'GROUP', 'PATIENTS', 'ON CALL'].map((filter) => (
                <button key={filter} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors">
                  {filter}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {MOCK_CHATS.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.subtitle.toLowerCase().includes(searchQuery.toLowerCase())).map((chat) => (
              <div 
                key={chat.id}
                onClick={() => { setActiveChat(chat); setShowPatientContext(false); }}
                className={\`p-4 border-b border-slate-50 cursor-pointer transition-all flex items-center gap-3 \${activeChat?.id === chat.id ? 'bg-indigo-50/80 relative' : 'hover:bg-slate-50'}\`}
              >
                {activeChat?.id === chat.id && (
                  <div className={\`absolute top-0 bottom-0 \${isAr ? 'right-0' : 'left-0'} w-1.5 bg-indigo-600 rounded-r-full\`} />
                )}
                
                <div className="relative shrink-0">
                  <div className={\`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shadow-inner \${
                    chat.type === 'DIRECT' ? 'bg-indigo-100 text-indigo-700' :
                    chat.type === 'GROUP' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-rose-100 text-rose-700'
                  }\`}>
                    {chat.type === 'DIRECT' && !chat.avatarText ? <User size={20} /> : chat.avatarText}
                  </div>
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-[2.5px] border-white" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className="font-bold text-slate-800 text-sm truncate pr-2">{chat.title}</h3>
                    <span className="text-[10px] font-bold text-slate-400 shrink-0">{chat.lastMessageTime}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <p className={\`text-xs truncate \${chat.unreadCount > 0 ? 'text-slate-800 font-bold' : 'text-slate-500'}\`}>
                      {chat.lastMessage}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="bg-indigo-600 text-white text-[10px] font-black min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full shrink-0 shadow-md">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        {activeChat ? (
          <div className={\`\${activeChat ? 'flex' : 'hidden lg:flex'} flex-1 flex-col min-w-0 bg-white relative\`}>
            
            {/* Chat Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-white/90 backdrop-blur-md z-10 shadow-[0_2px_10px_rgba(0,0,0,0.02)] sticky top-0">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <button 
                  onClick={() => setActiveChat(null)}
                  className="lg:hidden p-1.5 -ml-1.5 text-slate-500 hover:bg-slate-100 rounded-lg shrink-0"
                >
                  {isAr ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                </button>
                <div className={\`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-inner shrink-0 \${
                  activeChat.type === 'DIRECT' ? 'bg-indigo-100 text-indigo-700' :
                  activeChat.type === 'GROUP' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-rose-100 text-rose-700'
                }\`}>
                  {activeChat.avatarText}
                </div>
                <div className="min-w-0">
                  <h2 className="font-black text-slate-800 truncate text-sm sm:text-base">{activeChat.title}</h2>
                  <div className="flex items-center gap-1.5 truncate">
                    {activeChat.isOnline && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    )}
                    <p className="text-[10px] sm:text-xs font-bold text-slate-500 truncate">{activeChat.subtitle}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                <button className="p-2 sm:p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition">
                  <Phone size={18} />
                </button>
                <button className="p-2 sm:p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition hidden sm:block">
                  <Video size={18} />
                </button>
                {activeChat.type === 'PATIENT_CONTEXT' && (
                  <button 
                    onClick={() => setShowPatientContext(!showPatientContext)}
                    className={\`p-2 sm:p-2.5 rounded-xl transition sm:ml-2 \${showPatientContext ? 'bg-rose-100 text-rose-700' : 'text-rose-500 hover:bg-rose-50 border border-rose-100'}\`}
                  >
                    <Activity size={18} />
                  </button>
                )}
                <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />
                <button className="p-2 sm:p-2.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Context Banner if Patient Chat */}
            {activeChat.type === 'PATIENT_CONTEXT' && !showPatientContext && (
              <div className="bg-rose-50 border-b border-rose-100 px-4 sm:px-6 py-2 flex items-center gap-2 sm:gap-3 shrink-0 cursor-pointer hover:bg-rose-100/50 transition-colors" onClick={() => setShowPatientContext(true)}>
                <Stethoscope size={16} className="text-rose-600 shrink-0" />
                <span className="text-[10px] sm:text-xs font-bold text-rose-800 truncate">
                  {isAr ? "المريض مرتبط بهذا السياق. اضغط لعرض الملخص السريري." : "Patient context linked. Click to view clinical summary."}
                </span>
                <ArrowRight size={14} className={\`text-rose-600 shrink-0 ml-auto \${isAr ? 'rotate-180' : ''}\`} />
              </div>
            )}

            <div className="flex-1 flex overflow-hidden">
              {/* Messages Area */}
              <div className="flex-1 flex flex-col relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-50/50">
                <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 custom-scrollbar" ref={chatContainerRef}>
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <span className="bg-white border border-slate-200 shadow-sm text-slate-500 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-3 py-1 sm:px-4 sm:py-1.5 rounded-full">
                      {isAr ? "اليوم" : "Today"}
                    </span>
                  </div>
                  
                  <AnimatePresence initial={false}>
                    {currentMessages.map((msg, index) => {
                      const showSenderName = !msg.isMe && activeChat.type === 'GROUP' && 
                        (index === 0 || currentMessages[index-1].senderId !== msg.senderId);
                      
                      const isReply = msg.replyToId;
                      const replyMsg = isReply ? currentMessages.find(m => m.id === msg.replyToId) : null;
                        
                      return (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          key={msg.id} 
                          className={\`flex group \${msg.isMe ? 'justify-end' : 'justify-start'}\`}
                        >
                          {!msg.isMe && (
                            <div className={\`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold shrink-0 \${isAr ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'} mt-1 shadow-sm \${
                              msg.senderId === 'LAB' ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-200 text-slate-700'
                            }\`}>
                              {msg.senderId}
                            </div>
                          )}
                          
                          <div className={\`flex flex-col \${msg.isMe ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[70%]\`}>
                            {showSenderName && (
                              <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 mb-1 mx-1">{msg.senderName}</span>
                            )}
                            
                            <div className="flex items-center gap-2">
                              {/* Message Actions (Hover) */}
                              {msg.isMe && (
                                <div className="hidden group-hover:flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => setReplyingTo(msg)} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-50"><Reply size={14} /></button>
                                  <button className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-50"><Forward size={14} /></button>
                                </div>
                              )}

                              <div 
                                className={\`px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl shadow-sm relative \${
                                  msg.priority === 'CRITICAL' ? 'bg-rose-50 border border-rose-200 text-rose-900 rounded-tl-none ring-1 ring-rose-500/20' :
                                  msg.priority === 'URGENT' ? 'bg-amber-50 border border-amber-200 text-amber-900 rounded-tl-none ring-1 ring-amber-500/20' :
                                  msg.isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 
                                  'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                                }\`}
                              >
                                {msg.priority === 'CRITICAL' && (
                                  <div className="flex items-center gap-1 text-rose-600 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-1.5 pb-1.5 border-b border-rose-100/50">
                                    <AlertOctagon size={12} className="animate-pulse" />
                                    {isAr ? "رسالة حرجة (إشعار طوارئ)" : "Critical Alert (Page)"}
                                  </div>
                                )}
                                {msg.priority === 'URGENT' && (
                                  <div className="flex items-center gap-1 text-amber-600 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-1.5 pb-1.5 border-b border-amber-100/50">
                                    <AlertTriangle size={12} />
                                    {isAr ? "عاجل" : "Urgent"}
                                  </div>
                                )}

                                {replyMsg && (
                                  <div className={\`mb-2 p-2 rounded-lg text-xs border-l-2 \${msg.isMe ? 'bg-white/10 border-white/50 text-white/90' : 'bg-slate-50 border-indigo-500 text-slate-600'}\`}>
                                    <span className="font-bold text-[9px] block mb-0.5 opacity-80">{replyMsg.isMe ? (isAr ? 'أنت' : 'You') : replyMsg.senderName || replyMsg.senderId}</span>
                                    <span className="line-clamp-1">{replyMsg.text || (replyMsg.attachmentType ? \`[\${replyMsg.attachmentType}]\` : '')}</span>
                                  </div>
                                )}
                                
                                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                
                                {renderAttachment(msg)}
                              </div>

                              {/* Message Actions (Hover) - Left side for others */}
                              {!msg.isMe && (
                                <div className="hidden group-hover:flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => setReplyingTo(msg)} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-50"><Reply size={14} /></button>
                                  <button className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-50"><Copy size={14} /></button>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-1.5 mt-1 px-1">
                              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400">{msg.timestamp}</span>
                              {msg.isMe && (
                                <span className={\`\${msg.status === 'READ' ? 'text-indigo-500' : 'text-slate-300'}\`}>
                                  {msg.status === 'SENT' ? <Check size={12} /> : <CheckCheck size={12} />}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    
                    {/* Typing Indicator */}
                    {isTyping && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                        className={\`flex justify-start\`}
                      >
                         <div className={\`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 \${isAr ? 'ml-2' : 'mr-2'} mt-1\`}>
                           <MoreVertical size={14} />
                         </div>
                         <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                            <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, delay: 0, duration: 0.8 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                            <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, delay: 0.2, duration: 0.8 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                            <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, delay: 0.4, duration: 0.8 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply Banner */}
                <AnimatePresence>
                  {replyingTo && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="bg-slate-100 border-t border-slate-200 px-4 py-2 flex items-center justify-between z-10"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Reply size={16} className="text-indigo-500 shrink-0" />
                        <div className="min-w-0 border-l-2 border-indigo-500 pl-2 ml-1">
                          <span className="text-[10px] font-bold text-indigo-700 block">{replyingTo.isMe ? (isAr ? 'أنت' : 'You') : replyingTo.senderName || replyingTo.senderId}</span>
                          <span className="text-xs text-slate-600 truncate block">{replyingTo.text || (replyingTo.attachmentType ? \`[\${replyingTo.attachmentType}]\` : '')}</span>
                        </div>
                      </div>
                      <button onClick={() => setReplyingTo(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200"><X size={16} /></button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Input Area */}
                <div className="p-3 sm:p-4 bg-white border-t border-slate-200 z-20">
                  <form 
                    onSubmit={handleSendMessage}
                    className={\`relative flex items-end gap-1.5 sm:gap-2 bg-slate-50 p-1.5 sm:p-2 rounded-2xl border transition-all shadow-sm \${
                      messagePriority === 'CRITICAL' ? 'border-rose-300 ring-2 ring-rose-500/20 bg-rose-50/30' :
                      messagePriority === 'URGENT' ? 'border-amber-300 ring-2 ring-amber-500/20 bg-amber-50/30' :
                      'border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20'
                    }\`}
                  >
                    {!isRecording ? (
                      <>
                        <div className="flex items-center gap-1 p-0.5 sm:p-1 shrink-0 relative">
                          <button 
                            type="button" 
                            onClick={() => setShowAttachMenu(!showAttachMenu)}
                            className={\`p-1.5 sm:p-2 rounded-xl transition \${showAttachMenu ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 hover:text-indigo-600 hover:bg-white'}\`}
                          >
                            <Plus size={20} className={\`transition-transform \${showAttachMenu ? 'rotate-45' : ''}\`} />
                          </button>
                          
                          {/* Attach Menu Popover */}
                          <AnimatePresence>
                            {showAttachMenu && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={\`absolute bottom-full mb-4 \${isAr ? 'right-0' : 'left-0'} w-48 sm:w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 p-2 z-50\`}
                              >
                                {[
                                  { icon: FileText, labelAr: "نموذج SBAR", labelEn: "SBAR Note", color: "text-purple-500", action: () => { setShowSbarModal(true); setShowAttachMenu(false); } },
                                  { icon: ImageIcon, labelAr: "صورة", labelEn: "Image", color: "text-blue-500" },
                                  { icon: FlaskConical, labelAr: "نتيجة مخبرية", labelEn: "Lab Result", color: "text-cyan-500" },
                                  { icon: PaperclipIcon, labelAr: "مستند", labelEn: "Document", color: "text-slate-500" },
                                ].map((item, i) => (
                                  <button key={i} type="button" onClick={item.action} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl transition text-xs sm:text-sm font-bold text-slate-700 text-left">
                                    <item.icon size={16} className={item.color} />
                                    {isAr ? item.labelAr : item.labelEn}
                                  </button>
                                ))}
                                <div className="h-px bg-slate-100 my-1 mx-2" />
                                <div className="px-3 py-1 text-[10px] font-black uppercase text-slate-400 tracking-wider mt-1">{isAr ? "أولوية الرسالة" : "Message Priority"}</div>
                                <button type="button" onClick={() => { setMessagePriority('URGENT'); setShowAttachMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-amber-50 text-amber-700 rounded-xl transition text-xs font-bold text-left">
                                  <AlertTriangle size={14} /> {isAr ? "عاجل" : "Urgent"}
                                </button>
                                <button type="button" onClick={() => { setMessagePriority('CRITICAL'); setShowAttachMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-rose-50 text-rose-700 rounded-xl transition text-xs font-bold text-left">
                                  <AlertOctagon size={14} /> {isAr ? "حرج (إشعار فوري)" : "Critical (Page)"}
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        <textarea
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          placeholder={
                            messagePriority === 'CRITICAL' ? (isAr ? "اكتب رسالة حرجة..." : "Type CRITICAL message...") :
                            messagePriority === 'URGENT' ? (isAr ? "اكتب رسالة عاجلة..." : "Type URGENT message...") :
                            (isAr ? "اكتب رسالة سريرية آمنة..." : "Type a secure clinical message...")
                          }
                          className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2.5 sm:py-3 px-2 text-xs sm:text-sm font-medium text-slate-800 max-h-32 min-h-[40px] custom-scrollbar placeholder:text-slate-400"
                          rows={1}
                          dir="auto"
                        />
                        
                        <div className="p-0.5 sm:p-1 shrink-0 flex items-center gap-1">
                          {messagePriority !== 'NORMAL' && (
                            <button type="button" onClick={() => setMessagePriority('NORMAL')} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition">
                              <X size={16} />
                            </button>
                          )}
                          {messageInput.trim() ? (
                            <button 
                              type="submit"
                              className={\`p-2.5 sm:p-3 text-white rounded-xl transition shadow-md \${
                                messagePriority === 'CRITICAL' ? 'bg-rose-600 hover:bg-rose-700' :
                                messagePriority === 'URGENT' ? 'bg-amber-600 hover:bg-amber-700' :
                                'bg-indigo-600 hover:bg-indigo-700'
                              }\`}
                            >
                              <Send size={16} className={isAr ? 'rotate-180' : ''} />
                            </button>
                          ) : (
                            <button 
                              type="button"
                              onClick={() => setIsRecording(true)}
                              className="p-2.5 sm:p-3 bg-white text-slate-500 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition shadow-sm border border-slate-200"
                            >
                              <Mic size={16} />
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-between p-1 sm:p-2">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <motion.div 
                            animate={{ scale: [1, 1.2, 1] }} 
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-rose-500 rounded-full ml-2"
                          />
                          <span className="text-xs sm:text-sm font-black text-rose-600 font-mono tracking-wider">
                            {formatTime(recordingTime)}
                          </span>
                          <span className="text-[10px] sm:text-xs font-bold text-slate-500 animate-pulse hidden sm:inline">
                            {isAr ? "جاري التسجيل..." : "Recording..."}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <button 
                            type="button" 
                            onClick={() => setIsRecording(false)}
                            className="p-2 sm:p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                          >
                            <Trash size={16} />
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleSendMessage()}
                            className="p-2 sm:p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-md flex items-center gap-2"
                          >
                            <Send size={16} className={isAr ? 'rotate-180' : ''} />
                            <span className="text-xs font-bold hidden sm:inline">{isAr ? "إرسال" : "Send"}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* Patient Context Sidebar Drawer */}
              <AnimatePresence>
                {showPatientContext && activeChat.type === 'PATIENT_CONTEXT' && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 320, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className={\`hidden xl:flex bg-white border-\${isAr ? 'r' : 'l'} border-slate-200 shrink-0 overflow-y-auto custom-scrollbar flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.02)]\`}
                  >
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10 flex justify-between items-center">
                      <h3 className="font-black text-slate-800 flex items-center gap-2 text-sm">
                        <User size={16} className="text-indigo-600" />
                        {isAr ? "الملف السريري المصغر" : "Clinical Mini-Profile"}
                      </h3>
                      <button onClick={() => setShowPatientContext(false)} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                    <div className="p-5 space-y-5">
                      {/* Patient ID */}
                      <div className="text-center">
                         <div className="w-20 h-20 bg-indigo-50 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-black text-indigo-300 ring-4 ring-white shadow-sm">
                           AK
                         </div>
                         <h4 className="font-black text-slate-900 text-lg">Ahmad K.</h4>
                         <p className="text-xs font-bold text-slate-500 mb-3">MRN: {activeChat.patientId} • 45 Y/O • Male</p>
                         <div className="flex justify-center gap-1.5 flex-wrap">
                           <span className="text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full border border-rose-100 flex items-center gap-1"><AlertTriangle size={10}/> Allergy: Penicillin</span>
                           <span className="text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-100">Fall Risk</span>
                         </div>
                      </div>

                      {/* Vitals */}
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1 flex items-center gap-1.5">
                          <Activity size={12} /> {isAr ? "العلامات الحيوية (آخر 4 ساعات)" : "Vitals (Last 4h)"}
                        </h4>
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-sm">
                          <div className="flex justify-between p-3 text-sm">
                            <span className="font-medium text-slate-600 flex items-center gap-2"><HeartPulse size={14} className="text-rose-500" /> BP</span>
                            <span className="font-black text-slate-800">140/90 <span className="text-[10px] text-rose-500 font-bold ml-1">↑ High</span></span>
                          </div>
                          <div className="flex justify-between p-3 text-sm">
                            <span className="font-medium text-slate-600 flex items-center gap-2"><Activity size={14} className="text-emerald-500" /> HR</span>
                            <span className="font-black text-slate-800">82 bpm</span>
                          </div>
                          <div className="flex justify-between p-3 text-sm">
                            <span className="font-medium text-slate-600 flex items-center gap-2"><Flame size={14} className="text-orange-500" /> Temp</span>
                            <span className="font-black text-slate-800">37.2 °C</span>
                          </div>
                        </div>
                      </div>

                      {/* Active Meds */}
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1 flex items-center gap-1.5">
                          <CheckCircle2 size={12} /> {isAr ? "الأدوية النشطة" : "Active Meds"}
                        </h4>
                        <div className="space-y-2">
                          <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs">
                            <span className="font-bold text-slate-800 block">Lisinopril 10mg</span>
                            <span className="text-slate-500">PO Daily • 08:00 AM</span>
                          </div>
                          <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs">
                            <span className="font-bold text-slate-800 block">Metformin 500mg</span>
                            <span className="text-slate-500">PO BID • w/ Meals</span>
                          </div>
                        </div>
                      </div>
                      
                      <button className="w-full py-3 bg-indigo-50 text-indigo-700 font-black text-xs uppercase tracking-widest rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2 mt-4 shadow-sm">
                        {isAr ? "فتح الملف الإلكتروني (EMR)" : "Open Full EMR"}
                        <ArrowRight size={14} className={isAr ? "rotate-180" : ""} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-slate-50 text-slate-400 space-y-5">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-100 rounded-full flex items-center justify-center shadow-inner">
              <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300" />
            </div>
            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-black text-slate-600">{isAr ? "اختر محادثة" : "Select a conversation"}</h3>
              <p className="text-sm font-medium mt-1 text-slate-500">{isAr ? "للبدء في التواصل السريري الآمن" : "to start secure clinical messaging"}</p>
            </div>
          </div>
        )}
      </div>

      {/* SBAR Compose Modal */}
      <AnimatePresence>
        {showSbarModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-black text-slate-800 flex items-center gap-2">
                  <FileText className="text-indigo-600" size={18} />
                  {isAr ? "إرسال نموذج SBAR" : "Compose SBAR Handover"}
                </h3>
                <button onClick={() => setShowSbarModal(false)} className="p-2 hover:bg-slate-200 rounded-xl text-slate-500 transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">
                    S - {isAr ? "الموقف (Situation)" : "Situation"}
                  </label>
                  <textarea 
                    value={sbarData.situation} onChange={e => setSbarData({...sbarData, situation: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none resize-none h-20"
                    placeholder={isAr ? "ما الذي يحدث الآن؟" : "What is happening right now?"}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">
                    B - {isAr ? "الخلفية (Background)" : "Background"}
                  </label>
                  <textarea 
                    value={sbarData.background} onChange={e => setSbarData({...sbarData, background: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none resize-none h-20"
                    placeholder={isAr ? "التاريخ الطبي، التشخيص، إلخ." : "Clinical background, context, history..."}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">
                    A - {isAr ? "التقييم (Assessment)" : "Assessment"}
                  </label>
                  <textarea 
                    value={sbarData.assessment} onChange={e => setSbarData({...sbarData, assessment: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none resize-none h-20"
                    placeholder={isAr ? "ما هي المشكلة برأيك؟" : "What do you think the problem is?"}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">
                    R - {isAr ? "التوصية (Recommendation)" : "Recommendation"}
                  </label>
                  <textarea 
                    value={sbarData.recommendation} onChange={e => setSbarData({...sbarData, recommendation: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none resize-none h-20"
                    placeholder={isAr ? "ما الذي تطلبه أو توصي به؟" : "What would you recommend we do?"}
                  />
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button onClick={() => setShowSbarModal(false)} className="px-5 py-2.5 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-xl transition">
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button 
                  onClick={() => handleSendMessage()}
                  disabled={!sbarData.situation || !sbarData.recommendation}
                  className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md flex items-center gap-2"
                >
                  <Send size={16} className={isAr ? 'rotate-180' : ''}/>
                  {isAr ? "إرسال SBAR" : "Send SBAR"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New Chat Directory Modal */}
      <AnimatePresence>
        {showNewChatModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col h-[70vh]"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
                <h3 className="font-black flex items-center gap-2">
                  <Users size={18} />
                  {isAr ? "الدليل وبدء محادثة" : "Directory & New Chat"}
                </h3>
                <button onClick={() => setShowNewChatModal(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <div className="relative">
                  <Search className={\`absolute top-1/2 -translate-y-1/2 \${isAr ? 'right-3' : 'left-3'} w-4 h-4 text-slate-400\`} />
                  <input 
                    type="text" 
                    placeholder={isAr ? "ابحث عن موظف، قسم، أو فريق استدعاء..." : "Search staff, dept, or on-call team..."} 
                    className={\`w-full \${isAr ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium\`} 
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* On Call Groups */}
                <div className="px-4 py-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{isAr ? "فِرق الاستدعاء (On-Call)" : "On-Call Teams"}</h4>
                  <div className="space-y-1.5">
                    <div className="p-3 bg-white border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 rounded-xl cursor-pointer flex items-center gap-3 transition">
                      <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">ER</div>
                      <div>
                        <div className="font-bold text-sm text-slate-800">{isAr ? "فريق طوارئ القلب" : "Code Blue Team"}</div>
                        <div className="text-xs text-slate-500">6 Members • Available</div>
                      </div>
                    </div>
                    <div className="p-3 bg-white border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 rounded-xl cursor-pointer flex items-center gap-3 transition">
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">NS</div>
                      <div>
                        <div className="font-bold text-sm text-slate-800">{isAr ? "استشاري الأعصاب المناوب" : "Neurology On-Call"}</div>
                        <div className="text-xs text-slate-500">Dr. M. Hassan (Pager 442)</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Directory */}
                <div className="px-4 py-3 border-t border-slate-100">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{isAr ? "الدليل" : "Directory"}</h4>
                  <div className="space-y-1.5">
                    {[
                      { name: "Dr. Ali Youssef", role: "Attending Physician", dept: "Internal Med", initials: "AY" },
                      { name: "RN. Sara Kamal", role: "Charge Nurse", dept: "ICU", initials: "SK" },
                      { name: "Ph. Ramy Zaki", role: "Clinical Pharmacist", dept: "Pharmacy", initials: "RZ" }
                    ].map((user, i) => (
                      <div key={i} className="p-3 bg-white border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 rounded-xl cursor-pointer flex items-center gap-3 transition">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">{user.initials}</div>
                        <div className="flex-1">
                          <div className="font-bold text-sm text-slate-800">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.role} • {user.dept}</div>
                        </div>
                        <button className="text-indigo-600 font-bold text-xs uppercase tracking-widest hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition">
                          {isAr ? "محادثة" : "Chat"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
`

fs.writeFileSync('src/components/ClinicalCommunication.tsx', code);
