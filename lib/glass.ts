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
  /** Refraction, проценты интерфейса Figma (0–100). */
  refraction: number;
  /** Depth — абсолютная глубина из Plugin API Figma (не проценты). */
  depth: number;
  /** Dispersion — проценты интерфейса Figma (0–100). */
  dispersion: number;
  /** Frost — размытие подложки. Единственный параметр Figma уже в пикселях. */
  frost: number;
  /** Splay — проценты интерфейса Figma (0–100). */
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
 * Frost и Depth Plugin API отдаёт абсолютными числами; Refraction, Dispersion
 * и Splay в интерфейсе представлены процентами. В SVG-карте Depth ограничен
 * половиной меньшей стороны: Figma умеет преломлять всю выпуклую поверхность,
 * а separable-карта должна сохранить хотя бы тонкий нейтральный центр.
 */
export function glassGeometry(tokens: GlassTokens, minSide: number) {
  const half = minSide / 2;

  return {
    // Раньше Depth=31 ошибочно трактовался как 31%, давая всего 7.44px на
    // кнопке 48px. Это и оставляло плоский центр, которого нет у Figma Glass.
    depth: clamp(tokens.depth, 2, Math.max(2, half - 1)),
    // Refraction задаёт амплитуду, Splay слегка расширяет видимый снос, но не
    // должен превращать его в отдельный второй множитель полной силы.
    strength:
      (tokens.refraction / 100) *
      half *
      (0.75 + (tokens.splay / 100) * 0.5),
    chromaticAberration: (tokens.dispersion / 100) * 3,
    blur: tokens.frost,
  };
}
