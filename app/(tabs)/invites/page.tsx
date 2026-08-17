"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Status from "@/components/ui/Status";
import Toast from "@/components/ui/Toast";
import ArrowLeftIcon from "@/components/icons/ArrowLeftIcon";

const INVITES = [
  {
    code: "KUSE • ELIZAVETA • 01",
    status: "free" as const,
    description: "Личное приглашение — одно на одну семью.",
  },
  {
    code: "KUSE • ELIZAVETA • 02",
    status: "claimed" as const,
    description: "Принято · Марина и кот Барон",
  },
];

export default function Invites() {
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (!toastVisible) return;
    const timeout = setTimeout(() => setToastVisible(false), 3000);
    return () => clearTimeout(timeout);
  }, [toastVisible]);

  // navigator.clipboard есть только в secure context (https/localhost) и может
  // отказать по политике браузера. Без обработки промис падал необработанной
  // ошибкой, а тост «скопировано» показался бы даже с пустым буфером.
  const shareInvite = async (code: string) => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(`Приглашение в Kosh Kusé: ${code}`);
      setToastVisible(true);
    } catch {
      // Копирование недоступно — тост не показываем.
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white pb-32">
      <div className="px-margin pt-[calc(1.5rem+env(safe-area-inset-top))]">
        <div className="flex items-center gap-4">
          <Button variant="ghost" iconOnly href="/home">
            <ArrowLeftIcon />
          </Button>
          <h1 className="font-display text-subtitle text-dark">
            Приглашения
          </h1>
        </div>

        <p className="mt-6 text-body text-grey-300">
          Клуб растёт по рекомендации. У вас два приглашения — и только вы
          решаете, кому их отдать.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          {INVITES.map((invite) => (
            <div key={invite.code} className="rounded-3xl bg-grey p-8">
              <div className="flex justify-end">
                {invite.status === "free" ? (
                  <Status variant="neutral">Свободно</Status>
                ) : (
                  <Status variant="success">В клубе</Status>
                )}
              </div>

              <h2 className="mt-4 font-display text-subtitle text-dark">
                {invite.code}
              </h2>

              <p className="mt-2 text-body text-grey-300">
                {invite.description}
              </p>

              {invite.status === "free" && (
                <Button
                  variant="primary"
                  className="mt-6"
                  onClick={() => shareInvite(invite.code)}
                >
                  Поделиться
                </Button>
              )}
            </div>
          ))}
        </div>

        <p className="mt-6 text-body text-grey-300">
          Когда оба приглашения найдут своих, мы доверим вам новые. Клуб
          растёт не рекламой — доверием.
        </p>
      </div>

      {toastVisible && (
        <Toast
          message="Ссылка-приглашение скопирована"
          onClose={() => setToastVisible(false)}
        />
      )}
    </div>
  );
}
