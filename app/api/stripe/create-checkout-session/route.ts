import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey)
  : null;

export async function POST(request: NextRequest) {
  if (!stripe || !siteUrl) {
    return NextResponse.json(
      { error: "Stripe env premenne nie su nastavene." },
      { status: 500 }
    );
  }

  try {
    const body = (await request.json()) as { slug?: string };
    const slug = body.slug?.trim().toLowerCase();

    if (!slug) {
      return NextResponse.json({ error: "Chyba slug tvorcu." }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Rýchla odpoveď",
            },
            unit_amount: 490,
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/platba-uspesna`,
      cancel_url: `${siteUrl}/tvorca/${slug}`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe Checkout nema navratovu URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Nepodarilo sa vytvorit Stripe Checkout session." },
      { status: 500 }
    );
  }
}
