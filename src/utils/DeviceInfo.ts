
export interface DeviceDetails {
  userAgent: string;
  platform: string;
  language: string;
  screenResolution: string;
  cookiesEnabled: boolean;
  online: boolean;
  memory?: string;
  cores?: number;
  connection?: string;
}

export class DeviceInfo {
  static getDetails(): DeviceDetails {
    const nav = window.navigator as any;
    return {
      userAgent: nav.userAgent,
      platform: nav.platform,
      language: nav.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      cookiesEnabled: nav.cookieEnabled,
      online: nav.onLine,
      memory: nav.deviceMemory ? `${nav.deviceMemory}GB` : 'Unknown',
      cores: nav.hardwareConcurrency,
      connection: nav.connection ? nav.connection.effectiveType : 'Unknown'
    };
  }

  static getFingerprint(): string {
    const details = this.getDetails();
    return btoa(`${details.userAgent}-${details.screenResolution}`).slice(0, 16);
  }
}
