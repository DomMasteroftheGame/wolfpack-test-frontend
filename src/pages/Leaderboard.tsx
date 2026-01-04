import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import { LeaderboardEntry } from '../types';
import { leaderboardApi } from '../api';
import Navbar from '../components/Navbar';

const Leaderboard = () => {
  const { token } = useAuth();
  const { messages } = useWebSocket();
  const [leaderboardByIVP, setLeaderboardByIVP] = useState<LeaderboardEntry[]>([]);
  const [leaderboardByTiles, setLeaderboardByTiles] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'ivp' | 'tiles'>('ivp');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      if (!token) return;
      
      setLoading(true);
      try {
        const [ivpData, tilesData] = await Promise.all([
          leaderboardApi.getLeaderboardByIVP(token),
          leaderboardApi.getLeaderboardByTiles(token)
        ]);
        
        setLeaderboardByIVP(ivpData);
        setLeaderboardByTiles(tilesData);
        setError(null);
      } catch (err) {
        console.error('Error loading leaderboard:', err);
        setError('Failed to load leaderboard data');
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [token]);

  useEffect(() => {
    if (messages.length === 0) return;

    const latestMessage = messages[messages.length - 1];
    
    if (latestMessage.type === 'leaderboard_updated') {
      if (latestMessage.data.by_ivp) {
        setLeaderboardByIVP(latestMessage.data.by_ivp);
      }
      
      if (latestMessage.data.by_tiles) {
        setLeaderboardByTiles(latestMessage.data.by_tiles);
      }
    }
  }, [messages]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading leaderboard...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const activeLeaderboard = activeTab === 'ivp' ? leaderboardByIVP : leaderboardByTiles;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container p-4 mx-auto">
        <h1 className="mb-6 text-3xl font-bold">Leaderboard</h1>
        
        {/* Tab navigation */}
        <div className="flex mb-6 border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'ivp'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('ivp')}
          >
            By Intrinsic Value Points
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'tiles'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('tiles')}
          >
            By Tiles Filled
          </button>
        </div>
        
        {/* Leaderboard table */}
        <div className="overflow-hidden bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Rank
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                  {activeTab === 'ivp' ? 'Total IVP' : 'Tiles Filled'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeLeaderboard.map((entry, index) => (
                <tr key={entry.id} className={index < 3 ? 'bg-yellow-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {index + 1}
                      {index === 0 && ' 🥇'}
                      {index === 1 && ' 🥈'}
                      {index === 2 && ' 🥉'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{entry.name}</div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {activeTab === 'ivp' ? entry.total_ivp : entry.total_tiles_filled}
                    </div>
                  </td>
                </tr>
              ))}
              {activeLeaderboard.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
