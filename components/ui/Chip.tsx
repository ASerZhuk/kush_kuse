import type { ButtonHTMLAttributes } from "react";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export default function Chip({
  selected = false,
  className = "",
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`flex h-12 items-center justify-center gap-2 rounded-[32px] px-4 py-2.5 text-body-m transition-colors ${
        selected ? "bg-grey-500 text-white" : "bg-grey text-dark"
      } ${className}`}
      {...props}
    />
  );
}
