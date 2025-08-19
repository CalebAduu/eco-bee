-- Fix for RLS policy issue
-- Run this in your Supabase SQL Editor to fix the insert permission

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.quiz_results;

-- Create a more permissive policy for inserts
CREATE POLICY "Allow all inserts" ON public.quiz_results
    FOR INSERT 
    TO public 
    WITH CHECK (true);

-- Also allow the anon role to insert
CREATE POLICY "Allow anon inserts" ON public.quiz_results
    FOR INSERT 
    TO anon 
    WITH CHECK (true);

-- Verify permissions
GRANT INSERT ON public.quiz_results TO anon;
GRANT INSERT ON public.quiz_results TO public;
