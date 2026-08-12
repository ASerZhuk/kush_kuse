import PetProfileForm from "./PetProfileForm";

export default async function PetProfile({
  searchParams,
}: {
  searchParams: Promise<{ name?: string }>;
}) {
  const { name = "" } = await searchParams;

  return <PetProfileForm petName={name} />;
}
