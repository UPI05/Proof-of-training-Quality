const wallet = require("./wallet");
const utils = require("./utils");

const wl = new wallet("hino");

const tx = wl.createTransaction({data: 5, category: "test"});

console.info(tx);