/**
 * Utility functions for testing offline functionality
 */

export const simulateOffline = (): void => {
  const originalDesc = Object.getOwnPropertyDescriptor(Navigator.prototype, 'onLine') || 
                      { configurable: true, enumerable: true, get: () => true };
  
  Object.defineProperty(Navigator.prototype, 'onLine', {
    configurable: true,
    enumerable: true,
    get: () => false
  });
  
  window.dispatchEvent(new Event('offline'));
  
  console.log('Simulated offline mode activated');
  
  (window as any).__originalOnLineDesc = originalDesc;
};

export const restoreOnline = (): void => {
  if ((window as any).__originalOnLineDesc) {
    Object.defineProperty(
      Navigator.prototype, 
      'onLine', 
      (window as any).__originalOnLineDesc
    );
    
    if (navigator.onLine) {
      window.dispatchEvent(new Event('online'));
    }
    
    delete (window as any).__originalOnLineDesc;
    
    console.log('Online mode restored');
  }
};

export const toggleOfflineMode = (): boolean => {
  if ((window as any).__originalOnLineDesc) {
    restoreOnline();
    return true; // Now online
  } else {
    simulateOffline();
    return false; // Now offline
  }
};

export const createOfflineTestButton = (): HTMLButtonElement => {
  const button = document.createElement('button');
  button.textContent = 'Toggle Offline Mode';
  button.style.position = 'fixed';
  button.style.bottom = '20px';
  button.style.left = '20px';
  button.style.zIndex = '9999';
  button.style.padding = '8px 16px';
  button.style.backgroundColor = '#4f46e5';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';
  
  button.addEventListener('click', () => {
    const isOnline = toggleOfflineMode();
    button.textContent = isOnline ? 'Go Offline' : 'Go Online';
    button.style.backgroundColor = isOnline ? '#4f46e5' : '#ef4444';
  });
  
  return button;
};

export const addOfflineTestButton = (): void => {
  if (import.meta.env.DEV) {
    const button = createOfflineTestButton();
    document.body.appendChild(button);
    console.log('Offline test button added to the page');
  }
};
