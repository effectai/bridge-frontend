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
    <div class="box is-horizontal-centered is-centered px-6 content" style="max-width: 550px">
        <nuxt-link to="/farms">< Back</nuxt-link>
        <h3 class="title has-text-centered is-4 mt-5 mb-3">Stake your EFX-BNB LP</h3>
        <h4 class="subtitle is-6 has-text-centered has-text-weight-light mb-5 mt-2">And earn EFX rewards!</h4>
        <div class="columns is-vcentered is-centered mt-3">
            <div class="column is-align-self-stretch is-5">
                <div class="box is-shadowless has-border has-text-centered">
                    <div class="subtitle has-text-weight-semibold mb-2">BSC</div>
                    <img v-if="!bscWallet" src="~assets/img/BSC-logo.svg" height="100" />
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
            <div v-if="endedFarm" class="has-text-centered my-5 notification is-warning">
                <h4 class="mb-2">Farm ended</h4>
                <p>This farm ended at {{new Date($masterchef.endDate * 1000).toISOString().slice(0, 10)}} <br>
                If you still have LP tokens staked, you should unstake them below.</p>
            </div>
            <div v-else-if="notStartedFarm" class="has-text-centered my-5 notification is-warning">
                <h5>Farm not started yet</h5>
                <p>Starts at: <a :href="$bsc.explorer + '/block/' + $masterchef.startBlock" target="_blank">{{$masterchef.startBlock}}</a>
                <br>Current block: {{$masterchef.latestBlockNumber}}</p>
            </div>
        </div>

        <div class="column">
            <div class="has-text-centered">
                <h4>Farm info:</h4>
                </div>
                <div class=" has-text-centered">
                <a :href="$bsc.explorer + '/address/' + farm.contract" target="_blank" class="blockchain-address">{{farm.contract}}</a>
            </div>

            <!-- Basic Farm Info -->
            <table class="table is-narrow">
            <tbody>
            <tr>
                <th>End Date:</th>
                <td v-if="$masterchef.endDate">{{new Date($masterchef.endDate * 1000).toISOString().slice(0, 10)}}</td>
                <td v-else>...</td>
            </tr>
            <tr>
                <th>EFX Reward / Day</th>
                <td>{{ Math.round($masterchef.efxPerBlock/1e18 * 28800) }}</td>
            </tr>
            <tr>
                <th>EFX-BNB LP Locked</th>
                <td>{{$masterchef.lockedTokens}}</td>
            </tr>
            <tr>
                <th>APR</th>
                <td v-if="$masterchef.apr">{{$masterchef.apr}}%</td>
                <td v-else>...</td>
            </tr>
            </tbody>
            </table>
        </div>

        <div v-if="bscWallet">
            <div v-if="$masterchef.approved === null">
                Loading approval state..
            </div>
            <div v-else-if="$masterchef.approved">
                <!-- Harvest EFX -->
                <div v-if="!notStartedFarm">
                    <h4>Harvest EFX</h4>
                    <div class="is-size-7 columns mb-0 is-mobile">
                            <div class="column py-0">
                                Rewards
                            </div>
                    </div>
                    <div class="field has-addons">
                        <div class="control is-flex-grow-1">
                        <input class="input is-medium" disabled :value="bscWallet ? parseFloat($masterchef.pendingEfx).toFixed(2) : '- login with your BSC wallet -'" type="text" />
                        </div>
                        <p class="control">
                        <a class="button is-static is-medium">EFX</a>
                        </p>
                    </div>
                    <button :disabled="!bscWallet || $masterchef.pendingEfx < 1" class="button is-medium is-accent is-fullwidth mt-5" @click="claimPendingEFX()">
                        <strong>Harvest</strong>
                    </button>
                </div>
                <hr>

                <h4 class="mb-2">Staked EFX-BNB LP</h4>
                <h4 class="subtitle is-6 has-text-weight-light mb-0 mt-0">EFX-BNB LP staked:
                    <span v-if="$masterchef.stakedLpBalance !== null">{{parseFloat($masterchef.stakedLpBalance).toFixed(2)}}ll</span>
                    <span v-else>-</span>
                </h4>
                <p class="mb-5">
                    <a :href="$masterchef.lpPool" target="_blank">Get EFX-BNB LP</a>
                </p>

                <!-- Stake / unstake EFX -->
                <div class="is-size-7 columns mb-0 mt-4 is-mobile">
                    <div class="column py-0" v-if="!endedFarm">
                        <button :class="{'is-outlined': activeForm != 'stake'}" class="button is-medium is-primary is-fullwidth" @click="activeForm = 'stake'">
                            <strong>Stake</strong>
                        </button>
                    </div>

                    <div class="column py-0">
                        <button :class="{'is-outlined': activeForm != 'unstake'}" class="button is-medium is-primary is-fullwidth" @click="activeForm = 'unstake'">
                            <strong>Unstake</strong>
                        </button>
                    </div>
                </div>

                <div v-if="activeForm == 'stake' && !endedFarm">
                    <div class="is-size-7 columns mb-0 mt-5 is-mobile">
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
                        <div class="control is-flex-grow-1 has-icons-right">
                            <input class="input is-medium" type="number" placeholder="Minimum 1" min="0" v-model="lpAmount">
                            <span class="control icon is-right max-amount" v-if="$masterchef.lpBalance !== null">
                                <a @click="lpAmount = $masterchef.lpBalance">Max</a>
                            </span>
                        </div>

                        <p class="control">
                            <a class="button is-static is-medium">EFX-BNB LP</a>
                        </p>
                    </div>
                    <button :disabled="!lpAmount || lpAmount < 1" class="button is-medium is-accent is-fullwidth mt-5" @click="depositLpIntoMasterChef(lpAmount)">
                        <strong>Confirm Stake</strong>
                    </button>
                    <hr>
                </div>
                <div v-else-if="activeForm == 'unstake'">
                    <div class="is-size-7 columns mb-0 mt-5 is-mobile">
                            <div class="column py-0">
                                Amount
                            </div>
                            <div class="column has-text-right py-0">
                                EFX-BNB LP staked:
                                <span v-if="$masterchef.stakedLpBalance !== null"><a @click="stakedLpAmount = $masterchef.stakedLpBalance">{{parseFloat($masterchef.stakedLpBalance).toFixed(2)}}</a></span>
                                <span v-else>-</span>
                            </div>
                    </div>

                    <div class="field has-addons">
                        <div class="control is-flex-grow-1 has-icons-right">
                            <input class="input is-medium" type="number" placeholder="Minimum 1" min="0" v-model="stakedLpAmount">
                            <span class="control icon is-right max-amount" v-if="$masterchef.stakedLpBalance !== null">
                                <a @click="stakedLpAmount = $masterchef.stakedLpBalance">Max</a>
                            </span>
                        </div>
                        <p class="control">
                            <a class="button is-static is-medium">EFX-BNB LP</a>
                        </p>
                    </div>
                    <button :disabled="!stakedLpAmount || stakedLpAmount < 1" class="button is-medium is-accent is-fullwidth mt-5" @click="withdrawLpFromMasterChef(stakedLpAmount)">
                        <strong>Confirm Unstake</strong>
                    </button>
                    <hr>
                </div>
            </div>
            <div v-else-if="!$masterchef.approved">
                <div class="is-size-7 columns mb-0 is-mobile">
                    <button class="button is-medium is-accent is-fullwidth mt-5" @click="approveAllowance()">
                        <strong>Approve</strong>
                    </button>
                </div>
                <hr>
            </div>
            <div class="notification mt-5 is-success" v-if="success">
                <button @click="success = null" class="delete"></button>
                {{success}}
            </div>
            <div class="notification mt-5 is-danger" v-if="error">
                <button @click="error = null" class="delete"></button>
                {{error}}
            </div>
            <div v-if="loading" class="loader-wrapper is-active">
                <div class="loader is-loading"/>
                <br>
                <p>Waiting for the transaction to complete...</p>
            </div>
        </div>
        <br>
    </div>
    <br>
  </div>
</template>
<script>
import Tabs from '@/components/Tabs.vue';

export default {
    components: {
        Tabs
    },
    data () {
        return {
            id: parseInt(this.$route.params.id),
            farm: null,
            activeForm: null,
            lpAmount: null,
            stakedLpAmount: null,
            farm: {
              address: process.env.NUXT_ENV_MASTERCHEF_CONTRACT,
              urladdress: `https://bscscan.com/address/${process.env.NUXT_ENV_MASTERCHEF_CONTRACT}`
            },
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
        },
        liveFarm() {
            return this.$masterchef.startBlock < this.$masterchef.latestBlockNumber && this.$masterchef.endBlock > this.$masterchef.latestBlockNumber
        },
        endedFarm() {
            return this.$masterchef.endBlock < this.$masterchef.latestBlockNumber
        },
        notStartedFarm() {
            return this.$masterchef.startBlock > this.$masterchef.latestBlockNumber
        },

    },
    created() {
        this.farm = this.$masterchef.farms[this.id]
        this.$masterchef.init(this.$bsc.currentProvider, this.farm)
        this.$masterchef.calculateAPR()
    },
    methods: {
        async depositLpIntoMasterChef(lpAmount) {
            this.success, this.error = null;
            this.loading = true;
            try {
                await this.$masterchef.depositLpIntoMasterChef(lpAmount);
                this.success = 'Successfuly deposited LP tokens'
            } catch (error) {
                this.error = error.message
            }
            this.loading = false;
        },
        async withdrawLpFromMasterChef(stakedLpAmount) {
            this.success, this.error = null;
            this.loading = true;
            try {
                await this.$masterchef.withdrawLpFromMasterChef(stakedLpAmount);
                this.success = 'Successfuly withdrawn LP tokens'
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
                this.success = 'Successfuly claimed rewards!'
            } catch (error) {
                this.error = error.message
            }
            this.loading = false;
        }
    },
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

.max-amount {
    height: 100% !important;
    right: .4rem !important;
    font-size: .9rem !important;
    pointer-events: initial !important;
    z-index: 4 !important;
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
