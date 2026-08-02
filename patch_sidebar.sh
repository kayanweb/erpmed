sed -i '/activeTab === "ai_assistant"/!b;n;n;n;n;a\
                {/* Enterprise Simulator */}\
                <button\
                  onClick={() => setActiveTab("enterprise_simulator")}\
                  className={`w-full flex items-center gap-3 px-4 py-2 text-right text-xs font-semibold transition-all rounded-lg ${\
                    activeTab === "enterprise_simulator" ? "bg-indigo-600 text-white font-bold shadow-sm" : "text-slate-300 hover:bg-white/10 hover:text-white"\
                  }`}\
                >\
                  <Zap className="h-4 w-4 shrink-0 text-yellow-400" />\
                  <span className="flex-1 text-right">{language === "ar" ? "محاكي النظام المؤسسي" : "Enterprise System Simulator"}</span>\
                </button>
' src/App.tsx
