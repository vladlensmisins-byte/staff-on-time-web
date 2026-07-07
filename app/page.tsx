"use client";

import { useEffect, useState } from "react";

type TabId = "client" | "partner";

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`reveal ${className}`.trim()}>{children}</div>;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("client");

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header className="site-header">
        <nav className="wrap">
          <div className="logo">
            staffontime<span className="dot">.</span>
          </div>
          <div className="nav-links">
            <a href="#paths">Für Unternehmen</a>
            <a href="#process">Ablauf</a>
            <a href="#industries">Branchen</a>
            <a href="#contact">Kontakt</a>
          </div>
          <div className="nav-cta">
            <a href="#contact" className="btn btn-ghost">
              Partner werden
            </a>
            <a href="#contact" className="btn btn-primary">
              Personal anfragen
            </a>
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-media">
          <video autoPlay muted loop playsInline poster="/assets/hero-poster.jpg">
            <source src="/assets/hero-warehouse.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="hero-overlay" />

        <div className="wrap hero-content">
          <div className="status-line">
            <span className="pulse" />
            <span className="mono">Status: Einsatzbereit in 48 Stunden</span>
          </div>
          <h1>
            Personal, das <span>pünktlich</span> liefert — geprüft, legal, einsatzbereit.
          </h1>
          <p className="lead">
            staffontime vermittelt qualifizierte Arbeitskräfte an Unternehmen in Logistik, Hotellerie
            und Gebäudereinigung — mit transparentem Prozess und klaren Fristen, keine Überraschungen.
          </p>
          <div className="hero-ctas">
            <a href="#contact" className="btn btn-primary">
              Personal anfragen →
            </a>
            <a href="#contact" className="btn btn-ghost">
              Partnerschaft besprechen
            </a>
          </div>
          <div className="timeline">
            <div className="track" />
            <div className="marker" />
          </div>
          <div className="timeline-labels">
            <span>ANFRAGE</span>
            <span>PRÜFUNG</span>
            <span>VERTRAG</span>
            <span>EINSATZ</span>
          </div>
        </div>
      </section>

      <div className="trust-bar">
        <div className="wrap trust-inner">
          <div className="license-note">
            Antrag auf Arbeitnehmerüberlassungserlaubnis gem. §1 AÜG gestellt
          </div>
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
      </div>

      <section className="paths" id="paths">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="mono">Zwei Wege, ein Prozess</span>
            <h2>Für wen wir da sind</h2>
            <p>
              Ob Sie kurzfristig Personal brauchen oder selbst eine neue Stelle suchen — der Weg beginnt
              getrennt, damit jede Seite genau das bekommt, was sie braucht.
            </p>
          </Reveal>
          <div className="path-grid">
            <Reveal className="path-card">
              <span className="num">01 / UNTERNEHMEN</span>
              <h3>Ich suche Personal</h3>
              <p>
                Beschreiben Sie Bedarf, Branche und Zeitrahmen. Sie erhalten innerhalb von 24 Stunden
                geprüfte Kandidatenvorschläge.
              </p>
              <a href="#contact" className="btn btn-primary">
                Anfrage stellen
              </a>
            </Reveal>
            <Reveal className="path-card">
              <span className="num">02 / KANDIDAT:INNEN</span>
              <h3>Ich suche eine Stelle</h3>
              <p>
                Registrieren Sie sich mit Ihren Qualifikationen. Wir vermitteln Sie an geprüfte
                Partnerunternehmen — fair und transparent.
              </p>
              <a href="#contact" className="btn btn-ghost">
                Jetzt bewerben
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="process" id="process">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="mono">Der Ablauf</span>
            <h2>Von der Anfrage bis zum ersten Arbeitstag</h2>
            <p>Kein schwarzer Kasten — jeder Schritt hat eine feste Zeitspanne, die wir einhalten.</p>
          </Reveal>
          <div className="schedule">
            <Reveal className="slot">
              <div className="time">TAG 1</div>
              <h4>Anfrage & Bedarfsklärung</h4>
              <p>Kurzes Gespräch zu Rolle, Branche, Einsatzort und Zeitraum.</p>
            </Reveal>
            <Reveal className="slot">
              <div className="time">TAG 2–3</div>
              <h4>Prüfung & Auswahl</h4>
              <p>Abgleich von Qualifikationen, Referenzen und Verfügbarkeit.</p>
            </Reveal>
            <Reveal className="slot">
              <div className="time">TAG 4</div>
              <h4>Vertrag & Freigabe</h4>
              <p>Klare Konditionen, Unterschrift, Einsatzplanung.</p>
            </Reveal>
            <Reveal className="slot">
              <div className="time">TAG 5</div>
              <h4>Einsatzbeginn</h4>
              <p>Personal ist vor Ort — mit laufender Betreuung durch uns.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="industries" id="industries">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="mono">Kernbranchen</span>
            <h2>Wo wir Personal vermitteln</h2>
          </Reveal>
          <div className="industry-grid">
            <Reveal className="industry-card">
              <div className="industry-img">
                <video autoPlay muted loop playsInline>
                  <source src="/assets/industry-logistik.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="industry-body">
                <h4>Logistik & Zustellung</h4>
                <p>Lagerfachkräfte, Staplerfahrer:innen, Kommissionierung, Zusteller:innen.</p>
              </div>
            </Reveal>
            <Reveal className="industry-card">
              <div className="industry-img">
                <video autoPlay muted loop playsInline>
                  <source src="/assets/industry-hotellerie.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="industry-body">
                <h4>Hotellerie & Gastronomie</h4>
                <p>Housekeeping, Service, Küchenhilfe, Rezeption.</p>
              </div>
            </Reveal>
            <Reveal className="industry-card">
              <div className="industry-img">
                <video autoPlay muted loop playsInline>
                  <source src="/assets/industry-reinigung.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="industry-body">
                <h4>Gebäudereinigung</h4>
                <p>Unterhaltsreinigung, Glasreinigung, Objektbetreuung.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="values">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="mono">Warum staffontime</span>
            <h2>Worauf wir uns nicht einlassen</h2>
          </Reveal>
          <div className="value-grid">
            <Reveal className="value-item">
              <span className="mono">Fristen</span>
              <h4>Feste Zeitrahmen</h4>
              <p>Jeder Prozessschritt hat eine definierte Dauer — keine offenen Zeitfenster.</p>
            </Reveal>
            <Reveal className="value-item">
              <span className="mono">Prüfung</span>
              <h4>Geprüfte Kandidat:innen</h4>
              <p>Qualifikation und Dokumente werden vor jeder Vermittlung verifiziert.</p>
            </Reveal>
            <Reveal className="value-item">
              <span className="mono">Recht</span>
              <h4>Rechtssicher</h4>
              <p>Prozesse ausgerichtet an AÜG, DSGVO und geltendem Tarifrecht.</p>
            </Reveal>
            <Reveal className="value-item">
              <span className="mono">Kontakt</span>
              <h4>Ein Ansprechpartner</h4>
              <p>Feste Betreuung statt wechselnder Sachbearbeiter:innen.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="wrap contact-grid">
          <Reveal>
            <div className="section-head contact-head">
              <span className="mono">Kontakt</span>
              <h2>Sprechen wir über Ihren Bedarf</h2>
            </div>
            <div className="tabs tabs-spaced">
              <button
                type="button"
                className={`tab${activeTab === "client" ? " active" : ""}`}
                onClick={() => setActiveTab("client")}
              >
                Personal anfragen
              </button>
              <button
                type="button"
                className={`tab${activeTab === "partner" ? " active" : ""}`}
                onClick={() => setActiveTab("partner")}
              >
                Partner werden
              </button>
            </div>

            <form className={`form-panel${activeTab === "client" ? " active" : ""}`}>
              <div className="field">
                <label>Unternehmen</label>
                <input type="text" placeholder="Firmenname" />
              </div>
              <div className="field">
                <label>Ansprechpartner:in</label>
                <input type="text" placeholder="Vor- und Nachname" />
              </div>
              <div className="field">
                <label>E-Mail</label>
                <input type="email" placeholder="name@firma.de" />
              </div>
              <div className="field">
                <label>Branche</label>
                <select defaultValue="logistik">
                  <option value="logistik">Logistik / Zustellung</option>
                  <option value="hotellerie">Hotellerie / Gastronomie</option>
                  <option value="reinigung">Gebäudereinigung</option>
                  <option value="andere">Andere</option>
                </select>
              </div>
              <div className="field">
                <label>Kurzbeschreibung des Bedarfs</label>
                <textarea placeholder="Anzahl Kräfte, Zeitraum, Einsatzort..." />
              </div>
              <button type="button" className="btn btn-primary">
                Anfrage senden
              </button>
              <p className="form-note">
                Wir melden uns innerhalb von 24 Stunden. Ihre Daten werden gemäß DSGVO verarbeitet.
              </p>
            </form>

            <form className={`form-panel${activeTab === "partner" ? " active" : ""}`}>
              <div className="field">
                <label>Unternehmen</label>
                <input type="text" placeholder="Firmenname" />
              </div>
              <div className="field">
                <label>Ansprechpartner:in</label>
                <input type="text" placeholder="Vor- und Nachname" />
              </div>
              <div className="field">
                <label>E-Mail</label>
                <input type="email" placeholder="name@firma.de" />
              </div>
              <div className="field">
                <label>Art der Partnerschaft</label>
                <select defaultValue="dauerhaft">
                  <option value="dauerhaft">Dauerhafte Personalpartnerschaft</option>
                  <option value="projekt">Projektbezogene Zusammenarbeit</option>
                  <option value="sonstiges">Sonstiges</option>
                </select>
              </div>
              <div className="field">
                <label>Nachricht</label>
                <textarea placeholder="Umfang, Zeitrahmen, Erwartungen..." />
              </div>
              <button type="button" className="btn btn-primary">
                Partnerschaft anfragen
              </button>
              <p className="form-note">
                Wir prüfen jede Partnerschaftsanfrage persönlich und melden uns zeitnah.
              </p>
            </form>
          </Reveal>

          <div className="contact-info reveal">
            <div className="info-row">
              <span className="mono">Standort</span>
              <div>
                <strong>Sitz in Deutschland</strong>
                Adresse folgt nach Abschluss der Lizenzierung
              </div>
            </div>
            <div className="info-row">
              <span className="mono">E-Mail</span>
              <div>
                <strong>kontakt@staffontime.de</strong>
                Platzhalter — bitte durch echte Adresse ersetzen
              </div>
            </div>
            <div className="info-row">
              <span className="mono">Telefon</span>
              <div>
                <strong>+49 XXX XXXXXXX</strong>
                Platzhalter — bitte durch echte Nummer ersetzen
              </div>
            </div>
            <div className="info-row">
              <span className="mono">Erreichbarkeit</span>
              <div>
                <strong>Mo–Fr, 08:00–18:00 Uhr</strong>
                Antwort innerhalb von 24 Stunden
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="wrap">
          <div className="foot-legal-note">
            Prototyp — Lizenzantrag nach §1 AÜG eingereicht, Erteilung ausstehend. Alle Kontaktdaten
            sind Platzhalter.
          </div>
          <div className="foot-grid">
            <div className="foot-col">
              <div className="logo logo-foot">
                staffontime<span className="dot">.</span>
              </div>
              <p className="foot-tagline">
                Personalvermittlung mit festen Fristen und geprüften Prozessen — für Unternehmen, die
                sich auf Termine verlassen müssen.
              </p>
            </div>
            <div className="foot-col">
              <h5>Unternehmen</h5>
              <a href="#paths">Für Unternehmen</a>
              <a href="#process">Ablauf</a>
              <a href="#industries">Branchen</a>
            </div>
            <div className="foot-col">
              <h5>Rechtliches</h5>
              <a href="#">Impressum</a>
              <a href="#">Datenschutz</a>
              <a href="#">AGB</a>
            </div>
            <div className="foot-col">
              <h5>Kontakt</h5>
              <a href="#contact">Personal anfragen</a>
              <a href="#contact">Partner werden</a>
            </div>
          </div>
          <div className="foot-bottom">
            <p>© 2026 staffontime. Alle Rechte vorbehalten.</p>
            <p>Prototyp-Version — nicht produktiv</p>
          </div>
        </div>
      </footer>
    </>
  );
}
