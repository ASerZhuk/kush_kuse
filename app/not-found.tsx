import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center bg-white px-margin">
      <h1 className="font-display text-h1 text-dark">Страницы нет</h1>

      <p className="mt-4 text-body text-grey-300">
        Кажется, ссылка устарела. Всё остальное на месте — вернём вас в клуб.
      </p>

      <Button variant="primary" href="/home" className="mt-8">
        На главную
      </Button>
    </div>
  );
}
