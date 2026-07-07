"use client";

import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { getSiteLang, setSiteLang } from "@/lib/site-language";
import { HOME_TR } from "@/lib/translations/home";

type TabId = "client" | "partner";

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`reveal ${className}`.trim()}>{children}</div>;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("client");

  useEffect(() => {
    let currentLang = getSiteLang();

    function t(key: string): string {
      return HOME_TR[currentLang][key] ?? HOME_TR.de[key] ?? key;
    }

    function applyTranslations() {
      document.documentElement.lang = currentLang;

      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (key) el.textContent = t(key);
      });

      document.querySelectorAll("[data-i18n-html]").forEach((el) => {
        const key = el.getAttribute("data-i18n-html");
        if (key) el.innerHTML = t(key);
      });

      document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (key && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
          el.placeholder = t(key);
        }
      });

      document.querySelectorAll(".lang-switch button").forEach((btn) => {
        const lang = btn.getAttribute("data-lang");
        btn.classList.toggle("active", lang === currentLang);
      });
    }

    const langButtons = document.querySelectorAll(".lang-switch button");
    const langHandlers: Array<{ btn: Element; handler: () => void }> = [];
    langButtons.forEach((btn) => {
      const handler = () => {
        const lang = btn.getAttribute("data-lang");
        if (lang !== "de" && lang !== "en") return;
        currentLang = lang;
        setSiteLang(lang);
        applyTranslations();
      };
      btn.addEventListener("click", handler);
      langHandlers.push({ btn, handler });
    });

    applyTranslations();

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

    return () => {
      observer.disconnect();
      langHandlers.forEach(({ btn, handler }) => btn.removeEventListener("click", handler));
    };
  }, []);

  return (
    <>
      <SiteHeader variant="home" />

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
            <span className="mono" data-i18n="statusLine">
              Status: Einsatzbereit in 48 Stunden
            </span>
          </div>
          <h1 data-i18n-html="heroTitle">
            Personal, das <span>pünktlich</span> liefert — geprüft, legal, einsatzbereit.
          </h1>
          <p className="lead" data-i18n="heroLead">
            staffontime vermittelt qualifizierte Arbeitskräfte an Unternehmen in Logistik, Hotellerie
            und Gebäudereinigung — mit transparentem Prozess und klaren Fristen, keine Überraschungen.
          </p>
          <div className="hero-ctas">
            <a href="#contact" className="btn btn-primary" data-i18n="heroCtaRequest">
              Personal anfragen →
            </a>
            <a href="#contact" className="btn btn-ghost" data-i18n="heroCtaPartnership">
              Partnerschaft besprechen
            </a>
          </div>
          <div className="timeline">
            <div className="track" />
            <div className="marker" />
          </div>
          <div className="timeline-labels">
            <span data-i18n="tlRequest">ANFRAGE</span>
            <span data-i18n="tlReview">PRÜFUNG</span>
            <span data-i18n="tlContract">VERTRAG</span>
            <span data-i18n="tlDeploy">EINSATZ</span>
          </div>
        </div>
      </section>

      <div className="trust-bar">
        <div className="wrap trust-inner">
          <div className="license-note" data-i18n="licenseNote">
            Antrag auf Arbeitnehmerüberlassungserlaubnis gem. §1 AÜG gestellt
          </div>
          <div className="trust-item">
            <strong>2026</strong>&nbsp;<span data-i18n="trustFounded">Gegründet</span>
          </div>
          <div className="trust-item">
            <strong>DSGVO</strong>&nbsp;<span data-i18n="trustGdpr">konform</span>
          </div>
          <div className="trust-item">
            <strong>3</strong>&nbsp;<span data-i18n="trustIndustries">Kernbranchen</span>
          </div>
          <div className="trust-item">
            <strong>iGZ/BAP</strong>&nbsp;<span data-i18n="trustIgz">Beitritt in Prüfung</span>
          </div>
        </div>
      </div>

      <section className="industries industries-early" id="industries">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="mono" data-i18n="industriesKicker">
              Kernbranchen
            </span>
            <h2 data-i18n="industriesTitle">Wo wir Personal vermitteln</h2>
          </Reveal>
          <div className="industry-grid">
            <Reveal className="industry-card">
              <div className="industry-img">
                <video autoPlay muted loop playsInline>
                  <source src="/assets/industry-logistik.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="industry-body">
                <h4 data-i18n="indLogisticsTitle">Logistik & Zustellung</h4>
                <p data-i18n="indLogisticsDesc">
                  Lagerfachkräfte, Staplerfahrer:innen, Kommissionierung, Zusteller:innen.
                </p>
              </div>
            </Reveal>
            <Reveal className="industry-card">
              <div className="industry-img">
                <video autoPlay muted loop playsInline>
                  <source src="/assets/industry-hotellerie.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="industry-body">
                <h4 data-i18n="indHotelTitle">Hotellerie & Gastronomie</h4>
                <p data-i18n="indHotelDesc">Housekeeping, Service, Küchenhilfe, Rezeption.</p>
              </div>
            </Reveal>
            <Reveal className="industry-card">
              <div className="industry-img">
                <video autoPlay muted loop playsInline>
                  <source src="/assets/industry-reinigung.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="industry-body">
                <h4 data-i18n="indCleaningTitle">Gebäudereinigung</h4>
                <p data-i18n="indCleaningDesc">
                  Unterhaltsreinigung, Glasreinigung, Objektbetreuung.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="paths" id="paths">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="mono" data-i18n="pathsKicker">
              Zwei Wege, ein Prozess
            </span>
            <h2 data-i18n="pathsTitle">Für wen wir da sind</h2>
            <p data-i18n="pathsLead">
              Ob Sie kurzfristig Personal brauchen oder selbst eine neue Stelle suchen — der Weg beginnt
              getrennt, damit jede Seite genau das bekommt, was sie braucht.
            </p>
          </Reveal>
          <div className="path-grid">
            <Reveal className="path-card">
              <span className="num" data-i18n="path1Num">
                01 / UNTERNEHMEN
              </span>
              <h3 data-i18n="path1Title">Ich suche Personal</h3>
              <p data-i18n="path1Desc">
                Beschreiben Sie Bedarf, Branche und Zeitrahmen. Sie erhalten innerhalb von 24 Stunden
                geprüfte Kandidatenvorschläge.
              </p>
              <a href="#contact" className="btn btn-primary" data-i18n="path1Cta">
                Anfrage stellen
              </a>
            </Reveal>
            <Reveal className="path-card">
              <span className="num" data-i18n="path2Num">
                02 / KANDIDAT:INNEN
              </span>
              <h3 data-i18n="path2Title">Ich suche eine Stelle</h3>
              <p data-i18n="path2Desc">
                Registrieren Sie sich mit Ihren Qualifikationen. Wir vermitteln Sie an geprüfte
                Partnerunternehmen — fair und transparent.
              </p>
              <a href="/bewerbung" className="btn btn-ghost" data-i18n="path2Cta">
                Jetzt bewerben
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="process" id="process">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="mono" data-i18n="processKicker">
              Der Ablauf
            </span>
            <h2 data-i18n="processTitle">Von der Anfrage bis zum ersten Arbeitstag</h2>
            <p data-i18n="processLead">
              Kein schwarzer Kasten — jeder Schritt hat eine feste Zeitspanne, die wir einhalten.
            </p>
          </Reveal>
          <div className="schedule">
            <Reveal className="slot">
              <div className="time" data-i18n="day1Label">
                TAG 1
              </div>
              <h4 data-i18n="day1Title">Anfrage & Bedarfsklärung</h4>
              <p data-i18n="day1Desc">Kurzes Gespräch zu Rolle, Branche, Einsatzort und Zeitraum.</p>
            </Reveal>
            <Reveal className="slot">
              <div className="time" data-i18n="day23Label">
                TAG 2–3
              </div>
              <h4 data-i18n="day23Title">Prüfung & Auswahl</h4>
              <p data-i18n="day23Desc">Abgleich von Qualifikationen, Referenzen und Verfügbarkeit.</p>
            </Reveal>
            <Reveal className="slot">
              <div className="time" data-i18n="day4Label">
                TAG 4
              </div>
              <h4 data-i18n="day4Title">Vertrag & Freigabe</h4>
              <p data-i18n="day4Desc">Klare Konditionen, Unterschrift, Einsatzplanung.</p>
            </Reveal>
            <Reveal className="slot">
              <div className="time" data-i18n="day5Label">
                TAG 5
              </div>
              <h4 data-i18n="day5Title">Einsatzbeginn</h4>
              <p data-i18n="day5Desc">Personal ist vor Ort — mit laufender Betreuung durch uns.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="values">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="mono" data-i18n="valuesKicker">
              Warum staffontime
            </span>
            <h2 data-i18n="valuesTitle">Worauf wir uns nicht einlassen</h2>
          </Reveal>
          <div className="value-grid">
            <Reveal className="value-item">
              <span className="mono" data-i18n="val1Kicker">
                Fristen
              </span>
              <h4 data-i18n="val1Title">Feste Zeitrahmen</h4>
              <p data-i18n="val1Desc">
                Jeder Prozessschritt hat eine definierte Dauer — keine offenen Zeitfenster.
              </p>
            </Reveal>
            <Reveal className="value-item">
              <span className="mono" data-i18n="val2Kicker">
                Prüfung
              </span>
              <h4 data-i18n="val2Title">Geprüfte Kandidat:innen</h4>
              <p data-i18n="val2Desc">
                Qualifikation und Dokumente werden vor jeder Vermittlung verifiziert.
              </p>
            </Reveal>
            <Reveal className="value-item">
              <span className="mono" data-i18n="val3Kicker">
                Recht
              </span>
              <h4 data-i18n="val3Title">Rechtssicher</h4>
              <p data-i18n="val3Desc">
                Prozesse ausgerichtet an AÜG, DSGVO und geltendem Tarifrecht.
              </p>
            </Reveal>
            <Reveal className="value-item">
              <span className="mono" data-i18n="val4Kicker">
                Kontakt
              </span>
              <h4 data-i18n="val4Title">Ein Ansprechpartner</h4>
              <p data-i18n="val4Desc">Feste Betreuung statt wechselnder Sachbearbeiter:innen.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="wrap contact-grid">
          <Reveal>
            <div className="section-head contact-head">
              <span className="mono" data-i18n="contactKicker">
                Kontakt
              </span>
              <h2 data-i18n="contactTitle">Sprechen wir über Ihren Bedarf</h2>
            </div>
            <div className="tabs tabs-spaced">
              <button
                type="button"
                className={`tab${activeTab === "client" ? " active" : ""}`}
                onClick={() => setActiveTab("client")}
                data-i18n="tabRequest"
              >
                Personal anfragen
              </button>
              <button
                type="button"
                className={`tab${activeTab === "partner" ? " active" : ""}`}
                onClick={() => setActiveTab("partner")}
                data-i18n="tabPartner"
              >
                Partner werden
              </button>
            </div>

            <form className={`form-panel${activeTab === "client" ? " active" : ""}`}>
              <div className="field">
                <label data-i18n="labelCompany">Unternehmen</label>
                <input type="text" data-i18n-placeholder="phCompany" placeholder="Firmenname" />
              </div>
              <div className="field">
                <label data-i18n="labelContact">Ansprechpartner:in</label>
                <input
                  type="text"
                  data-i18n-placeholder="phContact"
                  placeholder="Vor- und Nachname"
                />
              </div>
              <div className="field">
                <label data-i18n="labelEmail">E-Mail</label>
                <input type="email" data-i18n-placeholder="phEmail" placeholder="name@firma.de" />
              </div>
              <div className="field">
                <label data-i18n="labelIndustry">Branche</label>
                <select defaultValue="logistik">
                  <option value="logistik" data-i18n="optLogistics">
                    Logistik / Zustellung
                  </option>
                  <option value="hotellerie" data-i18n="optHotel">
                    Hotellerie / Gastronomie
                  </option>
                  <option value="reinigung" data-i18n="optCleaning">
                    Gebäudereinigung
                  </option>
                  <option value="andere" data-i18n="optOther">
                    Andere
                  </option>
                </select>
              </div>
              <div className="field">
                <label data-i18n="labelNeedDesc">Kurzbeschreibung des Bedarfs</label>
                <textarea
                  data-i18n-placeholder="phNeedDesc"
                  placeholder="Anzahl Kräfte, Zeitraum, Einsatzort..."
                />
              </div>
              <button type="button" className="btn btn-primary" data-i18n="btnSendRequest">
                Anfrage senden
              </button>
              <p className="form-note" data-i18n="formNoteClient">
                Wir melden uns innerhalb von 24 Stunden. Ihre Daten werden gemäß DSGVO verarbeitet.
              </p>
            </form>

            <form className={`form-panel${activeTab === "partner" ? " active" : ""}`}>
              <div className="field">
                <label data-i18n="labelCompany">Unternehmen</label>
                <input type="text" data-i18n-placeholder="phCompany" placeholder="Firmenname" />
              </div>
              <div className="field">
                <label data-i18n="labelContact">Ansprechpartner:in</label>
                <input
                  type="text"
                  data-i18n-placeholder="phContact"
                  placeholder="Vor- und Nachname"
                />
              </div>
              <div className="field">
                <label data-i18n="labelEmail">E-Mail</label>
                <input type="email" data-i18n-placeholder="phEmail" placeholder="name@firma.de" />
              </div>
              <div className="field">
                <label data-i18n="labelPartnershipType">Art der Partnerschaft</label>
                <select defaultValue="dauerhaft">
                  <option value="dauerhaft" data-i18n="optPartnershipOngoing">
                    Dauerhafte Personalpartnerschaft
                  </option>
                  <option value="projekt" data-i18n="optPartnershipProject">
                    Projektbezogene Zusammenarbeit
                  </option>
                  <option value="sonstiges" data-i18n="optPartnershipOther">
                    Sonstiges
                  </option>
                </select>
              </div>
              <div className="field">
                <label data-i18n="labelMessage">Nachricht</label>
                <textarea
                  data-i18n-placeholder="phMessage"
                  placeholder="Umfang, Zeitrahmen, Erwartungen..."
                />
              </div>
              <button type="button" className="btn btn-primary" data-i18n="btnSendPartnership">
                Partnerschaft anfragen
              </button>
              <p className="form-note" data-i18n="formNotePartner">
                Wir prüfen jede Partnerschaftsanfrage persönlich und melden uns zeitnah.
              </p>
            </form>
          </Reveal>

          <div className="contact-info reveal">
            <div className="info-row">
              <span className="mono" data-i18n="infoLocation">
                Standort
              </span>
              <div>
                <strong>Am Stichkanal 2–4</strong>
                <br />
                <span data-i18n="infoAddressLine2">14167 Berlin, Deutschland</span>
              </div>
            </div>
            <div className="info-row">
              <span className="mono" data-i18n="infoEmail">
                E-Mail
              </span>
              <div>
                <strong>
                  <a href="mailto:kontakt@staffontime.de">kontakt@staffontime.de</a>
                </strong>
              </div>
            </div>
            <div className="info-row">
              <span className="mono" data-i18n="infoPhone">
                Telefon
              </span>
              <div>
                <strong>
                  <a href="tel:+4917680892313">+49 17680892313</a>
                </strong>
              </div>
            </div>
            <div className="info-row">
              <span className="mono" data-i18n="infoHours">
                Erreichbarkeit
              </span>
              <div>
                <strong data-i18n="infoHoursDetail">Mo–Fr, 08:00–18:00 Uhr</strong>
                <br />
                <span data-i18n="infoResponse">Antwort innerhalb von 24 Stunden</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="wrap">
          <div className="foot-legal-note" data-i18n="footLegalNote">
            Prototyp — Lizenzantrag nach §1 AÜG eingereicht, Erteilung ausstehend.
          </div>
          <div className="foot-grid">
            <div className="foot-col">
              <div className="logo logo-foot">
                staffontime<span className="dot">.</span>
              </div>
              <p className="foot-tagline" data-i18n="footTagline">
                Personalvermittlung mit festen Fristen und geprüften Prozessen — für Unternehmen, die
                sich auf Termine verlassen müssen.
              </p>
            </div>
            <div className="foot-col">
              <h5 data-i18n="footColCompany">Unternehmen</h5>
              <a href="#paths" data-i18n="footForCompanies">
                Für Unternehmen
              </a>
              <a href="#process" data-i18n="footProcess">
                Ablauf
              </a>
              <a href="#industries" data-i18n="footIndustries">
                Branchen
              </a>
            </div>
            <div className="foot-col">
              <h5 data-i18n="footColLegal">Rechtliches</h5>
              <a href="/impressum" data-i18n="footImpressum">
                Impressum
              </a>
              <a href="#" data-i18n="footPrivacy">
                Datenschutz
              </a>
              <a href="#" data-i18n="footTerms">
                AGB
              </a>
            </div>
            <div className="foot-col">
              <h5 data-i18n="footColContact">Kontakt</h5>
              <a href="#contact" data-i18n="footRequestStaff">
                Personal anfragen
              </a>
              <a href="#contact" data-i18n="footPartner">
                Partner werden
              </a>
            </div>
          </div>
          <div className="foot-bottom">
            <p data-i18n="footCopyright">© 2026 staffontime. Alle Rechte vorbehalten.</p>
            <p data-i18n="footPrototype">Prototyp-Version — nicht produktiv</p>
          </div>
        </div>
      </footer>
    </>
  );
}
