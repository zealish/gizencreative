"use client";

import { usePathname } from "next/navigation";
import type { AnchorHTMLAttributes } from "react";

type WaLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  source: string;
  href: string;
};

export function WaLink({ source, href, children, ...props }: WaLinkProps) {
  const pathname = usePathname();

  function trackClick() {
    const payload = JSON.stringify({ source, path: pathname });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/wa-click",
        new Blob([payload], { type: "application/json" }),
      );
    } else {
      fetch("/api/wa-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }

  return (
    <a {...props} href={href} onClick={trackClick}>
      {children}
    </a>
  );
}
