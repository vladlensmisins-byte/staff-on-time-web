import type { Metadata } from "next";
import Link from "next/link";
import SiteLogo from "@/components/SiteLogo";

export const metadata: Metadata = {
  title: "AGB, staffontime",
  description:
    "Allgemeine Geschäftsbedingungen der Raleko UG (haftungsbeschränkt) für Personalvermittlung und damit verbundene Leistungen.",
};

export default function AgbPage() {
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
          <h1>Allgemeine Geschäftsbedingungen (AGB)</h1>
          <p className="legal-intro">
            Stand: Juli 2026. Diese AGB gelten für die Nutzung der Website staffontime.de sowie für
            Verträge über Personalvermittlung und damit zusammenhängende Leistungen der Raleko UG
            (haftungsbeschränkt), handelnd unter der Marke staffontime.
          </p>

          <div className="legal-block">
            <h2>§ 1 Geltungsbereich und Vertragspartner</h2>
            <p>
              (1) Vertragspartner ist die Raleko UG (haftungsbeschränkt), Am Stichkanal 2 bis 4, 14167
              Berlin, Deutschland (nachfolgend „Anbieter“, „wir“ oder „staffontime“), vertreten durch die
              Geschäftsführerin Viktorija Misina.
            </p>
            <p>
              (2) Diese AGB gelten ausschließlich gegenüber Unternehmern im Sinne von § 14 BGB,
              juristischen Personen des öffentlichen Rechts und öffentlich-rechtlichen
              Sondervermögen (nachfolgend „Kunde“). Gegenüber Verbrauchern im Sinne von § 13 BGB
              finden diese AGB keine Anwendung, soweit gesetzlich zwingend etwas anderes gilt.
            </p>
            <p>
              (3) Abweichende, entgegenstehende oder ergänzende Allgemeine Geschäftsbedingungen des
              Kunden werden nur dann Vertragsbestandteil, wenn wir ihrer Geltung ausdrücklich
              schriftlich zugestimmt haben.
            </p>
          </div>

          <div className="legal-block">
            <h2>§ 2 Leistungsgegenstand</h2>
            <p>
              (1) staffontime vermittelt qualifizierte Arbeitskräfte an Unternehmen, insbesondere in
              den Bereichen Logistik & Zustellung, Hotellerie & Gastronomie sowie Reinigung & Fabrik,
              und erbringt damit zusammenhängende Beratungs- und Koordinationsleistungen.
            </p>
            <p>
              (2) Soweit Leistungen der Arbeitnehmerüberlassung (AÜG) betroffen sind, erbringt der
              Anbieter diese nur im gesetzlich zulässigen Rahmen und nur, soweit die erforderliche
              Erlaubnis nach § 1 AÜG vorliegt. Der Antrag auf Erteilung der
              Arbeitnehmerüberlassungserlaubnis wurde gestellt; die Erteilung steht aus. Bis zur
              Erlaubniserteilung beschränkt sich das Angebot, soweit erforderlich, auf erlaubnisfreie
              Vermittlungs- und Beratungsleistungen.
            </p>
            <p>
              (3) Ein Anspruch auf erfolgreiche Vermittlung oder auf Bereitstellung bestimmter
              Kandidatinnen und Kandidaten besteht nicht, sofern nicht ausdrücklich etwas anderes
              schriftlich vereinbart wurde.
            </p>
          </div>

          <div className="legal-block">
            <h2>§ 3 Vertragsschluss</h2>
            <p>
              (1) Anfragen über die Website, per E-Mail oder Telefon stellen unverbindliche
              Interessensbekundungen dar und begründen noch keinen Vertrag.
            </p>
            <p>
              (2) Ein Vertrag kommt erst durch unser ausdrückliches Angebot und dessen Annahme durch
              den Kunden oder durch eine schriftliche Auftragsbestätigung zustande. Maßgeblich ist der
              individuelle Vertragstext einschließlich etwaiger Anlagen.
            </p>
            <p>
              (3) Angaben auf der Website zu Fristen (z. B. Rückmeldung innerhalb von 24 Stunden oder
              Einsatzbereitschaft) sind unverbindliche Zielwerte, sofern sie nicht ausdrücklich als
              verbindliche Leistungsfrist vereinbart wurden.
            </p>
          </div>

          <div className="legal-block">
            <h2>§ 4 Mitwirkungspflichten des Kunden</h2>
            <p>
              (1) Der Kunde stellt rechtzeitig alle für die Vermittlung erforderlichen Informationen
              zur Verfügung, insbesondere zu Position, Qualifikation, Einsatzort, Zeitraum, Arbeitszeit
              und Vergütungsrahmen.
            </p>
            <p>
              (2) Der Kunde stellt sicher, dass die übermittelten Daten richtig und vollständig sind und
              dass er zur Weitergabe berechtigter personenbezogener Daten befugt ist.
            </p>
            <p>
              (3) Verzögerungen oder Mehrkosten, die durch unvollständige oder verspätete Mitwirkung
              entstehen, gehen nicht zu unseren Lasten.
            </p>
          </div>

          <div className="legal-block">
            <h2>§ 5 Vergütung und Zahlung</h2>
            <p>
              (1) Art und Höhe der Vergütung ergeben sich aus dem individuellen Vertrag bzw. dem
              schriftlichen Angebot. Soweit nichts anderes vereinbart ist, verstehen sich Preise in Euro
              zuzüglich der gesetzlichen Umsatzsteuer.
            </p>
            <p>
              (2) Rechnungen sind innerhalb von 14 Tagen nach Rechnungsdatum ohne Abzug zahlbar, sofern
              nichts anderes vereinbart ist.
            </p>
            <p>
              (3) Bei Zahlungsverzug sind wir berechtigt, Verzugszinsen in gesetzlicher Höhe sowie den
              Ersatz weiterer Verzugsschäden zu verlangen.
            </p>
          </div>

          <div className="legal-block">
            <h2>§ 6 Kandidatinnen und Kandidaten / Bewerbungen</h2>
            <p>
              (1) Personen, die sich über die Website oder anderweitig bewerben, stellen uns ihre
              Angaben zur Prüfung einer möglichen Vermittlung zur Verfügung. Ein Anspruch auf
              Vermittlung, Interview oder Einstellung besteht nicht.
            </p>
            <p>
              (2) Die Verarbeitung personenbezogener Daten erfolgt nach Maßgabe unserer{" "}
              <Link href="/datenschutz" className="legal-link">
                Datenschutzerklärung
              </Link>
              .
            </p>
          </div>

          <div className="legal-block">
            <h2>§ 7 Vertraulichkeit</h2>
            <p>
              (1) Die Vertragsparteien verpflichten sich, vertrauliche Informationen der jeweils
              anderen Partei, die im Rahmen der Zusammenarbeit bekannt werden, vertraulich zu behandeln
              und nur für Vertragszwecke zu verwenden.
            </p>
            <p>
              (2) Die Pflicht zur Vertraulichkeit gilt nicht für Informationen, die öffentlich bekannt
              sind, rechtmäßig von Dritten erlangt wurden oder aufgrund gesetzlicher oder behördlicher
              Verpflichtung offengelegt werden müssen.
            </p>
          </div>

          <div className="legal-block">
            <h2>§ 8 Haftung</h2>
            <p>
              (1) Wir haften unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie für Schäden aus
              der Verletzung des Lebens, des Körpers oder der Gesundheit.
            </p>
            <p>
              (2) Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten (Kardinalpflichten)
              ist die Haftung auf den vertragstypischen, vorhersehbaren Schaden begrenzt.
            </p>
            <p>
              (3) Im Übrigen ist die Haftung bei leichter Fahrlässigkeit ausgeschlossen. Die Haftung
              nach dem Produkthaftungsgesetz bleibt unberührt.
            </p>
            <p>
              (4) Soweit gesetzlich zulässig, haften wir nicht für indirekte Schäden, entgangenen
              Gewinn oder Folgeschäden, sofern kein Fall des Absatzes 1 vorliegt.
            </p>
          </div>

          <div className="legal-block">
            <h2>§ 9 Laufzeit und Kündigung</h2>
            <p>
              (1) Laufzeit und Kündigungsfristen richten sich nach dem individuellen Vertrag.
            </p>
            <p>
              (2) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.
            </p>
          </div>

          <div className="legal-block">
            <h2>§ 10 Schlussbestimmungen</h2>
            <p>
              (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts
              (CISG).
            </p>
            <p>
              (2) Erfüllungsort und ausschließlicher Gerichtsstand für Streitigkeiten aus oder im
              Zusammenhang mit dem Vertragsverhältnis ist Berlin, sofern der Kunde Kaufmann, juristische
              Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen ist.
            </p>
            <p>
              (3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die
              Wirksamkeit der übrigen Bestimmungen unberührt. Anstelle der unwirksamen Bestimmung gilt
              die gesetzlich zulässige Regelung, die dem wirtschaftlichen Zweck am nächsten kommt.
            </p>
            <p>
              (4) Änderungen und Ergänzungen bedürfen der Schriftform, soweit nicht gesetzlich eine
              strengere Form vorgeschrieben ist. Dies gilt auch für die Aufhebung dieses
              Schriftformerfordernisses.
            </p>
          </div>

          <div className="legal-block">
            <h2>Kontakt</h2>
            <p>
              Raleko UG (haftungsbeschränkt)
              <br />
              Am Stichkanal 2 bis 4, 14167 Berlin
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
              Siehe auch{" "}
              <Link href="/impressum" className="legal-link">
                Impressum
              </Link>{" "}
              und{" "}
              <Link href="/datenschutz" className="legal-link">
                Datenschutz
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
