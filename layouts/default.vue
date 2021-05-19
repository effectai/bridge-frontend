<template>
  <div id="app">
    <eos-wallet />
    <bsc-wallet />
    <Nuxt />
  </div>
</template>

<script>
import EosWallet from '@/components/EosWallet';
import BscWallet from '@/components/BscWallet';

export default {
  components: {
    EosWallet,
    BscWallet
  }
}
</script>

<style lang="scss">
html {
  min-height: 100vh;
  background: url('~assets/img/bg.jpg');
  background-size: cover;
  background-position: center;
}
</style>
