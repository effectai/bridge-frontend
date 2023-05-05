import Vue from 'vue'
import Web3 from 'web3';
import { pEosioToken } from 'ptokens-peosio-token'
import {
  ChainId,
  pTokensNode,
  pTokensNodeProvider,
  pTokensEosioAssetBuilder,
  pTokensEvmAssetBuilder,
  pTokensSwapBuilder,
} from 'ptokens'

/******************************************************************
 * All of this needs to be moved to the plugin below
 ******************************************************************/

// Set up provider and node to interact with pNetwork
// These should be added to the data() of the Vue instance
// They should be instantiated in the init? or the created method?
const provider = new pTokensNodeProvider(process.env.NUXT_ENV_PTOKEN_NETWORK)
const node = new pTokensNode(provider)

// Create builders for assets and swap.
const eosioBuilder = new pTokensEosioAssetBuilder(node)
const bscBuilder = new pTokensEvmAssetBuilder(node)
const swapBuilder = new pTokensSwapBuilder(node)

// create an eosio asset 
eosioBuilder.setBlockchain(ChainId.EosMainnet)
eosioBuilder.setToken(process.env.NUXT_ENV_PTOKEN) // EFX
const eosioAsset = await eosioBuilder.build()

// create bsc asset
bscBuilder.setBlockchain(ChainId.BscMainnet)
bscBuilder.setToken(process.env.NUXT_ENV_PTOKEN) // EFX
const bscAsset = await bscBuilder.build()

// Swap from EOSIO to BSC
swapBuilder.setFromAsset(eosioAsset)
swapBuilder.setToAsset(bscAsset)
swapBuilder.setAmount(0.000001e18) // 1 EFX
const swapEosToBsc = swapBuilder.build()
// await swap.execute()
//.on('inputTxBroadcasted', (_) => console.info('inputTxBroadcasted', _))
//.on('inputTxConfirmed', (_) => console.info('inputTxConfirmed', _))
//.on('inputTxDetected', (_) => console.info('inputTxDetected', _))
//.on('outputTxDetected', (_) => console.info('outputTxDetected', _))
//.on('outputTxBroadcasted', (_) => console.info('outputTxBroadcasted', _))
//.on('outputTxConfirmed', (_) => console.info('outputTxConfirmed', _))

// Swap from BSC to EOSIO
swapBuilder.setFromAsset(bscAsset)
swapBuilder.setToAsset(eosioAsset)
swapBuilder.setAmount(0.000001e18) // 1 EFX
const swapBscToEos = swapBuilder.build()
// await swap.execute()

/**
 * What do I actually need to expose to the rest of the app?
 * I'm thinking: provider? node? and asset?
 */

/******************************************************************
 * End of stuff that needs to be moved to the plugin below
 ******************************************************************/

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

      resetSwap() {
        this.peos = null;
        this.status = null;
        this.error = null;
        this.statusText = null;
        this.efxAmount = null;
        this.eosTransactionId = null;
        this.bscTransactionId = null;
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
                actor: this.eosWallet.auth.accountName,
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
              // console.log(tx)
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
            this.peos.redeem(Web3.utils.toWei(amount.toString()), this.eosWallet.auth.accountName,
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
              // console.log(tx)
              this.eosTransactionId = tx.id
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
