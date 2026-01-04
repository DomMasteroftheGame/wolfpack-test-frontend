/**
 * Tri-Layer Storage Strategy
 * 
 * Implements redundancy for token storage to bypass browser tracking prevention:
 * 1. First-Party Cookie (document.cookie) - Primary method, works in iframes
 * 2. LocalStorage - Secondary method, blocked in some strict modes
 * 3. Memory - Fallback for current session
 */

// In-memory fallback
let TEMP_TOKEN: string | null = null;

export const wolfAuth = {
  saveToken: (token: string) => {
    // 1. Cookie (First-Party)
    // Secure, SameSite=Lax (or None if cross-site needed, but we are in iframe on same domain ideally)
    // Since we are in an iframe on a different domain (Render vs Shopify), we might need SameSite=None; Secure
    // But user prompt said "samesite=lax", let's stick to that unless it fails.
    // Actually, for cross-site iframe (Shopify -> Render), we usually need SameSite=None; Secure.
    // However, the user prompt explicitly asked for: "wolf_token=" + token + "; path=/; secure; samesite=lax; max-age=86400"
    // I will follow the user's explicit instruction.
    document.cookie = `wolf_token=${token}; path=/; secure; samesite=lax; max-age=86400`;

    // 2. LocalStorage
    try {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('token', token); // Legacy support
    } catch (e) {
      console.warn("LocalStorage blocked", e);
    }

    // 3. Memory
    TEMP_TOKEN = token;
    
    // Also expose to window for debugging/Liquid access
    if (typeof window !== 'undefined') {
        (window as any).TEMP_TOKEN = token;
    }
    
    console.log("✅ Token saved to Cookie/Storage/Memory");
  },

  getToken: (): string | null => {
    // 1. Cookie
    const match = document.cookie.match(new RegExp('(^| )wolf_token=([^;]+)'));
    if (match) return match[2];

    // 2. LocalStorage
    try {
      const local = localStorage.getItem('auth_token') || localStorage.getItem('token');
      if (local) return local;
    } catch (e) {}

    // 3. Memory
    return TEMP_TOKEN || (typeof window !== 'undefined' ? (window as any).TEMP_TOKEN : null);
  },
  
  clearToken: () => {
    document.cookie = "wolf_token=; path=/; secure; samesite=lax; max-age=0";
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('local_user');
    } catch(e) {}
    TEMP_TOKEN = null;
    if (typeof window !== 'undefined') {
        (window as any).TEMP_TOKEN = null;
    }
  }
};
