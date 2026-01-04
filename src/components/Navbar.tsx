import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, userCard, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!currentUser) return null;

  return (
    <nav className="bg-gray-950 border-b border-gray-800">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <img
                src={window.pwaThemeVariables?.gameAssets?.logoGold || 'https://cdn.shopify.com/s/files/1/0861/2764/0916/files/wolfpack-logo.png'}
                alt="Build Your Wolfpack"
                className="h-8 w-auto"
              />
              <span className="ml-2 text-sm font-mono font-bold text-gray-200 tracking-wider">WOLFPACK</span>
            </Link>
          </div>

          <div className="flex-1"></div>

          <div className="flex items-center">
            {userCard && (
              <div className="flex items-center mr-4">
                <div className="w-8 h-8 mr-2 bg-gray-900 rounded border border-gray-700">
                  {userCard.image_url && (
                    <img
                      src={userCard.image_url}
                      alt={userCard.name}
                      className="object-cover w-full h-full rounded"
                    />
                  )}
                </div>
                <span className="text-xs font-mono text-gray-400 hidden md:block">{currentUser.name}</span>
              </div>
            )}

            <button
              onClick={handleSignOut}
              className="px-3 py-1 text-xs font-mono font-medium text-red-500 border border-red-900/30 hover:bg-red-900/20 rounded bg-black"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
