"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AvatarPlaceholder } from "./AvatarPlaceholder";
import { SectionCard } from "./SectionCard";
import { getSupabaseClient } from "@/src/lib/supabase";

type MainTab = "chat" | "settings";
type SettingsTab = "price" | "personal";
const PUBLIC_PROFILE_BASE_URL = "https://askioapp.vercel.app";

export type CreatorAdminRecord = {
  id: string | number;
  full_name: string;
  email: string | null;
  slug: string;
  bio: string | null;
  price_cents: number;
  avatar_url: string | null;
};

type CreatorAdminDashboardProps = {
  initialCreator: CreatorAdminRecord | null;
  initialErrorMessage?: string;
  requestedSlug: string;
};

export function CreatorAdminDashboard({
  initialCreator,
  initialErrorMessage = "",
  requestedSlug,
}: CreatorAdminDashboardProps) {
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
        {mainTab === "chat" ? (
          <ChatPanel />
        ) : (
          <SettingsPanel
            initialCreator={initialCreator}
            initialErrorMessage={initialErrorMessage}
            requestedSlug={requestedSlug}
            settingsTab={settingsTab}
            setSettingsTab={setSettingsTab}
          />
        )}
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
  initialCreator: CreatorAdminRecord | null;
  initialErrorMessage: string;
  requestedSlug: string;
  settingsTab: SettingsTab;
  setSettingsTab: (tab: SettingsTab) => void;
};

function SettingsPanel({
  initialCreator,
  initialErrorMessage,
  requestedSlug,
  settingsTab,
  setSettingsTab,
}: SettingsPanelProps) {
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

      {settingsTab === "price" ? (
        <PriceSettings initialPriceCents={initialCreator?.price_cents ?? 500} />
      ) : (
        <PersonalSettings
          initialCreator={initialCreator}
          initialErrorMessage={initialErrorMessage}
          requestedSlug={requestedSlug}
        />
      )}
    </div>
  );
}

type PriceSettingsProps = {
  initialPriceCents: number;
};

function PriceSettings({ initialPriceCents }: PriceSettingsProps) {
  const defaultPriceValue = Number.isFinite(initialPriceCents)
    ? (initialPriceCents / 100).toFixed(2)
    : "5.00";

  return (
    <SectionCard className="stack-md">
      <div className="stack-xs">
        <h4>Cena spravy</h4>
        <p className="muted-text">
          Tato cena sa zobrazi navstevnikom na tvojom profile.
        </p>
      </div>
      <div className="price-input-row">
        <input
          className="field-input price-input"
          defaultValue={defaultPriceValue}
          type="number"
        />
        <span className="price-badge">EUR</span>
      </div>
    </SectionCard>
  );
}

type PersonalSettingsProps = {
  initialCreator: CreatorAdminRecord | null;
  initialErrorMessage: string;
  requestedSlug: string;
};

const AVATAR_BUCKET = "creator-avatars";
const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;

function PersonalSettings({
  initialCreator,
  initialErrorMessage,
  requestedSlug,
}: PersonalSettingsProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialCreator?.full_name ?? "Marek Novak");
  const [email, setEmail] = useState(initialCreator?.email ?? "marek@novak.sk");
  const [slug, setSlug] = useState(initialCreator?.slug ?? requestedSlug);
  const [bio, setBio] = useState(
    initialCreator?.bio ?? "Pomaham ludom s fitness, treningom a stravou."
  );
  const [avatarUrl, setAvatarUrl] = useState(initialCreator?.avatar_url ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(initialErrorMessage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const normalizedSlug =
    slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "tvoj-slug";
  const normalizedEmail = email.trim().toLowerCase();
  const profileUrl = `${PUBLIC_PROFILE_BASE_URL}/${normalizedSlug}`;
  const initials = fullName
    .split(" ")
    .filter((part) => Boolean(part))
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const creatorId = initialCreator?.id ?? null;

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!creatorId) {
      setErrorMessage(
        `Profil pre slug "${requestedSlug}" sa nenasiel, preto nie je co ulozit.`
      );
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage("Meno a priezvisko je povinne.");
      return;
    }

    if (!emailPattern.test(normalizedEmail)) {
      setErrorMessage("Zadaj platny email.");
      return;
    }

    if (!normalizedSlug) {
      setErrorMessage("Pouzivatelske meno URL je povinne.");
      return;
    }

    setIsSaving(true);

    try {
      const supabase = getSupabaseClient();
      const { data: existingCreator, error: existingCreatorError } = await supabase
        .from("creators")
        .select("id")
        .eq("slug", normalizedSlug)
        .neq("id", creatorId)
        .maybeSingle();

      if (existingCreatorError) {
        throw existingCreatorError;
      }

      if (existingCreator) {
        setErrorMessage("Tento slug je uz obsadeny.");
        return;
      }

      const { data: existingEmail, error: existingEmailError } = await supabase
        .from("creators")
        .select("id")
        .eq("email", normalizedEmail)
        .neq("id", creatorId)
        .maybeSingle();

      if (existingEmailError) {
        throw existingEmailError;
      }

      if (existingEmail) {
        setErrorMessage("Tento email je uz obsadeny.");
        return;
      }

      const { error } = await supabase
        .from("creators")
        .update({
          full_name: fullName.trim(),
          email: normalizedEmail,
          slug: normalizedSlug,
          bio: bio.trim(),
        })
        .eq("id", creatorId);

      if (error) {
        if (error.code === "23505") {
          setErrorMessage("Tento slug alebo email je uz obsadeny.");
          return;
        }

        if (error.code === "42501" || error.message.toLowerCase().includes("row-level security")) {
          setErrorMessage("Supabase blokuje update. Treba doplnit UPDATE policy pre tabulku creators.");
          return;
        }

        throw error;
      }

      setSuccessMessage("Nastavenia boli ulozene.");
      router.replace(`/tvorca-admin?slug=${normalizedSlug}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMessage("Nepodarilo sa ulozit nastavenia profilu. Skus to znova.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyProfileUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setSuccessMessage("Finalna URL profilu bola skopirovana.");
      setErrorMessage("");
    } catch (error) {
      console.error(error);
      setErrorMessage("Kopirovanie URL zlyhalo. Skus to este raz.");
    }
  };

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    event.target.value = "";

    if (!selectedFile) {
      return;
    }

    setSuccessMessage("");
    setErrorMessage("");

    if (!creatorId) {
      setErrorMessage("Profil sa najprv musi vytvorit, az potom vies nahrat fotku.");
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setErrorMessage("Nahraj prosim obrazok vo formate JPG, PNG, WEBP alebo GIF.");
      return;
    }

    if (selectedFile.size > MAX_AVATAR_SIZE_BYTES) {
      setErrorMessage("Profilova fotka moze mat maximalne 5 MB.");
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const supabase = getSupabaseClient();
      const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeExtension = /^[a-z0-9]+$/.test(fileExtension) ? fileExtension : "jpg";
      const filePath = `${creatorId}/${Date.now()}-${normalizedSlug}.${safeExtension}`;

      const { error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        const uploadMessage = uploadError.message.toLowerCase();

        if (uploadMessage.includes("bucket") || uploadMessage.includes("not found")) {
          setErrorMessage(
            `V Supabase chyba storage bucket "${AVATAR_BUCKET}". Najprv ho treba vytvorit.`
          );
          return;
        }

        if (
          uploadError.message.toLowerCase().includes("row-level security") ||
          uploadError.message.toLowerCase().includes("permission")
        ) {
          setErrorMessage(
            "Supabase blokuje upload fotky. Treba doplnit storage policies pre avatar bucket."
          );
          return;
        }

        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("creators")
        .update({ avatar_url: publicUrl })
        .eq("id", creatorId);

      if (updateError) {
        if (
          updateError.code === "42501" ||
          updateError.message.toLowerCase().includes("row-level security")
        ) {
          setErrorMessage(
            "Fotka sa nahrala, ale databaza blokuje ulozenie avatar_url. Treba doplnit UPDATE policy pre creators."
          );
          return;
        }

        throw updateError;
      }

      setAvatarUrl(publicUrl);
      setSuccessMessage("Profilova fotka bola uspesne nahrata.");
      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMessage("Nepodarilo sa nahrat profilovu fotku. Skus to znova.");
    } finally {
      setIsUploadingAvatar(false);
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

        {successMessage ? (
          <p className="feedback-message feedback-success">{successMessage}</p>
        ) : null}
        {errorMessage ? (
          <p className="feedback-message feedback-error">{errorMessage}</p>
        ) : null}

        <div className="grid-two">
          <label className="field">
            <span className="field-label">Meno a priezvisko</span>
            <input
              className="field-input"
              disabled={isSaving}
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
              disabled={isSaving}
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
              disabled={isSaving}
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
            disabled={isSaving}
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
          <AvatarPlaceholder imageUrl={avatarUrl} label={initials || "MN"} />
          <div className="stack-xs">
            <strong>Profilova fotka</strong>
            <p className="muted-text">
              Nahraj JPG, PNG, WEBP alebo GIF do velkosti 5 MB.
            </p>
          </div>
          <input
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="profile-photo-input"
            disabled={isUploadingAvatar || isSaving}
            onChange={handleAvatarChange}
            ref={fileInputRef}
            type="file"
          />
          <button
            className="secondary-button"
            disabled={isUploadingAvatar || isSaving}
            onClick={handleAvatarButtonClick}
            type="button"
          >
            {isUploadingAvatar ? "Nahravam..." : "Zmenit fotku"}
          </button>
        </div>

        <div className="settings-actions">
          <button className="primary-button" disabled={isSaving} type="submit">
            {isSaving ? "Ukladam..." : "Ulozit"}
          </button>
        </div>
      </form>
    </SectionCard>
  );
}
