import React, { useState } from "react";
import { MessageSquare, Send, Bot, User, Bed, Search } from "lucide-react";

export default function AdminChatbot({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      textAr: "مرحباً! أنا المساعد الذكي. كيف يمكنني مساعدتك اليوم؟ يمكنك سؤالي عن توفر الأسرة أو حالة أي طلب.",
      textEn: "Hello! I am your Smart Assistant. How can I help you? You can ask me about bed availability or request statuses."
    }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      sender: "user",
      textAr: input,
      textEn: input
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: "bot",
        textAr: "يوجد حالياً 3 أسرة شاغرة في قسم الجراحة (Ward A)، وسرير واحد في العناية المركزة (ICU). هل تريد حجز سرير؟",
        textEn: "There are currently 3 vacant beds in Surgery (Ward A) and 1 bed in ICU. Would you like to reserve a bed?"
      }]);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade font-sans h-full flex flex-col" dir={isAr ? "rtl" : "ltr"}>
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl text-white shrink-0">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Bot className="h-6 w-6 text-blue-400" />
          {isAr ? "الروبوت المحادث للموظفين (Admin Chatbot)" : "Admin Chatbot"}
        </h2>
        <p className="text-slate-400">
          {isAr 
            ? "استفسر عن توفر الأسرة أو حالة الطلبات بدلاً من الاتصال التليفوني." 
            : "Inquire about bed availability or request statuses instantly without phone calls."}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden min-h-0" style={{ minHeight: "500px" }}>
        {/* Quick Actions */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex gap-2 overflow-x-auto">
          <button onClick={() => setInput(isAr ? "ما هي الأسرة الشاغرة الآن؟" : "What beds are vacant now?")} className="shrink-0 bg-white border border-slate-200 px-4 py-2 rounded-full text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
            <Bed className="h-4 w-4 text-blue-600" />
            {isAr ? "توفر الأسرة" : "Bed Availability"}
          </button>
          <button onClick={() => setInput(isAr ? "حالة طلبات الصيانة بالقسم" : "Maintenance requests status")} className="shrink-0 bg-white border border-slate-200 px-4 py-2 rounded-full text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
            <Search className="h-4 w-4 text-purple-600" />
            {isAr ? "حالة الطلبات" : "Request Status"}
          </button>
        </div>

        {/* Chat Window */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[80%] ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${m.sender === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'}`}>
                  {m.sender === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>
                <div className={`p-4 rounded-2xl ${m.sender === 'user' ? 'bg-blue-600 text-white rounded-tl-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tr-none shadow-sm'}`}>
                  <p>{isAr ? m.textAr : m.textEn}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
          <div className="flex items-center gap-2 relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isAr ? "اكتب سؤالك هنا..." : "Type your question here..."}
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleSend}
              className={`p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors ${!input.trim() && 'opacity-50 cursor-not-allowed'}`}
              disabled={!input.trim()}
            >
              <Send className={`h-5 w-5 ${isAr ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
