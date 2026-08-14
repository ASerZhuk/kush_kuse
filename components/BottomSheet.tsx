"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

const TRANSITION_MS = 300;

/** Общая механика шторки снизу (portal, затемнение, slide-up за 300мс) —
 * общая для `CourierSheet` и `SubscriptionSheet`. */
export default function BottomSheet({
  trigger,
  children,
}: {
  trigger: (open: () => void) => ReactNode;
  children: (close: () => void) => ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const open = () => {
    clearTimeout(closeTimeout.current);
    setMounted(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  };

  const close = () => {
    setVisible(false);
    closeTimeout.current = setTimeout(() => setMounted(false), TRANSITION_MS);
  };

  useEffect(() => () => clearTimeout(closeTimeout.current), []);

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
