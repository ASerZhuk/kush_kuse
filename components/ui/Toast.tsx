import Image from "next/image";
import GlassLayer from "@/components/GlassLayer";
import CheckCircleIcon from "@/components/icons/CheckCircleIcon";
import closeIcon from "@/app/assets/close.svg";

export default function Toast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-x-6 top-[calc(1rem+env(safe-area-inset-top))] z-50 flex h-16 items-center gap-4 overflow-hidden rounded-2xl pr-2 pl-4 backdrop-glass">
      <GlassLayer radius={16} depth={6} strength={10} chromaticAberration={1} blur={3} />
      <div className="absolute left-0 top-0 z-0 h-16 w-22 bg-gradient-toast-success" />

      <CheckCircleIcon className="relative z-10 h-6 w-6 flex-none text-success-200" />

      <p className="relative z-10 flex-1 text-body-m text-dark">{message}</p>

      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="relative z-10 flex h-8 w-8 flex-none items-center justify-center"
      >
        <Image src={closeIcon} alt="" className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
