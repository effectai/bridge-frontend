<template>
  <section class="section">
    <div class="container">
      <div class="has-text-centered block">
        <img :src="require('@/assets/img/logo.svg')" width="130" class="mb-5">
        <h2 class="site-title is-spaced title">Bridge</h2>
        <h4 class="subtitle">Transfer EFX between EOS and your BSC Wallet.</h4>
      </div>
      <swap-form />
      <!-- Educational Resources -->
      <div class="has-text-centered">
        <a class="has-text-white" href="https://docs.pancakeswap.finance/get-started/connection-guide"
           target="_blank">
          <strong>Learn how to connect</strong>
        </a>
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
</style>
