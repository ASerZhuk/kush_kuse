"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Glass, type GlassOptics } from "@samasante/liquid-glass";
import homeIcon from "@/app/assets/home.svg";
import carIcon from "@/app/assets/car.svg";
import heartIcon from "@/app/assets/heart.svg";
import messageIcon from "@/app/assets/message.svg";
import userIcon from "@/app/assets/user.svg";

const TABS = [
  { icon: homeIcon, label: "Главная" },
  { icon: carIcon, label: "Доставка" },
  { icon: heartIcon, label: "Здоровье" },
  { icon: messageIcon, label: "Чат" },
  { icon: userIcon, label: "Профиль" },
];

/**
 * Оптика бара. Отличается от «панели над фото» из примеров библиотеки: бар
 * широкий (~358×64), а на широкой панели растянутая линза раздувается овалом
 * в центре. Поэтому curvature и strength занижены — работу берёт на себя bend,
 * то есть преломление узкой полосой по самой кромке.
 */
const BAR_LENS: Partial<GlassOptics> = {
  mapSize: 512,
  depth: 0.8,
  curvature: 0.12,
  strength: 0.05,
  dispersion: 0.4,
  bend: 0.5,
  bendWidth: 0.3,
  // frost строго 0. Уже на значении 2 он заливает бар ровным средне-серым —
  // это и был «эффекта нет»: линза работала, но её накрывало плитой. Проверено
  // перебором: при frost:0 и тех же остальных оптиках преломление видно.
  // Молочность вместо него даёт CSS-градиент на слое иконок, как в примерах
  // самой библиотеки.
  frost: 0,
  brightness: 0.18,
  specular: 0.3,
  sheen: 0.3,
  glow: 0.1,
};

type Box = { w: number; h: number; left: number; top: number };

/**
 * Запас копии за габаритами бара, px.
 *
 * Полоса преломления по контуру (bend) тянет пиксели снаружи коробки. Если копия
 * обрывается ровно по краю, линза на кромке хватает пустоту, и расщепление
 * каналов (dispersion) превращает эту границу в синюю кайму по всей ширине.
 * С запасом под кромкой всегда лежит настоящий контент.
 *
 * Клон дополнительно смещён внутрь тем же отступом, иначе слева не хватило бы
 * места: до края экрана там всего 16px, и прокрутка ушла бы в минус.
 */
const BLEED = 24;

/**
 * Минимальный интервал между пересборками копии, мс.
 *
 * Полный клон страницы — самая дорогая операция здесь, поэтому поток обновлений
 * с бэка не должен превращаться в поток клонирований. 200мс глазом не ловится:
 * содержимое под стеклом и так размыто преломлением.
 */
const REBUILD_INTERVAL_MS = 200;

/**
 * Таб-бар как настоящая линза.
 *
 * Почему не backdrop-filter: преломлять произвольный контент ЗА fixed-панелью
 * умеет только Chromium, в WebKit `backdrop-filter: url()` не поддерживается.
 * Поэтому бар преломляет не фон, а собственную КОПИЮ контента страницы —
 * `filter: url()` по своим пикселям работает во всех движках.
 *
 * Копия — живой клон DOM, а не скриншот: пересобирается по мутациям страницы.
 *
 * Два неочевидных ограничения определяют всю конструкцию:
 *
 * 1. Бар рендерится порталом в body, а не на месте. Иначе он попадает внутрь
 *    #app-content, клон начинает включать сам себя, а MutationObserver ловит
 *    собственную запись клона и зацикливается.
 * 2. Клон сдвигается прокруткой обёртки, а не left/top и не transform. Safari
 *    снимает SVG-фильтр с элемента, который репозиционируют покадрово, —
 *    об этом прямо предупреждает исходник библиотеки. scrollTop к тому же не
 *    вызывает перекладку огромного клонированного поддерева.
 */
export default function GlassTabBar({ activeIndex = 0 }: { activeIndex?: number }) {
  const navRef = useRef<HTMLElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [box, setBox] = useState<Box | null>(null);

  useEffect(() => setMounted(true), []);

  /** Подкрутить клон так, чтобы под стеклом оказался нужный кусок страницы. */
  const align = useCallback(() => {
    const mirror = mirrorRef.current;
    const nav = navRef.current;
    const content = document.getElementById("app-content");
    if (!mirror || !nav || !content) return;

    const c = content.getBoundingClientRect();
    const n = nav.getBoundingClientRect();
    mirror.scrollLeft = n.left - c.left;
    mirror.scrollTop = n.top - c.top;
  }, []);

  /** Пересобрать клон. Дорого, поэтому только по мутациям, не по скроллу. */
  const rebuild = useCallback(() => {
    const mirror = mirrorRef.current;
    const content = document.getElementById("app-content");
    if (!mirror || !content) return;

    const clone = content.cloneNode(true) as HTMLElement;
    // id в клоне сделали бы документ невалидным и сломали бы getElementById
    clone.removeAttribute("id");
    clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
    // ширину фиксируем: внутри узкой прокручиваемой обёртки клон иначе схлопнется
    clone.style.width = `${content.getBoundingClientRect().width}px`;
    clone.style.flex = "none";

    // Отступ сдвигает клон внутрь ровно на запас, поэтому прокрутка остаётся
    // положительной и совпадает с координатами бара без поправок
    const padded = document.createElement("div");
    padded.style.padding = `${BLEED}px`;
    padded.style.width = "max-content";
    padded.appendChild(clone);

    mirror.replaceChildren(padded);
    align();
  }, [align]);

  // Геометрия бара: её задаёт CSS, а Glass выставляется по измеренной коробке
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const measure = () => {
      const r = nav.getBoundingClientRect();
      setBox({
        w: Math.round(r.width),
        h: Math.round(r.height),
        left: Math.round(r.left),
        top: Math.round(r.top),
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(nav);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [mounted]);

  useEffect(() => {
    if (!box) return;
    rebuild();

    const content = document.getElementById("app-content");
    if (!content) return;

    // Мутации сыплются пачками (гидрация, загрузка картинок, живые данные).
    // Схлопываем в кадр и не чаще REBUILD_INTERVAL_MS — полный клон дорогой.
    //
    // Фильтровать мутации по попаданию в зону бара заманчиво, но неверно:
    // вставка блока в начало страницы сдвигает вниз всё остальное, под стеклом
    // оказывается другой контент, а сама мутация происходит далеко от бара и
    // такую проверку не проходит. Поэтому ограничиваем частоту, а не охват.
    let pending = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let last = 0;

    const schedule = () => {
      const wait = Math.max(0, REBUILD_INTERVAL_MS - (Date.now() - last));
      clearTimeout(timer);
      timer = setTimeout(() => {
        cancelAnimationFrame(pending);
        pending = requestAnimationFrame(() => {
          last = Date.now();
          rebuild();
        });
      }, wait);
    };

    const mo = new MutationObserver(schedule);
    mo.observe(content, {
      childList: true,
      subtree: true,
      attributes: true,
      // класс, стиль и src меняют картинку; на остальные атрибуты (aria-*,
      // data-*, id) отражению реагировать незачем
      attributeFilter: ["class", "style", "src", "srcset"],
      characterData: true,
    });

    return () => {
      mo.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(pending);
    };
  }, [box, rebuild]);

  // Скролл двигает только прокрутку клона — пересборка тут была бы неподъёмной
  useEffect(() => {
    if (!box) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(align);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [box, align]);

  if (!mounted) return null;

  return createPortal(
    <>
      {box && box.w > 0 && (
        <Glass
          optics={BAR_LENS}
          live
          width={box.w}
          height={box.h}
          radius={box.h / 2}
          behind="#ffffff"
          refract={
            <div
              ref={mirrorRef}
              aria-hidden
              style={{
                position: "absolute",
                // копия шире бара на BLEED с каждой стороны — см. комментарий
                // к константе; лишнее библиотека потом обрежет clip-path'ом
                inset: -BLEED,
                overflow: "hidden",
                pointerEvents: "none",
              }}
            />
          }
          style={{
            position: "fixed",
            left: box.left,
            top: box.top,
            width: box.w,
            height: box.h,
            borderRadius: box.h / 2,
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      )}

      {/* Чёткий слой поверх линзы: иконки плюс сам материал стекла — молочный
          градиент, кромка и тень. Оптика линзы даёт только преломление; frost
          из неё заливал бы бар ровным серым, а сам автор в примерах строит
          кромку и веяло именно на CSS поверх линзы, а не внутри неё. */}
      <nav
        ref={navRef}
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.16) 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 1px rgba(255,255,255,0.5), inset 0 0 24px rgba(255,255,255,0.4), 0 6px 16px rgba(0,0,0,0.13), 0 1px 3px rgba(0,0,0,0.1)",
        }}
        className="fixed inset-x-4 bottom-[calc(8px+env(safe-area-inset-bottom))] z-10 mx-auto flex max-w-89.5 items-center justify-between gap-2 rounded-full p-2"
      >
        {TABS.map((tab, index) => (
          <button
            key={tab.label}
            type="button"
            aria-label={tab.label}
            aria-current={index === activeIndex ? "page" : undefined}
            className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full ${
              index === activeIndex
                ? "bg-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_0_0_1px_rgba(255,255,255,0.85),0_1px_3px_rgba(0,0,0,0.1)]"
                : ""
            }`}
          >
            <Image
              src={tab.icon}
              alt=""
              className={`relative z-10 h-5 w-5 ${index === activeIndex ? "" : "opacity-40"}`}
            />
          </button>
        ))}
      </nav>
    </>,
    document.body,
  );
}
