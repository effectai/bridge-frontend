<template>
    <div>
        <div class="box is-horizontal-centered px-6 content" style="max-width: 550px">

            <!-- Basic Farm Info -->
            <table class="table is-narrow">
                <tbody>
                    <tr>
                        <th>Start Date:</th>
                        <td>{{this.farm.startDate}}</td>
                    </tr>
                    <tr>
                        <th>End Date:</th>
                        <td>{{this.farm.endDate}}</td>
                    </tr>
                    <tr>
                        <th>Address:</th>
                        <td>
                          <a :href="this.farm.urladdress" target="_blank" class="blockchain-address">{{this.farm.address}}</a>
                        </td>
                    </tr>
                    <tr>
                        <th>Reward<strong>/</strong>Block</th>
                        <td>
                        </td>
                    </tr>
                    <tr>
                        <th>LP Locked:</th>
                        <td>{{}}</td>
                    </tr>
                    <tr>
                        <th>EFX Reserves:</th>
                        <td>{{ this.farm.efxReserves }}</td>
                    </tr>
                    <tr>
                        <th>WBNB Reserves:</th>
                        <td>{{ this.farm.wbnbReserves }}</td>
                    </tr>
                    <tr>
                        <th>APR: </th>
                        <td>{{this.farm.apr}}</td>
                    </tr>
                </tbody>
            </table>

            <div class="columns is-vcentered is-centered">

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

            <div v-if="bscWallet">
              <div v-if="$masterchef.approved">
                <div class="is-size-7 columns mb-0 is-mobile">
                      <div class="column py-0">
                          Amount
                      </div>
                      <div class="column has-text-right py-0">
                          Balance:
                          <span v-if="$masterchef.lpBalance !== null"><a @click="lpAmount = $bsc.efxAvailable">{{parseFloat($masterchef.lpBalance)}}</a></span>
                          <span v-else>-</span>
                      </div>
                  </div>
                  <div class="field has-addons">
                      <div class="control is-flex-grow-1">
                          <!-- What is the minimum LP that can be staked? -->
                          <input class="input is-medium" type="number" placeholder="Minumum 1 LP" min="0" v-model="lpAmount">
                      </div>
                      <p class="control">
                          <a class="button is-static is-medium">EFX</a>
                      </p>
                  </div>
                  <div class="field">
                      <input class="input" disabled :value="bscWallet ? bscWallet[0] : '- login with your BSC wallet -'" type="text" />
                  </div>
                  <button :disabled="!lpAmount || !bscWallet || lpAmount < 1" class="button is-medium is-accent is-fullwidth mt-5" @click="$masterchef.depositLpIntoMasterChef(lpAmount)">
                      <strong>Farm</strong>
                  </button>
              </div>
              <div v-else>
                <div class="is-size-7 columns mb-0 is-mobile">
                  <button class="button is-medium is-accent is-fullwidth mt-5" @click="$masterchef.approveAllowance">
                      <strong>Approve</strong>
                  </button>
                </div>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
import { fromWei } from 'web3-utils';

export default {
    data() {
        return {
            lpAmount: null,
            farm: {},
            pendingEFX: null, // pending rewards that can be viewed using the `pendingEFX` function on masterchef.sol
            allowanceApproval: null,
        }
    },
    computed: {
        bscWallet() {
            return (this.$bsc) ? this.$bsc.wallet : null
        },
        approved() {
            return (this.$bsc) ? this.$bsc.approved : null
        }

    },
    methods: {
        onConnect() {
            // TODO When wallet is connected, check if
            // address has already been approved
            // Get balance, farmed amount, pending rewards
        },
        onFarm() {
          // lock in liquidity and start farming

        },
        onCollectRewards() {
            // TODO to clain efx rewards, call withdrawEfx(amount: 0) Will autoclaim pending tokens
        },
        onDepositLP() {
            // TODO Deposit LP into masterchef.sol after approve has been called
        },
        async getLpReserves() {
        }
    },
    created() {
        // TODO when this page is mounted load in basic farm info; apr, liquidity, multiplier
        this.farm.startDate = "TBA"
        this.farm.address = (process.env.NUXT_ENV_MASTERCHEF_CONTRACT.slice(12)).padEnd(3, '...')
        this.farm.urladdress = `https://bscscan.com/address/${process.env.NUXT_ENV_MASTERCHEF_CONTRACT}`
        this.farm.reward = "TBA"
        this.farm.locked = this.$masterchef.lockedTokens
        this.farm.wbnbReserves = fromWei(this.$masterchef.lpReserves[0]) || "N/A"
        this.farm.efxReserves = fromWei(this.$masterchef.lpReserves[1]) || "N/A"
        this.farm.endDate = this.$masterchef.lpEndDate || "N/A"
        this.farm.apr = "N/A"
    },
    mounted(){

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
