const utils = require("./utils");
const math = require("mathjs");
const {
  MSG_TYPE,
  GENESIS_HASH,
  GENESIS_OTHER,
  GENESIS_PROPOSER,
  GENESIS_SIGNATURE,
  GENESIS_TIMESTAMP,
  CATEGORY_MIN_LENGTH,
  CATEGORY_MAX_LENGTH,
  HEARTBEAT_TIMEOUT,
  DEBUG,
  MAE_EPSILON,
} = require("./config");

class Message {
  constructor(materials, wallet, msgType) {
    // General

    this.timeStamp = materials.timeStamp || Date.now();
    this.msgType = msgType || "";
    this.publicKey = wallet.getPublicKey() || "";
    this.category = process.env.CATEGORY || "";

    const hashInpStr =
      this.timeStamp + this.msgType + this.publicKey + this.category;

    // For genesisBlock

    if (msgType === MSG_TYPE.genesisBlock) {
      this.timeStamp = GENESIS_TIMESTAMP;
      this.publicKey = GENESIS_PROPOSER;
      delete this.category;
      this.other = GENESIS_OTHER;
      this.transaction =
        {
          messages: materials.messages,
        } || {};
      this.hash = GENESIS_HASH;
    }

    // For dataRetrieval

    if (msgType === MSG_TYPE.dataRetrieval) {
      this.accessSignature = materials.signature || "";
      this.hash = utils.hash(hashInpStr + this.accessSignature);
    }

    // For getChainReq

    if (msgType === MSG_TYPE.getChainReq) {
      this.hash = utils.hash(hashInpStr);
    }

    // For getChainRes

    if (msgType === MSG_TYPE.getChainRes) {
      this.chain = materials.chain || {};
      // We shouldn't hash all the chain. This is temporary.
      this.hash = utils.hash(hashInpStr + JSON.stringify(this.chain));
    }

    // For heartBeatReq

    if (msgType === MSG_TYPE.heartBeatReq) {
      this.hash = utils.hash(hashInpStr);
    }

    // For heartBeatRes

    if (msgType === MSG_TYPE.heartBeatRes) {
      this.heartBeatReq = materials.heartBeatReq || {};
      this.hash = utils.hash(hashInpStr + this.heartBeatReq);
    }

    // For dataSharingReq

    if (msgType === MSG_TYPE.dataSharingReq) {
      this.requestCategory = materials.requestCategory || "";
      this.requestModel = materials.requestModel || -1;
      this.flRound = materials.flRound || -1;
      this.hash = utils.hash(
        hashInpStr +
          this.requestCategory +
          JSON.stringify(this.requestModel) +
          this.flRound
      );
    }

    // For dataSharingRes

    if (msgType === MSG_TYPE.dataSharingRes) {
      this.model = materials.model || {};
      this.MAE = materials.MAE || -1;
      this.dataSharingReq = materials.dataSharingReq || {};
      this.hash = utils.hash(
        hashInpStr +
          JSON.stringify(this.model) +
          this.MAE +
          JSON.stringify(this.dataSharingReq)
      );
    }

    // For blockVerifyReq

    if (msgType === MSG_TYPE.blockVerifyReq) {
      this.transaction =
        {
          messages: materials.messages,
        } || {};
      this.preHash = materials.preHash || "";
      this.aggregatedModel = materials.aggregatedModel || {};
      this.hash = utils.hash(
        hashInpStr +
          JSON.stringify(this.transaction) +
          this.preHash +
          JSON.stringify(this.aggregatedModel)
      );
    }

    // For blockVerifyRes

    if (msgType === MSG_TYPE.blockVerifyRes) {
      this.blockVerifyReq = materials.blockVerifyReq || {};
      this.committeeSignature = materials.committeeSignature || {};
      this.hash = utils.hash(
        hashInpStr +
          JSON.stringify(this.blockVerifyReq) +
          JSON.stringify(this.committeeSignature)
      );
    }

    // For blockCommit

    if (msgType === MSG_TYPE.blockCommit) {
      this.transaction =
        {
          messages: materials.messages,
        } || {};
      this.preHash = materials.preHash || "";
      this.aggregatedModel = materials.aggregatedModel || {};
      this.committeeSignatures = materials.committeeSignatures || [];
      this.hash = utils.hash(
        hashInpStr +
          JSON.stringify(this.transaction) +
          this.preHash +
          JSON.stringify(this.aggregatedModel) +
          JSON.stringify(this.committeeSignatures)
      );
    }

    // Signature
    this.signature =
      msgType === MSG_TYPE.genesisBlock
        ? GENESIS_SIGNATURE
        : wallet.sign(this.hash);
  }

  static isProposer(messages, publicKey, epsilon) {
    let res = [];
    let proposerMAE;
    for (const msg of messages) {
      if (msg.msgType === MSG_TYPE.dataSharingRes) {
        if (msg.publicKey === publicKey) proposerMAE = msg.MAE;
        res.push(msg.MAE);
      }
    }
    const mean = math.mean(res);
    const std = math.std(res);
    return (mean - std - epsilon <= proposerMAE && proposerMAE <= mean + std + epsilon);
  }

  // For blockCommit
  static getDataSharingReqInfoFromBlockCommitMsg(message) {
    for (const msg of message.transaction.messages) {
      if (msg.msgType === MSG_TYPE.dataSharingReq) {
        return {
          flRound: msg.flRound,
          requester: msg.publicKey,
          requestCategory: msg.requestCategory,
        };
      }
    }
    return {
      flRound: -1,
      requester: -1,
      requestCategory: "",
    };
  }

  // For dataSharingReq
  static isDataQueryValid(msg) {
    if (msg.requestModel < 0) return false;

    return (
      msg.requestCategory.length >= CATEGORY_MIN_LENGTH &&
      msg.requestCategory.length <= CATEGORY_MAX_LENGTH
    );
  }

  static verifyCommitteeSignature(
    committeeSignature,
    hash,
    blockchain,
    senderCategory
  ) {
    if (
      !utils.verifySignature(
        committeeSignature.publicKey,
        committeeSignature.signature,
        hash
      )
    )
      return false;

    // Verify that committee publicKey is registered onchain.
    // And the committee category onchain is the same as proposer category.
    // It means the related data, which they 're handling comes from the same committee.
    if (
      blockchain.getCategoryFromPublicKey(committeeSignature.publicKey) ===
        senderCategory &&
      senderCategory
    )
      return true;
    return false;
  }

  // Verify message integrity
  static verifyMsgIntergrity(msg) {
    const hashInpStr =
      msg.timeStamp + msg.msgType + msg.publicKey + msg.category;
    switch (msg.msgType) {
      case MSG_TYPE.dataSharingReq:
        return (
          utils.hash(
            hashInpStr +
              msg.requestCategory +
              JSON.stringify(msg.requestModel) +
              msg.flRound
          ) === msg.hash
        );
      case MSG_TYPE.dataSharingRes:
        return (
          utils.hash(
            hashInpStr +
              JSON.stringify(msg.model) +
              msg.MAE +
              JSON.stringify(msg.dataSharingReq)
          ) === msg.hash
        );
      case MSG_TYPE.blockVerifyReq:
        return (
          utils.hash(
            hashInpStr +
              JSON.stringify(msg.transaction) +
              msg.preHash +
              JSON.stringify(msg.aggregatedModel)
          ) === msg.hash
        );
      case MSG_TYPE.blockVerifyRes:
        return (
          utils.hash(
            hashInpStr +
              JSON.stringify(msg.blockVerifyReq) +
              JSON.stringify(msg.committeeSignature)
          ) === msg.hash
        );
      case MSG_TYPE.blockCommit:
        return (
          utils.hash(
            hashInpStr +
              JSON.stringify(msg.transaction) +
              msg.preHash +
              JSON.stringify(msg.aggregatedModel) +
              JSON.stringify(msg.committeeSignatures)
          ) === msg.hash
        );
      case MSG_TYPE.heartBeatReq:
        return utils.hash(hashInpStr) === msg.hash;
      case MSG_TYPE.heartBeatRes:
        return utils.hash(hashInpStr + msg.heartBeatReq) === msg.hash;
      case MSG_TYPE.getChainReq:
        return utils.hash(hashInpStr) === msg.hash;
      case MSG_TYPE.getChainRes:
        return utils.hash(hashInpStr + JSON.stringify(msg.chain)) === msg.hash;
      case MSG_TYPE.dataRetrieval:
        return utils.hash(hashInpStr + msg.accessSignature) === msg.hash;
      default:
        console.info("oops");
        return false;
    }
  }
  static verifySenderAndMsgIntegrity(msg, blockchain) {
    // Verify message integrity
    if (!this.verifyMsgIntergrity(msg)) return false;

    // Verify signature
    if (
      !utils.verifySignature(
        msg.publicKey || "",
        msg.signature || "",
        msg.hash || ""
      )
    )
      return false;

    if (msg.msgType === MSG_TYPE.dataRetrieval) return true;

    // The sender (publicKey, category) must be registered onchain.
    const publicKey = msg.publicKey || "";
    if (
      blockchain.getCategoryFromPublicKey(publicKey) === msg.category &&
      msg.category
    )
      return true;
    return false;
  }

  // getChain is used for preHash blockVerify.
  // getChain = false means preHash is based on our chain.
  static verify(msg, blockchain, getChain = false) {
    if (DEBUG) console.info(`verified: ${msg.msgType}`);
    // General
    if (!this.verifySenderAndMsgIntegrity(msg, blockchain)) return false;

    // For dataRetrieval

    if (msg.msgType === MSG_TYPE.dataRetrieval) {
      // requestCategory length
      if (
        !(
          msg.category.length >= CATEGORY_MIN_LENGTH &&
          msg.category.length <= CATEGORY_MAX_LENGTH
        )
      )
        return false;
      // Verify that It has permission to join the network.
      if (
        !utils.verifySignature(
          GENESIS_OTHER.registerPublicKey,
          msg.accessSignature,
          msg.publicKey
        )
      )
        return false;
      return true;
    }

    // For heartBeatReq

    if (msg.msgType === MSG_TYPE.heartBeatReq) {
      if (Date.now() - msg.timeStamp > HEARTBEAT_TIMEOUT * 1000) return false;
      return true;
    }

    // For heartBeatRes

    if (msg.msgType === MSG_TYPE.heartBeatRes) {
      if (!this.verify(msg.heartBeatReq, blockchain)) return false;
      return true;
    }

    // For dataSharingReq
    if (msg.msgType === MSG_TYPE.dataSharingReq) {
      if (!this.isDataQueryValid(msg)) return false;
      return true;
    }

    // For dataSharingRes
    if (msg.msgType === MSG_TYPE.dataSharingRes) {
      if (!this.verify(msg.dataSharingReq, blockchain)) return false;

      // Verify the MAE (model) with testset data

      if (!(msg.MAE >= 0 && msg.MAE <= 10)) return false; // Because I don't use Federated learning.

      // End verify the MAE

      // Verify if sender category onchain is the same as dataSharingReq.requestCategory
      if (
        blockchain.getCategoryFromPublicKey(msg.publicKey) ===
        msg.dataSharingReq.requestCategory
      )
        return true;
      return false;
    }

    // For blockVerifyReq
    if (msg.msgType === MSG_TYPE.blockVerifyReq) {
      // Verify all messages in transaction field

      for (const m of msg.transaction.messages) {
        if (!this.verify(m, blockchain)) return false;
      }

      // Verify proposer

      if (
        !this.isProposer(msg.transaction.messages, msg.publicKey, MAE_EPSILON)
      )
        return false;

      //

      if (
        !getChain &&
        blockchain.chain[blockchain.chain.length - 1].hash !== msg.preHash
      )
        return false;

      return true;
    }

    // For blockVerifyRes
    if (msg.msgType === MSG_TYPE.blockVerifyRes) {
      if (!this.verify(msg.blockVerifyReq, blockchain)) return false;
      if (!msg.committeeSignature) return false;
      else
        return this.verifyCommitteeSignature(
          msg.committeeSignature,
          msg.blockVerifyReq.hash,
          blockchain,
          msg.category
        );
    }

    // For blockCommit
    if (msg.msgType === MSG_TYPE.blockCommit) {
      for (const m of msg.transaction.messages) {
        if (!this.verify(m, blockchain)) return false;
      }
      // Now verify all committee signatures
      if (!msg.committeeSignatures) return false;
      for (const committeeSignature of msg.committeeSignatures) {
        if (
          !this.verifyCommitteeSignature(
            committeeSignature,
            utils.hash(
              msg.timeStamp +
                MSG_TYPE.blockVerifyReq +
                msg.publicKey +
                msg.category +
                JSON.stringify(msg.transaction) +
                msg.preHash +
                JSON.stringify(msg.aggregatedModel)
            ),
            blockchain,
            msg.category
          )
        )
          return false;
      }

      // Verify proposer

      if (
        !this.isProposer(msg.transaction.messages, msg.publicKey, MAE_EPSILON)
      )
        return false;

      //

      if (
        !getChain &&
        blockchain.chain[blockchain.chain.length - 1].hash !== msg.preHash
      )
        return false;

      return true;
    }

    return true;
  }
}

module.exports = Message;
