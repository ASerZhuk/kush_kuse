import type { ReactNode } from "react";

/**
 * Мелкая uppercase-подпись (Caption-S). Один сегмент — просто текст
 * (`children`); несколько — через `items`, каждый следующий отделяется
 * точкой-разделителем 4×4px (по умолчанию rgba(25,25,25,1) — `bg-dark`,
 * как в макете "Отчёт • Июль" / "Рацион • Фрэнк"). Цвет текста и цвет
 * точки заданы раздельно (`textClassName`/`dotClassName`), т.к. на
 * практике не всегда совпадают: напр. серый текст с тёмной точкой.
 */
type EyebrowProps = {
  className?: string;
  textClassName?: string;
  dotClassName?: string;
  items?: ReactNode[];
  children?: ReactNode;
};

export default function Eyebrow({
  className = "",
  textClassName = "text-grey-400",
  dotClassName = "bg-dark",
  items,
  children,
}: EyebrowProps) {
  const segments = items ?? (children !== undefined ? [children] : []);

  return (
    <span
      className={`flex items-center gap-1 text-caption-s uppercase ${textClassName} ${className}`}
    >
      {segments.map((segment, index) => (
        <span key={index} className="flex items-center gap-1">
          {index > 0 && <span className={`h-1 w-1 rounded-full ${dotClassName}`} />}
          {segment}
        </span>
      ))}
    </span>
  );
}
