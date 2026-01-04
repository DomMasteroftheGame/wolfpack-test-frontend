
import Navbar from '../components/Navbar';
import MatchmakingRadar from '../components/MatchmakingRadar';

const FindPack = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <MatchmakingRadar />
      </div>
    </div>
  );
};

export default FindPack;
