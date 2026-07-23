import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/StubPage";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Smart Asaka" },
      { name: "description", content: "Sign in or create an account on Smart Asaka." },
      { property: "og:title", content: "Sign in — Smart Asaka" },
      { property: "og:description", content: "Access your Smart Asaka account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <StubPage
      emoji="🔐"
      title="Sign in"
      description="Email + Google authentication will be enabled with Lovable Cloud in the next iteration."
    />
  ),
});
