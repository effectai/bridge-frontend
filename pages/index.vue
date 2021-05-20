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
      <swap-form />
    </div> 
    <!-- Educational Resources -->
    <div class="has-text-centered my-5">
      <a class="has-text-white learn" href="https://docs.pancakeswap.finance/get-started/connection-guide"
        target="_blank">
        <strong>Learn how to connect</strong>
      </a>
    </div>
  </div>
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

.learn {
  @media screen and (max-width: $tablet) {
    color: #000 !important;
  }
}
</style>
