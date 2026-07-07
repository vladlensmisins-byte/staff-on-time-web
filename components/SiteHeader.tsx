"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type SiteHeaderProps = {
  variant?: "home" | "minimal";
};

export default function SiteHeader({ variant = "home" }: SiteHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("mobile-nav-open", menuOpen);
    return () => document.body.classList.remove("mobile-nav-open");
  }, [menuOpen]);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMenuOpen(false);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
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
                <a href="#paths" data-i18n="navForCompanies">
                  Für Unternehmen
                </a>
                <a href="#process" data-i18n="navProcess">
                  Ablauf
                </a>
                <a href="#industries" data-i18n="navIndustries">
                  Branchen
                </a>
                <a href="#contact" data-i18n="navContact">
                  Kontakt
                </a>
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

      {variant === "home" ? (
        <div className="mobile-nav" aria-hidden={!menuOpen}>
          <div className="mobile-nav-inner">
            <a href="#paths" data-i18n="navForCompanies" onClick={closeMenu}>
              Für Unternehmen
            </a>
            <a href="#process" data-i18n="navProcess" onClick={closeMenu}>
              Ablauf
            </a>
            <a href="#industries" data-i18n="navIndustries" onClick={closeMenu}>
              Branchen
            </a>
            <a href="#contact" data-i18n="navContact" onClick={closeMenu}>
              Kontakt
            </a>
            <div className="mobile-nav-ctas">
              <a href="#contact" className="btn btn-ghost" data-i18n="navPartner" onClick={closeMenu}>
                Partner werden
              </a>
              <a
                href="#contact"
                className="btn btn-primary"
                data-i18n="navRequestStaff"
                onClick={closeMenu}
              >
                Personal anfragen
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
