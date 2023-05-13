<template>
  <div>
    <section class="section">
      <div class="container">
        <div class="has-text-centered block">
          <img :src="require('@/assets/img/logo.svg')" width="130" class="mb-5">
          <h2 class="site-title is-spaced title">Effect Farm</h2>
          <h4 class="subtitle">Add liquidity to the EFX/BSC Pool and earn EFX rewards.</h4>
        </div>
      </div>
    </section>
    <tabs active="farm"></tabs>
    <master-chef></master-chef>
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
      finishedFarms: []
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
