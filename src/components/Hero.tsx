import { useState } from "react";
import { popularTags } from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";

type Props = {
  query: string;
  onQueryChange: (q: string) => void;
  activeTag: string | null;
  onTagChange: (t: string | null) => void;
};

export function Hero({ query, onQueryChange, activeTag, onTagChange }: Props) {
  const [tooltip, setTooltip] = useState(false);
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 0%, rgba(0,102,255,0.25), transparent 60%), radial-gradient(50% 50% at 90% 10%, rgba(0,212,170,0.18), transparent 60%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-10 sm:px-6 sm:pt-20 sm:pb-14">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
            </span>
            {t("hero.badge")}
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
            <span className="text-gradient">{t("hero.title.a")}</span>
            <br /> {t("hero.title.b")}
          </h1>

          <p className="mt-4 max-w-xl text-base text-muted-foreground">{t("hero.subtitle")}</p>

          <div className="mt-8 w-full max-w-2xl">
            <div className="glass flex items-center gap-2 rounded-2xl p-2 shadow-card">
              <div className="pl-2 text-muted-foreground">🔍</div>
              <input
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                type="text"
                placeholder={t("hero.search.placeholder")}
                className="flex-1 bg-transparent px-2 py-3 text-white outline-none placeholder:text-muted-foreground"
              />
              <button
                onMouseEnter={() => setTooltip(true)}
                onMouseLeave={() => setTooltip(false)}
                className="relative hidden h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-muted-foreground transition hover:bg-white/10 hover:text-white sm:inline-flex"
                aria-label="Voice search"
                type="button"
              >
                🎙️
                {tooltip && (
                  <span className="absolute -bottom-9 right-0 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs text-white shadow-card">
                    {t("hero.voice.tooltip")}
                  </span>
                )}
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-gradient-brand px-4 text-sm font-medium text-white shadow-glow"
              >
                {t("hero.search.button")}
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {popularTags.map((tag) => {
                const active = activeTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => onTagChange(active ? null : tag)}
                    type="button"
                    className={
                      "rounded-full border px-3 py-1.5 text-xs transition " +
                      (active
                        ? "border-brand bg-brand/20 text-white"
                        : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white")
                    }
                  >
                    {tag}
                  </button>
                );
              })}
              {(query || activeTag) && (
                <button
                  onClick={() => {
                    onQueryChange("");
                    onTagChange(null);
                  }}
                  type="button"
                  className="rounded-full px-3 py-1.5 text-xs text-muted-foreground underline-offset-4 hover:text-white hover:underline"
                >
                  {t("hero.clear")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
