"use client";

import { useSearchParams } from "next/navigation";

export default function PetName({ fallback }: { fallback: string }) {
  const searchParams = useSearchParams();
  return <>{searchParams.get("name") || fallback}</>;
}
