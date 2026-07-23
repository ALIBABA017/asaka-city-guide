import type { Business } from "@/lib/mock-data";
import { BusinessCard } from "./BusinessCard";
import { useI18n } from "@/lib/i18n";

export function FeaturedBusinesses({ items, query }: { items: Business[]; query: string }) {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            {query ? t("featured.results", { q: query }) : t("featured.title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t(items.length === 1 ? "featured.count.one" : "featured.count.many", { n: items.length })}
          </p>
        </div>
      </div>
      {items.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">
          {t("featured.empty")}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((b) => (
            <BusinessCard key={b.slug} b={b} />
          ))}
        </div>
      )}
    </section>
  );
}
