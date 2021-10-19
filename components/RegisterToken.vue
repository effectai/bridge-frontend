<template>
  <div v-if="isMetaMaskInstalled && isMetaMaskLoggedIn">
    <button class="button is-medium is-accent mt-5" :disabled=!bscWallet @click="$bsc.addEfxAsset()">
      <strong>Add EFX to Wallet</strong>
    </button>
  </div>
</template>

<script>
export default {
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
        },
        isMetaMaskInstalled() {
          return Boolean(this.$bsc.metamask && this.$bsc.metamask.isMetaMask)
        },
        isMetaMaskLoggedIn() {
          return Boolean(this.$bsc.currentProvider == this.$bsc.metamask)
        }
    },
    methods: {

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
