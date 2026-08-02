import React, { createContext, useContext, useEffect, useState } from "react";

interface Settings {
  institutionNameAr: string;
  institutionNameEn: string;
  taglineAr: string;
  taglineEn: string;
  address: string;
  emergencyPhone: string;
  website?: string;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Settings) => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>({ 
    institutionNameAr: "مؤسسة المستشفى", 
    institutionNameEn: "Hospital Foundation",
    taglineAr: "نحو رعاية طبية آمنة وممتازة",
    taglineEn: "Care & Healing Services",
    address: "الجيزة، مصر",
    emergencyPhone: "19600"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings/config_settings');
        if (res.ok) {
          const data = await res.json();
          if (data && data.value) {
            setSettings(data.value as Settings);
          }
        }
      } catch (error) {
        console.warn("Backend API offline or configuration missing in SettingsContext. Using default values.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Settings) => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'config_settings', value: newSettings })
      });
      setSettings(newSettings);
    } catch (error) {
      console.warn("Backend API offline. Saving settings locally.", error);
      setSettings(newSettings);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};
