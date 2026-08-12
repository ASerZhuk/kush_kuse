"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import closeIcon from "@/app/assets/close.svg";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISSED_KEY = "pwa-install-dismissed";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;
    const dismissed = sessionStorage.getItem(DISMISSED_KEY);

    if (isStandalone || dismissed) return;

    const iOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !("MSStream" in window);
    setIsIOS(iOS);
    if (iOS) setVisible(true);

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        onBeforeInstallPrompt,
      );
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-[calc(88px+env(safe-area-inset-bottom))] z-50 mx-auto flex max-w-100 items-center gap-3 rounded-3xl bg-white p-4 shadow-tabs backdrop-blur-md">
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
