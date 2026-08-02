import React, { useState, useEffect } from "react";
import { HISHeader } from "./HISShell/HISHeader";
import { HISSidebar } from "./HISShell/HISSidebar";
import { HISRibbon } from "./HISShell/HISRibbon";
import { HISWorkspace } from "./HISShell/HISWorkspace";
import { systemModules } from "./HISShell/moduleConfig";
import SmartAIAssistant from "./SmartAIAssistant";
import { ComprehensiveRegistrationModal } from "./ComprehensiveRegistrationModal";
import { PatientManagementWorkflows } from "./PatientManagementWorkflows";
import { AnimatePresence, motion } from "motion/react";

interface HospitalInformationSystemProps { [key: string]: any;
  language: "ar" | "en";
  currentUser: any;
  systemUsers: any[];
  hospitalSettings: any;
  setHospitalSettings: (settings: any) => void;
  departments: any[];
  onLogout: () => void;
  onLanguageChange?: () => void;
}

export default function HospitalInformationSystem({
  language,
  currentUser,
  systemUsers,
  hospitalSettings,
  setHospitalSettings,
  departments,
  onLogout,
  onLanguageChange,
  ...props
}: HospitalInformationSystemProps) {
  const isAr = language === "ar";
  
  const [activeModule, setActiveModule] = useState<string>("dashboard");
  const [activeSubTab, setActiveSubTab] = useState<string>("missioncontrol");
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;
  });

  // Global Modals State
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [activeWorkflowType, setActiveWorkflowType] = useState<string>("new_visit");
  const [workflowPatientId, setWorkflowPatientId] = useState<string>("");

  useEffect(() => {
    const handleOpenRegistration = () => {
      setIsRegistrationModalOpen(true);
    };

    const handleOpenVisit = () => {
      setActiveWorkflowType("new_visit");
      setWorkflowPatientId("");
      setIsWorkflowModalOpen(true);
    };

    const handleOpenWorkflow = (e: CustomEvent) => {
      if (e.detail?.workflow) {
        setActiveWorkflowType(e.detail.workflow);
        setWorkflowPatientId(e.detail.patientId || "");
        setIsWorkflowModalOpen(true);
      }
    };

    window.addEventListener("openPatientRegistration", handleOpenRegistration);
    window.addEventListener("openVisitRegistration", handleOpenVisit);
    window.addEventListener("openPatientWorkflow" as any, handleOpenWorkflow);

    return () => {
      window.removeEventListener("openPatientRegistration", handleOpenRegistration);
      window.removeEventListener("openVisitRegistration", handleOpenVisit);
      window.removeEventListener("openPatientWorkflow" as any, handleOpenWorkflow);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");

  const currentModuleObj = systemModules.find((m) => m.id === activeModule);

  const handleModuleSelect = (moduleId: string) => {
    setActiveModule(moduleId);
    const mod = systemModules.find(m => m.id === moduleId);
    if (mod && mod.subItems && mod.subItems.length > 0) {
      setActiveSubTab(mod.subItems[0].id);
    } else {
      setActiveSubTab(moduleId);
    }
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-full bg-slate-100 overflow-hidden relative" dir={isAr ? "rtl" : "ltr"}>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      
      <HISSidebar
        modules={systemModules}
        activeModule={activeModule}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isAr={isAr}
        onModuleSelect={handleModuleSelect}
        isMobile={isMobile}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <HISHeader
          isAr={isAr}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          onModuleSelect={handleModuleSelect}
          globalSearchQuery={globalSearchQuery}
          setGlobalSearchQuery={setGlobalSearchQuery}
          currentUser={currentUser}
          onLogout={onLogout}
          hospitalSettings={hospitalSettings}
          onToggleCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
          onLanguageToggle={onLanguageChange}
          {...props}
        />
        <HISRibbon
          activeModule={currentModuleObj}
          activeSubTab={activeSubTab}
          onSubTabSelect={setActiveSubTab}
          isAr={isAr}
        />
        <main className="flex-1 overflow-auto bg-slate-50/50 p-4">
          <HISWorkspace activeSubTab={activeSubTab} language={language} currentUser={currentUser} />
        </main>
      </div>

      {/* AI Copilot Side Drawer */}
      <AnimatePresence>
        {isCopilotOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCopilotOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: isAr ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: isAr ? "-100%" : "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed inset-y-0 ${isAr ? "left-0" : "right-0"} w-full sm:w-[400px] bg-white shadow-2xl z-[70] flex flex-col border-${isAr ? "r" : "l"} border-slate-200`}
            >
              <SmartAIAssistant 
                language={language} 
                currentUser={currentUser} 
                onClose={() => setIsCopilotOpen(false)} 
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Registration Modal */}
      <ComprehensiveRegistrationModal 
        isOpen={isRegistrationModalOpen}
        isAr={isAr}
        onClose={() => setIsRegistrationModalOpen(false)}
        onRegister={(newPatientId) => {
          setIsRegistrationModalOpen(false);
          // Auto open visit modal for the newly registered patient
          if (newPatientId) {
            setWorkflowPatientId(newPatientId);
            setActiveWorkflowType("new_visit");
            setIsWorkflowModalOpen(true);
          }
        }}
      />

      {/* Global Patient Workflow Modal (Visits, Reports, Documents) */}
      <AnimatePresence>
        {isWorkflowModalOpen && (
          <PatientManagementWorkflows 
            workflow={activeWorkflowType}
            patientId={workflowPatientId}
            isAr={isAr}
            onClose={() => setIsWorkflowModalOpen(false)}
            onSuccess={() => setIsWorkflowModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
