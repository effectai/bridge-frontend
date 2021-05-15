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

                <!-- WalletConnect Web3 -->
                <br>
                <div>
                    <a class="button is-secondary" @click="this.onWalletConnectWeb3" :disabled="currentProvider != null">
                                                                                                <strong>WalletConnect Web3 📱</strong>
                                                                                              </a>
                </div>

                <!-- Change Chain -->
                <br>
                <div>
                    <a class="button is-secondary" @click="this.handleChainChange" :disabled="false">
                                                                                                <strong>Change Chain ⛓️</strong>
                                                                                              </a>
                </div>

                <!-- Change Chain -->
                <br>
                <div>
                    <a class="button is-secondary" @click="this.addChain" :disabled="false">
                                                                                                <strong>Add Chain 🔌</strong>
                                                                                              </a>
                </div>

                <!-- Disconnect // Figure out how we can do this.  -->
                <br>
                <div>
                    <a class="button is-warning" :disabled="this.walletConnected || this.currentProvider == null">
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

const walletProvider = new WalletConnectProvider({
    chainId: 1, // For some reason chainID needs to be 1.
    rpc: {
        1: "https://data-seed-prebsc-1-s3.binance.org:8545/"
    },
    bridge: "https://bridge.walletconnect.org", // redundant?
    qrcode: true, // redundant?
    // qrcodeModal: QRCodeModal, //redundant?
    qrcodeModalOptions: {
        mobileLinks: ["metamask", "trust", "rainbow", "argent"]
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
            walletConnected: null, // Does it make sense to do this at the beginning?
            currentProvider: null,
            bscTestnetId: 97,
            bscTestnetHexId: '0x61',
            bscTestnetRPC: "https://data-seed-prebsc-1-s1.binance.org:8545/",
            bscMainnetID: 56,
            bascMainnetHexId: '0x38',
            bscMainnetRPC: 'https://bsc-dataseed.binance.org/'
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
            return this.currentAccount > 0
        }
    },

    methods: {
        async onMetaMaskConnect() {
            try {
                console.log('Connecting MetaMask')
                this.registerProviderListener(this.metamask)
                this.addChain()
                this.currentAccount = await this.currentProvider.request({
                    method: 'eth_requestAccounts'
                })
                this.registerProviderListener()
            } catch (mmError) {
                console.error(mmError)
            }
        },

        async onBinanceConnect() {
            try {
                console.log('Connecting Binance')
                this.registerProviderListener(this.binance)
                this.addChain()
                this.currentAccount = await this.currentProvider.request({
                    method: 'eth_requestAccounts'
                })
                this.registerProviderListener()
            } catch (bscError) {
                console.error(bscError)
            }
        },

        async onWalletConnectWeb3() {

            try {
                this.registerProviderListener(walletProvider)
                this.addChain()

                // Launches QR-Code Modal
                await walletProvider.enable()

                //Integrate dapp with the provider
                // const web3 = new Web3(walletConnectProvider)

            } catch (walletConnectError) {
                console.error(walletConnectError)
            }
        },


        // Does this still work?
        async walletDisconnect() {
            await this.currentProvider.disconnect();
        },

        //Does not properly work at the moment, does not work at the moment - CONCEPT
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

            // This method is accesible on the WalletConnectProvider interface.
            // await this.currentProvider.disconnect();
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
            const chainId = await this.currentProvider.request({ method: 'eth_chainId' });
            console.log(`
              chainID: ${chainId}
            `)

            if (chainId != this.bscTestnetHexId) {
                handleChainChanged(chainId);

                this.currentProvider.on('chainChanged', handleChainChanged);

                function handleChainChanged(_chainId) {
                    // It  is recomended to reload the page.
                    window.location.reload();
                }
            }

        },

        async addChain() {

            const chainId = await this.currentProvider.request({ method: 'eth_chainId' });
            if (chainId != this.bscTestnetHexId) {

                try {
                    const chainObject = {
                        chainId: this.bscTestnetHexId,
                        chainName: "Binance Smart Chain Testnet",
                        nativeCurrency: {
                            name: "Binance Chain Token",
                            symbol: 'BNB',
                            decimals: 18
                        },
                        rpcUrls: ['https://data-seed-prebsc-1-s3.binance.org:8545/'],
                        blockExplorerUrls: ['https://testnet.bscscan.com']
                    }

                    const chainId = await this.currentProvider.request({
                        method: 'wallet_addEthereumChain',
                        params: [chainObject]
                    })

                    if (chainId = !null) throw Error(`AddChainError: ${chainId}`)
                } catch (addChainError) {
                    console.error(addChainError)
                }
            }

        },

        // Register the provider with Web3
        async registerWeb3(provider) {
            console.debug(`web3 here.`)
            const web3 = new Web3(provider)
        },

        // Should we use `this.provider` or pass provider as a parameter?
        // Actually the I am already reg
        async registerProviderListener(provider) {
            this.currentProvider = provider
            console.debug(`provider.on() events here.`)
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

            // inform if the chain is changing
            this.currentProvider.on('chainChanged', console.log)

        }

    },

    created() {

    },
}
</script>
