import { Workbox } from 'workbox-window';

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/service-worker.js');

    wb.addEventListener('installed', (event) => {
      if (event.isUpdate) {
        if (confirm('New version available! Reload to update?')) {
          window.location.reload();
        }
      }
    });

    wb.addEventListener('controlling', () => {
      window.location.reload();
    });

    wb.addEventListener('activated', (event) => {
      if (!event.isUpdate) {
        console.log('Service worker activated for the first time!');
      }
    });

    wb.register()
      .then((registration) => {
        console.log('Service worker registered successfully:', registration);
      })
      .catch((error) => {
        console.error('Service worker registration failed:', error);
      });
  }
}

export function isOnline(): boolean {
  return navigator.onLine;
}

export function addOfflineEventListeners(
  onOffline: () => void,
  onOnline: () => void
) {
  window.addEventListener('offline', onOffline);
  window.addEventListener('online', onOnline);

  return () => {
    window.removeEventListener('offline', onOffline);
    window.removeEventListener('online', onOnline);
  };
}
