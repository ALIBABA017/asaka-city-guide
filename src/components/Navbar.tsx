import { Link } from "@tanstack/react-router";
import { useI18n, type Lang } from "@/lib/i18n";

export function Navbar() {
  const { t, lang, setLang } = useI18n();

  const navLinks = [
    { label: t("nav.explore"), to: "/explore" as const },
    { label: t("nav.forBusiness"), to: "/for-business" as const },
    { label: t("nav.events"), to: "/events" as const },
    { label: t("nav.jobs"), to: "/jobs" as const },
  ];

  const langs: Lang[] = ["uz", "ru", "en"];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand shadow-glow">
            <span className="text-lg">🇺🇿</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white">Smart Asaka</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">City Directory</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-white"
              activeProps={{ className: "text-white bg-white/5" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-lg border border-white/10 bg-white/5 p-0.5">
            {langs.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={
                  "rounded-md px-2 py-1 text-[11px] font-semibold uppercase transition " +
                  (lang === l ? "bg-gradient-brand text-white shadow-glow" : "text-muted-foreground hover:text-white")
                }
              >
                {l}
              </button>
            ))}
          </div>
          <Link
            to="/auth"
            className="hidden rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:text-white sm:inline-flex"
          >
            {t("nav.signIn")}
          </Link>
          <Link
            to="/business/register"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-brand px-4 py-2 text-sm font-medium text-white shadow-glow transition hover:scale-[1.02]"
          >
            <span>{t("nav.listBusiness")}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
