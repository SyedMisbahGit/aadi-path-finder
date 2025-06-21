
-- Add tables for autonomous data crawling and status tracking
CREATE TABLE IF NOT EXISTS public.crawl_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_type VARCHAR(20) NOT NULL,
  year INTEGER NOT NULL,
  last_crawled TIMESTAMP WITH TIME ZONE,
  sources_crawled TEXT[],
  records_processed INTEGER DEFAULT 0,
  errors TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add table for ML model metadata and performance tracking
CREATE TABLE IF NOT EXISTS public.ml_models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_name VARCHAR(100) NOT NULL,
  model_type VARCHAR(50) NOT NULL, -- 'cutoff_prediction', 'safety_scoring', 'normalization'
  exam_type VARCHAR(20) NOT NULL,
  training_data_years INTEGER[],
  accuracy_score DECIMAL(5,4),
  last_trained TIMESTAMP WITH TIME ZONE,
  model_parameters JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add table for news sentiment analysis and safety scoring
CREATE TABLE IF NOT EXISTS public.news_sentiment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  news_source VARCHAR(100),
  headline TEXT,
  content_summary TEXT,
  sentiment_score DECIMAL(3,2), -- -1.0 to 1.0
  safety_relevance DECIMAL(3,2), -- 0.0 to 1.0
  gender_safety_score DECIMAL(3,2),
  cultural_safety_score DECIMAL(3,2),
  published_date TIMESTAMP WITH TIME ZONE,
  analyzed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add table for real-time counseling round tracking
CREATE TABLE IF NOT EXISTS public.counseling_rounds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_type VARCHAR(20) NOT NULL,
  year INTEGER NOT NULL,
  round_number INTEGER NOT NULL,
  round_name VARCHAR(50),
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT false,
  seat_matrix JSONB,
  cutoff_trends JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_crawl_status_exam_year ON public.crawl_status(exam_type, year);
CREATE INDEX IF NOT EXISTS idx_ml_models_type_exam ON public.ml_models(model_type, exam_type);
CREATE INDEX IF NOT EXISTS idx_news_sentiment_location ON public.news_sentiment(state, location);
CREATE INDEX IF NOT EXISTS idx_counseling_rounds_exam_year ON public.counseling_rounds(exam_type, year, is_active);

-- Enable RLS on new tables
ALTER TABLE public.crawl_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_sentiment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counseling_rounds ENABLE ROW LEVEL SECURITY;

-- Create public read policies (these are system tables that should be readable by all)
CREATE POLICY "Allow public read access to crawl_status" ON public.crawl_status FOR SELECT USING (true);
CREATE POLICY "Allow public read access to ml_models" ON public.ml_models FOR SELECT USING (true);
CREATE POLICY "Allow public read access to news_sentiment" ON public.news_sentiment FOR SELECT USING (true);
CREATE POLICY "Allow public read access to counseling_rounds" ON public.counseling_rounds FOR SELECT USING (true);
