import type { NextConfig } from "next";

/**
 * Заголовки безопасности. CSP намеренно не задаём: liquid glass строит
 * backdrop-filter из data:-URI с SVG-фильтром и инлайн-стилей, а строгий
 * `style-src`/`img-src` их отрежет — это ломает визуал, а не защищает.
 * Остальное — дешёвые и полностью совместимые с текущей вёрсткой заголовки.
 */
const securityHeaders = [
  // Запрещаем браузеру угадывать MIME-тип: залитая картинка не сможет
  // «превратиться» в исполняемый скрипт.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Защита от clickjacking: приложение нигде не встраивается в iframe.
  { key: "X-Frame-Options", value: "DENY" },
  // Referer на сторонние домены — только origin, без пути с параметрами
  // (в них ходит имя питомца и прочие данные анкеты).
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // camera=(self) оставлен намеренно: на /invite/accepted есть
  // <input capture="environment"> для съёмки питомца.
  {
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  // Проверка вёрстки с телефона в одной Wi-Fi сети: без этого dev-сервер
  // блокирует отдачу /_next/* по IP, страница приходит без JS и не гидрируется.
  allowedDevOrigins: ["192.168.0.108"],
  // Не раскрываем стек в заголовке X-Powered-By.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
