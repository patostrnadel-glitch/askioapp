import Link from "next/link";
import { Container } from "@/components/Container";
import { CreatorAdminDashboard } from "@/components/CreatorAdminDashboard";
import { getSupabaseClient } from "@/src/lib/supabase";

type CreatorAdminPageProps = {
  searchParams: Promise<{
    slug?: string;
  }>;
};

export default async function CreatorAdminPage({
  searchParams,
}: CreatorAdminPageProps) {
  const { slug } = await searchParams;
  const requestedSlug = slug?.trim().toLowerCase() || "marek-novak";
  const supabase = getSupabaseClient();
  const { data: creator, error } = await supabase
    .from("creators")
    .select("id, full_name, email, slug, bio, price_cents")
    .eq("slug", requestedSlug)
    .maybeSingle();

  const loadErrorMessage = error
    ? "Nepodarilo sa nacitat profil tvorcu pre upravu."
    : !creator
      ? `Profil pre slug "${requestedSlug}" sa nenasiel.`
      : "";
  const publicProfileHref = creator ? `/${creator.slug}` : `/${requestedSlug}`;

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
          <Link className="text-link" href={publicProfileHref}>
            Zobrazit verejny profil
          </Link>
        </div>

        <CreatorAdminDashboard
          initialCreator={creator}
          initialErrorMessage={loadErrorMessage}
          key={creator?.slug ?? requestedSlug}
          requestedSlug={requestedSlug}
        />
      </Container>
    </main>
  );
}
