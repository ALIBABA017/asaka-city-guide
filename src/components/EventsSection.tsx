import { Link } from "@tanstack/react-router";
import { events } from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";

export function EventsSection() {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">{t("events.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("events.subtitle")}</p>
        </div>
        <Link to="/events" className="text-sm text-brand hover:underline">
          {t("events.viewAll")}
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {events.map((e) => (
          <Link
            key={e.id}
            to="/events/$id"
            params={{ id: e.id }}
            className="glass group flex gap-4 rounded-2xl p-4 transition hover:border-white/20"
          >
            <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-brand px-3 py-2 text-white shadow-glow">
              <div className="text-2xl font-bold leading-none">{e.day}</div>
              <div className="text-xs tracking-wider">{e.month}</div>
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between">
                <div className="text-base font-semibold text-white group-hover:text-gradient">
                  {e.title}
                </div>
                <div className="text-2xl">{e.emoji}</div>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{e.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
