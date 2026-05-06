"use client";

import { useState } from "react";
import { AvatarPlaceholder } from "./AvatarPlaceholder";
import { FormField } from "./FormField";
import { SectionCard } from "./SectionCard";

type MainTab = "chat" | "settings";
type SettingsTab = "price" | "personal";

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
  return (
    <SectionCard className="stack-lg">
      <div className="grid-two">
        <FormField
          label="Meno a priezvisko"
          name="personalName"
          placeholder="Marek Novak"
          defaultValue="Marek Novak"
        />
        <FormField
          label="Slug URL"
          name="personalSlug"
          placeholder="marek-novak"
          defaultValue="marek-novak"
        />
      </div>

      <FormField
        label="Bio"
        name="personalBio"
        placeholder="Pomaham ludom s fitness, treningom a stravou."
        defaultValue="Pomaham ludom s fitness, treningom a stravou."
        multiline
      />

      <div className="profile-photo-row">
        <AvatarPlaceholder label="MN" />
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
    </SectionCard>
  );
}
