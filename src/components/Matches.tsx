import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import { connectionsApi } from '../api';
import { Match, NewBoardData } from '../types';

const Matches = () => {
  const { token } = useAuth();
  const { messages } = useWebSocket();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [boardName, setBoardName] = useState('');
  const [boardDescription, setBoardDescription] = useState('');
  const [creatingBoard, setCreatingBoard] = useState(false);

  useEffect(() => {
    const loadMatches = async () => {
      if (!token) return;
      
      setLoading(true);
      try {
        const matchesData = await connectionsApi.getMatches(token);
        setMatches(matchesData);
        setError(null);
      } catch (err) {
        console.error('Error loading matches:', err);
        setError('Failed to load matches');
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [token]);

  useEffect(() => {
    if (messages.length === 0) return;

    const latestMessage = messages[messages.length - 1];
    
    if (latestMessage.type === 'new_match') {
      if (token) {
        connectionsApi.getMatches(token)
          .then(matchesData => setMatches(matchesData))
          .catch(err => console.error('Error reloading matches:', err));
      }
    } else if (latestMessage.type === 'new_board_invitation') {
      navigate(`/project/${latestMessage.data.project_id}`);
    }
  }, [messages, token, navigate]);

  const handleCreateBoard = (match: Match) => {
    setSelectedMatch(match);
    setBoardName(`Collaboration with ${match.name}`);
    setBoardDescription('A new collaboration project');
    setShowCreateBoard(true);
  };

  const handleSubmitBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedMatch) return;
    
    setCreatingBoard(true);
    try {
      const boardData: NewBoardData = {
        name: boardName,
        description: boardDescription
      };
      
      const project = await connectionsApi.createBoardForMatch(token, selectedMatch.user_id, boardData);
      
      setShowCreateBoard(false);
      navigate(`/project/${project.id}`);
    } catch (err) {
      console.error('Error creating board:', err);
      setError('Failed to create board');
    } finally {
      setCreatingBoard(false);
    }
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Your Matches</h2>
      
      {matches.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            You don't have any matches yet. Start connecting with other users!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match.user_id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{match.name}</h3>
                  <p className="text-sm text-gray-500">Matched on {new Date(match.matched_on).toLocaleDateString()}</p>
                </div>
                
                {match.board_id ? (
                  <button
                    onClick={() => navigate(`/project/${match.board_id}`)}
                    className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded"
                  >
                    View Board
                  </button>
                ) : (
                  <button
                    onClick={() => handleCreateBoard(match)}
                    className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded"
                  >
                    Create Board
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Create Board Modal */}
      {showCreateBoard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Create a Board with {selectedMatch?.name}</h3>
            
            <form onSubmit={handleSubmitBoard}>
              <div className="mb-4">
                <label htmlFor="boardName" className="block text-sm font-medium text-gray-700 mb-1">
                  Board Name
                </label>
                <input
                  type="text"
                  id="boardName"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="boardDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="boardDescription"
                  value={boardDescription}
                  onChange={(e) => setBoardDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateBoard(false)}
                  className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded"
                  disabled={creatingBoard}
                >
                  {creatingBoard ? 'Creating...' : 'Create Board'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Matches;
