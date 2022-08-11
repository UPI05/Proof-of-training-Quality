const utils = require("./utils");
const { DataRetrivalTransaction, OrgzRegisTransaction, DataSharingTransaction } = require("./transactions");

class Wallet {
    constructor(secret) {
        this.keyPair = utils.genKeyPair(secret);
        this.publicKey = this.keyPair.getPublic("hex");
    }

    sign(dataHash) {
        return this.keyPair.sign(dataHash).toHex();
    }

    getPublicKey() {
        return this.publicKey;
    }

    createDataRetrivalTransaction(query) {
        return new DataRetrivalTransaction(query, this);
    }

    createDataSharingTransaction(data) {
        return new DataSharingTransaction(data, this);
    }

    registerOrgz() {
        return new OrgzRegisTransaction({}, this);
    }
}

module.exports = Wallet;