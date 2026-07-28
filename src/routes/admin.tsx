import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { mySupabase, TABLES } from "@/lib/my-supabase";
import {
  approveBusiness,
  bookingsRevenue,
  countUsers,
  downloadCsv,
  findAdminByEmail,
  listAllBusinesses,
  rejectBusiness,
  rejectionEmailLink,
  toCsv,
  type AdminBusiness,
} from "@/lib/admin-data";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin dashboard — Smart Asaka" },
      { name: "description", content: "Moderate business listings, review submissions and track platform stats on Smart Asaka." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin dashboard — Smart Asaka" },
      { property: "og:description", content: "Moderate business listings and track platform stats." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

const SESSION_KEY = "smart-asaka-admin";

const REJECT_REASONS = [
  "Incomplete information",
  "Wrong category",
  "Duplicate business",
  "Invalid contact info",
  "Inappropriate content",
  "Other",
];

type Tab = "pending" | "approved" | "rejected" | "all";

type Activity = { id: string; text: string; at: string };

function statusOf(b: AdminBusiness) {
  return (b.status ?? "pending").toLowerCase();
}

function fmt(ts?: string | null) {
  if (!ts) return "—";
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

function AdminPage() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? sessionStorage.getItem(SESSION_KEY) : null;
    setAdmin(saved);
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[var(--brand)]" />
      </div>
    );
  }

  if (!admin) {
    return (
      <AdminGate
        onSuccess={(email) => {
          sessionStorage.setItem(SESSION_KEY, email);
          setAdmin(email);
        }}
        onDeny={() => navigate({ to: "/", replace: true })}
      />
    );
  }

  return (
    <Dashboard
      adminEmail={admin}
      onSignOut={() => {
        sessionStorage.removeItem(SESSION_KEY);
        setAdmin(null);
        navigate({ to: "/", replace: true });
      }}
    />
  );
}

function AdminGate({
  onSuccess,
  onDeny,
}: {
  onSuccess: (email: string) => void;
  onDeny: () => void;
}) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const user = await findAdminByEmail(email);
      if (user && (user.user_type ?? "").toLowerCase() === "admin") {
        onSuccess(user.email ?? email.trim());
      } else {
        setError("This account is not an admin. Redirecting to homepage…");
        setTimeout(onDeny, 1600);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not verify admin access.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto flex max-w-md flex-col px-4 py-20">
        <div className="glass rounded-2xl p-8">
          <div className="text-4xl">🛡️</div>
          <h1 className="mt-3 text-2xl font-bold text-white">Admin access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the email of an account with <code className="text-white">user_type = "admin"</code>.
          </p>
          <form onSubmit={submit} className="mt-6 space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@smartasaka.uz"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-muted-foreground focus:border-[var(--brand)]"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-gradient-brand px-4 py-3 text-sm font-medium text-white shadow-glow disabled:opacity-60"
            >
              {busy ? "Checking…" : "Enter dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={"mt-2 text-2xl font-bold " + (accent ?? "text-white")}>{value}</div>
      {hint && <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    approved: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    pending: "bg-amber-500/15 text-amber-300 border-amber-400/30",
    rejected: "bg-red-500/15 text-red-300 border-red-400/30",
  };
  return (
    <span className={"inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize " + (map[status] ?? "border-white/15 bg-white/5 text-muted-foreground")}>
      {status}
    </span>
  );
}

function Dashboard({ adminEmail, onSignOut }: { adminEmail: string; onSignOut: () => void }) {
  const [rows, setRows] = useState<AdminBusiness[]>([]);
  const [users, setUsers] = useState(0);
  const [revenue, setRevenue] = useState({ total: 0, count: 0, hasAmountField: false });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("pending");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [preview, setPreview] = useState<AdminBusiness | null>(null);
  const [rejecting, setRejecting] = useState<AdminBusiness | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setLoadError(null);
    try {
      const [b, u, r] = await Promise.all([listAllBusinesses(), countUsers(), bookingsRevenue()]);
      setRows(b);
      setUsers(u);
      setRevenue(r);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Could not load data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const channel = mySupabase
      .channel("admin-business")
      .on("postgres_changes", { event: "*", schema: "public", table: TABLES.business }, () => load())
      .subscribe();
    return () => {
      mySupabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function log(text: string) {
    setActivity((a) => [{ id: crypto.randomUUID(), text, at: new Date().toISOString() }, ...a].slice(0, 25));
  }

  const counts = useMemo(() => {
    const c = { total: rows.length, pending: 0, approved: 0, rejected: 0 };
    rows.forEach((b) => {
      const s = statusOf(b);
      if (s === "approved") c.approved += 1;
      else if (s === "rejected") c.rejected += 1;
      else c.pending += 1;
    });
    return c;
  }, [rows]);

  const visible = useMemo(() => {
    let list = tab === "all" ? rows : rows.filter((b) => statusOf(b) === tab);
    if (tab === "rejected" && reasonFilter !== "all") {
      list = list.filter((b) => (b.reject_reason ?? "") === reasonFilter);
    }
    return list;
  }, [rows, tab, reasonFilter]);

  async function handleApprove(b: AdminBusiness) {
    try {
      await approveBusiness(b.id);
      setRows((prev) => prev.map((r) => (r.id === b.id ? { ...r, status: "approved" } : r)));
      log(`You approved ${b.name}`);
      setPreview(null);
      setNotice(`${b.name} is now live.`);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Approve failed.");
    }
  }

  async function handleReject(b: AdminBusiness, reason: string, remark: string) {
    try {
      const { degraded } = await rejectBusiness(b.id, { reason, remark, adminEmail });
      setRows((prev) =>
        prev.map((r) =>
          r.id === b.id
            ? {
                ...r,
                status: "rejected",
                reject_reason: reason,
                reject_remark: remark,
                rejected_at: new Date().toISOString(),
                rejected_by: adminEmail,
              }
            : r,
        ),
      );
      log(`You rejected ${b.name} — Reason: ${reason}`);
      setRejecting(null);
      window.open(rejectionEmailLink(b, reason, remark), "_blank");
      setNotice(
        degraded
          ? `${b.name} rejected. Reason details weren't saved — add the reject_reason, reject_remark, rejected_at and rejected_by columns to your business table.`
          : `${b.name} rejected and an email draft to the owner was opened.`,
      );
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Reject failed.");
    }
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "pending", label: "Pending", count: counts.pending },
    { key: "approved", label: "Approved", count: counts.approved },
    { key: "rejected", label: "Rejected", count: counts.rejected },
    { key: "all", label: "All", count: counts.total },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Signed in as {adminEmail}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={load}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
            >
              ⟳ Refresh
            </button>
            <button
              onClick={onSignOut}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground transition hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>

        {notice && (
          <div className="mt-4 flex items-start justify-between gap-4 rounded-xl border border-[var(--brand)]/30 bg-[var(--brand)]/10 px-4 py-3 text-sm text-white">
            <span>{notice}</span>
            <button onClick={() => setNotice(null)} className="text-muted-foreground hover:text-white">✕</button>
          </div>
        )}
        {loadError && (
          <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {loadError}
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
          <StatCard label="Total businesses" value={String(counts.total)} />
          <StatCard label="Pending review" value={String(counts.pending)} accent="text-amber-300" />
          <StatCard label="Approved" value={String(counts.approved)} accent="text-emerald-300" />
          <StatCard label="Total users" value={String(users)} />
          <StatCard
            label="Monthly revenue"
            value={revenue.hasAmountField ? `${revenue.total.toLocaleString()} UZS` : "—"}
            hint={revenue.hasAmountField ? `${revenue.count} bookings` : `${revenue.count} bookings · no amount column`}
            accent="text-[var(--brand-2,#00D4AA)]"
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="glass rounded-2xl p-4">
            <div className="flex flex-wrap items-center gap-2">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={
                    "rounded-lg px-3 py-2 text-sm transition " +
                    (tab === t.key
                      ? "bg-gradient-brand text-white shadow-glow"
                      : "text-muted-foreground hover:bg-white/5 hover:text-white")
                  }
                >
                  {t.label} <span className="opacity-70">({t.count})</span>
                </button>
              ))}
              {tab === "rejected" && (
                <select
                  value={reasonFilter}
                  onChange={(e) => setReasonFilter(e.target.value)}
                  className="ml-auto rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                >
                  <option value="all">All reasons</option>
                  {REJECT_REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="mt-4 overflow-x-auto">
              {loading ? (
                <div className="py-16 text-center text-sm text-muted-foreground">Loading businesses…</div>
              ) : visible.length === 0 ? (
                <div className="py-16 text-center text-sm text-muted-foreground">No businesses in this tab yet.</div>
              ) : (
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-widest text-muted-foreground">
                      {tab === "rejected" ? (
                        <>
                          <th className="px-3 py-2">Name</th>
                          <th className="px-3 py-2">Category</th>
                          <th className="px-3 py-2">Rejected</th>
                          <th className="px-3 py-2">Reason</th>
                          <th className="px-3 py-2 text-right">Actions</th>
                        </>
                      ) : (
                        <>
                          <th className="px-3 py-2">Logo</th>
                          <th className="px-3 py-2">Name</th>
                          <th className="px-3 py-2">Category</th>
                          <th className="px-3 py-2">Phone</th>
                          <th className="px-3 py-2">Address</th>
                          <th className="px-3 py-2">Status</th>
                          <th className="px-3 py-2 text-right">Actions</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((b) => (
                      <tr key={b.id} className="border-t border-white/5 text-white/90">
                        {tab === "rejected" ? (
                          <>
                            <td className="px-3 py-3 font-medium text-white">{b.name}</td>
                            <td className="px-3 py-3 text-muted-foreground">{b.category ?? "—"}</td>
                            <td className="px-3 py-3 text-muted-foreground">{fmt(b.rejected_at)}</td>
                            <td className="px-3 py-3 text-muted-foreground">{b.reject_reason ?? "—"}</td>
                            <td className="px-3 py-3">
                              <div className="flex justify-end gap-1.5">
                                <IconBtn title="View details" onClick={() => setPreview(b)}>👁️</IconBtn>
                                <IconBtn title="Re-approve" onClick={() => handleApprove(b)}>✅</IconBtn>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-3 py-3">
                              {b.logo_url ? (
                                <img src={b.logo_url} alt={`${b.name} logo`} loading="lazy" className="h-9 w-9 rounded-lg object-cover" />
                              ) : (
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-xs">🏢</div>
                              )}
                            </td>
                            <td className="px-3 py-3 font-medium text-white">{b.name}</td>
                            <td className="px-3 py-3 text-muted-foreground">{b.category ?? "—"}</td>
                            <td className="px-3 py-3 text-muted-foreground">{b.phone ?? "—"}</td>
                            <td className="max-w-[220px] truncate px-3 py-3 text-muted-foreground">{b.address ?? "—"}</td>
                            <td className="px-3 py-3"><StatusPill status={statusOf(b)} /></td>
                            <td className="px-3 py-3">
                              <div className="flex justify-end gap-1.5">
                                <IconBtn title="Preview" onClick={() => setPreview(b)}>👁️</IconBtn>
                                <IconBtn title="Approve" onClick={() => handleApprove(b)}>✅</IconBtn>
                                <IconBtn title="Reject" onClick={() => setRejecting(b)}>❌</IconBtn>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="glass rounded-2xl p-4">
              <h2 className="text-sm font-semibold text-white">Activity feed</h2>
              <div className="mt-3 space-y-3">
                {activity.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No activity in this session yet.</p>
                ) : (
                  activity.map((a) => (
                    <div key={a.id} className="rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                      <div className="text-xs text-white">{a.text}</div>
                      <div className="mt-1 text-[10px] text-muted-foreground">{fmt(a.at)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="glass rounded-2xl p-4">
              <h2 className="text-sm font-semibold text-white">Quick actions</h2>
              <div className="mt-3 space-y-2">
                <QuickAction
                  label="⬇️ Export all data to CSV"
                  onClick={() => downloadCsv("smart-asaka-businesses.csv", toCsv(rows as unknown as Record<string, unknown>[]))}
                />
                <QuickAction label="📊 View analytics charts" onClick={() => setNotice("Analytics charts are not built yet — tell me and I'll add them.")} />
                <QuickAction
                  label="✉️ Email all business owners"
                  onClick={() => {
                    const emails = Array.from(new Set(rows.map((r) => r.owner_email).filter(Boolean))).join(",");
                    if (!emails) return setNotice("No owner emails on record yet.");
                    window.open(`mailto:?bcc=${emails}&subject=${encodeURIComponent("Smart Asaka update")}`, "_blank");
                  }}
                />
                <QuickAction label="⚙️ System settings" onClick={() => setNotice("System settings are not configured yet.")} />
              </div>
            </div>
          </aside>
        </div>
      </main>

      {preview && (
        <PreviewModal business={preview} onClose={() => setPreview(null)} onApprove={() => handleApprove(preview)} />
      )}
      {rejecting && (
        <RejectModal
          business={rejecting}
          onCancel={() => setRejecting(null)}
          onConfirm={(reason, remark) => handleReject(rejecting, reason, remark)}
        />
      )}
    </div>
  );
}

function IconBtn({ children, title, onClick }: { children: React.ReactNode; title: string; onClick: () => void }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm transition hover:bg-white/10"
    >
      {children}
    </button>
  );
}

function QuickAction({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-xs text-white transition hover:bg-white/10"
    >
      {label}
    </button>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="my-8 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="glass rounded-2xl p-6">{children}</div>
      </div>
    </div>
  );
}

function PreviewModal({
  business,
  onClose,
  onApprove,
}: {
  business: AdminBusiness;
  onClose: () => void;
  onApprove: () => void;
}) {
  const photos = Array.isArray(business.photos) ? business.photos : [];
  const hours =
    typeof business.working_hours === "string"
      ? business.working_hours
      : business.working_hours
        ? JSON.stringify(business.working_hours)
        : "—";

  return (
    <Modal onClose={onClose}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {business.logo_url ? (
            <img src={business.logo_url} alt={`${business.name} logo`} className="h-14 w-14 rounded-xl object-cover" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/5 text-xl">🏢</div>
          )}
          <div>
            <h2 className="text-xl font-bold text-white">{business.name}</h2>
            <div className="mt-1 flex items-center gap-2">
              <StatusPill status={statusOf(business)} />
              <span className="text-xs text-muted-foreground">{business.category ?? "—"}</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-white">✕</button>
      </div>

      {photos.length > 0 && (
        <div className="mt-5 flex gap-2 overflow-x-auto">
          {photos.map((p) => (
            <img key={p} src={p} alt={business.name} loading="lazy" className="h-24 w-32 shrink-0 rounded-xl object-cover" />
          ))}
        </div>
      )}

      <div className="mt-5 space-y-4 text-sm">
        <Field label="Description" value={business.description ?? "—"} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone" value={business.phone ?? "—"} />
          <Field label="Address" value={business.address ?? "—"} />
          <Field label="Working hours" value={hours} />
          <Field label="Rating" value={`${business.rating ?? 0} ★ (${business.review_count ?? 0})`} />
          <Field label="Owner" value={business.owner_name ?? "—"} />
          <Field label="Owner email" value={business.owner_email ?? "—"} />
        </div>
        {statusOf(business) === "rejected" && (
          <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-3">
            <Field label="Reject reason" value={business.reject_reason ?? "—"} />
            <div className="mt-2" />
            <Field label="Remark" value={business.reject_remark ?? "—"} />
            <div className="mt-2 text-[11px] text-muted-foreground">
              {fmt(business.rejected_at)} · {business.rejected_by ?? "—"}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white">
          Close
        </button>
        <button onClick={onApprove} className="rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-medium text-white shadow-glow">
          ✅ Approve &amp; Go Live
        </button>
      </div>
    </Modal>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 whitespace-pre-wrap text-white/90">{value}</div>
    </div>
  );
}

function RejectModal({
  business,
  onCancel,
  onConfirm,
}: {
  business: AdminBusiness;
  onCancel: () => void;
  onConfirm: (reason: string, remark: string) => void;
}) {
  const [reason, setReason] = useState(REJECT_REASONS[0]);
  const [custom, setCustom] = useState("");
  const [remark, setRemark] = useState("");

  const finalReason = reason === "Other" ? custom.trim() || "Other" : reason;

  return (
    <Modal onClose={onCancel}>
      <h2 className="text-xl font-bold text-white">Reject business</h2>
      <p className="mt-1 text-sm text-muted-foreground">{business.name}</p>

      <label className="mt-5 block text-xs uppercase tracking-widest text-muted-foreground">Reason</label>
      <select
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[var(--brand)]"
      >
        {REJECT_REASONS.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      {reason === "Other" && (
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Custom reason"
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-muted-foreground focus:border-[var(--brand)]"
        />
      )}

      <label className="mt-5 block text-xs uppercase tracking-widest text-muted-foreground">
        Message to owner (optional)
      </label>
      <textarea
        value={remark}
        maxLength={300}
        rows={4}
        onChange={(e) => setRemark(e.target.value)}
        placeholder="Explain what needs to be fixed..."
        className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-muted-foreground focus:border-[var(--brand)]"
      />
      <div className="mt-1 text-right text-[11px] text-muted-foreground">{remark.length}/300</div>

      <div className="mt-6 flex justify-end gap-2">
        <button onClick={onCancel} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white">
          Cancel
        </button>
        <button
          onClick={() => onConfirm(finalReason, remark)}
          className="rounded-xl bg-red-500/90 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-500"
        >
          ⚠️ Confirm reject
        </button>
      </div>
    </Modal>
  );
}
