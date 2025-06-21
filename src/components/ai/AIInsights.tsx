
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, Shield, Users } from 'lucide-react';

interface AIInsightsProps {
  predictions: any[];
  safetyScores: any[];
  culturalFit: any;
  confidence: number;
}

export const AIInsights: React.FC<AIInsightsProps> = ({
  predictions,
  safetyScores,
  culturalFit,
  confidence
}) => {
  const highProbabilityColleges = predictions.filter(p => p.prediction?.admissionProbability >= 70);
  const averageSafety = safetyScores.length > 0 
    ? safetyScores.reduce((sum, s) => sum + s.score, 0) / safetyScores.length 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* AI Confidence */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Brain className="w-4 h-4 text-blue-600" />
            AI Confidence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {(confidence * 100).toFixed(0)}%
          </div>
          <Progress value={confidence * 100} className="mt-2" />
          <p className="text-xs text-gray-600 mt-1">
            Analysis reliability
          </p>
        </CardContent>
      </Card>

      {/* High Probability Matches */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            Strong Matches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {highProbabilityColleges.length}
          </div>
          <p className="text-xs text-gray-600 mt-1">
            High admission probability
          </p>
        </CardContent>
      </Card>

      {/* Safety Score */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Shield className="w-4 h-4 text-yellow-600" />
            Avg Safety Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {averageSafety.toFixed(1)}/10
          </div>
          <Progress value={averageSafety * 10} className="mt-2" />
          <p className="text-xs text-gray-600 mt-1">
            Campus & area safety
          </p>
        </CardContent>
      </Card>

      {/* Cultural Fit */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" />
            Cultural Fit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {((culturalFit?.overallScore || 0.7) * 10).toFixed(1)}/10
          </div>
          <Progress value={(culturalFit?.overallScore || 0.7) * 100} className="mt-2" />
          <p className="text-xs text-gray-600 mt-1">
            Cultural acceptance
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
