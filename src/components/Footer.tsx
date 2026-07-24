import { Link } from "@tanstack/react-router";
import { Instagram, Send, Facebook } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const cols = [
  {
    title: "About",
    links: [
      { label: "Our mission", to: "/for-business" as const },
      { label: "How it works", to: "/explore" as const },
      { label: "Contact", to: "/for-business" as const },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Explore", to: "/explore" as const },
      { label: "Events", to: "/events" as const },
      { label: "Jobs", to: "/jobs" as const },
    ],
  },
  {
    title: "Business",
    links: [
      { label: "List your business", to: "/business/register" as const },
      { label: "Owner dashboard", to: "/auth" as const },
      { label: "For enterprises", to: "/for-business" as const },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Sign in", to: "/auth" as const },
      { label: "Register", to: "/business/register" as const },
      { label: "Home", to: "/" as const },
    ],
  },
];

const socials = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Send, label: "Telegram", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
];

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-12 border-t border-white/10 bg-background/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 md:grid-cols-4">
        {cols.map((c) => (
          <div key={c.title}>
            <div className="text-sm font-semibold text-white">{c.title}</div>
            <ul className="mt-3 space-y-2">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-muted-foreground hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 border-t border-white/10 px-4 py-6 sm:flex-row sm:justify-between sm:px-6">
        <div className="text-center text-xs text-muted-foreground sm:text-left">
          <div>{t("footer.made")}</div>
          <div className="mt-1">© 2026 Smart Asaka</div>
        </div>
        <div className="flex items-center gap-2">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition hover:scale-110 hover:bg-gradient-brand hover:text-white hover:shadow-glow"
            >
              <s.icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
