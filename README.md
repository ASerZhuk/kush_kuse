This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## UI Kit

Токены и компоненты синхронизированы с Figma-макетом. Источник токенов — `app/globals.css` (Tailwind v4 `@theme`).

### Цвета

| Токен | Значение | Tailwind-класс |
| --- | --- | --- |
| `--color-white` | `#ffffff` | `bg-white` / `text-white` |
| `--color-white-70` | `rgba(255,255,255,.7)` | `bg-white/70` |
| `--color-dark` | `#191919` | `text-dark` |
| `--color-dark-45` | `rgba(0,0,0,.45)` | `bg-dark/45` |
| `--color-grey` | `rgba(157,157,157,.05)` | `bg-grey` (фон карточек) |
| `--color-grey-50…500` | `#f1f0f0 → #333333` | `text-grey-300`, `bg-grey-100` и т.д. |
| `--color-success-100/200` | `#cff2dc` / `#2ba057` | `Status variant="success"` |
| `--color-error-100/200` | `#fbe0e0` / `#b51717` | `Status variant="error"` |
| `--color-warning-100/200` | `#fde8d2` / `#f67f09` | `Status variant="warning"` |
| `--color-info-100/200` | `#e3ebf9` / `#2d67d2` | `Status variant="info"` |

### Типографика

Шрифт: `SF Pro Text` (текст `<20px`, `font-sans`) / `SF Pro Display` (заголовки `≥20px`, `font-display`), подключены через `next/font` из `app/fonts`.

| Класс | Размер | line-height | weight | tracking |
| --- | --- | --- | --- | --- |
| `text-h1` | 28px | 120% | 510 | — |
| `text-h2` | 25px | 120% | 400 | — |
| `text-subtitle` | 20px | 130% | 500 | -0.02em |
| `text-body-l` | 18px | 140% | 400 | -0.02em |
| `text-body-m` | 16px | 140% | 400 | -0.02em |
| `text-body` | 16px | 140% | 274 | -0.02em |
| `text-body-s` | 14px | 140% | 400 | -0.03em |
| `text-caption` | 12px | 140% | 400 | — |
| `text-caption-s` | 9px | 150% | 510 | uppercase |

### Градиенты и тени

- `bg-gradient-100…500`, `bg-gradient-story`, `bg-gradient-icon`, `bg-gradient-tabs`, `bg-gradient-toast-success`, `bg-gradient-{info,warning,success,error}` — см. `@theme`/`:root` в `globals.css`; часть градиентов (например `gradient-200`) подобрана вручную по замерам макета, т.к. Figma теряет поворот эллипса при экспорте `radial-gradient`.
- `--gradient-300` — `linear-gradient(135deg, #edeef0 0%, #ffc6d5 150%)`, фон полноэкранной сторис-модалки (`StoryModal`); стоп розового вынесен за 100%, чтобы у центра дольше держался серо-белый.
- `--gradient-toast-success` — `linear-gradient(90deg, #e5faee 0%, rgba(255,255,255,0) 100%)`, подложка 88×64 под иконкой в success-тосте (`Toast`).
- `shadow-button` / `shadow-button-pressed` — тень кнопки в состояниях enabled/pressed.
- `shadow-tabs` — тень стеклянной панели (аналог Figma `effectStyleEffect2`).

### Liquid glass

Собственная реализация стекла — **не** сырой CSS `backdrop-filter: blur()` из Figma, а `GlassLayer` (`components/GlassLayer.tsx`): SVG-фильтр с картой смещения (`lib/liquidGlass.ts`) даёт эффект преломления, с фоллбэком на обычный blur в Safari/Firefox (там `url()` внутри `backdrop-filter` не работает).

Утилиты в `globals.css`:
- `.backdrop-glass` — база (тонкая заливка + внешняя тень + бликовый купол на `::after`).
- `.backdrop-glass-sm` — вариант для мелких элементов (32px круги): заливка слабее, тень мягче.
- `.backdrop-glass-grey` — серое стекло для второстепенных элементов.

Используется в `BottomNav`, кнопке-стрелке (`arrow-up.svg`), `ReportSheet` и `Toast`.

### Компоненты (`components/ui`, `components/icons`, `components/*`)

| Компонент | Назначение |
| --- | --- |
| `Button` | `variant`: `primary` (градиент + тень, розовый акцент через `disabled`/`active`) / `secondary` (плоский, `bg-grey`); поддерживает `href` (рендерится как `Link`), `iconOnly`, `fullWidth` |
| `Status` | Пилюля-бейдж, `variant`: `success` / `error` / `warning` / `info` |
| `Chip` | Тоггл-чип (`selected` меняет заливку с `bg-grey` на `bg-grey-500`) |
| `Input` | Текстовое поле с состоянием `error`/`errorMessage` |
| `Toast` | Success-уведомление (`backdrop-glass` + `GlassLayer`, `gradient-toast-success` под иконкой), автоскрытие через 3с |
| `StoryModal` | Полноэкранная модалка сторис (portal, `gradient-300`), scale+fade появление за 350мс на `cubic-bezier(0.22,1,0.36,1)` |
| `GlassLayer` | SVG-based liquid glass слой (см. выше) |
| `BottomNav` | Общий нижний таббар (5 вкладок), активная — со стеклянным кружком |
| `ArrowLeftIcon`, `CheckIcon`, `CheckCircleIcon` | SVG-иконки как React-компоненты (`stroke="currentColor"`) |

Остальные иконки — статические SVG в `app/assets/*.svg`, подключаются через `next/image`.
