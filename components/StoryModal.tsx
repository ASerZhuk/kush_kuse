"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Image, { type StaticImageData } from "next/image";
import logoMark from "@/app/assets/Logo.svg";
import closeIcon from "@/app/assets/close.svg";

const TRANSITION_MS = 350;

export default function StoryModal({
  photo,
  title,
  body,
  children,
}: {
  photo: StaticImageData;
  title: string;
  body: string;
  children: ReactNode;
}) {
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
        aria-label={`Открыть историю: ${title}`}
        onClick={open}
        className="contents"
      >
        {children}
      </button>

      {mounted &&
        createPortal(
          <div
            onClick={close}
            className={`fixed inset-0 z-50 flex flex-col bg-gradient-300 transition-[opacity,transform] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              visible ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
          >
            <div className="flex items-center justify-between px-6 pt-[calc(29px+env(safe-area-inset-top))]">
              <span className="h-6 w-6" aria-hidden />
              <Image src={logoMark} alt="Kosh Kusé" className="h-4.5 w-7" />
              <button
                type="button"
                aria-label="Закрыть"
                onClick={close}
                className="flex h-6 w-6 items-center justify-center"
              >
                <Image src={closeIcon} alt="" className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mx-auto mt-16 flex h-84 w-85.5 justify-center gap-2 overflow-hidden">
              <div className="relative h-84 w-85.5">
                <Image
                  src={photo}
                  alt=""
                  fill
                  priority
                  className="object-cover object-[50%_46%]"
                />
              </div>
            </div>

            <div className="relative mt-8 px-margin pb-[calc(2rem+env(safe-area-inset-bottom))]">
              <h1 className="mb-4 font-display text-h1 text-dark">{title}</h1>
              <p className="mb-16 text-body text-grey-400">{body}</p>
              <p className="text-center text-caption text-grey-300">
                Коснитесь, чтобы закрыть
              </p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
