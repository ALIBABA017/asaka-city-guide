import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/StubPage";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Asaka — Smart Asaka" },
      { name: "description", content: "Explore all businesses, categories, and places across Asaka." },
      { property: "og:title", content: "Explore Asaka" },
      { property: "og:description", content: "Discover places across Asaka." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <StubPage
      emoji="🗺️"
      title="Explore Asaka"
      description="Full explore page with map view is coming soon. Meanwhile, browse categories on the homepage."
    />
  ),
});
