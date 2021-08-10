<template>
    <div>
        <div class="box is-horizontal-centered px-6 content" style="max-width: 550px">

              <!-- Basic Farm Info -->
                <table class="table is-narrow">
                  <tbody>
                    <tr>
                      <th>Start Date:</th>
                      <td>{{farm.startDate}}</td>
                    </tr>
                    <tr>
                      <th>End Date:</th>
                      <td>{{farm.endDate}}</td>
                    </tr>
                    <tr>
                      <th>Farm address:</th>
                      <td>{{farm.address}}</td>
                    </tr>
                    <tr>
                      <th>Reward<strong>/</strong>Block</th>
                      <td>{{farm.reward}}</td>
                    </tr>
                    <tr>
                      <th>LP Locked:</th>
                      <td>{{farm.lpLocked}}</td>
                    </tr>
                    <tr>
                      <th>APR: </th>
                      <td>{{farm.apr}}</td>
                    </tr>
                    <tr>
                      <th>Liquidity: </th>
                      <td>{{farm.liquidity}}</td>
                    </tr>
                    <tr>
                      <th>Multiplier: </th>
                      <td>{{farm.multiplier}}</td>
                    </tr>
                  </tbody>

                </table>



            <div class="columns is-vcentered is-centered" :class="{'is-flex-direction-row-reverse': !swapFromEOS}">

              <div class="column is-align-self-stretch is-5">
                  <div class="box is-shadowless has-border has-text-centered">
                      <div class="subtitle has-text-weight-semibold mb-2">BSC</div>
                      <img src="~assets/img/BSC-logo.svg" height="100" />
                      <div v-if="!bscWallet">
                          <a class="button is-small is-accent" @click="$bsc.loginModal = true">
                  <strong>Connect BSC</strong>
                </a>
                      </div>
                      <div v-else>
                          <a :href="$bsc.explorer + '/address/'+ bscWallet[0]" target="_blank" class="blockchain-address">{{ bscWallet[0] }}</a>
                          <a class="has-text-danger" @click="$bsc.logout()">
                  <small class="is-size-7">Disconnect</small>
                </a>
                      </div>
                  </div>
              </div>
            </div>

            <div class="is-size-7 columns mb-0 is-mobile">
                <div class="column py-0">
                    Amount
                </div>
                <div class="column has-text-right py-0">
                    Balance:
                    <span v-if="$bsc.efxAvailable !== null"><a @click="lpAmount = $bsc.efxAvailable">{{$bsc.efxAvailable}}</a></span>
                    <span v-else>-</span>
                </div>
            </div>
            <div class="field has-addons">
                <div class="control is-flex-grow-1">
                  <!-- What is the minimum LP that can be staked? -->
                    <input class="input is-medium" type="number" placeholder="Minumum ??? LP" min="0" v-model="lpAmount">
                </div>
                <p class="control">
                    <a class="button is-static is-medium">EFX</a>
                </p>
            </div>
            <div class="is-size-7">
                To your <span v-if="swapFromEOS">BSC Address</span><span v-else>EOS Account</span>
            </div>
            <div class="field">
                <input class="input" disabled :value="swapFromEOS ? (bscWallet ? bscWallet[0] : '- login with your BSC wallet -') : (eosWallet ? eosWallet.auth.accountName : '- login with your EOS wallet -')" type="text" />
            </div>
            <button :disabled="!lpAmount || !bscWallet || lpAmount < 10" class="button is-medium is-accent is-fullwidth mt-5" @click="onSwap">
            <strong>Farm</strong>
          </button>
          <p class="is-size-7 is-center has-text-centered	mt-3" v-if="true">
            <!-- Are there any transaction fees? -->
            Transaction fee: 0.25% ???
          </p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            lpAmount: null,
            approved: false,
            farm: {},
            pendingEFX: null, // pending rewards that can be viewed using the `pendingEFX` function on masterchef.sol
        }
    },
    computed: {
        bscWallet() {
            return (this.$bsc) ? this.$bsc.wallet : null
        }
    },
    methods: {
      onConnect () {
        // TODO When wallet is connected, check if
        // address has already been approved
        // Get balance, farmed amount, pending rewards
      },
      onApprove () {
        // TODO Approve address, at max value of a uint256
      },
      // lock in liquidity and start farming
      onFarm () {

      },
      onCollectRewards () {
        // TODO to clain efx rewards, call withdrawEfx(amount: 0) Will autoclaim pending tokens
      },
      onDepositLP () {
        // TODO Deposit LP into masterchef.sol after approve has been called
      },
    },
    mounted() {
      // TODO when this page is mounted load in basic farm info; apr, liquidity, multiplier
    }
}
</script>

<style scoped lang="scss">
.blockchain-address {
    font-family: monospace;
    text-overflow: ellipsis;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    display: block;
}

.switch {
    @media screen and (max-width: $tablet) {
        padding-bottom: 0;
    }
}
</style>
