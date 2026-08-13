"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import Input from "@/components/ui/Input";
import {
  PET_PROFILE_FIELDS,
  type ChoiceOption,
  type PetProfileField,
} from "@/lib/petProfileFields";

export default function PetProfileForm({
  petName,
  fields = PET_PROFILE_FIELDS,
}: {
  petName: string;
  fields?: PetProfileField[];
}) {
  const router = useRouter();
  // values — выбранный вариант (id опции) либо текст для kind: "text"
  const [values, setValues] = useState<Record<string, string>>({});
  // texts — содержимое поля ввода у choice-полей с input: там может быть как
  // подставленный из чипа вариант, так и вписанный вручную
  const [texts, setTexts] = useState<Record<string, string>>({});

  const setValue = (id: string, value: string) =>
    setValues((prev) => ({ ...prev, [id]: value }));

  const selectOption = (field: PetProfileField, option: ChoiceOption) => {
    setValue(field.id, option.id);
    if (field.kind === "choice" && field.input) {
      setTexts((prev) => ({ ...prev, [field.id]: option.label }));
    }
  };

  // Вписанный текст подсвечивает совпавший чип, иначе выбор сбрасывается —
  // так поле и чипы всегда показывают одно и то же
  const typeOption = (field: PetProfileField, text: string) => {
    if (field.kind !== "choice") return;
    setTexts((prev) => ({ ...prev, [field.id]: text }));
    const match = field.options.find(
      (option) => option.label.toLowerCase() === text.trim().toLowerCase(),
    );
    setValue(field.id, match?.id ?? "");
  };

  const isFilled = (field: PetProfileField) =>
    field.kind === "choice" && field.input
      ? (texts[field.id] ?? "").trim() !== ""
      : (values[field.id] ?? "").trim() !== "";

  const canSubmit = fields.every(isFilled);

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
              {/* при наличии поля ввода подпись не нужна — её роль играет плейсхолдер */}
              {field.input ? (
                <Input
                  placeholder={field.input.placeholder}
                  value={texts[field.id] ?? ""}
                  onChange={(e) => typeOption(field, e.target.value)}
                />
              ) : (
                <span className="block pl-4 text-caption-s uppercase text-grey-400">
                  {field.label}
                </span>
              )}
              <div className="mt-2.5 flex flex-wrap gap-4">
                {field.options.map((option) => (
                  <Chip
                    key={option.id}
                    selected={values[field.id] === option.id}
                    onClick={() => selectOption(field, option)}
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
