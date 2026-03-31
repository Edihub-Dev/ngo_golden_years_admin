export interface Location {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: number;
}

export interface GeolocationError {
  code: number;
  message: string;
  permissionDenied?: boolean;
  positionUnavailable?: boolean;
  timeout?: boolean;
}

export class GeolocationService {
  private static instance: GeolocationService;
  private watchId: number | null = null;

  static getInstance(): GeolocationService {
    if (!GeolocationService.instance) {
      GeolocationService.instance = new GeolocationService();
    }
    return GeolocationService.instance;
  }

  // Check if geolocation is supported
  isSupported(): boolean {
    return 'geolocation' in navigator;
  }

  // Get current position once
  async getCurrentPosition(options?: PositionOptions): Promise<Location> {
    if (!this.isSupported()) {
      throw new Error('Geolocation is not supported by this browser');
    }

    return new Promise((resolve, reject) => {
      const defaultOptions: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
        ...options
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          });
        },
        (error) => {
          reject(this.handleError(error));
        },
        defaultOptions
      );
    });
  }

  // Watch position changes
  watchPosition(callback: (location: Location) => void, options?: PositionOptions): number {
    if (!this.isSupported()) {
      throw new Error('Geolocation is not supported by this browser');
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // 1 minute
      ...options
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        callback({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
      },
      (error) => {
        console.error('Geolocation watch error:', this.handleError(error));
      },
      defaultOptions
    );

    return this.watchId;
  }

  // Stop watching position
  clearWatch(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Request permission for iOS devices
  async requestPermission(): Promise<PermissionState> {
    if (!navigator.permissions) {
      return 'prompt'; // Permissions API not supported
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state;
    } catch (error) {
      console.error('Permission query error:', error);
      return 'prompt';
    }
  }

  // Get location with fallback
  async getLocationWithFallback(): Promise<Location> {
    try {
      // Try to get precise location first
      return await this.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 5000
      });
    } catch (error) {
      console.warn('Precise location failed, trying with lower accuracy:', error);
      
      try {
        // Fallback to lower accuracy
        return await this.getCurrentPosition({
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      } catch (fallbackError) {
        // Final fallback to default location (Delhi)
        console.warn('Using default location due to geolocation failure:', fallbackError);
        return {
          lat: 28.6139,
          lng: 77.2090,
          accuracy: 1000, // 1km accuracy for default location
          timestamp: Date.now()
        };
      }
    }
  }

  // Format location for display
  formatLocation(location: Location): string {
    return `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
  }

  // Calculate distance between two points (in meters)
  calculateDistance(loc1: Location, loc2: Location): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (loc1.lat * Math.PI) / 180;
    const φ2 = (loc2.lat * Math.PI) / 180;
    const Δφ = ((loc2.lat - loc1.lat) * Math.PI) / 180;
    const Δλ = ((loc2.lng - loc1.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // Check if location is within a certain radius
  isWithinRadius(center: Location, point: Location, radiusMeters: number): boolean {
    const distance = this.calculateDistance(center, point);
    return distance <= radiusMeters;
  }

  private handleError(error: GeolocationPositionError): GeolocationError {
    const errorMap: Record<number, string> = {
      1: 'Location access denied. Please enable location services.',
      2: 'Location information is unavailable.',
      3: 'Location request timed out. Please try again.',
    };

    return {
      code: error.code,
      message: errorMap[error.code] || 'Unknown geolocation error',
      permissionDenied: error.code === 1,
      positionUnavailable: error.code === 2,
      timeout: error.code === 3,
    };
  }
}

// Export singleton instance
export const geolocationService = GeolocationService.getInstance();

// React hook for geolocation
export function useGeolocation() {
  return {
    getCurrentPosition: () => geolocationService.getCurrentPosition(),
    getLocationWithFallback: () => geolocationService.getLocationWithFallback(),
    watchPosition: (callback: (location: Location) => void, options?: PositionOptions) =>
      geolocationService.watchPosition(callback, options),
    clearWatch: () => geolocationService.clearWatch(),
    isSupported: () => geolocationService.isSupported(),
    requestPermission: () => geolocationService.requestPermission(),
    formatLocation: (location: Location) => geolocationService.formatLocation(location),
    calculateDistance: (loc1: Location, loc2: Location) => geolocationService.calculateDistance(loc1, loc2),
    isWithinRadius: (center: Location, point: Location, radius: number) => 
      geolocationService.isWithinRadius(center, point, radius),
  };
}
