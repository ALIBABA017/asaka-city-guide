// Admin data access for the project's own Supabase instance.
import { mySupabase, TABLES } from "./my-supabase";
import type { BusinessRow } from "./my-data";

export type AdminBusiness = BusinessRow & {
  created_at?: string;
  reject_reason?: string | null;
  reject_remark?: string | null;
  rejected_at?: string | null;
  rejected_by?: string | null;
};

export type AdminUser = {
  id: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  city: string | null;
  user_type: string | null;
};

export async function listAllBusinesses() {
  const { data, error } = await mySupabase.from(TABLES.business).select("*");
  if (error) throw error;
  const rows = (data ?? []) as AdminBusiness[];
  return rows.sort((a, b) =>
    String(b.created_at ?? "").localeCompare(String(a.created_at ?? "")),
  );
}

export async function countUsers() {
  const { count, error } = await mySupabase
    .from(TABLES.users)
    .select("id", { count: "exact", head: true });
  if (error) return 0;
  return count ?? 0;
}

export async function findAdminByEmail(email: string) {
  const { data, error } = await mySupabase
    .from(TABLES.users)
    .select("*")
    .ilike("email", email.trim())
    .limit(1);
  if (error) throw error;
  const row = (data ?? [])[0] as AdminUser | undefined;
  return row ?? null;
}

const REVENUE_KEYS = ["total_price", "total", "amount", "price", "revenue"];

export async function bookingsRevenue() {
  const { data, error } = await mySupabase.from(TABLES.bookings).select("*");
  if (error) return { total: 0, count: 0, hasAmountField: false };
  const rows = (data ?? []) as Record<string, unknown>[];
  const key = REVENUE_KEYS.find((k) => rows.some((r) => typeof r[k] === "number"));
  const total = key ? rows.reduce((s, r) => s + (Number(r[key]) || 0), 0) : 0;
  return { total, count: rows.length, hasAmountField: Boolean(key) };
}

async function updateBusiness(id: string, patch: Record<string, unknown>) {
  const { error } = await mySupabase.from(TABLES.business).update(patch).eq("id", id);
  return error;
}

export async function approveBusiness(id: string) {
  const error = await updateBusiness(id, { status: "approved" });
  if (error) throw error;
}

export type RejectPayload = {
  reason: string;
  remark: string;
  adminEmail: string;
};

/**
 * Rejects a business. The extra reject_* columns may not exist yet in the
 * database, so we retry with just `status` if Postgres reports a missing column.
 */
export async function rejectBusiness(id: string, payload: RejectPayload) {
  const full = {
    status: "rejected",
    reject_reason: payload.reason,
    reject_remark: payload.remark || null,
    rejected_at: new Date().toISOString(),
    rejected_by: payload.adminEmail,
  };
  const error = await updateBusiness(id, full);
  if (!error) return { degraded: false };
  const missingColumn = error.code === "PGRST204" || /column/i.test(error.message ?? "");
  if (!missingColumn) throw error;
  const fallbackError = await updateBusiness(id, { status: "rejected" });
  if (fallbackError) throw fallbackError;
  return { degraded: true };
}

export function toCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return "";
  const headers = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
  const escape = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = typeof v === "object" ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join(
    "\n",
  );
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function rejectionEmailLink(b: AdminBusiness, reason: string, remark: string) {
  const subject = "Your Smart Asaka listing was rejected";
  const body = `Dear ${b.owner_name ?? "business owner"},\n\nYour business ${b.name} was not approved.\n\nReason: ${reason}\nRemark: ${remark || "—"}\n\nPlease fix the issues above and resubmit.\n\n— Smart Asaka team`;
  return `mailto:${b.owner_email ?? ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
