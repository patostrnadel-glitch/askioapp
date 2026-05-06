import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionCard } from "@/components/SectionCard";

export default function HomePage() {
  return (
    <main className="page page-home">
      <Container>
        <section className="hero">
          <div className="stack-md hero-copy">
            <p className="eyebrow">Creator economy MVP</p>
            <h1>Askly</h1>
            <p className="hero-text">
              Rychle odpovede od tvorcov, ktorym doverujes.
            </p>
            <div className="hero-actions">
              <Link className="primary-button" href="/registracia">
                Registrovat sa ako tvorca
              </Link>
            </div>
          </div>

          <SectionCard className="hero-card">
            <div className="stack-sm">
              <span className="status-pill">Nova generacia platenych otazok</span>
              <h2>Jednoduche profily, jasna cena, rychly kontakt.</h2>
              <p className="muted-text">
                Cisty landing placeholder pre MVP, na ktorom sa da dalej
                stavat onboarding, platby aj chat.
              </p>
            </div>
          </SectionCard>
        </section>
      </Container>
    </main>
  );
}
