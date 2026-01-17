"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useIsMounted } from "@/hooks/useIsMounted";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const mounted = useIsMounted();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="agricultural-touch-target"
        disabled
      ></Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="agricultural-touch-target"
      aria-label={theme === "dark" ? t("lightMode") : t("darkMode")}
      title={theme === "dark" ? t("lightMode") : t("darkMode")}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}
