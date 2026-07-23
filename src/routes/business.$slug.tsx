import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { allBusinesses } from "@/lib/mock-data";

export const Route = createFileRoute("/business/$slug")({
  head: ({ loaderData }) => {
    const b = loaderData;
    return {
      meta: [
        { title: b ? `${b.name} — Smart Asaka` : "Business — Smart Asaka" },
        { name: "description", content: b ? `${b.name} — ${b.category} on ${b.address}, Asaka.` : "Business profile." },
        { property: "og:title", content: b?.name ?? "Business" },
        { property: "og:description", content: b ? `${b.category} in Asaka` : "" },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  loader: ({ params }) => {
    const b = allBusinesses.find((x) => x.slug === params.slug);
    if (!b) throw notFound();
    return b;
  },
  component: BusinessPage,
  notFoundComponent: () => (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <div className="text-6xl">🔎</div>
        <h1 className="mt-4 text-2xl font-bold text-white">Business not found</h1>
        <Link to="/" className="mt-6 inline-flex rounded-xl bg-gradient-brand px-4 py-2 text-white">← Home</Link>
      </div>
      <Footer />
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-6 text-white">Error: {error.message}</div>,
});

function BusinessPage() {
  const b = Route.useLoaderData();
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link to="/" className="text-sm text-muted-foreground hover:text-white">← Back</Link>
        <div className="glass mt-4 overflow-hidden rounded-3xl">
          <div className="flex items-center justify-center bg-gradient-to-br from-brand/30 to-teal/20 py-16 text-7xl">
            {b.emoji}
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">{b.name}</h1>
                <p className="text-muted-foreground">{b.category} • {b.address}</p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-white">
                <span className="text-yellow-400">★</span> {b.rating.toFixed(1)}
              </div>
            </div>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-teal/15 px-3 py-1 text-sm text-teal">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" /> Open now
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              <a href={`tel:${b.phone}`} className="rounded-xl bg-white/5 py-3 text-center text-sm text-white hover:bg-white/10">
                📞 Call {b.phone}
              </a>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(b.name + " Asaka")}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-white/5 py-3 text-center text-sm text-white hover:bg-white/10"
              >
                🧭 Directions
              </a>
              <button className="rounded-xl bg-gradient-brand py-3 text-sm font-medium text-white shadow-glow">
                📅 Book
              </button>
            </div>

            <div className="mt-8 rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-muted-foreground">
              Full business profile with menu, reviews, booking form, FAQ, and AI chat is coming in Prompt #2.
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
