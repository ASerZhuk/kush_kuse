import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonBase = {
  variant?: ButtonVariant;
  iconOnly?: boolean;
  fullWidth?: boolean;
  /** Необязательный подзаголовок под основным текстом (напр. цена). */
  subtitle?: ReactNode;
};

/** Кнопка-ссылка: рендерится как `Link`, принимает атрибуты `<a>`. */
type ButtonAsLink = ButtonBase &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

/**
 * Обычная кнопка. `href?: never` разводит два варианта: раньше тип допускал
 * `href` вместе с `onClick`/`disabled`, а рендер ссылки их молча выбрасывал —
 * обработчик просто не срабатывал, и ошибку было видно только в браузере.
 */
type ButtonAsButton = ButtonBase &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

export type ButtonProps = ButtonAsLink | ButtonAsButton;
