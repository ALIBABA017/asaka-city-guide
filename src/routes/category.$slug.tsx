import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BusinessCard } from "@/components/BusinessCard";
import { allBusinesses, categories } from "@/lib/mock-data";

export const Route = createFileRoute("/category/$slug")({
  head: ({ loaderData }) => {
    const c = loaderData;
    return {
      meta: [
        { title: c ? `${c.name} in Asaka — Smart Asaka` : "Category — Smart Asaka" },
        { name: "description", content: c ? `Browse ${c.name.toLowerCase()} in Asaka.` : "Category listings." },
        { property: "og:title", content: c ? `${c.name} in Asaka` : "Category" },
        { property: "og:description", content: c ? `Best ${c.name.toLowerCase()} in Asaka.` : "" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  loader: ({ params }) => {
    const c = categories.find((x) => x.slug === params.slug);
    if (!c) throw notFound();
    return c;
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <div className="text-6xl">🔎</div>
        <h1 className="mt-4 text-2xl font-bold text-white">Category not found</h1>
        <Link to="/" className="mt-6 inline-flex rounded-xl bg-gradient-brand px-4 py-2 text-white">← Home</Link>
      </div>
      <Footer />
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-6 text-white">Error: {error.message}</div>,
});

function CategoryPage() {
  const c = Route.useLoaderData();
  const items = allBusinesses.filter((b) => b.categorySlug === c.slug);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Link to="/" className="text-sm text-muted-foreground hover:text-white">← Back</Link>
        <div className="mt-4 flex items-center gap-4">
          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br text-4xl ${c.gradient}`}>
            {c.emoji}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{c.name}</h1>
            <p className="text-sm text-muted-foreground">{items.length} places in Asaka</p>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.length === 0 ? (
            <div className="glass col-span-full rounded-2xl p-10 text-center text-muted-foreground">
              No listings yet in this category. Be the first to list.
            </div>
          ) : (
            items.map((b) => <BusinessCard key={b.slug} b={b} />)
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
