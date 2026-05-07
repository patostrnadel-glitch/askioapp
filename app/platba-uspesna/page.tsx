import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionCard } from "@/components/SectionCard";

export default function PaymentSuccessPage() {
  return (
    <main className="page">
      <Container className="profile-layout creator-page-shell">
        <SectionCard className="public-profile-card public-profile-hero">
          <div className="stack-md centered public-profile-content">
            <div className="stack-sm centered">
              <p className="eyebrow">Platba úspešná</p>
              <h1 className="creator-profile-title">Ďakujeme</h1>
              <p className="lead compact creator-profile-bio">
                Platba cez Stripe prebehla úspešne.
              </p>
            </div>
            <Link className="primary-button creator-cta" href="/">
              Späť na úvod
            </Link>
          </div>
        </SectionCard>
      </Container>
    </main>
  );
}
