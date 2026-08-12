import Button from "@/components/ui/Button";

export default async function Ration({
  searchParams,
}: {
  searchParams: Promise<{ name?: string }>;
}) {
  const { name = "" } = await searchParams;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white px-margin pt-62.5">
      <div className="flex flex-col gap-6 rounded-4xl bg-grey px-8 pt-8 pb-10">
        <span className="block text-caption-s uppercase text-grey-400">
          Рацион составлен
        </span>

        <h1 className="font-display text-subtitle text-dark">
          {name ? `${name}. Рацион готов` : "Рацион готов"}
        </h1>

        <p className="text-body text-grey-400">
          Свежая еда, порция рассчитана по её весу и активности.
          <br />
          Раз в три месяца мы сверяемся с журналом и пересчитываем порции.
        </p>
      </div>

      <p className="mt-8 text-body text-grey-300">
        Первый месяц — в подарок. Вы не обязаны разбираться в таурине — вы
        обязаны её любить. Остальное мы берём на себя.
      </p>

      <Button
        variant="primary"
        href={`/home${name ? `?name=${encodeURIComponent(name)}` : ""}`}
        className="mt-8"
      >
        Войти в клуб
      </Button>
    </div>
  );
}
