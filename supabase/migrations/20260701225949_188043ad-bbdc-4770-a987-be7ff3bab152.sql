CREATE TABLE public.coupon_uses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL,
  email text NOT NULL,
  external_ref text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_coupon_uses_code ON public.coupon_uses(code);
GRANT ALL ON public.coupon_uses TO service_role;
ALTER TABLE public.coupon_uses ENABLE ROW LEVEL SECURITY;
-- no policies: only service_role via admin client can access