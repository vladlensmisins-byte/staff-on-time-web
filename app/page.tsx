"use client";

import { useEffect, useRef, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteLogo from "@/components/SiteLogo";
import HeroVideo from "@/components/HeroVideo";
import { getSiteLang, setSiteLang } from "@/lib/site-language";
import { HOME_TR } from "@/lib/translations/home";

type TabId = "client" | "partner";
type FormStatus = "idle" | "sending" | "success" | "error";

type StaffFormState = {
  company: string;
  contact: string;
  email: string;
  industry: string;
  needDesc: string;
};

type PartnerFormState = {
  company: string;
  contact: string;
  email: string;
  partnershipType: string;
  message: string;
};

const EMPTY_STAFF_FORM: StaffFormState = {
  company: "",
  contact: "",
  email: "",
  industry: "logistik",
  needDesc: "",
};

const EMPTY_PARTNER_FORM: PartnerFormState = {
  company: "",
  contact: "",
  email: "",
  partnershipType: "dauerhaft",
  message: "",
};

function translate(key: string): string {
  const lang = getSiteLang();
  return HOME_TR[lang][key] ?? HOME_TR.de[key] ?? key;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`reveal ${className}`.trim()}>{children}</div>;
}

function FormSuccessCard({
  innerRef,
  kickerKey,
  titleKey,
  bodyKey,
}: {
  innerRef?: React.RefObject<HTMLDivElement | null>;
  kickerKey: string;
  titleKey: string;
  bodyKey: string;
}) {
  return (
    <div className="form-success-card" ref={innerRef} role="status" aria-live="polite" tabIndex={-1}>
      <div className="form-success-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22">
          <path
            fill="currentColor"
            d="M9.55 16.2 5.8 12.45l1.4-1.42 2.35 2.35 7.25-7.25 1.4 1.42-8.65 8.65Z"
          />
        </svg>
      </div>
      <span className="mono form-success-kicker" data-i18n={kickerKey}>
        {translate(kickerKey)}
      </span>
      <h3 className="form-success-title" data-i18n={titleKey}>
        {translate(titleKey)}
      </h3>
      <p className="form-success-body" data-i18n={bodyKey}>
        {translate(bodyKey)}
      </p>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("client");
  const [staffForm, setStaffForm] = useState<StaffFormState>(EMPTY_STAFF_FORM);
  const [partnerForm, setPartnerForm] = useState<PartnerFormState>(EMPTY_PARTNER_FORM);
  const [staffStatus, setStaffStatus] = useState<FormStatus>("idle");
  const [partnerStatus, setPartnerStatus] = useState<FormStatus>("idle");
  const [staffError, setStaffError] = useState("");
  const [partnerError, setPartnerError] = useState("");
  const staffSuccessRef = useRef<HTMLDivElement>(null);
  const partnerSuccessRef = useRef<HTMLDivElement>(null);

  function scrollToFormSuccess(ref: React.RefObject<HTMLDivElement | null>) {
    window.requestAnimationFrame(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      ref.current?.focus({ preventScroll: true });
    });
  }

  async function submitStaffForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStaffError("");

    if (!staffForm.company.trim() || !staffForm.contact.trim() || !staffForm.needDesc.trim()) {
      setStaffStatus("error");
      setStaffError(translate("formErrorRequired"));
      return;
    }
    if (!isValidEmail(staffForm.email.trim())) {
      setStaffStatus("error");
      setStaffError(translate("formErrorEmail"));
      return;
    }

    setStaffStatus("sending");
    try {
      const res = await fetch("/api/contact-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "staff",
          language: getSiteLang(),
          company: staffForm.company.trim(),
          contact: staffForm.contact.trim(),
          email: staffForm.email.trim(),
          industry: staffForm.industry,
          needDesc: staffForm.needDesc.trim(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Request failed");

      setStaffForm(EMPTY_STAFF_FORM);
      setStaffStatus("success");
    } catch {
      setStaffStatus("error");
      setStaffError(translate("formErrorGeneric"));
    }
  }

  async function submitPartnerForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPartnerError("");

    if (!partnerForm.company.trim() || !partnerForm.contact.trim() || !partnerForm.message.trim()) {
      setPartnerStatus("error");
      setPartnerError(translate("formErrorRequired"));
      return;
    }
    if (!isValidEmail(partnerForm.email.trim())) {
      setPartnerStatus("error");
      setPartnerError(translate("formErrorEmail"));
      return;
    }

    setPartnerStatus("sending");
    try {
      const res = await fetch("/api/contact-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "partnership",
          language: getSiteLang(),
          company: partnerForm.company.trim(),
          contact: partnerForm.contact.trim(),
          email: partnerForm.email.trim(),
          partnershipType: partnerForm.partnershipType,
          message: partnerForm.message.trim(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Request failed");

      setPartnerForm(EMPTY_PARTNER_FORM);
      setPartnerStatus("success");
    } catch {
      setPartnerStatus("error");
      setPartnerError(translate("formErrorGeneric"));
    }
  }

  useEffect(() => {
    if (staffStatus === "success") {
      scrollToFormSuccess(staffSuccessRef);
    }
  }, [staffStatus]);

  useEffect(() => {
    if (partnerStatus === "success") {
      scrollToFormSuccess(partnerSuccessRef);
    }
  }, [partnerStatus]);

  useEffect(() => {
    function syncTabFromHash() {
      const hash = window.location.hash;
      if (hash === "#contact-partner") {
        setActiveTab("partner");
      } else if (hash === "#contact" || hash === "#contact-staff") {
        setActiveTab("client");
      }
    }

    syncTabFromHash();
    window.addEventListener("hashchange", syncTabFromHash);
    return () => window.removeEventListener("hashchange", syncTabFromHash);
  }, []);

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

    const isMobile = window.matchMedia("(max-width: 860px)").matches;
    if (isMobile) {
      document.documentElement.classList.add("home-scroll-snap");
    }

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
      document.documentElement.classList.remove("home-scroll-snap");
      observer.disconnect();
      langHandlers.forEach(({ btn, handler }) => btn.removeEventListener("click", handler));
    };
  }, []);

  return (
    <>
      <SiteHeader variant="home" />

      <section className="hero home-scroll-section" id="top">
        <div className="hero-media">
          <HeroVideo />
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
            Personal, das <span>pünktlich</span> liefert: geprüft, legal, einsatzbereit.
          </h1>
          <p className="lead" data-i18n="heroLead">
            staffontime vermittelt qualifizierte Arbeitskräfte an Unternehmen in Logistik, Hotellerie,
            Reinigung & Fabrik – mit transparentem Prozess, klaren Fristen und ohne Überraschungen.
          </p>
          <div className="hero-ctas">
            <a href="#contact" className="btn btn-primary" data-i18n="heroCtaRequest">
              Personal anfragen →
            </a>
            <a href="#contact-partner" className="btn btn-ghost" data-i18n="heroCtaPartnership">
              Partnerschaft besprechen
            </a>
          </div>
          <div className="timeline" aria-hidden="true">
            <div className="track" />
            <div className="markers">
              <span className="marker is-done" />
              <span className="marker is-active" />
              <span className="marker" />
              <span className="marker" />
            </div>
          </div>
          <div className="timeline-labels">
            <span data-i18n="tlRequest">ANFRAGE</span>
            <span data-i18n="tlReview">PRÜFUNG</span>
            <span data-i18n="tlContract">VERTRAG</span>
            <span data-i18n="tlDeploy">EINSATZ</span>
          </div>
        </div>
      </section>

      <section className="industries industries-early home-scroll-section" id="industries">
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
                  Lagerfachkräfte, Staplerfahrer/innen, Kommissionierung, Zusteller/innen.
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
                <h4 data-i18n="indCleaningTitle">Reinigung & Fabrik</h4>
                <p data-i18n="indCleaningDesc">
                  Produktionshilfe, Fabrikhilfskräfte, Linienarbeit. Jede Art von Reinigung, wie z. B.
                  Glasreinigung, Gebäudereinigung usw.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="paths home-scroll-section" id="paths">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="mono" data-i18n="pathsKicker">
              Zwei Wege, ein Prozess
            </span>
            <h2 data-i18n="pathsTitle">Für wen wir da sind</h2>
            <p data-i18n="pathsLead">
              Ob Sie kurzfristig Personal brauchen oder selbst eine neue Stelle suchen: Wir sind der
              richtige Ansprechpartner!
            </p>
          </Reveal>
          <div className="path-grid">
            <Reveal className="path-card">
              <span className="num" data-i18n="path1Num">
                01 / UNTERNEHMEN
              </span>
              <h3 data-i18n="path1Title">Ich suche Personal</h3>
              <p data-i18n="path1Desc">
                Beschreiben Sie uns Ihren Bedarf, Branche und Zeitrahmen. Sie erhalten innerhalb von 24
                Stunden geprüfte Kandidatenvorschläge.
              </p>
              <a href="#contact" className="btn btn-primary" data-i18n="path1Cta">
                Anfrage stellen
              </a>
            </Reveal>
            <Reveal className="path-card">
              <span className="num" data-i18n="path2Num">
                02 / KANDIDAT/INNEN
              </span>
              <h3 data-i18n="path2Title">Ich suche eine Stelle</h3>
              <p data-i18n="path2Desc">
                Registrieren Sie sich mit Ihren Qualifikationen. Wir vermitteln Sie an geprüfte
                Partnerunternehmen, fair und transparent.
              </p>
              <a href="/bewerbung" className="btn btn-ghost" data-i18n="path2Cta">
                Jetzt bewerben
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="process home-scroll-section" id="process">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="mono" data-i18n="processKicker">
              Der Ablauf
            </span>
            <h2 data-i18n="processTitle">Von der Anfrage bis zum ersten Arbeitstag</h2>
            <p data-i18n="processLead">
              Jeder Schritt hat eine feste Zeitspanne und Struktur, die wir konsequent einhalten.
            </p>
          </Reveal>
          <div className="schedule">
            <Reveal className="slot">
              <div className="time" data-i18n="day1Label">
                TAG 1
              </div>
              <h4 data-i18n="day1Title">Anfrage & Bedarfsklärung</h4>
              <p data-i18n="day1Desc">Kurzes Gespräch zur Position, Branche, Einsatzort und Zeitraum.</p>
            </Reveal>
            <Reveal className="slot">
              <div className="time" data-i18n="day23Label">
                TAG 2 / 3
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
              <p
                data-i18n-html="day5Desc"
                dangerouslySetInnerHTML={{
                  __html:
                    'Personal ist vor Ort, mit laufender Betreuung durch uns. <span class="text-nowrap">(Wenn gewollt)</span>',
                }}
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="values home-scroll-section">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="mono" data-i18n="valuesKicker">
              Warum staffontime
            </span>
            <h2 data-i18n="valuesTitle">Worauf wir achten</h2>
          </Reveal>
          <div className="value-grid">
            <Reveal className="value-item">
              <span className="mono" data-i18n="val1Kicker">
                Fristen
              </span>
              <h4 data-i18n="val1Title">Feste Zeitrahmen</h4>
              <p data-i18n="val1Desc">
                Jeder Prozessschritt hat eine definierte Dauer, keine offenen Zeitfenster.
              </p>
            </Reveal>
            <Reveal className="value-item">
              <span className="mono" data-i18n="val2Kicker">
                Prüfung
              </span>
              <h4 data-i18n="val2Title">Geprüfte Kandidat/innen</h4>
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
              <p data-i18n="val4Desc">Feste Betreuung statt wechselnder Sachbearbeiter/innen.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="contact home-scroll-section" id="contact">
        <span id="contact-partner" className="contact-tab-anchor" aria-hidden="true" />
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

            <form
              className={`form-panel${activeTab === "client" ? " active" : ""}`}
              onSubmit={submitStaffForm}
              noValidate
            >
              {staffStatus === "success" ? (
                <FormSuccessCard
                  innerRef={staffSuccessRef}
                  kickerKey="formSuccessStaffKicker"
                  titleKey="formSuccessStaffTitle"
                  bodyKey="formSuccessStaffBody"
                />
              ) : (
                <>
                  <div className="field">
                    <label data-i18n="labelCompany">Unternehmen</label>
                    <input
                      type="text"
                      required
                      value={staffForm.company}
                      onChange={(e) => setStaffForm((prev) => ({ ...prev, company: e.target.value }))}
                      data-i18n-placeholder="phCompany"
                      placeholder="Firmenname"
                    />
                  </div>
                  <div className="field">
                    <label data-i18n="labelContact">Ansprechpartner/in</label>
                    <input
                      type="text"
                      required
                      value={staffForm.contact}
                      onChange={(e) => setStaffForm((prev) => ({ ...prev, contact: e.target.value }))}
                      data-i18n-placeholder="phContact"
                      placeholder="Vor und Nachname"
                    />
                  </div>
                  <div className="field">
                    <label data-i18n="labelEmail">E-Mail</label>
                    <input
                      type="email"
                      required
                      value={staffForm.email}
                      onChange={(e) => setStaffForm((prev) => ({ ...prev, email: e.target.value }))}
                      data-i18n-placeholder="phEmail"
                      placeholder="name@firma.de"
                    />
                  </div>
                  <div className="field">
                    <label data-i18n="labelIndustry">Branche</label>
                    <select
                      value={staffForm.industry}
                      onChange={(e) => setStaffForm((prev) => ({ ...prev, industry: e.target.value }))}
                    >
                      <option value="logistik" data-i18n="optLogistics">
                        Logistik / Zustellung
                      </option>
                      <option value="hotellerie" data-i18n="optHotel">
                        Hotellerie / Gastronomie
                      </option>
                      <option value="reinigung" data-i18n="optCleaning">
                        Reinigung & Fabrik
                      </option>
                      <option value="andere" data-i18n="optOther">
                        Andere
                      </option>
                    </select>
                  </div>
                  <div className="field">
                    <label data-i18n="labelNeedDesc">Kurzbeschreibung des Bedarfs</label>
                    <textarea
                      required
                      value={staffForm.needDesc}
                      onChange={(e) => setStaffForm((prev) => ({ ...prev, needDesc: e.target.value }))}
                      data-i18n-placeholder="phNeedDesc"
                      placeholder="Anzahl Kräfte, Zeitraum, Einsatzort..."
                    />
                  </div>
                  {staffError ? <p className="form-feedback form-feedback-error">{staffError}</p> : null}
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={staffStatus === "sending"}
                    data-i18n="btnSendRequest"
                  >
                    {staffStatus === "sending" ? translate("formSending") : translate("btnSendRequest")}
                  </button>
                  <p className="form-note" data-i18n="formNoteClient">
                    Wir melden uns innerhalb von 24 Stunden. Ihre Daten werden gemäß DSGVO verarbeitet.
                  </p>
                </>
              )}
            </form>

            <form
              className={`form-panel${activeTab === "partner" ? " active" : ""}`}
              onSubmit={submitPartnerForm}
              noValidate
            >
              {partnerStatus === "success" ? (
                <FormSuccessCard
                  innerRef={partnerSuccessRef}
                  kickerKey="formSuccessPartnerKicker"
                  titleKey="formSuccessPartnerTitle"
                  bodyKey="formSuccessPartnerBody"
                />
              ) : (
                <>
                  <div className="field">
                    <label data-i18n="labelCompany">Unternehmen</label>
                    <input
                      type="text"
                      required
                      value={partnerForm.company}
                      onChange={(e) => setPartnerForm((prev) => ({ ...prev, company: e.target.value }))}
                      data-i18n-placeholder="phCompany"
                      placeholder="Firmenname"
                    />
                  </div>
                  <div className="field">
                    <label data-i18n="labelContact">Ansprechpartner/in</label>
                    <input
                      type="text"
                      required
                      value={partnerForm.contact}
                      onChange={(e) =>
                        setPartnerForm((prev) => ({ ...prev, contact: e.target.value }))
                      }
                      data-i18n-placeholder="phContact"
                      placeholder="Vor und Nachname"
                    />
                  </div>
                  <div className="field">
                    <label data-i18n="labelEmail">E-Mail</label>
                    <input
                      type="email"
                      required
                      value={partnerForm.email}
                      onChange={(e) => setPartnerForm((prev) => ({ ...prev, email: e.target.value }))}
                      data-i18n-placeholder="phEmail"
                      placeholder="name@firma.de"
                    />
                  </div>
                  <div className="field">
                    <label data-i18n="labelPartnershipType">Art der Partnerschaft</label>
                    <select
                      value={partnerForm.partnershipType}
                      onChange={(e) =>
                        setPartnerForm((prev) => ({ ...prev, partnershipType: e.target.value }))
                      }
                    >
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
                      required
                      value={partnerForm.message}
                      onChange={(e) => setPartnerForm((prev) => ({ ...prev, message: e.target.value }))}
                      data-i18n-placeholder="phMessage"
                      placeholder="Umfang, Zeitrahmen, Erwartungen..."
                    />
                  </div>
                  {partnerError ? (
                    <p className="form-feedback form-feedback-error">{partnerError}</p>
                  ) : null}
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={partnerStatus === "sending"}
                    data-i18n="btnSendPartnership"
                  >
                    {partnerStatus === "sending"
                      ? translate("formSending")
                      : translate("btnSendPartnership")}
                  </button>
                  <p className="form-note" data-i18n="formNotePartner">
                    Wir prüfen jede Partnerschaftsanfrage persönlich und melden uns zeitnah.
                  </p>
                </>
              )}
            </form>
          </Reveal>

          <div className="contact-info reveal">
            <div className="info-row">
              <span className="mono" data-i18n="infoLocation">
                Standort
              </span>
              <div>
                <strong>Am Stichkanal 2 bis 4</strong>
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
                  <a href="tel:+491636791216" data-i18n="infoPhoneValue">
                    +49 163 679 1216
                  </a>
                </strong>
              </div>
            </div>
            <div className="info-row">
              <span className="mono" data-i18n="infoHours">
                Erreichbarkeit
              </span>
              <div>
                <strong data-i18n="infoHoursDetail">Mo bis Fr, 10:00 bis 19:00 Uhr</strong>
                <br />
                <span data-i18n="infoResponse">Antwort innerhalb von 24 Stunden</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-col">
              <SiteLogo className="logo logo-foot" />
              <p className="foot-tagline" data-i18n="footTagline">
                Personalvermittlung mit festen Fristen und geprüften Prozessen für Unternehmen, die
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
              <a href="#contact-partner" data-i18n="footPartner">
                Partner werden
              </a>
            </div>
          </div>
          <div className="foot-bottom">
            <p data-i18n="footCopyright">© 2026 staffontime. Alle Rechte vorbehalten.</p>
          </div>
          <div className="footer-meta">
            <div className="trust-inner">
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
            <div className="license-note" data-i18n="licenseNote">
              Antrag auf Arbeitnehmerüberlassungserlaubnis gem. §1 AÜG gestellt
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
