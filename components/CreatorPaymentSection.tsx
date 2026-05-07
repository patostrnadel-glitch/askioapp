"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import {
  Elements,
  ExpressCheckoutElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePublishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null;

type ExpressCheckoutAvailability = "checking" | "available" | "unavailable";
type PaymentSurface = "express" | "card" | "both";

export function CreatorPaymentSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingClientSecret, setIsLoadingClientSecret] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || clientSecret) {
      return;
    }

    let isActive = true;

    const createPaymentIntent = async () => {
      if (!stripePublishableKey || !siteUrl) {
        setErrorMessage("Stripe platba momentalne nie je dostupna.");
        return;
      }

      setIsLoadingClientSecret(true);
      setErrorMessage("");

      try {
        const response = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
        });

        const payload = (await response.json()) as {
          clientSecret?: string;
          error?: string;
        };

        if (!response.ok || !payload.clientSecret) {
          throw new Error(
            payload.error || "Nepodarilo sa pripraviť Stripe platbu."
          );
        }

        if (isActive) {
          setClientSecret(payload.clientSecret);
        }
      } catch (error) {
        console.error(error);

        if (isActive) {
          setErrorMessage("Nepodarilo sa pripraviť Stripe platbu. Skús to znova.");
        }
      } finally {
        if (isActive) {
          setIsLoadingClientSecret(false);
        }
      }
    };

    void createPaymentIntent();

    return () => {
      isActive = false;
    };
  }, [clientSecret, isOpen]);

  const elementsOptions = useMemo(
    () => ({
      clientSecret,
      appearance: {
        theme: "stripe" as const,
        variables: {
          colorPrimary: "#6d28d9",
          colorText: "#101828",
          colorBackground: "#ffffff",
          borderRadius: "16px",
        },
      },
    }),
    [clientSecret]
  );

  return (
    <>
      <button
        className="primary-button creator-cta"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        Opýtať sa otázku
      </button>

      {isMounted && isOpen
        ? createPortal(
            <div
              aria-hidden="true"
              className="creator-payment-modal-backdrop"
              onClick={() => setIsOpen(false)}
            >
              <div
                aria-labelledby="creator-payment-title"
                aria-modal="true"
                className="creator-payment-modal"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
              >
                <div className="creator-payment-modal-handle" />

                <div className="creator-payment-modal-header">
                  <div className="stack-xs">
                    <h2
                      className="creator-payment-title"
                      id="creator-payment-title"
                    >
                      Opýtať sa otázku
                    </h2>
                    <div className="price-callout creator-payment-chip">
                      💬 Rýchla odpoveď • 4,90 €
                    </div>
                    <p className="creator-payment-copy">
                      Po úspešnej platbe, sa Vám otvorí chat s creatorom aby ste mu mohli poslať vašu otázku
                    </p>
                  </div>

                  <button
                    aria-label="Zavrieť modál"
                    className="creator-payment-close"
                    onClick={() => setIsOpen(false)}
                    type="button"
                  >
                    X
                  </button>
                </div>

                {errorMessage ? (
                  <p className="feedback-message feedback-error">
                    {errorMessage}
                  </p>
                ) : null}

                {!stripePromise || isLoadingClientSecret || !clientSecret ? (
                  <div className="creator-payment-loading">
                    <p className="muted-text">
                      Pripravujem bezpečnú Stripe platbu...
                    </p>
                  </div>
                ) : (
                  <Elements options={elementsOptions} stripe={stripePromise}>
                    <CreatorPaymentForm clientSecret={clientSecret} />
                  </Elements>
                )}
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}

type CreatorPaymentFormProps = {
  clientSecret: string;
};

function CreatorPaymentForm({ clientSecret }: CreatorPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isCardSubmitting, setIsCardSubmitting] = useState(false);
  const [isExpressSubmitting, setIsExpressSubmitting] = useState(false);
  const [expressCheckoutAvailability, setExpressCheckoutAvailability] =
    useState<ExpressCheckoutAvailability>("checking");

  const paymentSurface = useMemo<PaymentSurface>(() => {
    if (typeof navigator === "undefined") {
      return "both";
    }

    const userAgent = navigator.userAgent;
    const isIPhoneSafari =
      /iPhone|iPad|iPod/i.test(userAgent) &&
      /Safari/i.test(userAgent) &&
      !/CriOS|FxiOS|EdgiOS/i.test(userAgent);
    const isAndroidChrome =
      /Android/i.test(userAgent) && /Chrome/i.test(userAgent);
    const isDesktopDevice = !/Android|iPhone|iPad|iPod|Mobile/i.test(userAgent);

    if (isIPhoneSafari || isAndroidChrome) {
      return "express";
    }

    if (isDesktopDevice) {
      return "card";
    }

    return "both";
  }, []);

  const confirmPayment = async () => {
    if (!stripe || !elements) {
      setErrorMessage("Platba este nie je pripravena.");
      return;
    }

    setErrorMessage("");

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(
        submitError.message || "Skontroluj platobné údaje a skús to znova."
      );
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${siteUrl}/platba-uspesna`,
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message || "Platbu sa nepodarilo dokončiť.");
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      router.push("/platba-uspesna");
      return;
    }

    setErrorMessage("Platbu sa nepodarilo dokončiť.");
  };

  const handleCardSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsCardSubmitting(true);

    try {
      await confirmPayment();
    } finally {
      setIsCardSubmitting(false);
    }
  };

  const handleExpressConfirm = async () => {
    setIsExpressSubmitting(true);

    try {
      await confirmPayment();
    } finally {
      setIsExpressSubmitting(false);
    }
  };

  return (
    <div className="creator-payment-shell">
      {paymentSurface !== "card" ? (
        <div className="creator-payment-panel">
          <div
            className={
              expressCheckoutAvailability === "unavailable"
                ? "creator-express-checkout creator-express-checkout-hidden"
                : "creator-express-checkout"
            }
          >
            <ExpressCheckoutElement
              onConfirm={handleExpressConfirm}
              onLoadError={() => setExpressCheckoutAvailability("unavailable")}
              onReady={(event) => {
                const availablePaymentMethods = event.availablePaymentMethods
                  ? Object.keys(event.availablePaymentMethods).length
                  : 0;

                setExpressCheckoutAvailability(
                  availablePaymentMethods > 0 ? "available" : "unavailable"
                );
              }}
              options={{
                paymentMethodOrder: ["apple_pay", "google_pay"],
              }}
            />
          </div>

          {expressCheckoutAvailability === "unavailable" ? (
            <p className="creator-payment-availability">
              Apple Pay / Google Pay nie je na tomto zariadení dostupné.
            </p>
          ) : null}
        </div>
      ) : null}

      {paymentSurface !== "express" ||
      expressCheckoutAvailability === "unavailable" ? (
        <form className="creator-payment-form" onSubmit={handleCardSubmit}>
          <div className="creator-payment-panel">
            <PaymentElement />
          </div>

          <button
            className="primary-button creator-cta"
            disabled={
              !stripe || !elements || isCardSubmitting || isExpressSubmitting
            }
            type="submit"
          >
            {isCardSubmitting ? "Spracovávam platbu..." : "Zaplatiť kartou"}
          </button>
        </form>
      ) : null}

      {errorMessage ? (
        <p className="feedback-message feedback-error">{errorMessage}</p>
      ) : null}
    </div>
  );
}
