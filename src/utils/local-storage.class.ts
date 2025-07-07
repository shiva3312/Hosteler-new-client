//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { env } from '@/config/env';
import { Environment } from '@/data/feature';

import { AESCipher } from './encryption.class';

interface StoredData<T> {
  value: T;
  lastUpdated: number;
  period: number;
}

export class LocalStorage {
  private static readonly STORAGE_PREFIX = env.ENVIRONMENT;

  public static readonly KEY = {
    AUTHORIZATION: `${LocalStorage.STORAGE_PREFIX}_Authorization`,
    SETTINGS: `${LocalStorage.STORAGE_PREFIX}_Settings`,
    THEME: `${LocalStorage.STORAGE_PREFIX}_Theme`,
    CONTEXT: `${LocalStorage.STORAGE_PREFIX}_Context`,
  };

  /**
   * Save a value to localStorage with a custom fetch period.
   * Encrypts data if environment is production.
   */
  static set<T>(key: string, value: T, period: number = 86400): void {
    try {
      const dataToStore: StoredData<T> = {
        value,
        lastUpdated: Date.now(),
        period,
      };
      let dataString = JSON.stringify(dataToStore);
      if (env.ENVIRONMENT === Environment.PROD) {
        dataString = AESCipher.encrypt(dataToStore);
      }
      localStorage.setItem(key, dataString);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  /**
   * Get a value from localStorage. Returns null if expired or not found.
   * Decrypts data if environment is production.
   */
  static get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        let parsedItem: StoredData<T>;
        if (env.ENVIRONMENT === Environment.PROD) {
          parsedItem = AESCipher.decrypt(item);
        } else {
          parsedItem = JSON.parse(item);
        }
        const isExpired =
          (Date.now() - parsedItem.lastUpdated) / 1000 > parsedItem.period;
        return isExpired ? null : parsedItem.value;
      }
      return null;
    } catch (error) {
      console.error('Error reading localStorage key:', error);
      return null;
    }
  }

  /**
   * Remove a value from localStorage.
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  /**
   * Clear specific keys or all keys from localStorage.
   * @param keys - Array of keys to clear
   * @param resetAll - If true, clears all keys
   */
  static clear(keys: string[] = [], resetAll?: boolean): void {
    try {
      if (resetAll) {
        Object.keys(localStorage).forEach((storageKey) => {
          localStorage.removeItem(storageKey);
        });
      } else {
        keys.forEach((key) => {
          localStorage.removeItem(key);
        });
      }
    } catch (error) {
      console.error('Error clearing keys from localStorage:', error);
    }
  }

  /**
   * Get the last updated timestamp for a key.
   */
  static lastUpdated(key: string): number | null {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        let parsedItem: StoredData<any>;
        if (env.ENVIRONMENT === Environment.PROD) {
          parsedItem = AESCipher.decrypt(item);
        } else {
          parsedItem = JSON.parse(item);
        }
        return parsedItem.lastUpdated || null;
      }
      return null;
    } catch (error) {
      console.error('Error reading lastUpdated from localStorage:', error);
      return null;
    }
  }
}
