import Link from "next/link";
import { AvatarPlaceholder } from "@/components/AvatarPlaceholder";
import { Container } from "@/components/Container";
import { SectionCard } from "@/components/SectionCard";

type CreatorProfilePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CreatorProfilePage({
  params,
}: CreatorProfilePageProps) {
  const { slug } = await params;

  const creator = {
    fullName: "Marek Novak",
    bio: "Pomaham ludom s fitness, treningom a stravou.",
    price: 5,
    slug,
  };

  return (
    <main className="page">
      <Container className="profile-layout">
        <SectionCard className="public-profile-card">
          <div className="stack-md centered">
            <AvatarPlaceholder label="MN" size="lg" />
            <div className="stack-xs centered">
              <p className="eyebrow">@{creator.slug}</p>
              <h1>{creator.fullName}</h1>
              <p className="lead compact">{creator.bio}</p>
            </div>
            <div className="price-callout">Odpoved za {creator.price} EUR</div>
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
