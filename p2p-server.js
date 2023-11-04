const WebSocket = require("ws");

const Wallet = require("./wallet");

const Message = require("./message");

const {
  RANDOM_BIAS,
  MSG_TYPE,
  HEARTBEAT_TIMEOUT,
  NODE_STARTUP_TIMEOUT,
  FL_ROUND_THESHOLD,
  MAE_EPSILON,
  DEBUG,
  GOSSIP_BIAS
} = require("./config.js");

const Peers = process.env.PEERS ? process.env.PEERS.split(",") : [];
const P2P_PORT = process.env.P2P_PORT;

class P2pServer {
  constructor(blockchain, wallet, messagePool) {
    this.sockets = [];
    this.blockchain = blockchain;
    this.wallet = wallet;
    this.messagePool = messagePool;
    this.shardConfig = {};
  }

  // WebSocket Connection

  listen() {

    // Shards config
    const fs = require('fs');
    const Wallet = require('./wallet');

    const configFile = fs.readFileSync('shards.config', 'utf8');

    const configLines = configFile.split('\n');

    const configLinesWithoutEmptyLines = configLines.filter(line => line.trim() !== '');

    const n = configLinesWithoutEmptyLines[0];
    const m = configLinesWithoutEmptyLines[1];

    const shards = new Array(m);

    for (let i = 1; i <= m; i++) {
      let shardNodes = configLinesWithoutEmptyLines[i + 1].split(', ').slice(0, -1);
      for (let j = 0; j < shardNodes.length; j++) {
        const wallet = new Wallet('NODE' + shardNodes[j]);
        shardNodes[j] = wallet.getPublicKey();
      }
      shards[i] = shardNodes;
    }
    
    this.numShard = m;
    this.numNode = n;
    this.shardsList = shards;

    const server = new WebSocket.Server({ port: P2P_PORT });
    server.on("connection", (socket) => {
      console.info("New connection");
      this.handleConnection(socket);
    });

    this.connectToPeers();

    /*
    // Wait for sockets connection
    setTimeout(() => {
      // When a node begins to work, It needs to get a correct chain from network.
      const getChainReq = new Message({}, this.wallet, MSG_TYPE.getChainReq);
      this.broadcastMessage(getChainReq);
    }, NODE_STARTUP_TIMEOUT * 1000);
    */    


  }

  checkSameShard(publicKeyA, publicKeyB) {
    for (let i = 1; i <= this.numShard; i++) {
      if (this.shardsList[i].indexOf(publicKeyA) !== -1 && this.shardsList[i].indexOf(publicKeyB) !== -1) return true;
    }
    return false;
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
    let gossip = false;
    
    if (!gossip) {
      // Broadcast

      this.sockets.forEach((socket) => {
        this.sendMessage(msg, socket);
      });
      
    } else {
      // Gossip instead of Broadcast

      this.sockets.sort(() => Math.random() - 0.5); // shuffle sockets to choose first k sockets
      for (let i = 0; i < Math.min(GOSSIP_BIAS, this.sockets.length); i++) {
        this.sendMessage(msg, this.sockets[i]);
      }
    }
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

      if (DEBUG) console.info(`received: ${msg.msgType}`);

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

            if (this.checkSameShard(msg.publicKey, this.wallet.getPublicKey())) {

              const getChainRes = new Message(
                { chain: this.blockchain.chain },
                this.wallet,
                MSG_TYPE.getChainRes
              );
              this.broadcastMessage(getChainRes);
            }
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
              this.blockchain.verifyChain(msg.chain) &&
              this.checkSameShard(msg.publicKey, this.wallet.getPublicKey())
            ) {
              this.blockchain.chain = msg.chain;
            }
          }

          break;

        // Looking for alive nodes in committee
        case MSG_TYPE.heartBeatReq:
          if (
            !this.messagePool.messageExistsWithHash(msg) &&
            this.messagePool.verifyMessage(msg, this.blockchain)
          ) {
            msg.isSpent = false;
            this.messagePool.addMessage(msg);
            this.broadcastMessage(msg);

            const resMsg = new Message(
              {
                heartBeatReq: msg,
              },
              this.wallet,
              MSG_TYPE.heartBeatRes
            );

            if (!msg.reqCata) {
              if (msg.category === process.env.CATEGORY) {
              
                this.broadcastMessage(resMsg);
              }
            } else {
              if (msg.reqCata === process.env.CATEGORY) {
              
                this.broadcastMessage(resMsg);
              }
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

        // Looking for alive nodes in shard
        case MSG_TYPE.shardHeartBeatReq:
          if (
            !this.messagePool.messageExistsWithHash(msg) &&
            this.messagePool.verifyMessage(msg, this.blockchain)
          ) {
            msg.isSpent = false;
            this.messagePool.addMessage(msg);
            this.broadcastMessage(msg);

            if (this.checkSameShard(msg.publicKey, this.wallet.getPublicKey())) {
              const resMsg = new Message(
                {
                  shardHeartBeatReq: msg,
                },
                this.wallet,
                MSG_TYPE.shardHeartBeatRes
              );
              this.broadcastMessage(resMsg);
            }
          }

          break;

        case MSG_TYPE.shardHeartBeatRes:
          if (
            !this.messagePool.messageExistsWithHash(msg) &&
            this.messagePool.verifyMessage(msg, this.blockchain) &&
            !this.messagePool.isMessageShardHeartBeatResDuplicated(msg)
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
            !this.messagePool.messageDataRetrievalExistsWithPublicKey(msg) // Need to check onchain because nodes may be shut down
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

            if (msg.requestCategory === process.env.CATEGORY) {
              // Because we don't implement a federated learning model, we will randomize the MAE and return an empty model
              const MAE = Math.random() * RANDOM_BIAS;

              // Now create a DataSharingTransaction
              delete msg["isSpent"];
              const dataSharingRes = new Message(
                {
                  ...msg,
                  MAE,
                  model: { content: "empty" },
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
            !this.messagePool.isMessageDataSharingResDuplicated(msg) // It means there is a node, who sent 2 responses for 1 dataSharingReq.
          ) {
            msg.isSpent = false;
            this.messagePool.addMessage(msg);
            this.broadcastMessage(msg);

            if (msg.dataSharingReq.requestCategory === process.env.CATEGORY) {
              const heartBeatReq = new Message(
                {},
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
                if (
                  this.messagePool.enoughResponseCompareToAliveNodes(
                    allHeartBeatRes,
                    allDataSharingRes
                  )
                ) {
                  const [minValidMAE, maxValidMAE] =
                    this.messagePool.getValidMAERange(
                      msg.dataSharingReq.hash,
                      MAE_EPSILON
                    );
                  if (
                    this.messagePool.isProposer(this.wallet, allDataSharingRes, minValidMAE, maxValidMAE)
                  ) {
                    // Get the right chain from network before creating a new block
                    const getChainReq = new Message(
                      {},
                      this.wallet,
                      MSG_TYPE.getChainReq
                    );
                    this.broadcastMessage(getChainReq);

                    // Model aggregation based on min/maxValidMAE
                    const aggregatedModel = {};
                    const blockVerifyReq = new Message(
                      {
                        preHash:
                          this.blockchain.chain[
                            this.blockchain.chain.length - 1
                          ].hash,
                        messages: this.messagePool.getAllRelatedMessages(
                          msg.dataSharingReq
                        ),
                        aggregatedModel,
                      },
                      this.wallet,
                      MSG_TYPE.blockVerifyReq
                    );
                    this.broadcastMessage(blockVerifyReq);
                    console.log(msg.hash);
                  }
                }
              }, HEARTBEAT_TIMEOUT * 1000);
            }
          }

          break;

        case MSG_TYPE.blockVerifyReq:
          if (this.messagePool.messageExistsWithHash(msg) || this.messagePool.isMessageBlockVerifyReqDuplicated(msg)) break;
            //Get the right chain from network before validating a new block
          if (this.messagePool.verifyMessage(msg, this.blockchain)) {
            msg.isSpent = false;
            this.messagePool.addMessage(msg);
            this.broadcastMessage(msg);
            const getChainReq = new Message(
              {},
              this.wallet,
              MSG_TYPE.getChainReq
            );
            this.broadcastMessage(getChainReq);

            //Need to wait for getChainRes
            setTimeout(() => {
              
              if (this.checkSameShard(msg.publicKey, this.wallet.getPublicKey())) {
                
                const heartBeatReq = new Message(
                  {reqCata: this.messagePool.getRequestedCatagoryFromBlockVerifyReq(msg.transaction.messages)},
                  this.wallet,
                  MSG_TYPE.heartBeatReq
                );
  
                this.broadcastMessage(heartBeatReq);

                setTimeout(() => {
                  const allHeartBeatRes = this.messagePool.getAllHeartBeatRes(heartBeatReq);
                  const allDataSharingResInABlockVerifyReq = this.messagePool.getAllDataSharingResInABlockVerifyReq(msg.transaction.messages);
                  
                  if (
                    this.messagePool.enoughResponseCompareToAliveNodes(
                      allHeartBeatRes,
                      allDataSharingResInABlockVerifyReq
                    )
                  ) {
                    
                    const blockVerifyRes = new Message(
                      {
                        blockVerifyReq: msg,
                        committeeSignature: {
                          publicKey: this.wallet.getPublicKey(),
                          signature: this.wallet.sign(msg.hash),
                        },
                      },
                      this.wallet,
                      MSG_TYPE.blockVerifyRes
                    );
  
                    this.broadcastMessage(blockVerifyRes);
                  }
                }, HEARTBEAT_TIMEOUT * 1000);
                

              }
            }, HEARTBEAT_TIMEOUT * 1000);
          }

          break;

        case MSG_TYPE.blockVerifyRes:
          if (
            this.messagePool.verifyMessage(msg, this.blockchain) &&
            !this.messagePool.messageExistsWithHash(msg) &&
            !this.messagePool.isMessageBlockVerifyResDuplicated(msg)
          ) {
            msg.isSpent = false;
            this.messagePool.addMessage(msg);
            this.broadcastMessage(msg);

            if (msg.blockVerifyReq.publicKey === this.wallet.getPublicKey()) {
              const shardHeartBeatReq = new Message(
                {},
                this.wallet,
                MSG_TYPE.shardHeartBeatReq
              );

              this.broadcastMessage(shardHeartBeatReq);

              setTimeout(() => {
                const allShardHeartBeatRes = this.messagePool.getAllShardHeartBeatRes(shardHeartBeatReq);
                const allBlockVerifyResCommitteeSignatures =
                  this.messagePool.getAllCommitteeSignaturesFromBlockVerifyRes(
                    msg.blockVerifyReq.hash
                  );
                if (
                  this.messagePool.enoughResponseCompareToAliveNodes(
                    allShardHeartBeatRes,
                    allBlockVerifyResCommitteeSignatures
                  )
                ) {
                  const blockCommit = new Message(
                    {
                      timeStamp: msg.blockVerifyReq.timeStamp,
                      preHash: msg.blockVerifyReq.preHash,
                      messages: msg.blockVerifyReq.transaction.messages,
                      aggregatedModel: msg.blockVerifyReq.aggregatedModel,
                      committeeSignatures: allBlockVerifyResCommitteeSignatures,
                    },
                    this.wallet,
                    MSG_TYPE.blockCommit
                  );

                  this.broadcastMessage(blockCommit);
                }
              }, HEARTBEAT_TIMEOUT * 1000);
            }
          }

          break;

        case MSG_TYPE.blockCommit:
          // To verify, nodes on network need to collect num of alive nodes and compare it with num of dataSharingRes with a valid rate (ex. 80%)
          if (
            this.messagePool.verifyMessage(msg, this.blockchain) &&
            !this.messagePool.messageExistsWithHash(msg)
          ) {

            msg.isSpent = false;
            this.messagePool.addMessage(msg);
            this.broadcastMessage(msg);

            if (this.checkSameShard(msg.publicKey, this.wallet.getPublicKey())) {
              
              const shardHeartBeatReq = new Message(
                {},
                this.wallet,
                MSG_TYPE.shardHeartBeatReq
              );

              this.broadcastMessage(shardHeartBeatReq);

              setTimeout(() => {
                const allShardHeartBeatRes = this.messagePool.getAllShardHeartBeatRes(shardHeartBeatReq);
                const allBlockVerifyResCommitteeSignatures = msg.committeeSignatures;
                if (
                    allShardHeartBeatRes.length === allBlockVerifyResCommitteeSignatures.length
                ) {
                  delete msg["isSpent"];
                  this.blockchain.addBlock(msg);
                  // Now mark all related messages in messagePool as spent
                  for (let i = 0; i < this.messagePool.messages.length; i++) {
                    if (
                      this.messagePool.messages[i].msgType ===
                        MSG_TYPE.dataRetrieval ||
                      this.messagePool.messages[i].msgType ===
                        MSG_TYPE.dataSharingReq ||
                      this.messagePool.messages[i].msgType === MSG_TYPE.dataSharingRes
                    )
                      for (let j = 0; j < msg.transaction.messages.length; j++) {
                        if (
                          this.messagePool.messages[i].hash ===
                          msg.transaction.messages[j].hash
                        ) {
                          this.messagePool.messages[i].isSpent = true;
                        }
                      }
                  }

                  const { flRound, requester, requestCategory } =
                    Message.getDataSharingReqInfoFromBlockCommitMsg(msg);
                  if (requester === this.wallet.getPublicKey()) {
                    // Then check FL_ROUND_THRESHOLD to create a dataSharingReq message with new round
                    if (flRound < FL_ROUND_THESHOLD) {
                      const dataSharingReqMsg = new Message(
                        {
                          requestCategory,
                          requestModel: msg.aggregatedModel,
                          flRound: flRound + 1,
                        },
                        this.wallet,
                        MSG_TYPE.dataSharingReq
                      );
                      this.broadcastMessage(dataSharingReqMsg);
                    } else {
                      // Threshold reached
                      if (DEBUG) console.info("Final round reached!");
                    }
                  }
                }
              }, HEARTBEAT_TIMEOUT * 1000);
            }
          }
          break;
        default:
          console.info("oops!");
      }
    });
  }
}

module.exports = P2pServer;
