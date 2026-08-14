import LogoMark from "@/components/icons/LogoMark";

/** Кружок 40×40 с лого — общая иконка `AddonItem` и `DeliveryItem`. */
export default function AddonIcon({ active = false }: { active?: boolean }) {
  return (
    <div
      className={`flex h-10 w-10 flex-none items-center justify-center gap-2.5 rounded-2xl p-2.5 ${
        active ? "bg-gradient-300 text-dark" : "bg-grey-50 text-grey-300"
      }`}
    >
      <LogoMark className="h-3 w-5" />
    </div>
  );
}
