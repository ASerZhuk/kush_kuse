"use client";

import { Fragment, useState, type ReactNode } from "react";
import Link from "next/link";
import AddressSheet from "@/components/AddressSheet";
import FaqSheet from "@/components/FaqSheet";
import PaymentSheet from "@/components/PaymentSheet";
import Logo from "@/components/Logo";
import PetAvatar from "@/components/PetAvatar";
import Status from "@/components/ui/Status";
import Switch from "@/components/ui/Switch";
import ArrowUpRightIcon from "@/components/icons/ArrowUpRightIcon";

const OWNER_NAME = "Елизавета";
const ADDRESS = "Малая Бронная, 12";

/**
 * Строка списка — либо переход по роуту, либо шторка. Шторки рисуют свою
 * строку сами (им нужен собственный триггер), поэтому получают только класс
 * строки. Раньше тип строки угадывался по строковому `href` вида "faq",
 * который не был ни роутом, ни признаком — легко было промахнуться.
 */
type ProfileRow =
  | { key: string; kind: "link"; label: string; value?: string; href: string }
  | { key: string; kind: "sheet"; render: (className: string) => ReactNode };

const ROWS: ProfileRow[] = [
  {
    key: "subscription",
    kind: "link",
    label: "Подписка",
    value: "месяц в подарок",
    href: "/ration",
  },
  {
    key: "payment",
    kind: "sheet",
    render: (className) => <PaymentSheet className={className} />,
  },
  {
    key: "address",
    kind: "sheet",
    render: (className) => (
      <AddressSheet currentAddress={ADDRESS} className={className} />
    ),
  },
  { key: "invites", kind: "link", label: "Приглашения", value: "2", href: "/invites" },
  { key: "journal", kind: "link", label: "Журнал", value: "Фрэнк", href: "/health" },
  {
    key: "faq",
    kind: "sheet",
    render: (className) => <FaqSheet className={className} />,
  },
];

const NOTIFICATIONS = [
  {
    id: "delivery",
    title: "Доставки",
    description: "за час до приезда",
    defaultChecked: true,
  },
  {
    id: "report",
    title: "Ежемесячный отчёт",
    description: "раз в месяц",
    defaultChecked: true,
  },
  {
    id: "club",
    title: "Жизнь клуба",
    description: "ужины и события",
    defaultChecked: false,
  },
];

const rowClassName = (isLast: boolean) =>
  `flex w-full items-center justify-between gap-4 py-4 text-left active:opacity-60 ${
    isLast ? "" : "border-b border-grey-100"
  }`;

export default function Profile() {
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    () => Object.fromEntries(NOTIFICATIONS.map((n) => [n.id, n.defaultChecked])),
  );

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white pb-32">
      <div className="flex flex-col items-center rounded-b-3xl bg-gradient-700 px-8 pt-[calc(2rem+env(safe-area-inset-top))] pb-8">
        <PetAvatar name={OWNER_NAME} />

        <h1 className="mt-4 font-display text-subtitle text-dark">{OWNER_NAME}</h1>

        <div className="mt-8 flex gap-12">
          <div className="flex flex-col items-start">
            <span className="text-caption-s uppercase text-grey-400">В клубе</span>
            <span className="mt-1 text-body-m text-dark">с июля 2026</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-caption-s uppercase text-grey-400">Питомец</span>
            <span className="mt-1 text-body-m text-dark">тоже</span>
          </div>
        </div>

        <Status variant="neutral" className="mt-4 text-dark!">
          Cat lives matter
        </Status>
      </div>

      <div className="px-margin">
        <div className="mt-6 rounded-3xl border border-grey-100 bg-grey px-6">
          {ROWS.map((row, index) => {
            const className = rowClassName(index === ROWS.length - 1);

            if (row.kind === "sheet") {
              return <Fragment key={row.key}>{row.render(className)}</Fragment>;
            }

            return (
              <Link key={row.key} href={row.href} className={className}>
                <span className="text-body-m text-dark">{row.label}</span>
                <span className="flex items-center gap-2">
                  {row.value && (
                    <span className="text-body-s text-grey-300">{row.value}</span>
                  )}
                  <ArrowUpRightIcon className="h-4 w-4 text-dark" />
                </span>
              </Link>
            );
          })}
        </div>

        <h2 className="mt-8 font-display text-h2 text-dark">Уведомления</h2>

        <div className="mt-4">
          {NOTIFICATIONS.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center justify-between gap-4 py-4 ${
                index < NOTIFICATIONS.length - 1 ? "border-b border-grey-100" : ""
              }`}
            >
              <div className="flex flex-col gap-4">
                <span className="text-body-m text-dark">{item.title}</span>
                <span className="text-caption text-grey-300">{item.description}</span>
              </div>
              <Switch
                checked={notifications[item.id]}
                onChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, [item.id]: checked }))
                }
                label={item.title}
              />
            </div>
          ))}
        </div>

        <Logo className="mx-auto mt-10 h-[35.5px] w-[77.73px] opacity-30" />
      </div>
    </div>
  );
}
