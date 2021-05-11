<template>
    <section class="section">
        <div class="container">
            <div class="has-text-centered">
                <h2 class="title">Welcome to the Effect Bridge</h2>
                <div v-if="!wallet">
                    <a class="button is-secondary" @click="$wallet.loginModal = true">
                    <strong>Connect EOS 🖖</strong>
                  </a>
                </div>
                <div v-else>
                    <h4 class="subtitle">{{ wallet.auth.accountName }}</h4>
                </div>

                <br>

                <div v-if="isMetaMaskConnected">
                  <a class="button is-secondary " @click="this.onClickDisconnect">
                    <strong>Metamask Connected 🦊</strong>
                  </a>
                </div>

                <div v-else-if="isMetaMaskInstalled">
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
                <div v-if="currentAccount.length != 0">
                  Selected Account: {{selectedAccount}}
                </div>

            </div>
        </div>
    </section>
</template>

<script>

export default {
    data() {
        return {
            ethereum: window.ethereum || false,
            currentAccount: [],
            metaMaskConnected: window.ethereum.isConnected(),
            metaMaskInstalled: false

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
            return this.currentAccount.length > 0
        },

        selectedAccount() {
          return this.currentAccount[0];
        }
    },

    methods: {
        async onClickConnect() {
            try {
                this.currentAccount = await this.ethereum.request({
                    method: 'eth_requestAccounts'
                })
            } catch (error) {
                console.error(error)
            }
        },

        async onClickDisconnect(){
          console.log('Disconnecting')
          try {
            await this.ethereum.emit('disconnect')
            // this.metaMaskConnected = false;
          } catch (disconnectError) {
            console.error('Error disconnecting from metaMask', disconnectError)
          }
        },

    },

    created() {

      console.log(`Ethereum`, this.ethereum);
      if(this.isMetaMaskInstalled){
        this.ethereum.on('connect', () => {
          console.log('Connecting')
          this.metaMaskConnected = true
        })


        this.ethereum.on('disconnect', () => {
          console.log('Diconnecting')
          this.metaMaskConnected = false
        })

        // Inform vue which account is the selected account in metamask
        this.ethereum.on('accountsChanged', (newAccount) => {
          console.log("Changing selected account")
          this.currentAccount = newAccount
        })

        // inform user that they are not on the right chain
        this.ethereum.on('chainChanged', console.log)

        // Inform user that they are not on the right network.
        this.ethereum.on('networkChanged', console.log)

      }


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
