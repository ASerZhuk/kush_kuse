"use client";

import BottomSheet from "@/components/BottomSheet";
import ArrowUpRightIcon from "@/components/icons/ArrowUpRightIcon";

const FAQ = [
  {
    question: "Как устроена подписка?",
    answer:
      "Мы привозим её рацион раз в две недели. Пауза, пропуск и смена рецепта — в два касания, без звонков и объяснений.",
  },
  {
    question: "Что входит в рацион?",
    answer:
      "Свежая еда под её вес и активность, молочная вода, снеки из трески и коллаген — если вы их подключили.",
  },
  {
    question: "Если она не станет есть?",
    answer:
      "Переход мягкий: семь дней 20/80, семь дней 50/50. Окажется не её вкус — вернём деньги за первый оплаченный месяц.",
  },
  {
    question: "Кто отвечает в чате?",
    answer:
      "miss Kusé — ваш консьерж. Когда нужен врач, она приглашает специалиста в тот же диалог.",
  },
  {
    question: "Откуда приглашения?",
    answer:
      "Клуб растёт по рекомендации. Каждому члену клуба — два приглашения для своих.",
  },
];

export default function FaqSheet({
  className,
}: {
  className?: string;
}) {
  return (
    <BottomSheet
      trigger={(open) => (
        <button
          type="button"
          onClick={open}
          className={className}
        >
          <span className="text-body-m text-dark">Частые вопросы</span>
          <ArrowUpRightIcon className="h-4 w-4 text-dark" />
        </button>
      )}
    >
      {() => (
        <>
          <h2 className="font-display text-subtitle text-dark">Частые вопросы</h2>

          <div className="mt-6 flex max-h-[60vh] flex-col gap-6 overflow-y-auto">
            {FAQ.map((item) => (
              <div key={item.question}>
                <h3 className="text-body-m text-dark">{item.question}</h3>
                <p className="mt-1 text-body text-grey-300">{item.answer}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </BottomSheet>
  );
}
