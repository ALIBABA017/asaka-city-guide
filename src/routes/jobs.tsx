import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/StubPage";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Jobs in Asaka — Smart Asaka" },
      { name: "description", content: "Find local jobs and hire in Asaka, Uzbekistan." },
      { property: "og:title", content: "Jobs in Asaka" },
      { property: "og:description", content: "Local job listings across Asaka." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <StubPage
      emoji="💼"
      title="Jobs in Asaka"
      description="Local job board coming soon. Businesses will be able to post openings from their dashboard."
    />
  ),
});
