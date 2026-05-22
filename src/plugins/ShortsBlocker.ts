import { registerPlugin } from '@capacitor/core';

export interface ShortsBlockerPlugin {
  setPin(options: { pin: string }): Promise<void>;
  checkPermissions(): Promise<{ isAccessibilityEnabled: boolean; isDeviceAdminEnabled: boolean }>;
  requestAccessibility(): Promise<void>;
  requestDeviceAdmin(): Promise<void>;
}

const ShortsBlocker = registerPlugin<ShortsBlockerPlugin>('ShortsBlocker');

export default ShortsBlocker;
