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
        "timeStamp": "010101010101",
        "msgType": "BlockVerifyRequest",
        "category": "lion",
        "proposer": "Hieu Vo",
        "transaction": {
            "messages": [
                {
                    "publicKey": "5864f1e7d7e37e95882b398c21ca29b314ebfc6ea1286c8dc1201214cc0d0686",
                    "category": "chicken",
                    "msgType": "DataRetrieval"
                },
                {
                    "publicKey": "276ab32fb62ccc18fcb9c0e792092b9b6911e53b75f951211b232cf84de061bf",
                    "category": "tiger",
                    "msgType": "DataRetrieval"
                }
            ]
        },
        "preHash": "",
        "other": {
            "registerPublicKey": "d0233e2fbc91aeb97d462d71b05b6522a01c838249fb93b0ac57bb6965062cb4"
        },
        "hash": "0xDEADBEEF",
        "signature": "VH"
    },
    {
        "timeStamp": 1661235210988,
        "msgType": "BlockCommit",
        "category": "tiger",
        "proposer": "276ab32fb62ccc18fcb9c0e792092b9b6911e53b75f951211b232cf84de061bf",
        "transaction": {
            "messages": [
                {
                    "timeStamp": 1661235102770,
                    "msgType": "DataRetrieval",
                    "publicKey": "57072510e8e9c406943c8ffa69a134f2ce1572290056c57e2fe37ca44044faa9",
                    "category": "lion",
                    "accessSignature": "72D44F1D0117225EBFB324E0CBAE784589E09A84F468A7B601F8E9961237BF40DD270A7F6DDE838644271F8CE594CAC01ADB8A3BFEBC7D0D150C54C762E63C02",
                    "hash": "232a6a549bc9f258efe40ca17bb01a91c23371c11ccce7ba3a339f9ddaecec82",
                    "signature": "B6C6F0E81BE9DABCC0FA922FDB60D93E9B6E8AC28D77F357A4B6EABE2D1C23355D3916DF9D93F637679FBCC8B2816ABA8215F69019782643202F519E9EB95506",
                    "isSpent": false
                },
                {
                    "timeStamp": 1661235205842,
                    "msgType": "DataSharingRequest",
                    "publicKey": "276ab32fb62ccc18fcb9c0e792092b9b6911e53b75f951211b232cf84de061bf",
                    "category": "tiger",
                    "query": 8,
                    "hash": "1306dcb003a2e2c8ebba3f6d8f9c191073032b3cf710f07e535644b9940d27d5",
                    "signature": "1866D11BF8428A610449AFF104FE2D2FE4FF610994BB1F19CDF8B5964FCED1BDC63D88F2B1397DD338085249D4F20E92B8D792BAA53D02FCC5EC4D85CD5A9102"
                },
                {
                    "timeStamp": 1661235205883,
                    "msgType": "DataSharingResponse",
                    "publicKey": "276ab32fb62ccc18fcb9c0e792092b9b6911e53b75f951211b232cf84de061bf",
                    "category": "tiger",
                    "model": {
                        "conten": "empty"
                    },
                    "MAE": 86.62302204712786,
                    "dataSharingReq": {
                        "timeStamp": 1661235205842,
                        "msgType": "DataSharingRequest",
                        "publicKey": "276ab32fb62ccc18fcb9c0e792092b9b6911e53b75f951211b232cf84de061bf",
                        "category": "tiger",
                        "query": 8,
                        "hash": "1306dcb003a2e2c8ebba3f6d8f9c191073032b3cf710f07e535644b9940d27d5",
                        "signature": "1866D11BF8428A610449AFF104FE2D2FE4FF610994BB1F19CDF8B5964FCED1BDC63D88F2B1397DD338085249D4F20E92B8D792BAA53D02FCC5EC4D85CD5A9102"
                    },
                    "hash": "189e831b0fb1f2a43283007abfd7aa4789b0f6503e6789aa33b4eda97d05c489",
                    "signature": "05E0916EBA9934A131337835CE7EF59AC7AE62A337E2494D296121CA1331BC251383BE9BCA14D799C161F16B9BE6A0AA03904364CC4CE58F74C5ED8133D8A90A",
                    "isSpent": false
                }
            ]
        },
        "preHash": "0xDEADBEEF",
        "other": "",
        "hash": "ec6fa0270c566ac88f72c47ce0389336082532b443265f90e7892c7e0aab859c",
        "signature": "78ED5562A99EF1B69DC6C40F4D1E70BF67FF60EAFCE1BC44D5C3019DDA04363D2AF425347B25CCA7B4BDEE4CF176DFFA330ACE0184E932E2C85A0D79ECECDE09",
        "isSpent": false,
        "committeeSignatures": [
            {
                "publicKey": "276ab32fb62ccc18fcb9c0e792092b9b6911e53b75f951211b232cf84de061bf",
                "signature": "78ED5562A99EF1B69DC6C40F4D1E70BF67FF60EAFCE1BC44D5C3019DDA04363D2AF425347B25CCA7B4BDEE4CF176DFFA330ACE0184E932E2C85A0D79ECECDE09"
            }
        ]
    },
    {
        "timeStamp": 1661235271107,
        "msgType": "BlockCommit",
        "category": "tiger",
        "proposer": "276ab32fb62ccc18fcb9c0e792092b9b6911e53b75f951211b232cf84de061bf",
        "transaction": {
            "messages": [
                {
                    "timeStamp": 1661235265998,
                    "msgType": "DataSharingRequest",
                    "publicKey": "276ab32fb62ccc18fcb9c0e792092b9b6911e53b75f951211b232cf84de061bf",
                    "category": "tiger",
                    "query": 8,
                    "hash": "128c95912492bb2b56cc43c6cae2b24d352410e557297ba61d0f5067b45aa636",
                    "signature": "5B49DE66CA3A3A2D7FFB72D0390C733CC14F537161A7FB5270201C9C064AAFB044AFFDFD291767281700C535D22CCD6EFA04566707B533B67FDBD59C79A4D105"
                },
                {
                    "timeStamp": 1661235266027,
                    "msgType": "DataSharingResponse",
                    "publicKey": "276ab32fb62ccc18fcb9c0e792092b9b6911e53b75f951211b232cf84de061bf",
                    "category": "tiger",
                    "model": {
                        "conten": "empty"
                    },
                    "MAE": 96.00629204321474,
                    "dataSharingReq": {
                        "timeStamp": 1661235265998,
                        "msgType": "DataSharingRequest",
                        "publicKey": "276ab32fb62ccc18fcb9c0e792092b9b6911e53b75f951211b232cf84de061bf",
                        "category": "tiger",
                        "query": 8,
                        "hash": "128c95912492bb2b56cc43c6cae2b24d352410e557297ba61d0f5067b45aa636",
                        "signature": "5B49DE66CA3A3A2D7FFB72D0390C733CC14F537161A7FB5270201C9C064AAFB044AFFDFD291767281700C535D22CCD6EFA04566707B533B67FDBD59C79A4D105"
                    },
                    "hash": "69df64292df09e3911b1a694b8639f17421bb09746db8519999d0280c34afb8f",
                    "signature": "40967AD01DB07ED40854D8D5A137B0A9F6FC5FD412E5C21621323C78F6F43CA8376583C49A83AACD01F3DBDC6723B42015149EF0E410FB14447E2F9486A2CA06",
                    "isSpent": false
                }
            ]
        },
        "preHash": "ec6fa0270c566ac88f72c47ce0389336082532b443265f90e7892c7e0aab859c",
        "other": "",
        "hash": "70ba8e35084a6dc4cc431851360022bad9f5a6d07746e741f643e80bc5bd6006",
        "signature": "5B1BF7F4ABE26F7B55E3E94400E988327B9895CAB1E484C2AEDC1A42EBB66A71935D3657A04464C63124AE87CEECDAA62F2C1638A151B4264D3621AF26062005",
        "isSpent": false,
        "committeeSignatures": [
            {
                "publicKey": "276ab32fb62ccc18fcb9c0e792092b9b6911e53b75f951211b232cf84de061bf",
                "signature": "5B1BF7F4ABE26F7B55E3E94400E988327B9895CAB1E484C2AEDC1A42EBB66A71935D3657A04464C63124AE87CEECDAA62F2C1638A151B4264D3621AF26062005"
            }
        ]
    }
]
```