-- Create supermarkets table
CREATE TABLE public.supermarkets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT supermarkets_pkey PRIMARY KEY (id)
);

-- Seed from existing product data
INSERT INTO public.supermarkets (name)
SELECT DISTINCT supermarket
FROM public.products
WHERE supermarket IS NOT NULL AND supermarket != ''
ON CONFLICT (name) DO NOTHING;

-- RLS
ALTER TABLE public.supermarkets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read supermarkets"
  ON public.supermarkets FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert supermarkets"
  ON public.supermarkets FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update supermarkets"
  ON public.supermarkets FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete supermarkets"
  ON public.supermarkets FOR DELETE TO authenticated USING (true);

-- Add aliases column for supermarket name variants (run if table already exists)
ALTER TABLE public.supermarkets ADD COLUMN IF NOT EXISTS aliases text[] DEFAULT '{}';
