import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import { GameboardTile, LeaderboardEntry } from '../types';
import { gameboardApi, leaderboardApi } from '../api';
import GameboardCircle from '../components/GameboardCircle';

const GameboardAndLeaderboard = () => {
  const { token } = useAuth();
  const { messages } = useWebSocket();
  const [gameboard, setGameboard] = useState<(GameboardTile | null)[]>(Array(40).fill(null));
  const [leaderboardByIVP, setLeaderboardByIVP] = useState<LeaderboardEntry[]>([]);
  const [leaderboardByTiles, setLeaderboardByTiles] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'ivp' | 'tiles'>('ivp');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [gameboardData, ivpData, tilesData] = await Promise.all([
          gameboardApi.getGlobalGameboard(token),
          leaderboardApi.getLeaderboardByIVP(token),
          leaderboardApi.getLeaderboardByTiles(token)
        ]);

        const boardTiles = Array(40).fill(null);
        if (gameboardData.tiles && Array.isArray(gameboardData.tiles)) {
          gameboardData.tiles.forEach((tile, index) => {
            if (tile) {
              boardTiles[index] = tile;
            }
          });
        }

        setGameboard(boardTiles);
        setLeaderboardByIVP(ivpData);
        setLeaderboardByTiles(tilesData);
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  useEffect(() => {
    if (messages.length === 0) return;

    const latestMessage = messages[messages.length - 1];

    if (latestMessage.type === 'task_completed') {
      setGameboard(prev => {
        const updatedGameboard = [...prev];
        const tileIndex = latestMessage.data.gameboard.next_available_tile - 1;

        if (tileIndex >= 0 && tileIndex < updatedGameboard.length) {
          updatedGameboard[tileIndex] = latestMessage.data.gameboard.tiles[tileIndex];
        }

        return updatedGameboard;
      });
    }

    if (latestMessage.type === 'leaderboard_updated') {
      if (latestMessage.data.by_ivp) {
        setLeaderboardByIVP(latestMessage.data.by_ivp);
      }

      if (latestMessage.data.by_tiles) {
        setLeaderboardByTiles(latestMessage.data.by_tiles);
      }
    }
  }, [messages]);

  const activeLeaderboard = activeTab === 'ivp' ? leaderboardByIVP : leaderboardByTiles;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container p-4 mx-auto">
        <h1 className="mb-6 text-3xl font-bold">Global Gameboard & Leaderboard</h1>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-xl text-gray-500">Loading data...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="p-4 text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Gameboard section - takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <div className="p-6 bg-white rounded-lg shadow-lg">
                <h2 className="mb-4 text-xl font-semibold">Gameboard</h2>
                <p className="mb-6 text-gray-600">
                  This board shows the progress across all projects. Each tile represents a completed task.
                </p>
                <GameboardCircle tiles={gameboard} className="mb-8" />

                {/* Recent completions */}
                <div className="mt-8">
                  <h3 className="mb-4 text-lg font-semibold">Recent Completions</h3>
                  <div className="overflow-hidden bg-gray-50 rounded-lg shadow">
                    <ul className="divide-y divide-gray-200">
                      {gameboard
                        .filter(tile => tile !== null)
                        .slice(-5)
                        .reverse()
                        .map((tile, index) => (
                          <li key={index} className="p-4 hover:bg-gray-100">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{tile?.task_title}</p>
                                <p className="text-sm text-gray-500">Completed by {tile?.user_name}</p>
                              </div>
                              <span className="px-2 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
                                {tile?.ivp_value} IVP
                              </span>
                            </div>
                          </li>
                        ))}
                      {gameboard.filter(tile => tile !== null).length === 0 && (
                        <li className="p-4 text-center text-gray-500">
                          No tasks completed yet
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Leaderboard section - takes 1 column */}
            <div>
              <div className="p-6 bg-white rounded-lg shadow-lg">
                <h2 className="mb-4 text-xl font-semibold">Leaderboard</h2>

                {/* Tab navigation */}
                <div className="flex mb-6 border-b border-gray-200">
                  <button
                    className={`px-4 py-2 font-medium ${activeTab === 'ivp'
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                      }`}
                    onClick={() => setActiveTab('ivp')}
                  >
                    By IVP
                  </button>
                  <button
                    className={`px-4 py-2 font-medium ${activeTab === 'tiles'
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                      }`}
                    onClick={() => setActiveTab('tiles')}
                  >
                    By Tiles
                  </button>
                </div>

                {/* Leaderboard table */}
                <div className="overflow-hidden bg-white rounded-lg shadow">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Rank
                        </th>
                        <th scope="col" className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Name
                        </th>
                        <th scope="col" className="px-3 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                          {activeTab === 'ivp' ? 'IVP' : 'Tiles'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {activeLeaderboard.map((entry, index) => (
                        <tr key={entry.id} className={index < 3 ? 'bg-yellow-50' : ''}>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {index + 1}
                              {index === 0 && ' 🥇'}
                              {index === 1 && ' 🥈'}
                              {index === 2 && ' 🥉'}
                            </div>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{entry.name}</div>
                          </td>
                          <td className="px-3 py-3 text-right whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {activeTab === 'ivp' ? entry.total_ivp : entry.total_tiles_filled}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {activeLeaderboard.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-3 py-3 text-center text-sm text-gray-500">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameboardAndLeaderboard;
