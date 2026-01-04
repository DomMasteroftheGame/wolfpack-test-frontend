import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface WolfpackMatch {
  id: string;
  name: string;
  email: string;
  wolfType: string;
  lookingFor: string;
  coffeeShop?: string;
  selected_card?: string;
  createdAt: string;
}

const MatchmakingRadar = () => {
  const { currentUser, token } = useAuth();
  const [matches, setMatches] = useState<WolfpackMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<WolfpackMatch | null>(null);
  const [inviteMessage, setInviteMessage] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const API_URL = window.pwaThemeVariables?.apiUrl || 'http://localhost:3000';

  useEffect(() => {
    fetchMatches();
  }, [currentUser]);

  const fetchMatches = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_URL}/api/wolfpack/find?userId=${currentUser._id}&lookingFor=${currentUser.lookingFor}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }

      const data = await response.json();
      setMatches(data);
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError('Failed to load matches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvite = async () => {
    if (!selectedMatch || !currentUser) return;

    try {
      const response = await fetch(`${API_URL}/api/wolfpack/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fromUserId: currentUser._id,
          toUserId: selectedMatch.id,
          message: inviteMessage
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send invite');
      }

      const data = await response.json();
      
      // Open mailto link
      if (data.mailtoLink) {
        window.location.href = data.mailtoLink;
      }

      // Close modal and reset
      setShowInviteModal(false);
      setInviteMessage('');
      setSelectedMatch(null);
    } catch (err) {
      console.error('Error sending invite:', err);
      alert('Failed to send invite. Please try again.');
    }
  };

  const openInviteModal = (match: WolfpackMatch) => {
    setSelectedMatch(match);
    setShowInviteModal(true);
    setInviteMessage(`Hi ${match.name}! I'd love to connect and discuss our startup ideas. Let's grab coffee!`);
  };

  const getWolfTypeIcon = (type: string) => {
    switch (type) {
      case 'labor': return '🛠️';
      case 'finance': return '💰';
      case 'sales': return '🤝';
      default: return '🐺';
    }
  };

  const getWolfTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'labor': return 'bg-blue-500';
      case 'finance': return 'bg-green-500';
      case 'sales': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="loading-spinner w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">🎯 Find Your Pack</h2>
        <p className="text-gray-600">
          {currentUser?.lookingFor 
            ? `Looking for: ${currentUser.lookingFor} partners`
            : 'Set your preferences to find matches'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {matches.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">No matches found yet.</p>
          <p className="text-sm text-gray-400">
            Check back later or update your profile preferences.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-3xl mr-2">{getWolfTypeIcon(match.wolfType)}</span>
                  <div>
                    <h3 className="font-semibold text-lg">{match.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs text-white rounded ${getWolfTypeBadgeClass(match.wolfType)}`}>
                      {match.wolfType}
                    </span>
                  </div>
                </div>
              </div>

              {match.coffeeShop && (
                <div className="mb-3 text-sm text-gray-600">
                  <span className="mr-1">☕</span>
                  {match.coffeeShop}
                </div>
              )}

              {match.lookingFor && (
                <div className="mb-3 text-sm">
                  <span className="text-gray-500">Looking for:</span>
                  <span className="ml-1 font-medium">{match.lookingFor}</span>
                </div>
              )}

              <div className="text-xs text-gray-400 mb-3">
                Joined {new Date(match.createdAt).toLocaleDateString()}
              </div>

              <button
                onClick={() => openInviteModal(match)}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Send Coffee Invite
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 modal-content">
            <h3 className="text-xl font-bold mb-4">
              Send Invite to {selectedMatch.name}
            </h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Email:</span> {selectedMatch.email}
              </p>
              {selectedMatch.coffeeShop && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Coffee Shop:</span> {selectedMatch.coffeeShop}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personal Message
              </label>
              <textarea
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Add a personal message..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setSelectedMatch(null);
                  setInviteMessage('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInvite}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchmakingRadar;
