
-- Create enum types for better data integrity
CREATE TYPE exam_type AS ENUM ('neet-ug', 'jee-main', 'jee-advanced');
CREATE TYPE category_type AS ENUM ('general', 'obc', 'sc', 'st', 'ews', 'pwd');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE college_type AS ENUM ('government', 'semi-government', 'private', 'deemed');

-- Student assessments table
CREATE TABLE public.student_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  exam_name exam_type NOT NULL,
  exam_year INTEGER NOT NULL,
  marks INTEGER NOT NULL,
  total_marks INTEGER NOT NULL,
  category category_type NOT NULL,
  gender gender_type NOT NULL,
  domicile_state TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  accommodation_preference TEXT NOT NULL,
  college_type_preference TEXT NOT NULL,
  religious_practices TEXT,
  special_needs TEXT,
  climate_preference TEXT,
  language_preference TEXT,
  additional_info TEXT,
  safety_priority_score INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Colleges master data table
CREATE TABLE public.colleges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  type college_type NOT NULL,
  exam_accepted exam_type[] NOT NULL,
  courses TEXT[] NOT NULL,
  annual_fees_min INTEGER,
  annual_fees_max INTEGER,
  hostel_available BOOLEAN DEFAULT false,
  safety_score DECIMAL(3,2) DEFAULT 0.0,
  cultural_diversity_score DECIMAL(3,2) DEFAULT 0.0,
  infrastructure_score DECIMAL(3,2) DEFAULT 0.0,
  placement_score DECIMAL(3,2) DEFAULT 0.0,
  scholarship_available BOOLEAN DEFAULT false,
  medical_facilities_nearby BOOLEAN DEFAULT false,
  climate_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Historical cutoffs table for AI training
CREATE TABLE public.historical_cutoffs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
  exam_name exam_type NOT NULL,
  exam_year INTEGER NOT NULL,
  category category_type NOT NULL,
  opening_rank INTEGER,
  closing_rank INTEGER,
  opening_marks INTEGER,
  closing_marks INTEGER,
  state_quota BOOLEAN DEFAULT false,
  round_number INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI recommendations table
CREATE TABLE public.ai_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID REFERENCES public.student_assessments(id) ON DELETE CASCADE,
  college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
  recommendation_rank INTEGER NOT NULL,
  admission_probability DECIMAL(5,2) NOT NULL,
  safety_rating DECIMAL(3,2) NOT NULL,
  cultural_fit_score DECIMAL(3,2) NOT NULL,
  financial_feasibility DECIMAL(3,2) NOT NULL,
  ai_reasoning TEXT NOT NULL,
  predicted_cutoff INTEGER,
  scholarship_eligibility TEXT[],
  total_cost_estimation INTEGER,
  risk_factors TEXT[],
  benefits TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.student_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historical_cutoffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS policies for student assessments (users can only access their own data)
CREATE POLICY "Users can view their own assessments" 
  ON public.student_assessments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessments" 
  ON public.student_assessments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments" 
  ON public.student_assessments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS policies for colleges (public read access)
CREATE POLICY "Anyone can view colleges" 
  ON public.colleges 
  FOR SELECT 
  TO public 
  USING (true);

-- RLS policies for historical cutoffs (public read access)
CREATE POLICY "Anyone can view historical cutoffs" 
  ON public.historical_cutoffs 
  FOR SELECT 
  TO public 
  USING (true);

-- RLS policies for AI recommendations (users can only see their own recommendations)
CREATE POLICY "Users can view their own recommendations" 
  ON public.ai_recommendations 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.student_assessments 
      WHERE id = assessment_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create recommendations for their assessments" 
  ON public.ai_recommendations 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.student_assessments 
      WHERE id = assessment_id AND user_id = auth.uid()
    )
  );

-- Add indexes for better performance
CREATE INDEX idx_student_assessments_user_id ON public.student_assessments(user_id);
CREATE INDEX idx_colleges_exam_type ON public.colleges USING GIN(exam_accepted);
CREATE INDEX idx_historical_cutoffs_college_exam ON public.historical_cutoffs(college_id, exam_name, exam_year);
CREATE INDEX idx_ai_recommendations_assessment ON public.ai_recommendations(assessment_id);

-- Insert some sample college data with proper enum casting
INSERT INTO public.colleges (name, location, state, type, exam_accepted, courses, annual_fees_min, annual_fees_max, hostel_available, safety_score, cultural_diversity_score, infrastructure_score, placement_score, scholarship_available, medical_facilities_nearby, climate_type) VALUES
('AIIMS New Delhi', 'New Delhi', 'Delhi', 'government'::college_type, ARRAY['neet-ug'::exam_type], ARRAY['MBBS', 'BDS'], 5000, 8000, true, 9.5, 9.0, 9.8, 9.7, true, true, 'temperate'),
('IIT Delhi', 'New Delhi', 'Delhi', 'government'::college_type, ARRAY['jee-advanced'::exam_type], ARRAY['B.Tech', 'B.Arch'], 200000, 250000, true, 9.0, 8.5, 9.5, 9.8, true, true, 'temperate'),
('IIT Bombay', 'Mumbai', 'Maharashtra', 'government'::college_type, ARRAY['jee-advanced'::exam_type], ARRAY['B.Tech', 'B.Arch'], 200000, 250000, true, 8.8, 9.2, 9.7, 9.9, true, true, 'tropical'),
('NIT Trichy', 'Tiruchirappalli', 'Tamil Nadu', 'government'::college_type, ARRAY['jee-main'::exam_type], ARRAY['B.Tech'], 150000, 180000, true, 8.5, 8.0, 8.8, 8.9, true, true, 'tropical'),
('JIPMER Puducherry', 'Puducherry', 'Puducherry', 'government'::college_type, ARRAY['neet-ug'::exam_type], ARRAY['MBBS'], 3000, 5000, true, 8.7, 8.3, 8.9, 8.8, true, true, 'tropical');
