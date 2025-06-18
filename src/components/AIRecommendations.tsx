
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, DollarSign, Shield, Users, BookOpen, Star } from "lucide-react";

interface AIRecommendationsProps {
  assessmentId: string;
}

export const AIRecommendations = ({ assessmentId }: AIRecommendationsProps) => {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['ai-recommendations', assessmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_recommendations')
        .select(`
          *,
          colleges (
            name,
            location,
            state,
            type,
            courses,
            annual_fees_min,
            annual_fees_max,
            safety_score,
            cultural_diversity_score,
            infrastructure_score,
            placement_score,
            scholarship_available,
            hostel_available
          )
        `)
        .eq('assessment_id', assessmentId)
        .order('recommendation_rank');

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!recommendations?.length) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No recommendations available yet. The AI is analyzing your profile...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">🎯 Your Personalized College Recommendations</h2>
        <p className="text-gray-600 mt-2">AI-powered suggestions tailored to your profile and preferences</p>
      </div>

      {recommendations.map((rec, index) => (
        <Card key={rec.id} className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    #{rec.recommendation_rank}
                  </span>
                  {rec.colleges?.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <MapPin className="w-4 h-4" />
                  {rec.colleges?.location}, {rec.colleges?.state}
                  <Badge variant="outline" className="ml-2">
                    {rec.colleges?.type}
                  </Badge>
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {rec.admission_probability}%
                </div>
                <div className="text-sm text-gray-500">Admission Probability</div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* AI Reasoning */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">🤖 AI Analysis</h4>
              <p className="text-blue-800 text-sm leading-relaxed">{rec.ai_reasoning}</p>
            </div>

            {/* Scores Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium">Safety</span>
                </div>
                <Progress value={rec.safety_rating * 10} className="mb-1" />
                <span className="text-sm text-gray-600">{rec.safety_rating}/10</span>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="font-medium">Cultural Fit</span>
                </div>
                <Progress value={rec.cultural_fit_score * 10} className="mb-1" />
                <span className="text-sm text-gray-600">{rec.cultural_fit_score}/10</span>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium">Financial</span>
                </div>
                <Progress value={rec.financial_feasibility * 10} className="mb-1" />
                <span className="text-sm text-gray-600">{rec.financial_feasibility}/10</span>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="font-medium">Overall</span>
                </div>
                <Progress value={rec.colleges?.placement_score * 10} className="mb-1" />
                <span className="text-sm text-gray-600">{rec.colleges?.placement_score}/10</span>
              </div>
            </div>

            <Separator />

            {/* Financial Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Cost Breakdown
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Annual Fees:</span>
                    <span>₹{rec.colleges?.annual_fees_min?.toLocaleString()} - ₹{rec.colleges?.annual_fees_max?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Total Cost:</span>
                    <span className="font-medium">₹{rec.total_cost_estimation?.toLocaleString()}</span>
                  </div>
                  {rec.predicted_cutoff && (
                    <div className="flex justify-between">
                      <span>Predicted Cutoff:</span>
                      <span className="font-medium">{rec.predicted_cutoff}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Available Courses
                </h4>
                <div className="flex flex-wrap gap-1">
                  {rec.colleges?.courses?.map((course, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {course}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Benefits and Risk Factors */}
            {(rec.benefits?.length > 0 || rec.risk_factors?.length > 0) && (
              <>
                <Separator />
                <div className="grid md:grid-cols-2 gap-6">
                  {rec.benefits?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">✅ Key Benefits</h4>
                      <ul className="text-sm space-y-1">
                        {rec.benefits.map((benefit, idx) => (
                          <li key={idx} className="text-green-600">• {benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {rec.risk_factors?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-orange-700 mb-2">⚠️ Consider These</h4>
                      <ul className="text-sm space-y-1">
                        {rec.risk_factors.map((risk, idx) => (
                          <li key={idx} className="text-orange-600">• {risk}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Scholarship Information */}
            {rec.scholarship_eligibility?.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold text-purple-700 mb-2">🎓 Scholarship Opportunities</h4>
                  <div className="flex flex-wrap gap-2">
                    {rec.scholarship_eligibility.map((scholarship, idx) => (
                      <Badge key={idx} variant="outline" className="text-purple-600 border-purple-300">
                        {scholarship}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
