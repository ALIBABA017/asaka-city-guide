import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/StubPage";

export const Route = createFileRoute("/business/register")({
  head: () => ({
    meta: [
      { title: "List your business — Smart Asaka" },
      { name: "description", content: "Register your business on Smart Asaka and reach thousands of customers." },
      { property: "og:title", content: "List your business — Smart Asaka" },
      { property: "og:description", content: "Get discovered in Asaka." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <StubPage
      emoji="🏪"
      title="List your business"
      description="Registration form and owner dashboard will be enabled with Lovable Cloud in the next iteration."
    />
  ),
});
