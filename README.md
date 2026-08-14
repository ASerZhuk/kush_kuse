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
| `--color-primary-100/200` | `#fd779f` / `#ffc6d5` | розовый акцент бренда (напр. точка ожидающего шага в `CourierSheet`, кружок выбранного адреса на `/checkout`) |

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
- `--gradient-300` — `linear-gradient(150deg, #edeef0 0%, #ffc6d5 250%)`, фон полноэкранной сторис-модалки (`StoryModal`) и карточки подписки на `/ration`; стоп розового вынесен далеко за 100%, чтобы у центра дольше держался серо-белый.
- `--gradient-toast-success` — `linear-gradient(90deg, #e5faee 0%, rgba(255,255,255,0) 100%)`, подложка 88×64 под иконкой в success-тосте (`Toast`).
- `shadow-button` / `shadow-button-pressed` — тень кнопки в состояниях enabled/pressed.
- `shadow-tabs` — тень стеклянной панели (аналог Figma `effectStyleEffect2`).

### Liquid glass

Собственная реализация стекла — **не** сырой CSS `backdrop-filter: blur()` из Figma, а `GlassLayer` (`components/GlassLayer.tsx`): SVG-фильтр с картой смещения (`lib/liquidGlass.ts`) даёт эффект преломления, с фоллбэком на обычный blur в Safari/Firefox (там `url()` внутри `backdrop-filter` не работает).

Утилиты в `globals.css`:
- `.backdrop-glass` — база (тонкая заливка + внешняя тень + бликовый купол на `::after`).
- `.backdrop-glass-sm` — вариант для мелких элементов (32px круги): заливка слабее, тень мягче.
- `.backdrop-glass-grey` — серое стекло для второстепенных элементов.
- `.backdrop-glass-clear` — без заливки и без блика (`--glass-tint: 0`, `::after` выключен): только преломление через `GlassLayer` + тонкая inset-обводка вместо drop-shadow. Используется в `Button` variant `primary`.

Используется в `BottomNav`, `GlassArrow`, `Button` (`primary`), `ReportSheet` и `Toast`.

### Компоненты (`components/ui`, `components/icons`, `components/*`)

| Компонент | Назначение |
| --- | --- |
| `Button` | Единый стиль для всех действий: `variant`: `primary` (жидкое стекло `.backdrop-glass-clear`, без фоновой заливки) / `secondary` (плоский, `bg-grey`) / `ghost` (совсем без фона и тени, напр. стрелка «назад» в шапке); поддерживает `href` (рендерится как `Link`), `iconOnly`, `fullWidth`, `subtitle` (доп. строка `Caption-S` под заголовком `Body-M`, напр. цена) |
| `Status` | Пилюля-бейдж, `variant`: `success` / `error` / `warning` / `info` / `neutral` (белая заливка, напр. «Свободно», «Месяц в подарок») |
| `Eyebrow` | Мелкая uppercase-подпись (`Caption-S`, `Grey/400`); один сегмент — `children`, несколько — `items` через точку-разделитель 4×4px (`textClassName`/`dotClassName` задаются раздельно) |
| `GlassArrow` | Стеклянный кружок 32px со стрелкой вверх (`backdrop-glass-sm` + `GlassLayer`), вынесен из повторявшейся вёрстки на `/home` |
| `AddonIcon` | Кружок 40×40 с `LogoMark`: `active` — розовый `gradient-300` + `text-dark`, иначе `bg-grey-50` + `text-grey-300`. Общая иконка `AddonItem`/`DeliveryItem` |
| `AddonItem` | Строка допа: `AddonIcon` + заголовок/описание/цена + toggle-пилюля 48×48 (`checked` — тёмная с галочкой, иначе — с плюсом) |
| `DeliveryItem` | Упрощённая строка (без своей карточки-обёртки, без toggle) — иконка + заголовок/описание + произвольный `trailing`-текст справа |
| `Chip` | Тоггл-чип (`selected` меняет заливку с `bg-grey` на `bg-grey-500`); с `className="w-full"` — вертикальный список выбора (см. `RecipeSheet`) |
| `Input` | Текстовое поле с состоянием `error`/`errorMessage` |
| `Toast` | Success-уведомление (`backdrop-glass` + `GlassLayer`, `gradient-toast-success` под иконкой), автоскрытие через 3с |
| `StoryModal` | Полноэкранная модалка сторис (portal, `gradient-300`), scale+fade появление за 350мс на `cubic-bezier(0.22,1,0.36,1)` |
| `BottomSheet` | Общая механика шторки снизу (portal, затемнение, slide-up за 300мс); `trigger`/`children` — render-props с `open`/`close`. На ней построены `CourierSheet`, `SubscriptionSheet`, `RecipeSheet` |
| `CourierSheet` | Шторка «Доставка» — таймлайн шагов (готово — тёмный кружок с галочкой из `check.svg`; ожидание — `bg-grey-50` + точка `bg-primary-100`) с соединительными палочками 1×12px между шагами |
| `SubscriptionSheet` | Шторка «Подписка» — три действия (`Button variant="secondary"`: пропустить доставку / сменить рецепт / пауза) + пояснение |
| `RecipeSheet` | Шторка «Рецепт» — вертикальный список `Chip` (`w-full`) с выбором рациона |
| `GlassLayer` | SVG-based liquid glass слой (см. выше) |
| `BottomNav` | Общий нижний таббар (5 вкладок): рендерится один раз в `app/(tabs)/layout.tsx`, активная вкладка — из `usePathname`, переход — `router.push` (с ручным `router.prefetch()` всех вкладок на монтировании), пилюля едет между табами `translateX`'ом без перемонтирования `GlassLayer` |
| `PetName` | Клиентский лист (`useSearchParams`), подставляет `?name=` из онбординга поверх статического `/home`; используется внутри `<Suspense>`, чтобы страница осталась `○ Static` |
| `SubscriptionProvider` / `useSubscription` | Контекст-заглушка на время без бэкенда (`components/SubscriptionContext.tsx`, подключён в корневом `layout.tsx`): `active`-стейт живёт в памяти клиента — переживает переходы между страницами, обнуляется при обновлении. `/checkout` вызывает `activate()` на финальном шаге |
| `RationSubscriptionSection` | Клиентский переключатель на `/ration`: без подписки — промо-карточка со ссылкой на `/checkout`, с активной — `ActiveSubscriptionCard` |
| `ActiveSubscriptionCard` | Карточка активной подписки (бейдж «Активна», цена, следующий платёж, `RecipeSheet` вместо статичной кнопки) |
| `ArrowLeftIcon`, `CheckIcon`, `CheckCircleIcon`, `TruckIcon`, `LogoMark` | SVG-иконки как React-компоненты (`stroke`/`fill="currentColor"`) |

Остальные иконки — статические SVG в `app/assets/*.svg`, подключаются через `next/image`.

### Чекаут (`/checkout`)

Один клиентский компонент с `enum Step { Address, Card, Review, Success }` — переключение шагов через `useState`, без отдельных роутов; прогресс — три точки в шапке (`w-4 bg-dark` — активная), стрелка «назад» переключает на предыдущий `Step`. Маски полей карты — простые функции форматирования (`formatCardNumber`/`formatExpiry`/`formatCvc`), без внешних зависимостей.

### Чат (`/chat`)

Мок переписки с «miss Kusé» без бэкенда — весь диалог живёт в `useState` внутри `app/(tabs)/chat/page.tsx` и обнуляется при обновлении страницы. Шапка: иконка-лого в розовом `bg-gradient-300` (`rounded-2xl`), имя `Body-S`/`Base-Dark`, под ним — подпись `Caption`/`Grey-300` «Ваш консьерж» либо, после приглашения специалиста, `Status variant="success"` «Специалист приглашён»; справа — кнопка `Button variant="primary"` «Пригласить специалиста» (скрывается после приглашения). При входе на экран бот-приветствие приходит с задержкой через «печатает…» (три подпрыгивающих точки, `TypingBubble`), как и любой другой ответ бота — свой либо на отправленное сообщение/чип-подсказку, либо на приглашение специалиста. Реплики (`Bubble`) всплывают fade+translate-анимацией при монтировании (bot — серые слева, user — тёмные справа). Под лентой — горизонтальный скролл чипов-подсказок (`Chip`) и поле ввода (`bg-grey`, `clip.svg` для вложения) с кнопкой отправки — стеклянным кружком `backdrop-glass-sm` + `GlassLayer` со стрелкой `arrow-up.svg` (тот же стиль, что у `GlassArrow`).
