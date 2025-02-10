"use client";
import { Provider } from "jotai";

interface JotaiProviderProps {
  children: React.ReactNode;
}

export const JotaiProvider: React.FC<JotaiProviderProps> = ({ children }) => {
  return <Provider>{children}</Provider>;
};
