import Link from "next/link";
import GlassLayer from "@/components/GlassLayer";
import { GLASS_COMMON } from "@/lib/glass";
import type { ButtonProps, ButtonVariant } from "@/types/button";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "button-primary text-dark backdrop-glass backdrop-glass-clear",
  secondary: "button-secondary text-dark",
  shadow: "button-shadow text-dark",
  // Старое имя сохраняем для существующих экранов; в Figma вариант
  // называется Shadow.
  ghost: "button-shadow text-dark",
};

export default function Button(props: ButtonProps) {
  const {
    variant = "secondary",
    size = "l",
    iconOnly = false,
    fullWidth = true,
    subtitle,
    className = "",
    children,
    ...rest
  } = props;

  const hasSubtitle = Boolean(subtitle);
  const figmaVariant = variant === "ghost" ? "shadow" : variant;
  const fixedSize = size === "s" ? "h-10" : "h-12";
  const contentHeight = hasSubtitle
    ? size === "s"
      ? "h-10"
      : "min-h-12"
    : fixedSize;
  const sizing = iconOnly
    ? `${fixedSize} ${size === "s" ? "w-10" : "w-12"} flex-none`
    : fullWidth
      ? `mx-auto w-full max-w-75 ${contentHeight}`
      : `flex-1 ${contentHeight}`;
  const padding = iconOnly ? "" : size === "s" ? "px-3 py-1" : "px-4 py-2.5";
  const typography = size === "s" ? "text-body-s" : "text-body-m";
  const captionGap = size === "s" ? "gap-0.5" : "gap-3";

  const glass = figmaVariant === "primary";
  const classes = `button-ui relative flex ${sizing} items-center justify-center rounded-4xl ${glass ? "overflow-hidden" : ""} ${padding} ${typography} transition-colors ${variantClasses[variant]} ${className}`;

  const inner = (
    <>
      {glass && (
        <span
          aria-hidden
          className="button-glass-fill pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
        />
      )}
      {/* saturate/brightness близко к нейтральным: в макете подложка внутри
          пилюли по тону совпадает с карточкой, а не подкрашивается. */}
      {glass && (
        <GlassLayer tokens={GLASS_COMMON} saturate={1.15} brightness={1} />
      )}
      <span
        className={`relative z-10 flex items-center justify-center ${hasSubtitle ? `flex-col ${captionGap}` : ""}`}
      >
        <span className="button-label flex h-5 items-center justify-center gap-2">
          {children}
        </span>
        {subtitle && (
          <span className="button-caption text-caption-s uppercase text-grey-400">
            {subtitle}
          </span>
        )}
      </span>
    </>
  );

  if (rest.href !== undefined) {
    const { href, ...anchorProps } = rest;
    return (
      <Link
        href={href}
        className={classes}
        data-variant={figmaVariant}
        data-size={size}
        {...anchorProps}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      data-variant={figmaVariant}
      data-size={size}
      {...rest}
    >
      {inner}
    </button>
  );
}
