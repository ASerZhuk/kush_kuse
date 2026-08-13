"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Button from "@/components/ui/Button";
import checkIcon from "@/app/assets/check.svg";

const ITEMS = [
  "Рацион выдержан — 31 день из 31",
  "Молочная вода — её дневная норма",
  "Вес стабилен: 4.2 кг",
  "Поводов для тревоги нет",
];

const TRANSITION_MS = 300;

export default function ReportSheet({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const open = () => {
    clearTimeout(closeTimeout.current);
    setMounted(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  };

  const close = () => {
    setVisible(false);
    closeTimeout.current = setTimeout(() => setMounted(false), TRANSITION_MS);
  };

  useEffect(() => () => clearTimeout(closeTimeout.current), []);

  return (
    <>
      <button
        type="button"
        aria-label="Открыть отчёт"
        onClick={open}
        className="relative z-10 block w-full text-left"
      >
        {children}
      </button>

      {mounted &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <button
              type="button"
              aria-label="Закрыть"
              onClick={close}
              className={`absolute inset-0 bg-dark/40 transition-opacity duration-300 ${
                visible ? "opacity-100" : "opacity-0"
              }`}
            />

            <div
              className={`relative w-full max-w-md rounded-t-[40px] bg-white p-8 pb-[calc(2rem+env(safe-area-inset-bottom))] transition-transform duration-300 ease-out ${
                visible ? "translate-y-0" : "translate-y-full"
              }`}
            >
              <h2 className="font-display text-h2 text-dark">
                Отчёт за июль
              </h2>

              <ul className="mt-6 flex flex-col gap-4">
                {ITEMS.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-dark">
                      <Image src={checkIcon} alt="" className="h-2.5 w-2.5 invert" />
                    </span>
                    <span className="text-body-m text-dark">{item}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-body text-grey-300">
                Вы — хорошая мама.
                <br />— Kosh Kusé
              </p>

              <Button variant="secondary" className="mt-8" onClick={close}>
                Спасибо
              </Button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
