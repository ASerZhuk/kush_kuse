"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import closeIcon from "@/app/assets/close.svg";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISSED_KEY = "pwa-install-dismissed";
const ALLOWED_PATHS = ["/", "/home"];

export default function InstallPrompt() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  // Скрыто, пока не проверили платформу: уже установленному приложению и
  // тому, кто закрыл промо в этой сессии, показывать нечего.
  const [suppressed, setSuppressed] = useState(true);

  // Промо живёт только на входных экранах. Гасить его состоянием из эффекта
  // при уходе не нужно — достаточно не рисовать компонент.
  const onAllowedPath = ALLOWED_PATHS.includes(pathname);

  useEffect(() => {
    if (!onAllowedPath) return;

    // Платформенные API читаем только после монтирования: на сервере нет ни
    // navigator, ни sessionStorage.
    const syncPlatform = () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as { standalone?: boolean }).standalone === true;

      if (isStandalone || sessionStorage.getItem(DISMISSED_KEY)) return false;

      setSuppressed(false);
      setIsIOS(
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window),
      );
      return true;
    };

    if (!syncPlatform()) return;

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () =>
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, [onAllowedPath]);

  const dismiss = () => {
    sessionStorage.setItem(DISMISSED_KEY, "1");
    setSuppressed(true);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    // Один и тот же prompt() нельзя вызвать дважды — событие израсходовано,
    // и промо на этом исчезает.
    setDeferredPrompt(null);
  };

  // В iOS нет beforeinstallprompt — там показываем инструкцию «Поделиться →
  // На экран Домой». В остальных браузерах ждём событие, которое даёт
  // нативный диалог установки. Условие выводится, а не хранится отдельным
  // состоянием: иначе на iOS промо возвращалось при возврате на /home,
  // а на Android — нет.
  const visible =
    onAllowedPath && !suppressed && (isIOS || deferredPrompt !== null);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-[calc(88px+env(safe-area-inset-bottom))] z-50 mx-auto flex max-w-89.5 items-center gap-3 rounded-3xl bg-white p-4 shadow-tabs backdrop-blur-md">
      <div className="flex flex-1 flex-col">
        <span className="text-body-m text-dark">Установите Kosh Kusé</span>
        <span className="mt-1 text-caption-s text-grey-300">
          {isIOS
            ? "Нажмите «Поделиться», затем «На экран Домой»"
            : "Быстрый доступ с главного экрана"}
        </span>
      </div>

      {!isIOS && (
        <button
          type="button"
          onClick={install}
          className="flex-none rounded-full bg-grey px-4 py-2 text-body-m text-dark"
        >
          Установить
        </button>
      )}

      <button
        type="button"
        aria-label="Закрыть"
        onClick={dismiss}
        className="flex h-6 w-6 flex-none items-center justify-center"
      >
        <Image src={closeIcon} alt="" className="h-4 w-4" />
      </button>
    </div>
  );
}
