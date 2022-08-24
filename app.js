const express = require("express");
const bodyParser = require("body-parser");

const P2pServer = require("./p2p-server");
const Blockchain = require("./blockchain");
const Wallet = require("./wallet");
const MessagePool = require("./message-pool");
const Message = require("./message");

const HTTP_PORT = process.env.HTTP_PORT;
const { MSG_TYPE, HEARTBEAT_TIMEOUT } = require("./config");

const app = express();

const wallet = new Wallet(process.env.SECRET);
const blockchain = new Blockchain(wallet);
const messagePool = new MessagePool();
const p2pServer = new P2pServer(blockchain, wallet, messagePool);

app.use(bodyParser.json());

app.post("/request", (req, res) => {
    const dataSharingReq = wallet.createDataSharingReqMsg(req.body); // Actually, It's a transaction.
    p2pServer.broadcastMessage(dataSharingReq);
    res.json(dataSharingReq);
})

app.get("/message", (req, res) => {
    res.json(messagePool.getAll());
})

app.get("/blockchain", (req, res) => {
    res.json(blockchain.getAll());
})

// Data retrieval

app.post("/register", (req, res) => {
    const dataRetrieval = wallet.createDataRetrievalMsg(req.body);
    p2pServer.broadcastMessage(dataRetrieval);
    setTimeout(() => {
        // When a node begins to work, It needs to get a correct chain from network.
        const getChainReq = new Message({}, wallet, MSG_TYPE.getChainReq);
        p2pServer.broadcastMessage(getChainReq);
    }, HEARTBEAT_TIMEOUT * 1000);
    res.json(dataRetrieval);
})

//

app.listen(HTTP_PORT, () => {
    console.info(`HTTP listening on port ${HTTP_PORT}`);
})

p2pServer.listen();