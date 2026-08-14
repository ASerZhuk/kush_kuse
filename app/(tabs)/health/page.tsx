"use client";

import { useState } from "react";
import Image from "next/image";
import AddEventSheet from "@/components/AddEventSheet";
import Button from "@/components/ui/Button";
import GlassLayer from "@/components/GlassLayer";
import Status from "@/components/ui/Status";
import CheckIcon from "@/components/icons/CheckIcon";
import catPhoto from "@/app/assets/temporary/4198c60aabe1247b9ab2cc3d90498749dc36c40e.png";
import penIcon from "@/app/assets/pen.svg";

const STATS = [
  { label: "Порода", value: "Метис" },
  { label: "Возраст", value: "3 года" },
  { label: "Вес", value: "4.2 кг" },
  { label: "Стерилизация", value: "Есть" },
];

const WEIGHT_MONTHS = ["мар", "апр", "май", "июн", "июл"];
const WEIGHT_POINTS = [
  { x: 10, y: 18 },
  { x: 75, y: 34 },
  { x: 140, y: 42 },
  { x: 205, y: 56 },
  { x: 270, y: 68 },
];
const WEIGHT_PATH = WEIGHT_POINTS.map((p) => `${p.x},${p.y}`).join(" ");

const INITIAL_EVENTS = [
  { id: "weighing", title: "Взвешивание", description: "4.2 кг" },
  { id: "vaccine", title: "Прививка", description: "Комплексная, ревакцинация" },
  {
    id: "docs",
    title: "Документ · анализы",
    description: "Биохимия крови — приложен файл",
  },
  { id: "procedure", title: "Процедура", description: "Стрижка когтей" },
];

export default function Health() {
  const [events, setEvents] = useState(INITIAL_EVENTS);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white pb-32">
      <div>
        <div className="flex flex-col items-center rounded-b-3xl bg-gradient-600 px-8 pt-[calc(2rem+env(safe-area-inset-top))] pb-6">
          <div className="relative">
            <div className="h-28.5 w-29.5 overflow-hidden rounded-4xl bg-white p-1">
              <Image
                src={catPhoto}
                alt="Фрэнк"
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

          <h2 className="mt-4 font-display text-subtitle text-dark">Фрэнк</h2>

          <Button
            variant="primary"
            fullWidth={false}
            className="mt-4 w-73.75 max-w-75"
            style={{ gap: "16px" }}
          >
            <Image src={penIcon} alt="" className="h-4 w-4" />
            Внести изменения
          </Button>

          <div className="mt-8 grid w-full grid-cols-2 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-caption-s uppercase text-grey-400">
                  {stat.label}
                </span>
                <span className="mt-1 text-body-m text-dark">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between px-6">
          <h1 className="font-display text-h2 text-dark">Вес</h1>
          <Status variant="success">Стабилен</Status>
        </div>

        <div className="mx-6 mt-6 rounded-3xl bg-grey p-6">
          <svg
            viewBox="0 0 280 90"
            className="w-full overflow-visible text-primary-100"
            fill="none"
          >
            <polyline
              points={WEIGHT_PATH}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {WEIGHT_POINTS.map((p, index) => (
              <circle
                key={index}
                cx={p.x}
                cy={p.y}
                r="4"
                fill="currentColor"
                stroke="#ffffff"
                strokeWidth="2"
              />
            ))}
          </svg>
          <div className="mt-3 flex justify-between text-caption text-grey-300">
            {WEIGHT_MONTHS.map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between px-6">
          <h1 className="font-display text-h2 text-dark">События</h1>
          <AddEventSheet
            onAdd={(event) =>
              setEvents((prev) => [
                { id: `${Date.now()}`, ...event },
                ...prev,
              ])
            }
          />
        </div>

        <ul className="mt-6 flex flex-col gap-1 px-6">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 flex-none items-center justify-center gap-2.5 rounded-2xl bg-gradient-300 p-2.5 text-dark">
                  <CheckIcon className="h-4 w-4" />
                </span>
                <div className="flex flex-col">
                  <span className="text-body-m text-dark">{event.title}</span>
                  <span className="text-caption text-grey-300">
                    {event.description}
                  </span>
                </div>
              </div>
              <span className="flex-none text-caption text-grey-300">
                Первый месяц
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-6 px-6 text-body text-grey-300">
          Анализы пока храним как документы. Разбор человеческим языком появится
          вместе с ветеринарным уходом Kosh Kusé.
        </p>
      </div>
    </div>
  );
}
