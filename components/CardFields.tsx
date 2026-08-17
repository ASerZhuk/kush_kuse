"use client";

import Input from "@/components/ui/Input";
import { formatCardNumber, formatCvc, formatExpiry } from "@/lib/formatCard";

export type Card = { number: string; expiry: string; cvc: string };

export const EMPTY_CARD: Card = { number: "", expiry: "", cvc: "" };

export const isCardFilled = (card: Card) =>
  card.number.trim() !== "" && card.expiry.trim() !== "" && card.cvc.trim() !== "";

/** Тройка полей карты (номер / срок / CVC) — одинаковая в чекауте и в
 * шторке «Оплата». Маски навешаны здесь, наружу отдаётся готовое значение. */
export default function CardFields({
  value,
  onChange,
  className = "",
}: {
  value: Card;
  onChange: (card: Card) => void;
  className?: string;
}) {
  const update = (patch: Partial<Card>) => onChange({ ...value, ...patch });

  return (
    <>
      <Input
        className={className}
        placeholder="0000 0000 0000 0000"
        inputMode="numeric"
        autoComplete="cc-number"
        maxLength={19}
        value={value.number}
        onChange={(e) => update({ number: formatCardNumber(e.target.value) })}
      />

      <div className="mt-3 flex gap-3">
        <Input
          placeholder="ММ/ГГ"
          inputMode="numeric"
          autoComplete="cc-exp"
          maxLength={5}
          value={value.expiry}
          onChange={(e) => update({ expiry: formatExpiry(e.target.value) })}
        />
        <Input
          placeholder="CVC"
          inputMode="numeric"
          // CVC нельзя ни сохранять, ни подставлять автозаполнением.
          autoComplete="off"
          maxLength={3}
          value={value.cvc}
          onChange={(e) => update({ cvc: formatCvc(e.target.value) })}
        />
      </div>
    </>
  );
}
