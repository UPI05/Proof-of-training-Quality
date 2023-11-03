// Model
const RANDOM_BIAS = 10;
const ACCURRACY_RANGE = 100;
const MAE_EPSILON = 1;
const FL_ROUND_THESHOLD = 1;

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

      // These category should be synchronized with package.json
const GENESIS_PUBLICKEY_NODE1 =
  "5864f1e7d7e37e95882b398c21ca29b314ebfc6ea1286c8dc1201214cc0d0686";
const GENESIS_CATEGORY_NODE1 = "chicken";
const GENESIS_PUBLICKEY_NODE2 =
  "276ab32fb62ccc18fcb9c0e792092b9b6911e53b75f951211b232cf84de061bf";
const GENESIS_CATEGORY_NODE2 = "chicken";
const GENESIS_PUBLICKEY_NODE3 =
  "57072510e8e9c406943c8ffa69a134f2ce1572290056c57e2fe37ca44044faa9";
const GENESIS_CATEGORY_NODE3 = "tiger";
const GENESIS_PUBLICKEY_NODE4 =
  "5e475e334d90c1accb4da890c8a3c4d22d8e9071f0e8e61ece9b07b2e424647c";
const GENESIS_CATEGORY_NODE4 = "tiger";
const GENESIS_PUBLICKEY_NODE5 =
  "4da98203c8f04e2d18a44ad2a6a59501dbc5b92d2d2ae21b517147d3d058d8f1";
const GENESIS_CATEGORY_NODE5 = "tiger";
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
const GENESIS_PUBLICKEY_NODE11 =
  "4ad4b357e228014764c1935eac91b3c5eaa9c8f9236df956ab41f952c409c5a2";
const GENESIS_CATEGORY_NODE11 = "tiger";
const GENESIS_PUBLICKEY_NODE12 =
  "883a9644f21b15763821c6a174585a2bf45bfb866023fce3f75c818184416879";
const GENESIS_CATEGORY_NODE12 = "tiger";
const GENESIS_PUBLICKEY_NODE13 =
  "07c26d075be66490a91e73e986cbd896589843acddc7755e05da4588a91c2ef5";
const GENESIS_CATEGORY_NODE13 = "tiger";
const GENESIS_PUBLICKEY_NODE14 =
  "5f71037ccebf792548f86c6198f367dfdc9346b33d7f2c3fc76526f1fd566cab";
const GENESIS_CATEGORY_NODE14 = "tiger";
const GENESIS_PUBLICKEY_NODE15 =
  "b2333b30292729a406ad10f290023ff147bab8896a754152443c691182447ac4";
const GENESIS_CATEGORY_NODE15 = "tiger";
const GENESIS_PUBLICKEY_NODE16 =
  "b5307eba921e640193b64e883943c99ad26c4991b2f6dc0761b569208f8e5ee1";
const GENESIS_CATEGORY_NODE16 = "tiger";
const GENESIS_PUBLICKEY_NODE17 =
  "20c2403cd87a039adb9b67f03daba34027e2f068e8ee5b7d1faf4f3b719d5ec3";
const GENESIS_CATEGORY_NODE17 = "tiger";
const GENESIS_PUBLICKEY_NODE18 =
  "20e60bb3d0e5aafb8e16826f75413394c4a6854769ef8a32d11fa002703f81d9";
const GENESIS_CATEGORY_NODE18 = "tiger";
const GENESIS_PUBLICKEY_NODE19 =
  "c685447c6373fb6595a3afa7f275aad5a9e2daed84514db64200897b6b931196";
const GENESIS_CATEGORY_NODE19 = "tiger";
const GENESIS_PUBLICKEY_NODE20 =
  "6c0baf4b7f297746cafc9447e1e4765a344845f93dae09d188683ad236fe74e4";
const GENESIS_CATEGORY_NODE20 = "tiger";

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
const HEARTBEAT_TIMEOUT = 30; // second  
const NODE_STARTUP_TIMEOUT = 5; 

// 
const DEBUG = true;
const GOSSIP_BIAS = 3;

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
  NODE_STARTUP_TIMEOUT,
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
  GENESIS_PUBLICKEY_NODE6,
  GENESIS_CATEGORY_NODE6,
  GENESIS_PUBLICKEY_NODE7,
  GENESIS_CATEGORY_NODE7,
  GENESIS_PUBLICKEY_NODE8,
  GENESIS_CATEGORY_NODE8,
  GENESIS_PUBLICKEY_NODE9,
  GENESIS_CATEGORY_NODE9,
  GENESIS_PUBLICKEY_NODE10,
  GENESIS_CATEGORY_NODE10,
  GENESIS_PUBLICKEY_NODE11,
  GENESIS_CATEGORY_NODE11,
  GENESIS_PUBLICKEY_NODE12,
  GENESIS_CATEGORY_NODE12,
  GENESIS_PUBLICKEY_NODE13,
  GENESIS_CATEGORY_NODE13,
  GENESIS_PUBLICKEY_NODE14,
  GENESIS_CATEGORY_NODE14,
  GENESIS_PUBLICKEY_NODE15,
  GENESIS_CATEGORY_NODE15,
  GENESIS_PUBLICKEY_NODE16,
  GENESIS_CATEGORY_NODE16,
  GENESIS_PUBLICKEY_NODE17,
  GENESIS_CATEGORY_NODE17,
  GENESIS_PUBLICKEY_NODE18,
  GENESIS_CATEGORY_NODE18,
  GENESIS_PUBLICKEY_NODE19,
  GENESIS_CATEGORY_NODE19,
  GENESIS_PUBLICKEY_NODE20,
  GENESIS_CATEGORY_NODE20,
  FL_ROUND_THESHOLD,
  MAE_EPSILON,
  DEBUG,
  GOSSIP_BIAS
};
