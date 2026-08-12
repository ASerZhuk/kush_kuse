import type { ReactNode } from "react";

export type StatusVariant = "success" | "error" | "warning" | "info";

const variantClasses: Record<StatusVariant, string> = {
  success: "bg-success-100 text-success-200",
  error: "bg-error-100 text-error-200",
  warning: "bg-warning-100 text-warning-200",
  info: "bg-info-100 text-info-200",
};

export default function Status({
  variant = "success",
  className = "",
  children,
}: {
  variant?: StatusVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex h-5.5 items-center justify-center gap-2.5 rounded-2xl px-2 text-caption-s uppercase ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
