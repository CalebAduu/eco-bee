-- Temporary fix: Disable RLS for testing
-- Run this in your Supabase SQL Editor

-- Temporarily disable Row Level Security to test inserts
ALTER TABLE public.quiz_results DISABLE ROW LEVEL SECURITY;

-- Ensure permissions are granted
GRANT ALL ON public.quiz_results TO anon;
GRANT ALL ON public.quiz_results TO public;
