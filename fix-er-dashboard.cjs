const fs = require('fs');

let content = fs.readFileSync('src/components/ERDashboard.tsx', 'utf8');

if (!content.includes('isRegistrationModalOpen')) {
  content = content.replace(
    /const \[searchTerm, setSearchTerm\] = useState\(""\);/,
    `const [searchTerm, setSearchTerm] = useState("");\n  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);`
  );
}

fs.writeFileSync('src/components/ERDashboard.tsx', content, 'utf8');
