import CryptoJS from 'crypto-js';

export default {
  // 加密
  encrypt (word, keyStr) {
    keyStr = keyStr || 'absoietlj32fai12';
    let key = CryptoJS.enc.Utf8.parse(keyStr),
      srcs = CryptoJS.enc.Utf8.parse(word),
      encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
    return encrypted.toString();
  },
  // 解密
  decrypt (word, keyStr) {
    keyStr = keyStr || 'absoietlj32fai12';
    let key = CryptoJS.enc.Utf8.parse(keyStr),
      decrypt = CryptoJS.AES.decrypt(word, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  }
};
