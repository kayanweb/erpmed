sed -i '8214i \
          {/* Enterprise Evolution Phase */}\
          <div className="space-y-1 mb-4">\
            <div className="px-4 mb-2.5 text-[11px] font-bold text-yellow-400 uppercase tracking-wider font-sans">\
              {language === "ar" ? "نواة نظام HIS المؤسسي (الجديد)" : "Enterprise HIS Core (NEW)"}\
            </div>\
            <button\
              onClick={() => setActiveTab("enterprise_simulator")}\
              className={`w-full flex items-center gap-3 px-4 py-2 text-right text-xs font-semibold transition-all rounded-lg ${\
                activeTab === "enterprise_simulator" ? "bg-yellow-600 text-white font-bold shadow-sm" : "text-slate-300 hover:bg-white/10 hover:text-white"\
              }`}\
            >\
              <Zap className="h-4 w-4 shrink-0 text-yellow-400" />\
              <span className="flex-1 text-right">{language === "ar" ? "محاكي مسار المريض (Event-Driven)" : "Patient Journey Simulator"}</span>\
            </button>\
            <button\
              onClick={() => setActiveTab("mpi_dashboard")}\
              className={`w-full flex items-center gap-3 px-4 py-2 text-right text-xs font-semibold transition-all rounded-lg ${\
                activeTab === "mpi_dashboard" ? "bg-indigo-600 text-white font-bold shadow-sm" : "text-slate-300 hover:bg-white/10 hover:text-white"\
              }`}\
            >\
              <UserSquare className="h-4 w-4 shrink-0 text-indigo-400" />\
              <span className="flex-1 text-right">{language === "ar" ? "السجل الطبي الموحد (MPI)" : "Master Patient Index (MPI)"}</span>\
            </button>\
          </div>\
' src/App.tsx
