<template>
  <section class="section">
    <div class="container">
      <div class="has-text-centered">
        <h2 class="title">Welcome to the Effect Bridge</h2>
        <div v-if="!wallet">
          <a class="button is-secondary" @click="$wallet.loginModal = true">
            <strong>Connect EOS Wallet</strong>
          </a>
        </div>
        <div v-else>
          <h4 class="subtitle">{{ wallet.auth.accountName }}</h4>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  computed: {
    wallet () {
      return (this.$wallet) ? this.$wallet.wallet : null
    }
  }
}
</script>
