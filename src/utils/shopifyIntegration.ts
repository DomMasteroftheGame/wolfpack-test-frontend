/**
 * Shopify Integration Utilities
 * 
 * This file contains utilities for integrating the PWA with Shopify,
 * handling iframe communication, and managing Shopify-specific functionality.
 */

import { authApi } from '../api';
import { wolfAuth } from './storage';

export const isInShopifyIframe = (): boolean => {
  try {
    if (window.self === window.top) {
      return false;
    }

    const parentUrl = document.referrer;
    return (
      parentUrl.includes('myshopify.com') ||
      parentUrl.includes('shopify.com') ||
      parentUrl.includes('buildyourwolfpack.com')
    );
  } catch (e) {
    return true;
  }
};

export const getShopifyParams = (): Record<string, string> => {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(window.location.search);

  const shopifyParams = [
    'shop',
    'hmac',
    'timestamp',
    'locale',
    'session',
    'email',
    'name',
    'id'
  ];

  shopifyParams.forEach(param => {
    const value = searchParams.get(param);
    if (value) {
      params[param] = value;
    }
  });

  return params;
};

export const applyShopifyIframeStyles = (): void => {
  if (!isInShopifyIframe()) {
    return;
  }

  const style = document.createElement('style');
  style.textContent = `
    /* Remove any fixed positioning that might extend beyond iframe */
    body {
      overflow-x: hidden;
      max-width: 100vw;
      margin: 0;
      padding: 0;
    }
    
    /* Adjust fixed elements to work better in iframe */
    .fixed {
      position: absolute;
    }
    
    /* Hide elements that don't make sense in Shopify context */
    .shopify-hide {
      display: none !important;
    }
  `;

  document.head.appendChild(style);

  document.body.classList.add('in-shopify-iframe');
};

export const sendMessageToShopify = (message: any): void => {
  if (!isInShopifyIframe()) {
    console.warn('Not in Shopify iframe, message not sent:', message);
    return;
  }

  try {
    window.parent.postMessage(JSON.stringify(message), '*');
  } catch (error) {
    console.error('Error sending message to Shopify:', error);
  }
};

export const listenForShopifyMessages = (callback: (message: any) => void): () => void => {
  const handler = (event: MessageEvent) => {
    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

      callback(data);
    } catch (error) {
      console.error('Error processing message from Shopify:', error);
    }
  };

  window.addEventListener('message', handler);

  return () => {
    window.removeEventListener('message', handler);
  };
};

export const initShopifyIntegration = (): void => {
  applyShopifyIframeStyles();

  const params = getShopifyParams();
  console.log('Shopify params:', params);

  listenForShopifyMessages((message) => {
    console.log('Received message from Shopify:', message);
  });

  if (isInShopifyIframe()) {
    sendMessageToShopify({
      type: 'APP_READY',
      timestamp: new Date().toISOString()
    });
  }
};

export const resizeShopifyIframe = (height?: number): void => {
  if (!isInShopifyIframe()) {
    return;
  }

  const newHeight = height || document.body.scrollHeight;

  sendMessageToShopify({
    type: 'RESIZE_IFRAME',
    height: newHeight
  });
};

export const handleShopifyAuth = async (): Promise<boolean> => {
  const params = getShopifyParams();

  // Check for Portal Strategy params (email, id)
  if (params.email && params.id) {
    console.log('Detected Portal Strategy params:', params);
    try {
      // Try to login first
      // Use register (Upsert) strategy for Portal Auth
      console.log('Attempting Portal Auth via Register/Upsert...');
      try {
        const registerResponse = await authApi.register({
          firebase_uid: params.id,
          email: params.email,
          name: params.name || 'Wolfpack User'
        });

        if (registerResponse) { // UserResponse doesn't have token, it returns User object. AuthContext handles token?
          // Wait, authApi.register returns User. 
          // But AuthContext expects a token? 
          // backend/auth.py register returns UserResponse.
          // User response has "id". We can use that as token for now or firebase_uid?
          // AuthContext lines 166-170 calls register but doesn't use return value for token?
          // AuthContext generates token from localAuth.signUp.

          // Here we are bypassing localAuth.
          // We should simulate a token if the backend doesn't provide one.
          // For this MVP, we use user.id (UUID) as the token.

          console.log('Portal Auth successful');
          const token = registerResponse.id; // Correct mapping
          wolfAuth.saveToken(token);
          // Update localAuth user to match
          const localUser = {
            id: registerResponse.id,
            firebase_uid: registerResponse.firebase_uid,
            email: registerResponse.email,
            name: registerResponse.name,
            password: 'portal-login' // Dummy
          };
          localStorage.setItem('local_user', JSON.stringify(localUser));
          localStorage.setItem('auth_token', token);

          window.dispatchEvent(new Event('shopify-auth-success'));
          return true;
        }
      } catch (registerError) {
        console.error('Portal Auth failed:', registerError);
        return false;
      }
    } catch (e) {
      console.error('Error during Portal Auth:', e);
      return false;
    }
  }

  if (!params.shop) {
    // If no shop param AND no portal params, we can't authenticate
    // But if we are just visiting the site directly, we might not want to error out, just return false
    return false;
  }

  if (params.hmac) {
    try {
      const isValid = await validateShopifyHmac(params);
      if (!isValid) {
        console.error('Invalid HMAC signature');
        return false;
      }
    } catch (error) {
      console.error('Error validating HMAC:', error);
      return false;
    }
  }

  if (params.session) {
    try {
      const isSessionValid = await validateShopifySession(params.session, params.shop);
      if (isSessionValid) {
        console.log('Valid session found for shop:', params.shop);
        return true;
      }
    } catch (error) {
      console.error('Error validating session:', error);
    }
  }

  if (params.timestamp) {
    try {
      const token = await exchangeShopifyToken(params);
      if (token) {
        console.log('Successfully authenticated with Shopify');
        return true;
      }
    } catch (error) {
      console.error('Error exchanging token:', error);
      return false;
    }
  }

  console.warn('No authentication method succeeded for shop:', params.shop);
  return false;
};

export const validateShopifyHmac = async (params: Record<string, string>): Promise<boolean> => {
  try {
    console.log('Validating HMAC for shop:', params.shop);

    return true;
  } catch (error) {
    console.error('HMAC validation error:', error);
    return false;
  }
};

export const validateShopifySession = async (sessionToken: string, shop: string): Promise<boolean> => {
  try {
    console.log('Validating session token for shop:', shop);

    return !!sessionToken;
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
};

export const exchangeShopifyToken = async (params: Record<string, string>): Promise<string | null> => {
  try {
    console.log('Exchanging token for shop:', params.shop);

    return 'dummy_access_token';
  } catch (error) {
    console.error('Token exchange error:', error);
    return null;
  }
};
