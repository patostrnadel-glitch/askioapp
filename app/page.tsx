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
              Rýchle odpovede od tvorcov, ktorým dôveruješ.
            </p>
            <div className="hero-actions">
              <Link className="primary-button" href="/registracia">
                Registrovať sa ako tvorca
              </Link>
            </div>
          </div>

          <SectionCard className="hero-card">
            <div className="stack-sm">
              <span className="status-pill">Nová generácia platených otázok</span>
              <h2>Jednoduché profily, jasná cena, rýchly kontakt.</h2>
              <p className="muted-text">
                Čistý landing placeholder pre MVP, na ktorom sa dá ďalej
                stavať onboarding, platby aj chat.
              </p>
            </div>
          </SectionCard>
        </section>
      </Container>
    </main>
  );
}
