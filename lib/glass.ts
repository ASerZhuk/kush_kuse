/**
 * Стиль эффекта «Common» из Figma (Effects → Glass) — источник правды для
 * primary-кнопки. Значения переносятся из макета один в один; в пиксели их
 * переводит GlassLayer, потому что там известен реальный размер элемента.
 */
export type GlassTokens = {
  /**
   * Light, угол в градусах. −45° — свет сверху слева.
   *
   * SVG-фильтр его не использует: смещение симметрично, направленный свет
   * живёт в CSS-бликах. Тот же угол продублирован там как `--glass-light`
   * (globals.css, `.backdrop-glass`) уже в виде угла градиента, θ + 180°.
   * При смене значения править надо оба места.
   */
  lightAngle: number;
  /** Light, интенсивность, 0–100. */
  lightIntensity: number;
  /** Refraction, 0–100. */
  refraction: number;
  /** Depth — толщина стенки линзы, 0–100. */
  depth: number;
  /** Dispersion — хроматическая аберрация, 0–100. */
  dispersion: number;
  /** Frost — размытие подложки. Единственный параметр Figma уже в пикселях. */
  frost: number;
  /** Splay — растекание преломления к кромке, 0–100. */
  splay: number;
};

export const GLASS_COMMON: GlassTokens = {
  lightAngle: -45,
  lightIntensity: 80,
  refraction: 75,
  depth: 31,
  dispersion: 40,
  frost: 8,
  splay: 29,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * Перевод токенов в геометрию карты смещения.
 *
 * Frost переносится как есть — это пиксели. Остальные четыре параметра Figma
 * держит в безразмерной шкале 0–100 и формулу не публикует, поэтому
 * коэффициенты ниже подобраны по эталону из макета на пилюле 48px. Считаем от
 * меньшей стороны: на кнопке это высота, и от неё же зависит, какая часть
 * поверхности приходится на преломляющую кромку.
 */
export function glassGeometry(tokens: GlassTokens, minSide: number) {
  const half = minSide / 2;

  return {
    // Стенка не может быть толще половины элемента: иначе нейтральный центр
    // карты смещения схлопывается и преломляется вся плоскость, а не кромка.
    depth: clamp((tokens.depth / 100) * half, 2, half - 1),
    // Splay расширяет зону преломления к краю, то есть усиливает смещение.
    strength: (tokens.refraction / 100) * half * (0.5 + tokens.splay / 100),
    chromaticAberration: (tokens.dispersion / 100) * 3,
    blur: tokens.frost,
  };
}
