const Wallet = require("./wallet");



const pk = new Wallet("1l0v3bl0ckcha1n").sign(new Wallet("NODE3").getPublicKey());
console.info(pk);

//console.info(new Wallet("NODE").getPublicKey());