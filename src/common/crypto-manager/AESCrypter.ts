const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
 
export class AESCrypter {
  constructor() {}
 
     // Шифрование AES
  static encrypt(key, iv, data) {
    iv = iv || "";
    const clearEncoding = 'utf8';
    const cipherEncoding = 'base64';
    const cipherChunks = [];
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    cipher.setAutoPadding(true);
    cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
    cipherChunks.push(cipher.final(cipherEncoding));
    return cipherChunks.join('');
  }
 
     // Расшифровка AES
  static decrypt(key, iv, data) {
    if (!data) {
      return "";
    }
    iv = iv || "";
    const clearEncoding = 'utf8';
    const cipherEncoding = 'base64';
    const cipherChunks = [];
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAutoPadding(true);
    cipherChunks.push(decipher.update(data, cipherEncoding, clearEncoding));
    cipherChunks.push(decipher.final(clearEncoding));
    return cipherChunks.join('');
  }
 
}