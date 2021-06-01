<template>
  <div>
    <section class="section">
      <div class="container">
        <div class="has-text-centered block">
          <img :src="require('@/assets/img/logo.svg')" width="130" class="mb-5">
          <h2 class="site-title is-spaced title">Bridge</h2>
          <h4 class="subtitle">Transfer EFX between EOS and your BSC Wallet.</h4>
        </div>
      </div>
    </section>
    <div class="container">
      <div class="box is-horizontal-centered px-6 has-text-centered content" style="max-width: 550px">
        <div v-if="$ptokens.status == 'start'" class="loader-wrapper is-active">
          <div class="loader is-loading" />
        </div>
        <div class="columns is-centered mt-4">
          <div class="column is-12">
            <div class="progress-block mb-6" v-if="$ptokens.status || $ptokens.error">
              <div v-if="!$ptokens.error && $ptokens.status !=='finished'" class="mb-3">{{ $ptokens.statusText }}</div>
              <div class="notification is-danger" v-if="$ptokens.error">{{ $ptokens.error }}</div>
              <div class="notification is-success" v-if="$ptokens.status == 'finished'">{{ $ptokens.statusText }}</div>

              <div v-if="!$ptokens.error && $ptokens.status == 'progress'">
                <progress class="progress is-primary" max="100"></progress>
                <p>Please be patient, the swap can take a couple of minutes</p>
              </div>

              <div v-if="$ptokens.status == 'finished'">
                <div class="notification has-text-centered">
                    <span class="mb-1">Amount swapped</span>
                    <h4 class="subtitle is-4">{{ this.$ptokens.efxAmount }}</h4>
                </div>
                <div class="notification has-text-centered">
                  <img src="~assets/img/EOS-logo.svg" height="50" width="50"/>
                  <div class="subtitle is-5">
                    <a :href="$eos.explorer + '/account/'+ this.$ptokens.eosWallet.auth.accountName" target="_blank" class="blockchain-address">
                    {{ this.$ptokens.eosWallet }}
                    {{ this.$ptokens.eosTransactionId }}
                    </a>
                  </div>
                </div>

                <div class="notification has-text-centered">
                  <img src="~assets/img/BSC-logo.svg" height="50" width="50"/>
                  <div class="subtitle is-6 has-text-centered">
                    <a :href="$bsc.explorer + '/address/'+ this.$ptokens.bscWallet" target="_blank"class="blockchain-address">
                    {{ this.$ptokens.bscWallet }}
                    {{ this.$ptokens.bscTransactionId }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <nuxt-link to="/" v-if="$ptokens.status == 'failed' || $ptokens.status =='finished' || !$ptokens.status" class="button is-medium is-accent is-fullwidth mt-5">
          <strong v-if="$ptokens.status == 'failed' || !$ptokens.status">Back to form</strong>
          <strong v-if="$ptokens.status == 'finished'">Swap again</strong>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
    }
  },
  mounted () {
    // if there's no swap in progress or an error, go back to form
    if(!this.$ptokens.status) {
      this.$router.push('/')
    }
  },
  methods: {
  },

  created() {
  },
}
</script>

<style lang="scss" scoped>
.site-title {
  font-size: 64px;
}
.progress::-webkit-progress-value {
  transition: width 0.5s ease;
}
</style>
