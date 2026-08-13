import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import GlassLayer from "@/components/GlassLayer";
import ReportSheet from "@/components/ReportSheet";
import Status from "@/components/ui/Status";
import logoMark from "@/app/assets/Logo.svg";
import catPhoto from "@/app/assets/temporary/4198c60aabe1247b9ab2cc3d90498749dc36c40e.png";
import clubPhoto from "@/app/assets/temporary/cc4e7503d25b2e89caa56ae58fb05e8bbd07a10a.jpg";
import sciencePhoto from "@/app/assets/temporary/c460a0d9124e4c67a0a613afaa1dbd9937aab218.png";
import devicesPhoto from "@/app/assets/temporary/09a250c81899adc4242986ab40a8bda97c739f1c.png";
import snacksPhoto from "@/app/assets/temporary/0ebc89293ed73ff0987d904ddac587ae6fdb784f.png";
import arrowUp from "@/app/assets/arrow-up.svg";
import plus from "@/app/assets/plus.svg";
import homeIcon from "@/app/assets/home.svg";
import carIcon from "@/app/assets/car.svg";
import heartIcon from "@/app/assets/heart.svg";
import messageIcon from "@/app/assets/message.svg";
import userIcon from "@/app/assets/user.svg";

const STORIES = [
  { label: "Клуб", photo: clubPhoto },
  { label: "Наука", photo: sciencePhoto },
  { label: "Девайсы", photo: devicesPhoto },
  { label: "Снеки", photo: snacksPhoto },
];

const TABS = [
  { icon: homeIcon, label: "Главная" },
  { icon: carIcon, label: "Доставка" },
  { icon: heartIcon, label: "Здоровье" },
  { icon: messageIcon, label: "Чат" },
  { icon: userIcon, label: "Профиль" },
];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ name?: string }>;
}) {
  const { name = "" } = await searchParams;
  const petName = name || "Фрэнк";

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white pb-32">
      {/* Серая шапка уходит под чёлку, но её содержимое опускается ниже
          вырезa — иначе на iPhone статус-бар перекрывает логотип */}
      <div className="rounded-b-[40px] bg-grey px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-8">
        <Image
          src={logoMark}
          alt="Kosh Kusé"
          className="mx-auto mb-6 h-[18.3px] w-[28.24px]"
          priority
        />

        <div className="flex justify-between">
          {STORIES.map((story) => (
            <div key={story.label} className="flex flex-col items-center gap-2">
              <div className="bg-gradient-story rounded-full p-0.5">
                <div className="rounded-full bg-white p-0.5">
                  <Image
                    src={story.photo}
                    alt=""
                    sizes="56px"
                    className="h-14 w-14 rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-caption-s uppercase text-dark">
                {story.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4">
        <div className="mt-6 flex h-34.5 items-center gap-4 rounded-3xl bg-grey pr-4">
          <div className="h-34.5 w-30 flex-none overflow-hidden rounded-4xl">
            <Image
              src={catPhoto}
              alt={petName}
              sizes="120px"
              priority
              className="h-full w-full origin-[50%_18%] scale-180 object-cover object-top"
            />
          </div>

          <div className="flex flex-col items-start">
            <h2 className="font-display text-subtitle font-[510] text-dark">
              {petName}
            </h2>
            <span className="mt-4 flex items-center gap-1 text-caption-s uppercase text-grey-300">
              Кот
              <span className="h-1 w-1 rounded-full bg-grey-100" />
              3 года
              <span className="h-1 w-1 rounded-full bg-grey-100" />6 кг
            </span>
            <Status className="mt-2">Всё в порядке</Status>
          </div>

          <button
            type="button"
            aria-label="Добавить питомца"
            className="ml-auto flex h-8 w-8 flex-none items-center justify-center"
          >
            <Image src={plus} alt="" className="h-4 w-4" />
          </button>
        </div>

        <div className="relative mt-3 rounded-3xl bg-grey p-8">
          <ReportSheet>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-caption-s uppercase text-dark">
                Отчёт
                <span className="h-1 w-1 rounded-full bg-dark" />
                Июль
              </span>
              <Status>Всё в порядке</Status>
            </div>
            <div className="flex flex-row justify-between">
              <div className="flex flex-col">
                <h2 className="mt-6 max-w-55.5 font-display text-subtitle font-[510] text-dark">
                  С питомцем {petName} всё в порядке. Вы хорошая хозяйка!
                </h2>

                <p className="mt-6 max-w-55.5 text-body text-grey-400">
                  Первый месяц — в подарок. Вы не обязаны разбираться в таурине — вы
                  обязаны её любить. Остальное мы берём на себя.
                </p>
              </div>

              <div className="flex items-center">
                <div className="backdrop-glass backdrop-glass-sm relative h-8 w-8 -translate-y-1/2 overflow-hidden rounded-[40px] flex justify-center items-center">
                  <GlassLayer depth={4} strength={10} chromaticAberration={1} blur={2} />
                  <Image src={arrowUp} alt="" className="relative z-10 h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </ReportSheet>
        </div>

        <h1 className="mt-8 px-2 font-display text-h2 text-dark">
          Ближайшая доставка
        </h1>

        <div className="mt-6 rounded-3xl bg-grey p-8">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-caption text-grey-400">10:00–14:00</span>
              <Status variant="info">В пути</Status>
            </div>
            <h2 className="mt-6 font-display text-subtitle text-dark">
              завтра, 10 июля
            </h2>
            <p className="mt-6 text-body text-grey-300">
              Рацион на две недели: свежая еда, молочная вода, снеки. Курьер
              предупредит за час.
            </p>
            <Button variant="primary" href="/invite/ration" className="mt-6">
              К рациону
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-row justify-between gap-4 rounded-3xl bg-grey p-8">
          <div className="flex flex-col">
            <h2 className="font-display text-subtitle text-dark">
              У Вас два приглашения
            </h2>
            <p className="mt-6 text-body text-grey-300">
              Кому Вы их доверите — решать Вам
            </p>
          </div>

          <div className="flex items-center">
            <div className="backdrop-glass backdrop-glass-sm relative h-8 w-8 -translate-y-1/2 overflow-hidden rounded-[40px] flex justify-center items-center">
              <GlassLayer depth={4} strength={10} chromaticAberration={1} blur={2} />
              <Image src={arrowUp} alt="" className="relative z-10 h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>

      <nav className="fixed inset-x-4 bottom-[calc(8px+env(safe-area-inset-bottom))] z-10 mx-auto flex max-w-89.5 items-center justify-between gap-2 overflow-hidden rounded-full p-2 backdrop-glass">
        {/* Дефолты (chromaticAberration 2, strength 26, blur 1) на контрастных
            иконках под баром давали цветные разводы вместо мягкого стекла —
            смещение снижено и блюр поднят, чтобы деталь фона гасла раньше, чем
            успевает разъехаться по каналам. chromaticAberration=1 — по вкусу:
            едва заметный цветной кант по кромке, а не полноценные разводы. */}
        <GlassLayer depth={8} strength={12} chromaticAberration={1} blur={4} />
        {TABS.map((tab, index) => (
          <button
            key={tab.label}
            type="button"
            aria-label={tab.label}
            aria-current={index === 0 ? "page" : undefined}
            className={`relative z-10 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full ${index === 0 ? "backdrop-glass backdrop-glass-sm" : ""
              }`}
          >
            {index === 0 && (
              <GlassLayer depth={5} strength={8} chromaticAberration={1} blur={4} />
            )}
            <Image
              src={tab.icon}
              alt=""
              className={`relative z-10 h-5 w-5 ${index === 0 ? "" : "opacity-40"}`}
            />
          </button>
        ))}
      </nav>
    </div>
  );
}
