const utils = require("./utils");
const Message = require("./message");
const { MSG_TYPE } = require("./config");

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

  // Wallet can only handle the dataSharingReq and dataRetrieval

  createDataSharingReqMsg(query) {
    return new Message({ ...query, flRound: 1 }, this, MSG_TYPE.dataSharingReq);
  }

  createDataRetrievalMsg(query) {
    return new Message({ ...query }, this, MSG_TYPE.dataRetrieval);
  }
}

module.exports = Wallet;
