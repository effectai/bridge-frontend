<template>
  <div class="container">
    <div class="tabs is-centered is-large is-boxed">
      <ul style="border-bottom: 0px;">
        <li :class="{ 'is-active': active == 'swap' }" class="tab">
          <nuxt-link to="/">
            <span class="icon is-small"><i class="fas fa-sync-alt" aria-hidden="true"></i></span>
            <span>Bridge</span>
          </nuxt-link>
        </li>
        <li class="tab">
          <span>&nbsp;&nbsp;&nbsp;</span>
        </li>
        <li :class="{ 'is-active': active == 'farm' }" class="tab">
          <nuxt-link to="/farm">
            <span>Farm</span>
            <span class="icon is-small"><i class="fas fa-tractor" aria-hidden="true"></i></span>
          </nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: ['active'],

  data () {
    return {
    }
  },

  computed: {
  },

  methods: {
  }
}
</script>
<style lang="scss" scoped>
.container {
  z-index: 1;
}
.tabs.is-boxed li.is-active a {
  border: none;
  color: $secondary !important;
}
</style>