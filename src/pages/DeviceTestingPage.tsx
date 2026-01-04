import React from 'react';
import DeviceTesting from '../components/DeviceTesting';

const DeviceTestingPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">PWA Device Testing</h1>
      <p className="mb-6 text-gray-700">
        This page allows you to test the PWA on different devices and screen sizes.
        Select a device from the dropdown to simulate how the app would appear and behave on that device.
      </p>
      
      <DeviceTesting />
    </div>
  );
};

export default DeviceTestingPage;
