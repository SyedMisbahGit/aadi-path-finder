
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
  budgetRange: string;
  hostOrDay: string;
  religiousPractices: string;
  specialNeeds: string;
  collegeType: string;
  climatePreference: string;
  languagePreference: string;
  additionalInfo: string;
}

export const useAssessment = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const saveAssessment = useMutation({
    mutationFn: async (data: AssessmentData) => {
      if (!user) throw new Error("User not authenticated");

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
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('student_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return {
    saveAssessment,
    getAssessments,
  };
};
