/**
 * Build Your Wolfpack PWA Integration
 * Main entry point for PWA functionality
 */
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    console.log('PWA initialization started');
    
    const pathname = window.location.pathname;
    if (pathname === '/' || pathname === '/index' || pathname === '') {
      console.log('Redirecting to coffee corner...');
      window.location.replace('/pages/coffe-corner');
      return;
    }
    
    initApp();
    
    setTimeout(function() {
      forceShowNavigation();
    }, 300);
    
    setTimeout(logPageLoadingDiagnostics, 1500);
  });

  function initApp() {
    console.log('PWA initialization started');
    
    const pathname = window.location.pathname;
    console.log('Current path:', pathname);
    
    const isCoffeeCorner = pathname.includes('/pages/coffe-corner');
    const isGamePage = pathname.includes('/pages/game');
    
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error('Root element not found! PWA cannot initialize.');
      return;
    }
    
    if (isCoffeeCorner) {
      console.log('Loading coffee corner content...');
      loadCoffeeCornerApp();
    } else if (isGamePage) {
      console.log('Loading game portal content...');
      loadGameApp();
    } else {
      console.log('Loading standard Shopify page content for:', pathname);
    }
  }

  function loadCoffeeCornerApp() {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      console.log('Loading Coffee Corner content...');
      
      rootElement.innerHTML = `
        <div class="coffee-corner-app">
          <h2>Coffee Corner PWA Experience</h2>
          <p>The PWA is now loaded and working correctly.</p>
          <div class="coffee-products">
            <div class="coffee-product">
              <img src="/assets/logo.png" alt="Coffee Product" />
              <h3>Premium Coffee Blend</h3>
              <p>Our signature blend for the true coffee enthusiast.</p>
              <button class="btn">Add to Cart</button>
            </div>
          </div>
        </div>
      `;
      
      rootElement.style.display = 'block';
      rootElement.style.visibility = 'visible';
    }
  }

  function loadGameApp() {
    const gamePortal = document.getElementById('game-portal-mount');
    if (gamePortal) {
      console.log('Loading Game Portal content...');
      
      gamePortal.innerHTML = `
        <div class="game-portal-app">
          <h2>Wolfpack Game Portal</h2>
          <p>Game portal is now loaded and ready to play.</p>
          <div class="game-preview">
            <img src="/assets/icon-192x192.png" alt="Game Preview" />
            <button class="btn btn--large">Start Playing</button>
          </div>
        </div>
      `;
      
      gamePortal.style.display = 'block';
      gamePortal.style.visibility = 'visible';
    }
  }
  
  function forceShowNavigation() {
    const siteNav = document.querySelector('.site-nav.site-navigation');
    const headerNavigation = document.querySelector('.header-item--navigation');
    const headerWrapper = document.querySelector('.header-wrapper');
    
    if (siteNav) {
      console.log('Found site navigation, making visible');
      siteNav.style.display = 'flex';
      siteNav.style.visibility = 'visible';
      siteNav.style.opacity = '1';
    } else {
      console.warn('Site navigation not found');
    }
    
    if (headerNavigation) {
      console.log('Found header navigation, making visible');
      headerNavigation.style.display = 'block';
      headerNavigation.style.visibility = 'visible';
      headerNavigation.style.opacity = '1';
    }
    
    document.querySelectorAll('.site-nav__link:not([data-no-instant]):not(.site-nav__link--has-dropdown)').forEach(link => {
      if (link.tagName.toLowerCase() === 'a' && link.href) {
        link.removeEventListener('click', handleNavClick);
        link.addEventListener('click', handleNavClick);
      }
    });
    
    const currentPath = window.location.pathname;
    document.querySelectorAll('.site-nav__link').forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('site-nav__link--active');
      }
    });
  }
  
  function handleNavClick(e) {
    const href = this.getAttribute('href');
    console.log('Navigation link clicked:', href);
  }
  
  function logNavigationStructure() {
    console.log('=== NAVIGATION STRUCTURE DIAGNOSTIC ===');
    
    const details = document.querySelectorAll('[data-section-type="header"] details[data-hover="true"]');
    console.log(`Found ${details.length} details elements with data-hover="true"`);
    
    details.forEach((detail, i) => {
      const summary = detail.querySelector('summary');
      const link = summary?.dataset?.link || 'No link';
      console.log(`Detail #${i+1}: ${summary?.textContent?.trim() || 'No text'} -> ${link}`);
    });
    
    const links = document.querySelectorAll('.site-nav__link:not(.site-nav__link--has-dropdown)');
    console.log(`Found ${links.length} regular navigation links`);
  }
  
  function logPageLoadingDiagnostics() {
    console.log('=== PAGE LOADING DIAGNOSTICS ===');
    console.log('Current URL:', window.location.href);
    console.log('Pathname:', window.location.pathname);
    console.log('Root element exists:', !!document.getElementById('root'));
    
    const mainContent = document.getElementById('MainContent');
    console.log('Main content element exists:', !!mainContent);
    
    const coffeeContainer = document.querySelector('.coffee-corner-container');
    console.log('Coffee corner container exists:', !!coffeeContainer);
    
    if (window.theme && window.theme.template) {
      console.log('Current template:', window.theme.template);
    }
    
    console.log('Service Worker supported:', 'serviceWorker' in navigator);
  }
  
  setTimeout(logNavigationStructure, 1000);
})();

window.loadGamePortalInline = function() {
  console.log('Starting inline game portal loading...');
  
  setTimeout(function() {
    console.log('Transitioning to separate game page...');
    window.location.href = '/pages/game';
  }, 2000);
  
  const gameContent = document.getElementById('game-content');
  if (gameContent) {
    gameContent.style.display = 'block';
    gameContent.scrollIntoView({ behavior: 'smooth' });
  }
};

window.initializeGamePage = function() {
  console.log('Initializing game page...');
  
  const gameContainer = document.getElementById('root-game');
  if (!gameContainer) {
    console.error('Game container not found');
    return;
  }
  
  const hasNewTemplate = document.getElementById('initial-loading');
  if (hasNewTemplate) {
    console.log('New game template detected, skipping legacy initialization');
    return;
  }
  
  if (window.React && window.ReactDOM) {
    try {
      console.log('React detected, attempting to mount app...');
      
      if (window.App) {
        const root = ReactDOM.createRoot ? 
          ReactDOM.createRoot(gameContainer) : 
          { render: (component) => ReactDOM.render(component, gameContainer) };
          
        root.render(React.createElement(window.App));
        console.log('React PWA app mounted successfully');
      } else {
        const FallbackApp = () => React.createElement('div', {
          style: { textAlign: 'center', padding: '40px', color: '#FFF8DC' }
        }, 
          React.createElement('h3', null, '🎮 Game Portal'),
          React.createElement('p', null, 'Welcome to Build Your Wolfpack!'),
          React.createElement('p', { style: { marginTop: '20px' } }, 
            React.createElement('a', {
              href: '/pages/coffer-corner',
              style: {
                color: '#FF6B35',
                textDecoration: 'none',
                padding: '10px 20px',
                border: '2px solid #FF6B35',
                borderRadius: '25px',
                transition: 'all 0.3s ease'
              }
            }, '← Back to Coffee Corner')
          )
        );
        
        const root = ReactDOM.createRoot ? 
          ReactDOM.createRoot(gameContainer) : 
          { render: (component) => ReactDOM.render(component, gameContainer) };
          
        root.render(React.createElement(FallbackApp));
        console.log('Fallback React component mounted');
      }
    } catch (error) {
      console.error('Error loading React app:', error);
      showLegacyFallback(gameContainer);
    }
  } else {
    console.log('React not available, showing fallback content');
    showLegacyFallback(gameContainer);
  }
};

function showLegacyFallback(gameContainer) {
  gameContainer.innerHTML = `
    <div style="text-align: center; padding: 40px; color: #FFF8DC;">
      <h3>Game Portal</h3>
      <p>Welcome to Build Your Wolfpack!</p>
      <p style="margin-top: 20px;">
        <a href="/pages/coffer-corner" style="
          color: #FF6B35;
          text-decoration: none;
          padding: 10px 20px;
          border: 2px solid #FF6B35;
          border-radius: 25px;
          transition: all 0.3s ease;
        ">← Back to Coffee Corner</a>
      </p>
    </div>
  `;
}

window.initializeReactApp = function(container) {
  console.log('Initializing React app in container:', container);
  
  if (!window.React || !window.ReactDOM) {
    console.error('React or ReactDOM not available');
    return false;
  }
  
  try {
    if (window.App) {
      const root = ReactDOM.createRoot ? 
        ReactDOM.createRoot(container) : 
        { render: (component) => ReactDOM.render(component, container) };
        
      root.render(React.createElement(window.App));
      console.log('Main React app mounted successfully');
      return true;
    } else {
      console.log('Main App component not found, using game-specific component');
      
      const GamePortalApp = () => {
        const [isLoading, setIsLoading] = React.useState(true);
        
        React.useEffect(() => {
          const timer = setTimeout(() => {
            setIsLoading(false);
          }, 2000);
          
          return () => clearTimeout(timer);
        }, []);
        
        if (isLoading) {
          return React.createElement('div', {
            style: { textAlign: 'center', padding: '40px', color: '#FFF8DC' }
          },
            React.createElement('div', {
              style: {
                width: '50px',
                height: '50px',
                border: '5px solid #F5DEB3',
                borderTop: '5px solid #FF6B35',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px'
              }
            }),
            React.createElement('h3', null, 'Loading Game Components...'),
            React.createElement('p', { style: { opacity: 0.8 } }, 'Please wait while we prepare your experience')
          );
        }
        
        return React.createElement('div', {
          style: { textAlign: 'center', padding: '40px', color: '#FFF8DC' }
        },
          React.createElement('h2', { 
            style: { color: '#F5DEB3', marginBottom: '20px' } 
          }, '🎮 Build Your Wolfpack'),
          React.createElement('p', { 
            style: { fontSize: '1.1rem', marginBottom: '15px' } 
          }, 'Welcome to the Game Portal!'),
          React.createElement('div', {
            style: {
              background: 'rgba(255, 107, 53, 0.1)',
              border: '2px solid rgba(255, 107, 53, 0.3)',
              borderRadius: '12px',
              padding: '20px',
              margin: '20px 0'
            }
          },
            React.createElement('h4', { 
              style: { color: '#FF6B35', marginBottom: '10px' } 
            }, '🚀 Game Features'),
            React.createElement('p', { 
              style: { fontSize: '0.9rem', opacity: 0.9 } 
            }, 'Your wolfpack gaming experience is now active!')
          ),
          React.createElement('p', { style: { marginTop: '30px' } },
            React.createElement('a', {
              href: '/pages/coffer-corner',
              style: {
                color: '#FF6B35',
                textDecoration: 'none',
                padding: '12px 24px',
                border: '2px solid #FF6B35',
                borderRadius: '25px',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                fontWeight: '600'
              }
            }, '← Return to Coffee Corner')
          )
        );
      };
      
      const root = ReactDOM.createRoot ? 
        ReactDOM.createRoot(container) : 
        { render: (component) => ReactDOM.render(component, container) };
        
      root.render(React.createElement(GamePortalApp));
      console.log('Game-specific React component mounted');
      return true;
    }
  } catch (error) {
    console.error('Error mounting React app:', error);
    return false;
  }
};

window.loadGamePortal = window.loadGamePortalInline;
window.initializeGame = window.initializeGamePage;

function ensureGameAccessSection() {
  if (document.querySelector('.game-access-section')) {
    console.log('Game access section already exists');
    return;
  }
  
  const isLocalDev = !window.Shopify || !window.Shopify.theme;
  
  if (isLocalDev) {
    console.log('Local dev detected, injecting game access section...');
    
    const gameAccessHTML = `
      <div class="game-access-section" style="
        background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
        padding: 40px 20px;
        text-align: center;
        margin: 40px 0;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(139, 69, 19, 0.3);
        position: relative;
        overflow: hidden;
      ">
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"20\" cy=\"20\" r=\"2\" fill=\"rgba(255,255,255,0.1)\"/><circle cx=\"80\" cy=\"40\" r=\"1\" fill=\"rgba(255,255,255,0.1)\"/><circle cx=\"40\" cy=\"80\" r=\"1.5\" fill=\"rgba(255,255,255,0.1)\"/></svg>');
          pointer-events: none;
        "></div>
        
        <div style="position: relative; z-index: 2;">
          <h2 style="
            color: #FFF8DC;
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 16px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          ">#Infinite Game</h2>
          
          <h3 style="
            color: #F5DEB3;
            font-size: 1.8rem;
            margin-bottom: 20px;
            font-weight: 600;
          ">Build Your Wolfpack</h3>
          
          <div style="margin-bottom: 30px;">
            <p style="color: #FFF8DC; font-size: 1.1rem; margin-bottom: 8px;">✓ Win as a team build your wolfpack</p>
            <p style="color: #FFF8DC; font-size: 1.1rem; margin-bottom: 8px;">✓ The game we are all meant to play</p>
            <p style="color: #FFF8DC; font-size: 1.1rem; margin-bottom: 8px;">✓ Addictive limit game play to 2hrs a day 4 at max</p>
          </div>
          
          <button id="game-portal-access" class="game-access-btn" style="
            background: linear-gradient(45deg, #FF6B35 0%, #F7931E 100%);
            color: white;
            border: none;
            padding: 18px 40px;
            font-size: 1.3rem;
            font-weight: bold;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
            text-transform: uppercase;
            letter-spacing: 1px;
            position: relative;
            z-index: 3;
          " 
          onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 25px rgba(255, 107, 53, 0.6)';"
          onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 20px rgba(255, 107, 53, 0.4)';">
            🎮 START PLAYING - $199.99
          </button>
          
          <div id="game-loading-state" style="display: none; margin-top: 20px;">
            <div style="
              background: rgba(0,0,0,0.8);
              border-radius: 8px;
              padding: 20px;
              color: #FFF8DC;
            ">
              <div style="
                width: 40px;
                height: 40px;
                border: 4px solid #F5DEB3;
                border-top: 4px solid #FF6B35;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 15px;
              "></div>
              <p style="font-size: 1.1rem; margin: 0;">🎮 Loading Game Portal...</p>
              <p style="font-size: 0.9rem; margin: 5px 0 0; opacity: 0.8;">Preparing your wolfpack experience</p>
            </div>
          </div>
        </div>
      </div>
      
      <div id="game-content" style="display: none; margin-top: 40px;">
        <div style="
          background: linear-gradient(135deg, #2C1810 0%, #8B4513 100%);
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          text-align: center;
        ">
          <h3 style="color: #F5DEB3; margin-bottom: 20px; font-size: 1.5rem;">
            🎮 Preparing Game Portal...
          </h3>
          <div style="
            width: 50px;
            height: 50px;
            border: 5px solid #F5DEB3;
            border-top: 5px solid #FF6B35;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          "></div>
          <p style="color: #FFF8DC; margin: 0;">
            Loading your wolfpack experience...
          </p>
        </div>
      </div>
    `;
    
    const body = document.body;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = gameAccessHTML;
    
    const existingContent = document.querySelector('.main-content') || document.querySelector('main') || body;
    if (existingContent && existingContent !== body) {
      existingContent.appendChild(tempDiv.firstElementChild);
    } else {
      body.appendChild(tempDiv.firstElementChild);
    }
    
    setupGameAccessButton();
  }
}

function setupGameAccessButton() {
  const gameBtn = document.getElementById('game-portal-access');
  const loadingState = document.getElementById('game-loading-state');
  
  if (gameBtn && loadingState) {
    gameBtn.addEventListener('click', function() {
      console.log('Game portal access clicked');
      
      gameBtn.style.display = 'none';
      loadingState.style.display = 'block';
      
      if (window.loadGamePortalInline) {
        window.loadGamePortalInline();
      } else {
        setTimeout(function() {
          window.location.href = '/pages/game';
        }, 2000);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(ensureGameAccessSection, 1000);
});

if (document.readyState === 'loading') {
} else {
  setTimeout(ensureGameAccessSection, 1000);
}
