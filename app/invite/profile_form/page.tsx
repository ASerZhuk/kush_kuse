import PetProfileForm from "./PetProfileForm";
import { readNameParam } from "@/lib/searchParams";

export default async function PetProfile({
  searchParams,
}: PageProps<"/invite/profile_form">) {
  return <PetProfileForm petName={readNameParam(await searchParams)} />;
}
