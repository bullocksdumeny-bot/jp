"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await fetch("/api/logout", { method: "POST" });
        router.replace("/login");
        router.refresh();
      }}
      className="text-xs text-muted underline underline-offset-4 hover:text-foreground disabled:opacity-40"
    >
      {pending ? "退出中…" : "退出登录"}
    </button>
  );
}
