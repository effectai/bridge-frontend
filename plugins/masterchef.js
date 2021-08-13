import Vue from 'vue'
import Web3 from 'web3'
import { BN, toWei } from "web3-utils";
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
          this.contractProvider = new Web3(currentProvider)
          this.pancakeContract = new this.contractProvider.eth.Contract(PancakePair, process.env.NUXT_ENV_PANCAKEPAIR_CONTRACT)
          this.bepContract = new this.contractProvider.eth.Contract(BEP20, process.env.NUXT_ENV_EFX_TOKEN_CONTRACT)
          this.masterchefContract = new this.contractProvider.eth.Contract(MasterChef, process.env.NUXT_ENV_MASTERCHEF_CONTRACT)
          this.status = "Contracts Loaded"
          this.status = "Contracts Loaded"
          console.log("MasterChef Contract Loaded")

          this.isApproved()
          this.updaterApproved = setInterval(() => this.isApproved(), 5000)
          this.updaterBalance = setInterval(() => this.getBalanceLpTokens(this.bscWallet[0]), 5000)

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

      getStatusApproval () {
        return this.approved
      },

      async isApproved() {
        if (this.updater != null) {
          clearInterval(this.updaterApproved)
        }
        try {
          const allowance = new BN(await this.pancakeContract.methods.allowance(this.bscWallet[0], process.env.NUXT_ENV_MASTERCHEF_CONTRACT).call())
          const booleanVal = MAXUINT256.lte(allowance)
          console.log(`isApproved: ${booleanVal}, maxuint256: ${MAXUINT256}, Allowance: ${allowance}`);
          this.approved = booleanVal
          return booleanVal
        } catch (error) {
          console.error(error)
        }
      },

      async approveAllowance() { // Needs to come from the user wallet
        try {
          this.updater = setInterval(() =>  this.isApproved(), 1000 )
          const approvalTX = await this.pancakeContract.methods.approve(process.env.NUXT_ENV_MASTERCHEF_CONTRACT, MAXUINT256).send({ from: this.bscWallet[0] })
          this.approved = true
          return approvalTX
        } catch (error) {
          this.isApproved = false
          console.error(error);
        }
      },

      async depositLpIntoMasterChef(amount) {
        try {
          console.log(`Depositing ${toWei(new BN(amount))} LP into MasterChef`)
          return await this.masterchefContract.methods.deposit(toWei(amount)).send({ from: this.bscWallet[0] })
        } catch (error) {
          console.error(error);
        }
      },

      async getBalanceLpTokens (address) {
        try {
          const balance = await this.pancakeContract.methods.balanceOf(address).call()
          console.log(`Balance of ${address} is ${toWei(balance)} LP`)
          this.lpBalance = toWei(balance)
          return toWei(balance)
        } catch (error) {
          console.error(error);
        }
      }
    },
    created() {

    },
    mounted() {
    }

  })

  inject('masterchef', masterchef)

}
