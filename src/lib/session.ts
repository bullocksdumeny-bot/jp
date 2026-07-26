import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

import { SESSION_COOKIE, hasValidSession } from "./auth";

/**
 * proxy.ts 是第一道闸门，但 Next 官方文档明确提醒：matcher 改动或路由重构
 * 可能悄无声息地让某条路径漏出闸门之外。所以每个页面和 API 自己再验一次，
 * 成本只是一次 JWT 验签。
 */

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return hasValidSession(store.get(SESSION_COOKIE)?.value);
}

/** 页面用：未登录直接跳登录页。 */
export async function requireSession(): Promise<void> {
  if (!(await isAuthenticated())) redirect("/login");
}

/** API 用：未登录返回 401 响应，登录了返回 null。 */
export async function unauthorized(): Promise<Response | null> {
  if (await isAuthenticated()) return null;
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}
