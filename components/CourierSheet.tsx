"use client";

import Image from "next/image";
import BottomSheet from "@/components/BottomSheet";
import Button from "@/components/ui/Button";
import checkIcon from "@/app/assets/check.svg";

const STEPS = [
  { title: "Собран на нашей кухне", time: "сегодня, 08:40", done: true },
  { title: "Передан курьеру", time: "сегодня, 12:15", done: true },
  { title: "Приедет к вам", time: "завтра, 10:00–14:00", done: false },
];

export default function CourierSheet({ className = "" }: { className?: string }) {
  return (
    <BottomSheet
      trigger={(open) => (
        <Button variant="primary" className={className} onClick={open}>
          Где курьер
        </Button>
      )}
    >
      {() => (
        <>
          <h2 className="font-display text-subtitle text-dark">Доставка</h2>

          <ul className="mt-6 flex flex-col">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  {step.done ? (
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-dark">
                      <Image src={checkIcon} alt="" className="h-2.5 w-2.5 invert" />
                    </span>
                  ) : (
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-grey-50">
                      <span className="h-2 w-2 rounded-full bg-primary-100" />
                    </span>
                  )}
                  {index < STEPS.length - 1 && (
                    <span className="my-1 h-3 w-px rounded-full bg-grey-200" />
                  )}
                </div>
                <div className={`flex flex-col ${index < STEPS.length - 1 ? "pb-4" : ""}`}>
                  <span className="mb-4 text-body-m text-grey-500">{step.title}</span>
                  <span className="text-caption text-grey-300">{step.time}</span>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-body text-grey-300">
            Курьер предупредит за час и подождёт, сколько нужно.
          </p>
        </>
      )}
    </BottomSheet>
  );
}
