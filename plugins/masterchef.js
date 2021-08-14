import Vue from 'vue'
import Web3 from 'web3'
import { BN, toWei, fromWei } from "web3-utils";
import { abi as PancakePair } from "@/static/abi/PancakePair.json"
import { abi as BEP20 } from "@/static/abi/BEP20.json"
import { abi as MasterChef } from "@/static/abi/MasterChef.json"

const bscWeb3 = new Web3(process.env.NUXT_ENV_BSC_RPC)
const PancakePairContract = new bscWeb3.eth.Contract(PancakePair, process.env.NUXT_ENV_PANCAKEPAIR_CONTRACT)
const Bep20Contract = new bscWeb3.eth.Contract(BEP20, process.env.NUXT_ENV_EFX_TOKEN_CONTRACT)
const MasterChefContract = new bscWeb3.eth.Contract(MasterChef, process.env.NUXT_ENV_MASTERCHEF_CONTRACT)
const MAXUINT256 = new BN("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");

export default (context, inject) => {

  const masterchef = new Vue({
    data() {
      return {
        status: null,
        error: null,
        pancakeContract: null,
        bepContract: null,
        masterchefContract: null,
        approved: null,
        updaterApproved: null,
        updaterBalance: null,
        lpBalance: null,
        lpReserves: null,
        lpEfxReserves: null,
        lpWbnbReserves: null,
        lpEndDate: null,
        pendingEfx: null,
        updaterPendingEfx: null,
        lockedTokens: null,
        efxPerBlock: null,
        startBlock: null,
        endBlock: null,
      }
    },
    computed: {
      loggedInBscProvider () {
        (context.$bsc) ? this.init(context.$bsc.currentProvider) : null
      },

      bscWallet () {
        return (context.$bsc) ? context.$bsc.wallet : null
      },
    },
    methods: {

      init (currentProvider) {
        try {
          this.status = "Loading Contracts"
          const provider = Boolean(currentProvider) ? currentProvider : process.env.NUXT_ENV_BSC_RPC
          this.contractProvider = new Web3(provider)
          this.pancakeContract = new this.contractProvider.eth.Contract(PancakePair, process.env.NUXT_ENV_PANCAKEPAIR_CONTRACT)
          this.bepContract = new this.contractProvider.eth.Contract(BEP20, process.env.NUXT_ENV_EFX_TOKEN_CONTRACT)
          this.masterchefContract = new this.contractProvider.eth.Contract(MasterChef, process.env.NUXT_ENV_MASTERCHEF_CONTRACT)
          this.status = "Contracts Loaded"
          this.status = "Contracts Loaded"
          console.log("MasterChef Contract Loaded")

          this.isApproved()
          this.getLpReserves()
          this.getLockedLpTokens()
          this.getMasterChefInfo()
          this.getPendingEFX()
          // this.getCakePerBlock()
          setInterval(() => this.getLpReserves(), 60e3); // 60 seconds
          this.updaterApproved = setInterval(() => this.isApproved(), 1e3) // 5 seconds
          this.updaterBalance = setInterval(() => this.getBalanceLpTokens(this.bscWallet[0]), 10e3) // 10 seconds
          this.updaterPendingEfx = setInterval(() => this.getPendingEFX(), 5e3) // 5 seconds

        } catch (error) {
          this.status = "Error loading contracts"
          this.error = error.message
          console.error(error)
        }
      },

      updateAccount () {
        if(this.bscWallet) {
          this.getBalanceLpTokens(this.bscWallet[0])
          this.isApproved()
        }
      },

      async isApproved() {
        if (this.updaterApproved != null) {
          clearInterval(this.updaterApproved)
        }
        try {
          const allowance = new BN(await this.pancakeContract.methods.allowance(this.bscWallet[0], process.env.NUXT_ENV_MASTERCHEF_CONTRACT).call())
          const booleanVal = MAXUINT256.lte(allowance)
          console.log(`isApproved: ${booleanVal}, maxuint256: ${MAXUINT256}, Allowance: ${allowance}`);
          this.approved = booleanVal
          return booleanVal
        } catch (error) {
          console.error('pancakeContract#isApproved', error)
        }
      },

      async approveAllowance() { // Needs to come from the user wallet
        try {
          this.updater = setInterval(() =>  this.isApproved(), 1000 )
          const approvalTX = await this.pancakeContract.methods.approve(process.env.NUXT_ENV_MASTERCHEF_CONTRACT, MAXUINT256).send({ from: this.bscWallet[0] })
          this.approved = true
          return approvalTX
        } catch (error) {
          this.approved = false
          console.error('pancakeContract#approveAllowance', error);
        }
      },

      async depositLpIntoMasterChef(amount) {
        try {
          console.log(`Depositing ${toWei(new BN(amount))} LP into MasterChef`)
          return await this.masterchefContract.methods.deposit(toWei(amount)).send({ from: this.bscWallet[0] })
        } catch (error) {
          console.error('masterChefContract#depositLpIntoMaster', error);
        }
      },

      async getBalanceLpTokens () {
        try {
          const balance = await this.pancakeContract.methods.balanceOf(this.bscWallet[0]).call()
          console.log(`Balance of ${this.bscWallet[0]} is ${fromWei(balance)} LP`)
          this.lpBalance = fromWei(balance)
          return toWei(balance)
        } catch (error) {
          console.error('pancakeContract#getBalanceLpTokens', error);
        }
      },

      async getPendingEFX () {
        try {
          const pendingEFX = await this.masterchefContract.methods.pendingEfx(this.bscWallet[0]).call()
          console.log(`Pending EFX is ${pendingEFX}`)
          this.pendingEfx = pendingEFX
          return pendingEFX
        } catch (error) {
          console.error('Masterchef#getPendingEfx', error);
        }
      },

      async claimPendingEFX () {
        try {
          const claimEFX = await this.masterchefContract.methods.withdraw(0).send({ from: this.bscWallet[0] })
          console.log(`Claimed ${toWei(claimEFX)} LP`)
          return claimEFX
        } catch (error) {
          console.error('Masterchef#claimPendingEfx', error);
        }
      },

      async getLpReserves () {
        try {
          const reserves = await this.pancakeContract.methods.getReserves().call()
          console.log(`Reserves: ${JSON.stringify(reserves)} LP`)
          this.lpReserves = reserves
          this.lpEfxReserves = Number.parseFloat(fromWei(reserves[0])).toFixed(2)
          this.lpWbnbReserves = Number.parseFloat(fromWei(reserves[1])).toFixed(2)
          this.lpEndDate = (new Date(reserves["_blockTimestampLast"] * 1e3)).toDateString()
          return reserves
        } catch (error) {
          console.error('Pancake#getLpReserves', error);
        }
      },

      async getLockedLpTokens () {
        console.log("Getting Locked Lp Tokens")
        try {
          const lockedLpTokens = await this.pancakeContract.methods.balanceOf(process.env.NUXT_ENV_MASTERCHEF_CONTRACT).call()
          console.log(`Locked LP Tokens: ${fromWei(lockedLpTokens)} LP`)
          this.lockedTokens = Number.parseFloat(fromWei(lockedLpTokens)).toFixed(2)
          console.log(`Locked LP Tokens: ${this.lockedTokens}`)
          return fromWei(lockedLpTokens)
        } catch (error) {
          console.error('Pancake#getLockedLpTokens', error);
        }
      },

      async getMasterChefInfo () {
        try {
          const efxPerBlock = await this.masterchefContract.methods.efxPerBlock().call()
          const startBlock = await this.masterchefContract.methods.startBlock().call()
          const endBlock = await this.masterchefContract.methods.endBlock().call()

          this.efxPerBlock = efxPerBlock
          this.startBlock = startBlock
          this.endBlock = endBlock

        } catch (error) {
          console.error('Masterchef#getMasterChefInfo', error);
        }
      },

    },



    created() {
      this.init(context.$bsc.currentProvider)
      this.getLpReserves()
    },

    mounted() {
    }

  })

  inject('masterchef', masterchef)

}
