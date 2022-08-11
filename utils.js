const EDDSA = require("elliptic").eddsa;
const { v1: uuidV1 } = require("uuid");
const SHA256 = require("crypto-js/sha256");

const eddsa = new EDDSA("ed25519");

class Utils {
    static id() {
        return uuidV1();
    }

    static genKeyPair(secret) {
        return eddsa.keyFromSecret(secret);
    }

    static hash(data) {
        return SHA256(JSON.stringify(data)).toString();
    }

    static verifySignature(publicKey, signature, dataHash) {
        return eddsa.keyFromPublic(publicKey).verify(dataHash, signature);
    }
}

module.exports = Utils;