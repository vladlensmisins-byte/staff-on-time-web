"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type SiteHeaderProps = {
  variant?: "home" | "minimal";
};

const MOBILE_NAV_LINKS = [
  { href: "#paths", key: "navForCompanies", label: "Für Unternehmen" },
  { href: "#industries", key: "navIndustries", label: "Branchen" },
  { href: "#process", key: "navProcess", label: "Ablauf" },
  { href: "#contact", key: "navContact", label: "Kontakt" },
] as const;

export default function SiteHeader({ variant = "home" }: SiteHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("mobile-nav-open", menuOpen);
    document.body.classList.toggle("home-fixed-header", variant === "home");
    return () => {
      document.body.classList.remove("mobile-nav-open");
      document.body.classList.remove("home-fixed-header");
    };
  }, [menuOpen, variant]);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMenuOpen(false);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function onNavClick() {
    closeMenu();
  }

  const mobileMenu =
    mounted && variant === "home"
      ? createPortal(
          <div
            className={`mobile-nav-portal${menuOpen ? " is-open" : ""}`}
            aria-hidden={!menuOpen}
            onClick={closeMenu}
          >
            <nav className="mobile-nav-panel" onClick={(e) => e.stopPropagation()}>
              {MOBILE_NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} data-i18n={link.key} onClick={onNavClick}>
                  {link.label}
                </a>
              ))}
              <div className="mobile-nav-ctas">
                <a href="#contact" className="btn btn-ghost" data-i18n="navPartner" onClick={onNavClick}>
                  Partner werden
                </a>
                <a
                  href="#contact"
                  className="btn btn-primary"
                  data-i18n="navRequestStaff"
                  onClick={onNavClick}
                >
                  Personal anfragen
                </a>
              </div>
            </nav>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <header className={`site-header${menuOpen ? " menu-open" : ""}`}>
        <nav className="wrap header-inner">
          <Link
            href="/"
            className="logo"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                scrollToTop();
              }
            }}
          >
            staffontime<span className="dot">.</span>
          </Link>

          <div className="header-right">
            {variant === "home" ? (
              <>
                <div className="nav-links">
                  {MOBILE_NAV_LINKS.map((link) => (
                    <a key={link.href} href={link.href} data-i18n={link.key}>
                      {link.label}
                    </a>
                  ))}
                </div>
                <div className="nav-cta">
                  <a href="#contact" className="btn btn-ghost" data-i18n="navPartner">
                    Partner werden
                  </a>
                  <a href="#contact" className="btn btn-primary" data-i18n="navRequestStaff">
                    Personal anfragen
                  </a>
                </div>
              </>
            ) : null}

            <div className="lang-switch">
              <button type="button" data-lang="de" className="active">
                DE
              </button>
              <button type="button" data-lang="en">
                EN
              </button>
            </div>

            {variant === "home" ? (
              <button
                type="button"
                className="menu-toggle"
                aria-label="Menü"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                <span />
                <span />
                <span />
              </button>
            ) : null}
          </div>
        </nav>
      </header>
      {mobileMenu}
    </>
  );
}
