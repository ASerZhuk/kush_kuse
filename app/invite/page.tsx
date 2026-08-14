import Image from "next/image";
import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ArrowLeftIcon from "@/components/icons/ArrowLeftIcon";
import catPhoto from "@/app/assets/cat.png";

export default function Invite() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[linear-gradient(110deg,#edeef0_0%,#ffc6d5_220%)]">
      <div className="relative z-0 flex flex-col gap-6 rounded-b-[40px] bg-white px-10 pt-10 pb-12">
        <Logo className="mx-auto h-auto w-[151.08px]" />
        <p className="text-body text-grey-400">
          Kosh Kusé — клуб по приглашениям. Введите код из Вашего.
        </p>
      </div>

      <div className="relative z-10 -mt-9 min-h-0 flex-1 overflow-hidden">
        <Image
          src={catPhoto}
          alt="Кот"
          fill
          priority
          className="object-cover object-top"
        />
      </div>

      <div className="relative z-20 -mt-1 flex flex-col rounded-t-[40px] bg-white px-margin pt-7 pb-4">
        <h2 className="font-display text-subtitle text-dark">Мы Вас ждали!</h2>

        <Input placeholder="Код приглашения" className="mt-7" />

        <div className="mt-3 flex gap-3">
          <Button variant="ghost" iconOnly href="/">
            <ArrowLeftIcon />
          </Button>
          <Button variant="primary" fullWidth={false} href="/invite/accepted">
            Войти
          </Button>
        </div>
      </div>
    </div>
  );
}
