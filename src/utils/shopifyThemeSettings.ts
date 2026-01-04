/**
 * Shopify Theme Settings Utilities
 * 
 * This file contains utilities for loading and applying Shopify theme settings
 * to the PWA application.
 */

import { isInShopifyIframe, getShopifyParams } from './shopifyIntegration';

const defaultSettings: ThemeSettings = {
  colors: {
    primary_color: '#6366f1',
    secondary_color: '#4f46e5',
    background_color: '#0a0e2a',
    text_color: '#ffffff'
  },
  typography: {
    heading_font: 'Montserrat',
    body_font: 'Montserrat',
    base_font_size: 16
  },
  layout: {
    layout_width: 'standard',
    show_logo: true,
    logo: ''
  },
  game_features: {
    enable_gameboard: true,
    enable_leaderboard: true,
    enable_celebrations: true,
    celebration_intensity: 'moderate'
  },
  social_features: {
    enable_connections: true,
    enable_sharing: true,
    sharing_message: 'Check out my progress in Build Your Wolfpack!'
  }
};

export interface ThemeSettings {
  colors: {
    primary_color: string;
    secondary_color: string;
    background_color: string;
    text_color: string;
  };
  typography: {
    heading_font: string;
    body_font: string;
    base_font_size: number;
  };
  layout: {
    layout_width: 'narrow' | 'standard' | 'wide';
    show_logo: boolean;
    logo: string;
  };
  game_features: {
    enable_gameboard: boolean;
    enable_leaderboard: boolean;
    enable_celebrations: boolean;
    celebration_intensity: 'subtle' | 'moderate' | 'intense';
  };
  social_features: {
    enable_connections: boolean;
    enable_sharing: boolean;
    sharing_message: string;
  };
}

let currentSettings: ThemeSettings = { ...defaultSettings };

export const loadThemeSettings = async (): Promise<ThemeSettings> => {
  if (!isInShopifyIframe()) {
    return { ...defaultSettings };
  }
  
  try {
    const params = getShopifyParams();
    const shopDomain = params.shop || '';
    
    if (!shopDomain) {
      return { ...defaultSettings };
    }
    
    const response = await fetch(`/api/theme-settings?shop=${shopDomain}`);
    
    if (!response.ok) {
      console.warn('Failed to load theme settings from Shopify, using defaults');
      return { ...defaultSettings };
    }
    
    const settings = await response.json();
    currentSettings = { ...defaultSettings, ...settings };
    
    return currentSettings;
  } catch (error) {
    console.error('Error loading theme settings:', error);
    return { ...defaultSettings };
  }
};

export const applyThemeSettings = (settings: ThemeSettings = currentSettings): void => {
  const styleEl = document.createElement('style');
  styleEl.id = 'shopify-theme-settings';
  
  const existingStyle = document.getElementById('shopify-theme-settings');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  const css = `
    :root {
      /* Colors */
      --primary-color: ${settings.colors.primary_color};
      --secondary-color: ${settings.colors.secondary_color};
      --background-color: ${settings.colors.background_color};
      --text-color: ${settings.colors.text_color};
      
      /* Typography */
      --heading-font: ${settings.typography.heading_font}, sans-serif;
      --body-font: ${settings.typography.body_font}, sans-serif;
      --base-font-size: ${settings.typography.base_font_size}px;
      
      /* Layout */
      --layout-width: ${
        settings.layout.layout_width === 'narrow' ? '800px' :
        settings.layout.layout_width === 'wide' ? '1400px' :
        '1200px'
      };
    }
    
    /* Apply base styles */
    body {
      font-family: var(--body-font);
      font-size: var(--base-font-size);
      color: var(--text-color);
      background-color: var(--background-color);
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--heading-font);
    }
    
    .btn-primary, .bg-primary {
      background-color: var(--primary-color) !important;
    }
    
    .btn-secondary, .bg-secondary {
      background-color: var(--secondary-color) !important;
    }
    
    .text-primary {
      color: var(--primary-color) !important;
    }
    
    .text-secondary {
      color: var(--secondary-color) !important;
    }
    
    /* Layout width */
    .container {
      max-width: var(--layout-width);
    }
  `;
  
  styleEl.textContent = css;
  document.head.appendChild(styleEl);
  
  document.body.classList.toggle('gameboard-disabled', !settings.game_features.enable_gameboard);
  document.body.classList.toggle('leaderboard-disabled', !settings.game_features.enable_leaderboard);
  document.body.classList.toggle('celebrations-disabled', !settings.game_features.enable_celebrations);
  document.body.classList.toggle('connections-disabled', !settings.social_features.enable_connections);
  document.body.classList.toggle('sharing-disabled', !settings.social_features.enable_sharing);
  
  document.body.dataset.celebrationIntensity = settings.game_features.celebration_intensity;
  
  if (settings.layout.show_logo && settings.layout.logo) {
    const logoElements = document.querySelectorAll('.theme-logo');
    logoElements.forEach(el => {
      if (el instanceof HTMLImageElement) {
        el.src = settings.layout.logo;
        el.style.display = 'block';
      }
    });
  }
};

export const initThemeSettings = async (): Promise<ThemeSettings> => {
  const settings = await loadThemeSettings();
  applyThemeSettings(settings);
  return settings;
};

export const getThemeSettings = (): ThemeSettings => {
  return { ...currentSettings };
};

export const updateThemeSetting = <K extends keyof ThemeSettings>(
  section: K,
  settings: Partial<ThemeSettings[K]>
): ThemeSettings => {
  currentSettings = {
    ...currentSettings,
    [section]: {
      ...currentSettings[section],
      ...settings
    }
  };
  
  applyThemeSettings(currentSettings);
  return { ...currentSettings };
};
