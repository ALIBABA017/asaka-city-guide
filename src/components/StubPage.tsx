import { Link } from "@tanstack/react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function StubPage({
  title,
  description,
  emoji = "🚧",
}: {
  title: string;
  description: string;
  emoji?: string;
}) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <div className="text-6xl">{emoji}</div>
        <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">{title}</h1>
        <p className="mt-3 text-muted-foreground">{description}</p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-medium text-white shadow-glow"
        >
          ← Back to home
        </Link>
      </div>
      <Footer />
    </div>
  );
}
