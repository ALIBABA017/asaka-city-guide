import { createFileRoute, notFound } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { events } from "@/lib/mock-data";

export const Route = createFileRoute("/events/$id")({
  head: ({ loaderData }) => {
    const e = loaderData as (typeof events)[number] | undefined;
    return {
      meta: [
        { title: e ? `${e.title} — Smart Asaka` : "Event — Smart Asaka" },
        { name: "description", content: e?.description ?? "Event details." },
        { property: "og:title", content: e?.title ?? "Event" },
        { property: "og:description", content: e?.description ?? "" },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },

  loader: ({ params }) => {
    const e = events.find((x) => x.id === params.id);
    if (!e) throw notFound();
    return e;
  },
  component: EventDetail,
  notFoundComponent: () => (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <div className="text-6xl">🔎</div>
        <h1 className="mt-4 text-2xl font-bold text-white">Event not found</h1>
      </div>
      <Footer />
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-6 text-white">Error: {error.message}</div>,
});

function EventDetail() {
  const e = Route.useLoaderData();
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="glass rounded-3xl p-8">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-brand px-4 py-3 text-white shadow-glow">
              <div className="text-3xl font-bold leading-none">{e.day}</div>
              <div className="text-xs tracking-wider">{e.month}</div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{e.title}</h1>
              <p className="mt-1 text-muted-foreground">{e.description}</p>
            </div>
            <div className="ml-auto text-5xl">{e.emoji}</div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
