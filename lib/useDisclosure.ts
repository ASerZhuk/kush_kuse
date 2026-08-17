"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Механика открытия шторки/модалки с анимацией: `mounted` держит узел в DOM,
 * `visible` переключает классы перехода, а размонтирование откладывается на
 * длительность анимации, чтобы закрытие успело проиграться.
 *
 * Пока окно открыто, Escape закрывает его — иначе модалку нельзя убрать
 * с клавиатуры.
 */
export function useDisclosure(transitionMs: number) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const open = useCallback(() => {
    clearTimeout(closeTimeout.current);
    setMounted(true);
    // Два кадра: первый монтирует узел в закрытом состоянии, второй меняет
    // класс — иначе браузер схлопнет оба в один и перехода не будет.
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    closeTimeout.current = setTimeout(() => setMounted(false), transitionMs);
  }, [transitionMs]);

  useEffect(() => () => clearTimeout(closeTimeout.current), []);

  useEffect(() => {
    if (!mounted) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mounted, close]);

  return { mounted, visible, open, close };
}
