"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";

/**
 * Граница ошибок для всего приложения. Текст ошибки пользователю намеренно
 * не показываем — в сообщении и стеке могут быть внутренние пути и данные;
 * в консоль (а позже — в мониторинг) уходит полный объект.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center bg-white px-margin">
      <h1 className="font-display text-h1 text-dark">Что-то пошло не так</h1>

      <p className="mt-4 text-body text-grey-300">
        Мы уже разбираемся. Попробуйте ещё раз — обычно этого хватает.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <Button variant="primary" onClick={reset}>
          Попробовать снова
        </Button>
        <Button variant="secondary" href="/home">
          На главную
        </Button>
      </div>
    </div>
  );
}
