import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

type ThemePreference = "light" | "dark" | "system";
const storageKey = "curva-aberta-theme-v1";
const isPreference = (value: string | null | undefined): value is ThemePreference =>
  value === "light" || value === "dark" || value === "system";

function applyTheme(preference: ThemePreference) {
  const theme = preference === "system"
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : preference;
  document.documentElement.dataset.themePreference = preference;
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute(
    "content", theme === "dark" ? "#151c2a" : "#f4f6fb"
  );
}

export default function ThemePicker() {
  const [preference, setPreference] = useState<ThemePreference>(() => {
    const initial = document.documentElement.dataset.themePreference;
    return isPreference(initial) ? initial : "system";
  });

  useEffect(() => {
    applyTheme(preference);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const followSystem = () => { if (preference === "system") applyTheme(preference); };
    const syncTabs = (event: StorageEvent) => {
      if (event.key !== storageKey && event.key !== null) return;
      setPreference(isPreference(event.newValue) ? event.newValue : "system");
    };
    media.addEventListener("change", followSystem);
    window.addEventListener("storage", syncTabs);
    return () => {
      media.removeEventListener("change", followSystem);
      window.removeEventListener("storage", syncTabs);
    };
  }, [preference]);

  function changeTheme(value: string) {
    if (!isPreference(value)) return;
    applyTheme(value);
    setPreference(value);
    try { localStorage.setItem(storageKey, value); } catch { /* Available for this visit even if storage is blocked. */ }
  }

  const Icon = preference === "system" ? Monitor : preference === "dark" ? Moon : Sun;
  return <label className="theme-picker">
    <Icon size={17} aria-hidden="true" />
    <span className="theme-label">Tema</span>
    <select aria-label="Tema do site" value={preference} onChange={event => changeTheme(event.target.value)}>
      <option value="light">Claro</option>
      <option value="dark">Escuro</option>
      <option value="system">Sistema</option>
    </select>
  </label>;
}
