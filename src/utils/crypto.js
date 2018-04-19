import MD5 from 'crypto-js/md5';
import encUtf8 from 'crypto-js/enc-utf8';
import encBase64 from 'crypto-js/enc-base64';
import AES from 'crypto-js/aes';
import modeECB from 'crypto-js/mode-ecb';
import padPkcs7 from 'crypto-js/pad-pkcs7';

// 加密
export const encryptByAes = (data, key) => {
  const keyHash = MD5(key || ''); // Jq2VtktMAyqnMqenGH/FDQ==
  const keyHex = encUtf8.parse(keyHash); // 128
  const encrypted = AES.encrypt(data, keyHex, {
    mode: modeECB,
    padding: padPkcs7,
  });
  return encrypted.toString();
};

/**
 * 加密密钥
 * @param secure
 * @returns {*}
 */
export const encryptSecure = secure => (`${secure}`);

// 解密
export const decryptByAes = (data, key) => {
  const dataA = {
    ciphertext: encBase64.parse(data),
  };
  const keyHex = encUtf8.parse(key);
  return AES.decrypt(dataA, keyHex, {
    mode: modeECB,
    padding: padPkcs7,
  }).toString(encUtf8);
};
