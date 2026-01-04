import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import { GameboardTile } from '../types';
import { gameboardApi } from '../api';
import GameboardCircle from '../components/GameboardCircle';
import Navbar from '../components/Navbar';

const GlobalGameboard = () => {
  const { token } = useAuth();
  const { messages } = useWebSocket();
  const [gameboard, setGameboard] = useState<(GameboardTile | null)[]>(Array(40).fill(null));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGameboard = async () => {
      if (!token) return;
      
      setLoading(true);
      try {
        const data = await gameboardApi.getGlobalGameboard(token);
        const boardTiles = Array(40).fill(null);
        
        if (data.tiles && Array.isArray(data.tiles)) {
          data.tiles.forEach((tile, index) => {
            if (tile) {
              boardTiles[index] = tile;
            }
          });
        }
        
        setGameboard(boardTiles);
        setError(null);
      } catch (err) {
        console.error('Error loading gameboard:', err);
        setError('Failed to load gameboard');
      } finally {
        setLoading(false);
      }
    };

    loadGameboard();
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
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container p-4 mx-auto">
        <h1 className="mb-6 text-3xl font-bold">Global Gameboard</h1>
        <p className="mb-6 text-gray-600">
          This board shows the progress across all projects. Each tile represents a completed task.
        </p>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-xl text-gray-500">Loading gameboard...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="p-4 text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          </div>
        ) : (
          <div className="mb-12">
            <GameboardCircle tiles={gameboard} className="mb-8" />
          </div>
        )}
        
        {/* Recent completions */}
        {!loading && !error && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold">Recent Completions</h2>
            <div className="overflow-hidden bg-white rounded-lg shadow">
              <ul className="divide-y divide-gray-200">
                {gameboard
                  .filter(tile => tile !== null)
                  .slice(-5)
                  .reverse()
                  .map((tile, index) => (
                    <li key={index} className="p-4 hover:bg-gray-50">
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
        )}
      </div>
    </div>
  );
};

export default GlobalGameboard;
