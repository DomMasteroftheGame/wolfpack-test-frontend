import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface OfflineStatusProps {
  showFullPage?: boolean;
}

const OfflineStatus: React.FC<OfflineStatusProps> = ({ showFullPage = false }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('App is online');
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('App is offline');
      
      if (showFullPage) {
        navigate('/offline');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [navigate, showFullPage]);

  if (!showFullPage && isOnline) {
    return null;
  }

  if (!showFullPage) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex items-center px-4 py-2 text-white bg-red-600 rounded-full shadow-lg">
          <span className="mr-2">●</span>
          <span>Offline</span>
        </div>
      </div>
    );
  }


  return null;
};

export default OfflineStatus;
