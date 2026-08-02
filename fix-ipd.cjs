const fs = require('fs');
let content = fs.readFileSync('src/components/IPDDashboard.tsx', 'utf8');

content = content.replace(
  /<DynamicModuleRenderer[\s\S]*?\/>/,
  `<div className="flex flex-col items-center justify-center h-full text-slate-400">
                      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                        <Activity className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="font-bold">{language === 'ar' ? 'هذه الوحدة قيد التطوير' : 'This module is under development'}</p>
                    </div>`
);

fs.writeFileSync('src/components/IPDDashboard.tsx', content, 'utf8');
