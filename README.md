# [EFX DeFi Bridge](https://bridge.effect.network) [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?hashtags=crypto%20%23defi%20%23blockchain%20%23dApp%20%23Vue%20%23nodejs&original_referer=https%3A%2F%2Fpublish.twitter.com%2F&ref_src=twsrc%5Etfw%7Ctwcamp%5Ebuttonembed%7Ctwterm%5Eshare%7Ctwgr%5E&text=Consider%20giving%20our%20DeFi%20bridge%20dApp%20a%20quick%20star%20%E2%AD%90%20on%20GitHub!&url=https%3A%2F%2Fgithub.com%2Feffectai%2Fbridge-frontend&via=effectaix)

![Discord](https://img.shields.io/discord/519860537891487745?style=social)
![GitHub branch checks state](https://img.shields.io/github/checks-status/effectai/bridge-frontend/main?style=social)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/effectai/bridge-frontend?style=social)
![GitHub last commit](https://img.shields.io/github/last-commit/effectai/bridge-frontend?style=social)
![GitHub contributors](https://img.shields.io/github/contributors/effectai/bridge-frontend?style=social)
![Website](https://img.shields.io/website?style=social&url=https%3A%2F%2Fbridge.effect.network)

➡️ <b><a href="https://discord.gg/hM3237cYXP">Join the Effect DAO Discord!</a></b>

Vue dApp to interact with the Defi services of Effect network.
This dApp bridges the EOS blockchain and the Binance Smart Chain.
Currently built in to this Vue dApp is the bridge, to swap tokens and an interface to interact with the Pancakeswap EFX farm.

## Build Setup

In order to run this repo, clone it, install the dependencies, build it, and start it.

```bash
git clone https://github.com/effectai/bridge-frontend

cd bridge-frontend

npm install

npm run generate

npm run start
```

If everything went correctly, the server should be running now and now you can navigate to <http://localhost:3000> and see the Vue app running.

## Development

For active development it is recomended to use `npm run dev`. The command will serve with hot reload at localhost:3000. Heads up, this will load in the `developement` environment variables.

```bash
git clone https://github.com/effectai/bridge-frontend

npm install

npm run dev
```

To set up a quick development environment you can use Docker:

```shell
sudo docker run --rm -it -v $(pwd):/app -w /app -p 3000:3000 node:16 bash
```

## Node-sass Node version

The `node-sass` package is very picky with which Node version it will work with.
You can use use [NVM](https://github.com/nvm-sh/nvm) to set node version to the corresponding supported version.
Check out the repo of `node-sass` to see which [Node version](https://github.com/sass/node-sass#node-version-support-policy
) is needed.

## Contribution

Please look at our [contribution guide](https://github.com/effectai/effect-network/blob/master/.github/CONTRIBUTING.md) in order to start submitting PR.

## Code of Conduct

You can take a look at our code of conduct here: [CODE OF
CONDUCT](https://github.com/effectai/effect-network/blob/master/.github/CODE_OF_CONDUCT.md)

## Effect Network

Learn more about Effect Network here: <https://github.com/effectai/effect-network>
