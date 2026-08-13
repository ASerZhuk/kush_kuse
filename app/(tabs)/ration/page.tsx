import Button from "@/components/ui/Button";
import TruckIcon from "@/components/icons/TruckIcon";

export default function Ration() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white pb-32">
      <div className="px-margin pt-[calc(1.5rem+env(safe-area-inset-top))]">
        <div className="flex items-center gap-2">
          <TruckIcon className="text-dark" />
          <h1 className="font-display text-h2 text-dark">Рацион</h1>
        </div>

        <div className="mt-6 rounded-3xl bg-gradient-300 p-8">
          <div className="flex items-center justify-between">
            <span className="text-caption-s uppercase text-grey-400">
              Рацион • Фрэнк
            </span>
            <span className="inline-flex h-5.5 items-center justify-center gap-2.5 rounded-2xl bg-white px-2 text-caption-s uppercase text-grey-300">
              Месяц в подарок
            </span>
          </div>

          <h2 className="mt-4 font-display text-subtitle text-dark">
            Первый месяц — подарок
          </h2>

          <p className="mt-2 text-body text-grey-300">
            Свежая еда · Треска свежего улова · порция 76 г/день
          </p>

          <p className="mt-4 text-body-s text-grey-300">
            Подписка — после первого месяца 5 августа
          </p>

          <Button variant="primary" subtitle="18 000 ₽/мес" className="mt-6">
            Оформить подписку
          </Button>
        </div>
      </div>
    </div>
  );
}
