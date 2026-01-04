/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: Record<string, string>;
}

interface Window {
  pwaThemeVariables?: {
    apiUrl?: string;
    gameAssets?: {
      cardLabor: string;
      cardFinance: string;
      cardSales: string;
      logoGold: string;
      [key: string]: string;
    };
    [key: string]: any;
  };
}
