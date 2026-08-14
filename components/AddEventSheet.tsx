"use client";

import { useState } from "react";
import Image from "next/image";
import BottomSheet from "@/components/BottomSheet";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import Input from "@/components/ui/Input";
import plusIcon from "@/app/assets/plus.svg";

const EVENT_TYPES = ["Взвешивание", "Прививка", "Процедура", "Документ, анализы"];

const PLACEHOLDERS: Record<string, string> = {
  Взвешивание: "Например: 4.2 кг",
  Прививка: "Например: Комплексная, ревакцинация",
  Процедура: "Например: Стрижка когтей",
  "Документ, анализы": "Например: Биохимия крови",
};

export default function AddEventSheet({
  onAdd,
}: {
  onAdd: (event: { title: string; description: string }) => void;
}) {
  const [type, setType] = useState(EVENT_TYPES[0]);
  const [description, setDescription] = useState("");

  return (
    <BottomSheet
      trigger={(open) => (
        <button
          type="button"
          aria-label="Добавить событие"
          onClick={open}
          className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-grey-50"
        >
          <Image src={plusIcon} alt="" className="h-3.5 w-3.5" />
        </button>
      )}
    >
      {(close) => (
        <>
          <h2 className="font-display text-subtitle text-dark">Новое событие</h2>

          <div className="mt-6 flex flex-wrap gap-3">
            {EVENT_TYPES.map((label) => (
              <Chip key={label} selected={type === label} onClick={() => setType(label)}>
                {label}
              </Chip>
            ))}
          </div>

          <Input
            className="mt-6"
            placeholder={PLACEHOLDERS[type]}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button
            variant="primary"
            className="mt-6"
            disabled={!description.trim()}
            onClick={() => {
              onAdd({ title: type, description: description.trim() });
              setType(EVENT_TYPES[0]);
              setDescription("");
              close();
            }}
          >
            Запись
          </Button>
        </>
      )}
    </BottomSheet>
  );
}
