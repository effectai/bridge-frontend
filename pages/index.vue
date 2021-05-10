<template>
    <section class="section">
        <div class="container">
            <div class="has-text-centered">
                <h2 class="title">Welcome to the Effect Bridge</h2>
                <div v-if="!wallet">
                    <a class="button is-secondary" @click="$wallet.loginModal = true">
                    <strong>Connect EOS Wallet 🖖</strong>
                  </a>
                </div>
                <div v-else>
                    <h4 class="subtitle">{{ wallet.auth.accountName }}</h4>
                </div>

                <br>
                <div v-if="isMetaMaskInstalled">
                    <a class="button is-primary" @click="this.onClickConnect">
                    <strong>Connect Metamask 🦊</strong>
                  </a>
                </div>
                <div v-else>
                    <a class="button is-primary" href="https://metamask.io/download.html" target="_blank">
                    <strong>Install MetaMask 🦊</strong>
                  </a>
                </div>

                <br>
                <div v-if="isMetaMaskInstalled">
                    <a class="button is-primary" @click="this.onClickConnect">
                    <strong>Connect Web3 🤘</strong>
                  </a>
                </div>
                <div v-else>
                    <a class="button is-primary" href="https://metamask.io/download.html" target="_blank">
                    <strong>Foo Web3 🤘</strong>
                  </a>
                </div>

                <br>
                <div v-if="accounts.length != 0">
                  Make this dyncamic
                  Selected Account: {{selectedAccount}}
                </div>

            </div>
        </div>
    </section>
</template>

<script>
// import web3 from "web3";
// import Web3Modal from "web3modal"

export default {
    data() {
        return {
            ethereum: window.ethereum,
            accounts: []

        }
    },

    computed: {
        wallet() {
            return (this.$wallet) ? this.$wallet.wallet : null
        },

        isMetaMaskInstalled() {
            return Boolean(this.ethereum && this.ethereum.isMetaMask)
        },

        isMetaMaskConnected() {
            return accounts && accounts.length > 0
        },

        selectedAccount() {
          return this.accounts[0];
        }
    },

    methods: {
        async onClickConnect() {
            try {
                this.accounts = await this.ethereum.request({
                    method: 'eth_requestAccounts'
                })
            } catch (error) {
                console.error(error)
            }
        },

        async onClickInstall() {
            onboarding.startOnBoarding()
        }


    },

    mounted() {

        // const providerOptions = {

        // }

        // const web3Modal = new Web3Modal({
        //   network: 'Smart Chain',
        //   cacheProvider: true,
        //   providerOptions
        // });

        // const provider = await web3Modal.connect()

    },
}
</script>
