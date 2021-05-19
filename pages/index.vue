<template>
  <section class="section">
    <div class="container">
      <div class="has-text-centered">
        <h2 class="title">Welcome to the Effect Bridge</h2>
        <div class="columns is-centered my-6" v-if="!wallet || currentAccount.length == 0">
          <div class="field is-grouped">
            <!-- EOS -->
            <p class="control">
              <a v-if="!wallet" class="button is-secondary" @click="$wallet.loginModal = true">
                <strong>Connect EOS 🖖</strong>
              </a>
            </p>
            <p class="control">
              <a v-if="currentAccount.length == 0" class="button is-secondary" @click="this.toggleBSCModal">
                <strong>Connect BSC 🔌</strong>
              </a>
            </p>
          </div>
        </div>

        <div class="mb-6">
          <h4 v-if="wallet" class="subtitle">Connected EOS account: {{ wallet.auth.accountName }}</h4>

          <div v-if="currentAccount.lenght != 0">
            <h4 class="subtitle">Connected BSC address: {{ currentAccount[0] }}</h4>
            <p>Balance BSC: {{ this.bscWalletBalance }}</p>
          </div>
        </div>

        <div class="modal" :class="{'is-active': this.bscModal}">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">Select your BSC wallet</p>
              <button class="delete" aria-label="close" @click="this.toggleBSCModal"></button>
            </header>
            <section class="modal-card-body">

              <div class="columns is-multiline">

                <!-- MetaMask -->
                <div class="column is-third">
                  <div v-if="isAccountConnected">
                    <div class="provider has-radius" :disabled="currentProvider != null">
                      <img src="@/assets/img/providers/anchor.svg" alt="">
                      Metamask Connected
                    </div>
                  </div>
                  <div v-else-if="!this.isMetaMaskInstalled">
                    <div class="provider has-radius" @click="this.onMetaMaskConnect">
                      <img src="@/assets/img/providers/anchor.svg" alt="">
                        Connect Metamask
                    </div>
                  </div>
                  <div v-else>
                    <div class="provider has-radius" href="https://metamask.io/download.html" target="_blank">
                      <img src="@/assets/img/providers/anchor.svg" alt="">
                        Install MetaMask
                    </div>
                  </div>

                  <div class="column is-third">
                    <!-- Binance -->
                    <div v-if="isAccountConnected">
                      <div class="provider has-radius" :disabled="currentProvider != null">
                      <img src="@/assets/img/providers/anchor.svg" alt="">

                          Binance Connected
                      </div>
                    </div>
                    <div v-else-if="isBinanceInstalled">
                      <div class="provider has-radius" @click="this.onBinanceConnect">
                      <img src="@/assets/img/providers/anchor.svg" alt="">

                          Connect BSC Wallet
                      </div>
                    </div>
                    <div v-else>
                      <div class="provider has-radius" href="https://docs.binance.org/smart-chain/wallet/binance.html"
                        target="_blank">
                      <img src="@/assets/img/providers/anchor.svg" alt="">

                          Install BSC Wallet
                      </div>
                    </div>
                  </div>

                  <div class="column is-third">
                    <!-- WalletConnect Web3 -->
                    <div>
                      <div class="provider has-radius" @click="this.onWalletConnectWeb3"
                        :disabled="currentProvider != null">
                      <img src="@/assets/img/providers/anchor.svg" alt="">

                          WalletConnect Web3
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </section>
          </div>
        </div>




        <!-- Disconnect // Figure out how we can do this.  -->
        <!-- <br>
                            <div>
                                <a class="button is-warning" @click="this.disconnectAccount" :disabled="this.currentProvider == null">
                                                                                                            <strong>Disconnect 🚧</strong>
                                                                                                          </a>
                            </div> -->


        <!-- // TODO: when both wallets are connected and swapfield filled in with number -->
        <swap-form :disabled="swapDisabled" :account="currentAccount" :provider="currentProvider"></swap-form>


        <!-- Educational Resources -->
        <br>
        <div>
          <a class="button is-warning" href="https://docs.pancakeswap.finance/get-started/connection-guide"
            target="_blank">
            <strong>Learn how to connect 📞</strong>
          </a>
        </div>

      </div>
    </div>
  </section>
</template>

<script>
  /**
   * When using the walletconnect protocol we need to make sure to use the custom requests.
   * https://docs.binance.org/walletconnect.html
   */
  import WalletConnectProvider from "@walletconnect/web3-provider";
  import SwapForm from '@/components/SwapForm';
  import QRCodeModal from "@walletconnect/qrcode-modal";

  import Web3 from 'web3'
  const web3 = new Web3()


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

  export default {
    components: {
      SwapForm
    },
    data() {
      return {
        metamask: window.ethereum || null,
        binance: window.BinanceChain || null,
        walletConnect: walletProvider || null, //connect to mobile wallet; trust, metamask, ...
        walletProvider: walletProvider || null,
        currentAccount: [],
        walletConnected: null, // Does it make sense to do this at the beginning?
        currentProvider: null,
        swapDisabled: true,
        bscModal: false,
        bscWalletBalance: 0
      }
    },

    computed: {
      // EOS
      wallet() {
        return (this.$wallet) ? this.$wallet.wallet : null
      },

      isMetaMaskInstalled() {
        return Boolean(this.ethereum && this.ethereum.isMetaMask)
      },

      isBinanceInstalled() {
        return Boolean(this.binance)
      },

      isAccountConnected() {
        return this.currentAccount.length > 0
      },

      areBothWalletsConnected() {
        return [this.$wallet.wallet, this.currentProvider];
      }

    },

    watch: {
      areBothWalletsConnected(values) {
        if (values[0] !== null && values[1] !== null) {
          this.swapDisabled = false;
        }
      },
    },

    methods: {

      async getBscBalance() {

        console.log(this.currentAccount)

        try {
          const response = await this.currentProvider.request({
            method: 'eth_getBalance',
            params: [
              this.currentAccount[0]
            ]
          })
          this.bscWalletBalance = web3.utils.fromWei(response)
        } catch (balanceError) {
          console.error(balanceError)
        }

      },

      toggleBSCModal() {
        this.bscModal = !this.bscModal
      },

      async onMetaMaskConnect() {
        try {
          console.log('Connecting MetaMask')
          this.registerProviderListener(this.metamask)
          this.currentAccount = await this.currentProvider.request({
            method: 'eth_requestAccounts'
          })
          this.getBscBalance()

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
          this.currentAccount = await this.currentProvider.request({
            method: 'eth_requestAccounts'
          })
          this.getBscBalance()
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

          this.getBscBalance()

          //Integrate dapp with the provider
          // const web3 = new Web3(walletConnectProvider)

        } catch (walletConnectError) {
          console.error(walletConnectError)
        }
      },


      // only works for wallet disconnect at the moment.
      async walletConnectDisconnect() {
        await this.currentProvider.disconnect();
      },

      //Does not properly work at the moment, does not work at the moment - CONCEPT
      async disconnectAccount() {
        console.log('Disconnecting')

        // TODO: figure out how to disconnect wallets

        // This method is accesible on the WalletConnectProvider interface.
        // await this.currentProvider.disconnect();
      },

      // Handle when the user changes their account number
      async handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
          // MetaMask is locked or the user has not connected any accounts
          console.log('Please connect to MetaMask.');
        } else if (accounts[0] !== currentAccount) {
          currentAccount = accounts[0];
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
        const chainId = this.getCurrentChainNetwork();

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

              if (updatedChainId =! null) throw Error(`AddChainError: ${updatedChainId}`)
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
          return await this.currentProvider({
            method: 'eth_chainId'
          })
        } catch (error) {
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
          this.currentAccount = newAccount
        })

        // Inform user of chain change
        this.currentProvider.on('chainChanged', (_chainId) => {
          if (_chainId != process.env.NUXT_ENV_BSC_HEX_ID) {
            alert(
              `Please switch to the correct chain: Binance Smart Chain, Mainnet, chainId: ${process.env.NUXT_ENV_BSC_NETWORK_ID}`
              )
          }
        })

        this.addChain()
      },

    },

    created() {

      if (this.binance && this.metamask !== null) {
        console.log(`
                Metamask: ${this.metamask}
                Binance: ${this.binance}
                WalletConnect: ${this.walletConnect}
            `)

      }
    },
  }
</script>


<style lang="scss" scoped>
.modal-card-body {
  border-radius: 0 0 6px 6px;
}
.modal-card {
  max-width: 500px;
}
.column {
  padding: 0.5rem;
  .provider {
    padding: 10px;
    border: 1px solid #CCC;
    font-size: 18px;
    font-weight: 700;
    line-height: 40px;
    img {
      float: left;
      height: 40px;
      max-height: none;
      max-width: none;
      margin-right: 8px;
    }
    &:hover {
      background: #f3f3f3;
      cursor: pointer;
    }
  }
}
</style>
