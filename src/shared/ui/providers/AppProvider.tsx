"use client";

import { HeroUIProvider } from "@heroui/react";

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
