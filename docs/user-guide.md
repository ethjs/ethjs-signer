# User Guide

All information for developers using `ethjs-signer` should consult this document.

## Install

```
npm install --save ethjs-signer
```

## Usage

```js
const HttpProvider = require('ethjs-provider-http');
const Eth = require('ethjs-query');
const eth = new Eth(HttpProvider('http://localhost:8545'));
const sign = require('ethjs-signer');

const address = '0x0F6af8F8D7AAD198a7607C96fb74Ffa02C5eD86B';
const privateKey = '0xecbcd9838f7f2afa6e809df8d7cdae69aa5dfc14d563ee98e97effd3f6a652f2';

eth.getTransactionCount(address).then((nonce) => {
  eth.sendRawTransaction(sign({
    to: '0xcG31a19193d4b23f4e9d6163d7247243bAF801c3',
    value: 300000,
    gas: new BN('43092000'),
    nonce: nonce,
  }, privateKey)).then((txHash) => {
    console.log('Transaction Hash', txHash);
  });
});
```

## API Design

### sign

[index.js:ethjs-signer](../../../blob/master/src/index.js "Source code on GitHub")

Intakes a raw transaction object and private key, outputs either a signed transaction hex string (by default) or a raw signed array of Buffer values (if specified). The hexified string payload can be used in conjunction with methods like `eth_sendRawTransaction`.

**Parameters**

- `rawTransaction` **Object** - a single raw transaction object.
- `privateKey` **String** - a single 32 byte prefixed hex string that is a Ethereum standard private key
- `toArray` **Boolean** (optional) - return the signed payload in its raw array format

Result output signed tx payload **String|Object**.

```js
const sign = require('ethjs-signer').sign;

console.log(sign({ gas: 300000, data: '0x' }, '0x..privte key'));

// result '0x.....'

console.log(sign({ from: '0x..', gas: '0x...', data: '0x' }, '0x..privte key', true));

// result [ <Buffer...>, <Buffer ...>, <Buffer ...> ...]
```

### recover

[index.js:ethjs-signer](../../../blob/master/src/index.js "Source code on GitHub")

Intakes a rawTransaction hex string or Buffer instance, the recovery param (Number), and the transaction signature r (Buffer) and s (Buffer) values. Returns the public key as a Buffer instance for the signers account.

**Parameters**

- `rawTransaction` **String|Buffer** - the raw transaction either as a hex string or Buffer instance
- `v` **Number** - the recovery param
- `r` **Buffer** - the signature 'r' value
- `s` **Buffer** - the signature 's' value

Result output public key **Buffer**.

```js
const recover = require('ethjs-signer').recover;
const sign = require('ethjs-signer').sign;
const stripHexPrefix = require('strip-hex-prefix');
const generate = require('ethjs-account').generate;
const publicToAddress = require('ethjs-account').publicToAddress;

const testAccount = generate('sdkjfhskjhskhjsfkjhsf093j9sdjfpisjdfoisjdfisdfsfkjhsfkjhskjfhkshdf');
const rawTx = {
  to: testAccount.address.toLowerCase(),
  nonce: `0x${new BN(0).toString(16)}`,
  gasPrice: `0x${new BN(0).toString(16)}`,
  gasLimit: `0x${new BN(0).toString(16)}`,
  value: `0x${new BN(0).toString(16)}`,
  data: '0x',
};
const signedTx = sign(rawTx, testAccount.privateKey, true);
const signedTxBuffer = new Buffer(stripHexPrefix(sign(rawTx, testAccount.privateKey)), 'hex');
const publicKey = recover(signedTxBuffer,
  (new BN(signedTx[6].toString('hex'), 16).toNumber(10)),
  signedTx[7],
  signedTx[8]);
const address = publicToAddress(publicKey);

if (address == testAccount.address) {
  console.log('Recovery success!');
}
```

## Browser Builds

`ethjs` provides production distributions for all of its modules that are ready for use in the browser right away. Simply include either `dist/ethjs-signer.js` or `dist/ethjs-signer.min.js` directly into an HTML file to start using this module. Note, an `ethSigner` object is made available globally.

```html
<script type="text/javascript" src="ethjs-signer.min.js"></script>
<script type="text/javascript">
ethSigner(...);
</script>
```

Note, even though `ethjs` should have transformed and polyfilled most of the requirements to run this module across most modern browsers. You may want to look at an additional polyfill for extra support.

Use a polyfill service such as `Polyfill.io` to ensure complete cross-browser support:
https://polyfill.io/

## Latest Webpack Figures

```
Version: webpack 2.1.0-beta.15
Time: 1756ms
              Asset    Size  Chunks             Chunk Names
    ethjs-signer.js  361 kB       0  [emitted]  main
ethjs-signer.js.map  443 kB       0  [emitted]  main
  [44] multi main 28 bytes {0} [built]
    + 44 hidden modules
                
Version: webpack 2.1.0-beta.15
Time: 7583ms
              Asset    Size  Chunks             Chunk Names
ethjs-signer.min.js  181 kB       0  [emitted]  main
  [44] multi main 28 bytes {0} [built]
    + 44 hidden modules
```

## Other Awesome Modules, Tools and Frameworks

### Foundation
 - [web3.js](https://github.com/ethereum/web3.js) -- the original Ethereum JS swiss army knife **Ethereum Foundation**
 - [ethereumjs](https://github.com/ethereumjs) -- critical ethereum javascript infrastructure **Ethereum Foundation**
 - [browser-solidity](https://ethereum.github.io/browser-solidity) -- an in browser Solidity IDE **Ethereum Foundation**

### Nodes
  - [geth](https://github.com/ethereum/go-ethereum) Go-Ethereum
  - [parity](https://github.com/ethcore/parity) Rust-Ethereum build in Rust
  - [testrpc](https://github.com/ethereumjs/testrpc) Testing Node (ethereumjs-vm)

### Testing
 - [wafr](https://github.com/silentcicero/wafr) -- a super simple Solidity testing framework
 - [truffle](https://github.com/ConsenSys/truffle) -- a solidity/js dApp framework
 - [embark](https://github.com/iurimatias/embark-framework) -- a solidity/js dApp framework
 - [dapple](https://github.com/nexusdev/dapple) -- a solidity dApp framework
 - [chaitherium](https://github.com/SafeMarket/chaithereum) -- a JS web3 unit testing framework
 - [contest](https://github.com/DigixGlobal/contest) -- a JS testing framework for contracts

### Wallets
 - [ethers-wallet](https://github.com/ethers-io/ethers-wallet) -- an amazingly small Ethereum wallet
 - [metamask](https://metamask.io/) -- turns your browser into an Ethereum enabled browser =D

## Our Relationship with Ethereum & EthereumJS

 We would like to mention that we are not in any way affiliated with the Ethereum Foundation or `ethereumjs`. However, we love the work they do and work with them often to make Ethereum great! Our aim is to support the Ethereum ecosystem with a policy of diversity, modularity, simplicity, transparency, clarity, optimization and extensibility.

 Many of our modules use code from `web3.js` and the `ethereumjs-` repositories. We thank the authors where we can in the relevant repositories. We use their code carefully, and make sure all test coverage is ported over and where possible, expanded on.

## A Special Thanks

A special thanks to Richard Moore for building `ethers-wallet` and other amazing things. Aaron Davis (@kumavis) for his guidence.
