/**
 * Shopify PWA Bridge
 * Facilitates communication between Shopify theme and PWA application
 */
(function() {
  window.ShopifyPWA = window.ShopifyPWA || {};
  
  window.ShopifyPWA.settings = {
    shop: Shopify.shop,
    locale: Shopify.locale,
    currency: Shopify.currency,
    theme: {
      name: theme.settings.themeName,
      version: theme.settings.themeVersion,
      moneyFormat: theme.settings.moneyFormat,
      colorPrimary: getComputedStyle(document.documentElement).getPropertyValue('--colorPrimary').trim(),
      colorSecondary: getComputedStyle(document.documentElement).getPropertyValue('--colorSecondary').trim(),
      colorAccent: getComputedStyle(document.documentElement).getPropertyValue('--colorAccent').trim()
    },
    routes: theme.routes
  };
  
  window.ShopifyPWA.cart = {
    addItem: function(id, quantity, properties) {
      return fetch(theme.routes.cartAdd, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          quantity: quantity,
          properties: properties || {}
        })
      }).then(response => response.json());
    },
    getCart: function() {
      return fetch(theme.routes.cart)
        .then(response => response.json());
    },
    updateItem: function(id, quantity) {
      return fetch(theme.routes.cartChange, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          quantity: quantity
        })
      }).then(response => response.json());
    }
  };
  
  window.ShopifyPWA.events = {
    _listeners: {},
    on: function(event, callback) {
      this._listeners[event] = this._listeners[event] || [];
      this._listeners[event].push(callback);
    },
    off: function(event, callback) {
      if (!this._listeners[event]) return;
      if (!callback) {
        delete this._listeners[event];
      } else {
        this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
      }
    },
    emit: function(event, data) {
      if (!this._listeners[event]) return;
      this._listeners[event].forEach(callback => callback(data));
    }
  };
  
  document.addEventListener('DOMContentLoaded', function() {
    window.ShopifyPWA.events.emit('ready', window.ShopifyPWA);
    console.log('Shopify PWA Bridge initialized');
  });
})();
