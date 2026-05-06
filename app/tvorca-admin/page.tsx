import Link from "next/link";
import { Container } from "@/components/Container";
import { CreatorAdminDashboard } from "@/components/CreatorAdminDashboard";

export default function CreatorAdminPage() {
  return (
    <main className="page">
      <Container className="stack-lg">
        <div className="page-header">
          <div className="stack-sm">
            <p className="eyebrow">Dashboard</p>
            <h1>Admin tvorcu</h1>
            <p className="lead">
              Zakladny moderny dashboard pre chat placeholder a spravu nastaveni.
            </p>
          </div>
          <Link className="text-link" href="/marek-novak">
            Zobrazit verejny profil
          </Link>
        </div>

        <CreatorAdminDashboard />
      </Container>
    </main>
  );
}
