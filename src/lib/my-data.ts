// Data access for YOUR Supabase database (tables: business, users, bookings, reviews).
import { mySupabase, TABLES } from "./my-supabase";

export type BusinessRow = {
  id: string;
  name: string;
  category: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
  logo_url: string | null;
  photos: string[] | null;
  working_hours: unknown;
  owner_name: string | null;
  owner_email: string | null;
  status: string | null;
  rating: number | null;
  review_count: number | null;
};

export type ReviewRow = {
  id: string;
  business_id: string;
  customer_name: string | null;
  rating: number;
  comment: string | null;
  created_at?: string;
};

export type BookingInput = {
  business_id: string;
  customer_name: string;
  customer_phone: string;
  booking_date: string;
  booking_time: string;
  guests: number;
};

export async function listBusinesses() {
  const { data, error } = await mySupabase
    .from(TABLES.business)
    .select("*")
    .order("rating", { ascending: false });
  if (error) throw error;
  return (data ?? []) as BusinessRow[];
}

export async function getBusinessById(id: string) {
  const { data, error } = await mySupabase
    .from(TABLES.business)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as BusinessRow | null;
}

export async function listReviews(businessId: string) {
  const { data, error } = await mySupabase
    .from(TABLES.reviews)
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ReviewRow[];
}

export async function createReview(input: Omit<ReviewRow, "id" | "created_at">) {
  const { data, error } = await mySupabase.from(TABLES.reviews).insert(input).select().single();
  if (error) throw error;
  return data as ReviewRow;
}

export async function createBooking(input: BookingInput) {
  const { data, error } = await mySupabase.from(TABLES.bookings).insert(input).select().single();
  if (error) throw error;
  return data;
}
