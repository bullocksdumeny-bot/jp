import { randomBytes } from "node:crypto";

/**
 * 用法：npm run gen-secret
 * 生成会话 Cookie 的签名密钥，填进 SESSION_SECRET。
 * 换掉这个值会让所有已登录设备立即失效。
 */
// base64url 不含 $，可以直接粘进 .env 而不会被变量展开吃掉。
console.log("\nSESSION_SECRET=" + randomBytes(48).toString("base64url") + "\n");
