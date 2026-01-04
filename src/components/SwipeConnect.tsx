import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import { connectionsApi } from '../api';
import { AvailableProfile } from '../types';

const SwipeConnect = () => {
  const { token } = useAuth();
  const { messages } = useWebSocket();
  const [profiles, setProfiles] = useState<AvailableProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchAnimation, setMatchAnimation] = useState(false);
  const [matchedUser, setMatchedUser] = useState<string | null>(null);

  useEffect(() => {
    const loadProfiles = async () => {
      if (!token) return;
      
      setLoading(true);
      try {
        const profilesData = await connectionsApi.getAvailableProfiles(token);
        setProfiles(profilesData);
        setError(null);
      } catch (err) {
        console.error('Error loading profiles:', err);
        setError('Failed to load profiles');
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [token]);

  useEffect(() => {
    if (messages.length === 0) return;

    const latestMessage = messages[messages.length - 1];
    
    if (latestMessage.type === 'new_match') {
      setMatchAnimation(true);
      setMatchedUser(latestMessage.data.name);
      
      setTimeout(() => {
        setMatchAnimation(false);
        setMatchedUser(null);
      }, 3000);
    }
  }, [messages]);

  const connectWith = async (userId: string) => {
    if (!token) return;
    
    try {
      const result = await connectionsApi.matchWithUser(token, userId);
      
      if (result.matched) {
      }
      
      nextProfile();
    } catch (err) {
      console.error('Error connecting with user:', err);
      setError('Failed to connect with user');
    }
  };

  const skip = () => {
    nextProfile();
  };

  const nextProfile = () => {
    setCurrentIndex(prev => {
      const next = prev + 1;
      
      if (next >= profiles.length) {
        setLoading(true);
        
        connectionsApi.getAvailableProfiles(token || '')
          .then(profilesData => {
            setProfiles(profilesData);
            setCurrentIndex(0);
            setLoading(false);
          })
          .catch(err => {
            console.error('Error reloading profiles:', err);
            setError('Failed to reload profiles');
            setLoading(false);
          });
        
        return prev;
      }
      
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded">
        {error}
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h3 className="text-xl font-semibold mb-2">No profiles available</h3>
        <p className="text-gray-600">
          There are no more profiles to connect with at the moment. Check back later!
        </p>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <div className="relative">
      {/* Match animation overlay */}
      {matchAnimation && (
        <div className="absolute inset-0 bg-indigo-500 bg-opacity-90 flex flex-col items-center justify-center z-10 rounded-lg">
          <div className="text-white text-4xl font-bold mb-4">It's a Match!</div>
          <div className="text-white text-xl">You and {matchedUser} have connected!</div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-2">{currentProfile.name}</h3>
          
          <div className="mb-4">
            <p className="text-gray-700">{currentProfile.bio}</p>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {currentProfile.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Looking For</h4>
            <div className="flex flex-wrap gap-2">
              {currentProfile.needs.map((need) => (
                <span
                  key={need}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                >
                  {need}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => skip()}
              className="flex-1 mr-2 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded"
            >
              Skip
            </button>
            <button
              onClick={() => connectWith(currentProfile.user_id)}
              className="flex-1 ml-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded"
            >
              Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwipeConnect;
