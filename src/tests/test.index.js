const sign = require('../index.js').sign; // eslint-disable-line
const recover = require('../index.js').recover;
const TestRPC = require('ethereumjs-testrpc'); // eslint-disable-line
const Eth = require('ethjs-query'); // eslint-disable-line
const EthTx = require('ethereumjs-tx'); // eslint-disable-line
const generate = require('ethjs-account').generate; // eslint-disable-line
const publicToAddress = require('ethjs-account').publicToAddress; // eslint-disable-line
const assert = require('chai').assert;
const stripHexPrefix = require('strip-hex-prefix');
const BN = require('bn.js');

describe('recover', () => {
  describe('construction', () => {
    it('should import normally', () => {
      assert.equal(typeof recover, 'function');
    });
  });

  describe('functionality', () => {
    it('should recover from signed tx string', () => {
      const testAccount = generate('sdkjfhskjhskhjsfkjhsf093j9sdjfpisjdfoisjdfisdfsfkjhsfkjhskjfhkshdf');
      const rawTx = {
        to: testAccount.address.toLowerCase(),
        nonce: `0x${new BN(0).toString(16)}`,
        gasPrice: `0x${new BN(0).toString(16)}`,
        gasLimit: `0x${new BN(0).toString(16)}`,
        value: `0x${new BN(0).toString(16)}`,
        data: '0',
      };
      const signedTx = sign(rawTx, testAccount.privateKey, true);
      const signedTxString = sign(rawTx, testAccount.privateKey);
      const publicKey = recover(signedTxString,
        (new BN(signedTx[6].toString('hex'), 16).toNumber(10)),
        signedTx[7],
        signedTx[8]);
      const address = publicToAddress(publicKey);
      assert.equal(address, testAccount.address);
    });

    it('should recover from signed tx buffer', () => {
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
      assert.equal(address, testAccount.address);
    });
  });
});

describe('sign', () => {
  describe('construction', () => {
    it('should import normally', () => {
      assert.equal(typeof sign, 'function');
    });
  });

  describe('functionality', () => {
    const account = generate('sdkjfhskjhskhjsfkjhsf093j9sdjfpisjdfoisjdfisdfsfkjhsfkjhskjfhkshdf');

    it('test gas shim', () => {
      assert.deepEqual(sign({ to: account.address, gas: 3000000 }, account.privateKey),
                       sign({ to: account.address, gasLimit: 3000000 }, account.privateKey));
    });

    it('should sign a valid tx', () => {
      assert.equal(typeof sign({ to: account.address }, account.privateKey), 'string');
      assert.equal(typeof sign({ to: account.address }, account.privateKey, true), 'object');
    });

    it('should throw when invalid', () => {
      assert.throws(() => sign(''), Error);
      assert.throws(() => sign({}, ''), Error);
      assert.throws(() => sign({ to: account.address, gas: '0x89724982892748972349874239847987s29sdfhkjjsfh8823927482978923793248829724397' }, account.privateKey), Error);
      assert.throws(() => sign({ to: '0x00' }, account.privateKey), Error);
      assert.throws(() => sign({}, '0xfsd98'), Error);
      assert.throws(() => sign({}, '0xkjdsfkjfsdkjs'), Error);
      assert.throws(() => sign({}, 234879243), Error);
      assert.throws(() => sign({}, null), Error);
      assert.throws(() => sign(null, 243249), Error);
      // assert.throws(() => sign({}, account.privateKey), Error);
    });
  });

  describe('field testing against TestRPC', () => {
    it('should send a signed tx with testrpc provider', (done) => {
      const testAccount = generate('sdkjfhskjhskhjsfkjhsf093j9sdjfpisjdfoisjdfisdfsfkjhsfkjhskjfhkshdf');
      const provider = TestRPC.provider({
        accounts: [{
          address: testAccount.address,
          secretKey: testAccount.privateKey,
          balance: 999999999,
        }],
      });
      const eth = new Eth(provider);
      const rawTx = {
        to: '0x6023E44829921590b24f458c9eE4F544507d59B6',
        gas: 300000,
        value: new BN(450000),
      };
      const signedTx = sign(rawTx, testAccount.privateKey);
      eth.sendRawTransaction(signedTx, (err, txHash) => {
        assert.equal(err, null);
        assert.equal(typeof txHash, 'string');

        setTimeout(() => {
          eth.getTransactionByHash(txHash, (rErr, transaction) => {
            assert.equal(rErr, null);

            assert.equal(testAccount.address.toLowerCase(), transaction.from);
            assert.equal(rawTx.to.toLowerCase(), transaction.to);
            assert.deepEqual(rawTx.value.toString(10), transaction.value.toString(10));
            assert.deepEqual(new BN(rawTx.gas).toString(10), transaction.gas.toString(10));

            done();
          });
        }, 400);
      });
    });
  });

  describe('should work the same as ethereumjs-tx', () => {
    it('should pass a thousand random signing tests', () => {
      for (var i = 0; i < 1000; i++) { // eslint-disable-line
        const testAccount = generate('sdkjfhskjhskhjsfkjhsf093j9sdjfpisjdfoisjdfisdfsfkjhsfkjhskjfhkshdf');
        const rawTx = {
          to: testAccount.address.toLowerCase(),
          nonce: `0x${new BN(0).toString(16)}`,
          gasPrice: `0x${new BN(0).toString(16)}`,
          gasLimit: `0x${new BN(0).toString(16)}`,
          value: `0x${new BN(0).toString(16)}`,
          data: '0x',
        };
        const tx = new EthTx(rawTx);
        tx.sign(new Buffer(testAccount.privateKey.slice(2), 'hex'));

        const ethjsSigner = sign(rawTx, testAccount.privateKey);
        const ethereumjsTx = `0x${tx.serialize().toString('hex')}`;

        assert.equal(ethjsSigner, ethereumjsTx);
      }
    });
  });
});
