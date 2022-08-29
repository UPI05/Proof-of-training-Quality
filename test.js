/*const Message = require("./message");
const { MSG_TYPE } = require("./config");
const Wallet = require("./wallet");
const utils = require("./utils");

console.info(
  utils.verifySignature(
    "5864f1e7d7e37e95882b398c21ca29b314ebfc6ea1286c8dc1201214cc0d0686",
    "A6ECB4573CFDA71A561848C954D26B9080D891ECCAA3C5597B154A2E070448AF591448BD8E53B2ED6E15E7D4CB672B68646498FF015906DA5B38EC62483F1E05",
    "d61078b94bc44f3fd9224dbe2fc750ad7cb6556bfd450f66d09c1a2a25ffb3c7"
  )
);
*/
const dotenv = require("dotenv").config();
const WebSocket = require("ws");
const ip = require("ip");
console.info(ip.address());