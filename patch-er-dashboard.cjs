const fs = require('fs');

let content = fs.readFileSync('src/components/ERDashboard.tsx', 'utf8');

// Add import
content = content.replace(
  /import \{ useHIS \} from "\.\.\/context\/HISContext";/,
  `import { useHIS } from "../context/HISContext";\nimport ComprehensiveRegistrationModal from "./ComprehensiveRegistrationModal";`
);

// Add state
content = content.replace(
  /const \[searchQuery, setSearchQuery\] = useState\(""\);/,
  `const [searchQuery, setSearchQuery] = useState("");\n  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);`
);

// Add onClick
content = content.replace(
  /<button className="p-2.5 bg-rose-600 text-white rounded-xl shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all active:scale-95 flex items-center gap-2 px-5">/,
  `<button onClick={() => setIsRegistrationModalOpen(true)} className="p-2.5 bg-rose-600 text-white rounded-xl shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all active:scale-95 flex items-center gap-2 px-5">`
);

// Add Modal render at the end
content = content.replace(
  /    <\/div>\n  \);\n}/,
  `      {isRegistrationModalOpen && (
        <ComprehensiveRegistrationModal 
          language={language}
          onClose={() => setIsRegistrationModalOpen(false)}
        />
      )}
    </div>
  );
}`
);

fs.writeFileSync('src/components/ERDashboard.tsx', content, 'utf8');
