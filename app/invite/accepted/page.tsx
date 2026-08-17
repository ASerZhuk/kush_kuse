"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import photoIcon from "@/app/assets/photo_icon.svg";

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

export default function InviteAccepted() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  // Отзываем blob-URL при смене фото и при уходе со страницы, иначе файл
  // висит в памяти вкладки до полной перезагрузки.
  useEffect(() => {
    if (!photo) return;
    return () => URL.revokeObjectURL(photo);
  }, [photo]);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white px-margin pt-60">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="bg-gradient-400 mx-auto flex h-30 w-30 items-center justify-center overflow-hidden rounded-[28px]"
        aria-label="Сфотографировать кота"
      >
        {photo ? (
          <Image
            src={photo}
            alt="Фото кота"
            width={120}
            height={120}
            unoptimized
            className="h-full w-full object-cover"
          />
        ) : (
          <Image src={photoIcon} alt="" className="h-6 w-6" priority />
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          // accept="image/*" — подсказка диалогу выбора, а не проверка:
          // подсунуть можно любой файл. Blob-URL от не-картинки только сломает
          // <Image>, поэтому тип и размер проверяем сами.
          if (!file || !file.type.startsWith("image/")) return;
          if (file.size > MAX_PHOTO_BYTES) return;
          setPhoto(URL.createObjectURL(file));
        }}
      />

      <p className="mx-auto mt-4 max-w-55 text-center text-caption text-grey-400">
        Нажмите на иконку, чтобы сфотографировать кота
      </p>

      <h1 className="mt-6 font-display text-h1 text-dark">
        Приглашение принято
      </h1>

      <p className="mt-4 text-body text-grey-300">
        Kosh Kusé берёт на себя всё, что вы сделали бы сами, — будь у вас время
        и знания ветеринара.
        <br />
        Начнём со знакомства. Не с вами — с ней.
      </p>

      <Button variant="primary" href="/invite/pet-name" className="mt-8">
        Далее
      </Button>
    </div>
  );
}
