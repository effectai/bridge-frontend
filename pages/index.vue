<template>
    <section class="section">
        <div class="container">
            <div class="has-text-centered">
                <h2 class="title">Welcome to the Effect Bridge</h2>

                <!-- EOS -->
                <br>
                <div v-if="!wallet">
                    <a class="button is-secondary" @click="$wallet.loginModal = true">
                                            <strong>Connect EOS 🖖</strong>
                                          </a>
                </div>
                <div v-else>
                    <h4 class="subtitle">{{ wallet.auth.accountName }}</h4>
                </div>

                <!-- MetaMask -->
                <br>
                <div v-if="isAccountConnected">
                    <a class="button is-secondary" :disabled="currentProvider != null">
                                            <strong>Metamask Connected 🦊</strong>
                                          </a>
                </div>
                <div v-else-if="!this.isMetaMaskInstalled">
                    <a class="button is-secondary" @click="this.onMetaMaskConnect">
                                            <strong>Connect Metamask 🦊</strong>
                                          </a>
                </div>
                <div v-else>
                    <a class="button is-secondary" href="https://metamask.io/download.html" target="_blank">
                                            <strong>Install MetaMask 🦊</strong>
                                          </a>
                </div>

                <!-- Binance -->
                <br>
                <div v-if="isAccountConnected">
                    <a class="button is-secondary" :disabled="currentProvider != null">
                                            <strong>Binance Connected🔶</strong>
                                          </a>
                </div>
                <div v-else-if="isBinanceInstalled">
                    <a class="button is-secondary" @click="this.onBinanceConnect">
                                            <strong>Connect BSC Wallet 🔶</strong>
                                          </a>
                </div>
                <div v-else>
                    <a class="button is-secondary" href="https://docs.binance.org/smart-chain/wallet/binance.html" target="_blank">
                                                    <strong>Install BSC Wallet 🔶</strong>
                                                  </a>
                </div>

                <!-- WalletConnect -->
                <br>
                <div>
                    <a class="button is-secondary" @click="this.onWalletConnect" :disabled="currentProvider != null">
                                                    <strong>WalletConnect 📱</strong>
                                                  </a>
                </div>

                <!-- Disconnect // Figure out how we can do this.  -->
                <br>
                <div>
                    <a class="button is-danger" :disabled="this.walletConnected || this.currentProvider == null">
                                            <strong>Disconnect 🚧</strong>
                                          </a>
                </div>

                <!-- Educational Resources -->
                <br>
                <div>
                    <a class="button is-warning" href="https://docs.pancakeswap.finance/get-started/connection-guide" target="_blank">
                                            <strong>Learn how to connect 📞</strong>
                                          </a>
                </div>

                <br>
                <div v-if="currentAccount.length != 0">
                    <strong>Selected Account: {{currentAccount}}</strong>
                </div>
   
                <div v-if="currentAccount.length != 0">
                  <a class="button is-danger" @click="onSwap('bsc')">
                    <strong>Test EOS -> ETH swap 🚧</strong>
                  </a>
                  <br>
                  <a class="button is-danger" @click="onSwap('eos')">
                    <strong>Test ETH -> EOS swap 🚧</strong>
                  </a>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
//web3 provider
import WalletConnectProvider from "@walletconnect/web3-provider";

//StandaloneClient
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

const walletProvider = new WalletConnectProvider({
    rpc: {
        97: "https://data-seed-prebsc-1-s1.binance.org:8545/", //testnet
        56: "https://bsc-dataseed.binance.org/" //mainnet
    },
    qrcodeModalOptions: {
        mobileLinks: [
            "metamask",
            "trust",
            "rainbow",
            "argent",
            "imtoken",
            "pillar"
        ]
    }
})


export default {
    data() {
        return {
            metamask: window.ethereum || null,
            binance: window.BinanceChain || null,
            walletConnect: walletProvider || null, //connect to mobile wallet; trust, metamask, ...
            web3Provider: null,
            currentAccount: [],
            walletConnected: null, //Figure out how to update this dynamically. Probably during `mounted`
            currentProvider: null
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
            // const web3Provider
            // walletProvider.
            // return this.metamask.listAccounts()
        },

        // currentAccount() {
        //     return this.currentAccount[0];
        // },

        // currentProvider() {
        //     return this.currentProvider
        // }

    },

    methods: {
        async onMetaMaskConnect() {
            try {
                console.log('Connecting MetaMask')
                this.currentProvider = this.metamask
                this.currentAccount = await this.currentProvider.request({
                    method: 'eth_requestAccounts'
                })
            } catch (mmError) {
                console.error(mmError)
            }
        },

        async onBinanceConnect() {
            try {
              console.log('Connecting Binance')
              this.currentProvider = this.binance
              this.currentAccount = await this.binance.request({
                method: 'eth_requestAccounts'
              })
            } catch (bscError) {
              console.error(bscError)
            }
        },

        async onSwap(to) {
          console.log('Start swap...')
          this.$ptokens.init(this.currentProvider, this.currentAccount)
          if (to == 'eos') {
            this.$ptokens.swapToEos()
          } else if (to == 'bsc') {
            this.$ptokens.swapToBsc()
          }
        },

        // Web3provider
        // async onWalletConnect() {
        //     //  Create WalletConnect Provider this is for the qr code mdal pop up at the moment.
        //     this.currentProvider = walletProvider
        //     await this.currentProvider.enable()
        //     //Integrate dapp with the provider
        //     // const web3 = new Web3(walletConnectProvider)
        // },

        // How does WalletConnect know that it needs to be on the binance chain?
        async onWalletConnect() {
            // Create a connector
            const connector = new WalletConnect({
                bridge: "https://bridge.walletconnect.org", // Required
                qrcodeModal: QRCodeModal,
                qrcodeModalOptions: {
                    mobileLinks: [
                        "metamask",
                        "trust",
                        "rainbow",
                        "argent"
                    ]
                }
            });
            if(!connector.connected){
              connector.createSession()
              console.log(`
                ChainID: ${connector.chainId}
                networkID: ${connector.networkId}
              `)
            }
        },

        async walletDisconnect() {
            await this.currentProvider.disconnect();
        },

        //Does not properly work at the moment.
        async disconnectAccount() {
            console.log('Disconnecting')

            try {
                await this.currentProvider.request({
                    method: "wallet_requestPermissions",
                    params: [{ eth_accounts: {} }]
                })
            } catch (disconnectError) {
                console.error('Error disconnecting from metaMask', disconnectError)
            }
        },

        // Handle when the user changes their account number - DOES NOT WORK AT THE MOMENT; CONCEPT
        async handleAccountsChanged(accounts) {
            if (accounts.length === 0) {
                // MetaMask is locked or the user has not connected any accounts
                console.log('Please connect to MetaMask.');
            } else if (accounts[0] !== currentAccount) {
                currentAccount = accounts[0];
                // Do any other work!
            }
        },

        // Hanlde chain (network) and chainchanged - DOES NOT WORK AT THE MOMENT; CONCEPT
        async handleChainChange() {
            const chainId = await ethereum.request({ method: 'eth_chainId' });
            handleChainChanged(chainId);

            ethereum.on('chainChanged', handleChainChanged);

            function handleChainChanged(_chainId) {
                // We recommend reloading the page, unless you must do otherwise
                window.location.reload();
            }
        },

        // async isConnected   

    },

    created() {

        if (this.currentProvider) {

            this.currentProvider.on('connect', () => {
                console.log('Connecting')
                this.walletConnected = true
            })

            this.currentProvider.on('disconnect', () => {
                console.log('Diconnecting')
                this.walletConnected = false
            })

            // Inform vue which account is the selected account in metamask
            this.currentProvider.on('accountsChanged', (newAccount) => {
                console.log("Changing selected account")
                this.currentAccount = newAccount
            })

            // inform user that they are not on the right chain
            this.currentProvider.on('chainChanged', console.log)

            // Inform user that they are not on the right network.
            this.currentProvider.on('networkChanged', console.log)

        }

    },
}
</script>
