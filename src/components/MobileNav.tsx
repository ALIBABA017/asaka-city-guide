import { Link } from "@tanstack/react-router";
import { Home, Search, LayoutGrid, User } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function MobileNav() {
  const { t } = useI18n();
  const items = [
    { icon: Home, label: t("mobile.home"), to: "/" as const },
    { icon: Search, label: t("mobile.search"), to: "/explore" as const },
    { icon: LayoutGrid, label: t("mobile.categories"), to: "/explore" as const },
    { icon: User, label: t("mobile.profile"), to: "/auth" as const },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-background/90 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4">
        {items.map((it) => (
          <Link
            key={it.label}
            to={it.to}
            className="flex flex-col items-center gap-1 py-2.5 text-[10px] text-muted-foreground transition active:scale-95"
            activeProps={{ className: "text-white" }}
            activeOptions={{ exact: true }}
          >
            <it.icon className="h-5 w-5" />
            <span className="font-medium">{it.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
