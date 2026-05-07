"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AvatarPlaceholder } from "./AvatarPlaceholder";
import { FormField } from "./FormField";
import { SectionCard } from "./SectionCard";
import { getSupabaseClient } from "@/src/lib/supabase";

export function CreatorRegistrationForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const bio = String(formData.get("bio") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    const priceValue = String(formData.get("price") ?? "").trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const slugPattern = /^[a-z0-9-]+$/;
    const priceInEuros = Number(priceValue);

    if (!fullName) {
      setErrorMessage("Meno a priezvisko je povinné.");
      return;
    }

    if (!emailPattern.test(email)) {
      setErrorMessage("Zadaj platný email.");
      return;
    }

    if (!slugPattern.test(slug)) {
      setErrorMessage(
        "Slug môže obsahovať len malé písmená, čísla a pomlčky bez medzier."
      );
      return;
    }

    if (!Number.isFinite(priceInEuros) || priceInEuros < 0) {
      setErrorMessage("Cena správy musí byť 0 alebo viac.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = getSupabaseClient();
      const normalizedEmail = email.toLowerCase();
      const normalizedSlug = slug.toLowerCase();
      const priceCents = Math.round(priceInEuros * 100);

      const { data: existingCreator, error: existingCreatorError } = await supabase
        .from("creators")
        .select("id")
        .eq("slug", normalizedSlug)
        .maybeSingle();

      if (existingCreatorError) {
        throw existingCreatorError;
      }

      if (existingCreator) {
        setErrorMessage("Tento slug je už obsadený.");
        return;
      }

      const { data: existingEmail, error: existingEmailError } = await supabase
        .from("creators")
        .select("id")
        .eq("email", normalizedEmail)
        .maybeSingle();

      if (existingEmailError) {
        throw existingEmailError;
      }

      if (existingEmail) {
        setErrorMessage("Tento email je už obsadený.");
        return;
      }

      const { error } = await supabase.from("creators").insert({
        user_id: null,
        full_name: fullName,
        email: normalizedEmail,
        bio,
        slug: normalizedSlug,
        price_cents: priceCents,
        currency: "EUR",
        avatar_url: null,
        is_active: true,
      });

      if (error) {
        if (error.code === "23505") {
          setErrorMessage("Tento slug alebo email je už obsadený.");
          return;
        }

        throw error;
      }

      setSuccessMessage("Profil tvorcu bol vytvorený.");

      window.setTimeout(() => {
        router.push(`/tvorca/${normalizedSlug}`);
      }, 500);
    } catch (error) {
      console.error(error);
      setErrorMessage("Nepodarilo sa vytvoriť profil tvorcu. Skús to znova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionCard>
      <form className="stack-lg" onSubmit={handleSubmit}>
        <div aria-live="polite" className="stack-sm">
          {successMessage ? (
            <p className="feedback-message feedback-success">{successMessage}</p>
          ) : null}
          {errorMessage ? (
            <p className="feedback-message feedback-error">{errorMessage}</p>
          ) : null}
        </div>

        <div className="grid-two">
          <FormField
            autoComplete="name"
            disabled={isSubmitting}
            label="Meno a priezvisko"
            name="fullName"
            placeholder="Napríklad Marek Novák"
          />
          <FormField
            autoComplete="off"
            disabled={isSubmitting}
            helperText="Použi len malé písmená, čísla a pomlčky."
            label="Slug URL"
            name="slug"
            placeholder="marek-novak"
          />
        </div>

        <FormField
          autoComplete="email"
          disabled={isSubmitting}
          inputMode="email"
          label="Email"
          name="email"
          placeholder="marek@novak.sk"
          type="email"
          helperText="Na tento email ti vieme neskôr posielať upozornenia a prístupy."
        />

        <FormField
          disabled={isSubmitting}
          label="Bio"
          name="bio"
          placeholder="Kto si, s čím pomáhaš a prečo sa ťa oplatí opýtať."
          multiline
        />

        <div className="grid-two">
          <FormField
            disabled={isSubmitting}
            inputMode="decimal"
            label="Cena správy"
            min={0}
            name="price"
            placeholder="5"
            step={0.01}
            type="number"
            helperText="Zadaj sumu v eurách, napr. 5."
          />

          <label className="field">
            <span className="field-label">Profilová fotka</span>
            <div className="upload-card">
              <AvatarPlaceholder label="Foto" />
              <div className="stack-xs">
                <strong>Nahraj fotku</strong>
                <span className="helper-text">
                  Zatiaľ len vizuálny placeholder bez reálneho uploadu.
                </span>
              </div>
              <button
                className="secondary-button"
                disabled={isSubmitting}
                type="button"
              >
                Vybrať súbor
              </button>
            </div>
          </label>
        </div>

        <button className="primary-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Ukladám..." : "Pokračovať"}
        </button>
      </form>
    </SectionCard>
  );
}
