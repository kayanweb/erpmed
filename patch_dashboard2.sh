#!/bin/bash
sed -i '1s/^/import NewInventory from ".\/NewInventory";\n/' src/components/DashboardRouter.tsx
sed -i '/case "patient_consumables":/i \      case "new_inventory":\n        return <NewInventory />;' src/components/DashboardRouter.tsx
