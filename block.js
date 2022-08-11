const utils = require("./utils");
const { RANDOM_BIAS, VALID_EPS } = require("./config");

class Block {
  constructor(materials, wallet) {
    this.timeStamp = Date.now();
    this.composer = materials.composer || "";
    this.transactions = materials.transactions || [];
    this.committeeSignature = materials.committeeSignature || [];
    this.preHash = materials.preHash || "";
    this.other = materials.other || "";
    this.hash = materials.genesis ? "0xDEADBEEF" : utils.hash(
      this.timeStamp +
        this.composer +
        this.transactions +
        this.preHash +
        this.other
    );
    this.composerSignature = wallet.sign(this.hash);
  }

  static verify(block) {
    // Verify all signatures

    if (
      !utils.verifySignature(block.composer, block.composerSignature, block.hash)
    )
      return false;

    for (let i = 0; i < block.transactions.length; i++) {
      if (block.transactions[i].transactionType !== 2) {
        if (
          !utils.verifySignature(
            block.transactions[i].publicKey,
            block.transactions[i].signature,
            block.transactions[i].hash
          )
        )
          return false;
      }
    }

    // Verify MAE value and make sure it's the lowest one
/*
    let composerMAE, composerModel;

    for (let i = 0; i < block.transactions.length; i++) {
      if (
        block.transactions[i].publicKey === block.composer &&
        block.transactions[i].transactionType === 1
      ) {
        composerMAE = block.transactions[i].MAE;
        composerModel = block.transactions[i].Model;
        break;
      }
    }

    // The validators now valuate the MAE of composer with the train set or test set based on Federated Learning model
    // Because we don't implement a Federated Learning model, we will randomize a MAE and compare with the composer MAE

    const MAE = Math.random() * RANDOM_BIAS;

    if (Math.abs(MAE - composerMAE) > VALID_EPS) {
        return false
    }
*/
    return true;
  }
}

module.exports = Block;
