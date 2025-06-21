
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

// Advanced ML prediction models (simplified for demo)
class MLPredictionEngine {
  
  // Normalize scores across different years and exam sessions
  async normalizeScore(scoreType: string, scoreValue: number, examType: string, year: number = 2025): Promise<any> {
    try {
      console.log(`Normalizing ${scoreType}: ${scoreValue} for ${examType} ${year}`);
      
      // Get historical normalization data
      const { data: historicalData } = await supabase
        .from('historical_cutoffs')
        .select('exam_year, opening_marks, closing_marks, opening_rank, closing_rank')
        .eq('exam_name', examType.toLowerCase().replace('-', '_') as any)
        .gte('exam_year', year - 3)
        .order('exam_year', { ascending: false });
      
      let normalizedScore = scoreValue;
      let equivalentRank = null;
      let equivalentPercentile = null;
      let confidence = 0.8;
      
      if (scoreType === 'percentile') {
        // Convert percentile to approximate rank
        const totalCandidates = examType === 'NEET' ? 1800000 : 1200000; // Approximate
        equivalentRank = Math.round((100 - scoreValue) * totalCandidates / 100);
        
        // Convert percentile to approximate marks (simplified model)
        if (examType === 'NEET') {
          normalizedScore = this.percentileToMarks(scoreValue, 'NEET');
        } else {
          normalizedScore = this.percentileToMarks(scoreValue, 'JEE-MAIN');
        }
        
      } else if (scoreType === 'marks') {
        // Convert marks to percentile and rank
        if (examType === 'NEET') {
          equivalentPercentile = this.marksToPercentile(scoreValue, 'NEET');
        } else {
          equivalentPercentile = this.marksToPercentile(scoreValue, 'JEE-MAIN');
        }
        
        const totalCandidates = examType === 'NEET' ? 1800000 : 1200000;
        equivalentRank = Math.round((100 - equivalentPercentile) * totalCandidates / 100);
        
      } else if (scoreType === 'rank') {
        // Convert rank to percentile and approximate marks
        const totalCandidates = examType === 'NEET' ? 1800000 : 1200000;
        equivalentPercentile = 100 - (scoreValue / totalCandidates * 100);
        
        if (examType === 'NEET') {
          normalizedScore = this.percentileToMarks(equivalentPercentile, 'NEET');
        } else {
          normalizedScore = this.percentileToMarks(equivalentPercentile, 'JEE-MAIN');
        }
      }
      
      // Apply year-over-year difficulty adjustments
      const difficultyAdjustment = this.calculateDifficultyAdjustment(historicalData, year);
      normalizedScore = Math.round(normalizedScore + difficultyAdjustment);
      
      return {
        originalScore: scoreValue,
        originalType: scoreType,
        normalizedMarks: normalizedScore,
        equivalentRank: equivalentRank,
        equivalentPercentile: equivalentPercentile,
        difficultyAdjustment: difficultyAdjustment,
        confidence: confidence,
        year: year,
        examType: examType
      };
      
    } catch (error) {
      console.error('Score normalization error:', error);
      return {
        originalScore: scoreValue,
        normalizedMarks: scoreValue,
        confidence: 0.3,
        error: error.message
      };
    }
  }
  
  // Advanced cutoff prediction using historical trends
  async predictCutoffs(examType: string, category: string, state: string, year: number = 2025): Promise<any[]> {
    try {
      console.log(`Predicting cutoffs for ${examType} ${category} in ${state} for ${year}`);
      
      // Get historical cutoff data
      const { data: historicalCutoffs } = await supabase
        .from('historical_cutoffs')
        .select(`
          *,
          colleges!inner(name, location, state, type, safety_score, cultural_diversity_score)
        `)
        .eq('exam_name', examType.toLowerCase().replace('-', '_') as any)
        .eq('category', category)
        .gte('exam_year', year - 5)
        .order('exam_year', { ascending: false })
        .limit(200);
      
      if (!historicalCutoffs || historicalCutoffs.length === 0) {
        return [];
      }
      
      const predictions = [];
      
      // Group by college for trend analysis
      const collegeGroups = this.groupBy(historicalCutoffs, 'college_id');
      
      for (const [collegeId, cutoffs] of Object.entries(collegeGroups)) {
        const college = cutoffs[0].colleges;
        
        // Skip if not in target state (unless it's a national institution)
        if (state !== 'all' && !college.location.toLowerCase().includes(state.toLowerCase()) && 
            !college.name.toLowerCase().includes('aiims') && 
            !college.name.toLowerCase().includes('iit') &&
            !college.name.toLowerCase().includes('nit')) {
          continue;
        }
        
        // Calculate trend-based prediction
        const prediction = this.calculateTrendPrediction(cutoffs as any[], year);
        
        predictions.push({
          college: {
            id: collegeId,
            name: college.name,
            location: college.location,
            state: college.state,
            type: college.type,
            safetyScore: college.safety_score || 7.0
          },
          prediction: {
            predictedCutoffRank: prediction.predictedRank,
            predictedCutoffMarks: prediction.predictedMarks,
            trend: prediction.trend,
            confidence: prediction.confidence,
            historicalData: prediction.historicalYears
          },
          reasoning: `Based on ${prediction.historicalYears} years of data. ${prediction.trend} trend observed. Predicted closing rank: ${prediction.predictedRank}`
        });
      }
      
      // Sort by predicted cutoff (best opportunities first)
      return predictions.sort((a, b) => b.prediction.predictedCutoffRank - a.prediction.predictedCutoffRank);
      
    } catch (error) {
      console.error('Cutoff prediction error:', error);
      return [];
    }
  }
  
  // Admission probability modeling
  async calculateAdmissionProbability(studentScore: any, collegeData: any): Promise<number> {
    try {
      const { normalizedMarks, equivalentRank, examType } = studentScore;
      const { predictedCutoffRank, predictedCutoffMarks } = collegeData.prediction;
      
      let probability = 0;
      
      if (equivalentRank && predictedCutoffRank) {
        // Rank-based probability
        if (equivalentRank <= predictedCutoffRank) {
          probability = Math.min(95, 70 + (predictedCutoffRank - equivalentRank) / predictedCutoffRank * 25);
        } else {
          probability = Math.max(5, 70 - (equivalentRank - predictedCutoffRank) / predictedCutoffRank * 65);
        }
      } else if (normalizedMarks && predictedCutoffMarks) {
        // Marks-based probability
        if (normalizedMarks >= predictedCutoffMarks) {
          probability = Math.min(95, 70 + (normalizedMarks - predictedCutoffMarks) / predictedCutoffMarks * 25);
        } else {
          probability = Math.max(5, 70 - (predictedCutoffMarks - normalizedMarks) / predictedCutoffMarks * 65);
        }
      }
      
      // Apply various adjustments
      probability = this.applyProbabilityAdjustments(probability, studentScore, collegeData);
      
      return Math.round(Math.max(1, Math.min(99, probability)));
      
    } catch (error) {
      console.error('Probability calculation error:', error);
      return 50; // Default probability
    }
  }
  
  // Helper methods
  private percentileToMarks(percentile: number, examType: string): number {
    if (examType === 'NEET') {
      // NEET scoring model (simplified)
      if (percentile >= 99) return 680 + (percentile - 99) * 40;
      if (percentile >= 95) return 600 + (percentile - 95) * 20;
      if (percentile >= 85) return 500 + (percentile - 85) * 10;
      if (percentile >= 50) return 350 + (percentile - 50) * 4.3;
      return Math.max(0, percentile * 7);
    } else {
      // JEE Main scoring model (simplified)
      if (percentile >= 99) return 280 + (percentile - 99) * 20;
      if (percentile >= 95) return 220 + (percentile - 95) * 15;
      if (percentile >= 85) return 150 + (percentile - 85) * 7;
      if (percentile >= 50) return 50 + (percentile - 50) * 2.9;
      return Math.max(0, percentile * 1);
    }
  }
  
  private marksToPercentile(marks: number, examType: string): number {
    if (examType === 'NEET') {
      if (marks >= 720) return 99.9;
      if (marks >= 680) return 99 + (marks - 680) / 40;
      if (marks >= 600) return 95 + (marks - 600) / 80 * 4;
      if (marks >= 500) return 85 + (marks - 500) / 100 * 10;
      if (marks >= 350) return 50 + (marks - 350) / 150 * 35;
      return Math.max(0, marks / 350 * 50);
    } else {
      if (marks >= 300) return 99.9;
      if (marks >= 280) return 99 + (marks - 280) / 20;
      if (marks >= 220) return 95 + (marks - 220) / 60 * 4;
      if (marks >= 150) return 85 + (marks - 150) / 70 * 10;
      if (marks >= 50) return 50 + (marks - 50) / 100 * 35;
      return Math.max(0, marks / 50 * 50);
    }
  }
  
  private calculateDifficultyAdjustment(historicalData: any[], targetYear: number): number {
    if (!historicalData || historicalData.length < 2) return 0;
    
    // Calculate year-over-year trend in cutoffs
    let totalAdjustment = 0;
    let count = 0;
    
    for (let i = 1; i < historicalData.length; i++) {
      const current = historicalData[i-1];
      const previous = historicalData[i];
      
      if (current.closing_marks && previous.closing_marks) {
        const yearDiff = current.exam_year - previous.exam_year;
        if (yearDiff === 1) { // Consecutive years
          const marksDiff = current.closing_marks - previous.closing_marks;
          totalAdjustment += marksDiff;
          count++;
        }
      }
    }
    
    const avgYearlyChange = count > 0 ? totalAdjustment / count : 0;
    const yearsFromLatest = targetYear - (historicalData[0]?.exam_year || targetYear);
    
    return avgYearlyChange * yearsFromLatest;
  }
  
  private calculateTrendPrediction(cutoffs: any[], targetYear: number): any {
    const sortedCutoffs = cutoffs.sort((a, b) => b.exam_year - a.exam_year);
    const latestYear = sortedCutoffs[0]?.exam_year || targetYear - 1;
    
    if (sortedCutoffs.length === 0) {
      return { predictedRank: 50000, predictedMarks: 400, trend: 'stable', confidence: 0.3, historicalYears: 0 };
    }
    
    // Simple linear trend calculation
    let rankTrend = 0;
    let marksTrend = 0;
    let trendCount = 0;
    
    for (let i = 1; i < Math.min(sortedCutoffs.length, 4); i++) {
      const current = sortedCutoffs[i-1];
      const previous = sortedCutoffs[i];
      
      if (current.closing_rank && previous.closing_rank) {
        rankTrend += (current.closing_rank - previous.closing_rank);
        trendCount++;
      }
      
      if (current.closing_marks && previous.closing_marks) {
        marksTrend += (current.closing_marks - previous.closing_marks);
      }
    }
    
    const avgRankChange = trendCount > 0 ? rankTrend / trendCount : 0;
    const avgMarksChange = trendCount > 0 ? marksTrend / trendCount : 0;
    
    const latest = sortedCutoffs[0];
    const yearsToProject = targetYear - latestYear;
    
    const predictedRank = (latest.closing_rank || 50000) + (avgRankChange * yearsToProject);
    const predictedMarks = (latest.closing_marks || 400) + (avgMarksChange * yearsToProject);
    
    const trendDirection = avgRankChange > 100 ? 'increasing' : avgRankChange < -100 ? 'decreasing' : 'stable';
    const confidence = Math.max(0.4, Math.min(0.9, 0.8 - (yearsToProject * 0.1)));
    
    return {
      predictedRank: Math.round(Math.max(1, predictedRank)),
      predictedMarks: Math.round(Math.max(0, predictedMarks)),
      trend: trendDirection,
      confidence: confidence,
      historicalYears: sortedCutoffs.length
    };
  }
  
  private applyProbabilityAdjustments(baseProbability: number, studentScore: any, collegeData: any): number {
    let adjustedProbability = baseProbability;
    
    // State quota adjustments
    if (studentScore.hasStateQuota) {
      adjustedProbability += 10;
    }
    
    // Category adjustments
    if (studentScore.category !== 'general') {
      adjustedProbability += 5;
    }
    
    // College type adjustments
    if (collegeData.college.type === 'private') {
      adjustedProbability += 15; // Private colleges typically have more seats
    }
    
    // Trend adjustments
    if (collegeData.prediction.trend === 'increasing') {
      adjustedProbability += 5; // Easier to get in if cutoffs are rising (more seats/lower competition)
    } else if (collegeData.prediction.trend === 'decreasing') {
      adjustedProbability -= 5;
    }
    
    return adjustedProbability;
  }
  
  private groupBy(array: any[], key: string): { [key: string]: any[] } {
    return array.reduce((result, item) => {
      const group = item[key];
      if (!result[group]) {
        result[group] = [];
      }
      result[group].push(item);
      return result;
    }, {});
  }
}

const mlEngine = new MLPredictionEngine();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      examType, 
      scoreType, 
      scoreValue, 
      category, 
      state = 'all',
      year = 2025 
    } = await req.json();
    
    console.log(`ML Prediction for ${examType}: ${scoreValue} ${scoreType}, ${category} category`);
    
    // Step 1: Normalize the student's score
    const normalizedScore = await mlEngine.normalizeScore(scoreType, scoreValue, examType, year);
    
    // Step 2: Predict cutoffs for relevant colleges
    const cutoffPredictions = await mlEngine.predictCutoffs(examType, category, state, year);
    
    // Step 3: Calculate admission probabilities
    const predictions = [];
    for (const collegeData of cutoffPredictions.slice(0, 50)) { // Limit to top 50
      const admissionProbability = await mlEngine.calculateAdmissionProbability(normalizedScore, collegeData);
      
      predictions.push({
        ...collegeData,
        prediction: {
          ...collegeData.prediction,
          admissionProbability: admissionProbability
        }
      });
    }
    
    // Sort by admission probability
    const sortedPredictions = predictions.sort((a, b) => b.prediction.admissionProbability - a.prediction.admissionProbability);
    
    return new Response(JSON.stringify({
      success: true,
      studentScore: normalizedScore,
      predictions: sortedPredictions,
      summary: {
        totalColleges: sortedPredictions.length,
        highProbability: sortedPredictions.filter(p => p.prediction.admissionProbability >= 70).length,
        moderateProbability: sortedPredictions.filter(p => p.prediction.admissionProbability >= 40 && p.prediction.admissionProbability < 70).length,
        lowProbability: sortedPredictions.filter(p => p.prediction.admissionProbability < 40).length
      },
      metadata: {
        examType,
        year,
        category,
        state,
        processingTime: Date.now(),
        modelVersion: '2.0'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('ML Prediction Engine error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      fallback: "Machine learning prediction temporarily unavailable. Using basic estimation."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
