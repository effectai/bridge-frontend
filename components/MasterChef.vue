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
                <h4>Active Farms:</h4>
                <div :key="farm.id" v-for="(farm) in activeFarms" class="box farm">                        
                    <nuxt-link :to="'/farms/' + farm.id" style="width: 100%">
                        <div class="is-flex is-flex-direction-row is-align-items-center">
                            <img src="~assets/img/token-logo.png" style="height: 30px;" />
                            <h5>{{farm.title}}</h5>
                             <div class="is-flex is-flex-direction-column">
                                <span>Staked</span>
                                <span>0 LP Tokens</span>
                            </div>
                            <div class="is-flex is-flex-direction-column">
                                <span>APR</span>
                                <span>{{farm.apr}}%</span>
                            </div>
                        </div>
                    </nuxt-link>
                </div>
                <br>
                <h4>Finished Farms:</h4>
                <div :key="farm.id" v-for="farm in finishedFarms" class="box farm">
                    <nuxt-link :to="'/farms/' + farm.id" style="width: 100%">
                        <div class="is-flex is-flex-direction-row is-align-items-center">
                            <img src="~assets/img/token-logo.png" style="height: 30px;" />
                            <h5>{{farm.title}}</h5>
                            <div class="is-flex is-flex-direction-column">
                                <span>Staked</span>
                                <span>0 LP Tokens</span>
                            </div>
                            <div class="is-flex is-flex-direction-column">
                                <span>APR</span>
                                <span>{{farm.apr}}%</span>
                            </div>
                        </div>
                    </nuxt-link>
                </div>
            
                <div v-if="loading" class="loader-wrapper is-active">
                    <div class="loader is-loading"/>
                    <br>
                    <p>Loading farms...</p>
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
            farms: null,
            activeFarms: [],
            finishedFarms: [],
            loading: false
        }
    },
    computed: {
        bscWallet() {
            return (this.$bsc) ? this.$bsc.wallet : null
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
        this.farms = this.$masterchef.farms
        this.prepareFarms()
    },
    methods: {
        async prepareFarms() {
            try {
                this.loading = true
                for (let i = 0; i < this.farms.length; i++) {
                    this.farms[i].apr = await this.$masterchef.calculateAPR(this.farms[i])      
                }
                // TODO replace this with checking start & end block
                this.activeFarms = this.farms.filter((el) => {
                    return el.active === true;
                })
                this.finishedFarms = this.farms.filter((el) => {
                    return el.active === false;
                }) 
                this.loading = false   
            } catch (error) {
                throw new Error(error)
            }
        }
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
.farm {
    h5 {
        margin-bottom: 0;
        margin-right: 30px;
    }
    img {
        margin-right: 8px;
    }
}
</style>
