const Wallet = require('./wallet')

const wallet = new Wallet('NODE20')

console.log(wallet.getPublicKey());