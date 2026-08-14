"use client";

import { useState } from "react";
import BottomSheet from "@/components/BottomSheet";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ArrowUpRightIcon from "@/components/icons/ArrowUpRightIcon";
import { useSubscription } from "@/components/SubscriptionContext";

const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

const formatCvc = (value: string) => value.replace(/\D/g, "").slice(0, 3);

export default function PaymentSheet({ className }: { className?: string }) {
  const { active } = useSubscription();
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  return (
    <BottomSheet
      trigger={(open) => (
        <button type="button" onClick={open} className={className}>
          <span className="text-body-m text-dark">Оплата</span>
          <span className="flex items-center gap-2">
            <span className="text-body-s text-grey-300">
              {active ? "···· 8558" : "-"}
            </span>
            <ArrowUpRightIcon className="h-4 w-4 text-dark" />
          </span>
        </button>
      )}
    >
      {(close) =>
        active ? (
          <>
            <h2 className="font-display text-subtitle text-dark">Оплата</h2>

            <div className="mt-6 rounded-3xl bg-grey p-4">
              <span className="text-body-m text-dark">Карта····8558</span>
              <p className="mt-1 text-body-s text-grey-300">
                Списание раз в месяц, 5 числа · платежи проводит ЮКасса
              </p>
            </div>

            <p className="mt-6 text-caption text-grey-300">
              Введите данные новой карты
            </p>

            <Input
              className="mt-3"
              placeholder="0000 0000 0000 0000"
              inputMode="numeric"
              maxLength={19}
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            />

            <div className="mt-3 flex gap-3">
              <Input
                placeholder="ММ/ГГ"
                inputMode="numeric"
                maxLength={5}
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              />
              <Input
                placeholder="CVC"
                inputMode="numeric"
                maxLength={3}
                value={cvc}
                onChange={(e) => setCvc(formatCvc(e.target.value))}
              />
            </div>

            <Button variant="primary" className="mt-8" onClick={close}>
              Сохранить
            </Button>
          </>
        ) : (
          <>
            <h2 className="font-display text-subtitle text-dark">Оплата</h2>

            <p className="mt-6 text-body text-grey-300">
              Сейчас идёт месяц в подарок — списаний нет. Карта появится здесь
              после оформления подписки.
            </p>

            <Button variant="primary" className="mt-8" href="/checkout">
              Оформить подписку
            </Button>
          </>
        )
      }
    </BottomSheet>
  );
}
