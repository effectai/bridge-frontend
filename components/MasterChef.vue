<template>
    <div>
        <div class="box is-horizontal-centered is-centered px-6 content" style="max-width: 550px">
            <h3 class="title has-text-centered is-4 mt-5 mb-3">Stake your EFX-BNB LP</h3>
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

            <div class="box is-centered is-vcentered is-shadowless">
                <div class="column">
                    <h4>Active Farms:</h4>
                    <div :key="farm.id" v-for="(farm) in activeFarms" class="box tile">
                        <nuxt-link :to="'/farms/' + farm.id">
                            <img src="~assets/img/logo.svg" style="height: 30px;" />
                            {{farm.id}}
                            {{farm.contract}}
                        </nuxt-link>
                    </div>
                    <h4>Finished Farms:</h4>
                    <div :key="farm.id" v-for="farm in finishedFarms" class="box tile">
                        <nuxt-link :to="'/farms/' + farm.id">
                            <img src="~assets/img/logo.svg" style="height: 30px;" />
                            {{farm.id}}
                            {{farm.contract}}
                        </nuxt-link>
                    </div>
                </div>
            </div>
            <br>
        </div>
    </div>
</template>

<script>

export default {
    props: ['farms'],
    data() {
        return {
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
        }
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
        this.activeFarms = this.farms.filter((el) => {
            return el.active === true;
        })
        this.finishedFarms = this.farms.filter((el) => {
            return el.active === false;
        })
        this.$masterchef.calculateAPR()
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
