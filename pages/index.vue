<template>
  <section class="section">
    <div class="container">
      <div class="has-text-centered">
        <h4 class="title">Welcome to the Effect Bridge</h4>
        <div v-if="!wallet">
          <a class="button is-secondary" @click="$wallet.loginModal = true">
            <strong>Connect EOS Wallet</strong>
          </a>
        </div>
        <div v-else>
          <span>{{ wallet.auth.accountName }}</span>
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
