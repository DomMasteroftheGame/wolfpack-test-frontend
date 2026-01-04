import React, { useState, useEffect } from 'react';

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#111] border border-[#FFD700] rounded-lg p-4 shadow-2xl shadow-yellow-900/20 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <h3 className="text-[#FFD700] font-bold uppercase tracking-wider text-sm">
            Initialize Wolfpack Protocol
          </h3>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        <p className="text-gray-400 text-xs">
          Install the app for offline access, instant notifications, and a full-screen tactical experience.
        </p>
        <button
          onClick={handleInstallClick}
          className="w-full py-2 bg-[#FFD700] text-black font-bold text-sm rounded hover:bg-[#E5C100] transition-colors uppercase tracking-widest"
        >
          Install App
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;
