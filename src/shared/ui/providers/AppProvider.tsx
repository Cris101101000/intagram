"use client";

import { useEffect } from "react";
import { HeroUIProvider } from "@heroui/react";
import { initPostHog } from "@/shared/lib/posthog-client";

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  useEffect(() => {
    initPostHog();
  }, []);

  return <HeroUIProvider>{children}</HeroUIProvider>;
}
