
-- Lock down SECURITY DEFINER helpers (they're only invoked internally by triggers)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.recompute_business_rating() FROM PUBLIC, anon, authenticated;

-- Tighten booking insert: only allow bookings for active businesses
DROP POLICY IF EXISTS "Anyone can create a booking" ON public.bookings;

CREATE POLICY "Anyone can book an active business"
  ON public.bookings FOR INSERT TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = bookings.business_id AND b.status = 'active'
    )
    AND (user_id IS NULL OR user_id = auth.uid())
  );

-- Storage policies for business-photos bucket
CREATE POLICY "Public can view business photos"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'business-photos');

CREATE POLICY "Authenticated users can upload to their own folder"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'business-photos'
    AND auth.uid()::text = (storage.foldername(name))[2]
  );

CREATE POLICY "Users can update their own uploads"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'business-photos'
    AND auth.uid()::text = (storage.foldername(name))[2]
  );

CREATE POLICY "Users can delete their own uploads"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'business-photos'
    AND auth.uid()::text = (storage.foldername(name))[2]
  );
