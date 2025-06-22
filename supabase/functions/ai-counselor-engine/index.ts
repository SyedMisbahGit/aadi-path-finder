import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

interface StudentProfile {
  exam?: 'NEET' | 'JEE-MAIN';
  year?: number;
  scoreType?: 'percentile' | 'rank' | 'marks';
  scoreValue?: number;
  category?: 'general' | 'obc' | 'sc' | 'st' | 'ews' | 'pwd';
  gender?: 'male' | 'female' | 'other';
  state?: string;
  culturalNeeds?: string[];
  budgetRange?: string;
}

// Enhanced input validation for Al-Naseeh V2
const validateInput = (data: any, examType: string) => {
  const errors: string[] = [];
  const corrections: any = {};

  // NEET Score validation
  if (data.neetScore !== undefined) {
    const score = parseInt(data.neetScore);
    if (score > 720) {
      errors.push(`NEET maximum score is 720. Did you mean ${score - 280} (converted from percentile) or ${Math.round(score / 10)} (if you meant rank)?`);
      corrections.neetScore = score > 1000 ? Math.round(score / 100) : score - 280;
    } else if (score < 0 || isNaN(score)) {
      errors.push('Please enter a valid NEET score between 0-720');
    }
  }

  // JEE Percentile validation
  if (data.jeePercentile !== undefined) {
    const percentile = parseFloat(data.jeePercentile);
    if (percentile > 100) {
      errors.push(`JEE Main percentile cannot exceed 100%. Did you mean ${percentile / 10}% or ${percentile / 100}%?`);
      corrections.jeePercentile = percentile > 1000 ? percentile / 100 : percentile / 10;
    } else if (percentile < 0 || isNaN(percentile)) {
      errors.push('Please enter a valid percentile between 0-100');
    }
  }

  // Category validation
  if (data.category) {
    const validCategories = ['general', 'obc', 'sc', 'st', 'ews', 'pwd'];
    const normalizedCategory = data.category.toLowerCase().replace(/\s+/g, '');
    if (!validCategories.includes(normalizedCategory)) {
      errors.push('Please select a valid category (General/OBC/SC/ST/EWS/PwD)');
    } else {
      corrections.category = normalizedCategory;
    }
  }

  // State validation
  if (data.state) {
    const validStates = [
      'andhra pradesh', 'bihar', 'delhi', 'gujarat', 'karnataka', 'kerala',
      'maharashtra', 'punjab', 'rajasthan', 'tamil nadu', 'telangana',
      'uttar pradesh', 'west bengal', 'madhya pradesh', 'odisha', 'jharkhand',
      'chhattisgarh', 'uttarakhand', 'himachal pradesh', 'jammu and kashmir'
    ];
    const normalizedState = data.state.toLowerCase().trim();
    if (!validStates.includes(normalizedState)) {
      errors.push('Please select a valid state from the list');
    } else {
      corrections.state = normalizedState;
    }
  }

  return { errors, corrections, isValid: errors.length === 0 };
};

// Enhanced natural language processing
const processNaturalLanguage = (message: string, language: string) => {
  const patterns = {
    neetScore: /(\d{3,4})\s*(?:marks?|number|score)\s*(?:mile|mila|hai|in|got)?/i,
    jeePercentile: /(\d{1,3}(?:\.\d+)?)\s*(?:percentile|%)/i,
    rank: /(?:rank|air)\s*(\d{1,6})/i,
    category: /(general|gen|obc|sc|st|ews|pwd|minority|muslim)/i,
    state: /(bihar|up|uttar pradesh|mp|madhya pradesh|rajasthan|punjab|haryana|gujarat|maharashtra|karnataka|tamil nadu|kerala|telangana|andhra pradesh|west bengal|bengal|odisha|jharkhand|chhattisgarh|uttarakhand|himachal|delhi|mumbai|chennai|kolkata|bangalore|hyderabad)/i,
    gender: /(girl|boy|female|male|daughter|son|beta|beti|लड़की|لڑکی)/i,
    budget: /(low[- ]?cost|budget|free|government|govt|private|expensive|सस्ता|مفت)/i,
    hostel: /(hostel|accommodation|رہائش|छात्रावास)/i,
    hijab: /(hijab|islamic|muslim|cultural|ہجاب|حجاب)/i,
    course: /(mbbs|bds|bams|bhms|bums|veterinary|nursing|physiotherapy)/i
  };

  const extractedData: any = {};
  const reasoning: string[] = [];
  let confidence = 0.5; // Base confidence

  // Extract NEET score
  const scoreMatch = message.match(patterns.neetScore);
  if (scoreMatch) {
    extractedData.neetScore = parseInt(scoreMatch[1]);
    reasoning.push(`Extracted NEET score: ${scoreMatch[1]}`);
    confidence += 0.2;
  }

  // Extract JEE percentile
  const percentileMatch = message.match(patterns.jeePercentile);
  if (percentileMatch) {
    extractedData.jeePercentile = parseFloat(percentileMatch[1]);
    reasoning.push(`Extracted JEE percentile: ${percentileMatch[1]}%`);
    confidence += 0.2;
  }

  // Extract rank
  const rankMatch = message.match(patterns.rank);
  if (rankMatch) {
    extractedData.rank = parseInt(rankMatch[1]);
    reasoning.push(`Extracted rank: ${rankMatch[1]}`);
    confidence += 0.15;
  }

  // Extract category
  const categoryMatch = message.match(patterns.category);
  if (categoryMatch) {
    const cat = categoryMatch[1].toLowerCase();
    extractedData.category = cat === 'gen' ? 'general' : cat;
    reasoning.push(`Extracted category: ${extractedData.category.toUpperCase()}`);
    confidence += 0.15;
  }

  // Extract state
  const stateMatch = message.match(patterns.state);
  if (stateMatch) {
    extractedData.state = stateMatch[1].toLowerCase().replace(' pradesh', '-pradesh');
    reasoning.push(`Extracted state: ${stateMatch[1]}`);
    confidence += 0.1;
  }

  // Extract gender
  const genderMatch = message.match(patterns.gender);
  if (genderMatch) {
    const g = genderMatch[1].toLowerCase();
    extractedData.gender = g === 'girl' ? 'female' : g === 'boy' ? 'male' : g;
    reasoning.push(`Extracted gender: ${extractedData.gender}`);
    confidence += 0.05;
  }

  // Extract preferences
  const preferences: string[] = [];
  if (message.match(patterns.budget)) {
    preferences.push('budget-conscious');
    reasoning.push('Detected budget preference');
  }
  if (message.match(patterns.hostel)) {
    preferences.push('hostel-required');
    reasoning.push('Detected hostel requirement');
  }
  if (message.match(patterns.hijab)) {
    preferences.push('hijab-friendly');
    reasoning.push('Detected cultural preference');
  }
  if (preferences.length > 0) {
    extractedData.preferences = preferences;
    confidence += 0.1;
  }

  // Extract course preference
  const courseMatch = message.match(patterns.course);
  if (courseMatch) {
    extractedData.coursePreference = courseMatch[1].toUpperCase();
    reasoning.push(`Extracted course preference: ${extractedData.coursePreference}`);
    confidence += 0.1;
  }

  // Validate extracted data
  const validation = validateInput(extractedData, 'NEET');
  if (validation.errors.length > 0) {
    extractedData.validationErrors = validation.errors;
    extractedData.corrections = validation.corrections;
    confidence -= 0.2; // Reduce confidence due to validation errors
  }

  return {
    ...extractedData,
    reasoning,
    confidence: Math.min(confidence, 1.0),
    language
  };
};

// Enhanced prediction generation
const generatePredictions = async (profile: any) => {
  const predictions = [];
  
  // Mock predictions based on profile
  if (profile.neetScore) {
    const score = parseInt(profile.neetScore);
    
    if (score >= 600) {
      predictions.push({
        college: 'Government Medical College, Mumbai',
        location: 'Mumbai, Maharashtra',
        type: 'government',
        course: 'MBBS',
        admissionProbability: 85,
        safetyRating: 9,
        culturalFit: 8,
        annualFees: 15000,
        aiReasoning: 'Excellent score with strong chances for government colleges'
      });
    } else if (score >= 500) {
      predictions.push({
        college: 'Government Dental College, Pune',
        location: 'Pune, Maharashtra',
        type: 'government',
        course: 'BDS',
        admissionProbability: 75,
        safetyRating: 8,
        culturalFit: 7,
        annualFees: 20000,
        aiReasoning: 'Good score suitable for BDS in government colleges'
      });
    }
  }

  if (profile.jeePercentile) {
    const percentile = parseFloat(profile.jeePercentile);
    
    if (percentile >= 95) {
      predictions.push({
        college: 'NIT Warangal',
        location: 'Warangal, Telangana',
        type: 'nit',
        course: 'Computer Science Engineering',
        admissionProbability: 80,
        safetyRating: 8,
        culturalFit: 7,
        annualFees: 150000,
        aiReasoning: 'High percentile suitable for top NITs'
      });
    }
  }

  return predictions;
};

// Enhanced AI response generation
const generateAIResponse = (extractedData: any, predictions: any[], language: string): string => {
  const responses = {
    en: {
      greeting: "✨ **AI Analysis Complete**",
      confidence: "Confidence",
      understood: "I understood",
      predictions: "🎯 **Your College Predictions**",
      cultural: "🕌 **Cultural & Safety Considerations**",
      nextSteps: "💡 **Recommended Next Steps**",
      corrections: "⚠️ **Input Corrections Applied**",
      validationErrors: "❌ **Please Correct These**"
    },
    hi: {
      greeting: "✨ **एआई विश्लेषण पूर्ण**",
      confidence: "विश्वास",
      understood: "मैंने समझा",
      predictions: "🎯 **आपके कॉलेज अनुमान**",
      cultural: "🕌 **सांस्कृतिक और सुरक्षा विचार**",
      nextSteps: "💡 **अनुशंसित अगले कदम**",
      corrections: "⚠️ **इनपुट सुधार लागू**",
      validationErrors: "❌ **कृपया इन्हें सुधारें**"
    },
    ur: {
      greeting: "✨ **اے آئی تجزیہ مکمل**",
      confidence: "اعتماد",
      understood: "میں سمجھ گیا",
      predictions: "🎯 **آپ کے کالج کی پیشن گوئیاں**",
      cultural: "🕌 **ثقافتی اور حفاظتی تحفظات**",
      nextSteps: "💡 **تجویز کردہ اگلے قدم**",
      corrections: "⚠️ **انپٹ درستگیاں لاگو**",
      validationErrors: "❌ **براہ کرم انہیں درست کریں**"
    }
  };

  const r = responses[language as keyof typeof responses] || responses.en;
  
  let response = `${r.greeting} (${r.confidence}: ${(extractedData.confidence * 100).toFixed(0)}%)\n\n`;
  
  // Add validation errors if any
  if (extractedData.validationErrors?.length > 0) {
    response += `${r.validationErrors}:\n`;
    extractedData.validationErrors.forEach((error: string) => {
      response += `• ${error}\n`;
    });
    response += '\n';
  }

  // Add corrections if any
  if (extractedData.corrections && Object.keys(extractedData.corrections).length > 0) {
    response += `${r.corrections}:\n`;
    Object.entries(extractedData.corrections).forEach(([key, value]) => {
      response += `• ${key}: ${value}\n`;
    });
    response += '\n';
  }
  
  if (extractedData.reasoning?.length > 0) {
    response += `${r.understood}:\n`;
    extractedData.reasoning.forEach((reason: string) => {
      response += `• ${reason}\n`;
    });
    response += '\n';
  }

  if (predictions.length > 0) {
    response += `${r.predictions}:\n`;
    predictions.slice(0, 5).forEach((pred, index) => {
      response += `${index + 1}. **${pred.college}**\n`;
      response += `   📍 ${pred.location}\n`;
      response += `   🎯 ${pred.admissionProbability}% chance\n`;
      response += `   💰 ₹${pred.annualFees.toLocaleString()}/year\n`;
      response += `   🛡️ Safety: ${pred.safetyRating}/10\n`;
      response += `   💭 ${pred.aiReasoning}\n\n`;
    });
  }

  // Add cultural considerations
  if (extractedData.preferences?.includes('hijab-friendly')) {
    response += `${r.cultural}:\n`;
    response += `• Looking for hijab-friendly environment\n`;
    response += `• Female hostels with Islamic dietary options\n`;
    response += `• Colleges with diverse cultural acceptance\n\n`;
  }

  response += `${r.nextSteps}:\n`;
  response += `• Would you like detailed college comparisons?\n`;
  response += `• Need help with document preparation?\n`;
  response += `• Want to explore scholarship options?\n`;
  response += `• Set up counseling timeline reminders?`;

  return response;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, studentProfile, language = 'en', examType } = await req.json();
    
    console.log('Al-Naseeh V2 AI Counselor processing:', { message, studentProfile, language });

    // Process natural language input with enhanced validation
    const extractedData = processNaturalLanguage(message, language);
    
    // Merge with existing profile
    const updatedProfile = { 
      ...studentProfile, 
      ...extractedData,
      exam: extractedData.exam || examType || studentProfile?.exam,
      year: 2025,
      lastUpdated: new Date().toISOString()
    };

    // Generate predictions if we have enough data
    let predictions = [];
    if (updatedProfile.exam && (updatedProfile.neetScore || updatedProfile.jeePercentile || updatedProfile.rank)) {
      predictions = await generatePredictions(updatedProfile);
    }

    // Generate enhanced AI response
    const response = generateAIResponse(extractedData, predictions, language);

    return new Response(JSON.stringify({
      response,
      extractedData,
      updatedProfile,
      predictions: predictions.slice(0, 10), // Top 10 recommendations
      metadata: {
        processingTime: Date.now(),
        language,
        confidence: extractedData.confidence,
        dataSource: 'al-naseeh-v2-2025',
        version: '2.0',
        features: ['enhanced-validation', 'confidence-scoring', 'cultural-sensitivity', 'real-time-corrections']
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Al-Naseeh V2 AI Counselor error:', error);
    
    return new Response(JSON.stringify({
      error: 'AI processing failed',
      fallback: "I'm having trouble processing your request. Could you please rephrase with more specific details about your exam scores?",
      extractedData: { 
        confidence: 0, 
        reasoning: ['Error in processing'],
        validationErrors: ['System temporarily unavailable']
      },
      metadata: {
        error: error.message,
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
