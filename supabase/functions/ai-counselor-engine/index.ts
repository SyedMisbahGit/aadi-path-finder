
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CounselingRequest {
  message: string;
  studentProfile?: any;
  language?: 'en' | 'hi' | 'ur';
  examType?: 'NEET' | 'JEE-MAIN';
}

interface AIResponse {
  response: string;
  extractedData?: any;
  recommendations?: any[];
  reasoning?: string;
  confidence: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, studentProfile, language = 'en', examType }: CounselingRequest = await req.json();
    
    console.log('Processing AI counseling request:', { message, language, examType });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Step 1: Extract student data from natural language input
    const extractedData = await extractStudentInfo(message, language);
    
    // Step 2: Normalize and validate scores
    const normalizedProfile = await normalizeStudentProfile(extractedData, examType);
    
    // Step 3: Get ML predictions for college recommendations
    const recommendations = await getMLRecommendations(normalizedProfile, supabase);
    
    // Step 4: Apply safety and cultural scoring
    const scoredRecommendations = await applySafetyScoring(recommendations, normalizedProfile);
    
    // Step 5: Generate AI reasoning and response
    const aiResponse = await generateAIResponse(
      message, 
      normalizedProfile, 
      scoredRecommendations, 
      language
    );

    return new Response(JSON.stringify(aiResponse), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('AI Counselor Engine Error:', error);
    return new Response(
      JSON.stringify({ error: error.message, response: getErrorResponse(error.message) }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

// Advanced NLP extraction function
async function extractStudentInfo(message: string, language: string): Promise<any> {
  const patterns = {
    // Multi-language score patterns
    neetScore: {
      en: /(\d{3,4})\s*(?:marks?|score|points?)/i,
      hi: /(\d{3,4})\s*(?:अंक|मार्क्स|स्कोर)/i,
      ur: /(\d{3,4})\s*(?:نمبر|مارکس|سکور)/i
    },
    percentile: {
      en: /(\d{1,3}(?:\.\d+)?)\s*(?:percentile|%)/i,
      hi: /(\d{1,3}(?:\.\d+)?)\s*(?:प्रतिशत|पर्सेंटाइल)/i,
      ur: /(\d{1,3}(?:\.\d+)?)\s*(?:فیصد|پرسنٹائل)/i
    },
    rank: {
      en: /(?:rank|air)\s*(\d{1,6})/i,
      hi: /(?:रैंक|एआईआर)\s*(\d{1,6})/i,
      ur: /(?:رینک|ایئر)\s*(\d{1,6})/i
    },
    category: {
      en: /(general|gen|obc|sc|st|ews|pwd)/i,
      hi: /(सामान्य|जनरल|ओबीसी|एससी|एसटी|ईडब्ल्यूएस)/i,
      ur: /(جنرل|اوبیسی|ایس سی|ایس ٹی|ای ڈبلیو ایس)/i
    },
    gender: {
      en: /(male|female|girl|boy|daughter|son)/i,
      hi: /(पुरुष|महिला|लड़का|लड़की|बेटा|बेटी)/i,
      ur: /(مرد|عورت|لڑکا|لڑکی|بیٹا|بیٹی)/i
    },
    hijab: {
      en: /(hijab|muslim|islamic|cultural|religious)/i,
      hi: /(हिजाब|मुस्लिम|इस्लामिक|धार्मिक)/i,
      ur: /(حجاب|مسلم|اسلامی|مذہبی)/i
    },
    approximate: {
      en: /(around|about|roughly|approximately|don't know exact|not sure)/i,
      hi: /(लगभग|करीब|पता नहीं|निश्चित नहीं)/i,
      ur: /(تقریباً|لگ بھگ|یقین نہیں|معلوم نہیں)/i
    }
  };

  const extracted: any = {
    confidence: 0.8,
    approximate: false,
    language: language
  };

  // Extract data based on language
  const langPatterns = Object.keys(patterns).reduce((acc, key) => {
    acc[key] = patterns[key][language] || patterns[key]['en'];
    return acc;
  }, {} as any);

  // Score extraction
  const scoreMatch = message.match(langPatterns.neetScore);
  const percentileMatch = message.match(langPatterns.percentile);
  const rankMatch = message.match(langPatterns.rank);

  if (scoreMatch) {
    extracted.scoreType = 'marks';
    extracted.scoreValue = parseInt(scoreMatch[1]);
  } else if (percentileMatch) {
    extracted.scoreType = 'percentile';
    extracted.scoreValue = parseFloat(percentileMatch[1]);
  } else if (rankMatch) {
    extracted.scoreType = 'rank';
    extracted.scoreValue = parseInt(rankMatch[1]);
  }

  // Category extraction
  const categoryMatch = message.match(langPatterns.category);
  if (categoryMatch) {
    const categoryMap = {
      'सामान्य': 'general', 'जनरल': 'general', 'جنرل': 'general',
      'ओबीसी': 'obc', 'اوبیسی': 'obc',
      'एससी': 'sc', 'ایس سی': 'sc',
      'एसटी': 'st', 'ایس ٹی': 'st'
    };
    extracted.category = categoryMap[categoryMatch[1].toLowerCase()] || categoryMatch[1].toLowerCase();
  }

  // Gender extraction
  const genderMatch = message.match(langPatterns.gender);
  if (genderMatch) {
    const genderMap = {
      'महिला': 'female', 'लड़की': 'female', 'बेटी': 'female', 'عورت': 'female', 'لڑکی': 'female', 'بیٹی': 'female',
      'पुरुष': 'male', 'लड़का': 'male', 'बेटा': 'male', 'مرد': 'male', 'لڑکا': 'male', 'بیٹا': 'male'
    };
    const g = genderMatch[1].toLowerCase();
    extracted.gender = genderMap[g] || (g.includes('girl') || g.includes('daughter') ? 'female' : 'male');
  }

  // Cultural needs extraction
  if (langPatterns.hijab.test(message)) {
    extracted.culturalNeeds = ['hijab-friendly', 'islamic-facilities'];
  }

  // Approximate flag
  if (langPatterns.approximate.test(message)) {
    extracted.approximate = true;
    extracted.confidence = 0.5;
  }

  return extracted;
}

// ML-powered score normalization
async function normalizeStudentProfile(extractedData: any, examType: string): Promise<any> {
  const currentYear = 2025;
  
  // Apply year-to-year difficulty normalization
  const difficultyAdjustment = getDifficultyAdjustment(examType, currentYear);
  
  let normalizedScore = extractedData.scoreValue;
  let estimatedRank = null;
  
  if (extractedData.scoreType === 'percentile' && examType === 'JEE-MAIN') {
    // Convert JEE Main percentile to approximate rank
    estimatedRank = Math.round((100 - extractedData.scoreValue) * 12000); // Approximate formula
    normalizedScore = extractedData.scoreValue;
  } else if (extractedData.scoreType === 'marks' && examType === 'NEET') {
    // Apply NEET difficulty adjustment
    normalizedScore = extractedData.scoreValue * difficultyAdjustment;
    // Estimate rank from NEET score (approximate)
    estimatedRank = Math.max(1, Math.round((720 - normalizedScore) * 2500));
  }

  return {
    ...extractedData,
    normalizedScore,
    estimatedRank,
    examType,
    year: currentYear,
    difficultyAdjustment
  };
}

// Get ML recommendations
async function getMLRecommendations(profile: any, supabase: any): Promise<any[]> {
  console.log('Fetching ML recommendations for profile:', profile);

  // Query colleges based on profile
  const { data: colleges, error } = await supabase
    .from('colleges')
    .select(`
      *,
      historical_cutoffs!inner(*)
    `)
    .eq('historical_cutoffs.exam_name', profile.examType)
    .eq('historical_cutoffs.category', profile.category || 'general')
    .lte('historical_cutoffs.closing_marks', profile.normalizedScore + 50) // Some buffer
    .order('historical_cutoffs.closing_marks', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Database query error:', error);
    return [];
  }

  // Apply ML scoring for admission probability
  const scoredColleges = colleges?.map(college => {
    const cutoff = college.historical_cutoffs[0];
    const scoreDiff = profile.normalizedScore - cutoff.closing_marks;
    
    // Simple probability model (can be replaced with trained ML model)
    let admissionProbability = 0.5;
    if (scoreDiff > 50) admissionProbability = 0.9;
    else if (scoreDiff > 20) admissionProbability = 0.7;
    else if (scoreDiff > 0) admissionProbability = 0.6;
    else if (scoreDiff > -20) admissionProbability = 0.4;
    else admissionProbability = 0.2;

    return {
      ...college,
      admissionProbability,
      predictedCutoff: cutoff.closing_marks,
      scoreDifference: scoreDiff
    };
  }) || [];

  return scoredColleges.sort((a, b) => b.admissionProbability - a.admissionProbability);
}

// Apply safety and cultural scoring
async function applySafetyScoring(recommendations: any[], profile: any): Promise<any[]> {
  return recommendations.map(college => {
    let safetyScore = college.safety_score || 7.5;
    let culturalFitScore = college.cultural_diversity_score || 7.0;

    // Gender-based safety adjustments
    if (profile.gender === 'female') {
      // Boost safety score for known women-friendly institutions
      if (college.name.toLowerCase().includes('women') || 
          college.location.toLowerCase().includes('delhi') ||
          college.location.toLowerCase().includes('bangalore')) {
        safetyScore += 1.0;
      }
    }

    // Cultural fit adjustments
    if (profile.culturalNeeds?.includes('hijab-friendly')) {
      // Known Muslim-friendly regions get boost
      if (college.state.toLowerCase().includes('kerala') ||
          college.state.toLowerCase().includes('hyderabad') ||
          college.state.toLowerCase().includes('delhi')) {
        culturalFitScore += 1.5;
      }
    }

    return {
      ...college,
      safetyScore: Math.min(10, safetyScore),
      culturalFitScore: Math.min(10, culturalFitScore),
      overallScore: (college.admissionProbability * 0.4 + safetyScore/10 * 0.3 + culturalFitScore/10 * 0.3)
    };
  });
}

// Generate AI response with transparent reasoning
async function generateAIResponse(
  originalMessage: string, 
  profile: any, 
  recommendations: any[], 
  language: string
): Promise<AIResponse> {
  
  const responses = {
    en: {
      greeting: "Based on your information, here's my analysis:",
      noScore: "I need more specific information about your exam performance to provide accurate recommendations.",
      reasoning: "My AI reasoning process:",
      recommendations: "Here are your personalized college recommendations:"
    },
    hi: {
      greeting: "आपकी जानकारी के आधार पर, यहाँ मेरा विश्लेषण है:",
      noScore: "सटीक सुझाव देने के लिए मुझे आपके परीक्षा प्रदर्शन की अधिक जानकारी चाहिए।",
      reasoning: "मेरी AI तर्क प्रक्रिया:",
      recommendations: "यहाँ आपके व्यक्तिगत कॉलेज सुझाव हैं:"
    },
    ur: {
      greeting: "آپ کی معلومات کی بنیاد پر، یہاں میرا تجزیہ ہے:",
      noScore: "درست تجاویز دینے کے لیے مجھے آپ کی امتحانی کارکردگی کی مزید تفصیلات درکار ہیں۔",
      reasoning: "میری AI استدلال کی عمل:",
      recommendations: "یہاں آپ کے ذاتی کالج کی تجاویز ہیں:"
    }
  };

  const texts = responses[language];
  let response = `${texts.greeting}\n\n`;

  if (!profile.scoreValue) {
    return {
      response: texts.noScore,
      confidence: 0.3
    };
  }

  // Add extracted information summary
  response += `✨ **AI Analysis Summary:**\n`;
  if (profile.scoreType === 'marks') {
    response += `• Score: ${profile.scoreValue}/${profile.examType === 'NEET' ? '720' : '300'}\n`;
  } else if (profile.scoreType === 'percentile') {
    response += `• Percentile: ${profile.scoreValue}%\n`;
  }
  
  if (profile.category) response += `• Category: ${profile.category.toUpperCase()}\n`;
  if (profile.gender) response += `• Gender considerations: ${profile.gender === 'female' ? 'Female safety prioritized' : 'Applied'}\n`;
  if (profile.culturalNeeds) response += `• Cultural needs: ${profile.culturalNeeds.join(', ')}\n`;
  if (profile.approximate) response += `• Note: Approximate values used (lower confidence)\n`;

  response += `\n🎯 **${texts.recommendations}**\n\n`;

  // Add top recommendations with reasoning
  const topRecs = recommendations.slice(0, 5);
  topRecs.forEach((college, index) => {
    response += `**${index + 1}. ${college.name}**, ${college.location}\n`;
    response += `   • Admission Probability: ${(college.admissionProbability * 100).toFixed(0)}%\n`;
    response += `   • Safety Score: ${college.safetyScore.toFixed(1)}/10\n`;
    response += `   • Cultural Fit: ${college.culturalFitScore.toFixed(1)}/10\n`;
    response += `   • Fees: ₹${college.annual_fees_min?.toLocaleString()} - ₹${college.annual_fees_max?.toLocaleString()}\n`;
    response += `   • Reasoning: ${generateReasoningText(college, profile, language)}\n\n`;
  });

  return {
    response,
    extractedData: profile,
    recommendations: topRecs,
    reasoning: `Applied ML cutoff prediction, safety scoring, and cultural fit analysis`,
    confidence: profile.confidence
  };
}

function generateReasoningText(college: any, profile: any, language: string): string {
  const reasons = [];
  
  if (college.admissionProbability > 0.7) {
    reasons.push(language === 'hi' ? 'उच्च प्रवेश संभावना' : 
                 language === 'ur' ? 'اعلیٰ داخلے کی امکانات' : 'High admission probability');
  }
  
  if (college.safetyScore > 8) {
    reasons.push(language === 'hi' ? 'उत्कृष्ट सुरक्षा रेटिंग' : 
                 language === 'ur' ? 'بہترین حفاظتی درجہ بندی' : 'Excellent safety rating');
  }
  
  if (profile.culturalNeeds && college.culturalFitScore > 8) {
    reasons.push(language === 'hi' ? 'सांस्कृतिक आवश्यकताओं के अनुकूल' : 
                 language === 'ur' ? 'ثقافتی ضروریات کے مطابق' : 'Matches cultural requirements');
  }

  return reasons.join(', ') || (language === 'hi' ? 'आपकी प्रोफाइल के आधार पर उपयुक्त' : 
                               language === 'ur' ? 'آپ کی پروفائل کے مطابق موزوں' : 'Good fit based on your profile');
}

function getDifficultyAdjustment(examType: string, year: number): number {
  // Historical difficulty analysis (would be ML-based in production)
  const adjustments = {
    'NEET': { 2024: 1.05, 2025: 0.98 },
    'JEE-MAIN': { 2024: 1.02, 2025: 1.01 }
  };
  
  return adjustments[examType]?.[year] || 1.0;
}

function getErrorResponse(error: string): string {
  return `معذرت! I encountered an issue processing your request. Please try rephrasing your question or provide more specific details about your exam performance. 

مثال: "I got 85 percentile in JEE Main, OBC category, looking for engineering colleges in Maharashtra"`;
}

serve(handler);
