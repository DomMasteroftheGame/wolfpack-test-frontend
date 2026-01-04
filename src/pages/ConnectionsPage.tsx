import { useState } from 'react';
import Navbar from '../components/Navbar';
import UserConnectionProfile from '../components/UserConnectionProfile';
import SwipeConnect from '../components/SwipeConnect';
import Matches from '../components/Matches';
import { FirebaseChatRoom } from '../components/FirebaseChatRoom';
import NeutralGroundBanner from '../components/NeutralGroundBanner';
import { WolfSignal } from '../components/WolfSignal';
import { useAuth } from '../contexts/AuthContext';

const ConnectionsPage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'connect' | 'matches' | 'pack' | 'territory'>('profile');
  const [selectedPack, setSelectedPack] = useState<any>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Connections</h1>

        {/* Tab navigation */}
        <div className="flex mb-6 border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'profile'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('profile')}
          >
            Your Profile
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'connect'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('connect')}
          >
            Connect
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'matches'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('matches')}
          >
            Matches
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'pack'
              ? 'text-yellow-600 border-b-2 border-yellow-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => {
              setActiveTab('pack');
              // Mock selecting a pack for demo
              setSelectedPack({ id: 'pack_123', name: 'Alpha Squad', type: 'pack' });
            }}
          >
            The Pack
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'territory'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => {
              setActiveTab('territory');
              // Mock selecting a territory for demo
              setSelectedTerritory({ id: 'territory_nyc', name: 'Downtown NYC', type: 'territory' });
            }}
          >
            Territory
          </button>
        </div>

        {/* Tab content */}
        <div className="max-w-3xl mx-auto">
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <UserConnectionProfile />
              <div className="border-t border-gray-200 pt-8">
                <WolfSignal userId={currentUser?.id || ''} userName={currentUser?.name || 'Recruit'} />
              </div>
            </div>
          )}
          {activeTab === 'connect' && <SwipeConnect />}
          {activeTab === 'matches' && <Matches />}
          {activeTab === 'pack' && selectedPack && (
            <div>
              <NeutralGroundBanner channelId={selectedPack.id} />
              <FirebaseChatRoom path={`packs/${selectedPack.id}/messages`} title={selectedPack.name} isPack={true} />
            </div>
          )}
          {activeTab === 'territory' && selectedTerritory && (
            <FirebaseChatRoom path={`territories/${selectedTerritory.id}/messages`} title={selectedTerritory.name} isPack={false} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionsPage;
