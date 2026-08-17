"use client";

import { useState } from "react";
import BottomSheet from "@/components/BottomSheet";
import Button from "@/components/ui/Button";
import CardFields, { EMPTY_CARD } from "@/components/CardFields";
import ArrowUpRightIcon from "@/components/icons/ArrowUpRightIcon";
import { useSubscription } from "@/components/SubscriptionContext";

export default function PaymentSheet({ className }: { className?: string }) {
  const { active } = useSubscription();
  const [card, setCard] = useState(EMPTY_CARD);

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
      {(close) => (
        <>
          <h2 className="font-display text-subtitle text-dark">Оплата</h2>

          {active ? (
            <>
              <div className="mt-6 rounded-3xl bg-grey p-4">
                <span className="text-body-m text-dark">Карта····8558</span>
                <p className="mt-1 text-body-s text-grey-300">
                  Списание раз в месяц, 5 числа · платежи проводит ЮКасса
                </p>
              </div>

              <p className="mt-6 text-caption text-grey-300">
                Введите данные новой карты
              </p>

              <CardFields className="mt-3" value={card} onChange={setCard} />

              <Button variant="primary" className="mt-8" onClick={close}>
                Сохранить
              </Button>
            </>
          ) : (
            <>
              <p className="mt-6 text-body text-grey-300">
                Сейчас идёт месяц в подарок — списаний нет. Карта появится здесь
                после оформления подписки.
              </p>

              <Button variant="primary" className="mt-8" href="/checkout">
                Оформить подписку
              </Button>
            </>
          )}
        </>
      )}
    </BottomSheet>
  );
}
