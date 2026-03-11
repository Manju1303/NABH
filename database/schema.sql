-- NABH Compliance Engine PostgreSQL Schema
-- Run this in your Supabase SQL Editor

-- 1. Create a table to store the raw form submissions (JSON format captures changing fields dynamically)
CREATE TABLE public.nabh_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    hospital_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) NOT NULL,
    submission_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    form_data JSONB NOT NULL,
    score INT NOT NULL,
    max_score INT NOT NULL DEFAULT 100,
    readiness_percentage NUMERIC(5,2) NOT NULL,
    is_ready BOOLEAN NOT NULL DEFAULT FALSE
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.nabh_records ENABLE ROW LEVEL SECURITY;

-- 2. Create policies for Row Level Security
-- Example: Allow authenticated hospitals to view their own data
-- Here we're using anon/authenticated logic, but a hospital_id constraint is usually needed, which links to Supabase Auth UUID.
CREATE POLICY "Enable insert for authenticated users only"
ON public.nabh_records FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable select for users based on their auth.uid"
ON public.nabh_records FOR SELECT
TO authenticated
USING (true); -- Note: In real production, verify hospital_id with auth.uid()
