import Link from "next/link";
import GlassLayer from "@/components/GlassLayer";
import type { ButtonProps, ButtonVariant } from "@/types/button";

const variantClasses: Record<ButtonVariant, string> = {
  // Единый стиль для всех основных действий: жидкое стекло без собственной
  // заливки и блика (см. .backdrop-glass-clear) — только преломление фона
  // через GlassLayer и тень для объёма. Disable — Grey/Grey 100 сплошной,
  // тут стекло намеренно выключается, чтобы состояние читалось однозначно.
  primary:
    "gap-1 text-dark backdrop-glass backdrop-glass-clear active:opacity-70 disabled:bg-grey-100 disabled:shadow-none disabled:text-white",
  // Grey/Grey (--color-grey, 5% непрозрачности — тот же токен, что у card-фонов
  // по всему приложению) — не Grey/Grey 100, тот сплошной и был слишком
  // заметным. Тени в макете у secondary нет вообще: она плоская, приподнята
  // только primary. На нажатии темнеет до сплошного Grey/Grey 100.
  secondary: "gap-2 text-dark bg-grey active:bg-grey-100",
  // Без фона и тени вообще — напр. стрелка "назад" в шапке.
  ghost: "gap-2 text-dark active:opacity-60",
};

export default function Button({
  variant = "secondary",
  href,
  iconOnly = false,
  fullWidth = true,
  subtitle,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const hasSubtitle = Boolean(subtitle);
  const sizing = iconOnly
    ? "h-12 w-12 flex-none"
    : fullWidth
      ? `mx-auto w-full max-w-75 ${hasSubtitle ? "" : "h-12"}`
      : `flex-1 ${hasSubtitle ? "" : "h-12"}`;
  // Пилюля с подзаголовком высоту не фиксирует — её задают отступы
  // (16 сверху/снизу, 10 по бокам), а не жёсткий h-16.
  const padding = iconOnly ? "" : hasSubtitle ? "px-2.5 py-2.5" : "px-4 py-2.5";

  const glass = variant === "primary";
  const classes = `relative flex ${sizing} items-center justify-center rounded-4xl ${glass ? "overflow-hidden" : ""} ${padding} text-body-m transition-colors active:text-grey-400 ${variantClasses[variant]} ${className}`;

  const inner = (
    <>
      {glass && (
        <GlassLayer
          depth={5}
          strength={6}
          chromaticAberration={1}
          blur={3}
          saturate={1}
          brightness={1}
        />
      )}
      <span className="relative z-10 flex flex-col items-center justify-center gap-0.5">
        <span className={`flex items-center justify-center ${hasSubtitle ? "" : "gap-[inherit]"}`}>
          {children}
        </span>
        {subtitle && (
          <span className="text-caption-s uppercase text-dark/50">{subtitle}</span>
        )}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {inner}
    </button>
  );
}
