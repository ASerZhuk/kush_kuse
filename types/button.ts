import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  href?: string;
  iconOnly?: boolean;
  fullWidth?: boolean;
  /** Необязательный подзаголовок под основным текстом (напр. цена). */
  subtitle?: ReactNode;
}
