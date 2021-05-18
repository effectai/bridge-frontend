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
                        <strong>Binance Connected 🔶</strong>
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


                <!-- Disconnect // Figure out how we can do this.  -->
                <!-- <br>
                            <div>
                                <a class="button is-warning" @click="this.disconnectAccount" :disabled="this.currentProvider == null">
                                                                                                            <strong>Disconnect 🚧</strong>
                                                                                                          </a>
                            </div> -->

                <br>
                <div v-if="currentAccount.length != 0">
                    <strong>Selected Account: {{currentAccount}}</strong>
                </div>

                <!-- // TODO: when both wallets are connected and swapfield filled in with number -->
                <swap-form :disabled="swapDisabled" :account="currentAccount" :provider="currentProvider"></swap-form>


                <!-- Educational Resources -->
                <br>
                <div>
                    <a class="button is-warning" href="https://docs.pancakeswap.finance/get-started/connection-guide" target="_blank">
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
        },

        areBothWalletsConnected() {
            return [this.$wallet.wallet, this.currentProvider];
        },

    },

    watch: {
        areBothWalletsConnected(values) {
            if (values[0] !== null && values[1] !== null) {
                this.swapDisabled = false;
            }
        },
    },

    methods: {
        async onMetaMaskConnect() {
            try {
                console.log('Connecting MetaMask')
                this.registerProviderListener(this.metamask)
                this.currentAccount = await this.currentProvider.request({
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
                this.currentAccount = await this.currentProvider.request({
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
                            chainId: process.env.NUXT_ENV_BSC_NETWORK_ID,
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

                        if (updatedChainId = !null) throw Error(`AddChainError: ${updatedChainId}`)
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
                return await this.currentProvider({ method: 'eth_chainId' })
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
                    alert(`Please switch to the correct chain: Binance Smart Chain, Mainnet, chainId: ${process.env.NUXT_ENV_BSC_NETWORK_ID}`)
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
