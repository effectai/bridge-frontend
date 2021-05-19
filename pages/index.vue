<template>
  <section class="section">
    <div class="container">
      <div class="has-text-centered block">
        <img :src="require('@/assets/img/logo.svg')" width="130" class="mb-5">
        <h2 class="site-title is-spaced title">Bridge</h2>
        <h4 class="subtitle">Transfer EFX between EOS and your BSC Wallet.</h4>
      </div>
      <div class="box is-horizontal-centered px-6" style="max-width: 550px">
        <div class="columns is-vcentered">
          <div class="column is-align-self-stretch is-5">
            <small class="is-size-7">From</small>
            <div class="box is-shadowless has-border has-text-centered is-fullheight">
              <div class="subtitle has-text-weight-semibold mb-2">EOS</div>
              <img src="~assets/img/EOS-logo.svg" height="100" />
              <div v-if="!eosWallet">
                <a class="button is-small is-accent" @click="$eos.loginModal = true">
                  <strong>Connect EOS</strong>
                </a>
              </div>
              <div v-else>
                <a :href="$eos.explorer + '/account/'+ eosWallet.auth.accountName" target="_blank" class="blockchain-address">{{ eosWallet.auth.accountName }}</a>
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
                <a :href="$bsc.explorer + '/address/'+ bscWallet[0]" target="_blank" class="blockchain-address">{{ bscWallet[0] }}</a>
                <a class="has-text-danger" @click="$bsc.logout()">
                  <small class="is-size-7">Disconnect</small>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>

        <!-- // TODO: when both wallets are connected and swapfield filled in with number -->
<!--        <swap-form :disabled="true" :account="currentAccount" :provider="currentProvider"></swap-form>-->


        <!-- Educational Resources -->
        <div class="has-text-centered">
          <a class="has-text-white" href="https://docs.pancakeswap.finance/get-started/connection-guide"
             target="_blank">
            <strong>Learn how to connect</strong>
          </a>
        </div>

      </div>
    </div>
  </section>
</template>

<script>
import SwapForm from '@/components/SwapForm';

export default {
  components: {
    SwapForm
  },
  data() {
    return {
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
  },

  created() {
  },
}
</script>

<style lang="scss" scoped>
.site-title {
  font-size: 64px;
}
.blockchain-address {
  font-family: monospace;
  text-overflow: ellipsis;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  display: block;
}
</style>
