import { Link } from "@tanstack/react-router";
import { categories } from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";

export function CategoriesGrid() {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">{t("categories.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("categories.subtitle")}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {categories.map((c) => (
          <Link
            key={c.slug}
            to="/category/$slug"
            params={{ slug: c.slug }}
            className={
              "group relative flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-gradient-to-br p-3 text-center transition hover:scale-[1.05] " +
              c.gradient
            }
          >
            <div className="text-3xl transition group-hover:scale-110">{c.emoji}</div>
            <div className="text-xs font-medium text-white">{c.name}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
