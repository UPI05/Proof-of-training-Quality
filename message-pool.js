const Message = require("./message");
const { RANDOM_BIAS, MSG_TYPE } = require("./config");

class MessagePool {
  constructor() {
    this.messages = [];
  }

  // General

  addMessage(msg) {
    this.messages.push(msg);
  }

  deleteMessage(hash) {
    for (let i = 0; i < this.blocks.length; i++) {
      if (this.messages[i].hash === hash) this.messages.splice(i, 1);
    }
  }

  verifyMessage(msg, blockchain) {
    return Message.verify(msg, blockchain);
  }

  messageExistsWithHash(message) {
    for (const msg of this.messages) {
      if (msg.hash === message.hash && !msg.isSpent) return true;
    }
    return false;
  }

  getAllRelatedMessages(dataSharingReq) {
    let res = [dataSharingReq];
    for (const msg of this.messages) {
      if (msg.msgType === MSG_TYPE.dataSharingRes) {
        if (msg.dataSharingReq.hash === dataSharingReq.hash && !msg.isSpent) {
          res.push(msg);
        }
      }
      if (msg.msgType === MSG_TYPE.dataRetrieval) {
        if (!msg.isSpent) {
          res.push(msg);
        }
      }
    }
    return res;
  }

  // For dataRetrieval

  messageDataRetrievalExistsWithPublicKey(message) {
    for (const msg of this.messages) {
      if (
        msg.msgType === MSG_TYPE.dataRetrieval &&
        msg.publicKey === message.publicKey &&
        !msg.isSpent
      )
        return true;
    }
    return false;
  }

  // For heartBeat

  getAllHeartBeatRes(message) {
    let res = [];
    for (const msg of this.messages) {
      if (msg.hash === message.hash && !msg.isSpent) res.push(msg);
    }
    return res;
  }

  isMessageHeartBeatResDuplicated(message) {
    for (const msg of this.messages) {
      if (
        msg.msgType === MSG_TYPE.heartBeatRes &&
        msg.heartBeatReq.hash === message.heartBeatReq.hash &&
        !msg.isSpent &&
        msg.publicKey === message.publicKey
      )
        return true;
    }
    return false;
  }

  // For dataSharingRes

  isMessageDataSharingResDuplicated(message) {
    for (const msg of this.messages) {
      if (
        msg.msgType === MSG_TYPE.dataSharingRes &&
        msg.dataSharingReq.hash === message.dataSharingReq.hash &&
        !msg.isSpent &&
        msg.publicKey === message.publicKey
      )
        return true;
    }
    return false;
  }

  getAllDataSharingRes(hash) {
    let res = [];
    for (const msg of this.messages) {
      if (
        msg.msgType === MSG_TYPE.dataSharingRes &&
        msg.dataSharingReq.hash === hash &&
        !msg.isSpent
      )
        res.push(msg);
    }
    return res;
  }

  getAllBlockVerifyRes(hash) {
    let res = [];
    for (const msg of this.messages) {
      if (
        msg.msgType === MSG_TYPE.blockVerifyRes &&
        msg.hash === hash &&
        !msg.isSpent
      )
        res.push(msg);
    }
    return res;
  }

  getAllCommitteeSignaturesFromBlockVerifyRes(hash) {
    let res = [];
    for (const msg of this.messages) {
      if (
        msg.msgType === MSG_TYPE.blockVerifyRes &&
        msg.hash === hash &&
        !msg.isSpent
      ) {
        res.push(msg.committeeSignature);
      }
    }
    return res;
  }

  enoughDataSharingRes(allHeartBeatRes, allDataSharingRes) {
    for (const heartBeatRes of allHeartBeatRes) {
      let found = false;
      for (const dataSharingRes of allDataSharingRes) {
        if (heartBeatRes.publicKey === dataSharingRes.publicKey) {
          found = true;
          break;
        }
      }
      if (!found) return false;
    }

    return true;
  }

  enoughBlockVerifyRes(allHeartBeatRes, allBlockVerifyResCommitteeSignatures) {
    for (const heartBeatRes of allHeartBeatRes) {
      let found = false;
      for (const blockVerifyResCommitteeSignature of allBlockVerifyResCommitteeSignatures) {
        if (
          heartBeatRes.publicKey === blockVerifyResCommitteeSignature.publicKey
        ) {
          found = true;
          break;
        }
      }
      if (!found) return false;
    }

    return true;
  }

  isProposer(wallet, allDataSharingRes) {
    let minMAE = 1000000009;
    for (const msg of allDataSharingRes) {
      minMAE = Math.min(minMAE, msg.MAE);
    }
    for (const msg of allDataSharingRes) {
      if (msg.MAE === minMAE && msg.publicKey === wallet.getPublicKey()) {
        return true;
      }
    }
    return false;
  }

  messageExistsWithHashMsgTypeAndCommitteePublicKey(message) {
    for (const msg of this.messages) {
      if (
        msg.msgType === MSG_TYPE.blockVerifyRes &&
        msg.hash === message.hash &&
        msg.committeeSignature.publicKey ===
          message.committeeSignature.publicKey &&
        !msg.isSpent
      )
        return true;
    }
    return false;
  }

  messageExistsWithHashAndMsgType(message) {
    for (const msg of this.messages) {
      if (
        msg.msgType === MSG_TYPE.blockCommit &&
        msg.hash === message.hash &&
        !msg.isSpent
      )
        return true;
    }
    return false;
  }

  getAll() {
    return this.messages;
  }
}

module.exports = MessagePool;
