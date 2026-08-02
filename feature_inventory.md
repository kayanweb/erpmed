# Enterprise Architecture Inventory - PRO Nurse HIS

This document serves as the source of truth for the architectural audit and reorganization of the PRO Nurse Enterprise Hospital Information System.

## Domain Classification
- **HIS (Hospital Information System):** Clinical modules, patient care, nursing, pharmacy, laboratory, radiology, etc.
- **WSD (Workplace & System Domain):** Administrative, HR, ERP, IT, settings, user management, audit trails, licensing.

## Component Inventory & Status

| Component Path | Domain | Status | Notes / Potential Merge |
| :--- | :--- | :--- | :--- |
| `AdminDashboard.tsx` | WSD | Active | Merge SystemAdminDashboard into this. |
| `SystemAdminDashboard.tsx` | WSD | To be merged | Merge into AdminDashboard |
| `HISOverviewDashboard.tsx` | HIS | Active | Potential merge into `HospitalInformationSystem.tsx` |
| `HospitalInformationSystem.tsx`| HIS | Active | Core HIS container |
| `NursingConsole.tsx` | HIS | Active | Potential merge/reuse for other nursing dashboards |
| ... | ... | ... | ... |

## Merge Strategy
- **Dashboards:** Consolidate role-based dashboards into parameterized, role-aware components.
- **Utils:** Move shared business logic from components to `src/lib/services`.
