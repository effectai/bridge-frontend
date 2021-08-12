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
      <div class="tabs is-centered is-large is-boxed">
        <ul>
          <li class="tab">
            <a @click="bridge = true">
              <span class="icon is-small"><i class="fas fa-sync-alt" aria-hidden="true"></i></span>
              <span>Bridge</span>
            </a>
          </li>
          <li class="tab">
            <span>&nbsp;&nbsp;&nbsp;</span>
          </li>
          <li class="tab">
            <a @click="bridge=false">
              <span>Farm</span>
              <span class="icon is-small"><i class="fas fa-tractor" aria-hidden="true"></i></span>
            </a>
          </li>
        </ul>
      </div>
        <swap-form v-if="bridge"/>
        <master-chef v-else/>
    </div>
    <!-- Educational Resources -->
    <div class="has-text-centered my-5">
      <a class="has-text-white learn" href="https://effect-dao-docs.gitbook.io/dao-guides/"
        target="_blank">
        <strong>Learn how to connect</strong>
      </a>
    </div>
  </div>
</template>

<script>
import SwapForm from '@/components/SwapForm';
import MasterChef from '../components/MasterChef.vue';

export default {
  components: {
    SwapForm,
    MasterChef
  },
  data() {

    return {
      bridge: true
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
