import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/StubPage";

export const Route = createFileRoute("/for-business")({
  head: () => ({
    meta: [
      { title: "For Business — Smart Asaka" },
      { name: "description", content: "List your business on Smart Asaka and reach customers in Asaka." },
      { property: "og:title", content: "For Business — Smart Asaka" },
      { property: "og:description", content: "Grow your business in Asaka with Smart Asaka." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <StubPage
      emoji="💼"
      title="For Business"
      description="Owner tools, analytics, and subscription plans are coming next. Register your business to be first in line."
    />
  ),
});
