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

            <div v-if="bscWallet">
              <div v-if="!liveFarm" class="has-text-centered my-6">
                <p class="has-text-danger">Farm starts at block {{$masterchef.startBlock}} and ends at block {{$masterchef.endBlock}}
                  <br>Current block: <a :href="$bsc.explorer + '/blocks'" target="_blank">{{$masterchef.latestBlockNumber}}</a></p>
              </div>
                <div v-if="$masterchef.approved === null">
                    Loading approval state..
                </div>
                <div v-else-if="$masterchef.approved">

                    <h3>Harvest EFX</h3>
                    <div class="is-size-7 columns mb-0 is-mobile">
                            <div class="column py-0">
                                Rewards
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
                    <button :disabled="!bscWallet || $masterchef.pendingEfx < 1" class="button is-medium is-accent is-fullwidth mt-5" @click="claimPendingEFX()">
                        <strong>Harvest</strong>
                    </button>
                    <hr>

                    <h3 class="mb-2">Stake/unstake LP tokens</h3>
                    <h4 class="subtitle is-6 has-text-weight-light mb-0 mt-0">LP tokens staked:
                        <span v-if="$masterchef.stakedLpBalance !== null">{{parseFloat($masterchef.stakedLpBalance)}}</span>
                        <span v-else>-</span>
                    </h4>
                    <p class="mb-5">
                        <a :href="$masterchef.lpPool" target="_blank">Get LP tokens</a>
                    </p>

                    <div class="is-size-7 columns mb-0 mt-4 is-mobile">
                        <div class="column py-0">
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

                    <div v-if="activeForm == 'stake'">
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
                                <input class="input is-medium" type="number" placeholder="Minumum 1 LP" min="0" v-model="lpAmount">
                                <span class="control icon is-right max-amount" v-if="$masterchef.lpBalance !== null">
                                    <a @click="lpAmount = $masterchef.lpBalance">Max</a>
                                </span>
                            </div>

                            <p class="control">
                                <a class="button is-static is-medium">LP</a>
                            </p>
                        </div>
                        <button :disabled="!lpAmount || lpAmount < 1" class="button is-medium is-accent is-fullwidth mt-5" @click="depositLpIntoMasterChef(lpAmount)">
                            <strong>Stake LP</strong>
                        </button>
                        <hr>
                    </div>
                    <div v-else-if="activeForm == 'unstake'">
                        <div class="is-size-7 columns mb-0 mt-5 is-mobile">
                                <div class="column py-0">
                                    Amount
                                </div>
                                <div class="column has-text-right py-0">
                                    LP tokens staked:
                                    <span v-if="$masterchef.stakedLpBalance !== null"><a @click="stakedLpAmount = $masterchef.stakedLpBalance">{{parseFloat($masterchef.stakedLpBalance)}}</a></span>
                                    <span v-else>-</span>
                                </div>
                        </div>

                        <div class="field has-addons">
                            <div class="control is-flex-grow-1 has-icons-right">
                                <input class="input is-medium" type="number" placeholder="Minumum 1 LP" min="0" v-model="stakedLpAmount">
                                <span class="control icon is-right max-amount" v-if="$masterchef.stakedLpBalance !== null">
                                    <a @click="stakedLpAmount = $masterchef.stakedLpBalance">Max</a>
                                </span>
                            </div>
                            <p class="control">
                                <a class="button is-static is-medium">LP</a>
                            </p>
                        </div>
                        <button :disabled="!stakedLpAmount || stakedLpAmount < 1" class="button is-medium is-accent is-fullwidth mt-5" @click="withdrawLpFromMasterChef(stakedLpAmount)">
                            <strong>Unstake LP</strong>
                        </button>
                        <hr>
                    </div>
                </div>
                <div v-else>
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
    </div>
</template>

<script>

export default {
    data() {
        return {
            activeForm: null,
            lpAmount: null,
            stakedLpAmount: null,
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
        },
        liveFarm() {
            return this.$masterchef.startBlock < this.$masterchef.latestBlockNumber && this.$masterchef.endBlock > this.$masterchef.latestBlockNumber
        }
    },
    methods: {
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
        async withdrawLpFromMasterChef(stakedLpAmount) {
            this.success, this.error = null;
            this.loading = true;
            try {
                await this.$masterchef.withdrawLpFromMasterChef(stakedLpAmount);
                this.success = 'Successfuly withdrawed LP tokens'
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
    created() {
        // this.farm.startDate = "TBA"
        // this.farm.address = process.env.NUXT_ENV_MASTERCHEF_CONTRACT
        // this.farm.urladdress = `https://bscscan.com/address/${process.env.NUXT_ENV_MASTERCHEF_CONTRACT}`
        // this.farm.efxPerBlock = this.$masterchef.efxPerBlock
        // this.farm.lockedTokens = this.$masterchef.lockedTokens
        // this.farm.wbnbReserves = fromWei(this.$masterchef.lpReserves[0]) || "N/A"
        // this.farm.efxReserves = fromWei(this.$masterchef.lpReserves[1]) || "N/A"
        // this.farm.endDate = this.$masterchef.lpEndDate || "N/A"
        // this.farm.apr = "N/A"
        // this.farm.startBlock = this.$masterchef.startBlock
        // this.farm.endBlock = this.$masterchef.endBlock
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
