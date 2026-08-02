const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Find WSD Sub-items list
const mealsWSD = `
                {/* WSD - Meals */}
                <button
                  onClick={() => setActiveTab("meals")}
                  className={\`w-full flex items-center gap-3 px-4 py-2 text-right text-xs font-semibold transition-all rounded-lg \${
                    activeTab === "meals" ? "bg-orange-600 text-white font-bold shadow-sm" : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }\`}
                >
                  <span className="flex-1 text-right">{language === "ar" ? "شيت وجبات المرضى والموظفين" : "Meals Delivery Log"}</span>
                  <span className="bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shrink-0">MEALS</span>
                </button>`;

if (!content.includes('{/* WSD - Meals */}')) {
  content = content.replace(
    /\{\/\* WSD Sub-items list \*\/\}\s*<div className="space-y-1 pl-1 pr-1">/,
    `{/* WSD Sub-items list */}\n              <div className="space-y-1 pl-1 pr-1">${mealsWSD}`
  );
  fs.writeFileSync('src/App.tsx', content, 'utf8');
}
