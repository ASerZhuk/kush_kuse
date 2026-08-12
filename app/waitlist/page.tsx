"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import CheckIcon from "@/components/icons/CheckIcon";
import { formatPhoneOrTelegram } from "@/lib/formatPhone";

const HAS_DIGIT = /\d/;
const HAS_CYRILLIC = /[а-яёА-ЯЁ]/;

export default function Waitlist() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [catName, setCatName] = useState("");
  const [submitted, setSubmitted] = useState<{ name: string; catName: string } | null>(null);

  const nameError = HAS_DIGIT.test(name);
  const contactError = HAS_CYRILLIC.test(contact);
  const canSubmit =
    name.trim() !== "" &&
    contact.trim() !== "" &&
    catName.trim() !== "" &&
    !nameError &&
    !contactError;

  if (submitted) {
    return (
      <div className="flex min-h-full flex-1 flex-col bg-white px-margin pt-[252.5px]">
        <CheckIcon className="mx-auto h-auto w-20 text-dark" />

        <h1 className="mt-6 font-display text-h1 text-dark">
          Вы в списке, {submitted.name}!
        </h1>

        <p className="mt-4 text-body text-grey-300">
          {submitted.catName} теперь в списке вместе с Вами. Мы напишем,
          когда появится место.
        </p>

        <Button variant="primary" href="/" className="mt-8">
          На главную
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white px-margin pt-[161.5px]">
      <h1 className="font-display text-h1 text-dark">Лист ожидания</h1>

      <p className="mt-4 text-body text-grey-300">
        Клуб растёт постепенно. Оставьте контакт — пришлём приглашение, когда
        появится место.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <Input
          placeholder="Ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={nameError}
          errorMessage="Имя не должно содержать цифры"
        />
        <Input
          placeholder="Телефон или телеграм"
          value={contact}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          onChange={(e) => setContact(formatPhoneOrTelegram(e.target.value))}
          error={contactError}
          errorMessage="Введите латиницей, без кириллицы"
        />
        <Input
          placeholder="Как зовут Вашу кошку"
          value={catName}
          onChange={(e) => setCatName(e.target.value)}
        />
      </div>

      <div className="mt-10 flex flex-col gap-4">
        <Button
          variant="primary"
          disabled={!canSubmit}
          onClick={() => setSubmitted({ name, catName })}
        >
          Занять место
        </Button>
        <Button variant="secondary" href="/">
          Назад
        </Button>
      </div>
    </div>
  );
}
