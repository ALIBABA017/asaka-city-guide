import type { Business } from "@/lib/mock-data";
import { BusinessCard } from "./BusinessCard";

export function FeaturedBusinesses({ items, query }: { items: Business[]; query: string }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            {query ? `Results for “${query}”` : "Featured businesses"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "place" : "places"} in Asaka
          </p>
        </div>
      </div>
      {items.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">
          No businesses match your search. Try a different keyword.
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
