const dotenv = require("dotenv").config();
const Wallet = require("./wallet");

const publicKey = new Wallet("NODE3").getPublicKey();

const accessSignature = new Wallet(process.env.DATA_RETRIEVAL_PRIVATE_KEY).sign(
  publicKey
);

console.info(accessSignature);