import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { events } from "@/lib/mock-data";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events in Asaka — Smart Asaka" },
      { name: "description", content: "Upcoming events, festivals, and meetups in Asaka." },
      { property: "og:title", content: "Events in Asaka" },
      { property: "og:description", content: "Don't miss what's happening in Asaka this month." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EventsList,
});

function EventsList() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold text-white">Upcoming events</h1>
        <p className="mt-1 text-muted-foreground">All events happening in Asaka.</p>
        <div className="mt-8 space-y-3">
          {events.map((e) => (
            <Link
              key={e.id}
              to="/events/$id"
              params={{ id: e.id }}
              className="glass flex gap-4 rounded-2xl p-4 transition hover:border-white/20"
            >
              <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-brand px-4 py-2 text-white shadow-glow">
                <div className="text-2xl font-bold leading-none">{e.day}</div>
                <div className="text-xs tracking-wider">{e.month}</div>
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-white">{e.title}</div>
                <div className="text-sm text-muted-foreground">{e.description}</div>
              </div>
              <div className="self-center text-3xl">{e.emoji}</div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
