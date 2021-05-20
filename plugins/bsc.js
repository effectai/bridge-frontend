import Vue from 'vue'
/**
 * When using the walletconnect protocol we need to make sure to use the custom requests.
 * https://docs.binance.org/walletconnect.html
 */
import WalletConnectProvider from "@walletconnect/web3-provider";
import QRCodeModal from "@walletconnect/qrcode-modal";

const walletProvider = new WalletConnectProvider({
  chainId: 1, // For some reason chainID needs to be 1.
  rpc: {
    1: process.env.NUXT_ENV_BSC_RPC
  },
  bridge: "https://bridge.walletconnect.org", // redundant?
  qrcode: true, // redundant?
  qrcodeModal: QRCodeModal, //redundant?
  qrcodeModalOptions: {
    mobileLinks: ["metamask", "trust", "rainbow", "argent"]
  }
})

export default (context, inject) => {
  const bsc = new Vue({
    data() {
      return {
        explorer: process.env.NUXT_ENV_BLOCKEXPLORER,
        wallet: null,
        loginModal: false,
        efxAvailable: null,
        updater: null,
        transaction: null,
        transactionError: null,
        metamask: window.ethereum || null,
        binance: window.BinanceChain || null,
        walletConnect: walletProvider || null, //connect to mobile wallet; trust, metamask, ...
        walletProvider: walletProvider || null,
        walletConnected: null, // Does it make sense to do this at the beginning?
        currentProvider: null
      }
    },
    created() {
      this.updater = setInterval(() => {
        this.updateAccount()
      }, 10000)
    },
    beforeDestroy() {
      clearInterval(this.updater)
    },

    methods: {
      async login(provider) {
        const providers = accessContext.getWalletProviders()
        const selectedProvider = providers.find(r => r.id === provider)
        const wallet = accessContext.initWallet(selectedProvider)
        await wallet.connect()
        await wallet.login()

        this.wallet = wallet
        this.updateAccount()
      },

      async logout() {
        if (this.currentProvider) {
          // TODO: figure out how to properly disconnect
          // This method is accesible on the WalletConnectProvider interface.
          // await this.currentProvider.disconnect();
        }
        this.clear()
      },

      updateAccount() {
        if (this.wallet) {
          this.getAccountBalance()
        }
      },

      clear() {
        this.clearTransaction()
        Object.assign(this.$data, this.$options.data.call(this))
      },

      async getAccountBalance() {
        if (this.wallet) {
            this.efxAvailable = -1 // TODO: get bsc balance
        }
      },

      handleTransaction(actions) {
        this.clearTransaction()

        // TODO: handle bsc transaction
      },

      clearTransaction() {
        this.transaction = null
        this.transactionError = null
      },
      async onMetaMaskConnect() {
        try {
          console.log('Connecting MetaMask')
          this.registerProviderListener(this.metamask)
          this.wallet = await this.currentProvider.request({
            method: 'eth_requestAccounts'
          })
        } catch (mmError) {
          console.error(mmError)
          if (mmError.code === 4001) { //User rejected request:: EIP-1193
            alert("Please connect to metamask.")
          }
        }
      },

      async onBinanceConnect() {
        try {
          console.log('Connecting Binance')
          this.registerProviderListener(this.binance)
          this.wallet = await this.currentProvider.request({
            method: 'eth_requestAccounts'
          })
        } catch (bscError) {
          console.error(bscError)
        }
      },

      async onWalletConnectWeb3() {

        try {
          this.registerProviderListener(walletProvider)
          console.log('Does this work here?')
          // Launches QR-Code Modal
          await walletProvider.enable()

          //Integrate dapp with the provider
          // const web3 = new Web3(walletConnectProvider)

        } catch (walletConnectError) {
          console.error(walletConnectError)
        }
      },

      // Handle when the user changes their account number
      async handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
          // MetaMask is locked or the user has not connected any accounts
          console.log('Please connect to MetaMask.');
        } else if (accounts[0] !== this.wallet) {
          this.wallet = accounts[0];
        }
      },

      /**
       * Method to add the correct chain to the wallet of the user.
       * method `wallet_addEthereumChain` is not supported on the BinanceChain rpc provider.
       * We cannot add or remove chains with the Binance Chain wallet.
       *
       * But it is currenlty implemented for Metamask
       * https://docs.metamask.io/guide/rpc-api.html#wallet-addethereumchain
       */
      async addChain() {
        const chainId = await this.getCurrentChainNetwork();

        if (chainId != process.env.NUXT_ENV_BSC_HEX_ID) {
          try {

            if (this.currentProvider == this.metamask) {

              // Create BSC network configuration object.
              const chainObject = {
                chainId: process.env.NUXT_ENV_BSC_HEX_ID,
                chainName: process.env.NUXT_ENV_CHAIN_NAME,
                nativeCurrency: {
                  name: process.env.NUXT_ENV_TOKEN_NAME,
                  symbol: process.env.NUXT_ENV_TOKEN_SYMBOL,
                  decimals: 18
                },
                rpcUrls: [process.env.NUXT_ENV_BSC_RPC],
                blockExplorerUrls: [process.env.NUXT_ENV_BLOCKEXPLORER]
              }
              // This method is only available for metamask right now.
              const updatedChainId = await this.currentProvider.request({
                method: 'wallet_addEthereumChain',
                params: [chainObject]
              })

              if (updatedChainId) {
                console.log(updatedChainId)
              }
            } else {
              // Notify the user to change the chain they are on manually.
              alert(`Please update the current chain in your wallet.`)
              return
            }

          } catch (addChainError) {
            console.error(addChainError)
          }
        }

      },

      /**
       * Retrieve current network the wallet is listening to. can be testnet or mainnet of either bsc or ethereum for example.
       */
      async getCurrentChainNetwork() {
        try {
          return await this.currentProvider.request({method: 'eth_chainId'})
        } catch (error) {
          console.error(error)
          console.log('Error requesting currentChain')
        }
      },

      /**
       * Method for registering and provider with a web3 object
       */
      async registerWeb3(provider) {
        console.debug(`web3 here.`)
        const web3 = new Web3(provider)
        return web3
      },

      /**
       * Assign provider to currentProvider, and register eventlisteners.
       *
       */
      async registerProviderListener(provider) {
        // assign provider to this.currentProvider, there are differenct provider objects
        this.currentProvider = provider

        // Change boolean of walletconnected status
        this.walletConnected = true

        // Connection status does not refer to connection with wallet
        // it just means that connection with provider is available and thus requests can be made to it.

        // Connected, requests can be made to provider.
        this.currentProvider.on('connect', () => {
          console.log('Connecting')
          this.walletConnected = true
        })

        // Disconnected, requests can no longer be made with provider.
        this.currentProvider.on('disconnect', () => {
          console.log('Diconnecting')
          this.walletConnected = false
        })

        // Inform user of account change, only one account can be selected
        this.currentProvider.on('accountsChanged', (newAccount) => {
          console.log("Changing selected account")
          this.wallet = newAccount
        })

        // Inform user of chain change
        this.currentProvider.on('chainChanged', (_chainId) => {
          if (_chainId != process.env.NUXT_ENV_BSC_HEX_ID) {
            alert(`Please switch to the correct chain: Binance Smart Chain, Mainnet, chainId: ${process.env.NUXT_ENV_BSC_NETWORK_ID}`)
          }
        })

        this.addChain()

      }
    }
  })

  inject('bsc', bsc)
}
