const THEME_KEY = "ailume-theme";
const themeRoot = document.documentElement;
const themeToggles = document.querySelectorAll("[data-theme-toggle]");
const systemThemeQuery =
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");

function readStoredTheme() {
  try {
    const value = window.localStorage.getItem(THEME_KEY);
    return value === "dark" || value === "light" ? value : null;
  } catch (error) {
    return null;
  }
}

function getResolvedTheme() {
  const stored = readStoredTheme();
  if (stored) return stored;
  return systemThemeQuery?.matches ? "dark" : "light";
}

function updateToggleState(theme) {
  const isDark = theme === "dark";
  themeToggles.forEach((button) => {
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute("title", isDark ? "Switch to light theme" : "Switch to dark theme");
    button.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  });
}

function applyTheme(theme) {
  themeRoot.dataset.theme = theme;
  themeRoot.style.colorScheme = theme;
  updateToggleState(theme);
}

applyTheme(getResolvedTheme());

themeToggles.forEach((button) => {
  button.addEventListener("click", () => {
    const nextTheme = themeRoot.dataset.theme === "dark" ? "light" : "dark";
    try {
      window.localStorage.setItem(THEME_KEY, nextTheme);
    } catch (error) {}
    applyTheme(nextTheme);
  });
});

systemThemeQuery?.addEventListener("change", (event) => {
  if (readStoredTheme()) return;
  applyTheme(event.matches ? "dark" : "light");
});
