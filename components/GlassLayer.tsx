"use client";

import { useEffect, useRef, useState } from "react";
import { getDisplacementFilter } from "@/lib/liquidGlass";

type Props = {
  /** Радиус скругления родителя в px (для пилюли — половина высоты). */
  radius?: number;
  /** Толщина «стенки» линзы: чем больше, тем шире преломляющая кромка. */
  depth?: number;
  /** Сила смещения. */
  strength?: number;
  chromaticAberration?: number;
  blur?: number;
  saturate?: number;
  brightness?: number;
};

/** WebKit (Safari, все браузеры на iOS) — не Chromium, у которого движок тот же. */
const isWebKit = () =>
  typeof navigator !== "undefined" &&
  /AppleWebKit/.test(navigator.userAgent) &&
  !/Chrome|Chromium|Edg|OPR/.test(navigator.userAgent);

/**
 * Safari не умеет url() внутри backdrop-filter — там остаётся обычный blur.
 * Проверять одним лишь парсингом значения нельзя: Safari 18 свойство
 * распознаёт и значение возвращает, но SVG-фильтр не применяет — вышло бы
 * прозрачное стекло вместо размытия. Поэтому WebKit отсекаем явно.
 */
const supportsBackdropFilterUrl = () => {
  if (isWebKit()) return false;
  const el = document.createElement("div");
  el.style.cssText = "backdrop-filter: url(#test)";
  return (
    el.style.backdropFilter === "url(#test)" ||
    el.style.backdropFilter === 'url("#test")'
  );
};

export default function GlassLayer({
  radius,
  depth = 10,
  strength = 26,
  chromaticAberration = 2,
  blur = 1,
  saturate = 1.6,
  brightness = 1.06,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<string>();

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    if (!supportsBackdropFilterUrl()) {
      // Преломления нет — компенсируем размытием и насыщенностью, иначе
      // элемент читается как плоская полупрозрачная заливка
      setFilter(
        `blur(${Math.max(8, blur * 4)}px) saturate(${saturate + 0.2}) brightness(${brightness})`,
      );
      return;
    }

    const redraw = () => {
      const rect = parent.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      if (!width || !height) return;

      const r = radius ?? height / 2;
      const url = getDisplacementFilter({
        width,
        height,
        radius: r,
        depth,
        strength,
        chromaticAberration,
      });
      setFilter(
        `blur(${blur / 2}px) url('${url}') blur(${blur}px) brightness(${brightness}) saturate(${saturate})`,
      );
    };

    redraw();
    const observer = new ResizeObserver(redraw);
    observer.observe(parent);
    return () => observer.disconnect();
  }, [radius, depth, strength, chromaticAberration, blur, saturate, brightness]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
      style={
        filter
          ? // WebkitBackdropFilter обязателен: до Safari 18 без префикса
            // свойство просто игнорируется, и стекло пропадает целиком
            { backdropFilter: filter, WebkitBackdropFilter: filter }
          : undefined
      }
    />
  );
}
