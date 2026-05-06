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
      <Container className="profile-layout">
        <SectionCard className="public-profile-card">
          <div className="stack-md centered">
            <AvatarPlaceholder label={initials || "TV"} size="lg" />
            <div className="stack-xs centered">
              <p className="eyebrow">@{creator.slug}</p>
              <h1>{creator.full_name}</h1>
              <p className="lead compact">{creator.bio}</p>
            </div>
            <div className="price-callout">
              Odpoved za {priceInEuros.toFixed(2)} EUR
            </div>
            <button className="primary-button large-button" type="button">
              Opytat sa otazku
            </button>
          </div>
        </SectionCard>

        <SectionCard className="stack-md">
          <div className="stack-xs">
            <p className="eyebrow">S cim ti mozem pomoct</p>
            <h2>Temy, ktore na profile odkomunikujes jasne a rychlo</h2>
          </div>
          <div className="chips">
            <span className="chip">Treningovy plan</span>
            <span className="chip">Strava a navyky</span>
            <span className="chip">Motivacia a rutina</span>
          </div>
          <Link className="text-link" href="/tvorca-admin">
            Otvorit creator admin
          </Link>
        </SectionCard>
      </Container>
    </main>
  );
}
