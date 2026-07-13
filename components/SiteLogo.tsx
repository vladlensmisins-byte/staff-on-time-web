"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SiteLogoProps = {
  className?: string;
};

export default function SiteLogo({ className = "logo" }: SiteLogoProps) {
  const pathname = usePathname();

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <Link href="/" className={className} onClick={handleClick} aria-label="staffontime Startseite">
      staffontime<span className="dot">.</span>
    </Link>
  );
}
