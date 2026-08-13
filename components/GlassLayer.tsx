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

/** Firefox (не путать с Chromium/WebKit — свой движок Gecko). */
const isFirefox = () =>
  typeof navigator !== "undefined" && /Firefox/.test(navigator.userAgent);

/**
 * Safari не умеет url() внутри backdrop-filter — там остаётся обычный blur.
 *
 * Проверка через эхо CSSOM (задать cssText и прочитать style.backdropFilter
 * обратно) тут не работает как feature-detect: url() формально входит в
 * грамматику <filter-value-list>, и Firefox синтаксически принимает и
 * возвращает строку, хотя SVG-фильтр через backdrop-filter не рисует вообще.
 * Detection врал — говорил true там, где рендера нет. У нас fetch/фильтр
 * ссылается на data-URI с фрагментом (url('data:...#displace')), Firefox эту
 * конструкцию не резолвит, и в результате пропадал даже обычный blur —
 * не только смещение. Поэтому Firefox, как и WebKit, отсекается явно.
 */
const supportsBackdropFilterUrl = () => {
  if (isFirefox()) return false;
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
      // Раньше здесь стояли захардкоженные blur(12px) saturate(1.8) —
      // пропы blur/saturate/brightness сюда не долетали вообще, поэтому их
      // подкрутка на странице никак не влияла на Safari. Смещения и цветной
      // аберрации тут всё равно не будет: backdrop-filter умеет только
      // стандартные функции (blur, saturate, brightness...), а не произвольный
      // SVG-фильтр с раздельным сдвигом каналов — это ограничение WebKit,
      // а не то, что можно докрутить пропом.
      // ×3, чтобы при текущих значениях (blur=4) получить те же 12px, что
      // были зашиты раньше, — дальше крутится пропом вместе с остальным.
      setFilter(`blur(${blur * 3}px) saturate(${saturate}) brightness(${brightness})`);
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
      style={filter ? { backdropFilter: filter } : undefined}
    />
  );
}
