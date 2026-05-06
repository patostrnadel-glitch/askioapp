"use client";

import { FormEvent, useState } from "react";
import { AvatarPlaceholder } from "./AvatarPlaceholder";
import { FormField } from "./FormField";
import { SectionCard } from "./SectionCard";

type MainTab = "chat" | "settings";
type SettingsTab = "price" | "personal";
const PUBLIC_PROFILE_BASE_URL = "https://askioapp.vercel.app";

export function CreatorAdminDashboard() {
  const [mainTab, setMainTab] = useState<MainTab>("chat");
  const [settingsTab, setSettingsTab] = useState<SettingsTab>("price");

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="stack-sm">
          <p className="eyebrow">Tvorca admin</p>
          <h2 className="sidebar-title">Askly Studio</h2>
          <p className="muted-text">
            Jednoduche miesto pre spravu otazok a verejneho profilu.
          </p>
        </div>

        <nav className="tab-group" aria-label="Hlavna navigacia">
          <button
            className={mainTab === "chat" ? "tab active" : "tab"}
            onClick={() => setMainTab("chat")}
            type="button"
          >
            Chat
          </button>
          <button
            className={mainTab === "settings" ? "tab active" : "tab"}
            onClick={() => setMainTab("settings")}
            type="button"
          >
            Nastavenia
          </button>
        </nav>
      </aside>

      <div className="dashboard-content">
        {mainTab === "chat" ? <ChatPanel /> : <SettingsPanel
          settingsTab={settingsTab}
          setSettingsTab={setSettingsTab}
        />}
      </div>
    </div>
  );
}

function ChatPanel() {
  return (
    <SectionCard className="stack-lg">
      <div className="stack-xs">
        <p className="eyebrow">Chat</p>
        <h3>Zatial nemas ziadne otazky.</h3>
        <p className="muted-text">
          Ked niekto posle svoju prvu platenu otazku, zobrazi sa prave tu.
        </p>
      </div>

      <div className="empty-state">
        <div className="empty-icon">?</div>
        <div className="stack-xs">
          <strong>Inbox je prazdny</strong>
          <p className="muted-text">
            Toto je placeholder karta pre buduci chat a odpovede.
          </p>
        </div>
      </div>
    </SectionCard>
  );
}

type SettingsPanelProps = {
  settingsTab: SettingsTab;
  setSettingsTab: (tab: SettingsTab) => void;
};

function SettingsPanel({ settingsTab, setSettingsTab }: SettingsPanelProps) {
  return (
    <div className="stack-lg">
      <SectionCard className="stack-md">
        <div className="stack-xs">
          <p className="eyebrow">Nastavenia</p>
          <h3>Sprav svoj profil tvorcu</h3>
        </div>

        <div className="subtab-group" aria-label="Podzalozky nastaveni">
          <button
            className={settingsTab === "price" ? "subtab active" : "subtab"}
            onClick={() => setSettingsTab("price")}
            type="button"
          >
            Cena spravy
          </button>
          <button
            className={settingsTab === "personal" ? "subtab active" : "subtab"}
            onClick={() => setSettingsTab("personal")}
            type="button"
          >
            Osobne udaje
          </button>
        </div>
      </SectionCard>

      {settingsTab === "price" ? <PriceSettings /> : <PersonalSettings />}
    </div>
  );
}

function PriceSettings() {
  return (
    <SectionCard className="stack-md">
      <div className="stack-xs">
        <h4>Cena spravy</h4>
        <p className="muted-text">
          Tato cena sa zobrazi navstevnikom na tvojom profile.
        </p>
      </div>
      <div className="price-input-row">
        <input className="field-input price-input" defaultValue="5" type="number" />
        <span className="price-badge">EUR</span>
      </div>
    </SectionCard>
  );
}

function PersonalSettings() {
  const [fullName, setFullName] = useState("Marek Novak");
  const [email, setEmail] = useState("marek@novak.sk");
  const [slug, setSlug] = useState("marek-novak");
  const [bio, setBio] = useState("Pomaham ludom s fitness, treningom a stravou.");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const normalizedSlug =
    slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "tvoj-slug";
  const profileUrl = `${PUBLIC_PROFILE_BASE_URL}/${normalizedSlug}`;
  const initials = fullName
    .split(" ")
    .filter((part) => Boolean(part))
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedbackMessage("Nastavenia su pripravene na ulozenie. Dalsi krok je napojenie na databazu.");
  };

  const handleCopyProfileUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setFeedbackMessage("Finalna URL profilu bola skopirovana.");
    } catch (error) {
      console.error(error);
      setFeedbackMessage("Kopirovanie URL zlyhalo. Skus to este raz.");
    }
  };

  return (
    <SectionCard className="stack-lg">
      <form className="stack-lg" onSubmit={handleSave}>
        <div className="settings-link-preview">
          <div className="stack-xs">
            <p className="eyebrow">Link tvojho profilu</p>
            <strong className="profile-url-preview">{profileUrl}</strong>
            <p className="muted-text">
              Takto bude vyzerat finalna verejna URL tvojho profilu.
            </p>
          </div>
          <button
            className="secondary-button"
            onClick={handleCopyProfileUrl}
            type="button"
          >
            Kopirovat
          </button>
        </div>

        {feedbackMessage ? (
          <p className="feedback-message feedback-success">{feedbackMessage}</p>
        ) : null}

        <div className="grid-two">
          <label className="field">
            <span className="field-label">Meno a priezvisko</span>
            <input
              className="field-input"
              name="personalName"
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Marek Novak"
              type="text"
              value={fullName}
            />
          </label>
          <label className="field">
            <span className="field-label">Pouzivatelske meno (URL)</span>
            <input
              className="field-input"
              name="personalSlug"
              onChange={(event) => setSlug(event.target.value)}
              placeholder="marek-novak"
              type="text"
              value={slug}
            />
            <span className="helper-text">
              Finalna URL: {PUBLIC_PROFILE_BASE_URL}/{normalizedSlug}
            </span>
          </label>
        </div>

        <div className="grid-two">
          <label className="field">
            <span className="field-label">Email</span>
            <input
              autoComplete="email"
              className="field-input"
              name="personalEmail"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="marek@novak.sk"
              type="email"
              value={email}
            />
            <span className="helper-text">
              Tento email vies zobrazit len v administracii alebo pouzit na notifikacie.
            </span>
          </label>
          <div className="field">
            <span className="field-label">Stav profilu</span>
            <div className="status-pill settings-status-pill">Pripraveny na publikovanie</div>
            <span className="helper-text">
              Po ulozeni budes mat profil dostupny na verejnej URL.
            </span>
          </div>
        </div>

        <label className="field">
          <span className="field-label">Bio</span>
          <textarea
            className="field-input field-textarea"
            name="personalBio"
            onChange={(event) => setBio(event.target.value)}
            placeholder="Pomaham ludom s fitness, treningom a stravou."
            rows={5}
            value={bio}
          />
          <span className="helper-text">
            Strucne vysvetli, s cim ludom pomahas a preco sa ta oplati opytat.
          </span>
        </label>

        <div className="profile-photo-row">
          <AvatarPlaceholder label={initials || "MN"} />
          <div className="stack-xs">
            <strong>Profilova fotka</strong>
            <p className="muted-text">
              Placeholder pre buduci upload a upravu profilovej fotografie.
            </p>
          </div>
          <button className="secondary-button" type="button">
            Zmenit fotku
          </button>
        </div>

        <div className="settings-actions">
          <button className="primary-button" type="submit">
            Ulozit
          </button>
        </div>
      </form>
    </SectionCard>
  );
}
