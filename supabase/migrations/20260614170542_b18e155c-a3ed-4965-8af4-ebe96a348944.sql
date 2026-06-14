GRANT SELECT ON public.radar_products TO anon;

CREATE POLICY "Public can view active radar products"
  ON public.radar_products FOR SELECT
  TO anon
  USING (is_active = true);