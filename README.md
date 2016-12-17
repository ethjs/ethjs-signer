## ethjs-signer

<div>
  <!-- Dependency Status -->
  <a href="https://david-dm.org/ethjs/ethjs-signer">
    <img src="https://david-dm.org/ethjs/ethjs-signer.svg"
    alt="Dependency Status" />
  </a>

  <!-- devDependency Status -->
  <a href="https://david-dm.org/ethjs/ethjs-signer#info=devDependencies">
    <img src="https://david-dm.org/ethjs/ethjs-signer/dev-status.svg" alt="devDependency Status" />
  </a>

  <!-- Build Status -->
  <a href="https://travis-ci.org/ethjs/ethjs-signer">
    <img src="https://travis-ci.org/ethjs/ethjs-signer.svg"
    alt="Build Status" />
  </a>

  <!-- NPM Version -->
  <a href="https://www.npmjs.org/package/ethjs-signer">
    <img src="http://img.shields.io/npm/v/ethjs-signer.svg"
    alt="NPM version" />
  </a>

  <!-- Test Coverage -->
  <a href="https://coveralls.io/r/ethjs/ethjs-signer">
    <img src="https://coveralls.io/repos/github/ethjs/ethjs-signer/badge.svg" alt="Test Coverage" />
  </a>

  <!-- Javascript Style -->
  <a href="http://airbnb.io/javascript/">
    <img src="https://img.shields.io/badge/code%20style-airbnb-brightgreen.svg" alt="js-airbnb-style" />
  </a>
</div>

<br />

A simple Ethereum signing and recovery utility.

## Install

```
npm install --save ethjs-signer
```

## Usage

```js
const HttpProvider = require('ethjs-provider-http');
const Eth = require('ethjs-query');
const eth = new Eth(HttpProvider('http://localhost:8545'));
const sign = require('ethjs-signer').sign;

const address = '0x0F6af8F8D7AAD198a7607C96fb74Ffa02C5eD86B';
const privateKey = '0xecbcd9838f7f2afa6e809df8d7cdae69aa5dfc14d563ee98e97effd3f6a652f2';

eth.getTransactionCount(address).then((nonce) => {
  eth.sendRawTransaction(sign({
    to: '0xce31a19193d4b23f4e9d6163d7247243bAF801c3',
    value: 300000,
    gas: new BN('43092000'),
    nonce: nonce,
  }, privateKey)).then((txHash) => {
    console.log('Transaction Hash', txHash);
  });
});
```

Note, that address and private key are a valid address and private key. Only use this example address for local testing and setup. You will loose your Ether if you send it to this address.

## About

This module is meant to help sign and recover Ethereum transactions. You can either sign the transaction and have it return a serilized hex payload (the default), or return the raw array of Buffer values.

## Method API

```
sign     <Function  (Object, String [, Boolean]) : (String|Array)>
recover  <Function  (Object|String, Number, Object, Object) : (Object)>
```

## Contributing

Please help better the ecosystem by submitting issues and pull requests to `ethjs-signer`. We need all the help we can get to build the absolute best linting standards and utilities. We follow the AirBNB linting standard and the unix philosophy.

## Guides

You'll find more detailed information on using `ethjs-signer` and tailoring it to your needs in our guides:

- [User guide](docs/user-guide.md) - Usage, configuration, FAQ and complementary tools.
- [Developer guide](docs/developer-guide.md) - Contributing to `ethjs-signer` and writing your own code and coverage.

## Help out

There is always a lot of work to do, and will have many rules to maintain. So please help out in any way that you can:

- Create, enhance, and debug ethjs rules (see our guide to ["Working on rules"](./github/CONTRIBUTING.md)).
- Improve documentation.
- Chime in on any open issue or pull request.
- Open new issues about your ideas for making `ethjs-signer` better, and pull requests to show us how your idea works.
- Add new tests to *absolutely anything*.
- Create or contribute to ecosystem tools.
- Spread the word!

Please consult our [Code of Conduct](CODE_OF_CONDUCT.md) docs before helping out.

We communicate via [issues](https://github.com/ethjs/ethjs-signer/issues) and [pull requests](https://github.com/ethjs/ethjs-signer/pulls).

## Important documents

- [Changelog](CHANGELOG.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [License](https://raw.githubusercontent.com/ethjs/ethjs-signer/master/LICENSE)

## Licence

This project is licensed under the MIT license, Copyright (c) 2016 Nick Dodson. For more information see LICENSE.md.

```
The MIT License

Copyright (c) 2016 Nick Dodson. nickdodson.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
