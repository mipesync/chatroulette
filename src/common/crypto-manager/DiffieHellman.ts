const crypto = require('crypto');
 
export class DiffieHellman extends crypto.DiffieHellman {
     // Чтобы не передавать простое число на обоих концах, используйте определенное простое число и генератор
  constructor(
    prime = 'c23b53d262fa2a2cf2f730bd38173ec3',
    generator = '05'
  ) {
    super(prime, 'hex', generator, 'hex');
  }
 
     // Создаем пару ключей и возвращаем открытый ключ
  getKey() {
    return this.generateKeys('base64');
  }
 
     // Используем открытый ключ другой стороны для генерации ключа
  getSecret(otherPubKey) {
    return this.computeSecret(otherPubKey, 'base64', 'hex');
  }
 
  static createPrime(encoding=null, primeLength=128, generator=2) {
    const dh = new crypto.DiffieHellman(primeLength, generator);
    return dh.getPrime(encoding);
  }
 
}