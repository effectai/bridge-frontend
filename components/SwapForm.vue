<template>
  <div class="columns is-centered mt-4">
    <div class="column is-5">
      <!-- Progress bar -->
      <div class="progress-block my-6" v-if="this.inProgress">
        <span>{{this.progressText}}</span>
        <progress class="progress is-primary" :value="this.progress" max="100"></progress>
      </div>

      <!-- Forms -->
      <div class="eos-bsc-form" v-if="swapFromEOS">
        <div class="field has-addons">
          <div class="control is-flex-grow-1">
            <input class="input is-medium" type="text" placeholder="Amount" v-model="efxAmount">
          </div>
          <p class="control">
            <a class="button is-static is-medium">
              EFX
            </a>
          </p>
        </div>
        <span class="icon" @click="swapFromEOS = !swapFromEOS">
          <i class="fas fa-exchange-alt"></i>
        </span>
        <div class="field has-addons mt-2">
          <div class="control is-flex-grow-1">
            <input class="input is-medium" type="text" placeholder="Amount">
          </div>
          <p class="control">
            <a class="button is-static is-medium">
              pEFX
            </a>
          </p>
        </div>
      </div>

      <div class="bsc-eos-form" v-if="!swapFromEOS">
        <div class="field has-addons ">
          <div class="control is-flex-grow-1">
            <input class="input is-medium" type="text" placeholder="Amount" v-model="pefxAmount">
          </div>
          <p class="control">
            <a class="button is-static is-medium">
              pEFX
            </a>
          </p>
        </div>
        <span class="icon" @click="swapFromEOS = !swapFromEOS">
          <i class="fas fa-exchange-alt"></i>
        </span>
        <div class="field has-addons mt-2">
          <div class="control is-flex-grow-1">
            <input class="input is-medium" type="text" placeholder="Amount">
          </div>
          <p class="control">
            <a class="button is-static is-medium">
              EFX
            </a>
          </p>
        </div>
      </div>
      <button class="button is-medium is-danger is-fullwidth mt-5" @click="onSwap()">
        <strong>Swap</strong>
      </button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    account: Array,
    provider: Object
  },
  data () {
    return {
      swapFromEOS: true,
      efxAmount: 0,
      pefxAmount: 0,
      inProgress: false,
      progress: null,
      progressText: null,
    }
  }, 
  mounted() {
    this.$nuxt.$on('progressUpdate', (update) => {
      this.inProgress = update.inProgress;
      this.progress = update.progress;
      this.progressText = update.text;
    });
  },
  methods: {
      async onSwap() {
        console.log('Start swap...');
        this.$ptokens.init(this.provider, this.account)
        if (this.swapFromEOS) {
          this.$ptokens.swapToBsc(this.efxAmount)
        } else {
          this.$ptokens.swapToEos(this.pefxAmount)
        }
      },
  }
}
</script>
<style scoped lang="scss">
.progress::-webkit-progress-value {
  transition: width 0.5s ease;
}
</style>