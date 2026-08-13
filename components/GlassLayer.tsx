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

/** Настоящий Firefox — движок Gecko (десктоп, Android). */
const isFirefox = () =>
  typeof navigator !== "undefined" && /Firefox/.test(navigator.userAgent);

/**
 * Любой браузер, вынужденно работающий на движке WebKit: Safari, а на iOS —
 * ВООБЩЕ ЛЮБОЙ браузер, включая Firefox и Chrome. Apple требует от всех
 * браузеров в App Store использовать системный WebKit, поэтому у Firefox для
 * iOS в User-Agent стоит "FxiOS", а не "Firefox" — под своим брендом там
 * всегда чужой движок. isFirefox() эту строку не ловит, и без отдельной
 * проверки на WebKit iOS-Firefox проваливался в тот же баг, что и Safari:
 * блюра не было вообще.
 */
const isWebKit = () =>
  typeof navigator !== "undefined" &&
  /AppleWebKit/.test(navigator.userAgent) &&
  !/Chrome|Chromium|Edg|OPR/.test(navigator.userAgent);

/**
 * Safari (и любой другой WebKit на iOS) не умеет url() внутри backdrop-filter
 * — там остаётся обычный blur. Firefox — своя история, см. isFirefox().
 *
 * Проверка через эхо CSSOM (задать cssText и прочитать style.backdropFilter
 * обратно) тут не работает как feature-detect: url() формально входит в
 * грамматику <filter-value-list>, и WebKit с Firefox синтаксически принимают
 * и возвращают строку, хотя SVG-фильтр через backdrop-filter не рисуют вообще.
 * Detection врал — говорил true там, где рендера нет. У нас фильтр ссылается
 * на data-URI с фрагментом (url('data:...#displace')), эту конструкцию оба
 * движка не резолвят, и в результате пропадал даже обычный blur — не только
 * смещение. Поэтому оба движка отсекаются явно, до похода в CSSOM.
 */
const supportsBackdropFilterUrl = () => {
  if (isFirefox() || isWebKit()) return false;
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
      // ×1.5 (было ×3 = 12px при blur=4). Тяжёлый блюр здесь двойная цена:
      // сильнее размывает деталь ЗА кромкой линзы (в Chromium это скрывает
      // displacement-фильтр, тут прятать нечего) и дороже перерисовывается
      // каждый кадр скролла на Firefox/Safari — просили снизить оба сразу.
      setFilter(`blur(${blur * 1.5}px) saturate(${saturate}) brightness(${brightness})`);
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
          ? // WebkitBackdropFilter обязателен: до Safari 18 (и на всех
            // iOS-браузерах, которые внутри тот же WebKit) свойство без
            // префикса игнорируется целиком, а React инлайн-стили сам не
            // префиксует
            { backdropFilter: filter, WebkitBackdropFilter: filter }
          : undefined
      }
    />
  );
}
