import Link from "next/link";
import type { ButtonProps, ButtonVariant } from "@/types/button";

const variantClasses: Record<ButtonVariant, string> = {
  // Значения из макета (Figma): Enable — Gradient/Gradient 200 (тот самый
  // едва заметный градиент, не сплошной белый — отсюда была слабая
  // видимость), Pressed — White 70% + shadow-button-pressed (готовый токен,
  // ровно те же цифры), Disable — Grey/Grey 100 сплошной. bg-none в active/
  // disabled чистит слой градиента, иначе он остаётся под сплошной заливкой.
  primary:
    "gap-3 bg-gradient-200 shadow-button active:bg-none active:bg-white/70 active:shadow-button-pressed disabled:bg-none disabled:bg-grey-100 disabled:shadow-none disabled:text-white",
  // Grey/Grey (--color-grey, 5% непрозрачности — тот же токен, что у card-фонов
  // по всему приложению) — не Grey/Grey 100, тот сплошной и был слишком
  // заметным. Тени в макете у secondary нет вообще: она плоская, приподнята
  // только primary. На нажатии темнеет до сплошного Grey/Grey 100.
  secondary: "gap-2 bg-grey active:bg-grey-100",
};

export default function Button({
  variant = "secondary",
  href,
  iconOnly = false,
  fullWidth = true,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const sizing = iconOnly
    ? "h-12 w-12 flex-none"
    : fullWidth
      ? "mx-auto h-12 w-full max-w-75"
      : "h-12 flex-1";

  const classes = `relative flex ${sizing} items-center justify-center rounded-4xl ${iconOnly ? "" : "px-4 py-2.5"} text-body-m text-dark transition-colors active:text-grey-400 ${variantClasses[variant]} ${className}`;

  const inner = (
    <span className="relative z-10 flex items-center justify-center gap-[inherit]">
      {children}
    </span>
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
