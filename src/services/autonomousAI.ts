import { supabase } from '@/integrations/supabase/client';

interface CutoffPrediction {
  college: string;
  course: string;
  predictedCutoff: number;
  confidence: number;
  factors: string[];
}

interface SafetyScore {
  college: string;
  location: string;
  overallSafety: number;
  genderSafety: number;
  culturalAcceptance: number;
  sources: string[];
}

interface LiveCounselingData {
  examType: 'NEET' | 'JEE-MAIN';
  round: number;
  seatMatrix: any[];
  cutoffs: any[];
  lastUpdated: string;
}

class AutonomousAI {
  private mlModels: Map<string, any> = new Map();
  private dataCache: Map<string, any> = new Map();
  private readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  // Autonomous Data Crawling with backend integration
  async crawlLiveCounselingData(examType: 'NEET' | 'JEE-MAIN'): Promise<LiveCounselingData> {
    try {
      console.log(`Crawling live ${examType} counseling data...`);
      
      const { data, error } = await supabase.functions.invoke('autonomous-data-crawler', {
        body: { 
          sources: ['all'],
          examType, 
          year: 2025 
        }
      });

      if (error) throw error;
      
      return {
        examType,
        round: data.currentRound || 1,
        seatMatrix: data.seatMatrix || [],
        cutoffs: data.cutoffs || [],
        lastUpdated: data.lastUpdated || new Date().toISOString()
      };
    } catch (error) {
      console.error('Live data crawling failed:', error);
      return this.getFallbackData(examType);
    }
  }

  // ML-based Cutoff Prediction with backend integration
  async predictCutoffs(
    examType: 'NEET' | 'JEE-MAIN',
    category: string,
    state: string,
    scoreValue: number,
    scoreType: 'marks' | 'percentile' | 'rank' = 'marks',
    year: number = 2025
  ): Promise<CutoffPrediction[]> {
    try {
      const cacheKey = `cutoffs-${examType}-${category}-${state}-${scoreValue}-${year}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const { data, error } = await supabase.functions.invoke('ml-prediction-engine', {
        body: { 
          examType,
          scoreType,
          scoreValue,
          category,
          state,
          year
        }
      });

      if (error) throw error;

      const predictions = data.predictions.map((pred: any) => ({
        college: pred.college.name,
        course: pred.college.courses[0] || 'MBBS',
        predictedCutoff: pred.prediction.predictedCutoffRank,
        confidence: pred.prediction.admissionProbability / 100,
        factors: [pred.reasoning]
      }));

      this.setCache(cacheKey, predictions);
      return predictions;
    } catch (error) {
      console.error('Cutoff prediction failed:', error);
      return this.getFallbackCutoffs(examType, category);
    }
  }

  // AI-powered Safety & Cultural Scoring with backend integration
  async calculateSafetyScore(
    collegeName: string,
    location: string,
    gender?: 'male' | 'female'
  ): Promise<SafetyScore> {
    try {
      const cacheKey = `safety-${collegeName}-${gender || 'all'}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const { data, error } = await supabase.functions.invoke('safety-cultural-analyzer', {
        body: { 
          college: collegeName,
          location: location,
          state: location, // Simplified for now
          gender,
          culturalNeeds: gender === 'female' ? ['safety-priority'] : []
        }
      });

      if (error) throw error;

      const safetyScore: SafetyScore = {
        college: collegeName,
        location,
        overallSafety: data.safetyAnalysis.overallScore,
        genderSafety: data.safetyAnalysis.genderSafetyScore,
        culturalAcceptance: data.culturalAnalysis.overallScore,
        sources: data.safetyAnalysis.sources
      };

      this.setCache(cacheKey, safetyScore);
      return safetyScore;
    } catch (error) {
      console.error('Safety scoring failed:', error);
      return this.getFallbackSafetyScore(collegeName, location);
    }
  }

  // Enhanced Personalized Recommendations with full AI backend
  async getPersonalizedRecommendations(profile: any): Promise<any[]> {
    try {
      console.log('Getting AI-powered recommendations for:', profile);

      const { data, error } = await supabase.functions.invoke('ai-counselor-engine', {
        body: { 
          message: `I have ${profile.scoreValue} ${profile.scoreType} in ${profile.exam}, ${profile.category} category, from ${profile.state}. Show me college recommendations.`,
          studentProfile: profile,
          examType: profile.exam
        }
      });

      if (error) throw error;

      return data.recommendations || [];
    } catch (error) {
      console.error('AI recommendations failed:', error);
      return [];
    }
  }

  // Helper Methods
  private async assessExamDifficulty(examType: string, year: number): Promise<number> {
    // AI analysis of exam difficulty based on multiple factors
    return 0.7; // Placeholder
  }

  private async getEconomicIndicators(state: string): Promise<number> {
    // Economic trend analysis affecting college choices
    return 0.8; // Placeholder
  }

  private async getDemographicTrend(category: string, state: string): Promise<number> {
    // Demographic analysis for category-wise competition
    return 0.6; // Placeholder
  }

  private async batchCalculateSafety(profile: any): Promise<SafetyScore[]> {
    // Batch safety calculation for relevant colleges
    return []; // Placeholder
  }

  private assessFinancialFit(profile: any): number {
    const incomeMapping = { low: 0.3, middle: 0.6, high: 0.9 };
    return incomeMapping[profile.income as keyof typeof incomeMapping] || 0.5;
  }

  private assessCulturalFit(profile: any): number {
    if (profile.culturalNeeds?.includes('hijab-friendly')) {
      return 0.8; // Higher weight for cultural considerations
    }
    return 0.5;
  }

  private getFromCache(key: string) {
    const cached = this.dataCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any) {
    this.dataCache.set(key, { data, timestamp: Date.now() });
  }

  private getFallbackData(examType: string): LiveCounselingData {
    return {
      examType: examType as 'NEET' | 'JEE-MAIN',
      round: 1,
      seatMatrix: [],
      cutoffs: [],
      lastUpdated: new Date().toISOString()
    };
  }

  private getFallbackCutoffs(examType: string, category: string): CutoffPrediction[] {
    return [{
      college: 'Sample College',
      course: 'Sample Course',
      predictedCutoff: 500,
      confidence: 0.6,
      factors: ['Historical trend', 'Category adjustment']
    }];
  }

  private getFallbackSafetyScore(college: string, location: string): SafetyScore {
    return {
      college,
      location,
      overallSafety: 7.5,
      genderSafety: 7.0,
      culturalAcceptance: 8.0,
      sources: ['Fallback data']
    };
  }

  private estimateNormalization(examType: string, scoreType: string, value: number) {
    // Basic normalization logic
    return {
      normalizedScore: value,
      equivalentRank: Math.round(value * 100),
      confidence: 0.5
    };
  }
}

export const autonomousAI = new AutonomousAI();
