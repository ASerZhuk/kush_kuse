"use client";

import ActiveSubscriptionCard from "@/components/ActiveSubscriptionCard";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Status from "@/components/ui/Status";
import { useSubscription } from "@/components/SubscriptionContext";

export default function RationSubscriptionSection() {
  const { active } = useSubscription();

  if (active) return <ActiveSubscriptionCard />;

  return (
    <div className="mt-6 rounded-3xl bg-gradient-300 px-8 pt-8 pb-10">
      <div className="flex items-center justify-between">
        <Eyebrow items={["Рацион", "Фрэнк"]} />
        <Status variant="neutral">Месяц в подарок</Status>
      </div>

      <h2 className="mt-4 mb-6 font-display text-subtitle text-dark">
        Первый месяц — подарок
      </h2>

      <p className="mb-6 text-body text-grey-400">
        Свежая еда · Треска свежего улова · порция 76 г/день
      </p>

      <p className="mb-6 text-caption text-grey-400">
        Подписка — после первого месяца 5 августа
      </p>

      <Button variant="primary" subtitle="18 000 ₽/мес" href="/checkout">
        Оформить подписку
      </Button>
    </div>
  );
}
