// PWA Utilities for Al-Naseeh V3
// Handles service worker registration, install prompts, and mobile-first features

export interface PWAInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAState {
  isInstalled: boolean;
  isInstallable: boolean;
  isStandalone: boolean;
  isOnline: boolean;
  hasServiceWorker: boolean;
}

class PWAManager {
  private deferredPrompt: PWAInstallPromptEvent | null = null;
  private state: PWAState = {
    isInstalled: false,
    isInstallable: false,
    isStandalone: false,
    isOnline: navigator.onLine,
    hasServiceWorker: false
  };
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initialize();
  }

  private async initialize() {
    // Check if app is installed
    this.state.isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    this.state.isStandalone = this.state.isInstalled;

    // Listen for online/offline status
    window.addEventListener('online', () => this.updateState({ isOnline: true }));
    window.addEventListener('offline', () => this.updateState({ isOnline: false }));

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as PWAInstallPromptEvent;
      this.updateState({ isInstallable: true });
      this.emit('installable');
    });

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      this.updateState({ isInstalled: true, isInstallable: false });
      this.deferredPrompt = null;
      this.emit('installed');
    });

    // Register service worker
    await this.registerServiceWorker();

    // Check for updates
    this.checkForUpdates();
  }

  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        this.updateState({ hasServiceWorker: true });
        console.log('[PWA] Service Worker registered:', registration);

        // Listen for service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.emit('updateAvailable');
              }
            });
          }
        });

        // Handle service worker messages
        navigator.serviceWorker.addEventListener('message', (event) => {
          this.handleServiceWorkerMessage(event.data);
        });

      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error);
      }
    }
  }

  private handleServiceWorkerMessage(data: any) {
    switch (data.type) {
      case 'SYNC_OFFLINE_DATA':
        this.emit('syncOfflineData', data);
        break;
      case 'CACHE_UPDATED':
        this.emit('cacheUpdated', data);
        break;
      default:
        console.log('[PWA] Unknown service worker message:', data);
    }
  }

  private checkForUpdates(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.update();
        });
      });
    }
  }

  // Public methods
  async installApp(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.log('[PWA] No install prompt available');
      return false;
    }

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('[PWA] App installation accepted');
        this.deferredPrompt = null;
        this.updateState({ isInstallable: false });
        return true;
      } else {
        console.log('[PWA] App installation dismissed');
        return false;
      }
    } catch (error) {
      console.error('[PWA] Installation failed:', error);
      return false;
    }
  }

  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.log('[PWA] Notifications not supported');
      return 'denied';
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      this.emit('notificationPermission', permission);
      return permission;
    }

    return Notification.permission;
  }

  async sendNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        ...options
      });

      notification.addEventListener('click', () => {
        window.focus();
        notification.close();
      });
    }
  }

  async cacheData(key: string, data: any): Promise<void> {
    if ('caches' in window) {
      try {
        const cache = await caches.open('al-naseeh-v3-data-cache');
        const response = new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' }
        });
        await cache.put(`/data/${key}`, response);
      } catch (error) {
        console.error('[PWA] Cache data failed:', error);
      }
    }
  }

  async getCachedData(key: string): Promise<any | null> {
    if ('caches' in window) {
      try {
        const cache = await caches.open('al-naseeh-v3-data-cache');
        const response = await cache.match(`/data/${key}`);
        if (response) {
          return await response.json();
        }
      } catch (error) {
        console.error('[PWA] Get cached data failed:', error);
      }
    }
    return null;
  }

  async syncOfflineData(): Promise<void> {
    if ('serviceWorker' in navigator && 'sync' in (window.ServiceWorkerRegistration.prototype as any)) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await (registration as any).sync.register('background-sync');
        console.log('[PWA] Background sync registered');
      } catch (error) {
        console.error('[PWA] Background sync failed:', error);
      }
    }
  }

  // Event handling
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  private updateState(newState: Partial<PWAState>): void {
    this.state = { ...this.state, ...newState };
    this.emit('stateChange', this.state);
  }

  // Getters
  getState(): PWAState {
    return { ...this.state };
  }

  isInstallable(): boolean {
    return this.state.isInstallable;
  }

  isInstalled(): boolean {
    return this.state.isInstalled;
  }

  isStandalone(): boolean {
    return this.state.isStandalone;
  }

  isOnline(): boolean {
    return this.state.isOnline;
  }
}

// Export singleton instance
export const pwaManager = new PWAManager();

// Utility functions
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

export const isStandalone = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches;
};

export const getInstallPrompt = (): PWAInstallPromptEvent | null => {
  return pwaManager['deferredPrompt'];
};

export const showInstallPrompt = async (): Promise<boolean> => {
  return await pwaManager.installApp();
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  return await pwaManager.requestNotificationPermission();
};

export const sendNotification = async (title: string, options?: NotificationOptions): Promise<void> => {
  return await pwaManager.sendNotification(title, options);
};

export const cacheData = async (key: string, data: any): Promise<void> => {
  return await pwaManager.cacheData(key, data);
};

export const getCachedData = async (key: string): Promise<any | null> => {
  return await pwaManager.getCachedData(key);
};

export const syncOfflineData = async (): Promise<void> => {
  return await pwaManager.syncOfflineData();
}; 