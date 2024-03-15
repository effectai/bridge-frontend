<template>
    <div>
        <div class="box is-horizontal-centered px-6 content" style="max-width: 550px">
            <!-- Notification banner -->
            <!-- <div class="notification is-warning is-light">
                The bridge is currently under maintenance. Please come back later.
            </div> -->
            <div class="notification is-danger is-light has-text-centered">
                <strong>Notice:</strong>
                <p class="has-text-left">
                    <br> A minimum 10$ fee has been introduced by pNetwork, $10 for each transaction that doesn’t meet the
                    breakeven point.
                    Transactions above the breaking point will be charged 0.25% for pegins (BSC to EOS) and 0.1% for
                    pegouts (EOS to BSC).
                    <br>
                    <br>Pegin (BSC to EOS) breakeven point: $10,000 ($10/0.25%)
                    <br>Pegout (EOS to BSC) breakeven point: $4,000 ($10/0.1%)
                    <br>
                    <br>Going forward a minimum of 5000 EFX is required to swap.
                </p>
                <p class="has-text-centered">
                    <br><a href="https://ipfs.io/ipfs/QmWDApJT7GjBDmHgcZcxvopry2XsVJfLY5Jg8k2oPzaWpD" target="_blank"
                        rel="noopener noreferrer">Read more about it here.</a>
                </p>
            </div>
            <div class="columns is-vcentered" :class="{ 'is-flex-direction-row-reverse': !swapFromEOS }">
                <div class="column is-align-self-stretch is-5 ">
                    <small class="is-size-7"><span v-if="swapFromEOS">From</span><span v-else>To</span></small>
                    <div class="box is-shadowless has-border has-text-centered is-fullheight">
                        <div class="subtitle has-text-weight-semibold mb-2">EOS</div>
                        <img src="~assets/img/EOS-logo.svg" height="100" />
                        <div v-if="!eosWallet">
                            <a class="button is-small is-accent" @click="$eos.loginModal = true">
                                <strong>Connect EOS</strong>
                            </a>
                        </div>
                        <div v-else>
                            <a :href="$eos.explorer + '/account/' + eosWallet.auth.accountName" target="_blank"
                                class="blockchain-address">{{ eosWallet.auth.accountName }}</a>
                            <a class="has-text-danger" @click="$eos.logout()">
                                <small class="is-size-7">Disconnect</small>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="column switch is-2 has-text-centered">
                    <a class="has-text-centered" @click="switchChains">
                        <i class="fas fa-exchange-alt"></i><br>
                        <small class="is-size-7"><a @click="">switch</a></small>
                    </a>
                </div>
                <div class="column is-align-self-stretch is-5">
                    <small class="is-size-7"><span v-if="swapFromEOS">To</span><span v-else>From</span></small>
                    <div class="box is-shadowless has-border has-text-centered">
                        <div class="subtitle has-text-weight-semibold mb-2">BSC</div>
                        <img src="~assets/img/BSC-logo.svg" height="100" />
                        <div v-if="!bscWallet">
                            <a class="button is-small is-accent" @click="$bsc.loginModal = true">
                                <strong>Connect BSC</strong>
                            </a>
                        </div>
                        <div v-else>
                            <a :href="$bsc.explorer + '/address/' + bscWallet[0]" target="_blank"
                                class="blockchain-address">{{ bscWallet[0] }}</a>
                            <a class="has-text-danger" @click="$bsc.logout()">
                                <small class="is-size-7">Disconnect</small>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="is-size-7 columns mb-0 is-mobile">
                <div class="column py-0">
                    Send:
                </div>
                <div class="column has-text-right py-0">
                    Balance:
                    <span v-if="swapFromEOS">
                        <span v-if="$eos.efxAvailable !== null"><a @click="efxAmount = $eos.efxAvailable">{{
                            $eos.efxAvailable }}</a></span>
                        <span v-else>-</span>
                    </span>
                    <span v-else>
                        <span v-if="$bsc.efxAvailable !== null"><a @click="efxAmount = $bsc.efxAvailable">{{
                            $bsc.efxAvailable }}</a></span>
                        <span v-else>-</span>
                    </span>
                </div>
            </div>
            <div class="field has-addons">
                <div class="control is-flex-grow-1">
                    <input class="input is-medium" type="number" placeholder="Minumum 5000 EFX" min="5000"
                        v-model="efxAmount">
                </div>
                <p class="control">
                    <a class="button is-static is-medium">EFX</a>
                </p>
            </div>

            <br>
            <div class="is-size-7 columns mb-0 is-mobile">
                <div class="column py-0">
                    Receive:
                </div>
            </div>
            <div class="field has-addons">
                <div class="control is-flex-grow-1">
                    <input disabled class="input is-medium" type="number" placeholder="Receive" min="0"
                        v-model="userWillReceive">
                </div>
                <p class="control">
                    <a class="button is-static is-medium">EFX</a>
                </p>
            </div>

            <br>
            <div class="is-size-7 columns mb-0 is-mobile">
                <div class="column py-0">
                    Fees:
                </div>
            </div>
            <div class="field has-addons">
                <div class="control is-flex-grow-1">
                    <input disabled class="input is-medium" type="number" placeholder="Fees" min="0"
                        v-model="userWillPayInFees">
                </div>
                <p class="control">
                    <a class="button is-static is-medium">EFX</a>
                </p>
            </div>

        <div class="is-size-7">
            To your <span v-if="swapFromEOS">BSC Address</span><span v-else>EOS Account</span>
        </div>
        <div class="field">
            <input class="input" disabled
                :value="swapFromEOS ? (bscWallet ? bscWallet[0] : '- login with your BSC wallet -') : (eosWallet ? eosWallet.auth.accountName : '- login with your EOS wallet -')"
                type="text" />
        </div>
        <button :disabled="!efxAmount || !eosWallet || !bscWallet || efxAmount < 5000"
            class="button is-medium is-accent is-fullwidth mt-5" @click="onSwap">
            <strong>Swap</strong>
        </button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            swapFromEOS: true,
            efxAmount: null,
            assets: null,
            minimumEfxAmount: 5000,
        }
    },
    async created() {
        this.assets = await this.$ptokens.initAssets()
    },
    computed: {
        // EOS
        eosWallet() {
            return (this.$eos) ? this.$eos.wallet : null
        },
        bscWallet() {
            return (this.$bsc) ? this.$bsc.wallet : null
        },
        userWillReceive() {
            if (this.efxAmount && this.assets) {
                const minimumEfx = Number(this.assets.eosioAsset._assetInfo.fees.minNodeOperatorFee) / Number(1e18)
                const minimumUsd = Number(this.assets.eosioAsset._assetInfo.fees.minNodeOperatorFeeUsd)
                const percentage = this.assets.eosioAsset._assetInfo.fees.basisPoints.nativeToHost / 10000 // 0.10%
                const breakEvenPointEfx = minimumEfx / percentage
                const breakEvenPointUsd = minimumUsd / percentage
                if (this.swapFromEOS) {
                    if (this.efxAmount < breakEvenPointEfx) {
                        return this.efxAmount - minimumEfx
                    } else {
                        return this.efxAmount - (this.efxAmount * percentage)
                    }
                } else {
                    if (this.efxAmount < breakEvenPointEfx) {
                        return this.efxAmount - minimumEfx
                    } else {
                        return this.efxAmount - (this.efxAmount * percentage)
                    }
                }
            }
        },
        userWillPayInFees() {
            if (this.efxAmount && this.assets) {
                const minimumEfx = Number(this.assets.eosioAsset._assetInfo.fees.minNodeOperatorFee) / Number(1e18)

                if (this.swapFromEOS) {
                    // EOS -> BSC
                    const networkFee = this.assets.bscAsset._assetInfo.fees.networkFee / Number(1e18)
                    const percentage = this.assets.eosioAsset._assetInfo.fees.basisPoints.nativeToHost / 10000 // 0.10%
                    const breakEvenPointEfx = minimumEfx / percentage
                    if (this.efxAmount < breakEvenPointEfx) {
                        return minimumEfx + networkFee
                    } else {
                        return (this.efxAmount * percentage) + networkFee
                    }
                } else {
                    // BSC -> EOS
                    const percentage = this.assets.bscAsset._assetInfo.fees.basisPoints.hostToNative / 10000 // 0.25%
                    const breakEvenPointEfx = minimumEfx / percentage
                    const networkFee = 0
                    if (this.efxAmount < breakEvenPointEfx) {
                        return minimumEfx + networkFee
                    } else {
                        return (this.efxAmount * percentage) + networkFee
                    }
                }
            }
        },
        eosToBscFees() {
            /**
             * users will pay $10 for each transaction that doesn’t meet the breakeven point.
             * After the breakeven point they will pay 0.10% of the amount.
             * Pegout breakeven point: $4,000 ($10/0.1%)
             */
            if (this.assets) {
                const minimumEfx = Number(this.assets.eosioAsset._assetInfo.fees.minNodeOperatorFee) / Number(1e18)
                const minimumUsd = Number(this.assets.eosioAsset._assetInfo.fees.minNodeOperatorFeeUsd)
                const percentage = this.assets.eosioAsset._assetInfo.fees.basisPoints.nativeToHost / 10000 // 0.10%
                const breakEvenPointEfx = minimumEfx / percentage
                const breakEvenPointUsd = minimumUsd / percentage
                return {
                    type: 'native-to-host',
                    roundedMinimumEfx: Math.ceil(minimumEfx),
                    minimumEfx,
                    minimumUsd,
                    percentage,
                    breakEvenPointEfx,
                    breakEvenPointUsd,
                    networkFee: 0
                }
            } else {
                return null
            }
        }, // EOS -> BSC
        bscToEos() {
            /**
             * users will pay $10 for each transaction that doesn’t meet the breakeven point.
             * After the breakeven point they will pay 0.25% of the amount.
             * Pegin breakeven point: $10,000 ($10/0.25%)
             */
            if (this.assets) {
                const minimumEfx = Number(this.assets.bscAsset._assetInfo.fees.minNodeOperatorFee) / Number(1e18)
                const minimumUsd = Number(this.assets.bscAsset._assetInfo.fees.minNodeOperatorFeeUsd)
                const percentage = this.assets.bscAsset._assetInfo.fees.basisPoints.hostToNative / 10000 // 0.25%
                const breakEvenPointEfx = minimumEfx / percentage
                const breakEvenPointUsd = minimumUsd / percentage
                const networkFee = this.assets.bscAsset._assetInfo.fees.networkFee
                return {
                    type: 'host-to-native',
                    roundedMinimumEfx: Math.ceil(minimumEfx),
                    minimumEfx,
                    minimumUsd,
                    percentage,
                    breakEvenPointEfx,
                    breakEvenPointUsd,
                    networkFee
                }
            } else {
                return null
            }
        } // BSC -> EOS
    },
    methods: {
        switchChains() {
            this.swapFromEOS = !this.swapFromEOS
            this.efxAmount = null
        },
        async onSwap() {
            await this.$ptokens.init(this.$bsc)
            this.$router.push('/swap-progress')

            if (this.swapFromEOS) {
                try {
                    await this.$ptokens.swapEosToBsc(this.efxAmount)
                } catch (e) {
                    console.error('swap ptokes.swapEosToBsc() error', e)
                    this.swapError = e.message
                }
            } else {
                try {
                    // alert('This feature is disabled for now.')
                    await this.$ptokens.swapBscToEos(this.efxAmount)
                } catch (e) {
                    console.error('swap ptokes.swapBscToEos() error', e)
                    this.swapError = e.message
                }
            }
        },
    },
    mounted() {
        this.$ptokens.resetSwap()
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
