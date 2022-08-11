const utils = require("./utils")
const Block = require("./block");
const Wallet = require("./wallet");

const dotenv = require("dotenv").config();

class Blockchain {
    constructor(wallet) {
        this.wallet = wallet;
        this.chain = [this.genesis()];
    }

    genesis() {
        const composer = "Hieu Vo";
        const other = "I love Blockchain.";
        const transactions = [
            {
                publicKey: new Wallet(process.env.NODE1_SECRET).getPublicKey(),
                category: process.env.NODE1_CATEGORY,
                transactionType: 2
            },
            {
                publicKey: new Wallet(process.env.NODE2_SECRET).getPublicKey(),
                category: process.env.NODE2_CATEGORY,
                transactionType: 2
            },
            {
                publicKey: new Wallet(process.env.NODE3_SECRET).getPublicKey(),
                category: process.env.NODE3_CATEGORY,
                transactionType: 2
            },
            {
                publicKey: new Wallet(process.env.NODE4_SECRET).getPublicKey(),
                category: process.env.NODE4_CATEGORY,
                transactionType: 2
            }
        ];
        return new Block({ composer, other, transactions, genesis: true }, this.wallet);
    }

    show() {
        this.chain.forEach(block => {
            console.info(block);
        });
    }

    updateLastBLock(block) {
        this.chain[this.chain.length - 1] = block;
    }

    countCommitteeNodes(category) {
        let res = 0;
        for (let i = 0; i < this.chain.length; i++) {
            for (let j = 0; j < this.chain[i].transactions.length; j++) {
                if (this.chain[i].transactions[j].transactionType === 2 && this.chain[i].transactions[j].category === category) res++;
            }
        }
        return res;
    }

    getCategoryFromPublicKey(publicKey) {
        let res = "";
        for (let i = 0; i < this.chain.length; i++) {
            for (let j = 0; j < this.chain[i].transactions.length; j++) {
                if (this.chain[i].transactions[j].transactionType == 2) {
                    if (this.chain[i].transactions[j].publicKey === publicKey) {
                        return this.chain[i].transactions[j].category;
                    }
                }
            }
        }
    }

    getAll() {
        return this.chain;
    }
}

module.exports = Blockchain;