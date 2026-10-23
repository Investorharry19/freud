import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ThemeColors = {
  background: string;
  surface: string;
  text: string;
  icon: string;
  heading: string;
  secondaryText: string;
  mutedText: string;
  subtleText: string;
  border: string;
  accent: string;
  highlight: string;
  brown: string;
};

type ThemeContextValue = {
  isDark: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
};

const lightColors: ThemeColors = {
  background: "#FAF6F0",
  surface: "#FFFFFF",
  text: "#24372C",
  icon: "#000000",
  heading: "#2E1F17",
  secondaryText: "#536657",
  mutedText: "#778078",
  subtleText: "#7A716C",
  border: "#EFE6DA",
  accent: "#486A53",
  highlight: "#DE6420",
  brown: "#4F3422",
};

const darkColors: ThemeColors = {
  background: "#171512",
  surface: "#25211D",
  text: "#F5EEE6",
  icon: "#F5EEE6",
  heading: "#F5EEE6",
  secondaryText: "#B8AAA0",
  mutedText: "#B8AAA0",
  subtleText: "#B8AAA0",
  border: "#403830",
  accent: "#9DBB83",
  highlight: "#F28A43",
  brown: "#4F3422",
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const colors = isDark ? darkColors : lightColors;
  const value = useMemo(
    () => ({
      isDark,
      colors,
      toggleTheme: () => setIsDark((current) => !current),
    }),
    [colors, isDark],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within a ThemeProvider");
  }
  return context;
}
