export enum SecurityModule {
  DASHBOARD = 'DASHBOARD',
  KEY_MGMT = 'KEY_MGMT',
  USER_SECURITY = 'USER_SECURITY',
  DATABASE_OPS = 'DATABASE_OPS',
  DISK_ENCRYPTION = 'DISK_ENCRYPTION',
  HARDWARE_LOCK = 'HARDWARE_LOCK',
}

export interface SystemUser {
  id: number;
  username: string;
  uid: number;
  group: string;
  lastLogin: string;
  status: 'active' | 'locked' | 'risk';
}

export interface Drive {
  device: string;
  mount: string;
  size: string;
  encrypted: boolean;
  uuid: string;
}

export interface KeyConfig {
  algorithm: 'AES-256' | 'ChaCha20-Poly1305';
  expiryDate: string;
  hardwareBinding: boolean;
  maxSessions: number;
}
