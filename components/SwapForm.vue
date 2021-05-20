<template>
  <div>
    <div class="box is-horizontal-centered px-6" style="max-width: 550px">
      <div class="columns is-vcentered">
        <div class="column is-align-self-stretch is-5">
          <small class="is-size-7">From</small>
          <div class="box is-shadowless has-border has-text-centered is-fullheight">
            <div class="subtitle has-text-weight-semibold mb-2">EOS</div>
            <img src="~assets/img/EOS-logo.svg" height="100"/>
            <div v-if="!eosWallet">
              <a class="button is-small is-accent" @click="$eos.loginModal = true">
                <strong>Connect EOS</strong>
              </a>
            </div>
            <div v-else>
              <a :href="$eos.explorer + '/account/'+ eosWallet.auth.accountName" target="_blank"
                 class="blockchain-address">{{ eosWallet.auth.accountName }}</a>
              <a class="has-text-danger" @click="$eos.logout()">
                <small class="is-size-7">Disconnect</small>
              </a>
            </div>
          </div>
        </div>
        <div class="column is-2 has-text-centered">
          <a class="has-text-centered" @click="swapFromEOS = !swapFromEOS">
            <i class="fas fa-exchange-alt"></i><br>
            <small class="is-size-7"><a @click="">switch</a></small>
          </a>
        </div>
        <div class="column is-align-self-stretch is-5">
          <small class="is-size-7">To</small>
          <div class="box is-shadowless has-border has-text-centered">
            <div class="subtitle has-text-weight-semibold mb-2">BSC</div>
            <img src="~assets/img/BSC-logo.svg" height="100"/>
            <div v-if="!bscWallet">
              <a class="button is-small is-accent" @click="$bsc.loginModal = true">
                <strong>Connect BSC</strong>
              </a>
            </div>
            <div v-else>
              <a :href="$bsc.explorer + '/address/'+ bscWallet[0]" target="_blank"
                 class="blockchain-address">{{ bscWallet[0] }}</a>
              <a class="has-text-danger" @click="$bsc.logout()">
                <small class="is-size-7">Disconnect</small>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="columns is-centered mt-4">
      <div class="column is-5">
        <!-- Progress bar -->
        <div class="progress-block mb-6" v-if="this.inProgress || this.swapError">
          <div v-if="!this.swapError">{{ this.progressText }}</div>
          <div class="notification is-danger" v-if="this.swapError">{{ this.swapError }}</div>
          <progress v-if="!this.swapError" class="progress is-primary" :value="this.progress" max="100"></progress>
        </div>

        <!-- Forms -->
        <div class="eos-bsc-form" v-if="swapFromEOS">
          <h3 class="title is-3">EOS -> BSC</h3>
          <div class="field has-addons">
            <div class="control is-flex-grow-1">
              <input class="input is-medium" type="number" placeholder="Amount to swap"
                     onkeyup="if(this.value<0){this.value= this.value * -1}" v-model="efxAmount">
            </div>
            <p class="control">
              <a class="button is-static is-medium">
                EFX
              </a>
            </p>
          </div>
          <span class="icon" @click="swapFromEOS = !swapFromEOS">
          <i class="fas fa-exchange-alt"></i>
        </span>
        </div>

        <div class="bsc-eos-form" v-if="!swapFromEOS">
          <h3 class="title is-3">BSC -> EOS</h3>
          <div class="field has-addons ">
            <div class="control is-flex-grow-1">
              <input class="input is-medium" type="number" placeholder="Amount to swap"
                     onkeyup="if(this.value<0){this.value= this.value * -1}" v-model="pefxAmount">
            </div>
            <p class="control">
              <a class="button is-static is-medium">
                pEFX
              </a>
            </p>
          </div>
          <span class="icon" @click="swapFromEOS = !swapFromEOS">
          <i class="fas fa-exchange-alt"></i>
        </span>
        </div>
        <button :disabled="disabled || (!efxAmount && !pefxAmount)" class="button is-medium is-danger is-fullwidth mt-5"
                @click="onSwap()">
          <strong>Swap</strong>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      swapFromEOS: true,
      efxAmount: null,
      pefxAmount: null,
      inProgress: false,
      progress: null,
      progressText: null,
      swapError: null
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
  mounted() {
    this.$nuxt.$on('progressUpdate', (update) => {
      this.inProgress = update.inProgress;
      this.progress = update.progress;
      this.progressText = update.text;
      this.swapError = update.error;
    });
  },
  methods: {
    async onSwap() {
      console.log('Start swap...');
      this.$ptokens.init(this.$bsc.currentProvider, this.$bsc.currentAccount)
      if (this.swapFromEOS) {
        this.$ptokens.swapToBsc(this.efxAmount)
      } else {
        this.$ptokens.swapToEos(this.pefxAmount)
      }
    },
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

.progress::-webkit-progress-value {
  transition: width 0.5s ease;
}
</style>
