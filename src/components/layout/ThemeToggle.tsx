import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      id="theme-toggle"
      role="switch"
      aria-checked={isDark}
      onClick={toggleTheme}
      title={
        isDark
          ? "Đang ở chế độ Tối — Bấm để chuyển sang Nâu Nhạt"
          : "Đang ở chế độ Nâu Nhạt — Bấm để chuyển sang Tối"
      }
      aria-label="Chuyển đổi giao diện sáng tối"
      className={`group flex items-center gap-2 rounded-full border-2 border-border/80 bg-card/70 px-2.5 py-1 text-xs transition-all hover:border-primary active:scale-95 ${className}`}
    >
      {/* Biểu tượng sáng / tối bên cạnh toggle để nhận diện tức thì */}
      <span className="flex items-center justify-center">
        {isDark ? (
          <Moon className="h-4 w-4 text-primary transition-transform duration-300 group-hover:-rotate-12" />
        ) : (
          <Sun className="h-4 w-4 text-amber-600 dark:text-primary transition-transform duration-300 group-hover:rotate-45" />
        )}
      </span>

      {/* Toggle switch track & sliding knob */}
      <span
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors duration-300 ease-in-out ${
          isDark ? "border-primary/70 bg-primary/25" : "border-border bg-stone-300/80"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-primary shadow-sm transition-transform duration-300 ease-in-out ${
            isDark ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}
