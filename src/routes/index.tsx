import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CategoriesGrid } from "@/components/CategoriesGrid";
import { FeaturedBusinesses } from "@/components/FeaturedBusinesses";
import { Sidebar } from "@/components/Sidebar";
import { Trending } from "@/components/Trending";
import { EventsSection } from "@/components/EventsSection";
import { HowItWorks } from "@/components/HowItWorks";
import { WhyAsaka } from "@/components/WhyAsaka";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { featuredBusinesses, allBusinesses } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Asaka — Asakadagi hamma narsa" },
      {
        name: "description",
        content:
          "Restoranlar, klinikalar, do'konlar va xizmatlarni toping. Asaka shahri uchun raqamli platforma.",
      },
      { property: "og:title", content: "Smart Asaka — Asakadagi hamma narsa" },
      {
        property: "og:description",
        content:
          "Restoranlar, klinikalar, do'konlar va xizmatlarni toping. Asaka shahri uchun raqamli platforma.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
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
    <div className="min-h-screen animate-fade-in pb-16 md:pb-0">
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
      <HowItWorks />
      <WhyAsaka />
      <EventsSection />
      <Footer />
      <MobileNav />
    </div>
  );
}
