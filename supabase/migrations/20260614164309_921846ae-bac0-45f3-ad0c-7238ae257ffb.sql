CREATE TABLE public.radar_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  emoji text NOT NULL DEFAULT '🔥',
  category text NOT NULL DEFAULT 'Moda',
  hashtag text,
  hook text,
  affiliate_url text NOT NULL,
  image_url text,
  price numeric NOT NULL DEFAULT 0,
  old_price numeric,
  sales_24h integer NOT NULL DEFAULT 0,
  growth integer NOT NULL DEFAULT 0,
  views_millions numeric NOT NULL DEFAULT 0,
  creators integer NOT NULL DEFAULT 0,
  conversion_score integer NOT NULL DEFAULT 80,
  competition text NOT NULL DEFAULT 'MÉDIA',
  position integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.radar_products TO authenticated;
GRANT ALL ON public.radar_products TO service_role;

ALTER TABLE public.radar_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view active radar products"
  ON public.radar_products FOR SELECT
  TO authenticated
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert radar products"
  ON public.radar_products FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update radar products"
  ON public.radar_products FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete radar products"
  ON public.radar_products FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_radar_products_updated_at
  BEFORE UPDATE ON public.radar_products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
