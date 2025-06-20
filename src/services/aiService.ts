
import { supabase } from '@/integrations/supabase/client';

interface StudentProfile {
  examType: 'neet' | 'jee-main' | 'jee-advanced';
  score?: number;
  rank?: number;
  percentile?: number;
  category: 'general' | 'obc' | 'sc' | 'st' | 'ews';
  state: string;
  domicile: boolean;
  gender: 'male' | 'female' | 'other';
  budget: 'government' | 'private' | 'any';
  preferences: {
    hostel?: boolean;
    hijabFriendly?: boolean;
    femaleOnly?: boolean;
    location?: string[];
  };
}

interface CollegeRecommendation {
  id: string;
  name: string;
  location: string;
  type: 'government' | 'private' | 'deemed';
  course: string;
  fees: { min: number; max: number };
  admissionProbability: number;
  safetyRating: number;
  culturalFit: number;
  hostelAvailable: boolean;
  hijabFriendly: boolean;
  cutoffPrediction: number;
  aiReasoning: string;
  benefits: string[];
  riskFactors: string[];
}

class AIService {
  async analyzeQuery(query: string): Promise<any> {
    try {
      console.log('Analyzing query:', query);
      
      const { data, error } = await supabase.functions.invoke('ai-query-processor', {
        body: {
          messages: [
            {
              role: 'user',
              content: `Analyze this student query and extract relevant information: ${query}`
            }
          ]
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('AI query analysis error:', error);
      throw error;
    }
  }

  async getRecommendations(profile: StudentProfile): Promise<CollegeRecommendation[]> {
    try {
      console.log('Getting recommendations for profile:', profile);
      
      const { data, error } = await supabase.functions.invoke('ai-query-processor', {
        body: {
          messages: [
            {
              role: 'system',
              content: 'You are Al-Naseeh, an AI counselor for NEET/JEE admissions in India.'
            },
            {
              role: 'user',
              content: `Generate college recommendations for: ${JSON.stringify(profile)}`
            }
          ]
        },
      });

      if (error) throw error;
      return data.recommendations || [];
    } catch (error) {
      console.error('Recommendations error:', error);
      throw error;
    }
  }

  async compareColleges(college1: string, college2: string, criteria: string[]): Promise<any> {
    try {
      console.log('Comparing colleges:', college1, 'vs', college2);
      
      const { data, error } = await supabase.functions.invoke('ai-query-processor', {
        body: {
          messages: [
            {
              role: 'user',
              content: `Compare ${college1} and ${college2} based on: ${criteria.join(', ')}`
            }
          ]
        },
      });

      if (error) throw error;
      return data.comparison;
    } catch (error) {
      console.error('College comparison error:', error);
      throw error;
    }
  }

  async predictCutoffs(examType: string, category: string, state: string): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-query-processor', {
        body: {
          messages: [
            {
              role: 'user',
              content: `Predict cutoffs for ${examType} ${category} category in ${state}`
            }
          ]
        },
      });

      if (error) throw error;
      return data.cutoffs;
    } catch (error) {
      console.error('Cutoff prediction error:', error);
      throw error;
    }
  }

  async validateDocuments(documents: any[]): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-query-processor', {
        body: {
          messages: [
            {
              role: 'user',
              content: `Validate these documents: ${JSON.stringify(documents)}`
            }
          ]
        },
      });

      if (error) throw error;
      return data.validation;
    } catch (error) {
      console.error('Document validation error:', error);
      throw error;
    }
  }
}

export const aiService = new AIService();
