import Image from "next/image";
import GlassLayer from "@/components/GlassLayer";
import arrowUp from "@/app/assets/arrow-up.svg";

export default function GlassArrow() {
  return (
    <div className="backdrop-glass backdrop-glass-sm relative flex h-8 w-8 -translate-y-1/2 items-center justify-center overflow-hidden rounded-[40px]">
      <GlassLayer depth={4} strength={10} chromaticAberration={1} blur={2} />
      <Image src={arrowUp} alt="" className="relative z-10 h-3.5 w-3.5" />
    </div>
  );
}
