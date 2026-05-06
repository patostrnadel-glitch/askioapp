import Link from "next/link";
import { Container } from "@/components/Container";
import { CreatorRegistrationForm } from "@/components/CreatorRegistrationForm";

export default function RegistrationPage() {
  return (
    <main className="page">
      <Container className="stack-lg">
        <div className="page-header">
          <div className="stack-sm">
            <p className="eyebrow">Registracia tvorcu</p>
            <h1>Vytvor si profil tvorcu</h1>
            <p className="lead">
              Vypln zakladne udaje, nastav cenu spravy a priprav si moderny
              profil pre svoje publikum.
            </p>
          </div>
          <Link className="text-link" href="/">
            Spat na uvod
          </Link>
        </div>

        <CreatorRegistrationForm />
      </Container>
    </main>
  );
}
