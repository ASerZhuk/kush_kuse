import Button from "@/components/ui/Button";
import ArrowLeftIcon from "@/components/icons/ArrowLeftIcon";

export default function Ration() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white pb-32">
      <div className="px-margin pt-[calc(1.5rem+env(safe-area-inset-top))]">
        <div className="flex items-center gap-4">
          <Button variant="secondary" iconOnly href="/home">
            <ArrowLeftIcon />
          </Button>
          <h1 className="font-display text-subtitle text-dark">Рацион</h1>
        </div>

        <div className="mt-6 rounded-3xl bg-grey p-8">
          <span className="text-caption text-grey-400">10:00–14:00</span>
          <h2 className="mt-6 font-display text-subtitle text-dark">
            завтра, 10 июля
          </h2>
          <p className="mt-6 text-body text-grey-300">
            Рацион на две недели: свежая еда, молочная вода, снеки. Курьер
            предупредит за час.
          </p>
        </div>
      </div>
    </div>
  );
}
