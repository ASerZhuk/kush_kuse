"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AddressSheet from "@/components/AddressSheet";
import FaqSheet from "@/components/FaqSheet";
import PaymentSheet from "@/components/PaymentSheet";
import GlassLayer from "@/components/GlassLayer";
import Logo from "@/components/Logo";
import Status from "@/components/ui/Status";
import Switch from "@/components/ui/Switch";
import ArrowUpRightIcon from "@/components/icons/ArrowUpRightIcon";
import catPhoto from "@/app/assets/temporary/4198c60aabe1247b9ab2cc3d90498749dc36c40e.png";
import penIcon from "@/app/assets/pen.svg";

const LINKS = [
  { label: "Подписка", value: "месяц в подарок", href: "/ration" },
  { label: "Оплата", value: "-", href: "payment" },
  { label: "Адрес", value: "Малая Бронная, 12", href: "address" },
  { label: "Приглашения", value: "2", href: "/invites" },
  { label: "Журнал", value: "Фрэнк", href: "/health" },
  { label: "Частые вопросы", value: null, href: "faq" },
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

export default function Profile() {
  const [notifications, setNotifications] = useState(
    Object.fromEntries(NOTIFICATIONS.map((n) => [n.id, n.defaultChecked])),
  );

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white pb-32">
      <div className="flex flex-col items-center rounded-b-3xl bg-gradient-700 px-8 pt-[calc(2rem+env(safe-area-inset-top))] pb-8">
        <div className="relative">
          <div className="h-28.5 w-29.5 overflow-hidden rounded-4xl bg-white p-1">
            <Image
              src={catPhoto}
              alt="Елизавета"
              sizes="118px"
              className="h-full w-full origin-[50%_18%] scale-180 rounded-[26px] object-cover object-top"
            />
          </div>
          <button
            type="button"
            aria-label="Изменить фото"
            className="backdrop-glass backdrop-glass-sm absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full"
          >
            <GlassLayer depth={4} strength={10} chromaticAberration={1} blur={2} />
            <Image src={penIcon} alt="" className="relative z-10 h-4 w-4" />
          </button>
        </div>

        <h1 className="mt-4 font-display text-subtitle text-dark">Елизавета</h1>

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
          {LINKS.map((link, index) => {
            const rowClassName = `flex w-full items-center justify-between gap-4 py-4 text-left active:opacity-60 ${
              index < LINKS.length - 1 ? "border-b border-grey-100" : ""
            }`;
            const content = (
              <>
                <span className="text-body-m text-dark">{link.label}</span>
                <span className="flex items-center gap-2">
                  {link.value && (
                    <span className="text-body-s text-grey-300">{link.value}</span>
                  )}
                  <ArrowUpRightIcon className="h-4 w-4 text-dark" />
                </span>
              </>
            );

            if (link.href === "faq") {
              return <FaqSheet key={link.label} className={rowClassName} />;
            }

            if (link.href === "payment") {
              return <PaymentSheet key={link.label} className={rowClassName} />;
            }

            if (link.href === "address") {
              return (
                <AddressSheet
                  key={link.label}
                  currentAddress={link.value ?? ""}
                  className={rowClassName}
                />
              );
            }

            return link.href ? (
              <Link key={link.label} href={link.href} className={rowClassName}>
                {content}
              </Link>
            ) : (
              <button key={link.label} type="button" className={rowClassName}>
                {content}
              </button>
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
