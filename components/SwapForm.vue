<template>
  <div class="columns is-centered mt-4">
    <div class="column is-5">
      <!-- Progress bar -->
      <div class="progress-block mb-6" v-if="this.inProgress || this.swapError">
        <div v-if="!this.swapError">{{this.progressText}}</div>
        <div class="notification is-danger" v-if="this.swapError">{{this.swapError}}</div>
        <progress v-if="!this.swapError" class="progress is-primary" :value="this.progress" max="100"></progress>
      </div>

      <!-- Forms -->
      <div class="eos-bsc-form" v-if="swapFromEOS">
        <h3 class="title is-3">EOS -> BSC</h3>
        <div class="field has-addons">
          <div class="control is-flex-grow-1">
            <input class="input is-medium" type="number" placeholder="Amount to swap" onkeyup="if(this.value<0){this.value= this.value * -1}" v-model="efxAmount">
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
      </div>

      <div class="bsc-eos-form" v-if="!swapFromEOS">
        <h3 class="title is-3">BSC -> EOS</h3>
        <div class="field has-addons ">
          <div class="control is-flex-grow-1">
            <input class="input is-medium" type="number" placeholder="Amount to swap" onkeyup="if(this.value<0){this.value= this.value * -1}" v-model="pefxAmount">
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
      </div>
      <button :disabled="disabled || (!efxAmount && !pefxAmount)" class="button is-medium is-danger is-fullwidth mt-5" @click="onSwap()">
        <strong>Swap</strong>
      </button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    account: Array,
    provider: Object,
    disabled: Boolean
  },
  data () {
    return {
      swapFromEOS: true,
      efxAmount: null,
      pefxAmount: null,
      inProgress: false,
      progress: null,
      progressText: null,
      swapError: null
    }
  },
  mounted() {
    this.$nuxt.$on('progressUpdate', (update) => {
      this.inProgress = update.inProgress;
      this.progress = update.progress;
      this.progressText = update.text;
      this.swapError = update.error;
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
