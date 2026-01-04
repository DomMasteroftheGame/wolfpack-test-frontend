import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Card } from '../types';
import { authApi, cardsApi } from '../api';

const localAuth = {
  getStoredUser: () => {
    const storedUser = localStorage.getItem('local_user');
    return storedUser ? JSON.parse(storedUser) : null;
  },

  signIn: async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('local_users') || '[]');
    const user = users.find((u: any) => u.email === email);

    if (user && user.password === password) {
      localStorage.setItem('local_user', JSON.stringify(user));
      return user;
    }

    throw new Error('Invalid credentials');
  },

  signUp: async (email: string, password: string, name: string) => {
    const users = JSON.parse(localStorage.getItem('local_users') || '[]');

    if (users.some((u: any) => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: Date.now().toString(),
      firebase_uid: Date.now().toString(), // Keep for compatibility with backend
      email,
      name,
      password // In a real app, we would hash this
    };

    users.push(newUser);
    localStorage.setItem('local_users', JSON.stringify(users));
    localStorage.setItem('local_user', JSON.stringify(newUser));

    return newUser;
  },

  signOut: async () => {
    localStorage.removeItem('local_user');
    localStorage.removeItem('auth_token');
  },

  onAuthStateChanged: (callback: (user: any) => void) => {
    const storedUser = localStorage.getItem('local_user');
    if (storedUser) {
      callback(JSON.parse(storedUser));
    } else {
      callback(null);
    }

    // For MVP, just return a no-op unsubscribe function
    return () => { };
  }
};

interface AuthContextType {
  currentUser: User | null;
  userCard: Card | null;
  loading: boolean;
  token: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, referrerId?: string | null) => Promise<void>;
  signOut: () => Promise<void>;
  selectCard: (cardId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userCard, setUserCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));

  useEffect(() => {
    console.log("🐺 OAuthProvider: Initializing...");
    let safetyTimer: any;

    // Safety Timeout: Force stop loading after 5 seconds if generic hang occurs
    safetyTimer = setTimeout(() => {
      if (loading) {
        console.warn("⚠️ Auth Initialization timed out! Forcing load complete.");
        setLoading(false);
      }
    }, 5000);

    const unsubscribe = localAuth.onAuthStateChanged(async (localUser) => {
      console.log("🐺 Auth State Changed:", localUser ? "User Found" : "No User");

      if (localUser) {
        try {
          const authToken = localStorage.getItem('auth_token') || localUser.id;
          setToken(authToken);

          console.log("🐺 Registering/Syncing User...");
          const user = await authApi.register({
            firebase_uid: localUser.firebase_uid || localUser.id,
            email: localUser.email || '',
            name: localUser.name || '',
          });
          console.log("🐺 User Synced:", user.id);

          setCurrentUser(user);

          try {
            console.log("🐺 Fetching User Card...");
            const card = await cardsApi.getUserCard(authToken);
            setUserCard(card);
            console.log("🐺 Card Loaded");
          } catch (error) {
            console.warn("⚠️ Failed to load card:", error);
            setUserCard(null);
          }
        } catch (error) {
          console.error('❌ Error setting up user:', error);
          // If auth fails, we might want to clear local user to prevent infinite loop
          // localStorage.removeItem('local_user'); 
        }
      } else {
        setCurrentUser(null);
        setUserCard(null);
        setToken(null);
      }

      console.log("🐺 Auth Initialization Complete. Setting loading=false");
      clearTimeout(safetyTimer);
      setLoading(false);
    });

    return () => {
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const user = await localAuth.signIn(email, password);
      localStorage.setItem('auth_token', user.id);
      setToken(user.id);

      try {
        // First try to fetch the user to verify sync
        await authApi.getCurrentUser(user.id);
      } catch (error) {
        // If fetch fails (e.g. 404), try to register/sync
        try {
          await authApi.register({
            firebase_uid: user.firebase_uid || user.id,
            email: user.email,
            name: user.name,
          });
        } catch (regError) {
          console.error('Error syncing user with backend:', regError);
        }
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, referrerId?: string | null) => {
    setLoading(true);
    try {
      const user = await localAuth.signUp(email, password, name);
      localStorage.setItem('auth_token', user.id);
      setToken(user.id);

      await authApi.register({
        firebase_uid: user.firebase_uid || user.id,
        email: user.email,
        name: user.name,
        referred_by: referrerId
      });

      // Initialize Dom Chat
      try {
        await authApi.initializeChat(user.firebase_uid || user.id);
        console.log('🐺 Chat initialized with Dom');
      } catch (chatError) {
        console.error('Error initializing chat:', chatError);
        // Don't fail the whole signup if chat init fails
      }
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await localAuth.signOut();
      localStorage.removeItem('auth_token');
      setToken(null);
      setCurrentUser(null);
      setUserCard(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const selectCard = async (cardId: string) => {
    if (!token) throw new Error('Not authenticated');

    try {
      const updatedUser = await authApi.selectCard(token, cardId);
      setCurrentUser(updatedUser);

      const card = await cardsApi.getUserCard(token);
      setUserCard(card);
    } catch (error) {
      console.error('Error selecting card:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userCard,
    loading,
    token,
    signIn,
    signUp,
    signOut,
    selectCard,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
