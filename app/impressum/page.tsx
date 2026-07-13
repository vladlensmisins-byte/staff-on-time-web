import type { Metadata } from "next";
import Link from "next/link";
import SiteLogo from "@/components/SiteLogo";

export const metadata: Metadata = {
  title: "Impressum, staffontime",
  description: "Impressum und Anbieterkennzeichnung der Raleko UG (haftungsbeschränkt).",
};

export default function ImpressumPage() {
  return (
    <>
      <header className="site-header">
        <nav className="wrap header-inner">
          <SiteLogo />
          <div className="header-right">
            <div className="nav-links">
              <Link href="/#paths">Für Unternehmen</Link>
              <Link href="/#process">Ablauf</Link>
              <Link href="/#industries">Branchen</Link>
              <Link href="/#contact">Kontakt</Link>
            </div>
            <div className="nav-cta">
              <Link href="/#contact-partner" className="btn btn-ghost">
                Partner werden
              </Link>
              <Link href="/#contact" className="btn btn-primary">
                Personal anfragen
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="legal-page">
        <div className="wrap">
          <p className="mono legal-kicker">Rechtliches</p>
          <h1>Impressum</h1>

          <div className="legal-block">
            <p>
              Raleko UG (haftungsbeschränkt)
              <br />
              Am Stichkanal 2 bis 4
              <br />
              14167 Berlin
              <br />
              Deutschland
            </p>
          </div>

          <div className="legal-block">
            <p>Vertreten durch die Geschäftsführerin: Viktorija Misina</p>
          </div>

          <div className="legal-block">
            <h2>Kontakt:</h2>
            <p>
              Telefon:{" "}
              <a href="tel:+491636791216" className="legal-link">
                +49 163 679 1216
              </a>
              <br />
              E-Mail:{" "}
              <a href="mailto:kontakt@staffontime.de" className="legal-link">
                kontakt@staffontime.de
              </a>
            </p>
          </div>

          <div className="legal-block">
            <h2>Registereintrag:</h2>
            <p>
              Eingetragen im Handelsregister
              <br />
              Registergericht: Amtsgericht Charlottenburg
              <br />
              Registernummer: HRB 283254 B
            </p>
          </div>

          <div className="legal-block">
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
              <br />
              [wird ergänzt, sobald vorhanden]
            </p>
          </div>

          <div className="legal-block">
            <p>
              Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:
              <br />
              Viktorija Misina
              <br />
              Am Stichkanal 2 bis 4, 14167 Berlin
            </p>
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-col">
              <SiteLogo className="logo logo-foot" />
              <p className="foot-tagline">
                Personalvermittlung mit festen Fristen und geprüften Prozessen für Unternehmen, die
                sich auf Termine verlassen müssen.
              </p>
            </div>
            <div className="foot-col">
              <h5>Unternehmen</h5>
              <Link href="/#paths">Für Unternehmen</Link>
              <Link href="/#process">Ablauf</Link>
              <Link href="/#industries">Branchen</Link>
            </div>
            <div className="foot-col">
              <h5>Rechtliches</h5>
              <Link href="/impressum">Impressum</Link>
              <Link href="/datenschutz">Datenschutz</Link>
              <Link href="/agb">AGB</Link>
            </div>
            <div className="foot-col">
              <h5>Kontakt</h5>
              <Link href="/#contact">Personal anfragen</Link>
              <Link href="/#contact-partner">Partner werden</Link>
            </div>
          </div>
          <div className="foot-bottom">
            <p>© 2026 staffontime. Alle Rechte vorbehalten.</p>
          </div>
          <div className="footer-meta">
            <div className="trust-inner">
              <div className="trust-item">
                <strong>2026</strong>&nbsp;Gegründet
              </div>
              <div className="trust-item">
                <strong>DSGVO</strong>&nbsp;konform
              </div>
              <div className="trust-item">
                <strong>3</strong>&nbsp;Kernbranchen
              </div>
              <div className="trust-item">
                <strong>iGZ/BAP</strong>&nbsp;Beitritt in Prüfung
              </div>
            </div>
            <div className="license-note">
              Antrag auf Arbeitnehmerüberlassungserlaubnis gem. §1 AÜG gestellt
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
