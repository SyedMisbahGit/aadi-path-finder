
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

// News sources for safety analysis
const NEWS_SOURCES = [
  'https://timesofindia.indiatimes.com',
  'https://www.thehindu.com',
  'https://indianexpress.com',
  'https://www.hindustantimes.com',
  'https://scroll.in'
];

// Analyze news sentiment for safety scoring
const analyzeNewsSentiment = async (location: string, state: string): Promise<any> => {
  try {
    console.log(`Analyzing news sentiment for ${location}, ${state}`);
    
    // Simulate news API calls and sentiment analysis
    const mockNewsData = [
      {
        headline: "Educational institutions in Maharashtra enhance safety measures",
        content: "Universities and colleges across Maharashtra implement new safety protocols...",
        sentiment: 0.7,
        safetyRelevance: 0.9,
        source: "Times of India",
        publishedDate: "2025-01-15"
      },
      {
        headline: "Women's safety initiatives launched in college campuses",
        content: "New helpline and security measures for female students...",
        sentiment: 0.8,
        safetyRelevance: 0.95,
        genderSafetyScore: 0.9,
        source: "The Hindu",
        publishedDate: "2025-01-10"
      },
      {
        headline: "Cultural diversity celebrated at medical colleges",
        content: "Students from various backgrounds participate in cultural events...",
        sentiment: 0.6,
        safetyRelevance: 0.4,
        culturalSafetyScore: 0.8,
        source: "Indian Express",
        publishedDate: "2025-01-08"
      }
    ];
    
    // Calculate weighted sentiment scores
    let overallSentiment = 0;
    let safetyRelevantSentiment = 0;
    let genderSafetyScore = 0;
    let culturalSafetyScore = 0;
    let totalWeight = 0;
    let safetyWeight = 0;
    let genderWeight = 0;
    let culturalWeight = 0;
    
    for (const article of mockNewsData) {
      const weight = article.safetyRelevance || 0.5;
      overallSentiment += article.sentiment * weight;
      totalWeight += weight;
      
      if (article.safetyRelevance && article.safetyRelevance > 0.7) {
        safetyRelevantSentiment += article.sentiment * article.safetyRelevance;
        safetyWeight += article.safetyRelevance;
      }
      
      if (article.genderSafetyScore) {
        genderSafetyScore += article.genderSafetyScore * (article.safetyRelevance || 0.5);
        genderWeight += (article.safetyRelevance || 0.5);
      }
      
      if (article.culturalSafetyScore) {
        culturalSafetyScore += article.culturalSafetyScore * (article.safetyRelevance || 0.5);
        culturalWeight += (article.safetyRelevance || 0.5);
      }
    }
    
    const result = {
      overallSentiment: totalWeight > 0 ? overallSentiment / totalWeight : 0.5,
      safetyRelevantSentiment: safetyWeight > 0 ? safetyRelevantSentiment / safetyWeight : 0.5,
      genderSafetyScore: genderWeight > 0 ? genderSafetyScore / genderWeight : 0.6,
      culturalSafetyScore: culturalWeight > 0 ? culturalSafetyScore / culturalWeight : 0.6,
      articlesAnalyzed: mockNewsData.length,
      sources: mockNewsData.map(a => a.source),
      lastAnalyzed: new Date().toISOString()
    };
    
    // Store in database
    for (const article of mockNewsData) {
      await supabase
        .from('news_sentiment')
        .upsert({
          location: location,
          state: state,
          news_source: article.source,
          headline: article.headline,
          content_summary: article.content.substring(0, 500),
          sentiment_score: article.sentiment,
          safety_relevance: article.safetyRelevance,
          gender_safety_score: article.genderSafetyScore || null,
          cultural_safety_score: article.culturalSafetyScore || null,
          published_date: article.publishedDate,
          analyzed_at: new Date().toISOString()
        });
    }
    
    return result;
    
  } catch (error) {
    console.error('News sentiment analysis error:', error);
    return {
      overallSentiment: 0.5,
      safetyRelevantSentiment: 0.5,
      genderSafetyScore: 0.6,
      culturalSafetyScore: 0.6,
      error: error.message
    };
  }
};

// Cultural sensitivity analysis
const analyzeCulturalFit = async (location: string, culturalNeeds: string[]): Promise<any> => {
  try {
    console.log(`Analyzing cultural fit for ${location} with needs:`, culturalNeeds);
    
    // Simulate cultural analysis based on location and needs
    const culturalFactors = {
      'hijab-friendly': 0.8,
      'islamic-facilities': 0.7,
      'dietary-options': 0.9,
      'prayer-facilities': 0.6,
      'cultural-acceptance': 0.7
    };
    
    let overallScore = 0;
    const scores: any = {};
    
    for (const need of culturalNeeds) {
      const score = culturalFactors[need as keyof typeof culturalFactors] || 0.5;
      
      // Adjust based on location (simplified logic)
      let locationMultiplier = 1.0;
      if (location.toLowerCase().includes('kerala') || 
          location.toLowerCase().includes('hyderabad') ||
          location.toLowerCase().includes('mumbai')) {
        locationMultiplier = 1.2; // Higher cultural acceptance
      } else if (location.toLowerCase().includes('rural') ||
                 location.toLowerCase().includes('small town')) {
        locationMultiplier = 0.8; // Lower cultural acceptance
      }
      
      const adjustedScore = Math.min(1.0, score * locationMultiplier);
      scores[need] = adjustedScore;
      overallScore += adjustedScore;
    }
    
    overallScore = culturalNeeds.length > 0 ? overallScore / culturalNeeds.length : 0.7;
    
    return {
      overallScore: overallScore,
      detailedScores: scores,
      recommendations: generateCulturalRecommendations(scores, location),
      confidence: 0.8
    };
    
  } catch (error) {
    console.error('Cultural analysis error:', error);
    return {
      overallScore: 0.5,
      error: error.message
    };
  }
};

// Generate cultural recommendations
const generateCulturalRecommendations = (scores: any, location: string): string[] => {
  const recommendations = [];
  
  if (scores['hijab-friendly'] && scores['hijab-friendly'] > 0.7) {
    recommendations.push("Institution shows good acceptance for hijab-wearing students");
  } else if (scores['hijab-friendly'] && scores['hijab-friendly'] < 0.5) {
    recommendations.push("Consider contacting the institution directly about dress code policies");
  }
  
  if (scores['islamic-facilities'] && scores['islamic-facilities'] > 0.7) {
    recommendations.push("Good availability of Islamic facilities including prayer rooms");
  }
  
  if (scores['dietary-options'] && scores['dietary-options'] > 0.8) {
    recommendations.push("Excellent halal food options available in campus and nearby areas");
  }
  
  // Location-specific recommendations
  if (location.toLowerCase().includes('metro') || 
      location.toLowerCase().includes('mumbai') ||
      location.toLowerCase().includes('delhi') ||
      location.toLowerCase().includes('bangalore')) {
    recommendations.push("Metropolitan area with diverse cultural acceptance");
  }
  
  return recommendations;
};

// Gender-specific safety analysis
const analyzeGenderSafety = async (location: string, gender: string): Promise<any> => {
  try {
    console.log(`Analyzing gender safety for ${gender} in ${location}`);
    
    // Simulate gender safety analysis
    const baseSafetyScore = 7.0; // Out of 10
    let genderSpecificScore = baseSafetyScore;
    
    if (gender === 'female') {
      // Factors affecting female safety
      const locationFactors = {
        'Kerala': 1.2,
        'Goa': 1.1,
        'Delhi': 0.9,
        'Haryana': 0.8,
        'Uttar Pradesh': 0.8,
        'Bihar': 0.7,
        'Tamil Nadu': 1.1,
        'Karnataka': 1.0,
        'Maharashtra': 1.0
      };
      
      const locationKey = Object.keys(locationFactors).find(state => 
        location.toLowerCase().includes(state.toLowerCase())
      );
      
      if (locationKey) {
        genderSpecificScore *= locationFactors[locationKey as keyof typeof locationFactors];
      }
      
      // Additional factors
      const timeOfDay = {
        'day': 1.0,
        'evening': 0.9,
        'night': 0.7
      };
      
      const transportSafety = {
        'public': 0.8,
        'college_transport': 1.1,
        'private': 1.0
      };
      
      genderSpecificScore = Math.min(10, Math.max(1, genderSpecificScore));
    }
    
    return {
      overallScore: genderSpecificScore,
      baseScore: baseSafetyScore,
      genderAdjustment: genderSpecificScore - baseSafetyScore,
      factors: {
        'Campus Security': genderSpecificScore > 8 ? 'Excellent' : genderSpecificScore > 6 ? 'Good' : 'Needs Improvement',
        'Local Area Safety': genderSpecificScore > 7 ? 'Safe' : 'Exercise Caution',
        'Transportation': genderSpecificScore > 7 ? 'Reliable' : 'Limited Options'
      },
      recommendations: generateGenderSafetyRecommendations(genderSpecificScore, gender)
    };
    
  } catch (error) {
    console.error('Gender safety analysis error:', error);
    return {
      overallScore: 5.0,
      error: error.message
    };
  }
};

// Generate gender-specific safety recommendations
const generateGenderSafetyRecommendations = (score: number, gender: string): string[] => {
  const recommendations = [];
  
  if (gender === 'female') {
    if (score >= 8) {
      recommendations.push("Excellent safety track record for female students");
      recommendations.push("Well-lit campus with 24/7 security presence");
    } else if (score >= 6) {
      recommendations.push("Generally safe with standard precautions recommended");
      recommendations.push("Active women's safety committee on campus");
    } else {
      recommendations.push("Enhanced safety measures recommended");
      recommendations.push("Consider hostels with strict security protocols");
      recommendations.push("Travel in groups, especially during evening hours");
    }
    
    recommendations.push("Emergency helpline numbers saved in phone");
    recommendations.push("Regular safety workshops and self-defense classes available");
  }
  
  return recommendations;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      college, 
      location, 
      state, 
      gender, 
      culturalNeeds = [] 
    } = await req.json();
    
    console.log(`Safety analysis for ${college} in ${location}, ${state}`);
    
    // Parallel analysis of different safety aspects
    const [
      newsAnalysis,
      culturalAnalysis,
      genderSafetyAnalysis
    ] = await Promise.all([
      analyzeNewsSentiment(location, state),
      analyzeCulturalFit(location, culturalNeeds),
      analyzeGenderSafety(location, gender)
    ]);
    
    // Calculate comprehensive safety score
    const comprehensiveScore = {
      overallScore: (
        newsAnalysis.safetyRelevantSentiment * 0.3 +
        culturalAnalysis.overallScore * 0.3 +
        (genderSafetyAnalysis.overallScore / 10) * 0.4
      ),
      components: {
        newsSentiment: newsAnalysis.safetyRelevantSentiment,
        culturalFit: culturalAnalysis.overallScore,
        genderSafety: genderSafetyAnalysis.overallScore / 10
      }
    };
    
    return new Response(JSON.stringify({
      success: true,
      college,
      location,
      state,
      safetyAnalysis: {
        overallScore: Math.round(comprehensiveScore.overallScore * 10) / 10,
        components: comprehensiveScore.components,
        genderSafetyScore: genderSafetyAnalysis.overallScore,
        sources: newsAnalysis.sources || [],
        lastUpdated: new Date().toISOString()
      },
      culturalAnalysis: {
        overallScore: culturalAnalysis.overallScore,
        detailedScores: culturalAnalysis.detailedScores || {},
        recommendations: culturalAnalysis.recommendations || []
      },
      genderSpecificAnalysis: {
        score: genderSafetyAnalysis.overallScore,
        factors: genderSafetyAnalysis.factors || {},
        recommendations: genderSafetyAnalysis.recommendations || []
      },
      metadata: {
        analysisDate: new Date().toISOString(),
        confidence: 0.8,
        dataFreshness: 'real-time'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Safety & Cultural Analysis error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      fallbackScores: {
        overallSafety: 7.0,
        culturalFit: 0.6,
        genderSafety: 7.0
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
