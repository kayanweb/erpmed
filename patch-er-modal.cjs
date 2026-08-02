const fs = require('fs');
let content = fs.readFileSync('src/components/ERDashboard.tsx', 'utf8');

if (!content.includes('const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);')) {
  content = content.replace(
    /const \[searchQuery, setSearchQuery\] = useState\(""\);/,
    `const [searchQuery, setSearchQuery] = useState("");\n  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);`
  );
}

fs.writeFileSync('src/components/ERDashboard.tsx', content, 'utf8');
