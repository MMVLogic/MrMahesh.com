-- Create the user_entitlements table
CREATE TABLE IF NOT EXISTS public.user_entitlements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    app_id TEXT NOT NULL, -- e.g., 'openfit', 'pro_bundle'
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'canceled', 'past_due'
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, app_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_entitlements ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own entitlements
CREATE POLICY "Users can view own entitlements" 
    ON public.user_entitlements 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Service Role Policy: The backend webhook can do everything
CREATE POLICY "Service role can manage entitlements" 
    ON public.user_entitlements 
    USING (true)
    WITH CHECK (true);

-- Ensure updated_at triggers work
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_entitlements_modtime ON public.user_entitlements;
CREATE TRIGGER update_user_entitlements_modtime
    BEFORE UPDATE ON public.user_entitlements
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
