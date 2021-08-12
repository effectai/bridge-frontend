import Vue from 'vue'
import Web3 from 'web3'
import { BN } from "web3-utils";
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
      }
    },
    computed: {
      loggedInBscProvider () {
        (context.$bsc) ? this.init(context.$bsc.currentProvider) : null
      }
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
          console.log("MasterChef Contract Loaded")
        } catch (error) {
          this.status = "Error loading contracts"
          this.error = error.message
          console.error(error)
        }
      },

      async isApproved() {
        try {
          const allowance = new BN(await this.pancakeContract.methods.allowance(context.$bsc.wallet[0], process.env.NUXT_ENV_MASTERCHEF_CONTRACT).call())
          console.log(`Allowance: ${allowance}, maxuint256: ${MAXUINT256},isApproved: ${allowance.eq(MAXUINT256)}`);
          return allowance.eq(MAXUINT256)
        } catch (error) {
          console.error(error)
        }
      },

      async approveAllowance() { // Needs to come from the user wallet
        try {
          return await this.pancakeContract.methods.approve(process.env.NUXT_ENV_MASTERCHEF_CONTRACT, MAXUINT256).send({ from: context.$bsc.wallet[0] })
        } catch (error) {
          console.error(error);
        }
      },

      async depositLpIntoMasterChef(amount) {
        try {
          return await this.masterchefContract.methods.deposit(amount).send({ from: context.$bsc.wallet[0] })
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
