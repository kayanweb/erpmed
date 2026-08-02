import React, { createContext, useContext, useState, useEffect } from "react";
import { subscribeToClinicalData, saveDataPermanently } from "../lib/realTimeService";

export interface OrganizationSettings {
  id?: string;
  organizationNameAr: string;
  organizationNameEn: string;
  logoUrl?: string;
  phone?: string;
  email?: string;
  addressAr?: string;
  addressEn?: string;
  footerAr?: string;
  footerEn?: string;
}

interface SystemSettingsContextProps {
  settings: OrganizationSettings;
  updateSettings: (newSettings: Partial<OrganizationSettings>) => Promise<void>;
  loading: boolean;
}

const defaultSettings: OrganizationSettings = {
  organizationNameAr: "مستشفى الرعاية الطبية الموحدة",
  organizationNameEn: "Unified Care Medical Hospital",
  logoUrl: "",
  phone: "19600",
  email: "info@carehospital.org",
  addressAr: "الفرع الرئيسي - قسم الجودة",
  addressEn: "Main Branch - Quality Department",
  footerAr: "قسم الجودة ومراقبة المعايير الطبية الموحدة - تقرير إلكتروني موثق بموجب المعايير الدولية",
  footerEn: "Standardized Clinical Quality & Risk Management - Certified Electronic Form"
};

const SystemSettingsContext = createContext<SystemSettingsContextProps | undefined>(undefined);

export const SystemSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<OrganizationSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToClinicalData<OrganizationSettings>("organizationSettings", (data) => {
      const mainSettings = data.find((s: any) => s.id === "main");
      if (mainSettings) {
        setSettings({ ...defaultSettings, ...mainSettings });
      } else {
        // Document does not exist yet. Let's write the default setup
        saveDataPermanently("organizationSettings", { id: "main", ...defaultSettings }).catch((err) => {
          console.warn("Failed to write initial default settings to PostgreSQL:", err);
        });
        setSettings(defaultSettings);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error watching organizationSettings in PostgreSQL:", error);
      setSettings(defaultSettings);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateSettings = async (newSettings: Partial<OrganizationSettings>) => {
    try {
      const updated = { id: "main", ...settings, ...newSettings };
      await saveDataPermanently("organizationSettings", updated);
      setSettings(updated);
    } catch (err) {
      console.error("Failed to update organization settings in PostgreSQL:", err);
      throw err;
    }
  };

  return (
    <SystemSettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SystemSettingsContext.Provider>
  );
};

export const useSystemSettings = () => {
  const context = useContext(SystemSettingsContext);
  if (!context) {
    throw new Error("useSystemSettings must be used within a SystemSettingsProvider");
  }
  return context;
};
