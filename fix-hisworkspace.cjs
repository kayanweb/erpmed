const fs = require('fs');
let content = fs.readFileSync('src/components/HISShell/HISWorkspace.tsx', 'utf8');

if (!content.includes('const MealsDeliveryLog = lazy')) {
  content = content.replace(
    /const PatientTransportLog = lazy\(\(\) => import\("\.\.\/PatientTransportLog"\)\);/,
    `const MealsDeliveryLog = lazy(() => import("../MealsDeliveryLog"));\nconst PatientTransportLog = lazy(() => import("../PatientTransportLog"));`
  );
}

if (!content.includes('case "meals": return <MealsDeliveryLog')) {
  content = content.replace(
    /case "transport": return <PatientTransportLog language=\{language\} \/>;/,
    `case "meals": return <MealsDeliveryLog language={language} />;\n      case "transport": return <PatientTransportLog language={language} />;`
  );
}

fs.writeFileSync('src/components/HISShell/HISWorkspace.tsx', content, 'utf8');
