import { isDevMode } from '/@/utils/env';

// 缓存默认过期时间 14 天
export const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 14;

// 开启缓存加密后，加密密钥。采用aes加密
export const cacheCipher = {
  key: '_11111000001111@',
  iv: '@11111000001111_',
};

// 是否加密缓存，默认生产环境加密
export const enableStorageEncryption = !isDevMode();
