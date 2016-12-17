const rlp = require('rlp');
const elliptic = require('elliptic');
const keccak256 = require('js-sha3').keccak_256;
const secp256k1 = new (elliptic.ec)('secp256k1'); // eslint-disable-line
const stripHexPrefix = require('strip-hex-prefix');
const numberToBN = require('number-to-bn');

function stripZeros(buffer) {
  var i = 0; // eslint-disable-line
  for (i = 0; i < buffer.length; i++) {
    if (buffer[i] !== 0) { break; }
  }
  return (i > 0) ? buffer.slice(i) : buffer;
}

function padToEven(str) {
  return str.length % 2 ? `0${str}` : str;
}

function bnToBuffer(bn) {
  return stripZeros(new Buffer(padToEven(bn.toString(16)), 'hex'));
}

const transactionFields = [
  { name: 'nonce', maxLength: 32, number: true },
  { name: 'gasPrice', maxLength: 32, number: true },
  { name: 'gasLimit', maxLength: 32, number: true },
  { name: 'to', length: 20 },
  { name: 'value', maxLength: 32, number: true },
  { name: 'data' },
];

/**
 * ECDSA public key recovery from a rawTransaction
 *
 * @method recover
 * @param {String|Buffer} rawTransaction either a hex string or buffer instance
 * @param {Number} v
 * @param {Buffer} r
 * @param {Buffer} s
 * @return {Buffer} publicKey
 */

function recover(rawTx, v, r, s) {
  const rawTransaction = typeof(rawTx) === 'string' ? new Buffer(stripHexPrefix(rawTx), 'hex') : rawTx;
  const signedTransaction = rlp.decode(rawTransaction);
  const raw = [];

  transactionFields.forEach((fieldInfo, fieldIndex) => {
    raw[fieldIndex] = signedTransaction[fieldIndex];
  });

  const publicKey = secp256k1.recoverPubKey((new Buffer(keccak256(rlp.encode(raw)), 'hex')), { r, s }, v - 27);
  return (new Buffer(publicKey.encode('hex', false), 'hex')).slice(1);
}

/**
 * Will sign a raw transaction and return it either as a serlized hex string or raw tx object.
 *
 * @method sign
 * @param {Object} transaction a valid transaction object
 * @param {String} privateKey a valid 32 byte prefixed hex string private key
 * @param {Boolean} toObject **Optional**
 * @returns {String|Object} output either a serilized hex string or signed tx object
 */

function sign(transaction, privateKey, toObject) {
  if (typeof transaction !== 'object' || transaction === null) { throw new Error(`[ethjs-signer] transaction input must be a type 'object', got '${typeof(transaction)}'`); }
  if (typeof privateKey !== 'string') { throw new Error('[ethjs-signer] private key input must be a string'); }
  if (!privateKey.match(/^(0x)[0-9a-fA-F]{64}$/)) { throw new Error('[ethjs-signer] invalid private key value, private key must be a prefixed hexified 32 byte string (i.e. "0x..." 64 chars long).'); }

  const raw = [];

  transactionFields.forEach((fieldInfo) => {
    var value = new Buffer(0); // eslint-disable-line

    // shim for field name gas
    const txKey = (fieldInfo.name === 'gasLimit' && transaction.gas) ? 'gas' : fieldInfo.name;

    if (typeof transaction[txKey] !== 'undefined') {
      if (fieldInfo.number === true) {
        value = bnToBuffer(numberToBN(transaction[txKey]));
      } else {
        value = new Buffer(padToEven(stripHexPrefix(transaction[txKey])), 'hex');
      }
    }

    // Fixed-width field
    if (fieldInfo.length && value.length !== fieldInfo.length && value.length > 0) {
      throw new Error(`[ethjs-signer] while signing raw transaction, invalid '${fieldInfo.name}', invalid length should be '${fieldInfo.length}' got '${value.length}'`);
    }

    // Variable-width (with a maximum)
    if (fieldInfo.maxLength) {
      value = stripZeros(value);
      if (value.length > fieldInfo.maxLength) {
        throw new Error(`[ethjs-signer] while signing raw transaction, invalid '${fieldInfo.name}' length, the max length is '${fieldInfo.maxLength}', got '${value.length}'`);
      }
    }

    raw.push(value);
  });

  // private key is not stored in memory
  const signature = secp256k1.keyFromPrivate(new Buffer(privateKey.slice(2), 'hex'))
                    .sign((new Buffer(keccak256(rlp.encode(raw)), 'hex')), { canonical: true });

  raw.push(new Buffer([27 + signature.recoveryParam]));
  raw.push(bnToBuffer(signature.r));
  raw.push(bnToBuffer(signature.s));

  return toObject ? raw : `0x${rlp.encode(raw).toString('hex')}`;
}

module.exports = {
  sign,
  recover,
};
