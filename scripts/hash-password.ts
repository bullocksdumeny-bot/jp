import { hashPassword } from "../src/lib/password";

/**
 * 用法：npm run hash-password -- "你的密码"
 * 输出的哈希填进 .env.local 和 Vercel 的 APP_PASSWORD_HASH。
 * 明文密码不会被写进任何文件。
 */
const password = process.argv[2];

if (!password) {
  console.error('用法：npm run hash-password -- "你的密码"');
  process.exit(1);
}

if (password.length < 10) {
  console.error(
    `密码只有 ${password.length} 位，太短了。这是公网上唯一一道门，请用 16 位以上、含大小写数字符号的随机串。`,
  );
  process.exit(1);
}

hashPassword(password).then((hash) => {
  console.log("\nAPP_PASSWORD_HASH=" + hash + "\n");
  console.log("把上面这行填进 .env.local，并在 Vercel 项目设置里配同样的值。");
});
