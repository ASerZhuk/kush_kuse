// Временный мок анкеты питомца. Структура повторяет ожидаемый ответ бэка,
// поэтому при подключении API достаточно заменить источник этого массива.
export type ChoiceOption = { id: string; label: string };

export type PetProfileField =
  | {
      kind: "choice";
      id: string;
      label: string;
      options: ChoiceOption[];
      // Если задано — над вариантами появляется поле ввода: можно выбрать
      // чип (он подставится в поле) или вписать свой вариант
      input?: { placeholder: string };
    }
  | { kind: "text"; id: string; placeholder: string };

export const PET_PROFILE_FIELDS: PetProfileField[] = [
  {
    kind: "choice",
    id: "breed",
    label: "Порода",
    input: { placeholder: "Введите породу" },
    options: [
      { id: "metis", label: "Метис" },
      { id: "british", label: "Британец" },
      { id: "maine-coon", label: "Мейн-кун" },
      { id: "sphynx", label: "Сфинкс" },
    ],
  },
  {
    kind: "choice",
    id: "sex",
    label: "Пол",
    options: [
      { id: "female", label: "Кошка" },
      { id: "male", label: "Кот" },
    ],
  },
  {
    kind: "choice",
    id: "age",
    label: "Возраст",
    options: [
      { id: "under-1", label: "До года" },
      { id: "1-3", label: "1-3 года" },
      { id: "3", label: "3 года" },
      { id: "4-7", label: "4-7 лет" },
      { id: "8-plus", label: "8 и старше" },
    ],
  },
  { kind: "text", id: "weight", placeholder: "Вес, кг" },
  {
    kind: "choice",
    id: "activity",
    label: "Активность",
    options: [
      { id: "calm", label: "Спокойная" },
      { id: "moderate", label: "Умеренная" },
      { id: "high", label: "Очень активная" },
    ],
  },
  {
    kind: "choice",
    id: "sterilization",
    label: "Стерилизация",
    options: [
      { id: "yes", label: "Да" },
      { id: "no", label: "Нет" },
    ],
  },
  {
    kind: "text",
    id: "notes",
    placeholder: "Особенности — аллергии, привычки",
  },
];
