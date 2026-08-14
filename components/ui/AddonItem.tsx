import Image from "next/image";
import AddonIcon from "@/components/ui/AddonIcon";
import CheckIcon from "@/components/icons/CheckIcon";
import plus from "@/app/assets/plus.svg";

type AddonItemProps = {
  title: string;
  description?: string;
  caption?: string;
  checked?: boolean;
};

export default function AddonItem({
  title,
  description,
  caption,
  checked = false,
}: AddonItemProps) {
  return (
    <div className="flex items-center gap-4 rounded-3xl bg-grey p-4">
      <AddonIcon active={checked} />

      <div className="flex flex-1 flex-col">
        <span className="mb-4 text-body-m text-dark">{title}</span>
        {description && (
          <span className="mb-4 text-caption text-grey-300">{description}</span>
        )}
        {caption && <span className="mb-4 text-caption text-grey-500">{caption}</span>}
      </div>

      <div
        className={`flex h-12 w-12 flex-none items-center justify-center gap-2 rounded-4xl p-2.5 ${
          checked ? "bg-grey-500" : "bg-grey"
        }`}
      >
        {checked ? (
          <CheckIcon className="h-3 w-3 text-white" />
        ) : (
          <Image src={plus} alt="" className="h-3 w-3" />
        )}
      </div>
    </div>
  );
}
