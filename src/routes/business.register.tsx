import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/business/register")({
  beforeLoad: () => {
    throw redirect({ to: "/list-business" });
  },
});
