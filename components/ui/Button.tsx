import Link from "next/link";
import type { ButtonProps, ButtonVariant } from "@/types/button";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "gap-3 bg-white/60 backdrop-blur-md bg-gradient-button-primary shadow-button active:bg-white-70 active:shadow-button-pressed disabled:bg-none disabled:shadow-none",
  // Нажатие secondary меняет только цвет текста, фон остаётся Grey/Grey
  secondary: "gap-2 bg-grey",
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

  const classes = `flex ${sizing} items-center justify-center rounded-4xl ${iconOnly ? "" : "px-4 py-2.5"} text-body-m text-dark transition-colors active:text-grey-400 disabled:bg-grey-100 disabled:text-white ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
