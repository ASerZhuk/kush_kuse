let counter = 0;

/**
 * Локальный id для списков (React key). Намеренно не `crypto.randomUUID()`:
 * его нет в non-secure context, а проект открывают с телефона по http://IP
 * (см. `allowedDevOrigins` в next.config.ts) — там вызов упал бы. И не
 * `Date.now()`: два элемента, добавленных в одну миллисекунду, получали
 * одинаковый key.
 */
export const nextId = (prefix: string) => `${prefix}-${++counter}`;
