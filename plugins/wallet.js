import Vue from 'vue'

export default (context, inject) => {
  const wallet = new Vue({
    data () {
      return {
        wallet: null,
        loginModal: false,
        efxAvailable: 0,
        updater: null,
        transaction: null,
        transactionError: null
      }
    },

    computed: {
      eos () {
        return context.$eos
      }
    },

    created () {
      console.log('created wallet')
      this.updater = setInterval(() => { this.updateAccount() }, 10000)
    },

    beforeDestroy () {
      clearInterval(this.updater)
    },

    methods: {
      init (wallet) {
        this.wallet = wallet
        this.updateAccount()
      },
      updateAccount () {
        if (this.wallet) {
          this.getAccountBalance()
        }
      },

      clear () {
        this.clearTransaction()
        Object.assign(this.$data, this.$options.data.call(this))
      },

      async getAccountBalance () {
        if (this.wallet) {
          const efxRow = (await this.eos.rpc.get_currency_balance(process.env.NUXT_ENV_TOKEN_CONTRACT, this.wallet.auth.accountName, process.env.NUXT_ENV_EFX_TOKEN))[0]
          if (efxRow) {
            this.efxAvailable = parseFloat(efxRow.replace(` ${process.env.NUXT_ENV_EFX_TOKEN}`, ''))
          }
        }
      },

      handleTransaction (actions) {
        this.clearTransaction()

        return this.wallet.eosApi.transact({ actions }, {
          blocksBehind: 3,
          expireSeconds: 60
        })
          .then((transaction) => {
            this.transaction = transaction
            return Promise.resolve(transaction)
          })
          .catch((error) => {
            this.transactionError = error
            return Promise.reject(error)
          })
      },

      clearTransaction () {
        this.transaction = null
        this.transactionError = null
      }
    }
  })

  inject('wallet', wallet)
}
