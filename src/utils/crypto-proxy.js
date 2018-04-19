import crypto from 'crypto';

const algorithm = 'aes-128-ecb'; // 编码
const clearEncoding = 'utf8'; // 输入编码
const cipherEncoding = 'base64'; // 输出编码
const AES_BASE_KEY = 'Jq2VtktMAyqnMqenGH/FDQ=='; // 默认私钥key
const DEFAULT_TOKEN = 'JCeFOs2lw2myA1N31AlEeRKhBKMW4JexdWpilBuA'; // 默认token

/**
 * 加密sha-256
 * @param data
 */
export const encodeSha256 = (data) => {
  return crypto.createHash('sha256')
    .update(data)
    .digest();
};

/**
 * 生成签名
 * @param token
 * @param key
 * @returns {Array|*|ArrayBuffer|string|Array.<T>|Blob}
 */
export const calculateKey = (token = DEFAULT_TOKEN, key = AES_BASE_KEY) => {
  return encodeSha256(`${token}${key}`).toString('hex').slice(0, 16);
};

/**
 *  加密aes, java方规则
 * @param data
 * @param originKey
 * @returns {string}
 */
export const encodeAes = (data = '', key) => {
  const bufferKey = Buffer.from(key);
  const cipher = crypto.createCipheriv(algorithm, bufferKey, Buffer.from(''));
  const cipherChunks = [];
  cipherChunks.push(
    cipher.update(
      Buffer.from(data, clearEncoding),
      clearEncoding,
      cipherEncoding
    )
  );
  cipherChunks.push(cipher.final(cipherEncoding));
  return cipherChunks.join('');
};

/**
 * 加密md5
 * @param data
 */
export const encodeMd5 = (data) => {
  return crypto.createHash('md5')
    .update(data, 'utf8')
    .digest('hex');
};
