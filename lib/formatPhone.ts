export function formatPhone(digits: string): string {
  let d = digits;
  if (d.startsWith("8")) d = "7" + d.slice(1);
  if (!d.startsWith("7")) d = "7" + d;
  d = d.slice(0, 11);

  const rest = d.slice(1);
  let result = "+7";
  if (rest.length > 0) result += ` (${rest.slice(0, 3)}`;
  if (rest.length >= 3) result += ")";
  if (rest.length > 3) result += ` ${rest.slice(3, 6)}`;
  if (rest.length > 6) result += `-${rest.slice(6, 8)}`;
  if (rest.length > 8) result += `-${rest.slice(8, 10)}`;
  return result;
}

// The field accepts a phone number OR a Telegram handle. Detect the handle
// (letters/@/underscore) rather than whitelisting phone characters: mobile
// keyboards inject separators no whitelist survives — iOS smart punctuation
// turns "-" into U+2011, Contacts autofill brings non-breaking spaces, Android
// adds dots — and a single stray character used to disable the mask entirely.
const TELEGRAM_LIKE = /[\p{L}@_]/u;

export function formatPhoneOrTelegram(value: string): string {
  if (TELEGRAM_LIKE.test(value)) return value;

  const digits = value.replace(/\D/g, "");
  return digits ? formatPhone(digits) : value;
}
