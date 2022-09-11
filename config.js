// Model
const RANDOM_BIAS = 10;
const ACCURRACY_RANGE = 100;
const MAE_EPSILON = 1;
const FL_ROUND_THESHOLD = 2;

// Genesis
const GENESIS_HASH = "0xDEADBEEF";
const GENESIS_TIMESTAMP = "010101010101";
const GENESIS_PROPOSER = "Hieu Vo";
const GENESIS_SIGNATURE = "VH";
const GENESIS_OTHER = {
  // This public key is used to verify new dataRetrieval requests
  //
  registerPublicKey:
    "d0233e2fbc91aeb97d462d71b05b6522a01c838249fb93b0ac57bb6965062cb4",
};
const GENESIS_PUBLICKEY_NODE1 =
  "5864f1e7d7e37e95882b398c21ca29b314ebfc6ea1286c8dc1201214cc0d0686";
const GENESIS_CATEGORY_NODE1 = "chicken";
const GENESIS_PUBLICKEY_NODE2 =
  "276ab32fb62ccc18fcb9c0e792092b9b6911e53b75f951211b232cf84de061bf";
const GENESIS_CATEGORY_NODE2 = "tiger";

// Category
const CATEGORY_MIN_LENGTH = 1;
const CATEGORY_MAX_LENGTH = 20;

// Message type
const MSG_TYPE = {
  getChainReq: "GetChainRequest",
  getChainRes: "GetChainResponse",
  heartBeatReq: "HeartBeatRequest", // Looking for alive nodes
  heartBeatRes: "HeartBeatResponse",
  dataRetrieval: "DataRetrieval",
  dataSharingReq: "DataSharingRequest",
  dataSharingRes: "DataSharingResponse",
  blockVerifyReq: "BlockVerifyRequest",
  blockVerifyRes: "BlockVerifyResponse",
  blockCommit: "BlockCommit",
  genesisBlock: "GenesisBlock"
};

// HeartBeat
const HEARTBEAT_TIMEOUT = 4; // In second

// 
const DEBUG = false;

module.exports = {
  GENESIS_TIMESTAMP,
  GENESIS_OTHER,
  GENESIS_PROPOSER,
  GENESIS_SIGNATURE,
  GENESIS_HASH,
  RANDOM_BIAS,
  ACCURRACY_RANGE,
  MSG_TYPE,
  CATEGORY_MIN_LENGTH,
  CATEGORY_MAX_LENGTH,
  HEARTBEAT_TIMEOUT,
  GENESIS_PUBLICKEY_NODE1,
  GENESIS_CATEGORY_NODE1,
  GENESIS_PUBLICKEY_NODE2,
  GENESIS_CATEGORY_NODE2,
  FL_ROUND_THESHOLD,
  MAE_EPSILON,
  DEBUG
};
