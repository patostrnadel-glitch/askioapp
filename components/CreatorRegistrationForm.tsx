"use client";

import { FormEvent } from "react";
import { AvatarPlaceholder } from "./AvatarPlaceholder";
import { FormField } from "./FormField";
import { SectionCard } from "./SectionCard";

export function CreatorRegistrationForm() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Registracia tvorcu je zatial len UI placeholder.");
  };

  return (
    <SectionCard>
      <form className="stack-lg" onSubmit={handleSubmit}>
        <div className="grid-two">
          <FormField
            label="Meno a priezvisko"
            name="fullName"
            placeholder="Napriklad Marek Novak"
          />
          <FormField
            label="Slug URL"
            name="slug"
            placeholder="marek-novak"
          />
        </div>

        <FormField
          label="Bio"
          name="bio"
          placeholder="Kto si, s cim pomahas a preco sa ta oplati opytat."
          multiline
        />

        <div className="grid-two">
          <FormField
            label="Cena spravy"
            name="price"
            placeholder="5"
            type="number"
            helperText="Zadaj sumu v eurach, napr. 5."
          />

          <label className="field">
            <span className="field-label">Profilova fotka</span>
            <div className="upload-card">
              <AvatarPlaceholder label="Foto" />
              <div className="stack-xs">
                <strong>Nahraj fotku</strong>
                <span className="helper-text">
                  Zatial len vizualny placeholder bez realneho uploadu.
                </span>
              </div>
              <button className="secondary-button" type="button">
                Vybrat subor
              </button>
            </div>
          </label>
        </div>

        <button className="primary-button" type="submit">
          Pokracovat
        </button>
      </form>
    </SectionCard>
  );
}
