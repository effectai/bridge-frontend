<template>
    <div>
        <div class="box is-horizontal-centered is-centered px-6 content" style="max-width: 550px">
            <h3 class="title has-text-centered is-4 mt-5 mb-3">Stake your LP tokens</h3>
            <h4 class="subtitle is-6 has-text-centered has-text-weight-light mb-5 mt-2">And earn EFX rewards!</h4>
            <div class="columns is-vcentered is-centered mt-3">
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

            <!-- <div class="box is-centered is-vcentered is-shadowless">

              <div class="column">
                <div class="block is-flex is-shadowless has-text-centered">
                  <h3>Masterchef Contract:</h3>
                </div>
                <div class="block is-shadowless has-text-centered">
                  <a :href="this.farm.urladdress" target="_blank" class="blockchain-address">{{this.farm.address}}</a>
                </div>

                <hr>-->

                <!-- Basic Farm Info -->
                <!-- <table class="table is-narrow">
                    <tbody>
                        <tr>
                            <th>Start Block:</th>
                            <td>{{$masterchef.startBlock}}</td>
                        </tr>
                        <tr>
                            <th>End Block:</th>
                            <td>{{$masterchef.endBlock}}</td>
                        </tr>
                        <tr>
                            <th>Reward / Block</th>
                            <td>{{ $masterchef.efxPerBlock }}</td>
                        </tr>
                        <tr>
                            <th>LP Locked:</th>
                            <td>{{this.farm.lockedTokens}}</td>
                        </tr>
                        <tr>
                            <th>EFX Reserves:</th>
                            <td>{{ this.farm.efxReserves }}</td>
                        </tr>
                        <tr>
                            <th>wBNB Reserves:</th>
                            <td>{{ this.farm.wbnbReserves }}</td>
                        </tr>
                        <tr>
                            <th>APR: </th>
                            <td>{{this.farm.apr}}</td>
                        </tr>
                    </tbody>
                </table>
              </div>

            <hr>
            </div> -->


            <div v-if="bscWallet">
              <div v-if="$masterchef.approved">

                <h3>Harvest EFX</h3>
                <div class="is-size-7 columns mb-0 is-mobile">
                        <div class="column py-0">
                            Rewards
                        </div>
                        <div class="column has-text-right py-0">
                            Staked LP tokens:
                            <span v-if="$masterchef.stakedLpBalance !== null">{{parseFloat($masterchef.stakedLpBalance)}}</span>
                            <span v-else>-</span>
                        </div>
                  </div>
                <div class="field has-addons">
                    <div class="control is-flex-grow-1">
                      <input class="input is-medium" disabled :value="bscWallet ? $masterchef.pendingEfx : '- login with your BSC wallet -'" type="text" />
                    </div>
                    <p class="control">
                      <a class="button is-static is-medium">EFX</a>
                    </p>
                </div>
                <button :disabled="!lpAmount || !bscWallet || pendingEFX < 1" class="button is-medium is-accent is-fullwidth mt-5" @click="claimPendingEFX()">
                    <strong>Claim Rewards 🎉</strong>
                </button>
                <hr>

                <h3>Lock LP tokens</h3>
                <div class="is-size-7 columns mb-0 is-mobile">
                      <div class="column py-0">
                          Amount
                      </div>
                      <div class="column has-text-right py-0">
                          Balance:
                          <span v-if="$masterchef.lpBalance !== null"><a @click="lpAmount = $masterchef.lpBalance">{{parseFloat($masterchef.lpBalance)}}</a></span>
                          <span v-else>-</span>
                      </div>
                  </div>
                  <div class="field has-addons">
                      <div class="control is-flex-grow-1">
                          <!-- What is the minimum LP that can be staked? -->
                          <input class="input is-medium" type="number" placeholder="Minumum 1 LP" min="0" v-model="lpAmount">
                      </div>
                      <p class="control">
                          <a class="button is-static is-medium">LP</a>
                      </p>
                  </div>
                  <button :disabled="!lpAmount || !bscWallet || lpAmount < 1" class="button is-medium is-accent is-fullwidth mt-5" @click="depositLpIntoMasterChef(lpAmount)">
                      <strong>Stake LP 🚜</strong>
                  </button>
                  <hr>         
              </div>
              <div v-else>
                <div class="is-size-7 columns mb-0 is-mobile">
                  <button class="button is-medium is-accent is-fullwidth mt-5" @click="approveAllowance()">
                      <strong>Approve</strong>
                  </button>
                </div>
                <hr>
              </div>              
                <div class="notification is-success" v-if="success">
                    <button @click="success = null" class="delete"></button>
                    {{success}}
                </div>
                <div class="notification is-danger" v-if="error">
                    <button @click="error = null" class="delete"></button>
                    {{error}}
                </div>  
                <div v-if="loading" class="loader-wrapper is-active">
                    <div class="loader is-loading"/>
                </div>         
            </div>
            <br>
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
            success: null,
            error: null,
            loading: false,
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
        async depositLpIntoMasterChef(lpAmount) {
            this.success, this.error = null;
            this.loading = true;
            try {                
                await this.$masterchef.depositLpIntoMasterChef(lpAmount);
                this.success = 'Successfuly deposited LP tokens!'                   
            } catch (error) {
                this.error = error.message
            }
            this.loading = false;
        },
        async approveAllowance() {
            this.success, this.error = null;
            this.loading = true;
            try {                
                await this.$masterchef.approveAllowance();
            } catch (error) {
                this.error = error.message
            }
            this.loading = false;
        },
        async claimPendingEFX() {
            this.success, this.error = null;
            this.loading = true;
            try {                
                await this.$masterchef.claimPendingEFX();
            } catch (error) {
                this.error = error.message
            }
            this.loading = false;
        }
    },
    created() {
        // TODO when this page is mounted load in basic farm info; apr, liquidity, multiplier
        this.farm.startDate = "TBA"
        this.farm.address = process.env.NUXT_ENV_MASTERCHEF_CONTRACT
        this.farm.urladdress = `https://bscscan.com/address/${process.env.NUXT_ENV_MASTERCHEF_CONTRACT}`
        this.farm.efxPerBlock = this.$masterchef.efxPerBlock
        this.farm.lockedTokens = this.$masterchef.lockedTokens
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
.title {
    font-family: $family-sans-serif;
}
</style>
