"use client";

import { type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useDisclosure } from "@/lib/useDisclosure";

const TRANSITION_MS = 300;

/** Общая механика шторки снизу (portal, затемнение, slide-up за 300мс) —
 * общая для `CourierSheet`, `SubscriptionSheet` и остальных шторок. */
export default function BottomSheet({
  trigger,
  children,
}: {
  trigger: (open: () => void) => ReactNode;
  children: (close: () => void) => ReactNode;
}) {
  const { mounted, visible, open, close } = useDisclosure(TRANSITION_MS);

  return (
    <>
      {trigger(open)}

      {mounted &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <button
              type="button"
              aria-label="Закрыть"
              onClick={close}
              className={`absolute inset-0 bg-dark/40 transition-opacity duration-300 ${
                visible ? "opacity-100" : "opacity-0"
              }`}
            />

            <div
              role="dialog"
              aria-modal="true"
              className={`relative w-full max-w-md rounded-t-[40px] bg-white p-10 pb-[calc(2.5rem+env(safe-area-inset-bottom))] transition-transform duration-300 ease-out ${
                visible ? "translate-y-0" : "translate-y-full"
              }`}
            >
              {children(close)}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
