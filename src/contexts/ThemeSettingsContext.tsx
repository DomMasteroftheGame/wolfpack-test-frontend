import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  ThemeSettings, 
  initThemeSettings, 
  getThemeSettings, 
  updateThemeSetting 
} from '../utils/shopifyThemeSettings';

interface ThemeSettingsContextType {
  settings: ThemeSettings;
  isLoading: boolean;
  updateSettings: <K extends keyof ThemeSettings>(
    section: K,
    settings: Partial<ThemeSettings[K]>
  ) => void;
}

const defaultContextValue: ThemeSettingsContextType = {
  settings: getThemeSettings(),
  isLoading: true,
  updateSettings: () => {}
};

const ThemeSettingsContext = createContext<ThemeSettingsContextType>(defaultContextValue);

export const useThemeSettings = () => useContext(ThemeSettingsContext);

interface ThemeSettingsProviderProps {
  children: ReactNode;
}

export const ThemeSettingsProvider: React.FC<ThemeSettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<ThemeSettings>(getThemeSettings());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const loadedSettings = await initThemeSettings();
        setSettings(loadedSettings);
      } catch (error) {
        console.error('Failed to load theme settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = <K extends keyof ThemeSettings>(
    section: K,
    newSettings: Partial<ThemeSettings[K]>
  ) => {
    const updatedSettings = updateThemeSetting(section, newSettings);
    setSettings(updatedSettings);
  };

  return (
    <ThemeSettingsContext.Provider
      value={{
        settings,
        isLoading,
        updateSettings
      }}
    >
      {children}
    </ThemeSettingsContext.Provider>
  );
};

export default ThemeSettingsProvider;
