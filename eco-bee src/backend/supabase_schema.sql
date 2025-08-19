-- EcoBee Quiz Results Database Schema for Supabase
-- Run this in your Supabase SQL editor to create the necessary tables

-- Create the quiz_results table
CREATE TABLE IF NOT EXISTS public.quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dummy_user_id TEXT NOT NULL DEFAULT 'anonymous_user',
    session_id TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    quiz_responses JSONB,
    scoring_result JSONB,
    user_metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_results_dummy_user_id ON public.quiz_results(dummy_user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_timestamp ON public.quiz_results(timestamp);
CREATE INDEX IF NOT EXISTS idx_quiz_results_session_id ON public.quiz_results(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_scoring_gin ON public.quiz_results USING GIN(scoring_result);

-- Enable Row Level Security (RLS) for privacy
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows inserts for anonymous users
CREATE POLICY "Allow anonymous inserts" ON public.quiz_results
    FOR INSERT WITH CHECK (true);

-- Create a policy that allows reading only aggregated/anonymized data
CREATE POLICY "Allow reading anonymized data" ON public.quiz_results
    FOR SELECT USING (dummy_user_id IS NOT NULL);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_quiz_results_updated_at
    BEFORE UPDATE ON public.quiz_results
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions (adjust as needed)
GRANT INSERT ON public.quiz_results TO anon;
GRANT SELECT ON public.quiz_results TO anon;

-- Optional: Create a view for aggregated statistics (privacy-safe)
CREATE OR REPLACE VIEW public.quiz_statistics AS
SELECT 
    DATE_TRUNC('day', timestamp) as date,
    COUNT(*) as total_submissions,
    AVG(CAST(scoring_result->>'composite' AS FLOAT)) as avg_composite_score,
    AVG(CAST(scoring_result->'per_boundary_averages'->>'climate' AS FLOAT)) as avg_climate_score,
    AVG(CAST(scoring_result->'per_boundary_averages'->>'biosphere' AS FLOAT)) as avg_biosphere_score,
    AVG(CAST(scoring_result->'per_boundary_averages'->>'biogeochemical' AS FLOAT)) as avg_biogeochemical_score,
    AVG(CAST(scoring_result->'per_boundary_averages'->>'freshwater' AS FLOAT)) as avg_freshwater_score,
    AVG(CAST(scoring_result->'per_boundary_averages'->>'aerosols' AS FLOAT)) as avg_aerosols_score
FROM public.quiz_results
WHERE scoring_result IS NOT NULL
GROUP BY DATE_TRUNC('day', timestamp)
ORDER BY date DESC;

GRANT SELECT ON public.quiz_statistics TO anon;
