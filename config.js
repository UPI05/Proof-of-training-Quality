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
const GENESIS_CATEGORY_NODE1 = "tiger";
const GENESIS_PUBLICKEY_NODE2 =
  "276ab32fb62ccc18fcb9c0e792092b9b6911e53b75f951211b232cf84de061bf";
const GENESIS_CATEGORY_NODE2 = "tiger";
const GENESIS_PUBLICKEY_NODE3 =
  "57072510e8e9c406943c8ffa69a134f2ce1572290056c57e2fe37ca44044faa9";
const GENESIS_CATEGORY_NODE3 = "tiger";
const GENESIS_PUBLICKEY_NODE4 =
  "5e475e334d90c1accb4da890c8a3c4d22d8e9071f0e8e61ece9b07b2e424647c";
const GENESIS_CATEGORY_NODE4 = "tiger";
const GENESIS_PUBLICKEY_NODE5 =
  "4da98203c8f04e2d18a44ad2a6a59501dbc5b92d2d2ae21b517147d3d058d8f1";
const GENESIS_CATEGORY_NODE5 = "tiger";
/*
const GENESIS_PUBLICKEY_NODE6 =
  "35427164a0152faf6ba70dc400f5b4df269c7b35d7c7dcd815a22728ee469101";
const GENESIS_CATEGORY_NODE6 = "tiger";
const GENESIS_PUBLICKEY_NODE7 =
  "efdb816b732ca11cc00cc45dc5eb06a381c5fb960586fcde5067b645405795b8";
const GENESIS_CATEGORY_NODE7 = "tiger";
const GENESIS_PUBLICKEY_NODE8 =
  "85e2eef27b291d19a6dca82a7a5128f8aa607594644cea9b0bbe23e61d24549e";
const GENESIS_CATEGORY_NODE8 = "tiger";
const GENESIS_PUBLICKEY_NODE9 =
  "92a682f81015588ea4ea58b493e6cf1866f01e76c8f1dd207aefd6d59cca6246";
const GENESIS_CATEGORY_NODE9 = "tiger";
const GENESIS_PUBLICKEY_NODE10 =
  "a1089acd2c8f714b8e917468e28df5a4a6c4721844510e3f0e929a9123ea73b5";
const GENESIS_CATEGORY_NODE10 = "tiger";

*/

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
const HEARTBEAT_TIMEOUT = 4; // second

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
  GENESIS_PUBLICKEY_NODE3,
  GENESIS_CATEGORY_NODE3,
  GENESIS_PUBLICKEY_NODE4,
  GENESIS_CATEGORY_NODE4,
  GENESIS_PUBLICKEY_NODE5,
  GENESIS_CATEGORY_NODE5,
  FL_ROUND_THESHOLD,
  MAE_EPSILON,
  DEBUG
};
