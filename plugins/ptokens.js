import Vue from 'vue'
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
        progress: null
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
        this.efxAmount = amount
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

        this.status = 'start'
        this.statusText = 'Setup swap...'

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
              this.progress = 25
              this.status = 'progress'
              this.statusText = 'nativeTxConfirmed'        
            })
            .once('nodeReceivedTx', (tx) => {        
              this.progress = 50    
              this.statusText = 'nodeReceivedTx'
            })
            .once('nodeBroadcastedTx', (tx) => {
              this.progress = 75
              this.statusText = 'nodeBroadcastedTx'
            })
            .once('hostTxConfirmed', (tx) => {
              this.progress = 100
              this.statusText = 'hostTxConfirmed'
            })
            .then(() => resolve())
            .catch((_err) =>  {
              this.status = 'failed'
              this.error = _err
              reject(_err)
            })
          })
        await swap()

        this.status = 'finished'
        this.statusText = 'Finished swap'     
      },

      // Haven't been able to test this one, because the minimal swap amount is like 1.000.000.000 EOS or 10?
      // And it can only be tested on mainnet
      // Error I get: 'Impossible to issue less than 1000000000'
      async swapToEos(amount) {
        this.efxAmount = amount
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

        this.status = 'start'
        this.statusText = 'Setup swap...'

        const swap = () =>
          new Promise((resolve, reject) => {
            // TODO: fix redeem? 
            // in the unit tests redeem is structured like this: (ETH -> EOS)
            this.peos.redeem(amount, this.eosWallet.auth.accountName,
              {
                //gasPrice: 100e9,
                gas: 80000
              })
            // handle events
            .once('hostTxBroadcasted', (tx) => {
              this.progress = 25
              this.status = 'progress'
              this.statusText = 'hostTxBroadcasted'
            })
            .once('hostTxConfirmed', (tx) => {
              this.progress = 50
              this.statusText = 'hostTxConfirmed'
            })
            .once('nodeReceivedTx', (tx) => {
              this.progress = 75
              this.statusText = 'nodeReceivedTx'
            })
            .once('nativeTxConfirmed', (tx) => {
              this.progress = 100
              this.statusText = 'nativeTxConfirmed'
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
      }
    }
  })

  inject('ptokens', ptokens)
}
