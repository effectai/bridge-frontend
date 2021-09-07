import Vue from 'vue'
import Web3 from 'web3'
import { BN, toWei, fromWei } from "web3-utils";
import { abi as PancakePair } from "@/static/abi/PancakePair.json"
import { abi as BEP20 } from "@/static/abi/BEP20.json"
import { abi as MasterChef } from "@/static/abi/MasterChef.json"

const MAXUINT256 = new BN("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");

export default (context, inject) => {

  const masterchef = new Vue({
    data() {
      return {
        apr: null,
        status: null,
        error: null,
        pancakeContract: null,
        bepContract: null,
        masterchefContract: null,
        approved: null,
        updaterBalance: null,
        updaterReserves: null,
        lpBalance: null,
        lpReserves: null,
        lpEfxReserves: null,
        lpWbnbReserves: null,
        lpEndDate: null,
        lpPool: process.env.NUXT_ENV_PANCAKEPOOL_URL,
        efxPrice: null,
        pendingEfx: null,
        updaterPendingEfx: null,
        lockedTokens: null,
        stakedLpBalance: null,
        efxPerBlock: null,
        startBlock: null,
        endBlock: null,
        latestBlockNumber: null
      }
    },
    computed: {
      bscWallet () {
        return (context.$bsc) ? context.$bsc.wallet : null
      },
    },
    watch: {
      bscWallet(wallet) {
        if (wallet) {
          this.init(context.$bsc.currentProvider)
        }
      }
    },
    beforeDestroy() {
      this.clearIntervals()
    },
    methods: {
      clearIntervals () {
        if (this.updaterBalance) clearInterval(this.updaterBalance)
        if (this.updaterReserves) clearInterval(this.updaterReserves)
        if (this.updaterPendingEfx) clearInterval(this.updaterPendingEfx)
      },
      reset () {
        this.clearIntervals()
        Object.assign(this.$data, this.$options.data.call(this))
      },
      init (currentProvider) {
        try {
          this.loadContracts(currentProvider)
          this.getBalanceLpTokens()
          this.isApproved()
          this.getLpReserves()
          this.calculateAPR()
          this.getStakedLpTokens()
          this.getPendingEFX()
          this.getLatestBlockNumber()

          // this.getCakePerBlock()
          this.updaterReserves = setInterval(() => this.getLpReserves(), 60e3); // 60 seconds
          this.updaterBalance = setInterval(() => this.getBalanceLpTokens(), 10e3) // 10 seconds
          this.updaterPendingEfx = setInterval(() => this.getPendingEFX(), 5e3) // 5 seconds

        } catch (error) {
          this.status = "Error loading contracts"
          this.error = error.message
          console.error(error)
        }
      },

      async loadContracts(currentProvider) {
        try {
          this.reset()
          // load contracts
          const provider = Boolean(currentProvider) ? currentProvider : process.env.NUXT_ENV_BSC_RPC
          this.contractProvider = new Web3(provider)
          this.pancakeContract = new this.contractProvider.eth.Contract(PancakePair, process.env.NUXT_ENV_PANCAKEPAIR_CONTRACT)
          this.bepContract = new this.contractProvider.eth.Contract(BEP20, process.env.NUXT_ENV_EFX_TOKEN_CONTRACT)
          this.masterchefContract = new this.contractProvider.eth.Contract(MasterChef, process.env.NUXT_ENV_MASTERCHEF_CONTRACT)
        } catch (error) {
          this.status = "Error loading contracts"
          this.error = error.message
          console.error(error)
        }
      },

      async isApproved() {
        try {
          if(this.bscWallet) {
            const allowance = new BN(await this.pancakeContract.methods.allowance(this.bscWallet[0], process.env.NUXT_ENV_MASTERCHEF_CONTRACT).call())
            let lpBalance = this.lpBalance || 0;
            lpBalance = new BN(lpBalance);
            this.approved = allowance.gt(lpBalance)
            if (this.approved) {
              this.getStakedLpTokens();
            }
            return allowance.gt(lpBalance)
          }
        } catch (error) {
          // TODO: make nice error
          alert("Error getting approval status. Reload the page and try again")
          console.error('pancakeContract#isApproved', error)
        }
      },

      async approveAllowance() { // Needs to come from the user wallet
        try {
          const approvalTX = await this.pancakeContract.methods.approve(process.env.NUXT_ENV_MASTERCHEF_CONTRACT, MAXUINT256).send({ from: this.bscWallet[0] })
          this.isApproved()
          return approvalTX
        } catch (error) {
          console.error('pancakeContract#approveAllowance', error);
          throw error
        }
      },

      async depositLpIntoMasterChef(amount) {
        try {
          const deposit = await this.masterchefContract.methods.deposit(toWei(amount)).send({ from: this.bscWallet[0] })
          this.getStakedLpTokens();

          return deposit;
        } catch (error) {
          console.error('masterChefContract#depositLpIntoMaster', error);
          throw error;
        }
      },

      async withdrawLpFromMasterChef(amount) {
        try {
          const deposit = await this.masterchefContract.methods.withdraw(toWei(amount)).send({ from: this.bscWallet[0] })
          this.getStakedLpTokens();
          return deposit;
        } catch (error) {
          console.error('masterChefContract#withdrawLpFromMasterChef', error);
          throw error;
        }
      },

      async getBalanceLpTokens () {
        try {
          if(this.bscWallet) {
            const balance = await this.pancakeContract.methods.balanceOf(this.bscWallet[0]).call()
            this.lpBalance = fromWei(balance)
            return toWei(balance)
          }
        } catch (error) {
          console.error('pancakeContract#getBalanceLpTokens', error);
        }
      },

      async getStakedLpTokens () {
        try {
          const balance = await this.masterchefContract.methods.userInfo(0, this.bscWallet[0]).call()
          this.stakedLpBalance = fromWei(balance[0])
          return toWei(balance[0])
        } catch (error) {
          console.error('pancakeContract#getStakedLPTokens', error);
        }
      },

      async getPendingEFX () {
        try {
          if(this.bscWallet) {
            const pendingEFX = await this.masterchefContract.methods.pendingEfx(this.bscWallet[0]).call()
            this.pendingEfx = fromWei(pendingEFX)
            return fromWei(pendingEFX)
          }
        } catch (error) {
          console.error('Masterchef#getPendingEfx', error);
        }
      },

      async claimPendingEFX () {
        try {
          const claimEFX = await this.masterchefContract.methods.withdraw(0).send({ from: this.bscWallet[0] })
          return claimEFX
        } catch (error) {
          console.error('Masterchef#claimPendingEfx', error);
          throw error;
        }
      },

      async getLpReserves () {
        try {
          const reserves = await this.pancakeContract.methods.getReserves().call()
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
        try {
          const lockedLpTokens = await this.pancakeContract.methods.balanceOf(process.env.NUXT_ENV_MASTERCHEF_CONTRACT).call()
          this.lockedTokens = Number.parseFloat(fromWei(lockedLpTokens)).toFixed(2)
          return fromWei(lockedLpTokens)
        } catch (error) {
          console.error('Pancake#getLockedLpTokens', error);
        }
      },

      async calculateAPR() {
        try {
          await this.loadContracts(context.$bsc.currentProvider)
          await this.getMasterChefInfo()
          await this.getLockedLpTokens()

          const totalSupply = await this.pancakeContract.methods.totalSupply().call()
          const efxTotalBalance = await this.bepContract.methods.balanceOf(process.env.NUXT_ENV_PANCAKEPAIR_CONTRACT).call()
          const poolUsdTotal = fromWei(efxTotalBalance) * 2;
          const lpDollarValue = Number.parseFloat(poolUsdTotal / fromWei(totalSupply)).toFixed(2)
          const efxPerDay = Math.round(fromWei(this.efxPerBlock) * 28800)
        
          // (EFX_per_day * 365} / total $ value locked LP * 100%
          this.apr = Number.parseFloat(((efxPerDay * 365) / (lpDollarValue * this.lockedTokens)) * 100).toFixed(2);
        } catch (e) {
          this.apr = 'N/A';
          console.error(e);
        }
      },

      async getEFXPrice () {
        this.efxPrice = await fetch('https://api.coingecko.com/api/v3/coins/effect-network/tickers')
          .then(data => data.json())
          .then((data) => {
            return data.tickers[0].converted_last.usd
          })
      },

      async getMasterChefInfo () {
        try {
          const efxPerBlock = await this.masterchefContract.methods.efxPerBlock().call()
          const startBlock = await this.masterchefContract.methods.startBlock().call()
          const endBlock = await this.masterchefContract.methods.endBlock().call()

          // calculate end date of farm
          const latestBlock = await this.contractProvider.eth.getBlock("latest");
          const oldBlock = await this.contractProvider.eth.getBlock(latestBlock.number - 1000);
          const timeDifference = latestBlock.timestamp - oldBlock.timestamp;
          const timeDifferencePerBlock = timeDifference / 1000;
          const blockDifference = endBlock - latestBlock.number;
          const endDate = Math.ceil(latestBlock.timestamp + (blockDifference * timeDifferencePerBlock));

          this.efxPerBlock = efxPerBlock
          this.startBlock = startBlock
          this.endBlock = endBlock
          this.endDate = endDate

        } catch (error) {
          console.error('Masterchef#getMasterChefInfo', error);
        }
      },

      async getLatestBlockNumber () {
        try {
          const latestBlockNumber = await this.contractProvider.eth.getBlockNumber();
          this.latestBlockNumber = latestBlockNumber
          return latestBlockNumber;
        } catch (error) {
          console.error('Masterchef#getLatestBlockNumber', error);
        }
      },
      

    },

    mounted() {
    }

  })

  inject('masterchef', masterchef)

}
