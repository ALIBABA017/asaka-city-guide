import { Link } from "@tanstack/react-router";
import type { Business } from "@/lib/mock-data";
import { useState } from "react";

export function BusinessCard({ b }: { b: Business }) {
  const [booking, setBooking] = useState(false);

  return (
    <article className="glass group relative flex flex-col overflow-hidden rounded-2xl shadow-card transition hover:border-white/20">
      <Link
        to="/business/$slug"
        params={{ slug: b.slug }}
        className="flex flex-1 flex-col p-5"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-3xl">
            {b.emoji}
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-xs text-white">
            <span className="text-yellow-400">★</span> {b.rating.toFixed(1)}
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold text-white group-hover:text-gradient">
            {b.name}
          </h3>
          <p className="text-sm text-muted-foreground">{b.category}</p>
        </div>

        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span>📍 {b.address}</span>
          <span>• {b.distanceKm} km</span>
        </div>

        <div className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-teal/15 px-2.5 py-1 text-xs text-teal">
          <span className="h-1.5 w-1.5 rounded-full bg-teal" /> Open now
        </div>
      </Link>

      <div className="flex items-center gap-2 border-t border-white/10 p-3">
        <a
          href={`tel:${b.phone}`}
          className="flex-1 rounded-xl bg-white/5 py-2 text-center text-sm text-white transition hover:bg-white/10"
        >
          📞 Call
        </a>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(b.name + " Asaka")}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 rounded-xl bg-white/5 py-2 text-center text-sm text-white transition hover:bg-white/10"
        >
          🧭 Directions
        </a>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setBooking(true);
          }}
          className="flex-1 rounded-xl bg-gradient-brand py-2 text-sm font-medium text-white shadow-glow"
        >
          Book
        </button>
      </div>

      {booking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setBooking(false)}
        >
          <div
            className="glass w-full max-w-md rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-lg font-semibold text-white">Book at {b.name}</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Quick booking coming soon. For now, tap Call to reserve.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setBooking(false)}
                className="rounded-lg bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
              >
                Close
              </button>
              <a
                href={`tel:${b.phone}`}
                className="rounded-lg bg-gradient-brand px-4 py-2 text-sm font-medium text-white shadow-glow"
              >
                Call {b.phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
