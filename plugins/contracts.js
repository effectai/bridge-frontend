import Web3 from "web3";
import { BN } from "web3-utils";
import { abi as PancakePair } from "@/static/abi/PancakePair.json"
import { abi as BEP20 } from "@/static/abi/BEP20.json"
import { abi as MasterChef } from "@/static/abi/MasterChef.json"

const bscWeb3 = new Web3(process.env.NUXT_ENV_BSC_RPC)
const PancakePairContract = new bscWeb3.eth.Contract(PancakePair, process.env.NUXT_ENV_PANCAKEPAIR_CONTRACT)
const Bep20Contract = new bscWeb3.eth.Contract(BEP20, process.env.NUXT_ENV_EFX_TOKEN_CONTRACT)
const MasterChefContract = new bscWeb3.eth.Contract(MasterChef, process.env.NUXT_ENV_MASTERCHEF_CONTRACT)
const MAXUINT256 = new BN("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");

// Temporary utility function
JSON.safeStringify = (obj, indent = 2) => {
  let cache = [];
  const retVal = JSON.stringify(
    obj,
    (key, value) =>
      typeof value === "object" && value !== null
        ? cache.includes(value)
          ? undefined // Duplicate reference found, discard key
          : cache.push(value) && value // Store value in our collection
        : value,
    indent
  );
  cache = null;
  return retVal;
};

/******************************************************************************
 * BEP20 METHODS
 *****************************************************************************/

/**
 * Predicate to see if the allowance of the user is already set to max, thus is approved or not.
 * @param {string} address - Address of the user
 * @returns {boolean}
 */
const isApproved = async (address) => {
  const allowance = new BN(await PancakePairContract.methods.allowance(address, process.env.NUXT_ENV_MASTERCHEF_CONTRACT).call())
  console.log(`Allowance: ${allowance}`);
  const returnval = allowance.eq(MAXUINT256)
  console.log(`Return value: ${returnval}`);
  return returnval
}

/**
 * First approve transfer from the given address to the given contract
 * @param {string} from - The address to approve from
 * @returns {Promise}
 */
const approveAllowance = async (address) => {
  try {
    console.log(`Approving ${address} for ${process.env.NUXT_ENV_MASTERCHEF_CONTRACT}`)
    const val = await PancakePairContract.methods.approve(process.env.NUXT_ENV_MASTERCHEF_CONTRACT, MAXUINT256).send({ from: address })
    console.log(`Approval: ${val}`)
    return val
  } catch (error) {
    console.error(error)
  }
}

/**
 * Deposit LP tokens to masterchef contract, This function requires `approveAllowance` to be called first
 * @param {string} amount in WEI - The amount of tokens to deposit
 * @returns {Promise}
 */
const depositBepIntoPool = async (amount) => {
  return await Bep20Contract.methods.transfer(process.env.NUXT_ENV_PANCAKEPAIR_CONTRACT, amount).call()
}

const depositBNBIntoPool = async (from, amount) => {
  return await bscWeb3.eth.sendTransaction({
    from: from,
    to: process.env.NUXT_ENV_PANCAKEPAIR_CONTRACT,
    value: amount,
    gas: 4000000
  })
}

/******************************************************************************
 * LIQUIDITY POOL (PANCAKEPAIR) METHODS
 *****************************************************************************/

/**
 * Get current balance of BEP20 LP tokens for this address
 * @param {string} address - The address of the user
 * @returns {string} - String representation of the balance
 */
const getBalanceLpTokens = async (address) => {
  const balance = await pancakePairContract.methods.balanceOf(address).call()
  return Web3.utils.toBN(balance).toString()
}

/**
 * Get current total balance of the contract.
 * @returns {string} - returns the value of the total reserve of the contract
 */
const getLpReserves = async () => {
  const reserve = await pancakePairContract.methods.getReserves().call()
  return Web3.utils.toBN(reserve).toString()
}


/******************************************************************************
 * MASTERCHEF METHODS
 *****************************************************************************/

/**
 * Deposit LP tokens into masterchef. Requires that `approveAllowance` is called first
 * @param {string} amount in WEI - The amount of tokens to deposit
 * @returns {Promise}
 */
const depositLpIntoMasterChef = async (amount) => {
  return await MasterChefContract.methods.deposit(amount).call()
}

/**
 * Withdraw ALL (claimRewards) rewardtokens from masterchef contract
 * This can be done by calling depoosit/withdraw with a zero amount
 * @param {string} address - The address to withdraw to
 * @returns {Promise}
 */
const claimLpRewards = async (from) => {
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
 * Get transaction of the deployment of the masterchef contract
 * @returns {Promise} Object - { hash, nonce, blockHash, blockNumber, transactionIndex, from, to, value, gas, gasPrice, input}
 * @see https://web3js.readthedocs.io/en/v1.2.0/web3-eth.html?highlight=transactionhash#gettransaction
 */
const getDeploymentTx = async () => {
  return await bscWeb3.eth.getTransaction(process.env.NUXT_ENV_MASTERCHEF_TXHASH)
}

export {
  bscWeb3,
  PancakePairContract,
  Bep20Contract,
  MasterChefContract,
  isApproved,
  approveAllowance,
  claimLpRewards,
  pendingEfxRewards,
  getDeploymentTx,
  getBalanceLpTokens,
  getLpReserves,
  depositBepIntoPool,
  depositBNBIntoPool,
  depositLpIntoMasterChef
}
