//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import CryptoJS from 'crypto-js';

import { env } from '@/config/env';

export class AESCipher {
  private static key = env.SECRET_KEY; // Change this to your secret key

  static encrypt(data: any): string {
    const jsonString: string = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, this.key).toString();
  }

  static decrypt(ciphertext: string): any {
    const bytes: any = CryptoJS.AES.decrypt(ciphertext, this.key);
    const decryptedString: string = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  }

  static encodeBase64(data: string): string {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data));
  }

  static decodeBase64(base64Data: string): string {
    return CryptoJS.enc.Base64.parse(base64Data).toString(CryptoJS.enc.Utf8);
  }

  static shiftCipher(text: string, mode: 'encrypt' | 'decrypt'): string {
    const shift =
      (this.key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) %
        26) *
      (mode === 'decrypt' ? -1 : 1);
    return text.replace(/[a-zA-Z]/g, (char) =>
      String.fromCharCode(
        ((char.charCodeAt(0) - (/[A-Z]/.test(char) ? 65 : 97) + shift + 26) %
          26) +
          (/[A-Z]/.test(char) ? 65 : 97),
      ),
    );
  }
}
