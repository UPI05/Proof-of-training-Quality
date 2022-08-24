# Proof of training Quality implementation

Basically, this is my implementation for Proof of training Quality consensus machanism from the article [Blockchain and Federated Learning for Privacy-Preserved Data Sharing in Industrial IoT](https://ieeexplore.ieee.org/abstract/document/8843900).

[Read more about my implementation (vi)](https://drive.google.com/file/d/1gtTIVZfbCKecUr3n1I867sjUi5PXwVhM/view?usp=sharing)

## Setup:

```
npm install
npm run node1
npm run node2
```

or

```
npm install
CATEGORY='chicken' SECRET='NODE1' HTTP_PORT=3000 P2P_PORT=5000 node app.js
CATEGORY='tiger' SECRET='NODE2' HTTP_PORT=3001 P2P_PORT=5001 PEERS='ws://localhost:5000' node app.js
```

_Note that you can change CATEGORY and SECRET but you need to modify the config.js, too._

**Then you can use Postman, call REST APIs to interact with the chain at any entry point.**

E.g:
```curl
GET: localhost:3000/blockchain

POST: localhost:3001/request
{
    "requestData": 15,
    "requestCategory": "chicken"
}
```

## Create a new node

E.g:

```
CATEGORY='lion' SECRET='your_secret_key' HTTP_PORT=3002 P2P_PORT=5002 PEERS='ws://localhost:5000' node app.js
```

Now you have to call REST API to register.

```
POST: localhost:3002/register
{
    "signature": "third party signature, denotes that you have permission to access"
}
```

_Note that PEERS can't be empty. They are alive p2p servers so you have to set at least 1 value._

## Future works

Currently, I don't handle longest-chain rule forks.The topology which I'm using is fully connected.

## Simple chain

```JSON
[
    {
        "timeStamp": "010101010101",
        "msgType": "BlockCommit",
        "category": "chicken",
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
        "timeStamp": 1661296229206,
        "msgType": "BlockCommit",
        "category": "chicken",
        "proposer": "5864f1e7d7e37e95882b398c21ca29b314ebfc6ea1286c8dc1201214cc0d0686",
        "transaction": {
            "messages": [
                {
                    "timeStamp": 1661296184571,
                    "msgType": "DataRetrieval",
                    "publicKey": "57072510e8e9c406943c8ffa69a134f2ce1572290056c57e2fe37ca44044faa9",
                    "category": "lion",
                    "accessSignature": "72D44F1D0117225EBFB324E0CBAE784589E09A84F468A7B601F8E9961237BF40DD270A7F6DDE838644271F8CE594CAC01ADB8A3BFEBC7D0D150C54C762E63C02",
                    "hash": "39250670522874308cfa34e2ec069085b9e6f1ad16cfbc9f5ebfd59a91540c76",
                    "signature": "72C3F19D4DF66BB1A324748D3E919733450D73E6E3A9C39F641481FF1C0A81361BA2DFF0601BCE97BBF5A12DF3D3AF509E3DBB29532B0797AC2A7A0F79DE4D03"
                },
                {
                    "timeStamp": 1661296187604,
                    "msgType": "DataRetrieval",
                    "publicKey": "5e475e334d90c1accb4da890c8a3c4d22d8e9071f0e8e61ece9b07b2e424647c",
                    "category": "lion",
                    "accessSignature": "161D63A43F51DF87BBFFDF5788882318E8A2E03363DC88597EE1300869A7A2D6C51F1BD3B5F053EC89D64C2EDB8949FF60FFCB7E6F8A592134FFE3BB7ECCD10A",
                    "hash": "4c2dfcc592c9bf35d952a19df27d66341a759775987c4f12dbd66f5bb459b0ca",
                    "signature": "7F7A16B57167BA8D5CC8A0A2992201BB08A71CDA761EDBD14070376DD0A7C41B0E217BA820C6BAF81E84499ED7DC9A0C144E371D2151F343D831F867A035830B"
                },
                {
                    "timeStamp": 1661296221077,
                    "msgType": "DataSharingRequest",
                    "publicKey": "276ab32fb62ccc18fcb9c0e792092b9b6911e53b75f951211b232cf84de061bf",
                    "category": "tiger",
                    "requestCategory": "chicken",
                    "requestData": 11,
                    "hash": "1a6fc770a7b37111005d3c5ddd853684e4a59a542efd67b769a823f9b51353ad",
                    "signature": "BBD875AFA686005BCE07E65F88564BD2A161AFA7D85DB903F60546154FF098F7CC66A3763751FAA80C65EECF1BF434DAC75774F22769332BB008FD1C2DF8A109"
                },
                {
                    "timeStamp": 1661296221088,
                    "msgType": "DataSharingResponse",
                    "publicKey": "5864f1e7d7e37e95882b398c21ca29b314ebfc6ea1286c8dc1201214cc0d0686",
                    "category": "chicken",
                    "model": {
                        "conten": "empty"
                    },
                    "MAE": 97.18589011447148,
                    "dataSharingReq": {
                        "timeStamp": 1661296221077,
                        "msgType": "DataSharingRequest",
                        "publicKey": "276ab32fb62ccc18fcb9c0e792092b9b6911e53b75f951211b232cf84de061bf",
                        "category": "tiger",
                        "requestCategory": "chicken",
                        "requestData": 11,
                        "hash": "1a6fc770a7b37111005d3c5ddd853684e4a59a542efd67b769a823f9b51353ad",
                        "signature": "BBD875AFA686005BCE07E65F88564BD2A161AFA7D85DB903F60546154FF098F7CC66A3763751FAA80C65EECF1BF434DAC75774F22769332BB008FD1C2DF8A109"
                    },
                    "hash": "2440795fc830c9791063b4738b0364ca20d39e182671fc57f3ad575dd20c4ff7",
                    "signature": "5187E451BB102B361A8C5EE73A244B513A49565C7EB9780A13AD0F9533F79C001C0110BBD35E25F0FA18ADCC270B7407EA13E0B4BBE5DBBBEAE599577050180D"
                }
            ]
        },
        "preHash": "0xDEADBEEF",
        "other": "",
        "hash": "7552d8428701d1d02964f37c0380b683092b82103c7bda9c8ffb1852d8e88944",
        "signature": "0E1BB67FCFCCB11E46B52C39F7C4E89555C36A296D20DDA06B3FD2053DF6FF0F630DA7E5E4FBDC691DCEADDB34F4B21E435D4C9BBE6D2583CF4FC12EF3748800",
        "committeeSignatures": [
            {
                "publicKey": "5864f1e7d7e37e95882b398c21ca29b314ebfc6ea1286c8dc1201214cc0d0686",
                "signature": "0E1BB67FCFCCB11E46B52C39F7C4E89555C36A296D20DDA06B3FD2053DF6FF0F630DA7E5E4FBDC691DCEADDB34F4B21E435D4C9BBE6D2583CF4FC12EF3748800"
            }
        ]
    },
    {
        "timeStamp": 1661296309077,
        "msgType": "BlockCommit",
        "category": "lion",
        "proposer": "57072510e8e9c406943c8ffa69a134f2ce1572290056c57e2fe37ca44044faa9",
        "transaction": {
            "messages": [
                {
                    "timeStamp": 1661296283145,
                    "msgType": "DataRetrieval",
                    "publicKey": "4da98203c8f04e2d18a44ad2a6a59501dbc5b92d2d2ae21b517147d3d058d8f1",
                    "category": "tiger",
                    "accessSignature": "13350EA7F333235E19D13A55A2B2B03FBFE0980A2440749288B17927F2B90D564B88647A3A5D9F3BB0526209D2AFB81174F1EC0581171C8DC4F64E0737E48F08",
                    "hash": "22cd6f8201478c5d5889b87c0933a025f8d1c60eb0c9c8888c1b9d601bb19823",
                    "signature": "7D73DE8CEB5A10EC8889587FA15F06026FB55BBA441929E0E645378E578A7D89553CF1FD39C54429A4086947927F600C3D4B11AACFAB617998EC6BDF090CF50B"
                },
                {
                    "timeStamp": 1661296300991,
                    "msgType": "DataSharingRequest",
                    "publicKey": "5864f1e7d7e37e95882b398c21ca29b314ebfc6ea1286c8dc1201214cc0d0686",
                    "category": "chicken",
                    "requestCategory": "lion",
                    "requestData": 12,
                    "hash": "2db1288ed5dd684aa0429a8a140c93fae61937cd84861a757e59f5ef8d0d6972",
                    "signature": "A1E5E3A8C24B04008AA9465B6F6E9F757984B4C41621975E1C090BEEC039972DD322491ECAAC3F74F757B84CAA2CC40A03C8AC69B67D160D91DD79354ADC9D0B"
                },
                {
                    "timeStamp": 1661296301006,
                    "msgType": "DataSharingResponse",
                    "publicKey": "57072510e8e9c406943c8ffa69a134f2ce1572290056c57e2fe37ca44044faa9",
                    "category": "lion",
                    "model": {
                        "conten": "empty"
                    },
                    "MAE": 77.71872510436796,
                    "dataSharingReq": {
                        "timeStamp": 1661296300991,
                        "msgType": "DataSharingRequest",
                        "publicKey": "5864f1e7d7e37e95882b398c21ca29b314ebfc6ea1286c8dc1201214cc0d0686",
                        "category": "chicken",
                        "requestCategory": "lion",
                        "requestData": 12,
                        "hash": "2db1288ed5dd684aa0429a8a140c93fae61937cd84861a757e59f5ef8d0d6972",
                        "signature": "A1E5E3A8C24B04008AA9465B6F6E9F757984B4C41621975E1C090BEEC039972DD322491ECAAC3F74F757B84CAA2CC40A03C8AC69B67D160D91DD79354ADC9D0B"
                    },
                    "hash": "a42bcb025d44042459d757834e38d6b4550130be1031ead2ebb4524db83fe7a9",
                    "signature": "C420324FFD6C5D7B4E3A7AFEE5691745E179858767362AEF2739B4ED2AEBDE5ADCB9BD76366F848AABA92CAB2F6A9BF0EE84E4889055F9968319F66A24F93D0F"
                },
                {
                    "timeStamp": 1661296301011,
                    "msgType": "DataSharingResponse",
                    "publicKey": "5e475e334d90c1accb4da890c8a3c4d22d8e9071f0e8e61ece9b07b2e424647c",
                    "category": "lion",
                    "model": {
                        "conten": "empty"
                    },
                    "MAE": 86.0398330536307,
                    "dataSharingReq": {
                        "timeStamp": 1661296300991,
                        "msgType": "DataSharingRequest",
                        "publicKey": "5864f1e7d7e37e95882b398c21ca29b314ebfc6ea1286c8dc1201214cc0d0686",
                        "category": "chicken",
                        "requestCategory": "lion",
                        "requestData": 12,
                        "hash": "2db1288ed5dd684aa0429a8a140c93fae61937cd84861a757e59f5ef8d0d6972",
                        "signature": "A1E5E3A8C24B04008AA9465B6F6E9F757984B4C41621975E1C090BEEC039972DD322491ECAAC3F74F757B84CAA2CC40A03C8AC69B67D160D91DD79354ADC9D0B"
                    },
                    "hash": "98e7a7d64d3ecc9d82206079c9346c9f93e3c8817b2668e797d5995c8598437f",
                    "signature": "ED6F111F23EF5BC1182F1016D95E6EE02D7782F21AC44A3F454FAD700F70DE55D992BDBED3D5E27DEE9632887B99EA19C58F10AE1F8A3024E3CC285293F1FE0D"
                }
            ]
        },
        "preHash": "7552d8428701d1d02964f37c0380b683092b82103c7bda9c8ffb1852d8e88944",
        "other": "",
        "hash": "bb5102ec2ff1e088ad3f852609f36d9adf8ac848ecda747608394057168e1a23",
        "signature": "240EDF1C410EF3C64924EC33DB5A678602DA11F212D64106EAA962DB8154D31545D366CE9A0F9B3B90F5912197CF0C9279C0C32FD781CC17D4D3785EDE0FE004",
        "committeeSignatures": [
            {
                "publicKey": "57072510e8e9c406943c8ffa69a134f2ce1572290056c57e2fe37ca44044faa9",
                "signature": "240EDF1C410EF3C64924EC33DB5A678602DA11F212D64106EAA962DB8154D31545D366CE9A0F9B3B90F5912197CF0C9279C0C32FD781CC17D4D3785EDE0FE004"
            },
            {
                "publicKey": "5e475e334d90c1accb4da890c8a3c4d22d8e9071f0e8e61ece9b07b2e424647c",
                "signature": "19CE10B217B84BAC08748795F80F99EA96069BF4AD83328FA03E778AC40EA7737A31183BE27CA45E867E92EF8E1697450EA9697DE6B591457627449A86D71F05"
            }
        ]
    }
]
```