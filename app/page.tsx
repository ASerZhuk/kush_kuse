import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white px-margin pt-50">
      <Logo className="mx-auto h-auto w-47" />

      <p className="mx-auto mt-8 max-w-65 text-left text-body-l text-dark">
        Мы считаем, что такая любовь заслуживает ответа!
      </p>

      <div className="mt-20 flex flex-col gap-4">
        <Button variant="primary" href="/invite">
          У меня есть приглашение
        </Button>
        <Button variant="secondary" href="/waitlist">
          В лист ожидания
        </Button>
      </div>
    </div>
  );
}
