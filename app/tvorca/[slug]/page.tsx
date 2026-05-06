import { redirect } from "next/navigation";

type CreatorProfilePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CreatorProfilePage({
  params,
}: CreatorProfilePageProps) {
  const { slug } = await params;
  redirect(`/${slug}`);
}
