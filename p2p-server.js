const WebSocket = require("ws");

const Message = require("./message");

const { RANDOM_BIAS, MSG_TYPE, HEARTBEAT_TIMEOUT } = require("./config.js");

const Peers = process.env.PEERS ? process.env.PEERS.split(",") : [];
const P2P_PORT = process.env.P2P_PORT;

class P2pServer {
  constructor(blockchain, wallet, messagePool) {
    this.sockets = [];
    this.blockchain = blockchain;
    this.wallet = wallet;
    this.messagePool = messagePool;
  }

  // WebSocket Connection

  listen() {
    const server = new WebSocket.Server({ port: P2P_PORT });
    server.on("connection", (socket) => {
      console.info("New connection");
      this.handleConnection(socket);
    });
    this.connectToPeers();

    // Wait for sockets connection
    setTimeout(() => {
      // When a node begins to work, It needs to get a correct chain from network.
      const getChainReq = new Message({}, this.wallet, MSG_TYPE.getChainReq);
      this.broadcastMessage(getChainReq);
    }, 1000);
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

  // Broadcast messages

  broadcastMessage(msg) {
    this.sockets.forEach((socket) => {
      this.sendMessage(msg, socket);
    });
  }

  sendMessage(msg, socket) {
    socket.send(
      JSON.stringify({
        type: msg.msgType || "",
        data: msg,
      })
    );
  }

  // The PoQ consensus protocol

  handleMessage(socket) {
    socket.on("message", (message) => {
      message = JSON.parse(message);
      const msg = message.data;

      switch (message.type) {
        // Looking for the right chain
        case MSG_TYPE.getChainReq:
          if (
            !this.messagePool.messageExistsWithHash(msg) &&
            this.messagePool.verifyMessage(msg, this.blockchain)
          ) {
            msg.isSpent = false;
            this.messagePool.addMessage(msg);
            this.broadcastMessage(msg);

            const getChainRes = new Message(
              { chain: this.blockchain.chain },
              this.wallet,
              MSG_TYPE.getChainRes
            );
            this.broadcastMessage(getChainRes);
          }
          break;

        case MSG_TYPE.getChainRes:
          if (
            !this.messagePool.messageExistsWithHash(msg) &&
            this.messagePool.verifyMessage(msg, this.blockchain)
            // We don't need to check isMessageGetChainResDuplicated here because the chain will be better without checking.
          ) {
            msg.isSpent = false;
            this.messagePool.addMessage(msg);
            this.broadcastMessage(msg);

            // Verify the chain and add to blockchain
            if (
              msg.chain.length > this.blockchain.chain.length &&
              this.blockchain.verifyChain(msg.chain, blockchain)
            ) {
              this.blockchain.chain = msg.chain;
            }
          }

          break;

        // Looking for alive nodes
        case MSG_TYPE.heartBeatReq:
          if (
            !this.messagePool.messageExistsWithHash(msg) &&
            this.messagePool.verifyMessage(msg, this.blockchain)
          ) {
            msg.isSpent = false;
            this.messagePool.addMessage(msg);
            this.broadcastMessage(msg);

            if (msg.category === process.env.CATEGORY) {
              const resMsg = new Message(
                {
                  heartBeatReq: msg,
                },
                this.wallet,
                MSG_TYPE.heartBeatRes
              );
              this.broadcastMessage(resMsg);
            }
          }

          break;

        case MSG_TYPE.heartBeatRes:
          if (
            !this.messagePool.messageExistsWithHash(msg) &&
            this.messagePool.verifyMessage(msg, this.blockchain) &&
            !this.messagePool.isMessageHeartBeatResDuplicated(msg)
          ) {
            msg.isSpent = false;
            this.messagePool.addMessage(msg);
            this.broadcastMessage(msg);
          }

          break;

        // Main consensus protocol
        case MSG_TYPE.dataRetrieval:
          if (
            this.messagePool.verifyMessage(msg, this.blockchain) &&
            !this.messagePool.messageExistsWithHash(msg) &&
            !this.messagePool.messageDataRetrievalExistsWithPublicKey(msg)
          ) {
            msg.isSpent = false;
            this.messagePool.addMessage(msg);
            this.broadcastMessage(msg);
          }

          break;

        case MSG_TYPE.dataSharingReq:
          if (
            this.messagePool.verifyMessage(msg, this.blockchain) &&
            !this.messagePool.messageExistsWithHash(msg)
          ) {
            msg.isSpent = false;
            this.messagePool.addMessage(msg);
            this.broadcastMessage(msg);

            // Now train a model, valuate the MAE and broadcast that dataSharingRes to all nodes in the committee

            if (msg.category === process.env.CATEGORY) {
              // Because we don't implement a federated learning model, we will randomize the MAE and return an empty model
              const MAE = Math.random() * RANDOM_BIAS;

              // Now create a DataSharingTransaction
              delete msg["isSpent"];
              const dataSharingRes = new Message(
                {
                  ...msg,
                  MAE,
                  model: { conten: "empty" },
                  dataSharingReq: msg,
                },
                this.wallet,
                MSG_TYPE.dataSharingRes
              );

              this.broadcastMessage(dataSharingRes);
            }
          }

          break;

        case MSG_TYPE.dataSharingRes:
          if (
            this.messagePool.verifyMessage(msg, this.blockchain) &&
            !this.messagePool.messageExistsWithHash(msg) &&
            !this.messagePool.isMessageDataSharingResDuplicated(msg) // It means there is a node sent 2 responses for 1 dataSharingReq.
          ) {
            msg.isSpent = false;
            this.messagePool.addMessage(msg);
            this.broadcastMessage(msg);

            if (msg.dataSharingReq.category === process.env.CATEGORY) {
              const heartBeatReq = new Message(
                { category: process.env.CATEGORY },
                this.wallet,
                MSG_TYPE.heartBeatReq
              );

              this.broadcastMessage(heartBeatReq);

              setTimeout(() => {
                // Get all committee nodes, which is alive.
                const allHeartBeatRes =
                  this.messagePool.getAllHeartBeatRes(heartBeatReq);
                //
                const allDataSharingRes = this.messagePool.getAllDataSharingRes(
                  msg.dataSharingReq.hash
                );
                // Now check if all dataSharingRes messages come from heartBeatRes - alive committee nodes.
                if (
                  this.messagePool.enoughDataSharingRes(
                    allHeartBeatRes,
                    allDataSharingRes
                  )
                ) {
                  if (
                    this.messagePool.isProposer(this.wallet, allDataSharingRes)
                  ) {
                    const blockVerifyReq = new Message(
                      {
                        preHash:
                          this.blockchain.chain[
                            this.blockchain.chain.length - 1
                          ].hash,
                        messages: this.messagePool.getAllRelatedMessages(
                          msg.dataSharingReq
                        ),
                      },
                      this.wallet,
                      MSG_TYPE.blockVerifyReq
                    );
                    this.broadcastMessage(blockVerifyReq);
                  }
                }
              }, HEARTBEAT_TIMEOUT * 1000);
            }
          }

          break;

        case MSG_TYPE.blockVerifyReq:
          if (
            this.messagePool.verifyMessage(msg, this.blockchain) &&
            !this.messagePool.messageExistsWithHash(msg)
          ) {
            msg.isSpent = false;
            this.messagePool.addMessage(msg);
            this.broadcastMessage(msg);

            if (msg.category === process.env.CATEGORY) {
              const blockVerifyRes = { ...msg };
              blockVerifyRes.committeeSignature = {
                publicKey: this.wallet.getPublicKey(),
                signature: this.wallet.sign(msg.hash),
              };

              blockVerifyRes.msgType = MSG_TYPE.blockVerifyRes;
              this.broadcastMessage(blockVerifyRes);
            }
          }

          break;

        case MSG_TYPE.blockVerifyRes:
          if (
            this.messagePool.verifyMessage(msg, this.blockchain) &&
            !this.messagePool.messageExistsWithHashMsgTypeAndCommitteePublicKey(
              msg
            )
          ) {
            msg.isSpent = false;
            this.messagePool.addMessage(msg);
            this.broadcastMessage(msg);

            if (msg.proposer === this.wallet.getPublicKey()) {
              const heartBeatReq = new Message(
                { category: process.env.CATEGORY },
                this.wallet,
                MSG_TYPE.heartBeatReq
              );

              this.broadcastMessage(heartBeatReq);

              setTimeout(() => {
                const allHeartBeatRes =
                  this.messagePool.getAllHeartBeatRes(heartBeatReq);
                const allBlockVerifyResCommitteeSignatures =
                  this.messagePool.getAllCommitteeSignaturesFromBlockVerifyRes(
                    msg.hash
                  );
                if (
                  this.messagePool.enoughBlockVerifyRes(
                    allHeartBeatRes,
                    allBlockVerifyResCommitteeSignatures
                  )
                ) {
                  const blockCommit = { ...msg };
                  delete blockCommit["committeeSignature"];
                  blockCommit.committeeSignatures =
                    allBlockVerifyResCommitteeSignatures;
                  blockCommit.msgType = MSG_TYPE.blockCommit;

                  this.broadcastMessage(blockCommit);
                }
              }, HEARTBEAT_TIMEOUT * 1000);
            }
          }

          break;

        case MSG_TYPE.blockCommit:
          if (
            this.messagePool.verifyMessage(msg, this.blockchain) &&
            !this.messagePool.messageExistsWithHashAndMsgType(msg)
          ) {
            this.blockchain.addBlock(msg);
            this.messagePool.addMessage(msg);
            this.broadcastMessage(msg);

            // Now mark transactions and blocks in pools as spent
            for (let i = 0; i < this.messagePool.messages.length; i++) {
              if (
                this.messagePool.messages[i].msgType ===
                  MSG_TYPE.dataRetrieval ||
                this.messagePool.messages[i].msgType ===
                  MSG_TYPE.dataSharingReq ||
                this.messagePool.messages[i].msgType === MSG_TYPE.dataSharingRes
              )
                for (let j = 0; j < msg.transaction.messages.length; j++) {
                  if (this.messagePool.messages[i].hash === msg.transaction.messages[j].hash) {
                    this.messagePool.messages[i].isSpent = true;
                  }
                }
            }
          }
          break;
        default:
          console.info("oops");
      }
    });
  }
}

module.exports = P2pServer;
