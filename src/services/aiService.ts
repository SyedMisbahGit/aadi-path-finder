
import { supabase } from "@/integrations/supabase/client";

export interface QueryAnalysis {
  examType: 'neet' | 'jee-main' | 'jee-advanced';
  score?: number;
  percentile?: number;
  rank?: number;
  category: string;
  state?: string;
  intent: 'college-search' | 'cutoff-prediction' | 'comparison' | 'counseling-help' | 'document-help';
  preferences?: {
    budget?: string;
    hostel?: boolean;
    location?: string;
    gender?: string;
    course?: string;
    branch?: string;
  };
  confidence: number;
}

export interface CollegeRecommendation {
  id: string;
  name: string;
  location: string;
  type: 'government' | 'private' | 'deemed';
  course: string;
  branch?: string;
  fees: {
    min: number;
    max: number;
  };
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
  private async callAI(messages: any[], model: string = 'gpt-4') {
    try {
      const response = await fetch('/functions/v1/ai-query-processor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.auth.session()?.access_token || ''}`
        },
        body: JSON.stringify({ messages, model })
      });
      
      if (!response.ok) throw new Error('AI service failed');
      return await response.json();
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getFallbackResponse();
    }
  }

  async analyzeQuery(query: string, context?: any): Promise<QueryAnalysis> {
    const systemPrompt = `You are Al-Naseeh, an AI counseling assistant. Analyze this query and extract:
    1. Exam type (NEET/JEE Main/JEE Advanced)
    2. Score/percentile/rank
    3. Category (General/OBC/SC/ST/EWS)
    4. State/location preferences
    5. Intent (what they want to know)
    6. Other preferences (budget, hostel, gender, course/branch)
    
    Respond with structured JSON only.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Query: "${query}"\nContext: ${JSON.stringify(context || {})}` }
    ];

    const response = await this.callAI(messages);
    
    return response.analysis || this.getDefaultAnalysis(query);
  }

  async getCollegeRecommendations(analysis: QueryAnalysis): Promise<CollegeRecommendation[]> {
    const systemPrompt = `You are Al-Naseeh. Based on the student profile, recommend 15+ colleges with:
    - Admission probability (0-100%)
    - Safety rating (1-10)
    - Cultural fit score (1-10)
    - Realistic fee estimates
    - AI reasoning for each recommendation
    - Benefits and risk factors
    
    Always include government, semi-government, and private options.
    Consider cultural factors for Muslim families.
    Provide practical, actionable advice.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Student Profile: ${JSON.stringify(analysis)}` }
    ];

    const response = await this.callAI(messages);
    
    return response.recommendations || this.getFallbackRecommendations(analysis);
  }

  async predictCutoffs(examType: string, category: string, state?: string) {
    const systemPrompt = `Predict realistic cutoffs for ${examType} based on historical data and trends.
    Consider category-wise reservation, state quota effects, and current year patterns.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Predict cutoffs for ${examType}, ${category} category, ${state || 'All India'}` }
    ];

    const response = await this.callAI(messages);
    return response.cutoffs || this.getDefaultCutoffs(examType, category);
  }

  async compareColleges(college1: string, college2: string, criteria: string[]) {
    const systemPrompt = `Compare these colleges objectively on the given criteria.
    Provide pros/cons, recommendations, and help with decision making.
    Be honest about trade-offs.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Compare ${college1} vs ${college2} on: ${criteria.join(', ')}` }
    ];

    const response = await this.callAI(messages);
    return response.comparison || this.getDefaultComparison();
  }

  async validateDocuments(documentList: string[], examType: string, category: string, state: string) {
    const systemPrompt = `Check if all required documents are present for ${examType} counseling.
    Consider ${category} category and ${state} state-specific requirements.
    Highlight missing documents and provide guidance.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Documents: ${documentList.join(', ')}\nExam: ${examType}\nCategory: ${category}\nState: ${state}` }
    ];

    const response = await this.callAI(messages);
    return response.validation || this.getDefaultValidation();
  }

  private getFallbackResponse() {
    return {
      error: 'AI service temporarily unavailable',
      fallback: true
    };
  }

  private getDefaultAnalysis(query: string): QueryAnalysis {
    // Simple pattern matching fallback
    const examType = query.toLowerCase().includes('jee') ? 'jee-main' : 'neet';
    const scoreMatch = query.match(/(\d{3,4})/);
    const categoryMatch = query.match(/(obc|sc|st|general|ews)/i);
    
    return {
      examType: examType as 'neet' | 'jee-main',
      score: scoreMatch ? parseInt(scoreMatch[1]) : undefined,
      category: categoryMatch ? categoryMatch[1].toLowerCase() : 'general',
      intent: 'college-search',
      confidence: 0.6
    };
  }

  private getFallbackRecommendations(analysis: QueryAnalysis): CollegeRecommendation[] {
    // Return basic recommendations based on simple rules
    return [
      {
        id: '1',
        name: 'Government Medical College',
        location: 'Various States',
        type: 'government',
        course: 'MBBS',
        fees: { min: 50000, max: 150000 },
        admissionProbability: 65,
        safetyRating: 8,
        culturalFit: 7,
        hostelAvailable: true,
        hijabFriendly: true,
        cutoffPrediction: analysis.score ? analysis.score - 50 : 500,
        aiReasoning: 'Government colleges offer quality education at affordable fees',
        benefits: ['Low fees', 'Quality education', 'Good placement'],
        riskFactors: ['High competition', 'Limited seats']
      }
    ];
  }

  private getDefaultCutoffs(examType: string, category: string) {
    return {
      government: category === 'general' ? 550 : 500,
      private: category === 'general' ? 450 : 400,
      deemed: category === 'general' ? 500 : 450
    };
  }

  private getDefaultComparison() {
    return {
      summary: 'Detailed comparison temporarily unavailable',
      recommendation: 'Please try again later'
    };
  }

  private getDefaultValidation() {
    return {
      status: 'Cannot validate documents at this time',
      missing: [],
      complete: false
    };
  }
}

export const aiService = new AIService();
