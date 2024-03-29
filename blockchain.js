const Message = require("./message");
const {
  GENESIS_HASH,
  MSG_TYPE,
  GENESIS_PUBLICKEY_NODE1,
  GENESIS_CATEGORY_NODE1,
  GENESIS_PUBLICKEY_NODE2,
  GENESIS_CATEGORY_NODE2,
  GENESIS_PUBLICKEY_NODE3,
  GENESIS_CATEGORY_NODE3,
  GENESIS_PUBLICKEY_NODE4,
  GENESIS_CATEGORY_NODE4,
  GENESIS_PUBLICKEY_NODE5,
  GENESIS_CATEGORY_NODE5,
  GENESIS_PUBLICKEY_NODE6,
  GENESIS_CATEGORY_NODE6,
  GENESIS_PUBLICKEY_NODE7,
  GENESIS_CATEGORY_NODE7,
  GENESIS_PUBLICKEY_NODE8,
  GENESIS_CATEGORY_NODE8,
  GENESIS_PUBLICKEY_NODE9,
  GENESIS_CATEGORY_NODE9,
  GENESIS_PUBLICKEY_NODE10,
  GENESIS_CATEGORY_NODE10,
  GENESIS_OTHER,
} = require("./config");

const dotenv = require("dotenv").config();

class Blockchain {
  constructor(wallet) {
    this.wallet = wallet;
    this.chain = [this.genesis()];
  }

  genesis() {
    const messages = [
      {
        publicKey: GENESIS_PUBLICKEY_NODE1,
        category: GENESIS_CATEGORY_NODE1,
        msgType: MSG_TYPE.dataRetrieval,
      },
      {
        publicKey: GENESIS_PUBLICKEY_NODE2,
        category: GENESIS_CATEGORY_NODE2,
        msgType: MSG_TYPE.dataRetrieval,
      },
      {
        publicKey: GENESIS_PUBLICKEY_NODE3,
        category: GENESIS_CATEGORY_NODE3,
        msgType: MSG_TYPE.dataRetrieval,
      },
      {
        publicKey: GENESIS_PUBLICKEY_NODE4,
        category: GENESIS_CATEGORY_NODE4,
        msgType: MSG_TYPE.dataRetrieval,
      },
      {
        publicKey: GENESIS_PUBLICKEY_NODE5,
        category: GENESIS_CATEGORY_NODE5,
        msgType: MSG_TYPE.dataRetrieval,
      },
      {
        publicKey: GENESIS_PUBLICKEY_NODE6,
        category: GENESIS_CATEGORY_NODE6,
        msgType: MSG_TYPE.dataRetrieval,
      },
      {
        publicKey: GENESIS_PUBLICKEY_NODE7,
        category: GENESIS_CATEGORY_NODE7,
        msgType: MSG_TYPE.dataRetrieval,
      },
      {
        publicKey: GENESIS_PUBLICKEY_NODE8,
        category: GENESIS_CATEGORY_NODE8,
        msgType: MSG_TYPE.dataRetrieval,
      },
      {
        publicKey: GENESIS_PUBLICKEY_NODE9,
        category: GENESIS_CATEGORY_NODE9,
        msgType: MSG_TYPE.dataRetrieval,
      },
      {
        publicKey: GENESIS_PUBLICKEY_NODE10,
        category: GENESIS_CATEGORY_NODE10,
        msgType: MSG_TYPE.dataRetrieval,
      },
    ];
    const genesisBlock = new Message(
      { messages },
      this.wallet,
      MSG_TYPE.genesisBlock
    );
    return genesisBlock;
  }

  updateLastBLock(block) {
    this.chain[this.chain.length - 1] = block;
  }

  verifyChain(chain) {
    for (let i = 1; i < chain.length; i++) {
      if (chain[i].preHash !== chain[i - 1].hash) return false;
      if (!Message.verify(chain[i], this, true)) return false;
    }

    // Check if the default publicKey and category are valid
    return (
      chain[0].other.registerPublicKey === GENESIS_OTHER.registerPublicKey &&
      chain[0].transaction.messages[0].publicKey === GENESIS_PUBLICKEY_NODE1 &&
      chain[0].transaction.messages[0].category === GENESIS_CATEGORY_NODE1 &&
      chain[0].transaction.messages[1].publicKey === GENESIS_PUBLICKEY_NODE2 &&
      chain[0].transaction.messages[1].category === GENESIS_CATEGORY_NODE2
    );
  }

  getCategoryFromPublicKey(publicKey) {
    for (let i = 0; i < this.chain.length; i++) {
      for (let j = 0; j < this.chain[i].transaction.messages.length; j++) {
        if (
          this.chain[i].transaction.messages[j].msgType ===
            MSG_TYPE.dataRetrieval &&
          this.chain[i].transaction.messages[j].publicKey === publicKey
        )
          return this.chain[i].transaction.messages[j].category;
      }
    }
    return "";
  }

  addBlock(block) {
    delete block["isSpent"];
    this.chain.push(block);
  }

  getAll() {
    return this.chain;
  }
}

module.exports = Blockchain;
