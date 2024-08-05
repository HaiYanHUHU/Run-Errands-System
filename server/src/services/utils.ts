import crypto from 'crypto';
import CryptoJS from 'crypto-js';
import NodeRSA from 'node-rsa';
import { v4 as uuidv4 } from 'uuid';
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';
import { failed } from '@axiosleo/koapp';
import { RequestStatusCode } from '@/types';
import { _redis } from './db';
import { helper, debug } from '@axiosleo/cli-tool';

const { _assign } = helper.obj;
const { _number } = helper.convert;

export function userPass(userpass: string, salt: string) {
  return `${CryptoJS.MD5(CryptoJS.HmacSHA512(salt, `${userpass}`).toString()).toString()}==`;
}

export function generateRandomPassword(length: number) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

export function md5(str: string) {
  return CryptoJS.MD5(str).toString();
}

export function generateToken(salt: string) {
  return md5(`${new Date().getTime()}${salt}${Math.random()}`);
}

export function generateUUID() {
  return uuidv4();
}

export function _checkMobileFormat(mobile: string, countryCode: CountryCode = 'CN') {
  const phoneNumberObj = parsePhoneNumberFromString(mobile, countryCode);
  if (!phoneNumberObj) {
    return false;
  }
  return phoneNumberObj.isValid();
}

export function _failed(code: RequestStatusCode) {
  failed({}, code, 200);
}

type AdvanceCodeOptions = {
  min: number,
  max: number,
  ticket_length?: number,
  random_str_length?: number,
  code_uniq: string,
  digits: string
};

type AdvanceCodeOptionsPartial = {
  min?: number,
  max?: number,
  ticket_length?: number,
  random_str_length?: number,
  code_uniq?: string,
  digits?: string
};

export function _randomStr(len: number, dict = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
  let str = '';
  for (let i = 0; i < len; i++) {
    const index = Math.floor(Math.random() * dict.length);
    str += dict[index];
  }
  return str;
}

class AdvanceCode {
  options: AdvanceCodeOptions = {
    min: 0,
    max: -1,
    // ticket_length: 6, // undefined ：Is an indefinite length
    // random_str_length: 6, // Random string length
    code_uniq: 'default', // redis key
    digits: 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  };

  constructor(options?: AdvanceCodeOptionsPartial) {
    this.options = _assign(this.options, options || {}) as AdvanceCodeOptions;
  }

  /**
   * 不定长度，混淆字符串长度与数字字符长度相同
   */
  async v1(): Promise<string> {
    const redis = _redis();
    const { code_uniq, min, max, digits } = this.options;
    const key = `advance_code_${code_uniq}`;

    // 根据 code_uniq 查询自增值
    let ticket = await redis.incrby(key, min);
    if (max > 0 && ticket > max) {
      ticket = min;
      await redis.set(key, ticket);
    }
    const counter = _number(ticket, 10, 62, { digits });
    const str = _randomStr(counter.str.length, digits);
    let res = '';
    let i = 0;
    for (i = 0; i < counter.str.length; i++) {
      res += str[i] + counter.str[i];
    }
    return res;
  }
}

export async function _code_v1(scene = 'default') {
  const code = new AdvanceCode({ min: 1000000, code_uniq: scene });
  return await code.v1();
}

export function _is() {
  return helper.is;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function _log(...data: any[]) {
  return debug.log(...data);
}

export function _hexToByte(hex: string) {
  const bytes = [];
  for (let c = 0; c < hex.length / 2; c++) {
    const i = Math.ceil(c);
    const a = parseInt(hex.substring(c * 2, c * 2 + 1), 16) << 4;
    const b = parseInt(hex.substring(c * 2 + 1, c * 2 + 2), 16);
    const s = a + b;
    bytes[i] = s > 128 ? s - 256 : s;
  }
  return bytes;
}

export type AesCbcOptions = {
  key: string,
  iv: string,
  encrypt?: boolean,
}

export function _aes_cbc(data: string, options?: AesCbcOptions): string {
  const { key, iv, encrypt } = Object.assign({
    key: '',
    iv: '',
    encrypt: true,
  }, options);
  const k = CryptoJS.enc.Utf8.parse(key);  //十六位十六进制数作为密钥
  const i = CryptoJS.enc.Utf8.parse(iv);   //十六位十六进制数作为密钥偏移量
  if (encrypt) {
    // encrypt
    const srcs = CryptoJS.enc.Utf8.parse(data);
    const encrypted = CryptoJS.AES.encrypt(srcs, k, { iv: i, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.ciphertext.toString().toUpperCase();
  }

  // decode
  const encryptedHexStr = CryptoJS.enc.Hex.parse(data);
  const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  const decrypt = CryptoJS.AES.decrypt(srcs, k, { iv: i, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

export function generateKeyAndIV() {
  const key = crypto.randomBytes(16).toString('hex'); // 生成32字节的随机密钥
  const iv = crypto.randomBytes(8).toString('hex'); // 生成16字节的随机初始向量
  return { key, iv };
}

export class RSAEncrypt {
  length: number;
  constructor(length: number = 2048) {
    this.length = length;
  }

  generateKeyPair(): { privateKey: string, publicKey: string } {
    const key = new NodeRSA({ b: this.length });
    key.generateKeyPair();
    const privateKey = key.exportKey('pkcs8-private-pem');
    const publicKey = key.exportKey('pkcs8-public-pem');
    return { privateKey, publicKey };
  }

  encryptPrivate(obj: object, privateKey: string): string {
    const data = JSON.stringify(obj);
    const key = new NodeRSA();
    key.importKey(privateKey, 'pkcs8-private-pem');
    return key.encryptPrivate(data).toString('base64');
  }

  encryptPublic(obj: object, publicKey: string, format: NodeRSA.Format) {
    const data = JSON.stringify(obj);
    const key = new NodeRSA();
    key.importKey(publicKey, format);
    return key.encrypt(data).toString('base64');
  }

  /**
   * 
   * @param data base64 string
   * @param publicKey 
   * @returns 
   */
  decryptPublic<T extends object>(data: string, publicKey: string): T {
    const key = new NodeRSA();
    key.importKey(publicKey, 'pkcs8-public-pem');
    const str = key.decryptPublic(Buffer.from(data, 'base64')).toString();
    return JSON.parse(str);
  }
}

export function computeRate(yesterday_count: number, today_count: number) {
  // - 在今日（00:00:00~23:59:59）上传的报警数据总数与昨日“本日报警总数”数据的比较
  // - 若昨日=0，则视作“—”（逻辑优先级高）
  // - 若今日=0，则视作“-100%”
  let rate = '0%';
  if (yesterday_count === 0 && today_count === 0) {
    rate = '0%';
  } else if (yesterday_count === 0) {
    rate = '100%';
  } else if (today_count === 0) {
    rate = '-100%';
  }
  if (yesterday_count !== 0 && today_count !== 0) {
    rate = `${(today_count - yesterday_count) / yesterday_count}%`;
  }
  return rate;
}
