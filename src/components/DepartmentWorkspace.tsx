import React, { useState } from "react";
import {
  LayoutDashboard,
  UserCircle,
  Stethoscope,
  BedDouble,
  ClipboardList,
  FileText,
  Activity,
  Settings,
  Users,
  Building,
} from "lucide-react";
import PhysicianWardDashboard from "./PhysicianWardDashboard";
import InpatientDashboard from "./InpatientDashboard";
import ClinicalFormsLibrary from "./ClinicalFormsLibrary";
import BedManagementDashboard from "./BedManagementDashboard";
import PatientTrackingKardex from "./PatientTrackingKardex";
import DepartmentDashboard from "./DepartmentDashboard";
import DepartmentTasks from "./DepartmentTasks";
import DepartmentReports from "./DepartmentReports";
import ERDashboard from "./ERDashboard";


import PACUDashboard from "./PACUDashboard";
import RehabDashboard from "./RehabDashboard";
import PsychiatryDashboard from "./PsychiatryDashboard";
import DialysisDashboard from "./DialysisDashboard";
import OncologyDashboard from "./OncologyDashboard";
import OutpatientClinicsDashboard from "./OutpatientClinicsDashboard";
import OperatingTheaterBoard from "./OperatingTheaterBoard";

interface Props {
  language: "ar" | "en";
  departmentId: string;
  departmentName: string;
}

export default function DepartmentWorkspace({
  language,
  departmentId,
  departmentName,
}: Props) {
  const isAr = language === "ar";
  
  const isOpd = departmentId.startsWith("dept_opd_");
  const isWard = departmentId.startsWith("dept_ward_");
  const isCritical = [
    "er", "icu", "nicu", "pacu", "ot", "obs_gyn", "pt", "rehab", "psychiatry", "dialysis", "oncology", "dept_ccu"
  ]?.includes(departmentId);

  const [activeModule, setActiveModule] = useState(() => {
    if (isOpd || isWard || isCritical) {
      return "classic_dashboard";
    }
    return "dashboard";
  });

  const modules = [];

  // 1. Primary Workstation / Dashboard
  if (isOpd) {
    modules.push({
      id: "classic_dashboard",
      labelEn: "Clinic Workspace",
      labelAr: "مساحة عمل العيادة",
      icon: LayoutDashboard,
    });
  } else if (isWard) {
    modules.push({
      id: "classic_dashboard",
      labelEn: "Ward Station",
      labelAr: "محطة عمل الجناح",
      icon: LayoutDashboard,
    });
  } else if (isCritical) {
    modules.push({
      id: "classic_dashboard",
      labelEn: "Unit Dashboard",
      labelAr: "لوحة تحكم الوحدة",
      icon: LayoutDashboard,
    });
  } else {
    modules.push({
      id: "dashboard",
      labelEn: "Department Dashboard",
      labelAr: "لوحة تحكم القسم",
      icon: LayoutDashboard,
    });
  }

  // 2. Operational Analytics / Generic Dashboard
  if (isOpd || isWard || isCritical) {
    modules.push({
      id: "dashboard",
      labelEn: "Operational Analytics",
      labelAr: "التحليلات التشغيلية",
      icon: Activity,
    });
  }

  // 3. Doctor / Physician Workspace
  modules.push({
    id: "physician",
    labelEn: "Doctor Desk",
    labelAr: "مكتب الطبيب",
    icon: Stethoscope,
  });

  // 4. Nursing Workstation
  if (!isOpd) {
    modules.push({
      id: "nursing",
      labelEn: "Nursing Station",
      labelAr: "محطة التمريض",
      icon: UserCircle,
    });
  }

  // 5. Bed Board & Patient Tracking (Kardex)
  if (isWard || isCritical || departmentId === "icu" || departmentId === "er") {
    modules.push({
      id: "bed_board",
      labelEn: "Bed Allocation",
      labelAr: "تخصيص الأسرة",
      icon: BedDouble,
    });
    modules.push({
      id: "patient_tracking",
      labelEn: "Patient Kardex",
      labelAr: "كاردكس المرضى",
      icon: ClipboardList,
    });
  }

  // 6. Tasks and Shared modules
  modules.push(
    {
      id: "tasks",
      labelEn: "Tasks Center",
      labelAr: "مركز المهام",
      icon: ClipboardList,
    },
    {
      id: "forms",
      labelEn: "Forms & Charts",
      labelAr: "النماذج الطبية",
      icon: FileText,
    },
    { 
      id: "reports", 
      labelEn: "Reports", 
      labelAr: "التقارير", 
      icon: FileText 
    }
  );

  return (
    <div
      className="flex flex-col md:flex-row h-full bg-slate-50 overflow-hidden"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Internal Department Sidebar */}
      <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col shadow-sm z-10 shrink-0">
        <div className="p-4 border-b border-slate-100 bg-slate-900 text-white hidden md:block">
          <h2 className="font-black text-lg flex items-center gap-2">
            <Building className="w-5 h-5 text-sky-400" />
            {departmentName}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isAr ? "مساحة عمل القسم" : "Department Workspace"}
          </p>
        </div>

        <div className="flex-none md:flex-1 overflow-x-auto md:overflow-y-auto py-2 md:py-4 flex md:flex-col gap-2 md:gap-1 px-3 custom-scrollbar flex-row">
          {modules.map((mod) => {
            const Icon = mod.icon;
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`flex-none md:w-full flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-sky-50 text-sky-700 shadow-sm border border-sky-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                }`}
              >
                <Icon
                  className={`w-4 h-4 md:w-5 md:h-5 ${isActive ? "text-sky-600" : "text-slate-400"}`}
                />
                {isAr ? mod.labelAr : mod.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col relative min-h-0">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeModule === "dashboard" && (
            <DepartmentDashboard
              language={language}
              departmentName={departmentName}
            />
          )}

          {activeModule === "classic_dashboard" &&
            (() => {
              if (departmentId === "icu" || departmentId === "dept_ccu")
                return <InpatientDashboard language={language}  />;
              if (departmentId === "er")
                return <ERDashboard language={language} />;
              if (departmentId === "nicu")
                return <InpatientDashboard language={language}  />;
              if (departmentId === "pacu")
                return <PACUDashboard language={language} />;
              if (departmentId === "ot")
                return <OperatingTheaterBoard language={language} />;
              if (departmentId === "obs_gyn")
                return <OutpatientClinicsDashboard language={language}  />;
              if (departmentId === "pt" || departmentId === "rehab")
                return <RehabDashboard language={language} />;
              if (departmentId === "psychiatry")
                return <PsychiatryDashboard language={language} />;
              if (departmentId === "dialysis")
                return <DialysisDashboard language={language} />;
              if (departmentId === "oncology")
                return <OncologyDashboard language={language} />;
              if (departmentId.startsWith("dept_opd_"))
                return (
                  <OutpatientClinicsDashboard
                    language={language}
                    forceDepartmentId={departmentId}
                  />
                );
              if (departmentId.startsWith("dept_ward_"))
                return (
                  <InpatientDashboard
                    language={language}
                    defaultModuleType={departmentId}
                  />
                );
              return <ERDashboard language={language} />;
            })()}

          {activeModule === "physician" && (
            <PhysicianWardDashboard
              language={language}
              forceDepartmentId={departmentId}
            />
          )}

          {activeModule === "nursing" && (
            <InpatientDashboard
              language={language}
              defaultModuleType={departmentId}
            />
          )}

          {activeModule === "bed_board" && (
            <BedManagementDashboard
              language={language}
              forceDepartmentId={departmentId}
            />
          )}

          {activeModule === "patient_tracking" && (
            <PatientTrackingKardex
              language={language}
              forceDepartmentId={departmentId}
            />
          )}

          {activeModule === "forms" && <ClinicalFormsLibrary />}

          {activeModule === "tasks" && (
            <DepartmentTasks
              language={language}
              departmentId={departmentId}
              departmentName={departmentName}
            />
          )}

          {activeModule === "reports" && (
            <DepartmentReports language={language} />
          )}

        </div>
      </div>
    </div>
  );
}
