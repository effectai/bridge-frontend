<template>
    <div>
        <div class="box is-horizontal-centered px-6 content" style="max-width: 550px">
          <!-- Notification banner -->
          <div class="notification is-warning is-light">
            The bridge is currently under maintenance. Please come back later.
          </div>
            <!-- <div class="columns is-vcentered" :class="{'is-flex-direction-row-reverse': !swapFromEOS}"> -->
                <!-- <div class="column is-align-self-stretch is-5 "> -->
                    <!-- <small class="is-size-7"><span v-if="swapFromEOS">From</span><span v-else>To</span></small> -->
                    <!-- <div class="box is-shadowless has-border has-text-centered is-fullheight"> -->
                        <!-- <div class="subtitle has-text-weight-semibold mb-2">EOS</div> -->
                        <!-- <img src="~assets/img/EOS-logo.svg" height="100" /> -->
                        <!-- <div v-if="!eosWallet"> -->
                            <!-- <a class="button is-small is-accent" @click="$eos.loginModal = true"> -->
                    <!-- <strong>Connect EOS</strong> -->
                  <!-- </a> -->
                        <!-- </div> -->
                        <!-- <div v-else> -->
                            <!-- <a :href="$eos.explorer + '/account/'+ eosWallet.auth.accountName" target="_blank" class="blockchain-address">{{ eosWallet.auth.accountName }}</a> -->
                            <!-- <a class="has-text-danger" @click="$eos.logout()"> -->
                    <!-- <small class="is-size-7">Disconnect</small> -->
                  <!-- </a> -->
                        <!-- </div> -->
                    <!-- </div> -->
                <!-- </div> -->
                <!-- <div class="column switch is-2 has-text-centered"> -->
                    <!-- <a class="has-text-centered" @click="switchChains"> -->
                <!-- <i class="fas fa-exchange-alt"></i><br> -->
                <!-- <small class="is-size-7"><a @click="">switch</a></small> -->
                    <!-- </a> -->
                <!-- </div> -->
                <!-- <div class="column is-align-self-stretch is-5"> -->
                    <!-- <small class="is-size-7"><span v-if="swapFromEOS">To</span><span v-else>From</span></small> -->
                    <!-- <div class="box is-shadowless has-border has-text-centered"> -->
                        <!-- <div class="subtitle has-text-weight-semibold mb-2">BSC</div> -->
                        <!-- <img src="~assets/img/BSC-logo.svg" height="100" /> -->
                        <!-- <div v-if="!bscWallet"> -->
                            <!-- <a class="button is-small is-accent" @click="$bsc.loginModal = true"> -->
                    <!-- <strong>Connect BSC</strong> -->
                  <!-- </a> -->
                        <!-- </div> -->
                        <!-- <div v-else> -->
                            <!-- <a :href="$bsc.explorer + '/address/'+ bscWallet[0]" target="_blank" class="blockchain-address">{{ bscWallet[0] }}</a> -->
                            <!-- <a class="has-text-danger" @click="$bsc.logout()"> -->
                    <!-- <small class="is-size-7">Disconnect</small> -->
                  <!-- </a> -->
                        <!-- </div> -->
                    <!-- </div> -->
                <!-- </div> -->
            <!-- </div> -->
            <!-- <div class="is-size-7 columns mb-0 is-mobile"> -->
                <!-- <div class="column py-0"> -->
                    <!-- Amount -->
                <!-- </div> -->
                <!-- <div class="column has-text-right py-0"> -->
                    <!-- Balance: -->
                    <!-- <span v-if="swapFromEOS"> -->
              <!-- <span v-if="$eos.efxAvailable !== null"><a @click="efxAmount = $eos.efxAvailable">{{ $eos.efxAvailable }}</a></span> -->
                    <!-- <span v-else>-</span> -->
                    <!-- </span> -->
                    <!-- <span v-else> -->
              <!-- <span v-if="$bsc.efxAvailable !== null"><a @click="efxAmount = $bsc.efxAvailable">{{$bsc.efxAvailable}}</a></span> -->
                    <!-- <span v-else>-</span> -->
                    <!-- </span> -->
                <!-- </div> -->
            <!-- </div> -->
            <!-- <div class="field has-addons"> -->
                <!-- <div class="control is-flex-grow-1"> -->
                    <!-- <input class="input is-medium" type="number" placeholder="Minumum 10 EFX" min="0" v-model="efxAmount"> -->
                <!-- </div> -->
                <!-- <p class="control"> -->
                    <!-- <a class="button is-static is-medium">EFX</a> -->
                <!-- </p> -->
            <!-- </div> -->
            <!-- <div class="is-size-7"> -->
                <!-- To your <span v-if="swapFromEOS">BSC Address</span><span v-else>EOS Account</span> -->
            <!-- </div> -->
            <!-- <div class="field"> -->
                <!-- <input class="input" disabled :value="swapFromEOS ? (bscWallet ? bscWallet[0] : '- login with your BSC wallet -') : (eosWallet ? eosWallet.auth.accountName : '- login with your EOS wallet -')" type="text" /> -->
            <!-- </div> -->
            <!-- <button :disabled="!efxAmount || !eosWallet || !bscWallet || efxAmount < 10" class="button is-medium is-accent is-fullwidth mt-5" @click="onSwap"> -->
              <!-- <strong>Swap</strong> -->
            <!-- </button> -->
            <!-- <p class="is-size-7 is-center has-text-centered	mt-3" v-if="!swapFromEOS"> -->
              <!-- Transaction fee: 0.25% -->
            <!-- </p> -->
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            swapFromEOS: true,
            efxAmount: null,
        }
    },
    computed: {
        // EOS
        eosWallet() {
            return (this.$eos) ? this.$eos.wallet : null
        },
        bscWallet() {
            return (this.$bsc) ? this.$bsc.wallet : null
        }
    },
    methods: {
        switchChains() {
            this.swapFromEOS = !this.swapFromEOS
            this.efxAmount = null
        },
        async onSwap() {
            this.$ptokens.init(this.$bsc.currentProvider)
            this.$router.push('/swap-progress')

            if (this.swapFromEOS) {
                try {
                    await this.$ptokens.swapToBsc(this.efxAmount)
                } catch (e) {
                    this.swapError = e.message
                }
            } else {
                try {
                    await this.$ptokens.swapToEos(this.efxAmount)
                } catch (e) {
                    this.swapError = e.message
                }
            }
        },
    },
    mounted() {
      this.$ptokens.resetSwap()
    }
}
</script>

<style scoped lang="scss">
.blockchain-address {
    font-family: monospace;
    text-overflow: ellipsis;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    display: block;
}

.switch {
    @media screen and (max-width: $tablet) {
        padding-bottom: 0;
    }
}
</style>
