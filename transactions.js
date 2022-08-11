const utils = require("./utils");


class DataRetrivalTransaction {
    constructor(materials, wallet) {
        this.timeStamp = Date.now();
        this.category = materials.category || "";
        this.publicKey = wallet.getPublicKey() || "";
        this.query = materials.data || -1;
        this.transactionType = 0;
        this.hash = utils.hash(this.timeStamp + this.category + this.publicKey + this.query + "0");
        this.signature = wallet.sign(this.hash);
    }

    static verify(transaction) {
        return utils.verifySignature(transaction.publicKey, transaction.signature, transaction.hash);
    }
}

class DataSharingTransaction {
    constructor(materials, wallet) {
        this.publicKey = wallet.getPublicKey() || "";
        this.timeStamp = Date.now();
        this.model = materials.model || {};
        this.transactionType = 1;
        this.MAE = materials.MAE || -1;
        this.retrivalTransaction = materials.retrivalTransaction || {};
        this.hash = utils.hash(this.timeStamp + this.model + this.MAE + this.retrivalTransaction + "1");
        this.signature = wallet.sign(this.hash);
    }

    static verify(transaction) {
        // need to verify MAE, retrival data
        return utils.verifySignature(transaction.publicKey, transaction.signature, transaction.hash);
    }
}

class OrgzRegisTransaction {
    constructor(wallet) {
        this.category = process.env.CATEGORY,
        this.transactionType = 2;
        this.publicKey = wallet.getPublicKey();
        this.timeStamp = Date.now();
    }
    static verify() {

    }
}

module.exports = { DataRetrivalTransaction, DataSharingTransaction, OrgzRegisTransaction };