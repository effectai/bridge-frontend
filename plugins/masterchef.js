import Vue from 'vue'
import Web3 from 'web3'
import { BN } from "web3-utils";
import { abi as PancakePair } from "@/static/abi/PancakePair.json"
import { abi as BEP20 } from "@/static/abi/BEP20.json"
import { abi as MasterChef } from "@/static/abi/MasterChef.json"


// Dus mijn plan nu is om alles hier in te schrijven en het hier te gebruiken.

export default (context, inject) => {

  const masterchef = new Vue({
    data() {
    },
    computed: {
    },
    methods: {
    },
    created() {
    },
    mounted() {
    },

  })

  inject('masterchef', masterchef)

}
