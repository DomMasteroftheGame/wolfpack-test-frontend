/**
 * Utility to handle communication between Shopify theme and PWA
 * Optimized for Impulse theme integration
 */

// Extend Window interface to include pwaThemeVariables
declare global {
  interface Window {
    pwaThemeVariables: {
      assetsUrl: string;
      publicPath: string;
      vendorPath: string;
      cssPath: string;
      logoPath: string;
      apiUrl?: string;
      socketUrl: string;
      isAuthenticated: boolean;
      user?: any;
      routes?: any;

      primaryColor: string;
      primaryColorLight: string;
      primaryColorDim: string;
      secondaryColor: string;

      backgroundColor: string;
      backgroundDim: string;
      backgroundLightDim: string;
      backgroundMediumDim: string;

      textColor: string;
      textColorLight: string;
      textColorVeryLight: string;
      textColorSlight: string;
      textSavingsColor: string;

      borderColor: string;
      accentColor: string;

      announcementColor: string;
      announcementTextColor: string;

      drawerColor: string;
      drawerDimColor: string;
      drawerBorderColor: string;
      drawerTextColor: string;
      drawerTextDarkColor: string;
      drawerButtonColor: string;
      drawerButtonTextColor: string;

      footerColor: string;
      footerTextColor: string;

      navColor: string;
      navTextColor: string;

      modalBgColor: string;
      cartDotColor: string;
      priceColor: string;
      saleTagColor: string;
      saleTagTextColor: string;
      heroTextColor: string;

      headingFont: string;
      headingFallbackFont: string;
      headingSize: string;
      headingWeight: string;
      headingLineHeight: string;
      headingSpacing: string;

      bodyFont: string;
      bodyFallbackFont: string;
      bodySize: string;
      bodyWeight: string;
      bodyLineHeight: string;
      bodySpacing: string;

      collectionTitleSize: string;

      borderRadius: string;
      buttonStyle: string;
      gridGutter: string;
      drawerGutter: string;
      gameAssets?: {
        cardLabor: string;
        cardFinance: string;
        cardSales: string;
        cardLocked: string;
        tokenAlpha: string;
        tokenAlly: string;
        tokenEnemy: string;
        gameboardBg?: string;
        logoGold?: string;
        iconIvp?: string;
        iconEquity?: string;
        iconCash?: string;
        iconCoffee?: string;
        btnStartMission?: string;
        bgKanbanCol?: string;
        navRadar?: string;
      };
    };
    getThemeVariable?: (variableName: string, fallback?: string) => string;
    getThemeCssVariable?: (variableName: string, fallback?: string) => string;
    themeSettings?: Record<string, string>;
  }
}

export interface ThemeColors {
  primary: string;                // colorBtnPrimary
  primaryLight?: string;          // colorBtnPrimaryLight
  primaryDim?: string;            // colorBtnPrimaryDim
  secondary: string;              // colorBtnPrimaryText

  background: string;             // colorBody
  backgroundDim?: string;         // colorBodyDim
  backgroundLightDim?: string;    // colorBodyLightDim
  backgroundMediumDim?: string;   // colorBodyMediumDim

  text: string;                   // colorTextBody
  textLight?: string;             // colorTextBodyAlpha015
  textVeryLight?: string;         // colorTextBodyAlpha005
  textSlight?: string;            // colorTextBodyAlpha008
  bodyText?: string;              // colorTextBody (alias)
  textSavings?: string;           // colorTextSavings

  border?: string;                // colorBorder
  accent?: string;                // colorLink
  buttonHover?: string;           // colorBtnPrimaryDim (alias)

  announcement?: string;          // colorAnnouncement
  announcementText?: string;      // colorAnnouncementText

  drawer?: string;                // colorDrawers
  drawerDim?: string;             // colorDrawersDim
  drawerBorder?: string;          // colorDrawerBorder
  drawerText?: string;            // colorDrawerText
  drawerTextDark?: string;        // colorDrawerTextDark
  drawerButton?: string;          // colorDrawerButton
  drawerButtonText?: string;      // colorDrawerButtonText

  footer?: string;                // colorFooter
  footerText?: string;            // colorFooterText

  nav?: string;                   // colorNav 
  navText?: string;               // colorNavText

  modalBg?: string;               // colorModalBg
  cartDot?: string;               // colorCartDot
  price?: string;                 // colorPrice
  saleTag?: string;               // colorSaleTag
  saleTagText?: string;           // colorSaleTagText
  heroText?: string;              // colorHeroText
}

export interface ThemeFonts {
  heading: string;                // typeHeaderPrimary
  headingFallback?: string;       // typeHeaderFallback
  headingSize?: string;           // typeHeaderSize
  headingWeight?: string;         // typeHeaderWeight
  headingLineHeight?: string;     // typeHeaderLineHeight
  headingSpacing?: string;        // typeHeaderSpacing

  body: string;                   // typeBasePrimary
  bodyFallback?: string;          // typeBaseFallback
  bodySize?: string;              // typeBaseSize
  bodyWeight?: string;            // typeBaseWeight
  bodyLineHeight?: string;        // typeBaseLineHeight
  bodySpacing?: string;           // typeBaseSpacing

  collectionTitleSize?: string;   // typeCollectionTitle

  buttonRadius?: string;          // buttonRadius
  buttonStyle?: string;           // buttonStyle
  gridGutter?: string;            // gridGutter
  drawerGutter?: string;          // drawerGutter
}

export interface ShopInfo {
  name: string;
  currency: string;
  domain?: string;
}

export const ShopifyBridge = {
  /**
   * Initialize the bridge when loaded in Shopify
   */
  init() {
    window.addEventListener('message', this.handleMessage.bind(this));

    this.initThemeVariables();

    if (window !== window.parent) {
      this.sendToShopify('PWA_LOADED');

      this.setupResizeObserver();

      console.log('ShopifyBridge initialized in iframe mode');
    } else {
      console.log('ShopifyBridge initialized in standalone mode');
    }
  },

  /**
   * Set up a resize observer to track content height changes
   */
  setupResizeObserver() {
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(entries => {
        // Fix for "entries is not iterable" error in some environments
        Array.from(entries).forEach(entry => {
          const height = Math.ceil(entry.contentRect.height);
          if (height > 100) { // Only update if height is meaningful
            this.updateFrameSize(height + 50); // Add padding
          }
        });
      });

      const appContainer = document.getElementById('root') || document.body;
      resizeObserver.observe(appContainer);
    }
  },

  /**
   * Handle incoming messages from Shopify
   */
  handleMessage(event: MessageEvent) {
    const allowedOrigins = [
      window.location.origin,
      'https://buildyourwolfpack.com',
      'https://buildyourwolfpack.myshopify.com',
      'https://psychowolfpack.myshopify.com',
      'https://buildyourwolfpack.com/apps/bitlogin'
    ];

    if (!allowedOrigins.includes(event.origin) &&
      !event.origin.includes('myshopify.com') &&
      !event.origin.includes('shopify.com')) {
      console.warn('Rejected message from unauthorized origin:', event.origin);
      return;
    }

    const { type, data } = event.data || {};

    switch (type) {
      case 'SHOPIFY_USER_DATA':
        if (data?.customer) {
          console.log('Received customer data from Shopify');
          this.handleCustomerData(data.customer);
        }
        break;

      case 'THEME_SETTINGS':
        if (data?.colors) {
          console.log('Applying Shopify theme colors to PWA');
          this.applyThemeColors(data.colors);
        }

        if (data?.fonts) {
          console.log('Applying Shopify theme fonts to PWA');
          this.applyThemeFonts(data.fonts);
        }
        break;

      case 'SHOPIFY_READY':
        console.log('Shopify theme is ready');
        this.updateFrameSize(document.body.scrollHeight);
        break;

      default:
        console.log('Unknown message type:', type);
    }
  },

  /**
   * Handle customer data from Shopify
   */
  handleCustomerData(customer: any) {
    if (customer.email) {
      localStorage.setItem('shopify_customer_email', customer.email);
    }

    window.dispatchEvent(new CustomEvent('shopify:customer-data', {
      detail: { customer }
    }));
  },

  /**
   * Initialize theme variables from window.pwaThemeVariables
   * This is used when the app is loaded directly in Shopify
   */
  initThemeVariables() {
    if (window.pwaThemeVariables) {
      const colors: ThemeColors = {
        primary: window.pwaThemeVariables.primaryColor,
        primaryLight: window.pwaThemeVariables.primaryColorLight,
        primaryDim: window.pwaThemeVariables.primaryColorDim,
        secondary: window.pwaThemeVariables.secondaryColor,

        background: window.pwaThemeVariables.backgroundColor,
        backgroundDim: window.pwaThemeVariables.backgroundDim,
        backgroundLightDim: window.pwaThemeVariables.backgroundLightDim,
        backgroundMediumDim: window.pwaThemeVariables.backgroundMediumDim,

        text: window.pwaThemeVariables.textColor,
        textLight: window.pwaThemeVariables.textColorLight,
        textVeryLight: window.pwaThemeVariables.textColorVeryLight,
        textSlight: window.pwaThemeVariables.textColorSlight,
        bodyText: window.pwaThemeVariables.textColor,
        textSavings: window.pwaThemeVariables.textSavingsColor,

        border: window.pwaThemeVariables.borderColor,
        accent: window.pwaThemeVariables.accentColor,
        buttonHover: window.pwaThemeVariables.primaryColorDim,

        announcement: window.pwaThemeVariables.announcementColor,
        announcementText: window.pwaThemeVariables.announcementTextColor,

        drawer: window.pwaThemeVariables.drawerColor,
        drawerDim: window.pwaThemeVariables.drawerDimColor,
        drawerBorder: window.pwaThemeVariables.drawerBorderColor,
        drawerText: window.pwaThemeVariables.drawerTextColor,
        drawerTextDark: window.pwaThemeVariables.drawerTextDarkColor,
        drawerButton: window.pwaThemeVariables.drawerButtonColor,
        drawerButtonText: window.pwaThemeVariables.drawerButtonTextColor,

        footer: window.pwaThemeVariables.footerColor,
        footerText: window.pwaThemeVariables.footerTextColor,

        nav: window.pwaThemeVariables.navColor,
        navText: window.pwaThemeVariables.navTextColor,

        modalBg: window.pwaThemeVariables.modalBgColor,
        cartDot: window.pwaThemeVariables.cartDotColor,
        price: window.pwaThemeVariables.priceColor,
        saleTag: window.pwaThemeVariables.saleTagColor,
        saleTagText: window.pwaThemeVariables.saleTagTextColor,
        heroText: window.pwaThemeVariables.heroTextColor
      };

      const fonts: ThemeFonts = {
        heading: window.pwaThemeVariables.headingFont,
        headingFallback: window.pwaThemeVariables.headingFallbackFont,
        headingSize: window.pwaThemeVariables.headingSize,
        headingWeight: window.pwaThemeVariables.headingWeight,
        headingLineHeight: window.pwaThemeVariables.headingLineHeight,
        headingSpacing: window.pwaThemeVariables.headingSpacing,

        body: window.pwaThemeVariables.bodyFont,
        bodyFallback: window.pwaThemeVariables.bodyFallbackFont,
        bodySize: window.pwaThemeVariables.bodySize,
        bodyWeight: window.pwaThemeVariables.bodyWeight,
        bodyLineHeight: window.pwaThemeVariables.bodyLineHeight,
        bodySpacing: window.pwaThemeVariables.bodySpacing,

        collectionTitleSize: window.pwaThemeVariables.collectionTitleSize,

        buttonRadius: window.pwaThemeVariables.borderRadius,
        buttonStyle: window.pwaThemeVariables.buttonStyle,
        gridGutter: window.pwaThemeVariables.gridGutter,
        drawerGutter: window.pwaThemeVariables.drawerGutter
      };

      this.applyThemeColors(colors);
      this.applyThemeFonts(fonts);

      console.log('Theme variables initialized from window.pwaThemeVariables');
    } else {
      console.warn('window.pwaThemeVariables not found, using default theme');
    }
  },

  /**
   * Apply theme colors from Shopify to PWA
   */
  applyThemeColors(colors: ThemeColors) {
    document.documentElement.style.setProperty('--pwa-primary-color', colors.primary || '#111111');
    document.documentElement.style.setProperty('--pwa-secondary-color', colors.secondary || '#ffffff');

    if (colors.primaryLight) {
      document.documentElement.style.setProperty('--pwa-primary-color-light', colors.primaryLight);
    }

    if (colors.primaryDim) {
      document.documentElement.style.setProperty('--pwa-primary-color-dim', colors.primaryDim);
    }

    document.documentElement.style.setProperty('--pwa-background-color', colors.background || '#ffffff');

    if (colors.backgroundDim) {
      document.documentElement.style.setProperty('--pwa-background-dim', colors.backgroundDim);
    }

    if (colors.backgroundLightDim) {
      document.documentElement.style.setProperty('--pwa-background-light-dim', colors.backgroundLightDim);
    }

    if (colors.backgroundMediumDim) {
      document.documentElement.style.setProperty('--pwa-background-medium-dim', colors.backgroundMediumDim);
    }

    document.documentElement.style.setProperty('--pwa-text-color', colors.text || '#000000');

    if (colors.textLight) {
      document.documentElement.style.setProperty('--pwa-text-color-light', colors.textLight);
    }

    if (colors.textVeryLight) {
      document.documentElement.style.setProperty('--pwa-text-color-very-light', colors.textVeryLight);
    }

    if (colors.textSlight) {
      document.documentElement.style.setProperty('--pwa-text-color-slight', colors.textSlight);
    }

    if (colors.bodyText) {
      document.documentElement.style.setProperty('--pwa-body-text-color', colors.bodyText);
    }

    if (colors.textSavings) {
      document.documentElement.style.setProperty('--pwa-text-savings-color', colors.textSavings);
    }

    if (colors.border) {
      document.documentElement.style.setProperty('--pwa-border-color', colors.border);
    }

    if (colors.accent) {
      document.documentElement.style.setProperty('--pwa-accent-color', colors.accent);
    }

    if (colors.buttonHover) {
      document.documentElement.style.setProperty('--pwa-button-hover-color', colors.buttonHover);
    }

    if (colors.announcement) {
      document.documentElement.style.setProperty('--pwa-announcement-color', colors.announcement);
    }

    if (colors.announcementText) {
      document.documentElement.style.setProperty('--pwa-announcement-text', colors.announcementText);
    }

    if (colors.drawer) {
      document.documentElement.style.setProperty('--pwa-drawer-bg', colors.drawer);
    }

    if (colors.drawerDim) {
      document.documentElement.style.setProperty('--pwa-drawer-dim', colors.drawerDim);
    }

    if (colors.drawerBorder) {
      document.documentElement.style.setProperty('--pwa-drawer-border', colors.drawerBorder);
    }

    if (colors.drawerText) {
      document.documentElement.style.setProperty('--pwa-drawer-text', colors.drawerText);
    }

    if (colors.drawerTextDark) {
      document.documentElement.style.setProperty('--pwa-drawer-text-dark', colors.drawerTextDark);
    }

    if (colors.drawerButton) {
      document.documentElement.style.setProperty('--pwa-drawer-button', colors.drawerButton);
    }

    if (colors.drawerButtonText) {
      document.documentElement.style.setProperty('--pwa-drawer-button-text', colors.drawerButtonText);
    }

    if (colors.footer) {
      document.documentElement.style.setProperty('--pwa-footer-bg', colors.footer);
    }

    if (colors.footerText) {
      document.documentElement.style.setProperty('--pwa-footer-text', colors.footerText);
    }

    if (colors.nav) {
      document.documentElement.style.setProperty('--pwa-nav-bg', colors.nav);
    }

    if (colors.navText) {
      document.documentElement.style.setProperty('--pwa-nav-text', colors.navText);
    }

    if (colors.modalBg) {
      document.documentElement.style.setProperty('--pwa-modal-bg', colors.modalBg);
    }

    if (colors.cartDot) {
      document.documentElement.style.setProperty('--pwa-cart-dot', colors.cartDot);
    }

    if (colors.price) {
      document.documentElement.style.setProperty('--pwa-price', colors.price);
    }

    if (colors.saleTag) {
      document.documentElement.style.setProperty('--pwa-sale-tag', colors.saleTag);
    }

    if (colors.saleTagText) {
      document.documentElement.style.setProperty('--pwa-sale-tag-text', colors.saleTagText);
    }

    if (colors.heroText) {
      document.documentElement.style.setProperty('--pwa-hero-text', colors.heroText);
    }

    document.documentElement.style.setProperty('--primary-color', colors.primary || '#111111');
    document.documentElement.style.setProperty('--secondary-color', colors.secondary || '#ffffff');
    document.documentElement.style.setProperty('--text-color', colors.text || '#000000');
    document.documentElement.style.setProperty('--background-color', colors.background || '#ffffff');

    window.dispatchEvent(new CustomEvent('shopify:theme-colors-updated', {
      detail: { colors }
    }));
  },

  /**
   * Apply theme fonts from Shopify to PWA
   */
  applyThemeFonts(fonts: ThemeFonts) {
    document.documentElement.style.setProperty('--pwa-heading-font', fonts.heading || 'sans-serif');

    if (fonts.headingFallback) {
      document.documentElement.style.setProperty('--pwa-heading-fallback-font', fonts.headingFallback);
    }

    if (fonts.headingSize) {
      document.documentElement.style.setProperty('--pwa-heading-size', fonts.headingSize);
    }

    if (fonts.headingWeight) {
      document.documentElement.style.setProperty('--pwa-heading-weight', fonts.headingWeight);
    }

    if (fonts.headingLineHeight) {
      document.documentElement.style.setProperty('--pwa-heading-line-height', fonts.headingLineHeight);
    }

    if (fonts.headingSpacing) {
      document.documentElement.style.setProperty('--pwa-heading-spacing', fonts.headingSpacing);
    }

    document.documentElement.style.setProperty('--pwa-body-font', fonts.body || 'sans-serif');

    if (fonts.bodyFallback) {
      document.documentElement.style.setProperty('--pwa-body-fallback-font', fonts.bodyFallback);
    }

    if (fonts.bodySize) {
      document.documentElement.style.setProperty('--pwa-body-size', fonts.bodySize);
    }

    if (fonts.bodyWeight) {
      document.documentElement.style.setProperty('--pwa-body-weight', fonts.bodyWeight);
    }

    if (fonts.bodyLineHeight) {
      document.documentElement.style.setProperty('--pwa-body-line-height', fonts.bodyLineHeight);
    }

    if (fonts.bodySpacing) {
      document.documentElement.style.setProperty('--pwa-body-spacing', fonts.bodySpacing);
    }

    if (fonts.collectionTitleSize) {
      document.documentElement.style.setProperty('--pwa-collection-title-size', fonts.collectionTitleSize);
    }

    if (fonts.buttonRadius) {
      document.documentElement.style.setProperty('--pwa-border-radius', fonts.buttonRadius);
    }

    if (fonts.buttonStyle) {
      document.documentElement.style.setProperty('--pwa-button-style', fonts.buttonStyle);
    }

    if (fonts.gridGutter) {
      document.documentElement.style.setProperty('--pwa-spacing-unit', fonts.gridGutter);
    }

    if (fonts.drawerGutter) {
      document.documentElement.style.setProperty('--pwa-drawer-gutter', fonts.drawerGutter);
    }

    document.documentElement.style.setProperty('--heading-font', fonts.heading || 'sans-serif');
    document.documentElement.style.setProperty('--body-font', fonts.body || 'sans-serif');

    window.dispatchEvent(new CustomEvent('shopify:theme-fonts-updated', {
      detail: { fonts }
    }));
  },

  /**
   * Update frame size (useful for responsive content)
   */
  updateFrameSize(height: number) {
    this.sendToShopify('RESIZE_FRAME', { height });
  },

  /**
   * Send a message to the Shopify theme
   */
  sendToShopify(type: string, data: any = {}) {
    if (window !== window.parent) {
      window.parent.postMessage({ type, data }, '*');
    }
  },

  /**
   * Navigate to a different page within Shopify
   */
  navigateTo(url: string) {
    this.sendToShopify('NAVIGATE_TO', { url });
  }
};

export default ShopifyBridge;
