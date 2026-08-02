const fs = require('fs');
const filePath = 'src/App.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');

const startIndex = 8235; // index of 8236
const endIndex = 8239; // index of 8240

const fixedLines = `              <span className="flex-1 text-right">{language === "ar" ? "السجل الطبي الموحد (MPI)" : "Master Patient Index (MPI)"}</span>
            </button>
            <button
              onClick={() => setActiveTab("patient_consumables")}
              className={\`w-full flex items-center gap-3 px-4 py-2 text-right text-xs font-semibold transition-all rounded-lg \${
                activeTab === "patient_consumables" ? "bg-emerald-600 text-white font-bold shadow-sm" : "text-slate-300 hover:bg-white/10 hover:text-white"
              }\`}
            >
              <span className="flex-1 text-right">{language === "ar" ? "إدارة المستهلكات (Patient Consumables)" : "Patient Consumables"}</span>
            </button>
            <button
              onClick={() => setActiveTab("new_inventory")}
              className={\`w-full flex items-center gap-3 px-4 py-2 text-right text-xs font-semibold transition-all rounded-lg \${
                activeTab === "new_inventory" ? "bg-cyan-600 text-white font-bold shadow-sm" : "text-slate-300 hover:bg-white/10 hover:text-white"
              }\`}
            >
              <span className="flex-1 text-right">{language === "ar" ? "المخزون المتطور (Inventory V2)" : "Advanced Inventory"}</span>
            </button>
          </div>`;

lines.splice(startIndex, endIndex - startIndex + 1, fixedLines);
fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
