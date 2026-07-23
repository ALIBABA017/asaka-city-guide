import { useState } from "react";
import { popularTags } from "@/lib/mock-data";

type Props = {
  query: string;
  onQueryChange: (q: string) => void;
  activeTag: string | null;
  onTagChange: (t: string | null) => void;
};

export function Hero({ query, onQueryChange, activeTag, onTagChange }: Props) {
  const [tooltip, setTooltip] = useState(false);

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
            Now serving 1,200+ businesses in Asaka
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Everything in <span className="text-gradient">Asaka</span>.<br /> One platform.
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground">
            Discover restaurants, clinics, schools, and services near you — with real reviews, live hours, and one-tap booking.
          </p>

          <div className="mt-8 w-full max-w-2xl">
            <div className="glass flex items-center gap-2 rounded-2xl p-2 shadow-card">
              <div className="pl-2 text-muted-foreground">🔍</div>
              <input
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                type="text"
                placeholder="Search restaurants, doctors, schools..."
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
                    Voice search coming soon
                  </span>
                )}
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-gradient-brand px-4 text-sm font-medium text-white shadow-glow"
              >
                Search
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {popularTags.map((t) => {
                const active = activeTag === t;
                return (
                  <button
                    key={t}
                    onClick={() => onTagChange(active ? null : t)}
                    type="button"
                    className={
                      "rounded-full border px-3 py-1.5 text-xs transition " +
                      (active
                        ? "border-brand bg-brand/20 text-white"
                        : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white")
                    }
                  >
                    {t}
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
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
