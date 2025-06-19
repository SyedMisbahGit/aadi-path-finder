import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface AssessmentData {
  examName: string;
  examYear: string;
  marks: string;
  totalMarks: string;
  category: string;
  gender: string;
  domicileState: string;
  preferredStates: string[];
  budgetRange: string;
  hostOrDay: string;
  religiousPractices: string;
  specialNeeds: string;
  collegeType: string;
  climatePreference: string;
  languagePreference: string;
  additionalInfo: string;
}

const STORAGE_KEY = 'college_counselor_assessment';
const RECOMMENDATIONS_KEY = 'college_counselor_recommendations';

export const useAssessment = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Save assessment to localStorage for stateless mode
  const saveAssessmentLocally = (data: AssessmentData, examType?: string) => {
    const assessmentWithId = {
      ...data,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    
    // Support multi-exam storage
    if (examType) {
      const existingData = localStorage.getItem(STORAGE_KEY);
      const multiExamData = existingData ? JSON.parse(existingData) : {};
      multiExamData[examType] = assessmentWithId;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(multiExamData));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assessmentWithId));
    }
    
    return assessmentWithId;
  };

  // Load assessment from localStorage
  const loadAssessmentFromLocal = (examType?: string) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    
    if (examType && data[examType]) {
      return data[examType];
    }
    
    // Return full data if no specific exam requested
    return data;
  };

  const saveAssessment = useMutation({
    mutationFn: async (data: AssessmentData) => {
      // Determine exam type for local storage
      const examType = data.examName === 'neet-ug' ? 'neet' : 
                      data.examName === 'jee-main' ? 'jeeMain' : 
                      data.examName === 'jee-advanced' ? 'jeeAdvanced' : 
                      'general';
      
      // Always save locally first for stateless mode
      const localAssessment = saveAssessmentLocally(data, examType);
      
      // If user is authenticated, also save to database
      if (user) {
        const assessmentData = {
          user_id: user.id,
          exam_name: data.examName as 'neet-ug' | 'jee-main' | 'jee-advanced',
          exam_year: parseInt(data.examYear),
          marks: parseInt(data.marks),
          total_marks: parseInt(data.totalMarks),
          category: data.category as 'general' | 'obc' | 'sc' | 'st' | 'ews' | 'pwd',
          gender: data.gender as 'male' | 'female' | 'other',
          domicile_state: data.domicileState,
          budget_range: data.budgetRange,
          accommodation_preference: data.hostOrDay,
          college_type_preference: data.collegeType,
          religious_practices: data.religiousPractices,
          special_needs: data.specialNeeds,
          climate_preference: data.climatePreference,
          language_preference: data.languagePreference,
          additional_info: data.additionalInfo,
        };

        const { data: result, error } = await supabase
          .from('student_assessments')
          .insert(assessmentData)
          .select()
          .single();

        if (error) throw error;
        return result;
      }
      
      return localAssessment;
    },
    onSuccess: () => {
      toast.success("Assessment saved successfully!");
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to save assessment: ${error.message}`);
    },
  });

  const getAssessments = useQuery({
    queryKey: ['assessments', user?.id],
    queryFn: async () => {
      // Try to load from database if user is authenticated
      if (user) {
        const { data, error } = await supabase
          .from('student_assessments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      }
      
      // Otherwise, load from localStorage
      const localAssessment = loadAssessmentFromLocal();
      return localAssessment ? [localAssessment] : [];
    },
    enabled: true, // Always enabled now for stateless mode
  });

  const clearLocalData = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(RECOMMENDATIONS_KEY);
    queryClient.invalidateQueries({ queryKey: ['assessments'] });
    toast.success("Session data cleared!");
  };

  return {
    saveAssessment,
    getAssessments,
    clearLocalData,
    loadAssessmentFromLocal,
  };
};
