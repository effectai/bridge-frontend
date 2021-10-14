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
    <tabs active="farm"></tabs>
    <master-chef :farms="farms"></master-chef>
    <!-- Educational Resources -->
    <div class="has-text-centered my-5">
      <register-token/>
      <a class="has-text-white learn" href="https://effect-dao-docs.gitbook.io/dao-guides/"
        target="_blank">
        <strong>Learn how to connect</strong>
      </a>
    </div>
  </div>
</template>

<script>
import MasterChef from '@/components/MasterChef.vue';
import Tabs from '@/components/Tabs.vue';
import RegisterToken from '@/components/RegisterToken'

export default {
  components: {
    MasterChef,
    Tabs,
    RegisterToken
  },
  data() {
    return {
      activeFarms: [],
      finishedFarms: [],
      farms: [
        {
          id: 0,
          contract: '0xE2F0627DCA576CCdbce0CED3E60E0E305b7D4E33',
          active: false
        }, 
        {
          id: 1,
          contract: '0xb8326dce706df2d14f51c6b2f2013b6490b6ad57',
          active: true
        }
      ]
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
