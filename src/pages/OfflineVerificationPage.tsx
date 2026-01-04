import React from 'react';
import OfflineVerification from '../components/OfflineVerification';

const OfflineVerificationPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Offline Functionality Verification</h1>
      <p className="mb-6 text-gray-700">
        This page allows you to verify that the PWA works correctly in offline mode.
        You can simulate offline conditions and run tests to ensure all offline features are functioning properly.
      </p>
      
      <OfflineVerification />
    </div>
  );
};

export default OfflineVerificationPage;
