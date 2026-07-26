import {
  randomBytes,
  scrypt,
  timingSafeEqual,
  type ScryptOptions,
} from "node:crypto";

// 不用 promisify：它会挑中 scrypt 的三参数重载，带 options 的调用过不了类型检查。
function derive(
  password: string,
  salt: Buffer,
  keylen: number,
  options: ScryptOptions,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keylen, options, (error, key) =>
      error ? reject(error) : resolve(key),
    );
  });
}

/**
 * 用 node:crypto 的 scrypt，不用 bcrypt。
 *
 * 原因不是强度，是编码：bcrypt 哈希长成 `$2b$12$...`，而 .env 文件会做变量展开，
 * `$2b` 会被当成变量替换掉，密码校验于是永远失败——而且是静默失败。
 * 这里的编码只含 base64url 字符和点，放进任何 env 都安全。
 */

const N = 16384; // 内存约 16MB，落在 node scrypt 默认 maxmem 之内
const R = 8;
const P = 1;
const KEY_LEN = 64;
const PREFIX = "scrypt";

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt, KEY_LEN, { N, r: R, p: P });
  return [
    PREFIX,
    N,
    R,
    P,
    salt.toString("base64url"),
    key.toString("base64url"),
  ].join(".");
}

export async function verifyPassword(
  password: string,
  encoded: string,
): Promise<boolean> {
  const parts = encoded.split(".");
  if (parts.length !== 6 || parts[0] !== PREFIX) return false;

  const [, n, r, p, saltB64, keyB64] = parts;
  const salt = Buffer.from(saltB64, "base64url");
  const expected = Buffer.from(keyB64, "base64url");
  if (salt.length === 0 || expected.length === 0) return false;

  let actual: Buffer;
  try {
    actual = await derive(password, salt, expected.length, {
      N: Number(n),
      r: Number(r),
      p: Number(p),
    });
  } catch {
    return false;
  }

  return timingSafeEqual(actual, expected);
}
