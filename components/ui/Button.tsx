import Link from "next/link";
import GlassLayer from "@/components/GlassLayer";
import type { ButtonProps, ButtonVariant } from "@/types/button";

const variantClasses: Record<ButtonVariant, string> = {
  // Стекло как у таб-бара: преломление даёт GlassLayer, фаска — .backdrop-glass
  primary:
    "gap-3 overflow-hidden backdrop-glass active:shadow-button-pressed disabled:bg-none disabled:shadow-none",
  // То же стекло, но заливка серая — чтобы secondary читалась иначе primary.
  // Нажатие меняет только цвет текста, фон остаётся Grey/Grey
  secondary: "gap-2 overflow-hidden backdrop-glass backdrop-glass-grey",
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

  // disabled-фон задаётся через переменные стекла: обычный disabled:bg-*
  // проигрывает background-color из .backdrop-glass
  const classes = `relative flex ${sizing} items-center justify-center rounded-4xl ${iconOnly ? "" : "px-4 py-2.5"} text-body-m text-dark transition-colors active:text-grey-400 disabled:[--glass-rgb:230,230,230] disabled:[--glass-tint:1] disabled:text-white ${variantClasses[variant]} ${className}`;

  const inner = (
    <>
      <GlassLayer depth={8} strength={20} chromaticAberration={2} blur={1} />
      <span className="relative z-10 flex items-center justify-center gap-[inherit]">
        {children}
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
