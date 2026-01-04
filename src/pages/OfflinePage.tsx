import React from 'react';
import { Link } from 'react-router-dom';

const OfflinePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-600 font-montserrat-bold">You're Offline</h1>
          <div className="mt-4 text-6xl">📶</div>
          <p className="mt-4 text-gray-600">
            It looks like you've lost your internet connection. Some features may be limited while offline.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-indigo-50 rounded-lg">
            <h2 className="text-lg font-semibold text-indigo-700">What you can do offline:</h2>
            <ul className="mt-2 ml-6 text-gray-700 list-disc">
              <li>View cached projects and tasks</li>
              <li>View your selected product/service card</li>
              <li>View previously loaded gameboard data</li>
            </ul>
          </div>
          
          <div className="p-4 bg-amber-50 rounded-lg">
            <h2 className="text-lg font-semibold text-amber-700">What requires internet:</h2>
            <ul className="mt-2 ml-6 text-gray-700 list-disc">
              <li>Creating new projects or tasks</li>
              <li>Updating task status</li>
              <li>Connecting with other users</li>
              <li>Viewing real-time updates</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <Link 
            to="/dashboard" 
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Go to Dashboard
          </Link>
          
          <button 
            onClick={() => window.location.reload()} 
            className="w-full px-4 py-2 text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Try Reconnecting
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfflinePage;
