import React, { useState } from 'react';
import InstallationTest from '../tests/installationTest';

interface InstallationTestButtonProps {
  className?: string;
}

const InstallationTestButton: React.FC<InstallationTestButtonProps> = ({ className = '' }) => {
  const [showTest, setShowTest] = useState(false);

  const openTest = () => {
    setShowTest(true);
  };

  const closeTest = () => {
    setShowTest(false);
  };

  return (
    <>
      <button
        onClick={openTest}
        className={`px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 ${className}`}
      >
        Test PWA Installation
      </button>

      {showTest && <InstallationTest onClose={closeTest} />}
    </>
  );
};

export default InstallationTestButton;
