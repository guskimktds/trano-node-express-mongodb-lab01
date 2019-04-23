"use strict";
var crypto = require("crypto");
var severConfig=require('../severconfig');

const ENCRYPTION_KEY = severConfig.ENCRYPTION_KEY;
const IV_LENGTH = 16;

var EncryptionHelper = (function () {

    // function getKeyAndIV(key, callback) {
    //     crypto.pseudoRandomBytes(16, function (err, ivBuffer) {
    //
    //         var keyBuffer  = (key instanceof Buffer) ? key : Buffer.from(key) ;
    //
    //         callback({
    //             iv: ivBuffer,
    //             key: keyBuffer
    //         });
    //     });
    // }


    function encrypt(text) {
      let iv = crypto.randomBytes(IV_LENGTH);
      let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
      let encrypted = cipher.update(text);

      encrypted = Buffer.concat([encrypted, cipher.final()]);

      return iv.toString('hex') + ':' + encrypted.toString('hex');
    }

    function decrypt(text) {
      let textParts = text.split(':');
      let iv = new Buffer(textParts.shift(), 'hex');
      let encryptedText = new Buffer(textParts.join(':'), 'hex');
      let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
      let decrypted = decipher.update(encryptedText);

      decrypted = Buffer.concat([decrypted, decipher.final()]);

      return decrypted.toString();
    }

    return {
        CIPHERS: {
          "AES_128": "aes128",          //requires 16 byte key
          "AES_128_CBC": "aes-128-cbc", //requires 16 byte key
          "AES_192": "aes192",          //requires 24 byte key
          "AES_256": "aes256"           //requires 32 byte key
        },
        // getKeyAndIV: getKeyAndIV,
        // encryptText: encryptText,
        // decryptText: decryptText,
        encrypt: encrypt,
        decrypt: decrypt
    };
})();

module.exports = EncryptionHelper;
