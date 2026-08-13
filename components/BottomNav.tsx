"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import GlassLayer from "@/components/GlassLayer";
import homeIcon from "@/app/assets/home.svg";
import carIcon from "@/app/assets/car.svg";
import heartIcon from "@/app/assets/heart.svg";
import messageIcon from "@/app/assets/message.svg";
import userIcon from "@/app/assets/user.svg";

const TABS = [
  { icon: homeIcon, label: "Главная", href: "/home" },
  { icon: carIcon, label: "Доставка", href: "/ration" },
  { icon: heartIcon, label: "Здоровье", href: "/health" },
  { icon: messageIcon, label: "Чат", href: "/chat" },
  { icon: userIcon, label: "Профиль", href: "/profile" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const activeIndex = Math.max(
    0,
    TABS.findIndex((tab) => pathname.startsWith(tab.href)),
  );

  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pillX, setPillX] = useState<number>();

  // Пилюля — один смонтированный элемент, который едет между табами
  // translateX'ом, а не перемонтируется на каждый таб: так GlassLayer не
  // пересоздаёт SVG-фильтр при каждом переключении, и эффект не мигает.
  useLayoutEffect(() => {
    const nav = navRef.current;
    const active = itemRefs.current[activeIndex];
    if (!nav || !active) return;

    const measure = () => {
      setPillX(active.getBoundingClientRect().left - nav.getBoundingClientRect().left);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    return () => observer.disconnect();
  }, [activeIndex]);

  return (
    // will-change-transform + translateZ(0) поднимают бар на отдельный GPU-слой:
    // на Firefox/Safari backdrop-filter пересчитывает размытие фона заново на
    // каждый кадр скролла, если элемент не закреплён за своим слоем — отсюда
    // дёрганье. С отдельным слоем браузер композитит уже готовый слой поверх
    // скроллящегося контента вместо перерисовки блюра каждый кадр.
    <nav
      ref={navRef}
      className="fixed inset-x-4 bottom-[calc(8px+env(safe-area-inset-bottom))] z-10 mx-auto flex max-w-89.5 items-center justify-between gap-2 overflow-hidden rounded-full p-2 backdrop-glass will-change-transform transform-[translateZ(0)]"
    >
      {/* Дефолты (chromaticAberration 2, strength 26, blur 1) на контрастных
          иконках под баром давали цветные разводы вместо мягкого стекла —
          смещение снижено и блюр поднят, чтобы деталь фона гасла раньше, чем
          успевает разъехаться по каналам. chromaticAberration=1 — по вкусу:
          едва заметный цветной кант по кромке, а не полноценные разводы. */}
      <GlassLayer depth={8} strength={12} chromaticAberration={1} blur={4} />

      {pillX !== undefined && (
        <div
          className="absolute left-0 top-2 z-10 h-12 w-12 overflow-hidden rounded-full backdrop-glass backdrop-glass-sm transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: `translateX(${pillX}px)` }}
        >
          <GlassLayer depth={5} strength={8} chromaticAberration={1} blur={4} />
        </div>
      )}

      {TABS.map((tab, index) => (
        <button
          key={tab.label}
          type="button"
          onClick={() => router.push(tab.href)}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          aria-label={tab.label}
          aria-current={index === activeIndex ? "page" : undefined}
          className="relative z-20 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full"
        >
          <Image
            src={tab.icon}
            alt=""
            className={`relative z-10 h-5 w-5 transition-opacity duration-300 ${index === activeIndex ? "" : "opacity-40"
              }`}
          />
        </button>
      ))}
    </nav>
  );
}
