import { Injectable } from "@nestjs/common";

const NodeRSA = require('node-rsa');
const key = new NodeRSA({ b: 2048 });

@Injectable()
export class CryptoManager {
    generateKeyPair() {
        const private_key = key.exportKey('private');
        const public_key = key.exportKey('public');

        return {
            private_key,
            public_key
        };
    }

    encryptString(text: string, publicKey: string) {
        const key_public = new NodeRSA(publicKey);
        return key_public.encrypt(text, 'base64');
    }

    decryptString(hash: string, privateKey: string) {
        const key_private = new NodeRSA(privateKey);
        return key_private.decrypt(hash, 'utf8');
    }
}
