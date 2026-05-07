import { notFound } from "next/navigation";
import { AvatarPlaceholder } from "@/components/AvatarPlaceholder";
import { Container } from "@/components/Container";
import { CreatorPaymentSection } from "@/components/CreatorPaymentSection";
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
    .select("full_name, bio, slug, avatar_url")
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

  return (
    <main className="page">
      <Container className="profile-layout creator-page-shell">
        <SectionCard className="public-profile-card public-profile-hero">
          <div className="stack-md centered public-profile-content">
            <AvatarPlaceholder
              imageUrl={creator.avatar_url}
              label={initials || "TV"}
              size="lg"
            />
            <div className="stack-sm centered creator-identity-block">
              <h1 className="creator-profile-title">{creator.full_name}</h1>
              <p className="lead compact creator-profile-bio">{creator.bio}</p>
            </div>
            <div className="creator-action-stack">
              <CreatorPaymentSection />
              <p className="creator-cta-note">
                Po uspesnej platbe bude creator upozorneny aby Vam odpisal co
                najskor na vasu otazku
              </p>
            </div>
          </div>
        </SectionCard>
      </Container>
    </main>
  );
}
