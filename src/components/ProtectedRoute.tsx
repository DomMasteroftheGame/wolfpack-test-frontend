import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    console.log("🛡️ ProtectedRoute: Loading Auth State...");
    return (
      <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black text-yellow-500 font-mono">
        <div className="animate-pulse text-xl font-bold mb-4">AUTHENTICATING WOLFPACK ID...</div>
        <div className="text-sm text-gray-500">Secure Link Establishing...</div>
        <button
          onClick={() => { localStorage.clear(); window.location.reload(); }}
          className="mt-8 px-4 py-2 border border-red-900 text-red-500 text-xs hover:bg-red-900/20"
        >
          [DEBUG: RESET LOCAL DATA]
        </button>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!currentUser.selected_card_id) {
    return <Navigate to="/select-card" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
