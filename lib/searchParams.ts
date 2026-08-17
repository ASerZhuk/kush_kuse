/**
 * `?name=` в App Router приходит как `string | string[] | undefined`: массив
 * получается, если параметр повторить (`?name=a&name=b`) — а подделать ссылку
 * может кто угодно. Берём только строку, иначе имя питомца утекало бы в
 * разметку и в `encodeURIComponent` в неожиданном виде.
 */
export function readNameParam(params: {
  name?: string | string[];
}): string {
  return typeof params.name === "string" ? params.name : "";
}
