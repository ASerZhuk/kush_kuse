"use client";

import BottomSheet from "@/components/BottomSheet";
import Button from "@/components/ui/Button";

const ACTIONS = ["Пропустить следующую доставку", "Сменить рецепт", "Пауза на месяц"];

export default function SubscriptionSheet({ className = "" }: { className?: string }) {
  return (
    <BottomSheet
      trigger={(open) => (
        <Button variant="primary" className={className} onClick={open}>
          Управлять подпиской
        </Button>
      )}
    >
      {() => (
        <>
          <h2 className="font-display text-subtitle text-dark">Подписка</h2>

          <div className="mt-6 flex flex-col gap-3">
            {ACTIONS.map((action) => (
              <Button key={action} variant="secondary">
                {action}
              </Button>
            ))}
          </div>

          <p className="mt-6 text-body text-grey-300">
            Мы не удерживаем. Пауза сохранит место в клубе — вернётесь, когда захотите.
          </p>
        </>
      )}
    </BottomSheet>
  );
}
