import { Api, JsonRpc } from 'eosjs'

export default (context, inject) => {
  const rpc = new JsonRpc(`https://${process.env.NUXT_ENV_EOS_NODE_URL}:443`)
  const api = new Api({ rpc })

  inject('rpc', rpc)
  inject('eos', api)
}
