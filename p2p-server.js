const WebSocket = require("ws");

const Block = require("./block");

const { RANDOM_BIAS, TRUST_RATIO } = require("./config.js");

const Peers = process.env.PEERS ? process.env.PEERS.split(",") : [];
const P2P_PORT = process.env.P2P_PORT;

const MSG_TYPE = {
  dataRetrival: "DataRetrival",
  dataSharing: "DataSharing",
  blockVerifyReq: "BlockVerifyRequest",
  blockVerifyRes: "BlockVerifyResponse",
  blockCommit: "BlockCommit",
  orgzRegis: "OrganizationRegister",
};

class P2pServer {
  constructor(blockchain, wallet, transactionPool, blockPool) {
    this.sockets = [];
    this.blockchain = blockchain;
    this.wallet = wallet;
    this.transactionPool = transactionPool;
    this.blockPool = blockPool;
  }

  // WebSocket Connection

  listen() {
    const server = new WebSocket.Server({ port: P2P_PORT });
    server.on("connection", (socket) => {
      console.info("New connection");
      this.handleConnection(socket);
    });
    this.connectToPeers();
  }

  connectToPeers() {
    Peers.forEach((peer) => {
      const socket = new WebSocket(peer);
      socket.on("open", () => this.handleConnection(socket));
    });
  }

  handleConnection(socket) {
    this.sockets.push(socket);
    console.info("Socket connected");
    this.handleMessage(socket);
  }

  // Send and receive data

  broadcastTransaction(transaction) {
    this.sockets.forEach((socket) => {
      this.sendTransaction(transaction, socket);
    });
  }

  sendTransaction(transaction, socket) {
    socket.send(
      JSON.stringify({
        type:
          transaction.transactionType === 0
            ? MSG_TYPE.dataRetrival
            : MSG_TYPE.dataSharing,
        data: transaction,
      })
    );
  }

  broadcastBlockVerifyReq(blockVerifyReq) {
    this.sockets.forEach((socket) => {
      this.sendBlockVerifyReq(blockVerifyReq, socket);
    });
  }

  sendBlockVerifyReq(blockVerifyReq, socket) {
    socket.send(
      JSON.stringify({
        type: MSG_TYPE.blockVerifyReq,
        data: blockVerifyReq,
      })
    );
  }

  broadcastBlockVerifyRes(blockVerifyRes) {
    this.sockets.forEach((socket) => {
      this.sendBlockVerifyRes(blockVerifyRes, socket);
    });
  }

  sendBlockVerifyRes(blockVerifyRes, socket) {
    socket.send(
      JSON.stringify({
        type: MSG_TYPE.blockVerifyRes,
        data: blockVerifyRes,
      })
    );
  }

  broadcastBlockCommit(block) {
    this.sockets.forEach((socket) => {
      this.sendBlockCommit(block, socket);
    });
  }

  sendBlockCommit(block, socket) {
    socket.send(
      JSON.stringify({
        type: MSG_TYPE.blockCommit,
        data: block,
      })
    );
  }

  // The PoQ consensus protocol

  handleMessage(socket) {
    socket.on("message", (message) => {
      const msg = JSON.parse(message);
      const tx = msg.data;
      const block = msg.data;

      switch (msg.type) {
        case MSG_TYPE.dataRetrival:
          if (
            this.transactionPool.verifyTransaction(tx) &&
            !this.transactionPool.transactionExists(tx)
          ) {
            tx.isSpent = false;
            this.transactionPool.addTransaction(tx);
            this.broadcastTransaction(tx);

            // Now train a model, valuate the MAE and broadcast that DataSharingTransaction to all nodes in the committee

            if (tx.category === process.env.CATEGORY) {
              // Because we don't implement a federated learning model, we will randomize the MAE and return an empty model
              const MAE = Math.random() * RANDOM_BIAS;

              // Now create a DataSharingTransaction

              const dataSharingTx = this.wallet.createDataSharingTransaction({
                MAE,
                model: { conten: "empty" },
                retrivalTransaction: tx,
              });

              this.broadcastTransaction(dataSharingTx);
            }
          }

          break;

        case MSG_TYPE.dataSharing:
          if (
            this.transactionPool.verifyTransaction(tx) &&
            !this.transactionPool.transactionExists(tx) &&
            !this.transactionPool.transactionType1Exists(tx)
          ) {
            this.transactionPool.addTransaction(tx);
            this.broadcastTransaction(tx);

            if (tx.retrivalTransaction.category === process.env.CATEGORY) {
              const committeeSize = this.blockchain.countCommitteeNodes(
                process.env.CATEGORY
              );
              const receivedCommitteeNodes =
                this.transactionPool.countTransactions(
                  tx.retrivalTransaction.hash,
                  tx.transactionType,
                  process.env.CATEGORY
                );

              if (receivedCommitteeNodes >= committeeSize) {
                const isComposer = this.transactionPool.isComposer(
                  tx.retrivalTransaction.hash,
                  this.wallet
                );

                if (isComposer) {
                  // Compose a new block with all unspent transactions in the pool
                  const txs = this.transactionPool.getAllUnspentTransactions();

                  const block = new Block(
                    {
                      composer: this.wallet.getPublicKey(),
                      transactions: txs,
                      preHash:
                        this.blockchain.chain[this.blockchain.chain.length - 1]
                          .hash,
                    },
                    this.wallet
                  );

                  this.broadcastBlockVerifyReq(block);
                }
              }
            }
          }

          break;

        case MSG_TYPE.blockVerifyReq:
          if (
            this.blockPool.verifyBlock(block) &&
            !this.blockPool.blockExists(block, MSG_TYPE.blockVerifyReq) &&
            block.preHash ===
              this.blockchain.chain[this.blockchain.chain.length - 1].hash
          ) {
            block.isSpent = false;
            block.msg = MSG_TYPE.blockVerifyReq;

            this.blockPool.addBlock(block);

            this.broadcastBlockVerifyReq(block);
            
            if (
              this.blockchain.getCategoryFromPublicKey(block.composer) ===
              process.env.CATEGORY
            ) {
              block.committeeSignature.push({
                publicKey: this.wallet.getPublicKey(),
                signature: this.wallet.sign(block.hash),
              });

              this.broadcastBlockVerifyRes(block);
            }
          }

          break;

        case MSG_TYPE.blockVerifyRes:
          if (
            this.blockPool.verifyBlock(block) &&
            !this.blockPool.blockExistsWithSignature(block, MSG_TYPE.blockVerifyRes) &&
            block.preHash === this.blockchain.chain[this.blockchain.chain.length - 1].hash &&
            block.committeeSignature.length === 1
          ) {
            block.isSpent = false;
            block.msg = MSG_TYPE.blockVerifyRes;

            this.blockPool.addBlock(block);

            this.broadcastBlockVerifyRes(block);

            if (block.composer === this.wallet.getPublicKey()) {
              const blockResponseCnt = this.blockPool.countBlocks(
                block,
                MSG_TYPE.blockVerifyRes
              );
              if (
                blockResponseCnt >=
                this.blockchain.countCommitteeNodes(process.env.CATEGORY)
              ) {
                const proposedBlock = this.blockPool.getProposedBlockWithAllRelatedSignature({...block}, MSG_TYPE.blockVerifyRes);
                
                this.broadcastBlockCommit(proposedBlock);

              }
            }
          }
          
          break;


        case MSG_TYPE.blockCommit:

          if (
            this.blockPool.verifyBlock(block) &&
            this.blockPool.isComitteeVerified(block) &&
            block.preHash === this.blockchain.chain[this.blockchain.chain.length - 1].hash &&
            block.committeeSignature.length === 1
          ) {

          }

          break;
        default:
          console.info("oops");
      }
    });
  }
}

module.exports = P2pServer;
