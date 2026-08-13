import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Status from "@/components/ui/Status";
import TruckIcon from "@/components/icons/TruckIcon";

export default function Ration() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white pb-32">
      <div className="px-margin pt-[calc(1.5rem+env(safe-area-inset-top))]">
        <div className="flex items-center gap-2">
          <TruckIcon className="text-dark" />
          <h1 className="font-display text-h2 text-dark">Рацион</h1>
        </div>

        <div className="mt-6 rounded-3xl bg-gradient-300 px-8 pt-8 pb-10">
          <div className="flex items-center justify-between">
            <Eyebrow items={["Рацион", "Фрэнк"]} />
            <Status variant="neutral">Месяц в подарок</Status>
          </div>

          <h2 className="mt-4 mb-6 font-display text-subtitle text-dark">
            Первый месяц — подарок
          </h2>

          <p className="mb-6 text-body text-grey-400">
            Свежая еда · Треска свежего улова · порция 76 г/день
          </p>

          <p className="mb-6 text-caption text-grey-400">
            Подписка — после первого месяца 5 августа
          </p>

          <Button variant="primary" subtitle="18 000 ₽/мес">
            Оформить подписку
          </Button>
        </div>
      </div>
    </div>
  );
}
