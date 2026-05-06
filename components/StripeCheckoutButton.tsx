"use client";

import { useState } from "react";

type StripeCheckoutButtonProps = {
  slug: string;
};

export function StripeCheckoutButton({ slug }: StripeCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCheckout = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug }),
      });

      const payload = (await response.json()) as {
        error?: string;
        url?: string;
      };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Stripe Checkout sa nepodarilo spustit.");
      }

      window.location.href = payload.url;
    } catch (error) {
      console.error(error);
      setErrorMessage("Stripe Checkout sa nepodarilo spustit. Skus to znova.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className="primary-button creator-cta"
        disabled={isLoading}
        onClick={handleCheckout}
        type="button"
      >
        {isLoading ? "Presmerovavam..." : "Opýtať sa otázku"}
      </button>
      {errorMessage ? <p className="feedback-message feedback-error">{errorMessage}</p> : null}
    </>
  );
}
