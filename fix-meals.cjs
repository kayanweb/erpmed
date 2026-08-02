const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(
  /            \{\/\* 9\. شيت وجبات المرضى والموظفين \[MEALS badge\] \*\/\}/g,
  `            {/* 9. شيت وجبات المرضى والموظفين [MEALS badge] */}
            {checkPermission("mod_meals") && (
              <button
                onClick={() => setActiveTab("meals")}
                className={\`w-full flex items-center gap-3 px-4 py-2 text-right text-xs font-semibold transition-all rounded-lg \${
                  activeTab === "meals" ? "bg-blue-600 text-white font-bold shadow-md" : "text-slate-300 hover:bg-white/10 hover:text-white"
                }\`}
              >
                <Coffee className="h-4 w-4 shrink-0 text-orange-400" />
                <span className="flex-1 text-right">{language === "ar" ? "شيت وجبات المرضى والموظفين" : "Meals Delivery Log"}</span>
                <span className="bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shrink-0">
                  MEALS
                </span>
              </button>
            )}`
);
fs.writeFileSync('src/App.tsx', content, 'utf8');
