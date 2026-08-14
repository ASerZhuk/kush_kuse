import AddonItem from "@/components/ui/AddonItem";
import CourierSheet from "@/components/CourierSheet";
import DeliveryItem from "@/components/ui/DeliveryItem";
import RationSubscriptionSection from "@/components/RationSubscriptionSection";
import Status from "@/components/ui/Status";
import SubscriptionSheet from "@/components/SubscriptionSheet";
import TruckIcon from "@/components/icons/TruckIcon";

const ADDONS = [
  {
    title: "Молочная вода",
    description: "Составлена для кошек · дневная норма",
    caption: "+1900 ₽/мес",
    checked: true,
  },
  {
    title: "Снеки из трески",
    description: "Сублимированные чипсы · вариант «спокойный вечер»",
    caption: "+1200 ₽/мес",
    checked: true,
  },
  {
    title: "Коллаген",
    description: "Гель в стиках — как ваш, только для неё",
    caption: "+2400 ₽/мес",
    checked: false,
  },
];

const DELIVERY_ITEMS = [
  { title: "Молочная вода", description: "5 порций" },
  { title: "Снеки из трески", description: "2 порции" },
];

export default function Ration() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white pb-32">
      <div className="px-margin pt-[calc(1.5rem+env(safe-area-inset-top))]">
        <div className="flex items-center gap-2">
          <TruckIcon className="text-dark" />
          <h1 className="font-display text-h2 text-dark">Рацион</h1>
        </div>

        <RationSubscriptionSection />

        <h2 className="mt-8 font-display text-h2 text-dark">Дополнительно</h2>

        <div className="mt-6 flex flex-col gap-3">
          {ADDONS.map((addon) => (
            <AddonItem key={addon.title} {...addon} />
          ))}
        </div>

        <p className="mt-6 text-body text-grey-300">
          Граммовки и нормы уточняют наши технологи.
        </p>

        <h2 className="mt-8 font-display text-h2 text-dark">Доставка</h2>

        <div className="mt-6 rounded-3xl bg-grey p-8">
          <div className="flex items-baseline justify-between">
            <h3 className="font-display text-subtitle text-dark">10 июля, чт</h3>
            <div className="flex items-baseline">
              <span className="mr-4 text-caption text-grey-400">10:00–14:00</span>
              <Status variant="success" className="translate-y-px">
                В пути
              </Status>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {DELIVERY_ITEMS.map((item) => (
              <DeliveryItem key={item.title} trailing="Первый месяц" {...item} />
            ))}
          </div>

          <CourierSheet className="mt-6" />
        </div>

        <SubscriptionSheet className="mt-8" />
      </div>
    </div>
  );
}
