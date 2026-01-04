import React, { useState, useEffect } from 'react';
import { 
  runAllOfflineTests, 
  simulateOffline, 
  generateOfflineVerificationReport, 
  OfflineVerificationReport 
} from '../utils/offlineVerification';

interface OfflineVerificationProps {
  onTestComplete?: (report: OfflineVerificationReport) => void;
}

const OfflineVerification: React.FC<OfflineVerificationProps> = ({ onTestComplete }) => {
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [report, setReport] = useState<OfflineVerificationReport | null>(null);
  const [restoreOnline, setRestoreOnline] = useState<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      if (restoreOnline) {
        restoreOnline();
      }
    };
  }, [restoreOnline]);

  const handleToggleOfflineMode = () => {
    if (isOfflineMode && restoreOnline) {
      restoreOnline();
      setRestoreOnline(null);
      setIsOfflineMode(false);
    } else {
      const restore = simulateOffline();
      setRestoreOnline(() => restore);
      setIsOfflineMode(true);
    }
  };

  const handleRunTests = async () => {
    setIsRunningTests(true);
    
    try {
      const testReport = await runAllOfflineTests();
      setReport(testReport);
      
      if (onTestComplete) {
        onTestComplete(testReport);
      }
    } catch (error) {
      console.error('Error running offline tests:', error);
    } finally {
      setIsRunningTests(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Offline Functionality Verification</h2>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Offline Mode</h3>
            <p className="text-gray-600 text-sm">
              Simulate offline conditions to test how the app behaves without network connectivity.
            </p>
          </div>
          
          <button
            onClick={handleToggleOfflineMode}
            className={`px-4 py-2 rounded-md ${
              isOfflineMode 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isOfflineMode ? 'Disable Offline Mode' : 'Enable Offline Mode'}
          </button>
        </div>
        
        {isOfflineMode && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p className="font-bold">Offline Mode Enabled</p>
            <p>The app is currently simulating offline conditions. Network requests will fail.</p>
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Run Verification Tests</h3>
            <p className="text-gray-600 text-sm">
              Run a series of tests to verify that the app's offline functionality is working correctly.
            </p>
          </div>
          
          <button
            onClick={handleRunTests}
            disabled={isRunningTests}
            className={`px-4 py-2 rounded-md ${
              isRunningTests 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isRunningTests ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Running Tests...
              </span>
            ) : 'Run Verification Tests'}
          </button>
        </div>
      </div>
      
      {report && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Verification Report</h3>
          <div 
            className="bg-gray-50 p-4 rounded-lg"
            dangerouslySetInnerHTML={{ __html: generateOfflineVerificationReport(report) }}
          />
        </div>
      )}
      
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-2">Testing Instructions</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Enable offline mode using the button above</li>
          <li>Try navigating to different pages in the app</li>
          <li>Check if cached content is displayed correctly</li>
          <li>Run the verification tests to get a detailed report</li>
          <li>Disable offline mode when finished testing</li>
        </ol>
      </div>
    </div>
  );
};

export default OfflineVerification;
