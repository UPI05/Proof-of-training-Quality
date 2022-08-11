# Proof of training Quality implementation

Basically, this is my brief implementation for Proof of training Quality consensus machanism from the article [Blockchain and Federated Learning for Privacy-Preserved Data Sharing in Industrial IoT](https://ieeexplore.ieee.org/abstract/document/8843900?casa_token=3NBPXQV7aBQAAAAA:LVs6iJvMYbrGLmgku4188UUPOv4dND5nHkwvRWjigPeUa1CRQs_DhnSoA0Hene7-IsxSARvJExNcGA).

## How to run?

```
npm install
npm run node1
npm run node2
npm run node3
npm run node4
```

or

```
npm install
CATEGORY='chicken' SECRET='NODE1' HTTP_PORT=3000 P2P_PORT=5000 node app.js
CATEGORY='tiger' SECRET='NODE2' HTTP_PORT=3001 P2P_PORT=5001 PEERS='ws://localhost:5000' node app.js
CATEGORY='lion' SECRET='NODE3' HTTP_PORT=3002 P2P_PORT=5002 PEERS='ws://localhost:5000,ws://localhost:5001' node app.js
CATEGORY='lion' SECRET='NODE4' HTTP_PORT=3003 P2P_PORT=5003 PEERS='ws://localhost:5000,ws://localhost:5001,ws://localhost:5002' node app.js
```

**Then you can use Postman, call REST APIs to interact with the chain at any entry point.**

E.g:
```curl
GET: localhost:3002/blockchain

POST: localhost:3001/request
{
    "data": 6,
    "category": "chicken"
}
```

_Note that you can modify the above commands to create more nodes at the beginning, but you will need to add them to genesis block in blockchain.js and .env file._

## Future works

Currently, I don't handle longest-chain rule forks.The topology which I'm using is fully connected topology. Also, the participants need to request for chains based on longest-chain rule when they restart the node or propose a new block. Let it be available to register new nodes.

## Simple chain

```JSON
[
    {
        "timeStamp": 1660248162680,
        "composer": "Hieu Vo",
        "transactions": [
            {
                "publicKey": "5864f1e7d7e37e95882b398c21ca29b314ebfc6ea1286c8dc1201214cc0d0686",
                "category": "chicken",
                "transactionType": 2
            },
            {
                "publicKey": "276ab32fb62ccc18fcb9c0e792092b9b6911e53b75f951211b232cf84de061bf",
                "category": "tiger",
                "transactionType": 2
            },
            {
                "publicKey": "57072510e8e9c406943c8ffa69a134f2ce1572290056c57e2fe37ca44044faa9",
                "category": "lion",
                "transactionType": 2
            },
            {
                "publicKey": "5e475e334d90c1accb4da890c8a3c4d22d8e9071f0e8e61ece9b07b2e424647c",
                "category": "lion",
                "transactionType": 2
            }
        ],
        "committeeSignature": [],
        "preHash": "",
        "other": "I love Blockchain.",
        "hash": "0xDEADBEEF",
        "composerSignature": "CEEE223A4F8C9C25A90C59E24DE6BFAD1346AD5315BE6DF5181FADCD40DE7B1B012B7D7A092C38C44BB27AEE62FBE0652B81B04EE350F602B25E634BEDE6AF0E"
    },
    {
        "timeStamp": 1660248179530,
        "composer": "57072510e8e9c406943c8ffa69a134f2ce1572290056c57e2fe37ca44044faa9",
        "transactions": [
            {
                "timeStamp": 1660248179283,
                "category": "lion",
                "publicKey": "276ab32fb62ccc18fcb9c0e792092b9b6911e53b75f951211b232cf84de061bf",
                "query": 7,
                "transactionType": 0,
                "hash": "e5ee68a3a9bf7e4364c82f06a4372e307642b392403bee34b01429b41cc1b4d4",
                "signature": "D31839E27AFE99A8DA823AB6FFA34F4AF9E3A2B2D38CBD396CEC0DA22BA0A8F247CDE106C94A3993A6443722CA78765A4719F69A9B7E78C932023014214FB108"
            },
            {
                "publicKey": "5e475e334d90c1accb4da890c8a3c4d22d8e9071f0e8e61ece9b07b2e424647c",
                "timeStamp": 1660248179364,
                "model": {
                    "conten": "empty"
                },
                "transactionType": 1,
                "MAE": 89.59235839858725,
                "retrivalTransaction": {
                    "timeStamp": 1660248179283,
                    "category": "lion",
                    "publicKey": "276ab32fb62ccc18fcb9c0e792092b9b6911e53b75f951211b232cf84de061bf",
                    "query": 7,
                    "transactionType": 0,
                    "hash": "e5ee68a3a9bf7e4364c82f06a4372e307642b392403bee34b01429b41cc1b4d4",
                    "signature": "D31839E27AFE99A8DA823AB6FFA34F4AF9E3A2B2D38CBD396CEC0DA22BA0A8F247CDE106C94A3993A6443722CA78765A4719F69A9B7E78C932023014214FB108"
                },
                "hash": "3bb8b32d34ce2438077fb4e93c70c97662af209427192d547ac19fdbb5ab038b",
                "signature": "F79441F8DF92485F352D38A55649D54EE4906A8AB49943DFBA20FCABFA30B3E8AAE0F8603C9A45C1153B55CF04784590E6E4DAD072512D72CE476230B934D909"
            },
            {
                "publicKey": "57072510e8e9c406943c8ffa69a134f2ce1572290056c57e2fe37ca44044faa9",
                "timeStamp": 1660248179356,
                "model": {
                    "conten": "empty"
                },
                "transactionType": 1,
                "MAE": 63.023051184108155,
                "retrivalTransaction": {
                    "timeStamp": 1660248179283,
                    "category": "lion",
                    "publicKey": "276ab32fb62ccc18fcb9c0e792092b9b6911e53b75f951211b232cf84de061bf",
                    "query": 7,
                    "transactionType": 0,
                    "hash": "e5ee68a3a9bf7e4364c82f06a4372e307642b392403bee34b01429b41cc1b4d4",
                    "signature": "D31839E27AFE99A8DA823AB6FFA34F4AF9E3A2B2D38CBD396CEC0DA22BA0A8F247CDE106C94A3993A6443722CA78765A4719F69A9B7E78C932023014214FB108"
                },
                "hash": "e4173dfd3baaa42c038dc5e89c7d9bac260b584691905e180e5781708e681624",
                "signature": "A5E37256986D960F9381D62B7D90FD983AF72DDFCC6D94CCF04745282C2836C3FF87FDA20E370C9AFBCF35CE0F4BE83AC49E133D4CEF15C54F1504F9C51D6909"
            }
        ],
        "committeeSignature": [
            {
                "publicKey": "5e475e334d90c1accb4da890c8a3c4d22d8e9071f0e8e61ece9b07b2e424647c",
                "signature": "0CDFFFC200D1F45FDC4F4D9769FEBBD24C06F9B17699E6408ACB1FF53D4A8F90E63270E11EC8C5AC0CFD8D2EAB0C5192EE59725695DE3DD1E2D074D8BBDC5D05"
            },
            {
                "publicKey": "57072510e8e9c406943c8ffa69a134f2ce1572290056c57e2fe37ca44044faa9",
                "signature": "D1C195D68CCDC2CE9EE3B9B1F8447096D22B6419A5F285C589387220E58A1A6AF9F555F06F8AF7554D008F116FC40760E0184B70EF3AE241BC1A4F4936FF5A07"
            }
        ],
        "preHash": "0xDEADBEEF",
        "other": "",
        "hash": "1d3eab71def578026e7399b4eeee10fba0d3c51301accade204fdea61f286a4e",
        "composerSignature": "D1C195D68CCDC2CE9EE3B9B1F8447096D22B6419A5F285C589387220E58A1A6AF9F555F06F8AF7554D008F116FC40760E0184B70EF3AE241BC1A4F4936FF5A07"
    },
    {
        "timeStamp": 1660248191940,
        "composer": "276ab32fb62ccc18fcb9c0e792092b9b6911e53b75f951211b232cf84de061bf",
        "transactions": [
            {
                "timeStamp": 1660248191862,
                "category": "tiger",
                "publicKey": "276ab32fb62ccc18fcb9c0e792092b9b6911e53b75f951211b232cf84de061bf",
                "query": 5,
                "transactionType": 0,
                "hash": "41654ecec76765ae104b6c5511202878ccb498501f00ec944cfd0df4dfbda91b",
                "signature": "27AC3E8406F6EFAC6352220392C35C164592363C59F613D5860233E790BCC0CE249AC16D0EEA3A4BE6F6F12640997554AF75F846C3BE35993BD2665645FCE00D"
            },
            {
                "publicKey": "276ab32fb62ccc18fcb9c0e792092b9b6911e53b75f951211b232cf84de061bf",
                "timeStamp": 1660248191886,
                "model": {
                    "conten": "empty"
                },
                "transactionType": 1,
                "MAE": 38.8908541938219,
                "retrivalTransaction": {
                    "timeStamp": 1660248191862,
                    "category": "tiger",
                    "publicKey": "276ab32fb62ccc18fcb9c0e792092b9b6911e53b75f951211b232cf84de061bf",
                    "query": 5,
                    "transactionType": 0,
                    "hash": "41654ecec76765ae104b6c5511202878ccb498501f00ec944cfd0df4dfbda91b",
                    "signature": "27AC3E8406F6EFAC6352220392C35C164592363C59F613D5860233E790BCC0CE249AC16D0EEA3A4BE6F6F12640997554AF75F846C3BE35993BD2665645FCE00D"
                },
                "hash": "f94c5e3ca0384be3f2a24359e87f51f34c72477f4f2735d7fe42b45ab96fe8a2",
                "signature": "FEE7EFFAB1A6AB5BA75E38BCCD0AF5ABD8551892A23ABC7016C2E65C8BF8C06BB5631D97ACB362AB38B3DEA1054ADD8253250E4ECC31FAE3439341BD2D5D2608"
            }
        ],
        "committeeSignature": [
            {
                "publicKey": "276ab32fb62ccc18fcb9c0e792092b9b6911e53b75f951211b232cf84de061bf",
                "signature": "E59120F7FAA8E694F1AB040BB5D5D4C94455EE3688B9B4D030985B80E807E4A2921FBB6225399A09815AF5AB81D68ADE14915E449B9BE1E685D366B66FA51E06"
            }
        ],
        "preHash": "1d3eab71def578026e7399b4eeee10fba0d3c51301accade204fdea61f286a4e",
        "other": "",
        "hash": "5cd2e558f5dcc6e7bdd7dd873105d94f89b034f1a2cbd38bd80caebb8e0187c6",
        "composerSignature": "E59120F7FAA8E694F1AB040BB5D5D4C94455EE3688B9B4D030985B80E807E4A2921FBB6225399A09815AF5AB81D68ADE14915E449B9BE1E685D366B66FA51E06"
    },
    {
        "timeStamp": 1660248202204,
        "composer": "5864f1e7d7e37e95882b398c21ca29b314ebfc6ea1286c8dc1201214cc0d0686",
        "transactions": [
            {
                "timeStamp": 1660248202141,
                "category": "chicken",
                "publicKey": "276ab32fb62ccc18fcb9c0e792092b9b6911e53b75f951211b232cf84de061bf",
                "query": 6,
                "transactionType": 0,
                "hash": "a126e0dbad5ade30bf94c4c524d2de4bc4cf79848f751f0f79c78ea23ee6a3cc",
                "signature": "764519B22895BE9B487AB53556838301827B0F5E4386653CB636E2980EAE1695C8E906863A48CBF9F9B89FA25B36D8F498A95A3B050374996D47E085821C510A"
            },
            {
                "publicKey": "5864f1e7d7e37e95882b398c21ca29b314ebfc6ea1286c8dc1201214cc0d0686",
                "timeStamp": 1660248202151,
                "model": {
                    "conten": "empty"
                },
                "transactionType": 1,
                "MAE": 82.55497554858844,
                "retrivalTransaction": {
                    "timeStamp": 1660248202141,
                    "category": "chicken",
                    "publicKey": "276ab32fb62ccc18fcb9c0e792092b9b6911e53b75f951211b232cf84de061bf",
                    "query": 6,
                    "transactionType": 0,
                    "hash": "a126e0dbad5ade30bf94c4c524d2de4bc4cf79848f751f0f79c78ea23ee6a3cc",
                    "signature": "764519B22895BE9B487AB53556838301827B0F5E4386653CB636E2980EAE1695C8E906863A48CBF9F9B89FA25B36D8F498A95A3B050374996D47E085821C510A"
                },
                "hash": "0236e59dad2131a86c5259e8078d17322a1e39c7bfdfba9f0793a1daa953fdad",
                "signature": "5D23DE1754BA2EE14331D908CADDBF799ABF492C4240F0BB10EE2E9741EEF45BFE33BC109D4DBFA1C21D4C5B1C0CA4CA22FDB09D0C108CAD792E671B14D73B07"
            }
        ],
        "committeeSignature": [
            {
                "publicKey": "5864f1e7d7e37e95882b398c21ca29b314ebfc6ea1286c8dc1201214cc0d0686",
                "signature": "D9B03A0CE54D206CE52B762CE031FEDC9F4BFAD99E6A38B70D3C599C1932B97497B2DD1F9ECA263645E0402B8AAB7587421806ECBA6A8E7656A2253AE66F9301"
            }
        ],
        "preHash": "5cd2e558f5dcc6e7bdd7dd873105d94f89b034f1a2cbd38bd80caebb8e0187c6",
        "other": "",
        "hash": "a1ee7ec043506d25e0b7c1dae9f027a95a88ad2b3402346c296f552478e97d1f",
        "composerSignature": "D9B03A0CE54D206CE52B762CE031FEDC9F4BFAD99E6A38B70D3C599C1932B97497B2DD1F9ECA263645E0402B8AAB7587421806ECBA6A8E7656A2253AE66F9301"
    }
]
```