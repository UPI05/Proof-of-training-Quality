const Wallet = require("./wallet");


const pk = new Wallet(process.env.DATA_RETRIEVAL_PRIVATE_KEY).sign(new Wallet("NODE3").getPublicKey());
console.info(pk);

console.info(new Wallet("NODE2").getPublicKey());