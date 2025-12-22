"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SessionCheck() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;

    if (!session && !publicPaths.includes(pathname)) {
      router.push("/auth/login");
    }
  }, [session, status, pathname, router]);

  return null;
}

const publicPaths = ["/auth/login", "/auth/register"];
