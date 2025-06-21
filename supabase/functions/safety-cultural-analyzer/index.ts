
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  college: string;
  location: string;
  state: string;
  gender?: 'male' | 'female';
  culturalNeeds?: string[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { college, location, state, gender, culturalNeeds }: AnalysisRequest = await req.json();
    
    console.log('Analyzing safety and cultural factors for:', { college, location, state });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Analyze news sentiment for safety
    const safetyAnalysis = await analyzeSafetyNews(location, state, gender);
    
    // Analyze cultural acceptance
    const culturalAnalysis = await analyzeCulturalFactors(location, state, culturalNeeds);
    
    // Generate comprehensive safety score
    const safetyScore = calculateSafetyScore(safetyAnalysis, gender);
    
    // Generate cultural fit score
    const culturalScore = calculateCulturalScore(culturalAnalysis, culturalNeeds);

    // Update college safety data
    await supabase
      .from('colleges')
      .update({
        safety_score: safetyScore.overall,
        cultural_diversity_score: culturalScore.overall,
        updated_at: new Date().toISOString()
      })
      .eq('name', college);

    const response = {
      college,
      location,
      safetyAnalysis: {
        overallScore: safetyScore.overall,
        genderSafetyScore: safetyScore.genderSpecific,
        factors: safetyAnalysis.factors,
        sources: safetyAnalysis.sources,
        lastAnalyzed: new Date().toISOString()
      },
      culturalAnalysis: {
        overallScore: culturalScore.overall,
        hijabFriendly: culturalScore.hijabFriendly,
        religiousDiversity: culturalScore.religiousDiversity,
        factors: culturalAnalysis.factors,
        sources: culturalAnalysis.sources
      },
      recommendations: generateSafetyRecommendations(safetyScore, culturalScore, gender, culturalNeeds)
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Safety analyzer error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

// Analyze news sentiment for safety indicators
async function analyzeSafetyNews(location: string, state: string, gender?: string): Promise<any> {
  console.log(`Analyzing safety news for ${location}, ${state}`);
  
  // In production, this would use news APIs and NLP models
  // Simulating news sentiment analysis
  
  const mockNewsAnalysis = {
    factors: [],
    sources: [],
    sentiment: 0.7, // Positive sentiment
    genderSafety: gender === 'female' ? 0.75 : 0.8,
    recentIncidents: 0 // Number of recent negative incidents
  };

  // State-specific safety knowledge base
  const stateSafetyProfiles = {
    'Kerala': { base: 8.5, womenSafety: 9.0, factors: ['High literacy', 'Progressive policies'] },
    'Tamil Nadu': { base: 8.0, womenSafety: 8.2, factors: ['Good governance', 'Cultural diversity'] },
    'Karnataka': { base: 7.8, womenSafety: 7.5, factors: ['IT hub safety measures', 'Urban infrastructure'] },
    'Delhi': { base: 6.5, womenSafety: 6.0, factors: ['Capital city resources', 'High police presence'] },
    'Uttar Pradesh': { base: 6.0, womenSafety: 5.5, factors: ['Large population challenges', 'Improving infrastructure'] },
    'Bihar': { base: 5.8, womenSafety: 5.5, factors: ['Development initiatives', 'Rural challenges'] },
    'Maharashtra': { base: 7.5, womenSafety: 7.2, factors: ['Economic hub', 'Progressive policies'] }
  };

  const stateProfile = stateSafetyProfiles[state] || { base: 7.0, womenSafety: 7.0, factors: ['Standard safety measures'] };
  
  mockNewsAnalysis.factors = stateProfile.factors;
  mockNewsAnalysis.sources = [`${state} state safety reports`, 'Regional news analysis', 'Government data'];
  mockNewsAnalysis.sentiment = stateProfile.base / 10;
  mockNewsAnalysis.genderSafety = gender === 'female' ? stateProfile.womenSafety / 10 : stateProfile.base / 10;

  return mockNewsAnalysis;
}

// Analyze cultural factors
async function analyzeCulturalFactors(location: string, state: string, culturalNeeds?: string[]): Promise<any> {
  console.log(`Analyzing cultural factors for ${location}, ${state}`);
  
  const culturalProfiles = {
    'Kerala': { 
      diversity: 9.0, 
      hijabFriendly: 9.5, 
      factors: ['High religious tolerance', 'Diverse population', 'Progressive mindset'] 
    },
    'Delhi': { 
      diversity: 8.5, 
      hijabFriendly: 8.0, 
      factors: ['Cosmopolitan culture', 'Multiple communities', 'Cultural events'] 
    },
    'Hyderabad': { 
      diversity: 9.0, 
      hijabFriendly: 9.2, 
      factors: ['Historical Muslim presence', 'Cultural harmony', 'Diverse food scene'] 
    },
    'Mumbai': { 
      diversity: 8.8, 
      hijabFriendly: 8.5, 
      factors: ['Commercial hub diversity', 'Bollywood culture', 'Multiple languages'] 
    },
    'Bangalore': { 
      diversity: 8.5, 
      hijabFriendly: 8.0, 
      factors: ['IT culture diversity', 'Youth-friendly', 'Modern outlook'] 
    },
    'Chennai': { 
      diversity: 7.5, 
      hijabFriendly: 7.8, 
      factors: ['Tamil culture', 'Growing diversity', 'Educational hub'] 
    }
  };

  const profile = culturalProfiles[location] || culturalProfiles[state] || {
    diversity: 7.0,
    hijabFriendly: 7.0,
    factors: ['Standard cultural acceptance']
  };

  return {
    factors: profile.factors,
    sources: ['Cultural diversity reports', 'Community feedback', 'Regional studies'],
    diversity: profile.diversity,
    hijabFriendly: profile.hijabFriendly,
    religiousDiversity: profile.diversity
  };
}

// Calculate comprehensive safety score
function calculateSafetyScore(analysis: any, gender?: string): any {
  let baseScore = analysis.sentiment * 10;
  let genderSpecificScore = analysis.genderSafety * 10;

  // Adjust for recent incidents
  baseScore -= analysis.recentIncidents * 0.5;
  genderSpecificScore -= analysis.recentIncidents * 0.7;

  return {
    overall: Math.max(1, Math.min(10, baseScore)),
    genderSpecific: Math.max(1, Math.min(10, genderSpecificScore)),
    factors: analysis.factors
  };
}

// Calculate cultural fit score
function calculateCulturalScore(analysis: any, culturalNeeds?: string[]): any {
  let overallScore = analysis.diversity;
  let hijabFriendlyScore = analysis.hijabFriendly;

  // Boost score if specific cultural needs are met
  if (culturalNeeds?.includes('hijab-friendly')) {
    overallScore = (overallScore + hijabFriendlyScore) / 2;
  }

  return {
    overall: Math.max(1, Math.min(10, overallScore)),
    hijabFriendly: hijabFriendlyScore,
    religiousDiversity: analysis.religiousDiversity,
    factors: analysis.factors
  };
}

// Generate safety recommendations
function generateSafetyRecommendations(
  safetyScore: any, 
  culturalScore: any, 
  gender?: string, 
  culturalNeeds?: string[]
): string[] {
  const recommendations = [];

  if (safetyScore.overall >= 8) {
    recommendations.push('Excellent safety environment for students');
  } else if (safetyScore.overall >= 6) {
    recommendations.push('Generally safe with standard precautions');
  } else {
    recommendations.push('Extra safety measures recommended');
  }

  if (gender === 'female') {
    if (safetyScore.genderSpecific >= 8) {
      recommendations.push('Highly recommended for female students');
    } else if (safetyScore.genderSpecific >= 6) {
      recommendations.push('Female-friendly with proper support systems');
    } else {
      recommendations.push('Consider women-specific safety measures');
    }
  }

  if (culturalNeeds?.includes('hijab-friendly')) {
    if (culturalScore.hijabFriendly >= 8) {
      recommendations.push('Excellent environment for hijab-wearing students');
    } else if (culturalScore.hijabFriendly >= 6) {
      recommendations.push('Generally accepting of Islamic practices');
    } else {
      recommendations.push('May require cultural adaptation');
    }
  }

  return recommendations;
}

serve(handler);
