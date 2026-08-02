#!/bin/bash
sed -i '1s/^/import PatientConsumables from ".\/PatientConsumables";\n/' src/components/DashboardRouter.tsx
sed -i '/case "messaging":/i \      case "patient_consumables":\n        return <PatientConsumables patientId="pt-12345" />;' src/components/DashboardRouter.tsx
