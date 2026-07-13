"use client";

import { useEffect } from "react";
import { setSiteLang } from "@/lib/site-language";
import {
  buildInterviewTimeSlots,
  fmtDateKey,
  getUpcomingInterviewDates,
} from "@/lib/interview-slots";

export default function BewerbungPage() {
  useEffect(() => {
    const TR: Record<string, Record<string, string | string[]>> = {
        brandName: "staffontime",
        brandSub: "Staffing services Berlin",
        heroTitle: "Let's get you to work.",
        heroLede:
          "Enter your details, tell us where you would like to work, and book your interview online or in person.",
        metaTime: "~2 minutes",
        metaTimeLabel: "to complete",
        metaLang: "EN / DE",
        metaLangLabel: "available languages",
        s1title: "1. Your details",
        s1sub: "So we know who we are meeting.",
        lastName: "Last name",
        firstName: "First name",
        email: "Email address",
        phone: "Phone number",
        birthDate: "Date of birth",
        birthDay: "Day",
        birthMonth: "Month",
        birthYear: "Year",
        birthSelect: "Select…",
        birthHint: "Preselected to today's 18+ cut-off date. Adjust it if you were born earlier.",
        s2title: "2. Background & experience",
        s2sub: "Tell us about your qualifications and work history.",
        fieldOfStudy: "Field of study / qualification",
        fieldOfStudyPlaceholder: "e.g. logistics, mechanical engineering…",
        workExp: "Work experience",
        workExpPlaceholder: "e.g. 2 years warehouse picking/packing, forklift operator…",
        s3title: "3. Language skills",
        s3sub: "Select your level for each language.",
        langGerman: "German",
        langEnglish: "English",
        langOther: "Other language(s)",
        levelSelect: "Please select…",
        levelNone: "None",
        levelBasic: "Basic",
        levelIntermediate: "Intermediate",
        levelFluent: "Fluent",
        levelNative: "Native",
        otherLangPlaceholder: "e.g. Russian (fluent), Punjabi (basic)…",
        s4title: "4. Where would you like to work?",
        s4sub: "Select all that interest you.",
        s4field: "Industries",
        indWarehouse: "Warehouse / logistics",
        indProduction: "Production",
        indCleaning: "Cleaning & manufacturing",
        indGastro: "Hospitality / hotel",
        indDelivery: "Delivery",
        indConstruction: "Construction",
        indOther: "Other",
        selectAllOn: "+ Select all",
        selectAllOff: "✕ Clear all",
        s5title: "5. Licences & certificates",
        s5sub: "This helps us match you to the right roles more quickly.",
        drivingLicense: "Driving licence category",
        licNone: "None",
        forklift: "Forklift licence (Gabelstapler-Schein)",
        yes: "Yes",
        no: "No",
        s6title: "6. Visa / residence status",
        visaType: "Visa / residence permit type",
        visaSelect: "Please select…",
        visaEu: "EU / EEA citizen — no visa required",
        visaBlue: "EU Blue Card",
        visaResidence: "Residence permit with work authorisation",
        visaWork: "Work visa",
        visaStudent: "Student visa with work authorisation",
        visaNone: "None yet / need guidance",
        visaOther: "Other",
        s7title: "7. Upload your CV / application files",
        s7sub: "PDF format, max. 10 MB per file, up to 10 files.",
        s7optionalNote: "CV upload is optional.",
        uploadPrompt: "Upload your CV / PDF files",
        uploadHint: "PDF only, max. 10 MB per file",
        uploadBtn: "Choose files",
        uploadFilesLabel: "Uploaded files",
        uploadAddMore: "Add more files",
        uploadRemove: "Remove",
        uploadReading: "Reading file…",
        errFileType: "Please upload a PDF file.",
        errTooManyFiles: "You can upload up to 10 files.",
        errTotalFileTooLarge: "Total upload size exceeds 30 MB.",
        errFileNotReady:
          "This file is not fully available on your device yet. Open the Files app, wait until the download finishes, then try again.",
        s8title: "8. Schedule your interview",
        s8sub: "Choose online or in person, then pick a date and a 30-minute slot (Mon–Sat, 11:00–18:00).",
        interviewType: "Interview type",
        interviewTypeOnline: "Online interview",
        interviewTypeLive: "In-person interview",
        interviewTypeSelectHint: "Please choose online or in person.",
        interviewTypeOnlineHint: "We will email you the online meeting link.",
        interviewTypeLiveHint: "We will email you the interview address.",
        submitBtn: "Book interview",
        errRequired: "Please complete the highlighted fields and book an interview slot.",
        errSlotTaken: "Sorry, that slot has just been taken. Please choose another one.",
        errFileTooLarge: "File too large. Maximum 10 MB per file.",
        errGeneric: "Something went wrong. Please try again or contact us.",
        confirmTitleOnline: "Online interview scheduled!",
        confirmLedeOnline:
          "Thank you. Our team will email you the online meeting link before your interview.",
        confirmFooterOnline: "Please check your inbox (and spam folder) for the meeting link.",
        confirmTitleLive: "In-person interview scheduled!",
        confirmLedeLive: "Thank you. Our team will email you the interview address before your appointment.",
        confirmFooterLive: "Please check your inbox (and spam folder) for the address details.",
        confirmType: "Interview type",
        confirmName: "Name",
        confirmDate: "Interview date",
        confirmTime: "Interview time",
        dow: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        mon: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        noSlotsLine: "No date selected yet.",
        loadingSlots: "Loading available times…",
        noSlotsDay: "All times on this day are already booked. Please choose another date.",
        noDatesLine: "No interview dates are available right now.",
        minimalFooter: "© 2026 staffontime. All rights reserved.",
      },
      de: {
        brandName: "staffontime",
        brandSub: "Personaldienstleistung Berlin",
        heroTitle: "Auf geht's zur Arbeit.",
        heroLede:
          "Geben Sie Ihre Daten ein, teilen Sie uns mit, wo Sie arbeiten möchten, und planen Sie Ihr Gespräch online oder vor Ort.",
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
        birthDay: "Tag",
        birthMonth: "Monat",
        birthYear: "Jahr",
        birthSelect: "Bitte wählen…",
        birthHint:
          "Vorausgewählt ist das heutige Stichtagsdatum für 18+. Passen Sie es an, wenn Sie früher geboren sind.",
        s2title: "2. Ausbildung & Erfahrung",
        s2sub: "Erzählen Sie uns von Ihrer Qualifikation und Berufserfahrung.",
        fieldOfStudy: "Studiengang / Qualifikation",
        fieldOfStudyPlaceholder: "z. B. Logistik, Maschinenbau…",
        workExp: "Berufserfahrung",
        workExpPlaceholder: "z. B. 2 Jahre Kommissionierung/Lager, Gabelstaplerfahrer…",
        s3title: "3. Sprachkenntnisse",
        s3sub: "Wählen Sie Ihr Niveau für jede Sprache.",
        langGerman: "Deutsch",
        langEnglish: "Englisch",
        langOther: "Weitere Sprache(n)",
        levelSelect: "Bitte auswählen…",
        levelNone: "Keine",
        levelBasic: "Grundkenntnisse",
        levelIntermediate: "Mittelstufe",
        levelFluent: "Fließend",
        levelNative: "Muttersprache",
        otherLangPlaceholder: "z. B. Russisch (fließend), Punjabi (Grundkenntnisse)…",
        s4title: "4. Wo möchten Sie arbeiten?",
        s4sub: "Wählen Sie alles aus, was Sie interessiert.",
        s4field: "Branchen",
        indWarehouse: "Lager / Logistik",
        indProduction: "Produktion",
        indCleaning: "Reinigung & Fabrik",
        indGastro: "Gastronomie / Hotel",
        indDelivery: "Zustellung",
        indConstruction: "Bau",
        indOther: "Sonstiges",
        selectAllOn: "+ Alle auswählen",
        selectAllOff: "✕ Alle abwählen",
        s5title: "5. Führerscheine & Nachweise",
        s5sub: "Das hilft uns, Ihnen schneller passende Stellen zuzuordnen.",
        drivingLicense: "Führerscheinklasse",
        licNone: "Kein Führerschein",
        forklift: "Gabelstapler-Schein",
        yes: "Ja",
        no: "Nein",
        s6title: "6. Visum / Aufenthaltsstatus",
        visaType: "Art des Visums / Aufenthaltstitels",
        visaSelect: "Bitte auswählen…",
        visaEu: "EU-/EWR-Bürger – kein Visum nötig",
        visaBlue: "Blaue Karte EU",
        visaResidence: "Aufenthaltstitel mit Arbeitserlaubnis",
        visaWork: "Arbeitsvisum",
        visaStudent: "Studentenvisum mit Arbeitserlaubnis",
        visaNone: "Noch keines / brauche Beratung",
        visaOther: "Sonstiges",
        s7title: "7. Lebenslauf / Bewerbungsunterlagen hochladen",
        s7sub: "PDF-Format, max. 10 MB pro Datei, bis zu 10 Dateien.",
        s7optionalNote: "Der Upload des Lebenslaufs ist optional.",
        uploadPrompt: "Lebenslauf / PDF-Dateien hochladen",
        uploadHint: "Nur PDF, max. 10 MB pro Datei",
        uploadBtn: "Dateien auswählen",
        uploadFilesLabel: "Hochgeladene Dateien",
        uploadAddMore: "Weitere Dateien hinzufügen",
        uploadRemove: "Entfernen",
        uploadReading: "Datei wird gelesen…",
        errFileType: "Bitte laden Sie eine PDF-Datei hoch.",
        errTooManyFiles: "Sie können bis zu 10 Dateien hochladen.",
        errTotalFileTooLarge: "Die Gesamtgröße überschreitet 30 MB.",
        errFileNotReady:
          "Diese Datei ist auf Ihrem Gerät noch nicht vollständig verfügbar. Öffnen Sie die Dateien-App, warten Sie, bis der Download fertig ist, und versuchen Sie es erneut.",
        s8title: "8. Termin planen",
        s8sub:
          "Online oder vor Ort wählen, dann Datum und 30-Minuten-Termin festlegen (Mo–Sa, 11:00–18:00).",
        interviewType: "Terminart",
        interviewTypeOnline: "Online-Gespräch",
        interviewTypeLive: "Persönliches Gespräch (vor Ort)",
        interviewTypeSelectHint: "Bitte wählen Sie Online oder vor Ort.",
        interviewTypeOnlineHint: "Den Meeting-Link senden wir Ihnen per E-Mail.",
        interviewTypeLiveHint: "Die Adresse senden wir Ihnen per E-Mail.",
        submitBtn: "Termin buchen",
        errRequired: "Bitte füllen Sie die markierten Felder aus und buchen Sie einen Termin.",
        errSlotTaken: "Dieser Termin wurde gerade vergeben. Bitte wählen Sie einen anderen.",
        errFileTooLarge: "Datei zu groß. Max. 10 MB pro Datei.",
        errGeneric: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut oder kontaktieren Sie uns.",
        confirmTitleOnline: "Online-Gespräch geplant!",
        confirmLedeOnline:
          "Vielen Dank. Unser Team sendet Ihnen vor dem Termin den Link zum Online-Gespräch per E-Mail.",
        confirmFooterOnline: "Bitte prüfen Sie Ihr Postfach (auch den Spam-Ordner) auf den Meeting-Link.",
        confirmTitleLive: "Persönlicher Termin geplant!",
        confirmLedeLive: "Vielen Dank. Unser Team sendet Ihnen vor dem Termin die Adresse per E-Mail.",
        confirmFooterLive: "Bitte prüfen Sie Ihr Postfach (auch den Spam-Ordner) auf die Adresse.",
        confirmType: "Terminart",
        confirmName: "Name",
        confirmDate: "Termindatum",
        confirmTime: "Uhrzeit",
        dow: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
        mon: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
        noSlotsLine: "Noch kein Datum ausgewählt.",
        loadingSlots: "Verfügbare Zeiten werden geladen…",
        noSlotsDay: "An diesem Tag sind alle Termine bereits vergeben. Bitte wählen Sie ein anderes Datum.",
        noDatesLine: "Derzeit sind keine Termine verfügbar.",
        minimalFooter: "© 2026 staffontime. Alle Rechte vorbehalten.",
      },
    };

    let currentLang: "en" | "de" = "en";
    setSiteLang("en");
    const state = {
      langSkills: { german: "", english: "" } as Record<string, string>,
      otherLang: "",
      industries: new Set<string>(),
      licenses: new Set<string>(),
      forklift: null as string | null,
      cvFiles: [] as Array<{ id: string; name: string; base64: string | null; size: number }>,
      interviewType: null as "online" | "live" | null,
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
      renderInterviewTypeToggle();
      renderBirthDateSelects();
      renderDateScroll();
      void renderSlotGrid();
      updateCvUI();
    }

    function isLangSkillValid(langKey: string): boolean {
      return !!state.langSkills[langKey]?.trim();
    }

    function getBirthYearBounds() {
      const today = new Date();
      return {
        maxYear: today.getFullYear() - 18,
        minYear: today.getFullYear() - 100,
      };
    }

    function getAdultBirthDateParts() {
      const today = new Date();
      const adultDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      return {
        day: String(adultDate.getDate()),
        month: String(adultDate.getMonth() + 1),
        year: String(adultDate.getFullYear()),
      };
    }

    function daysInMonth(year: number, month: number): number {
      return new Date(year, month, 0).getDate();
    }

    function getBirthDateValue(): string {
      const dayEl = document.getElementById("birthDay") as HTMLSelectElement | null;
      const monthEl = document.getElementById("birthMonth") as HTMLSelectElement | null;
      const yearEl = document.getElementById("birthYear") as HTMLSelectElement | null;
      const day = dayEl?.value ?? "";
      const month = monthEl?.value ?? "";
      const year = yearEl?.value ?? "";
      if (!day || !month || !year) return "";
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    function isBirthDateValid(): boolean {
      const value = getBirthDateValue();
      if (!value) return false;
      const birthDate = new Date(`${value}T00:00:00`);
      if (Number.isNaN(birthDate.getTime())) return false;

      const today = new Date();
      const adultDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
      adultDate.setHours(0, 0, 0, 0);
      minDate.setHours(0, 0, 0, 0);
      birthDate.setHours(0, 0, 0, 0);

      return birthDate <= adultDate && birthDate >= minDate;
    }

    function updateBirthDayOptions(preferredDay?: string) {
      const dayEl = document.getElementById("birthDay") as HTMLSelectElement | null;
      const monthEl = document.getElementById("birthMonth") as HTMLSelectElement | null;
      const yearEl = document.getElementById("birthYear") as HTMLSelectElement | null;
      if (!dayEl || !monthEl || !yearEl) return;

      const year = Number(yearEl.value);
      const month = Number(monthEl.value);
      const selectedDay = preferredDay ?? dayEl.value;
      const maxDays = year && month ? daysInMonth(year, month) : 31;

      dayEl.innerHTML = "";
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = t("birthSelect");
      dayEl.appendChild(placeholder);

      for (let day = 1; day <= maxDays; day += 1) {
        const opt = document.createElement("option");
        opt.value = String(day);
        opt.textContent = String(day);
        dayEl.appendChild(opt);
      }

      if (selectedDay && Number(selectedDay) <= maxDays) {
        dayEl.value = selectedDay;
      } else {
        dayEl.value = "";
      }
    }

    function renderBirthDateSelects() {
      const dayEl = document.getElementById("birthDay") as HTMLSelectElement | null;
      const monthEl = document.getElementById("birthMonth") as HTMLSelectElement | null;
      const yearEl = document.getElementById("birthYear") as HTMLSelectElement | null;
      if (!dayEl || !monthEl || !yearEl) return;

      const { maxYear, minYear } = getBirthYearBounds();
      const monthNames = TR[currentLang].mon as string[];
      const defaultBirthDate = getAdultBirthDateParts();
      const selectedDay = dayEl.value || defaultBirthDate.day;
      const selectedMonth = monthEl.value || defaultBirthDate.month;
      const selectedYear = yearEl.value || defaultBirthDate.year;

      monthEl.innerHTML = "";
      const monthPlaceholder = document.createElement("option");
      monthPlaceholder.value = "";
      monthPlaceholder.textContent = t("birthSelect");
      monthEl.appendChild(monthPlaceholder);
      monthNames.forEach((label, index) => {
        const opt = document.createElement("option");
        const value = String(index + 1);
        opt.value = value;
        opt.textContent = label;
        monthEl.appendChild(opt);
      });
      if (selectedMonth) monthEl.value = selectedMonth;

      yearEl.innerHTML = "";
      const yearPlaceholder = document.createElement("option");
      yearPlaceholder.value = "";
      yearPlaceholder.textContent = t("birthSelect");
      yearEl.appendChild(yearPlaceholder);
      for (let year = maxYear; year >= minYear; year -= 1) {
        const opt = document.createElement("option");
        opt.value = String(year);
        opt.textContent = String(year);
        yearEl.appendChild(opt);
      }
      if (selectedYear) yearEl.value = selectedYear;

      updateBirthDayOptions(selectedDay);
    }

    function updateInterviewTypeHint() {
      const hintEl = document.getElementById("interviewTypeHint");
      if (!hintEl) return;
      if (state.interviewType === "online") {
        hintEl.textContent = t("interviewTypeOnlineHint");
      } else if (state.interviewType === "live") {
        hintEl.textContent = t("interviewTypeLiveHint");
      } else {
        hintEl.textContent = t("interviewTypeSelectHint");
      }
    }

    function renderInterviewTypeToggle() {
      const wrap = document.getElementById("interviewTypeToggle");
      if (!wrap) return;
      wrap.querySelectorAll("button").forEach((btn) => {
        const i18n = btn.getAttribute("data-i18n");
        if (i18n) btn.textContent = t(i18n);
        btn.classList.toggle("selected", state.interviewType === btn.getAttribute("data-val"));
        btn.onclick = () => {
          const value = btn.getAttribute("data-val");
          if (value !== "online" && value !== "live") return;
          state.interviewType = value;
          wrap.classList.remove("field-invalid");
          renderInterviewTypeToggle();
          updateInterviewTypeHint();
        };
      });
      updateInterviewTypeHint();
    }

    function interviewTypeLabel(type: "online" | "live"): string {
      return type === "online" ? t("interviewTypeOnline") : t("interviewTypeLive");
    }

    function showConfirmView(firstName: string, lastName: string, interviewTime: string) {
      const type = state.interviewType ?? "online";
      const confirmTitle = document.getElementById("confirmTitleHeading");
      const confirmLede = document.getElementById("confirmLede");
      const confirmFooter = document.getElementById("confirmFooter");
      if (confirmTitle) {
        confirmTitle.textContent = t(type === "online" ? "confirmTitleOnline" : "confirmTitleLive");
      }
      if (confirmLede) {
        confirmLede.textContent = t(type === "online" ? "confirmLedeOnline" : "confirmLedeLive");
      }
      if (confirmFooter) {
        confirmFooter.textContent = t(type === "online" ? "confirmFooterOnline" : "confirmFooterLive");
      }

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
          t("confirmType") +
          "</span><span>" +
          interviewTypeLabel(type) +
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
      document.getElementById("formView")?.classList.add("hidden");
      document.getElementById("confirmView")?.classList.remove("hidden");
      window.scrollTo(0, 0);
    }

    const MAX_CV_FILES = 10;
    const MAX_CV_BYTES = 10 * 1024 * 1024;
    const MAX_CV_TOTAL_BYTES = 30 * 1024 * 1024;

    function isPdfFile(file: File): boolean {
      const name = file.name.toLowerCase();
      if (!name.endsWith(".pdf")) return false;
      if (!file.type || file.type === "application/pdf" || file.type === "application/octet-stream") {
        return true;
      }
      return file.type.endsWith("/pdf");
    }

    function getCvTotalBytes(): number {
      return state.cvFiles.reduce((sum, file) => sum + file.size, 0);
    }

    function isCvUploadValid(): boolean {
      if (state.cvFiles.length === 0) return true;
      return state.cvFiles.every((file) => !!file.base64);
    }

    function updateCvUI() {
      const uploadBox = document.getElementById("uploadBox");
      const uploadEmpty = document.getElementById("uploadEmpty");
      const uploadSelected = document.getElementById("uploadSelected");
      const cvFileList = document.getElementById("cvFileList");
      const hasFiles = state.cvFiles.length > 0;

      if (cvFileList) {
        cvFileList.innerHTML = "";
        state.cvFiles.forEach((file) => {
          const item = document.createElement("li");
          item.className = "upload-file-item";

          const badge = document.createElement("span");
          badge.className = "upload-file-badge";
          badge.textContent = "PDF";

          const meta = document.createElement("div");
          meta.className = "upload-file-item-meta";

          const name = document.createElement("div");
          name.className = "fname";
          name.textContent = file.name;

          const status = document.createElement("div");
          status.className = "upload-file-status";
          status.textContent = file.base64 ? "" : t("uploadReading");

          meta.appendChild(name);
          meta.appendChild(status);

          const removeBtn = document.createElement("button");
          removeBtn.type = "button";
          removeBtn.className = "upload-action-btn upload-remove-btn";
          removeBtn.textContent = t("uploadRemove");
          removeBtn.onclick = () => removeCvFile(file.id);

          item.appendChild(badge);
          item.appendChild(meta);
          item.appendChild(removeBtn);
          cvFileList.appendChild(item);
        });
      }

      uploadEmpty?.classList.toggle("hidden", hasFiles);
      uploadSelected?.classList.toggle("hidden", !hasFiles);
      uploadBox?.classList.toggle("has-file", state.cvFiles.length > 0 && isCvUploadValid());
      if (isCvUploadValid()) uploadBox?.classList.remove("field-invalid");
    }

    function removeCvFile(fileId: string) {
      state.cvFiles = state.cvFiles.filter((file) => file.id !== fileId);
      updateCvUI();
    }

    function addCvFile(file: File) {
      if (state.cvFiles.length >= MAX_CV_FILES) {
        alert(t("errTooManyFiles"));
        return;
      }
      if (!isPdfFile(file)) {
        alert(t("errFileType"));
        return;
      }
      if (file.size === 0) {
        alert(t("errFileNotReady"));
        return;
      }
      if (file.size > MAX_CV_BYTES) {
        alert(t("errFileTooLarge"));
        return;
      }
      if (getCvTotalBytes() + file.size > MAX_CV_TOTAL_BYTES) {
        alert(t("errTotalFileTooLarge"));
        return;
      }

      const entry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name || "document.pdf",
        base64: null as string | null,
        size: file.size,
      };
      state.cvFiles.push(entry);
      updateCvUI();

      const reader = new FileReader();
      reader.onload = function () {
        entry.base64 = reader.result as string;
        updateCvUI();
      };
      reader.onerror = function () {
        alert(t("errGeneric"));
        removeCvFile(entry.id);
      };
      reader.readAsDataURL(file);
    }

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

    const UPCOMING_DATES = getUpcomingInterviewDates();
    const TIME_SLOTS = buildInterviewTimeSlots();
    let bookedByDate: Record<string, Set<string>> = {};
    let availabilityLoaded = false;

    async function refreshBookedSlots() {
      try {
        const res = await fetch("/api/submit?availability=1");
        if (!res.ok) return;
        const data = (await res.json()) as { byDate?: Record<string, string[]> };
        bookedByDate = {};
        for (const [dateKey, times] of Object.entries(data.byDate ?? {})) {
          bookedByDate[dateKey] = new Set(times);
        }
        availabilityLoaded = true;
      } catch {
        /* keep previous availability */
      }
    }

    function availableTimesForDate(dateKey: string): string[] {
      const booked = bookedByDate[dateKey] ?? new Set<string>();
      return TIME_SLOTS.filter((time) => !booked.has(time));
    }

    function dateHasAvailability(dateKey: string): boolean {
      return availableTimesForDate(dateKey).length > 0;
    }

    async function refreshSchedule() {
      await refreshBookedSlots();
      renderDateScroll();
      await renderSlotGrid();
    }

    function renderDateScroll() {
      const wrap = document.getElementById("dateScroll");
      if (!wrap) return;
      wrap.innerHTML = "";
      const dow = TR[currentLang].dow as string[];
      const mon = TR[currentLang].mon as string[];
      const availableDates = UPCOMING_DATES.filter((d) => dateHasAvailability(fmtDateKey(d)));

      if (state.selectedDate && !dateHasAvailability(state.selectedDate)) {
        state.selectedDate = null;
        state.selectedTime = null;
      }

      if (availableDates.length === 0) {
        const p = document.createElement("div");
        p.style.color = "var(--steel)";
        p.style.fontSize = "13px";
        p.textContent = t("noDatesLine");
        wrap.appendChild(p);
        return;
      }

      availableDates.forEach((d) => {
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
          void renderSlotGrid();
        };
        wrap.appendChild(pill);
      });
    }

    async function renderSlotGrid() {
      const wrap = document.getElementById("slotGrid");
      if (!wrap) return;
      wrap.innerHTML = "";
      if (!availabilityLoaded) {
        const p = document.createElement("div");
        p.style.color = "var(--steel)";
        p.style.fontSize = "13px";
        p.textContent = t("loadingSlots");
        wrap.appendChild(p);
        return;
      }
      if (!state.selectedDate) {
        const p = document.createElement("div");
        p.style.color = "var(--steel)";
        p.style.fontSize = "13px";
        p.textContent = t("noSlotsLine");
        wrap.appendChild(p);
        return;
      }

      const availableTimes = availableTimesForDate(state.selectedDate);
      if (state.selectedTime && !availableTimes.includes(state.selectedTime)) {
        state.selectedTime = null;
      }

      if (availableTimes.length === 0) {
        const p = document.createElement("div");
        p.style.color = "var(--steel)";
        p.style.fontSize = "13px";
        p.textContent = t("noSlotsDay");
        wrap.appendChild(p);
        return;
      }

      availableTimes.forEach((time) => {
        const btn = document.createElement("div");
        btn.className = "slot-btn" + (state.selectedTime === time ? " selected" : "");
        btn.textContent = time;
        btn.onclick = () => {
          state.selectedTime = time;
          wrap.classList.remove("field-invalid");
          renderSlotGrid();
        };
        wrap.appendChild(btn);
      });
    }

    const cvFile = document.getElementById("cvFile") as HTMLInputElement | null;
    const birthDayEl = document.getElementById("birthDay");
    const birthMonthEl = document.getElementById("birthMonth");
    const birthYearEl = document.getElementById("birthYear");
    const birthDateField = document.getElementById("birthDateField");

    const onBirthDateChange = () => {
      updateBirthDayOptions();
      if (isBirthDateValid() && birthDateField) clearFieldInvalid(birthDateField);
    };
    birthDayEl?.addEventListener("change", onBirthDateChange);
    birthMonthEl?.addEventListener("change", onBirthDateChange);
    birthYearEl?.addEventListener("change", onBirthDateChange);

    const onCvChange = function (e: Event) {
      const target = e.target as HTMLInputElement;
      const files = Array.from(target.files ?? []);
      target.value = "";
      files.forEach((file) => addCvFile(file));
    };
    cvFile?.addEventListener("change", onCvChange);
    cvFile?.addEventListener("input", onCvChange);

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
      if (el.classList.contains("chip-group") || el.classList.contains("toggle-pair")) {
        const field = el.closest(".field");
        if (field) return field as HTMLElement;
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
        { el: document.getElementById("birthDateField"), valid: isBirthDateValid() },
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
        { el: document.getElementById("interviewTypeToggle"), valid: !!state.interviewType },
        { el: document.getElementById("uploadBox"), valid: isCvUploadValid() },
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
      const birthDate = getBirthDateValue();
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
            state.selectedTime = null;
            await refreshSchedule();
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
        cvFiles: state.cvFiles
          .filter((file) => file.base64)
          .map((file) => ({ name: file.name, base64: file.base64 })),
        interviewDate,
        interviewTime,
        interviewType: state.interviewType,
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
          state.selectedTime = null;
          await refreshSchedule();
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

      showConfirmView(firstName, lastName, interviewTime);
    };
    bookingForm?.addEventListener("submit", onSubmit);

    renderBirthDateSelects();
    void refreshSchedule();
    applyTranslations();

    return () => {
      birthDayEl?.removeEventListener("change", onBirthDateChange);
      birthMonthEl?.removeEventListener("change", onBirthDateChange);
      birthYearEl?.removeEventListener("change", onBirthDateChange);
      cvFile?.removeEventListener("change", onCvChange);
      cvFile?.removeEventListener("input", onCvChange);
      invalidClearHandlers.forEach(({ el, handler }) => {
        el.removeEventListener("input", handler);
        el.removeEventListener("change", handler);
      });
      bookingForm?.removeEventListener("submit", onSubmit);
      langHandlers.forEach(({ btn, handler }) => btn.removeEventListener("click", handler));
    };
  }, []);

  return (
    <>
      <header className="site-header">
        <nav className="wrap header-inner">
          <span className="logo logo-static">
            staffontime<span className="dot">.</span>
          </span>
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
            Fill in your details, tell us where you&apos;d like to work, and schedule your interview
            online or in person.
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
                <div className="field" id="birthDateField">
                  <label className="req" data-i18n="birthDate">
                    Date of birth
                  </label>
                  <div className="birth-date-row">
                    <select id="birthDay" className="birth-date-part" aria-label="Day" required>
                      <option value="">{/* filled by JS */}</option>
                    </select>
                    <select id="birthMonth" className="birth-date-part" aria-label="Month" required>
                      <option value="">{/* filled by JS */}</option>
                    </select>
                    <select id="birthYear" className="birth-date-part" aria-label="Year" required>
                      <option value="">{/* filled by JS */}</option>
                    </select>
                  </div>
                  <p className="birth-date-hint" data-i18n="birthHint">
                    Preselected to today&apos;s 18+ cutoff date. Adjust it if you were born earlier.
                  </p>
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
                <div className="field">
                  <label className="req" data-i18n="s4field">
                    Industries
                  </label>
                  <div className="chip-group" id="industryChips"></div>
                </div>
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
              <h2 className="step-title-with-badge">
                <span data-i18n="s7title">7. Upload your CV / application files</span>
                <span className="upload-optional-badge">Optional</span>
              </h2>
              <p className="upload-optional-note" data-i18n="s7optionalNote">
                CV upload is optional.
              </p>
              <p className="step-sub" data-i18n="s7sub">
                PDF format, max 10 MB per file, up to 10 files.
              </p>
              <div className="inner">
                <div className="upload-box" id="uploadBox">
                  <input
                    type="file"
                    id="cvFile"
                    className="upload-input"
                    accept=".pdf,application/pdf"
                    multiple
                  />
                  <div className="upload-empty" id="uploadEmpty">
                    <label htmlFor="cvFile" className="upload-empty-hit">
                      <div className="upload-prompt" data-i18n="uploadPrompt">
                        Upload your CV / PDF files
                      </div>
                      <div className="hint" data-i18n="uploadHint">
                        PDF only, max 10 MB per file
                      </div>
                      <span className="upload-trigger-btn" data-i18n="uploadBtn">
                        Choose files
                      </span>
                    </label>
                  </div>
                  <div className="upload-selected hidden" id="uploadSelected">
                    <div className="upload-files-title" data-i18n="uploadFilesLabel">
                      Uploaded files
                    </div>
                    <ul className="upload-file-list" id="cvFileList"></ul>
                    <div className="upload-file-actions">
                      <label htmlFor="cvFile" className="upload-action-btn" data-i18n="uploadAddMore">
                        Add more files
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 data-i18n="s8title">8. Schedule your interview</h2>
              <p className="step-sub" data-i18n="s8sub">
                Choose online or in person, then pick a date and 30-minute slot (Mon-Sat, 11:00–18:00).
              </p>
              <div className="inner cal-wrap">
                <div className="field">
                  <label className="req" data-i18n="interviewType">
                    Interview type
                  </label>
                  <div className="toggle-pair" id="interviewTypeToggle">
                    <button type="button" data-val="online" data-i18n="interviewTypeOnline">
                      Online interview
                    </button>
                    <button type="button" data-val="live" data-i18n="interviewTypeLive">
                      Live interview (in person)
                    </button>
                  </div>
                  <p className="interview-type-hint" id="interviewTypeHint" data-i18n="interviewTypeSelectHint">
                    Please choose online or live.
                  </p>
                </div>
                <div className="date-scroll" id="dateScroll"></div>
                <div className="slot-grid" id="slotGrid"></div>
              </div>
            </div>

            <div id="formError" className="error-msg"></div>
            <div className="submit-row">
              <button type="submit" className="btn-primary" data-i18n="submitBtn">
                Book interview
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
          <h1 id="confirmTitleHeading">Interview scheduled!</h1>
          <p id="confirmLede">Thank you.</p>
          <div className="confirm-detail" id="confirmDetail"></div>
          <p style={{ fontSize: "13px", color: "var(--steel)" }} id="confirmFooter">
            Please check your inbox.
          </p>
        </div>
      </div>

      <footer className="bewerbung-minimal-footer">
        <p data-i18n="minimalFooter">© 2026 staffontime. Alle Rechte vorbehalten.</p>
      </footer>
      </div>
    </>
  );
}
