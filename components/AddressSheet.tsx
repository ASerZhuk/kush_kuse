"use client";

import { useState } from "react";
import BottomSheet from "@/components/BottomSheet";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ArrowUpRightIcon from "@/components/icons/ArrowUpRightIcon";

export default function AddressSheet({
  currentAddress,
  className,
}: {
  currentAddress: string;
  className?: string;
}) {
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");

  return (
    <BottomSheet
      trigger={(open) => (
        <button type="button" onClick={open} className={className}>
          <span className="text-body-m text-dark">Адрес</span>
          <span className="flex items-center gap-2">
            <span className="text-body-s text-grey-300">{currentAddress}</span>
            <ArrowUpRightIcon className="h-4 w-4 text-dark" />
          </span>
        </button>
      )}
    >
      {(close) => (
        <>
          <h2 className="font-display text-subtitle text-dark">Адрес</h2>

          <div className="mt-6 flex flex-col gap-3">
            <Input
              placeholder="Улица и дом"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
            <Input
              placeholder="Квартира и этаж"
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
            />
          </div>

          <p className="mt-6 text-body text-grey-300">
            Новый адрес подхватит ближайшая доставка. Курьер предупредит за
            час.
          </p>

          <Button variant="primary" className="mt-8" onClick={close}>
            Сохранить
          </Button>
        </>
      )}
    </BottomSheet>
  );
}
