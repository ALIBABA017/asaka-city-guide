import { Link } from "@tanstack/react-router";

const navLinks = [
  { label: "Explore", to: "/explore" as const },
  { label: "For Business", to: "/for-business" as const },
  { label: "Events", to: "/events" as const },
  { label: "Jobs", to: "/jobs" as const },
];

export function Navbar() {
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
          <Link
            to="/auth"
            className="hidden rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:text-white sm:inline-flex"
          >
            Sign In
          </Link>
          <Link
            to="/business/register"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-brand px-4 py-2 text-sm font-medium text-white shadow-glow transition hover:scale-[1.02]"
          >
            <span>+ List Business</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
