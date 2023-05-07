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

  pTokensEvmProvider,
  pTokensEosioProvider
} from 'ptokens'
import { providers } from 'web3modal';

/******************************************************************
 * All of this needs to be moved to the plugin below
 ******************************************************************/

// Set up provider and node to interact with pNetwork
// These should be added to the data() of the Vue instance
// They should be instantiated in the init? or the created method?
// const provider = new pTokensNodeProvider(process.env.NUXT_ENV_PTOKEN_NETWORK)
// const node = new pTokensNode(provider)

// // Create builders for assets and swap.
// const eosioBuilder = new pTokensEosioAssetBuilder(node)
// const bscBuilder = new pTokensEvmAssetBuilder(node)
// const swapBuilder = new pTokensSwapBuilder(node)

// // create an eosio asset
// eosioBuilder.setBlockchain(ChainId.EosMainnet)
// eosioBuilder.setSymbol(process.env.NUXT_ENV_PTOKEN) // EFX
// const eosioAsset = await eosioBuilder.build()

// // create bsc asset
// bscBuilder.setBlockchain(ChainId.BscMainnet)
// bscBuilder.setSymbol(process.env.NUXT_ENV_PTOKEN) // EFX
// const bscAsset = await bscBuilder.build()

// // Swap from EOSIO to BSC
// swapBuilder.setFromAsset(eosioAsset)
// swapBuilder.setToAsset(bscAsset)
// swapBuilder.setAmount(0.000001e18) // 1 EFX
// const swapEosToBsc = swapBuilder.build()
// // await swap.execute()
// //.on('inputTxBroadcasted', (_) => console.info('inputTxBroadcasted', _))
// //.on('inputTxConfirmed', (_) => console.info('inputTxConfirmed', _))
// //.on('inputTxDetected', (_) => console.info('inputTxDetected', _))
// //.on('outputTxDetected', (_) => console.info('outputTxDetected', _))
// //.on('outputTxBroadcasted', (_) => console.info('outputTxBroadcasted', _))
// //.on('outputTxConfirmed', (_) => console.info('outputTxConfirmed', _))

// // Swap from BSC to EOSIO
// swapBuilder.setFromAsset(bscAsset)
// swapBuilder.setToAsset(eosioAsset)
// swapBuilder.setAmount(0.000001e18) // 1 EFX
// const swapBscToEos = swapBuilder.build()
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
        provider: null,
        node: null,
        eosiobuilder: null,
        bscbuilder: null,
        swapbuilder: null,
        eosioAsset: null,
        bscAsset: null,

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
    created() {

    },
    methods: {
      async init (currentBscProvider) {
        try {
          // Set up provider and node to interact with pNetwork
          const provider = new pTokensNodeProvider('https://pnetwork-node-2a.eu.ngrok.io/v3')
          const node = new pTokensNode(provider)
          
          // Create builders for assets and swap (swap will be configured later)
          this.swapBuilder = new pTokensSwapBuilder(node)
          
          // create bsc asset
          const bscProvider = new pTokensEvmProvider('https://bsc-dataseed3.binance.org')
          const bscBuilder = new pTokensEvmAssetBuilder(node)
          bscBuilder
            .setBlockchain(ChainId.BscMainnet)
            .setSymbol('EFX') // EFX
            .setDecimals(4)
            .setProvider(bscProvider)
          console.info('Creating BSC asset', bscBuilder)
          this.bscAsset = await bscBuilder.build()
          console.log('BSC asset created', this.bscAsset)
          
          // create an eosio asset 
          const eosioProvider = new pTokensEosioProvider(
            'https://eos.greymass.com',
            this.eosWallet.provider.signatureProvider
          )
          eosioProvider.setActor(this.eosWallet.accountInfo.account_name)

          const eosioBuilder = new pTokensEosioAssetBuilder(node)
          eosioBuilder
            .setBlockchain(ChainId.EosMainnet)
            .setSymbol('EFX') // EFX
            .setDecimals(4)
            .setProvider(eosioProvider)
          console.info('Creating EOSIO asset')
          this.eosioAsset = await eosioBuilder.build()
          console.log('EOSIO asset created', eosioBuilder)

        } catch (error) {
          console.error(error)
          throw new Error('Error initializing pTokens. Check your console for more details.')
        }
      },

      resetSwap() {
        this.swapbuilder = null;
        this.eosioAsset = null;
        this.bscAsset = null;

        this.status = null;
        this.error = null;
        this.statusText = null;
        this.efxAmount = null;
        this.eosTransactionId = null;
        this.bscTransactionId = null; 
      },

      async swapEosToBsc(amount) {
        this.status = 'start'
        this.statusText = 'Setup swap...'
        this.efxAmount = amount
        this.error = null

        console.debug(
          'Starting swap, swap eos to bsc',
          'swapBuilder', this.swapBuilder,
          'eosioAsset', this.eosioAsset,
          'bscAsset', this.bscAsset,
        )

        // Check if ptokens is initialized
        if(!this.eosioAsset || !this.bscAsset) {
          this.status = 'failed'
          this.error = 'Something went wrong setting up the swap';
          return
        }

        // Check if wallets are connected
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

        // Build the swap
        console.debug(
          'Building swap', 
          'eosioAsset', this.eosioAsset, 
          'bscAsset', this.bscAsset, 
          'amount', amount, 
          'bscWallet', this.bscWallet
        )
        this.swapBuilder
          .setSourceAsset(this.eosioAsset)
          .addDestinationAsset(this.bscAsset, this.bscWallet)
          .setAmount(amount)
        const swap = this.swapBuilder.build()
        console.debug('Swap built', swap)

        console.debug('Executing swap')
        // Execute the swap
        await swap.execute()
          .on('inputTxBroadcasted', (tx) => {
            console.info('inputTxBroadcasted', tx)
            this.status = 'progress'
            this.statusText = 'Waiting for confirmation.'
          })
          .on('inputTxConfirmed', (tx) => {
            console.info('inputTxConfirmed', tx)
            this.statusText = 'Transaction on EOS confirmed.'
          })
          .on('inputTxDetected', (tx) => {
            console.info('inputTxDetected', tx)
            this.statusText = 'Input transaction detected on BSC.'
          })
          .on('outputTxDetected', (tx) => {
            console.info('outputTxDetected', tx)
            this.statusText = 'Output Transaction detected on BSC.'
          })
          .on('outputTxBroadcasted', (tx) => {
            console.info('outputTxBroadcasted', tx)
            this.statusText = 'Transaction broadcasted on BSC.'
          })
          .on('outputTxConfirmed', (tx) => {
            console.info('outputTxConfirmed', tx)
            this.statusText = 'Transaction confirmed on BSC.'
          })
          .then((tx) => {
            console.info('Swap finished', tx)
            this.status = 'finished'
            this.statusText = 'Finished swap'
          })
          .catch((error) => {
            console.error(error)
            this.status = 'failed'
            this.error = error
          })
      },

      async swapBscToEos(amount) {
        this.status = 'start'
        this.statusText = 'Setup swap...'
        this.efxAmount = amount
        this.error = null

        // Check if ptokens is initialized
        if(!this.swapbuilder || !this.eosioAsset || !this.bscAsset) {
          this.status = 'failed'
          this.error = 'Something went wrong setting up the swap';
          return
        }

        // Check if wallets are connected
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

        // Build the swap
        this.swapBuilder
          .setFromAsset(this.bscAsset)
          .addDestinationAsset(this.eosioAsset, this.eosWallet.auth.accountName)
          .setAmount(amount)
        const swap = this.swapBuilder.build()

        // Execute the swap
        await swap.execute()
          .on('inputTxBroadcasted', (_) => {
            console.info('inputTxBroadcasted', _)
            this.status = 'progress'
            this.statusText = 'Waiting for confirmation.'
          })
          .on('inputTxConfirmed', (_) => {
            console.info('inputTxConfirmed', _)
            this.statusText = 'Transaction on BSC confirmed.'
          })
          .on('inputTxDetected', (_) => {
            console.info('inputTxDetected', _)
            this.statusText = 'Input transaction detected on EOS.'
          })
          .on('outputTxDetected', (_) => {
            console.info('outputTxDetected', _)
            this.statusText = 'Output Transaction detected on EOS.'
          })
          .on('outputTxBroadcasted', (_) => {
            console.info('outputTxBroadcasted', _)
            this.statusText = 'Transaction broadcasted on EOS.'
          })
          .on('outputTxConfirmed', (_) => {
            console.info('outputTxConfirmed', _)
            this.statusText = 'Transaction confirmed on EOS.'
          })
          .catch((error) => {
            console.error(error)
            this.status = 'failed'
            this.error = error
          })

        this.status = 'finished'
        this.statusText = 'Finished swap'
      }
    }
  })

  inject('ptokens', ptokens)
}
