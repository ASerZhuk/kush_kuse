"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type SubscriptionContextValue = {
  active: boolean;
  activate: () => void;
};

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

/** Живёт в памяти клиента (React state в корневом layout), поэтому
 * переживает клиентские переходы между страницами, но обнуляется при
 * обновлении страницы — заглушка на время, пока нет бэкенда. */
export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);

  return (
    <SubscriptionContext.Provider value={{ active, activate: () => setActive(true) }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within SubscriptionProvider");
  }
  return context;
}
