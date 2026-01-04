import React, { useState, useEffect } from 'react';
import { deviceProfiles, DeviceProfile, simulateDevice, getPWACompatibilityReport } from '../utils/deviceTesting';

interface DeviceTestingProps {
  onDeviceChange?: (device: DeviceProfile) => void;
}

const DeviceTesting: React.FC<DeviceTestingProps> = ({ onDeviceChange }) => {
  const [selectedDevice, setSelectedDevice] = useState<string>(Object.keys(deviceProfiles)[0]);
  const [deviceProfile, setDeviceProfile] = useState<DeviceProfile | null>(null);
  const [compatibilityReport, setCompatibilityReport] = useState<string>('');
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, boolean | 'running'>>({});

  useEffect(() => {
    const profile = simulateDevice(selectedDevice);
    setDeviceProfile(profile);
    if (profile && onDeviceChange) {
      onDeviceChange(profile);
    }
    
    setCompatibilityReport(getPWACompatibilityReport());
  }, [selectedDevice, onDeviceChange]);

  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDevice(e.target.value);
  };

  const runTest = (testName: string) => {
    console.log(`Running test: ${testName}`);
    
    const testMap: Record<string, () => Promise<boolean>> = {
      'offline': async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
      },
      'installation': async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
      },
      'responsive': async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return deviceProfile?.width !== undefined;
      },
      'performance': async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return Math.random() > 0.2; // 80% chance of success
      }
    };
    
    if (testMap[testName]) {
      setTestResults(prev => ({ ...prev, [testName]: 'running' }));
      
      testMap[testName]().then(result => {
        setTestResults(prev => ({ ...prev, [testName]: result }));
      });
    }
  };

  const getTestStatusIcon = (testName: string) => {
    const status = testResults[testName];
    if (status === undefined) return '⚪'; // Not run
    if (status === 'running') return '🔄'; // Running
    return status === true ? '✅' : '❌'; // Success or failure
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Device Testing</h2>
      
      <div className="mb-6">
        <label htmlFor="device-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select Device
        </label>
        <select
          id="device-select"
          value={selectedDevice}
          onChange={handleDeviceChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {Object.keys(deviceProfiles).map(device => (
            <option key={device} value={device}>
              {device}
            </option>
          ))}
        </select>
      </div>
      
      {deviceProfile && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Device Preview</h3>
            <div 
              className="border-8 border-gray-800 rounded-xl overflow-hidden bg-gray-100 mx-auto"
              style={{
                width: `${Math.min(deviceProfile.width / 4, 400)}px`,
                height: `${Math.min(deviceProfile.height / 4, 800)}px`,
                transform: deviceProfile.orientation === 'landscape' ? 'rotate(90deg)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <div className="w-full h-full relative">
                {!iframeLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                )}
                <iframe 
                  src="/"
                  title="Device Preview"
                  className="w-full h-full border-0"
                  onLoad={() => setIframeLoaded(true)}
                  style={{ opacity: iframeLoaded ? 1 : 0 }}
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Device Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Name:</strong> {deviceProfile.name}</p>
              <p><strong>Resolution:</strong> {deviceProfile.width}x{deviceProfile.height}</p>
              <p><strong>Pixel Ratio:</strong> {deviceProfile.devicePixelRatio}</p>
              <p><strong>Touch:</strong> {deviceProfile.touch ? 'Yes' : 'No'}</p>
              <p><strong>Orientation:</strong> {deviceProfile.orientation}</p>
              
              <h4 className="font-medium mt-4 mb-2">Capabilities</h4>
              <ul className="grid grid-cols-2 gap-1">
                {Object.entries(deviceProfile.capabilities).map(([capability, supported]) => (
                  <li key={capability} className="flex items-center">
                    <span className="mr-2">{supported ? '✅' : '❌'}</span>
                    <span>{capability}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <h3 className="text-lg font-semibold mt-6 mb-2">PWA Tests</h3>
            <div className="space-y-2">
              <button 
                onClick={() => runTest('offline')}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 mr-2"
              >
                {getTestStatusIcon('offline')} Test Offline
              </button>
              <button 
                onClick={() => runTest('installation')}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 mr-2"
              >
                {getTestStatusIcon('installation')} Test Installation
              </button>
              <button 
                onClick={() => runTest('responsive')}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 mr-2"
              >
                {getTestStatusIcon('responsive')} Test Responsive
              </button>
              <button 
                onClick={() => runTest('performance')}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                {getTestStatusIcon('performance')} Test Performance
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">PWA Compatibility Report</h3>
        <div 
          className="bg-gray-50 p-4 rounded-lg"
          dangerouslySetInnerHTML={{ __html: compatibilityReport }}
        />
      </div>
    </div>
  );
};

export default DeviceTesting;
