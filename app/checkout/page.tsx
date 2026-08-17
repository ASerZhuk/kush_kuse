"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import CardFields, { EMPTY_CARD, isCardFilled } from "@/components/CardFields";
import Chip from "@/components/ui/Chip";
import Eyebrow from "@/components/ui/Eyebrow";
import Input from "@/components/ui/Input";
import { useSubscription } from "@/components/SubscriptionContext";
import { cardLast4 } from "@/lib/formatCard";
import ArrowLeftIcon from "@/components/icons/ArrowLeftIcon";
import CheckIcon from "@/components/icons/CheckIcon";
import pen from "@/app/assets/pen.svg";
import plus from "@/app/assets/plus.svg";

enum Step {
  Address,
  Card,
  Review,
  Success,
}

/** Шаг, на который уводит стрелка «назад». Success её не показывает. */
const PREVIOUS_STEP: Record<Step, Step> = {
  [Step.Address]: Step.Address,
  [Step.Card]: Step.Address,
  [Step.Review]: Step.Card,
  [Step.Success]: Step.Review,
};

const STEPS_COUNT = 3;

const DATES = ["5 авг, вт", "7 авг, чт"];
const DATES_FULL = ["вторник, 5 августа", "четверг, 7 августа"];
const WINDOWS = ["10:00–14:00", "14:00–18:00"];

const DEFAULT_ADDRESS = "Малая Бронная, 12";

/** Три точки-индикатора шага в шапке. */
function StepDots({ step }: { step: Step }) {
  return (
    <div className="flex items-center justify-center gap-1">
      {Array.from({ length: STEPS_COUNT }, (_, index) => (
        <span
          key={index}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            index === step ? "w-4 bg-dark" : "w-1.5 bg-grey-200"
          }`}
        />
      ))}
    </div>
  );
}

/** Карточка выбора адреса: рамка-градиент у выбранной, иконка слева,
 * галочка/плюс справа. Отличаются только иконка и содержимое. */
function AddressOption({
  selected,
  icon,
  className,
  onClick,
  children,
}: {
  selected: boolean;
  icon: ReactNode;
  className: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <div className={`${className} rounded-3xl ${selected ? "bg-gradient-300 p-0.5" : ""}`}>
      <div className="rounded-3xl bg-white">
        <button
          type="button"
          onClick={onClick}
          className="flex w-full items-center gap-4 rounded-3xl bg-grey p-4"
        >
          <div
            className={`flex h-10 w-10 flex-none items-center justify-center rounded-2xl ${
              selected ? "bg-gradient-300" : "bg-grey-50"
            }`}
          >
            {icon}
          </div>

          {children}

          {selected ? (
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-4xl bg-grey-500 p-2.5">
              <CheckIcon className="h-3 w-3 text-white" />
            </div>
          ) : (
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-4xl bg-grey">
              <Image src={plus} alt="" className="h-3 w-3" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

export default function Checkout() {
  const { activate } = useSubscription();
  const [step, setStep] = useState<Step>(Step.Address);

  const [date, setDate] = useState(0);
  const [slot, setSlot] = useState(0);
  const [otherAddress, setOtherAddress] = useState(false);
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [card, setCard] = useState(EMPTY_CARD);

  const canContinue =
    !otherAddress || (street.trim() !== "" && apartment.trim() !== "");

  const addressSummary = otherAddress
    ? [street, apartment].filter(Boolean).join(", ")
    : DEFAULT_ADDRESS;

  const summary = [
    { label: "Рецепт", value: "Треска свежего улова · 76 г/день" },
    { label: "Дополнительно", value: "Молочная вода · Снеки из трески" },
    { label: "Адрес", value: addressSummary },
    {
      label: "Доставка",
      value: `${DATES_FULL[date]} · ${WINDOWS[slot]}, дальше раз в две недели`,
    },
    { label: "Карта", value: `···· ${cardLast4(card.number)}` },
    { label: "Первый месяц", value: "в подарок" },
    { label: "С 5 августа", value: "18 000 ₽/мес" },
  ];

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white pb-8">
      {step !== Step.Success && (
        <div className="grid grid-cols-[auto_1fr_auto] items-center px-margin pt-[calc(1.5rem+env(safe-area-inset-top))]">
          {step === Step.Address ? (
            <Button variant="ghost" iconOnly href="/ration">
              <ArrowLeftIcon />
            </Button>
          ) : (
            <Button
              variant="ghost"
              iconOnly
              onClick={() => setStep(PREVIOUS_STEP[step])}
            >
              <ArrowLeftIcon />
            </Button>
          )}

          <StepDots step={step} />

          <div className="h-12 w-12" />
        </div>
      )}

      {step === Step.Address && (
        <div className="px-margin">
          <h1 className="mt-6 font-display text-h2 text-dark">Куда привозить</h1>

          <p className="mt-4 text-body text-grey-300">
            Раз в две недели, свежее — с нашей кухни.
            <br />
            Курьер предупредит за час.
          </p>

          <AddressOption
            className="mt-6"
            selected={!otherAddress}
            onClick={() => setOtherAddress(false)}
            icon={<CheckIcon className="h-3 w-3 text-dark" />}
          >
            <div className="flex flex-1 flex-col text-left">
              <span className="text-body-m text-dark">Туда же, куда привозим сейчас</span>
              <span className="mt-1 text-caption text-grey-300">Малая Бронная, 12, кв.40</span>
            </div>
          </AddressOption>

          <AddressOption
            className="mt-3"
            selected={otherAddress}
            onClick={() => setOtherAddress(true)}
            icon={<Image src={pen} alt="" className="h-4 w-4" />}
          >
            <span className="flex-1 text-left text-body-m text-dark">Другой адрес</span>
          </AddressOption>

          {otherAddress && (
            <div className="mt-3 flex flex-col gap-3">
              <Input
                placeholder="Улица и дом"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
              <Input
                placeholder="Квартира и этаж"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
              />
            </div>
          )}

          <Eyebrow className="mt-8" items={["Первая доставка по подписке"]} />

          <div className="mt-3 flex gap-3">
            {DATES.map((label, index) => (
              <Chip key={label} selected={date === index} onClick={() => setDate(index)}>
                {label}
              </Chip>
            ))}
          </div>

          <Eyebrow className="mt-6" items={["Окно"]} />

          <div className="mt-3 flex gap-3">
            {WINDOWS.map((label, index) => (
              <Chip key={label} selected={slot === index} onClick={() => setSlot(index)}>
                {label}
              </Chip>
            ))}
          </div>

          <p className="mt-6 text-body text-grey-300">
            Дальше доставка будет приезжать раз в две недели в этот же день.
            Поменять — в два касания. Курьер предупредит за час:{" "}
            <span className="whitespace-nowrap">+7 921 555-01-20</span>.
          </p>

          <Button
            variant="primary"
            className="mt-8"
            disabled={!canContinue}
            onClick={() => setStep(Step.Card)}
          >
            Дальше · карта
          </Button>
        </div>
      )}

      {step === Step.Card && (
        <div className="px-margin">
          <h1 className="mt-6 font-display text-h2 text-dark">Карта для подписки</h1>

          <p className="mt-4 text-body text-grey-300">
            Сегодня спишем 0 ₽ — идёт месяц в подарок. Подписка начнётся 5
            августа, напомним за три дня.
          </p>

          <p className="mt-6 text-caption text-grey-300">Введите данные новой карты</p>

          <CardFields className="mt-3" value={card} onChange={setCard} />

          <p className="mt-6 text-body text-grey-300">
            Платежи проводит ЮКасса, чек придёт на{" "}
            <span className="whitespace-nowrap">+7 921 555-01-20</span>. Пауза
            и отмена — в два касания, без звонков и объяснений.
          </p>

          <Button
            variant="primary"
            className="mt-8"
            disabled={!isCardFilled(card)}
            onClick={() => setStep(Step.Review)}
          >
            Привязать карту
          </Button>
        </div>
      )}

      {step === Step.Review && (
        <div className="px-margin">
          <h1 className="mt-6 font-display text-h2 text-dark">Проверьте</h1>

          <p className="mt-4 text-body text-grey-300">
            Всё уже собрано — осталось одно касание.
          </p>

          <div className="mt-6 rounded-3xl bg-grey px-6">
            {summary.map((row, index) => (
              <div
                key={row.label}
                className={`flex items-start justify-between gap-4 py-4 ${
                  index < summary.length - 1 ? "border-b border-grey-100" : ""
                }`}
              >
                <span className="flex-none text-body-s text-grey-300">{row.label}</span>
                <span className="text-body-s text-dark text-right">{row.value}</span>
              </div>
            ))}
          </div>

          <Button
            variant="primary"
            className="mt-8"
            onClick={() => {
              activate();
              setStep(Step.Success);
            }}
          >
            Оформить подписку
          </Button>

          <p className="mt-4 text-caption text-grey-300">
            Если ей не подойдёт вкус — вернём деньги за первый оплаченный месяц.
          </p>
        </div>
      )}

      {step === Step.Success && (
        <div className="flex flex-1 flex-col justify-center px-margin">
          <CheckIcon className="mx-auto mb-8 block h-8 w-8 text-dark" />

          <h1 className="font-display text-h1 text-dark">Стол накрыт</h1>

          <p className="mt-4 text-body text-grey-300">
            Подписка оформлена. Первая доставка по подписке —{" "}
            {DATES_FULL[date]}, {WINDOWS[slot]}. Курьер предупредит за час.
          </p>

          <p className="mt-4 text-caption text-grey-300">
            До 5 августа списаний не будет — идёт месяц в подарок.
          </p>

          <Button variant="primary" className="mt-6" href="/ration">
            Готово
          </Button>
        </div>
      )}
    </div>
  );
}
