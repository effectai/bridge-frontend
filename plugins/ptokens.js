import Vue from 'vue'
import BigNumber from "bignumber.js";
import { pEosioToken } from 'ptokens-peosio-token'

export default (context, inject) => {

  const ptokens = new Vue({
    data() {
      return {
        peos: null,
        status: null,
        error: null,
        statusText: null,
        efxAmount: null,
        eosTransactionId: null,
        bscTransactionId: null
      }
    },
    computed: {
      eosWallet() {
        return (context.$eos) ? context.$eos.wallet : null
      },
      bscWallet() {
        return (context.$bsc) ? context.$bsc.wallet : null
      },
    },
    methods: {
      init (currentProvider) {
        this.peos = new pEosioToken({
          blockchain: process.env.NUXT_ENV_BSC,
          network: process.env.NUXT_ENV_BLOCKCHAIN_NETWORK,
          pToken: process.env.NUXT_ENV_PTOKEN,
          ethProvider: currentProvider,
          eosRpc: context.$eos.api.rpc,
          eosSignatureProvider: this.eosWallet.provider.signatureProvider
        })
      },

      async swapToBsc(amount) {
        this.status = 'start'
        this.statusText = 'Setup swap...'
        this.efxAmount = amount
        this.error = null

        if(!this.peos) {
          this.status = 'failed'
          this.error = 'Something went wrong setting up the swap';
          return
        }
        if(!this.eosWallet || !this.bscWallet) {
          this.status = 'failed'
          this.error = 'Connect your wallets first';
          return
        }

        // Check if EOS account exists before contuining
        let validEosAccount = await context.$eos.isValidEosAccount(this.eosWallet.auth.accountName)
        if (!validEosAccount) {
          this.status = 'failed'
          this.error = 'EOS account not found';
          return
        }

        const swap = () =>
          new Promise((resolve, reject) => {
            this.peos.issue(amount, this.bscWallet[0],
              {
                blocksBehind: 3,
                expireSeconds: 60,
                permission: this.eosWallet.auth.permission,
                actor: this.eosWallet.auth.accountName
              })
            // handle events
            .once('nativeTxConfirmed', (tx) => {
              this.eosTransactionId = tx.transaction_id
              this.status = 'progress'
              this.statusText = 'Transaction on EOS confirmed'
            })
            .once('nodeReceivedTx', (tx) => {        
              this.statusText = 'Node received the transaction'
            })
            .once('nodeBroadcastedTx', (tx) => {
              this.statusText = 'Broadcasted transaction'
            })
            .once('hostTxConfirmed', (tx) => {
              this.bscTransactionId = tx.transactionHash
              this.statusText = 'Transaction on BSC confirmed'
            })
            .then(() => resolve())
            .catch((e) =>  {
              this.status = 'failed'
              this.error = e
              reject(e)
            })
          })
        await swap()

        this.status = 'finished'
        this.statusText = 'Finished swap'
      },

      // Haven't been able to test this one, because the minimal swap amount is 1.000.000.000 EFX
      // And it can only be tested on mainnet
      // Error I get: 'Impossible to issue less than 1000000000'
      async swapToEos(amount) {
        this.status = 'start'
        this.statusText = 'Setup swap...'
        this.efxAmount = amount
        this.error = null

        if(!this.peos) {
          this.status = 'failed'
          this.error = 'Something went wrong setting up the swap';
          return
        }
        if(!this.eosWallet || !this.bscWallet) {
          this.status = 'failed'
          this.error = 'Connect your wallets first';
          return
        }

        // Check if EOS account exists before contuining
        let validEosAccount = await context.$eos.isValidEosAccount(this.eosWallet.auth.accountName)
        if (!validEosAccount) {
          this.status = 'failed'
          this.error = 'EOS account not found';
          return
        }

        const swap = () =>
          new Promise((resolve, reject) => {
            this.peos.redeem(BigNumber(amount + 'e18'), this.eosWallet.auth.accountName,
              {
                //gasPrice: 100e9,
                gas: 80000
              })
            // handle events
            .once('hostTxBroadcasted', (tx) => {
              this.status = 'progress'
              this.statusText = 'Broadcasted transaction'
            })
            .once('hostTxConfirmed', (tx) => {
              this.bscTransactionId = tx.transactionHash
              this.statusText = 'Transaction on BSC confirmed'
            })
            .once('nodeReceivedTx', (tx) => {
              this.statusText = 'Node received the transaction'
            })
            .once('nativeTxConfirmed', (tx) => {
              this.eosTransactionId = tx.transaction_id
              this.statusText = 'Transaction on EOS confirmed'
            })
            .then(() => resolve())
            .catch((_err) =>  {
              this.status = 'failed'
              this.statusText = _err
              reject(_err)
            })
          })
        await swap()

        this.status = 'finished'
        this.statusText = 'Completed swap'
      },
    }
  })

  inject('ptokens', ptokens)
}
