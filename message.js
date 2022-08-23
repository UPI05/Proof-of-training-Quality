const utils = require("./utils");
const {
  RANDOM_BIAS,
  VALID_EPS,
  MSG_TYPE,
  GENESIS_HASH,
  GENESIS_OTHER,
  GENESIS_PROPOSER,
  GENESIS_SIGNATURE,
  GENESIS_TIMESTAMP,
  CATEGORY_MIN_LENGTH,
  CATEGORY_MAX_LENGTH,
  HEARTBEAT_TIMEOUT,
} = require("./config");

class Message {
  constructor(materials, wallet, msgType) {
    // General
    this.timeStamp =
      GENESIS_HASH === materials.hash ? GENESIS_TIMESTAMP : Date.now();
    this.msgType = msgType;
    this.publicKey = wallet.getPublicKey() || "";
    this.category = process.env.CATEGORY;

    // For dataRetrieval

    if (msgType === MSG_TYPE.dataRetrieval) {
      this.accessSignature = materials.signature;
      this.hash = utils.hash(
        this.timeStamp +
          this.msgType +
          this.category +
          this.publicKey +
          this.accessSignature
      );
    }

    // For getChainReq

    if (msgType === MSG_TYPE.getChainReq) {
      this.hash = utils.hash(
        this.timeStamp + this.msgType + this.category + this.publicKey
      );
    }

    // For getChainRes

    if (msgType === MSG_TYPE.getChainRes) {
      this.chain = materials.chain;
      // We shouldn't hash all the chain. This is temporary.
      this.hash = utils.hash(
        this.timeStamp +
          this.msgType +
          this.category +
          this.publicKey +
          this.chain
      );
    }

    // For heartBeatReq

    if (msgType === MSG_TYPE.heartBeatReq) {
      this.data = materials.data || "";
      this.hash = utils.hash(
        this.timeStamp +
          this.msgType +
          this.category +
          this.publicKey +
          this.data
      );
    }

    // For heartBeatRes

    if (msgType === MSG_TYPE.heartBeatRes) {
      this.data = materials.data || "";
      this.heartBeatReq = materials.heartBeatReq || "";
      this.hash = utils.hash(
        this.timeStamp +
          this.msgType +
          this.category +
          this.publicKey +
          this.data +
          this.heartBeatReq
      );
    }

    // For dataSharingReq

    if (msgType === MSG_TYPE.dataSharingReq) {
      this.query = materials.data || -1;
      this.hash = utils.hash(
        this.timeStamp +
          this.msgType +
          this.publicKey +
          this.query +
          this.category
      );
    }

    // For dataSharingRes

    if (msgType === MSG_TYPE.dataSharingRes) {
      this.model = materials.model || {};
      this.MAE = materials.MAE || -1;
      this.dataSharingReq = materials.dataSharingReq || {};
      this.hash = utils.hash(
        this.timeStamp +
          this.msgType +
          this.category +
          this.publicKey +
          this.model +
          this.MAE +
          this.dataSharingReq
      );
    }

    // For blockVerifyReq

    if (msgType === MSG_TYPE.blockVerifyReq) {
      delete this.publicKey;
      this.proposer =
        (GENESIS_HASH === materials.hash
          ? GENESIS_PROPOSER
          : wallet.getPublicKey()) || "";
      this.transaction =
        {
          messages: materials.messages,
        } || {};
      this.preHash = materials.preHash || "";
      this.other =
        (GENESIS_HASH === materials.hash ? GENESIS_OTHER : materials.other) ||
        "";
      this.hash =
        GENESIS_HASH === materials.hash
          ? GENESIS_HASH
          : utils.hash(
              this.timeStamp +
                this.msgType +
                this.category +
                this.proposer +
                this.transaction +
                this.preHash +
                this.other
            );
    }

    // For blockVerifyRes

    if (msgType === MSG_TYPE.blockVerifyRes) {
      this.transaction =
        {
          messages: materials.messages,
        } || {};
      this.committeeSignature = materials.committeeSignature || {};
      this.preHash = materials.preHash || "";
      this.other = materials.other || "";
      this.hash =
        GENESIS_HASH === materials.hash
          ? GENESIS_HASH
          : utils.hash(
              this.timeStamp +
                this.msgType +
                this.category +
                this.proposer +
                this.transaction +
                this.committeeSignature +
                this.preHash +
                this.other
            );
    }

    // For blockCommit

    if (msgType === MSG_TYPE.blockCommit) {
      this.transaction =
        {
          messages: materials.transaction,
        } || {};
      this.committeeSignatures = materials.committeeSignatures || [];
      this.preHash = materials.preHash || "";
      this.other = materials.other || "";
      this.hash =
        GENESIS_HASH === materials.hash
          ? GENESIS_HASH
          : utils.hash(
              this.timeStamp +
                this.msgType +
                this.category +
                this.proposer +
                this.transaction +
                this.committeeSignatures +
                this.preHash +
                this.other
            );
    }

    // Signature
    this.signature =
      this.hash === GENESIS_HASH ? GENESIS_SIGNATURE : wallet.sign(this.hash);
  }

  static isDataQueryValid(msg) {
    if (msg.query < 0) return false;

    return (
      msg.category.length >= CATEGORY_MIN_LENGTH &&
      msg.category.length <= CATEGORY_MAX_LENGTH
    );
  }

  static verifySignature(msg, blockchain) {
    // Verify the signature
    // Need to verify msg data === hash as also
    // Need to verify msg.category and msg.publicKey is matched onChain
    if (
      !utils.verifySignature(
        msg.publicKey || msg.proposer,
        msg.signature,
        msg.hash
      )
    )
      return false;

    // The signature public key must be registered onchain with the same category as msg category.
    for (let i = 0; i < blockchain.chain.length; i++) {
      for (
        let j = 0;
        j < blockchain.chain[i].transaction.messages.length;
        j++
      ) {
        if (
          blockchain.chain[i].transaction.messages[j].msgType ===
            MSG_TYPE.dataRetrieval &&
          blockchain.chain[i].transaction.messages[j].category === msg.category
        ) {
          if (msg.publicKey === undefined) {
            if (
              blockchain.chain[i].transaction.messages[j].publicKey ===
              msg.proposer
            )
              return true;
          } else {
            if (
              msg.publicKey ===
              blockchain.chain[i].transaction.messages[j].publicKey
            )
              return true;
          }
        }
      }
    }
    return false;
  }

  static verify(msg, blockchain) {
    // General
    if (
      msg.msgType !== MSG_TYPE.dataRetrieval &&
      !this.verifySignature(msg, blockchain)
    )
      return false;
    // Remember to check if category exists onchain or not

    // For dataRetrieval

    if (msg.msgType === MSG_TYPE.dataRetrieval) {
      if (!utils.verifySignature(msg.publicKey, msg.signature, msg.hash))
        return false;
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
      // Remember to check if category exists onchain or not
    }

    // For heartBeatRes

    if (msg.msgType === MSG_TYPE.heartBeatRes) {
      if (!this.verify(msg.heartBeatReq, blockchain)) return false;
      // Validate timestamp
      if (Date.now() - msg.heartBeatReq.timeStamp > HEARTBEAT_TIMEOUT * 1000)
        return false;
    }

    // For dataSharingReq
    if (msg.msgType === MSG_TYPE.dataSharingReq) {
      return this.isDataQueryValid(msg);
    }

    // For dataSharingRes
    if (msg.msgType === MSG_TYPE.dataSharingRes) {
      if (!this.verify(msg.dataSharingReq, blockchain)) return false;

      // Verify the MAE (model) with testset data

      return msg.MAE >= 0 && msg.MAE <= 100; // Because I don't use Federated learning.

      // End verify the MAE
    }

    // For blockVerifyReq
    if (msg.msgType === MSG_TYPE.blockVerifyReq) {
      // Verify all messages in transaction field
      for (const m of msg.transaction.messages) {
        if (!this.verify(m, blockchain)) return false;
      }

      if (blockchain.chain[blockchain.chain.length - 1].hash !== msg.preHash)
        return false;

      return true;
    }

    // For blockVerifyRes
    if (msg.msgType === MSG_TYPE.blockVerifyRes) {
      const blockVerifyReqOf_msg = { ...msg };
      blockVerifyReqOf_msg.msgType = MSG_TYPE.blockVerifyReq;
      if (!this.verify(blockVerifyReqOf_msg, blockchain)) return false;
      if (!msg.committeeSignature) return false;
      else {
        if (
          !utils.verifySignature(
            msg.committeeSignature.publicKey,
            msg.committeeSignature.signature,
            msg.hash
          )
        )
          return false;

        // Verify committee signature publicKey is onchain and category is the same as msg category
        for (let i = 0; i < blockchain.chain.length; i++) {
          for (
            let j = 0;
            j < blockchain.chain[i].transaction.messages.length;
            j++
          ) {
            if (
              blockchain.chain[i].transaction.messages[j].msgType ===
                MSG_TYPE.dataRetrieval &&
              blockchain.chain[i].transaction.messages[j].publicKey ===
                msg.committeeSignature.publicKey
            ) {
              if (
                msg.category ===
                blockchain.chain[i].transaction.messages[j].category
              )
                return true;
            }
          }
        }
        return false;
      }
    }

    // For blockCommit
    if (msg.msgType === MSG_TYPE.blockCommit) {
      const blockVerifyResOf_msg = { ...msg };
      blockVerifyResOf_msg.msgType = MSG_TYPE.blockVerifyRes;
      blockVerifyResOf_msg.committeeSignature =
        blockVerifyResOf_msg.committeeSignatures[0];
      delete blockVerifyResOf_msg["committeeSignatures"];
      if (!this.verify(blockVerifyResOf_msg, blockchain)) return false;

      // Now verify all committee signatures
      // O(n^3). Need to improve. Also, we should put this code in a function.
      for (let k = 0; k < msg.committeeSignatures.length; k++) {
        let found = false;
        for (let i = 0; i < blockchain.chain.length; i++) {
          if (found) break;
          for (
            let j = 0;
            j < blockchain.chain[i].transaction.messages.length;
            j++
          ) {
            if (
              blockchain.chain[i].transaction.messages[j].msgType ===
                MSG_TYPE.dataRetrieval &&
              blockchain.chain[i].transaction.messages[j].publicKey ===
                msg.committeeSignatures[k].publicKey
            ) {
              if (
                msg.category ===
                blockchain.chain[i].transaction.messages[j].category
              ) {
                found = true;
                break;
              }
            }
          }
        }
        if (!found) return false;
      }
      return true;
    }

    return true;
  }
}

module.exports = Message;
