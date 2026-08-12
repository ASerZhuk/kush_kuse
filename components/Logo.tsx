import Image from "next/image";
import logo from "@/app/assets/logo-main.svg";

export default function Logo({ className = "" }: { className?: string }) {
  return <Image src={logo} alt="Kosh Kuse" className={className} priority />;
}
