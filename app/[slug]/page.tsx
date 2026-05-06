import Link from "next/link";
import { notFound } from "next/navigation";
import { AvatarPlaceholder } from "@/components/AvatarPlaceholder";
import { Container } from "@/components/Container";
import { SectionCard } from "@/components/SectionCard";
import { getSupabaseClient } from "@/src/lib/supabase";

type CreatorProfilePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CreatorProfilePage({
  params,
}: CreatorProfilePageProps) {
  const { slug } = await params;
  const supabase = getSupabaseClient();
  const { data: creator, error } = await supabase
    .from("creators")
    .select("full_name, bio, slug, price_cents")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error("Nepodarilo sa nacitat profil tvorcu.");
  }

  if (!creator) {
    notFound();
  }

  const initials = creator.full_name
    .split(" ")
    .filter((part: string): part is string => Boolean(part))
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase() ?? "")
    .join("");
  const priceInEuros = creator.price_cents / 100;

  return (
    <main className="page">
      <Container className="profile-layout creator-page-shell">
        <SectionCard className="public-profile-card public-profile-hero">
          <div className="stack-md centered public-profile-content">
            <AvatarPlaceholder label={initials || "TV"} size="lg" />
            <div className="stack-sm centered creator-identity-block">
              <p className="eyebrow">@{creator.slug}</p>
              <h1 className="creator-profile-title">{creator.full_name}</h1>
              <p className="lead compact creator-profile-bio">{creator.bio}</p>
            </div>
            <div className="price-callout">
              Odpoved za {priceInEuros.toFixed(2)} EUR
            </div>
            <div className="creator-action-stack">
              <button className="primary-button large-button creator-cta" type="button">
                Opytat sa otazku
              </button>
              <Link
                className="secondary-button creator-link-button"
                href={`/tvorca-admin?slug=${creator.slug}`}
              >
                Otvorit creator admin
              </Link>
            </div>
          </div>
        </SectionCard>

        <SectionCard className="stack-md creator-details-card">
          <div className="stack-xs">
            <p className="eyebrow">S cim ti mozem pomoct</p>
            <h2>Temy, ktore na profile odkomunikujes jasne a rychlo</h2>
          </div>
          <div className="chips">
            <span className="chip">Treningovy plan</span>
            <span className="chip">Strava a navyky</span>
            <span className="chip">Motivacia a rutina</span>
          </div>
          <p className="muted-text">
            Vyber si temu a pokracuj do dalsieho kroku bez zmeny aktualnej
            funkcionality profilu.
          </p>
        </SectionCard>
      </Container>
    </main>
  );
}
