import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ReactConfetti from 'react-confetti';

type CelebrationType = 'confetti' | 'fireworks' | 'claps' | null;

interface CelebrationContextType {
  celebrationType: CelebrationType;
  triggerCelebration: (type: CelebrationType, duration?: number) => void;
}

const CelebrationContext = createContext<CelebrationContextType | undefined>(undefined);

export function useCelebration() {
  const context = useContext(CelebrationContext);
  if (context === undefined) {
    throw new Error('useCelebration must be used within a CelebrationProvider');
  }
  return context;
}

interface CelebrationProviderProps {
  children: ReactNode;
}

export function CelebrationProvider({ children }: CelebrationProviderProps) {
  const [celebrationType, setCelebrationType] = useState<CelebrationType>(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const triggerCelebration = (type: CelebrationType, duration = 3000) => {
    setCelebrationType(type);
    
    setTimeout(() => {
      setCelebrationType(null);
    }, duration);
  };

  const renderCelebration = () => {
    switch (celebrationType) {
      case 'confetti':
        return (
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
          />
        );
      case 'fireworks':
        return (
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={300}
            gravity={0.2}
            colors={['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3']}
            confettiSource={{
              x: windowSize.width / 2,
              y: windowSize.height / 2,
              w: 0,
              h: 0
            }}
            initialVelocityY={20}
            tweenDuration={100}
          />
        );
      case 'claps':
        return (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="animate-bounce text-6xl">👏</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <CelebrationContext.Provider value={{ celebrationType, triggerCelebration }}>
      {renderCelebration()}
      {children}
    </CelebrationContext.Provider>
  );
}
