import Web3 from "web3";
import { abi as PancakePair } from "@/static/abi/PancakePair.json"
import { abi as BEP20 } from "@/static/abi/BEP20.json"
import { abi as MasterChef } from "@/static/abi/MasterChef.json"

// Maximum allowable value for a uint256, used for approval of each address
const MAXINT256 = Web3.utils.toBN("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff").toString();

const bscWeb3 = new Web3(process.env.NUXT_ENV_BSC_RPC)
const PancakePairContract = new bscWeb3.eth.Contract(PancakePair, process.env.NUXT_ENV_PANCAKEPAIR_CONTRACT)
const Bep20Contract = new bscWeb3.eth.Contract(BEP20, process.env.NUXT_ENV_EFX_TOKEN_CONTRACT)
const MasterChefContract = new bscWeb3.eth.Contract(MasterChef, process.env.NUXT_ENV_MASTERCHEF_CONTRACT)

// TODO implement `approve` for `transfer_from`
// TODO implement transfer_from
// TODO

/**
 * First approve transfer from the given address to the given contract
 * @param {string} from - The address to approve from
 * @returns {Promise}
 */
const approveFirst = async (address) => {
  // TODO Should we get a list of all approved addresses first?
  return await Bep20Contract.methods.approve(address, MAXINT256).call()
}

/**
 * Deposit LP tokens to masterchef contract
 * @param {string} from - The address to deposit from
 * @param {string} amount in WEI - The amount of tokens to deposit
 * @returns {Promise}
 */
const depositLP = async (from, amount) => {
  return await Bep20Contract.methods.transferFrom(from, process.env.NUXT_ENV_MASTERCHEF_CONTRACT, amount).call()
}

/**
 * Withdraw ALL (claimRewards) rewardtokens from masterchef contract
 * This can be done by calling depoosit/withdraw with a zero amount
 * @param {string} address - The address to withdraw to
 * @returns {Promise}
 */
const ClaimLpRewards = async (from) => {
 return await MasterChefContract.methods.withdraw(0).call()
}

/**
 * TODO Check the unit of the return value
 * Get pending rewards from masterchef contract for a given address
 * @param {string} address - The address to withdraw to
 * @returns {Promise} - Returns a promise that resolves to an uint256 (WEI)???
 */
const pendingEfxRewards = async (address) => {
  return await MasterChefContract.methods.pendingEfx(address).call()
}

/**
 * Get the currently staked amount of EFX tokens for a given address
 * @param {string} address - The address to withdraw to
 * @returns {Promise} - Returns a promise that resolves to an uint256 (WEI)???
 */
const currentlyStakedEfx = async (address) => {
}

module.exports = {
  MAXINT256,
  bscWeb3,
  PancakePairContract,
  Bep20Contract,
  MasterChefContract,
  approveFirst,
  depositLP,
  ClaimLpRewards,
  pendingEfxRewards,
  currentlyStakedEfx
}
