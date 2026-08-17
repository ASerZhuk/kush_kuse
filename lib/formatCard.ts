/** Маски полей карты. Общие для чекаута и шторки «Оплата» в профиле. */

export const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

export const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

export const formatCvc = (value: string) => value.replace(/\D/g, "").slice(0, 3);

/** Последние 4 цифры — единственное, что можно показывать после ввода. */
export const cardLast4 = (value: string) => value.replace(/\D/g, "").slice(-4);
