import AddonIcon from "@/components/ui/AddonIcon";

export default function DeliveryItem({
  title,
  description,
  trailing,
}: {
  title: string;
  description: string;
  trailing: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <AddonIcon active />

      <div className="flex flex-1 flex-col">
        <span className="text-body-m text-dark">{title}</span>
        <span className="mt-1 text-caption text-grey-300">{description}</span>
      </div>

      <span className="text-caption text-grey-300">{trailing}</span>
    </div>
  );
}
