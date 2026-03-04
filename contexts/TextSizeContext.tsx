import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { TextStyle } from "react-native";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { getScaledFontSize, type BaseSize } from "@/lib/textSize";

interface TextSizeContextValue {
  scaledStyle: (base?: BaseSize) => TextStyle;
}

const TextSizeContext = createContext<TextSizeContextValue>({
  scaledStyle: () => ({}),
});

export function TextSizeProvider({ children }: { children: ReactNode }) {
  const { patient } = useAuthContext();
  const textSize = patient?.text_size ?? "medium";

  const value = useMemo<TextSizeContextValue>(
    () => ({
      scaledStyle: (base: BaseSize = "base") => ({
        fontSize: getScaledFontSize(textSize, base),
      }),
    }),
    [textSize]
  );

  return (
    <TextSizeContext.Provider value={value}>
      {children}
    </TextSizeContext.Provider>
  );
}

export function useTextSize() {
  return useContext(TextSizeContext);
}
