const utils = require("./utils");
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
} = require("./config");

class Message {
  constructor(materials, wallet, msgType) {
    // General

    this.timeStamp =
      GENESIS_HASH === materials.hash ? GENESIS_TIMESTAMP : Date.now();
    this.msgType = msgType || "";
    this.publicKey = wallet.getPublicKey() || "";
    this.category = process.env.CATEGORY || "";

    // For dataRetrieval

    if (msgType === MSG_TYPE.dataRetrieval) {
      this.accessSignature = materials.signature || "";
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
      this.chain = materials.chain || {};
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
      this.heartBeatReq = materials.heartBeatReq || {};
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
      this.requestCategory = materials.requestCategory || "";
      this.requestData = materials.requestData || -1;
      this.hash = utils.hash(
        this.timeStamp +
          this.msgType +
          this.publicKey +
          this.requestCategory +
          this.requestData
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
    // Just modify the blockVerifyReq: edit msgType and add committeeSignature property.
    // We don't need to create a new Message with a new hash.
    // The validators just need to sign the blockVerifyReq.

    // For blockCommit
    // The same for blockCommit. Utilize the blockVerifyReq, edit msgType and add committeeSignatures property.

    // Signature
    this.signature =
      this.hash === GENESIS_HASH ? GENESIS_SIGNATURE : wallet.sign(this.hash);
  }

  // For dataSharingReq
  static isDataQueryValid(msg) {
    if (msg.requestData < 0) return false;

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

  static verifySenderAndMsgIntegrity(msg, blockchain) {
    // Need to verify message integrity
    if (
      !utils.verifySignature(
        msg.publicKey || msg.proposer,
        msg.signature,
        msg.hash
      )
    )
      return false;

    // The sender (publicKey, category) must be registered onchain.
    const publicKey = msg.proposer || msg.publicKey;
    if (
      blockchain.getCategoryFromPublicKey(publicKey) === msg.category &&
      msg.category
    )
      return true;
    return false;
  }

  static verify(msg, blockchain) {
    // General
    if (
      msg.msgType !== MSG_TYPE.dataRetrieval &&
      !this.verifySenderAndMsgIntegrity(msg, blockchain)
    )
      return false;

    // For dataRetrieval

    if (msg.msgType === MSG_TYPE.dataRetrieval) {
      // We have to isolate this kind of message because the (publicKey, category) hasn't been registered onchain yet.
      // We need to verify the integrity
      if (!utils.verifySignature(msg.publicKey, msg.signature, msg.hash))
        return false;
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

      if (!(msg.MAE >= 0 && msg.MAE <= 100)) return false; // Because I don't use Federated learning.

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

      if (blockchain.chain[blockchain.chain.length - 1].hash !== msg.preHash)
        return false;

      return true;
    }

    // For blockVerifyRes
    if (msg.msgType === MSG_TYPE.blockVerifyRes) {
      // Copy the message and change msgType
      const blockVerifyReqOf_msg = { ...msg };
      blockVerifyReqOf_msg.msgType = MSG_TYPE.blockVerifyReq;

      if (!this.verify(blockVerifyReqOf_msg, blockchain)) return false;
      if (!msg.committeeSignature) return false;
      else
        return this.verifyCommitteeSignature(
          msg.committeeSignature,
          msg.hash,
          blockchain,
          msg.category
        );
    }

    // For blockCommit
    if (msg.msgType === MSG_TYPE.blockCommit) {
      // Copy and edit the message for blockVerifyReq verification.
      const blockVerifyReqOf_msg = { ...msg };
      blockVerifyReqOf_msg.msgType = MSG_TYPE.blockVerifyReq;

      if (!this.verify(blockVerifyReqOf_msg, blockchain)) return false;

      // Now verify all committee signatures
      if (!msg.committeeSignatures) return false;
      for (const committeeSignature of msg.committeeSignatures) {
        if (
          !this.verifyCommitteeSignature(
            committeeSignature,
            msg.hash,
            blockchain,
            msg.category
          )
        )
          return false;
      }

      return true;
    }

    return true;
  }
}

module.exports = Message;
