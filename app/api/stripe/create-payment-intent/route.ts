import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export async function POST() {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe env premenne nie su nastavene." },
      { status: 500 }
    );
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 490,
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    if (!paymentIntent.client_secret) {
      return NextResponse.json(
        { error: "Stripe PaymentIntent nema client secret." },
        { status: 500 }
      );
    }

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Nepodarilo sa vytvorit Stripe PaymentIntent." },
      { status: 500 }
    );
  }
}
