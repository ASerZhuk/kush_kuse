import Image from "next/image";
import GlassLayer from "@/components/GlassLayer";
import catPhoto from "@/app/assets/temporary/4198c60aabe1247b9ab2cc3d90498749dc36c40e.png";
import penIcon from "@/app/assets/pen.svg";

/** Фото питомца с кнопкой-карандашом — одинаковое в шапках «Здоровье»
 * и «Профиль». Фото пока замокано, меняется только подпись. */
export default function PetAvatar({ name }: { name: string }) {
  return (
    <div className="relative">
      <div className="h-28.5 w-29.5 overflow-hidden rounded-4xl bg-white p-1">
        <Image
          src={catPhoto}
          alt={name}
          sizes="118px"
          className="h-full w-full origin-[50%_18%] scale-180 rounded-[26px] object-cover object-top"
        />
      </div>
      <button
        type="button"
        aria-label="Изменить фото"
        className="backdrop-glass backdrop-glass-sm absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full"
      >
        <GlassLayer depth={4} strength={10} chromaticAberration={1} blur={2} />
        <Image src={penIcon} alt="" className="relative z-10 h-4 w-4" />
      </button>
    </div>
  );
}
