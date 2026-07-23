import { Link } from "@tanstack/react-router";

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

export function Footer() {
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
      <div className="border-t border-white/10 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Smart Asaka. Made with ❤️ in Asaka, Uzbekistan.
      </div>
    </footer>
  );
}
