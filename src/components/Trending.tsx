import { useState } from "react";
import { trending } from "@/lib/mock-data";
import { BusinessCard } from "./BusinessCard";
import { useI18n } from "@/lib/i18n";

const filters = [
  { key: "all", label: "All" },
  { key: "restaurants", label: "Food" },
  { key: "beauty", label: "Health" },
];

export function Trending() {
  const [f, setF] = useState("all");
  const { t } = useI18n();
  const items = f === "all" ? trending : trending.filter((t) => t.categorySlug === f || (f === "beauty" && t.slug === "fitlife-gym"));

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-white">{t("trending.title")}</h2>
          <p className="text-sm text-muted-foreground">People are loving these this week.</p>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
          {filters.map((x) => (
            <button
              key={x.key}
              onClick={() => setF(x.key)}
              className={
                "rounded-full px-3 py-1.5 text-xs transition " +
                (f === x.key ? "bg-gradient-brand text-white shadow-glow" : "text-muted-foreground hover:text-white")
              }
            >
              {x.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((b) => (
          <BusinessCard key={b.slug} b={b} />
        ))}
      </div>
    </section>
  );
}
