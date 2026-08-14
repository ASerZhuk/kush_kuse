import Eyebrow from "@/components/ui/Eyebrow";
import RecipeSheet from "@/components/RecipeSheet";
import Status from "@/components/ui/Status";

export default function ActiveSubscriptionCard() {
  return (
    <div className="mt-6 rounded-3xl bg-white p-8 ring-1 ring-success-100">
      <div className="flex items-center justify-between">
        <Eyebrow items={["Рацион", "Фрэнк"]} />
        <Status variant="success">Активна</Status>
      </div>

      <h2 className="mt-4 mb-6 font-display text-h2 text-dark">16 100 ₽/мес</h2>

      <p className="mb-6 text-body text-grey-400">
        Свежая еда · Треска свежего улова · порция 76 г/день
      </p>

      <p className="mb-6 text-caption text-grey-400">Следующий платёж 5 августа</p>

      <RecipeSheet />
    </div>
  );
}
