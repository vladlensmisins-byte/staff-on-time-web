"use client";

import { useEffect } from "react";

export default function BewerbungPage() {
  useEffect(() => {
    const TR: Record<string, Record<string, string | string[]>> = {
      en: {
        heroTitle: "Let's get you to work.",
        heroLede:
          "Fill in your details, tell us where you'd like to work, and pick a time for a short interview. We'll confirm and send you the address by email.",
        metaTime: "~5 minutes",
        metaTimeLabel: "to complete",
        metaLang: "EN / DE / हिंदी",
        metaLangLabel: "available languages",
        metaFree: "No cost",
        metaFreeLabel: "to candidates, ever",
        s1title: "1. Your details",
        s1sub: "So we know who we're meeting.",
        lastName: "Last name",
        firstName: "First name",
        email: "Email address",
        phone: "Phone number",
        s2title: "2. Background & experience",
        s2sub: "Tell us about your qualification and work history.",
        fieldOfStudy: "Field of study / qualification",
        workExp: "Work experience",
        s3title: "3. Language skills",
        s3sub: "Select your level for each language.",
        langGerman: "German",
        langEnglish: "English",
        langHindi: "Hindi",
        langOther: "Other language(s)",
        levelNone: "None",
        levelBasic: "Basic",
        levelIntermediate: "Intermediate",
        levelFluent: "Fluent",
        levelNative: "Native",
        otherLangPlaceholder: "e.g. Russian (fluent), Punjabi (basic)...",
        s4title: "4. Where would you like to work?",
        s4sub: "Select all that interest you.",
        indWarehouse: "Warehouse / Logistics",
        indProduction: "Production",
        indCleaning: "Cleaning",
        indGastro: "Gastronomy / Hotel",
        indDelivery: "Delivery",
        indConstruction: "Construction",
        indOther: "Other",
        selectAllOn: "+ Select all",
        selectAllOff: "✕ Clear all",
        s5title: "5. Licenses & certificates",
        s5sub: "This helps us match you to the right jobs faster.",
        drivingLicense: "Driving license category",
        licNone: "None",
        forklift: "Forklift license (Gabelstapler-Schein)",
        yes: "Yes",
        no: "No",
        s6title: "6. Visa / residence status",
        visaType: "Visa / residence permit type",
        visaSelect: "Please select...",
        visaEu: "EU / EEA citizen — no visa needed",
        visaBlue: "EU Blue Card",
        visaResidence: "Residence permit with work permission",
        visaWork: "Work visa",
        visaStudent: "Student visa with work permission",
        visaNone: "None yet / need guidance",
        visaOther: "Other",
        s7title: "7. Upload your CV",
        s7sub: "PDF format, max 5 MB.",
        uploadPrompt: "Click to upload your CV (PDF)",
        uploadHint: "or drag & drop here",
        s8title: "8. Pick your interview slot",
        s8sub: "Choose a date, then an available time.",
        submitBtn: "Book my interview",
        errRequired: "Please fill in all required fields and pick an interview slot.",
        errSlotTaken: "Sorry, that slot was just taken. Please choose another one.",
        errGeneric: "Something went wrong. Please try again or contact us.",
        confirmTitle: "You're booked!",
        confirmLede: "Thank you. Our team will contact you by email with the exact interview address.",
        confirmFooter: "Please check your inbox (and spam folder) in the next few days.",
        confirmName: "Name",
        confirmDate: "Interview date",
        confirmTime: "Interview time",
        adminLink: "Recruiter view",
        adminTitle: "All submissions",
        dow: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        mon: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        noSlotsLine: "No date selected yet.",
        downloadCv: "Download CV",
      },
      de: {
        heroTitle: "Auf geht's zur Arbeit.",
        heroLede:
          "Geben Sie Ihre Daten ein, teilen Sie uns mit, wo Sie arbeiten möchten, und wählen Sie einen Termin für ein kurzes Gespräch. Wir bestätigen und senden Ihnen die Adresse per E-Mail.",
        metaTime: "~5 Minuten",
        metaTimeLabel: "Bearbeitungszeit",
        metaLang: "EN / DE / हिंदी",
        metaLangLabel: "verfügbare Sprachen",
        metaFree: "Kostenlos",
        metaFreeLabel: "für Bewerber, immer",
        s1title: "1. Ihre Angaben",
        s1sub: "Damit wir wissen, wen wir treffen.",
        lastName: "Nachname",
        firstName: "Vorname",
        email: "E-Mail-Adresse",
        phone: "Telefonnummer",
        s2title: "2. Ausbildung & Erfahrung",
        s2sub: "Erzählen Sie uns von Ihrer Qualifikation und Berufserfahrung.",
        fieldOfStudy: "Studiengang / Qualifikation",
        workExp: "Arbeitserfahrung",
        s3title: "3. Sprachkenntnisse",
        s3sub: "Wählen Sie Ihr Niveau für jede Sprache.",
        langGerman: "Deutsch",
        langEnglish: "Englisch",
        langHindi: "Hindi",
        langOther: "Weitere Sprache(n)",
        levelNone: "Keine",
        levelBasic: "Grundkenntnisse",
        levelIntermediate: "Mittelstufe",
        levelFluent: "Fließend",
        levelNative: "Muttersprache",
        otherLangPlaceholder: "z. B. Russisch (fließend), Punjabi (Grundkenntnisse)...",
        s4title: "4. Wo möchten Sie arbeiten?",
        s4sub: "Wählen Sie alles aus, was Sie interessiert.",
        indWarehouse: "Lager / Logistik",
        indProduction: "Produktion",
        indCleaning: "Reinigung",
        indGastro: "Gastronomie / Hotel",
        indDelivery: "Lieferung",
        indConstruction: "Bau",
        indOther: "Sonstiges",
        selectAllOn: "+ Alle auswählen",
        selectAllOff: "✕ Alle abwählen",
        s5title: "5. Führerscheine & Nachweise",
        s5sub: "Das hilft uns, Sie schneller passenden Jobs zuzuordnen.",
        drivingLicense: "Führerscheinklasse",
        licNone: "Keiner",
        forklift: "Gabelstapler-Schein",
        yes: "Ja",
        no: "Nein",
        s6title: "6. Visum / Aufenthaltsstatus",
        visaType: "Art des Visums / Aufenthaltstitels",
        visaSelect: "Bitte auswählen...",
        visaEu: "EU-/EWR-Bürger — kein Visum nötig",
        visaBlue: "Blaue Karte EU",
        visaResidence: "Aufenthaltstitel mit Arbeitserlaubnis",
        visaWork: "Arbeitsvisum",
        visaStudent: "Studentenvisum mit Arbeitserlaubnis",
        visaNone: "Noch keins / brauche Beratung",
        visaOther: "Sonstiges",
        s7title: "7. Lebenslauf hochladen",
        s7sub: "PDF-Format, max. 5 MB.",
        uploadPrompt: "Klicken Sie, um Ihren Lebenslauf (PDF) hochzuladen",
        uploadHint: "oder hier ablegen",
        s8title: "8. Termin auswählen",
        s8sub: "Wählen Sie zuerst ein Datum, dann eine verfügbare Uhrzeit.",
        submitBtn: "Termin buchen",
        errRequired: "Bitte füllen Sie alle Pflichtfelder aus und wählen Sie einen Termin.",
        errSlotTaken: "Dieser Termin wurde gerade vergeben. Bitte wählen Sie einen anderen.",
        errGeneric: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut oder kontaktieren Sie uns.",
        confirmTitle: "Termin gebucht!",
        confirmLede: "Vielen Dank. Unser Team meldet sich per E-Mail mit der genauen Adresse.",
        confirmFooter: "Bitte prüfen Sie in den nächsten Tagen Ihr Postfach (auch den Spam-Ordner).",
        confirmName: "Name",
        confirmDate: "Termindatum",
        confirmTime: "Uhrzeit",
        adminLink: "Ansicht für Recruiter",
        adminTitle: "Alle Bewerbungen",
        dow: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
        mon: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
        noSlotsLine: "Noch kein Datum ausgewählt.",
        downloadCv: "Lebenslauf herunterladen",
      },
      hi: {
        heroTitle: "चलिए, आपको काम पर लगाते हैं।",
        heroLede:
          "अपनी जानकारी भरें, बताएं आप कहाँ काम करना चाहते हैं, और एक छोटे इंटरव्यू के लिए समय चुनें। हम पुष्टि करेंगे और ईमेल पर पता भेजेंगे।",
        metaTime: "~5 मिनट",
        metaTimeLabel: "पूरा करने में",
        metaLang: "EN / DE / हिंदी",
        metaLangLabel: "उपलब्ध भाषाएँ",
        metaFree: "निःशुल्क",
        metaFreeLabel: "उम्मीदवारों के लिए, हमेशा",
        s1title: "1. आपकी जानकारी",
        s1sub: "ताकि हमें पता हो कि हम किससे मिल रहे हैं।",
        lastName: "उपनाम (Last name)",
        firstName: "पहला नाम (First name)",
        email: "ईमेल पता",
        phone: "फ़ोन नंबर",
        s2title: "2. शिक्षा और अनुभव",
        s2sub: "अपनी योग्यता और कार्य अनुभव के बारे में बताएं।",
        fieldOfStudy: "अध्ययन क्षेत्र / योग्यता",
        workExp: "कार्य अनुभव",
        s3title: "3. भाषा कौशल",
        s3sub: "प्रत्येक भाषा के लिए अपना स्तर चुनें।",
        langGerman: "जर्मन",
        langEnglish: "अंग्रेज़ी",
        langHindi: "हिंदी",
        langOther: "अन्य भाषा(एं)",
        levelNone: "कोई नहीं",
        levelBasic: "शुरुआती",
        levelIntermediate: "मध्यम",
        levelFluent: "धाराप्रवाह",
        levelNative: "मातृभाषा",
        otherLangPlaceholder: "जैसे रूसी (धाराप्रवाह), पंजाबी (शुरुआती)...",
        s4title: "4. आप कहाँ काम करना चाहेंगे?",
        s4sub: "जिनमें रुचि है वे सभी चुनें।",
        indWarehouse: "वेयरहाउस / लॉजिस्टिक्स",
        indProduction: "उत्पादन (Production)",
        indCleaning: "सफाई (Reinigung)",
        indGastro: "गैस्ट्रोनॉमी / होटल",
        indDelivery: "डिलीवरी",
        indConstruction: "निर्माण (Bau)",
        indOther: "अन्य",
        selectAllOn: "+ सभी चुनें",
        selectAllOff: "✕ सभी हटाएं",
        s5title: "5. लाइसेंस और प्रमाणपत्र",
        s5sub: "इससे हम आपको सही नौकरी से जल्दी जोड़ पाएंगे।",
        drivingLicense: "ड्राइविंग लाइसेंस श्रेणी",
        licNone: "कोई नहीं",
        forklift: "फोर्कलिफ्ट लाइसेंस (Gabelstapler-Schein)",
        yes: "हाँ",
        no: "नहीं",
        s6title: "6. वीज़ा / निवास स्थिति",
        visaType: "वीज़ा / निवास परमिट का प्रकार",
        visaSelect: "कृपया चुनें...",
        visaEu: "EU / EEA नागरिक — वीज़ा की आवश्यकता नहीं",
        visaBlue: "EU ब्लू कार्ड",
        visaResidence: "कार्य अनुमति सहित निवास परमिट",
        visaWork: "वर्क वीज़ा",
        visaStudent: "कार्य अनुमति सहित स्टूडेंट वीज़ा",
        visaNone: "अभी तक नहीं / जानकारी चाहिए",
        visaOther: "अन्य",
        s7title: "7. अपना सीवी (CV) अपलोड करें",
        s7sub: "PDF फ़ॉर्मैट, अधिकतम 5 MB।",
        uploadPrompt: "अपना सीवी (PDF) अपलोड करने के लिए क्लिक करें",
        uploadHint: "या यहाँ खींच कर छोड़ें",
        s8title: "8. इंटरव्यू का समय चुनें",
        s8sub: "पहले तारीख चुनें, फिर उपलब्ध समय।",
        submitBtn: "इंटरव्यू बुक करें",
        errRequired: "कृपया सभी आवश्यक फ़ील्ड भरें और एक समय चुनें।",
        errSlotTaken: "माफ़ करें, यह समय अभी किसी और ने ले लिया। कृपया दूसरा चुनें।",
        errGeneric: "कुछ गलत हो गया। कृपया पुनः प्रयास करें या हमसे संपर्क करें।",
        confirmTitle: "आपका बुकिंग हो गया!",
        confirmLede: "धन्यवाद। हमारी टीम ईमेल पर सही पता भेजकर आपसे संपर्क करेगी।",
        confirmFooter: "कृपया अगले कुछ दिनों में अपना इनबॉक्स (और स्पैम फ़ोल्डर भी) देखें।",
        confirmName: "नाम",
        confirmDate: "इंटरव्यू की तारीख",
        confirmTime: "समय",
        adminLink: "रिक्रूटर व्यू",
        adminTitle: "सभी आवेदन",
        dow: ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"],
        mon: ["जन", "फ़र", "मार्च", "अप्रै", "मई", "जून", "जुल", "अग", "सित", "अक्तू", "नव", "दिस"],
        noSlotsLine: "अभी कोई तारीख नहीं चुनी गई।",
        downloadCv: "सीवी डाउनलोड करें",
      },
    };

    let currentLang = "en";
    const state = {
      langSkills: { german: "none", english: "none", hindi: "none" } as Record<string, string>,
      otherLang: "",
      industries: new Set<string>(),
      licenses: new Set<string>(),
      forklift: null as string | null,
      cvBase64: null as string | null,
      cvName: null as string | null,
      selectedDate: null as string | null,
      selectedTime: null as string | null,
    };

    const INDUSTRY_KEYS = [
      "indWarehouse",
      "indProduction",
      "indCleaning",
      "indGastro",
      "indDelivery",
      "indConstruction",
      "indOther",
    ];
    const LICENSE_KEYS = ["licNone", "B", "BE", "C", "C1", "CE"];
    const LANG_KEYS = ["german", "english", "hindi"];
    const LEVELS = ["levelNone", "levelBasic", "levelIntermediate", "levelFluent", "levelNative"];
    const LEVEL_VALUES = ["none", "basic", "intermediate", "fluent", "native"];

    function t(key: string): string {
      const val = TR[currentLang][key] ?? TR.en[key];
      return typeof val === "string" ? val : key;
    }

    function applyTranslations() {
      document.documentElement.lang = currentLang;
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (key) el.textContent = t(key);
      });

      renderLangSkills();
      renderIndustryChips();
      renderLicenseChips();
      renderForkliftToggle();
      renderDateScroll();
      renderSlotGrid();
    }

    function renderLangSkills() {
      const wrap = document.getElementById("langSkillsWrap");
      if (!wrap) return;
      wrap.innerHTML = "";
      LANG_KEYS.forEach((langKey) => {
        const row = document.createElement("div");
        row.className = "lang-skill-row";
        const label = document.createElement("span");
        label.textContent = t("lang" + langKey.charAt(0).toUpperCase() + langKey.slice(1));
        const select = document.createElement("select");
        LEVELS.forEach((lvKey, i) => {
          const opt = document.createElement("option");
          opt.value = LEVEL_VALUES[i];
          opt.textContent = t(lvKey);
          if (state.langSkills[langKey] === LEVEL_VALUES[i]) opt.selected = true;
          select.appendChild(opt);
        });
        select.onchange = () => {
          state.langSkills[langKey] = select.value;
        };
        row.appendChild(label);
        row.appendChild(select);
        wrap.appendChild(row);
      });
      const otherRow = document.createElement("div");
      otherRow.className = "field";
      otherRow.style.marginTop = "10px";
      const otherLabel = document.createElement("label");
      otherLabel.textContent = t("langOther");
      const otherInput = document.createElement("input");
      otherInput.type = "text";
      otherInput.placeholder = t("otherLangPlaceholder");
      otherInput.value = state.otherLang;
      otherInput.oninput = () => {
        state.otherLang = otherInput.value;
      };
      otherRow.appendChild(otherLabel);
      otherRow.appendChild(otherInput);
      wrap.appendChild(otherRow);
    }

    function renderIndustryChips() {
      const wrap = document.getElementById("industryChips");
      if (!wrap) return;
      wrap.innerHTML = "";
      INDUSTRY_KEYS.forEach((key) => {
        const chip = document.createElement("div");
        chip.className = "chip" + (state.industries.has(key) ? " selected" : "");
        chip.textContent = t(key);
        chip.onclick = () => {
          if (state.industries.has(key)) state.industries.delete(key);
          else state.industries.add(key);
          renderIndustryChips();
        };
        wrap.appendChild(chip);
      });
      const allSelected = INDUSTRY_KEYS.every((k) => state.industries.has(k));
      const selectAllBtn = document.getElementById("selectAllIndustries");
      if (selectAllBtn) {
        selectAllBtn.textContent = allSelected ? t("selectAllOff") : t("selectAllOn");
        selectAllBtn.onclick = () => {
          if (allSelected) {
            state.industries.clear();
          } else {
            INDUSTRY_KEYS.forEach((k) => state.industries.add(k));
          }
          renderIndustryChips();
        };
      }
    }

    function renderLicenseChips() {
      const wrap = document.getElementById("licenseChips");
      if (!wrap) return;
      wrap.innerHTML = "";
      LICENSE_KEYS.forEach((key) => {
        const chip = document.createElement("div");
        const label = key === "licNone" ? t("licNone") : key;
        chip.className = "chip" + (state.licenses.has(key) ? " selected" : "");
        chip.textContent = label;
        chip.onclick = () => {
          if (key === "licNone") {
            state.licenses.clear();
            state.licenses.add("licNone");
          } else {
            state.licenses.delete("licNone");
            if (state.licenses.has(key)) state.licenses.delete(key);
            else state.licenses.add(key);
          }
          renderLicenseChips();
        };
        wrap.appendChild(chip);
      });
    }

    function renderForkliftToggle() {
      const wrap = document.getElementById("forkliftToggle");
      if (!wrap) return;
      wrap.querySelectorAll("button").forEach((btn) => {
        const i18n = btn.getAttribute("data-i18n");
        if (i18n) btn.textContent = t(i18n);
        btn.classList.toggle("selected", state.forklift === btn.getAttribute("data-val"));
        btn.onclick = () => {
          state.forklift = btn.getAttribute("data-val");
          renderForkliftToggle();
        };
      });
    }

    function getUpcomingWeekdays(count: number) {
      const dates: Date[] = [];
      const d = new Date();
      d.setDate(d.getDate() + 1);
      while (dates.length < count) {
        const day = d.getDay();
        if (day !== 0 && day !== 6) {
          dates.push(new Date(d));
        }
        d.setDate(d.getDate() + 1);
      }
      return dates;
    }

    const UPCOMING_DATES = getUpcomingWeekdays(15);
    const TIME_SLOTS = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

    function fmtDateKey(d: Date) {
      return (
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0")
      );
    }

    function renderDateScroll() {
      const wrap = document.getElementById("dateScroll");
      if (!wrap) return;
      wrap.innerHTML = "";
      const dow = TR[currentLang].dow as string[];
      const mon = TR[currentLang].mon as string[];
      UPCOMING_DATES.forEach((d) => {
        const key = fmtDateKey(d);
        const pill = document.createElement("div");
        pill.className = "date-pill" + (state.selectedDate === key ? " selected" : "");
        pill.innerHTML =
          '<div class="dow">' +
          dow[d.getDay()] +
          '</div><div class="dnum">' +
          d.getDate() +
          '</div><div class="dmon">' +
          mon[d.getMonth()] +
          "</div>";
        pill.onclick = () => {
          state.selectedDate = key;
          state.selectedTime = null;
          renderDateScroll();
          renderSlotGrid();
        };
        wrap.appendChild(pill);
      });
    }

    async function renderSlotGrid() {
      const wrap = document.getElementById("slotGrid");
      if (!wrap) return;
      wrap.innerHTML = "";
      if (!state.selectedDate) {
        const p = document.createElement("div");
        p.style.color = "var(--text-dim)";
        p.style.fontSize = "13px";
        p.textContent = t("noSlotsLine");
        wrap.appendChild(p);
        return;
      }
      const bookedSet = new Set<string>();
      try {
        const res = await fetch("/api/submit?date=" + encodeURIComponent(state.selectedDate));
        if (res.ok) {
          const data = await res.json();
          (data.slots || []).forEach((time: string) => bookedSet.add(time));
        }
      } catch {
        /* no bookings yet */
      }

      TIME_SLOTS.forEach((time) => {
        const btn = document.createElement("div");
        const taken = bookedSet.has(time);
        btn.className =
          "slot-btn" + (taken ? " taken" : "") + (state.selectedTime === time ? " selected" : "");
        btn.textContent = time;
        if (!taken) {
          btn.onclick = () => {
            state.selectedTime = time;
            renderSlotGrid();
          };
        }
        wrap.appendChild(btn);
      });
    }

    const cvFile = document.getElementById("cvFile") as HTMLInputElement | null;
    const onCvChange = function (e: Event) {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        alert("File too large. Max 5 MB.");
        target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = function () {
        state.cvBase64 = reader.result as string;
        state.cvName = file.name;
        const cvFileName = document.getElementById("cvFileName");
        const uploadBox = document.getElementById("uploadBox");
        if (cvFileName) cvFileName.textContent = file.name;
        if (uploadBox) uploadBox.classList.add("has-file");
      };
      reader.readAsDataURL(file);
    };
    cvFile?.addEventListener("change", onCvChange);

    const langButtons = document.querySelectorAll(".lang-switch button");
    const langHandlers: Array<{ btn: Element; handler: () => void }> = [];
    langButtons.forEach((btn) => {
      const handler = () => {
        currentLang = btn.getAttribute("data-lang") || "en";
        document.querySelectorAll(".lang-switch button").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        applyTranslations();
      };
      btn.addEventListener("click", handler);
      langHandlers.push({ btn, handler });
    });

    const bookingForm = document.getElementById("bookingForm");
    const onSubmit = async function (e: Event) {
      e.preventDefault();
      const errEl = document.getElementById("formError");
      if (errEl) errEl.textContent = "";

      const lastName = (document.getElementById("lastName") as HTMLInputElement).value.trim();
      const firstName = (document.getElementById("firstName") as HTMLInputElement).value.trim();
      const email = (document.getElementById("email") as HTMLInputElement).value.trim();
      const phone = (document.getElementById("phone") as HTMLInputElement).value.trim();
      const visaType = (document.getElementById("visaType") as HTMLSelectElement).value;

      if (
        !lastName ||
        !firstName ||
        !email ||
        !phone ||
        !visaType ||
        !state.selectedDate ||
        !state.selectedTime
      ) {
        if (errEl) errEl.textContent = t("errRequired");
        return;
      }

      const form = e.target as HTMLFormElement;
      const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
      submitBtn.disabled = true;

      try {
        const res = await fetch("/api/submit?date=" + encodeURIComponent(state.selectedDate));
        if (res.ok) {
          const data = await res.json();
          if ((data.slots || []).includes(state.selectedTime)) {
            if (errEl) errEl.textContent = t("errSlotTaken");
            submitBtn.disabled = false;
            renderSlotGrid();
            return;
          }
        }
      } catch {
        /* key not found = free, continue */
      }

      const submission = {
        lastName,
        firstName,
        email,
        phone,
        fieldOfStudy: (document.getElementById("fieldOfStudy") as HTMLInputElement).value.trim(),
        workExp: (document.getElementById("workExp") as HTMLTextAreaElement).value.trim(),
        langSkills: state.langSkills,
        otherLang: state.otherLang,
        industries: Array.from(state.industries),
        licenses: Array.from(state.licenses),
        forklift: state.forklift,
        visaType,
        cvName: state.cvName,
        cvBase64: state.cvBase64,
        interviewDate: state.selectedDate,
        interviewTime: state.selectedTime,
        language: currentLang,
        submittedAt: new Date().toISOString(),
      };

      try {
        const res = await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submission),
        });
        const data = (await res.json().catch(() => ({}))) as { error?: string };

        if (res.status === 409) {
          if (errEl) errEl.textContent = t("errSlotTaken");
          submitBtn.disabled = false;
          renderSlotGrid();
          return;
        }

        if (!res.ok) {
          if (errEl) errEl.textContent = data.error || t("errGeneric");
          submitBtn.disabled = false;
          return;
        }
      } catch (err) {
        console.error("Submit error", err);
        if (errEl) errEl.textContent = t("errGeneric");
        submitBtn.disabled = false;
        return;
      }

      document.getElementById("formView")?.classList.add("hidden");
      const confirmDetail = document.getElementById("confirmDetail");
      if (confirmDetail) {
        confirmDetail.innerHTML =
          "<div><span>" +
          t("confirmName") +
          "</span><span>" +
          firstName +
          " " +
          lastName +
          "</span></div>" +
          "<div><span>" +
          t("confirmDate") +
          "</span><span>" +
          state.selectedDate +
          "</span></div>" +
          "<div><span>" +
          t("confirmTime") +
          "</span><span>" +
          state.selectedTime +
          "</span></div>";
      }
      document.getElementById("confirmView")?.classList.remove("hidden");
      window.scrollTo(0, 0);
    };
    bookingForm?.addEventListener("submit", onSubmit);

    const adminToggle = document.getElementById("adminToggle");
    const onAdminToggle = async () => {
      const panel = document.getElementById("adminPanel");
      if (!panel) return;
      const isHidden = panel.style.display === "none" || !panel.style.display;
      if (!isHidden) {
        panel.style.display = "none";
        return;
      }
      panel.style.display = "block";
      const list = document.getElementById("adminList");
      if (!list) return;
      list.innerHTML = "Loading...";
      try {
        const res = await fetch("/api/submit?submissions=true");
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        const entries = (data.submissions || []) as Array<Record<string, unknown>>;
        if (entries.length === 0) {
          list.innerHTML = '<p style="color:var(--text-dim);">No submissions yet.</p>';
          return;
        }
        entries.sort(
          (a, b) =>
            new Date(b.submittedAt as string).getTime() - new Date(a.submittedAt as string).getTime(),
        );
        list.innerHTML = "";
        entries.forEach((s) => {
          const div = document.createElement("div");
          div.className = "admin-entry";
          let cvLink = "";
          if (s.cvDownloadUrl) {
            cvLink =
              '<a class="cvlink" target="_blank" rel="noopener" href="' +
              s.cvDownloadUrl +
              '">' +
              t("downloadCv") +
              "</a>";
          }
          const langSkills = s.langSkills as Record<string, string>;
          div.innerHTML =
            '<div class="top"><span>' +
            s.firstName +
            " " +
            s.lastName +
            "</span><span>" +
            s.interviewDate +
            " " +
            s.interviewTime +
            "</span></div>" +
            '<div class="grid">' +
            "<div>Email: " +
            s.email +
            "</div>" +
            "<div>Phone: " +
            s.phone +
            "</div>" +
            "<div>Field: " +
            (s.fieldOfStudy || "—") +
            "</div>" +
            "<div>Visa: " +
            s.visaType +
            "</div>" +
            "<div>Industries: " +
            ((s.industries as string[]) || []).join(", ") +
            "</div>" +
            "<div>Licenses: " +
            ((s.licenses as string[]) || []).join(", ") +
            "</div>" +
            "<div>Forklift: " +
            (s.forklift || "—") +
            "</div>" +
            "<div>Languages: DE " +
            langSkills.german +
            ", EN " +
            langSkills.english +
            ", HI " +
            langSkills.hindi +
            (s.otherLang ? ", " + s.otherLang : "") +
            "</div>" +
            "</div>" +
            '<div style="margin-top:8px;">' +
            (s.workExp ? "Experience: " + s.workExp + "<br>" : "") +
            cvLink +
            "</div>";
          list.appendChild(div);
        });
      } catch {
        list.innerHTML = '<p style="color:#e07070;">Could not load submissions.</p>';
      }
    };
    adminToggle?.addEventListener("click", onAdminToggle);

    applyTranslations();

    return () => {
      cvFile?.removeEventListener("change", onCvChange);
      bookingForm?.removeEventListener("submit", onSubmit);
      adminToggle?.removeEventListener("click", onAdminToggle);
      langHandlers.forEach(({ btn, handler }) => btn.removeEventListener("click", handler));
    };
  }, []);

  return (
    <>
      <header className="site-header">
        <nav className="wrap header-inner">
          <a href="/" className="logo">
            staffontime<span className="dot">.</span>
          </a>
          <div className="header-right">
            <div className="nav-links">
              <a href="/#paths">Für Unternehmen</a>
              <a href="/#process">Ablauf</a>
              <a href="/#industries">Branchen</a>
              <a href="/#contact">Kontakt</a>
            </div>
            <div className="lang-switch">
              <button type="button" data-lang="en" className="active">
                EN
              </button>
              <button type="button" data-lang="de">
                DE
              </button>
              <button type="button" data-lang="hi">
                हिं
              </button>
            </div>
            <div className="nav-cta">
              <a href="/#contact" className="btn btn-ghost">
                Partner werden
              </a>
              <a href="/#contact" className="btn btn-primary">
                Personal anfragen
              </a>
            </div>
          </div>
        </nav>
      </header>

      <div id="formView">
        <section className="bewerbung-hero">
          <div className="wrap">
            <span className="mono">Kandidat:innen</span>
            <h1 data-i18n="heroTitle">Let&apos;s get you to work.</h1>
            <p className="lead" data-i18n="heroLede">
              Fill in your details, tell us where you&apos;d like to work, and pick a time for a short
              interview. We&apos;ll confirm and send you the address by email.
            </p>
            <div className="bewerbung-meta">
              <div>
                <strong data-i18n="metaTime">~5 minutes</strong>
                <span data-i18n="metaTimeLabel">to complete</span>
              </div>
              <div>
                <strong data-i18n="metaLang">EN / DE / हिंदी</strong>
                <span data-i18n="metaLangLabel">available languages</span>
              </div>
              <div>
                <strong data-i18n="metaFree">No cost</strong>
                <span data-i18n="metaFreeLabel">to candidates, ever</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bewerbung-main">
          <div className="wrap">
            <form id="bookingForm" className="bewerbung-form" noValidate>
              <div className="bewerbung-card">
                <h2 data-i18n="s1title">1. Your details</h2>
                <p className="bewerbung-step-sub" data-i18n="s1sub">
                  So we know who we&apos;re meeting.
                </p>
                <div className="bewerbung-row2">
                  <div className="field">
                    <label className="req" data-i18n="lastName">
                      Last name
                    </label>
                    <input type="text" id="lastName" required />
                  </div>
                  <div className="field">
                    <label className="req" data-i18n="firstName">
                      First name
                    </label>
                    <input type="text" id="firstName" required />
                  </div>
                </div>
                <div className="bewerbung-row2" style={{ marginTop: "16px" }}>
                  <div className="field">
                    <label className="req" data-i18n="email">
                      Email address
                    </label>
                    <input type="email" id="email" required />
                  </div>
                  <div className="field">
                    <label className="req" data-i18n="phone">
                      Phone number
                    </label>
                    <input type="tel" id="phone" required placeholder="+49 ..." />
                  </div>
                </div>
              </div>

              <div className="bewerbung-card">
                <h2 data-i18n="s2title">2. Background & experience</h2>
                <p className="bewerbung-step-sub" data-i18n="s2sub">
                  Tell us about your qualification and work history.
                </p>
                <div className="field">
                  <label data-i18n="fieldOfStudy">Field of study / qualification</label>
                  <input
                    type="text"
                    id="fieldOfStudy"
                    placeholder="e.g. Logistics, Mechanical Engineering, no formal qualification..."
                  />
                </div>
                <div className="field">
                  <label data-i18n="workExp">Work experience</label>
                  <textarea
                    id="workExp"
                    placeholder="e.g. 2 years warehouse picker/packer, forklift operator..."
                  />
                </div>
              </div>

              <div className="bewerbung-card">
                <h2 data-i18n="s3title">3. Language skills</h2>
                <p className="bewerbung-step-sub" data-i18n="s3sub">
                  Select your level for each language.
                </p>
                <div id="langSkillsWrap" />
              </div>

              <div className="bewerbung-card">
                <h2 data-i18n="s4title">4. Where would you like to work?</h2>
                <p className="bewerbung-step-sub" data-i18n="s4sub">
                  Select all that interest you.
                </p>
                <div className="chip-group" id="industryChips" />
                <div style={{ marginTop: "10px" }}>
                  <span className="chip" id="selectAllIndustries" style={{ borderStyle: "dashed" }} />
                </div>
              </div>

              <div className="bewerbung-card">
                <h2 data-i18n="s5title">5. Licenses & certificates</h2>
                <p className="bewerbung-step-sub" data-i18n="s5sub">
                  This helps us match you to the right jobs faster.
                </p>
                <div className="field">
                  <label data-i18n="drivingLicense">Driving license category</label>
                  <div className="chip-group" id="licenseChips" />
                </div>
                <div className="field" style={{ marginTop: "18px" }}>
                  <label data-i18n="forklift">Forklift license (Gabelstapler-Schein)</label>
                  <div className="toggle-pair" id="forkliftToggle">
                    <button type="button" data-val="yes" data-i18n="yes">
                      Yes
                    </button>
                    <button type="button" data-val="no" data-i18n="no">
                      No
                    </button>
                  </div>
                </div>
              </div>

              <div className="bewerbung-card">
                <h2 data-i18n="s6title">6. Visa / residence status</h2>
                <div className="field">
                  <label className="req" data-i18n="visaType">
                    Visa / residence permit type
                  </label>
                  <select id="visaType" required>
                    <option value="" data-i18n="visaSelect">
                      Please select...
                    </option>
                    <option value="eu_citizen" data-i18n="visaEu">
                      EU / EEA citizen — no visa needed
                    </option>
                    <option value="blue_card" data-i18n="visaBlue">
                      EU Blue Card
                    </option>
                    <option value="residence_permit_work" data-i18n="visaResidence">
                      Residence permit with work permission
                    </option>
                    <option value="work_visa" data-i18n="visaWork">
                      Work visa
                    </option>
                    <option value="student_visa_work" data-i18n="visaStudent">
                      Student visa with work permission
                    </option>
                    <option value="none_yet" data-i18n="visaNone">
                      None yet / need guidance
                    </option>
                    <option value="other" data-i18n="visaOther">
                      Other
                    </option>
                  </select>
                </div>
              </div>

              <div className="bewerbung-card">
                <h2 data-i18n="s7title">7. Upload your CV</h2>
                <p className="bewerbung-step-sub" data-i18n="s7sub">
                  PDF format, max 5 MB.
                </p>
                <label className="upload-box" id="uploadBox">
                  <input type="file" id="cvFile" accept="application/pdf" />
                  <div data-i18n="uploadPrompt">Click to upload your CV (PDF)</div>
                  <div className="fname" id="cvFileName" />
                  <div className="hint" data-i18n="uploadHint">
                    or drag & drop here
                  </div>
                </label>
              </div>

              <div className="bewerbung-card">
                <h2 data-i18n="s8title">8. Pick your interview slot</h2>
                <p className="bewerbung-step-sub" data-i18n="s8sub">
                  Choose a date, then an available time.
                </p>
                <div className="cal-wrap">
                  <div className="date-scroll" id="dateScroll" />
                  <div className="slot-grid" id="slotGrid" />
                </div>
              </div>

              <div id="formError" className="bewerbung-error" />
              <div className="bewerbung-submit-row">
                <button type="submit" className="btn btn-primary" data-i18n="submitBtn">
                  Book my interview
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>

      <div id="confirmView" className="hidden">
        <div className="bewerbung-confirm">
          <div className="check">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12.5L9.5 18L20 6.5"
                stroke="#171008"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 data-i18n="confirmTitle">You&apos;re booked!</h1>
          <p data-i18n="confirmLede">
            Thank you. Our team will contact you by email with the exact interview address.
          </p>
          <div className="confirm-detail" id="confirmDetail" />
          <p style={{ fontSize: "13px", color: "var(--text-dim)" }} data-i18n="confirmFooter">
            Please check your inbox (and spam folder) in the next few days.
          </p>
        </div>
      </div>

      <a id="adminToggle" className="bewerbung-admin-toggle" data-i18n="adminLink">
        Recruiter view
      </a>

      <div id="adminPanel" className="bewerbung-admin-panel">
        <h2 data-i18n="adminTitle">All submissions</h2>
        <div id="adminList" />
      </div>

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
              <a href="/#paths">Für Unternehmen</a>
              <a href="/#process">Ablauf</a>
              <a href="/#industries">Branchen</a>
            </div>
            <div className="foot-col">
              <h5>Rechtliches</h5>
              <a href="#">Impressum</a>
              <a href="#">Datenschutz</a>
              <a href="#">AGB</a>
            </div>
            <div className="foot-col">
              <h5>Kontakt</h5>
              <a href="/#contact">Personal anfragen</a>
              <a href="/#contact">Partner werden</a>
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
