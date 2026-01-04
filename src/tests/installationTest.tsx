import React, { useState, useEffect } from 'react';

interface InstallationTestProps {
  onClose: () => void;
}

const InstallationTest: React.FC<InstallationTestProps> = ({ onClose }) => {
  const [deviceType, setDeviceType] = useState<'desktop' | 'mobile' | 'unknown'>('unknown');
  const [browser, setBrowser] = useState<string>('unknown');
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [showQRCode, setShowQRCode] = useState<boolean>(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
      setDeviceType('mobile');
    } else {
      setDeviceType('desktop');
    }

    if (userAgent.indexOf('edge') > -1) {
      setBrowser('Microsoft Edge');
    } else if (userAgent.indexOf('edg') > -1) {
      setBrowser('Microsoft Edge (Chromium)');
    } else if (userAgent.indexOf('opr') > -1) {
      setBrowser('Opera');
    } else if (userAgent.indexOf('chrome') > -1) {
      setBrowser('Chrome');
    } else if (userAgent.indexOf('firefox') > -1) {
      setBrowser('Firefox');
    } else if (userAgent.indexOf('safari') > -1) {
      setBrowser('Safari');
    }

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setIsInstallable(true);
    });

    runTests();
  }, []);

  const runTests = () => {
    const results: Record<string, boolean> = {};

    const manifestLink = document.querySelector('link[rel="manifest"]');
    results.manifest = !!manifestLink;

    results.serviceWorker = 'serviceWorker' in navigator;

    results.https = window.location.protocol === 'https:';

    const themeColor = document.querySelector('meta[name="theme-color"]');
    const viewport = document.querySelector('meta[name="viewport"]');
    results.metaTags = !!themeColor && !!viewport;

    const icons = document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]');
    results.icons = icons.length > 0;

    setTestResults(results);
  };

  const generateQRCode = () => {
    setShowQRCode(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">PWA Installation Test</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-700 mb-2">Device Information</h3>
              <p><strong>Device Type:</strong> {deviceType}</p>
              <p><strong>Browser:</strong> {browser}</p>
              <p><strong>Installed:</strong> {isStandalone ? 'Yes' : 'No'}</p>
              <p><strong>Installable:</strong> {isInstallable ? 'Yes' : 'No'}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-700 mb-2">Installation Tests</h3>
              <ul className="space-y-2">
                {Object.entries(testResults).map(([test, passed]) => (
                  <li key={test} className="flex items-center">
                    <span className={`inline-block w-5 h-5 rounded-full mr-2 ${passed ? 'bg-green-500' : 'bg-red-500'}`}>
                      {passed ? '✓' : '✗'}
                    </span>
                    <span className="capitalize">{test}: {passed ? 'Passed' : 'Failed'}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Installation Instructions</h3>
              
              {deviceType === 'desktop' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Desktop Installation</h4>
                  <ol className="list-decimal ml-5 space-y-2">
                    <li>Look for the install icon in your browser's address bar</li>
                    <li>Click on the install icon</li>
                    <li>Follow the prompts to install the app</li>
                    <li>After installation, the app will open in a new window</li>
                  </ol>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      Note: Installation options vary by browser. In Chrome, look for a "+" icon or "Install" in the menu.
                      In Edge, look for an app icon in the address bar.
                    </p>
                  </div>
                </div>
              )}
              
              {deviceType === 'mobile' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Mobile Installation</h4>
                  {browser.includes('Safari') ? (
                    <ol className="list-decimal ml-5 space-y-2">
                      <li>Tap the Share button at the bottom of the screen</li>
                      <li>Scroll down and tap "Add to Home Screen"</li>
                      <li>Tap "Add" in the top-right corner</li>
                      <li>The app will appear on your home screen</li>
                    </ol>
                  ) : (
                    <ol className="list-decimal ml-5 space-y-2">
                      <li>Tap the menu button (three dots) in your browser</li>
                      <li>Look for "Add to Home Screen" or "Install App"</li>
                      <li>Follow the prompts to install the app</li>
                      <li>The app will appear on your home screen</li>
                    </ol>
                  )}
                </div>
              )}
              
              {deviceType === 'desktop' && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Test on Mobile Device</h4>
                  <p className="mb-2">To test installation on a mobile device, scan this QR code with your phone:</p>
                  
                  {showQRCode ? (
                    <div className="flex justify-center my-4">
                      <div className="bg-white p-4 rounded">
                        <div className="text-center text-sm">
                          {/* Placeholder for QR code - in a real app, generate dynamically */}
                          <div className="w-40 h-40 bg-gray-200 mx-auto mb-2 flex items-center justify-center">
                            QR Code Placeholder
                          </div>
                          <p>{window.location.href}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={generateQRCode}
                      className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Generate QR Code
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-700 mb-2">Verification Checklist</h3>
              <p className="mb-2">After installing, verify the following:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>App launches without browser UI (address bar, etc.)</li>
                <li>App icon appears on home screen/desktop</li>
                <li>App works offline (try enabling airplane mode)</li>
                <li>App loads quickly on subsequent launches</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallationTest;
