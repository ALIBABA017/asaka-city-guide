import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CategoriesGrid } from "@/components/CategoriesGrid";
import { FeaturedBusinesses } from "@/components/FeaturedBusinesses";
import { Sidebar } from "@/components/Sidebar";
import { Trending } from "@/components/Trending";
import { EventsSection } from "@/components/EventsSection";
import { Footer } from "@/components/Footer";
import { featuredBusinesses, allBusinesses } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Asaka — Everything in Asaka. One platform." },
      {
        name: "description",
        content:
          "Discover 1,200+ restaurants, clinics, schools, and services in Asaka, Uzbekistan. Real reviews, live hours, one-tap booking.",
      },
      { property: "og:title", content: "Smart Asaka — City Directory for Asaka" },
      { property: "og:description", content: "Find and book the best places in Asaka." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const source = q ? allBusinesses : featuredBusinesses;
    return source.filter((b) => {
      const matchesQ =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q);
      const matchesTag = !tag || b.tags.includes(tag);
      return matchesQ && matchesTag;
    });
  }, [query, tag]);


  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero
        query={query}
        onQueryChange={setQuery}
        activeTag={tag}
        onTagChange={setTag}
      />

      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_320px]">
        <div>
          <CategoriesGrid />
          <FeaturedBusinesses items={filtered} query={query} />
        </div>
        <div className="lg:pt-10">
          <Sidebar />
        </div>
      </div>

      <Trending />
      <EventsSection />
      <Footer />
    </div>
  );
}
