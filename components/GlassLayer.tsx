"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { getDisplacementFilter } from "@/lib/liquidGlass";
import { glassGeometry, type GlassTokens } from "@/lib/glass";

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
  /**
   * Токены стиля из Figma. Если заданы, вытесняют depth/strength/
   * chromaticAberration/blur: те выводятся из размера элемента, поэтому
   * задавать их в пикселях руками на каждом вызове не нужно.
   */
  tokens?: GlassTokens;
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
  tokens,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<string>();
  const [isWithinViewport, setIsWithinViewport] = useState(true);

  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    const supportsUrl = supportsBackdropFilterUrl();

    /* Chromium подмешивает фон браузера в backdrop-filter, если стеклянный
       элемент частично выходит за visual viewport. На экране это выглядит
       как серая полоса, втянутая внутрь линзы. Пока элемент пересекает край,
       оставляем заливку, фаску и тень, но не просим браузер преломлять пиксели
       за пределами страницы. */
    const updateViewportState = () => {
      const rect = parent.getBoundingClientRect();
      const viewport = window.visualViewport;
      const top = viewport?.offsetTop ?? 0;
      const left = viewport?.offsetLeft ?? 0;
      const right = left + (viewport?.width ?? document.documentElement.clientWidth);
      const bottom = top + (viewport?.height ?? document.documentElement.clientHeight);

      setIsWithinViewport(
        rect.top >= top &&
          rect.left >= left &&
          rect.bottom <= bottom &&
          rect.right <= right,
      );
    };

    const redraw = () => {
      if (!supportsUrl) {
        // Смещения backdrop здесь не будет: остаются стандартные функции.
        // Frost из Figma уже задан в пикселях, поэтому переносим его без
        // дополнительного множителя и не усиливаем размытие в fallback.
        const fallbackBlur = tokens?.frost ?? blur;
        setFilter(
          `blur(${fallbackBlur}px) saturate(${saturate}) brightness(${brightness})`,
        );
        return;
      }

      const rect = parent.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      if (!width || !height) return;

      const geometry = tokens
        ? glassGeometry(tokens, Math.min(width, height))
        : { depth, strength, chromaticAberration, blur };

      const r = radius ?? height / 2;
      const url = getDisplacementFilter({
        width,
        height,
        radius: r,
        depth: geometry.depth,
        strength: geometry.strength,
        chromaticAberration: geometry.chromaticAberration,
      });

      setFilter(
        `url('${url}') blur(${geometry.blur}px) brightness(${brightness}) saturate(${saturate})`,
      );
    };

    updateViewportState();
    redraw();
    const observer = new ResizeObserver(() => {
      updateViewportState();
      redraw();
    });
    observer.observe(parent);

    const intersectionObserver = new IntersectionObserver(updateViewportState, {
      threshold: [0.999, 1],
    });
    intersectionObserver.observe(parent);
    window.visualViewport?.addEventListener("resize", updateViewportState);
    window.visualViewport?.addEventListener("scroll", updateViewportState);

    return () => {
      observer.disconnect();
      intersectionObserver.disconnect();
      window.visualViewport?.removeEventListener("resize", updateViewportState);
      window.visualViewport?.removeEventListener("scroll", updateViewportState);
    };
    // tokens приходит модульной константой (GLASS_COMMON), поэтому по ссылке
    // стабилен и эффект от него не перезапускается на каждый рендер.
  }, [radius, depth, strength, chromaticAberration, blur, saturate, brightness, tokens]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
      style={
        filter && isWithinViewport
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
