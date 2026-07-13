import type { Metadata } from "next";
import Link from "next/link";
import SiteLogo from "@/components/SiteLogo";

export const metadata: Metadata = {
  title: "Datenschutz, staffontime",
  description:
    "Datenschutzerklärung der Raleko UG (haftungsbeschränkt) gemäß DSGVO für die Website staffontime.de.",
};

export default function DatenschutzPage() {
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
          <h1>Datenschutzerklärung</h1>
          <p className="legal-intro">
            Stand: Juli 2026. Diese Datenschutzerklärung informiert Sie über Art, Umfang und Zweck der
            Verarbeitung personenbezogener Daten auf staffontime.de sowie über Ihre Rechte nach der
            Datenschutz-Grundverordnung (DSGVO) und dem Bundesdatenschutzgesetz (BDSG).
          </p>

          <div className="legal-block">
            <h2>1. Verantwortlicher</h2>
            <p>
              Raleko UG (haftungsbeschränkt)
              <br />
              Am Stichkanal 2 bis 4
              <br />
              14167 Berlin
              <br />
              Deutschland
              <br />
              E-Mail:{" "}
              <a href="mailto:kontakt@staffontime.de" className="legal-link">
                kontakt@staffontime.de
              </a>
              <br />
              Telefon:{" "}
              <a href="tel:+491636791216" className="legal-link">
                +49 163 679 1216
              </a>
            </p>
            <p>
              Vertreten durch die Geschäftsführerin: Viktorija Misina.
              <br />
              Weitere Angaben:{" "}
              <Link href="/impressum" className="legal-link">
                Impressum
              </Link>
              .
            </p>
          </div>

          <div className="legal-block">
            <h2>2. Allgemeine Hinweise zur Datenverarbeitung</h2>
            <p>
              Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung einer
              funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist oder eine
              Einwilligung bzw. eine sonstige Rechtsgrundlage nach Art. 6 Abs. 1 DSGVO vorliegt.
            </p>
          </div>

          <div className="legal-block">
            <h2>3. Hosting und Server-Logfiles</h2>
            <p>
              (1) Beim Besuch der Website werden durch den Hosting-Anbieter automatisch Informationen
              erfasst (Server-Logfiles), insbesondere IP-Adresse, Datum und Uhrzeit der Anfrage,
              aufgerufene Seite/Datei, Referrer-URL, Browser-Typ und Betriebssystem.
            </p>
            <p>
              (2) Die Verarbeitung erfolgt zur technischen Bereitstellung und Absicherung der Website
              auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren und
              stabilen Betrieb).
            </p>
            <p>
              (3) Die Website wird über Dienstleister (z. B. Hosting-/Deployment-Anbieter) betrieben.
              Mit diesen bestehen, soweit erforderlich, Auftragsverarbeitungsverträge nach Art. 28
              DSGVO.
            </p>
          </div>

          <div className="legal-block">
            <h2>4. Kontakt- und Anfrageformulare</h2>
            <p>
              (1) Wenn Sie uns über Formulare (z. B. Personal anfragen, Partner werden) kontaktieren,
              verarbeiten wir die von Ihnen angegebenen Daten (z. B. Unternehmen, Name, E-Mail,
              Branche, Nachrichteninhalt), um Ihre Anfrage zu bearbeiten und zu beantworten.
            </p>
            <p>
              (2) Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen) bzw. Art. 6
              Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bearbeitung von Geschäftsanfragen).
            </p>
            <p>
              (3) Die Daten werden gelöscht, sobald sie für den Zweck der Erhebung nicht mehr
              erforderlich sind, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
            </p>
          </div>

          <div className="legal-block">
            <h2>5. Bewerbungen und Interviewbuchung</h2>
            <p>
              (1) Im Bewerbungsprozess verarbeiten wir die von Ihnen übermittelten Angaben (z. B. Name,
              Kontaktdaten, Qualifikation, Berufserfahrung, Sprachkenntnisse, Branchenwünsche,
              Führerscheine, Aufenthaltsstatus, Lebenslauf-Dateien) sowie gewählte Interviewtermine.
            </p>
            <p>
              (2) Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO i. V. m. § 26 BDSG (Begründung eines
              Beschäftigungsverhältnisses / Vermittlung) sowie ggf. Art. 6 Abs. 1 lit. a DSGVO bei
              gesondert erteilten Einwilligungen.
            </p>
            <p>
              (3) Bewerbungsunterlagen werden nur so lange gespeichert, wie dies für den
              Vermittlungs- bzw. Auswahlprozess erforderlich ist oder gesetzliche Fristen dies
              verlangen. Danach werden sie gelöscht oder anonymisiert, sofern keine Einwilligung zur
              längeren Speicherung vorliegt.
            </p>
          </div>

          <div className="legal-block">
            <h2>6. E-Mail-Kommunikation</h2>
            <p>
              Zur Bearbeitung von Anfragen und zur Bestätigung von Vorgängen können wir E-Mails
              versenden (z. B. über E-Mail-Dienstleister). Rechtsgrundlage ist Art. 6 Abs. 1 lit. b oder
              lit. f DSGVO. Mit Dienstleistern bestehen, soweit erforderlich,
              Auftragsverarbeitungsverträge.
            </p>
          </div>

          <div className="legal-block">
            <h2>7. Cookies und ähnliche Technologien</h2>
            <p>
              (1) Wir setzen technisch notwendige Cookies bzw. vergleichbare Speichertechnologien ein,
              soweit dies für den Betrieb der Website, die Sicherheit oder die Speicherung
              grundlegender Einstellungen (z. B. Sprache) erforderlich ist (Art. 6 Abs. 1 lit. f DSGVO).
            </p>
            <p>
              (2) Soweit wir optionale Analyse- oder Marketing-Technologien einsetzen, erfolgt dies nur
              mit Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), sofern gesetzlich erforderlich. Sie
              können eine erteilte Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen.
            </p>
          </div>

          <div className="legal-block">
            <h2>8. Empfänger und Weitergabe</h2>
            <p>
              Personenbezogene Daten werden an Dritte nur weitergegeben, wenn dies zur
              Vertragserfüllung erforderlich ist, eine gesetzliche Pflicht besteht, ein berechtigtes
              Interesse vorliegt oder eine Einwilligung erteilt wurde. Mögliche Empfänger sind
              insbesondere Hosting-, IT- und E-Mail-Dienstleister sowie – im Rahmen einer Vermittlung –
              potenzielle Arbeitgeber bzw. Partnerunternehmen, soweit dies dem Zweck der Bewerbung
              entspricht.
            </p>
          </div>

          <div className="legal-block">
            <h2>9. Speicherdauer</h2>
            <p>
              Wir speichern personenbezogene Daten nur so lange, wie es für die jeweiligen Zwecke
              erforderlich ist oder gesetzliche Aufbewahrungsfristen (z. B. handels- und
              steuerrechtliche Fristen) bestehen. Nach Wegfall des Zwecks bzw. Ablauf der Frist werden
              die Daten gelöscht oder gesperrt.
            </p>
          </div>

          <div className="legal-block">
            <h2>10. Ihre Rechte</h2>
            <p>Sie haben nach Maßgabe der gesetzlichen Bestimmungen insbesondere das Recht auf:</p>
            <p>
              Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO),
              Einschränkung der Verarbeitung (Art. 18 DSGVO), Datenübertragbarkeit (Art. 20 DSGVO)
              sowie Widerspruch gegen die Verarbeitung (Art. 21 DSGVO), soweit die Voraussetzungen
              vorliegen.
            </p>
            <p>
              Sofern die Verarbeitung auf einer Einwilligung beruht, können Sie diese jederzeit mit
              Wirkung für die Zukunft widerrufen (Art. 7 Abs. 3 DSGVO).
            </p>
            <p>
              Außerdem haben Sie das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren
              (Art. 77 DSGVO), insbesondere bei der für Berlin zuständigen Behörde.
            </p>
          </div>

          <div className="legal-block">
            <h2>11. Sicherheit</h2>
            <p>
              Wir treffen technisch und organisatorisch angemessene Maßnahmen, um personenbezogene
              Daten gegen Verlust, Zerstörung, Manipulation und unbefugten Zugriff zu schützen. Eine
              absolute Sicherheit bei der Übertragung über das Internet kann gleichwohl nicht
              gewährleistet werden.
            </p>
          </div>

          <div className="legal-block">
            <h2>12. Aktualität</h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den
              aktuellen rechtlichen Anforderungen entspricht oder Änderungen unserer Leistungen
              abbildet. Für einen erneuten Besuch gilt dann die jeweils aktuelle Fassung.
            </p>
          </div>

          <div className="legal-block">
            <h2>13. Kontakt zum Datenschutz</h2>
            <p>
              Bei Fragen zur Verarbeitung Ihrer personenbezogenen Daten wenden Sie sich bitte an:{" "}
              <a href="mailto:kontakt@staffontime.de" className="legal-link">
                kontakt@staffontime.de
              </a>
              .
            </p>
            <p>
              Siehe auch{" "}
              <Link href="/agb" className="legal-link">
                AGB
              </Link>{" "}
              und{" "}
              <Link href="/impressum" className="legal-link">
                Impressum
              </Link>
              .
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
        </div>
      </footer>
    </>
  );
}
