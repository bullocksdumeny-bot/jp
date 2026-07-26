import { NextResponse } from "next/server";

import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { clearFailures, clientKey, isLockedOut, recordFailure } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const key = clientKey(request);

  if (isLockedOut(key)) {
    return NextResponse.json(
      { error: "失败次数过多，请 15 分钟后再试。" },
      { status: 429 },
    );
  }

  const hash = process.env.APP_PASSWORD_HASH;
  if (!hash) {
    return NextResponse.json(
      { error: "服务端未配置 APP_PASSWORD_HASH。" },
      { status: 500 },
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    if (typeof body.password === "string") password = body.password;
  } catch {
    // 空 body 按密码错误处理，走下面同一条失败路径。
  }

  const ok = password.length > 0 && (await verifyPassword(password, hash));

  if (!ok) {
    recordFailure(key);
    return NextResponse.json({ error: "密码不对。" }, { status: 401 });
  }

  clearFailures(key);

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: await createSessionToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}
