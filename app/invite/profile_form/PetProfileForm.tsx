"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import Input from "@/components/ui/Input";
import { PET_PROFILE_FIELDS, type PetProfileField } from "@/lib/petProfileFields";

export default function PetProfileForm({
  petName,
  fields = PET_PROFILE_FIELDS,
}: {
  petName: string;
  fields?: PetProfileField[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({});

  const setValue = (id: string, value: string) =>
    setValues((prev) => ({ ...prev, [id]: value }));

  const canSubmit = fields.every((field) => (values[field.id] ?? "").trim() !== "");

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white px-margin pt-[100.5px] pb-10">
      <h1 className="font-display text-h1 text-dark">
        {petName ? `${petName} — какой он?` : "Расскажите о питомце"}
      </h1>

      <div className="mt-14 flex flex-col gap-8">
        {fields.map((field) =>
          field.kind === "text" ? (
            <Input
              key={field.id}
              placeholder={field.placeholder}
              value={values[field.id] ?? ""}
              onChange={(e) => setValue(field.id, e.target.value)}
            />
          ) : (
            <div key={field.id}>
              <span className="block pl-4 text-caption-s uppercase text-grey-400">
                {field.label}
              </span>
              <div className="mt-2.5 flex flex-wrap gap-4">
                {field.options.map((option) => (
                  <Chip
                    key={option.id}
                    selected={values[field.id] === option.id}
                    onClick={() => setValue(field.id, option.id)}
                  >
                    {option.label}
                  </Chip>
                ))}
              </div>
            </div>
          ),
        )}
      </div>

      <Button
        variant="primary"
        className="mt-8"
        disabled={!canSubmit}
        onClick={() =>
          router.push(`/invite/ration?name=${encodeURIComponent(petName)}`)
        }
      >
        Составить рацион
      </Button>
    </div>
  );
}
