import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { specialOffers } from "@/lib/mock-data";

export function Sidebar() {
  const [chat, setChat] = useState(false);
  const [messages, setMessages] = useState<{ from: "ai" | "me"; text: string }[]>([
    { from: "ai", text: "Salom! Men Smart Asaka AI yordamchisiman. Nimani qidiryapsiz?" },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    const q = input.trim();
    setMessages((m) => [
      ...m,
      { from: "me", text: q },
      { from: "ai", text: aiReply(q) },
    ]);
    setInput("");
  };

  return (
    <aside className="space-y-4">
      {/* Mini map */}
      <div className="glass overflow-hidden rounded-2xl p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-medium text-white">Asaka City Center</div>
          <Link to="/explore" className="text-xs text-brand hover:underline">
            View map →
          </Link>
        </div>
        <svg viewBox="0 0 300 160" className="h-40 w-full rounded-xl bg-white/[0.03]">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,0.06)" />
            </pattern>
          </defs>
          <rect width="300" height="160" fill="url(#grid)" />
          <path d="M0 100 Q 150 60 300 110" stroke="#0066FF" strokeWidth="2" fill="none" opacity="0.5" />
          <path d="M60 0 L 120 160" stroke="#00D4AA" strokeWidth="2" fill="none" opacity="0.5" />
          <circle cx="90" cy="70" r="6" fill="#0066FF" />
          <circle cx="170" cy="100" r="6" fill="#00D4AA" />
          <circle cx="220" cy="60" r="6" fill="#F59E0B" />
        </svg>
      </div>

      {/* Weather */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-semibold text-white">34°C</div>
            <div className="text-xs text-muted-foreground">Sunny • Asaka</div>
          </div>
          <div className="text-4xl">☀️</div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
          <div className="rounded-lg bg-white/5 p-2">
            <div className="text-white">42%</div>Humidity
          </div>
          <div className="rounded-lg bg-white/5 p-2">
            <div className="text-white">12 km/h</div>Wind
          </div>
          <div className="rounded-lg bg-white/5 p-2">
            <div className="text-white">High</div>UV
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <button
        type="button"
        onClick={() => setChat(true)}
        className="group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-gradient-brand p-4 text-left shadow-glow transition hover:scale-[1.02]"
      >
        <div className="text-3xl">✨</div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-white">AI Assistant</div>
          <div className="text-xs text-white/80">Ask anything about Asaka</div>
        </div>
        <div className="text-white">→</div>
      </button>

      {/* Special offers */}
      <div className="glass rounded-2xl p-4">
        <div className="mb-3 text-sm font-medium text-white">Special Offers</div>
        <div className="space-y-2">
          {specialOffers.map((o) => (
            <Link
              key={o.id}
              to="/business/$slug"
              params={{ slug: o.businessSlug }}
              className="block rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-white">{o.business}</div>
                <div className="rounded-full bg-teal/20 px-2 py-0.5 text-[10px] font-semibold text-teal">
                  {o.label}
                </div>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{o.note}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* AI Chat Panel */}
      {chat && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-end bg-black/50 p-0 sm:items-center sm:p-6"
          onClick={() => setChat(false)}
        >
          <div
            className="glass flex h-[70vh] w-full flex-col rounded-t-2xl sm:h-[560px] sm:max-w-md sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-brand">✨</div>
                <div>
                  <div className="text-sm font-semibold text-white">Smart Asaka AI</div>
                  <div className="text-xs text-teal">● Online</div>
                </div>
              </div>
              <button
                onClick={() => setChat(false)}
                className="rounded-lg bg-white/5 px-3 py-1 text-sm text-white"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={m.from === "me" ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={
                      "max-w-[80%] rounded-2xl px-3 py-2 text-sm " +
                      (m.from === "me"
                        ? "bg-gradient-brand text-white"
                        : "bg-white/10 text-white")
                    }
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1 px-4 pb-2">
              {["Restoranlar", "Shifoxonalar", "Ochiq joylar", "Ob-havo"].map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setInput(q);
                  }}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground hover:text-white"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 border-t border-white/10 p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Savolingizni yozing..."
                className="flex-1 rounded-xl bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={send}
                className="rounded-xl bg-gradient-brand px-4 py-2 text-sm font-medium text-white shadow-glow"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

function aiReply(q: string): string {
  const s = q.toLowerCase();
  if (s.includes("restoran") || s.includes("osh") || s.includes("food"))
    return "Osh Markazi (4.9★, Babur ko'chasi) va Choyxona Asaka juda mashhur. Bron qilib beraymi?";
  if (s.includes("shifo") || s.includes("clinic") || s.includes("medical"))
    return "Asaka Medical Center — Navoi shoh ko'chasida, 4.7★. Bugun ochiq: 08:00–20:00.";
  if (s.includes("ob") || s.includes("weather"))
    return "Bugun Asakada 34°C, quyoshli. Namlik 42%, shamol 12 km/soat.";
  if (s.includes("ochiq") || s.includes("open"))
    return "Hozir 1,200+ biznesdan 780 tasi ochiq. Toifani tanlang: Restaurants, Pharmacy, Beauty...";
  return "Yaxshi savol! Biznes yoki toifa nomini yozing — masalan, 'restoran' yoki 'shifoxona'.";
}
