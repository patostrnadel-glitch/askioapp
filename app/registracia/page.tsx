import Link from "next/link";
import { Container } from "@/components/Container";
import { CreatorRegistrationForm } from "@/components/CreatorRegistrationForm";

export default function RegistrationPage() {
  return (
    <main className="page">
      <Container className="stack-lg">
        <div className="page-header">
          <div className="stack-sm">
            <p className="eyebrow">Registrácia tvorcu</p>
            <h1>Vytvor si profil tvorcu</h1>
            <p className="lead">
              Vyplň základné údaje, nastav cenu správy a priprav si moderný
              profil pre svoje publikum.
            </p>
          </div>
          <Link className="text-link" href="/">
            Späť na úvod
          </Link>
        </div>

        <CreatorRegistrationForm />
      </Container>
    </main>
  );
}
