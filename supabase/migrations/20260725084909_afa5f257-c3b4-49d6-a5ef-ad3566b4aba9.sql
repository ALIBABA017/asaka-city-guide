
-- =====================================================
-- PROFILES
-- =====================================================
CREATE TYPE public.user_type AS ENUM ('customer', 'business_owner');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  phone TEXT,
  city TEXT DEFAULT 'Asaka',
  user_type public.user_type NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, phone, city, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'city', 'Asaka'),
    COALESCE((NEW.raw_user_meta_data ->> 'user_type')::public.user_type, 'customer')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Shared updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- BUSINESSES
-- =====================================================
CREATE TYPE public.business_status AS ENUM ('pending', 'active', 'rejected');

CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  category TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  description TEXT,
  logo_url TEXT,
  photos TEXT[] NOT NULL DEFAULT '{}',
  working_hours JSONB NOT NULL DEFAULT '{}'::jsonb,
  owner_name TEXT,
  owner_email TEXT,
  status public.business_status NOT NULL DEFAULT 'pending',
  rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.businesses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.businesses TO authenticated;
GRANT ALL ON public.businesses TO service_role;

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active businesses"
  ON public.businesses FOR SELECT TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "Owners can view their own businesses"
  ON public.businesses FOR SELECT TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Authenticated users can create businesses"
  ON public.businesses FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their own businesses"
  ON public.businesses FOR UPDATE TO authenticated
  USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own businesses"
  ON public.businesses FOR DELETE TO authenticated
  USING (auth.uid() = owner_id);

CREATE INDEX idx_businesses_category ON public.businesses(category);
CREATE INDEX idx_businesses_status ON public.businesses(status);
CREATE INDEX idx_businesses_owner ON public.businesses(owner_id);

CREATE TRIGGER trg_businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- BOOKINGS
-- =====================================================
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1 CHECK (guests > 0),
  status public.booking_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.bookings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create a booking"
  ON public.bookings FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Business owners can view bookings for their businesses"
  ON public.bookings FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = bookings.business_id AND b.owner_id = auth.uid()
    )
  );

CREATE POLICY "Business owners can update bookings for their businesses"
  ON public.bookings FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = bookings.business_id AND b.owner_id = auth.uid()
    )
  );

CREATE INDEX idx_bookings_business ON public.bookings(business_id);
CREATE INDEX idx_bookings_user ON public.bookings(user_id);
CREATE INDEX idx_bookings_date ON public.bookings(booking_date);

CREATE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- REVIEWS
-- =====================================================
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON public.reviews FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON public.reviews FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON public.reviews FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_reviews_business ON public.reviews(business_id);

-- Recompute business rating + review count when reviews change
CREATE OR REPLACE FUNCTION public.recompute_business_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_business UUID := COALESCE(NEW.business_id, OLD.business_id);
BEGIN
  UPDATE public.businesses b
  SET
    rating = COALESCE((SELECT ROUND(AVG(r.rating)::numeric, 2) FROM public.reviews r WHERE r.business_id = target_business), 0),
    review_count = (SELECT COUNT(*) FROM public.reviews r WHERE r.business_id = target_business)
  WHERE b.id = target_business;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_reviews_recompute_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.recompute_business_rating();
