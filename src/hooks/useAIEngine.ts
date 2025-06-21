
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AIEngineConfig {
  language?: string;
  examType?: string;
  enableRealTimeData?: boolean;
}

export const useAIEngine = (config: AIEngineConfig = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiInsights, setAIInsights] = useState<any>(null);

  const processWithAI = useCallback(async (message: string, studentProfile: any) => {
    setIsProcessing(true);
    
    try {
      console.log('Processing with AI Engine:', { message, studentProfile });

      // Call the enhanced AI counselor engine
      const { data, error } = await supabase.functions.invoke('ai-counselor-engine', {
        body: {
          message,
          studentProfile,
          language: config.language || 'en',
          examType: config.examType || studentProfile.exam || 'NEET'
        }
      });

      if (error) {
        console.error('AI Engine error:', error);
        throw error;
      }

      // Update AI insights
      setAIInsights({
        confidence: data.extractedData.confidence,
        predictions: data.predictions || [],
        reasoning: data.extractedData.reasoning || [],
        metadata: data.metadata
      });

      return {
        response: data.response,
        extractedData: data.extractedData,
        updatedProfile: data.updatedProfile,
        predictions: data.predictions,
        confidence: data.extractedData.confidence
      };

    } catch (error) {
      console.error('AI processing error:', error);
      toast.error('AI processing failed. Using fallback analysis.');
      
      return {
        response: "I'm having trouble with advanced analysis right now. Could you please provide more specific details about your exam scores and preferences?",
        extractedData: { confidence: 0.3, reasoning: ['Basic processing only'] },
        error: error.message
      };
    } finally {
      setIsProcessing(false);
    }
  }, [config]);

  const getSafetyAnalysis = useCallback(async (college: string, location: string, gender?: string, culturalNeeds: string[] = []) => {
    try {
      const { data, error } = await supabase.functions.invoke('safety-cultural-analyzer', {
        body: {
          college,
          location,
          state: location, // Simplified
          gender,
          culturalNeeds
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Safety analysis error:', error);
      return null;
    }
  }, []);

  const getMLPredictions = useCallback(async (scoreData: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('ml-prediction-engine', {
        body: scoreData
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('ML prediction error:', error);
      return null;
    }
  }, []);

  const triggerDataCrawl = useCallback(async (examType: string, sources: string[] = ['all']) => {
    try {
      const { data, error } = await supabase.functions.invoke('autonomous-data-crawler', {
        body: {
          examType,
          sources,
          year: 2025
        }
      });

      if (error) throw error;
      
      toast.success(`Data crawling initiated for ${examType}. ${data.summary.successfulCrawls} sources processed.`);
      return data;
    } catch (error) {
      console.error('Data crawling error:', error);
      toast.error('Failed to update live data.');
      return null;
    }
  }, []);

  return {
    isProcessing,
    aiInsights,
    processWithAI,
    getSafetyAnalysis,
    getMLPredictions,
    triggerDataCrawl
  };
};
