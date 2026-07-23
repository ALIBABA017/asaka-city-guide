import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { allBusinesses } from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";


export const Route = createFileRoute("/business/$slug")({
  head: ({ loaderData }) => {
    const b = loaderData as (typeof allBusinesses)[number] | undefined;
    return {
      meta: [
        { title: b ? `${b.name} — Smart Asaka` : "Business — Smart Asaka" },
        {
          name: "description",
          content: b
            ? `${b.name} — ${b.category} on ${b.address}, Asaka. Menu, reviews, booking and contacts.`
            : "Business profile.",
        },
        { property: "og:title", content: b?.name ?? "Business" },
        { property: "og:description", content: b ? `${b.category} in Asaka` : "" },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },

  loader: ({ params }) => {
    const b = allBusinesses.find((x) => x.slug === params.slug);
    if (!b) throw notFound();
    return b;
  },
  component: BusinessPage,
  notFoundComponent: () => (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <div className="text-6xl">🔎</div>
        <h1 className="mt-4 text-2xl font-bold text-white">Business not found</h1>
        <Link to="/" className="mt-6 inline-flex rounded-xl bg-gradient-brand px-4 py-2 text-white">
          ← Home
        </Link>
      </div>
      <Footer />
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-6 text-white">Error: {error.message}</div>,
});

type MenuItem = { name: string; price: string; popular?: boolean };
type Review = { name: string; rating: number; text: string };

const MENU: MenuItem[] = [
  { name: "Signature Plov", price: "45,000 UZS", popular: true },
  { name: "Samsa (4 pcs)", price: "28,000 UZS", popular: true },
  { name: "Lagman Soup", price: "35,000 UZS" },
  { name: "Shashlik (5 skewers)", price: "55,000 UZS", popular: true },
  { name: "Manti (6 pcs)", price: "32,000 UZS" },
  { name: "Choy (Tea)", price: "8,000 UZS" },
];

const HOURS: { day: string; hours: string }[] = [
  { day: "Monday", hours: "09:00 - 22:00" },
  { day: "Tuesday", hours: "09:00 - 22:00" },
  { day: "Wednesday", hours: "09:00 - 22:00" },
  { day: "Thursday", hours: "09:00 - 22:00" },
  { day: "Friday", hours: "09:00 - 23:00" },
  { day: "Saturday", hours: "10:00 - 23:00" },
  { day: "Sunday", hours: "10:00 - 22:00" },
];

const FAQS = [
  { q: "Do you accept reservations?", a: "Yes! Book through our website or call us directly." },
  { q: "Is there parking?", a: "Yes, free parking available for up to 15 cars." },
  { q: "Vegetarian options?", a: "Yes — vegetable lagman and pumpkin samsa are house favorites." },
  { q: "Large groups?", a: "Yes, our second floor comfortably fits up to 50 guests." },
];

const REVIEWS: Review[] = [
  { name: "Dilshod R.", rating: 5, text: "Best plov in Asaka!" },
  { name: "Nodira K.", rating: 5, text: "We celebrated our anniversary here!" },
  { name: "Timur A.", rating: 4, text: "Great food, slightly long wait." },
];

const RELATED = [
  { slug: "choyxona-asaka", name: "Choyxona Asaka", emoji: "🍖" },
  { slug: "silk-road-cafe", name: "Silk Road Café", emoji: "☕" },
  { slug: "osh-markazi", name: "Navruz Restaurant", emoji: "🥘" },
];

function BusinessPage() {
  const b = Route.useLoaderData();
  const { t } = useI18n();
  const [tab, setTab] = useState<"menu" | "reviews" | "book">("menu");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: "ai" | "me"; text: string }[]>([
    { from: "ai", text: "Hi! Ask me about Osh Markazi." },
  ]);
  const [chatInput, setChatInput] = useState("");


  const todayIdx = useMemo(() => {
    const js = new Date().getDay(); // 0=Sun
    return js === 0 ? 6 : js - 1;
  }, []);

  const sendChat = () => {
    const q = chatInput.trim();
    if (!q) return;
    setMessages((m) => [...m, { from: "me", text: q }, { from: "ai", text: aiReply(q) }]);
    setChatInput("");
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link to="/" className="text-sm text-muted-foreground hover:text-white">
          {t("biz.back")}
        </Link>


        {/* Cover */}
        <div className="glass mt-4 overflow-hidden rounded-3xl">
          <div className="flex items-center justify-center bg-gradient-to-br from-brand/30 to-teal/20 py-16 text-7xl">
            {b.emoji}
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">{b.name}</h1>
                <p className="text-muted-foreground">
                  {b.category} • {b.address}
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-white">
                <span className="text-yellow-400">★</span> {b.rating.toFixed(1)}
              </div>
            </div>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-teal/15 px-3 py-1 text-sm text-teal">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" /> {t("card.openNow")}
            </div>


            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <a
                href={`tel:${b.phone}`}
                className="rounded-xl bg-white/5 py-3 text-center text-sm text-white hover:bg-white/10"
              >
                📞 {t("card.call")} {b.phone}
              </a>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(b.name + " Asaka")}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-white/5 py-3 text-center text-sm text-white hover:bg-white/10"
              >
                🧭 {t("card.directions")}
              </a>

            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* About */}
            <section className="glass rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white">{t("biz.about")}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Authentic Uzbek cuisine since 2010. Famous for our signature plov, samsa, and
                lagman. Family-owned restaurant using recipes passed down through three
                generations. We source ingredients from local farms and serve generous portions
                in a warm, traditional atmosphere.
              </p>
            </section>

            {/* Owner */}
            <section className="glass rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-4xl">
                  👨‍🍳
                </div>
                <div>
                  <div className="text-lg font-semibold text-white">Abdulla Karimov</div>
                  <div className="text-sm text-muted-foreground">{t("biz.owner")}</div>
                  <div className="text-xs text-teal">Since 2010</div>

                </div>
              </div>
            </section>

            {/* Hours */}
            <section className="glass rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white">{t("biz.hours")}</h2>
              <div className="mt-3 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10">
                {HOURS.map((h, i) => (
                  <div
                    key={h.day}
                    className={
                      "flex items-center justify-between px-4 py-2.5 text-sm " +
                      (i === todayIdx
                        ? "bg-brand/20 text-white"
                        : "text-muted-foreground")
                    }
                  >
                    <span className={i === todayIdx ? "font-semibold text-white" : ""}>
                      {h.day} {i === todayIdx && <span className="ml-1 text-xs text-brand">{t("biz.today")}</span>}
                    </span>
                    <span className={i === todayIdx ? "text-white" : ""}>{h.hours}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Tabs */}
            <section className="glass rounded-2xl p-6">
              <div className="flex gap-2 rounded-xl bg-white/5 p-1">
                {(["menu", "reviews", "book"] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={
                      "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition " +
                      (tab === key
                        ? "bg-gradient-brand text-white shadow-glow"
                        : "text-muted-foreground hover:text-white")
                    }
                  >
                    {t(`biz.${key}`)}


                  </button>
                ))}
              </div>

              <div className="mt-5">
                {tab === "menu" && <MenuTab />}
                {tab === "reviews" && <ReviewsTab />}
                {tab === "book" && <BookTab phone={b.phone} />}
              </div>
            </section>

            {/* FAQ */}
            <section className="glass rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white">FAQ</h2>
              <div className="mt-3 space-y-2">
                {FAQS.map((f, i) => (
                  <div key={i} className="rounded-xl border border-white/10 bg-white/5">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-white"
                    >
                      <span>{f.q}</span>
                      <span className="text-muted-foreground">
                        {openFaq === i ? "−" : "+"}
                      </span>
                    </button>
                    {openFaq === i && (
                      <div className="border-t border-white/10 px-4 py-3 text-sm text-muted-foreground">
                        {f.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <section className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white">Contact</h3>
              <div className="mt-3 space-y-2 text-sm">
                <a href={`tel:${b.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-white">
                  📞 <span>{b.phone}</span>
                </a>
                <a href="https://t.me/oshmarkazi" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-white">
                  ✈️ <span>@oshmarkazi</span>
                </a>
                <a href="https://instagram.com/oshmarkazi_asaka" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-white">
                  📸 <span>@oshmarkazi_asaka</span>
                </a>
                <a href={`https://wa.me/${b.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-white">
                  💬 <span>WhatsApp</span>
                </a>
                <a href="https://oshmarkazi.uz" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-white">
                  🌐 <span>oshmarkazi.uz</span>
                </a>
              </div>
            </section>

            <section className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white">Location</h3>
              <svg viewBox="0 0 300 160" className="mt-3 h-40 w-full rounded-xl bg-white/[0.03]">
                <defs>
                  <pattern id="mgrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,0.06)" />
                  </pattern>
                </defs>
                <rect width="300" height="160" fill="url(#mgrid)" />
                <path d="M0 100 Q 150 60 300 110" stroke="#0066FF" strokeWidth="2" fill="none" opacity="0.5" />
                <circle cx="150" cy="80" r="8" fill="#0066FF" />
                <circle cx="150" cy="80" r="14" fill="#0066FF" opacity="0.25" />
              </svg>
              <p className="mt-2 text-xs text-muted-foreground">{b.address}, Asaka</p>
            </section>

            <section className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white">Special Offers</h3>
              <div className="mt-3 space-y-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-white">Lunch Special</div>
                    <span className="rounded-full bg-teal/20 px-2 py-0.5 text-[10px] font-semibold text-teal">20% OFF</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">Weekdays until 3 PM</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-white">Family Feast</div>
                    <span className="rounded-full bg-brand/20 px-2 py-0.5 text-[10px] font-semibold text-brand">DEAL</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">Plov + Samsa + Choy for 4</div>
                </div>
              </div>
            </section>

            <section className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white">Related</h3>
              <div className="mt-3 space-y-2">
                {RELATED.map((r) => (
                  <Link
                    key={r.name}
                    to="/business/$slug"
                    params={{ slug: r.slug }}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10"
                  >
                    <div className="text-2xl">{r.emoji}</div>
                    <div className="text-sm text-white">{r.name}</div>
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* Floating AI button */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-brand text-2xl shadow-glow transition hover:scale-110"
        aria-label="Open AI chat"
      >
        ✨
      </button>

      {chatOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-end bg-black/50 sm:items-center sm:p-6"
          onClick={() => setChatOpen(false)}
        >
          <div
            className="glass flex h-[70vh] w-full flex-col rounded-t-2xl sm:h-[560px] sm:max-w-md sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-brand">✨</div>
                <div>
                  <div className="text-sm font-semibold text-white">Osh Markazi AI</div>
                  <div className="text-xs text-teal">● Online</div>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="rounded-lg bg-white/5 px-3 py-1 text-sm text-white"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div key={i} className={m.from === "me" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={
                      "max-w-[80%] rounded-2xl px-3 py-2 text-sm " +
                      (m.from === "me" ? "bg-gradient-brand text-white" : "bg-white/10 text-white")
                    }
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 border-t border-white/10 p-3">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                placeholder="Ask about the menu, hours, booking..."
                className="flex-1 rounded-xl bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={sendChat}
                className="rounded-xl bg-gradient-brand px-4 py-2 text-sm font-medium text-white shadow-glow"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function MenuTab() {
  return (
    <div className="space-y-2">
      {MENU.map((m) => (
        <div
          key={m.name}
          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-white">{m.name}</span>
            {m.popular && (
              <span className="rounded-full bg-brand/20 px-2 py-0.5 text-[10px] font-semibold text-brand">
                POPULAR
              </span>
            )}
          </div>
          <span className="text-sm font-medium text-white">{m.price}</span>
        </div>
      ))}
    </div>
  );
}

function ReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);
  const [writing, setWriting] = useState(false);
  const [rName, setRName] = useState("");
  const [rRating, setRRating] = useState(5);
  const [rText, setRText] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rName.trim() || !rText.trim()) return;
    setReviews((prev) => [{ name: rName.trim(), rating: rRating, text: rText.trim() }, ...prev]);
    setRName("");
    setRText("");
    setRRating(5);
    setWriting(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold text-white">4.9★</div>
          <div className="text-xs text-muted-foreground">{reviews.length} reviews</div>
        </div>
        <button
          onClick={() => setWriting((w) => !w)}
          className="rounded-xl bg-gradient-brand px-4 py-2 text-sm font-medium text-white shadow-glow"
        >
          {writing ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {writing && (
        <form onSubmit={submit} className="mt-4 space-y-2 rounded-xl border border-white/10 bg-white/5 p-4">
          <input
            value={rName}
            onChange={(e) => setRName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-muted-foreground"
            required
          />
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRRating(n)}
                className={"text-2xl " + (n <= rRating ? "text-yellow-400" : "text-white/20")}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={rText}
            onChange={(e) => setRText(e.target.value)}
            placeholder="Share your experience..."
            rows={3}
            className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-muted-foreground"
            required
          />
          <button
            type="submit"
            className="rounded-xl bg-gradient-brand px-4 py-2 text-sm font-medium text-white shadow-glow"
          >
            Submit Review
          </button>
        </form>
      )}

      <div className="mt-4 space-y-3">
        {reviews.map((r, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-white">{r.name}</div>
              <div className="text-sm text-yellow-400">
                {"★".repeat(r.rating)}
                <span className="text-white/20">{"★".repeat(5 - r.rating)}</span>
              </div>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{r.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookTab({ phone }: { phone: string }) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("19:00");
  const [guests, setGuests] = useState("2");
  const [name, setName] = useState("");
  const [tel, setTel] = useState("+998");
  const [ok, setOk] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || tel.length < 9) return;
    setOk(true);
  };

  if (ok) {
    return (
      <div className="rounded-xl border border-teal/30 bg-teal/10 p-6 text-center">
        <div className="text-4xl">✅</div>
        <h4 className="mt-2 text-lg font-semibold text-white">Reservation Confirmed</h4>
        <p className="mt-1 text-sm text-muted-foreground">
          {name}, we've reserved a table for {guests} on {date} at {time}. We'll call {tel} to confirm.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setOk(false)}
            className="rounded-xl bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            New booking
          </button>
          <a
            href={`tel:${phone}`}
            className="rounded-xl bg-gradient-brand px-4 py-2 text-sm font-medium text-white shadow-glow"
          >
            Call restaurant
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="text-xs text-muted-foreground">Date</label>
        <input
          type="date"
          value={date}
          min={today}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white outline-none"
          required
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground">Time</label>
        <div className="mt-1 grid grid-cols-4 gap-2">
          {["18:00", "19:00", "20:00", "21:00"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTime(t)}
              className={
                "rounded-lg px-3 py-2 text-sm transition " +
                (time === t
                  ? "bg-gradient-brand text-white shadow-glow"
                  : "bg-white/5 text-muted-foreground hover:text-white")
              }
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-xs text-muted-foreground">Guests</label>
        <div className="mt-1 grid grid-cols-4 gap-2">
          {["2", "4", "6", "8+"].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGuests(g)}
              className={
                "rounded-lg px-3 py-2 text-sm transition " +
                (guests === g
                  ? "bg-gradient-brand text-white shadow-glow"
                  : "bg-white/5 text-muted-foreground hover:text-white")
              }
            >
              {g}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-xs text-muted-foreground">Your name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="mt-1 w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-muted-foreground"
          required
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground">Phone</label>
        <input
          value={tel}
          onChange={(e) => setTel(e.target.value)}
          placeholder="+998 90 123 45 67"
          pattern="^\+998\d{9}$"
          className="mt-1 w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-muted-foreground"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-gradient-brand py-3 text-sm font-medium text-white shadow-glow"
      >
        Confirm Reservation
      </button>
    </form>
  );
}

function aiReply(q: string): string {
  const s = q.toLowerCase();
  if (s.includes("menu") || s.includes("plov") || s.includes("food"))
    return "Our signature Plov is 45,000 UZS and one of our most popular dishes. Samsa and Shashlik are also favorites.";
  if (s.includes("hour") || s.includes("open") || s.includes("time"))
    return "We're open 09:00–22:00 Mon–Thu, until 23:00 Fri–Sat, and 10:00–22:00 Sunday.";
  if (s.includes("book") || s.includes("reserv") || s.includes("table"))
    return "Sure! Open the Book Table tab above — pick a date, time, and party size.";
  if (s.includes("park")) return "Yes, we have free parking for up to 15 cars.";
  if (s.includes("veg")) return "Yes — vegetable lagman and pumpkin samsa are great vegetarian options.";
  return "Great question! Ask about menu, hours, parking, vegetarian options, or booking a table.";
}
