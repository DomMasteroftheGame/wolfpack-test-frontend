import { useAuth } from '../contexts/AuthContext';

const SelectedCardDisplay = () => {
  const { userCard } = useAuth();

  if (!userCard) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-lg p-3 max-w-xs border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <img 
            src={userCard.image_url} 
            alt={userCard.name} 
            className="w-12 h-12 object-cover rounded-md"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">{userCard.name}</h3>
          <p className="text-xs text-gray-500 truncate">{userCard.target_market || 'Your selected card'}</p>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-xs text-gray-600 line-clamp-2">{userCard.description}</p>
      </div>
    </div>
  );
};

export default SelectedCardDisplay;
