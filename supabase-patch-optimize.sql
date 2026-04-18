-- ============================================================
-- Optimization patch — run in Supabase SQL Editor
-- ============================================================

-- 1. Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_products_supermarket
  ON public.products(supermarket);

CREATE INDEX IF NOT EXISTS idx_products_created_at
  ON public.products(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_products_product_id
  ON public.products(product_id);

-- 2. Fix wrong default currency (was 'USD', should be 'BOB')
ALTER TABLE public.products
  ALTER COLUMN currency SET DEFAULT 'BOB';

-- 3. View: product count per supermarket (avoids fetching all rows to JS)
CREATE OR REPLACE VIEW public.supermarket_product_counts AS
SELECT supermarket, COUNT(*) AS count
FROM public.products
GROUP BY supermarket;

-- 4. RPC: average price (avoids fetching all prices to JS)
CREATE OR REPLACE FUNCTION public.get_products_avg_price()
RETURNS numeric
LANGUAGE sql STABLE
AS $$
  SELECT COALESCE(ROUND(AVG(price)::numeric, 2), 0)
  FROM public.products;
$$;

-- 5. RLS on products (if not already set from previous migration)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read products"
  ON public.products FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON public.products FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON public.products FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete products"
  ON public.products FOR DELETE TO authenticated USING (true);
