"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import GlassLayer from "@/components/GlassLayer";
import { GLASS_COMMON } from "@/lib/glass";
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
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const activeIndex = Math.max(
    0,
    TABS.findIndex((tab) => pathname.startsWith(tab.href)),
  );

  return (
    <nav
      aria-label="Основная навигация"
      className="bottom-nav fixed bottom-[calc(8px+env(safe-area-inset-bottom))] left-1/2 z-10 flex h-16 w-72 -translate-x-1/2 items-center justify-center gap-2 overflow-hidden rounded-[48px] p-2 will-change-transform"
    >
      <div
        aria-hidden
        className="bottom-nav-tab backdrop-glass absolute left-0 top-2 z-0 h-12 w-12 overflow-hidden rounded-full transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `translateX(${8 + activeIndex * 56}px)` }}
      >
        <GlassLayer tokens={GLASS_COMMON} />
      </div>

      {TABS.map((tab, index) => (
        <Link
          key={tab.label}
          href={tab.href}
          aria-label={tab.label}
          aria-current={index === activeIndex ? "page" : undefined}
          className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
        >
          <Image
            src={tab.icon}
            alt=""
            draggable={false}
            className={`h-[18px] w-[18px] transition-opacity duration-300 ${
              index === activeIndex ? "opacity-100" : "opacity-40"
            }`}
          />
        </Link>
      ))}
    </nav>
  );
}
