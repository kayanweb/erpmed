sed -i '8425,8438c \
              <div className="space-y-1 pl-1 pr-1">\
                {/* 13. المساعد الذكي */}\
                <button\
                  onClick={() => setActiveTab("ai_assistant")}\
                  className={`w-full flex items-center gap-3 px-4 py-2 text-right text-xs font-semibold transition-all rounded-lg ${\
                    activeTab === "ai_assistant" ? "bg-indigo-600 text-white font-bold shadow-sm" : "text-slate-300 hover:bg-white/10 hover:text-white"\
                  }`}\
                >\
                  <Sparkles className="h-4 w-4 shrink-0 text-indigo-400" />\
                  <span className="flex-1 text-right">{language === "ar" ? "المساعد الذكي (AI)" : "Smart AI Assistant"}</span>\
                </button>\
                \
                {/* 13.0. الهيكل التنظيمي للمنشأة */}\
                <button\
                  onClick={() => setActiveTab("org_structure")}\
                  className={`w-full flex items-center gap-3 px-4 py-2 text-right text-xs font-semibold transition-all rounded-lg ${' src/App.tsx
