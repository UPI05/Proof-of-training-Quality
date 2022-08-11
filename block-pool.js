const Block = require("./block");

class BlockPool {
  constructor() {
    this.blocks = [];
  }

  addBlock(block) {
    this.blocks.push(block);
  }

  deleteBLock(blockHash) {
    for (let i = 0; i < this.blocks.length; i++) {
      if (this.blocks[i].hash == blockHash) this.blocks.splice(i, 1);
    }
  }

  verifyBlock(block) {
    return Block.verify(block);
  }

  blockExists(block, msg) {
    for (let i = 0; i < this.blocks.length; i++) {
      if (
        this.blocks[i].hash === block.hash &&
        !this.blocks[i].isSpent &&
        this.blocks[i].msg === msg
      )
        return true;
    }
    return false;
    /// Wrong??? return this.blocks.find(bl => {(bl.hash === block.hash) && !bl.isSpent && (bl.msg === msg)});
  }

  blockExistsWithSignature(block, msg) {
    for (let i = 0; i < this.blocks.length; i++) {
      //let x = this.blocks[i].committeeSignature[0].publicKey || "";
      //x === "" ? console.info(this.blocks[i]) : console.info("ok");
      if (
        this.blocks[i].hash === block.hash &&
        !this.blocks[i].isSpent &&
        this.blocks[i].msg === msg &&
        block.committeeSignature[0].publicKey ===
          this.blocks[i].committeeSignature[0].publicKey
      )
        return true;
    }
    return false;
  }

  countBlocks(block, msg) {
    let res = 0;
    for (let i = 0; i < this.blocks.length; i++) {
      if (this.blocks[i].msg !== msg) continue;
      if (block.hash === this.blocks[i].hash) res++;
    }
    return res;
  }

  getProposedBlockWithAllRelatedSignature(block, msg) {
    let committeeSignatures = [];
    
    for (let i = 0; i < this.blocks.length; i++) {
      if (
        this.blocks[i].msg === msg &&
        !this.blocks[i].isSpent &&
        block.hash === this.blocks[i].hash
      ) {
        committeeSignatures.push(this.blocks[i].committeeSignature[0]);
      }
    }
    block.committeeSignature = committeeSignatures;
    return block;
  }

  isComitteeVerified(block) {
    
  }

  getAll() {
    return this.blocks;
  }
}

module.exports = BlockPool;
