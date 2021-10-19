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

            <div class="box is-centered is-vcentered is-shadowless mb-0" v-if="bscWallet && endedStakedFarm">
                <div class="has-text-centered notification is-warning">
                    <h4 class="mb-2" style="line-height: 1.8rem">You still have LP tokens staked in an ended farm!</h4>
                    <p>Unstake your tokens on the <nuxt-link :to="'/farms/' + endedStakedFarm.id" style="width: 100%">farm page</nuxt-link></p>
                </div>
            </div>

            <div class="box is-centered is-vcentered is-shadowless">
                <h4>Active Farms:</h4>
                <div :key="farm.id" v-for="(farm) in activeFarms" class="box farm">
                    <nuxt-link :to="'/farms/' + farm.id" style="width: 100%">
                        <div class="is-flex is-flex-direction-row is-align-items-center is-justify-content-space-between" style="width: 100%">
                            <div class="is-flex is-flex-direction-row is-align-items-center">
                                <img src="~assets/img/token-logo.png" style="height: 30px;" />
                                <h5>{{farm.title}}</h5>
                            </div>
                             <div class="is-flex is-flex-direction-column farm-info" style="flex: 1" v-if="bscWallet">
                                <span>Staked</span>
                                <span>{{parseFloat(farm.userStaked).toFixed(2)}} LP</span>
                            </div>
                            <div class="is-flex is-flex-direction-column farm-info">
                                <span>APR</span>
                                <span>{{parseFloat(farm.apr).toFixed(0)}}%</span>
                            </div>
                        </div>
                    </nuxt-link>
                </div>
                <br>
                <h4>Finished Farms:</h4>
                <div :key="farm.id" v-for="farm in finishedFarms" class="box farm">
                    <nuxt-link :to="'/farms/' + farm.id" style="width: 100%">
                        <div class="is-flex is-flex-direction-row is-align-items-center is-justify-content-space-between" style="width: 100%">
                            <div class="is-flex is-flex-direction-row is-align-items-center">
                                <img src="~assets/img/token-logo.png" style="height: 30px;" />
                                <h5>{{farm.title}}</h5>
                            </div>
                            <div class="is-flex is-flex-direction-column farm-info" style="flex: 1" v-if="bscWallet">
                                <span>Staked</span>
                                <span>{{parseFloat(farm.userStaked).toFixed(2)}} LP</span>
                            </div>
                            <div class="is-flex is-flex-direction-column farm-info">
                              <button class="is-outlined is-small button">Farm ended</button>
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
            loading: false,
            endedStakedFarm: null,
        }
    },
    computed: {
        bscWallet() {
            return (this.$bsc) ? this.$bsc.wallet : null
        }
    },
    watch: {
        '$bsc.wallet': function() {
            if(this.$bsc.wallet) {
                this.getUserStakedTokens(this.$bsc.wallet)
                this.prepareFarms()
            }
        }
    },
    created() {
        this.farms = this.$masterchef.farms
        this.prepareFarms()
        this.getUserStakedTokens(this.$bsc.wallet)
    },
    methods: {
        async prepareFarms() {
            try {
                this.loading = true
                for (let i = 0; i < this.farms.length; i++) {
                    this.farms[i].apr = await this.$masterchef.calculateAPR(this.farms[i])
                }

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
        },
        async getUserStakedTokens(wallet) {
            if(wallet) {
                // for every farm get the staked LP tokens of the user
                for (let i = 0; i < this.farms.length; i++) {
                    this.farms[i].userStaked = await this.$masterchef.getStakedLpTokens(wallet[0], this.farms[i])
                    if(this.farms[i].userStaked > 0 && !this.farms[i].active) {
                        this.endedStakedFarm = this.farms[i]
                    }
                }
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
        margin-right: 40px;
    }
    img {
        margin-right: 8px;
    }
}

.farm-info {
    &:last-child {
        align-self: right;
    }
    span {
        color: black;
        &:first-child {
            font-size: .75rem;
        }
    }
}
</style>
