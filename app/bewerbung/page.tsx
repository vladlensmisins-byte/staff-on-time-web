"use client";

import Link from "next/link";
import { useEffect } from "react";
import { getSiteLang, setSiteLang } from "@/lib/site-language";
import {
  buildInterviewTimeSlots,
  fmtDateKey,
  getUpcomingInterviewSaturdays,
} from "@/lib/interview-slots";

export default function BewerbungPage() {
  useEffect(() => {
    const TR: Record<string, Record<string, string | string[]>> = {
      en: {
        brandName: "Staff on Time",
        brandSub: "Personaldienstleistung Berlin",
        heroTitle: "Let's get you to work.",
        heroLede:
          "Fill in your details, tell us where you'd like to work, and pick a time for a short interview. We'll confirm and send you the address by email.",
        metaTime: "~2 minutes",
        metaTimeLabel: "to complete",
        metaLang: "EN / DE",
        metaLangLabel: "available languages",
        s1title: "1. Your details",
        s1sub: "So we know who we're meeting.",
        lastName: "Last name",
        firstName: "First name",
        email: "Email address",
        phone: "Phone number",
        birthDate: "Date of birth",
        s2title: "2. Background & experience",
        s2sub: "Tell us about your qualification and work history.",
        fieldOfStudy: "Field of study / qualification",
        fieldOfStudyPlaceholder: "e.g. Logistics, Mechanical Engineering, ....",
        workExp: "Work experience",
        workExpPlaceholder: "e.g. 2 years warehouse picker/packer, forklift operator...",
        s3title: "3. Language skills",
        s3sub: "Select your level for each language.",
        langGerman: "German",
        langEnglish: "English",
        langOther: "Other language(s)",
        levelSelect: "Please select...",
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
        s7sub: "PDF format, max 10 MB.",
        uploadPrompt: "Click to upload your CV (PDF)",
        uploadHint: "or drag & drop here",
        s8title: "8. Pick your interview slot",
        s8sub: "Saturdays only — choose a date, then a time between 11:00 and 20:00.",
        submitBtn: "Book my interview",
        errRequired: "Please complete the highlighted fields and pick an interview slot.",
        errSlotTaken: "Sorry, that slot was just taken. Please choose another one.",
        errFileTooLarge: "File too large. Max 10 MB.",
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
        brandName: "Staff on Time",
        brandSub: "Personaldienstleistung Berlin",
        heroTitle: "Auf geht's zur Arbeit.",
        heroLede:
          "Geben Sie Ihre Daten ein, teilen Sie uns mit, wo Sie arbeiten möchten, und wählen Sie einen Termin für ein kurzes Gespräch. Wir bestätigen und senden Ihnen die Adresse per E-Mail.",
        metaTime: "~2 Minuten",
        metaTimeLabel: "Bearbeitungszeit",
        metaLang: "EN / DE",
        metaLangLabel: "verfügbare Sprachen",
        s1title: "1. Ihre Angaben",
        s1sub: "Damit wir wissen, wen wir treffen.",
        lastName: "Nachname",
        firstName: "Vorname",
        email: "E-Mail-Adresse",
        phone: "Telefonnummer",
        birthDate: "Geburtsdatum",
        s2title: "2. Ausbildung & Erfahrung",
        s2sub: "Erzählen Sie uns von Ihrer Qualifikation und Berufserfahrung.",
        fieldOfStudy: "Studiengang / Qualifikation",
        fieldOfStudyPlaceholder: "z. B. Logistik, Maschinenbau, ....",
        workExp: "Arbeitserfahrung",
        workExpPlaceholder: "z. B. 2 Jahre Kommissionierung/Lager, Gabelstaplerfahrer...",
        s3title: "3. Sprachkenntnisse",
        s3sub: "Wählen Sie Ihr Niveau für jede Sprache.",
        langGerman: "Deutsch",
        langEnglish: "Englisch",
        langOther: "Weitere Sprache(n)",
        levelSelect: "Bitte auswählen",
        levelNone: "....",
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
        licNone: "Kein Führerschein",
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
        s7sub: "PDF-Format, max. 10 MB.",
        uploadPrompt: "Klicken Sie, um Ihren Lebenslauf (PDF) hochzuladen",
        uploadHint: "oder hier ablegen",
        s8title: "8. Termin auswählen",
        s8sub: "Nur samstags — Datum wählen, dann eine Uhrzeit zwischen 11:00 und 20:00.",
        submitBtn: "Termin buchen",
        errRequired: "Bitte füllen Sie die markierten Felder aus und wählen Sie einen Termin.",
        errSlotTaken: "Dieser Termin wurde gerade vergeben. Bitte wählen Sie einen anderen.",
        errFileTooLarge: "Datei zu groß. Max. 10 MB.",
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
    };

    let currentLang: "en" | "de" = getSiteLang();
    const state = {
      langSkills: { german: "", english: "" } as Record<string, string>,
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
    const LANG_KEYS = ["german", "english"];
    const LEVELS = ["levelNone", "levelBasic", "levelIntermediate", "levelFluent", "levelNative"];
    const LEVEL_VALUES = ["none", "basic", "intermediate", "fluent", "native"];

    function t(key: string): string {
      const val = TR[currentLang][key] ?? TR.en[key];
      return typeof val === "string" ? val : key;
    }

    function applyTranslations() {
      document.documentElement.lang = currentLang;
      document.querySelectorAll(".lang-switch button").forEach((btn) => {
        btn.classList.toggle("active", btn.getAttribute("data-lang") === currentLang);
      });
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (key) el.textContent = t(key);
      });
      document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (key && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
          el.placeholder = t(key);
        }
      });
      const brandEl = document.querySelector(".brand-text");
      if (brandEl) {
        brandEl.innerHTML =
          t("brandName") + '<small data-i18n="brandSub">' + t("brandSub") + "</small>";
      }

      renderLangSkills();
      renderIndustryChips();
      renderLicenseChips();
      renderForkliftToggle();
      renderDateScroll();
      renderSlotGrid();
    }

    function isLangSkillValid(langKey: string): boolean {
      return !!state.langSkills[langKey]?.trim();
    }

    const MAX_CV_BYTES = 10 * 1024 * 1024;

    function renderLangSkills() {
      const wrap = document.getElementById("langSkillsWrap");
      if (!wrap) return;
      wrap.innerHTML = "";
      LANG_KEYS.forEach((langKey) => {
        const row = document.createElement("div");
        row.className = "lang-skill-row";
        const label = document.createElement("span");
        label.className = "req";
        label.textContent = t("lang" + langKey.charAt(0).toUpperCase() + langKey.slice(1));
        const select = document.createElement("select");
        select.id = `langLevel-${langKey}`;
        select.required = true;
        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = t("levelSelect");
        placeholder.selected = !state.langSkills[langKey];
        select.appendChild(placeholder);
        LEVELS.forEach((lvKey, i) => {
          const opt = document.createElement("option");
          opt.value = LEVEL_VALUES[i];
          opt.textContent = t(lvKey);
          select.appendChild(opt);
        });
        select.value = state.langSkills[langKey] || "";
        select.onchange = () => {
          state.langSkills[langKey] = select.value;
          clearFieldInvalid(select);
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
          document.getElementById("industryChips")?.classList.remove("field-invalid");
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
          document.getElementById("industryChips")?.classList.remove("field-invalid");
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
          document.getElementById("licenseChips")?.classList.remove("field-invalid");
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
          document.getElementById("forkliftToggle")?.classList.remove("field-invalid");
          renderForkliftToggle();
        };
      });
    }

    const UPCOMING_DATES = getUpcomingInterviewSaturdays();
    const TIME_SLOTS = buildInterviewTimeSlots();

    function renderDateScroll() {
      const wrap = document.getElementById("dateScroll");
      if (!wrap) return;
      wrap.innerHTML = "";
      const dow = TR[currentLang].dow as string[];
      const mon = TR[currentLang].mon as string[];
      const availableKeys = new Set(UPCOMING_DATES.map((d) => fmtDateKey(d)));
      if (state.selectedDate && !availableKeys.has(state.selectedDate)) {
        state.selectedDate = null;
        state.selectedTime = null;
      }
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
          wrap.classList.remove("field-invalid");
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
        p.style.color = "var(--steel)";
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
            wrap.classList.remove("field-invalid");
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
      if (file.size > MAX_CV_BYTES) {
        alert(t("errFileTooLarge"));
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
        const lang = btn.getAttribute("data-lang") || "de";
        if (lang !== "en" && lang !== "de") return;
        currentLang = lang;
        if (lang === "de" || lang === "en") {
          setSiteLang(lang);
        }
        document.querySelectorAll(".lang-switch button").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        applyTranslations();
      };
      btn.addEventListener("click", handler);
      langHandlers.push({ btn, handler });
    });

    function clearFieldInvalid(el: Element | null) {
      if (!el) return;
      el.classList.remove("field-invalid");
      const field = el.closest(".field");
      if (field && field !== el) field.classList.remove("field-invalid");
    }

    function clearAllInvalid() {
      document.querySelectorAll(".field-invalid").forEach((el) => el.classList.remove("field-invalid"));
    }

    function markInvalid(el: HTMLElement) {
      el.classList.add("field-invalid");
      const field = el.closest(".field");
      if (field && field !== el && !el.classList.contains("chip-group") && !el.classList.contains("toggle-pair")) {
        field.classList.add("field-invalid");
      }
    }

    function getScrollTarget(el: HTMLElement): HTMLElement {
      const langRow = el.closest(".lang-skill-row");
      if (langRow && el instanceof HTMLSelectElement) {
        return langRow as HTMLElement;
      }
      const field = el.closest(".field");
      if (
        field &&
        (el instanceof HTMLInputElement ||
          el instanceof HTMLSelectElement ||
          el instanceof HTMLTextAreaElement)
      ) {
        return field as HTMLElement;
      }
      return el;
    }

    function isFieldValid(id: string): boolean {
      const el = document.getElementById(id);
      if (!el) return false;
      if (el instanceof HTMLSelectElement) return !!el.value.trim();
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        return !!el.value.trim();
      }
      return false;
    }

    function validateRequiredFields(): HTMLElement | null {
      clearAllInvalid();
      const checks: Array<{ el: HTMLElement | null; valid: boolean }> = [
        { el: document.getElementById("lastName"), valid: isFieldValid("lastName") },
        { el: document.getElementById("firstName"), valid: isFieldValid("firstName") },
        { el: document.getElementById("birthDate"), valid: isFieldValid("birthDate") },
        { el: document.getElementById("phone"), valid: isFieldValid("phone") },
        { el: document.getElementById("email"), valid: isFieldValid("email") },
        { el: document.getElementById("fieldOfStudy"), valid: isFieldValid("fieldOfStudy") },
        { el: document.getElementById("workExp"), valid: isFieldValid("workExp") },
        ...LANG_KEYS.map((langKey) => ({
          el: document.getElementById(`langLevel-${langKey}`),
          valid: isLangSkillValid(langKey),
        })),
        { el: document.getElementById("industryChips"), valid: state.industries.size > 0 },
        { el: document.getElementById("licenseChips"), valid: state.licenses.size > 0 },
        { el: document.getElementById("forkliftToggle"), valid: state.forklift !== null },
        { el: document.getElementById("visaType"), valid: isFieldValid("visaType") },
        { el: document.getElementById("dateScroll"), valid: !!state.selectedDate },
        { el: document.getElementById("slotGrid"), valid: !!state.selectedTime },
      ];

      let firstInvalid: HTMLElement | null = null;
      checks.forEach(({ el, valid }) => {
        if (!el || valid) return;
        markInvalid(el);
        if (!firstInvalid) firstInvalid = getScrollTarget(el);
      });
      return firstInvalid;
    }

    const requiredFieldIds = [
      "lastName",
      "firstName",
      "birthDate",
      "phone",
      "email",
      "fieldOfStudy",
      "workExp",
      "visaType",
    ];
    const invalidClearHandlers: Array<{ el: Element; handler: () => void }> = [];
    requiredFieldIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const handler = () => {
        if (isFieldValid(id)) clearFieldInvalid(el);
      };
      el.addEventListener("input", handler);
      el.addEventListener("change", handler);
      invalidClearHandlers.push({ el, handler });
    });

    const bookingForm = document.getElementById("bookingForm");
    const onSubmit = async function (e: Event) {
      e.preventDefault();
      const errEl = document.getElementById("formError");
      if (errEl) errEl.textContent = "";

      const firstInvalid = validateRequiredFields();
      if (firstInvalid) {
        if (errEl) errEl.textContent = t("errRequired");
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      const lastName = (document.getElementById("lastName") as HTMLInputElement).value.trim();
      const firstName = (document.getElementById("firstName") as HTMLInputElement).value.trim();
      const email = (document.getElementById("email") as HTMLInputElement).value.trim();
      const phone = (document.getElementById("phone") as HTMLInputElement).value.trim();
      const birthDate = (document.getElementById("birthDate") as HTMLInputElement).value.trim();
      const visaType = (document.getElementById("visaType") as HTMLSelectElement).value;

      const form = e.target as HTMLFormElement;
      const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
      submitBtn.disabled = true;

      const interviewDate = state.selectedDate!;
      const interviewTime = state.selectedTime!;

      try {
        const res = await fetch("/api/submit?date=" + encodeURIComponent(interviewDate));
        if (res.ok) {
          const data = await res.json();
          if ((data.slots || []).includes(interviewTime)) {
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
        birthDate,
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
        interviewDate,
        interviewTime,
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
          interviewTime +
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
          list.innerHTML = '<p style="color:var(--steel);">No submissions yet.</p>';
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
            "<div>Date of birth: " +
            (s.birthDate || "—") +
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
        list.innerHTML = '<p style="color:var(--red);">Could not load submissions.</p>';
      }
    };
    adminToggle?.addEventListener("click", onAdminToggle);

    applyTranslations();

    return () => {
      cvFile?.removeEventListener("change", onCvChange);
      invalidClearHandlers.forEach(({ el, handler }) => {
        el.removeEventListener("input", handler);
        el.removeEventListener("change", handler);
      });
      bookingForm?.removeEventListener("submit", onSubmit);
      adminToggle?.removeEventListener("click", onAdminToggle);
      langHandlers.forEach(({ btn, handler }) => btn.removeEventListener("click", handler));
    };
  }, []);

  return (
    <>
      <header className="site-header">
        <nav className="wrap header-inner">
          <div className="logo">
            staffontime<span className="dot">.</span>
          </div>
          <div className="header-right">
            <div className="lang-switch">
              <button type="button" data-lang="en">
                EN
              </button>
              <button type="button" data-lang="de">
                DE
              </button>
            </div>
          </div>
        </nav>
      </header>

      <div className="bewerbung-page">
      <div id="formView">
        <div className="hero">
          <div className="wrap">
          <h1 data-i18n="heroTitle">Let&apos;s get you to work.</h1>
          <p className="lede" data-i18n="heroLede">
            Fill in your details, tell us where you&apos;d like to work, and pick a time for a short
            interview. We&apos;ll confirm and send you the address by email.
          </p>
          <div className="meta">
            <div>
              <strong data-i18n="metaTime">~2 minutes</strong>
              <span data-i18n="metaTimeLabel">to complete</span>
            </div>
            <div>
              <strong data-i18n="metaLang">EN / DE</strong>
              <span data-i18n="metaLangLabel">available languages</span>
            </div>
          </div>
          </div>
        </div>

        <main>
          <form id="bookingForm" noValidate>
            <div className="card">
              <h2 data-i18n="s1title">1. Your details</h2>
              <p className="step-sub" data-i18n="s1sub">
                So we know who we&apos;re meeting.
              </p>
              <div className="inner">
                <div className="row2">
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
                <div className="field">
                  <label className="req" data-i18n="birthDate">
                    Date of birth
                  </label>
                  <input type="date" id="birthDate" required />
                </div>
                <div className="row2 row2-contact">
                  <div className="field field-phone">
                    <label className="req" data-i18n="phone">
                      Phone number
                    </label>
                    <input type="tel" id="phone" required placeholder="+49 ..." />
                  </div>
                  <div className="field field-email">
                    <label className="req" data-i18n="email">
                      Email address
                    </label>
                    <input type="email" id="email" required />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 data-i18n="s2title">2. Background & experience</h2>
              <p className="step-sub" data-i18n="s2sub">
                Tell us about your qualification and work history.
              </p>
              <div className="inner">
                <div className="field">
                  <label className="req" data-i18n="fieldOfStudy">
                    Field of study / qualification
                  </label>
                  <input
                    type="text"
                    id="fieldOfStudy"
                    required
                    data-i18n-placeholder="fieldOfStudyPlaceholder"
                    placeholder="e.g. Logistics, Mechanical Engineering, ...."
                  />
                </div>
                <div className="field">
                  <label className="req" data-i18n="workExp">
                    Work experience
                  </label>
                  <textarea
                    id="workExp"
                    required
                    data-i18n-placeholder="workExpPlaceholder"
                    placeholder="e.g. 2 years warehouse picker/packer, forklift operator..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 data-i18n="s3title">3. Language skills</h2>
              <p className="step-sub" data-i18n="s3sub">
                Select your level for each language.
              </p>
              <div className="inner" id="langSkillsWrap"></div>
            </div>

            <div className="card">
              <h2 data-i18n="s4title">4. Where would you like to work?</h2>
              <p className="step-sub" data-i18n="s4sub">
                Select all that interest you.
              </p>
              <div className="inner">
                <div className="chip-group" id="industryChips"></div>
                <div style={{ marginTop: "10px" }}>
                  <span className="chip" id="selectAllIndustries" style={{ borderStyle: "dashed" }}></span>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 data-i18n="s5title">5. Licenses & certificates</h2>
              <p className="step-sub" data-i18n="s5sub">
                This helps us match you to the right jobs faster.
              </p>
              <div className="inner">
                <div className="field">
                  <label className="req" data-i18n="drivingLicense">
                    Driving license category
                  </label>
                  <div className="chip-group" id="licenseChips"></div>
                </div>
                <div className="field" style={{ marginTop: "18px" }}>
                  <label className="req" data-i18n="forklift">
                    Forklift license (Gabelstapler-Schein)
                  </label>
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
            </div>

            <div className="card">
              <h2 data-i18n="s6title">6. Visa / residence status</h2>
              <div className="inner">
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
            </div>

            <div className="card">
              <h2 data-i18n="s7title">7. Upload your CV</h2>
              <p className="step-sub" data-i18n="s7sub">
                PDF format, max 10 MB.
              </p>
              <div className="inner">
                <label className="upload-box" id="uploadBox">
                  <input type="file" id="cvFile" accept="application/pdf" />
                  <div data-i18n="uploadPrompt">Click to upload your CV (PDF)</div>
                  <div className="fname" id="cvFileName"></div>
                  <div className="hint" data-i18n="uploadHint">
                    or drag & drop here
                  </div>
                </label>
              </div>
            </div>

            <div className="card">
              <h2 data-i18n="s8title">8. Pick your interview slot</h2>
              <p className="step-sub" data-i18n="s8sub">
                Choose a date, then an available time.
              </p>
              <div className="inner cal-wrap">
                <div className="date-scroll" id="dateScroll"></div>
                <div className="slot-grid" id="slotGrid"></div>
              </div>
            </div>

            <div id="formError" className="error-msg"></div>
            <div className="submit-row">
              <button type="submit" className="btn-primary" data-i18n="submitBtn">
                Book my interview
              </button>
            </div>
          </form>
        </main>
      </div>

      <div id="confirmView" className="hidden">
        <div className="confirm-screen">
          <div className="check">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12.5L9.5 18L20 6.5"
                stroke="white"
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
          <div className="confirm-detail" id="confirmDetail"></div>
          <p style={{ fontSize: "13px", color: "var(--steel)" }} data-i18n="confirmFooter">
            Please check your inbox (and spam folder) in the next few days.
          </p>
        </div>
      </div>

      <footer className="bewerbung-recruiter-footer">
        <a id="adminToggle" data-i18n="adminLink">
          Recruiter view
        </a>
      </footer>

      <div id="adminPanel">
        <h2 data-i18n="adminTitle">All submissions</h2>
        <div id="adminList"></div>
      </div>
      </div>

      <footer className="site-footer">
        <div className="wrap">
          <div className="foot-legal-note">
            Prototyp — Lizenzantrag nach §1 AÜG eingereicht, Erteilung ausstehend.
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
              <h5>Rechtliches</h5>
              <Link href="/impressum">Impressum</Link>
              <a href="#">Datenschutz</a>
              <a href="#">AGB</a>
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
