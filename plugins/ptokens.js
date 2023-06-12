import Vue from 'vue'
// import Web3 from 'web3';
// import { pEosioToken } from 'ptokens-peosio-token'
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

        swapExecutor: null,

        peos: null,
        status: null,
        error: null,
        statusText: null,
        efxAmount: null,
        eosTransactionId: null,
        bscTransactionId: null,
        transactions: []
      }
    },
    computed: {
      eosWallet() {
        return (context.$eos) ? context.$eos.wallet : null
      },
      bscWallet() {
        return (context.$bsc) ? context.$bsc.wallet : null
      }
    },
    methods: {
      async initAssets () {
        const provider = new pTokensNodeProvider('https://pnetwork-node-2a.eu.ngrok.io/v3')
        const node = new pTokensNode(provider)

        const bscBuilder = new pTokensEvmAssetBuilder(node)
        bscBuilder
          .setBlockchain(ChainId.BscMainnet)
          .setSymbol('EFX') // EFX
          .setDecimals(18) // the number of decimals in the ERC20 contract
        const bscAsset = await bscBuilder.build()

        const eosioBuilder = new pTokensEosioAssetBuilder(node)
        eosioBuilder
          .setBlockchain(ChainId.EosMainnet)
          .setSymbol('EFX') // EFX
          .setDecimals(4) // the number of decimals in the EOS contract
        const eosioAsset = await eosioBuilder.build()

        this.assets = {
          bscAsset,
          eosioAsset
        }

        return {
          bscAsset,
          eosioAsset
        }
      },
      async init (currentBscProvider) {
        try {
          // Set up provider and node to interact with pNetwork
          const provider = new pTokensNodeProvider('https://pnetwork-node-2a.eu.ngrok.io/v3')
          const node = new pTokensNode(provider)

          // Create builders for assets and swap (swap will be configured later)
          this.swapBuilder = new pTokensSwapBuilder(node)

          // create bsc asset
          const bscProvider = new pTokensEvmProvider(currentBscProvider.currentProvider )

          const bscBuilder = new pTokensEvmAssetBuilder(node)
          bscBuilder
            .setBlockchain(ChainId.BscMainnet)
            .setSymbol('EFX') // EFX
            .setDecimals(18) // the number of decimals in the ERC20 contract
            .setProvider(bscProvider)
          this.bscAsset = await bscBuilder.build()

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
            .setDecimals(4) // the number of decimals in the EOS contract
            .setProvider(eosioProvider)
          this.eosioAsset = await eosioBuilder.build()
        } catch (error) {
          console.error(error)
          throw new Error('Error initializing pTokens. Check your console for more details.')
        }
      },

      resetSwap() {
        this.swapbuilder = null;
        this.eosioAsset = null;
        this.bscAsset = null;

        this.transactions = [];

        this.status = null;
        this.error = null;
        this.statusText = null;
        this.efxAmount = null;
        this.eosTransactionId = null;
        this.bscTransactionId = null;
      },

      async abort () {
        try {
          if (!this.swapExecutor) {
            return
          } else if (window.confirm('Are you sure you want to abort the swap?')) {
            this.swapExecutor.abort()
            this.resetSwap()
          } else {
            return
          }
        } catch (error) {
          console.error(error)
          throw new Error('Error aborting swap. Check your console for more details.')
        }
      },

      async swapEosToBsc(amount) {
        try {
          this.status = 'start'
          this.statusText = 'Setup swap...'
          this.efxAmount = amount
          this.error = null

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
          this.swapBuilder
            .setSourceAsset(this.eosioAsset)
            .addDestinationAsset(this.bscAsset, this.bscWallet)
            .setAmount(amount)
          this.swapExecutor = this.swapBuilder.build()

          // Execute the swap
          await this.swapExecutor.execute()
            .on('inputTxBroadcasted', (tx) => {
              this.eosTransactionId = tx
              console.info('inputTxBroadcasted', tx)
              this.status = 'progress'
              this.statusText = `Transaction broadcasted on EOS. Waiting for confirmation.`
            })
            .on('inputTxConfirmed', (tx) => {
              console.info('inputTxConfirmed', tx)
              this.statusText = `Transaction confirmed on EOS. Waiting for output transaction on BSC.`
            })
            .on('inputTxDetected', (tx) => {
              const [txInfo] = tx
              console.info('inputTxDetected', tx)
              this.statusText = `Input transaction detected on BSC. Waiting for output transaction on BSC.`
            })
            .on('outputTxDetected', (tx) => {
              const [txInfo] = tx
              this.bscTransactionId = txInfo.txHash
              console.info('outputTxDetected', tx)
              this.statusText = `Output transaction detected on BSC. Waiting for output transaction confirmation.`
            })
            .on('outputTxBroadcasted', (tx) => {
              const [txInfo] = tx
              console.info('outputTxBroadcasted', tx)
              this.statusText = `Output transaction broadcasted on BSC. Waiting for output transaction confirmation.`
            })
            .on('outputTxConfirmed', (tx) => {
              const [txInfo] = tx
              console.info('outputTxConfirmed', tx)
              this.statusText = `Output transaction confirmed on BSC. Waiting for swap to finish.`
            })
            .then((tx) => {
              const [txInfo] = tx

              this.status = 'finished'
              this.statusText = `Swap finished!.`
            })
        } catch (error) {
          console.error(error)
          this.status = 'failed'
          this.error = error
        }
      },

      async swapBscToEos(amount) {
        try {

          this.status = 'start'
          this.statusText = 'Setup swap...'
          this.efxAmount = amount
          this.error = null

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
          this.swapBuilder
            .setSourceAsset(this.bscAsset)
            .addDestinationAsset(this.eosioAsset, this.eosWallet.auth.accountName)
            .setAmount(amount)
          this.swapExecutor = this.swapBuilder.build()

          // Execute the swap
          await this.swapExecutor.execute()
            .on('inputTxBroadcasted', (tx) => {
              console.info('inputTxBroadcasted', tx)
              this.bscTransactionId = tx
              this.status = 'progress'
              this.statusText = 'Waiting for confirmation.'
            })
            .on('inputTxConfirmed', (tx) => {
              console.info('inputTxConfirmed', tx)
              this.statusText = 'Transaction on BSC confirmed.'
            })
            .on('inputTxDetected', (tx) => {
              console.info('inputTxDetected', tx)
              this.statusText = 'Input transaction detected on EOS.'
            })
            .on('outputTxDetected', (tx) => {
              console.info('outputTxDetected', tx)
              const { txHash } = tx[0]
              this.eosTransactionId = txHash
              this.statusText = 'Output Transaction detected on EOS.'
            })
            .on('outputTxBroadcasted', (tx) => {
              console.info('outputTxBroadcasted', tx)
              this.statusText = 'Transaction broadcasted on EOS.'
            })
            .on('outputTxConfirmed', (tx) => {
              console.info('outputTxConfirmed', tx)
              this.statusText = 'Transaction confirmed on EOS.'
            })
            .then((tx) => {
              console.info('Swap finished', tx)
              this.status = 'finished'
              this.statusText = 'Finished swap'
            })
        } catch (error) {
          console.error(error)
          this.status = 'failed'
          this.error = error
        }
      }
    }
  })

  inject('ptokens', ptokens)
}
