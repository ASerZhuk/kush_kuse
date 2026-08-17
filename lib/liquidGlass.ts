type DisplacementOptions = {
  height: number;
  width: number;
  radius: number;
  depth: number;
  strength?: number;
  chromaticAberration?: number;
};

/** Показатель преломления стекла (n₂); окружающий воздух — n₁ = 1. */
const REFRACTIVE_INDEX = 1.5;

/** Сколько точек профиля выводим в градиент. Больше 12 глаз уже не различает. */
const PROFILE_STOPS = 12;

/**
 * Профиль поверхности линзы — выпуклый «squircle»: y = ⁴√(1 − (1 − x)⁴).
 * Именно его использует Apple: у него мягкий переход плоскость→скругление,
 * поэтому на растянутой пилюле градиент не ломается, в отличие от сферы
 * y = √(1 − (1 − x)²), которая даёт резкую кромку.
 */
const squircle = (x: number) => (1 - (1 - x) ** 4) ** (1 / 4);

/**
 * Боковой снос луча на расстоянии x от кромки (0 — сама кромка, 1 —
 * внутренняя граница стенки).
 *
 * Нормаль берём численной производной профиля, дальше — закон Снелла
 * n₁·sin θ₁ = n₂·sin θ₂. Луч считаем падающим перпендикулярно фону, поэтому
 * угол падения равен наклону поверхности, а сносит луч на tan(θ₁ − θ₂).
 */
const lateralShift = (x: number) => {
  const delta = 0.001;
  const slope =
    (squircle(Math.min(1, x + delta)) - squircle(Math.max(0, x - delta))) /
    (2 * delta);

  const incidence = Math.atan(Math.abs(slope));
  const refracted = Math.asin(Math.min(1, Math.sin(incidence) / REFRACTIVE_INDEX));
  return Math.tan(incidence - refracted);
};

/**
 * Профиль в виде долей от максимума: [1 на кромке … 0 на глубине depth].
 * Нормализация обязательна — она же задаёт смысл параметру scale у
 * feDisplacementMap: это максимальный снос в пикселях.
 */
const shiftProfile = (() => {
  const raw = Array.from({ length: PROFILE_STOPS }, (_, i) =>
    lateralShift(i / (PROFILE_STOPS - 1)),
  );
  const max = Math.max(...raw);
  return raw.map((value) => value / max);
})();

/** 0…1 → канал 0…255, где 128 = нулевое смещение (соглашение feDisplacementMap). */
const channel = (amount: number) => Math.round(128 + amount * 127);

const hex = (value: number) => value.toString(16).padStart(2, "0");

/**
 * Стопы одного канала: у ближней кромки максимальный снос внутрь, к глубине
 * `depth` он гаснет до нейтрали, центр остаётся нейтральным, у дальней кромки
 * всё зеркалится со знаком минус.
 *
 * `toColor` собирает цвет так, чтобы градиент писал только свой канал:
 * оба градиента накладываются в режиме screen, поэтому чужие каналы у них
 * должны быть нулевыми.
 */
const channelStops = (
  sizePx: number,
  depth: number,
  radius: number,
  toColor: (v: number) => string,
) => {
  // Стенка линзы не шире скругления: дальше радиуса кромка уже прямая,
  // преломлять там нечего. И не шире половины стороны, иначе нейтральный
  // центр схлопывается и «плывёт» вся плоскость.
  const band = Math.min(Math.min(depth, radius) / sizePx, 0.5);

  const near = shiftProfile.map((amount, i) => {
    const offset = (i / (PROFILE_STOPS - 1)) * band * 100;
    return `<stop offset="${offset.toFixed(2)}%" stop-color="${toColor(channel(amount))}" />`;
  });

  const far = shiftProfile
    .map((amount, i) => {
      const offset = 100 - (i / (PROFILE_STOPS - 1)) * band * 100;
      return `<stop offset="${offset.toFixed(2)}%" stop-color="${toColor(channel(-amount))}" />`;
    })
    .reverse();

  return [...near, ...far].join("");
};

const redChannel = (v: number) => `#${hex(v)}0000`;
const greenChannel = (v: number) => `#00${hex(v)}00`;

/**
 * Карта смещения для эффекта стекла.
 *
 * Базовый серый #808080 = нулевое смещение. Канал R задаёт снос по X, G — по
 * Y (соглашение feDisplacementMap), B не используется. Оба канала пишутся
 * независимо: пара «чистых» градиентов поверх базы #000080 в режиме screen
 * даёт (R, G, 128).
 *
 * Раньше профиль был линейным во всю ширину, а центр возвращал к нейтрали
 * внутренний прямоугольник с blur(depth) — из-за этого преломление
 * размазывалось по всей плоскости, а не собиралось у кромки. Теперь форма
 * кромки описана физически (см. shiftProfile), и подчищать центр не нужно:
 * градиент сам приходит к #808080 на глубине depth.
 */
export const getDisplacementMap = ({
  height,
  width,
  radius,
  depth,
}: Omit<DisplacementOptions, "chromaticAberration" | "strength">) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`<svg height="${height}" width="${width}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <style>.mix { mix-blend-mode: screen; }</style>
    <defs>
        <linearGradient id="Y" x1="0" x2="0" y1="0%" y2="100%">${channelStops(height, depth, radius, greenChannel)}</linearGradient>
        <linearGradient id="X" x1="0%" x2="100%" y1="0" y2="0">${channelStops(width, depth, radius, redChannel)}</linearGradient>
    </defs>
    <rect x="0" y="0" height="${height}" width="${width}" fill="#000080" />
    <rect x="0" y="0" height="${height}" width="${width}" fill="url(#Y)" class="mix" />
    <rect x="0" y="0" height="${height}" width="${width}" fill="url(#X)" class="mix" />
</svg>`);

/**
 * Фильтр смещения. Три прохода с разным scale для R/G/B дают хроматическую
 * аберрацию — радужный отлив по кромке, как у реального стекла.
 */
export const getDisplacementFilter = ({
  height,
  width,
  radius,
  depth,
  strength = 100,
  chromaticAberration = 0,
}: DisplacementOptions) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`<svg height="${height}" width="${width}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <filter id="displace" color-interpolation-filters="sRGB">
            <feImage x="0" y="0" height="${height}" width="${width}" href="${getDisplacementMap({ height, width, radius, depth })}" result="displacementMap" />
            <feDisplacementMap transform-origin="center" in="SourceGraphic" in2="displacementMap" scale="${strength + chromaticAberration * 2}" xChannelSelector="R" yChannelSelector="G" />
            <feColorMatrix type="matrix" values="1 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0" result="displacedR" />
            <feDisplacementMap in="SourceGraphic" in2="displacementMap" scale="${strength + chromaticAberration}" xChannelSelector="R" yChannelSelector="G" />
            <feColorMatrix type="matrix" values="0 0 0 0 0
                    0 1 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0" result="displacedG" />
            <feDisplacementMap in="SourceGraphic" in2="displacementMap" scale="${strength}" xChannelSelector="R" yChannelSelector="G" />
            <feColorMatrix type="matrix" values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 1 0 0
                    0 0 0 1 0" result="displacedB" />
            <feBlend in="displacedR" in2="displacedG" mode="screen"/>
            <feBlend in2="displacedB" mode="screen"/>
        </filter>
    </defs>
</svg>`) +
  "#displace";
