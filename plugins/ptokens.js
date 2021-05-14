import Vue from 'vue'
import { pEosioToken } from 'ptokens-peosio-token'

export default (context, inject) => {

  const ptokens = new Vue({
    data() {
      return {
        peos: null,
        currentAccount: null,
      }
    },
    computed: {
      eos () {
        return context.$eos
      },
      wallet() {
        return (context.$wallet) ? context.$wallet.wallet : null
      },
    },
    methods: {
      init (currentProvider, currentAccount) {
        this.currentAccount = currentAccount
        this.peos = new pEosioToken({
          blockchain: process.env.NUXT_ENV_BSC,
          network: process.env.NUXT_ENV_BLOCKCHAIN_NETWORK, 
          pToken: process.env.NUXT_ENV_PTOKEN,
          ethProvider: currentProvider,
          eosRpc: this.eos.rpc,
          eosSignatureProvider: this.wallet.provider.signatureProvider
        })
      },

      async swapToBsc() { 
        if(!this.peos || !this.currentAccount) {
          console.error('init peos first');
        }

        const swap = () =>
          new Promise((resolve, reject) => {
            // TODO: amount from input
            this.peos.issue('0.001', this.currentAccount[0], 
              { 
                blocksBehind: 3, 
                expireSeconds: 60, 
                permission: 'active',
                actor: this.wallet.auth.accountName
              })
            // handle events
            .once('nativeTxConfirmed', () => {
              console.log('nativeTxConfirmed')
            })
            .once('nodeReceivedTx', () => {
              console.log('nodeReceivedTx')
            })
            .once('nodeBroadcastedTx', () => {
              console.log('nodeBroadcastedTx')
            })
            .once('hostTxConfirmed', () => {
              console.log('hostTxConfirmed')
            })
            .then(() => resolve())
            .catch(_err => reject(_err))
          })
        await swap()

      },

      // Haven't been able to test this one, because the minimal swap amount is like 1.000.000 EOS or something. 
      // And it can only be tested on mainnet
      // Error I get: 'Impossible to issue less than 1000000'
      async swapToEos() { 
        if(!this.peos || !this.currentAccount) {
          console.error('init peos first');
        }

        const swap = () =>
          new Promise((resolve, reject) => {
            // TODO: amount from input
            this.peos.redeem('0.001', this.wallet.auth.accountName, 
              { 
                blocksBehind: 3, 
                expireSeconds: 60, 
                permission: 'active',
                actor: this.wallet.auth.accountName
              })
            // handle events
            .once('nativeTxConfirmed', () => {
              console.log('nativeTxConfirmed')
            })
            .once('nodeReceivedTx', () => {
              console.log('nodeReceivedTx')
            })
            .once('nodeBroadcastedTx', () => {
              console.log('nodeBroadcastedTx')
            })
            .once('hostTxConfirmed', () => {
              console.log('hostTxConfirmed')
            })
            .then(() => resolve())
            .catch(_err => reject(_err))
          })
        await swap()
      }
    }
  })

  inject('ptokens', ptokens)
}
