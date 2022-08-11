const { DataRetrivalTransaction, DataSharingTransaction } = require("./transactions");
const { RANDOM_BIAS } = require("./config");

class TransactionPool {
    constructor() {
        this.transactions = [];
    }

    addTransaction(transaction) {
        this.transactions.push(transaction);
    }

    transactionExists(transaction) {
        for (let i = 0; i < this.transactions.length; i++) {
            if ((this.transactions[i].hash === transaction.hash) && (!this.transactions[i].isSpent)) return true;
        }
        return false;
        //return this.transactions.find(tx => tx.hash === transaction.hash && !tx.isSpent);
    }

    verifyTransaction(transaction) {
        if (transaction.transactionType == 0) {
            return DataRetrivalTransaction.verify(transaction);
        } else {
            return DataSharingTransaction.verify(transaction);
        }
    }

    deleteTransaction(transactionHash) {
        for (let i = 0; i < this.transactions.length; i++) {
            if (this.transactions[i].hash === transactionHash) {
                this.transactions.splice(i, 1);
                break;
            }
        }
    }

    spentTransaction(transactionHash) {
        for (let i = 0; i < this.transactions.length; i++) {
            if (this.transactions[i].hash === transactionHash) this.transactions[i].isSpent = true;
        }
    }

    countTransactions(retrivalTransactionHash, transactionType, category) {
        let res = 0;
        for (let i = 0; i < this.transactions.length; i++) {
            if (this.transactions[i].isSpent) continue;
            if (this.transactions[i].transactionType === transactionType) {
                if (transactionType === 0 && category === this.transactions[i].category) {
                    res++;
                } else if (transactionType === 1 && this.transactions[i].retrivalTransaction.category === category && this.transactions[i].retrivalTransaction.hash === retrivalTransactionHash) {
                    res++;
                }
            }
        }
        return res;
    }

    transactionType1Exists(transaction) {
        for (let i = 0; i < this.transactions.length; i++) {
            if (this.transactions[i].transactionType !== 1 || this.transactions[i].isSpent) continue;
            if (transaction.publicKey === this.transactions[i].publicKey && transaction.retrivalTransaction.hash === this.transactions[i].retrivalTransaction.hash) {
                return true;
            }
        }
        return false;
    }

    isComposer(retrivalTransactionHash, wallet) {
        let minMAE = RANDOM_BIAS;
        let myMAE;

        for (let i = 0; i < this.transactions.length; i++) {
            if (this.transactions[i].isSpent || this.transactions[i].transactionType !== 1) continue;
            if (this.transactions[i].retrivalTransaction.hash == retrivalTransactionHash) {
                minMAE = Math.min(minMAE, this.transactions[i].MAE);
            }
            if (this.transactions[i].publicKey === wallet.getPublicKey()) {
                myMAE = this.transactions[i].MAE;
            }
        }

        return minMAE === myMAE;
    }

    getAllUnspentTransactions() {
        let txs = [];
        for (let i = 0; i < this.transactions.length; i++) {
            if (!this.transactions[i].isSpent) txs.push(this.transactions[i]);
        }
        return txs;
    }

    getAll() {
        return this.transactions;
    }
}

module.exports = TransactionPool;