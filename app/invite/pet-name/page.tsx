"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function PetName() {
  const router = useRouter();
  const [petName, setPetName] = useState("");
  const name = petName.trim();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white px-margin pt-80">
      <h1 className="font-display text-h1 text-dark">Как его зовут?</h1>

      <Input
        placeholder="Имя питомца"
        value={petName}
        onChange={(e) => setPetName(e.target.value)}
        className="mt-8"
      />

      <Button
        variant="primary"
        className="mt-7"
        disabled={name === ""}
        onClick={() =>
          router.push(`/invite/profile_form?name=${encodeURIComponent(name)}`)
        }
      >
        Дальше
      </Button>
    </div>
  );
}
