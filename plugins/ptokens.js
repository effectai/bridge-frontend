import { Api, JsonRpc } from 'eosjs'
import Vue from 'vue'
import { pEosioToken } from 'ptokens-peosio-token'

export default (context, inject) => {
  const ptokens = new Vue({
    data() {
      return {}
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
      async swapToBsc(currentAccount, currentProvider) { 
        const peos = new pEosioToken({
          blockchain: process.env.NUXT_ENV_BSC,
          network: process.env.NUXT_ENV_BLOCKCHAIN_NETWORK, 
          pToken: process.env.NUXT_ENV_PTOKEN,
          ethProvider: currentProvider,
          eosRpc: this.eos.rpc,
          eosSignatureProvider: this.wallet.provider.signatureProvider
        })

        const start = () =>
          new Promise((resolve, reject) => {
            // TODO: amount from input
            peos.issue('0.001', currentAccount[0], 
              { 
                blocksBehind: 3, 
                expireSeconds: 60, 
                permission: 'active',
                actor: this.wallet.auth.accountName
              })
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
        await start()

      },
      async swapToEos(currentAccount, currentProvider) { 
        // TODO
      }
    }
  })

  inject('ptokens', ptokens)
}
