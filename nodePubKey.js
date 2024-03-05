const dotenv = require("dotenv").config();
const Wallet = require("./wallet");

const publicKey = new Wallet("NODE10").getPublicKey();
console.log(publicKey)