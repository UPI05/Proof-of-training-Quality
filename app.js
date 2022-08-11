const express = require("express");
const bodyParser = require("body-parser");

const P2pServer = require("./p2p-server");
const Blockchain = require("./blockchain");
const Wallet = require("./wallet");
const TransactionPool = require("./transaction-pool");
const BLockPool = require("./block-pool");
const BlockPool = require("./block-pool");

const HTTP_PORT = process.env.HTTP_PORT;

const app = express();

const wallet = new Wallet(process.env.SECRET);
const blockchain = new Blockchain(wallet);
const transactionPool = new TransactionPool();
const blockPool = new BlockPool();
const p2pServer = new P2pServer(blockchain, wallet, transactionPool, blockPool);

app.use(bodyParser.json());

app.post("/request", (req, res) => {
    const transaction = wallet.createDataRetrivalTransaction(req.body);
    p2pServer.broadcastTransaction(transaction);
    res.json(transaction);
})

app.get("/transactions", (req, res) => {
    res.json(transactionPool.getAll());
})

app.get("/blocks", (req, res) => {
    res.json(blockPool.getAll());
})

app.get("/blockchain", (req, res) => {
    res.json(blockchain.getAll());
})



app.listen(HTTP_PORT, () => {
    console.info(`HTTP listening on port ${HTTP_PORT}`);
})

p2pServer.listen();