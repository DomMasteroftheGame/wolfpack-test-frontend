import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OfflineStatus from './OfflineStatus';
import OfflinePage from '../pages/OfflinePage';
import { addOfflineTestButton } from '../utils/offlineTestUtils';

interface OfflineTestWrapperProps {
  children: React.ReactNode;
}

const OfflineTestWrapper: React.FC<OfflineTestWrapperProps> = ({ children }) => {
  useEffect(() => {
    addOfflineTestButton();
    
    console.log(`Initial online status: ${navigator.onLine ? 'online' : 'offline'}`);
  }, []);

  return (
    <>
      {/* Wrap the app with Router if it's not already wrapped */}
      <Router>
        {/* Show offline status indicator */}
        <OfflineStatus showFullPage={false} />
        
        <Routes>
          {/* Add offline page route */}
          <Route path="/offline" element={<OfflinePage />} />
          
          {/* Pass through all other routes to the children */}
          <Route path="/*" element={<>{children}</>} />
        </Routes>
      </Router>
    </>
  );
};

export default OfflineTestWrapper;
